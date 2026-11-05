import {
	CarboneEndpointInputSchemas,
	CarboneEndpointOutputSchemas,
	DeleteTemplateInputSchema,
	DeleteTemplateOutputSchema,
	DownloadTemplateInputSchema,
	DownloadTemplateOutputSchema,
	GenerateReportInputSchema,
	GenerateReportOutputSchema,
	GetStatusInputSchema,
	GetStatusOutputSchema,
	ListTemplateCategoriesInputSchema,
	ListTemplateCategoriesOutputSchema,
	ListTemplatesInputSchema,
	ListTemplatesOutputSchema,
	ListTemplateTagsInputSchema,
	ListTemplateTagsOutputSchema,
	RenderTemplateDirectInputSchema,
	RenderTemplateDirectOutputSchema,
	SetApiVersionInputSchema,
	SetApiVersionOutputSchema,
	UpdateTemplateInputSchema,
	UpdateTemplateOutputSchema,
	UploadTemplateInputSchema,
	UploadTemplateOutputSchema,
} from './endpoints/types';
import {
	CarboneCategory,
	CarboneSchema,
	CarboneTag,
	CarboneTemplate,
} from './schema';

describe('Carbone schema', () => {
	it('declares a semver version', () => {
		expect(CarboneSchema.version).toBeDefined();
		expect(CarboneSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares entities map with templates, categories, tags', () => {
		expect(typeof CarboneSchema.entities).toBe('object');
		expect(CarboneSchema.entities).not.toBeNull();
		expect(CarboneSchema.entities).toHaveProperty('templates');
		expect(CarboneSchema.entities).toHaveProperty('categories');
		expect(CarboneSchema.entities).toHaveProperty('tags');

		const parsedTmpl = CarboneTemplate.parse({
			id: 'tmpl_123',
			versionId: 'ver_456',
			name: 'Invoice Template',
			category: 'Billing',
			type: 'docx',
			size: 1024,
			comment: 'First version',
			tags: ['invoice', 'v1'],
			deployedAt: 0,
			createdAt: 1620000000,
			expireAt: null,
			origin: 0,
		});
		expect(parsedTmpl.id).toBe('tmpl_123');
		expect(parsedTmpl.category).toBe('Billing');

		const parsedCat = CarboneCategory.parse({ name: 'Finance' });
		expect(parsedCat.name).toBe('Finance');

		const parsedTag = CarboneTag.parse({ name: 'urgent' });
		expect(parsedTag.name).toBe('urgent');
	});
});

describe('Carbone endpoint schemas', () => {
	it('validates status schemas', () => {
		expect(CarboneEndpointInputSchemas.getStatus.parse({})).toEqual({});
		expect(GetStatusInputSchema.parse({})).toEqual({});

		const statusOutput = CarboneEndpointOutputSchemas.getStatus.parse({
			success: true,
			code: 200,
			message: 'OK',
			version: '5.14.4',
		});
		expect(statusOutput.success).toBe(true);
		expect(statusOutput.version).toBe('5.14.4');
		expect(GetStatusOutputSchema.parse(statusOutput).success).toBe(true);
	});

	it('validates template upload schemas', () => {
		const input = UploadTemplateInputSchema.parse({
			template: 'base64EncodedContent==',
		});
		expect(input.template).toBe('base64EncodedContent==');

		const output = CarboneEndpointOutputSchemas.uploadTemplate.parse({
			success: true,
			data: {
				templateId: 'tmpl_abc',
				versionId: 'ver_xyz',
				templateExtension: 'html',
			},
		});
		expect(output.success).toBe(true);
		expect(output.data.templateId).toBe('tmpl_abc');
		expect(UploadTemplateOutputSchema.parse(output).success).toBe(true);
	});

	it('validates template list schemas', () => {
		const input = ListTemplatesInputSchema.parse({
			id: 'tmpl_abc',
			category: 'Invoices',
			search: 'billing',
			cursor: 10,
		});
		expect(input.category).toBe('Invoices');
		expect(input.id).toBe('tmpl_abc');

		const output = CarboneEndpointOutputSchemas.listTemplates.parse({
			success: true,
			data: [
				{
					versionId: 'v123',
					id: 'tmpl123',
					name: 'Invoice',
					category: 'Finance',
					tags: ['sales'],
				},
			],
			hasMore: false,
			nextCursor: 11,
		});
		expect(output.success).toBe(true);
		expect(output.data.length).toBe(1);
		expect(output.nextCursor).toBe(11);
		expect(ListTemplatesOutputSchema.parse(output).success).toBe(true);
	});

	it('validates template download schemas', () => {
		const input = DownloadTemplateInputSchema.parse({ templateId: 'tmpl_123' });
		expect(input.templateId).toBe('tmpl_123');

		const output = CarboneEndpointOutputSchemas.downloadTemplate.parse({
			templateId: 'tmpl_123',
			content: 'UEsDBA==',
			success: true,
		});
		expect(output.content).toBe('UEsDBA==');
		expect(DownloadTemplateOutputSchema.parse(output).success).toBe(true);
	});

	it('validates template update schemas', () => {
		const input = UpdateTemplateInputSchema.parse({
			templateId: 'tmpl_123',
			name: 'Updated Template',
			category: 'Reports',
			tags: ['q1'],
		});
		expect(input.name).toBe('Updated Template');

		const output = CarboneEndpointOutputSchemas.updateTemplate.parse({
			success: true,
			data: {
				name: 'Updated Template',
				category: 'Reports',
				tags: ['q1'],
				versionId: 'v123',
			},
		});
		expect(output.success).toBe(true);
		expect(UpdateTemplateOutputSchema.parse(output).success).toBe(true);
	});

	it('validates template delete schemas', () => {
		const input = DeleteTemplateInputSchema.parse({ templateId: 'tmpl_123' });
		expect(input.templateId).toBe('tmpl_123');

		const output = CarboneEndpointOutputSchemas.deleteTemplate.parse({
			success: true,
			message: 'Template deleted',
		});
		expect(output.message).toBe('Template deleted');
		expect(DeleteTemplateOutputSchema.parse(output).success).toBe(true);
	});

	it('validates category and tag list schemas', () => {
		expect(ListTemplateCategoriesInputSchema.parse({})).toEqual({});
		expect(ListTemplateTagsInputSchema.parse({})).toEqual({});

		const catOut = CarboneEndpointOutputSchemas.listCategories.parse({
			success: true,
			data: [{ name: 'Invoices' }, { name: 'Receipts' }],
		});
		expect(catOut.data.length).toBe(2);
		expect(ListTemplateCategoriesOutputSchema.parse(catOut).success).toBe(true);

		const tagOut = CarboneEndpointOutputSchemas.listTags.parse({
			success: true,
			data: [{ name: 'v1' }, { name: 'pdf' }],
		});
		expect(tagOut.data.length).toBe(2);
		expect(ListTemplateTagsOutputSchema.parse(tagOut).success).toBe(true);
	});

	it('validates report generation schemas', () => {
		const renderInput = GenerateReportInputSchema.parse({
			templateId: 'tmpl_123',
			data: [{ firstname: 'John' }, { lastname: 'Doe' }],
			convertTo: { formatName: 'pdf' },
			lang: 'en',
			converter: 'libreoffice',
		});
		expect(renderInput.templateId).toBe('tmpl_123');
		expect(renderInput.convertTo).toEqual({ formatName: 'pdf' });
		expect(renderInput.converter).toBe('libreoffice');

		const renderOutput = CarboneEndpointOutputSchemas.generateReport.parse({
			success: true,
			data: {
				renderId: 'rnd_789.pdf',
			},
		});
		expect(renderOutput.data.renderId).toBe('rnd_789.pdf');
		expect(GenerateReportOutputSchema.parse(renderOutput).success).toBe(true);
	});

	it('validates direct render schemas', () => {
		const directInput = RenderTemplateDirectInputSchema.parse({
			template: 'base64RawString',
			data: { items: [1, 2, 3] },
			convertTo: {
				formatName: 'pdf',
				formatOptions: { quality: 'high' },
			},
			converter: 'libreoffice',
		});
		expect(directInput.convertTo).toEqual({
			formatName: 'pdf',
			formatOptions: { quality: 'high' },
		});
		expect(directInput.converter).toBe('libreoffice');

		const directOutput = CarboneEndpointOutputSchemas.renderDirect.parse({
			success: true,
			data: {
				renderId: 'rnd_direct_999.pdf',
			},
		});
		expect(directOutput.data.renderId).toBe('rnd_direct_999.pdf');
		expect(RenderTemplateDirectOutputSchema.parse(directOutput).success).toBe(
			true,
		);
	});

	it('validates set API version schemas', () => {
		const input = SetApiVersionInputSchema.parse({ version: '5' });
		expect(input.version).toBe('5');

		const output = CarboneEndpointOutputSchemas.setApiVersion.parse({
			success: true,
			version: '5',
			message: 'Carbone API version set to 5',
		});
		expect(output.version).toBe('5');
		expect(SetApiVersionOutputSchema.parse(output).success).toBe(true);
	});
});
