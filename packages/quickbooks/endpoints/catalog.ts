import { Buffer } from 'node:buffer';
import type { CorsairContext } from 'corsair/core';
import type { BinaryResponse } from 'corsair/http';
import { z } from 'zod';
import type {
	QuickBooksEnvironment,
	QuickBooksRequestOptions,
} from '../client';
import { makeAuthenticatedQuickBooksRequest } from '../client';
import { lazySchema, lazySchemaEntry } from './lazy-schema';
import { QuickBooksModelSchemas } from './models';
import { requestSchema, responseSchema } from './schema-mode';

const RealmIdSchema = z.string().regex(/^\d+$/);
const IdSchema = z.string().min(1);
const SyncTokenSchema = z.string().min(1);
const DeleteBodySchema = z
	.object({ Id: IdSchema, SyncToken: SyncTokenSchema })
	.strict();
const VoidBodySchema = z
	.object({
		Id: IdSchema,
		SyncToken: SyncTokenSchema,
		sparse: z.literal(true).optional(),
	})
	.strict();
const BinarySchema = z
	.object({
		kind: z.literal('binary'),
		contentType: z.string(),
		base64: z.string(),
		sizeBytes: z.number().int().nonnegative(),
	})
	.strict();
export type QuickBooksCatalogContext = CorsairContext & {
	key: string;
	_refreshAuth?: () => Promise<string>;
	options: { environment: QuickBooksEnvironment };
};
type CatalogRequest = {
	path: string;
	method?: string;
	query?: Record<string, string | number | boolean | undefined>;
	body?: object;
	formData?: Record<string, string | Blob | Array<string | Blob> | undefined>;
	headers?: Record<string, string>;
	responseType?: 'binary';
	basePath?: 'v3' | 'manage';
};
type CatalogDefinition<I extends z.ZodType, O extends z.ZodType> = {
	input: () => I;
	output: () => O;
	request: (input: z.output<I>) => CatalogRequest;
	kind?: 'json' | 'binary';
};
function defineEndpoint<I extends z.ZodType, O extends z.ZodType>(
	definition: CatalogDefinition<I, O>,
) {
	return async (
		ctx: QuickBooksCatalogContext,
		rawInput: z.input<I>,
	): Promise<z.output<O>> => {
		const input = requestSchema(definition.input()).parse(
			rawInput,
		) as z.output<I>;
		const { path, ...request } = definition.request(input);
		const requestOptions: QuickBooksRequestOptions = {
			...request,
			method: request.method === 'POST' ? 'POST' : 'GET',
		};
		if (definition.kind === 'binary') {
			const result = await makeAuthenticatedQuickBooksRequest<BinaryResponse>(
				ctx,
				path,
				{ ...requestOptions, responseType: 'binary' },
				ctx.options.environment,
			);
			return definition.output().parse({
				kind: 'binary',
				contentType: result.contentType ?? 'application/octet-stream',
				base64: Buffer.from(result.bytes).toString('base64'),
				sizeBytes: result.bytes.byteLength,
			});
		}
		// unknown because the shared transport returns untrusted provider JSON or text before the operation-specific output schema validates it.
		const result: unknown = await makeAuthenticatedQuickBooksRequest<unknown>(
			ctx,
			path,
			requestOptions,
			ctx.options.environment,
		);
		return responseSchema(
			definition.output(),
			requestOptions.method === 'GET',
		).parse(result) as z.output<O>;
	};
}

const apAgingDetail_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['agedpayabledetailquery']
				.partial()
				.optional(),
		})
		.strict(),
);
const apAgingDetail_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const apAgingDetail_listDef = {
	input: apAgingDetail_listInput,
	output: apAgingDetail_listOutput,
	request: (input: z.output<ReturnType<typeof apAgingDetail_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/AgedPayableDetail`,
		method: 'GET',
		query: {
			shipvia: input.params?.['shipvia'],
			term: input.params?.['term'],
			end_duedate: input.params?.['end_duedate'],
			accounting_method: input.params?.['accounting_method'],
			start_duedate: input.params?.['start_duedate'],
			custom1: input.params?.['custom1'],
			custom2: input.params?.['custom2'],
			custom3: input.params?.['custom3'],
			report_date: input.params?.['report_date'],
			num_periods: input.params?.['num_periods'],
			vendor: input.params?.['vendor'],
			past_due: input.params?.['past_due'],
			aging_period: input.params?.['aging_period'],
			columns: input.params?.['columns'],
		},
	}),
} as const;
const apAgingDetail_listEndpoint = defineEndpoint(apAgingDetail_listDef);

const apAgingSummary_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['agedpayablesquery'].partial().optional(),
		})
		.strict(),
);
const apAgingSummary_listOutput = lazySchema(
	() => QuickBooksModelSchemas['agedpayablestoplevel'],
);
const apAgingSummary_listDef = {
	input: apAgingSummary_listInput,
	output: apAgingSummary_listOutput,
	request: (input: z.output<ReturnType<typeof apAgingSummary_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/AgedPayables`,
		method: 'GET',
		query: {
			customer: input.params?.['customer'],
			qzurl: input.params?.['qzurl'],
			vendor: input.params?.['vendor'],
			date_macro: input.params?.['date_macro'],
			department: input.params?.['department'],
			report_date: input.params?.['report_date'],
			sort_order: input.params?.['sort_order'],
			aging_method: input.params?.['aging_method'],
		},
	}),
} as const;
const apAgingSummary_listEndpoint = defineEndpoint(apAgingSummary_listDef);

const arAgingDetail_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['agedreceivabledetailquery']
				.partial()
				.optional(),
		})
		.strict(),
);
const arAgingDetail_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const arAgingDetail_listDef = {
	input: arAgingDetail_listInput,
	output: arAgingDetail_listOutput,
	request: (input: z.output<ReturnType<typeof arAgingDetail_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/AgedReceivableDetail`,
		method: 'GET',
		query: {
			customer: input.params?.['customer'],
			shipvia: input.params?.['shipvia'],
			term: input.params?.['term'],
			end_duedate: input.params?.['end_duedate'],
			start_duedate: input.params?.['start_duedate'],
			custom1: input.params?.['custom1'],
			custom2: input.params?.['custom2'],
			custom3: input.params?.['custom3'],
			report_date: input.params?.['report_date'],
			num_periods: input.params?.['num_periods'],
			aging_method: input.params?.['aging_method'],
			past_due: input.params?.['past_due'],
			aging_period: input.params?.['aging_period'],
			columns: input.params?.['columns'],
		},
	}),
} as const;
const arAgingDetail_listEndpoint = defineEndpoint(arAgingDetail_listDef);

const arAgingSummary_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['agedreceivablesquery']
				.partial()
				.optional(),
		})
		.strict(),
);
const arAgingSummary_listOutput = lazySchema(
	() => QuickBooksModelSchemas['agedreceivablestoplevel'],
);
const arAgingSummary_listDef = {
	input: arAgingSummary_listInput,
	output: arAgingSummary_listOutput,
	request: (input: z.output<ReturnType<typeof arAgingSummary_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/AgedReceivables`,
		method: 'GET',
		query: {
			customer: input.params?.['customer'],
			qzurl: input.params?.['qzurl'],
			date_macro: input.params?.['date_macro'],
			aging_method: input.params?.['aging_method'],
			report_date: input.params?.['report_date'],
			sort_order: input.params?.['sort_order'],
			department: input.params?.['department'],
		},
	}),
} as const;
const arAgingSummary_listEndpoint = defineEndpoint(arAgingSummary_listDef);

const accounts_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['accountresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const accounts_updateOutput = lazySchema(() =>
	z
		.object({
			Account: QuickBooksModelSchemas['accountresponse'],
			time: z.string(),
		})
		.strict(),
);
const accounts_updateDef = {
	input: accounts_updateInput,
	output: accounts_updateOutput,
	request: (input: z.output<ReturnType<typeof accounts_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/account`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const accounts_updateEndpoint = defineEndpoint(accounts_updateDef);

const accountListDetail_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['accountlistquery'].partial().optional(),
		})
		.strict(),
);
const accountListDetail_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const accountListDetail_listDef = {
	input: accountListDetail_listInput,
	output: accountListDetail_listOutput,
	request: (
		input: z.output<ReturnType<typeof accountListDetail_listInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/AccountList`,
		method: 'GET',
		query: {
			account_type: input.params?.['account_type'],
			end_date: input.params?.['end_date'],
			start_moddate: input.params?.['start_moddate'],
			sort_by: input.params?.['sort_by'],
			sort_order: input.params?.['sort_order'],
			moddate_macro: input.params?.['moddate_macro'],
			end_moddate: input.params?.['end_moddate'],
			account_status: input.params?.['account_status'],
			createdate_macro: input.params?.['createdate_macro'],
			start_date: input.params?.['start_date'],
			columns: input.params?.['columns'],
		},
	}),
} as const;
const accountListDetail_listEndpoint = defineEndpoint(
	accountListDetail_listDef,
);

const attachable_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['attachablerequest'],
		})
		.strict(),
);
const attachable_createOutput = lazySchema(() =>
	z
		.object({
			Attachable: QuickBooksModelSchemas['attachableresponse'],
			time: z.string(),
		})
		.strict(),
);
const attachable_createDef = {
	input: attachable_createInput,
	output: attachable_createOutput,
	request: (input: z.output<ReturnType<typeof attachable_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/attachable`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const attachable_createEndpoint = defineEndpoint(attachable_createDef);

const attachable_deleteInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['attachableresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const attachable_deleteOutput = lazySchema(() =>
	z
		.object({
			Attachable: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const attachable_deleteDef = {
	input: attachable_deleteInput,
	output: attachable_deleteOutput,
	request: (input: z.output<ReturnType<typeof attachable_deleteInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/attachable`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const attachable_deleteEndpoint = defineEndpoint(attachable_deleteDef);

const attachable_downloadInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, attachableId: IdSchema }).strict(),
);
const attachable_downloadOutput = lazySchema(() => z.string().url());
const attachable_downloadDef = {
	input: attachable_downloadInput,
	output: attachable_downloadOutput,
	request: (input: z.output<ReturnType<typeof attachable_downloadInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/download/${encodeURIComponent(input.attachableId)}`,
		method: 'GET',
		headers: { Accept: 'text/plain' },
	}),
} as const;
const attachable_downloadEndpoint = defineEndpoint(attachable_downloadDef);

const attachable_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const attachable_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					Attachable: z
						.array(QuickBooksModelSchemas['attachableresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const attachable_listDef = {
	input: attachable_listInput,
	output: attachable_listOutput,
	request: (input: z.output<ReturnType<typeof attachable_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Attachable${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const attachable_listEndpoint = defineEndpoint(attachable_listDef);

const attachable_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, attachableId: IdSchema }).strict(),
);
const attachable_getOutput = lazySchema(() =>
	z
		.object({
			Attachable: QuickBooksModelSchemas['attachableresponse'],
			time: z.string(),
		})
		.strict(),
);
const attachable_getDef = {
	input: attachable_getInput,
	output: attachable_getOutput,
	request: (input: z.output<ReturnType<typeof attachable_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/attachable/${encodeURIComponent(input.attachableId)}`,
		method: 'GET',
	}),
} as const;
const attachable_getEndpoint = defineEndpoint(attachable_getDef);

const attachable_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['attachableresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const attachable_updateOutput = lazySchema(() =>
	z
		.object({
			Attachable: QuickBooksModelSchemas['attachableresponse'],
			time: z.string(),
		})
		.strict(),
);
const attachable_updateDef = {
	input: attachable_updateInput,
	output: attachable_updateOutput,
	request: (input: z.output<ReturnType<typeof attachable_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/attachable`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const attachable_updateEndpoint = defineEndpoint(attachable_updateDef);

const attachable_uploadInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			fileName: z.string().min(1).max(255),
			contentType: z.string().min(1),
			base64Content: z
				.string()
				.min(4)
				.max(132000000)
				.regex(
					/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
				),
			metadata: QuickBooksModelSchemas['attachablerequest']
				.partial()
				.optional(),
		})
		.strict(),
);
const attachable_uploadOutput = lazySchema(() =>
	z
		.object({
			AttachableResponse: z.array(
				z
					.object({
						Attachable: QuickBooksModelSchemas['attachableresponse'].optional(),
						Fault: z
							.object({
								type: z.string().optional(),
								Error: z
									.array(
										z
											.object({
												Message: z.string().optional(),
												Detail: z.string().optional(),
												code: z.string().optional(),
												element: z.string().optional(),
											})
											.strict(),
									)
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
			),
			time: z.string(),
		})
		.strict(),
);
const attachable_uploadDef = {
	input: attachable_uploadInput,
	output: attachable_uploadOutput,
	request: (input: z.output<ReturnType<typeof attachable_uploadInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/upload`,
		method: 'POST',
		formData: {
			file_metadata_01: new Blob(
				[
					JSON.stringify({
						...(input.metadata || {}),
						FileName: input.fileName,
						ContentType: input.contentType,
					}),
				],
				{ type: 'application/json' },
			),
			file_content_01: new Blob(
				[Uint8Array.from(Buffer.from(input.base64Content, 'base64'))],
				{ type: input.contentType },
			),
		},
	}),
} as const;
const attachable_uploadEndpoint = defineEndpoint(attachable_uploadDef);

const balanceSheet_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['balancesheetquery'].partial().optional(),
		})
		.strict(),
);
const balanceSheet_listOutput = lazySchema(
	() => QuickBooksModelSchemas['balancesheetreporttoplevel'],
);
const balanceSheet_listDef = {
	input: balanceSheet_listInput,
	output: balanceSheet_listOutput,
	request: (input: z.output<ReturnType<typeof balanceSheet_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/BalanceSheet`,
		method: 'GET',
		query: {
			customer: input.params?.['customer'],
			qzurl: input.params?.['qzurl'],
			accounting_method: input.params?.['accounting_method'],
			end_date: input.params?.['end_date'],
			date_macro: input.params?.['date_macro'],
			adjusted_gain_loss: input.params?.['adjusted_gain_loss'],
			class: input.params?.['class'],
			item: input.params?.['item'],
			sort_order: input.params?.['sort_order'],
			summarize_column_by: input.params?.['summarize_column_by'],
			department: input.params?.['department'],
			vendor: input.params?.['vendor'],
			start_date: input.params?.['start_date'],
		},
	}),
} as const;
const balanceSheet_listEndpoint = defineEndpoint(balanceSheet_listDef);

const bill_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['billrequest'],
		})
		.strict(),
);
const bill_createOutput = lazySchema(() =>
	z
		.object({ Bill: QuickBooksModelSchemas['billresponse'], time: z.string() })
		.strict(),
);
const bill_createDef = {
	input: bill_createInput,
	output: bill_createOutput,
	request: (input: z.output<ReturnType<typeof bill_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/bill`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const bill_createEndpoint = defineEndpoint(bill_createDef);

const bill_deleteInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: DeleteBodySchema }).strict(),
);
const bill_deleteOutput = lazySchema(() =>
	z
		.object({
			Bill: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const bill_deleteDef = {
	input: bill_deleteInput,
	output: bill_deleteOutput,
	request: (input: z.output<ReturnType<typeof bill_deleteInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/bill`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const bill_deleteEndpoint = defineEndpoint(bill_deleteDef);

const bill_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const bill_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					Bill: z.array(QuickBooksModelSchemas['billresponse']).optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const bill_listDef = {
	input: bill_listInput,
	output: bill_listOutput,
	request: (input: z.output<ReturnType<typeof bill_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Bill${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const bill_listEndpoint = defineEndpoint(bill_listDef);

const bill_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, billId: IdSchema }).strict(),
);
const bill_getOutput = lazySchema(() =>
	z
		.object({ Bill: QuickBooksModelSchemas['billresponse'], time: z.string() })
		.strict(),
);
const bill_getDef = {
	input: bill_getInput,
	output: bill_getOutput,
	request: (input: z.output<ReturnType<typeof bill_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/bill/${encodeURIComponent(input.billId)}`,
		method: 'GET',
	}),
} as const;
const bill_getEndpoint = defineEndpoint(bill_getDef);

const bill_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['billresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const bill_updateOutput = lazySchema(() =>
	z
		.object({ Bill: QuickBooksModelSchemas['billresponse'], time: z.string() })
		.strict(),
);
const bill_updateDef = {
	input: bill_updateInput,
	output: bill_updateOutput,
	request: (input: z.output<ReturnType<typeof bill_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/bill`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const bill_updateEndpoint = defineEndpoint(bill_updateDef);

const billPayment_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['billpaymentrequest'],
		})
		.strict(),
);
const billPayment_createOutput = lazySchema(() =>
	z
		.object({
			BillPayment: QuickBooksModelSchemas['billpaymentresponse'],
			time: z.string(),
		})
		.strict(),
);
const billPayment_createDef = {
	input: billPayment_createInput,
	output: billPayment_createOutput,
	request: (input: z.output<ReturnType<typeof billPayment_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/billpayment`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const billPayment_createEndpoint = defineEndpoint(billPayment_createDef);

const billPayment_voidInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: VoidBodySchema }).strict(),
);
const billPayment_voidOutput = lazySchema(() =>
	z
		.object({
			BillPayment: QuickBooksModelSchemas['billpaymentresponse'],
			time: z.string(),
		})
		.strict(),
);
const billPayment_voidDef = {
	input: billPayment_voidInput,
	output: billPayment_voidOutput,
	request: (input: z.output<ReturnType<typeof billPayment_voidInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/billpayment`,
		method: 'POST',
		query: { operation: 'update', include: 'void' },
		body: input.body,
	}),
} as const;
const billPayment_voidEndpoint = defineEndpoint(billPayment_voidDef);

const billPayment_deleteInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: DeleteBodySchema }).strict(),
);
const billPayment_deleteOutput = lazySchema(() =>
	z
		.object({
			BillPayment: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const billPayment_deleteDef = {
	input: billPayment_deleteInput,
	output: billPayment_deleteOutput,
	request: (input: z.output<ReturnType<typeof billPayment_deleteInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/billpayment`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const billPayment_deleteEndpoint = defineEndpoint(billPayment_deleteDef);

const billPayment_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const billPayment_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					BillPayment: z
						.array(QuickBooksModelSchemas['billpaymentresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const billPayment_listDef = {
	input: billPayment_listInput,
	output: billPayment_listOutput,
	request: (input: z.output<ReturnType<typeof billPayment_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM BillPayment${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const billPayment_listEndpoint = defineEndpoint(billPayment_listDef);

const billPayment_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, billpaymentId: IdSchema }).strict(),
);
const billPayment_getOutput = lazySchema(() =>
	z
		.object({
			BillPayment: QuickBooksModelSchemas['billpaymentresponse'],
			time: z.string(),
		})
		.strict(),
);
const billPayment_getDef = {
	input: billPayment_getInput,
	output: billPayment_getOutput,
	request: (input: z.output<ReturnType<typeof billPayment_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/billpayment/${encodeURIComponent(input.billpaymentId)}`,
		method: 'GET',
	}),
} as const;
const billPayment_getEndpoint = defineEndpoint(billPayment_getDef);

const billPayment_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['billpaymentresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const billPayment_updateOutput = lazySchema(() =>
	z
		.object({
			BillPayment: QuickBooksModelSchemas['billpaymentresponse'],
			time: z.string(),
		})
		.strict(),
);
const billPayment_updateDef = {
	input: billPayment_updateInput,
	output: billPayment_updateOutput,
	request: (input: z.output<ReturnType<typeof billPayment_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/billpayment`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const billPayment_updateEndpoint = defineEndpoint(billPayment_updateDef);

const budget_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['budgetrequest'],
		})
		.strict(),
);
const budget_createOutput = lazySchema(() =>
	z
		.object({
			Budget: QuickBooksModelSchemas['budgetresponse'],
			time: z.string(),
		})
		.strict(),
);
const budget_createDef = {
	input: budget_createInput,
	output: budget_createOutput,
	request: (input: z.output<ReturnType<typeof budget_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/budget`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const budget_createEndpoint = defineEndpoint(budget_createDef);

const budget_deleteInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: DeleteBodySchema }).strict(),
);
const budget_deleteOutput = lazySchema(() =>
	z
		.object({
			Budget: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const budget_deleteDef = {
	input: budget_deleteInput,
	output: budget_deleteOutput,
	request: (input: z.output<ReturnType<typeof budget_deleteInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/budget`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const budget_deleteEndpoint = defineEndpoint(budget_deleteDef);

const budget_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const budget_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					Budget: z.array(QuickBooksModelSchemas['budgetresponse']).optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const budget_listDef = {
	input: budget_listInput,
	output: budget_listOutput,
	request: (input: z.output<ReturnType<typeof budget_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Budget${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const budget_listEndpoint = defineEndpoint(budget_listDef);

const budget_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, budgetId: IdSchema }).strict(),
);
const budget_getOutput = lazySchema(() =>
	z
		.object({
			Budget: QuickBooksModelSchemas['budgetresponse'],
			time: z.string(),
		})
		.strict(),
);
const budget_getDef = {
	input: budget_getInput,
	output: budget_getOutput,
	request: (input: z.output<ReturnType<typeof budget_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/budget/${encodeURIComponent(input.budgetId)}`,
		method: 'GET',
	}),
} as const;
const budget_getEndpoint = defineEndpoint(budget_getDef);

const budget_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['budgetresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const budget_updateOutput = lazySchema(() =>
	z
		.object({
			Budget: QuickBooksModelSchemas['budgetresponse'],
			time: z.string(),
		})
		.strict(),
);
const budget_updateDef = {
	input: budget_updateInput,
	output: budget_updateOutput,
	request: (input: z.output<ReturnType<typeof budget_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/budget`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const budget_updateEndpoint = defineEndpoint(budget_updateDef);

const cashFlow_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['cashflowquery'].partial().optional(),
		})
		.strict(),
);
const cashFlow_listOutput = lazySchema(
	() => QuickBooksModelSchemas['cashflowtoplevel'],
);
const cashFlow_listDef = {
	input: cashFlow_listInput,
	output: cashFlow_listOutput,
	request: (input: z.output<ReturnType<typeof cashFlow_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/CashFlow`,
		method: 'GET',
		query: {
			customer: input.params?.['customer'],
			vendor: input.params?.['vendor'],
			end_date: input.params?.['end_date'],
			date_macro: input.params?.['date_macro'],
			class: input.params?.['class'],
			item: input.params?.['item'],
			sort_order: input.params?.['sort_order'],
			summarize_column_by: input.params?.['summarize_column_by'],
			department: input.params?.['department'],
			start_date: input.params?.['start_date'],
		},
	}),
} as const;
const cashFlow_listEndpoint = defineEndpoint(cashFlow_listDef);

const changeOrder_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['changeorderrequest'],
		})
		.strict(),
);
const changeOrder_createOutput = lazySchema(() =>
	z
		.object({
			ChangeOrder: QuickBooksModelSchemas['changeorderresponse'],
			time: z.string(),
		})
		.strict(),
);
const changeOrder_createDef = {
	input: changeOrder_createInput,
	output: changeOrder_createOutput,
	request: (input: z.output<ReturnType<typeof changeOrder_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/changeorder`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const changeOrder_createEndpoint = defineEndpoint(changeOrder_createDef);

const changeOrder_deleteInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: DeleteBodySchema }).strict(),
);
const changeOrder_deleteOutput = lazySchema(() =>
	z
		.object({
			ChangeOrder: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const changeOrder_deleteDef = {
	input: changeOrder_deleteInput,
	output: changeOrder_deleteOutput,
	request: (input: z.output<ReturnType<typeof changeOrder_deleteInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/changeorder`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const changeOrder_deleteEndpoint = defineEndpoint(changeOrder_deleteDef);

const changeOrder_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, changeorderId: IdSchema }).strict(),
);
const changeOrder_getOutput = lazySchema(() =>
	z
		.object({
			ChangeOrder: QuickBooksModelSchemas['changeorderresponse'],
			time: z.string(),
		})
		.strict(),
);
const changeOrder_getDef = {
	input: changeOrder_getInput,
	output: changeOrder_getOutput,
	request: (input: z.output<ReturnType<typeof changeOrder_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/changeorder/${encodeURIComponent(input.changeorderId)}`,
		method: 'GET',
	}),
} as const;
const changeOrder_getEndpoint = defineEndpoint(changeOrder_getDef);

const changeOrder_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['changeorderresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const changeOrder_updateOutput = lazySchema(() =>
	z
		.object({
			ChangeOrder: QuickBooksModelSchemas['changeorderresponse'],
			time: z.string(),
		})
		.strict(),
);
const changeOrder_updateDef = {
	input: changeOrder_updateInput,
	output: changeOrder_updateOutput,
	request: (input: z.output<ReturnType<typeof changeOrder_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/changeorder`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const changeOrder_updateEndpoint = defineEndpoint(changeOrder_updateDef);

const class_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['classrequest'],
		})
		.strict(),
);
const class_createOutput = lazySchema(() =>
	z
		.object({
			Class: QuickBooksModelSchemas['classresponse'],
			time: z.string(),
		})
		.strict(),
);
const class_createDef = {
	input: class_createInput,
	output: class_createOutput,
	request: (input: z.output<ReturnType<typeof class_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/class`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const class_createEndpoint = defineEndpoint(class_createDef);

const class_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const class_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					Class: z.array(QuickBooksModelSchemas['classresponse']).optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const class_listDef = {
	input: class_listInput,
	output: class_listOutput,
	request: (input: z.output<ReturnType<typeof class_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Class${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const class_listEndpoint = defineEndpoint(class_listDef);

const class_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, classId: IdSchema }).strict(),
);
const class_getOutput = lazySchema(() =>
	z
		.object({
			Class: QuickBooksModelSchemas['classresponse'],
			time: z.string(),
		})
		.strict(),
);
const class_getDef = {
	input: class_getInput,
	output: class_getOutput,
	request: (input: z.output<ReturnType<typeof class_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/class/${encodeURIComponent(input.classId)}`,
		method: 'GET',
	}),
} as const;
const class_getEndpoint = defineEndpoint(class_getDef);

const class_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['classresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const class_updateOutput = lazySchema(() =>
	z
		.object({
			Class: QuickBooksModelSchemas['classresponse'],
			time: z.string(),
		})
		.strict(),
);
const class_updateDef = {
	input: class_updateInput,
	output: class_updateOutput,
	request: (input: z.output<ReturnType<typeof class_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/class`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const class_updateEndpoint = defineEndpoint(class_updateDef);

const companyCurrency_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['companycurrencyrequest'],
		})
		.strict(),
);
const companyCurrency_createOutput = lazySchema(() =>
	z
		.object({
			CompanyCurrency: QuickBooksModelSchemas['companycurrencyresponse'],
			time: z.string(),
		})
		.strict(),
);
const companyCurrency_createDef = {
	input: companyCurrency_createInput,
	output: companyCurrency_createOutput,
	request: (
		input: z.output<ReturnType<typeof companyCurrency_createInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/companycurrency`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const companyCurrency_createEndpoint = defineEndpoint(
	companyCurrency_createDef,
);

const companyCurrency_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const companyCurrency_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					CompanyCurrency: z
						.array(QuickBooksModelSchemas['companycurrencyresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const companyCurrency_listDef = {
	input: companyCurrency_listInput,
	output: companyCurrency_listOutput,
	request: (input: z.output<ReturnType<typeof companyCurrency_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM CompanyCurrency${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const companyCurrency_listEndpoint = defineEndpoint(companyCurrency_listDef);

const companyCurrency_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, companycurrencyId: IdSchema }).strict(),
);
const companyCurrency_getOutput = lazySchema(() =>
	z
		.object({
			CompanyCurrency: QuickBooksModelSchemas['companycurrencyresponse'],
			time: z.string(),
		})
		.strict(),
);
const companyCurrency_getDef = {
	input: companyCurrency_getInput,
	output: companyCurrency_getOutput,
	request: (input: z.output<ReturnType<typeof companyCurrency_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/companycurrency/${encodeURIComponent(input.companycurrencyId)}`,
		method: 'GET',
	}),
} as const;
const companyCurrency_getEndpoint = defineEndpoint(companyCurrency_getDef);

const companyCurrency_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['companycurrencyresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const companyCurrency_updateOutput = lazySchema(() =>
	z
		.object({
			CompanyCurrency: QuickBooksModelSchemas['companycurrencyresponse'],
			time: z.string(),
		})
		.strict(),
);
const companyCurrency_updateDef = {
	input: companyCurrency_updateInput,
	output: companyCurrency_updateOutput,
	request: (
		input: z.output<ReturnType<typeof companyCurrency_updateInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/companycurrency`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const companyCurrency_updateEndpoint = defineEndpoint(
	companyCurrency_updateDef,
);

const company_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['companyinforesponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const company_updateOutput = lazySchema(() =>
	z
		.object({
			CompanyInfo: QuickBooksModelSchemas['companyinforesponse'],
			time: z.string(),
		})
		.strict(),
);
const company_updateDef = {
	input: company_updateInput,
	output: company_updateOutput,
	request: (input: z.output<ReturnType<typeof company_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/companyinfo`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const company_updateEndpoint = defineEndpoint(company_updateDef);

const company_sparseUpdateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['companyinforesponse']
				.partial()
				.extend({
					Id: IdSchema,
					SyncToken: SyncTokenSchema,
					sparse: z.literal(true),
				})
				.strict(),
		})
		.strict(),
);
const company_sparseUpdateOutput = lazySchema(() =>
	z
		.object({
			CompanyInfo: QuickBooksModelSchemas['companyinforesponse'],
			time: z.string(),
		})
		.strict(),
);
const company_sparseUpdateDef = {
	input: company_sparseUpdateInput,
	output: company_sparseUpdateOutput,
	request: (input: z.output<ReturnType<typeof company_sparseUpdateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/companyinfo`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const company_sparseUpdateEndpoint = defineEndpoint(company_sparseUpdateDef);

const creditCardPayment_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['creditcardpaymentrequest'],
		})
		.strict(),
);
const creditCardPayment_createOutput = lazySchema(() =>
	z
		.object({
			CreditCardPaymentTxn: QuickBooksModelSchemas['creditcardpaymentresponse'],
			time: z.string(),
		})
		.strict(),
);
const creditCardPayment_createDef = {
	input: creditCardPayment_createInput,
	output: creditCardPayment_createOutput,
	request: (
		input: z.output<ReturnType<typeof creditCardPayment_createInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditcardpayment`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const creditCardPayment_createEndpoint = defineEndpoint(
	creditCardPayment_createDef,
);

const creditCardPayment_deleteInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['creditcardpaymentresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const creditCardPayment_deleteOutput = lazySchema(() =>
	z
		.object({
			CreditCardPaymentTxn: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const creditCardPayment_deleteDef = {
	input: creditCardPayment_deleteInput,
	output: creditCardPayment_deleteOutput,
	request: (
		input: z.output<ReturnType<typeof creditCardPayment_deleteInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditcardpayment`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const creditCardPayment_deleteEndpoint = defineEndpoint(
	creditCardPayment_deleteDef,
);

const creditCardPayment_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const creditCardPayment_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					CreditCardPaymentTxn: z
						.array(QuickBooksModelSchemas['creditcardpaymentresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const creditCardPayment_listDef = {
	input: creditCardPayment_listInput,
	output: creditCardPayment_listOutput,
	request: (
		input: z.output<ReturnType<typeof creditCardPayment_listInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM CreditCardPayment${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const creditCardPayment_listEndpoint = defineEndpoint(
	creditCardPayment_listDef,
);

const creditCardPayment_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, creditcardpaymentId: IdSchema }).strict(),
);
const creditCardPayment_getOutput = lazySchema(() =>
	z
		.object({
			CreditCardPaymentTxn: QuickBooksModelSchemas['creditcardpaymentresponse'],
			time: z.string(),
		})
		.strict(),
);
const creditCardPayment_getDef = {
	input: creditCardPayment_getInput,
	output: creditCardPayment_getOutput,
	request: (
		input: z.output<ReturnType<typeof creditCardPayment_getInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditcardpayment/${encodeURIComponent(input.creditcardpaymentId)}`,
		method: 'GET',
	}),
} as const;
const creditCardPayment_getEndpoint = defineEndpoint(creditCardPayment_getDef);

const creditCardPayment_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['creditcardpaymentrequest']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const creditCardPayment_updateOutput = lazySchema(() =>
	z
		.object({
			CreditCardPaymentTxn: QuickBooksModelSchemas['creditcardpaymentresponse'],
			time: z.string(),
		})
		.strict(),
);
const creditCardPayment_updateDef = {
	input: creditCardPayment_updateInput,
	output: creditCardPayment_updateOutput,
	request: (
		input: z.output<ReturnType<typeof creditCardPayment_updateInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditcardpayment`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const creditCardPayment_updateEndpoint = defineEndpoint(
	creditCardPayment_updateDef,
);

const creditCardPayment_sparseUpdateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['creditcardpaymentrequest']
				.partial()
				.extend({
					Id: IdSchema,
					SyncToken: SyncTokenSchema,
					sparse: z.literal(true),
				})
				.strict(),
		})
		.strict(),
);
const creditCardPayment_sparseUpdateOutput = lazySchema(() =>
	z
		.object({
			CreditCardPaymentTxn: QuickBooksModelSchemas['creditcardpaymentresponse'],
			time: z.string(),
		})
		.strict(),
);
const creditCardPayment_sparseUpdateDef = {
	input: creditCardPayment_sparseUpdateInput,
	output: creditCardPayment_sparseUpdateOutput,
	request: (
		input: z.output<ReturnType<typeof creditCardPayment_sparseUpdateInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditcardpayment`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const creditCardPayment_sparseUpdateEndpoint = defineEndpoint(
	creditCardPayment_sparseUpdateDef,
);

const creditMemo_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['creditmemorequest'],
		})
		.strict(),
);
const creditMemo_createOutput = lazySchema(() =>
	z
		.object({
			CreditMemo: QuickBooksModelSchemas['creditmemoresponse'],
			time: z.string(),
		})
		.strict(),
);
const creditMemo_createDef = {
	input: creditMemo_createInput,
	output: creditMemo_createOutput,
	request: (input: z.output<ReturnType<typeof creditMemo_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditmemo`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const creditMemo_createEndpoint = defineEndpoint(creditMemo_createDef);

const creditMemo_deleteInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: DeleteBodySchema }).strict(),
);
const creditMemo_deleteOutput = lazySchema(() =>
	z
		.object({
			CreditMemo: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const creditMemo_deleteDef = {
	input: creditMemo_deleteInput,
	output: creditMemo_deleteOutput,
	request: (input: z.output<ReturnType<typeof creditMemo_deleteInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditmemo`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const creditMemo_deleteEndpoint = defineEndpoint(creditMemo_deleteDef);

const creditMemo_getPdfInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, creditmemoId: IdSchema }).strict(),
);
const creditMemo_getPdfOutput = lazySchema(() => BinarySchema);
const creditMemo_getPdfDef = {
	input: creditMemo_getPdfInput,
	output: creditMemo_getPdfOutput,
	kind: 'binary',
	request: (input: z.output<ReturnType<typeof creditMemo_getPdfInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditmemo/${encodeURIComponent(input.creditmemoId)}/pdf`,
		method: 'GET',
		headers: { Accept: 'application/pdf' },
	}),
} as const;
const creditMemo_getPdfEndpoint = defineEndpoint(creditMemo_getPdfDef);

const creditMemo_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const creditMemo_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					CreditMemo: z
						.array(QuickBooksModelSchemas['creditmemoresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const creditMemo_listDef = {
	input: creditMemo_listInput,
	output: creditMemo_listOutput,
	request: (input: z.output<ReturnType<typeof creditMemo_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM CreditMemo${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const creditMemo_listEndpoint = defineEndpoint(creditMemo_listDef);

const creditMemo_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, creditmemoId: IdSchema }).strict(),
);
const creditMemo_getOutput = lazySchema(() =>
	z
		.object({
			CreditMemo: QuickBooksModelSchemas['creditmemoresponse'],
			time: z.string(),
		})
		.strict(),
);
const creditMemo_getDef = {
	input: creditMemo_getInput,
	output: creditMemo_getOutput,
	request: (input: z.output<ReturnType<typeof creditMemo_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditmemo/${encodeURIComponent(input.creditmemoId)}`,
		method: 'GET',
	}),
} as const;
const creditMemo_getEndpoint = defineEndpoint(creditMemo_getDef);

const creditMemo_sendInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			creditmemoId: IdSchema,
			sendTo: z.string().email().optional(),
		})
		.strict(),
);
const creditMemo_sendOutput = lazySchema(() =>
	z
		.object({
			CreditMemo: QuickBooksModelSchemas['creditmemoresponse'],
			time: z.string(),
		})
		.strict(),
);
const creditMemo_sendDef = {
	input: creditMemo_sendInput,
	output: creditMemo_sendOutput,
	request: (input: z.output<ReturnType<typeof creditMemo_sendInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditmemo/${encodeURIComponent(input.creditmemoId)}/send`,
		method: 'POST',
		query: { sendTo: input.sendTo },
		headers: { Accept: 'application/json' },
	}),
} as const;
const creditMemo_sendEndpoint = defineEndpoint(creditMemo_sendDef);

const creditMemo_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['creditmemoresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const creditMemo_updateOutput = lazySchema(() =>
	z
		.object({
			CreditMemo: QuickBooksModelSchemas['creditmemoresponse'],
			time: z.string(),
		})
		.strict(),
);
const creditMemo_updateDef = {
	input: creditMemo_updateInput,
	output: creditMemo_updateOutput,
	request: (input: z.output<ReturnType<typeof creditMemo_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditmemo`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const creditMemo_updateEndpoint = defineEndpoint(creditMemo_updateDef);

const customer_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['customerrequest'],
		})
		.strict(),
);
const customer_createOutput = lazySchema(() =>
	z
		.object({
			Customer: QuickBooksModelSchemas['customerresponse'],
			time: z.string(),
		})
		.strict(),
);
const customer_createDef = {
	input: customer_createInput,
	output: customer_createOutput,
	request: (input: z.output<ReturnType<typeof customer_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/customer`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const customer_createEndpoint = defineEndpoint(customer_createDef);

const customer_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const customer_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					Customer: z
						.array(QuickBooksModelSchemas['customerresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const customer_listDef = {
	input: customer_listInput,
	output: customer_listOutput,
	request: (input: z.output<ReturnType<typeof customer_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Customer${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const customer_listEndpoint = defineEndpoint(customer_listDef);

const customer_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, customerId: IdSchema }).strict(),
);
const customer_getOutput = lazySchema(() =>
	z
		.object({
			Customer: QuickBooksModelSchemas['customerresponse'],
			time: z.string(),
		})
		.strict(),
);
const customer_getDef = {
	input: customer_getInput,
	output: customer_getOutput,
	request: (input: z.output<ReturnType<typeof customer_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/customer/${encodeURIComponent(input.customerId)}`,
		method: 'GET',
	}),
} as const;
const customer_getEndpoint = defineEndpoint(customer_getDef);

