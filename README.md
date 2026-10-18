# groundwork-client

Next.js 16 frontend for [groundwork-api](https://github.com/muddasir03/groundwork-api).

## Local development

Requires Node 24 (see `.nvmrc`; run `nvm use`).

```sh
npm install
cp .env.example .env.local   # points at the API on http://localhost:3001
npm run dev                  # http://localhost:3000
```

Run the API alongside it with `bin/dev` in `groundwork-api`.

## Environments & releasing

| Environment | Branch      | Runs on                        | `NEXT_PUBLIC_API_URL`  |
|-------------|-------------|--------------------------------|------------------------|
| Development | `feature/*` | your machine                   | `http://localhost:3001` |
| Staging     | `develop`   | Vercel (Hobby), `develop` branch URL | staging API on Render  |
| Production  | `main`      | Vercel (Hobby), production URL | production API on Render |

1. Branch off `develop` (`feature/<name>`), open a PR into `develop`. CI lints and builds it, and
   Vercel posts a preview URL on the PR.
2. Merging into `develop` updates **staging**. Test there against the staging API.
3. To release, open a PR from `develop` into `main`. Merging deploys to **production**.

On Vercel, `main` is the production branch. Set `NEXT_PUBLIC_API_URL` under
Settings → Environment Variables: the production API for **Production**, the staging API for **Preview**.
`NEXT_PUBLIC_*` values are baked in at build time, so redeploy after changing them.
