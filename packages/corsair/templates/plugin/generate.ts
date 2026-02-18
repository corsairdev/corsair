import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Validates that the plugin name is in PascalCase format
 * Throws an error if the name contains invalid characters (kebab-case, snake_case, etc.)
 */
function validatePascalCase(name: string): void {
	// Check for kebab-case (contains hyphens)
	if (name.includes('-')) {
		throw new Error(
			`Invalid plugin name: "${name}". Plugin names must be in PascalCase (e.g., "Slack", "GoogleCalendar"). Kebab-case is not allowed.`,
		);
	}

	// Check for snake_case (contains underscores)
	if (name.includes('_')) {
		throw new Error(
			`Invalid plugin name: "${name}". Plugin names must be in PascalCase (e.g., "Slack", "GoogleCalendar"). Snake_case is not allowed.`,
		);
	}

	// Check for spaces
	if (name.includes(' ')) {
		throw new Error(
			`Invalid plugin name: "${name}". Plugin names must be in PascalCase (e.g., "Slack", "GoogleCalendar"). Spaces are not allowed.`,
		);
	}

	// Must start with an uppercase letter
	if (!/^[A-Z]/.test(name)) {
		throw new Error(
			`Invalid plugin name: "${name}". Plugin names must be in PascalCase and start with an uppercase letter (e.g., "Slack", "GoogleCalendar").`,
		);
	}

	// Must contain only letters (no numbers or special characters)
	if (!/^[A-Z][a-zA-Z]*$/.test(name)) {
		throw new Error(
			`Invalid plugin name: "${name}". Plugin names must contain only letters in PascalCase format (e.g., "Slack", "GoogleCalendar").`,
		);
	}
}

/**
 * Converts PascalCase to camelCase
 * Examples:
 * - "Slack" -> "slack"
 * - "GoogleCalendar" -> "googleCalendar"
 */
function toCamelCase(pascalName: string): string {
	return pascalName.charAt(0).toLowerCase() + pascalName.slice(1);
}

