// Comprehensive, beginner-friendly content library for DevLibrary.
// Each guide is plain Markdown rendered by the app's MarkdownRenderer.

export interface SeedGuide {
  categorySlug: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  order: number;
  content: string;
}

/* ------------------------------------------------------------------ */
/*  WEBSITE FOUNDATIONS                                                */
/* ------------------------------------------------------------------ */

const buildLaunchPublish = `# How to Build, Launch & Publish a Website (Beginner's Roadmap)

This is the **big-picture map**. Don't worry about memorizing it — just understand the journey. Every website goes through these five stages:

> **Idea → Build → Test locally → Put it online (hosting) → Point a domain at it + turn on HTTPS**

We'll walk through each one in plain English, then the next guides go deeper.

## The 30-second version

1. You write files (HTML, CSS, JavaScript) on your computer.
2. You preview them in a browser on your own machine ("localhost").
3. You upload those files to a **host** (a computer that's always online).
4. You buy a **domain name** (like \`mysite.com\`) and point it at the host.
5. You enable **HTTPS** so the little padlock 🔒 shows up and data is encrypted.

That's it. Everything below is just detail.

## Stage 1 — What a website actually *is*

A website is just a folder of files that a browser knows how to read:

- **HTML** = the structure (headings, paragraphs, buttons). The skeleton.
- **CSS** = the styling (colors, fonts, layout). The skin and clothes.
- **JavaScript** = the behavior (clicks, animations, data). The muscles.

The simplest possible website is **one file** called \`index.html\`. A browser opens it and shows it. There is no magic.

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>My First Site</title>
  </head>
  <body>
    <h1>Hello, world!</h1>
    <p>I built a website.</p>
  </body>
</html>
\`\`\`

Save that as \`index.html\`, double-click it, and it opens in your browser. **You just made a website.** Seriously.

## Stage 2 — Build it on your computer

You need two free things:

1. **A code editor** — we recommend **Visual Studio Code** (see the VS Code guide).
2. **A modern browser** — Chrome, Safari, Firefox, or Edge.

Create a folder, open it in VS Code, and add your files. Most beginner sites have:

\`\`\`
my-website/
├── index.html      ← the home page
├── styles.css      ← how it looks
└── script.js       ← what it does
\`\`\`

## Stage 3 — Preview it locally ("localhost")

"Localhost" just means **your own computer pretending to be a web server**. Nobody else can see it — it's your private sandbox.

The easiest way: in VS Code install the **Live Server** extension, right-click \`index.html\`, choose **"Open with Live Server"**. Your site opens at an address like \`http://127.0.0.1:5500\`. Every time you save, it refreshes automatically.

Prefer the terminal? If you have Node.js installed:

\`\`\`bash
npx serve .
\`\`\`

This serves the current folder at \`http://localhost:3000\`.

## Stage 4 — Put it online (hosting)

Your computer isn't online 24/7, so you upload your files to a **host**. For a beginner, the easiest free hosts are:

| Host | Best for | Cost |
|------|----------|------|
| **Netlify** | Drag-and-drop static sites | Free tier |
| **Vercel** | React/Next.js apps | Free tier |
| **GitHub Pages** | Simple sites + portfolios | Free |
| **Cloudflare Pages** | Fast static hosting | Free |

**Simplest path of all:** go to [netlify.com](https://netlify.com), sign up, and **drag your website folder onto the page**. In about 10 seconds you get a live URL like \`https://gleeful-otter-1234.netlify.app\`. It's already on HTTPS. You're published.

## Stage 5 — A custom domain + HTTPS

The free URL works, but you probably want \`yourname.com\`.

1. **Buy a domain** from a registrar — Namecheap, Cloudflare, Google Domains, or Porkbun. Usually $10–15/year.
2. **Connect it to your host.** In Netlify/Vercel you click "Add custom domain," type your domain, and it tells you two records to add at your registrar (an **A record** or **CNAME**). Paste them in.
3. **Wait.** DNS changes take anywhere from 5 minutes to a few hours to spread across the internet ("propagation").
4. **HTTPS turns on automatically.** Netlify, Vercel, and Cloudflare issue a free **Let's Encrypt** certificate for you. The padlock appears. Done.

> **What is HTTPS?** The "S" means *secure*. It encrypts the connection between the visitor and your site so nobody can snoop or tamper. Modern browsers warn users away from non-HTTPS sites, so this is non-negotiable today — but the good news is your host handles it for free.

## Stage 6 — Updating your site later

- **Drag-and-drop hosts:** re-drag the folder.
- **Git-connected hosts (recommended):** push your code to GitHub, and the host redeploys automatically. This is the professional workflow — every \`git push\` updates the live site.

## Common beginner gotchas

- **"My CSS isn't loading!"** — Check the file path in your \`<link>\` tag. \`href="styles.css"\` means *same folder*.
- **"It works locally but not online."** — Usually a capitalization issue. Servers are case-sensitive; \`Index.HTML\` ≠ \`index.html\`.
- **"My domain shows an error."** — DNS hasn't propagated yet, or the records are wrong. Give it an hour and double-check the A/CNAME values.
- **"No padlock."** — Wait for the certificate to issue (a few minutes), and make sure every resource loads over \`https://\`, not \`http://\`.

## Your first-site checklist

- [ ] Wrote an \`index.html\`
- [ ] Previewed it with Live Server
- [ ] Added CSS and made it look decent on mobile
- [ ] Pushed the folder to Netlify/Vercel
- [ ] Bought a domain and connected it
- [ ] Confirmed the 🔒 padlock is showing
- [ ] Shared the link with a friend 🎉

**Next:** read *"HTML, CSS & JavaScript — The Three Languages"* to actually build the pages.`;

