import type { SwaggerhubEndpoints } from '..';
import { segment, specPath } from '../client';
import { call, queryOf, readDefinition } from './call';
import {
	SwaggerhubEndpointInputSchemas as Inputs,
	SwaggerhubEndpointOutputSchemas as Outputs,
} from './types';

/** The media type a definition body is sent with. */
function mediaTypeOf(format: 'yaml' | 'json' | undefined): string {
	return format === 'json' ? 'application/json' : 'application/yaml';
}

export const list: SwaggerhubEndpoints['domainsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.list',
			input: Inputs.domainsList,
			output: Outputs.domainsList,
		},
		input,
		({ owner, page, limit, sort, order }) => ({
			method: 'GET',
			path: `/domains/${segment(owner)}`,
			query: queryOf({ page, limit, sort, order }),
		}),
		{
			log: (parsed, result) => ({
				owner: parsed.owner,
				count: result.apis.length,
			}),
		},
	);

export const getVersions: SwaggerhubEndpoints['domainsGetVersions'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'domains.getVersions',
			input: Inputs.domainsGetVersions,
			output: Outputs.domainsGetVersions,
		},
		input,
		({ owner, domain }) => ({
			method: 'GET',
			path: specPath('domains', owner, domain),
		}),
		{
			log: (parsed, result) => ({
				owner: parsed.owner,
				domain: parsed.domain,
				count: result.apis.length,
			}),
		},
	);

export const getDefinition: SwaggerhubEndpoints['domainsGetDefinition'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'domains.getDefinition',
			input: Inputs.domainsGetDefinition,
			output: Outputs.domainsGetDefinition,
		},
		input,
		({ owner, domain, version }) => ({
			method: 'GET',
			path: specPath('domains', owner, domain, version),
		}),
		{
			shape: (raw, parsed) => ({
				owner: parsed.owner,
				domain: parsed.domain,
				version: parsed.version,
				definition: readDefinition(raw),
			}),
			log: (parsed) => ({
				owner: parsed.owner,
				domain: parsed.domain,
				version: parsed.version,
			}),
		},
	);

export const save: SwaggerhubEndpoints['domainsSave'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.save',
			input: Inputs.domainsSave,
			output: Outputs.domainsSave,
		},
		input,
		({
			owner,
			domain,
			definition,
			format,
			version,
			isPrivate,
			force,
			projectName,
		}) => ({
			method: 'POST',
			path: specPath('domains', owner, domain),
			query: queryOf({ version, isPrivate, force, projectName }),
			definition: { content: definition, mediaType: mediaTypeOf(format) },
		}),
		{
			shape: (_, parsed) => ({
				owner: parsed.owner,
				domain: parsed.domain,
				version: parsed.version ?? null,
				created: parsed.force !== true,
				saved: true,
			}),
			log: (parsed) => ({
				owner: parsed.owner,
				domain: parsed.domain,
				version: parsed.version,
			}),
		},
	);

export const remove: SwaggerhubEndpoints['domainsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.delete',
			input: Inputs.domainsDelete,
			output: Outputs.domainsDelete,
		},
		input,
		({ owner, domain, force }) => ({
			method: 'DELETE',
			path: specPath('domains', owner, domain),
			query: queryOf({ force }),
		}),
		{
			shape: (_, parsed) => ({
				owner: parsed.owner,
				domain: parsed.domain,
				deleted: true,
			}),
			log: (parsed) => ({ owner: parsed.owner, domain: parsed.domain }),
		},
	);

export const removeVersion: SwaggerhubEndpoints['domainsDeleteVersion'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'domains.deleteVersion',
			input: Inputs.domainsDeleteVersion,
			output: Outputs.domainsDeleteVersion,
		},
		input,
		({ owner, domain, version, force }) => ({
			method: 'DELETE',
			path: specPath('domains', owner, domain, version),
			query: queryOf({ force }),
		}),
		{
			shape: (_, parsed) => ({
				owner: parsed.owner,
				domain: parsed.domain,
				version: parsed.version,
				deleted: true,
			}),
			log: (parsed) => ({
				owner: parsed.owner,
				domain: parsed.domain,
				version: parsed.version,
			}),
		},
	);
