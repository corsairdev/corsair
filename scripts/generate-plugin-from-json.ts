import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

// ── JSON shape ────────────────────────────────────────────────────────────────

interface ParameterDef {
	type: string;
	description?: string;
	required?: boolean;
	enum?: string[];
	properties?: Record<string, ParameterDef>;
	items?: ParameterDef;
	requiredFields?: string[] | string; // scraper sometimes emits a ref string
	title?: string;
}

interface Operation {
	slug: string;
	name: string;
	description?: string;
	tags?: string[];
	is_deprecated?: boolean;
	input_parameters?: Record<string, ParameterDef>;
	output_parameters?: Record<string, ParameterDef>;
}

interface AuthScheme {
	mode: string;
	name?: string;
	required_fields?: Array<{
		name: string;
		displayName: string;
		type: string;
		description?: string;
	}>;
}

interface IntegrationDef {
	name: string;
	slug: string;
	description?: string;
	auth_schemes?: AuthScheme[];
	operations?: Operation[];
	triggers?: unknown[];
}

// ── Name helpers ──────────────────────────────────────────────────────────────

const VERBS = new Set([
	'GET',
	'LIST',
	'CREATE',
	'UPDATE',
	'DELETE',
	'POST',
	'SET',
	'FETCH',
	'RETRIEVE',
	'VALIDATE',
	'CHECK',
	'SEND',
	'SEARCH',
	'FIND',
	'ADD',
	'REMOVE',
	'BULK',
	'BATCH',
	'RESOLVE',
	'GENERATE',
	'IMPORT',
	'EXPORT',
	'UPLOAD',
	'DOWNLOAD',
	'SYNC',
	'INVITE',
	'REVOKE',
	'CANCEL',
	'CONFIRM',
	'SUBMIT',
	'PUBLISH',
	'ARCHIVE',
	'RESTORE',
	'CLONE',
	'COPY',
	'MOVE',
	'RENAME',
	'SHARE',
	'TAG',
	'LINK',
	'UNLINK',
	'MERGE',
	'SPLIT',
	'ENABLE',
	'DISABLE',
	'ACTIVATE',
	'DEACTIVATE',
	'ASSIGN',
	'UNASSIGN',
	'TRACK',
	'VERIFY',
	'COMPLETE',
	'START',
	'STOP',
	'PAUSE',
	'RESUME',
	'REFRESH',
	'RESET',
	'REBUILD',
	'REPROCESS',
	'TRIGGER',
	'RUN',
]);

function stripPluginPrefix(slug: string, integrationSlug: string): string {
	// normalise both: upper-case, replace hyphens/leading-underscores with _
	const norm = (s: string) =>
		s
			.toUpperCase()
			.replace(/^_+/, '')
			.replace(/[^A-Z0-9]/g, '_');
	const prefix = norm(integrationSlug) + '_';
	const normSlug = norm(slug);
	if (normSlug.startsWith(prefix)) return normSlug.slice(prefix.length);
	// try without the prefix (some slugs duplicate the name differently)
	return normSlug;
}

function groupFromStripped(stripped: string): string {
	const parts = stripped.split('_').filter(Boolean);
	for (const part of parts) {
		if (!VERBS.has(part)) return part.toLowerCase();
	}
	return parts[0]?.toLowerCase() ?? 'operations';
}

/** Full camelCase key used in types/schemas/maps (e.g. `emailReputationApi`) */
function endpointKey(slug: string, integrationSlug: string): string {
	const stripped = stripPluginPrefix(slug, integrationSlug);
	const parts = stripped.split('_').filter(Boolean);
	return parts
		.map((p, i) =>
			i === 0
				? p.toLowerCase()
				: p.charAt(0).toUpperCase() + p.slice(1).toLowerCase(),
		)
		.join('');
}

function toPascalCase(s: string): string {
	return s
		.split(/[\s_-]+/)
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
		.join('');
}
function toCamelCase(s: string): string {
	const p = toPascalCase(s);
	return p.charAt(0).toLowerCase() + p.slice(1);
}

// ── Auth helpers ──────────────────────────────────────────────────────────────

function pickAuthType(schemes: AuthScheme[]): string {
	if (!schemes?.length) return 'api_key';
	switch (schemes[0].mode) {
		case 'API_KEY':
		case 'BEARER_TOKEN':
			return 'api_key';
		case 'OAUTH2':
		case 'DCR_OAUTH':
		case 'S2S_OAUTH2':
			return 'oauth2';
		case 'BASIC':
		case 'BASIC_WITH_JWT':
			return 'basic';
		case 'NO_AUTH':
			return 'no_auth';
		default:
			return 'api_key';
	}
}

function riskLevel(op: Operation): 'read' | 'write' | 'destructive' {
	const tags = op.tags ?? [];
	const lower = `${op.name} ${op.slug}`.toLowerCase();
	if (tags.includes('readOnlyHint')) return 'read';
	if (
		tags.includes('destructiveHint') ||
		/delete|remove|purge|destroy/.test(lower)
	)
		return 'destructive';
	return 'write';
}

