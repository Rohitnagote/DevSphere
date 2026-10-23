import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";

const SKILLS = [
  "React", "Node.js", "MongoDB", "Python", "Java", "TypeScript",
  "Django", "Go", "Flutter", "AWS", "Docker", "Next.js",
];

const TEAMS = [
  { avatars: [1, 5], names: "Aman and Rahul", project: "Study Buddy", skills: "React, Node.js" },
  { avatars: [3, 4, 2], names: "Neha, Karan and Isha", project: "DevLog CLI", skills: "Go, Docker" },
  { avatars: [2], names: "Priya", project: "FitTrack", skills: "Flutter, Firebase", needs: true },
];

const Brand = () => (
  <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold">
    <svg viewBox="0 0 28 28" className="h-[26px] w-[26px]" aria-hidden="true">
      <circle cx="14" cy="14" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="14" cy="14" r="4.5" className="fill-primary" />
      <g className="hm-sat">
        <circle cx="23" cy="8" r="2.6" className="fill-secondary" />
      </g>
    </svg>
    DevSphere
  </Link>
);

const Face = ({ v, size = "h-8 w-8", border = "border-base-200" }) => (
  <Avatar variant={v} className={`${size} rounded-full border-2 ${border}`} />
);

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-base-200 px-4 text-base-content">
      {/* soft colour blobs */}
      <div className="pointer-events-none absolute -left-32 top-5 h-[420px] w-[420px] rounded-full bg-[#C9C3F5] opacity-55 blur-3xl"></div>
      <div className="pointer-events-none absolute -right-24 top-40 h-[360px] w-[360px] rounded-full bg-[#FFD3DA] opacity-55 blur-3xl"></div>

      {/* floating glass nav */}
      <nav
        className="sticky top-3 z-20 mx-auto mt-3.5 flex max-w-[780px] items-center justify-between rounded-full border border-base-300 bg-white/80 py-2 pl-5 pr-2 shadow-lg shadow-primary/10 backdrop-blur"
        aria-label="Main"
      >
        <Brand />
        <div className="flex items-center gap-1 text-sm">
          <a href="#how" className="hidden rounded-full px-3 py-2 opacity-70 hover:opacity-100 md:inline">
            How it works
          </a>
          <a href="#skills" className="hidden rounded-full px-3 py-2 opacity-70 hover:opacity-100 md:inline">
            Skills
          </a>
          <Link to="/login" className="btn btn-sm rounded-full">Log in</Link>
          <Link to="/signup" className="btn btn-sm btn-primary rounded-full">Sign up</Link>
        </div>
      </nav>

      <div className="relative mx-auto max-w-[1100px]">
        {/* hero */}
        <section className="grid items-center gap-6 pb-10 pt-12 lg:grid-cols-[1.05fr_.95fr] lg:pt-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-3.5 py-1.5 text-[13px] opacity-90">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success"></span>
              Projects are open for teammates
            </div>
            <h1 className="mb-5 font-display text-[clamp(42px,7.4vw,84px)] font-extrabold leading-[.96] tracking-tight">
              Find your people.{" "}
              <span className="relative whitespace-nowrap text-primary">
                Start
                <svg
                  viewBox="0 0 200 14"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-3 w-full"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9c30-8 60-8 96-3s70 4 100-2"
                    fill="none"
                    stroke="#FF6B81"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              the project.
            </h1>
            <p className="mb-6 max-w-[480px] text-lg opacity-70">
              Meet developers who share your stack, post the idea you want to
              build, and fill your team. Join someone else's project when it
              needs your skills.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/signup" className="btn btn-primary btn-lg rounded-full">
                Get started, it's free
              </Link>
              <Link to="/login" className="btn btn-lg rounded-full">
                I have an account
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm opacity-70">
              <div className="flex -space-x-2" aria-hidden="true">
                {[2, 4, 3, 5].map((v) => (
                  <Face key={v} v={v} size="h-8 w-8" />
                ))}
              </div>
              Developers are forming teams right now
            </div>
          </div>

          {/* floating project card demo */}
          <div className="relative min-h-[440px]" aria-hidden="true">
            <article className="hm-float absolute right-0 top-0 z-[1] w-[min(300px,80%)] rotate-[5deg] rounded-3xl border border-base-300 bg-base-100 p-4 shadow-xl shadow-primary/15">
              <span className="badge badge-success badge-soft">Looking for teammates</span>
              <h3 className="mb-1 mt-3 font-display text-2xl font-extrabold">DevLog CLI</h3>
              <p className="text-sm opacity-70">
                An open-source tool that turns git commits into a weekly changelog.
              </p>
              <div className="mt-3 flex gap-1">
                <span className="badge badge-primary badge-soft">Go</span>
                <span className="badge badge-primary badge-soft">Docker</span>
              </div>
            </article>

            <article className="absolute left-1/2 top-7 z-[2] w-[min(340px,92%)] -translate-x-[46%] rounded-3xl border border-base-300 bg-base-100 p-4 shadow-xl shadow-primary/15">
              <span className="badge badge-success badge-soft">Looking for teammates</span>
              <h3 className="mb-1 mt-3 font-display text-2xl font-extrabold">Study Buddy</h3>
              <p className="text-sm opacity-70">
                A web app that matches students into study groups by subject.
              </p>
              <p className="mb-1.5 mt-3.5 text-[11px] font-semibold uppercase tracking-wider opacity-60">
                Needs
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="badge badge-secondary badge-soft">React</span>
                <span className="badge badge-primary badge-soft">Node.js</span>
                <span className="badge badge-primary badge-soft">MongoDB</span>
              </div>
              <p className="mb-1.5 mt-3.5 text-[11px] font-semibold uppercase tracking-wider opacity-60">
                Team
              </p>
              <div className="flex items-center justify-between text-sm opacity-80">
                <div className="flex -space-x-2">
                  <Face v={1} size="h-[30px] w-[30px]" border="border-base-100" />
                  <Face v={2} size="h-[30px] w-[30px]" border="border-base-100" />
                </div>
                <span>2 of 4 spots filled</span>
              </div>
              <progress className="progress progress-primary my-3 w-full" value="50" max="100"></progress>
              <div className="btn btn-primary w-full rounded-full">Join this project</div>
            </article>

            <div className="hm-toast absolute bottom-5 left-0 z-[3] flex items-center gap-2.5 rounded-2xl bg-neutral py-2.5 pl-2.5 pr-4 text-sm text-neutral-content shadow-xl">
              <Face v={3} size="h-[30px] w-[30px]" border="border-transparent" />
              <span>
                <b>Neha</b> joined Study Buddy
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* skills strip */}
      <div
        id="skills"
        className="hm-fade relative -mx-4 mb-10 mt-2 overflow-hidden border-y border-base-300 bg-base-100 py-3.5"
        aria-hidden="true"
      >
        <div className="hm-track">
          {[...SKILLS, ...SKILLS].map((skill, i) => (
            <span
              key={i}
              className="whitespace-nowrap rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* how it works */}
      <div id="how" className="relative mx-auto max-w-[1100px] pb-12">
        <div className="mb-5">
          <h2 className="max-w-[620px] font-display text-[clamp(28px,4.4vw,44px)] font-extrabold leading-[1.02] tracking-tight">
            From a rough idea to a working team
          </h2>
          <p className="mt-2 max-w-[400px] text-[15px] opacity-70">
            Everything happens in DevSphere, from posting the idea to seeing
            who joined.
          </p>
        </div>

        <section className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {/* post */}
          <div className="rounded-[26px] border border-base-300 bg-primary/10 p-5 transition-transform hover:-translate-y-1 hover:shadow-lg sm:col-span-2 lg:row-span-2">
            <h3 className="font-display text-[22px] font-extrabold">Post your project idea</h3>
            <p className="text-[15px] opacity-70">
              Say what you're building and which skills you need. It takes a minute.
            </p>
            <div className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-4" aria-hidden="true">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider opacity-60">Project name</p>
              <div className="flex items-center rounded-lg border border-base-300 bg-base-200 px-3 py-2 font-medium">
                Study Buddy
                <span className="hm-caret ml-0.5 inline-block h-[18px] w-0.5 bg-primary"></span>
              </div>
              <p className="mb-1.5 mt-3.5 text-[11px] font-semibold uppercase tracking-wider opacity-60">Skills needed</p>
              <div className="flex flex-wrap gap-1">
                <span className="badge badge-primary badge-soft">React</span>
                <span className="badge badge-primary badge-soft">Node.js</span>
                <span className="badge badge-primary badge-soft">MongoDB</span>
                <span className="badge badge-outline border-dashed opacity-70">+ Add skill</span>
              </div>
              <p className="mb-1.5 mt-3.5 text-[11px] font-semibold uppercase tracking-wider opacity-60">Status</p>
              <span className="badge badge-success badge-soft">Looking for teammates</span>
              <div className="btn btn-primary mt-3.5 w-full rounded-full">Post project</div>
            </div>
          </div>

          {/* ranked */}
          <div className="rounded-[26px] border border-base-300 bg-base-100 p-5 transition-transform hover:-translate-y-1 hover:shadow-lg">
            <h3 className="font-display text-[22px] font-extrabold">Ranked by your stack</h3>
            <p className="text-[15px] opacity-70">Projects that need your skills come first.</p>
            <div className="mt-3.5 rounded-2xl border border-base-300 bg-base-200 p-3" aria-hidden="true">
              <span className="badge badge-secondary badge-soft">Needs your React</span>
              <b className="block font-display text-base">Study Buddy</b>
              <small className="text-[13px] opacity-70">3 of 3 skills match</small>
            </div>
          </div>

          {/* join */}
          <div className="rounded-[26px] border border-primary bg-primary p-5 text-primary-content transition-transform hover:-translate-y-1 hover:shadow-lg">
            <h3 className="font-display text-[22px] font-extrabold">Join in one tap</h3>
            <p className="text-[15px] opacity-80">The owner reviews your request.</p>
            <div className="relative mt-4 h-11 rounded-full bg-white text-[15px] font-semibold text-neutral" aria-hidden="true">
              <span className="hm-flip-a absolute inset-0 flex items-center justify-center">Request to join</span>
              <span className="hm-flip-b absolute inset-0 flex items-center justify-center gap-2 text-success">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
                Accepted
              </span>
            </div>
          </div>

          {/* orbit */}
          <div className="flex items-center gap-5 rounded-[26px] border border-base-300 bg-base-100 p-5 transition-transform hover:-translate-y-1 hover:shadow-lg max-sm:flex-col max-sm:items-start sm:col-span-2">
            <div className="relative h-[132px] w-[132px] shrink-0" aria-hidden="true">
              <div className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-base-300"></div>
              <div className="absolute inset-[30px] rounded-full border-[1.5px] border-dashed border-base-300"></div>
              <div className="hm-core absolute inset-[50px] rounded-full bg-primary"></div>
              <div className="hm-spin absolute inset-0">
                <i className="absolute -top-2 left-[calc(50%-8px)] h-4 w-4 rounded-full border-2 border-base-100 bg-secondary"></i>
              </div>
              <div className="hm-spin-rev absolute inset-[30px]">
                <i className="absolute -top-2 left-[calc(50%-8px)] h-4 w-4 rounded-full border-2 border-base-100 bg-success"></i>
              </div>
            </div>
            <div>
              <h3 className="font-display text-[22px] font-extrabold">Still find people first</h3>
              <p className="text-[15px] opacity-70">
                The orbit shows developers by shared skills. Send a request,
                then invite them to your project.
              </p>
            </div>
          </div>

          {/* teams on the feed */}
          <div className="rounded-[26px] border border-base-300 bg-base-100 p-5 transition-transform hover:-translate-y-1 hover:shadow-lg sm:col-span-2 lg:col-span-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-[22px] font-extrabold">Teams show up on the feed</h3>
              <span className="badge badge-success badge-soft">Live example</span>
            </div>
            <p className="text-[15px] opacity-70">
              See who is building what, and jump in when a team needs you.
            </p>
            <div className="mt-4 grid gap-3 lg:grid-cols-3" aria-hidden="true">
              {TEAMS.map((team) => (
                <div
                  key={team.project}
                  className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-200 p-3.5"
                >
                  <div className="flex -space-x-2">
                    {team.avatars.map((v) => (
                      <Face key={v} v={v} size="h-8 w-8" border="border-base-200" />
                    ))}
                  </div>
                  <p className="min-w-0 text-sm leading-snug">
                    <b>{team.names}</b>{" "}
                    {team.needs ? "needs a developer for" : "are building"} {team.project}
                    <small className="block text-xs opacity-60">{team.skills}</small>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* call to action */}
          <div className="flex flex-wrap items-center justify-between gap-5 rounded-[26px] border border-neutral bg-neutral p-8 text-neutral-content sm:col-span-2 lg:col-span-4">
            <h3 className="max-w-[580px] font-display text-[clamp(24px,4vw,36px)] font-extrabold leading-tight">
              Ready to start your next project with the right people?
            </h3>
            <Link to="/signup" className="btn btn-lg rounded-full border-white bg-white text-neutral">
              Create your profile
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;