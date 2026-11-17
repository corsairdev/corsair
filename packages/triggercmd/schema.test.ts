import { TriggerCmdSchema } from './schema';

describe('TRIGGERcmd schema', () => {
	it('declares a semver version', () => {
		expect(TriggerCmdSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities', () => {
		// Commands live on each computer, not in the cloud, so there is nothing
		// here to sync locally.
		expect(Array.isArray(TriggerCmdSchema.entities)).toBe(false);
		expect(TriggerCmdSchema.entities).toEqual({});
	});
});
