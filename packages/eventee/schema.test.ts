import {
	EventeeEndpointInputSchemas,
	EventeeEndpointOutputSchemas,
} from './endpoints/types';
import { EventeeSchema } from './schema';

const emptyProgram = {
	halls: [],
	days: [],
	lectures: [],
	workshops: [],
	pauses: [],
	speakers: [],
	tracks: [],
};
const record = { id: 1 };

const inputs: Array<[keyof typeof EventeeEndpointInputSchemas, object]> = [
	['contentGet', { date: '2024-06-01', with_overlapping: false }],
	['contentDeleteAll', {}],
	['hallCreate', { name: 'Main Stage' }],
	['hallUpdate', { hall_id: 1, name: 'Main Stage' }],
	['hallDelete', { hall_id: 1 }],
	[
		'sessionCreate',
		{
			name: 'Keynote',
			start: '2024-06-01 09:00:00',
			end: '2024-06-01 10:00:00',
			hall_id: 1,
		},
	],
	[
		'sessionUpdate',
		{
			lecture_id: 1,
			name: 'Keynote',
			start: '2024-06-01 09:00:00',
			end: '2024-06-01 10:00:00',
		},
	],
	['sessionDelete', { lecture_id: 1 }],
	[
		'breakCreate',
		{
			name: 'Coffee Break',
			start: '2024-06-01 10:00:00',
			end: '2024-06-01 10:30:00',
		},
	],
	[
		'breakUpdate',
		{
			pause_id: 1,
			name: 'Coffee Break',
			start: '2024-06-01 10:00:00',
			end: '2024-06-01 10:30:00',
		},
	],
	['breakDelete', { pause_id: 1 }],
	['speakerCreate', { name: 'Jane Doe' }],
	['speakerUpdate', { speakerTmp_id: 1, position: 'CTO' }],
	['speakerDelete', { speakerTmp_id: 1 }],
	['labelCreate', { name: 'Technology', color: '#3B82F6' }],
	['labelUpdate', { track_id: 1, name: 'Technology', color: '#3B82F6' }],
	['labelDelete', { track_id: 1 }],
	[
		'partnerCreate',
		{ company: 'Acme', logo_url: 'https://acme.example.com/logo.png' },
	],
	['partnerUpdate', { partner_id: 1, company: 'Acme' }],
	['partnerDelete', { partner_id: 1 }],
	['partnerUpdateSections', { partner_id: 1, sections: [{ type: 0 }] }],
	['partnerList', {}],
	['attendeeInvite', { users: [{ email: 'jane.doe@example.com' }] }],
	['attendeeCheckIn', { attendee_id: 1, checkin: true }],
	['attendeeList', {}],
	['attendeeRemove', { email: 'jane.doe@example.com' }],
	[
		'registrationCreate',
		{ registrations: [{ email: 'jane.doe@example.com' }] },
	],
	['registrationList', {}],
	['registrationRemove', { email: 'jane.doe@example.com' }],
	['groupList', {}],
	['reviewList', {}],
];

const outputs: Array<
	[keyof typeof EventeeEndpointOutputSchemas, object | undefined]
> = [
	['contentGet', emptyProgram],
	['contentDeleteAll', undefined],
	['hallCreate', record],
	['hallUpdate', record],
	['hallDelete', undefined],
	['sessionCreate', record],
	['sessionUpdate', record],
	['sessionDelete', undefined],
	['breakCreate', record],
	['breakUpdate', record],
	['breakDelete', undefined],
	['speakerCreate', record],
	['speakerUpdate', record],
	['speakerDelete', undefined],
	['labelCreate', record],
	['labelUpdate', record],
	['labelDelete', undefined],
	['partnerCreate', record],
	['partnerUpdate', record],
	['partnerDelete', undefined],
	['partnerUpdateSections', record],
	['partnerList', []],
	[
		'attendeeInvite',
		{
			url: 'https://app.eventee.co/event/example',
			qr_code: 'https://files.eventee.co/qr/example.png',
		},
	],
	['attendeeCheckIn', record],
	['attendeeList', []],
	['attendeeRemove', undefined],
	[
		'registrationCreate',
		{
			url: 'https://app.eventee.co/event/example',
			qr_code: 'https://files.eventee.co/qr/example.png',
		},
	],
	['registrationList', []],
	['registrationRemove', undefined],
	['groupList', []],
	['reviewList', []],
];

