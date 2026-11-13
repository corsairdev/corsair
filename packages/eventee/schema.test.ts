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
