import { asRecord } from 'corsair/core';
import type { SwaggerhubEndpoints } from '..';
import { segment, specPath } from '../client';
import { bodyOr, call, queryOf, readBareArray, readDefinition } from './call';
import {
	SwaggerhubEndpointInputSchemas as Inputs,
	SwaggerhubEndpointOutputSchemas as Outputs,
} from './types';

/** The media type a definition body is sent with. */
function mediaTypeOf(format: 'yaml' | 'json' | undefined): string {
	return format === 'json' ? 'application/json' : 'application/yaml';
}

export const list: SwaggerhubEndpoints['apisList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'apis.list',
			input: Inputs.apisList,
			output: Outputs.apisList,
		},
		input,
		({ owner, filter, page, limit, sort, order }) => ({
			method: 'GET',
			path: `/apis/${segment(owner)}`,
			query: queryOf({ filter, page, limit, sort, order }),
		}),
		{
			log: (parsed, result) => ({
				owner: parsed.owner,
				count: result.apis.length,
			}),
		},
	);

export const listVersions: SwaggerhubEndpoints['apisListVersions'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apis.listVersions',
			input: Inputs.apisListVersions,
			output: Outputs.apisListVersions,
		},
		input,
		({ owner, api }) => ({
			method: 'GET',
			path: specPath('apis', owner, api),
		}),
		{
			log: (parsed, result) => ({
				owner: parsed.owner,
				api: parsed.api,
				count: result.apis.length,
			}),
		},
	);

export const getDefinition: SwaggerhubEndpoints['apisGetDefinition'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apis.getDefinition',
			input: Inputs.apisGetDefinition,
			output: Outputs.apisGetDefinition,
		},
		input,
		({ owner, api, version, resolved, flatten }) => ({
			method: 'GET',
			path: specPath('apis', owner, api, version),
			query: queryOf({ resolved, flatten }),
		}),
		{
			shape: (raw, parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				version: parsed.version,
				definition: readDefinition(raw),
			}),
			log: (parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				version: parsed.version,
			}),
		},
	);

/**
 * Saves the definition itself as the body. For OpenAPI and AsyncAPI the version
 * is read from `info.version`, so `version` is only needed for GraphQL and MCP.
 * The route answers 200, 201 or 205 with no body, so the plugin reports what it
 * wrote.
 */
export const save: SwaggerhubEndpoints['apisSave'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'apis.save',
			input: Inputs.apisSave,
			output: Outputs.apisSave,
		},
		input,
		({
			owner,
			api,
			definition,
			format,
			version,
			isPrivate,
			force,
			projectName,
			noReconcile,
		}) => ({
			method: 'POST',
			path: specPath('apis', owner, api),
			query: queryOf({
				version,
				isPrivate,
				force,
				projectName,
				noReconcile,
			}),
			definition: { content: definition, mediaType: mediaTypeOf(format) },
		}),
		{
			// The reply carries no body, so everything reported came from the input.
			shape: (_, parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				version: parsed.version ?? null,
				saved: true,
			}),
			log: (parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				version: parsed.version,
			}),
		},
	);

export const remove: SwaggerhubEndpoints['apisDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'apis.delete',
			input: Inputs.apisDelete,
			output: Outputs.apisDelete,
		},
		input,
		({ owner, api }) => ({
			method: 'DELETE',
			path: specPath('apis', owner, api),
		}),
		{
			shape: (_, parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				deleted: true,
			}),
			log: (parsed) => ({ owner: parsed.owner, api: parsed.api }),
		},
	);

export const removeVersion: SwaggerhubEndpoints['apisDeleteVersion'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apis.deleteVersion',
			input: Inputs.apisDeleteVersion,
			output: Outputs.apisDeleteVersion,
		},
		input,
		({ owner, api, version }) => ({
			method: 'DELETE',
			path: specPath('apis', owner, api, version),
		}),
		{
			shape: (_, parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				version: parsed.version,
				deleted: true,
			}),
			log: (parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				version: parsed.version,
			}),
		},
	);

export const cloneVersion: SwaggerhubEndpoints['apisCloneVersion'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apis.cloneVersion',
			input: Inputs.apisCloneVersion,
			output: Outputs.apisCloneVersion,
		},
		input,
		({ owner, api, version, newVersion, private: isPrivate }) => ({
			method: 'POST',
			path: `${specPath('apis', owner, api, version)}/clone`,
			body: {
				version: newVersion,
				...(isPrivate === undefined ? {} : { private: isPrivate }),
			},
		}),
		{
			shape: (_, parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				sourceVersion: parsed.version,
				version: parsed.newVersion,
				created: true,
			}),
			log: (parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				sourceVersion: parsed.version,
				version: parsed.newVersion,
			}),
		},
	);

export const forkVersion: SwaggerhubEndpoints['apisForkVersion'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apis.forkVersion',
			input: Inputs.apisForkVersion,
			output: Outputs.apisForkVersion,
		},
		input,
		({
			owner,
			api,
			version,
			targetOwner,
			targetName,
			targetVersion,
			project,
			private: isPrivate,
		}) => ({
			method: 'POST',
			path: `${specPath('apis', owner, api, version)}/fork`,
			body: {
				owner: targetOwner,
				name: targetName,
				version: targetVersion,
				...(project === undefined ? {} : { project }),
				...(isPrivate === undefined ? {} : { private: isPrivate }),
			},
		}),
		{
			shape: (_, parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				targetOwner: parsed.targetOwner,
				targetName: parsed.targetName,
				targetVersion: parsed.targetVersion,
				forked: true,
			}),
			log: (parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				targetOwner: parsed.targetOwner,
				targetName: parsed.targetName,
			}),
		},
	);