function generatePlugin(pluginName: string) {
	// Validate input is PascalCase
	validatePascalCase(pluginName);

	const pascalName = pluginName; // Already in PascalCase
	const camelName = toCamelCase(pluginName);
	const lowerName = pluginName.toLowerCase();

	// Determine the base directory - check if plugins directory exists in current dir, otherwise look for packages/corsair
	const cwd = process.cwd();
	let baseDir = cwd;

	if (!existsSync(join(cwd, 'plugins'))) {
		const possibleBaseDir = join(cwd, 'packages/corsair');
		if (existsSync(join(possibleBaseDir, 'plugins'))) {
			baseDir = possibleBaseDir;
		}
	}

	const pluginsDir = join(baseDir, 'plugins');
	const pluginDir = join(pluginsDir, lowerName);

	if (existsSync(pluginDir)) {
		console.error(`Plugin "${lowerName}" already exists at ${pluginDir}`);
		process.exit(1);
	}

	// Create directory structure
	mkdirSync(pluginDir, { recursive: true });
	mkdirSync(join(pluginDir, 'endpoints'), { recursive: true });
	mkdirSync(join(pluginDir, 'webhooks'), { recursive: true });
	mkdirSync(join(pluginDir, 'schema'), { recursive: true });

	// Generate index.ts
	const indexTs = `import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PluginAuthConfig,
} from '../../core';
import type { AuthTypes, PickAuth } from '../../core/constants';
import type { ${pascalName}EndpointOutputs } from './endpoints/types';
import type {
	${pascalName}WebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { Example } from './endpoints';
import { ${pascalName}Schema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';

/**
 * Plugin options type - configure authentication and behavior
 * 
 * AUTH CONFIGURATION:
 * - authType: The authentication method to use. Options:
 *   - 'api_key': For API key authentication (most common)
 *   - 'oauth_2': For OAuth 2.0 authentication
 *   - 'bot_token': For bot token authentication
 *   Update PickAuth<'api_key'> to include all auth types your plugin supports.
 *   Example: PickAuth<'api_key' | 'oauth_2'> for plugins that support both.
 * 
 * - key: Optional API key to use directly (bypasses key manager)
 * - webhookSecret: Optional webhook secret for signature verification
 */
export type ${pascalName}PluginOptions = {
	// TODO: Update authType to match your plugin's supported auth methods
	// Example: PickAuth<'api_key' | 'oauth_2'> if you support OAuth
	authType?: PickAuth<'api_key'>;
	// Optional: Direct API key (overrides key manager)
	key?: string;
	// Optional: Webhook secret for signature verification
	webhookSecret?: string;
	// Optional: Lifecycle hooks for endpoints
	hooks?: Internal${pascalName}Plugin['hooks'];
	// Optional: Lifecycle hooks for webhooks
	webhookHooks?: Internal${pascalName}Plugin['webhookHooks'];
	// Optional: Custom error handlers (merged with default error handlers)
	errorHandlers?: CorsairErrorHandler;
};

export type ${pascalName}Context = CorsairPluginContext<
	typeof ${pascalName}Schema,
	${pascalName}PluginOptions
>;

export type ${pascalName}KeyBuilderContext = KeyBuilderContext<${pascalName}PluginOptions>;

export type ${pascalName}BoundEndpoints = BindEndpoints<typeof ${camelName}EndpointsNested>;

type ${pascalName}Endpoint<
	K extends keyof ${pascalName}EndpointOutputs,
	Input,
> = CorsairEndpoint<${pascalName}Context, Input, ${pascalName}EndpointOutputs[K]>;

export type ${pascalName}Endpoints = {
	exampleGet: ${pascalName}Endpoint<'exampleGet', { id: string }>;
};

type ${pascalName}Webhook<
	K extends keyof ${pascalName}WebhookOutputs,
	TEvent,
> = CorsairWebhook<${pascalName}Context, TEvent, ${pascalName}WebhookOutputs[K]>;

export type ${pascalName}Webhooks = {
	example: ${pascalName}Webhook<'example', ExampleEvent>;
};

export type ${pascalName}BoundWebhooks = BindWebhooks<${pascalName}Webhooks>;

const ${camelName}EndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const ${camelName}WebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

/**
 * Default authentication type for this plugin
 * 
 * AUTH CONFIGURATION:
 * Change this to match your plugin's default auth method:
 * - 'api_key': For API key authentication
 * - 'oauth_2': For OAuth 2.0 authentication  
 * - 'bot_token': For bot token authentication
 */
const defaultAuthType: AuthTypes = 'api_key';

/**
 * Authentication configuration
 * 
 * AUTH CONFIGURATION:
 * This defines which auth types are supported and how accounts are structured.
 * 
 * For 'api_key' auth:
 *   - account: ['one'] means single account per plugin instance
 *   - account: ['many'] means multiple accounts per plugin instance
 * 
 * For 'oauth_2' auth:
 *   - account: ['one'] or ['many'] depending on your needs
 *   - You may also need to add 'scopes' configuration
 * 
 * Example for OAuth 2.0:
 * export const ${camelName}AuthConfig = {
 *   oauth_2: {
 *     account: ['one'] as const,
 *     scopes: ['read', 'write'] as const,
 *   },
 * } as const satisfies PluginAuthConfig;
 * 
 * Example for multiple auth types:
 * export const ${camelName}AuthConfig = {
 *   api_key: {
 *     account: ['one'] as const,
 *   },
 *   oauth_2: {
 *     account: ['one'] as const,
 *     scopes: ['read', 'write'] as const,
 *   },
 * } as const satisfies PluginAuthConfig;
 */
export const ${camelName}AuthConfig = {
	api_key: {
		// TODO: Change to ['many'] if you support multiple accounts per instance
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type Base${pascalName}Plugin<T extends ${pascalName}PluginOptions> = CorsairPlugin<
	'${lowerName}',
	typeof ${pascalName}Schema,
	typeof ${camelName}EndpointsNested,
	typeof ${camelName}WebhooksNested,
	T,
	typeof defaultAuthType
>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type Internal${pascalName}Plugin = Base${pascalName}Plugin<${pascalName}PluginOptions>;

export type External${pascalName}Plugin<T extends ${pascalName}PluginOptions> =
	Base${pascalName}Plugin<T>;

export function ${lowerName}<const T extends ${pascalName}PluginOptions>(
	incomingOptions: ${pascalName}PluginOptions & T = {} as ${pascalName}PluginOptions & T,
): External${pascalName}Plugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: '${lowerName}',
		schema: ${pascalName}Schema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: ${camelName}EndpointsNested,
		webhooks: ${camelName}WebhooksNested,
		/**
		 * Webhook matcher function - determines if an incoming request is a webhook for this plugin
		 * 
		 * WEBHOOK CONFIGURATION:
		 * Update this to check for headers that identify your provider's webhooks.
		 * Common patterns:
		 * - Check for signature headers (e.g., 'x-${lowerName}-signature')
		 * - Check for user-agent strings
		 * - Check for specific path patterns
		 * 
		 * Example for multiple headers:
		 * pluginWebhookMatcher: (request) => {
		 *   const headers = request.headers;
		 *   return 'x-${lowerName}-signature' in headers && 'x-${lowerName}-timestamp' in headers;
		 * },
		 */
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update this to match your webhook signature headers
			const hasSignature = 'x-${lowerName}-signature' in headers;
			return hasSignature;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		/**
		 * Key builder function - retrieves the appropriate key/secret for API calls or webhook verification
		 * 
		 * AUTH CONFIGURATION:
		 * This function determines which key to use based on:
		 * - source: 'endpoint' (for API calls) or 'webhook' (for webhook verification)
		 * - ctx.authType: The authentication type being used
		 * 
		 * Priority order:
		 * 1. Direct options (options.key, options.webhookSecret)
		 * 2. Key manager (ctx.keys.get_api_key(), ctx.keys.get_access_token(), etc.)
		 * 
		 * For OAuth 2.0, you'll need to add:
		 * } else if (ctx.authType === 'oauth_2') {
		 *   const res = await ctx.keys.get_access_token();
		 *   if (!res) return '';
		 *   return res;
		 * }
		 * 
		 * For bot_token, you'll need to add:
		 * } else if (ctx.authType === 'bot_token') {
		 *   const res = await ctx.keys.get_bot_token();
		 *   if (!res) return '';
		 *   return res;
		 * }
		 */
		keyBuilder: async (ctx: ${pascalName}KeyBuilderContext, source) => {
			// Webhook signature verification - check direct option first
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			// Webhook signature from key manager
			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					return '';
				}

				return res;
			}

			// Endpoint API calls - check direct option first
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			// Endpoint API calls - get from key manager based on auth type
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					return '';
				}

				return res;
			}

			// TODO: Add support for other auth types if needed
			// Example for OAuth 2.0:
			// } else if (ctx.authType === 'oauth_2') {
			//   const res = await ctx.keys.get_access_token();
			//   if (!res) return '';
			//   return res;
			// }

			return '';
		},
	} satisfies Internal${pascalName}Plugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	ExampleEvent,
	${pascalName}WebhookOutputs,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	${pascalName}EndpointOutputs,
	ExampleGetResponse,
} from './endpoints/types';
`;

	// Generate endpoints/types.ts
	const endpointsTypesTs = `import { z } from 'zod';

const ExampleGetResponseSchema = z.object({
	id: z.string(),
	// TODO: Add your response fields here
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ${pascalName}EndpointOutputs = {
	exampleGet: ExampleGetResponse;
};
`;

	// Generate endpoints/example.ts
	const endpointsExampleTs = `import type { ${pascalName}BoundEndpoints, ${pascalName}Endpoints } from '..';
import type { ${pascalName}EndpointOutputs } from './types';
import { logEventFromContext } from '../../utils/events';
import { make${pascalName}Request } from '../client';

export const get: ${pascalName}Endpoints['exampleGet'] = async (ctx, input) => {
	const response = await make${pascalName}Request<${pascalName}EndpointOutputs['exampleGet']>(
		\`example/\${input.id}\`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'${lowerName}.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
`;

	// Generate endpoints/index.ts
	const endpointsIndexTs = `import { get as exampleGet } from './example';

export const Example = {
	get: exampleGet,
};

export * from './types';
`;

	// Generate webhooks/types.ts
	const webhooksTypesTs = `/**
 * Base webhook payload interface
 * 
 * CONFIGURATION:
 * Update this to match your provider's webhook payload structure.
 * Most providers include a 'type' field and 'data' field, but the structure may vary.
 */
export interface ${pascalName}WebhookPayload {
	type: string;
	created_at: string;
	data: {
		[key: string]: any;
	};
	// TODO: Add provider-specific fields if needed
	// Example:
	// id: string;
	// timestamp: number;
}

/**
 * Webhook Event Types
 * 
 * CONFIGURATION:
 * - Replace ExampleEvent with your actual webhook event types
 * - Each event type should extend ${pascalName}WebhookPayload
 * - Add all event-specific fields in the data object
 * 
 * Example:
 * export interface UserCreatedEvent extends ${pascalName}WebhookPayload {
 *   type: 'user.created';
 *   data: {
 *     user_id: string;
 *     email: string;
 *     name: string;
 *   };
 * }
 */
export interface ExampleEvent extends ${pascalName}WebhookPayload {
	type: 'example';
	data: {
		id: string;
		// TODO: Add your event data fields here
		[key: string]: any;
	};
}

/**
 * Webhook Outputs Type
 * 
 * Maps each webhook key to its event type.
 * This is used by the plugin system for type inference.
 * 
 * CONFIGURATION:
 * - Replace 'example' with your actual webhook keys
 * - Add all your webhooks here
 * - Each key should match a webhook in your webhooks/ directory
 */
export type ${pascalName}WebhookOutputs = {
	example: ExampleEvent;
	// TODO: Add more webhooks as you implement them
};

/**
 * Creates a matcher function for a specific event type
 * 
 * CONFIGURATION:
 * This function is used to match incoming webhooks to the correct handler.
 * Most providers use a 'type' field, but you may need to customize this.
 */
export function create${pascalName}Match(eventType: string) {
	return (payload: ${pascalName}WebhookPayload) => {
		return payload.type === eventType;
	};
}

/**
 * Webhook Signature Verification
 * 
 * WEBHOOK CONFIGURATION:
 * Implement signature verification based on your provider's method.
 * 
 * Common verification methods:
 * - HMAC SHA256 (most common)
 * - HMAC SHA1
 * - Custom signature algorithms
 * 
 * Example for HMAC SHA256:
 * import crypto from 'crypto';
 * export function verify${pascalName}WebhookSignature(
 *   request: { payload: ${pascalName}WebhookPayload; headers: Record<string, string> },
 *   secret: string,
 * ): { valid: boolean; error?: string } {
 *   const signature = request.headers['x-${lowerName}-signature'];
 *   if (!signature) {
 *     return { valid: false, error: 'Missing signature' };
 *   }
 *   
 *   const payload = JSON.stringify(request.payload);
 *   const expectedSignature = crypto
 *     .createHmac('sha256', secret)
 *     .update(payload)
 *     .digest('hex');
 *   
 *   const isValid = crypto.timingSafeEqual(
 *     Buffer.from(signature),
 *     Buffer.from(expectedSignature)
 *   );
 *   
 *   return { valid: isValid, error: isValid ? undefined : 'Invalid signature' };
 * }
 */
export function verify${pascalName}WebhookSignature(
	request: { payload: ${pascalName}WebhookPayload; headers: Record<string, string> },
	secret: string,
): { valid: boolean; error?: string } {
	// TODO: Implement webhook signature verification
	// This is a placeholder - implement based on your provider's webhook verification method
	return { valid: true };
}
`;

	// Generate webhooks/example.ts
	const webhooksExampleTs = `import type { ${pascalName}Webhooks } from '..';
import { logEventFromContext } from '../../utils/events';
import { create${pascalName}Match, verify${pascalName}WebhookSignature } from './types';

export const example: ${pascalName}Webhooks['example'] = {
	match: create${pascalName}Match('example'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verify${pascalName}WebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.type !== 'example') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('📦 ${pascalName} Example Event:', {
			id: event.data.id,
		});

		await logEventFromContext(
			ctx,
			'${lowerName}.webhook.example',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
`;

	// Generate webhooks/index.ts
	const webhooksIndexTs = `import { example } from './example';

export const ExampleWebhooks = {
	example: example,
};

export * from './types';
`;

	// Generate error-handlers.ts
	const errorHandlersTs = `import { ApiError } from '../../async-core/ApiError';
import type { CorsairErrorHandler } from '../../core/errors';

/**
 * Error Handlers Configuration
 * 
 * CONFIGURATION:
 * Customize these error handlers to match your provider's error patterns.
 * 
 * Each handler has two parts:
 * 1. match: Function that determines if an error matches this handler
 * 2. handler: Function that returns retry configuration
 * 
 * You can:
 * - Add more error patterns to match() functions
 * - Adjust maxRetries based on error type
 * - Add provider-specific error codes
 * - Remove handlers you don't need
 * - Add custom handlers for provider-specific errors
 */
export const errorHandlers = {
	/**
	 * Rate Limit Error Handler
	 * 
	 * CONFIGURATION:
	 * - Update match() to check for your provider's rate limit error patterns
	 * - Adjust maxRetries (default: 5)
	 * - The handler will respect Retry-After headers if available
	 */
	RATE_LIMIT_ERROR: {
		match: (error, context) => {
			// Check for HTTP 429 status code
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			// Check error message for rate limit indicators
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('rate_limited') ||
				errorMessage.includes('ratelimited') ||
				error.message.includes('429')
				// TODO: Add provider-specific rate limit error patterns
				// Example: errorMessage.includes('too_many_requests')
			);
		},
		handler: async (error, context) => {
			// Extract Retry-After from headers if available
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}

			return {
				maxRetries: 5, // TODO: Adjust based on your provider's rate limits
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	/**
	 * Authentication Error Handler
	 * 
	 * CONFIGURATION:
	 * - Update match() to check for your provider's auth error patterns
	 * - maxRetries: 0 (no retries for auth errors - they won't succeed)
	 * - Add provider-specific auth error codes/messages
	 */
	AUTH_ERROR: {
		match: (error, context) => {
			// Check for HTTP 401 status code
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			// Check error message for auth failure indicators
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('invalid_auth') ||
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('authentication failed')
				// TODO: Add provider-specific auth error patterns
				// Example: errorMessage.includes('invalid_token')
			);
		},
		handler: async (error, context) => {
			console.log(
				\`[${pascalName.toUpperCase()}:\${context.operation}] Authentication failed - check your API key\`,
			);

			return {
				maxRetries: 0, // No retries for auth errors
			};
		},
	},
	/**
	 * Permission Error Handler
	 * 
	 * CONFIGURATION:
	 * - Update match() to check for your provider's permission error patterns
	 * - maxRetries: 0 (no retries for permission errors)
	 * - Add provider-specific permission error codes/messages
	 */
	PERMISSION_ERROR: {
		match: (error, context) => {
			// Check for HTTP 403 status code
			if (error instanceof ApiError && error.status === 403) {
				return true;
			}
			// Check error message for permission denial indicators
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('permission_denied') ||
				errorMessage.includes('forbidden') ||
				errorMessage.includes('access_denied')
				// TODO: Add provider-specific permission error patterns
				// Example: errorMessage.includes('insufficient_permissions')
			);
		},
		handler: async (error, context) => {
			console.warn(
				\`[${pascalName.toUpperCase()}:\${context.operation}] Permission denied: \${error.message}\`,
			);

			return {
				maxRetries: 0, // No retries for permission errors
			};
		},
	},
	/**
	 * Default Error Handler
	 * 
	 * CONFIGURATION:
	 * - This catches all errors not matched by other handlers
	 * - maxRetries: 0 (default - change if you want to retry unknown errors)
	 * - Consider adding more specific handlers before this one
	 */
	DEFAULT: {
		match: (error, context) => {
			return true; // Matches all errors
		},
		handler: async (error, context) => {
			console.error(
				\`[${pascalName.toUpperCase()}:\${context.operation}] Unhandled error: \${error.message}\`,
			);

			return {
				maxRetries: 0, // TODO: Consider if unknown errors should be retried
			};
		},
	},
} satisfies CorsairErrorHandler;
`;

	// Generate client.ts
	const clientTs = `import type { ApiRequestOptions } from '../../async-core/ApiRequestOptions';
import type { OpenAPIConfig } from '../../async-core/OpenAPI';
import { request } from '../../async-core/request';

export class ${pascalName}APIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = '${pascalName}APIError';
	}
}

/**
 * API Configuration
 * 
 * AUTH CONFIGURATION:
 * Update the API base URL and authentication headers based on your provider.
 * 
 * Common authentication patterns:
 * - API Key in header: HEADERS: { 'X-API-Key': apiKey }
 * - Bearer token: HEADERS: { 'Authorization': \`Bearer \${apiKey}\` }
 * - Custom header: HEADERS: { 'X-Custom-Auth': apiKey }
 * 
 * For OAuth 2.0, you might use:
 * - HEADERS: { 'Authorization': \`Bearer \${accessToken}\` }
 */
const ${pascalName.toUpperCase()}_API_BASE = 'https://api.example.com'; // TODO: Update with your API base URL

/**
 * Makes a request to the ${pascalName} API
 * 
 * AUTH CONFIGURATION:
 * The 'apiKey' parameter will contain:
 * - For 'api_key' auth: The API key from keyBuilder
 * - For 'oauth_2' auth: The access token from keyBuilder
 * - For 'bot_token' auth: The bot token from keyBuilder
 * 
 * Update the TOKEN and HEADERS configuration based on how your API expects authentication.
 */
export async function make${pascalName}Request<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: ${pascalName.toUpperCase()}_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// TODO: Update TOKEN usage - some APIs don't use this field
		// Remove TOKEN if your API doesn't use it, and add auth to HEADERS instead
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			// TODO: Add authentication headers based on your API's requirements
			// Common patterns:
			// 'Authorization': \`Bearer \${apiKey}\`  // For Bearer token
			// 'X-API-Key': apiKey                     // For API key in header
			// 'Authorization': \`Token \${apiKey}\`   // For token-based auth
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions);
		return response;
	} catch (error) {
		if (error instanceof Error) {
			throw new ${pascalName}APIError(error.message);
		}
		throw new ${pascalName}APIError('Unknown error');
	}
}
`;

	// Generate schema/database.ts
	const schemaDatabaseTs = `import { z } from 'zod';

// TODO: Define your database entities here
// Example:
// export const ${pascalName}Example = z.object({
// 	id: z.string(),
// 	name: z.string(),
// 	created_at: z.coerce.date().nullable().optional(),
// });
//
// export type ${pascalName}Example = z.infer<typeof ${pascalName}Example>;
`;

	// Generate schema/index.ts
	const schemaIndexTs = `// TODO: Import your database entities and create the schema
// Example:
// import { ${pascalName}Example } from './database';
//
// export const ${pascalName}Schema = {
// 	version: '1.0.0',
// 	entities: {
// 		example: ${pascalName}Example,
// 	},
// } as const;

export const ${pascalName}Schema = {
	version: '1.0.0',
	entities: {},
} as const;
`;

	// Write all files
	writeFileSync(join(pluginDir, 'index.ts'), indexTs);
	writeFileSync(join(pluginDir, 'endpoints', 'types.ts'), endpointsTypesTs);
	writeFileSync(join(pluginDir, 'endpoints', 'example.ts'), endpointsExampleTs);
	writeFileSync(join(pluginDir, 'endpoints', 'index.ts'), endpointsIndexTs);
	writeFileSync(join(pluginDir, 'webhooks', 'types.ts'), webhooksTypesTs);
	writeFileSync(join(pluginDir, 'webhooks', 'example.ts'), webhooksExampleTs);
	writeFileSync(join(pluginDir, 'webhooks', 'index.ts'), webhooksIndexTs);
	writeFileSync(join(pluginDir, 'error-handlers.ts'), errorHandlersTs);
	writeFileSync(join(pluginDir, 'client.ts'), clientTs);
	writeFileSync(join(pluginDir, 'schema', 'database.ts'), schemaDatabaseTs);
	writeFileSync(join(pluginDir, 'schema', 'index.ts'), schemaIndexTs);

	// Update constants.ts
	const constantsPath = join(baseDir, 'core/constants.ts');
	if (existsSync(constantsPath)) {
		const constantsContent = readFileSync(constantsPath, 'utf-8');

		// Check if plugin is already in BaseProviders
		if (constantsContent.includes(`'${lowerName}'`)) {
			console.log(`⚠️  Plugin "${lowerName}" already exists in BaseProviders`);
		} else {
			// Find the BaseProviders array and add the new plugin
			const baseProvidersMatch = constantsContent.match(
				/export const BaseProviders = \[([\s\S]*?)\] as const;/,
			);

			if (baseProvidersMatch && baseProvidersMatch[1]) {
				const providers = baseProvidersMatch[1]
					.split('\n')
					.map((line) => line.trim())
					.filter((line) => line && line.startsWith("'"))
					.map((line) => line.replace(/['",]/g, '').trim());

				// Add the new provider in alphabetical order
				providers.push(lowerName);
				providers.sort();

				const newProvidersArray = providers.map((p) => `\t'${p}',`).join('\n');

				const newConstantsContent = constantsContent.replace(
					/export const BaseProviders = \[[\s\S]*?\] as const;/,
					`export const BaseProviders = [\n${newProvidersArray}\n] as const;`,
				);

				// Also update AllProviders type if it exists
				const allProvidersMatch = constantsContent.match(
					/export type AllProviders =[\s\S]*?\| \(string & \{\}\);/,
				);

				let finalContent = newConstantsContent;
				if (allProvidersMatch) {
					const allProvidersType = allProvidersMatch[0];
					const providersInType =
						allProvidersType
							.match(/'[^']+'/g)
							?.map((m) => m.replace(/'/g, '')) || [];

					if (!providersInType.includes(lowerName)) {
						providersInType.push(lowerName);
						providersInType.sort();

						// Match the existing format with proper indentation
						const newAllProvidersType = `export type AllProviders =\n\t| ${providersInType.map((p) => `'${p}'`).join('\n\t| ')}\n\t| (string & {});`;

						finalContent = newConstantsContent.replace(
							/export type AllProviders =[\s\S]*?\| \(string & \{\}\);/,
							newAllProvidersType,
						);
					}
				}

				writeFileSync(constantsPath, finalContent);
				console.log(`✅ Updated packages/corsair/core/constants.ts`);
			}
		}
	}

	console.log(`✅ Created plugin "${lowerName}" at ${pluginDir}`);
	console.log(`\n📝 Next steps:`);
	console.log(`   1. Update the plugin files with your API implementation`);
	console.log(
		`   2. Add the plugin export to packages/corsair/plugins/index.ts`,
	);
	console.log(`   3. Update package.json exports if needed`);
}

// Main execution
const pluginName = process.argv[2];

if (!pluginName) {
	console.error('Usage: tsx templates/plugin/generate.ts <PluginName>');
	console.error('');
	console.error(
		'Plugin names must be in PascalCase (starts with uppercase, no hyphens or underscores)',
	);
	console.error('');
	console.error('Examples:');
	console.error('  tsx templates/plugin/generate.ts Slack');
	console.error('  tsx templates/plugin/generate.ts GoogleCalendar');
	console.error('  tsx templates/plugin/generate.ts GitHub');
	console.error('');
	console.error('Invalid formats (will throw errors):');
	console.error('  - slack (must start with uppercase)');
	console.error('  - google-calendar (no hyphens allowed)');
	console.error('  - google_calendar (no underscores allowed)');
	process.exit(1);
}

generatePlugin(pluginName);
