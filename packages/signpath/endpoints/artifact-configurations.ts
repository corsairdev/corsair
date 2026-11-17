import type { SignpathEndpoints } from '..';
import { segment } from '../client';
import { assertBodyless, call, orgPath } from './shared';
import {
	SignpathEndpointInputSchemas as Inputs,
	SignpathEndpointOutputSchemas as Outputs,
} from './types';

function artifactConfigurationPath(
	organizationId: string,
	projectSlug: string,
	artifactConfigurationSlug: string,
	suffix: string,
): string {
	return orgPath(
		organizationId,
		`/Projects/${segment(projectSlug)}/ArtifactConfigurations/${segment(artifactConfigurationSlug)}${suffix}`,
	);
}

/**
 * The route answers `application/xml`, which core's client reads with
 * `response.text()`, so the body arrives as a string.
 */
export const getXml: SignpathEndpoints['artifactConfigurationsGetXml'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'artifactConfigurations.getXml',
			input: Inputs.artifactConfigurationsGetXml,
			output: Outputs.artifactConfigurationsGetXml,
		},
		input,
		({ projectSlug, artifactConfigurationSlug }, organizationId) => ({
			method: 'GET',
			path: artifactConfigurationPath(
				organizationId,
				projectSlug,
				artifactConfigurationSlug,
				'/Xml',
			),
			accept: 'application/xml',
		}),
		{
			shape: (raw, { projectSlug, artifactConfigurationSlug }) => {
				if (typeof raw !== 'string' || raw.trim().length === 0) {
					throw new Error(
						'artifactConfigurations.getXml expected an XML document from SignPath.',
					);
				}
				return { projectSlug, artifactConfigurationSlug, xml: raw };
			},
			log: ({ projectSlug, artifactConfigurationSlug }, result) => ({
				projectSlug,
				artifactConfigurationSlug,
				bytes: result.xml.length,
			}),
		},
	);

export const updateXml: SignpathEndpoints['artifactConfigurationsUpdateXml'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'artifactConfigurations.updateXml',
			input: Inputs.artifactConfigurationsUpdateXml,
			output: Outputs.artifactConfigurationsUpdateXml,
		},
		input,
		(
			{ projectSlug, artifactConfigurationSlug, artifactConfigurationXml },
			organizationId,
		) => ({
			method: 'POST',
			path: artifactConfigurationPath(
				organizationId,
				projectSlug,
				artifactConfigurationSlug,
				'/EditXml',
			),
			body: { artifactConfigurationXml },
		}),
		{
			shape: (raw, { projectSlug, artifactConfigurationSlug }) => {
				assertBodyless(raw, 'artifactConfigurations.updateXml');
				return {
					projectSlug,
					artifactConfigurationSlug,
					success: true as const,
				};
			},
			log: ({
				projectSlug,
				artifactConfigurationSlug,
				artifactConfigurationXml,
			}) => ({
				projectSlug,
				artifactConfigurationSlug,
				bytes: artifactConfigurationXml.length,
			}),
		},
	);

/** Activate and deactivate share a route shape and an empty 204. */
function changeStatus(
	ctx: Parameters<SignpathEndpoints['artifactConfigurationsActivate']>[0],
	action: 'Activate' | 'Deactivate',
	input: unknown, // unknown: raw caller input, parsed by call()
) {
	return call(
		ctx,
		{
			event: `artifactConfigurations.${action.toLowerCase()}`,
			input: Inputs.artifactConfigurationsActivate,
			output: Outputs.artifactConfigurationsActivate,
		},
		input,
		({ projectSlug, artifactConfigurationSlug }, organizationId) => ({
			method: 'POST',
			path: artifactConfigurationPath(
				organizationId,
				projectSlug,
				artifactConfigurationSlug,
				`/${action}`,
			),
		}),
		{
			shape: (raw, { projectSlug, artifactConfigurationSlug }) => {
				assertBodyless(raw, `artifactConfigurations.${action.toLowerCase()}`);
				return {
					projectSlug,
					artifactConfigurationSlug,
					success: true as const,
				};
			},
			log: ({ projectSlug, artifactConfigurationSlug }) => ({
				projectSlug,
				artifactConfigurationSlug,
			}),
		},
	);
}

export const activate: SignpathEndpoints['artifactConfigurationsActivate'] = (
	ctx,
	input,
) => changeStatus(ctx, 'Activate', input);

export const deactivate: SignpathEndpoints['artifactConfigurationsDeactivate'] =
	(ctx, input) => changeStatus(ctx, 'Deactivate', input);
