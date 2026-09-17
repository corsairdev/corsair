import { z } from 'zod';
import {
	CarboneCategory,
	CarboneTag,
	CarboneTemplate,
} from '../schema/database';

// ─── JSON Types ──────────────────────────────────────────────────────────────

export const JsonPrimitiveSchema = z
	.union([z.string(), z.number(), z.boolean(), z.null()])
	.describe('Primitive JSON value');
export type JsonPrimitive = z.infer<typeof JsonPrimitiveSchema>;

export type JsonValue =
	| JsonPrimitive
	| { [key: string]: JsonValue }
	| JsonValue[];

export const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
	z
		.union([
			JsonPrimitiveSchema,
			z.array(JsonValueSchema),
			z.record(z.string(), JsonValueSchema),
		])
		.describe('Arbitrary JSON value'),
);

export const JsonObjectSchema = z
	.record(z.string(), JsonValueSchema)
	.describe('JSON object mapping string keys to arbitrary JSON values');
export type JsonObject = z.infer<typeof JsonObjectSchema>;

// ─── Status ──────────────────────────────────────────────────────────────────

export const GetStatusInputSchema = z
	.object({})
	.describe('Input parameters to check Carbone server status');
export type GetStatusInput = z.infer<typeof GetStatusInputSchema>;

export const GetStatusOutputSchema = z
	.object({
		success: z
			.boolean()
			.describe('Indicates if the status check request succeeded'),
		code: z.number().optional().describe('HTTP status code returned by API'),
		message: z.string().describe('Status message from Carbone server'),
		version: z
			.string()
			.optional()
			.describe('Active Carbone engine/API version'),
	})
	.describe('Carbone server health and operational status response');
export type GetStatusOutput = z.infer<typeof GetStatusOutputSchema>;

// ─── Templates ───────────────────────────────────────────────────────────────

export const UploadTemplateInputSchema = z
	.object({
		template: z
			.string()
			.min(1, 'Template payload (base64 string) is required')
			.describe('Base64-encoded document template payload'),
	})
	.describe('Input parameters to upload a template to Carbone');
export type UploadTemplateInput = z.infer<typeof UploadTemplateInputSchema>;

export const UploadTemplateOutputSchema = z
	.object({
		success: z.boolean().describe('Indicates if template upload succeeded'),
		data: z
			.object({
				templateId: z
					.string()
					.optional()
					.describe('Unique 64-character hexadecimal template ID'),
				id: z.string().optional().describe('Template ID alias'),
				versionId: z
					.string()
					.optional()
					.describe('Version ID of the uploaded template'),
				templateExtension: z
					.string()
					.optional()
					.describe('Detected template file format extension'),
				type: z
					.string()
					.optional()
					.describe('MIME type or file format of template'),
				size: z
					.number()
					.optional()
					.describe('Size of the uploaded template file in bytes'),
				createdAt: z
					.number()
					.optional()
					.describe('Unix timestamp of when template was uploaded'),
			})
			.describe('Metadata of the newly uploaded template'),
	})
	.describe('Output response returned after uploading a template');
export type UploadTemplateOutput = z.infer<typeof UploadTemplateOutputSchema>;

export const ListTemplatesInputSchema = z
	.object({
		id: z
			.string()
			.optional()
			.describe('Filter templates by exact template ID match'),
		templateId: z
			.string()
			.optional()
			.describe('Alias for id; filter templates by exact template ID match'),
		versionId: z
			.string()
			.optional()
			.describe('Filter templates by exact version ID match'),
		category: z
			.string()
			.optional()
			.describe('Filter templates belonging to a specific category folder'),
		search: z
			.string()
			.optional()
			.describe('Search templates by name or identifier query'),
		cursor: z
			.union([z.string(), z.number()])
			.optional()
			.describe('Pagination cursor for iterating through templates'),
	})
	.describe('Input parameters for filtering and paginating templates list');
export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;

export const ListTemplatesOutputSchema = z
	.object({
		success: z.boolean().describe('Indicates if listing templates succeeded'),
		data: z
			.array(CarboneTemplate)
			.describe('Array of deployed Carbone template metadata records'),
		hasMore: z
			.boolean()
			.optional()
			.describe('Whether more template records are available on next page'),
		nextCursor: z
			.union([z.string(), z.number()])
			.optional()
			.describe('Cursor to retrieve the next page of templates'),
	})
	.describe('List of deployed templates with pagination metadata');
