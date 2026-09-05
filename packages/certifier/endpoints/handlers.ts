import { logEventFromContext } from 'corsair/core';
import type { CertifierEndpoints } from '..';
import { makeCertifierRequest } from '../client';
import {
	CertifierEndpointInputSchemas,
	CertifierEndpointOutputSchemas,
} from './types';

function pageQuery(input: {
	limit?: number;
	cursor?: string;
	credentialId?: string;
}): Record<string, string | number | undefined> {
	return {
		...(input.limit !== undefined ? { limit: input.limit } : {}),
		...(input.cursor !== undefined ? { cursor: input.cursor } : {}),
		...(input.credentialId !== undefined
			? { credentialId: input.credentialId }
			: {}),
	};
}

export const createIssueSend: CertifierEndpoints['createIssueSend'] = async (
	ctx,
	input,
) => {
	const parsed = CertifierEndpointInputSchemas.createIssueSend.parse(input);
	const raw = await makeCertifierRequest(
		'credentials/create-issue-send',
		ctx.key,
		{
			method: 'POST',
			body: {
				groupId: parsed.groupId,
				recipient: parsed.recipient,
				...(parsed.issueDate !== undefined
					? { issueDate: parsed.issueDate }
					: {}),
				...(parsed.expiryDate !== undefined
					? { expiryDate: parsed.expiryDate }
					: {}),
				...(parsed.customAttributes !== undefined
					? { customAttributes: parsed.customAttributes }
					: {}),
			},
		},
	);
	const response = CertifierEndpointOutputSchemas.createIssueSend.parse(raw);
	await logEventFromContext(
		ctx,
		'certifier.credentials.create_issue_send',
		{ groupId: parsed.groupId, id: response.id },
		'completed',
	);
	return response;
};

export const listAttributes: CertifierEndpoints['listAttributes'] = async (
	ctx,
	input,
) => {
	const parsed = CertifierEndpointInputSchemas.listAttributes.parse(input);
	const raw = await makeCertifierRequest('attributes', ctx.key, {
		method: 'GET',
		query: pageQuery(parsed),
	});
	const response = CertifierEndpointOutputSchemas.listAttributes.parse(raw);
	await logEventFromContext(
		ctx,
		'certifier.attributes.list',
		{ count: response.data.length },
		'completed',
	);
	return response;
};

export const listCredentialInteractions: CertifierEndpoints['listCredentialInteractions'] =
	async (ctx, input) => {
		const parsed =
			CertifierEndpointInputSchemas.listCredentialInteractions.parse(input);
		const raw = await makeCertifierRequest('credential-interactions', ctx.key, {
			method: 'GET',
			query: pageQuery(parsed),
		});
		const response =
			CertifierEndpointOutputSchemas.listCredentialInteractions.parse(raw);
		await logEventFromContext(
			ctx,
			'certifier.credential_interactions.list',
			{
				count: response.data.length,
				...(parsed.credentialId !== undefined
					? { credentialId: parsed.credentialId }
					: {}),
			},
			'completed',
		);
		return response;
	};

export const listCredentials: CertifierEndpoints['listCredentials'] = async (
	ctx,
	input,
) => {
	const parsed = CertifierEndpointInputSchemas.listCredentials.parse(input);
	const raw = await makeCertifierRequest('credentials', ctx.key, {
		method: 'GET',
		query: pageQuery(parsed),
	});
	const response = CertifierEndpointOutputSchemas.listCredentials.parse(raw);
	await logEventFromContext(
		ctx,
		'certifier.credentials.list',
		{ count: response.data.length },
		'completed',
	);
	return response;
};

export const listDesigns: CertifierEndpoints['listDesigns'] = async (
	ctx,
	input,
) => {
	const parsed = CertifierEndpointInputSchemas.listDesigns.parse(input);
	const raw = await makeCertifierRequest('designs', ctx.key, {
		method: 'GET',
		query: pageQuery(parsed),
	});
	const response = CertifierEndpointOutputSchemas.listDesigns.parse(raw);
	await logEventFromContext(
		ctx,
		'certifier.designs.list',
		{ count: response.data.length },
		'completed',
	);
	return response;
};

export const listEmailTemplates: CertifierEndpoints['listEmailTemplates'] =
	async (ctx, input) => {
		const parsed =
			CertifierEndpointInputSchemas.listEmailTemplates.parse(input);
		const raw = await makeCertifierRequest('email-templates', ctx.key, {
			method: 'GET',
			query: pageQuery(parsed),
		});
		const response =
			CertifierEndpointOutputSchemas.listEmailTemplates.parse(raw);
		await logEventFromContext(
			ctx,
			'certifier.email_templates.list',
			{ count: response.data.length },
			'completed',
		);
		return response;
	};

export const listGroups: CertifierEndpoints['listGroups'] = async (
	ctx,
	input,
) => {
	const parsed = CertifierEndpointInputSchemas.listGroups.parse(input);
	const raw = await makeCertifierRequest('groups', ctx.key, {
		method: 'GET',
		query: pageQuery(parsed),
	});
	const response = CertifierEndpointOutputSchemas.listGroups.parse(raw);
	await logEventFromContext(
		ctx,
		'certifier.groups.list',
		{ count: response.data.length },
		'completed',
	);
	return response;
};

export const searchCredentials: CertifierEndpoints['searchCredentials'] =
	async (ctx, input) => {
		const parsed = CertifierEndpointInputSchemas.searchCredentials.parse(input);
		const raw = await makeCertifierRequest('credentials/search', ctx.key, {
			method: 'POST',
			body: {
				filter: parsed.filter,
				...(parsed.sort !== undefined ? { sort: parsed.sort } : {}),
				...(parsed.limit !== undefined ? { limit: parsed.limit } : {}),
				...(parsed.cursor !== undefined ? { cursor: parsed.cursor } : {}),
			},
		});
		const response =
			CertifierEndpointOutputSchemas.searchCredentials.parse(raw);
		await logEventFromContext(
			ctx,
			'certifier.credentials.search',
			{ count: response.data.length },
			'completed',
		);
		return response;
	};

export const sendCredential: CertifierEndpoints['sendCredential'] = async (
	ctx,
	input,
) => {
	const parsed = CertifierEndpointInputSchemas.sendCredential.parse(input);
	const raw = await makeCertifierRequest(
		`credentials/${parsed.id}/send`,
		ctx.key,
		{
			method: 'POST',
			body: { deliveryMethod: parsed.deliveryMethod },
		},
	);
	const response = CertifierEndpointOutputSchemas.sendCredential.parse(raw);
	await logEventFromContext(
		ctx,
		'certifier.credentials.send',
		{ id: parsed.id, deliveryMethod: parsed.deliveryMethod },
		'completed',
	);
	return response;
};
