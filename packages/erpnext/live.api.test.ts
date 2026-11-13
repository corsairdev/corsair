import { makeErpnextRequest } from './client';

const baseUrl = process.env.ERPNEXT_BASE_URL;
const apiKey = process.env.ERPNEXT_API_KEY;
const apiSecret = process.env.ERPNEXT_API_SECRET;

// Repo convention: the live suite runs only when explicitly enabled with
// LIVE_TEST=1 and a full credential is present; CI and local suites skip it.
const liveEnabled =
	process.env.LIVE_TEST === '1' &&
	Boolean(baseUrl) &&
	Boolean(apiKey) &&
	Boolean(apiSecret);

const describeLive = liveEnabled ? describe : describe.skip;

// One read-only smoke test: it proves authentication, transport, and
// response handling still work against the live site. Destructive and
// mutation operations are deliberately not exercised live; they are covered
// by the mocked route and schema suites instead.
describeLive('ERPNext live API', () => {
	it('authenticates and reads the logged user', async () => {
		// unknown: the live smoke test only proves authentication and
		// envelope handling; the body is provider-defined.
		const response = await makeErpnextRequest<unknown>(
			'/api/method/frappe.auth.get_logged_user',
			baseUrl!,
			`${apiKey!}:${apiSecret!}`,
			{ method: 'GET' },
		);
		expect(response).toBeDefined();
	});
});
