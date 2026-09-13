import { ReplyioSchema } from './schema';
import {
	ReplyioEndpointInputSchemas,
	ReplyioEndpointOutputSchemas,
} from './endpoints/types';

describe('Replyio schema', () => {
	it('declares a semver version', () => {
		expect(ReplyioSchema.version).toBeDefined();
		expect(ReplyioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ReplyioSchema.entities).toBe('object');
		expect(ReplyioSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ReplyioSchema.entities))).toBe(true);
	});
});

describe('Replyio endpoint schema registry', () => {
	const inputKeys = Object.keys(ReplyioEndpointInputSchemas);
	const outputKeys = Object.keys(ReplyioEndpointOutputSchemas);

	it('covers all 33 implemented endpoints with input schemas', () => {
		expect(inputKeys).toHaveLength(33);
	});

	it('covers all 33 implemented endpoints with output schemas', () => {
		expect(outputKeys).toHaveLength(33);
	});

	it('has a matching output schema for every input schema', () => {
		for (const key of inputKeys) {
			expect(outputKeys).toContain(key);
		}
	});

	it('rejects invalid pagination input', () => {
		const result = ReplyioEndpointInputSchemas.sequencesList.safeParse({
			top: 5000,
		});
		expect(result.success).toBe(false);
	});

	it('rejects contact creation without email or LinkedIn URL', () => {
		const result = ReplyioEndpointInputSchemas.contactsCreate.safeParse({
			firstName: 'Ada',
		});
		expect(result.success).toBe(false);
	});

	it('rejects duplicate contact ids for bulk remove', () => {
		const result =
			ReplyioEndpointInputSchemas.sequenceContactsBulkRemove.safeParse({
				sequenceId: 1,
				contactIds: [2, 2],
			});
		expect(result.success).toBe(false);
	});

	it('rejects unknown sequence step types', () => {
		const result = ReplyioEndpointInputSchemas.stepsCreate.safeParse({
			sequenceId: 1,
			step: { type: 'telepathy', delayInMinutes: 10 },
		});
		expect(result.success).toBe(false);
	});

	it('rejects empty contact lists for clearStatus', () => {
		const result = ReplyioEndpointInputSchemas.contactsClearStatus.safeParse({
			contactIds: [],
		});
		expect(result.success).toBe(false);
	});

	it('rejects duplicate statuses for clearStatus', () => {
		const result = ReplyioEndpointInputSchemas.contactsClearStatus.safeParse({
			contactIds: [1],
			statuses: ['optedOut', 'optedOut'],
		});
		expect(result.success).toBe(false);
	});

	it('accepts a subset of statuses for clearStatus', () => {
		const result = ReplyioEndpointInputSchemas.contactsClearStatus.safeParse({
			contactIds: [1, 2],
			statuses: ['bounced'],
		});
		expect(result.success).toBe(true);
	});
});
