import { createCorsair } from 'corsair/core';
import { SmsalertError, smsalert } from './index';

const api = createCorsair({ plugins: [smsalert({ key: 'secret-key' })] })
	.smsalert.api;
// Fixtures span the provider's distinct response shapes, so retain their inferred type.
const success = <T>(description: T) => ({ status: 'success', description });
const message = success('done');
const batch = success({
	desc: 'scheduled',
	batchid: '1',
	batch_dtl: [{ mobileno: '123', msgid: '2', status: 'AWAITED-DLR' }],
});
// Table entries cover heterogeneous endpoint results; assertions compare each
// result to its fixture rather than accessing fields on the shared boundary.
type Case = {
	path: string;
	method: string;
	params: Record<string, string | number>;
	result: unknown;
	// Each case calls a different endpoint, so their Promise result types differ.
	call: () => Promise<unknown>;
	form?: Record<string, string>;
	unauthenticated?: boolean;
};
const cases: Case[] = [
	{
		path: '/api/user.json',
		method: 'POST',
		params: {},
		result: success({ id: '1', username: 'user' }),
		call: () => api.account.profile({}),
	},
	{
		path: '/users/add.json',
		method: 'POST',
		params: { rtype: 'self' },
		form: {
			'data[User][username]': 'u',
			'data[User][mobilenumber]': '1',
			'data[User][emailid]': 'a@b.co',
			'data[User][firstname]': 'A',
			'data[User][lastname]': 'B',
		},
		unauthenticated: true,
		result: message,
		call: () =>
			api.account.register({
				username: 'u',
				mobilenumber: '1',
				emailid: 'a@b.co',
				firstname: 'A',
				lastname: 'B',
			}),
	},
	{
		path: '/users/forgotpassword.json',
		method: 'POST',
		params: {},
		form: { 'data[User][username_email]': 'u' },
		unauthenticated: true,
		result: { status: 'success', msg: 'sent' },
		call: () => api.account.forgotPassword({ username_email: 'u' }),
	},
	{
		path: '/api/changepwd.json',
		method: 'POST',
		params: {},
		form: { apikey: 'secret-key', pwd: 'old', newpwd: 'new', cnfpwd: 'new' },
		result: message,
		call: () =>
			api.account.changePassword({ pwd: 'old', newpwd: 'new', cnfpwd: 'new' }),
	},
	{
		path: '/api/updateprofile.json',
		method: 'POST',
		params: { firstname: 'A' },
		result: message,
		call: () => api.account.updateProfile({ firstname: 'A' }),
	},
	{
		path: '/api/creditstatus.json',
		method: 'GET',
		params: {},
		result: success({
			desc: 'credit',
			routes: [
				{ route: 'transactional', display_name: 'Transactional', credits: '5' },
			],
		}),
		call: () => api.account.balance({}),
	},
	{
		path: '/api/senderlist.json',
		method: 'GET',
		params: {},
		result: success([
			{
				Senderid: {
					sender: 'ABCDEF',
					approved: true,
					open: true,
					datetime: 'date',
				},
			},
		]),
		call: () => api.account.senders({}),
	},
	{
		path: '/api/grouplist.json',
		method: 'GET',
		params: { page: 2, limit: 10, q: 'a', order: 'desc' },
		result: success([
			{ Group: { id: '1', group_data: null, groupfields: null } },
		]),
		call: () => api.groups.list({ page: 2, limit: 10, q: 'a', order: 'desc' }),
	},
	{
		path: '/api/creategroup.json',
		method: 'POST',
		params: { name: 'a' },
		result: message,
		call: () => api.groups.create({ name: 'a' }),
	},
	{
		path: '/api/deletegroup.json',
		method: 'POST',
		params: { id: '1' },
		result: message,
		call: () => api.groups.delete({ id: '1' }),
	},
	{
		path: '/api/updategroup.json',
		method: 'POST',
		params: { id: '1', name: 'b' },
		result: message,
		call: () => api.groups.update({ id: '1', name: 'b' }),
	},
	{
		path: '/api/grouppush.json',
		method: 'POST',
		params: {
			id: '1',
			sender: 'ABCDEF',
			text: 'hello',
			route: 'transactional',
			schedule: '2026-11-20 10:00:00',
		},
		result: batch,
		call: () =>
			api.groups.send({
				id: '1',
				sender: 'ABCDEF',
				text: 'hello',
				route: 'transactional',
				schedule: '2026-11-20 10:00:00',
			}),
	},
	{
		path: '/api/contactlist.json',
		method: 'GET',
		params: { group_id: '1', page: 2, limit: 5, order: 'desc' },
		result: success([{ Groupmember: { id: '1', datas: null } }]),
		call: () =>
			api.contacts.list({ group_id: '1', page: 2, limit: 5, order: 'desc' }),
	},
	{
		path: '/api/createcontact.json',
		method: 'POST',
		params: { grpname: 'a', name: 'b', number: '123' },
		result: message,
		call: () => api.contacts.create({ grpname: 'a', name: 'b', number: '123' }),
	},
	{
		path: '/api/updatecontact.json',
		method: 'POST',
		params: { id: '1', name: 'b', number: '123' },
		result: message,
		call: () => api.contacts.update({ id: '1', name: 'b', number: '123' }),
	},
	{
		path: '/api/deletecontact.json',
		method: 'POST',
		params: { id: '1' },
		result: message,
		call: () => api.contacts.delete({ id: '1' }),
	},
	{
		path: '/api/templatelist.json',
		method: 'GET',
		params: { page: 3, limit: 5, order: 'desc' },
		result: success([
			{ Smstemplate: { id: '1', title: 'title', template: 'hello' }, User: [] },
		]),
		call: () => api.templates.list({ page: 3, limit: 5, order: 'desc' }),
	},
	{
		path: '/api/createtemplate.json',
		method: 'POST',
		params: { name: 'n', text: 'hello' },
		result: message,
		call: () => api.templates.create({ name: 'n', text: 'hello' }),
	},
	{
		path: '/api/updatetemplate.json',
		method: 'POST',
		params: { id: '1', name: 'n', text: 'hello' },
		result: message,
		call: () => api.templates.update({ id: '1', name: 'n', text: 'hello' }),
	},
	{
		path: '/api/deletetemplate.json',
		method: 'POST',
		params: { id: '1' },
		result: message,
		call: () => api.templates.delete({ id: '1' }),
	},
	{
		path: '/api/push.json',
		method: 'POST',
		params: {
			sender: 'ABCDEF',
			mobileno: '123',
			text: 'hello & bye',
			schedule: '2026-11-20 10:00:00',
			reference: 'ref',
			dlrurl: 'https://example.com/callback?a=1',
		},
		result: batch,
		call: () =>
			api.messages.send({
				sender: 'ABCDEF',
				mobileno: '123',
				text: 'hello & bye',
				schedule: '2026-11-20 10:00:00',
				reference: 'ref',
				dlrurl: 'https://example.com/callback?a=1',
			}),
	},
	{
		path: '/api/modifyschedule.json',
		method: 'POST',
		params: { batchid: '1', schedule: '2026-11-20 10:00:00' },
		result: message,
		call: () =>
			api.schedules.update({ batchid: '1', schedule: '2026-11-20 10:00:00' }),
	},
	{
		path: '/api/cancelschedule.json',
		method: 'POST',
		params: { batchid: '1' },
		result: message,
		call: () => api.schedules.cancel({ batchid: '1' }),
	},
	{
		path: '/api/smscampaignlog.json',
		method: 'POST',
		params: { page: 2, limit: 5, q: 'hello', schedule: '1' },
		result: success([{ Smscampaignlog: { id: '1', schedule: false } }]),
		call: () =>
			api.reports.sent({ page: 2, limit: 5, q: 'hello', schedule: '1' }),
	},
	{
		path: '/api/pull.json',
		method: 'POST',
		params: { batchid: '1' },
		result: success({
			desc: 'one',
			report: [
				{
					mobileno: '123',
					sender: 'ABCDEF',
					text: 'hi',
					msgid: '2',
					status: 'DELIVRD',
					schedule: 'date',
					lastupdated: 'date',
				},
			],
		}),
		call: () => api.reports.delivery({ batchid: '1' }),
	},
	{
		path: '/api/mverify.json',
		method: 'POST',
		params: { mobileno: '123', template: '[otp]', sender: 'ABCDEF' },
		result: batch,
		call: () =>
			api.otp.generate({
				mobileno: '123',
				template: '[otp]',
				sender: 'ABCDEF',
			}),
	},
	{
		path: '/api/mverify.json',
		method: 'POST',
		params: { mobileno: '123', code: '0123' },
		result: success({ desc: 'Code Matched successfully.' }),
		call: () => api.otp.validate({ mobileno: '123', code: '0123' }),
	},
	{
		path: '/api/createshorturl.json',
		method: 'POST',
		params: { url: 'https://example.com/a?b=c' },
		result: success({
			id: '1',
			status: 'success',
			message: 'saved',
			data: {
				Link: {
					long_url: 'https://example.com',
					short_url: 'https://short.test/a',
					alias: 'a',
					updated: null,
				},
			},
		}),
		call: () => api.shortUrls.create({ url: 'https://example.com/a?b=c' }),
	},
	{
		path: '/api/deleteshorturl.json',
		method: 'POST',
		params: { id: '1' },
		result: message,
		call: () => api.shortUrls.delete({ id: '1' }),
	},
];

