import { z } from 'zod';

const NestedId = z
	.object({
		id: z.number().int().optional(),
	})
	.loose();

/**
 * Capsule API v2 Party.
 * Official: https://developer.capsulecrm.com/v2/models/party
 */
export const CapsuleCrmParty = z
	.object({
		id: z.number().int().optional(),
		type: z.enum(['person', 'organisation']).optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		title: z.string().nullable().optional(),
		jobTitle: z.string().nullable().optional(),
		name: z.string().optional(),
		about: z.string().nullable().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		lastContactedAt: z.string().nullable().optional(),
		organisation: NestedId.nullable().optional(),
		owner: NestedId.nullable().optional(),
		team: NestedId.nullable().optional(),
		pictureURL: z.string().optional(),
		addresses: z.array(z.object({}).loose()).optional(),
		phoneNumbers: z.array(z.object({}).loose()).optional(),
		websites: z.array(z.object({}).loose()).optional(),
		emailAddresses: z.array(z.object({}).loose()).optional(),
		tags: z.array(z.object({}).loose()).optional(),
		fields: z.array(z.object({}).loose()).optional(),
	})
	.loose();
export type CapsuleCrmParty = z.infer<typeof CapsuleCrmParty>;

/**
 * Capsule API v2 Opportunity.
 * Official: https://developer.capsulecrm.com/v2/models/opportunity
 */
export const CapsuleCrmOpportunity = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		description: z.string().nullable().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		party: NestedId.optional(),
		milestone: NestedId.optional(),
		owner: NestedId.nullable().optional(),
		team: NestedId.nullable().optional(),
		probability: z.number().int().nullable().optional(),
		expectedCloseOn: z.string().nullable().optional(),
		closedOn: z.string().nullable().optional(),
		duration: z.number().int().nullable().optional(),
		durationBasis: z.string().nullable().optional(),
		value: z.object({}).loose().nullable().optional(),
		lostReason: NestedId.nullable().optional(),
	})
	.loose();
export type CapsuleCrmOpportunity = z.infer<typeof CapsuleCrmOpportunity>;

/**
 * Capsule API v2 Project (kase).
 * Official: https://developer.capsulecrm.com/v2/models/kase
 */
export const CapsuleCrmProject = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		description: z.string().nullable().optional(),
		status: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		party: NestedId.optional(),
		opportunity: NestedId.nullable().optional(),
		owner: NestedId.nullable().optional(),
		team: NestedId.nullable().optional(),
		stage: NestedId.nullable().optional(),
		startOn: z.string().nullable().optional(),
		expectedCloseOn: z.string().nullable().optional(),
	})
	.loose();
export type CapsuleCrmProject = z.infer<typeof CapsuleCrmProject>;

/**
 * Capsule API v2 Task.
 * Official: https://developer.capsulecrm.com/v2/models/task
 */
export const CapsuleCrmTask = z
	.object({
		id: z.number().int().optional(),
		description: z.string().optional(),
		dueOn: z.string().nullable().optional(),
		dueTime: z.string().nullable().optional(),
		status: z.string().optional(),
		category: NestedId.nullable().optional(),
		owner: NestedId.nullable().optional(),
		party: NestedId.nullable().optional(),
		opportunity: NestedId.nullable().optional(),
		kase: NestedId.nullable().optional(),
	})
	.loose();
export type CapsuleCrmTask = z.infer<typeof CapsuleCrmTask>;

/**
 * Capsule API v2 Entry (note / email / completed task).
 * Official: https://developer.capsulecrm.com/v2/models/entry
 */
export const CapsuleCrmEntry = z
	.object({
		id: z.number().int().optional(),
		type: z.string().optional(),
		content: z.string().nullable().optional(),
		subject: z.string().optional(),
		entryAt: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		party: NestedId.nullable().optional(),
		kase: NestedId.nullable().optional(),
		opportunity: NestedId.nullable().optional(),
	})
	.loose();
export type CapsuleCrmEntry = z.infer<typeof CapsuleCrmEntry>;

/**
 * Capsule API v2 User.
 * Official: https://developer.capsulecrm.com/v2/models/user
 */
export const CapsuleCrmUser = z
	.object({
		id: z.number().int().optional(),
		username: z.string().optional(),
		name: z.string().optional(),
		locale: z.string().optional(),
		currency: z.string().optional(),
		status: z.string().optional(),
		timezone: z.string().optional(),
		lastLoginAt: z.string().nullable().optional(),
		taskReminder: z.boolean().optional(),
		party: NestedId.optional(),
	})
	.loose();
export type CapsuleCrmUser = z.infer<typeof CapsuleCrmUser>;

/**
 * Capsule API v2 Site.
 * Official: https://developer.capsulecrm.com/v2/models/site
 */
export const CapsuleCrmSite = z
	.object({
		url: z.string().optional(),
		subdomain: z.string().optional(),
		name: z.string().optional(),
	})
	.loose();
export type CapsuleCrmSite = z.infer<typeof CapsuleCrmSite>;

/**
 * Capsule API v2 Milestone.
 * Official: https://developer.capsulecrm.com/v2/models/milestone
 */
export const CapsuleCrmMilestone = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		description: z.string().nullable().optional(),
		complete: z.boolean().optional(),
		probability: z.number().int().nullable().optional(),
		daysUntilStale: z.number().int().nullable().optional(),
	})
	.loose();
export type CapsuleCrmMilestone = z.infer<typeof CapsuleCrmMilestone>;

/**
 * Capsule API v2 Board.
 * Official: https://developer.capsulecrm.com/v2/models/board
 */
export const CapsuleCrmBoard = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		description: z.string().nullable().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();
export type CapsuleCrmBoard = z.infer<typeof CapsuleCrmBoard>;
