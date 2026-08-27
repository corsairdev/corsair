/// <reference types="jest" />
import { DocusignClient } from './client';
import {
	createEnvelope,
	createRecipientViewUrl,
	docusignEndpointSchemas,
	getEnvelope,
	getTemplate,
	listTemplates,
	sendEnvelope,
} from './endpoints';
import { docusignErrorHandlers } from './error-handlers';
import { DocusignSchema } from './schema';
import { handleWebhook } from './webhooks';

describe('DocuSign Plugin Conformance & Tests', () => {
	const mockClient = new DocusignClient({
		accessToken: 'mock_token',
		accountId: '12345',
		baseUri: 'https://demo.docusign.net/restapi/v2.1',
	});

	beforeEach(() => {
		jest.spyOn(mockClient, 'request').mockImplementation(async (path, opts) => {
			return { mockPath: path, mockOptions: opts };
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('DocusignSchema', () => {
		it('should validate envelope and template schemas', () => {
			expect(DocusignSchema).toBeDefined();
			expect(DocusignSchema.envelope).toBeDefined();
			expect(DocusignSchema.template).toBeDefined();

			const sampleEnvelope = {
				envelopeId: 'env_123',
				status: 'sent',
			};
			const result = DocusignSchema.envelope.safeParse(sampleEnvelope);
			expect(result.success).toBe(true);
		});

		it('should expose valid endpointSchemas contracts', () => {
			expect(docusignEndpointSchemas.createEnvelope.input).toBeDefined();
			expect(docusignEndpointSchemas.createEnvelope.output).toBeDefined();
			expect(docusignEndpointSchemas.getEnvelope.input).toBeDefined();
			expect(docusignEndpointSchemas.sendEnvelope.input).toBeDefined();
			expect(
				docusignEndpointSchemas.createRecipientViewUrl.input,
			).toBeDefined();
			expect(docusignEndpointSchemas.listTemplates.input).toBeDefined();
			expect(docusignEndpointSchemas.getTemplate.input).toBeDefined();
		});
	});

	describe('Endpoints execution', () => {
		it('should invoke createEnvelope with context or client', async () => {
			const res = await createEnvelope(
				{ client: mockClient },
				{
					emailSubject: 'Sign Agreement',
					status: 'sent',
				},
			);
			expect(res).toBeDefined();
		});

		it('should invoke getEnvelope', async () => {
			const res = await getEnvelope(mockClient, { envelopeId: 'env_1' });
			expect(res).toBeDefined();
		});

		it('should invoke sendEnvelope', async () => {
			const res = await sendEnvelope(
				{ client: mockClient },
				{ envelopeId: 'env_1' },
			);
			expect(res).toBeDefined();
		});

		it('should invoke createRecipientViewUrl', async () => {
			const res = await createRecipientViewUrl(mockClient, {
				envelopeId: 'env_1',
				userName: 'Jane Doe',
				email: 'jane@example.com',
				returnUrl: 'https://example.com/callback',
			});
			expect(res).toBeDefined();
		});

		it('should invoke listTemplates with pagination', async () => {
			const res = await listTemplates(
				{ client: mockClient },
				{ count: 10, startPosition: 0 },
			);
			expect(res).toBeDefined();
		});

		it('should invoke getTemplate', async () => {
			const res = await getTemplate(mockClient, { templateId: 'tpl_1' });
			expect(res).toBeDefined();
		});
	});

	describe('Webhooks', () => {
		it('should match and extract payload from request.payload', async () => {
			const sampleRequest = {
				payload: {
					event: 'envelope-completed',
					data: { envelopeId: 'env_999' },
				},
			};

			const matched = handleWebhook.match({}, sampleRequest);
			expect(matched).toBe(true);

			const result = await handleWebhook.handler({}, sampleRequest);
			expect(result.event).toBe('envelope-completed');
			expect(result.envelopeId).toBe('env_999');
		});
	});

	describe('Error Handlers', () => {
		it('should classify rate-limiting errors (429)', () => {
			const rateLimitErr = { status: 429, headers: { 'retry-after': '30' } };
			expect(docusignErrorHandlers.rateLimit.match(rateLimitErr)).toBe(true);
			const handled = docusignErrorHandlers.rateLimit.handler(rateLimitErr);
			expect(handled.action).toBe('retry');
		});

		it('should classify authentication errors (401)', () => {
			const authErr = { status: 401 };
			expect(docusignErrorHandlers.auth.match(authErr)).toBe(true);
			const handled = docusignErrorHandlers.auth.handler(authErr);
			expect(handled.action).toBe('reauthenticate');
		});
	});
});