const customer_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['customerresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const customer_updateOutput = lazySchema(() =>
	z
		.object({
			Customer: QuickBooksModelSchemas['customerresponse'],
			time: z.string(),
		})
		.strict(),
);
const customer_updateDef = {
	input: customer_updateInput,
	output: customer_updateOutput,
	request: (input: z.output<ReturnType<typeof customer_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/customer`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const customer_updateEndpoint = defineEndpoint(customer_updateDef);

const customer_sparseUpdateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['customerresponse']
				.partial()
				.extend({
					Id: IdSchema,
					SyncToken: SyncTokenSchema,
					sparse: z.literal(true),
				})
				.strict(),
		})
		.strict(),
);
const customer_sparseUpdateOutput = lazySchema(() =>
	z
		.object({
			Customer: QuickBooksModelSchemas['customerresponse'],
			time: z.string(),
		})
		.strict(),
);
const customer_sparseUpdateDef = {
	input: customer_sparseUpdateInput,
	output: customer_sparseUpdateOutput,
	request: (
		input: z.output<ReturnType<typeof customer_sparseUpdateInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/customer`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const customer_sparseUpdateEndpoint = defineEndpoint(customer_sparseUpdateDef);

const customerBalance_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['customerbalancequery']
				.partial()
				.optional(),
		})
		.strict(),
);
const customerBalance_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const customerBalance_listDef = {
	input: customerBalance_listInput,
	output: customerBalance_listOutput,
	request: (input: z.output<ReturnType<typeof customerBalance_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/CustomerBalance`,
		method: 'GET',
		query: {
			customer: input.params?.['customer'],
			accounting_method: input.params?.['accounting_method'],
			date_macro: input.params?.['date_macro'],
			arpaid: input.params?.['arpaid'],
			report_date: input.params?.['report_date'],
			sort_order: input.params?.['sort_order'],
			summarize_column_by: input.params?.['summarize_column_by'],
			department: input.params?.['department'],
		},
	}),
} as const;
const customerBalance_listEndpoint = defineEndpoint(customerBalance_listDef);

const customerBalanceDetail_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['customerbalancedetailquery']
				.partial()
				.optional(),
		})
		.strict(),
);
const customerBalanceDetail_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const customerBalanceDetail_listDef = {
	input: customerBalanceDetail_listInput,
	output: customerBalanceDetail_listOutput,
	request: (
		input: z.output<ReturnType<typeof customerBalanceDetail_listInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/CustomerBalanceDetail`,
		method: 'GET',
		query: {
			customer: input.params?.['customer'],
			shipvia: input.params?.['shipvia'],
			term: input.params?.['term'],
			end_duedate: input.params?.['end_duedate'],
			start_duedate: input.params?.['start_duedate'],
			custom1: input.params?.['custom1'],
			sort_by: input.params?.['sort_by'],
			arpaid: input.params?.['arpaid'],
			report_date: input.params?.['report_date'],
			sort_order: input.params?.['sort_order'],
			aging_method: input.params?.['aging_method'],
			department: input.params?.['department'],
			columns: input.params?.['columns'],
		},
	}),
} as const;
const customerBalanceDetail_listEndpoint = defineEndpoint(
	customerBalanceDetail_listDef,
);

const customerIncome_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['customerincomequery']
				.partial()
				.optional(),
		})
		.strict(),
);
const customerIncome_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const customerIncome_listDef = {
	input: customerIncome_listInput,
	output: customerIncome_listOutput,
	request: (input: z.output<ReturnType<typeof customerIncome_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/CustomerIncome`,
		method: 'GET',
		query: {
			customer: input.params?.['customer'],
			term: input.params?.['term'],
			accounting_method: input.params?.['accounting_method'],
			end_date: input.params?.['end_date'],
			date_macro: input.params?.['date_macro'],
			class: input.params?.['class'],
			sort_order: input.params?.['sort_order'],
			summarize_column_by: input.params?.['summarize_column_by'],
			department: input.params?.['department'],
			vendor: input.params?.['vendor'],
			start_date: input.params?.['start_date'],
		},
	}),
} as const;
const customerIncome_listEndpoint = defineEndpoint(customerIncome_listDef);

const customerType_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const customerType_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					CustomerType: z
						.array(QuickBooksModelSchemas['customertyperesponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const customerType_listDef = {
	input: customerType_listInput,
	output: customerType_listOutput,
	request: (input: z.output<ReturnType<typeof customerType_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM CustomerType${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const customerType_listEndpoint = defineEndpoint(customerType_listDef);

const customerType_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, id: IdSchema }).strict(),
);
const customerType_getOutput = lazySchema(() =>
	z
		.object({
			CustomerType: QuickBooksModelSchemas['customertyperesponse'],
			time: z.string(),
		})
		.strict(),
);
const customerType_getDef = {
	input: customerType_getInput,
	output: customerType_getOutput,
	request: (input: z.output<ReturnType<typeof customerType_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/customertype/${encodeURIComponent(input.id)}`,
		method: 'GET',
	}),
} as const;
const customerType_getEndpoint = defineEndpoint(customerType_getDef);

const department_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['departmentrequest'],
		})
		.strict(),
);
const department_createOutput = lazySchema(() =>
	z
		.object({
			Department: QuickBooksModelSchemas['departmentresponse'],
			time: z.string(),
		})
		.strict(),
);
const department_createDef = {
	input: department_createInput,
	output: department_createOutput,
	request: (input: z.output<ReturnType<typeof department_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/department`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const department_createEndpoint = defineEndpoint(department_createDef);

const department_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const department_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					Department: z
						.array(QuickBooksModelSchemas['departmentresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const department_listDef = {
	input: department_listInput,
	output: department_listOutput,
	request: (input: z.output<ReturnType<typeof department_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Department${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const department_listEndpoint = defineEndpoint(department_listDef);

const department_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, departmentId: IdSchema }).strict(),
);
const department_getOutput = lazySchema(() =>
	z
		.object({
			Department: QuickBooksModelSchemas['departmentresponse'],
			time: z.string(),
		})
		.strict(),
);
const department_getDef = {
	input: department_getInput,
	output: department_getOutput,
	request: (input: z.output<ReturnType<typeof department_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/department/${encodeURIComponent(input.departmentId)}`,
		method: 'GET',
	}),
} as const;
const department_getEndpoint = defineEndpoint(department_getDef);

const department_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['departmentresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const department_updateOutput = lazySchema(() =>
	z
		.object({
			Department: QuickBooksModelSchemas['departmentresponse'],
			time: z.string(),
		})
		.strict(),
);
const department_updateDef = {
	input: department_updateInput,
	output: department_updateOutput,
	request: (input: z.output<ReturnType<typeof department_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/department`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const department_updateEndpoint = defineEndpoint(department_updateDef);

const deposit_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['depositrequest'],
		})
		.strict(),
);
const deposit_createOutput = lazySchema(() =>
	z
		.object({
			Deposit: QuickBooksModelSchemas['depositresponse'],
			time: z.string(),
		})
		.strict(),
);
const deposit_createDef = {
	input: deposit_createInput,
	output: deposit_createOutput,
	request: (input: z.output<ReturnType<typeof deposit_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/deposit`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const deposit_createEndpoint = defineEndpoint(deposit_createDef);

const deposit_deleteInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: DeleteBodySchema }).strict(),
);
const deposit_deleteOutput = lazySchema(() =>
	z
		.object({
			Deposit: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const deposit_deleteDef = {
	input: deposit_deleteInput,
	output: deposit_deleteOutput,
	request: (input: z.output<ReturnType<typeof deposit_deleteInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/deposit`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const deposit_deleteEndpoint = defineEndpoint(deposit_deleteDef);

const deposit_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const deposit_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					Deposit: z
						.array(QuickBooksModelSchemas['depositresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const deposit_listDef = {
	input: deposit_listInput,
	output: deposit_listOutput,
	request: (input: z.output<ReturnType<typeof deposit_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Deposit${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const deposit_listEndpoint = defineEndpoint(deposit_listDef);

const deposit_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, depositId: IdSchema }).strict(),
);
const deposit_getOutput = lazySchema(() =>
	z
		.object({
			Deposit: QuickBooksModelSchemas['depositresponse'],
			time: z.string(),
		})
		.strict(),
);
const deposit_getDef = {
	input: deposit_getInput,
	output: deposit_getOutput,
	request: (input: z.output<ReturnType<typeof deposit_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/deposit/${encodeURIComponent(input.depositId)}`,
		method: 'GET',
	}),
} as const;
const deposit_getEndpoint = defineEndpoint(deposit_getDef);

const deposit_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['depositresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const deposit_updateOutput = lazySchema(() =>
	z
		.object({
			Deposit: QuickBooksModelSchemas['depositresponse'],
			time: z.string(),
		})
		.strict(),
);
const deposit_updateDef = {
	input: deposit_updateInput,
	output: deposit_updateOutput,
	request: (input: z.output<ReturnType<typeof deposit_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/deposit`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const deposit_updateEndpoint = defineEndpoint(deposit_updateDef);

const deposit_sparseUpdateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['depositresponse']
				.partial()
				.extend({
					Id: IdSchema,
					SyncToken: SyncTokenSchema,
					sparse: z.literal(true),
				})
				.strict(),
		})
		.strict(),
);
const deposit_sparseUpdateOutput = lazySchema(() =>
	z
		.object({
			Deposit: QuickBooksModelSchemas['depositresponse'],
			time: z.string(),
		})
		.strict(),
);
const deposit_sparseUpdateDef = {
	input: deposit_sparseUpdateInput,
	output: deposit_sparseUpdateOutput,
	request: (input: z.output<ReturnType<typeof deposit_sparseUpdateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/deposit`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const deposit_sparseUpdateEndpoint = defineEndpoint(deposit_sparseUpdateDef);

const employee_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['employeerequest'],
		})
		.strict(),
);
const employee_createOutput = lazySchema(() =>
	z
		.object({
			Employee: QuickBooksModelSchemas['employeeresponse'],
			time: z.string(),
		})
		.strict(),
);
const employee_createDef = {
	input: employee_createInput,
	output: employee_createOutput,
	request: (input: z.output<ReturnType<typeof employee_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/employee`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const employee_createEndpoint = defineEndpoint(employee_createDef);

const employee_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const employee_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					Employee: z
						.array(QuickBooksModelSchemas['employeeresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const employee_listDef = {
	input: employee_listInput,
	output: employee_listOutput,
	request: (input: z.output<ReturnType<typeof employee_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Employee${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const employee_listEndpoint = defineEndpoint(employee_listDef);

const employee_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, employeeId: IdSchema }).strict(),
);
const employee_getOutput = lazySchema(() =>
	z
		.object({
			Employee: QuickBooksModelSchemas['employeeresponse'],
			time: z.string(),
		})
		.strict(),
);
const employee_getDef = {
	input: employee_getInput,
	output: employee_getOutput,
	request: (input: z.output<ReturnType<typeof employee_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/employee/${encodeURIComponent(input.employeeId)}`,
		method: 'GET',
	}),
} as const;
const employee_getEndpoint = defineEndpoint(employee_getDef);

const employee_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['employeeresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const employee_updateOutput = lazySchema(() =>
	z
		.object({
			Employee: QuickBooksModelSchemas['employeeresponse'],
			time: z.string(),
		})
		.strict(),
);
const employee_updateDef = {
	input: employee_updateInput,
	output: employee_updateOutput,
	request: (input: z.output<ReturnType<typeof employee_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/employee`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const employee_updateEndpoint = defineEndpoint(employee_updateDef);

const estimate_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['estimaterequest'],
		})
		.strict(),
);
const estimate_createOutput = lazySchema(() =>
	z
		.object({
			Estimate: QuickBooksModelSchemas['estimateresponse'],
			time: z.string(),
		})
		.strict(),
);
const estimate_createDef = {
	input: estimate_createInput,
	output: estimate_createOutput,
	request: (input: z.output<ReturnType<typeof estimate_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/estimate`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const estimate_createEndpoint = defineEndpoint(estimate_createDef);

const estimate_deleteInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: DeleteBodySchema }).strict(),
);
const estimate_deleteOutput = lazySchema(() =>
	z
		.object({
			Estimate: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const estimate_deleteDef = {
	input: estimate_deleteInput,
	output: estimate_deleteOutput,
	request: (input: z.output<ReturnType<typeof estimate_deleteInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/estimate`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const estimate_deleteEndpoint = defineEndpoint(estimate_deleteDef);

const estimate_getPdfInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, estimateId: IdSchema }).strict(),
);
const estimate_getPdfOutput = lazySchema(() => BinarySchema);
const estimate_getPdfDef = {
	input: estimate_getPdfInput,
	output: estimate_getPdfOutput,
	kind: 'binary',
	request: (input: z.output<ReturnType<typeof estimate_getPdfInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/estimate/${encodeURIComponent(input.estimateId)}/pdf`,
		method: 'GET',
		headers: { Accept: 'application/pdf' },
	}),
} as const;
const estimate_getPdfEndpoint = defineEndpoint(estimate_getPdfDef);

const estimate_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const estimate_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					Estimate: z
						.array(QuickBooksModelSchemas['estimateresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const estimate_listDef = {
	input: estimate_listInput,
	output: estimate_listOutput,
	request: (input: z.output<ReturnType<typeof estimate_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Estimate${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const estimate_listEndpoint = defineEndpoint(estimate_listDef);

const estimate_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, estimateId: IdSchema }).strict(),
);
const estimate_getOutput = lazySchema(() =>
	z
		.object({
			Estimate: QuickBooksModelSchemas['estimateresponse'],
			time: z.string(),
		})
		.strict(),
);
const estimate_getDef = {
	input: estimate_getInput,
	output: estimate_getOutput,
	request: (input: z.output<ReturnType<typeof estimate_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/estimate/${encodeURIComponent(input.estimateId)}`,
		method: 'GET',
	}),
} as const;
const estimate_getEndpoint = defineEndpoint(estimate_getDef);

const estimate_sendInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			estimateId: IdSchema,
			sendTo: z.string().email().optional(),
		})
		.strict(),
);
const estimate_sendOutput = lazySchema(() =>
	z
		.object({
			Estimate: QuickBooksModelSchemas['estimateresponse'],
			time: z.string(),
		})
		.strict(),
);
const estimate_sendDef = {
	input: estimate_sendInput,
	output: estimate_sendOutput,
	request: (input: z.output<ReturnType<typeof estimate_sendInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/estimate/${encodeURIComponent(input.estimateId)}/send`,
		method: 'POST',
		query: { sendTo: input.sendTo },
		headers: { Accept: 'application/json' },
	}),
} as const;
const estimate_sendEndpoint = defineEndpoint(estimate_sendDef);

const estimate_sparseUpdateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['estimateresponse']
				.partial()
				.extend({
					Id: IdSchema,
					SyncToken: SyncTokenSchema,
					sparse: z.literal(true),
				})
				.strict(),
		})
		.strict(),
);
const estimate_sparseUpdateOutput = lazySchema(() =>
	z
		.object({
			Estimate: QuickBooksModelSchemas['estimateresponse'],
			time: z.string(),
		})
		.strict(),
);
const estimate_sparseUpdateDef = {
	input: estimate_sparseUpdateInput,
	output: estimate_sparseUpdateOutput,
	request: (
		input: z.output<ReturnType<typeof estimate_sparseUpdateInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/estimate`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const estimate_sparseUpdateEndpoint = defineEndpoint(estimate_sparseUpdateDef);

const estimate_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['estimateresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const estimate_updateOutput = lazySchema(() =>
	z
		.object({
			Estimate: QuickBooksModelSchemas['estimateresponse'],
			time: z.string(),
		})
		.strict(),
);
const estimate_updateDef = {
	input: estimate_updateInput,
	output: estimate_updateOutput,
	request: (input: z.output<ReturnType<typeof estimate_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/estimate`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const estimate_updateEndpoint = defineEndpoint(estimate_updateDef);

const exchangerate_getInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			currencyCode: z.string().regex(/^[A-Z]{3}$/),
			asOfDate: z.string().date().optional(),
		})
		.strict(),
);
const exchangerate_getOutput = lazySchema(() =>
	z
		.object({
			ExchangeRate: QuickBooksModelSchemas['exchangerateresponse'],
			time: z.string(),
		})
		.strict(),
);
const exchangerate_getDef = {
	input: exchangerate_getInput,
	output: exchangerate_getOutput,
	request: (input: z.output<ReturnType<typeof exchangerate_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/exchangerate`,
		method: 'GET',
		query: { sourcecurrencycode: input.currencyCode, asofdate: input.asOfDate },
	}),
} as const;
const exchangerate_getEndpoint = defineEndpoint(exchangerate_getDef);

const exchangerate_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const exchangerate_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					ExchangeRate: z
						.array(QuickBooksModelSchemas['exchangerateresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const exchangerate_listDef = {
	input: exchangerate_listInput,
	output: exchangerate_listOutput,
	request: (input: z.output<ReturnType<typeof exchangerate_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Exchangerate${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const exchangerate_listEndpoint = defineEndpoint(exchangerate_listDef);

const exchangerate_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			// Exchange rates have no Id: the currency and date identify the rate.
			body: QuickBooksModelSchemas['exchangerateresponse']
				.extend({
					SyncToken: SyncTokenSchema,
					SourceCurrencyCode: z.string().regex(/^[A-Z]{3}$/),
					Rate: z.number().positive(),
				})
				.strict(),
		})
		.strict(),
);
const exchangerate_updateOutput = lazySchema(() =>
	z
		.object({
			ExchangeRate: QuickBooksModelSchemas['exchangerateresponse'],
			time: z.string(),
		})
		.strict(),
);
const exchangerate_updateDef = {
	input: exchangerate_updateInput,
	output: exchangerate_updateOutput,
	request: (input: z.output<ReturnType<typeof exchangerate_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/exchangerate`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const exchangerate_updateEndpoint = defineEndpoint(exchangerate_updateDef);

const generalLedger_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['generalledgerquery'].partial().optional(),
		})
		.strict(),
);
const generalLedger_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const generalLedger_listDef = {
	input: generalLedger_listInput,
	output: generalLedger_listOutput,
	request: (input: z.output<ReturnType<typeof generalLedger_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/GeneralLedger`,
		method: 'GET',
		query: {
			customer: input.params?.['customer'],
			account: input.params?.['account'],
			accounting_method: input.params?.['accounting_method'],
			source_account: input.params?.['source_account'],
			end_date: input.params?.['end_date'],
			date_macro: input.params?.['date_macro'],
			account_type: input.params?.['account_type'],
			sort_by: input.params?.['sort_by'],
			sort_order: input.params?.['sort_order'],
			start_date: input.params?.['start_date'],
			summarize_column_by: input.params?.['summarize_column_by'],
			department: input.params?.['department'],
			vendor: input.params?.['vendor'],
			class: input.params?.['class'],
			columns: input.params?.['columns'],
		},
	}),
} as const;
const generalLedger_listEndpoint = defineEndpoint(generalLedger_listDef);

const inventoryAdjustment_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['inventoryadjustmentcreaterequest'],
		})
		.strict(),
);
const inventoryAdjustment_createOutput = lazySchema(() =>
	z
		.object({
			InventoryAdjustment:
				QuickBooksModelSchemas['inventoryadjustmentresponse'],
			time: z.string(),
		})
		.strict(),
);
const inventoryAdjustment_createDef = {
	input: inventoryAdjustment_createInput,
	output: inventoryAdjustment_createOutput,
	request: (
		input: z.output<ReturnType<typeof inventoryAdjustment_createInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/inventoryadjustment`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const inventoryAdjustment_createEndpoint = defineEndpoint(
	inventoryAdjustment_createDef,
);

const inventoryAdjustment_deleteInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: DeleteBodySchema,
		})
		.strict(),
);
const inventoryAdjustment_deleteOutput = lazySchema(() =>
	z
		.object({
			InventoryAdjustment: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const inventoryAdjustment_deleteDef = {
	input: inventoryAdjustment_deleteInput,
	output: inventoryAdjustment_deleteOutput,
	request: (
		input: z.output<ReturnType<typeof inventoryAdjustment_deleteInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/inventoryadjustment`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const inventoryAdjustment_deleteEndpoint = defineEndpoint(
	inventoryAdjustment_deleteDef,
);

const inventoryAdjustment_getInput = lazySchema(() =>
	z
		.object({ realmId: RealmIdSchema, inventoryadjustmentId: IdSchema })
		.strict(),
);
const inventoryAdjustment_getOutput = lazySchema(() =>
	z
		.object({
			InventoryAdjustment:
				QuickBooksModelSchemas['inventoryadjustmentresponse'],
			time: z.string(),
		})
		.strict(),
);
const inventoryAdjustment_getDef = {
	input: inventoryAdjustment_getInput,
	output: inventoryAdjustment_getOutput,
	request: (
		input: z.output<ReturnType<typeof inventoryAdjustment_getInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/inventoryadjustment/${encodeURIComponent(input.inventoryadjustmentId)}`,
		method: 'GET',
	}),
} as const;
const inventoryAdjustment_getEndpoint = defineEndpoint(
	inventoryAdjustment_getDef,
);

const inventoryAdjustment_sparseUpdateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['inventoryadjustmentrequest']
				.partial()
				.extend({
					Id: IdSchema,
					SyncToken: SyncTokenSchema,
					sparse: z.literal(true),
				})
				.strict(),
		})
		.strict(),
);
const inventoryAdjustment_sparseUpdateOutput = lazySchema(() =>
	z
		.object({
			InventoryAdjustment:
				QuickBooksModelSchemas['inventoryadjustmentresponse'],
			time: z.string(),
		})
		.strict(),
);
const inventoryAdjustment_sparseUpdateDef = {
	input: inventoryAdjustment_sparseUpdateInput,
	output: inventoryAdjustment_sparseUpdateOutput,
	request: (
		input: z.output<ReturnType<typeof inventoryAdjustment_sparseUpdateInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/inventoryadjustment`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const inventoryAdjustment_sparseUpdateEndpoint = defineEndpoint(
	inventoryAdjustment_sparseUpdateDef,
);

const inventoryValuationDetail_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['inventoryvaluationdetailquery']
				.partial()
				.optional(),
		})
		.strict(),
);
const inventoryValuationDetail_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const inventoryValuationDetail_listDef = {
	input: inventoryValuationDetail_listInput,
	output: inventoryValuationDetail_listOutput,
	request: (
		input: z.output<ReturnType<typeof inventoryValuationDetail_listInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/InventoryValuationDetail`,
		method: 'GET',
		query: {
			end_date: input.params?.['end_date'],
			end_svcdate: input.params?.['end_svcdate'],
			date_macro: input.params?.['date_macro'],
			svcdate_macro: input.params?.['svcdate_macro'],
			start_svcdate: input.params?.['start_svcdate'],
			group_by: input.params?.['group_by'],
			start_date: input.params?.['start_date'],
			columns: input.params?.['columns'],
		},
	}),
} as const;
const inventoryValuationDetail_listEndpoint = defineEndpoint(
	inventoryValuationDetail_listDef,
);

