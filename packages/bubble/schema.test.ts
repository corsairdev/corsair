import { BubbleSchema } from './schema';
import { BubbleListResponse, BubbleThingEntity } from './schema/database';

describe('Bubble schema', () => {
	it('declares a semver version', () => {
		expect(BubbleSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares the things entity store', () => {
		expect(Object.keys(BubbleSchema.entities)).toEqual(['things']);
		expect(BubbleSchema.entities.things).toBe(BubbleThingEntity);
	});

	it('parses the official GET sample including Created By/Date fields', () => {
		const record = {
			_id: '1671702337369x488321592367327900',
			'Created By': 'example@example.com',
			'Created Date': '2022-12-22T09:45:37.369Z',
			'Modified Date': '2022-12-22T09:45:37.417Z',
			'Unit name': 'Unit A',
		};
		const parsed = BubbleThingEntity.safeParse(record);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data['Created By']).toBe('example@example.com');
			expect(parsed.data['Created Date']).toBe('2022-12-22T09:45:37.369Z');
			expect(parsed.data['Modified Date']).toBe('2022-12-22T09:45:37.417Z');
			expect(parsed.data['Unit name']).toBe('Unit A');
		}
	});

	it('rejects a list result that lacks an _id', () => {
		expect(BubbleThingEntity.safeParse({ 'Unit name': 'Unit A' }).success).toBe(
			false,
		);
	});

	it('validates the list envelope shape returned by GET /obj/{typename}', () => {
		const payload = {
			response: {
				cursor: 0,
				count: 1,
				remaining: 5,
				results: [{ _id: '1', 'Unit name': 'Unit A' }],
			},
		};
		expect(BubbleListResponse.safeParse(payload).success).toBe(true);
	});
});
