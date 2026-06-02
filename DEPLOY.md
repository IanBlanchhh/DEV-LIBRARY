# Deploying DevLibrary to Vercel + Turso

This guide gets your site live on a free Vercel URL with a cloud database.
You'll create the accounts (I never enter logins or payment info); the code is
already configured for it.

> **What works in the cloud:** landing page, login/register, categories, docs,
> the admin panel, the knowledge graph, AI doc generation.
> **What does NOT work in the cloud:** the Mac filesystem watcher (it reads
> folders on *your Mac*, which cloud servers can't see). That feature stays a
> local-only tool — everything else is fully live.

---

## Step 1 — Create a free Turso (cloud database)

1. Go to **https://turso.tech** and sign up (GitHub login is easiest).
2. Install the Turso CLI on your Mac:
   ```bash
   brew install tursodatabase/tap/turso
   turso auth login
   ```
3. Create a database:
   ```bash
   turso db create devlibrary
   ```
4. Load the schema (this file was generated for you in the project root):
   ```bash
   turso db shell devlibrary < turso-schema.sql
   ```
5. Grab the two values you'll paste into Vercel:
   ```bash
   turso db show devlibrary --url      # -> TURSO_DATABASE_URL  (libsql://...)
   turso db tokens create devlibrary   # -> TURSO_AUTH_TOKEN
   ```
   Keep these handy. **Don't commit them to git.**

---

## Step 2 — Put the code on GitHub

Vercel deploys from a Git repo.

1. Create a new **empty** repo at https://github.com/new (e.g. `dev-library`).
   Don't add a README/license — keep it empty.
2. In the project folder, run (replace the URL with your repo):
   ```bash
   cd ~/dev-library
   git add .
   git commit -m "DevLibrary: ready for deploy"
   git branch -M main
   git remote add origin https://github.com/<you>/dev-library.git
   git push -u origin main
   ```

---

## Step 3 — Deploy on Vercel

1. Go to **https://vercel.com** and sign up (use **Continue with GitHub**).
2. Click **Add New… → Project**, pick your `dev-library` repo, click **Import**.
3. Framework preset auto-detects **Next.js** — leave the defaults.
4. Open **Environment Variables** and add these (Production + Preview):

   | Name | Value |
   |------|-------|
   | `TURSO_DATABASE_URL` | the `libsql://...` URL from Step 1 |
   | `TURSO_AUTH_TOKEN` | the token from Step 1 |
   | `AUTH_SECRET` | any long random string (e.g. run `openssl rand -hex 32`) |
   | `ANTHROPIC_API_KEY` | *(optional)* enables the "Generate with AI" button |

5. Click **Deploy**. Wait ~1–2 minutes.
6. You get a live URL like `https://dev-library-xxxx.vercel.app`. 🎉

---

## Step 4 — Seed the live site (one time)

Your cloud DB starts empty. Visit this URL once to create the default admin,
categories, and all the rich guides:

```
https://<your-site>.vercel.app/api/init
```

You should see `{"ok":true}`. Now open the site and log in:

- **Email:** `admin@devlibrary.local`
- **Password:** `admin123`

> 🔐 **Change that password** (or your real admin account's) right away — it's a
> public site now.

---

## Step 5 — Updating the site later

Every time you push to GitHub, Vercel redeploys automatically:

```bash
git add .
git commit -m "describe your change"
git push
```

If you change the **database schema** (`prisma/schema.prisma`), regenerate and
re-apply the SQL:

```bash
npm run turso:schema
turso db shell devlibrary < turso-schema.sql
```

---

## Step 6 — Adding a custom domain (when you're ready)

1. Buy a domain (Namecheap, Cloudflare, Porkbun — ~$10–15/yr).
2. In Vercel: **Project → Settings → Domains → Add**, type your domain.
3. Vercel shows you an **A record** and/or **CNAME** to add at your registrar.
   Paste them in.
4. Wait for DNS to propagate (minutes to an hour). HTTPS is issued automatically.

---

## Troubleshooting

- **Site loads but no content / login fails** → you skipped Step 4, or the Turso
  env vars are wrong. Re-check `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` in
  Vercel and redeploy.
- **Build fails on Vercel** → open the build log. Usually a missing env var.
- **"Generate with AI" says not configured** → add `ANTHROPIC_API_KEY` in Vercel
  and redeploy.
- **File Watcher tab does nothing online** → expected; it's a local-only feature.
