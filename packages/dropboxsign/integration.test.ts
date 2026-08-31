import { DropboxSignAPIError, makeDropboxSignRequest } from './client';
import { DropboxSignAccount } from './schema';

const LIVE_KEY = process.env.DROPBOX_SIGN_API_KEY;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describe('Dropbox Sign live REST v3', () => {
	it('rejects an invalid API key on GET /account', async () => {
		const err = await makeDropboxSignRequest(
			'account',
			'invalid-live-check',
		).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(DropboxSignAPIError);
		expect((err as DropboxSignAPIError).status).toBe(401);
	});
});

describeIfKey('Dropbox Sign live REST v3 (authenticated)', () => {
	it('returns AccountGetResponse', async () => {
		const raw = await makeDropboxSignRequest<{
			account: Record<string, unknown>;
		}>('account', LIVE_KEY as string);
		const account = DropboxSignAccount.parse(raw.account);
		expect((account.account_id ?? '').length).toBeGreaterThan(0);
		expect((account.email_address ?? '').length).toBeGreaterThan(0);
	});

	it('lists signature requests', async () => {
		const raw = await makeDropboxSignRequest<{
			signature_requests: unknown[];
			list_info?: { page?: number };
		}>('signature_request/list', LIVE_KEY as string, {
			query: { page: 1, page_size: 1 },
		});
		expect(Array.isArray(raw.signature_requests)).toBe(true);
	});
});
