import type { PostalyticsEndpoints } from '..';
import { makePostalyticsRequest } from '../client';
import {
	PostalyticsEndpointInputSchemas as inputs,
	PostalyticsEndpointOutputSchemas as outputs,
} from './types';

export const getIntegrations: PostalyticsEndpoints['getIntegrations'] = async (
	ctx,
	input,
) => {
	inputs.getIntegrations.parse(input);
	const response = await makePostalyticsRequest(
		`/api/v1/account/integrations`,
		ctx.key,
		{ method: 'GET', sandbox: ctx.options.sandbox },
	);
	return outputs.getIntegrations.parse(response);
};

export const getMyAccount: PostalyticsEndpoints['getMyAccount'] = async (
	ctx,
	input,
) => {
	inputs.getMyAccount.parse(input);
	const response = await makePostalyticsRequest(`/api/v1/account/me`, ctx.key, {
		method: 'GET',
		sandbox: ctx.options.sandbox,
	});
	return outputs.getMyAccount.parse(response);
};

export const getAccount: PostalyticsEndpoints['getAccount'] = async (
	ctx,
	input,
) => {
	const args = inputs.getAccount.parse(input);
	const response = await makePostalyticsRequest(
		`/api/v1/account/${encodeURIComponent(String(args['id']))}`,
		ctx.key,
		{ method: 'GET', sandbox: ctx.options.sandbox },
	);
	return outputs.getAccount.parse(response);
};

export const createNewAccount: PostalyticsEndpoints['createNewAccount'] =
	async (ctx, input) => {
		const args = inputs.createNewAccount.parse(input);
		const response = await makePostalyticsRequest(`/api/v1/account`, ctx.key, {
			method: 'POST',
			sandbox: ctx.options.sandbox,
			body: args.body,
		});
		return outputs.createNewAccount.parse(response);
	};

export const updateAccount: PostalyticsEndpoints['updateAccount'] = async (
	ctx,
	input,
) => {
	const args = inputs.updateAccount.parse(input);
	const response = await makePostalyticsRequest(`/api/v1/account`, ctx.key, {
		method: 'PUT',
		sandbox: ctx.options.sandbox,
		body: args.body,
	});
	return outputs.updateAccount.parse(response);
};

export const deleteAccount: PostalyticsEndpoints['deleteAccount'] = async (
	ctx,
	input,
) => {
	const args = inputs.deleteAccount.parse(input);
	const response = await makePostalyticsRequest(
		`/api/v1/account/${encodeURIComponent(String(args['id']))}`,
		ctx.key,
		{ method: 'DELETE', sandbox: ctx.options.sandbox },
	);
	return outputs.deleteAccount.parse(response);
};

export const getAllCampaigns: PostalyticsEndpoints['getAllCampaigns'] = async (
	ctx,
	input,
) => {
	inputs.getAllCampaigns.parse(input);
	const response = await makePostalyticsRequest(`/api/v1/campaigns`, ctx.key, {
		method: 'GET',
		sandbox: ctx.options.sandbox,
	});
	return outputs.getAllCampaigns.parse(response);
};

export const getAllDripCampaigns: PostalyticsEndpoints['getAllDripCampaigns'] =
	async (ctx, input) => {
		inputs.getAllDripCampaigns.parse(input);
		const response = await makePostalyticsRequest(
			`/api/v1/campaigns/drips`,
			ctx.key,
			{ method: 'GET', sandbox: ctx.options.sandbox },
		);
		return outputs.getAllDripCampaigns.parse(response);
	};

export const getCampaignStats: PostalyticsEndpoints['getCampaignStats'] =
	async (ctx, input) => {
		const args = inputs.getCampaignStats.parse(input);
		const response = await makePostalyticsRequest(
			`/api/v1/campaigns/${encodeURIComponent(String(args['id']))}`,
			ctx.key,
			{ method: 'GET', sandbox: ctx.options.sandbox },
		);
		return outputs.getCampaignStats.parse(response);
	};

