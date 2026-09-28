export type FaradayHttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';
export type FaradayRisk = 'read' | 'write' | 'destructive';
export type FaradayInputKind =
	| 'none'
	| 'ids'
	| 'id'
	| 'create'
	| 'patch'
	| 'cascade'
	| 'upload'
	| 'accountCreate'
	| 'webhookCreate'
	| 'webhookUpdate'
	| 'preview';

export type FaradayOp = {
	group: string;
	name: string;
	method: FaradayHttpMethod;
	path: string;
	risk: FaradayRisk;
	description: string;
	input: FaradayInputKind;
	docs: string;
};

/**
 * Official Faraday REST ops. https://faraday.ai/docs/reference
 * Faraday has no inbound triggers. webhookEndpoints is CRUD for destination URLs only.
 */
export const FARADAY_OPS = [
	{
		group: 'accounts',
		name: 'list',
		method: 'GET',
		path: 'accounts',
		risk: 'read',
		input: 'ids',
		description: 'List Faraday accounts',
		docs: 'https://faraday.ai/docs/reference/getaccounts',
	},
	{
		group: 'accounts',
		name: 'get',
		method: 'GET',
		path: 'accounts/{account_id}',
		risk: 'read',
		input: 'id',
		description: 'Retrieve a Faraday account',
		docs: 'https://faraday.ai/docs/reference/getaccount',
	},
	{
		group: 'accounts',
		name: 'create',
		method: 'POST',
		path: 'accounts',
		risk: 'write',
		input: 'accountCreate',
		description: 'Create a Faraday subaccount',
		docs: 'https://faraday.ai/docs/reference/createaccount',
	},
	{
		group: 'accounts',
		name: 'update',
		method: 'PATCH',
		path: 'accounts/{account_id}',
		risk: 'write',
		input: 'patch',
		description: 'Update a Faraday account (JSON Merge Patch)',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'accounts',
		name: 'delete',
		method: 'DELETE',
		path: 'accounts/{account_id}',
		risk: 'destructive',
		input: 'id',
		description: 'Delete a Faraday account',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'accounts',
		name: 'getCurrent',
		method: 'GET',
		path: 'accounts/current',
		risk: 'read',
		input: 'none',
		description: 'Retrieve the current Faraday account',
		docs: 'https://faraday.ai/docs/reference/getcurrentaccount',
	},
	{
		group: 'accounts',
		name: 'getCurrentBilling',
		method: 'GET',
		path: 'accounts/current/billing',
		risk: 'read',
		input: 'none',
		description: 'Get billing for the current Faraday account',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'accounts',
		name: 'getBilling',
		method: 'GET',
		path: 'accounts/{account_id}/billing',
		risk: 'read',
		input: 'id',
		description: 'Get billing for a Faraday account',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'usages',
		name: 'get',
		method: 'GET',
		path: 'usages',
		risk: 'read',
		input: 'none',
		description: 'Get Faraday account usage stats',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'graph',
		name: 'get',
		method: 'GET',
		path: 'graph',
		risk: 'read',
		input: 'none',
		description: 'Retrieve the Faraday resource dependency graph',
		docs: 'https://faraday.ai/docs/reference/getgraph',
	},
	{
		group: 'attributes',
		name: 'list',
		method: 'GET',
		path: 'attributes',
		risk: 'read',
		input: 'ids',
		description: 'List Faraday attributes',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'featureStores',
		name: 'list',
		method: 'GET',
		path: 'feature_stores',
		risk: 'read',
		input: 'ids',
		description: 'List Faraday feature stores',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'recommenders',
		name: 'list',
		method: 'GET',
		path: 'recommenders',
		risk: 'read',
		input: 'ids',
		description: 'List Faraday recommenders',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'marketOpportunityAnalyses',
		name: 'list',
		method: 'GET',
		path: 'market_opportunity_analyses',
		risk: 'read',
		input: 'ids',
		description: 'List Faraday market opportunity analyses',
		docs: 'https://faraday.ai/docs/reference',
	},
	...resourceOps('cohorts', 'cohort_id', 'cohort'),
	{
		group: 'cohorts',
		name: 'getMembershipAnalysis',
		method: 'GET',
		path: 'cohorts/{cohort_id}/analysis/membership',
		risk: 'read',
		input: 'id',
		description: 'Get Faraday cohort membership analysis',
		docs: 'https://faraday.ai/docs/reference',
	},
	...resourceOps('datasets', 'dataset_id', 'dataset'),
	{
		group: 'datasets',
		name: 'getIngressLogs',
		method: 'GET',
		path: 'datasets/{dataset_id}/logs/ingress',
		risk: 'read',
		input: 'id',
		description: 'Get Faraday dataset ingress logs',
		docs: 'https://faraday.ai/docs/reference',
	},
	...resourceOps('streams', 'stream_id', 'stream'),
	{
		group: 'streams',
		name: 'getAnalysis',
		method: 'GET',
		path: 'streams/{stream_id}/analysis',
		risk: 'read',
		input: 'id',
		description: 'Get Faraday stream event analysis',
		docs: 'https://faraday.ai/docs/reference',
	},
	...resourceOps('outcomes', 'outcome_id', 'outcome'),
	...resourceOps(
		'personaSets',
		'persona_set_id',
		'persona set',
		'persona_sets',
	),
	{
		group: 'personaSets',
		name: 'getAnalysisDimensions',
		method: 'GET',
		path: 'persona_sets/{persona_set_id}/analysis/dimensions',
		risk: 'read',
		input: 'id',
		description: 'Get Faraday persona set dimension analysis',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'personaSets',
		name: 'getAnalysisFlow',
		method: 'GET',
		path: 'persona_sets/{persona_set_id}/analysis/flow',
		risk: 'read',
		input: 'id',
		description: 'Get Faraday persona set flow analysis',
		docs: 'https://faraday.ai/docs/reference',
	},
	...resourceOps('places', 'place_id', 'place'),
	...resourceOps('scopes', 'scope_id', 'scope'),
	{
		group: 'scopes',
		name: 'getAnalysis',
		method: 'GET',
		path: 'scopes/{scope_id}/analysis',
		risk: 'read',
		input: 'id',
		description: 'Get Faraday scope analysis',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'scopes',
		name: 'getDatasets',
		method: 'GET',
		path: 'scopes/{scope_id}/datasets',
		risk: 'read',
		input: 'id',
		description: 'List datasets for a Faraday scope',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'scopes',
		name: 'getEfficacy',
		method: 'GET',
		path: 'scopes/{scope_id}/efficacy',
		risk: 'read',
		input: 'id',
		description: 'Get Faraday scope efficacy',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'scopes',
		name: 'getPayloadCohorts',
		method: 'GET',
		path: 'scopes/{scope_id}/payload/cohorts',
		risk: 'read',
		input: 'id',
		description: 'Get Faraday scope payload cohorts',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'scopes',
		name: 'getPayloadOutcomes',
		method: 'GET',
		path: 'scopes/{scope_id}/payload/outcomes',
		risk: 'read',
		input: 'id',
		description: 'Get Faraday scope payload outcomes',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'scopes',
		name: 'getPayloadPersonaSets',
		method: 'GET',
		path: 'scopes/{scope_id}/payload/persona_sets',
		risk: 'read',
		input: 'id',
		description: 'Get Faraday scope payload persona sets',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'scopes',
		name: 'getPayloadRecommenders',
		method: 'GET',
		path: 'scopes/{scope_id}/payload/recommenders',
		risk: 'read',
		input: 'id',
		description: 'Get Faraday scope payload recommenders',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'scopes',
		name: 'getPopulationCohorts',
		method: 'GET',
		path: 'scopes/{scope_id}/population/cohorts',
		risk: 'read',
		input: 'id',
		description: 'Get Faraday scope population cohorts',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'scopes',
		name: 'getPopulationExclusionCohorts',
		method: 'GET',
		path: 'scopes/{scope_id}/population/exclusion_cohorts',
		risk: 'read',
		input: 'id',
		description: 'Get Faraday scope population exclusion cohorts',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'scopes',
		name: 'getTargets',
		method: 'GET',
		path: 'scopes/{scope_id}/targets',
		risk: 'read',
		input: 'id',
		description: 'Get Faraday scope targets',
		docs: 'https://faraday.ai/docs/reference',
	},
	...resourceOps('targets', 'target_id', 'target', undefined, {
		unarchive: false,
	}),
	{
		group: 'targets',
		name: 'getAnalysis',
		method: 'GET',
		path: 'targets/{target_id}/analysis',
		risk: 'read',
		input: 'id',
		description: 'Get Faraday target analysis',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'targets',
		name: 'createPreview',
		method: 'POST',
		path: 'targets/{target_id}/preview',
		risk: 'write',
		input: 'preview',
		description: 'Start a Faraday target preview delivery',
		docs: 'https://faraday.ai/docs/reference',
	},
	...resourceOps('traits', 'trait_id', 'trait'),
	{
		group: 'traits',
		name: 'deleteOrphaned',
		method: 'DELETE',
		path: 'traits',
		risk: 'destructive',
		input: 'none',
		description: 'Delete all orphaned Faraday traits',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'traits',
		name: 'getCsv',
		method: 'GET',
		path: 'traits.csv',
		risk: 'read',
		input: 'none',
		description: 'Download Faraday traits as CSV',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'traits',
		name: 'getAnalysisDimensions',
		method: 'GET',
		path: 'traits/{trait_id}/analysis/dimensions',
		risk: 'read',
		input: 'id',
		description: 'Get Faraday trait dimension analysis',
		docs: 'https://faraday.ai/docs/reference',
	},
	...resourceOps('connections', 'connection_id', 'connection', undefined, {
		create: false,
		unarchive: false,
		get: false,
	}),
	{
		group: 'connections',
		name: 'getDatasets',
		method: 'GET',
		path: 'connections/{connection_id}/datasets',
		risk: 'read',
		input: 'id',
		description: 'List datasets for a Faraday connection',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'connections',
		name: 'getTargets',
		method: 'GET',
		path: 'connections/{connection_id}/targets',
		risk: 'read',
		input: 'id',
		description: 'List targets for a Faraday connection',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'uploads',
		name: 'list',
		method: 'GET',
		path: 'uploads',
		risk: 'read',
		input: 'none',
		description: 'List Faraday uploaded files',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'uploads',
		name: 'get',
		method: 'GET',
		path: 'uploads/{directory}/{filename}',
		risk: 'read',
		input: 'upload',
		description: 'Download a Faraday uploaded file',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'uploads',
		name: 'delete',
		method: 'DELETE',
		path: 'uploads/{directory}/{filename}',
		risk: 'destructive',
		input: 'upload',
		description: 'Delete a Faraday uploaded file',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'webhookEndpoints',
		name: 'list',
		method: 'GET',
		path: 'webhook_endpoints',
		risk: 'read',
		input: 'ids',
		description: 'List Faraday webhook endpoints',
		docs: 'https://faraday.ai/docs/reference/getwebhookendpoints',
	},
	{
		group: 'webhookEndpoints',
		name: 'get',
		method: 'GET',
		path: 'webhook_endpoints/{webhook_endpoint_id}',
		risk: 'read',
		input: 'id',
		description: 'Retrieve a Faraday webhook endpoint',
		docs: 'https://faraday.ai/docs/reference/getwebhookendpoint',
	},
	{
		group: 'webhookEndpoints',
		name: 'create',
		method: 'POST',
		path: 'webhook_endpoints',
		risk: 'write',
		input: 'webhookCreate',
		description: 'Create a Faraday webhook endpoint',
		docs: 'https://faraday.ai/docs/reference/createwebhookendpoint',
	},
	{
		group: 'webhookEndpoints',
		name: 'update',
		method: 'PATCH',
		path: 'webhook_endpoints/{webhook_endpoint_id}',
		risk: 'write',
		input: 'webhookUpdate',
		description: 'Update a Faraday webhook endpoint',
		docs: 'https://faraday.ai/docs/reference',
	},
	{
		group: 'webhookEndpoints',
		name: 'delete',
		method: 'DELETE',
		path: 'webhook_endpoints/{webhook_endpoint_id}',
		risk: 'destructive',
		input: 'id',
		description: 'Delete a Faraday webhook endpoint',
		docs: 'https://faraday.ai/docs/reference',
	},
] as const satisfies readonly FaradayOp[];

