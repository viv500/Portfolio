"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BoxId,
  ExtraPanelId,
  moments,
  Project,
  Role,
  Section,
  contactLinks,
  education,
  hackathons,
  impact,
  profile,
  projects,
  resumePath,
  roles,
  techGroups,
  wins,
} from "@/components/data";
import { CountUp } from "@/components/CardVisuals";
import { Diagram } from "@/components/ui/Diagrams";
import { MediaFrame, MediaGrid } from "@/components/ui/MediaFrame";
import { useAvailableImages, useResumeAvailable } from "@/lib/useAvailableMedia";
import { OrgLogo } from "@/components/ui/OrgLogo";
import { PlatformIcon, PlatformLink } from "@/components/ui/PlatformIcon";

const Tags = ({ items }: { items: string[] }) => (
  <ul className="flex flex-wrap gap-1.5">
    {items.map((item) => (
      <li key={item} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-white-100">
        {item}
      </li>
    ))}
  </ul>
);

const Heading = ({ title, intro }: { title: string; intro?: string }) => (
  <header className="mb-8">
    <h2 className="text-3xl font-bold text-white md:text-4xl">{title}</h2>
    {intro && <p className="mt-3 max-w-2xl text-base leading-relaxed text-white-100">{intro}</p>}
  </header>
);

