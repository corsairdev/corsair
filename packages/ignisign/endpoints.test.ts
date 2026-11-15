import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	ApplicationsEndpoints,
	BareSignaturesEndpoints,
	DocumentsEndpoints,
	LogCapsulesEndpoints,
	ProofsEndpoints,
	SealEndpoints,
	SignatureRequestsEndpoints,
	SignaturesEndpoints,
	SignerProfilesEndpoints,
	SignersEndpoints,
} from './endpoints';
import type { IgnisignContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeIgnisignRequest: jest.fn(),
		makeIgnisignBinaryRequest: jest.fn(),
	};
});

const mockedRequest = jest.mocked(client.makeIgnisignRequest);
const mockedBinaryRequest = jest.mocked(client.makeIgnisignBinaryRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function buildCtx(): IgnisignContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'sk_development_testapp123_sec',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('sk_development_testapp123_sec'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedBinaryRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('signatureRequests endpoints', () => {
	it('createInOneCall: sends payload and returns context', async () => {
		const mockResponse = {
			_id: 'sig_req_1',
			appId: 'appId_test',
			status: 'READY',
			title: 'Test Sign',
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const input = {
			title: 'Test Sign',
			signatureMethod: 'SIMPLE_STD',
			signers: [
				{
					email: 'signer@example.com',
					firstName: 'Bob',
					lastName: 'Ross',
				},
			],
			documents: [
				{
					originalName: 'test.pdf',
					mimeType: 'application/pdf',
					base64: 'JVBERi0xLjQK...',
				},
			],
		};

		const result = await SignatureRequestsEndpoints.createInOneCall(ctx, input);
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v4/signature-requests/one-call-sign',
			ctx.key,
			{
				method: 'POST',
				body: input,
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'ignisign.signatureRequests.createInOneCall',
			{ status: 'READY', signersCount: 1, documentsCount: 1 },
			'completed',
		);
	});

	it('init: initializes draft signature request', async () => {
		mockedRequest.mockResolvedValue({ signatureRequestId: 'sig_new_1' });
		const result = await SignatureRequestsEndpoints.init(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
		});
		expect(result).toEqual({ signatureRequestId: 'sig_new_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v4/applications/appId_1/envs/DEVELOPMENT/signature-requests',
			ctx.key,
			{ method: 'POST', body: {} },
		);
	});

	it('initSignerSetup: initializes signer setup session', async () => {
		mockedRequest.mockResolvedValue({ signatureRequestId: 'sig_setup_1' });
		const result = await SignatureRequestsEndpoints.initSignerSetup(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
		});
		expect(result).toEqual({ signatureRequestId: 'sig_setup_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v4/applications/appId_1/envs/DEVELOPMENT/signer-setup',
			ctx.key,
			{ method: 'POST', body: {} },
		);
	});

	it('list: retrieves paginated signature requests', async () => {
		const mockResponse = {
			signatureRequests: [{ _id: 'sig_1', status: 'COMPLETED' }],
			paginationData: { total: 1, page: 1, nbEventsPerPage: 10 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await SignatureRequestsEndpoints.list(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
			page: 2,
		});
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v4/applications/appId_1/envs/DEVELOPMENT/signature-requests',
			ctx.key,
			{ method: 'GET', query: { page: 2 } },
		);
	});

	it('getContext: fetches full signature request details', async () => {
		const mockResponse = {
			_id: 'sig_123',
			status: 'IN_PROGRESS',
			signers: [],
			documents: [],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await SignatureRequestsEndpoints.getContext(ctx, {
			signatureRequestId: 'sig_123',
		});
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v4/signature-requests/sig_123/context',
			ctx.key,
			{ method: 'GET' },
		);
	});

	it('update: modifies existing signature request', async () => {
		const mockResponse = { _id: 'sig_123', title: 'New Title' };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await SignatureRequestsEndpoints.update(ctx, {
			signatureRequestId: 'sig_123',
			title: 'New Title',
		});
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v4/signature-requests/sig_123',
			ctx.key,
			{ method: 'PUT', body: { title: 'New Title' } },
		);
	});

	it('publish: launches signature request', async () => {
		const mockResponse = {
			signatureRequestId: 'sig_123',
			signersBySide: [{ signerId: 'signer_1', signerExternalId: 'ext_1' }],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await SignatureRequestsEndpoints.publish(ctx, {
			signatureRequestId: 'sig_123',
		});
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v4/signature-requests/sig_123/publish',
			ctx.key,
			{ method: 'POST', body: {} },
		);
	});

	it('close: closes signature request', async () => {
		mockedRequest.mockResolvedValue({ signatureRequestId: 'sig_123' });
		const result = await SignatureRequestsEndpoints.close(ctx, {
			signatureRequestId: 'sig_123',
		});
		expect(result).toEqual({ signatureRequestId: 'sig_123' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v4/signature-requests/sig_123/close',
			ctx.key,
			{ method: 'POST', body: {} },
		);
	});

	it('getStatus: checks status of multiple signature requests', async () => {
		const mockResponse = {
			signatureRequests: [{ signatureRequestId: 'sig_1', status: 'READY' }],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await SignatureRequestsEndpoints.getStatus(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
			signatureRequestIds: ['sig_1'],
		});
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v4/applications/appId_1/envs/DEVELOPMENT/signature-requests/status',
			ctx.key,
			{ method: 'POST', body: { signatureRequestIds: ['sig_1'] } },
		);
	});

	it('rejects invalid input before making any network call', async () => {
		// `unknown` because rejection value has no static type.
		const error: unknown = await SignatureRequestsEndpoints.createInOneCall(
			ctx,
			{
				title: 'Bad Request',
				signatureMethod: 'SIMPLE_STD',
				signers: [],
				documents: [],
			},
		).catch((caught: unknown) => caught);

		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('signers endpoints', () => {
	it('create: creates a new signer', async () => {
		const mockResponse = {
			signerId: 'signer_new',
			entityType: 'NATURAL',
			success: true,
			alreadyExists: false,
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await SignersEndpoints.create(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
			email: 'user@example.com',
		});
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v4/applications/appId_1/envs/DEVELOPMENT/signers',
			ctx.key,
			{ method: 'POST', body: { email: 'user@example.com' } },
		);
	});

	it('getDetails: fetches signer details', async () => {
		const mockResponse = {
			signerId: 'signer_1',
			claims: [],
			latestSignatureRequests: [],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await SignersEndpoints.getDetails(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
			signerId: 'signer_1',
		});
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v4/applications/appId_1/envs/DEVELOPMENT/signers/signer_1/details',
			ctx.key,
			{ method: 'GET' },
		);
	});

	it('getSummary: fetches signer summary', async () => {
		const mockResponse = { signerId: 'signer_1', email: 'u@example.com' };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await SignersEndpoints.getSummary(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
			signerId: 'signer_1',
		});
		expect(result).toEqual(mockResponse);
	});

	it('update: modifies signer attributes', async () => {
		const mockResponse = { signerId: 'signer_1', success: true };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await SignersEndpoints.update(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
			signerId: 'signer_1',
			firstName: 'Jane',
		});
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v4/applications/appId_1/envs/DEVELOPMENT/signers/signer_1',
			ctx.key,
			{ method: 'PUT', body: { firstName: 'Jane' } },
		);
	});

	it('revoke: revokes signer', async () => {
		mockedRequest.mockResolvedValue({ signerId: 'signer_1' });
		const result = await SignersEndpoints.revoke(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
			signerId: 'signer_1',
		});
		expect(result).toEqual({ signerId: 'signer_1' });
	});

	it('regenerateAuthSecret: regenerates secret', async () => {
		mockedRequest.mockResolvedValue({ authSecret: 'new_secret_123' });
		const result = await SignersEndpoints.regenerateAuthSecret(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
			signerId: 'signer_1',
		});
		expect(result).toEqual({ authSecret: 'new_secret_123' });
	});

	it('search: searches signers by query', async () => {
		mockedRequest.mockResolvedValue({ signers: [], total: 0 });
		const result = await SignersEndpoints.search(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
			filter: 'john',
		});
		expect(result).toEqual({ signers: [], total: 0 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v4/applications/appId_1/envs/DEVELOPMENT/signers-search',
			ctx.key,
			{ method: 'GET', query: { filter: 'john' } },
		);
	});

	it('list: lists signers with pagination', async () => {
		mockedRequest.mockResolvedValue({ signers: [], total: 0 });
		const result = await SignersEndpoints.list(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
			page: 1,
		});
		expect(result).toEqual({ signers: [], total: 0 });
	});
});

