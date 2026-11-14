import { z } from 'zod';
import {
	FIREBERRY_BATCH_CREATE_ITEM_SCHEMAS,
	FIREBERRY_BATCH_UPDATE_RECORD_SCHEMAS,
	FIREBERRY_CREATE_RECORD_SCHEMAS,
	FIREBERRY_UPDATE_RECORD_SCHEMAS,
	FireberryJsonValueSchema,
} from './record-schemas';

// Custom fields are tenant-defined, so they use the documented JSON value domain.
const FieldMapSchema = z.record(z.string(), FireberryJsonValueSchema);
// `unknown` is needed because delete envelopes explicitly return data: null.
const EnvelopeDataSchema = z.unknown();
const EnvelopeSchema = z.object({
	success: z.boolean(),
	data: EnvelopeDataSchema,
	message: z.string(),
});
const RecordListResponseSchema = z.object({
	success: z.boolean(),
	data: z.object({
		PrimaryKey: z.string(),
		PrimaryField: z.string(),
		Total_Records: z.number(),
		Page_Size: z.number(),
		Page_Number: z.number(),
		Records: z.array(FieldMapSchema),
	}),
	message: z.string(),
});
const RecordResponseSchema = z.object({
	success: z.boolean(),
	data: z.object({ Record: FieldMapSchema }),
	message: z.string(),
});
// Live PUT responses return the record id as `data` and the updated record under `record`.
const RecordUpdateResponseSchema = z.object({
	success: z.boolean(),
	data: z.string(),
	message: z.string(),
	record: FieldMapSchema,
});
// The live file upload answers with a bare `true`; the reference shows `{}`.
const FileUploadResponseSchema = z.union([
	z.boolean(),
	z.object({}).passthrough(),
]);
const QueryResponseSchema = z.object({
	success: z.boolean(),
	data: z.array(FieldMapSchema),
	message: z.string(),
	pageNumber: z.number(),
	pageSize: z.number(),
	isLastPage: z.boolean(),
});
const CustomObjectCodeSchema = z.string().regex(/^\d+$/);
const BatchInputSchema = z
	.object({
		objectCode: z.union([
			z.enum([
				'account',
				'activitylog',
				'article',
				'accountproduct',
				'businessunit',
				'campaign',
				'competitor',
				'contact',
				'contract',
				'invoicecredit',
				'invoicedelivery',
				'invoicedraft',
				'invoiceno',
				'invoicereno',
				'activity',
				'note',
				'opportunity',
				'crmorder',
				'crmorderitem',
				'calllog',
				'product',
				'project',
				'invoicereceipt',
				'task',
				'cases',
			]),
			CustomObjectCodeSchema,
		]),
		data: z.array(FieldMapSchema).min(1).max(20),
	})
	.strict()
	.superRefine((input, ctx) => {
		const itemSchema =
			FIREBERRY_BATCH_CREATE_ITEM_SCHEMAS[
				batchSchemaResource(input.objectCode)
			];
		if (!itemSchema) return;
		input.data.forEach((item, index) => {
			const parsed = itemSchema.safeParse(item);
			if (parsed.success) return;
			for (const issue of parsed.error.issues) {
				ctx.addIssue({
					code: 'custom',
					path: ['data', index, ...issue.path],
					message: issue.message,
				});
			}
		});
	});
const BatchUpdateInputSchema = z
	.object({
		objectCode: z.union([
			z.enum([
				'account',
				'activitylog',
				'article',
				'accountproduct',
				'businessunit',
				'campaign',
				'competitor',
				'contact',
				'contract',
				'invoicecredit',
				'invoicedelivery',
				'invoicedraft',
				'invoiceno',
				'invoicereno',
				'activity',
				'opportunity',
				'crmorder',
				'crmorderitem',
				'calllog',
				'product',
				'project',
				'invoicereceipt',
				'task',
				'cases',
				'crmuser',
			]),
			CustomObjectCodeSchema,
		]),
		data: z
			.array(
				z.object({ id: z.string().min(1), record: FieldMapSchema }).strict(),
			)
			.min(1)
			.max(20),
	})
	.strict()
	.superRefine((input, ctx) => {
		const recordSchema =
			FIREBERRY_BATCH_UPDATE_RECORD_SCHEMAS[
				batchSchemaResource(input.objectCode)
			];
		if (!recordSchema) return;
		input.data.forEach((entry, index) => {
			const parsed = recordSchema.safeParse(entry.record);
			if (parsed.success) return;
			for (const issue of parsed.error.issues) {
				ctx.addIssue({
					code: 'custom',
					path: ['data', index, 'record', ...issue.path],
					message: issue.message,
				});
			}
		});
	});
