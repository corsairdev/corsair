import { ApiError } from 'corsair/http';
import {
	createModalClient,
	setModalSdkLoader,
	toModalApiError,
	withModal,
} from './client';

const sdk = jest.requireActual('modal');

describe('createModalClient (real SDK, no network)', () => {
	const saved = { ...process.env };
	afterEach(() => {
		process.env = { ...saved };
	});

	it('ignores the host MODAL_* variables', () => {
		process.env.MODAL_TOKEN_ID = 'ak-host';
		process.env.MODAL_TOKEN_SECRET = 'as-host';
		process.env.MODAL_ENVIRONMENT = 'host-env';
		const client = createModalClient(sdk, {
			tokenId: 'ak-tenant',
			tokenSecret: 'as-tenant',
		});
		try {
			expect(client.profile.tokenId).toBe('ak-tenant');
			expect(client.profile.tokenSecret).toBe('as-tenant');
			// no environment: the server default, not the host's
			expect(client.environmentName()).toBe('');
		} finally {
			client.close();
		}
	});

	it('uses the account environment when set', () => {
		process.env.MODAL_ENVIRONMENT = 'host-env';
		const client = createModalClient(sdk, {
			tokenId: 'ak-tenant',
			tokenSecret: 'as-tenant',
			environment: 'dev',
		});
		try {
			expect(client.environmentName()).toBe('dev');
			expect(client.environmentName('other')).toBe('other');
		} finally {
			client.close();
		}
	});
});

describe('toModalApiError', () => {
	it.each([
		[5, 404],
		[6, 409],
		[7, 403],
		[8, 429],
		[16, 401],
		[3, 400],
		[14, 503],
	])('gRPC code %i becomes HTTP %i', (code, status) => {
		const grpcError = Object.assign(new Error('raw'), {
			code,
			details: 'detail text',
		});
		const error = toModalApiError(grpcError, 'apps.get', sdk) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(status);
		expect(error.message).toContain('detail text');
		expect(error.url).toBe('grpc://api.modal.com/apps.get');
	});

	it.each([
		['NotFoundError', 404],
		['AlreadyExistsError', 409],
		['InvalidError', 400],
		['ResourceExhaustedError', 429],
		['RemoteError', 502],
		['SandboxFilesystemNotFoundError', 404],
		['SandboxFilesystemError', 400],
		['TimeoutError', 504],
	])('%s becomes HTTP %i', (name, status) => {
		const error = toModalApiError(new sdk[name]('x'), 'op', sdk) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(status);
		expect(error.statusText).toBe(name);
	});

	it('leaves other errors alone', () => {
		const plain = new Error('zod said no');
		expect(toModalApiError(plain, 'op', sdk)).toBe(plain);
		expect(toModalApiError('text', 'op', sdk)).toBe('text');
	});

	it('keeps credentials out of the error', () => {
		const error = toModalApiError(
			new sdk.NotFoundError('App not found'),
			'apps.get',
			sdk,
		) as ApiError;
		const text = JSON.stringify({ ...error, message: error.message });
		expect(text).not.toContain('as-');
		expect(error.request).toEqual({
			method: 'POST',
			url: 'grpc://api.modal.com/apps.get',
		});
	});
});

describe('withModal', () => {
	afterEach(() => setModalSdkLoader(undefined));

	it('closes the client when the operation throws', async () => {
		const closed: boolean[] = [];
		class FakeClient {
			profile = {};
			close() {
				closed.push(true);
			}
		}
		setModalSdkLoader(async () => ({ ...sdk, ModalClient: FakeClient }));
		await expect(
			withModal({ tokenId: 'a', tokenSecret: 'b' }, 'apps.get', async () => {
				throw new sdk.NotFoundError('nope');
			}),
		).rejects.toMatchObject({ status: 404 });
		expect(closed).toEqual([true]);
	});
});
