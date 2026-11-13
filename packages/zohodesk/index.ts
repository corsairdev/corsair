import type {
	BindEndpoints,
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
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import type { ZohoDeskRegion } from './client';
import {
	resolveZohoDeskRegion,
	zohoDeskOAuthAuthUrl,
	zohoDeskOAuthTokenUrl,
} from './client';
import {
	Agents,
	Contacts,
	Departments,
	Organizations,
	Roles,
	Tasks,
	Tickets,
} from './endpoints';
import type {
	ZohoDeskEndpointInputs,
	ZohoDeskEndpointOutputs,
} from './endpoints/types';
import {
	ZohoDeskEndpointInputSchemas,
	ZohoDeskEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { resolveZohoDeskOAuthTenantLink } from './oauth-tenant-link';
import { ZohoDeskSchema } from './schema';

export const zohoDeskAuthConfig = {
	oauth_2: {
		// The Zoho Desk org ID, sent as the `orgId` header.
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type ZohoDeskPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	/** Static access token. It is never refreshed, so it stops working after an hour. */
	key?: string;
	/** Zoho data center. Default 'us'. Selects the accounts.zoho.* and desk.zoho.* hosts. */
	region?: ZohoDeskRegion;
	/** The `api_domain` from a Zoho token response. Takes precedence over `region`. */
	apiDomain?: string;
	/** Zoho Desk org ID. Overrides the one stored after OAuth. */
	orgId?: string;
	hooks?: InternalZohoDeskPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof zohoDeskEndpointsNested>;
};

/**
 * `hub` is present at runtime when createCorsair was given one; the shared
 * context type leaves it out because few endpoints need it.
 */
export type ZohoDeskContext = CorsairPluginContext<
	typeof ZohoDeskSchema,
	ZohoDeskPluginOptions,
	undefined,
	typeof zohoDeskAuthConfig
> & { hub?: Parameters<typeof getOAuthAccessToken>[0]['hub'] };

export type ZohoDeskKeyBuilderContext = KeyBuilderContext<
	ZohoDeskPluginOptions,
	typeof zohoDeskAuthConfig
>;

export type ZohoDeskBoundEndpoints = BindEndpoints<
	typeof zohoDeskEndpointsNested
>;

type ZohoDeskEndpoint<K extends keyof ZohoDeskEndpointOutputs> =
	CorsairEndpoint<
		ZohoDeskContext,
		ZohoDeskEndpointInputs[K],
		ZohoDeskEndpointOutputs[K]
	>;

export type ZohoDeskEndpoints = {
	[K in keyof ZohoDeskEndpointOutputs]: ZohoDeskEndpoint<K>;
};

const zohoDeskEndpointsNested = {
	tickets: {
		list: Tickets.list,
		get: Tickets.get,
		getResolution: Tickets.getResolution,
		getLatestThread: Tickets.getLatestThread,
		getThread: Tickets.getThread,
		listConversations: Tickets.listConversations,
	},
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		getByIds: Contacts.getByIds,
		listAccounts: Contacts.listAccounts,
	},
	agents: {
		get: Agents.get,
		getCount: Agents.getCount,
	},
	departments: {
		list: Departments.list,
		get: Departments.get,
		getCount: Departments.getCount,
		listTeams: Departments.listTeams,
		getLogo: Departments.getLogo,
		uploadLogo: Departments.uploadLogo,
	},
	organizations: {
		list: Organizations.list,
	},
	roles: {
		list: Roles.list,
		listByIds: Roles.listByIds,
	},
	tasks: {
		updateMany: Tasks.updateMany,
	},
} as const;

const zohoDeskWebhooksNested = {} as const;

const schema = <K extends keyof typeof ZohoDeskEndpointInputSchemas>(
	key: K,
) => ({
	input: ZohoDeskEndpointInputSchemas[key],
	output: ZohoDeskEndpointOutputSchemas[key],
});

export const zohoDeskEndpointSchemas = {
	'tickets.list': schema('ticketsList'),
	'tickets.get': schema('ticketsGet'),
	'tickets.getResolution': schema('ticketsGetResolution'),
	'tickets.getLatestThread': schema('ticketsGetLatestThread'),
	'tickets.getThread': schema('ticketsGetThread'),
	'tickets.listConversations': schema('ticketsListConversations'),
	'contacts.list': schema('contactsList'),
	'contacts.get': schema('contactsGet'),
	'contacts.getByIds': schema('contactsGetByIds'),
	'contacts.listAccounts': schema('contactsListAccounts'),
	'agents.get': schema('agentsGet'),
	'agents.getCount': schema('agentsGetCount'),
	'departments.list': schema('departmentsList'),
	'departments.get': schema('departmentsGet'),
	'departments.getCount': schema('departmentsGetCount'),
	'departments.listTeams': schema('departmentsListTeams'),
	'departments.getLogo': schema('departmentsGetLogo'),
	'departments.uploadLogo': schema('departmentsUploadLogo'),
	'organizations.list': schema('organizationsList'),
	'roles.list': schema('rolesList'),
	'roles.listByIds': schema('rolesListByIds'),
	'tasks.updateMany': schema('tasksUpdateMany'),
} as const satisfies RequiredPluginEndpointSchemas<
	typeof zohoDeskEndpointsNested
>;

const zohoDeskWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof zohoDeskWebhooksNested
	>;

const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;
const write = (description: string) =>
	({ riskLevel: 'write', description }) as const;

const zohoDeskEndpointMeta = {
	'tickets.list': read(
		'List tickets, filtered by department, view, assignee, team, channel, status or priority',
	),
	'tickets.get': read('Get a ticket by ID'),
	'tickets.getResolution': read(
		'Get the resolution of a ticket, or null if it has none',
	),
	'tickets.getLatestThread': read(
		'Get the most recent thread of a ticket, or null if it has none',
	),
	'tickets.getThread': read('Get one thread of a ticket'),
	'tickets.listConversations': read(
		'List the threads and comments of a ticket',
	),
	'contacts.list': read(
		'List contacts with view and saved filter, paging, sorting and field selection',
	),
	'contacts.get': read('Get a contact, optionally with its accounts and owner'),
	'contacts.getByIds': read('Get up to 20 contacts by ID'),
	'contacts.listAccounts': read('List the accounts of a contact'),
	'agents.get': read(
		'Get an agent, optionally with its profile, role, departments and verified emails',
	),
	'agents.getCount': read(
		'Count agents, optionally by status, confirmation and light agent inclusion',
	),
	'departments.list': read('List departments'),
	'departments.get': read('Get a department by ID'),
	'departments.getCount': read(
		'Count departments, optionally only enabled or disabled ones',
	),
	'departments.listTeams': read('List the teams in a department'),
	'departments.getLogo': read('Download the logo of a department as base64'),
	'departments.uploadLogo': write(
		'Replace the logo of a department with a jpg, png or gif of up to 2MB',
	),
	'organizations.list': read('List the organizations the user belongs to'),
	'roles.list': read('List roles'),
	'roles.listByIds': read('Get up to 50 roles by ID'),
	'tasks.updateMany': write('Set one field on up to 50 tasks'),
} as const satisfies RequiredPluginEndpointMeta<typeof zohoDeskEndpointsNested>;

/** The narrowest scopes Zoho documents for the 22 operations. */
export const zohoDeskOAuthScopes = [
	'Desk.tickets.READ',
	'Desk.contacts.READ',
	'Desk.accounts.READ',
	'Desk.agents.READ',
	'Desk.basic.READ',
	'Desk.departments.READ',
	'Desk.departments.UPDATE',
	'Desk.teams.READ',
	'Desk.organization.READ',
	'Desk.permissions.READ',
	'Desk.activities.tasks.UPDATE',
] as const;

const defaultAuthType = 'oauth_2' as const;

export type BaseZohoDeskPlugin<T extends ZohoDeskPluginOptions> = CorsairPlugin<
	'zohodesk',
	typeof ZohoDeskSchema,
	typeof zohoDeskEndpointsNested,
	typeof zohoDeskWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof zohoDeskAuthConfig
>;

export type InternalZohoDeskPlugin = BaseZohoDeskPlugin<ZohoDeskPluginOptions>;

export type ExternalZohoDeskPlugin<T extends ZohoDeskPluginOptions> =
	BaseZohoDeskPlugin<T>;

export function zohodesk<const T extends ZohoDeskPluginOptions>(
	incomingOptions: ZohoDeskPluginOptions & T = {} as ZohoDeskPluginOptions & T,
): ExternalZohoDeskPlugin<T> {
	if (incomingOptions.orgId && !/^[0-9]+$/.test(incomingOptions.orgId)) {
		throw new Error('[zohodesk] orgId must be a numeric Zoho Desk org ID');
	}
	const region = resolveZohoDeskRegion(incomingOptions);
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
		region,
	};
	return {
		id: 'zohodesk',
		schema: ZohoDeskSchema,
		options: options,
		authConfig: zohoDeskAuthConfig,
		oauthConfig: {
			providerName: 'Zoho',
			authUrl: zohoDeskOAuthAuthUrl(region),
			tokenUrl: zohoDeskOAuthTokenUrl(region),
			// One entry on purpose: core joins this array with spaces, and Zoho
			// documents scopes as comma-separated.
			scopes: [zohoDeskOAuthScopes.join(',')],
			authParams: { access_type: 'offline', prompt: 'consent' },
			tokenAuthMethod: 'body',
		},
		hooks: options.hooks,
		endpoints: zohoDeskEndpointsNested,
		webhooks: zohoDeskWebhooksNested,
		endpointMeta: zohoDeskEndpointMeta,
		endpointSchemas: zohoDeskEndpointSchemas,
		webhookSchemas: zohoDeskWebhookSchemas,
		oauthWebhookTenantLinkResolver: (tokens) =>
			resolveZohoDeskOAuthTenantLink(tokens, region),
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		// Endpoints refresh after a 401 themselves, and skip it for a 401 that a
		// new token can't fix (a missing scope): core must not refresh again.
		refreshOnUnauthorized: false,
		keyBuilder: async (ctx: ZohoDeskKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (ctx.authType === 'oauth_2') {
				return getOAuthAccessToken(ctx, {
					plugin: 'zohodesk',
					tokenUrl: zohoDeskOAuthTokenUrl(region),
					tokenAuthMethod: 'body',
				});
			}
			throw new AuthMissingError('zohodesk', defaultAuthType);
		},
	} satisfies InternalZohoDeskPlugin;
}

export type { ZohoDeskRegion } from './client';
export {
	regionFromApiDomain,
	ZohoDeskAPIError,
	zohoDeskApiBase,
} from './client';
export type {
	ZohoDeskEndpointInputs,
	ZohoDeskEndpointOutputs,
} from './endpoints/types';
export type { ZohoDeskContact, ZohoDeskTicket } from './schema';
