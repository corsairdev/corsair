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
			}).success,
		).toBe(true);
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

	it('validates provider outputs as JSON without assuming undocumented shapes', () => {
		expect(
			GoDialEndpointOutputSchemas.listsList.parse([{ id: 'list-1' }]),
		).toEqual([{ id: 'list-1' }]);
		expect(
			GoDialEndpointOutputSchemas.contactsAdd.parse({ success: true }),
		).toEqual({ success: true });
		expect(() =>
			GoDialEndpointOutputSchemas.contactsAdd.parse(undefined),
		).toThrow();
		expect(() =>
			GoDialEndpointOutputSchemas.listsList.parse(() => 'not JSON'),
		).toThrow();
		expect(() =>
			GoDialEndpointOutputSchemas.contactsAdd.parse({
				nested: { value: () => 1 },
			}),
		).toThrow();
	});
});
