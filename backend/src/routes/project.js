const express = require('express');
const mongoose = require('mongoose');
const { userAuth } = require('../middleware/auth.js');
const Project = require('../models/project.js');
const ProjectRequest = require('../models/projectRequest.js');

const projectRouter = express.Router();

// 1. Post a new project
projectRouter.post('/project/create', userAuth, async (req, res) => {
  try {
    const { title, description, skillsNeeded, maxMembers } = req.body;

    const project = new Project({
      title,
      description,
      skillsNeeded,
      maxMembers,
      ownerId: req.user._id,
      members: [req.user._id],
    });
    await project.save();

    res.status(201).send({ message: 'Project posted', data: project });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// 2. Open projects for the feed
projectRouter.get('/project/feed', userAuth, async (req, res) => {
  try {
    const me = req.user._id;

    const myRequests = await ProjectRequest.find({ userId: me });
    const rejectedIds = myRequests
      .filter((r) => r.status === 'rejected')
      .map((r) => r.projectId);
    const pendingIds = new Set(
      myRequests
        .filter((r) => r.status === 'pending')
        .map((r) => r.projectId.toString())
    );

    const projects = await Project.find({
      status: 'open',
      members: { $ne: me },
      _id: { $nin: rejectedIds },
      $expr: { $lt: [{ $size: '$members' }, '$maxMembers'] },
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('ownerId', 'firstname lastname')
      .populate('members', 'firstname lastname')
      .lean();

    const data = projects.map((p) => ({
      ...p,
      requested: pendingIds.has(p._id.toString()),
    }));

    res.send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// 3. Teams building now (projects with 2 or more members)
projectRouter.get('/project/teams', userAuth, async (req, res) => {
  try {
    const teams = await Project.find({
      status: { $ne: 'done' },
      $expr: { $gte: [{ $size: '$members' }, 2] },
    })
      .sort({ updatedAt: -1 })
      .limit(6)
      .select('title skillsNeeded members')
      .populate('members', 'firstname lastname');

    res.send(teams);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// 4. Join requests waiting for me, as a project owner
projectRouter.get('/project/requests/received', userAuth, async (req, res) => {
  try {
    const myProjects = await Project.find({ ownerId: req.user._id }).select('_id');
    const requests = await ProjectRequest.find({
      projectId: { $in: myProjects.map((p) => p._id) },
      status: 'pending',
    })
      .populate('userId', 'firstname lastname skills')
      .populate('projectId', 'title skillsNeeded');

    res.send({ message: 'Join requests', data: requests });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// 5. Ask to join a project
projectRouter.post('/project/:projectId/join', userAuth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const me = req.user._id;

    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).send({ message: 'Invalid project id' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).send({ message: 'Project not found' });
    }
    if (project.status !== 'open') {
      return res.status(400).send({ message: 'This project is not open' });
    }
    if (project.members.some((m) => m.equals(me))) {
      return res.status(400).send({ message: 'You are already on this team' });
    }
    if (project.members.length >= project.maxMembers) {
      return res.status(400).send({ message: 'This team is full' });
    }

    const existing = await ProjectRequest.findOne({ projectId, userId: me });
    if (existing) {
      return res
        .status(400)
        .send({ message: 'You have already requested to join' });
    }

    const request = await ProjectRequest.create({ projectId, userId: me });
    res.status(201).send({
      message: `Request sent to join ${project.title}`,
      data: request,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// 6. Owner accepts or rejects a request
projectRouter.post(
  '/project/request/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;

      if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).send({ message: 'Status not allowed' });
      }
      if (!mongoose.isValidObjectId(requestId)) {
        return res.status(400).send({ message: 'Invalid request id' });
      }

      const request = await ProjectRequest.findOne({
        _id: requestId,
        status: 'pending',
      });
      if (!request) {
        return res.status(404).send({ message: 'Request not found' });
      }

      const project = await Project.findById(request.projectId);
      if (!project || !project.ownerId.equals(req.user._id)) {
        return res
          .status(403)
          .send({ message: 'Only the project owner can review requests' });
      }

      if (status === 'accepted') {
        const updated = await Project.findOneAndUpdate(
          {
            _id: project._id,
            $expr: { $lt: [{ $size: '$members' }, '$maxMembers'] },
          },
          { $addToSet: { members: request.userId } },
          { new: true }
        );
        if (!updated) {
          return res.status(400).send({ message: 'The team is full' });
        }
      }

      request.status = status;
      await request.save();

      res.send({ message: `Request ${status}`, data: request });
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  }
);

module.exports = projectRouter;