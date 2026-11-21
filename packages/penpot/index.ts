import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	AccessTokens,
	Comments,
	Files,
	Projects,
	Teams,
	Webhooks,
} from './endpoints';
import type {
	PenpotEndpointInputs,
	PenpotEndpointOutputs,
} from './endpoints/types';
import {
	PenpotEndpointInputSchemas,
	PenpotEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PenpotSchema } from './schema';
import { event } from './webhooks';
import { matchPenpotWebhook, PenpotEventSchema } from './webhooks/types';

export type PenpotPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalPenpotPlugin['hooks'];
	webhookHooks?: InternalPenpotPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof penpotEndpointsNested>;
};

export type PenpotContext = CorsairPluginContext<
	typeof PenpotSchema,
	PenpotPluginOptions,
	undefined,
	typeof penpotAuthConfig
>;

export type PenpotKeyBuilderContext = KeyBuilderContext<
	PenpotPluginOptions,
	typeof penpotAuthConfig
>;

export type PenpotBoundEndpoints = BindEndpoints<typeof penpotEndpointsNested>;

type PenpotEndpoint<K extends keyof PenpotEndpointOutputs> = CorsairEndpoint<
	PenpotContext,
	PenpotEndpointInputs[K],
	PenpotEndpointOutputs[K]
>;

export type PenpotEndpoints = {
	[K in keyof PenpotEndpointOutputs]: PenpotEndpoint<K>;
};

export type PenpotBoundWebhooks = BindWebhooks<typeof penpotWebhooksNested>;

const penpotEndpointsNested = {
	teams: {
		list: Teams.list,
		create: Teams.create,
		get: Teams.get,
		delete: Teams.remove,
	},
	projects: {
		listAll: Projects.listAll,
		create: Projects.create,
		get: Projects.get,
		rename: Projects.rename,
		delete: Projects.remove,
		duplicate: Projects.duplicate,
	},
	files: {
		get: Files.get,
		create: Files.create,
		delete: Files.remove,
		duplicate: Files.duplicate,
		rename: Files.rename,
		snapshotsList: Files.snapshotsList,
		snapshotsCreate: Files.snapshotsCreate,
		snapshotsDelete: Files.snapshotsDelete,
		shareLinkCreate: Files.shareLinkCreate,
		shareLinkDelete: Files.shareLinkDelete,
	},
	comments: {
		threadsList: Comments.threadsList,
		threadGet: Comments.threadGet,
		threadCreate: Comments.threadCreate,
		list: Comments.list,
		create: Comments.create,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		update: Webhooks.update,
		delete: Webhooks.remove,
	},
	accessTokens: {
		list: AccessTokens.list,
		delete: AccessTokens.remove,
	},
} as const;

export const penpotWebhooksNested = {
	penpot: {
		event,
	},
} as const;

