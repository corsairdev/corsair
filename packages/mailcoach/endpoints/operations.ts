import { defineMailcoachOperation } from './operation';
import {
	MailcoachEndpointInputSchemas as input,
	MailcoachEndpointOutputSchemas as output,
} from './types';

const encoded = (value: string) => encodeURIComponent(value);

export const MailcoachOperations = {
	'user.get': defineMailcoachOperation({
		inputSchema: input['user.get'],
		outputSchema: output['user.get'],
		method: 'GET',
		path: () => '/user',
		riskLevel: 'read',
		description:
			'Get the user associated with the configured Mailcoach API token.',
	}),
	'emailLists.list': defineMailcoachOperation({
		inputSchema: input['emailLists.list'],
		outputSchema: output['emailLists.list'],
		method: 'GET',
		path: () => '/email-lists',
		query: ({ query }) => query,
		nextPageUrl: ({ next }) => next,
		riskLevel: 'read',
		description:
			'List email lists with documented name filters, sorting, and pagination.',
	}),
	'emailLists.get': defineMailcoachOperation({
		inputSchema: input['emailLists.get'],
		outputSchema: output['emailLists.get'],
		method: 'GET',
		path: ({ emailListUuid }) => `/email-lists/${encoded(emailListUuid)}`,
		riskLevel: 'read',
		description: 'Get an email list by its UUID.',
	}),
	'emailLists.create': defineMailcoachOperation({
		inputSchema: input['emailLists.create'],
		outputSchema: output['emailLists.create'],
		method: 'POST',
		path: () => '/email-lists',
		body: (requestBody) => requestBody,
		riskLevel: 'write',
		description: 'Create an email list with its required sender address.',
	}),
	'emailLists.update': defineMailcoachOperation({
		inputSchema: input['emailLists.update'],
		outputSchema: output['emailLists.update'],
		method: 'PUT',
		path: ({ emailListUuid }) => `/email-lists/${encoded(emailListUuid)}`,
		body: ({ body }) => body,
		riskLevel: 'write',
		description: 'Update an email list and its required sender defaults.',
	}),
	'emailLists.delete': defineMailcoachOperation({
		inputSchema: input['emailLists.delete'],
		outputSchema: output['emailLists.delete'],
		method: 'DELETE',
		path: ({ emailListUuid }) => `/email-lists/${encoded(emailListUuid)}`,
		riskLevel: 'destructive',
		description:
			'Delete an email list and schedule its associated-data cleanup.',
	}),
	'subscribers.list': defineMailcoachOperation({
		inputSchema: input['subscribers.list'],
		outputSchema: output['subscribers.list'],
		method: 'GET',
		path: ({ emailListUuid }) =>
			`/email-lists/${encoded(emailListUuid)}/subscribers`,
		query: ({ query }) => query,
		nextPageUrl: ({ next }) => next,
		riskLevel: 'read',
		description:
			'List subscribers for an email list with documented filters and sorting.',
	}),
	'subscribers.get': defineMailcoachOperation({
		inputSchema: input['subscribers.get'],
		outputSchema: output['subscribers.get'],
		method: 'GET',
		path: ({ subscriberUuid }) => `/subscribers/${encoded(subscriberUuid)}`,
		riskLevel: 'read',
		description: 'Get a subscriber by UUID.',
	}),
	'subscribers.subscribe': defineMailcoachOperation({
		inputSchema: input['subscribers.subscribe'],
		outputSchema: output['subscribers.subscribe'],
		method: 'POST',
		path: ({ emailListUuid }) =>
			`/email-lists/${encoded(emailListUuid)}/subscribers`,
		body: ({ body }) => body,
		riskLevel: 'destructive',
		description:
			'Subscribe or update an address; this can restart an unsubscribed contact.',
	}),
	'subscribers.update': defineMailcoachOperation({
		inputSchema: input['subscribers.update'],
		outputSchema: output['subscribers.update'],
		method: 'PATCH',
		path: ({ subscriberUuid }) => `/subscribers/${encoded(subscriberUuid)}`,
		body: ({ body }) => body,
		riskLevel: 'write',
		description: 'Update subscriber profile data and replace or append tags.',
	}),
	'subscribers.delete': defineMailcoachOperation({
		inputSchema: input['subscribers.delete'],
		outputSchema: output['subscribers.delete'],
		method: 'DELETE',
		path: ({ subscriberUuid }) => `/subscribers/${encoded(subscriberUuid)}`,
		riskLevel: 'destructive',
		description:
			'Permanently remove a subscriber record and its subscription history.',
	}),
	'subscribers.confirm': defineMailcoachOperation({
		inputSchema: input['subscribers.confirm'],
		outputSchema: output['subscribers.confirm'],
		method: 'POST',
		path: ({ subscriberUuid }) =>
			`/subscribers/${encoded(subscriberUuid)}/confirm`,
		riskLevel: 'destructive',
		description:
			'Confirm a subscriber by UUID, changing their subscription state.',
	}),
	'subscribers.confirmByEmail': defineMailcoachOperation({
		inputSchema: input['subscribers.confirmByEmail'],
		outputSchema: output['subscribers.confirmByEmail'],
		method: 'POST',
		path: ({ emailListUuid }) =>
			`/email-lists/${encoded(emailListUuid)}/confirm`,
		body: ({ email }) => ({ email }),
		riskLevel: 'destructive',
		description:
			'Confirm a subscriber using their email address and list UUID.',
	}),
	'subscribers.unsubscribe': defineMailcoachOperation({
		inputSchema: input['subscribers.unsubscribe'],
		outputSchema: output['subscribers.unsubscribe'],
		method: 'POST',
		path: ({ subscriberUuid }) =>
			`/subscribers/${encoded(subscriberUuid)}/unsubscribe`,
		riskLevel: 'destructive',
		description:
			'Unsubscribe a subscriber while retaining subscription history.',
	}),
	'subscribers.unsubscribeByEmail': defineMailcoachOperation({
		inputSchema: input['subscribers.unsubscribeByEmail'],
		outputSchema: output['subscribers.unsubscribeByEmail'],
		method: 'POST',
		path: ({ emailListUuid }) =>
			`/email-lists/${encoded(emailListUuid)}/unsubscribe`,
		body: ({ email }) => ({ email }),
		riskLevel: 'destructive',
		description:
			'Unsubscribe an address from a list while retaining subscription history.',
	}),
	'subscribers.resendConfirmation': defineMailcoachOperation({
		inputSchema: input['subscribers.resendConfirmation'],
		outputSchema: output['subscribers.resendConfirmation'],
		method: 'POST',
		path: ({ subscriberUuid }) =>
			`/subscribers/${encoded(subscriberUuid)}/resend-confirmation`,
		riskLevel: 'destructive',
		description: 'Send a confirmation email to a subscriber.',
	}),
	'subscribers.resendConfirmationByEmail': defineMailcoachOperation({
		inputSchema: input['subscribers.resendConfirmationByEmail'],
		outputSchema: output['subscribers.resendConfirmationByEmail'],
		method: 'POST',
		path: ({ emailListUuid }) =>
			`/email-lists/${encoded(emailListUuid)}/resend-confirmation`,
		body: ({ email }) => ({ email }),
		riskLevel: 'destructive',
		description: 'Send a list confirmation email to the supplied address.',
	}),
	'subscribers.addTags': defineMailcoachOperation({
		inputSchema: input['subscribers.addTags'],
		outputSchema: output['subscribers.addTags'],
		method: 'POST',
		path: ({ subscriberUuid }) =>
			`/subscribers/${encoded(subscriberUuid)}/tags`,
		body: ({ body }) => body,
		riskLevel: 'write',
		description:
			'Add tags to a subscriber without replacing their existing tags.',
	}),
	'subscribers.removeTags': defineMailcoachOperation({
		inputSchema: input['subscribers.removeTags'],
		outputSchema: output['subscribers.removeTags'],
		method: 'DELETE',
		path: ({ subscriberUuid }) =>
			`/subscribers/${encoded(subscriberUuid)}/tags`,
		body: ({ body }) => body,
		riskLevel: 'write',
		description: 'Remove the specified tags from a subscriber.',
	}),
	'subscriberImports.list': defineMailcoachOperation({
		inputSchema: input['subscriberImports.list'],
		outputSchema: output['subscriberImports.list'],
		method: 'GET',
		path: () => '/subscriber-imports',
		nextPageUrl: ({ next }) => next,
		riskLevel: 'read',
		description: 'List subscriber imports with pagination.',
	}),
	'subscriberImports.get': defineMailcoachOperation({
		inputSchema: input['subscriberImports.get'],
		outputSchema: output['subscriberImports.get'],
		method: 'GET',
		path: ({ importUuid }) => `/subscriber-imports/${encoded(importUuid)}`,
		riskLevel: 'read',
		description: 'Get subscriber-import status and processing counts.',
	}),
	'subscriberImports.create': defineMailcoachOperation({
		inputSchema: input['subscriberImports.create'],
		outputSchema: output['subscriberImports.create'],
		method: 'POST',
		path: () => '/subscriber-imports',
		body: (requestBody) => requestBody,
		riskLevel: 'write',
		description:
			'Create a draft CSV subscriber import without starting processing.',
	}),
	'subscriberImports.update': defineMailcoachOperation({
		inputSchema: input['subscriberImports.update'],
		outputSchema: output['subscriberImports.update'],
		method: 'PUT',
		path: ({ importUuid }) => `/subscriber-imports/${encoded(importUuid)}`,
		body: ({ body }) => body,
		riskLevel: 'write',
		description: 'Replace the CSV and options of a draft subscriber import.',
	}),
	'subscriberImports.delete': defineMailcoachOperation({
		inputSchema: input['subscriberImports.delete'],
		outputSchema: output['subscriberImports.delete'],
		method: 'DELETE',
		path: ({ importUuid }) => `/subscriber-imports/${encoded(importUuid)}`,
		riskLevel: 'destructive',
		description: 'Delete a subscriber import.',
	}),
	'subscriberImports.append': defineMailcoachOperation({
		inputSchema: input['subscriberImports.append'],
		outputSchema: output['subscriberImports.append'],
		method: 'POST',
		path: ({ importUuid }) =>
			`/subscriber-imports/${encoded(importUuid)}/append`,
		body: ({ subscribers_csv }) => ({ subscribers_csv }),
		riskLevel: 'write',
		description:
			'Append CSV rows without repeating the header to a draft import.',
	}),
	'subscriberImports.start': defineMailcoachOperation({
		inputSchema: input['subscriberImports.start'],
		outputSchema: output['subscriberImports.start'],
		method: 'POST',
		path: ({ importUuid }) =>
			`/subscriber-imports/${encoded(importUuid)}/start`,
		riskLevel: 'destructive',
		description:
			'Start processing an import that can subscribe or unsubscribe contacts.',
	}),
	'tags.list': defineMailcoachOperation({
		inputSchema: input['tags.list'],
		outputSchema: output['tags.list'],
		method: 'GET',
		path: ({ emailListUuid }) => `/email-lists/${encoded(emailListUuid)}/tags`,
		nextPageUrl: ({ next }) => next,
		riskLevel: 'read',
		description: 'List tags belonging to an email list.',
	}),
	'tags.get': defineMailcoachOperation({
		inputSchema: input['tags.get'],
		outputSchema: output['tags.get'],
		method: 'GET',
		path: ({ emailListUuid, tagUuid }) =>
			`/email-lists/${encoded(emailListUuid)}/tags/${encoded(tagUuid)}`,
		riskLevel: 'read',
		description: 'Get a tag by its UUID within an email list.',
	}),
	'tags.create': defineMailcoachOperation({
		inputSchema: input['tags.create'],
		outputSchema: output['tags.create'],
		method: 'POST',
		path: ({ emailListUuid }) => `/email-lists/${encoded(emailListUuid)}/tags`,
		body: ({ body }) => body,
		riskLevel: 'write',
		description:
			'Create or retrieve a regular tag by its case-insensitive name.',
	}),
	'tags.update': defineMailcoachOperation({
		inputSchema: input['tags.update'],
		outputSchema: output['tags.update'],
		method: 'PUT',
		path: ({ emailListUuid, tagUuid }) =>
			`/email-lists/${encoded(emailListUuid)}/tags/${encoded(tagUuid)}`,
		body: ({ body }) => body,
		riskLevel: 'write',
		description: 'Update a tag name and preference visibility.',
	}),
	'tags.delete': defineMailcoachOperation({
		inputSchema: input['tags.delete'],
		outputSchema: output['tags.delete'],
		method: 'DELETE',
		path: ({ emailListUuid, tagUuid }) =>
			`/email-lists/${encoded(emailListUuid)}/tags/${encoded(tagUuid)}`,
		riskLevel: 'destructive',
		description: 'Delete a tag from an email list.',
	}),
	'segments.list': defineMailcoachOperation({
		inputSchema: input['segments.list'],
		outputSchema: output['segments.list'],
		method: 'GET',
		path: ({ emailListUuid }) =>
			`/email-lists/${encoded(emailListUuid)}/segments`,
		nextPageUrl: ({ next }) => next,
		riskLevel: 'read',
		description: 'List tag-based segments belonging to an email list.',
	}),
	'segments.get': defineMailcoachOperation({
		inputSchema: input['segments.get'],
		outputSchema: output['segments.get'],
		method: 'GET',
		path: ({ emailListUuid, segmentUuid }) =>
			`/email-lists/${encoded(emailListUuid)}/segments/${encoded(segmentUuid)}`,
		riskLevel: 'read',
		description: 'Get a tag-based segment by UUID.',
	}),
	'segments.create': defineMailcoachOperation({
		inputSchema: input['segments.create'],
		outputSchema: output['segments.create'],
		method: 'POST',
		path: ({ emailListUuid }) =>
			`/email-lists/${encoded(emailListUuid)}/segments`,
		body: ({ body }) => body,
		riskLevel: 'write',
		description: 'Create a segment with positive and negative tag conditions.',
	}),
	'segments.update': defineMailcoachOperation({
		inputSchema: input['segments.update'],
		outputSchema: output['segments.update'],
		method: 'PUT',
		path: ({ emailListUuid, segmentUuid }) =>
			`/email-lists/${encoded(emailListUuid)}/segments/${encoded(segmentUuid)}`,
		body: ({ body }) => body,
		riskLevel: 'write',
		description: 'Replace a segment name and its complete tag conditions.',
	}),
	'segments.delete': defineMailcoachOperation({
		inputSchema: input['segments.delete'],
		outputSchema: output['segments.delete'],
		method: 'DELETE',
		path: ({ emailListUuid, segmentUuid }) =>
			`/email-lists/${encoded(emailListUuid)}/segments/${encoded(segmentUuid)}`,
		riskLevel: 'destructive',
		description: 'Delete a segment from an email list.',
	}),
	'templates.list': defineMailcoachOperation({
		inputSchema: input['templates.list'],
		outputSchema: output['templates.list'],
		method: 'GET',
		path: () => '/templates',
		query: ({ query }) => query,
		nextPageUrl: ({ next }) => next,
		riskLevel: 'read',
		description:
			'List campaign templates with name search, sorting, and pagination.',
	}),
	'templates.get': defineMailcoachOperation({
		inputSchema: input['templates.get'],
		outputSchema: output['templates.get'],
		method: 'GET',
		path: ({ templateUuid }) => `/templates/${encoded(templateUuid)}`,
		riskLevel: 'read',
		description: 'Get a campaign template by UUID.',
	}),
	'templates.create': defineMailcoachOperation({
		inputSchema: input['templates.create'],
		outputSchema: output['templates.create'],
		method: 'POST',
		path: () => '/templates',
		body: (requestBody) => requestBody,
		riskLevel: 'write',
		description:
			'Create a campaign template using HTML and optional editor data.',
	}),
	'templates.update': defineMailcoachOperation({
		inputSchema: input['templates.update'],
		outputSchema: output['templates.update'],
		method: 'PUT',
		path: ({ templateUuid }) => `/templates/${encoded(templateUuid)}`,
		body: ({ body }) => body,
		riskLevel: 'write',
		description: 'Update a campaign template; include its required name.',
	}),
	'templates.delete': defineMailcoachOperation({
		inputSchema: input['templates.delete'],
		outputSchema: output['templates.delete'],
		method: 'DELETE',
		path: ({ templateUuid }) => `/templates/${encoded(templateUuid)}`,
		riskLevel: 'destructive',
		description: 'Delete a campaign template.',
	}),
	'campaigns.list': defineMailcoachOperation({
		inputSchema: input['campaigns.list'],
		outputSchema: output['campaigns.list'],
		method: 'GET',
		path: () => '/campaigns',
		query: ({ query }) => query,
		nextPageUrl: ({ next }) => next,
		riskLevel: 'read',
		description:
			'List campaigns with documented filters, sorting, and pagination.',
	}),
	'campaigns.get': defineMailcoachOperation({
		inputSchema: input['campaigns.get'],
		outputSchema: output['campaigns.get'],
		method: 'GET',
		path: ({ campaignUuid }) => `/campaigns/${encoded(campaignUuid)}`,
		riskLevel: 'read',
		description: 'Get a campaign draft or sent campaign by UUID.',
	}),
	'campaigns.create': defineMailcoachOperation({
		inputSchema: input['campaigns.create'],
		outputSchema: output['campaigns.create'],
		method: 'POST',
		path: () => '/campaigns',
		body: (requestBody) => requestBody,
		riskLevel: 'write',
		description:
			'Create a campaign draft; it is not sent. Use campaigns.schedule or campaigns.send to deliver it.',
	}),
	'campaigns.update': defineMailcoachOperation({
		inputSchema: input['campaigns.update'],
		outputSchema: output['campaigns.update'],
		method: 'PUT',
		path: ({ campaignUuid }) => `/campaigns/${encoded(campaignUuid)}`,
		body: ({ body }) => body,
		riskLevel: 'write',
		description:
			'Replace campaign settings; include all intended fields because omitted values reset, including an existing schedule (use campaigns.schedule to keep one).',
	}),
	'campaigns.schedule': defineMailcoachOperation({
		inputSchema: input['campaigns.schedule'],
		outputSchema: output['campaigns.schedule'],
		method: 'PUT',
		path: ({ campaignUuid }) => `/campaigns/${encoded(campaignUuid)}`,
		body: ({ body }) => body,
		riskLevel: 'destructive',
		description:
			'Schedule a campaign to send to its audience at schedule_at (UTC). Resend all campaign settings; this is a full update.',
	}),
	'campaigns.delete': defineMailcoachOperation({
		inputSchema: input['campaigns.delete'],
		outputSchema: output['campaigns.delete'],
		method: 'DELETE',
		path: ({ campaignUuid }) => `/campaigns/${encoded(campaignUuid)}`,
		riskLevel: 'destructive',
		description: 'Delete a campaign.',
	}),
	'campaigns.sendTest': defineMailcoachOperation({
		inputSchema: input['campaigns.sendTest'],
		outputSchema: output['campaigns.sendTest'],
		method: 'POST',
		path: ({ campaignUuid }) => `/campaigns/${encoded(campaignUuid)}/send-test`,
		body: ({ email }) => ({ email }),
		riskLevel: 'destructive',
		description:
			'Send a test campaign email to up to ten comma-separated addresses.',
	}),
	'campaigns.send': defineMailcoachOperation({
		inputSchema: input['campaigns.send'],
		outputSchema: output['campaigns.send'],
		method: 'POST',
		path: ({ campaignUuid }) => `/campaigns/${encoded(campaignUuid)}/send`,
		riskLevel: 'destructive',
		description:
			'Send a campaign to its eligible audience; never automatically retry after a timeout.',
	}),
	'campaigns.opens': defineMailcoachOperation({
		inputSchema: input['campaigns.opens'],
		outputSchema: output['campaigns.opens'],
		method: 'GET',
		path: ({ campaignUuid }) => `/campaigns/${encoded(campaignUuid)}/opens`,
		nextPageUrl: ({ next }) => next,
		riskLevel: 'read',
		description: 'List paginated open statistics for a sent campaign.',
	}),
	'campaigns.clicks': defineMailcoachOperation({
		inputSchema: input['campaigns.clicks'],
		outputSchema: output['campaigns.clicks'],
		method: 'GET',
		path: ({ campaignUuid }) => `/campaigns/${encoded(campaignUuid)}/clicks`,
		nextPageUrl: ({ next }) => next,
		riskLevel: 'read',
		description:
			'List paginated click statistics; this route also has a 5 requests/second burst limit.',
	}),
	'campaigns.unsubscribes': defineMailcoachOperation({
		inputSchema: input['campaigns.unsubscribes'],
		outputSchema: output['campaigns.unsubscribes'],
		method: 'GET',
		path: ({ campaignUuid }) =>
			`/campaigns/${encoded(campaignUuid)}/unsubscribes`,
		nextPageUrl: ({ next }) => next,
		riskLevel: 'read',
		description: 'List paginated unsubscribe statistics for a sent campaign.',
	}),
	'campaigns.bounces': defineMailcoachOperation({
		inputSchema: input['campaigns.bounces'],
		outputSchema: output['campaigns.bounces'],
		method: 'GET',
		path: ({ campaignUuid }) => `/campaigns/${encoded(campaignUuid)}/bounces`,
		nextPageUrl: ({ next }) => next,
		riskLevel: 'read',
		description: 'List paginated bounce statistics for a sent campaign.',
	}),
	'transactionalMails.send': defineMailcoachOperation({
		inputSchema: input['transactionalMails.send'],
		outputSchema: output['transactionalMails.send'],
		method: 'POST',
		path: () => '/transactional-mails/send',
		body: (requestBody) => requestBody,
		riskLevel: 'destructive',
		description:
			'Send or fake-send a transactional email using inline content or a saved mail.',
	}),
	'transactionalMails.listTemplates': defineMailcoachOperation({
		inputSchema: input['transactionalMails.listTemplates'],
		outputSchema: output['transactionalMails.listTemplates'],
		method: 'GET',
		path: () => '/transactional-mails/templates',
		query: ({ query }) => query,
		nextPageUrl: ({ next }) => next,
		riskLevel: 'read',
		description:
			'List saved transactional email templates, not sent-mail log items.',
	}),
	'transactionalMails.getTemplate': defineMailcoachOperation({
		inputSchema: input['transactionalMails.getTemplate'],
		outputSchema: output['transactionalMails.getTemplate'],
		method: 'GET',
		path: ({ templateUuid }) =>
			`/transactional-mails/templates/${encoded(templateUuid)}`,
		riskLevel: 'read',
		description: 'Get a saved transactional email template by UUID.',
	}),
	'automationMails.list': defineMailcoachOperation({
		inputSchema: input['automationMails.list'],
		outputSchema: output['automationMails.list'],
		method: 'GET',
		path: () => '/automation-mails',
		query: ({ query }) => query,
		nextPageUrl: ({ next }) => next,
		riskLevel: 'read',
		description: 'List automation mails with filters, sorting, and pagination.',
	}),
	'automationMails.get': defineMailcoachOperation({
		inputSchema: input['automationMails.get'],
		outputSchema: output['automationMails.get'],
		method: 'GET',
		path: ({ automationMailUuid }) =>
			`/automation-mails/${encoded(automationMailUuid)}`,
		riskLevel: 'read',
		description: 'Get an automation mail by UUID.',
	}),
	'automationMails.create': defineMailcoachOperation({
		inputSchema: input['automationMails.create'],
		outputSchema: output['automationMails.create'],
		method: 'POST',
		path: () => '/automation-mails',
		body: (requestBody) => requestBody,
		riskLevel: 'write',
		description: 'Create an automation mail without starting its automation.',
	}),
	'automationMails.update': defineMailcoachOperation({
		inputSchema: input['automationMails.update'],
		outputSchema: output['automationMails.update'],
		method: 'PUT',
		path: ({ automationMailUuid }) =>
			`/automation-mails/${encoded(automationMailUuid)}`,
		body: ({ body }) => body,
		riskLevel: 'write',
		description: 'Update an automation mail by UUID.',
	}),
	'automationMails.delete': defineMailcoachOperation({
		inputSchema: input['automationMails.delete'],
		outputSchema: output['automationMails.delete'],
		method: 'DELETE',
		path: ({ automationMailUuid }) =>
			`/automation-mails/${encoded(automationMailUuid)}`,
		riskLevel: 'destructive',
		description: 'Delete an automation mail.',
	}),
	'sends.list': defineMailcoachOperation({
		inputSchema: input['sends.list'],
		outputSchema: output['sends.list'],
		method: 'GET',
		path: () => '/sends',
		query: ({ query }) => query,
		nextPageUrl: ({ next }) => next,
		riskLevel: 'read',
		description:
			'List delivery attempts with association filters and pagination.',
	}),
	'sends.get': defineMailcoachOperation({
		inputSchema: input['sends.get'],
		outputSchema: output['sends.get'],
		method: 'GET',
		path: ({ sendUuid }) => `/sends/${encoded(sendUuid)}`,
		riskLevel: 'read',
		description: 'Get a delivery attempt and its recorded engagement events.',
	}),
	'sends.delete': defineMailcoachOperation({
		inputSchema: input['sends.delete'],
		outputSchema: output['sends.delete'],
		method: 'DELETE',
		path: ({ sendUuid }) => `/sends/${encoded(sendUuid)}`,
		riskLevel: 'destructive',
		description: 'Delete a send record; this cannot recall a delivered email.',
	}),
	'links.get': defineMailcoachOperation({
		inputSchema: input['links.get'],
		outputSchema: output['links.get'],
		method: 'GET',
		path: ({ linkUuid }) => `/links/${encoded(linkUuid)}`,
		riskLevel: 'read',
		description:
			'Get a tracked link and click records; this route has a 5 requests/second burst limit.',
	}),
	'suppressions.list': defineMailcoachOperation({
		inputSchema: input['suppressions.list'],
		outputSchema: output['suppressions.list'],
		method: 'GET',
		path: () => '/suppressions',
		query: ({ query }) => query,
		nextPageUrl: ({ next }) => next,
		riskLevel: 'read',
		description:
			'List sending suppressions with documented search and reason filters.',
	}),
	'suppressions.get': defineMailcoachOperation({
		inputSchema: input['suppressions.get'],
		outputSchema: output['suppressions.get'],
		method: 'GET',
		path: ({ identifier }) => `/suppressions/${encoded(identifier)}`,
		riskLevel: 'read',
		description: 'Get a suppression by UUID or URL-encoded email address.',
	}),
	'suppressions.create': defineMailcoachOperation({
		inputSchema: input['suppressions.create'],
		outputSchema: output['suppressions.create'],
		method: 'POST',
		path: () => '/suppressions',
		body: (requestBody) => requestBody,
		riskLevel: 'destructive',
		description:
			'Block an address across the team by adding a manual suppression.',
	}),
	'suppressions.delete': defineMailcoachOperation({
		inputSchema: input['suppressions.delete'],
		outputSchema: output['suppressions.delete'],
		method: 'DELETE',
		path: ({ identifier }) => `/suppressions/${encoded(identifier)}`,
		riskLevel: 'destructive',
		description:
			'Remove an allowed suppression; hosted Mailcoach forbids deleting spam complaints.',
	}),
	'uploads.create': defineMailcoachOperation({
		inputSchema: input['uploads.create'],
		outputSchema: output['uploads.create'],
		method: 'POST',
		path: () => '/uploads',
		body: (requestBody) => requestBody,
		riskLevel: 'write',
		description:
			'Upload up to ten JPEG, PNG, GIF, or WebP images via documented JSON base64 input.',
	}),
} as const;
