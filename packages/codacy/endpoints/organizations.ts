import { logEventFromContext } from 'corsair/core';
import { getCodacyCredentials, makeCodacyRequest } from '../client';
import type {
	CodacyContext,
	CodacyEndpointInputs,
	CodacyEndpointOutputs,
	CodacyEndpoints,
} from '../index';
import {
	OrganizationGetInputSchema,
	OrganizationGetOutputSchema,
	OrganizationListInputSchema,
	OrganizationListOutputSchema,
	parseEndpointInput,
} from './types';

/**
 * List organizations for the authenticated user, across all Git providers
 * or restricted to a single provider.
 *
 * API: GET /user/organizations[/{provider}]
 * Docs: https://api.codacy.com/api/api-docs
 */
export const list: CodacyEndpoints['organizationList'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['organizationList'],
): Promise<CodacyEndpointOutputs['organizationList']> => {
	const valid = parseEndpointInput(OrganizationListInputSchema, input);
	const token = await getCodacyCredentials(ctx);
	const { provider, cursor, limit } = valid;
	const path = provider
		? `/user/organizations/${encodeURIComponent(provider)}`
		: '/user/organizations';

	const response = await makeCodacyRequest<
		CodacyEndpointOutputs['organizationList']
	>(path, token, { query: { cursor, limit } });

	const parsed = OrganizationListOutputSchema.parse(response);

	if (ctx.db.organizations) {
		try {
			for (const organization of parsed.data) {
				await ctx.db.organizations.upsertByEntityId(
					`${organization.provider}/${organization.name}`,
					{ ...organization },
				);
			}
		} catch (error) {
			console.warn('Failed to save organizations to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'codacy.organizations.list',
		{ ...valid },
		'completed',
	);
	return parsed;
};

/**
 * Get a single organization by provider and name.
 *
 * API: GET /organizations/{provider}/{remoteOrganizationName}
 * Docs: https://api.codacy.com/api/api-docs
 */
export const get: CodacyEndpoints['organizationGet'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['organizationGet'],
): Promise<CodacyEndpointOutputs['organizationGet']> => {
	const { provider, organization_name } = parseEndpointInput(
		OrganizationGetInputSchema,
		input,
	);
	const token = await getCodacyCredentials(ctx);

	const response = await makeCodacyRequest<
		CodacyEndpointOutputs['organizationGet']
	>(
		`/organizations/${encodeURIComponent(provider)}/${encodeURIComponent(organization_name)}`,
		token,
	);

	const parsed = OrganizationGetOutputSchema.parse(response);

	if (ctx.db.organizations) {
		const { organization } = parsed.data;
		try {
			await ctx.db.organizations.upsertByEntityId(
				`${organization.provider}/${organization.name}`,
				{ ...organization },
			);
		} catch (error) {
			console.warn('Failed to save organization to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'codacy.organizations.get',
		{ provider, organization_name },
		'completed',
	);
	return parsed;
};
