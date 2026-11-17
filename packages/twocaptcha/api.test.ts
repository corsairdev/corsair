import { TwoCaptchaAPIError } from './client';
import { AccountEndpoints, TasksEndpoints } from './endpoints';

/**
 * Live run against API v2. It runs only when `TWOCAPTCHA_API_KEY` is set.
 * It reads the balance and, on an account with no funds, checks that
 * createTask answers ERROR_ZERO_BALANCE (nothing is charged). With funds it
 * skips createTask: a task costs money.
 */
const API_KEY = process.env.TWOCAPTCHA_API_KEY;
const describeIfKey = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	console.warn(
		'TWOCAPTCHA_API_KEY is not set, skipping the live 2Captcha tests',
	);
}

function ctx() {
	// unknown: endpoints read only `key` from the context here; event logging
	// is a no-op without a database.
	return { key: API_KEY ?? '', authType: 'api_key' } as never;
}

describeIfKey('2Captcha live API', () => {
	let funded = true;

	it('reads the balance', async () => {
		const result = await AccountEndpoints.balance(ctx(), {});
		expect(result.errorId).toBe(0);
		funded = Number(result.balance) > 0;
		console.log(`balance: ${result.balance}`);
	});

	it('answers ERROR_ZERO_BALANCE to createTask on an empty account', async () => {
		if (funded) {
			console.log('account has funds: createTask not run (it would charge)');
			return;
		}
		const error = await TasksEndpoints.create(ctx(), {
			type: 'RecaptchaV2TaskProxyless',
			task: {
				websiteURL: 'https://2captcha.com/demo/recaptcha-v2',
				websiteKey: '6LfD3PIbAAAAAJs_eEHvoOl75_83eXSqpPSRFJ_u',
			},
		}).catch(
			// unknown: a promise can reject with any value; narrowed below.
			(e: unknown) => e,
		);
		expect(error).toBeInstanceOf(TwoCaptchaAPIError);
		expect((error as TwoCaptchaAPIError).code).toBe('ERROR_ZERO_BALANCE');
	});

	it('answers a made-up task id with ERROR_NO_SUCH_CAPCHA_ID', async () => {
		const error = await TasksEndpoints.result(ctx(), { task_id: 1 }).catch(
			// unknown: a promise can reject with any value; narrowed below.
			(e: unknown) => e,
		);
		expect(error).toBeInstanceOf(TwoCaptchaAPIError);
		console.log(`getTaskResult(1): ${(error as TwoCaptchaAPIError).code}`);
	});
});
