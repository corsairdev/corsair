export type Primitive =
	| string
	| number
	| symbol
	| bigint
	| boolean
	| null
	| undefined;

export type Awaitable<T> = Promise<T> | T;

export type Prettify<T> = Omit<T, never>;

export type PrettifyDeep<T> = {
	[K in keyof T]: T[K] extends (...args: any[]) => any
		? T[K]
		: T[K] extends object
			? T[K] extends Array<any>
				? T[K]
				: T[K] extends Date
					? T[K]
					: PrettifyDeep<T[K]>
			: T[K];
} & {};

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type UnionToIntersection<U> = (
	U extends any
		? (k: U) => void
		: never
) extends (k: infer I) => void
	? I
	: never;

export type StripEmptyObjects<T> = T extends { [K in keyof T]: never }
	? never
	: T extends object
		? { [K in keyof T as T[K] extends never ? never : K]: T[K] }
		: T;
