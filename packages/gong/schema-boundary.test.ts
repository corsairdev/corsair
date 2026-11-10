import type { GongOpaqueRecord } from './client';
import { gongEndpointSchemas } from './index';

const callBody = {
	clientUniqueId: 'external-call-1',
	actualStart: '2025-01-01T00:00:00Z',
	parties: [],
	direction: 'Outbound',
	primaryUser: '123',
};
const dateFilter = { filter: { fromDate: '2025-01-01', toDate: '2025-01-02' } };
const records = {};
const emptyOk = new Set([
	'users.list',
	'crm.listIntegrations',
	'outcomes.list',
	'settings.scorecards',
	'settings.trackers',
	'settings.briefs',
	'library.folders',
	'workspaces.list',
]);

const inputFixtures: GongOpaqueRecord = {
	'calls.add': callBody,
	'calls.addRecording': { id: '123', mediaFile: new Blob(['audio']) },
	'calls.list': {
		fromDateTime: '2025-01-01T00:00:00Z',
		toDateTime: '2025-01-02T00:00:00Z',
	},
	'calls.get': { id: '123' },
	'calls.listExtensive': { filter: {} },
	'calls.getTranscripts': { filter: {} },
	'users.list': {},
	'users.listMultiple': { filter: {} },
	'users.get': { id: '123' },
	'users.getHistory': { id: '123' },
	'digitalInteractions.add': {
		eventId: 'e1',
		timestamp: '2025-01-01T00:00:00Z',
		eventType: 'page viewed',
		content: {},
	},
	'dataPrivacy.purgePhoneNumber': { phoneNumber: '+14255552671' },
	'dataPrivacy.purgeEmailAddress': { emailAddress: 'a@example.com' },
	'dataPrivacy.findPhoneReferences': { phoneNumber: '+14255552671' },
	'dataPrivacy.findEmailReferences': { emailAddress: 'a@example.com' },
	'accountsEnrich.start': {
		dataCategories: ['accountData'],
		accounts: [{ id: 'a1', accountSearchCriteria: {} }],
	},
	'accountsEnrich.getResults': { jobId: 'job-1' },
	'contactsEnrich.start': {
		dataCategories: ['contactData'],
		contacts: [{ id: 'c1', linkedinUrl: 'https://linkedin.com/in/example' }],
	},
	'contactsEnrich.getResults': { jobId: 'job-1' },
	'auditing.listLogs': {
		logType: 'AccessLog',
		fromDateTime: '2025-01-01T00:00:00Z',
	},
	'entities.generateBrief': {
		workspaceId: 1,
		briefName: 'brief',
		crmEntityType: 'ACCOUNT',
		crmEntityId: 'a1',
		timePeriod: 'LAST_30DAYS',
	},
	'entities.ask': {
		workspaceId: 1,
		crmEntityType: 'ACCOUNT',
		crmEntityId: 'a1',
		timePeriod: 'LAST_30DAYS',
		question: 'What changed?',
	},
	'coaching.list': {
		'workspace-id': '623457276584334',
		'manager-id': '234599484848423',
		from: '2025-01-01T00:00:00Z',
		to: '2025-02-01T00:00:00Z',
	},
	'outcomes.list': {},
	'permissions.getProfile': { profileId: '123' },
	'permissions.updateProfile': { profileId: '123', body: {} },
	'permissions.createProfile': { workspaceId: '123', body: {} },
	'permissions.addCallUsers': {
		callAccessList: [{ callId: '123', userIds: ['456'] }],
	},
	'permissions.getCallUsers': { filter: { callIds: ['123'] } },
	'permissions.deleteCallUsers': {
		callAccessList: [{ callId: '123', userIds: ['456'] }],
	},
	'permissions.listProfileUsers': { profileId: '123' },
	'permissions.listProfiles': { workspaceId: '123' },
	'crm.listIntegrations': {},
	'crm.registerIntegration': {
		name: 'Example',
		ownerEmail: 'owner@example.com',
	},
	'crm.deleteIntegration': { integrationId: 1, clientRequestId: 'req-1' },
	'crm.listSchemaFields': { integrationId: 1, objectType: 'ACCOUNT' },
	'crm.uploadSchemaFields': {
		integrationId: 1,
		objectType: 'ACCOUNT',
		fields: [],
	},
	'crm.getObjects': {
		integrationId: 1,
		objectType: 'ACCOUNT',
		objectsCrmIds: ['crm-1'],
	},
	'crm.uploadObjects': {
		integrationId: 1,
		objectType: 'ACCOUNT',
		clientRequestId: 'req-1',
		dataFile: new Blob(['{}']),
	},
	'crm.getRequestStatus': { integrationId: 1, clientRequestId: 'req-1' },
	'integrationSettings.update': { integrationTypeSettings: [] },
	'stats.interaction': dateFilter,
	'stats.answeredScorecards': { filter: {} },
	'stats.dayByDay': dateFilter,
	'stats.aggregate': dateFilter,
	'stats.aggregateByPeriod': { ...dateFilter, aggregationPeriod: 'WEEK' },
	'settings.trackers': {},
	'settings.scorecards': {},
	'settings.briefs': {},
	'engageFlows.steps': { flowIds: [] },
	'engageFlows.assignedProspects': { crmProspectsIds: ['crm-1'] },
	'engageFlows.unassign': { flowInstanceIds: ['instance-1'] },
	'engageFlows.unassignProspects': { crmProspectId: 'crm-1' },
	'engageFlows.bulkAssignment': {
		flowInstanceOwnerEmail: 'owner@example.com',
		flowId: 'flow-1',
		prospects: [],
	},
	'engageFlows.assign': {
		crmProspectsIds: ['crm-1'],
		flowId: 'flow-1',
		flowInstanceOwnerEmail: 'owner@example.com',
	},
	'engageFlows.list': { flowOwnerEmail: 'owner@example.com' },
	'engageFlows.search': {
		flowOwnerEmail: 'owner@example.com',
		query: 'renewal',
	},
	'engageFlows.getBulkAssignment': { id: 'job-1' },
	'engageFlows.folders': { flowFolderOwnerEmail: 'owner@example.com' },
	'tasks.list': {
		filter: {
			userId: '123',
			types: ['MANUAL'],
			taskAction: ['CALL'],
			status: ['OPEN'],
		},
	},
	'tasks.updateReminder': { taskId: '123', userId: '456' },
	'targets.listDefinitions': { workspaceId: 1 },
	'targets.uploadAssignments': {
		targetId: '123',
		workspaceId: 1,
		file: new Blob(['csv']),
	},
	'library.folders': {},
	'library.folderContent': { folderId: '123' },
	'workspaces.list': {},
};

