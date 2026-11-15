import { z } from 'zod';
import {
	PipedriveEndpointInputSchemas,
	PipedriveEndpointOutputSchemas,
} from './endpoints/types';
import { pipedrive, pipedriveEndpointSchemas } from './index';

const validDeal = {
	id: 42,
	title: 'Qualified opportunity',
	owner_id: 7,
	person_id: null,
	org_id: 3,
	pipeline_id: 1,
	stage_id: 2,
	value: 1250,
	currency: 'USD',
	add_time: '2025-01-01T10:00:00Z',
	update_time: null,
	stage_change_time: null,
	is_deleted: false,
	is_archived: false,
	status: 'open',
	probability: null,
	lost_reason: null,
	visible_to: 3,
	close_time: null,
	won_time: null,
	lost_time: null,
	expected_close_date: null,
	label_ids: [],
	origin: 'API',
	origin_id: null,
	channel: null,
	channel_id: null,
	source_lead_id: null,
	arr: null,
	mrr: null,
	acv: null,
	custom_fields: { priority: 'high' },
};

describe('Pipedrive endpoint schemas', () => {
	it('accepts and bounds documented deal-list filters and pagination', () => {
		expect(
			PipedriveEndpointInputSchemas.dealList.parse({
				status: ['open', 'won'],
				include_fields: ['products_count'],
				custom_fields: ['abc'],
				limit: 500,
				cursor: 'opaque-cursor',
			}),
		).toMatchObject({ limit: 500, cursor: 'opaque-cursor' });
		expect(() =>
			PipedriveEndpointInputSchemas.dealList.parse({ limit: 501 }),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.dealList.parse({ status: ['pending'] }),
		).toThrow(z.ZodError);
	});

	it('rejects undocumented request properties and invalid IDs', () => {
		expect(() =>
			PipedriveEndpointInputSchemas.dealCreate.parse({
				title: 'X',
				callback: 'url',
			}),
		).toThrow(z.ZodError);
		expect(() =>
			PipedriveEndpointInputSchemas.dealGet.parse({ id: '1' }),
		).toThrow(z.ZodError);
	});

	it('requires create title and only permits false for restoring deleted deals', () => {
		expect(() => PipedriveEndpointInputSchemas.dealCreate.parse({})).toThrow(
			z.ZodError,
		);
		expect(() =>
			PipedriveEndpointInputSchemas.dealUpdate.parse({
				id: 1,
				is_deleted: true,
			}),
		).toThrow(z.ZodError);
	});

	it('parses documented nullable deal fields and rejects a malformed response', () => {
		expect(
			PipedriveEndpointOutputSchemas.dealGet.parse({
				success: true,
				data: validDeal,
			}),
		).toMatchObject({ data: { id: 42, person_id: null } });
		expect(() =>
			PipedriveEndpointOutputSchemas.dealGet.parse({
				success: 'yes',
				data: validDeal,
			}),
		).toThrow(z.ZodError);
	});

	it('validates pagination output and delete response shape', () => {
		expect(
			PipedriveEndpointOutputSchemas.dealList.parse({
				success: true,
				data: [validDeal],
				additional_data: { next_cursor: null },
			}),
		).toMatchObject({ additional_data: { next_cursor: null } });
		expect(() =>
			PipedriveEndpointOutputSchemas.dealDelete.parse({
				success: true,
				data: { id: '1' },
			}),
		).toThrow(z.ZodError);
	});

	it('keeps endpoint implementation, schema map, and metadata synchronized', () => {
		const plugin = pipedrive({});
		expect(Object.keys(pipedriveEndpointSchemas).sort()).toEqual([
			'deals.create',
			'deals.delete',
			'deals.get',
			'deals.list',
			'deals.update',
		]);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.endpoints?.deals.list).toBeDefined();
		expect(plugin.endpointMeta?.['deals.delete']?.riskLevel).toBe(
			'destructive',
		);
	});
});
