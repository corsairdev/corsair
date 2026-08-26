import type { RequiredPluginEndpointMeta } from 'corsair/core';
import type { DocusignAuthOptions } from './client';
import { DocusignClient } from './client';
import * as endpoints from './endpoints';
import * as schema from './schema';
import * as webhooks from './webhooks';

export * from './client';
export * from './endpoints';
export * from './schema';
export * from './webhooks';

export const docusignEndpointsNested = {
	createEnvelope: endpoints.createEnvelope,
	getEnvelope: endpoints.getEnvelope,
	sendEnvelope: endpoints.sendEnvelope,
	listTemplates: endpoints.listTemplates,
	getTemplate: endpoints.getTemplate,
};

export const docusignWebhooksNested = {
	handleWebhook: webhooks.handleWebhook,
};

export const docusignEndpointMeta = {
	createEnvelope: {
		description:
			'Creates a signing envelope from a pre-existing DocuSign template.',
	},
	getEnvelope: {
		description:
			'Gets the status and basic information about an envelope from DocuSign.',
	},
	sendEnvelope: {
		description: 'Sends a draft envelope by updating its status to sent.',
	},
	listTemplates: {
		description: 'Gets the definition of templates in the specified account.',
	},
	getTemplate: {
		description: 'Gets a template definition from the specified account.',
	},
} satisfies RequiredPluginEndpointMeta<typeof docusignEndpointsNested>;

export const endpointMeta = docusignEndpointMeta;

export const docusignPlugin = {
	id: 'docusign',
	name: 'DocuSign',
	description:
		'DocuSign eSignature REST API integration for agreements, envelopes, and templates.',
	auth: {
		type: 'oauth2' as const,
		fields: ['accessToken', 'accountId', 'baseUri'],
	},
	createClient: (options: DocusignAuthOptions) => new DocusignClient(options),
	endpoints: docusignEndpointsNested,
	webhooks: docusignWebhooksNested,
	endpointMeta: docusignEndpointMeta,
	schema,
};

// Plugin factory function for corsair.ts plugins list
export const docusign = (config?: any) => ({
	...docusignPlugin,
	...(config && { config }),
});

export default docusign;
