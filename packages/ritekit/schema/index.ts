/**
 * RiteKit is a stateless text and image utility API: every call derives an answer
 * from the input it is given, and nothing it returns is a record the account
 * owns. There is nothing worth caching, so no entities are declared.
 */
export const RiteKitSchema = {
	version: '1.0.0',
	entities: {},
} as const;