describe('documents endpoints', () => {
	it('initialize: initializes document descriptor', async () => {
		mockedRequest.mockResolvedValue({ documentId: 'doc_1' });
		const result = await DocumentsEndpoints.initialize(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
			signatureRequestId: 'sig_1',
			label: 'Doc Label',
		});
		expect(result).toEqual({ documentId: 'doc_1' });
	});

	it('get: gets document by id', async () => {
		mockedRequest.mockResolvedValue({ _id: 'doc_1', status: 'PROVIDED' });
		const result = await DocumentsEndpoints.get(ctx, {
			documentId: 'doc_1',
		});
		expect(result).toEqual({ _id: 'doc_1', status: 'PROVIDED' });
	});

	it('getContext: gets document context', async () => {
		mockedRequest.mockResolvedValue({ _id: 'doc_1', statements: [] });
		const result = await DocumentsEndpoints.getContext(ctx, {
			documentId: 'doc_1',
		});
		expect(result).toEqual({ _id: 'doc_1', statements: [] });
	});

	it('update: updates document metadata', async () => {
		mockedRequest.mockResolvedValue({ _id: 'doc_1', label: 'Updated' });
		const result = await DocumentsEndpoints.update(ctx, {
			documentId: 'doc_1',
			label: 'Updated',
		});
		expect(result).toEqual({ _id: 'doc_1', label: 'Updated' });
	});

	it('remove: deletes document', async () => {
		mockedRequest.mockResolvedValue({ documentId: 'doc_1' });
		const result = await DocumentsEndpoints.remove(ctx, {
			documentId: 'doc_1',
		});
		expect(result).toEqual({ documentId: 'doc_1' });
	});

	it('removeContent: deletes document content', async () => {
		mockedRequest.mockResolvedValue({ _id: 'doc_1' });
		const result = await DocumentsEndpoints.removeContent(ctx, {
			documentId: 'doc_1',
		});
		expect(result).toEqual({ _id: 'doc_1' });
	});

	it('provideJsonContent: provides structured JSON content', async () => {
		mockedRequest.mockResolvedValue({ _id: 'doc_1' });
		const result = await DocumentsEndpoints.provideJsonContent(ctx, {
			documentId: 'doc_1',
			jsonContent: { key: 'value' },
		});
		expect(result).toEqual({ _id: 'doc_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v4/documents/doc_1/data-json-content',
			ctx.key,
			{ method: 'POST', body: { jsonContent: { key: 'value' } } },
		);
	});

	it('providePrivateContent: provides private hash', async () => {
		mockedRequest.mockResolvedValue({ _id: 'doc_1' });
		const result = await DocumentsEndpoints.providePrivateContent(ctx, {
			documentId: 'doc_1',
			documentHash: 'sha256_hash',
		});
		expect(result).toEqual({ _id: 'doc_1' });
	});

	it('downloadOriginalDoc: downloads binary document file', async () => {
		const mockBinary = {
			kind: 'binary' as const,
			contentType: 'application/pdf',
			base64: 'JVBERi0xLjQK...',
			size: 512,
		};
		mockedBinaryRequest.mockResolvedValue(mockBinary);

		const result = await DocumentsEndpoints.downloadOriginalDoc(ctx, {
			documentId: 'doc_1',
		});
		expect(result).toEqual(mockBinary);
		expect(mockedBinaryRequest).toHaveBeenCalledWith(
			'/v4/documents/doc_1/file',
			ctx.key,
			{ method: 'GET' },
		);
	});

	it('checkAuthenticity: uploads the file as multipart and returns authenticityValidated', async () => {
		mockedRequest.mockResolvedValue({
			documentId: 'doc_1',
			authenticityValidated: true,
		});
		const result = await DocumentsEndpoints.checkAuthenticity(ctx, {
			documentId: 'doc_1',
			fileBase64: Buffer.from('%PDF-1.4 test').toString('base64'),
			fileName: 'signed.pdf',
		});
		expect(result).toEqual({
			documentId: 'doc_1',
			authenticityValidated: true,
		});
		const [endpoint, , options] = mockedRequest.mock.calls[0] ?? [];
		expect(endpoint).toBe('/v4/documents/doc_1/check-authenticity');
		expect(options?.body).toBeUndefined();
		const file = options?.formData?.file as File;
		expect(file).toBeInstanceOf(File);
		expect(file.name).toBe('signed.pdf');
		expect(file.type).toBe('application/pdf');
		expect(await file.text()).toBe('%PDF-1.4 test');
	});

	it('provideFileContent: uploads document content as a multipart file', async () => {
		mockedRequest.mockResolvedValue({ _id: 'doc_1', status: 'PROVIDED' });
		const result = await DocumentsEndpoints.provideFileContent(ctx, {
			documentId: 'doc_1',
			fileBase64: Buffer.from('hello').toString('base64'),
			fileName: 'note.txt',
			mimeType: 'text/plain',
		});
		expect(result).toEqual({ _id: 'doc_1', status: 'PROVIDED' });
		const [endpoint, , options] = mockedRequest.mock.calls[0] ?? [];
		expect(endpoint).toBe('/v4/documents/doc_1/file');
		expect(options?.method).toBe('POST');
		const file = options?.formData?.file as File;
		expect(file.name).toBe('note.txt');
		expect(await file.text()).toBe('hello');
	});
});