function isWebhookOp(op: Operation): boolean {
	const tags = (op.tags ?? []).map((t) => t.toLowerCase());
	return (
		op.slug.toUpperCase().includes('WEBHOOK') ||
		op.slug.toUpperCase().includes('TRIGGER') ||
		tags.some((t) => t.includes('webhook') || t === 'trigger')
	);
}

// ── Zod schema code generation ────────────────────────────────────────────────

function requiredFields(param: ParameterDef): string[] {
	if (Array.isArray(param.requiredFields))
		return param.requiredFields as string[];
	return [];
}

function zodType(
	param: ParameterDef,
	depth: number,
	isRequired: boolean,
): string {
	const indent = '\t'.repeat(depth);
	const innerIndent = '\t'.repeat(depth + 1);

	let core: string;

	if (param.enum && param.type === 'string') {
		const vals = param.enum.map((v) => `'${v}'`).join(', ');
		core = `z.enum([${vals}])`;
	} else {
		switch (param.type) {
			case 'string':
				core = 'z.string()';
				break;
			case 'boolean':
				core = 'z.boolean()';
				break;
			case 'integer':
				core = 'z.number().int()';
				break;
			case 'number':
				core = 'z.number()';
				break;
			case 'array': {
				const itemZ = param.items
					? zodType(param.items, 0, true)
					: 'z.unknown()';
				core = `z.array(${itemZ})`;
				break;
			}
			case 'object': {
				if (param.properties && Object.keys(param.properties).length > 0) {
					const reqF = requiredFields(param);
					const props = Object.entries(param.properties)
						.map(([k, v]) => {
							const fieldRequired = reqF.includes(k) || v.required !== false;
							return `${innerIndent}${k}: ${zodType(v, depth + 1, fieldRequired)},`;
						})
						.join('\n');
					core = `z.object({\n${props}\n${indent}}).catchall(z.unknown())`;
				} else {
					core = 'z.record(z.unknown())';
				}
				break;
			}
			default:
				core = 'z.unknown()';
		}
	}

	return isRequired ? core : `${core}.optional()`;
}

function inputSchema(op: Operation): string {
	const params = Object.entries(op.input_parameters ?? {});
	if (params.length === 0) return 'z.object({}).optional()';
	const fields = params
		.map(([k, v]) => `\t${k}: ${zodType(v, 1, v.required !== false)},`)
		.join('\n');
	return `z.object({\n${fields}\n})`;
}

function outputSchema(op: Operation): string {
	const params = op.output_parameters ?? {};
	const data = params.data;

	// Most scraped ops wrap the real response in `data` — use its properties
	if (
		data?.type === 'object' &&
		data.properties &&
		Object.keys(data.properties).length > 0
	) {
		const reqF = requiredFields(data);
		const fields = Object.entries(data.properties)
			.map(([k, v]) => {
				const fieldRequired = reqF.includes(k) || v.required !== false;
				return `\t${k}: ${zodType(v, 1, fieldRequired)},`;
			})
			.join('\n');
		return `z.object({\n${fields}\n}).passthrough()`;
	}

	// Fallback: use raw params minus the envelope fields
	const relevant = Object.entries(params).filter(
		([k]) => k !== 'error' && k !== 'successful',
	);
	if (relevant.length === 0) return 'z.object({}).passthrough()';
	const fields = relevant
		.map(([k, v]) => `\t${k}: ${zodType(v, 1, v.required !== false)},`)
		.join('\n');
	return `z.object({\n${fields}\n}).passthrough()`;
}

// ── File content builders ─────────────────────────────────────────────────────

