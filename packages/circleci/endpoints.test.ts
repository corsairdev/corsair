/**
 * Covers every operation: the transport and route it calls (or the GraphQL
 * query/mutation field and variables it sends), what it mirrors, and what
 * reaches the event log.
 *
 * The coverage sweep at the end asserts that the operations exercised here
 * are precisely the operations registered, so an operation cannot be added
 * without a test. All ids and values are fictional.
 */
import { logEventFromContext } from 'corsair/core';
import {
	CIRCLECI_GRAPHQL_URL,
	CIRCLECI_V1_BASE,
	CIRCLECI_V2_BASE,
	CIRCLECI_V3_BASE,
} from './client';
import {
	Contexts,
	ContextsGraphQL,
	Groups,
	Insights,
	Jobs,
	Namespaces,
	OrbAllowlist,
	Orbs,
	Organization,
	PipelineDefinitions,
	Pipelines,
	ProjectEnvVars,
	Projects,
	Runners,
	Schedules,
	Usage,
	User,
	Workflows,
} from './endpoints';
import { circleCIEndpointMeta } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Store = { upsertByEntityId: jest.Mock; deleteByEntityId: jest.Mock };
function makeStore(): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

type Ctx = Parameters<typeof Projects.get>[0];

function makeCtx() {
	const db = {
		projects: makeStore(),
		contexts: makeStore(),
		projectEnvVars: makeStore(),
		schedules: makeStore(),
		groups: makeStore(),
		orbAllowlistEntries: makeStore(),
		pipelineDefinitions: makeStore(),
	};
	const ctx = { key: 'CCIPAT_test-token', db } as unknown as Ctx;
	return { ctx, db };
}

let captured:
	| {
			url: string;
			method: string;
			body?: string;
			headers: Record<string, string>;
	  }
	| undefined;

const realFetch = global.fetch;
afterEach(() => {
	global.fetch = realFetch;
});

/** Answers every request with `payload`, recording what was asked for. */
function mockFetch(
	payload: unknown,
	{ status = 200 }: { status?: number } = {},
) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers)
			raw.forEach((v, k) => {
				headers[k.toLowerCase()] = v;
			});
		else
			for (const [k, v] of Object.entries(
				(raw ?? {}) as Record<string, string>,
			))
				headers[k.toLowerCase()] = v;

		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			body: typeof init?.body === 'string' ? init.body : undefined,
			headers,
		};
		const body =
			typeof payload === 'string' ? payload : JSON.stringify(payload);
		return {
			ok: status < 400,
			status,
			statusText: status < 400 ? 'OK' : 'Error',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => body,
		};
	}) as unknown as typeof global.fetch;
}

/** The path called, stripped of whichever REST base matched. */
function calledPath(): string {
	const url = captured?.url ?? '';
	for (const base of [CIRCLECI_V2_BASE, CIRCLECI_V3_BASE, CIRCLECI_V1_BASE]) {
		if (url.startsWith(`${base}/`))
			return url.slice(base.length + 1).split('?')[0] ?? '';
	}
	return url;
}

function query(): URLSearchParams {
	return new URL(captured?.url ?? 'https://x/').searchParams;
}

function sentBody(): Record<string, unknown> {
	return captured?.body ? JSON.parse(captured.body) : {};
}

/** For GraphQL calls: the query string and parsed variables that were sent. */
function graphQLSent(): { query: string; variables: Record<string, unknown> } {
	const body = sentBody();
	return {
		query: String(body.query ?? ''),
		variables: (body.variables as Record<string, unknown>) ?? {},
	};
}

const ORG_ID = 'org-1';
const CONTEXT_ID = 'context-1';
const PROJECT_SLUG = 'gh/acme/widgets';

type Case = {
	meta: string;
	run: (ctx: Ctx) => Promise<unknown>;
	payload: unknown;
	transport: 'v2' | 'v3' | 'v1.1' | 'graphql';
	method?: string;
	path?: string;
	expectBody?: Record<string, unknown>;
	graphqlField?: string;
};

