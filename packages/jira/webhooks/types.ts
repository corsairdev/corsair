import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import crypto from 'crypto';
import { z } from 'zod';

// ── Shared sub-schemas ────────────────────────────────────────────────────────

const JiraWebhookUserSchema = z.object({
	accountId: z.string().optional(),
	displayName: z.string().optional(),
	emailAddress: z.string().optional(),
});

const JiraWebhookStatusSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	statusCategory: z
		.object({
			key: z.string().optional(),
			name: z.string().optional(),
		})
		.optional(),
});

const JiraWebhookPrioritySchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
});

const JiraWebhookIssueTypeSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	subtask: z.boolean().optional(),
});

const JiraWebhookProjectSchema = z.object({
	id: z.string().optional(),
	key: z.string().optional(),
	name: z.string().optional(),
});

// ── Base payload ──────────────────────────────────────────────────────────────

export interface JiraWebhookPayload {
	webhookEvent: string;
	timestamp?: number;
}

// ── New Issue event ───────────────────────────────────────────────────────────

export const NewIssueEventSchema = z.object({
	webhookEvent: z.literal('jira:issue_created'),
	timestamp: z.number().optional(),
	issue: z
		.object({
			id: z.string().optional(),
			key: z.string().optional(),
			self: z.string().optional(),
			fields: z
				.object({
					summary: z.string().optional(),
					status: JiraWebhookStatusSchema.optional(),
					assignee: JiraWebhookUserSchema.nullable().optional(),
					reporter: JiraWebhookUserSchema.optional(),
					priority: JiraWebhookPrioritySchema.nullable().optional(),
					issuetype: JiraWebhookIssueTypeSchema.optional(),
					project: JiraWebhookProjectSchema.optional(),
					labels: z.array(z.string()).optional(),
					created: z.string().optional(),
					updated: z.string().optional(),
				})
				.optional(),
		})
		.optional(),
	user: JiraWebhookUserSchema.optional(),
});
export type NewIssueEvent = z.infer<typeof NewIssueEventSchema>;

// ── Updated Issue event ───────────────────────────────────────────────────────

export const UpdatedIssueEventSchema = z.object({
	webhookEvent: z.literal('jira:issue_updated'),
	timestamp: z.number().optional(),
	issue: z
		.object({
			id: z.string().optional(),
			key: z.string().optional(),
			self: z.string().optional(),
			fields: z
				.object({
					summary: z.string().optional(),
					status: JiraWebhookStatusSchema.optional(),
					assignee: JiraWebhookUserSchema.nullable().optional(),
					reporter: JiraWebhookUserSchema.optional(),
					priority: JiraWebhookPrioritySchema.nullable().optional(),
					issuetype: JiraWebhookIssueTypeSchema.optional(),
					project: JiraWebhookProjectSchema.optional(),
					labels: z.array(z.string()).optional(),
					updated: z.string().optional(),
				})
				.optional(),
		})
		.optional(),
	user: JiraWebhookUserSchema.optional(),
	changelog: z
		.object({
			id: z.string().optional(),
			items: z
				.array(
					z.object({
						field: z.string().optional(),
						fieldtype: z.string().optional(),
						from: z.string().nullable().optional(),
						fromString: z.string().nullable().optional(),
						to: z.string().nullable().optional(),
						toString: z.string().nullable().optional(),
					}),
				)
				.optional(),
		})
		.optional(),
});
export type UpdatedIssueEvent = z.infer<typeof UpdatedIssueEventSchema>;

// ── New Project event ─────────────────────────────────────────────────────────

export const NewProjectEventSchema = z.object({
	webhookEvent: z.literal('project_created'),
	timestamp: z.number().optional(),
	project: z
		.object({
			id: z.string().optional(),
			key: z.string().optional(),
			name: z.string().optional(),
			description: z.string().optional(),
			projectTypeKey: z.string().optional(),
			lead: JiraWebhookUserSchema.optional(),
			self: z.string().optional(),
		})
		.optional(),
});
export type NewProjectEvent = z.infer<typeof NewProjectEventSchema>;

// ── Webhook payload wrappers (for schema validation in plugin) ────────────────

export const JiraNewIssuePayloadSchema = NewIssueEventSchema;
export const JiraUpdatedIssuePayloadSchema = UpdatedIssueEventSchema;
export const JiraNewProjectPayloadSchema = NewProjectEventSchema;

// ── Webhook Outputs Map ───────────────────────────────────────────────────────

export type JiraWebhookOutputs = {
	newIssue: NewIssueEvent;
	updatedIssue: UpdatedIssueEvent;
	newProject: NewProjectEvent;
};

// ── Matcher helper ────────────────────────────────────────────────────────────

// unknown: raw webhook body may arrive as a pre-parsed object or a JSON string; type is resolved after parsing
function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function createJiraMatch(webhookEvent: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// Type assertion: parseBody returns unknown; asserting to Record to access webhookEvent field
		const body = parseBody(request.body) as Record<string, unknown>;
		return body.webhookEvent === webhookEvent;
	};
}

// ── Signature verification ────────────────────────────────────────────────────

/**
 * Verifies a Jira webhook signature using HMAC SHA256.
 * Jira sends the signature in the 'x-hub-signature' header as 'sha256={hash}'.
 */

export function verifyJiraWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	const headers = request.headers;
	// Type assertion: headers value is string | string[] | undefined; we only want the string value
	const signatureHeader = Array.isArray(headers['x-hub-signature'])
		? headers['x-hub-signature'][0]
		: (headers['x-hub-signature'] as string | undefined);

	if (!signatureHeader) {
		// Only allow unsigned requests when no secret has been configured
		if (!secret) {
			return { valid: true };
		}
		return { valid: false, error: 'Missing x-hub-signature header' };
	}

	const rawBody = request.rawBody ?? JSON.stringify(request.payload);
	const expectedHash = crypto
		.createHmac('sha256', secret)
		.update(rawBody)
		.digest('hex');
	const expectedSignature = `sha256=${expectedHash}`;

	const sigBuffer = Buffer.from(signatureHeader);
	const expectedBuffer = Buffer.from(expectedSignature);

	if (sigBuffer.length !== expectedBuffer.length) {
		return { valid: false, error: 'Signature length mismatch' };
	}

	const isValid = crypto.timingSafeEqual(sigBuffer, expectedBuffer);
	return { valid: isValid, error: isValid ? undefined : 'Invalid signature' };
}