export const getCampaign: PostalyticsEndpoints['getCampaign'] = async (
	ctx,
	input,
) => {
	const args = inputs.getCampaign.parse(input);
	const response = await makePostalyticsRequest(
		`/api/v1/campaigns/${encodeURIComponent(String(args['id']))}/details`,
		ctx.key,
		{ method: 'GET', sandbox: ctx.options.sandbox },
	);
	return outputs.getCampaign.parse(response);
};

export const getCampaignEvents: PostalyticsEndpoints['getCampaignEvents'] =
	async (ctx, input) => {
		const args = inputs.getCampaignEvents.parse(input);
		const response = await makePostalyticsRequest(
			`/api/v1/campaigns/${encodeURIComponent(String(args['id']))}/events`,
			ctx.key,
			{
				method: 'GET',
				sandbox: ctx.options.sandbox,
				query: { PageNumber: args['PageNumber'], PageSize: args['PageSize'] },
			},
		);
		return outputs.getCampaignEvents.parse(response);
	};

export const getContactEvent: PostalyticsEndpoints['getContactEvent'] = async (
	ctx,
	input,
) => {
	const args = inputs.getContactEvent.parse(input);
	const response = await makePostalyticsRequest(
		`/api/v1/campaigns/${encodeURIComponent(String(args['id']))}/events/${encodeURIComponent(String(args['dataid']))}`,
		ctx.key,
		{
			method: 'GET',
			sandbox: ctx.options.sandbox,
			query: { PageNumber: args['PageNumber'], PageSize: args['PageSize'] },
		},
	);
	return outputs.getContactEvent.parse(response);
};

export const createNewCampaign: PostalyticsEndpoints['createNewCampaign'] =
	async (ctx, input) => {
		const args = inputs.createNewCampaign.parse(input);
		const response = await makePostalyticsRequest(
			`/api/v1/campaigns`,
			ctx.key,
			{ method: 'POST', sandbox: ctx.options.sandbox, body: args.body },
		);
		return outputs.createNewCampaign.parse(response);
	};

export const updateCampaignStatus: PostalyticsEndpoints['updateCampaignStatus'] =
	async (ctx, input) => {
		const args = inputs.updateCampaignStatus.parse(input);
		const response = await makePostalyticsRequest(
			`/api/v1/campaigns/${encodeURIComponent(String(args['id']))}`,
			ctx.key,
			{ method: 'PUT', sandbox: ctx.options.sandbox },
		);
		return outputs.updateCampaignStatus.parse(response);
	};

export const deleteCampaign: PostalyticsEndpoints['deleteCampaign'] = async (
	ctx,
	input,
) => {
	const args = inputs.deleteCampaign.parse(input);
	const response = await makePostalyticsRequest(
		`/api/v1/campaigns/${encodeURIComponent(String(args['id']))}`,
		ctx.key,
		{ method: 'DELETE', sandbox: ctx.options.sandbox },
	);
	return outputs.deleteCampaign.parse(response);
};

export const getAllContactLists: PostalyticsEndpoints['getAllContactLists'] =
	async (ctx, input) => {
		inputs.getAllContactLists.parse(input);
		const response = await makePostalyticsRequest(`/api/v1/contacts`, ctx.key, {
			method: 'GET',
			sandbox: ctx.options.sandbox,
		});
		return outputs.getAllContactLists.parse(response);
	};

export const getContact: PostalyticsEndpoints['getContact'] = async (
	ctx,
	input,
) => {
	const args = inputs.getContact.parse(input);
	const response = await makePostalyticsRequest(
		`/api/v1/contacts/details/${encodeURIComponent(String(args['id']))}`,
		ctx.key,
		{ method: 'GET', sandbox: ctx.options.sandbox },
	);
	return outputs.getContact.parse(response);
};

export const getContactsOnList: PostalyticsEndpoints['getContactsOnList'] =
	async (ctx, input) => {
		const args = inputs.getContactsOnList.parse(input);
		const response = await makePostalyticsRequest(
			`/api/v1/contacts/${encodeURIComponent(String(args['id']))}`,
			ctx.key,
			{
				method: 'GET',
				sandbox: ctx.options.sandbox,
				query: { limit: args['limit'], start: args['start'] },
			},
		);
		return outputs.getContactsOnList.parse(response);
	};

