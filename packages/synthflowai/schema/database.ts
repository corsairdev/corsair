import { z } from 'zod';

/**
 * Synthflow Platform API v2 assistant (agent).
 * Official: GET /v2/assistants/{model_id}
 * https://docs.synthflow.ai/api-reference/platform-api/agents/get-assistant
 */
export const SynthflowAiAssistant = z
	.object({
		model_id: z.string().optional(),
		name: z.string().optional(),
		type: z.string().optional(),
		description: z.string().optional(),
		phone_number: z.string().optional(),
	})
	.loose();

export type SynthflowAiAssistant = z.infer<typeof SynthflowAiAssistant>;

/**
 * Synthflow Platform API v2 call log row.
 * Official: GET /v2/calls
 * https://docs.synthflow.ai/api-reference/platform-api/calls/list-calls
 */
export const SynthflowAiCall = z
	.object({
		call_id: z.string().optional(),
		model_id: z.string().optional(),
		call_status: z.string().optional(),
		lead_phone_number: z.string().optional(),
		duration: z.number().optional(),
	})
	.loose();

export type SynthflowAiCall = z.infer<typeof SynthflowAiCall>;

/**
 * Synthflow Platform API v2 contact.
 * Official: POST /v2/contacts
 * https://docs.synthflow.ai/api-reference/platform-api/contacts/create-a-contact
 */
export const SynthflowAiContact = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		phone_number: z.string().optional(),
		email: z.string().optional(),
		company: z.string().optional(),
	})
	.loose();

export type SynthflowAiContact = z.infer<typeof SynthflowAiContact>;

/**
 * Synthflow Platform API v2 knowledge base.
 * Official: POST /v2/knowledge_base
 * https://docs.synthflow.ai/api-reference/platform-api/knowledge-bases/create-knowledge-base
 */
export const SynthflowAiKnowledgeBase = z
	.object({
		id: z.string().optional(),
		knowledge_base_id: z.string().optional(),
		name: z.string().optional(),
		rag_use_condition: z.string().optional(),
	})
	.loose();

export type SynthflowAiKnowledgeBase = z.infer<typeof SynthflowAiKnowledgeBase>;

/**
 * Synthflow Platform API v2 memory store.
 * Official: PATCH /v2/memory_stores/{memory_store_id}
 * https://docs.synthflow.ai/api-reference/platform-api/memory-stores/update-a-memory-store
 */
export const SynthflowAiMemoryStore = z
	.object({
		id: z.string().optional(),
		title: z.string().optional(),
		description: z.string().optional(),
	})
	.loose();

export type SynthflowAiMemoryStore = z.infer<typeof SynthflowAiMemoryStore>;

/**
 * Synthflow Platform API v2 phone book.
 * Official: GET /v2/phonebooks
 * https://docs.synthflow.ai/api-reference/platform-api/phone-books/list-phone-books
 */
export const SynthflowAiPhoneBook = z
	.object({
		phone_book_id: z.string().optional(),
		name: z.string().optional(),
		workspace_id: z.string().optional(),
		entry_count: z.number().optional(),
	})
	.loose();

export type SynthflowAiPhoneBook = z.infer<typeof SynthflowAiPhoneBook>;

/**
 * Synthflow Platform API v2 action metadata.
 * Official: GET /v2/actions/{action_id}
 * https://docs.synthflow.ai/api-reference/platform-api/actions/get-action
 */
export const SynthflowAiAction = z
	.object({
		action_id: z.string().optional(),
		id: z.string().optional(),
		name: z.string().optional(),
	})
	.loose();

export type SynthflowAiAction = z.infer<typeof SynthflowAiAction>;

/**
 * Synthflow Platform API v2 TTS voice.
 * Official: GET /v2/voices
 * https://docs.synthflow.ai/api-reference/platform-api/voices/get-voices
 */
export const SynthflowAiVoice = z
	.object({
		voice_id: z.string().optional(),
		name: z.string().optional(),
		workspace: z.string().optional(),
		provider: z.enum(['elevenlabs', 'deepgram', 'synthflow']).optional(),
	})
	.loose();

export type SynthflowAiVoice = z.infer<typeof SynthflowAiVoice>;
