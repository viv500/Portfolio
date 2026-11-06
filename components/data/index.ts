// All site content lives here. To change wording, links, or media, edit this file.

export type Platform = "github" | "gitlab" | "linkedin" | "devpost" | "email" | "youtube" | "web" | "resume" | "pdf";

export type LinkItem = { label: string; href: string; platform: Platform };

// A missing media file shows a labelled placeholder in `npm run dev` and is hidden
// in production, so adding the file at `src` is all it takes to make it appear.
export type Media = {
  kind: "image" | "video" | "youtube";
  src: string;
  alt: string;
  spec?: string;
  /** Square or tall media: sits side by side with its neighbours instead of spanning the full width. */
  half?: boolean;
};

export type Stat = { value: number; prefix?: string; suffix?: string; label: string; detail: string; route: string };

export type Section = { heading: string; body?: string; bullets?: string[] };

export type DiagramName = "allocator" | "bazel" | "migration" | "mcp" | "bot" | "macnode" | "ecg" | "datafest";

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  context: string;
  badge?: string;
  stack: string[];
  links: LinkItem[];
  media: Media[];
  sections: Section[];
  diagram?: DiagramName;
};

export type Story = {
  title: string;
  stat?: string;
  body: string;
  bullets?: string[];
  sections?: Section[];
  diagram?: DiagramName;
  media?: Media[];
};

export type Role = {
  slug: string;
  company: string;
  title: string;
  dates: string;
  location: string;
  summary: string;
  incoming?: boolean;
  /** Path under public/. Without one, a lettered badge is shown. */
  logo?: string;
  stack: string[];
  stories: Story[];
  links?: LinkItem[];
};

export const profile = {
  name: "Vivek Jude Manoj",
  photo: "/media/about/portrait-web.jpg",
  hero: "I build systems that help teams ship faster.",
  chips: ["Incoming @ Shopify", "Ex-Arctic Wolf, Rocket", "CS + AI @ UWaterloo"],
  summary: "Hey! I'm Vivek, a software engineer studying CS + AI at the University of Waterloo. I work across backend systems, CI & build infrastructure, and AI & developer tooling.",
  about: [
    "I'm Vivek. I'm studying for a Bachelor of Computer Science with an Artificial Intelligence Specialization at the University of Waterloo, graduating in December 2027. In Winter 2027 I'm joining Shopify to work on backend and infrastructure.",
    "My earlier projects were mostly web apps and hackathon builds. These days I'm most interested in infrastructure, developer tooling, cloud automation and DevOps.",
    "At Arctic Wolf I was blocked for three days because AWS had no Mac hosts available and no way to queue for one, so I built a tool that keeps retrying in the background. 3+ teams ended up using it.",
  ],
  outside: ["Intramural soccer", "Badminton Club", "Poker Club", "1,337 commits of LeetCode"],
};