describe('signatures & proofs endpoints', () => {
	it('signatures.list: retrieves signatures for document', async () => {
		mockedRequest.mockResolvedValue([{ _id: 'sig_1' }]);
		const result = await SignaturesEndpoints.list(ctx, {
			documentId: 'doc_1',
		});
		expect(result).toEqual([{ _id: 'sig_1' }]);
	});

	it('signatures.get: gets single signature', async () => {
		mockedRequest.mockResolvedValue({ _id: 'sig_1' });
		const result = await SignaturesEndpoints.get(ctx, {
			documentId: 'doc_1',
			signatureId: 'sig_1',
		});
		expect(result).toEqual({ _id: 'sig_1' });
	});

	it('signatures.getImages: retrieves visual signature images', async () => {
		const mockResponse = { documentId: 'doc_1', signatures: [] };
		mockedRequest.mockResolvedValue(mockResponse);
		const result = await SignaturesEndpoints.getImages(ctx, {
			documentId: 'doc_1',
		});
		expect(result).toEqual(mockResponse);
	});

	it('proofs.downloadSignatureByType: downloads binary signature bundle', async () => {
		const mockBinary = {
			kind: 'binary' as const,
			contentType: 'application/pdf',
			base64: 'proof_data',
			size: 128,
		};
		mockedBinaryRequest.mockResolvedValue(mockBinary);

		const result = await ProofsEndpoints.downloadSignatureByType(ctx, {
			documentId: 'doc_1',
			signatureType: 'PDF_WITH_SIGNATURES',
		});
		expect(result).toEqual(mockBinary);
		expect(mockedBinaryRequest).toHaveBeenCalledWith(
			'/v4/documents/doc_1/signature-type/PDF_WITH_SIGNATURES',
			ctx.key,
			{ method: 'GET' },
		);
	});

	it('proofs.downloadLowLevelSignatureProof: downloads binary low-level proof', async () => {
		const mockBinary = {
			kind: 'binary' as const,
			contentType: 'application/pkcs7-signature',
			base64: 'low_level_proof',
			size: 64,
		};
		mockedBinaryRequest.mockResolvedValue(mockBinary);

		const result = await ProofsEndpoints.downloadLowLevelSignatureProof(ctx, {
			documentId: 'doc_1',
			signatureType: 'PKCS7',
			signerId: 'signer_1',
		});
		expect(result).toEqual(mockBinary);
		expect(mockedBinaryRequest).toHaveBeenCalledWith(
			'/v4/documents/doc_1/signature-type/PKCS7/signers/signer_1',
			ctx.key,
			{ method: 'GET' },
		);
	});
});

