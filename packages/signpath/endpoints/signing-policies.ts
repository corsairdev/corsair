import type { SignpathEndpoints } from '..';
import { segment } from '../client';
import { assertBodyless, call, orgPath } from './shared';
import {
	SignpathEndpointInputSchemas as Inputs,
	SignpathEndpointOutputSchemas as Outputs,
} from './types';

function policyPath(
	organizationId: string,
	projectSlug: string,
	signingPolicySlug: string,
	suffix = '',
): string {
	return orgPath(
		organizationId,
		`/Projects/${segment(projectSlug)}/SigningPolicies/${segment(signingPolicySlug)}${suffix}`,
	);
}

export const get: SignpathEndpoints['signingPoliciesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'signingPolicies.get',
			input: Inputs.signingPoliciesGet,
			output: Outputs.signingPoliciesGet,
		},
		input,
		({ projectSlug, signingPolicySlug }, organizationId) => ({
			method: 'GET',
			path: policyPath(organizationId, projectSlug, signingPolicySlug),
		}),
		{
			log: ({ projectSlug, signingPolicySlug }) => ({
				projectSlug,
				signingPolicySlug,
			}),
		},
	);

export const create: SignpathEndpoints['signingPoliciesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'signingPolicies.create',
			input: Inputs.signingPoliciesCreate,
			output: Outputs.signingPoliciesCreate,
		},
		input,
		({ projectSlug, ...body }, organizationId) => ({
			method: 'POST',
			path: orgPath(
				organizationId,
				`/Projects/${segment(projectSlug)}/SigningPolicies`,
			),
			body,
		}),
		{
			// 201 is a Location header with no body. The policy is created
			// inactive, so the caller still has to activate it.
			shape: (raw, { projectSlug, slug }) => {
				assertBodyless(raw, 'signingPolicies.create');
				return {
					projectSlug,
					signingPolicySlug: slug,
					created: true as const,
				};
			},
			log: ({ projectSlug, slug }) => ({
				projectSlug,
				signingPolicySlug: slug,
			}),
		},
	);

export const update: SignpathEndpoints['signingPoliciesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'signingPolicies.update',
			input: Inputs.signingPoliciesUpdate,
			output: Outputs.signingPoliciesUpdate,
		},
		input,
		({ projectSlug, signingPolicySlug, ...body }, organizationId) => ({
			method: 'POST',
			path: policyPath(organizationId, projectSlug, signingPolicySlug, '/Edit'),
			body,
		}),
		{
			shape: (raw, { projectSlug, signingPolicySlug }) => {
				assertBodyless(raw, 'signingPolicies.update');
				return { projectSlug, signingPolicySlug, success: true as const };
			},
			log: ({ projectSlug, signingPolicySlug, slug }) => ({
				projectSlug,
				signingPolicySlug,
				slug,
			}),
		},
	);

/** Activate and deactivate share a route shape and an empty 204. */
function changeStatus(
	ctx: Parameters<SignpathEndpoints['signingPoliciesActivate']>[0],
	action: 'Activate' | 'Deactivate',
	input: unknown, // unknown: raw caller input, parsed by call()
) {
	return call(
		ctx,
		{
			event: `signingPolicies.${action.toLowerCase()}`,
			input: Inputs.signingPoliciesActivate,
			output: Outputs.signingPoliciesActivate,
		},
		input,
		({ projectSlug, signingPolicySlug }, organizationId) => ({
			method: 'POST',
			path: policyPath(
				organizationId,
				projectSlug,
				signingPolicySlug,
				`/${action}`,
			),
		}),
		{
			shape: (raw, { projectSlug, signingPolicySlug }) => {
				assertBodyless(raw, `signingPolicies.${action.toLowerCase()}`);
				return { projectSlug, signingPolicySlug, success: true as const };
			},
			log: ({ projectSlug, signingPolicySlug }) => ({
				projectSlug,
				signingPolicySlug,
			}),
		},
	);
}

export const activate: SignpathEndpoints['signingPoliciesActivate'] = (
	ctx,
	input,
) => changeStatus(ctx, 'Activate', input);

export const deactivate: SignpathEndpoints['signingPoliciesDeactivate'] = (
	ctx,
	input,
) => changeStatus(ctx, 'Deactivate', input);
