/**
 * Exercises every endpoint wrapper with mocked network: the URL path each
 * one hits and the event name it logs. Runs in CI (no real API key).
 */
import { logEventFromContext } from 'corsair/core';
import {
	AgentsEndpoints,
	BranchesEndpoints,
	ContainersEndpoints,
	IdentitiesEndpoints,
	LeadsEndpoints,
	ListsEndpoints,
	MiscEndpoints,
	OrgsEndpoints,
	ScriptsEndpoints,
	StorageEndpoints,
	UsersEndpoints,
} from './endpoints';
import { phantombusterEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = jest.mocked(logEventFromContext);

type Ctx = Parameters<typeof AgentsEndpoints.fetchAll>[0];

function makeCtx(): Ctx {
	// why safe: endpoints only read ctx.key; the rest is framework plumbing.
	return { key: 'test-key' } as unknown as Ctx;
}

const LEAD = { linkedinProfileUrl: 'https://linkedin.com/in/test-user' };

let lastUrl = '';

beforeEach(() => {
	mockLogEvent.mockClear();
	lastUrl = '';
	const stub = async (url: unknown) => {
		lastUrl = String(url);
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => ({}),
			text: async () => '{}',
		};
	};
	// why safe: partial Response stub — only ok/status/headers/json/text are read.
	global.fetch = stub as unknown as typeof global.fetch;
});

type Operation = {
	name: string;
	path: string;
	event: string;
	call: (ctx: Ctx) => Promise<unknown>;
};

