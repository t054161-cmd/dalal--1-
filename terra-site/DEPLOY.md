# Deploying terra-site

The site is deployed to Vercel as project `terra-site` on scope `t054161-6328`.

Production alias: <https://terra-site-t054161-6328.vercel.app>

## Preferred: connect the Git repository

In the Vercel dashboard, import `t054161-cmd/dalal--1-` and set **Root Directory**
to `terra-site`. Every push to the production branch then deploys automatically,
and Install/Build commands can stay on their defaults (`npm ci`, `next build`).

## Fallback: source-bootstrap deploy

The deployment currently live was created without a Git connection, so it uses a
three-file upload that pulls the real source from a pinned commit at build time.
Use this only when the Git connection is unavailable.

Uploaded files: `package.json`, `next.config.mjs`, `bootstrap.sh`.

Project settings for the deployment:

- Framework: `nextjs`
- Install Command: `bash bootstrap.sh` (Vercel caps this field at 256 characters,
  hence the script)
- Build Command: `npm run build`

`bootstrap.sh`:

```sh
#!/usr/bin/env bash
set -euo pipefail
S=<full-commit-sha>
curl -fsSL "https://codeload.github.com/t054161-cmd/dalal--1-/tar.gz/$S" -o /tmp/s.tgz
tar xzf /tmp/s.tgz -C /tmp
cp -R "/tmp/dalal--1--$S/terra-site/." ./
npm ci --no-audit --no-fund
```

Pin `S` to the commit you want live; the tarball's top-level directory is
`dalal--1--$S`. `npm ci` runs against the committed `package-lock.json`, so the
build resolves exactly the versions this project was tested with.

Before deploying, verify the build from a clean checkout rather than the working
tree — that is what Vercel will see:

```sh
git archive HEAD terra-site | tar x -C /tmp/verify --strip-components=1
cd /tmp/verify && npm ci && npm run build
```

## Environment variables

`ANTHROPIC_API_KEY` is optional. Set it in Vercel to route the cup designer
through Claude; without it the designer falls back to the built-in offline
parser and the rest of the site is unaffected. See `.env.example`.
