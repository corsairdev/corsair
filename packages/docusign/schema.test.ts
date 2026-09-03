import { DocusignClient } from './client';
import {
	CreateRecipientViewUrlInputSchema,
	createEnvelope,
	createRecipientViewUrl,
	docusignEndpointSchemas,
	FetchRecipientNamesForEmailInputSchema,
	GetEnvelopeInputSchema,
	GetEnvelopeOutputSchema,
	GetTemplateInputSchema,
	getEnvelope,
	getTemplate,
	ListOAuthUserInfoInputSchema,
	ListTemplatesInputSchema,
	listTemplates,
	sendEnvelope,
} from './endpoints';
import { DocusignSchema } from './schema';

describe('DocuSign Plugin Conformance & Tests', () => {
	const mockClient = new DocusignClient({
		accessToken: 'mock_token',
		accountId: '12345',
		baseUri: 'https://demo.docusign.net/restapi/v2.1',
	});

	beforeEach(() => {
		jest.spyOn(mockClient, 'request').mockImplementation(async () => {
			return {
				envelopeId: 'env_1',
				status: 'sent',
				url: 'https://example.com/callback',
				templateId: 'tpl_1',
				name: 'Template',
			};
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

	describe('Input schema validation', () => {
		it('should reject a missing envelopeId', () => {
			expect(GetEnvelopeInputSchema.safeParse({}).success).toBe(false);
			expect(
				GetEnvelopeInputSchema.safeParse({ envelopeId: 'env_1' }).success,
			).toBe(true);
		});

		it('should reject incomplete recipient view input', () => {
			expect(
				CreateRecipientViewUrlInputSchema.safeParse({
					envelopeId: 'env_1',
				}).success,
			).toBe(false);
		});

		it('should reject incomplete template input', () => {
			expect(GetTemplateInputSchema.safeParse({}).success).toBe(false);
		});

		it('should reject non-numeric template pagination', () => {
			expect(ListTemplatesInputSchema.safeParse({ count: 'ten' }).success).toBe(
				false,
			);
			expect(ListTemplatesInputSchema.safeParse({ count: 10 }).success).toBe(
				true,
			);
		});

		it('should reject incomplete email lookup input', () => {
			expect(
				FetchRecipientNamesForEmailInputSchema.safeParse({
					envelopeId: 'env_1',
				}).success,
			).toBe(false);
		});

		it('should accept empty userinfo input', () => {
			expect(ListOAuthUserInfoInputSchema.safeParse({}).success).toBe(true);
			expect(ListOAuthUserInfoInputSchema.safeParse(undefined).success).toBe(
				true,
			);
		});
	});

	describe('Output schema validation', () => {
		it('should preserve unknown response fields', () => {
			const result = GetEnvelopeOutputSchema.parse({
				envelopeId: 'env_1',
				status: 'sent',
				customField: 'kept',
			});
			expect(result).toEqual(expect.objectContaining({ customField: 'kept' }));
		});

		it('should require envelope fields in storage schemas', () => {
			expect(DocusignSchema.envelope.safeParse({}).success).toBe(false);
		});
	});
});
