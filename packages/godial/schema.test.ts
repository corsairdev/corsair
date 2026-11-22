import {
	GoDialEndpointInputSchemas,
	GoDialEndpointOutputSchemas,
} from './endpoints/types';

describe('GoDial endpoint schemas', () => {
	it('requires a list id and accepts only documented contact fields', () => {
		expect(GoDialEndpointInputSchemas.listsList.safeParse({}).success).toBe(
			true,
		);
		expect(
			GoDialEndpointInputSchemas.contactsAdd.safeParse({
				listId: 'list-1',
				name: 'Ada Lovelace',
				email: 'ada@example.test',
				phone: '+15555550123',
				secondPhone: '+15555550124',
				companyName: 'Example Company',
				note: 'Call back',
				remarks: 'Qualified',
				extra: 'source=website',
				assignmentMode: 'default',
				customFields: [{ name: 'City', value: 'Mumbai' }],
				accountsId: 'agent-1',
				source: 'Website',
				address: '1 Example Street',
				source_marketing: { source: 'google', medium: 'cpc' },
			}).success,
		).toBe(true);
		// GoDial's reference and the live route both require phone.
		expect(
			GoDialEndpointInputSchemas.contactsAdd.safeParse({ listId: 'list-1' })
				.success,
		).toBe(false);
		expect(
			GoDialEndpointInputSchemas.contactsAdd.safeParse({
				listId: 'list-1',
				phone: '+15555550123',
				assignmentMode: 'random',
			}).success,
		).toBe(false);
		expect(
			GoDialEndpointInputSchemas.contactsAdd.safeParse({ name: 'Ada' }).success,
		).toBe(false);
		expect(
			GoDialEndpointInputSchemas.contactsAdd.safeParse({
				listId: 'list-1',
				webhookUrl: 'https://example.test',
			}).success,
		).toBe(false);
	});

	it('parses the live list response and drops the IndiaMart key', () => {
		// Trimmed from a live GET lists/list (ids shortened).
		const lists = GoDialEndpointOutputSchemas.listsList.parse([
			{
				name: 'Default',
				system: false,
				callScript: '',
				twillioAudioUrl: '',
				indiamart: {
					enabled: true,
					GLUSR_MOBILE: '9999999999',
					GLUSR_MOBILE_KEY: 'indiamart-secret',
				},
				id: 'list-1',
				companyId: 'company-1',
				teamsId: 'team-1',
			},
		]);
		expect(lists[0]?.id).toBe('list-1');
		expect(lists[0]?.twillioAudioUrl).toBe('');
		expect(lists[0]?.indiamart).toEqual({ enabled: true });
		expect(JSON.stringify(lists)).not.toContain('indiamart-secret');
	});

	it('parses the live contact response, nulls included', () => {
		// Trimmed from a live POST contact/add with a reserved 555 test number.
		const contact = GoDialEndpointOutputSchemas.contactsAdd.parse({
			id: 'contact-1',
			name: 'corsair-plugin-test',
			phone: '+12025550143',
			called: false,
			createdOn: '2026-11-15T10:00:00.000Z',
			dnc: false,
			leadScore: 0,
			stageId: 'stage-1',
			internalCompanyId: null,
			productIds: [],
			source_marketing: { source: 'corsair' },
			ip: null,
			creationSource: 'api',
			companyId: 'company-1',
			listId: 'list-1',
			source: 'corsair-plugin-test',
			customFields: {},
		});
		expect(contact.id).toBe('contact-1');
		expect(contact.internalCompanyId).toBeNull();
		expect(() =>
			GoDialEndpointOutputSchemas.contactsAdd.parse({ name: 'no id' }),
		).toThrow();
	});
});