function buildEndpointsTypes(
	ops: Operation[],
	pascal: string,
	integrationSlug: string,
): string {
	const lines: string[] = ["import { z } from 'zod';", ''];

	for (const op of ops) {
		const key = endpointKey(op.slug, integrationSlug);
		const keyPascal = key.charAt(0).toUpperCase() + key.slice(1);

		lines.push(`// ${op.name}`);
		lines.push(`const ${keyPascal}InputSchema = ${inputSchema(op)};`);
		lines.push(
			`export type ${keyPascal}Input = z.infer<typeof ${keyPascal}InputSchema>;`,
		);
		lines.push('');
		lines.push(`const ${keyPascal}ResponseSchema = ${outputSchema(op)};`);
		lines.push(
			`export type ${keyPascal}Response = z.infer<typeof ${keyPascal}ResponseSchema>;`,
		);
		lines.push('');
	}

	// Input schemas map
	lines.push(`export const ${pascal}EndpointInputSchemas = {`);
	for (const op of ops) {
		const key = endpointKey(op.slug, integrationSlug);
		const keyPascal = key.charAt(0).toUpperCase() + key.slice(1);
		lines.push(`\t${key}: ${keyPascal}InputSchema,`);
	}
	lines.push('} as const;', '');

	lines.push(`export type ${pascal}EndpointInputs = {`);
	lines.push(
		`\t[K in keyof typeof ${pascal}EndpointInputSchemas]: z.infer<(typeof ${pascal}EndpointInputSchemas)[K]>;`,
	);
	lines.push('};', '');

	// Output schemas map
	lines.push(`export const ${pascal}EndpointOutputSchemas = {`);
	for (const op of ops) {
		const key = endpointKey(op.slug, integrationSlug);
		const keyPascal = key.charAt(0).toUpperCase() + key.slice(1);
		lines.push(`\t${key}: ${keyPascal}ResponseSchema,`);
	}
	lines.push('} as const;', '');

	lines.push(`export type ${pascal}EndpointOutputs = {`);
	lines.push(
		`\t[K in keyof typeof ${pascal}EndpointOutputSchemas]: z.infer<(typeof ${pascal}EndpointOutputSchemas)[K]>;`,
	);
	lines.push('};', '');

	// Named type exports
	for (const op of ops) {
		const key = endpointKey(op.slug, integrationSlug);
		const keyPascal = key.charAt(0).toUpperCase() + key.slice(1);
		lines.push(`export type { ${keyPascal}Input, ${keyPascal}Response };`);
	}

	return lines.join('\n');
}

function buildGroupEndpointFile(
	groupName: string,
	ops: Operation[],
	pascal: string,
	lower: string,
	integrationSlug: string,
): string {
	const lines: string[] = [
		"import { logEventFromContext } from 'corsair/core';",
		`import type { ${pascal}Endpoints } from '..';`,
		`import { make${pascal}Request } from '../client';`,
		`import type { ${pascal}EndpointOutputs } from './types';`,
		'',
	];

	for (const op of ops) {
		const key = endpointKey(op.slug, integrationSlug);
		const desc = op.description?.split('\n')[0].trim() ?? op.name;

		lines.push(`// ${op.name}`);
		if (op.description) lines.push(`// ${desc}`);
		lines.push(
			`export const ${key}: ${pascal}Endpoints['${key}'] = async (ctx, input) => {`,
		);
		lines.push(
			`\t// TODO: Verify the HTTP method, endpoint path, and how auth/params are passed.`,
		);
		lines.push(`\t// Docs hint: search for "${op.name} ${pascal} API"`);

		const isRead = riskLevel(op) === 'read';
		const method = isRead ? 'GET' : 'POST';
		lines.push(
			`\tconst response = await make${pascal}Request<${pascal}EndpointOutputs['${key}']>(`,
		);
		lines.push(
			`\t\t'TODO_PATH', // e.g. '${groupName}s' or 'v1/${groupName}s'`,
		);
		lines.push(`\t\tctx.key,`);

		if (isRead) {
			lines.push(
				`\t\t{ method: 'GET', query: input as Record<string, string | number | boolean | undefined> },`,
			);
		} else {
			lines.push(
				`\t\t{ method: '${method}', body: input as Record<string, unknown> },`,
			);
		}

		lines.push(`\t);`);
		lines.push(
			`\tawait logEventFromContext(ctx, '${lower}.${groupName}.${key}', input ?? {}, 'completed');`,
		);
		lines.push(`\treturn response;`);
		lines.push(`};`, '');
	}

	return lines.join('\n');
}

function buildEndpointsIndex(
	groupedOps: Map<string, Operation[]>,
	integrationSlug: string,
): string {
	const lines: string[] = [];

	for (const [group, ops] of groupedOps) {
		const groupPascal = toPascalCase(group);
		const keys = ops.map((op) => endpointKey(op.slug, integrationSlug));
		lines.push(`import { ${keys.join(', ')} } from './${group}';`);
		lines.push(`export const ${groupPascal} = { ${keys.join(', ')} };`);
		lines.push('');
	}

	lines.push("export * from './types';");
	return lines.join('\n');
}