const BatchDeleteInputSchema = z
	.object({
		objectCode: z.union([
			z.enum([
				'account',
				'activitylog',
				'article',
				'accountproduct',
				'businessunit',
				'campaign',
				'competitor',
				'contact',
				'contract',
				'activity',
				'note',
				'opportunity',
				'crmorderitem',
				'calllog',
				'product',
				'project',
				'task',
				'cases',
			]),
			CustomObjectCodeSchema,
		]),
		ids: z.array(z.string().min(1)).min(1).max(20),
	})
	.strict();
// Batch API response bodies are undocumented on create/update and empty for delete.
const BatchResponseSchema = z.object({}).passthrough();
// Fireberry's Batch delete endpoint may return an empty body after deletion.
const BatchDeleteResponseSchema = z.union([
	z.object({}).passthrough(),
	z.undefined(),
	z.literal(''),
]);
const EmptyResponseSchema = z.object({}).passthrough();
const BATCH_SCHEMA_RESOURCE_ALIASES: Record<string, string> = {
	accountproduct: 'asset',
	invoicecredit: 'creditInvoice',
	invoicedelivery: 'deliveryInvoice',
	invoicedraft: 'draftInvoice',
	invoiceno: 'invoice',
	invoicereno: 'invoiceReceipt',
	activity: 'meeting',
	crmorder: 'order',
	crmorderitem: 'orderItem',
	calllog: 'phoneCall',
	invoicereceipt: 'receipt',
	cases: 'ticket',
	crmuser: 'user',
};
function batchSchemaResource(resourceCode: string): string {
	return BATCH_SCHEMA_RESOURCE_ALIASES[resourceCode] ?? resourceCode;
}
const QueryFieldSchema = z
	.object({
		name: z.string().min(1),
		alias: z.string().optional(),
		aggrFunc: z.enum(['SUM', 'COUNT', 'MIN', 'MAX']).optional(),
	})
	.strict()
	.superRefine((field, ctx) => {
		if (field.alias !== undefined && field.aggrFunc === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['alias'],
				message: 'alias requires aggrFunc',
			});
		}
	});
const QueryFilterValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.array(z.union([z.string(), z.number()])),
]);
const QueryConditionSchema = z
	.object({
		fieldName: z.string().min(1),
		operator: z.enum([
			'eq',
			'ne',
			'lt',
			'gt',
			'le',
			'ge',
			'start-with',
			'not-start-with',
			'is-null',
			'is-not-null',
			'eq-in',
			'not-in',
			'between',
			'userid',
		]),
		value: QueryFilterValueSchema.optional(),
	})
	.strict()
	.superRefine((condition, ctx) => {
		const valueFree = ['is-null', 'is-not-null', 'userid'].includes(
			condition.operator,
		);
		const arrayValue = ['eq-in', 'not-in', 'between'].includes(
			condition.operator,
		);
		if (valueFree && condition.value !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['value'],
				message: `${condition.operator} does not accept a value`,
			});
		}
		if (!valueFree && condition.value === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['value'],
				message: `${condition.operator} requires a value`,
			});
		}
		if (
			condition.operator === 'between' &&
			Array.isArray(condition.value) &&
			condition.value.length !== 2
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['value'],
				message: 'between requires exactly two values',
			});
		}
		if (
			arrayValue &&
			condition.value !== undefined &&
			!Array.isArray(condition.value)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['value'],
				message: `${condition.operator} requires an array value`,
			});
		}
		if (!arrayValue && !valueFree && Array.isArray(condition.value)) {
			ctx.addIssue({
				code: 'custom',
				path: ['value'],
				message: `${condition.operator} requires a scalar value`,
			});
		}
	});
