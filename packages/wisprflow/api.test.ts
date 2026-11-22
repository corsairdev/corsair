import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ApiError } from 'corsair/http';
import { generate, revoke, revokeClient } from './endpoints/tokens';
import { create, warmup } from './endpoints/transcriptions';
import { WisprFlowSchema } from './schema';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

// Live suite against platform-api.wisprflow.ai. CI skips api.test.ts by path; run it with:
//   WISPRFLOW_API_KEY=fl-… pnpm --filter @corsair-dev/wisprflow test api.test.ts
const KEY = process.env.WISPRFLOW_API_KEY;
const suite = KEY ? describe : describe.skip;
if (!KEY)
	console.warn('WISPRFLOW_API_KEY not set, skipping the Wispr Flow live suite');

type Ctx = Parameters<typeof create>[0];

// `unknown`: the fake database records whatever the endpoint stores.
const stored: Array<[string, unknown]> = [];

function ctxWithKey(key: string | undefined) {
	// Safe: the endpoints read only `key` and `db.transcription`; the runtime builds the rest from a live database.
	return {
		key,
		db: {
			transcription: {
				// `unknown`: same fake database record.
				upsertByEntityId: async (id: string, data: unknown) => {
					stored.push([id, data]);
					return null;
				},
			},
		},
	} as unknown as Ctx;
}

const ctx = ctxWithKey(KEY);
// fixtures/ is gitignored repo-wide, so the spoken sample is made locally:
//   espeak-ng -w /tmp/hello.wav "Hello from Corsair" && \
//   ffmpeg -i /tmp/hello.wav -ar 16000 -ac 1 -c:a pcm_s16le packages/wisprflow/fixtures/hello.wav
// It is read only when the live suite runs, so a run without WISPRFLOW_API_KEY never touches it.
const AUDIO_PATH = join(__dirname, 'fixtures/hello.wav');
const readAudio = () => readFileSync(AUDIO_PATH).toString('base64');
const itWithAudio = existsSync(AUDIO_PATH) ? it : it.skip;
if (KEY && !existsSync(AUDIO_PATH))
	console.warn(
		`${AUDIO_PATH} is missing, skipping the live transcription test`,
	);

jest.setTimeout(60_000);

suite('Wispr Flow live API', () => {
	it('warms the connection', async () => {
		await expect(warmup(ctx, {})).resolves.toEqual({ status: 'warmed' });
	});

	itWithAudio(
		'transcribes the spoken fixture and stores the result',
		async () => {
			const result = await create(ctx, {
				audio: readAudio(),
				language: ['en'],
				context: { app: { type: 'other' } },
			});

			expect(result.text.toLowerCase()).toContain('hello from corsair');
			expect(result.detected_language).toBe('en');
			expect(result.generated_tokens).toBeGreaterThan(0);
			expect(stored).toContainEqual([result.id, result]);
			expect(() =>
				WisprFlowSchema.entities.transcription.parse(result),
			).not.toThrow();
		},
	);

	it('generates a client token, revokes it, then revokes the client', async () => {
		const clientId = `corsair-live-${Date.now()}`;
		const token = await generate(ctx, {
			client_id: clientId,
			duration_secs: 60,
		});
		expect(token.access_token.split('.')).toHaveLength(3);
		expect(token.expires_in).toBeGreaterThan(0);

		await expect(
			revoke(ctx, { access_token: token.access_token }),
		).resolves.toMatchObject({ status: 'success' });

		await generate(ctx, { client_id: clientId, duration_secs: 60 });
		await expect(
			revokeClient(ctx, { client_id: clientId }),
		).resolves.toMatchObject({
			status: 'success',
		});
	});

	it('rejects a bad key with a 401 ApiError', async () => {
		const error = await generate(ctxWithKey('fl-invalid'), {
			client_id: 'corsair-live-bad-key',
			duration_secs: 60,
		}).catch((e) => e);
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(401);
	});
});