function buildWebhooksTypes(pascal: string, lower: string): string {
	return `import { z } from 'zod';
import type {
\tCorsairWebhookMatcher,
\tRawWebhookRequest,
\tWebhookRequest,
} from 'corsair/core';

// Base webhook payload — TODO: update to match actual ${pascal} webhook shape
export const ${pascal}WebhookPayloadSchema = z.object({
\ttype: z.string(),
\tcreated_at: z.string().optional(),
\tdata: z.record(z.unknown()),
});
export type ${pascal}WebhookPayload = z.infer<typeof ${pascal}WebhookPayloadSchema>;

// TODO: Add event-specific schemas here.
// Example:
// export const SomeEventSchema = z.object({
// \ttype: z.literal('some.event'),
// \tcreated_at: z.string(),
// \tdata: z.object({ id: z.string() }).catchall(z.unknown()),
// });
// export type SomeEvent = z.infer<typeof SomeEventSchema>;

export type ${pascal}WebhookOutputs = {
\t// TODO: Add webhook event output types here once you know the event types
\t// example: someEvent: SomeEvent;
};

function parseBody(body: unknown): unknown {
\treturn typeof body === 'string' ? JSON.parse(body) : body;
}

export function create${pascal}EventMatch(eventType: string): CorsairWebhookMatcher {
\treturn (request: RawWebhookRequest) => {
\t\tconst parsed = parseBody(request.body) as Record<string, unknown>;
\t\treturn typeof parsed.type === 'string' && parsed.type === eventType;
\t};
}

export function verify${pascal}WebhookSignature(
\trequest: WebhookRequest<${pascal}WebhookPayload>,
\tsecret: string,
): { valid: boolean; error?: string } {
\t// TODO: Implement actual webhook signature verification.
\t// Check the ${pascal} docs for the signing algorithm and header name.
\t// Common patterns:
\t//   HMAC-SHA256: verifyHmacSignature(rawBody, secret, signature)
\t//   Svix: verifyHmacSignatureWithPrefix(rawBody, secret, signature, 'sha256=')
\tif (!secret) return { valid: false, error: 'No webhook secret configured' };
\treturn { valid: true };
}
`;
}

function buildWebhooksIndex(): string {
	return `// TODO: Add webhook event handlers here once you've identified the event types.
// See webhooks/types.ts for the base payload and helper functions.
// Follow the pattern in packages/resend/webhooks/emails.ts as a reference.

export * from './types';
`;
}