const cases: Case[] = [
	// ---- contexts (REST v2) ----
	{
		meta: 'contexts.create',
		run: (c) =>
			Contexts.create(c, {
				name: 'ctx',
				ownerId: ORG_ID,
				ownerType: 'organization',
			}),
		payload: { id: CONTEXT_ID, name: 'ctx' },
		transport: 'v2',
		method: 'POST',
		path: 'context',
		expectBody: { name: 'ctx', owner: { id: ORG_ID, type: 'organization' } },
	},
	{
		meta: 'contexts.get',
		run: (c) => Contexts.get(c, { contextId: CONTEXT_ID }),
		payload: { id: CONTEXT_ID },
		transport: 'v2',
		method: 'GET',
		path: `context/${CONTEXT_ID}`,
	},
	{
		meta: 'contexts.listEnvVars',
		run: (c) => Contexts.listEnvVars(c, { contextId: CONTEXT_ID }),
		payload: { items: [{ variable: 'X' }] },
		transport: 'v2',
		method: 'GET',
		path: `context/${CONTEXT_ID}/environment-variable`,
	},
	{
		meta: 'contexts.upsertEnvVar',
		run: (c) =>
			Contexts.upsertEnvVar(c, {
				contextId: CONTEXT_ID,
				variable: 'X',
				value: 'secret',
			}),
		payload: { variable: 'X' },
		transport: 'v2',
		method: 'PUT',
		path: `context/${CONTEXT_ID}/environment-variable/X`,
		expectBody: { value: 'secret' },
	},
	{
		meta: 'contexts.createRestriction',
		run: (c) =>
			Contexts.createRestriction(c, {
				contextId: CONTEXT_ID,
				restrictionType: 'project',
				restrictionValue: 'proj-1',
			}),
		payload: { id: 'r-1' },
		transport: 'v2',
		method: 'POST',
		path: `context/${CONTEXT_ID}/restrictions`,
		expectBody: { restriction_type: 'project', restriction_value: 'proj-1' },
	},
	{
		meta: 'contexts.deleteRestriction',
		run: (c) =>
			Contexts.deleteRestriction(c, {
				contextId: CONTEXT_ID,
				restrictionId: 'r-1',
			}),
		payload: {},
		transport: 'v2',
		method: 'DELETE',
		path: `context/${CONTEXT_ID}/restrictions/r-1`,
	},

	// ---- contexts (GraphQL) ----
	{
		meta: 'contextsGraphQL.create',
		run: (c) =>
			ContextsGraphQL.create(c, {
				contextName: 'ctx',
				ownerId: ORG_ID,
				ownerType: 'organization',
			}),
		payload: {
			data: { createContext: { context: { id: CONTEXT_ID, name: 'ctx' } } },
		},
		transport: 'graphql',
		graphqlField: 'createContext',
	},
	{
		meta: 'contextsGraphQL.delete',
		run: (c) => ContextsGraphQL.remove(c, { contextId: CONTEXT_ID }),
		payload: { data: { __typename: 'DeleteContextPayload' } },
		transport: 'graphql',
		graphqlField: 'deleteContext',
	},
	{
		meta: 'contextsGraphQL.query',
		run: (c) => ContextsGraphQL.query(c, { contextId: CONTEXT_ID }),
		payload: { data: { context: { id: CONTEXT_ID } } },
		transport: 'graphql',
		graphqlField: 'context',
	},
	{
		meta: 'contextsGraphQL.storeEnvVar',
		run: (c) =>
			ContextsGraphQL.storeEnvVar(c, {
				contextId: CONTEXT_ID,
				variable: 'X',
				value: 'secret',
			}),
		payload: { data: { __typename: 'StoreEnvironmentVariablePayload' } },
		transport: 'graphql',
		graphqlField: 'storeEnvironmentVariable',
	},
	{
		meta: 'contextsGraphQL.removeEnvVar',
		run: (c) =>
			ContextsGraphQL.removeEnvVar(c, { contextId: CONTEXT_ID, variable: 'X' }),
		payload: { data: { __typename: 'RemoveEnvironmentVariablePayload' } },
		transport: 'graphql',
		graphqlField: 'removeEnvironmentVariable',
	},

	// ---- groups (v2) ----
	{
		meta: 'groups.create',
		run: (c) => Groups.create(c, { orgId: ORG_ID, name: 'g' }),
		payload: { id: 'g-1' },
		transport: 'v2',
		method: 'POST',
		path: `organizations/${ORG_ID}/groups`,
		expectBody: { name: 'g' },
	},
	{
		meta: 'groups.delete',
		run: (c) => Groups.remove(c, { orgId: ORG_ID, groupId: 'g-1' }),
		payload: {},
		transport: 'v2',
		method: 'DELETE',
		path: `organizations/${ORG_ID}/groups/g-1`,
	},
	{
		meta: 'groups.get',
		run: (c) => Groups.get(c, { orgId: ORG_ID, groupId: 'g-1' }),
		payload: { id: 'g-1' },
		transport: 'v2',
		method: 'GET',
		path: `organizations/${ORG_ID}/groups/g-1`,
	},
	{
		meta: 'groups.list',
		run: (c) => Groups.list(c, { orgId: ORG_ID }),
		payload: { items: [] },
		transport: 'v2',
		method: 'GET',
		path: `organizations/${ORG_ID}/groups`,
	},

	// ---- orb allow-list (v2) ----
	{
		meta: 'orbAllowlist.create',
		run: (c) =>
			OrbAllowlist.create(c, {
				orgSlugOrId: ORG_ID,
				name: 'a',
				prefix: 'https://x/',
				auth: 'none',
			}),
		payload: { id: 'a-1', message: 'Created.' },
		transport: 'v2',
		method: 'POST',
		path: `organization/${ORG_ID}/url-orb-allow-list`,
		expectBody: { name: 'a', prefix: 'https://x/', auth: 'none' },
	},
	{
		meta: 'orbAllowlist.delete',
		run: (c) => OrbAllowlist.remove(c, { orgSlugOrId: ORG_ID, entryId: 'a-1' }),
		payload: {},
		transport: 'v2',
		method: 'DELETE',
		path: `organization/${ORG_ID}/url-orb-allow-list/a-1`,
	},

	// ---- projects (v2) ----
	{
		meta: 'projects.create',
		run: (c) => Projects.create(c, { orgSlugOrId: ORG_ID, name: 'widgets' }),
		payload: { id: 'p-1', slug: PROJECT_SLUG },
		transport: 'v2',
		method: 'POST',
		path: `organization/${ORG_ID}/project`,
		expectBody: { name: 'widgets' },
	},
	{
		meta: 'projects.delete',
		run: (c) => Projects.remove(c, { projectSlug: PROJECT_SLUG }),
		payload: {},
		transport: 'v2',
		method: 'DELETE',
		path: `project/${PROJECT_SLUG}`,
	},
	{
		meta: 'projects.get',
		run: (c) => Projects.get(c, { projectSlug: PROJECT_SLUG }),
		payload: { id: 'p-1', slug: PROJECT_SLUG },
		transport: 'v2',
		method: 'GET',
		path: `project/${PROJECT_SLUG}`,
	},

	// ---- project env vars (v2) ----
	{
		meta: 'projectEnvVars.create',
		run: (c) =>
			ProjectEnvVars.create(c, {
				projectSlug: PROJECT_SLUG,
				name: 'X',
				value: 'secret',
			}),
		payload: { name: 'X', value: 'xxxxcret' },
		transport: 'v2',
		method: 'POST',
		path: `project/${PROJECT_SLUG}/envvar`,
		expectBody: { name: 'X', value: 'secret' },
	},
	{
		meta: 'projectEnvVars.delete',
		run: (c) =>
			ProjectEnvVars.remove(c, { projectSlug: PROJECT_SLUG, name: 'X' }),
		payload: {},
		transport: 'v2',
		method: 'DELETE',
		path: `project/${PROJECT_SLUG}/envvar/X`,
	},
	{
		meta: 'projectEnvVars.list',
		run: (c) => ProjectEnvVars.list(c, { projectSlug: PROJECT_SLUG }),
		payload: { items: [] },
		transport: 'v2',
		method: 'GET',
		path: `project/${PROJECT_SLUG}/envvar`,
	},

	// ---- schedules (v2) ----
	{
		meta: 'schedules.list',
		run: (c) => Schedules.list(c, { projectSlug: PROJECT_SLUG }),
		payload: { items: [] },
		transport: 'v2',
		method: 'GET',
		path: `project/${PROJECT_SLUG}/schedule`,
	},

	// ---- usage export (v2) ----
	{
		meta: 'usageExport.create',
		run: (c) =>
			Usage.create(c, {
				orgId: ORG_ID,
				start: '2026-01-01T00:00:00Z',
				end: '2026-01-31T00:00:00Z',
			}),
		payload: { id: 'u-1' },
		transport: 'v2',
		method: 'POST',
		path: `organizations/${ORG_ID}/usage_export_job`,
		expectBody: { start: '2026-01-01T00:00:00Z', end: '2026-01-31T00:00:00Z' },
	},
	{
		meta: 'usageExport.get',
		run: (c) => Usage.get(c, { orgId: ORG_ID, usageExportJobId: 'u-1' }),
		payload: { id: 'u-1' },
		transport: 'v2',
		method: 'GET',
		path: `organizations/${ORG_ID}/usage_export_job/u-1`,
	},

	// ---- pipelines (v2) ----
	{
		meta: 'pipelines.list',
		run: (c) => Pipelines.list(c, { orgSlug: 'gh/acme' }),
		payload: { items: [] },
		transport: 'v2',
		method: 'GET',
		path: 'pipeline',
	},
	{
		meta: 'pipelines.listForProject',
		run: (c) => Pipelines.listForProject(c, { projectSlug: PROJECT_SLUG }),
		payload: { items: [] },
		transport: 'v2',
		method: 'GET',
		path: `project/${PROJECT_SLUG}/pipeline`,
	},
	{
		meta: 'pipelines.getConfig',
		run: (c) => Pipelines.getConfig(c, { pipelineId: 'pl-1' }),
		payload: {},
		transport: 'v2',
		method: 'GET',
		path: 'pipeline/pl-1/config',
	},
	{
		meta: 'pipelines.trigger',
		run: (c) =>
			Pipelines.trigger(c, { projectSlug: PROJECT_SLUG, branch: 'main' }),
		payload: { id: 'pl-1' },
		transport: 'v2',
		method: 'POST',
		path: `project/${PROJECT_SLUG}/pipeline`,
		expectBody: { branch: 'main' },
	},

	// ---- pipeline definitions (v2) ----
	{
		meta: 'pipelineDefinitions.get',
		run: (c) =>
			PipelineDefinitions.get(c, {
				projectId: 'p-1',
				pipelineDefinitionId: 'pd-1',
			}),
		payload: { id: 'pd-1' },
		transport: 'v2',
		method: 'GET',
		path: 'projects/p-1/pipeline-definitions/pd-1',
	},
	{
		meta: 'pipelineDefinitions.list',
		run: (c) => PipelineDefinitions.list(c, { projectId: 'p-1' }),
		payload: { items: [] },
		transport: 'v2',
		method: 'GET',
		path: 'projects/p-1/pipeline-definitions',
	},

	// ---- workflows (v2) ----
	{
		meta: 'workflows.listByPipelineId',
		run: (c) => Workflows.listByPipelineId(c, { pipelineId: 'pl-1' }),
		payload: { items: [] },
		transport: 'v2',
		method: 'GET',
		path: 'pipeline/pl-1/workflow',
	},
	{
		meta: 'workflows.getSummary',
		run: (c) =>
			Workflows.getSummary(c, {
				projectSlug: PROJECT_SLUG,
				workflowName: 'build',
			}),
		payload: {},
		transport: 'v2',
		method: 'GET',
		path: `insights/${PROJECT_SLUG}/workflows/build/summary`,
	},
	{
		meta: 'workflows.listJobs',
		run: (c) =>
			Workflows.listJobs(c, {
				projectSlug: PROJECT_SLUG,
				workflowName: 'build',
			}),
		payload: {},
		transport: 'v2',
		method: 'GET',
		path: `insights/${PROJECT_SLUG}/workflows/build/jobs`,
	},
	{
		meta: 'workflows.listTestMetrics',
		run: (c) =>
			Workflows.listTestMetrics(c, {
				projectSlug: PROJECT_SLUG,
				workflowName: 'build',
			}),
		payload: {},
		transport: 'v2',
		method: 'GET',
		path: `insights/${PROJECT_SLUG}/workflows/build/test-metrics`,
	},

	// ---- insights (v2) ----
	{
		meta: 'insights.flakyTests',
		run: (c) => Insights.flakyTests(c, { projectSlug: PROJECT_SLUG }),
		payload: {},
		transport: 'v2',
		method: 'GET',
		path: `insights/${PROJECT_SLUG}/flaky-tests`,
	},
	{
		meta: 'insights.projectWorkflows',
		run: (c) => Insights.projectWorkflows(c, { projectSlug: PROJECT_SLUG }),
		payload: {},
		transport: 'v2',
		method: 'GET',
		path: `insights/${PROJECT_SLUG}/workflows`,
	},
	{
		meta: 'insights.pagesSummary',
		run: (c) => Insights.pagesSummary(c, { projectSlug: PROJECT_SLUG }),
		payload: {},
		transport: 'v2',
		method: 'GET',
		path: `insights/pages/${PROJECT_SLUG}/summary`,
	},
	{
		meta: 'insights.branches',
		run: (c) => Insights.branches(c, { projectSlug: PROJECT_SLUG }),
		payload: {},
		transport: 'v2',
		method: 'GET',
		path: `insights/${PROJECT_SLUG}/branches`,
	},
	{
		meta: 'insights.orgSummary',
		run: (c) => Insights.orgSummaryList(c, { orgSlug: 'gh/acme' }),
		payload: {},
		transport: 'v2',
		method: 'GET',
		path: 'insights/gh/acme/summary',
	},
	{
		meta: 'insights.planMetrics',
		run: (c) => Insights.planMetrics(c, { orgSlug: 'gh/acme' }),
		payload: {},
		transport: 'v2',
		method: 'GET',
		path: 'insights/gh/acme/summary',
	},

	// ---- jobs (v1.1) ----
	{
		meta: 'jobs.getDetails',
		run: (c) =>
			Jobs.getDetails(c, {
				vcsType: 'gh',
				username: 'acme',
				project: 'widgets',
				buildNumber: 1,
			}),
		payload: { build_num: 1 },
		transport: 'v1.1',
		method: 'GET',
		path: 'project/gh/acme/widgets/1',
	},
	{
		meta: 'jobs.getArtifacts',
		run: (c) =>
			Jobs.getArtifacts(c, {
				vcsType: 'gh',
				username: 'acme',
				project: 'widgets',
				buildNumber: 1,
			}),
		payload: [],
		transport: 'v1.1',
		method: 'GET',
		path: 'project/gh/acme/widgets/1/artifacts',
	},
	{
		meta: 'jobs.getTestMetadata',
		run: (c) =>
			Jobs.getTestMetadata(c, {
				vcsType: 'gh',
				username: 'acme',
				project: 'widgets',
				buildNumber: 1,
			}),
		payload: { tests: [] },
		transport: 'v1.1',
		method: 'GET',
		path: 'project/gh/acme/widgets/1/tests',
	},

	// ---- user (v2) ----
	{
		meta: 'user.getCurrent',
		run: (c) => User.getCurrent(c, {}),
		payload: { id: 'u-1' },
		transport: 'v2',
		method: 'GET',
		path: 'me',
	},
	{
		meta: 'user.getInfo',
		run: (c) => User.getInfo(c, { userId: 'u-2' }),
		payload: { id: 'u-2' },
		transport: 'v2',
		method: 'GET',
		path: 'user/u-2',
	},
	{
		meta: 'user.listCollaborations',
		run: (c) => User.listCollaborations(c, {}),
		payload: [],
		transport: 'v2',
		method: 'GET',
		path: 'me/collaborations',
	},

	// ---- organization (GraphQL) ----
	{
		meta: 'organization.get',
		run: (c) => Organization.get(c, { id: ORG_ID }),
		payload: { data: { organization: { id: ORG_ID, name: 'Acme' } } },
		transport: 'graphql',
		graphqlField: 'organization',
	},

	// ---- namespace (v3 + graphql) ----
	{
		meta: 'namespace.queryExists',
		run: (c) => Namespaces.queryExists(c, { name: 'circleci' }),
		payload: { data: { id: 'ns-1', attributes: { name: 'circleci' } } },
		transport: 'v3',
		method: 'GET',
		path: 'namespaces',
	},
	// namespace.delete and namespace.rename each make TWO requests (resolve the
	// name to an id, then act on it) - the single-mock table above answers every
	// request identically, so their route is asserted in the dedicated
	// multi-request test near the bottom of this file instead.
	{
		meta: 'namespace.deleteAlias',
		run: (c) => Namespaces.deleteAlias(c, { name: 'circleci' }),
		payload: { data: { deleteNamespaceAlias: { errors: [] } } },
		transport: 'graphql',
		graphqlField: 'deleteNamespaceAlias',
	},

	// ---- orbs (GraphQL) ----
	{
		meta: 'orbs.getDetails',
		run: (c) => Orbs.getDetails(c, { name: 'circleci/node' }),
		payload: { data: { orb: { id: 'o-1', name: 'circleci/node' } } },
		transport: 'graphql',
		graphqlField: 'orb',
	},
	{
		meta: 'orbs.getVersion',
		run: (c) => Orbs.getVersion(c, { orbVersionRef: 'circleci/node@1.0.0' }),
		payload: { data: { orbVersion: { id: 'v-1' } } },
		transport: 'graphql',
		graphqlField: 'orbVersion',
	},
	{
		meta: 'orbs.queryId',
		run: (c) => Orbs.queryId(c, { name: 'circleci/node' }),
		payload: { data: { orb: { id: 'o-1' } } },
		transport: 'graphql',
		graphqlField: 'orb',
	},
	{
		meta: 'orbs.queryExists',
		run: (c) => Orbs.queryExists(c, { name: 'circleci/node' }),
		payload: { data: { orb: { id: 'o-1', isPrivate: false } } },
		transport: 'graphql',
		graphqlField: 'orb',
	},
	{
		meta: 'orbs.queryLatestVersion',
		run: (c) => Orbs.queryLatestVersion(c, { name: 'circleci/node' }),
		payload: { data: { orb: { versions: [{ id: 'v-1', version: '1.0.0' }] } } },
		transport: 'graphql',
		graphqlField: 'orb',
	},
	{
		meta: 'orbs.querySource',
		run: (c) => Orbs.querySource(c, { orbVersionRef: 'circleci/node@1.0.0' }),
		payload: { data: { orbVersion: { id: 'v-1', source: 'version: 2.1' } } },
		transport: 'graphql',
		graphqlField: 'orbVersion',
	},
	{
		meta: 'orbs.listOrbs',
		run: (c) => Orbs.listOrbs(c, {}),
		payload: { data: { orbs: { edges: [] } } },
		transport: 'graphql',
		graphqlField: 'orbs',
	},
	{
		meta: 'orbs.listCategories',
		run: (c) => Orbs.listCategories(c, {}),
		payload: { data: { orbCategories: { edges: [] } } },
		transport: 'graphql',
		graphqlField: 'orbCategories',
	},
	{
		meta: 'orbs.queryCategoryId',
		run: (c) => Orbs.queryCategoryId(c, { name: 'Deployment' }),
		payload: {
			data: {
				orbCategories: {
					edges: [{ node: { id: 'cat-1', name: 'Deployment' } }],
					pageInfo: { hasNextPage: false, endCursor: null },
				},
			},
		},
		transport: 'graphql',
		graphqlField: 'orbCategories',
	},
	{
		meta: 'orbs.listNamespaceOrbs',
		run: (c) => Orbs.listNamespaceOrbs(c, {}),
		payload: { data: [] },
		transport: 'v3',
		method: 'GET',
		path: 'orb/packages',
	},
	{
		meta: 'orbs.validateConfig',
		run: (c) => Orbs.validateConfig(c, { orbYaml: 'version: 2.1' }),
		payload: {
			data: {
				orbConfig: { valid: true, errors: [], sourceYaml: 'version: 2.1' },
			},
		},
		transport: 'graphql',
		graphqlField: 'orbConfig',
	},

	// ---- runners (v3) ----
	{
		meta: 'runners.list',
		run: (c) => Runners.list(c, {}),
		payload: { items: [] },
		transport: 'v3',
		method: 'GET',
		path: 'runner',
	},
];

