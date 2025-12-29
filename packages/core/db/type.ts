import type { StandardSchemaV1 } from '@standard-schema/spec';

export type DBFieldType =
	| 'string'
	| 'number'
	| 'boolean'
	| 'date'
	| 'json'
	| `${'string' | 'number'}[]`
	| string[];

export type DBPrimitive =
	| string
	| number
	| boolean
	| Date
	| null
	| undefined
	| string[]
	| number[];

export type DBFieldAttributeConfig = {
	/**
	 * If the field should be required on a new record.
	 * @default true
	 */
	required?: boolean | undefined;
	/**
	 * If the value should be returned on a response body.
	 * @default true
	 */
	returned?: boolean | undefined;
	/**
	 * If a value should be provided when creating a new record.
	 * @default true
	 */
	input?: boolean | undefined;
	/**
	 * Default value for the field.
	 *
	 * Note: This will not create a default value on the database level. It will only
	 * be used when creating a new record.
	 */
	defaultValue?: (DBPrimitive | (() => DBPrimitive)) | undefined;
	/**
	 * Update value for the field.
	 *
	 * Note: Adapters may map this to database-level triggers/defaults where supported.
	 */
	onUpdate?: (() => DBPrimitive) | undefined;
	/**
	 * Reference to another model.
	 */
	references?:
		| {
				/**
				 * The model to reference (table/model name).
				 */
				model: string;
				/**
				 * The field on the referenced model.
				 */
				field: string;
				/**
				 * The action to perform when the reference is deleted.
				 * @default "cascade"
				 */
				onDelete?:
					| 'no action'
					| 'restrict'
					| 'cascade'
					| 'set null'
					| 'set default';
		  }
		| undefined;
	unique?: boolean | undefined;
	/**
	 * If the field should be a bigint on the database instead of integer.
	 */
	bigint?: boolean | undefined;
	/**
	 * A schema to validate the value (zod fits StandardSchemaV1).
	 */
	validator?:
		| {
				input?: StandardSchemaV1;
				output?: StandardSchemaV1;
		  }
		| undefined;
	/**
	 * The name of the field on the database.
	 */
	fieldName?: string | undefined;
	/**
	 * If the field should be sortable.
	 *
	 * Useful for marking fields varchar instead of text in some adapters.
	 */
	sortable?: boolean | undefined;
};

export type DBFieldAttribute<T extends DBFieldType = DBFieldType> = {
	type: T;
} & DBFieldAttributeConfig;

export type CorsairDBSchema = Record<
	string,
	{
		/**
		 * The name of the table/model in the database.
		 */
		modelName: string;
		/**
		 * The fields of the table.
		 */
		fields: Record<string, DBFieldAttribute>;
		/**
		 * Whether to disable migrations for this table.
		 * @default false
		 */
		disableMigrations?: boolean | undefined;
		/**
		 * The order of the table (useful when generating schema/migrations).
		 */
		order?: number | undefined;
	}
>;
