import { z } from 'zod';
import { defineMailerLiteOperation } from './operation';
import {
	MailerLiteEntityResponseSchema,
	MailerLiteIdSchema,
	MailerLiteListResponseSchema,
	MailerLiteNoContentSchema,
} from './types';

const Id = z.string().min(1);
const Empty = z.object({}).strict();
const EntityList = z
	.object({ data: z.array(z.object({ id: MailerLiteIdSchema }).passthrough()) })
	.passthrough();
// Some report payloads have documented operation-specific keys, not resource IDs;
// preserve those provider-defined report objects rather than inventing fields.
const ReportObject = z
	.object({ data: z.object({}).passthrough() })
	.passthrough();
const ReportRows = z
	.object({ data: z.array(z.object({}).passthrough()) })
	.passthrough();
const DateRange = z
	.object({
		start_date: z.string().optional(),
		end_date: z.string().optional(),
		shop_id: z.string().optional(),
	})
	.strict()
	.superRefine((query, ctx) => {
		if ((query.start_date === undefined) !== (query.end_date === undefined)) {
			ctx.addIssue({
				code: 'custom',
				message: 'start_date and end_date must be sent together.',
			});
		}
	});

const FilterActivity = z
	.object({
		status: z.enum(['active', 'completed', 'canceled', 'failed']),
		date_from: z.string().optional(),
		date_to: z.string().optional(),
		scheduled_from: z.string().optional(),
		scheduled_to: z.string().optional(),
		search: z.string().optional(),
	})
	.strict();

const TriggerData = z.union([
	z
		.object({
			group_ids: z.array(MailerLiteIdSchema).min(1),
			exclude_group_ids: z.array(MailerLiteIdSchema).optional(),
		})
		.strict(),
	z.object({ segment_id: MailerLiteIdSchema }).strict(),
	z.object({ link: z.string().url() }).strict(),
	z.object({ form_type: z.string(), form_id: MailerLiteIdSchema }).strict(),
	z
		.object({
			field_id: z.union([MailerLiteIdSchema, z.literal('email')]),
			field_operator: z.string(),
			value: z.union([z.string(), z.number(), z.boolean()]).optional(),
		})
		.strict(),
	z
		.object({
			field_id: MailerLiteIdSchema,
			group_ids: z.array(MailerLiteIdSchema).min(1),
			exclude_group_ids: z.array(MailerLiteIdSchema).optional(),
			send_hour: z.string(),
			send_minute: z.string(),
			start_before_time: z.number().int().positive().optional(),
			start_before_time_unit: z.enum(['day', 'month']).optional(),
			start_after_time: z.number().int().positive().optional(),
			start_after_time_unit: z.enum(['day', 'month']).optional(),
			use_timezone: z.enum(['account', 'subscriber', 'custom']).optional(),
			timezone_id: z.number().int().positive().optional(),
		})
		.strict(),
	z.object({}).strict(),
	z.object({ ecommerce_shop_id: MailerLiteIdSchema }).strict(),
	z
		.object({
			ecommerce_shop_id: MailerLiteIdSchema,
			ecommerce_category_id: MailerLiteIdSchema,
		})
		.strict(),
	z
		.object({
			ecommerce_shop_id: MailerLiteIdSchema,
			ecommerce_product_id: MailerLiteIdSchema,
			variation_ids: z.array(MailerLiteIdSchema).optional(),
		})
		.strict(),
	z
		.object({
			ecommerce_shop_id: MailerLiteIdSchema,
			unit: z.enum(['hours', 'days', 'weeks', 'months']),
			value: z.number().int().min(1),
		})
		.strict(),
	z
		.object({
			ecommerce_shop_id: MailerLiteIdSchema,
			interval: z.number().int().min(1),
			value: z.number().int().min(1),
			unit: z.string(),
			order_cap: z.number().int().min(1).optional(),
		})
		.strict(),
]);

const TriggerType = z.enum([
	'subscriber_joins_group',
	'subscriber_joins_segment',
	'clicks_link',
	'form_completed',
	'field_updated',
	'anniversary',
	'exact_date',
	'manual',
	'purchased_any_product',
	'purchased_from_category',
	'purchased_specific_product',
	'abandoned_cart',
	'abandoned_checkout',
	'purchase_frequency',
]);