const Sections = ({ sections }: { sections?: Section[] }) => (
  <>
    {sections?.map((section) => (
      <section key={section.heading}>
        <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-purple">{section.heading}</h4>
        {section.body && <p className="leading-relaxed text-white-100">{section.body}</p>}
        {section.bullets && (
          <ul className="space-y-2">
            {section.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3 leading-relaxed text-white-100">
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-purple" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    ))}
  </>
);

const Back = ({ href, label }: { href: string; label: string }) => (
  <a href={href} className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-purple">
    <span aria-hidden="true">←</span> {label}
  </a>
);

const reveal = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.05 * i, duration: 0.35 } }),
};

// Soft tints for the interest chips, ordered so neighbours never share a colour.
const PASTELS = [
  "border-rose-300/30 bg-rose-300/10 text-rose-200",
  "border-sky-300/30 bg-sky-300/10 text-sky-200",
  "border-amber-300/30 bg-amber-300/10 text-amber-200",
  "border-violet-300/30 bg-violet-300/10 text-violet-200",
  "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  "border-pink-300/30 bg-pink-300/10 text-pink-200",
  "border-teal-300/30 bg-teal-300/10 text-teal-200",
  "border-orange-300/30 bg-orange-300/10 text-orange-200",
  "border-indigo-300/30 bg-indigo-300/10 text-indigo-200",
  "border-lime-300/30 bg-lime-300/10 text-lime-200",
  "border-fuchsia-300/30 bg-fuchsia-300/10 text-fuchsia-200",
  "border-cyan-300/30 bg-cyan-300/10 text-cyan-200",
];

const AboutPanel = () => (
  <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_260px]">
    <div>
      <Heading title={profile.name} />
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-purple">What I do</h3>
      <div className="space-y-4 text-base leading-relaxed text-white-100">
        {profile.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <h3 className="mb-3 mt-10 text-sm font-semibold uppercase tracking-wider text-purple">Beyond the code</h3>
      <p className="mb-4 text-base leading-relaxed text-white-100">{profile.origin}</p>
      <ul className="flex flex-wrap gap-1.5">
        {profile.interests.map((interest, i) => (
          <li key={interest} className={`rounded-full border px-2.5 py-0.5 text-xs ${PASTELS[i % PASTELS.length]}`}>
            {interest}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-2">
        {contactLinks.map((link) => (
          <PlatformLink key={link.platform} link={link} />
        ))}
      </div>
    </div>
    <div className="space-y-4">
            <Image
        src={profile.photo}
        alt={profile.name}
        width={1050}
        height={1400}
        priority
        sizes="(min-width: 768px) 260px, 100vw"
        className="h-auto w-full rounded-2xl border border-white/10"
      />
    </div>
  </div>
);

const RoleCard = ({ role, index }: { role: Role; index: number }) => {
  const inner = (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <div className="flex items-center gap-3">
          <OrgLogo name={role.company} src={role.logo} className="h-9 w-9" />
          <h3 className="text-lg font-semibold text-white">{role.company}</h3>
        </div>
        <span className="font-mono text-xs text-purple">{role.dates}</span>
      </div>
      <p className="text-sm text-white/70">{role.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-white-100">{role.summary}</p>
      {role.stories[0]?.stat && <p className="mt-2 font-mono text-xs text-purple">{role.stories[0].stat}</p>}
    </>
  );
  return (
    <motion.li custom={index} variants={reveal} initial="hidden" animate="show">
      {role.stories.length ? (
        <a href={`#experience/${role.slug}`} className="block rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-purple/50 hover:bg-white/[0.04]">
          {inner}
          <span className="mt-2 inline-block text-xs text-white/50">Read the story →</span>
        </a>
      ) : (
        <div className="rounded-2xl border border-purple/40 bg-purple/[0.05] p-4">{inner}</div>
      )}
    </motion.li>
  );
};

const ExperienceList = () => (
  <>
    <Heading title="Experience" />
    <ol className="space-y-4">
      {roles.map((role, i) => (
        <RoleCard key={role.slug} role={role} index={i} />
      ))}
    </ol>
  </>
);

const RoleDetail = ({ role }: { role: Role }) => (
  <>
    <Back href="#experience" label="All experience" />
    <header className="mb-8">
      <div className="flex items-center gap-4">
        <OrgLogo name={role.company} src={role.logo} className="h-12 w-12 rounded-xl p-1.5" />
        <h2 className="text-3xl font-bold text-white md:text-4xl">{role.company}</h2>
      </div>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-white-100">{role.summary}</p>
    </header>
    <p className="-mt-5 mb-4 text-sm text-white/60">
      {role.title} · {role.dates} · {role.location}
    </p>
    <Tags items={role.stack} />
    {role.links && (
      <div className="mt-4 flex flex-wrap gap-2">
        {role.links.map((link) => (
          <PlatformLink key={link.href} link={link} />
        ))}
      </div>
    )}
    <div className="mt-10 space-y-12">
      {role.stories.map((story) => (
        <article key={story.title} className="space-y-5">
          <div>
            <h3 className="text-xl font-semibold text-white md:text-2xl">{story.title}</h3>
            {story.stat && <p className="mt-1 font-mono text-sm text-purple">{story.stat}</p>}
          </div>
          <p className="leading-relaxed text-white-100">{story.body}</p>
          {story.bullets && <Sections sections={[{ heading: "", bullets: story.bullets }]} />}
          {story.diagram && <Diagram name={story.diagram} />}
          <Sections sections={story.sections} />
          {story.media && <MediaGrid items={story.media} />}
        </article>
      ))}
    </div>
  </>
);

const ProjectTile = ({ project, base, index, win }: { project: Project; base: string; index: number; win?: boolean }) => (
  <motion.a
    custom={index}
    variants={reveal}
    initial="hidden"
    animate="show"
    href={`#${base}/${project.slug}`}
    className={`group relative flex flex-col rounded-2xl border p-5 transition hover:-translate-y-0.5 ${
      win ? "border-[1.5px] border-amber-300/50 bg-amber-300/[0.03] hover:border-amber-300/80" : "border-white/10 bg-white/[0.02] hover:border-purple/50 hover:bg-white/[0.04]"
    }`}
  >
    {win && (
      <svg viewBox="0 0 24 24" role="img" aria-label="Winner" className="absolute right-2.5 top-2.5 h-4 w-4 fill-amber-300">
        <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
      </svg>
    )}
    <div className={`mb-2 flex flex-wrap items-center gap-2 ${win ? "pr-6" : ""}`}>
      <span className="font-mono text-[11px] text-white/50">{project.context}</span>
      {project.badge && <span className="rounded-full bg-purple/15 px-2 py-0.5 text-[11px] text-purple">{project.badge}</span>}
    </div>
    <h3 className="text-lg font-semibold text-white">{project.title}</h3>
    <p className="mb-4 mt-1 flex-1 text-sm leading-relaxed text-white-100">{project.tagline}</p>
    <Tags items={project.stack.slice(0, 4)} />
  </motion.a>
);

const ProjectDetail = ({ project, base, backLabel }: { project: Project; base: string; backLabel: string }) => (
  <>
    <Back href={`#${base}`} label={backLabel} />
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <span className="font-mono text-xs text-white/50">{project.context}</span>
      {project.badge && <span className="rounded-full bg-purple/15 px-2.5 py-0.5 text-xs text-purple">{project.badge}</span>}
    </div>
    <Heading title={project.title} intro={project.tagline} />
    <div className="-mt-3 mb-8 space-y-4">
      <Tags items={project.stack} />
      <div className="flex flex-wrap gap-2">
        {project.links.map((link) => (
          <PlatformLink key={link.href} link={link} />
        ))}
      </div>
    </div>
    <div className="space-y-7">
      {project.diagram && <Diagram name={project.diagram} />}
      <Sections sections={project.sections} />
      <MediaGrid items={project.media} />
    </div>
  </>
);

const ProjectsList = () => (
  <>
    <Heading title="Projects" />
    <div className="grid gap-4 sm:grid-cols-2">
      <motion.a
        custom={0}
        variants={reveal}
        initial="hidden"
        animate="show"
        href="#experience/arctic-wolf"
        className="flex flex-col rounded-2xl border border-purple/40 bg-purple/[0.05] p-5 transition hover:-translate-y-0.5 hover:border-purple sm:col-span-2"
      >
        <span className="mb-2 font-mono text-[11px] text-purple">Flagship · Arctic Wolf · 3+ teams adopted</span>
        <h3 className="text-lg font-semibold text-white">AWS Dedicated Host Allocator</h3>
        <p className="mb-4 mt-1 text-sm leading-relaxed text-white-100">A Go CLI that keeps retrying AWS Mac host allocation in the background and notifies you when it succeeds. Internal tool, so there&apos;s no public repo.</p>
        <Tags items={["Go", "AWS SDK", "launchd", "AWS SSO"]} />
      </motion.a>
      {projects.map((project, i) => (
        <ProjectTile key={project.slug} project={project} base="projects" index={i + 1} />
      ))}
    </div>
  </>
);

const HackathonsList = () => {
  const winners = wins.map((slug) => hackathons.find((h) => h.slug === slug)!);
  const rest = hackathons.filter((h) => !wins.includes(h.slug));
  return (
    <>
      <Heading title="Hackathons" intro="Three wins across seven hackathons." />
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-purple">Wins</h3>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {winners.map((project, i) => (
          <ProjectTile key={project.slug} project={project} base="hackathons" index={i} win />
        ))}
      </div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-purple">Also built</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {rest.map((project, i) => (
          <ProjectTile key={project.slug} project={project} base="hackathons" index={i + 3} />
        ))}
      </div>
      <div className="mt-8">
        <PlatformLink link={contactLinks.find((l) => l.platform === "devpost")!} />
      </div>
    </>
  );
};