const OPERATIONS: Operation[] = [
	{
		name: 'agents.fetchAll',
		path: '/agents/fetch-all',
		event: 'phantombuster.agents.fetchAll',
		call: (c) => AgentsEndpoints.fetchAll(c, {}),
	},
	{
		name: 'agents.fetch',
		path: '/agents/fetch',
		event: 'phantombuster.agents.fetch',
		call: (c) => AgentsEndpoints.fetch(c, { id: 'ag1' }),
	},
	{
		name: 'agents.save',
		path: '/agents/save',
		event: 'phantombuster.agents.save',
		call: (c) => AgentsEndpoints.save(c, { name: 'P' }),
	},
	{
		name: 'agents.delete',
		path: '/agents/delete',
		event: 'phantombuster.agents.delete',
		call: (c) => AgentsEndpoints.remove(c, { id: 'ag1' }),
	},
	{
		name: 'agents.launch',
		path: '/agents/launch',
		event: 'phantombuster.agents.launch',
		call: (c) => AgentsEndpoints.launch(c, { id: 'ag1' }),
	},
	{
		name: 'agents.launchSoon',
		path: '/agents/launch-soon',
		event: 'phantombuster.agents.launchSoon',
		call: (c) => AgentsEndpoints.launchSoon(c, { id: 'ag1', minutes: 5 }),
	},
	{
		name: 'agents.unscheduleAll',
		path: '/agents/unschedule-all',
		event: 'phantombuster.agents.unscheduleAll',
		call: (c) => AgentsEndpoints.unscheduleAll(c, {}),
	},
	{
		name: 'agents.fetchDeleted',
		path: '/agents/fetch-deleted',
		event: 'phantombuster.agents.fetchDeleted',
		call: (c) => AgentsEndpoints.fetchDeleted(c, {}),
	},
	{
		name: 'agents.stop',
		path: '/agents/stop',
		event: 'phantombuster.agents.stop',
		call: (c) => AgentsEndpoints.stop(c, { id: 'ag1' }),
	},
	{
		name: 'agents.fetchOutput',
		path: '/agents/fetch-output',
		event: 'phantombuster.agents.fetchOutput',
		call: (c) => AgentsEndpoints.fetchOutput(c, { id: 'ag1' }),
	},
	{
		name: 'containers.fetchAll',
		path: '/containers/fetch-all',
		event: 'phantombuster.containers.fetchAll',
		call: (c) => ContainersEndpoints.fetchAll(c, { agentId: 'ag1' }),
	},
	{
		name: 'containers.fetch',
		path: '/containers/fetch',
		event: 'phantombuster.containers.fetch',
		call: (c) => ContainersEndpoints.fetch(c, { id: 'c1' }),
	},
	{
		name: 'containers.fetchOutput',
		path: '/containers/fetch-output',
		event: 'phantombuster.containers.fetchOutput',
		call: (c) => ContainersEndpoints.fetchOutput(c, { id: 'c1' }),
	},
	{
		name: 'containers.fetchResultObject',
		path: '/containers/fetch-result-object',
		event: 'phantombuster.containers.fetchResultObject',
		call: (c) => ContainersEndpoints.fetchResultObject(c, { id: 'c1' }),
	},
	{
		name: 'users.fetchMe',
		path: '/users/fetch-me',
		event: 'phantombuster.users.fetchMe',
		call: (c) => UsersEndpoints.fetchMe(c, {}),
	},
	{
		name: 'users.updateMe',
		path: '/users/update-me',
		event: 'phantombuster.users.updateMe',
		call: (c) => UsersEndpoints.updateMe(c, { firstName: 'A' }),
	},
	{
		name: 'orgs.fetch',
		path: '/orgs/fetch',
		event: 'phantombuster.orgs.fetch',
		call: (c) => OrgsEndpoints.fetch(c, {}),
	},
	{
		name: 'orgs.fetchResources',
		path: '/orgs/fetch-resources',
		event: 'phantombuster.orgs.fetchResources',
		call: (c) => OrgsEndpoints.fetchResources(c, {}),
	},
	{
		name: 'orgs.exportAgentUsage',
		path: '/orgs/export-agent-usage',
		event: 'phantombuster.orgs.exportAgentUsage',
		call: (c) => OrgsEndpoints.exportAgentUsage(c, { days: '7' }),
	},
	{
		name: 'orgs.exportContainerUsage',
		path: '/orgs/export-container-usage',
		event: 'phantombuster.orgs.exportContainerUsage',
		call: (c) => OrgsEndpoints.exportContainerUsage(c, { days: '7' }),
	},
	{
		name: 'orgs.fetchAgentGroups',
		path: '/orgs/fetch-agent-groups',
		event: 'phantombuster.orgs.fetchAgentGroups',
		call: (c) => OrgsEndpoints.fetchAgentGroups(c, {}),
	},
	{
		name: 'orgs.saveAgentGroups',
		path: '/orgs/save-agent-groups',
		event: 'phantombuster.orgs.saveAgentGroups',
		call: (c) => OrgsEndpoints.saveAgentGroups(c, { agentGroups: ['g1'] }),
	},
	{
		name: 'orgs.fetchRunningContainers',
		path: '/orgs/fetch-running-containers',
		event: 'phantombuster.orgs.fetchRunningContainers',
		call: (c) => OrgsEndpoints.fetchRunningContainers(c, {}),
	},
	{
		name: 'leads.save',
		path: '/org-storage/leads/save',
		event: 'phantombuster.leads.save',
		call: (c) => LeadsEndpoints.save(c, { lead: LEAD }),
	},
	{
		name: 'leads.saveMany',
		path: '/org-storage/leads/save-many',
		event: 'phantombuster.leads.saveMany',
		call: (c) => LeadsEndpoints.saveMany(c, { leads: [LEAD] }),
	},
	{
		name: 'leads.fetchByList',
		path: '/org-storage/leads/by-list/list1',
		event: 'phantombuster.leads.fetchByList',
		call: (c) => LeadsEndpoints.fetchByList(c, { listId: 'list1' }),
	},
	{
		name: 'leads.deleteMany',
		path: '/org-storage/leads/delete-many',
		event: 'phantombuster.leads.deleteMany',
		call: (c) => LeadsEndpoints.deleteMany(c, { ids: ['l1'] }),
	},
	{
		name: 'lists.fetchAll',
		path: '/org-storage/lists/fetch-all',
		event: 'phantombuster.lists.fetchAll',
		call: (c) => ListsEndpoints.fetchAll(c, {}),
	},
	{
		name: 'lists.fetch',
		path: '/org-storage/lists/fetch',
		event: 'phantombuster.lists.fetch',
		call: (c) => ListsEndpoints.fetch(c, { id: 'list1' }),
	},
	{
		name: 'lists.save',
		path: '/org-storage/lists/save',
		event: 'phantombuster.lists.save',
		call: (c) => ListsEndpoints.save(c, { name: 'My List' }),
	},
	{
		name: 'lists.delete',
		path: '/org-storage/lists/delete',
		event: 'phantombuster.lists.delete',
		call: (c) => ListsEndpoints.remove(c, { id: 'list1' }),
	},
	{
		name: 'branches.fetchAll',
		path: '/branches/fetch-all',
		event: 'phantombuster.branches.fetchAll',
		call: (c) => BranchesEndpoints.fetchAll(c, {}),
	},
	{
		name: 'branches.fetchDiff',
		path: '/branches/diff',
		event: 'phantombuster.branches.fetchDiff',
		call: (c) => BranchesEndpoints.fetchDiff(c, { name: 'master' }),
	},
	{
		name: 'branches.create',
		path: '/branches/create',
		event: 'phantombuster.branches.create',
		call: (c) => BranchesEndpoints.create(c, { name: 'staging' }),
	},
	{
		name: 'branches.delete',
		path: '/branches/delete',
		event: 'phantombuster.branches.delete',
		call: (c) => BranchesEndpoints.remove(c, { id: 'b1' }),
	},
	{
		name: 'branches.release',
		path: '/branches/release',
		event: 'phantombuster.branches.release',
		call: (c) => BranchesEndpoints.release(c, { name: 'm', scriptIds: ['s1'] }),
	},
	{
		name: 'scripts.fetch',
		path: '/scripts/fetch',
		event: 'phantombuster.scripts.fetch',
		call: (c) => ScriptsEndpoints.fetch(c, { id: 's1' }),
	},
	{
		name: 'scripts.fetchAll',
		path: '/scripts/fetch-all',
		event: 'phantombuster.scripts.fetchAll',
		call: (c) => ScriptsEndpoints.fetchAll(c, {}),
	},
	{
		name: 'scripts.fetchCode',
		path: '/scripts/code',
		event: 'phantombuster.scripts.fetchCode',
		call: (c) => ScriptsEndpoints.fetchCode(c, { script: 'P.js' }),
	},
	{
		name: 'scripts.updateVisibility',
		path: '/scripts/visibility',
		event: 'phantombuster.scripts.updateVisibility',
		call: (c) =>
			ScriptsEndpoints.updateVisibility(c, {
				name: 'P.js',
				branch: 'master',
				visibility: 'private',
			}),
	},
	{
		name: 'scripts.updateAccessList',
		path: '/scripts/access-list',
		event: 'phantombuster.scripts.updateAccessList',
		call: (c) =>
			ScriptsEndpoints.updateAccessList(c, { name: 'P.js', branch: 'master' }),
	},
	{
		name: 'scripts.save',
		path: '/scripts/save',
		event: 'phantombuster.scripts.save',
		call: (c) => ScriptsEndpoints.save(c, { name: 'P.js' }),
	},
	{
		name: 'scripts.delete',
		path: '/scripts/delete',
		event: 'phantombuster.scripts.delete',
		call: (c) => ScriptsEndpoints.remove(c, { id: 's1' }),
	},
	{
		name: 'storage.saveLeadObject',
		path: '/org-storage/leads-objects/save',
		event: 'phantombuster.storage.saveLeadObject',
		call: (c) =>
			StorageEndpoints.saveLeadObject(c, {
				type: 't',
				slug: 's',
				properties: {},
				agentId: 'ag1',
			}),
	},
	{
		name: 'storage.saveManyLeadObjects',
		path: '/org-storage/leads-objects/save-many',
		event: 'phantombuster.storage.saveManyLeadObjects',
		call: (c) =>
			StorageEndpoints.saveManyLeadObjects(c, {
				objects: [{ type: 't', slug: 's', properties: {}, agentId: 'ag1' }],
			}),
	},
	{
		name: 'storage.deleteLeadObjects',
		path: '/org-storage/leads-objects/delete',
		event: 'phantombuster.storage.deleteLeadObjects',
		call: (c) => StorageEndpoints.deleteLeadObjects(c, {}),
	},
	{
		name: 'storage.searchLeadObjects',
		path: '/org-storage/leads-objects/search',
		event: 'phantombuster.storage.searchLeadObjects',
		call: (c) => StorageEndpoints.searchLeadObjects(c, {}),
	},
	{
		name: 'storage.saveCompanyObject',
		path: '/org-storage/companies-objects/save',
		event: 'phantombuster.storage.saveCompanyObject',
		call: (c) =>
			StorageEndpoints.saveCompanyObject(c, {
				linkedinCompanyId: 'c1',
				type: 't',
				slug: 's',
				properties: {},
			}),
	},
	{
		name: 'storage.saveManyCompanyObjects',
		path: '/org-storage/companies-objects/save-many',
		event: 'phantombuster.storage.saveManyCompanyObjects',
		call: (c) =>
			StorageEndpoints.saveManyCompanyObjects(c, {
				objects: [
					{ linkedinCompanyId: 'c1', type: 't', slug: 's', properties: {} },
				],
			}),
	},
	{
		name: 'storage.searchCompanyObjects',
		path: '/org-storage/companies-objects/search',
		event: 'phantombuster.storage.searchCompanyObjects',
		call: (c) => StorageEndpoints.searchCompanyObjects(c, {}),
	},
	{
		name: 'identities.generateToken',
		path: '/identities/generate-token',
		event: 'phantombuster.identities.generateToken',
		call: (c) => IdentitiesEndpoints.generateToken(c, {}),
	},
	{
		name: 'identities.saveEvent',
		path: '/identities/events/save',
		event: 'phantombuster.identities.saveEvent',
		call: (c) =>
			IdentitiesEndpoints.saveEvent(c, {
				identity_type: 'linkedin',
				profile_id: 'p1',
				event_type: 'view',
				event_data: {},
			}),
	},
	{
		name: 'misc.fetchIpLocation',
		path: '/location/ip',
		event: 'phantombuster.misc.fetchIpLocation',
		call: (c) => MiscEndpoints.fetchIpLocation(c, { ip: '8.8.8.8' }),
	},
	{
		name: 'misc.solveHCaptcha',
		path: '/hcaptcha',
		event: 'phantombuster.misc.solveHCaptcha',
		call: (c) =>
			MiscEndpoints.solveHCaptcha(c, { url: 'https://x.com', key: 'k' }),
	},
	{
		name: 'misc.solveRecaptcha',
		path: '/recaptcha',
		event: 'phantombuster.misc.solveRecaptcha',
		call: (c) =>
			MiscEndpoints.solveRecaptcha(c, {
				url: 'https://x.com',
				key: 'k',
				type: 'v3',
			}),
	},
	{
		name: 'misc.requestAiCompletion',
		path: '/ai/completions',
		event: 'phantombuster.misc.requestAiCompletion',
		call: (c) =>
			MiscEndpoints.requestAiCompletion(c, {
				messages: [{ role: 'user', content: 'hi' }],
			}),
	},
];

