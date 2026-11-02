import { request } from 'corsair/http';
import {
	createGoogleLogin,
	createGoogleLoginGroup,
	deleteGoogleLogin,
	deleteGoogleLoginGroup,
	googleLoginSchemas,
	listGoogleLoginGroups,
	listGoogleLogins,
	partialUpdateGoogleLogin,
	partialUpdateGoogleLoginGroup,
	retrieveGoogleLogin,
	retrieveGoogleLoginGroup,
	updateGoogleLogin,
	updateGoogleLoginGroup,
} from './endpoints/google-logins';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));

const groupId = '550e8400-e29b-41d4-a716-446655440000';
const loginId = '550e8400-e29b-41d4-a716-446655440001';
const group = {
	id: groupId,
	name: 'Primary',
	login_mode: 'always',
	created_at: '2026-01-01T00:00:00Z',
	updated_at: '2026-01-01T00:00:00Z',
	logins: [],
};
const login = {
	id: loginId,
	email: 'bot@example.com',
	is_active: true,
	sso_v2_workspace_domain: 'example.com',
	sso_v2_private_key: 'private-key',
	sso_v2_cert: 'certificate',
	group_id: groupId,
	created_at: '2026-01-01T00:00:00Z',
	updated_at: '2026-01-01T00:00:00Z',
};
const page = <T>(value: T) => ({
	next: null,
	previous: null,
	results: [value],
});
const context = {
	key: 'recall-key',
	options: { region: 'eu-central-1' },
	$getAccountId: () => 'test-account',
} as never;