/** The comparison answers a **bare array** of differences. */
export const compare: SwaggerhubEndpoints['apisCompare'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'apis.compare',
			input: Inputs.apisCompare,
			output: Outputs.apisCompare,
		},
		input,
		({ owner, api, version, definition, format, method }) => ({
			method: 'POST',
			path: `${specPath('apis', owner, api, version)}/compare`,
			query: queryOf({ method }),
			definition: { content: definition, mediaType: mediaTypeOf(format) },
		}),
		{
			shape: (raw, parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				version: parsed.version,
				// The documented answer is a bare array; anything else is an error,
				// not an empty comparison.
				changes: readBareArray(raw, 'comparison'),
			}),
			log: (_, result) => ({ count: result.changes.length }),
		},
	);

export const getCapabilities: SwaggerhubEndpoints['apisGetCapabilities'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apis.getCapabilities',
			input: Inputs.apisGetCapabilities,
			output: Outputs.apisGetCapabilities,
		},
		input,
		({ owner, api, version }) => ({
			method: 'GET',
			path: `${specPath('apis', owner, api, version)}/capabilities`,
		}),
		{
			log: (parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				version: parsed.version,
			}),
		},
	);

export const getDefaultVersion: SwaggerhubEndpoints['apisGetDefaultVersion'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apis.getDefaultVersion',
			input: Inputs.apisGetDefaultVersion,
			output: Outputs.apisGetDefaultVersion,
		},
		input,
		({ owner, api }) => ({
			method: 'GET',
			path: `${specPath('apis', owner, api)}/settings/default`,
		}),
		{
			shape: (raw, parsed) => {
				const record = asRecord(raw);
				const version = record?.version;
				return {
					owner: parsed.owner,
					api: parsed.api,
					version: typeof version === 'string' ? version : null,
				};
			},
			log: (parsed, result) => ({
				owner: parsed.owner,
				api: parsed.api,
				version: result.version ?? undefined,
			}),
		},
	);

export const setDefaultVersion: SwaggerhubEndpoints['apisSetDefaultVersion'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apis.setDefaultVersion',
			input: Inputs.apisSetDefaultVersion,
			output: Outputs.apisSetDefaultVersion,
		},
		input,
		({ owner, api, version }) => ({
			method: 'PUT',
			path: `${specPath('apis', owner, api)}/settings/default`,
			body: { version },
		}),
		{
			shape: (_, parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				version: parsed.version,
			}),
			log: (parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				version: parsed.version,
			}),
		},
	);

export const rename: SwaggerhubEndpoints['apisRename'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'apis.rename',
			input: Inputs.apisRename,
			output: Outputs.apisRename,
		},
		input,
		({ owner, api, newName }) => ({
			method: 'POST',
			path: `${specPath('apis', owner, api)}/rename`,
			query: { newName },
		}),
		{
			shape: (_, parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				newName: parsed.newName,
				renamed: true,
			}),
			log: (parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				newName: parsed.newName,
			}),
		},
	);

export const getNotifications: SwaggerhubEndpoints['apisGetNotifications'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apis.getNotifications',
			input: Inputs.apisGetNotifications,
			output: Outputs.apisGetNotifications,
		},
		input,
		({ owner, api, scope, version }) => ({
			method: 'GET',
			path: `${specPath('apis', owner, api)}/.notifications`,
			query: queryOf({ scope, version }),
		}),
		{
			log: (parsed, result) => ({
				owner: parsed.owner,
				api: parsed.api,
				count: result.enabled?.length ?? 0,
			}),
		},
	);

/** The route takes the body as the bare list of scopes. */
export const setNotifications: SwaggerhubEndpoints['apisSetNotifications'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apis.setNotifications',
			input: Inputs.apisSetNotifications,
			output: Outputs.apisSetNotifications,
		},
		input,
		({ owner, api, enabled }) => ({
			method: 'PUT',
			path: `${specPath('apis', owner, api)}/.notifications`,
			body: enabled,
		}),
		{
			// The route answers 200 with no body; report the scopes that were sent.
			shape: (raw, parsed) => bodyOr(raw, { enabled: parsed.enabled }),
			log: (parsed, result) => ({
				owner: parsed.owner,
				api: parsed.api,
				count: result.enabled?.length ?? parsed.enabled.length,
			}),
		},
	);

export const disableNotifications: SwaggerhubEndpoints['apisDisableNotifications'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'apis.disableNotifications',
				input: Inputs.apisDisableNotifications,
				output: Outputs.apisDisableNotifications,
			},
			input,
			({ owner, api }) => ({
				method: 'DELETE',
				path: `${specPath('apis', owner, api)}/.notifications`,
			}),
			{
				// The route answers 200 with no body, so an empty result is the
				// documented success rather than an unexpected shape.
				shape: (raw) => {
					const record = asRecord(raw);
					const enabled = record?.enabled;
					return { enabled: Array.isArray(enabled) ? enabled : [] };
				},
				log: (parsed, result) => ({
					owner: parsed.owner,
					api: parsed.api,
					count: result.enabled?.length ?? 0,
				}),
			},
		);