const TriggerCreateBody = z
	.object({ type: TriggerType, data: TriggerData.optional() })
	.strict()
	.superRefine((trigger, ctx) => {
		if (trigger.data === undefined) return;
		const keys = Object.keys(trigger.data);
		const has = (key: string) => keys.includes(key);
		const matches =
			trigger.type === 'subscriber_joins_group'
				? has('group_ids') && !has('send_hour')
				: trigger.type === 'subscriber_joins_segment'
					? has('segment_id')
					: trigger.type === 'clicks_link'
						? has('link')
						: trigger.type === 'form_completed'
							? has('form_type') && has('form_id')
							: trigger.type === 'field_updated'
								? has('field_operator')
								: trigger.type === 'anniversary' ||
										trigger.type === 'exact_date'
									? has('send_hour') && has('field_id')
									: trigger.type === 'manual'
										? keys.length === 0
										: trigger.type === 'purchased_any_product'
											? has('ecommerce_shop_id') && !has('unit')
											: trigger.type === 'purchased_from_category'
												? has('ecommerce_category_id')
												: trigger.type === 'purchased_specific_product'
													? has('ecommerce_product_id')
													: trigger.type === 'abandoned_cart' ||
															trigger.type === 'abandoned_checkout'
														? has('unit') && has('value') && !has('interval')
														: has('interval') && has('order_cap');
		if (!matches) {
			ctx.addIssue({
				code: 'custom',
				path: ['data'],
				message: `data fields do not match trigger type ${trigger.type}.`,
			});
		}
	});
const RepeatableSettings = z
	.object({
		mode: z.string(),
		value: z.number().int().positive(),
		unit: z.string(),
	})
	.strict();
const TriggerSettings = z
	.object({
		repeatable: z.boolean().optional(),
		repeatable_settings: RepeatableSettings.optional(),
		track_ecommerce: z.boolean().optional(),
	})
	.strict();