export const penpotEndpointSchemas = {
	'teams.list': {
		input: PenpotEndpointInputSchemas.teamsList,
		output: PenpotEndpointOutputSchemas.teamsList,
	},
	'teams.create': {
		input: PenpotEndpointInputSchemas.teamsCreate,
		output: PenpotEndpointOutputSchemas.teamsCreate,
	},
	'teams.get': {
		input: PenpotEndpointInputSchemas.teamsGet,
		output: PenpotEndpointOutputSchemas.teamsGet,
	},
	'teams.delete': {
		input: PenpotEndpointInputSchemas.teamsDelete,
		output: PenpotEndpointOutputSchemas.teamsDelete,
	},
	'projects.listAll': {
		input: PenpotEndpointInputSchemas.projectsListAll,
		output: PenpotEndpointOutputSchemas.projectsListAll,
	},
	'projects.create': {
		input: PenpotEndpointInputSchemas.projectsCreate,
		output: PenpotEndpointOutputSchemas.projectsCreate,
	},
	'projects.get': {
		input: PenpotEndpointInputSchemas.projectsGet,
		output: PenpotEndpointOutputSchemas.projectsGet,
	},
	'projects.rename': {
		input: PenpotEndpointInputSchemas.projectsRename,
		output: PenpotEndpointOutputSchemas.projectsRename,
	},
	'projects.delete': {
		input: PenpotEndpointInputSchemas.projectsDelete,
		output: PenpotEndpointOutputSchemas.projectsDelete,
	},
	'projects.duplicate': {
		input: PenpotEndpointInputSchemas.projectsDuplicate,
		output: PenpotEndpointOutputSchemas.projectsDuplicate,
	},
	'files.get': {
		input: PenpotEndpointInputSchemas.filesGet,
		output: PenpotEndpointOutputSchemas.filesGet,
	},
	'files.create': {
		input: PenpotEndpointInputSchemas.filesCreate,
		output: PenpotEndpointOutputSchemas.filesCreate,
	},
	'files.delete': {
		input: PenpotEndpointInputSchemas.filesDelete,
		output: PenpotEndpointOutputSchemas.filesDelete,
	},
	'files.duplicate': {
		input: PenpotEndpointInputSchemas.filesDuplicate,
		output: PenpotEndpointOutputSchemas.filesDuplicate,
	},
	'files.rename': {
		input: PenpotEndpointInputSchemas.filesRename,
		output: PenpotEndpointOutputSchemas.filesRename,
	},
	'files.snapshotsList': {
		input: PenpotEndpointInputSchemas.filesSnapshotsList,
		output: PenpotEndpointOutputSchemas.filesSnapshotsList,
	},
	'files.snapshotsCreate': {
		input: PenpotEndpointInputSchemas.filesSnapshotsCreate,
		output: PenpotEndpointOutputSchemas.filesSnapshotsCreate,
	},
	'files.snapshotsDelete': {
		input: PenpotEndpointInputSchemas.filesSnapshotsDelete,
		output: PenpotEndpointOutputSchemas.filesSnapshotsDelete,
	},
	'files.shareLinkCreate': {
		input: PenpotEndpointInputSchemas.filesShareLinkCreate,
		output: PenpotEndpointOutputSchemas.filesShareLinkCreate,
	},
	'files.shareLinkDelete': {
		input: PenpotEndpointInputSchemas.filesShareLinkDelete,
		output: PenpotEndpointOutputSchemas.filesShareLinkDelete,
	},
	'comments.threadsList': {
		input: PenpotEndpointInputSchemas.commentsThreadsList,
		output: PenpotEndpointOutputSchemas.commentsThreadsList,
	},
	'comments.threadGet': {
		input: PenpotEndpointInputSchemas.commentsThreadGet,
		output: PenpotEndpointOutputSchemas.commentsThreadGet,
	},
	'comments.threadCreate': {
		input: PenpotEndpointInputSchemas.commentsThreadCreate,
		output: PenpotEndpointOutputSchemas.commentsThreadCreate,
	},
	'comments.list': {
		input: PenpotEndpointInputSchemas.commentsList,
		output: PenpotEndpointOutputSchemas.commentsList,
	},
	'comments.create': {
		input: PenpotEndpointInputSchemas.commentsCreate,
		output: PenpotEndpointOutputSchemas.commentsCreate,
	},
	'webhooks.list': {
		input: PenpotEndpointInputSchemas.webhooksList,
		output: PenpotEndpointOutputSchemas.webhooksList,
	},
	'webhooks.create': {
		input: PenpotEndpointInputSchemas.webhooksCreate,
		output: PenpotEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.update': {
		input: PenpotEndpointInputSchemas.webhooksUpdate,
		output: PenpotEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.delete': {
		input: PenpotEndpointInputSchemas.webhooksDelete,
		output: PenpotEndpointOutputSchemas.webhooksDelete,
	},
	'accessTokens.list': {
		input: PenpotEndpointInputSchemas.accessTokensList,
		output: PenpotEndpointOutputSchemas.accessTokensList,
	},
	'accessTokens.delete': {
		input: PenpotEndpointInputSchemas.accessTokensDelete,
		output: PenpotEndpointOutputSchemas.accessTokensDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof penpotEndpointsNested
>;

const penpotWebhookSchemas = {
	'penpot.event': {
		description: 'A Penpot webhook delivery: a team-level event notification',
		payload: PenpotEventSchema,
		response: PenpotEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof penpotWebhooksNested>;

const penpotEndpointMeta = {
	'teams.list': {
		riskLevel: 'read',
		description: 'List the teams of the authenticated profile',
	},
	'teams.create': {
		riskLevel: 'write',
		description: 'Create a team',
	},
	'teams.get': {
		riskLevel: 'read',
		description: 'Read one team',
	},
	'teams.delete': {
		riskLevel: 'destructive',
		description: 'Delete a team with its projects and files',
		irreversible: true,
	},
	'projects.listAll': {
		riskLevel: 'read',
		description: 'List all projects of the authenticated profile',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a project in a team',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Read one project by id',
	},
	'projects.rename': {
		riskLevel: 'write',
		description: 'Rename a project',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project with its files',
		irreversible: true,
	},
	'projects.duplicate': {
		riskLevel: 'write',
		description: 'Duplicate a project',
	},
	'files.get': {
		riskLevel: 'read',
		description: 'Read one design file with its data',
	},
	'files.create': {
		riskLevel: 'write',
		description: 'Create a design file in a project',
	},
	'files.delete': {
		riskLevel: 'destructive',
		description: 'Delete a design file',
		irreversible: true,
	},
	'files.duplicate': {
		riskLevel: 'write',
		description: 'Duplicate a design file',
	},
	'files.rename': {
		riskLevel: 'write',
		description: 'Rename a design file',
	},
	'files.snapshotsList': {
		riskLevel: 'read',
		description: 'List the snapshots of a file',
	},
	'files.snapshotsCreate': {
		riskLevel: 'write',
		description: 'Create a snapshot of a file',
	},
	'files.snapshotsDelete': {
		riskLevel: 'destructive',
		description: 'Delete a file snapshot',
		irreversible: true,
	},
	'files.shareLinkCreate': {
		riskLevel: 'write',
		description: 'Create a share link for a file',
	},
	'files.shareLinkDelete': {
		riskLevel: 'write',
		description: 'Delete a share link; the link stops working immediately',
	},
	'comments.threadsList': {
		riskLevel: 'read',
		description: 'List the comment threads of a file',
	},
	'comments.threadGet': {
		riskLevel: 'read',
		description: 'Read one comment thread',
	},
	'comments.threadCreate': {
		riskLevel: 'write',
		description: 'Open a comment thread on a file page',
	},
	'comments.list': {
		riskLevel: 'read',
		description: 'List the comments of a thread',
	},
	'comments.create': {
		riskLevel: 'write',
		description: 'Comment on a thread',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List the webhooks of a team',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a webhook for a team',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Update a webhook URL, payload format or active state',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook; deliveries stop until it is created again',
		irreversible: true,
	},
	'accessTokens.list': {
		riskLevel: 'read',
		description:
			'List the API access tokens of the account (names only, never values)',
	},
	'accessTokens.delete': {
		riskLevel: 'destructive',
		description: 'Revoke an API access token; apps using it stop working',
		irreversible: true,
	},
} as const satisfies RequiredPluginEndpointMeta<typeof penpotEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const penpotAuthConfig = {
	api_key: {
		// Penpot access tokens are account-level; no extra field needed.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePenpotPlugin<T extends PenpotPluginOptions> = CorsairPlugin<
	'penpot',
	typeof PenpotSchema,
	typeof penpotEndpointsNested,
	typeof penpotWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof penpotAuthConfig
>;

export type InternalPenpotPlugin = BasePenpotPlugin<PenpotPluginOptions>;

export type ExternalPenpotPlugin<T extends PenpotPluginOptions> =
	BasePenpotPlugin<T>;

export function penpot<const T extends PenpotPluginOptions>(
	incomingOptions: PenpotPluginOptions & T = {} as PenpotPluginOptions & T,
): ExternalPenpotPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'penpot',
		authConfig: penpotAuthConfig,
		schema: PenpotSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: penpotEndpointsNested,
		webhooks: penpotWebhooksNested,
		endpointMeta: penpotEndpointMeta,
		endpointSchemas: penpotEndpointSchemas,
		webhookSchemas: penpotWebhookSchemas,
		pluginWebhookMatcher: matchPenpotWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PenpotKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// Penpot documents no webhook signature scheme; the stored
				// secret slot is reserved for integrators who front the route
				// with their own shared-secret check.
				if (options.webhookSecret) return options.webhookSecret;
				const stored = await ctx.keys.get_webhook_signature();
				return stored ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('penpot', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPenpotPlugin;
}

export type {
	AccessToken,
	Comment,
	CommentThread,
	File,
	PenpotEndpointInputs,
	PenpotEndpointOutputs,
	Project,
	ShareLink,
	Team,
	WebhookSubscription,
} from './endpoints/types';
export type { PenpotWebhookPayload } from './webhooks/types';
export {
	matchPenpotWebhook,
	verifyPenpotWebhook,
} from './webhooks/types';
