import { z } from 'zod';

export const PagerdutyIncident = z.object({
	id: z.string(),
	incident_number: z.number().optional(),
	title: z.string().optional(),
	status: z.enum(['triggered', 'acknowledged', 'resolved']).optional(),
	urgency: z.enum(['high', 'low']).optional(),
	html_url: z.string().nullable().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
	resolved_at: z.coerce.date().nullable().optional(),
	service: z
		.object({
			id: z.string(),
			type: z.string(),
			summary: z.string().optional(),
			html_url: z.string().nullable().optional(),
		})
		.optional(),
	assigned_to: z
		.array(
			z.object({
				at: z.string(),
				object: z.object({
					id: z.string(),
					type: z.string(),
					summary: z.string().optional(),
				}),
			}),
		)
		.optional(),
	escalation_policy: z
		.object({
			id: z.string(),
			type: z.string(),
			summary: z.string().optional(),
		})
		.optional(),
	teams: z
		.array(
			z.object({
				id: z.string(),
				type: z.string(),
				summary: z.string().optional(),
			}),
		)
		.optional(),
});

export type PagerdutyIncident = z.infer<typeof PagerdutyIncident>;
