// Projects shown in the Projects section. Each card opens a detail view (#project/<slug>)
// with What it does / Why I built it / How I built it and a screenshot gallery.
// Screenshots live in public/projects/<slug>/NN.webp; the first one is the card cover.

export type ProjectLink = { label: string; url: string };
export type Shot = { src: string; caption: string };

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  summary: string; // one or two sentences for the card
  what: string[]; // paragraphs
  why: string[];
  how: string[];
  highlights?: string[];
  stack: string[];
  category: 'Agentic AI' | 'Full-stack' | 'Infrastructure' | 'Research' | 'Teaching';
  status: string;
  featured?: boolean;
  gallery: Shot[];
  galleryNote?: string;
  links: ProjectLink[];
  repo: 'public' | 'private';
};

const shots = (slug: string, captions: string[]): Shot[] =>
  captions.map((caption, i) => ({ src: `/projects/${slug}/${String(i + 1).padStart(2, '0')}.webp`, caption }));

export const projects: Project[] = [
  {
    slug: 'research-orchestrator',
    name: 'Research-Agent Orchestrator',
    tagline: 'A platform to plan, dispatch and supervise a fleet of AI agents',
    summary:
      'My PhD research runs on coding agents. This is the platform that runs them: a Jira-style task board synced with GitHub, tasks handed to Claude, Codex or OpenCode agents, a manager agent that supervises the fleet, and one place that shows me what needs me.',
    what: [
      'An orchestration platform for the coding agents (Claude Code, Codex and OpenCode) that train models, run evaluations and draft papers across my research projects on a GPU cluster.',
      'Work starts on a Jira-style task board: backlog, ready, dispatched, review, done, with dependencies between tasks, synced both ways with GitHub issues. Any task can be handed to an agent: a new session on the engine, model and account I pick, or one that is already running. The agent receives a written brief and a contract: finish with exactly one report, ask instead of guessing, and stop when a decision belongs to me.',
      'A manager agent runs the loop. It dispatches what is ready, reviews what comes back, re-dispatches failures with a sharper brief, answers what another agent can answer, and turns everything only I can decide into a decision on the board. Agents message each other through one inbox, addressed by name, by card or by project.',
      'It runs across several AI subscriptions at once. The platform tracks how much of each Claude and Codex account is left, starts work on the account with room, and when one subscription hits its usage limit, the session continues on the next one instead of stopping.',
      'Around that sits the control room: every session, transcript and SLURM job in one live view, a portfolio board, a queue of every decision waiting on me, question cards that answer an agent from the browser, and a workbench of tabs and splits. It spans workspaces too: the GPU cluster and my own machine, behind one login.',
    ],
    why: [
      'At some point I had more agents running than I could keep in my head: several research projects, dozens of sessions a week, some on Claude and some on Codex, each in its own terminal on a shared cluster. The expensive failure was not a bug. It was an agent that had stopped hours ago, waiting for a one-word answer I never saw.',
      'Watching them was not enough. I wanted to manage them the way a lead manages a team: write the work down as tasks, hand each one to the right agent, and only be pulled in for the decisions that are actually mine.',
    ],
    how: [
      'It grew in layers. First a collector in plain Python with no dependencies, run from cron on the cluster, that reads every agent\'s session registry and transcript, checks that its process is really alive, and attributes it to the right project. Then a React portal on an open-source agent-UI design system, streaming transcripts over websockets and relaying answers into each agent\'s tmux window.',
      'The platform itself (tasks, dispatch, the manager, messaging, accounts, workspaces) was planned as a milestone of GitHub issues and built the way the platform now works: sub-agents implemented each work package in its own git worktree against a test instance, each one wrote a build report, and an orchestrating model reviewed and merged them. Around sixty work items landed in three days. I borrowed the orchestration vocabulary (tasks, dispatches, a worker contract, a coordinator loop) from an open-source agent IDE, and kept my own substrate: real CLI sessions in tmux on a shared cluster.',
      'The rules are part of the design. The manager never starts GPU work, never approves a permission prompt, and treats a message from another agent as information, never as authorisation. GitHub write-back runs in ask, auto or off mode, and access tokens are never read into an agent\'s context.',
    ],
    highlights: [
      'Jira-style task board with dependencies, synced both ways with GitHub issues',
      'Dispatch a task to a new or running agent on Claude Code, Codex or OpenCode, with a brief and a worker contract',
      'A manager agent that dispatches, reviews, answers and escalates, so I only see the decisions that are mine',
      'Agents message each other; one live view of every session, transcript and SLURM job',
      'Multiple subscriptions with live usage: when one hits its limit, work continues on the next',
      'Workspaces across the GPU cluster and my own machine, behind one login',
    ],
    stack: ['Python', 'React', 'TypeScript', 'Tailwind', 'WebSockets', 'tmux', 'SLURM', 'GitHub API', 'Claude Code', 'Codex', 'OpenCode'],
    category: 'Agentic AI',
    status: 'In daily use',
    featured: true,
    gallery: shots('research-orchestrator', [
      'Tasks: a Jira-style board synced both ways with GitHub issues',
      'A task synced from its GitHub issue: the spec, and one click to dispatch it, hand it to a running agent or close it',
      'Dispatching a task: pick the engine, the subscription, the model and the effort',
      'Waiting on you: every decision and blocker the agents escalated, answerable in place',
      'Answering an agent\'s terminal prompt from the portal',
      'Starting an agent on a project card, on Claude or Codex',
    ]),
    links: [],
    repo: 'private',
  },
  {
    slug: 'job-application-platform',
    name: 'Agentic Job-Application Platform',
    tagline: 'An agent that drafts applications inside hard limits',
    summary:
      'From job board to tailored application: scrape, understand, score, and draft with a Claude agent that works under a turn cap, a hard budget and a time limit.',
    what: [
      'A full pipeline from job board to tailored application. A worker scrapes five job boards on a schedule, an LLM extracts each posting\'s requirements and scores the fit against my profile, and a Claude agent drafts a tailored CV and cover letter.',
      'The agent runs inside hard limits: a turn cap, a dollar cap per run and a wall-clock abort, with every run\'s cost and transcript stored. Nothing is sent anywhere without my review.',
    ],
    why: [
      'Applying well is slow: finding the roles that actually fit, reading each posting properly, and tailoring every document honestly. I wanted the machine to do the reading and the first draft, and me to do the judging.',
      'It was also the right project to learn what it takes to let an agent act on your behalf safely. The interesting part is not the prompt; it is the limits, the logging and the review step around it.',
    ],
    how: [
      'A TypeScript monorepo: a Next.js web app, a worker on a Postgres-backed job queue, Drizzle for the schema, and a separate agent service with the cost and time caps. Built in phases from written design specs and plans, with tests alongside, using Claude Code.',
      'It sits on top of an open-source job-search framework I forked and extended with Dutch job boards, a lane-based ranking of postings, and a strategy dashboard.',
    ],
    stack: ['TypeScript', 'Next.js', 'PostgreSQL', 'Drizzle', 'pg-boss', 'Docker', 'Claude API', 'Claude Code'],
    category: 'Agentic AI',
    status: 'Personal tool',
    gallery: shots('job-application-platform', ['Architecture: collect, understand, decide, act, inside hard limits']),
    galleryNote: 'Architecture overview',
    links: [],
    repo: 'private',
  },
  {
    slug: 'football-club-platform',
    name: 'Football Club Platform',
    tagline: 'The app my football club runs on',
    summary:
      'Game sign-ups, finances, league and hall bookings for a Leuven indoor-football club, in one app the players actually use. 300+ commits, deployed, maintained.',
    what: [
      'The operating system of my indoor-football club in Leuven: a public page with the next game, calendar and league table; player accounts with per-game sign-ups and spot limits; club finances; tournament games; and a booking lifecycle for the sports halls.',
      'A booking bot checks the city\'s sports-hall system every hour for free slots in our preferred halls and times, and tells the organisers the moment one appears.',
    ],
    why: [
      'We were running a club on group chats and spreadsheets: who is playing, who has paid, which hall is free. It was a real problem with real users, which made it the perfect test.',
      'I also built it on purpose to find the limits of vibe coding: how far can coding agents carry a real product, with real users and real money, before the human has to take over?',
    ],
    how: [
      'A React and TypeScript front end, an Express and PostgreSQL back end, and a Playwright-based booking bot that runs on a schedule. Front end on Vercel, back end on Render.',
      'Every feature (player self-service, tournaments, the booking lifecycle, calendar notifications) went through a written design spec and an implementation plan before an agent built it. Over 300 commits later, the lesson is clear: agents write the code fast; the specs, the review and the decisions about what not to build are still the job.',
    ],
    highlights: [
      'Per-game sign-ups with spot limits, calendar and live league table',
      'Club finances and tournament games in one place',
      'An hourly booking bot that finds free slots in the city\'s sports halls',
    ],
    stack: ['React', 'TypeScript', 'Redux', 'Express', 'PostgreSQL', 'Playwright', 'Vercel', 'Render'],
    category: 'Full-stack',
    status: 'Live, real users',
    gallery: shots('football-club-platform', [
      'Public landing page: the next game and who has signed up',
      'Calendar of league games and friendlies',
      'Live league table and recent results',
    ]),
    links: [{ label: 'Visit', url: 'https://football-dashboard-two-black.vercel.app' }],
    repo: 'private',
  },
  {
    slug: 'slurm-node-monitor',
    name: 'SLURM Node Monitor',
    tagline: 'See what\'s free on the cluster before you queue',
    summary:
      'A dashboard for the GPU cluster I work on every day: what is free on each node, who holds which GPUs, and your own jobs against your limits. Now being adopted across VITO.',
    what: [
      'A web dashboard for a shared SLURM GPU cluster. The cluster view shows live GPU, CPU and memory availability per node and who holds which GPUs; the user view shows your running and pending jobs against your account limits; usage graphs show the history.',
    ],
    why: [
      'I am one of the heaviest users of our cluster, and the question I asked most often was the simplest: where can my job actually land right now? Answering it meant chaining SLURM commands and reading their output by eye, every time, for every node.',
      'So I built the page I wanted to look at instead. Colleagues started asking for the link, and it is now being adopted across VITO.',
    ],
    how: [
      'A small Flask app that parses SLURM\'s own tools (scontrol and sacct) into a clean model of nodes, allocations, queues and limits, and logs snapshots for the history graphs. It runs on the cluster as a SLURM job itself, so anyone on the network can open it.',
    ],
    stack: ['Python', 'Flask', 'SLURM', 'JavaScript', 'Bootstrap'],
    category: 'Infrastructure',
    status: 'Adopted at VITO',
    gallery: shots('slurm-node-monitor', [
      'Cluster view: free GPUs, CPUs and memory per node, and who holds what',
      'User view: your running and pending jobs against your account limits',
    ]),
    galleryNote: 'Shown with illustrative data',
    links: [],
    repo: 'private',
  },
  {
    slug: 'conference-tracker',
    name: 'Conference Tracker',
    tagline: 'Plan research output from idea to venue',
    summary:
      'A planning portal for researchers: deadlines, ideas that mature into papers, and a backward planner that shows which venues an idea can still make. Operated by six Claude Code skills that propose every change as a reviewable diff.',
    what: [
      'A planning portal for research output: every conference, workshop and journal deadline, ideas with maturity stages, papers with first-choice and backup venues, a timeline of the year, and a graph from idea to paper to venue.',
      'A backward planner takes an idea and its time to mature and tells you which deadline cycles it can realistically make. On top sit six Claude Code skills that discover venues, scan deadlines, plan and match papers to venues.',
    ],
    why: [
      'My conference plan lived in a handwritten list and a spreadsheet, and the real question was never "when is the deadline?" but "given where this idea is, which venues can it still make?" No tool I found started from the idea.',
    ],
    how: [
      'Local-first: the whole app is a single HTML file that works offline, with the data as plain JSON I can always export. The agent layer is a set of Claude Code skills that read the tracker and my research profile and propose changes; every change lands as a git diff I read and approve, and nothing is committed on its own. End-to-end tests run in Playwright.',
    ],
    stack: ['JavaScript', 'HTML', 'Node', 'Playwright', 'Claude Code'],
    category: 'Agentic AI',
    status: 'v0.8',
    gallery: shots('conference-tracker', [
      'Dashboard: the actions that need attention first, deadlines and events',
      'Ideas with maturity stages and a backward planner',
      'Planner: papers moving from idea to submitted',
      'Timeline: the whole year of deadlines at a glance',
      'Graph: ideas to papers to venues',
    ]),
    links: [],
    repo: 'private',
  },
  {
    slug: 'trip-claim-organizer',
    name: 'Trip-Claim Organizer',
    tagline: 'Travel expense claims, sorted by AI',
    summary: 'Drop in receipts and bank statements; it matches them and exports a finished expense claim as a PDF.',
    what: [
      'Upload receipts and bank statements from a trip; a model reads them, matches every receipt to its bank transaction, and exports a finished expense claim as a PDF.',
    ],
    why: [
      'Conference travel means a pile of receipts and an afternoon of matching them to bank lines for the claim form. It is exactly the kind of tedious, well-defined document work a multimodal model should take off your hands.',
    ],
    how: ['A TypeScript app on Vite with a small Node server, using the Gemini API to read the documents. Work in progress.'],
    stack: ['TypeScript', 'Vite', 'Node', 'Gemini API'],
    category: 'Agentic AI',
    status: 'In progress',
    gallery: [],
    links: [],
    repo: 'private',
  },
  {
    slug: 'compdiff',
    name: 'CompDiff',
    tagline: 'Fair synthetic medical images, open source',
    summary:
      'Code and model weights for my CompDiff paper: a diffusion model that generates chest X-rays and fundus images for any combination of demographic attributes, including combinations it never saw in training.',
    what: [
      'A compositional diffusion model for fair medical image generation. It encodes each demographic attribute (age, sex, race) separately, composes them as supervised demographic tokens alongside the clinical text, and conditions a fine-tuned Stable Diffusion on them, so it can generate realistic chest X-rays and fundus images for rare or completely unseen combinations.',
      'On 16 chest X-ray intersections held out of training entirely, it had the lowest FID of all the generators in every one. In a blinded reader study of those unseen groups, two radiologists gave its images the highest scores for anatomical realism and for matching the clinical impression.',
    ],
    why: [
      'Generative models trained on imbalanced medical data inherit that imbalance: they are worst exactly for the rare patient groups where synthetic data would help most. My PhD is about making generative models fair and trustworthy for the patients they serve, and intersectional groups are where standard models break.',
    ],
    how: [
      'A hierarchical conditioner network builds the demographic tokens from per-attribute embeddings, and they join the clinical-text embedding as cross-attention context for Stable Diffusion. I compared it against prompt conditioning (RoentGen-v2) and loss reweighting (FairDiffusion), each trained with three seeds per modality, for image quality, subgroup fidelity and zero-shot generalisation, and ran a blinded reader study with two radiologists.',
      'Then the downstream test: pretraining classifiers on CompDiff images improved classification, and synthetic audit cohorts from CompDiff reduced the error in estimating performance on rare intersections. Trained on GPU clusters; the code, the project page and the trained weights for both modalities are public.',
    ],
    stack: ['PyTorch', 'Stable Diffusion', 'Diffusion Models', 'Medical Imaging', 'SLURM'],
    category: 'Research',
    status: 'Open source',
    gallery: shots('compdiff', [
      'Project page',
      'Method: decompose, compose, condition',
      'Intersectional gallery: generated images across demographic groups',
      'Results: generation quality and fairness against baselines',
    ]),
    links: [
      { label: 'Project page', url: 'https://mahmoudibrahim98.github.io/compdiff-site/' },
      { label: 'Paper', url: 'https://arxiv.org/abs/2603.16551' },
      { label: 'Code', url: 'https://github.com/mahmoudibrahim98/CompDiff' },
      { label: 'X-ray weights', url: 'https://huggingface.co/mahmoudibra98/compdiff-chest-xray' },
      { label: 'Fundus weights', url: 'https://huggingface.co/mahmoudibra98/compdiff-fundus' },
    ],
    repo: 'public',
  },
  {
    slug: 'ai-concepts-for-medicine',
    name: 'AI Concepts for Medicine',
    tagline: 'Interactive explainers for clinicians',
    summary:
      'An ongoing series of interactive demos that explain foundational AI concepts to clinicians and medical researchers, starting with linear regression.',
    what: [
      'Interactive walkthroughs of AI foundations with medical examples. In the first one you fit a line to patient data by hand, see every residual and squared error, and then compare your line with least squares.',
    ],
    why: [
      'Clinicians are asked to trust models they were never taught to question. I wanted material where they build the intuition by playing with it, not by reading formulas, for students of an AI in Medicine course.',
    ],
    how: ['A React app with D3 for the interactive plots, deployed on GitHub Pages. More topics (logistic regression, decision trees) are planned.'],
    stack: ['React', 'D3', 'GitHub Pages'],
    category: 'Teaching',
    status: 'Live',
    gallery: shots('ai-concepts-for-medicine', [
      'Linear regression in the clinic',
      'Fit a line by hand and compare it with least squares',
      'Every residual and squared error, made visible',
    ]),
    links: [{ label: 'Explore', url: 'https://mahmoudibrahim98.github.io/linreg-medical-explain/#/' }],
    repo: 'public',
  },
];