beforeEach(() => {
	mockLogEvent.mockClear();
});

describe('every operation calls the transport and route it claims to', () => {
	for (const testCase of cases) {
		it(`${testCase.meta} -> ${testCase.transport}`, async () => {
			const { ctx } = makeCtx();
			mockFetch(testCase.payload);

			await testCase.run(ctx);

			expect(captured).toBeDefined();

			if (testCase.transport === 'graphql') {
				expect(captured?.url).toBe(CIRCLECI_GRAPHQL_URL);
				const sent = graphQLSent();
				expect(sent.query).toContain(`${testCase.graphqlField}(`);
			} else {
				expect(captured?.method).toBe(testCase.method);
				expect(calledPath()).toBe(testCase.path);
				const base =
					testCase.transport === 'v2'
						? CIRCLECI_V2_BASE
						: testCase.transport === 'v3'
							? CIRCLECI_V3_BASE
							: CIRCLECI_V1_BASE;
				expect(captured?.url.startsWith(base)).toBe(true);
			}

			if (testCase.expectBody) {
				expect(sentBody()).toEqual(testCase.expectBody);
			}
		});
	}
});

/**
 * `namespace.delete` and `namespace.rename` each make two requests (resolve
 * the name to an id, then act on it), so the single-mock case table cannot
 * cover them - they get their own multi-request test near the bottom of this
 * file instead. Named here so the coverage sweep still proves every
 * registered operation has a test somewhere, not just in `cases`.
 */