const QueryInputSchema = z
	.object({
		objectType: z.number().int(),
		fields: z.array(QueryFieldSchema).min(1),
		filter: z
			.array(
				z
					.object({
						type: z.enum(['AND', 'OR']),
						conditions: z.array(QueryConditionSchema),
					})
					.strict(),
			)
			.optional(),
		orderBy: z
			.array(
				z
					.object({
						name: z.string(),
						order: z.enum(['asc', 'desc']).optional(),
					})
					.strict(),
			)
			.optional(),
		groupBy: z
			.array(
				z
					.object({
						name: z.string(),
						datePeriod: z
							.enum([
								'HOUR',
								'DAY',
								'WEEK',
								'MONTH',
								'QUARTER',
								'YEAR',
								'HOUR_PART',
								'DAY_PART',
								'WEEK_PART',
								'MONTH_PART',
								'QUARTER_PART',
								'DAY_OF_WEEK',
							])
							.optional(),
					})
					.strict(),
			)
			.optional(),
		pageNumber: z.number().int().min(1).optional(),
		pageSize: z.number().int().min(1).max(500).optional(),
	})
	.strict()
	.superRefine((query, ctx) => {
		const aggregateFields = query.fields.filter(
			(field) => field.aggrFunc !== undefined,
		);
		if (aggregateFields.length > 0 && query.groupBy === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['groupBy'],
				message: 'Aggregation functions require groupBy',
			});
		}
		if (!query.groupBy) return;
		const groupNames = new Set(query.groupBy.map((field) => field.name));
		query.fields.forEach((field, index) => {
			if (field.aggrFunc === undefined && !groupNames.has(field.name)) {
				ctx.addIssue({
					code: 'custom',
					path: ['fields', index],
					message: 'Non-aggregated fields must be included in groupBy',
				});
			}
		});
		query.orderBy?.forEach((field, index) => {
			if (!groupNames.has(field.name)) {
				ctx.addIssue({
					code: 'custom',
					path: ['orderBy', index],
					message: 'orderBy fields must be included in groupBy',
				});
			}
		});
	});
const LegacyQueryInputSchema = z
	.object({
		objecttype: z.number().int(),
		fields: z.string().optional(),
		query: z.string().optional(),
		sort_by: z.string().optional(),
		sort_type: z.enum(['asc', 'desc']).optional(),
		page_size: z.number().int().min(1).max(50).optional(),
		page_number: z.number().int().min(1).max(10).optional(),
	})
	.strict();
const RelatedRecordsInputSchema = z
	.object({
		objectType: z.number().int(),
		id: z.string().min(1),
		relatedObjectType: z.number().int(),
		pageSize: z.number().int().min(1).max(50).optional(),
		pageNumber: z.number().int().min(1).max(10).optional(),
	})
	.strict();
const RelatedItemsInputSchema = z
	.object({
		itemType: z.enum([
			'creditInvoice',
			'invoice',
			'order',
			'receipt',
			'invoiceReceiptItems',
			'invoiceReceiptReceipts',
		]),
		id: z.string().min(1),
	})
	.strict();

const CustomFieldTypeSchema = z.enum([
	'text',
	'emailaddress',
	'url',
	'phonenumber',
	'number',
	'textarea',
	'html',
	'date',
	'datetime',
	'lookup',
	'summary',
	'formula',
	'picklist',
]);
const AdditionalPropertySchema = z.enum(['required', 'readonly']);
const UpdateAdditionalPropertySchema = z.enum(['none', 'required', 'readonly']);
const TextCreateDataSchema = z
	.object({
		fieldName: z.string().regex(/^pcf/),
		label: z.string(),
		autoComplete: z.boolean().optional(),
		defaultValue: z.string().optional(),
		follow: z.boolean().optional(),
		maxLength: z.number().int().min(1).max(200).optional(),
		additionalProperty: AdditionalPropertySchema.optional(),
	})
	.strict();