const threeLanguages = `# HTML, CSS & JavaScript — The Three Languages

Every website on Earth is built from these three. Learn what each does and you can read any site's source.

## 1. HTML — Structure

HTML uses **tags** wrapped in angle brackets. Most come in pairs: an opening \`<p>\` and a closing \`</p>\`.

\`\`\`html
<h1>Biggest heading</h1>
<h2>Smaller heading</h2>
<p>A paragraph of text.</p>
<a href="https://example.com">A link</a>
<img src="cat.jpg" alt="A cat" />
<button>Click me</button>
<ul>
  <li>List item one</li>
  <li>List item two</li>
</ul>
\`\`\`

**The 10 tags you'll use constantly:**

| Tag | What it makes |
|-----|---------------|
| \`<h1>\`–\`<h6>\` | Headings (h1 = biggest) |
| \`<p>\` | Paragraph |
| \`<a>\` | Link |
| \`<img>\` | Image |
| \`<div>\` | Generic box / container |
| \`<span>\` | Inline container |
| \`<ul>\`/\`<ol>\`/\`<li>\` | Lists |
| \`<button>\` | Button |
| \`<input>\` | Form field |
| \`<nav>\`/\`<header>\`/\`<footer>\` | Page sections |

## 2. CSS — Style

CSS picks elements with **selectors** and applies **properties**.

\`\`\`css
/* Select all paragraphs */
p {
  color: #333;
  font-size: 16px;
  line-height: 1.6;
}

/* Select by class (reusable) */
.button {
  background: #6366f1;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
}

/* Select by id (unique) */
#hero {
  text-align: center;
}
\`\`\`

You attach a class in HTML with \`class="button"\` and an id with \`id="hero"\`.

**The properties you'll use most:** \`color\`, \`background\`, \`font-size\`, \`margin\` (space outside), \`padding\` (space inside), \`display\`, \`flex\`, \`grid\`, \`border-radius\`, \`width\`, \`height\`.

**Making it responsive (works on phones):**

\`\`\`css
@media (max-width: 600px) {
  .menu { flex-direction: column; }
}
\`\`\`

## 3. JavaScript — Behavior

JavaScript makes pages *do* things.

\`\`\`js
// Find a button and react to clicks
const button = document.querySelector("button");
button.addEventListener("click", () => {
  alert("You clicked me!");
});

// Change text on the page
document.querySelector("h1").textContent = "New title!";

// Store and use data
let count = 0;
count = count + 1;
\`\`\`

## How they connect

Your HTML pulls in the other two:

\`\`\`html
<head>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <!-- your content -->
  <script src="script.js"></script>
</body>
\`\`\`

## Practice project: a clickable counter

\`\`\`html
<button id="btn">Clicked 0 times</button>
<script>
  let n = 0;
  const btn = document.getElementById("btn");
  btn.onclick = () => { n++; btn.textContent = "Clicked " + n + " times"; };
</script>
\`\`\`

That's a complete, interactive web app in 6 lines. Build up from here.`;

