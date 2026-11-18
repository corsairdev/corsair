import {
	HexEndpointInputSchemas,
	HexEndpointOutputSchemas,
} from './endpoints/types';
import { validInputs, validOutputs } from './fixtures';
import { hexEndpointMeta, hexEndpointSchemas } from './index';
import { HexSchema } from './schema';

describe('Hex Schema & Registry', () => {
	it('declares a semver version', () => {
		expect(HexSchema.version).toBeDefined();
		expect(HexSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof HexSchema.entities).toBe('object');
		expect(HexSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(HexSchema.entities))).toBe(true);
		for (const entity of Object.values(HexSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('maintains synchronized keys across schemas, inputs, and outputs', () => {
		const inputKeys = Object.keys(HexEndpointInputSchemas).sort();
		const outputKeys = Object.keys(HexEndpointOutputSchemas).sort();
		const registeredKeys = Object.keys(hexEndpointSchemas)
			.map((k) => {
				const [g, a] = k.split('.');
				if (!g || !a) return k;
				return g + a.charAt(0).toUpperCase() + a.slice(1);
			})
			.sort();
		expect(inputKeys).toEqual(outputKeys);
		expect(inputKeys).toEqual(registeredKeys);
		expect(inputKeys.length).toBe(60);
	});

	it('requires approval for billable or message-sending operations', () => {
		for (const operation of [
			'embedding.createPresignedUrl',
			'projectRuns.run',
			'suggestions.triggerReview',
			'threads.create',
			'threads.continue',
		] as const) {
			expect(hexEndpointMeta[operation].riskLevel).toBe('destructive');
		}
	});
});

describe('Hex Input Schemas', () => {
	for (const [key, schema] of Object.entries(HexEndpointInputSchemas)) {
		it(`validates valid input for ${key}`, () => {
			// unknown because input mocks are indexed dynamically by schema key
			const parsed = schema.safeParse(
				(validInputs as Record<string, unknown>)[key],
			);
			expect(parsed.success).toBe(true);
		});
	}

	it('rejects invalid inputs missing required fields or having invalid types', () => {
		// cellsList requires projectId
		expect(HexEndpointInputSchemas.cellsList.safeParse({}).success).toBe(false);
		// cellsList rejects negative limit
		expect(
			HexEndpointInputSchemas.cellsList.safeParse({
				projectId: 'proj-1',
				limit: -1,
			}).success,
		).toBe(false);
		// projectsGet requires projectId
		expect(HexEndpointInputSchemas.projectsGet.safeParse({}).success).toBe(
			false,
		);
		// cellsCreate requires cellType and contents
		expect(
			HexEndpointInputSchemas.cellsCreate.safeParse({
				projectId: '11111111-1111-4111-8111-111111111111',
			}).success,
		).toBe(false);
		expect(
			HexEndpointInputSchemas.cellsCreate.safeParse({
				projectId: '11111111-1111-4111-8111-111111111111',
				cellType: 'INVALID_TYPE',
			}).success,
		).toBe(false);
		// usersDeactivate requires userId
		expect(HexEndpointInputSchemas.usersDeactivate.safeParse({}).success).toBe(
			false,
		);
		// projectsExport requires projectId and exportType
		expect(
			HexEndpointInputSchemas.projectsExport.safeParse({
				projectId: '11111111-1111-4111-8111-111111111111',
				exportType: 'INVALID',
			}).success,
		).toBe(false);
	});

	it('accepts populated caller-defined Hex input maps', () => {
		expect(
			HexEndpointInputSchemas.embeddingCreatePresignedUrl.safeParse({
				projectId: '11111111-1111-4111-8111-111111111111',
				hexUserAttributes: { customerTier: 'enterprise' },
				inputParameters: { region: 'US', cohort: ['returning', 'new'] },
			}).success,
		).toBe(true);
		expect(
			HexEndpointInputSchemas.projectRunsRun.safeParse({
				projectId: '11111111-1111-4111-8111-111111111111',
				inputParams: { region: 'west', includeArchived: false },
			}).success,
		).toBe(true);
	});
});

describe('Hex Output Schemas', () => {
	for (const [key, schema] of Object.entries(HexEndpointOutputSchemas)) {
		it(`validates valid output for ${key}`, () => {
			// unknown because output mocks are indexed dynamically by schema key
			const parsed = schema.safeParse(
				(validOutputs as Record<string, unknown>)[key],
			);
			expect(parsed.success).toBe(true);
		});
	}

	it('rejects invalid outputs missing required fields', () => {
		// adminListAgentUsage requires runs and pagination
		expect(
			HexEndpointOutputSchemas.adminListAgentUsage.safeParse({}).success,
		).toBe(false);
		// projectsGet requires id, title, type, computeProfile, creator, owner
		expect(
			HexEndpointOutputSchemas.projectsGet.safeParse({ id: 'proj-1' }).success,
		).toBe(false);
		// usersMe requires id, email, role, isServiceAccount, status
		expect(
			HexEndpointOutputSchemas.usersMe.safeParse({ email: 'user@example.com' })
				.success,
		).toBe(false);
	});
});
