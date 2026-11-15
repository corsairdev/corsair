import {
	JobCreateInput,
	JobPaymentCreateInput,
	JobSchema,
	ListInput,
	NoteCreateInput,
	safeUuid,
} from './endpoints/types';
import { servicem8 } from './index';
import { ServiceM8Schema } from './schema';

describe('ServiceM8 schemas', () => {
	it('declares a version and an entity map', () => {
		expect(ServiceM8Schema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(ServiceM8Schema.entities).toEqual({});
	});
	it('accepts minimal documented create and query inputs', () => {
		expect(JobCreateInput.parse({ status: 'Quote' })).toEqual({
			status: 'Quote',
		});
		expect(NoteCreateInput.parse({})).toEqual({});
		expect(JobPaymentCreateInput.parse({})).toEqual({});
		expect(ListInput.parse({ cursor: '-1' })).toEqual({ cursor: '-1' });
	});
	it('rejects invalid status, flag and path values', () => {
		expect(JobCreateInput.safeParse({ status: 'unknown' }).success).toBe(false);
		expect(
			JobCreateInput.safeParse({ status: 'Quote', invoice_sent: 2 }).success,
		).toBe(false);
		expect(safeUuid.safeParse('../bad').success).toBe(false);
	});
	it('retains custom fields and cleared values in resource outputs', () => {
		expect(
			JobSchema.parse({
				status: 'Quote',
				company_uuid: null,
				customfield_color: 'blue',
			}),
		).toEqual({
			status: 'Quote',
			company_uuid: null,
			customfield_color: 'blue',
		});
	});
});

describe('ServiceM8 plugin config', () => {
	it('requests the OAuth scopes the form and payment operations need', () => {
		expect(servicem8().oauthConfig?.scopes).toEqual(
			expect.arrayContaining([
				'read_forms',
				'read_job_payments',
				'manage_job_payments',
			]),
		);
	});
	it('marks job creation destructive because it can incur charges', () => {
		expect(servicem8().endpointMeta?.['jobs.create']?.riskLevel).toBe(
			'destructive',
		);
	});
});
