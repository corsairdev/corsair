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