const TextNode = z
	.object({
		type: z.literal('text'),
		text: z.string(),
		marks: z
			.array(
				z
					.object({
						type: z.string(),
						attrs: z
							.object({ href: z.string().optional() })
							.strict()
							.optional(),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();
const StepCondition = z
	.object({
		type: z.enum([
			'campaign_activity',
			'workflow_activity',
			'custom_fields',
			'group_membership',
			'segment_membership',
		]),
		campaign_id: MailerLiteIdSchema.optional(),
		email_id: MailerLiteIdSchema.optional(),
		action: z.string().optional(),
		link_id: MailerLiteIdSchema.optional(),
		field_id: z.union([MailerLiteIdSchema, z.literal('email')]).optional(),
		action_value: z.string().optional(),
		group_id: MailerLiteIdSchema.optional(),
		segment_id: MailerLiteIdSchema.optional(),
	})
	.strict()
	.superRefine((rule, ctx) => {
		if (rule.type === 'campaign_activity') {
			if (rule.campaign_id === undefined)
				ctx.addIssue({
					code: 'custom',
					path: ['campaign_id'],
					message: 'campaign_id is required.',
				});
			if (rule.action === undefined)
				ctx.addIssue({
					code: 'custom',
					path: ['action'],
					message: 'action is required.',
				});
		}
		if (rule.type === 'workflow_activity') {
			if (rule.email_id === undefined)
				ctx.addIssue({
					code: 'custom',
					path: ['email_id'],
					message: 'email_id is required.',
				});
			if (rule.action === undefined)
				ctx.addIssue({
					code: 'custom',
					path: ['action'],
					message: 'action is required.',
				});
		}
		if (rule.type === 'custom_fields') {
			if (rule.field_id === undefined)
				ctx.addIssue({
					code: 'custom',
					path: ['field_id'],
					message: 'field_id is required.',
				});
			if (rule.action === undefined)
				ctx.addIssue({
					code: 'custom',
					path: ['action'],
					message: 'action is required.',
				});
		}
		if (rule.type === 'group_membership' && rule.group_id === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['group_id'],
				message: 'group_id is required.',
			});
		}
		if (rule.type === 'segment_membership' && rule.segment_id === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['segment_id'],
				message: 'segment_id is required.',
			});
		}
	});

const StepAction = z.discriminatedUnion('action_type', [
	z
		.object({
			action_type: z.literal('copy_to_group'),
			group_ids: z.array(MailerLiteIdSchema).min(1),
		})
		.strict(),
	z
		.object({
			action_type: z.literal('remove_from_group'),
			group_ids: z.array(MailerLiteIdSchema).min(1),
		})
		.strict(),
	z
		.object({
			action_type: z.literal('move_to_group'),
			from_group_ids: z.array(MailerLiteIdSchema).min(1),
			to_group_ids: z.array(MailerLiteIdSchema).min(1),
		})
		.strict(),
	z.object({ action_type: z.literal('mark_as_unsubscribed') }).strict(),
	z
		.object({
			action_type: z.literal('go_to_step'),
			go_to_step_id: MailerLiteIdSchema,
			go_to_step_type: z.string(),
		})
		.strict(),
	z
		.object({
			action_type: z.literal('update_custom_field'),
			field_id: MailerLiteIdSchema,
			date_operation: z.string().optional(),
			number_operation: z.string().optional(),
			value: z.string().optional(),
		})
		.strict(),
	z
		.object({
			action_type: z.literal('send_internal_email_notification'),
			from: z.string().email(),
			from_name: z.string().max(255),
			reply_to: z.string().email(),
			subject: z.string().max(255),
			message: z.string().max(500),
			recipients: z.array(z.string().email()).min(1).max(5),
			fields: z.array(MailerLiteIdSchema).max(20).optional(),
		})
		.strict(),
]);

const SimpleDelay = z
	.object({
		unit: z.enum(['minutes', 'hours', 'days', 'weeks', 'months']),
		value: z.number().int().min(1),
	})
	.strict();
const ScheduledDelay = z
	.object({
		unit: z.enum([
			'next',
			'next_weekday',
			'next_monthday',
			'next_date',
			'subscriber_field',
		]),
		hour: z.string().regex(/^(?:[01]\d|2[0-3])$/),
		minute: z.enum(['00', '15', '30', '45']),
		use_timezone: z.enum(['account', 'subscriber', 'custom']),
		timezone_id: z.number().int().positive().optional(),
		week_days: z
			.array(z.enum(['1', '2', '3', '4', '5', '6', '7']))
			.min(1)
			.optional(),
		month_day: z
			.union([z.string().regex(/^(?:[1-9]|[12]\d|3[01])$/), z.literal('last')])
			.optional(),
		date: z.string().optional(),
		field_id: MailerLiteIdSchema.optional(),
		action_on_date_elapsed: z
			.enum(['stop', 'move_to_next_step', 'move_to_step'])
			.optional(),
		go_to_step_id: MailerLiteIdSchema.optional(),
		go_to_step_type: z.string().optional(),
	})
	.strict();

const StepData = z.union([
	z
		.object({
			name: z.string().max(255).optional(),
			subject: z.string().max(255).optional(),
			from: z.string().email(),
			from_name: z.string().max(255),
			reply_to: z.string().email(),
			email_id: MailerLiteIdSchema.optional(),
			language_id: z.number().int().positive().optional(),
			google_analytics: z.boolean().optional(),
			track_opens: z.boolean().optional(),
			preheader: z.string().max(998).optional(),
		})
		.strict(),
	SimpleDelay,
	ScheduledDelay,
	z
		.object({
			conditions: z.array(StepCondition).min(1).max(5),
			matching_type: z.enum(['any', 'all']).optional(),
			yes_step_id: MailerLiteIdSchema.optional(),
			no_step_id: MailerLiteIdSchema.optional(),
		})
		.strict(),
	z
		.object({
			split_percentages: z
				.array(
					z
						.object({
							label: z.string(),
							path: z.enum(['a_path', 'b_path', 'c_path']),
							value: z.number().int().min(0).max(100),
						})
						.strict(),
				)
				.min(2)
				.max(3),
			name: z.string().optional(),
			a_path_step_id: MailerLiteIdSchema.optional(),
			b_path_step_id: MailerLiteIdSchema.optional(),
			c_path_step_id: MailerLiteIdSchema.optional(),
			ab_test_winner: z.enum(['a_path', 'b_path', 'c_path']).optional(),
		})
		.strict(),
	z
		.object({
			url: z.string().url().max(2048),
			secret: z.string().min(5).max(255),
			webhook_id: MailerLiteIdSchema.optional(),
		})
		.strict(),
	StepAction,
]);

const StepPlacement = z
	.object({
		position: z.enum(['start', 'end', 'before', 'after']),
		block_id: MailerLiteIdSchema.optional(),
	})
	.strict();
const StepCreateBody = z
	.object({
		type: z.enum([
			'email',
			'delay',
			'condition',
			'abtest',
			'webhook',
			'action',
		]),
		parent_id: MailerLiteIdSchema.optional(),
		append: z.boolean().optional(),
		branch: z.enum(['yes', 'no', 'a_path', 'b_path', 'c_path']).optional(),
		move_to_branch: z.enum(['yes', 'no']).optional(),
		data: StepData.optional(),
	})
	.strict()
	.superRefine((value, ctx) => {
		if (value.parent_id !== undefined && value.append === true)
			ctx.addIssue({
				code: 'custom',
				message: 'parent_id and append cannot be sent together.',
			});
		if (value.data === undefined) return;
		const keys = Object.keys(value.data);
		const dataMatchesType =
			value.type === 'email'
				? keys.includes('from') && keys.includes('reply_to')
				: value.type === 'delay'
					? keys.includes('unit')
					: value.type === 'condition'
						? keys.includes('conditions')
						: value.type === 'abtest'
							? keys.includes('split_percentages')
							: value.type === 'webhook'
								? keys.includes('url') && keys.includes('secret')
								: keys.includes('action_type');
		if (!dataMatchesType) {
			ctx.addIssue({
				code: 'custom',
				path: ['data'],
				message: `data fields do not match step type ${value.type}.`,
			});
		}
	});

const SubscriberRunFilter = z
	.object({
		status: z.enum(['active', 'completed', 'canceled', 'failed']),
		id: z.array(MailerLiteIdSchema).optional(),
		step: MailerLiteIdSchema.optional(),
		search: z.string().optional(),
		date_from: z.string().optional(),
		date_to: z.string().optional(),
		scheduled_from: z.string().optional(),
		scheduled_to: z.string().optional(),
		next_step: MailerLiteIdSchema.optional(),
		current_step: MailerLiteIdSchema.optional(),
	})
	.strict();

export const Automations = {
	list: defineMailerLiteOperation({
		operation: 'automations.list',
		input: z
			.object({
				query: z
					.object({
						'filter[folder]': z.number().int().optional(),
						'filter[group]': z.number().int().optional(),
						'filter[enabled]': z.enum(['true', 'false', '1', '0']).optional(),
						'filter[status]': z.enum(['true', 'false']).optional(),
						'filter[name]': z.string().optional(),
						'filter[automation_state]': z
							.enum(['workflows', 'drafts'])
							.optional(),
						'filter[drafts_state]': z
							.enum(['complete_workflow', 'broken_workflow'])
							.optional(),
						sort: z.string().optional(),
						with_steps: z.enum(['true', 'false', '1', '0']).optional(),
						page: z.number().int().positive().optional(),
						limit: z.number().int().positive().optional(),
					})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: '/automations',
			query: input.query,
		}),
	}),
	get: defineMailerLiteOperation({
		operation: 'automations.get',
		input: z
			.object({
				automationId: Id,
				query: z
					.object({ include: z.literal('flow').optional() })
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}`,
			query: input.query,
		}),
	}),
	activity: defineMailerLiteOperation({
		operation: 'automations.activity',
		input: z
			.object({
				automationId: Id,
				query: z
					.object({
						'filter[status]': z.enum([
							'completed',
							'active',
							'canceled',
							'failed',
						]),
						'filter[date_from]': z.string().optional(),
						'filter[date_to]': z.string().optional(),
						'filter[scheduled_from]': z.string().optional(),
						'filter[scheduled_to]': z.string().optional(),
						'filter[search]': z.string().optional(),
						with_subscribers: z.boolean().optional(),
						sort: z.string().optional(),
						page: z.number().int().positive().optional(),
						limit: z.number().int().positive().max(2000).optional(),
					})
					.strict(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/activity`,
			query: input.query,
		}),
	}),
	create: defineMailerLiteOperation({
		operation: 'automations.create',
		input: z
			.object({ body: z.object({ name: z.string().min(1).max(255) }).strict() })
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: '/automations',
			body: input.body,
		}),
	}),
	update: defineMailerLiteOperation({
		operation: 'automations.update',
		riskLevel: 'destructive',
		input: z
			.object({
				automationId: Id,
				body: z
					.object({
						name: z.string().max(255).optional(),
						enabled: z.boolean().optional(),
						trigger_data: TriggerSettings.optional(),
						triggers: z.array(TriggerCreateBody).max(3).optional(),
					})
					.strict(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/automations/${encodeURIComponent(input.automationId)}`,
			body: input.body,
		}),
	}),
	copy: defineMailerLiteOperation({
		operation: 'automations.copy',
		input: z.object({ automationId: Id }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/automations/${encodeURIComponent(input.automationId)}/copy`,
		}),
	}),
	enable: defineMailerLiteOperation({
		operation: 'automations.enable',
		input: z.object({ automationId: Id }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/automations/${encodeURIComponent(input.automationId)}/enable`,
		}),
	}),
	disable: defineMailerLiteOperation({
		operation: 'automations.disable',
		input: z.object({ automationId: Id }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/automations/${encodeURIComponent(input.automationId)}/disable`,
		}),
	}),
	test: defineMailerLiteOperation({
		operation: 'automations.test',
		input: z
			.object({
				automationId: Id,
				body: z.object({ email: z.string().email() }).strict(),
			})
			.strict(),
		output: z
			.object({
				data: z
					.object({
						queued: z.array(
							z
								.object({
									step_id: MailerLiteIdSchema,
									email_id: MailerLiteIdSchema,
									subject: z.string(),
								})
								.strict(),
						),
						skipped: z.array(
							z
								.object({
									step_id: MailerLiteIdSchema,
									subject: z.string(),
									reason: z.enum(['not_eligible_for_sending', 'not_designed']),
								})
								.strict(),
						),
					})
					.strict(),
			})
			.strict(),
		request: (input) => ({
			method: 'POST',
			url: `/automations/${encodeURIComponent(input.automationId)}/test`,
			body: input.body,
		}),
	}),
	addSubscribers: defineMailerLiteOperation({
		operation: 'automations.addSubscribers',
		input: z
			.object({
				automationId: Id,
				body: z
					.object({
						emails: z.array(z.string().email()).max(5000).optional(),
						groups: z.array(MailerLiteIdSchema).max(100).optional(),
						step_id: MailerLiteIdSchema.optional(),
					})
					.strict()
					.refine(
						(value) => value.emails !== undefined || value.groups !== undefined,
						'Provide emails or groups.',
					),
			})
			.strict(),
		output: MailerLiteNoContentSchema,
		request: (input) => ({
			method: 'POST',
			url: `/automations/${encodeURIComponent(input.automationId)}/add-subscribers`,
			body: input.body,
		}),
	}),
	readd: defineMailerLiteOperation({
		operation: 'automations.readd',
		input: z
			.object({
				automationId: Id,
				body: z
					.object({
						readd_subscribers_to: z.enum([
							'last_completed_step',
							'last_failed_step',
							'selected_step',
						]),
						selected_step_id: MailerLiteIdSchema.optional(),
						filter: z
							.object({
								status: z.enum(['completed', 'canceled', 'failed']),
								id: z.array(MailerLiteIdSchema).optional(),
								step: MailerLiteIdSchema.optional(),
								search: z.string().optional(),
								date_from: z.string().optional(),
								date_to: z.string().optional(),
							})
							.strict(),
					})
					.strict(),
			})
			.strict(),
		output: MailerLiteNoContentSchema,
		request: (input) => ({
			method: 'POST',
			url: `/automations/${encodeURIComponent(input.automationId)}/readd`,
			body: input.body,
		}),
	}),
	addToGroup: defineMailerLiteOperation({
		operation: 'automations.addToGroup',
		input: z
			.object({
				automationId: Id,
				body: z
					.object({
						destination_groups: z.array(MailerLiteIdSchema).min(1),
						filter: z
							.object({
								status: z.enum(['active', 'completed', 'canceled']),
								id: z.array(MailerLiteIdSchema).optional(),
								search: z.string().optional(),
								reason: z.string().optional(),
								date_from: z.string().optional(),
								date_to: z.string().optional(),
								scheduled_from: z.string().optional(),
								scheduled_to: z.string().optional(),
								next_step: MailerLiteIdSchema.optional(),
								current_step: MailerLiteIdSchema.optional(),
							})
							.strict(),
					})
					.strict(),
			})
			.strict(),
		output: MailerLiteNoContentSchema,
		request: (input) => ({
			method: 'POST',
			url: `/automations/${encodeURIComponent(input.automationId)}/activity/add-to-group`,
			body: input.body,
		}),
	}),
	cancelRuns: defineMailerLiteOperation({
		operation: 'automations.cancelRuns',
		input: z
			.object({
				automationId: Id,
				body: z
					.object({
						filter: SubscriberRunFilter.extend({
							status: z.literal('active'),
						}).strict(),
					})
					.strict(),
			})
			.strict(),
		output: MailerLiteNoContentSchema,
		request: (input) => ({
			method: 'POST',
			url: `/automations/${encodeURIComponent(input.automationId)}/activity/cancel-automation`,
			body: input.body,
		}),
	}),
	skipDelay: defineMailerLiteOperation({
		operation: 'automations.skipDelay',
		input: z
			.object({
				automationId: Id,
				body: z
					.object({
						filter: SubscriberRunFilter.extend({
							status: z.literal('active'),
						}).strict(),
					})
					.strict(),
			})
			.strict(),
		output: MailerLiteNoContentSchema,
		request: (input) => ({
			method: 'POST',
			url: `/automations/${encodeURIComponent(input.automationId)}/activity/skip-delay`,
			body: input.body,
		}),
	}),
	delete: defineMailerLiteOperation({
		operation: 'automations.delete',
		input: z.object({ automationId: Id }).strict(),
		output: MailerLiteNoContentSchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/automations/${encodeURIComponent(input.automationId)}`,
		}),
	}),
};

export const AutomationSteps = {
	list: defineMailerLiteOperation({
		operation: 'automationSteps.list',
		input: z.object({ automationId: Id }).strict(),
		output: ReportRows,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/steps/index`,
		}),
	}),
	get: defineMailerLiteOperation({
		operation: 'automationSteps.get',
		input: z.object({ automationId: Id, stepId: Id }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/steps/${encodeURIComponent(input.stepId)}`,
		}),
	}),
	create: defineMailerLiteOperation({
		operation: 'automationSteps.create',
		input: z.object({ automationId: Id, body: StepCreateBody }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/automations/${encodeURIComponent(input.automationId)}/steps`,
			body: input.body,
		}),
	}),
	update: defineMailerLiteOperation({
		operation: 'automationSteps.update',
		input: z
			.object({
				automationId: Id,
				stepId: Id,
				body: z
					.object({
						parent_id: MailerLiteIdSchema.optional(),
						data: StepData.optional(),
						reschedule_waiting_subscribers: z.boolean().optional(),
					})
					.strict(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/automations/${encodeURIComponent(input.automationId)}/steps/${encodeURIComponent(input.stepId)}`,
			body: input.body,
		}),
	}),
	delete: defineMailerLiteOperation({
		operation: 'automationSteps.delete',
		input: z
			.object({
				automationId: Id,
				stepId: Id,
				query: z
					.object({
						branch_to_delete: z
							.enum(['all', 'yes', 'no', 'a_path', 'b_path', 'c_path'])
							.optional(),
						branch_to_keep: z
							.enum(['yes', 'no', 'a_path', 'b_path', 'c_path'])
							.optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.refine(
				(value) =>
					value.query?.branch_to_delete === undefined ||
					value.query.branch_to_keep === undefined,
				'branch_to_delete and branch_to_keep cannot both be set.',
			),
		output: MailerLiteNoContentSchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/automations/${encodeURIComponent(input.automationId)}/steps/${encodeURIComponent(input.stepId)}`,
			query: input.query,
		}),
	}),
	copy: defineMailerLiteOperation({
		operation: 'automationSteps.copy',
		input: z
			.object({
				automationId: Id,
				stepId: Id,
				body: z
					.object({
						parent_id: MailerLiteIdSchema.optional(),
						branch: z
							.enum(['yes', 'no', 'a_path', 'b_path', 'c_path'])
							.optional(),
						move_to_branch: z.enum(['yes', 'no']).optional(),
					})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/automations/${encodeURIComponent(input.automationId)}/steps/${encodeURIComponent(input.stepId)}/copy`,
			body: input.body,
		}),
	}),
	reorder: defineMailerLiteOperation({
		operation: 'automationSteps.reorder',
		input: z
			.object({
				automationId: Id,
				body: z
					.object({
						dragged_step_id: MailerLiteIdSchema.optional(),
						step_ids: z.array(MailerLiteIdSchema).max(50).optional(),
						new_parent_step_id: MailerLiteIdSchema.optional(),
						branch: z
							.enum(['yes', 'no', 'a_path', 'b_path', 'c_path'])
							.optional(),
						branch_for_child: z.enum(['yes', 'no']).optional(),
					})
					.strict()
					.refine(
						(value) =>
							(value.dragged_step_id !== undefined) !==
							(value.step_ids !== undefined),
						'Provide exactly one of dragged_step_id or step_ids.',
					),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/automations/${encodeURIComponent(input.automationId)}/steps/reorder`,
			body: input.body,
		}),
	}),
	selectWinner: defineMailerLiteOperation({
		operation: 'automationSteps.selectWinner',
		input: z
			.object({
				automationId: Id,
				stepId: Id,
				body: z
					.object({ ab_test_winner: z.enum(['a_path', 'b_path', 'c_path']) })
					.strict(),
			})
			.strict(),
		output: ReportObject,
		request: (input) => ({
			method: 'PUT',
			url: `/automations/${encodeURIComponent(input.automationId)}/steps/${encodeURIComponent(input.stepId)}/select-ab-test-winner`,
			body: input.body,
		}),
	}),
};