describe('Recall.ai Google login endpoints', () => {
	beforeEach(() => jest.mocked(request).mockReset());

	it('exports runtime contracts for all twelve routes', () => {
		expect(Object.keys(googleLoginSchemas)).toEqual([
			'listGoogleLoginGroups',
			'createGoogleLoginGroup',
			'retrieveGoogleLoginGroup',
			'updateGoogleLoginGroup',
			'partialUpdateGoogleLoginGroup',
			'deleteGoogleLoginGroup',
			'listGoogleLogins',
			'createGoogleLogin',
			'retrieveGoogleLogin',
			'updateGoogleLogin',
			'partialUpdateGoogleLogin',
			'deleteGoogleLogin',
		]);
		for (const contract of Object.values(googleLoginSchemas)) {
			expect(typeof contract.input.safeParse).toBe('function');
			expect(typeof contract.output.safeParse).toBe('function');
		}
	});

	it('sends exact methods, paths, region, query, auth, and bodies for all routes', async () => {
		const httpRequest = jest.mocked(request);
		httpRequest
			.mockResolvedValueOnce(page(group))
			.mockResolvedValueOnce(group)
			.mockResolvedValueOnce(group)
			.mockResolvedValueOnce(group)
			.mockResolvedValueOnce(group)
			.mockResolvedValueOnce(undefined)
			.mockResolvedValueOnce(page(login))
			.mockResolvedValueOnce(login)
			.mockResolvedValueOnce(login)
			.mockResolvedValueOnce(login)
			.mockResolvedValueOnce(login)
			.mockResolvedValueOnce(undefined);

		await listGoogleLoginGroups(context, {
			cursor: 'group-cursor',
			name: 'Primary',
			name__contains: 'rim',
			ordering: '-created_at',
		});
		await createGoogleLoginGroup(context, {
			name: 'Primary',
			login_mode: 'always',
		});
		await retrieveGoogleLoginGroup(context, { id: groupId });
		await updateGoogleLoginGroup(context, {
			id: groupId,
			name: 'Primary',
			login_mode: 'only_if_required',
		});
		await partialUpdateGoogleLoginGroup(context, {
			id: groupId,
			login_mode: 'always',
		});
		await deleteGoogleLoginGroup(context, { id: groupId });

		await listGoogleLogins(context, {
			cursor: 'login-cursor',
			email: 'bot@example.com',
			group_id: groupId,
			is_active: false,
			ordering: 'email',
			sso_v2_workspace_domain: 'example.com',
		});
		await createGoogleLogin(context, {
			email: 'bot@example.com',
			group_id: groupId,
			sso_v2_workspace_domain: 'example.com',
			sso_v2_private_key: 'private-key',
			sso_v2_cert: 'certificate',
			is_active: false,
		});
		await retrieveGoogleLogin(context, { id: loginId });
		await updateGoogleLogin(context, {
			id: loginId,
			email: 'bot@example.com',
			group_id: groupId,
			sso_v2_workspace_domain: 'example.com',
			sso_v2_private_key: 'private-key',
			sso_v2_cert: 'certificate',
		});
		await partialUpdateGoogleLogin(context, { id: loginId, is_active: false });
		await deleteGoogleLogin(context, { id: loginId });

		const calls = httpRequest.mock.calls.map(([config, options]) => ({
			base: config.BASE,
			apiKey: config.TOKEN,
			authorization:
				typeof config.HEADERS === 'function'
					? undefined
					: config.HEADERS?.Authorization,
			method: options.method,
			path: options.url,
			query: options.query,
			body: options.body,
		}));
		expect(calls).toEqual([
			{
				base: 'https://eu-central-1.recall.ai',
				apiKey: undefined,
				authorization: 'Token recall-key',
				method: 'GET',
				path: '/api/v2/google-login-groups/',
				query: {
					cursor: 'group-cursor',
					name: 'Primary',
					name__contains: 'rim',
					ordering: '-created_at',
				},
				body: undefined,
			},
			{
				base: 'https://eu-central-1.recall.ai',
				apiKey: undefined,
				authorization: 'Token recall-key',
				method: 'POST',
				path: '/api/v2/google-login-groups/',
				query: undefined,
				body: { name: 'Primary', login_mode: 'always' },
			},
			{
				base: 'https://eu-central-1.recall.ai',
				apiKey: undefined,
				authorization: 'Token recall-key',
				method: 'GET',
				path: `/api/v2/google-login-groups/${groupId}/`,
				query: undefined,
				body: undefined,
			},
			{
				base: 'https://eu-central-1.recall.ai',
				apiKey: undefined,
				authorization: 'Token recall-key',
				method: 'PUT',
				path: `/api/v2/google-login-groups/${groupId}/`,
				query: undefined,
				body: { name: 'Primary', login_mode: 'only_if_required' },
			},
			{
				base: 'https://eu-central-1.recall.ai',
				apiKey: undefined,
				authorization: 'Token recall-key',
				method: 'PATCH',
				path: `/api/v2/google-login-groups/${groupId}/`,
				query: undefined,
				body: { login_mode: 'always' },
			},
			{
				base: 'https://eu-central-1.recall.ai',
				apiKey: undefined,
				authorization: 'Token recall-key',
				method: 'DELETE',
				path: `/api/v2/google-login-groups/${groupId}/`,
				query: undefined,
				body: undefined,
			},
			{
				base: 'https://eu-central-1.recall.ai',
				apiKey: undefined,
				authorization: 'Token recall-key',
				method: 'GET',
				path: '/api/v2/google-logins/',
				query: {
					cursor: 'login-cursor',
					email: 'bot@example.com',
					group_id: groupId,
					is_active: false,
					ordering: 'email',
					sso_v2_workspace_domain: 'example.com',
				},
				body: undefined,
			},
			{
				base: 'https://eu-central-1.recall.ai',
				apiKey: undefined,
				authorization: 'Token recall-key',
				method: 'POST',
				path: '/api/v2/google-logins/',
				query: undefined,
				body: {
					email: 'bot@example.com',
					group_id: groupId,
					sso_v2_workspace_domain: 'example.com',
					sso_v2_private_key: 'private-key',
					sso_v2_cert: 'certificate',
					is_active: false,
				},
			},
			{
				base: 'https://eu-central-1.recall.ai',
				apiKey: undefined,
				authorization: 'Token recall-key',
				method: 'GET',
				path: `/api/v2/google-logins/${loginId}/`,
				query: undefined,
				body: undefined,
			},
			{
				base: 'https://eu-central-1.recall.ai',
				apiKey: undefined,
				authorization: 'Token recall-key',
				method: 'PUT',
				path: `/api/v2/google-logins/${loginId}/`,
				query: undefined,
				body: {
					email: 'bot@example.com',
					group_id: groupId,
					sso_v2_workspace_domain: 'example.com',
					sso_v2_private_key: 'private-key',
					sso_v2_cert: 'certificate',
				},
			},
			{
				base: 'https://eu-central-1.recall.ai',
				apiKey: undefined,
				authorization: 'Token recall-key',
				method: 'PATCH',
				path: `/api/v2/google-logins/${loginId}/`,
				query: undefined,
				body: { is_active: false },
			},
			{
				base: 'https://eu-central-1.recall.ai',
				apiKey: undefined,
				authorization: 'Token recall-key',
				method: 'DELETE',
				path: `/api/v2/google-logins/${loginId}/`,
				query: undefined,
				body: undefined,
			},
		]);
	});

	it('requires complete PUT bodies while allowing partial PATCH bodies', () => {
		expect(
			googleLoginSchemas.updateGoogleLoginGroup.input.safeParse({
				id: groupId,
				name: 'Primary',
			}).success,
		).toBe(false);
		expect(
			googleLoginSchemas.partialUpdateGoogleLoginGroup.input.safeParse({
				id: groupId,
				login_mode: 'always',
			}).success,
		).toBe(true);
		expect(
			googleLoginSchemas.updateGoogleLogin.input.safeParse({
				id: loginId,
				email: 'bot@example.com',
			}).success,
		).toBe(false);
		expect(
			googleLoginSchemas.partialUpdateGoogleLogin.input.safeParse({
				id: loginId,
				is_active: false,
			}).success,
		).toBe(true);
	});

	it('rejects missing or unsafe path IDs before the HTTP request', async () => {
		await expect(
			retrieveGoogleLoginGroup(context, { id: '../group' }),
		).rejects.toThrow();
		await expect(deleteGoogleLogin(context, { id: '' })).rejects.toThrow();
		expect(jest.mocked(request)).not.toHaveBeenCalled();
	});

	it('validates provider responses before returning them', async () => {
		const httpRequest = jest.mocked(request);
		httpRequest.mockResolvedValueOnce({
			next: null,
			previous: null,
			results: [],
		});
		await expect(listGoogleLoginGroups(context, {})).resolves.toEqual({
			next: null,
			previous: null,
			results: [],
		});
		httpRequest.mockResolvedValueOnce({
			next: null,
			previous: null,
			results: [{ id: 'not-a-uuid' }],
		});
		await expect(listGoogleLogins(context, {})).rejects.toThrow();
	});
});