afterEach(() => jest.restoreAllMocks());
describe('SMS Alert public API', () => {
	it.each(cases)(
		'$method $path forwards documented inputs',
		async ({ path, method, params, result, call, form, unauthenticated }) => {
			const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
				new Response(JSON.stringify(result), {
					status: 200,
					headers: { 'content-type': 'application/json' },
				}),
			);
			await expect(call()).resolves.toEqual(result);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			const [url, request] = fetchMock.mock.calls[0]!;
			const parsed = new URL(String(url));
			expect(parsed.origin + parsed.pathname).toBe(
				`https://www.smsalert.co.in${path}`,
			);
			expect(request?.method).toBe(method);
			expect(request?.redirect).toBe('error');
			const expected = {
				...params,
				...(!form && !unauthenticated ? { apikey: 'secret-key' } : {}),
			};
			expect(Object.fromEntries(parsed.searchParams)).toEqual(
				Object.fromEntries(
					Object.entries(expected).map(([key, value]) => [key, String(value)]),
				),
			);
			if (form) {
				expect(
					Object.fromEntries(new URLSearchParams(String(request?.body))),
				).toEqual(form);
				expect(new Headers(request?.headers).get('content-type')).toBe(
					'application/x-www-form-urlencoded',
				);
			} else expect(request?.body).toBeUndefined();
		},
	);
	it('rejects invalid input before issuing a request', async () => {
		const fetchMock = jest.spyOn(global, 'fetch');
		await expect(
			api.messages.send({ sender: '', mobileno: '123', text: 'x' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('requires the documented OTP placeholder and accepts its attributes', async () => {
		const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response(JSON.stringify(batch), {
				headers: { 'content-type': 'application/json' },
			}),
		);
		await expect(
			api.otp.generate({ mobileno: '123', template: 'Your code' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
		await expect(
			api.otp.generate({
				mobileno: '123',
				template: 'Code: [otp length="6" retry="2"]',
			}),
		).resolves.toEqual(batch);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
	it('rejects a mismatched OTP despite the provider success status', async () => {
		jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(
				new Response(JSON.stringify(success({ desc: 'Code does not match.' }))),
			);
		await expect(
			api.otp.validate({ mobileno: '123', code: '0123' }),
		).rejects.toThrow('SMS Alert OTP code does not match');
	});
	it('runs a custom specific error handler before the default fallback', async () => {
		const handler = jest.fn(async () => ({ maxRetries: 0 }));
		const client = createCorsair({
			plugins: [
				smsalert({
					key: 'secret-key',
					errorHandlers: { AUTH_ERROR: { match: () => true, handler } },
				}),
			],
		});
		jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(new Response('', { status: 401 }));
		await expect(client.smsalert.api.account.balance({})).rejects.toThrow();
		expect(handler).toHaveBeenCalledTimes(1);
	});
	it('allows account registration and password reset without an API key', async () => {
		const unauthenticated = createCorsair({ plugins: [smsalert()] }).smsalert
			.api;
		const fetchMock = jest
			.spyOn(global, 'fetch')
			.mockResolvedValueOnce(
				new Response(JSON.stringify(message), {
					headers: { 'content-type': 'application/json' },
				}),
			)
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ status: 'success', msg: 'sent' }), {
					headers: { 'content-type': 'application/json' },
				}),
			);
		await expect(
			unauthenticated.account.register({
				username: 'u',
				mobilenumber: '1',
				emailid: 'a@b.co',
				firstname: 'A',
				lastname: 'B',
			}),
		).resolves.toEqual(message);
		await expect(
			unauthenticated.account.forgotPassword({ username_email: 'u' }),
		).resolves.toEqual({ status: 'success', msg: 'sent' });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
	it('rejects absent and blank stored API keys before calling SMS Alert', async () => {
		const fetchMock = jest.spyOn(global, 'fetch');
		const plugin = smsalert({ authType: 'api_key' });
		const getApiKey = jest
			.fn()
			.mockResolvedValueOnce(null)
			.mockResolvedValueOnce('   ');
		const builder = jest.fn();
		// The public binding has no database in this test; supply its key manager at
		// the plugin boundary to exercise the same missing-key path as stored keys.
		const original = plugin.keyBuilder;
		if (!original) throw new Error('Missing key builder');
		plugin.keyBuilder = async (ctx, source) => {
			const testContext = {
				...ctx,
				authType: 'api_key' as const,
				keys: {
					get_api_key: getApiKey,
					set_api_key: async () => {},
					get_webhook_signature: async () => null,
					set_webhook_signature: async () => {},
					get_dek: async () => '',
					issue_new_dek: async () => '',
				},
			};
			try {
				return await original(testContext, source);
			} catch (error) {
				builder(error);
				throw error;
			}
		};
		const client = createCorsair({ plugins: [plugin] });
		await expect(client.smsalert.api.account.balance({})).rejects.toMatchObject(
			{
				name: 'AuthMissingError',
				pluginId: 'smsalert',
				authType: 'api_key',
			},
		);
		await expect(client.smsalert.api.account.balance({})).rejects.toMatchObject(
			{
				name: 'AuthMissingError',
				pluginId: 'smsalert',
				authType: 'api_key',
			},
		);
		expect(getApiKey).toHaveBeenCalledTimes(2);
		expect(builder).toHaveBeenCalledTimes(2);
		expect(builder.mock.calls[0]?.[0]).toMatchObject({
			name: 'AuthMissingError',
			pluginId: 'smsalert',
		});
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('does not leak request values from provider errors', async () => {
		jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({
					status: 'error',
					description: 'secret-key 123 private-message',
				}),
				{ status: 200, headers: { 'content-type': 'application/json' } },
			),
		);
		await expect(
			api.messages.send({
				sender: 'A',
				mobileno: '123',
				text: 'private-message',
			}),
		).rejects.toThrow('SMS Alert returned an error');
	});
	it('exposes 429 retry delay without retrying or leaking request data', async () => {
		const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response('secret-key private-message', {
				status: 429,
				headers: { 'retry-after': '3' },
			}),
		);
		// JavaScript may throw any value, so narrow it before inspecting properties.
		let caught: unknown;
		try {
			await api.messages.send({
				sender: 'A',
				mobileno: '123',
				text: 'private-message',
			});
		} catch (error) {
			caught = error;
		}
		expect(caught).toBeInstanceOf(SmsalertError);
		expect(caught).toMatchObject({ status: 429, retryAfter: 3000 });
		expect(JSON.stringify(caught)).not.toContain('secret-key');
		expect(JSON.stringify(caught)).not.toContain('private-message');
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
	it('sanitizes malformed responses and network errors', async () => {
		const fetchMock = jest
			.spyOn(global, 'fetch')
			.mockResolvedValueOnce(
				new Response('not json secret-key', {
					status: 200,
					headers: { 'content-type': 'text/plain' },
				}),
			)
			.mockRejectedValueOnce(new Error('secret-key private-message'));
		await expect(api.account.balance({})).rejects.toThrow(
			'SMS Alert returned an invalid response',
		);
		await expect(api.account.balance({})).rejects.toThrow(
			'SMS Alert request failed',
		);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
	it('does not log malformed JSON containing request secrets', async () => {
		const log = jest.spyOn(console, 'error').mockImplementation(() => {});
		jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response('{"secret-key private-message"', {
				headers: { 'content-type': 'application/json' },
			}),
		);
		await expect(
			api.messages.send({
				sender: 'A',
				mobileno: '123',
				text: 'private-message',
			}),
		).rejects.toThrow('SMS Alert returned an invalid response');
		expect(log).not.toHaveBeenCalled();
	});
});
