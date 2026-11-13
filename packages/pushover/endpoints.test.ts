const requestMock = jest.fn();
jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	// The mocked shared request accepts several heterogeneous arguments; preserve
	// them without assuming their runtime shapes before the seam assertions.
	request: (...args: unknown[]) => requestMock(...args),
}));

import {
	Apps,
	Glances,
	Groups,
	Licenses,
	Messages,
	Receipts,
	Sounds,
	Subscriptions,
	Teams,
	Users,
} from './endpoints';
import { PushoverEndpointInputSchemas } from './endpoints/types';
import { pushover, pushoverEndpointSchemas } from './index';

const ctx = { key: 'test-token' } as never;
const status = { status: 1, request: 'request-id' };
// Endpoint results differ by operation and are checked against each fixture below;
// no single concrete result type represents this heterogeneous test table.
type Endpoint = (context: never, input: never) => Promise<unknown>;
type Case = {
	call: Endpoint;
	input: object;
	method: 'GET' | 'POST';
	url: string;
	data: object;
	output: object;
};
const cases: Case[] = [
	{
		call: Messages.send,
		input: {
			user: 'user',
			message: 'hello',
			priority: 2,
			retry: 30,
			expire: 300,
		},
		method: 'POST',
		url: 'messages.json',
		data: {
			user: 'user',
			message: 'hello',
			priority: 2,
			retry: 30,
			expire: 300,
		},
		output: { ...status, receipt: 'receipt' },
	},
	{
		call: Users.validate,
		input: { user: 'user', device: 'phone' },
		method: 'POST',
		url: 'users/validate.json',
		data: { user: 'user', device: 'phone' },
		output: { ...status, devices: ['phone'], licenses: ['iOS'] },
	},
	{
		call: Sounds.list,
		input: {},
		method: 'GET',
		url: 'sounds.json',
		data: {},
		output: { ...status, sounds: { pushover: 'Pushover' } },
	},
	{
		call: Apps.limits,
		input: {},
		method: 'GET',
		url: 'apps/limits.json',
		data: {},
		output: { ...status, limit: 10000, remaining: 30, reset: 123 },
	},
	{
		call: Receipts.get,
		input: { receipt: 'r' },
		method: 'GET',
		url: 'receipts/r.json',
		data: {},
		output: {
			...status,
			acknowledged: 0,
			acknowledged_at: 0,
			acknowledged_by: null,
			acknowledged_by_device: null,
			last_delivered_at: 0,
			expired: 0,
			expires_at: 123,
			called_back: 0,
			called_back_at: 0,
		},
	},
	{
		call: Receipts.cancel,
		input: { receipt: 'r' },
		method: 'POST',
		url: 'receipts/r/cancel.json',
		data: {},
		output: status,
	},
	{
		call: Receipts.cancelByTag,
		input: { tag: 'site=one' },
		method: 'POST',
		url: 'receipts/cancel_by_tag/site%3Done.json',
		data: {},
		output: status,
	},
	{
		call: Groups.create,
		input: { name: 'on call' },
		method: 'POST',
		url: 'groups.json',
		data: { name: 'on call' },
		output: { ...status, group: 'g' },
	},
	{
		call: Groups.list,
		input: {},
		method: 'GET',
		url: 'groups.json',
		data: {},
		output: { ...status, groups: [{ group: 'g', name: 'on call' }] },
	},
	{
		call: Groups.get,
		input: { group: 'g' },
		method: 'GET',
		url: 'groups/g.json',
		data: {},
		output: {
			...status,
			name: 'on call',
			users: [{ user: 'u', device: null, memo: null, disabled: false }],
		},
	},
	{
		call: Groups.addUser,
		input: { group: 'g', user: 'u', memo: 'person' },
		method: 'POST',
		url: 'groups/g/add_user.json',
		data: { user: 'u', memo: 'person' },
		output: status,
	},
	{
		call: Groups.removeUser,
		input: { group: 'g', user: 'u', device: 'phone' },
		method: 'POST',
		url: 'groups/g/remove_user.json',
		data: { user: 'u', device: 'phone' },
		output: status,
	},
	{
		call: Groups.disableUser,
		input: { group: 'g', user: 'u' },
		method: 'POST',
		url: 'groups/g/disable_user.json',
		data: { user: 'u' },
		output: status,
	},
	{
		call: Groups.enableUser,
		input: { group: 'g', user: 'u' },
		method: 'POST',
		url: 'groups/g/enable_user.json',
		data: { user: 'u' },
		output: status,
	},
	{
		call: Groups.rename,
		input: { group: 'g', name: 'new' },
		method: 'POST',
		url: 'groups/g/rename.json',
		data: { name: 'new' },
		output: status,
	},
	{
		call: Glances.update,
		input: { user: 'u', text: '', count: 0 },
		method: 'POST',
		url: 'glances.json',
		data: { user: 'u', text: '', count: 0 },
		output: status,
	},
	{
		call: Subscriptions.migrate,
		input: { subscription: 's', user: 'u', device_name: 'phone' },
		method: 'POST',
		url: 'subscriptions/migrate.json',
		data: { subscription: 's', user: 'u', device_name: 'phone' },
		output: { ...status, subscribed_user_key: 's1' },
	},
	{
		call: Licenses.get,
		input: {},
		method: 'GET',
		url: 'licenses.json',
		data: {},
		output: { ...status, credits: 5 },
	},
	{
		call: Licenses.assign,
		input: { user: 'u', os: 'iOS' },
		method: 'POST',
		url: 'licenses/assign.json',
		data: { user: 'u', os: 'iOS' },
		output: { ...status, credits: 4 },
	},
	{
		call: Teams.get,
		input: {},
		method: 'GET',
		url: 'teams.json',
		data: {},
		output: {
			...status,
			name: 'team',
			users: [
				{
					id: 'id',
					name: 'user',
					email: 'user@example.test',
					administrator: true,
					devices: [
						{
							name: 'phone',
							os: 'iOS',
							os_version: '26',
							enabled: true,
							administratively_disabled: false,
						},
					],
				},
			],
		},
	},
	{
		call: Teams.addUser,
		input: { email: 'user@example.test', admin: 'true' },
		method: 'POST',
		url: 'teams/add_user.json',
		data: { email: 'user@example.test', admin: 'true' },
		output: status,
	},
	{
		call: Teams.revokeInvitation,
		input: { email: 'user@example.test' },
		method: 'POST',
		url: 'teams/revoke_invitation.json',
		data: { email: 'user@example.test' },
		output: status,
	},
	{
		call: Teams.removeUser,
		input: { email: 'user@example.test' },
		method: 'POST',
		url: 'teams/remove_user.json',
		data: { email: 'user@example.test' },
		output: status,
	},
];