const domainsAndDns = `# Domains, DNS & HTTPS Explained Simply

Jargon-busting guide to the stuff that confuses every beginner.

## What is a domain name?

A domain (\`google.com\`) is a **human-friendly nickname** for a computer's real address (an IP like \`142.250.72.14\`). Nobody wants to type numbers, so we use names.

- \`.com\`, \`.org\`, \`.net\` — the **TLD** (top-level domain)
- \`google\` — the part you buy
- \`www\` or \`shop\` — a **subdomain** you can create for free

## What is DNS?

**DNS = the internet's phone book.** When someone types your domain, DNS looks up which server holds your site. You edit DNS at your **registrar** (where you bought the domain) using **records**:

| Record | Points a domain at... | Example |
|--------|----------------------|---------|
| **A** | An IP address (IPv4) | \`@ → 75.2.60.5\` |
| **AAAA** | An IPv6 address | \`@ → 2606:...\` |
| **CNAME** | Another domain name | \`www → mysite.netlify.app\` |
| **MX** | A mail server | for email |
| **TXT** | Text (verification) | domain ownership proofs |

When your host says *"add a CNAME record for www pointing to xyz.netlify.app"* — this table is what they mean.

## What is "propagation"?

After you change a DNS record, the new value has to spread to DNS servers worldwide. This takes **minutes to ~48 hours** (usually under an hour). During this window some people see the new site and some see the old — that's normal.

## What is HTTPS / SSL / TLS?

All three words describe the **lock on the connection**:

- **HTTP** = plain text. Anyone between you and the site can read it. ❌
- **HTTPS** = encrypted. Snoopers see scrambled noise. ✅ 🔒
- **SSL/TLS** = the encryption technology that makes HTTPS work.
- **Certificate** = a digital ID card proving the site is who it claims to be.

**You almost never set this up by hand anymore.** Netlify, Vercel, Cloudflare, and GitHub Pages all issue free **Let's Encrypt** certificates automatically and renew them forever. Your only job is to enable the toggle (usually on by default).

## Quick troubleshooting

- **"Not secure" warning** → certificate not issued yet (wait) or you're loading some images/scripts over \`http://\` ("mixed content" — change them to \`https://\`).
- **Domain won't connect** → wrong A/CNAME value, or propagation isn't done. Use a tool like dnschecker.org to watch it spread.
- **Email broke after moving DNS** → you deleted the MX records. Add them back from your email provider.`;

/* ------------------------------------------------------------------ */
/*  COMMAND REFERENCE: macOS TERMINAL                                  */
/* ------------------------------------------------------------------ */

