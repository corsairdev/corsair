import { logEventFromContext } from 'corsair/core';
import {
	CredentialTemplates,
	Issuance,
	PresentationTemplates,
	Revocation,
	TrustedEntities,
	Verification,
	Wallets,
	Webhooks,
} from './endpoints';
import {
	batchRevokeResponse,
	credentialTemplate,
	credentialTemplatesList,
	issuanceList,
	issuanceSession,
	trustedEntitiesList,
	trustedEntity,
	verificationList,
	verificationSession,
	wallet,
	walletsList,
	webhookDelivery,
	webhookDeliveryList,
	webhookSubscriptionCreated,
	webhookSubscriptionList,
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
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key and the
	// stored wallet id).
	return endpoint(
		{
			key: API_KEY,
			options: {},
			keys: { get_wallet_id: () => Promise.resolve(WALLET_ID) },
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

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: decodeURIComponent(parsed.pathname),
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body === undefined ? undefined : String(init.body),
	};
}

function expectAuthenticated(path: string) {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.paradym.id');
	expect(sent.path).toBe(path);
	expect(sent.headers.get('x-access-token')).toBe(API_KEY);
}

function expectWalletScoped(path: string) {
	expectAuthenticated(`/v1/wallets/${WALLET_ID}${path}`);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('wallets', () => {
	it('list GETs wallets with its filters, without a wallet id', async () => {
		respond(walletsList);
		await invoke(Wallets.list, {
			searchName: 'Government',
			filterName: 'Government wallet',
			sort: '-createdAt',
			pageSize: 10,
		});

		const sent = lastRequest();
		expectAuthenticated('/v1/wallets');
		expect(sent.query['search[name]']).toBe('Government');
		expect(sent.query['filter[name]']).toBe('Government wallet');
		expect(sent.query['sort']).toBe('-createdAt');
		expect(sent.query['page[size]']).toBe('10');
	});

	it('create POSTs the wallet body', async () => {
		respond(wallet, 201);
		await invoke(Wallets.create, {
			name: 'Government wallet',
			verificationDataAccess: 'once',
		});
		const sent = lastRequest();
		expectAuthenticated('/v1/wallets');
		expect(sent.method).toBe('POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			name: 'Government wallet',
			verificationDataAccess: 'once',
		});
	});

	it('get reads one wallet by explicit id', async () => {
		respond({ data: [wallet], meta: {} });
		const result = (await invoke(Wallets.get, { walletId: 'wallet_9' })) as {
			id: string;
		};
		expect(result.id).toBe(wallet.id);
		// There is no GET /v1/wallets/{id}; the list is filtered by id.
		expectAuthenticated('/v1/wallets');
		expect(lastRequest().query).toEqual({ 'filter[id]': 'wallet_9' });
	});

	it('get answers a 404 ApiError when the filter finds no wallet', async () => {
		respond({ data: [], meta: {} });
		await expect(
			invoke(Wallets.get, { walletId: 'missing' }),
		).rejects.toMatchObject({ name: 'ApiError', status: 404 });
	});

	it('update PATCHes one wallet', async () => {
		respond({ ...wallet, name: 'Renamed' });
		await invoke(Wallets.update, { walletId: 'wallet_9', name: 'Renamed' });
		const sent = lastRequest();
		expectAuthenticated('/v1/wallets/wallet_9');
		expect(sent.method).toBe('PATCH');
		expect(JSON.parse(sent.body as string)).toEqual({ name: 'Renamed' });
	});
});

describe('credentialTemplates', () => {
	it('list GETs the sd-jwt-vc templates under the scoped wallet', async () => {
		respond(credentialTemplatesList);
		await invoke(CredentialTemplates.list, { sort: 'name' });
		expectWalletScoped('/templates/credentials/sd-jwt-vc');
		expect(lastRequest().query['sort']).toBe('name');
	});

	it('create POSTs the template body', async () => {
		respond(credentialTemplate, 201);
		await invoke(CredentialTemplates.create, {
			type: 'urn:eudi:pid:1',
			name: 'PID',
			attributes: {
				given_name: { name: 'given_name', required: true },
			},
			revocable: true,
		});
		const sent = lastRequest();
		expectWalletScoped('/templates/credentials/sd-jwt-vc');
		expect(sent.method).toBe('POST');
		// unknown: the request body is parsed JSON whose keys are
		// provider-defined, so the test narrows per assertion.
		const body = JSON.parse(sent.body as string) as Record<string, unknown>;
		expect(body['type']).toBe('urn:eudi:pid:1');
		expect(body['attributes']).toEqual({
			given_name: { name: 'given_name', required: true },
		});
	});

	it('get reads one template', async () => {
		respond(credentialTemplate);
		await invoke(CredentialTemplates.get, { credentialTemplateId: 'tmpl_1' });
		expectWalletScoped('/templates/credentials/sd-jwt-vc/tmpl_1');
	});

	it('update PUTs the template body', async () => {
		respond(credentialTemplate);
		await invoke(CredentialTemplates.update, {
			credentialTemplateId: 'tmpl_1',
			name: 'PID v2',
			attributes: { given_name: { name: 'given_name', required: true } },
		});
		const sent = lastRequest();
		expectWalletScoped('/templates/credentials/sd-jwt-vc/tmpl_1');
		expect(sent.method).toBe('PUT');
		expect(JSON.parse(sent.body as string)).toEqual({
			name: 'PID v2',
			attributes: { given_name: { name: 'given_name', required: true } },
		});
		// type and revocable cannot change, and a name-only body is incomplete.
		await expect(
			invoke(CredentialTemplates.update, {
				credentialTemplateId: 'tmpl_1',
				name: 'PID v2',
			}),
		).rejects.toThrow();
	});

	it('archive DELETEs the template', async () => {
		respond(undefined, 204);
		const result = (await invoke(CredentialTemplates.archive, {
			credentialTemplateId: 'tmpl_1',
		})) as { id: string; success: boolean };
		expect(result).toEqual({ id: 'tmpl_1', success: true });
		expectWalletScoped('/templates/credentials/sd-jwt-vc/tmpl_1');
		expect(lastRequest().method).toBe('DELETE');
	});

	it('unarchive POSTs to the unarchive route and accepts the empty 204', async () => {
		respond(undefined, 204);
		const result = await invoke(CredentialTemplates.unarchive, {
			credentialTemplateId: 'tmpl_1',
		});
		expect(result).toEqual({ credentialTemplateId: 'tmpl_1', success: true });
		expectWalletScoped('/templates/credentials/sd-jwt-vc/tmpl_1/unarchive');
	});
});

describe('presentationTemplates', () => {
	it('list GETs the presentation templates', async () => {
		respond({ data: [], meta: {} });
		await invoke(PresentationTemplates.list, {});
		expectWalletScoped('/templates/presentations');
	});

	it('create POSTs the template body', async () => {
		respond({ id: 'pres_1', name: 'PID check' }, 201);
		await invoke(PresentationTemplates.create, {
			name: 'PID check',
			credentials: [
				{
					type: 'urn:eudi:pid:1',
					format: 'sd-jwt-vc',
					attributes: { given_name: {} },
				},
			],
		});
		const sent = lastRequest();
		expectWalletScoped('/templates/presentations');
		// unknown: parsed JSON with provider-defined keys.
		const body = JSON.parse(sent.body as string) as Record<string, unknown>;
		expect(body['name']).toBe('PID check');
		expect(body['credentials']).toHaveLength(1);
	});

	it('get reads one template', async () => {
		respond({ id: 'pres_1', name: 'PID check' });
		await invoke(PresentationTemplates.get, {
			presentationTemplateId: 'pres_1',
		});
		expectWalletScoped('/templates/presentations/pres_1');
	});

	it('update PUTs the template body', async () => {
		respond({ id: 'pres_1', name: 'Renamed' });
		const credentials = [
			{
				format: 'anoncreds',
				schema: 'schema-id',
				attributes: { name: { type: 'string' } },
			},
		];
		await invoke(PresentationTemplates.update, {
			presentationTemplateId: 'pres_1',
			name: 'Renamed',
			credentials,
		});
		const sent = lastRequest();
		expectWalletScoped('/templates/presentations/pres_1');
		expect(sent.method).toBe('PUT');
		expect(JSON.parse(sent.body as string)).toEqual({
			name: 'Renamed',
			credentials,
		});
		// An AnonCreds credential needs a schema, not a type.
		await expect(
			invoke(PresentationTemplates.update, {
				presentationTemplateId: 'pres_1',
				name: 'Renamed',
				credentials: [{ format: 'anoncreds', attributes: {} }],
			}),
		).rejects.toThrow();
	});

	it('archive DELETEs the template', async () => {
		respond(undefined, 204);
		const result = (await invoke(PresentationTemplates.archive, {
			presentationTemplateId: 'pres_1',
		})) as { id: string; success: boolean };
		expect(result).toEqual({ id: 'pres_1', success: true });
		expectWalletScoped('/templates/presentations/pres_1');
	});
});

describe('issuance', () => {
	it('listSessions GETs the issuance sessions', async () => {
		respond(issuanceList);
		await invoke(Issuance.listSessions, {
			filterStatus: 'offered',
			pageAfter: 'cursor-1',
		});
		expectWalletScoped('/openid4vc/issuance');
		expect(lastRequest().query['filter[status]']).toBe('offered');
		expect(lastRequest().query['page[after]']).toBe('cursor-1');
	});

	it('createOffer POSTs the offer body', async () => {
		respond(issuanceSession, 201);
		await invoke(Issuance.createOffer, {
			credentials: [
				{ credentialTemplateId: 'tmpl_1', attributes: { given_name: 'Jane' } },
			],
			expirationInMinutes: 15,
		});
		const sent = lastRequest();
		expectWalletScoped('/openid4vc/issuance/offer');
		expect(JSON.parse(sent.body as string)).toEqual({
			credentials: [
				{ credentialTemplateId: 'tmpl_1', attributes: { given_name: 'Jane' } },
			],
			expirationInMinutes: 15,
		});
	});

	it('getSession reads one session', async () => {
		respond(issuanceSession);
		await invoke(Issuance.getSession, { issuanceId: 'issuance_1' });
		expectWalletScoped('/openid4vc/issuance/issuance_1');
	});
});

describe('verification', () => {
	it('listSessions GETs the verification sessions', async () => {
		respond(verificationList);
		await invoke(Verification.listSessions, {});
		expectWalletScoped('/openid4vc/verification');
	});

	it('createRequest POSTs the request body', async () => {
		respond(verificationSession, 201);
		await invoke(Verification.createRequest, {
			presentationTemplateId: 'pres_1',
			expirationInMinutes: 10,
			challenge: 'nonce-123',
		});
		const sent = lastRequest();
		expectWalletScoped('/openid4vc/verification/request');
		expect(JSON.parse(sent.body as string)).toEqual({
			presentationTemplateId: 'pres_1',
			expirationInMinutes: 10,
			challenge: 'nonce-123',
		});
	});

	it('getSession reads one session', async () => {
		respond(verificationSession);
		await invoke(Verification.getSession, { verificationId: 'verification_1' });
		expectWalletScoped('/openid4vc/verification/verification_1');
	});

	it('complete POSTs to the complete route', async () => {
		respond({ ...verificationSession, status: 'verified' });
		await invoke(Verification.complete, {
			verificationId: 'verification_1',
			challenge: 'challenge-1',
			responseCode: 'code-1',
		});
		expectWalletScoped('/openid4vc/verification/verification_1/complete');
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			challenge: 'challenge-1',
			responseCode: 'code-1',
		});
	});
});

