import { z } from 'zod';
import {
	CreationResultSchema,
	LinksSchema,
	ListCollectionSchema,
	MessageResultSchema,
	PathSegmentSchema,
} from './types';

const account = { accountName: PathSegmentSchema };
const paging = {
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
};
const range = { from: z.string().optional(), to: z.string().optional() };
const report = { ...account, scheduledTaskId: z.number().int(), ...range };
const reportPage = { ...report, ...paging };
const optionalString = z.string().nullable().optional();
const optionalNumber = z.number().nullable().optional();
const reportPerson = {
	actionId: optionalNumber,
	name: optionalString,
	subject: optionalString,
	subscriberId: optionalNumber,
	firstName: optionalString,
	lastName: optionalString,
	email: optionalString,
	_links: LinksSchema,
};
const reportItem = z
	.object({
		...reportPerson,
		openings: optionalNumber,
		lastOpenedDate: optionalString,
		clicks: optionalNumber,
		lastClickedDate: optionalString,
		sentDate: optionalString,
		status: optionalString,
		statusDetail: optionalString,
		date: optionalString,
		linkId: optionalNumber,
		urlLink: optionalString,
		reason: optionalString,
		subreason: optionalString,
		unsubDate: optionalString,
	})
	.passthrough();
const detail = z
	.object({
		actionId: optionalNumber,
		name: optionalString,
		subject: optionalString,
		unopenedMailCount: optionalNumber,
		hardBouncedMailCount: optionalNumber,
		softBouncedMailCount: optionalNumber,
		distinctOpenedMailCount: optionalNumber,
		openedMailCount: optionalNumber,
		deliveryCount: optionalNumber,
		sentCount: optionalNumber,
		clickCount: optionalNumber,
		uniqueClickCount: optionalNumber,
		uniqueClickPerCampaignCount: optionalNumber,
		clickThroughOpenRate: optionalNumber,
		socialUniqueClickCount: optionalNumber,
		forwarded: optionalNumber,
		unsubscribersCount: optionalNumber,
		lastClickedEmailDate: optionalString,
		lastOpenedEmailDate: optionalString,
	})
	.passthrough();
const summary = z
	.object({
		scheduledTaskId: optionalNumber,
		totalUnopenedMailCount: optionalNumber,
		totalHardBouncedMailCount: optionalNumber,
		totalSoftBouncedMailCount: optionalNumber,
		totalDistinctOpenedMailCount: optionalNumber,
		totalOpenedMailCount: optionalNumber,
		totalDeliveryCount: optionalNumber,
		totalSentCount: optionalNumber,
		totalClickCount: optionalNumber,
		totalUniqueClickCount: optionalNumber,
		totalUniqueClickPerCampaignCount: optionalNumber,
		totalClickThroughOpenRate: optionalNumber,
		totalSocialUniqueClickCount: optionalNumber,
		totalForwarded: optionalNumber,
		totalUnsubscribersCount: optionalNumber,
		lastClickedEmailDate: optionalString,
		lastOpenedEmailDate: optionalString,
		detail: z.array(detail).nullable().optional(),
		_links: LinksSchema,
	})
	.passthrough();
const scheduledTask = z
	.object({
		scheduledTaskId: optionalNumber,
		status: optionalString,
		type: optionalString,
		name: optionalString,
		creationDate: optionalString,
		emailSentAmount: optionalNumber,
		_links: LinksSchema,
	})
	.passthrough();
const template = z
	.object({
		dobleOptinTemplateId: z.number().int().optional(),
		fromName: z.string().max(100),
		fromEmail: z.string().max(100),
		subject: z.string().max(400),
		name: z.string().max(100),
		preheader: z.string().max(400).nullable().optional(),
		replyTo: z.string().max(100).nullable().optional(),
		urlLanding: z.string().max(200),
		_links: LinksSchema,
	})
	.passthrough();
const field = z
	.object({
		name: z.string(),
		predefined: z.boolean(),
		private: z.boolean(),
		readonly: z.boolean(),
		type: z.enum([
			'boolean',
			'number',
			'string',
			'date',
			'email',
			'gender',
			'country',
			'consent',
			'phone',
			'permission',
		]),
		sample: optionalString,
		fieldId: optionalNumber,
		permissionHTML: optionalString,
		required: z.boolean().nullable().optional(),
		allowedValues: z.array(z.string()).nullable().optional(),
		_links: LinksSchema,
	})
	.passthrough();
const task = z
	.object({
		taskId: optionalString,
		startDate: optionalString,
		finishDate: optionalString,
		taskType: optionalString,
		itemsProcessed: optionalNumber,
		status: z
			.enum(['unknown', 'standBy', 'inProgress', 'completed', 'failed'])
			.nullable()
			.optional(),
		_links: LinksSchema,
	})
	.passthrough();
const importError = z
	.object({
		errorCode: optionalString,
		email: optionalString,
		itemNumber: optionalNumber,
		actionTaken: optionalString,
	})
	.passthrough();
const integration = { ...account, integrationName: PathSegmentSchema };

export const otherInputSchemas = {
	automationList: z.object({ ...account, ...paging }),
	automationSummary: z.object(report),
	automationOpensAndClicks: z.object(reportPage),
	automationDeliverabilityRate: z.object(reportPage),
	automationLinksTracking: z.object(reportPage),
	automationUnsubscribeActivity: z.object(reportPage),
	templateCreate: z.object({ ...account, template }),
	templateGet: z.object({ ...account, templateId: z.number().int() }),
	templateUpdateContent: z.object({
		...account,
		templateId: z.number().int(),
		Body: z.string(),
	}),
	fieldsList: z.object(account),
	home: z.object({}),
	accountHome: z.object(account),
	tasksList: z.object({ ...account, ...paging }),
	tasksGet: z.object({ ...account, taskId: PathSegmentSchema }),
	tasksImportErrors: z.object({
		...account,
		taskId: PathSegmentSchema,
		...paging,
	}),
	integrationGet: z.object(integration),
	integrationUpdate: z.object({
		...integration,
		thirdPartyAppAccess: z
			.object({
				accessToken: z.string().max(250).nullable().optional(),
				refreshToken: z.string().max(250).nullable().optional(),
				idAccount: z.number().int().nullable().optional(),
				accountName: z.string().max(100).nullable().optional(),
			})
			.passthrough(),
	}),
	integrationDelete: z.object(integration),
} as const;
const reportCollection = ListCollectionSchema.extend({
	items: z.array(reportItem),
});
export const otherOutputSchemas = {
	automationList: ListCollectionSchema.extend({
		items: z.array(scheduledTask),
	}),
	automationSummary: summary,
	automationOpensAndClicks: reportCollection,
	automationDeliverabilityRate: reportCollection,
	automationLinksTracking: reportCollection,
	automationUnsubscribeActivity: reportCollection,
	templateCreate: CreationResultSchema,
	templateGet: template,
	templateUpdateContent: MessageResultSchema,
	fieldsList: z
		.object({ items: z.array(field), _links: LinksSchema })
		.passthrough(),
	home: MessageResultSchema,
	accountHome: MessageResultSchema,
	tasksList: ListCollectionSchema.extend({ items: z.array(task) }),
	tasksGet: task,
	tasksImportErrors: ListCollectionSchema.extend({
		items: z.array(importError),
	}),
	integrationGet: MessageResultSchema,
	integrationUpdate: MessageResultSchema,
	integrationDelete: MessageResultSchema,
} as const;
