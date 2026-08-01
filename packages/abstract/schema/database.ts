import { z } from 'zod';

/**
 * Local storage record for an email validation lookup.
 * Captures the deliverability verdict returned by the Email Validation API.
 */
export const AbstractEmailValidation = z.object({
	email: z.string(),
	autocorrect: z.string().optional(),
	deliverability: z.string(),
	qualityScore: z.number().optional(),
	isValidFormat: z.boolean().optional(),
	isFreeEmail: z.boolean().optional(),
	isDisposableEmail: z.boolean().optional(),
	isRoleEmail: z.boolean().optional(),
	isCatchallEmail: z.boolean().optional(),
	isMxFound: z.boolean().optional(),
	isSmtpValid: z.boolean().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * Local storage record for an email reputation lookup.
 * Captures the quality/risk verdict returned by the Email Reputation API.
 */
export const AbstractEmailReputation = z.object({
	emailAddress: z.string(),
	deliverabilityStatus: z.string(),
	qualityScore: z.number().optional(),
	isFreeEmail: z.boolean().optional(),
	isDisposable: z.boolean().optional(),
	isCatchall: z.boolean().optional(),
	addressRiskStatus: z.string().nullable().optional(),
	domainRiskStatus: z.string().nullable().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * Local storage record for a VAT category rate lookup.
 */
export const AbstractVatCategory = z.object({
	countryCode: z.string(),
	category: z.string(),
	description: z.string().optional(),
	/** Decimal rate as a string, e.g. "0.070" for 7% (as returned by Abstract) */
	rate: z.string(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * Local storage record for an IBAN validation lookup.
 */
export const AbstractIbanValidation = z.object({
	iban: z.string(),
	isValid: z.boolean(),
	checkedAt: z.coerce.date().nullable().optional(),
});

export type AbstractEmailValidation = z.infer<typeof AbstractEmailValidation>;
export type AbstractEmailReputation = z.infer<typeof AbstractEmailReputation>;
export type AbstractVatCategory = z.infer<typeof AbstractVatCategory>;
export type AbstractIbanValidation = z.infer<typeof AbstractIbanValidation>;
