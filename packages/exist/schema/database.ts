import { z } from 'zod';

/**
 * Locally stored Exist entities.
 *
 * Exist models everything as an *attribute* (a named daily metric) plus the
 * derived objects it computes from them — averages, correlations and insights.
 * Those four, along with the account profile, are the objects worth keeping
 * locally: they change at most daily, are expensive to page through, and every
 * one of them is looked up by a stable natural key.
 *
 * @see https://developer.exist.io/reference/object_types/
 */

/** The authenticated user, keyed by Exist username. */
export const ExistProfile = z.object({
	id: z.string(),
	username: z.string(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	avatar: z.string().nullable().optional(),
	timezone: z.string().optional(),
	local_time: z.string().optional(),
	imperial_distance: z.boolean().optional(),
	imperial_weight: z.boolean().optional(),
	imperial_energy: z.boolean().optional(),
	imperial_liquid: z.boolean().optional(),
	imperial_temperature: z.boolean().optional(),
	trial: z.boolean().optional(),
	delinquent: z.boolean().optional(),
});

export type ExistProfile = z.infer<typeof ExistProfile>;

/** An attribute definition, keyed by its ASCII `name`. */
export const ExistAttribute = z.object({
	id: z.string(),
	name: z.string(),
	label: z.string().optional(),
	/** Null for custom attributes that are not based on a template. */
	template: z.string().nullable().optional(),
	group_name: z.string().optional(),
	group_label: z.string().optional(),
	/** The service that currently owns the attribute, if any. */
	service_name: z.string().nullable().optional(),
	active: z.boolean().optional(),
	manual: z.boolean().optional(),
	priority: z.number().optional(),
	value_type: z.number().optional(),
	value_type_description: z.string().optional(),
});

export type ExistAttribute = z.infer<typeof ExistAttribute>;

/** One day of one attribute, keyed `<attribute>:<date>`. */
export const ExistAttributeValue = z.object({
	id: z.string(),
	attribute: z.string(),
	date: z.string(),
	/** Typed by the attribute's `value_type`; null on days with no data. */
	value: z.union([z.string(), z.number(), z.boolean()]).nullable().optional(),
});

export type ExistAttributeValue = z.infer<typeof ExistAttributeValue>;

/** A weekly average set for one attribute, keyed `<attribute>:<date>`. */
export const ExistAverage = z.object({
	id: z.string(),
	attribute: z.string(),
	date: z.string(),
	overall: z.number().nullable().optional(),
	monday: z.number().nullable().optional(),
	tuesday: z.number().nullable().optional(),
	wednesday: z.number().nullable().optional(),
	thursday: z.number().nullable().optional(),
	friday: z.number().nullable().optional(),
	saturday: z.number().nullable().optional(),
	sunday: z.number().nullable().optional(),
});

export type ExistAverage = z.infer<typeof ExistAverage>;

/**
 * A correlation between two attributes, keyed
 * `<attribute>:<attribute2>:<date>` — Exist regenerates correlations weekly,
 * so the generation date is part of the identity.
 */
export const ExistCorrelation = z.object({
	id: z.string(),
	attribute: z.string(),
	attribute2: z.string(),
	date: z.string(),
	/** Days of data the correlation was computed over. */
	period: z.number().optional(),
	offset: z.number().optional(),
	/** Pearson coefficient, -1 to +1. */
	value: z.number().optional(),
	p: z.number().optional(),
	percentage: z.number().optional(),
	/** Confidence, 1 to 5. */
	stars: z.number().optional(),
	second_person: z.string().optional(),
	strength_description: z.string().nullable().optional(),
	stars_description: z.string().nullable().optional(),
});

export type ExistCorrelation = z.infer<typeof ExistCorrelation>;

/** A generated insight, keyed `<type name>:<target date>`. */
export const ExistInsight = z.object({
	id: z.string(),
	type_name: z.string(),
	target_date: z.string().nullable().optional(),
	created: z.string().optional(),
	/** The attribute the insight is about, when it concerns one. */
	attribute: z.string().nullable().optional(),
	text: z.string().optional(),
	html: z.string().optional(),
});

export type ExistInsight = z.infer<typeof ExistInsight>;
