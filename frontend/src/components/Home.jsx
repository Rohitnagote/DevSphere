import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";
import Reveal from "./Reveal.jsx";

const skills = [
  "React", "Node.js", "MongoDB", "Python", "Java", "TypeScript",
  "Django", "Go", "Flutter", "AWS", "Docker", "Next.js",
];

const tile =
  "h-full rounded-[26px] border border-base-300 bg-base-100 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl";

const Heart = ({ size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className="fill-white">
    <path d="M12 21C5 16.500 2 13 2 9a5 5 0 0 1 10-1.500A5 5 0 0 1 22 9c0 4-3 7.500-10 12z" />
  </svg>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-base-200 overflow-x-hidden">
      {/* Floating navbar */}
      <nav className="sticky top-3 z-20 mx-3 md:mx-auto mt-3 max-w-3xl flex items-center justify-between rounded-full border border-base-300 bg-white/80 backdrop-blur-md pl-5 pr-2 py-2 shadow-lg">
        <div className="flex items-center gap-2 font-display text-xl font-extrabold">
          <svg viewBox="0 0 28 28" className="w-6 h-6" aria-hidden="true">
            <circle cx="14" cy="14" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="14" cy="14" r="4.5" className="fill-primary" />
            <g className="logo-dot">
              <circle cx="23" cy="8" r="2.6" className="fill-secondary" />
            </g>
          </svg>
          DevSphere
        </div>
        <div className="flex items-center gap-1 text-sm">
          <a href="#how" className="hidden md:inline px-3 py-2 opacity-70">How it works</a>
          <a href="#skills" className="hidden md:inline px-3 py-2 opacity-70">Skills</a>
          <Link to="/login" className="btn btn-sm btn-outline rounded-full">Log in</Link>
          <Link to="/signup" className="btn btn-sm btn-primary rounded-full">Sign up</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative text-center px-5 pt-16 pb-10">
        <div className="pointer-events-none absolute -left-28 top-5 h-[420px] w-[420px] rounded-full bg-[#C9C3F5] opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-36 h-[360px] w-[360px] rounded-full bg-[#FFD3DA] opacity-60 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-4 py-1.5 text-sm mb-5">
            <span className="status-dot w-2 h-2 rounded-full bg-success"></span>
            Now matching developers by stack
          </div>

          <h1 className="font-display font-extrabold leading-[0.96] tracking-tight text-5xl sm:text-7xl md:text-8xl max-w-4xl mx-auto mb-5">
            Find your{" "}
            <span className="relative text-primary whitespace-nowrap">
              people
              <svg viewBox="0 0 200 14" preserveAspectRatio="none" className="absolute left-0 -bottom-2 w-full h-3" aria-hidden="true">
                <path d="M2 9c30-8 60-8 96-3s70 4 100-2" fill="none" stroke="#FF6B81" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>{" "}
            in code
          </h1>

          <p className="text-lg opacity-70 max-w-lg mx-auto mb-7">
            Swipe through developers who share your stack. Send an interest, get
            a match, and start building together.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/signup" className="btn btn-primary btn-lg rounded-full">Get started, it's free</Link>
            <Link to="/login" className="btn btn-outline btn-lg rounded-full">I have an account</Link>
          </div>

          <div className="flex items-center justify-center gap-3 mt-6 text-sm opacity-70">
            <div className="flex" aria-hidden="true">
              {[2, 4, 3, 5].map((v, i) => (
                <Avatar key={v} variant={v} className={`w-9 h-9 border-2 border-base-200 ${i > 0 ? "-ml-2.5" : ""}`} />
              ))}
            </div>
            Join developers building together
          </div>
        </div>
      </section>

      {/* Scrolling skills strip */}
      <div id="skills" className="overflow-hidden border-y border-base-300 bg-base-100 py-3.5 my-5 marquee-mask" aria-hidden="true">
        <div className="marquee-track">
          {[...skills, ...skills].map((s, i) => (
            <span key={i} className="whitespace-nowrap rounded-full bg-primary/10 text-primary font-medium text-sm px-4 py-1.5">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Bento grid */}
      <section id="how" className="max-w-6xl mx-auto px-5 pt-6 pb-12 grid gap-4 md:grid-cols-4 md:auto-rows-[minmax(150px,auto)]">
        <Reveal className="md:col-span-2 md:row-span-2">
          <div className={`${tile} bg-primary/10! flex flex-col`}>
            <h3 className="font-display text-2xl font-extrabold mb-1">Swipe, don't scroll</h3>
            <p className="opacity-70">One developer at a time. Interested or Ignore.</p>
            <div className="relative flex-1 min-h-[250px] flex items-center justify-center" aria-hidden="true">
              <div className="pc pc-back">
                <Avatar variant={3} className="w-16 h-16 mx-auto mb-1.5" />
                <p className="font-display text-lg font-extrabold">Neha Rao</p>
                <p className="text-xs opacity-70">Python, Django</p>
              </div>
              <div className="pc pc-top">
                <Avatar variant={1} className="w-16 h-16 mx-auto mb-1.5" />
                <p className="font-display text-lg font-extrabold">Aman Sharma</p>
                <p className="text-xs opacity-70 mb-2">Full stack, loves Node.js</p>
                <span className="badge badge-soft badge-primary mr-1">React</span>
                <span className="badge badge-soft badge-primary">Node.js</span>
              </div>
              <div className="heart-pop"><Heart /></div>
            </div>
          </div>
        </Reveal>

        <Reveal className="md:col-span-2" delay={80}>
          <div className={tile}>
            <h3 className="font-display text-2xl font-extrabold mb-1">It's a match</h3>
            <p className="opacity-70">When interest is returned, you become connections.</p>
            <div className="flex items-center mt-4" aria-hidden="true">
              <Avatar variant={2} className="w-14 h-14 border-[3px] border-base-100" />
              <span className="beat -ml-2.5 z-10 grid place-items-center w-9 h-9 rounded-full bg-secondary border-[3px] border-base-100">
                <Heart size={16} />
              </span>
              <Avatar variant={5} className="-ml-2.5 w-14 h-14 border-[3px] border-base-100" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className={tile}>
            <h3 className="font-display text-2xl font-extrabold mb-1">Stack first</h3>
            <p className="opacity-70 mb-3">See skills before anything else.</p>
            <span className="badge badge-soft badge-primary mr-1">React</span>
            <span className="badge badge-soft badge-primary mr-1">Go</span>
            <span className="badge badge-soft badge-primary">AWS</span>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div className={`${tile} bg-primary! border-primary! text-white`}>
            <p className="font-display text-5xl font-extrabold tracking-tight">1:1</p>
            <p className="opacity-80">Real connections, no endless feed.</p>
          </div>
        </Reveal>

        <Reveal className="md:col-span-4">
          <div className={`${tile} bg-neutral! border-neutral! text-neutral-content flex flex-wrap items-center justify-between gap-4 p-8!`}>
            <h3 className="font-display text-3xl font-extrabold max-w-xl">
              Ready to meet your next collaborator?
            </h3>
            <Link to="/signup" className="btn btn-lg rounded-full bg-white text-neutral border-white">
              Create your profile
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Home;