const inventoryValuationSummary_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['inventoryvaluationquery']
				.partial()
				.optional(),
		})
		.strict(),
);
const inventoryValuationSummary_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const inventoryValuationSummary_listDef = {
	input: inventoryValuationSummary_listInput,
	output: inventoryValuationSummary_listOutput,
	request: (
		input: z.output<ReturnType<typeof inventoryValuationSummary_listInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/InventoryValuationSummary`,
		method: 'GET',
		query: {
			qzurl: input.params?.['qzurl'],
			date_macro: input.params?.['date_macro'],
			item: input.params?.['item'],
			report_date: input.params?.['report_date'],
			sort_order: input.params?.['sort_order'],
			summarize_column_by: input.params?.['summarize_column_by'],
		},
	}),
} as const;
const inventoryValuationSummary_listEndpoint = defineEndpoint(
	inventoryValuationSummary_listDef,
);

const invoice_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['invoicerequest'],
		})
		.strict(),
);
const invoice_createOutput = lazySchema(() =>
	z
		.object({
			Invoice: QuickBooksModelSchemas['invoiceresponse'],
			time: z.string(),
		})
		.strict(),
);
const invoice_createDef = {
	input: invoice_createInput,
	output: invoice_createOutput,
	request: (input: z.output<ReturnType<typeof invoice_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/invoice`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const invoice_createEndpoint = defineEndpoint(invoice_createDef);

const invoice_deleteInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: DeleteBodySchema }).strict(),
);
const invoice_deleteOutput = lazySchema(() =>
	z
		.object({
			Invoice: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const invoice_deleteDef = {
	input: invoice_deleteInput,
	output: invoice_deleteOutput,
	request: (input: z.output<ReturnType<typeof invoice_deleteInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/invoice`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const invoice_deleteEndpoint = defineEndpoint(invoice_deleteDef);

const invoice_voidInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: VoidBodySchema }).strict(),
);
const invoice_voidOutput = lazySchema(() =>
	z
		.object({
			Invoice: QuickBooksModelSchemas['invoiceresponse'],
			time: z.string(),
		})
		.strict(),
);
const invoice_voidDef = {
	input: invoice_voidInput,
	output: invoice_voidOutput,
	request: (input: z.output<ReturnType<typeof invoice_voidInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/invoice`,
		method: 'POST',
		query: { operation: 'void' },
		body: input.body,
	}),
} as const;
const invoice_voidEndpoint = defineEndpoint(invoice_voidDef);

const invoice_getPdfInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, invoiceId: IdSchema }).strict(),
);
const invoice_getPdfOutput = lazySchema(() => BinarySchema);
const invoice_getPdfDef = {
	input: invoice_getPdfInput,
	output: invoice_getPdfOutput,
	kind: 'binary',
	request: (input: z.output<ReturnType<typeof invoice_getPdfInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/invoice/${encodeURIComponent(input.invoiceId)}/pdf`,
		method: 'GET',
		headers: { Accept: 'application/pdf' },
	}),
} as const;
const invoice_getPdfEndpoint = defineEndpoint(invoice_getPdfDef);

const invoice_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const invoice_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					Invoice: z
						.array(QuickBooksModelSchemas['invoiceresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const invoice_listDef = {
	input: invoice_listInput,
	output: invoice_listOutput,
	request: (input: z.output<ReturnType<typeof invoice_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Invoice${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const invoice_listEndpoint = defineEndpoint(invoice_listDef);

const invoice_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, invoiceId: IdSchema }).strict(),
);
const invoice_getOutput = lazySchema(() =>
	z
		.object({
			Invoice: QuickBooksModelSchemas['invoiceresponse'],
			time: z.string(),
		})
		.strict(),
);
const invoice_getDef = {
	input: invoice_getInput,
	output: invoice_getOutput,
	request: (input: z.output<ReturnType<typeof invoice_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/invoice/${encodeURIComponent(input.invoiceId)}`,
		method: 'GET',
	}),
} as const;
const invoice_getEndpoint = defineEndpoint(invoice_getDef);

const invoice_sendInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			invoiceId: IdSchema,
			sendTo: z.string().email().optional(),
		})
		.strict(),
);
const invoice_sendOutput = lazySchema(() =>
	z
		.object({
			Invoice: QuickBooksModelSchemas['invoiceresponse'],
			time: z.string(),
		})
		.strict(),
);
const invoice_sendDef = {
	input: invoice_sendInput,
	output: invoice_sendOutput,
	request: (input: z.output<ReturnType<typeof invoice_sendInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/invoice/${encodeURIComponent(input.invoiceId)}/send`,
		method: 'POST',
		query: { sendTo: input.sendTo },
		headers: { Accept: 'application/json' },
	}),
} as const;
const invoice_sendEndpoint = defineEndpoint(invoice_sendDef);

const invoice_sparseUpdateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['invoiceresponse']
				.partial()
				.extend({
					Id: IdSchema,
					SyncToken: SyncTokenSchema,
					sparse: z.literal(true),
				})
				.strict(),
		})
		.strict(),
);
const invoice_sparseUpdateOutput = lazySchema(() =>
	z
		.object({
			Invoice: QuickBooksModelSchemas['invoiceresponse'],
			time: z.string(),
		})
		.strict(),
);
const invoice_sparseUpdateDef = {
	input: invoice_sparseUpdateInput,
	output: invoice_sparseUpdateOutput,
	request: (input: z.output<ReturnType<typeof invoice_sparseUpdateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/invoice`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const invoice_sparseUpdateEndpoint = defineEndpoint(invoice_sparseUpdateDef);

const invoice_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['invoicerequest']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const invoice_updateOutput = lazySchema(() =>
	z
		.object({
			Invoice: QuickBooksModelSchemas['invoiceresponse'],
			time: z.string(),
		})
		.strict(),
);
const invoice_updateDef = {
	input: invoice_updateInput,
	output: invoice_updateOutput,
	request: (input: z.output<ReturnType<typeof invoice_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/invoice`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const invoice_updateEndpoint = defineEndpoint(invoice_updateDef);

const item_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['itemrequest'],
		})
		.strict(),
);
const item_createOutput = lazySchema(() =>
	z
		.object({ Item: QuickBooksModelSchemas['itemresponse'], time: z.string() })
		.strict(),
);
const item_createDef = {
	input: item_createInput,
	output: item_createOutput,
	request: (input: z.output<ReturnType<typeof item_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/item`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const item_createEndpoint = defineEndpoint(item_createDef);

const item_createCategoryInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['categoryrequest'],
		})
		.strict(),
);
const item_createCategoryOutput = lazySchema(() =>
	z
		.object({
			Item: QuickBooksModelSchemas['categoryresponse'],
			time: z.string(),
		})
		.strict(),
);
const item_createCategoryDef = {
	input: item_createCategoryInput,
	output: item_createCategoryOutput,
	request: (input: z.output<ReturnType<typeof item_createCategoryInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/item`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const item_createCategoryEndpoint = defineEndpoint(item_createCategoryDef);

const item_listBundlesInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const item_listBundlesOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					Item: z.array(QuickBooksModelSchemas['bundleresponse']).optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const item_listBundlesDef = {
	input: item_listBundlesInput,
	output: item_listBundlesOutput,
	request: (input: z.output<ReturnType<typeof item_listBundlesInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Item WHERE Type = 'Group'${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const item_listBundlesEndpoint = defineEndpoint(item_listBundlesDef);

const item_listCategoriesInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const item_listCategoriesOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					Item: z.array(QuickBooksModelSchemas['categoryresponse']).optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const item_listCategoriesDef = {
	input: item_listCategoriesInput,
	output: item_listCategoriesOutput,
	request: (input: z.output<ReturnType<typeof item_listCategoriesInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Item WHERE Type = 'Category'${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const item_listCategoriesEndpoint = defineEndpoint(item_listCategoriesDef);

const item_listItemsInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const item_listItemsOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					Item: z.array(QuickBooksModelSchemas['itemresponse']).optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const item_listItemsDef = {
	input: item_listItemsInput,
	output: item_listItemsOutput,
	request: (input: z.output<ReturnType<typeof item_listItemsInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Item WHERE Type IN ('Inventory', 'NonInventory', 'Service')${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const item_listItemsEndpoint = defineEndpoint(item_listItemsDef);

const item_getBundleInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, itemId: IdSchema }).strict(),
);
const item_getBundleOutput = lazySchema(() =>
	z
		.object({
			Item: QuickBooksModelSchemas['bundleresponse'],
			time: z.string(),
		})
		.strict(),
);
const item_getBundleDef = {
	input: item_getBundleInput,
	output: item_getBundleOutput,
	request: (input: z.output<ReturnType<typeof item_getBundleInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/item/${encodeURIComponent(input.itemId)}`,
		method: 'GET',
	}),
} as const;
const item_getBundleEndpoint = defineEndpoint(item_getBundleDef);

const item_getCategoryInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, itemId: IdSchema }).strict(),
);
const item_getCategoryOutput = lazySchema(() =>
	z
		.object({
			Item: QuickBooksModelSchemas['categoryresponse'],
			time: z.string(),
		})
		.strict(),
);
const item_getCategoryDef = {
	input: item_getCategoryInput,
	output: item_getCategoryOutput,
	request: (input: z.output<ReturnType<typeof item_getCategoryInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/item/${encodeURIComponent(input.itemId)}`,
		method: 'GET',
	}),
} as const;
const item_getCategoryEndpoint = defineEndpoint(item_getCategoryDef);

const item_getItemInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, itemId: IdSchema }).strict(),
);
const item_getItemOutput = lazySchema(() =>
	z
		.object({ Item: QuickBooksModelSchemas['itemresponse'], time: z.string() })
		.strict(),
);
const item_getItemDef = {
	input: item_getItemInput,
	output: item_getItemOutput,
	request: (input: z.output<ReturnType<typeof item_getItemInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/item/${encodeURIComponent(input.itemId)}`,
		method: 'GET',
	}),
} as const;
const item_getItemEndpoint = defineEndpoint(item_getItemDef);

const item_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['itemresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const item_updateOutput = lazySchema(() =>
	z
		.object({ Item: QuickBooksModelSchemas['itemresponse'], time: z.string() })
		.strict(),
);
const item_updateDef = {
	input: item_updateInput,
	output: item_updateOutput,
	request: (input: z.output<ReturnType<typeof item_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/item`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const item_updateEndpoint = defineEndpoint(item_updateDef);

const item_updateCategoryInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['categoryupdaterequest']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const item_updateCategoryOutput = lazySchema(() =>
	z
		.object({
			Item: QuickBooksModelSchemas['categoryresponse'],
			time: z.string(),
		})
		.strict(),
);
const item_updateCategoryDef = {
	input: item_updateCategoryInput,
	output: item_updateCategoryOutput,
	request: (input: z.output<ReturnType<typeof item_updateCategoryInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/item`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const item_updateCategoryEndpoint = defineEndpoint(item_updateCategoryDef);

const journalEntry_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['journalentryrequest'],
		})
		.strict(),
);
const journalEntry_createOutput = lazySchema(() =>
	z
		.object({
			JournalEntry: QuickBooksModelSchemas['journalentryresponse'],
			time: z.string(),
		})
		.strict(),
);
const journalEntry_createDef = {
	input: journalEntry_createInput,
	output: journalEntry_createOutput,
	request: (input: z.output<ReturnType<typeof journalEntry_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/journalentry`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const journalEntry_createEndpoint = defineEndpoint(journalEntry_createDef);

const journalEntry_deleteInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: DeleteBodySchema }).strict(),
);
const journalEntry_deleteOutput = lazySchema(() =>
	z
		.object({
			JournalEntry: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const journalEntry_deleteDef = {
	input: journalEntry_deleteInput,
	output: journalEntry_deleteOutput,
	request: (input: z.output<ReturnType<typeof journalEntry_deleteInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/journalentry`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const journalEntry_deleteEndpoint = defineEndpoint(journalEntry_deleteDef);

const journalEntry_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const journalEntry_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					JournalEntry: z
						.array(QuickBooksModelSchemas['journalentryresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const journalEntry_listDef = {
	input: journalEntry_listInput,
	output: journalEntry_listOutput,
	request: (input: z.output<ReturnType<typeof journalEntry_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM JournalEntry${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const journalEntry_listEndpoint = defineEndpoint(journalEntry_listDef);

const journalEntry_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, journalentryId: IdSchema }).strict(),
);
const journalEntry_getOutput = lazySchema(() =>
	z
		.object({
			JournalEntry: QuickBooksModelSchemas['journalentryresponse'],
			time: z.string(),
		})
		.strict(),
);
const journalEntry_getDef = {
	input: journalEntry_getInput,
	output: journalEntry_getOutput,
	request: (input: z.output<ReturnType<typeof journalEntry_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/journalentry/${encodeURIComponent(input.journalentryId)}`,
		method: 'GET',
	}),
} as const;
const journalEntry_getEndpoint = defineEndpoint(journalEntry_getDef);

const journalEntry_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['journalentryresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const journalEntry_updateOutput = lazySchema(() =>
	z
		.object({
			JournalEntry: QuickBooksModelSchemas['journalentryresponse'],
			time: z.string(),
		})
		.strict(),
);
const journalEntry_updateDef = {
	input: journalEntry_updateInput,
	output: journalEntry_updateOutput,
	request: (input: z.output<ReturnType<typeof journalEntry_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/journalentry`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const journalEntry_updateEndpoint = defineEndpoint(journalEntry_updateDef);

const journalEntry_sparseUpdateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['journalentryresponse']
				.partial()
				.extend({
					Id: IdSchema,
					SyncToken: SyncTokenSchema,
					sparse: z.literal(true),
				})
				.strict(),
		})
		.strict(),
);
const journalEntry_sparseUpdateOutput = lazySchema(() =>
	z
		.object({
			JournalEntry: QuickBooksModelSchemas['journalentryresponse'],
			time: z.string(),
		})
		.strict(),
);
const journalEntry_sparseUpdateDef = {
	input: journalEntry_sparseUpdateInput,
	output: journalEntry_sparseUpdateOutput,
	request: (
		input: z.output<ReturnType<typeof journalEntry_sparseUpdateInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/journalentry`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const journalEntry_sparseUpdateEndpoint = defineEndpoint(
	journalEntry_sparseUpdateDef,
);

const journalReport_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['journalreportqueryus']
				.partial()
				.optional(),
		})
		.strict(),
);
const journalReport_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const journalReport_listDef = {
	input: journalReport_listInput,
	output: journalReport_listOutput,
	request: (input: z.output<ReturnType<typeof journalReport_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/JournalReport`,
		method: 'GET',
		query: {
			end_date: input.params?.['end_date'],
			date_macro: input.params?.['date_macro'],
			sort_by: input.params?.['sort_by'],
			sort_order: input.params?.['sort_order'],
			start_date: input.params?.['start_date'],
			columns: input.params?.['columns'],
		},
	}),
} as const;
const journalReport_listEndpoint = defineEndpoint(journalReport_listDef);

const payment_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['paymentrequest'],
		})
		.strict(),
);
const payment_createOutput = lazySchema(() =>
	z
		.object({
			Payment: QuickBooksModelSchemas['paymentresponse'],
			time: z.string(),
		})
		.strict(),
);
const payment_createDef = {
	input: payment_createInput,
	output: payment_createOutput,
	request: (input: z.output<ReturnType<typeof payment_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/payment`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const payment_createEndpoint = defineEndpoint(payment_createDef);

const payment_deleteInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: DeleteBodySchema }).strict(),
);
const payment_deleteOutput = lazySchema(() =>
	z
		.object({
			Payment: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const payment_deleteDef = {
	input: payment_deleteInput,
	output: payment_deleteOutput,
	request: (input: z.output<ReturnType<typeof payment_deleteInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/payment`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const payment_deleteEndpoint = defineEndpoint(payment_deleteDef);

const payment_voidInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: VoidBodySchema }).strict(),
);
const payment_voidOutput = lazySchema(() =>
	z
		.object({
			Payment: QuickBooksModelSchemas['paymentresponse'],
			time: z.string(),
		})
		.strict(),
);
const payment_voidDef = {
	input: payment_voidInput,
	output: payment_voidOutput,
	request: (input: z.output<ReturnType<typeof payment_voidInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/payment`,
		method: 'POST',
		query: { operation: 'update', include: 'void' },
		body: input.body,
	}),
} as const;
const payment_voidEndpoint = defineEndpoint(payment_voidDef);

const payment_getPdfInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, paymentId: IdSchema }).strict(),
);
const payment_getPdfOutput = lazySchema(() => BinarySchema);
const payment_getPdfDef = {
	input: payment_getPdfInput,
	output: payment_getPdfOutput,
	kind: 'binary',
	request: (input: z.output<ReturnType<typeof payment_getPdfInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/payment/${encodeURIComponent(input.paymentId)}/pdf`,
		method: 'GET',
		headers: { Accept: 'application/pdf' },
	}),
} as const;
const payment_getPdfEndpoint = defineEndpoint(payment_getPdfDef);

const payment_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const payment_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					Payment: z
						.array(QuickBooksModelSchemas['paymentresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const payment_listDef = {
	input: payment_listInput,
	output: payment_listOutput,
	request: (input: z.output<ReturnType<typeof payment_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Payment${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const payment_listEndpoint = defineEndpoint(payment_listDef);

const payment_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, paymentId: IdSchema }).strict(),
);
const payment_getOutput = lazySchema(() =>
	z
		.object({
			Payment: QuickBooksModelSchemas['paymentresponse'],
			time: z.string(),
		})
		.strict(),
);
const payment_getDef = {
	input: payment_getInput,
	output: payment_getOutput,
	request: (input: z.output<ReturnType<typeof payment_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/payment/${encodeURIComponent(input.paymentId)}`,
		method: 'GET',
	}),
} as const;
const payment_getEndpoint = defineEndpoint(payment_getDef);

const payment_sendInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			paymentId: IdSchema,
			sendTo: z.string().email(),
		})
		.strict(),
);
const payment_sendOutput = lazySchema(() =>
	z
		.object({
			Payment: QuickBooksModelSchemas['paymentresponse'],
			time: z.string(),
		})
		.strict(),
);
const payment_sendDef = {
	input: payment_sendInput,
	output: payment_sendOutput,
	request: (input: z.output<ReturnType<typeof payment_sendInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/payment/${encodeURIComponent(input.paymentId)}/send`,
		method: 'POST',
		query: { sendTo: input.sendTo },
		headers: { Accept: 'application/json' },
	}),
} as const;
const payment_sendEndpoint = defineEndpoint(payment_sendDef);

const payment_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['paymentresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const payment_updateOutput = lazySchema(() =>
	z
		.object({
			Payment: QuickBooksModelSchemas['paymentresponse'],
			time: z.string(),
		})
		.strict(),
);
const payment_updateDef = {
	input: payment_updateInput,
	output: payment_updateOutput,
	request: (input: z.output<ReturnType<typeof payment_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/payment`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const payment_updateEndpoint = defineEndpoint(payment_updateDef);

const paymentMethod_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['paymentmethodrequest'],
		})
		.strict(),
);
const paymentMethod_createOutput = lazySchema(() =>
	z
		.object({
			PaymentMethod: QuickBooksModelSchemas['paymentmethodresponse'],
			time: z.string(),
		})
		.strict(),
);
const paymentMethod_createDef = {
	input: paymentMethod_createInput,
	output: paymentMethod_createOutput,
	request: (input: z.output<ReturnType<typeof paymentMethod_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/paymentmethod`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const paymentMethod_createEndpoint = defineEndpoint(paymentMethod_createDef);

const paymentMethod_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const paymentMethod_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					PaymentMethod: z
						.array(QuickBooksModelSchemas['paymentmethodresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const paymentMethod_listDef = {
	input: paymentMethod_listInput,
	output: paymentMethod_listOutput,
	request: (input: z.output<ReturnType<typeof paymentMethod_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM PaymentMethod${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const paymentMethod_listEndpoint = defineEndpoint(paymentMethod_listDef);

const paymentMethod_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, paymentmethodId: IdSchema }).strict(),
);
const paymentMethod_getOutput = lazySchema(() =>
	z
		.object({
			PaymentMethod: QuickBooksModelSchemas['paymentmethodresponse'],
			time: z.string(),
		})
		.strict(),
);
const paymentMethod_getDef = {
	input: paymentMethod_getInput,
	output: paymentMethod_getOutput,
	request: (input: z.output<ReturnType<typeof paymentMethod_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/paymentmethod/${encodeURIComponent(input.paymentmethodId)}`,
		method: 'GET',
	}),
} as const;
const paymentMethod_getEndpoint = defineEndpoint(paymentMethod_getDef);

const paymentMethod_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['paymentmethodresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const paymentMethod_updateOutput = lazySchema(() =>
	z
		.object({
			PaymentMethod: QuickBooksModelSchemas['paymentmethodresponse'],
			time: z.string(),
		})
		.strict(),
);
const paymentMethod_updateDef = {
	input: paymentMethod_updateInput,
	output: paymentMethod_updateOutput,
	request: (input: z.output<ReturnType<typeof paymentMethod_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/paymentmethod`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const paymentMethod_updateEndpoint = defineEndpoint(paymentMethod_updateDef);

const preferences_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const preferences_listOutput = lazySchema(() =>
	z.union([
		z
			.object({
				QueryResponse: z
					.object({
						startPosition: z.number().optional(),
						maxResults: z.number().optional(),
						totalCount: z.number().optional(),
						Preferences: z
							.array(QuickBooksModelSchemas['preferencesresponse'])
							.optional(),
					})
					.strict(),
				time: z.string(),
			})
			.strict(),
		z
			.object({
				Preferences: QuickBooksModelSchemas['preferencesresponse'],
				time: z.string(),
			})
			.strict(),
	]),
);
const preferences_listDef = {
	input: preferences_listInput,
	output: preferences_listOutput,
	request: (input: z.output<ReturnType<typeof preferences_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Preferences${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const preferences_listEndpoint = defineEndpoint(preferences_listDef);

const preferences_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema }).strict(),
);
const preferences_getOutput = lazySchema(() =>
	z
		.object({
			Preferences: QuickBooksModelSchemas['preferencesresponse'],
			time: z.string(),
		})
		.strict(),
);
const preferences_getDef = {
	input: preferences_getInput,
	output: preferences_getOutput,
	request: (input: z.output<ReturnType<typeof preferences_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/preferences`,
		method: 'GET',
	}),
} as const;
const preferences_getEndpoint = defineEndpoint(preferences_getDef);

const preferences_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['preferencesresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const preferences_updateOutput = lazySchema(() =>
	z
		.object({
			Preferences: QuickBooksModelSchemas['preferencesresponse'],
			time: z.string(),
		})
		.strict(),
);
const preferences_updateDef = {
	input: preferences_updateInput,
	output: preferences_updateOutput,
	request: (input: z.output<ReturnType<typeof preferences_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/preferences`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const preferences_updateEndpoint = defineEndpoint(preferences_updateDef);

const profitAndLoss_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['profitandlossquery'].partial().optional(),
		})
		.strict(),
);
const profitAndLoss_listOutput = lazySchema(
	() => QuickBooksModelSchemas['profitandlossreporttoplevel'],
);
const profitAndLoss_listDef = {
	input: profitAndLoss_listInput,
	output: profitAndLoss_listOutput,
	request: (input: z.output<ReturnType<typeof profitAndLoss_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/ProfitAndLoss`,
		method: 'GET',
		query: {
			customer: input.params?.['customer'],
			qzurl: input.params?.['qzurl'],
			accounting_method: input.params?.['accounting_method'],
			end_date: input.params?.['end_date'],
			date_macro: input.params?.['date_macro'],
			adjusted_gain_loss: input.params?.['adjusted_gain_loss'],
			class: input.params?.['class'],
			item: input.params?.['item'],
			sort_order: input.params?.['sort_order'],
			summarize_column_by: input.params?.['summarize_column_by'],
			department: input.params?.['department'],
			vendor: input.params?.['vendor'],
			start_date: input.params?.['start_date'],
		},
	}),
} as const;
const profitAndLoss_listEndpoint = defineEndpoint(profitAndLoss_listDef);

const profitAndLossDetail_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['profitandlossdetailquery']
				.partial()
				.optional(),
		})
		.strict(),
);
const profitAndLossDetail_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const profitAndLossDetail_listDef = {
	input: profitAndLossDetail_listInput,
	output: profitAndLossDetail_listOutput,
	request: (
		input: z.output<ReturnType<typeof profitAndLossDetail_listInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/ProfitAndLossDetail`,
		method: 'GET',
		query: {
			customer: input.params?.['customer'],
			account: input.params?.['account'],
			accounting_method: input.params?.['accounting_method'],
			end_date: input.params?.['end_date'],
			date_macro: input.params?.['date_macro'],
			adjusted_gain_loss: input.params?.['adjusted_gain_loss'],
			class: input.params?.['class'],
			sort_by: input.params?.['sort_by'],
			payment_method: input.params?.['payment_method'],
			sort_order: input.params?.['sort_order'],
			employee: input.params?.['employee'],
			department: input.params?.['department'],
			vendor: input.params?.['vendor'],
			account_type: input.params?.['account_type'],
			start_date: input.params?.['start_date'],
			columns: input.params?.['columns'],
		},
	}),
} as const;
const profitAndLossDetail_listEndpoint = defineEndpoint(
	profitAndLossDetail_listDef,
);

const purchase_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['purchaserequest'],
		})
		.strict(),
);
const purchase_createOutput = lazySchema(() =>
	z
		.object({
			Purchase: QuickBooksModelSchemas['purchaseresponse'],
			time: z.string(),
		})
		.strict(),
);
const purchase_createDef = {
	input: purchase_createInput,
	output: purchase_createOutput,
	request: (input: z.output<ReturnType<typeof purchase_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchase`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const purchase_createEndpoint = defineEndpoint(purchase_createDef);

const purchase_deleteInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: DeleteBodySchema }).strict(),
);
const purchase_deleteOutput = lazySchema(() =>
	z
		.object({
			Purchase: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const purchase_deleteDef = {
	input: purchase_deleteInput,
	output: purchase_deleteOutput,
	request: (input: z.output<ReturnType<typeof purchase_deleteInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchase`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const purchase_deleteEndpoint = defineEndpoint(purchase_deleteDef);

const purchase_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const purchase_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					Purchase: z
						.array(QuickBooksModelSchemas['purchaseresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const purchase_listDef = {
	input: purchase_listInput,
	output: purchase_listOutput,
	request: (input: z.output<ReturnType<typeof purchase_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Purchase${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const purchase_listEndpoint = defineEndpoint(purchase_listDef);

const purchase_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, purchaseId: IdSchema }).strict(),
);
const purchase_getOutput = lazySchema(() =>
	z
		.object({
			Purchase: QuickBooksModelSchemas['purchaseresponse'],
			time: z.string(),
		})
		.strict(),
);
const purchase_getDef = {
	input: purchase_getInput,
	output: purchase_getOutput,
	request: (input: z.output<ReturnType<typeof purchase_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchase/${encodeURIComponent(input.purchaseId)}`,
		method: 'GET',
	}),
} as const;
const purchase_getEndpoint = defineEndpoint(purchase_getDef);

const purchase_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['purchaseresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const purchase_updateOutput = lazySchema(() =>
	z
		.object({
			Purchase: QuickBooksModelSchemas['purchaseresponse'],
			time: z.string(),
		})
		.strict(),
);
const purchase_updateDef = {
	input: purchase_updateInput,
	output: purchase_updateOutput,
	request: (input: z.output<ReturnType<typeof purchase_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchase`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const purchase_updateEndpoint = defineEndpoint(purchase_updateDef);

const purchaseOrder_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['purchaseorderrequest'],
		})
		.strict(),
);
const purchaseOrder_createOutput = lazySchema(() =>
	z
		.object({
			PurchaseOrder: QuickBooksModelSchemas['purchaseorderresponse'],
			time: z.string(),
		})
		.strict(),
);
const purchaseOrder_createDef = {
	input: purchaseOrder_createInput,
	output: purchaseOrder_createOutput,
	request: (input: z.output<ReturnType<typeof purchaseOrder_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchaseorder`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const purchaseOrder_createEndpoint = defineEndpoint(purchaseOrder_createDef);

const purchaseOrder_deleteInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: DeleteBodySchema }).strict(),
);
const purchaseOrder_deleteOutput = lazySchema(() =>
	z
		.object({
			PurchaseOrder: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const purchaseOrder_deleteDef = {
	input: purchaseOrder_deleteInput,
	output: purchaseOrder_deleteOutput,
	request: (input: z.output<ReturnType<typeof purchaseOrder_deleteInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchaseorder`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const purchaseOrder_deleteEndpoint = defineEndpoint(purchaseOrder_deleteDef);

const purchaseOrder_getPdfInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, purchaseorderId: IdSchema }).strict(),
);
const purchaseOrder_getPdfOutput = lazySchema(() => BinarySchema);
const purchaseOrder_getPdfDef = {
	input: purchaseOrder_getPdfInput,
	output: purchaseOrder_getPdfOutput,
	kind: 'binary',
	request: (input: z.output<ReturnType<typeof purchaseOrder_getPdfInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchaseorder/${encodeURIComponent(input.purchaseorderId)}/pdf`,
		method: 'GET',
		headers: { Accept: 'application/pdf' },
	}),
} as const;
const purchaseOrder_getPdfEndpoint = defineEndpoint(purchaseOrder_getPdfDef);

const purchaseOrder_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const purchaseOrder_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					PurchaseOrder: z
						.array(QuickBooksModelSchemas['purchaseorderresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const purchaseOrder_listDef = {
	input: purchaseOrder_listInput,
	output: purchaseOrder_listOutput,
	request: (input: z.output<ReturnType<typeof purchaseOrder_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM PurchaseOrder${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const purchaseOrder_listEndpoint = defineEndpoint(purchaseOrder_listDef);

const purchaseOrder_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, purchaseorderId: IdSchema }).strict(),
);
const purchaseOrder_getOutput = lazySchema(() =>
	z
		.object({
			PurchaseOrder: QuickBooksModelSchemas['purchaseorderresponse'],
			time: z.string(),
		})
		.strict(),
);
const purchaseOrder_getDef = {
	input: purchaseOrder_getInput,
	output: purchaseOrder_getOutput,
	request: (input: z.output<ReturnType<typeof purchaseOrder_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchaseorder/${encodeURIComponent(input.purchaseorderId)}`,
		method: 'GET',
	}),
} as const;
const purchaseOrder_getEndpoint = defineEndpoint(purchaseOrder_getDef);