const macTerminal = `# macOS Terminal — Complete Command Reference

The Terminal app (in \`/Applications/Utilities\`) gives you a text command line. You type a command, press Enter, it runs. This is the comprehensive beginner reference — organized by what you're trying to *do*.

> **How to read this:** \`command argument\` — anything in \`<angle brackets>\` is a placeholder you replace. Lines starting with \`#\` are comments/explanations.

## Getting around (navigation)

| Command | What it does |
|---------|--------------|
| \`pwd\` | **P**rint **w**orking **d**irectory — shows where you are |
| \`ls\` | List files in current folder |
| \`ls -l\` | List with details (size, date, permissions) |
| \`ls -a\` | List **all** files, including hidden (dotfiles) |
| \`ls -lah\` | Long list, all files, human-readable sizes |
| \`cd <folder>\` | **C**hange **d**irectory into a folder |
| \`cd ..\` | Go up one folder |
| \`cd ~\` | Go to your home folder |
| \`cd -\` | Go back to the previous folder |
| \`cd /\` | Go to the root of the disk |
| \`open .\` | Open the current folder in Finder |
| \`open <file>\` | Open a file in its default app |

## Files & folders

| Command | What it does |
|---------|--------------|
| \`mkdir <name>\` | Make a new folder |
| \`mkdir -p a/b/c\` | Make nested folders in one go |
| \`touch <file>\` | Create an empty file (or update its timestamp) |
| \`cp <src> <dest>\` | Copy a file |
| \`cp -R <src> <dest>\` | Copy a folder and its contents |
| \`mv <src> <dest>\` | Move **or** rename |
| \`rm <file>\` | Delete a file (**no trash — permanent!**) |
| \`rm -r <folder>\` | Delete a folder and everything in it |
| \`rm -rf <folder>\` | Force-delete, no prompts ⚠️ *dangerous* |
| \`ln -s <target> <link>\` | Create a symbolic link (shortcut) |

> ⚠️ **\`rm\` does not use the Trash.** Deleted is deleted. Double-check the path before pressing Enter, and be extremely careful with \`rm -rf\`.

## Looking inside files

| Command | What it does |
|---------|--------------|
| \`cat <file>\` | Print the whole file |
| \`less <file>\` | Scroll through a file (press \`q\` to quit) |
| \`head <file>\` | First 10 lines |
| \`head -n 20 <file>\` | First 20 lines |
| \`tail <file>\` | Last 10 lines |
| \`tail -f <file>\` | Follow a file live (great for logs) |
| \`wc -l <file>\` | Count lines |
| \`diff <a> <b>\` | Show differences between two files |
| \`nano <file>\` | Edit a file in a simple editor |

## Finding things

| Command | What it does |
|---------|--------------|
| \`find . -name "*.js"\` | Find all .js files from here down |
| \`find . -type d\` | Find only directories |
| \`grep "text" <file>\` | Search for text inside a file |
| \`grep -r "text" .\` | Search recursively through all files |
| \`grep -i "text" <file>\` | Case-insensitive search |
| \`which <command>\` | Show the path of a command |
| \`mdfind "query"\` | Spotlight search from the terminal |

## Permissions & ownership

| Command | What it does |
|---------|--------------|
| \`chmod +x <file>\` | Make a file executable |
| \`chmod 644 <file>\` | Owner read/write, others read |
| \`chmod 755 <file>\` | Common for scripts/folders |
| \`chown <user> <file>\` | Change owner (often needs \`sudo\`) |
| \`sudo <command>\` | Run a command as administrator |
| \`whoami\` | Show your username |

## Processes & system

| Command | What it does |
|---------|--------------|
| \`top\` | Live view of running processes (\`q\` to quit) |
| \`ps aux\` | List all running processes |
| \`kill <PID>\` | Stop a process by its ID |
| \`kill -9 <PID>\` | Force-kill a stubborn process |
| \`killall <name>\` | Kill processes by name (e.g. \`killall node\`) |
| \`open -a "App Name"\` | Launch a Mac app |
| \`caffeinate\` | Keep the Mac awake |
| \`uptime\` | How long the Mac has been on |
| \`df -h\` | Disk space, human-readable |
| \`du -sh <folder>\` | Size of a folder |

## Networking

| Command | What it does |
|---------|--------------|
| \`ping <host>\` | Test if a server is reachable |
| \`curl <url>\` | Fetch a URL's contents |
| \`curl -O <url>\` | Download a file |
| \`ifconfig\` | Show network interfaces / IPs |
| \`ipconfig getifaddr en0\` | Get your local Wi-Fi IP |
| \`nslookup <domain>\` | Look up DNS records |
| \`dig <domain>\` | Detailed DNS lookup |
| \`lsof -i :3000\` | See what's using port 3000 |

> 💡 **"Port already in use"** when starting a dev server? Run \`lsof -i :3000\`, find the PID, then \`kill -9 <PID>\`.

## Archives & compression

| Command | What it does |
|---------|--------------|
| \`zip -r out.zip <folder>\` | Zip a folder |
| \`unzip <file>.zip\` | Unzip |
| \`tar -czf out.tar.gz <folder>\` | Create a compressed tarball |
| \`tar -xzf <file>.tar.gz\` | Extract a tarball |

## Homebrew (the macOS package manager)

Homebrew installs developer tools. Install it once from [brew.sh](https://brew.sh), then:

| Command | What it does |
|---------|--------------|
| \`brew install <pkg>\` | Install a tool (e.g. \`brew install git\`) |
| \`brew uninstall <pkg>\` | Remove a tool |
| \`brew upgrade\` | Update everything |
| \`brew update\` | Update Homebrew itself |
| \`brew list\` | List installed packages |
| \`brew search <term>\` | Search for a package |
| \`brew install --cask <app>\` | Install a GUI app (e.g. \`--cask google-chrome\`) |
| \`brew doctor\` | Diagnose problems |

## Git (version control) — the essentials

| Command | What it does |
|---------|--------------|
| \`git init\` | Start tracking a folder |
| \`git clone <url>\` | Download a repo |
| \`git status\` | What's changed |
| \`git add .\` | Stage all changes |
| \`git commit -m "msg"\` | Save a snapshot |
| \`git push\` | Upload commits |
| \`git pull\` | Download others' commits |
| \`git log --oneline\` | Compact history |
| \`git branch\` | List branches |
| \`git checkout -b <name>\` | Create + switch to a branch |
| \`git merge <branch>\` | Merge a branch in |

## Node / npm (for web projects)

| Command | What it does |
|---------|--------------|
| \`node -v\` | Node version |
| \`npm init -y\` | Create a package.json |
| \`npm install\` | Install dependencies |
| \`npm install <pkg>\` | Add a package |
| \`npm run dev\` | Run the dev script |
| \`npm run build\` | Build for production |
| \`npx <tool>\` | Run a tool without installing it |

## Terminal keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| \`Ctrl + C\` | Cancel the current command |
| \`Ctrl + A\` | Jump to start of line |
| \`Ctrl + E\` | Jump to end of line |
| \`Ctrl + U\` | Clear the line |
| \`Ctrl + L\` | Clear the screen (\`clear\`) |
| \`Ctrl + R\` | Search command history |
| \`Tab\` | Auto-complete file/command names |
| \`↑ / ↓\` | Cycle through previous commands |
| \`Ctrl + D\` | Log out / end input |

## Survival tips

- **Lost?** Type \`pwd\` to see where you are and \`ls\` to see what's around.
- **A command hangs?** Press \`Ctrl + C\`.
- **Don't know what a command does?** Type \`man <command>\` for the manual (\`q\` to quit).
- **Never paste a command you don't understand**, especially anything with \`sudo\` and \`rm -rf\`.`;

/* ------------------------------------------------------------------ */
/*  COMMAND REFERENCE: CLAUDE CODE                                     */
/* ------------------------------------------------------------------ */