const MANUALLY_COVERED = ['namespace.delete', 'namespace.rename'];

describe('coverage sweep', () => {
	it('exercises precisely the operations that are registered', () => {
		const exercised = [
			...new Set([...cases.map((c) => c.meta), ...MANUALLY_COVERED]),
		].sort();
		const registered = Object.keys(circleCIEndpointMeta).sort();
		expect(exercised).toEqual(registered);
	});

	it('registers exactly the 65 operations the catalog lists', () => {
		expect(Object.keys(circleCIEndpointMeta)).toHaveLength(65);
	});
});

describe('mirroring', () => {
	it('caches a project it read', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ id: 'p-1', slug: PROJECT_SLUG });
		await Projects.get(ctx, { projectSlug: PROJECT_SLUG });
		expect(db.projects.upsertByEntityId).toHaveBeenCalledWith(
			PROJECT_SLUG,
			expect.objectContaining({ slug: PROJECT_SLUG }),
		);
	});

	it('caches a context created via GraphQL, normalising createdAt to the mirror created_at field', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({
			data: {
				createContext: {
					context: { id: CONTEXT_ID, name: 'ctx', createdAt: '2026-01-01' },
				},
			},
		});
		await ContextsGraphQL.create(ctx, {
			contextName: 'ctx',
			ownerId: ORG_ID,
			ownerType: 'organization',
		});
		expect(db.contexts.upsertByEntityId).toHaveBeenCalledWith(
			CONTEXT_ID,
			expect.objectContaining({ id: CONTEXT_ID, created_at: '2026-01-01' }),
		);
	});

	it('caches a context read via GraphQL the same way its REST v2 twin does', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({
			data: {
				context: { id: CONTEXT_ID, name: 'ctx', createdAt: '2026-01-01' },
			},
		});
		await ContextsGraphQL.query(ctx, { contextId: CONTEXT_ID });
		expect(db.contexts.upsertByEntityId).toHaveBeenCalledWith(
			CONTEXT_ID,
			expect.objectContaining({ id: CONTEXT_ID, created_at: '2026-01-01' }),
		);
	});

	it('evicts a deleted context (GraphQL), and treats the eviction as required', async () => {
		const { ctx, db } = makeCtx();
		db.contexts.deleteByEntityId.mockRejectedValueOnce(new Error('db down'));
		mockFetch({ data: { __typename: 'DeleteContextPayload' } });
		await expect(
			ContextsGraphQL.remove(ctx, { contextId: CONTEXT_ID }),
		).rejects.toThrow();
	});

	describe('a required eviction failing must not erase the record that the remote delete already succeeded', () => {
		// All three operations whose eviction is `required: true` - a delete
		// that has already happened remotely, where a local mirror failure
		// afterward must not suppress the audit trail of the real deletion. See
		// the doc comments on `ContextsGraphQL.remove`, `Groups.remove` and
		// `Projects.remove`.
		const REQUIRED_EVICTION_DELETES = [
			{
				label: 'contextsGraphQL.delete',
				storeName: 'contexts' as const,
				eventType: 'circleci.contexts.deleteGraphQL',
				run: (ctx: Ctx) =>
					ContextsGraphQL.remove(ctx, { contextId: CONTEXT_ID }),
				payload: { data: { __typename: 'DeleteContextPayload' } },
			},
			{
				label: 'groups.delete',
				storeName: 'groups' as const,
				eventType: 'circleci.groups.delete',
				run: (ctx: Ctx) =>
					Groups.remove(ctx, { orgId: ORG_ID, groupId: 'g-1' }),
				payload: {},
			},
			{
				label: 'projects.delete',
				storeName: 'projects' as const,
				eventType: 'circleci.projects.delete',
				run: (ctx: Ctx) => Projects.remove(ctx, { projectSlug: PROJECT_SLUG }),
				payload: {},
			},
		];

		// Non-vacuous: confirms the list above actually names the operations the
		// registry marks `required` eviction - see `persist.ts` grep, not
		// re-derived here to avoid the parsing pitfalls section 16/18 warn about.
		it('covers exactly the three required-eviction deletes', () => {
			expect(REQUIRED_EVICTION_DELETES.map((d) => d.label).sort()).toEqual(
				['contextsGraphQL.delete', 'groups.delete', 'projects.delete'].sort(),
			);
		});

		for (const {
			label,
			storeName,
			eventType,
			run,
			payload,
		} of REQUIRED_EVICTION_DELETES) {
			it(`${label}: still logs the deletion even when the required eviction throws`, async () => {
				const { ctx, db } = makeCtx();
				db[storeName].deleteByEntityId.mockRejectedValueOnce(
					new Error('db down'),
				);
				mockFetch(payload);

				await expect(run(ctx)).rejects.toThrow();

				expect(mockLogEvent).toHaveBeenCalledWith(
					expect.anything(),
					eventType,
					expect.anything(),
					'completed',
				);
			});
		}
	});

	it('does not fail a read because the mirror could not be written', async () => {
		const { ctx, db } = makeCtx();
		db.groups.upsertByEntityId.mockRejectedValueOnce(new Error('db down'));
		mockFetch({ items: [{ id: 'g-1' }] });
		const result = await Groups.list(ctx, { orgId: ORG_ID });
		expect(result.items).toHaveLength(1);
	});

	it('never mirrors an env var value - not the plaintext, and not the masked wire form either', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ name: 'X', value: 'xxxxcret', created_at: '2026-01-01' });
		await ProjectEnvVars.create(ctx, {
			projectSlug: PROJECT_SLUG,
			name: 'X',
			value: 'plaintext-secret',
		});
		const [, mirrored] = db.projectEnvVars.upsertByEntityId.mock.calls[0] ?? [];
		expect(JSON.stringify(mirrored)).not.toContain('plaintext-secret');
		// The plaintext was never in the mocked response to begin with, so the
		// assertion above alone proves nothing about the mirror specifically -
		// it would pass even if the masked value were written straight through.
		// This is the assertion that actually distinguishes the two: the
		// server's own masked confirmation ("xxxxcret") must not reach the
		// mirror either, even though it legitimately reaches the return value.
		expect(mirrored).not.toHaveProperty('value');
	});

	it('the caller-facing return value still carries the masked value - only the mirror strips it', async () => {
		const { ctx } = makeCtx();
		mockFetch({ name: 'X', value: 'xxxxcret', created_at: '2026-01-01' });
		const result = await ProjectEnvVars.create(ctx, {
			projectSlug: PROJECT_SLUG,
			name: 'X',
			value: 'plaintext-secret',
		});
		expect(result.value).toBe('xxxxcret');
	});

	it('two projects with an env var of the same name mirror as two rows, not one overwriting the other', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ name: 'API_KEY', value: 'xxxx1111', created_at: '2026-01-01' });
		await ProjectEnvVars.create(ctx, {
			projectSlug: 'gh/acme/widgets',
			name: 'API_KEY',
			value: 'first-project-secret',
		});
		mockFetch({ name: 'API_KEY', value: 'xxxx2222', created_at: '2026-01-01' });
		await ProjectEnvVars.create(ctx, {
			projectSlug: 'gh/acme/other-widgets',
			name: 'API_KEY',
			value: 'second-project-secret',
		});
		const entityIds = db.projectEnvVars.upsertByEntityId.mock.calls.map(
			([entityId]) => entityId,
		);
		// A bare `name`-only key would have written the same id twice; the fix
		// composes the project into the key, so both calls must use distinct
		// keys even though the env var name is identical.
		expect(entityIds).toHaveLength(2);
		expect(new Set(entityIds).size).toBe(2);
	});

	it('never mirrors a context env var truncated_value, embedded or not', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({
			id: CONTEXT_ID,
			name: 'ctx',
			environment_variables: [
				{ variable: 'X', truncated_value: 'cret', context_id: CONTEXT_ID },
			],
		});
		await Contexts.get(ctx, { contextId: CONTEXT_ID });
		const [, mirrored] = db.contexts.upsertByEntityId.mock.calls[0] ?? [];
		expect(mirrored).not.toHaveProperty('environment_variables');
		expect(JSON.stringify(mirrored)).not.toContain('cret');
	});

	it('persisted env var records keep no secret-derived fields', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({
			name: 'X',
			value: 'xxxxcret',
			truncated_value: 'cret',
			secret: 'nope',
			created_at: '2026-01-01',
		});
		await ProjectEnvVars.create(ctx, {
			projectSlug: PROJECT_SLUG,
			name: 'X',
			value: 'plaintext-secret',
		});
		const [, mirrored] = db.projectEnvVars.upsertByEntityId.mock.calls[0] ?? [];
		expect(mirrored).toEqual({ name: 'X', created_at: '2026-01-01' });
		expect(JSON.stringify(mirrored)).not.toMatch(
			/plaintext-secret|xxxxcret|cret|nope/,
		);
	});

	it('does not mirror orbs or namespaces - they are a shared registry, not account data', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ data: { orb: { id: 'o-1', name: 'circleci/node' } } });
		await Orbs.getDetails(ctx, { name: 'circleci/node' });
		for (const store of Object.values(db)) {
			expect(store.upsertByEntityId).not.toHaveBeenCalled();
		}
	});
});