export type ListTemplatesOutput = z.infer<typeof ListTemplatesOutputSchema>;

export const DownloadTemplateInputSchema = z
	.object({
		templateId: z
			.string()
			.min(1, 'Template ID is required')
			.describe('64-character hexadecimal template ID to download'),
	})
	.describe('Input parameters to download a template by ID');
export type DownloadTemplateInput = z.infer<typeof DownloadTemplateInputSchema>;

export const DownloadTemplateOutputSchema = z
	.object({
		templateId: z.string().describe('ID of the downloaded template'),
		content: z
			.string()
			.describe('Raw file content or stream of the retrieved template'),
		success: z
			.boolean()
			.describe('Indicates if template download was successful'),
	})
	.describe('Downloaded template content response');
export type DownloadTemplateOutput = z.infer<
	typeof DownloadTemplateOutputSchema
>;

export const UpdateTemplateInputSchema = z
	.object({
		templateId: z
			.string()
			.min(1, 'Template ID is required')
			.describe('64-character hexadecimal template ID to update'),
		name: z
			.string()
			.optional()
			.describe('Updated human-readable name of the template'),
		category: z
			.string()
			.optional()
			.describe('Updated category folder for organizing the template'),
		comment: z
			.string()
			.optional()
			.describe('Updated description or version release comment'),
		tags: z
			.array(z.string())
			.optional()
			.describe('Updated array of tag strings for filtering'),
		deployedAt: z
			.number()
			.optional()
			.describe('Unix timestamp to control version deployment'),
		expireAt: z
			.number()
			.optional()
			.describe('Unix timestamp when the template will automatically expire'),
	})
	.describe('Input parameters for updating Carbone template metadata');
export type UpdateTemplateInput = z.infer<typeof UpdateTemplateInputSchema>;

export const UpdateTemplateOutputSchema = z
	.object({
		success: z
			.boolean()
			.describe('Indicates if template metadata update succeeded'),
		data: z
			.object({
				name: z.string().optional().describe('Updated template name'),
				category: z.string().optional().describe('Updated template category'),
				comment: z.string().optional().describe('Updated template comment'),
				tags: z
					.array(z.string())
					.optional()
					.describe('Updated template tag list'),
				deployedAt: z
					.number()
					.nullable()
					.optional()
					.describe('Deployment timestamp'),
				versionId: z
					.string()
					.optional()
					.describe('Version ID of the updated template'),
				id: z.string().nullable().optional().describe('Template ID alias'),
			})
			.optional()
			.describe('Updated metadata values of the template'),
	})
	.describe('Output returned after updating template metadata');
export type UpdateTemplateOutput = z.infer<typeof UpdateTemplateOutputSchema>;

export const DeleteTemplateInputSchema = z
	.object({
		templateId: z
			.string()
			.min(1, 'Template ID is required')
			.describe('64-character hexadecimal template ID to permanently delete'),
	})
	.describe('Input parameters to delete a template');
export type DeleteTemplateInput = z.infer<typeof DeleteTemplateInputSchema>;

export const DeleteTemplateOutputSchema = z
	.object({
		success: z
			.boolean()
			.describe('Indicates if template was successfully deleted'),
		message: z
			.string()
			.optional()
			.describe('Confirmation message from Carbone server'),
	})
	.describe('Response after deleting a template');
export type DeleteTemplateOutput = z.infer<typeof DeleteTemplateOutputSchema>;

export const ListTemplateCategoriesInputSchema = z
	.object({})
	.describe('Input parameters to list template categories');
export type ListTemplateCategoriesInput = z.infer<
	typeof ListTemplateCategoriesInputSchema
>;

export const ListTemplateCategoriesOutputSchema = z
	.object({
		success: z.boolean().describe('Indicates if listing categories succeeded'),
		data: z
			.array(CarboneCategory)
			.describe('List of category folder names used across templates'),
	})
	.describe('Response containing all active template categories');
export type ListTemplateCategoriesOutput = z.infer<
	typeof ListTemplateCategoriesOutputSchema
>;

export const ListTemplateTagsInputSchema = z
	.object({})
	.describe('Input parameters to list template tags');
export type ListTemplateTagsInput = z.infer<typeof ListTemplateTagsInputSchema>;

