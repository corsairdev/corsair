import type { CorsairEndpoint } from 'corsair/core';
import { z } from 'zod';
import { makeFlyRequest } from '../client';
import type { FlyContext } from '../index';

// GraphQL contract: superfly/fly-go schema.graphql at 494ae940b5bdaf7ed50d53ce01ed973915e268ce.
const optionalString = z.string().nullable().optional();
const optionalBoolean = z.boolean().nullable().optional();
const optionalInt = z.number().int().nullable().optional();
const id = z.string().min(1);
const pagination = {
	after: optionalString,
	before: optionalString,
	first: optionalInt,
	last: optionalInt,
};
const pageInfo = z.object({
	endCursor: z.string().nullable(),
	hasNextPage: z.boolean(),
	hasPreviousPage: z.boolean(),
	startCursor: z.string().nullable(),
});
const pageSelection =
	'pageInfo { endCursor hasNextPage hasPreviousPage startCursor } totalCount';
const connection = <T extends z.ZodType>(node: T) =>
	z.object({
		nodes: z.array(node.nullable()).nullable(),
		pageInfo,
		totalCount: z.number().int(),
	});
const app = z.object({
	id: z.string(),
	name: z.string(),
	status: z.string(),
	hostname: z.string().nullable(),
	appUrl: z.string().nullable(),
	createdAt: z.string(),
	organization: z.object({
		id: z.string(),
		slug: z.string(),
		name: z.string(),
	}),
});
const org = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
	type: z.enum(['PERSONAL', 'SHARED']),
});
const addOn = z.object({
	id: z.string(),
	name: z.string().nullable(),
	status: z.string().nullable(),
	primaryRegion: z.string().nullable(),
	hostname: z.string().nullable(),
	publicUrl: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
	organization: org.pick({ id: true, name: true, slug: true }),
});
const addOnPlan = z.object({
	id: z.string(),
	name: z.string().nullable(),
	displayName: z.string().nullable(),
	description: z.string().nullable(),
	pricePerMonth: z.number().int().nullable(),
});
const checkJob = z.object({
	id: z.string(),
	url: z.string(),
	schedule: z.string().nullable(),
	nextRunAt: z.string().nullable(),
	httpOptions: z
		.object({ verb: z.enum(['GET', 'HEAD']), headers: z.array(z.string()) })
		.nullable(),
});
const checkRun = z.object({
	id: z.string(),
	url: z.string(),
	state: z.string(),
	createdAt: z.string(),
	completedAt: z.string().nullable(),
	tests: z.array(z.string()),
});
const location = z.object({
	name: z.string(),
	title: z.string(),
	country: z.string(),
	locality: z.string(),
	state: z.string().nullable(),
	coordinates: z.array(z.number()),
});
const peer = z.object({
	id: z.string(),
	name: z.string(),
	network: z.string().nullable(),
	peerip: z.string(),
	pubkey: z.string(),
	region: z.string(),
});
const delegatedToken = z.object({ id: z.string(), name: z.string() });
const level = z.enum([
	'ADMIN_OPT_OUT',
	'DISABLED',
	'MEMBER_OPT_OUT',
	'OPT_IN',
	'REQUIRED',
]);
const thirdParty = z.object({
	id: z.string(),
	name: z.string(),
	location: z.string(),
	customLevel: level,
	flyctlLevel: level,
	uiexLevel: level,
	createdAt: z.string(),
	updatedAt: z.string(),
});
const addOnType = z.enum([
	'arcjet',
	'enveloop',
	'fly_mysql',
	'kubernetes',
	'redis',
	'sentry',
	'supabase',
	'tigris',
	'upstash_kafka',
	'upstash_redis',
	'upstash_vector',
	'wafris',
]);
const addOnTypeOptional = addOnType.nullable().optional();
const optLevel = level.nullable().optional();
const appFields =
	'id name status hostname appUrl createdAt organization { id slug name }';
const orgFields = 'id name slug type';
const addOnFields =
	'id name status primaryRegion hostname publicUrl createdAt updatedAt organization { id name slug }';