export const createContactOnList: PostalyticsEndpoints['createContactOnList'] =
	async (ctx, input) => {
		const args = inputs.createContactOnList.parse(input);
		const response = await makePostalyticsRequest(`/api/v1/contacts`, ctx.key, {
			method: 'POST',
			sandbox: ctx.options.sandbox,
			body: args.body,
		});
		return outputs.createContactOnList.parse(response);
	};

export const updateContactOnList: PostalyticsEndpoints['updateContactOnList'] =
	async (ctx, input) => {
		const args = inputs.updateContactOnList.parse(input);
		const response = await makePostalyticsRequest(`/api/v1/contacts`, ctx.key, {
			method: 'PUT',
			sandbox: ctx.options.sandbox,
			body: args.body,
		});
		return outputs.updateContactOnList.parse(response);
	};

export const deleteContact: PostalyticsEndpoints['deleteContact'] = async (
	ctx,
	input,
) => {
	const args = inputs.deleteContact.parse(input);
	const response = await makePostalyticsRequest(
		`/api/v1/contacts/${encodeURIComponent(String(args['id']))}`,
		ctx.key,
		{ method: 'DELETE', sandbox: ctx.options.sandbox },
	);
	return outputs.deleteContact.parse(response);
};

export const getAllFlows: PostalyticsEndpoints['getAllFlows'] = async (
	ctx,
	input,
) => {
	inputs.getAllFlows.parse(input);
	const response = await makePostalyticsRequest(`/api/v1/flow`, ctx.key, {
		method: 'GET',
		sandbox: ctx.options.sandbox,
	});
	return outputs.getAllFlows.parse(response);
};

export const getFlow: PostalyticsEndpoints['getFlow'] = async (ctx, input) => {
	const args = inputs.getFlow.parse(input);
	const response = await makePostalyticsRequest(
		`/api/v1/flow/${encodeURIComponent(String(args['endpointId']))}`,
		ctx.key,
		{ method: 'GET', sandbox: ctx.options.sandbox },
	);
	return outputs.getFlow.parse(response);
};

export const enrollContactToFlow: PostalyticsEndpoints['enrollContactToFlow'] =
	async (ctx, input) => {
		const args = inputs.enrollContactToFlow.parse(input);
		const response = await makePostalyticsRequest(
			`/api/v1/flow/${encodeURIComponent(String(args['endPoint']))}`,
			ctx.key,
			{ method: 'POST', sandbox: ctx.options.sandbox, body: args.body },
		);
		return outputs.enrollContactToFlow.parse(response);
	};

export const unenrollContactFromFlow: PostalyticsEndpoints['unenrollContactFromFlow'] =
	async (ctx, input) => {
		const args = inputs.unenrollContactFromFlow.parse(input);
		const response = await makePostalyticsRequest(
			`/api/v1/flow/unenroll/${encodeURIComponent(String(args['endPoint']))}/${encodeURIComponent(String(args['dataId']))}`,
			ctx.key,
			{ method: 'DELETE', sandbox: ctx.options.sandbox },
		);
		return outputs.unenrollContactFromFlow.parse(response);
	};

export const createLoginLink: PostalyticsEndpoints['createLoginLink'] = async (
	ctx,
	input,
) => {
	const args = inputs.createLoginLink.parse(input);
	const response = await makePostalyticsRequest(`/api/v1/loginlink`, ctx.key, {
		method: 'POST',
		sandbox: ctx.options.sandbox,
		body: args.body,
	});
	return outputs.createLoginLink.parse(response);
};

export const sendMail: PostalyticsEndpoints['sendMail'] = async (
	ctx,
	input,
) => {
	const args = inputs.sendMail.parse(input);
	const response = await makePostalyticsRequest(
		`/api/v1/send/${encodeURIComponent(String(args['endPoint']))}`,
		ctx.key,
		{ method: 'POST', sandbox: ctx.options.sandbox, body: args.body },
	);
	return outputs.sendMail.parse(response);
};