const claudeCode = `# Claude Code — Complete Command Reference

Claude Code is Anthropic's AI coding assistant that runs in your terminal. You talk to it in plain English and it reads, writes, and runs code in your project. This reference covers the slash commands, CLI flags, and shortcuts a beginner needs.

> **Mental model:** You're pair-programming with an AI that can see your files and run commands (with your permission). You type requests; it does the work and shows you the diffs.

## Starting & exiting

| Command | What it does |
|---------|--------------|
| \`claude\` | Start an interactive session in the current folder |
| \`claude "your request"\` | Start with an initial prompt |
| \`claude -c\` | **Continue** the most recent conversation |
| \`claude -r\` | **Resume** — pick a past conversation to reopen |
| \`claude -p "prompt"\` | **Print** mode — run once, print the answer, exit (great for scripts) |
| \`exit\` or \`Ctrl + D\` | Leave the session |

## Slash commands (type inside a session)

| Command | What it does |
|---------|--------------|
| \`/help\` | List available commands |
| \`/clear\` | Clear the conversation history (fresh context) |
| \`/compact\` | Summarize the conversation to free up context |
| \`/init\` | Generate a \`CLAUDE.md\` describing your project |
| \`/model\` | Switch the model (e.g. Opus, Sonnet, Haiku) |
| \`/review\` | Review the current code changes / a PR |
| \`/config\` | Open settings |
| \`/permissions\` | Manage what Claude can do without asking |
| \`/cost\` | Show token usage and cost for the session |
| \`/login\` / \`/logout\` | Switch Anthropic accounts |
| \`/memory\` | Edit your persistent memory files |
| \`/agents\` | Manage subagents |
| \`/mcp\` | Manage connected MCP servers (tools) |
| \`/vim\` | Toggle vim-style editing in the prompt |
| \`/terminal-setup\` | Configure terminal key bindings |

## Useful CLI flags

| Flag | What it does |
|------|--------------|
| \`--model <name>\` | Choose the model at launch |
| \`--add-dir <path>\` | Give Claude access to another folder |
| \`--permission-mode plan\` | Start in read-only planning mode |
| \`--dangerously-skip-permissions\` | Skip approval prompts ⚠️ use with care |
| \`--continue\` / \`-c\` | Continue last conversation |
| \`--resume\` / \`-r\` | Resume a chosen conversation |
| \`--output-format json\` | Machine-readable output (for scripts) |
| \`--verbose\` | Show detailed logs |
| \`claude --version\` | Show the installed version |
| \`claude update\` | Update to the latest version |
| \`claude doctor\` | Diagnose install/health issues |

## In-session shortcuts

| Shortcut | Action |
|----------|--------|
| \`Shift + Tab\` | Cycle permission modes (normal → auto-accept → plan) |
| \`Esc\` | Interrupt Claude mid-task |
| \`Esc\` \`Esc\` | Edit/rewind to a previous message |
| \`Ctrl + C\` | Cancel current input / stop |
| \`Ctrl + L\` | Clear the screen |
| \`↑ / ↓\` | Navigate prompt history |
| \`@\` | Mention a file to include it (e.g. \`@src/app.js\`) |
| \`#\` | Quickly add a note to memory |
| \`!\` | Run a bash command directly |
| \`\\\` + Enter | New line without sending |

## Working with files & context

- **Reference a file:** type \`@\` and start the path — \`@src/index.html\`. Claude reads it in.
- **The \`CLAUDE.md\` file:** project instructions Claude reads every session. Run \`/init\` to create one, or write rules like *"always use TypeScript"* or *"run npm test before committing."*
- **Memory (\`#\`):** start a line with \`#\` to save a durable preference (e.g. \`# I prefer tabs over spaces\`).

## Permission modes (important for beginners)

Claude asks before doing risky things. Cycle modes with **Shift+Tab**:

1. **Normal** — asks before editing files or running commands.
2. **Auto-accept edits** — applies file edits without asking (still asks for risky bash).
3. **Plan mode** — read-only; Claude proposes a plan but changes nothing until you approve.

> 🟢 **Beginner advice:** stay in **Normal** mode until you trust a workflow. Read the diffs before approving.

## A typical beginner session

\`\`\`text
$ cd my-website
$ claude
> Add a dark-mode toggle button to index.html and wire it up in script.js
  (Claude shows you the proposed edits)
> looks good, apply it
  (Claude writes the files)
> /review
  (Claude reviews its own changes for bugs)
\`\`\`

## Tips

- **Be specific.** "Make the header sticky and add a shadow on scroll" beats "improve the header."
- **Let it plan first** for big tasks: press Shift+Tab into plan mode.
- **Use \`/clear\`** between unrelated tasks so old context doesn't confuse it.
- **Check \`/cost\`** if you're curious about token usage.
- **\`claude doctor\`** is your friend when something's misbehaving.`;

