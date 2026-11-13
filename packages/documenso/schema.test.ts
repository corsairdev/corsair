import {
	DocumensoOperationDefinitions,
	DocumensoOperationNames,
} from './endpoints/definitions';
import {
	DocumensoEndpointInputSchemas,
	DocumensoEndpointOutputSchemas,
} from './endpoints/types';

describe('Documenso v2 operation schemas', () => {
	for (const name of DocumensoOperationNames) {
		const definition = DocumensoOperationDefinitions[name];
		it(`validates the documented input and output for ${definition.method} ${definition.path}`, () => {
			const inputSchema = DocumensoEndpointInputSchemas[name];
			const outputSchema = DocumensoEndpointOutputSchemas[name];
			const input = definition.inputExample;
			const output = definition.outputExample;

			expect(inputSchema.safeParse(input).success).toBe(true);
			expect(outputSchema.safeParse(output).success).toBe(true);
			expect(
				inputSchema.safeParse({ ...input, undocumentedCorsairField: true })
					.success,
			).toBe(false);
			expect(outputSchema.safeParse(null).success).toBe(false);
			if (definition.binaryDownload) {
				expect(
					outputSchema.safeParse({ ...output, base64: 'not-base64' }).success,
				).toBe(false);
				expect(
					outputSchema.safeParse({
						...output,
						contentType: 'application/octet-stream',
					}).success,
				).toBe(false);
			}
		});
	}

	it('validates a large PDF upload without regex backtracking', () => {
		const largePdfBase64 = Buffer.alloc(12 * 1024 * 1024).toString('base64');
		const sample = DocumensoOperationDefinitions.envelopeCreate.inputExample;
		const parsed = DocumensoEndpointInputSchemas.envelopeCreate.parse({
			...sample,
			files: [
				{
					filename: 'large-contract.pdf',
					contentType: 'application/pdf',
					contentBase64: largePdfBase64,
				},
			],
		});
		expect(parsed.files?.[0]?.contentBase64).toBe(largePdfBase64);
	});
});

describe('Documenso responses with fields added after the OpenAPI snapshot', () => {
	const envelope = DocumensoOperationDefinitions.envelopeGet.outputExample;
	const field = DocumensoOperationDefinitions.envelopeFieldGet.outputExample;
	const auditEntry = {
		id: 'log_1',
		createdAt: '2026-11-13T00:00:00.000Z',
		envelopeId: 'envelope_1',
		name: null,
		email: null,
		userId: 1,
		userAgent: null,
		ipAddress: null,
	};

	it('parses an envelope that includes the contents array the live API returns', () => {
		const parsed = DocumensoEndpointOutputSchemas.envelopeGet.safeParse({
			...envelope,
			contents: [],
		});
		expect(parsed.success).toBe(true);
	});

	it('parses a field whose fieldMeta carries the newer fontFamily setting', () => {
		const parsed = DocumensoEndpointOutputSchemas.envelopeFieldGet.safeParse({
			...field,
			type: 'INITIALS',
			fieldMeta: { type: 'initials', fontFamily: 'handwriting' },
		});
		expect(parsed.success).toBe(true);
	});

	it('keeps an output enum value Documenso adds later', () => {
		const parsed = DocumensoEndpointOutputSchemas.envelopeGet.safeParse({
			...envelope,
			status: 'EXPIRED',
		});
		expect(parsed.success).toBe(true);
	});

	it('parses CONTENT_* audit-log entries and unknown future event types', () => {
		const parsed = DocumensoEndpointOutputSchemas.envelopeAuditLogFind.parse({
			data: [
				{
					...auditEntry,
					type: 'CONTENT_CREATED',
					data: {
						contentId: 'content_1',
						contentType: 'text',
						envelopeItemId: 'item_1',
						contentMeta: { text: 'Hello' },
						dataContentId: null,
					},
				},
				{
					...auditEntry,
					type: 'CONTENT_UPDATED',
					data: {
						contentId: 'content_1',
						contentType: 'text',
						envelopeItemId: 'item_1',
						changes: [{ type: 'PROPERTY', key: 'text', from: 'a', to: 'b' }],
					},
				},
				{
					...auditEntry,
					type: 'SOME_FUTURE_EVENT',
					data: { anything: true },
				},
			],
			count: 3,
			currentPage: 1,
			perPage: 10,
			totalPages: 1,
		});
		expect(parsed.data.map((entry) => entry.type)).toEqual([
			'CONTENT_CREATED',
			'CONTENT_UPDATED',
			'SOME_FUTURE_EVENT',
		]);
		expect(parsed.data[0]?.data).toMatchObject({ contentId: 'content_1' });
	});
});