function buildIndexTs(
	pascal: string,
	camel: string,
	lower: string,
	authType: string,
	groupedOps: Map<string, Operation[]>,
	integrationSlug: string,
	description: string,
): string {
	const groupPascals = [...groupedOps.keys()].map((g) => toPascalCase(g));
	const groupImports = groupPascals.join(', ');

	// Build endpoint types map
	const allOps: Array<{ key: string; group: string; op: Operation }> = [];
	for (const [group, ops] of groupedOps) {
		for (const op of ops) {
			allOps.push({ key: endpointKey(op.slug, integrationSlug), group, op });
		}
	}

	const endpointsTypeLines = allOps.map(
		({ key }) => `\t${key}: ${pascal}Endpoint<'${key}'>;`,
	);

	// Build nested endpoints structure
	const nestedLines: string[] = [];
	for (const [group, ops] of groupedOps) {
		const groupPascal = toPascalCase(group);
		nestedLines.push(`\t${group}: {`);
		for (const op of ops) {
			const key = endpointKey(op.slug, integrationSlug);
			nestedLines.push(`\t\t${key}: ${groupPascal}.${key},`);
		}
		nestedLines.push(`\t},`);
	}

	// Build endpoint schemas
	const schemaLines = allOps.map(
		({ key, group }) =>
			`\t'${group}.${key}': {\n\t\tinput: ${pascal}EndpointInputSchemas.${key},\n\t\toutput: ${pascal}EndpointOutputSchemas.${key},\n\t},`,
	);

	// Build endpoint meta
	const metaLines = allOps.map(({ key, group, op }) => {
		const risk = riskLevel(op);
		const irreversible =
			risk === 'destructive' ? '\n\t\t\tirreversible: true,' : '';
		return `\t'${group}.${key}': {\n\t\t\triskLevel: '${risk}',${irreversible}\n\t\t\tdescription: '${op.name.replace(/'/g, "\\'")}',\n\t\t},`;
	});

	const authTypeLiteral = `'${authType}'`;
	const hasWebhooks = false; // placeholder — filled by agent

	return `import type {
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
import type { ${pascal}EndpointInputs, ${pascal}EndpointOutputs } from './endpoints/types';
import { ${pascal}EndpointInputSchemas, ${pascal}EndpointOutputSchemas } from './endpoints/types';
import type { ${pascal}WebhookOutputs } from './webhooks/types';
import { ${groupImports} } from './endpoints';
import { ${pascal}Schema } from './schema';
import { errorHandlers } from './error-handlers';

export type ${pascal}PluginOptions = {
\t/** ${description} */
\tauthType?: PickAuth<${authTypeLiteral}>;
\tkey?: string;
\twebhookSecret?: string;
\thooks?: Internal${pascal}Plugin['hooks'];
\twebhookHooks?: Internal${pascal}Plugin['webhookHooks'];
\terrorHandlers?: CorsairErrorHandler;
\tpermissions?: PluginPermissionsConfig<typeof ${camel}EndpointsNested>;
};

export type ${pascal}Context = CorsairPluginContext<typeof ${pascal}Schema, ${pascal}PluginOptions>;
export type ${pascal}KeyBuilderContext = KeyBuilderContext<${pascal}PluginOptions>;
export type ${pascal}BoundEndpoints = BindEndpoints<typeof ${camel}EndpointsNested>;

type ${pascal}Endpoint<K extends keyof ${pascal}EndpointOutputs> = CorsairEndpoint<
\t${pascal}Context,
\t${pascal}EndpointInputs[K],
\t${pascal}EndpointOutputs[K]
>;

export type ${pascal}Endpoints = {
${endpointsTypeLines.join('\n')}
};

export type ${pascal}BoundWebhooks = BindWebhooks<Record<string, never>>;

const ${camel}EndpointsNested = {
${nestedLines.join('\n')}
} as const;

const ${camel}WebhooksNested = {
\t// TODO: Add webhook handlers here once implemented
} as const;

export const ${camel}EndpointSchemas = {
${schemaLines.join('\n')}
} as const;

const defaultAuthType: AuthTypes = ${authTypeLiteral} as const;

const ${camel}EndpointMeta = {
${metaLines.join('\n')}
} satisfies RequiredPluginEndpointMeta<typeof ${camel}EndpointsNested>;

export const ${camel}AuthConfig = {
\t${authType}: {
\t\taccount: ['one'] as const,
\t},
} as const satisfies PluginAuthConfig;

export type Base${pascal}Plugin<T extends ${pascal}PluginOptions> = CorsairPlugin<
\t'${lower}',
\ttypeof ${pascal}Schema,
\ttypeof ${camel}EndpointsNested,
\ttypeof ${camel}WebhooksNested,
\tT,
\ttypeof defaultAuthType
>;

export type Internal${pascal}Plugin = Base${pascal}Plugin<${pascal}PluginOptions>;
export type External${pascal}Plugin<T extends ${pascal}PluginOptions> = Base${pascal}Plugin<T>;

export function ${lower}<const T extends ${pascal}PluginOptions>(
\tincomingOptions: ${pascal}PluginOptions & T = {} as ${pascal}PluginOptions & T,
): External${pascal}Plugin<T> {
\tconst options = {
\t\t...incomingOptions,
\t\tauthType: incomingOptions.authType ?? defaultAuthType,
\t};
\treturn {
\t\tid: '${lower}',
\t\tschema: ${pascal}Schema,
\t\toptions,
\t\thooks: options.hooks,
\t\twebhookHooks: options.webhookHooks,
\t\tendpoints: ${camel}EndpointsNested,
\t\twebhooks: ${camel}WebhooksNested,
\t\tendpointMeta: ${camel}EndpointMeta,
\t\tendpointSchemas: ${camel}EndpointSchemas,
\t\tpluginWebhookMatcher: (request) => {
\t\t\t// TODO: Update to match ${pascal} webhook signature headers
\t\t\treturn 'x-${lower}-signature' in request.headers;
\t\t},
\t\terrorHandlers: {
\t\t\t...errorHandlers,
\t\t\t...options.errorHandlers,
\t\t},
\t\tkeyBuilder: async (ctx: ${pascal}KeyBuilderContext, source) => {
\t\t\tif (source === 'webhook' && options.webhookSecret) return options.webhookSecret;
\t\t\tif (source === 'webhook') {
\t\t\t\tconst res = await ctx.keys.get_webhook_signature();
\t\t\t\treturn res ?? '';
\t\t\t}
\t\t\tif (source === 'endpoint' && options.key) return options.key;
\t\t\tif (source === 'endpoint' && ctx.authType === 'api_key') {
\t\t\t\tconst res = await ctx.keys.get_api_key();
\t\t\t\treturn res ?? '';
\t\t\t}
\t\t\treturn '';
\t\t},
\t} satisfies Internal${pascal}Plugin;
}

export type { ${pascal}WebhookOutputs } from './webhooks/types';
export type { ${pascal}EndpointInputs, ${pascal}EndpointOutputs } from './endpoints/types';
`;
}

function buildClientTs(pascal: string, lower: string): string {
	return `import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class ${pascal}APIError extends Error {
\tconstructor(
\t\tmessage: string,
\t\tpublic readonly code?: string,
\t) {
\t\tsuper(message);
\t\tthis.name = '${pascal}APIError';
\t}
}

// TODO: Replace with the real base URL from the ${pascal} API docs
const ${pascal.toUpperCase()}_API_BASE = 'https://api.TODO_${lower}.com';

export async function make${pascal}Request<T>(
\tendpoint: string,
\tapiKey: string,
\toptions: {
\t\tmethod?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
\t\tbody?: Record<string, unknown>;
\t\tquery?: Record<string, string | number | boolean | undefined>;
\t} = {},
): Promise<T> {
\tconst { method = 'GET', body, query } = options;

\t// TODO: Update HEADERS to match the ${pascal} API auth format.
\t// Common patterns:
\t//   Bearer token:  'Authorization': \`Bearer \${apiKey}\`
\t//   API key header: 'X-Api-Key': apiKey  (or 'X-${pascal}-Key', 'Api-Key', etc.)
\t//   Query param:   add apiKey to the \`query\` object below (some APIs use ?api_key=...)
\tconst config: OpenAPIConfig = {
\t\tBASE: ${pascal.toUpperCase()}_API_BASE,
\t\tVERSION: '1.0.0',
\t\tWITH_CREDENTIALS: false,
\t\tCREDENTIALS: 'omit',
\t\tTOKEN: apiKey,
\t\tHEADERS: {
\t\t\t'Content-Type': 'application/json',
\t\t\t// TODO: Replace with correct auth header for ${pascal}
\t\t\t'Authorization': \`Bearer \${apiKey}\`,
\t\t},
\t};

\tconst requestOptions: ApiRequestOptions = {
\t\tmethod,
\t\turl: endpoint,
\t\tbody: method === 'POST' || method === 'PUT' || method === 'PATCH' ? body : undefined,
\t\tmediaType: 'application/json; charset=utf-8',
\t\tquery: method === 'GET' ? query : undefined,
\t};

\ttry {
\t\treturn await request<T>(config, requestOptions);
\t} catch (error) {
\t\tif (error instanceof Error) throw new ${pascal}APIError(error.message);
\t\tthrow new ${pascal}APIError('Unknown error');
\t}
}
`;
}