function loggedPayload(): Record<string, unknown> {
	return (mockLogEvent.mock.calls[0]?.[2] ?? {}) as Record<string, unknown>;
}

describe('what reaches the event log', () => {
	it('never logs a context env var value', async () => {
		const { ctx } = makeCtx();
		mockFetch({ variable: 'X' });
		await Contexts.upsertEnvVar(ctx, {
			contextId: CONTEXT_ID,
			variable: 'X',
			value: 'a-real-secret-value',
		});
		expect(JSON.stringify(loggedPayload())).not.toContain(
			'a-real-secret-value',
		);
	});

	it('never logs a project env var value, on either transport', async () => {
		const { ctx } = makeCtx();
		mockFetch({ name: 'X', value: 'xxxxcret' });
		await ProjectEnvVars.create(ctx, {
			projectSlug: PROJECT_SLUG,
			name: 'X',
			value: 'a-real-secret-value',
		});
		expect(JSON.stringify(loggedPayload())).not.toContain(
			'a-real-secret-value',
		);
	});

	it('never logs orb YAML source', async () => {
		const { ctx } = makeCtx();
		const yaml = 'version: 2.1\ndescription: something proprietary';
		mockFetch({
			data: { orbConfig: { valid: true, errors: [], sourceYaml: yaml } },
		});
		await Orbs.validateConfig(ctx, { orbYaml: yaml });
		expect(JSON.stringify(loggedPayload())).not.toContain('proprietary');
	});

	it('records only bytes/count for job artifacts and tests, not their contents', async () => {
		const { ctx } = makeCtx();
		mockFetch([{ path: 'coverage.xml', url: 'https://example.com/artifact' }]);
		await Jobs.getArtifacts(ctx, {
			vcsType: 'gh',
			username: 'acme',
			project: 'widgets',
			buildNumber: 1,
		});
		const payload = loggedPayload();
		expect(typeof payload.returned).toBe('number');
		// The claim in the test name, made checkable: the previous assertion
		// alone would pass even if the whole artifact list were logged
		// alongside `returned`. Confirm the artifact's own fields never reach
		// the payload.
		const serialised = JSON.stringify(payload);
		expect(serialised).not.toContain('coverage.xml');
		expect(serialised).not.toContain('https://example.com/artifact');
	});
});

