// const assertion: the plugin generic needs the literal version and the empty
// entities map, not a widened string and an open object.
export const SnowflakeSchema = {
	version: '1.0.0',
	entities: {},
} as const;