describe('signerProfiles, applications, seal, logCapsules, & bareSignatures', () => {
	it('signerProfiles.list: lists signer profiles', async () => {
		mockedRequest.mockResolvedValue([{ _id: 'prof_1', name: 'Standard' }]);
		const result = await SignerProfilesEndpoints.list(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
		});
		expect(result).toEqual([{ _id: 'prof_1', name: 'Standard' }]);
	});

	it('signerProfiles.get: retrieves single signer profile', async () => {
		mockedRequest.mockResolvedValue({ _id: 'prof_1', name: 'Standard' });
		const result = await SignerProfilesEndpoints.get(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
			signerProfileId: 'prof_1',
		});
		expect(result).toEqual({ _id: 'prof_1', name: 'Standard' });
	});

	it('signerProfiles.getInputsNeeded: retrieves profile input constraints', async () => {
		const mockResponse = {
			signerProfileId: 'prof_1',
			inputsNeeded: ['firstName', 'lastName'],
			optionalInputs: [],
		};
		mockedRequest.mockResolvedValue(mockResponse);
		const result = await SignerProfilesEndpoints.getInputsNeeded(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
			signerProfileId: 'prof_1',
		});
		expect(result).toEqual(mockResponse);
	});

	it('signatureRequests.getContext: accepts the nulls the live API sends on a draft', async () => {
		// Trimmed from a live DEVELOPMENT response (11-15).
		const live = {
			_id: 'sr_live',
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
			status: 'DRAFT',
			title: null,
			documentIds: ['doc_1'],
			signerIds: [],
			signers: [],
			documents: [
				{
					_id: 'doc_1',
					status: 'CREATED',
					label: 'corsair-plugin-test',
					fileName: null,
				},
			],
			signatureProofsUrl: null,
			signatureProofStatus: null,
			expirationDate: null,
		};
		mockedRequest.mockResolvedValue(live);
		const result = await SignatureRequestsEndpoints.getContext(ctx, {
			signatureRequestId: 'sr_live',
		});
		expect(result.status).toBe('DRAFT');
		expect(result.signatureProofsUrl).toBeNull();
	});

	it('signatureRequests.list: parses the string page number the live API returns', async () => {
		mockedRequest.mockResolvedValue({
			signatureRequests: [{ _id: 'sr_1', status: 'CANCELLED', signerIds: [] }],
			paginationData: { total: 1, page: '1', nbEventsPerPage: 25 },
		});
		const result = await SignatureRequestsEndpoints.list(ctx, { page: 1 });
		expect(result.paginationData).toEqual({
			total: 1,
			page: 1,
			nbEventsPerPage: 25,
		});
	});

	it('signers.list: keeps the page fields from signers-paginate', async () => {
		mockedRequest.mockResolvedValue({
			total: 0,
			signerPerPage: 20,
			currentPage: '1',
			signers: [],
		});
		const result = await SignersEndpoints.list(ctx, { page: 1 });
		expect(result).toEqual({
			total: 0,
			signerPerPage: 20,
			currentPage: 1,
			signers: [],
		});
	});

	it('applications.getContext: keeps settings and profile fields', async () => {
		const mockResponse = {
			appId: 'appId_1',
			appName: 'My App',
			envSettings: { DEVELOPMENT: { webhooks: [] } },
			// Shape seen on the live API (11-15): profiles keyed by environment.
			signerProfiles: {
				DEVELOPMENT: [
					{
						appId: 'appId_1',
						appEnv: 'DEVELOPMENT',
						name: 'Default Signer Profile',
						status: 'PUBLISHED',
					},
				],
				STAGING: [],
				PRODUCTION: [],
			},
			signatureProfiles: { DEVELOPMENT: [], STAGING: [], PRODUCTION: [] },
			config: { maxSigners: 10 },
			settings: { defaultLanguage: 'EN' },
		};
		mockedRequest.mockResolvedValue(mockResponse);
		const result = await ApplicationsEndpoints.getContext(ctx, {});
		expect(result).toEqual(mockResponse);
	});

	it('signatureRequests.update: passes expirationDateIsActivated through', async () => {
		mockedRequest.mockResolvedValue({ _id: 'sr_1' });
		await SignatureRequestsEndpoints.update(ctx, {
			signatureRequestId: 'sr_1',
			expirationDate: '2026-12-31T00:00:00.000Z',
			expirationDateIsActivated: true,
		});
		expect(mockedRequest.mock.calls[0]?.[2]?.body).toEqual({
			expirationDate: '2026-12-31T00:00:00.000Z',
			expirationDateIsActivated: true,
		});
	});

	it('signatureRequests.update: passes defaultSignatureMethod through', async () => {
		mockedRequest.mockResolvedValue({ _id: 'sr_1' });
		await SignatureRequestsEndpoints.update(ctx, {
			signatureRequestId: 'sr_1',
			defaultSignatureMethod: 'SIMPLE_STD',
		});
		expect(mockedRequest.mock.calls[0]?.[2]?.body).toEqual({
			defaultSignatureMethod: 'SIMPLE_STD',
		});
	});

	it('documents.provideJsonContent: sends a JSON array unchanged', async () => {
		mockedRequest.mockResolvedValue({ _id: 'doc_1' });
		const jsonContent = [{ amount: 10 }, { amount: 20 }];
		await DocumentsEndpoints.provideJsonContent(ctx, {
			documentId: 'doc_1',
			jsonContent,
		});
		expect(mockedRequest.mock.calls[0]?.[2]?.body).toEqual({ jsonContent });
	});

	it('signerProfiles.get/list: keep signatureAuthMethodsConfiguration', async () => {
		const profile = {
			_id: 'prof_1',
			name: 'Standard',
			signatureAuthMethodsConfiguration: {
				SIMPLE_STD: { authMethods: ['EMAIL_CODE'] },
				ADVANCED_SMS: { idProofings: [], authMethods: ['SMS_CODE'] },
			},
		};
		mockedRequest.mockResolvedValueOnce(profile);
		const single = await SignerProfilesEndpoints.get(ctx, {
			signerProfileId: 'prof_1',
		});
		mockedRequest.mockResolvedValueOnce([profile]);
		const many = await SignerProfilesEndpoints.list(ctx, {});
		expect(single).toEqual(profile);
		expect(many).toEqual([profile]);
	});

	it('applications.getContext: gets application context', async () => {
		const mockResponse = { appId: 'appId_1', appName: 'My App' };
		mockedRequest.mockResolvedValue(mockResponse);
		const result = await ApplicationsEndpoints.getContext(ctx, {
			appId: 'appId_1',
		});
		expect(result).toEqual(mockResponse);
	});

	it('seal.signM2M: performs automated seal signature', async () => {
		const mockResponse = {
			signatureRequestId: 'sig_seal_1',
			documentId: 'doc_seal_1',
			documentHash: 'hash_val',
		};
		mockedRequest.mockResolvedValue(mockResponse);
		const result = await SealEndpoints.signM2M(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
			m2mId: 'm2m_1',
			documentHashSignedByM2MPrivateKey: 'signed_hash',
			document: {
				documentType: 'PDF',
				documentHash: 'hash_val',
			},
		});
		expect(result).toEqual(mockResponse);
	});

	it('logCapsules.create: creates timestamped log capsule', async () => {
		const mockResponse = {
			hashSha256_b64: 'hash_b64',
			timestamp_b64: 'time_b64',
		};
		mockedRequest.mockResolvedValue(mockResponse);
		const result = await LogCapsulesEndpoints.create(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
			hashSha256_b64: 'hash_b64',
		});
		expect(result).toEqual(mockResponse);
	});

	it('bareSignatures: tests configuration, proofToken and proofs', async () => {
		mockedRequest.mockResolvedValueOnce({
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
			redirectUris: [],
			authorizedOrigins: [],
		});
		const config = await BareSignaturesEndpoints.getConfiguration(ctx, {
			appId: 'appId_1',
			appEnv: 'DEVELOPMENT',
		});
		expect(config.appId).toBe('appId_1');

		mockedRequest.mockResolvedValueOnce({
			access_token: 'tok_1',
			token_type: 'Bearer',
			expires_in: 3600,
		});
		const token = await BareSignaturesEndpoints.getProofToken(ctx, {
			code_verifier: 'cver',
			redirect_uri: 'https://example.com/cb',
			code: 'code123',
		});
		expect(token.access_token).toBe('tok_1');
		expect(mockedRequest).toHaveBeenLastCalledWith(
			'/v4/envs/DEVELOPMENT/oauth2/proofs-token',
			ctx.key,
			expect.objectContaining({
				body: expect.objectContaining({
					client_id: 'appId_testapp123',
					client_secret: ctx.key,
					grant_type: 'authorization_code',
				}),
			}),
		);

		mockedRequest.mockResolvedValueOnce({
			appId: 'appId_1',
			signatureRequestId: 'sig_1',
			signerId: 'signer_1',
		});
		const proof = await BareSignaturesEndpoints.getProofs(ctx, {
			appEnv: 'DEVELOPMENT',
			proofToken: 'tok_1',
		});
		expect(proof.signatureRequestId).toBe('sig_1');
	});
});

