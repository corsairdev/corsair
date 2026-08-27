import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Input Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AgentsCreateInputSchema = z
	.object({
		type: z.enum(['outbound', 'inbound', 'widget']),
		name: z.string(),
		agent: z
			.object({
				prompt: z.string(),
				greeting_message: z.string(),
				llm: z.string(),
				language: z.string(),
				voice_id: z.string(),
			})
			.passthrough(),
		description: z.string().optional(),
		phone_number: z.string().optional(),
		external_webhook_url: z.string().optional(),
		is_recording: z.boolean().optional(),
	})
	.passthrough();

export const AgentsListInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.optional();

export const CallsCreateInputSchema = z
	.object({
		model_id: z.string(),
		phone: z.string(),
		name: z.string(),
		from_phone_number: z.string().optional(),
		custom_variables: z
			.union([
				z.array(
					z.object({
						key: z.string(),
						value: z.string(),
					}),
				),
				z.record(z.string(), z.unknown()),
			])
			.optional(),
		lead_email: z.string().optional(),
		lead_timezone: z.string().optional(),
		prompt: z.string().optional(),
		greeting: z.string().optional(),
	})
	.passthrough();

export const CallsListInputSchema = z
	.object({
		model_id: z.string(),
		limit: z.number().optional(),
		offset: z.number().optional(),
		from_date: z.number().optional(),
		to_date: z.number().optional(),
		call_status: z.string().optional(),
		duration_min: z.number().optional(),
		duration_max: z.number().optional(),
		lead_phone_number: z.string().optional(),
	})
	.passthrough();

export const ContactsCreateInputSchema = z
	.object({
		name: z.string(),
		phone_number: z.string(),
		email: z.string().optional(),
		contact_metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export const KnowledgeBasesAttachInputSchema = z
	.object({
		knowledge_base_id: z.string(),
		model_id: z.string(),
	})
	.passthrough();

export const SynthflowEndpointInputSchemas = {
	agentsCreate: AgentsCreateInputSchema,
	agentsList: AgentsListInputSchema,
	callsCreate: CallsCreateInputSchema,
	callsList: CallsListInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	knowledgeBasesAttach: KnowledgeBasesAttachInputSchema,
} as const;

export type SynthflowEndpointInputs = {
	[K in keyof typeof SynthflowEndpointInputSchemas]: z.infer<
		(typeof SynthflowEndpointInputSchemas)[K]
	>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Output Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AgentsCreateResponseSchema = z
	.object({
		status: z.string().optional(),
		response: z
			.object({
				model_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		details: z
			.object({
				phone: z.string().optional(),
				voice: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const AgentsListResponseSchema = z
	.object({
		status: z.string().optional(),
		response: z
			.object({
				pagination: z
					.object({
						total_records: z.number().optional(),
						limit: z.number().optional(),
						offset: z.number().optional(),
					})
					.passthrough()
					.optional(),
				assistants: z
					.union([
						z.array(z.record(z.string(), z.unknown())),
						z.record(z.string(), z.unknown()),
					])
					.optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const CallsCreateResponseSchema = z
	.object({
		status: z.string().optional(),
		response: z
			.object({
				answer: z.string().optional(),
				call_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		eta: z.string().optional(),
	})
	.passthrough();

export const CallsListResponseSchema = z
	.object({
		status: z.string().optional(),
		response: z
			.object({
				pagination: z.record(z.string(), z.unknown()).optional(),
				calls: z.array(z.record(z.string(), z.unknown())).optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const ContactsCreateResponseSchema = z
	.object({
		status: z.string().optional(),
		response: z
			.object({
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const KnowledgeBasesAttachResponseSchema = z
	.object({
		status: z.string().optional(),
		response: z
			.object({
				body: z.unknown().optional(),
				knowledge_base_id: z.string().optional(),
				model_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const SynthflowEndpointOutputSchemas = {
	agentsCreate: AgentsCreateResponseSchema,
	agentsList: AgentsListResponseSchema,
	callsCreate: CallsCreateResponseSchema,
	callsList: CallsListResponseSchema,
	contactsCreate: ContactsCreateResponseSchema,
	knowledgeBasesAttach: KnowledgeBasesAttachResponseSchema,
} as const;

export type SynthflowEndpointOutputs = {
	[K in keyof typeof SynthflowEndpointOutputSchemas]: z.infer<
		(typeof SynthflowEndpointOutputSchemas)[K]
	>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Type Aliases
// ─────────────────────────────────────────────────────────────────────────────

export type AgentsCreateInput = z.infer<typeof AgentsCreateInputSchema>;
export type AgentsCreateResponse = z.infer<typeof AgentsCreateResponseSchema>;
export type AgentsListInput = z.infer<typeof AgentsListInputSchema>;
export type AgentsListResponse = z.infer<typeof AgentsListResponseSchema>;
export type CallsCreateInput = z.infer<typeof CallsCreateInputSchema>;
export type CallsCreateResponse = z.infer<typeof CallsCreateResponseSchema>;
export type CallsListInput = z.infer<typeof CallsListInputSchema>;
export type CallsListResponse = z.infer<typeof CallsListResponseSchema>;
export type ContactsCreateInput = z.infer<typeof ContactsCreateInputSchema>;
export type ContactsCreateResponse = z.infer<
	typeof ContactsCreateResponseSchema
>;
export type KnowledgeBasesAttachInput = z.infer<
	typeof KnowledgeBasesAttachInputSchema
>;
export type KnowledgeBasesAttachResponse = z.infer<
	typeof KnowledgeBasesAttachResponseSchema
>;
