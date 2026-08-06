# Corsair Website

https://www.corsair.dev

Landing page heavily inspired by twenty.com. Blog content is managed in [Sanity CMS](https://www.sanity.io/) with Portable Text.

## Setup

```bash
cp .env.example .env
pnpm install
pnpm dev
```

## Sanity CMS (blog)

Blog posts live in Sanity. Editors use the embedded Studio at `/studio`.

### First-time Sanity setup

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage)
2. Copy the **Project ID** into `.env` as `NEXT_PUBLIC_SANITY_PROJECT_ID`
3. Create an API token with **Editor** permissions at Project → API → Tokens
4. Add the token to `.env` as `SANITY_API_WRITE_TOKEN`
5. Add CORS origins in Project → API → CORS:
   - `http://localhost:3000`
   - `https://corsair.dev` (production)
6. Deploy the schema:
   ```bash
   pnpm sanity:schema
   ```
7. Migrate seed articles (optional):
   ```bash
   pnpm blog:migrate
   ```
8. Open Studio locally: [http://localhost:3000/studio](http://localhost:3000/studio)

### Inviting editors (e.g. SEO manager)

1. Go to [sanity.io/manage](https://www.sanity.io/manage) → your project → **Members**
2. Invite them with the **Editor** role
3. Share the Studio URL: `https://corsair.dev/studio`

### On-demand revalidation

When a post is published in Sanity, the site should refresh without a full redeploy.

1. Generate a secret and set `SANITY_REVALIDATE_SECRET` in `.env` and production
2. In Sanity Manage → API → Webhooks, create a webhook:
   - **URL:** `https://corsair.dev/api/revalidate`
   - **Dataset:** production
   - **Trigger on:** Create, Update, Delete
   - **Filter:** `_type == "post"`
   - **Secret:** same value as `SANITY_REVALIDATE_SECRET`

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm sanity:schema` | Deploy schema types to Sanity |
| `pnpm sanity:deploy` | Deploy hosted Studio to `corsair-www.sanity.studio` |
| `pnpm blog:migrate` | Import markdown seed articles into Sanity |

### Content model

Posts use Portable Text (`body`) with:

- Headings (H2, H3), paragraphs, lists, blockquotes
- Links, bold, italic, inline code
- Inline images with alt text and optional captions

Seed markdown for migration lives in `scripts/seed-data/`.
