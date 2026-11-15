import {
	ApplicationGetStatsInputSchema,
	ApplicationGetStatsOutputSchema,
	ApplicationSettingsSchema,
	ApplicationUpdateInputSchema,
	EventsCreateInputSchema,
	EventsDeleteInputSchema,
	EventsDeleteOutputSchema,
	EventsListInputSchema,
	EventsListOutputSchema,
	EventsSearchInputSchema,
	EventsUpdateInputSchema,
	FomoEventSchema,
	TemplateSchema,
	TemplatesCreateInputSchema,
	TemplatesDeleteOutputSchema,
	TemplatesUpdateInputSchema,
} from './endpoints/types';
import { FomoSchema } from './schema';
import { fomoEntities } from './schema/database';

describe('Fomo schema', () => {
	it('declares a semver version', () => {
		expect(FomoSchema.version).toBeDefined();
		expect(FomoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(FomoSchema.entities).toBe(fomoEntities);
		expect(FomoSchema.entities).toEqual({});
	});
});

describe('Fomo events schemas', () => {
	it('validates FomoEventSchema with full fixture', () => {
		const fixture = {
			id: 1,
			external_id: 'ext_123',
			event_type_id: 123,
			event_type_tag: 'purchase',
			url: 'https://example.com/product',
			first_name: 'Alice',
			email_address: 'alice@example.com',
			ip_address: '192.168.1.1',
			city: 'San Francisco',
			province: 'CA',
			country: 'US',
			title: 'Widget Pro',
			image_url: 'https://example.com/image.png',
			created_at_to_seconds_from_epoch: 1590000000,
			message: 'Alice in San Francisco just bought Widget Pro',
			link: 'https://example.com/product?utm_source=fomo',
			custom_event_fields_attributes: [
				{
					id: 10,
					key: 'plan',
					value: 'pro',
				},
			],
		};

		const parsed = FomoEventSchema.safeParse(fixture);
		expect(parsed.success).toBe(true);

		// Rejects non-numeric id
		expect(FomoEventSchema.safeParse({ id: 'invalid' }).success).toBe(false);
	});

	it('validates EventsListInputSchema bounds and parameters', () => {
		expect(EventsListInputSchema.safeParse({}).success).toBe(true);
		expect(
			EventsListInputSchema.safeParse({ per: 30, page: 1, show_meta: true })
				.success,
		).toBe(true);
		expect(EventsListInputSchema.safeParse({ per: 0 }).success).toBe(false);
		expect(EventsListInputSchema.safeParse({ page: -1 }).success).toBe(false);
		// Undocumented fields rejected by strict schema
		expect(
			EventsListInputSchema.safeParse({ unknownField: 'test' }).success,
		).toBe(false);
	});

	it('validates EventsListOutputSchema as array or enveloped object', () => {
		const eventFixture = {
			id: 1,
			title: 'Item',
		};

		expect(EventsListOutputSchema.safeParse([eventFixture]).success).toBe(true);
		expect(
			EventsListOutputSchema.safeParse({
				events: [eventFixture],
				meta: {
					per_page: 30,
					page: 1,
					total_count: 100,
					total_pages: 4,
				},
			}).success,
		).toBe(true);
	});

	it('validates EventsCreateInputSchema and rejects unknown fields', () => {
		expect(
			EventsCreateInputSchema.safeParse({
				event_type_id: 42,
				first_name: 'Bob',
				city: 'Seattle',
			}).success,
		).toBe(true);

		expect(
			EventsCreateInputSchema.safeParse({
				event_type_tag: 'signup',
				title: 'Newsletter',
			}).success,
		).toBe(true);

		// Undocumented fields rejected
		expect(
			EventsCreateInputSchema.safeParse({
				callback_url: 'https://evil.com',
			}).success,
		).toBe(false);
	});

	it('validates EventsUpdateInputSchema requires id', () => {
		expect(
			EventsUpdateInputSchema.safeParse({
				id: 10,
				first_name: 'Charlie',
			}).success,
		).toBe(true);

		expect(
			EventsUpdateInputSchema.safeParse({
				first_name: 'Charlie',
			}).success,
		).toBe(false);
	});

	it('validates EventsDeleteInputSchema and output', () => {
		expect(EventsDeleteInputSchema.safeParse({ id: 5 }).success).toBe(true);
		expect(EventsDeleteInputSchema.safeParse({}).success).toBe(false);

		expect(
			EventsDeleteOutputSchema.safeParse({
				message: 'Event successfully deleted',
			}).success,
		).toBe(true);
		expect(EventsDeleteOutputSchema.safeParse({}).success).toBe(false);
	});

	it('validates EventsSearchInputSchema query and approved fields', () => {
		expect(
			EventsSearchInputSchema.safeParse({
				field: 'email_address',
				q: 'alice@example.com',
			}).success,
		).toBe(true);

		expect(
			EventsSearchInputSchema.safeParse({
				field: 'external_id',
				q: 'ext_99',
			}).success,
		).toBe(true);

		// Disapproved search field
		expect(
			EventsSearchInputSchema.safeParse({
				field: 'first_name',
				q: 'Alice',
			}).success,
		).toBe(false);

		// Empty query string
		expect(
			EventsSearchInputSchema.safeParse({
				field: 'email_address',
				q: '',
			}).success,
		).toBe(false);
	});
});

describe('Fomo templates schemas', () => {
	it('validates TemplateSchema fixture', () => {
		const fixture = {
			id: 52,
			event_type_tag: 'new_lead',
			name: 'New Lead',
			message: '{{ first_name }} in {{ city }} just joined {{ time_ago }}',
			markdown_enabled: true,
			use_avatar: false,
			use_ip_mapping: true,
		};

		expect(TemplateSchema.safeParse(fixture).success).toBe(true);
		expect(TemplateSchema.safeParse({ id: 'abc' }).success).toBe(false);
	});

	it('validates TemplatesCreateInputSchema requires name and message', () => {
		expect(
			TemplatesCreateInputSchema.safeParse({
				name: 'Download',
				message: '{{ first_name }} downloaded ebook',
			}).success,
		).toBe(true);

		expect(
			TemplatesCreateInputSchema.safeParse({
				name: '',
				message: 'message',
			}).success,
		).toBe(false);

		expect(
			TemplatesCreateInputSchema.safeParse({
				name: 'Download',
			}).success,
		).toBe(false);
	});

	it('validates TemplatesUpdateInputSchema requires id', () => {
		expect(
			TemplatesUpdateInputSchema.safeParse({
				id: 52,
				name: 'Updated Name',
			}).success,
		).toBe(true);

		expect(
			TemplatesUpdateInputSchema.safeParse({
				name: 'Updated Name',
			}).success,
		).toBe(false);
	});

	it('validates TemplatesDeleteOutputSchema', () => {
		expect(
			TemplatesDeleteOutputSchema.safeParse({
				message: 'Template deleted',
				success: true,
			}).success,
		).toBe(true);
	});
});

describe('Fomo application schemas', () => {
	it('accepts the documented language and event_types_attributes update fields', () => {
		const input = {
			language: 'de',
			event_types_attributes: [
				{
					id: 1,
					name: 'Fomo',
					message: 'Someone in {{ city }} just purchased {{ linked_title }}',
				},
			],
		};
		expect(ApplicationUpdateInputSchema.parse(input)).toEqual(input);
	});

	it('validates ApplicationSettingsSchema fixture', () => {
		const fixture = {
			id: 1,
			name: 'Fomo App',
			url: 'https://example.com',
			page_load: 1,
			maximum_per_page: 30,
			display_for: 1,
			display_interval: 1,
			randomize: 1,
			closable: 1,
			display_period: 4,
			display_threshold: 5,
			time_ago_period: 1,
			time_ago_threshold: 1,
			hide_mobile: false,
			loop_notification: true,
			position: 'bottom_left',
			theme: 'theme1',
			utm_source: 'fomo',
			utm_medium: 'notification',
			client_id: 'app_client_id',
			client_secret: 'app_client_secret',
			event_types_attributes: [{ id: 1, name: 'Fomo', _destroy: 0 }],
			stat_application: {
				click_count: 10,
				display_count: 100,
			},
		};

		expect(ApplicationSettingsSchema.safeParse(fixture).success).toBe(true);
	});

	it('validates ApplicationUpdateInputSchema positions and themes', () => {
		expect(
			ApplicationUpdateInputSchema.safeParse({
				position: 'bottom_left',
				theme: 'theme1',
			}).success,
		).toBe(true);

		expect(
			ApplicationUpdateInputSchema.safeParse({
				position: 'invalid_position',
			}).success,
		).toBe(false);

		expect(
			ApplicationUpdateInputSchema.safeParse({
				theme: 'invalid_theme',
			}).success,
		).toBe(false);
	});

	it('validates ApplicationGetStatsInputSchema and OutputSchema', () => {
		expect(
			ApplicationGetStatsInputSchema.safeParse({
				date_range: {
					from: '2020-03-20',
					to: '2020-04-20',
				},
			}).success,
		).toBe(true);

		expect(
			ApplicationGetStatsInputSchema.safeParse({
				date_range: {
					from: '2020-03-20',
				},
			}).success,
		).toBe(false);

		const statsOutput = {
			graph: {
				'2020-03-20': {
					converted_sale_in_cents: 50,
					conversions_count: 1,
					click_count: 8,
					impr_count: 1737,
					hover_count: 60,
				},
			},
			totals: {
				converted_sale_in_cents: 500,
				conversions_count: 10,
				click_count: 131,
				impr_count: 42718,
				hover_count: 1112,
			},
			date_range: {
				from: '2020-03-20',
				to: '2020-04-20',
			},
			has_ga_conversions: true,
		};

		expect(ApplicationGetStatsOutputSchema.safeParse(statsOutput).success).toBe(
			true,
		);
	});
});
