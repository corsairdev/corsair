import { PipedriveCatalog } from './endpoints/catalog-schemas';

// Trimmed shapes from a live Pipedrive trial account (11-23); names and ids are made up.
describe('catalog responses accept what Pipedrive sends', () => {
	it('accepts nulls the spec marks as required strings', () => {
		const response = {
			success: true,
			data: [
				{
					id: 1,
					name: 'Call',
					icon_key: 'call',
					color: null,
					update_time: null,
				},
			],
		};
		expect(
			PipedriveCatalog['apiV1.activityTypes.getActivityTypes'].output.safeParse(
				response,
			).success,
		).toBe(true);
	});

	it('accepts data: null on an empty v1 list', () => {
		const response = {
			success: true,
			data: null,
			additional_data: { pagination: { start: 0, limit: 100 } },
		};
		expect(
			PipedriveCatalog['apiV1.notes.getNotes'].output.safeParse(response)
				.success,
		).toBe(true);
	});

	it('accepts a field type the spec does not list', () => {
		const response = {
			success: true,
			data: [{ id: 30, key: 'attendees', field_type: 'attendees' }],
		};
		expect(
			PipedriveCatalog[
				'apiV1.activityFields.getActivityFields'
			].output.safeParse(response).success,
		).toBe(true);
	});

	it('accepts a condition object in mandatory_flag', () => {
		const response = {
			success: true,
			data: [{ id: 9, key: 'person_id', mandatory_flag: { person_id: '<=0' } }],
		};
		expect(
			PipedriveCatalog['apiV1.dealFields.getDealFields'].output.safeParse(
				response,
			).success,
		).toBe(true);
	});

	it('accepts the recents user item with a list of users', () => {
		const response = {
			success: true,
			data: [
				{
					item: 'user',
					id: 7,
					data: [{ id: 7, name: 'Test User', active_flag: true, phone: null }],
				},
			],
		};
		expect(
			PipedriveCatalog['apiV1.recents.getRecents'].output.safeParse(response)
				.success,
		).toBe(true);
	});

	it('accepts boolean option ids on v2 fields', () => {
		const response = {
			success: true,
			data: [
				{
					field_name: 'Done',
					field_code: 'done',
					field_type: 'boolean',
					options: [
						{ id: false, label: 'To do' },
						{ id: true, label: 'Done' },
					],
				},
			],
		};
		expect(
			PipedriveCatalog[
				'apiV2.activityFields.getActivityFields'
			].output.safeParse(response).success,
		).toBe(true);
	});

	it('accepts empty currency maps in pipeline movement statistics', () => {
		const empty = { count: 0, deal_ids: [], values: [], formatted_values: [] };
		const response = {
			success: true,
			data: {
				movements_between_stages: { count: 0 },
				new_deals: empty,
				deals_left_open: empty,
				won_deals: empty,
				lost_deals: empty,
				average_age_in_days: { across_all_stages: 0, by_stages: [] },
			},
		};
		expect(
			PipedriveCatalog[
				'apiV1.pipelines.getPipelineMovementStatistics'
			].output.safeParse(response).success,
		).toBe(true);
	});

	it('still rejects a response that is not an object', () => {
		expect(
			PipedriveCatalog['apiV1.notes.getNotes'].output.safeParse('<html>')
				.success,
		).toBe(false);
	});
});
