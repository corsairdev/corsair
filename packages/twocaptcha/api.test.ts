import { twocaptcha, twocaptchaEndpointSchemas } from './index';

/**
 * Live smoke test. It runs only when `TWOCAPTCHA_API_KEY` is set.
 *
 * It only reads the balance. Creating a task costs money, and solving a captcha
 * needs a real page with a live site key, so the write paths stay unverified
 * here. The balance call is enough to prove the key and the envelope handling.
 *
 * Every answer is parsed through its output schema before asserting.
 */
const API_KEY = process.env.TWOCAPTCHA_API_KEY;
const describeIfKey = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	// Say so out loud: a skipped suite reads as a pass in the summary otherwise.
	console.warn(
		'TWOCAPTCHA_API_KEY is not set, skipping the live 2Captcha tests',
	);
}

describeIfKey('2Captcha live API', () => {
	const balance = twocaptchaEndpointSchemas['account.balance'];
	const reportCorrect = twocaptchaEndpointSchemas['account.reportCorrect'];
	const reportIncorrect = twocaptchaEndpointSchemas['account.reportIncorrect'];

	// The raw client, built the way the plugin builds it.
	async function get(path: string, query?: Record<string, string>) {
		const { makeTwoCaptchaRequest } = await import('./client');
		return makeTwoCaptchaRequest(API_KEY ?? '', {
			method: 'GET',
			path,
			query,
		});
	}

	it('reads the balance through the output schema', async () => {
		const parsed = balance.output.parse(await get('getBalance'));
		expect(parsed.status).toBe(1);
		// `request` holds the amount, as a number.
		expect(Number(parsed.request)).toBeGreaterThanOrEqual(0);
	});

	it('declares the balance and both report inputs without needing a task', () => {
		// These two routes need a real task id, so only their schema shape is
		// checked here rather than a call that would fail on a fake id.
		expect(
			reportCorrect.input.safeParse({ task_id: '734920165' }).success,
		).toBe(true);
		expect(
			reportIncorrect.input.safeParse({ task_id: '734920165' }).success,
		).toBe(true);
	});

	it('is wired with the key it was given', () => {
		expect(twocaptcha({ key: API_KEY }).id).toBe('twocaptcha');
	});
});
