export type DBFieldType = 'string' | 'number' | 'boolean' | 'date' | 'json';

export type DBReference = {
	model: string;
	field: string;
	onDelete?: 'cascade' | 'set null' | 'restrict';
};

export type DBFieldAttribute = {
	type: DBFieldType;
	required?: boolean | undefined;
	unique?: boolean | undefined;
	/**
	 * The actual column name in the database. If unset, the object key is used.
	 */
	fieldName?: string | undefined;
	references?: DBReference | undefined;
	/**
	 * Optional hint used by adapters for ordering / defaults.
	 */
	defaultValue?: (() => unknown) | undefined;
};

export type CorsairTableSchema = {
	modelName: string;
	fields: Record<string, DBFieldAttribute>;
	order?: number | undefined;
};

export type CorsairDBSchema = Record<string, CorsairTableSchema>;

/**
 * Plugins don’t need to provide `order`; it will be inferred/merged.
 */
export type CorsairPluginDBSchema = Record<
	string,
	{
		modelName?: string | undefined;
		fields: Record<string, DBFieldAttribute>;
		order?: number | undefined;
	}
>;
