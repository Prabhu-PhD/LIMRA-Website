# Deploying the LIMRA website

This site is **mostly hand-written static HTML**, with **Eleventy** generating
only the blog/news. Because of that build step, **the thing you deploy is the
generated `_site/` folder — not the repo itself.**

Everything (pages, CSS, JS, images, blog markdown) lives in this Git repo, so
the site is fully portable. Only three things are Netlify-specific and need
attention when moving hosts: **forms, the blog CMS login, and the Netlify
config files**. See the checklist at the bottom.

---

## 1. Build the site

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install      # first time only — installs Eleventy
npm run build    # generates the _site/ folder = the whole website
```

To preview locally while editing:

```bash
npm start        # serves the site at http://localhost:8080
```

The output of `npm run build` is the folder **`_site/`**. That folder is the
deployable website.

---

## 2. Deploy

### Option A — a host that can run builds (Netlify, Vercel, Cloudflare Pages, Render, a VPS)
This is the easiest path. Connect the GitHub repo and set:

- **Build command:** `npm run build`
- **Publish / output directory:** `_site`
- Point the domain's DNS at the host.

(On Netlify this is already configured in `netlify.toml`.)

### Option B — a plain "upload your files" host (cPanel / shared hosting, S3, GitHub Pages)
These can't build, so build first and upload the result:

1. Run `npm run build` on any computer.
2. Upload **everything inside `_site/`** to the host's web root
   (usually `public_html/`) via FTP/SFTP or the host's File Manager.
3. Point the domain's DNS at the host.

All URLs use real `.html` paths, so no special server routing is needed.

---

## 3. Forms (Web3Forms)

The home and contact forms are delivered by **Web3Forms**, which works on any
host. **One-time setup:**

1. Go to <https://web3forms.com>, enter the email that should receive
   enquiries, and copy your **Access Key**.
2. Open **`js/forms.js`** and replace `YOUR_WEB3FORMS_ACCESS_KEY` with it.
3. Rebuild / redeploy.

Until a real key is set, the forms show an error instead of sending. The key
lives in just this one file and is used by both forms.

---

## 4. Blog CMS (Decap)

The `/admin` content manager logs in through **Netlify Identity + Git Gateway**,
which only exist on Netlify. The blog *content* (markdown in `blog/posts/`) is
fully portable; only the **login** is Netlify-specific.

- **Staying on Netlify:** nothing to do. Enable Identity + Git Gateway in the
  Netlify dashboard and invite users.
- **Moving off Netlify:** either
  - switch Decap to a **GitHub login** backend (edit `admin/config.yml`:
    `backend: { name: github, repo: <owner>/<repo>, branch: main }` and set up a
    small OAuth provider), **or**
  - drop `/admin` and edit blog posts directly as markdown files in
    `blog/posts/` on GitHub, then rebuild.

---

## 5. Moving-off-Netlify checklist

- [ ] Build runs: `npm install && npm run build` produces `_site/`
- [ ] New host serves the **contents of `_site/`** (Option A or B above)
- [ ] DNS pointed at the new host
- [ ] Web3Forms key set in `js/forms.js` (Section 3) — forms tested
- [ ] CMS login decided (Section 4) — or `/admin` removed if unused
- [ ] `netlify.toml` and any `_redirects` are Netlify-only — harmless elsewhere,
      just ignored

Content and design move with **zero changes** — only the items above.
