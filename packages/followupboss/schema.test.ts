import {
	FollowUpBossEndpointInputSchemas,
	FollowUpBossEndpointOutputSchemas,
} from './endpoints/registry';
import { PersonSchema } from './endpoints/types';
import { FollowUpBossSchema } from './schema';

describe('FollowUpBoss schema', () => {
	it('declares a semver version', () => {
		expect(FollowUpBossSchema.version).toBeDefined();
		expect(FollowUpBossSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FollowUpBossSchema.entities).toBe('object');
		expect(FollowUpBossSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FollowUpBossSchema.entities))).toBe(true);
		for (const entity of Object.values(FollowUpBossSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Keyed by the same names as FollowUpBossEndpointInputSchemas so that a
// renamed, added or removed operation fails to compile here until the map
// gains or drops the matching candidate.
const inputCandidates: Record<
	keyof typeof FollowUpBossEndpointInputSchemas,
	Record<string, unknown>
> = {
	peopleList: { limit: 10 },
	peopleGet: { id: 123 },
	peopleCreate: { firstName: 'Test', lastName: 'Person' },
	peopleUpdate: { id: 123, firstName: 'Test' },
	peopleDelete: { id: 123 },
	peopleCheckDuplicate: { email: 'test@example.com' },
	peopleUnclaimed: { limit: 10 },
	peopleClaim: { personId: 123 },
	peopleIgnoreUnclaimed: { personId: 123 },
	personAttachmentCreate: {
		personId: 123,
		uri: 'https://files.example.com/x.pdf',
		fileName: 'x.pdf',
	},
	personAttachmentGet: { id: 123 },
	personAttachmentUpdate: {
		id: 123,
		personId: 123,
		uri: 'https://files.example.com/y.pdf',
		fileName: 'y.pdf',
	},
	personAttachmentDelete: { id: 123 },
	peopleRelationshipsList: { limit: 10 },
	peopleRelationshipsCreate: { personId: 123 },
	peopleRelationshipsGet: { id: 123 },
	peopleRelationshipsUpdate: { id: 123 },
	peopleRelationshipsDelete: { id: 123 },
	callsList: { limit: 10 },
	callsCreate: { personId: 123, phone: '888-555-0123', isIncoming: false },
	callsGet: { id: 123 },
	callsUpdate: { id: 123 },
	textMessagesList: { personId: 123 },
	textMessagesCreate: {
		personId: 123,
		message: 'hello',
		toNumber: '888-555-0123',
		fromNumber: '888-555-0124',
	},
	textMessagesGet: { id: 123 },
	notesCreate: { personId: 123 },
	notesGet: { id: 123 },
	notesUpdate: { id: 123 },
	notesDelete: { id: 123 },
	eventsList: { limit: 10 },
	eventsGet: { id: 123 },
	eventsCreate: { person: { firstName: 'Test' } },
	tasksList: { personId: 123 },
	tasksCreate: { personId: 123 },
	tasksGet: { id: 123 },
	tasksUpdate: { id: 123 },
	tasksDelete: { id: 123 },
	appointmentsList: { limit: 10 },
	appointmentsCreate: {
		title: 'Intro call',
		start: '2026-05-21T17:00:00+00:00',
		end: '2026-05-21T17:30:00+00:00',
	},
	appointmentsGet: { id: 123 },
	appointmentsUpdate: {
		id: 123,
		title: 'Intro call',
		start: '2026-05-22T17:00:00+00:00',
		end: '2026-05-22T17:30:00+00:00',
	},
	appointmentsDelete: { id: 123 },
	appointmentTypesList: { limit: 10 },
	appointmentTypesCreate: { name: 'Consultation' },
	appointmentTypesGet: { id: 123 },
	appointmentTypesUpdate: { id: 123 },
	appointmentTypesDelete: { id: 123, assignTypeId: 124 },
	timeframesList: {},
	smartListsList: { limit: 10 },
	smartListsGet: { id: 123 },
	meGet: {},
	identityGet: {},
	dealsList: { id: 123 },
	dealsGet: { id: 123 },
	dealsCreate: { name: '812 Oak Street', stageId: 7 },
	dealsUpdate: { id: 123 },
	dealsDelete: { id: 123 },
	pipelinesList: { id: 123 },
	pipelinesGet: { id: 123 },
	pipelinesCreate: { name: 'Buyer pipeline' },
	pipelinesUpdate: { id: 123 },
	pipelinesDelete: { id: 123 },
	stagesList: { id: 123 },
	stagesGet: { id: 123 },
	stagesCreate: { name: 'Touring' },
	stagesUpdate: { id: 123 },
	stagesDelete: { id: 123, assignStageId: 124 },
	dealCustomFieldsList: { id: 123 },
	dealCustomFieldsGet: { id: 123 },
	dealCustomFieldsCreate: { label: 'Closing date', type: 'date' },
	dealCustomFieldsUpdate: { id: 123, label: 'Closing date', type: 'date' },
	dealCustomFieldsDelete: { id: 123 },
	dealAttachmentsCreate: {
		dealId: 123,
		uri: 'https://files.example.com/x.pdf',
		fileName: 'x.pdf',
	},
	dealAttachmentsGet: { id: 123 },
	dealAttachmentsUpdate: {
		id: 123,
		dealId: 123,
		uri: 'https://files.example.com/y.pdf',
		fileName: 'y.pdf',
	},
	dealAttachmentsDelete: { id: 123 },
	appointmentOutcomesList: { id: 123 },
	appointmentOutcomesGet: { id: 123 },
	appointmentOutcomesCreate: { id: 123 },
	appointmentOutcomesUpdate: { id: 123 },
	appointmentOutcomesDelete: { id: 123, assignOutcomeId: 124 },
	customFieldsList: { id: 123 },
	customFieldsGet: { id: 123 },
	customFieldsCreate: { label: 'Preferred contact', type: 'text' },
	customFieldsUpdate: { id: 123 },
	customFieldsDelete: { id: 123 },
	templatesList: { id: 123 },
	templatesGet: { id: 123 },
	templatesCreate: {
		name: 'Tour follow-up',
		subject: 'Great meeting you',
		body: 'Hi there',
	},
	templatesUpdate: {
		id: 123,
		name: 'Tour follow-up',
		subject: 'Great meeting you',
		body: 'Hi there',
	},
	templatesDelete: { id: 123 },
	templatesMerge: { templateId: 3 },
	textMessageTemplatesList: { id: 123 },
	textMessageTemplatesGet: { id: 123 },
	textMessageTemplatesCreate: {
		name: 'Tour reminder',
		message: 'See you tomorrow',
	},
	textMessageTemplatesUpdate: {
		id: 123,
		name: 'Tour reminder',
		message: 'See you tomorrow',
	},
	textMessageTemplatesDelete: { id: 123 },
	textMessageTemplatesMerge: { templateId: 5 },
	emCampaignsList: { id: 123 },
	emCampaignsCreate: { id: 123 },
	emCampaignsUpdate: { id: 123 },
	emEventsList: { id: 123 },
	emEventsCreate: { id: 123 },
	usersList: { id: 123 },
	usersGet: { id: 123 },
	usersDelete: { id: 14, assignTo: 1 },
	teamsList: { id: 123 },
	teamsCreate: { name: 'Downtown crew', userIds: [1, 4] },
	teamsGet: { id: 123 },
	teamsUpdate: { id: 123 },
	teamsDelete: { id: 123 },
	groupsList: { id: 123 },
	groupsCreate: { name: 'Intake group', users: [1, 4] },
	groupsGet: { id: 123 },
	groupsUpdate: { id: 123, name: 'Intake group', users: [1, 4] },
	groupsDelete: { id: 123 },
	groupsRoundRobin: { id: 123 },
	pondsList: { id: 123 },
	pondsCreate: { name: 'Buyer pond', userId: 1, userIds: [1] },
	pondsGet: { id: 123 },
	pondsUpdate: { id: 123 },
	pondsDelete: { id: 123, assignTo: 1 },
	rateLimitLimits: { id: 123 },
	rateLimitUsage: { id: 123 },
	automationsList: { id: 123 },
	automationsGet: { id: 123 },
	automationsPeopleList: { id: 123 },
	automationsPeopleGet: { id: 123 },
	automationsPeopleCreate: { id: 123 },
	automationsPeopleUpdate: { id: 123 },
	actionPlansList: { id: 123 },
	actionPlansPeopleList: { id: 123 },
	actionPlansPeopleCreate: { personId: 123, actionPlanId: 3 },
	actionPlansPeopleUpdate: { id: 123, status: 'Running' },
	webhooksList: { id: 123 },
	webhooksCreate: {
		event: 'peopleCreated',
		url: 'https://hooks.example.com/fub',
	},
	webhooksGet: { id: 123 },
	webhooksUpdate: { id: 123 },
	webhooksDelete: { id: 123 },
	webhookEventsGet: { id: 123 },
	inboxAppsDeactivate: { inboxAppId: 'app_1' },
	inboxAppsDeleteParticipant: {
		inboxAppId: 'app_1',
		extConversationId: 'conv_1',
		participantId: 'part_1',
	},
	inboxAppsGetParticipants: {
		inboxAppId: 'app_1',
		extConversationId: 'conv_1',
	},
	inboxAppsCreateParticipant: {
		inboxAppId: 'app_1',
		extConversationId: 'conv_1',
		body: { name: 'Sam Rivera' },
	},
	inboxAppsAddMessage: {
		inboxAppId: 'app_1',
		externalConversationId: 'conv_1',
		externalMessageId: 'msg_1',
		message: 'Offer accepted',
		isIncoming: false,
		sender: { name: 'Sam Rivera' },
	},
	inboxAppsAddNote: {
		inboxAppId: 'app_1',
		externalConversationId: 'conv_1',
		body: 'Client prefers evening calls',
		user: { name: 'Alex' },
	},
	inboxAppsAddSystemConfirmationMessage: {
		inboxAppId: 'app_1',
		externalConversationId: 'conv_1',
		externalMessageId: 'msg_2',
		type: 'success',
		message: 'Conversation synced',
	},
	inboxAppsInstall: {
		publishedInboxAppId: 1,
		userId: 1,
		subscriptionUrl: 'https://hooks.example.com/inbox',
	},
	inboxAppsUpdateConversation: {
		inboxAppId: 'app_1',
		extConversationId: 'conv_1',
		name: 'Offer negotiation',
	},
	inboxAppsUpdateMessage: {
		inboxAppId: 'app_1',
		id: 123,
		deliveryStatus: 'Read',
	},
	inboxAppsInstalledApp: { publishedInboxAppId: 'pub_1' },
	teamInboxesList: { id: 123 },
	reactionsCreate: { refType: 'Note', refId: '21' },
	reactionsGet: { id: 123 },
	reactionsDelete: { refType: 'Note', refId: '21' },
	threadedRepliesGet: { id: 123 },
};

// Operations whose input schema declares at least one required field.
const requiredFieldOperations: Array<
	keyof typeof FollowUpBossEndpointInputSchemas
> = [
	'appointmentsCreate',
	'appointmentsDelete',
	'appointmentsGet',
	'appointmentsUpdate',
	'appointmentTypesDelete',
	'appointmentTypesGet',
	'appointmentTypesUpdate',
	'callsCreate',
	'callsGet',
	'callsUpdate',
	'eventsGet',
	'notesCreate',
	'notesDelete',
	'notesGet',
	'notesUpdate',
	'peopleClaim',
	'peopleDelete',
	'peopleGet',
	'peopleIgnoreUnclaimed',
	'peopleRelationshipsCreate',
	'peopleRelationshipsDelete',
	'peopleRelationshipsGet',
	'peopleRelationshipsUpdate',
	'peopleUpdate',
	'personAttachmentCreate',
	'personAttachmentDelete',
	'personAttachmentGet',
	'personAttachmentUpdate',
	'smartListsGet',
	'tasksCreate',
	'tasksDelete',
	'tasksGet',
	'tasksUpdate',
	'textMessagesCreate',
	'textMessagesGet',
];

describe('FollowUpBoss endpoint input schemas', () => {
	it('gives every operation a minimal input candidate that parses', () => {
		const rejected: string[] = [];
		for (const [name, candidate] of Object.entries(inputCandidates)) {
			// The candidates map is exhaustively keyed by the schema names,
			// so every entry here finds a schema of the same name.
			const parsed =
				FollowUpBossEndpointInputSchemas[
					name as keyof typeof FollowUpBossEndpointInputSchemas
				].safeParse(candidate);
			if (!parsed.success) {
				rejected.push(name);
				continue;
			}
			expect(parsed.data).toBeDefined();
		}
		expect(rejected).toEqual([]);
	});

	it('rejects an empty input for every operation with required fields', () => {
		for (const name of requiredFieldOperations) {
			const parsed = FollowUpBossEndpointInputSchemas[name].safeParse({});
			expect(parsed.success).toBe(false);
		}
	});

	it('rejects out-of-range limits on the people list', () => {
		expect(
			FollowUpBossEndpointInputSchemas.peopleList.safeParse({ limit: 0 })
				.success,
		).toBe(false);
		expect(
			FollowUpBossEndpointInputSchemas.peopleList.safeParse({ limit: 101 })
				.success,
		).toBe(false);
	});

	it('requires an email or a phone to check duplicates', () => {
		expect(
			FollowUpBossEndpointInputSchemas.peopleCheckDuplicate.safeParse({})
				.success,
		).toBe(false);
	});
});

describe('FollowUpBoss endpoint output schemas', () => {
	it('parses a people list envelope', () => {
		const parsed = FollowUpBossEndpointOutputSchemas.peopleList.safeParse({
			_metadata: { total: 1 },
			people: [{ id: 1 }],
		});
		expect(parsed.success).toBe(true);
	});

	it('lets resources carry fields FUB added beyond the documented ones', () => {
		const parsed = FollowUpBossEndpointOutputSchemas.peopleList.safeParse({
			people: [{ id: 1, fieldFubAddedLater: 'x' }],
		});
		expect(parsed.success).toBe(true);
	});

	it('tolerates a person missing every optional field', () => {
		const parsed = PersonSchema.safeParse({});
		expect(parsed.success).toBe(true);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