const planFields = 'id name displayName description pricePerMonth';
const jobFields = 'id url schedule nextRunAt httpOptions { verb headers }';
const runFields = 'id url state createdAt completedAt tests';
const locationFields = 'name title country locality state coordinates';
const peerFields = 'id name network peerip pubkey region';
const thirdPartyFields =
	'id name location customLevel flyctlLevel uiexLevel createdAt updatedAt';
const clientMutationId = optionalString;

type Risk = 'read' | 'write' | 'destructive';
// Each operation has a different validated variables object; the shared factory
// cannot prescribe its field values without losing the individual schema types.
function operation<
	I extends z.ZodType<Record<string, unknown>>,
	O extends z.ZodType,
>(
	input: I,
	output: O,
	query: string,
	field: string,
	riskLevel: Risk,
	description: string,
) {
	const endpoint: CorsairEndpoint<FlyContext, z.input<I>, z.output<O>> = async (
		ctx,
		args,
	) => {
		const variables = input.parse(args ?? {});
		const data = await makeFlyRequest(ctx.key, query, variables);
		return output.parse(data[field]);
	};
	return { input, output, query, field, riskLevel, description, endpoint };
}

const noArgs = z.object({});
const pages = z.object(pagination);
const pagesDecl = '$after: String, $before: String, $first: Int, $last: Int';
const pagesArgs = 'after: $after, before: $before, first: $first, last: $last';
const orgSelector = {
	id: optionalString,
	name: optionalString,
	slug: optionalString,
};
const orgDecl = '$id: ID, $name: String, $slug: String';
const orgArgs = 'id: $id, name: $name, slug: $slug';
// Mutation input fields likewise vary by operation and are validated by `input`.
const mutation = <
	I extends z.ZodType<Record<string, unknown>>,
	O extends z.ZodType,
>(
	name: string,
	inputType: string,
	input: I,
	output: O,
	selection: string,
	risk: Risk,
	description: string,
) =>
	operation(
		z.object({ input }),
		output.nullable(),
		`mutation ($input: ${inputType}!) { ${name}(input: $input) { ${selection} } }`,
		name,
		risk,
		description,
	);

