import { EndpointOutputSchemas } from './endpoints/types';

// Field types as the live API returned them on a trial account (11-15),
// with neutral values: flags arrive as numbers, booleans or "0"/"1" strings,
// amounts as numbers, and some counters as numeric strings.
const job = {
	uuid: '550e8400-e29b-41d4-a716-446655440000',
	active: 1,
	status: 'Work Order',
	payment_amount: 0,
	ready_to_invoice: '0',
	geo_is_valid: 1,
	lng: 151.2,
	lat: -33.8,
	payment_processed: 0,
	payment_received: 0,
	quote_sent: false,
	invoice_sent: false,
	total_invoice_amount: '0.00',
};
const material = {
	uuid: '550e8400-e29b-41d4-a716-446655440001',
	active: 1,
	name: 'Labour',
	price: 85,
	cost: 0,
	quantity_in_stock: 0,
	price_includes_taxes: 0,
	item_is_inventoried: '0',
	use_description_for_invoicing: 1,
};
const queue = {
	uuid: '550e8400-e29b-41d4-a716-446655440002',
	active: 1,
	name: 'Parts on order',
	default_timeframe: 7,
	requires_assignment: '0',
};
const staff = {
	uuid: '550e8400-e29b-41d4-a716-446655440003',
	active: 1,
	first: 'Test',
	last: 'Staff',
	lng: 0,
	lat: 0,
	hide_from_schedule: 0,
	can_receive_push_notification: 1,
};
const activity = {
	uuid: '550e8400-e29b-41d4-a716-446655440004',
	active: 1,
	activity_was_recorded: 0,
	activity_was_automated: 0,
	activity_was_scheduled: 1,
	has_been_opened: 0,
	travel_time_in_seconds: '0',
	travel_distance_in_meters: '0',
};
const client = {
	uuid: '550e8400-e29b-41d4-a716-446655440005',
	active: 1,
	name: 'Test Client',
	is_individual: 0,
	billing_attention: '0',
};
const form = {
	uuid: '550e8400-e29b-41d4-a716-446655440007',
	active: 1,
	name: 'Job Safety Analysis',
	can_be_used_independently: '0',
	// ServiceM8 sends false, not [], when a form has no template fields.
	template_fields: false,
};
const note = {
	uuid: '550e8400-e29b-41d4-a716-446655440006',
	active: 1,
	note: 'corsair-plugin-test',
	action_required: '0',
};

describe('ServiceM8 live response shapes', () => {
	it.each([
		['jobs.list', { data: [job] }],
		['jobs.retrieve', job],
		['materials.list', { data: [material] }],
		['materials.retrieve', material],
		['queues.list', { data: [queue] }],
		['queues.retrieve', queue],
		['staff.retrieve', staff],
		['jobActivities.retrieve', activity],
		['clients.retrieve', client],
		['notes.retrieve', note],
		['forms.list', { data: [form] }],
		['forms.retrieve', form],
	] as const)('%s parses what the API sends', (name, body) => {
		const parsed = EndpointOutputSchemas[name].safeParse(body);
		expect(parsed.success ? [] : parsed.error.issues).toEqual([]);
	});

	it('keeps a job status ServiceM8 adds later', () => {
		expect(
			EndpointOutputSchemas['jobs.retrieve'].parse({ ...job, status: 'Lead' })
				.status,
		).toBe('Lead');
	});
});
