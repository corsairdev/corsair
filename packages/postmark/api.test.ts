// Live Postmark smoke tests. Excluded from the default run; run with:
//
//   POSTMARK_SERVER_TOKEN=... pnpm test:live
//
// Every test is a read, and every answer is parsed through the same output
// schema a caller receives, so a field typed wrongly cannot pass silently.
// Nothing here sends email: a send cannot be recalled once Postmark accepts it.
//
// A server in Sandbox mode accepts sends without delivering them, but this suite
// does not send at all, so it is safe on a Live server too.
import {
	makePostmarkRequest,
	POSTMARK_API_BASE,
	PostmarkAPIError,
} from './client';
import {
	BounceSchema,
	MessageStreamSchema,
	PostmarkEndpointOutputSchemas,
	PostmarkJsonValueSchema,
	ServerSchema,
	TemplateSchema,
} from './endpoints/types';
import { captureError } from './test-helpers';

const LIVE_TOKEN = process.env.POSTMARK_SERVER_TOKEN ?? '';

if (LIVE_TOKEN.length === 0) {
	// Same check the gate prints, so a skipped run cannot read as a pass.
	console.warn(
		'Skipping Postmark live tests: POSTMARK_SERVER_TOKEN is not set.',
	);
}
const describeLive = LIVE_TOKEN.length > 0 ? describe : describe.skip;

describeLive('Postmark live API', () => {
	it('reads this server through the output schema', async () => {
		const raw = await makePostmarkRequest(LIVE_TOKEN, {
			method: 'GET',
			path: '/server',
		});
		const parsed = PostmarkEndpointOutputSchemas.serverGet.parse(raw);

		expect(ServerSchema.safeParse(parsed).success).toBe(true);
		// The delivery type is what decides whether a send reaches the recipient.
		expect(['Live', 'Sandbox', null, undefined]).toContain(parsed.DeliveryType);
	});

	it('lists templates through the output schema', async () => {
		const raw = await makePostmarkRequest(LIVE_TOKEN, {
			method: 'GET',
			path: '/templates',
			query: { Count: 5, Offset: 0 },
		});
		const parsed = PostmarkEndpointOutputSchemas.templatesList.parse(raw);

		expect(Array.isArray(parsed.Templates)).toBe(true);
		for (const template of parsed.Templates) {
			expect(TemplateSchema.safeParse(template).success).toBe(true);
		}
	});

	it('lists message streams through the output schema', async () => {
		const raw = await makePostmarkRequest(LIVE_TOKEN, {
			method: 'GET',
			path: '/message-streams',
		});
		const parsed = PostmarkEndpointOutputSchemas.streamsList.parse(raw);

		expect(Array.isArray(parsed.MessageStreams)).toBe(true);
		for (const stream of parsed.MessageStreams) {
			expect(MessageStreamSchema.safeParse(stream).success).toBe(true);
		}
	});

	it('lists bounces through the output schema', async () => {
		const raw = await makePostmarkRequest(LIVE_TOKEN, {
			method: 'GET',
			path: '/bounces',
			query: { count: 5, offset: 0 },
		});
		const parsed = PostmarkEndpointOutputSchemas.bouncesList.parse(raw);

		expect(Array.isArray(parsed.Bounces)).toBe(true);
		for (const bounce of parsed.Bounces) {
			expect(BounceSchema.safeParse(bounce).success).toBe(true);
		}
	});

	it('reads the outbound stats overview through the output schema', async () => {
		const raw = await makePostmarkRequest(LIVE_TOKEN, {
			method: 'GET',
			path: '/stats/outbound',
		});
		const parsed = PostmarkEndpointOutputSchemas.statsOverview.parse(raw);

		expect(PostmarkJsonValueSchema.safeParse(parsed).success).toBe(true);
	});

	it('rejects a wrong token as a credential failure, keeping it off the error', async () => {
		const error = await captureError(
			makePostmarkRequest('definitely-not-a-token', {
				method: 'GET',
				path: '/server',
			}),
		);

		expect(error).toBeInstanceOf(PostmarkAPIError);
		if (!(error instanceof PostmarkAPIError)) return;
		expect(error.status).toBe(401);
		expect(error.errorCode).toBe(10);
		expect(error.credentialsRejected).toBe(true);
		// The token rode in a header, so nothing may echo it back.
		expect(JSON.stringify(error)).not.toContain('definitely-not-a-token');
	});

	it('exposes the documented API host', () => {
		expect(POSTMARK_API_BASE).toBe('https://api.postmarkapp.com');
	});
});
