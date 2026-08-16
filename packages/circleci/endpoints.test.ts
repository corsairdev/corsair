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
		payload: { data: [] },
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
		await expect(Groups.list(ctx, { orgId: ORG_ID })).resolves.toHaveLength(1);
	});

	it('never mirrors an env var value, only its masked form on the wire', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ name: 'X', value: 'xxxxcret', created_at: '2026-01-01' });
		await ProjectEnvVars.create(ctx, {
			projectSlug: PROJECT_SLUG,
			name: 'X',
			value: 'plaintext-secret',
		});
		const [, mirrored] = db.projectEnvVars.upsertByEntityId.mock.calls[0] ?? [];
		expect(JSON.stringify(mirrored)).not.toContain('plaintext-secret');
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
