jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

import { getCredentials, getInformation, log } from './endpoints/account';
import { recognize } from './endpoints/process-document';

const LIVE_KEY =
	process.env.OCRWEBSERVICE_KEY ??
	(process.env.OCRWEBSERVICE_USERNAME && process.env.OCRWEBSERVICE_LICENSE
		? `${process.env.OCRWEBSERVICE_USERNAME}:${process.env.OCRWEBSERVICE_LICENSE}`
		: '');

const describeLive =
	process.env.OCRWEBSERVICE_LIVE && LIVE_KEY ? describe : describe.skip;

function ctx() {
	return { key: LIVE_KEY, options: {} } as any;
}

describeLive('OCR Web Service live API', () => {
	it('extracts credentials then reads account quota', async () => {
		const creds = await getCredentials(ctx(), {});
		expect(creds.user_name.length).toBeGreaterThan(0);

		const account = await getInformation(ctx(), {});
		expect(account.AvailablePages).toEqual(expect.any(Number));
	});

	it('fetches logs for the last week', async () => {
		const to = new Date().toISOString().slice(0, 10);
		const fromDate = new Date();
		fromDate.setUTCDate(fromDate.getUTCDate() - 7);
		const from = fromDate.toISOString().slice(0, 10);

		const result = await log(ctx(), { from_date: from, to_date: to });
		expect(typeof result.data).toBe('string');
	});

	it('recognizes a tiny text document', async () => {
		const png = Buffer.from(
			'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
			'base64',
		);
		const file = new Blob([png], { type: 'image/png' });
		const result = await recognize(ctx(), {
			file,
			language: 'english',
			gettext: true,
		});
		expect(result.ErrorMessage == null || result.ErrorMessage === '').toBe(
			true,
		);
		expect(result.ProcessedPages ?? 0).toBeGreaterThanOrEqual(0);
	});
});