describe('phantombuster endpoints', () => {
	it('covers every registered endpoint path', () => {
		const schemaKeys = Object.keys(phantombusterEndpointSchemas);
		const operationNames = OPERATIONS.map((operation) => operation.name);
		for (const key of schemaKeys) {
			expect(operationNames).toContain(key);
		}
		expect(operationNames).toHaveLength(schemaKeys.length);
	});

	for (const operation of OPERATIONS) {
		it(`${operation.name} hits ${operation.path} and logs ${operation.event}`, async () => {
			const ctx = makeCtx();
			await operation.call(ctx);
			expect(lastUrl).toContain(operation.path);
			expect(mockLogEvent).toHaveBeenCalledWith(
				ctx,
				operation.event,
				expect.anything(),
				'completed',
			);
		});
	}
});

describe('leads.fetchByList listId encoding', () => {
	it('encodes reserved characters so one list ID maps to one path segment', async () => {
		await LeadsEndpoints.fetchByList(makeCtx(), { listId: 'a/b?c#d' });
		expect(lastUrl).toContain('/org-storage/leads/by-list/a%2Fb%3Fc%23d');
	});

	it.each(['.', '..'])('rejects dot-segment listId %s', async (listId) => {
		await expect(
			LeadsEndpoints.fetchByList(makeCtx(), { listId }),
		).rejects.toThrow('Invalid listId path segment');
	});
});