const TextUpdateDataSchema = z
	.object({
		label: z.string().optional(),
		autoComplete: z.boolean().optional(),
		defaultValue: z.string().optional(),
		follow: z.boolean().optional(),
		maxLength: z.number().int().min(1).max(200).optional(),
		additionalProperty: UpdateAdditionalPropertySchema.optional(),
	})
	.strict();
const BasicFieldCreateDataSchema = z
	.object({
		fieldName: z.string().regex(/^pcf/),
		label: z.string(),
		autoComplete: z.boolean().optional(),
		defaultValue: z.string().optional(),
		follow: z.boolean().optional(),
		maxLength: z.number().int().min(1).max(200).optional(),
		additionalProperty: AdditionalPropertySchema.optional(),
	})
	.strict();
const BasicFieldUpdateDataSchema = z
	.object({
		label: z.string().optional(),
		autoComplete: z.boolean().optional(),
		defaultValue: z.string().optional(),
		follow: z.boolean().optional(),
		maxLength: z.number().int().min(1).max(200).optional(),
		additionalProperty: UpdateAdditionalPropertySchema.optional(),
	})
	.strict();
const NumberCreateDataSchema = z
	.object({
		fieldName: z.string().regex(/^pcf/),
		label: z.string(),
		precision: z.number().int().min(0).max(4),
		defaultValue: z.union([z.string(), z.number()]).optional(),
		follow: z.boolean().optional(),
		additionalProperty: AdditionalPropertySchema.optional(),
	})
	.strict();
const NumberUpdateDataSchema = z
	.object({
		label: z.string().optional(),
		precision: z.number().int().min(0).max(4).optional(),
		defaultValue: z.union([z.string(), z.number()]).optional(),
		follow: z.boolean().optional(),
		additionalProperty: UpdateAdditionalPropertySchema.optional(),
	})
	.strict();
const SimpleFieldCreateDataSchema = z
	.object({
		fieldName: z.string().regex(/^pcf/),
		label: z.string(),
		defaultValue: z.string().optional(),
		follow: z.boolean().optional(),
		additionalProperty: AdditionalPropertySchema.optional(),
	})
	.strict();
const SimpleFieldUpdateDataSchema = z
	.object({
		label: z.string().optional(),
		defaultValue: z.string().optional(),
		follow: z.boolean().optional(),
		additionalProperty: UpdateAdditionalPropertySchema.optional(),
	})
	.strict();
const HtmlFieldCreateDataSchema = z
	.object({
		fieldName: z.string().regex(/^pcf/),
		label: z.string(),
		follow: z.boolean().optional(),
		additionalProperty: AdditionalPropertySchema.optional(),
	})
	.strict();
const HtmlFieldUpdateDataSchema = z
	.object({
		label: z.string().optional(),
		follow: z.boolean().optional(),
		additionalProperty: UpdateAdditionalPropertySchema.optional(),
	})
	.strict();
const LookupFieldCreateDataSchema = z
	.object({
		fieldName: z.string().regex(/^pcf/),
		label: z.string(),
		relatedObjectType: z.number().int(),
		filterBy: z.string().optional(),
		defaultValue: z.string().optional(),
		follow: z.boolean().optional(),
		additionalProperty: AdditionalPropertySchema.optional(),
	})
	.strict();
const LookupFieldUpdateDataSchema = z
	.object({
		label: z.string().optional(),
		filterBy: z.string().optional(),
		defaultValue: z.string().optional(),
		follow: z.boolean().optional(),
		additionalProperty: UpdateAdditionalPropertySchema.optional(),
	})
	.strict();
const SummaryFieldCreateDataSchema = z
	.object({
		fieldName: z.string().regex(/^pcf/),
		label: z.string(),
		summarizedObjectType: z.number().int(),
		summarizedObjectField: z.string(),
		summarizedField: z.string().optional(),
		summaryType: z.enum(['max', 'min', 'count', 'sum']),
		summarizedUserId: z.string(),
		precision: z.number().int().min(0).max(4).optional(),
		follow: z.boolean().optional(),
		filter: z.array(FireberryJsonValueSchema).optional(),
	})
	.strict();
