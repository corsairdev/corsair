import { z } from 'zod';

export const AddresszenAutocompleteResult = z.object({
	query: z.string(),
	// Suggestion objects vary between US and UK response formats.
	hits: z.array(z.record(z.string(), z.unknown())),
	code: z.number().optional(),
	message: z.string().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const AddresszenVerifiedAddress = z.object({
	query: z.string(),
	city: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	zipCode: z.string().nullable().optional(),
	context: z.string().nullable().optional(),
	// Stored verify payload mirrors the API result object, which varies by match type.
	result: z.record(z.string(), z.unknown()),
	code: z.number().optional(),
	message: z.string().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const AddresszenKeyAvailability = z.object({
	available: z.boolean(),
	context: z.string().nullable().optional(),
	code: z.number().optional(),
	message: z.string().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const AddresszenResolvedAddress = z.object({
	addressId: z.string(),
	// Full US-format resolve payload; field set varies by dataset.
	address: z.record(z.string(), z.unknown()),
	code: z.number().optional(),
	message: z.string().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export type AddresszenAutocompleteResult = z.infer<
	typeof AddresszenAutocompleteResult
>;
export type AddresszenVerifiedAddress = z.infer<
	typeof AddresszenVerifiedAddress
>;
export type AddresszenKeyAvailability = z.infer<
	typeof AddresszenKeyAvailability
>;
export type AddresszenResolvedAddress = z.infer<
	typeof AddresszenResolvedAddress
>;
