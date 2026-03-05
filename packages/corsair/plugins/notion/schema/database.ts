import { z } from 'zod';

export const NotionBlock = z.object({
	id: z.string(),
	type: z.string().optional(),
	object: z.string().optional(),
	created_time: z.string().optional(),
	last_edited_time: z.string().optional(),
	archived: z.boolean().optional(),
	has_children: z.boolean().optional(),
	parent_id: z.string().optional(),
	parent_type: z.string().optional(),
	// NOTE: Block content varies by type (paragraph, heading, list, etc.)
	// Using passthrough to allow additional type-specific properties
}).passthrough();

export const NotionDatabase = z.object({
	id: z.string(),
	object: z.string().optional(),
	created_time: z.string().optional(),
	last_edited_time: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	is_inline: z.boolean().optional(),
	archived: z.boolean().optional(),
	url: z.string().optional(),
	// NOTE: Properties are dynamic and depend on database schema
	// Storing as JSON string for database storage
	properties_json: z.string().optional(),
	parent_id: z.string().optional(),
	parent_type: z.string().optional(),
}).passthrough();

export const NotionPage = z.object({
	id: z.string(),
	object: z.string().optional(),
	created_time: z.string().optional(),
	last_edited_time: z.string().optional(),
	archived: z.boolean().optional(),
	is_locked: z.boolean().optional(),
	url: z.string().optional(),
	public_url: z.string().nullable().optional(),
	parent_id: z.string().optional(),
	parent_type: z.string().optional(),
	database_id: z.string().nullable().optional(), // For database pages
	// NOTE: Properties are dynamic and depend on page type
	// Storing as JSON string for database storage
	properties_json: z.string().optional(),
}).passthrough();

export const NotionUser = z.object({
	id: z.string(),
	object: z.string().optional(),
	type: z.enum(['person', 'bot']).optional(),
	name: z.string().nullable().optional(),
	avatar_url: z.string().nullable().optional(),
	// NOTE: Bot users have additional fields
	// Using passthrough to allow additional fields
}).passthrough();

export type NotionBlock = z.infer<typeof NotionBlock>;
export type NotionDatabase = z.infer<typeof NotionDatabase>;
export type NotionPage = z.infer<typeof NotionPage>;
export type NotionUser = z.infer<typeof NotionUser>;