const SummaryFieldUpdateDataSchema = z
	.object({
		label: z.string().optional(),
		summarizedObjectType: z.number().int().optional(),
		summarizedObjectField: z.string().optional(),
		summarizedField: z.string().optional(),
		summaryType: z.enum(['max', 'min', 'count', 'sum']).optional(),
		summarizedUserId: z.string().optional(),
		filter: z.array(FireberryJsonValueSchema).optional(),
		precision: z.number().int().min(0).max(4).optional(),
		follow: z.boolean().optional(),
	})
	.strict();
const FormulaFieldCreateDataSchema = z
	.object({
		fieldname: z.string().regex(/^pcf/).optional(),
		fieldName: z.string().regex(/^pcf/).optional(),
		label: z.string(),
		formula: z.string(),
		fieldType: z
			.string()
			.refine(
				(value) =>
					!['lookup', 'summary', 'formula'].includes(value.toLowerCase()),
			),
		precision: z.number().int().min(0).max(4).optional(),
	})
	.strict()
	.refine(
		(value) =>
			(value.fieldname !== undefined) !== (value.fieldName !== undefined),
		'Provide exactly one fieldname spelling used in the published schema or example',
	);
const FormulaFieldUpdateDataSchema = z
	.object({
		label: z.string().optional(),
		formula: z.string().optional(),
		fieldType: z
			.string()
			.refine(
				(value) =>
					!['lookup', 'summary', 'formula'].includes(value.toLowerCase()),
			)
			.optional(),
		precision: z.number().int().min(0).max(4).optional(),
	})
	.strict();
const PicklistFieldCreateDataSchema = z
	.object({
		fieldName: z.string().regex(/^pcf/),
		label: z.string(),
		defaultValue: z.number().int().optional(),
		follow: z.boolean().optional(),
		additionalProperty: AdditionalPropertySchema.optional(),
		options: z.array(
			z
				.object({
					order: z.number().int().optional(),
					color: z.string().optional(),
					label: z.string(),
					value: z.number().int(),
				})
				.strict(),
		),
		controllerField: z
			.object({
				fieldName: z.string(),
				values: z
					.array(
						z
							.object({
								optionValue: z.number().int(),
								controllerValues: z.array(z.number().int()),
							})
							.strict(),
					)
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const CustomFieldCreateInputSchema = z.discriminatedUnion('fieldType', [
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('text'),
			data: TextCreateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('emailaddress'),
			data: BasicFieldCreateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('url'),
			data: BasicFieldCreateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('phonenumber'),
			data: BasicFieldCreateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('number'),
			data: NumberCreateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('textarea'),
			data: SimpleFieldCreateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('html'),
			data: HtmlFieldCreateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('date'),
			data: SimpleFieldCreateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('datetime'),
			data: SimpleFieldCreateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('lookup'),
			data: LookupFieldCreateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('summary'),
			data: SummaryFieldCreateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('formula'),
			data: FormulaFieldCreateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('picklist'),
			data: PicklistFieldCreateDataSchema,
		})
		.strict(),
]);
const CustomFieldUpdateInputSchema = z.discriminatedUnion('fieldType', [
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('text'),
			fieldName: z.string(),
			data: TextUpdateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('emailaddress'),
			fieldName: z.string(),
			data: BasicFieldUpdateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('url'),
			fieldName: z.string(),
			data: BasicFieldUpdateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('phonenumber'),
			fieldName: z.string(),
			data: BasicFieldUpdateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('number'),
			fieldName: z.string(),
			data: NumberUpdateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('textarea'),
			fieldName: z.string(),
			data: SimpleFieldUpdateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('html'),
			fieldName: z.string(),
			data: HtmlFieldUpdateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('date'),
			fieldName: z.string(),
			data: SimpleFieldUpdateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('lookup'),
			fieldName: z.string(),
			data: LookupFieldUpdateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('summary'),
			fieldName: z.string(),
			data: SummaryFieldUpdateDataSchema,
		})
		.strict(),
	z
		.object({
			objectType: z.number().int(),
			fieldType: z.literal('formula'),
			fieldName: z.string(),
			data: FormulaFieldUpdateDataSchema,
		})
		.strict(),
]);
const CustomFieldDeleteInputSchema = z
	.object({
		objectType: z.number().int(),
		fieldType: CustomFieldTypeSchema,
		fieldName: z.string().min(1),
	})
	.strict();
