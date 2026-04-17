'use client';

import { useState } from 'react';

function buildPrompt(pluginName: string, apiDocsUrl: string): string {
	const lowerName = pluginName.toLowerCase() || '<pluginname>';
	const displayName = pluginName || '<PluginName>';
	const docsRef = apiDocsUrl ? `at ${apiDocsUrl}` : '(link the API docs here)';

	return `Please build a Corsair plugin for ${displayName} using the API docs ${docsRef}.

## 0. Get the repo (if you haven't already)
If you don't already have the Corsair repo cloned, fork and clone it first:
\`\`\`
git clone https://github.com/corsair-dev/corsair.git
cd corsair
pnpm install
\`\`\`

## 1. Generate the scaffold
From the repo root, run:
\`\`\`
pnpm run generate:plugin ${displayName}
\`\`\`
This creates \`packages/${lowerName}/\` with all the boilerplate wired up.

## 2. Implement the plugin
Using the ${displayName} API docs ${docsRef}, fill in the scaffold:

- **client.ts** — Update the base URL (\`${displayName.toUpperCase()}_API_BASE\`) and auth headers to match how ${displayName} expects authentication (e.g. \`Authorization: Bearer \${apiKey}\` or a custom header).

- **endpoints/** — Replace the example endpoint with real ${displayName} endpoints. For each endpoint:
  - Add input/output types to \`endpoints/types.ts\`
  - Implement the function in its own file (e.g. \`endpoints/customers.ts\`)
  - Export it from \`endpoints/index.ts\`
  - Wire it into the nested endpoints object and endpoint meta in \`index.ts\`

- **schema/database.ts** — Define Zod schemas for any entities you want to cache locally. If this plugin is live-API-only, leave \`entities: {}\` empty.

- **webhooks/** — Remove the placeholder and add real ${displayName} webhook event types. Implement signature verification in \`webhooks/types.ts\` using the method described in the ${displayName} docs.

- **error-handlers.ts** — Update the rate limit and auth error matching to match ${displayName}'s actual error response format.

Look at \`packages/github/\` for a comprehensive reference and \`packages/resend/\` for a simpler one.

## 3. Typecheck
\`\`\`
cd packages/${lowerName}
pnpm typecheck
\`\`\`

## 4. Test
Add \`"@corsair-dev/${lowerName}": "workspace:*"\` to \`demo/testing/package.json\`, run \`pnpm install\` from the repo root, register the plugin in \`demo/testing/src/server/corsair.ts\`, write a test in \`demo/testing/src/scripts/test-script.ts\`, then:
\`\`\`
cd demo/testing
pnpm run test
\`\`\``;
}

export function PluginPromptBanner() {
	const [pluginName, setPluginName] = useState('');
	const [apiDocsUrl, setApiDocsUrl] = useState('');
	const [copied, setCopied] = useState(false);

	function handleCopy() {
		navigator.clipboard.writeText(buildPrompt(pluginName, apiDocsUrl));
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	}

	return (
		<div
			style={{
				border: '1px solid var(--color-fd-border, #27272a)',
				borderRadius: '0.75rem',
				padding: '1.25rem',
				marginBottom: '1.5rem',
				background: 'var(--color-fd-card, #18181b)',
			}}
		>
			<div
				style={{
					fontWeight: 600,
					fontSize: '0.875rem',
					marginBottom: '0.875rem',
					color: 'var(--color-fd-foreground)',
				}}
			>
				Copy a prompt for Claude Code
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '0.625rem',
					marginBottom: '1rem',
				}}
			>
				<input
					type="text"
					placeholder="Plugin name (e.g. Stripe, GoogleCalendar)"
					value={pluginName}
					onChange={(e) => setPluginName(e.target.value)}
					style={{
						background: 'var(--color-fd-background)',
						border: '1px solid var(--color-fd-border, #27272a)',
						borderRadius: '0.5rem',
						padding: '0.5rem 0.75rem',
						fontSize: '0.8125rem',
						color: 'var(--color-fd-foreground)',
						outline: 'none',
						width: '100%',
						boxSizing: 'border-box',
					}}
				/>
				<input
					type="text"
					placeholder="API docs URL (e.g. https://docs.stripe.com/api)"
					value={apiDocsUrl}
					onChange={(e) => setApiDocsUrl(e.target.value)}
					style={{
						background: 'var(--color-fd-background)',
						border: '1px solid var(--color-fd-border, #27272a)',
						borderRadius: '0.5rem',
						padding: '0.5rem 0.75rem',
						fontSize: '0.8125rem',
						color: 'var(--color-fd-foreground)',
						outline: 'none',
						width: '100%',
						boxSizing: 'border-box',
					}}
				/>
			</div>
			<button
				onClick={handleCopy}
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: '0.5rem',
					padding: '0.5rem 1rem',
					borderRadius: '0.5rem',
					background: 'var(--color-fd-primary)',
					color: 'var(--color-fd-primary-foreground)',
					fontSize: '0.8125rem',
					fontWeight: 500,
					border: 'none',
					cursor: 'pointer',
					opacity: 1,
					transition: 'opacity 0.15s',
				}}
			>
				{copied ? (
					<>
						<svg
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
						Copied!
					</>
				) : (
					<>
						<svg
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
							<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
						</svg>
						Copy prompt
					</>
				)}
			</button>
		</div>
	);
}
