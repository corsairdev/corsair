import { MailcoachOperations } from './operations';

export const User = {
	get: MailcoachOperations['user.get'].endpoint,
} as const;
export const EmailLists = {
	list: MailcoachOperations['emailLists.list'].endpoint,
	get: MailcoachOperations['emailLists.get'].endpoint,
	create: MailcoachOperations['emailLists.create'].endpoint,
	update: MailcoachOperations['emailLists.update'].endpoint,
	delete: MailcoachOperations['emailLists.delete'].endpoint,
} as const;
export const Subscribers = {
	list: MailcoachOperations['subscribers.list'].endpoint,
	get: MailcoachOperations['subscribers.get'].endpoint,
	subscribe: MailcoachOperations['subscribers.subscribe'].endpoint,
	update: MailcoachOperations['subscribers.update'].endpoint,
	delete: MailcoachOperations['subscribers.delete'].endpoint,
	confirm: MailcoachOperations['subscribers.confirm'].endpoint,
	confirmByEmail: MailcoachOperations['subscribers.confirmByEmail'].endpoint,
	unsubscribe: MailcoachOperations['subscribers.unsubscribe'].endpoint,
	unsubscribeByEmail:
		MailcoachOperations['subscribers.unsubscribeByEmail'].endpoint,
	resendConfirmation:
		MailcoachOperations['subscribers.resendConfirmation'].endpoint,
	resendConfirmationByEmail:
		MailcoachOperations['subscribers.resendConfirmationByEmail'].endpoint,
	addTags: MailcoachOperations['subscribers.addTags'].endpoint,
	removeTags: MailcoachOperations['subscribers.removeTags'].endpoint,
} as const;
export const SubscriberImports = {
	list: MailcoachOperations['subscriberImports.list'].endpoint,
	get: MailcoachOperations['subscriberImports.get'].endpoint,
	create: MailcoachOperations['subscriberImports.create'].endpoint,
	update: MailcoachOperations['subscriberImports.update'].endpoint,
	delete: MailcoachOperations['subscriberImports.delete'].endpoint,
	append: MailcoachOperations['subscriberImports.append'].endpoint,
	start: MailcoachOperations['subscriberImports.start'].endpoint,
} as const;
export const Tags = {
	list: MailcoachOperations['tags.list'].endpoint,
	get: MailcoachOperations['tags.get'].endpoint,
	create: MailcoachOperations['tags.create'].endpoint,
	update: MailcoachOperations['tags.update'].endpoint,
	delete: MailcoachOperations['tags.delete'].endpoint,
} as const;
export const Segments = {
	list: MailcoachOperations['segments.list'].endpoint,
	get: MailcoachOperations['segments.get'].endpoint,
	create: MailcoachOperations['segments.create'].endpoint,
	update: MailcoachOperations['segments.update'].endpoint,
	delete: MailcoachOperations['segments.delete'].endpoint,
} as const;
export const Templates = {
	list: MailcoachOperations['templates.list'].endpoint,
	get: MailcoachOperations['templates.get'].endpoint,
	create: MailcoachOperations['templates.create'].endpoint,
	update: MailcoachOperations['templates.update'].endpoint,
	delete: MailcoachOperations['templates.delete'].endpoint,
} as const;
export const Campaigns = {
	list: MailcoachOperations['campaigns.list'].endpoint,
	get: MailcoachOperations['campaigns.get'].endpoint,
	create: MailcoachOperations['campaigns.create'].endpoint,
	update: MailcoachOperations['campaigns.update'].endpoint,
	delete: MailcoachOperations['campaigns.delete'].endpoint,
	sendTest: MailcoachOperations['campaigns.sendTest'].endpoint,
	send: MailcoachOperations['campaigns.send'].endpoint,
	opens: MailcoachOperations['campaigns.opens'].endpoint,
	clicks: MailcoachOperations['campaigns.clicks'].endpoint,
	unsubscribes: MailcoachOperations['campaigns.unsubscribes'].endpoint,
	bounces: MailcoachOperations['campaigns.bounces'].endpoint,
} as const;
export const TransactionalMails = {
	send: MailcoachOperations['transactionalMails.send'].endpoint,
	listTemplates:
		MailcoachOperations['transactionalMails.listTemplates'].endpoint,
	getTemplate: MailcoachOperations['transactionalMails.getTemplate'].endpoint,
} as const;
export const AutomationMails = {
	list: MailcoachOperations['automationMails.list'].endpoint,
	get: MailcoachOperations['automationMails.get'].endpoint,
	create: MailcoachOperations['automationMails.create'].endpoint,
	update: MailcoachOperations['automationMails.update'].endpoint,
	delete: MailcoachOperations['automationMails.delete'].endpoint,
} as const;
export const Sends = {
	list: MailcoachOperations['sends.list'].endpoint,
	get: MailcoachOperations['sends.get'].endpoint,
	delete: MailcoachOperations['sends.delete'].endpoint,
} as const;
export const Links = {
	get: MailcoachOperations['links.get'].endpoint,
} as const;
export const Suppressions = {
	list: MailcoachOperations['suppressions.list'].endpoint,
	get: MailcoachOperations['suppressions.get'].endpoint,
	create: MailcoachOperations['suppressions.create'].endpoint,
	delete: MailcoachOperations['suppressions.delete'].endpoint,
} as const;
export const Uploads = {
	create: MailcoachOperations['uploads.create'].endpoint,
} as const;

export { MailcoachOperations };
export * from './types';