const CustomObjectCreateInputSchema = z
	.object({
		name: z.string().min(1),
		collectionname: z.string().min(1),
	})
	.strict();
const CustomObjectUpdateInputSchema = z
	.object({
		id: z.string().min(1),
		name: z.string().optional(),
		collectionname: z.string().optional(),
	})
	.strict();
const CustomObjectDeleteInputSchema = z
	.object({ id: z.string().min(1) })
	.strict();
const FileUploadInputSchema = z
	.object({
		objectId: z.string().min(1),
		recordId: z.string().min(1),
		fileName: z.string().min(1),
		fileBase64: z
			.string()
			.min(4)
			.regex(
				/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
			),
	})
	.strict();
// Metadata schemas vary by object and field, so the documented envelope is checked while data is deferred.
const MetadataDataSchema = z.unknown();
const MetadataEnvelopeSchema = z.object({
	success: z.boolean(),
	data: MetadataDataSchema,
	message: z.string(),
});
// Legacy query results vary with selected fields; the official response schema leaves data unspecified.
const LegacyQueryDataSchema = z.unknown();
const LegacyQueryResponseSchema = z.object({
	success: z.boolean(),
	data: LegacyQueryDataSchema,
	message: z.string(),
});
const ObjectsResponseSchema = z.object({
	success: z.boolean(),
	data: z.array(
		z.object({
			name: z.string(),
			systemName: z.string(),
			objectType: z.string(),
		}),
	),
	message: z.string(),
});
const FieldResponseSchema = z.object({
	success: z.boolean(),
	data: z.object({
		label: z.string(),
		fieldName: z.string(),
		systemFieldTypeId: z.string(),
		fieldObjectType: z.string(),
		systemName: z.string(),
		values: z
			.array(z.object({ name: z.string(), value: z.string() }))
			.optional(),
	}),
	message: z.string(),
});
const EmptyInputSchema = z.object({}).strict();
const RecordResourceSchema = z.enum([
	'account',
	'activitylog',
	'asset',
	'article',
	'businessunit',
	'campaign',
	'contact',
	'competitor',
	'contract',
	'creditInvoice',
	'deliveryInvoice',
	'draftInvoice',
	'invoice',
	'invoiceReceipt',
	'meeting',
	'note',
	'opportunity',
	'order',
	'orderItem',
	'phoneCall',
	'product',
	'project',
	'receipt',
	'task',
	'transaction',
	'transactionItem',
	'ticket',
	'user',
]);
const ListResourceSchema = z.union([
	RecordResourceSchema,
	CustomObjectCodeSchema,
]);
const CreateResourceSchema = z.union([
	z.enum([
		'account',
		'activitylog',
		'asset',
		'article',
		'businessunit',
		'campaign',
		'contact',
		'competitor',
		'contract',
		'creditInvoice',
		'deliveryInvoice',
		'draftInvoice',
		'invoice',
		'invoiceReceipt',
		'meeting',
		'note',
		'opportunity',
		'order',
		'orderItem',
		'phoneCall',
		'product',
		'project',
		'receipt',
		'task',
		'ticket',
	]),
	CustomObjectCodeSchema,
]);
const UpdateResourceSchema = z.union([
	z.enum([
		'account',
		'activitylog',
		'asset',
		'article',
		'businessunit',
		'campaign',
		'contact',
		'competitor',
		'contract',
		'creditInvoice',
		'deliveryInvoice',
		'draftInvoice',
		'invoice',
		'invoiceReceipt',
		'meeting',
		'opportunity',
		'order',
		'orderItem',
		'phoneCall',
		'product',
		'project',
		'receipt',
		'task',
		'ticket',
		'user',
	]),
	CustomObjectCodeSchema,
]);
const DeleteResourceSchema = z.union([
	z.enum([
		'account',
		'activitylog',
		'asset',
		'article',
		'businessunit',
		'campaign',
		'contact',
		'competitor',
		'contract',
		'meeting',
		'note',
		'opportunity',
		'orderItem',
		'phoneCall',
		'product',
		'project',
		'task',
		'ticket',
	]),
	CustomObjectCodeSchema,
]);
const ListInputSchema = z
	.object({ object: ListResourceSchema })
	.strict()
	.extend({
		pageSize: z.number().int().min(1).max(50).optional(),
		pageNumber: z.number().int().min(1).max(10).optional(),
	});
