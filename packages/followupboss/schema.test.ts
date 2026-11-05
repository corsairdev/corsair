import {
	FollowUpBossEndpointInputSchemas,
	FollowUpBossEndpointOutputSchemas,
	PersonSchema,
} from './endpoints/types';
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
	peopleCreate: {},
	peopleUpdate: { id: 123 },
	peopleDelete: { id: 123 },
	peopleCheckDuplicate: { email: 'a@b.example' },
	peopleUnclaimed: {},
	peopleClaim: { personId: 1 },
	peopleIgnoreUnclaimed: { personId: 1 },
	personAttachmentCreate: {
		personId: 1,
		uri: 'https://files.example.com/x.pdf',
		fileName: 'x.pdf',
	},
	personAttachmentGet: { id: 123 },
	personAttachmentUpdate: {
		id: 123,
		personId: 1,
		uri: 'https://files.example.com/x.pdf',
		fileName: 'x.pdf',
	},
	personAttachmentDelete: { id: 123 },
	peopleRelationshipsList: {},
	peopleRelationshipsCreate: { personId: 1 },
	peopleRelationshipsGet: { id: 123 },
	peopleRelationshipsUpdate: { id: 123 },
	peopleRelationshipsDelete: { id: 123 },
	callsList: {},
	callsCreate: { personId: 1, phone: '888-555-0123', isIncoming: true },
	callsGet: { id: 123 },
	callsUpdate: { id: 123 },
	textMessagesList: {},
	textMessagesCreate: {
		personId: 1,
		message: 'hello',
		toNumber: '888-555-0123',
		fromNumber: '888-555-0124',
	},
	textMessagesGet: { id: 123 },
	notesCreate: { personId: 1 },
	notesGet: { id: 123 },
	notesUpdate: { id: 123 },
	notesDelete: { id: 123 },
	eventsList: {},
	eventsGet: { id: 123 },
	eventsCreate: {},
	tasksList: {},
	tasksCreate: { personId: 1 },
	tasksGet: { id: 123 },
	tasksUpdate: { id: 123 },
	tasksDelete: { id: 123 },
	appointmentsList: {},
	appointmentsCreate: {
		title: 'Intro call',
		start: '2026-05-21T17:00:00+00:00',
		end: '2026-05-21T17:30:00+00:00',
	},
	appointmentsGet: { id: 123 },
	appointmentsUpdate: { id: 123 },
	appointmentsDelete: { id: 123 },
	appointmentTypesList: {},
	appointmentTypesCreate: {},
	appointmentTypesGet: { id: 123 },
	appointmentTypesUpdate: { id: 123 },
	appointmentTypesDelete: { id: 1, assignTypeId: 2 },
	timeframesList: {},
	smartListsList: {},
	smartListsGet: { id: 123 },
	meGet: {},
	identityGet: {},
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
		for (const [name, candidate] of Object.entries(inputCandidates)) {
			// The candidates map is exhaustively keyed by the schema names,
			// so every entry here finds a schema of the same name.
			const parsed =
				FollowUpBossEndpointInputSchemas[
					name as keyof typeof FollowUpBossEndpointInputSchemas
				].safeParse(candidate);
			expect(parsed.success).toBe(true);
			if (parsed.success) {
				expect(parsed.data).toBeDefined();
			}
		}
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
