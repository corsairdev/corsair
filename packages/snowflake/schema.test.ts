import { SnowflakeSchema } from './schema';

describe('Snowflake schema', () => {
	it('pins version 1.0.0 and an empty entities registry', () => {
		expect(SnowflakeSchema.version).toBe('1.0.0');
		expect(SnowflakeSchema.entities).toEqual({});
	});
});