export const contactLinks: LinkItem[] = [
  { label: "vjmanoj@uwaterloo.ca", href: "mailto:vjmanoj@uwaterloo.ca", platform: "email" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/vivekjudemanoj/", platform: "linkedin" },
  { label: "GitHub", href: "https://github.com/viv500", platform: "github" },
  { label: "Devpost", href: "https://devpost.com/vivek-j-manoj", platform: "devpost" },
  { label: "GitLab (UW)", href: "https://git.uwaterloo.ca/vjmanoj", platform: "gitlab" },
  { label: "DoraHacks", href: "https://dorahacks.io/builder/viv500", platform: "web" },
];

export const resumePath = "/resume.pdf";

// From Jake's public LinkedIn recommendation.
export const recommendation = {
  enabled: true,
  quote:
    "He embraced an AI-first mindset in his daily work and took on the challenge of building an MCP hub that provides Rocket users with AI capabilities through a user-friendly interface.",
  author: "Jake Finch",
  role: "Software Engineer, mentor at Rocket",
};

export const roles: Role[] = [
  {
    slug: "shopify",
    logo: "/logos/shopify.png",
    company: "Shopify",
    title: "Software Engineer Intern (Incoming)",
    dates: "Winter 2027",
    location: "Toronto, ON",
    summary: "Joining in January 2027 to work on backend and infrastructure engineering.",
    incoming: true,
    stack: ["Backend", "Infrastructure"],
    stories: [],
  },
  {
    slug: "arctic-wolf",
    logo: "/logos/arcticwolf.png",
    company: "Arctic Wolf",
    title: "Infrastructure Engineer Intern, Endpoint Security",
    dates: "Winter 2026",
    location: "Waterloo, ON",
    summary:
      "Worked on CI and build infrastructure for endpoint security: scarce Mac capacity, slow builds, credentials in code and a source-control migration.",
    stack: ["Go", "Python", "AWS", "Jenkins", "GitHub Actions", "Docker", "Bazel"],
    stories: [
      {
        title: "AWS Dedicated Host Allocator",
        stat: "3+ teams · ~5 hrs saved per allocation",
        body: "To set up a macOS CI node I needed a Mac Dedicated Host, and for three days every attempt failed with \"insufficient capacity\". Hosts get grabbed as soon as they free up, and AWS has no queue: the call either succeeds right now or returns an error. Allocating was easy. Getting one meant retrying by hand, often for days, and other engineers were hitting the same wall.",
        diagram: "allocator",
        sections: [
          {
            heading: "What it does",
            bullets: [
              "Runs headless in the background on the developer's own Mac, started automatically at login by launchd.",
              "Retries every 15 minutes by default, and again the moment you open your laptop lid.",
              "Interactive CLI menus for instance type, region, availability zones, quantity and retry interval, so nobody needs to remember AWS flags.",
              "Sends a native macOS notification on success, with the host details, or on failure.",
            ],
          },
          {
            heading: "Design decisions",
            bullets: [
              "On the laptop, not a server: it runs under each developer's own SSO identity, so every allocation belongs to a real person, there's no shared privileged account, and it needed zero new infrastructure.",
              "SSO, not access keys: credentials are short-lived and no long-lived keys sit on laptops.",
              "Failures are handled differently: no capacity waits for the next try, throttling backs off exponentially (capped at 15 minutes), and an expired login asks you to sign in again, since retrying can't fix it.",
              "One zone at a time, stopping at the first success, plus a lock file so overlapping runs can't double-allocate. Mac hosts have a 24-hour minimum, so an extra one is expensive.",
            ],
          },
          {
            heading: "Python first, then Go",
            body: "I prototyped in Python because I needed to unblock myself quickly. When I opened the PR for others to use, senior engineers pushed back on distribution and maintainability, and I agreed, because a tool running unattended on other people's laptops has different priorities. I rewrote it in Go: one self-contained binary, nothing to break when launchd can't find the right Python, compile-time checks for branches that might only run days later, and explicit handling for every failure. The cost was more code and a release step, which was worth it once other teams relied on it.",
          },
          {
            heading: "What I'd do next",
            body: "A laptop poller doesn't create capacity, it only replaces people retrying by hand. At scale this should be a central, fair queue that takes requests in order, with wait-time metrics and CI integration so pipelines can request hosts themselves.",
          },
        ],
        media: [
          {
            kind: "video",
            src: "/media/arctic-wolf/allocator-demo.mp4",
            alt: "Demo of the allocator's CLI menus and macOS notification",
            spec: "Your new_aws_host_allocator_demo.mp4, renamed and compressed under 10 MB. Check it shows no account IDs, host IDs or internal names.",
          },
        ],
      },
      {
        title: "macOS CI build nodes",
        stat: "5+ nodes · 10+ downstream jobs",
        body: "Provisioned macOS build nodes on AWS EC2 Dedicated Hosts to expand OS test coverage for endpoint security builds: custom AMIs, Jenkins pipelines and integrations with more than ten downstream jobs. Baking an AMI means every node starts fast and identical, which matters when Xcode alone is huge. The tradeoff is rebuilding the image when something changes.",
        diagram: "macnode",
      },
      {
        title: "Bazel caching for ARM64 builds",
        stat: "~40% faster ARM64 builds",
        body: "Our GitHub Actions jobs ran in containers, and containers lose their filesystem when they exit, so Bazel's cache started cold on every job. I mounted persistent Docker volumes for the Bazelisk caches. Compared with actions/cache there's no transfer time or size limit, and it suited us because the hosts were long-lived and the jobs trusted. Shared caches can be poisoned by untrusted code, so PR jobs on a wider scale should only read from them.",
        diagram: "bazel",
      },
      {
        title: "CI security hardening",
        stat: "20+ pipelines · zero downtime",
        body: "Three pieces of security work, done without interrupting the teams using these pipelines.",
        diagram: "migration",
        sections: [
          {
            heading: "Credentials out of code",
            body: "Audited the Groovy Jenkins shared libraries used across pipelines and stripped hard-coded credentials, moving them to the Jenkins credentials store and loading them at runtime with withCredentials, which also masks them in logs. Function signatures stayed the same, so no pipeline needed edits, and I tested against representative pipelines on a branch before merging.",
          },
          {
            heading: "Dependency scanning for Rust",
            body: "Added cargo-audit as a standalone CI workflow, checking Cargo.lock against the RustSec advisory database without slowing the main build.",
          },
          {
            heading: "Bitbucket to GitHub",
            body: "Led a zero-downtime migration of 20+ CI pipelines using mirror clones, which carry over all branches and tags. It also gave us one place for access control, branch protection and required checks.",
          },
        ],
      },
    ],
  },
  {
    slug: "rocket",
    logo: "/logos/rocket.png",
    company: "Rocket",
    title: "Software Engineer Intern, Platform Systems",
    dates: "Summer 2025",
    location: "Rocket Mortgage · Rocket Homes",
    summary:
      "Built developer automation that brought engineering signals into one place, and shipped production features on Rocket Homes.",
    stack: ["MCP", "TypeScript", "React", "GraphQL", "Redis", "OpenTelemetry", "Azure"],
    stories: [
      {
        title: "MCP DevOps automation bot",
        stat: "~20 hrs/week of context switching saved (estimate)",
        body: "Engineers were checking three different tools just to see where their work stood. I built an MCP-based automation bot integrating GitHub, Azure DevOps and Slack APIs to surface PR metrics and sprint insights where people already were.",
        diagram: "mcp",
      },
      {
        title: "CI/CD observability",
        body: "Instrumented CI/CD with OpenTelemetry and Azure Monitor so the team could see how long pipelines and stages took, how often they failed and why. OpenTelemetry keeps it vendor-neutral: instrument once and the backend can change later.",
      },
      {
        title: "API performance on Rocket Homes",
        stat: "35% lower API latency · 1.5M+ monthly users",
        body: "Added Redis caching and tuned GraphQL resolvers to cut API latency by 35% under production load, and built React and TypeScript components for property discovery and recommendations.",
      },
    ],
  },
  {
    slug: "csc",
    logo: "/logos/csc.png",
    company: "UW Computer Science Club",
    title: "Software Developer",
    dates: "Fall 2024",
    location: "Waterloo, ON",
    summary: "Built the club's Class Profile 2024 site, which presents survey results from the graduating CS class.",
    stack: ["Next.js", "TypeScript"],
    links: [{ label: "Class Profile 2024", href: "https://csclub.uwaterloo.ca/classprofile/2024/", platform: "web" }],
    stories: [
      {
        title: "Class Profile 2024",
        stat: "2,500+ users",
        body: "Developed the annual Class Profile site with Next.js and TypeScript.",
        media: [{ kind: "image", src: "/media/class-profile/home.png", alt: "Class Profile 2024 website home page" }],
      },
    ],
  },
  {
    slug: "assistnow",
    logo: "/logos/assistnow.jpg",
    company: "AssistNow",
    title: "Software Engineer Intern",
    dates: "Summer 2024",
    location: "Remote",
    summary: "Containers, Kubernetes and CI/CD, plus modernizing a legacy C++ codebase.",
    stack: ["Kubernetes (EKS)", "Docker", "GitHub Actions", "C++17", "AWS"],
    stories: [
      {
        title: "Kubernetes deployments",
        stat: "12+ services · 2 hrs → 10 min",
        body: "Containerized 12+ services with Docker and deployed them on Amazon EKS, cutting environment provisioning from about two hours to ten minutes.",
      },
      {
        title: "CI/CD pipelines",
        stat: "45% fewer rollback incidents",
        body: "Built CI/CD pipelines with automated integration tests so breaking changes were caught before deploy.",
      },
      {
        title: "C++ modernization",
        stat: "90% fewer leak reports",
        body: "Moved a C++14 codebase to modern C++, using RAII and smart pointers so resources free themselves, which removed most production memory leak reports.",
      },
    ],
  },
];

const repo = (path: string, label = "GitHub"): LinkItem => ({
  label,
  href: `https://github.com/${path}`,
  platform: "github",
});

export const projects: Project[] = [
  {
    slug: "internship-bot",
    title: "SWE Internship Telegram Bot",
    tagline: "Checks six internship lists every 15 minutes and sends new postings to Telegram.",
    context: "Personal tool · 2026",
    badge: "Still running",
    stack: ["Python", "GitHub Actions", "Telegram API", "actions/cache"],
    links: [repo("viv500/SWE_Internship_Telegram_Bot")],
    diagram: "bot",
    media: [
      { kind: "image", src: "/media/internship-bot/telegram-alert.jpg", alt: "New postings arriving as Telegram notifications", half: true },
      { kind: "image", src: "/media/internship-bot/telegram-chat.jpg", alt: "A posting from the bot, with location, age and an apply link", half: true },
      { kind: "image", src: "/media/internship-bot/actions-runs.png", alt: "Over 2,000 scheduled GitHub Actions runs, all passing" },
    ],
    sections: [
      {
        heading: "Why it exists",
        body: "I wanted to hear about new postings without checking six tracking repos by hand.",
      },
      {
        heading: "How it works",
        bullets: [
          "Runs on a GitHub Actions cron at staggered minutes (7, 22, 37, 52), with no server to pay for or maintain.",
          "Scrapes 6 GitHub-hosted internship lists and only notifies on postings it hasn't seen.",
          "The first run seeds everything as seen, so a new install doesn't flood you with alerts.",
        ],
      },
      {
        heading: "The infra details",
        bullets: [
          "Actions runners are stateless, so seen postings persist in state.json through actions/cache between runs.",
          "State is saved with if: always(), so one failing source doesn't lose progress.",
          "A concurrency group stops overlapping runs from racing on that state.",
        ],
      },
    ],
  },
  {
    slug: "ecg",
    title: "Explainable ECG Classification",
    tagline: "Do heart-rhythm models look at the parts of the waveform a cardiologist would?",
    context: "CS 686 research project · 2026",
    stack: ["Python", "PyTorch", "scikit-learn", "SHAP", "wfdb", "pytest"],
    links: [
      repo("sanasarin/ecg-arrhythmia-xai"),
      { label: "Report (PDF)", href: "/reports/ecg-explainability-cs686.pdf", platform: "pdf" },
    ],
    diagram: "ecg",
    media: [
      { kind: "image", src: "/media/ecg/capacity-vs-interpretability.png", alt: "Capacity vs. interpretability: macro-F1 rises as explanation plausibility and faithfulness fall" },
    ],
    sections: [
      {
        heading: "The question",
        body: "Accuracy alone hides a trade-off. A clinical tool that can't explain why it flagged a heartbeat can't be audited, so we measured how explanation quality changes as model capacity grows.",
      },
      {
        heading: "What we built",
        bullets: [
          "A reproducible pipeline segmenting 100,707 heartbeats from 44 MIT-BIH records, split strictly by patient so no one appears in both training and test data.",
          "Three models across the transparency spectrum: a depth-6 decision tree on clinical features, an MLP and a bidirectional GRU with attention.",
          "One attribution format for attention weights, Integrated Gradients, SHAP and tree paths, so every explanation is scored for plausibility and faithfulness the same way.",
        ],
      },
      {
        heading: "What we found",
        bullets: [
          "As capacity rose, macro-F1 improved (0.18 → 0.29 → 0.35) while plausibility (0.87 → 0.50 → 0.29) and faithfulness (0.68 → 0.50 → 0.24) fell, using the same SHAP method for all three.",
          "Cost-sensitive thresholding lifted the MLP's rare-class recall from 0.14 to 0.84. The tree had only 36 distinct probability outputs, so the same rule could barely move it.",
        ],
      },
      {
        heading: "Treating ML like infrastructure",
        bullets: [
          "A pytest assertion guards the patient-disjoint split, so leakage can't creep back in unnoticed.",
          "make inflation-gap measures what leakage would hide: the attention model's macro-F1 jumps from 0.345 to 0.716.",
          "Built with Sanah Sarin.",
        ],
      },
    ],
  },
  {
    slug: "wat2eat",
    title: "Wat2Eat",
    tagline: "Swipe on restaurants near campus and match with students who like the same ones.",
    context: "Team Android app · CS 346",
    stack: ["Kotlin", "Android", "Supabase", "Google Places API"],
    links: [{ label: "GitLab (UW login required)", href: "https://git.uwaterloo.ca/ajawkar/wat2eat", platform: "gitlab" }],
    media: [
      { kind: "video", src: "/media/wat2eat/demo.mp4", alt: "Wat2Eat demo: signing in, swiping on restaurants and matching" },
      { kind: "image", src: "/media/wat2eat/explore.png", alt: "Searching restaurants near campus and saving favourites", half: true },
      { kind: "image", src: "/media/wat2eat/match.png", alt: "Swiping on a restaurant to find people who like it too", half: true },
    ],
    sections: [
      {
        heading: "What it does",
        body: "A hyper-local discovery app for University of Waterloo students. It only shows restaurants near campus, keeps details minimal so you can decide quickly, and connects you with students who swiped right on the same places.",
      },
      {
        heading: "How it's built",
        bullets: [
          "Layered architecture with ViewModels over domain services and data repositories, covered by unit tests.",
          "Supabase for authentication and the database, with restaurant data from the Google Places API.",
          "Built with a team of four: Shubh Agarwal, Anandi Jawkar, Tiffany Lin and me.",
        ],
      },
    ],
  },
];

export const hackathons: Project[] = [
  {
    slug: "canify",
    title: "Canify",
    tagline: "A Chrome extension that rewards you with crypto for buying Canadian-made.",
    context: "Hack Canada 2025",
    badge: "Top 5 Overall · $1.5k",
    stack: ["Rust", "NEAR Protocol", "Flask", "Redis", "Gemini API", "JavaScript"],
    links: [
      repo("lsnchow/hackcan2025"),
      { label: "DoraHacks", href: "https://dorahacks.io/builder/viv500", platform: "web" },
      { label: "Demo", href: "https://www.youtube.com/watch?v=ZpbdxFQrABQ", platform: "youtube" },
    ],
    media: [
      { kind: "youtube", src: "ZpbdxFQrABQ", alt: "Canify demo video" },
      { kind: "image", src: "/media/canify/extension.jpg", alt: "The Canify extension scoring items in an Amazon cart and awarding NEAR coins", half: true },
      { kind: "image", src: "/media/moments/presenting.jpg", alt: "Demoing Canify on stage at Hack Canada 2025" },
      { kind: "image", src: "/media/moments/team.jpg", alt: "The Canify team: Mahad Amer, Sebastian Balderrama, Lucas Chow and me" },
      { kind: "image", src: "/media/canify/team-stage.jpg", alt: "On stage for the NEAR sponsor prize" },
    ],
    sections: [
      {
        heading: "Wins",
        bullets: ["Top 5 Overall", "NEAR Autonomous Agent Bounty Track, 2nd place ($600 CAD)", "SPUR Innovation Fund prize ($500 CAD)"],
      },
      {
        heading: "What I did",
        bullets: [
          "Led a four-person team with Lucas Chow, Sebastian Balderrama and Mahad Amer.",
          "Rust smart contracts on NEAR mint and distribute tokens based on each cart's Canadian content score.",
          "Flask backend with Redis caching and Gemini product analysis, evaluating carts in under 250ms.",
        ],
      },
    ],
  },
  {
    slug: "datafest",
    title: "The Rural Care Gap",
    tagline: "Rural patients wait 87% longer between visits. We traced it to missing specialists.",
    context: "ASA DataFest 2026",
    badge: "Best Use of External Data · $2,000",
    stack: ["Python", "Pandas", "GIS data", "Jupyter"],
    links: [
      repo("viv500/Healthcare-Analytics-ASA-DataFest-2026"),
      { label: "Report (PDF)", href: "/reports/datafest-2026-rural-care-gap.pdf", platform: "pdf" },
    ],
    diagram: "datafest",
    media: [
      { kind: "image", src: "/media/datafest/chart-1.png", alt: "DataFest analysis chart 1" },
      { kind: "image", src: "/media/datafest/chart-2.png", alt: "DataFest analysis chart 2" },
      { kind: "image", src: "/media/datafest/chart-3.png", alt: "DataFest analysis chart 3" },
    ],
    sections: [
      {
        heading: "The finding",
        body: "Across about 200,000 encounters at Stormont Vail Health, rural patients had a median follow-up gap of 28 days against 15 for metro patients. Social and financial barriers looked similar across groups, so the gap wasn't demand-side. Rural and nonmetro areas had no cardiologists, oncologists or endocrinologists, so 69.5% of rural-patient encounters happened at metro providers, and only 3% of visits to rural providers were from same-county patients, against 53% in metro areas.",
      },
      {
        heading: "What we recommended",
        body: "Expand telehealth and specialist outreach clinics in rural areas, prioritize recruiting in cardiology, oncology and endocrinology, and use MyChart to coordinate care across counties.",
      },
      {
        heading: "The data engineering",
        bullets: [
          "A multi-stage Pandas pipeline joining patient, provider, encounter and diagnosis tables with ZIP-to-FIPS and USDA rurality data.",
          "Scaled to a 7.7M-row encounter file, repairing a malformed CSV header by re-specifying a 31-column schema.",
          "Sessionized patient journeys with groupby().shift() windowing to compute follow-up gaps.",
        ],
      },
      { heading: "Team", body: "Ana Hogiu, Paige Li, Sakshi Suman and me." },
    ],
  },
  {
    slug: "watchdog",
    title: "WatchDog",
    tagline: "Listens to phone calls and warns vulnerable people when a call sounds like a scam.",
    context: "StarterHacks 2024",
    badge: "Most Promising Hack",
    stack: ["React", "Tailwind", "Framer Motion", "Flask", "OpenAI API", "NLP"],
    links: [repo("viv500/WatchDog")],
    media: [
      { kind: "video", src: "/media/watchdog/demo.mp4", alt: "WatchDog detecting a scam on a live call" },
      { kind: "image", src: "/media/watchdog/landing.jpg", alt: "WatchDog landing page" },
      { kind: "image", src: "/media/moments/starterhacks-presenting.jpg", alt: "Presenting WatchDog at StarterHacks 2024" },
    ],
    sections: [
      {
        heading: "What it does",
        body: "Open the site, choose phone or email detection and press play. WatchDog transcribes the conversation, matches sentences in context against common scam phrases, and shows a live probability that you're being scammed.",
      },
      {
        heading: "What I did",
        body: "API integration, front-end and back-end development, in a team with Prasun Sharma, Harishan Ganeshanathan and Samyat Gautam. The hardest part was keeping false positives down without missing real scams.",
      },
    ],
  },
  {
    slug: "sofia",
    title: "Sofia",
    tagline: "An AI business coach for founders in low-resource environments.",
    context: "GenAI Genesis 2025",
    stack: ["FastAPI", "Next.js", "PostgreSQL", "LangChain", "Pinecone"],
    links: [repo("viv500/GenesisAI")],
    media: [
      { kind: "image", src: "/media/sofia/dashboard.jpg", alt: "Sofia's planning canvas with notes by business area and AI insights" },
    ],
    sections: [
      {
        heading: "What it does",
        body: "Founders enter their product, team, market and goals, and Sofia generates a roadmap with milestones, marketing plans and forecasts tailored to their local reality. I worked on backend API integration, with Boyan Gao, Sheldon Lewis and Harishan Ganeshanathan.",
      },
    ],
  },
  {
    slug: "finance-cats",
    title: "Finance Cats",
    tagline: "Upload a bank statement and get budgeting advice from cat experts.",
    context: "GDSC Hacks 2025",
    stack: ["React", "TypeScript", "Vite", "Gemini", "ElevenLabs"],
    links: [
      repo("viv500/finance-cats"),
      { label: "Live site", href: "https://finance-cats.vercel.app", platform: "web" },
    ],
    media: [
      { kind: "video", src: "/media/finance-cats/demo.mp4", alt: "The Finance Cats advisors talking through a budget, with voices" },
      { kind: "image", src: "/media/finance-cats/advisor-1.jpg", alt: "Dr. Bartholomeow", half: true },
      { kind: "image", src: "/media/finance-cats/advisor-2.jpg", alt: "Sir Pounce", half: true },
      { kind: "image", src: "/media/finance-cats/advisor-3.jpg", alt: "One of the cat advisors", half: true },
      { kind: "image", src: "/media/finance-cats/credit-cards.jpg", alt: "Credit card recommendations based on spending habits" },
      { kind: "image", src: "/media/finance-cats/investing.jpg", alt: "A recommended portfolio with projected returns" },
    ],
    sections: [
      {
        heading: "What it does",
        body: "Upload a CSV bank statement and get spending insights, card recommendations and beginner investment suggestions from advisors like Dr. Bartholomeow and Sir Pounce, with optional voices. Built with Hussain Al-Shammari and Sarah Mathew.",
      },
    ],
  },
  {
    slug: "pixelperfect",
    title: "PixelPerfect",
    tagline: "Picks your best photos by checking blur, faces and smiles.",
    context: "NewHacks 2023",
    stack: ["Python", "OpenCV", "dlib", "Streamlit", "AWS EC2"],
    links: [repo("viv500/PixelPerfectAI")],
    media: [],
    sections: [
      {
        heading: "How it works",
        body: "Uses OpenCV and dlib for facial recognition and a Laplacian filter on grayscale images to measure blur, then returns the highest quality shots. Deployed on AWS EC2. Built with Lakshit Luhadia and Sunil Mamu.",
      },
    ],
  },
  {
    slug: "leaselinker",
    title: "LeaseLinker",
    tagline: "Matches co-op students in different cities for temporary housing swaps.",
    context: "NSBEHacks 2024",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    links: [repo("viv500/LeaseLinker")],
    media: [
      { kind: "image", src: "/media/leaselinker/home.jpg", alt: "LeaseLinker home page" },
      { kind: "image", src: "/media/leaselinker/form.jpg", alt: "Entering your current and future city to find a swap", half: true },
      { kind: "image", src: "/media/leaselinker/listings.jpg", alt: "Browsing homes to swap with", half: true },
    ],
    sections: [
      {
        heading: "What it does",
        body: "Connects people who want to swap homes temporarily, focused on students moving for co-op terms. Built with Khaleed Opeloyeru, Kunle Fakuade and Gloria Yiadom Boakye.",
      },
    ],
  },
];

export const wins = ["canify", "datafest", "watchdog"];

export const impact: Stat[] = [
  { value: 40, prefix: "~", suffix: "%", label: "faster ARM64 builds", detail: "Persistent Docker volumes for Bazelisk caches in containerized GitHub Actions runners.", route: "experience/arctic-wolf" },
  { value: 5, prefix: "~", suffix: " hrs", label: "saved per allocation", detail: "Manual retrying replaced by a background tool that waits for Mac host capacity.", route: "experience/arctic-wolf" },
  { value: 20, suffix: "+", label: "pipelines migrated", detail: "Bitbucket to GitHub with zero downtime, using mirror clones.", route: "experience/arctic-wolf" },
  { value: 3, suffix: "+", label: "teams adopted my tool", detail: "Teams using the Dedicated Host Allocator.", route: "experience/arctic-wolf" },
  { value: 20, prefix: "~", suffix: " hrs/wk", label: "less context switching", detail: "Estimated across the team, from an MCP bot connecting GitHub, Azure DevOps and Slack.", route: "experience/rocket" },
  { value: 35, suffix: "%", label: "lower API latency", detail: "Redis caching and tuned GraphQL resolvers under production load on Rocket Homes.", route: "experience/rocket" },
];

// Kept to the tools that matter for infra and developer tooling, plus the main extras I've used.
export const techGroups: { name: string; note: string; items: string[] }[] = [
  { name: "Cloud & infrastructure", note: "EC2 Dedicated Hosts, AMIs, EKS, SSO", items: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "Linux"] },
  { name: "CI/CD & observability", note: "Pipelines, build caches, CI metrics", items: ["GitHub Actions", "Jenkins", "Bazel", "OpenTelemetry"] },
  { name: "Languages", note: "Go and Python for tooling", items: ["Go", "Python", "TypeScript", "C++", "Rust", "Java"] },
  { name: "Web & APIs", note: "Frontend and API work", items: ["React", "Next.js", "Node.js", "Flask", "GraphQL"] },
  { name: "Data & ML", note: "Caching, databases and ML research", items: ["PostgreSQL", "Redis", "PyTorch", "Pandas"] },
];

