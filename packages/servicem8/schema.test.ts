import {
	JobCreateInput,
	JobPaymentCreateInput,
	JobSchema,
	ListInput,
	NoteCreateInput,
	safeUuid,
} from './endpoints/types';
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
