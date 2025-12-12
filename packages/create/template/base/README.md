# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [Corsair](https://corsair.dev)

## Corsair CLI

The Corsair CLI is included in this project. After installing dependencies, you can use it with any package manager:

**Using npm scripts (works with all package managers):**

```bash
npm run corsair:generate
npm run corsair:check
npm run corsair:migrate
```

**Direct commands:**

```bash
# pnpm
pnpm corsair list
pnpm corsair generate

# npm
npx corsair list
npx corsair generate

# yarn
yarn corsair list
yarn corsair generate
```

**Available commands:**

- `corsair list` - List all queries and mutations (use `--queries` or `--mutations` to filter)
- `corsair generate` - Generate new operations
- `corsair check` - Type check your operations
- `corsair migrate` - Run migrations

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