/* ------------------------------------------------------------------ */
/*  COMMAND REFERENCE: XCODE                                           */
/* ------------------------------------------------------------------ */

const xcode = `# Xcode — Beginner's Command & Shortcut Reference

Xcode is Apple's free app for building iPhone, iPad, Mac, Watch, and TV apps. Download it from the Mac App Store. This reference covers the actions and shortcuts you'll use daily.

> **Mental model:** Xcode is editor + compiler + simulator + debugger in one window. You write Swift code, press Run, and it launches your app in a simulated iPhone.

## The essential keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| \`⌘ + R\` | **Run** the app |
| \`⌘ + .\` | **Stop** the running app |
| \`⌘ + B\` | **Build** (compile without running) |
| \`⌘ + Shift + K\` | **Clean** build folder (fixes weird errors) |
| \`⌘ + U\` | Run **unit tests** |
| \`⌘ + /\` | Comment / uncomment the line |
| \`⌘ + Click\` | Jump to a definition |
| \`⌃ + ⌘ + ←\` | Go back to previous file |
| \`⌘ + Shift + O\` | **Open Quickly** — fuzzy-find any file/symbol |
| \`⌘ + Shift + J\` | Reveal current file in the navigator |
| \`⌘ + L\` | Jump to a line number |
| \`⌘ + F\` | Find in file |
| \`⌘ + Shift + F\` | Find in whole project |
| \`⌃ + I\` | Re-indent / auto-format selection |
| \`⌘ + 0\` | Toggle the left navigator panel |
| \`⌘ + ⌥ + 0\` | Toggle the right inspector panel |
| \`⌘ + Shift + Y\` | Toggle the debug console |
| \`⌥ + Click\` | Quick help / docs for a symbol |

## The window, explained

- **Navigator (left)** — your files, search, breakpoints, issues.
- **Editor (center)** — where you write code.
- **Inspector (right)** — properties of the selected item.
- **Debug area (bottom)** — console output and variables.
- **Toolbar (top)** — Run ▶, Stop ⏹, and the device/simulator picker.

## Creating & running a project

1. **File → New → Project** (\`⌘ + Shift + N\`).
2. Choose **App**, pick **SwiftUI** as the interface (easiest for beginners).
3. Name it, pick a folder, and you'll land in \`ContentView.swift\`.
4. Pick a simulator in the toolbar (e.g. "iPhone 15").
5. Press **⌘ + R**. The simulator boots and your app appears. 🎉

## SwiftUI live preview

In SwiftUI files there's a **Canvas** on the right that shows your UI live as you type.

| Shortcut | Action |
|----------|--------|
| \`⌥ + ⌘ + P\` | Resume / refresh the preview |
| \`⌥ + ⌘ + Return\` | Show/hide the Canvas |

## Debugging

| Action | How |
|--------|-----|
| Set a breakpoint | Click the line-number gutter |
| Step over | \`F6\` |
| Step into | \`F7\` |
| Continue | \`⌃ + ⌘ + Y\` |
| Print a variable | type \`po <name>\` in the console |
| Disable all breakpoints | \`⌘ + Y\` |

## The Simulator app

| Action | How |
|--------|-----|
| Home | \`⌘ + Shift + H\` |
| Rotate | \`⌘ + ← / →\` |
| Screenshot | \`⌘ + S\` |
| Shake gesture | \`⌃ + ⌘ + Z\` |
| Type with Mac keyboard | \`⌘ + K\` toggles software keyboard |

## Command-line tools (\`xcodebuild\` & friends)

Run these in Terminal:

| Command | What it does |
|---------|--------------|
| \`xcode-select --install\` | Install the command-line developer tools |
| \`xcodebuild\` | Build a project from the terminal |
| \`xcodebuild -list\` | List schemes & targets |
| \`xcrun simctl list\` | List available simulators |
| \`xcrun simctl boot "iPhone 15"\` | Boot a simulator |
| \`open -a Simulator\` | Launch the Simulator app |
| \`pod install\` | Install CocoaPods dependencies |
| \`swift --version\` | Check the Swift version |

## Fixing common beginner problems

- **"Build failed" with cryptic errors** → \`⌘ + Shift + K\` (Clean), then build again.
- **Simulator won't launch** → quit it, then \`xcrun simctl shutdown all\` and retry.
- **Signing errors** → Project → *Signing & Capabilities* → pick your Apple ID team.
- **Preview crashed** → \`⌥ + ⌘ + P\` to resume; if it persists, clean + rebuild.`;

/* ------------------------------------------------------------------ */
/*  COMMAND REFERENCE: VS CODE                                         */
/* ------------------------------------------------------------------ */