const ImpactPanel = () => (
  <>
    <Heading title="Impact" intro="Figures marked ~ are estimates." />
    <div className="grid gap-4 sm:grid-cols-2">
      {impact.map((stat, i) => (
        <motion.a
          key={stat.label}
          custom={i}
          variants={reveal}
          initial="hidden"
          animate="show"
          href={`#${stat.route}`}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-purple/50"
        >
          <div className="text-4xl font-bold text-white">
            <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
          </div>
          <div className="mt-1 font-semibold text-white">{stat.label}</div>
          <p className="mt-2 text-sm leading-relaxed text-white-100">{stat.detail}</p>
        </motion.a>
      ))}
    </div>
  </>
);

const StackPanel = () => (
  <>
    <Heading title="Tech Stack" />
    <div className="grid gap-4 sm:grid-cols-2">
      {techGroups.map((group, i) => (
        <motion.section key={group.name} custom={i} variants={reveal} initial="hidden" animate="show" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="font-semibold text-white">{group.name}</h3>
          <p className="mb-3 text-sm text-white/55">{group.note}</p>
          <Tags items={group.items} />
        </motion.section>
      ))}
    </div>
  </>
);

const EducationPanel = () => (
  <>
    <header className="mb-8">
      <div className="flex items-center gap-4">
        <OrgLogo name={education.school} src={education.logo} className="h-12 w-12 rounded-xl p-1.5" />
        <h2 className="text-3xl font-bold text-white md:text-4xl">{education.school}</h2>
      </div>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-white-100">{education.degree}</p>
    </header>
    <p className="-mt-5 mb-8 font-mono text-sm text-purple">{education.dates}</p>
    <div className="grid gap-4 sm:grid-cols-2">
      {education.courseGroups.map((group, i) => (
        <motion.section key={group.name} custom={i} variants={reveal} initial="hidden" animate="show" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="mb-3 font-semibold text-white">{group.name}</h3>
          <ul className="space-y-1.5 text-sm text-white-100">
            {group.courses.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        </motion.section>
      ))}
    </div>
    <h3 className="mb-2 mt-8 text-sm font-semibold uppercase tracking-wider text-purple">Activities</h3>
    <Tags items={education.activities} />
  </>
);

const ResumePanel = () => {
  const [available, setAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    fetch(resumePath, { method: "HEAD" })
      .then((res) => setAvailable(res.ok))
      .catch(() => setAvailable(false));
  }, []);

  return (
    <>
      <Heading title="Resume" />
      {available && (
        <>
          <a
            href={resumePath}
            download="Vivek-Jude-Manoj-Resume.pdf"
            className="mb-6 inline-flex items-center rounded-full bg-purple px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
          >
            Download PDF
          </a>
          <object data={resumePath} type="application/pdf" aria-label="Resume PDF" className="h-[75vh] w-full rounded-2xl border border-white/10" />
        </>
      )}
      {available === false &&
        (process.env.NODE_ENV === "production" ? (
          <p className="text-white-100">
            Email me at{" "}
            <a className="text-purple underline" href="mailto:vjmanoj@uwaterloo.ca">
              vjmanoj@uwaterloo.ca
            </a>{" "}
            and I&apos;ll send it over.
          </p>
        ) : (
          <div className="rounded-2xl border border-dashed border-purple/40 bg-purple/[0.04] p-8 text-center">
            <p className="font-mono text-[11px] uppercase tracking-widest text-purple">PDF placeholder</p>
            <code className="mt-2 block font-mono text-xs text-white/60">public/resume.pdf</code>
            <p className="mt-2 text-xs text-white/50">Consider removing your phone number first, since this will be public.</p>
          </div>
        ))}
    </>
  );
};

