import { z } from 'zod';

export const AmplitudeEvent = z.object({
	id: z.string(),
	event_type: z.string(),
	user_id: z.string().optional(),
	device_id: z.string().optional(),
	time: z.number().optional(),
	// Amplitude event properties are open-ended key-value pairs
	event_properties: z.record(z.string(), z.unknown()).optional(),
	// User properties are open-ended key-value pairs
	user_properties: z.record(z.string(), z.unknown()).optional(),
	app_version: z.string().optional(),
	platform: z.string().optional(),
	os_name: z.string().optional(),
	os_version: z.string().optional(),
	device_brand: z.string().optional(),
	device_manufacturer: z.string().optional(),
	device_model: z.string().optional(),
	carrier: z.string().optional(),
	country: z.string().optional(),
	region: z.string().optional(),
	city: z.string().optional(),
	dma: z.string().optional(),
	language: z.string().optional(),
	ip: z.string().optional(),
	insert_id: z.string().optional(),
	session_id: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const AmplitudeUser = z.object({
	id: z.string(),
	user_id: z.string().optional(),
	// User properties are open-ended key-value pairs
	user_properties: z.record(z.string(), z.unknown()).optional(),
	canonical_amplitude_id: z.number().optional(),
	last_seen: z.number().optional(),
	is_identified: z.boolean().optional(),
	country: z.string().optional(),
	region: z.string().optional(),
	city: z.string().optional(),
	language: z.string().optional(),
	platform: z.string().optional(),
	os: z.string().optional(),
	device: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const AmplitudeCohort = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	app_id: z.number().optional(),
	owners: z.array(z.string()).optional(),
	published: z.boolean().optional(),
	archived: z.boolean().optional(),
	size: z.number().optional(),
	last_computed: z.number().optional(),
	last_modified: z.number().optional(),
	is_predefined: z.boolean().optional(),
	type: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type AmplitudeEvent = z.infer<typeof AmplitudeEvent>;
export type AmplitudeUser = z.infer<typeof AmplitudeUser>;
export type AmplitudeCohort = z.infer<typeof AmplitudeCohort>;
