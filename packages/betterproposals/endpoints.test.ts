import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Companies,
	Currencies,
	DocumentTypes,
	Proposals,
	Quotes,
	Settings,
	Templates,
} from './endpoints';
import {
	BetterProposalsEndpointInputSchemas,
	BetterProposalsEndpointOutputSchemas,
} from './endpoints/types';
import type { BetterProposalsContext } from './index';
import { betterproposals } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeBetterProposalsRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

describe('Better Proposals endpoints, client, and schemas', () => {
	const mockMakeRequest =
		client.makeBetterProposalsRequest as jest.MockedFunction<
			typeof client.makeBetterProposalsRequest
		>;
	const mockLogEvent = logEventFromContext as jest.MockedFunction<
		typeof logEventFromContext
	>;

	const ctx = {
		key: 'test_bp_token_123',
	} as unknown as BetterProposalsContext;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	// =========================================================================
	// 1. Proposals Endpoints (9 operations)
	// =========================================================================

	it('proposals.list calls GET /proposal with query params and logs event', async () => {
		const mockResponse = {
			status: 'success',
			data: [{ ID: '219014', CompanyName: 'Test Corp' }],
		};
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Proposals.list(ctx, {
			page: 1,
			per_page: 10,
			type: 1,
		});
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'proposal',
			'test_bp_token_123',
			{
				method: 'GET',
				query: { page: 1, per_page: 10, type: 1 },
			},
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'betterproposals.proposals.list',
			expect.any(Object),
			'completed',
		);
	});

	it('proposals.getNew calls GET /proposal/new', async () => {
		const mockResponse = { status: 'success', data: [{ ID: '219014' }] };
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Proposals.getNew(ctx, { page: 1, per_page: 5 });
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'proposal/new',
			'test_bp_token_123',
			{ method: 'GET', query: { page: 1, per_page: 5 } },
		);
	});

	it('proposals.getOpened calls GET /proposal/opened', async () => {
		const mockResponse = { status: 'success', data: [{ ID: '219008' }] };
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Proposals.getOpened(ctx, {});
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'proposal/opened',
			'test_bp_token_123',
			{ method: 'GET', query: {} },
		);
	});

	it('proposals.getSent calls GET /proposal/sent', async () => {
		const mockResponse = { status: 'success', data: [{ ID: '219014' }] };
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Proposals.getSent(ctx, { page: 2 });
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'proposal/sent',
			'test_bp_token_123',
			{ method: 'GET', query: { page: 2 } },
		);
	});

	it('proposals.getSigned calls GET /proposal/signed', async () => {
		const mockResponse = { status: 'success', data: [{ ID: '219008' }] };
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Proposals.getSigned(ctx, {});
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'proposal/signed',
			'test_bp_token_123',
			{ method: 'GET', query: {} },
		);
	});

	it('proposals.getPaid calls GET /proposal/paid', async () => {
		const mockResponse = { status: 'success', data: [{ ID: '111111' }] };
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Proposals.getPaid(ctx, { type: 2 });
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'proposal/paid',
			'test_bp_token_123',
			{ method: 'GET', query: { type: 2 } },
		);
	});

	it('proposals.get calls GET /proposal/:proposal_id', async () => {
		const mockResponse = {
			status: 'success',
			data: { ID: '111111', SubjectLine: 'My Proposal' },
		};
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Proposals.get(ctx, { proposal_id: '111111' });
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'proposal/111111',
			'test_bp_token_123',
			{ method: 'GET' },
		);
	});

	it('proposals.getCount calls GET /proposal/count', async () => {
		const mockResponse = { status: 'success', count: 245 };
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Proposals.getCount(ctx, {});
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'proposal/count',
			'test_bp_token_123',
			{ method: 'GET' },
		);
	});

	it('proposals.createCover calls POST /proposal/cover/create', async () => {
		const mockResponse = { status: 'success', data: { CoverID: '12345' } };
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const input = {
			BrandID: '244',
			CoverName: 'New Proposal Cover',
			Headline: 'Welcome to our proposal',
		};
		const result = await Proposals.createCover(ctx, input);
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'proposal/cover/create',
			'test_bp_token_123',
			{ method: 'POST', body: input },
		);
	});

	// =========================================================================
	// 2. Templates Endpoints (2 operations)
	// =========================================================================

	it('templates.list calls GET /template', async () => {
		const mockResponse = {
			status: 'success',
			data: [{ ID: '3', TemplateName: 'Default Template' }],
		};
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Templates.list(ctx, { page: 1, per_page: 10 });
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'template',
			'test_bp_token_123',
			{ method: 'GET', query: { page: 1, per_page: 10 } },
		);
	});

	it('templates.get calls GET /template/:template_id', async () => {
		const mockResponse = {
			status: 'success',
			data: { ID: '205', TemplateName: 'Architect Template' },
		};
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Templates.get(ctx, { template_id: '205' });
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'template/205',
			'test_bp_token_123',
			{ method: 'GET' },
		);
	});

	// =========================================================================
	// 3. DocumentTypes Endpoints (2 operations)
	// =========================================================================

	it('documentTypes.list calls GET /doctype', async () => {
		const mockResponse = {
			status: 'success',
			data: [{ ID: 1, TypeName: 'Proposals' }],
		};
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await DocumentTypes.list(ctx, {});
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'doctype',
			'test_bp_token_123',
			{ method: 'GET', query: {} },
		);
	});

	it('documentTypes.create calls POST /doctype/create', async () => {
		const mockResponse = {
			status: 'success',
			data: { ID: '111', TypeName: 'Testing Doctype' },
		};
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const input = { TypeName: 'Testing Doctype', TypeColour: '#01A3EF' };
		const result = await DocumentTypes.create(ctx, input);
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'doctype/create',
			'test_bp_token_123',
			{ method: 'POST', body: input },
		);
	});

	// =========================================================================
	// 4. Quotes Endpoints (2 operations)
	// =========================================================================

	it('quotes.list calls GET /quote', async () => {
		const mockResponse = {
			status: 'success',
			data: [{ ID: '55', CompanyID: '1166' }],
		};
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Quotes.list(ctx, { page: 1 });
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith('quote', 'test_bp_token_123', {
			method: 'GET',
			query: { page: 1 },
		});
	});

	it('quotes.get calls GET /quote/:quote_id', async () => {
		const mockResponse = {
			status: 'success',
			data: { ID: '55', QuoteAmount: '50000.00' },
		};
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Quotes.get(ctx, { quote_id: '55' });
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'quote/55',
			'test_bp_token_123',
			{ method: 'GET' },
		);
	});

	// =========================================================================
	// 5. Companies Endpoints (3 operations)
	// =========================================================================

	it('companies.list calls GET /company', async () => {
		const mockResponse = {
			status: 'success',
			data: [{ ID: '2', CompanyName: 'JB & Co Ltd' }],
		};
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Companies.list(ctx, {});
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'company',
			'test_bp_token_123',
			{ method: 'GET', query: {} },
		);
	});

	it('companies.get calls GET /company/:company_id', async () => {
		const mockResponse = {
			status: 'success',
			data: { ID: '2', CompanyName: 'JB & Co Ltd' },
		};
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Companies.get(ctx, { company_id: '2' });
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'company/2',
			'test_bp_token_123',
			{ method: 'GET' },
		);
	});

	it('companies.create calls POST /company/create', async () => {
		const mockResponse = {
			status: 'success',
			data: { ID: '3', CompanyName: 'Acme Corp' },
		};
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const input = { CompanyName: 'Acme Corp' };
		const result = await Companies.create(ctx, input);
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'company/create',
			'test_bp_token_123',
			{ method: 'POST', body: input },
		);
	});

	// =========================================================================
	// 6. Currencies Endpoints (2 operations)
	// =========================================================================

	it('currencies.list calls GET /currency', async () => {
		const mockResponse = {
			status: 'success',
			data: [{ ID: '1', CurrencyCode: 'GBP', CurrencySymbol: '£' }],
		};
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Currencies.list(ctx, {});
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'currency',
			'test_bp_token_123',
			{ method: 'GET', query: {} },
		);
	});

	it('currencies.get calls GET /currency/:currency_id', async () => {
		const mockResponse = {
			status: 'success',
			data: { ID: '1', CurrencyCode: 'GBP', CurrencySymbol: '£' },
		};
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Currencies.get(ctx, { currency_id: '1' });
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'currency/1',
			'test_bp_token_123',
			{ method: 'GET' },
		);
	});

	// =========================================================================
	// 7. Settings Endpoints (3 operations)
	// =========================================================================

	it('settings.get calls GET /settings', async () => {
		const mockResponse = {
			status: 'success',
			data: { ID: '1', TimeZone: 'Europe/London' },
		};
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Settings.get(ctx, {});
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'settings',
			'test_bp_token_123',
			{ method: 'GET' },
		);
	});

	it('settings.getBrand calls GET /settings/brand', async () => {
		const mockResponse = {
			status: 'success',
			data: { ID: '4', Default: '1', Name: 'Test Brand' },
		};
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Settings.getBrand(ctx, {});
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'settings/brand',
			'test_bp_token_123',
			{ method: 'GET' },
		);
	});

	it('settings.listMergeTags calls GET /settings/merge_tag', async () => {
		const mockResponse = {
			status: 'success',
			data: [{ ID: '76', Name: 'Custom Tag', Tag: 'custom-tag' }],
		};
		mockMakeRequest.mockResolvedValueOnce(mockResponse as never);

		const result = await Settings.listMergeTags(ctx, { page: 1 });
		expect(result).toEqual(mockResponse);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'settings/merge_tag',
			'test_bp_token_123',
			{ method: 'GET', query: { page: 1 } },
		);
	});

	// =========================================================================
	// Form-encoding & Client Unit Tests
	// =========================================================================

	it('toFormEncoded correctly encodes nested objects and arrays for PHP http_build_query compatibility', () => {
		const encoded = client.toFormEncoded({
			CompanyName: 'Acme Corp',
			BrandID: 244,
			Contacts: [
				{
					FirstName: 'John',
					Surname: 'Doe',
					Email: 'john@doe.com',
					Signature: true,
				},
			],
		});

		expect(encoded).toContain('CompanyName=Acme%20Corp');
		expect(encoded).toContain('BrandID=244');
		expect(encoded).toContain(
			encodeURIComponent('Contacts[0][FirstName]') + '=John',
		);
		expect(encoded).toContain(
			encodeURIComponent('Contacts[0][Email]') +
				'=' +
				encodeURIComponent('john@doe.com'),
		);
	});

	// =========================================================================
	// Plugin Initialization & Key Builder Tests
	// =========================================================================

	it('initializes plugin with default authType and resolves api_key', async () => {
		const plugin = betterproposals({ key: 'custom_key_123' });
		expect(plugin.id).toBe('betterproposals');
		expect(plugin.pluginWebhookMatcher?.({ headers: {} } as any)).toBe(false);

		expect(plugin.keyBuilder).toBeDefined();
		const key = await plugin.keyBuilder!(
			{
				authType: 'api_key',
				keys: {
					get_api_key: jest.fn().mockResolvedValue('key_from_db'),
				},
			} as never,
			'endpoint',
		);
		expect(key).toBe('custom_key_123');
	});

	// =========================================================================
	// Zod Schemas Validation
	// =========================================================================

	it('validates proposal input and output schemas', () => {
		const inputParsed =
			BetterProposalsEndpointInputSchemas.proposalsGet.safeParse({
				proposal_id: '12345',
			});
		expect(inputParsed.success).toBe(true);

		const outputParsed =
			BetterProposalsEndpointOutputSchemas.proposalsGet.safeParse({
				status: 'success',
				data: {
					ID: '12345',
					SubjectLine: 'Test Proposal',
					Contacts: [{ Email: 'test@example.com', FirstName: 'John' }],
				},
			});
		expect(outputParsed.success).toBe(true);
	});

	it('validates documentTypes create input and output schemas', () => {
		const inputParsed =
			BetterProposalsEndpointInputSchemas.documentTypesCreate.safeParse({
				TypeName: 'New Type',
				TypeColour: '#FF0000',
			});
		expect(inputParsed.success).toBe(true);

		const outputParsed =
			BetterProposalsEndpointOutputSchemas.documentTypesCreate.safeParse({
				status: 'success',
				data: {
					ID: 99,
					TypeName: 'New Type',
					TypeColour: '#FF0000',
				},
			});
		expect(outputParsed.success).toBe(true);
	});

	it('validates proposals count output schema', () => {
		const outputParsed =
			BetterProposalsEndpointOutputSchemas.proposalsGetCount.safeParse({
				status: 'success',
				count: 42,
			});
		expect(outputParsed.success).toBe(true);
	});
});