function resourceOp<
	G extends string,
	N extends string,
	M extends FaradayHttpMethod,
	P extends string,
	I extends FaradayInputKind,
	R extends FaradayRisk,
>(op: {
	group: G;
	name: N;
	method: M;
	path: P;
	risk: R;
	input: I;
	description: string;
	docs: string;
}) {
	return op;
}

function resourceOps<G extends string, Id extends string>(
	group: G,
	idParam: Id,
	label: string,
	pathSeg?: string,
	flags?: { create?: boolean; unarchive?: boolean; get?: boolean },
) {
	const seg = pathSeg ?? group;
	const docs = 'https://faraday.ai/docs/reference';
	const create =
		flags?.create !== false
			? [
					resourceOp({
						group,
						name: 'create',
						method: 'POST',
						path: seg,
						risk: 'write',
						input: 'create',
						description: `Create a Faraday ${label}`,
						docs,
					}),
				]
			: [];
	const unarchive =
		flags?.unarchive !== false
			? [
					resourceOp({
						group,
						name: 'unarchive',
						method: 'POST',
						path: `${seg}/{${idParam}}/unarchive`,
						risk: 'write',
						input: 'cascade',
						description: `Unarchive a Faraday ${label}`,
						docs,
					}),
				]
			: [];
	const get =
		flags?.get !== false
			? [
					resourceOp({
						group,
						name: 'get',
						method: 'GET',
						path: `${seg}/{${idParam}}`,
						risk: 'read',
						input: 'id',
						description: `Retrieve a Faraday ${label}`,
						docs,
					}),
				]
			: [];
	return [
		resourceOp({
			group,
			name: 'list',
			method: 'GET',
			path: seg,
			risk: 'read',
			input: 'ids',
			description: `List Faraday ${label}s`,
			docs,
		}),
		...get,
		...create,
		resourceOp({
			group,
			name: 'update',
			method: 'PATCH',
			path: `${seg}/{${idParam}}`,
			risk: 'write',
			input: 'patch',
			description: `Update a Faraday ${label} (JSON Merge Patch)`,
			docs,
		}),
		resourceOp({
			group,
			name: 'delete',
			method: 'DELETE',
			path: `${seg}/{${idParam}}`,
			risk: 'destructive',
			input: 'id',
			description: `Delete a Faraday ${label}`,
			docs,
		}),
		resourceOp({
			group,
			name: 'archive',
			method: 'POST',
			path: `${seg}/{${idParam}}/archive`,
			risk: 'write',
			input: 'cascade',
			description: `Archive a Faraday ${label}`,
			docs,
		}),
		resourceOp({
			group,
			name: 'forceUpdate',
			method: 'POST',
			path: `${seg}/{${idParam}}/force_update`,
			risk: 'write',
			input: 'id',
			description: `Force update a Faraday ${label}`,
			docs,
		}),
		...unarchive,
	];
}

export type FaradayOpKey = (typeof FARADAY_OPS)[number] extends infer O
	? O extends { group: infer G; name: infer N }
		? G extends string
			? N extends string
				? `${G}.${N}`
				: never
			: never
		: never
	: never;

export function opKey(op: FaradayOp): FaradayOpKey {
	return `${op.group}.${op.name}` as FaradayOpKey;
}
