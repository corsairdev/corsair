import type { CorsairDBSchema, DBFieldAttribute } from '../type';

export type DBAdapterSchemaCreation = {
	/**
	 * Code to be inserted into the file.
	 */
	code: string;
	/**
	 * Path to the file, including the file name and extension.
	 * Relative paths are supported.
	 */
	path: string;
	/**
	 * Append the file if it already exists.
	 * Note: This will not apply if `overwrite` is set to true.
	 */
	append?: boolean | undefined;
	/**
	 * Overwrite the file if it already exists.
	 */
	overwrite?: boolean | undefined;
};

export type Where = {
	operator?:
		| (
				| 'eq'
				| 'ne'
				| 'lt'
				| 'lte'
				| 'gt'
				| 'gte'
				| 'in'
				| 'not_in'
				| 'contains'
				| 'starts_with'
				| 'ends_with'
		  )
		| undefined;
	value: string | number | boolean | string[] | number[] | Date | null;
	field: string;
	connector?: ('AND' | 'OR') | undefined;
};

export type CleanedWhere = Required<Where>;

export interface CustomAdapter {
	create: <T extends Record<string, any>>({
		data,
		model,
		select,
	}: {
		model: string;
		data: T;
		select?: string[] | undefined;
	}) => Promise<T>;
	update: <T>(data: {
		model: string;
		where: CleanedWhere[];
		update: T;
	}) => Promise<T | null>;
	updateMany: (data: {
		model: string;
		where: CleanedWhere[];
		update: Record<string, any>;
	}) => Promise<number>;
	findOne: <T>({
		model,
		where,
		select,
	}: {
		model: string;
		where: CleanedWhere[];
		select?: string[] | undefined;
	}) => Promise<T | null>;
	findMany: <T>({
		model,
		where,
		limit,
		sortBy,
		offset,
	}: {
		model: string;
		where?: CleanedWhere[] | undefined;
		limit: number;
		sortBy?: { field: string; direction: 'asc' | 'desc' } | undefined;
		offset?: number | undefined;
	}) => Promise<T[]>;
	delete: ({
		model,
		where,
	}: {
		model: string;
		where: CleanedWhere[];
	}) => Promise<void>;
	deleteMany: ({
		model,
		where,
	}: {
		model: string;
		where: CleanedWhere[];
	}) => Promise<number>;
	count: ({
		model,
		where,
	}: {
		model: string;
		where?: CleanedWhere[] | undefined;
	}) => Promise<number>;
	createSchema?:
		| ((props: {
				file?: string;
				tables: CorsairDBSchema;
		  }) => Promise<DBAdapterSchemaCreation>)
		| undefined;
	options?: Record<string, any> | undefined;
}

export type DBAdapter<Options = unknown> = {
	id: string;
	create: <T extends Record<string, any>, R = T>(data: {
		model: string;
		data: Omit<T, 'id'>;
		select?: string[] | undefined;
		forceAllowId?: boolean | undefined;
	}) => Promise<R>;
	findOne: <T>(data: {
		model: string;
		where: Where[];
		select?: string[] | undefined;
	}) => Promise<T | null>;
	findMany: <T>(data: {
		model: string;
		where?: Where[] | undefined;
		limit?: number | undefined;
		sortBy?: { field: string; direction: 'asc' | 'desc' } | undefined;
		offset?: number | undefined;
	}) => Promise<T[]>;
	count: (data: {
		model: string;
		where?: Where[] | undefined;
	}) => Promise<number>;
	update: <T>(data: {
		model: string;
		where: Where[];
		update: Record<string, any>;
	}) => Promise<T | null>;
	updateMany: (data: {
		model: string;
		where: Where[];
		update: Record<string, any>;
	}) => Promise<number>;
	delete: <T>(data: { model: string; where: Where[] }) => Promise<void>;
	deleteMany: (data: { model: string; where: Where[] }) => Promise<number>;
	transaction: <R>(
		callback: (trx: Omit<DBAdapter<Options>, 'transaction'>) => Promise<R>,
	) => Promise<R>;
	createSchema?:
		| ((options: Options, file?: string) => Promise<DBAdapterSchemaCreation>)
		| undefined;
	options?:
		| {
				adapterConfig?: Record<string, any>;
		  }
		| undefined;
};

export interface DBAdapterInstance<Options = unknown> {
	(options: Options): DBAdapter<Options>;
}

export type DBAdapterTransformContext<Options = unknown> = {
	data: any;
	fieldAttributes: DBFieldAttribute;
	field: string;
	action: 'create' | 'update';
	model: string;
	schema: CorsairDBSchema;
	options: Options;
};
