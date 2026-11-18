import { CodereadrSchema } from './schema';

describe('schema', () => {
	it('carries a semantic version', () => {
		expect(CodereadrSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: every read goes to the CodeREADr API', () => {
		// Scan data can be large and is already the system of record in
		// CodeREADr, so mirroring it into the local database would need a sync
		// that this plugin does not have.
		expect(CodereadrSchema.entities).toEqual({});
	});
});