// Trimmed responses from a live run against a trial event (2026-11-13). Codes and links are placeholders.
const liveSpeaker = {
	id: 223945,
	name: 'corsair-plugin-test',
	email: '',
	phone: '',
	bio_html: '',
	web: '',
	position: 'Tester',
	company: 'Corsair Plugin Test',
	country: '',
	language: '',
	event_id: 32122,
	order: 0,
	photo: null,
	thumbnail: null,
	bio: '',
};
const liveSession = {
	id: 306021,
	name: 'corsair-plugin-test 2',
	description: '',
	start: '2026-12-13 10:30:00',
	end: '2026-12-13 11:30:00',
	event_day_id: 54971,
	discussion: false,
	panel_discussion: 0,
	moderating: false,
	polling: false,
	checkin: false,
	type: 0,
	mentoring: false,
	hall_id: 68028,
	speakers: [],
	files: [],
	available: 0,
	booked: false,
	capacity: 0,
	booking_info: [],
	stream: null,
	virtual_meeting: null,
	tracks: [],
	event_id: 32122,
	overlapping: false,
	visible_in_groups: [],
	mandatory_for_groups: [],
	mandatory: false,
};
const livePartner = {
	id: 57930,
	company: 'corsair-plugin-test 2',
	description: '',
	web: '',
	email: '',
	phone: '',
	address: '',
	code: 'partner-code',
	sections: [],
	exhibitor: false,
	sponsor: false,
	exhibitor_info: null,
	sponsor_info: null,
	logo: null,
	photo: null,
	qr_code_url: 'https://eventee.com/event/example/partner/partner-code',
};
const liveRegistration = {
	id: 33211,
	email: 'person@example.com',
	email_valid: null,
	status: null,
	first_name: 'corsair-plugin-test',
	last_name: '',
	photo: null,
	answer_histories: [],
	group_id: null,
	form_id: null,
	form_answers: [],
	account_deleted: false,
};

describe('Eventee schema and OpenAPI endpoint schemas', () => {
	it('uses a semver schema version and no local entities', () => {
		expect(EventeeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(EventeeSchema.entities).toEqual({});
	});

	it('validates input and output shapes for all 31 operations', () => {
		expect(inputs).toHaveLength(31);
		expect(outputs).toHaveLength(31);
		for (const [key, input] of inputs) {
			expect(EventeeEndpointInputSchemas[key].safeParse(input).success).toBe(
				true,
			);
		}
		for (const [key, output] of outputs) {
			expect(EventeeEndpointOutputSchemas[key].safeParse(output).success).toBe(
				true,
			);
		}
	});

	it('rejects invalid enum, date, partner media and strict request fields', () => {
		expect(
			EventeeEndpointInputSchemas.sessionCreate.safeParse({
				name: 'Session',
				start: 'tomorrow',
				end: '2024-06-01 10:00:00',
				hall_id: 1,
				type: 2,
			}).success,
		).toBe(false);
		expect(
			EventeeEndpointInputSchemas.partnerCreate.safeParse({ company: 'Acme' })
				.success,
		).toBe(false);
		expect(
			EventeeEndpointInputSchemas.hallCreate.safeParse({
				name: 'Main',
				callback_url: 'https://example.com',
			}).success,
		).toBe(false);
		expect(
			EventeeEndpointInputSchemas.attendeeInvite.safeParse({
				users: [
					{
						email: 'person@example.com',
						tickets: [{ number: '1', type: 'rfid' }],
					},
				],
			}).success,
		).toBe(false);
		expect(
			EventeeEndpointInputSchemas.partnerUpdateSections.safeParse({
				partner_id: 1,
				sections: [{ type: 6 }],
			}).success,
		).toBe(false);
	});

	it('parses the null and numeric fields Eventee returns live', () => {
		const outputs = EventeeEndpointOutputSchemas;
		expect(outputs.speakerCreate.safeParse(liveSpeaker).success).toBe(true);
		expect(outputs.speakerUpdate.safeParse(liveSpeaker).success).toBe(true);
		expect(outputs.sessionUpdate.safeParse(liveSession).success).toBe(true);
		expect(
			outputs.contentGet.safeParse({
				...emptyProgram,
				lectures: [liveSession],
				speakers: [liveSpeaker],
			}).success,
		).toBe(true);
		expect(outputs.partnerUpdate.safeParse(livePartner).success).toBe(true);
		expect(outputs.partnerList.safeParse([livePartner]).success).toBe(true);
		expect(outputs.registrationList.safeParse([liveRegistration]).success).toBe(
			true,
		);
	});

	it('rejects malformed outputs for every operation', () => {
		for (const [key] of outputs) {
			expect(EventeeEndpointOutputSchemas[key].safeParse(null).success).toBe(
				false,
			);
		}
		expect(
			EventeeEndpointOutputSchemas.contentGet.safeParse({ halls: [] }).success,
		).toBe(false);
		expect(
			EventeeEndpointOutputSchemas.attendeeInvite.safeParse({
				url: 'https://example.com',
			}).success,
		).toBe(false);
	});
});
