import { SupportbeeSchema } from './schema';

describe('supportbee schema', () => {
	it('declares a version and no entities', () => {
		// The plugin stores nothing: a ticket lives in SupportBee, and syncing it
		// locally would duplicate the desk.
		expect(SupportbeeSchema.version).toBe('1.0.0');
		expect(SupportbeeSchema.entities).toEqual({});
	});
});