export const getSuppressionLists: PostalyticsEndpoints['getSuppressionLists'] =
	async (ctx, input) => {
		const args = inputs.getSuppressionLists.parse(input);
		const response = await makePostalyticsRequest(
			`/api/v1/lists/suppression`,
			ctx.key,
			{
				method: 'GET',
				sandbox: ctx.options.sandbox,
				query: { id: args['id'] },
			},
		);
		return outputs.getSuppressionLists.parse(response);
	};

export const getSuppressionList: PostalyticsEndpoints['getSuppressionList'] =
	async (ctx, input) => {
		const args = inputs.getSuppressionList.parse(input);
		const response = await makePostalyticsRequest(
			`/api/v1/lists/suppression/${encodeURIComponent(String(args['id']))}`,
			ctx.key,
			{ method: 'GET', sandbox: ctx.options.sandbox },
		);
		return outputs.getSuppressionList.parse(response);
	};

export const createSuppressionList: PostalyticsEndpoints['createSuppressionList'] =
	async (ctx, input) => {
		const args = inputs.createSuppressionList.parse(input);
		const response = await makePostalyticsRequest(
			`/api/v1/lists/suppression`,
			ctx.key,
			{ method: 'POST', sandbox: ctx.options.sandbox, body: args.body },
		);
		return outputs.createSuppressionList.parse(response);
	};

export const deleteSuppressionList: PostalyticsEndpoints['deleteSuppressionList'] =
	async (ctx, input) => {
		const args = inputs.deleteSuppressionList.parse(input);
		const response = await makePostalyticsRequest(
			`/api/v1/lists/suppression/${encodeURIComponent(String(args['id']))}`,
			ctx.key,
			{ method: 'DELETE', sandbox: ctx.options.sandbox },
		);
		return outputs.deleteSuppressionList.parse(response);
	};

export const getSuppressionListContacts: PostalyticsEndpoints['getSuppressionListContacts'] =
	async (ctx, input) => {
		const args = inputs.getSuppressionListContacts.parse(input);
		const response = await makePostalyticsRequest(
			`/api/v1/lists/suppression/contacts/${encodeURIComponent(String(args['listId']))}`,
			ctx.key,
			{
				method: 'GET',
				sandbox: ctx.options.sandbox,
				query: { offset: args['offset'] },
			},
		);
		return outputs.getSuppressionListContacts.parse(response);
	};

export const getSuppressionListContact: PostalyticsEndpoints['getSuppressionListContact'] =
	async (ctx, input) => {
		const args = inputs.getSuppressionListContact.parse(input);
		const response = await makePostalyticsRequest(
			`/api/v1/lists/suppression/contacts/${encodeURIComponent(String(args['listId']))}/${encodeURIComponent(String(args['contactId']))}`,
			ctx.key,
			{
				method: 'GET',
				sandbox: ctx.options.sandbox,
				query: { offset: args['offset'] },
			},
		);
		return outputs.getSuppressionListContact.parse(response);
	};

export const createSuppressionListContact: PostalyticsEndpoints['createSuppressionListContact'] =
	async (ctx, input) => {
		const args = inputs.createSuppressionListContact.parse(input);
		const response = await makePostalyticsRequest(
			`/api/v1/lists/suppression/contacts/${encodeURIComponent(String(args['listId']))}`,
			ctx.key,
			{ method: 'POST', sandbox: ctx.options.sandbox, body: args.body },
		);
		return outputs.createSuppressionListContact.parse(response);
	};

export const updateSuppressionListContact: PostalyticsEndpoints['updateSuppressionListContact'] =
	async (ctx, input) => {
		const args = inputs.updateSuppressionListContact.parse(input);
		const response = await makePostalyticsRequest(
			`/api/v1/lists/suppression/contacts/${encodeURIComponent(String(args['listId']))}/${encodeURIComponent(String(args['contactId']))}`,
			ctx.key,
			{ method: 'PUT', sandbox: ctx.options.sandbox, body: args.body },
		);
		return outputs.updateSuppressionListContact.parse(response);
	};

