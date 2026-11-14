import { z } from 'zod';
import { routeIds } from './routes';

const QueryValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.array(z.union([z.string(), z.number(), z.boolean()])),
]);

const DOCUMENTED_PARAMETER_NAMES = new Set([
	'accepted',
	'answers',
	'base',
	'body',
	'body_markdown',
	'closed',
	'close_reason_id',
	'comment',
	'comments',
	'community_wiki',
	'date',
	'edit_summary',
	'event_type',
	'exclude',
	'filter',
	'filter_description',
	'filter_id',
	'filter_name',
	'filter_type',
	'fromdate',
	'include',
	'inname',
	'intitle',
	'is_anonymous',
	'is_rollback',
	'link',
	'max',
	'migrated',
	'min',
	'name',
	'nottagged',
	'notify',
	'notice',
	'option_id',
	'order',
	'page',
	'pagesize',
	'parent',
	'period',
	'preview',
	'query',
	'q',
	'related',
	'revision',
	'revision_guid',
	'score',
	'since',
	'site_url',
	'slugs',
	'sort',
	'suggested_edit_id',
	'tag',
	'tagged',
	'tags',
	'target',
	'title',
	'todate',
	'toid',
	'type',
	'unsafe',
	'url',
	'user',
	'users',
	'views',
	'wiki',
]);

const QueryParametersSchema = z
	.record(z.string(), QueryValueSchema)
	.superRefine((parameters, context) => {
		for (const [name, value] of Object.entries(parameters)) {
			if (name === 'key' || name === 'access_token') {
				context.addIssue({
					code: 'custom',
					message: `${name} must be provided through Corsair credentials, not parameters`,
					path: [name],
				});
			}
			if (name === 'callback') {
				context.addIssue({
					code: 'custom',
					message: 'JSONP callbacks are not supported',
					path: [name],
				});
			}
			if (!DOCUMENTED_PARAMETER_NAMES.has(name)) {
				context.addIssue({
					code: 'custom',
					message: `${name} is not in the documented parameter vocabulary`,
					path: [name],
				});
			}
			if (
				name === 'pagesize' &&
				(typeof value !== 'number' ||
					!Number.isInteger(value) ||
					value < 0 ||
					value > 100)
			) {
				context.addIssue({
					code: 'custom',
					message: 'pagesize must be a number from 0 through 100',
					path: [name],
				});
			}
			if (
				name === 'page' &&
				(typeof value !== 'number' || !Number.isInteger(value) || value < 1)
			) {
				context.addIssue({
					code: 'custom',
					message: 'page must be a positive number',
					path: [name],
				});
			}
			if (name === 'order' && value !== 'asc' && value !== 'desc') {
				context.addIssue({
					code: 'custom',
					message: 'order must be asc or desc',
					path: [name],
				});
			}
			if (
				['accepted', 'closed', 'migrated', 'notice', 'wiki'].includes(name) &&
				typeof value !== 'boolean'
			) {
				context.addIssue({
					code: 'custom',
					message: `${name} must be a boolean`,
					path: [name],
				});
			}
		}
	});

function routeSchema(group: Parameters<typeof routeIds>[0]) {
	const validIds = routeIds(group);
	return z.string().refine((value) => validIds.includes(value), {
		message: `Route is not in the documented ${group} method inventory`,
	});
}

const BaseCallSchema = z.object({
	route: z.string().min(1),
	pathParams: z
		.record(z.string(), z.union([z.string(), z.number().int()]))
		.optional(),
	parameters: QueryParametersSchema.optional(),
});

export const SiteReadInputSchema = BaseCallSchema.extend({
	route: routeSchema('siteRead'),
	site: z.string().min(1).max(255),
}).strict();

export const SiteWriteInputSchema = BaseCallSchema.extend({
	route: routeSchema('siteWrite'),
	site: z.string().min(1).max(255),
}).strict();

export const NetworkReadInputSchema = BaseCallSchema.extend({
	route: routeSchema('networkRead'),
	method: z.enum(['GET', 'POST']).optional(),
}).strict();

// Stack Exchange documents a common wrapper; item members vary by method and
// response filter, so JSON values remain unknown until consumers inspect them.
const JsonValueSchema: z.ZodType<unknown> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

const ApiItemSchema = z.record(z.string(), JsonValueSchema);

export const StackExchangeResponseSchema = z
	.object({
		items: z.array(ApiItemSchema).optional(),
		has_more: z.boolean().optional(),
		backoff: z.number().int().nonnegative().optional(),
		page: z.number().int().positive().optional(),
		page_size: z.number().int().nonnegative().optional(),
		quota_max: z.number().int().nonnegative().optional(),
		quota_remaining: z.number().int().nonnegative().optional(),
		total: z.number().int().nonnegative().optional(),
		type: z.string().optional(),
		error_id: z.number().int().optional(),
		error_name: z.string().optional(),
		error_message: z.string().optional(),
	})
	.strict();

export type SiteReadInput = z.infer<typeof SiteReadInputSchema>;
export type SiteWriteInput = z.infer<typeof SiteWriteInputSchema>;
export type NetworkReadInput = z.infer<typeof NetworkReadInputSchema>;
export type StackExchangeResponse = z.infer<typeof StackExchangeResponseSchema>;

export type StackExchangeEndpointInputs = {
	siteRead: SiteReadInput;
	siteWrite: SiteWriteInput;
	networkRead: NetworkReadInput;
};

export type StackExchangeEndpointOutputs = {
	siteRead: StackExchangeResponse;
	siteWrite: StackExchangeResponse;
	networkRead: StackExchangeResponse;
};

export const StackExchangeEndpointInputSchemas = {
	siteRead: SiteReadInputSchema,
	siteWrite: SiteWriteInputSchema,
	networkRead: NetworkReadInputSchema,
} as const;

export const StackExchangeEndpointOutputSchemas = {
	siteRead: StackExchangeResponseSchema,
	siteWrite: StackExchangeResponseSchema,
	networkRead: StackExchangeResponseSchema,
} as const;
