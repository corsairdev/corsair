export { getSchema } from './get-schema';
export {
	type CorsairDBOptions,
	getCoreTables,
	getCorsairTables,
} from './get-tables';
export type { CorsairDBPlugin, CorsairPluginDBSchema } from './plugin';
export { type Account, accountSchema } from './schema/account';
export { type Session, sessionSchema } from './schema/session';
export { coreSchema } from './schema/shared';
export { type User, userSchema } from './schema/user';
export { type Verification, verificationSchema } from './schema/verification';
export { toSchemaOutput } from './to-schema-output';

export type {
	CorsairDBSchema,
	DBFieldAttribute,
	DBFieldAttributeConfig,
	DBFieldType,
	DBPrimitive,
} from './type';
