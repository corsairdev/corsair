import type { RenderformEndpoints } from '..';
import { call } from './call';
import {
	RenderformEndpointInputSchemas as Inputs,
	RenderformEndpointOutputSchemas as Outputs,
} from './types';

/** The template list answers a bare array, not a page, which is worth knowing. */
export const list: RenderformEndpoints['templatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.list',
			input: Inputs.templatesList,
			output: Outputs.templatesList,
		},
		input,
		({ name, tags, sourceTemplateId, page, size }) => ({
			method: 'GET',
			path: '/api/v2/my-templates',
			query: { name, tags, sourceTemplateId, page, size },
			replayable: true,
		}),
		{
			log: (_, result) => ({ templates: result.length }),
		},
	);

export const get: RenderformEndpoints['templatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.get',
			input: Inputs.templatesGet,
			output: Outputs.templatesGet,
		},
		input,
		({ templateId }) => ({
			method: 'GET',
			path: `/api/v2/my-templates/${encodeURIComponent(templateId)}`,
			replayable: true,
		}),
		{
			log: (_, result) => ({
				name: result.name ?? undefined,
				editor: result.editor ?? undefined,
				format: result.outputFormat ?? undefined,
			}),
		},
	);

/**
 * Creates a template.
 *
 * A video output format needs the `canvas-html` editor, and a video template takes
 * a `recordDuration` and `fps`; an image template ignores both.
 */
export const create: RenderformEndpoints['templatesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.create',
			input: Inputs.templatesCreate,
			output: Outputs.templatesCreate,
		},
		input,
		({
			name,
			width,
			height,
			editor,
			tags,
			outputFormat,
			recordDuration,
			fps,
		}) => ({
			method: 'POST',
			path: '/api/v2/my-templates',
			body: {
				name,
				width,
				height,
				editor,
				tags,
				outputFormat,
				recordDuration,
				fps,
			},
			// Two creates make two templates with different identifiers.
			replayable: false,
		}),
		{
			log: (parsed, result) => ({
				identifier: result.identifier ?? undefined,
				editor: parsed.editor,
			}),
		},
	);

/** Updates metadata only. The template's content is a separate route. */
export const update: RenderformEndpoints['templatesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.update',
			input: Inputs.templatesUpdate,
			output: Outputs.templatesUpdate,
		},
		input,
		({ templateId, name, width, height, tags, outputFormat }) => ({
			method: 'PATCH',
			path: `/api/v2/my-templates/${encodeURIComponent(templateId)}`,
			body: { name, width, height, tags, outputFormat },
			// A PATCH with the same body leaves the same metadata.
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				templateId: parsed.templateId,
				name: result.name ?? undefined,
			}),
		},
	);

export const remove: RenderformEndpoints['templatesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.delete',
			input: Inputs.templatesDelete,
			output: Outputs.templatesDelete,
		},
		input,
		({ templateId }) => ({
			method: 'DELETE',
			path: `/api/v2/my-templates/${encodeURIComponent(templateId)}`,
			// A second delete finds nothing; the template is already gone.
			replayable: false,
		}),
		{
			shape: () => ({}),
			log: (parsed) => ({ templateId: parsed.templateId }),
		},
	);

/**
 * Reads a template's raw content, which only an `html-editor` template has.
 * `sampleData` is the useful part: it shows the merge fields a render should fill.
 */
export const content: RenderformEndpoints['templateContentGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.content.get',
			input: Inputs.templateContentGet,
			output: Outputs.templateContentGet,
		},
		input,
		({ templateId }) => ({
			method: 'GET',
			path: `/api/v2/my-templates/${encodeURIComponent(templateId)}/html-editor`,
			replayable: true,
		}),
		{
			log: (_, result) => ({
				hasHtml: (result.html?.length ?? 0) > 0,
				sampleFields: Object.keys(result.sampleData ?? {}).length,
			}),
		},
	);

/**
 * Replaces a template's raw content. `html` is required and only an
 * `html-editor` template accepts it; `sampleData` is optional.
 */
export const updateContent: RenderformEndpoints['templateContentUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.content.update',
			input: Inputs.templateContentUpdate,
			output: Outputs.templateContentUpdate,
		},
		input,
		({ templateId, html, css, sampleData }) => ({
			method: 'PUT',
			path: `/api/v2/my-templates/${encodeURIComponent(templateId)}/html-editor`,
			body: { html, css, sampleData },
			// A PUT with the same content leaves the same template.
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				templateId: parsed.templateId,
				htmlLength: result.html?.length ?? 0,
			}),
		},
	);
