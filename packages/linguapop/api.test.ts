// Live smoke suite. It has NOT been run by the author: Linguapop requires an
// active paid subscription (plus billing details) before an integration API
// key can send invitations, and no key was available. CI skips api.test.ts by
// design. Run it yourself with:
//
//   LINGUAPOP_API_KEY=<integration key> pnpm --filter @corsair-dev/linguapop test:live
//
// Set LINGUAPOP_LIVE_WRITE=1 as well to create one real invitation (with
// sendEmail false, so nobody is emailed; Linguapop bills only completed tests).
//
// What this suite exists to settle, because the mocked suites cannot:
// - the exact sendInvitation response shape (the fixtures use the docs' example);
// - whether getLanguages needs a key (a keyless probe answered 200, but the docs
//   are silent).
import { makeLinguapopRequest } from './client';
import { LinguapopEndpointOutputSchemas as Outputs } from './endpoints/types';
import { linguapop } from './index';
import { makeContext } from './test-helpers';

const apiKey = process.env.LINGUAPOP_API_KEY;
const writeEnabled = process.env.LINGUAPOP_LIVE_WRITE === '1';

if (!apiKey) {
	console.warn(
		'[linguapop] LINGUAPOP_API_KEY is not set: the live suite did NOT run, so the sendInvitation response shape and the keyless getLanguages behaviour are unverified.',
	);
} else if (!writeEnabled) {
	console.warn(
		'[linguapop] LINGUAPOP_LIVE_WRITE is not 1: the live invitations.create test did NOT run, so the sendInvitation response shape is unverified.',
	);
}

const describeIfKey = apiKey ? describe : describe.skip;
const itIfWrite = apiKey && writeEnabled ? it : it.skip;

describeIfKey('Linguapop live API', () => {
	const key = apiKey ?? '';
	const endpoints = linguapop({ key }).endpoints as NonNullable<
		ReturnType<typeof linguapop>['endpoints']
	>;

	it('languages.list answers the language catalogue through the output schema', async () => {
		const result = await endpoints.languages.list(makeContext(key), {});

		expect(result.length).toBeGreaterThan(0);
		expect(result.map((language) => language.code)).toContain('eng');
	});

	it('answers an unrecognised key with a 400 the client tags as invalid', async () => {
		const error = await makeLinguapopRequest('lp-live-smoke-invalid-key', {
			method: 'POST',
			action: 'sendInvitation',
			body: {
				email: 'live-smoke@example.com',
				languageCode: 'eng',
				sendEmail: false,
			},
		}).catch((caught: Error) => caught);

		expect(error).toMatchObject({ status: 400, invalidApiKey: true });
	});

	itIfWrite(
		'invitations.create returns an invitation matching the output schema',
		async () => {
			const result = await endpoints.invitations.create(makeContext(key), {
				email: 'live-smoke@example.com',
				languageCode: 'eng',
				sendEmail: false,
				externalIdentifier: 'corsair-live-smoke',
			});

			const parsed = Outputs.invitationsCreate.parse(result);
			expect(parsed.invitationId).toBeGreaterThan(0);
			expect(parsed.url).toContain('app.linguapop.eu');
			expect(parsed.emailSent).not.toBe(true);
		},
	);
});