const vscode = `# Visual Studio Code — Beginner's Command & Shortcut Reference

VS Code is the most popular free code editor in the world. Download it from [code.visualstudio.com](https://code.visualstudio.com). This reference covers the shortcuts and commands that make you fast.

> **The single most important shortcut:** \`⌘ + Shift + P\` (Mac) / \`Ctrl + Shift + P\` (Windows) opens the **Command Palette** — type the name of *anything* you want to do. When in doubt, open it.

> Shortcuts below show **Mac** keys. On Windows/Linux, swap \`⌘\` for \`Ctrl\` and \`⌥\` for \`Alt\`.

## The must-know shortcuts

| Shortcut | Action |
|----------|--------|
| \`⌘ + Shift + P\` | **Command Palette** (do anything) |
| \`⌘ + P\` | Quick-open a file by name |
| \`⌘ + ,\` | Open Settings |
| \`⌘ + B\` | Toggle the sidebar |
| \`⌘ + J\` | Toggle the bottom panel/terminal |
| \`⌘ + \\\`\` | Open/close the integrated terminal |
| \`⌘ + N\` | New file |
| \`⌘ + S\` | Save |
| \`⌘ + W\` | Close tab |
| \`⌘ + Shift + T\` | Reopen closed tab |

## Editing like a pro

| Shortcut | Action |
|----------|--------|
| \`⌘ + /\` | Toggle line comment |
| \`⌥ + ↑ / ↓\` | Move the line up/down |
| \`⌥ + Shift + ↓\` | Duplicate the line |
| \`⌘ + D\` | Select next occurrence of the word |
| \`⌘ + Shift + L\` | Select **all** occurrences |
| \`⌥ + Click\` | Add another cursor |
| \`⌘ + ⌥ + ↑ / ↓\` | Add cursor above/below |
| \`⌘ + Shift + K\` | Delete the line |
| \`⌘ + Enter\` | Insert line below |
| \`⌘ + ]\` / \`⌘ + [\` | Indent / outdent |
| \`Shift + ⌥ + F\` | Format the document |
| \`F2\` | Rename a symbol everywhere |

## Navigation

| Shortcut | Action |
|----------|--------|
| \`⌘ + P\` | Go to file |
| \`⌘ + Shift + O\` | Go to a symbol in the file |
| \`⌘ + G\` | Go to a line number |
| \`⌘ + Click\` | Go to definition |
| \`⌃ + -\` | Go back |
| \`⌃ + Shift + -\` | Go forward |
| \`⌘ + Shift + \\\` | Jump to matching bracket |

## Search & replace

| Shortcut | Action |
|----------|--------|
| \`⌘ + F\` | Find in file |
| \`⌘ + ⌥ + F\` | Replace in file |
| \`⌘ + Shift + F\` | Search across the whole project |
| \`⌘ + Shift + H\` | Replace across the project |

## The integrated terminal

| Shortcut | Action |
|----------|--------|
| \`⌃ + \\\`\` | Toggle terminal |
| \`⌃ + Shift + \\\`\` | New terminal |
| \`⌘ + ↑ / ↓\` (in terminal) | Scroll |

You can run all the macOS/Git/npm commands here without leaving the editor.

## Command Palette commands worth knowing

Open it (\`⌘ + Shift + P\`) and type:

| Type this | What happens |
|-----------|--------------|
| \`Format Document\` | Auto-format the file |
| \`Change Language Mode\` | Set the file's language for highlighting |
| \`Toggle Word Wrap\` | Wrap long lines |
| \`Preferences: Color Theme\` | Change the theme |
| \`Extensions: Install Extensions\` | Add features |
| \`Git: Clone\` | Clone a repo |
| \`Developer: Reload Window\` | Restart VS Code (fixes glitches) |
| \`Emmet: ...\` | HTML/CSS shorthand expansion |

## Extensions every beginner should install

| Extension | Why |
|-----------|-----|
| **Live Server** | Right-click HTML → instant local preview with auto-reload |
| **Prettier** | Auto-formats your code on save |
| **ESLint** | Catches JavaScript mistakes |
| **GitLens** | Supercharges the built-in Git |
| **Path Intellisense** | Autocompletes file paths |
| **Material Icon Theme** | Pretty file icons |

To install: \`⌘ + Shift + X\`, search the name, click **Install**.

## The \`code\` terminal command

Run \`Shell Command: Install 'code' command in PATH\` from the Command Palette once. Then in any terminal:

| Command | What it does |
|---------|--------------|
| \`code .\` | Open the current folder in VS Code |
| \`code <file>\` | Open a specific file |
| \`code --diff a.txt b.txt\` | Compare two files |
| \`code --list-extensions\` | List installed extensions |

## Beginner tips

- **Format on save:** Settings → search "format on save" → enable. Your code stays tidy automatically.
- **Multi-cursor editing** (\`⌘ + D\`) feels like magic once it clicks — try it on repeated words.
- **Stuck/glitchy?** Command Palette → "Reload Window."
- **Learn the Command Palette first.** Every menu item lives there, searchable.`;

