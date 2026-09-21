import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { getCodacyCredentials, makeCodacyRequest } from '../client';
import type {
	CodacyContext,
	CodacyEndpointInputs,
	CodacyEndpointOutputs,
	CodacyEndpoints,
} from '../index';
import {
	CodacyAccountResponseSchema,
	CodacyEndpointOutputSchemas,
	OrganizationOutputSchema,
} from './types';

/**
 * Get the authenticated user's account details.
 *
 * API: GET /account
 * Docs: https://docs.codacy.com/codacy-api/using-the-codacy-api/
 */
export const getAccount: CodacyEndpoints['accountGet'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['accountGet'],
): Promise<CodacyEndpointOutputs['accountGet']> => {
	const token = await getCodacyCredentials(ctx);

	const response = await makeCodacyRequest<
		z.infer<typeof CodacyAccountResponseSchema>
	>('/account', token);

	const parsed = CodacyAccountResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'codacy.account.get',
		{ ...input },
		'completed',
	);
	return parsed;
};

/**
 * List all organizations accessible by the authenticated user.
 *
 * API: GET /organizations
 * Docs: https://docs.codacy.com/codacy-api/using-the-codacy-api/
 */
export const list: CodacyEndpoints['organizationList'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['organizationList'],
): Promise<CodacyEndpointOutputs['organizationList']> => {
	const token = await getCodacyCredentials(ctx);

	const response = await makeCodacyRequest<
		z.infer<typeof OrganizationOutputSchema>
	>('/organizations', token, { query: input });

	const parsed = OrganizationOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'codacy.organizations.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

/**
 * Get a single organization by ID.
 *
 * API: GET /organizations/:organization_id
 * Docs: https://docs.codacy.com/codacy-api/using-the-codacy-api/
 */
export const getOrganization: CodacyEndpoints['organizationGet'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['organizationGet'],
): Promise<CodacyEndpointOutputs['organizationGet']> => {
	const token = await getCodacyCredentials(ctx);

	const response = await makeCodacyRequest<
		z.infer<typeof CodacyEndpointOutputSchemas.organizationGet>
	>(`/organizations/${input.organization_id}`, token);

	const parsed = CodacyEndpointOutputSchemas.organizationGet.parse(response);

	await logEventFromContext(
		ctx,
		'codacy.organizations.get',
		{ organization_id: input.organization_id },
		'completed',
	);
	return parsed;
};
