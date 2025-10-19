import type { CreateInsertSchema, CreateSchemaFactoryOptions, CreateSelectSchema, CreateUpdateSchema } from "./schema.types.cjs";
export declare const createSelectSchema: CreateSelectSchema<undefined>;
export declare const createInsertSchema: CreateInsertSchema<undefined>;
export declare const createUpdateSchema: CreateUpdateSchema<undefined>;
export declare function createSchemaFactory<TCoerce extends Partial<Record<'bigint' | 'boolean' | 'date' | 'number' | 'string', true>> | true | undefined>(options?: CreateSchemaFactoryOptions<TCoerce>): {
    createSelectSchema: CreateSelectSchema<TCoerce>;
    createInsertSchema: CreateInsertSchema<TCoerce>;
    createUpdateSchema: CreateUpdateSchema<TCoerce>;
};