const GetInputSchema = z
	.object({ object: ListResourceSchema, id: z.string().min(1) })
	.strict();
const CreateInputSchema = z
	.object({ object: CreateResourceSchema })
	.strict()
	.extend({
		data: FieldMapSchema,
	})
	.strict()
	.superRefine((input, ctx) => {
		const recordSchema = FIREBERRY_CREATE_RECORD_SCHEMAS[input.object];
		if (!recordSchema) return;
		const parsed = recordSchema.safeParse(input.data);
		if (parsed.success) return;
		for (const issue of parsed.error.issues) {
			ctx.addIssue({
				code: 'custom',
				path: ['data', ...issue.path],
				message: issue.message,
			});
		}
	});
const UpdateInputSchema = z
	.object({ object: UpdateResourceSchema, id: z.string().min(1) })
	.strict()
	.extend({ data: FieldMapSchema })
	.strict()
	.superRefine((input, ctx) => {
		const recordSchema = FIREBERRY_UPDATE_RECORD_SCHEMAS[input.object];
		if (!recordSchema) return;
		const parsed = recordSchema.safeParse(input.data);
		if (parsed.success) return;
		for (const issue of parsed.error.issues) {
			ctx.addIssue({
				code: 'custom',
				path: ['data', ...issue.path],
				message: issue.message,
			});
		}
	});
const DeleteInputSchema = z
	.object({ object: DeleteResourceSchema, id: z.string().min(1) })
	.strict();
const MetadataObjectInputSchema = z.object({ id: z.number().int() }).strict();
const MetadataFieldInputSchema = z
	.object({ id: z.number().int(), fieldName: z.string().min(1) })
	.strict();

const endpointSchemas = {
	list: { input: ListInputSchema, output: RecordListResponseSchema },
	get: { input: GetInputSchema, output: RecordResponseSchema },
	create: { input: CreateInputSchema, output: RecordResponseSchema },
	update: { input: UpdateInputSchema, output: RecordUpdateResponseSchema },
	delete: { input: DeleteInputSchema, output: EnvelopeSchema },
	query: { input: QueryInputSchema, output: QueryResponseSchema },
	legacyQuery: {
		input: LegacyQueryInputSchema,
		output: LegacyQueryResponseSchema,
	},
	related: {
		input: RelatedRecordsInputSchema,
		output: RecordListResponseSchema,
	},
	items: { input: RelatedItemsInputSchema, output: EmptyResponseSchema },
	objects: { input: EmptyInputSchema, output: ObjectsResponseSchema },
	object: { input: MetadataObjectInputSchema, output: MetadataEnvelopeSchema },
	fields: { input: MetadataObjectInputSchema, output: MetadataEnvelopeSchema },
	field: { input: MetadataFieldInputSchema, output: FieldResponseSchema },
	picklist: {
		input: MetadataFieldInputSchema.extend({ fieldName: z.string().min(1) }),
		output: FieldResponseSchema,
	},
	customFieldCreate: {
		input: CustomFieldCreateInputSchema,
		output: EmptyResponseSchema,
	},
	customFieldUpdate: {
		input: CustomFieldUpdateInputSchema,
		output: EmptyResponseSchema,
	},
	customFieldDelete: {
		input: CustomFieldDeleteInputSchema,
		output: EmptyResponseSchema,
	},
	customObjectCreate: {
		input: CustomObjectCreateInputSchema,
		output: EmptyResponseSchema,
	},
	customObjectUpdate: {
		input: CustomObjectUpdateInputSchema,
		output: EmptyResponseSchema,
	},
	customObjectDelete: {
		input: CustomObjectDeleteInputSchema,
		output: EmptyResponseSchema,
	},
	fileUpload: {
		input: FileUploadInputSchema,
		output: FileUploadResponseSchema,
	},
	batchCreate: { input: BatchInputSchema, output: BatchResponseSchema },
	batchUpdate: { input: BatchUpdateInputSchema, output: BatchResponseSchema },
	batchDelete: {
		input: BatchDeleteInputSchema,
		output: BatchDeleteResponseSchema,
	},
} as const;