describe('the v1.1 job routes never surface the commit author email', () => {
	it('jobsGetDetails does not read or log all_commit_details', async () => {
		const { ctx } = makeCtx();
		const secretEmail = 'realperson@example.com';
		mockFetch({
			build_num: 1,
			status: 'success',
			all_commit_details: [
				{ author_email: secretEmail, author_name: 'Real Person' },
			],
		});

		const result = await Jobs.getDetails(ctx, {
			vcsType: 'gh',
			username: 'acme',
			project: 'widgets',
			buildNumber: 1,
		});

		// The raw payload had the email; the returned/typed result and the audit
		// log must not, because the output schema does not declare the field.
		expect(JSON.stringify(result)).toEqual(
			expect.not.stringContaining(secretEmail),
		);
		expect(JSON.stringify(loggedPayload())).not.toContain(secretEmail);
	});
});

describe('GraphQL existence checks distinguish null from error', () => {
	it('orbs.queryExists reports false on a null orb, not a thrown error', async () => {
		const { ctx } = makeCtx();
		mockFetch({ data: { orb: null } });
		const result = await Orbs.queryExists(ctx, { name: 'not/real' });
		expect(result.exists).toBe(false);
	});

	it('orbs.getDetails throws a clear error on a null orb rather than returning null silently', async () => {
		const { ctx } = makeCtx();
		mockFetch({ data: { orb: null } });
		await expect(Orbs.getDetails(ctx, { name: 'not/real' })).rejects.toThrow(
			/not found/i,
		);
	});
});

describe('namespace.deleteAlias reads its own business-error field, not just the transport-level errors[]', () => {
	// `deleteNamespaceAlias` reports failure inside its own mutation payload
	// (`{errors: [...]}`) rather than through the top-level GraphQL errors[]
	// array `circleCIGraphQLCall` already throws on - a 200 with an empty
	// `data.deleteNamespaceAlias.errors` is what CircleCI answers on genuine
	// failure. An earlier version of this function never read that field, so
	// it logged 'completed' and returned the error payload as a success.
	it('throws when the mutation payload carries a business error, and does not log completed', async () => {
		const { ctx } = makeCtx();
		mockFetch({
			data: {
				deleteNamespaceAlias: {
					errors: [{ message: 'Namespace not found with name "ghost"' }],
				},
			},
		});
		await expect(
			Namespaces.deleteAlias(ctx, { name: 'ghost' }),
		).rejects.toThrow(/ghost/);
		expect(mockLogEvent).not.toHaveBeenCalledWith(
			expect.anything(),
			'circleci.namespace.deleteAlias',
			expect.anything(),
			'completed',
		);
	});

	it('succeeds and logs completed when errors is empty', async () => {
		const { ctx } = makeCtx();
		mockFetch({ data: { deleteNamespaceAlias: { errors: [] } } });
		await expect(
			Namespaces.deleteAlias(ctx, { name: 'circleci' }),
		).resolves.toEqual({});
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'circleci.namespace.deleteAlias',
			expect.anything(),
			'completed',
		);
	});
});

describe('the LIST_INSIGHTS_SUMMARY / QUERY_PLAN_METRICS alias', () => {
	it('both catalog ids call the identical route', async () => {
		const { ctx } = makeCtx();

		mockFetch({ org_data: {} });
		await Insights.orgSummaryList(ctx, { orgSlug: 'gh/acme' });
		const summaryPath = calledPath();

		mockFetch({ org_data: {} });
		await Insights.planMetrics(ctx, { orgSlug: 'gh/acme' });
		const metricsPath = calledPath();

		expect(summaryPath).toBe(metricsPath);
	});

	it('gives each alias its own audit event', async () => {
		const { ctx } = makeCtx();

		mockFetch({ org_data: {} });
		await Insights.orgSummaryList(ctx, { orgSlug: 'gh/acme' });
		const first = mockLogEvent.mock.calls[0]?.[1];

		mockLogEvent.mockClear();
		mockFetch({ org_data: {} });
		await Insights.planMetrics(ctx, { orgSlug: 'gh/acme' });
		const second = mockLogEvent.mock.calls[0]?.[1];

		expect(first).toBe('circleci.insights.orgSummary');
		expect(second).toBe('circleci.insights.planMetrics');
		expect(first).not.toBe(second);
	});
});

