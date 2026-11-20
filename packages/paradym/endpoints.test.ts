import { logEventFromContext } from 'corsair/core';
import {
	CredentialTemplates,
	Issuance,
	Revocation,
	TrustedEntities,
	Verification,
	Wallets,
	Webhooks,
} from './endpoints';
import { resolveWalletId } from './endpoints/call';
import {
	issuanceSession,
	verificationSession,
	wallet,
	webhookSubscriptionCreated,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'pd-test-key';
const WALLET_ID = '8f2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(
	endpoint: AnyEndpoint,
	input: unknown,
	walletId: string | null = WALLET_ID,
) {
	return endpoint(
		{
			key: API_KEY,
			options: {},
			keys: { get_wallet_id: () => Promise.resolve(walletId) },
		} as never,
		input as never,
	);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
		}),
	);
}

// unknown: a rejection can be any value until the message check narrows it.
async function rejects(
	endpoint: AnyEndpoint,
	input: unknown,
	match: string,
	walletId: string | null = WALLET_ID,
): Promise<void> {
	await expect(invoke(endpoint, input, walletId)).rejects.toThrow(match);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('parses a wallet list page with its pagination meta', async () => {
		respond({
			data: [wallet],
			meta: { page: { maxSize: '100', size: '1', after: 'cursor-next' } },
		});
		const page = (await invoke(Wallets.list, {})) as {
			data: Array<{ id: string }>;
			meta: { page?: { after?: string | null } };
		};
		expect(page.data[0]?.id).toBe(wallet.id);
		expect(page.meta.page?.after).toBe('cursor-next');
	});

	it('parses a created issuance offer with its URIs', async () => {
		respond(issuanceSession, 201);
		const session = (await invoke(Issuance.createOffer, {
			credentials: [{ credentialTemplateId: 'tmpl_1' }],
		})) as { offerUri?: string };
		expect(session.offerUri).toContain('issuance_1');
	});

	it('parses a verification session', async () => {
		respond(verificationSession);
		const session = (await invoke(Verification.createRequest, {
			presentationTemplateId: 'pres_1',
		})) as { authorizationRequestUri?: string };
		expect(session.authorizationRequestUri).toContain('verification_1');
	});

	it('parses a created webhook subscription with its secret', async () => {
		respond(webhookSubscriptionCreated, 201);
		const subscription = (await invoke(Webhooks.createSubscription, {
			name: 'Deal desk',
			url: 'https://example.com/webhooks/paradym',
			eventTypes: ['openid4vc.issuance.completed'],
		})) as { signatureSecret?: string };
		expect(subscription.signatureSecret).toBe('whsec_value');
	});

	it('rejects a wallet with no id', async () => {
		respond({ name: 'No id', ownerId: 'u' });
		await rejects(Wallets.get, { walletId: 'x' }, 'id');
	});

	it('rejects a list page whose data are bare strings', async () => {
		respond({ data: ['row'] });
		await rejects(Wallets.list, {}, 'expected object');
	});
});

describe('input validation', () => {
	it('rejects a wallet update with no fields', async () => {
		await rejects(Wallets.update, { walletId: 'w' }, 'at least one of name');
	});

	it('rejects a trusted entity with neither DIDs nor certificates', async () => {
		await rejects(
			TrustedEntities.create,
			{ name: 'Nobody' },
			'at least one DID',
		);
	});

	it('rejects a credential template create without attributes', async () => {
		await rejects(
			CredentialTemplates.create,
			{ type: 'urn:eudi:pid:1', name: 'PID' },
			'attributes',
		);
	});

	it('rejects a revocation with an empty id list', async () => {
		await rejects(
			Revocation.batch,
			{ issuedCredentialIds: [] },
			'issuedCredentialIds',
		);
	});
});

describe('wallet resolution', () => {
	it('fails a wallet-scoped call before any request when no wallet is configured', async () => {
		await rejects(
			Issuance.getSession,
			{ issuanceId: 'x' },
			'No Paradym wallet',
			null,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('prefers the option wallet id over the stored one', async () => {
		const ctx = {
			key: API_KEY,
			options: { walletId: 'wallet_option' },
			keys: { get_wallet_id: () => Promise.resolve('wallet_stored') },
		} as never;
		const walletId = await resolveWalletId(ctx);
		expect(walletId).toBe('wallet_option');
	});
});

describe('204 responses', () => {
	it('rejects an archive that answers a body instead of the documented 204', async () => {
		respond({ archived: true });
		await rejects(
			CredentialTemplates.archive,
			{ credentialTemplateId: 'tmpl_1' },
			'unexpected body',
		);
	});

	it('accepts an empty 204 for a delete', async () => {
		respond(undefined, 204);
		const result = (await invoke(TrustedEntities.remove, {
			trustedEntityId: 'te_1',
		})) as { success: boolean };
		expect(result.success).toBe(true);
	});
});
