import { z } from 'zod';

export const safeDateSchema = z.preprocess((arg) => {
	if (arg === undefined) return undefined;
	if (arg === null) return null;
	if (
		typeof arg === 'string' ||
		typeof arg === 'number' ||
		arg instanceof Date
	) {
		const d = new Date(arg);
		return !Number.isNaN(d.getTime()) ? d : arg;
	}
	return arg;
}, z.date().nullable().optional());

export const BartStation = z.object({
	id: z.string(),
	name: z.string(),
	abbr: z.string(),
	gtfs_latitude: z.string().optional(),
	gtfs_longitude: z.string().optional(),
	address: z.string().optional(),
	city: z.string().optional(),
	county: z.string().optional(),
	state: z.string().optional(),
	zipcode: z.string().optional(),
	createdAt: safeDateSchema,
	updatedAt: safeDateSchema,
});
export type BartStation = z.infer<typeof BartStation>;

export const BartRoute = z.object({
	id: z.string(),
	routeID: z.string(),
	number: z.string(),
	name: z.string(),
	abbr: z.string().optional(),
	origin: z.string().optional(),
	destination: z.string().optional(),
	color: z.string().optional(),
	hexcolor: z.string().optional(),
	holidays: z.string().optional(),
	numStns: z.string().optional(),
	createdAt: safeDateSchema,
	updatedAt: safeDateSchema,
});
export type BartRoute = z.infer<typeof BartRoute>;

export const BartAdvisory = z.object({
	id: z.string(),
	station: z.string().optional(),
	type: z.string().optional(),
	description: z.string().optional(),
	sms_text: z.string().optional(),
	posted: safeDateSchema,
	expires: safeDateSchema,
	createdAt: safeDateSchema,
	updatedAt: safeDateSchema,
});
export type BartAdvisory = z.infer<typeof BartAdvisory>;
