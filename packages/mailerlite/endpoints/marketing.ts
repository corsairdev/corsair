import { z } from 'zod';
import { defineMailerLiteOperation } from './operation';
import {
	MailerLiteCountResponseSchema,
	MailerLiteEntityResponseSchema,
	MailerLiteEntitySchema,
	MailerLiteFieldsSchema,
	MailerLiteIdSchema,
	MailerLiteImportAcceptedSchema,
	MailerLiteImportProgressResponseSchema,
	MailerLiteListResponseSchema,
	MailerLiteNoContentSchema,
} from './types';

const EmptyInput = z.object({}).strict();
const Identifier = z.string().min(1);
const SubscriberStatus = z.enum([
	'active',
	'unsubscribed',
	'unconfirmed',
	'bounced',
	'junk',
]);

const SubscriberListInput = z
	.object({
		query: z
			.object({
				'filter[status]': z
					.string()
					.refine((value) =>
						value
							.split(',')
							.every((status) => SubscriberStatus.safeParse(status).success),
					)
					.optional(),
				'filter[subscribed_from]': z.string().optional(),
				'filter[subscribed_to]': z.string().optional(),
				'filter[group]': z.string().optional(),
				'filter[automation]': z.string().optional(),
				'filter[form]': z.string().optional(),
				'filter[site]': z.string().optional(),
				'filter[page]': z.string().optional(),
				'filter[import]': z.string().optional(),
				'filter[post]': z.string().optional(),
				limit: z.number().int().min(0).max(1000).optional(),
				cursor: z.string().optional(),
				sort: z.enum(['name', 'type', '-name', '-type']).optional(),
				include: z.literal('groups').optional(),
				start_date: z.string().optional(),
				end_date: z.string().optional(),
				with_fields: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const SubscriberCreateBody = z
	.object({
		email: z.string().email(),
		fields: MailerLiteFieldsSchema.optional(),
		groups: z.array(MailerLiteIdSchema).optional(),
		status: SubscriberStatus.optional(),
		subscribed_at: z.string().optional(),
		ip_address: z.string().optional(),
		opted_in_at: z.string().optional(),
		optin_ip: z.string().optional(),
		unsubscribed_at: z.string().optional(),
		resubscribe: z.boolean().optional(),
		double_optin: z.boolean().optional(),
		notes: z.array(z.string().max(10000)).optional(),
	})
	.strict();

const SubscriberUpdateBody = z
	.object({
		email: z.string().email().optional(),
		fields: MailerLiteFieldsSchema.optional(),
		groups: z.array(MailerLiteIdSchema).optional(),
		status: SubscriberStatus.optional(),
		subscribed_at: z.string().optional(),
		ip_address: z.string().optional(),
		opted_in_at: z.string().optional(),
		optin_ip: z.string().optional(),
		unsubscribed_at: z.string().optional(),
	})
	.strict();

const SubscriberFilterQuery = z
	.object({
		limit: z.literal(0),
		'filter[status]': z.string().optional(),
		'filter[subscribed_from]': z.string().optional(),
		'filter[subscribed_to]': z.string().optional(),
	})
	.strict();

export const Subscribers = {
	list: defineMailerLiteOperation({
		operation: 'subscribers.list',
		input: SubscriberListInput,
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: '/subscribers',
			query: input.query,
		}),
	}),
	create: defineMailerLiteOperation({
		operation: 'subscribers.create',
		riskLevel: 'destructive',
		input: z.object({ body: SubscriberCreateBody }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: '/subscribers',
			body: input.body,
		}),
	}),
	update: defineMailerLiteOperation({
		operation: 'subscribers.update',
		riskLevel: 'destructive',
		input: z.object({ id: Identifier, body: SubscriberUpdateBody }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/subscribers/${encodeURIComponent(input.id)}`,
			body: input.body,
		}),
	}),
	get: defineMailerLiteOperation({
		operation: 'subscribers.get',
		input: z.object({ identifier: Identifier }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/subscribers/${encodeURIComponent(input.identifier)}`,
		}),
	}),
	count: defineMailerLiteOperation({
		operation: 'subscribers.count',
		input: z.object({ query: SubscriberFilterQuery }).strict(),
		output: MailerLiteCountResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: '/subscribers',
			query: input.query,
		}),
	}),
	activity: defineMailerLiteOperation({
		operation: 'subscribers.activity',
		input: z
			.object({
				id: Identifier,
				query: z
					.object({
						'filter[log_name]': z.string().optional(),
						limit: z.number().int().min(1).max(5000).optional(),
						page: z.number().int().min(1).optional(),
					})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/subscribers/${encodeURIComponent(input.id)}/activity-log`,
			query: input.query,
		}),
	}),
	delete: defineMailerLiteOperation({
		operation: 'subscribers.delete',
		input: z.object({ id: Identifier }).strict(),
		output: MailerLiteNoContentSchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/subscribers/${encodeURIComponent(input.id)}`,
		}),
	}),
	forget: defineMailerLiteOperation({
		operation: 'subscribers.forget',
		input: z.object({ id: Identifier }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/subscribers/${encodeURIComponent(input.id)}/forget`,
		}),
	}),
	importStatus: defineMailerLiteOperation({
		operation: 'subscribers.importStatus',
		input: z.object({ importId: Identifier }).strict(),
		output: MailerLiteImportProgressResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/subscribers/import/${encodeURIComponent(input.importId)}`,
		}),
	}),
	ecommerceStats: defineMailerLiteOperation({
		operation: 'subscribers.ecommerceStats',
		input: z
			.object({
				id: Identifier,
				query: z.object({ shop_id: z.number().int().positive() }).strict(),
			})
			.strict(),
		output: z
			.object({
				data: z
					.object({
						ecommerce: z
							.object({
								orders_count: z.number(),
								revenue: z.number(),
								average_order_value: z.number(),
								conversion_rate: z.string(),
							})
							.strict(),
					})
					.strict(),
			})
			.strict(),
		request: (input) => ({
			method: 'GET',
			url: `/subscribers/${encodeURIComponent(input.id)}/reports/ecommerce`,
			query: input.query,
		}),
	}),
	ecommerceOrders: defineMailerLiteOperation({
		operation: 'subscribers.ecommerceOrders',
		input: z
			.object({
				id: Identifier,
				query: z
					.object({
						shop_id: z.number().int().positive(),
						limit: z.number().int().positive().optional(),
						page: z.number().int().positive().optional(),
					})
					.strict(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/subscribers/${encodeURIComponent(input.id)}/reports/ecommerce/orders`,
			query: input.query,
		}),
	}),
	addToGroup: defineMailerLiteOperation({
		operation: 'subscribers.addToGroup',
		riskLevel: 'destructive',
		input: z.object({ subscriberId: Identifier, groupId: Identifier }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/subscribers/${encodeURIComponent(input.subscriberId)}/groups/${encodeURIComponent(input.groupId)}`,
		}),
	}),
	removeFromGroup: defineMailerLiteOperation({
		operation: 'subscribers.removeFromGroup',
		input: z.object({ subscriberId: Identifier, groupId: Identifier }).strict(),
		output: MailerLiteNoContentSchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/subscribers/${encodeURIComponent(input.subscriberId)}/groups/${encodeURIComponent(input.groupId)}`,
		}),
	}),
};

export const Groups = {
	list: defineMailerLiteOperation({
		operation: 'groups.list',
		input: z
			.object({
				query: z
					.object({
						limit: z.number().int().positive().max(1000).optional(),
						page: z.number().int().positive().optional(),
						'filter[name]': z.string().optional(),
						sort: z
							.enum([
								'id',
								'name',
								'active_count',
								'open_rate',
								'click_rate',
								'created_at',
								'-id',
								'-name',
								'-active_count',
								'-open_rate',
								'-click_rate',
								'-created_at',
							])
							.optional(),
					})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({ method: 'GET', url: '/groups', query: input.query }),
	}),
	create: defineMailerLiteOperation({
		operation: 'groups.create',
		input: z
			.object({ body: z.object({ name: z.string().min(1).max(255) }).strict() })
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({ method: 'POST', url: '/groups', body: input.body }),
	}),
	update: defineMailerLiteOperation({
		operation: 'groups.update',
		input: z
			.object({
				groupId: Identifier,
				body: z.object({ name: z.string().min(1).max(255) }).strict(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/groups/${encodeURIComponent(input.groupId)}`,
			body: input.body,
		}),
	}),
	delete: defineMailerLiteOperation({
		operation: 'groups.delete',
		input: z.object({ groupId: Identifier }).strict(),
		output: MailerLiteNoContentSchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/groups/${encodeURIComponent(input.groupId)}`,
		}),
	}),
	subscribers: defineMailerLiteOperation({
		operation: 'groups.subscribers',
		input: z
			.object({
				groupId: Identifier,
				query: z
					.object({
						'filter[status]': SubscriberStatus.optional(),
						limit: z.number().int().positive().max(1000).optional(),
						cursor: z.string().optional(),
						include: z.literal('groups').optional(),
					})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/groups/${encodeURIComponent(input.groupId)}/subscribers`,
			query: input.query,
		}),
	}),
	importSubscribers: defineMailerLiteOperation({
		operation: 'groups.importSubscribers',
		input: z
			.object({
				groupId: Identifier,
				body: z
					.object({
						subscribers: z
							.array(
								z
									.object({
										email: z.string().email(),
										fields: MailerLiteFieldsSchema.optional(),
										name: z.string().optional(),
									})
									.strict(),
							)
							.min(1),
						trigger_automations: z.boolean().optional(),
					})
					.strict(),
			})
			.strict(),
		output: MailerLiteImportAcceptedSchema,
		request: (input) => ({
			method: 'POST',
			url: `/groups/${encodeURIComponent(input.groupId)}/import-subscribers`,
			body: input.body,
		}),
	}),
};

