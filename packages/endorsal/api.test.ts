import { Testimonials } from './endpoints';
import type { EndorsalContext } from './index';

const apiKey = process.env.ENDORSAL_API_KEY;
const liveIt = apiKey ? it : it.skip;
if (!apiKey) {
	console.warn('Skipping Endorsal live tests: ENDORSAL_API_KEY is not set.');
}

function buildLiveContext(): Parameters<typeof Testimonials.list>[0] {
	const ctx: EndorsalContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('live-smoke'),
		key: apiKey ?? '',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('live-dek'),
			issue_new_dek: () => Promise.resolve('live-dek'),
			get_api_key: () => Promise.resolve(apiKey ?? null),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

describe('Endorsal live read-only smoke test', () => {
	liveIt(
		'lists testimonials using ENDORSAL_API_KEY and validates the response',
		async () => {
			const response = await Testimonials.list(buildLiveContext(), {});
			expect(response.success).toBe(true);
			expect(Array.isArray(response.data)).toBe(true);
		},
	);
});
