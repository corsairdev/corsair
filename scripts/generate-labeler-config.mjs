import { readFile, writeFile } from 'node:fs/promises';

const repoRoot = new URL('../', import.meta.url);
const baseConfigPath = new URL('.github/labeler.yml', repoRoot);
const constantsPath = new URL('packages/corsair/core/constants.ts', repoRoot);
const outputPath = new URL('.github/labeler.generated.yml', repoRoot);

const baseConfig = await readFile(baseConfigPath, 'utf8');
const constants = await readFile(constantsPath, 'utf8');
const providersBlock = constants.match(
	/export const BaseProviders = \[(?<providers>[\s\S]*?)\] as const;/,
)?.groups?.providers;

if (!providersBlock) {
	throw new Error(
		'Could not find BaseProviders in packages/corsair/core/constants.ts',
	);
}

const providers = [...providersBlock.matchAll(/'([^']+)'/g)].map(
	(match) => match[1],
);

if (providers.length === 0) {
	throw new Error(
		'BaseProviders in packages/corsair/core/constants.ts did not contain any providers',
	);
}

const globList = (globs) =>
	globs.map((glob) => `          - '${glob}'`).join('\n');

const pluginConfig = `plugin:
  - changed-files:
      - any-glob-to-any-file:
${globList(providers.map((provider) => `packages/${provider}/**`))}
`;

await writeFile(outputPath, `${baseConfig.trimEnd()}\n\n${pluginConfig}`);
console.log(
	`Generated .github/labeler.generated.yml with ${providers.length} plugin globs`,
);
