import { timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

// ── Shared call sub-schema ────────────────────────────────────────────────────
// Nested call fields (messages, artifact, analysis, phoneNumber, customer, node,
// toolWithToolCallList) are opaque Vapi-defined objects whose exact shapes vary
// by provider and call configuration; z.record(z.unknown()) avoids re-implementing
// the full Vapi OpenAPI spec here.

export const VapiCallSchema = z
	.object({
		id: z.string(),
		orgId: z.string().optional(),
		type: z.string().optional(),
		status: z.string().optional(),
		endedReason: z.string().nullable().optional(),
		assistantId: z.string().nullable().optional(),
		phoneNumberId: z.string().nullable().optional(),
		startedAt: z.string().nullable().optional(),
		endedAt: z.string().nullable().optional(),
		cost: z.number().optional(),
		messages: z.array(z.record(z.unknown())).optional(),
		artifact: z.record(z.unknown()).optional(),
		analysis: z.record(z.unknown()).optional(),
	})
	.passthrough();

// ── Server message schemas ────────────────────────────────────────────────────

export const VapiAssistantRequestEventSchema = z.object({
	message: z.object({
		type: z.literal('assistant-request'),
		call: VapiCallSchema,
		phoneNumber: z.record(z.unknown()).optional(),
		customer: z.record(z.unknown()).optional(),
		timestamp: z.string().optional(),
	}),
});
export type VapiAssistantRequestEvent = z.infer<
	typeof VapiAssistantRequestEventSchema
>;

export const VapiToolCallsEventSchema = z.object({
	message: z.object({
		type: z.literal('tool-calls'),
		call: VapiCallSchema,
		toolCallList: z.array(
			z.object({
				id: z.string(),
				type: z.literal('function'),
				function: z.object({
					name: z.string(),
					arguments: z.string(),
				}),
			}),
		),
		toolWithToolCallList: z.array(z.record(z.unknown())).optional(),
		timestamp: z.string().optional(),
	}),
});
export type VapiToolCallsEvent = z.infer<typeof VapiToolCallsEventSchema>;

export const VapiTransferDestinationRequestEventSchema = z.object({
	message: z.object({
		type: z.literal('transfer-destination-request'),
		call: VapiCallSchema,
		timestamp: z.string().optional(),
	}),
});
export type VapiTransferDestinationRequestEvent = z.infer<
	typeof VapiTransferDestinationRequestEventSchema
>;

export const VapiEndOfCallReportEventSchema = z.object({
	message: z.object({
		type: z.literal('end-of-call-report'),
		call: VapiCallSchema,
		endedReason: z.string().optional(),
		transcript: z.string().optional(),
		summary: z.string().optional(),
		messages: z.array(z.record(z.unknown())).optional(),
		analysis: z.record(z.unknown()).optional(),
		artifact: z.record(z.unknown()).optional(),
		timestamp: z.string().optional(),
	}),
});
export type VapiEndOfCallReportEvent = z.infer<
	typeof VapiEndOfCallReportEventSchema
>;

export const VapiStatusUpdateEventSchema = z.object({
	message: z.object({
		type: z.literal('status-update'),
		call: VapiCallSchema,
		status: z.string(),
		timestamp: z.string().optional(),
	}),
});
export type VapiStatusUpdateEvent = z.infer<typeof VapiStatusUpdateEventSchema>;

// ── Client message schemas ────────────────────────────────────────────────────

export const VapiWorkflowNodeStartedEventSchema = z.object({
	message: z.object({
		type: z.literal('workflow.node.started'),
		call: VapiCallSchema,
		node: z.record(z.unknown()).optional(),
		timestamp: z.string().optional(),
	}),
});
export type VapiWorkflowNodeStartedEvent = z.infer<
	typeof VapiWorkflowNodeStartedEventSchema
>;

// ── Webhook output map ────────────────────────────────────────────────────────

export type VapiWebhookOutputs = {
	assistantRequest: VapiAssistantRequestEvent;
	toolCalls: VapiToolCallsEvent;
	transferDestinationRequest: VapiTransferDestinationRequestEvent;
	endOfCallReport: VapiEndOfCallReportEvent;
	statusUpdate: VapiStatusUpdateEvent;
	workflowNodeStarted: VapiWorkflowNodeStartedEvent;
};

// ── Utilities ─────────────────────────────────────────────────────────────────

function parseBody(body: unknown): Record<string, unknown> {
	if (typeof body === 'string') {
		try {
			return JSON.parse(body) as Record<string, unknown>;
		} catch {
			return {};
		}
	}
	return (body ?? {}) as Record<string, unknown>;
}

export function createVapiMessageMatch(
	messageType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsed = parseBody(request.body);
		const message = parsed.message as Record<string, unknown> | undefined;
		return typeof message?.type === 'string' && message.type === messageType;
	};
}

export function verifyVapiWebhookSecret(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}
	const headers = request.headers;
	const incomingSecret = Array.isArray(headers['x-vapi-secret'])
		? headers['x-vapi-secret'][0]
		: headers['x-vapi-secret'];

	if (!incomingSecret) {
		return { valid: false, error: 'Missing x-vapi-secret header' };
	}
	const a = Buffer.from(incomingSecret);
	const b = Buffer.from(secret);
	if (a.length !== b.length || !timingSafeEqual(a, b)) {
		return { valid: false, error: 'Invalid webhook secret' };
	}
	return { valid: true };
}