export const ListTemplateTagsOutputSchema = z
	.object({
		success: z.boolean().describe('Indicates if listing tags succeeded'),
		data: z
			.array(CarboneTag)
			.describe('List of tag names used across templates'),
	})
	.describe('Response containing all active template tags');
export type ListTemplateTagsOutput = z.infer<
	typeof ListTemplateTagsOutputSchema
>;

// ─── Render ──────────────────────────────────────────────────────────────────

export const GenerateReportInputSchema = z
	.object({
		templateId: z
			.string()
			.min(1, 'Template ID is required')
			.describe('64-character hexadecimal template ID or version ID to render'),
		data: z
			.union([JsonObjectSchema, z.array(JsonValueSchema)])
			.optional()
			.describe(
				'JSON dataset to merge into the document template placeholders',
			),
		convertTo: z
			.union([
				z.string(),
				z.object({
					formatName: z
						.string()
						.describe('Target file format extension for conversion output'),
					formatOptions: JsonObjectSchema.optional().describe(
						'Optional converter-specific options for the target format',
					),
				}),
			])
			.optional()
			.describe(
				'Target file format extension to convert output document into (e.g. pdf, docx, xlsx, html)',
			),
		converter: z
			.string()
			.optional()
			.describe('Converter engine to use for document conversion'),
		lang: z
			.string()
			.optional()
			.describe(
				'Localization language code for formatting numbers, dates, and currency (e.g. en-US, fr-FR)',
			),
		timezone: z
			.string()
			.optional()
			.describe(
				'IANA timezone string for date/time calculations (e.g. Europe/Paris, America/New_York)',
			),
		currency: z
			.string()
			.optional()
			.describe(
				'ISO 4217 currency code for currency formatters (e.g. USD, EUR)',
			),
		translations: z
			.record(z.string(), z.record(z.string(), z.string()))
			.optional()
			.describe('Dictionary of translation strings per locale'),
		enum: z
			.record(z.string(), z.record(z.string(), z.string()))
			.optional()
			.describe('Enum mapping dictionaries for translating code values'),
		variable: JsonObjectSchema.optional().describe(
			'Pre-calculated variables accessible globally within the template',
		),
		complement: JsonObjectSchema.optional().describe(
			'Complementary dataset accessible with the c. prefix in templates',
		),
		hardRefresh: z
			.boolean()
			.optional()
			.describe(
				'When true, recalculates all template functions and forces fresh render',
			),
	})
	.describe(
		'Input parameters for generating a document from a stored template',
	);
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

export const GenerateReportOutputSchema = z
	.object({
		success: z.boolean().describe('Indicates if report generation succeeded'),
		data: z
			.object({
				renderId: z
					.string()
					.describe(
						'Ephemeral unique render ID used to download the generated document file',
					),
			})
			.describe('Render result payload containing the render ID'),
	})
	.describe(
		'Output response with render ID for retrieving the rendered document',
	);
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export const RenderTemplateDirectInputSchema = z
	.object({
		template: z
			.string()
			.min(1, 'Template payload (base64 string) is required')
			.describe('Base64-encoded document template content'),
		data: z
			.union([JsonObjectSchema, z.array(JsonValueSchema)])
			.optional()
			.describe('JSON dataset to merge into the template placeholders'),
		convertTo: z
			.union([
				z.string(),
				z.object({
					formatName: z
						.string()
						.describe('Target output format extension for conversion output'),
					formatOptions: JsonObjectSchema.optional().describe(
						'Optional converter-specific options for the target format',
					),
				}),
			])
			.optional()
			.describe(
				'Target output document format extension (e.g. pdf, docx, xlsx, html)',
			),
		converter: z
			.string()
			.optional()
			.describe('Converter engine to use for document conversion'),
		lang: z
			.string()
			.optional()
			.describe('Localization language code for formatting numbers and dates'),
		timezone: z
			.string()
			.optional()
			.describe('IANA timezone string for date operations'),
		currency: z
			.string()
			.optional()
			.describe('ISO 4217 currency code for currency formatting'),
		translations: z
			.record(z.string(), z.record(z.string(), z.string()))
			.optional()
			.describe('Translation dictionaries for multi-language templates'),
		enum: z
			.record(z.string(), z.record(z.string(), z.string()))
			.optional()
			.describe('Enum dictionaries for code translation'),
		variable: JsonObjectSchema.optional().describe(
			'Pre-calculated variables accessible in template',
		),
		complement: JsonObjectSchema.optional().describe(
			'Complementary data accessible with c. prefix',
		),
		hardRefresh: z
			.boolean()
			.optional()
			.describe('Force complete recalculation of document fields'),
	})
	.describe(
		'Input parameters for direct one-off document rendering with an inline template',
	);