function buildAgentMd(
	def: IntegrationDef,
	pascal: string,
	lower: string,
	authType: string,
	groupedOps: Map<string, Operation[]>,
	integrationSlug: string,
): string {
	const authScheme = def.auth_schemes?.[0];
	const keyFieldName = authScheme?.required_fields?.[0]?.name ?? 'api_key';
	const keyDisplayName =
		authScheme?.required_fields?.[0]?.displayName ?? 'API Key';
	const authMode = authScheme?.mode ?? 'API_KEY';

	const allOps: Array<{ key: string; group: string; op: Operation }> = [];
	for (const [group, ops] of groupedOps) {
		for (const op of ops) {
			allOps.push({ key: endpointKey(op.slug, integrationSlug), group, op });
		}
	}

	const opTable = allOps
		.map(({ key, group, op }) => {
			const risk = riskLevel(op);
			return `| \`${group}.${key}\` | ${op.name} | \`${risk}\` | ${op.description?.split('.')[0] ?? ''} |`;
		})
		.join('\n');

	const endpointTodos = allOps
		.map(({ key, group, op }) => {
			const isRead = riskLevel(op) === 'read';
			return `### \`${group}.${key}\` — ${op.name}
- **Description:** ${op.description?.split('\n')[0] ?? op.name}
- **File:** \`endpoints/${group}.ts\`
- [ ] Set the correct HTTP method (\`GET\`/\`POST\`/\`PUT\`/\`DELETE\`/\`PATCH\`)
- [ ] Set the correct endpoint path (e.g., \`/v1/${group}s\` or \`/${group}/${key}\`)
- [ ] Confirm params go in \`query\` (GET) or \`body\` (POST/PUT) — currently defaulted to **${isRead ? 'query' : 'body'}**
- [ ] Verify the input schema in \`endpoints/types.ts\` matches actual API docs`;
		})
		.join('\n\n');

	return `# ${def.name} Plugin — Agent Completion Guide

> **Auto-generated from scraped API spec.** The Zod schemas, types, and plugin wiring
> are complete. Your job is to fill in the actual HTTP details and write tests.

## About this integration

${def.description ?? `${def.name} API integration for Corsair.`}

- **Auth mode:** \`${authMode}\` → mapped to Corsair \`${authType}\`
- **Key field:** \`${keyFieldName}\` (${keyDisplayName})
- **Total operations:** ${allOps.length}

---

## Step 1 — Find the docs

Search for: **"${def.name} API documentation"** or **"${def.name} developer docs"**

You're looking for:
1. The **base API URL** (e.g., \`https://api.${lower}.com/v1\`)
2. The **authentication format** — how the key is passed (header name, query param, Bearer prefix)
3. The **endpoint paths** for each operation below

---

## Step 2 — Fill in \`client.ts\`

Open \`client.ts\` and:

- [ ] Replace \`https://api.TODO_${lower}.com\` with the real base URL
- [ ] Update the \`HEADERS\` block to use the correct auth format

Common patterns to look for in the docs:
\`\`\`
Authorization: Bearer {api_key}       ← most common
X-Api-Key: {api_key}                  ← also common
?api_key={api_key}                    ← query param (add to query object instead)
Authorization: Basic base64(key:)     ← for BASIC auth
\`\`\`

---

## Step 3 — Fill in each endpoint

The functions are in \`endpoints/{group}.ts\`. Each has a \`TODO_PATH\` and \`TODO_METHOD\` placeholder.
Replace them with the real path and method from the docs.

### All operations (${allOps.length} total)

| Endpoint | Name | Risk | Description |
|---|---|---|---|
${opTable}

---

${endpointTodos}

---

## Step 4 — Webhooks

${
	allOps.length > 0 && def.operations?.some(isWebhookOp)
		? `
This integration has webhook-related operations. Check the docs for:
- [ ] The webhook signature header name and HMAC algorithm
- [ ] Update \`verify${pascal}WebhookSignature\` in \`webhooks/types.ts\`
- [ ] Update \`pluginWebhookMatcher\` in \`index.ts\` to check the correct header
- [ ] Add event-specific schemas to \`webhooks/types.ts\`
- [ ] Implement webhook handlers in \`webhooks/\`
`
		: `
This integration does not have documented webhook triggers in the scraped spec.

Check the docs to confirm:
- [ ] Does ${def.name} support webhooks? If yes, add them following the Resend plugin as a reference (\`packages/resend/webhooks/\`).
- [ ] If no webhooks, the empty \`webhooksNested\` in \`index.ts\` is correct.
`
}

