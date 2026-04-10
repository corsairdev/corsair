import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

function validatePascalCase(name: string): void {
	if (name.includes('-')) {
		throw new Error(
			`Invalid plugin name: "${name}". Must be PascalCase (e.g., "Slack", "GoogleCalendar").`,
		);
	}
	if (name.includes('_')) {
		throw new Error(
			`Invalid plugin name: "${name}". Must be PascalCase (e.g., "Slack", "GoogleCalendar").`,
		);
	}
	if (name.includes(' ')) {
		throw new Error(
			`Invalid plugin name: "${name}". Must be PascalCase (e.g., "Slack", "GoogleCalendar").`,
		);
	}
	if (!/^[A-Z]/.test(name)) {
		throw new Error(
			`Invalid plugin name: "${name}". Must start with an uppercase letter.`,
		);
	}
	if (!/^[A-Z][a-zA-Z]*$/.test(name)) {
		throw new Error(
			`Invalid plugin name: "${name}". Must contain only letters in PascalCase.`,
		);
	}
}

function toCamelCase(pascalName: string): string {
	return pascalName.charAt(0).toLowerCase() + pascalName.slice(1);
}

function generatePlugin(pluginName: string) {
	validatePascalCase(pluginName);

	const pascalName = pluginName;
	const camelName = toCamelCase(pluginName);
	const lowerName = pluginName.toLowerCase();

	const rootDir = join(import.meta.dirname, '..');
	const packagesDir = join(rootDir, 'packages');
	const pluginDir = join(packagesDir, lowerName);

	if (existsSync(pluginDir)) {
		console.error(
			`Plugin "${lowerName}" already exists at packages/${lowerName}`,
		);
		process.exit(1);
	}

	mkdirSync(pluginDir, { recursive: true });
	mkdirSync(join(pluginDir, 'endpoints'), { recursive: true });
	mkdirSync(join(pluginDir, 'webhooks'), { recursive: true });
	mkdirSync(join(pluginDir, 'schema'), { recursive: true });

	// ── package.json ──────────────────────────────────────────────────────────
	const packageJson = {
		name: `@corsair-dev/${lowerName}`,
		version: '0.1.0',
		description: `${pascalName} plugin for Corsair`,
		type: 'module',
		main: './dist/index.js',
		module: './dist/index.js',
		types: './dist/index.d.ts',
		exports: {
			'.': {
				'dev-source': './index.ts',
				types: './dist/index.d.ts',
				default: './dist/index.js',
			},
		},
		scripts: {
			build: 'rm -rf dist && tsc --build --force && tsup',
			typecheck: 'tsc --noEmit',
		},
		peerDependencies: {
			corsair: '>=0.1.0',
			zod: '^3.0.0',
		},
		devDependencies: {
			corsair: 'workspace:*',
			tsup: '^8.0.1',
			typescript: 'catalog:',
			zod: '^3.25.76',
		},
		keywords: ['corsair', lowerName, 'plugin'],
		author: '',
		license: 'Apache-2.0',
		files: ['dist'],
	};
	writeFileSync(
		join(pluginDir, 'package.json'),
		JSON.stringify(packageJson, null, 2) + '\n',
	);

	// ── tsconfig.json ─────────────────────────────────────────────────────────
	const tsconfig = {
		extends: '../../tsconfig.base.json',
		compilerOptions: {
			lib: ['esnext'],
			types: ['node'],
			module: 'ESNext',
			moduleResolution: 'Bundler',
			outDir: './dist',
			rootDir: './',
			composite: true,
			incremental: true,
			emitDeclarationOnly: true,
			declaration: true,
			declarationMap: true,
			skipLibCheck: true,
		},
		include: ['./**/*'],
		exclude: ['dist', 'node_modules'],
		references: [],
	};
	writeFileSync(
		join(pluginDir, 'tsconfig.json'),
		JSON.stringify(tsconfig, null, 2) + '\n',
	);

	// ── tsup.config.ts ────────────────────────────────────────────────────────
	writeFileSync(
		join(pluginDir, 'tsup.config.ts'),
		`import { defineConfig } from 'tsup';

export default defineConfig({
\tclean: false,
\tdts: false,
\tformat: ['esm'],
\ttarget: 'esnext',
\tplatform: 'node',
\tbundle: true,
\tsplitting: true,
\tminify: true,
\toutDir: 'dist',
\texternal: ['corsair', 'zod'],
\tentry: ['index.ts'],
});
`,
	);

	// ── index.ts ──────────────────────────────────────────────────────────────
	writeFileSync(
		join(pluginDir, 'index.ts'),
		`import type {
\tBindEndpoints,
\tBindWebhooks,
\tCorsairEndpoint,
\tCorsairErrorHandler,
\tCorsairPlugin,
\tCorsairPluginContext,
\tCorsairWebhook,
\tKeyBuilderContext,
\tPickAuth,
\tPluginAuthConfig,
\tPluginPermissionsConfig,
\tRequiredPluginEndpointMeta,
\tRequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';
import type { ${pascalName}EndpointInputs, ${pascalName}EndpointOutputs } from './endpoints/types';
import { ${pascalName}EndpointInputSchemas, ${pascalName}EndpointOutputSchemas } from './endpoints/types';
import type {
\t${pascalName}WebhookOutputs,
\tExampleEvent,
} from './webhooks/types';
import { Example } from './endpoints';
import { ${pascalName}Schema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';

export type ${pascalName}PluginOptions = {
\tauthType?: PickAuth<'api_key'>;
\tkey?: string;
\twebhookSecret?: string;
\thooks?: Internal${pascalName}Plugin['hooks'];
\twebhookHooks?: Internal${pascalName}Plugin['webhookHooks'];
\terrorHandlers?: CorsairErrorHandler;
\tpermissions?: PluginPermissionsConfig<typeof ${camelName}EndpointsNested>;
};

export type ${pascalName}Context = CorsairPluginContext<
\ttypeof ${pascalName}Schema,
\t${pascalName}PluginOptions
>;

export type ${pascalName}KeyBuilderContext = KeyBuilderContext<${pascalName}PluginOptions>;

export type ${pascalName}BoundEndpoints = BindEndpoints<typeof ${camelName}EndpointsNested>;

type ${pascalName}Endpoint<
\tK extends keyof ${pascalName}EndpointOutputs,
\tInput,
> = CorsairEndpoint<${pascalName}Context, Input, ${pascalName}EndpointOutputs[K]>;

export type ${pascalName}Endpoints = {
\texampleGet: ${pascalName}Endpoint<'exampleGet', { id: string }>;
};

type ${pascalName}Webhook<
\tK extends keyof ${pascalName}WebhookOutputs,
\tTEvent,
> = CorsairWebhook<${pascalName}Context, TEvent, ${pascalName}WebhookOutputs[K]>;

export type ${pascalName}Webhooks = {
\texample: ${pascalName}Webhook<'example', ExampleEvent>;
};

export type ${pascalName}BoundWebhooks = BindWebhooks<${pascalName}Webhooks>;

const ${camelName}EndpointsNested = {
\texample: {
\t\tget: Example.get,
\t},
} as const;

const ${camelName}WebhooksNested = {
\texample: {
\t\texample: ExampleWebhooks.example,
\t},
} as const;

export const ${camelName}EndpointSchemas = {
\t'example.get': {
\t\tinput: ${pascalName}EndpointInputSchemas.exampleGet,
\t\toutput: ${pascalName}EndpointOutputSchemas.exampleGet,
\t},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const ${camelName}EndpointMeta = {
\t'example.get': {
\t\triskLevel: 'read',
\t\tdescription: 'Get an example resource by ID',
\t},
} as const;

export const ${camelName}AuthConfig = {
\tapi_key: {
\t\taccount: ['one'] as const,
\t},
} as const satisfies PluginAuthConfig;

export type Base${pascalName}Plugin<T extends ${pascalName}PluginOptions> = CorsairPlugin<
\t'${lowerName}',
\ttypeof ${pascalName}Schema,
\ttypeof ${camelName}EndpointsNested,
\ttypeof ${camelName}WebhooksNested,
\tT,
\ttypeof defaultAuthType
>;

export type Internal${pascalName}Plugin = Base${pascalName}Plugin<${pascalName}PluginOptions>;

export type External${pascalName}Plugin<T extends ${pascalName}PluginOptions> =
\tBase${pascalName}Plugin<T>;

export function ${lowerName}<const T extends ${pascalName}PluginOptions>(
\tincomingOptions: ${pascalName}PluginOptions & T = {} as ${pascalName}PluginOptions & T,
): External${pascalName}Plugin<T> {
\tconst options = {
\t\t...incomingOptions,
\t\tauthType: incomingOptions.authType ?? defaultAuthType,
\t};
\treturn {
\t\tid: '${lowerName}',
\t\tschema: ${pascalName}Schema,
\t\toptions: options,
\t\thooks: options.hooks,
\t\twebhookHooks: options.webhookHooks,
\t\tendpoints: ${camelName}EndpointsNested,
\t\twebhooks: ${camelName}WebhooksNested,
\t\tendpointMeta: ${camelName}EndpointMeta,
\t\tendpointSchemas: ${camelName}EndpointSchemas,
\t\tpluginWebhookMatcher: (request) => {
\t\t\tconst headers = request.headers;
\t\t\t// TODO: Update to match your webhook signature headers
\t\t\treturn 'x-${lowerName}-signature' in headers;
\t\t},
\t\terrorHandlers: {
\t\t\t...errorHandlers,
\t\t\t...options.errorHandlers,
\t\t},
\t\tkeyBuilder: async (ctx: ${pascalName}KeyBuilderContext, source) => {
\t\t\tif (source === 'webhook' && options.webhookSecret) {
\t\t\t\treturn options.webhookSecret;
\t\t\t}

\t\t\tif (source === 'webhook') {
\t\t\t\tconst res = await ctx.keys.get_webhook_signature();
\t\t\t\treturn res ?? '';
\t\t\t}

\t\t\tif (source === 'endpoint' && options.key) {
\t\t\t\treturn options.key;
\t\t\t}

\t\t\tif (source === 'endpoint' && ctx.authType === 'api_key') {
\t\t\t\tconst res = await ctx.keys.get_api_key();
\t\t\t\treturn res ?? '';
\t\t\t}

\t\t\treturn '';
\t\t},
\t} satisfies Internal${pascalName}Plugin;
}

export type {
\tExampleEvent,
\t${pascalName}WebhookOutputs,
} from './webhooks/types';

export type {
\t${pascalName}EndpointInputs,
\t${pascalName}EndpointOutputs,
\tExampleGetInput,
\tExampleGetResponse,
} from './endpoints/types';
`,
	);

	// ── client.ts ─────────────────────────────────────────────────────────────
	writeFileSync(
		join(pluginDir, 'client.ts'),
		`import type { ApiRequestOptions } from 'corsair/http';
import type { OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class ${pascalName}APIError extends Error {
\tconstructor(
\t\tmessage: string,
\t\tpublic readonly code?: string,
\t) {
\t\tsuper(message);
\t\tthis.name = '${pascalName}APIError';
\t}
}

// TODO: Update with your API base URL
const ${pascalName.toUpperCase()}_API_BASE = 'https://api.example.com';

export async function make${pascalName}Request<T>(
\tendpoint: string,
\tapiKey: string,
\toptions: {
\t\tmethod?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
\t\tbody?: Record<string, unknown>;
\t\tquery?: Record<string, string | number | boolean | undefined>;
\t} = {},
): Promise<T> {
\tconst { method = 'GET', body, query } = options;

\tconst config: OpenAPIConfig = {
\t\tBASE: ${pascalName.toUpperCase()}_API_BASE,
\t\tVERSION: '1.0.0',
\t\tWITH_CREDENTIALS: false,
\t\tCREDENTIALS: 'omit',
\t\tTOKEN: apiKey,
\t\tHEADERS: {
\t\t\t'Content-Type': 'application/json',
\t\t\t// TODO: Add authentication headers
\t\t\t// 'Authorization': \\\`Bearer \\\${apiKey}\\\`
\t\t},
\t};

\tconst requestOptions: ApiRequestOptions = {
\t\tmethod,
\t\turl: endpoint,
\t\tbody:
\t\t\tmethod === 'POST' || method === 'PUT' || method === 'PATCH'
\t\t\t\t? body
\t\t\t\t: undefined,
\t\tmediaType: 'application/json; charset=utf-8',
\t\tquery: method === 'GET' ? query : undefined,
\t};

\ttry {
\t\treturn await request<T>(config, requestOptions);
\t} catch (error) {
\t\tif (error instanceof Error) {
\t\t\tthrow new ${pascalName}APIError(error.message);
\t\t}
\t\tthrow new ${pascalName}APIError('Unknown error');
\t}
}
`,
	);

	// ── error-handlers.ts ─────────────────────────────────────────────────────
	writeFileSync(
		join(pluginDir, 'error-handlers.ts'),
		`import { ApiError } from 'corsair/http';
import type { CorsairErrorHandler } from 'corsair/core';

export const errorHandlers = {
\tRATE_LIMIT_ERROR: {
\t\tmatch: (error: Error) => {
\t\t\tif (error instanceof ApiError && error.status === 429) return true;
\t\t\tconst msg = error.message.toLowerCase();
\t\t\treturn msg.includes('rate_limited') || msg.includes('429');
\t\t},
\t\thandler: async (error: Error) => {
\t\t\tlet retryAfterMs: number | undefined;
\t\t\tif (error instanceof ApiError && error.retryAfter !== undefined) {
\t\t\t\tretryAfterMs = error.retryAfter;
\t\t\t}
\t\t\treturn { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
\t\t},
\t},
\tAUTH_ERROR: {
\t\tmatch: (error: Error) => {
\t\t\tif (error instanceof ApiError && error.status === 401) return true;
\t\t\tconst msg = error.message.toLowerCase();
\t\t\treturn msg.includes('unauthorized') || msg.includes('invalid_auth');
\t\t},
\t\thandler: async () => ({ maxRetries: 0 }),
\t},
\tDEFAULT: {
\t\tmatch: () => true,
\t\thandler: async () => ({ maxRetries: 0 }),
\t},
} satisfies CorsairErrorHandler;
`,
	);

	// ── endpoints/types.ts ────────────────────────────────────────────────────
	writeFileSync(
		join(pluginDir, 'endpoints', 'types.ts'),
		`import { z } from 'zod';

const ExampleGetInputSchema = z.object({
\tid: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
\tid: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ${pascalName}EndpointInputs = {
\texampleGet: ExampleGetInput;
};

export type ${pascalName}EndpointOutputs = {
\texampleGet: ExampleGetResponse;
};

export const ${pascalName}EndpointInputSchemas = {
\texampleGet: ExampleGetInputSchema,
} as const;

export const ${pascalName}EndpointOutputSchemas = {
\texampleGet: ExampleGetResponseSchema,
} as const;
`,
	);

	// ── endpoints/example.ts ──────────────────────────────────────────────────
	writeFileSync(
		join(pluginDir, 'endpoints', 'example.ts'),
		`import { logEventFromContext } from 'corsair/core';
import type { ${pascalName}Endpoints } from '..';
import type { ${pascalName}EndpointOutputs } from './types';
import { make${pascalName}Request } from '../client';

export const get: ${pascalName}Endpoints['exampleGet'] = async (ctx, input) => {
\tconst response = await make${pascalName}Request<${pascalName}EndpointOutputs['exampleGet']>(
\t\t\`example/\${input.id}\`,
\t\tctx.key,
\t\t{ method: 'GET' },
\t);

\tawait logEventFromContext(ctx, '${lowerName}.example.get', { ...input }, 'completed');
\treturn response;
};
`,
	);

	// ── endpoints/index.ts ────────────────────────────────────────────────────
	writeFileSync(
		join(pluginDir, 'endpoints', 'index.ts'),
		`import { get as exampleGet } from './example';

export const Example = {
\tget: exampleGet,
};

export * from './types';
`,
	);

	// ── webhooks/types.ts ─────────────────────────────────────────────────────
	writeFileSync(
		join(pluginDir, 'webhooks', 'types.ts'),
		`import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';

export interface ${pascalName}WebhookPayload {
\ttype: string;
\tcreated_at: string;
\tdata: Record<string, unknown>;
}

export interface ExampleEvent extends ${pascalName}WebhookPayload {
\ttype: 'example';
\tdata: {
\t\tid: string;
\t\t[key: string]: unknown;
\t};
}

export type ${pascalName}WebhookOutputs = {
\texample: ExampleEvent;
};

function parseBody(body: unknown): Record<string, unknown> {
\tif (typeof body === 'string') {
\t\treturn JSON.parse(body) as Record<string, unknown>;
\t}
\treturn (body ?? {}) as Record<string, unknown>;
}

export function create${pascalName}Match(eventType: string): CorsairWebhookMatcher {
\treturn (request: RawWebhookRequest) => {
\t\tconst parsedBody = parseBody(request.body);
\t\treturn typeof parsedBody.type === 'string' && parsedBody.type === eventType;
\t};
}

export function verify${pascalName}WebhookSignature(
\trequest: WebhookRequest<${pascalName}WebhookPayload>,
\tsecret: string,
): { valid: boolean; error?: string } {
\t// TODO: Implement webhook signature verification
\treturn { valid: true };
}
`,
	);

	// ── webhooks/example.ts ───────────────────────────────────────────────────
	writeFileSync(
		join(pluginDir, 'webhooks', 'example.ts'),
		`import { logEventFromContext } from 'corsair/core';
import type { ${pascalName}Webhooks } from '..';
import { create${pascalName}Match, verify${pascalName}WebhookSignature } from './types';

export const example: ${pascalName}Webhooks['example'] = {
\tmatch: create${pascalName}Match('example'),

\thandler: async (ctx, request) => {
\t\tconst verification = verify${pascalName}WebhookSignature(request, ctx.key);
\t\tif (!verification.valid) {
\t\t\treturn {
\t\t\t\tsuccess: false,
\t\t\t\tstatusCode: 401,
\t\t\t\terror: verification.error || 'Signature verification failed',
\t\t\t};
\t\t}

\t\tconst event = request.payload;
\t\tif (event.type !== 'example') {
\t\t\treturn { success: true, data: undefined };
\t\t}

\t\tawait logEventFromContext(ctx, '${lowerName}.webhook.example', { ...event }, 'completed');

\t\treturn { success: true, data: event };
\t},
};
`,
	);

	// ── webhooks/index.ts ─────────────────────────────────────────────────────
	writeFileSync(
		join(pluginDir, 'webhooks', 'index.ts'),
		`import { example } from './example';

export const ExampleWebhooks = {
\texample: example,
};

export * from './types';
`,
	);

	// ── schema/database.ts ────────────────────────────────────────────────────
	writeFileSync(
		join(pluginDir, 'schema', 'database.ts'),
		`import { z } from 'zod';

// TODO: Define your database entities here
// export const ${pascalName}Example = z.object({
// \tid: z.string(),
// \tname: z.string(),
// \tcreated_at: z.coerce.date().nullable().optional(),
// });
// export type ${pascalName}Example = z.infer<typeof ${pascalName}Example>;
`,
	);

	// ── schema/index.ts ───────────────────────────────────────────────────────
	writeFileSync(
		join(pluginDir, 'schema', 'index.ts'),
		`export const ${pascalName}Schema = {
\tversion: '1.0.0',
\tentities: {},
} as const;
`,
	);

	// ── Update core/constants.ts to register the new provider ─────────────────
	const constantsPath = join(packagesDir, 'corsair', 'core', 'constants.ts');
	if (existsSync(constantsPath)) {
		const content = readFileSync(constantsPath, 'utf-8');

		if (content.includes(`'${lowerName}'`)) {
			console.log(`⚠️  "${lowerName}" already exists in BaseProviders`);
		} else {
			const baseProvidersMatch = content.match(
				/export const BaseProviders = \[([\s\S]*?)\] as const;/,
			);

			if (baseProvidersMatch?.[1]) {
				const providers = baseProvidersMatch[1]
					.split('\n')
					.map((line) => line.trim())
					.filter((line) => line.startsWith("'"))
					.map((line) => line.replace(/['",]/g, '').trim());

				providers.push(lowerName);
				providers.sort();

				const newArray = providers.map((p) => `\t'${p}',`).join('\n');
				let updated = content.replace(
					/export const BaseProviders = \[[\s\S]*?\] as const;/,
					`export const BaseProviders = [\n${newArray}\n] as const;`,
				);

				const allProvidersMatch = content.match(
					/export type AllProviders =[\s\S]*?\| \(string & \{\}\);/,
				);
				if (allProvidersMatch) {
					const providersInType =
						allProvidersMatch[0]
							.match(/'[^']+'/g)
							?.map((m) => m.replace(/'/g, '')) || [];

					if (!providersInType.includes(lowerName)) {
						providersInType.push(lowerName);
						providersInType.sort();
						const newType = `export type AllProviders =\n\t| ${providersInType.map((p) => `'${p}'`).join('\n\t| ')}\n\t| (string & {});`;
						updated = updated.replace(
							/export type AllProviders =[\s\S]*?\| \(string & \{\}\);/,
							newType,
						);
					}
				}

				writeFileSync(constantsPath, updated);
				console.log('✅ Updated packages/corsair/core/constants.ts');
			}
		}
	}

	console.log(`✅ Created plugin at packages/${lowerName}/`);
	console.log(`\n📝 Next steps:`);
	console.log(`   1. Run: pnpm install`);
	console.log(`   2. Update the API base URL and auth in client.ts`);
	console.log(`   3. Replace the example endpoints/webhooks with real ones`);
	console.log(`   4. Run: cd packages/${lowerName} && pnpm typecheck`);
}

const pluginName = process.argv[2];

if (!pluginName) {
	console.error('Usage: pnpm generate:plugin <PluginName>');
	console.error('');
	console.error('Names must be PascalCase:');
	console.error('  pnpm generate:plugin Slack');
	console.error('  pnpm generate:plugin GoogleCalendar');
	console.error('  pnpm generate:plugin GitHub');
	process.exit(1);
}

generatePlugin(pluginName);
