import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

/**
 * Salesforce Change Data Capture / Flow HTTP payload.
 * Official CDC: https://developer.salesforce.com/docs/atlas.en-us.change_data_capture.meta/change_data_capture/cdc_message_structure.htm
 */
export const SalesforceChangeEventHeaderSchema = z
	.object({
		entityName: z.string().optional(),
		changeType: z.string().optional(),
		recordIds: z.array(z.string()).optional(),
		commitTimestamp: z.number().optional(),
		commitUser: z.string().optional(),
	})
	.loose();

export const SalesforceWebhookPayloadSchema = z
	.object({
		ChangeEventHeader: SalesforceChangeEventHeaderSchema.optional(),
		Id: z.string().optional(),
		id: z.string().optional(),
		sobject: z.string().optional(),
		type: z.string().optional(),
		Status: z.string().optional(),
		LastModifiedDate: z.string().optional(),
		SystemModstamp: z.string().optional(),
		organization_id: z.string().optional(),
	})
	.loose();

export type SalesforceWebhookPayload = z.infer<
	typeof SalesforceWebhookPayloadSchema
>;

export type SalesforceWebhookOutputs = {
	accountCreatedOrUpdated: { success: boolean };
	contactUpdated: { success: boolean };
	newContact: { success: boolean };
	newLead: { success: boolean };
	newOrUpdatedOpportunity: { success: boolean };
	genericSObjectRecordUpdated: { success: boolean };
	taskCreatedOrCompleted: { success: boolean };
};

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		} catch {
			return null;
		}
	}
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
}

function headerOf(body: Record<string, unknown>) {
	const header = body.ChangeEventHeader;
	if (header && typeof header === 'object' && !Array.isArray(header)) {
		return header as Record<string, unknown>;
	}
	return undefined;
}

function entityNameOf(body: Record<string, unknown>): string | undefined {
	const header = headerOf(body);
	if (typeof header?.entityName === 'string') return header.entityName;
	if (typeof body.sobject === 'string') return body.sobject;
	return undefined;
}

function changeTypeOf(body: Record<string, unknown>): string | undefined {
	const header = headerOf(body);
	if (typeof header?.changeType === 'string') return header.changeType;
	if (typeof body.type === 'string') return body.type;
	return undefined;
}

export function createSalesforceChangeMatch(options: {
	entityName?: string;
	changeTypes: string[];
	status?: string;
}): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const body = parseBody(request.body);
		if (!body) return false;
		const entity = entityNameOf(body);
		const change = (changeTypeOf(body) ?? '').toUpperCase();
		if (options.entityName && entity !== options.entityName) return false;
		if (!options.changeTypes.some((t) => change === t.toUpperCase())) {
			return false;
		}
		if (options.status && body.Status !== options.status) return false;
		return true;
	};
}

export function verifySalesforceWebhookSignature(
	request: WebhookRequest<SalesforceWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'No webhook secret configured' };
	}

	const rawHeader =
		request.headers['x-salesforce-signature'] ||
		request.headers['x-sfdc-signature'];
	const signature = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

	if (!signature) {
		return { valid: false, error: 'Missing webhook signature header' };
	}

	const rawBody =
		typeof request.rawBody === 'string'
			? request.rawBody
			: JSON.stringify(request.payload ?? {});

	const isValid = verifyHmacSignature(rawBody, secret, signature);
	if (!isValid) {
		return { valid: false, error: 'Invalid webhook signature' };
	}

	return { valid: true };
}

export function recordIdFromPayload(
	payload: SalesforceWebhookPayload,
): string | undefined {
	const fromHeader = payload.ChangeEventHeader?.recordIds?.[0];
	return fromHeader || payload.Id || payload.id;
}