type InferInput<K extends keyof typeof endpointSchemas> = z.infer<
	(typeof endpointSchemas)[K]['input']
>;
type InferOutput<K extends keyof typeof endpointSchemas> = z.infer<
	(typeof endpointSchemas)[K]['output']
>;

export type FireberryEndpointInputs = {
	[K in keyof typeof endpointSchemas]: InferInput<K>;
};
export type FireberryEndpointOutputs = {
	[K in keyof typeof endpointSchemas]: InferOutput<K>;
};
export const FireberryEndpointInputSchemas = {
	list: endpointSchemas.list.input,
	get: endpointSchemas.get.input,
	create: endpointSchemas.create.input,
	update: endpointSchemas.update.input,
	delete: endpointSchemas.delete.input,
	query: endpointSchemas.query.input,
	legacyQuery: endpointSchemas.legacyQuery.input,
	related: endpointSchemas.related.input,
	items: endpointSchemas.items.input,
	objects: endpointSchemas.objects.input,
	object: endpointSchemas.object.input,
	fields: endpointSchemas.fields.input,
	field: endpointSchemas.field.input,
	picklist: endpointSchemas.picklist.input,
	customFieldCreate: endpointSchemas.customFieldCreate.input,
	customFieldUpdate: endpointSchemas.customFieldUpdate.input,
	customFieldDelete: endpointSchemas.customFieldDelete.input,
	customObjectCreate: endpointSchemas.customObjectCreate.input,
	customObjectUpdate: endpointSchemas.customObjectUpdate.input,
	customObjectDelete: endpointSchemas.customObjectDelete.input,
	fileUpload: endpointSchemas.fileUpload.input,
	batchCreate: endpointSchemas.batchCreate.input,
	batchUpdate: endpointSchemas.batchUpdate.input,
	batchDelete: endpointSchemas.batchDelete.input,
} as const;
export const FireberryEndpointOutputSchemas = {
	list: endpointSchemas.list.output,
	get: endpointSchemas.get.output,
	create: endpointSchemas.create.output,
	update: endpointSchemas.update.output,
	delete: endpointSchemas.delete.output,
	query: endpointSchemas.query.output,
	legacyQuery: endpointSchemas.legacyQuery.output,
	related: endpointSchemas.related.output,
	items: endpointSchemas.items.output,
	objects: endpointSchemas.objects.output,
	object: endpointSchemas.object.output,
	fields: endpointSchemas.fields.output,
	field: endpointSchemas.field.output,
	picklist: endpointSchemas.picklist.output,
	customFieldCreate: endpointSchemas.customFieldCreate.output,
	customFieldUpdate: endpointSchemas.customFieldUpdate.output,
	customFieldDelete: endpointSchemas.customFieldDelete.output,
	customObjectCreate: endpointSchemas.customObjectCreate.output,
	customObjectUpdate: endpointSchemas.customObjectUpdate.output,
	customObjectDelete: endpointSchemas.customObjectDelete.output,
	fileUpload: endpointSchemas.fileUpload.output,
	batchCreate: endpointSchemas.batchCreate.output,
	batchUpdate: endpointSchemas.batchUpdate.output,
	batchDelete: endpointSchemas.batchDelete.output,
} as const;