describe('application scope from the API key', () => {
	function ctxWithKey(key: string): IgnisignContext {
		return { ...buildCtx(), key };
	}

	it('uses the app and environment encoded in the key when the input omits them', async () => {
		mockedRequest.mockResolvedValue({ signers: [], total: 0 });
		await SignersEndpoints.list(
			ctxWithKey('skv2_production_abc-123_secret'),
			{},
		);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v4/applications/appId_abc-123/envs/PRODUCTION/signers-paginate',
			'skv2_production_abc-123_secret',
			expect.anything(),
		);
	});

	it('lets the input override the key', async () => {
		mockedRequest.mockResolvedValue({ signers: [], total: 0 });
		await SignersEndpoints.list(ctxWithKey('skv2_production_abc_secret'), {
			appId: 'appId_other',
			appEnv: 'STAGING',
		});
		expect(mockedRequest.mock.calls[0]?.[0]).toBe(
			'/v4/applications/appId_other/envs/STAGING/signers-paginate',
		);
	});

	it('resolves the application id for applications.getContext', async () => {
		mockedRequest.mockResolvedValue({ appId: 'appId_abc' });
		await ApplicationsEndpoints.getContext(
			ctxWithKey('skv2_staging_abc_secret'),
			{},
		);
		expect(mockedRequest.mock.calls[0]?.[0]).toBe(
			'/v4/applications/appId_abc/context',
		);
	});

	it('asks for appId and appEnv when the key does not carry them', async () => {
		await expect(
			SignersEndpoints.list(ctxWithKey('legacy-secret'), {}),
		).rejects.toThrow('appId is required');
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});
