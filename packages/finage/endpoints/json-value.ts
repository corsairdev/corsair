import { z } from 'zod';

export type FinageJsonValue =
	| string
	| number
	| boolean
	| null
	| FinageJsonValue[]
	| { [key: string]: FinageJsonValue };

export const finageJsonValue: z.ZodType<FinageJsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(finageJsonValue),
		z.record(z.string(), finageJsonValue),
	]),
);

// Output primitives. Finage leaves values it does not have as null or blank, so
// a response field accepts both instead of failing the whole response. A field
// that is missing altogether still fails. Inputs keep their own strict types.
export const outText = z.string().nullable();
export const outNumber = z.number().nullable();
export const outBoolean = z.boolean().nullable();
export const outArray = <T extends z.ZodType>(item: T) =>
	z.array(item).nullable();