---

## Step 5 — Typecheck

\`\`\`bash
cd packages/${lower} && pnpm typecheck
# or from the root:
pnpm typecheck
\`\`\`

Fix any TypeScript errors before moving on.

---

## Step 6 — Write tests

Create a \`tests/\` directory in this package. Write at minimum:

1. **Schema validation tests** — confirm the Zod schemas accept valid payloads and reject invalid ones
2. **Endpoint stub tests** — mock \`make${pascal}Request\` and verify the correct path/method/params are passed
3. **At least one happy-path integration test** if you have access to a ${def.name} sandbox/test account

Reference: look at existing test files in \`packages/resend/\` or \`packages/slack/\` for patterns.

---

## Step 7 — Register in your corsair instance

After the plugin is complete, add it to your app's \`corsair.ts\`:

\`\`\`ts
import { ${lower} } from '@corsair-dev/${lower}';

export const corsair = createCorsair({
  plugins: [
    ${lower}({ key: process.env.${pascal.toUpperCase()}_API_KEY }),
    // ... other plugins
  ],
});
\`\`\`
`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function generatePluginFromJson(input: string) {
	// Accept either a file path or a slug name
	let jsonPath: string;
	const scraperOutputDir = join(
		import.meta.dirname,
		'..',
		'..',
		'scraper',
		'output',
	);

	if (input.endsWith('.json')) {
		jsonPath = resolve(input);
	} else {
		// Try slug lookup in scraper output
		const candidates = [
			join(scraperOutputDir, `${input}.json`),
			join(scraperOutputDir, `_${input}.json`),
		];
		const found = candidates.find(existsSync);
		if (!found) {
			console.error(
				`Could not find JSON file for "${input}". Tried:\n  ${candidates.join('\n  ')}`,
			);
			process.exit(1);
		}
		jsonPath = found;
	}

	if (!existsSync(jsonPath)) {
		console.error(`File not found: ${jsonPath}`);
		process.exit(1);
	}

	const def: IntegrationDef = JSON.parse(readFileSync(jsonPath, 'utf-8'));

	// Normalise the plugin name: strip leading underscores/numbers, lowercase
	const lowerName = def.slug
		.replace(/^[^a-z]+/i, '')
		.replace(/[^a-z0-9]/gi, '')
		.toLowerCase();
	const pascalName = toPascalCase(lowerName);
	const camelName = toCamelCase(lowerName);
	const authType = pickAuthType(def.auth_schemes ?? []);

	const rootDir = join(import.meta.dirname, '..');
	const packagesDir = join(rootDir, 'packages');
	const pluginDir = join(packagesDir, lowerName);

	if (existsSync(pluginDir)) {
		console.error(
			`Plugin "${lowerName}" already exists at packages/${lowerName}`,
		);
		process.exit(1);
	}

	const allOps = (def.operations ?? []).filter((op) => !op.is_deprecated);
	const apiOps = allOps.filter((op) => !isWebhookOp(op));

	if (apiOps.length === 0) {
		console.warn(`Warning: no API operations found in ${jsonPath}`);
	}

	// Group by resource type
	const groupedOps = new Map<string, Operation[]>();
	for (const op of apiOps) {
		const group = groupFromStripped(stripPluginPrefix(op.slug, def.slug));
		if (!groupedOps.has(group)) groupedOps.set(group, []);
		groupedOps.get(group)!.push(op);
	}

	// Create directories
	mkdirSync(join(pluginDir, 'endpoints'), { recursive: true });
	mkdirSync(join(pluginDir, 'webhooks'), { recursive: true });
	mkdirSync(join(pluginDir, 'schema'), { recursive: true });

	// ── package.json ──
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
		peerDependencies: { corsair: '>=0.1.0', zod: '^3.0.0' },
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

	// ── tsconfig.json ──
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

	// ── tsup.config.ts ──
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

	// ── client.ts ──
	writeFileSync(
		join(pluginDir, 'client.ts'),
		buildClientTs(pascalName, lowerName),
	);

	// ── error-handlers.ts ──
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

	// ── schema/database.ts + schema/index.ts ──
	writeFileSync(
		join(pluginDir, 'schema', 'database.ts'),
		`import { z } from 'zod';

// TODO: Define database entity schemas here if you want Corsair to persist data.
// Example:
// export const ${pascalName}Item = z.object({
// \tid: z.string(),
// \tcreated_at: z.coerce.date().nullable().optional(),
// });
// export type ${pascalName}Item = z.infer<typeof ${pascalName}Item>;
`,
	);
	writeFileSync(
		join(pluginDir, 'schema', 'index.ts'),
		`export const ${pascalName}Schema = {
\tversion: '1.0.0',
\tentities: {},
} as const;
`,
	);

	// ── endpoints/types.ts ──
	writeFileSync(
		join(pluginDir, 'endpoints', 'types.ts'),
		buildEndpointsTypes(apiOps, pascalName, def.slug),
	);

	// ── endpoints/{group}.ts ──
	for (const [group, ops] of groupedOps) {
		writeFileSync(
			join(pluginDir, 'endpoints', `${group}.ts`),
			buildGroupEndpointFile(group, ops, pascalName, lowerName, def.slug),
		);
	}

	// ── endpoints/index.ts ──
	writeFileSync(
		join(pluginDir, 'endpoints', 'index.ts'),
		buildEndpointsIndex(groupedOps, def.slug),
	);

	// ── webhooks/types.ts ──
	writeFileSync(
		join(pluginDir, 'webhooks', 'types.ts'),
		buildWebhooksTypes(pascalName, lowerName),
	);

	// ── webhooks/index.ts ──
	writeFileSync(join(pluginDir, 'webhooks', 'index.ts'), buildWebhooksIndex());

	// ── index.ts ──
	writeFileSync(
		join(pluginDir, 'index.ts'),
		buildIndexTs(
			pascalName,
			camelName,
			lowerName,
			authType,
			groupedOps,
			def.slug,
			def.description ?? '',
		),
	);

	// ── AGENT.md ──
	writeFileSync(
		join(pluginDir, 'AGENT.md'),
		buildAgentMd(def, pascalName, lowerName, authType, groupedOps, def.slug),
	);

	// ── Update core/constants.ts ──
	const constantsPath = join(packagesDir, 'corsair', 'core', 'constants.ts');
	if (existsSync(constantsPath)) {
		const content = readFileSync(constantsPath, 'utf-8');
		if (!content.includes(`'${lowerName}'`)) {
			const bpMatch = content.match(
				/export const BaseProviders = \[([\s\S]*?)\] as const;/,
			);
			if (bpMatch?.[1]) {
				const providers = bpMatch[1]
					.split('\n')
					.map((l) => l.trim())
					.filter((l) => l.startsWith("'"))
					.map((l) => l.replace(/['",]/g, '').trim());
				providers.push(lowerName);
				providers.sort();
				const newArray = providers.map((p) => `\t'${p}',`).join('\n');
				let updated = content.replace(
					/export const BaseProviders = \[[\s\S]*?\] as const;/,
					`export const BaseProviders = [\n${newArray}\n] as const;`,
				);
				const apMatch = content.match(
					/export type AllProviders =[\s\S]*?\| \(string & \{\}\);/,
				);
				if (apMatch) {
					const inType =
						apMatch[0].match(/'[^']+'/g)?.map((m) => m.replace(/'/g, '')) || [];
					if (!inType.includes(lowerName)) {
						inType.push(lowerName);
						inType.sort();
						const newType = `export type AllProviders =\n\t| ${inType.map((p) => `'${p}'`).join('\n\t| ')}\n\t| (string & {});`;
						updated = updated.replace(
							/export type AllProviders =[\s\S]*?\| \(string & \{\}\);/,
							newType,
						);
					}
				}
				writeFileSync(constantsPath, updated);
				console.log('  Updated packages/corsair/core/constants.ts');
			}
		}
	}

	const opCount = apiOps.length;
	const groupCount = groupedOps.size;
	console.log(`\nPlugin generated: packages/${lowerName}/`);
	console.log(
		`  ${opCount} operations across ${groupCount} group${groupCount !== 1 ? 's' : ''}: ${[...groupedOps.keys()].join(', ')}`,
	);
	console.log(`  Auth type: ${authType}`);
	console.log(`\nNext steps:`);
	console.log(`  1. Read packages/${lowerName}/AGENT.md for full instructions`);
	console.log(`  2. Fill in client.ts (API base URL + auth header)`);
	console.log(`  3. Fill in each endpoint's path and method`);
	console.log(`  4. Run: cd packages/${lowerName} && pnpm typecheck`);
}

// ── Entry ─────────────────────────────────────────────────────────────────────

const input = process.argv[2];
if (!input) {
	console.error('Usage: pnpm generate:plugin-from-json <slug-or-path>');
	console.error('');
	console.error('Examples:');
	console.error('  pnpm generate:plugin-from-json abstract');
	console.error(
		'  pnpm generate:plugin-from-json ../scraper/output/abstract.json',
	);
	process.exit(1);
}

generatePluginFromJson(input);