describe('revocation', () => {
	it('batch POSTs the revocation body', async () => {
		respond(batchRevokeResponse);
		const result = (await invoke(Revocation.batch, {
			issuedCredentialIds: ['cred_1', 'cred_2'],
			notifyWallet: true,
			// unknown: revoked credential records are provider-defined, so the
			// cast keeps them open.
		})) as { revokedCredentials: unknown[] };
		expect(result.revokedCredentials).toHaveLength(2);
		const sent = lastRequest();
		expectWalletScoped('/revocation/batch');
		expect(JSON.parse(sent.body as string)).toEqual({
			issuedCredentialIds: ['cred_1', 'cred_2'],
			notifyWallet: true,
		});
	});
});

describe('trustedEntities', () => {
	it('list GETs the trusted entities', async () => {
		respond(trustedEntitiesList);
		await invoke(TrustedEntities.list, {});
		expectWalletScoped('/trusted-entities');
	});

	it('create POSTs the trusted entity body', async () => {
		respond(trustedEntity, 201);
		await invoke(TrustedEntities.create, {
			name: 'Government issuer',
			dids: [{ did: 'did:web:example.gov' }],
		});
		const sent = lastRequest();
		expectWalletScoped('/trusted-entities');
		expect(JSON.parse(sent.body as string)).toEqual({
			name: 'Government issuer',
			dids: [{ did: 'did:web:example.gov' }],
		});
	});

	it('get reads one trusted entity', async () => {
		respond(trustedEntity);
		await invoke(TrustedEntities.get, { trustedEntityId: 'te_1' });
		expectWalletScoped('/trusted-entities/te_1');
	});

	it('delete DELETEs the trusted entity', async () => {
		respond(undefined, 204);
		const result = (await invoke(TrustedEntities.remove, {
			trustedEntityId: 'te_1',
		})) as { id: string; success: boolean };
		expect(result).toEqual({ id: 'te_1', success: true });
	});
});