export const operations = {
	apps: {
		list: operation(
			z.object({
				...pagination,
				active: optionalBoolean,
				organizationId: optionalString,
				platform: optionalString,
				role: optionalString,
			}),
			connection(app),
			`query (${pagesDecl}, $active: Boolean, $organizationId: ID, $platform: String, $role: String) { apps(${pagesArgs}, active: $active, organizationId: $organizationId, platform: $platform, role: $role) { nodes { ${appFields} } ${pageSelection} } }`,
			'apps',
			'read',
			'List Fly apps',
		),
		get: operation(
			z.object({ internalId: optionalString, name: optionalString }),
			app.nullable(),
			`query ($internalId: String, $name: String) { app(internalId: $internalId, name: $name) { ${appFields} } }`,
			'app',
			'read',
			'Get a Fly app',
		),
		nameAvailable: operation(
			z.object({ name: id }),
			z.boolean(),
			'query ($name: String!) { appNameAvailable(name: $name) }',
			'appNameAvailable',
			'read',
			'Check app name availability',
		),
	},
	organizations: {
		list: operation(
			z.object({
				...pagination,
				admin: optionalBoolean,
				type: z.enum(['PERSONAL', 'SHARED']).nullable().optional(),
				withBillingIssuesOnly: optionalBoolean,
			}),
			connection(org),
			`query (${pagesDecl}, $admin: Boolean, $type: OrganizationType, $withBillingIssuesOnly: Boolean) { organizations(${pagesArgs}, admin: $admin, type: $type, withBillingIssuesOnly: $withBillingIssuesOnly) { nodes { ${orgFields} } ${pageSelection} } }`,
			'organizations',
			'read',
			'List organizations',
		),
		get: operation(
			z.object(orgSelector),
			org.nullable(),
			`query (${orgDecl}) { organization(${orgArgs}) { ${orgFields} } }`,
			'organization',
			'read',
			'Get an organization',
		),
		personal: operation(
			noArgs,
			org,
			`query { personalOrganization { ${orgFields} } }`,
			'personalOrganization',
			'read',
			'Get the personal organization',
		),
		delete: mutation(
			'deleteOrganization',
			'DeleteOrganizationInput',
			z.object({ organizationId: id, clientMutationId }),
			z.object({
				deletedOrganizationId: z.string(),
				clientMutationId: z.string().nullable(),
			}),
			'deletedOrganizationId clientMutationId',
			'destructive',
			'Permanently delete an organization',
		),
	},
	checks: {
		jobs: operation(
			pages,
			connection(checkJob),
			`query (${pagesDecl}) { checkJobs(${pagesArgs}) { nodes { ${jobFields} } ${pageSelection} } }`,
			'checkJobs',
			'read',
			'List health check jobs',
		),
		locations: operation(
			noArgs,
			z.array(location),
			`query { checkLocations { ${locationFields} } }`,
			'checkLocations',
			'read',
			'List health check locations',
		),
		createJob: mutation(
			'createCheckJob',
			'CreateCheckJobInput',
			z.object({
				organizationId: id,
				url: id,
				locations: z.array(z.string()),
				httpOptions: z.object({
					headers: z.array(z.string()).nullable().optional(),
					verb: z.enum(['GET', 'HEAD']).optional(),
				}),
				clientMutationId,
			}),
			z.object({
				checkJob,
				checkJobRun: checkRun.nullable(),
				clientMutationId: z.string().nullable(),
			}),
			`checkJob { ${jobFields} } checkJobRun { ${runFields} } clientMutationId`,
			'write',
			'Create a health check job',
		),
		runJob: mutation(
			'createCheckJobRun',
			'CreateCheckJobRunInput',
			z.object({ checkJobId: id, clientMutationId }),
			z.object({
				checkJob,
				checkJobRun: checkRun.nullable(),
				clientMutationId: z.string().nullable(),
			}),
			`checkJob { ${jobFields} } checkJobRun { ${runFields} } clientMutationId`,
			'write',
			'Run a health check job',
		),
	},
	wireguard: {
		listPeers: operation(
			z.object({ ...orgSelector, ...pagination }),
			z.object({ wireGuardPeers: connection(peer) }).nullable(),
			`query (${orgDecl}, ${pagesDecl}) { organization(${orgArgs}) { wireGuardPeers(${pagesArgs}) { nodes { ${peerFields} } ${pageSelection} } } }`,
			'organization',
			'read',
			'List organization WireGuard peers',
		),
		getPeer: operation(
			z.object({ ...orgSelector, peerName: id }),
			z.object({ wireGuardPeer: peer }).nullable(),
			`query (${orgDecl}, $peerName: String!) { organization(${orgArgs}) { wireGuardPeer(name: $peerName) { ${peerFields} } } }`,
			'organization',
			'read',
			'Get a WireGuard peer',
		),
		listTokens: operation(
			z.object({ ...orgSelector, ...pagination }),
			z
				.object({ delegatedWireGuardTokens: connection(delegatedToken) })
				.nullable(),
			`query (${orgDecl}, ${pagesDecl}) { organization(${orgArgs}) { delegatedWireGuardTokens(${pagesArgs}) { nodes { id name } ${pageSelection} } } }`,
			'organization',
			'read',
			'List delegated WireGuard tokens',
		),
		addPeer: mutation(
			'addWireGuardPeer',
			'AddWireGuardPeerInput',
			z.object({
				name: id,
				organizationId: id,
				pubkey: id,
				ephemeral: optionalBoolean,
				gwname: optionalString,
				network: optionalString,
				region: optionalString,
				clientMutationId,
			}),
			z.object({
				endpointip: z.string(),
				network: z.string().nullable(),
				peerip: z.string(),
				pubkey: z.string(),
				clientMutationId: z.string().nullable(),
			}),
			'endpointip network peerip pubkey clientMutationId',
			'write',
			'Add a WireGuard peer',
		),
		removePeer: mutation(
			'removeWireGuardPeer',
			'RemoveWireGuardPeerInput',
			z.object({ name: id, organizationId: id, clientMutationId }),
			z.object({ organization: org, clientMutationId: z.string().nullable() }),
			`organization { ${orgFields} } clientMutationId`,
			'destructive',
			'Remove a WireGuard peer',
		),
		validatePeers: mutation(
			'validateWireGuardPeers',
			'ValidateWireGuardPeersInput',
			z.object({ peerIps: z.array(z.string()), clientMutationId }),
			z.object({
				invalidPeerIps: z.array(z.string()),
				validPeerIps: z.array(z.string()),
				clientMutationId: z.string().nullable(),
			}),
			'invalidPeerIps validPeerIps clientMutationId',
			'write',
			'Validate WireGuard peer addresses',
		),
		createToken: mutation(
			'createDelegatedWireGuardToken',
			'CreateDelegatedWireGuardTokenInput',
			z.object({ organizationId: id, name: optionalString, clientMutationId }),
			z.object({ token: z.string(), clientMutationId: z.string().nullable() }),
			'token clientMutationId',
			'write',
			'Create a delegated WireGuard token',
		),
		deleteToken: mutation(
			'deleteDelegatedWireGuardToken',
			'DeleteDelegatedWireGuardTokenInput',
			z.object({
				organizationId: id,
				name: optionalString,
				token: optionalString,
				clientMutationId,
			}),
			z.object({ token: z.string(), clientMutationId: z.string().nullable() }),
			'token clientMutationId',
			'destructive',
			'Revoke a delegated WireGuard token',
		),
	},
	addOns: {
		list: operation(
			z.object({ ...pagination, type: addOnTypeOptional }),
			connection(addOn),
			`query (${pagesDecl}, $type: AddOnType) { addOns(${pagesArgs}, type: $type) { nodes { ${addOnFields} } ${pageSelection} } }`,
			'addOns',
			'read',
			'List add-ons',
		),
		get: operation(
			z.object({
				id: optionalString,
				name: optionalString,
				provider: optionalString,
			}),
			addOn.nullable(),
			`query ($id: ID, $name: String, $provider: String) { addOn(id: $id, name: $name, provider: $provider) { ${addOnFields} } }`,
			'addOn',
			'read',
			'Get an add-on',
		),
		plans: operation(
			z.object({ ...pagination, type: addOnTypeOptional }),
			connection(addOnPlan),
			`query (${pagesDecl}, $type: AddOnType) { addOnPlans(${pagesArgs}, type: $type) { nodes { ${planFields} } ${pageSelection} } }`,
			'addOnPlans',
			'read',
			'List add-on plans',
		),
		provider: operation(
			z.object({ name: id }),
			z.object({
				id: z.string(),
				name: z.string().nullable(),
				displayName: z.string().nullable(),
				resourceName: z.string(),
				beta: z.boolean(),
				internal: z.boolean(),
			}),
			'query ($name: String!) { addOnProvider(name: $name) { id name displayName resourceName beta internal } }',
			'addOnProvider',
			'read',
			'Get an add-on provider',
		),
		create: mutation(
			'createAddOn',
			'CreateAddOnInput',
			z.object({
				type: addOnType,
				appId: optionalString,
				organizationId: optionalString,
				name: optionalString,
				organizationPlanId: optionalString,
				planId: optionalString,
				primaryRegion: optionalString,
				readRegions: z.array(z.string()).nullable().optional(),
				options: z.json().nullable().optional(),
				clientMutationId,
			}),
			z.object({ addOn, clientMutationId: z.string().nullable() }),
			`addOn { ${addOnFields} } clientMutationId`,
			'write',
			'Create an add-on',
		),
		update: mutation(
			'updateAddOn',
			'UpdateAddOnInput',
			z.object({
				addOnId: optionalString,
				name: optionalString,
				provider: optionalString,
				planId: optionalString,
				readRegions: z.array(z.string()).nullable().optional(),
				metadata: z.json().nullable().optional(),
				options: z.json().nullable().optional(),
				clientMutationId,
			}),
			z.object({ addOn, clientMutationId: z.string().nullable() }),
			`addOn { ${addOnFields} } clientMutationId`,
			'write',
			'Update an add-on',
		),
		delete: mutation(
			'deleteAddOn',
			'DeleteAddOnInput',
			z.object({
				addOnId: optionalString,
				name: optionalString,
				provider: optionalString,
				clientMutationId,
			}),
			z.object({
				deletedAddOnName: z.string().nullable(),
				clientMutationId: z.string().nullable(),
			}),
			'deletedAddOnName clientMutationId',
			'destructive',
			'Delete an add-on',
		),
		resetPassword: mutation(
			'resetAddOnPassword',
			'ResetAddOnPasswordInput',
			z.object({ name: id, clientMutationId }),
			z.object({ addOn, clientMutationId: z.string().nullable() }),
			`addOn { ${addOnFields} } clientMutationId`,
			'write',
			'Reset an add-on password',
		),
	},
	thirdParty: {
		list: operation(
			z.object({ ...orgSelector, ...pagination }),
			z.object({ thirdPartyConfigurations: connection(thirdParty) }).nullable(),
			`query (${orgDecl}, ${pagesDecl}) { organization(${orgArgs}) { thirdPartyConfigurations(${pagesArgs}) { nodes { ${thirdPartyFields} } ${pageSelection} } } }`,
			'organization',
			'read',
			'List third-party configurations',
		),
		create: mutation(
			'createThirdPartyConfiguration',
			'CreateThirdPartyConfigurationInput',
			z.object({
				organizationId: id,
				name: id,
				location: id,
				customLevel: level,
				flyctlLevel: level,
				uiexLevel: level,
				clientMutationId,
			}),
			z.object({
				thirdPartyConfiguration: thirdParty,
				clientMutationId: z.string().nullable(),
			}),
			`thirdPartyConfiguration { ${thirdPartyFields} } clientMutationId`,
			'write',
			'Create a third-party configuration',
		),
		update: mutation(
			'updateThirdPartyConfiguration',
			'UpdateThirdPartyConfigurationInput',
			z.object({
				thirdPartyConfigurationId: id,
				name: optionalString,
				location: optionalString,
				customLevel: optLevel,
				flyctlLevel: optLevel,
				uiexLevel: optLevel,
				clientMutationId,
			}),
			z.object({
				thirdPartyConfiguration: thirdParty,
				clientMutationId: z.string().nullable(),
			}),
			`thirdPartyConfiguration { ${thirdPartyFields} } clientMutationId`,
			'write',
			'Update a third-party configuration',
		),
		delete: mutation(
			'deleteThirdPartyConfiguration',
			'DeleteThirdPartyConfigurationInput',
			z.object({ thirdPartyConfigurationId: id, clientMutationId }),
			z.object({ ok: z.boolean(), clientMutationId: z.string().nullable() }),
			'ok clientMutationId',
			'destructive',
			'Delete a third-party configuration',
		),
	},
	account: {
		userOnlyToken: operation(
			noArgs,
			z.boolean(),
			'query { userOnlyToken }',
			'userOnlyToken',
			'read',
			'Check whether the token is user-only',
		),
		viewer: operation(
			noArgs,
			z.object({
				avatarUrl: z.string(),
				email: z.string(),
				name: z.string().nullable(),
			}),
			'query { viewer { avatarUrl email name } }',
			'viewer',
			'read',
			'Get the current token principal',
		),
	},
	platform: {
		nearestRegion: operation(
			z.object({ wireguardGateway: optionalBoolean }),
			z.object({
				code: z.string(),
				name: z.string(),
				latitude: z.number().nullable(),
				longitude: z.number().nullable(),
				gatewayAvailable: z.boolean(),
			}),
			'query ($wireguardGateway: Boolean) { nearestRegion(wireguardGateway: $wireguardGateway) { code name latitude longitude gatewayAvailable } }',
			'nearestRegion',
			'read',
			'Get the nearest Fly region',
		),
	},
} as const;