export const education = {
  school: "University of Waterloo",
  logo: "/logos/uwaterloo.png",
  degree: "Bachelor of Computer Science, Artificial Intelligence Specialization",
  dates: "Expected graduation: December 2027",
  courseGroups: [
    {
      name: "Systems",
      courses: [
        "CS 454: Distributed Systems",
        "CS 456: Computer Networks",
        "CS 350: Operating Systems",
        "CS 251: Computer Organization and Design (Architecture, Arm64v8)",
        "CS 241: Foundations of Sequential Programs (Compilers, MIPS Assembly)",
      ],
    },
    { name: "Data & security", courses: ["CS 348: Database Management", "CS 459: Privacy, Crypto & Security"] },
    {
      name: "AI",
      courses: [
        "CS 480: Machine Learning",
        "CS 486: Artificial Intelligence",
        "CS 489: Natural Language Processing",
        "CS 484: Computer Vision",
        "AMATH 449: Neural Networks",
      ],
    },
    {
      name: "Foundations",
      courses: [
        "CS 341: Algorithms",
        "CS 240: Data Structures and Data Management",
        "CS 246: Object-Oriented Software Development (C++)",
        "CS 346: Application Development (Kotlin)",
        "CS 370: Numerical Computation",
        "CS 136: Elementary Algorithm Design and Data Abstraction (C)",
        "CS 135: Designing Functional Programs (DrRacket)",
      ],
    },
  ],
  activities: ["Intramural Soccer", "Badminton Club", "Poker Club"],
};

