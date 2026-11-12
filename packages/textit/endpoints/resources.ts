import { z } from 'zod';

// TextIt's references sometimes omit fields in write responses and use null for
// cleared values. Keep documented fields typed while preserving newer fields.
const named = z
	.object({ uuid: z.string().nullish(), name: z.string().nullish() })
	.loose();
const user = z
	.object({ email: z.string().nullish(), name: z.string().nullish() })
	.loose();
const quickReply = z
	.object({
		type: z.string().nullish(),
		text: z.string().nullish(),
		extra: z.string().nullish(),
	})
	.loose();
const translations = z.record(z.string(), z.string());
const dates = {
	created_on: z.string().nullish(),
	modified_on: z.string().nullish(),
};

export const Archive = z
	.object({
		type: z.string().nullish(),
		start_date: z.string().nullish(),
		period: z.string().nullish(),
		record_count: z.number().nullish(),
		size: z.number().nullish(),
		hash: z.string().nullish(),
		download_url: z.string().nullish(),
	})
	.loose();
export const Broadcast = z
	.object({
		uuid: z.string().nullish(),
		urns: z.array(z.string()).nullish(),
		contacts: z.array(named).nullish(),
		groups: z.array(named).nullish(),
		text: translations.nullish(),
		attachments: z.record(z.string(), z.array(z.string())).nullish(),
		quick_replies: z.record(z.string(), z.array(quickReply)).nullish(),
		base_language: z.string().nullish(),
		status: z.string().nullish(),
		...dates,
	})
	.loose();
export const Campaign = z
	.object({
		uuid: z.string().nullish(),
		name: z.string().nullish(),
		archived: z.boolean().nullish(),
		group: named.nullish(),
		...dates,
	})
	.loose();
export const CampaignEvent = z
	.object({
		uuid: z.string().nullish(),
		campaign: named.nullish(),
		relative_to: z
			.object({ key: z.string().nullish(), name: z.string().nullish() })
			.loose()
			.nullish(),
		offset: z.number().nullish(),
		unit: z.string().nullish(),
		delivery_hour: z.number().nullish(),
		message: translations.nullish(),
		flow: named.nullish(),
		...dates,
	})
	.loose();
export const Channel = z
	.object({
		uuid: z.string().nullish(),
		name: z.string().nullish(),
		address: z.string().nullish(),
		type: z.string().nullish(),
		country: z.string().nullish(),
		device: z
			.object({
				name: z.string().nullish(),
				power_level: z.number().nullish(),
				power_status: z.string().nullish(),
				power_source: z.string().nullish(),
				network_type: z.string().nullish(),
			})
			.loose()
			.nullish(),
		last_seen: z.string().nullish(),
		...dates,
	})
	.loose();
export const Contact = z
	.object({
		uuid: z.string().nullish(),
		name: z.string().nullish(),
		status: z.string().nullish(),
		language: z.string().nullish(),
		urns: z.array(z.string()).nullish(),
		email: z.string().nullish(),
		email_verified_on: z.string().nullish(),
		groups: z.array(named).nullish(),
		// Contact custom-field values are defined by the workspace, so no fixed value schema applies.
		fields: z.record(z.string(), z.unknown()).nullish(),
		flow: named.nullish(),
		last_seen_on: z.string().nullish(),
		...dates,
	})
	.loose();
export const Field = z
	.object({
		key: z.string().nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
	})
	.loose();
export const FlowStart = z
	.object({
		uuid: z.string().nullish(),
		flow: named.nullish(),
		contacts: z.array(named).nullish(),
		groups: z.array(named).nullish(),
		status: z.string().nullish(),
		// Flow parameters are user-defined JSON, so no fixed value schema applies.
		params: z.record(z.string(), z.unknown()).nullish(),
		...dates,
	})
	.loose();
export const Flow = z
	.object({
		uuid: z.string().nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		archived: z.boolean().nullish(),
		labels: z.array(named).nullish(),
		expires: z.number().nullish(),
		runs: z
			.object({
				active: z.number().nullish(),
				completed: z.number().nullish(),
				interrupted: z.number().nullish(),
				expired: z.number().nullish(),
			})
			.loose()
			.nullish(),
		results: z
			.array(
				z
					.object({
						key: z.string().nullish(),
						name: z.string().nullish(),
						categories: z.array(z.string()).nullish(),
						node_uuids: z.array(z.string()).nullish(),
					})
					.loose(),
			)
			.nullish(),
		parent_refs: z.array(z.string()).nullish(),
		...dates,
	})
	.loose();