export type RenderTemplateDirectInput = z.infer<
	typeof RenderTemplateDirectInputSchema
>;

export const RenderTemplateDirectOutputSchema = z
	.object({
		success: z
			.boolean()
			.describe('Indicates if direct template rendering succeeded'),
		data: z
			.object({
				renderId: z
					.string()
					.describe('Unique render ID for downloading the generated document'),
			})
			.describe('Render result payload'),
	})
	.describe('Output containing render ID from direct template generation');
export type RenderTemplateDirectOutput = z.infer<
	typeof RenderTemplateDirectOutputSchema
>;

// ─── Version ─────────────────────────────────────────────────────────────────

export const SetApiVersionInputSchema = z
	.object({
		version: z
			.string()
			.min(1, 'API version string is required (e.g. "5")')
			.describe(
				'Carbone API major version string to use for subsequent requests (e.g. "5")',
			),
	})
	.describe('Input parameters to set the active Carbone API version');
export type SetApiVersionInput = z.infer<typeof SetApiVersionInputSchema>;

export const SetApiVersionOutputSchema = z
	.object({
		success: z
			.boolean()
			.describe('Indicates if setting API version was successful'),
		version: z
			.string()
			.describe('The active Carbone API version now configured'),
		message: z.string().describe('Confirmation message'),
	})
	.describe('Confirmation response after setting the API version');
export type SetApiVersionOutput = z.infer<typeof SetApiVersionOutputSchema>;

// ─── Endpoint Schemas & Mapping ──────────────────────────────────────────────

export const CarboneEndpointInputSchemas = {
	getStatus: GetStatusInputSchema,
	uploadTemplate: UploadTemplateInputSchema,
	listTemplates: ListTemplatesInputSchema,
	downloadTemplate: DownloadTemplateInputSchema,
	updateTemplate: UpdateTemplateInputSchema,
	deleteTemplate: DeleteTemplateInputSchema,
	listCategories: ListTemplateCategoriesInputSchema,
	listTags: ListTemplateTagsInputSchema,
	generateReport: GenerateReportInputSchema,
	renderDirect: RenderTemplateDirectInputSchema,
	setApiVersion: SetApiVersionInputSchema,
} as const;

export const CarboneEndpointOutputSchemas = {
	getStatus: GetStatusOutputSchema,
	uploadTemplate: UploadTemplateOutputSchema,
	listTemplates: ListTemplatesOutputSchema,
	downloadTemplate: DownloadTemplateOutputSchema,
	updateTemplate: UpdateTemplateOutputSchema,
	deleteTemplate: DeleteTemplateOutputSchema,
	listCategories: ListTemplateCategoriesOutputSchema,
	listTags: ListTemplateTagsOutputSchema,
	generateReport: GenerateReportOutputSchema,
	renderDirect: RenderTemplateDirectOutputSchema,
	setApiVersion: SetApiVersionOutputSchema,
} as const;

export type CarboneEndpointInputs = {
	getStatus: GetStatusInput;
	uploadTemplate: UploadTemplateInput;
	listTemplates: ListTemplatesInput;
	downloadTemplate: DownloadTemplateInput;
	updateTemplate: UpdateTemplateInput;
	deleteTemplate: DeleteTemplateInput;
	listCategories: ListTemplateCategoriesInput;
	listTags: ListTemplateTagsInput;
	generateReport: GenerateReportInput;
	renderDirect: RenderTemplateDirectInput;
	setApiVersion: SetApiVersionInput;
};

export type CarboneEndpointOutputs = {
	getStatus: GetStatusOutput;
	uploadTemplate: UploadTemplateOutput;
	listTemplates: ListTemplatesOutput;
	downloadTemplate: DownloadTemplateOutput;
	updateTemplate: UpdateTemplateOutput;
	deleteTemplate: DeleteTemplateOutput;
	listCategories: ListTemplateCategoriesOutput;
	listTags: ListTemplateTagsOutput;
	generateReport: GenerateReportOutput;
	renderDirect: RenderTemplateDirectOutput;
	setApiVersion: SetApiVersionOutput;
};