export const AutomationTriggers = {
	list: defineMailerLiteOperation({
		operation: 'automationTriggers.list',
		input: z.object({ automationId: Id }).strict(),
		output: ReportRows,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/triggers`,
		}),
	}),
	get: defineMailerLiteOperation({
		operation: 'automationTriggers.get',
		input: z.object({ automationId: Id, triggerId: Id }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/triggers/${encodeURIComponent(input.triggerId)}`,
		}),
	}),
	create: defineMailerLiteOperation({
		operation: 'automationTriggers.create',
		input: z.object({ automationId: Id, body: TriggerCreateBody }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/automations/${encodeURIComponent(input.automationId)}/triggers`,
			body: input.body,
		}),
	}),
	update: defineMailerLiteOperation({
		operation: 'automationTriggers.update',
		input: z
			.object({
				automationId: Id,
				triggerId: Id,
				body: z.object({ data: TriggerData.optional() }).strict(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/automations/${encodeURIComponent(input.automationId)}/triggers/${encodeURIComponent(input.triggerId)}`,
			body: input.body,
		}),
	}),
	delete: defineMailerLiteOperation({
		operation: 'automationTriggers.delete',
		input: z.object({ automationId: Id, triggerId: Id }).strict(),
		output: MailerLiteNoContentSchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/automations/${encodeURIComponent(input.automationId)}/triggers/${encodeURIComponent(input.triggerId)}`,
		}),
	}),
};

export const AutomationTemplates = {
	list: defineMailerLiteOperation({
		operation: 'automationTemplates.list',
		input: z
			.object({
				query: z
					.object({
						'filter[type]': z
							.enum([
								'welcome',
								'date',
								'event',
								'feedback',
								'promotion',
								'reminder',
							])
							.optional(),
						'filter[category]': z.number().int().positive().optional(),
						limit: z.number().int().positive().optional(),
						page: z.number().int().positive().optional(),
					})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: '/automation-templates',
			query: input.query,
		}),
	}),
	createFromTemplate: defineMailerLiteOperation({
		operation: 'automationTemplates.createFromTemplate',
		input: z.object({ templateId: Id }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/automations/select-template/${encodeURIComponent(input.templateId)}`,
		}),
	}),
};