beforeEach(() => requestMock.mockReset());
test.each(cases)(
	'$method $url sends the documented request and parses its response',
	async ({ call, input, method, url, data, output }) => {
		requestMock.mockResolvedValue(output);
		expect(await call(ctx, input as never)).toEqual(output);
		const [config, options, retry] = requestMock.mock.calls[0];
		expect(config.BASE).toBe('https://api.pushover.net/1');
		expect(config.TOKEN).toBeUndefined();
		expect(options).toEqual(
			method === 'GET'
				? { method, url, query: { ...data, token: 'test-token' } }
				: {
						method,
						url,
						body: { ...data, token: 'test-token' },
						mediaType: 'application/json',
					},
		);
		expect(retry.rateLimitConfig).toMatchObject({
			enabled: true,
			maxRetries: 0,
		});
	},
);

test('registers every documented operation', () => {
	expect(Object.keys(pushoverEndpointSchemas)).toHaveLength(23);
	expect(pushover().webhooks).toEqual({});
});
test.each(['', '.', '..', 'a/b', 'a\\b', 'a"b', "a'b"])(
	'rejects unsafe path %s',
	async (group) => {
		await expect(Groups.get(ctx, { group })).rejects.toThrow();
		expect(requestMock).not.toHaveBeenCalled();
	},
);
test('rejects invalid inputs before issuing requests', async () => {
	await expect(
		Messages.send(ctx, { user: 'u', message: 'x', priority: 2 }),
	).rejects.toThrow();
	await expect(Glances.update(ctx, { user: 'u' })).rejects.toThrow();
	await expect(Licenses.assign(ctx, {})).rejects.toThrow();
	await expect(
		Messages.send(ctx, { user: 'u', message: 'x', attachment_base64: 'AA==' }),
	).rejects.toThrow();
	expect(requestMock).not.toHaveBeenCalled();
});
test('rejects missing credentials and malformed output', async () => {
	await expect(Sounds.list({ key: '' } as never, {})).rejects.toThrow();
	requestMock.mockResolvedValue({ status: 0, request: 'r' });
	await expect(Sounds.list(ctx, {})).rejects.toThrow();
});
test('schemas preserve clearing a glance field', () => {
	expect(
		PushoverEndpointInputSchemas.glancesUpdate.parse({
			user: 'u',
			percent: '',
		}),
	).toEqual({ user: 'u', percent: '' });
});