export const Global = z
	.object({
		key: z.string().nullish(),
		name: z.string().nullish(),
		value: z.string().nullish(),
		...dates,
	})
	.loose();
export const Group = z
	.object({
		uuid: z.string().nullish(),
		name: z.string().nullish(),
		query: z.string().nullish(),
		status: z.string().nullish(),
		system: z.boolean().nullish(),
		count: z.number().nullish(),
	})
	.loose();
export const Label = z
	.object({
		uuid: z.string().nullish(),
		name: z.string().nullish(),
		count: z.number().nullish(),
	})
	.loose();
export const Media = z
	.object({
		uuid: z.string(),
		content_type: z.string(),
		url: z.string(),
		filename: z.string(),
		size: z.number(),
	})
	.loose();
export const Message = z
	.object({
		uuid: z.string().nullish(),
		contact: named.nullish(),
		urn: z.string().nullish(),
		channel: named.nullish(),
		direction: z.string().nullish(),
		type: z.string().nullish(),
		status: z.string().nullish(),
		visibility: z.string().nullish(),
		text: z.string().nullish(),
		attachments: z
			.array(
				z
					.object({
						content_type: z.string().nullish(),
						url: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		quick_replies: z.array(quickReply).nullish(),
		labels: z.array(named).nullish(),
		flow: named.nullish(),
		sent_on: z.string().nullish(),
		...dates,
	})
	.loose();
const runValue = z
	.object({
		name: z.string().nullish(),
		value: z.string().nullish(),
		category: z.string().nullish(),
		node: z.string().nullish(),
		time: z.string().nullish(),
	})
	.loose();
export const Run = z
	.object({
		uuid: z.string().nullish(),
		flow: named.nullish(),
		contact: named.nullish(),
		start: named.nullish(),
		responded: z.boolean().nullish(),
		// The prose calls values an array; its example is a dictionary keyed by result.
		values: z
			.union([z.record(z.string(), runValue), z.array(runValue)])
			.nullish(),
		exited_on: z.string().nullish(),
		exit_type: z.string().nullish(),
		...dates,
	})
	.loose();
export const Resthook = z
	.object({ resthook: z.string().nullish(), ...dates })
	.loose();
export const ResthookEvent = z
	.object({
		resthook: z.string().nullish(),
		// Event data is defined by the workspace's flow and resthook, not a fixed provider schema.
		data: z.record(z.string(), z.unknown()).nullish(),
		...dates,
	})
	.loose();
// TextIt's subscriber docs describe an integer but show strings in examples.
export const ResthookSubscriber = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		resthook: z.string().nullish(),
		target_url: z.string().nullish(),
		...dates,
	})
	.loose();
export const Ticket = z
	.object({
		uuid: z.string().nullish(),
		contact: named.nullish(),
		status: z.string().nullish(),
		topic: named.nullish(),
		assignee: user.nullish(),
		opened_on: z.string().nullish(),
		opened_by: user.nullish(),
		opened_in: named.nullish(),
		closed_on: z.string().nullish(),
		...dates,
	})
	.loose();
export const Topic = z
	.object({
		uuid: z.string().nullish(),
		name: z.string().nullish(),
		counts: z
			.object({ open: z.number().nullish(), closed: z.number().nullish() })
			.loose()
			.nullish(),
		system: z.boolean().nullish(),
		...dates,
	})
	.loose();
export const User = z
	.object({
		uuid: z.string().nullish(),
		avatar: z.string().nullish(),
		email: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		role: z.string().nullish(),
		team: named.nullish(),
		...dates,
	})
	.loose();
export const Workspace = z
	.object({
		uuid: z.string().nullish(),
		name: z.string().nullish(),
		country: z.string().nullish(),
		languages: z.array(z.string()).nullish(),
		timezone: z.string().nullish(),
		date_style: z.string().nullish(),
		anon: z.boolean().nullish(),
	})
	.loose();

export function page<T extends z.ZodType>(resource: T) {
	return z
		.object({
			next: z.string().nullable(),
			previous: z.string().nullable(),
			results: z.array(resource),
			count: z.number().optional(),
		})
		.loose();
}