const RunCountArray = z
	.object({
		data: z.array(
			z
				.object({
					step_id: MailerLiteIdSchema,
					completed_step_runs: z.number(),
					in_queue_step_runs: z.number(),
				})
				.strict(),
		),
	})
	.strict();
const RunCount = z
	.object({
		data: z
			.object({
				step_id: MailerLiteIdSchema.optional(),
				completed_step_runs: z.number().optional(),
				in_queue_step_runs: z.number().optional(),
				completed_runs: z.number().optional(),
				queued_runs: z.number().optional(),
			})
			.strict(),
	})
	.strict();
const ActivitySubscriberQuery = z
	.object({
		status: z.enum(['queued', 'completed']),
		limit: z.number().int().min(1).max(1000).optional(),
		page: z.number().int().positive().optional(),
		sort: z.string().optional(),
		'filter[date_from]': z.string().optional(),
		'filter[date_to]': z.string().optional(),
		'filter[search]': z.string().email().optional(),
		'filter[id]': z.union([z.string(), z.array(MailerLiteIdSchema)]).optional(),
	})
	.strict();

export const AutomationReports = {
	stepRunCounts: defineMailerLiteOperation({
		operation: 'automationReports.stepRunCounts',
		input: z.object({ automationId: Id }).strict(),
		output: RunCountArray,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/steps/run-counts`,
		}),
	}),
	stepRunCount: defineMailerLiteOperation({
		operation: 'automationReports.stepRunCount',
		input: z.object({ automationId: Id, stepId: Id }).strict(),
		output: RunCount,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/steps/run-counts/${encodeURIComponent(input.stepId)}`,
		}),
	}),
	triggerRunCounts: defineMailerLiteOperation({
		operation: 'automationReports.triggerRunCounts',
		input: z.object({ automationId: Id }).strict(),
		output: ReportObject,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/triggers/run-counts`,
		}),
	}),
	triggerRunCount: defineMailerLiteOperation({
		operation: 'automationReports.triggerRunCount',
		input: z.object({ automationId: Id, triggerId: Id }).strict(),
		output: ReportObject,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/triggers/run-counts/${encodeURIComponent(input.triggerId)}`,
		}),
	}),
	abStepStats: defineMailerLiteOperation({
		operation: 'automationReports.abStepStats',
		input: z.object({ automationId: Id }).strict(),
		output: ReportRows,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/ab-steps-stats`,
		}),
	}),
	abStepStat: defineMailerLiteOperation({
		operation: 'automationReports.abStepStat',
		input: z.object({ automationId: Id, stepId: Id }).strict(),
		output: ReportObject,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/ab-steps-stats/${encodeURIComponent(input.stepId)}`,
		}),
	}),
	stepSubscribers: defineMailerLiteOperation({
		operation: 'automationReports.stepSubscribers',
		input: z
			.object({ automationId: Id, stepId: Id, query: ActivitySubscriberQuery })
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/activity/steps/${encodeURIComponent(input.stepId)}/subscribers`,
			query: {
				...input.query,
				'filter[id]': Array.isArray(input.query['filter[id]'])
					? input.query['filter[id]'].map(String).join(',')
					: input.query['filter[id]'],
			},
		}),
	}),
	triggerSubscribers: defineMailerLiteOperation({
		operation: 'automationReports.triggerSubscribers',
		input: z
			.object({
				automationId: Id,
				triggerId: Id,
				query: ActivitySubscriberQuery,
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/activity/triggers/${encodeURIComponent(input.triggerId)}/subscribers`,
			query: {
				...input.query,
				'filter[id]': Array.isArray(input.query['filter[id]'])
					? input.query['filter[id]'].map(String).join(',')
					: input.query['filter[id]'],
			},
		}),
	}),
	orders: defineMailerLiteOperation({
		operation: 'automationReports.orders',
		input: z
			.object({
				automationId: Id,
				query: z
					.object({
						time_frame: z.enum([
							'week',
							'month',
							'two_months',
							'three_months',
							'six_months',
							'year',
							'last_year',
							'all_time',
							'custom',
						]),
						time_frame_start: z.string().optional(),
						time_frame_end: z.string().optional(),
						ecommerce_shop_id: MailerLiteIdSchema.optional(),
						limit: z.number().int().positive().max(100).optional(),
						page: z.number().int().positive().optional(),
					})
					.strict(),
			})
			.strict(),
		output: ReportRows,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/order-activity`,
			query: input.query,
		}),
	}),
	emailTotals: defineMailerLiteOperation({
		operation: 'automationReports.emailTotals',
		input: z.object({ automationId: Id, query: DateRange.optional() }).strict(),
		output: ReportObject,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/monthly-totals/email`,
			query: input.query,
		}),
	}),
	ecommerceTotals: defineMailerLiteOperation({
		operation: 'automationReports.ecommerceTotals',
		input: z.object({ automationId: Id, query: DateRange.optional() }).strict(),
		output: ReportObject,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/monthly-totals/ecommerce`,
			query: input.query,
		}),
	}),
};

export const AutomationEmails = {
	getContent: defineMailerLiteOperation({
		operation: 'automationEmails.getContent',
		input: z.object({ automationId: Id, emailId: Id }).strict(),
		output: z
			.object({ data: z.object({ html: z.string() }).strict() })
			.strict(),
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/emails/${encodeURIComponent(input.emailId)}/content`,
		}),
	}),
	setContent: defineMailerLiteOperation({
		operation: 'automationEmails.setContent',
		input: z
			.object({
				automationId: Id,
				emailId: Id,
				body: z.object({ html: z.string() }).strict(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/automations/${encodeURIComponent(input.automationId)}/emails/${encodeURIComponent(input.emailId)}/content`,
			body: input.body,
		}),
	}),
	stats: defineMailerLiteOperation({
		operation: 'automationEmails.stats',
		input: z
			.object({ automationId: Id, emailId: Id, query: DateRange.optional() })
			.strict(),
		output: ReportObject,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/emails/${encodeURIComponent(input.emailId)}/report-stats`,
			query: input.query,
		}),
	}),
	ecommerceStats: defineMailerLiteOperation({
		operation: 'automationEmails.ecommerceStats',
		input: z
			.object({ automationId: Id, emailId: Id, query: DateRange.optional() })
			.strict(),
		output: ReportObject,
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/emails/${encodeURIComponent(input.emailId)}/ecommerce-overview-stats`,
			query: input.query,
		}),
	}),
	unsubscribeReasons: defineMailerLiteOperation({
		operation: 'automationEmails.unsubscribeReasons',
		input: z.object({ automationId: Id, emailId: Id }).strict(),
		output: z
			.object({
				data: z.array(
					z
						.object({
							label: z.string(),
							count: z.number(),
							percentage: z.number(),
						})
						.strict(),
				),
			})
			.strict(),
		request: (input) => ({
			method: 'GET',
			url: `/automations/${encodeURIComponent(input.automationId)}/emails/${encodeURIComponent(input.emailId)}/unsubscribe-reasons`,
		}),
	}),
};
