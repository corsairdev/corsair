import {
	CarboneEndpointInputSchemas,
	CarboneEndpointOutputSchemas,
	DeleteTemplateInputSchema,
	GetRenderInputSchema,
	GetStatusInputSchema,
	GetTemplateInputSchema,
	RenderInlineInputSchema,
	RenderTemplateInputSchema,
	UploadTemplateInputSchema,
} from './endpoints/types';
import { CarboneSchema, CarboneTemplate } from './schema';

describe('Carbone schema', () => {
	it('declares a semver version', () => {
		expect(CarboneSchema.version).toBeDefined();
		expect(CarboneSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map with templates', () => {
		expect(typeof CarboneSchema.entities).toBe('object');
		expect(CarboneSchema.entities).not.toBeNull();
		expect(CarboneSchema.entities).toHaveProperty('templates');

		const parsed = CarboneTemplate.parse({
			id: 'tmpl_123',
			versionId: 'ver_456',
			type: 'docx',
			size: 1024,
			createdAt: 1620000000,
		});
		expect(parsed.id).toBe('tmpl_123');
		expect(parsed.type).toBe('docx');
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
			version: '5.0.0',
		});
		expect(statusOutput.success).toBe(true);
		expect(statusOutput.version).toBe('5.0.0');
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
			},
		});
		expect(output.success).toBe(true);
		expect(output.data.templateId).toBe('tmpl_abc');
	});

	it('validates template get and delete schemas', () => {
		const getInput = GetTemplateInputSchema.parse({ templateId: 'tmpl_123' });
		expect(getInput.templateId).toBe('tmpl_123');

		const deleteInput = DeleteTemplateInputSchema.parse({
			templateId: 'tmpl_123',
		});
		expect(deleteInput.templateId).toBe('tmpl_123');

		const deleteOutput = CarboneEndpointOutputSchemas.deleteTemplate.parse({
			success: true,
			message: 'Template deleted',
		});
		expect(deleteOutput.success).toBe(true);
	});

	it('validates render template schemas', () => {
		const renderInput = RenderTemplateInputSchema.parse({
			templateId: 'tmpl_123',
			data: { firstname: 'John', lastname: 'Doe' },
			convertTo: 'pdf',
			lang: 'en',
		});
		expect(renderInput.templateId).toBe('tmpl_123');
		expect(renderInput.convertTo).toBe('pdf');

		const renderOutput = CarboneEndpointOutputSchemas.render.parse({
			success: true,
			data: {
				renderId: 'rnd_789',
			},
		});
		expect(renderOutput.data.renderId).toBe('rnd_789');
	});

	it('validates inline render schemas', () => {
		const inlineInput = RenderInlineInputSchema.parse({
			template: 'base64RawString',
			data: { items: [1, 2, 3] },
			convertTo: 'xlsx',
		});
		expect(inlineInput.convertTo).toBe('xlsx');

		const inlineOutput = CarboneEndpointOutputSchemas.renderInline.parse({
			success: true,
			data: {
				renderId: 'rnd_inline_999',
			},
		});
		expect(inlineOutput.data.renderId).toBe('rnd_inline_999');
	});

	it('validates get render schemas', () => {
		const getInput = GetRenderInputSchema.parse({ renderId: 'rnd_789' });
		expect(getInput.renderId).toBe('rnd_789');

		const getOutput = CarboneEndpointOutputSchemas.getRender.parse({
			renderId: 'rnd_789',
			downloadUrl: 'https://api.carbone.io/render/rnd_789',
		});
		expect(getOutput.downloadUrl).toContain('rnd_789');
	});
});
