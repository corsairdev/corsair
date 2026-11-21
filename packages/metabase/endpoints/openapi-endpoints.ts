import { z } from 'zod';
import type { JsonValue, MetabaseResponse } from '../client';
import {
	createMetabaseMultipartFileForm,
	MetabaseBinaryResponseSchema,
} from '../client';
import type { MetabaseContext } from '../index';
import { buildMetabasePath, createMetabaseEndpoint } from './base';
import * as OpenApiSchemas from './openapi-schemas';
import { validatePrefixItems } from './openapi-schemas';

export type MetabaseOpenApiTestValue =
	| JsonValue
	| Blob
	| { [key: string]: MetabaseOpenApiTestValue }
	| MetabaseOpenApiTestValue[];
export type MetabaseOpenApiTestCase = {
	shortPath: string;
	operationId: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	input: MetabaseOpenApiTestValue;
	output: MetabaseResponse;
	expectedOptions: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		query?: Record<string, JsonValue>;
		body?: JsonValue;
		responseType?: 'binary';
		requestTimeoutMs?: number;
		queryParameterStyles?: Record<string, { style: string; explode: boolean }>;
	};
	multipart: boolean;
	isInputValid: (value: MetabaseOpenApiTestValue) => boolean;
	isOutputValid: (value: MetabaseResponse) => boolean;
	invoke: (
		ctx: MetabaseContext,
		input: MetabaseOpenApiTestValue,
	) => Promise<JsonValue>;
};

const openApiInput0 = z
	.object({
		query: z
			.object({
				'model-id': z
					.union([OpenApiSchemas.MetabaseOpenApiInputSchema424, z.null()])
					.optional(),
				type: z
					.union([OpenApiSchemas.MetabaseOpenApiInputSchema219, z.null()])
					.optional(),
				archived: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput0 = z.array(OpenApiSchemas.MetabaseOpenApiOutputSchema215);
const openApiEndpoint0 = createMetabaseEndpoint(
	'action.get',
	openApiInput0,
	openApiOutput0,
	(input) => ({ method: 'GET', path: '/api/action', query: input.query }),
);

const openApiInput1 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema212.optional() })
	.strict();
const openApiOutput1 = OpenApiSchemas.MetabaseOpenApiOutputSchema215;
const openApiEndpoint1 = createMetabaseEndpoint(
	'action.post',
	openApiInput1,
	openApiOutput1,
	(input) => ({ method: 'POST', path: '/api/action', body: input.body }),
);

const openApiInput2 = z
	.object({
		body: z
			.object({
				action: OpenApiSchemas.MetabaseOpenApiInputSchema211,
				parameters: z
					.union([OpenApiSchemas.MetabaseOpenApiInputSchema216, z.null()])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput2 = z.record(z.string(), z.json());
const openApiEndpoint2 = createMetabaseEndpoint(
	'action.postExecute',
	openApiInput2,
	openApiOutput2,
	(input) => ({
		method: 'POST',
		path: '/api/action/execute',
		body: input.body,
	}),
);

const openApiInput3 = z.object({}).strict();
const openApiOutput3 = z.array(OpenApiSchemas.MetabaseOpenApiOutputSchema215);
const openApiEndpoint3 = createMetabaseEndpoint(
	'action.getPublic',
	openApiInput3,
	openApiOutput3,
	(input) => ({ method: 'GET', path: '/api/action/public' }),
);

const openApiInput4 = z
	.object({ path: z.object({ 'action-id': z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput4 = OpenApiSchemas.MetabaseOpenApiOutputSchema215;
const openApiEndpoint4 = createMetabaseEndpoint(
	'action.getByActionId',
	openApiInput4,
	openApiOutput4,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/action/{action-id}', input.path),
	}),
);

const openApiInput5 = z
	.object({
		path: z.object({ 'action-id': z.number().int().min(1) }).strict(),
		body: z
			.object({ parameters: OpenApiSchemas.MetabaseOpenApiInputSchema218 })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput5 = z.record(z.string(), z.json());
const openApiEndpoint5 = createMetabaseEndpoint(
	'action.postByActionIdExecuteValues',
	openApiInput5,
	openApiOutput5,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath(
			'/api/action/{action-id}/execute/values',
			input.path,
		),
		body: input.body,
	}),
);

const openApiInput6 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema225.optional() })
	.strict();
const openApiOutput6 = OpenApiSchemas.MetabaseOpenApiOutputSchema226;
const openApiEndpoint6 = createMetabaseEndpoint(
	'agent.postV1Collection',
	openApiInput6,
	openApiOutput6,
	(input) => ({
		method: 'POST',
		path: '/api/agent/v1/collection',
		body: input.body,
	}),
);

const openApiInput7 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema222.optional() })
	.strict();
const openApiOutput7 = OpenApiSchemas.MetabaseOpenApiOutputSchema224;
const openApiEndpoint7 = createMetabaseEndpoint(
	'agent.postV1ConstructNativeQuery',
	openApiInput7,
	openApiOutput7,
	(input) => ({
		method: 'POST',
		path: '/api/agent/v1/construct-native-query',
		body: input.body,
		requestTimeoutMs: 120000,
	}),
);

const openApiInput8 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema227.optional() })
	.strict();
const openApiOutput8 = OpenApiSchemas.MetabaseOpenApiOutputSchema228;
const openApiEndpoint8 = createMetabaseEndpoint(
	'agent.postV1Dashboard',
	openApiInput8,
	openApiOutput8,
	(input) => ({
		method: 'POST',
		path: '/api/agent/v1/dashboard',
		body: input.body,
	}),
);

const openApiInput9 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: OpenApiSchemas.MetabaseOpenApiInputSchema245.optional(),
	})
	.strict();
const openApiOutput9 = OpenApiSchemas.MetabaseOpenApiOutputSchema246;
const openApiEndpoint9 = createMetabaseEndpoint(
	'agent.putV1DashboardById',
	openApiInput9,
	openApiOutput9,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath('/api/agent/v1/dashboard/{id}', input.path),
		body: input.body,
	}),
);

const openApiInput10 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema235.optional() })
	.strict();
const openApiOutput10 = OpenApiSchemas.MetabaseOpenApiOutputSchema236;
const openApiEndpoint10 = createMetabaseEndpoint(
	'agent.postV1Execute',
	openApiInput10,
	openApiOutput10,
	(input) => ({
		method: 'POST',
		path: '/api/agent/v1/execute',
		body: input.body,
	}),
);

const openApiInput11 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema237.optional() })
	.strict();
const openApiOutput11 = OpenApiSchemas.MetabaseOpenApiOutputSchema236;
const openApiEndpoint11 = createMetabaseEndpoint(
	'agent.postV1ExecuteSql',
	openApiInput11,
	openApiOutput11,
	(input) => ({
		method: 'POST',
		path: '/api/agent/v1/execute-sql',
		body: input.body,
		requestTimeoutMs: 120000,
	}),
);

const openApiInput12 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema229.optional() })
	.strict();
const openApiOutput12 = OpenApiSchemas.MetabaseOpenApiOutputSchema230;
const openApiEndpoint12 = createMetabaseEndpoint(
	'agent.postV1Metric',
	openApiInput12,
	openApiOutput12,
	(input) => ({
		method: 'POST',
		path: '/api/agent/v1/metric',
		body: input.body,
	}),
);

const openApiInput13 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: OpenApiSchemas.MetabaseOpenApiInputSchema247.optional(),
	})
	.strict();
const openApiOutput13 = OpenApiSchemas.MetabaseOpenApiOutputSchema248;
const openApiEndpoint13 = createMetabaseEndpoint(
	'agent.putV1MetricById',
	openApiInput13,
	openApiOutput13,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath('/api/agent/v1/metric/{id}', input.path),
		body: input.body,
	}),
);

const openApiInput14 = z.object({}).strict();
const openApiOutput14 = z.object({ message: z.string() });
const openApiEndpoint14 = createMetabaseEndpoint(
	'agent.getV1Ping',
	openApiInput14,
	openApiOutput14,
	(input) => ({ method: 'GET', path: '/api/agent/v1/ping' }),
);

const openApiInput15 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema231.optional() })
	.strict();
const openApiOutput15 = OpenApiSchemas.MetabaseOpenApiOutputSchema232;
const openApiEndpoint15 = createMetabaseEndpoint(
	'agent.postV1Question',
	openApiInput15,
	openApiOutput15,
	(input) => ({
		method: 'POST',
		path: '/api/agent/v1/question',
		body: input.body,
	}),
);

const openApiInput16 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: OpenApiSchemas.MetabaseOpenApiInputSchema249.optional(),
	})
	.strict();
const openApiOutput16 = OpenApiSchemas.MetabaseOpenApiOutputSchema250;
const openApiEndpoint16 = createMetabaseEndpoint(
	'agent.putV1QuestionById',
	openApiInput16,
	openApiOutput16,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath('/api/agent/v1/question/{id}', input.path),
		body: input.body,
	}),
);

const openApiInput17 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z.object({}).strict().optional(),
	})
	.strict();
const openApiOutput17 = OpenApiSchemas.MetabaseOpenApiOutputSchema236;
const openApiEndpoint17 = createMetabaseEndpoint(
	'agent.postV1QuestionByIdQuery',
	openApiInput17,
	openApiOutput17,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath('/api/agent/v1/question/{id}/query', input.path),
		body: input.body,
		requestTimeoutMs: 120000,
	}),
);

const openApiInput18 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema241.optional() })
	.strict();
const openApiOutput18 = OpenApiSchemas.MetabaseOpenApiOutputSchema242;
const openApiEndpoint18 = createMetabaseEndpoint(
	'agent.postV1ReadResource',
	openApiInput18,
	openApiOutput18,
	(input) => ({
		method: 'POST',
		path: '/api/agent/v1/read-resource',
		body: input.body,
	}),
);

const openApiInput19 = z
	.object({
		body: z
			.object({
				semantic_queries: z
					.union([
						z.union([z.array(z.string().min(1)), z.string().min(1)]),
						z.null(),
					])
					.optional(),
				term_queries: z
					.union([
						z.union([z.array(z.string().min(1)), z.string().min(1)]),
						z.null(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput19 = OpenApiSchemas.MetabaseOpenApiOutputSchema243;
const openApiEndpoint19 = createMetabaseEndpoint(
	'agent.postV1Search',
	openApiInput19,
	openApiOutput19,
	(input) => ({
		method: 'POST',
		path: '/api/agent/v1/search',
		body: input.body,
	}),
);

const openApiInput20 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema223.optional() })
	.strict();
const openApiOutput20 = OpenApiSchemas.MetabaseOpenApiOutputSchema224;
const openApiEndpoint20 = createMetabaseEndpoint(
	'agent.postV2ConstructQuery',
	openApiInput20,
	openApiOutput20,
	(input) => ({
		method: 'POST',
		path: '/api/agent/v2/construct-query',
		body: input.body,
		requestTimeoutMs: 120000,
	}),
);

const openApiInput21 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema238.optional() })
	.strict();
const openApiOutput21 = OpenApiSchemas.MetabaseOpenApiOutputSchema239;
const openApiEndpoint21 = createMetabaseEndpoint(
	'agent.postV2Query',
	openApiInput21,
	openApiOutput21,
	(input) => ({
		method: 'POST',
		path: '/api/agent/v2/query',
		body: input.body,
		requestTimeoutMs: 120000,
	}),
);

const openApiInput22 = z
	.object({
		body: z
			.object({
				events: z
					.array(
						z
							.object({
								amount: z.union([z.number(), z.null()]).optional(),
								labels: z
									.union([z.record(z.string(), z.string().max(200)), z.null()])
									.optional(),
								metric: z.string(),
								op: z.literal('inc'),
							})
							.strict(),
					)
					.max(1001),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput22 = z.null();
const openApiEndpoint22 = createMetabaseEndpoint(
	'analytics.postInternal',
	openApiInput22,
	openApiOutput22,
	(input) => ({
		method: 'POST',
		path: '/api/analytics/internal',
		body: input.body,
	}),
);

const openApiInput23 = z
	.object({
		path: z
			.object({ id: OpenApiSchemas.MetabaseOpenApiInputSchema253 })
			.strict(),
	})
	.strict();
const openApiOutput23 = z.object({
	id: OpenApiSchemas.MetabaseOpenApiOutputSchema253,
	masked_key: OpenApiSchemas.MetabaseOpenApiOutputSchema251,
	prefix: OpenApiSchemas.MetabaseOpenApiOutputSchema254,
	unmasked_key: OpenApiSchemas.MetabaseOpenApiOutputSchema252,
});
const openApiEndpoint23 = createMetabaseEndpoint(
	'apiKey.putByIdRegenerate',
	openApiInput23,
	openApiOutput23,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath('/api/api-key/{id}/regenerate', input.path),
	}),
);

const openApiInput24 = z
	.object({
		query: z
			.object({
				model: z
					.array(
						z.union([
							z.literal('root'),
							z.literal('database'),
							z.literal('dashboard'),
							z.literal('question'),
						]),
					)
					.optional(),
				collection: z.union([z.number().int().min(1), z.null()]).optional(),
				id: z.union([z.number().int().min(1), z.null()]).optional(),
				sort_column: z
					.union([
						z.literal('name'),
						z.literal('policy'),
						z.literal('collection'),
					])
					.optional(),
				sort_direction: z
					.union([z.literal('asc'), z.literal('desc')])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput24 = OpenApiSchemas.MetabaseOpenApiOutputSchema262;
const openApiEndpoint24 = createMetabaseEndpoint(
	'cache.get',
	openApiInput24,
	openApiOutput24,
	(input) => ({ method: 'GET', path: '/api/cache', query: input.query }),
);

const openApiInput25 = z
	.object({
		body: z
			.object({
				model: z.union([
					z.literal('root'),
					z.literal('database'),
					z.literal('dashboard'),
					z.literal('question'),
				]),
				model_id: z.number().int().min(0),
				strategy: OpenApiSchemas.MetabaseOpenApiInputSchema265,
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput25 = OpenApiSchemas.MetabaseOpenApiOutputSchema263;
const openApiEndpoint25 = createMetabaseEndpoint(
	'cache.put',
	openApiInput25,
	openApiOutput25,
	(input) => ({ method: 'PUT', path: '/api/cache', body: input.body }),
);

const openApiInput26 = z
	.object({
		body: z
			.object({
				model: z.union([
					z.literal('root'),
					z.literal('database'),
					z.literal('dashboard'),
					z.literal('question'),
				]),
				model_id: z.array(z.number().int().min(0)),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput26 = z.null();
const openApiEndpoint26 = createMetabaseEndpoint(
	'cache.delete',
	openApiInput26,
	openApiOutput26,
	(input) => ({ method: 'DELETE', path: '/api/cache', body: input.body }),
);

const openApiInput27 = z
	.object({
		query: z
			.object({
				include: z.union([z.literal('overrides'), z.null()]).optional(),
				database: z
					.union([z.array(z.number().int().min(0)), z.null()])
					.optional(),
				dashboard: z
					.union([z.array(z.number().int().min(0)), z.null()])
					.optional(),
				question: z
					.union([z.array(z.number().int().min(0)), z.null()])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput27 = OpenApiSchemas.MetabaseOpenApiOutputSchema264;
const openApiEndpoint27 = createMetabaseEndpoint(
	'cache.postInvalidate',
	openApiInput27,
	openApiOutput27,
	(input) => ({
		method: 'POST',
		path: '/api/cache/invalidate',
		query: input.query,
	}),
);

const openApiInput28 = z
	.object({
		path: z
			.object({
				'dashboard-id': z.number().int().min(1),
				'dashcard-id': z.number().int().min(1),
			})
			.strict(),
		body: z
			.object({
				parameters: OpenApiSchemas.MetabaseOpenApiInputSchema218.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput28 = z.record(z.string(), z.json());
const openApiEndpoint28 = createMetabaseEndpoint(
	'dashboard.postByDashboardIdDashcardByDashcardIdExecuteValues',
	openApiInput28,
	openApiOutput28,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath(
			'/api/dashboard/{dashboard-id}/dashcard/{dashcard-id}/execute/values',
			input.path,
		),
		body: input.body,
	}),
);

const openApiInput29 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z
			.object({
				paper_size: z
					.union([z.union([z.literal('a4'), z.literal('letter')]), z.null()])
					.optional(),
				parameters: z
					.union([OpenApiSchemas.MetabaseOpenApiInputSchema651, z.null()])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput29 = MetabaseBinaryResponseSchema;
const openApiEndpoint29 = createMetabaseEndpoint(
	'dashboard.postByIdPdf',
	openApiInput29,
	openApiOutput29,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath('/api/dashboard/{id}/pdf', input.path),
		body: input.body,
		responseType: 'binary',
		requestTimeoutMs: 120000,
	}),
);

const openApiInput30 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema290.optional() })
	.strict();
const openApiOutput30 = z.null();
const openApiEndpoint30 = createMetabaseEndpoint(
	'dataStudio.postTableDiscardValues',
	openApiInput30,
	openApiOutput30,
	(input) => ({
		method: 'POST',
		path: '/api/data-studio/table/discard-values',
		body: input.body,
	}),
);

const openApiInput31 = z
	.object({
		body: z
			.object({
				data_authority: OpenApiSchemas.MetabaseOpenApiInputSchema287.optional(),
				data_layer: z
					.union([OpenApiSchemas.MetabaseOpenApiInputSchema288, z.null()])
					.optional(),
				table_ids: z.array(z.number().int().min(1)).optional(),
				owner_email: z.union([z.string(), z.null()]).optional(),
				owner_user_id: z.union([z.number().int(), z.null()]).optional(),
				data_source: z
					.union([OpenApiSchemas.MetabaseOpenApiInputSchema289, z.null()])
					.optional(),
				schema_ids: z.array(z.string()).optional(),
				entity_type: z.union([z.string(), z.null()]).optional(),
				database_ids: z.array(z.number().int().min(1)).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput31 = z.object({}).strict();
const openApiEndpoint31 = createMetabaseEndpoint(
	'dataStudio.postTableEdit',
	openApiInput31,
	openApiOutput31,
	(input) => ({
		method: 'POST',
		path: '/api/data-studio/table/edit',
		body: input.body,
	}),
);

const openApiInput32 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema290.optional() })
	.strict();
const openApiOutput32 = z.null();
const openApiEndpoint32 = createMetabaseEndpoint(
	'dataStudio.postTableRescanValues',
	openApiInput32,
	openApiOutput32,
	(input) => ({
		method: 'POST',
		path: '/api/data-studio/table/rescan-values',
		body: input.body,
	}),
);

const openApiInput33 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema290.optional() })
	.strict();
const openApiOutput33 = OpenApiSchemas.MetabaseOpenApiOutputSchema286;
const openApiEndpoint33 = createMetabaseEndpoint(
	'dataStudio.postTableSelection',
	openApiInput33,
	openApiOutput33,
	(input) => ({
		method: 'POST',
		path: '/api/data-studio/table/selection',
		body: input.body,
	}),
);

const openApiInput34 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema290.optional() })
	.strict();
const openApiOutput34 = z.null();
const openApiEndpoint34 = createMetabaseEndpoint(
	'dataStudio.postTableSyncSchema',
	openApiInput34,
	openApiOutput34,
	(input) => ({
		method: 'POST',
		path: '/api/data-studio/table/sync-schema',
		body: input.body,
	}),
);

const openApiInput35 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		query: z
			.object({
				include_editable_data_model: z
					.union([z.boolean(), z.null()])
					.optional(),
				include_hidden: z.union([z.boolean(), z.null()]).optional(),
				'can-query': z.union([z.boolean(), z.null()]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput35 = z.array(z.string());
const openApiEndpoint35 = createMetabaseEndpoint(
	'database.getByIdSchemas',
	openApiInput35,
	openApiOutput35,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/database/{id}/schemas', input.path),
		query: input.query,
	}),
);

const openApiInput36 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput36 = z.object({
	settings: OpenApiSchemas.MetabaseOpenApiOutputSchema711,
});
const openApiEndpoint36 = createMetabaseEndpoint(
	'database.getByIdSettingsAvailable',
	openApiInput36,
	openApiOutput36,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/database/{id}/settings-available',
			input.path,
		),
	}),
);

const openApiInput37 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema336.optional() })
	.strict();
const openApiOutput37 = OpenApiSchemas.MetabaseOpenApiOutputSchema674;
const openApiEndpoint37 = createMetabaseEndpoint(
	'dataset.post',
	openApiInput37,
	openApiOutput37,
	(input) => ({
		method: 'POST',
		path: '/api/dataset',
		body: input.body,
		requestTimeoutMs: 120000,
	}),
);

const openApiInput38 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema337.optional() })
	.strict();
const openApiOutput38 = OpenApiSchemas.MetabaseOpenApiOutputSchema674;
const openApiEndpoint38 = createMetabaseEndpoint(
	'dataset.postPivot',
	openApiInput38,
	openApiOutput38,
	(input) => ({
		method: 'POST',
		path: '/api/dataset/pivot',
		body: input.body,
		requestTimeoutMs: 120000,
	}),
);

const openApiInput39 = z
	.object({
		path: z
			.object({ 'export-format': OpenApiSchemas.MetabaseOpenApiInputSchema673 })
			.strict(),
		body: z
			.object({
				csv_include_bom: z.boolean().optional(),
				format_rows: z.boolean().optional(),
				pivot_results: z.boolean().optional(),
				query: OpenApiSchemas.MetabaseOpenApiInputSchema336,
				visualization_settings: z.record(z.string(), z.json()).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput39 = MetabaseBinaryResponseSchema;
const openApiEndpoint39 = createMetabaseEndpoint(
	'dataset.postByExportFormat',
	openApiInput39,
	openApiOutput39,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath('/api/dataset/{export-format}', input.path),
		body: input.body,
		responseType: 'binary',
		requestTimeoutMs: 120000,
	}),
);

const openApiInput40 = z.object({}).strict();
const openApiOutput40 = z.array(
	z.object({
		id: z.number().int().min(1),
		name: z.string(),
		public_uuid: z
			.string()
			.regex(
				new RegExp(
					'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
				),
			),
	}),
);
const openApiEndpoint40 = createMetabaseEndpoint(
	'document.getPublic',
	openApiInput40,
	openApiOutput40,
	(input) => ({ method: 'GET', path: '/api/document/public' }),
);

const openApiInput41 = z
	.object({
		path: z.object({ 'document-id': z.number().int().min(1) }).strict(),
	})
	.strict();
const openApiOutput41 = z.object({
	uuid: z
		.string()
		.regex(
			new RegExp(
				'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
			),
		),
});
const openApiEndpoint41 = createMetabaseEndpoint(
	'document.postByDocumentIdPublicLink',
	openApiInput41,
	openApiOutput41,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath(
			'/api/document/{document-id}/public-link',
			input.path,
		),
	}),
);

const openApiInput42 = z
	.object({
		path: z.object({ 'from-document-id': z.number().int().min(1) }).strict(),
		body: z
			.object({
				collection_id: z.union([z.number().int().min(1), z.null()]).optional(),
				collection_position: z
					.union([z.number().int().min(1), z.null()])
					.optional(),
				name: z.union([z.string().min(1), z.null()]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput42 = z.object({
	id: OpenApiSchemas.MetabaseOpenApiOutputSchema291,
});
const openApiEndpoint42 = createMetabaseEndpoint(
	'document.postByFromDocumentIdCopy',
	openApiInput42,
	openApiOutput42,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath(
			'/api/document/{from-document-id}/copy',
			input.path,
		),
		body: input.body,
	}),
);

const openApiInput43 = z.object({}).strict();
const openApiOutput43 = z
	.object({
		advanced: z.boolean(),
		permissions: z.array(
			z
				.object({
					group_id: z.number().int().min(1),
					mcp_enabled: z.boolean(),
					tool_access: OpenApiSchemas.MetabaseOpenApiOutputSchema586,
				})
				.strict(),
		),
		tools: z.array(
			z
				.object({
					default_access: z.union([z.literal('allowed'), z.literal('denied')]),
					description: z.string(),
					name: z.string(),
					scope: z.string(),
				})
				.strict(),
		),
	})
	.strict();
const openApiEndpoint43 = createMetabaseEndpoint(
	'ee.getAiControlsMcpPermissions',
	openApiInput43,
	openApiOutput43,
	(input) => ({ method: 'GET', path: '/api/ee/ai-controls/mcp-permissions' }),
);

const openApiInput44 = z
	.object({
		body: z
			.object({
				permissions: z.array(
					z
						.object({
							group_id: z.number().int().min(1),
							mcp_enabled: z.boolean(),
							tool_access: OpenApiSchemas.MetabaseOpenApiInputSchema586,
						})
						.strict(),
				),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput44 = z
	.object({
		advanced: z.boolean(),
		permissions: z.array(
			z
				.object({
					group_id: z.number().int().min(1),
					mcp_enabled: z.boolean(),
					tool_access: OpenApiSchemas.MetabaseOpenApiOutputSchema586,
				})
				.strict(),
		),
		tools: z.array(
			z
				.object({
					default_access: z.union([z.literal('allowed'), z.literal('denied')]),
					description: z.string(),
					name: z.string(),
					scope: z.string(),
				})
				.strict(),
		),
	})
	.strict();
const openApiEndpoint44 = createMetabaseEndpoint(
	'ee.putAiControlsMcpPermissions',
	openApiInput44,
	openApiOutput44,
	(input) => ({
		method: 'PUT',
		path: '/api/ee/ai-controls/mcp-permissions',
		body: input.body,
	}),
);

const openApiInput45 = z.object({}).strict();
const openApiOutput45 = z
	.object({
		advanced: z.boolean(),
		permissions: z.array(
			z
				.object({
					group_id: z.number().int().min(1),
					mcp_enabled: z.boolean(),
					tool_access: OpenApiSchemas.MetabaseOpenApiOutputSchema586,
				})
				.strict(),
		),
		tools: z.array(
			z
				.object({
					default_access: z.union([z.literal('allowed'), z.literal('denied')]),
					description: z.string(),
					name: z.string(),
					scope: z.string(),
				})
				.strict(),
		),
	})
	.strict();
const openApiEndpoint45 = createMetabaseEndpoint(
	'ee.postAiControlsMcpPermissionsAdvanced',
	openApiInput45,
	openApiOutput45,
	(input) => ({
		method: 'POST',
		path: '/api/ee/ai-controls/mcp-permissions/advanced',
	}),
);

const openApiInput46 = z.object({}).strict();
const openApiOutput46 = z
	.object({
		advanced: z.boolean(),
		permissions: z.array(
			z
				.object({
					group_id: z.number().int().min(1),
					mcp_enabled: z.boolean(),
					tool_access: OpenApiSchemas.MetabaseOpenApiOutputSchema586,
				})
				.strict(),
		),
		tools: z.array(
			z
				.object({
					default_access: z.union([z.literal('allowed'), z.literal('denied')]),
					description: z.string(),
					name: z.string(),
					scope: z.string(),
				})
				.strict(),
		),
	})
	.strict();
const openApiEndpoint46 = createMetabaseEndpoint(
	'ee.deleteAiControlsMcpPermissionsAdvanced',
	openApiInput46,
	openApiOutput46,
	(input) => ({
		method: 'DELETE',
		path: '/api/ee/ai-controls/mcp-permissions/advanced',
	}),
);

const openApiInput47 = z.object({}).strict();
const openApiOutput47 = z.object({
	advanced: z.boolean(),
	permissions: z.array(
		z.object({
			group_id: z.number().int().min(1),
			perm_type: z.union([
				z.literal('permission/metabot'),
				z.literal('permission/metabot-nlq'),
				z.literal('permission/metabot-other-tools'),
				z.literal('permission/metabot-sql-generation'),
			]),
			perm_value: z.union([z.literal('yes'), z.literal('no')]),
		}),
	),
});
const openApiEndpoint47 = createMetabaseEndpoint(
	'ee.getAiControlsPermissions',
	openApiInput47,
	openApiOutput47,
	(input) => ({ method: 'GET', path: '/api/ee/ai-controls/permissions' }),
);

const openApiInput48 = z
	.object({
		body: z
			.object({
				permissions: z.array(
					z
						.object({
							group_id: z.number().int().min(1),
							perm_type: z.union([
								z.literal('permission/metabot-nlq'),
								z.literal('permission/metabot-sql-generation'),
								z.literal('permission/metabot-other-tools'),
								z.literal('permission/metabot'),
							]),
							perm_value: z.union([z.literal('yes'), z.literal('no')]),
						})
						.strict(),
				),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput48 = z.object({
	advanced: z.boolean(),
	permissions: z.array(
		z.object({
			group_id: z.number().int().min(1),
			perm_type: z.union([
				z.literal('permission/metabot'),
				z.literal('permission/metabot-nlq'),
				z.literal('permission/metabot-other-tools'),
				z.literal('permission/metabot-sql-generation'),
			]),
			perm_value: z.union([z.literal('yes'), z.literal('no')]),
		}),
	),
});
const openApiEndpoint48 = createMetabaseEndpoint(
	'ee.putAiControlsPermissions',
	openApiInput48,
	openApiOutput48,
	(input) => ({
		method: 'PUT',
		path: '/api/ee/ai-controls/permissions',
		body: input.body,
	}),
);

const openApiInput49 = z.object({}).strict();
const openApiOutput49 = z.object({
	advanced: z.boolean(),
	permissions: z.array(
		z.object({
			group_id: z.number().int().min(1),
			perm_type: z.union([
				z.literal('permission/metabot'),
				z.literal('permission/metabot-nlq'),
				z.literal('permission/metabot-other-tools'),
				z.literal('permission/metabot-sql-generation'),
			]),
			perm_value: z.union([z.literal('yes'), z.literal('no')]),
		}),
	),
});
const openApiEndpoint49 = createMetabaseEndpoint(
	'ee.postAiControlsPermissionsAdvanced',
	openApiInput49,
	openApiOutput49,
	(input) => ({
		method: 'POST',
		path: '/api/ee/ai-controls/permissions/advanced',
	}),
);

const openApiInput50 = z.object({}).strict();
const openApiOutput50 = z.object({
	advanced: z.boolean(),
	permissions: z.array(
		z.object({
			group_id: z.number().int().min(1),
			perm_type: z.union([
				z.literal('permission/metabot'),
				z.literal('permission/metabot-nlq'),
				z.literal('permission/metabot-other-tools'),
				z.literal('permission/metabot-sql-generation'),
			]),
			perm_value: z.union([z.literal('yes'), z.literal('no')]),
		}),
	),
});
const openApiEndpoint50 = createMetabaseEndpoint(
	'ee.deleteAiControlsPermissionsAdvanced',
	openApiInput50,
	openApiOutput50,
	(input) => ({
		method: 'DELETE',
		path: '/api/ee/ai-controls/permissions/advanced',
	}),
);

const openApiInput51 = z.object({}).strict();
const openApiOutput51 = z.array(
	z.object({
		group_id: z.number().int().min(1),
		max_usage: z.number().int().min(0),
	}),
);
const openApiEndpoint51 = createMetabaseEndpoint(
	'ee.getAiControlsUsageGroup',
	openApiInput51,
	openApiOutput51,
	(input) => ({ method: 'GET', path: '/api/ee/ai-controls/usage/group' }),
);

const openApiInput52 = z
	.object({ path: z.object({ 'group-id': z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput52 = z.object({
	group_id: z.number().int().min(1),
	max_usage: z.union([z.number().int().min(0), z.null()]),
});
const openApiEndpoint52 = createMetabaseEndpoint(
	'ee.getAiControlsUsageGroupByGroupId',
	openApiInput52,
	openApiOutput52,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/ee/ai-controls/usage/group/{group-id}',
			input.path,
		),
	}),
);

const openApiInput53 = z
	.object({
		path: z.object({ 'group-id': z.number().int().min(1) }).strict(),
		body: z
			.object({ max_usage: z.union([z.number().int().min(0), z.null()]) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput53 = z.object({
	group_id: z.number().int().min(1),
	max_usage: z.union([z.number().int().min(0), z.null()]),
});
const openApiEndpoint53 = createMetabaseEndpoint(
	'ee.putAiControlsUsageGroupByGroupId',
	openApiInput53,
	openApiOutput53,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath(
			'/api/ee/ai-controls/usage/group/{group-id}',
			input.path,
		),
		body: input.body,
	}),
);

const openApiInput54 = z.object({}).strict();
const openApiOutput54 = z
	.object({ max_usage: z.union([z.number().int().min(0), z.null()]) })
	.strict();
const openApiEndpoint54 = createMetabaseEndpoint(
	'ee.getAiControlsUsageInstance',
	openApiInput54,
	openApiOutput54,
	(input) => ({ method: 'GET', path: '/api/ee/ai-controls/usage/instance' }),
);

const openApiInput55 = z
	.object({
		body: z
			.object({ max_usage: z.union([z.number().int().min(0), z.null()]) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput55 = z
	.object({ max_usage: z.union([z.number().int().min(0), z.null()]) })
	.strict();
const openApiEndpoint55 = createMetabaseEndpoint(
	'ee.putAiControlsUsageInstance',
	openApiInput55,
	openApiOutput55,
	(input) => ({
		method: 'PUT',
		path: '/api/ee/ai-controls/usage/instance',
		body: input.body,
	}),
);

const openApiInput56 = z.object({}).strict();
const openApiOutput56 = z.array(
	z.object({
		max_usage: z.number().int().min(0),
		tenant_id: z.number().int().min(1),
	}),
);
const openApiEndpoint56 = createMetabaseEndpoint(
	'ee.getAiControlsUsageTenant',
	openApiInput56,
	openApiOutput56,
	(input) => ({ method: 'GET', path: '/api/ee/ai-controls/usage/tenant' }),
);

const openApiInput57 = z
	.object({ path: z.object({ 'tenant-id': z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput57 = z.object({
	max_usage: z.union([z.number().int().min(0), z.null()]),
	tenant_id: z.number().int().min(1),
});
const openApiEndpoint57 = createMetabaseEndpoint(
	'ee.getAiControlsUsageTenantByTenantId',
	openApiInput57,
	openApiOutput57,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/ee/ai-controls/usage/tenant/{tenant-id}',
			input.path,
		),
	}),
);

const openApiInput58 = z
	.object({
		path: z.object({ 'tenant-id': z.number().int().min(1) }).strict(),
		body: z
			.object({ max_usage: z.union([z.number().int().min(0), z.null()]) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput58 = z.object({
	max_usage: z.union([z.number().int().min(0), z.null()]),
	tenant_id: z.number().int().min(1),
});
const openApiEndpoint58 = createMetabaseEndpoint(
	'ee.putAiControlsUsageTenantByTenantId',
	openApiInput58,
	openApiOutput58,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath(
			'/api/ee/ai-controls/usage/tenant/{tenant-id}',
			input.path,
		),
		body: input.body,
	}),
);

const openApiInput59 = z.object({}).strict();
const openApiOutput59 = z.array(
	z.union([
		z.object({
			enabled: z.boolean(),
			id: z.number().int().min(1),
			name: z.string().min(1),
			slug: z.string().min(1),
			updated_at: z.json(),
			version: z.number().int().min(1),
			created_at: z.json(),
			bundle_hash: z.union([z.string(), z.null()]),
			allowed_hosts: z.array(z.string()),
			outdated: z.boolean(),
			resource_collection_id: z.number().int().min(1),
			description: z.union([z.string(), z.null()]),
			bundle_path: z.string().min(1),
		}),
		z
			.object({
				enabled: z.boolean(),
				id: z.number().int().min(1),
				name: z.string().min(1),
				outdated: z.boolean(),
				slug: z.string().min(1),
			})
			.strict(),
	]),
);
const openApiEndpoint59 = createMetabaseEndpoint(
	'ee.getApps',
	openApiInput59,
	openApiOutput59,
	(input) => ({ method: 'GET', path: '/api/ee/apps' }),
);

const openApiInput60 = z
	.object({
		body: z
			.object({
				actions: z.record(
					z.string(),
					z
						.object({
							entityId: z.string().regex(new RegExp('^[A-Za-z0-9_\\-]{21}$')),
							kind: OpenApiSchemas.MetabaseOpenApiInputSchema214,
							table: z
								.object({ id: OpenApiSchemas.MetabaseOpenApiInputSchema437 })
								.strict(),
						})
						.strict(),
				),
				collection: z.string().regex(new RegExp('^[A-Za-z0-9_\\-]{21}$')),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput60 = z.array(
	z.object({ contents: z.string(), path: z.string().min(1) }).strict(),
);
const openApiEndpoint60 = createMetabaseEndpoint(
	'ee.postAppsGenerateActions',
	openApiInput60,
	openApiOutput60,
	(input) => ({
		method: 'POST',
		path: '/api/ee/apps/generate/actions',
		body: input.body,
	}),
);

const openApiInput61 = z
	.object({
		body: z
			.object({
				collection: z.string().regex(new RegExp('^[A-Za-z0-9_\\-]{21}$')),
				queries: z.record(
					z.string(),
					z
						.object({
							entityId: z.string().regex(new RegExp('^[A-Za-z0-9_\\-]{21}$')),
							query: OpenApiSchemas.MetabaseOpenApiInputSchema283,
						})
						.strict(),
				),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput61 = z.array(
	z.object({ contents: z.string(), path: z.string().min(1) }).strict(),
);
const openApiEndpoint61 = createMetabaseEndpoint(
	'ee.postAppsGenerateQueries',
	openApiInput61,
	openApiOutput61,
	(input) => ({
		method: 'POST',
		path: '/api/ee/apps/generate/queries',
		body: input.body,
	}),
);

const openApiInput62 = z.object({}).strict();
const openApiOutput62 = z.array(
	z.object({ contents: z.string(), path: z.string().min(1) }).strict(),
);
const openApiEndpoint62 = createMetabaseEndpoint(
	'ee.getAppsGenerateSchema',
	openApiInput62,
	openApiOutput62,
	(input) => ({ method: 'GET', path: '/api/ee/apps/generate/schema' }),
);

const openApiInput63 = z.object({}).strict();
const openApiOutput63 = z.object({
	configured: z.boolean(),
	url: z.union([z.string(), z.null()]),
});
const openApiEndpoint63 = createMetabaseEndpoint(
	'ee.getAppsRepoStatus',
	openApiInput63,
	openApiOutput63,
	(input) => ({ method: 'GET', path: '/api/ee/apps/repo-status' }),
);

const openApiInput64 = z.object({}).strict();
const openApiOutput64 = MetabaseBinaryResponseSchema;
const openApiEndpoint64 = createMetabaseEndpoint(
	'ee.getAppsSandboxHost',
	openApiInput64,
	openApiOutput64,
	(input) => ({
		method: 'GET',
		path: '/api/ee/apps/sandbox-host',
		responseType: 'binary',
	}),
);

const openApiInput65 = z
	.object({
		path: z.object({ slug: z.string().min(1) }).strict(),
		body: z.object({ enabled: z.boolean() }).strict().optional(),
	})
	.strict();
const openApiOutput65 = z.object({
	enabled: z.boolean(),
	id: z.number().int().min(1),
	name: z.string().min(1),
	slug: z.string().min(1),
	updated_at: z.json(),
	version: z.number().int().min(1),
	created_at: z.json(),
	bundle_hash: z.union([z.string(), z.null()]),
	allowed_hosts: z.array(z.string()),
	outdated: z.boolean(),
	resource_collection_id: z.number().int().min(1),
	description: z.union([z.string(), z.null()]),
	bundle_path: z.string().min(1),
});
const openApiEndpoint65 = createMetabaseEndpoint(
	'ee.putAppsBySlug',
	openApiInput65,
	openApiOutput65,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath('/api/ee/apps/{slug}', input.path),
		body: input.body,
	}),
);

const openApiInput66 = z
	.object({ path: z.object({ slug: z.string().min(1) }).strict() })
	.strict();
const openApiOutput66 = z.union([
	z.object({
		enabled: z.boolean(),
		id: z.number().int().min(1),
		name: z.string().min(1),
		slug: z.string().min(1),
		updated_at: z.json(),
		version: z.number().int().min(1),
		created_at: z.json(),
		bundle_hash: z.union([z.string(), z.null()]),
		allowed_hosts: z.array(z.string()),
		outdated: z.boolean(),
		resource_collection_id: z.number().int().min(1),
		description: z.union([z.string(), z.null()]),
		bundle_path: z.string().min(1),
	}),
	z
		.object({
			enabled: z.boolean(),
			id: z.number().int().min(1),
			name: z.string().min(1),
			outdated: z.boolean(),
			slug: z.string().min(1),
		})
		.strict(),
]);
const openApiEndpoint66 = createMetabaseEndpoint(
	'ee.getAppsBySlug',
	openApiInput66,
	openApiOutput66,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/ee/apps/{slug}', input.path),
	}),
);

const openApiInput67 = z
	.object({ path: z.object({ slug: z.string().min(1) }).strict() })
	.strict();
const openApiOutput67 = MetabaseBinaryResponseSchema;
const openApiEndpoint67 = createMetabaseEndpoint(
	'ee.getAppsBySlugBundle',
	openApiInput67,
	openApiOutput67,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/ee/apps/{slug}/bundle', input.path),
		responseType: 'binary',
	}),
);

const openApiInput68 = z
	.object({ path: z.object({ slug: z.string().min(1) }).strict() })
	.strict();
const openApiOutput68 = z.array(
	z.object({
		group_id: z.number().int().min(1),
		missing_tables: z.array(
			z.object({
				database_id: z.number().int().min(1),
				database_name: z.string(),
				id: z.number().int().min(1),
				name: z.string(),
				schema: z.union([z.string(), z.null()]),
			}),
		),
	}),
);
const openApiEndpoint68 = createMetabaseEndpoint(
	'ee.getAppsBySlugGroupPermissionWarnings',
	openApiInput68,
	openApiOutput68,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/ee/apps/{slug}/group-permission-warnings',
			input.path,
		),
	}),
);

const openApiInput69 = z
	.object({ path: z.object({ slug: z.string().min(1) }).strict() })
	.strict();
const openApiOutput69 = z.array(
	z.object({
		id: z.number().int().min(1),
		member_count: z.number().int().min(0),
		name: z.string(),
	}),
);
const openApiEndpoint69 = createMetabaseEndpoint(
	'ee.getAppsBySlugGroups',
	openApiInput69,
	openApiOutput69,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/ee/apps/{slug}/groups', input.path),
	}),
);

const openApiInput70 = z
	.object({
		path: z.object({ slug: z.string().min(1) }).strict(),
		body: z
			.object({ group_ids: z.array(z.number().int().min(1)).min(1).max(100) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput70 = z.array(
	z.object({
		id: z.number().int().min(1),
		member_count: z.number().int().min(0),
		name: z.string(),
	}),
);
const openApiEndpoint70 = createMetabaseEndpoint(
	'ee.postAppsBySlugGroups',
	openApiInput70,
	openApiOutput70,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath('/api/ee/apps/{slug}/groups', input.path),
		body: input.body,
	}),
);

const openApiInput71 = z
	.object({
		path: z
			.object({ slug: z.string().min(1), 'group-id': z.number().int().min(1) })
			.strict(),
	})
	.strict();
const openApiOutput71 = z.null();
const openApiEndpoint71 = createMetabaseEndpoint(
	'ee.deleteAppsBySlugGroupsByGroupId',
	openApiInput71,
	openApiOutput71,
	(input) => ({
		method: 'DELETE',
		path: buildMetabasePath(
			'/api/ee/apps/{slug}/groups/{group-id}',
			input.path,
		),
	}),
);

const openApiInput72 = z.object({}).strict();
const openApiOutput72 = MetabaseBinaryResponseSchema;
const openApiEndpoint72 = createMetabaseEndpoint(
	'ee.postAuditAppAnalyticsDevExport',
	openApiInput72,
	openApiOutput72,
	(input) => ({
		method: 'POST',
		path: '/api/ee/audit-app/analytics-dev/export',
		responseType: 'binary',
		requestTimeoutMs: 120000,
	}),
);

const openApiInput73 = z
	.object({
		path: z
			.object({
				'product-type': z.union([
					z.literal('metabase-ai'),
					z.literal('metabase-ai-tiered'),
					z.literal('metabase-ai-managed'),
					z.literal('python-execution'),
					z.literal('transforms'),
					z.literal('transforms-basic'),
					z.literal('transforms-advanced'),
					z.literal('transforms-basic-metered'),
					z.literal('transforms-advanced-metered'),
					z.literal('dwh-rent'),
					z.literal('etl-connections'),
				]),
			})
			.strict(),
	})
	.strict();
const openApiOutput73 = z.object({ body: z.json(), status: z.number().int() });
const openApiEndpoint73 = createMetabaseEndpoint(
	'ee.deleteCloudAddOnsByProductType',
	openApiInput73,
	openApiOutput73,
	(input) => ({
		method: 'DELETE',
		path: buildMetabasePath('/api/ee/cloud-add-ons/{product-type}', input.path),
	}),
);

const openApiInput74 = z
	.object({
		query: z
			.object({
				'include-personal-collections': z.boolean().optional(),
				'sort-column': z
					.union([
						z.literal('detected-at'),
						z.literal('entity-type'),
						z.literal('name'),
						z.literal('created-at'),
						z.literal('created-by'),
						z.literal('collection-name'),
						z.literal('duplicate-count'),
					])
					.optional(),
				'sort-direction': z
					.union([z.literal('desc'), z.literal('asc')])
					.optional(),
				'entity-types': z
					.union([
						z.union([
							z.literal('transform'),
							z.literal('question'),
							z.literal('dashboard'),
							z.literal('card'),
							z.literal('document'),
							z.literal('collection'),
							z.literal('metric'),
							z.literal('model'),
						]),
						z.array(
							z.union([
								z.literal('transform'),
								z.literal('question'),
								z.literal('dashboard'),
								z.literal('card'),
								z.literal('document'),
								z.literal('collection'),
								z.literal('metric'),
								z.literal('model'),
							]),
						),
					])
					.optional(),
				'min-duplicate-count': z.number().int().min(1).optional(),
				query: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput74 = z.object({
	data: z.array(
		z.object({
			entity_display_name: z.union([z.string(), z.null()]),
			collection_name: z.union([z.string(), z.null()]),
			detected_at: z.string().datetime({ offset: true }),
			entity_id: z.number().int(),
			id: z.number().int(),
			duplicate_count: z.number().int(),
			finding_type: z.string(),
			card_type: z.union([z.string(), z.null()]).optional(),
			can_write: z.boolean(),
			details: z.object({
				collection: z.union([
					z
						.object({
							effective_ancestors: z.array(
								z
									.object({
										id: z.union([z.number().int(), z.literal('root')]),
										name: z.union([z.string(), z.string()]),
									})
									.strict(),
							),
							id: z.union([z.number().int(), z.literal('root')]),
							name: z.union([z.string(), z.string()]),
							namespace: z.union([z.string(), z.null()]),
						})
						.strict(),
					z.null(),
				]),
				creator: z.union([
					z
						.object({
							id: z.number().int(),
							name: z.union([z.string(), z.null()]),
							type: z.literal('user'),
						})
						.strict(),
					z.null(),
				]),
				description: z.union([z.string(), z.null()]),
				duplicate_entities: z.array(
					z.object({
						card_type: z.union([z.string(), z.null()]).optional(),
						display: z.union([z.string(), z.null()]).optional(),
						entity_type: z.string(),
						id: z.number().int(),
						name: z.union([z.string(), z.null()]),
						namespace: z.union([z.string(), z.null()]).optional(),
						view_count: z.number().int().optional(),
					}),
				),
				normalized_name: z.string(),
				owner: z.union([
					z.object({
						email: z.union([z.string(), z.null()]).optional(),
						id: z.union([z.number().int(), z.null()]).optional(),
						name: z.union([z.string(), z.null()]).optional(),
						type: z.string(),
					}),
					z.null(),
				]),
				view_count: z.number().int().optional(),
			}),
			created_at: z.union([z.string().datetime({ offset: true }), z.null()]),
			display: z.union([z.string(), z.null()]).optional(),
			entity_type: z.string(),
			entity_kind: z.string(),
		}),
	),
	last_scan_at: z.union([z.string().datetime({ offset: true }), z.null()]),
	limit: z.union([z.number().int(), z.null()]),
	offset: z.union([z.number().int(), z.null()]),
	total: z.number().int(),
});
const openApiEndpoint74 = createMetabaseEndpoint(
	'ee.getContentDiagnosticsDuplicated',
	openApiInput74,
	openApiOutput74,
	(input) => ({
		method: 'GET',
		path: '/api/ee/content-diagnostics/duplicated',
		query: input.query,
	}),
);

const openApiInput75 = z
	.object({
		query: z
			.object({
				'include-personal-collections': z.boolean().optional(),
				'sort-column': z
					.union([
						z.literal('detected-at'),
						z.literal('entity-type'),
						z.literal('name'),
						z.literal('created-at'),
						z.literal('created-by'),
						z.literal('collection-name'),
						z.literal('content-count'),
						z.literal('finding-type'),
					])
					.optional(),
				'sort-direction': z
					.union([z.literal('desc'), z.literal('asc')])
					.optional(),
				'entity-types': z
					.union([
						z.union([
							z.literal('transform'),
							z.literal('question'),
							z.literal('dashboard'),
							z.literal('card'),
							z.literal('document'),
							z.literal('collection'),
							z.literal('metric'),
							z.literal('model'),
						]),
						z.array(
							z.union([
								z.literal('transform'),
								z.literal('question'),
								z.literal('dashboard'),
								z.literal('card'),
								z.literal('document'),
								z.literal('collection'),
								z.literal('metric'),
								z.literal('model'),
							]),
						),
					])
					.optional(),
				'finding-types': z
					.union([
						z.union([
							z.literal('crowded'),
							z.literal('empty'),
							z.literal('sparse'),
						]),
						z.array(
							z.union([
								z.literal('crowded'),
								z.literal('empty'),
								z.literal('sparse'),
							]),
						),
					])
					.optional(),
				query: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput75 = z.object({
	data: z.array(
		z.object({
			entity_display_name: z.union([z.string(), z.null()]),
			collection_name: z.union([z.string(), z.null()]),
			detected_at: z.string().datetime({ offset: true }),
			entity_id: z.number().int(),
			id: z.number().int(),
			finding_type: z.string(),
			card_type: z.union([z.string(), z.null()]).optional(),
			can_write: z.boolean(),
			details: z.object({
				as_of: z.string().optional(),
				collection: z.union([
					z
						.object({
							effective_ancestors: z.array(
								z
									.object({
										id: z.union([z.number().int(), z.literal('root')]),
										name: z.union([z.string(), z.string()]),
									})
									.strict(),
							),
							id: z.union([z.number().int(), z.literal('root')]),
							name: z.union([z.string(), z.string()]),
							namespace: z.union([z.string(), z.null()]),
						})
						.strict(),
					z.null(),
				]),
				creator: z.union([
					z
						.object({
							id: z.number().int(),
							name: z.union([z.string(), z.null()]),
							type: z.literal('user'),
						})
						.strict(),
					z.null(),
				]),
				description: z.union([z.string(), z.null()]),
				owner: z.union([
					z.object({
						email: z.union([z.string(), z.null()]).optional(),
						id: z.union([z.number().int(), z.null()]).optional(),
						name: z.union([z.string(), z.null()]).optional(),
						type: z.string(),
					}),
					z.null(),
				]),
				threshold: z.number().int(),
				unit: z.string(),
				view_count: z.number().int().optional(),
			}),
			created_at: z.union([z.string().datetime({ offset: true }), z.null()]),
			display: z.union([z.string(), z.null()]).optional(),
			entity_type: z.string(),
			entity_kind: z.string(),
			content_count: z.number().int(),
		}),
	),
	last_scan_at: z.union([z.string().datetime({ offset: true }), z.null()]),
	limit: z.union([z.number().int(), z.null()]),
	offset: z.union([z.number().int(), z.null()]),
	total: z.number().int(),
});
const openApiEndpoint75 = createMetabaseEndpoint(
	'ee.getContentDiagnosticsImbalanced',
	openApiInput75,
	openApiOutput75,
	(input) => ({
		method: 'GET',
		path: '/api/ee/content-diagnostics/imbalanced',
		query: input.query,
	}),
);

const openApiInput76 = z
	.object({
		body: z
			.object({ ids: z.array(z.number().int().min(1)).min(1).max(500) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput76 = z
	.object({
		invalidated: z.array(z.number().int()),
		skipped: z.array(z.number().int()),
	})
	.strict();
const openApiEndpoint76 = createMetabaseEndpoint(
	'ee.postContentDiagnosticsInvalidate',
	openApiInput76,
	openApiOutput76,
	(input) => ({
		method: 'POST',
		path: '/api/ee/content-diagnostics/invalidate',
		body: input.body,
	}),
);

const openApiInput77 = z
	.object({
		query: z
			.object({
				'include-personal-collections': z.boolean().optional(),
				'sort-column': z
					.union([
						z.literal('detected-at'),
						z.literal('entity-type'),
						z.literal('name'),
						z.literal('created-at'),
						z.literal('created-by'),
						z.literal('collection-name'),
						z.literal('duration-ms'),
					])
					.optional(),
				'sort-direction': z
					.union([z.literal('desc'), z.literal('asc')])
					.optional(),
				'entity-types': z
					.union([
						z.union([
							z.literal('transform'),
							z.literal('question'),
							z.literal('dashboard'),
							z.literal('card'),
							z.literal('document'),
							z.literal('metric'),
							z.literal('model'),
						]),
						z.array(
							z.union([
								z.literal('transform'),
								z.literal('question'),
								z.literal('dashboard'),
								z.literal('card'),
								z.literal('document'),
								z.literal('metric'),
								z.literal('model'),
							]),
						),
					])
					.optional(),
				'min-duration-ms': z.number().int().min(1).optional(),
				query: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput77 = z.object({
	data: z.array(
		z.object({
			entity_display_name: z.union([z.string(), z.null()]),
			collection_name: z.union([z.string(), z.null()]),
			detected_at: z.string().datetime({ offset: true }),
			entity_id: z.number().int(),
			id: z.number().int(),
			finding_type: z.string(),
			card_type: z.union([z.string(), z.null()]).optional(),
			can_write: z.boolean(),
			duration_ms: z.number().int(),
			details: z.object({
				collection: z.union([
					z
						.object({
							effective_ancestors: z.array(
								z
									.object({
										id: z.union([z.number().int(), z.literal('root')]),
										name: z.union([z.string(), z.string()]),
									})
									.strict(),
							),
							id: z.union([z.number().int(), z.literal('root')]),
							name: z.union([z.string(), z.string()]),
							namespace: z.union([z.string(), z.null()]),
						})
						.strict(),
					z.null(),
				]),
				creator: z.union([
					z
						.object({
							id: z.number().int(),
							name: z.union([z.string(), z.null()]),
							type: z.literal('user'),
						})
						.strict(),
					z.null(),
				]),
				description: z.union([z.string(), z.null()]),
				owner: z.union([
					z.object({
						email: z.union([z.string(), z.null()]).optional(),
						id: z.union([z.number().int(), z.null()]).optional(),
						name: z.union([z.string(), z.null()]).optional(),
						type: z.string(),
					}),
					z.null(),
				]),
				slow_entities: z
					.array(
						z.object({
							card_type: z.union([z.string(), z.null()]).optional(),
							entity_type: z.string(),
							id: z.number().int(),
							name: z.union([z.string(), z.null()]),
							view_count: z.number().int(),
						}),
					)
					.optional(),
				threshold_ms: z.number().int().optional(),
				view_count: z.number().int().optional(),
			}),
			created_at: z.union([z.string().datetime({ offset: true }), z.null()]),
			display: z.union([z.string(), z.null()]).optional(),
			entity_type: z.string(),
			entity_kind: z.string(),
		}),
	),
	last_scan_at: z.union([z.string().datetime({ offset: true }), z.null()]),
	limit: z.union([z.number().int(), z.null()]),
	offset: z.union([z.number().int(), z.null()]),
	total: z.number().int(),
});
const openApiEndpoint77 = createMetabaseEndpoint(
	'ee.getContentDiagnosticsSlow',
	openApiInput77,
	openApiOutput77,
	(input) => ({
		method: 'GET',
		path: '/api/ee/content-diagnostics/slow',
		query: input.query,
	}),
);

const openApiInput78 = z
	.object({
		query: z
			.object({
				'include-personal-collections': z.boolean().optional(),
				'sort-column': z
					.union([
						z.literal('detected-at'),
						z.literal('entity-type'),
						z.literal('name'),
						z.literal('created-at'),
						z.literal('created-by'),
						z.literal('collection-name'),
						z.literal('last-active-at'),
					])
					.optional(),
				'sort-direction': z
					.union([z.literal('desc'), z.literal('asc')])
					.optional(),
				'entity-types': z
					.union([
						z.union([
							z.literal('transform'),
							z.literal('question'),
							z.literal('dashboard'),
							z.literal('card'),
							z.literal('document'),
							z.literal('metric'),
							z.literal('model'),
						]),
						z.array(
							z.union([
								z.literal('transform'),
								z.literal('question'),
								z.literal('dashboard'),
								z.literal('card'),
								z.literal('document'),
								z.literal('metric'),
								z.literal('model'),
							]),
						),
					])
					.optional(),
				'threshold-days': z.number().int().min(1).optional(),
				query: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput78 = z.object({
	data: z.array(
		z.object({
			entity_display_name: z.union([z.string(), z.null()]),
			collection_name: z.union([z.string(), z.null()]),
			detected_at: z.string().datetime({ offset: true }),
			entity_id: z.number().int(),
			last_active_at: z.union([
				z.string().datetime({ offset: true }),
				z.null(),
			]),
			id: z.number().int(),
			finding_type: z.string(),
			card_type: z.union([z.string(), z.null()]).optional(),
			can_write: z.boolean(),
			details: z.object({
				collection: z.union([
					z
						.object({
							effective_ancestors: z.array(
								z
									.object({
										id: z.union([z.number().int(), z.literal('root')]),
										name: z.union([z.string(), z.string()]),
									})
									.strict(),
							),
							id: z.union([z.number().int(), z.literal('root')]),
							name: z.union([z.string(), z.string()]),
							namespace: z.union([z.string(), z.null()]),
						})
						.strict(),
					z.null(),
				]),
				creator: z.union([
					z
						.object({
							id: z.number().int(),
							name: z.union([z.string(), z.null()]),
							type: z.literal('user'),
						})
						.strict(),
					z.null(),
				]),
				description: z.union([z.string(), z.null()]),
				owner: z.union([
					z.object({
						email: z.union([z.string(), z.null()]).optional(),
						id: z.union([z.number().int(), z.null()]).optional(),
						name: z.union([z.string(), z.null()]).optional(),
						type: z.string(),
					}),
					z.null(),
				]),
				threshold_days: z.number().int().optional(),
				view_count: z.number().int().optional(),
			}),
			created_at: z.union([z.string().datetime({ offset: true }), z.null()]),
			display: z.union([z.string(), z.null()]).optional(),
			entity_type: z.string(),
			entity_kind: z.string(),
		}),
	),
	last_scan_at: z.union([z.string().datetime({ offset: true }), z.null()]),
	limit: z.union([z.number().int(), z.null()]),
	offset: z.union([z.number().int(), z.null()]),
	total: z.number().int(),
});
const openApiEndpoint78 = createMetabaseEndpoint(
	'ee.getContentDiagnosticsStale',
	openApiInput78,
	openApiOutput78,
	(input) => ({
		method: 'GET',
		path: '/api/ee/content-diagnostics/stale',
		query: input.query,
	}),
);

const openApiInput79 = z
	.object({ query: z.object({ locale: z.string() }).strict() })
	.strict();
const openApiOutput79 = z.object({
	data: z.array(
		z.object({
			locale: z.string().min(1),
			msgid: z.string().min(1),
			msgstr: z.string(),
		}),
	),
});
const openApiEndpoint79 = createMetabaseEndpoint(
	'ee.getContentTranslationDictionary',
	openApiInput79,
	openApiOutput79,
	(input) => ({
		method: 'GET',
		path: '/api/ee/content-translation/dictionary',
		query: input.query,
	}),
);

const openApiInput80 = z
	.object({
		body: z
			.object({
				file: z
					.object({
						filename: z.string(),
						size: z.number().int().min(0),
						tempfile: z.instanceof(Blob),
					})
					.strict(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput80 = z.object({
	enabled: z.boolean(),
	id: z.number().int().min(1),
	updated_at: z.json(),
	status: z.union([z.literal('active'), z.literal('error')]),
	error_message: z.union([z.string(), z.null()]).optional(),
	identifier: z.string().min(1),
	display_name: z.string().min(1),
	dev_only: z.boolean(),
	created_at: z.json(),
	bundle_hash: z.union([z.string(), z.null()]).optional(),
	manifest: z.json().optional(),
	warnings: z.array(z.object({ type: z.string() })),
	dev_bundle_url: z.union([z.string(), z.null()]).optional(),
	metabase_version: z.union([z.string(), z.null()]).optional(),
	icon: z.union([z.string(), z.null()]).optional(),
});
const openApiEndpoint80 = createMetabaseEndpoint(
	'ee.postCustomVizPlugin',
	openApiInput80,
	openApiOutput80,
	(input) => ({
		method: 'POST',
		path: '/api/ee/custom-viz-plugin',
		...(input.body
			? { formData: createMetabaseMultipartFileForm(input.body.file) }
			: {}),
		requestTimeoutMs: 120000,
	}),
);

const openApiInput81 = z.object({}).strict();
const openApiOutput81 = z.array(
	z.object({
		enabled: z.boolean(),
		id: z.number().int().min(1),
		updated_at: z.json(),
		status: z.union([z.literal('active'), z.literal('error')]),
		error_message: z.union([z.string(), z.null()]).optional(),
		identifier: z.string().min(1),
		display_name: z.string().min(1),
		dev_only: z.boolean(),
		created_at: z.json(),
		bundle_hash: z.union([z.string(), z.null()]).optional(),
		manifest: z.json().optional(),
		warnings: z.array(z.object({ type: z.string() })),
		dev_bundle_url: z.union([z.string(), z.null()]).optional(),
		metabase_version: z.union([z.string(), z.null()]).optional(),
		icon: z.union([z.string(), z.null()]).optional(),
	}),
);
const openApiEndpoint81 = createMetabaseEndpoint(
	'ee.getCustomVizPlugin',
	openApiInput81,
	openApiOutput81,
	(input) => ({ method: 'GET', path: '/api/ee/custom-viz-plugin' }),
);

const openApiInput82 = z
	.object({
		body: z
			.object({
				dev_bundle_url: z.string().min(1),
				identifier: z.union([z.string().min(1), z.null()]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput82 = z.object({
	enabled: z.boolean(),
	id: z.number().int().min(1),
	updated_at: z.json(),
	status: z.union([z.literal('active'), z.literal('error')]),
	error_message: z.union([z.string(), z.null()]).optional(),
	identifier: z.string().min(1),
	display_name: z.string().min(1),
	dev_only: z.boolean(),
	created_at: z.json(),
	bundle_hash: z.union([z.string(), z.null()]).optional(),
	manifest: z.json().optional(),
	warnings: z.array(z.object({ type: z.string() })),
	dev_bundle_url: z.union([z.string(), z.null()]).optional(),
	metabase_version: z.union([z.string(), z.null()]).optional(),
	icon: z.union([z.string(), z.null()]).optional(),
});
const openApiEndpoint82 = createMetabaseEndpoint(
	'ee.postCustomVizPluginDev',
	openApiInput82,
	openApiOutput82,
	(input) => ({
		method: 'POST',
		path: '/api/ee/custom-viz-plugin/dev',
		body: input.body,
	}),
);

const openApiInput83 = z.object({}).strict();
const openApiOutput83 = z.array(
	z.object({
		bundle_url: z.string().min(1),
		id: z.number().int().min(1),
		identifier: z.string().min(1),
		display_name: z.string().min(1),
		bundle_hash: z.union([z.string(), z.null()]).optional(),
		manifest: z.json().optional(),
		warnings: z.array(z.object({ type: z.string() })),
		dev_bundle_url: z.union([z.string(), z.null()]).optional(),
		icon: z.union([z.string(), z.null()]).optional(),
	}),
);
const openApiEndpoint83 = createMetabaseEndpoint(
	'ee.getCustomVizPluginList',
	openApiInput83,
	openApiOutput83,
	(input) => ({ method: 'GET', path: '/api/ee/custom-viz-plugin/list' }),
);

const openApiInput84 = z.object({}).strict();
const openApiOutput84 = MetabaseBinaryResponseSchema;
const openApiEndpoint84 = createMetabaseEndpoint(
	'ee.getCustomVizPluginSandboxHost',
	openApiInput84,
	openApiOutput84,
	(input) => ({
		method: 'GET',
		path: '/api/ee/custom-viz-plugin/sandbox-host',
		responseType: 'binary',
	}),
);

const openApiInput85 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput85 = z.null();
const openApiEndpoint85 = createMetabaseEndpoint(
	'ee.deleteCustomVizPluginById',
	openApiInput85,
	openApiOutput85,
	(input) => ({
		method: 'DELETE',
		path: buildMetabasePath('/api/ee/custom-viz-plugin/{id}', input.path),
	}),
);

const openApiInput86 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z
			.object({ enabled: z.union([z.boolean(), z.null()]).optional() })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput86 = z.object({
	enabled: z.boolean(),
	id: z.number().int().min(1),
	updated_at: z.json(),
	status: z.union([z.literal('active'), z.literal('error')]),
	error_message: z.union([z.string(), z.null()]).optional(),
	identifier: z.string().min(1),
	display_name: z.string().min(1),
	dev_only: z.boolean(),
	created_at: z.json(),
	bundle_hash: z.union([z.string(), z.null()]).optional(),
	manifest: z.json().optional(),
	warnings: z.array(z.object({ type: z.string() })),
	dev_bundle_url: z.union([z.string(), z.null()]).optional(),
	metabase_version: z.union([z.string(), z.null()]).optional(),
	icon: z.union([z.string(), z.null()]).optional(),
});
const openApiEndpoint86 = createMetabaseEndpoint(
	'ee.putCustomVizPluginById',
	openApiInput86,
	openApiOutput86,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath('/api/ee/custom-viz-plugin/{id}', input.path),
		body: input.body,
	}),
);

const openApiInput87 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		query: z.object({ path: z.string().min(1) }).strict(),
	})
	.strict();
const openApiOutput87 = MetabaseBinaryResponseSchema;
const openApiEndpoint87 = createMetabaseEndpoint(
	'ee.getCustomVizPluginByIdAsset',
	openApiInput87,
	openApiOutput87,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/ee/custom-viz-plugin/{id}/asset', input.path),
		query: input.query,
		responseType: 'binary',
	}),
);

const openApiInput88 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z
			.object({
				file: z
					.object({
						filename: z.string(),
						size: z.number().int().min(0),
						tempfile: z.instanceof(Blob),
					})
					.strict(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput88 = z.object({
	enabled: z.boolean(),
	id: z.number().int().min(1),
	updated_at: z.json(),
	status: z.union([z.literal('active'), z.literal('error')]),
	error_message: z.union([z.string(), z.null()]).optional(),
	identifier: z.string().min(1),
	display_name: z.string().min(1),
	dev_only: z.boolean(),
	created_at: z.json(),
	bundle_hash: z.union([z.string(), z.null()]).optional(),
	manifest: z.json().optional(),
	warnings: z.array(z.object({ type: z.string() })),
	dev_bundle_url: z.union([z.string(), z.null()]).optional(),
	metabase_version: z.union([z.string(), z.null()]).optional(),
	icon: z.union([z.string(), z.null()]).optional(),
});
const openApiEndpoint88 = createMetabaseEndpoint(
	'ee.putCustomVizPluginByIdBundle',
	openApiInput88,
	openApiOutput88,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath(
			'/api/ee/custom-viz-plugin/{id}/bundle',
			input.path,
		),
		...(input.body
			? { formData: createMetabaseMultipartFileForm(input.body.file) }
			: {}),
		requestTimeoutMs: 120000,
	}),
);

const openApiInput89 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput89 = MetabaseBinaryResponseSchema;
const openApiEndpoint89 = createMetabaseEndpoint(
	'ee.getCustomVizPluginByIdBundle',
	openApiInput89,
	openApiOutput89,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/ee/custom-viz-plugin/{id}/bundle',
			input.path,
		),
		responseType: 'binary',
	}),
);

const openApiInput90 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z
			.object({ dev_bundle_url: z.union([z.string(), z.null()]) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput90 = z
	.object({ dev_bundle_url: z.union([z.string(), z.null()]) })
	.strict();
const openApiEndpoint90 = createMetabaseEndpoint(
	'ee.putCustomVizPluginByIdDevUrl',
	openApiInput90,
	openApiOutput90,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath(
			'/api/ee/custom-viz-plugin/{id}/dev-url',
			input.path,
		),
		body: input.body,
	}),
);

const openApiInput91 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput91 = z.object({
	enabled: z.boolean(),
	id: z.number().int().min(1),
	updated_at: z.json(),
	status: z.union([z.literal('active'), z.literal('error')]),
	error_message: z.union([z.string(), z.null()]).optional(),
	identifier: z.string().min(1),
	display_name: z.string().min(1),
	dev_only: z.boolean(),
	created_at: z.json(),
	bundle_hash: z.union([z.string(), z.null()]).optional(),
	manifest: z.json().optional(),
	warnings: z.array(z.object({ type: z.string() })),
	dev_bundle_url: z.union([z.string(), z.null()]).optional(),
	metabase_version: z.union([z.string(), z.null()]).optional(),
	icon: z.union([z.string(), z.null()]).optional(),
});
const openApiEndpoint91 = createMetabaseEndpoint(
	'ee.postCustomVizPluginByIdRefresh',
	openApiInput91,
	openApiOutput91,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath(
			'/api/ee/custom-viz-plugin/{id}/refresh',
			input.path,
		),
	}),
);

const openApiInput92 = z
	.object({
		query: z
			.object({ 'force-recalculation': z.boolean().optional() })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput92 = z.object({
	library: OpenApiSchemas.MetabaseOpenApiOutputSchema110,
	meta: z.object({
		calculated_at: z
			.json()
			.refine((value) => !z.null().safeParse(value).success)
			.optional(),
		embedding_model: z
			.union([
				z.object({ model_name: z.string(), provider: z.string() }),
				z.null(),
			])
			.optional(),
		format_version: z.number().int().min(1),
		formula_version: z.number().int().min(1),
		synonym_threshold: z.number(),
	}),
	metabot: OpenApiSchemas.MetabaseOpenApiOutputSchema110,
	universe: OpenApiSchemas.MetabaseOpenApiOutputSchema110,
});
const openApiEndpoint92 = createMetabaseEndpoint(
	'ee.getDataComplexityScoreComplexity',
	openApiInput92,
	openApiOutput92,
	(input) => ({
		method: 'GET',
		path: '/api/ee/data-complexity-score/complexity',
		query: input.query,
	}),
);

const openApiInput93 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema111.optional() })
	.strict();
const openApiOutput93 = OpenApiSchemas.MetabaseOpenApiOutputSchema112;
const openApiEndpoint93 = createMetabaseEndpoint(
	'ee.postDataStudioTablePublishTables',
	openApiInput93,
	openApiOutput93,
	(input) => ({
		method: 'POST',
		path: '/api/ee/data-studio/table/publish-tables',
		body: input.body,
	}),
);

const openApiInput94 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema113.optional() })
	.strict();
const openApiOutput94 = z.null();
const openApiEndpoint94 = createMetabaseEndpoint(
	'ee.postDataStudioTableUnpublishTables',
	openApiInput94,
	openApiOutput94,
	(input) => ({
		method: 'POST',
		path: '/api/ee/data-studio/table/unpublish-tables',
		body: input.body,
	}),
);

const openApiInput95 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput95 = z.union([
	z
		.object({
			published_at: z.string().datetime({ offset: true }),
			published_by: z.union([
				z
					.object({ common_name: z.string(), id: z.number().int().min(1) })
					.strict(),
				z.null(),
			]),
		})
		.strict(),
	z.null(),
]);
const openApiEndpoint95 = createMetabaseEndpoint(
	'ee.getDataStudioTableByIdPublishingInfo',
	openApiInput95,
	openApiOutput95,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/ee/data-studio/table/{id}/publishing-info',
			input.path,
		),
	}),
);

const openApiInput96 = z.object({}).strict();
const openApiOutput96 = z.object({ complete: z.boolean() });
const openApiEndpoint96 = createMetabaseEndpoint(
	'ee.getDependenciesBackfillStatus',
	openApiInput96,
	openApiOutput96,
	(input) => ({ method: 'GET', path: '/api/ee/dependencies/backfill-status' }),
);

const openApiInput97 = z
	.object({
		query: z
			.object({
				id: z.number().int().min(1).optional(),
				type: OpenApiSchemas.MetabaseOpenApiInputSchema131.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput97 = OpenApiSchemas.MetabaseOpenApiOutputSchema122;
const openApiEndpoint97 = createMetabaseEndpoint(
	'ee.getDependenciesGraph',
	openApiInput97,
	openApiOutput97,
	(input) => ({
		method: 'GET',
		path: '/api/ee/dependencies/graph',
		query: input.query,
	}),
);

const openApiInput98 = z
	.object({
		query: z
			.object({
				types: z
					.union([
						OpenApiSchemas.MetabaseOpenApiInputSchema131,
						z.array(OpenApiSchemas.MetabaseOpenApiInputSchema131),
					])
					.optional(),
				'card-types': z
					.union([
						z.union([
							z.literal('question'),
							z.literal('metric'),
							z.literal('model'),
						]),
						z.array(
							z.union([
								z.literal('question'),
								z.literal('metric'),
								z.literal('model'),
							]),
						),
					])
					.optional(),
				query: z.string().optional(),
				'include-personal-collections': z.boolean().optional(),
				'sort-column': z
					.union([
						z.literal('dependents-with-errors'),
						z.literal('dependents-errors'),
						z.literal('name'),
						z.literal('location'),
					])
					.optional(),
				'sort-direction': z
					.union([z.literal('desc'), z.literal('asc')])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput98 = z.object({
	data: z.array(OpenApiSchemas.MetabaseOpenApiOutputSchema121),
	limit: z.number().int().min(1),
	offset: z.number().int().min(0),
	total: z.number().int().min(0),
});
const openApiEndpoint98 = createMetabaseEndpoint(
	'ee.getDependenciesGraphBreaking',
	openApiInput98,
	openApiOutput98,
	(input) => ({
		method: 'GET',
		path: '/api/ee/dependencies/graph/breaking',
		query: input.query,
	}),
);

const openApiInput99 = z
	.object({
		query: z
			.object({
				id: z.number().int().min(1),
				type: OpenApiSchemas.MetabaseOpenApiInputSchema131,
				'dependent-types': z
					.union([
						OpenApiSchemas.MetabaseOpenApiInputSchema131,
						z.array(OpenApiSchemas.MetabaseOpenApiInputSchema131),
					])
					.optional(),
				'dependent-card-types': z
					.union([
						z.union([
							z.literal('question'),
							z.literal('metric'),
							z.literal('model'),
						]),
						z.array(
							z.union([
								z.literal('question'),
								z.literal('metric'),
								z.literal('model'),
							]),
						),
					])
					.optional(),
				'include-personal-collections': z.boolean().optional(),
				'sort-column': z
					.union([
						z.literal('name'),
						z.literal('view-count'),
						z.literal('location'),
					])
					.optional(),
				'sort-direction': z
					.union([z.literal('desc'), z.literal('asc')])
					.optional(),
			})
			.strict(),
	})
	.strict();
const openApiOutput99 = z.array(OpenApiSchemas.MetabaseOpenApiOutputSchema115);
const openApiEndpoint99 = createMetabaseEndpoint(
	'ee.getDependenciesGraphBroken',
	openApiInput99,
	openApiOutput99,
	(input) => ({
		method: 'GET',
		path: '/api/ee/dependencies/graph/broken',
		query: input.query,
	}),
);

const openApiInput100 = z
	.object({
		query: z
			.object({
				query: z.string().optional(),
				id: z.number().int().min(1),
				'sort-direction': z
					.union([z.literal('desc'), z.literal('asc')])
					.optional(),
				broken: z.boolean().optional(),
				type: OpenApiSchemas.MetabaseOpenApiInputSchema131,
				'include-personal-collections': z.boolean().optional(),
				'dependent-types': z
					.union([
						OpenApiSchemas.MetabaseOpenApiInputSchema131,
						z.array(OpenApiSchemas.MetabaseOpenApiInputSchema131),
					])
					.optional(),
				'dependent-card-types': z
					.union([
						z.union([
							z.literal('question'),
							z.literal('metric'),
							z.literal('model'),
						]),
						z.array(
							z.union([
								z.literal('question'),
								z.literal('metric'),
								z.literal('model'),
							]),
						),
					])
					.optional(),
				'sort-column': z
					.union([
						z.literal('name'),
						z.literal('view-count'),
						z.literal('location'),
					])
					.optional(),
			})
			.strict(),
	})
	.strict();
const openApiOutput100 = z.array(OpenApiSchemas.MetabaseOpenApiOutputSchema121);
const openApiEndpoint100 = createMetabaseEndpoint(
	'ee.getDependenciesGraphDependents',
	openApiInput100,
	openApiOutput100,
	(input) => ({
		method: 'GET',
		path: '/api/ee/dependencies/graph/dependents',
		query: input.query,
	}),
);

const openApiInput101 = z
	.object({
		query: z
			.object({
				types: z
					.union([
						OpenApiSchemas.MetabaseOpenApiInputSchema131,
						z.array(OpenApiSchemas.MetabaseOpenApiInputSchema131),
					])
					.optional(),
				'card-types': z
					.union([
						z.union([
							z.literal('question'),
							z.literal('metric'),
							z.literal('model'),
						]),
						z.array(
							z.union([
								z.literal('question'),
								z.literal('metric'),
								z.literal('model'),
							]),
						),
					])
					.optional(),
				query: z.string().optional(),
				'include-personal-collections': z.boolean().optional(),
				'sort-column': z
					.union([
						z.literal('dependents-with-errors'),
						z.literal('dependents-errors'),
						z.literal('name'),
						z.literal('location'),
					])
					.optional(),
				'sort-direction': z
					.union([z.literal('desc'), z.literal('asc')])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput101 = z.object({
	data: z.array(OpenApiSchemas.MetabaseOpenApiOutputSchema121),
	limit: z.number().int().min(1),
	offset: z.number().int().min(0),
	total: z.number().int().min(0),
});
const openApiEndpoint101 = createMetabaseEndpoint(
	'ee.getDependenciesGraphUnreferenced',
	openApiInput101,
	openApiOutput101,
	(input) => ({
		method: 'GET',
		path: '/api/ee/dependencies/graph/unreferenced',
		query: input.query,
	}),
);

const openApiInput102 = z.object({}).strict();
const openApiOutput102 = OpenApiSchemas.MetabaseOpenApiOutputSchema138;
const openApiEndpoint102 = createMetabaseEndpoint(
	'ee.getErd',
	openApiInput102,
	openApiOutput102,
	(input) => ({ method: 'GET', path: '/api/ee/erd' }),
);

const openApiInput103 = z
	.object({
		body: z
			.object({ url: z.string().min(1) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput103 = OpenApiSchemas.MetabaseOpenApiOutputSchema0;
const openApiEndpoint103 = createMetabaseEndpoint(
	'ee.postGsheetsConnection',
	openApiInput103,
	openApiOutput103,
	(input) => ({
		method: 'POST',
		path: '/api/ee/gsheets/connection',
		body: input.body,
	}),
);

const openApiInput104 = z.object({}).strict();
const openApiOutput104 = OpenApiSchemas.MetabaseOpenApiOutputSchema0;
const openApiEndpoint104 = createMetabaseEndpoint(
	'ee.getGsheetsConnection',
	openApiInput104,
	openApiOutput104,
	(input) => ({ method: 'GET', path: '/api/ee/gsheets/connection' }),
);

const openApiInput105 = z.object({}).strict();
const openApiOutput105 = z.object({ email: z.union([z.string(), z.null()]) });
const openApiEndpoint105 = createMetabaseEndpoint(
	'ee.getGsheetsServiceAccount',
	openApiInput105,
	openApiOutput105,
	(input) => ({ method: 'GET', path: '/api/ee/gsheets/service-account' }),
);

const openApiInput106 = z.object({}).strict();
const openApiOutput106 = z.union([
	OpenApiSchemas.MetabaseOpenApiOutputSchema278,
	z.object({ data: z.null() }),
]);
const openApiEndpoint106 = createMetabaseEndpoint(
	'ee.getLibrary',
	openApiInput106,
	openApiOutput106,
	(input) => ({ method: 'GET', path: '/api/ee/library' }),
);

const openApiInput107 = z
	.object({
		query: z
			.object({
				sort_by: z
					.union([
						z.union([
							z.literal('created_at'),
							z.literal('title'),
							z.literal('message_count'),
							z.literal('total_tokens'),
							z.literal('cache_read_tokens'),
							z.literal('user'),
							z.literal('profile_id'),
							z.literal('ip_address'),
						]),
						z.null(),
					])
					.optional(),
				sort_dir: z
					.union([z.union([z.literal('asc'), z.literal('desc')]), z.null()])
					.optional(),
				user_id: z.union([z.number().int().min(1), z.null()]).optional(),
				group_id: z.union([z.number().int().min(1), z.null()]).optional(),
				tenant_id: z.union([z.number().int().min(1), z.null()]).optional(),
				date: z.union([z.string(), z.null()]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput107 = z.object({
	data: z.array(
		z.object({
			sanitized_user_agent: z.union([z.string(), z.null()]),
			embedding_path: z.union([z.string(), z.null()]),
			cache_read_tokens: z.number().int().min(0),
			user: z.union([
				z.object({
					email: z.string(),
					first_name: z.union([z.string(), z.null()]),
					id: z.number().int().min(1),
					last_name: z.union([z.string(), z.null()]),
				}),
				z.null(),
			]),
			embedding_hostname: z.union([z.string(), z.null()]),
			message_count: z.number().int().min(0),
			user_message_count: z.number().int().min(0),
			profile_id: z.union([z.string(), z.null()]),
			title: z.union([z.string(), z.null()]),
			conversation_id: z
				.string()
				.regex(
					new RegExp(
						'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
					),
				),
			last_message_at: z.union([
				z.string().datetime({ offset: true }),
				z.null(),
			]),
			created_at: z.string().datetime({ offset: true }),
			ip_address: z.union([z.string(), z.null()]),
			search_count: z.number().int().min(0),
			assistant_message_count: z.number().int().min(0),
			total_tokens: z.number().int().min(0),
			query_count: z.number().int().min(0),
			user_agent: z.union([z.string(), z.null()]),
			forked_from_conversation_id: z.union([
				z
					.string()
					.regex(
						new RegExp(
							'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
						),
					),
				z.null(),
			]),
		}),
	),
	limit: z.number().int().min(0),
	offset: z.number().int().min(0),
	total: z.number().int().min(0),
});
const openApiEndpoint107 = createMetabaseEndpoint(
	'ee.getMetabotAnalyticsConversations',
	openApiInput107,
	openApiOutput107,
	(input) => ({
		method: 'GET',
		path: '/api/ee/metabot-analytics/conversations',
		query: input.query,
	}),
);

const openApiInput108 = z
	.object({
		path: z
			.object({
				id: z
					.string()
					.regex(
						new RegExp(
							'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
						),
					),
			})
			.strict(),
	})
	.strict();
const openApiOutput108 = z.object({
	queries: z.array(
		z.object({
			tables: z.array(z.string()),
			mbql: z.union([z.record(z.string(), z.json()), z.null()]),
			database_id: z.union([z.number().int().min(1), z.null()]),
			query_id: z.union([z.string(), z.null()]),
			query_type: z.union([z.literal('sql'), z.literal('notebook')]),
			display: z.union([z.string(), z.null()]),
			tool: z.union([
				z.literal('construct_notebook_query'),
				z.literal('create_sql_query'),
				z.literal('edit_sql_query'),
				z.literal('replace_sql_query'),
			]),
			call_id: z.union([z.string(), z.null()]),
			sql: z.union([z.string(), z.null()]),
			message_id: z.number().int().min(1),
		}),
	),
	sanitized_user_agent: z.union([z.string(), z.null()]),
	embedding_path: z.union([z.string(), z.null()]),
	slack_permalink: z.union([z.string(), z.null()]),
	fork_boundary_message_id: z.union([z.string(), z.null()]),
	user: z.union([
		z.object({
			email: z.string(),
			first_name: z.union([z.string(), z.null()]),
			id: z.number().int().min(1),
			last_name: z.union([z.string(), z.null()]),
		}),
		z.null(),
	]),
	embedding_hostname: z.union([z.string(), z.null()]),
	feedback: z.array(
		z.object({
			user_id: z.number().int().min(1),
			positive: z.boolean(),
			external_id: z.union([z.string(), z.null()]),
			user: z
				.union([
					z.object({
						email: z.string(),
						first_name: z.union([z.string(), z.null()]),
						id: z.number().int().min(1),
						last_name: z.union([z.string(), z.null()]),
					}),
					z.null(),
				])
				.optional(),
			id: z.number().int().min(1),
			updated_at: z.string().datetime({ offset: true }),
			issue_type: z.union([z.string(), z.null()]),
			created_at: z.string().datetime({ offset: true }),
			freeform_feedback: z.union([z.string(), z.null()]),
			message_id: z.number().int().min(1),
		}),
	),
	message_count: z.number().int().min(0),
	profile_id: z.union([z.string(), z.null()]),
	title: z.union([z.string(), z.null()]),
	conversation_id: z
		.string()
		.regex(
			new RegExp(
				'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
			),
		),
	created_at: z.string().datetime({ offset: true }),
	messages: z.array(
		z.object({
			contextTokens: z.number().int().optional(),
			externalId: z.string().optional(),
			id: z.string(),
			parent_message_id: z.union([z.string(), z.null()]),
			parts: z.array(OpenApiSchemas.MetabaseOpenApiOutputSchema598),
			role: z.union([z.literal('user'), z.literal('agent')]),
			status: OpenApiSchemas.MetabaseOpenApiOutputSchema599,
		}),
	),
	ip_address: z.union([z.string(), z.null()]),
	search_count: z.number().int().min(0),
	total_tokens: z.number().int().min(0),
	query_count: z.number().int().min(0),
	user_agent: z.union([z.string(), z.null()]),
	forked_from_conversation_id: z.union([
		z
			.string()
			.regex(
				new RegExp(
					'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
				),
			),
		z.null(),
	]),
});
const openApiEndpoint108 = createMetabaseEndpoint(
	'ee.getMetabotAnalyticsConversationsById',
	openApiInput108,
	openApiOutput108,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/ee/metabot-analytics/conversations/{id}',
			input.path,
		),
	}),
);

const openApiInput109 = z.object({}).strict();
const openApiOutput109 = z.object({
	is_locked: z.union([z.boolean(), z.null()]),
	tokens: z.union([z.number().int(), z.null()]),
	updated_at: z.union([z.string(), z.null()]),
});
const openApiEndpoint109 = createMetabaseEndpoint(
	'ee.getMetabotUsage',
	openApiInput109,
	openApiOutput109,
	(input) => ({ method: 'GET', path: '/api/ee/metabot/usage' }),
);

const openApiInput110 = z
	.object({
		query: z
			.object({ query: z.union([z.string(), z.null()]).optional() })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput110 = z
	.object({
		data: z.array(
			z
				.object({
					sso_source: z.union([z.string(), z.null()]),
					is_active: z.boolean(),
					id: z.number().int().min(1),
					email: z.string().min(1),
					is_superuser: z.boolean(),
					last_name: z.union([z.string(), z.null()]),
					first_name: z.union([z.string(), z.null()]),
					enrolled_at: z.union([
						z.string().datetime({ offset: true }),
						z.null(),
					]),
					common_name: z.string(),
				})
				.strict(),
		),
		limit: z.union([z.number().int(), z.null()]),
		offset: z.union([z.number().int(), z.null()]),
		total: z.number().int(),
	})
	.strict();
const openApiEndpoint110 = createMetabaseEndpoint(
	'ee.getMfaAdminEnrolledUsers',
	openApiInput110,
	openApiOutput110,
	(input) => ({
		method: 'GET',
		path: '/api/ee/mfa/admin/enrolled-users',
		query: input.query,
	}),
);

const openApiInput111 = z.object({}).strict();
const openApiOutput111 = z.object({
	encryption_key_set: z.boolean(),
	enrolled_count: z.number().int(),
	unenrolled_count: z.number().int(),
});
const openApiEndpoint111 = createMetabaseEndpoint(
	'ee.getMfaAdminOverview',
	openApiInput111,
	openApiOutput111,
	(input) => ({ method: 'GET', path: '/api/ee/mfa/admin/overview' }),
);

const openApiInput112 = z
	.object({
		query: z
			.object({ query: z.union([z.string(), z.null()]).optional() })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput112 = z
	.object({
		data: z.array(
			z
				.object({
					common_name: z.string(),
					email: z.string().min(1),
					first_name: z.union([z.string(), z.null()]),
					id: z.number().int().min(1),
					is_active: z.boolean(),
					is_superuser: z.boolean(),
					last_name: z.union([z.string(), z.null()]),
					sso_source: z.union([z.string(), z.null()]),
				})
				.strict(),
		),
		limit: z.union([z.number().int(), z.null()]),
		offset: z.union([z.number().int(), z.null()]),
		total: z.number().int(),
	})
	.strict();
const openApiEndpoint112 = createMetabaseEndpoint(
	'ee.getMfaAdminUnenrolledUsers',
	openApiInput112,
	openApiOutput112,
	(input) => ({
		method: 'GET',
		path: '/api/ee/mfa/admin/unenrolled-users',
		query: input.query,
	}),
);

const openApiInput113 = z
	.object({
		body: z
			.object({ password: z.string().min(1) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput113 = z.object({
	otpauth_uri: z.string().min(1),
	secret: z.string().min(1),
});
const openApiEndpoint113 = createMetabaseEndpoint(
	'ee.postMfaEnroll',
	openApiInput113,
	openApiOutput113,
	(input) => ({ method: 'POST', path: '/api/ee/mfa/enroll', body: input.body }),
);

const openApiInput114 = z
	.object({
		body: z
			.object({ code: z.string().min(1) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput114 = z.object({
	recovery_codes: z.array(z.string().min(1)),
});
const openApiEndpoint114 = createMetabaseEndpoint(
	'ee.postMfaEnrollConfirm',
	openApiInput114,
	openApiOutput114,
	(input) => ({
		method: 'POST',
		path: '/api/ee/mfa/enroll/confirm',
		body: input.body,
	}),
);

const openApiInput115 = z
	.object({
		body: z
			.object({ code: z.string().min(1) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput115 = z.object({
	recovery_codes: z.array(z.string().min(1)),
});
const openApiEndpoint115 = createMetabaseEndpoint(
	'ee.postMfaRecoveryCodes',
	openApiInput115,
	openApiOutput115,
	(input) => ({
		method: 'POST',
		path: '/api/ee/mfa/recovery-codes',
		body: input.body,
	}),
);

const openApiInput116 = z.object({}).strict();
const openApiOutput116 = z.object({
	enrolled: z.boolean(),
	method: z.union([z.string(), z.null()]),
	mfa_enabled: z.boolean(),
	pending: z.boolean(),
	recovery_codes_remaining: z.number().int(),
});
const openApiEndpoint116 = createMetabaseEndpoint(
	'ee.getMfaStatus',
	openApiInput116,
	openApiOutput116,
	(input) => ({ method: 'GET', path: '/api/ee/mfa/status' }),
);

const openApiInput117 = z
	.object({
		query: z
			.object({
				user_id: z.number().int().min(1),
				model_id: z.number().int().min(1),
				action_type: z.union([
					z.literal('card/read'),
					z.literal('card/query'),
					z.literal('card/download-data'),
				]),
			})
			.strict(),
	})
	.strict();
const openApiOutput117 = OpenApiSchemas.MetabaseOpenApiOutputSchema139;
const openApiEndpoint117 = createMetabaseEndpoint(
	'ee.getPermissionDebug',
	openApiInput117,
	openApiOutput117,
	(input) => ({
		method: 'GET',
		path: '/api/ee/permission_debug',
		query: input.query,
		requestTimeoutMs: 120000,
	}),
);

const openApiInput118 = z.object({}).strict();
const openApiOutput118 = z.object({ items: z.array(z.string()) });
const openApiEndpoint118 = createMetabaseEndpoint(
	'ee.getRemoteSyncBranches',
	openApiInput118,
	openApiOutput118,
	(input) => ({ method: 'GET', path: '/api/ee/remote-sync/branches' }),
);

const openApiInput119 = z
	.object({
		body: z
			.object({ name: z.string().min(1) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput119 = z.object({ message: z.string(), status: z.string() });
const openApiEndpoint119 = createMetabaseEndpoint(
	'ee.postRemoteSyncCreateBranch',
	openApiInput119,
	openApiOutput119,
	(input) => ({
		method: 'POST',
		path: '/api/ee/remote-sync/create-branch',
		body: input.body,
	}),
);

const openApiInput120 = z.object({}).strict();
const openApiOutput120 = z.union([
	z.object({
		progress: z.union([z.number().min(0).max(1), z.null()]),
		conflicts: z.union([z.array(z.string()), z.null()]).optional(),
		last_progress_report_at: z.json().optional(),
		id: z.number().int().min(1),
		last_heartbeat_at: z.json().optional(),
		started_at: z.json(),
		ended_at: z.json().optional(),
		initiated_by: z.union([z.number().int().min(1), z.null()]).optional(),
		cancelled: z.union([z.boolean(), z.null()]).optional(),
		status: z.union([
			z.literal('running'),
			z.literal('successful'),
			z.literal('errored'),
			z.literal('cancelled'),
			z.literal('timed-out'),
			z.literal('conflict'),
		]),
		error_message: z.union([z.string(), z.null()]).optional(),
		sync_task_type: z.union([z.literal('import'), z.literal('export')]),
		version: z.union([z.string(), z.null()]).optional(),
		initiated_by_user: z
			.union([
				z.object({
					email: z.string(),
					first_name: z.union([z.string(), z.null()]),
					id: z.number().int().min(1),
					last_name: z.union([z.string(), z.null()]),
				}),
				z.null(),
			])
			.optional(),
		outcome: z.union([z.record(z.string(), z.json()), z.null()]).optional(),
	}),
	z.null(),
]);
const openApiEndpoint120 = createMetabaseEndpoint(
	'ee.getRemoteSyncCurrentTask',
	openApiInput120,
	openApiOutput120,
	(input) => ({ method: 'GET', path: '/api/ee/remote-sync/current-task' }),
);

const openApiInput121 = z.object({}).strict();
const openApiOutput121 = z.object({
	progress: z.union([z.number().min(0).max(1), z.null()]),
	conflicts: z.union([z.array(z.string()), z.null()]).optional(),
	last_progress_report_at: z.json().optional(),
	id: z.number().int().min(1),
	last_heartbeat_at: z.json().optional(),
	started_at: z.json(),
	ended_at: z.json().optional(),
	initiated_by: z.union([z.number().int().min(1), z.null()]).optional(),
	cancelled: z.union([z.boolean(), z.null()]).optional(),
	status: z.union([
		z.literal('running'),
		z.literal('successful'),
		z.literal('errored'),
		z.literal('cancelled'),
		z.literal('timed-out'),
		z.literal('conflict'),
	]),
	error_message: z.union([z.string(), z.null()]).optional(),
	sync_task_type: z.union([z.literal('import'), z.literal('export')]),
	version: z.union([z.string(), z.null()]).optional(),
	initiated_by_user: z
		.union([
			z.object({
				email: z.string(),
				first_name: z.union([z.string(), z.null()]),
				id: z.number().int().min(1),
				last_name: z.union([z.string(), z.null()]),
			}),
			z.null(),
		])
		.optional(),
	outcome: z.union([z.record(z.string(), z.json()), z.null()]).optional(),
});
const openApiEndpoint121 = createMetabaseEndpoint(
	'ee.postRemoteSyncCurrentTaskCancel',
	openApiInput121,
	openApiOutput121,
	(input) => ({
		method: 'POST',
		path: '/api/ee/remote-sync/current-task/cancel',
	}),
);

const openApiInput122 = z.object({}).strict();
const openApiOutput122 = z.object({
	dirty: z.array(
		z.object({
			table_name: z.union([z.string(), z.null()]).optional(),
			model: z.string(),
			authority_level: z.union([z.string(), z.null()]).optional(),
			id: z.number().int(),
			card_id: z.union([z.number().int().min(1), z.null()]).optional(),
			name: z.union([z.string(), z.null()]),
			updated_at: z.json().optional(),
			table_id: z.union([z.number().int().min(1), z.null()]).optional(),
			query_type: z.union([z.string(), z.null()]).optional(),
			collection_id: z.union([z.number().int().min(1), z.null()]).optional(),
			created_at: z.json().optional(),
			display: z.union([z.string(), z.null()]).optional(),
			sync_status: z.string(),
			description: z.union([z.string(), z.null()]).optional(),
		}),
	),
});
const openApiEndpoint122 = createMetabaseEndpoint(
	'ee.getRemoteSyncDirty',
	openApiInput122,
	openApiOutput122,
	(input) => ({ method: 'GET', path: '/api/ee/remote-sync/dirty' }),
);

const openApiInput123 = z
	.object({
		body: z
			.object({
				branch: z.string().min(1),
				force: z.boolean().optional(),
				merge: z.boolean().optional(),
				message: z.string().min(1).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput123 = z.object({
	message: z.string(),
	task_id: z.number().int().min(1),
});
const openApiEndpoint123 = createMetabaseEndpoint(
	'ee.postRemoteSyncExport',
	openApiInput123,
	openApiOutput123,
	(input) => ({
		method: 'POST',
		path: '/api/ee/remote-sync/export',
		body: input.body,
	}),
);

const openApiInput124 = z
	.object({ query: z.object({ branch: z.string().min(1) }).strict() })
	.strict();
const openApiOutput124 = z.object({
	clean: z.boolean(),
	conflicts: z.array(z.string()),
	force_push_casualties: z.object({
		deleted: z.array(z.string()),
		overwritten: z.array(z.string()),
	}),
	has_changes: z.boolean(),
	reason: z.union([z.string(), z.null()]),
	summary: z.object({
		added: z.number().int(),
		removed: z.number().int(),
		updated: z.number().int(),
	}),
});
const openApiEndpoint124 = createMetabaseEndpoint(
	'ee.getRemoteSyncExportPreflight',
	openApiInput124,
	openApiOutput124,
	(input) => ({
		method: 'GET',
		path: '/api/ee/remote-sync/export-preflight',
		query: input.query,
	}),
);

const openApiInput125 = z
	.object({
		query: z
			.object({ 'force-refresh': z.boolean().optional() })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput125 = z.object({
	branch_missing: z.boolean().optional(),
	cached: z.boolean(),
	has_changes: z.boolean(),
	local_version: z.union([z.string(), z.null()]),
	remote_version: z.union([z.string(), z.null()]),
});
const openApiEndpoint125 = createMetabaseEndpoint(
	'ee.getRemoteSyncHasRemoteChanges',
	openApiInput125,
	openApiOutput125,
	(input) => ({
		method: 'GET',
		path: '/api/ee/remote-sync/has-remote-changes',
		query: input.query,
	}),
);

const openApiInput126 = z
	.object({
		body: z
			.object({
				branch: z.string().min(1).optional(),
				expected_branch: z.string().min(1).optional(),
				force: z.boolean().optional(),
				merge: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput126 = z.object({
	message: z.union([z.string(), z.null()]).optional(),
	status: z.literal('success'),
	task_id: z.union([z.number().int().min(1), z.null()]),
});
const openApiEndpoint126 = createMetabaseEndpoint(
	'ee.postRemoteSyncImport',
	openApiInput126,
	openApiOutput126,
	(input) => ({
		method: 'POST',
		path: '/api/ee/remote-sync/import',
		body: input.body,
	}),
);

const openApiInput127 = z.object({}).strict();
const openApiOutput127 = z.object({ is_dirty: z.boolean() });
const openApiEndpoint127 = createMetabaseEndpoint(
	'ee.getRemoteSyncIsDirty',
	openApiInput127,
	openApiOutput127,
	(input) => ({ method: 'GET', path: '/api/ee/remote-sync/is-dirty' }),
);

const openApiInput128 = z
	.object({
		body: z
			.object({
				collections: z
					.union([z.record(z.string(), z.boolean()), z.null()])
					.optional(),
				'remote-sync-auto-import': z.union([z.boolean(), z.null()]).optional(),
				'remote-sync-branch': z.union([z.string(), z.null()]).optional(),
				'remote-sync-token': z.union([z.string(), z.null()]).optional(),
				'remote-sync-transforms': z.union([z.boolean(), z.null()]).optional(),
				'remote-sync-type': z
					.union([
						z.union([z.literal('read-only'), z.literal('read-write')]),
						z.null(),
					])
					.optional(),
				'remote-sync-url': z.union([z.string(), z.null()]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput128 = z.object({
	success: z.boolean(),
	task_id: z.number().int().min(1).optional(),
});
const openApiEndpoint128 = createMetabaseEndpoint(
	'ee.putRemoteSyncSettings',
	openApiInput128,
	openApiOutput128,
	(input) => ({
		method: 'PUT',
		path: '/api/ee/remote-sync/settings',
		body: input.body,
	}),
);

const openApiInput129 = z
	.object({
		body: z
			.object({ message: z.string().min(1), new_branch: z.string().min(1) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput129 = z.object({
	message: z.string(),
	status: z.string(),
	task_id: z.number().int().min(1),
});
const openApiEndpoint129 = createMetabaseEndpoint(
	'ee.postRemoteSyncStash',
	openApiInput129,
	openApiOutput129,
	(input) => ({
		method: 'POST',
		path: '/api/ee/remote-sync/stash',
		body: input.body,
	}),
);

const openApiInput130 = z
	.object({
		body: z
			.object({
				'remote-sync-token': z.union([z.string(), z.null()]).optional(),
				'remote-sync-url': z.union([z.string(), z.null()]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput130 = z.object({ status: z.literal('success') });
const openApiEndpoint130 = createMetabaseEndpoint(
	'ee.postRemoteSyncTestConnection',
	openApiInput130,
	openApiOutput130,
	(input) => ({
		method: 'POST',
		path: '/api/ee/remote-sync/test-connection',
		body: input.body,
	}),
);

const openApiInput131 = z
	.object({
		body: z
			.object({
				source_entity_id: OpenApiSchemas.MetabaseOpenApiInputSchema147,
				source_entity_type: OpenApiSchemas.MetabaseOpenApiInputSchema148,
				target_entity_id: OpenApiSchemas.MetabaseOpenApiInputSchema147,
				target_entity_type: OpenApiSchemas.MetabaseOpenApiInputSchema148,
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput131 = OpenApiSchemas.MetabaseOpenApiOutputSchema140;
const openApiEndpoint131 = createMetabaseEndpoint(
	'ee.postReplacementCheckReplaceSource',
	openApiInput131,
	openApiOutput131,
	(input) => ({
		method: 'POST',
		path: '/api/ee/replacement/check-replace-source',
		body: input.body,
	}),
);

const openApiInput132 = z
	.object({
		body: z
			.object({
				card_id: OpenApiSchemas.MetabaseOpenApiInputSchema147,
				target_collection_id: z
					.union([OpenApiSchemas.MetabaseOpenApiInputSchema147, z.null()])
					.optional(),
				transform_name: z.string(),
				transform_tag_ids: z
					.union([z.array(z.number().int().min(1)), z.null()])
					.optional(),
				transform_target: OpenApiSchemas.MetabaseOpenApiInputSchema706,
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput132 = z.object({
	body: z
		.object({ run_id: OpenApiSchemas.MetabaseOpenApiOutputSchema145 })
		.strict(),
	status: z.literal(202),
});
const openApiEndpoint132 = createMetabaseEndpoint(
	'ee.postReplacementReplaceModelWithTransform',
	openApiInput132,
	openApiOutput132,
	(input) => ({
		method: 'POST',
		path: '/api/ee/replacement/replace-model-with-transform',
		body: input.body,
	}),
);

const openApiInput133 = z
	.object({
		body: z
			.object({
				source_entity_id: OpenApiSchemas.MetabaseOpenApiInputSchema147,
				source_entity_type: OpenApiSchemas.MetabaseOpenApiInputSchema148,
				target_entity_id: OpenApiSchemas.MetabaseOpenApiInputSchema147,
				target_entity_type: OpenApiSchemas.MetabaseOpenApiInputSchema148,
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput133 = z.object({
	body: z
		.object({ run_id: OpenApiSchemas.MetabaseOpenApiOutputSchema145 })
		.strict(),
	status: z.literal(202),
});
const openApiEndpoint133 = createMetabaseEndpoint(
	'ee.postReplacementReplaceSource',
	openApiInput133,
	openApiOutput133,
	(input) => ({
		method: 'POST',
		path: '/api/ee/replacement/replace-source',
		body: input.body,
	}),
);

const openApiInput134 = z
	.object({
		query: z
			.object({ 'is-active': z.union([z.boolean(), z.null()]).optional() })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput134 = z.array(OpenApiSchemas.MetabaseOpenApiOutputSchema144);
const openApiEndpoint134 = createMetabaseEndpoint(
	'ee.getReplacementRuns',
	openApiInput134,
	openApiOutput134,
	(input) => ({
		method: 'GET',
		path: '/api/ee/replacement/runs',
		query: input.query,
	}),
);

const openApiInput135 = z
	.object({
		path: z
			.object({ id: OpenApiSchemas.MetabaseOpenApiInputSchema145 })
			.strict(),
	})
	.strict();
const openApiOutput135 = OpenApiSchemas.MetabaseOpenApiOutputSchema144;
const openApiEndpoint135 = createMetabaseEndpoint(
	'ee.getReplacementRunsById',
	openApiInput135,
	openApiOutput135,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/ee/replacement/runs/{id}', input.path),
	}),
);

const openApiInput136 = z
	.object({
		path: z
			.object({ id: OpenApiSchemas.MetabaseOpenApiInputSchema145 })
			.strict(),
	})
	.strict();
const openApiOutput136 = z.object({ success: z.boolean() });
const openApiEndpoint136 = createMetabaseEndpoint(
	'ee.postReplacementRunsByIdCancel',
	openApiInput136,
	openApiOutput136,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath('/api/ee/replacement/runs/{id}/cancel', input.path),
	}),
);

const openApiInput137 = z.object({}).strict();
const openApiOutput137 = z.object({
	advisories: z.array(
		z.object({
			download_jar_urls: OpenApiSchemas.MetabaseOpenApiOutputSchema678,
			published_at: z.string().datetime({ offset: true }),
			advisory_url: z.union([z.string().min(1), z.null()]),
			last_evaluated_at: z.union([
				z.string().datetime({ offset: true }),
				z.null(),
			]),
			match_status: OpenApiSchemas.MetabaseOpenApiOutputSchema679,
			acknowledged_by: z.union([
				z.object({
					common_name: z.string().min(1),
					email: z.string(),
					id: z.number().int().min(1),
				}),
				z.null(),
			]),
			title: z.string().min(1),
			affected_versions: OpenApiSchemas.MetabaseOpenApiOutputSchema676,
			remediation: z.string().min(1),
			advisory_id: OpenApiSchemas.MetabaseOpenApiOutputSchema675,
			severity: OpenApiSchemas.MetabaseOpenApiOutputSchema681,
			description: z.string().min(1),
			acknowledged_at: z.union([
				z.string().datetime({ offset: true }),
				z.null(),
			]),
		}),
	),
	last_checked_at: z.union([z.string().datetime({ offset: true }), z.null()]),
});
const openApiEndpoint137 = createMetabaseEndpoint(
	'ee.getSecurityCenter',
	openApiInput137,
	openApiOutput137,
	(input) => ({ method: 'GET', path: '/api/ee/security-center' }),
);

const openApiInput138 = z
	.object({
		body: z
			.object({ advisory_ids: z.array(z.string().min(1)) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput138 = z.array(
	z.object({
		acknowledged_at: z.union([z.string().datetime({ offset: true }), z.null()]),
		acknowledged_by: z.union([
			z.object({
				common_name: z.string().min(1),
				email: z.string(),
				id: z.number().int().min(1),
			}),
			z.null(),
		]),
		advisory_id: OpenApiSchemas.MetabaseOpenApiOutputSchema675,
		match_status: OpenApiSchemas.MetabaseOpenApiOutputSchema679,
	}),
);
const openApiEndpoint138 = createMetabaseEndpoint(
	'ee.postSecurityCenterAcknowledge',
	openApiInput138,
	openApiOutput138,
	(input) => ({
		method: 'POST',
		path: '/api/ee/security-center/acknowledge',
		body: input.body,
	}),
);

const openApiInput139 = z.object({}).strict();
const openApiOutput139 = z.object({ status: z.string().min(1) });
const openApiEndpoint139 = createMetabaseEndpoint(
	'ee.postSecurityCenterSync',
	openApiInput139,
	openApiOutput139,
	(input) => ({ method: 'POST', path: '/api/ee/security-center/sync' }),
);

const openApiInput140 = z
	.object({
		body: z
			.object({
				email_recipients: z
					.union([
						z.array(OpenApiSchemas.MetabaseOpenApiInputSchema647),
						z.null(),
					])
					.optional(),
				slack_channel: z.union([z.string(), z.null()]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput140 = z.object({ success: z.boolean() });
const openApiEndpoint140 = createMetabaseEndpoint(
	'ee.postSecurityCenterTestNotification',
	openApiInput140,
	openApiOutput140,
	(input) => ({
		method: 'POST',
		path: '/api/ee/security-center/test-notification',
		body: input.body,
	}),
);

const openApiInput141 = z
	.object({ path: z.object({ 'advisory-id': z.string().min(1) }).strict() })
	.strict();
const openApiOutput141 = z.object({
	acknowledged_at: z.union([z.string().datetime({ offset: true }), z.null()]),
	acknowledged_by: z.union([
		z.object({
			common_name: z.string().min(1),
			email: z.string(),
			id: z.number().int().min(1),
		}),
		z.null(),
	]),
	advisory_id: OpenApiSchemas.MetabaseOpenApiOutputSchema675,
	match_status: OpenApiSchemas.MetabaseOpenApiOutputSchema679,
});
const openApiEndpoint141 = createMetabaseEndpoint(
	'ee.postSecurityCenterByAdvisoryIdAcknowledge',
	openApiInput141,
	openApiOutput141,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath(
			'/api/ee/security-center/{advisory-id}/acknowledge',
			input.path,
		),
	}),
);

const openApiInput142 = z
	.object({
		query: z
			.object({
				status: z.union([z.literal('ended'), z.literal('all')]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput142 = OpenApiSchemas.MetabaseOpenApiOutputSchema153;
const openApiEndpoint142 = createMetabaseEndpoint(
	'ee.getSessionManagement',
	openApiInput142,
	openApiOutput142,
	(input) => ({
		method: 'GET',
		path: '/api/ee/session-management',
		query: input.query,
	}),
);

const openApiInput143 = z
	.object({
		body: z
			.union([OpenApiSchemas.MetabaseOpenApiInputSchema150, z.null()])
			.optional(),
	})
	.strict();
const openApiOutput143 = OpenApiSchemas.MetabaseOpenApiOutputSchema151;
const openApiEndpoint143 = createMetabaseEndpoint(
	'ee.postSessionManagementRevoke',
	openApiInput143,
	openApiOutput143,
	(input) => ({
		method: 'POST',
		path: '/api/ee/session-management/revoke',
		body: input.body,
	}),
);

const openApiInput144 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema155.optional() })
	.strict();
const openApiOutput144 = OpenApiSchemas.MetabaseOpenApiOutputSchema157;
const openApiEndpoint144 = createMetabaseEndpoint(
	'ee.postSupportAccessGrant',
	openApiInput144,
	openApiOutput144,
	(input) => ({
		method: 'POST',
		path: '/api/ee/support-access-grant',
		body: input.body,
	}),
);

const openApiInput145 = z
	.object({
		query: z
			.object({
				'ticket-number': z.union([z.string(), z.null()]).optional(),
				'user-id': z.union([z.number().int().min(1), z.null()]).optional(),
				'include-revoked': z.union([z.boolean(), z.null()]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput145 = OpenApiSchemas.MetabaseOpenApiOutputSchema158;
const openApiEndpoint145 = createMetabaseEndpoint(
	'ee.getSupportAccessGrant',
	openApiInput145,
	openApiOutput145,
	(input) => ({
		method: 'GET',
		path: '/api/ee/support-access-grant',
		query: input.query,
	}),
);

const openApiInput146 = z.object({}).strict();
const openApiOutput146 = OpenApiSchemas.MetabaseOpenApiOutputSchema156;
const openApiEndpoint146 = createMetabaseEndpoint(
	'ee.getSupportAccessGrantCurrent',
	openApiInput146,
	openApiOutput146,
	(input) => ({ method: 'GET', path: '/api/ee/support-access-grant/current' }),
);

const openApiInput147 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput147 = OpenApiSchemas.MetabaseOpenApiOutputSchema157;
const openApiEndpoint147 = createMetabaseEndpoint(
	'ee.putSupportAccessGrantByIdRevoke',
	openApiInput147,
	openApiOutput147,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath(
			'/api/ee/support-access-grant/{id}/revoke',
			input.path,
		),
	}),
);

const openApiInput148 = z
	.object({
		body: z
			.object({
				attributes: z
					.union([
						z.record(z.string(), OpenApiSchemas.MetabaseOpenApiInputSchema513),
						z.null(),
					])
					.optional(),
				name: z.string().min(1),
				slug: z.string().regex(new RegExp('^[-_a-z0-9]{1,255}$')),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput148 = z
	.object({
		attributes: z
			.union([z.record(z.string(), z.string()), z.null()])
			.optional(),
		id: z.number().int().min(1),
		is_active: z.boolean(),
		member_count: z.number().int().optional(),
		name: z.string().min(1),
		slug: z.string().regex(new RegExp('^[-_a-z0-9]{1,255}$')),
		tenant_collection_id: z.number().int().min(1),
	})
	.strict();
const openApiEndpoint148 = createMetabaseEndpoint(
	'ee.postTenant',
	openApiInput148,
	openApiOutput148,
	(input) => ({ method: 'POST', path: '/api/ee/tenant', body: input.body }),
);

const openApiInput149 = z
	.object({
		query: z
			.object({
				status: z
					.union([
						z.literal('all'),
						z.literal('deactivated'),
						z.literal('active'),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput149 = z
	.object({
		data: z.array(
			z
				.object({
					attributes: z
						.union([z.record(z.string(), z.string()), z.null()])
						.optional(),
					id: z.number().int().min(1),
					is_active: z.boolean(),
					member_count: z.number().int().optional(),
					name: z.string().min(1),
					slug: z.string().regex(new RegExp('^[-_a-z0-9]{1,255}$')),
					tenant_collection_id: z.number().int().min(1),
				})
				.strict(),
		),
	})
	.strict();
const openApiEndpoint149 = createMetabaseEndpoint(
	'ee.getTenant',
	openApiInput149,
	openApiOutput149,
	(input) => ({ method: 'GET', path: '/api/ee/tenant', query: input.query }),
);

const openApiInput150 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z
			.object({
				attributes: z
					.union([
						z.record(z.string(), OpenApiSchemas.MetabaseOpenApiInputSchema513),
						z.null(),
					])
					.optional(),
				is_active: z.union([z.boolean(), z.null()]).optional(),
				name: z.union([z.string().min(1), z.null()]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput150 = z
	.object({
		attributes: z
			.union([z.record(z.string(), z.string()), z.null()])
			.optional(),
		id: z.number().int().min(1),
		is_active: z.boolean(),
		member_count: z.number().int().optional(),
		name: z.string().min(1),
		slug: z.string().regex(new RegExp('^[-_a-z0-9]{1,255}$')),
		tenant_collection_id: z.number().int().min(1),
	})
	.strict();
const openApiEndpoint150 = createMetabaseEndpoint(
	'ee.putTenantById',
	openApiInput150,
	openApiOutput150,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath('/api/ee/tenant/{id}', input.path),
		body: input.body,
	}),
);

const openApiInput151 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput151 = z
	.object({
		attributes: z
			.union([z.record(z.string(), z.string()), z.null()])
			.optional(),
		id: z.number().int().min(1),
		is_active: z.boolean(),
		member_count: z.number().int().optional(),
		name: z.string().min(1),
		slug: z.string().regex(new RegExp('^[-_a-z0-9]{1,255}$')),
		tenant_collection_id: z.number().int().min(1),
	})
	.strict();
const openApiEndpoint151 = createMetabaseEndpoint(
	'ee.getTenantById',
	openApiInput151,
	openApiOutput151,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/ee/tenant/{id}', input.path),
	}),
);

const openApiInput152 = z
	.object({
		query: z
			.object({
				'transform-id': z.union([z.number().int().min(1), z.null()]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput152 = z.array(OpenApiSchemas.MetabaseOpenApiOutputSchema168);
const openApiEndpoint152 = createMetabaseEndpoint(
	'ee.getTransformTest',
	openApiInput152,
	openApiOutput152,
	(input) => ({
		method: 'GET',
		path: '/api/ee/transform-test',
		query: input.query,
	}),
);

const openApiInput153 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema167.optional() })
	.strict();
const openApiOutput153 = OpenApiSchemas.MetabaseOpenApiOutputSchema182;
const openApiEndpoint153 = createMetabaseEndpoint(
	'ee.postTransformTest',
	openApiInput153,
	openApiOutput153,
	(input) => ({
		method: 'POST',
		path: '/api/ee/transform-test',
		body: input.body,
	}),
);

const openApiInput154 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput154 = OpenApiSchemas.MetabaseOpenApiOutputSchema168;
const openApiEndpoint154 = createMetabaseEndpoint(
	'ee.getTransformTestById',
	openApiInput154,
	openApiOutput154,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/ee/transform-test/{id}', input.path),
	}),
);

const openApiInput155 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: OpenApiSchemas.MetabaseOpenApiInputSchema169.optional(),
	})
	.strict();
const openApiOutput155 = OpenApiSchemas.MetabaseOpenApiOutputSchema182;
const openApiEndpoint155 = createMetabaseEndpoint(
	'ee.putTransformTestById',
	openApiInput155,
	openApiOutput155,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath('/api/ee/transform-test/{id}', input.path),
		body: input.body,
	}),
);

const openApiInput156 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput156 = z.null();
const openApiEndpoint156 = createMetabaseEndpoint(
	'ee.deleteTransformTestById',
	openApiInput156,
	openApiOutput156,
	(input) => ({
		method: 'DELETE',
		path: buildMetabasePath('/api/ee/transform-test/{id}', input.path),
	}),
);

const openApiInput157 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		query: z
			.object({
				statuses: z
					.union([
						z.array(OpenApiSchemas.MetabaseOpenApiInputSchema179),
						z.null(),
					])
					.optional(),
				'start-time': z.union([z.string().min(1), z.null()]).optional(),
				'end-time': z.union([z.string().min(1), z.null()]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput157 = OpenApiSchemas.MetabaseOpenApiOutputSchema166;
const openApiEndpoint157 = createMetabaseEndpoint(
	'ee.getTransformTestByIdRun',
	openApiInput157,
	openApiOutput157,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/ee/transform-test/{id}/run', input.path),
		query: input.query,
	}),
);

const openApiInput158 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput158 = OpenApiSchemas.MetabaseOpenApiOutputSchema178;
const openApiEndpoint158 = createMetabaseEndpoint(
	'ee.postTransformTestByIdRun',
	openApiInput158,
	openApiOutput158,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath('/api/ee/transform-test/{id}/run', input.path),
	}),
);

const openApiInput159 = z
	.object({
		body: z
			.object({
				code: z.string(),
				output_row_limit: z
					.intersection(
						z.intersection(z.number().int(), z.number().gt(1)),
						z.number().max(100),
					)
					.optional(),
				per_input_row_limit: z
					.intersection(
						z.intersection(z.number().int(), z.number().gt(1)),
						z.number().max(100),
					)
					.optional(),
				source_tables: z
					.array(OpenApiSchemas.MetabaseOpenApiInputSchema692)
					.min(1),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput159 = z.object({
	error: z.object({ message: z.string() }).optional(),
	logs: z.string(),
	output: z
		.object({
			cols: z.array(z.object({ name: z.string() })),
			rows: z.array(z.json()),
		})
		.optional(),
});
const openApiEndpoint159 = createMetabaseEndpoint(
	'ee.postTransformsPythonTestRun',
	openApiInput159,
	openApiOutput159,
	(input) => ({
		method: 'POST',
		path: '/api/ee/transforms-python/test-run',
		body: input.body,
	}),
);

const openApiInput160 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput160 = OpenApiSchemas.MetabaseOpenApiOutputSchema192;
const openApiEndpoint160 = createMetabaseEndpoint(
	'ee.getTransformsByIdInspect',
	openApiInput160,
	openApiOutput160,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/ee/transforms/{id}/inspect', input.path),
	}),
);

const openApiInput161 = z
	.object({
		path: z
			.object({ id: z.number().int().min(1), 'lens-id': z.string().min(1) })
			.strict(),
	})
	.strict();
const openApiOutput161 = OpenApiSchemas.MetabaseOpenApiOutputSchema201;
const openApiEndpoint161 = createMetabaseEndpoint(
	'ee.getTransformsByIdInspectByLensId',
	openApiInput161,
	openApiOutput161,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/ee/transforms/{id}/inspect/{lens-id}',
			input.path,
		),
	}),
);

const openApiInput162 = z
	.object({
		path: z
			.object({ id: z.number().int().min(1), 'lens-id': z.string().min(1) })
			.strict(),
		body: z
			.object({
				lens_params: z
					.union([OpenApiSchemas.MetabaseOpenApiInputSchema185, z.null()])
					.optional(),
				query: OpenApiSchemas.MetabaseOpenApiInputSchema337,
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput162 = OpenApiSchemas.MetabaseOpenApiOutputSchema674;
const openApiEndpoint162 = createMetabaseEndpoint(
	'ee.postTransformsByIdInspectByLensIdQuery',
	openApiInput162,
	openApiOutput162,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath(
			'/api/ee/transforms/{id}/inspect/{lens-id}/query',
			input.path,
		),
		body: input.body,
		requestTimeoutMs: 120000,
	}),
);

const openApiInput163 = z.object({}).strict();
const openApiOutput163 = z
	.object({
		settings: z.record(z.string(), z.json()),
		user: OpenApiSchemas.MetabaseOpenApiOutputSchema585,
	})
	.strict();
const openApiEndpoint163 = createMetabaseEndpoint(
	'embedMcp.getBootstrap',
	openApiInput163,
	openApiOutput163,
	(input) => ({ method: 'GET', path: '/api/embed-mcp/bootstrap' }),
);

const openApiInput164 = z
	.object({
		body: z
			.object({
				conversation_data: z
					.object({
						prompt: z.union([z.string().max(10000), z.null()]).optional(),
						query: z.union([z.string().max(10000), z.null()]).optional(),
						source: z.literal('mcp'),
					})
					.strict(),
				feedback: z
					.object({
						freeform_feedback: z
							.union([z.string().max(10000), z.null()])
							.optional(),
						issue_type: z.union([z.string().max(64), z.null()]).optional(),
						positive: z.boolean(),
					})
					.strict(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput164 = z.object({ body: z.null(), status: z.literal(204) });
const openApiEndpoint164 = createMetabaseEndpoint(
	'embedMcp.postFeedback',
	openApiInput164,
	openApiOutput164,
	(input) => ({
		method: 'POST',
		path: '/api/embed-mcp/feedback',
		body: input.body,
	}),
);

const openApiInput165 = z
	.object({
		path: z
			.object({
				handle: z
					.string()
					.regex(
						new RegExp(
							'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
						),
					),
			})
			.strict(),
	})
	.strict();
const openApiOutput165 = z.object({
	prompt: z.union([z.string(), z.null()]),
	query: z.string().min(1),
});
const openApiEndpoint165 = createMetabaseEndpoint(
	'embedMcp.getQueriesByHandle',
	openApiInput165,
	openApiOutput165,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/embed-mcp/queries/{handle}', input.path),
	}),
);

const openApiInput166 = z.object({}).strict();
const openApiOutput166 = z.array(OpenApiSchemas.MetabaseOpenApiOutputSchema295);
const openApiEndpoint166 = createMetabaseEndpoint(
	'embedTheme.get',
	openApiInput166,
	openApiOutput166,
	(input) => ({ method: 'GET', path: '/api/embed-theme' }),
);

const openApiInput167 = z
	.object({
		body: z
			.object({
				name: z.string().min(1),
				settings: z.record(z.string(), z.json()),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput167 = OpenApiSchemas.MetabaseOpenApiOutputSchema295;
const openApiEndpoint167 = createMetabaseEndpoint(
	'embedTheme.post',
	openApiInput167,
	openApiOutput167,
	(input) => ({ method: 'POST', path: '/api/embed-theme', body: input.body }),
);

const openApiInput168 = z
	.object({
		body: z
			.object({
				themes: z.array(
					z
						.object({
							name: z.string().min(1),
							settings: z.record(z.string(), z.json()),
						})
						.strict(),
				),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput168 = z.null();
const openApiEndpoint168 = createMetabaseEndpoint(
	'embedTheme.postSeedDefaults',
	openApiInput168,
	openApiOutput168,
	(input) => ({
		method: 'POST',
		path: '/api/embed-theme/seed-defaults',
		body: input.body,
	}),
);

const openApiInput169 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput169 = OpenApiSchemas.MetabaseOpenApiOutputSchema295;
const openApiEndpoint169 = createMetabaseEndpoint(
	'embedTheme.getById',
	openApiInput169,
	openApiOutput169,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/embed-theme/{id}', input.path),
	}),
);

const openApiInput170 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z
			.object({
				name: z.union([z.string().min(1), z.null()]).optional(),
				settings: z
					.union([z.record(z.string(), z.json()), z.null()])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput170 = OpenApiSchemas.MetabaseOpenApiOutputSchema295;
const openApiEndpoint170 = createMetabaseEndpoint(
	'embedTheme.putById',
	openApiInput170,
	openApiOutput170,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath('/api/embed-theme/{id}', input.path),
		body: input.body,
	}),
);

const openApiInput171 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput171 = z.null();
const openApiEndpoint171 = createMetabaseEndpoint(
	'embedTheme.deleteById',
	openApiInput171,
	openApiOutput171,
	(input) => ({
		method: 'DELETE',
		path: buildMetabasePath('/api/embed-theme/{id}', input.path),
	}),
);

const openApiInput172 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput172 = OpenApiSchemas.MetabaseOpenApiOutputSchema295;
const openApiEndpoint172 = createMetabaseEndpoint(
	'embedTheme.postByIdCopy',
	openApiInput172,
	openApiOutput172,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath('/api/embed-theme/{id}/copy', input.path),
	}),
);

const openApiInput173 = z.object({}).strict();
const openApiOutput173 = z
	.object({
		checklist: z
			.object({
				'enable-tenants': z.boolean(),
				'create-models': z.boolean(),
				'sso-configured': z.boolean(),
				'configure-row-column-security': z.boolean(),
				'create-custom-theme': z.boolean(),
				'create-test-embed': z.boolean(),
				'data-permissions-and-enable-tenants': z.boolean(),
				'embed-production': z.boolean(),
				'create-dashboard': z.boolean(),
				'move-dashboard-to-shared': z.boolean(),
				'configure-ai': z.boolean(),
				'setup-data-segregation-strategy': z.boolean(),
				'create-tenants': z.boolean(),
				'add-data': z.boolean(),
				'sso-auth-manual-tested': z.boolean(),
			})
			.strict(),
		'data-isolation-strategy': z.union([
			z.union([
				z.literal('row-column-level-security'),
				z.literal('connection-impersonation'),
				z.literal('database-routing'),
			]),
			z.null(),
		]),
	})
	.strict();
const openApiEndpoint173 = createMetabaseEndpoint(
	'embeddingHub.getChecklist',
	openApiInput173,
	openApiOutput173,
	(input) => ({ method: 'GET', path: '/api/embedding-hub/checklist' }),
);

const openApiInput174 = z.object({}).strict();
const openApiOutput174 = z.array(OpenApiSchemas.MetabaseOpenApiOutputSchema296);
const openApiEndpoint174 = createMetabaseEndpoint(
	'embeddingSdk.getReact18Hosts',
	openApiInput174,
	openApiOutput174,
	(input) => ({ method: 'GET', path: '/api/embedding-sdk/react-18-hosts' }),
);

const openApiInput175 = z
	.object({
		path: z.object({ 'session-id': z.string().min(1).max(200) }).strict(),
	})
	.strict();
const openApiOutput175 = MetabaseBinaryResponseSchema;
const openApiEndpoint175 = createMetabaseEndpoint(
	'evalTrace.getBySessionId',
	openApiInput175,
	openApiOutput175,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/eval-trace/{session-id}', input.path),
		responseType: 'binary',
	}),
);

const openApiInput176 = z
	.object({
		body: z
			.object({
				blocks: z
					.union([
						z.array(
							z
								.object({
									dimensions: z
										.union([
											z.array(
												z
													.object({
														'dimension-id': z
															.string()
															.regex(
																new RegExp(
																	'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
																),
															),
														'display-name': z
															.union([z.string(), z.null()])
															.optional(),
														'effective-type': z
															.union([z.string(), z.null()])
															.optional(),
														'semantic-type': z
															.union([z.string(), z.null()])
															.optional(),
													})
													.strict(),
											),
											z.null(),
										])
										.optional(),
									metrics: z
										.union([
											z.array(
												z
													.object({
														card_id: z.number().int().min(1),
														dimension_mappings: z
															.union([
																z.array(
																	OpenApiSchemas.MetabaseOpenApiInputSchema616,
																),
																z.null(),
															])
															.optional(),
													})
													.strict(),
											),
											z.null(),
										])
										.optional(),
								})
								.strict(),
						),
						z.null(),
					])
					.optional(),
				collection_id: z.union([z.number().int().min(1), z.null()]).optional(),
				description: z.union([z.string(), z.null()]).optional(),
				name: z.string().min(1).max(254),
				prompt: z.union([z.string(), z.null()]).optional(),
				timeline_ids: z
					.union([z.array(z.number().int().min(1)), z.null()])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput176 = OpenApiSchemas.MetabaseOpenApiOutputSchema307;
const openApiEndpoint176 = createMetabaseEndpoint(
	'exploration.post',
	openApiInput176,
	openApiOutput176,
	(input) => ({ method: 'POST', path: '/api/exploration', body: input.body }),
);

const openApiInput177 = z.object({}).strict();
const openApiOutput177 = OpenApiSchemas.MetabaseOpenApiOutputSchema298;
const openApiEndpoint177 = createMetabaseEndpoint(
	'exploration.getDimensions',
	openApiInput177,
	openApiOutput177,
	(input) => ({ method: 'GET', path: '/api/exploration/dimensions' }),
);

const openApiInput178 = z.object({}).strict();
const openApiOutput178 = OpenApiSchemas.MetabaseOpenApiOutputSchema309;
const openApiEndpoint178 = createMetabaseEndpoint(
	'exploration.getMine',
	openApiInput178,
	openApiOutput178,
	(input) => ({ method: 'GET', path: '/api/exploration/mine' }),
);

const openApiInput179 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z.object({ starred: z.boolean() }).strict().optional(),
	})
	.strict();
const openApiOutput179 = z.null();
const openApiEndpoint179 = createMetabaseEndpoint(
	'exploration.putPageByIdStarred',
	openApiInput179,
	openApiOutput179,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath('/api/exploration/page/{id}/starred', input.path),
		body: input.body,
	}),
);

const openApiInput180 = z
	.object({
		body: z
			.object({
				hidden: z.boolean(),
				page_ids: z.array(z.number().int().min(1)),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput180 = z.null();
const openApiEndpoint180 = createMetabaseEndpoint(
	'exploration.putPagesHidden',
	openApiInput180,
	openApiOutput180,
	(input) => ({
		method: 'PUT',
		path: '/api/exploration/pages/hidden',
		body: input.body,
	}),
);

const openApiInput181 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		query: z
			.object({
				format: z
					.union([
						z.literal('api'),
						z.literal('csv'),
						z.literal('json'),
						z.literal('xlsx'),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput181 = z.union([
	OpenApiSchemas.MetabaseOpenApiOutputSchema304,
	MetabaseBinaryResponseSchema,
]);
const openApiEndpoint181 = createMetabaseEndpoint(
	'exploration.getQueryById',
	openApiInput181,
	openApiOutput181,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/exploration/query/{id}', input.path),
		query: input.query,
		...(input.query?.format === 'csv' || input.query?.format === 'xlsx'
			? { responseType: 'binary' as const }
			: {}),
		requestTimeoutMs: 120000,
	}),
);

const openApiInput182 = z
	.object({ path: z.object({ 'thread-id': z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput182 = OpenApiSchemas.MetabaseOpenApiOutputSchema297;
const openApiEndpoint182 = createMetabaseEndpoint(
	'exploration.postThreadByThreadIdCancel',
	openApiInput182,
	openApiOutput182,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath(
			'/api/exploration/thread/{thread-id}/cancel',
			input.path,
		),
	}),
);

const openApiInput183 = z
	.object({ path: z.object({ 'thread-id': z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput183 = OpenApiSchemas.MetabaseOpenApiOutputSchema307;
const openApiEndpoint183 = createMetabaseEndpoint(
	'exploration.postThreadByThreadIdRestart',
	openApiInput183,
	openApiOutput183,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath(
			'/api/exploration/thread/{thread-id}/restart',
			input.path,
		),
	}),
);

const openApiInput184 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput184 = OpenApiSchemas.MetabaseOpenApiOutputSchema307;
const openApiEndpoint184 = createMetabaseEndpoint(
	'exploration.getById',
	openApiInput184,
	openApiOutput184,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/exploration/{id}', input.path),
	}),
);

const openApiInput185 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z
			.object({
				archived: z.boolean().optional(),
				collection_id: z.union([z.number().int().min(1), z.null()]).optional(),
				collection_position: z
					.union([z.number().int().min(1), z.null()])
					.optional(),
				description: z.union([z.string(), z.null()]).optional(),
				name: z.string().min(1).max(254).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput185 = OpenApiSchemas.MetabaseOpenApiOutputSchema307;
const openApiEndpoint185 = createMetabaseEndpoint(
	'exploration.putById',
	openApiInput185,
	openApiOutput185,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath('/api/exploration/{id}', input.path),
		body: input.body,
	}),
);

const openApiInput186 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput186 = z.null();
const openApiEndpoint186 = createMetabaseEndpoint(
	'exploration.deleteById',
	openApiInput186,
	openApiOutput186,
	(input) => ({
		method: 'DELETE',
		path: buildMetabasePath('/api/exploration/{id}', input.path),
	}),
);

const openApiInput187 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z
			.object({
				explore_filters: z
					.array(
						z.union([
							z
								.object({
									dimension_name: z.union([z.string(), z.null()]).optional(),
									display_value: z.string().min(1),
									field_ref: OpenApiSchemas.MetabaseOpenApiInputSchema511,
									operator: z.literal('='),
									value: z.union([
										z.union([z.string(), z.number(), z.boolean()]),
										z.null(),
									]),
								})
								.strict(),
							z
								.object({
									dimension_name: z.union([z.string(), z.null()]).optional(),
									display_value: z.string().min(1),
									field_ref: OpenApiSchemas.MetabaseOpenApiInputSchema511,
									operator: z.literal('between'),
									values: z
										.array(z.json())
										.superRefine((values, ctx) =>
											validatePrefixItems(
												values,
												[
													(value) =>
														z
															.union([
																z.union([z.string(), z.number(), z.boolean()]),
																z.null(),
															])
															.safeParse(value).success,
													(value) =>
														z
															.union([
																z.union([z.string(), z.number(), z.boolean()]),
																z.null(),
															])
															.safeParse(value).success,
												],
												(value) => z.json().safeParse(value).success,
												2,
												2,
												ctx,
											),
										),
								})
								.strict(),
						]),
					)
					.min(1),
				page_id: z.number().int().min(1),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput187 = OpenApiSchemas.MetabaseOpenApiOutputSchema307;
const openApiEndpoint187 = createMetabaseEndpoint(
	'exploration.postByIdExploreFurther',
	openApiInput187,
	openApiOutput187,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath(
			'/api/exploration/{id}/explore-further',
			input.path,
		),
		body: input.body,
	}),
);

const openApiInput188 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z
			.object({
				display: z.string(),
				exploration_query_ids: z.array(z.number().int().min(1)).min(1),
				visualization_settings: z.record(z.string(), z.json()),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput188 = OpenApiSchemas.MetabaseOpenApiOutputSchema301;
const openApiEndpoint188 = createMetabaseEndpoint(
	'exploration.postByIdSummaryAppend',
	openApiInput188,
	openApiOutput188,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath('/api/exploration/{id}/summary/append', input.path),
		body: input.body,
	}),
);

const openApiInput189 = z
	.object({
		body: z
			.object({ field_ids: z.array(z.number().int().min(1)) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput189 = z.object({
	table_ids: z.array(z.number().int().min(1)),
});
const openApiEndpoint189 = createMetabaseEndpoint(
	'field.postTableIds',
	openApiInput189,
	openApiOutput189,
	(input) => ({
		method: 'POST',
		path: '/api/field/table-ids',
		body: input.body,
	}),
);

const openApiInput190 = z
	.object({
		query: z
			.object({ limit: z.number().int().min(1).optional() })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput190 = z.array(OpenApiSchemas.MetabaseOpenApiOutputSchema310);
const openApiEndpoint190 = createMetabaseEndpoint(
	'healthInspector.get',
	openApiInput190,
	openApiOutput190,
	(input) => ({
		method: 'GET',
		path: '/api/health-inspector',
		query: input.query,
	}),
);

const openApiInput191 = z
	.object({
		query: z.object({ 'transform-id': z.number().int().min(1) }).strict(),
	})
	.strict();
const openApiOutput191 = z.object({
	data: z.array(
		z
			.object({
				is_valid: z.boolean(),
				key_columns: z.array(z.string()),
				access_method: z.union([z.string(), z.null()]),
				metabase_managed: z.boolean(),
				name: z.union([z.string(), z.null()]),
				is_unique: z.boolean(),
				present_in_warehouse: z.boolean(),
				is_primary: z.boolean(),
				request: z
					.object({
						index_name: z.string().min(1),
						structured: OpenApiSchemas.MetabaseOpenApiOutputSchema317,
						transform_id: z.number().int().min(1),
						id: z.number().int().min(1),
						created_by: z.union([z.number().int().min(1), z.null()]),
						updated_at: z.json(),
						status: z.union([
							z.literal('create-pending'),
							z.literal('update-pending'),
							z.literal('delete-pending'),
							z.literal('running'),
							z.literal('succeeded'),
							z.literal('failed'),
						]),
						error_message: z.union([z.string(), z.null()]),
						created_at: z.json(),
						last_executed_at: z.json(),
					})
					.strict()
					.optional(),
				kind: z.string(),
				partial_predicate: z.union([z.string(), z.null()]),
				include_columns: z.array(z.union([z.string(), z.null()])),
			})
			.strict(),
	),
	warehouse_error: z.union([z.string(), z.null()]).optional(),
});
const openApiEndpoint191 = createMetabaseEndpoint(
	'index.get',
	openApiInput191,
	openApiOutput191,
	(input) => ({ method: 'GET', path: '/api/index', query: input.query }),
);

const openApiInput192 = z
	.object({
		body: z
			.object({
				structured: OpenApiSchemas.MetabaseOpenApiInputSchema317,
				transform_id: z.number().int().min(1),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput192 = z
	.object({
		index_name: z.string().min(1),
		structured: OpenApiSchemas.MetabaseOpenApiOutputSchema317,
		transform_id: z.number().int().min(1),
		id: z.number().int().min(1),
		created_by: z.union([z.number().int().min(1), z.null()]),
		updated_at: z.json(),
		status: z.union([
			z.literal('create-pending'),
			z.literal('update-pending'),
			z.literal('delete-pending'),
			z.literal('running'),
			z.literal('succeeded'),
			z.literal('failed'),
		]),
		error_message: z.union([z.string(), z.null()]),
		created_at: z.json(),
		last_executed_at: z.json(),
	})
	.strict();
const openApiEndpoint192 = createMetabaseEndpoint(
	'index.postRequest',
	openApiInput192,
	openApiOutput192,
	(input) => ({ method: 'POST', path: '/api/index/request', body: input.body }),
);

const openApiInput193 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput193 = z
	.object({
		index_name: z.string().min(1),
		structured: OpenApiSchemas.MetabaseOpenApiOutputSchema317,
		transform_id: z.number().int().min(1),
		id: z.number().int().min(1),
		created_by: z.union([z.number().int().min(1), z.null()]),
		updated_at: z.json(),
		status: z.union([
			z.literal('create-pending'),
			z.literal('update-pending'),
			z.literal('delete-pending'),
			z.literal('running'),
			z.literal('succeeded'),
			z.literal('failed'),
		]),
		error_message: z.union([z.string(), z.null()]),
		created_at: z.json(),
		last_executed_at: z.json(),
	})
	.strict();
const openApiEndpoint193 = createMetabaseEndpoint(
	'index.getRequestById',
	openApiInput193,
	openApiOutput193,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/index/request/{id}', input.path),
	}),
);

const openApiInput194 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z
			.object({ structured: OpenApiSchemas.MetabaseOpenApiInputSchema317 })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput194 = z
	.object({
		index_name: z.string().min(1),
		structured: OpenApiSchemas.MetabaseOpenApiOutputSchema317,
		transform_id: z.number().int().min(1),
		id: z.number().int().min(1),
		created_by: z.union([z.number().int().min(1), z.null()]),
		updated_at: z.json(),
		status: z.union([
			z.literal('create-pending'),
			z.literal('update-pending'),
			z.literal('delete-pending'),
			z.literal('running'),
			z.literal('succeeded'),
			z.literal('failed'),
		]),
		error_message: z.union([z.string(), z.null()]),
		created_at: z.json(),
		last_executed_at: z.json(),
	})
	.strict();
const openApiEndpoint194 = createMetabaseEndpoint(
	'index.putRequestById',
	openApiInput194,
	openApiOutput194,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath('/api/index/request/{id}', input.path),
		body: input.body,
	}),
);

const openApiInput195 = z
	.object({
		body: z
			.object({
				database_id: z.number().int().min(1),
				sql: z.string(),
				template_tags: z
					.record(
						z.string(),
						z
							.object({
								'card-id': z.number().int().min(1).optional(),
								type: z.string(),
							})
							.strict(),
					)
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput195 = z.object({
	card_ids: z.array(z.number().int().min(1)),
	tables: z.array(
		z.object({
			columns: z.array(
				z.object({
					database_type: z.union([z.string(), z.null()]).optional(),
					description: z.union([z.string(), z.null()]).optional(),
					fk_target: z
						.object({ field_name: z.string(), table_name: z.string() })
						.optional(),
					id: z.number().int().min(1),
					name: z.string(),
					semantic_type: z.union([z.string(), z.null()]).optional(),
				}),
			),
			description: z.union([z.string(), z.null()]).optional(),
			display_name: z.union([z.string(), z.null()]).optional(),
			id: z.number().int().min(1),
			name: z.string(),
			schema: z.union([z.string(), z.null()]).optional(),
		}),
	),
});
const openApiEndpoint195 = createMetabaseEndpoint(
	'llm.postExtractSources',
	openApiInput195,
	openApiOutput195,
	(input) => ({
		method: 'POST',
		path: '/api/llm/extract-sources',
		body: input.body,
	}),
);

const openApiInput196 = z.object({}).strict();
const openApiOutput196 = z.array(
	z.object({
		error: z.union([z.string(), z.null()]).optional(),
		key: z.string(),
		models: z.array(z.object({ display_name: z.string(), id: z.string() })),
		name: z.string(),
		type: z.string(),
	}),
);
const openApiEndpoint196 = createMetabaseEndpoint(
	'llm.getModels',
	openApiInput196,
	openApiOutput196,
	(input) => ({ method: 'GET', path: '/api/llm/models' }),
);

const openApiInput197 = z.object({}).strict();
const openApiOutput197 = z.array(
	z.object({
		managed: z.boolean(),
		singleton: z.boolean(),
		default_model: z.union([z.string(), z.null()]),
		label: z.string(),
		model_fields: z.array(z.string()),
		type: z.string(),
		fields: z.array(
			z.object({
				prefix: z.union([z.string(), z.null()]).optional(),
				placeholder: z.union([z.string(), z.null()]).optional(),
				label: z.string(),
				show_when: z
					.union([z.object({ field: z.string(), value: z.string() }), z.null()])
					.optional(),
				key: z.string(),
				advanced: z.boolean(),
				docs_url: z.union([z.string(), z.null()]).optional(),
				required: z.boolean(),
				type: z.union([
					z.literal('text'),
					z.literal('password'),
					z.literal('select'),
					z.literal('segmented'),
					z.literal('file'),
				]),
				help: z.union([z.string(), z.null()]).optional(),
				options: z
					.union([
						z.array(z.object({ label: z.string(), value: z.string() })),
						z.null(),
					])
					.optional(),
				default: z.union([z.string(), z.null()]).optional(),
			}),
		),
		models: z.array(z.object({ display_name: z.string(), id: z.string() })),
		requires: z.record(z.string(), z.array(z.string())),
		available: z.boolean(),
		required_any: z.array(z.array(z.string())),
	}),
);
const openApiEndpoint197 = createMetabaseEndpoint(
	'llm.getProviderTypes',
	openApiInput197,
	openApiOutput197,
	(input) => ({ method: 'GET', path: '/api/llm/provider-types' }),
);

const openApiInput198 = z.object({}).strict();
const openApiOutput198 = z.array(
	z.object({
		config: z.record(z.string(), z.union([z.string(), z.null()])),
		env_fields: z.array(z.string()),
		env_vars: z.array(z.string()),
		key: z.string(),
		name: z.string(),
		source: z.union([z.literal('db'), z.literal('env')]),
		type: z.string(),
		usable: z.boolean(),
	}),
);
const openApiEndpoint198 = createMetabaseEndpoint(
	'llm.getProviders',
	openApiInput198,
	openApiOutput198,
	(input) => ({ method: 'GET', path: '/api/llm/providers' }),
);

const openApiInput199 = z
	.object({
		body: z
			.object({
				config: z
					.union([
						z.record(z.string(), z.union([z.string(), z.null()])),
						z.null(),
					])
					.optional(),
				key: z.union([z.string(), z.null()]).optional(),
				model: z.union([z.string(), z.null()]).optional(),
				name: z.union([z.string(), z.null()]).optional(),
				type: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput199 = z.object({
	config: z.record(z.string(), z.union([z.string(), z.null()])),
	env_fields: z.array(z.string()),
	env_vars: z.array(z.string()),
	key: z.string(),
	name: z.string(),
	source: z.union([z.literal('db'), z.literal('env')]),
	type: z.string(),
	usable: z.boolean(),
});
const openApiEndpoint199 = createMetabaseEndpoint(
	'llm.postProviders',
	openApiInput199,
	openApiOutput199,
	(input) => ({ method: 'POST', path: '/api/llm/providers', body: input.body }),
);

const openApiInput200 = z
	.object({
		path: z.object({ key: z.string() }).strict(),
		body: z
			.object({
				config: z
					.union([
						z.record(z.string(), z.union([z.string(), z.null()])),
						z.null(),
					])
					.optional(),
				model: z.union([z.string(), z.null()]).optional(),
				name: z.union([z.string(), z.null()]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput200 = z.object({
	config: z.record(z.string(), z.union([z.string(), z.null()])),
	env_fields: z.array(z.string()),
	env_vars: z.array(z.string()),
	key: z.string(),
	name: z.string(),
	source: z.union([z.literal('db'), z.literal('env')]),
	type: z.string(),
	usable: z.boolean(),
});
const openApiEndpoint200 = createMetabaseEndpoint(
	'llm.putProvidersByKey',
	openApiInput200,
	openApiOutput200,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath('/api/llm/providers/{key}', input.path),
		body: input.body,
	}),
);

const openApiInput201 = z
	.object({ path: z.object({ key: z.string() }).strict() })
	.strict();
const openApiOutput201 = z.null();
const openApiEndpoint201 = createMetabaseEndpoint(
	'llm.deleteProvidersByKey',
	openApiInput201,
	openApiOutput201,
	(input) => ({
		method: 'DELETE',
		path: buildMetabasePath('/api/llm/providers/{key}', input.path),
	}),
);

const openApiInput202 = z.object({}).strict();
const openApiOutput202 = z.array(
	z.object({
		display_name: z.string(),
		id: z.string(),
		loggers: z.array(
			z.object({
				level: OpenApiSchemas.MetabaseOpenApiOutputSchema584,
				name: z.string(),
			}),
		),
	}),
);
const openApiEndpoint202 = createMetabaseEndpoint(
	'logger.getPresets',
	openApiInput202,
	openApiOutput202,
	(input) => ({ method: 'GET', path: '/api/logger/presets' }),
);

const openApiInput203 = z
	.object({
		body: z
			.object({
				definition: OpenApiSchemas.MetabaseOpenApiInputSchema589,
				description: z.union([z.string(), z.null()]).optional(),
				name: z.string().min(1),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput203 = OpenApiSchemas.MetabaseOpenApiOutputSchema587;
const openApiEndpoint203 = createMetabaseEndpoint(
	'measure.post',
	openApiInput203,
	openApiOutput203,
	(input) => ({ method: 'POST', path: '/api/measure', body: input.body }),
);

const openApiInput204 = z.object({}).strict();
const openApiOutput204 = z.array(OpenApiSchemas.MetabaseOpenApiOutputSchema587);
const openApiEndpoint204 = createMetabaseEndpoint(
	'measure.get',
	openApiInput204,
	openApiOutput204,
	(input) => ({ method: 'GET', path: '/api/measure' }),
);

const openApiInput205 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		query: z
			.object({
				'include-orphaned': z.union([z.boolean(), z.null()]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput205 = OpenApiSchemas.MetabaseOpenApiOutputSchema587;
const openApiEndpoint205 = createMetabaseEndpoint(
	'measure.getById',
	openApiInput205,
	openApiOutput205,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/measure/{id}', input.path),
		query: input.query,
	}),
);

const openApiInput206 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z
			.object({
				archived: z.union([z.boolean(), z.null()]).optional(),
				definition: z
					.union([OpenApiSchemas.MetabaseOpenApiInputSchema589, z.null()])
					.optional(),
				description: z.union([z.string(), z.null()]).optional(),
				name: z.union([z.string().min(1), z.null()]).optional(),
				revision_message: z.string().min(1),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput206 = OpenApiSchemas.MetabaseOpenApiOutputSchema587;
const openApiEndpoint206 = createMetabaseEndpoint(
	'measure.putById',
	openApiInput206,
	openApiOutput206,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath('/api/measure/{id}', input.path),
		body: input.body,
	}),
);

const openApiInput207 = z
	.object({
		path: z
			.object({
				id: z.number().int().min(1),
				'dimension-key': z
					.string()
					.regex(
						new RegExp(
							'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
						),
					),
			})
			.strict(),
		query: z.object({ value: z.string() }).strict(),
	})
	.strict();
const openApiOutput207 = OpenApiSchemas.MetabaseOpenApiOutputSchema588;
const openApiEndpoint207 = createMetabaseEndpoint(
	'measure.getByIdDimensionByDimensionKeyRemapping',
	openApiInput207,
	openApiOutput207,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/measure/{id}/dimension/{dimension-key}/remapping',
			input.path,
		),
		query: input.query,
	}),
);

const openApiInput208 = z
	.object({
		path: z
			.object({
				id: z.number().int().min(1),
				'dimension-key': z
					.string()
					.regex(
						new RegExp(
							'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
						),
					),
			})
			.strict(),
		query: z.object({ query: z.string().min(1) }).strict(),
	})
	.strict();
const openApiOutput208 = z.array(z.array(z.string()));
const openApiEndpoint208 = createMetabaseEndpoint(
	'measure.getByIdDimensionByDimensionKeySearch',
	openApiInput208,
	openApiOutput208,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/measure/{id}/dimension/{dimension-key}/search',
			input.path,
		),
		query: input.query,
	}),
);

const openApiInput209 = z
	.object({
		path: z
			.object({
				id: z.number().int().min(1),
				'dimension-key': z
					.string()
					.regex(
						new RegExp(
							'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
						),
					),
			})
			.strict(),
	})
	.strict();
const openApiOutput209 = z.object({
	has_more_values: z.boolean(),
	values: z.array(
		z.union([
			z
				.array(z.json())
				.superRefine((values, ctx) =>
					validatePrefixItems(
						values,
						[
							(value) =>
								z
									.union([
										z.union([
											z.string(),
											z.number(),
											z.boolean(),
											z.string().uuid(),
											z.string(),
											z.string().datetime({ offset: true }),
										]),
										z.null(),
									])
									.safeParse(value).success,
							(value) => z.string().safeParse(value).success,
						],
						(value) => z.json().safeParse(value).success,
						2,
						2,
						ctx,
					),
				),
			z
				.array(z.json())
				.superRefine((values, ctx) =>
					validatePrefixItems(
						values,
						[
							(value) =>
								z
									.union([
										z.union([
											z.string(),
											z.number(),
											z.boolean(),
											z.string().uuid(),
											z.string(),
											z.string().datetime({ offset: true }),
										]),
										z.null(),
									])
									.safeParse(value).success,
						],
						(value) => z.json().safeParse(value).success,
						1,
						1,
						ctx,
					),
				),
		]),
	),
});
const openApiEndpoint209 = createMetabaseEndpoint(
	'measure.getByIdDimensionByDimensionKeyValues',
	openApiInput209,
	openApiOutput209,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/measure/{id}/dimension/{dimension-key}/values',
			input.path,
		),
	}),
);

const openApiInput210 = z.object({}).strict();
const openApiOutput210 = z.object({
	data: z.array(
		z.object({
			conversation_id: z
				.string()
				.regex(
					new RegExp(
						'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
					),
				),
			created_at: z.string().datetime({ offset: true }),
			forked_from_conversation_id: z.union([
				z
					.string()
					.regex(
						new RegExp(
							'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
						),
					),
				z.null(),
			]),
			last_message_at: z.union([
				z.string().datetime({ offset: true }),
				z.null(),
			]),
			message_count: z.number().int().min(0),
			profile_id: z.union([z.string(), z.null()]),
			title: z.union([z.string(), z.null()]),
			user_id: z.union([z.number().int().min(1), z.null()]),
		}),
	),
	limit: z.number().int().min(0),
	offset: z.number().int().min(0),
	total: z.number().int().min(0),
});
const openApiEndpoint210 = createMetabaseEndpoint(
	'metabot.getConversations',
	openApiInput210,
	openApiOutput210,
	(input) => ({ method: 'GET', path: '/api/metabot/conversations' }),
);

const openApiInput211 = z
	.object({
		path: z
			.object({
				id: z
					.string()
					.regex(
						new RegExp(
							'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
						),
					),
			})
			.strict(),
	})
	.strict();
const openApiOutput211 = z.object({
	user_id: z.union([z.number().int().min(1), z.null()]),
	context_window_tokens: z.number().int().optional(),
	title: z.union([z.string(), z.null()]),
	conversation_id: z
		.string()
		.regex(
			new RegExp(
				'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
			),
		),
	state: z
		.union([OpenApiSchemas.MetabaseOpenApiOutputSchema604, z.null()])
		.optional(),
	created_at: z.string().datetime({ offset: true }),
	messages: z.array(OpenApiSchemas.MetabaseOpenApiOutputSchema597),
	saved_entities: z.array(
		z.object({
			card_id: z.number().int().min(1),
			chart_id: z.union([z.string(), z.null()]),
		}),
	),
	forked_from_conversation_id: z.union([
		z
			.string()
			.regex(
				new RegExp(
					'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
				),
			),
		z.null(),
	]),
});
const openApiEndpoint211 = createMetabaseEndpoint(
	'metabot.getConversationsById',
	openApiInput211,
	openApiOutput211,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/metabot/conversations/{id}', input.path),
	}),
);

const openApiInput212 = z
	.object({
		path: z
			.object({
				id: z
					.string()
					.regex(
						new RegExp(
							'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
						),
					),
			})
			.strict(),
		body: z
			.object({
				message_id: z
					.string()
					.regex(
						new RegExp(
							'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
						),
					),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput212 = z.object({
	user_id: z.union([z.number().int().min(1), z.null()]),
	context_window_tokens: z.number().int().optional(),
	title: z.union([z.string(), z.null()]),
	conversation_id: z
		.string()
		.regex(
			new RegExp(
				'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
			),
		),
	state: z
		.union([OpenApiSchemas.MetabaseOpenApiOutputSchema604, z.null()])
		.optional(),
	created_at: z.string().datetime({ offset: true }),
	messages: z.array(OpenApiSchemas.MetabaseOpenApiOutputSchema597),
	saved_entities: z.array(
		z.object({
			card_id: z.number().int().min(1),
			chart_id: z.union([z.string(), z.null()]),
		}),
	),
	forked_from_conversation_id: z.union([
		z
			.string()
			.regex(
				new RegExp(
					'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
				),
			),
		z.null(),
	]),
});
const openApiEndpoint212 = createMetabaseEndpoint(
	'metabot.postConversationsByIdFork',
	openApiInput212,
	openApiOutput212,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath('/api/metabot/conversations/{id}/fork', input.path),
		body: input.body,
	}),
);

const openApiInput213 = z
	.object({
		path: z
			.object({
				id: z
					.string()
					.regex(
						new RegExp(
							'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
						),
					),
			})
			.strict(),
		body: z
			.object({
				card: z
					.object({
						collection_id: z
							.union([z.number().int().min(1), z.null()])
							.optional(),
						dashboard_id: z
							.union([z.number().int().min(1), z.null()])
							.optional(),
						dashboard_tab_id: z
							.union([z.number().int().min(1), z.null()])
							.optional(),
						dataset_query: OpenApiSchemas.MetabaseOpenApiInputSchema337,
						description: z.union([z.string(), z.null()]).optional(),
						display: z.string().min(1),
						name: z.string().min(1),
						visualization_settings: z
							.union([z.record(z.string(), z.json()), z.null()])
							.optional(),
					})
					.strict(),
				chart_id: z.intersection(z.string().min(1), z.string().max(36)),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput213 = z.object({
	visualization_settings: z
		.union([z.record(z.string(), z.json()), z.null()])
		.optional(),
	dashboard_tab_id: z.union([z.number().int().min(1), z.null()]).optional(),
	dataset_query: OpenApiSchemas.MetabaseOpenApiOutputSchema337,
	metabot_chart_id: z.string().min(1),
	id: z.number().int().min(1),
	name: z.string().min(1),
	collection_id: z.union([z.number().int().min(1), z.null()]).optional(),
	display: z.string(),
	description: z.union([z.string(), z.null()]).optional(),
	metabot_conversation_id: z
		.string()
		.regex(
			new RegExp(
				'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
			),
		),
	dashboard_id: z.union([z.number().int().min(1), z.null()]).optional(),
});
const openApiEndpoint213 = createMetabaseEndpoint(
	'metabot.postConversationsByIdSavedEntity',
	openApiInput213,
	openApiOutput213,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath(
			'/api/metabot/conversations/{id}/saved-entity',
			input.path,
		),
		body: input.body,
	}),
);

const openApiInput214 = z
	.object({
		path: z
			.object({
				id: z
					.string()
					.regex(
						new RegExp(
							'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
						),
					),
			})
			.strict(),
	})
	.strict();
const openApiOutput214 = z.object({
	status: z.union([
		z.literal('ready'),
		z.literal('pending'),
		z.literal('missing'),
	]),
	title: z.union([z.string(), z.null()]),
});
const openApiEndpoint214 = createMetabaseEndpoint(
	'metabot.getConversationsByIdTitle',
	openApiInput214,
	openApiOutput214,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/metabot/conversations/{id}/title',
			input.path,
		),
	}),
);

const openApiInput215 = z
	.object({
		body: z
			.object({
				instructions: z.string().min(1),
				references: z.record(z.string(), z.json()).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput215 = z.object({
	description: z.union([z.string().min(1), z.null()]),
	draft_card: z.union([
		z.object({
			database_id: z.number().int().min(1),
			dataset_query: OpenApiSchemas.MetabaseOpenApiOutputSchema337,
			name: z.string().min(1),
			parameters: z.union([
				OpenApiSchemas.MetabaseOpenApiOutputSchema658,
				z.null(),
			]),
			visualization_settings: z.record(z.string(), z.json()),
		}),
		z.null(),
	]),
	error: z.union([z.string().min(1), z.null()]),
});
const openApiEndpoint215 = createMetabaseEndpoint(
	'metabot.postDocumentGenerateContent',
	openApiInput215,
	openApiOutput215,
	(input) => ({
		method: 'POST',
		path: '/api/metabot/document/generate-content',
		body: input.body,
	}),
);

const openApiInput216 = z
	.object({
		body: z
			.object({
				freeform_feedback: z.union([z.string(), z.null()]).optional(),
				issue_type: z.union([z.string(), z.null()]).optional(),
				message_id: z.string().min(1),
				metabot_id: z.number().int().min(1),
				positive: z.boolean(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput216 = z.object({ body: z.null(), status: z.literal(204) });
const openApiEndpoint216 = createMetabaseEndpoint(
	'metabot.postFeedback',
	openApiInput216,
	openApiOutput216,
	(input) => ({
		method: 'POST',
		path: '/api/metabot/feedback',
		body: input.body,
	}),
);

const openApiInput217 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput217 = z.union([
	z
		.object({
			prompt_count: z.number().int().min(1),
			status: z.literal('generated'),
		})
		.strict(),
	z.object({ status: z.literal('no-library-content') }).strict(),
	z.object({ status: z.literal('ai-produced-no-prompts') }).strict(),
]);
const openApiEndpoint217 = createMetabaseEndpoint(
	'metabot.postMetabotByIdPromptSuggestionsRegenerate',
	openApiInput217,
	openApiOutput217,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath(
			'/api/metabot/metabot/{id}/prompt-suggestions/regenerate',
			input.path,
		),
	}),
);

const openApiInput218 = z.object({}).strict();
const openApiOutput218 = z.object({
	permissions: z.object({
		metabot: z.union([z.literal('yes'), z.literal('no')]),
		'metabot-nlq': z.union([z.literal('yes'), z.literal('no')]),
		'metabot-other-tools': z.union([z.literal('yes'), z.literal('no')]),
		'metabot-sql-generation': z.union([z.literal('yes'), z.literal('no')]),
	}),
});
const openApiEndpoint218 = createMetabaseEndpoint(
	'metabot.getPermissionsUserPermissions',
	openApiInput218,
	openApiOutput218,
	(input) => ({
		method: 'GET',
		path: '/api/metabot/permissions/user-permissions',
	}),
);

const openApiInput219 = z
	.object({
		body: z
			.object({
				'metabot-slack-signing-secret': z.union([z.string().min(1), z.null()]),
				'slack-connect-client-id': z.union([z.string().min(1), z.null()]),
				'slack-connect-client-secret': z.union([z.string().min(1), z.null()]),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput219 = z.object({ ok: z.boolean() });
const openApiEndpoint219 = createMetabaseEndpoint(
	'metabot.putSlackSettings',
	openApiInput219,
	openApiOutput219,
	(input) => ({
		method: 'PUT',
		path: '/api/metabot/slack/settings',
		body: input.body,
	}),
);

const openApiInput220 = z
	.object({
		body: z
			.object({
				message_id: z.string().min(1),
				metabot_id: z.number().int().min(1),
				positive: z.boolean(),
				source_id: z.number().int().min(1),
				source_type: z.union([
					z.literal('table'),
					z.literal('card'),
					z.literal('model'),
				]),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput220 = z.object({ body: z.null(), status: z.literal(204) });
const openApiEndpoint220 = createMetabaseEndpoint(
	'metabot.postSourceFeedback',
	openApiInput220,
	openApiOutput220,
	(input) => ({
		method: 'POST',
		path: '/api/metabot/source-feedback',
		body: input.body,
	}),
);

const openApiInput221 = z.object({}).strict();
const openApiOutput221 = z.object({
	data: z.array(OpenApiSchemas.MetabaseOpenApiOutputSchema612),
	limit: z.number().int().min(1),
	offset: z.number().int().min(0),
	total: z.number().int().min(0),
});
const openApiEndpoint221 = createMetabaseEndpoint(
	'metric.get',
	openApiInput221,
	openApiOutput221,
	(input) => ({ method: 'GET', path: '/api/metric' }),
);

const openApiInput222 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema609.optional() })
	.strict();
const openApiOutput222 = OpenApiSchemas.MetabaseOpenApiOutputSchema608;
const openApiEndpoint222 = createMetabaseEndpoint(
	'metric.postBreakoutValues',
	openApiInput222,
	openApiOutput222,
	(input) => ({
		method: 'POST',
		path: '/api/metric/breakout-values',
		body: input.body,
		requestTimeoutMs: 120000,
	}),
);

const openApiInput223 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema609.optional() })
	.strict();
const openApiOutput223 = OpenApiSchemas.MetabaseOpenApiOutputSchema610;
const openApiEndpoint223 = createMetabaseEndpoint(
	'metric.postDataset',
	openApiInput223,
	openApiOutput223,
	(input) => ({
		method: 'POST',
		path: '/api/metric/dataset',
		body: input.body,
		requestTimeoutMs: 120000,
	}),
);

const openApiInput224 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		query: z
			.object({
				'include-orphaned': z.union([z.boolean(), z.null()]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput224 = OpenApiSchemas.MetabaseOpenApiOutputSchema613;
const openApiEndpoint224 = createMetabaseEndpoint(
	'metric.getById',
	openApiInput224,
	openApiOutput224,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/metric/{id}', input.path),
		query: input.query,
	}),
);

const openApiInput225 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		query: z
			.object({
				query: z.union([z.string(), z.null()]).optional(),
				'with-addable': z.union([z.boolean(), z.null()]).optional(),
				'include-orphaned': z.union([z.boolean(), z.null()]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput225 = z.object({
	addable: z.array(z.record(z.string(), z.json())),
	added: z.array(z.record(z.string(), z.json())),
});
const openApiEndpoint225 = createMetabaseEndpoint(
	'metric.getByIdDimension',
	openApiInput225,
	openApiOutput225,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/metric/{id}/dimension', input.path),
		query: input.query,
	}),
);

const openApiInput226 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z
			.object({
				dimensions: z.array(
					z
						.object({
							description: z.union([z.string(), z.null()]).optional(),
							display_name: z.string().min(1).optional(),
							id: z.string().min(1),
							mapping_target: z
								.array(z.json())
								.superRefine((values, ctx) =>
									validatePrefixItems(
										values,
										[
											(value) => z.literal('field').safeParse(value).success,
											(value) =>
												OpenApiSchemas.MetabaseOpenApiInputSchema539.safeParse(
													value,
												).success,
											(value) =>
												z
													.union([
														OpenApiSchemas.MetabaseOpenApiInputSchema387,
														OpenApiSchemas.MetabaseOpenApiInputSchema430,
													])
													.safeParse(value).success,
										],
										(value) => z.json().safeParse(value).success,
										3,
										3,
										ctx,
									),
								),
						})
						.strict(),
				),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput226 = z.array(z.record(z.string(), z.json()));
const openApiEndpoint226 = createMetabaseEndpoint(
	'metric.postByIdDimensionAdd',
	openApiInput226,
	openApiOutput226,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath('/api/metric/{id}/dimension/add', input.path),
		body: input.body,
	}),
);

const openApiInput227 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z
			.object({ dimension_ids: z.array(z.string().min(1)) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput227 = z.array(z.record(z.string(), z.json()));
const openApiEndpoint227 = createMetabaseEndpoint(
	'metric.postByIdDimensionRemove',
	openApiInput227,
	openApiOutput227,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath('/api/metric/{id}/dimension/remove', input.path),
		body: input.body,
	}),
);

const openApiInput228 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z
			.object({ dimension_ids: z.array(z.string().min(1)) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput228 = z.array(z.record(z.string(), z.json()));
const openApiEndpoint228 = createMetabaseEndpoint(
	'metric.postByIdDimensionReorder',
	openApiInput228,
	openApiOutput228,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath('/api/metric/{id}/dimension/reorder', input.path),
		body: input.body,
	}),
);

const openApiInput229 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z
			.object({ dimension_id: z.union([z.string().min(1), z.null()]) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput229 = z.array(z.record(z.string(), z.json()));
const openApiEndpoint229 = createMetabaseEndpoint(
	'metric.postByIdDimensionSetDefault',
	openApiInput229,
	openApiOutput229,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath(
			'/api/metric/{id}/dimension/set-default',
			input.path,
		),
		body: input.body,
	}),
);

const openApiInput230 = z
	.object({
		path: z
			.object({
				id: z.number().int().min(1),
				'dimension-key': z
					.string()
					.regex(
						new RegExp(
							'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
						),
					),
			})
			.strict(),
		body: z
			.object({
				default_temporal_unit: z.string().min(1).optional(),
				description: z.union([z.string(), z.null()]).optional(),
				display_name: z.string().min(1).optional(),
				source: z
					.union([
						z.object({ 'field-id': z.number().int().min(1) }).strict(),
						z.null(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput230 = z.record(z.string(), z.json());
const openApiEndpoint230 = createMetabaseEndpoint(
	'metric.postByIdDimensionByDimensionKey',
	openApiInput230,
	openApiOutput230,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath(
			'/api/metric/{id}/dimension/{dimension-key}',
			input.path,
		),
		body: input.body,
	}),
);

const openApiInput231 = z
	.object({
		path: z
			.object({
				id: z.number().int().min(1),
				'dimension-key': z
					.string()
					.regex(
						new RegExp(
							'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
						),
					),
			})
			.strict(),
		query: z.object({ value: z.string() }).strict(),
	})
	.strict();
const openApiOutput231 = OpenApiSchemas.MetabaseOpenApiOutputSchema614;
const openApiEndpoint231 = createMetabaseEndpoint(
	'metric.getByIdDimensionByDimensionKeyRemapping',
	openApiInput231,
	openApiOutput231,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/metric/{id}/dimension/{dimension-key}/remapping',
			input.path,
		),
		query: input.query,
	}),
);

const openApiInput232 = z
	.object({
		path: z
			.object({
				id: z.number().int().min(1),
				'dimension-key': z
					.string()
					.regex(
						new RegExp(
							'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
						),
					),
			})
			.strict(),
		query: z.object({ query: z.string().min(1) }).strict(),
	})
	.strict();
const openApiOutput232 = z.array(z.array(z.string()));
const openApiEndpoint232 = createMetabaseEndpoint(
	'metric.getByIdDimensionByDimensionKeySearch',
	openApiInput232,
	openApiOutput232,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/metric/{id}/dimension/{dimension-key}/search',
			input.path,
		),
		query: input.query,
	}),
);

const openApiInput233 = z
	.object({
		path: z
			.object({
				id: z.number().int().min(1),
				'dimension-key': z
					.string()
					.regex(
						new RegExp(
							'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
						),
					),
			})
			.strict(),
	})
	.strict();
const openApiOutput233 = z.object({
	has_more_values: z.boolean(),
	values: z.array(
		z.union([
			z
				.array(z.json())
				.superRefine((values, ctx) =>
					validatePrefixItems(
						values,
						[
							(value) =>
								z
									.union([
										z.union([
											z.string(),
											z.number(),
											z.boolean(),
											z.string().uuid(),
											z.string(),
											z.string().datetime({ offset: true }),
										]),
										z.null(),
									])
									.safeParse(value).success,
							(value) => z.string().safeParse(value).success,
						],
						(value) => z.json().safeParse(value).success,
						2,
						2,
						ctx,
					),
				),
			z
				.array(z.json())
				.superRefine((values, ctx) =>
					validatePrefixItems(
						values,
						[
							(value) =>
								z
									.union([
										z.union([
											z.string(),
											z.number(),
											z.boolean(),
											z.string().uuid(),
											z.string(),
											z.string().datetime({ offset: true }),
										]),
										z.null(),
									])
									.safeParse(value).success,
						],
						(value) => z.json().safeParse(value).success,
						1,
						1,
						ctx,
					),
				),
		]),
	),
});
const openApiEndpoint233 = createMetabaseEndpoint(
	'metric.getByIdDimensionByDimensionKeyValues',
	openApiInput233,
	openApiOutput233,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/metric/{id}/dimension/{dimension-key}/values',
			input.path,
		),
	}),
);

const openApiInput234 = z
	.object({ body: OpenApiSchemas.MetabaseOpenApiInputSchema631.optional() })
	.strict();
const openApiOutput234 = OpenApiSchemas.MetabaseOpenApiOutputSchema645;
const openApiEndpoint234 = createMetabaseEndpoint(
	'notification.post',
	openApiInput234,
	openApiOutput234,
	(input) => ({ method: 'POST', path: '/api/notification', body: input.body }),
);

const openApiInput235 = z
	.object({
		query: z
			.object({
				recipient_email: z.string().min(1).optional(),
				query: z.string().min(1).optional(),
				creatorless: z.union([z.boolean(), z.null()]).optional(),
				last_check_status:
					OpenApiSchemas.MetabaseOpenApiInputSchema626.optional(),
				creator_active: z.union([z.boolean(), z.null()]).optional(),
				card_id: z.number().int().min(1).optional(),
				last_send_status:
					OpenApiSchemas.MetabaseOpenApiInputSchema626.optional(),
				channel: z
					.union([
						z.union([z.string().min(1), z.array(z.string().min(1))]),
						z.null(),
					])
					.optional(),
				active: z.union([z.boolean(), z.null()]).optional(),
				sort_column: OpenApiSchemas.MetabaseOpenApiInputSchema628.optional(),
				creator_id: z.number().int().min(1).optional(),
				sort_direction: OpenApiSchemas.MetabaseOpenApiInputSchema629.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput235 = OpenApiSchemas.MetabaseOpenApiOutputSchema624;
const openApiEndpoint235 = createMetabaseEndpoint(
	'notification.getAdmin',
	openApiInput235,
	openApiOutput235,
	(input) => ({
		method: 'GET',
		path: '/api/notification/admin',
		query: input.query,
	}),
);

const openApiInput236 = z
	.object({
		body: z
			.object({
				action: z.union([z.literal('archive'), z.literal('change-creator')]),
				creator_id: z.number().int().min(1).optional(),
				notification_ids: z.array(z.number().int().min(1)).min(1),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput236 = OpenApiSchemas.MetabaseOpenApiOutputSchema621;
const openApiEndpoint236 = createMetabaseEndpoint(
	'notification.postAdminBulk',
	openApiInput236,
	openApiOutput236,
	(input) => ({
		method: 'POST',
		path: '/api/notification/admin/bulk',
		body: input.body,
	}),
);

const openApiInput237 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput237 = OpenApiSchemas.MetabaseOpenApiOutputSchema623;
const openApiEndpoint237 = createMetabaseEndpoint(
	'notification.getAdminById',
	openApiInput237,
	openApiOutput237,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/notification/admin/{id}', input.path),
	}),
);

const openApiInput238 = z
	.object({
		query: z
			.object({
				'client-id': z.union([z.string().min(1), z.null()]).optional(),
				'event-type': z
					.union([
						z.union([
							z.literal('registered'),
							z.literal('approved'),
							z.literal('denied'),
						]),
						z.null(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput238 = z.object({
	data: z.array(z.record(z.string(), z.json())),
	limit: z.number().int().min(1),
	offset: z.number().int().min(0),
	total: z.number().int().min(0),
});
const openApiEndpoint238 = createMetabaseEndpoint(
	'oauth.getAuthorizations',
	openApiInput238,
	openApiOutput238,
	(input) => ({
		method: 'GET',
		path: '/api/oauth/authorizations',
		query: input.query,
	}),
);

const openApiInput239 = z.object({}).strict();
const openApiOutput239 = z.object({
	data: z.array(
		z.object({
			ai_context: OpenApiSchemas.MetabaseOpenApiOutputSchema650,
			entity_local_id: z.number().int(),
			entity_type: z.string(),
		}),
	),
	limit: z.number().int(),
	offset: z.number().int(),
	total: z.number().int(),
});
const openApiEndpoint239 = createMetabaseEndpoint(
	'osi.getAiContext',
	openApiInput239,
	openApiOutput239,
	(input) => ({ method: 'GET', path: '/api/osi/ai-context' }),
);

const openApiInput240 = z.object({}).strict();
const openApiOutput240 = z.object({
	execution: z.object({
		ran_ms: z.number().int(),
		waited_ms: z.number().int(),
	}),
	index: z.object({
		deleted: z.number().int(),
		inserted: z.number().int(),
		unchanged: z.number().int(),
	}),
});
const openApiEndpoint240 = createMetabaseEndpoint(
	'osi.postAiContextReconcile',
	openApiInput240,
	openApiOutput240,
	(input) => ({ method: 'POST', path: '/api/osi/ai-context/reconcile' }),
);

const openApiInput241 = z
	.object({
		path: z
			.object({
				'entity-type': z.string().min(1),
				'entity-local-id': z.number().int().min(1),
			})
			.strict(),
	})
	.strict();
const openApiOutput241 = z.object({
	ai_context: OpenApiSchemas.MetabaseOpenApiOutputSchema650,
	entity_local_id: z.number().int(),
	entity_type: z.string(),
});
const openApiEndpoint241 = createMetabaseEndpoint(
	'osi.getAiContextByEntityTypeByEntityLocalId',
	openApiInput241,
	openApiOutput241,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/osi/ai-context/{entity-type}/{entity-local-id}',
			input.path,
		),
	}),
);

const openApiInput242 = z
	.object({
		path: z
			.object({
				'entity-type': z.string().min(1),
				'entity-local-id': z.number().int().min(1),
			})
			.strict(),
		body: z
			.object({ ai_context: OpenApiSchemas.MetabaseOpenApiInputSchema650 })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput242 = z.object({
	ai_context: OpenApiSchemas.MetabaseOpenApiOutputSchema650,
	entity_local_id: z.number().int(),
	entity_type: z.string(),
});
const openApiEndpoint242 = createMetabaseEndpoint(
	'osi.putAiContextByEntityTypeByEntityLocalId',
	openApiInput242,
	openApiOutput242,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath(
			'/api/osi/ai-context/{entity-type}/{entity-local-id}',
			input.path,
		),
		body: input.body,
	}),
);

const openApiInput243 = z
	.object({
		query: z
			.object({
				type: z.union([z.literal('dashboard'), z.literal('question')]),
				id: z.number().int().min(1),
			})
			.strict(),
	})
	.strict();
const openApiOutput243 = z.array(z.number().int().min(1));
const openApiEndpoint243 = createMetabaseEndpoint(
	'permissions.getInviteGroupIds',
	openApiInput243,
	openApiOutput243,
	(input) => ({
		method: 'GET',
		path: '/api/permissions/invite-group-ids',
		query: input.query,
	}),
);

const openApiInput244 = z
	.object({
		path: z.object({ token: z.string(), 'param-key': z.string() }).strict(),
	})
	.strict();
const openApiOutput244 = z.object({
	has_more_values: z.boolean(),
	values: z.array(
		z.union([
			z
				.array(z.json())
				.superRefine((values, ctx) =>
					validatePrefixItems(
						values,
						[
							(value) =>
								z
									.union([
										z.union([
											z.string(),
											z.number(),
											z.boolean(),
											z.string().uuid(),
											z.string(),
											z.string().datetime({ offset: true }),
										]),
										z.null(),
									])
									.safeParse(value).success,
							(value) => z.string().safeParse(value).success,
						],
						(value) => z.json().safeParse(value).success,
						2,
						2,
						ctx,
					),
				),
			z
				.array(z.json())
				.superRefine((values, ctx) =>
					validatePrefixItems(
						values,
						[
							(value) =>
								z
									.union([
										z.union([
											z.string(),
											z.number(),
											z.boolean(),
											z.string().uuid(),
											z.string(),
											z.string().datetime({ offset: true }),
										]),
										z.null(),
									])
									.safeParse(value).success,
						],
						(value) => z.json().safeParse(value).success,
						1,
						1,
						ctx,
					),
				),
		]),
	),
});
const openApiEndpoint244 = createMetabaseEndpoint(
	'previewEmbed.getCardByTokenParamsByParamKeyValues',
	openApiInput244,
	openApiOutput244,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/preview_embed/card/{token}/params/{param-key}/values',
			input.path,
		),
	}),
);

const openApiInput245 = z
	.object({
		path: z
			.object({
				uuid: z
					.string()
					.regex(
						new RegExp(
							'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
						),
					),
				'dashcard-id': z.number().int().min(1),
			})
			.strict(),
		body: z
			.object({ parameters: OpenApiSchemas.MetabaseOpenApiInputSchema218 })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput245 = z.record(z.string(), z.json());
const openApiEndpoint245 = createMetabaseEndpoint(
	'public.postDashboardByUuidDashcardByDashcardIdExecuteValues',
	openApiInput245,
	openApiOutput245,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath(
			'/api/public/dashboard/{uuid}/dashcard/{dashcard-id}/execute/values',
			input.path,
		),
		body: input.body,
	}),
);

const openApiInput246 = z
	.object({
		path: z.object({ key: z.string().min(1) }).strict(),
		query: z.object({ v: z.string().optional() }).strict().optional(),
	})
	.strict();
const openApiOutput246 = MetabaseBinaryResponseSchema;
const openApiEndpoint246 = createMetabaseEndpoint(
	'session.getIllustrationByKey',
	openApiInput246,
	openApiOutput246,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/session/illustration/{key}', input.path),
		query: input.query,
		responseType: 'binary',
	}),
);

const openApiInput247 = z
	.object({
		body: z
			.object({
				code: z.string().min(1),
				enrollment_token: z.string().min(1),
				remember: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput247 = z
	.object({
		body: z
			.object({
				id: z.string().min(1),
				recovery_codes: z.array(z.string().min(1)),
			})
			.strict(),
		cookies: z.record(
			z.string(),
			z
				.object({
					'http-only': z.boolean().optional(),
					'max-age': z.number().int(),
					path: z.string().min(1),
					'same-site': z
						.union([z.literal('strict'), z.literal('lax'), z.literal('none')])
						.optional(),
					value: z.string().min(1),
				})
				.strict(),
		),
		status: z.literal(200),
	})
	.strict();
const openApiEndpoint247 = createMetabaseEndpoint(
	'session.postMfaEnroll',
	openApiInput247,
	openApiOutput247,
	(input) => ({
		method: 'POST',
		path: '/api/session/mfa/enroll',
		body: input.body,
	}),
);

const openApiInput248 = z
	.object({
		body: z
			.object({ challenge_token: z.string().min(1) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput248 = z.object({ success: z.literal(true) });
const openApiEndpoint248 = createMetabaseEndpoint(
	'session.postMfaSendEmailOtp',
	openApiInput248,
	openApiOutput248,
	(input) => ({
		method: 'POST',
		path: '/api/session/mfa/send-email-otp',
		body: input.body,
	}),
);

const openApiInput249 = z.object({}).strict();
const openApiOutput249 = z
	.object({
		app_id: z.union([z.string().min(1), z.null()]),
		scopes: z.union([
			z
				.object({
					actual: z.array(z.string()),
					extra: z.array(z.string()),
					missing: z.array(z.string()),
					required: z.array(z.string()),
				})
				.strict(),
			z.null(),
		]),
		team_id: z.union([z.string().min(1), z.null()]),
	})
	.strict();
const openApiEndpoint249 = createMetabaseEndpoint(
	'slack.getAppInfo',
	openApiInput249,
	openApiOutput249,
	(input) => ({ method: 'GET', path: '/api/slack/app-info' }),
);

const openApiInput250 = z.object({}).strict();
const openApiOutput250 = z.object({
	display_information: z.object({
		background_color: z.string(),
		description: z.string(),
		name: z.string(),
	}),
	features: z.object({
		app_home: z
			.object({
				home_tab_enabled: z.boolean(),
				messages_tab_enabled: z.boolean(),
				messages_tab_read_only_enabled: z.boolean(),
			})
			.optional(),
		assistant_view: z.object({ assistant_description: z.string() }).optional(),
		bot_user: z.object({
			always_online: z.boolean().optional(),
			display_name: z.string(),
		}),
		slash_commands: z
			.array(
				z.object({
					command: z.string(),
					description: z.string(),
					should_escape: z.boolean(),
					url: z.string(),
				}),
			)
			.optional(),
	}),
	oauth_config: z.object({
		redirect_urls: z.array(z.string()).optional(),
		scopes: z.object({ bot: z.array(z.string()) }),
	}),
	settings: z
		.object({
			event_subscriptions: z.object({
				bot_events: z.array(z.string()),
				request_url: z.string(),
			}),
			interactivity: z.object({
				is_enabled: z.boolean(),
				request_url: z.string(),
			}),
			org_deploy_enabled: z.boolean(),
			socket_mode_enabled: z.boolean(),
			token_rotation_enabled: z.boolean(),
		})
		.optional(),
});
const openApiEndpoint250 = createMetabaseEndpoint(
	'slack.getManifest',
	openApiInput250,
	openApiOutput250,
	(input) => ({ method: 'GET', path: '/api/slack/manifest' }),
);

const openApiInput251 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z
			.union([
				z.array(z.number().int().min(1)),
				z.object({ field_order: z.array(z.number().int().min(1)) }).strict(),
			])
			.optional(),
	})
	.strict();
const openApiOutput251 = z.object({ success: z.literal(true) });
const openApiEndpoint251 = createMetabaseEndpoint(
	'table.putByIdFieldsOrder',
	openApiInput251,
	openApiOutput251,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath('/api/table/{id}/fields/order', input.path),
		body: input.body,
	}),
);

const openApiInput252 = z.object({}).strict();
const openApiOutput252 = OpenApiSchemas.MetabaseOpenApiOutputSchema688;
const openApiEndpoint252 = createMetabaseEndpoint(
	'task.getRuns',
	openApiInput252,
	openApiOutput252,
	(input) => ({ method: 'GET', path: '/api/task/runs' }),
);

const openApiInput253 = z
	.object({
		query: z
			.object({
				'run-type': z.union([
					z.literal('alert'),
					z.literal('sync'),
					z.literal('fingerprint'),
					z.literal('subscription'),
				]),
				'started-at': z.string().min(1),
			})
			.strict(),
	})
	.strict();
const openApiOutput253 = z.array(OpenApiSchemas.MetabaseOpenApiOutputSchema685);
const openApiEndpoint253 = createMetabaseEndpoint(
	'task.getRunsEntities',
	openApiInput253,
	openApiOutput253,
	(input) => ({
		method: 'GET',
		path: '/api/task/runs/entities',
		query: input.query,
	}),
);

const openApiInput254 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput254 = OpenApiSchemas.MetabaseOpenApiOutputSchema689;
const openApiEndpoint254 = createMetabaseEndpoint(
	'task.getRunsById',
	openApiInput254,
	openApiOutput254,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/task/runs/{id}', input.path),
	}),
);

const openApiInput255 = z
	.object({
		body: z
			.object({
				archived: z.union([z.boolean(), z.null()]).optional(),
				collection_id: z.union([z.number().int().min(1), z.null()]).optional(),
				default: z.union([z.boolean(), z.null()]).optional(),
				description: z.union([z.string(), z.null()]).optional(),
				icon: z
					.union([
						z.union([
							z.literal('star'),
							z.literal('cake'),
							z.literal('mail'),
							z.literal('mail_at'),
							z.literal('warning'),
							z.literal('bell'),
							z.literal('cloud'),
							z.literal('info'),
							z.literal('note'),
							z.literal('event'),
						]),
						z.null(),
					])
					.optional(),
				name: z.string().min(1),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput255 = OpenApiSchemas.MetabaseOpenApiOutputSchema691;
const openApiEndpoint255 = createMetabaseEndpoint(
	'timeline.post',
	openApiInput255,
	openApiOutput255,
	(input) => ({ method: 'POST', path: '/api/timeline', body: input.body }),
);

const openApiInput256 = z
	.object({
		query: z
			.object({
				include: OpenApiSchemas.MetabaseOpenApiInputSchema690.optional(),
				archived: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput256 = z.array(OpenApiSchemas.MetabaseOpenApiOutputSchema691);
const openApiEndpoint256 = createMetabaseEndpoint(
	'timeline.get',
	openApiInput256,
	openApiOutput256,
	(input) => ({ method: 'GET', path: '/api/timeline', query: input.query }),
);

const openApiInput257 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		query: z
			.object({
				include: OpenApiSchemas.MetabaseOpenApiInputSchema690.optional(),
				archived: z.boolean().optional(),
				start: z.string().optional(),
				end: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput257 = OpenApiSchemas.MetabaseOpenApiOutputSchema691;
const openApiEndpoint257 = createMetabaseEndpoint(
	'timeline.getById',
	openApiInput257,
	openApiOutput257,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/timeline/{id}', input.path),
		query: input.query,
	}),
);

const openApiInput258 = z
	.object({
		query: z
			.object({
				'last-run-start-time': z
					.union([z.string().min(1), z.null()])
					.optional(),
				'last-run-statuses': z
					.union([
						z.array(
							z.union([
								z.literal('started'),
								z.literal('succeeded'),
								z.literal('failed'),
								z.literal('timeout'),
							]),
						),
						z.null(),
					])
					.optional(),
				'tag-ids': z
					.union([z.array(z.number().int().min(0)), z.null()])
					.optional(),
				'database-id': z.union([z.number().int().min(1), z.null()]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput258 = z.array(
	z
		.object({
			table: z.union([z.record(z.string(), z.json()), z.null()]).optional(),
			owner: z
				.union([
					z
						.object({
							common_name: z.union([z.string(), z.null()]).optional(),
							email: z.string(),
							first_name: z.union([z.string(), z.null()]).optional(),
							id: z.number().int().min(1).optional(),
							last_name: z.union([z.string(), z.null()]).optional(),
						})
						.strict(),
					z.null(),
				])
				.optional(),
			can_read: z.boolean().optional(),
			source_type: z.string(),
			entity_id: z.union([z.string(), z.null()]),
			last_run: z
				.union([
					z
						.object({
							message: z.union([z.string(), z.null()]),
							user_id: z.union([z.number().int().min(1), z.null()]),
							checkpoint_hi_value: z.union([z.string(), z.null()]).optional(),
							is_active: z.union([z.boolean(), z.null()]),
							transform_id: z.number().int().min(1),
							id: z.number().int().min(1),
							run_method: z.string(),
							checkpoint_lo_value: z.union([z.string(), z.null()]).optional(),
							status: z.union([
								z.literal('started'),
								z.literal('succeeded'),
								z.literal('failed'),
								z.literal('timeout'),
								z.literal('canceled'),
								z.literal('canceling'),
							]),
							transform_entity_id: z.union([z.string(), z.null()]).optional(),
							checkpoint_filter_field_id: z
								.union([z.number().int().min(1), z.null()])
								.optional(),
							end_time: z.json().optional(),
							metered_as: z.union([z.string(), z.null()]).optional(),
							dag_run_id: z
								.union([z.number().int().min(1), z.null()])
								.optional(),
							transform_name: z.union([z.string(), z.null()]).optional(),
							start_time: z.json(),
							job_run_id: z
								.union([z.number().int().min(1), z.null()])
								.optional(),
						})
						.strict(),
					z.null(),
				])
				.optional(),
			source_database_id: z
				.union([z.number().int().min(1), z.null()])
				.optional(),
			id: z.number().int().min(1),
			owner_email: z.union([z.string(), z.null()]).optional(),
			target_db_id: z.union([z.number().int().min(1), z.null()]).optional(),
			creator: z
				.object({
					is_qbnewb: z.boolean().optional(),
					last_login: z.json().optional(),
					id: z.number().int().min(1),
					email: z.string(),
					is_data_analyst: z.boolean().optional(),
					is_superuser: z.boolean().optional(),
					tenant_id: z.json().optional(),
					last_name: z.union([z.string(), z.null()]),
					first_name: z.union([z.string(), z.null()]),
					date_joined: z.json().optional(),
					common_name: z.union([z.string(), z.null()]).optional(),
				})
				.strict(),
			owner_user_id: z.union([z.number().int().min(1), z.null()]).optional(),
			name: z.string(),
			updated_at: z.json(),
			source_readable: z.union([z.boolean(), z.null()]).optional(),
			tag_ids: z.array(z.number().int().min(1)).optional(),
			table_dependencies: z
				.union([z.array(z.record(z.string(), z.json())), z.null()])
				.optional(),
			can_write: z.boolean().optional(),
			collection_id: z.union([z.number().int().min(1), z.null()]),
			can_execute: z.boolean().optional(),
			source: z.json(),
			requestable_indexes: z
				.union([OpenApiSchemas.MetabaseOpenApiOutputSchema294, z.null()])
				.optional(),
			last_checkpoint_value: z.union([z.string(), z.null()]).optional(),
			target: z.json(),
			created_at: z.json(),
			creator_id: z.number().int().min(1),
			run_trigger: z.union([z.string(), z.null()]).optional(),
			target_table_id: z.union([z.number().int().min(1), z.null()]).optional(),
			description: z.union([z.string(), z.null()]),
		})
		.strict(),
);
const openApiEndpoint258 = createMetabaseEndpoint(
	'transform.get',
	openApiInput258,
	openApiOutput258,
	(input) => ({ method: 'GET', path: '/api/transform', query: input.query }),
);

const openApiInput259 = z
	.object({
		body: z
			.object({
				owner_email: z.union([z.string(), z.null()]).optional(),
				owner_user_id: z.union([z.number().int().min(1), z.null()]).optional(),
				name: z.string(),
				tag_ids: z.array(z.number().int().min(1)).optional(),
				collection_id: z.union([z.number().int().min(1), z.null()]).optional(),
				source: OpenApiSchemas.MetabaseOpenApiInputSchema705,
				target: OpenApiSchemas.MetabaseOpenApiInputSchema706,
				run_trigger: OpenApiSchemas.MetabaseOpenApiInputSchema700.optional(),
				description: z.union([z.string(), z.null()]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput259 = z
	.object({
		table: z.union([z.record(z.string(), z.json()), z.null()]).optional(),
		owner: z
			.union([
				z
					.object({
						common_name: z.union([z.string(), z.null()]).optional(),
						email: z.string(),
						first_name: z.union([z.string(), z.null()]).optional(),
						id: z.number().int().min(1).optional(),
						last_name: z.union([z.string(), z.null()]).optional(),
					})
					.strict(),
				z.null(),
			])
			.optional(),
		can_read: z.boolean().optional(),
		source_type: z.string(),
		entity_id: z.union([z.string(), z.null()]),
		last_run: z
			.union([
				z
					.object({
						message: z.union([z.string(), z.null()]),
						user_id: z.union([z.number().int().min(1), z.null()]),
						checkpoint_hi_value: z.union([z.string(), z.null()]).optional(),
						is_active: z.union([z.boolean(), z.null()]),
						transform_id: z.number().int().min(1),
						id: z.number().int().min(1),
						run_method: z.string(),
						checkpoint_lo_value: z.union([z.string(), z.null()]).optional(),
						status: z.union([
							z.literal('started'),
							z.literal('succeeded'),
							z.literal('failed'),
							z.literal('timeout'),
							z.literal('canceled'),
							z.literal('canceling'),
						]),
						transform_entity_id: z.union([z.string(), z.null()]).optional(),
						checkpoint_filter_field_id: z
							.union([z.number().int().min(1), z.null()])
							.optional(),
						end_time: z.json().optional(),
						metered_as: z.union([z.string(), z.null()]).optional(),
						dag_run_id: z.union([z.number().int().min(1), z.null()]).optional(),
						transform_name: z.union([z.string(), z.null()]).optional(),
						start_time: z.json(),
						job_run_id: z.union([z.number().int().min(1), z.null()]).optional(),
					})
					.strict(),
				z.null(),
			])
			.optional(),
		source_database_id: z.union([z.number().int().min(1), z.null()]).optional(),
		id: z.number().int().min(1),
		owner_email: z.union([z.string(), z.null()]).optional(),
		target_db_id: z.union([z.number().int().min(1), z.null()]).optional(),
		creator: z
			.object({
				is_qbnewb: z.boolean().optional(),
				last_login: z.json().optional(),
				id: z.number().int().min(1),
				email: z.string(),
				is_data_analyst: z.boolean().optional(),
				is_superuser: z.boolean().optional(),
				tenant_id: z.json().optional(),
				last_name: z.union([z.string(), z.null()]),
				first_name: z.union([z.string(), z.null()]),
				date_joined: z.json().optional(),
				common_name: z.union([z.string(), z.null()]).optional(),
			})
			.strict(),
		owner_user_id: z.union([z.number().int().min(1), z.null()]).optional(),
		name: z.string(),
		updated_at: z.json(),
		source_readable: z.union([z.boolean(), z.null()]).optional(),
		tag_ids: z.array(z.number().int().min(1)).optional(),
		table_dependencies: z
			.union([z.array(z.record(z.string(), z.json())), z.null()])
			.optional(),
		can_write: z.boolean().optional(),
		collection_id: z.union([z.number().int().min(1), z.null()]),
		can_execute: z.boolean().optional(),
		source: z.json(),
		requestable_indexes: z
			.union([OpenApiSchemas.MetabaseOpenApiOutputSchema294, z.null()])
			.optional(),
		last_checkpoint_value: z.union([z.string(), z.null()]).optional(),
		target: z.json(),
		created_at: z.json(),
		creator_id: z.number().int().min(1),
		run_trigger: z.union([z.string(), z.null()]).optional(),
		target_table_id: z.union([z.number().int().min(1), z.null()]).optional(),
		description: z.union([z.string(), z.null()]),
	})
	.strict();
const openApiEndpoint259 = createMetabaseEndpoint(
	'transform.post',
	openApiInput259,
	openApiOutput259,
	(input) => ({ method: 'POST', path: '/api/transform', body: input.body }),
);

const openApiInput260 = z
	.object({ path: z.object({ 'run-id': z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput260 = z.null();
const openApiEndpoint260 = createMetabaseEndpoint(
	'transformDagRun.postByRunIdCancel',
	openApiInput260,
	openApiOutput260,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath(
			'/api/transform-dag-run/{run-id}/cancel',
			input.path,
		),
	}),
);

const openApiInput261 = z
	.object({ path: z.object({ 'run-id': z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput261 = z.array(
	z
		.object({
			message: z.union([z.string(), z.null()]),
			user_id: z.union([z.number().int().min(1), z.null()]),
			checkpoint_hi_value: z.union([z.string(), z.null()]).optional(),
			is_active: z.union([z.boolean(), z.null()]),
			transform_id: z.union([z.number().int().min(1), z.null()]),
			id: z.number().int().min(1),
			transform: z.union([z.record(z.string(), z.json()), z.null()]).optional(),
			run_method: z.string(),
			checkpoint_lo_value: z.union([z.string(), z.null()]).optional(),
			status: z.union([
				z.literal('started'),
				z.literal('succeeded'),
				z.literal('failed'),
				z.literal('timeout'),
				z.literal('canceled'),
				z.literal('canceling'),
			]),
			transform_entity_id: z.union([z.string(), z.null()]).optional(),
			checkpoint_filter_field_id: z
				.union([z.number().int().min(1), z.null()])
				.optional(),
			end_time: z.json().optional(),
			metered_as: z.union([z.string(), z.null()]).optional(),
			dag_run_id: z.union([z.number().int().min(1), z.null()]),
			transform_name: z.union([z.string(), z.null()]).optional(),
			start_time: z.json(),
			job_run_id: z.union([z.number().int().min(1), z.null()]),
		})
		.strict(),
);
const openApiEndpoint261 = createMetabaseEndpoint(
	'transformDagRun.getByRunIdTransformRuns',
	openApiInput261,
	openApiOutput261,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/transform-dag-run/{run-id}/transform-runs',
			input.path,
		),
	}),
);

const openApiInput262 = z
	.object({
		body: z
			.object({
				description: z.union([z.string().min(1), z.null()]).optional(),
				name: z.string().min(1),
				schedule: z.string().min(1),
				tag_ids: z.array(z.number().int().min(1)).optional(),
				ui_display_type: z
					.union([z.literal('cron/raw'), z.literal('cron/builder')])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput262 = z
	.object({
		built_in_type: z.union([z.string(), z.null()]).optional(),
		entity_id: z.union([z.string(), z.null()]),
		last_run: z
			.union([
				z
					.object({
						message: z.union([z.string(), z.null()]),
						is_active: z.union([z.boolean(), z.null()]),
						id: z.number().int().min(1),
						run_method: z.string(),
						updated_at: z.json(),
						status: z.union([
							z.literal('started'),
							z.literal('succeeded'),
							z.literal('failed'),
							z.literal('timeout'),
							z.literal('canceled'),
						]),
						job_id: z.number().int().min(1),
						end_time: z.json().optional(),
						job_entity_id: z.union([z.string(), z.null()]).optional(),
						created_at: z.json(),
						job_name: z.union([z.string(), z.null()]).optional(),
						start_time: z.json(),
					})
					.strict(),
				z.null(),
			])
			.optional(),
		ui_display_type: z.union([
			z.literal('cron/raw'),
			z.literal('cron/builder'),
		]),
		next_run: z
			.union([z.object({ start_time: z.json() }).strict(), z.null()])
			.optional(),
		id: z.number().int().min(1),
		name: z.union([z.string(), z.string()]),
		schedule: z.string(),
		updated_at: z.json(),
		tag_ids: z.array(z.number().int().min(1)).optional(),
		created_at: z.json(),
		active: z.boolean(),
		description: z.union([z.union([z.string(), z.string()]), z.null()]),
	})
	.strict();
const openApiEndpoint262 = createMetabaseEndpoint(
	'transformJob.post',
	openApiInput262,
	openApiOutput262,
	(input) => ({ method: 'POST', path: '/api/transform-job', body: input.body }),
);

const openApiInput263 = z
	.object({
		query: z
			.object({
				'last-run-start-time': z
					.union([z.string().min(1), z.null()])
					.optional(),
				'next-run-start-time': z
					.union([z.string().min(1), z.null()])
					.optional(),
				'last-run-statuses': z
					.union([
						z.array(
							z.union([
								z.literal('started'),
								z.literal('succeeded'),
								z.literal('failed'),
								z.literal('timeout'),
							]),
						),
						z.null(),
					])
					.optional(),
				'tag-ids': z
					.union([z.array(z.number().int().min(0)), z.null()])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput263 = z.array(
	z
		.object({
			built_in_type: z.union([z.string(), z.null()]).optional(),
			entity_id: z.union([z.string(), z.null()]),
			last_run: z
				.union([
					z
						.object({
							message: z.union([z.string(), z.null()]),
							is_active: z.union([z.boolean(), z.null()]),
							id: z.number().int().min(1),
							run_method: z.string(),
							updated_at: z.json(),
							status: z.union([
								z.literal('started'),
								z.literal('succeeded'),
								z.literal('failed'),
								z.literal('timeout'),
								z.literal('canceled'),
							]),
							job_id: z.number().int().min(1),
							end_time: z.json().optional(),
							job_entity_id: z.union([z.string(), z.null()]).optional(),
							created_at: z.json(),
							job_name: z.union([z.string(), z.null()]).optional(),
							start_time: z.json(),
						})
						.strict(),
					z.null(),
				])
				.optional(),
			ui_display_type: z.union([
				z.literal('cron/raw'),
				z.literal('cron/builder'),
			]),
			next_run: z
				.union([z.object({ start_time: z.json() }).strict(), z.null()])
				.optional(),
			id: z.number().int().min(1),
			name: z.union([z.string(), z.string()]),
			schedule: z.string(),
			updated_at: z.json(),
			tag_ids: z.array(z.number().int().min(1)).optional(),
			created_at: z.json(),
			active: z.boolean(),
			description: z.union([z.union([z.string(), z.string()]), z.null()]),
		})
		.strict(),
);
const openApiEndpoint263 = createMetabaseEndpoint(
	'transformJob.get',
	openApiInput263,
	openApiOutput263,
	(input) => ({
		method: 'GET',
		path: '/api/transform-job',
		query: input.query,
	}),
);

const openApiInput264 = z
	.object({ body: z.object({ active: z.boolean() }).strict().optional() })
	.strict();
const openApiOutput264 = z
	.object({ failed: z.number().int(), updated: z.number().int() })
	.strict();
const openApiEndpoint264 = createMetabaseEndpoint(
	'transformJob.putActive',
	openApiInput264,
	openApiOutput264,
	(input) => ({
		method: 'PUT',
		path: '/api/transform-job/active',
		body: input.body,
	}),
);

const openApiInput265 = z
	.object({
		path: z.object({ 'job-id': z.number().int().min(1) }).strict(),
		body: z
			.object({
				active: z.boolean().optional(),
				description: z.union([z.string().min(1), z.null()]).optional(),
				name: z.string().min(1).optional(),
				schedule: z.string().min(1).optional(),
				tag_ids: z.array(z.number().int().min(1)).optional(),
				ui_display_type: z
					.union([z.literal('cron/raw'), z.literal('cron/builder')])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput265 = z
	.object({
		built_in_type: z.union([z.string(), z.null()]).optional(),
		entity_id: z.union([z.string(), z.null()]),
		last_run: z
			.union([
				z
					.object({
						message: z.union([z.string(), z.null()]),
						is_active: z.union([z.boolean(), z.null()]),
						id: z.number().int().min(1),
						run_method: z.string(),
						updated_at: z.json(),
						status: z.union([
							z.literal('started'),
							z.literal('succeeded'),
							z.literal('failed'),
							z.literal('timeout'),
							z.literal('canceled'),
						]),
						job_id: z.number().int().min(1),
						end_time: z.json().optional(),
						job_entity_id: z.union([z.string(), z.null()]).optional(),
						created_at: z.json(),
						job_name: z.union([z.string(), z.null()]).optional(),
						start_time: z.json(),
					})
					.strict(),
				z.null(),
			])
			.optional(),
		ui_display_type: z.union([
			z.literal('cron/raw'),
			z.literal('cron/builder'),
		]),
		next_run: z
			.union([z.object({ start_time: z.json() }).strict(), z.null()])
			.optional(),
		id: z.number().int().min(1),
		name: z.union([z.string(), z.string()]),
		schedule: z.string(),
		updated_at: z.json(),
		tag_ids: z.array(z.number().int().min(1)).optional(),
		created_at: z.json(),
		active: z.boolean(),
		description: z.union([z.union([z.string(), z.string()]), z.null()]),
	})
	.strict();
const openApiEndpoint265 = createMetabaseEndpoint(
	'transformJob.putByJobId',
	openApiInput265,
	openApiOutput265,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath('/api/transform-job/{job-id}', input.path),
		body: input.body,
	}),
);

const openApiInput266 = z
	.object({ path: z.object({ 'job-id': z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput266 = z
	.object({
		built_in_type: z.union([z.string(), z.null()]).optional(),
		entity_id: z.union([z.string(), z.null()]),
		last_run: z
			.union([
				z
					.object({
						message: z.union([z.string(), z.null()]),
						is_active: z.union([z.boolean(), z.null()]),
						id: z.number().int().min(1),
						run_method: z.string(),
						updated_at: z.json(),
						status: z.union([
							z.literal('started'),
							z.literal('succeeded'),
							z.literal('failed'),
							z.literal('timeout'),
							z.literal('canceled'),
						]),
						job_id: z.number().int().min(1),
						end_time: z.json().optional(),
						job_entity_id: z.union([z.string(), z.null()]).optional(),
						created_at: z.json(),
						job_name: z.union([z.string(), z.null()]).optional(),
						start_time: z.json(),
					})
					.strict(),
				z.null(),
			])
			.optional(),
		ui_display_type: z.union([
			z.literal('cron/raw'),
			z.literal('cron/builder'),
		]),
		next_run: z
			.union([z.object({ start_time: z.json() }).strict(), z.null()])
			.optional(),
		id: z.number().int().min(1),
		name: z.union([z.string(), z.string()]),
		schedule: z.string(),
		updated_at: z.json(),
		tag_ids: z.array(z.number().int().min(1)).optional(),
		created_at: z.json(),
		active: z.boolean(),
		description: z.union([z.union([z.string(), z.string()]), z.null()]),
	})
	.strict();
const openApiEndpoint266 = createMetabaseEndpoint(
	'transformJob.getByJobId',
	openApiInput266,
	openApiOutput266,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/transform-job/{job-id}', input.path),
	}),
);

const openApiInput267 = z
	.object({
		path: z.object({ 'job-id': z.number().int().min(1) }).strict(),
		body: z.object({ run_all: z.boolean().optional() }).strict().optional(),
	})
	.strict();
const openApiOutput267 = z.object({
	body: z
		.object({
			job_run_id: z.union([z.number().int().min(1), z.null()]),
			message: z.json(),
		})
		.strict(),
	status: z.literal(202),
});
const openApiEndpoint267 = createMetabaseEndpoint(
	'transformJob.postByJobIdRun',
	openApiInput267,
	openApiOutput267,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath('/api/transform-job/{job-id}/run', input.path),
		body: input.body,
	}),
);

const openApiInput268 = z
	.object({
		path: z.object({ 'job-id': z.number().int().min(1) }).strict(),
		query: z
			.object({
				status: z
					.union([
						z.union([
							z.literal('started'),
							z.literal('succeeded'),
							z.literal('failed'),
							z.literal('timeout'),
							z.literal('canceled'),
						]),
						z.null(),
					])
					.optional(),
				'run-method': z
					.union([z.union([z.literal('manual'), z.literal('cron')]), z.null()])
					.optional(),
				'start-time': z.union([z.string().min(1), z.null()]).optional(),
				'sort-column': z
					.union([
						z.union([z.literal('start_time'), z.literal('end_time')]),
						z.null(),
					])
					.optional(),
				'sort-direction': z
					.union([z.union([z.literal('asc'), z.literal('desc')]), z.null()])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput268 = z
	.object({
		data: z.array(
			z
				.object({
					message: z.union([z.string(), z.null()]),
					is_active: z.union([z.boolean(), z.null()]),
					id: z.number().int().min(1),
					run_method: z.string(),
					updated_at: z.json(),
					status: z.union([
						z.literal('started'),
						z.literal('succeeded'),
						z.literal('failed'),
						z.literal('timeout'),
						z.literal('canceled'),
					]),
					job_id: z.number().int().min(1),
					end_time: z.json().optional(),
					job_entity_id: z.union([z.string(), z.null()]).optional(),
					created_at: z.json(),
					job_name: z.union([z.string(), z.null()]).optional(),
					start_time: z.json(),
				})
				.strict(),
		),
		limit: z.number().int().min(1),
		offset: z.number().int(),
		total: z.number().int(),
	})
	.strict();
const openApiEndpoint268 = createMetabaseEndpoint(
	'transformJob.getByJobIdRuns',
	openApiInput268,
	openApiOutput268,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/transform-job/{job-id}/runs', input.path),
		query: input.query,
	}),
);

const openApiInput269 = z
	.object({
		path: z
			.object({
				'job-id': z.number().int().min(1),
				'run-id': z.number().int().min(1),
			})
			.strict(),
	})
	.strict();
const openApiOutput269 = z.null();
const openApiEndpoint269 = createMetabaseEndpoint(
	'transformJob.postByJobIdRunsByRunIdCancel',
	openApiInput269,
	openApiOutput269,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath(
			'/api/transform-job/{job-id}/runs/{run-id}/cancel',
			input.path,
		),
	}),
);

const openApiInput270 = z
	.object({
		path: z
			.object({
				'job-id': z.number().int().min(1),
				'run-id': z.number().int().min(1),
			})
			.strict(),
	})
	.strict();
const openApiOutput270 = z.array(
	z
		.object({
			message: z.union([z.string(), z.null()]),
			user_id: z.union([z.number().int().min(1), z.null()]),
			checkpoint_hi_value: z.union([z.string(), z.null()]).optional(),
			is_active: z.union([z.boolean(), z.null()]),
			transform_id: z.union([z.number().int().min(1), z.null()]),
			id: z.number().int().min(1),
			transform: z.union([z.record(z.string(), z.json()), z.null()]).optional(),
			run_method: z.string(),
			checkpoint_lo_value: z.union([z.string(), z.null()]).optional(),
			status: z.union([
				z.literal('started'),
				z.literal('succeeded'),
				z.literal('failed'),
				z.literal('timeout'),
				z.literal('canceled'),
				z.literal('canceling'),
			]),
			transform_entity_id: z.union([z.string(), z.null()]).optional(),
			checkpoint_filter_field_id: z
				.union([z.number().int().min(1), z.null()])
				.optional(),
			end_time: z.json().optional(),
			metered_as: z.union([z.string(), z.null()]).optional(),
			dag_run_id: z.union([z.number().int().min(1), z.null()]),
			transform_name: z.union([z.string(), z.null()]).optional(),
			start_time: z.json(),
			job_run_id: z.union([z.number().int().min(1), z.null()]),
		})
		.strict(),
);
const openApiEndpoint270 = createMetabaseEndpoint(
	'transformJob.getByJobIdRunsByRunIdTransformRuns',
	openApiInput270,
	openApiOutput270,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/transform-job/{job-id}/runs/{run-id}/transform-runs',
			input.path,
		),
	}),
);

const openApiInput271 = z
	.object({ path: z.object({ 'job-id': z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput271 = z.array(
	z.object({
		source_type: z.string(),
		entity_id: z.union([z.string(), z.null()]),
		scheduled: z.boolean().optional(),
		id: z.number().int().min(1),
		creator: z
			.object({
				is_qbnewb: z.boolean().optional(),
				last_login: z.json().optional(),
				id: z.number().int().min(1),
				email: z.string(),
				is_data_analyst: z.boolean().optional(),
				is_superuser: z.boolean().optional(),
				tenant_id: z.union([z.string(), z.null()]).optional(),
				last_name: z.union([z.string(), z.null()]),
				first_name: z.union([z.string(), z.null()]),
				date_joined: z.json().optional(),
				common_name: z.union([z.string(), z.null()]).optional(),
			})
			.strict(),
		name: z.string(),
		updated_at: z.json(),
		dependency: z.boolean().optional(),
		collection_id: z.union([z.number().int().min(1), z.null()]),
		source: z.json(),
		target: z.json(),
		created_at: z.json(),
		creator_id: z.number().int().min(1),
		run_trigger: z.union([z.string(), z.null()]).optional(),
		description: z.union([z.string(), z.null()]),
	}),
);
const openApiEndpoint271 = createMetabaseEndpoint(
	'transformJob.getByJobIdTransforms',
	openApiInput271,
	openApiOutput271,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath(
			'/api/transform-job/{job-id}/transforms',
			input.path,
		),
	}),
);

const openApiInput272 = z
	.object({
		body: z
			.object({ name: z.string().min(1) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput272 = z
	.object({
		built_in_type: z.union([z.string(), z.null()]).optional(),
		can_run: z.boolean().optional(),
		created_at: z.json(),
		entity_id: z.union([z.string(), z.null()]),
		id: z.number().int().min(1),
		name: z.union([z.string(), z.string()]),
		updated_at: z.json(),
	})
	.strict();
const openApiEndpoint272 = createMetabaseEndpoint(
	'transformTag.post',
	openApiInput272,
	openApiOutput272,
	(input) => ({ method: 'POST', path: '/api/transform-tag', body: input.body }),
);

const openApiInput273 = z.object({}).strict();
const openApiOutput273 = z.array(
	z
		.object({
			built_in_type: z.union([z.string(), z.null()]).optional(),
			can_run: z.boolean().optional(),
			created_at: z.json(),
			entity_id: z.union([z.string(), z.null()]),
			id: z.number().int().min(1),
			name: z.union([z.string(), z.string()]),
			updated_at: z.json(),
		})
		.strict(),
);
const openApiEndpoint273 = createMetabaseEndpoint(
	'transformTag.get',
	openApiInput273,
	openApiOutput273,
	(input) => ({ method: 'GET', path: '/api/transform-tag' }),
);

const openApiInput274 = z
	.object({
		path: z.object({ 'tag-id': z.number().int().min(1) }).strict(),
		body: z
			.object({ name: z.string().min(1) })
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput274 = z
	.object({
		built_in_type: z.union([z.string(), z.null()]).optional(),
		can_run: z.boolean().optional(),
		created_at: z.json(),
		entity_id: z.union([z.string(), z.null()]),
		id: z.number().int().min(1),
		name: z.union([z.string(), z.string()]),
		updated_at: z.json(),
	})
	.strict();
const openApiEndpoint274 = createMetabaseEndpoint(
	'transformTag.putByTagId',
	openApiInput274,
	openApiOutput274,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath('/api/transform-tag/{tag-id}', input.path),
		body: input.body,
	}),
);

const openApiInput275 = z
	.object({ path: z.object({ 'tag-id': z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput275 = z.null();
const openApiEndpoint275 = createMetabaseEndpoint(
	'transformTag.deleteByTagId',
	openApiInput275,
	openApiOutput275,
	(input) => ({
		method: 'DELETE',
		path: buildMetabasePath('/api/transform-tag/{tag-id}', input.path),
	}),
);

const openApiInput276 = z
	.object({
		query: z
			.object({
				'run-methods': z
					.union([
						z.array(z.union([z.literal('manual'), z.literal('cron')])),
						z.null(),
					])
					.optional(),
				'end-time': z.union([z.string().min(1), z.null()]).optional(),
				'start-time': z.union([z.string().min(1), z.null()]).optional(),
				'transform-tag-ids': z
					.union([z.array(z.number().int().min(0)), z.null()])
					.optional(),
				'sort-direction': z
					.union([z.literal('asc'), z.literal('desc')])
					.optional(),
				'user-id': z.union([z.number().int().min(1), z.null()]).optional(),
				statuses: z
					.union([
						z.array(
							z.union([
								z.literal('started'),
								z.literal('succeeded'),
								z.literal('failed'),
								z.literal('timeout'),
							]),
						),
						z.null(),
					])
					.optional(),
				'transform-ids': z
					.union([z.array(z.number().int().min(1)), z.null()])
					.optional(),
				'sort-column': z
					.union([
						z.literal('transform-name'),
						z.literal('start-time'),
						z.literal('end-time'),
						z.literal('status'),
						z.literal('run-method'),
						z.literal('transform-tags'),
						z.literal('duration'),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput276 = z
	.object({
		data: z.array(
			z
				.object({
					message: z.union([z.string(), z.null()]),
					user_id: z.union([z.number().int().min(1), z.null()]),
					checkpoint_hi_value: z.union([z.string(), z.null()]).optional(),
					is_active: z.union([z.boolean(), z.null()]),
					transform_id: z.union([z.number().int().min(1), z.null()]),
					id: z.number().int().min(1),
					transform: z
						.union([
							z
								.object({
									collection: z
										.union([z.record(z.string(), z.json()), z.null()])
										.optional(),
									collection_id: z
										.union([z.number().int().min(1), z.null()])
										.optional(),
									deleted: z.boolean().optional(),
									id: z.number().int().min(1).optional(),
									name: z.string().optional(),
									tag_ids: z.array(z.number().int().min(1)).optional(),
								})
								.strict(),
							z.null(),
						])
						.optional(),
					run_method: z.string(),
					checkpoint_lo_value: z.union([z.string(), z.null()]).optional(),
					status: z.union([
						z.literal('started'),
						z.literal('succeeded'),
						z.literal('failed'),
						z.literal('timeout'),
						z.literal('canceled'),
						z.literal('canceling'),
					]),
					transform_entity_id: z.union([z.string(), z.null()]).optional(),
					checkpoint_filter_field_id: z
						.union([z.number().int().min(1), z.null()])
						.optional(),
					end_time: z.json().optional(),
					metered_as: z.union([z.string(), z.null()]).optional(),
					dag_run_id: z.union([z.number().int().min(1), z.null()]).optional(),
					transform_name: z.union([z.string(), z.null()]).optional(),
					start_time: z.json(),
					job_run_id: z.union([z.number().int().min(1), z.null()]).optional(),
				})
				.strict(),
		),
		limit: z.number().int().min(1),
		offset: z.number().int(),
		total: z.number().int(),
	})
	.strict();
const openApiEndpoint276 = createMetabaseEndpoint(
	'transform.getRun',
	openApiInput276,
	openApiOutput276,
	(input) => ({
		method: 'GET',
		path: '/api/transform/run',
		query: input.query,
	}),
);

const openApiInput277 = z
	.object({ path: z.object({ 'run-id': z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput277 = z
	.object({
		message: z.union([z.string(), z.null()]),
		user_id: z.union([z.number().int().min(1), z.null()]),
		checkpoint_hi_value: z.union([z.string(), z.null()]).optional(),
		is_active: z.union([z.boolean(), z.null()]),
		transform_id: z.union([z.number().int().min(1), z.null()]),
		id: z.number().int().min(1),
		transform: z
			.union([
				z
					.object({
						collection: z
							.union([z.record(z.string(), z.json()), z.null()])
							.optional(),
						collection_id: z
							.union([z.number().int().min(1), z.null()])
							.optional(),
						deleted: z.boolean().optional(),
						id: z.number().int().min(1).optional(),
						name: z.string().optional(),
						tag_ids: z.array(z.number().int().min(1)).optional(),
					})
					.strict(),
				z.null(),
			])
			.optional(),
		run_method: z.string(),
		checkpoint_lo_value: z.union([z.string(), z.null()]).optional(),
		status: z.union([
			z.literal('started'),
			z.literal('succeeded'),
			z.literal('failed'),
			z.literal('timeout'),
			z.literal('canceled'),
			z.literal('canceling'),
		]),
		transform_entity_id: z.union([z.string(), z.null()]).optional(),
		checkpoint_filter_field_id: z
			.union([z.number().int().min(1), z.null()])
			.optional(),
		end_time: z.json().optional(),
		metered_as: z.union([z.string(), z.null()]).optional(),
		dag_run_id: z.union([z.number().int().min(1), z.null()]).optional(),
		transform_name: z.union([z.string(), z.null()]).optional(),
		start_time: z.json(),
		job_run_id: z.union([z.number().int().min(1), z.null()]).optional(),
	})
	.strict();
const openApiEndpoint277 = createMetabaseEndpoint(
	'transform.getRunByRunId',
	openApiInput277,
	openApiOutput277,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/transform/run/{run-id}', input.path),
	}),
);

const openApiInput278 = z
	.object({
		query: z
			.object({
				types: z
					.union([
						z.array(
							z.union([
								z.literal('job'),
								z.literal('dag'),
								z.literal('transform'),
							]),
						),
						z.null(),
					])
					.optional(),
				statuses: z
					.union([
						z.array(
							z.union([
								z.literal('started'),
								z.literal('succeeded'),
								z.literal('failed'),
								z.literal('timeout'),
								z.literal('canceled'),
								z.literal('canceling'),
							]),
						),
						z.null(),
					])
					.optional(),
				'run-methods': z
					.union([
						z.array(z.union([z.literal('manual'), z.literal('cron')])),
						z.null(),
					])
					.optional(),
				'start-time': z.union([z.string().min(1), z.null()]).optional(),
				'end-time': z.union([z.string().min(1), z.null()]).optional(),
				'transform-ids': z
					.union([z.array(z.number().int().min(1)), z.null()])
					.optional(),
				'sort-column': z
					.union([
						z.union([z.literal('start_time'), z.literal('end_time')]),
						z.null(),
					])
					.optional(),
				'sort-direction': z
					.union([z.union([z.literal('asc'), z.literal('desc')]), z.null()])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput278 = z
	.object({
		data: z.array(
			z
				.object({
					message: z.union([z.string(), z.null()]),
					run_type: z.union([
						z.literal('job'),
						z.literal('dag'),
						z.literal('transform'),
					]),
					user_id: z.union([z.number().int().min(1), z.null()]),
					entity_id: z.union([z.number().int().min(1), z.null()]),
					is_active: z.union([z.boolean(), z.null()]),
					transform_count: z.union([z.number().int().min(1), z.null()]),
					id: z.number().int().min(1),
					run_method: z.union([z.string(), z.null()]),
					name: z.union([z.union([z.string(), z.string()]), z.null()]),
					direction: z.union([
						z.union([z.literal('upstream'), z.literal('downstream')]),
						z.null(),
					]),
					status: z.union([
						z.literal('started'),
						z.literal('succeeded'),
						z.literal('failed'),
						z.literal('timeout'),
						z.literal('canceled'),
						z.literal('canceling'),
					]),
					end_time: z.json().optional(),
					start_time: z.json(),
				})
				.strict(),
		),
		limit: z.number().int().min(1),
		offset: z.number().int(),
		total: z.number().int(),
	})
	.strict();
const openApiEndpoint278 = createMetabaseEndpoint(
	'transform.getRuns',
	openApiInput278,
	openApiOutput278,
	(input) => ({
		method: 'GET',
		path: '/api/transform/runs',
		query: input.query,
	}),
);

const openApiInput279 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput279 = z
	.object({
		table: z.union([z.record(z.string(), z.json()), z.null()]).optional(),
		owner: z
			.union([
				z
					.object({
						common_name: z.union([z.string(), z.null()]).optional(),
						email: z.string(),
						first_name: z.union([z.string(), z.null()]).optional(),
						id: z.number().int().min(1).optional(),
						last_name: z.union([z.string(), z.null()]).optional(),
					})
					.strict(),
				z.null(),
			])
			.optional(),
		can_read: z.boolean().optional(),
		source_type: z.string(),
		entity_id: z.union([z.string(), z.null()]),
		last_run: z
			.union([
				z
					.object({
						message: z.union([z.string(), z.null()]),
						user_id: z.union([z.number().int().min(1), z.null()]),
						checkpoint_hi_value: z.union([z.string(), z.null()]).optional(),
						is_active: z.union([z.boolean(), z.null()]),
						transform_id: z.number().int().min(1),
						id: z.number().int().min(1),
						run_method: z.string(),
						checkpoint_lo_value: z.union([z.string(), z.null()]).optional(),
						status: z.union([
							z.literal('started'),
							z.literal('succeeded'),
							z.literal('failed'),
							z.literal('timeout'),
							z.literal('canceled'),
							z.literal('canceling'),
						]),
						transform_entity_id: z.union([z.string(), z.null()]).optional(),
						checkpoint_filter_field_id: z
							.union([z.number().int().min(1), z.null()])
							.optional(),
						end_time: z.json().optional(),
						metered_as: z.union([z.string(), z.null()]).optional(),
						dag_run_id: z.union([z.number().int().min(1), z.null()]).optional(),
						transform_name: z.union([z.string(), z.null()]).optional(),
						start_time: z.json(),
						job_run_id: z.union([z.number().int().min(1), z.null()]).optional(),
					})
					.strict(),
				z.null(),
			])
			.optional(),
		source_database_id: z.union([z.number().int().min(1), z.null()]).optional(),
		id: z.number().int().min(1),
		owner_email: z.union([z.string(), z.null()]).optional(),
		target_db_id: z.union([z.number().int().min(1), z.null()]).optional(),
		creator: z
			.object({
				is_qbnewb: z.boolean().optional(),
				last_login: z.json().optional(),
				id: z.number().int().min(1),
				email: z.string(),
				is_data_analyst: z.boolean().optional(),
				is_superuser: z.boolean().optional(),
				tenant_id: z.json().optional(),
				last_name: z.union([z.string(), z.null()]),
				first_name: z.union([z.string(), z.null()]),
				date_joined: z.json().optional(),
				common_name: z.union([z.string(), z.null()]).optional(),
			})
			.strict(),
		owner_user_id: z.union([z.number().int().min(1), z.null()]).optional(),
		name: z.string(),
		updated_at: z.json(),
		source_readable: z.union([z.boolean(), z.null()]).optional(),
		tag_ids: z.array(z.number().int().min(1)).optional(),
		table_dependencies: z
			.union([z.array(z.record(z.string(), z.json())), z.null()])
			.optional(),
		can_write: z.boolean().optional(),
		collection_id: z.union([z.number().int().min(1), z.null()]),
		can_execute: z.boolean().optional(),
		source: z.json(),
		requestable_indexes: z
			.union([OpenApiSchemas.MetabaseOpenApiOutputSchema294, z.null()])
			.optional(),
		last_checkpoint_value: z.union([z.string(), z.null()]).optional(),
		target: z.json(),
		created_at: z.json(),
		creator_id: z.number().int().min(1),
		run_trigger: z.union([z.string(), z.null()]).optional(),
		target_table_id: z.union([z.number().int().min(1), z.null()]).optional(),
		description: z.union([z.string(), z.null()]),
	})
	.strict();
const openApiEndpoint279 = createMetabaseEndpoint(
	'transform.getById',
	openApiInput279,
	openApiOutput279,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/transform/{id}', input.path),
	}),
);

const openApiInput280 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z
			.object({
				owner_email: z.union([z.string(), z.null()]).optional(),
				owner_user_id: z.union([z.number().int().min(1), z.null()]).optional(),
				name: z.string().optional(),
				tag_ids: z.array(z.number().int().min(1)).optional(),
				collection_id: z.union([z.number().int().min(1), z.null()]).optional(),
				source: OpenApiSchemas.MetabaseOpenApiInputSchema705.optional(),
				target: OpenApiSchemas.MetabaseOpenApiInputSchema706.optional(),
				run_trigger: OpenApiSchemas.MetabaseOpenApiInputSchema700.optional(),
				description: z.union([z.string(), z.null()]).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput280 = z
	.object({
		table: z.union([z.record(z.string(), z.json()), z.null()]).optional(),
		owner: z
			.union([
				z
					.object({
						common_name: z.union([z.string(), z.null()]).optional(),
						email: z.string(),
						first_name: z.union([z.string(), z.null()]).optional(),
						id: z.number().int().min(1).optional(),
						last_name: z.union([z.string(), z.null()]).optional(),
					})
					.strict(),
				z.null(),
			])
			.optional(),
		can_read: z.boolean().optional(),
		source_type: z.string(),
		entity_id: z.union([z.string(), z.null()]),
		last_run: z
			.union([
				z
					.object({
						message: z.union([z.string(), z.null()]),
						user_id: z.union([z.number().int().min(1), z.null()]),
						checkpoint_hi_value: z.union([z.string(), z.null()]).optional(),
						is_active: z.union([z.boolean(), z.null()]),
						transform_id: z.number().int().min(1),
						id: z.number().int().min(1),
						run_method: z.string(),
						checkpoint_lo_value: z.union([z.string(), z.null()]).optional(),
						status: z.union([
							z.literal('started'),
							z.literal('succeeded'),
							z.literal('failed'),
							z.literal('timeout'),
							z.literal('canceled'),
							z.literal('canceling'),
						]),
						transform_entity_id: z.union([z.string(), z.null()]).optional(),
						checkpoint_filter_field_id: z
							.union([z.number().int().min(1), z.null()])
							.optional(),
						end_time: z.json().optional(),
						metered_as: z.union([z.string(), z.null()]).optional(),
						dag_run_id: z.union([z.number().int().min(1), z.null()]).optional(),
						transform_name: z.union([z.string(), z.null()]).optional(),
						start_time: z.json(),
						job_run_id: z.union([z.number().int().min(1), z.null()]).optional(),
					})
					.strict(),
				z.null(),
			])
			.optional(),
		source_database_id: z.union([z.number().int().min(1), z.null()]).optional(),
		id: z.number().int().min(1),
		owner_email: z.union([z.string(), z.null()]).optional(),
		target_db_id: z.union([z.number().int().min(1), z.null()]).optional(),
		creator: z
			.object({
				is_qbnewb: z.boolean().optional(),
				last_login: z.json().optional(),
				id: z.number().int().min(1),
				email: z.string(),
				is_data_analyst: z.boolean().optional(),
				is_superuser: z.boolean().optional(),
				tenant_id: z.json().optional(),
				last_name: z.union([z.string(), z.null()]),
				first_name: z.union([z.string(), z.null()]),
				date_joined: z.json().optional(),
				common_name: z.union([z.string(), z.null()]).optional(),
			})
			.strict(),
		owner_user_id: z.union([z.number().int().min(1), z.null()]).optional(),
		name: z.string(),
		updated_at: z.json(),
		source_readable: z.union([z.boolean(), z.null()]).optional(),
		tag_ids: z.array(z.number().int().min(1)).optional(),
		table_dependencies: z
			.union([z.array(z.record(z.string(), z.json())), z.null()])
			.optional(),
		can_write: z.boolean().optional(),
		collection_id: z.union([z.number().int().min(1), z.null()]),
		can_execute: z.boolean().optional(),
		source: z.json(),
		requestable_indexes: z
			.union([OpenApiSchemas.MetabaseOpenApiOutputSchema294, z.null()])
			.optional(),
		last_checkpoint_value: z.union([z.string(), z.null()]).optional(),
		target: z.json(),
		created_at: z.json(),
		creator_id: z.number().int().min(1),
		run_trigger: z.union([z.string(), z.null()]).optional(),
		target_table_id: z.union([z.number().int().min(1), z.null()]).optional(),
		description: z.union([z.string(), z.null()]),
	})
	.strict();
const openApiEndpoint280 = createMetabaseEndpoint(
	'transform.putById',
	openApiInput280,
	openApiOutput280,
	(input) => ({
		method: 'PUT',
		path: buildMetabasePath('/api/transform/{id}', input.path),
		body: input.body,
	}),
);

const openApiInput281 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput281 = z.null();
const openApiEndpoint281 = createMetabaseEndpoint(
	'transform.deleteById',
	openApiInput281,
	openApiOutput281,
	(input) => ({
		method: 'DELETE',
		path: buildMetabasePath('/api/transform/{id}', input.path),
	}),
);

const openApiInput282 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput282 = z.null();
const openApiEndpoint282 = createMetabaseEndpoint(
	'transform.postByIdCancel',
	openApiInput282,
	openApiOutput282,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath('/api/transform/{id}/cancel', input.path),
	}),
);

const openApiInput283 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		query: z
			.object({
				direction: z.union([z.literal('upstream'), z.literal('downstream')]),
			})
			.strict(),
	})
	.strict();
const openApiOutput283 = z.array(
	z.object({ id: z.number().int().min(1), name: z.string() }).strict(),
);
const openApiEndpoint283 = createMetabaseEndpoint(
	'transform.getByIdDagTransforms',
	openApiInput283,
	openApiOutput283,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/transform/{id}/dag-transforms', input.path),
		query: input.query,
	}),
);

const openApiInput284 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput284 = z.array(
	z
		.object({
			table: z.union([z.record(z.string(), z.json()), z.null()]).optional(),
			owner: z
				.union([
					z
						.object({
							common_name: z.union([z.string(), z.null()]).optional(),
							email: z.string(),
							first_name: z.union([z.string(), z.null()]).optional(),
							id: z.number().int().min(1).optional(),
							last_name: z.union([z.string(), z.null()]).optional(),
						})
						.strict(),
					z.null(),
				])
				.optional(),
			can_read: z.boolean().optional(),
			source_type: z.string(),
			entity_id: z.union([z.string(), z.null()]),
			last_run: z
				.union([
					z
						.object({
							message: z.union([z.string(), z.null()]),
							user_id: z.union([z.number().int().min(1), z.null()]),
							checkpoint_hi_value: z.union([z.string(), z.null()]).optional(),
							is_active: z.union([z.boolean(), z.null()]),
							transform_id: z.number().int().min(1),
							id: z.number().int().min(1),
							run_method: z.string(),
							checkpoint_lo_value: z.union([z.string(), z.null()]).optional(),
							status: z.union([
								z.literal('started'),
								z.literal('succeeded'),
								z.literal('failed'),
								z.literal('timeout'),
								z.literal('canceled'),
								z.literal('canceling'),
							]),
							transform_entity_id: z.union([z.string(), z.null()]).optional(),
							checkpoint_filter_field_id: z
								.union([z.number().int().min(1), z.null()])
								.optional(),
							end_time: z.json().optional(),
							metered_as: z.union([z.string(), z.null()]).optional(),
							dag_run_id: z
								.union([z.number().int().min(1), z.null()])
								.optional(),
							transform_name: z.union([z.string(), z.null()]).optional(),
							start_time: z.json(),
							job_run_id: z
								.union([z.number().int().min(1), z.null()])
								.optional(),
						})
						.strict(),
					z.null(),
				])
				.optional(),
			source_database_id: z
				.union([z.number().int().min(1), z.null()])
				.optional(),
			id: z.number().int().min(1),
			owner_email: z.union([z.string(), z.null()]).optional(),
			target_db_id: z.union([z.number().int().min(1), z.null()]).optional(),
			creator: z
				.object({
					is_qbnewb: z.boolean().optional(),
					last_login: z.json().optional(),
					id: z.number().int().min(1),
					email: z.string(),
					is_data_analyst: z.boolean().optional(),
					is_superuser: z.boolean().optional(),
					tenant_id: z.json().optional(),
					last_name: z.union([z.string(), z.null()]),
					first_name: z.union([z.string(), z.null()]),
					date_joined: z.json().optional(),
					common_name: z.union([z.string(), z.null()]).optional(),
				})
				.strict(),
			owner_user_id: z.union([z.number().int().min(1), z.null()]).optional(),
			name: z.string(),
			updated_at: z.json(),
			source_readable: z.union([z.boolean(), z.null()]).optional(),
			tag_ids: z.array(z.number().int().min(1)).optional(),
			table_dependencies: z
				.union([z.array(z.record(z.string(), z.json())), z.null()])
				.optional(),
			can_write: z.boolean().optional(),
			collection_id: z.union([z.number().int().min(1), z.null()]),
			can_execute: z.boolean().optional(),
			source: z.json(),
			requestable_indexes: z
				.union([OpenApiSchemas.MetabaseOpenApiOutputSchema294, z.null()])
				.optional(),
			last_checkpoint_value: z.union([z.string(), z.null()]).optional(),
			target: z.json(),
			created_at: z.json(),
			creator_id: z.number().int().min(1),
			run_trigger: z.union([z.string(), z.null()]).optional(),
			target_table_id: z.union([z.number().int().min(1), z.null()]).optional(),
			description: z.union([z.string(), z.null()]),
		})
		.strict(),
);
const openApiEndpoint284 = createMetabaseEndpoint(
	'transform.getByIdDependencies',
	openApiInput284,
	openApiOutput284,
	(input) => ({
		method: 'GET',
		path: buildMetabasePath('/api/transform/{id}/dependencies', input.path),
	}),
);

const openApiInput285 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput285 = z.null();
const openApiEndpoint285 = createMetabaseEndpoint(
	'transform.postByIdResetCheckpoint',
	openApiInput285,
	openApiOutput285,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath('/api/transform/{id}/reset-checkpoint', input.path),
	}),
);

const openApiInput286 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput286 = z.object({
	body: z
		.object({
			message: z.json(),
			run_id: z.union([z.number().int().min(1), z.null()]),
		})
		.strict(),
	status: z.literal(202),
});
const openApiEndpoint286 = createMetabaseEndpoint(
	'transform.postByIdRun',
	openApiInput286,
	openApiOutput286,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath('/api/transform/{id}/run', input.path),
	}),
);

const openApiInput287 = z
	.object({
		path: z.object({ id: z.number().int().min(1) }).strict(),
		body: z
			.object({
				direction: z.union([z.literal('upstream'), z.literal('downstream')]),
			})
			.strict()
			.optional(),
	})
	.strict();
const openApiOutput287 = z.object({
	body: z
		.object({
			dag_run_id: z.union([z.number().int().min(1), z.null()]),
			message: z.json(),
		})
		.strict(),
	status: z.literal(202),
});
const openApiEndpoint287 = createMetabaseEndpoint(
	'transform.postByIdRunDag',
	openApiInput287,
	openApiOutput287,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath('/api/transform/{id}/run-dag', input.path),
		body: input.body,
	}),
);

const openApiInput288 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput288 = z.null();
const openApiEndpoint288 = createMetabaseEndpoint(
	'transform.deleteByIdTable',
	openApiInput288,
	openApiOutput288,
	(input) => ({
		method: 'DELETE',
		path: buildMetabasePath('/api/transform/{id}/table', input.path),
	}),
);

const openApiInput289 = z.object({}).strict();
const openApiOutput289 = OpenApiSchemas.MetabaseOpenApiOutputSchema707;
const openApiEndpoint289 = createMetabaseEndpoint(
	'user.getCurrent',
	openApiInput289,
	openApiOutput289,
	(input) => ({ method: 'GET', path: '/api/user/current' }),
);

const openApiInput290 = z
	.object({ path: z.object({ id: z.number().int().min(1) }).strict() })
	.strict();
const openApiOutput290 = z.object({ password_reset_url: z.string() });
const openApiEndpoint290 = createMetabaseEndpoint(
	'user.postByIdPasswordResetUrl',
	openApiInput290,
	openApiOutput290,
	(input) => ({
		method: 'POST',
		path: buildMetabasePath('/api/user/{id}/password-reset-url', input.path),
	}),
);

export const MetabaseOpenApiEndpoints = {
	action: {
		get: openApiEndpoint0,
		post: openApiEndpoint1,
		postExecute: openApiEndpoint2,
		getPublic: openApiEndpoint3,
		getByActionId: openApiEndpoint4,
		postByActionIdExecuteValues: openApiEndpoint5,
	},
	agent: {
		postV1Collection: openApiEndpoint6,
		postV1ConstructNativeQuery: openApiEndpoint7,
		postV1Dashboard: openApiEndpoint8,
		putV1DashboardById: openApiEndpoint9,
		postV1Execute: openApiEndpoint10,
		postV1ExecuteSql: openApiEndpoint11,
		postV1Metric: openApiEndpoint12,
		putV1MetricById: openApiEndpoint13,
		getV1Ping: openApiEndpoint14,
		postV1Question: openApiEndpoint15,
		putV1QuestionById: openApiEndpoint16,
		postV1QuestionByIdQuery: openApiEndpoint17,
		postV1ReadResource: openApiEndpoint18,
		postV1Search: openApiEndpoint19,
		postV2ConstructQuery: openApiEndpoint20,
		postV2Query: openApiEndpoint21,
	},
	analytics: {
		postInternal: openApiEndpoint22,
	},
	apiKey: {
		putByIdRegenerate: openApiEndpoint23,
	},
	cache: {
		get: openApiEndpoint24,
		put: openApiEndpoint25,
		delete: openApiEndpoint26,
		postInvalidate: openApiEndpoint27,
	},
	dashboard: {
		postByDashboardIdDashcardByDashcardIdExecuteValues: openApiEndpoint28,
		postByIdPdf: openApiEndpoint29,
	},
	dataStudio: {
		postTableDiscardValues: openApiEndpoint30,
		postTableEdit: openApiEndpoint31,
		postTableRescanValues: openApiEndpoint32,
		postTableSelection: openApiEndpoint33,
		postTableSyncSchema: openApiEndpoint34,
	},
	database: {
		getByIdSchemas: openApiEndpoint35,
		getByIdSettingsAvailable: openApiEndpoint36,
	},
	dataset: {
		post: openApiEndpoint37,
		postPivot: openApiEndpoint38,
		postByExportFormat: openApiEndpoint39,
	},
	document: {
		getPublic: openApiEndpoint40,
		postByDocumentIdPublicLink: openApiEndpoint41,
		postByFromDocumentIdCopy: openApiEndpoint42,
	},
	ee: {
		getAiControlsMcpPermissions: openApiEndpoint43,
		putAiControlsMcpPermissions: openApiEndpoint44,
		postAiControlsMcpPermissionsAdvanced: openApiEndpoint45,
		deleteAiControlsMcpPermissionsAdvanced: openApiEndpoint46,
		getAiControlsPermissions: openApiEndpoint47,
		putAiControlsPermissions: openApiEndpoint48,
		postAiControlsPermissionsAdvanced: openApiEndpoint49,
		deleteAiControlsPermissionsAdvanced: openApiEndpoint50,
		getAiControlsUsageGroup: openApiEndpoint51,
		getAiControlsUsageGroupByGroupId: openApiEndpoint52,
		putAiControlsUsageGroupByGroupId: openApiEndpoint53,
		getAiControlsUsageInstance: openApiEndpoint54,
		putAiControlsUsageInstance: openApiEndpoint55,
		getAiControlsUsageTenant: openApiEndpoint56,
		getAiControlsUsageTenantByTenantId: openApiEndpoint57,
		putAiControlsUsageTenantByTenantId: openApiEndpoint58,
		getApps: openApiEndpoint59,
		postAppsGenerateActions: openApiEndpoint60,
		postAppsGenerateQueries: openApiEndpoint61,
		getAppsGenerateSchema: openApiEndpoint62,
		getAppsRepoStatus: openApiEndpoint63,
		getAppsSandboxHost: openApiEndpoint64,
		putAppsBySlug: openApiEndpoint65,
		getAppsBySlug: openApiEndpoint66,
		getAppsBySlugBundle: openApiEndpoint67,
		getAppsBySlugGroupPermissionWarnings: openApiEndpoint68,
		getAppsBySlugGroups: openApiEndpoint69,
		postAppsBySlugGroups: openApiEndpoint70,
		deleteAppsBySlugGroupsByGroupId: openApiEndpoint71,
		postAuditAppAnalyticsDevExport: openApiEndpoint72,
		deleteCloudAddOnsByProductType: openApiEndpoint73,
		getContentDiagnosticsDuplicated: openApiEndpoint74,
		getContentDiagnosticsImbalanced: openApiEndpoint75,
		postContentDiagnosticsInvalidate: openApiEndpoint76,
		getContentDiagnosticsSlow: openApiEndpoint77,
		getContentDiagnosticsStale: openApiEndpoint78,
		getContentTranslationDictionary: openApiEndpoint79,
		postCustomVizPlugin: openApiEndpoint80,
		getCustomVizPlugin: openApiEndpoint81,
		postCustomVizPluginDev: openApiEndpoint82,
		getCustomVizPluginList: openApiEndpoint83,
		getCustomVizPluginSandboxHost: openApiEndpoint84,
		deleteCustomVizPluginById: openApiEndpoint85,
		putCustomVizPluginById: openApiEndpoint86,
		getCustomVizPluginByIdAsset: openApiEndpoint87,
		putCustomVizPluginByIdBundle: openApiEndpoint88,
		getCustomVizPluginByIdBundle: openApiEndpoint89,
		putCustomVizPluginByIdDevUrl: openApiEndpoint90,
		postCustomVizPluginByIdRefresh: openApiEndpoint91,
		getDataComplexityScoreComplexity: openApiEndpoint92,
		postDataStudioTablePublishTables: openApiEndpoint93,
		postDataStudioTableUnpublishTables: openApiEndpoint94,
		getDataStudioTableByIdPublishingInfo: openApiEndpoint95,
		getDependenciesBackfillStatus: openApiEndpoint96,
		getDependenciesGraph: openApiEndpoint97,
		getDependenciesGraphBreaking: openApiEndpoint98,
		getDependenciesGraphBroken: openApiEndpoint99,
		getDependenciesGraphDependents: openApiEndpoint100,
		getDependenciesGraphUnreferenced: openApiEndpoint101,
		getErd: openApiEndpoint102,
		postGsheetsConnection: openApiEndpoint103,
		getGsheetsConnection: openApiEndpoint104,
		getGsheetsServiceAccount: openApiEndpoint105,
		getLibrary: openApiEndpoint106,
		getMetabotAnalyticsConversations: openApiEndpoint107,
		getMetabotAnalyticsConversationsById: openApiEndpoint108,
		getMetabotUsage: openApiEndpoint109,
		getMfaAdminEnrolledUsers: openApiEndpoint110,
		getMfaAdminOverview: openApiEndpoint111,
		getMfaAdminUnenrolledUsers: openApiEndpoint112,
		postMfaEnroll: openApiEndpoint113,
		postMfaEnrollConfirm: openApiEndpoint114,
		postMfaRecoveryCodes: openApiEndpoint115,
		getMfaStatus: openApiEndpoint116,
		getPermissionDebug: openApiEndpoint117,
		getRemoteSyncBranches: openApiEndpoint118,
		postRemoteSyncCreateBranch: openApiEndpoint119,
		getRemoteSyncCurrentTask: openApiEndpoint120,
		postRemoteSyncCurrentTaskCancel: openApiEndpoint121,
		getRemoteSyncDirty: openApiEndpoint122,
		postRemoteSyncExport: openApiEndpoint123,
		getRemoteSyncExportPreflight: openApiEndpoint124,
		getRemoteSyncHasRemoteChanges: openApiEndpoint125,
		postRemoteSyncImport: openApiEndpoint126,
		getRemoteSyncIsDirty: openApiEndpoint127,
		putRemoteSyncSettings: openApiEndpoint128,
		postRemoteSyncStash: openApiEndpoint129,
		postRemoteSyncTestConnection: openApiEndpoint130,
		postReplacementCheckReplaceSource: openApiEndpoint131,
		postReplacementReplaceModelWithTransform: openApiEndpoint132,
		postReplacementReplaceSource: openApiEndpoint133,
		getReplacementRuns: openApiEndpoint134,
		getReplacementRunsById: openApiEndpoint135,
		postReplacementRunsByIdCancel: openApiEndpoint136,
		getSecurityCenter: openApiEndpoint137,
		postSecurityCenterAcknowledge: openApiEndpoint138,
		postSecurityCenterSync: openApiEndpoint139,
		postSecurityCenterTestNotification: openApiEndpoint140,
		postSecurityCenterByAdvisoryIdAcknowledge: openApiEndpoint141,
		getSessionManagement: openApiEndpoint142,
		postSessionManagementRevoke: openApiEndpoint143,
		postSupportAccessGrant: openApiEndpoint144,
		getSupportAccessGrant: openApiEndpoint145,
		getSupportAccessGrantCurrent: openApiEndpoint146,
		putSupportAccessGrantByIdRevoke: openApiEndpoint147,
		postTenant: openApiEndpoint148,
		getTenant: openApiEndpoint149,
		putTenantById: openApiEndpoint150,
		getTenantById: openApiEndpoint151,
		getTransformTest: openApiEndpoint152,
		postTransformTest: openApiEndpoint153,
		getTransformTestById: openApiEndpoint154,
		putTransformTestById: openApiEndpoint155,
		deleteTransformTestById: openApiEndpoint156,
		getTransformTestByIdRun: openApiEndpoint157,
		postTransformTestByIdRun: openApiEndpoint158,
		postTransformsPythonTestRun: openApiEndpoint159,
		getTransformsByIdInspect: openApiEndpoint160,
		getTransformsByIdInspectByLensId: openApiEndpoint161,
		postTransformsByIdInspectByLensIdQuery: openApiEndpoint162,
	},
	embedMcp: {
		getBootstrap: openApiEndpoint163,
		postFeedback: openApiEndpoint164,
		getQueriesByHandle: openApiEndpoint165,
	},
	embedTheme: {
		get: openApiEndpoint166,
		post: openApiEndpoint167,
		postSeedDefaults: openApiEndpoint168,
		getById: openApiEndpoint169,
		putById: openApiEndpoint170,
		deleteById: openApiEndpoint171,
		postByIdCopy: openApiEndpoint172,
	},
	embeddingHub: {
		getChecklist: openApiEndpoint173,
	},
	embeddingSdk: {
		getReact18Hosts: openApiEndpoint174,
	},
	evalTrace: {
		getBySessionId: openApiEndpoint175,
	},
	exploration: {
		post: openApiEndpoint176,
		getDimensions: openApiEndpoint177,
		getMine: openApiEndpoint178,
		putPageByIdStarred: openApiEndpoint179,
		putPagesHidden: openApiEndpoint180,
		getQueryById: openApiEndpoint181,
		postThreadByThreadIdCancel: openApiEndpoint182,
		postThreadByThreadIdRestart: openApiEndpoint183,
		getById: openApiEndpoint184,
		putById: openApiEndpoint185,
		deleteById: openApiEndpoint186,
		postByIdExploreFurther: openApiEndpoint187,
		postByIdSummaryAppend: openApiEndpoint188,
	},
	field: {
		postTableIds: openApiEndpoint189,
	},
	healthInspector: {
		get: openApiEndpoint190,
	},
	index: {
		get: openApiEndpoint191,
		postRequest: openApiEndpoint192,
		getRequestById: openApiEndpoint193,
		putRequestById: openApiEndpoint194,
	},
	llm: {
		postExtractSources: openApiEndpoint195,
		getModels: openApiEndpoint196,
		getProviderTypes: openApiEndpoint197,
		getProviders: openApiEndpoint198,
		postProviders: openApiEndpoint199,
		putProvidersByKey: openApiEndpoint200,
		deleteProvidersByKey: openApiEndpoint201,
	},
	logger: {
		getPresets: openApiEndpoint202,
	},
	measure: {
		post: openApiEndpoint203,
		get: openApiEndpoint204,
		getById: openApiEndpoint205,
		putById: openApiEndpoint206,
		getByIdDimensionByDimensionKeyRemapping: openApiEndpoint207,
		getByIdDimensionByDimensionKeySearch: openApiEndpoint208,
		getByIdDimensionByDimensionKeyValues: openApiEndpoint209,
	},
	metabot: {
		getConversations: openApiEndpoint210,
		getConversationsById: openApiEndpoint211,
		postConversationsByIdFork: openApiEndpoint212,
		postConversationsByIdSavedEntity: openApiEndpoint213,
		getConversationsByIdTitle: openApiEndpoint214,
		postDocumentGenerateContent: openApiEndpoint215,
		postFeedback: openApiEndpoint216,
		postMetabotByIdPromptSuggestionsRegenerate: openApiEndpoint217,
		getPermissionsUserPermissions: openApiEndpoint218,
		putSlackSettings: openApiEndpoint219,
		postSourceFeedback: openApiEndpoint220,
	},
	metric: {
		get: openApiEndpoint221,
		postBreakoutValues: openApiEndpoint222,
		postDataset: openApiEndpoint223,
		getById: openApiEndpoint224,
		getByIdDimension: openApiEndpoint225,
		postByIdDimensionAdd: openApiEndpoint226,
		postByIdDimensionRemove: openApiEndpoint227,
		postByIdDimensionReorder: openApiEndpoint228,
		postByIdDimensionSetDefault: openApiEndpoint229,
		postByIdDimensionByDimensionKey: openApiEndpoint230,
		getByIdDimensionByDimensionKeyRemapping: openApiEndpoint231,
		getByIdDimensionByDimensionKeySearch: openApiEndpoint232,
		getByIdDimensionByDimensionKeyValues: openApiEndpoint233,
	},
	notification: {
		post: openApiEndpoint234,
		getAdmin: openApiEndpoint235,
		postAdminBulk: openApiEndpoint236,
		getAdminById: openApiEndpoint237,
	},
	oauth: {
		getAuthorizations: openApiEndpoint238,
	},
	osi: {
		getAiContext: openApiEndpoint239,
		postAiContextReconcile: openApiEndpoint240,
		getAiContextByEntityTypeByEntityLocalId: openApiEndpoint241,
		putAiContextByEntityTypeByEntityLocalId: openApiEndpoint242,
	},
	permissions: {
		getInviteGroupIds: openApiEndpoint243,
	},
	previewEmbed: {
		getCardByTokenParamsByParamKeyValues: openApiEndpoint244,
	},
	public: {
		postDashboardByUuidDashcardByDashcardIdExecuteValues: openApiEndpoint245,
	},
	session: {
		getIllustrationByKey: openApiEndpoint246,
		postMfaEnroll: openApiEndpoint247,
		postMfaSendEmailOtp: openApiEndpoint248,
	},
	slack: {
		getAppInfo: openApiEndpoint249,
		getManifest: openApiEndpoint250,
	},
	table: {
		putByIdFieldsOrder: openApiEndpoint251,
	},
	task: {
		getRuns: openApiEndpoint252,
		getRunsEntities: openApiEndpoint253,
		getRunsById: openApiEndpoint254,
	},
	timeline: {
		post: openApiEndpoint255,
		get: openApiEndpoint256,
		getById: openApiEndpoint257,
	},
	transform: {
		get: openApiEndpoint258,
		post: openApiEndpoint259,
		getRun: openApiEndpoint276,
		getRunByRunId: openApiEndpoint277,
		getRuns: openApiEndpoint278,
		getById: openApiEndpoint279,
		putById: openApiEndpoint280,
		deleteById: openApiEndpoint281,
		postByIdCancel: openApiEndpoint282,
		getByIdDagTransforms: openApiEndpoint283,
		getByIdDependencies: openApiEndpoint284,
		postByIdResetCheckpoint: openApiEndpoint285,
		postByIdRun: openApiEndpoint286,
		postByIdRunDag: openApiEndpoint287,
		deleteByIdTable: openApiEndpoint288,
	},
	transformDagRun: {
		postByRunIdCancel: openApiEndpoint260,
		getByRunIdTransformRuns: openApiEndpoint261,
	},
	transformJob: {
		post: openApiEndpoint262,
		get: openApiEndpoint263,
		putActive: openApiEndpoint264,
		putByJobId: openApiEndpoint265,
		getByJobId: openApiEndpoint266,
		postByJobIdRun: openApiEndpoint267,
		getByJobIdRuns: openApiEndpoint268,
		postByJobIdRunsByRunIdCancel: openApiEndpoint269,
		getByJobIdRunsByRunIdTransformRuns: openApiEndpoint270,
		getByJobIdTransforms: openApiEndpoint271,
	},
	transformTag: {
		post: openApiEndpoint272,
		get: openApiEndpoint273,
		putByTagId: openApiEndpoint274,
		deleteByTagId: openApiEndpoint275,
	},
	user: {
		getCurrent: openApiEndpoint289,
		postByIdPasswordResetUrl: openApiEndpoint290,
	},
} as const;

export const MetabaseOpenApiEndpointSchemas = {
	'action.get': { input: openApiInput0, output: openApiOutput0 },
	'action.post': { input: openApiInput1, output: openApiOutput1 },
	'action.postExecute': { input: openApiInput2, output: openApiOutput2 },
	'action.getPublic': { input: openApiInput3, output: openApiOutput3 },
	'action.getByActionId': { input: openApiInput4, output: openApiOutput4 },
	'action.postByActionIdExecuteValues': {
		input: openApiInput5,
		output: openApiOutput5,
	},
	'agent.postV1Collection': { input: openApiInput6, output: openApiOutput6 },
	'agent.postV1ConstructNativeQuery': {
		input: openApiInput7,
		output: openApiOutput7,
	},
	'agent.postV1Dashboard': { input: openApiInput8, output: openApiOutput8 },
	'agent.putV1DashboardById': { input: openApiInput9, output: openApiOutput9 },
	'agent.postV1Execute': { input: openApiInput10, output: openApiOutput10 },
	'agent.postV1ExecuteSql': { input: openApiInput11, output: openApiOutput11 },
	'agent.postV1Metric': { input: openApiInput12, output: openApiOutput12 },
	'agent.putV1MetricById': { input: openApiInput13, output: openApiOutput13 },
	'agent.getV1Ping': { input: openApiInput14, output: openApiOutput14 },
	'agent.postV1Question': { input: openApiInput15, output: openApiOutput15 },
	'agent.putV1QuestionById': { input: openApiInput16, output: openApiOutput16 },
	'agent.postV1QuestionByIdQuery': {
		input: openApiInput17,
		output: openApiOutput17,
	},
	'agent.postV1ReadResource': {
		input: openApiInput18,
		output: openApiOutput18,
	},
	'agent.postV1Search': { input: openApiInput19, output: openApiOutput19 },
	'agent.postV2ConstructQuery': {
		input: openApiInput20,
		output: openApiOutput20,
	},
	'agent.postV2Query': { input: openApiInput21, output: openApiOutput21 },
	'analytics.postInternal': { input: openApiInput22, output: openApiOutput22 },
	'apiKey.putByIdRegenerate': {
		input: openApiInput23,
		output: openApiOutput23,
	},
	'cache.get': { input: openApiInput24, output: openApiOutput24 },
	'cache.put': { input: openApiInput25, output: openApiOutput25 },
	'cache.delete': { input: openApiInput26, output: openApiOutput26 },
	'cache.postInvalidate': { input: openApiInput27, output: openApiOutput27 },
	'dashboard.postByDashboardIdDashcardByDashcardIdExecuteValues': {
		input: openApiInput28,
		output: openApiOutput28,
	},
	'dashboard.postByIdPdf': { input: openApiInput29, output: openApiOutput29 },
	'dataStudio.postTableDiscardValues': {
		input: openApiInput30,
		output: openApiOutput30,
	},
	'dataStudio.postTableEdit': {
		input: openApiInput31,
		output: openApiOutput31,
	},
	'dataStudio.postTableRescanValues': {
		input: openApiInput32,
		output: openApiOutput32,
	},
	'dataStudio.postTableSelection': {
		input: openApiInput33,
		output: openApiOutput33,
	},
	'dataStudio.postTableSyncSchema': {
		input: openApiInput34,
		output: openApiOutput34,
	},
	'database.getByIdSchemas': { input: openApiInput35, output: openApiOutput35 },
	'database.getByIdSettingsAvailable': {
		input: openApiInput36,
		output: openApiOutput36,
	},
	'dataset.post': { input: openApiInput37, output: openApiOutput37 },
	'dataset.postPivot': { input: openApiInput38, output: openApiOutput38 },
	'dataset.postByExportFormat': {
		input: openApiInput39,
		output: openApiOutput39,
	},
	'document.getPublic': { input: openApiInput40, output: openApiOutput40 },
	'document.postByDocumentIdPublicLink': {
		input: openApiInput41,
		output: openApiOutput41,
	},
	'document.postByFromDocumentIdCopy': {
		input: openApiInput42,
		output: openApiOutput42,
	},
	'ee.getAiControlsMcpPermissions': {
		input: openApiInput43,
		output: openApiOutput43,
	},
	'ee.putAiControlsMcpPermissions': {
		input: openApiInput44,
		output: openApiOutput44,
	},
	'ee.postAiControlsMcpPermissionsAdvanced': {
		input: openApiInput45,
		output: openApiOutput45,
	},
	'ee.deleteAiControlsMcpPermissionsAdvanced': {
		input: openApiInput46,
		output: openApiOutput46,
	},
	'ee.getAiControlsPermissions': {
		input: openApiInput47,
		output: openApiOutput47,
	},
	'ee.putAiControlsPermissions': {
		input: openApiInput48,
		output: openApiOutput48,
	},
	'ee.postAiControlsPermissionsAdvanced': {
		input: openApiInput49,
		output: openApiOutput49,
	},
	'ee.deleteAiControlsPermissionsAdvanced': {
		input: openApiInput50,
		output: openApiOutput50,
	},
	'ee.getAiControlsUsageGroup': {
		input: openApiInput51,
		output: openApiOutput51,
	},
	'ee.getAiControlsUsageGroupByGroupId': {
		input: openApiInput52,
		output: openApiOutput52,
	},
	'ee.putAiControlsUsageGroupByGroupId': {
		input: openApiInput53,
		output: openApiOutput53,
	},
	'ee.getAiControlsUsageInstance': {
		input: openApiInput54,
		output: openApiOutput54,
	},
	'ee.putAiControlsUsageInstance': {
		input: openApiInput55,
		output: openApiOutput55,
	},
	'ee.getAiControlsUsageTenant': {
		input: openApiInput56,
		output: openApiOutput56,
	},
	'ee.getAiControlsUsageTenantByTenantId': {
		input: openApiInput57,
		output: openApiOutput57,
	},
	'ee.putAiControlsUsageTenantByTenantId': {
		input: openApiInput58,
		output: openApiOutput58,
	},
	'ee.getApps': { input: openApiInput59, output: openApiOutput59 },
	'ee.postAppsGenerateActions': {
		input: openApiInput60,
		output: openApiOutput60,
	},
	'ee.postAppsGenerateQueries': {
		input: openApiInput61,
		output: openApiOutput61,
	},
	'ee.getAppsGenerateSchema': {
		input: openApiInput62,
		output: openApiOutput62,
	},
	'ee.getAppsRepoStatus': { input: openApiInput63, output: openApiOutput63 },
	'ee.getAppsSandboxHost': { input: openApiInput64, output: openApiOutput64 },
	'ee.putAppsBySlug': { input: openApiInput65, output: openApiOutput65 },
	'ee.getAppsBySlug': { input: openApiInput66, output: openApiOutput66 },
	'ee.getAppsBySlugBundle': { input: openApiInput67, output: openApiOutput67 },
	'ee.getAppsBySlugGroupPermissionWarnings': {
		input: openApiInput68,
		output: openApiOutput68,
	},
	'ee.getAppsBySlugGroups': { input: openApiInput69, output: openApiOutput69 },
	'ee.postAppsBySlugGroups': { input: openApiInput70, output: openApiOutput70 },
	'ee.deleteAppsBySlugGroupsByGroupId': {
		input: openApiInput71,
		output: openApiOutput71,
	},
	'ee.postAuditAppAnalyticsDevExport': {
		input: openApiInput72,
		output: openApiOutput72,
	},
	'ee.deleteCloudAddOnsByProductType': {
		input: openApiInput73,
		output: openApiOutput73,
	},
	'ee.getContentDiagnosticsDuplicated': {
		input: openApiInput74,
		output: openApiOutput74,
	},
	'ee.getContentDiagnosticsImbalanced': {
		input: openApiInput75,
		output: openApiOutput75,
	},
	'ee.postContentDiagnosticsInvalidate': {
		input: openApiInput76,
		output: openApiOutput76,
	},
	'ee.getContentDiagnosticsSlow': {
		input: openApiInput77,
		output: openApiOutput77,
	},
	'ee.getContentDiagnosticsStale': {
		input: openApiInput78,
		output: openApiOutput78,
	},
	'ee.getContentTranslationDictionary': {
		input: openApiInput79,
		output: openApiOutput79,
	},
	'ee.postCustomVizPlugin': { input: openApiInput80, output: openApiOutput80 },
	'ee.getCustomVizPlugin': { input: openApiInput81, output: openApiOutput81 },
	'ee.postCustomVizPluginDev': {
		input: openApiInput82,
		output: openApiOutput82,
	},
	'ee.getCustomVizPluginList': {
		input: openApiInput83,
		output: openApiOutput83,
	},
	'ee.getCustomVizPluginSandboxHost': {
		input: openApiInput84,
		output: openApiOutput84,
	},
	'ee.deleteCustomVizPluginById': {
		input: openApiInput85,
		output: openApiOutput85,
	},
	'ee.putCustomVizPluginById': {
		input: openApiInput86,
		output: openApiOutput86,
	},
	'ee.getCustomVizPluginByIdAsset': {
		input: openApiInput87,
		output: openApiOutput87,
	},
	'ee.putCustomVizPluginByIdBundle': {
		input: openApiInput88,
		output: openApiOutput88,
	},
	'ee.getCustomVizPluginByIdBundle': {
		input: openApiInput89,
		output: openApiOutput89,
	},
	'ee.putCustomVizPluginByIdDevUrl': {
		input: openApiInput90,
		output: openApiOutput90,
	},
	'ee.postCustomVizPluginByIdRefresh': {
		input: openApiInput91,
		output: openApiOutput91,
	},
	'ee.getDataComplexityScoreComplexity': {
		input: openApiInput92,
		output: openApiOutput92,
	},
	'ee.postDataStudioTablePublishTables': {
		input: openApiInput93,
		output: openApiOutput93,
	},
	'ee.postDataStudioTableUnpublishTables': {
		input: openApiInput94,
		output: openApiOutput94,
	},
	'ee.getDataStudioTableByIdPublishingInfo': {
		input: openApiInput95,
		output: openApiOutput95,
	},
	'ee.getDependenciesBackfillStatus': {
		input: openApiInput96,
		output: openApiOutput96,
	},
	'ee.getDependenciesGraph': { input: openApiInput97, output: openApiOutput97 },
	'ee.getDependenciesGraphBreaking': {
		input: openApiInput98,
		output: openApiOutput98,
	},
	'ee.getDependenciesGraphBroken': {
		input: openApiInput99,
		output: openApiOutput99,
	},
	'ee.getDependenciesGraphDependents': {
		input: openApiInput100,
		output: openApiOutput100,
	},
	'ee.getDependenciesGraphUnreferenced': {
		input: openApiInput101,
		output: openApiOutput101,
	},
	'ee.getErd': { input: openApiInput102, output: openApiOutput102 },
	'ee.postGsheetsConnection': {
		input: openApiInput103,
		output: openApiOutput103,
	},
	'ee.getGsheetsConnection': {
		input: openApiInput104,
		output: openApiOutput104,
	},
	'ee.getGsheetsServiceAccount': {
		input: openApiInput105,
		output: openApiOutput105,
	},
	'ee.getLibrary': { input: openApiInput106, output: openApiOutput106 },
	'ee.getMetabotAnalyticsConversations': {
		input: openApiInput107,
		output: openApiOutput107,
	},
	'ee.getMetabotAnalyticsConversationsById': {
		input: openApiInput108,
		output: openApiOutput108,
	},
	'ee.getMetabotUsage': { input: openApiInput109, output: openApiOutput109 },
	'ee.getMfaAdminEnrolledUsers': {
		input: openApiInput110,
		output: openApiOutput110,
	},
	'ee.getMfaAdminOverview': {
		input: openApiInput111,
		output: openApiOutput111,
	},
	'ee.getMfaAdminUnenrolledUsers': {
		input: openApiInput112,
		output: openApiOutput112,
	},
	'ee.postMfaEnroll': { input: openApiInput113, output: openApiOutput113 },
	'ee.postMfaEnrollConfirm': {
		input: openApiInput114,
		output: openApiOutput114,
	},
	'ee.postMfaRecoveryCodes': {
		input: openApiInput115,
		output: openApiOutput115,
	},
	'ee.getMfaStatus': { input: openApiInput116, output: openApiOutput116 },
	'ee.getPermissionDebug': { input: openApiInput117, output: openApiOutput117 },
	'ee.getRemoteSyncBranches': {
		input: openApiInput118,
		output: openApiOutput118,
	},
	'ee.postRemoteSyncCreateBranch': {
		input: openApiInput119,
		output: openApiOutput119,
	},
	'ee.getRemoteSyncCurrentTask': {
		input: openApiInput120,
		output: openApiOutput120,
	},
	'ee.postRemoteSyncCurrentTaskCancel': {
		input: openApiInput121,
		output: openApiOutput121,
	},
	'ee.getRemoteSyncDirty': { input: openApiInput122, output: openApiOutput122 },
	'ee.postRemoteSyncExport': {
		input: openApiInput123,
		output: openApiOutput123,
	},
	'ee.getRemoteSyncExportPreflight': {
		input: openApiInput124,
		output: openApiOutput124,
	},
	'ee.getRemoteSyncHasRemoteChanges': {
		input: openApiInput125,
		output: openApiOutput125,
	},
	'ee.postRemoteSyncImport': {
		input: openApiInput126,
		output: openApiOutput126,
	},
	'ee.getRemoteSyncIsDirty': {
		input: openApiInput127,
		output: openApiOutput127,
	},
	'ee.putRemoteSyncSettings': {
		input: openApiInput128,
		output: openApiOutput128,
	},
	'ee.postRemoteSyncStash': {
		input: openApiInput129,
		output: openApiOutput129,
	},
	'ee.postRemoteSyncTestConnection': {
		input: openApiInput130,
		output: openApiOutput130,
	},
	'ee.postReplacementCheckReplaceSource': {
		input: openApiInput131,
		output: openApiOutput131,
	},
	'ee.postReplacementReplaceModelWithTransform': {
		input: openApiInput132,
		output: openApiOutput132,
	},
	'ee.postReplacementReplaceSource': {
		input: openApiInput133,
		output: openApiOutput133,
	},
	'ee.getReplacementRuns': { input: openApiInput134, output: openApiOutput134 },
	'ee.getReplacementRunsById': {
		input: openApiInput135,
		output: openApiOutput135,
	},
	'ee.postReplacementRunsByIdCancel': {
		input: openApiInput136,
		output: openApiOutput136,
	},
	'ee.getSecurityCenter': { input: openApiInput137, output: openApiOutput137 },
	'ee.postSecurityCenterAcknowledge': {
		input: openApiInput138,
		output: openApiOutput138,
	},
	'ee.postSecurityCenterSync': {
		input: openApiInput139,
		output: openApiOutput139,
	},
	'ee.postSecurityCenterTestNotification': {
		input: openApiInput140,
		output: openApiOutput140,
	},
	'ee.postSecurityCenterByAdvisoryIdAcknowledge': {
		input: openApiInput141,
		output: openApiOutput141,
	},
	'ee.getSessionManagement': {
		input: openApiInput142,
		output: openApiOutput142,
	},
	'ee.postSessionManagementRevoke': {
		input: openApiInput143,
		output: openApiOutput143,
	},
	'ee.postSupportAccessGrant': {
		input: openApiInput144,
		output: openApiOutput144,
	},
	'ee.getSupportAccessGrant': {
		input: openApiInput145,
		output: openApiOutput145,
	},
	'ee.getSupportAccessGrantCurrent': {
		input: openApiInput146,
		output: openApiOutput146,
	},
	'ee.putSupportAccessGrantByIdRevoke': {
		input: openApiInput147,
		output: openApiOutput147,
	},
	'ee.postTenant': { input: openApiInput148, output: openApiOutput148 },
	'ee.getTenant': { input: openApiInput149, output: openApiOutput149 },
	'ee.putTenantById': { input: openApiInput150, output: openApiOutput150 },
	'ee.getTenantById': { input: openApiInput151, output: openApiOutput151 },
	'ee.getTransformTest': { input: openApiInput152, output: openApiOutput152 },
	'ee.postTransformTest': { input: openApiInput153, output: openApiOutput153 },
	'ee.getTransformTestById': {
		input: openApiInput154,
		output: openApiOutput154,
	},
	'ee.putTransformTestById': {
		input: openApiInput155,
		output: openApiOutput155,
	},
	'ee.deleteTransformTestById': {
		input: openApiInput156,
		output: openApiOutput156,
	},
	'ee.getTransformTestByIdRun': {
		input: openApiInput157,
		output: openApiOutput157,
	},
	'ee.postTransformTestByIdRun': {
		input: openApiInput158,
		output: openApiOutput158,
	},
	'ee.postTransformsPythonTestRun': {
		input: openApiInput159,
		output: openApiOutput159,
	},
	'ee.getTransformsByIdInspect': {
		input: openApiInput160,
		output: openApiOutput160,
	},
	'ee.getTransformsByIdInspectByLensId': {
		input: openApiInput161,
		output: openApiOutput161,
	},
	'ee.postTransformsByIdInspectByLensIdQuery': {
		input: openApiInput162,
		output: openApiOutput162,
	},
	'embedMcp.getBootstrap': { input: openApiInput163, output: openApiOutput163 },
	'embedMcp.postFeedback': { input: openApiInput164, output: openApiOutput164 },
	'embedMcp.getQueriesByHandle': {
		input: openApiInput165,
		output: openApiOutput165,
	},
	'embedTheme.get': { input: openApiInput166, output: openApiOutput166 },
	'embedTheme.post': { input: openApiInput167, output: openApiOutput167 },
	'embedTheme.postSeedDefaults': {
		input: openApiInput168,
		output: openApiOutput168,
	},
	'embedTheme.getById': { input: openApiInput169, output: openApiOutput169 },
	'embedTheme.putById': { input: openApiInput170, output: openApiOutput170 },
	'embedTheme.deleteById': { input: openApiInput171, output: openApiOutput171 },
	'embedTheme.postByIdCopy': {
		input: openApiInput172,
		output: openApiOutput172,
	},
	'embeddingHub.getChecklist': {
		input: openApiInput173,
		output: openApiOutput173,
	},
	'embeddingSdk.getReact18Hosts': {
		input: openApiInput174,
		output: openApiOutput174,
	},
	'evalTrace.getBySessionId': {
		input: openApiInput175,
		output: openApiOutput175,
	},
	'exploration.post': { input: openApiInput176, output: openApiOutput176 },
	'exploration.getDimensions': {
		input: openApiInput177,
		output: openApiOutput177,
	},
	'exploration.getMine': { input: openApiInput178, output: openApiOutput178 },
	'exploration.putPageByIdStarred': {
		input: openApiInput179,
		output: openApiOutput179,
	},
	'exploration.putPagesHidden': {
		input: openApiInput180,
		output: openApiOutput180,
	},
	'exploration.getQueryById': {
		input: openApiInput181,
		output: openApiOutput181,
	},
	'exploration.postThreadByThreadIdCancel': {
		input: openApiInput182,
		output: openApiOutput182,
	},
	'exploration.postThreadByThreadIdRestart': {
		input: openApiInput183,
		output: openApiOutput183,
	},
	'exploration.getById': { input: openApiInput184, output: openApiOutput184 },
	'exploration.putById': { input: openApiInput185, output: openApiOutput185 },
	'exploration.deleteById': {
		input: openApiInput186,
		output: openApiOutput186,
	},
	'exploration.postByIdExploreFurther': {
		input: openApiInput187,
		output: openApiOutput187,
	},
	'exploration.postByIdSummaryAppend': {
		input: openApiInput188,
		output: openApiOutput188,
	},
	'field.postTableIds': { input: openApiInput189, output: openApiOutput189 },
	'healthInspector.get': { input: openApiInput190, output: openApiOutput190 },
	'index.get': { input: openApiInput191, output: openApiOutput191 },
	'index.postRequest': { input: openApiInput192, output: openApiOutput192 },
	'index.getRequestById': { input: openApiInput193, output: openApiOutput193 },
	'index.putRequestById': { input: openApiInput194, output: openApiOutput194 },
	'llm.postExtractSources': {
		input: openApiInput195,
		output: openApiOutput195,
	},
	'llm.getModels': { input: openApiInput196, output: openApiOutput196 },
	'llm.getProviderTypes': { input: openApiInput197, output: openApiOutput197 },
	'llm.getProviders': { input: openApiInput198, output: openApiOutput198 },
	'llm.postProviders': { input: openApiInput199, output: openApiOutput199 },
	'llm.putProvidersByKey': { input: openApiInput200, output: openApiOutput200 },
	'llm.deleteProvidersByKey': {
		input: openApiInput201,
		output: openApiOutput201,
	},
	'logger.getPresets': { input: openApiInput202, output: openApiOutput202 },
	'measure.post': { input: openApiInput203, output: openApiOutput203 },
	'measure.get': { input: openApiInput204, output: openApiOutput204 },
	'measure.getById': { input: openApiInput205, output: openApiOutput205 },
	'measure.putById': { input: openApiInput206, output: openApiOutput206 },
	'measure.getByIdDimensionByDimensionKeyRemapping': {
		input: openApiInput207,
		output: openApiOutput207,
	},
	'measure.getByIdDimensionByDimensionKeySearch': {
		input: openApiInput208,
		output: openApiOutput208,
	},
	'measure.getByIdDimensionByDimensionKeyValues': {
		input: openApiInput209,
		output: openApiOutput209,
	},
	'metabot.getConversations': {
		input: openApiInput210,
		output: openApiOutput210,
	},
	'metabot.getConversationsById': {
		input: openApiInput211,
		output: openApiOutput211,
	},
	'metabot.postConversationsByIdFork': {
		input: openApiInput212,
		output: openApiOutput212,
	},
	'metabot.postConversationsByIdSavedEntity': {
		input: openApiInput213,
		output: openApiOutput213,
	},
	'metabot.getConversationsByIdTitle': {
		input: openApiInput214,
		output: openApiOutput214,
	},
	'metabot.postDocumentGenerateContent': {
		input: openApiInput215,
		output: openApiOutput215,
	},
	'metabot.postFeedback': { input: openApiInput216, output: openApiOutput216 },
	'metabot.postMetabotByIdPromptSuggestionsRegenerate': {
		input: openApiInput217,
		output: openApiOutput217,
	},
	'metabot.getPermissionsUserPermissions': {
		input: openApiInput218,
		output: openApiOutput218,
	},
	'metabot.putSlackSettings': {
		input: openApiInput219,
		output: openApiOutput219,
	},
	'metabot.postSourceFeedback': {
		input: openApiInput220,
		output: openApiOutput220,
	},
	'metric.get': { input: openApiInput221, output: openApiOutput221 },
	'metric.postBreakoutValues': {
		input: openApiInput222,
		output: openApiOutput222,
	},
	'metric.postDataset': { input: openApiInput223, output: openApiOutput223 },
	'metric.getById': { input: openApiInput224, output: openApiOutput224 },
	'metric.getByIdDimension': {
		input: openApiInput225,
		output: openApiOutput225,
	},
	'metric.postByIdDimensionAdd': {
		input: openApiInput226,
		output: openApiOutput226,
	},
	'metric.postByIdDimensionRemove': {
		input: openApiInput227,
		output: openApiOutput227,
	},
	'metric.postByIdDimensionReorder': {
		input: openApiInput228,
		output: openApiOutput228,
	},
	'metric.postByIdDimensionSetDefault': {
		input: openApiInput229,
		output: openApiOutput229,
	},
	'metric.postByIdDimensionByDimensionKey': {
		input: openApiInput230,
		output: openApiOutput230,
	},
	'metric.getByIdDimensionByDimensionKeyRemapping': {
		input: openApiInput231,
		output: openApiOutput231,
	},
	'metric.getByIdDimensionByDimensionKeySearch': {
		input: openApiInput232,
		output: openApiOutput232,
	},
	'metric.getByIdDimensionByDimensionKeyValues': {
		input: openApiInput233,
		output: openApiOutput233,
	},
	'notification.post': { input: openApiInput234, output: openApiOutput234 },
	'notification.getAdmin': { input: openApiInput235, output: openApiOutput235 },
	'notification.postAdminBulk': {
		input: openApiInput236,
		output: openApiOutput236,
	},
	'notification.getAdminById': {
		input: openApiInput237,
		output: openApiOutput237,
	},
	'oauth.getAuthorizations': {
		input: openApiInput238,
		output: openApiOutput238,
	},
	'osi.getAiContext': { input: openApiInput239, output: openApiOutput239 },
	'osi.postAiContextReconcile': {
		input: openApiInput240,
		output: openApiOutput240,
	},
	'osi.getAiContextByEntityTypeByEntityLocalId': {
		input: openApiInput241,
		output: openApiOutput241,
	},
	'osi.putAiContextByEntityTypeByEntityLocalId': {
		input: openApiInput242,
		output: openApiOutput242,
	},
	'permissions.getInviteGroupIds': {
		input: openApiInput243,
		output: openApiOutput243,
	},
	'previewEmbed.getCardByTokenParamsByParamKeyValues': {
		input: openApiInput244,
		output: openApiOutput244,
	},
	'public.postDashboardByUuidDashcardByDashcardIdExecuteValues': {
		input: openApiInput245,
		output: openApiOutput245,
	},
	'session.getIllustrationByKey': {
		input: openApiInput246,
		output: openApiOutput246,
	},
	'session.postMfaEnroll': { input: openApiInput247, output: openApiOutput247 },
	'session.postMfaSendEmailOtp': {
		input: openApiInput248,
		output: openApiOutput248,
	},
	'slack.getAppInfo': { input: openApiInput249, output: openApiOutput249 },
	'slack.getManifest': { input: openApiInput250, output: openApiOutput250 },
	'table.putByIdFieldsOrder': {
		input: openApiInput251,
		output: openApiOutput251,
	},
	'task.getRuns': { input: openApiInput252, output: openApiOutput252 },
	'task.getRunsEntities': { input: openApiInput253, output: openApiOutput253 },
	'task.getRunsById': { input: openApiInput254, output: openApiOutput254 },
	'timeline.post': { input: openApiInput255, output: openApiOutput255 },
	'timeline.get': { input: openApiInput256, output: openApiOutput256 },
	'timeline.getById': { input: openApiInput257, output: openApiOutput257 },
	'transform.get': { input: openApiInput258, output: openApiOutput258 },
	'transform.post': { input: openApiInput259, output: openApiOutput259 },
	'transformDagRun.postByRunIdCancel': {
		input: openApiInput260,
		output: openApiOutput260,
	},
	'transformDagRun.getByRunIdTransformRuns': {
		input: openApiInput261,
		output: openApiOutput261,
	},
	'transformJob.post': { input: openApiInput262, output: openApiOutput262 },
	'transformJob.get': { input: openApiInput263, output: openApiOutput263 },
	'transformJob.putActive': {
		input: openApiInput264,
		output: openApiOutput264,
	},
	'transformJob.putByJobId': {
		input: openApiInput265,
		output: openApiOutput265,
	},
	'transformJob.getByJobId': {
		input: openApiInput266,
		output: openApiOutput266,
	},
	'transformJob.postByJobIdRun': {
		input: openApiInput267,
		output: openApiOutput267,
	},
	'transformJob.getByJobIdRuns': {
		input: openApiInput268,
		output: openApiOutput268,
	},
	'transformJob.postByJobIdRunsByRunIdCancel': {
		input: openApiInput269,
		output: openApiOutput269,
	},
	'transformJob.getByJobIdRunsByRunIdTransformRuns': {
		input: openApiInput270,
		output: openApiOutput270,
	},
	'transformJob.getByJobIdTransforms': {
		input: openApiInput271,
		output: openApiOutput271,
	},
	'transformTag.post': { input: openApiInput272, output: openApiOutput272 },
	'transformTag.get': { input: openApiInput273, output: openApiOutput273 },
	'transformTag.putByTagId': {
		input: openApiInput274,
		output: openApiOutput274,
	},
	'transformTag.deleteByTagId': {
		input: openApiInput275,
		output: openApiOutput275,
	},
	'transform.getRun': { input: openApiInput276, output: openApiOutput276 },
	'transform.getRunByRunId': {
		input: openApiInput277,
		output: openApiOutput277,
	},
	'transform.getRuns': { input: openApiInput278, output: openApiOutput278 },
	'transform.getById': { input: openApiInput279, output: openApiOutput279 },
	'transform.putById': { input: openApiInput280, output: openApiOutput280 },
	'transform.deleteById': { input: openApiInput281, output: openApiOutput281 },
	'transform.postByIdCancel': {
		input: openApiInput282,
		output: openApiOutput282,
	},
	'transform.getByIdDagTransforms': {
		input: openApiInput283,
		output: openApiOutput283,
	},
	'transform.getByIdDependencies': {
		input: openApiInput284,
		output: openApiOutput284,
	},
	'transform.postByIdResetCheckpoint': {
		input: openApiInput285,
		output: openApiOutput285,
	},
	'transform.postByIdRun': { input: openApiInput286, output: openApiOutput286 },
	'transform.postByIdRunDag': {
		input: openApiInput287,
		output: openApiOutput287,
	},
	'transform.deleteByIdTable': {
		input: openApiInput288,
		output: openApiOutput288,
	},
	'user.getCurrent': { input: openApiInput289, output: openApiOutput289 },
	'user.postByIdPasswordResetUrl': {
		input: openApiInput290,
		output: openApiOutput290,
	},
} as const;

export type MetabaseOpenApiEndpointInputs = {
	[K in keyof typeof MetabaseOpenApiEndpointSchemas]: z.input<
		(typeof MetabaseOpenApiEndpointSchemas)[K]['input']
	>;
};
export type MetabaseOpenApiEndpointOutputs = {
	[K in keyof typeof MetabaseOpenApiEndpointSchemas]: z.output<
		(typeof MetabaseOpenApiEndpointSchemas)[K]['output']
	>;
};

export const MetabaseOpenApiEndpointMeta = {
	'action.get': {
		riskLevel: 'read',
		description:
			'Returns the actions the current user can read, unarchived unless `?archived=true`.',
	},
	'action.post': { riskLevel: 'write', description: 'Create a new action.' },
	'action.postExecute': {
		riskLevel: 'destructive',
		description: 'Execute the ad-hoc `action`, without saving it.',
	},
	'action.getPublic': {
		riskLevel: 'read',
		description: 'Fetch a list of Actions with public UUIDs.',
	},
	'action.getByActionId': {
		riskLevel: 'read',
		description: 'Fetch an Action.',
	},
	'action.postByActionIdExecuteValues': {
		riskLevel: 'read',
		description: 'Fetches the values for filling in execution parameters.',
	},
	'agent.postV1Collection': {
		riskLevel: 'write',
		description: 'Create a new Collection.',
	},
	'agent.postV1ConstructNativeQuery': {
		riskLevel: 'read',
		description: 'Construct a native (raw SQL) query against a database.',
	},
	'agent.postV1Dashboard': {
		riskLevel: 'write',
		description:
			'Create a new dashboard, optionally populated with saved questions.',
	},
	'agent.putV1DashboardById': {
		riskLevel: 'write',
		description: 'Update a dashboard.',
	},
	'agent.postV1Execute': {
		riskLevel: 'read',
		description: 'Execute an MBQL query and return results.',
	},
	'agent.postV1ExecuteSql': {
		riskLevel: 'destructive',
		description: 'Execute a raw SQL query against a database.',
	},
	'agent.postV1Metric': {
		riskLevel: 'write',
		description: 'Save a previously constructed query as a named metric.',
	},
	'agent.putV1MetricById': {
		riskLevel: 'write',
		description: 'Update a saved metric.',
	},
	'agent.getV1Ping': {
		riskLevel: 'read',
		description: 'Health check endpoint for the Agent API.',
	},
	'agent.postV1Question': {
		riskLevel: 'write',
		description:
			'Save a previously constructed query as a named question (card).',
	},
	'agent.putV1QuestionById': {
		riskLevel: 'write',
		description: 'Update a saved question (card).',
	},
	'agent.postV1QuestionByIdQuery': {
		riskLevel: 'read',
		description: 'Run a saved question (card) and return its results.',
	},
	'agent.postV1ReadResource': {
		riskLevel: 'read',
		description:
			'Read one or more Metabase resources via metabase:// URI patterns.',
	},
	'agent.postV1Search': {
		riskLevel: 'read',
		description:
			'Search for tables, models, metrics, saved questions, dashboards, and collections.',
	},
	'agent.postV2ConstructQuery': {
		riskLevel: 'read',
		description:
			'Construct an MBQL query from a portable MBQL 5 representations JSON payload.',
	},
	'agent.postV2Query': {
		riskLevel: 'read',
		description:
			'Execute a portable MBQL 5 representations JSON query and stream the results, with continuation-token pagination.',
	},
	'analytics.postInternal': {
		riskLevel: 'write',
		description:
			'Receive a batch of internal analytics events from the frontend and record them as Prometheus metrics.',
	},
	'apiKey.putByIdRegenerate': {
		riskLevel: 'destructive',
		description: 'Regenerate an API Key',
	},
	'cache.get': {
		riskLevel: 'read',
		description: 'Return cache configuration.',
	},
	'cache.put': {
		riskLevel: 'write',
		description: 'Store cache configuration.',
	},
	'cache.delete': {
		riskLevel: 'destructive',
		description: 'Delete cache configurations.',
	},
	'cache.postInvalidate': {
		riskLevel: 'write',
		description: 'Invalidate cache entries.',
	},
	'dashboard.postByDashboardIdDashcardByDashcardIdExecuteValues': {
		riskLevel: 'read',
		description: 'Fetches the values for filling in execution parameters.',
	},
	'dashboard.postByIdPdf': {
		riskLevel: 'read',
		description:
			'Render Dashboard with ID to a PDF (server-side, the same way dashboard subscriptions render charts) and stream it back as a file download.',
	},
	'dataStudio.postTableDiscardValues': {
		riskLevel: 'write',
		description: 'Batch version of /table/:id/discard_values.',
	},
	'dataStudio.postTableEdit': {
		riskLevel: 'write',
		description: 'Bulk updating tables.',
	},
	'dataStudio.postTableRescanValues': {
		riskLevel: 'write',
		description: 'Batch version of /table/:id/rescan_values.',
	},
	'dataStudio.postTableSelection': {
		riskLevel: 'read',
		description: 'Gets information about selected tables',
	},
	'dataStudio.postTableSyncSchema': {
		riskLevel: 'write',
		description: 'Batch version of /table/:id/sync_schema.',
	},
	'database.getByIdSchemas': {
		riskLevel: 'read',
		description:
			'Returns a list of all the schemas with tables found for the database `id`.',
	},
	'database.getByIdSettingsAvailable': {
		riskLevel: 'read',
		description:
			'Get all database-local settings and their availability for the given database.',
	},
	'dataset.post': {
		riskLevel: 'read',
		description:
			'Execute a query and retrieve the results in the usual format.',
	},
	'dataset.postPivot': {
		riskLevel: 'read',
		description: 'Generate a pivoted dataset for an ad-hoc query',
	},
	'dataset.postByExportFormat': {
		riskLevel: 'read',
		description:
			'Execute a query and download the result data as a file in the specified format.',
	},
	'document.getPublic': {
		riskLevel: 'read',
		description: 'List all Documents that have public links.',
	},
	'document.postByDocumentIdPublicLink': {
		riskLevel: 'destructive',
		description: 'Generate a publicly-accessible UUID for a Document.',
	},
	'document.postByFromDocumentIdCopy': {
		riskLevel: 'write',
		description: 'Copy a Document.',
	},
	'ee.getAiControlsMcpPermissions': {
		riskLevel: 'read',
		description:
			'List the MCP tool policy of every group, with the tools it can name and the current permission mode.',
	},
	'ee.putAiControlsMcpPermissions': {
		riskLevel: 'destructive',
		description:
			'Set the MCP tool policy of the given groups, in one transaction, and return the policy of every group.',
	},
	'ee.postAiControlsMcpPermissionsAdvanced': {
		riskLevel: 'destructive',
		description: 'Switch to group-level MCP tool access.',
	},
	'ee.deleteAiControlsMcpPermissionsAdvanced': {
		riskLevel: 'destructive',
		description: 'Switch back to All Users only.',
	},
	'ee.getAiControlsPermissions': {
		riskLevel: 'read',
		description:
			'List all metabot permissions for all groups, filling in defaults for missing entries.',
	},
	'ee.putAiControlsPermissions': {
		riskLevel: 'destructive',
		description: 'Update metabot permissions for all groups.',
	},
	'ee.postAiControlsPermissionsAdvanced': {
		riskLevel: 'destructive',
		description: 'Switch to group-level permissions.',
	},
	'ee.deleteAiControlsPermissionsAdvanced': {
		riskLevel: 'destructive',
		description: 'Switch back to simple permissions.',
	},
	'ee.getAiControlsUsageGroup': {
		riskLevel: 'read',
		description: 'Get all group-level metabot usage limits.',
	},
	'ee.getAiControlsUsageGroupByGroupId': {
		riskLevel: 'read',
		description: 'Get the metabot usage limit for a specific group.',
	},
	'ee.putAiControlsUsageGroupByGroupId': {
		riskLevel: 'write',
		description: 'Set or update the metabot usage limit for a specific group.',
	},
	'ee.getAiControlsUsageInstance': {
		riskLevel: 'read',
		description: 'Get the instance-wide metabot usage limit.',
	},
	'ee.putAiControlsUsageInstance': {
		riskLevel: 'write',
		description: 'Set or update the instance-wide metabot usage limit.',
	},
	'ee.getAiControlsUsageTenant': {
		riskLevel: 'read',
		description: 'Get all tenant-level metabot usage limits.',
	},
	'ee.getAiControlsUsageTenantByTenantId': {
		riskLevel: 'read',
		description: 'Get the metabot usage limit for a specific tenant.',
	},
	'ee.putAiControlsUsageTenantByTenantId': {
		riskLevel: 'write',
		description: 'Set or update the metabot usage limit for a specific tenant.',
	},
	'ee.getApps': {
		riskLevel: 'read',
		description: 'List the data apps the user can read.',
	},
	'ee.postAppsGenerateActions': {
		riskLevel: 'read',
		description:
			'The YAML files of the implicit actions a data app defines, one per `defineAction` export in `actions`, in its collection with the entity ID `collection`.',
	},
	'ee.postAppsGenerateQueries': {
		riskLevel: 'read',
		description:
			'The YAML files of the questions a data app defines, one per `defineQuery` export in `queries`, in its collection with the entity ID `collection`.',
	},
	'ee.getAppsGenerateSchema': {
		riskLevel: 'read',
		description:
			"The `src/metabase.schema.ts` file of a data app: the Library's published tables, with their fields, segments and measures, and its metrics.",
	},
	'ee.getAppsRepoStatus': {
		riskLevel: 'read',
		description:
			'Status of the connected repository as it relates to data apps.',
	},
	'ee.getAppsSandboxHost': {
		riskLevel: 'read',
		description:
			"Serve the document used as the `src` of the Near-Membrane realm iframe, carrying a per-document CSP that confines `'unsafe-eval'` to that realm.",
	},
	'ee.putAppsBySlug': {
		riskLevel: 'write',
		description: 'Enable or disable a data app.',
	},
	'ee.getAppsBySlug': {
		riskLevel: 'read',
		description:
			'Fetch metadata for a single data app by its slug, disabled ones to superusers only.',
	},
	'ee.getAppsBySlugBundle': {
		riskLevel: 'read',
		description:
			'Serve the cached JS bundle for a single data app by slug, disabled ones to superusers only.',
	},
	'ee.getAppsBySlugGroupPermissionWarnings': {
		riskLevel: 'read',
		description:
			'Return missing table access for the groups listed for this app.',
	},
	'ee.getAppsBySlugGroups': {
		riskLevel: 'read',
		description:
			"List the groups other than Administrators that can read a data app's resource collection.",
	},
	'ee.postAppsBySlugGroups': {
		riskLevel: 'destructive',
		description:
			"Grant a batch of internal groups read access to a data app's resource collection atomically.",
	},
	'ee.deleteAppsBySlugGroupsByGroupId': {
		riskLevel: 'destructive',
		description: "Revoke a group's access to a data app's resource collection.",
	},
	'ee.postAuditAppAnalyticsDevExport': {
		riskLevel: 'read',
		description:
			'Export analytics content as a .tar.gz file for local development.',
	},
	'ee.deleteCloudAddOnsByProductType': {
		riskLevel: 'destructive',
		description: 'Remove an add-on.',
	},
	'ee.getContentDiagnosticsDuplicated': {
		riskLevel: 'read',
		description:
			'List **duplicated** findings - the latest valid finding per (entity, finding-type) across the duplicated finding types (currently just `duplicate_name`), permission-filtered for the current user.',
	},
	'ee.getContentDiagnosticsImbalanced': {
		riskLevel: 'read',
		description:
			'List **imbalanced** findings - the latest valid finding per (entity, finding-type) across the `empty`/`sparse`/`crowded` checkers, permission-filtered for the current user.',
	},
	'ee.postContentDiagnosticsInvalidate': {
		riskLevel: 'write',
		description: 'Dismiss the findings with `ids`.',
	},
	'ee.getContentDiagnosticsSlow': {
		riskLevel: 'read',
		description:
			'List **slow** findings - the latest valid `slow` finding per entity, permission-filtered for the current user.',
	},
	'ee.getContentDiagnosticsStale': {
		riskLevel: 'read',
		description:
			'List **stale** findings - the latest valid `stale` finding per entity, permission-filtered for the current user.',
	},
	'ee.getContentTranslationDictionary': {
		riskLevel: 'read',
		description:
			'Fetch the content translation dictionary for authenticated users (auth-based embedding flows).',
	},
	'ee.postCustomVizPlugin': {
		riskLevel: 'destructive',
		description:
			'Register a new custom visualization plugin from an uploaded tar.gz bundle.',
	},
	'ee.getCustomVizPlugin': {
		riskLevel: 'read',
		description: 'List all registered custom visualization plugins.',
	},
	'ee.postCustomVizPluginDev': {
		riskLevel: 'destructive',
		description:
			'Register a dev-only custom visualization plugin from a local dev server.',
	},
	'ee.getCustomVizPluginList': {
		riskLevel: 'read',
		description: 'List active and enabled custom visualization plugins.',
	},
	'ee.getCustomVizPluginSandboxHost': {
		riskLevel: 'read',
		description:
			'Serve a minimal HTML document used as the iframe `src` for the near-membrane custom-viz sandbox.',
	},
	'ee.deleteCustomVizPluginById': {
		riskLevel: 'destructive',
		description:
			'Remove a custom visualization plugin and evict its on-disk cache.',
	},
	'ee.putCustomVizPluginById': {
		riskLevel: 'destructive',
		description: 'Update a custom visualization plugin.',
	},
	'ee.getCustomVizPluginByIdAsset': {
		riskLevel: 'read',
		description: "Serve the plugin's icon image from its bundle.",
	},
	'ee.putCustomVizPluginByIdBundle': {
		riskLevel: 'destructive',
		description: 'Replace the bundle for an existing plugin.',
	},
	'ee.getCustomVizPluginByIdBundle': {
		riskLevel: 'read',
		description: 'Serve the JS bundle for a plugin from the on-disk cache.',
	},
	'ee.putCustomVizPluginByIdDevUrl': {
		riskLevel: 'destructive',
		description: 'Set or clear the dev base URL for a plugin (e.g.',
	},
	'ee.postCustomVizPluginByIdRefresh': {
		riskLevel: 'destructive',
		description:
			'Re-fetch the manifest from the dev server for a dev-only plugin.',
	},
	'ee.getDataComplexityScoreComplexity': {
		riskLevel: 'read',
		description:
			'Return the most recently stored Data Complexity Score for this instance.',
	},
	'ee.postDataStudioTablePublishTables': {
		riskLevel: 'destructive',
		description:
			'Set collection for each of selected tables and all upstream dependencies recursively.',
	},
	'ee.postDataStudioTableUnpublishTables': {
		riskLevel: 'destructive',
		description:
			'Unset collection for each of selected tables and all downstream dependents recursively.',
	},
	'ee.getDataStudioTableByIdPublishingInfo': {
		riskLevel: 'read',
		description:
			'Return the latest valid publishing information for a published table, or no content when unavailable.',
	},
	'ee.getDependenciesBackfillStatus': {
		riskLevel: 'read',
		description:
			'Whether no entity awaits the computation of its dependencies, as `complete`, for superusers.',
	},
	'ee.getDependenciesGraph': {
		riskLevel: 'read',
		description:
			'This endpoint takes an :id and a supported entity :type, and returns a graph of all its upstream dependencies.',
	},
	'ee.getDependenciesGraphBreaking': {
		riskLevel: 'read',
		description:
			'Returns a list of entities that are breaking other entities (sources of errors).',
	},
	'ee.getDependenciesGraphBroken': {
		riskLevel: 'read',
		description: 'Returns the broken dependents for a specific source entity.',
	},
	'ee.getDependenciesGraphDependents': {
		riskLevel: 'read',
		description: 'Returns a list of dependents for the specified entity.',
	},
	'ee.getDependenciesGraphUnreferenced': {
		riskLevel: 'read',
		description: 'Returns a list of all unreferenced items in the instance.',
	},
	'ee.getErd': {
		riskLevel: 'read',
		description:
			'Return an Entity Relationship Diagram (ERD) for tables and their FK relationships.',
	},
	'ee.postGsheetsConnection': {
		riskLevel: 'write',
		description:
			"Hook up a new google drive folder or sheet that will be watched and have its content ETL'd into Metabase.",
	},
	'ee.getGsheetsConnection': {
		riskLevel: 'read',
		description: 'Check the status of a connection.',
	},
	'ee.getGsheetsServiceAccount': {
		riskLevel: 'read',
		description:
			"Checks to see if service-account is setup or not, delegates to HM only if we haven't set it from a metabase cluster before.",
	},
	'ee.getLibrary': { riskLevel: 'read', description: 'Get the Library.' },
	'ee.getMetabotAnalyticsConversations': {
		riskLevel: 'read',
		description:
			'Return paginated list of AI conversations with summary statistics.',
	},
	'ee.getMetabotAnalyticsConversationsById': {
		riskLevel: 'read',
		description:
			'Return full details for a specific conversation including all messages.',
	},
	'ee.getMetabotUsage': {
		riskLevel: 'read',
		description:
			'Fetch current Metabot token usage for the current billing period.',
	},
	'ee.getMfaAdminEnrolledUsers': {
		riskLevel: 'read',
		description: 'Admin: users who have a confirmed second factor.',
	},
	'ee.getMfaAdminOverview': {
		riskLevel: 'read',
		description:
			"Admin: enrollment overview — how many users have (and haven't) set up a second factor, and whether the instance encrypts secrets at rest.",
	},
	'ee.getMfaAdminUnenrolledUsers': {
		riskLevel: 'read',
		description: 'Admin: active users who have not set up a second factor.',
	},
	'ee.postMfaEnroll': {
		riskLevel: 'destructive',
		description: 'Start TOTP enrollment for the current user.',
	},
	'ee.postMfaEnrollConfirm': {
		riskLevel: 'destructive',
		description:
			'Confirm TOTP enrollment by verifying a code from the authenticator app.',
	},
	'ee.postMfaRecoveryCodes': {
		riskLevel: 'destructive',
		description:
			"Regenerate the current user's recovery codes, invalidating the entire previous set.",
	},
	'ee.getMfaStatus': {
		riskLevel: 'read',
		description: "The current user's MFA status, for the account-settings UI.",
	},
	'ee.getPermissionDebug': {
		riskLevel: 'read',
		description:
			'This endpoint expects a `user_id`, a `model_id` to debug permissions against, and `action_type`.',
	},
	'ee.getRemoteSyncBranches': {
		riskLevel: 'read',
		description: 'Get list of branches from the configured source.',
	},
	'ee.postRemoteSyncCreateBranch': {
		riskLevel: 'destructive',
		description:
			'Create a new branch from the current remote-sync branch and switches the current remote-sync branch to it.',
	},
	'ee.getRemoteSyncCurrentTask': {
		riskLevel: 'read',
		description: 'Get the current sync task',
	},
	'ee.postRemoteSyncCurrentTaskCancel': {
		riskLevel: 'destructive',
		description: 'Cancels the current task if one is running',
	},
	'ee.getRemoteSyncDirty': {
		riskLevel: 'read',
		description:
			'Return all models with changes that have not been pushed to the remote sync source in any remote-synced collection.',
	},
	'ee.postRemoteSyncExport': {
		riskLevel: 'destructive',
		description:
			'Export the current state of the Remote Sync collection to a Source.',
	},
	'ee.getRemoteSyncExportPreflight': {
		riskLevel: 'read',
		description:
			'Dry-run preview of what pushing the current state would do given the live remote branch, without writing anything.',
	},
	'ee.getRemoteSyncHasRemoteChanges': {
		riskLevel: 'read',
		description:
			'Check if there are new changes on the remote branch that can be pulled.',
	},
	'ee.postRemoteSyncImport': {
		riskLevel: 'destructive',
		description: 'Import Metabase content from configured Remote Sync source.',
	},
	'ee.getRemoteSyncIsDirty': {
		riskLevel: 'read',
		description:
			'Check if any remote-synced collection or collection item has local changes that have not been pushed to the remote sync source.',
	},
	'ee.putRemoteSyncSettings': {
		riskLevel: 'write',
		description: 'Update Remote Sync related settings.',
	},
	'ee.postRemoteSyncStash': {
		riskLevel: 'destructive',
		description:
			'Stashes changes to a new branch, and changes the current branch to it.',
	},
	'ee.postRemoteSyncTestConnection': {
		riskLevel: 'read',
		description:
			'Test whether the Remote Sync credentials can reach the git repository.',
	},
	'ee.postReplacementCheckReplaceSource': {
		riskLevel: 'read',
		description:
			'Check whether a source entity can be replaced by a target entity.',
	},
	'ee.postReplacementReplaceModelWithTransform': {
		riskLevel: 'destructive',
		description:
			'Create a transform from a model, execute it, and replace all usages of the model with the output table.',
	},
	'ee.postReplacementReplaceSource': {
		riskLevel: 'destructive',
		description:
			'Replace all usages of a source entity with a target entity asynchronously.',
	},
	'ee.getReplacementRuns': {
		riskLevel: 'read',
		description: 'List replacement runs, optionally filtered by is-active.',
	},
	'ee.getReplacementRunsById': {
		riskLevel: 'read',
		description: 'Get the status of a source replacement run.',
	},
	'ee.postReplacementRunsByIdCancel': {
		riskLevel: 'destructive',
		description: 'Cancel a running source replacement.',
	},
	'ee.getSecurityCenter': {
		riskLevel: 'read',
		description: 'List all security advisories with match status.',
	},
	'ee.postSecurityCenterAcknowledge': {
		riskLevel: 'write',
		description: 'Acknowledge multiple security advisories.',
	},
	'ee.postSecurityCenterSync': {
		riskLevel: 'write',
		description: 'Trigger an async advisory sync + re-evaluation.',
	},
	'ee.postSecurityCenterTestNotification': {
		riskLevel: 'destructive',
		description:
			'Send a test notification through the given Security Center channels.',
	},
	'ee.postSecurityCenterByAdvisoryIdAcknowledge': {
		riskLevel: 'write',
		description: 'Acknowledge a security advisory.',
	},
	'ee.getSessionManagement': {
		riskLevel: 'read',
		description: 'List sessions.',
	},
	'ee.postSessionManagementRevoke': {
		riskLevel: 'destructive',
		description:
			'Revoke — end — every live session matching the given criteria, which are the filters the list endpoint takes.',
	},
	'ee.postSupportAccessGrant': {
		riskLevel: 'destructive',
		description: 'Create a new support access grant.',
	},
	'ee.getSupportAccessGrant': {
		riskLevel: 'read',
		description:
			'List support access grants with optional filtering and pagination.',
	},
	'ee.getSupportAccessGrantCurrent': {
		riskLevel: 'read',
		description:
			'Get the currently active support access grant, if one exists.',
	},
	'ee.putSupportAccessGrantByIdRevoke': {
		riskLevel: 'destructive',
		description: 'Revoke an existing support access grant.',
	},
	'ee.postTenant': { riskLevel: 'write', description: 'Create a new Tenant' },
	'ee.getTenant': { riskLevel: 'read', description: 'Get all tenants' },
	'ee.putTenantById': {
		riskLevel: 'destructive',
		description:
			'Update a tenant, can set name, attributes, or whether this tenant is active.',
	},
	'ee.getTenantById': {
		riskLevel: 'read',
		description: 'Get info about a tenant',
	},
	'ee.getTransformTest': {
		riskLevel: 'read',
		description:
			'List the transform tests with their newest runs, optionally only those of one transform.',
	},
	'ee.postTransformTest': {
		riskLevel: 'write',
		description: 'Create a transform test.',
	},
	'ee.getTransformTestById': {
		riskLevel: 'read',
		description: 'Get a transform test with its newest run.',
	},
	'ee.putTransformTestById': {
		riskLevel: 'write',
		description: 'Update a transform test.',
	},
	'ee.deleteTransformTestById': {
		riskLevel: 'destructive',
		description: 'Delete a transform test.',
	},
	'ee.getTransformTestByIdRun': {
		riskLevel: 'read',
		description: 'List the runs of a transform test, newest first.',
	},
	'ee.postTransformTestByIdRun': {
		riskLevel: 'destructive',
		description: 'Run a transform test, which reading it is enough to do.',
	},
	'ee.postTransformsPythonTestRun': {
		riskLevel: 'destructive',
		description:
			'Evaluate an ad-hoc python transform on a sample of input data.',
	},
	'ee.getTransformsByIdInspect': {
		riskLevel: 'read',
		description: 'Phase 1: Discover available lenses for a transform.',
	},
	'ee.getTransformsByIdInspectByLensId': {
		riskLevel: 'read',
		description: 'Phase 2: Get full lens contents for a transform.',
	},
	'ee.postTransformsByIdInspectByLensIdQuery': {
		riskLevel: 'read',
		description:
			'Execute a query in the context of a transform inspector lens.',
	},
	'embedMcp.getBootstrap': {
		riskLevel: 'read',
		description:
			'Everything the MCP Apps iframe needs to mount, so its UI credential never authenticates a general REST endpoint.',
	},
	'embedMcp.postFeedback': {
		riskLevel: 'write',
		description: 'Persist MCP Apps visualization feedback.',
	},
	'embedMcp.getQueriesByHandle': {
		riskLevel: 'read',
		description:
			'Resolve a query handle to the base64-encoded MBQL the iframe should render.',
	},
	'embedTheme.get': {
		riskLevel: 'read',
		description: 'Fetch a list of all embedding themes.',
	},
	'embedTheme.post': {
		riskLevel: 'write',
		description: 'Create a new embedding theme.',
	},
	'embedTheme.postSeedDefaults': {
		riskLevel: 'write',
		description:
			'Seed default embedding themes on first call, using the payloads built by the frontend from the `METABASE_LIGHT_THEME` / `METABASE_DARK_THEME` constants.',
	},
	'embedTheme.getById': {
		riskLevel: 'read',
		description: 'Fetch a single embedding theme by ID.',
	},
	'embedTheme.putById': {
		riskLevel: 'write',
		description: 'Update an embedding theme.',
	},
	'embedTheme.deleteById': {
		riskLevel: 'destructive',
		description: 'Delete an embedding theme.',
	},
	'embedTheme.postByIdCopy': {
		riskLevel: 'write',
		description: 'Copy an embedding theme.',
	},
	'embeddingHub.getChecklist': {
		riskLevel: 'read',
		description:
			'Get the setup guide checklist status, indicating which setup steps have been completed.',
	},
	'embeddingSdk.getReact18Hosts': {
		riskLevel: 'read',
		description:
			'The host apps that used the React embedding SDK with React 18 in the last 4 days, newest first, at most 50.',
	},
	'evalTrace.getBySessionId': {
		riskLevel: 'read',
		description:
			'Return the captured eval trace as JSONL (one span per line) for `session-id`.',
	},
	'exploration.post': {
		riskLevel: 'write',
		description: 'Metabase POST /api/exploration',
	},
	'exploration.getDimensions': {
		riskLevel: 'read',
		description:
			'Hydrated metrics plus a deduplicated dimension list, for the Exploration data modal.',
	},
	'exploration.getMine': {
		riskLevel: 'read',
		description:
			'Explorations the current user created or edited, most-recently-touched first, paginated.',
	},
	'exploration.putPageByIdStarred': {
		riskLevel: 'write',
		description: 'Set whether an exploration page is starred.',
	},
	'exploration.putPagesHidden': {
		riskLevel: 'write',
		description:
			'Set whether one or more exploration pages are hidden from the sidebar.',
	},
	'exploration.getQueryById': {
		riskLevel: 'read',
		description: 'Stream the result of a single completed exploration query.',
	},
	'exploration.postThreadByThreadIdCancel': {
		riskLevel: 'destructive',
		description: 'Cancel an in-flight exploration thread.',
	},
	'exploration.postThreadByThreadIdRestart': {
		riskLevel: 'destructive',
		description:
			"Re-run one exploration thread in place, keeping its selections: drops the thread's materialized queries and clears the terminal-state gates so the background planner re-claims it.",
	},
	'exploration.getById': {
		riskLevel: 'read',
		description:
			'Fetch an exploration with its thread, selections, and generated queries.',
	},
	'exploration.putById': {
		riskLevel: 'write',
		description:
			"Update an exploration's metadata, archive state, or move it to a different collection.",
	},
	'exploration.deleteById': {
		riskLevel: 'destructive',
		description: 'Hard-delete an exploration.',
	},
	'exploration.postByIdExploreFurther': {
		riskLevel: 'destructive',
		description:
			'Start a follow-up investigation scoped to a clicked chart segment.',
	},
	'exploration.postByIdSummaryAppend': {
		riskLevel: 'write',
		description:
			"Append a static `cardEmbed` representing a *composite chart* — built from one or more `ExplorationQuery` snapshots combined into a single qp-result — to the exploration's Summary document.",
	},
	'field.postTableIds': {
		riskLevel: 'read',
		description: 'Get unique Table IDs for a list of Field IDs.',
	},
	'healthInspector.get': {
		riskLevel: 'read',
		description: 'Get a list of recent health check runs.',
	},
	'index.get': {
		riskLevel: 'read',
		description:
			"A transform's indexes: those physically in the warehouse, merged with its managed requests.",
	},
	'index.postRequest': {
		riskLevel: 'write',
		description: "Create an index request on a transform's target table.",
	},
	'index.getRequestById': {
		riskLevel: 'read',
		description: 'Fetch a single index request (e.g.',
	},
	'index.putRequestById': {
		riskLevel: 'write',
		description:
			'Replace the structured definition of an index request, marking it update-pending.',
	},
	'llm.postExtractSources': {
		riskLevel: 'read',
		description:
			'Parse native query sources and return referenced tables and cards/models.',
	},
	'llm.getModels': {
		riskLevel: 'read',
		description:
			'List the models available from every configured connection, grouped by connection.',
	},
	'llm.getProviderTypes': {
		riskLevel: 'read',
		description:
			'List the provider types a connection can be created for, with the credential fields each one needs.',
	},
	'llm.getProviders': {
		riskLevel: 'read',
		description:
			'List the configured provider connections, with their secrets masked.',
	},
	'llm.postProviders': {
		riskLevel: 'write',
		description: 'Create a provider connection.',
	},
	'llm.putProvidersByKey': {
		riskLevel: 'write',
		description: 'Update a provider connection.',
	},
	'llm.deleteProvidersByKey': {
		riskLevel: 'destructive',
		description: 'Delete a provider connection.',
	},
	'logger.getPresets': {
		riskLevel: 'read',
		description: 'Get all known presets.',
	},
	'measure.post': {
		riskLevel: 'write',
		description: 'Create a new `Measure`.',
	},
	'measure.get': { riskLevel: 'read', description: 'Fetch *all* `Measures`.' },
	'measure.getById': {
		riskLevel: 'read',
		description: 'Fetch `Measure` with ID.',
	},
	'measure.putById': {
		riskLevel: 'write',
		description: 'Update a `Measure` with ID.',
	},
	'measure.getByIdDimensionByDimensionKeyRemapping': {
		riskLevel: 'read',
		description: 'Fetch remapped value for a specific dimension value.',
	},
	'measure.getByIdDimensionByDimensionKeySearch': {
		riskLevel: 'read',
		description:
			'Search for values of a dimension that contain the query string.',
	},
	'measure.getByIdDimensionByDimensionKeyValues': {
		riskLevel: 'read',
		description: 'Fetch values for a dimension of a measure.',
	},
	'metabot.getConversations': {
		riskLevel: 'read',
		description:
			"List conversations visible in the current user's history, most-recent first.",
	},
	'metabot.getConversationsById': {
		riskLevel: 'read',
		description:
			'Return a single conversation with its flattened chat messages.',
	},
	'metabot.postConversationsByIdFork': {
		riskLevel: 'write',
		description:
			'Fork a conversation at an assistant message, returning a brand-new conversation that copies the thread from the start up to and including that message.',
	},
	'metabot.postConversationsByIdSavedEntity': {
		riskLevel: 'write',
		description:
			"Save a Metabot-generated chart from this conversation as a card, stamping the card's origin columns in the same request — used by the inline chart's manual Save button, which runs outside any agent turn.",
	},
	'metabot.getConversationsByIdTitle': {
		riskLevel: 'read',
		description: 'Return the title generation status for a conversation.',
	},
	'metabot.postDocumentGenerateContent': {
		riskLevel: 'destructive',
		description: 'Create a new piece of content to insert into the document.',
	},
	'metabot.postFeedback': {
		riskLevel: 'write',
		description: 'Persist Metabot feedback.',
	},
	'metabot.postMetabotByIdPromptSuggestionsRegenerate': {
		riskLevel: 'destructive',
		description:
			'Remove any existing prompt suggestions for the Metabot with `id` and generate new ones.',
	},
	'metabot.getPermissionsUserPermissions': {
		riskLevel: 'read',
		description:
			"Return the current user's resolved metabot permissions, taking the most permissive value across all their groups.",
	},
	'metabot.putSlackSettings': {
		riskLevel: 'write',
		description: 'Update Metabot Slack settings atomically.',
	},
	'metabot.postSourceFeedback': {
		riskLevel: 'write',
		description: 'Persist Metabot source feedback.',
	},
	'metric.get': { riskLevel: 'read', description: 'Get a list of metrics.' },
	'metric.postBreakoutValues': {
		riskLevel: 'read',
		description:
			'Fetch distinct breakout dimension values for a metric or measure definition.',
	},
	'metric.postDataset': {
		riskLevel: 'read',
		description:
			'Execute a metric or measure-based query and stream the results.',
	},
	'metric.getById': {
		riskLevel: 'read',
		description: 'Fetch a `Metric` with ID.',
	},
	'metric.getByIdDimension': {
		riskLevel: 'read',
		description:
			"List a metric's curated dimensions, and (when `with-addable=true`) the columns still available to add, grouped by source table.",
	},
	'metric.postByIdDimensionAdd': {
		riskLevel: 'write',
		description: 'Add dimensions to a metric.',
	},
	'metric.postByIdDimensionRemove': {
		riskLevel: 'write',
		description: 'Remove dimensions (by UUID) from a metric.',
	},
	'metric.postByIdDimensionReorder': {
		riskLevel: 'write',
		description: "Persist a new ordering for a metric's dimensions.",
	},
	'metric.postByIdDimensionSetDefault': {
		riskLevel: 'write',
		description:
			"Mark exactly one dimension as the metric's default, clearing any previous default.",
	},
	'metric.postByIdDimensionByDimensionKey': {
		riskLevel: 'write',
		description:
			"Update a metric dimension's `display_name`, `description`, `default_temporal_unit`, and/or source column.",
	},
	'metric.getByIdDimensionByDimensionKeyRemapping': {
		riskLevel: 'read',
		description: 'Fetch remapped value for a specific dimension value.',
	},
	'metric.getByIdDimensionByDimensionKeySearch': {
		riskLevel: 'read',
		description:
			'Search for values of a dimension that contain the query string.',
	},
	'metric.getByIdDimensionByDimensionKeyValues': {
		riskLevel: 'read',
		description: 'Fetch values for a dimension of a metric.',
	},
	'notification.post': {
		riskLevel: 'write',
		description: 'Create a new notification, return the created notification.',
	},
	'notification.getAdmin': {
		riskLevel: 'read',
		description: 'List card-type notifications (alerts) for admin management.',
	},
	'notification.postAdminBulk': {
		riskLevel: 'write',
		description: 'Bulk-archive or -change-creator a set of notifications.',
	},
	'notification.getAdminById': {
		riskLevel: 'read',
		description:
			'Get a single card-type notification with last_check, last_send, check_history (up to 10 most-recent terminal alert-type TaskRuns) and send_history (up to 10 most-recent channel-send delivery attempts).',
	},
	'oauth.getAuthorizations': {
		riskLevel: 'read',
		description:
			'List OAuth dynamic client registration events (registered, approved, or denied), newest first.',
	},
	'osi.getAiContext': {
		riskLevel: 'read',
		description: 'Get all ai_context entries, paginated.',
	},
	'osi.postAiContextReconcile': {
		riskLevel: 'write',
		description:
			'Force a reconcile of the library entity index against the application database, blocking until a reconcile covering this call finishes.',
	},
	'osi.getAiContextByEntityTypeByEntityLocalId': {
		riskLevel: 'read',
		description:
			'Get the ai_context entry for an entity by its logical `(entity_type, entity_local_id)` key.',
	},
	'osi.putAiContextByEntityTypeByEntityLocalId': {
		riskLevel: 'write',
		description:
			'Create or replace (upsert) the ai_context for an entity, addressed by its logical key.',
	},
	'permissions.getInviteGroupIds': {
		riskLevel: 'read',
		description:
			'IDs of the permission groups holding a stored read (or read-write) grant on the collection of a shareable item (a `dashboard` or a `question`).',
	},
	'previewEmbed.getCardByTokenParamsByParamKeyValues': {
		riskLevel: 'read',
		description: 'Embedded version of api.card filter values endpoint.',
	},
	'public.postDashboardByUuidDashcardByDashcardIdExecuteValues': {
		riskLevel: 'read',
		description: 'Fetches the values for filling in execution parameters.',
	},
	'session.getIllustrationByKey': {
		riskLevel: 'read',
		description:
			'Fetch the uploaded image of a custom illustration setting, e.g.',
	},
	'session.postMfaEnroll': {
		riskLevel: 'destructive',
		description:
			'Complete a two-step login by *enrolling* a second factor for the first time.',
	},
	'session.postMfaSendEmailOtp': {
		riskLevel: 'destructive',
		description:
			'Email a one-time code as a fallback second factor (for a user who lost their authenticator but still has recovery codes disabled or unavailable).',
	},
	'slack.getAppInfo': {
		riskLevel: 'read',
		description: 'Returns the Slack app_id and team_id.',
	},
	'slack.getManifest': {
		riskLevel: 'read',
		description:
			'Returns the JSON manifest file that should be used to bootstrap new Slack apps',
	},
	'table.putByIdFieldsOrder': {
		riskLevel: 'write',
		description: 'Reorder fields',
	},
	'task.getRuns': {
		riskLevel: 'read',
		description: 'List task runs with optional filters.',
	},
	'task.getRunsEntities': {
		riskLevel: 'read',
		description:
			'Get distinct entities that have task runs for a given run type.',
	},
	'task.getRunsById': {
		riskLevel: 'read',
		description: 'Get a single task run with all its child tasks.',
	},
	'timeline.post': {
		riskLevel: 'write',
		description: 'Create a new [[Timeline]].',
	},
	'timeline.get': {
		riskLevel: 'read',
		description: 'Fetch a list of `Timeline`s.',
	},
	'timeline.getById': {
		riskLevel: 'read',
		description: 'Fetch the `Timeline` with `id`.',
	},
	'transform.get': {
		riskLevel: 'read',
		description: 'Get a list of transforms.',
	},
	'transform.post': {
		riskLevel: 'write',
		description: 'Create a new transform.',
	},
	'transformDagRun.postByRunIdCancel': {
		riskLevel: 'destructive',
		description:
			'Cancel an in-progress manual DAG run and request cancellation of its still-running transforms.',
	},
	'transformDagRun.getByRunIdTransformRuns': {
		riskLevel: 'read',
		description: 'Get the transform runs that made up a specific DAG run.',
	},
	'transformJob.post': {
		riskLevel: 'write',
		description: 'Create a new transform job.',
	},
	'transformJob.get': {
		riskLevel: 'read',
		description: 'Get all transform jobs.',
	},
	'transformJob.putActive': {
		riskLevel: 'write',
		description: 'Activate or deactivate every transform job.',
	},
	'transformJob.putByJobId': {
		riskLevel: 'write',
		description: 'Update a transform job.',
	},
	'transformJob.getByJobId': {
		riskLevel: 'read',
		description: 'Get a transform job by ID.',
	},
	'transformJob.postByJobIdRun': {
		riskLevel: 'destructive',
		description: 'Run a transform job manually.',
	},
	'transformJob.getByJobIdRuns': {
		riskLevel: 'read',
		description: 'Get paginated run history for a transform job.',
	},
	'transformJob.postByJobIdRunsByRunIdCancel': {
		riskLevel: 'destructive',
		description:
			'Cancel an in-progress job run and request cancellation of its still-running transforms.',
	},
	'transformJob.getByJobIdRunsByRunIdTransformRuns': {
		riskLevel: 'read',
		description: 'Get the transform runs that made up a specific job run.',
	},
	'transformJob.getByJobIdTransforms': {
		riskLevel: 'read',
		description: "Get the transforms of job specified by the job's ID.",
	},
	'transformTag.post': {
		riskLevel: 'write',
		description: 'Create a new transform tag.',
	},
	'transformTag.get': {
		riskLevel: 'read',
		description: 'Get a list of all transform tags.',
	},
	'transformTag.putByTagId': {
		riskLevel: 'write',
		description: 'Update a transform tag.',
	},
	'transformTag.deleteByTagId': {
		riskLevel: 'destructive',
		description: 'Delete a transform tag.',
	},
	'transform.getRun': {
		riskLevel: 'read',
		description: 'Get transform runs based on a set of filter params.',
	},
	'transform.getRunByRunId': {
		riskLevel: 'read',
		description: 'Get a transform run by ID.',
	},
	'transform.getRuns': {
		riskLevel: 'read',
		description:
			'Paginated unified run history: every row is a root run — a job run, a manual DAG-reprocess run, or a standalone transform run — never a member run of a job/DAG (those are listed by `GET /run` and the per-run `transform-runs` endpoints).',
	},
	'transform.getById': {
		riskLevel: 'read',
		description: 'Get a specific transform.',
	},
	'transform.putById': {
		riskLevel: 'write',
		description: 'Update a transform.',
	},
	'transform.deleteById': {
		riskLevel: 'destructive',
		description: 'Delete a transform.',
	},
	'transform.postByIdCancel': {
		riskLevel: 'destructive',
		description: 'Cancel the current run for a given transform.',
	},
	'transform.getByIdDagTransforms': {
		riskLevel: 'read',
		description:
			'Preview the transforms a DAG reprocess from this transform would run (see `POST /:id/run-dag`), in execution order.',
	},
	'transform.getByIdDependencies': {
		riskLevel: 'read',
		description: 'Get the dependencies of a specific transform.',
	},
	'transform.postByIdResetCheckpoint': {
		riskLevel: 'destructive',
		description: 'Reset the stored checkpoint for an incremental transform.',
	},
	'transform.postByIdRun': {
		riskLevel: 'destructive',
		description: 'Run a transform.',
	},
	'transform.postByIdRunDag': {
		riskLevel: 'destructive',
		description:
			'Trigger a DAG-reprocess run starting from a single transform: runs the transform and every transform in its transitive dependency closure.',
	},
	'transform.deleteByIdTable': {
		riskLevel: 'destructive',
		description: "Delete a transform's output table.",
	},
	'user.getCurrent': {
		riskLevel: 'read',
		description: 'Fetch the current `User`.',
	},
	'user.postByIdPasswordResetUrl': {
		riskLevel: 'destructive',
		description: 'Generate a password reset URL for a user.',
	},
} as const;

const JsonValueSchema = z.json();
export const MetabaseOpenApiTestCases: MetabaseOpenApiTestCase[] = [
	{
		shortPath: 'action.get',
		operationId: 'get-api-action',
		method: 'GET',
		path: '/api/action',
		input: { query: {} },
		output: [],
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput0.safeParse(value).success,
		isOutputValid: (value) => openApiOutput0.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint0(ctx, openApiInput0.parse(input)),
			),
	},
	{
		shortPath: 'action.post',
		operationId: 'post-api-action',
		method: 'POST',
		path: '/api/action',
		input: { body: { name: '', type: 'implicit' } },
		output: { id: 1 },
		expectedOptions: { method: 'POST', body: { name: '', type: 'implicit' } },
		multipart: false,
		isInputValid: (value) => openApiInput1.safeParse(value).success,
		isOutputValid: (value) => openApiOutput1.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint1(ctx, openApiInput1.parse(input)),
			),
	},
	{
		shortPath: 'action.postExecute',
		operationId: 'post-api-action-execute',
		method: 'POST',
		path: '/api/action/execute',
		input: { body: { action: { name: '', type: 'implicit' } } },
		output: {},
		expectedOptions: {
			method: 'POST',
			body: { action: { name: '', type: 'implicit' } },
		},
		multipart: false,
		isInputValid: (value) => openApiInput2.safeParse(value).success,
		isOutputValid: (value) => openApiOutput2.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint2(ctx, openApiInput2.parse(input)),
			),
	},
	{
		shortPath: 'action.getPublic',
		operationId: 'get-api-action-public',
		method: 'GET',
		path: '/api/action/public',
		input: {},
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput3.safeParse(value).success,
		isOutputValid: (value) => openApiOutput3.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint3(ctx, openApiInput3.parse(input)),
			),
	},
	{
		shortPath: 'action.getByActionId',
		operationId: 'get-api-action-action-id',
		method: 'GET',
		path: '/api/action/1',
		input: { path: { 'action-id': 1 } },
		output: { id: 1 },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput4.safeParse(value).success,
		isOutputValid: (value) => openApiOutput4.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint4(ctx, openApiInput4.parse(input)),
			),
	},
	{
		shortPath: 'action.postByActionIdExecuteValues',
		operationId: 'post-api-action-action-id-execute-values',
		method: 'POST',
		path: '/api/action/1/execute/values',
		input: { path: { 'action-id': 1 }, body: { parameters: {} } },
		output: {},
		expectedOptions: { method: 'POST', body: { parameters: {} } },
		multipart: false,
		isInputValid: (value) => openApiInput5.safeParse(value).success,
		isOutputValid: (value) => openApiOutput5.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint5(ctx, openApiInput5.parse(input)),
			),
	},
	{
		shortPath: 'agent.postV1Collection',
		operationId: 'post-api-agent-v1-collection',
		method: 'POST',
		path: '/api/agent/v1/collection',
		input: { body: { name: 'a' } },
		output: { id: 1, name: 'a', parent_id: 1, location: 'a', description: '' },
		expectedOptions: { method: 'POST', body: { name: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput6.safeParse(value).success,
		isOutputValid: (value) => openApiOutput6.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint6(ctx, openApiInput6.parse(input)),
			),
	},
	{
		shortPath: 'agent.postV1ConstructNativeQuery',
		operationId: 'post-api-agent-v1-construct-native-query',
		method: 'POST',
		path: '/api/agent/v1/construct-native-query',
		input: { body: { database_id: 1, sql: 'a' } },
		output: { query: 'a' },
		expectedOptions: {
			method: 'POST',
			body: { database_id: 1, sql: 'a' },
			requestTimeoutMs: 120000,
		},
		multipart: false,
		isInputValid: (value) => openApiInput7.safeParse(value).success,
		isOutputValid: (value) => openApiOutput7.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint7(ctx, openApiInput7.parse(input)),
			),
	},
	{
		shortPath: 'agent.postV1Dashboard',
		operationId: 'post-api-agent-v1-dashboard',
		method: 'POST',
		path: '/api/agent/v1/dashboard',
		input: { body: { name: 'a' } },
		output: {
			id: 1,
			name: 'a',
			url: '',
			collection_id: 1,
			collection_path: '',
			description: '',
			dashcard_ids: [],
			tabs: [],
		},
		expectedOptions: { method: 'POST', body: { name: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput8.safeParse(value).success,
		isOutputValid: (value) => openApiOutput8.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint8(ctx, openApiInput8.parse(input)),
			),
	},
	{
		shortPath: 'agent.putV1DashboardById',
		operationId: 'put-api-agent-v1-dashboard-id',
		method: 'PUT',
		path: '/api/agent/v1/dashboard/1',
		input: { path: { id: 1 }, body: {} },
		output: {
			id: 1,
			name: 'a',
			collection_id: 1,
			collection_path: '',
			description: '',
			archived: false,
			dashcard_ids: [],
			tabs: [],
		},
		expectedOptions: { method: 'PUT', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput9.safeParse(value).success,
		isOutputValid: (value) => openApiOutput9.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint9(ctx, openApiInput9.parse(input)),
			),
	},
	{
		shortPath: 'agent.postV1Execute',
		operationId: 'post-api-agent-v1-execute',
		method: 'POST',
		path: '/api/agent/v1/execute',
		input: { body: { query: 'a' } },
		output: { status: 'completed' },
		expectedOptions: { method: 'POST', body: { query: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput10.safeParse(value).success,
		isOutputValid: (value) => openApiOutput10.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint10(ctx, openApiInput10.parse(input)),
			),
	},
	{
		shortPath: 'agent.postV1ExecuteSql',
		operationId: 'post-api-agent-v1-execute-sql',
		method: 'POST',
		path: '/api/agent/v1/execute-sql',
		input: { body: { database_id: 1, sql: 'a' } },
		output: { status: 'completed' },
		expectedOptions: {
			method: 'POST',
			body: { database_id: 1, sql: 'a' },
			requestTimeoutMs: 120000,
		},
		multipart: false,
		isInputValid: (value) => openApiInput11.safeParse(value).success,
		isOutputValid: (value) => openApiOutput11.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint11(ctx, openApiInput11.parse(input)),
			),
	},
	{
		shortPath: 'agent.postV1Metric',
		operationId: 'post-api-agent-v1-metric',
		method: 'POST',
		path: '/api/agent/v1/metric',
		input: { body: { name: 'a', query: 'a' } },
		output: {
			id: 1,
			name: 'a',
			url: '',
			display: '',
			collection_id: 1,
			collection_path: '',
			description: '',
		},
		expectedOptions: { method: 'POST', body: { name: 'a', query: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput12.safeParse(value).success,
		isOutputValid: (value) => openApiOutput12.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint12(ctx, openApiInput12.parse(input)),
			),
	},
	{
		shortPath: 'agent.putV1MetricById',
		operationId: 'put-api-agent-v1-metric-id',
		method: 'PUT',
		path: '/api/agent/v1/metric/1',
		input: { path: { id: 1 }, body: {} },
		output: {
			id: 1,
			name: 'a',
			display: '',
			collection_id: 1,
			collection_path: '',
			description: '',
			archived: false,
		},
		expectedOptions: { method: 'PUT', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput13.safeParse(value).success,
		isOutputValid: (value) => openApiOutput13.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint13(ctx, openApiInput13.parse(input)),
			),
	},
	{
		shortPath: 'agent.getV1Ping',
		operationId: 'get-api-agent-v1-ping',
		method: 'GET',
		path: '/api/agent/v1/ping',
		input: {},
		output: { message: '' },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput14.safeParse(value).success,
		isOutputValid: (value) => openApiOutput14.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint14(ctx, openApiInput14.parse(input)),
			),
	},
	{
		shortPath: 'agent.postV1Question',
		operationId: 'post-api-agent-v1-question',
		method: 'POST',
		path: '/api/agent/v1/question',
		input: { body: { name: 'a', query: 'a' } },
		output: {
			id: 1,
			name: 'a',
			url: '',
			display: '',
			collection_id: 1,
			collection_path: '',
			description: '',
		},
		expectedOptions: { method: 'POST', body: { name: 'a', query: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput15.safeParse(value).success,
		isOutputValid: (value) => openApiOutput15.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint15(ctx, openApiInput15.parse(input)),
			),
	},
	{
		shortPath: 'agent.putV1QuestionById',
		operationId: 'put-api-agent-v1-question-id',
		method: 'PUT',
		path: '/api/agent/v1/question/1',
		input: { path: { id: 1 }, body: {} },
		output: {
			id: 1,
			name: 'a',
			display: '',
			collection_id: 1,
			collection_path: '',
			description: '',
			archived: false,
		},
		expectedOptions: { method: 'PUT', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput16.safeParse(value).success,
		isOutputValid: (value) => openApiOutput16.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint16(ctx, openApiInput16.parse(input)),
			),
	},
	{
		shortPath: 'agent.postV1QuestionByIdQuery',
		operationId: 'post-api-agent-v1-question-id-query',
		method: 'POST',
		path: '/api/agent/v1/question/1/query',
		input: { path: { id: 1 }, body: {} },
		output: { status: 'completed' },
		expectedOptions: { method: 'POST', body: {}, requestTimeoutMs: 120000 },
		multipart: false,
		isInputValid: (value) => openApiInput17.safeParse(value).success,
		isOutputValid: (value) => openApiOutput17.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint17(ctx, openApiInput17.parse(input)),
			),
	},
	{
		shortPath: 'agent.postV1ReadResource',
		operationId: 'post-api-agent-v1-read-resource',
		method: 'POST',
		path: '/api/agent/v1/read-resource',
		input: { body: { uris: [] } },
		output: { resources: [], output: '' },
		expectedOptions: { method: 'POST', body: { uris: [] } },
		multipart: false,
		isInputValid: (value) => openApiInput18.safeParse(value).success,
		isOutputValid: (value) => openApiOutput18.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint18(ctx, openApiInput18.parse(input)),
			),
	},
	{
		shortPath: 'agent.postV1Search',
		operationId: 'post-api-agent-v1-search',
		method: 'POST',
		path: '/api/agent/v1/search',
		input: { body: {} },
		output: { data: [], total_count: 1 },
		expectedOptions: { method: 'POST', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput19.safeParse(value).success,
		isOutputValid: (value) => openApiOutput19.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint19(ctx, openApiInput19.parse(input)),
			),
	},
	{
		shortPath: 'agent.postV2ConstructQuery',
		operationId: 'post-api-agent-v2-construct-query',
		method: 'POST',
		path: '/api/agent/v2/construct-query',
		input: { body: { query: {} } },
		output: { query: 'a' },
		expectedOptions: {
			method: 'POST',
			body: { query: {} },
			requestTimeoutMs: 120000,
		},
		multipart: false,
		isInputValid: (value) => openApiInput20.safeParse(value).success,
		isOutputValid: (value) => openApiOutput20.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint20(ctx, openApiInput20.parse(input)),
			),
	},
	{
		shortPath: 'agent.postV2Query',
		operationId: 'post-api-agent-v2-query',
		method: 'POST',
		path: '/api/agent/v2/query',
		input: { body: { continuation_token: 'a' } },
		output: { status: 'completed' },
		expectedOptions: {
			method: 'POST',
			body: { continuation_token: 'a' },
			requestTimeoutMs: 120000,
		},
		multipart: false,
		isInputValid: (value) => openApiInput21.safeParse(value).success,
		isOutputValid: (value) => openApiOutput21.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint21(ctx, openApiInput21.parse(input)),
			),
	},
	{
		shortPath: 'analytics.postInternal',
		operationId: 'post-api-analytics-internal',
		method: 'POST',
		path: '/api/analytics/internal',
		input: { body: { events: [] } },
		output: null,
		expectedOptions: { method: 'POST', body: { events: [] } },
		multipart: false,
		isInputValid: (value) => openApiInput22.safeParse(value).success,
		isOutputValid: (value) => openApiOutput22.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint22(ctx, openApiInput22.parse(input)),
			),
	},
	{
		shortPath: 'apiKey.putByIdRegenerate',
		operationId: 'put-api-api-key-id-regenerate',
		method: 'PUT',
		path: '/api/api-key/1/regenerate',
		input: { path: { id: 1 } },
		output: {
			id: 1,
			unmasked_key: 'agent@metabase.invalid',
			masked_key: 'mb_1234********',
			prefix: 'aaaaaaa',
		},
		expectedOptions: { method: 'PUT' },
		multipart: false,
		isInputValid: (value) => openApiInput23.safeParse(value).success,
		isOutputValid: (value) => openApiOutput23.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint23(ctx, openApiInput23.parse(input)),
			),
	},
	{
		shortPath: 'cache.get',
		operationId: 'get-api-cache',
		method: 'GET',
		path: '/api/cache',
		input: { query: {} },
		output: { data: [] },
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput24.safeParse(value).success,
		isOutputValid: (value) => openApiOutput24.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint24(ctx, openApiInput24.parse(input)),
			),
	},
	{
		shortPath: 'cache.put',
		operationId: 'put-api-cache',
		method: 'PUT',
		path: '/api/cache',
		input: {
			body: { model: 'root', model_id: 0, strategy: { type: 'nocache' } },
		},
		output: { id: 1 },
		expectedOptions: {
			method: 'PUT',
			body: { model: 'root', model_id: 0, strategy: { type: 'nocache' } },
		},
		multipart: false,
		isInputValid: (value) => openApiInput25.safeParse(value).success,
		isOutputValid: (value) => openApiOutput25.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint25(ctx, openApiInput25.parse(input)),
			),
	},
	{
		shortPath: 'cache.delete',
		operationId: 'delete-api-cache',
		method: 'DELETE',
		path: '/api/cache',
		input: { body: { model: 'root', model_id: [] } },
		output: null,
		expectedOptions: {
			method: 'DELETE',
			body: { model: 'root', model_id: [] },
		},
		multipart: false,
		isInputValid: (value) => openApiInput26.safeParse(value).success,
		isOutputValid: (value) => openApiOutput26.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint26(ctx, openApiInput26.parse(input)),
			),
	},
	{
		shortPath: 'cache.postInvalidate',
		operationId: 'post-api-cache-invalidate',
		method: 'POST',
		path: '/api/cache/invalidate',
		input: { query: {} },
		output: { status: 200, body: { count: 1, message: '' } },
		expectedOptions: { method: 'POST', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput27.safeParse(value).success,
		isOutputValid: (value) => openApiOutput27.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint27(ctx, openApiInput27.parse(input)),
			),
	},
	{
		shortPath: 'dashboard.postByDashboardIdDashcardByDashcardIdExecuteValues',
		operationId:
			'post-api-dashboard-dashboard-id-dashcard-dashcard-id-execute-values',
		method: 'POST',
		path: '/api/dashboard/1/dashcard/1/execute/values',
		input: { path: { 'dashboard-id': 1, 'dashcard-id': 1 }, body: {} },
		output: {},
		expectedOptions: { method: 'POST', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput28.safeParse(value).success,
		isOutputValid: (value) => openApiOutput28.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint28(ctx, openApiInput28.parse(input)),
			),
	},
	{
		shortPath: 'dashboard.postByIdPdf',
		operationId: 'post-api-dashboard-id-pdf',
		method: 'POST',
		path: '/api/dashboard/1/pdf',
		input: { path: { id: 1 }, body: {} },
		output: {
			kind: 'binary',
			contentType: 'application/octet-stream',
			base64: 'b2s=',
			size: 2,
			headers: {},
		},
		expectedOptions: {
			method: 'POST',
			body: {},
			responseType: 'binary',
			requestTimeoutMs: 120000,
		},
		multipart: false,
		isInputValid: (value) => openApiInput29.safeParse(value).success,
		isOutputValid: (value) => openApiOutput29.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint29(ctx, openApiInput29.parse(input)),
			),
	},
	{
		shortPath: 'dataStudio.postTableDiscardValues',
		operationId: 'post-api-data-studio-table-discard-values',
		method: 'POST',
		path: '/api/data-studio/table/discard-values',
		input: { body: {} },
		output: null,
		expectedOptions: { method: 'POST', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput30.safeParse(value).success,
		isOutputValid: (value) => openApiOutput30.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint30(ctx, openApiInput30.parse(input)),
			),
	},
	{
		shortPath: 'dataStudio.postTableEdit',
		operationId: 'post-api-data-studio-table-edit',
		method: 'POST',
		path: '/api/data-studio/table/edit',
		input: { body: {} },
		output: {},
		expectedOptions: { method: 'POST', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput31.safeParse(value).success,
		isOutputValid: (value) => openApiOutput31.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint31(ctx, openApiInput31.parse(input)),
			),
	},
	{
		shortPath: 'dataStudio.postTableRescanValues',
		operationId: 'post-api-data-studio-table-rescan-values',
		method: 'POST',
		path: '/api/data-studio/table/rescan-values',
		input: { body: {} },
		output: null,
		expectedOptions: { method: 'POST', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput32.safeParse(value).success,
		isOutputValid: (value) => openApiOutput32.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint32(ctx, openApiInput32.parse(input)),
			),
	},
	{
		shortPath: 'dataStudio.postTableSelection',
		operationId: 'post-api-data-studio-table-selection',
		method: 'POST',
		path: '/api/data-studio/table/selection',
		input: { body: {} },
		output: {
			selected_table: {
				id: 1,
				db_id: 1,
				name: '',
				display_name: '',
				schema: '',
				is_published: false,
			},
			published_downstream_tables: [],
			unpublished_upstream_tables: [],
		},
		expectedOptions: { method: 'POST', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput33.safeParse(value).success,
		isOutputValid: (value) => openApiOutput33.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint33(ctx, openApiInput33.parse(input)),
			),
	},
	{
		shortPath: 'dataStudio.postTableSyncSchema',
		operationId: 'post-api-data-studio-table-sync-schema',
		method: 'POST',
		path: '/api/data-studio/table/sync-schema',
		input: { body: {} },
		output: null,
		expectedOptions: { method: 'POST', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput34.safeParse(value).success,
		isOutputValid: (value) => openApiOutput34.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint34(ctx, openApiInput34.parse(input)),
			),
	},
	{
		shortPath: 'database.getByIdSchemas',
		operationId: 'get-api-database-id-schemas',
		method: 'GET',
		path: '/api/database/1/schemas',
		input: { path: { id: 1 }, query: {} },
		output: [],
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput35.safeParse(value).success,
		isOutputValid: (value) => openApiOutput35.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint35(ctx, openApiInput35.parse(input)),
			),
	},
	{
		shortPath: 'database.getByIdSettingsAvailable',
		operationId: 'get-api-database-id-settings-available',
		method: 'GET',
		path: '/api/database/1/settings-available',
		input: { path: { id: 1 } },
		output: { settings: {} },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput36.safeParse(value).success,
		isOutputValid: (value) => openApiOutput36.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint36(ctx, openApiInput36.parse(input)),
			),
	},
	{
		shortPath: 'dataset.post',
		operationId: 'post-api-dataset',
		method: 'POST',
		path: '/api/dataset',
		input: { body: { type: 'internal' } },
		output: { status: 'completed', row_count: 1 },
		expectedOptions: {
			method: 'POST',
			body: { type: 'internal' },
			requestTimeoutMs: 120000,
		},
		multipart: false,
		isInputValid: (value) => openApiInput37.safeParse(value).success,
		isOutputValid: (value) => openApiOutput37.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint37(ctx, openApiInput37.parse(input)),
			),
	},
	{
		shortPath: 'dataset.postPivot',
		operationId: 'post-api-dataset-pivot',
		method: 'POST',
		path: '/api/dataset/pivot',
		input: { body: { stages: [{ 'lib/type': 'mbql.stage/native' }] } },
		output: { status: 'completed', row_count: 1 },
		expectedOptions: {
			method: 'POST',
			body: { stages: [{ 'lib/type': 'mbql.stage/native' }] },
			requestTimeoutMs: 120000,
		},
		multipart: false,
		isInputValid: (value) => openApiInput38.safeParse(value).success,
		isOutputValid: (value) => openApiOutput38.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint38(ctx, openApiInput38.parse(input)),
			),
	},
	{
		shortPath: 'dataset.postByExportFormat',
		operationId: 'post-api-dataset-export-format',
		method: 'POST',
		path: '/api/dataset/csv',
		input: {
			path: { 'export-format': 'csv' },
			body: { query: { type: 'internal' } },
		},
		output: {
			kind: 'binary',
			contentType: 'application/octet-stream',
			base64: 'b2s=',
			size: 2,
			headers: {},
		},
		expectedOptions: {
			method: 'POST',
			body: { query: { type: 'internal' } },
			responseType: 'binary',
			requestTimeoutMs: 120000,
		},
		multipart: false,
		isInputValid: (value) => openApiInput39.safeParse(value).success,
		isOutputValid: (value) => openApiOutput39.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint39(ctx, openApiInput39.parse(input)),
			),
	},
	{
		shortPath: 'document.getPublic',
		operationId: 'get-api-document-public',
		method: 'GET',
		path: '/api/document/public',
		input: {},
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput40.safeParse(value).success,
		isOutputValid: (value) => openApiOutput40.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint40(ctx, openApiInput40.parse(input)),
			),
	},
	{
		shortPath: 'document.postByDocumentIdPublicLink',
		operationId: 'post-api-document-document-id-public-link',
		method: 'POST',
		path: '/api/document/1/public-link',
		input: { path: { 'document-id': 1 } },
		output: { uuid: '00000000-0000-4000-8000-000000000001' },
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput41.safeParse(value).success,
		isOutputValid: (value) => openApiOutput41.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint41(ctx, openApiInput41.parse(input)),
			),
	},
	{
		shortPath: 'document.postByFromDocumentIdCopy',
		operationId: 'post-api-document-from-document-id-copy',
		method: 'POST',
		path: '/api/document/1/copy',
		input: { path: { 'from-document-id': 1 }, body: {} },
		output: { id: 1 },
		expectedOptions: { method: 'POST', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput42.safeParse(value).success,
		isOutputValid: (value) => openApiOutput42.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint42(ctx, openApiInput42.parse(input)),
			),
	},
	{
		shortPath: 'ee.getAiControlsMcpPermissions',
		operationId: 'get-api-ee-ai-controls-mcp-permissions',
		method: 'GET',
		path: '/api/ee/ai-controls/mcp-permissions',
		input: {},
		output: { advanced: false, tools: [], permissions: [] },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput43.safeParse(value).success,
		isOutputValid: (value) => openApiOutput43.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint43(ctx, openApiInput43.parse(input)),
			),
	},
	{
		shortPath: 'ee.putAiControlsMcpPermissions',
		operationId: 'put-api-ee-ai-controls-mcp-permissions',
		method: 'PUT',
		path: '/api/ee/ai-controls/mcp-permissions',
		input: { body: { permissions: [] } },
		output: { advanced: false, tools: [], permissions: [] },
		expectedOptions: { method: 'PUT', body: { permissions: [] } },
		multipart: false,
		isInputValid: (value) => openApiInput44.safeParse(value).success,
		isOutputValid: (value) => openApiOutput44.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint44(ctx, openApiInput44.parse(input)),
			),
	},
	{
		shortPath: 'ee.postAiControlsMcpPermissionsAdvanced',
		operationId: 'post-api-ee-ai-controls-mcp-permissions-advanced',
		method: 'POST',
		path: '/api/ee/ai-controls/mcp-permissions/advanced',
		input: {},
		output: { advanced: false, tools: [], permissions: [] },
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput45.safeParse(value).success,
		isOutputValid: (value) => openApiOutput45.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint45(ctx, openApiInput45.parse(input)),
			),
	},
	{
		shortPath: 'ee.deleteAiControlsMcpPermissionsAdvanced',
		operationId: 'delete-api-ee-ai-controls-mcp-permissions-advanced',
		method: 'DELETE',
		path: '/api/ee/ai-controls/mcp-permissions/advanced',
		input: {},
		output: { advanced: false, tools: [], permissions: [] },
		expectedOptions: { method: 'DELETE' },
		multipart: false,
		isInputValid: (value) => openApiInput46.safeParse(value).success,
		isOutputValid: (value) => openApiOutput46.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint46(ctx, openApiInput46.parse(input)),
			),
	},
	{
		shortPath: 'ee.getAiControlsPermissions',
		operationId: 'get-api-ee-ai-controls-permissions',
		method: 'GET',
		path: '/api/ee/ai-controls/permissions',
		input: {},
		output: { permissions: [], advanced: false },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput47.safeParse(value).success,
		isOutputValid: (value) => openApiOutput47.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint47(ctx, openApiInput47.parse(input)),
			),
	},
	{
		shortPath: 'ee.putAiControlsPermissions',
		operationId: 'put-api-ee-ai-controls-permissions',
		method: 'PUT',
		path: '/api/ee/ai-controls/permissions',
		input: { body: { permissions: [] } },
		output: { permissions: [], advanced: false },
		expectedOptions: { method: 'PUT', body: { permissions: [] } },
		multipart: false,
		isInputValid: (value) => openApiInput48.safeParse(value).success,
		isOutputValid: (value) => openApiOutput48.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint48(ctx, openApiInput48.parse(input)),
			),
	},
	{
		shortPath: 'ee.postAiControlsPermissionsAdvanced',
		operationId: 'post-api-ee-ai-controls-permissions-advanced',
		method: 'POST',
		path: '/api/ee/ai-controls/permissions/advanced',
		input: {},
		output: { permissions: [], advanced: false },
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput49.safeParse(value).success,
		isOutputValid: (value) => openApiOutput49.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint49(ctx, openApiInput49.parse(input)),
			),
	},
	{
		shortPath: 'ee.deleteAiControlsPermissionsAdvanced',
		operationId: 'delete-api-ee-ai-controls-permissions-advanced',
		method: 'DELETE',
		path: '/api/ee/ai-controls/permissions/advanced',
		input: {},
		output: { permissions: [], advanced: false },
		expectedOptions: { method: 'DELETE' },
		multipart: false,
		isInputValid: (value) => openApiInput50.safeParse(value).success,
		isOutputValid: (value) => openApiOutput50.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint50(ctx, openApiInput50.parse(input)),
			),
	},
	{
		shortPath: 'ee.getAiControlsUsageGroup',
		operationId: 'get-api-ee-ai-controls-usage-group',
		method: 'GET',
		path: '/api/ee/ai-controls/usage/group',
		input: {},
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput51.safeParse(value).success,
		isOutputValid: (value) => openApiOutput51.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint51(ctx, openApiInput51.parse(input)),
			),
	},
	{
		shortPath: 'ee.getAiControlsUsageGroupByGroupId',
		operationId: 'get-api-ee-ai-controls-usage-group-group-id',
		method: 'GET',
		path: '/api/ee/ai-controls/usage/group/1',
		input: { path: { 'group-id': 1 } },
		output: { group_id: 1, max_usage: 0 },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput52.safeParse(value).success,
		isOutputValid: (value) => openApiOutput52.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint52(ctx, openApiInput52.parse(input)),
			),
	},
	{
		shortPath: 'ee.putAiControlsUsageGroupByGroupId',
		operationId: 'put-api-ee-ai-controls-usage-group-group-id',
		method: 'PUT',
		path: '/api/ee/ai-controls/usage/group/1',
		input: { path: { 'group-id': 1 }, body: { max_usage: 0 } },
		output: { group_id: 1, max_usage: 0 },
		expectedOptions: { method: 'PUT', body: { max_usage: 0 } },
		multipart: false,
		isInputValid: (value) => openApiInput53.safeParse(value).success,
		isOutputValid: (value) => openApiOutput53.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint53(ctx, openApiInput53.parse(input)),
			),
	},
	{
		shortPath: 'ee.getAiControlsUsageInstance',
		operationId: 'get-api-ee-ai-controls-usage-instance',
		method: 'GET',
		path: '/api/ee/ai-controls/usage/instance',
		input: {},
		output: { max_usage: 0 },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput54.safeParse(value).success,
		isOutputValid: (value) => openApiOutput54.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint54(ctx, openApiInput54.parse(input)),
			),
	},
	{
		shortPath: 'ee.putAiControlsUsageInstance',
		operationId: 'put-api-ee-ai-controls-usage-instance',
		method: 'PUT',
		path: '/api/ee/ai-controls/usage/instance',
		input: { body: { max_usage: 0 } },
		output: { max_usage: 0 },
		expectedOptions: { method: 'PUT', body: { max_usage: 0 } },
		multipart: false,
		isInputValid: (value) => openApiInput55.safeParse(value).success,
		isOutputValid: (value) => openApiOutput55.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint55(ctx, openApiInput55.parse(input)),
			),
	},
	{
		shortPath: 'ee.getAiControlsUsageTenant',
		operationId: 'get-api-ee-ai-controls-usage-tenant',
		method: 'GET',
		path: '/api/ee/ai-controls/usage/tenant',
		input: {},
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput56.safeParse(value).success,
		isOutputValid: (value) => openApiOutput56.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint56(ctx, openApiInput56.parse(input)),
			),
	},
	{
		shortPath: 'ee.getAiControlsUsageTenantByTenantId',
		operationId: 'get-api-ee-ai-controls-usage-tenant-tenant-id',
		method: 'GET',
		path: '/api/ee/ai-controls/usage/tenant/1',
		input: { path: { 'tenant-id': 1 } },
		output: { tenant_id: 1, max_usage: 0 },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput57.safeParse(value).success,
		isOutputValid: (value) => openApiOutput57.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint57(ctx, openApiInput57.parse(input)),
			),
	},
	{
		shortPath: 'ee.putAiControlsUsageTenantByTenantId',
		operationId: 'put-api-ee-ai-controls-usage-tenant-tenant-id',
		method: 'PUT',
		path: '/api/ee/ai-controls/usage/tenant/1',
		input: { path: { 'tenant-id': 1 }, body: { max_usage: 0 } },
		output: { tenant_id: 1, max_usage: 0 },
		expectedOptions: { method: 'PUT', body: { max_usage: 0 } },
		multipart: false,
		isInputValid: (value) => openApiInput58.safeParse(value).success,
		isOutputValid: (value) => openApiOutput58.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint58(ctx, openApiInput58.parse(input)),
			),
	},
	{
		shortPath: 'ee.getApps',
		operationId: 'get-api-ee-apps',
		method: 'GET',
		path: '/api/ee/apps',
		input: {},
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput59.safeParse(value).success,
		isOutputValid: (value) => openApiOutput59.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint59(ctx, openApiInput59.parse(input)),
			),
	},
	{
		shortPath: 'ee.postAppsGenerateActions',
		operationId: 'post-api-ee-apps-generate-actions',
		method: 'POST',
		path: '/api/ee/apps/generate/actions',
		input: { body: { collection: 'aaaaaaaaaaaaaaaaaaaaa', actions: {} } },
		output: [],
		expectedOptions: {
			method: 'POST',
			body: { collection: 'aaaaaaaaaaaaaaaaaaaaa', actions: {} },
		},
		multipart: false,
		isInputValid: (value) => openApiInput60.safeParse(value).success,
		isOutputValid: (value) => openApiOutput60.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint60(ctx, openApiInput60.parse(input)),
			),
	},
	{
		shortPath: 'ee.postAppsGenerateQueries',
		operationId: 'post-api-ee-apps-generate-queries',
		method: 'POST',
		path: '/api/ee/apps/generate/queries',
		input: { body: { collection: 'aaaaaaaaaaaaaaaaaaaaa', queries: {} } },
		output: [],
		expectedOptions: {
			method: 'POST',
			body: { collection: 'aaaaaaaaaaaaaaaaaaaaa', queries: {} },
		},
		multipart: false,
		isInputValid: (value) => openApiInput61.safeParse(value).success,
		isOutputValid: (value) => openApiOutput61.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint61(ctx, openApiInput61.parse(input)),
			),
	},
	{
		shortPath: 'ee.getAppsGenerateSchema',
		operationId: 'get-api-ee-apps-generate-schema',
		method: 'GET',
		path: '/api/ee/apps/generate/schema',
		input: {},
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput62.safeParse(value).success,
		isOutputValid: (value) => openApiOutput62.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint62(ctx, openApiInput62.parse(input)),
			),
	},
	{
		shortPath: 'ee.getAppsRepoStatus',
		operationId: 'get-api-ee-apps-repo-status',
		method: 'GET',
		path: '/api/ee/apps/repo-status',
		input: {},
		output: { configured: false, url: '' },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput63.safeParse(value).success,
		isOutputValid: (value) => openApiOutput63.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint63(ctx, openApiInput63.parse(input)),
			),
	},
	{
		shortPath: 'ee.getAppsSandboxHost',
		operationId: 'get-api-ee-apps-sandbox-host',
		method: 'GET',
		path: '/api/ee/apps/sandbox-host',
		input: {},
		output: {
			kind: 'binary',
			contentType: 'application/octet-stream',
			base64: 'b2s=',
			size: 2,
			headers: {},
		},
		expectedOptions: { method: 'GET', responseType: 'binary' },
		multipart: false,
		isInputValid: (value) => openApiInput64.safeParse(value).success,
		isOutputValid: (value) => openApiOutput64.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint64(ctx, openApiInput64.parse(input)),
			),
	},
	{
		shortPath: 'ee.putAppsBySlug',
		operationId: 'put-api-ee-apps-slug',
		method: 'PUT',
		path: '/api/ee/apps/a',
		input: { path: { slug: 'a' }, body: { enabled: false } },
		output: {
			id: 1,
			slug: 'a',
			name: 'a',
			description: '',
			version: 1,
			outdated: false,
			bundle_path: 'a',
			enabled: false,
			allowed_hosts: [],
			resource_collection_id: 1,
			bundle_hash: '',
			created_at: null,
			updated_at: null,
		},
		expectedOptions: { method: 'PUT', body: { enabled: false } },
		multipart: false,
		isInputValid: (value) => openApiInput65.safeParse(value).success,
		isOutputValid: (value) => openApiOutput65.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint65(ctx, openApiInput65.parse(input)),
			),
	},
	{
		shortPath: 'ee.getAppsBySlug',
		operationId: 'get-api-ee-apps-slug',
		method: 'GET',
		path: '/api/ee/apps/a',
		input: { path: { slug: 'a' } },
		output: {
			id: 1,
			slug: 'a',
			name: 'a',
			description: '',
			version: 1,
			outdated: false,
			bundle_path: 'a',
			enabled: false,
			allowed_hosts: [],
			resource_collection_id: 1,
			bundle_hash: '',
			created_at: null,
			updated_at: null,
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput66.safeParse(value).success,
		isOutputValid: (value) => openApiOutput66.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint66(ctx, openApiInput66.parse(input)),
			),
	},
	{
		shortPath: 'ee.getAppsBySlugBundle',
		operationId: 'get-api-ee-apps-slug-bundle',
		method: 'GET',
		path: '/api/ee/apps/a/bundle',
		input: { path: { slug: 'a' } },
		output: {
			kind: 'binary',
			contentType: 'application/octet-stream',
			base64: 'b2s=',
			size: 2,
			headers: {},
		},
		expectedOptions: { method: 'GET', responseType: 'binary' },
		multipart: false,
		isInputValid: (value) => openApiInput67.safeParse(value).success,
		isOutputValid: (value) => openApiOutput67.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint67(ctx, openApiInput67.parse(input)),
			),
	},
	{
		shortPath: 'ee.getAppsBySlugGroupPermissionWarnings',
		operationId: 'get-api-ee-apps-slug-group-permission-warnings',
		method: 'GET',
		path: '/api/ee/apps/a/group-permission-warnings',
		input: { path: { slug: 'a' } },
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput68.safeParse(value).success,
		isOutputValid: (value) => openApiOutput68.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint68(ctx, openApiInput68.parse(input)),
			),
	},
	{
		shortPath: 'ee.getAppsBySlugGroups',
		operationId: 'get-api-ee-apps-slug-groups',
		method: 'GET',
		path: '/api/ee/apps/a/groups',
		input: { path: { slug: 'a' } },
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput69.safeParse(value).success,
		isOutputValid: (value) => openApiOutput69.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint69(ctx, openApiInput69.parse(input)),
			),
	},
	{
		shortPath: 'ee.postAppsBySlugGroups',
		operationId: 'post-api-ee-apps-slug-groups',
		method: 'POST',
		path: '/api/ee/apps/a/groups',
		input: { path: { slug: 'a' }, body: { group_ids: [1] } },
		output: [],
		expectedOptions: { method: 'POST', body: { group_ids: [1] } },
		multipart: false,
		isInputValid: (value) => openApiInput70.safeParse(value).success,
		isOutputValid: (value) => openApiOutput70.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint70(ctx, openApiInput70.parse(input)),
			),
	},
	{
		shortPath: 'ee.deleteAppsBySlugGroupsByGroupId',
		operationId: 'delete-api-ee-apps-slug-groups-group-id',
		method: 'DELETE',
		path: '/api/ee/apps/a/groups/1',
		input: { path: { slug: 'a', 'group-id': 1 } },
		output: null,
		expectedOptions: { method: 'DELETE' },
		multipart: false,
		isInputValid: (value) => openApiInput71.safeParse(value).success,
		isOutputValid: (value) => openApiOutput71.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint71(ctx, openApiInput71.parse(input)),
			),
	},
	{
		shortPath: 'ee.postAuditAppAnalyticsDevExport',
		operationId: 'post-api-ee-audit-app-analytics-dev-export',
		method: 'POST',
		path: '/api/ee/audit-app/analytics-dev/export',
		input: {},
		output: {
			kind: 'binary',
			contentType: 'application/octet-stream',
			base64: 'b2s=',
			size: 2,
			headers: {},
		},
		expectedOptions: {
			method: 'POST',
			responseType: 'binary',
			requestTimeoutMs: 120000,
		},
		multipart: false,
		isInputValid: (value) => openApiInput72.safeParse(value).success,
		isOutputValid: (value) => openApiOutput72.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint72(ctx, openApiInput72.parse(input)),
			),
	},
	{
		shortPath: 'ee.deleteCloudAddOnsByProductType',
		operationId: 'delete-api-ee-cloud-add-ons-product-type',
		method: 'DELETE',
		path: '/api/ee/cloud-add-ons/metabase-ai',
		input: { path: { 'product-type': 'metabase-ai' } },
		output: { status: 1, body: null },
		expectedOptions: { method: 'DELETE' },
		multipart: false,
		isInputValid: (value) => openApiInput73.safeParse(value).success,
		isOutputValid: (value) => openApiOutput73.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint73(ctx, openApiInput73.parse(input)),
			),
	},
	{
		shortPath: 'ee.getContentDiagnosticsDuplicated',
		operationId: 'get-api-ee-content-diagnostics-duplicated',
		method: 'GET',
		path: '/api/ee/content-diagnostics/duplicated',
		input: { query: {} },
		output: {
			data: [],
			total: 1,
			limit: 1,
			offset: 1,
			last_scan_at: '2026-01-02T03:04:05Z',
		},
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput74.safeParse(value).success,
		isOutputValid: (value) => openApiOutput74.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint74(ctx, openApiInput74.parse(input)),
			),
	},
	{
		shortPath: 'ee.getContentDiagnosticsImbalanced',
		operationId: 'get-api-ee-content-diagnostics-imbalanced',
		method: 'GET',
		path: '/api/ee/content-diagnostics/imbalanced',
		input: { query: {} },
		output: {
			data: [],
			total: 1,
			limit: 1,
			offset: 1,
			last_scan_at: '2026-01-02T03:04:05Z',
		},
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput75.safeParse(value).success,
		isOutputValid: (value) => openApiOutput75.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint75(ctx, openApiInput75.parse(input)),
			),
	},
	{
		shortPath: 'ee.postContentDiagnosticsInvalidate',
		operationId: 'post-api-ee-content-diagnostics-invalidate',
		method: 'POST',
		path: '/api/ee/content-diagnostics/invalidate',
		input: { body: { ids: [1] } },
		output: { invalidated: [], skipped: [] },
		expectedOptions: { method: 'POST', body: { ids: [1] } },
		multipart: false,
		isInputValid: (value) => openApiInput76.safeParse(value).success,
		isOutputValid: (value) => openApiOutput76.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint76(ctx, openApiInput76.parse(input)),
			),
	},
	{
		shortPath: 'ee.getContentDiagnosticsSlow',
		operationId: 'get-api-ee-content-diagnostics-slow',
		method: 'GET',
		path: '/api/ee/content-diagnostics/slow',
		input: { query: {} },
		output: {
			data: [],
			total: 1,
			limit: 1,
			offset: 1,
			last_scan_at: '2026-01-02T03:04:05Z',
		},
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput77.safeParse(value).success,
		isOutputValid: (value) => openApiOutput77.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint77(ctx, openApiInput77.parse(input)),
			),
	},
	{
		shortPath: 'ee.getContentDiagnosticsStale',
		operationId: 'get-api-ee-content-diagnostics-stale',
		method: 'GET',
		path: '/api/ee/content-diagnostics/stale',
		input: { query: {} },
		output: {
			data: [],
			total: 1,
			limit: 1,
			offset: 1,
			last_scan_at: '2026-01-02T03:04:05Z',
		},
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput78.safeParse(value).success,
		isOutputValid: (value) => openApiOutput78.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint78(ctx, openApiInput78.parse(input)),
			),
	},
	{
		shortPath: 'ee.getContentTranslationDictionary',
		operationId: 'get-api-ee-content-translation-dictionary',
		method: 'GET',
		path: '/api/ee/content-translation/dictionary',
		input: { query: { locale: '' } },
		output: { data: [] },
		expectedOptions: { method: 'GET', query: { locale: '' } },
		multipart: false,
		isInputValid: (value) => openApiInput79.safeParse(value).success,
		isOutputValid: (value) => openApiOutput79.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint79(ctx, openApiInput79.parse(input)),
			),
	},
	{
		shortPath: 'ee.postCustomVizPlugin',
		operationId: 'post-api-ee-custom-viz-plugin',
		method: 'POST',
		path: '/api/ee/custom-viz-plugin',
		input: {
			body: {
				file: {
					filename: '',
					size: 20,
					tempfile: new Blob(['metabase-test-bundle']),
				},
			},
		},
		output: {
			id: 1,
			display_name: 'a',
			identifier: 'a',
			status: 'active',
			enabled: false,
			dev_only: false,
			warnings: [],
			created_at: null,
			updated_at: null,
		},
		expectedOptions: { method: 'POST', requestTimeoutMs: 120000 },
		multipart: true,
		isInputValid: (value) => openApiInput80.safeParse(value).success,
		isOutputValid: (value) => openApiOutput80.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint80(ctx, openApiInput80.parse(input)),
			),
	},
	{
		shortPath: 'ee.getCustomVizPlugin',
		operationId: 'get-api-ee-custom-viz-plugin',
		method: 'GET',
		path: '/api/ee/custom-viz-plugin',
		input: {},
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput81.safeParse(value).success,
		isOutputValid: (value) => openApiOutput81.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint81(ctx, openApiInput81.parse(input)),
			),
	},
	{
		shortPath: 'ee.postCustomVizPluginDev',
		operationId: 'post-api-ee-custom-viz-plugin-dev',
		method: 'POST',
		path: '/api/ee/custom-viz-plugin/dev',
		input: { body: { dev_bundle_url: 'a' } },
		output: {
			id: 1,
			display_name: 'a',
			identifier: 'a',
			status: 'active',
			enabled: false,
			dev_only: false,
			warnings: [],
			created_at: null,
			updated_at: null,
		},
		expectedOptions: { method: 'POST', body: { dev_bundle_url: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput82.safeParse(value).success,
		isOutputValid: (value) => openApiOutput82.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint82(ctx, openApiInput82.parse(input)),
			),
	},
	{
		shortPath: 'ee.getCustomVizPluginList',
		operationId: 'get-api-ee-custom-viz-plugin-list',
		method: 'GET',
		path: '/api/ee/custom-viz-plugin/list',
		input: {},
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput83.safeParse(value).success,
		isOutputValid: (value) => openApiOutput83.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint83(ctx, openApiInput83.parse(input)),
			),
	},
	{
		shortPath: 'ee.getCustomVizPluginSandboxHost',
		operationId: 'get-api-ee-custom-viz-plugin-sandbox-host',
		method: 'GET',
		path: '/api/ee/custom-viz-plugin/sandbox-host',
		input: {},
		output: {
			kind: 'binary',
			contentType: 'application/octet-stream',
			base64: 'b2s=',
			size: 2,
			headers: {},
		},
		expectedOptions: { method: 'GET', responseType: 'binary' },
		multipart: false,
		isInputValid: (value) => openApiInput84.safeParse(value).success,
		isOutputValid: (value) => openApiOutput84.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint84(ctx, openApiInput84.parse(input)),
			),
	},
	{
		shortPath: 'ee.deleteCustomVizPluginById',
		operationId: 'delete-api-ee-custom-viz-plugin-id',
		method: 'DELETE',
		path: '/api/ee/custom-viz-plugin/1',
		input: { path: { id: 1 } },
		output: null,
		expectedOptions: { method: 'DELETE' },
		multipart: false,
		isInputValid: (value) => openApiInput85.safeParse(value).success,
		isOutputValid: (value) => openApiOutput85.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint85(ctx, openApiInput85.parse(input)),
			),
	},
	{
		shortPath: 'ee.putCustomVizPluginById',
		operationId: 'put-api-ee-custom-viz-plugin-id',
		method: 'PUT',
		path: '/api/ee/custom-viz-plugin/1',
		input: { path: { id: 1 }, body: {} },
		output: {
			id: 1,
			display_name: 'a',
			identifier: 'a',
			status: 'active',
			enabled: false,
			dev_only: false,
			warnings: [],
			created_at: null,
			updated_at: null,
		},
		expectedOptions: { method: 'PUT', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput86.safeParse(value).success,
		isOutputValid: (value) => openApiOutput86.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint86(ctx, openApiInput86.parse(input)),
			),
	},
	{
		shortPath: 'ee.getCustomVizPluginByIdAsset',
		operationId: 'get-api-ee-custom-viz-plugin-id-asset',
		method: 'GET',
		path: '/api/ee/custom-viz-plugin/1/asset',
		input: { path: { id: 1 }, query: { path: 'a' } },
		output: {
			kind: 'binary',
			contentType: 'application/octet-stream',
			base64: 'b2s=',
			size: 2,
			headers: {},
		},
		expectedOptions: {
			method: 'GET',
			query: { path: 'a' },
			responseType: 'binary',
		},
		multipart: false,
		isInputValid: (value) => openApiInput87.safeParse(value).success,
		isOutputValid: (value) => openApiOutput87.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint87(ctx, openApiInput87.parse(input)),
			),
	},
	{
		shortPath: 'ee.putCustomVizPluginByIdBundle',
		operationId: 'put-api-ee-custom-viz-plugin-id-bundle',
		method: 'PUT',
		path: '/api/ee/custom-viz-plugin/1/bundle',
		input: {
			path: { id: 1 },
			body: {
				file: {
					filename: '',
					size: 20,
					tempfile: new Blob(['metabase-test-bundle']),
				},
			},
		},
		output: {
			id: 1,
			display_name: 'a',
			identifier: 'a',
			status: 'active',
			enabled: false,
			dev_only: false,
			warnings: [],
			created_at: null,
			updated_at: null,
		},
		expectedOptions: { method: 'PUT', requestTimeoutMs: 120000 },
		multipart: true,
		isInputValid: (value) => openApiInput88.safeParse(value).success,
		isOutputValid: (value) => openApiOutput88.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint88(ctx, openApiInput88.parse(input)),
			),
	},
	{
		shortPath: 'ee.getCustomVizPluginByIdBundle',
		operationId: 'get-api-ee-custom-viz-plugin-id-bundle',
		method: 'GET',
		path: '/api/ee/custom-viz-plugin/1/bundle',
		input: { path: { id: 1 } },
		output: {
			kind: 'binary',
			contentType: 'application/octet-stream',
			base64: 'b2s=',
			size: 2,
			headers: {},
		},
		expectedOptions: { method: 'GET', responseType: 'binary' },
		multipart: false,
		isInputValid: (value) => openApiInput89.safeParse(value).success,
		isOutputValid: (value) => openApiOutput89.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint89(ctx, openApiInput89.parse(input)),
			),
	},
	{
		shortPath: 'ee.putCustomVizPluginByIdDevUrl',
		operationId: 'put-api-ee-custom-viz-plugin-id-dev-url',
		method: 'PUT',
		path: '/api/ee/custom-viz-plugin/1/dev-url',
		input: { path: { id: 1 }, body: { dev_bundle_url: '' } },
		output: { dev_bundle_url: '' },
		expectedOptions: { method: 'PUT', body: { dev_bundle_url: '' } },
		multipart: false,
		isInputValid: (value) => openApiInput90.safeParse(value).success,
		isOutputValid: (value) => openApiOutput90.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint90(ctx, openApiInput90.parse(input)),
			),
	},
	{
		shortPath: 'ee.postCustomVizPluginByIdRefresh',
		operationId: 'post-api-ee-custom-viz-plugin-id-refresh',
		method: 'POST',
		path: '/api/ee/custom-viz-plugin/1/refresh',
		input: { path: { id: 1 } },
		output: {
			id: 1,
			display_name: 'a',
			identifier: 'a',
			status: 'active',
			enabled: false,
			dev_only: false,
			warnings: [],
			created_at: null,
			updated_at: null,
		},
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput91.safeParse(value).success,
		isOutputValid: (value) => openApiOutput91.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint91(ctx, openApiInput91.parse(input)),
			),
	},
	{
		shortPath: 'ee.getDataComplexityScoreComplexity',
		operationId: 'get-api-ee-data-complexity-score-complexity',
		method: 'GET',
		path: '/api/ee/data-complexity-score/complexity',
		input: { query: {} },
		output: {
			library: { error: '' },
			universe: { error: '' },
			metabot: { error: '' },
			meta: { formula_version: 1, format_version: 1, synonym_threshold: 1 },
		},
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput92.safeParse(value).success,
		isOutputValid: (value) => openApiOutput92.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint92(ctx, openApiInput92.parse(input)),
			),
	},
	{
		shortPath: 'ee.postDataStudioTablePublishTables',
		operationId: 'post-api-ee-data-studio-table-publish-tables',
		method: 'POST',
		path: '/api/ee/data-studio/table/publish-tables',
		input: { body: { collection_id: 1 } },
		output: { target_collection: {} },
		expectedOptions: { method: 'POST', body: { collection_id: 1 } },
		multipart: false,
		isInputValid: (value) => openApiInput93.safeParse(value).success,
		isOutputValid: (value) => openApiOutput93.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint93(ctx, openApiInput93.parse(input)),
			),
	},
	{
		shortPath: 'ee.postDataStudioTableUnpublishTables',
		operationId: 'post-api-ee-data-studio-table-unpublish-tables',
		method: 'POST',
		path: '/api/ee/data-studio/table/unpublish-tables',
		input: { body: {} },
		output: null,
		expectedOptions: { method: 'POST', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput94.safeParse(value).success,
		isOutputValid: (value) => openApiOutput94.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint94(ctx, openApiInput94.parse(input)),
			),
	},
	{
		shortPath: 'ee.getDataStudioTableByIdPublishingInfo',
		operationId: 'get-api-ee-data-studio-table-id-publishing-info',
		method: 'GET',
		path: '/api/ee/data-studio/table/1/publishing-info',
		input: { path: { id: 1 } },
		output: {
			published_at: '2026-01-02T03:04:05Z',
			published_by: { id: 1, common_name: '' },
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput95.safeParse(value).success,
		isOutputValid: (value) => openApiOutput95.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint95(ctx, openApiInput95.parse(input)),
			),
	},
	{
		shortPath: 'ee.getDependenciesBackfillStatus',
		operationId: 'get-api-ee-dependencies-backfill-status',
		method: 'GET',
		path: '/api/ee/dependencies/backfill-status',
		input: {},
		output: { complete: false },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput96.safeParse(value).success,
		isOutputValid: (value) => openApiOutput96.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint96(ctx, openApiInput96.parse(input)),
			),
	},
	{
		shortPath: 'ee.getDependenciesGraph',
		operationId: 'get-api-ee-dependencies-graph',
		method: 'GET',
		path: '/api/ee/dependencies/graph',
		input: { query: {} },
		output: { nodes: [], edges: [] },
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput97.safeParse(value).success,
		isOutputValid: (value) => openApiOutput97.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint97(ctx, openApiInput97.parse(input)),
			),
	},
	{
		shortPath: 'ee.getDependenciesGraphBreaking',
		operationId: 'get-api-ee-dependencies-graph-breaking',
		method: 'GET',
		path: '/api/ee/dependencies/graph/breaking',
		input: { query: {} },
		output: { data: [], total: 0, offset: 0, limit: 1 },
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput98.safeParse(value).success,
		isOutputValid: (value) => openApiOutput98.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint98(ctx, openApiInput98.parse(input)),
			),
	},
	{
		shortPath: 'ee.getDependenciesGraphBroken',
		operationId: 'get-api-ee-dependencies-graph-broken',
		method: 'GET',
		path: '/api/ee/dependencies/graph/broken',
		input: { query: { id: 1, type: 'transform' } },
		output: [],
		expectedOptions: { method: 'GET', query: { id: 1, type: 'transform' } },
		multipart: false,
		isInputValid: (value) => openApiInput99.safeParse(value).success,
		isOutputValid: (value) => openApiOutput99.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint99(ctx, openApiInput99.parse(input)),
			),
	},
	{
		shortPath: 'ee.getDependenciesGraphDependents',
		operationId: 'get-api-ee-dependencies-graph-dependents',
		method: 'GET',
		path: '/api/ee/dependencies/graph/dependents',
		input: { query: { id: 1, type: 'transform' } },
		output: [],
		expectedOptions: { method: 'GET', query: { id: 1, type: 'transform' } },
		multipart: false,
		isInputValid: (value) => openApiInput100.safeParse(value).success,
		isOutputValid: (value) => openApiOutput100.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint100(ctx, openApiInput100.parse(input)),
			),
	},
	{
		shortPath: 'ee.getDependenciesGraphUnreferenced',
		operationId: 'get-api-ee-dependencies-graph-unreferenced',
		method: 'GET',
		path: '/api/ee/dependencies/graph/unreferenced',
		input: { query: {} },
		output: { data: [], total: 0, offset: 0, limit: 1 },
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput101.safeParse(value).success,
		isOutputValid: (value) => openApiOutput101.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint101(ctx, openApiInput101.parse(input)),
			),
	},
	{
		shortPath: 'ee.getErd',
		operationId: 'get-api-ee-erd',
		method: 'GET',
		path: '/api/ee/erd',
		input: {},
		output: { nodes: [], edges: [] },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput102.safeParse(value).success,
		isOutputValid: (value) => openApiOutput102.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint102(ctx, openApiInput102.parse(input)),
			),
	},
	{
		shortPath: 'ee.postGsheetsConnection',
		operationId: 'post-api-ee-gsheets-connection',
		method: 'POST',
		path: '/api/ee/gsheets/connection',
		input: { body: { url: 'a' } },
		output: { error: false, message: 'a' },
		expectedOptions: { method: 'POST', body: { url: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput103.safeParse(value).success,
		isOutputValid: (value) => openApiOutput103.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint103(ctx, openApiInput103.parse(input)),
			),
	},
	{
		shortPath: 'ee.getGsheetsConnection',
		operationId: 'get-api-ee-gsheets-connection',
		method: 'GET',
		path: '/api/ee/gsheets/connection',
		input: {},
		output: { error: false, message: 'a' },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput104.safeParse(value).success,
		isOutputValid: (value) => openApiOutput104.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint104(ctx, openApiInput104.parse(input)),
			),
	},
	{
		shortPath: 'ee.getGsheetsServiceAccount',
		operationId: 'get-api-ee-gsheets-service-account',
		method: 'GET',
		path: '/api/ee/gsheets/service-account',
		input: {},
		output: { email: '' },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput105.safeParse(value).success,
		isOutputValid: (value) => openApiOutput105.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint105(ctx, openApiInput105.parse(input)),
			),
	},
	{
		shortPath: 'ee.getLibrary',
		operationId: 'get-api-ee-library',
		method: 'GET',
		path: '/api/ee/library',
		input: {},
		output: { id: 1, name: '', description: '', archived: false },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput106.safeParse(value).success,
		isOutputValid: (value) => openApiOutput106.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint106(ctx, openApiInput106.parse(input)),
			),
	},
	{
		shortPath: 'ee.getMetabotAnalyticsConversations',
		operationId: 'get-api-ee-metabot-analytics-conversations',
		method: 'GET',
		path: '/api/ee/metabot-analytics/conversations',
		input: { query: {} },
		output: { data: [], total: 0, limit: 0, offset: 0 },
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput107.safeParse(value).success,
		isOutputValid: (value) => openApiOutput107.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint107(ctx, openApiInput107.parse(input)),
			),
	},
	{
		shortPath: 'ee.getMetabotAnalyticsConversationsById',
		operationId: 'get-api-ee-metabot-analytics-conversations-id',
		method: 'GET',
		path: '/api/ee/metabot-analytics/conversations/00000000-0000-4000-8000-000000000001',
		input: { path: { id: '00000000-0000-4000-8000-000000000001' } },
		output: {
			conversation_id: '00000000-0000-4000-8000-000000000001',
			created_at: '2026-01-02T03:04:05Z',
			title: '',
			user: { id: 1, email: '', first_name: '', last_name: '' },
			message_count: 0,
			total_tokens: 0,
			profile_id: '',
			slack_permalink: '',
			messages: [],
			queries: [],
			search_count: 0,
			query_count: 0,
			ip_address: '',
			embedding_hostname: '',
			embedding_path: '',
			user_agent: '',
			sanitized_user_agent: '',
			forked_from_conversation_id: '00000000-0000-4000-8000-000000000001',
			fork_boundary_message_id: '',
			feedback: [],
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput108.safeParse(value).success,
		isOutputValid: (value) => openApiOutput108.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint108(ctx, openApiInput108.parse(input)),
			),
	},
	{
		shortPath: 'ee.getMetabotUsage',
		operationId: 'get-api-ee-metabot-usage',
		method: 'GET',
		path: '/api/ee/metabot/usage',
		input: {},
		output: { is_locked: false, tokens: 1, updated_at: '' },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput109.safeParse(value).success,
		isOutputValid: (value) => openApiOutput109.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint109(ctx, openApiInput109.parse(input)),
			),
	},
	{
		shortPath: 'ee.getMfaAdminEnrolledUsers',
		operationId: 'get-api-ee-mfa-admin-enrolled-users',
		method: 'GET',
		path: '/api/ee/mfa/admin/enrolled-users',
		input: { query: {} },
		output: { data: [], total: 1, limit: 1, offset: 1 },
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput110.safeParse(value).success,
		isOutputValid: (value) => openApiOutput110.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint110(ctx, openApiInput110.parse(input)),
			),
	},
	{
		shortPath: 'ee.getMfaAdminOverview',
		operationId: 'get-api-ee-mfa-admin-overview',
		method: 'GET',
		path: '/api/ee/mfa/admin/overview',
		input: {},
		output: {
			encryption_key_set: false,
			enrolled_count: 1,
			unenrolled_count: 1,
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput111.safeParse(value).success,
		isOutputValid: (value) => openApiOutput111.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint111(ctx, openApiInput111.parse(input)),
			),
	},
	{
		shortPath: 'ee.getMfaAdminUnenrolledUsers',
		operationId: 'get-api-ee-mfa-admin-unenrolled-users',
		method: 'GET',
		path: '/api/ee/mfa/admin/unenrolled-users',
		input: { query: {} },
		output: { data: [], total: 1, limit: 1, offset: 1 },
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput112.safeParse(value).success,
		isOutputValid: (value) => openApiOutput112.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint112(ctx, openApiInput112.parse(input)),
			),
	},
	{
		shortPath: 'ee.postMfaEnroll',
		operationId: 'post-api-ee-mfa-enroll',
		method: 'POST',
		path: '/api/ee/mfa/enroll',
		input: { body: { password: 'a' } },
		output: { secret: 'a', otpauth_uri: 'a' },
		expectedOptions: { method: 'POST', body: { password: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput113.safeParse(value).success,
		isOutputValid: (value) => openApiOutput113.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint113(ctx, openApiInput113.parse(input)),
			),
	},
	{
		shortPath: 'ee.postMfaEnrollConfirm',
		operationId: 'post-api-ee-mfa-enroll-confirm',
		method: 'POST',
		path: '/api/ee/mfa/enroll/confirm',
		input: { body: { code: 'a' } },
		output: { recovery_codes: [] },
		expectedOptions: { method: 'POST', body: { code: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput114.safeParse(value).success,
		isOutputValid: (value) => openApiOutput114.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint114(ctx, openApiInput114.parse(input)),
			),
	},
	{
		shortPath: 'ee.postMfaRecoveryCodes',
		operationId: 'post-api-ee-mfa-recovery-codes',
		method: 'POST',
		path: '/api/ee/mfa/recovery-codes',
		input: { body: { code: 'a' } },
		output: { recovery_codes: [] },
		expectedOptions: { method: 'POST', body: { code: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput115.safeParse(value).success,
		isOutputValid: (value) => openApiOutput115.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint115(ctx, openApiInput115.parse(input)),
			),
	},
	{
		shortPath: 'ee.getMfaStatus',
		operationId: 'get-api-ee-mfa-status',
		method: 'GET',
		path: '/api/ee/mfa/status',
		input: {},
		output: {
			mfa_enabled: false,
			enrolled: false,
			pending: false,
			method: '',
			recovery_codes_remaining: 1,
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput116.safeParse(value).success,
		isOutputValid: (value) => openApiOutput116.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint116(ctx, openApiInput116.parse(input)),
			),
	},
	{
		shortPath: 'ee.getPermissionDebug',
		operationId: 'get-api-ee-permission_debug',
		method: 'GET',
		path: '/api/ee/permission_debug',
		input: { query: { user_id: 1, model_id: 1, action_type: 'card/read' } },
		output: {
			'model-type': 'card',
			'model-id': '',
			decision: 'allow',
			segment: [],
			message: [],
			data: {},
			suggestions: {},
		},
		expectedOptions: {
			method: 'GET',
			query: { user_id: 1, model_id: 1, action_type: 'card/read' },
			requestTimeoutMs: 120000,
		},
		multipart: false,
		isInputValid: (value) => openApiInput117.safeParse(value).success,
		isOutputValid: (value) => openApiOutput117.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint117(ctx, openApiInput117.parse(input)),
			),
	},
	{
		shortPath: 'ee.getRemoteSyncBranches',
		operationId: 'get-api-ee-remote-sync-branches',
		method: 'GET',
		path: '/api/ee/remote-sync/branches',
		input: {},
		output: { items: [] },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput118.safeParse(value).success,
		isOutputValid: (value) => openApiOutput118.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint118(ctx, openApiInput118.parse(input)),
			),
	},
	{
		shortPath: 'ee.postRemoteSyncCreateBranch',
		operationId: 'post-api-ee-remote-sync-create-branch',
		method: 'POST',
		path: '/api/ee/remote-sync/create-branch',
		input: { body: { name: 'a' } },
		output: { status: '', message: '' },
		expectedOptions: { method: 'POST', body: { name: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput119.safeParse(value).success,
		isOutputValid: (value) => openApiOutput119.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint119(ctx, openApiInput119.parse(input)),
			),
	},
	{
		shortPath: 'ee.getRemoteSyncCurrentTask',
		operationId: 'get-api-ee-remote-sync-current-task',
		method: 'GET',
		path: '/api/ee/remote-sync/current-task',
		input: {},
		output: {
			id: 1,
			sync_task_type: 'import',
			progress: 0,
			started_at: null,
			status: 'running',
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput120.safeParse(value).success,
		isOutputValid: (value) => openApiOutput120.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint120(ctx, openApiInput120.parse(input)),
			),
	},
	{
		shortPath: 'ee.postRemoteSyncCurrentTaskCancel',
		operationId: 'post-api-ee-remote-sync-current-task-cancel',
		method: 'POST',
		path: '/api/ee/remote-sync/current-task/cancel',
		input: {},
		output: {
			id: 1,
			sync_task_type: 'import',
			progress: 0,
			started_at: null,
			status: 'running',
		},
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput121.safeParse(value).success,
		isOutputValid: (value) => openApiOutput121.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint121(ctx, openApiInput121.parse(input)),
			),
	},
	{
		shortPath: 'ee.getRemoteSyncDirty',
		operationId: 'get-api-ee-remote-sync-dirty',
		method: 'GET',
		path: '/api/ee/remote-sync/dirty',
		input: {},
		output: { dirty: [] },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput122.safeParse(value).success,
		isOutputValid: (value) => openApiOutput122.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint122(ctx, openApiInput122.parse(input)),
			),
	},
	{
		shortPath: 'ee.postRemoteSyncExport',
		operationId: 'post-api-ee-remote-sync-export',
		method: 'POST',
		path: '/api/ee/remote-sync/export',
		input: { body: { branch: 'a' } },
		output: { message: '', task_id: 1 },
		expectedOptions: { method: 'POST', body: { branch: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput123.safeParse(value).success,
		isOutputValid: (value) => openApiOutput123.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint123(ctx, openApiInput123.parse(input)),
			),
	},
	{
		shortPath: 'ee.getRemoteSyncExportPreflight',
		operationId: 'get-api-ee-remote-sync-export-preflight',
		method: 'GET',
		path: '/api/ee/remote-sync/export-preflight',
		input: { query: { branch: 'a' } },
		output: {
			has_changes: false,
			clean: false,
			conflicts: [],
			summary: { added: 1, updated: 1, removed: 1 },
			force_push_casualties: { deleted: [], overwritten: [] },
			reason: '',
		},
		expectedOptions: { method: 'GET', query: { branch: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput124.safeParse(value).success,
		isOutputValid: (value) => openApiOutput124.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint124(ctx, openApiInput124.parse(input)),
			),
	},
	{
		shortPath: 'ee.getRemoteSyncHasRemoteChanges',
		operationId: 'get-api-ee-remote-sync-has-remote-changes',
		method: 'GET',
		path: '/api/ee/remote-sync/has-remote-changes',
		input: { query: {} },
		output: {
			has_changes: false,
			remote_version: '',
			local_version: '',
			cached: false,
		},
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput125.safeParse(value).success,
		isOutputValid: (value) => openApiOutput125.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint125(ctx, openApiInput125.parse(input)),
			),
	},
	{
		shortPath: 'ee.postRemoteSyncImport',
		operationId: 'post-api-ee-remote-sync-import',
		method: 'POST',
		path: '/api/ee/remote-sync/import',
		input: { body: {} },
		output: { status: 'success', task_id: 1 },
		expectedOptions: { method: 'POST', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput126.safeParse(value).success,
		isOutputValid: (value) => openApiOutput126.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint126(ctx, openApiInput126.parse(input)),
			),
	},
	{
		shortPath: 'ee.getRemoteSyncIsDirty',
		operationId: 'get-api-ee-remote-sync-is-dirty',
		method: 'GET',
		path: '/api/ee/remote-sync/is-dirty',
		input: {},
		output: { is_dirty: false },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput127.safeParse(value).success,
		isOutputValid: (value) => openApiOutput127.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint127(ctx, openApiInput127.parse(input)),
			),
	},
	{
		shortPath: 'ee.putRemoteSyncSettings',
		operationId: 'put-api-ee-remote-sync-settings',
		method: 'PUT',
		path: '/api/ee/remote-sync/settings',
		input: { body: {} },
		output: { success: false },
		expectedOptions: { method: 'PUT', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput128.safeParse(value).success,
		isOutputValid: (value) => openApiOutput128.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint128(ctx, openApiInput128.parse(input)),
			),
	},
	{
		shortPath: 'ee.postRemoteSyncStash',
		operationId: 'post-api-ee-remote-sync-stash',
		method: 'POST',
		path: '/api/ee/remote-sync/stash',
		input: { body: { new_branch: 'a', message: 'a' } },
		output: { status: '', message: '', task_id: 1 },
		expectedOptions: {
			method: 'POST',
			body: { new_branch: 'a', message: 'a' },
		},
		multipart: false,
		isInputValid: (value) => openApiInput129.safeParse(value).success,
		isOutputValid: (value) => openApiOutput129.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint129(ctx, openApiInput129.parse(input)),
			),
	},
	{
		shortPath: 'ee.postRemoteSyncTestConnection',
		operationId: 'post-api-ee-remote-sync-test-connection',
		method: 'POST',
		path: '/api/ee/remote-sync/test-connection',
		input: { body: {} },
		output: { status: 'success' },
		expectedOptions: { method: 'POST', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput130.safeParse(value).success,
		isOutputValid: (value) => openApiOutput130.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint130(ctx, openApiInput130.parse(input)),
			),
	},
	{
		shortPath: 'ee.postReplacementCheckReplaceSource',
		operationId: 'post-api-ee-replacement-check-replace-source',
		method: 'POST',
		path: '/api/ee/replacement/check-replace-source',
		input: {
			body: {
				source_entity_id: 1,
				source_entity_type: 'card',
				target_entity_id: 1,
				target_entity_type: 'card',
			},
		},
		output: { success: false },
		expectedOptions: {
			method: 'POST',
			body: {
				source_entity_id: 1,
				source_entity_type: 'card',
				target_entity_id: 1,
				target_entity_type: 'card',
			},
		},
		multipart: false,
		isInputValid: (value) => openApiInput131.safeParse(value).success,
		isOutputValid: (value) => openApiOutput131.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint131(ctx, openApiInput131.parse(input)),
			),
	},
	{
		shortPath: 'ee.postReplacementReplaceModelWithTransform',
		operationId: 'post-api-ee-replacement-replace-model-with-transform',
		method: 'POST',
		path: '/api/ee/replacement/replace-model-with-transform',
		input: {
			body: {
				card_id: 1,
				transform_name: '',
				transform_target: { type: 'table', name: '' },
			},
		},
		output: { status: 202, body: { run_id: 1 } },
		expectedOptions: {
			method: 'POST',
			body: {
				card_id: 1,
				transform_name: '',
				transform_target: { type: 'table', name: '' },
			},
		},
		multipart: false,
		isInputValid: (value) => openApiInput132.safeParse(value).success,
		isOutputValid: (value) => openApiOutput132.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint132(ctx, openApiInput132.parse(input)),
			),
	},
	{
		shortPath: 'ee.postReplacementReplaceSource',
		operationId: 'post-api-ee-replacement-replace-source',
		method: 'POST',
		path: '/api/ee/replacement/replace-source',
		input: {
			body: {
				source_entity_id: 1,
				source_entity_type: 'card',
				target_entity_id: 1,
				target_entity_type: 'card',
			},
		},
		output: { status: 202, body: { run_id: 1 } },
		expectedOptions: {
			method: 'POST',
			body: {
				source_entity_id: 1,
				source_entity_type: 'card',
				target_entity_id: 1,
				target_entity_type: 'card',
			},
		},
		multipart: false,
		isInputValid: (value) => openApiInput133.safeParse(value).success,
		isOutputValid: (value) => openApiOutput133.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint133(ctx, openApiInput133.parse(input)),
			),
	},
	{
		shortPath: 'ee.getReplacementRuns',
		operationId: 'get-api-ee-replacement-runs',
		method: 'GET',
		path: '/api/ee/replacement/runs',
		input: { query: {} },
		output: [],
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput134.safeParse(value).success,
		isOutputValid: (value) => openApiOutput134.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint134(ctx, openApiInput134.parse(input)),
			),
	},
	{
		shortPath: 'ee.getReplacementRunsById',
		operationId: 'get-api-ee-replacement-runs-id',
		method: 'GET',
		path: '/api/ee/replacement/runs/1',
		input: { path: { id: 1 } },
		output: {
			id: 1,
			status: 'pending',
			is_active: false,
			source_entity_type: 'card',
			source_entity_id: 1,
			target_entity_type: 'card',
			target_entity_id: 1,
			progress: 1,
			message: '',
			user_id: 1,
			start_time: '2026-01-02T03:04:05Z',
			end_time: '2026-01-02T03:04:05Z',
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput135.safeParse(value).success,
		isOutputValid: (value) => openApiOutput135.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint135(ctx, openApiInput135.parse(input)),
			),
	},
	{
		shortPath: 'ee.postReplacementRunsByIdCancel',
		operationId: 'post-api-ee-replacement-runs-id-cancel',
		method: 'POST',
		path: '/api/ee/replacement/runs/1/cancel',
		input: { path: { id: 1 } },
		output: { success: false },
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput136.safeParse(value).success,
		isOutputValid: (value) => openApiOutput136.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint136(ctx, openApiInput136.parse(input)),
			),
	},
	{
		shortPath: 'ee.getSecurityCenter',
		operationId: 'get-api-ee-security-center',
		method: 'GET',
		path: '/api/ee/security-center',
		input: {},
		output: { last_checked_at: '2026-01-02T03:04:05Z', advisories: [] },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput137.safeParse(value).success,
		isOutputValid: (value) => openApiOutput137.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint137(ctx, openApiInput137.parse(input)),
			),
	},
	{
		shortPath: 'ee.postSecurityCenterAcknowledge',
		operationId: 'post-api-ee-security-center-acknowledge',
		method: 'POST',
		path: '/api/ee/security-center/acknowledge',
		input: { body: { advisory_ids: [] } },
		output: [],
		expectedOptions: { method: 'POST', body: { advisory_ids: [] } },
		multipart: false,
		isInputValid: (value) => openApiInput138.safeParse(value).success,
		isOutputValid: (value) => openApiOutput138.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint138(ctx, openApiInput138.parse(input)),
			),
	},
	{
		shortPath: 'ee.postSecurityCenterSync',
		operationId: 'post-api-ee-security-center-sync',
		method: 'POST',
		path: '/api/ee/security-center/sync',
		input: {},
		output: { status: 'a' },
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput139.safeParse(value).success,
		isOutputValid: (value) => openApiOutput139.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint139(ctx, openApiInput139.parse(input)),
			),
	},
	{
		shortPath: 'ee.postSecurityCenterTestNotification',
		operationId: 'post-api-ee-security-center-test-notification',
		method: 'POST',
		path: '/api/ee/security-center/test-notification',
		input: { body: {} },
		output: { success: false },
		expectedOptions: { method: 'POST', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput140.safeParse(value).success,
		isOutputValid: (value) => openApiOutput140.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint140(ctx, openApiInput140.parse(input)),
			),
	},
	{
		shortPath: 'ee.postSecurityCenterByAdvisoryIdAcknowledge',
		operationId: 'post-api-ee-security-center-advisory-id-acknowledge',
		method: 'POST',
		path: '/api/ee/security-center/a/acknowledge',
		input: { path: { 'advisory-id': 'a' } },
		output: {
			advisory_id: 'a',
			match_status: 'unknown',
			acknowledged_by: { id: 1, common_name: 'a', email: '' },
			acknowledged_at: '2026-01-02T03:04:05Z',
		},
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput141.safeParse(value).success,
		isOutputValid: (value) => openApiOutput141.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint141(ctx, openApiInput141.parse(input)),
			),
	},
	{
		shortPath: 'ee.getSessionManagement',
		operationId: 'get-api-ee-session-management',
		method: 'GET',
		path: '/api/ee/session-management',
		input: { query: {} },
		output: { total: 0, limit: 1, offset: 0, data: [] },
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput142.safeParse(value).success,
		isOutputValid: (value) => openApiOutput142.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint142(ctx, openApiInput142.parse(input)),
			),
	},
	{
		shortPath: 'ee.postSessionManagementRevoke',
		operationId: 'post-api-ee-session-management-revoke',
		method: 'POST',
		path: '/api/ee/session-management/revoke',
		input: { body: {} },
		output: { revoked: 0, remaining: 0, user_ids: [] },
		expectedOptions: { method: 'POST', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput143.safeParse(value).success,
		isOutputValid: (value) => openApiOutput143.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint143(ctx, openApiInput143.parse(input)),
			),
	},
	{
		shortPath: 'ee.postSupportAccessGrant',
		operationId: 'post-api-ee-support-access-grant',
		method: 'POST',
		path: '/api/ee/support-access-grant',
		input: { body: { grant_duration_minutes: 1 } },
		output: {
			id: 1,
			user_id: 1,
			user_name: '',
			user_email: '',
			ticket_number: '',
			notes: '',
			grant_start_timestamp: '2026-01-02T03:04:05Z',
			grant_end_timestamp: '2026-01-02T03:04:05Z',
			revoked_at: '2026-01-02T03:04:05Z',
			revoked_by_user_id: 1,
			created_at: '2026-01-02T03:04:05Z',
			updated_at: '2026-01-02T03:04:05Z',
		},
		expectedOptions: { method: 'POST', body: { grant_duration_minutes: 1 } },
		multipart: false,
		isInputValid: (value) => openApiInput144.safeParse(value).success,
		isOutputValid: (value) => openApiOutput144.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint144(ctx, openApiInput144.parse(input)),
			),
	},
	{
		shortPath: 'ee.getSupportAccessGrant',
		operationId: 'get-api-ee-support-access-grant',
		method: 'GET',
		path: '/api/ee/support-access-grant',
		input: { query: {} },
		output: { data: [], total: 0, limit: 1, offset: 0 },
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput145.safeParse(value).success,
		isOutputValid: (value) => openApiOutput145.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint145(ctx, openApiInput145.parse(input)),
			),
	},
	{
		shortPath: 'ee.getSupportAccessGrantCurrent',
		operationId: 'get-api-ee-support-access-grant-current',
		method: 'GET',
		path: '/api/ee/support-access-grant/current',
		input: {},
		output: {
			id: 1,
			user_id: 1,
			user_name: '',
			user_email: '',
			ticket_number: '',
			notes: '',
			grant_start_timestamp: '2026-01-02T03:04:05Z',
			grant_end_timestamp: '2026-01-02T03:04:05Z',
			revoked_at: '2026-01-02T03:04:05Z',
			revoked_by_user_id: 1,
			created_at: '2026-01-02T03:04:05Z',
			updated_at: '2026-01-02T03:04:05Z',
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput146.safeParse(value).success,
		isOutputValid: (value) => openApiOutput146.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint146(ctx, openApiInput146.parse(input)),
			),
	},
	{
		shortPath: 'ee.putSupportAccessGrantByIdRevoke',
		operationId: 'put-api-ee-support-access-grant-id-revoke',
		method: 'PUT',
		path: '/api/ee/support-access-grant/1/revoke',
		input: { path: { id: 1 } },
		output: {
			id: 1,
			user_id: 1,
			user_name: '',
			user_email: '',
			ticket_number: '',
			notes: '',
			grant_start_timestamp: '2026-01-02T03:04:05Z',
			grant_end_timestamp: '2026-01-02T03:04:05Z',
			revoked_at: '2026-01-02T03:04:05Z',
			revoked_by_user_id: 1,
			created_at: '2026-01-02T03:04:05Z',
			updated_at: '2026-01-02T03:04:05Z',
		},
		expectedOptions: { method: 'PUT' },
		multipart: false,
		isInputValid: (value) => openApiInput147.safeParse(value).success,
		isOutputValid: (value) => openApiOutput147.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint147(ctx, openApiInput147.parse(input)),
			),
	},
	{
		shortPath: 'ee.postTenant',
		operationId: 'post-api-ee-tenant',
		method: 'POST',
		path: '/api/ee/tenant',
		input: { body: { name: 'a', slug: 'a' } },
		output: {
			id: 1,
			name: 'a',
			slug: 'a',
			is_active: false,
			tenant_collection_id: 1,
		},
		expectedOptions: { method: 'POST', body: { name: 'a', slug: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput148.safeParse(value).success,
		isOutputValid: (value) => openApiOutput148.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint148(ctx, openApiInput148.parse(input)),
			),
	},
	{
		shortPath: 'ee.getTenant',
		operationId: 'get-api-ee-tenant',
		method: 'GET',
		path: '/api/ee/tenant',
		input: { query: {} },
		output: { data: [] },
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput149.safeParse(value).success,
		isOutputValid: (value) => openApiOutput149.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint149(ctx, openApiInput149.parse(input)),
			),
	},
	{
		shortPath: 'ee.putTenantById',
		operationId: 'put-api-ee-tenant-id',
		method: 'PUT',
		path: '/api/ee/tenant/1',
		input: { path: { id: 1 }, body: {} },
		output: {
			id: 1,
			name: 'a',
			slug: 'a',
			is_active: false,
			tenant_collection_id: 1,
		},
		expectedOptions: { method: 'PUT', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput150.safeParse(value).success,
		isOutputValid: (value) => openApiOutput150.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint150(ctx, openApiInput150.parse(input)),
			),
	},
	{
		shortPath: 'ee.getTenantById',
		operationId: 'get-api-ee-tenant-id',
		method: 'GET',
		path: '/api/ee/tenant/1',
		input: { path: { id: 1 } },
		output: {
			id: 1,
			name: 'a',
			slug: 'a',
			is_active: false,
			tenant_collection_id: 1,
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput151.safeParse(value).success,
		isOutputValid: (value) => openApiOutput151.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint151(ctx, openApiInput151.parse(input)),
			),
	},
	{
		shortPath: 'ee.getTransformTest',
		operationId: 'get-api-ee-transform-test',
		method: 'GET',
		path: '/api/ee/transform-test',
		input: { query: {} },
		output: [],
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput152.safeParse(value).success,
		isOutputValid: (value) => openApiOutput152.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint152(ctx, openApiInput152.parse(input)),
			),
	},
	{
		shortPath: 'ee.postTransformTest',
		operationId: 'post-api-ee-transform-test',
		method: 'POST',
		path: '/api/ee/transform-test',
		input: {
			body: { transform_id: 1, name: 'a', inputs: [], expectations: [] },
		},
		output: {
			name: 'a',
			inputs: [],
			expectations: [],
			id: 1,
			entity_id: '',
			transform_id: 1,
			creator_id: 1,
			created_at: '2026-01-02T03:04:05Z',
			updated_at: '2026-01-02T03:04:05Z',
		},
		expectedOptions: {
			method: 'POST',
			body: { transform_id: 1, name: 'a', inputs: [], expectations: [] },
		},
		multipart: false,
		isInputValid: (value) => openApiInput153.safeParse(value).success,
		isOutputValid: (value) => openApiOutput153.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint153(ctx, openApiInput153.parse(input)),
			),
	},
	{
		shortPath: 'ee.getTransformTestById',
		operationId: 'get-api-ee-transform-test-id',
		method: 'GET',
		path: '/api/ee/transform-test/1',
		input: { path: { id: 1 } },
		output: {
			name: 'a',
			inputs: [],
			expectations: [],
			id: 1,
			entity_id: '',
			transform_id: 1,
			creator_id: 1,
			created_at: '2026-01-02T03:04:05Z',
			updated_at: '2026-01-02T03:04:05Z',
			last_run: {
				id: 1,
				transform_test_id: 1,
				initiated_by: 1,
				start_time: '2026-01-02T03:04:05Z',
				end_time: '2026-01-02T03:04:05Z',
				status: 'started',
				last_heartbeat: '2026-01-02T03:04:05Z',
			},
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput154.safeParse(value).success,
		isOutputValid: (value) => openApiOutput154.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint154(ctx, openApiInput154.parse(input)),
			),
	},
	{
		shortPath: 'ee.putTransformTestById',
		operationId: 'put-api-ee-transform-test-id',
		method: 'PUT',
		path: '/api/ee/transform-test/1',
		input: { path: { id: 1 }, body: {} },
		output: {
			name: 'a',
			inputs: [],
			expectations: [],
			id: 1,
			entity_id: '',
			transform_id: 1,
			creator_id: 1,
			created_at: '2026-01-02T03:04:05Z',
			updated_at: '2026-01-02T03:04:05Z',
		},
		expectedOptions: { method: 'PUT', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput155.safeParse(value).success,
		isOutputValid: (value) => openApiOutput155.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint155(ctx, openApiInput155.parse(input)),
			),
	},
	{
		shortPath: 'ee.deleteTransformTestById',
		operationId: 'delete-api-ee-transform-test-id',
		method: 'DELETE',
		path: '/api/ee/transform-test/1',
		input: { path: { id: 1 } },
		output: null,
		expectedOptions: { method: 'DELETE' },
		multipart: false,
		isInputValid: (value) => openApiInput156.safeParse(value).success,
		isOutputValid: (value) => openApiOutput156.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint156(ctx, openApiInput156.parse(input)),
			),
	},
	{
		shortPath: 'ee.getTransformTestByIdRun',
		operationId: 'get-api-ee-transform-test-id-run',
		method: 'GET',
		path: '/api/ee/transform-test/1/run',
		input: { path: { id: 1 }, query: {} },
		output: { data: [], limit: 1, offset: 1, total: 1 },
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput157.safeParse(value).success,
		isOutputValid: (value) => openApiOutput157.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint157(ctx, openApiInput157.parse(input)),
			),
	},
	{
		shortPath: 'ee.postTransformTestByIdRun',
		operationId: 'post-api-ee-transform-test-id-run',
		method: 'POST',
		path: '/api/ee/transform-test/1/run',
		input: { path: { id: 1 } },
		output: { status: 'passed', expectations: [], tables: {} },
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput158.safeParse(value).success,
		isOutputValid: (value) => openApiOutput158.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint158(ctx, openApiInput158.parse(input)),
			),
	},
	{
		shortPath: 'ee.postTransformsPythonTestRun',
		operationId: 'post-api-ee-transforms-python-test-run',
		method: 'POST',
		path: '/api/ee/transforms-python/test-run',
		input: { body: { code: '', source_tables: [{ alias: '' }] } },
		output: { logs: '' },
		expectedOptions: {
			method: 'POST',
			body: { code: '', source_tables: [{ alias: '' }] },
		},
		multipart: false,
		isInputValid: (value) => openApiInput159.safeParse(value).success,
		isOutputValid: (value) => openApiOutput159.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint159(ctx, openApiInput159.parse(input)),
			),
	},
	{
		shortPath: 'ee.getTransformsByIdInspect',
		operationId: 'get-api-ee-transforms-id-inspect',
		method: 'GET',
		path: '/api/ee/transforms/1/inspect',
		input: { path: { id: 1 } },
		output: { name: '', status: 'not-run', sources: [], available_lenses: [] },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput160.safeParse(value).success,
		isOutputValid: (value) => openApiOutput160.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint160(ctx, openApiInput160.parse(input)),
			),
	},
	{
		shortPath: 'ee.getTransformsByIdInspectByLensId',
		operationId: 'get-api-ee-transforms-id-inspect-lens-id',
		method: 'GET',
		path: '/api/ee/transforms/1/inspect/a',
		input: { path: { id: 1, 'lens-id': 'a' } },
		output: { id: '', display_name: '', sections: [], cards: [] },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput161.safeParse(value).success,
		isOutputValid: (value) => openApiOutput161.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint161(ctx, openApiInput161.parse(input)),
			),
	},
	{
		shortPath: 'ee.postTransformsByIdInspectByLensIdQuery',
		operationId: 'post-api-ee-transforms-id-inspect-lens-id-query',
		method: 'POST',
		path: '/api/ee/transforms/1/inspect/a/query',
		input: {
			path: { id: 1, 'lens-id': 'a' },
			body: { query: { stages: [{ 'lib/type': 'mbql.stage/native' }] } },
		},
		output: { status: 'completed', row_count: 1 },
		expectedOptions: {
			method: 'POST',
			body: { query: { stages: [{ 'lib/type': 'mbql.stage/native' }] } },
			requestTimeoutMs: 120000,
		},
		multipart: false,
		isInputValid: (value) => openApiInput162.safeParse(value).success,
		isOutputValid: (value) => openApiOutput162.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint162(ctx, openApiInput162.parse(input)),
			),
	},
	{
		shortPath: 'embedMcp.getBootstrap',
		operationId: 'get-api-embed-mcp-bootstrap',
		method: 'GET',
		path: '/api/embed-mcp/bootstrap',
		input: {},
		output: {
			user: {
				id: 1,
				locale: '',
				is_superuser: false,
				is_data_analyst: false,
				is_qbnewb: false,
				tenant_id: 1,
				personal_collection_id: 1,
				permissions: {
					can_create_queries: false,
					can_create_native_queries: false,
				},
			},
			settings: {},
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput163.safeParse(value).success,
		isOutputValid: (value) => openApiOutput163.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint163(ctx, openApiInput163.parse(input)),
			),
	},
	{
		shortPath: 'embedMcp.postFeedback',
		operationId: 'post-api-embed-mcp-feedback',
		method: 'POST',
		path: '/api/embed-mcp/feedback',
		input: {
			body: {
				feedback: { positive: false },
				conversation_data: { source: 'mcp' },
			},
		},
		output: { status: 204, body: null },
		expectedOptions: {
			method: 'POST',
			body: {
				feedback: { positive: false },
				conversation_data: { source: 'mcp' },
			},
		},
		multipart: false,
		isInputValid: (value) => openApiInput164.safeParse(value).success,
		isOutputValid: (value) => openApiOutput164.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint164(ctx, openApiInput164.parse(input)),
			),
	},
	{
		shortPath: 'embedMcp.getQueriesByHandle',
		operationId: 'get-api-embed-mcp-queries-handle',
		method: 'GET',
		path: '/api/embed-mcp/queries/00000000-0000-4000-8000-000000000001',
		input: { path: { handle: '00000000-0000-4000-8000-000000000001' } },
		output: { query: 'a', prompt: '' },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput165.safeParse(value).success,
		isOutputValid: (value) => openApiOutput165.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint165(ctx, openApiInput165.parse(input)),
			),
	},
	{
		shortPath: 'embedTheme.get',
		operationId: 'get-api-embed-theme',
		method: 'GET',
		path: '/api/embed-theme',
		input: {},
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput166.safeParse(value).success,
		isOutputValid: (value) => openApiOutput166.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint166(ctx, openApiInput166.parse(input)),
			),
	},
	{
		shortPath: 'embedTheme.post',
		operationId: 'post-api-embed-theme',
		method: 'POST',
		path: '/api/embed-theme',
		input: { body: { name: 'a', settings: {} } },
		output: {
			id: 1,
			entity_id: 'a',
			name: 'a',
			settings: {},
			is_default: false,
			created_at: '',
			updated_at: '',
		},
		expectedOptions: { method: 'POST', body: { name: 'a', settings: {} } },
		multipart: false,
		isInputValid: (value) => openApiInput167.safeParse(value).success,
		isOutputValid: (value) => openApiOutput167.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint167(ctx, openApiInput167.parse(input)),
			),
	},
	{
		shortPath: 'embedTheme.postSeedDefaults',
		operationId: 'post-api-embed-theme-seed-defaults',
		method: 'POST',
		path: '/api/embed-theme/seed-defaults',
		input: { body: { themes: [] } },
		output: null,
		expectedOptions: { method: 'POST', body: { themes: [] } },
		multipart: false,
		isInputValid: (value) => openApiInput168.safeParse(value).success,
		isOutputValid: (value) => openApiOutput168.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint168(ctx, openApiInput168.parse(input)),
			),
	},
	{
		shortPath: 'embedTheme.getById',
		operationId: 'get-api-embed-theme-id',
		method: 'GET',
		path: '/api/embed-theme/1',
		input: { path: { id: 1 } },
		output: {
			id: 1,
			entity_id: 'a',
			name: 'a',
			settings: {},
			is_default: false,
			created_at: '',
			updated_at: '',
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput169.safeParse(value).success,
		isOutputValid: (value) => openApiOutput169.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint169(ctx, openApiInput169.parse(input)),
			),
	},
	{
		shortPath: 'embedTheme.putById',
		operationId: 'put-api-embed-theme-id',
		method: 'PUT',
		path: '/api/embed-theme/1',
		input: { path: { id: 1 }, body: {} },
		output: {
			id: 1,
			entity_id: 'a',
			name: 'a',
			settings: {},
			is_default: false,
			created_at: '',
			updated_at: '',
		},
		expectedOptions: { method: 'PUT', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput170.safeParse(value).success,
		isOutputValid: (value) => openApiOutput170.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint170(ctx, openApiInput170.parse(input)),
			),
	},
	{
		shortPath: 'embedTheme.deleteById',
		operationId: 'delete-api-embed-theme-id',
		method: 'DELETE',
		path: '/api/embed-theme/1',
		input: { path: { id: 1 } },
		output: null,
		expectedOptions: { method: 'DELETE' },
		multipart: false,
		isInputValid: (value) => openApiInput171.safeParse(value).success,
		isOutputValid: (value) => openApiOutput171.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint171(ctx, openApiInput171.parse(input)),
			),
	},
	{
		shortPath: 'embedTheme.postByIdCopy',
		operationId: 'post-api-embed-theme-id-copy',
		method: 'POST',
		path: '/api/embed-theme/1/copy',
		input: { path: { id: 1 } },
		output: {
			id: 1,
			entity_id: 'a',
			name: 'a',
			settings: {},
			is_default: false,
			created_at: '',
			updated_at: '',
		},
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput172.safeParse(value).success,
		isOutputValid: (value) => openApiOutput172.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint172(ctx, openApiInput172.parse(input)),
			),
	},
	{
		shortPath: 'embeddingHub.getChecklist',
		operationId: 'get-api-embedding-hub-checklist',
		method: 'GET',
		path: '/api/embedding-hub/checklist',
		input: {},
		output: {
			checklist: {
				'add-data': false,
				'create-dashboard': false,
				'create-models': false,
				'configure-row-column-security': false,
				'create-test-embed': false,
				'embed-production': false,
				'create-custom-theme': false,
				'configure-ai': false,
				'sso-configured': false,
				'data-permissions-and-enable-tenants': false,
				'enable-tenants': false,
				'move-dashboard-to-shared': false,
				'create-tenants': false,
				'setup-data-segregation-strategy': false,
				'sso-auth-manual-tested': false,
			},
			'data-isolation-strategy': 'row-column-level-security',
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput173.safeParse(value).success,
		isOutputValid: (value) => openApiOutput173.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint173(ctx, openApiInput173.parse(input)),
			),
	},
	{
		shortPath: 'embeddingSdk.getReact18Hosts',
		operationId: 'get-api-embedding-sdk-react-18-hosts',
		method: 'GET',
		path: '/api/embedding-sdk/react-18-hosts',
		input: {},
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput174.safeParse(value).success,
		isOutputValid: (value) => openApiOutput174.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint174(ctx, openApiInput174.parse(input)),
			),
	},
	{
		shortPath: 'evalTrace.getBySessionId',
		operationId: 'get-api-eval-trace-session-id',
		method: 'GET',
		path: '/api/eval-trace/a',
		input: { path: { 'session-id': 'a' } },
		output: {
			kind: 'binary',
			contentType: 'application/octet-stream',
			base64: 'b2s=',
			size: 2,
			headers: {},
		},
		expectedOptions: { method: 'GET', responseType: 'binary' },
		multipart: false,
		isInputValid: (value) => openApiInput175.safeParse(value).success,
		isOutputValid: (value) => openApiOutput175.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint175(ctx, openApiInput175.parse(input)),
			),
	},
	{
		shortPath: 'exploration.post',
		operationId: 'post-api-exploration',
		method: 'POST',
		path: '/api/exploration',
		input: { body: { name: 'a' } },
		output: { id: 1, name: '', creator_id: 1 },
		expectedOptions: { method: 'POST', body: { name: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput176.safeParse(value).success,
		isOutputValid: (value) => openApiOutput176.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint176(ctx, openApiInput176.parse(input)),
			),
	},
	{
		shortPath: 'exploration.getDimensions',
		operationId: 'get-api-exploration-dimensions',
		method: 'GET',
		path: '/api/exploration/dimensions',
		input: {},
		output: { metrics: [], dimension_groups: [] },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput177.safeParse(value).success,
		isOutputValid: (value) => openApiOutput177.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint177(ctx, openApiInput177.parse(input)),
			),
	},
	{
		shortPath: 'exploration.getMine',
		operationId: 'get-api-exploration-mine',
		method: 'GET',
		path: '/api/exploration/mine',
		input: {},
		output: { total: 0, limit: 0, offset: 0, data: [] },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput178.safeParse(value).success,
		isOutputValid: (value) => openApiOutput178.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint178(ctx, openApiInput178.parse(input)),
			),
	},
	{
		shortPath: 'exploration.putPageByIdStarred',
		operationId: 'put-api-exploration-page-id-starred',
		method: 'PUT',
		path: '/api/exploration/page/1/starred',
		input: { path: { id: 1 }, body: { starred: false } },
		output: null,
		expectedOptions: { method: 'PUT', body: { starred: false } },
		multipart: false,
		isInputValid: (value) => openApiInput179.safeParse(value).success,
		isOutputValid: (value) => openApiOutput179.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint179(ctx, openApiInput179.parse(input)),
			),
	},
	{
		shortPath: 'exploration.putPagesHidden',
		operationId: 'put-api-exploration-pages-hidden',
		method: 'PUT',
		path: '/api/exploration/pages/hidden',
		input: { body: { page_ids: [], hidden: false } },
		output: null,
		expectedOptions: { method: 'PUT', body: { page_ids: [], hidden: false } },
		multipart: false,
		isInputValid: (value) => openApiInput180.safeParse(value).success,
		isOutputValid: (value) => openApiOutput180.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint180(ctx, openApiInput180.parse(input)),
			),
	},
	{
		shortPath: 'exploration.getQueryById',
		operationId: 'get-api-exploration-query-id',
		method: 'GET',
		path: '/api/exploration/query/1',
		input: { path: { id: 1 }, query: {} },
		output: null,
		expectedOptions: { method: 'GET', query: {}, requestTimeoutMs: 120000 },
		multipart: false,
		isInputValid: (value) => openApiInput181.safeParse(value).success,
		isOutputValid: (value) => openApiOutput181.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint181(ctx, openApiInput181.parse(input)),
			),
	},
	{
		shortPath: 'exploration.postThreadByThreadIdCancel',
		operationId: 'post-api-exploration-thread-thread-id-cancel',
		method: 'POST',
		path: '/api/exploration/thread/1/cancel',
		input: { path: { 'thread-id': 1 } },
		output: { id: 1, canceled_at: null, completed_at: null },
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput182.safeParse(value).success,
		isOutputValid: (value) => openApiOutput182.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint182(ctx, openApiInput182.parse(input)),
			),
	},
	{
		shortPath: 'exploration.postThreadByThreadIdRestart',
		operationId: 'post-api-exploration-thread-thread-id-restart',
		method: 'POST',
		path: '/api/exploration/thread/1/restart',
		input: { path: { 'thread-id': 1 } },
		output: { id: 1, name: '', creator_id: 1 },
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput183.safeParse(value).success,
		isOutputValid: (value) => openApiOutput183.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint183(ctx, openApiInput183.parse(input)),
			),
	},
	{
		shortPath: 'exploration.getById',
		operationId: 'get-api-exploration-id',
		method: 'GET',
		path: '/api/exploration/1',
		input: { path: { id: 1 } },
		output: { id: 1, name: '', creator_id: 1 },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput184.safeParse(value).success,
		isOutputValid: (value) => openApiOutput184.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint184(ctx, openApiInput184.parse(input)),
			),
	},
	{
		shortPath: 'exploration.putById',
		operationId: 'put-api-exploration-id',
		method: 'PUT',
		path: '/api/exploration/1',
		input: { path: { id: 1 }, body: {} },
		output: { id: 1, name: '', creator_id: 1 },
		expectedOptions: { method: 'PUT', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput185.safeParse(value).success,
		isOutputValid: (value) => openApiOutput185.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint185(ctx, openApiInput185.parse(input)),
			),
	},
	{
		shortPath: 'exploration.deleteById',
		operationId: 'delete-api-exploration-id',
		method: 'DELETE',
		path: '/api/exploration/1',
		input: { path: { id: 1 } },
		output: null,
		expectedOptions: { method: 'DELETE' },
		multipart: false,
		isInputValid: (value) => openApiInput186.safeParse(value).success,
		isOutputValid: (value) => openApiOutput186.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint186(ctx, openApiInput186.parse(input)),
			),
	},
	{
		shortPath: 'exploration.postByIdExploreFurther',
		operationId: 'post-api-exploration-id-explore-further',
		method: 'POST',
		path: '/api/exploration/1/explore-further',
		input: {
			path: { id: 1 },
			body: {
				page_id: 1,
				explore_filters: [
					{
						operator: '=',
						field_ref: ['expression', 'a'],
						value: '',
						display_value: 'a',
					},
				],
			},
		},
		output: { id: 1, name: '', creator_id: 1 },
		expectedOptions: {
			method: 'POST',
			body: {
				page_id: 1,
				explore_filters: [
					{
						operator: '=',
						field_ref: ['expression', 'a'],
						value: '',
						display_value: 'a',
					},
				],
			},
		},
		multipart: false,
		isInputValid: (value) => openApiInput187.safeParse(value).success,
		isOutputValid: (value) => openApiOutput187.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint187(ctx, openApiInput187.parse(input)),
			),
	},
	{
		shortPath: 'exploration.postByIdSummaryAppend',
		operationId: 'post-api-exploration-id-summary-append',
		method: 'POST',
		path: '/api/exploration/1/summary/append',
		input: {
			path: { id: 1 },
			body: {
				exploration_query_ids: [1],
				display: '',
				visualization_settings: {},
			},
		},
		output: {
			id: 1,
			name: '',
			exploration_id: 1,
			creator_id: 1,
			content_type: '',
			is_placeholder: false,
			created_at: '2026-01-02T03:04:05Z',
			updated_at: '2026-01-02T03:04:05Z',
		},
		expectedOptions: {
			method: 'POST',
			body: {
				exploration_query_ids: [1],
				display: '',
				visualization_settings: {},
			},
		},
		multipart: false,
		isInputValid: (value) => openApiInput188.safeParse(value).success,
		isOutputValid: (value) => openApiOutput188.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint188(ctx, openApiInput188.parse(input)),
			),
	},
	{
		shortPath: 'field.postTableIds',
		operationId: 'post-api-field-table-ids',
		method: 'POST',
		path: '/api/field/table-ids',
		input: { body: { field_ids: [] } },
		output: { table_ids: [] },
		expectedOptions: { method: 'POST', body: { field_ids: [] } },
		multipart: false,
		isInputValid: (value) => openApiInput189.safeParse(value).success,
		isOutputValid: (value) => openApiOutput189.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint189(ctx, openApiInput189.parse(input)),
			),
	},
	{
		shortPath: 'healthInspector.get',
		operationId: 'get-api-health-inspector',
		method: 'GET',
		path: '/api/health-inspector',
		input: { query: {} },
		output: [],
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput190.safeParse(value).success,
		isOutputValid: (value) => openApiOutput190.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint190(ctx, openApiInput190.parse(input)),
			),
	},
	{
		shortPath: 'index.get',
		operationId: 'get-api-index',
		method: 'GET',
		path: '/api/index',
		input: { query: { 'transform-id': 1 } },
		output: { data: [] },
		expectedOptions: { method: 'GET', query: { 'transform-id': 1 } },
		multipart: false,
		isInputValid: (value) => openApiInput191.safeParse(value).success,
		isOutputValid: (value) => openApiOutput191.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint191(ctx, openApiInput191.parse(input)),
			),
	},
	{
		shortPath: 'index.postRequest',
		operationId: 'post-api-index-request',
		method: 'POST',
		path: '/api/index/request',
		input: {
			body: {
				transform_id: 1,
				structured: { kind: 'btree', name: 'a', columns: [{ name: 'a' }] },
			},
		},
		output: {
			id: 1,
			transform_id: 1,
			index_name: 'a',
			structured: { kind: 'btree', name: 'a', columns: [{ name: 'a' }] },
			status: 'create-pending',
			error_message: '',
			created_by: 1,
			created_at: null,
			updated_at: null,
			last_executed_at: null,
		},
		expectedOptions: {
			method: 'POST',
			body: {
				transform_id: 1,
				structured: { kind: 'btree', name: 'a', columns: [{ name: 'a' }] },
			},
		},
		multipart: false,
		isInputValid: (value) => openApiInput192.safeParse(value).success,
		isOutputValid: (value) => openApiOutput192.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint192(ctx, openApiInput192.parse(input)),
			),
	},
	{
		shortPath: 'index.getRequestById',
		operationId: 'get-api-index-request-id',
		method: 'GET',
		path: '/api/index/request/1',
		input: { path: { id: 1 } },
		output: {
			id: 1,
			transform_id: 1,
			index_name: 'a',
			structured: { kind: 'btree', name: 'a', columns: [{ name: 'a' }] },
			status: 'create-pending',
			error_message: '',
			created_by: 1,
			created_at: null,
			updated_at: null,
			last_executed_at: null,
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput193.safeParse(value).success,
		isOutputValid: (value) => openApiOutput193.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint193(ctx, openApiInput193.parse(input)),
			),
	},
	{
		shortPath: 'index.putRequestById',
		operationId: 'put-api-index-request-id',
		method: 'PUT',
		path: '/api/index/request/1',
		input: {
			path: { id: 1 },
			body: {
				structured: { kind: 'btree', name: 'a', columns: [{ name: 'a' }] },
			},
		},
		output: {
			id: 1,
			transform_id: 1,
			index_name: 'a',
			structured: { kind: 'btree', name: 'a', columns: [{ name: 'a' }] },
			status: 'create-pending',
			error_message: '',
			created_by: 1,
			created_at: null,
			updated_at: null,
			last_executed_at: null,
		},
		expectedOptions: {
			method: 'PUT',
			body: {
				structured: { kind: 'btree', name: 'a', columns: [{ name: 'a' }] },
			},
		},
		multipart: false,
		isInputValid: (value) => openApiInput194.safeParse(value).success,
		isOutputValid: (value) => openApiOutput194.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint194(ctx, openApiInput194.parse(input)),
			),
	},
	{
		shortPath: 'llm.postExtractSources',
		operationId: 'post-api-llm-extract-sources',
		method: 'POST',
		path: '/api/llm/extract-sources',
		input: { body: { database_id: 1, sql: '' } },
		output: { tables: [], card_ids: [] },
		expectedOptions: { method: 'POST', body: { database_id: 1, sql: '' } },
		multipart: false,
		isInputValid: (value) => openApiInput195.safeParse(value).success,
		isOutputValid: (value) => openApiOutput195.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint195(ctx, openApiInput195.parse(input)),
			),
	},
	{
		shortPath: 'llm.getModels',
		operationId: 'get-api-llm-models',
		method: 'GET',
		path: '/api/llm/models',
		input: {},
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput196.safeParse(value).success,
		isOutputValid: (value) => openApiOutput196.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint196(ctx, openApiInput196.parse(input)),
			),
	},
	{
		shortPath: 'llm.getProviderTypes',
		operationId: 'get-api-llm-provider-types',
		method: 'GET',
		path: '/api/llm/provider-types',
		input: {},
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput197.safeParse(value).success,
		isOutputValid: (value) => openApiOutput197.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint197(ctx, openApiInput197.parse(input)),
			),
	},
	{
		shortPath: 'llm.getProviders',
		operationId: 'get-api-llm-providers',
		method: 'GET',
		path: '/api/llm/providers',
		input: {},
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput198.safeParse(value).success,
		isOutputValid: (value) => openApiOutput198.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint198(ctx, openApiInput198.parse(input)),
			),
	},
	{
		shortPath: 'llm.postProviders',
		operationId: 'post-api-llm-providers',
		method: 'POST',
		path: '/api/llm/providers',
		input: { body: { type: '' } },
		output: {
			key: '',
			type: '',
			name: '',
			source: 'db',
			usable: false,
			env_vars: [],
			env_fields: [],
			config: {},
		},
		expectedOptions: { method: 'POST', body: { type: '' } },
		multipart: false,
		isInputValid: (value) => openApiInput199.safeParse(value).success,
		isOutputValid: (value) => openApiOutput199.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint199(ctx, openApiInput199.parse(input)),
			),
	},
	{
		shortPath: 'llm.putProvidersByKey',
		operationId: 'put-api-llm-providers-key',
		method: 'PUT',
		path: '/api/llm/providers/',
		input: { path: { key: '' }, body: {} },
		output: {
			key: '',
			type: '',
			name: '',
			source: 'db',
			usable: false,
			env_vars: [],
			env_fields: [],
			config: {},
		},
		expectedOptions: { method: 'PUT', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput200.safeParse(value).success,
		isOutputValid: (value) => openApiOutput200.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint200(ctx, openApiInput200.parse(input)),
			),
	},
	{
		shortPath: 'llm.deleteProvidersByKey',
		operationId: 'delete-api-llm-providers-key',
		method: 'DELETE',
		path: '/api/llm/providers/',
		input: { path: { key: '' } },
		output: null,
		expectedOptions: { method: 'DELETE' },
		multipart: false,
		isInputValid: (value) => openApiInput201.safeParse(value).success,
		isOutputValid: (value) => openApiOutput201.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint201(ctx, openApiInput201.parse(input)),
			),
	},
	{
		shortPath: 'logger.getPresets',
		operationId: 'get-api-logger-presets',
		method: 'GET',
		path: '/api/logger/presets',
		input: {},
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput202.safeParse(value).success,
		isOutputValid: (value) => openApiOutput202.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint202(ctx, openApiInput202.parse(input)),
			),
	},
	{
		shortPath: 'measure.post',
		operationId: 'post-api-measure',
		method: 'POST',
		path: '/api/measure',
		input: {
			body: {
				name: 'a',
				definition: { stages: [{ 'lib/type': 'mbql.stage/native' }] },
			},
		},
		output: {
			id: 1,
			name: 'a',
			table_id: 1,
			definition: { stages: [{ 'lib/type': 'mbql.stage/native' }] },
			archived: false,
			creator_id: 1,
			created_at: null,
			updated_at: null,
		},
		expectedOptions: {
			method: 'POST',
			body: {
				name: 'a',
				definition: { stages: [{ 'lib/type': 'mbql.stage/native' }] },
			},
		},
		multipart: false,
		isInputValid: (value) => openApiInput203.safeParse(value).success,
		isOutputValid: (value) => openApiOutput203.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint203(ctx, openApiInput203.parse(input)),
			),
	},
	{
		shortPath: 'measure.get',
		operationId: 'get-api-measure',
		method: 'GET',
		path: '/api/measure',
		input: {},
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput204.safeParse(value).success,
		isOutputValid: (value) => openApiOutput204.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint204(ctx, openApiInput204.parse(input)),
			),
	},
	{
		shortPath: 'measure.getById',
		operationId: 'get-api-measure-id',
		method: 'GET',
		path: '/api/measure/1',
		input: { path: { id: 1 }, query: {} },
		output: {
			id: 1,
			name: 'a',
			table_id: 1,
			definition: { stages: [{ 'lib/type': 'mbql.stage/native' }] },
			archived: false,
			creator_id: 1,
			created_at: null,
			updated_at: null,
		},
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput205.safeParse(value).success,
		isOutputValid: (value) => openApiOutput205.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint205(ctx, openApiInput205.parse(input)),
			),
	},
	{
		shortPath: 'measure.putById',
		operationId: 'put-api-measure-id',
		method: 'PUT',
		path: '/api/measure/1',
		input: { path: { id: 1 }, body: { revision_message: 'a' } },
		output: {
			id: 1,
			name: 'a',
			table_id: 1,
			definition: { stages: [{ 'lib/type': 'mbql.stage/native' }] },
			archived: false,
			creator_id: 1,
			created_at: null,
			updated_at: null,
		},
		expectedOptions: { method: 'PUT', body: { revision_message: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput206.safeParse(value).success,
		isOutputValid: (value) => openApiOutput206.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint206(ctx, openApiInput206.parse(input)),
			),
	},
	{
		shortPath: 'measure.getByIdDimensionByDimensionKeyRemapping',
		operationId: 'get-api-measure-id-dimension-dimension-key-remapping',
		method: 'GET',
		path: '/api/measure/1/dimension/00000000-0000-4000-8000-000000000001/remapping',
		input: {
			path: { id: 1, 'dimension-key': '00000000-0000-4000-8000-000000000001' },
			query: { value: '' },
		},
		output: [null],
		expectedOptions: { method: 'GET', query: { value: '' } },
		multipart: false,
		isInputValid: (value) => openApiInput207.safeParse(value).success,
		isOutputValid: (value) => openApiOutput207.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint207(ctx, openApiInput207.parse(input)),
			),
	},
	{
		shortPath: 'measure.getByIdDimensionByDimensionKeySearch',
		operationId: 'get-api-measure-id-dimension-dimension-key-search',
		method: 'GET',
		path: '/api/measure/1/dimension/00000000-0000-4000-8000-000000000001/search',
		input: {
			path: { id: 1, 'dimension-key': '00000000-0000-4000-8000-000000000001' },
			query: { query: 'a' },
		},
		output: [],
		expectedOptions: { method: 'GET', query: { query: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput208.safeParse(value).success,
		isOutputValid: (value) => openApiOutput208.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint208(ctx, openApiInput208.parse(input)),
			),
	},
	{
		shortPath: 'measure.getByIdDimensionByDimensionKeyValues',
		operationId: 'get-api-measure-id-dimension-dimension-key-values',
		method: 'GET',
		path: '/api/measure/1/dimension/00000000-0000-4000-8000-000000000001/values',
		input: {
			path: { id: 1, 'dimension-key': '00000000-0000-4000-8000-000000000001' },
		},
		output: { has_more_values: false, values: [] },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput209.safeParse(value).success,
		isOutputValid: (value) => openApiOutput209.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint209(ctx, openApiInput209.parse(input)),
			),
	},
	{
		shortPath: 'metabot.getConversations',
		operationId: 'get-api-metabot-conversations',
		method: 'GET',
		path: '/api/metabot/conversations',
		input: {},
		output: { data: [], total: 0, limit: 0, offset: 0 },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput210.safeParse(value).success,
		isOutputValid: (value) => openApiOutput210.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint210(ctx, openApiInput210.parse(input)),
			),
	},
	{
		shortPath: 'metabot.getConversationsById',
		operationId: 'get-api-metabot-conversations-id',
		method: 'GET',
		path: '/api/metabot/conversations/00000000-0000-4000-8000-000000000001',
		input: { path: { id: '00000000-0000-4000-8000-000000000001' } },
		output: {
			conversation_id: '00000000-0000-4000-8000-000000000001',
			created_at: '2026-01-02T03:04:05Z',
			title: '',
			user_id: 1,
			forked_from_conversation_id: '00000000-0000-4000-8000-000000000001',
			saved_entities: [],
			messages: [],
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput211.safeParse(value).success,
		isOutputValid: (value) => openApiOutput211.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint211(ctx, openApiInput211.parse(input)),
			),
	},
	{
		shortPath: 'metabot.postConversationsByIdFork',
		operationId: 'post-api-metabot-conversations-id-fork',
		method: 'POST',
		path: '/api/metabot/conversations/00000000-0000-4000-8000-000000000001/fork',
		input: {
			path: { id: '00000000-0000-4000-8000-000000000001' },
			body: { message_id: '00000000-0000-4000-8000-000000000001' },
		},
		output: {
			conversation_id: '00000000-0000-4000-8000-000000000001',
			created_at: '2026-01-02T03:04:05Z',
			title: '',
			user_id: 1,
			forked_from_conversation_id: '00000000-0000-4000-8000-000000000001',
			saved_entities: [],
			messages: [],
		},
		expectedOptions: {
			method: 'POST',
			body: { message_id: '00000000-0000-4000-8000-000000000001' },
		},
		multipart: false,
		isInputValid: (value) => openApiInput212.safeParse(value).success,
		isOutputValid: (value) => openApiOutput212.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint212(ctx, openApiInput212.parse(input)),
			),
	},
	{
		shortPath: 'metabot.postConversationsByIdSavedEntity',
		operationId: 'post-api-metabot-conversations-id-saved-entity',
		method: 'POST',
		path: '/api/metabot/conversations/00000000-0000-4000-8000-000000000001/saved-entity',
		input: {
			path: { id: '00000000-0000-4000-8000-000000000001' },
			body: {
				chart_id: 'a',
				card: {
					name: 'a',
					dataset_query: { stages: [{ 'lib/type': 'mbql.stage/native' }] },
					display: 'a',
				},
			},
		},
		output: {
			id: 1,
			name: 'a',
			dataset_query: { stages: [{ 'lib/type': 'mbql.stage/native' }] },
			display: '',
			metabot_conversation_id: '00000000-0000-4000-8000-000000000001',
			metabot_chart_id: 'a',
		},
		expectedOptions: {
			method: 'POST',
			body: {
				chart_id: 'a',
				card: {
					name: 'a',
					dataset_query: { stages: [{ 'lib/type': 'mbql.stage/native' }] },
					display: 'a',
				},
			},
		},
		multipart: false,
		isInputValid: (value) => openApiInput213.safeParse(value).success,
		isOutputValid: (value) => openApiOutput213.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint213(ctx, openApiInput213.parse(input)),
			),
	},
	{
		shortPath: 'metabot.getConversationsByIdTitle',
		operationId: 'get-api-metabot-conversations-id-title',
		method: 'GET',
		path: '/api/metabot/conversations/00000000-0000-4000-8000-000000000001/title',
		input: { path: { id: '00000000-0000-4000-8000-000000000001' } },
		output: { status: 'ready', title: '' },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput214.safeParse(value).success,
		isOutputValid: (value) => openApiOutput214.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint214(ctx, openApiInput214.parse(input)),
			),
	},
	{
		shortPath: 'metabot.postDocumentGenerateContent',
		operationId: 'post-api-metabot-document-generate-content',
		method: 'POST',
		path: '/api/metabot/document/generate-content',
		input: { body: { instructions: 'a' } },
		output: {
			draft_card: {
				name: 'a',
				dataset_query: { stages: [{ 'lib/type': 'mbql.stage/native' }] },
				database_id: 1,
				parameters: [],
				visualization_settings: {},
			},
			error: 'a',
			description: 'a',
		},
		expectedOptions: { method: 'POST', body: { instructions: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput215.safeParse(value).success,
		isOutputValid: (value) => openApiOutput215.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint215(ctx, openApiInput215.parse(input)),
			),
	},
	{
		shortPath: 'metabot.postFeedback',
		operationId: 'post-api-metabot-feedback',
		method: 'POST',
		path: '/api/metabot/feedback',
		input: { body: { metabot_id: 1, message_id: 'a', positive: false } },
		output: { status: 204, body: null },
		expectedOptions: {
			method: 'POST',
			body: { metabot_id: 1, message_id: 'a', positive: false },
		},
		multipart: false,
		isInputValid: (value) => openApiInput216.safeParse(value).success,
		isOutputValid: (value) => openApiOutput216.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint216(ctx, openApiInput216.parse(input)),
			),
	},
	{
		shortPath: 'metabot.postMetabotByIdPromptSuggestionsRegenerate',
		operationId: 'post-api-metabot-metabot-id-prompt-suggestions-regenerate',
		method: 'POST',
		path: '/api/metabot/metabot/1/prompt-suggestions/regenerate',
		input: { path: { id: 1 } },
		output: { status: 'generated', prompt_count: 1 },
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput217.safeParse(value).success,
		isOutputValid: (value) => openApiOutput217.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint217(ctx, openApiInput217.parse(input)),
			),
	},
	{
		shortPath: 'metabot.getPermissionsUserPermissions',
		operationId: 'get-api-metabot-permissions-user-permissions',
		method: 'GET',
		path: '/api/metabot/permissions/user-permissions',
		input: {},
		output: {
			permissions: {
				metabot: 'yes',
				'metabot-sql-generation': 'yes',
				'metabot-nlq': 'yes',
				'metabot-other-tools': 'yes',
			},
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput218.safeParse(value).success,
		isOutputValid: (value) => openApiOutput218.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint218(ctx, openApiInput218.parse(input)),
			),
	},
	{
		shortPath: 'metabot.putSlackSettings',
		operationId: 'put-api-metabot-slack-settings',
		method: 'PUT',
		path: '/api/metabot/slack/settings',
		input: {
			body: {
				'slack-connect-client-id': 'a',
				'slack-connect-client-secret': 'a',
				'metabot-slack-signing-secret': 'a',
			},
		},
		output: { ok: false },
		expectedOptions: {
			method: 'PUT',
			body: {
				'slack-connect-client-id': 'a',
				'slack-connect-client-secret': 'a',
				'metabot-slack-signing-secret': 'a',
			},
		},
		multipart: false,
		isInputValid: (value) => openApiInput219.safeParse(value).success,
		isOutputValid: (value) => openApiOutput219.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint219(ctx, openApiInput219.parse(input)),
			),
	},
	{
		shortPath: 'metabot.postSourceFeedback',
		operationId: 'post-api-metabot-source-feedback',
		method: 'POST',
		path: '/api/metabot/source-feedback',
		input: {
			body: {
				metabot_id: 1,
				message_id: 'a',
				source_id: 1,
				source_type: 'table',
				positive: false,
			},
		},
		output: { status: 204, body: null },
		expectedOptions: {
			method: 'POST',
			body: {
				metabot_id: 1,
				message_id: 'a',
				source_id: 1,
				source_type: 'table',
				positive: false,
			},
		},
		multipart: false,
		isInputValid: (value) => openApiInput220.safeParse(value).success,
		isOutputValid: (value) => openApiOutput220.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint220(ctx, openApiInput220.parse(input)),
			),
	},
	{
		shortPath: 'metric.get',
		operationId: 'get-api-metric',
		method: 'GET',
		path: '/api/metric',
		input: {},
		output: { total: 0, limit: 1, offset: 0, data: [] },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput221.safeParse(value).success,
		isOutputValid: (value) => openApiOutput221.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint221(ctx, openApiInput221.parse(input)),
			),
	},
	{
		shortPath: 'metric.postBreakoutValues',
		operationId: 'post-api-metric-breakout-values',
		method: 'POST',
		path: '/api/metric/breakout-values',
		input: {
			body: { definition: { expression: ['metric', { 'lib/uuid': 'a' }, 1] } },
		},
		output: { values: [], col: {} },
		expectedOptions: {
			method: 'POST',
			body: { definition: { expression: ['metric', { 'lib/uuid': 'a' }, 1] } },
			requestTimeoutMs: 120000,
		},
		multipart: false,
		isInputValid: (value) => openApiInput222.safeParse(value).success,
		isOutputValid: (value) => openApiOutput222.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint222(ctx, openApiInput222.parse(input)),
			),
	},
	{
		shortPath: 'metric.postDataset',
		operationId: 'post-api-metric-dataset',
		method: 'POST',
		path: '/api/metric/dataset',
		input: {
			body: { definition: { expression: ['metric', { 'lib/uuid': 'a' }, 1] } },
		},
		output: { status: 'completed', data: { cols: [], rows: [] }, row_count: 0 },
		expectedOptions: {
			method: 'POST',
			body: { definition: { expression: ['metric', { 'lib/uuid': 'a' }, 1] } },
			requestTimeoutMs: 120000,
		},
		multipart: false,
		isInputValid: (value) => openApiInput223.safeParse(value).success,
		isOutputValid: (value) => openApiOutput223.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint223(ctx, openApiInput223.parse(input)),
			),
	},
	{
		shortPath: 'metric.getById',
		operationId: 'get-api-metric-id',
		method: 'GET',
		path: '/api/metric/1',
		input: { path: { id: 1 }, query: {} },
		output: {
			id: 1,
			name: '',
			description: '',
			collection_id: 1,
			dimensions: [],
			dimension_mappings: [],
		},
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput224.safeParse(value).success,
		isOutputValid: (value) => openApiOutput224.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint224(ctx, openApiInput224.parse(input)),
			),
	},
	{
		shortPath: 'metric.getByIdDimension',
		operationId: 'get-api-metric-id-dimension',
		method: 'GET',
		path: '/api/metric/1/dimension',
		input: { path: { id: 1 }, query: {} },
		output: { added: [], addable: [] },
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput225.safeParse(value).success,
		isOutputValid: (value) => openApiOutput225.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint225(ctx, openApiInput225.parse(input)),
			),
	},
	{
		shortPath: 'metric.postByIdDimensionAdd',
		operationId: 'post-api-metric-id-dimension-add',
		method: 'POST',
		path: '/api/metric/1/dimension/add',
		input: { path: { id: 1 }, body: { dimensions: [] } },
		output: [],
		expectedOptions: { method: 'POST', body: { dimensions: [] } },
		multipart: false,
		isInputValid: (value) => openApiInput226.safeParse(value).success,
		isOutputValid: (value) => openApiOutput226.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint226(ctx, openApiInput226.parse(input)),
			),
	},
	{
		shortPath: 'metric.postByIdDimensionRemove',
		operationId: 'post-api-metric-id-dimension-remove',
		method: 'POST',
		path: '/api/metric/1/dimension/remove',
		input: { path: { id: 1 }, body: { dimension_ids: [] } },
		output: [],
		expectedOptions: { method: 'POST', body: { dimension_ids: [] } },
		multipart: false,
		isInputValid: (value) => openApiInput227.safeParse(value).success,
		isOutputValid: (value) => openApiOutput227.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint227(ctx, openApiInput227.parse(input)),
			),
	},
	{
		shortPath: 'metric.postByIdDimensionReorder',
		operationId: 'post-api-metric-id-dimension-reorder',
		method: 'POST',
		path: '/api/metric/1/dimension/reorder',
		input: { path: { id: 1 }, body: { dimension_ids: [] } },
		output: [],
		expectedOptions: { method: 'POST', body: { dimension_ids: [] } },
		multipart: false,
		isInputValid: (value) => openApiInput228.safeParse(value).success,
		isOutputValid: (value) => openApiOutput228.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint228(ctx, openApiInput228.parse(input)),
			),
	},
	{
		shortPath: 'metric.postByIdDimensionSetDefault',
		operationId: 'post-api-metric-id-dimension-set-default',
		method: 'POST',
		path: '/api/metric/1/dimension/set-default',
		input: { path: { id: 1 }, body: { dimension_id: 'a' } },
		output: [],
		expectedOptions: { method: 'POST', body: { dimension_id: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput229.safeParse(value).success,
		isOutputValid: (value) => openApiOutput229.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint229(ctx, openApiInput229.parse(input)),
			),
	},
	{
		shortPath: 'metric.postByIdDimensionByDimensionKey',
		operationId: 'post-api-metric-id-dimension-dimension-key',
		method: 'POST',
		path: '/api/metric/1/dimension/00000000-0000-4000-8000-000000000001',
		input: {
			path: { id: 1, 'dimension-key': '00000000-0000-4000-8000-000000000001' },
			body: {},
		},
		output: {},
		expectedOptions: { method: 'POST', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput230.safeParse(value).success,
		isOutputValid: (value) => openApiOutput230.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint230(ctx, openApiInput230.parse(input)),
			),
	},
	{
		shortPath: 'metric.getByIdDimensionByDimensionKeyRemapping',
		operationId: 'get-api-metric-id-dimension-dimension-key-remapping',
		method: 'GET',
		path: '/api/metric/1/dimension/00000000-0000-4000-8000-000000000001/remapping',
		input: {
			path: { id: 1, 'dimension-key': '00000000-0000-4000-8000-000000000001' },
			query: { value: '' },
		},
		output: [null],
		expectedOptions: { method: 'GET', query: { value: '' } },
		multipart: false,
		isInputValid: (value) => openApiInput231.safeParse(value).success,
		isOutputValid: (value) => openApiOutput231.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint231(ctx, openApiInput231.parse(input)),
			),
	},
	{
		shortPath: 'metric.getByIdDimensionByDimensionKeySearch',
		operationId: 'get-api-metric-id-dimension-dimension-key-search',
		method: 'GET',
		path: '/api/metric/1/dimension/00000000-0000-4000-8000-000000000001/search',
		input: {
			path: { id: 1, 'dimension-key': '00000000-0000-4000-8000-000000000001' },
			query: { query: 'a' },
		},
		output: [],
		expectedOptions: { method: 'GET', query: { query: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput232.safeParse(value).success,
		isOutputValid: (value) => openApiOutput232.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint232(ctx, openApiInput232.parse(input)),
			),
	},
	{
		shortPath: 'metric.getByIdDimensionByDimensionKeyValues',
		operationId: 'get-api-metric-id-dimension-dimension-key-values',
		method: 'GET',
		path: '/api/metric/1/dimension/00000000-0000-4000-8000-000000000001/values',
		input: {
			path: { id: 1, 'dimension-key': '00000000-0000-4000-8000-000000000001' },
		},
		output: { has_more_values: false, values: [] },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput233.safeParse(value).success,
		isOutputValid: (value) => openApiOutput233.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint233(ctx, openApiInput233.parse(input)),
			),
	},
	{
		shortPath: 'notification.post',
		operationId: 'post-api-notification',
		method: 'POST',
		path: '/api/notification',
		input: {
			body: { payload_type: 'notification/dashboard', payload: { card_id: 1 } },
		},
		output: { payload_type: 'notification/dashboard', payload: { card_id: 1 } },
		expectedOptions: {
			method: 'POST',
			body: { payload_type: 'notification/dashboard', payload: { card_id: 1 } },
		},
		multipart: false,
		isInputValid: (value) => openApiInput234.safeParse(value).success,
		isOutputValid: (value) => openApiOutput234.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint234(ctx, openApiInput234.parse(input)),
			),
	},
	{
		shortPath: 'notification.getAdmin',
		operationId: 'get-api-notification-admin',
		method: 'GET',
		path: '/api/notification/admin',
		input: { query: {} },
		output: { data: [], total: 0, limit: 1, offset: 0 },
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput235.safeParse(value).success,
		isOutputValid: (value) => openApiOutput235.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint235(ctx, openApiInput235.parse(input)),
			),
	},
	{
		shortPath: 'notification.postAdminBulk',
		operationId: 'post-api-notification-admin-bulk',
		method: 'POST',
		path: '/api/notification/admin/bulk',
		input: { body: { notification_ids: [1], action: 'archive' } },
		output: { updated: 0 },
		expectedOptions: {
			method: 'POST',
			body: { notification_ids: [1], action: 'archive' },
		},
		multipart: false,
		isInputValid: (value) => openApiInput236.safeParse(value).success,
		isOutputValid: (value) => openApiOutput236.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint236(ctx, openApiInput236.parse(input)),
			),
	},
	{
		shortPath: 'notification.getAdminById',
		operationId: 'get-api-notification-admin-id',
		method: 'GET',
		path: '/api/notification/admin/1',
		input: { path: { id: 1 } },
		output: {
			id: 1,
			active: false,
			creator_id: 1,
			created_at: '2026-01-02T03:04:05Z',
			updated_at: '2026-01-02T03:04:05Z',
			payload_type: '',
			payload_id: 1,
			last_check: { at: '2026-01-02T03:04:05Z', error: '', status: 'failing' },
			last_send: { at: '2026-01-02T03:04:05Z', error: '', status: 'failing' },
			check_history: [],
			send_history: [],
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput237.safeParse(value).success,
		isOutputValid: (value) => openApiOutput237.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint237(ctx, openApiInput237.parse(input)),
			),
	},
	{
		shortPath: 'oauth.getAuthorizations',
		operationId: 'get-api-oauth-authorizations',
		method: 'GET',
		path: '/api/oauth/authorizations',
		input: { query: {} },
		output: { total: 0, limit: 1, offset: 0, data: [] },
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput238.safeParse(value).success,
		isOutputValid: (value) => openApiOutput238.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint238(ctx, openApiInput238.parse(input)),
			),
	},
	{
		shortPath: 'osi.getAiContext',
		operationId: 'get-api-osi-ai-context',
		method: 'GET',
		path: '/api/osi/ai-context',
		input: {},
		output: { data: [], total: 1, limit: 1, offset: 1 },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput239.safeParse(value).success,
		isOutputValid: (value) => openApiOutput239.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint239(ctx, openApiInput239.parse(input)),
			),
	},
	{
		shortPath: 'osi.postAiContextReconcile',
		operationId: 'post-api-osi-ai-context-reconcile',
		method: 'POST',
		path: '/api/osi/ai-context/reconcile',
		input: {},
		output: {
			index: { inserted: 1, deleted: 1, unchanged: 1 },
			execution: { waited_ms: 1, ran_ms: 1 },
		},
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput240.safeParse(value).success,
		isOutputValid: (value) => openApiOutput240.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint240(ctx, openApiInput240.parse(input)),
			),
	},
	{
		shortPath: 'osi.getAiContextByEntityTypeByEntityLocalId',
		operationId: 'get-api-osi-ai-context-entity-type-entity-local-id',
		method: 'GET',
		path: '/api/osi/ai-context/a/1',
		input: { path: { 'entity-type': 'a', 'entity-local-id': 1 } },
		output: { entity_type: '', entity_local_id: 1, ai_context: {} },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput241.safeParse(value).success,
		isOutputValid: (value) => openApiOutput241.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint241(ctx, openApiInput241.parse(input)),
			),
	},
	{
		shortPath: 'osi.putAiContextByEntityTypeByEntityLocalId',
		operationId: 'put-api-osi-ai-context-entity-type-entity-local-id',
		method: 'PUT',
		path: '/api/osi/ai-context/a/1',
		input: {
			path: { 'entity-type': 'a', 'entity-local-id': 1 },
			body: { ai_context: {} },
		},
		output: { entity_type: '', entity_local_id: 1, ai_context: {} },
		expectedOptions: { method: 'PUT', body: { ai_context: {} } },
		multipart: false,
		isInputValid: (value) => openApiInput242.safeParse(value).success,
		isOutputValid: (value) => openApiOutput242.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint242(ctx, openApiInput242.parse(input)),
			),
	},
	{
		shortPath: 'permissions.getInviteGroupIds',
		operationId: 'get-api-permissions-invite-group-ids',
		method: 'GET',
		path: '/api/permissions/invite-group-ids',
		input: { query: { type: 'dashboard', id: 1 } },
		output: [],
		expectedOptions: { method: 'GET', query: { type: 'dashboard', id: 1 } },
		multipart: false,
		isInputValid: (value) => openApiInput243.safeParse(value).success,
		isOutputValid: (value) => openApiOutput243.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint243(ctx, openApiInput243.parse(input)),
			),
	},
	{
		shortPath: 'previewEmbed.getCardByTokenParamsByParamKeyValues',
		operationId: 'get-api-preview_embed-card-token-params-param-key-values',
		method: 'GET',
		path: '/api/preview_embed/card//params//values',
		input: { path: { token: '', 'param-key': '' } },
		output: { has_more_values: false, values: [] },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput244.safeParse(value).success,
		isOutputValid: (value) => openApiOutput244.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint244(ctx, openApiInput244.parse(input)),
			),
	},
	{
		shortPath: 'public.postDashboardByUuidDashcardByDashcardIdExecuteValues',
		operationId:
			'post-api-public-dashboard-uuid-dashcard-dashcard-id-execute-values',
		method: 'POST',
		path: '/api/public/dashboard/00000000-0000-4000-8000-000000000001/dashcard/1/execute/values',
		input: {
			path: { uuid: '00000000-0000-4000-8000-000000000001', 'dashcard-id': 1 },
			body: { parameters: {} },
		},
		output: {},
		expectedOptions: { method: 'POST', body: { parameters: {} } },
		multipart: false,
		isInputValid: (value) => openApiInput245.safeParse(value).success,
		isOutputValid: (value) => openApiOutput245.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint245(ctx, openApiInput245.parse(input)),
			),
	},
	{
		shortPath: 'session.getIllustrationByKey',
		operationId: 'get-api-session-illustration-key',
		method: 'GET',
		path: '/api/session/illustration/a',
		input: { path: { key: 'a' }, query: {} },
		output: {
			kind: 'binary',
			contentType: 'application/octet-stream',
			base64: 'b2s=',
			size: 2,
			headers: {},
		},
		expectedOptions: { method: 'GET', query: {}, responseType: 'binary' },
		multipart: false,
		isInputValid: (value) => openApiInput246.safeParse(value).success,
		isOutputValid: (value) => openApiOutput246.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint246(ctx, openApiInput246.parse(input)),
			),
	},
	{
		shortPath: 'session.postMfaEnroll',
		operationId: 'post-api-session-mfa-enroll',
		method: 'POST',
		path: '/api/session/mfa/enroll',
		input: { body: { enrollment_token: 'a', code: 'a' } },
		output: { status: 200, cookies: {}, body: { id: 'a', recovery_codes: [] } },
		expectedOptions: {
			method: 'POST',
			body: { enrollment_token: 'a', code: 'a' },
		},
		multipart: false,
		isInputValid: (value) => openApiInput247.safeParse(value).success,
		isOutputValid: (value) => openApiOutput247.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint247(ctx, openApiInput247.parse(input)),
			),
	},
	{
		shortPath: 'session.postMfaSendEmailOtp',
		operationId: 'post-api-session-mfa-send-email-otp',
		method: 'POST',
		path: '/api/session/mfa/send-email-otp',
		input: { body: { challenge_token: 'a' } },
		output: { success: true },
		expectedOptions: { method: 'POST', body: { challenge_token: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput248.safeParse(value).success,
		isOutputValid: (value) => openApiOutput248.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint248(ctx, openApiInput248.parse(input)),
			),
	},
	{
		shortPath: 'slack.getAppInfo',
		operationId: 'get-api-slack-app-info',
		method: 'GET',
		path: '/api/slack/app-info',
		input: {},
		output: {
			app_id: 'a',
			team_id: 'a',
			scopes: { actual: [], required: [], missing: [], extra: [] },
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput249.safeParse(value).success,
		isOutputValid: (value) => openApiOutput249.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint249(ctx, openApiInput249.parse(input)),
			),
	},
	{
		shortPath: 'slack.getManifest',
		operationId: 'get-api-slack-manifest',
		method: 'GET',
		path: '/api/slack/manifest',
		input: {},
		output: {
			display_information: { name: '', description: '', background_color: '' },
			features: { bot_user: { display_name: '' } },
			oauth_config: { scopes: { bot: [] } },
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput250.safeParse(value).success,
		isOutputValid: (value) => openApiOutput250.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint250(ctx, openApiInput250.parse(input)),
			),
	},
	{
		shortPath: 'table.putByIdFieldsOrder',
		operationId: 'put-api-table-id-fields-order',
		method: 'PUT',
		path: '/api/table/1/fields/order',
		input: { path: { id: 1 }, body: [] },
		output: { success: true },
		expectedOptions: { method: 'PUT', body: [] },
		multipart: false,
		isInputValid: (value) => openApiInput251.safeParse(value).success,
		isOutputValid: (value) => openApiOutput251.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint251(ctx, openApiInput251.parse(input)),
			),
	},
	{
		shortPath: 'task.getRuns',
		operationId: 'get-api-task-runs',
		method: 'GET',
		path: '/api/task/runs',
		input: {},
		output: { total: 0, limit: 1, offset: 0, data: [] },
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput252.safeParse(value).success,
		isOutputValid: (value) => openApiOutput252.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint252(ctx, openApiInput252.parse(input)),
			),
	},
	{
		shortPath: 'task.getRunsEntities',
		operationId: 'get-api-task-runs-entities',
		method: 'GET',
		path: '/api/task/runs/entities',
		input: { query: { 'run-type': 'alert', 'started-at': 'a' } },
		output: [],
		expectedOptions: {
			method: 'GET',
			query: { 'run-type': 'alert', 'started-at': 'a' },
		},
		multipart: false,
		isInputValid: (value) => openApiInput253.safeParse(value).success,
		isOutputValid: (value) => openApiOutput253.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint253(ctx, openApiInput253.parse(input)),
			),
	},
	{
		shortPath: 'task.getRunsById',
		operationId: 'get-api-task-runs-id',
		method: 'GET',
		path: '/api/task/runs/1',
		input: { path: { id: 1 } },
		output: {
			id: 1,
			run_type: 'alert',
			entity_type: 'dashboard',
			entity_id: 1,
			started_at: null,
			ended_at: null,
			status: 'started',
			tasks: [],
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput254.safeParse(value).success,
		isOutputValid: (value) => openApiOutput254.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint254(ctx, openApiInput254.parse(input)),
			),
	},
	{
		shortPath: 'timeline.post',
		operationId: 'post-api-timeline',
		method: 'POST',
		path: '/api/timeline',
		input: { body: { name: 'a' } },
		output: { id: 1 },
		expectedOptions: { method: 'POST', body: { name: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput255.safeParse(value).success,
		isOutputValid: (value) => openApiOutput255.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint255(ctx, openApiInput255.parse(input)),
			),
	},
	{
		shortPath: 'timeline.get',
		operationId: 'get-api-timeline',
		method: 'GET',
		path: '/api/timeline',
		input: { query: {} },
		output: [],
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput256.safeParse(value).success,
		isOutputValid: (value) => openApiOutput256.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint256(ctx, openApiInput256.parse(input)),
			),
	},
	{
		shortPath: 'timeline.getById',
		operationId: 'get-api-timeline-id',
		method: 'GET',
		path: '/api/timeline/1',
		input: { path: { id: 1 }, query: {} },
		output: { id: 1 },
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput257.safeParse(value).success,
		isOutputValid: (value) => openApiOutput257.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint257(ctx, openApiInput257.parse(input)),
			),
	},
	{
		shortPath: 'transform.get',
		operationId: 'get-api-transform',
		method: 'GET',
		path: '/api/transform',
		input: { query: {} },
		output: [],
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput258.safeParse(value).success,
		isOutputValid: (value) => openApiOutput258.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint258(ctx, openApiInput258.parse(input)),
			),
	},
	{
		shortPath: 'transform.post',
		operationId: 'post-api-transform',
		method: 'POST',
		path: '/api/transform',
		input: {
			body: {
				name: '',
				source: {
					type: 'query',
					query: { stages: [{ 'lib/type': 'mbql.stage/native' }] },
				},
				target: { type: 'table', name: '' },
			},
		},
		output: {
			id: 1,
			name: '',
			description: '',
			source: null,
			target: null,
			source_type: '',
			entity_id: '',
			created_at: null,
			updated_at: null,
			creator_id: 1,
			collection_id: 1,
			creator: { id: 1, email: '', first_name: '', last_name: '' },
		},
		expectedOptions: {
			method: 'POST',
			body: {
				name: '',
				source: {
					type: 'query',
					query: { stages: [{ 'lib/type': 'mbql.stage/native' }] },
				},
				target: { type: 'table', name: '' },
			},
		},
		multipart: false,
		isInputValid: (value) => openApiInput259.safeParse(value).success,
		isOutputValid: (value) => openApiOutput259.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint259(ctx, openApiInput259.parse(input)),
			),
	},
	{
		shortPath: 'transformDagRun.postByRunIdCancel',
		operationId: 'post-api-transform-dag-run-run-id-cancel',
		method: 'POST',
		path: '/api/transform-dag-run/1/cancel',
		input: { path: { 'run-id': 1 } },
		output: null,
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput260.safeParse(value).success,
		isOutputValid: (value) => openApiOutput260.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint260(ctx, openApiInput260.parse(input)),
			),
	},
	{
		shortPath: 'transformDagRun.getByRunIdTransformRuns',
		operationId: 'get-api-transform-dag-run-run-id-transform-runs',
		method: 'GET',
		path: '/api/transform-dag-run/1/transform-runs',
		input: { path: { 'run-id': 1 } },
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput261.safeParse(value).success,
		isOutputValid: (value) => openApiOutput261.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint261(ctx, openApiInput261.parse(input)),
			),
	},
	{
		shortPath: 'transformJob.post',
		operationId: 'post-api-transform-job',
		method: 'POST',
		path: '/api/transform-job',
		input: { body: { name: 'a', schedule: 'a' } },
		output: {
			id: 1,
			name: '',
			description: '',
			schedule: '',
			ui_display_type: 'cron/raw',
			active: false,
			entity_id: '',
			created_at: null,
			updated_at: null,
		},
		expectedOptions: { method: 'POST', body: { name: 'a', schedule: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput262.safeParse(value).success,
		isOutputValid: (value) => openApiOutput262.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint262(ctx, openApiInput262.parse(input)),
			),
	},
	{
		shortPath: 'transformJob.get',
		operationId: 'get-api-transform-job',
		method: 'GET',
		path: '/api/transform-job',
		input: { query: {} },
		output: [],
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput263.safeParse(value).success,
		isOutputValid: (value) => openApiOutput263.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint263(ctx, openApiInput263.parse(input)),
			),
	},
	{
		shortPath: 'transformJob.putActive',
		operationId: 'put-api-transform-job-active',
		method: 'PUT',
		path: '/api/transform-job/active',
		input: { body: { active: false } },
		output: { updated: 1, failed: 1 },
		expectedOptions: { method: 'PUT', body: { active: false } },
		multipart: false,
		isInputValid: (value) => openApiInput264.safeParse(value).success,
		isOutputValid: (value) => openApiOutput264.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint264(ctx, openApiInput264.parse(input)),
			),
	},
	{
		shortPath: 'transformJob.putByJobId',
		operationId: 'put-api-transform-job-job-id',
		method: 'PUT',
		path: '/api/transform-job/1',
		input: { path: { 'job-id': 1 }, body: {} },
		output: {
			id: 1,
			name: '',
			description: '',
			schedule: '',
			ui_display_type: 'cron/raw',
			active: false,
			entity_id: '',
			created_at: null,
			updated_at: null,
		},
		expectedOptions: { method: 'PUT', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput265.safeParse(value).success,
		isOutputValid: (value) => openApiOutput265.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint265(ctx, openApiInput265.parse(input)),
			),
	},
	{
		shortPath: 'transformJob.getByJobId',
		operationId: 'get-api-transform-job-job-id',
		method: 'GET',
		path: '/api/transform-job/1',
		input: { path: { 'job-id': 1 } },
		output: {
			id: 1,
			name: '',
			description: '',
			schedule: '',
			ui_display_type: 'cron/raw',
			active: false,
			entity_id: '',
			created_at: null,
			updated_at: null,
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput266.safeParse(value).success,
		isOutputValid: (value) => openApiOutput266.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint266(ctx, openApiInput266.parse(input)),
			),
	},
	{
		shortPath: 'transformJob.postByJobIdRun',
		operationId: 'post-api-transform-job-job-id-run',
		method: 'POST',
		path: '/api/transform-job/1/run',
		input: { path: { 'job-id': 1 }, body: {} },
		output: { status: 202, body: { message: null, job_run_id: 1 } },
		expectedOptions: { method: 'POST', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput267.safeParse(value).success,
		isOutputValid: (value) => openApiOutput267.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint267(ctx, openApiInput267.parse(input)),
			),
	},
	{
		shortPath: 'transformJob.getByJobIdRuns',
		operationId: 'get-api-transform-job-job-id-runs',
		method: 'GET',
		path: '/api/transform-job/1/runs',
		input: { path: { 'job-id': 1 }, query: {} },
		output: { data: [], limit: 1, offset: 1, total: 1 },
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput268.safeParse(value).success,
		isOutputValid: (value) => openApiOutput268.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint268(ctx, openApiInput268.parse(input)),
			),
	},
	{
		shortPath: 'transformJob.postByJobIdRunsByRunIdCancel',
		operationId: 'post-api-transform-job-job-id-runs-run-id-cancel',
		method: 'POST',
		path: '/api/transform-job/1/runs/1/cancel',
		input: { path: { 'job-id': 1, 'run-id': 1 } },
		output: null,
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput269.safeParse(value).success,
		isOutputValid: (value) => openApiOutput269.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint269(ctx, openApiInput269.parse(input)),
			),
	},
	{
		shortPath: 'transformJob.getByJobIdRunsByRunIdTransformRuns',
		operationId: 'get-api-transform-job-job-id-runs-run-id-transform-runs',
		method: 'GET',
		path: '/api/transform-job/1/runs/1/transform-runs',
		input: { path: { 'job-id': 1, 'run-id': 1 } },
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput270.safeParse(value).success,
		isOutputValid: (value) => openApiOutput270.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint270(ctx, openApiInput270.parse(input)),
			),
	},
	{
		shortPath: 'transformJob.getByJobIdTransforms',
		operationId: 'get-api-transform-job-job-id-transforms',
		method: 'GET',
		path: '/api/transform-job/1/transforms',
		input: { path: { 'job-id': 1 } },
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput271.safeParse(value).success,
		isOutputValid: (value) => openApiOutput271.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint271(ctx, openApiInput271.parse(input)),
			),
	},
	{
		shortPath: 'transformTag.post',
		operationId: 'post-api-transform-tag',
		method: 'POST',
		path: '/api/transform-tag',
		input: { body: { name: 'a' } },
		output: {
			id: 1,
			name: '',
			entity_id: '',
			created_at: null,
			updated_at: null,
		},
		expectedOptions: { method: 'POST', body: { name: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput272.safeParse(value).success,
		isOutputValid: (value) => openApiOutput272.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint272(ctx, openApiInput272.parse(input)),
			),
	},
	{
		shortPath: 'transformTag.get',
		operationId: 'get-api-transform-tag',
		method: 'GET',
		path: '/api/transform-tag',
		input: {},
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput273.safeParse(value).success,
		isOutputValid: (value) => openApiOutput273.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint273(ctx, openApiInput273.parse(input)),
			),
	},
	{
		shortPath: 'transformTag.putByTagId',
		operationId: 'put-api-transform-tag-tag-id',
		method: 'PUT',
		path: '/api/transform-tag/1',
		input: { path: { 'tag-id': 1 }, body: { name: 'a' } },
		output: {
			id: 1,
			name: '',
			entity_id: '',
			created_at: null,
			updated_at: null,
		},
		expectedOptions: { method: 'PUT', body: { name: 'a' } },
		multipart: false,
		isInputValid: (value) => openApiInput274.safeParse(value).success,
		isOutputValid: (value) => openApiOutput274.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint274(ctx, openApiInput274.parse(input)),
			),
	},
	{
		shortPath: 'transformTag.deleteByTagId',
		operationId: 'delete-api-transform-tag-tag-id',
		method: 'DELETE',
		path: '/api/transform-tag/1',
		input: { path: { 'tag-id': 1 } },
		output: null,
		expectedOptions: { method: 'DELETE' },
		multipart: false,
		isInputValid: (value) => openApiInput275.safeParse(value).success,
		isOutputValid: (value) => openApiOutput275.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint275(ctx, openApiInput275.parse(input)),
			),
	},
	{
		shortPath: 'transform.getRun',
		operationId: 'get-api-transform-run',
		method: 'GET',
		path: '/api/transform/run',
		input: { query: {} },
		output: { data: [], limit: 1, offset: 1, total: 1 },
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput276.safeParse(value).success,
		isOutputValid: (value) => openApiOutput276.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint276(ctx, openApiInput276.parse(input)),
			),
	},
	{
		shortPath: 'transform.getRunByRunId',
		operationId: 'get-api-transform-run-run-id',
		method: 'GET',
		path: '/api/transform/run/1',
		input: { path: { 'run-id': 1 } },
		output: {
			id: 1,
			transform_id: 1,
			run_method: '',
			status: 'started',
			is_active: false,
			start_time: null,
			message: '',
			user_id: 1,
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput277.safeParse(value).success,
		isOutputValid: (value) => openApiOutput277.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint277(ctx, openApiInput277.parse(input)),
			),
	},
	{
		shortPath: 'transform.getRuns',
		operationId: 'get-api-transform-runs',
		method: 'GET',
		path: '/api/transform/runs',
		input: { query: {} },
		output: { data: [], limit: 1, offset: 1, total: 1 },
		expectedOptions: { method: 'GET', query: {} },
		multipart: false,
		isInputValid: (value) => openApiInput278.safeParse(value).success,
		isOutputValid: (value) => openApiOutput278.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint278(ctx, openApiInput278.parse(input)),
			),
	},
	{
		shortPath: 'transform.getById',
		operationId: 'get-api-transform-id',
		method: 'GET',
		path: '/api/transform/1',
		input: { path: { id: 1 } },
		output: {
			id: 1,
			name: '',
			description: '',
			source: null,
			target: null,
			source_type: '',
			entity_id: '',
			created_at: null,
			updated_at: null,
			creator_id: 1,
			collection_id: 1,
			creator: { id: 1, email: '', first_name: '', last_name: '' },
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput279.safeParse(value).success,
		isOutputValid: (value) => openApiOutput279.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint279(ctx, openApiInput279.parse(input)),
			),
	},
	{
		shortPath: 'transform.putById',
		operationId: 'put-api-transform-id',
		method: 'PUT',
		path: '/api/transform/1',
		input: { path: { id: 1 }, body: {} },
		output: {
			id: 1,
			name: '',
			description: '',
			source: null,
			target: null,
			source_type: '',
			entity_id: '',
			created_at: null,
			updated_at: null,
			creator_id: 1,
			collection_id: 1,
			creator: { id: 1, email: '', first_name: '', last_name: '' },
		},
		expectedOptions: { method: 'PUT', body: {} },
		multipart: false,
		isInputValid: (value) => openApiInput280.safeParse(value).success,
		isOutputValid: (value) => openApiOutput280.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint280(ctx, openApiInput280.parse(input)),
			),
	},
	{
		shortPath: 'transform.deleteById',
		operationId: 'delete-api-transform-id',
		method: 'DELETE',
		path: '/api/transform/1',
		input: { path: { id: 1 } },
		output: null,
		expectedOptions: { method: 'DELETE' },
		multipart: false,
		isInputValid: (value) => openApiInput281.safeParse(value).success,
		isOutputValid: (value) => openApiOutput281.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint281(ctx, openApiInput281.parse(input)),
			),
	},
	{
		shortPath: 'transform.postByIdCancel',
		operationId: 'post-api-transform-id-cancel',
		method: 'POST',
		path: '/api/transform/1/cancel',
		input: { path: { id: 1 } },
		output: null,
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput282.safeParse(value).success,
		isOutputValid: (value) => openApiOutput282.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint282(ctx, openApiInput282.parse(input)),
			),
	},
	{
		shortPath: 'transform.getByIdDagTransforms',
		operationId: 'get-api-transform-id-dag-transforms',
		method: 'GET',
		path: '/api/transform/1/dag-transforms',
		input: { path: { id: 1 }, query: { direction: 'upstream' } },
		output: [],
		expectedOptions: { method: 'GET', query: { direction: 'upstream' } },
		multipart: false,
		isInputValid: (value) => openApiInput283.safeParse(value).success,
		isOutputValid: (value) => openApiOutput283.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint283(ctx, openApiInput283.parse(input)),
			),
	},
	{
		shortPath: 'transform.getByIdDependencies',
		operationId: 'get-api-transform-id-dependencies',
		method: 'GET',
		path: '/api/transform/1/dependencies',
		input: { path: { id: 1 } },
		output: [],
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput284.safeParse(value).success,
		isOutputValid: (value) => openApiOutput284.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint284(ctx, openApiInput284.parse(input)),
			),
	},
	{
		shortPath: 'transform.postByIdResetCheckpoint',
		operationId: 'post-api-transform-id-reset-checkpoint',
		method: 'POST',
		path: '/api/transform/1/reset-checkpoint',
		input: { path: { id: 1 } },
		output: null,
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput285.safeParse(value).success,
		isOutputValid: (value) => openApiOutput285.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint285(ctx, openApiInput285.parse(input)),
			),
	},
	{
		shortPath: 'transform.postByIdRun',
		operationId: 'post-api-transform-id-run',
		method: 'POST',
		path: '/api/transform/1/run',
		input: { path: { id: 1 } },
		output: { status: 202, body: { message: null, run_id: 1 } },
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput286.safeParse(value).success,
		isOutputValid: (value) => openApiOutput286.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint286(ctx, openApiInput286.parse(input)),
			),
	},
	{
		shortPath: 'transform.postByIdRunDag',
		operationId: 'post-api-transform-id-run-dag',
		method: 'POST',
		path: '/api/transform/1/run-dag',
		input: { path: { id: 1 }, body: { direction: 'upstream' } },
		output: { status: 202, body: { message: null, dag_run_id: 1 } },
		expectedOptions: { method: 'POST', body: { direction: 'upstream' } },
		multipart: false,
		isInputValid: (value) => openApiInput287.safeParse(value).success,
		isOutputValid: (value) => openApiOutput287.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint287(ctx, openApiInput287.parse(input)),
			),
	},
	{
		shortPath: 'transform.deleteByIdTable',
		operationId: 'delete-api-transform-id-table',
		method: 'DELETE',
		path: '/api/transform/1/table',
		input: { path: { id: 1 } },
		output: null,
		expectedOptions: { method: 'DELETE' },
		multipart: false,
		isInputValid: (value) => openApiInput288.safeParse(value).success,
		isOutputValid: (value) => openApiOutput288.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint288(ctx, openApiInput288.parse(input)),
			),
	},
	{
		shortPath: 'user.getCurrent',
		operationId: 'get-api-user-current',
		method: 'GET',
		path: '/api/user/current',
		input: {},
		output: {
			id: 1,
			email: 'a',
			first_name: '',
			last_name: '',
			common_name: '',
			date_joined: null,
			last_login: null,
			updated_at: null,
			first_login: null,
			is_superuser: false,
			is_data_analyst: false,
			is_qbnewb: false,
			is_active: false,
			is_installer: false,
			has_invited_second_user: false,
			has_question_and_dashboard: false,
			has_model: false,
			can_write_any_collection: false,
			sso_source: '',
			has_used_password: false,
			locale: '',
			tenant_id: 1,
			tenant_collection_id: 1,
			personal_collection_id: 1,
			group_ids: [],
			login_attributes: {},
			jwt_attributes: {},
			attributes: {},
			permissions: {
				can_create_queries: false,
				can_create_native_queries: false,
			},
			custom_homepage: { dashboard_id: 1 },
		},
		expectedOptions: { method: 'GET' },
		multipart: false,
		isInputValid: (value) => openApiInput289.safeParse(value).success,
		isOutputValid: (value) => openApiOutput289.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint289(ctx, openApiInput289.parse(input)),
			),
	},
	{
		shortPath: 'user.postByIdPasswordResetUrl',
		operationId: 'post-api-user-id-password-reset-url',
		method: 'POST',
		path: '/api/user/1/password-reset-url',
		input: { path: { id: 1 } },
		output: { password_reset_url: '' },
		expectedOptions: { method: 'POST' },
		multipart: false,
		isInputValid: (value) => openApiInput290.safeParse(value).success,
		isOutputValid: (value) => openApiOutput290.safeParse(value).success,
		invoke: async (ctx: MetabaseContext, input: MetabaseOpenApiTestValue) =>
			JsonValueSchema.parse(
				await openApiEndpoint290(ctx, openApiInput290.parse(input)),
			),
	},
];