export const Fields = {
	list: defineMailerLiteOperation({
		operation: 'fields.list',
		input: z
			.object({
				query: z
					.object({
						limit: z.number().int().positive().max(1000).optional(),
						page: z.number().int().positive().optional(),
						'filter[keyword]': z.string().optional(),
						'filter[type]': z.string().optional(),
						sort: z
							.enum([
								'id',
								'created_at',
								'subscribed_at',
								'unsubscribed_at',
								'email',
								'signup_date',
								'-id',
								'-created_at',
								'-subscribed_at',
								'-unsubscribed_at',
								'-email',
								'-signup_date',
							])
							.optional(),
					})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({ method: 'GET', url: '/fields', query: input.query }),
	}),
	create: defineMailerLiteOperation({
		operation: 'fields.create',
		input: z
			.object({
				body: z
					.object({
						name: z.string().min(1).max(255),
						type: z.enum(['text', 'number', 'date']),
					})
					.strict(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({ method: 'POST', url: '/fields', body: input.body }),
	}),
	update: defineMailerLiteOperation({
		operation: 'fields.update',
		input: z
			.object({
				fieldId: Identifier,
				body: z.object({ name: z.string().min(1).max(255) }).strict(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/fields/${encodeURIComponent(input.fieldId)}`,
			body: input.body,
		}),
	}),
	delete: defineMailerLiteOperation({
		operation: 'fields.delete',
		input: z.object({ fieldId: Identifier }).strict(),
		output: MailerLiteNoContentSchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/fields/${encodeURIComponent(input.fieldId)}`,
		}),
	}),
};

export const Segments = {
	list: defineMailerLiteOperation({
		operation: 'segments.list',
		input: z
			.object({
				query: z
					.object({
						limit: z.number().int().positive().optional(),
						page: z.number().int().positive().optional(),
						sort: z
							.enum([
								'id',
								'name',
								'total',
								'open_rate',
								'click_rate',
								'created_at',
								'-id',
								'-name',
								'-total',
								'-open_rate',
								'-click_rate',
								'-created_at',
							])
							.optional(),
					})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: '/segments',
			query: input.query,
		}),
	}),
	update: defineMailerLiteOperation({
		operation: 'segments.update',
		input: z
			.object({
				segmentId: Identifier,
				body: z
					.object({ name: z.string().min(1).max(255).optional() })
					.strict(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/segments/${encodeURIComponent(input.segmentId)}`,
			body: input.body,
		}),
	}),
	delete: defineMailerLiteOperation({
		operation: 'segments.delete',
		input: z.object({ segmentId: Identifier }).strict(),
		output: MailerLiteNoContentSchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/segments/${encodeURIComponent(input.segmentId)}`,
		}),
	}),
	subscribers: defineMailerLiteOperation({
		operation: 'segments.subscribers',
		input: z
			.object({
				segmentId: Identifier,
				query: z
					.object({
						'filter[status]': SubscriberStatus.optional(),
						limit: z.number().int().positive().max(1000).optional(),
						cursor: z.string().optional(),
					})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/segments/${encodeURIComponent(input.segmentId)}/subscribers`,
			query: input.query,
		}),
	}),
};

const CampaignEmailSchema = z
	.object({
		subject: z.string().max(255).optional(),
		from_name: z.string().max(255).optional(),
		from: z.string().email().optional(),
		reply_to: z.string().email().optional(),
		content: z.string().optional(),
		editor: z.literal('simple').optional(),
		template_id: z.number().int().positive().optional(),
	})
	.strict()
	.superRefine((email, ctx) => {
		if (email.editor === 'simple' && email.content !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['content'],
				message: 'content cannot be sent with editor: simple.',
			});
		}
	});

const AbSettingsSchema = z
	.object({
		test_type: z.enum(['subject', 'sender', 'sending_time']),
		select_winner_by: z.enum(['o', 'c']).optional(),
		after_time_amount: z.number().int().positive().optional(),
		after_time_unit: z.enum(['h', 'd']).optional(),
		test_split: z.number().int().min(5).max(100),
		b_value: z
			.object({
				subject: z.string().max(255).optional(),
				from_name: z.string().max(255).optional(),
				from: z.string().email().optional(),
			})
			.strict()
			.optional(),
	})
	.strict()
	.superRefine((settings, ctx) => {
		const isTimeTest = settings.test_type === 'sending_time';
		if (isTimeTest) {
			if (settings.test_split !== 100)
				ctx.addIssue({
					code: 'custom',
					path: ['test_split'],
					message: 'Sending-time tests require test_split: 100.',
				});
			if (
				settings.select_winner_by !== undefined ||
				settings.after_time_amount !== undefined ||
				settings.after_time_unit !== undefined ||
				settings.b_value !== undefined
			) {
				ctx.addIssue({
					code: 'custom',
					message:
						'Sending-time tests do not accept winner metric, wait or b_value fields.',
				});
			}
			return;
		}
		if (settings.test_split > 25)
			ctx.addIssue({
				code: 'custom',
				path: ['test_split'],
				message: 'Subject and sender tests allow a 5–25 percent split.',
			});
		if (settings.select_winner_by === undefined)
			ctx.addIssue({
				code: 'custom',
				path: ['select_winner_by'],
				message: 'select_winner_by is required for subject/sender tests.',
			});
		if (settings.after_time_amount === undefined)
			ctx.addIssue({
				code: 'custom',
				path: ['after_time_amount'],
				message: 'after_time_amount is required for subject/sender tests.',
			});
		if (settings.after_time_unit === undefined)
			ctx.addIssue({
				code: 'custom',
				path: ['after_time_unit'],
				message: 'after_time_unit is required for subject/sender tests.',
			});
		if (settings.b_value === undefined)
			ctx.addIssue({
				code: 'custom',
				path: ['b_value'],
				message: 'b_value is required for subject/sender tests.',
			});
		if (
			settings.test_type === 'subject' &&
			settings.b_value?.subject === undefined
		)
			ctx.addIssue({
				code: 'custom',
				path: ['b_value', 'subject'],
				message: 'The subject test requires the B subject.',
			});
		if (
			settings.test_type === 'sender' &&
			(settings.b_value?.from === undefined ||
				settings.b_value.from_name === undefined)
		)
			ctx.addIssue({
				code: 'custom',
				path: ['b_value'],
				message: 'The sender test requires B sender name and email.',
			});
	});

const ResendSettingsSchema = z
	.object({
		test_type: z.literal('subject'),
		select_winner_by: z.enum(['o', 'c']),
		b_value: z.object({ subject: z.string().max(255) }).strict(),
	})
	.strict();

const CampaignSettingsSchema = z
	.object({
		test_variants: z
			.object({
				subject: z.array(z.string().max(998)).min(1),
				sender: z
					.array(
						z
							.object({
								from: z.string().email(),
								from_name: z.string().max(255),
							})
							.strict(),
					)
					.min(1),
				content: z.number().int().min(1).max(8),
				sending_time: z.number().int().min(1).max(8),
			})
			.strict(),
		select_winner_by: z.enum(['o', 'c']).optional(),
		after_time_amount: z.number().int().min(1).max(10).optional(),
		after_time_unit: z.enum(['h', 'd']).optional(),
		test_split: z.number().int().min(1).max(100).optional(),
	})
	.strict()
	.superRefine((settings, ctx) => {
		const variantCount =
			settings.test_variants.subject.length *
			settings.test_variants.sender.length *
			settings.test_variants.content *
			settings.test_variants.sending_time;
		if (variantCount < 2 || variantCount > 8)
			ctx.addIssue({
				code: 'custom',
				path: ['test_variants'],
				message: 'Multivariate combinations must total between 2 and 8.',
			});
	});

const CampaignOrderReportSchema = z
	.object({
		data: z.array(
			z
				.object({
					subscriber: z
						.object({ id: MailerLiteIdSchema, email: z.string().email() })
						.strict(),
					total: z.number(),
					updated_at: z.string(),
					order: z.string(),
				})
				.passthrough(),
		),
		links: z
			.object({
				first: z.string().nullable().optional(),
				last: z.string().nullable().optional(),
				prev: z.string().nullable().optional(),
				next: z.string().nullable().optional(),
			})
			.passthrough()
			.optional(),
		meta: z
			.object({
				current_page: z.number().optional(),
				last_page: z.number().optional(),
				per_page: z.number().optional(),
				total: z.number().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const CampaignCreateBody = z
	.object({
		name: z.string().min(1).max(255),
		type: z.enum(['regular', 'ab', 'resend', 'multivariate']),
		language_id: z.number().int().positive().optional(),
		emails: z.array(CampaignEmailSchema).optional(),
		groups: z.array(MailerLiteIdSchema).optional(),
		segments: z.array(MailerLiteIdSchema).optional(),
		ab_settings: AbSettingsSchema.optional(),
		resend_settings: ResendSettingsSchema.optional(),
		multivariate_settings: CampaignSettingsSchema.optional(),
		settings: z
			.object({ ecommerce_tracking: z.boolean().optional() })
			.strict()
			.optional(),
	})
	.strict()
	.superRefine((value, ctx) => {
		if (
			value.type !== 'multivariate' &&
			(!value.emails || value.emails.length === 0)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['emails'],
				message: 'At least one email is required for this campaign type.',
			});
		}
		if (value.type !== 'multivariate') {
			for (const [index, email] of (value.emails ?? []).entries()) {
				if (email.subject === undefined)
					ctx.addIssue({
						code: 'custom',
						path: ['emails', index, 'subject'],
						message: 'subject is required.',
					});
				if (email.from_name === undefined)
					ctx.addIssue({
						code: 'custom',
						path: ['emails', index, 'from_name'],
						message: 'from_name is required.',
					});
				if (email.from === undefined)
					ctx.addIssue({
						code: 'custom',
						path: ['emails', index, 'from'],
						message: 'from is required.',
					});
			}
		}
		if (value.type === 'ab' && !value.ab_settings)
			ctx.addIssue({
				code: 'custom',
				path: ['ab_settings'],
				message: 'A/B campaigns require ab_settings.',
			});
		if (value.type === 'resend' && !value.resend_settings)
			ctx.addIssue({
				code: 'custom',
				path: ['resend_settings'],
				message: 'Resend campaigns require resend_settings.',
			});
		if (value.type === 'multivariate' && !value.multivariate_settings)
			ctx.addIssue({
				code: 'custom',
				path: ['multivariate_settings'],
				message: 'Multivariate campaigns require multivariate_settings.',
			});
	});

const CampaignUpdateBody = z
	.object({
		name: z.string().min(1).max(255),
		language_id: z.number().int().positive().optional(),
		emails: z.array(CampaignEmailSchema).optional(),
		groups: z.array(MailerLiteIdSchema).optional(),
		segments: z.array(MailerLiteIdSchema).optional(),
		ab_settings: AbSettingsSchema.optional(),
		resend_settings: ResendSettingsSchema.optional(),
		multivariate_settings: CampaignSettingsSchema.optional(),
	})
	.strict();

export const Campaigns = {
	list: defineMailerLiteOperation({
		operation: 'campaigns.list',
		input: z
			.object({
				query: z
					.object({
						'filter[status]': z.enum(['sent', 'draft', 'ready']).optional(),
						'filter[type]': z
							.enum(['regular', 'ab', 'resend', 'rss', 'multivariate', 'all'])
							.optional(),
						'filter[date_from]': z.string().optional(),
						'filter[date_to]': z.string().optional(),
						'filter[folder]': z.number().int().optional(),
						'filter[subject]': z.string().optional(),
						limit: z.number().int().positive().max(100).optional(),
						page: z.number().int().positive().optional(),
					})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: '/campaigns',
			query: input.query,
		}),
	}),
	get: defineMailerLiteOperation({
		operation: 'campaigns.get',
		input: z.object({ campaignId: Identifier }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}`,
		}),
	}),
	create: defineMailerLiteOperation({
		operation: 'campaigns.create',
		input: z.object({ body: CampaignCreateBody }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: '/campaigns',
			body: input.body,
		}),
	}),
	update: defineMailerLiteOperation({
		operation: 'campaigns.update',
		input: z
			.object({ campaignId: Identifier, body: CampaignUpdateBody })
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}`,
			body: input.body,
		}),
	}),
	schedule: defineMailerLiteOperation({
		operation: 'campaigns.schedule',
		input: z
			.object({
				campaignId: Identifier,
				body: z
					.object({
						delivery: z
							.enum(['instant', 'scheduled', 'timezone_based', 'smart_sending'])
							.optional(),
						schedule: z
							.object({
								date: z.string().optional(),
								hours: z.string().optional(),
								minutes: z.string().optional(),
								timezone_id: z.number().int().positive().optional(),
							})
							.strict()
							.optional(),
						resend: z
							.object({
								delivery: z.enum(['day', 'scheduled']).optional(),
								date: z.string().optional(),
								hours: z.string().optional(),
								minutes: z.string().optional(),
								timezone_id: z.number().int().positive().optional(),
							})
							.strict()
							.optional(),
						sending_time_test_schedule: z
							.array(
								z
									.object({
										date: z.string(),
										hours: z.string(),
										minutes: z.string(),
										timezone_id: z.number().int().positive().optional(),
									})
									.strict(),
							)
							.optional(),
					})
					.strict(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/schedule`,
			body: input.body,
		}),
	}),
	cancel: defineMailerLiteOperation({
		operation: 'campaigns.cancel',
		input: z.object({ campaignId: Identifier }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/cancel`,
		}),
	}),
	delete: defineMailerLiteOperation({
		operation: 'campaigns.delete',
		input: z.object({ campaignId: Identifier }).strict(),
		output: MailerLiteNoContentSchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}`,
		}),
	}),
	ecommerceReport: defineMailerLiteOperation({
		operation: 'campaigns.ecommerceReport',
		input: z
			.object({
				campaignId: Identifier,
				query: z.object({ shop_id: z.number().int().positive() }).strict(),
			})
			.strict(),
		output: z
			.object({
				data: z
					.object({
						ecommerce: z
							.object({
								orders_count: z.number(),
								revenue: z.number(),
								average_order_value: z.number(),
								conversion_rate: z.string(),
							})
							.strict(),
						best_performing_email: MailerLiteEntitySchema.nullable(),
					})
					.strict(),
			})
			.strict(),
		request: (input) => ({
			method: 'GET',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/reports/ecommerce`,
			query: input.query,
		}),
	}),
	ecommerceOrders: defineMailerLiteOperation({
		operation: 'campaigns.ecommerceOrders',
		input: z
			.object({
				campaignId: Identifier,
				query: z
					.object({
						shop_id: z.number().int().positive(),
						limit: z.number().int().positive().optional(),
						page: z.number().int().positive().optional(),
					})
					.strict(),
			})
			.strict(),
		output: CampaignOrderReportSchema,
		request: (input) => ({
			method: 'GET',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/reports/ecommerce/orders`,
			query: input.query,
		}),
	}),
	subscriberActivity: defineMailerLiteOperation({
		operation: 'campaigns.subscriberActivity',
		input: z
			.object({
				campaignId: Identifier,
				query: z
					.object({
						'filter[type]': z
							.enum([
								'opened',
								'unopened',
								'clicked',
								'unsubscribed',
								'forwarded',
								'hardbounced',
								'softbounced',
								'junk',
								'sent',
								'social_interaction',
							])
							.optional(),
						'filter[search]': z.string().email().optional(),
						limit: z
							.union([
								z.literal(10),
								z.literal(25),
								z.literal(50),
								z.literal(100),
							])
							.optional(),
						page: z.number().int().positive().optional(),
						sort: z
							.enum([
								'id',
								'clicks_count',
								'opens_count',
								'-id',
								'-clicks_count',
								'-opens_count',
							])
							.optional(),
						include: z.enum(['subscriber', 'subscriber.groups']).optional(),
					})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/reports/subscriber-activity`,
			query: input.query,
		}),
	}),
};

export const Forms = {
	list: defineMailerLiteOperation({
		operation: 'forms.list',
		input: z
			.object({
				type: z.enum(['popup', 'embedded', 'promotion']),
				query: z
					.object({
						limit: z.number().int().positive().optional(),
						page: z.number().int().positive().optional(),
						'filter[name]': z.string().optional(),
						sort: z
							.enum([
								'created_at',
								'name',
								'conversions_count',
								'opens_count',
								'visitors',
								'conversion_rate',
								'last_registration_at',
								'-created_at',
								'-name',
								'-conversions_count',
								'-opens_count',
								'-visitors',
								'-conversion_rate',
								'-last_registration_at',
							])
							.optional(),
					})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/forms/${input.type}`,
			query: input.query,
		}),
	}),
	get: defineMailerLiteOperation({
		operation: 'forms.get',
		input: z.object({ formId: Identifier }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/forms/${encodeURIComponent(input.formId)}`,
		}),
	}),
	update: defineMailerLiteOperation({
		operation: 'forms.update',
		input: z
			.object({
				formId: Identifier,
				body: z
					.object({
						name: z.string().min(1).max(255),
					})
					.strict(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/forms/${encodeURIComponent(input.formId)}`,
			body: input.body,
		}),
	}),
	delete: defineMailerLiteOperation({
		operation: 'forms.delete',
		input: z.object({ formId: Identifier }).strict(),
		output: MailerLiteNoContentSchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/forms/${encodeURIComponent(input.formId)}`,
		}),
	}),
	subscribers: defineMailerLiteOperation({
		operation: 'forms.subscribers',
		input: z
			.object({
				formId: Identifier,
				query: z
					.object({
						'filter[status]': SubscriberStatus.optional(),
						limit: z.number().int().positive().optional(),
						cursor: z.string().optional(),
					})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/forms/${encodeURIComponent(input.formId)}/subscribers`,
			query: input.query,
		}),
	}),
};

