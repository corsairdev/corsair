import type { SwaggerhubEndpoints } from '..';
import { specPath } from '../client';
import { call, queryOf } from './call';
import {
	SwaggerhubEndpointInputSchemas as Inputs,
	SwaggerhubEndpointOutputSchemas as Outputs,
} from './types';

/** The settings routes hang off one version, at `/settings/{lifecycle|private}`. */
function settingsPath(
	owner: string,
	api: string,
	version: string,
	setting: 'lifecycle' | 'private',
): string {
	return `${specPath('apis', owner, api, version)}/settings/${setting}`;
}

export const getLifecycle: SwaggerhubEndpoints['apiSettingsGetLifecycle'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apiSettings.getLifecycle',
			input: Inputs.apiSettingsGetLifecycle,
			output: Outputs.apiSettingsGetLifecycle,
		},
		input,
		({ owner, api, version }) => ({
			method: 'GET',
			path: settingsPath(owner, api, version, 'lifecycle'),
		}),
		{
			log: (parsed, result) => ({
				owner: parsed.owner,
				api: parsed.api,
				version: parsed.version,
				published: result.published ?? undefined,
			}),
		},
	);

/** Publishing a version is a lifecycle write, and `force` overwrites a published one. */
export const setLifecycle: SwaggerhubEndpoints['apiSettingsSetLifecycle'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apiSettings.setLifecycle',
			input: Inputs.apiSettingsSetLifecycle,
			output: Outputs.apiSettingsSetLifecycle,
		},
		input,
		({ owner, api, version, published, force }) => ({
			method: 'PUT',
			path: settingsPath(owner, api, version, 'lifecycle'),
			query: queryOf({ force }),
			body: { published },
		}),
		{
			log: (parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				version: parsed.version,
				published: parsed.published,
			}),
		},
	);

export const getVisibility: SwaggerhubEndpoints['apiSettingsGetVisibility'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apiSettings.getVisibility',
			input: Inputs.apiSettingsGetVisibility,
			output: Outputs.apiSettingsGetVisibility,
		},
		input,
		({ owner, api, version }) => ({
			method: 'GET',
			path: settingsPath(owner, api, version, 'private'),
		}),
		{
			log: (parsed, result) => ({
				owner: parsed.owner,
				api: parsed.api,
				version: parsed.version,
				private: result.private,
			}),
		},
	);

export const setVisibility: SwaggerhubEndpoints['apiSettingsSetVisibility'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apiSettings.setVisibility',
			input: Inputs.apiSettingsSetVisibility,
			output: Outputs.apiSettingsSetVisibility,
		},
		input,
		({ owner, api, version, private: isPrivate }) => ({
			method: 'PUT',
			path: settingsPath(owner, api, version, 'private'),
			body: { private: isPrivate },
		}),
		{
			log: (parsed) => ({
				owner: parsed.owner,
				api: parsed.api,
				version: parsed.version,
			}),
		},
	);
