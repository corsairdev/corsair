import { BorneoEndpointOutputSchemas } from './types';

// Pins the centralized tightening of the generated `successful` envelope
// field to z.literal(true): parses must fail unless the execution succeeded.
const representativeOperations = [
	{ name: 'getCloudAccountById', riskLevel: 'read' },
	{ name: 'createNewAsset', riskLevel: 'write' },
] as const;

describe('Borneo output schema execution envelope', () => {
	for (const { name, riskLevel } of representativeOperations) {
		it(`rejects a failed envelope for the ${riskLevel} op ${name}`, () => {
			const result = BorneoEndpointOutputSchemas[name].safeParse({
				successful: false,
				error: 'Asset name already exists',
				data: null,
			});

			expect(result.success).toBe(false);
		});

		it(`rejects an envelope without an execution flag for ${name}`, () => {
			const result = BorneoEndpointOutputSchemas[name].safeParse({
				data: {},
			});

			expect(result.success).toBe(false);
		});

		it(`accepts a successful envelope for the ${riskLevel} op ${name}`, () => {
			const result = BorneoEndpointOutputSchemas[name].safeParse({
				successful: true,
				data: { data: {} },
				log_id: 'log_123',
			});

			expect(result.success).toBe(true);
		});
	}

	it('preserves passthrough fields after the successful-flag tightening', () => {
		const result = BorneoEndpointOutputSchemas.createNewAsset.parse({
			successful: true,
			data: { data: { id: 'asset_1' } },
			session_info: { trace: 'trace_1' },
			log_id: 'log_123',
		});

		expect(result).toMatchObject({
			successful: true,
			session_info: { trace: 'trace_1' },
			log_id: 'log_123',
		});
	});
});
