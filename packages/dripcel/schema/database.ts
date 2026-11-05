import { z } from 'zod';

/**
 * Dripcel contact.
 * Official: GET /contacts/:cell, POST /contacts, PUT /contacts
 * https://docs.dripcel.com/API/contacts
 */
export const DripcelContact = z
	.object({
		_id: z.string().optional(),
		cell: z.string().optional(),
		firstname: z.string().optional(),
		lastname: z.string().optional(),
		email: z.string().optional(),
		tag_ids: z.array(z.string()).optional(),
		tags: z.array(z.string()).optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

export type DripcelContact = z.infer<typeof DripcelContact>;

/**
 * Dripcel campaign (v1 list/get).
 * Official: GET /campaigns, GET /campaigns/:campaign_id
 * https://docs.dripcel.com/API/campaigns
 */
export const DripcelCampaign = z
	.object({
		_id: z.string().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
		active: z.boolean().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

export type DripcelCampaign = z.infer<typeof DripcelCampaign>;

/**
 * Dripcel tag.
 * Official: GET /tags, GET /tags/:tag_id, DELETE /tags/:tag_id
 * https://docs.dripcel.com/API/tags
 * Live GET /tags fields: _id, name, description, color, createdAt, updatedAt
 */
export const DripcelTag = z
	.object({
		_id: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		color: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

export type DripcelTag = z.infer<typeof DripcelTag>;

/**
 * Dripcel delivery record.
 * Official: GET /deliveries
 * https://docs.dripcel.com/API/deliveries
 */
export const DripcelDelivery = z
	.object({
		_id: z.string().optional(),
		cell: z.string().optional(),
		customerId: z.string().optional(),
		status: z.string().optional(),
	})
	.loose();

export type DripcelDelivery = z.infer<typeof DripcelDelivery>;

/**
 * Dripcel email template.
 * Official: GET /email/templates
 * https://docs.dripcel.com/API/email-templates
 */
export const DripcelEmailTemplate = z
	.object({
		_id: z.string().optional(),
		name: z.string().optional(),
		subject: z.string().optional(),
		content: z.string().optional(),
	})
	.loose();

export type DripcelEmailTemplate = z.infer<typeof DripcelEmailTemplate>;

/**
 * Dripcel sale.
 * Official: POST /sales body row
 * https://docs.dripcel.com/API/sales
 */
export const DripcelSale = z
	.object({
		_id: z.string().optional(),
		campaign_id: z.string().optional(),
		send_id: z.string().optional(),
		click_id: z.string().optional(),
		cell: z.string().optional(),
		soldAt: z.string().optional(),
		saleValue: z.number().optional(),
	})
	.loose();

export type DripcelSale = z.infer<typeof DripcelSale>;

/**
 * Dripcel SMS/email reply.
 * Official: POST /replies/search
 * https://docs.dripcel.com/API/replies
 */
export const DripcelReply = z
	.object({
		_id: z.string().optional(),
		Msisdn: z.string().optional(),
		Message: z.string().optional(),
		campaign_id: z.string().optional(),
		UserReference: z.string().optional(),
		kind: z.enum(['optIn', 'optOut', 'unknown']).optional(),
		Received: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

export type DripcelReply = z.infer<typeof DripcelReply>;

/**
 * Dripcel send log.
 * Official: GET /send-logs/:send_id, POST /send-logs/search
 * https://docs.dripcel.com/API/send-logs
 */
export const DripcelSendLog = z
	.object({
		_id: z.string().optional(),
		campaign_id: z.string().optional(),
		message: z.string().optional(),
		triggeredBy: z.string().optional(),
		startDeliveryAt: z.string().optional(),
		destinations: z.union([z.number(), z.array(z.string())]).optional(),
	})
	.loose();

export type DripcelSendLog = z.infer<typeof DripcelSendLog>;