const purchaseOrder_sendInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			purchaseorderId: IdSchema,
			sendTo: z.string().email().optional(),
		})
		.strict(),
);
const purchaseOrder_sendOutput = lazySchema(() =>
	z
		.object({
			PurchaseOrder: QuickBooksModelSchemas['purchaseorderresponse'],
			time: z.string(),
		})
		.strict(),
);
const purchaseOrder_sendDef = {
	input: purchaseOrder_sendInput,
	output: purchaseOrder_sendOutput,
	request: (input: z.output<ReturnType<typeof purchaseOrder_sendInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchaseorder/${encodeURIComponent(input.purchaseorderId)}/send`,
		method: 'POST',
		query: { sendTo: input.sendTo },
		headers: { Accept: 'application/json' },
	}),
} as const;
const purchaseOrder_sendEndpoint = defineEndpoint(purchaseOrder_sendDef);

const purchaseOrder_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['purchaseorderresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const purchaseOrder_updateOutput = lazySchema(() =>
	z
		.object({
			PurchaseOrder: QuickBooksModelSchemas['purchaseorderresponse'],
			time: z.string(),
		})
		.strict(),
);
const purchaseOrder_updateDef = {
	input: purchaseOrder_updateInput,
	output: purchaseOrder_updateOutput,
	request: (input: z.output<ReturnType<typeof purchaseOrder_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchaseorder`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const purchaseOrder_updateEndpoint = defineEndpoint(purchaseOrder_updateDef);

const recurringTransaction_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['recurringtransactionrequest'],
		})
		.strict(),
);
const recurringTransaction_createOutput = lazySchema(() =>
	z
		.object({
			RecurringTransaction:
				QuickBooksModelSchemas['recurringtransactionresponse'],
			time: z.string(),
		})
		.strict(),
);
const recurringTransaction_createDef = {
	input: recurringTransaction_createInput,
	output: recurringTransaction_createOutput,
	request: (
		input: z.output<ReturnType<typeof recurringTransaction_createInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/recurringtransaction`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const recurringTransaction_createEndpoint = defineEndpoint(
	recurringTransaction_createDef,
);

const recurringTransaction_deleteInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['recurringtransactiondeleterequest'],
		})
		.strict(),
);
const recurringTransaction_deleteOutput = lazySchema(() =>
	z
		.object({
			// The deleted template comes back under its transaction type: { status, domain, Invoice: { Id } }.
			RecurringTransaction: z
				.object({
					status: z.literal('Deleted'),
					domain: z.literal('QBO').optional(),
				})
				.catchall(z.object({ Id: IdSchema }).strict()),
			time: z.string().optional(),
		})
		.strict(),
);
const recurringTransaction_deleteDef = {
	input: recurringTransaction_deleteInput,
	output: recurringTransaction_deleteOutput,
	request: (
		input: z.output<ReturnType<typeof recurringTransaction_deleteInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/recurringtransaction`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const recurringTransaction_deleteEndpoint = defineEndpoint(
	recurringTransaction_deleteDef,
);

const recurringTransaction_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const recurringTransaction_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					RecurringTransaction: z
						.array(QuickBooksModelSchemas['recurringtransactionresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const recurringTransaction_listDef = {
	input: recurringTransaction_listInput,
	output: recurringTransaction_listOutput,
	request: (
		input: z.output<ReturnType<typeof recurringTransaction_listInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM RecurringTransaction${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const recurringTransaction_listEndpoint = defineEndpoint(
	recurringTransaction_listDef,
);

const recurringTransaction_getInput = lazySchema(() =>
	z
		.object({ realmId: RealmIdSchema, recurringtransactionId: IdSchema })
		.strict(),
);
// Intuit's read sample answers { QueryResponse: { RecurringTransaction: [...] } }; accept that and the entity envelope.
const recurringTransaction_getOutput = lazySchema(() =>
	z.union([
		z
			.object({
				RecurringTransaction:
					QuickBooksModelSchemas['recurringtransactionresponse'],
				time: z.string(),
			})
			.strict(),
		z
			.object({
				QueryResponse: z
					.object({
						startPosition: z.number().optional(),
						maxResults: z.number().optional(),
						totalCount: z.number().optional(),
						RecurringTransaction: z
							.array(QuickBooksModelSchemas['recurringtransactionresponse'])
							.optional(),
					})
					.strict(),
				time: z.string(),
			})
			.strict(),
	]),
);
const recurringTransaction_getDef = {
	input: recurringTransaction_getInput,
	output: recurringTransaction_getOutput,
	request: (
		input: z.output<ReturnType<typeof recurringTransaction_getInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/recurringtransaction/${encodeURIComponent(input.recurringtransactionId)}`,
		method: 'GET',
	}),
} as const;
const recurringTransaction_getEndpoint = defineEndpoint(
	recurringTransaction_getDef,
);

const refundReceipt_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['refundreceiptrequest'],
		})
		.strict(),
);
const refundReceipt_createOutput = lazySchema(() =>
	z
		.object({
			RefundReceipt: QuickBooksModelSchemas['refundreceiptresponse'],
			time: z.string(),
		})
		.strict(),
);
const refundReceipt_createDef = {
	input: refundReceipt_createInput,
	output: refundReceipt_createOutput,
	request: (input: z.output<ReturnType<typeof refundReceipt_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/refundreceipt`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const refundReceipt_createEndpoint = defineEndpoint(refundReceipt_createDef);

const refundReceipt_deleteInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: DeleteBodySchema }).strict(),
);
const refundReceipt_deleteOutput = lazySchema(() =>
	z
		.object({
			RefundReceipt: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const refundReceipt_deleteDef = {
	input: refundReceipt_deleteInput,
	output: refundReceipt_deleteOutput,
	request: (input: z.output<ReturnType<typeof refundReceipt_deleteInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/refundreceipt`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const refundReceipt_deleteEndpoint = defineEndpoint(refundReceipt_deleteDef);

const refundReceipt_getPdfInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, refundreceiptId: IdSchema }).strict(),
);
const refundReceipt_getPdfOutput = lazySchema(() => BinarySchema);
const refundReceipt_getPdfDef = {
	input: refundReceipt_getPdfInput,
	output: refundReceipt_getPdfOutput,
	kind: 'binary',
	request: (input: z.output<ReturnType<typeof refundReceipt_getPdfInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/refundreceipt/${encodeURIComponent(input.refundreceiptId)}/pdf`,
		method: 'GET',
		headers: { Accept: 'application/pdf' },
	}),
} as const;
const refundReceipt_getPdfEndpoint = defineEndpoint(refundReceipt_getPdfDef);

const refundReceipt_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const refundReceipt_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					RefundReceipt: z
						.array(QuickBooksModelSchemas['refundreceiptresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const refundReceipt_listDef = {
	input: refundReceipt_listInput,
	output: refundReceipt_listOutput,
	request: (input: z.output<ReturnType<typeof refundReceipt_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM RefundReceipt${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const refundReceipt_listEndpoint = defineEndpoint(refundReceipt_listDef);

const refundReceipt_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, refundreceiptId: IdSchema }).strict(),
);
const refundReceipt_getOutput = lazySchema(() =>
	z
		.object({
			RefundReceipt: QuickBooksModelSchemas['refundreceiptresponse'],
			time: z.string(),
		})
		.strict(),
);
const refundReceipt_getDef = {
	input: refundReceipt_getInput,
	output: refundReceipt_getOutput,
	request: (input: z.output<ReturnType<typeof refundReceipt_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/refundreceipt/${encodeURIComponent(input.refundreceiptId)}`,
		method: 'GET',
	}),
} as const;
const refundReceipt_getEndpoint = defineEndpoint(refundReceipt_getDef);

const refundReceipt_sendInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			refundreceiptId: IdSchema,
			sendTo: z.string().email().optional(),
		})
		.strict(),
);
const refundReceipt_sendOutput = lazySchema(() =>
	z
		.object({
			RefundReceipt: QuickBooksModelSchemas['refundreceiptresponse'],
			time: z.string(),
		})
		.strict(),
);
const refundReceipt_sendDef = {
	input: refundReceipt_sendInput,
	output: refundReceipt_sendOutput,
	request: (input: z.output<ReturnType<typeof refundReceipt_sendInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/refundreceipt/${encodeURIComponent(input.refundreceiptId)}/send`,
		method: 'POST',
		query: { sendTo: input.sendTo },
		headers: { Accept: 'application/json' },
	}),
} as const;
const refundReceipt_sendEndpoint = defineEndpoint(refundReceipt_sendDef);

const refundReceipt_sparseUpdateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['refundreceiptresponse']
				.partial()
				.extend({
					Id: IdSchema,
					SyncToken: SyncTokenSchema,
					sparse: z.literal(true),
				})
				.strict(),
		})
		.strict(),
);
const refundReceipt_sparseUpdateOutput = lazySchema(() =>
	z
		.object({
			RefundReceipt: QuickBooksModelSchemas['refundreceiptresponse'],
			time: z.string(),
		})
		.strict(),
);
const refundReceipt_sparseUpdateDef = {
	input: refundReceipt_sparseUpdateInput,
	output: refundReceipt_sparseUpdateOutput,
	request: (
		input: z.output<ReturnType<typeof refundReceipt_sparseUpdateInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/refundreceipt`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const refundReceipt_sparseUpdateEndpoint = defineEndpoint(
	refundReceipt_sparseUpdateDef,
);

const refundReceipt_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['refundreceiptrequest']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const refundReceipt_updateOutput = lazySchema(() =>
	z
		.object({
			RefundReceipt: QuickBooksModelSchemas['refundreceiptresponse'],
			time: z.string(),
		})
		.strict(),
);
const refundReceipt_updateDef = {
	input: refundReceipt_updateInput,
	output: refundReceipt_updateOutput,
	request: (input: z.output<ReturnType<typeof refundReceipt_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/refundreceipt`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const refundReceipt_updateEndpoint = defineEndpoint(refundReceipt_updateDef);

const reimburseCharge_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const reimburseCharge_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					ReimburseCharge: z
						.array(QuickBooksModelSchemas['reimbursechargeresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const reimburseCharge_listDef = {
	input: reimburseCharge_listInput,
	output: reimburseCharge_listOutput,
	request: (input: z.output<ReturnType<typeof reimburseCharge_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM ReimburseCharge${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const reimburseCharge_listEndpoint = defineEndpoint(reimburseCharge_listDef);

const reimburseCharge_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, taxrateId: IdSchema }).strict(),
);
const reimburseCharge_getOutput = lazySchema(() =>
	z
		.object({
			ReimburseCharge: QuickBooksModelSchemas['reimbursechargeresponse'],
			time: z.string(),
		})
		.strict(),
);
const reimburseCharge_getDef = {
	input: reimburseCharge_getInput,
	output: reimburseCharge_getOutput,
	request: (input: z.output<ReturnType<typeof reimburseCharge_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reimbursecharge/${encodeURIComponent(input.taxrateId)}`,
		method: 'GET',
	}),
} as const;
const reimburseCharge_getEndpoint = defineEndpoint(reimburseCharge_getDef);

const salesByClassSummary_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['classsalesquery'].partial().optional(),
		})
		.strict(),
);
const salesByClassSummary_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const salesByClassSummary_listDef = {
	input: salesByClassSummary_listInput,
	output: salesByClassSummary_listOutput,
	request: (
		input: z.output<ReturnType<typeof salesByClassSummary_listInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/ClassSales`,
		method: 'GET',
		query: {
			customer: input.params?.['customer'],
			accounting_method: input.params?.['accounting_method'],
			end_date: input.params?.['end_date'],
			date_macro: input.params?.['date_macro'],
			class: input.params?.['class'],
			item: input.params?.['item'],
			summarize_column_by: input.params?.['summarize_column_by'],
			department: input.params?.['department'],
			start_date: input.params?.['start_date'],
		},
	}),
} as const;
const salesByClassSummary_listEndpoint = defineEndpoint(
	salesByClassSummary_listDef,
);

const salesByCustomer_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['customersalesquery'].partial().optional(),
		})
		.strict(),
);
const salesByCustomer_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const salesByCustomer_listDef = {
	input: salesByCustomer_listInput,
	output: salesByCustomer_listOutput,
	request: (input: z.output<ReturnType<typeof salesByCustomer_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/CustomerSales`,
		method: 'GET',
		query: {
			customer: input.params?.['customer'],
			qzurl: input.params?.['qzurl'],
			accounting_method: input.params?.['accounting_method'],
			end_date: input.params?.['end_date'],
			date_macro: input.params?.['date_macro'],
			class: input.params?.['class'],
			item: input.params?.['item'],
			sort_order: input.params?.['sort_order'],
			summarize_column_by: input.params?.['summarize_column_by'],
			department: input.params?.['department'],
			start_date: input.params?.['start_date'],
		},
	}),
} as const;
const salesByCustomer_listEndpoint = defineEndpoint(salesByCustomer_listDef);

const salesByDepartment_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['departmentsalesquery']
				.partial()
				.optional(),
		})
		.strict(),
);
const salesByDepartment_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const salesByDepartment_listDef = {
	input: salesByDepartment_listInput,
	output: salesByDepartment_listOutput,
	request: (
		input: z.output<ReturnType<typeof salesByDepartment_listInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/DepartmentSales`,
		method: 'GET',
		query: {
			customer: input.params?.['customer'],
			accounting_method: input.params?.['accounting_method'],
			end_date: input.params?.['end_date'],
			date_macro: input.params?.['date_macro'],
			class: input.params?.['class'],
			item: input.params?.['item'],
			sort_order: input.params?.['sort_order'],
			summarize_column_by: input.params?.['summarize_column_by'],
			department: input.params?.['department'],
			start_date: input.params?.['start_date'],
		},
	}),
} as const;
const salesByDepartment_listEndpoint = defineEndpoint(
	salesByDepartment_listDef,
);

const salesByProduct_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['itemsalesquery'].partial().optional(),
		})
		.strict(),
);
const salesByProduct_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const salesByProduct_listDef = {
	input: salesByProduct_listInput,
	output: salesByProduct_listOutput,
	request: (input: z.output<ReturnType<typeof salesByProduct_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/ItemSales`,
		method: 'GET',
		query: {
			customer: input.params?.['customer'],
			end_duedate: input.params?.['end_duedate'],
			accounting_method: input.params?.['accounting_method'],
			end_date: input.params?.['end_date'],
			date_macro: input.params?.['date_macro'],
			start_duedate: input.params?.['start_duedate'],
			class: input.params?.['class'],
			item: input.params?.['item'],
			sort_order: input.params?.['sort_order'],
			summarize_column_by: input.params?.['summarize_column_by'],
			department: input.params?.['department'],
			start_date: input.params?.['start_date'],
		},
	}),
} as const;
const salesByProduct_listEndpoint = defineEndpoint(salesByProduct_listDef);

const salesReceipt_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['salesreceiptrequest'],
		})
		.strict(),
);
const salesReceipt_createOutput = lazySchema(() =>
	z
		.object({
			SalesReceipt: QuickBooksModelSchemas['salesreceiptresponse'],
			time: z.string(),
		})
		.strict(),
);
const salesReceipt_createDef = {
	input: salesReceipt_createInput,
	output: salesReceipt_createOutput,
	request: (input: z.output<ReturnType<typeof salesReceipt_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/salesreceipt`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const salesReceipt_createEndpoint = defineEndpoint(salesReceipt_createDef);

const salesReceipt_deleteInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: DeleteBodySchema }).strict(),
);
const salesReceipt_deleteOutput = lazySchema(() =>
	z
		.object({
			SalesReceipt: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const salesReceipt_deleteDef = {
	input: salesReceipt_deleteInput,
	output: salesReceipt_deleteOutput,
	request: (input: z.output<ReturnType<typeof salesReceipt_deleteInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/salesreceipt`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const salesReceipt_deleteEndpoint = defineEndpoint(salesReceipt_deleteDef);

const salesReceipt_voidInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: VoidBodySchema }).strict(),
);
const salesReceipt_voidOutput = lazySchema(() =>
	z
		.object({
			SalesReceipt: QuickBooksModelSchemas['salesreceiptresponse'],
			time: z.string(),
		})
		.strict(),
);
const salesReceipt_voidDef = {
	input: salesReceipt_voidInput,
	output: salesReceipt_voidOutput,
	request: (input: z.output<ReturnType<typeof salesReceipt_voidInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/salesreceipt`,
		method: 'POST',
		query: { operation: 'update', include: 'void' },
		body: input.body,
	}),
} as const;
const salesReceipt_voidEndpoint = defineEndpoint(salesReceipt_voidDef);

const salesReceipt_getPdfInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, salesreceiptId: IdSchema }).strict(),
);
const salesReceipt_getPdfOutput = lazySchema(() => BinarySchema);
const salesReceipt_getPdfDef = {
	input: salesReceipt_getPdfInput,
	output: salesReceipt_getPdfOutput,
	kind: 'binary',
	request: (input: z.output<ReturnType<typeof salesReceipt_getPdfInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/salesreceipt/${encodeURIComponent(input.salesreceiptId)}/pdf`,
		method: 'GET',
		headers: { Accept: 'application/pdf' },
	}),
} as const;
const salesReceipt_getPdfEndpoint = defineEndpoint(salesReceipt_getPdfDef);

const salesReceipt_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const salesReceipt_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					SalesReceipt: z
						.array(QuickBooksModelSchemas['salesreceiptresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const salesReceipt_listDef = {
	input: salesReceipt_listInput,
	output: salesReceipt_listOutput,
	request: (input: z.output<ReturnType<typeof salesReceipt_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM SalesReceipt${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const salesReceipt_listEndpoint = defineEndpoint(salesReceipt_listDef);

const salesReceipt_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, salesreceiptId: IdSchema }).strict(),
);
const salesReceipt_getOutput = lazySchema(() =>
	z
		.object({
			SalesReceipt: QuickBooksModelSchemas['salesreceiptresponse'],
			time: z.string(),
		})
		.strict(),
);
const salesReceipt_getDef = {
	input: salesReceipt_getInput,
	output: salesReceipt_getOutput,
	request: (input: z.output<ReturnType<typeof salesReceipt_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/salesreceipt/${encodeURIComponent(input.salesreceiptId)}`,
		method: 'GET',
	}),
} as const;
const salesReceipt_getEndpoint = defineEndpoint(salesReceipt_getDef);

const salesReceipt_sendInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			salesreceiptId: IdSchema,
			sendTo: z.string().email().optional(),
		})
		.strict(),
);
const salesReceipt_sendOutput = lazySchema(() =>
	z
		.object({
			SalesReceipt: QuickBooksModelSchemas['salesreceiptresponse'],
			time: z.string(),
		})
		.strict(),
);
const salesReceipt_sendDef = {
	input: salesReceipt_sendInput,
	output: salesReceipt_sendOutput,
	request: (input: z.output<ReturnType<typeof salesReceipt_sendInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/salesreceipt/${encodeURIComponent(input.salesreceiptId)}/send`,
		method: 'POST',
		query: { sendTo: input.sendTo },
		headers: { Accept: 'application/json' },
	}),
} as const;
const salesReceipt_sendEndpoint = defineEndpoint(salesReceipt_sendDef);

const salesReceipt_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['salesreceiptresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const salesReceipt_updateOutput = lazySchema(() =>
	z
		.object({
			SalesReceipt: QuickBooksModelSchemas['salesreceiptresponse'],
			time: z.string(),
		})
		.strict(),
);
const salesReceipt_updateDef = {
	input: salesReceipt_updateInput,
	output: salesReceipt_updateOutput,
	request: (input: z.output<ReturnType<typeof salesReceipt_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/salesreceipt`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const salesReceipt_updateEndpoint = defineEndpoint(salesReceipt_updateDef);

const salesReceipt_sparseUpdateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['salesreceiptresponse']
				.partial()
				.extend({
					Id: IdSchema,
					SyncToken: SyncTokenSchema,
					sparse: z.literal(true),
				})
				.strict(),
		})
		.strict(),
);
const salesReceipt_sparseUpdateOutput = lazySchema(() =>
	z
		.object({
			SalesReceipt: QuickBooksModelSchemas['salesreceiptresponse'],
			time: z.string(),
		})
		.strict(),
);
const salesReceipt_sparseUpdateDef = {
	input: salesReceipt_sparseUpdateInput,
	output: salesReceipt_sparseUpdateOutput,
	request: (
		input: z.output<ReturnType<typeof salesReceipt_sparseUpdateInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/salesreceipt`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const salesReceipt_sparseUpdateEndpoint = defineEndpoint(
	salesReceipt_sparseUpdateDef,
);

const taxAgency_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['taxagencyrequest'],
		})
		.strict(),
);
const taxAgency_createOutput = lazySchema(() =>
	z
		.object({
			TaxAgency: QuickBooksModelSchemas['taxagencyresponse'],
			time: z.string(),
		})
		.strict(),
);
const taxAgency_createDef = {
	input: taxAgency_createInput,
	output: taxAgency_createOutput,
	request: (input: z.output<ReturnType<typeof taxAgency_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxagency`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const taxAgency_createEndpoint = defineEndpoint(taxAgency_createDef);

const taxAgency_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const taxAgency_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					TaxAgency: z
						.array(QuickBooksModelSchemas['taxagencyresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const taxAgency_listDef = {
	input: taxAgency_listInput,
	output: taxAgency_listOutput,
	request: (input: z.output<ReturnType<typeof taxAgency_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM TaxAgency${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const taxAgency_listEndpoint = defineEndpoint(taxAgency_listDef);

const taxAgency_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, taxagencyId: IdSchema }).strict(),
);
const taxAgency_getOutput = lazySchema(() =>
	z
		.object({
			TaxAgency: QuickBooksModelSchemas['taxagencyresponse'],
			time: z.string(),
		})
		.strict(),
);
const taxAgency_getDef = {
	input: taxAgency_getInput,
	output: taxAgency_getOutput,
	request: (input: z.output<ReturnType<typeof taxAgency_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxagency/${encodeURIComponent(input.taxagencyId)}`,
		method: 'GET',
	}),
} as const;
const taxAgency_getEndpoint = defineEndpoint(taxAgency_getDef);

const taxClassification_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, taxClassificationId: IdSchema }).strict(),
);
const taxClassification_getOutput = lazySchema(() =>
	z
		.object({
			TaxClassification: QuickBooksModelSchemas['taxclassification'],
			time: z.string(),
		})
		.strict(),
);
const taxClassification_getDef = {
	input: taxClassification_getInput,
	output: taxClassification_getOutput,
	request: (
		input: z.output<ReturnType<typeof taxClassification_getInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxclassification/${encodeURIComponent(input.taxClassificationId)}`,
		method: 'GET',
	}),
} as const;
const taxClassification_getEndpoint = defineEndpoint(taxClassification_getDef);

const taxClassification_listChildrenInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, parentId: IdSchema }).strict(),
);
const taxClassification_listChildrenOutput = lazySchema(() =>
	z
		.object({
			TaxClassification: QuickBooksModelSchemas['taxclassification'],
			time: z.string(),
		})
		.strict(),
);
const taxClassification_listChildrenDef = {
	input: taxClassification_listChildrenInput,
	output: taxClassification_listChildrenOutput,
	request: (
		input: z.output<ReturnType<typeof taxClassification_listChildrenInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxclassification/${encodeURIComponent(input.parentId)}/children`,
		method: 'GET',
	}),
} as const;
const taxClassification_listChildrenEndpoint = defineEndpoint(
	taxClassification_listChildrenDef,
);

const taxClassification_listInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema }).strict(),
);
const taxClassification_listOutput = lazySchema(() =>
	z
		.object({
			TaxClassification: QuickBooksModelSchemas['taxclassification'],
			time: z.string(),
		})
		.strict(),
);
const taxClassification_listDef = {
	input: taxClassification_listInput,
	output: taxClassification_listOutput,
	request: (
		input: z.output<ReturnType<typeof taxClassification_listInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxclassification`,
		method: 'GET',
	}),
} as const;
const taxClassification_listEndpoint = defineEndpoint(
	taxClassification_listDef,
);

const taxClassification_listByLevelInput = lazySchema(() =>
	z
		.object({ realmId: RealmIdSchema, level: z.number().int().positive() })
		.strict(),
);
const taxClassification_listByLevelOutput = lazySchema(() =>
	z
		.object({
			TaxClassification: QuickBooksModelSchemas['taxclassification'],
			time: z.string(),
		})
		.strict(),
);
const taxClassification_listByLevelDef = {
	input: taxClassification_listByLevelInput,
	output: taxClassification_listByLevelOutput,
	request: (
		input: z.output<ReturnType<typeof taxClassification_listByLevelInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxclassification`,
		method: 'GET',
		query: { level: input.level },
	}),
} as const;
const taxClassification_listByLevelEndpoint = defineEndpoint(
	taxClassification_listByLevelDef,
);

const taxCode_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const taxCode_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					TaxCode: z
						.array(QuickBooksModelSchemas['taxcoderesponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const taxCode_listDef = {
	input: taxCode_listInput,
	output: taxCode_listOutput,
	request: (input: z.output<ReturnType<typeof taxCode_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM TaxCode${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const taxCode_listEndpoint = defineEndpoint(taxCode_listDef);

const taxCode_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, taxcodeId: IdSchema }).strict(),
);
const taxCode_getOutput = lazySchema(() =>
	z
		.object({
			TaxCode: QuickBooksModelSchemas['taxcoderesponse'],
			time: z.string(),
		})
		.strict(),
);
const taxCode_getDef = {
	input: taxCode_getInput,
	output: taxCode_getOutput,
	request: (input: z.output<ReturnType<typeof taxCode_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxcode/${encodeURIComponent(input.taxcodeId)}`,
		method: 'GET',
	}),
} as const;
const taxCode_getEndpoint = defineEndpoint(taxCode_getDef);

const taxPayment_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const taxPayment_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					TaxPayment: z
						.array(QuickBooksModelSchemas['taxpaymentresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const taxPayment_listDef = {
	input: taxPayment_listInput,
	output: taxPayment_listOutput,
	request: (input: z.output<ReturnType<typeof taxPayment_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM TaxPayment${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const taxPayment_listEndpoint = defineEndpoint(taxPayment_listDef);

const taxPayment_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, taxPaymentId: IdSchema }).strict(),
);
const taxPayment_getOutput = lazySchema(() =>
	z
		.object({
			TaxPayment: QuickBooksModelSchemas['taxpaymentresponse'],
			time: z.string(),
		})
		.strict(),
);
const taxPayment_getDef = {
	input: taxPayment_getInput,
	output: taxPayment_getOutput,
	request: (input: z.output<ReturnType<typeof taxPayment_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxpayment/${encodeURIComponent(input.taxPaymentId)}`,
		method: 'GET',
	}),
} as const;
const taxPayment_getEndpoint = defineEndpoint(taxPayment_getDef);

const taxRate_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const taxRate_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					TaxRate: z
						.array(QuickBooksModelSchemas['taxrateresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const taxRate_listDef = {
	input: taxRate_listInput,
	output: taxRate_listOutput,
	request: (input: z.output<ReturnType<typeof taxRate_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM TaxRate${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const taxRate_listEndpoint = defineEndpoint(taxRate_listDef);

const taxRate_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, taxrateId: IdSchema }).strict(),
);
const taxRate_getOutput = lazySchema(() =>
	z
		.object({
			TaxRate: QuickBooksModelSchemas['taxrateresponse'],
			time: z.string(),
		})
		.strict(),
);
const taxRate_getDef = {
	input: taxRate_getInput,
	output: taxRate_getOutput,
	request: (input: z.output<ReturnType<typeof taxRate_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxrate/${encodeURIComponent(input.taxrateId)}`,
		method: 'GET',
	}),
} as const;
const taxRate_getEndpoint = defineEndpoint(taxRate_getDef);