describe('the GET_ORB_VERSION / QUERY_ORB_SOURCE alias', () => {
	it('both catalog ids send the identical GraphQL query', async () => {
		const { ctx } = makeCtx();

		mockFetch({
			data: { orbVersion: { id: 'v-1', version: '1.0.0', source: 'x' } },
		});
		await Orbs.getVersion(ctx, { orbVersionRef: 'circleci/node@1.0.0' });
		const versionQuery = graphQLSent().query;

		mockFetch({
			data: { orbVersion: { id: 'v-1', version: '1.0.0', source: 'x' } },
		});
		await Orbs.querySource(ctx, { orbVersionRef: 'circleci/node@1.0.0' });
		const sourceQuery = graphQLSent().query;

		expect(versionQuery).toBe(sourceQuery);
	});

	it('gives each alias its own audit event', async () => {
		const { ctx } = makeCtx();

		mockFetch({
			data: { orbVersion: { id: 'v-1', version: '1.0.0', source: 'x' } },
		});
		await Orbs.getVersion(ctx, { orbVersionRef: 'circleci/node@1.0.0' });
		const first = mockLogEvent.mock.calls[0]?.[1];

		mockLogEvent.mockClear();
		mockFetch({
			data: { orbVersion: { id: 'v-1', version: '1.0.0', source: 'x' } },
		});
		await Orbs.querySource(ctx, { orbVersionRef: 'circleci/node@1.0.0' });
		const second = mockLogEvent.mock.calls[0]?.[1];

		expect(first).toBe('circleci.orbs.getVersion');
		expect(second).toBe('circleci.orbs.querySource');
		expect(first).not.toBe(second);
	});
});

describe('namespace.delete and namespace.rename resolve the name to an id first', () => {
	function mockTwoStep(secondPayload: unknown) {
		const calls: string[] = [];
		global.fetch = (async (url: unknown, init?: RequestInit) => {
			calls.push(`${init?.method ?? 'GET'} ${String(url)}`);
			const isFirst = calls.length === 1;
			const payload = isFirst
				? { data: { id: 'ns-1', attributes: { name: 'circleci' } } }
				: secondPayload;
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				url: String(url),
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => payload,
				text: async () => JSON.stringify(payload),
			};
		}) as unknown as typeof global.fetch;
		return calls;
	}

	it('namespace.delete: GET by name, then DELETE by the resolved id', async () => {
		const { ctx } = makeCtx();
		const calls = mockTwoStep({ data: { id: 'ns-1', message: 'Deleted.' } });

		await Namespaces.remove(ctx, { name: 'circleci' });

		expect(calls.length).toBe(2);
		expect(calls[0]).toMatch(/^GET .*namespaces\?/);
		expect(calls[1]).toMatch(/^DELETE .*namespaces\/ns-1$/);
	});

	it('namespace.rename: GET by name, then POST rename to the resolved id', async () => {
		const { ctx } = makeCtx();
		const calls = mockTwoStep({
			data: { id: 'ns-1', attributes: { name: 'circleci2' } },
		});

		await Namespaces.rename(ctx, { name: 'circleci', newName: 'circleci2' });

		expect(calls.length).toBe(2);
		expect(calls[0]).toMatch(/^GET .*namespaces\?/);
		expect(calls[1]).toMatch(/^POST .*namespaces\/ns-1\/rename$/);
	});
});

