// No stored entities for v1: every operation is a direct Linkly API call and
// nothing needs a local mirror, so the schema stays empty.
export const LinklySchema = {
	version: '1.0.0',
	entities: {},
} as const;