const taxService_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['taxservicerequest'],
		})
		.strict(),
);
const taxService_createOutput = lazySchema(() =>
	z
		.object({
			TaxService: QuickBooksModelSchemas['taxserviceresponse'],
			time: z.string(),
		})
		.strict(),
);
const taxService_createDef = {
	input: taxService_createInput,
	output: taxService_createOutput,
	request: (input: z.output<ReturnType<typeof taxService_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxservice/taxcode`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const taxService_createEndpoint = defineEndpoint(taxService_createDef);

const taxSummary_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['taxsummaryquery'].partial().optional(),
		})
		.strict(),
);
const taxSummary_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const taxSummary_listDef = {
	input: taxSummary_listInput,
	output: taxSummary_listOutput,
	request: (input: z.output<ReturnType<typeof taxSummary_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/TaxSummary`,
		method: 'GET',
		query: {
			accounting_method: input.params?.['accounting_method'],
			end_date: input.params?.['end_date'],
			date_macro: input.params?.['date_macro'],
			agency_id: input.params?.['agency_id'],
			sort_order: input.params?.['sort_order'],
			start_date: input.params?.['start_date'],
		},
	}),
} as const;
const taxSummary_listEndpoint = defineEndpoint(taxSummary_listDef);

const term_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['termrequest'],
		})
		.strict(),
);
const term_createOutput = lazySchema(() =>
	z
		.object({ Term: QuickBooksModelSchemas['termresponse'], time: z.string() })
		.strict(),
);
const term_createDef = {
	input: term_createInput,
	output: term_createOutput,
	request: (input: z.output<ReturnType<typeof term_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/term`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const term_createEndpoint = defineEndpoint(term_createDef);

const term_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const term_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					Term: z.array(QuickBooksModelSchemas['termresponse']).optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const term_listDef = {
	input: term_listInput,
	output: term_listOutput,
	request: (input: z.output<ReturnType<typeof term_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Term${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const term_listEndpoint = defineEndpoint(term_listDef);

const term_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, termId: IdSchema }).strict(),
);
const term_getOutput = lazySchema(() =>
	z
		.object({ Term: QuickBooksModelSchemas['termresponse'], time: z.string() })
		.strict(),
);
const term_getDef = {
	input: term_getInput,
	output: term_getOutput,
	request: (input: z.output<ReturnType<typeof term_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/term/${encodeURIComponent(input.termId)}`,
		method: 'GET',
	}),
} as const;
const term_getEndpoint = defineEndpoint(term_getDef);

const term_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['termrequest']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const term_updateOutput = lazySchema(() =>
	z
		.object({ Term: QuickBooksModelSchemas['termresponse'], time: z.string() })
		.strict(),
);
const term_updateDef = {
	input: term_updateInput,
	output: term_updateOutput,
	request: (input: z.output<ReturnType<typeof term_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/term`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const term_updateEndpoint = defineEndpoint(term_updateDef);

const timeActivity_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['timeactivityrequest'],
		})
		.strict(),
);
const timeActivity_createOutput = lazySchema(() =>
	z
		.object({
			TimeActivity: QuickBooksModelSchemas['timeactivityresponse'],
			time: z.string(),
		})
		.strict(),
);
const timeActivity_createDef = {
	input: timeActivity_createInput,
	output: timeActivity_createOutput,
	request: (input: z.output<ReturnType<typeof timeActivity_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/timeactivity`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const timeActivity_createEndpoint = defineEndpoint(timeActivity_createDef);

const timeActivity_deleteInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: DeleteBodySchema }).strict(),
);
const timeActivity_deleteOutput = lazySchema(() =>
	z
		.object({
			TimeActivity: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const timeActivity_deleteDef = {
	input: timeActivity_deleteInput,
	output: timeActivity_deleteOutput,
	request: (input: z.output<ReturnType<typeof timeActivity_deleteInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/timeactivity`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const timeActivity_deleteEndpoint = defineEndpoint(timeActivity_deleteDef);

const timeActivity_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const timeActivity_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					TimeActivity: z
						.array(QuickBooksModelSchemas['timeactivityresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const timeActivity_listDef = {
	input: timeActivity_listInput,
	output: timeActivity_listOutput,
	request: (input: z.output<ReturnType<typeof timeActivity_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM TimeActivity${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const timeActivity_listEndpoint = defineEndpoint(timeActivity_listDef);

const timeActivity_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, timeactivityId: IdSchema }).strict(),
);
const timeActivity_getOutput = lazySchema(() =>
	z
		.object({
			TimeActivity: QuickBooksModelSchemas['timeactivityresponse'],
			time: z.string(),
		})
		.strict(),
);
const timeActivity_getDef = {
	input: timeActivity_getInput,
	output: timeActivity_getOutput,
	request: (input: z.output<ReturnType<typeof timeActivity_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/timeactivity/${encodeURIComponent(input.timeactivityId)}`,
		method: 'GET',
	}),
} as const;
const timeActivity_getEndpoint = defineEndpoint(timeActivity_getDef);

const timeActivity_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['timeactivityresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const timeActivity_updateOutput = lazySchema(() =>
	z
		.object({
			TimeActivity: QuickBooksModelSchemas['timeactivityresponse'],
			time: z.string(),
		})
		.strict(),
);
const timeActivity_updateDef = {
	input: timeActivity_updateInput,
	output: timeActivity_updateOutput,
	request: (input: z.output<ReturnType<typeof timeActivity_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/timeactivity`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const timeActivity_updateEndpoint = defineEndpoint(timeActivity_updateDef);

const transactionList_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['transactionlistquery']
				.partial()
				.optional(),
		})
		.strict(),
);
const transactionList_listOutput = lazySchema(
	() => QuickBooksModelSchemas['transactionlistreporttoplevel'],
);
const transactionList_listDef = {
	input: transactionList_listInput,
	output: transactionList_listOutput,
	request: (input: z.output<ReturnType<typeof transactionList_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/TransactionList`,
		method: 'GET',
		query: {
			date_macro: input.params?.['date_macro'],
			payment_method: input.params?.['payment_method'],
			duedate_macro: input.params?.['duedate_macro'],
			arpaid: input.params?.['arpaid'],
			bothamount: input.params?.['bothamount'],
			transaction_type: input.params?.['transaction_type'],
			docnum: input.params?.['docnum'],
			start_moddate: input.params?.['start_moddate'],
			source_account_type: input.params?.['source_account_type'],
			group_by: input.params?.['group_by'],
			start_date: input.params?.['start_date'],
			department: input.params?.['department'],
			start_duedate: input.params?.['start_duedate'],
			columns: input.params?.['columns'],
			end_duedate: input.params?.['end_duedate'],
			vendor: input.params?.['vendor'],
			end_date: input.params?.['end_date'],
			memo: input.params?.['memo'],
			appaid: input.params?.['appaid'],
			moddate_macro: input.params?.['moddate_macro'],
			printed: input.params?.['printed'],
			createdate_macro: input.params?.['createdate_macro'],
			cleared: input.params?.['cleared'],
			customer: input.params?.['customer'],
			qzurl: input.params?.['qzurl'],
			term: input.params?.['term'],
			end_createdate: input.params?.['end_createdate'],
			name: input.params?.['name'],
			sort_by: input.params?.['sort_by'],
			sort_order: input.params?.['sort_order'],
			start_createdate: input.params?.['start_createdate'],
			end_moddate: input.params?.['end_moddate'],
		},
	}),
} as const;
const transactionList_listEndpoint = defineEndpoint(transactionList_listDef);

const transactionListByCustomer_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['transactionlistbycustomerquery']
				.partial()
				.optional(),
		})
		.strict(),
);
const transactionListByCustomer_listOutput = lazySchema(
	() => QuickBooksModelSchemas['transactionlistreporttoplevel'],
);
const transactionListByCustomer_listDef = {
	input: transactionListByCustomer_listInput,
	output: transactionListByCustomer_listOutput,
	request: (
		input: z.output<ReturnType<typeof transactionListByCustomer_listInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/TransactionListByCustomer`,
		method: 'GET',
		query: {
			date_macro: input.params?.['date_macro'],
			payment_method: input.params?.['payment_method'],
			duedate_macro: input.params?.['duedate_macro'],
			arpaid: input.params?.['arpaid'],
			bothamount: input.params?.['bothamount'],
			transaction_type: input.params?.['transaction_type'],
			docnum: input.params?.['docnum'],
			start_moddate: input.params?.['start_moddate'],
			source_account_type: input.params?.['source_account_type'],
			group_by: input.params?.['group_by'],
			start_date: input.params?.['start_date'],
			department: input.params?.['department'],
			start_duedate: input.params?.['start_duedate'],
			columns: input.params?.['columns'],
			end_duedate: input.params?.['end_duedate'],
			end_date: input.params?.['end_date'],
			memo: input.params?.['memo'],
			appaid: input.params?.['appaid'],
			moddate_macro: input.params?.['moddate_macro'],
			printed: input.params?.['printed'],
			createdate_macro: input.params?.['createdate_macro'],
			cleared: input.params?.['cleared'],
			customer: input.params?.['customer'],
			qzurl: input.params?.['qzurl'],
			term: input.params?.['term'],
			end_createdate: input.params?.['end_createdate'],
			name: input.params?.['name'],
			sort_by: input.params?.['sort_by'],
			sort_order: input.params?.['sort_order'],
			start_createdate: input.params?.['start_createdate'],
			end_moddate: input.params?.['end_moddate'],
		},
	}),
} as const;
const transactionListByCustomer_listEndpoint = defineEndpoint(
	transactionListByCustomer_listDef,
);

const transactionListByVendor_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['transactionlistbyvendorquery']
				.partial()
				.optional(),
		})
		.strict(),
);
const transactionListByVendor_listOutput = lazySchema(
	() => QuickBooksModelSchemas['transactionlistreporttoplevel'],
);
const transactionListByVendor_listDef = {
	input: transactionListByVendor_listInput,
	output: transactionListByVendor_listOutput,
	request: (
		input: z.output<ReturnType<typeof transactionListByVendor_listInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/TransactionListByVendor`,
		method: 'GET',
		query: {
			date_macro: input.params?.['date_macro'],
			payment_method: input.params?.['payment_method'],
			duedate_macro: input.params?.['duedate_macro'],
			arpaid: input.params?.['arpaid'],
			bothamount: input.params?.['bothamount'],
			transaction_type: input.params?.['transaction_type'],
			docnum: input.params?.['docnum'],
			start_moddate: input.params?.['start_moddate'],
			source_account_type: input.params?.['source_account_type'],
			group_by: input.params?.['group_by'],
			start_date: input.params?.['start_date'],
			department: input.params?.['department'],
			start_duedate: input.params?.['start_duedate'],
			columns: input.params?.['columns'],
			end_duedate: input.params?.['end_duedate'],
			vendor: input.params?.['vendor'],
			end_date: input.params?.['end_date'],
			memo: input.params?.['memo'],
			appaid: input.params?.['appaid'],
			moddate_macro: input.params?.['moddate_macro'],
			printed: input.params?.['printed'],
			createdate_macro: input.params?.['createdate_macro'],
			cleared: input.params?.['cleared'],
			qzurl: input.params?.['qzurl'],
			term: input.params?.['term'],
			end_createdate: input.params?.['end_createdate'],
			name: input.params?.['name'],
			sort_by: input.params?.['sort_by'],
			sort_order: input.params?.['sort_order'],
			start_createdate: input.params?.['start_createdate'],
			end_moddate: input.params?.['end_moddate'],
		},
	}),
} as const;
const transactionListByVendor_listEndpoint = defineEndpoint(
	transactionListByVendor_listDef,
);

const transactionListWithSplits_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['transactionlistwithsplitsquery']
				.partial()
				.optional(),
		})
		.strict(),
);
const transactionListWithSplits_listOutput = lazySchema(
	() => QuickBooksModelSchemas['transactionlistreporttoplevel'],
);
const transactionListWithSplits_listDef = {
	input: transactionListWithSplits_listInput,
	output: transactionListWithSplits_listOutput,
	request: (
		input: z.output<ReturnType<typeof transactionListWithSplits_listInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/TransactionListWithSplits`,
		method: 'GET',
		query: {
			docnum: input.params?.['docnum'],
			name: input.params?.['name'],
			end_date: input.params?.['end_date'],
			date_macro: input.params?.['date_macro'],
			payment_method: input.params?.['payment_method'],
			source_account_type: input.params?.['source_account_type'],
			transaction_type: input.params?.['transaction_type'],
			group_by: input.params?.['group_by'],
			sort_by: input.params?.['sort_by'],
			sort_order: input.params?.['sort_order'],
			start_date: input.params?.['start_date'],
			columns: input.params?.['columns'],
		},
	}),
} as const;
const transactionListWithSplits_listEndpoint = defineEndpoint(
	transactionListWithSplits_listDef,
);

const transfer_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['transferrequest'],
		})
		.strict(),
);
const transfer_createOutput = lazySchema(() =>
	z
		.object({
			Transfer: QuickBooksModelSchemas['transferresponse'],
			time: z.string(),
		})
		.strict(),
);
const transfer_createDef = {
	input: transfer_createInput,
	output: transfer_createOutput,
	request: (input: z.output<ReturnType<typeof transfer_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/transfer`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const transfer_createEndpoint = defineEndpoint(transfer_createDef);

const transfer_deleteInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['transferresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const transfer_deleteOutput = lazySchema(() =>
	z
		.object({
			Transfer: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const transfer_deleteDef = {
	input: transfer_deleteInput,
	output: transfer_deleteOutput,
	request: (input: z.output<ReturnType<typeof transfer_deleteInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/transfer`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const transfer_deleteEndpoint = defineEndpoint(transfer_deleteDef);

const transfer_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const transfer_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					Transfer: z
						.array(QuickBooksModelSchemas['transferresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const transfer_listDef = {
	input: transfer_listInput,
	output: transfer_listOutput,
	request: (input: z.output<ReturnType<typeof transfer_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Transfer${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const transfer_listEndpoint = defineEndpoint(transfer_listDef);

const transfer_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, transferId: IdSchema }).strict(),
);
const transfer_getOutput = lazySchema(() =>
	z
		.object({
			Transfer: QuickBooksModelSchemas['transferresponse'],
			time: z.string(),
		})
		.strict(),
);
const transfer_getDef = {
	input: transfer_getInput,
	output: transfer_getOutput,
	request: (input: z.output<ReturnType<typeof transfer_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/transfer/${encodeURIComponent(input.transferId)}`,
		method: 'GET',
	}),
} as const;
const transfer_getEndpoint = defineEndpoint(transfer_getDef);

const transfer_sparseUpdateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['transferrequest']
				.partial()
				.extend({
					Id: IdSchema,
					SyncToken: SyncTokenSchema,
					sparse: z.literal(true),
				})
				.strict(),
		})
		.strict(),
);
const transfer_sparseUpdateOutput = lazySchema(() =>
	z
		.object({
			Transfer: QuickBooksModelSchemas['transferresponse'],
			time: z.string(),
		})
		.strict(),
);
const transfer_sparseUpdateDef = {
	input: transfer_sparseUpdateInput,
	output: transfer_sparseUpdateOutput,
	request: (
		input: z.output<ReturnType<typeof transfer_sparseUpdateInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/transfer`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const transfer_sparseUpdateEndpoint = defineEndpoint(transfer_sparseUpdateDef);

const transfer_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['transferrequest']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const transfer_updateOutput = lazySchema(() =>
	z
		.object({
			Transfer: QuickBooksModelSchemas['transferresponse'],
			time: z.string(),
		})
		.strict(),
);
const transfer_updateDef = {
	input: transfer_updateInput,
	output: transfer_updateOutput,
	request: (input: z.output<ReturnType<typeof transfer_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/transfer`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const transfer_updateEndpoint = defineEndpoint(transfer_updateDef);

const trialBalance_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			locale: z.enum(['FR', 'default']).default('default'),
			params: QuickBooksModelSchemas['trialbalancequery'].partial().optional(),
		})
		.strict(),
);
const trialBalance_listOutput = lazySchema(
	() => QuickBooksModelSchemas['trialbalancereporttoplevel'],
);
const trialBalance_listDef = {
	input: trialBalance_listInput,
	output: trialBalance_listOutput,
	request: (input: z.output<ReturnType<typeof trialBalance_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/${input.locale === 'FR' ? 'TrialBalanceFR' : 'TrialBalance'}`,
		method: 'GET',
		query: {
			accounting_method: input.params?.['accounting_method'],
			end_date: input.params?.['end_date'],
			date_macro: input.params?.['date_macro'],
			sort_order: input.params?.['sort_order'],
			summarize_column_by: input.params?.['summarize_column_by'],
			start_date: input.params?.['start_date'],
		},
	}),
} as const;
const trialBalance_listEndpoint = defineEndpoint(trialBalance_listDef);

const vendor_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['vendorrequest'],
		})
		.strict(),
);
const vendor_createOutput = lazySchema(() =>
	z
		.object({
			Vendor: QuickBooksModelSchemas['vendorresponse'],
			time: z.string(),
		})
		.strict(),
);
const vendor_createDef = {
	input: vendor_createInput,
	output: vendor_createOutput,
	request: (input: z.output<ReturnType<typeof vendor_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/vendor`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const vendor_createEndpoint = defineEndpoint(vendor_createDef);

const vendor_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const vendor_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					Vendor: z.array(QuickBooksModelSchemas['vendorresponse']).optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const vendor_listDef = {
	input: vendor_listInput,
	output: vendor_listOutput,
	request: (input: z.output<ReturnType<typeof vendor_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Vendor${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const vendor_listEndpoint = defineEndpoint(vendor_listDef);

const vendor_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, vendorId: IdSchema }).strict(),
);
const vendor_getOutput = lazySchema(() =>
	z
		.object({
			Vendor: QuickBooksModelSchemas['vendorresponse'],
			time: z.string(),
		})
		.strict(),
);
const vendor_getDef = {
	input: vendor_getInput,
	output: vendor_getOutput,
	request: (input: z.output<ReturnType<typeof vendor_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/vendor/${encodeURIComponent(input.vendorId)}`,
		method: 'GET',
	}),
} as const;
const vendor_getEndpoint = defineEndpoint(vendor_getDef);

const vendor_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['vendorresponse']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const vendor_updateOutput = lazySchema(() =>
	z
		.object({
			Vendor: QuickBooksModelSchemas['vendorresponse'],
			time: z.string(),
		})
		.strict(),
);
const vendor_updateDef = {
	input: vendor_updateInput,
	output: vendor_updateOutput,
	request: (input: z.output<ReturnType<typeof vendor_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/vendor`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const vendor_updateEndpoint = defineEndpoint(vendor_updateDef);

const vendorBalance_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['vendorbalancequery'].partial().optional(),
		})
		.strict(),
);
const vendorBalance_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const vendorBalance_listDef = {
	input: vendorBalance_listInput,
	output: vendorBalance_listOutput,
	request: (input: z.output<ReturnType<typeof vendorBalance_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/VendorBalance`,
		method: 'GET',
		query: {
			qzurl: input.params?.['qzurl'],
			accounting_method: input.params?.['accounting_method'],
			date_macro: input.params?.['date_macro'],
			appaid: input.params?.['appaid'],
			report_date: input.params?.['report_date'],
			sort_order: input.params?.['sort_order'],
			summarize_column_by: input.params?.['summarize_column_by'],
			department: input.params?.['department'],
			vendor: input.params?.['vendor'],
		},
	}),
} as const;
const vendorBalance_listEndpoint = defineEndpoint(vendorBalance_listDef);

const vendorBalanceDetail_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['vendorbalancedetailquery']
				.partial()
				.optional(),
		})
		.strict(),
);
const vendorBalanceDetail_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const vendorBalanceDetail_listDef = {
	input: vendorBalanceDetail_listInput,
	output: vendorBalanceDetail_listOutput,
	request: (
		input: z.output<ReturnType<typeof vendorBalanceDetail_listInput>>,
	) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/VendorBalanceDetail`,
		method: 'GET',
		query: {
			term: input.params?.['term'],
			end_duedate: input.params?.['end_duedate'],
			accounting_method: input.params?.['accounting_method'],
			date_macro: input.params?.['date_macro'],
			start_duedate: input.params?.['start_duedate'],
			duedate_macro: input.params?.['duedate_macro'],
			sort_by: input.params?.['sort_by'],
			report_date: input.params?.['report_date'],
			sort_order: input.params?.['sort_order'],
			appaid: input.params?.['appaid'],
			department: input.params?.['department'],
			vendor: input.params?.['vendor'],
			columns: input.params?.['columns'],
		},
	}),
} as const;
const vendorBalanceDetail_listEndpoint = defineEndpoint(
	vendorBalanceDetail_listDef,
);