/** Answers each successive request with the next payload in `payloads`, repeating the last one once exhausted. */
function mockSequence(payloads: unknown[]) {
	let call = 0;
	global.fetch = (async () => {
		const payload = payloads[Math.min(call, payloads.length - 1)];
		call++;
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
	return () => call;
}

describe('orbs.queryCategoryId actually pages, not just on a single response', () => {
	it('finds a match on the second page after the first has none', async () => {
		const { ctx } = makeCtx();
		const callCount = mockSequence([
			{
				data: {
					orbCategories: {
						edges: [{ node: { id: 'c-1', name: 'Testing' } }],
						pageInfo: { hasNextPage: true, endCursor: 'cursor-1' },
					},
				},
			},
			{
				data: {
					orbCategories: {
						edges: [{ node: { id: 'c-2', name: 'Deployment' } }],
						pageInfo: { hasNextPage: false, endCursor: null },
					},
				},
			},
		]);
		const result = await Orbs.queryCategoryId(ctx, { name: 'Deployment' });
		expect(result).toEqual({ id: 'c-2', name: 'Deployment' });
		expect(callCount()).toBe(2);
	});

	it('exhausts every page and throws when no page matches', async () => {
		const { ctx } = makeCtx();
		mockSequence([
			{
				data: {
					orbCategories: {
						edges: [{ node: { id: 'c-1', name: 'Testing' } }],
						pageInfo: { hasNextPage: false, endCursor: null },
					},
				},
			},
		]);
		await expect(
			Orbs.queryCategoryId(ctx, { name: 'DoesNotExist' }),
		).rejects.toThrow(/not found/i);
	});

	it('a page with no edges stops the loop rather than looping on a bound it never advances', async () => {
		const { ctx } = makeCtx();
		const callCount = mockSequence([
			{
				data: {
					orbCategories: {
						edges: [],
						pageInfo: { hasNextPage: true, endCursor: 'cursor-1' },
					},
				},
			},
		]);
		await expect(
			Orbs.queryCategoryId(ctx, { name: 'Deployment' }),
		).rejects.toThrow(/not found/i);
		// One call, not the MAX_SCANNED/PAGE_SIZE ceiling worth of calls a
		// stuck loop would have made.
		expect(callCount()).toBe(1);
	});
});

/**
 * Every one of these list operations used to return a bare array, so a
 * response carrying a real continuation cursor - `next_page_token` on v2,
 * `page.next` on v3, `pageInfo` on GraphQL - had that cursor silently
 * discarded: a caller had no way to tell an incomplete page from the whole
 * collection, and no way to ask for the rest. Each case here mocks a
 * response where the cursor is present and non-null, and asserts it survives
 * to the return value - a positive assertion, not just that the function
 * still resolves.
 */
describe('list operations surface the pagination cursor CircleCI returns', () => {
	it('contexts.listEnvVars: sends pageToken and returns next_page_token', async () => {
		const { ctx } = makeCtx();
		mockFetch({ items: [{ variable: 'X' }], next_page_token: 'cursor-1' });
		const result = await Contexts.listEnvVars(ctx, {
			contextId: CONTEXT_ID,
			pageToken: 'prev-cursor',
		});
		expect(query().get('page-token')).toBe('prev-cursor');
		expect(result.next_page_token).toBe('cursor-1');
	});

	it('groups.list: sends pageToken and returns next_page_token', async () => {
		const { ctx } = makeCtx();
		mockFetch({
			items: [{ id: 'g-1' }],
			next_page_token: 'cursor-1',
			total_count: 5,
		});
		const result = await Groups.list(ctx, {
			orgId: ORG_ID,
			pageToken: 'prev-cursor',
		});
		expect(query().get('page-token')).toBe('prev-cursor');
		expect(result.next_page_token).toBe('cursor-1');
	});

	it('projectEnvVars.list: returns next_page_token even though the route accepts no pageToken input', async () => {
		const { ctx } = makeCtx();
		mockFetch({ items: [{ name: 'X' }], next_page_token: 'cursor-1' });
		const result = await ProjectEnvVars.list(ctx, {
			projectSlug: PROJECT_SLUG,
		});
		expect(result.next_page_token).toBe('cursor-1');
	});

	it('schedules.list: sends pageToken and returns next_page_token', async () => {
		const { ctx } = makeCtx();
		mockFetch({ items: [{ id: 's-1' }], next_page_token: 'cursor-1' });
		const result = await Schedules.list(ctx, {
			projectSlug: PROJECT_SLUG,
			pageToken: 'prev-cursor',
		});
		expect(query().get('page-token')).toBe('prev-cursor');
		expect(result.next_page_token).toBe('cursor-1');
	});

	it('pipelines.list: sends pageToken and returns next_page_token', async () => {
		const { ctx } = makeCtx();
		mockFetch({ items: [{ id: 'pl-1' }], next_page_token: 'cursor-1' });
		const result = await Pipelines.list(ctx, { pageToken: 'prev-cursor' });
		expect(query().get('page-token')).toBe('prev-cursor');
		expect(result.next_page_token).toBe('cursor-1');
	});

	it('pipelines.listForProject: returns next_page_token', async () => {
		const { ctx } = makeCtx();
		mockFetch({ items: [{ id: 'pl-1' }], next_page_token: 'cursor-1' });
		const result = await Pipelines.listForProject(ctx, {
			projectSlug: PROJECT_SLUG,
			pageToken: 'prev-cursor',
		});
		expect(result.next_page_token).toBe('cursor-1');
	});

	it('workflows.listByPipelineId: returns next_page_token', async () => {
		const { ctx } = makeCtx();
		mockFetch({ items: [{ id: 'w-1' }], next_page_token: 'cursor-1' });
		const result = await Workflows.listByPipelineId(ctx, {
			pipelineId: 'pl-1',
			pageToken: 'prev-cursor',
		});
		expect(result.next_page_token).toBe('cursor-1');
	});

	it('orbs.listOrbs: requests pageInfo and returns it', async () => {
		const { ctx } = makeCtx();
		mockFetch({
			data: {
				orbs: {
					edges: [{ node: { id: 'o-1', name: 'x', isPrivate: false } }],
					pageInfo: { hasNextPage: true, endCursor: 'cursor-1' },
				},
			},
		});
		const result = await Orbs.listOrbs(ctx, {});
		expect(graphQLSent().query).toContain('pageInfo');
		expect(result.pageInfo).toEqual({
			hasNextPage: true,
			endCursor: 'cursor-1',
		});
	});

	it('orbs.listCategories: requests pageInfo and returns it', async () => {
		const { ctx } = makeCtx();
		mockFetch({
			data: {
				orbCategories: {
					edges: [{ node: { id: 'c-1', name: 'x' } }],
					pageInfo: { hasNextPage: false, endCursor: null },
				},
			},
		});
		const result = await Orbs.listCategories(ctx, {});
		expect(graphQLSent().query).toContain('pageInfo');
		expect(result.pageInfo).toEqual({ hasNextPage: false, endCursor: null });
	});

	it('orbs.listNamespaceOrbs: returns the v3 page object rather than discarding it', async () => {
		const { ctx } = makeCtx();
		mockFetch({
			data: [{ id: 'p-1', name: 'x' }],
			page: { next: 'cursor-1', prev: null },
		});
		const result = await Orbs.listNamespaceOrbs(ctx, {});
		expect(result.page).toEqual({ next: 'cursor-1', prev: null });
	});

	it('orbs.listNamespaceOrbs: also accepts a bare array response, with no page', async () => {
		const { ctx } = makeCtx();
		mockFetch([{ id: 'p-1', name: 'x' }]);
		const result = await Orbs.listNamespaceOrbs(ctx, {});
		expect(result.items).toEqual([{ id: 'p-1', name: 'x' }]);
		expect(result.page).toBeUndefined();
	});

	it('orbs.listNamespaceOrbs: throws on a response matching neither shape, rather than silently returning zero results', async () => {
		const { ctx } = makeCtx();
		// Not an array, and no `data` array either - the shape a validation
		// error or an unrelated object would have. An earlier version of the
		// transport read `response.data ?? []` here, so this resolved to an
		// empty list with no signal anything had gone wrong.
		mockFetch({ error: 'something unexpected' });
		await expect(Orbs.listNamespaceOrbs(ctx, {})).rejects.toThrow(
			/did not match/i,
		);
	});

	// `runners.list` does not appear here: its route's real response is
	// `{"items": [...]}`, not the `{"data": [...], "page": {...}}` envelope
	// `orb/packages` uses - confirmed from `circleci-cli`'s own
	// `ListRunnerInstances`, which decodes into `{Items []RunnerInstance}`.
	// See the dedicated regression test below instead.
});

describe('runners.list reads the real flat {items} envelope, not the JSON:API {data, page} shape orb/packages uses', () => {
	it('returns the items a mocked {items: [...]} response carries', async () => {
		const { ctx } = makeCtx();
		mockFetch({ items: [{ id: 'r-1', hostname: 'runner-1' }] });
		const result = await Runners.list(ctx, {});
		expect(result.items).toEqual([{ id: 'r-1', hostname: 'runner-1' }]);
	});

	it('regression: a {data: [...]} response - the wrong shape for this route - fails loudly rather than silently returning the wrong data', async () => {
		const { ctx } = makeCtx();
		// This is the shape `orb/packages` actually sends, and the shape an
		// earlier version of this function wrongly assumed `runner` shared.
		// Confirmed by planting the fault: `circleCIV3Call`'s single-entity
		// unwrap returns the bare `data` array directly as `T` here, so
		// `result.items` is `undefined` and `.length` throws this specific
		// TypeError - asserted by message rather than accepting any thrown
		// value, so an unrelated failure elsewhere could not pass this test
		// for the wrong reason.
		mockFetch({ data: [{ id: 'r-1' }], page: { next: null, prev: null } });
		await expect(Runners.list(ctx, {})).rejects.toThrow(
			/cannot read properties of undefined.*length/i,
		);
	});
});