/* ------------------------------------------------------------------ */
/*  EXPORT                                                             */
/* ------------------------------------------------------------------ */

export const seedGuides: SeedGuide[] = [
  // Website Foundations
  {
    categorySlug: "website-foundations",
    title: "How to Build, Launch & Publish a Website",
    slug: "build-launch-publish",
    description: "The complete beginner roadmap — from a single HTML file to a live site on your own domain with HTTPS.",
    tags: ["beginner", "roadmap", "hosting", "https", "domain"],
    order: 0,
    content: buildLaunchPublish,
  },
  {
    categorySlug: "website-foundations",
    title: "HTML, CSS & JavaScript — The Three Languages",
    slug: "html-css-js",
    description: "What each of the three web languages does, with copy-paste examples you can build on.",
    tags: ["html", "css", "javascript", "beginner"],
    order: 1,
    content: threeLanguages,
  },
  {
    categorySlug: "website-foundations",
    title: "Domains, DNS & HTTPS Explained Simply",
    slug: "domains-dns-https",
    description: "Jargon-busting guide to domain names, DNS records, propagation, and the padlock.",
    tags: ["dns", "domain", "https", "ssl", "beginner"],
    order: 2,
    content: domainsAndDns,
  },
  // Command References
  {
    categorySlug: "command-references",
    title: "macOS Terminal — Complete Command Reference",
    slug: "macos-terminal",
    description: "Every essential Terminal command for macOS, organized by task, with examples and survival tips.",
    tags: ["macos", "terminal", "bash", "cli", "reference"],
    order: 0,
    content: macTerminal,
  },
  {
    categorySlug: "command-references",
    title: "Claude Code — Complete Command Reference",
    slug: "claude-code",
    description: "Slash commands, CLI flags, shortcuts, and workflows for Anthropic's AI coding assistant.",
    tags: ["claude", "ai", "cli", "reference"],
    order: 1,
    content: claudeCode,
  },
  {
    categorySlug: "command-references",
    title: "Xcode — Beginner's Command & Shortcut Reference",
    slug: "xcode",
    description: "Keyboard shortcuts, build/run, simulator, debugging, and xcodebuild for Apple development.",
    tags: ["xcode", "swift", "ios", "macos", "reference"],
    order: 2,
    content: xcode,
  },
  {
    categorySlug: "command-references",
    title: "VS Code — Beginner's Command & Shortcut Reference",
    slug: "vs-code",
    description: "The shortcuts, Command Palette, terminal, and extensions that make you fast in VS Code.",
    tags: ["vscode", "editor", "shortcuts", "reference"],
    order: 3,
    content: vscode,
  },
  // Creator References
  {
    categorySlug: "creator-references",
    title: "Nate Herk | AI Automation",
    slug: "nate-herk",
    description: "The go-to YouTube channel for mastering AI OS, Claude Code operating systems, and AI automation workflows.",
    tags: ["ai", "automation", "aios", "youtube", "url:https://www.youtube.com/@nateherk"],
    order: 0,
    content: `# Nate Herk | AI Automation

Nate Herk is one of the leading voices on **AI OS** — the practice of building fully autonomous, agent-driven operating systems on top of tools like Claude Code. His channel is the most comprehensive free resource for learning how to design, build, and sell AI-powered workflows and operating systems.

## What He Teaches

- **AI OS Architecture** — how to structure Claude Code agents into a full operating system
- **Claude Code deep-dives** — slash commands, hooks, MCP servers, custom agents, and more
- **AI Automation** — n8n workflows, agent pipelines, and integrations that save hours every week
- **Build & Sell** — how to package AI OS solutions as products for clients

## Why Watch

Nate breaks down concepts that most tutorials skip — the *why* behind agent design decisions, the patterns that actually hold up in production, and the business layer on top of the tech. Whether you're new to AI development or already building agents, his content accelerates your understanding significantly.

## Recommended Starting Points

| Video / Series | What You'll Learn |
|---|---|
| *Build & Sell Claude Code Operating Systems* | Full 2+ hour course on AIOS from scratch |
| *Claude Code hooks & slash commands* | Extending Claude Code beyond defaults |
| *n8n AI automation pipelines* | Connecting LLMs to real-world workflows |

## Channel

**[@nateherk](https://www.youtube.com/@nateherk)** on YouTube — free content, updated regularly.
`,
  },
];

export const extraCategories = [
  {
    name: "Command References",
    slug: "command-references",
    description: "Comprehensive command & shortcut references: macOS Terminal, Claude Code, Xcode, VS Code",
    icon: "terminal",
    color: "#f59e0b",
    order: 4,
  },
  {
    name: "Creator References",
    slug: "creator-references",
    description: "Curated YouTube channels and external resources from top educators in AI and development",
    icon: "youtube",
    color: "#ef4444",
    order: 5,
  },
];
