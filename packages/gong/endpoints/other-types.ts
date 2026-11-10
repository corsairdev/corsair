import { z } from 'zod';

const objectInput = z.record(z.string(), z.unknown());
// Gong ids are 64-bit; a string keeps the digits a JavaScript number would round.
const gongId = z.union([
	z.string().regex(/^\d{1,20}$/),
	z.number().int().nonnegative(),
]);
const envelope = z.object({ requestId: z.string() }).passthrough();
const entityType = z.enum(['ACCOUNT', 'CONTACT', 'DEAL', 'LEAD']);
const period = z.enum([
	'LAST_7DAYS',
	'LAST_30DAYS',
	'LAST_90DAYS',
	'LAST_90_DAYS_SINCE_LAST_ACTIVITY',
	'LAST_YEAR_SINCE_LAST_ACTIVITY',
	'LAST_YEAR',
	'THIS_WEEK',
	'THIS_MONTH',
	'THIS_YEAR',
	'THIS_QUARTER',
	'CUSTOM_RANGE',
	'ALL_CONVERSATIONS',
]);
const account = z.object({
	id: z.string().min(1),
	accountSearchCriteria: z.object({
		name: z.string().optional(),
		domain: z.string().optional(),
		linkedinUrl: z.string().optional(),
	}),
});
const contact = z.object({
	id: z.string().min(1),
	firstName: z.string().max(255).optional(),
	lastName: z.string().max(255).optional(),
	linkedinUrl: z.string().max(500).optional(),
	email: z.string().max(255).optional(),
	accountSearchCriteria: z
		.object({
			name: z.string().optional(),
			domain: z.string().optional(),
			linkedinUrl: z.string().optional(),
		})
		.optional(),
});
// Gong returns one entry per requested data category; `data` differs by category.
const enrichedDataCategory = z
	.object({
		dataCategory: z.string().optional(),
		status: z.string().optional(),
		enriched: z.boolean().optional(),
		data: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.passthrough();
const accountEnrichResponse = z
	.object({
		id: z.string(),
		matched: z.boolean(),
		dataCategories: z.array(enrichedDataCategory).optional(),
	})
	.passthrough();
// Each answer item carries its text and the calls and emails it was drawn from.
const entityAnswer = z
	.object({
		answerItems: z.array(z.string()).optional(),
		emailFindings: z.array(objectInput).optional(),
		callFindings: z.array(objectInput).optional(),
	})
	.passthrough();
const contactEnrichResponse = accountEnrichResponse;

export const GongOtherInputSchemas = {
	addDigitalInteraction: z.object({
		eventId: z.string(),
		timestamp: z.string().datetime({ offset: true }),
		eventType: z.string(),
		sourceSystemName: z.string().optional(),
		sessionId: z.string().optional(),
		device: z.enum(['MOBILE', 'PC']).optional(),
		content: z.record(z.string(), z.unknown()),
		person: z.record(z.string(), z.unknown()).optional(),
		customFields: z.array(z.record(z.string(), z.unknown())).optional(),
		trackingId: z.string().nullable().optional(),
	}),
	purgePhoneNumber: z.object({ phoneNumber: z.string().min(1) }),
	purgeEmailAddress: z.object({ emailAddress: z.string().email() }),
	findAllReferencesToPhoneNumber: z.object({ phoneNumber: z.string().min(1) }),
	findAllReferencesToEmailAddress: z.object({
		emailAddress: z.string().email(),
	}),
	accountsEnrich: z.object({
		dataCategories: z.array(z.literal('accountData')).min(1).max(1),
		accounts: z.array(account).min(1).max(10),
	}),
	getAccountsEnrichResults: z.object({ jobId: z.string().min(1) }),
	contactsEnrich: z.object({
		dataCategories: z
			.array(z.enum(['contactData', 'enrichEmails', 'enrichPhones']))
			.min(1)
			.max(3),
		contacts: z.array(contact).min(1).max(10),
	}),
	getContactsEnrichResults: z.object({ jobId: z.string().min(1) }),
	listLogs: z.object({
		logType: z.enum([
			'AccessLog',
			'UserActivityLog',
			'UserCallPlay',
			'ExternallySharedCallAccess',
			'ExternallySharedCallPlay',
		]),
		fromDateTime: z.string().datetime({ offset: true }),
		toDateTime: z.string().datetime({ offset: true }).optional(),
		cursor: z.string().optional(),
	}),
	generateBrief: z.object({
		workspaceId: gongId,
		briefName: z.string(),
		crmEntityType: entityType,
		crmEntityId: z.string(),
		timePeriod: period,
		fromDateTime: z.string().datetime({ offset: true }).optional(),
		toDateTime: z.string().datetime({ offset: true }).optional(),
	}),
	askEntity: z.object({
		workspaceId: gongId,
		crmEntityType: entityType,
		crmEntityId: z.string(),
		timePeriod: period,
		fromDateTime: z.string().datetime({ offset: true }).optional(),
		toDateTime: z.string().datetime({ offset: true }).optional(),
		question: z.string().min(1),
	}),
	listCoaching: z.object({
		'workspace-id': z.string().regex(/^\d{1,20}$/),
		'manager-id': z.string().regex(/^\d{1,20}$/),
		from: z.string().min(1),
		to: z.string().min(1),
	}),
	listCallOutcomes: z.object({}),
} as const;

export const GongOtherOutputSchemas = {
	addDigitalInteraction: envelope,
	purgePhoneNumber: envelope,
	purgeEmailAddress: envelope,
	findAllReferencesToPhoneNumber: envelope,
	findAllReferencesToEmailAddress: envelope,
	accountsEnrich: envelope.extend({ jobId: z.string() }),
	getAccountsEnrichResults: envelope.extend({
		accounts: z.array(accountEnrichResponse),
		summary: objectInput,
	}),
	contactsEnrich: envelope.extend({ jobId: z.string() }),
	getContactsEnrichResults: envelope.extend({
		contacts: z.array(contactEnrichResponse),
		summary: objectInput,
	}),
	listLogs: envelope.extend({
		records: objectInput,
		logEntries: z.array(objectInput),
	}),
	generateBrief: envelope.extend({
		numOfCallsSearched: z.number(),
		numOfEmailsSearched: z.number(),
		briefSections: z.array(objectInput),
	}),
	askEntity: envelope.extend({
		numOfCallsSearched: z.number(),
		numOfEmailsSearched: z.number(),
		answer: z.array(entityAnswer),
	}),
	listCoaching: envelope,
	listCallOutcomes: envelope.extend({ outcomes: z.array(objectInput) }),
} as const;

export type GongOtherInputs = {
	[K in keyof typeof GongOtherInputSchemas]: z.infer<
		(typeof GongOtherInputSchemas)[K]
	>;
};
export type GongOtherOutputs = {
	[K in keyof typeof GongOtherOutputSchemas]: z.infer<
		(typeof GongOtherOutputSchemas)[K]
	>;
};
