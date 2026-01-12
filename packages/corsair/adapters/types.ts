export type CorsairTableName =
	| 'corsair_connections'
	| 'corsair_resources'
	| 'corsair_events'
	| 'corsair_providers'
	| (string & {});

export type CorsairWhereOperator = '=' | 'in' | 'like';

export type CorsairWhere = {
	field: string;
	value: unknown;
	operator?: CorsairWhereOperator | undefined;
};

export type CorsairSortBy = {
	field: string;
	direction: 'asc' | 'desc';
};

export type CorsairTransactionAdapter = Omit<CorsairDbAdapter, 'transaction'>;

export type CorsairDbAdapter = {
	/**
	 * Unique identifier for the adapter instance.
	 */
	id: string;

	findOne: <T>(args: {
		table: CorsairTableName;
		where: CorsairWhere[];
		select?: string[] | undefined;
	}) => Promise<T | null>;

	findMany: <T>(args: {
		table: CorsairTableName;
		where?: CorsairWhere[] | undefined;
		limit?: number | undefined;
		offset?: number | undefined;
		sortBy?: CorsairSortBy | undefined;
		select?: string[] | undefined;
	}) => Promise<T[]>;

	insert: <T extends Record<string, any>, R = T>(args: {
		table: CorsairTableName;
		data: T;
		select?: string[] | undefined;
	}) => Promise<R>;

	/**
	 * Updates rows and returns one updated row when possible.
	 *
	 * Note: Some ORMs can't reliably return the updated row for non-unique filters,
	 * in which case adapters may do a follow-up `findOne`.
	 */
	update: <T>(args: {
		table: CorsairTableName;
		where: CorsairWhere[];
		data: Record<string, any>;
		select?: string[] | undefined;
	}) => Promise<T | null>;

	deleteMany: (args: {
		table: CorsairTableName;
		where: CorsairWhere[];
	}) => Promise<number>;

	count: (args: {
		table: CorsairTableName;
		where?: CorsairWhere[] | undefined;
	}) => Promise<number>;

	transaction?: <R>(
		fn: (trx: CorsairTransactionAdapter) => Promise<R>,
	) => Promise<R>;
};