const MOMENT_SRCS = moments.map((m) => m.src);

const MomentsPanel = () => {
  const { available } = useAvailableImages(MOMENT_SRCS);
  const shown = process.env.NODE_ENV === "production" ? moments.filter((m) => available.includes(m.src)) : moments;
  return (
  <>
    <Heading title="Moments" intro="Presenting, hackathons and the people I've built with." />
    <div className="grid gap-5 sm:grid-cols-2">
      {shown.map((item) => (
        <figure key={item.src}>
          <MediaFrame item={item} />
          <figcaption className="mt-2 text-sm text-white-100">{item.alt}</figcaption>
        </figure>
      ))}
    </div>
  </>
  );
};

const ContactPanel = () => {
  const resume = useResumeAvailable(resumePath);
  const links = resume ? [...contactLinks, { label: "Resume (PDF)", href: resumePath, platform: "resume" as const }] : contactLinks;
  return (
  <>
    <Heading title="Contact" intro="Email is the best way to reach me." />
    <div className="grid gap-3 sm:grid-cols-2">
      {links.map((link, i) => (
        <motion.a
          key={link.platform}
          custom={i}
          variants={reveal}
          initial="hidden"
          animate="show"
          href={link.href}
          target={link.platform === "email" ? undefined : "_blank"}
          rel={link.platform === "email" ? undefined : "noopener noreferrer"}
          download={link.platform === "resume" ? "Vivek-Jude-Manoj-Resume.pdf" : undefined}
          className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-white transition hover:-translate-y-0.5 hover:border-purple/60"
        >
          <PlatformIcon platform={link.platform} className="h-7 w-7 text-purple" />
          <span className="min-w-0 break-all font-medium">{link.label}</span>
        </motion.a>
      ))}
    </div>
  </>
);
};

export const PanelContent = ({ id, sub }: { id: BoxId | ExtraPanelId; sub?: string }) => {
  switch (id) {
    case "about":
      return <AboutPanel />;
    case "experience": {
      const role = roles.find((r) => r.slug === sub && r.stories.length);
      return role ? <RoleDetail role={role} /> : <ExperienceList />;
    }
    case "projects": {
      const project = projects.find((p) => p.slug === sub);
      return project ? <ProjectDetail project={project} base="projects" backLabel="All projects" /> : <ProjectsList />;
    }
    case "hackathons": {
      const project = hackathons.find((p) => p.slug === sub);
      return project ? <ProjectDetail project={project} base="hackathons" backLabel="All hackathons" /> : <HackathonsList />;
    }
    case "impact":
      return <ImpactPanel />;
    case "stack":
      return <StackPanel />;
    case "education":
      return <EducationPanel />;
    case "resume":
      return <ResumePanel />;
    case "moments":
      return <MomentsPanel />;
    case "contact":
      return <ContactPanel />;
  }
};