describe('webhooks', () => {
	it('listSubscriptions GETs the subscriptions', async () => {
		respond(webhookSubscriptionList);
		const result = (await invoke(Webhooks.listSubscriptions, {
			pageSize: 10,
			pageAfter: 'cursor-1',
		})) as {
			// unknown: subscription objects are provider-defined, so the cast
			// keeps them open.
			data: unknown[];
		};
		expect(result.data).toHaveLength(1);
		expectWalletScoped('/webhooks');
		expect(lastRequest().query).toMatchObject({
			'page[size]': '10',
			'page[after]': 'cursor-1',
		});
	});

	it('createSubscription POSTs the subscription body', async () => {
		respond(webhookSubscriptionCreated, 201);
		await invoke(Webhooks.createSubscription, {
			name: 'Deal desk',
			url: 'https://example.com/webhooks/paradym',
			eventTypes: ['openid4vc.issuance.completed'],
		});
		const sent = lastRequest();
		expectWalletScoped('/webhooks');
		expect(JSON.parse(sent.body as string)).toEqual({
			name: 'Deal desk',
			url: 'https://example.com/webhooks/paradym',
			eventTypes: ['openid4vc.issuance.completed'],
		});
	});

	it('deleteSubscription DELETEs by id', async () => {
		respond(undefined, 204);
		const result = (await invoke(Webhooks.deleteSubscription, {
			webhookSubscriptionId: 'whs_1',
		})) as { id: string; success: boolean };
		expect(result).toEqual({ id: 'whs_1', success: true });
	});

	it('listDeliveries GETs the deliveries', async () => {
		respond(webhookDeliveryList);
		await invoke(Webhooks.listDeliveries, { filterStatus: 'failed' });
		expectWalletScoped('/webhooks/deliveries');
		expect(lastRequest().query['filter[status]']).toBe('failed');
	});

	it('getDelivery reads one delivery', async () => {
		respond(webhookDelivery);
		await invoke(Webhooks.getDelivery, { deliveryId: 'del_1' });
		expectWalletScoped('/webhooks/deliveries/del_1');
	});

	it('redeliverDelivery POSTs to the redeliver route', async () => {
		respond({ ...webhookDelivery, status: 'pending' });
		await invoke(Webhooks.redeliverDelivery, { deliveryId: 'del_1' });
		expectWalletScoped('/webhooks/deliveries/del_1/redeliver');
	});
});