const outputFixtures: GongOpaqueRecord = {
	'calls.add': { requestId: 'r', callId: '123' },
	'calls.addRecording': {
		requestId: 'r',
		callId: '123',
		url: 'https://media.example/file',
	},
	'calls.list': { requestId: 'r', records, calls: [] },
	'calls.get': { requestId: 'r', call: {} },
	'calls.listExtensive': { requestId: 'r', records, calls: [] },
	'calls.getTranscripts': { requestId: 'r', callTranscripts: [] },
	'users.list': { requestId: 'r', users: [] },
	'users.listMultiple': { requestId: 'r', users: [] },
	'users.get': { requestId: 'r', user: {} },
	'users.getHistory': { requestId: 'r', userSettingsHistory: [] },
	'digitalInteractions.add': { requestId: 'r' },
	'dataPrivacy.purgePhoneNumber': { requestId: 'r' },
	'dataPrivacy.purgeEmailAddress': { requestId: 'r' },
	'dataPrivacy.findPhoneReferences': { requestId: 'r' },
	'dataPrivacy.findEmailReferences': { requestId: 'r' },
	'accountsEnrich.start': { requestId: 'r', jobId: 'job-1' },
	'accountsEnrich.getResults': { requestId: 'r', accounts: [], summary: {} },
	'contactsEnrich.start': { requestId: 'r', jobId: 'job-1' },
	'contactsEnrich.getResults': { requestId: 'r', contacts: [], summary: {} },
	'auditing.listLogs': { requestId: 'r', records: {}, logEntries: [] },
	'entities.generateBrief': {
		requestId: 'r',
		numOfCallsSearched: 0,
		numOfEmailsSearched: 0,
		briefSections: [],
	},
	'entities.ask': {
		requestId: 'r',
		numOfCallsSearched: 0,
		numOfEmailsSearched: 0,
		answer: [{ answerItems: ['Answer'] }],
	},
	'coaching.list': { requestId: 'r' },
	'outcomes.list': { requestId: 'r', outcomes: [] },
	'permissions.getProfile': { requestId: 'r', profile: {} },
	'permissions.updateProfile': { requestId: 'r', profile: {} },
	'permissions.createProfile': { requestId: 'r', profile: {} },
	'permissions.addCallUsers': { requestId: 'r' },
	'permissions.getCallUsers': { requestId: 'r', callAccessList: [] },
	'permissions.deleteCallUsers': { requestId: 'r' },
	'permissions.listProfileUsers': { requestId: 'r', users: [] },
	'permissions.listProfiles': { requestId: 'r', profiles: [] },
	'crm.listIntegrations': { requestId: 'r', integrations: [] },
	'crm.registerIntegration': { requestId: 'r', integrationId: 1 },
	'crm.deleteIntegration': { requestId: 'r', clientRequestId: 'req-1' },
	'crm.listSchemaFields': { requestId: 'r', objectTypeToSelectedFields: {} },
	'crm.uploadSchemaFields': { requestId: 'r' },
	'crm.getObjects': { requestId: 'r', crmObjectsMap: {} },
	'crm.uploadObjects': { requestId: 'r', clientRequestId: 'req-1' },
	'crm.getRequestStatus': { requestId: 'r', status: 'DONE' },
	'integrationSettings.update': { requestId: 'r', integrationId: 1 },
	'stats.interaction': {
		requestId: 'r',
		records,
		peopleInteractionStats: [],
		fromDateTime: '2025-01-01',
		toDateTime: '2025-01-02',
		timeZone: 'UTC',
	},
	'stats.answeredScorecards': {
		requestId: 'r',
		records,
		answeredScorecards: [],
	},
	'stats.dayByDay': { requestId: 'r', records, usersDetailedActivities: [] },
	'stats.aggregate': {
		requestId: 'r',
		records,
		usersAggregateActivityStats: [],
		fromDateTime: '2025-01-01',
		toDateTime: '2025-01-02',
		timeZone: 'UTC',
	},
	'stats.aggregateByPeriod': {
		requestId: 'r',
		records,
		usersAggregateActivity: [],
	},
	'settings.trackers': { requestId: 'r', keywordTrackers: [] },
	'settings.scorecards': { requestId: 'r', scorecards: [] },
	'settings.briefs': { requestId: 'r', briefs: [] },
	'engageFlows.steps': { requestId: 'r', flows: [] },
	'engageFlows.assignedProspects': { requestId: 'r', prospectsAssigned: [] },
	'engageFlows.unassign': { requestId: 'r', unassignedFlowInstanceIds: [] },
	'engageFlows.unassignProspects': {
		requestId: 'r',
		unassignedFlowInstanceIds: [],
	},
	'engageFlows.bulkAssignment': {
		requestId: 'r',
		id: 'job-1',
		status: 'PENDING',
		totalCount: 0,
		processedCount: 0,
		successCount: 0,
		failedCount: 0,
	},
	'engageFlows.assign': { requestId: 'r' },
	'engageFlows.list': { requestId: 'r', records, flows: [] },
	'engageFlows.search': { requestId: 'r', flows: [] },
	'engageFlows.getBulkAssignment': {
		requestId: 'r',
		id: 'job-1',
		status: 'COMPLETED',
		totalCount: 0,
		processedCount: 0,
		successCount: 0,
		failedCount: 0,
	},
	'engageFlows.folders': { requestId: 'r', records, folders: [] },
	'tasks.list': { requestId: 'r', tasks: [] },
	'tasks.updateReminder': { requestId: 'r', tasks: [] },
	'targets.listDefinitions': { requestId: 'r', targets: [] },
	'targets.uploadAssignments': {
		requestId: 'r',
		validateOnly: false,
		processedRows: 0,
	},
	'library.folders': { requestId: 'r', folders: [] },
	'library.folderContent': {
		requestId: 'r',
		id: '123',
		name: 'Folder',
		createdBy: '456',
		updated: '2025-01-01T00:00:00Z',
		calls: [],
	},
	'workspaces.list': { requestId: 'r', workspaces: [] },
};

describe('Gong schema boundary for every registered operation', () => {
	it('accepts a fixed minimal input and spec-shaped output for all operations', () => {
		const paths = Object.keys(gongEndpointSchemas).sort();
		expect(Object.keys(inputFixtures).sort()).toEqual(paths);
		expect(Object.keys(outputFixtures).sort()).toEqual(paths);
		for (const [path, pair] of Object.entries(gongEndpointSchemas)) {
			expect(pair.input?.safeParse(inputFixtures[path]).success).toBe(true);
			expect(pair.output?.safeParse(outputFixtures[path]).success).toBe(true);
		}
	});

	it.each(Object.entries(gongEndpointSchemas))(
		'rejects missing required input fields for %s',
		(path, pair) => {
			const result = pair.input?.safeParse({});
			expect(result?.success).toBe(emptyOk.has(path));
		},
	);
});
