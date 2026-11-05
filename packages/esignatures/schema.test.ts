import { ESignaturesEndpointOutputSchemas } from './endpoints/types';
import { ESignaturesSchema } from './schema';

describe('ESignatures schema', () => {
	it('declares a semver version', () => {
		expect(ESignaturesSchema.version).toBeDefined();
		expect(ESignaturesSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ESignaturesSchema.entities).toBe('object');
		expect(ESignaturesSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ESignaturesSchema.entities))).toBe(true);
		for (const entity of Object.values(ESignaturesSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.

describe('action responses', () => {
	// A completed write must parse even when the body omits or renames its
	// status; throwing after the POST would invite a retry that repeats it.
	const actions = [
		'contractsWithdraw',
		'contractsSendDraft',
		'contractsAddSigner',
		'contractsUpdateSigner',
		'contractsResendToSigner',
		'contractsDeleteSigner',
		'templatesDelete',
	] as const;

	it.each(actions)('%s accepts a body without status', (name) => {
		expect(ESignaturesEndpointOutputSchemas[name].safeParse({}).success).toBe(
			true,
		);
	});

	it.each(actions)('%s accepts an unexpected status string', (name) => {
		expect(
			ESignaturesEndpointOutputSchemas[name].safeParse({ status: 'ok' })
				.success,
		).toBe(true);
	});
});