export const BrandStyles = {
	list: defineMailerLiteOperation({
		operation: 'brandStyles.list',
		input: EmptyInput,
		output: z
			.object({
				data: z
					.object({
						brand: z
							.object({
								identifier: z.string(),
								name: z.string(),
								font_family: z.string(),
								primary_color: z.string(),
								secondary_color: z.string(),
								heading_color: z.string(),
								text_color: z.string(),
								border_color: z.string(),
								background_color: z.string(),
							})
							.strict()
							.nullable(),
						default: z
							.object({
								identifier: z.string(),
								name: z.string(),
								font_family: z.string(),
								primary_color: z.string(),
								secondary_color: z.string(),
								heading_color: z.string(),
								text_color: z.string(),
								border_color: z.string(),
								background_color: z.string(),
							})
							.strict(),
						presets: z.array(
							z
								.object({
									identifier: z.string(),
									name: z.string(),
									font_family: z.string(),
									primary_color: z.string(),
									secondary_color: z.string(),
									heading_color: z.string(),
									text_color: z.string(),
									border_color: z.string(),
									background_color: z.string(),
								})
								.strict(),
						),
					})
					.strict(),
			})
			.strict(),
		request: () => ({ method: 'GET', url: '/brand-styles' }),
	}),
};

export const Files = {
	list: defineMailerLiteOperation({
		operation: 'files.list',
		input: z
			.object({
				query: z
					.object({
						limit: z.number().int().min(1).max(100).optional(),
						page: z.number().int().positive().optional(),
						'filter[name]': z.string().max(255).optional(),
						'filter[type]': z.enum(['image', 'pdf', 'epub']).optional(),
						sort: z
							.enum([
								'created_at',
								'-created_at',
								'name',
								'-name',
								'size',
								'-size',
							])
							.optional(),
					})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({ method: 'GET', url: '/files', query: input.query }),
	}),
};

export const Timezones = {
	list: defineMailerLiteOperation({
		operation: 'timezones.list',
		input: EmptyInput,
		output: z
			.object({
				data: z.array(
					z
						.object({
							id: z.string(),
							name: z.string(),
							name_for_humans: z.string(),
							offset_name: z.string(),
							offset: z.number(),
						})
						.strict(),
				),
			})
			.strict(),
		request: () => ({ method: 'GET', url: '/timezones' }),
	}),
};

export const CampaignLanguages = {
	list: defineMailerLiteOperation({
		operation: 'campaignLanguages.list',
		input: EmptyInput,
		output: z
			.object({
				data: z.array(
					z
						.object({
							id: z.string(),
							shortcode: z.string(),
							iso639: z.string(),
							name: z.string(),
							direction: z.enum(['ltr', 'rtl']),
						})
						.strict(),
				),
			})
			.strict(),
		request: () => ({ method: 'GET', url: '/campaigns/languages' }),
	}),
};

const WebhookEvent = z.enum([
	'subscriber.created',
	'subscriber.updated',
	'subscriber.unsubscribed',
	'subscriber.added_to_group',
	'subscriber.removed_from_group',
	'subscriber.bounced',
	'subscriber.automation_triggered',
	'subscriber.automation_completed',
	'subscriber.spam_reported',
	'subscriber.deleted',
	'subscriber.active',
	'campaign.sent',
	'campaign.click',
	'campaign.open',
]);
const WebhookPayload = z
	.object({
		name: z.string().optional(),
		events: z.array(WebhookEvent).min(1).optional(),
		url: z.string().url().optional(),
		enabled: z.boolean().optional(),
		batchable: z.boolean().optional(),
	})
	.strict();
const WebhookCreatePayload = WebhookPayload.extend({
	events: z.array(WebhookEvent).min(1),
	url: z.string().url(),
}).strict();
const requiresBatching = (events: z.infer<typeof WebhookEvent>[]) =>
	events.some((event) =>
		['subscriber.deleted', 'campaign.open', 'campaign.click'].includes(event),
	);

export const Webhooks = {
	list: defineMailerLiteOperation({
		operation: 'webhooks.list',
		input: EmptyInput,
		output: MailerLiteListResponseSchema,
		request: () => ({ method: 'GET', url: '/webhooks' }),
	}),
	get: defineMailerLiteOperation({
		operation: 'webhooks.get',
		input: z.object({ webhookId: Identifier }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/webhooks/${encodeURIComponent(input.webhookId)}`,
		}),
	}),
	create: defineMailerLiteOperation({
		operation: 'webhooks.create',
		input: z
			.object({ body: WebhookCreatePayload })
			.strict()
			.superRefine((value, ctx) => {
				if (
					requiresBatching(value.body.events) &&
					value.body.batchable !== true
				) {
					ctx.addIssue({
						code: 'custom',
						path: ['body', 'batchable'],
						message: 'These webhook events require batchable: true.',
					});
				}
			}),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: '/webhooks',
			body: input.body,
		}),
	}),
	update: defineMailerLiteOperation({
		operation: 'webhooks.update',
		input: z
			.object({ webhookId: Identifier, body: WebhookPayload })
			.strict()
			.superRefine((value, ctx) => {
				if (
					value.body.events !== undefined &&
					requiresBatching(value.body.events) &&
					value.body.batchable !== true
				) {
					ctx.addIssue({
						code: 'custom',
						path: ['body', 'batchable'],
						message: 'These webhook events require batchable: true.',
					});
				}
			}),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/webhooks/${encodeURIComponent(input.webhookId)}`,
			body: input.body,
		}),
	}),
	delete: defineMailerLiteOperation({
		operation: 'webhooks.delete',
		input: z.object({ webhookId: Identifier }).strict(),
		output: MailerLiteNoContentSchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/webhooks/${encodeURIComponent(input.webhookId)}`,
		}),
	}),
};
