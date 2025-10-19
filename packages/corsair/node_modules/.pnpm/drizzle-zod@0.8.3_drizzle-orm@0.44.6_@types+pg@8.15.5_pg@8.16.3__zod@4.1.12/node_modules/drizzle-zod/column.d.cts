import type { Column } from 'drizzle-orm';
import { z as zod } from 'zod/v4';
import type { CreateSchemaFactoryOptions } from "./schema.types.cjs";
import type { Json } from "./utils.cjs";
export declare const literalSchema: zod.ZodUnion<readonly [zod.ZodString, zod.ZodNumber, zod.ZodBoolean, zod.ZodNull]>;
export declare const jsonSchema: zod.ZodType<Json>;
export declare const bufferSchema: zod.ZodType<Buffer>;
export declare function columnToSchema(column: Column, factory: CreateSchemaFactoryOptions<Partial<Record<'bigint' | 'boolean' | 'date' | 'number' | 'string', true>> | true | undefined> | undefined): zod.ZodType;