export const deleteSuppressionListContact: PostalyticsEndpoints['deleteSuppressionListContact'] =
	async (ctx, input) => {
		const args = inputs.deleteSuppressionListContact.parse(input);
		const response = await makePostalyticsRequest(
			`/api/v1/lists/suppression/contacts/${encodeURIComponent(String(args['listId']))}/${encodeURIComponent(String(args['contactId']))}`,
			ctx.key,
			{ method: 'DELETE', sandbox: ctx.options.sandbox },
		);
		return outputs.deleteSuppressionListContact.parse(response);
	};

export const getAllTemplates: PostalyticsEndpoints['getAllTemplates'] = async (
	ctx,
	input,
) => {
	inputs.getAllTemplates.parse(input);
	const response = await makePostalyticsRequest(`/api/v1/templates`, ctx.key, {
		method: 'GET',
		sandbox: ctx.options.sandbox,
	});
	return outputs.getAllTemplates.parse(response);
};

export const getTemplate: PostalyticsEndpoints['getTemplate'] = async (
	ctx,
	input,
) => {
	const args = inputs.getTemplate.parse(input);
	const response = await makePostalyticsRequest(
		`/api/v1/templates/${encodeURIComponent(String(args['id']))}`,
		ctx.key,
		{ method: 'GET', sandbox: ctx.options.sandbox },
	);
	return outputs.getTemplate.parse(response);
};

export const createTemplate: PostalyticsEndpoints['createTemplate'] = async (
	ctx,
	input,
) => {
	const args = inputs.createTemplate.parse(input);
	const response = await makePostalyticsRequest(`/api/v1/templates`, ctx.key, {
		method: 'POST',
		sandbox: ctx.options.sandbox,
		body: args.body,
	});
	return outputs.createTemplate.parse(response);
};

export const deleteTemplate: PostalyticsEndpoints['deleteTemplate'] = async (
	ctx,
	input,
) => {
	const args = inputs.deleteTemplate.parse(input);
	const response = await makePostalyticsRequest(
		`/api/v1/templates/${encodeURIComponent(String(args['id']))}`,
		ctx.key,
		{ method: 'DELETE', sandbox: ctx.options.sandbox },
	);
	return outputs.deleteTemplate.parse(response);
};

export const getAllWebhooks: PostalyticsEndpoints['getAllWebhooks'] = async (
	ctx,
	input,
) => {
	inputs.getAllWebhooks.parse(input);
	const response = await makePostalyticsRequest(`/api/v1/webhooks`, ctx.key, {
		method: 'GET',
		sandbox: ctx.options.sandbox,
	});
	return outputs.getAllWebhooks.parse(response);
};

export const getWebhook: PostalyticsEndpoints['getWebhook'] = async (
	ctx,
	input,
) => {
	const args = inputs.getWebhook.parse(input);
	const response = await makePostalyticsRequest(
		`/api/v1/webhooks/${encodeURIComponent(String(args['id']))}`,
		ctx.key,
		{ method: 'GET', sandbox: ctx.options.sandbox },
	);
	return outputs.getWebhook.parse(response);
};

export const createWebhook: PostalyticsEndpoints['createWebhook'] = async (
	ctx,
	input,
) => {
	const args = inputs.createWebhook.parse(input);
	const response = await makePostalyticsRequest(`/api/v1/webhooks`, ctx.key, {
		method: 'POST',
		sandbox: ctx.options.sandbox,
		body: args.body,
	});
	return outputs.createWebhook.parse(response);
};

export const updateWebhook: PostalyticsEndpoints['updateWebhook'] = async (
	ctx,
	input,
) => {
	const args = inputs.updateWebhook.parse(input);
	const response = await makePostalyticsRequest(`/api/v1/webhooks`, ctx.key, {
		method: 'PUT',
		sandbox: ctx.options.sandbox,
		body: args.body,
	});
	return outputs.updateWebhook.parse(response);
};

export const deleteWebhook: PostalyticsEndpoints['deleteWebhook'] = async (
	ctx,
	input,
) => {
	const args = inputs.deleteWebhook.parse(input);
	const response = await makePostalyticsRequest(
		`/api/v1/webhooks/${encodeURIComponent(String(args['id']))}`,
		ctx.key,
		{ method: 'DELETE', sandbox: ctx.options.sandbox },
	);
	return outputs.deleteWebhook.parse(response);
};