const vendorCredit_createInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['vendorcreditrequest'],
		})
		.strict(),
);
const vendorCredit_createOutput = lazySchema(() =>
	z
		.object({
			VendorCredit: QuickBooksModelSchemas['vendorcreditresponse'],
			time: z.string(),
		})
		.strict(),
);
const vendorCredit_createDef = {
	input: vendorCredit_createInput,
	output: vendorCredit_createOutput,
	request: (input: z.output<ReturnType<typeof vendorCredit_createInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/vendorcredit`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const vendorCredit_createEndpoint = defineEndpoint(vendorCredit_createDef);

const vendorCredit_deleteInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, body: DeleteBodySchema }).strict(),
);
const vendorCredit_deleteOutput = lazySchema(() =>
	z
		.object({
			VendorCredit: z
				.object({
					status: z.literal('Deleted'),
					Id: IdSchema,
					domain: z.literal('QBO').optional(),
				})
				.strict(),
			time: z.string().optional(),
		})
		.strict(),
);
const vendorCredit_deleteDef = {
	input: vendorCredit_deleteInput,
	output: vendorCredit_deleteOutput,
	request: (input: z.output<ReturnType<typeof vendorCredit_deleteInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/vendorcredit`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const vendorCredit_deleteEndpoint = defineEndpoint(vendorCredit_deleteDef);

const vendorCredit_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			startPosition: z.number().int().min(1).optional(),
			maxResults: z.number().int().min(1).max(1000).optional(),
		})
		.strict(),
);
const vendorCredit_listOutput = lazySchema(() =>
	z
		.object({
			QueryResponse: z
				.object({
					startPosition: z.number().optional(),
					maxResults: z.number().optional(),
					totalCount: z.number().optional(),
					VendorCredit: z
						.array(QuickBooksModelSchemas['vendorcreditresponse'])
						.optional(),
				})
				.strict(),
			time: z.string(),
		})
		.strict(),
);
const vendorCredit_listDef = {
	input: vendorCredit_listInput,
	output: vendorCredit_listOutput,
	request: (input: z.output<ReturnType<typeof vendorCredit_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM VendorCredit${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const vendorCredit_listEndpoint = defineEndpoint(vendorCredit_listDef);

const vendorCredit_getInput = lazySchema(() =>
	z.object({ realmId: RealmIdSchema, vendorcreditId: IdSchema }).strict(),
);
const vendorCredit_getOutput = lazySchema(() =>
	z
		.object({
			VendorCredit: QuickBooksModelSchemas['vendorcreditresponse'],
			time: z.string(),
		})
		.strict(),
);
const vendorCredit_getDef = {
	input: vendorCredit_getInput,
	output: vendorCredit_getOutput,
	request: (input: z.output<ReturnType<typeof vendorCredit_getInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/vendorcredit/${encodeURIComponent(input.vendorcreditId)}`,
		method: 'GET',
	}),
} as const;
const vendorCredit_getEndpoint = defineEndpoint(vendorCredit_getDef);

const vendorCredit_updateInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			body: QuickBooksModelSchemas['vendorcreditrequest']
				.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
				.strict(),
		})
		.strict(),
);
const vendorCredit_updateOutput = lazySchema(() =>
	z
		.object({
			VendorCredit: QuickBooksModelSchemas['vendorcreditresponse'],
			time: z.string(),
		})
		.strict(),
);
const vendorCredit_updateDef = {
	input: vendorCredit_updateInput,
	output: vendorCredit_updateOutput,
	request: (input: z.output<ReturnType<typeof vendorCredit_updateInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/vendorcredit`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const vendorCredit_updateEndpoint = defineEndpoint(vendorCredit_updateDef);

const vendorExpenses_listInput = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			params: QuickBooksModelSchemas['vendorexpensesquery']
				.partial()
				.optional(),
		})
		.strict(),
);
const vendorExpenses_listOutput = lazySchema(
	() => QuickBooksModelSchemas['reporttoplevel'],
);
const vendorExpenses_listDef = {
	input: vendorExpenses_listInput,
	output: vendorExpenses_listOutput,
	request: (input: z.output<ReturnType<typeof vendorExpenses_listInput>>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/VendorExpenses`,
		method: 'GET',
		query: {
			customer: input.params?.['customer'],
			vendor: input.params?.['vendor'],
			end_date: input.params?.['end_date'],
			date_macro: input.params?.['date_macro'],
			class: input.params?.['class'],
			sort_order: input.params?.['sort_order'],
			summarize_column_by: input.params?.['summarize_column_by'],
			department: input.params?.['department'],
			accounting_method: input.params?.['accounting_method'],
			start_date: input.params?.['start_date'],
		},
	}),
} as const;
const vendorExpenses_listEndpoint = defineEndpoint(vendorExpenses_listDef);

export const QuickBooksCatalogEndpoints = {
	apAgingDetail: {
		list: apAgingDetail_listEndpoint,
	},
	apAgingSummary: {
		list: apAgingSummary_listEndpoint,
	},
	arAgingDetail: {
		list: arAgingDetail_listEndpoint,
	},
	arAgingSummary: {
		list: arAgingSummary_listEndpoint,
	},
	accounts: {
		update: accounts_updateEndpoint,
	},
	accountListDetail: {
		list: accountListDetail_listEndpoint,
	},
	attachable: {
		create: attachable_createEndpoint,
		delete: attachable_deleteEndpoint,
		download: attachable_downloadEndpoint,
		list: attachable_listEndpoint,
		get: attachable_getEndpoint,
		update: attachable_updateEndpoint,
		upload: attachable_uploadEndpoint,
	},
	balanceSheet: {
		list: balanceSheet_listEndpoint,
	},
	bill: {
		create: bill_createEndpoint,
		delete: bill_deleteEndpoint,
		list: bill_listEndpoint,
		get: bill_getEndpoint,
		update: bill_updateEndpoint,
	},
	billPayment: {
		create: billPayment_createEndpoint,
		void: billPayment_voidEndpoint,
		delete: billPayment_deleteEndpoint,
		list: billPayment_listEndpoint,
		get: billPayment_getEndpoint,
		update: billPayment_updateEndpoint,
	},
	budget: {
		create: budget_createEndpoint,
		delete: budget_deleteEndpoint,
		list: budget_listEndpoint,
		get: budget_getEndpoint,
		update: budget_updateEndpoint,
	},
	cashFlow: {
		list: cashFlow_listEndpoint,
	},
	changeOrder: {
		create: changeOrder_createEndpoint,
		delete: changeOrder_deleteEndpoint,
		get: changeOrder_getEndpoint,
		update: changeOrder_updateEndpoint,
	},
	class: {
		create: class_createEndpoint,
		list: class_listEndpoint,
		get: class_getEndpoint,
		update: class_updateEndpoint,
	},
	companyCurrency: {
		create: companyCurrency_createEndpoint,
		list: companyCurrency_listEndpoint,
		get: companyCurrency_getEndpoint,
		update: companyCurrency_updateEndpoint,
	},
	company: {
		update: company_updateEndpoint,
		sparseUpdate: company_sparseUpdateEndpoint,
	},
	creditCardPayment: {
		create: creditCardPayment_createEndpoint,
		delete: creditCardPayment_deleteEndpoint,
		list: creditCardPayment_listEndpoint,
		get: creditCardPayment_getEndpoint,
		update: creditCardPayment_updateEndpoint,
		sparseUpdate: creditCardPayment_sparseUpdateEndpoint,
	},
	creditMemo: {
		create: creditMemo_createEndpoint,
		delete: creditMemo_deleteEndpoint,
		getPdf: creditMemo_getPdfEndpoint,
		list: creditMemo_listEndpoint,
		get: creditMemo_getEndpoint,
		send: creditMemo_sendEndpoint,
		update: creditMemo_updateEndpoint,
	},
	customer: {
		create: customer_createEndpoint,
		list: customer_listEndpoint,
		get: customer_getEndpoint,
		update: customer_updateEndpoint,
		sparseUpdate: customer_sparseUpdateEndpoint,
	},
	customerBalance: {
		list: customerBalance_listEndpoint,
	},
	customerBalanceDetail: {
		list: customerBalanceDetail_listEndpoint,
	},
	customerIncome: {
		list: customerIncome_listEndpoint,
	},
	customerType: {
		list: customerType_listEndpoint,
		get: customerType_getEndpoint,
	},
	department: {
		create: department_createEndpoint,
		list: department_listEndpoint,
		get: department_getEndpoint,
		update: department_updateEndpoint,
	},
	deposit: {
		create: deposit_createEndpoint,
		delete: deposit_deleteEndpoint,
		list: deposit_listEndpoint,
		get: deposit_getEndpoint,
		update: deposit_updateEndpoint,
		sparseUpdate: deposit_sparseUpdateEndpoint,
	},
	employee: {
		create: employee_createEndpoint,
		list: employee_listEndpoint,
		get: employee_getEndpoint,
		update: employee_updateEndpoint,
	},
	estimate: {
		create: estimate_createEndpoint,
		delete: estimate_deleteEndpoint,
		getPdf: estimate_getPdfEndpoint,
		list: estimate_listEndpoint,
		get: estimate_getEndpoint,
		send: estimate_sendEndpoint,
		sparseUpdate: estimate_sparseUpdateEndpoint,
		update: estimate_updateEndpoint,
	},
	exchangerate: {
		get: exchangerate_getEndpoint,
		list: exchangerate_listEndpoint,
		update: exchangerate_updateEndpoint,
	},
	generalLedger: {
		list: generalLedger_listEndpoint,
	},
	inventoryAdjustment: {
		create: inventoryAdjustment_createEndpoint,
		delete: inventoryAdjustment_deleteEndpoint,
		get: inventoryAdjustment_getEndpoint,
		sparseUpdate: inventoryAdjustment_sparseUpdateEndpoint,
	},
	inventoryValuationDetail: {
		list: inventoryValuationDetail_listEndpoint,
	},
	inventoryValuationSummary: {
		list: inventoryValuationSummary_listEndpoint,
	},
	invoice: {
		create: invoice_createEndpoint,
		delete: invoice_deleteEndpoint,
		void: invoice_voidEndpoint,
		getPdf: invoice_getPdfEndpoint,
		list: invoice_listEndpoint,
		get: invoice_getEndpoint,
		send: invoice_sendEndpoint,
		sparseUpdate: invoice_sparseUpdateEndpoint,
		update: invoice_updateEndpoint,
	},
	item: {
		create: item_createEndpoint,
		createCategory: item_createCategoryEndpoint,
		listBundles: item_listBundlesEndpoint,
		listCategories: item_listCategoriesEndpoint,
		listItems: item_listItemsEndpoint,
		getBundle: item_getBundleEndpoint,
		getCategory: item_getCategoryEndpoint,
		getItem: item_getItemEndpoint,
		update: item_updateEndpoint,
		updateCategory: item_updateCategoryEndpoint,
	},
	journalEntry: {
		create: journalEntry_createEndpoint,
		delete: journalEntry_deleteEndpoint,
		list: journalEntry_listEndpoint,
		get: journalEntry_getEndpoint,
		update: journalEntry_updateEndpoint,
		sparseUpdate: journalEntry_sparseUpdateEndpoint,
	},
	journalReport: {
		list: journalReport_listEndpoint,
	},
	payment: {
		create: payment_createEndpoint,
		delete: payment_deleteEndpoint,
		void: payment_voidEndpoint,
		getPdf: payment_getPdfEndpoint,
		list: payment_listEndpoint,
		get: payment_getEndpoint,
		send: payment_sendEndpoint,
		update: payment_updateEndpoint,
	},
	paymentMethod: {
		create: paymentMethod_createEndpoint,
		list: paymentMethod_listEndpoint,
		get: paymentMethod_getEndpoint,
		update: paymentMethod_updateEndpoint,
	},
	preferences: {
		list: preferences_listEndpoint,
		get: preferences_getEndpoint,
		update: preferences_updateEndpoint,
	},
	profitAndLoss: {
		list: profitAndLoss_listEndpoint,
	},
	profitAndLossDetail: {
		list: profitAndLossDetail_listEndpoint,
	},
	purchase: {
		create: purchase_createEndpoint,
		delete: purchase_deleteEndpoint,
		list: purchase_listEndpoint,
		get: purchase_getEndpoint,
		update: purchase_updateEndpoint,
	},
	purchaseOrder: {
		create: purchaseOrder_createEndpoint,
		delete: purchaseOrder_deleteEndpoint,
		getPdf: purchaseOrder_getPdfEndpoint,
		list: purchaseOrder_listEndpoint,
		get: purchaseOrder_getEndpoint,
		send: purchaseOrder_sendEndpoint,
		update: purchaseOrder_updateEndpoint,
	},
	recurringTransaction: {
		create: recurringTransaction_createEndpoint,
		delete: recurringTransaction_deleteEndpoint,
		list: recurringTransaction_listEndpoint,
		get: recurringTransaction_getEndpoint,
	},
	refundReceipt: {
		create: refundReceipt_createEndpoint,
		delete: refundReceipt_deleteEndpoint,
		getPdf: refundReceipt_getPdfEndpoint,
		list: refundReceipt_listEndpoint,
		get: refundReceipt_getEndpoint,
		send: refundReceipt_sendEndpoint,
		sparseUpdate: refundReceipt_sparseUpdateEndpoint,
		update: refundReceipt_updateEndpoint,
	},
	reimburseCharge: {
		list: reimburseCharge_listEndpoint,
		get: reimburseCharge_getEndpoint,
	},
	salesByClassSummary: {
		list: salesByClassSummary_listEndpoint,
	},
	salesByCustomer: {
		list: salesByCustomer_listEndpoint,
	},
	salesByDepartment: {
		list: salesByDepartment_listEndpoint,
	},
	salesByProduct: {
		list: salesByProduct_listEndpoint,
	},
	salesReceipt: {
		create: salesReceipt_createEndpoint,
		delete: salesReceipt_deleteEndpoint,
		void: salesReceipt_voidEndpoint,
		getPdf: salesReceipt_getPdfEndpoint,
		list: salesReceipt_listEndpoint,
		get: salesReceipt_getEndpoint,
		send: salesReceipt_sendEndpoint,
		update: salesReceipt_updateEndpoint,
		sparseUpdate: salesReceipt_sparseUpdateEndpoint,
	},
	taxAgency: {
		create: taxAgency_createEndpoint,
		list: taxAgency_listEndpoint,
		get: taxAgency_getEndpoint,
	},
	taxClassification: {
		get: taxClassification_getEndpoint,
		listChildren: taxClassification_listChildrenEndpoint,
		list: taxClassification_listEndpoint,
		listByLevel: taxClassification_listByLevelEndpoint,
	},
	taxCode: {
		list: taxCode_listEndpoint,
		get: taxCode_getEndpoint,
	},
	taxPayment: {
		list: taxPayment_listEndpoint,
		get: taxPayment_getEndpoint,
	},
	taxRate: {
		list: taxRate_listEndpoint,
		get: taxRate_getEndpoint,
	},
	taxService: {
		create: taxService_createEndpoint,
	},
	taxSummary: {
		list: taxSummary_listEndpoint,
	},
	term: {
		create: term_createEndpoint,
		list: term_listEndpoint,
		get: term_getEndpoint,
		update: term_updateEndpoint,
	},
	timeActivity: {
		create: timeActivity_createEndpoint,
		delete: timeActivity_deleteEndpoint,
		list: timeActivity_listEndpoint,
		get: timeActivity_getEndpoint,
		update: timeActivity_updateEndpoint,
	},
	transactionList: {
		list: transactionList_listEndpoint,
	},
	transactionListByCustomer: {
		list: transactionListByCustomer_listEndpoint,
	},
	transactionListByVendor: {
		list: transactionListByVendor_listEndpoint,
	},
	transactionListWithSplits: {
		list: transactionListWithSplits_listEndpoint,
	},
	transfer: {
		create: transfer_createEndpoint,
		delete: transfer_deleteEndpoint,
		list: transfer_listEndpoint,
		get: transfer_getEndpoint,
		sparseUpdate: transfer_sparseUpdateEndpoint,
		update: transfer_updateEndpoint,
	},
	trialBalance: {
		list: trialBalance_listEndpoint,
	},
	vendor: {
		create: vendor_createEndpoint,
		list: vendor_listEndpoint,
		get: vendor_getEndpoint,
		update: vendor_updateEndpoint,
	},
	vendorBalance: {
		list: vendorBalance_listEndpoint,
	},
	vendorBalanceDetail: {
		list: vendorBalanceDetail_listEndpoint,
	},
	vendorCredit: {
		create: vendorCredit_createEndpoint,
		delete: vendorCredit_deleteEndpoint,
		list: vendorCredit_listEndpoint,
		get: vendorCredit_getEndpoint,
		update: vendorCredit_updateEndpoint,
	},
	vendorExpenses: {
		list: vendorExpenses_listEndpoint,
	},
} as const;

// Typed loosely on purpose: each operation's exact types live in QuickBooksCatalogEndpointInputs/Outputs.
export const QuickBooksCatalogEndpointSchemas: Record<
	string,
	{ readonly input: z.ZodType; readonly output: z.ZodType }
> = {
	'apAgingDetail.list': lazySchemaEntry(
		apAgingDetail_listInput,
		apAgingDetail_listOutput,
	),
	'apAgingSummary.list': lazySchemaEntry(
		apAgingSummary_listInput,
		apAgingSummary_listOutput,
	),
	'arAgingDetail.list': lazySchemaEntry(
		arAgingDetail_listInput,
		arAgingDetail_listOutput,
	),
	'arAgingSummary.list': lazySchemaEntry(
		arAgingSummary_listInput,
		arAgingSummary_listOutput,
	),
	'accounts.update': lazySchemaEntry(
		accounts_updateInput,
		accounts_updateOutput,
	),
	'accountListDetail.list': lazySchemaEntry(
		accountListDetail_listInput,
		accountListDetail_listOutput,
	),
	'attachable.create': lazySchemaEntry(
		attachable_createInput,
		attachable_createOutput,
	),
	'attachable.delete': lazySchemaEntry(
		attachable_deleteInput,
		attachable_deleteOutput,
	),
	'attachable.download': lazySchemaEntry(
		attachable_downloadInput,
		attachable_downloadOutput,
	),
	'attachable.list': lazySchemaEntry(
		attachable_listInput,
		attachable_listOutput,
	),
	'attachable.get': lazySchemaEntry(attachable_getInput, attachable_getOutput),
	'attachable.update': lazySchemaEntry(
		attachable_updateInput,
		attachable_updateOutput,
	),
	'attachable.upload': lazySchemaEntry(
		attachable_uploadInput,
		attachable_uploadOutput,
	),
	'balanceSheet.list': lazySchemaEntry(
		balanceSheet_listInput,
		balanceSheet_listOutput,
	),
	'bill.create': lazySchemaEntry(bill_createInput, bill_createOutput),
	'bill.delete': lazySchemaEntry(bill_deleteInput, bill_deleteOutput),
	'bill.list': lazySchemaEntry(bill_listInput, bill_listOutput),
	'bill.get': lazySchemaEntry(bill_getInput, bill_getOutput),
	'bill.update': lazySchemaEntry(bill_updateInput, bill_updateOutput),
	'billPayment.create': lazySchemaEntry(
		billPayment_createInput,
		billPayment_createOutput,
	),
	'billPayment.void': lazySchemaEntry(
		billPayment_voidInput,
		billPayment_voidOutput,
	),
	'billPayment.delete': lazySchemaEntry(
		billPayment_deleteInput,
		billPayment_deleteOutput,
	),
	'billPayment.list': lazySchemaEntry(
		billPayment_listInput,
		billPayment_listOutput,
	),
	'billPayment.get': lazySchemaEntry(
		billPayment_getInput,
		billPayment_getOutput,
	),
	'billPayment.update': lazySchemaEntry(
		billPayment_updateInput,
		billPayment_updateOutput,
	),
	'budget.create': lazySchemaEntry(budget_createInput, budget_createOutput),
	'budget.delete': lazySchemaEntry(budget_deleteInput, budget_deleteOutput),
	'budget.list': lazySchemaEntry(budget_listInput, budget_listOutput),
	'budget.get': lazySchemaEntry(budget_getInput, budget_getOutput),
	'budget.update': lazySchemaEntry(budget_updateInput, budget_updateOutput),
	'cashFlow.list': lazySchemaEntry(cashFlow_listInput, cashFlow_listOutput),
	'changeOrder.create': lazySchemaEntry(
		changeOrder_createInput,
		changeOrder_createOutput,
	),
	'changeOrder.delete': lazySchemaEntry(
		changeOrder_deleteInput,
		changeOrder_deleteOutput,
	),
	'changeOrder.get': lazySchemaEntry(
		changeOrder_getInput,
		changeOrder_getOutput,
	),
	'changeOrder.update': lazySchemaEntry(
		changeOrder_updateInput,
		changeOrder_updateOutput,
	),
	'class.create': lazySchemaEntry(class_createInput, class_createOutput),
	'class.list': lazySchemaEntry(class_listInput, class_listOutput),
	'class.get': lazySchemaEntry(class_getInput, class_getOutput),
	'class.update': lazySchemaEntry(class_updateInput, class_updateOutput),
	'companyCurrency.create': lazySchemaEntry(
		companyCurrency_createInput,
		companyCurrency_createOutput,
	),
	'companyCurrency.list': lazySchemaEntry(
		companyCurrency_listInput,
		companyCurrency_listOutput,
	),
	'companyCurrency.get': lazySchemaEntry(
		companyCurrency_getInput,
		companyCurrency_getOutput,
	),
	'companyCurrency.update': lazySchemaEntry(
		companyCurrency_updateInput,
		companyCurrency_updateOutput,
	),
	'company.update': lazySchemaEntry(company_updateInput, company_updateOutput),
	'company.sparseUpdate': lazySchemaEntry(
		company_sparseUpdateInput,
		company_sparseUpdateOutput,
	),
	'creditCardPayment.create': lazySchemaEntry(
		creditCardPayment_createInput,
		creditCardPayment_createOutput,
	),
	'creditCardPayment.delete': lazySchemaEntry(
		creditCardPayment_deleteInput,
		creditCardPayment_deleteOutput,
	),
	'creditCardPayment.list': lazySchemaEntry(
		creditCardPayment_listInput,
		creditCardPayment_listOutput,
	),
	'creditCardPayment.get': lazySchemaEntry(
		creditCardPayment_getInput,
		creditCardPayment_getOutput,
	),
	'creditCardPayment.update': lazySchemaEntry(
		creditCardPayment_updateInput,
		creditCardPayment_updateOutput,
	),
	'creditCardPayment.sparseUpdate': lazySchemaEntry(
		creditCardPayment_sparseUpdateInput,
		creditCardPayment_sparseUpdateOutput,
	),
	'creditMemo.create': lazySchemaEntry(
		creditMemo_createInput,
		creditMemo_createOutput,
	),
	'creditMemo.delete': lazySchemaEntry(
		creditMemo_deleteInput,
		creditMemo_deleteOutput,
	),
	'creditMemo.getPdf': lazySchemaEntry(
		creditMemo_getPdfInput,
		creditMemo_getPdfOutput,
	),
	'creditMemo.list': lazySchemaEntry(
		creditMemo_listInput,
		creditMemo_listOutput,
	),
	'creditMemo.get': lazySchemaEntry(creditMemo_getInput, creditMemo_getOutput),
	'creditMemo.send': lazySchemaEntry(
		creditMemo_sendInput,
		creditMemo_sendOutput,
	),
	'creditMemo.update': lazySchemaEntry(
		creditMemo_updateInput,
		creditMemo_updateOutput,
	),
	'customer.create': lazySchemaEntry(
		customer_createInput,
		customer_createOutput,
	),
	'customer.list': lazySchemaEntry(customer_listInput, customer_listOutput),
	'customer.get': lazySchemaEntry(customer_getInput, customer_getOutput),
	'customer.update': lazySchemaEntry(
		customer_updateInput,
		customer_updateOutput,
	),
	'customer.sparseUpdate': lazySchemaEntry(
		customer_sparseUpdateInput,
		customer_sparseUpdateOutput,
	),
	'customerBalance.list': lazySchemaEntry(
		customerBalance_listInput,
		customerBalance_listOutput,
	),
	'customerBalanceDetail.list': lazySchemaEntry(
		customerBalanceDetail_listInput,
		customerBalanceDetail_listOutput,
	),
	'customerIncome.list': lazySchemaEntry(
		customerIncome_listInput,
		customerIncome_listOutput,
	),
	'customerType.list': lazySchemaEntry(
		customerType_listInput,
		customerType_listOutput,
	),
	'customerType.get': lazySchemaEntry(
		customerType_getInput,
		customerType_getOutput,
	),
	'department.create': lazySchemaEntry(
		department_createInput,
		department_createOutput,
	),
	'department.list': lazySchemaEntry(
		department_listInput,
		department_listOutput,
	),
	'department.get': lazySchemaEntry(department_getInput, department_getOutput),
	'department.update': lazySchemaEntry(
		department_updateInput,
		department_updateOutput,
	),
	'deposit.create': lazySchemaEntry(deposit_createInput, deposit_createOutput),
	'deposit.delete': lazySchemaEntry(deposit_deleteInput, deposit_deleteOutput),
	'deposit.list': lazySchemaEntry(deposit_listInput, deposit_listOutput),
	'deposit.get': lazySchemaEntry(deposit_getInput, deposit_getOutput),
	'deposit.update': lazySchemaEntry(deposit_updateInput, deposit_updateOutput),
	'deposit.sparseUpdate': lazySchemaEntry(
		deposit_sparseUpdateInput,
		deposit_sparseUpdateOutput,
	),
	'employee.create': lazySchemaEntry(
		employee_createInput,
		employee_createOutput,
	),
	'employee.list': lazySchemaEntry(employee_listInput, employee_listOutput),
	'employee.get': lazySchemaEntry(employee_getInput, employee_getOutput),
	'employee.update': lazySchemaEntry(
		employee_updateInput,
		employee_updateOutput,
	),
	'estimate.create': lazySchemaEntry(
		estimate_createInput,
		estimate_createOutput,
	),
	'estimate.delete': lazySchemaEntry(
		estimate_deleteInput,
		estimate_deleteOutput,
	),
	'estimate.getPdf': lazySchemaEntry(
		estimate_getPdfInput,
		estimate_getPdfOutput,
	),
	'estimate.list': lazySchemaEntry(estimate_listInput, estimate_listOutput),
	'estimate.get': lazySchemaEntry(estimate_getInput, estimate_getOutput),
	'estimate.send': lazySchemaEntry(estimate_sendInput, estimate_sendOutput),
	'estimate.sparseUpdate': lazySchemaEntry(
		estimate_sparseUpdateInput,
		estimate_sparseUpdateOutput,
	),
	'estimate.update': lazySchemaEntry(
		estimate_updateInput,
		estimate_updateOutput,
	),
	'exchangerate.get': lazySchemaEntry(
		exchangerate_getInput,
		exchangerate_getOutput,
	),
	'exchangerate.list': lazySchemaEntry(
		exchangerate_listInput,
		exchangerate_listOutput,
	),
	'exchangerate.update': lazySchemaEntry(
		exchangerate_updateInput,
		exchangerate_updateOutput,
	),
	'generalLedger.list': lazySchemaEntry(
		generalLedger_listInput,
		generalLedger_listOutput,
	),
	'inventoryAdjustment.create': lazySchemaEntry(
		inventoryAdjustment_createInput,
		inventoryAdjustment_createOutput,
	),
	'inventoryAdjustment.delete': lazySchemaEntry(
		inventoryAdjustment_deleteInput,
		inventoryAdjustment_deleteOutput,
	),
	'inventoryAdjustment.get': lazySchemaEntry(
		inventoryAdjustment_getInput,
		inventoryAdjustment_getOutput,
	),
	'inventoryAdjustment.sparseUpdate': lazySchemaEntry(
		inventoryAdjustment_sparseUpdateInput,
		inventoryAdjustment_sparseUpdateOutput,
	),
	'inventoryValuationDetail.list': lazySchemaEntry(
		inventoryValuationDetail_listInput,
		inventoryValuationDetail_listOutput,
	),
	'inventoryValuationSummary.list': lazySchemaEntry(
		inventoryValuationSummary_listInput,
		inventoryValuationSummary_listOutput,
	),
	'invoice.create': lazySchemaEntry(invoice_createInput, invoice_createOutput),
	'invoice.delete': lazySchemaEntry(invoice_deleteInput, invoice_deleteOutput),
	'invoice.void': lazySchemaEntry(invoice_voidInput, invoice_voidOutput),
	'invoice.getPdf': lazySchemaEntry(invoice_getPdfInput, invoice_getPdfOutput),
	'invoice.list': lazySchemaEntry(invoice_listInput, invoice_listOutput),
	'invoice.get': lazySchemaEntry(invoice_getInput, invoice_getOutput),
	'invoice.send': lazySchemaEntry(invoice_sendInput, invoice_sendOutput),
	'invoice.sparseUpdate': lazySchemaEntry(
		invoice_sparseUpdateInput,
		invoice_sparseUpdateOutput,
	),
	'invoice.update': lazySchemaEntry(invoice_updateInput, invoice_updateOutput),
	'item.create': lazySchemaEntry(item_createInput, item_createOutput),
	'item.createCategory': lazySchemaEntry(
		item_createCategoryInput,
		item_createCategoryOutput,
	),
	'item.listBundles': lazySchemaEntry(
		item_listBundlesInput,
		item_listBundlesOutput,
	),
	'item.listCategories': lazySchemaEntry(
		item_listCategoriesInput,
		item_listCategoriesOutput,
	),
	'item.listItems': lazySchemaEntry(item_listItemsInput, item_listItemsOutput),
	'item.getBundle': lazySchemaEntry(item_getBundleInput, item_getBundleOutput),
	'item.getCategory': lazySchemaEntry(
		item_getCategoryInput,
		item_getCategoryOutput,
	),
	'item.getItem': lazySchemaEntry(item_getItemInput, item_getItemOutput),
	'item.update': lazySchemaEntry(item_updateInput, item_updateOutput),
	'item.updateCategory': lazySchemaEntry(
		item_updateCategoryInput,
		item_updateCategoryOutput,
	),
	'journalEntry.create': lazySchemaEntry(
		journalEntry_createInput,
		journalEntry_createOutput,
	),
	'journalEntry.delete': lazySchemaEntry(
		journalEntry_deleteInput,
		journalEntry_deleteOutput,
	),
	'journalEntry.list': lazySchemaEntry(
		journalEntry_listInput,
		journalEntry_listOutput,
	),
	'journalEntry.get': lazySchemaEntry(
		journalEntry_getInput,
		journalEntry_getOutput,
	),
	'journalEntry.update': lazySchemaEntry(
		journalEntry_updateInput,
		journalEntry_updateOutput,
	),
	'journalEntry.sparseUpdate': lazySchemaEntry(
		journalEntry_sparseUpdateInput,
		journalEntry_sparseUpdateOutput,
	),
	'journalReport.list': lazySchemaEntry(
		journalReport_listInput,
		journalReport_listOutput,
	),
	'payment.create': lazySchemaEntry(payment_createInput, payment_createOutput),
	'payment.delete': lazySchemaEntry(payment_deleteInput, payment_deleteOutput),
	'payment.void': lazySchemaEntry(payment_voidInput, payment_voidOutput),
	'payment.getPdf': lazySchemaEntry(payment_getPdfInput, payment_getPdfOutput),
	'payment.list': lazySchemaEntry(payment_listInput, payment_listOutput),
	'payment.get': lazySchemaEntry(payment_getInput, payment_getOutput),
	'payment.send': lazySchemaEntry(payment_sendInput, payment_sendOutput),
	'payment.update': lazySchemaEntry(payment_updateInput, payment_updateOutput),
	'paymentMethod.create': lazySchemaEntry(
		paymentMethod_createInput,
		paymentMethod_createOutput,
	),
	'paymentMethod.list': lazySchemaEntry(
		paymentMethod_listInput,
		paymentMethod_listOutput,
	),
	'paymentMethod.get': lazySchemaEntry(
		paymentMethod_getInput,
		paymentMethod_getOutput,
	),
	'paymentMethod.update': lazySchemaEntry(
		paymentMethod_updateInput,
		paymentMethod_updateOutput,
	),
	'preferences.list': lazySchemaEntry(
		preferences_listInput,
		preferences_listOutput,
	),
	'preferences.get': lazySchemaEntry(
		preferences_getInput,
		preferences_getOutput,
	),
	'preferences.update': lazySchemaEntry(
		preferences_updateInput,
		preferences_updateOutput,
	),
	'profitAndLoss.list': lazySchemaEntry(
		profitAndLoss_listInput,
		profitAndLoss_listOutput,
	),
	'profitAndLossDetail.list': lazySchemaEntry(
		profitAndLossDetail_listInput,
		profitAndLossDetail_listOutput,
	),
	'purchase.create': lazySchemaEntry(
		purchase_createInput,
		purchase_createOutput,
	),
	'purchase.delete': lazySchemaEntry(
		purchase_deleteInput,
		purchase_deleteOutput,
	),
	'purchase.list': lazySchemaEntry(purchase_listInput, purchase_listOutput),
	'purchase.get': lazySchemaEntry(purchase_getInput, purchase_getOutput),
	'purchase.update': lazySchemaEntry(
		purchase_updateInput,
		purchase_updateOutput,
	),
	'purchaseOrder.create': lazySchemaEntry(
		purchaseOrder_createInput,
		purchaseOrder_createOutput,
	),
	'purchaseOrder.delete': lazySchemaEntry(
		purchaseOrder_deleteInput,
		purchaseOrder_deleteOutput,
	),
	'purchaseOrder.getPdf': lazySchemaEntry(
		purchaseOrder_getPdfInput,
		purchaseOrder_getPdfOutput,
	),
	'purchaseOrder.list': lazySchemaEntry(
		purchaseOrder_listInput,
		purchaseOrder_listOutput,
	),
	'purchaseOrder.get': lazySchemaEntry(
		purchaseOrder_getInput,
		purchaseOrder_getOutput,
	),
	'purchaseOrder.send': lazySchemaEntry(
		purchaseOrder_sendInput,
		purchaseOrder_sendOutput,
	),
	'purchaseOrder.update': lazySchemaEntry(
		purchaseOrder_updateInput,
		purchaseOrder_updateOutput,
	),
	'recurringTransaction.create': lazySchemaEntry(
		recurringTransaction_createInput,
		recurringTransaction_createOutput,
	),
	'recurringTransaction.delete': lazySchemaEntry(
		recurringTransaction_deleteInput,
		recurringTransaction_deleteOutput,
	),
	'recurringTransaction.list': lazySchemaEntry(
		recurringTransaction_listInput,
		recurringTransaction_listOutput,
	),
	'recurringTransaction.get': lazySchemaEntry(
		recurringTransaction_getInput,
		recurringTransaction_getOutput,
	),
	'refundReceipt.create': lazySchemaEntry(
		refundReceipt_createInput,
		refundReceipt_createOutput,
	),
	'refundReceipt.delete': lazySchemaEntry(
		refundReceipt_deleteInput,
		refundReceipt_deleteOutput,
	),
	'refundReceipt.getPdf': lazySchemaEntry(
		refundReceipt_getPdfInput,
		refundReceipt_getPdfOutput,
	),
	'refundReceipt.list': lazySchemaEntry(
		refundReceipt_listInput,
		refundReceipt_listOutput,
	),
	'refundReceipt.get': lazySchemaEntry(
		refundReceipt_getInput,
		refundReceipt_getOutput,
	),
	'refundReceipt.send': lazySchemaEntry(
		refundReceipt_sendInput,
		refundReceipt_sendOutput,
	),
	'refundReceipt.sparseUpdate': lazySchemaEntry(
		refundReceipt_sparseUpdateInput,
		refundReceipt_sparseUpdateOutput,
	),
	'refundReceipt.update': lazySchemaEntry(
		refundReceipt_updateInput,
		refundReceipt_updateOutput,
	),
	'reimburseCharge.list': lazySchemaEntry(
		reimburseCharge_listInput,
		reimburseCharge_listOutput,
	),
	'reimburseCharge.get': lazySchemaEntry(
		reimburseCharge_getInput,
		reimburseCharge_getOutput,
	),
	'salesByClassSummary.list': lazySchemaEntry(
		salesByClassSummary_listInput,
		salesByClassSummary_listOutput,
	),
	'salesByCustomer.list': lazySchemaEntry(
		salesByCustomer_listInput,
		salesByCustomer_listOutput,
	),
	'salesByDepartment.list': lazySchemaEntry(
		salesByDepartment_listInput,
		salesByDepartment_listOutput,
	),
	'salesByProduct.list': lazySchemaEntry(
		salesByProduct_listInput,
		salesByProduct_listOutput,
	),
	'salesReceipt.create': lazySchemaEntry(
		salesReceipt_createInput,
		salesReceipt_createOutput,
	),
	'salesReceipt.delete': lazySchemaEntry(
		salesReceipt_deleteInput,
		salesReceipt_deleteOutput,
	),
	'salesReceipt.void': lazySchemaEntry(
		salesReceipt_voidInput,
		salesReceipt_voidOutput,
	),
	'salesReceipt.getPdf': lazySchemaEntry(
		salesReceipt_getPdfInput,
		salesReceipt_getPdfOutput,
	),
	'salesReceipt.list': lazySchemaEntry(
		salesReceipt_listInput,
		salesReceipt_listOutput,
	),
	'salesReceipt.get': lazySchemaEntry(
		salesReceipt_getInput,
		salesReceipt_getOutput,
	),
	'salesReceipt.send': lazySchemaEntry(
		salesReceipt_sendInput,
		salesReceipt_sendOutput,
	),
	'salesReceipt.update': lazySchemaEntry(
		salesReceipt_updateInput,
		salesReceipt_updateOutput,
	),
	'salesReceipt.sparseUpdate': lazySchemaEntry(
		salesReceipt_sparseUpdateInput,
		salesReceipt_sparseUpdateOutput,
	),
	'taxAgency.create': lazySchemaEntry(
		taxAgency_createInput,
		taxAgency_createOutput,
	),
	'taxAgency.list': lazySchemaEntry(taxAgency_listInput, taxAgency_listOutput),
	'taxAgency.get': lazySchemaEntry(taxAgency_getInput, taxAgency_getOutput),
	'taxClassification.get': lazySchemaEntry(
		taxClassification_getInput,
		taxClassification_getOutput,
	),
	'taxClassification.listChildren': lazySchemaEntry(
		taxClassification_listChildrenInput,
		taxClassification_listChildrenOutput,
	),
	'taxClassification.list': lazySchemaEntry(
		taxClassification_listInput,
		taxClassification_listOutput,
	),
	'taxClassification.listByLevel': lazySchemaEntry(
		taxClassification_listByLevelInput,
		taxClassification_listByLevelOutput,
	),
	'taxCode.list': lazySchemaEntry(taxCode_listInput, taxCode_listOutput),
	'taxCode.get': lazySchemaEntry(taxCode_getInput, taxCode_getOutput),
	'taxPayment.list': lazySchemaEntry(
		taxPayment_listInput,
		taxPayment_listOutput,
	),
	'taxPayment.get': lazySchemaEntry(taxPayment_getInput, taxPayment_getOutput),
	'taxRate.list': lazySchemaEntry(taxRate_listInput, taxRate_listOutput),
	'taxRate.get': lazySchemaEntry(taxRate_getInput, taxRate_getOutput),
	'taxService.create': lazySchemaEntry(
		taxService_createInput,
		taxService_createOutput,
	),
	'taxSummary.list': lazySchemaEntry(
		taxSummary_listInput,
		taxSummary_listOutput,
	),
	'term.create': lazySchemaEntry(term_createInput, term_createOutput),
	'term.list': lazySchemaEntry(term_listInput, term_listOutput),
	'term.get': lazySchemaEntry(term_getInput, term_getOutput),
	'term.update': lazySchemaEntry(term_updateInput, term_updateOutput),
	'timeActivity.create': lazySchemaEntry(
		timeActivity_createInput,
		timeActivity_createOutput,
	),
	'timeActivity.delete': lazySchemaEntry(
		timeActivity_deleteInput,
		timeActivity_deleteOutput,
	),
	'timeActivity.list': lazySchemaEntry(
		timeActivity_listInput,
		timeActivity_listOutput,
	),
	'timeActivity.get': lazySchemaEntry(
		timeActivity_getInput,
		timeActivity_getOutput,
	),
	'timeActivity.update': lazySchemaEntry(
		timeActivity_updateInput,
		timeActivity_updateOutput,
	),
	'transactionList.list': lazySchemaEntry(
		transactionList_listInput,
		transactionList_listOutput,
	),
	'transactionListByCustomer.list': lazySchemaEntry(
		transactionListByCustomer_listInput,
		transactionListByCustomer_listOutput,
	),
	'transactionListByVendor.list': lazySchemaEntry(
		transactionListByVendor_listInput,
		transactionListByVendor_listOutput,
	),
	'transactionListWithSplits.list': lazySchemaEntry(
		transactionListWithSplits_listInput,
		transactionListWithSplits_listOutput,
	),
	'transfer.create': lazySchemaEntry(
		transfer_createInput,
		transfer_createOutput,
	),
	'transfer.delete': lazySchemaEntry(
		transfer_deleteInput,
		transfer_deleteOutput,
	),
	'transfer.list': lazySchemaEntry(transfer_listInput, transfer_listOutput),
	'transfer.get': lazySchemaEntry(transfer_getInput, transfer_getOutput),
	'transfer.sparseUpdate': lazySchemaEntry(
		transfer_sparseUpdateInput,
		transfer_sparseUpdateOutput,
	),
	'transfer.update': lazySchemaEntry(
		transfer_updateInput,
		transfer_updateOutput,
	),
	'trialBalance.list': lazySchemaEntry(
		trialBalance_listInput,
		trialBalance_listOutput,
	),
	'vendor.create': lazySchemaEntry(vendor_createInput, vendor_createOutput),
	'vendor.list': lazySchemaEntry(vendor_listInput, vendor_listOutput),
	'vendor.get': lazySchemaEntry(vendor_getInput, vendor_getOutput),
	'vendor.update': lazySchemaEntry(vendor_updateInput, vendor_updateOutput),
	'vendorBalance.list': lazySchemaEntry(
		vendorBalance_listInput,
		vendorBalance_listOutput,
	),
	'vendorBalanceDetail.list': lazySchemaEntry(
		vendorBalanceDetail_listInput,
		vendorBalanceDetail_listOutput,
	),
	'vendorCredit.create': lazySchemaEntry(
		vendorCredit_createInput,
		vendorCredit_createOutput,
	),
	'vendorCredit.delete': lazySchemaEntry(
		vendorCredit_deleteInput,
		vendorCredit_deleteOutput,
	),
	'vendorCredit.list': lazySchemaEntry(
		vendorCredit_listInput,
		vendorCredit_listOutput,
	),
	'vendorCredit.get': lazySchemaEntry(
		vendorCredit_getInput,
		vendorCredit_getOutput,
	),
	'vendorCredit.update': lazySchemaEntry(
		vendorCredit_updateInput,
		vendorCredit_updateOutput,
	),
	'vendorExpenses.list': lazySchemaEntry(
		vendorExpenses_listInput,
		vendorExpenses_listOutput,
	),
};

export const QuickBooksCatalogEndpointMeta = {
	'apAgingDetail.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'apAgingSummary.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'arAgingDetail.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'arAgingSummary.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'accounts.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update an account',
	},
	'accountListDetail.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'attachable.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a note attachment',
	},
	'attachable.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete an attachable',
	},
	'attachable.download': {
		riskLevel: 'read',
		description: 'QuickBooks Download an attachment',
	},
	'attachable.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query an attachable',
	},
	'attachable.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read an attachable',
	},
	'attachable.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update an attachable',
	},
	'attachable.upload': {
		riskLevel: 'write',
		description: 'QuickBooks Upload attachments',
	},
	'balanceSheet.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'bill.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a bill',
	},
	'bill.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete a bill',
	},
	'bill.list': { riskLevel: 'read', description: 'QuickBooks Query a bill' },
	'bill.get': { riskLevel: 'read', description: 'QuickBooks Read a bill' },
	'bill.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a bill',
	},
	'billPayment.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a billpayment',
	},
	'billPayment.void': {
		riskLevel: 'destructive',
		description: 'QuickBooks Void a billpayment',
	},
	'billPayment.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete a billpayment',
	},
	'billPayment.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a billpayment',
	},
	'billPayment.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a billpayment',
	},
	'billPayment.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a billpayment',
	},
	'budget.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a budget',
	},
	'budget.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete a budget',
	},
	'budget.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a budget',
	},
	'budget.get': { riskLevel: 'read', description: 'QuickBooks Read a budget' },
	'budget.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a budget',
	},
	'cashFlow.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'changeOrder.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a change order',
	},
	'changeOrder.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete a change order',
	},
	'changeOrder.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a change order',
	},
	'changeOrder.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a change order',
	},
	'class.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a class',
	},
	'class.list': { riskLevel: 'read', description: 'QuickBooks Query a class' },
	'class.get': { riskLevel: 'read', description: 'QuickBooks Read a class' },
	'class.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a class',
	},
	'companyCurrency.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a companycurrency',
	},
	'companyCurrency.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a companycurrency',
	},
	'companyCurrency.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a companycurrency',
	},
	'companyCurrency.update': {
		riskLevel: 'write',
		description: 'QuickBooks Update a companycurrency',
	},
	'company.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update companyinfo',
	},
	'company.sparseUpdate': {
		riskLevel: 'write',
		description: 'QuickBooks Sparse update companyinfo',
	},
	'creditCardPayment.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a creditcardpayment',
	},
	'creditCardPayment.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete a creditcardpayment',
	},
	'creditCardPayment.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a creditcardpayment',
	},
	'creditCardPayment.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a creditcardpayment',
	},
	'creditCardPayment.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a creditcardpayment',
	},
	'creditCardPayment.sparseUpdate': {
		riskLevel: 'write',
		description: 'QuickBooks Sparse update a creditcardpayment',
	},
	'creditMemo.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a credit memo',
	},
	'creditMemo.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete a credit memo',
	},
	'creditMemo.getPdf': {
		riskLevel: 'read',
		description: 'QuickBooks Get a credit memo as PDF',
	},
	'creditMemo.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a credit memo',
	},
	'creditMemo.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a credit memo',
	},
	'creditMemo.send': {
		riskLevel: 'destructive',
		description: 'QuickBooks Send a credit memo',
	},
	'creditMemo.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a credit memo',
	},
	'customer.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a customer',
	},
	'customer.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a customer',
	},
	'customer.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a customer',
	},
	'customer.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a customer',
	},
	'customer.sparseUpdate': {
		riskLevel: 'write',
		description: 'QuickBooks Sparse update a customer',
	},
	'customerBalance.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'customerBalanceDetail.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'customerIncome.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'customerType.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a customertype',
	},
	'customerType.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a customertype',
	},
	'department.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a department',
	},
	'department.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a department',
	},
	'department.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a department',
	},
	'department.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a department',
	},
	'deposit.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a deposit',
	},
	'deposit.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete a deposit',
	},
	'deposit.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a deposit',
	},
	'deposit.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a deposit',
	},
	'deposit.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a deposit',
	},
	'deposit.sparseUpdate': {
		riskLevel: 'write',
		description: 'QuickBooks Sparse update a deposit',
	},
	'employee.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create an employee',
	},
	'employee.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query an employee',
	},
	'employee.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read an employee',
	},
	'employee.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update an employee',
	},
	'estimate.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create an estimate',
	},
	'estimate.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete an estimate',
	},
	'estimate.getPdf': {
		riskLevel: 'read',
		description: 'QuickBooks Get an estimate as PDF',
	},
	'estimate.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query an estimate',
	},
	'estimate.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read an estimate',
	},
	'estimate.send': {
		riskLevel: 'destructive',
		description: 'QuickBooks Send an estimate',
	},
	'estimate.sparseUpdate': {
		riskLevel: 'write',
		description: 'QuickBooks Sparse update an estimate',
	},
	'estimate.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update an estimate',
	},
	'exchangerate.get': {
		riskLevel: 'read',
		description:
			'QuickBooks Get an exchangerate for an individual currency code.',
	},
	'exchangerate.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query exchangerate objects.',
	},
	'exchangerate.update': {
		riskLevel: 'write',
		description: 'QuickBooks Update an exchangerate',
	},
	'generalLedger.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'inventoryAdjustment.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create an inventory adjustment',
	},
	'inventoryAdjustment.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete an inventory adjustment',
	},
	'inventoryAdjustment.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read an inventory adjustment',
	},
	'inventoryAdjustment.sparseUpdate': {
		riskLevel: 'write',
		description: 'QuickBooks Update an inventory adjustment',
	},
	'inventoryValuationDetail.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'inventoryValuationSummary.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'invoice.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create an invoice',
	},
	'invoice.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete an invoice',
	},
	'invoice.void': {
		riskLevel: 'destructive',
		description: 'QuickBooks Void an invoice',
	},
	'invoice.getPdf': {
		riskLevel: 'read',
		description: 'QuickBooks Get an invoice as PDF',
	},
	'invoice.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query an invoice',
	},
	'invoice.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read an invoice',
	},
	'invoice.send': {
		riskLevel: 'destructive',
		description: 'QuickBooks Send an invoice',
	},
	'invoice.sparseUpdate': {
		riskLevel: 'write',
		description: 'QuickBooks Sparse update an invoice',
	},
	'invoice.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update an invoice',
	},
	'item.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create an item',
	},
	'item.createCategory': {
		riskLevel: 'write',
		description: 'QuickBooks Create a category',
	},
	'item.listBundles': {
		riskLevel: 'read',
		description: 'QuickBooks Query a bundle',
	},
	'item.listCategories': {
		riskLevel: 'read',
		description: 'QuickBooks Query a category',
	},
	'item.listItems': {
		riskLevel: 'read',
		description: 'QuickBooks Query an item',
	},
	'item.getBundle': {
		riskLevel: 'read',
		description: 'QuickBooks Read a bundle',
	},
	'item.getCategory': {
		riskLevel: 'read',
		description: 'QuickBooks Read a category',
	},
	'item.getItem': { riskLevel: 'read', description: 'QuickBooks Read an item' },
	'item.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update an item',
	},
	'item.updateCategory': {
		riskLevel: 'write',
		description: 'QuickBooks Update a category',
	},
	'journalEntry.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a journalentry',
	},
	'journalEntry.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete a journalentry',
	},
	'journalEntry.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a journalentry',
	},
	'journalEntry.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a journalentry',
	},
	'journalEntry.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a journalentry',
	},
	'journalEntry.sparseUpdate': {
		riskLevel: 'write',
		description: 'QuickBooks Sparse update a journalentry',
	},
	'journalReport.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'payment.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a payment',
	},
	'payment.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete a payment',
	},
	'payment.void': {
		riskLevel: 'destructive',
		description: 'QuickBooks Void a payment',
	},
	'payment.getPdf': {
		riskLevel: 'read',
		description: 'QuickBooks Get a payment as PDF',
	},
	'payment.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a payment',
	},
	'payment.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a payment',
	},
	'payment.send': {
		riskLevel: 'destructive',
		description: 'QuickBooks Send a payment',
	},
	'payment.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a payment',
	},
	'paymentMethod.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a paymentmethod',
	},
	'paymentMethod.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a paymentmethod',
	},
	'paymentMethod.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a paymentmethod',
	},
	'paymentMethod.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a paymentmethod',
	},
	'preferences.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query preferences',
	},
	'preferences.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read preferences',
	},
	'preferences.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update preferences',
	},
	'profitAndLoss.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'profitAndLossDetail.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'purchase.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a purchase',
	},
	'purchase.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete a purchase',
	},
	'purchase.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a purchase',
	},
	'purchase.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a purchase',
	},
	'purchase.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a purchase',
	},
	'purchaseOrder.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a purchase order',
	},
	'purchaseOrder.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete a purchase order',
	},
	'purchaseOrder.getPdf': {
		riskLevel: 'read',
		description: 'QuickBooks Get a purchase order as PDF',
	},
	'purchaseOrder.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a purchase order',
	},
	'purchaseOrder.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a purchase order',
	},
	'purchaseOrder.send': {
		riskLevel: 'destructive',
		description: 'QuickBooks Send a purchase order',
	},
	'purchaseOrder.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a purchase order',
	},
	'recurringTransaction.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a recurring transaction',
	},
	'recurringTransaction.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete a recurring transaction',
	},
	'recurringTransaction.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a recurring transaction',
	},
	'recurringTransaction.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a recurring transaction',
	},
	'refundReceipt.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a refund receipt',
	},
	'refundReceipt.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete a refund receipt',
	},
	'refundReceipt.getPdf': {
		riskLevel: 'read',
		description: 'QuickBooks Get a refund receipt as PDF',
	},
	'refundReceipt.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a refund receipt',
	},
	'refundReceipt.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a refund receipt',
	},
	'refundReceipt.send': {
		riskLevel: 'destructive',
		description: 'QuickBooks Send a refund receipt',
	},
	'refundReceipt.sparseUpdate': {
		riskLevel: 'write',
		description: 'QuickBooks Sparse update a refund receipt',
	},
	'refundReceipt.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a refund receipt',
	},
	'reimburseCharge.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a reimburse charge',
	},
	'reimburseCharge.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a reimburse charge',
	},
	'salesByClassSummary.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'salesByCustomer.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'salesByDepartment.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'salesByProduct.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'salesReceipt.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a salesreceipt',
	},
	'salesReceipt.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete a salesreceipt',
	},
	'salesReceipt.void': {
		riskLevel: 'destructive',
		description: 'QuickBooks Void a salesreceipt',
	},
	'salesReceipt.getPdf': {
		riskLevel: 'read',
		description: 'QuickBooks Get a salesreceipt as PDF',
	},
	'salesReceipt.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a salesreceipt',
	},
	'salesReceipt.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a salesreceipt',
	},
	'salesReceipt.send': {
		riskLevel: 'destructive',
		description: 'QuickBooks Send a salesreceipt',
	},
	'salesReceipt.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a salesreceipt',
	},
	'salesReceipt.sparseUpdate': {
		riskLevel: 'write',
		description: 'QuickBooks Sparse update a salesreceipt',
	},
	'taxAgency.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a taxagency',
	},
	'taxAgency.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a taxagency',
	},
	'taxAgency.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a taxagency',
	},
	'taxClassification.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a taxclassification by ID',
	},
	'taxClassification.listChildren': {
		riskLevel: 'read',
		description: 'QuickBooks Read a taxclassification by Parent ID',
	},
	'taxClassification.list': {
		riskLevel: 'read',
		description: 'QuickBooks Read all taxclassifications',
	},
	'taxClassification.listByLevel': {
		riskLevel: 'read',
		description: 'QuickBooks Read taxclassifications by level',
	},
	'taxCode.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a taxcode',
	},
	'taxCode.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a taxcode',
	},
	'taxPayment.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query taxpayment',
	},
	'taxPayment.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read taxpayment',
	},
	'taxRate.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a taxrate',
	},
	'taxRate.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a taxrate',
	},
	'taxService.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a taxservice',
	},
	'taxSummary.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'term.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a term',
	},
	'term.list': { riskLevel: 'read', description: 'QuickBooks Query a term' },
	'term.get': { riskLevel: 'read', description: 'QuickBooks Read a term' },
	'term.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a term',
	},
	'timeActivity.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a timeactivity object',
	},
	'timeActivity.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete a timeactivity object',
	},
	'timeActivity.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a timeactivity object',
	},
	'timeActivity.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a timeactivity object',
	},
	'timeActivity.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a timeactivity object',
	},
	'transactionList.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'transactionListByCustomer.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'transactionListByVendor.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'transactionListWithSplits.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'transfer.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create an transfer',
	},
	'transfer.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete an transfer',
	},
	'transfer.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query an transfer',
	},
	'transfer.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read an transfer',
	},
	'transfer.sparseUpdate': {
		riskLevel: 'write',
		description: 'QuickBooks Sparse update an transfer',
	},
	'transfer.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update an transfer',
	},
	'trialBalance.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'vendor.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a vendor',
	},
	'vendor.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a vendor',
	},
	'vendor.get': { riskLevel: 'read', description: 'QuickBooks Read a vendor' },
	'vendor.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a vendor',
	},
	'vendorBalance.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'vendorBalanceDetail.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
	'vendorCredit.create': {
		riskLevel: 'write',
		description: 'QuickBooks Create a vendorcredit',
	},
	'vendorCredit.delete': {
		riskLevel: 'destructive',
		description: 'QuickBooks Delete a vendorcredit',
	},
	'vendorCredit.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a vendorcredit',
	},
	'vendorCredit.get': {
		riskLevel: 'read',
		description: 'QuickBooks Read a vendorcredit',
	},
	'vendorCredit.update': {
		riskLevel: 'write',
		description: 'QuickBooks Full update a vendorcredit',
	},
	'vendorExpenses.list': {
		riskLevel: 'read',
		description: 'QuickBooks Query a report',
	},
} as const;

export type QuickBooksCatalogEndpointInputs = {
	apAgingDetailList: z.input<ReturnType<typeof apAgingDetail_listInput>>;
	apAgingSummaryList: z.input<ReturnType<typeof apAgingSummary_listInput>>;
	arAgingDetailList: z.input<ReturnType<typeof arAgingDetail_listInput>>;
	arAgingSummaryList: z.input<ReturnType<typeof arAgingSummary_listInput>>;
	accountsUpdate: z.input<ReturnType<typeof accounts_updateInput>>;
	accountListDetailList: z.input<
		ReturnType<typeof accountListDetail_listInput>
	>;
	attachableCreate: z.input<ReturnType<typeof attachable_createInput>>;
	attachableDelete: z.input<ReturnType<typeof attachable_deleteInput>>;
	attachableDownload: z.input<ReturnType<typeof attachable_downloadInput>>;
	attachableList: z.input<ReturnType<typeof attachable_listInput>>;
	attachableGet: z.input<ReturnType<typeof attachable_getInput>>;
	attachableUpdate: z.input<ReturnType<typeof attachable_updateInput>>;
	attachableUpload: z.input<ReturnType<typeof attachable_uploadInput>>;
	balanceSheetList: z.input<ReturnType<typeof balanceSheet_listInput>>;
	billCreate: z.input<ReturnType<typeof bill_createInput>>;
	billDelete: z.input<ReturnType<typeof bill_deleteInput>>;
	billList: z.input<ReturnType<typeof bill_listInput>>;
	billGet: z.input<ReturnType<typeof bill_getInput>>;
	billUpdate: z.input<ReturnType<typeof bill_updateInput>>;
	billPaymentCreate: z.input<ReturnType<typeof billPayment_createInput>>;
	billPaymentVoid: z.input<ReturnType<typeof billPayment_voidInput>>;
	billPaymentDelete: z.input<ReturnType<typeof billPayment_deleteInput>>;
	billPaymentList: z.input<ReturnType<typeof billPayment_listInput>>;
	billPaymentGet: z.input<ReturnType<typeof billPayment_getInput>>;
	billPaymentUpdate: z.input<ReturnType<typeof billPayment_updateInput>>;
	budgetCreate: z.input<ReturnType<typeof budget_createInput>>;
	budgetDelete: z.input<ReturnType<typeof budget_deleteInput>>;
	budgetList: z.input<ReturnType<typeof budget_listInput>>;
	budgetGet: z.input<ReturnType<typeof budget_getInput>>;
	budgetUpdate: z.input<ReturnType<typeof budget_updateInput>>;
	cashFlowList: z.input<ReturnType<typeof cashFlow_listInput>>;
	changeOrderCreate: z.input<ReturnType<typeof changeOrder_createInput>>;
	changeOrderDelete: z.input<ReturnType<typeof changeOrder_deleteInput>>;
	changeOrderGet: z.input<ReturnType<typeof changeOrder_getInput>>;
	changeOrderUpdate: z.input<ReturnType<typeof changeOrder_updateInput>>;
	classCreate: z.input<ReturnType<typeof class_createInput>>;
	classList: z.input<ReturnType<typeof class_listInput>>;
	classGet: z.input<ReturnType<typeof class_getInput>>;
	classUpdate: z.input<ReturnType<typeof class_updateInput>>;
	companyCurrencyCreate: z.input<
		ReturnType<typeof companyCurrency_createInput>
	>;
	companyCurrencyList: z.input<ReturnType<typeof companyCurrency_listInput>>;
	companyCurrencyGet: z.input<ReturnType<typeof companyCurrency_getInput>>;
	companyCurrencyUpdate: z.input<
		ReturnType<typeof companyCurrency_updateInput>
	>;
	companyUpdate: z.input<ReturnType<typeof company_updateInput>>;
	companySparseUpdate: z.input<ReturnType<typeof company_sparseUpdateInput>>;
	creditCardPaymentCreate: z.input<
		ReturnType<typeof creditCardPayment_createInput>
	>;
	creditCardPaymentDelete: z.input<
		ReturnType<typeof creditCardPayment_deleteInput>
	>;
	creditCardPaymentList: z.input<
		ReturnType<typeof creditCardPayment_listInput>
	>;
	creditCardPaymentGet: z.input<ReturnType<typeof creditCardPayment_getInput>>;
	creditCardPaymentUpdate: z.input<
		ReturnType<typeof creditCardPayment_updateInput>
	>;
	creditCardPaymentSparseUpdate: z.input<
		ReturnType<typeof creditCardPayment_sparseUpdateInput>
	>;
	creditMemoCreate: z.input<ReturnType<typeof creditMemo_createInput>>;
	creditMemoDelete: z.input<ReturnType<typeof creditMemo_deleteInput>>;
	creditMemoGetPdf: z.input<ReturnType<typeof creditMemo_getPdfInput>>;
	creditMemoList: z.input<ReturnType<typeof creditMemo_listInput>>;
	creditMemoGet: z.input<ReturnType<typeof creditMemo_getInput>>;
	creditMemoSend: z.input<ReturnType<typeof creditMemo_sendInput>>;
	creditMemoUpdate: z.input<ReturnType<typeof creditMemo_updateInput>>;
	customerCreate: z.input<ReturnType<typeof customer_createInput>>;
	customerList: z.input<ReturnType<typeof customer_listInput>>;
	customerGet: z.input<ReturnType<typeof customer_getInput>>;
	customerUpdate: z.input<ReturnType<typeof customer_updateInput>>;
	customerSparseUpdate: z.input<ReturnType<typeof customer_sparseUpdateInput>>;
	customerBalanceList: z.input<ReturnType<typeof customerBalance_listInput>>;
	customerBalanceDetailList: z.input<
		ReturnType<typeof customerBalanceDetail_listInput>
	>;
	customerIncomeList: z.input<ReturnType<typeof customerIncome_listInput>>;
	customerTypeList: z.input<ReturnType<typeof customerType_listInput>>;
	customerTypeGet: z.input<ReturnType<typeof customerType_getInput>>;
	departmentCreate: z.input<ReturnType<typeof department_createInput>>;
	departmentList: z.input<ReturnType<typeof department_listInput>>;
	departmentGet: z.input<ReturnType<typeof department_getInput>>;
	departmentUpdate: z.input<ReturnType<typeof department_updateInput>>;
	depositCreate: z.input<ReturnType<typeof deposit_createInput>>;
	depositDelete: z.input<ReturnType<typeof deposit_deleteInput>>;
	depositList: z.input<ReturnType<typeof deposit_listInput>>;
	depositGet: z.input<ReturnType<typeof deposit_getInput>>;
	depositUpdate: z.input<ReturnType<typeof deposit_updateInput>>;
	depositSparseUpdate: z.input<ReturnType<typeof deposit_sparseUpdateInput>>;
	employeeCreate: z.input<ReturnType<typeof employee_createInput>>;
	employeeList: z.input<ReturnType<typeof employee_listInput>>;
	employeeGet: z.input<ReturnType<typeof employee_getInput>>;
	employeeUpdate: z.input<ReturnType<typeof employee_updateInput>>;
	estimateCreate: z.input<ReturnType<typeof estimate_createInput>>;
	estimateDelete: z.input<ReturnType<typeof estimate_deleteInput>>;
	estimateGetPdf: z.input<ReturnType<typeof estimate_getPdfInput>>;
	estimateList: z.input<ReturnType<typeof estimate_listInput>>;
	estimateGet: z.input<ReturnType<typeof estimate_getInput>>;
	estimateSend: z.input<ReturnType<typeof estimate_sendInput>>;
	estimateSparseUpdate: z.input<ReturnType<typeof estimate_sparseUpdateInput>>;
	estimateUpdate: z.input<ReturnType<typeof estimate_updateInput>>;
	exchangerateGet: z.input<ReturnType<typeof exchangerate_getInput>>;
	exchangerateList: z.input<ReturnType<typeof exchangerate_listInput>>;
	exchangerateUpdate: z.input<ReturnType<typeof exchangerate_updateInput>>;
	generalLedgerList: z.input<ReturnType<typeof generalLedger_listInput>>;
	inventoryAdjustmentCreate: z.input<
		ReturnType<typeof inventoryAdjustment_createInput>
	>;
	inventoryAdjustmentDelete: z.input<
		ReturnType<typeof inventoryAdjustment_deleteInput>
	>;
	inventoryAdjustmentGet: z.input<
		ReturnType<typeof inventoryAdjustment_getInput>
	>;
	inventoryAdjustmentSparseUpdate: z.input<
		ReturnType<typeof inventoryAdjustment_sparseUpdateInput>
	>;
	inventoryValuationDetailList: z.input<
		ReturnType<typeof inventoryValuationDetail_listInput>
	>;
	inventoryValuationSummaryList: z.input<
		ReturnType<typeof inventoryValuationSummary_listInput>
	>;
	invoiceCreate: z.input<ReturnType<typeof invoice_createInput>>;
	invoiceDelete: z.input<ReturnType<typeof invoice_deleteInput>>;
	invoiceVoid: z.input<ReturnType<typeof invoice_voidInput>>;
	invoiceGetPdf: z.input<ReturnType<typeof invoice_getPdfInput>>;
	invoiceList: z.input<ReturnType<typeof invoice_listInput>>;
	invoiceGet: z.input<ReturnType<typeof invoice_getInput>>;
	invoiceSend: z.input<ReturnType<typeof invoice_sendInput>>;
	invoiceSparseUpdate: z.input<ReturnType<typeof invoice_sparseUpdateInput>>;
	invoiceUpdate: z.input<ReturnType<typeof invoice_updateInput>>;
	itemCreate: z.input<ReturnType<typeof item_createInput>>;
	itemCreateCategory: z.input<ReturnType<typeof item_createCategoryInput>>;
	itemListBundles: z.input<ReturnType<typeof item_listBundlesInput>>;
	itemListCategories: z.input<ReturnType<typeof item_listCategoriesInput>>;
	itemListItems: z.input<ReturnType<typeof item_listItemsInput>>;
	itemGetBundle: z.input<ReturnType<typeof item_getBundleInput>>;
	itemGetCategory: z.input<ReturnType<typeof item_getCategoryInput>>;
	itemGetItem: z.input<ReturnType<typeof item_getItemInput>>;
	itemUpdate: z.input<ReturnType<typeof item_updateInput>>;
	itemUpdateCategory: z.input<ReturnType<typeof item_updateCategoryInput>>;
	journalEntryCreate: z.input<ReturnType<typeof journalEntry_createInput>>;
	journalEntryDelete: z.input<ReturnType<typeof journalEntry_deleteInput>>;
	journalEntryList: z.input<ReturnType<typeof journalEntry_listInput>>;
	journalEntryGet: z.input<ReturnType<typeof journalEntry_getInput>>;
	journalEntryUpdate: z.input<ReturnType<typeof journalEntry_updateInput>>;
	journalEntrySparseUpdate: z.input<
		ReturnType<typeof journalEntry_sparseUpdateInput>
	>;
	journalReportList: z.input<ReturnType<typeof journalReport_listInput>>;
	paymentCreate: z.input<ReturnType<typeof payment_createInput>>;
	paymentDelete: z.input<ReturnType<typeof payment_deleteInput>>;
	paymentVoid: z.input<ReturnType<typeof payment_voidInput>>;
	paymentGetPdf: z.input<ReturnType<typeof payment_getPdfInput>>;
	paymentList: z.input<ReturnType<typeof payment_listInput>>;
	paymentGet: z.input<ReturnType<typeof payment_getInput>>;
	paymentSend: z.input<ReturnType<typeof payment_sendInput>>;
	paymentUpdate: z.input<ReturnType<typeof payment_updateInput>>;
	paymentMethodCreate: z.input<ReturnType<typeof paymentMethod_createInput>>;
	paymentMethodList: z.input<ReturnType<typeof paymentMethod_listInput>>;
	paymentMethodGet: z.input<ReturnType<typeof paymentMethod_getInput>>;
	paymentMethodUpdate: z.input<ReturnType<typeof paymentMethod_updateInput>>;
	preferencesList: z.input<ReturnType<typeof preferences_listInput>>;
	preferencesGet: z.input<ReturnType<typeof preferences_getInput>>;
	preferencesUpdate: z.input<ReturnType<typeof preferences_updateInput>>;
	profitAndLossList: z.input<ReturnType<typeof profitAndLoss_listInput>>;
	profitAndLossDetailList: z.input<
		ReturnType<typeof profitAndLossDetail_listInput>
	>;
	purchaseCreate: z.input<ReturnType<typeof purchase_createInput>>;
	purchaseDelete: z.input<ReturnType<typeof purchase_deleteInput>>;
	purchaseList: z.input<ReturnType<typeof purchase_listInput>>;
	purchaseGet: z.input<ReturnType<typeof purchase_getInput>>;
	purchaseUpdate: z.input<ReturnType<typeof purchase_updateInput>>;
	purchaseOrderCreate: z.input<ReturnType<typeof purchaseOrder_createInput>>;
	purchaseOrderDelete: z.input<ReturnType<typeof purchaseOrder_deleteInput>>;
	purchaseOrderGetPdf: z.input<ReturnType<typeof purchaseOrder_getPdfInput>>;
	purchaseOrderList: z.input<ReturnType<typeof purchaseOrder_listInput>>;
	purchaseOrderGet: z.input<ReturnType<typeof purchaseOrder_getInput>>;
	purchaseOrderSend: z.input<ReturnType<typeof purchaseOrder_sendInput>>;
	purchaseOrderUpdate: z.input<ReturnType<typeof purchaseOrder_updateInput>>;
	recurringTransactionCreate: z.input<
		ReturnType<typeof recurringTransaction_createInput>
	>;
	recurringTransactionDelete: z.input<
		ReturnType<typeof recurringTransaction_deleteInput>
	>;
	recurringTransactionList: z.input<
		ReturnType<typeof recurringTransaction_listInput>
	>;
	recurringTransactionGet: z.input<
		ReturnType<typeof recurringTransaction_getInput>
	>;
	refundReceiptCreate: z.input<ReturnType<typeof refundReceipt_createInput>>;
	refundReceiptDelete: z.input<ReturnType<typeof refundReceipt_deleteInput>>;
	refundReceiptGetPdf: z.input<ReturnType<typeof refundReceipt_getPdfInput>>;
	refundReceiptList: z.input<ReturnType<typeof refundReceipt_listInput>>;
	refundReceiptGet: z.input<ReturnType<typeof refundReceipt_getInput>>;
	refundReceiptSend: z.input<ReturnType<typeof refundReceipt_sendInput>>;
	refundReceiptSparseUpdate: z.input<
		ReturnType<typeof refundReceipt_sparseUpdateInput>
	>;
	refundReceiptUpdate: z.input<ReturnType<typeof refundReceipt_updateInput>>;
	reimburseChargeList: z.input<ReturnType<typeof reimburseCharge_listInput>>;
	reimburseChargeGet: z.input<ReturnType<typeof reimburseCharge_getInput>>;
	salesByClassSummaryList: z.input<
		ReturnType<typeof salesByClassSummary_listInput>
	>;
	salesByCustomerList: z.input<ReturnType<typeof salesByCustomer_listInput>>;
	salesByDepartmentList: z.input<
		ReturnType<typeof salesByDepartment_listInput>
	>;
	salesByProductList: z.input<ReturnType<typeof salesByProduct_listInput>>;
	salesReceiptCreate: z.input<ReturnType<typeof salesReceipt_createInput>>;
	salesReceiptDelete: z.input<ReturnType<typeof salesReceipt_deleteInput>>;
	salesReceiptVoid: z.input<ReturnType<typeof salesReceipt_voidInput>>;
	salesReceiptGetPdf: z.input<ReturnType<typeof salesReceipt_getPdfInput>>;
	salesReceiptList: z.input<ReturnType<typeof salesReceipt_listInput>>;
	salesReceiptGet: z.input<ReturnType<typeof salesReceipt_getInput>>;
	salesReceiptSend: z.input<ReturnType<typeof salesReceipt_sendInput>>;
	salesReceiptUpdate: z.input<ReturnType<typeof salesReceipt_updateInput>>;
	salesReceiptSparseUpdate: z.input<
		ReturnType<typeof salesReceipt_sparseUpdateInput>
	>;
	taxAgencyCreate: z.input<ReturnType<typeof taxAgency_createInput>>;
	taxAgencyList: z.input<ReturnType<typeof taxAgency_listInput>>;
	taxAgencyGet: z.input<ReturnType<typeof taxAgency_getInput>>;
	taxClassificationGet: z.input<ReturnType<typeof taxClassification_getInput>>;
	taxClassificationListChildren: z.input<
		ReturnType<typeof taxClassification_listChildrenInput>
	>;
	taxClassificationList: z.input<
		ReturnType<typeof taxClassification_listInput>
	>;
	taxClassificationListByLevel: z.input<
		ReturnType<typeof taxClassification_listByLevelInput>
	>;
	taxCodeList: z.input<ReturnType<typeof taxCode_listInput>>;
	taxCodeGet: z.input<ReturnType<typeof taxCode_getInput>>;
	taxPaymentList: z.input<ReturnType<typeof taxPayment_listInput>>;
	taxPaymentGet: z.input<ReturnType<typeof taxPayment_getInput>>;
	taxRateList: z.input<ReturnType<typeof taxRate_listInput>>;
	taxRateGet: z.input<ReturnType<typeof taxRate_getInput>>;
	taxServiceCreate: z.input<ReturnType<typeof taxService_createInput>>;
	taxSummaryList: z.input<ReturnType<typeof taxSummary_listInput>>;
	termCreate: z.input<ReturnType<typeof term_createInput>>;
	termList: z.input<ReturnType<typeof term_listInput>>;
	termGet: z.input<ReturnType<typeof term_getInput>>;
	termUpdate: z.input<ReturnType<typeof term_updateInput>>;
	timeActivityCreate: z.input<ReturnType<typeof timeActivity_createInput>>;
	timeActivityDelete: z.input<ReturnType<typeof timeActivity_deleteInput>>;
	timeActivityList: z.input<ReturnType<typeof timeActivity_listInput>>;
	timeActivityGet: z.input<ReturnType<typeof timeActivity_getInput>>;
	timeActivityUpdate: z.input<ReturnType<typeof timeActivity_updateInput>>;
	transactionListList: z.input<ReturnType<typeof transactionList_listInput>>;
	transactionListByCustomerList: z.input<
		ReturnType<typeof transactionListByCustomer_listInput>
	>;
	transactionListByVendorList: z.input<
		ReturnType<typeof transactionListByVendor_listInput>
	>;
	transactionListWithSplitsList: z.input<
		ReturnType<typeof transactionListWithSplits_listInput>
	>;
	transferCreate: z.input<ReturnType<typeof transfer_createInput>>;
	transferDelete: z.input<ReturnType<typeof transfer_deleteInput>>;
	transferList: z.input<ReturnType<typeof transfer_listInput>>;
	transferGet: z.input<ReturnType<typeof transfer_getInput>>;
	transferSparseUpdate: z.input<ReturnType<typeof transfer_sparseUpdateInput>>;
	transferUpdate: z.input<ReturnType<typeof transfer_updateInput>>;
	trialBalanceList: z.input<ReturnType<typeof trialBalance_listInput>>;
	vendorCreate: z.input<ReturnType<typeof vendor_createInput>>;
	vendorList: z.input<ReturnType<typeof vendor_listInput>>;
	vendorGet: z.input<ReturnType<typeof vendor_getInput>>;
	vendorUpdate: z.input<ReturnType<typeof vendor_updateInput>>;
	vendorBalanceList: z.input<ReturnType<typeof vendorBalance_listInput>>;
	vendorBalanceDetailList: z.input<
		ReturnType<typeof vendorBalanceDetail_listInput>
	>;
	vendorCreditCreate: z.input<ReturnType<typeof vendorCredit_createInput>>;
	vendorCreditDelete: z.input<ReturnType<typeof vendorCredit_deleteInput>>;
	vendorCreditList: z.input<ReturnType<typeof vendorCredit_listInput>>;
	vendorCreditGet: z.input<ReturnType<typeof vendorCredit_getInput>>;
	vendorCreditUpdate: z.input<ReturnType<typeof vendorCredit_updateInput>>;
	vendorExpensesList: z.input<ReturnType<typeof vendorExpenses_listInput>>;
};
export type QuickBooksCatalogEndpointOutputs = {
	apAgingDetailList: z.output<ReturnType<typeof apAgingDetail_listOutput>>;
	apAgingSummaryList: z.output<ReturnType<typeof apAgingSummary_listOutput>>;
	arAgingDetailList: z.output<ReturnType<typeof arAgingDetail_listOutput>>;
	arAgingSummaryList: z.output<ReturnType<typeof arAgingSummary_listOutput>>;
	accountsUpdate: z.output<ReturnType<typeof accounts_updateOutput>>;
	accountListDetailList: z.output<
		ReturnType<typeof accountListDetail_listOutput>
	>;
	attachableCreate: z.output<ReturnType<typeof attachable_createOutput>>;
	attachableDelete: z.output<ReturnType<typeof attachable_deleteOutput>>;
	attachableDownload: z.output<ReturnType<typeof attachable_downloadOutput>>;
	attachableList: z.output<ReturnType<typeof attachable_listOutput>>;
	attachableGet: z.output<ReturnType<typeof attachable_getOutput>>;
	attachableUpdate: z.output<ReturnType<typeof attachable_updateOutput>>;
	attachableUpload: z.output<ReturnType<typeof attachable_uploadOutput>>;
	balanceSheetList: z.output<ReturnType<typeof balanceSheet_listOutput>>;
	billCreate: z.output<ReturnType<typeof bill_createOutput>>;
	billDelete: z.output<ReturnType<typeof bill_deleteOutput>>;
	billList: z.output<ReturnType<typeof bill_listOutput>>;
	billGet: z.output<ReturnType<typeof bill_getOutput>>;
	billUpdate: z.output<ReturnType<typeof bill_updateOutput>>;
	billPaymentCreate: z.output<ReturnType<typeof billPayment_createOutput>>;
	billPaymentVoid: z.output<ReturnType<typeof billPayment_voidOutput>>;
	billPaymentDelete: z.output<ReturnType<typeof billPayment_deleteOutput>>;
	billPaymentList: z.output<ReturnType<typeof billPayment_listOutput>>;
	billPaymentGet: z.output<ReturnType<typeof billPayment_getOutput>>;
	billPaymentUpdate: z.output<ReturnType<typeof billPayment_updateOutput>>;
	budgetCreate: z.output<ReturnType<typeof budget_createOutput>>;
	budgetDelete: z.output<ReturnType<typeof budget_deleteOutput>>;
	budgetList: z.output<ReturnType<typeof budget_listOutput>>;
	budgetGet: z.output<ReturnType<typeof budget_getOutput>>;
	budgetUpdate: z.output<ReturnType<typeof budget_updateOutput>>;
	cashFlowList: z.output<ReturnType<typeof cashFlow_listOutput>>;
	changeOrderCreate: z.output<ReturnType<typeof changeOrder_createOutput>>;
	changeOrderDelete: z.output<ReturnType<typeof changeOrder_deleteOutput>>;
	changeOrderGet: z.output<ReturnType<typeof changeOrder_getOutput>>;
	changeOrderUpdate: z.output<ReturnType<typeof changeOrder_updateOutput>>;
	classCreate: z.output<ReturnType<typeof class_createOutput>>;
	classList: z.output<ReturnType<typeof class_listOutput>>;
	classGet: z.output<ReturnType<typeof class_getOutput>>;
	classUpdate: z.output<ReturnType<typeof class_updateOutput>>;
	companyCurrencyCreate: z.output<
		ReturnType<typeof companyCurrency_createOutput>
	>;
	companyCurrencyList: z.output<ReturnType<typeof companyCurrency_listOutput>>;
	companyCurrencyGet: z.output<ReturnType<typeof companyCurrency_getOutput>>;
	companyCurrencyUpdate: z.output<
		ReturnType<typeof companyCurrency_updateOutput>
	>;
	companyUpdate: z.output<ReturnType<typeof company_updateOutput>>;
	companySparseUpdate: z.output<ReturnType<typeof company_sparseUpdateOutput>>;
	creditCardPaymentCreate: z.output<
		ReturnType<typeof creditCardPayment_createOutput>
	>;
	creditCardPaymentDelete: z.output<
		ReturnType<typeof creditCardPayment_deleteOutput>
	>;
	creditCardPaymentList: z.output<
		ReturnType<typeof creditCardPayment_listOutput>
	>;
	creditCardPaymentGet: z.output<
		ReturnType<typeof creditCardPayment_getOutput>
	>;
	creditCardPaymentUpdate: z.output<
		ReturnType<typeof creditCardPayment_updateOutput>
	>;
	creditCardPaymentSparseUpdate: z.output<
		ReturnType<typeof creditCardPayment_sparseUpdateOutput>
	>;
	creditMemoCreate: z.output<ReturnType<typeof creditMemo_createOutput>>;
	creditMemoDelete: z.output<ReturnType<typeof creditMemo_deleteOutput>>;
	creditMemoGetPdf: z.output<ReturnType<typeof creditMemo_getPdfOutput>>;
	creditMemoList: z.output<ReturnType<typeof creditMemo_listOutput>>;
	creditMemoGet: z.output<ReturnType<typeof creditMemo_getOutput>>;
	creditMemoSend: z.output<ReturnType<typeof creditMemo_sendOutput>>;
	creditMemoUpdate: z.output<ReturnType<typeof creditMemo_updateOutput>>;
	customerCreate: z.output<ReturnType<typeof customer_createOutput>>;
	customerList: z.output<ReturnType<typeof customer_listOutput>>;
	customerGet: z.output<ReturnType<typeof customer_getOutput>>;
	customerUpdate: z.output<ReturnType<typeof customer_updateOutput>>;
	customerSparseUpdate: z.output<
		ReturnType<typeof customer_sparseUpdateOutput>
	>;
	customerBalanceList: z.output<ReturnType<typeof customerBalance_listOutput>>;
	customerBalanceDetailList: z.output<
		ReturnType<typeof customerBalanceDetail_listOutput>
	>;
	customerIncomeList: z.output<ReturnType<typeof customerIncome_listOutput>>;
	customerTypeList: z.output<ReturnType<typeof customerType_listOutput>>;
	customerTypeGet: z.output<ReturnType<typeof customerType_getOutput>>;
	departmentCreate: z.output<ReturnType<typeof department_createOutput>>;
	departmentList: z.output<ReturnType<typeof department_listOutput>>;
	departmentGet: z.output<ReturnType<typeof department_getOutput>>;
	departmentUpdate: z.output<ReturnType<typeof department_updateOutput>>;
	depositCreate: z.output<ReturnType<typeof deposit_createOutput>>;
	depositDelete: z.output<ReturnType<typeof deposit_deleteOutput>>;
	depositList: z.output<ReturnType<typeof deposit_listOutput>>;
	depositGet: z.output<ReturnType<typeof deposit_getOutput>>;
	depositUpdate: z.output<ReturnType<typeof deposit_updateOutput>>;
	depositSparseUpdate: z.output<ReturnType<typeof deposit_sparseUpdateOutput>>;
	employeeCreate: z.output<ReturnType<typeof employee_createOutput>>;
	employeeList: z.output<ReturnType<typeof employee_listOutput>>;
	employeeGet: z.output<ReturnType<typeof employee_getOutput>>;
	employeeUpdate: z.output<ReturnType<typeof employee_updateOutput>>;
	estimateCreate: z.output<ReturnType<typeof estimate_createOutput>>;
	estimateDelete: z.output<ReturnType<typeof estimate_deleteOutput>>;
	estimateGetPdf: z.output<ReturnType<typeof estimate_getPdfOutput>>;
	estimateList: z.output<ReturnType<typeof estimate_listOutput>>;
	estimateGet: z.output<ReturnType<typeof estimate_getOutput>>;
	estimateSend: z.output<ReturnType<typeof estimate_sendOutput>>;
	estimateSparseUpdate: z.output<
		ReturnType<typeof estimate_sparseUpdateOutput>
	>;
	estimateUpdate: z.output<ReturnType<typeof estimate_updateOutput>>;
	exchangerateGet: z.output<ReturnType<typeof exchangerate_getOutput>>;
	exchangerateList: z.output<ReturnType<typeof exchangerate_listOutput>>;
	exchangerateUpdate: z.output<ReturnType<typeof exchangerate_updateOutput>>;
	generalLedgerList: z.output<ReturnType<typeof generalLedger_listOutput>>;
	inventoryAdjustmentCreate: z.output<
		ReturnType<typeof inventoryAdjustment_createOutput>
	>;
	inventoryAdjustmentDelete: z.output<
		ReturnType<typeof inventoryAdjustment_deleteOutput>
	>;
	inventoryAdjustmentGet: z.output<
		ReturnType<typeof inventoryAdjustment_getOutput>
	>;
	inventoryAdjustmentSparseUpdate: z.output<
		ReturnType<typeof inventoryAdjustment_sparseUpdateOutput>
	>;
	inventoryValuationDetailList: z.output<
		ReturnType<typeof inventoryValuationDetail_listOutput>
	>;
	inventoryValuationSummaryList: z.output<
		ReturnType<typeof inventoryValuationSummary_listOutput>
	>;
	invoiceCreate: z.output<ReturnType<typeof invoice_createOutput>>;
	invoiceDelete: z.output<ReturnType<typeof invoice_deleteOutput>>;
	invoiceVoid: z.output<ReturnType<typeof invoice_voidOutput>>;
	invoiceGetPdf: z.output<ReturnType<typeof invoice_getPdfOutput>>;
	invoiceList: z.output<ReturnType<typeof invoice_listOutput>>;
	invoiceGet: z.output<ReturnType<typeof invoice_getOutput>>;
	invoiceSend: z.output<ReturnType<typeof invoice_sendOutput>>;
	invoiceSparseUpdate: z.output<ReturnType<typeof invoice_sparseUpdateOutput>>;
	invoiceUpdate: z.output<ReturnType<typeof invoice_updateOutput>>;
	itemCreate: z.output<ReturnType<typeof item_createOutput>>;
	itemCreateCategory: z.output<ReturnType<typeof item_createCategoryOutput>>;
	itemListBundles: z.output<ReturnType<typeof item_listBundlesOutput>>;
	itemListCategories: z.output<ReturnType<typeof item_listCategoriesOutput>>;
	itemListItems: z.output<ReturnType<typeof item_listItemsOutput>>;
	itemGetBundle: z.output<ReturnType<typeof item_getBundleOutput>>;
	itemGetCategory: z.output<ReturnType<typeof item_getCategoryOutput>>;
	itemGetItem: z.output<ReturnType<typeof item_getItemOutput>>;
	itemUpdate: z.output<ReturnType<typeof item_updateOutput>>;
	itemUpdateCategory: z.output<ReturnType<typeof item_updateCategoryOutput>>;
	journalEntryCreate: z.output<ReturnType<typeof journalEntry_createOutput>>;
	journalEntryDelete: z.output<ReturnType<typeof journalEntry_deleteOutput>>;
	journalEntryList: z.output<ReturnType<typeof journalEntry_listOutput>>;
	journalEntryGet: z.output<ReturnType<typeof journalEntry_getOutput>>;
	journalEntryUpdate: z.output<ReturnType<typeof journalEntry_updateOutput>>;
	journalEntrySparseUpdate: z.output<
		ReturnType<typeof journalEntry_sparseUpdateOutput>
	>;
	journalReportList: z.output<ReturnType<typeof journalReport_listOutput>>;
	paymentCreate: z.output<ReturnType<typeof payment_createOutput>>;
	paymentDelete: z.output<ReturnType<typeof payment_deleteOutput>>;
	paymentVoid: z.output<ReturnType<typeof payment_voidOutput>>;
	paymentGetPdf: z.output<ReturnType<typeof payment_getPdfOutput>>;
	paymentList: z.output<ReturnType<typeof payment_listOutput>>;
	paymentGet: z.output<ReturnType<typeof payment_getOutput>>;
	paymentSend: z.output<ReturnType<typeof payment_sendOutput>>;
	paymentUpdate: z.output<ReturnType<typeof payment_updateOutput>>;
	paymentMethodCreate: z.output<ReturnType<typeof paymentMethod_createOutput>>;
	paymentMethodList: z.output<ReturnType<typeof paymentMethod_listOutput>>;
	paymentMethodGet: z.output<ReturnType<typeof paymentMethod_getOutput>>;
	paymentMethodUpdate: z.output<ReturnType<typeof paymentMethod_updateOutput>>;
	preferencesList: z.output<ReturnType<typeof preferences_listOutput>>;
	preferencesGet: z.output<ReturnType<typeof preferences_getOutput>>;
	preferencesUpdate: z.output<ReturnType<typeof preferences_updateOutput>>;
	profitAndLossList: z.output<ReturnType<typeof profitAndLoss_listOutput>>;
	profitAndLossDetailList: z.output<
		ReturnType<typeof profitAndLossDetail_listOutput>
	>;
	purchaseCreate: z.output<ReturnType<typeof purchase_createOutput>>;
	purchaseDelete: z.output<ReturnType<typeof purchase_deleteOutput>>;
	purchaseList: z.output<ReturnType<typeof purchase_listOutput>>;
	purchaseGet: z.output<ReturnType<typeof purchase_getOutput>>;
	purchaseUpdate: z.output<ReturnType<typeof purchase_updateOutput>>;
	purchaseOrderCreate: z.output<ReturnType<typeof purchaseOrder_createOutput>>;
	purchaseOrderDelete: z.output<ReturnType<typeof purchaseOrder_deleteOutput>>;
	purchaseOrderGetPdf: z.output<ReturnType<typeof purchaseOrder_getPdfOutput>>;
	purchaseOrderList: z.output<ReturnType<typeof purchaseOrder_listOutput>>;
	purchaseOrderGet: z.output<ReturnType<typeof purchaseOrder_getOutput>>;
	purchaseOrderSend: z.output<ReturnType<typeof purchaseOrder_sendOutput>>;
	purchaseOrderUpdate: z.output<ReturnType<typeof purchaseOrder_updateOutput>>;
	recurringTransactionCreate: z.output<
		ReturnType<typeof recurringTransaction_createOutput>
	>;
	recurringTransactionDelete: z.output<
		ReturnType<typeof recurringTransaction_deleteOutput>
	>;
	recurringTransactionList: z.output<
		ReturnType<typeof recurringTransaction_listOutput>
	>;
	recurringTransactionGet: z.output<
		ReturnType<typeof recurringTransaction_getOutput>
	>;
	refundReceiptCreate: z.output<ReturnType<typeof refundReceipt_createOutput>>;
	refundReceiptDelete: z.output<ReturnType<typeof refundReceipt_deleteOutput>>;
	refundReceiptGetPdf: z.output<ReturnType<typeof refundReceipt_getPdfOutput>>;
	refundReceiptList: z.output<ReturnType<typeof refundReceipt_listOutput>>;
	refundReceiptGet: z.output<ReturnType<typeof refundReceipt_getOutput>>;
	refundReceiptSend: z.output<ReturnType<typeof refundReceipt_sendOutput>>;
	refundReceiptSparseUpdate: z.output<
		ReturnType<typeof refundReceipt_sparseUpdateOutput>
	>;
	refundReceiptUpdate: z.output<ReturnType<typeof refundReceipt_updateOutput>>;
	reimburseChargeList: z.output<ReturnType<typeof reimburseCharge_listOutput>>;
	reimburseChargeGet: z.output<ReturnType<typeof reimburseCharge_getOutput>>;
	salesByClassSummaryList: z.output<
		ReturnType<typeof salesByClassSummary_listOutput>
	>;
	salesByCustomerList: z.output<ReturnType<typeof salesByCustomer_listOutput>>;
	salesByDepartmentList: z.output<
		ReturnType<typeof salesByDepartment_listOutput>
	>;
	salesByProductList: z.output<ReturnType<typeof salesByProduct_listOutput>>;
	salesReceiptCreate: z.output<ReturnType<typeof salesReceipt_createOutput>>;
	salesReceiptDelete: z.output<ReturnType<typeof salesReceipt_deleteOutput>>;
	salesReceiptVoid: z.output<ReturnType<typeof salesReceipt_voidOutput>>;
	salesReceiptGetPdf: z.output<ReturnType<typeof salesReceipt_getPdfOutput>>;
	salesReceiptList: z.output<ReturnType<typeof salesReceipt_listOutput>>;
	salesReceiptGet: z.output<ReturnType<typeof salesReceipt_getOutput>>;
	salesReceiptSend: z.output<ReturnType<typeof salesReceipt_sendOutput>>;
	salesReceiptUpdate: z.output<ReturnType<typeof salesReceipt_updateOutput>>;
	salesReceiptSparseUpdate: z.output<
		ReturnType<typeof salesReceipt_sparseUpdateOutput>
	>;
	taxAgencyCreate: z.output<ReturnType<typeof taxAgency_createOutput>>;
	taxAgencyList: z.output<ReturnType<typeof taxAgency_listOutput>>;
	taxAgencyGet: z.output<ReturnType<typeof taxAgency_getOutput>>;
	taxClassificationGet: z.output<
		ReturnType<typeof taxClassification_getOutput>
	>;
	taxClassificationListChildren: z.output<
		ReturnType<typeof taxClassification_listChildrenOutput>
	>;
	taxClassificationList: z.output<
		ReturnType<typeof taxClassification_listOutput>
	>;
	taxClassificationListByLevel: z.output<
		ReturnType<typeof taxClassification_listByLevelOutput>
	>;
	taxCodeList: z.output<ReturnType<typeof taxCode_listOutput>>;
	taxCodeGet: z.output<ReturnType<typeof taxCode_getOutput>>;
	taxPaymentList: z.output<ReturnType<typeof taxPayment_listOutput>>;
	taxPaymentGet: z.output<ReturnType<typeof taxPayment_getOutput>>;
	taxRateList: z.output<ReturnType<typeof taxRate_listOutput>>;
	taxRateGet: z.output<ReturnType<typeof taxRate_getOutput>>;
	taxServiceCreate: z.output<ReturnType<typeof taxService_createOutput>>;
	taxSummaryList: z.output<ReturnType<typeof taxSummary_listOutput>>;
	termCreate: z.output<ReturnType<typeof term_createOutput>>;
	termList: z.output<ReturnType<typeof term_listOutput>>;
	termGet: z.output<ReturnType<typeof term_getOutput>>;
	termUpdate: z.output<ReturnType<typeof term_updateOutput>>;
	timeActivityCreate: z.output<ReturnType<typeof timeActivity_createOutput>>;
	timeActivityDelete: z.output<ReturnType<typeof timeActivity_deleteOutput>>;
	timeActivityList: z.output<ReturnType<typeof timeActivity_listOutput>>;
	timeActivityGet: z.output<ReturnType<typeof timeActivity_getOutput>>;
	timeActivityUpdate: z.output<ReturnType<typeof timeActivity_updateOutput>>;
	transactionListList: z.output<ReturnType<typeof transactionList_listOutput>>;
	transactionListByCustomerList: z.output<
		ReturnType<typeof transactionListByCustomer_listOutput>
	>;
	transactionListByVendorList: z.output<
		ReturnType<typeof transactionListByVendor_listOutput>
	>;
	transactionListWithSplitsList: z.output<
		ReturnType<typeof transactionListWithSplits_listOutput>
	>;
	transferCreate: z.output<ReturnType<typeof transfer_createOutput>>;
	transferDelete: z.output<ReturnType<typeof transfer_deleteOutput>>;
	transferList: z.output<ReturnType<typeof transfer_listOutput>>;
	transferGet: z.output<ReturnType<typeof transfer_getOutput>>;
	transferSparseUpdate: z.output<
		ReturnType<typeof transfer_sparseUpdateOutput>
	>;
	transferUpdate: z.output<ReturnType<typeof transfer_updateOutput>>;
	trialBalanceList: z.output<ReturnType<typeof trialBalance_listOutput>>;
	vendorCreate: z.output<ReturnType<typeof vendor_createOutput>>;
	vendorList: z.output<ReturnType<typeof vendor_listOutput>>;
	vendorGet: z.output<ReturnType<typeof vendor_getOutput>>;
	vendorUpdate: z.output<ReturnType<typeof vendor_updateOutput>>;
	vendorBalanceList: z.output<ReturnType<typeof vendorBalance_listOutput>>;
	vendorBalanceDetailList: z.output<
		ReturnType<typeof vendorBalanceDetail_listOutput>
	>;
	vendorCreditCreate: z.output<ReturnType<typeof vendorCredit_createOutput>>;
	vendorCreditDelete: z.output<ReturnType<typeof vendorCredit_deleteOutput>>;
	vendorCreditList: z.output<ReturnType<typeof vendorCredit_listOutput>>;
	vendorCreditGet: z.output<ReturnType<typeof vendorCredit_getOutput>>;
	vendorCreditUpdate: z.output<ReturnType<typeof vendorCredit_updateOutput>>;
	vendorExpensesList: z.output<ReturnType<typeof vendorExpenses_listOutput>>;
};
