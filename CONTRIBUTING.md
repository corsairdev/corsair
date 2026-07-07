# Contributing to Corsair

Thanks for contributing to Corsair. We welcome improvements to the core library, docs, tooling, and especially new plugin contributions.

## Before You Start

Please create an issue before starting work on anything significant. This helps us avoid duplicate work, align on scope, and catch design constraints early.

If you want to contribute a new integration, check the [OSS Integrations page](https://corsair.dev/oss) first. It shows which integrations are available, which are already claimed, and who is working on them. Claim an integration there before you start so two people do not work on the same plugin.

Before opening a new issue:

- Check [corsair.dev/oss](https://corsair.dev/oss) for new integrations.
- Check [open issues](https://github.com/corsairdev/corsair/issues).
- Use the right template in `.github/ISSUE_TEMPLATE/`.
- For a new integration, start with the integration request template.
- For bugs, use the bug report template.
- For product or framework ideas, use the feature request template.

If you want to contribute a new plugin, please start with the issue first. The issue should explain:

- what API or service you want to add
- the API documentation link
- the endpoints or workflows you need
- whether webhook support is needed
- any auth, rate limit, or infrastructure constraints you already know about

## Fork and Local Setup

To contribute to Corsair, you will need to set up the monorepo locally.

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v22.x` (specified in `.nvmrc`)
- **pnpm**: `v10.x` (specified in `package.json` packageManager)
- **Docker**: Optional, but recommended if you want to run database-backed integrations or testing databases locally.

### Step 1: Fork and Clone

1. Delete any existing corsair fork on GitHub (if this is not your first integration).
2. Fork the repository on GitHub from [corsairdev/corsair](https://github.com/corsairdev/corsair).
3. Clone your new fork into a new local directory (do not reuse a previous clone):

```bash
git clone https://github.com/<your-username>/corsair.git corsair-dev
cd corsair-dev
```

### Step 2: Install and Build

Install dependencies and perform an initial build of all workspace packages:

```bash
pnpm install
pnpm build
```

Useful commands from the repo root:

| Command | Description |
|---|---|
| `pnpm typecheck` | Run TypeScript typechecks across all packages |
| `pnpm lint` | Run Biome lint checks |
| `pnpm lint:fix` | Automatically fix auto-fixable Biome lint errors |
| `pnpm format` | Format files according to Biome settings |
| `pnpm run validate:plugins` | Run script to validate all plugins meet configuration standards |
| `pnpm build` | Build all packages in the workspace |
| `pnpm test` | Run tests across all workspace packages |

---

## Local Sandbox & Testing Workflow

The main E2E testing sandbox for integrations lives in `demo/testing/`. This is a Next.js-based application configured with a local database and a runner to test plugins locally.

### 1. Setup the Local Database

The demo sandbox is configured to run Postgres via Docker.
1. Spin up the Postgres container:
   ```bash
   cd demo/testing
   pnpm run db:up
   ```
2. Generate and apply migrations to provision the necessary database schemas:
   ```bash
   pnpm run db:generate
   pnpm run db:push
   ```

*(Alternatively, you can test with SQLite. The sandbox initializes `./corsair.db` when running manual/hub tests).*

### 2. Configure Local Environment Variables

Create a `.env` file inside `demo/testing/` to configure the sandbox.
```env
# Encryption Key (KEK) - Corsair uses this to encrypt all credentials
CORSAIR_KEK=your_32_byte_hex_key_here

# (Optional) Hub Environment Keys - if testing via Hub Integration
CORSAIR_API_KEY=ck_dev_...
CORSAIR_SIGNING_SECRET=...
```

*Tip: You can generate a random 32-byte hex key for your `CORSAIR_KEK` using the following Node command:*
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Registering & Running Tests

1. Register your plugin in `demo/testing/src/server/corsair.ts`.
2. Add or modify calls in `demo/testing/src/scripts/test-script.ts` to execute your plugin's endpoints.
3. Run the test script:
   ```bash
   pnpm test:manual
   ```
   Or if testing through the Hub relay:
   ```bash
   pnpm test:hub
   ```

---

## Running the Local Studio

Corsair includes a visual developer dashboard called **Studio** for inspecting and editing local configurations, tenants, and credential states.

To start the Studio:
1. Make sure you have built the workspace packages:
   ```bash
   pnpm build
   ```
2. Start the dev server in watch mode:
   ```bash
   pnpm dev
   ```
   Or explicitly target the studio package:
   ```bash
   pnpm --filter @corsair-dev/studio dev:web
   pnpm --filter @corsair-dev/studio dev:server
   ```

If your change needs credentials or local environment setup, follow the package-specific docs or examples in the repo before running tests.

## Branch Workflow

Please do your work on a separate branch instead of committing directly to `main`.

Using a dedicated branch per change makes review easier, keeps unrelated work isolated, and makes it much simpler to update or discard a change if the design shifts during discussion.

As a general rule:

- create a new branch for each issue or contribution
- keep the branch focused on one change
- avoid mixing docs, refactors, and new features unless they are tightly related

Branch names do not need to be rigid, but they should be descriptive. Good examples include:

```bash
git checkout -b fix/slack-message-typing
git checkout -b feat/hubspot-webhooks
git checkout -b docs/contributing-guide
```

If your work starts from an issue, including the issue number in the branch name is also helpful.

## Commit Format

We recommend using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages.

This keeps history easier to scan and makes it clearer whether a change is a fix, feature, docs update, refactor, or breaking change.

Common examples:

```bash
fix(slack): handle missing channel id
feat(hubspot): add webhook event mapping
docs: expand contributing guide
```

Try to keep commit messages descriptive and scoped to the actual change. If a change is breaking, call that out clearly in the commit message and in the pull request.

## Package Structure

Corsair is a monorepo, and contributions should take the package boundaries seriously.

At a high level, the repo is organized into three kinds of packages:

- The main `corsair` package, which contains the core framework, database adapters, setup logic, and shared infrastructure.
- Plugin packages under `packages/*`, which implement specific integrations.
- Additional Corsair feature packages that build on top of the core system.

Some important packages to know:

- `packages/corsair`: the main core package.
- `packages/mcp`: MCP server and SDK adapters for exposing Corsair operations to agent frameworks. [GitHub link](https://github.com/corsairdev/corsair/tree/main/packages/mcp)
- `packages/cli`: the CLI for setup, credential storage, and OAuth flows. [GitHub link](https://github.com/corsairdev/corsair/tree/main/packages/cli)
- `packages/ui`: UI helpers for server-side permissioning and related approval flows. [GitHub link](https://github.com/corsairdev/corsair/tree/main/packages/ui)
- `packages/studio`: a local studio for inspecting and editing your Corsair instance. [GitHub link](https://github.com/corsairdev/corsair/tree/main/packages/studio)

When making changes, think carefully about which package a concern belongs in. A fix that feels convenient in one package may actually belong in the core package or in a shared feature package instead.

You should also be cognizant of breaking changes. Our goal is to maintain backwards compatibility at all times, and pull requests that do not preserve that will not be accepted.

## Current Testing Workflow

Right now, the main E2E testing sandbox for integrations lives in `demo/testing/`.

In particular:

- `demo/testing/src/server/corsair.ts` is where plugins are registered for local testing.
- `demo/testing/src/scripts/test-script.ts` is the current place to exercise plugin behavior manually.

When working on a plugin, update `demo/testing/src/server/corsair.ts` to register the plugin you are developing, then add or adjust `demo/testing/src/scripts/test-script.ts` to call the endpoints you want to verify.

Run the test script from `demo/testing/`:

```bash
cd demo/testing
pnpm test
```

If you are developing a plugin package, also run that package in build watch mode so the testing app picks up fresh compiled output while you iterate.

## Starting a New Plugin

If you are adding a new plugin, follow the official guide:

[Create Your Own Plugin](https://docs.corsair.dev/guides/create-your-own-plugin)

That guide covers the expected scaffold and generator flow. In practice, the normal path is:

1. Check [corsair.dev/oss](https://corsair.dev/oss) to make sure the integration is not already claimed or in progress, then claim it if it is available.
2. Open an issue first and align on the integration.
3. Generate the plugin scaffold from the repo root.
4. Implement endpoints, auth, schemas, and webhooks.
5. Register the plugin in `demo/testing/src/server/corsair.ts`.
6. Test the plugin through `demo/testing/src/scripts/test-script.ts`.

The repo includes a generator:

```bash
pnpm run generate:plugin <PluginName>
```

## Expectations for Plugin Contributions

New plugin contributions are welcome. A strong plugin contribution should include:

- an issue created before implementation starts
- working endpoint implementations
- webhook support when the integration supports or depends on webhooks
- tests or test coverage through the current `demo/testing` workflow
- thoughtful schema design for any data we should store locally

Please think carefully about both of these before you implement a plugin:

- what domains or resource groups the plugin should expose
- what database entities or tables are worth storing locally versus fetching live

Good plugin contributions are not just API wrappers. They should fit Corsair's model cleanly and make sensible decisions about data shape, naming, and storage.

Just as importantly, a plugin should feel ergonomic and intuitive. Its shape and schema should be clear enough that a future developer can get started through TypeScript alone, without needing to read extra docs first. Names, resource groups, inputs, and return types should all work with TypeScript IntelliSense in a way that makes the plugin self-explanatory.

## Authentication Design

When starting a new plugin, figure out the integration's default auth model early and wire it up properly.

- Choose the correct default auth type for the integration.
- Make sure the plugin plumbing matches the provider's real requirements.
- Do not treat auth as a thin header-mapping exercise if the provider needs more lifecycle handling.

For example, OAuth integrations usually require more than just storing an access token. You should think through token refresh, token expiry, re-auth flows, and any account-scoping rules the provider imposes. API key integrations are often simpler, but you should still confirm whether they are account-level, environment-level, or user-level keys and model them accordingly.

If you are unsure how the auth should fit into Corsair, try asking on our [Discord](https://discord.gg/DphupWS7). We can discuss the integration there and help you get unblocked.

## Webhook Testing

If a plugin includes webhook support, you should test the webhook flow, not just the endpoint definitions.

- verify the incoming payload shape
- verify signature validation
- verify event parsing and routing
- verify any persistence or downstream side effects

We recommend using `ngrok` for local webhook development and testing. Its free tier offers one stable URL, which makes it much easier to configure webhook URLs while iterating locally.

## Backwards Compatibility

Please be careful with backwards compatibility across the monorepo.

We cannot simply update the core `corsair` package and leave downstream packages out of sync. Changes in core abstractions, types, auth behavior, schemas, or runtime expectations can ripple into plugins and feature packages like `@corsair-dev/mcp`, `@corsair-dev/cli`, `@corsair-dev/ui`, and `@corsair-dev/studio`.

If you change shared behavior, make sure you think through:

- whether existing plugins still compile and behave correctly
- whether downstream packages still match the updated core APIs
- whether the change requires coordinated updates across multiple packages
- whether the change should be introduced in a more additive, less breaking way

If a change has compatibility risk, call it out clearly in the issue or pull request and update all affected packages together.

## Type Safety

Corsair is strongly typed, and contributions should preserve that.

- Avoid type assertions whenever possible.
- Do not use broad assertions like `as any` or `as unknown as ...` to force code through.
- Prefer improving the types, narrowing conditionally, or restructuring the code.
- If you absolutely must use a type assertion, keep it as narrow as possible and add a short comment explaining why it is safe and why a better type was not practical.

## When the Plugin Infrastructure Does Not Fit

Not every integration fits perfectly into the current plugin infrastructure. That is expected.

If you discover that Corsair's plugin model does not work well for the integration you want to add, please do not hack around it silently. Open an issue so other contributors can help you. Also, as mentioned before, try asking on our [Discord](https://discord.gg/DphupWS7).

Building plugin infrastructure that fits every API and webhook model is hard, and some integrations will need new accommodation points in the framework. We would rather discuss those cases early than merge a plugin that has to fight the abstractions.

## Pull Requests

When you open a pull request:

- link the issue it addresses
- describe the API surface or behavior you added or changed
- explain how you tested it
- call out any schema, webhook, or infrastructure decisions that reviewers should pay attention to

Small docs fixes can be straightforward, but anything larger should have issue context first.
