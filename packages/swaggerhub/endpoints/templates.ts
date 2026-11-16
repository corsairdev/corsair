import type { SwaggerhubEndpoints } from '..';
import { specPath } from '../client';
import { call, queryOf, readBareArray, readDefinition } from './call';
import {
	SwaggerhubEndpointInputSchemas as Inputs,
	SwaggerhubEndpointOutputSchemas as Outputs,
} from './types';

/** The media type a definition body is sent with. */
function mediaTypeOf(format: 'yaml' | 'json' | undefined): string {
	return format === 'json' ? 'application/json' : 'application/yaml';
}

/**
 * Answers a **bare array** of template wrappers. `owner` narrows the catalog to
 * one owner's templates; SwaggerHub's own built-ins are included as `builtIn`.
 */
export const list: SwaggerhubEndpoints['templatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.list',
			input: Inputs.templatesList,
			output: Outputs.templatesList,
		},
		input,
		({ owner }) => ({
			method: 'GET',
			path: '/templates',
			query: queryOf({ owner }),
		}),
		{
			shape: (raw) => ({
				templates: readBareArray(raw, 'template list'),
			}),
			log: (_, result) => ({ count: result.templates.length }),
		},
	);

export const get: SwaggerhubEndpoints['templatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.get',
			input: Inputs.templatesGet,
			output: Outputs.templatesGet,
		},
		input,
		({ owner, templateId, version, flatten, builtin }) => ({
			method: 'GET',
			path: specPath('templates', owner, templateId, version),
			query: queryOf({ flatten, builtin }),
		}),
		{
			shape: (raw, parsed) => ({
				owner: parsed.owner,
				templateId: parsed.templateId,
				version: parsed.version,
				definition: readDefinition(raw),
			}),
			log: (parsed) => ({
				owner: parsed.owner,
				templateId: parsed.templateId,
				version: parsed.version,
			}),
		},
	);

export const save: SwaggerhubEndpoints['templatesSave'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.save',
			input: Inputs.templatesSave,
			output: Outputs.templatesSave,
		},
		input,
		({ owner, templateId, definition, format, version, isPrivate, force }) => ({
			method: 'POST',
			path: specPath('templates', owner, templateId),
			query: queryOf({ version, isPrivate, force }),
			definition: { content: definition, mediaType: mediaTypeOf(format) },
		}),
		{
			shape: (_, parsed) => ({
				owner: parsed.owner,
				templateId: parsed.templateId,
				version: parsed.version ?? null,
				saved: true,
			}),
			log: (parsed) => ({
				owner: parsed.owner,
				templateId: parsed.templateId,
				version: parsed.version,
			}),
		},
	);

export const remove: SwaggerhubEndpoints['templatesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.delete',
			input: Inputs.templatesDelete,
			output: Outputs.templatesDelete,
		},
		input,
		({ owner, templateId, version }) => ({
			method: 'DELETE',
			path: specPath('templates', owner, templateId, version),
		}),
		{
			shape: (_, parsed) => ({
				owner: parsed.owner,
				templateId: parsed.templateId,
				version: parsed.version,
				deleted: true,
			}),
			log: (parsed) => ({
				owner: parsed.owner,
				templateId: parsed.templateId,
				version: parsed.version,
			}),
		},
	);