// Photos of you presenting, winning and with teams. Missing files are skipped, and the
// Moments box hides itself on the live site until at least one photo exists.
export const moments: Media[] = [
  { kind: "image", src: "/media/moments/presenting.jpg", alt: "Hack Canada 2025: demoing Canify on stage" },
  { kind: "image", src: "/media/moments/starterhacks-presenting.jpg", alt: "StarterHacks 2024: presenting WatchDog" },
  { kind: "image", src: "/media/canify/team-stage.jpg", alt: "Hack Canada 2025: on stage for the NEAR sponsor prize" },
  { kind: "image", src: "/media/moments/team.jpg", alt: "Hack Canada 2025: the Canify team" },
  { kind: "image", src: "/media/moments/starterhacks-2024.jpg", alt: "StarterHacks 2024: WatchDog won Most Promising Hack" },
  { kind: "image", src: "/media/moments/datafest-2026.jpg", alt: "ASA DataFest 2026: Best Use of External Data", spec: "JPG, landscape, 1600px wide." },
]

export type BoxId = "about" | "experience" | "impact" | "moments" | "stack" | "projects" | "hackathons" | "education" | "contact";

/** Panels that open from links rather than a grid box. */
export type ExtraPanelId = "resume";

// Order matters: boxes sharing a row are paired so their content is a similar height.
export const boxes: { id: BoxId; title: string; description: string; className: string }[] = [
  { id: "about", title: "About Me", description: "Background and what I work on.", className: "md:col-span-2" },
  { id: "experience", title: "Experience", description: "Shopify, Arctic Wolf, Rocket and more.", className: "md:col-span-1" },
  { id: "impact", title: "Impact", description: "Results from my internships.", className: "md:col-span-2" },
  { id: "moments", title: "Moments", description: "On stage, at hackathons and with teams.", className: "md:col-span-1" },
  { id: "projects", title: "Projects", description: "Tools and research.", className: "md:col-span-3" },
  { id: "hackathons", title: "Hackathons", description: "3 wins, $3,500 in prizes.", className: "md:col-span-3" },
  { id: "stack", title: "Tech Stack", description: "Languages and tools.", className: "md:col-span-2" },
  { id: "education", title: "Education", description: "Computer Science, AI Specialization.", className: "md:col-span-1" },
  { id: "contact", title: "Contact", description: "Email, links and resume.", className: "md:col-span-3" },
];
