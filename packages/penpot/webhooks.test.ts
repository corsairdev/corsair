import { webhookEvent } from './test-fixtures';
import { event } from './webhooks';
import {
	matchPenpotWebhook,
	PenpotWebhookPayloadSchema,
	verifyPenpotWebhook,
} from './webhooks/types';

// unknown: the handler reads fields the webhook fixture does not carry.
function webhookContext() {
	return { key: '' } as never;
}

function rawRequest(
	// unknown: the delivery body is untyped until the payload schema parses
	// it; the fixture passes provider-shaped objects through.
	body: unknown,
) {
	const rawBody = JSON.stringify(body);
	return {
		headers: {},
		payload: body,
		body,
		rawBody,
	};
}

describe('verifyPenpotWebhook', () => {
	it("accepts Penpot's audit-event envelope", () => {
		expect(verifyPenpotWebhook(rawRequest(webhookEvent) as never)).toEqual({
			valid: true,
		});
	});

	it('rejects a body without name, props and profileId', () => {
		const result = verifyPenpotWebhook(
			rawRequest({ event: 'penpot.comment.added', payload: {} }) as never,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('not a Penpot event');
	});

	it('rejects a non-object body', () => {
		const result = verifyPenpotWebhook(rawRequest('plain text') as never);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('not an object');
	});

	it('accepts a hub-verified delivery', () => {
		const request = { headers: {}, body: {}, payload: {}, hubVerified: true };
		expect(verifyPenpotWebhook(request as never)).toEqual({ valid: true });
	});
});

describe('matchPenpotWebhook', () => {
	it("matches Penpot's envelope", () => {
		expect(matchPenpotWebhook(rawRequest(webhookEvent) as never)).toBe(true);
	});

	it("matches with Penpot's User-Agent and not with another one", () => {
		const withAgent = (agent: string) => ({
			...rawRequest(webhookEvent),
			headers: { 'user-agent': agent },
		});
		expect(matchPenpotWebhook(withAgent('penpot/2.16.0') as never)).toBe(true);
		expect(matchPenpotWebhook(withAgent('Stannp-Webhooks/1.0') as never)).toBe(
			false,
		);
	});

	it("does not claim another provider's event (Stannp sends { event, data })", () => {
		const stannp = { event: 'mailpiece_status', data: { id: 1 } };
		expect(matchPenpotWebhook(rawRequest(stannp) as never)).toBe(false);
		expect(matchPenpotWebhook(rawRequest([webhookEvent]) as never)).toBe(false);
		expect(matchPenpotWebhook(rawRequest('plain') as never)).toBe(false);
	});
});

describe('PenpotWebhookPayloadSchema', () => {
	it('parses a delivery', () => {
		const parsed = PenpotWebhookPayloadSchema.parse(webhookEvent);
		expect(parsed.name).toBe('rename-file');
		expect(parsed.props['teamId']).toBe(webhookEvent.props.teamId);
	});

	it('rejects a delivery without a name', () => {
		expect(() =>
			PenpotWebhookPayloadSchema.parse({ props: {}, profileId: 'p' }),
		).toThrow();
	});
});

describe('penpot.event handler', () => {
	it('returns a 400 refusal for a body that is not a Penpot event', async () => {
		const result = await event.handler(
			webhookContext(),
			rawRequest({ payload: {} }) as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 400 });
	});

	it('returns the parsed event for a well-formed delivery', async () => {
		const result = await event.handler(
			webhookContext(),
			rawRequest(webhookEvent) as never,
		);
		expect(result.success).toBe(true);
		// unknown: the handler's data field is the parsed event object.
		const data = (result as { data?: { name?: string } }).data;
		expect(data?.name).toBe('rename-file');
	});
});
