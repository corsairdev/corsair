import { Buffer } from 'node:buffer';
import type { CorsairContext } from 'corsair/core';
import type { BinaryResponse } from 'corsair/http';
import { z } from 'zod';
import type {
	QuickBooksEnvironment,
	QuickBooksRequestOptions,
} from '../client';
import { makeAuthenticatedQuickBooksRequest } from '../client';
import { QuickBooksModelSchemas } from './models';

const RealmIdSchema = z.string().regex(/^\d+$/);
const IdSchema = z.string().min(1);
const SyncTokenSchema = z.string().min(1);
const DeleteBodySchema = z
	.object({ Id: IdSchema, SyncToken: SyncTokenSchema })
	.strict();
const VoidBodySchema = z
	.object({ Id: IdSchema, SyncToken: SyncTokenSchema, sparse: z.literal(true) })
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
	input: I;
	output: O;
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
		const input = definition.input.parse(rawInput);
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
			return definition.output.parse({
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
		return definition.output.parse(result);
	};
}

const apAgingDetail_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['agedpayabledetailquery']
			.partial()
			.optional(),
	})
	.strict();
const apAgingDetail_listOutput = QuickBooksModelSchemas['reporttoplevel'];
const apAgingDetail_listDef = {
	input: apAgingDetail_listInput,
	output: apAgingDetail_listOutput,
	request: (input: z.output<typeof apAgingDetail_listInput>) => ({
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

const apAgingSummary_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['agedpayablesquery'].partial().optional(),
	})
	.strict();
const apAgingSummary_listOutput =
	QuickBooksModelSchemas['agedpayablestoplevel'];
const apAgingSummary_listDef = {
	input: apAgingSummary_listInput,
	output: apAgingSummary_listOutput,
	request: (input: z.output<typeof apAgingSummary_listInput>) => ({
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

const arAgingDetail_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['agedreceivabledetailquery']
			.partial()
			.optional(),
	})
	.strict();
const arAgingDetail_listOutput = QuickBooksModelSchemas['reporttoplevel'];
const arAgingDetail_listDef = {
	input: arAgingDetail_listInput,
	output: arAgingDetail_listOutput,
	request: (input: z.output<typeof arAgingDetail_listInput>) => ({
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

const arAgingSummary_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['agedreceivablesquery'].partial().optional(),
	})
	.strict();
const arAgingSummary_listOutput =
	QuickBooksModelSchemas['agedreceivablestoplevel'];
const arAgingSummary_listDef = {
	input: arAgingSummary_listInput,
	output: arAgingSummary_listOutput,
	request: (input: z.output<typeof arAgingSummary_listInput>) => ({
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

const accounts_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['accountresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const accounts_updateOutput = z
	.object({
		Account: QuickBooksModelSchemas['accountresponse'],
		time: z.string(),
	})
	.strict();
const accounts_updateDef = {
	input: accounts_updateInput,
	output: accounts_updateOutput,
	request: (input: z.output<typeof accounts_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/account`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const accounts_updateEndpoint = defineEndpoint(accounts_updateDef);

const accountListDetail_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['accountlistquery'].partial().optional(),
	})
	.strict();
const accountListDetail_listOutput = QuickBooksModelSchemas['reporttoplevel'];
const accountListDetail_listDef = {
	input: accountListDetail_listInput,
	output: accountListDetail_listOutput,
	request: (input: z.output<typeof accountListDetail_listInput>) => ({
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

const attachable_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['attachablerequest'],
	})
	.strict();
const attachable_createOutput = z
	.object({
		Attachable: QuickBooksModelSchemas['attachableresponse'],
		time: z.string(),
	})
	.strict();
const attachable_createDef = {
	input: attachable_createInput,
	output: attachable_createOutput,
	request: (input: z.output<typeof attachable_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/attachable`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const attachable_createEndpoint = defineEndpoint(attachable_createDef);

const attachable_deleteInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['attachableresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const attachable_deleteOutput = z
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
	.strict();
const attachable_deleteDef = {
	input: attachable_deleteInput,
	output: attachable_deleteOutput,
	request: (input: z.output<typeof attachable_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/attachable`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const attachable_deleteEndpoint = defineEndpoint(attachable_deleteDef);

const attachable_downloadInput = z
	.object({ realmId: RealmIdSchema, attachableId: IdSchema })
	.strict();
const attachable_downloadOutput = z.string().url();
const attachable_downloadDef = {
	input: attachable_downloadInput,
	output: attachable_downloadOutput,
	request: (input: z.output<typeof attachable_downloadInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/download/${encodeURIComponent(input.attachableId)}`,
		method: 'GET',
		headers: { Accept: 'text/plain' },
	}),
} as const;
const attachable_downloadEndpoint = defineEndpoint(attachable_downloadDef);

const attachable_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const attachable_listOutput = z
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
	.strict();
const attachable_listDef = {
	input: attachable_listInput,
	output: attachable_listOutput,
	request: (input: z.output<typeof attachable_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Attachable${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const attachable_listEndpoint = defineEndpoint(attachable_listDef);

const attachable_getInput = z
	.object({ realmId: RealmIdSchema, attachableId: IdSchema })
	.strict();
const attachable_getOutput = z
	.object({
		Attachable: QuickBooksModelSchemas['attachableresponse'],
		time: z.string(),
	})
	.strict();
const attachable_getDef = {
	input: attachable_getInput,
	output: attachable_getOutput,
	request: (input: z.output<typeof attachable_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/attachable/${encodeURIComponent(input.attachableId)}`,
		method: 'GET',
	}),
} as const;
const attachable_getEndpoint = defineEndpoint(attachable_getDef);

const attachable_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['attachableresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const attachable_updateOutput = z
	.object({
		Attachable: QuickBooksModelSchemas['attachableresponse'],
		time: z.string(),
	})
	.strict();
const attachable_updateDef = {
	input: attachable_updateInput,
	output: attachable_updateOutput,
	request: (input: z.output<typeof attachable_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/attachable`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const attachable_updateEndpoint = defineEndpoint(attachable_updateDef);

const attachable_uploadInput = z
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
		metadata: QuickBooksModelSchemas['attachablerequest'].partial().optional(),
	})
	.strict();
const attachable_uploadOutput = z
	.object({
		Attachable: QuickBooksModelSchemas['attachableresponse'],
		time: z.string(),
	})
	.strict();
const attachable_uploadDef = {
	input: attachable_uploadInput,
	output: attachable_uploadOutput,
	request: (input: z.output<typeof attachable_uploadInput>) => ({
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

const balanceSheet_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['balancesheetquery'].partial().optional(),
	})
	.strict();
const balanceSheet_listOutput =
	QuickBooksModelSchemas['balancesheetreporttoplevel'];
const balanceSheet_listDef = {
	input: balanceSheet_listInput,
	output: balanceSheet_listOutput,
	request: (input: z.output<typeof balanceSheet_listInput>) => ({
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

const bill_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['billrequest'],
	})
	.strict();
const bill_createOutput = z
	.object({ Bill: QuickBooksModelSchemas['billresponse'], time: z.string() })
	.strict();
const bill_createDef = {
	input: bill_createInput,
	output: bill_createOutput,
	request: (input: z.output<typeof bill_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/bill`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const bill_createEndpoint = defineEndpoint(bill_createDef);

const bill_deleteInput = z
	.object({ realmId: RealmIdSchema, body: DeleteBodySchema })
	.strict();
const bill_deleteOutput = z
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
	.strict();
const bill_deleteDef = {
	input: bill_deleteInput,
	output: bill_deleteOutput,
	request: (input: z.output<typeof bill_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/bill`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const bill_deleteEndpoint = defineEndpoint(bill_deleteDef);

const bill_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const bill_listOutput = z
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
	.strict();
const bill_listDef = {
	input: bill_listInput,
	output: bill_listOutput,
	request: (input: z.output<typeof bill_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Bill${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const bill_listEndpoint = defineEndpoint(bill_listDef);

const bill_getInput = z
	.object({ realmId: RealmIdSchema, billId: IdSchema })
	.strict();
const bill_getOutput = z
	.object({ Bill: QuickBooksModelSchemas['billresponse'], time: z.string() })
	.strict();
const bill_getDef = {
	input: bill_getInput,
	output: bill_getOutput,
	request: (input: z.output<typeof bill_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/bill/${encodeURIComponent(input.billId)}`,
		method: 'GET',
	}),
} as const;
const bill_getEndpoint = defineEndpoint(bill_getDef);

const bill_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['billresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const bill_updateOutput = z
	.object({ Bill: QuickBooksModelSchemas['billresponse'], time: z.string() })
	.strict();
const bill_updateDef = {
	input: bill_updateInput,
	output: bill_updateOutput,
	request: (input: z.output<typeof bill_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/bill`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const bill_updateEndpoint = defineEndpoint(bill_updateDef);

const billPayment_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['billpaymentrequest'],
	})
	.strict();
const billPayment_createOutput = z
	.object({
		BillPayment: QuickBooksModelSchemas['billpaymentresponse'],
		time: z.string(),
	})
	.strict();
const billPayment_createDef = {
	input: billPayment_createInput,
	output: billPayment_createOutput,
	request: (input: z.output<typeof billPayment_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/billpayment`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const billPayment_createEndpoint = defineEndpoint(billPayment_createDef);

const billPayment_voidInput = z
	.object({ realmId: RealmIdSchema, body: VoidBodySchema })
	.strict();
const billPayment_voidOutput = z
	.object({
		BillPayment: QuickBooksModelSchemas['billpaymentresponse'],
		time: z.string(),
	})
	.strict();
const billPayment_voidDef = {
	input: billPayment_voidInput,
	output: billPayment_voidOutput,
	request: (input: z.output<typeof billPayment_voidInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/billpayment`,
		method: 'POST',
		query: { operation: 'update', include: 'void' },
		body: input.body,
	}),
} as const;
const billPayment_voidEndpoint = defineEndpoint(billPayment_voidDef);

const billPayment_deleteInput = z
	.object({ realmId: RealmIdSchema, body: DeleteBodySchema })
	.strict();
const billPayment_deleteOutput = z
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
	.strict();
const billPayment_deleteDef = {
	input: billPayment_deleteInput,
	output: billPayment_deleteOutput,
	request: (input: z.output<typeof billPayment_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/billpayment`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const billPayment_deleteEndpoint = defineEndpoint(billPayment_deleteDef);

const billPayment_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const billPayment_listOutput = z
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
	.strict();
const billPayment_listDef = {
	input: billPayment_listInput,
	output: billPayment_listOutput,
	request: (input: z.output<typeof billPayment_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM BillPayment${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const billPayment_listEndpoint = defineEndpoint(billPayment_listDef);

const billPayment_getInput = z
	.object({ realmId: RealmIdSchema, billpaymentId: IdSchema })
	.strict();
const billPayment_getOutput = z
	.object({
		BillPayment: QuickBooksModelSchemas['billpaymentresponse'],
		time: z.string(),
	})
	.strict();
const billPayment_getDef = {
	input: billPayment_getInput,
	output: billPayment_getOutput,
	request: (input: z.output<typeof billPayment_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/billpayment/${encodeURIComponent(input.billpaymentId)}`,
		method: 'GET',
	}),
} as const;
const billPayment_getEndpoint = defineEndpoint(billPayment_getDef);

const billPayment_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['billpaymentresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const billPayment_updateOutput = z
	.object({
		BillPayment: QuickBooksModelSchemas['billpaymentresponse'],
		time: z.string(),
	})
	.strict();
const billPayment_updateDef = {
	input: billPayment_updateInput,
	output: billPayment_updateOutput,
	request: (input: z.output<typeof billPayment_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/billpayment`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const billPayment_updateEndpoint = defineEndpoint(billPayment_updateDef);

const budget_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['budgetrequest'],
	})
	.strict();
const budget_createOutput = z
	.object({
		Budget: QuickBooksModelSchemas['budgetresponse'],
		time: z.string(),
	})
	.strict();
const budget_createDef = {
	input: budget_createInput,
	output: budget_createOutput,
	request: (input: z.output<typeof budget_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/budget`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const budget_createEndpoint = defineEndpoint(budget_createDef);

const budget_deleteInput = z
	.object({ realmId: RealmIdSchema, body: DeleteBodySchema })
	.strict();
const budget_deleteOutput = z
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
	.strict();
const budget_deleteDef = {
	input: budget_deleteInput,
	output: budget_deleteOutput,
	request: (input: z.output<typeof budget_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/budget`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const budget_deleteEndpoint = defineEndpoint(budget_deleteDef);

const budget_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const budget_listOutput = z
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
	.strict();
const budget_listDef = {
	input: budget_listInput,
	output: budget_listOutput,
	request: (input: z.output<typeof budget_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Budget${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const budget_listEndpoint = defineEndpoint(budget_listDef);

const budget_getInput = z
	.object({ realmId: RealmIdSchema, budgetId: IdSchema })
	.strict();
const budget_getOutput = z
	.object({
		Budget: QuickBooksModelSchemas['budgetresponse'],
		time: z.string(),
	})
	.strict();
const budget_getDef = {
	input: budget_getInput,
	output: budget_getOutput,
	request: (input: z.output<typeof budget_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/budget/${encodeURIComponent(input.budgetId)}`,
		method: 'GET',
	}),
} as const;
const budget_getEndpoint = defineEndpoint(budget_getDef);

const budget_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['budgetresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const budget_updateOutput = z
	.object({
		Budget: QuickBooksModelSchemas['budgetresponse'],
		time: z.string(),
	})
	.strict();
const budget_updateDef = {
	input: budget_updateInput,
	output: budget_updateOutput,
	request: (input: z.output<typeof budget_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/budget`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const budget_updateEndpoint = defineEndpoint(budget_updateDef);

const cashFlow_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['cashflowquery'].partial().optional(),
	})
	.strict();
const cashFlow_listOutput = QuickBooksModelSchemas['cashflowtoplevel'];
const cashFlow_listDef = {
	input: cashFlow_listInput,
	output: cashFlow_listOutput,
	request: (input: z.output<typeof cashFlow_listInput>) => ({
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

const changeOrder_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['changeorderrequest'],
	})
	.strict();
const changeOrder_createOutput = z
	.object({
		ChangeOrder: QuickBooksModelSchemas['changeorderresponse'],
		time: z.string(),
	})
	.strict();
const changeOrder_createDef = {
	input: changeOrder_createInput,
	output: changeOrder_createOutput,
	request: (input: z.output<typeof changeOrder_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/changeorder`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const changeOrder_createEndpoint = defineEndpoint(changeOrder_createDef);

const changeOrder_deleteInput = z
	.object({ realmId: RealmIdSchema, body: DeleteBodySchema })
	.strict();
const changeOrder_deleteOutput = z
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
	.strict();
const changeOrder_deleteDef = {
	input: changeOrder_deleteInput,
	output: changeOrder_deleteOutput,
	request: (input: z.output<typeof changeOrder_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/changeorder`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const changeOrder_deleteEndpoint = defineEndpoint(changeOrder_deleteDef);

const changeOrder_getInput = z
	.object({ realmId: RealmIdSchema, changeorderId: IdSchema })
	.strict();
const changeOrder_getOutput = z
	.object({
		ChangeOrder: QuickBooksModelSchemas['changeorderresponse'],
		time: z.string(),
	})
	.strict();
const changeOrder_getDef = {
	input: changeOrder_getInput,
	output: changeOrder_getOutput,
	request: (input: z.output<typeof changeOrder_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/changeorder/${encodeURIComponent(input.changeorderId)}`,
		method: 'GET',
	}),
} as const;
const changeOrder_getEndpoint = defineEndpoint(changeOrder_getDef);

const changeOrder_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['changeorderresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const changeOrder_updateOutput = z
	.object({
		ChangeOrder: QuickBooksModelSchemas['changeorderresponse'],
		time: z.string(),
	})
	.strict();
const changeOrder_updateDef = {
	input: changeOrder_updateInput,
	output: changeOrder_updateOutput,
	request: (input: z.output<typeof changeOrder_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/changeorder`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const changeOrder_updateEndpoint = defineEndpoint(changeOrder_updateDef);

const class_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['classrequest'],
	})
	.strict();
const class_createOutput = z
	.object({ Class: QuickBooksModelSchemas['classresponse'], time: z.string() })
	.strict();
const class_createDef = {
	input: class_createInput,
	output: class_createOutput,
	request: (input: z.output<typeof class_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/class`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const class_createEndpoint = defineEndpoint(class_createDef);

const class_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const class_listOutput = z
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
	.strict();
const class_listDef = {
	input: class_listInput,
	output: class_listOutput,
	request: (input: z.output<typeof class_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Class${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const class_listEndpoint = defineEndpoint(class_listDef);

const class_getInput = z
	.object({ realmId: RealmIdSchema, classId: IdSchema })
	.strict();
const class_getOutput = z
	.object({ Class: QuickBooksModelSchemas['classresponse'], time: z.string() })
	.strict();
const class_getDef = {
	input: class_getInput,
	output: class_getOutput,
	request: (input: z.output<typeof class_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/class/${encodeURIComponent(input.classId)}`,
		method: 'GET',
	}),
} as const;
const class_getEndpoint = defineEndpoint(class_getDef);

const class_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['classresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const class_updateOutput = z
	.object({ Class: QuickBooksModelSchemas['classresponse'], time: z.string() })
	.strict();
const class_updateDef = {
	input: class_updateInput,
	output: class_updateOutput,
	request: (input: z.output<typeof class_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/class`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const class_updateEndpoint = defineEndpoint(class_updateDef);

const companyCurrency_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['companycurrencyrequest'],
	})
	.strict();
const companyCurrency_createOutput = z
	.object({
		CompanyCurrency: QuickBooksModelSchemas['companycurrencyresponse'],
		time: z.string(),
	})
	.strict();
const companyCurrency_createDef = {
	input: companyCurrency_createInput,
	output: companyCurrency_createOutput,
	request: (input: z.output<typeof companyCurrency_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/companycurrency`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const companyCurrency_createEndpoint = defineEndpoint(
	companyCurrency_createDef,
);

const companyCurrency_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const companyCurrency_listOutput = z
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
	.strict();
const companyCurrency_listDef = {
	input: companyCurrency_listInput,
	output: companyCurrency_listOutput,
	request: (input: z.output<typeof companyCurrency_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM CompanyCurrency${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const companyCurrency_listEndpoint = defineEndpoint(companyCurrency_listDef);

const companyCurrency_getInput = z
	.object({ realmId: RealmIdSchema, companycurrencyId: IdSchema })
	.strict();
const companyCurrency_getOutput = z
	.object({
		CompanyCurrency: QuickBooksModelSchemas['companycurrencyresponse'],
		time: z.string(),
	})
	.strict();
const companyCurrency_getDef = {
	input: companyCurrency_getInput,
	output: companyCurrency_getOutput,
	request: (input: z.output<typeof companyCurrency_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/companycurrency/${encodeURIComponent(input.companycurrencyId)}`,
		method: 'GET',
	}),
} as const;
const companyCurrency_getEndpoint = defineEndpoint(companyCurrency_getDef);

const companyCurrency_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['companycurrencyresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const companyCurrency_updateOutput = z
	.object({
		CompanyCurrency: QuickBooksModelSchemas['companycurrencyresponse'],
		time: z.string(),
	})
	.strict();
const companyCurrency_updateDef = {
	input: companyCurrency_updateInput,
	output: companyCurrency_updateOutput,
	request: (input: z.output<typeof companyCurrency_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/companycurrency`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const companyCurrency_updateEndpoint = defineEndpoint(
	companyCurrency_updateDef,
);

const company_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['companyinforesponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const company_updateOutput = z
	.object({
		CompanyInfo: QuickBooksModelSchemas['companyinforesponse'],
		time: z.string(),
	})
	.strict();
const company_updateDef = {
	input: company_updateInput,
	output: company_updateOutput,
	request: (input: z.output<typeof company_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/companyinfo`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const company_updateEndpoint = defineEndpoint(company_updateDef);

const company_sparseUpdateInput = z
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
	.strict();
const company_sparseUpdateOutput = z
	.object({
		CompanyInfo: QuickBooksModelSchemas['companyinforesponse'],
		time: z.string(),
	})
	.strict();
const company_sparseUpdateDef = {
	input: company_sparseUpdateInput,
	output: company_sparseUpdateOutput,
	request: (input: z.output<typeof company_sparseUpdateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/companyinfo`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const company_sparseUpdateEndpoint = defineEndpoint(company_sparseUpdateDef);

const creditCardPayment_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['creditcardpaymentrequest'],
	})
	.strict();
const creditCardPayment_createOutput = z
	.object({
		CreditCardPayment: QuickBooksModelSchemas['creditcardpaymentresponse'],
		time: z.string(),
	})
	.strict();
const creditCardPayment_createDef = {
	input: creditCardPayment_createInput,
	output: creditCardPayment_createOutput,
	request: (input: z.output<typeof creditCardPayment_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditcardpayment`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const creditCardPayment_createEndpoint = defineEndpoint(
	creditCardPayment_createDef,
);

const creditCardPayment_deleteInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['creditcardpaymentresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const creditCardPayment_deleteOutput = z
	.object({
		CreditCardPayment: z
			.object({
				status: z.literal('Deleted'),
				Id: IdSchema,
				domain: z.literal('QBO').optional(),
			})
			.strict(),
		time: z.string().optional(),
	})
	.strict();
const creditCardPayment_deleteDef = {
	input: creditCardPayment_deleteInput,
	output: creditCardPayment_deleteOutput,
	request: (input: z.output<typeof creditCardPayment_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditcardpayment`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const creditCardPayment_deleteEndpoint = defineEndpoint(
	creditCardPayment_deleteDef,
);

const creditCardPayment_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const creditCardPayment_listOutput = z
	.object({
		QueryResponse: z
			.object({
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
				CreditCardPayment: z
					.array(QuickBooksModelSchemas['creditcardpaymentresponse'])
					.optional(),
			})
			.strict(),
		time: z.string(),
	})
	.strict();
const creditCardPayment_listDef = {
	input: creditCardPayment_listInput,
	output: creditCardPayment_listOutput,
	request: (input: z.output<typeof creditCardPayment_listInput>) => ({
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

const creditCardPayment_getInput = z
	.object({ realmId: RealmIdSchema, creditcardpaymentId: IdSchema })
	.strict();
const creditCardPayment_getOutput = z
	.object({
		CreditCardPayment: QuickBooksModelSchemas['creditcardpaymentresponse'],
		time: z.string(),
	})
	.strict();
const creditCardPayment_getDef = {
	input: creditCardPayment_getInput,
	output: creditCardPayment_getOutput,
	request: (input: z.output<typeof creditCardPayment_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditcardpayment/${encodeURIComponent(input.creditcardpaymentId)}`,
		method: 'GET',
	}),
} as const;
const creditCardPayment_getEndpoint = defineEndpoint(creditCardPayment_getDef);

const creditCardPayment_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['creditcardpaymentrequest']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const creditCardPayment_updateOutput = z
	.object({
		CreditCardPayment: QuickBooksModelSchemas['creditcardpaymentresponse'],
		time: z.string(),
	})
	.strict();
const creditCardPayment_updateDef = {
	input: creditCardPayment_updateInput,
	output: creditCardPayment_updateOutput,
	request: (input: z.output<typeof creditCardPayment_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditcardpayment`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const creditCardPayment_updateEndpoint = defineEndpoint(
	creditCardPayment_updateDef,
);

const creditCardPayment_sparseUpdateInput = z
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
	.strict();
const creditCardPayment_sparseUpdateOutput = z
	.object({
		CreditCardPayment: QuickBooksModelSchemas['creditcardpaymentresponse'],
		time: z.string(),
	})
	.strict();
const creditCardPayment_sparseUpdateDef = {
	input: creditCardPayment_sparseUpdateInput,
	output: creditCardPayment_sparseUpdateOutput,
	request: (input: z.output<typeof creditCardPayment_sparseUpdateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditcardpayment`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const creditCardPayment_sparseUpdateEndpoint = defineEndpoint(
	creditCardPayment_sparseUpdateDef,
);

const creditMemo_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['creditmemorequest'],
	})
	.strict();
const creditMemo_createOutput = z
	.object({
		CreditMemo: QuickBooksModelSchemas['creditmemoresponse'],
		time: z.string(),
	})
	.strict();
const creditMemo_createDef = {
	input: creditMemo_createInput,
	output: creditMemo_createOutput,
	request: (input: z.output<typeof creditMemo_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditmemo`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const creditMemo_createEndpoint = defineEndpoint(creditMemo_createDef);

const creditMemo_deleteInput = z
	.object({ realmId: RealmIdSchema, body: DeleteBodySchema })
	.strict();
const creditMemo_deleteOutput = z
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
	.strict();
const creditMemo_deleteDef = {
	input: creditMemo_deleteInput,
	output: creditMemo_deleteOutput,
	request: (input: z.output<typeof creditMemo_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditmemo`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const creditMemo_deleteEndpoint = defineEndpoint(creditMemo_deleteDef);

const creditMemo_getPdfInput = z
	.object({ realmId: RealmIdSchema, creditmemoId: IdSchema })
	.strict();
const creditMemo_getPdfOutput = BinarySchema;
const creditMemo_getPdfDef = {
	input: creditMemo_getPdfInput,
	output: creditMemo_getPdfOutput,
	kind: 'binary',
	request: (input: z.output<typeof creditMemo_getPdfInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditmemo/${encodeURIComponent(input.creditmemoId)}/pdf`,
		method: 'GET',
		headers: { Accept: 'application/pdf' },
	}),
} as const;
const creditMemo_getPdfEndpoint = defineEndpoint(creditMemo_getPdfDef);

const creditMemo_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const creditMemo_listOutput = z
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
	.strict();
const creditMemo_listDef = {
	input: creditMemo_listInput,
	output: creditMemo_listOutput,
	request: (input: z.output<typeof creditMemo_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM CreditMemo${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const creditMemo_listEndpoint = defineEndpoint(creditMemo_listDef);

const creditMemo_getInput = z
	.object({ realmId: RealmIdSchema, creditmemoId: IdSchema })
	.strict();
const creditMemo_getOutput = z
	.object({
		CreditMemo: QuickBooksModelSchemas['creditmemoresponse'],
		time: z.string(),
	})
	.strict();
const creditMemo_getDef = {
	input: creditMemo_getInput,
	output: creditMemo_getOutput,
	request: (input: z.output<typeof creditMemo_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditmemo/${encodeURIComponent(input.creditmemoId)}`,
		method: 'GET',
	}),
} as const;
const creditMemo_getEndpoint = defineEndpoint(creditMemo_getDef);

const creditMemo_sendInput = z
	.object({
		realmId: RealmIdSchema,
		creditmemoId: IdSchema,
		sendTo: z.string().email().optional(),
	})
	.strict();
const creditMemo_sendOutput = z
	.object({
		CreditMemo: QuickBooksModelSchemas['creditmemoresponse'],
		time: z.string(),
	})
	.strict();
const creditMemo_sendDef = {
	input: creditMemo_sendInput,
	output: creditMemo_sendOutput,
	request: (input: z.output<typeof creditMemo_sendInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditmemo/${encodeURIComponent(input.creditmemoId)}/send`,
		method: 'POST',
		query: { sendTo: input.sendTo },
		headers: { Accept: 'application/json' },
	}),
} as const;
const creditMemo_sendEndpoint = defineEndpoint(creditMemo_sendDef);

const creditMemo_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['creditmemoresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const creditMemo_updateOutput = z
	.object({
		CreditMemo: QuickBooksModelSchemas['creditmemoresponse'],
		time: z.string(),
	})
	.strict();
const creditMemo_updateDef = {
	input: creditMemo_updateInput,
	output: creditMemo_updateOutput,
	request: (input: z.output<typeof creditMemo_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/creditmemo`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const creditMemo_updateEndpoint = defineEndpoint(creditMemo_updateDef);

const customer_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['customerrequest'],
	})
	.strict();
const customer_createOutput = z
	.object({
		Customer: QuickBooksModelSchemas['customerresponse'],
		time: z.string(),
	})
	.strict();
const customer_createDef = {
	input: customer_createInput,
	output: customer_createOutput,
	request: (input: z.output<typeof customer_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/customer`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const customer_createEndpoint = defineEndpoint(customer_createDef);

const customer_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const customer_listOutput = z
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
	.strict();
const customer_listDef = {
	input: customer_listInput,
	output: customer_listOutput,
	request: (input: z.output<typeof customer_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Customer${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const customer_listEndpoint = defineEndpoint(customer_listDef);

const customer_getInput = z
	.object({ realmId: RealmIdSchema, customerId: IdSchema })
	.strict();
const customer_getOutput = z
	.object({
		Customer: QuickBooksModelSchemas['customerresponse'],
		time: z.string(),
	})
	.strict();
const customer_getDef = {
	input: customer_getInput,
	output: customer_getOutput,
	request: (input: z.output<typeof customer_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/customer/${encodeURIComponent(input.customerId)}`,
		method: 'GET',
	}),
} as const;
const customer_getEndpoint = defineEndpoint(customer_getDef);

const customer_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['customerresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const customer_updateOutput = z
	.object({
		Customer: QuickBooksModelSchemas['customerresponse'],
		time: z.string(),
	})
	.strict();
const customer_updateDef = {
	input: customer_updateInput,
	output: customer_updateOutput,
	request: (input: z.output<typeof customer_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/customer`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const customer_updateEndpoint = defineEndpoint(customer_updateDef);

const customer_sparseUpdateInput = z
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
	.strict();
const customer_sparseUpdateOutput = z
	.object({
		Customer: QuickBooksModelSchemas['customerresponse'],
		time: z.string(),
	})
	.strict();
const customer_sparseUpdateDef = {
	input: customer_sparseUpdateInput,
	output: customer_sparseUpdateOutput,
	request: (input: z.output<typeof customer_sparseUpdateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/customer`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const customer_sparseUpdateEndpoint = defineEndpoint(customer_sparseUpdateDef);

const customerBalance_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['customerbalancequery'].partial().optional(),
	})
	.strict();
const customerBalance_listOutput = QuickBooksModelSchemas['reporttoplevel'];
const customerBalance_listDef = {
	input: customerBalance_listInput,
	output: customerBalance_listOutput,
	request: (input: z.output<typeof customerBalance_listInput>) => ({
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

const customerBalanceDetail_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['customerbalancedetailquery']
			.partial()
			.optional(),
	})
	.strict();
const customerBalanceDetail_listOutput =
	QuickBooksModelSchemas['reporttoplevel'];
const customerBalanceDetail_listDef = {
	input: customerBalanceDetail_listInput,
	output: customerBalanceDetail_listOutput,
	request: (input: z.output<typeof customerBalanceDetail_listInput>) => ({
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

const customerIncome_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['customerincomequery'].partial().optional(),
	})
	.strict();
const customerIncome_listOutput = QuickBooksModelSchemas['reporttoplevel'];
const customerIncome_listDef = {
	input: customerIncome_listInput,
	output: customerIncome_listOutput,
	request: (input: z.output<typeof customerIncome_listInput>) => ({
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

const customerType_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const customerType_listOutput = z
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
	.strict();
const customerType_listDef = {
	input: customerType_listInput,
	output: customerType_listOutput,
	request: (input: z.output<typeof customerType_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM CustomerType${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const customerType_listEndpoint = defineEndpoint(customerType_listDef);

const customerType_getInput = z
	.object({ realmId: RealmIdSchema, id: IdSchema })
	.strict();
const customerType_getOutput = z
	.object({
		CustomerType: QuickBooksModelSchemas['customertyperesponse'],
		time: z.string(),
	})
	.strict();
const customerType_getDef = {
	input: customerType_getInput,
	output: customerType_getOutput,
	request: (input: z.output<typeof customerType_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/customertype/${encodeURIComponent(input.id)}`,
		method: 'GET',
	}),
} as const;
const customerType_getEndpoint = defineEndpoint(customerType_getDef);

const department_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['departmentrequest'],
	})
	.strict();
const department_createOutput = z
	.object({
		Department: QuickBooksModelSchemas['departmentresponse'],
		time: z.string(),
	})
	.strict();
const department_createDef = {
	input: department_createInput,
	output: department_createOutput,
	request: (input: z.output<typeof department_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/department`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const department_createEndpoint = defineEndpoint(department_createDef);

const department_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const department_listOutput = z
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
	.strict();
const department_listDef = {
	input: department_listInput,
	output: department_listOutput,
	request: (input: z.output<typeof department_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Department${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const department_listEndpoint = defineEndpoint(department_listDef);

const department_getInput = z
	.object({ realmId: RealmIdSchema, departmentId: IdSchema })
	.strict();
const department_getOutput = z
	.object({
		Department: QuickBooksModelSchemas['departmentresponse'],
		time: z.string(),
	})
	.strict();
const department_getDef = {
	input: department_getInput,
	output: department_getOutput,
	request: (input: z.output<typeof department_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/department/${encodeURIComponent(input.departmentId)}`,
		method: 'GET',
	}),
} as const;
const department_getEndpoint = defineEndpoint(department_getDef);

const department_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['departmentresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const department_updateOutput = z
	.object({
		Department: QuickBooksModelSchemas['departmentresponse'],
		time: z.string(),
	})
	.strict();
const department_updateDef = {
	input: department_updateInput,
	output: department_updateOutput,
	request: (input: z.output<typeof department_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/department`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const department_updateEndpoint = defineEndpoint(department_updateDef);

const deposit_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['depositrequest'],
	})
	.strict();
const deposit_createOutput = z
	.object({
		Deposit: QuickBooksModelSchemas['depositresponse'],
		time: z.string(),
	})
	.strict();
const deposit_createDef = {
	input: deposit_createInput,
	output: deposit_createOutput,
	request: (input: z.output<typeof deposit_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/deposit`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const deposit_createEndpoint = defineEndpoint(deposit_createDef);

const deposit_deleteInput = z
	.object({ realmId: RealmIdSchema, body: DeleteBodySchema })
	.strict();
const deposit_deleteOutput = z
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
	.strict();
const deposit_deleteDef = {
	input: deposit_deleteInput,
	output: deposit_deleteOutput,
	request: (input: z.output<typeof deposit_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/deposit`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const deposit_deleteEndpoint = defineEndpoint(deposit_deleteDef);

const deposit_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const deposit_listOutput = z
	.object({
		QueryResponse: z
			.object({
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
				Deposit: z.array(QuickBooksModelSchemas['depositresponse']).optional(),
			})
			.strict(),
		time: z.string(),
	})
	.strict();
const deposit_listDef = {
	input: deposit_listInput,
	output: deposit_listOutput,
	request: (input: z.output<typeof deposit_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Deposit${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const deposit_listEndpoint = defineEndpoint(deposit_listDef);

const deposit_getInput = z
	.object({ realmId: RealmIdSchema, depositId: IdSchema })
	.strict();
const deposit_getOutput = z
	.object({
		Deposit: QuickBooksModelSchemas['depositresponse'],
		time: z.string(),
	})
	.strict();
const deposit_getDef = {
	input: deposit_getInput,
	output: deposit_getOutput,
	request: (input: z.output<typeof deposit_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/deposit/${encodeURIComponent(input.depositId)}`,
		method: 'GET',
	}),
} as const;
const deposit_getEndpoint = defineEndpoint(deposit_getDef);

const deposit_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['depositresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const deposit_updateOutput = z
	.object({
		Deposit: QuickBooksModelSchemas['depositresponse'],
		time: z.string(),
	})
	.strict();
const deposit_updateDef = {
	input: deposit_updateInput,
	output: deposit_updateOutput,
	request: (input: z.output<typeof deposit_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/deposit`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const deposit_updateEndpoint = defineEndpoint(deposit_updateDef);

const deposit_sparseUpdateInput = z
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
	.strict();
const deposit_sparseUpdateOutput = z
	.object({
		Deposit: QuickBooksModelSchemas['depositresponse'],
		time: z.string(),
	})
	.strict();
const deposit_sparseUpdateDef = {
	input: deposit_sparseUpdateInput,
	output: deposit_sparseUpdateOutput,
	request: (input: z.output<typeof deposit_sparseUpdateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/deposit`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const deposit_sparseUpdateEndpoint = defineEndpoint(deposit_sparseUpdateDef);

const employee_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['employeerequest'],
	})
	.strict();
const employee_createOutput = z
	.object({
		Employee: QuickBooksModelSchemas['employeeresponse'],
		time: z.string(),
	})
	.strict();
const employee_createDef = {
	input: employee_createInput,
	output: employee_createOutput,
	request: (input: z.output<typeof employee_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/employee`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const employee_createEndpoint = defineEndpoint(employee_createDef);

const employee_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const employee_listOutput = z
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
	.strict();
const employee_listDef = {
	input: employee_listInput,
	output: employee_listOutput,
	request: (input: z.output<typeof employee_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Employee${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const employee_listEndpoint = defineEndpoint(employee_listDef);

const employee_getInput = z
	.object({ realmId: RealmIdSchema, employeeId: IdSchema })
	.strict();
const employee_getOutput = z
	.object({
		Employee: QuickBooksModelSchemas['employeeresponse'],
		time: z.string(),
	})
	.strict();
const employee_getDef = {
	input: employee_getInput,
	output: employee_getOutput,
	request: (input: z.output<typeof employee_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/employee/${encodeURIComponent(input.employeeId)}`,
		method: 'GET',
	}),
} as const;
const employee_getEndpoint = defineEndpoint(employee_getDef);

const employee_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['employeeresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const employee_updateOutput = z
	.object({
		Employee: QuickBooksModelSchemas['employeeresponse'],
		time: z.string(),
	})
	.strict();
const employee_updateDef = {
	input: employee_updateInput,
	output: employee_updateOutput,
	request: (input: z.output<typeof employee_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/employee`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const employee_updateEndpoint = defineEndpoint(employee_updateDef);

const estimate_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['estimaterequest'],
	})
	.strict();
const estimate_createOutput = z
	.object({
		Estimate: QuickBooksModelSchemas['estimateresponse'],
		time: z.string(),
	})
	.strict();
const estimate_createDef = {
	input: estimate_createInput,
	output: estimate_createOutput,
	request: (input: z.output<typeof estimate_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/estimate`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const estimate_createEndpoint = defineEndpoint(estimate_createDef);

const estimate_deleteInput = z
	.object({ realmId: RealmIdSchema, body: DeleteBodySchema })
	.strict();
const estimate_deleteOutput = z
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
	.strict();
const estimate_deleteDef = {
	input: estimate_deleteInput,
	output: estimate_deleteOutput,
	request: (input: z.output<typeof estimate_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/estimate`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const estimate_deleteEndpoint = defineEndpoint(estimate_deleteDef);

const estimate_getPdfInput = z
	.object({ realmId: RealmIdSchema, estimateId: IdSchema })
	.strict();
const estimate_getPdfOutput = BinarySchema;
const estimate_getPdfDef = {
	input: estimate_getPdfInput,
	output: estimate_getPdfOutput,
	kind: 'binary',
	request: (input: z.output<typeof estimate_getPdfInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/estimate/${encodeURIComponent(input.estimateId)}/pdf`,
		method: 'GET',
		headers: { Accept: 'application/pdf' },
	}),
} as const;
const estimate_getPdfEndpoint = defineEndpoint(estimate_getPdfDef);

const estimate_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const estimate_listOutput = z
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
	.strict();
const estimate_listDef = {
	input: estimate_listInput,
	output: estimate_listOutput,
	request: (input: z.output<typeof estimate_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Estimate${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const estimate_listEndpoint = defineEndpoint(estimate_listDef);

const estimate_getInput = z
	.object({ realmId: RealmIdSchema, estimateId: IdSchema })
	.strict();
const estimate_getOutput = z
	.object({
		Estimate: QuickBooksModelSchemas['estimateresponse'],
		time: z.string(),
	})
	.strict();
const estimate_getDef = {
	input: estimate_getInput,
	output: estimate_getOutput,
	request: (input: z.output<typeof estimate_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/estimate/${encodeURIComponent(input.estimateId)}`,
		method: 'GET',
	}),
} as const;
const estimate_getEndpoint = defineEndpoint(estimate_getDef);

const estimate_sendInput = z
	.object({
		realmId: RealmIdSchema,
		estimateId: IdSchema,
		sendTo: z.string().email().optional(),
	})
	.strict();
const estimate_sendOutput = z
	.object({
		Estimate: QuickBooksModelSchemas['estimateresponse'],
		time: z.string(),
	})
	.strict();
const estimate_sendDef = {
	input: estimate_sendInput,
	output: estimate_sendOutput,
	request: (input: z.output<typeof estimate_sendInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/estimate/${encodeURIComponent(input.estimateId)}/send`,
		method: 'POST',
		query: { sendTo: input.sendTo },
		headers: { Accept: 'application/json' },
	}),
} as const;
const estimate_sendEndpoint = defineEndpoint(estimate_sendDef);

const estimate_sparseUpdateInput = z
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
	.strict();
const estimate_sparseUpdateOutput = z
	.object({
		Estimate: QuickBooksModelSchemas['estimateresponse'],
		time: z.string(),
	})
	.strict();
const estimate_sparseUpdateDef = {
	input: estimate_sparseUpdateInput,
	output: estimate_sparseUpdateOutput,
	request: (input: z.output<typeof estimate_sparseUpdateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/estimate`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const estimate_sparseUpdateEndpoint = defineEndpoint(estimate_sparseUpdateDef);

const estimate_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['estimateresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const estimate_updateOutput = z
	.object({
		Estimate: QuickBooksModelSchemas['estimateresponse'],
		time: z.string(),
	})
	.strict();
const estimate_updateDef = {
	input: estimate_updateInput,
	output: estimate_updateOutput,
	request: (input: z.output<typeof estimate_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/estimate`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const estimate_updateEndpoint = defineEndpoint(estimate_updateDef);

const exchangerate_getInput = z
	.object({
		realmId: RealmIdSchema,
		currencyCode: z.string().regex(/^[A-Z]{3}$/),
		asOfDate: z.string().date().optional(),
	})
	.strict();
const exchangerate_getOutput = z
	.object({
		QueryResponse: z
			.object({
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
				Exchangerate: z
					.array(QuickBooksModelSchemas['exchangerateresponse'])
					.optional(),
			})
			.strict(),
		time: z.string(),
	})
	.strict();
const exchangerate_getDef = {
	input: exchangerate_getInput,
	output: exchangerate_getOutput,
	request: (input: z.output<typeof exchangerate_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/exchangerate`,
		method: 'GET',
		query: { sourcecurrencycode: input.currencyCode, asofdate: input.asOfDate },
	}),
} as const;
const exchangerate_getEndpoint = defineEndpoint(exchangerate_getDef);

const exchangerate_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const exchangerate_listOutput = z
	.object({
		QueryResponse: z
			.object({
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
				Exchangerate: z
					.array(QuickBooksModelSchemas['exchangerateresponse'])
					.optional(),
			})
			.strict(),
		time: z.string(),
	})
	.strict();
const exchangerate_listDef = {
	input: exchangerate_listInput,
	output: exchangerate_listOutput,
	request: (input: z.output<typeof exchangerate_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Exchangerate${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const exchangerate_listEndpoint = defineEndpoint(exchangerate_listDef);

const exchangerate_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['exchangerateresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const exchangerate_updateOutput = z
	.object({
		Exchangerate: QuickBooksModelSchemas['exchangerateresponse'],
		time: z.string(),
	})
	.strict();
const exchangerate_updateDef = {
	input: exchangerate_updateInput,
	output: exchangerate_updateOutput,
	request: (input: z.output<typeof exchangerate_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/exchangerate`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const exchangerate_updateEndpoint = defineEndpoint(exchangerate_updateDef);

const generalLedger_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['generalledgerquery'].partial().optional(),
	})
	.strict();
const generalLedger_listOutput = QuickBooksModelSchemas['reporttoplevel'];
const generalLedger_listDef = {
	input: generalLedger_listInput,
	output: generalLedger_listOutput,
	request: (input: z.output<typeof generalLedger_listInput>) => ({
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

const inventoryAdjustment_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['inventoryadjustmentcreaterequest'],
	})
	.strict();
const inventoryAdjustment_createOutput = z
	.object({
		InventoryAdjustment: QuickBooksModelSchemas['inventoryadjustmentresponse'],
		time: z.string(),
	})
	.strict();
const inventoryAdjustment_createDef = {
	input: inventoryAdjustment_createInput,
	output: inventoryAdjustment_createOutput,
	request: (input: z.output<typeof inventoryAdjustment_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/inventoryadjustment`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const inventoryAdjustment_createEndpoint = defineEndpoint(
	inventoryAdjustment_createDef,
);

const inventoryAdjustment_deleteInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['inventoryadjustmentdeleterequest']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const inventoryAdjustment_deleteOutput = z
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
	.strict();
const inventoryAdjustment_deleteDef = {
	input: inventoryAdjustment_deleteInput,
	output: inventoryAdjustment_deleteOutput,
	request: (input: z.output<typeof inventoryAdjustment_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/inventoryadjustment`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const inventoryAdjustment_deleteEndpoint = defineEndpoint(
	inventoryAdjustment_deleteDef,
);

const inventoryAdjustment_getInput = z
	.object({ realmId: RealmIdSchema, inventoryadjustmentId: IdSchema })
	.strict();
const inventoryAdjustment_getOutput = z
	.object({
		InventoryAdjustment: QuickBooksModelSchemas['inventoryadjustmentresponse'],
		time: z.string(),
	})
	.strict();
const inventoryAdjustment_getDef = {
	input: inventoryAdjustment_getInput,
	output: inventoryAdjustment_getOutput,
	request: (input: z.output<typeof inventoryAdjustment_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/inventoryadjustment/${encodeURIComponent(input.inventoryadjustmentId)}`,
		method: 'GET',
	}),
} as const;
const inventoryAdjustment_getEndpoint = defineEndpoint(
	inventoryAdjustment_getDef,
);

const inventoryAdjustment_sparseUpdateInput = z
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
	.strict();
const inventoryAdjustment_sparseUpdateOutput = z
	.object({
		InventoryAdjustment: QuickBooksModelSchemas['inventoryadjustmentresponse'],
		time: z.string(),
	})
	.strict();
const inventoryAdjustment_sparseUpdateDef = {
	input: inventoryAdjustment_sparseUpdateInput,
	output: inventoryAdjustment_sparseUpdateOutput,
	request: (input: z.output<typeof inventoryAdjustment_sparseUpdateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/inventoryadjustment`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const inventoryAdjustment_sparseUpdateEndpoint = defineEndpoint(
	inventoryAdjustment_sparseUpdateDef,
);

const inventoryValuationDetail_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['inventoryvaluationdetailquery']
			.partial()
			.optional(),
	})
	.strict();
const inventoryValuationDetail_listOutput =
	QuickBooksModelSchemas['reporttoplevel'];
const inventoryValuationDetail_listDef = {
	input: inventoryValuationDetail_listInput,
	output: inventoryValuationDetail_listOutput,
	request: (input: z.output<typeof inventoryValuationDetail_listInput>) => ({
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

const inventoryValuationSummary_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['inventoryvaluationquery']
			.partial()
			.optional(),
	})
	.strict();
const inventoryValuationSummary_listOutput =
	QuickBooksModelSchemas['reporttoplevel'];
const inventoryValuationSummary_listDef = {
	input: inventoryValuationSummary_listInput,
	output: inventoryValuationSummary_listOutput,
	request: (input: z.output<typeof inventoryValuationSummary_listInput>) => ({
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

const invoice_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['invoicerequest'],
	})
	.strict();
const invoice_createOutput = z
	.object({
		Invoice: QuickBooksModelSchemas['invoiceresponse'],
		time: z.string(),
	})
	.strict();
const invoice_createDef = {
	input: invoice_createInput,
	output: invoice_createOutput,
	request: (input: z.output<typeof invoice_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/invoice`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const invoice_createEndpoint = defineEndpoint(invoice_createDef);

const invoice_deleteInput = z
	.object({ realmId: RealmIdSchema, body: DeleteBodySchema })
	.strict();
const invoice_deleteOutput = z
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
	.strict();
const invoice_deleteDef = {
	input: invoice_deleteInput,
	output: invoice_deleteOutput,
	request: (input: z.output<typeof invoice_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/invoice`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const invoice_deleteEndpoint = defineEndpoint(invoice_deleteDef);

const invoice_voidInput = z
	.object({ realmId: RealmIdSchema, body: VoidBodySchema })
	.strict();
const invoice_voidOutput = z
	.object({
		Invoice: QuickBooksModelSchemas['invoiceresponse'],
		time: z.string(),
	})
	.strict();
const invoice_voidDef = {
	input: invoice_voidInput,
	output: invoice_voidOutput,
	request: (input: z.output<typeof invoice_voidInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/invoice`,
		method: 'POST',
		query: { operation: 'void' },
		body: input.body,
	}),
} as const;
const invoice_voidEndpoint = defineEndpoint(invoice_voidDef);

const invoice_getPdfInput = z
	.object({ realmId: RealmIdSchema, invoiceId: IdSchema })
	.strict();
const invoice_getPdfOutput = BinarySchema;
const invoice_getPdfDef = {
	input: invoice_getPdfInput,
	output: invoice_getPdfOutput,
	kind: 'binary',
	request: (input: z.output<typeof invoice_getPdfInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/invoice/${encodeURIComponent(input.invoiceId)}/pdf`,
		method: 'GET',
		headers: { Accept: 'application/pdf' },
	}),
} as const;
const invoice_getPdfEndpoint = defineEndpoint(invoice_getPdfDef);

const invoice_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const invoice_listOutput = z
	.object({
		QueryResponse: z
			.object({
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
				Invoice: z.array(QuickBooksModelSchemas['invoiceresponse']).optional(),
			})
			.strict(),
		time: z.string(),
	})
	.strict();
const invoice_listDef = {
	input: invoice_listInput,
	output: invoice_listOutput,
	request: (input: z.output<typeof invoice_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Invoice${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const invoice_listEndpoint = defineEndpoint(invoice_listDef);

const invoice_getInput = z
	.object({ realmId: RealmIdSchema, invoiceId: IdSchema })
	.strict();
const invoice_getOutput = z
	.object({
		Invoice: QuickBooksModelSchemas['invoiceresponse'],
		time: z.string(),
	})
	.strict();
const invoice_getDef = {
	input: invoice_getInput,
	output: invoice_getOutput,
	request: (input: z.output<typeof invoice_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/invoice/${encodeURIComponent(input.invoiceId)}`,
		method: 'GET',
	}),
} as const;
const invoice_getEndpoint = defineEndpoint(invoice_getDef);

const invoice_sendInput = z
	.object({
		realmId: RealmIdSchema,
		invoiceId: IdSchema,
		sendTo: z.string().email().optional(),
	})
	.strict();
const invoice_sendOutput = z
	.object({
		Invoice: QuickBooksModelSchemas['invoiceresponse'],
		time: z.string(),
	})
	.strict();
const invoice_sendDef = {
	input: invoice_sendInput,
	output: invoice_sendOutput,
	request: (input: z.output<typeof invoice_sendInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/invoice/${encodeURIComponent(input.invoiceId)}/send`,
		method: 'POST',
		query: { sendTo: input.sendTo },
		headers: { Accept: 'application/json' },
	}),
} as const;
const invoice_sendEndpoint = defineEndpoint(invoice_sendDef);

const invoice_sparseUpdateInput = z
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
	.strict();
const invoice_sparseUpdateOutput = z
	.object({
		Invoice: QuickBooksModelSchemas['invoiceresponse'],
		time: z.string(),
	})
	.strict();
const invoice_sparseUpdateDef = {
	input: invoice_sparseUpdateInput,
	output: invoice_sparseUpdateOutput,
	request: (input: z.output<typeof invoice_sparseUpdateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/invoice`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const invoice_sparseUpdateEndpoint = defineEndpoint(invoice_sparseUpdateDef);

const invoice_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['invoicerequest']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const invoice_updateOutput = z
	.object({
		Invoice: QuickBooksModelSchemas['invoiceresponse'],
		time: z.string(),
	})
	.strict();
const invoice_updateDef = {
	input: invoice_updateInput,
	output: invoice_updateOutput,
	request: (input: z.output<typeof invoice_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/invoice`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const invoice_updateEndpoint = defineEndpoint(invoice_updateDef);

const item_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['itemrequest'],
	})
	.strict();
const item_createOutput = z
	.object({ Item: QuickBooksModelSchemas['itemresponse'], time: z.string() })
	.strict();
const item_createDef = {
	input: item_createInput,
	output: item_createOutput,
	request: (input: z.output<typeof item_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/item`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const item_createEndpoint = defineEndpoint(item_createDef);

const item_createCategoryInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['categoryrequest'],
	})
	.strict();
const item_createCategoryOutput = z
	.object({
		Item: QuickBooksModelSchemas['categoryresponse'],
		time: z.string(),
	})
	.strict();
const item_createCategoryDef = {
	input: item_createCategoryInput,
	output: item_createCategoryOutput,
	request: (input: z.output<typeof item_createCategoryInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/item`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const item_createCategoryEndpoint = defineEndpoint(item_createCategoryDef);

const item_listBundlesInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const item_listBundlesOutput = z
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
	.strict();
const item_listBundlesDef = {
	input: item_listBundlesInput,
	output: item_listBundlesOutput,
	request: (input: z.output<typeof item_listBundlesInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Item WHERE Type = 'Group'${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const item_listBundlesEndpoint = defineEndpoint(item_listBundlesDef);

const item_listCategoriesInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const item_listCategoriesOutput = z
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
	.strict();
const item_listCategoriesDef = {
	input: item_listCategoriesInput,
	output: item_listCategoriesOutput,
	request: (input: z.output<typeof item_listCategoriesInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Item WHERE Type = 'Category'${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const item_listCategoriesEndpoint = defineEndpoint(item_listCategoriesDef);

const item_listItemsInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const item_listItemsOutput = z
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
	.strict();
const item_listItemsDef = {
	input: item_listItemsInput,
	output: item_listItemsOutput,
	request: (input: z.output<typeof item_listItemsInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Item WHERE Type IN ('Inventory', 'NonInventory', 'Service')${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const item_listItemsEndpoint = defineEndpoint(item_listItemsDef);

const item_getBundleInput = z
	.object({ realmId: RealmIdSchema, itemId: IdSchema })
	.strict();
const item_getBundleOutput = z
	.object({ Item: QuickBooksModelSchemas['bundleresponse'], time: z.string() })
	.strict();
const item_getBundleDef = {
	input: item_getBundleInput,
	output: item_getBundleOutput,
	request: (input: z.output<typeof item_getBundleInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/item/${encodeURIComponent(input.itemId)}`,
		method: 'GET',
	}),
} as const;
const item_getBundleEndpoint = defineEndpoint(item_getBundleDef);

const item_getCategoryInput = z
	.object({ realmId: RealmIdSchema, itemId: IdSchema })
	.strict();
const item_getCategoryOutput = z
	.object({
		Item: QuickBooksModelSchemas['categoryresponse'],
		time: z.string(),
	})
	.strict();
const item_getCategoryDef = {
	input: item_getCategoryInput,
	output: item_getCategoryOutput,
	request: (input: z.output<typeof item_getCategoryInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/item/${encodeURIComponent(input.itemId)}`,
		method: 'GET',
	}),
} as const;
const item_getCategoryEndpoint = defineEndpoint(item_getCategoryDef);

const item_getItemInput = z
	.object({ realmId: RealmIdSchema, itemId: IdSchema })
	.strict();
const item_getItemOutput = z
	.object({ Item: QuickBooksModelSchemas['itemresponse'], time: z.string() })
	.strict();
const item_getItemDef = {
	input: item_getItemInput,
	output: item_getItemOutput,
	request: (input: z.output<typeof item_getItemInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/item/${encodeURIComponent(input.itemId)}`,
		method: 'GET',
	}),
} as const;
const item_getItemEndpoint = defineEndpoint(item_getItemDef);

const item_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['itemresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const item_updateOutput = z
	.object({ Item: QuickBooksModelSchemas['itemresponse'], time: z.string() })
	.strict();
const item_updateDef = {
	input: item_updateInput,
	output: item_updateOutput,
	request: (input: z.output<typeof item_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/item`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const item_updateEndpoint = defineEndpoint(item_updateDef);

const item_updateCategoryInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['categoryupdaterequest']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const item_updateCategoryOutput = z
	.object({
		Item: QuickBooksModelSchemas['categoryresponse'],
		time: z.string(),
	})
	.strict();
const item_updateCategoryDef = {
	input: item_updateCategoryInput,
	output: item_updateCategoryOutput,
	request: (input: z.output<typeof item_updateCategoryInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/item`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const item_updateCategoryEndpoint = defineEndpoint(item_updateCategoryDef);

const journalEntry_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['journalentryrequest'],
	})
	.strict();
const journalEntry_createOutput = z
	.object({
		JournalEntry: QuickBooksModelSchemas['journalentryresponse'],
		time: z.string(),
	})
	.strict();
const journalEntry_createDef = {
	input: journalEntry_createInput,
	output: journalEntry_createOutput,
	request: (input: z.output<typeof journalEntry_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/journalentry`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const journalEntry_createEndpoint = defineEndpoint(journalEntry_createDef);

const journalEntry_deleteInput = z
	.object({ realmId: RealmIdSchema, body: DeleteBodySchema })
	.strict();
const journalEntry_deleteOutput = z
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
	.strict();
const journalEntry_deleteDef = {
	input: journalEntry_deleteInput,
	output: journalEntry_deleteOutput,
	request: (input: z.output<typeof journalEntry_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/journalentry`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const journalEntry_deleteEndpoint = defineEndpoint(journalEntry_deleteDef);

const journalEntry_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const journalEntry_listOutput = z
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
	.strict();
const journalEntry_listDef = {
	input: journalEntry_listInput,
	output: journalEntry_listOutput,
	request: (input: z.output<typeof journalEntry_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM JournalEntry${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const journalEntry_listEndpoint = defineEndpoint(journalEntry_listDef);

const journalEntry_getInput = z
	.object({ realmId: RealmIdSchema, journalentryId: IdSchema })
	.strict();
const journalEntry_getOutput = z
	.object({
		JournalEntry: QuickBooksModelSchemas['journalentryresponse'],
		time: z.string(),
	})
	.strict();
const journalEntry_getDef = {
	input: journalEntry_getInput,
	output: journalEntry_getOutput,
	request: (input: z.output<typeof journalEntry_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/journalentry/${encodeURIComponent(input.journalentryId)}`,
		method: 'GET',
	}),
} as const;
const journalEntry_getEndpoint = defineEndpoint(journalEntry_getDef);

const journalEntry_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['journalentryresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const journalEntry_updateOutput = z
	.object({
		JournalEntry: QuickBooksModelSchemas['journalentryresponse'],
		time: z.string(),
	})
	.strict();
const journalEntry_updateDef = {
	input: journalEntry_updateInput,
	output: journalEntry_updateOutput,
	request: (input: z.output<typeof journalEntry_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/journalentry`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const journalEntry_updateEndpoint = defineEndpoint(journalEntry_updateDef);

const journalEntry_sparseUpdateInput = z
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
	.strict();
const journalEntry_sparseUpdateOutput = z
	.object({
		JournalEntry: QuickBooksModelSchemas['journalentryresponse'],
		time: z.string(),
	})
	.strict();
const journalEntry_sparseUpdateDef = {
	input: journalEntry_sparseUpdateInput,
	output: journalEntry_sparseUpdateOutput,
	request: (input: z.output<typeof journalEntry_sparseUpdateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/journalentry`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const journalEntry_sparseUpdateEndpoint = defineEndpoint(
	journalEntry_sparseUpdateDef,
);

const journalReport_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['journalreportqueryus'].partial().optional(),
	})
	.strict();
const journalReport_listOutput = QuickBooksModelSchemas['reporttoplevel'];
const journalReport_listDef = {
	input: journalReport_listInput,
	output: journalReport_listOutput,
	request: (input: z.output<typeof journalReport_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reports/JournalReport`,
		method: 'GET',
		query: {},
	}),
} as const;
const journalReport_listEndpoint = defineEndpoint(journalReport_listDef);

const payment_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['paymentrequest'],
	})
	.strict();
const payment_createOutput = z
	.object({
		Payment: QuickBooksModelSchemas['paymentresponse'],
		time: z.string(),
	})
	.strict();
const payment_createDef = {
	input: payment_createInput,
	output: payment_createOutput,
	request: (input: z.output<typeof payment_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/payment`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const payment_createEndpoint = defineEndpoint(payment_createDef);

const payment_deleteInput = z
	.object({ realmId: RealmIdSchema, body: DeleteBodySchema })
	.strict();
const payment_deleteOutput = z
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
	.strict();
const payment_deleteDef = {
	input: payment_deleteInput,
	output: payment_deleteOutput,
	request: (input: z.output<typeof payment_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/payment`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const payment_deleteEndpoint = defineEndpoint(payment_deleteDef);

const payment_voidInput = z
	.object({ realmId: RealmIdSchema, body: VoidBodySchema })
	.strict();
const payment_voidOutput = z
	.object({
		Payment: QuickBooksModelSchemas['paymentresponse'],
		time: z.string(),
	})
	.strict();
const payment_voidDef = {
	input: payment_voidInput,
	output: payment_voidOutput,
	request: (input: z.output<typeof payment_voidInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/payment`,
		method: 'POST',
		query: { operation: 'update', include: 'void' },
		body: input.body,
	}),
} as const;
const payment_voidEndpoint = defineEndpoint(payment_voidDef);

const payment_getPdfInput = z
	.object({ realmId: RealmIdSchema, paymentId: IdSchema })
	.strict();
const payment_getPdfOutput = BinarySchema;
const payment_getPdfDef = {
	input: payment_getPdfInput,
	output: payment_getPdfOutput,
	kind: 'binary',
	request: (input: z.output<typeof payment_getPdfInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/payment/${encodeURIComponent(input.paymentId)}/pdf`,
		method: 'GET',
		headers: { Accept: 'application/pdf' },
	}),
} as const;
const payment_getPdfEndpoint = defineEndpoint(payment_getPdfDef);

const payment_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const payment_listOutput = z
	.object({
		QueryResponse: z
			.object({
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
				Payment: z.array(QuickBooksModelSchemas['paymentresponse']).optional(),
			})
			.strict(),
		time: z.string(),
	})
	.strict();
const payment_listDef = {
	input: payment_listInput,
	output: payment_listOutput,
	request: (input: z.output<typeof payment_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Payment${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const payment_listEndpoint = defineEndpoint(payment_listDef);

const payment_getInput = z
	.object({ realmId: RealmIdSchema, paymentId: IdSchema })
	.strict();
const payment_getOutput = z
	.object({
		Payment: QuickBooksModelSchemas['paymentresponse'],
		time: z.string(),
	})
	.strict();
const payment_getDef = {
	input: payment_getInput,
	output: payment_getOutput,
	request: (input: z.output<typeof payment_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/payment/${encodeURIComponent(input.paymentId)}`,
		method: 'GET',
	}),
} as const;
const payment_getEndpoint = defineEndpoint(payment_getDef);

const payment_sendInput = z
	.object({
		realmId: RealmIdSchema,
		paymentId: IdSchema,
		sendTo: z.string().email(),
	})
	.strict();
const payment_sendOutput = z
	.object({
		Payment: QuickBooksModelSchemas['paymentresponse'],
		time: z.string(),
	})
	.strict();
const payment_sendDef = {
	input: payment_sendInput,
	output: payment_sendOutput,
	request: (input: z.output<typeof payment_sendInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/payment/${encodeURIComponent(input.paymentId)}/send`,
		method: 'POST',
		query: { sendTo: input.sendTo },
		headers: { Accept: 'application/json' },
	}),
} as const;
const payment_sendEndpoint = defineEndpoint(payment_sendDef);

const payment_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['paymentresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const payment_updateOutput = z
	.object({
		Payment: QuickBooksModelSchemas['paymentresponse'],
		time: z.string(),
	})
	.strict();
const payment_updateDef = {
	input: payment_updateInput,
	output: payment_updateOutput,
	request: (input: z.output<typeof payment_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/payment`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const payment_updateEndpoint = defineEndpoint(payment_updateDef);

const paymentMethod_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['paymentmethodrequest'],
	})
	.strict();
const paymentMethod_createOutput = z
	.object({
		PaymentMethod: QuickBooksModelSchemas['paymentmethodresponse'],
		time: z.string(),
	})
	.strict();
const paymentMethod_createDef = {
	input: paymentMethod_createInput,
	output: paymentMethod_createOutput,
	request: (input: z.output<typeof paymentMethod_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/paymentmethod`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const paymentMethod_createEndpoint = defineEndpoint(paymentMethod_createDef);

const paymentMethod_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const paymentMethod_listOutput = z
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
	.strict();
const paymentMethod_listDef = {
	input: paymentMethod_listInput,
	output: paymentMethod_listOutput,
	request: (input: z.output<typeof paymentMethod_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM PaymentMethod${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const paymentMethod_listEndpoint = defineEndpoint(paymentMethod_listDef);

const paymentMethod_getInput = z
	.object({ realmId: RealmIdSchema, paymentmethodId: IdSchema })
	.strict();
const paymentMethod_getOutput = z
	.object({
		PaymentMethod: QuickBooksModelSchemas['paymentmethodresponse'],
		time: z.string(),
	})
	.strict();
const paymentMethod_getDef = {
	input: paymentMethod_getInput,
	output: paymentMethod_getOutput,
	request: (input: z.output<typeof paymentMethod_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/paymentmethod/${encodeURIComponent(input.paymentmethodId)}`,
		method: 'GET',
	}),
} as const;
const paymentMethod_getEndpoint = defineEndpoint(paymentMethod_getDef);

const paymentMethod_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['paymentmethodresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const paymentMethod_updateOutput = z
	.object({
		PaymentMethod: QuickBooksModelSchemas['paymentmethodresponse'],
		time: z.string(),
	})
	.strict();
const paymentMethod_updateDef = {
	input: paymentMethod_updateInput,
	output: paymentMethod_updateOutput,
	request: (input: z.output<typeof paymentMethod_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/paymentmethod`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const paymentMethod_updateEndpoint = defineEndpoint(paymentMethod_updateDef);

const preferences_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const preferences_listOutput = z
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
	.strict();
const preferences_listDef = {
	input: preferences_listInput,
	output: preferences_listOutput,
	request: (input: z.output<typeof preferences_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Preferences${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const preferences_listEndpoint = defineEndpoint(preferences_listDef);

const preferences_getInput = z.object({ realmId: RealmIdSchema }).strict();
const preferences_getOutput = z
	.object({
		Preferences: QuickBooksModelSchemas['preferencesresponse'],
		time: z.string(),
	})
	.strict();
const preferences_getDef = {
	input: preferences_getInput,
	output: preferences_getOutput,
	request: (input: z.output<typeof preferences_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/preferences`,
		method: 'GET',
	}),
} as const;
const preferences_getEndpoint = defineEndpoint(preferences_getDef);

const preferences_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['preferencesresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const preferences_updateOutput = z
	.object({
		Preferences: QuickBooksModelSchemas['preferencesresponse'],
		time: z.string(),
	})
	.strict();
const preferences_updateDef = {
	input: preferences_updateInput,
	output: preferences_updateOutput,
	request: (input: z.output<typeof preferences_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/preferences`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const preferences_updateEndpoint = defineEndpoint(preferences_updateDef);

const profitAndLoss_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['profitandlossquery'].partial().optional(),
	})
	.strict();
const profitAndLoss_listOutput =
	QuickBooksModelSchemas['profitandlossreporttoplevel'];
const profitAndLoss_listDef = {
	input: profitAndLoss_listInput,
	output: profitAndLoss_listOutput,
	request: (input: z.output<typeof profitAndLoss_listInput>) => ({
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

const profitAndLossDetail_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['profitandlossdetailquery']
			.partial()
			.optional(),
	})
	.strict();
const profitAndLossDetail_listOutput =
	QuickBooksModelSchemas['profitandlossdetailquery'];
const profitAndLossDetail_listDef = {
	input: profitAndLossDetail_listInput,
	output: profitAndLossDetail_listOutput,
	request: (input: z.output<typeof profitAndLossDetail_listInput>) => ({
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

const purchase_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['purchaserequest'],
	})
	.strict();
const purchase_createOutput = z
	.object({
		Purchase: QuickBooksModelSchemas['purchaseresponse'],
		time: z.string(),
	})
	.strict();
const purchase_createDef = {
	input: purchase_createInput,
	output: purchase_createOutput,
	request: (input: z.output<typeof purchase_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchase`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const purchase_createEndpoint = defineEndpoint(purchase_createDef);

const purchase_deleteInput = z
	.object({ realmId: RealmIdSchema, body: DeleteBodySchema })
	.strict();
const purchase_deleteOutput = z
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
	.strict();
const purchase_deleteDef = {
	input: purchase_deleteInput,
	output: purchase_deleteOutput,
	request: (input: z.output<typeof purchase_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchase`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const purchase_deleteEndpoint = defineEndpoint(purchase_deleteDef);

const purchase_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const purchase_listOutput = z
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
	.strict();
const purchase_listDef = {
	input: purchase_listInput,
	output: purchase_listOutput,
	request: (input: z.output<typeof purchase_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Purchase${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const purchase_listEndpoint = defineEndpoint(purchase_listDef);

const purchase_getInput = z
	.object({ realmId: RealmIdSchema, purchaseId: IdSchema })
	.strict();
const purchase_getOutput = z
	.object({
		Purchase: QuickBooksModelSchemas['purchaseresponse'],
		time: z.string(),
	})
	.strict();
const purchase_getDef = {
	input: purchase_getInput,
	output: purchase_getOutput,
	request: (input: z.output<typeof purchase_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchase/${encodeURIComponent(input.purchaseId)}`,
		method: 'GET',
	}),
} as const;
const purchase_getEndpoint = defineEndpoint(purchase_getDef);

const purchase_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['purchaseresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const purchase_updateOutput = z
	.object({
		Purchase: QuickBooksModelSchemas['purchaseresponse'],
		time: z.string(),
	})
	.strict();
const purchase_updateDef = {
	input: purchase_updateInput,
	output: purchase_updateOutput,
	request: (input: z.output<typeof purchase_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchase`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const purchase_updateEndpoint = defineEndpoint(purchase_updateDef);

const purchaseOrder_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['purchaseorderrequest'],
	})
	.strict();
const purchaseOrder_createOutput = z
	.object({
		PurchaseOrder: QuickBooksModelSchemas['purchaseorderresponse'],
		time: z.string(),
	})
	.strict();
const purchaseOrder_createDef = {
	input: purchaseOrder_createInput,
	output: purchaseOrder_createOutput,
	request: (input: z.output<typeof purchaseOrder_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchaseorder`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const purchaseOrder_createEndpoint = defineEndpoint(purchaseOrder_createDef);

const purchaseOrder_deleteInput = z
	.object({ realmId: RealmIdSchema, body: DeleteBodySchema })
	.strict();
const purchaseOrder_deleteOutput = z
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
	.strict();
const purchaseOrder_deleteDef = {
	input: purchaseOrder_deleteInput,
	output: purchaseOrder_deleteOutput,
	request: (input: z.output<typeof purchaseOrder_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchaseorder`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const purchaseOrder_deleteEndpoint = defineEndpoint(purchaseOrder_deleteDef);

const purchaseOrder_getPdfInput = z
	.object({ realmId: RealmIdSchema, purchaseorderId: IdSchema })
	.strict();
const purchaseOrder_getPdfOutput = BinarySchema;
const purchaseOrder_getPdfDef = {
	input: purchaseOrder_getPdfInput,
	output: purchaseOrder_getPdfOutput,
	kind: 'binary',
	request: (input: z.output<typeof purchaseOrder_getPdfInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchaseorder/${encodeURIComponent(input.purchaseorderId)}/pdf`,
		method: 'GET',
		headers: { Accept: 'application/pdf' },
	}),
} as const;
const purchaseOrder_getPdfEndpoint = defineEndpoint(purchaseOrder_getPdfDef);

const purchaseOrder_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const purchaseOrder_listOutput = z
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
	.strict();
const purchaseOrder_listDef = {
	input: purchaseOrder_listInput,
	output: purchaseOrder_listOutput,
	request: (input: z.output<typeof purchaseOrder_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM PurchaseOrder${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const purchaseOrder_listEndpoint = defineEndpoint(purchaseOrder_listDef);

const purchaseOrder_getInput = z
	.object({ realmId: RealmIdSchema, purchaseorderId: IdSchema })
	.strict();
const purchaseOrder_getOutput = z
	.object({
		PurchaseOrder: QuickBooksModelSchemas['purchaseorderresponse'],
		time: z.string(),
	})
	.strict();
const purchaseOrder_getDef = {
	input: purchaseOrder_getInput,
	output: purchaseOrder_getOutput,
	request: (input: z.output<typeof purchaseOrder_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchaseorder/${encodeURIComponent(input.purchaseorderId)}`,
		method: 'GET',
	}),
} as const;
const purchaseOrder_getEndpoint = defineEndpoint(purchaseOrder_getDef);

const purchaseOrder_sendInput = z
	.object({
		realmId: RealmIdSchema,
		purchaseorderId: IdSchema,
		sendTo: z.string().email().optional(),
	})
	.strict();
const purchaseOrder_sendOutput = z
	.object({
		PurchaseOrder: QuickBooksModelSchemas['purchaseorderresponse'],
		time: z.string(),
	})
	.strict();
const purchaseOrder_sendDef = {
	input: purchaseOrder_sendInput,
	output: purchaseOrder_sendOutput,
	request: (input: z.output<typeof purchaseOrder_sendInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchaseorder/${encodeURIComponent(input.purchaseorderId)}/send`,
		method: 'POST',
		query: { sendTo: input.sendTo },
		headers: { Accept: 'application/json' },
	}),
} as const;
const purchaseOrder_sendEndpoint = defineEndpoint(purchaseOrder_sendDef);

const purchaseOrder_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['purchaseorderresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const purchaseOrder_updateOutput = z
	.object({
		PurchaseOrder: QuickBooksModelSchemas['purchaseorderresponse'],
		time: z.string(),
	})
	.strict();
const purchaseOrder_updateDef = {
	input: purchaseOrder_updateInput,
	output: purchaseOrder_updateOutput,
	request: (input: z.output<typeof purchaseOrder_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/purchaseorder`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const purchaseOrder_updateEndpoint = defineEndpoint(purchaseOrder_updateDef);

const recurringTransaction_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['recurringtransactionrequest'],
	})
	.strict();
const recurringTransaction_createOutput = z
	.object({
		RecurringTransaction:
			QuickBooksModelSchemas['recurringtransactionresponse'],
		time: z.string(),
	})
	.strict();
const recurringTransaction_createDef = {
	input: recurringTransaction_createInput,
	output: recurringTransaction_createOutput,
	request: (input: z.output<typeof recurringTransaction_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/recurringtransaction`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const recurringTransaction_createEndpoint = defineEndpoint(
	recurringTransaction_createDef,
);

const recurringTransaction_deleteInput = z
	.object({ realmId: RealmIdSchema, body: DeleteBodySchema })
	.strict();
const recurringTransaction_deleteOutput = z
	.object({
		RecurringTransaction: z
			.object({
				status: z.literal('Deleted'),
				Id: IdSchema,
				domain: z.literal('QBO').optional(),
			})
			.strict(),
		time: z.string().optional(),
	})
	.strict();
const recurringTransaction_deleteDef = {
	input: recurringTransaction_deleteInput,
	output: recurringTransaction_deleteOutput,
	request: (input: z.output<typeof recurringTransaction_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/recurringtransaction`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const recurringTransaction_deleteEndpoint = defineEndpoint(
	recurringTransaction_deleteDef,
);

const recurringTransaction_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const recurringTransaction_listOutput = z
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
	.strict();
const recurringTransaction_listDef = {
	input: recurringTransaction_listInput,
	output: recurringTransaction_listOutput,
	request: (input: z.output<typeof recurringTransaction_listInput>) => ({
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

const recurringTransaction_getInput = z
	.object({ realmId: RealmIdSchema, recurringtransactionId: IdSchema })
	.strict();
const recurringTransaction_getOutput = z
	.object({
		RecurringTransaction:
			QuickBooksModelSchemas['recurringtransactionresponse'],
		time: z.string(),
	})
	.strict();
const recurringTransaction_getDef = {
	input: recurringTransaction_getInput,
	output: recurringTransaction_getOutput,
	request: (input: z.output<typeof recurringTransaction_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/recurringtransaction/${encodeURIComponent(input.recurringtransactionId)}`,
		method: 'GET',
	}),
} as const;
const recurringTransaction_getEndpoint = defineEndpoint(
	recurringTransaction_getDef,
);

const refundReceipt_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['refundreceiptrequest'],
	})
	.strict();
const refundReceipt_createOutput = z
	.object({
		RefundReceipt: QuickBooksModelSchemas['refundreceiptresponse'],
		time: z.string(),
	})
	.strict();
const refundReceipt_createDef = {
	input: refundReceipt_createInput,
	output: refundReceipt_createOutput,
	request: (input: z.output<typeof refundReceipt_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/refundreceipt`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const refundReceipt_createEndpoint = defineEndpoint(refundReceipt_createDef);

const refundReceipt_deleteInput = z
	.object({ realmId: RealmIdSchema, body: DeleteBodySchema })
	.strict();
const refundReceipt_deleteOutput = z
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
	.strict();
const refundReceipt_deleteDef = {
	input: refundReceipt_deleteInput,
	output: refundReceipt_deleteOutput,
	request: (input: z.output<typeof refundReceipt_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/refundreceipt`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const refundReceipt_deleteEndpoint = defineEndpoint(refundReceipt_deleteDef);

const refundReceipt_getPdfInput = z
	.object({ realmId: RealmIdSchema, refundreceiptId: IdSchema })
	.strict();
const refundReceipt_getPdfOutput = BinarySchema;
const refundReceipt_getPdfDef = {
	input: refundReceipt_getPdfInput,
	output: refundReceipt_getPdfOutput,
	kind: 'binary',
	request: (input: z.output<typeof refundReceipt_getPdfInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/refundreceipt/${encodeURIComponent(input.refundreceiptId)}/pdf`,
		method: 'GET',
		headers: { Accept: 'application/pdf' },
	}),
} as const;
const refundReceipt_getPdfEndpoint = defineEndpoint(refundReceipt_getPdfDef);

const refundReceipt_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const refundReceipt_listOutput = z
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
	.strict();
const refundReceipt_listDef = {
	input: refundReceipt_listInput,
	output: refundReceipt_listOutput,
	request: (input: z.output<typeof refundReceipt_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM RefundReceipt${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const refundReceipt_listEndpoint = defineEndpoint(refundReceipt_listDef);

const refundReceipt_getInput = z
	.object({ realmId: RealmIdSchema, refundreceiptId: IdSchema })
	.strict();
const refundReceipt_getOutput = z
	.object({
		RefundReceipt: QuickBooksModelSchemas['refundreceiptresponse'],
		time: z.string(),
	})
	.strict();
const refundReceipt_getDef = {
	input: refundReceipt_getInput,
	output: refundReceipt_getOutput,
	request: (input: z.output<typeof refundReceipt_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/refundreceipt/${encodeURIComponent(input.refundreceiptId)}`,
		method: 'GET',
	}),
} as const;
const refundReceipt_getEndpoint = defineEndpoint(refundReceipt_getDef);

const refundReceipt_sendInput = z
	.object({
		realmId: RealmIdSchema,
		refundreceiptId: IdSchema,
		sendTo: z.string().email().optional(),
	})
	.strict();
const refundReceipt_sendOutput = z
	.object({
		RefundReceipt: QuickBooksModelSchemas['refundreceiptresponse'],
		time: z.string(),
	})
	.strict();
const refundReceipt_sendDef = {
	input: refundReceipt_sendInput,
	output: refundReceipt_sendOutput,
	request: (input: z.output<typeof refundReceipt_sendInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/refundreceipt/${encodeURIComponent(input.refundreceiptId)}/send`,
		method: 'POST',
		query: { sendTo: input.sendTo },
		headers: { Accept: 'application/json' },
	}),
} as const;
const refundReceipt_sendEndpoint = defineEndpoint(refundReceipt_sendDef);

const refundReceipt_sparseUpdateInput = z
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
	.strict();
const refundReceipt_sparseUpdateOutput = z
	.object({
		RefundReceipt: QuickBooksModelSchemas['refundreceiptresponse'],
		time: z.string(),
	})
	.strict();
const refundReceipt_sparseUpdateDef = {
	input: refundReceipt_sparseUpdateInput,
	output: refundReceipt_sparseUpdateOutput,
	request: (input: z.output<typeof refundReceipt_sparseUpdateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/refundreceipt`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const refundReceipt_sparseUpdateEndpoint = defineEndpoint(
	refundReceipt_sparseUpdateDef,
);

const refundReceipt_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['refundreceiptrequest']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const refundReceipt_updateOutput = z
	.object({
		RefundReceipt: QuickBooksModelSchemas['refundreceiptresponse'],
		time: z.string(),
	})
	.strict();
const refundReceipt_updateDef = {
	input: refundReceipt_updateInput,
	output: refundReceipt_updateOutput,
	request: (input: z.output<typeof refundReceipt_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/refundreceipt`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const refundReceipt_updateEndpoint = defineEndpoint(refundReceipt_updateDef);

const reimburseCharge_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const reimburseCharge_listOutput = z
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
	.strict();
const reimburseCharge_listDef = {
	input: reimburseCharge_listInput,
	output: reimburseCharge_listOutput,
	request: (input: z.output<typeof reimburseCharge_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM ReimburseCharge${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const reimburseCharge_listEndpoint = defineEndpoint(reimburseCharge_listDef);

const reimburseCharge_getInput = z
	.object({ realmId: RealmIdSchema, taxrateId: IdSchema })
	.strict();
const reimburseCharge_getOutput = z
	.object({
		ReimburseCharge: QuickBooksModelSchemas['reimbursechargeresponse'],
		time: z.string(),
	})
	.strict();
const reimburseCharge_getDef = {
	input: reimburseCharge_getInput,
	output: reimburseCharge_getOutput,
	request: (input: z.output<typeof reimburseCharge_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/reimbursecharge/${encodeURIComponent(input.taxrateId)}`,
		method: 'GET',
	}),
} as const;
const reimburseCharge_getEndpoint = defineEndpoint(reimburseCharge_getDef);

const salesByClassSummary_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['classsalesquery'].partial().optional(),
	})
	.strict();
const salesByClassSummary_listOutput = QuickBooksModelSchemas['reporttoplevel'];
const salesByClassSummary_listDef = {
	input: salesByClassSummary_listInput,
	output: salesByClassSummary_listOutput,
	request: (input: z.output<typeof salesByClassSummary_listInput>) => ({
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

const salesByCustomer_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['customersalesquery'].partial().optional(),
	})
	.strict();
const salesByCustomer_listOutput = QuickBooksModelSchemas['reporttoplevel'];
const salesByCustomer_listDef = {
	input: salesByCustomer_listInput,
	output: salesByCustomer_listOutput,
	request: (input: z.output<typeof salesByCustomer_listInput>) => ({
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

const salesByDepartment_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['departmentsalesquery'].partial().optional(),
	})
	.strict();
const salesByDepartment_listOutput = QuickBooksModelSchemas['reporttoplevel'];
const salesByDepartment_listDef = {
	input: salesByDepartment_listInput,
	output: salesByDepartment_listOutput,
	request: (input: z.output<typeof salesByDepartment_listInput>) => ({
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

const salesByProduct_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['itemsalesquery'].partial().optional(),
	})
	.strict();
const salesByProduct_listOutput = QuickBooksModelSchemas['reporttoplevel'];
const salesByProduct_listDef = {
	input: salesByProduct_listInput,
	output: salesByProduct_listOutput,
	request: (input: z.output<typeof salesByProduct_listInput>) => ({
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

const salesReceipt_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['salesreceiptrequest'],
	})
	.strict();
const salesReceipt_createOutput = z
	.object({
		SalesReceipt: QuickBooksModelSchemas['salesreceiptresponse'],
		time: z.string(),
	})
	.strict();
const salesReceipt_createDef = {
	input: salesReceipt_createInput,
	output: salesReceipt_createOutput,
	request: (input: z.output<typeof salesReceipt_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/salesreceipt`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const salesReceipt_createEndpoint = defineEndpoint(salesReceipt_createDef);

const salesReceipt_deleteInput = z
	.object({ realmId: RealmIdSchema, body: DeleteBodySchema })
	.strict();
const salesReceipt_deleteOutput = z
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
	.strict();
const salesReceipt_deleteDef = {
	input: salesReceipt_deleteInput,
	output: salesReceipt_deleteOutput,
	request: (input: z.output<typeof salesReceipt_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/salesreceipt`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const salesReceipt_deleteEndpoint = defineEndpoint(salesReceipt_deleteDef);

const salesReceipt_voidInput = z
	.object({ realmId: RealmIdSchema, body: VoidBodySchema })
	.strict();
const salesReceipt_voidOutput = z
	.object({
		SalesReceipt: QuickBooksModelSchemas['salesreceiptresponse'],
		time: z.string(),
	})
	.strict();
const salesReceipt_voidDef = {
	input: salesReceipt_voidInput,
	output: salesReceipt_voidOutput,
	request: (input: z.output<typeof salesReceipt_voidInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/salesreceipt`,
		method: 'POST',
		query: { operation: 'update', include: 'void' },
		body: input.body,
	}),
} as const;
const salesReceipt_voidEndpoint = defineEndpoint(salesReceipt_voidDef);

const salesReceipt_getPdfInput = z
	.object({ realmId: RealmIdSchema, salesreceiptId: IdSchema })
	.strict();
const salesReceipt_getPdfOutput = BinarySchema;
const salesReceipt_getPdfDef = {
	input: salesReceipt_getPdfInput,
	output: salesReceipt_getPdfOutput,
	kind: 'binary',
	request: (input: z.output<typeof salesReceipt_getPdfInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/salesreceipt/${encodeURIComponent(input.salesreceiptId)}/pdf`,
		method: 'GET',
		headers: { Accept: 'application/pdf' },
	}),
} as const;
const salesReceipt_getPdfEndpoint = defineEndpoint(salesReceipt_getPdfDef);

const salesReceipt_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const salesReceipt_listOutput = z
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
	.strict();
const salesReceipt_listDef = {
	input: salesReceipt_listInput,
	output: salesReceipt_listOutput,
	request: (input: z.output<typeof salesReceipt_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM SalesReceipt${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const salesReceipt_listEndpoint = defineEndpoint(salesReceipt_listDef);

const salesReceipt_getInput = z
	.object({ realmId: RealmIdSchema, salesreceiptId: IdSchema })
	.strict();
const salesReceipt_getOutput = z
	.object({
		SalesReceipt: QuickBooksModelSchemas['salesreceiptresponse'],
		time: z.string(),
	})
	.strict();
const salesReceipt_getDef = {
	input: salesReceipt_getInput,
	output: salesReceipt_getOutput,
	request: (input: z.output<typeof salesReceipt_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/salesreceipt/${encodeURIComponent(input.salesreceiptId)}`,
		method: 'GET',
	}),
} as const;
const salesReceipt_getEndpoint = defineEndpoint(salesReceipt_getDef);

const salesReceipt_sendInput = z
	.object({
		realmId: RealmIdSchema,
		salesreceiptId: IdSchema,
		sendTo: z.string().email().optional(),
	})
	.strict();
const salesReceipt_sendOutput = z
	.object({
		SalesReceipt: QuickBooksModelSchemas['salesreceiptresponse'],
		time: z.string(),
	})
	.strict();
const salesReceipt_sendDef = {
	input: salesReceipt_sendInput,
	output: salesReceipt_sendOutput,
	request: (input: z.output<typeof salesReceipt_sendInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/salesreceipt/${encodeURIComponent(input.salesreceiptId)}/send`,
		method: 'POST',
		query: { sendTo: input.sendTo },
		headers: { Accept: 'application/json' },
	}),
} as const;
const salesReceipt_sendEndpoint = defineEndpoint(salesReceipt_sendDef);

const salesReceipt_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['salesreceiptresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const salesReceipt_updateOutput = z
	.object({
		SalesReceipt: QuickBooksModelSchemas['salesreceiptresponse'],
		time: z.string(),
	})
	.strict();
const salesReceipt_updateDef = {
	input: salesReceipt_updateInput,
	output: salesReceipt_updateOutput,
	request: (input: z.output<typeof salesReceipt_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/salesreceipt`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const salesReceipt_updateEndpoint = defineEndpoint(salesReceipt_updateDef);

const salesReceipt_sparseUpdateInput = z
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
	.strict();
const salesReceipt_sparseUpdateOutput = z
	.object({
		SalesReceipt: QuickBooksModelSchemas['salesreceiptresponse'],
		time: z.string(),
	})
	.strict();
const salesReceipt_sparseUpdateDef = {
	input: salesReceipt_sparseUpdateInput,
	output: salesReceipt_sparseUpdateOutput,
	request: (input: z.output<typeof salesReceipt_sparseUpdateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/salesreceipt`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const salesReceipt_sparseUpdateEndpoint = defineEndpoint(
	salesReceipt_sparseUpdateDef,
);

const taxAgency_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['taxagencyrequest'],
	})
	.strict();
const taxAgency_createOutput = z
	.object({
		TaxAgency: QuickBooksModelSchemas['taxagencyresponse'],
		time: z.string(),
	})
	.strict();
const taxAgency_createDef = {
	input: taxAgency_createInput,
	output: taxAgency_createOutput,
	request: (input: z.output<typeof taxAgency_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxagency`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const taxAgency_createEndpoint = defineEndpoint(taxAgency_createDef);

const taxAgency_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const taxAgency_listOutput = z
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
	.strict();
const taxAgency_listDef = {
	input: taxAgency_listInput,
	output: taxAgency_listOutput,
	request: (input: z.output<typeof taxAgency_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM TaxAgency${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const taxAgency_listEndpoint = defineEndpoint(taxAgency_listDef);

const taxAgency_getInput = z
	.object({ realmId: RealmIdSchema, taxagencyId: IdSchema })
	.strict();
const taxAgency_getOutput = z
	.object({
		TaxAgency: QuickBooksModelSchemas['taxagencyresponse'],
		time: z.string(),
	})
	.strict();
const taxAgency_getDef = {
	input: taxAgency_getInput,
	output: taxAgency_getOutput,
	request: (input: z.output<typeof taxAgency_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxagency/${encodeURIComponent(input.taxagencyId)}`,
		method: 'GET',
	}),
} as const;
const taxAgency_getEndpoint = defineEndpoint(taxAgency_getDef);

const taxClassification_getInput = z
	.object({ realmId: RealmIdSchema, taxClassificationId: IdSchema })
	.strict();
const taxClassification_getOutput = z
	.object({
		TaxClassification: QuickBooksModelSchemas['taxclassification'],
		time: z.string(),
	})
	.strict();
const taxClassification_getDef = {
	input: taxClassification_getInput,
	output: taxClassification_getOutput,
	request: (input: z.output<typeof taxClassification_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxclassification/${encodeURIComponent(input.taxClassificationId)}`,
		method: 'GET',
	}),
} as const;
const taxClassification_getEndpoint = defineEndpoint(taxClassification_getDef);

const taxClassification_listChildrenInput = z
	.object({ realmId: RealmIdSchema, parentId: IdSchema })
	.strict();
const taxClassification_listChildrenOutput = z
	.object({
		TaxClassification: QuickBooksModelSchemas['taxclassification'],
		time: z.string(),
	})
	.strict();
const taxClassification_listChildrenDef = {
	input: taxClassification_listChildrenInput,
	output: taxClassification_listChildrenOutput,
	request: (input: z.output<typeof taxClassification_listChildrenInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxclassification/${encodeURIComponent(input.parentId)}/children`,
		method: 'GET',
	}),
} as const;
const taxClassification_listChildrenEndpoint = defineEndpoint(
	taxClassification_listChildrenDef,
);

const taxClassification_listInput = z
	.object({ realmId: RealmIdSchema })
	.strict();
const taxClassification_listOutput = z
	.object({
		TaxClassification: QuickBooksModelSchemas['taxclassification'],
		time: z.string(),
	})
	.strict();
const taxClassification_listDef = {
	input: taxClassification_listInput,
	output: taxClassification_listOutput,
	request: (input: z.output<typeof taxClassification_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxclassification`,
		method: 'GET',
	}),
} as const;
const taxClassification_listEndpoint = defineEndpoint(
	taxClassification_listDef,
);

const taxClassification_listByLevelInput = z
	.object({ realmId: RealmIdSchema, level: z.number().int().positive() })
	.strict();
const taxClassification_listByLevelOutput = z
	.object({
		TaxClassification: QuickBooksModelSchemas['taxclassification'],
		time: z.string(),
	})
	.strict();
const taxClassification_listByLevelDef = {
	input: taxClassification_listByLevelInput,
	output: taxClassification_listByLevelOutput,
	request: (input: z.output<typeof taxClassification_listByLevelInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxclassification`,
		method: 'GET',
		query: { level: input.level },
	}),
} as const;
const taxClassification_listByLevelEndpoint = defineEndpoint(
	taxClassification_listByLevelDef,
);

const taxCode_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const taxCode_listOutput = z
	.object({
		QueryResponse: z
			.object({
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
				TaxCode: z.array(QuickBooksModelSchemas['taxcoderesponse']).optional(),
			})
			.strict(),
		time: z.string(),
	})
	.strict();
const taxCode_listDef = {
	input: taxCode_listInput,
	output: taxCode_listOutput,
	request: (input: z.output<typeof taxCode_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM TaxCode${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const taxCode_listEndpoint = defineEndpoint(taxCode_listDef);

const taxCode_getInput = z
	.object({ realmId: RealmIdSchema, taxcodeId: IdSchema })
	.strict();
const taxCode_getOutput = z
	.object({
		TaxCode: QuickBooksModelSchemas['taxcoderesponse'],
		time: z.string(),
	})
	.strict();
const taxCode_getDef = {
	input: taxCode_getInput,
	output: taxCode_getOutput,
	request: (input: z.output<typeof taxCode_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxcode/${encodeURIComponent(input.taxcodeId)}`,
		method: 'GET',
	}),
} as const;
const taxCode_getEndpoint = defineEndpoint(taxCode_getDef);

const taxPayment_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const taxPayment_listOutput = z
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
	.strict();
const taxPayment_listDef = {
	input: taxPayment_listInput,
	output: taxPayment_listOutput,
	request: (input: z.output<typeof taxPayment_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM TaxPayment${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const taxPayment_listEndpoint = defineEndpoint(taxPayment_listDef);

const taxPayment_getInput = z
	.object({ realmId: RealmIdSchema, taxPaymentId: IdSchema })
	.strict();
const taxPayment_getOutput = z
	.object({
		TaxPayment: QuickBooksModelSchemas['taxpaymentresponse'],
		time: z.string(),
	})
	.strict();
const taxPayment_getDef = {
	input: taxPayment_getInput,
	output: taxPayment_getOutput,
	request: (input: z.output<typeof taxPayment_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxpayment/${encodeURIComponent(input.taxPaymentId)}`,
		method: 'GET',
	}),
} as const;
const taxPayment_getEndpoint = defineEndpoint(taxPayment_getDef);

const taxRate_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const taxRate_listOutput = z
	.object({
		QueryResponse: z
			.object({
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
				TaxRate: z.array(QuickBooksModelSchemas['taxrateresponse']).optional(),
			})
			.strict(),
		time: z.string(),
	})
	.strict();
const taxRate_listDef = {
	input: taxRate_listInput,
	output: taxRate_listOutput,
	request: (input: z.output<typeof taxRate_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM TaxRate${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const taxRate_listEndpoint = defineEndpoint(taxRate_listDef);

const taxRate_getInput = z
	.object({ realmId: RealmIdSchema, taxrateId: IdSchema })
	.strict();
const taxRate_getOutput = z
	.object({
		TaxRate: QuickBooksModelSchemas['taxrateresponse'],
		time: z.string(),
	})
	.strict();
const taxRate_getDef = {
	input: taxRate_getInput,
	output: taxRate_getOutput,
	request: (input: z.output<typeof taxRate_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxrate/${encodeURIComponent(input.taxrateId)}`,
		method: 'GET',
	}),
} as const;
const taxRate_getEndpoint = defineEndpoint(taxRate_getDef);

const taxService_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['taxservicerequest'],
	})
	.strict();
const taxService_createOutput = z
	.object({
		TaxService: QuickBooksModelSchemas['taxserviceresponse'],
		time: z.string(),
	})
	.strict();
const taxService_createDef = {
	input: taxService_createInput,
	output: taxService_createOutput,
	request: (input: z.output<typeof taxService_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/taxservice/taxcode`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const taxService_createEndpoint = defineEndpoint(taxService_createDef);

const taxSummary_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['taxsummaryquery'].partial().optional(),
	})
	.strict();
const taxSummary_listOutput = QuickBooksModelSchemas['reporttoplevel'];
const taxSummary_listDef = {
	input: taxSummary_listInput,
	output: taxSummary_listOutput,
	request: (input: z.output<typeof taxSummary_listInput>) => ({
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

const term_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['termrequest'],
	})
	.strict();
const term_createOutput = z
	.object({ Term: QuickBooksModelSchemas['termresponse'], time: z.string() })
	.strict();
const term_createDef = {
	input: term_createInput,
	output: term_createOutput,
	request: (input: z.output<typeof term_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/term`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const term_createEndpoint = defineEndpoint(term_createDef);

const term_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const term_listOutput = z
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
	.strict();
const term_listDef = {
	input: term_listInput,
	output: term_listOutput,
	request: (input: z.output<typeof term_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Term${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const term_listEndpoint = defineEndpoint(term_listDef);

const term_getInput = z
	.object({ realmId: RealmIdSchema, termId: IdSchema })
	.strict();
const term_getOutput = z
	.object({ Term: QuickBooksModelSchemas['termresponse'], time: z.string() })
	.strict();
const term_getDef = {
	input: term_getInput,
	output: term_getOutput,
	request: (input: z.output<typeof term_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/term/${encodeURIComponent(input.termId)}`,
		method: 'GET',
	}),
} as const;
const term_getEndpoint = defineEndpoint(term_getDef);

const term_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['termrequest']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const term_updateOutput = z
	.object({ Term: QuickBooksModelSchemas['termresponse'], time: z.string() })
	.strict();
const term_updateDef = {
	input: term_updateInput,
	output: term_updateOutput,
	request: (input: z.output<typeof term_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/term`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const term_updateEndpoint = defineEndpoint(term_updateDef);

const timeActivity_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['timeactivityrequest'],
	})
	.strict();
const timeActivity_createOutput = z
	.object({
		TimeActivity: QuickBooksModelSchemas['timeactivityresponse'],
		time: z.string(),
	})
	.strict();
const timeActivity_createDef = {
	input: timeActivity_createInput,
	output: timeActivity_createOutput,
	request: (input: z.output<typeof timeActivity_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/timeactivity`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const timeActivity_createEndpoint = defineEndpoint(timeActivity_createDef);

const timeActivity_deleteInput = z
	.object({ realmId: RealmIdSchema, body: DeleteBodySchema })
	.strict();
const timeActivity_deleteOutput = z
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
	.strict();
const timeActivity_deleteDef = {
	input: timeActivity_deleteInput,
	output: timeActivity_deleteOutput,
	request: (input: z.output<typeof timeActivity_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/timeactivity`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const timeActivity_deleteEndpoint = defineEndpoint(timeActivity_deleteDef);

const timeActivity_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const timeActivity_listOutput = z
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
	.strict();
const timeActivity_listDef = {
	input: timeActivity_listInput,
	output: timeActivity_listOutput,
	request: (input: z.output<typeof timeActivity_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM TimeActivity${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const timeActivity_listEndpoint = defineEndpoint(timeActivity_listDef);

const timeActivity_getInput = z
	.object({ realmId: RealmIdSchema, timeactivityId: IdSchema })
	.strict();
const timeActivity_getOutput = z
	.object({
		TimeActivity: QuickBooksModelSchemas['timeactivityresponse'],
		time: z.string(),
	})
	.strict();
const timeActivity_getDef = {
	input: timeActivity_getInput,
	output: timeActivity_getOutput,
	request: (input: z.output<typeof timeActivity_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/timeactivity/${encodeURIComponent(input.timeactivityId)}`,
		method: 'GET',
	}),
} as const;
const timeActivity_getEndpoint = defineEndpoint(timeActivity_getDef);

const timeActivity_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['timeactivityresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const timeActivity_updateOutput = z
	.object({
		TimeActivity: QuickBooksModelSchemas['timeactivityresponse'],
		time: z.string(),
	})
	.strict();
const timeActivity_updateDef = {
	input: timeActivity_updateInput,
	output: timeActivity_updateOutput,
	request: (input: z.output<typeof timeActivity_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/timeactivity`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const timeActivity_updateEndpoint = defineEndpoint(timeActivity_updateDef);

const transactionList_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['transactionlistquery'].partial().optional(),
	})
	.strict();
const transactionList_listOutput =
	QuickBooksModelSchemas['transactionlistreporttoplevel'];
const transactionList_listDef = {
	input: transactionList_listInput,
	output: transactionList_listOutput,
	request: (input: z.output<typeof transactionList_listInput>) => ({
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

const transactionListByCustomer_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['transactionlistbycustomerquery']
			.partial()
			.optional(),
	})
	.strict();
const transactionListByCustomer_listOutput =
	QuickBooksModelSchemas['transactionlistreporttoplevel'];
const transactionListByCustomer_listDef = {
	input: transactionListByCustomer_listInput,
	output: transactionListByCustomer_listOutput,
	request: (input: z.output<typeof transactionListByCustomer_listInput>) => ({
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

const transactionListByVendor_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['transactionlistbyvendorquery']
			.partial()
			.optional(),
	})
	.strict();
const transactionListByVendor_listOutput =
	QuickBooksModelSchemas['transactionlistreporttoplevel'];
const transactionListByVendor_listDef = {
	input: transactionListByVendor_listInput,
	output: transactionListByVendor_listOutput,
	request: (input: z.output<typeof transactionListByVendor_listInput>) => ({
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

const transactionListWithSplits_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['transactionlistwithsplitsquery']
			.partial()
			.optional(),
	})
	.strict();
const transactionListWithSplits_listOutput =
	QuickBooksModelSchemas['transactionlistreporttoplevel'];
const transactionListWithSplits_listDef = {
	input: transactionListWithSplits_listInput,
	output: transactionListWithSplits_listOutput,
	request: (input: z.output<typeof transactionListWithSplits_listInput>) => ({
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

const transfer_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['transferrequest'],
	})
	.strict();
const transfer_createOutput = z
	.object({
		Transfer: QuickBooksModelSchemas['transferresponse'],
		time: z.string(),
	})
	.strict();
const transfer_createDef = {
	input: transfer_createInput,
	output: transfer_createOutput,
	request: (input: z.output<typeof transfer_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/transfer`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const transfer_createEndpoint = defineEndpoint(transfer_createDef);

const transfer_deleteInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['transferresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const transfer_deleteOutput = z
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
	.strict();
const transfer_deleteDef = {
	input: transfer_deleteInput,
	output: transfer_deleteOutput,
	request: (input: z.output<typeof transfer_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/transfer`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const transfer_deleteEndpoint = defineEndpoint(transfer_deleteDef);

const transfer_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const transfer_listOutput = z
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
	.strict();
const transfer_listDef = {
	input: transfer_listInput,
	output: transfer_listOutput,
	request: (input: z.output<typeof transfer_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Transfer${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const transfer_listEndpoint = defineEndpoint(transfer_listDef);

const transfer_getInput = z
	.object({ realmId: RealmIdSchema, transferId: IdSchema })
	.strict();
const transfer_getOutput = z
	.object({
		Transfer: QuickBooksModelSchemas['transferresponse'],
		time: z.string(),
	})
	.strict();
const transfer_getDef = {
	input: transfer_getInput,
	output: transfer_getOutput,
	request: (input: z.output<typeof transfer_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/transfer/${encodeURIComponent(input.transferId)}`,
		method: 'GET',
	}),
} as const;
const transfer_getEndpoint = defineEndpoint(transfer_getDef);

const transfer_sparseUpdateInput = z
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
	.strict();
const transfer_sparseUpdateOutput = z
	.object({
		Transfer: QuickBooksModelSchemas['transferresponse'],
		time: z.string(),
	})
	.strict();
const transfer_sparseUpdateDef = {
	input: transfer_sparseUpdateInput,
	output: transfer_sparseUpdateOutput,
	request: (input: z.output<typeof transfer_sparseUpdateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/transfer`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const transfer_sparseUpdateEndpoint = defineEndpoint(transfer_sparseUpdateDef);

const transfer_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['transferrequest']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const transfer_updateOutput = z
	.object({
		Transfer: QuickBooksModelSchemas['transferresponse'],
		time: z.string(),
	})
	.strict();
const transfer_updateDef = {
	input: transfer_updateInput,
	output: transfer_updateOutput,
	request: (input: z.output<typeof transfer_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/transfer`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const transfer_updateEndpoint = defineEndpoint(transfer_updateDef);

const trialBalance_listInput = z
	.object({
		realmId: RealmIdSchema,
		locale: z.enum(['FR', 'default']).default('default'),
		params: QuickBooksModelSchemas['trialbalancequery'].partial().optional(),
	})
	.strict();
const trialBalance_listOutput =
	QuickBooksModelSchemas['trialbalancereporttoplevel'];
const trialBalance_listDef = {
	input: trialBalance_listInput,
	output: trialBalance_listOutput,
	request: (input: z.output<typeof trialBalance_listInput>) => ({
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

const vendor_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['vendorrequest'],
	})
	.strict();
const vendor_createOutput = z
	.object({
		Vendor: QuickBooksModelSchemas['vendorresponse'],
		time: z.string(),
	})
	.strict();
const vendor_createDef = {
	input: vendor_createInput,
	output: vendor_createOutput,
	request: (input: z.output<typeof vendor_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/vendor`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const vendor_createEndpoint = defineEndpoint(vendor_createDef);

const vendor_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const vendor_listOutput = z
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
	.strict();
const vendor_listDef = {
	input: vendor_listInput,
	output: vendor_listOutput,
	request: (input: z.output<typeof vendor_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM Vendor${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const vendor_listEndpoint = defineEndpoint(vendor_listDef);

const vendor_getInput = z
	.object({ realmId: RealmIdSchema, vendorId: IdSchema })
	.strict();
const vendor_getOutput = z
	.object({
		Vendor: QuickBooksModelSchemas['vendorresponse'],
		time: z.string(),
	})
	.strict();
const vendor_getDef = {
	input: vendor_getInput,
	output: vendor_getOutput,
	request: (input: z.output<typeof vendor_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/vendor/${encodeURIComponent(input.vendorId)}`,
		method: 'GET',
	}),
} as const;
const vendor_getEndpoint = defineEndpoint(vendor_getDef);

const vendor_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['vendorresponse']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const vendor_updateOutput = z
	.object({
		Vendor: QuickBooksModelSchemas['vendorresponse'],
		time: z.string(),
	})
	.strict();
const vendor_updateDef = {
	input: vendor_updateInput,
	output: vendor_updateOutput,
	request: (input: z.output<typeof vendor_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/vendor`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const vendor_updateEndpoint = defineEndpoint(vendor_updateDef);

const vendorBalance_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['vendorbalancequery'].partial().optional(),
	})
	.strict();
const vendorBalance_listOutput = QuickBooksModelSchemas['reporttoplevel'];
const vendorBalance_listDef = {
	input: vendorBalance_listInput,
	output: vendorBalance_listOutput,
	request: (input: z.output<typeof vendorBalance_listInput>) => ({
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

const vendorBalanceDetail_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['vendorbalancedetailquery']
			.partial()
			.optional(),
	})
	.strict();
const vendorBalanceDetail_listOutput = QuickBooksModelSchemas['reporttoplevel'];
const vendorBalanceDetail_listDef = {
	input: vendorBalanceDetail_listInput,
	output: vendorBalanceDetail_listOutput,
	request: (input: z.output<typeof vendorBalanceDetail_listInput>) => ({
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

const vendorCredit_createInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['vendorcreditrequest'],
	})
	.strict();
const vendorCredit_createOutput = z
	.object({
		VendorCredit: QuickBooksModelSchemas['vendorcreditresponse'],
		time: z.string(),
	})
	.strict();
const vendorCredit_createDef = {
	input: vendorCredit_createInput,
	output: vendorCredit_createOutput,
	request: (input: z.output<typeof vendorCredit_createInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/vendorcredit`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const vendorCredit_createEndpoint = defineEndpoint(vendorCredit_createDef);

const vendorCredit_deleteInput = z
	.object({ realmId: RealmIdSchema, body: DeleteBodySchema })
	.strict();
const vendorCredit_deleteOutput = z
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
	.strict();
const vendorCredit_deleteDef = {
	input: vendorCredit_deleteInput,
	output: vendorCredit_deleteOutput,
	request: (input: z.output<typeof vendorCredit_deleteInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/vendorcredit`,
		method: 'POST',
		query: { operation: 'delete' },
		body: input.body,
	}),
} as const;
const vendorCredit_deleteEndpoint = defineEndpoint(vendorCredit_deleteDef);

const vendorCredit_listInput = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const vendorCredit_listOutput = z
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
	.strict();
const vendorCredit_listDef = {
	input: vendorCredit_listInput,
	output: vendorCredit_listOutput,
	request: (input: z.output<typeof vendorCredit_listInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/query`,
		method: 'GET',
		query: {
			query: `SELECT * FROM VendorCredit${input.startPosition === undefined ? '' : ' STARTPOSITION ' + input.startPosition}${input.maxResults === undefined ? '' : ' MAXRESULTS ' + input.maxResults}`,
		},
	}),
} as const;
const vendorCredit_listEndpoint = defineEndpoint(vendorCredit_listDef);

const vendorCredit_getInput = z
	.object({ realmId: RealmIdSchema, vendorcreditId: IdSchema })
	.strict();
const vendorCredit_getOutput = z
	.object({
		VendorCredit: QuickBooksModelSchemas['vendorcreditresponse'],
		time: z.string(),
	})
	.strict();
const vendorCredit_getDef = {
	input: vendorCredit_getInput,
	output: vendorCredit_getOutput,
	request: (input: z.output<typeof vendorCredit_getInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/vendorcredit/${encodeURIComponent(input.vendorcreditId)}`,
		method: 'GET',
	}),
} as const;
const vendorCredit_getEndpoint = defineEndpoint(vendorCredit_getDef);

const vendorCredit_updateInput = z
	.object({
		realmId: RealmIdSchema,
		body: QuickBooksModelSchemas['vendorcreditrequest']
			.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
			.strict(),
	})
	.strict();
const vendorCredit_updateOutput = z
	.object({
		VendorCredit: QuickBooksModelSchemas['vendorcreditresponse'],
		time: z.string(),
	})
	.strict();
const vendorCredit_updateDef = {
	input: vendorCredit_updateInput,
	output: vendorCredit_updateOutput,
	request: (input: z.output<typeof vendorCredit_updateInput>) => ({
		path: `company/${encodeURIComponent(input.realmId)}/vendorcredit`,
		method: 'POST',
		body: input.body,
	}),
} as const;
const vendorCredit_updateEndpoint = defineEndpoint(vendorCredit_updateDef);

const vendorExpenses_listInput = z
	.object({
		realmId: RealmIdSchema,
		params: QuickBooksModelSchemas['vendorexpensesquery'].partial().optional(),
	})
	.strict();
const vendorExpenses_listOutput = QuickBooksModelSchemas['reporttoplevel'];
const vendorExpenses_listDef = {
	input: vendorExpenses_listInput,
	output: vendorExpenses_listOutput,
	request: (input: z.output<typeof vendorExpenses_listInput>) => ({
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

export const QuickBooksCatalogEndpointSchemas = {
	'apAgingDetail.list': {
		input: apAgingDetail_listInput,
		output: apAgingDetail_listOutput,
	},
	'apAgingSummary.list': {
		input: apAgingSummary_listInput,
		output: apAgingSummary_listOutput,
	},
	'arAgingDetail.list': {
		input: arAgingDetail_listInput,
		output: arAgingDetail_listOutput,
	},
	'arAgingSummary.list': {
		input: arAgingSummary_listInput,
		output: arAgingSummary_listOutput,
	},
	'accounts.update': {
		input: accounts_updateInput,
		output: accounts_updateOutput,
	},
	'accountListDetail.list': {
		input: accountListDetail_listInput,
		output: accountListDetail_listOutput,
	},
	'attachable.create': {
		input: attachable_createInput,
		output: attachable_createOutput,
	},
	'attachable.delete': {
		input: attachable_deleteInput,
		output: attachable_deleteOutput,
	},
	'attachable.download': {
		input: attachable_downloadInput,
		output: attachable_downloadOutput,
	},
	'attachable.list': {
		input: attachable_listInput,
		output: attachable_listOutput,
	},
	'attachable.get': {
		input: attachable_getInput,
		output: attachable_getOutput,
	},
	'attachable.update': {
		input: attachable_updateInput,
		output: attachable_updateOutput,
	},
	'attachable.upload': {
		input: attachable_uploadInput,
		output: attachable_uploadOutput,
	},
	'balanceSheet.list': {
		input: balanceSheet_listInput,
		output: balanceSheet_listOutput,
	},
	'bill.create': { input: bill_createInput, output: bill_createOutput },
	'bill.delete': { input: bill_deleteInput, output: bill_deleteOutput },
	'bill.list': { input: bill_listInput, output: bill_listOutput },
	'bill.get': { input: bill_getInput, output: bill_getOutput },
	'bill.update': { input: bill_updateInput, output: bill_updateOutput },
	'billPayment.create': {
		input: billPayment_createInput,
		output: billPayment_createOutput,
	},
	'billPayment.void': {
		input: billPayment_voidInput,
		output: billPayment_voidOutput,
	},
	'billPayment.delete': {
		input: billPayment_deleteInput,
		output: billPayment_deleteOutput,
	},
	'billPayment.list': {
		input: billPayment_listInput,
		output: billPayment_listOutput,
	},
	'billPayment.get': {
		input: billPayment_getInput,
		output: billPayment_getOutput,
	},
	'billPayment.update': {
		input: billPayment_updateInput,
		output: billPayment_updateOutput,
	},
	'budget.create': { input: budget_createInput, output: budget_createOutput },
	'budget.delete': { input: budget_deleteInput, output: budget_deleteOutput },
	'budget.list': { input: budget_listInput, output: budget_listOutput },
	'budget.get': { input: budget_getInput, output: budget_getOutput },
	'budget.update': { input: budget_updateInput, output: budget_updateOutput },
	'cashFlow.list': { input: cashFlow_listInput, output: cashFlow_listOutput },
	'changeOrder.create': {
		input: changeOrder_createInput,
		output: changeOrder_createOutput,
	},
	'changeOrder.delete': {
		input: changeOrder_deleteInput,
		output: changeOrder_deleteOutput,
	},
	'changeOrder.get': {
		input: changeOrder_getInput,
		output: changeOrder_getOutput,
	},
	'changeOrder.update': {
		input: changeOrder_updateInput,
		output: changeOrder_updateOutput,
	},
	'class.create': { input: class_createInput, output: class_createOutput },
	'class.list': { input: class_listInput, output: class_listOutput },
	'class.get': { input: class_getInput, output: class_getOutput },
	'class.update': { input: class_updateInput, output: class_updateOutput },
	'companyCurrency.create': {
		input: companyCurrency_createInput,
		output: companyCurrency_createOutput,
	},
	'companyCurrency.list': {
		input: companyCurrency_listInput,
		output: companyCurrency_listOutput,
	},
	'companyCurrency.get': {
		input: companyCurrency_getInput,
		output: companyCurrency_getOutput,
	},
	'companyCurrency.update': {
		input: companyCurrency_updateInput,
		output: companyCurrency_updateOutput,
	},
	'company.update': {
		input: company_updateInput,
		output: company_updateOutput,
	},
	'company.sparseUpdate': {
		input: company_sparseUpdateInput,
		output: company_sparseUpdateOutput,
	},
	'creditCardPayment.create': {
		input: creditCardPayment_createInput,
		output: creditCardPayment_createOutput,
	},
	'creditCardPayment.delete': {
		input: creditCardPayment_deleteInput,
		output: creditCardPayment_deleteOutput,
	},
	'creditCardPayment.list': {
		input: creditCardPayment_listInput,
		output: creditCardPayment_listOutput,
	},
	'creditCardPayment.get': {
		input: creditCardPayment_getInput,
		output: creditCardPayment_getOutput,
	},
	'creditCardPayment.update': {
		input: creditCardPayment_updateInput,
		output: creditCardPayment_updateOutput,
	},
	'creditCardPayment.sparseUpdate': {
		input: creditCardPayment_sparseUpdateInput,
		output: creditCardPayment_sparseUpdateOutput,
	},
	'creditMemo.create': {
		input: creditMemo_createInput,
		output: creditMemo_createOutput,
	},
	'creditMemo.delete': {
		input: creditMemo_deleteInput,
		output: creditMemo_deleteOutput,
	},
	'creditMemo.getPdf': {
		input: creditMemo_getPdfInput,
		output: creditMemo_getPdfOutput,
	},
	'creditMemo.list': {
		input: creditMemo_listInput,
		output: creditMemo_listOutput,
	},
	'creditMemo.get': {
		input: creditMemo_getInput,
		output: creditMemo_getOutput,
	},
	'creditMemo.send': {
		input: creditMemo_sendInput,
		output: creditMemo_sendOutput,
	},
	'creditMemo.update': {
		input: creditMemo_updateInput,
		output: creditMemo_updateOutput,
	},
	'customer.create': {
		input: customer_createInput,
		output: customer_createOutput,
	},
	'customer.list': { input: customer_listInput, output: customer_listOutput },
	'customer.get': { input: customer_getInput, output: customer_getOutput },
	'customer.update': {
		input: customer_updateInput,
		output: customer_updateOutput,
	},
	'customer.sparseUpdate': {
		input: customer_sparseUpdateInput,
		output: customer_sparseUpdateOutput,
	},
	'customerBalance.list': {
		input: customerBalance_listInput,
		output: customerBalance_listOutput,
	},
	'customerBalanceDetail.list': {
		input: customerBalanceDetail_listInput,
		output: customerBalanceDetail_listOutput,
	},
	'customerIncome.list': {
		input: customerIncome_listInput,
		output: customerIncome_listOutput,
	},
	'customerType.list': {
		input: customerType_listInput,
		output: customerType_listOutput,
	},
	'customerType.get': {
		input: customerType_getInput,
		output: customerType_getOutput,
	},
	'department.create': {
		input: department_createInput,
		output: department_createOutput,
	},
	'department.list': {
		input: department_listInput,
		output: department_listOutput,
	},
	'department.get': {
		input: department_getInput,
		output: department_getOutput,
	},
	'department.update': {
		input: department_updateInput,
		output: department_updateOutput,
	},
	'deposit.create': {
		input: deposit_createInput,
		output: deposit_createOutput,
	},
	'deposit.delete': {
		input: deposit_deleteInput,
		output: deposit_deleteOutput,
	},
	'deposit.list': { input: deposit_listInput, output: deposit_listOutput },
	'deposit.get': { input: deposit_getInput, output: deposit_getOutput },
	'deposit.update': {
		input: deposit_updateInput,
		output: deposit_updateOutput,
	},
	'deposit.sparseUpdate': {
		input: deposit_sparseUpdateInput,
		output: deposit_sparseUpdateOutput,
	},
	'employee.create': {
		input: employee_createInput,
		output: employee_createOutput,
	},
	'employee.list': { input: employee_listInput, output: employee_listOutput },
	'employee.get': { input: employee_getInput, output: employee_getOutput },
	'employee.update': {
		input: employee_updateInput,
		output: employee_updateOutput,
	},
	'estimate.create': {
		input: estimate_createInput,
		output: estimate_createOutput,
	},
	'estimate.delete': {
		input: estimate_deleteInput,
		output: estimate_deleteOutput,
	},
	'estimate.getPdf': {
		input: estimate_getPdfInput,
		output: estimate_getPdfOutput,
	},
	'estimate.list': { input: estimate_listInput, output: estimate_listOutput },
	'estimate.get': { input: estimate_getInput, output: estimate_getOutput },
	'estimate.send': { input: estimate_sendInput, output: estimate_sendOutput },
	'estimate.sparseUpdate': {
		input: estimate_sparseUpdateInput,
		output: estimate_sparseUpdateOutput,
	},
	'estimate.update': {
		input: estimate_updateInput,
		output: estimate_updateOutput,
	},
	'exchangerate.get': {
		input: exchangerate_getInput,
		output: exchangerate_getOutput,
	},
	'exchangerate.list': {
		input: exchangerate_listInput,
		output: exchangerate_listOutput,
	},
	'exchangerate.update': {
		input: exchangerate_updateInput,
		output: exchangerate_updateOutput,
	},
	'generalLedger.list': {
		input: generalLedger_listInput,
		output: generalLedger_listOutput,
	},
	'inventoryAdjustment.create': {
		input: inventoryAdjustment_createInput,
		output: inventoryAdjustment_createOutput,
	},
	'inventoryAdjustment.delete': {
		input: inventoryAdjustment_deleteInput,
		output: inventoryAdjustment_deleteOutput,
	},
	'inventoryAdjustment.get': {
		input: inventoryAdjustment_getInput,
		output: inventoryAdjustment_getOutput,
	},
	'inventoryAdjustment.sparseUpdate': {
		input: inventoryAdjustment_sparseUpdateInput,
		output: inventoryAdjustment_sparseUpdateOutput,
	},
	'inventoryValuationDetail.list': {
		input: inventoryValuationDetail_listInput,
		output: inventoryValuationDetail_listOutput,
	},
	'inventoryValuationSummary.list': {
		input: inventoryValuationSummary_listInput,
		output: inventoryValuationSummary_listOutput,
	},
	'invoice.create': {
		input: invoice_createInput,
		output: invoice_createOutput,
	},
	'invoice.delete': {
		input: invoice_deleteInput,
		output: invoice_deleteOutput,
	},
	'invoice.void': { input: invoice_voidInput, output: invoice_voidOutput },
	'invoice.getPdf': {
		input: invoice_getPdfInput,
		output: invoice_getPdfOutput,
	},
	'invoice.list': { input: invoice_listInput, output: invoice_listOutput },
	'invoice.get': { input: invoice_getInput, output: invoice_getOutput },
	'invoice.send': { input: invoice_sendInput, output: invoice_sendOutput },
	'invoice.sparseUpdate': {
		input: invoice_sparseUpdateInput,
		output: invoice_sparseUpdateOutput,
	},
	'invoice.update': {
		input: invoice_updateInput,
		output: invoice_updateOutput,
	},
	'item.create': { input: item_createInput, output: item_createOutput },
	'item.createCategory': {
		input: item_createCategoryInput,
		output: item_createCategoryOutput,
	},
	'item.listBundles': {
		input: item_listBundlesInput,
		output: item_listBundlesOutput,
	},
	'item.listCategories': {
		input: item_listCategoriesInput,
		output: item_listCategoriesOutput,
	},
	'item.listItems': {
		input: item_listItemsInput,
		output: item_listItemsOutput,
	},
	'item.getBundle': {
		input: item_getBundleInput,
		output: item_getBundleOutput,
	},
	'item.getCategory': {
		input: item_getCategoryInput,
		output: item_getCategoryOutput,
	},
	'item.getItem': { input: item_getItemInput, output: item_getItemOutput },
	'item.update': { input: item_updateInput, output: item_updateOutput },
	'item.updateCategory': {
		input: item_updateCategoryInput,
		output: item_updateCategoryOutput,
	},
	'journalEntry.create': {
		input: journalEntry_createInput,
		output: journalEntry_createOutput,
	},
	'journalEntry.delete': {
		input: journalEntry_deleteInput,
		output: journalEntry_deleteOutput,
	},
	'journalEntry.list': {
		input: journalEntry_listInput,
		output: journalEntry_listOutput,
	},
	'journalEntry.get': {
		input: journalEntry_getInput,
		output: journalEntry_getOutput,
	},
	'journalEntry.update': {
		input: journalEntry_updateInput,
		output: journalEntry_updateOutput,
	},
	'journalEntry.sparseUpdate': {
		input: journalEntry_sparseUpdateInput,
		output: journalEntry_sparseUpdateOutput,
	},
	'journalReport.list': {
		input: journalReport_listInput,
		output: journalReport_listOutput,
	},
	'payment.create': {
		input: payment_createInput,
		output: payment_createOutput,
	},
	'payment.delete': {
		input: payment_deleteInput,
		output: payment_deleteOutput,
	},
	'payment.void': { input: payment_voidInput, output: payment_voidOutput },
	'payment.getPdf': {
		input: payment_getPdfInput,
		output: payment_getPdfOutput,
	},
	'payment.list': { input: payment_listInput, output: payment_listOutput },
	'payment.get': { input: payment_getInput, output: payment_getOutput },
	'payment.send': { input: payment_sendInput, output: payment_sendOutput },
	'payment.update': {
		input: payment_updateInput,
		output: payment_updateOutput,
	},
	'paymentMethod.create': {
		input: paymentMethod_createInput,
		output: paymentMethod_createOutput,
	},
	'paymentMethod.list': {
		input: paymentMethod_listInput,
		output: paymentMethod_listOutput,
	},
	'paymentMethod.get': {
		input: paymentMethod_getInput,
		output: paymentMethod_getOutput,
	},
	'paymentMethod.update': {
		input: paymentMethod_updateInput,
		output: paymentMethod_updateOutput,
	},
	'preferences.list': {
		input: preferences_listInput,
		output: preferences_listOutput,
	},
	'preferences.get': {
		input: preferences_getInput,
		output: preferences_getOutput,
	},
	'preferences.update': {
		input: preferences_updateInput,
		output: preferences_updateOutput,
	},
	'profitAndLoss.list': {
		input: profitAndLoss_listInput,
		output: profitAndLoss_listOutput,
	},
	'profitAndLossDetail.list': {
		input: profitAndLossDetail_listInput,
		output: profitAndLossDetail_listOutput,
	},
	'purchase.create': {
		input: purchase_createInput,
		output: purchase_createOutput,
	},
	'purchase.delete': {
		input: purchase_deleteInput,
		output: purchase_deleteOutput,
	},
	'purchase.list': { input: purchase_listInput, output: purchase_listOutput },
	'purchase.get': { input: purchase_getInput, output: purchase_getOutput },
	'purchase.update': {
		input: purchase_updateInput,
		output: purchase_updateOutput,
	},
	'purchaseOrder.create': {
		input: purchaseOrder_createInput,
		output: purchaseOrder_createOutput,
	},
	'purchaseOrder.delete': {
		input: purchaseOrder_deleteInput,
		output: purchaseOrder_deleteOutput,
	},
	'purchaseOrder.getPdf': {
		input: purchaseOrder_getPdfInput,
		output: purchaseOrder_getPdfOutput,
	},
	'purchaseOrder.list': {
		input: purchaseOrder_listInput,
		output: purchaseOrder_listOutput,
	},
	'purchaseOrder.get': {
		input: purchaseOrder_getInput,
		output: purchaseOrder_getOutput,
	},
	'purchaseOrder.send': {
		input: purchaseOrder_sendInput,
		output: purchaseOrder_sendOutput,
	},
	'purchaseOrder.update': {
		input: purchaseOrder_updateInput,
		output: purchaseOrder_updateOutput,
	},
	'recurringTransaction.create': {
		input: recurringTransaction_createInput,
		output: recurringTransaction_createOutput,
	},
	'recurringTransaction.delete': {
		input: recurringTransaction_deleteInput,
		output: recurringTransaction_deleteOutput,
	},
	'recurringTransaction.list': {
		input: recurringTransaction_listInput,
		output: recurringTransaction_listOutput,
	},
	'recurringTransaction.get': {
		input: recurringTransaction_getInput,
		output: recurringTransaction_getOutput,
	},
	'refundReceipt.create': {
		input: refundReceipt_createInput,
		output: refundReceipt_createOutput,
	},
	'refundReceipt.delete': {
		input: refundReceipt_deleteInput,
		output: refundReceipt_deleteOutput,
	},
	'refundReceipt.getPdf': {
		input: refundReceipt_getPdfInput,
		output: refundReceipt_getPdfOutput,
	},
	'refundReceipt.list': {
		input: refundReceipt_listInput,
		output: refundReceipt_listOutput,
	},
	'refundReceipt.get': {
		input: refundReceipt_getInput,
		output: refundReceipt_getOutput,
	},
	'refundReceipt.send': {
		input: refundReceipt_sendInput,
		output: refundReceipt_sendOutput,
	},
	'refundReceipt.sparseUpdate': {
		input: refundReceipt_sparseUpdateInput,
		output: refundReceipt_sparseUpdateOutput,
	},
	'refundReceipt.update': {
		input: refundReceipt_updateInput,
		output: refundReceipt_updateOutput,
	},
	'reimburseCharge.list': {
		input: reimburseCharge_listInput,
		output: reimburseCharge_listOutput,
	},
	'reimburseCharge.get': {
		input: reimburseCharge_getInput,
		output: reimburseCharge_getOutput,
	},
	'salesByClassSummary.list': {
		input: salesByClassSummary_listInput,
		output: salesByClassSummary_listOutput,
	},
	'salesByCustomer.list': {
		input: salesByCustomer_listInput,
		output: salesByCustomer_listOutput,
	},
	'salesByDepartment.list': {
		input: salesByDepartment_listInput,
		output: salesByDepartment_listOutput,
	},
	'salesByProduct.list': {
		input: salesByProduct_listInput,
		output: salesByProduct_listOutput,
	},
	'salesReceipt.create': {
		input: salesReceipt_createInput,
		output: salesReceipt_createOutput,
	},
	'salesReceipt.delete': {
		input: salesReceipt_deleteInput,
		output: salesReceipt_deleteOutput,
	},
	'salesReceipt.void': {
		input: salesReceipt_voidInput,
		output: salesReceipt_voidOutput,
	},
	'salesReceipt.getPdf': {
		input: salesReceipt_getPdfInput,
		output: salesReceipt_getPdfOutput,
	},
	'salesReceipt.list': {
		input: salesReceipt_listInput,
		output: salesReceipt_listOutput,
	},
	'salesReceipt.get': {
		input: salesReceipt_getInput,
		output: salesReceipt_getOutput,
	},
	'salesReceipt.send': {
		input: salesReceipt_sendInput,
		output: salesReceipt_sendOutput,
	},
	'salesReceipt.update': {
		input: salesReceipt_updateInput,
		output: salesReceipt_updateOutput,
	},
	'salesReceipt.sparseUpdate': {
		input: salesReceipt_sparseUpdateInput,
		output: salesReceipt_sparseUpdateOutput,
	},
	'taxAgency.create': {
		input: taxAgency_createInput,
		output: taxAgency_createOutput,
	},
	'taxAgency.list': {
		input: taxAgency_listInput,
		output: taxAgency_listOutput,
	},
	'taxAgency.get': { input: taxAgency_getInput, output: taxAgency_getOutput },
	'taxClassification.get': {
		input: taxClassification_getInput,
		output: taxClassification_getOutput,
	},
	'taxClassification.listChildren': {
		input: taxClassification_listChildrenInput,
		output: taxClassification_listChildrenOutput,
	},
	'taxClassification.list': {
		input: taxClassification_listInput,
		output: taxClassification_listOutput,
	},
	'taxClassification.listByLevel': {
		input: taxClassification_listByLevelInput,
		output: taxClassification_listByLevelOutput,
	},
	'taxCode.list': { input: taxCode_listInput, output: taxCode_listOutput },
	'taxCode.get': { input: taxCode_getInput, output: taxCode_getOutput },
	'taxPayment.list': {
		input: taxPayment_listInput,
		output: taxPayment_listOutput,
	},
	'taxPayment.get': {
		input: taxPayment_getInput,
		output: taxPayment_getOutput,
	},
	'taxRate.list': { input: taxRate_listInput, output: taxRate_listOutput },
	'taxRate.get': { input: taxRate_getInput, output: taxRate_getOutput },
	'taxService.create': {
		input: taxService_createInput,
		output: taxService_createOutput,
	},
	'taxSummary.list': {
		input: taxSummary_listInput,
		output: taxSummary_listOutput,
	},
	'term.create': { input: term_createInput, output: term_createOutput },
	'term.list': { input: term_listInput, output: term_listOutput },
	'term.get': { input: term_getInput, output: term_getOutput },
	'term.update': { input: term_updateInput, output: term_updateOutput },
	'timeActivity.create': {
		input: timeActivity_createInput,
		output: timeActivity_createOutput,
	},
	'timeActivity.delete': {
		input: timeActivity_deleteInput,
		output: timeActivity_deleteOutput,
	},
	'timeActivity.list': {
		input: timeActivity_listInput,
		output: timeActivity_listOutput,
	},
	'timeActivity.get': {
		input: timeActivity_getInput,
		output: timeActivity_getOutput,
	},
	'timeActivity.update': {
		input: timeActivity_updateInput,
		output: timeActivity_updateOutput,
	},
	'transactionList.list': {
		input: transactionList_listInput,
		output: transactionList_listOutput,
	},
	'transactionListByCustomer.list': {
		input: transactionListByCustomer_listInput,
		output: transactionListByCustomer_listOutput,
	},
	'transactionListByVendor.list': {
		input: transactionListByVendor_listInput,
		output: transactionListByVendor_listOutput,
	},
	'transactionListWithSplits.list': {
		input: transactionListWithSplits_listInput,
		output: transactionListWithSplits_listOutput,
	},
	'transfer.create': {
		input: transfer_createInput,
		output: transfer_createOutput,
	},
	'transfer.delete': {
		input: transfer_deleteInput,
		output: transfer_deleteOutput,
	},
	'transfer.list': { input: transfer_listInput, output: transfer_listOutput },
	'transfer.get': { input: transfer_getInput, output: transfer_getOutput },
	'transfer.sparseUpdate': {
		input: transfer_sparseUpdateInput,
		output: transfer_sparseUpdateOutput,
	},
	'transfer.update': {
		input: transfer_updateInput,
		output: transfer_updateOutput,
	},
	'trialBalance.list': {
		input: trialBalance_listInput,
		output: trialBalance_listOutput,
	},
	'vendor.create': { input: vendor_createInput, output: vendor_createOutput },
	'vendor.list': { input: vendor_listInput, output: vendor_listOutput },
	'vendor.get': { input: vendor_getInput, output: vendor_getOutput },
	'vendor.update': { input: vendor_updateInput, output: vendor_updateOutput },
	'vendorBalance.list': {
		input: vendorBalance_listInput,
		output: vendorBalance_listOutput,
	},
	'vendorBalanceDetail.list': {
		input: vendorBalanceDetail_listInput,
		output: vendorBalanceDetail_listOutput,
	},
	'vendorCredit.create': {
		input: vendorCredit_createInput,
		output: vendorCredit_createOutput,
	},
	'vendorCredit.delete': {
		input: vendorCredit_deleteInput,
		output: vendorCredit_deleteOutput,
	},
	'vendorCredit.list': {
		input: vendorCredit_listInput,
		output: vendorCredit_listOutput,
	},
	'vendorCredit.get': {
		input: vendorCredit_getInput,
		output: vendorCredit_getOutput,
	},
	'vendorCredit.update': {
		input: vendorCredit_updateInput,
		output: vendorCredit_updateOutput,
	},
	'vendorExpenses.list': {
		input: vendorExpenses_listInput,
		output: vendorExpenses_listOutput,
	},
} as const;

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
	apAgingDetailList: z.input<typeof apAgingDetail_listInput>;
	apAgingSummaryList: z.input<typeof apAgingSummary_listInput>;
	arAgingDetailList: z.input<typeof arAgingDetail_listInput>;
	arAgingSummaryList: z.input<typeof arAgingSummary_listInput>;
	accountsUpdate: z.input<typeof accounts_updateInput>;
	accountListDetailList: z.input<typeof accountListDetail_listInput>;
	attachableCreate: z.input<typeof attachable_createInput>;
	attachableDelete: z.input<typeof attachable_deleteInput>;
	attachableDownload: z.input<typeof attachable_downloadInput>;
	attachableList: z.input<typeof attachable_listInput>;
	attachableGet: z.input<typeof attachable_getInput>;
	attachableUpdate: z.input<typeof attachable_updateInput>;
	attachableUpload: z.input<typeof attachable_uploadInput>;
	balanceSheetList: z.input<typeof balanceSheet_listInput>;
	billCreate: z.input<typeof bill_createInput>;
	billDelete: z.input<typeof bill_deleteInput>;
	billList: z.input<typeof bill_listInput>;
	billGet: z.input<typeof bill_getInput>;
	billUpdate: z.input<typeof bill_updateInput>;
	billPaymentCreate: z.input<typeof billPayment_createInput>;
	billPaymentVoid: z.input<typeof billPayment_voidInput>;
	billPaymentDelete: z.input<typeof billPayment_deleteInput>;
	billPaymentList: z.input<typeof billPayment_listInput>;
	billPaymentGet: z.input<typeof billPayment_getInput>;
	billPaymentUpdate: z.input<typeof billPayment_updateInput>;
	budgetCreate: z.input<typeof budget_createInput>;
	budgetDelete: z.input<typeof budget_deleteInput>;
	budgetList: z.input<typeof budget_listInput>;
	budgetGet: z.input<typeof budget_getInput>;
	budgetUpdate: z.input<typeof budget_updateInput>;
	cashFlowList: z.input<typeof cashFlow_listInput>;
	changeOrderCreate: z.input<typeof changeOrder_createInput>;
	changeOrderDelete: z.input<typeof changeOrder_deleteInput>;
	changeOrderGet: z.input<typeof changeOrder_getInput>;
	changeOrderUpdate: z.input<typeof changeOrder_updateInput>;
	classCreate: z.input<typeof class_createInput>;
	classList: z.input<typeof class_listInput>;
	classGet: z.input<typeof class_getInput>;
	classUpdate: z.input<typeof class_updateInput>;
	companyCurrencyCreate: z.input<typeof companyCurrency_createInput>;
	companyCurrencyList: z.input<typeof companyCurrency_listInput>;
	companyCurrencyGet: z.input<typeof companyCurrency_getInput>;
	companyCurrencyUpdate: z.input<typeof companyCurrency_updateInput>;
	companyUpdate: z.input<typeof company_updateInput>;
	companySparseUpdate: z.input<typeof company_sparseUpdateInput>;
	creditCardPaymentCreate: z.input<typeof creditCardPayment_createInput>;
	creditCardPaymentDelete: z.input<typeof creditCardPayment_deleteInput>;
	creditCardPaymentList: z.input<typeof creditCardPayment_listInput>;
	creditCardPaymentGet: z.input<typeof creditCardPayment_getInput>;
	creditCardPaymentUpdate: z.input<typeof creditCardPayment_updateInput>;
	creditCardPaymentSparseUpdate: z.input<
		typeof creditCardPayment_sparseUpdateInput
	>;
	creditMemoCreate: z.input<typeof creditMemo_createInput>;
	creditMemoDelete: z.input<typeof creditMemo_deleteInput>;
	creditMemoGetPdf: z.input<typeof creditMemo_getPdfInput>;
	creditMemoList: z.input<typeof creditMemo_listInput>;
	creditMemoGet: z.input<typeof creditMemo_getInput>;
	creditMemoSend: z.input<typeof creditMemo_sendInput>;
	creditMemoUpdate: z.input<typeof creditMemo_updateInput>;
	customerCreate: z.input<typeof customer_createInput>;
	customerList: z.input<typeof customer_listInput>;
	customerGet: z.input<typeof customer_getInput>;
	customerUpdate: z.input<typeof customer_updateInput>;
	customerSparseUpdate: z.input<typeof customer_sparseUpdateInput>;
	customerBalanceList: z.input<typeof customerBalance_listInput>;
	customerBalanceDetailList: z.input<typeof customerBalanceDetail_listInput>;
	customerIncomeList: z.input<typeof customerIncome_listInput>;
	customerTypeList: z.input<typeof customerType_listInput>;
	customerTypeGet: z.input<typeof customerType_getInput>;
	departmentCreate: z.input<typeof department_createInput>;
	departmentList: z.input<typeof department_listInput>;
	departmentGet: z.input<typeof department_getInput>;
	departmentUpdate: z.input<typeof department_updateInput>;
	depositCreate: z.input<typeof deposit_createInput>;
	depositDelete: z.input<typeof deposit_deleteInput>;
	depositList: z.input<typeof deposit_listInput>;
	depositGet: z.input<typeof deposit_getInput>;
	depositUpdate: z.input<typeof deposit_updateInput>;
	depositSparseUpdate: z.input<typeof deposit_sparseUpdateInput>;
	employeeCreate: z.input<typeof employee_createInput>;
	employeeList: z.input<typeof employee_listInput>;
	employeeGet: z.input<typeof employee_getInput>;
	employeeUpdate: z.input<typeof employee_updateInput>;
	estimateCreate: z.input<typeof estimate_createInput>;
	estimateDelete: z.input<typeof estimate_deleteInput>;
	estimateGetPdf: z.input<typeof estimate_getPdfInput>;
	estimateList: z.input<typeof estimate_listInput>;
	estimateGet: z.input<typeof estimate_getInput>;
	estimateSend: z.input<typeof estimate_sendInput>;
	estimateSparseUpdate: z.input<typeof estimate_sparseUpdateInput>;
	estimateUpdate: z.input<typeof estimate_updateInput>;
	exchangerateGet: z.input<typeof exchangerate_getInput>;
	exchangerateList: z.input<typeof exchangerate_listInput>;
	exchangerateUpdate: z.input<typeof exchangerate_updateInput>;
	generalLedgerList: z.input<typeof generalLedger_listInput>;
	inventoryAdjustmentCreate: z.input<typeof inventoryAdjustment_createInput>;
	inventoryAdjustmentDelete: z.input<typeof inventoryAdjustment_deleteInput>;
	inventoryAdjustmentGet: z.input<typeof inventoryAdjustment_getInput>;
	inventoryAdjustmentSparseUpdate: z.input<
		typeof inventoryAdjustment_sparseUpdateInput
	>;
	inventoryValuationDetailList: z.input<
		typeof inventoryValuationDetail_listInput
	>;
	inventoryValuationSummaryList: z.input<
		typeof inventoryValuationSummary_listInput
	>;
	invoiceCreate: z.input<typeof invoice_createInput>;
	invoiceDelete: z.input<typeof invoice_deleteInput>;
	invoiceVoid: z.input<typeof invoice_voidInput>;
	invoiceGetPdf: z.input<typeof invoice_getPdfInput>;
	invoiceList: z.input<typeof invoice_listInput>;
	invoiceGet: z.input<typeof invoice_getInput>;
	invoiceSend: z.input<typeof invoice_sendInput>;
	invoiceSparseUpdate: z.input<typeof invoice_sparseUpdateInput>;
	invoiceUpdate: z.input<typeof invoice_updateInput>;
	itemCreate: z.input<typeof item_createInput>;
	itemCreateCategory: z.input<typeof item_createCategoryInput>;
	itemListBundles: z.input<typeof item_listBundlesInput>;
	itemListCategories: z.input<typeof item_listCategoriesInput>;
	itemListItems: z.input<typeof item_listItemsInput>;
	itemGetBundle: z.input<typeof item_getBundleInput>;
	itemGetCategory: z.input<typeof item_getCategoryInput>;
	itemGetItem: z.input<typeof item_getItemInput>;
	itemUpdate: z.input<typeof item_updateInput>;
	itemUpdateCategory: z.input<typeof item_updateCategoryInput>;
	journalEntryCreate: z.input<typeof journalEntry_createInput>;
	journalEntryDelete: z.input<typeof journalEntry_deleteInput>;
	journalEntryList: z.input<typeof journalEntry_listInput>;
	journalEntryGet: z.input<typeof journalEntry_getInput>;
	journalEntryUpdate: z.input<typeof journalEntry_updateInput>;
	journalEntrySparseUpdate: z.input<typeof journalEntry_sparseUpdateInput>;
	journalReportList: z.input<typeof journalReport_listInput>;
	paymentCreate: z.input<typeof payment_createInput>;
	paymentDelete: z.input<typeof payment_deleteInput>;
	paymentVoid: z.input<typeof payment_voidInput>;
	paymentGetPdf: z.input<typeof payment_getPdfInput>;
	paymentList: z.input<typeof payment_listInput>;
	paymentGet: z.input<typeof payment_getInput>;
	paymentSend: z.input<typeof payment_sendInput>;
	paymentUpdate: z.input<typeof payment_updateInput>;
	paymentMethodCreate: z.input<typeof paymentMethod_createInput>;
	paymentMethodList: z.input<typeof paymentMethod_listInput>;
	paymentMethodGet: z.input<typeof paymentMethod_getInput>;
	paymentMethodUpdate: z.input<typeof paymentMethod_updateInput>;
	preferencesList: z.input<typeof preferences_listInput>;
	preferencesGet: z.input<typeof preferences_getInput>;
	preferencesUpdate: z.input<typeof preferences_updateInput>;
	profitAndLossList: z.input<typeof profitAndLoss_listInput>;
	profitAndLossDetailList: z.input<typeof profitAndLossDetail_listInput>;
	purchaseCreate: z.input<typeof purchase_createInput>;
	purchaseDelete: z.input<typeof purchase_deleteInput>;
	purchaseList: z.input<typeof purchase_listInput>;
	purchaseGet: z.input<typeof purchase_getInput>;
	purchaseUpdate: z.input<typeof purchase_updateInput>;
	purchaseOrderCreate: z.input<typeof purchaseOrder_createInput>;
	purchaseOrderDelete: z.input<typeof purchaseOrder_deleteInput>;
	purchaseOrderGetPdf: z.input<typeof purchaseOrder_getPdfInput>;
	purchaseOrderList: z.input<typeof purchaseOrder_listInput>;
	purchaseOrderGet: z.input<typeof purchaseOrder_getInput>;
	purchaseOrderSend: z.input<typeof purchaseOrder_sendInput>;
	purchaseOrderUpdate: z.input<typeof purchaseOrder_updateInput>;
	recurringTransactionCreate: z.input<typeof recurringTransaction_createInput>;
	recurringTransactionDelete: z.input<typeof recurringTransaction_deleteInput>;
	recurringTransactionList: z.input<typeof recurringTransaction_listInput>;
	recurringTransactionGet: z.input<typeof recurringTransaction_getInput>;
	refundReceiptCreate: z.input<typeof refundReceipt_createInput>;
	refundReceiptDelete: z.input<typeof refundReceipt_deleteInput>;
	refundReceiptGetPdf: z.input<typeof refundReceipt_getPdfInput>;
	refundReceiptList: z.input<typeof refundReceipt_listInput>;
	refundReceiptGet: z.input<typeof refundReceipt_getInput>;
	refundReceiptSend: z.input<typeof refundReceipt_sendInput>;
	refundReceiptSparseUpdate: z.input<typeof refundReceipt_sparseUpdateInput>;
	refundReceiptUpdate: z.input<typeof refundReceipt_updateInput>;
	reimburseChargeList: z.input<typeof reimburseCharge_listInput>;
	reimburseChargeGet: z.input<typeof reimburseCharge_getInput>;
	salesByClassSummaryList: z.input<typeof salesByClassSummary_listInput>;
	salesByCustomerList: z.input<typeof salesByCustomer_listInput>;
	salesByDepartmentList: z.input<typeof salesByDepartment_listInput>;
	salesByProductList: z.input<typeof salesByProduct_listInput>;
	salesReceiptCreate: z.input<typeof salesReceipt_createInput>;
	salesReceiptDelete: z.input<typeof salesReceipt_deleteInput>;
	salesReceiptVoid: z.input<typeof salesReceipt_voidInput>;
	salesReceiptGetPdf: z.input<typeof salesReceipt_getPdfInput>;
	salesReceiptList: z.input<typeof salesReceipt_listInput>;
	salesReceiptGet: z.input<typeof salesReceipt_getInput>;
	salesReceiptSend: z.input<typeof salesReceipt_sendInput>;
	salesReceiptUpdate: z.input<typeof salesReceipt_updateInput>;
	salesReceiptSparseUpdate: z.input<typeof salesReceipt_sparseUpdateInput>;
	taxAgencyCreate: z.input<typeof taxAgency_createInput>;
	taxAgencyList: z.input<typeof taxAgency_listInput>;
	taxAgencyGet: z.input<typeof taxAgency_getInput>;
	taxClassificationGet: z.input<typeof taxClassification_getInput>;
	taxClassificationListChildren: z.input<
		typeof taxClassification_listChildrenInput
	>;
	taxClassificationList: z.input<typeof taxClassification_listInput>;
	taxClassificationListByLevel: z.input<
		typeof taxClassification_listByLevelInput
	>;
	taxCodeList: z.input<typeof taxCode_listInput>;
	taxCodeGet: z.input<typeof taxCode_getInput>;
	taxPaymentList: z.input<typeof taxPayment_listInput>;
	taxPaymentGet: z.input<typeof taxPayment_getInput>;
	taxRateList: z.input<typeof taxRate_listInput>;
	taxRateGet: z.input<typeof taxRate_getInput>;
	taxServiceCreate: z.input<typeof taxService_createInput>;
	taxSummaryList: z.input<typeof taxSummary_listInput>;
	termCreate: z.input<typeof term_createInput>;
	termList: z.input<typeof term_listInput>;
	termGet: z.input<typeof term_getInput>;
	termUpdate: z.input<typeof term_updateInput>;
	timeActivityCreate: z.input<typeof timeActivity_createInput>;
	timeActivityDelete: z.input<typeof timeActivity_deleteInput>;
	timeActivityList: z.input<typeof timeActivity_listInput>;
	timeActivityGet: z.input<typeof timeActivity_getInput>;
	timeActivityUpdate: z.input<typeof timeActivity_updateInput>;
	transactionListList: z.input<typeof transactionList_listInput>;
	transactionListByCustomerList: z.input<
		typeof transactionListByCustomer_listInput
	>;
	transactionListByVendorList: z.input<
		typeof transactionListByVendor_listInput
	>;
	transactionListWithSplitsList: z.input<
		typeof transactionListWithSplits_listInput
	>;
	transferCreate: z.input<typeof transfer_createInput>;
	transferDelete: z.input<typeof transfer_deleteInput>;
	transferList: z.input<typeof transfer_listInput>;
	transferGet: z.input<typeof transfer_getInput>;
	transferSparseUpdate: z.input<typeof transfer_sparseUpdateInput>;
	transferUpdate: z.input<typeof transfer_updateInput>;
	trialBalanceList: z.input<typeof trialBalance_listInput>;
	vendorCreate: z.input<typeof vendor_createInput>;
	vendorList: z.input<typeof vendor_listInput>;
	vendorGet: z.input<typeof vendor_getInput>;
	vendorUpdate: z.input<typeof vendor_updateInput>;
	vendorBalanceList: z.input<typeof vendorBalance_listInput>;
	vendorBalanceDetailList: z.input<typeof vendorBalanceDetail_listInput>;
	vendorCreditCreate: z.input<typeof vendorCredit_createInput>;
	vendorCreditDelete: z.input<typeof vendorCredit_deleteInput>;
	vendorCreditList: z.input<typeof vendorCredit_listInput>;
	vendorCreditGet: z.input<typeof vendorCredit_getInput>;
	vendorCreditUpdate: z.input<typeof vendorCredit_updateInput>;
	vendorExpensesList: z.input<typeof vendorExpenses_listInput>;
};
export type QuickBooksCatalogEndpointOutputs = {
	apAgingDetailList: z.output<typeof apAgingDetail_listOutput>;
	apAgingSummaryList: z.output<typeof apAgingSummary_listOutput>;
	arAgingDetailList: z.output<typeof arAgingDetail_listOutput>;
	arAgingSummaryList: z.output<typeof arAgingSummary_listOutput>;
	accountsUpdate: z.output<typeof accounts_updateOutput>;
	accountListDetailList: z.output<typeof accountListDetail_listOutput>;
	attachableCreate: z.output<typeof attachable_createOutput>;
	attachableDelete: z.output<typeof attachable_deleteOutput>;
	attachableDownload: z.output<typeof attachable_downloadOutput>;
	attachableList: z.output<typeof attachable_listOutput>;
	attachableGet: z.output<typeof attachable_getOutput>;
	attachableUpdate: z.output<typeof attachable_updateOutput>;
	attachableUpload: z.output<typeof attachable_uploadOutput>;
	balanceSheetList: z.output<typeof balanceSheet_listOutput>;
	billCreate: z.output<typeof bill_createOutput>;
	billDelete: z.output<typeof bill_deleteOutput>;
	billList: z.output<typeof bill_listOutput>;
	billGet: z.output<typeof bill_getOutput>;
	billUpdate: z.output<typeof bill_updateOutput>;
	billPaymentCreate: z.output<typeof billPayment_createOutput>;
	billPaymentVoid: z.output<typeof billPayment_voidOutput>;
	billPaymentDelete: z.output<typeof billPayment_deleteOutput>;
	billPaymentList: z.output<typeof billPayment_listOutput>;
	billPaymentGet: z.output<typeof billPayment_getOutput>;
	billPaymentUpdate: z.output<typeof billPayment_updateOutput>;
	budgetCreate: z.output<typeof budget_createOutput>;
	budgetDelete: z.output<typeof budget_deleteOutput>;
	budgetList: z.output<typeof budget_listOutput>;
	budgetGet: z.output<typeof budget_getOutput>;
	budgetUpdate: z.output<typeof budget_updateOutput>;
	cashFlowList: z.output<typeof cashFlow_listOutput>;
	changeOrderCreate: z.output<typeof changeOrder_createOutput>;
	changeOrderDelete: z.output<typeof changeOrder_deleteOutput>;
	changeOrderGet: z.output<typeof changeOrder_getOutput>;
	changeOrderUpdate: z.output<typeof changeOrder_updateOutput>;
	classCreate: z.output<typeof class_createOutput>;
	classList: z.output<typeof class_listOutput>;
	classGet: z.output<typeof class_getOutput>;
	classUpdate: z.output<typeof class_updateOutput>;
	companyCurrencyCreate: z.output<typeof companyCurrency_createOutput>;
	companyCurrencyList: z.output<typeof companyCurrency_listOutput>;
	companyCurrencyGet: z.output<typeof companyCurrency_getOutput>;
	companyCurrencyUpdate: z.output<typeof companyCurrency_updateOutput>;
	companyUpdate: z.output<typeof company_updateOutput>;
	companySparseUpdate: z.output<typeof company_sparseUpdateOutput>;
	creditCardPaymentCreate: z.output<typeof creditCardPayment_createOutput>;
	creditCardPaymentDelete: z.output<typeof creditCardPayment_deleteOutput>;
	creditCardPaymentList: z.output<typeof creditCardPayment_listOutput>;
	creditCardPaymentGet: z.output<typeof creditCardPayment_getOutput>;
	creditCardPaymentUpdate: z.output<typeof creditCardPayment_updateOutput>;
	creditCardPaymentSparseUpdate: z.output<
		typeof creditCardPayment_sparseUpdateOutput
	>;
	creditMemoCreate: z.output<typeof creditMemo_createOutput>;
	creditMemoDelete: z.output<typeof creditMemo_deleteOutput>;
	creditMemoGetPdf: z.output<typeof creditMemo_getPdfOutput>;
	creditMemoList: z.output<typeof creditMemo_listOutput>;
	creditMemoGet: z.output<typeof creditMemo_getOutput>;
	creditMemoSend: z.output<typeof creditMemo_sendOutput>;
	creditMemoUpdate: z.output<typeof creditMemo_updateOutput>;
	customerCreate: z.output<typeof customer_createOutput>;
	customerList: z.output<typeof customer_listOutput>;
	customerGet: z.output<typeof customer_getOutput>;
	customerUpdate: z.output<typeof customer_updateOutput>;
	customerSparseUpdate: z.output<typeof customer_sparseUpdateOutput>;
	customerBalanceList: z.output<typeof customerBalance_listOutput>;
	customerBalanceDetailList: z.output<typeof customerBalanceDetail_listOutput>;
	customerIncomeList: z.output<typeof customerIncome_listOutput>;
	customerTypeList: z.output<typeof customerType_listOutput>;
	customerTypeGet: z.output<typeof customerType_getOutput>;
	departmentCreate: z.output<typeof department_createOutput>;
	departmentList: z.output<typeof department_listOutput>;
	departmentGet: z.output<typeof department_getOutput>;
	departmentUpdate: z.output<typeof department_updateOutput>;
	depositCreate: z.output<typeof deposit_createOutput>;
	depositDelete: z.output<typeof deposit_deleteOutput>;
	depositList: z.output<typeof deposit_listOutput>;
	depositGet: z.output<typeof deposit_getOutput>;
	depositUpdate: z.output<typeof deposit_updateOutput>;
	depositSparseUpdate: z.output<typeof deposit_sparseUpdateOutput>;
	employeeCreate: z.output<typeof employee_createOutput>;
	employeeList: z.output<typeof employee_listOutput>;
	employeeGet: z.output<typeof employee_getOutput>;
	employeeUpdate: z.output<typeof employee_updateOutput>;
	estimateCreate: z.output<typeof estimate_createOutput>;
	estimateDelete: z.output<typeof estimate_deleteOutput>;
	estimateGetPdf: z.output<typeof estimate_getPdfOutput>;
	estimateList: z.output<typeof estimate_listOutput>;
	estimateGet: z.output<typeof estimate_getOutput>;
	estimateSend: z.output<typeof estimate_sendOutput>;
	estimateSparseUpdate: z.output<typeof estimate_sparseUpdateOutput>;
	estimateUpdate: z.output<typeof estimate_updateOutput>;
	exchangerateGet: z.output<typeof exchangerate_getOutput>;
	exchangerateList: z.output<typeof exchangerate_listOutput>;
	exchangerateUpdate: z.output<typeof exchangerate_updateOutput>;
	generalLedgerList: z.output<typeof generalLedger_listOutput>;
	inventoryAdjustmentCreate: z.output<typeof inventoryAdjustment_createOutput>;
	inventoryAdjustmentDelete: z.output<typeof inventoryAdjustment_deleteOutput>;
	inventoryAdjustmentGet: z.output<typeof inventoryAdjustment_getOutput>;
	inventoryAdjustmentSparseUpdate: z.output<
		typeof inventoryAdjustment_sparseUpdateOutput
	>;
	inventoryValuationDetailList: z.output<
		typeof inventoryValuationDetail_listOutput
	>;
	inventoryValuationSummaryList: z.output<
		typeof inventoryValuationSummary_listOutput
	>;
	invoiceCreate: z.output<typeof invoice_createOutput>;
	invoiceDelete: z.output<typeof invoice_deleteOutput>;
	invoiceVoid: z.output<typeof invoice_voidOutput>;
	invoiceGetPdf: z.output<typeof invoice_getPdfOutput>;
	invoiceList: z.output<typeof invoice_listOutput>;
	invoiceGet: z.output<typeof invoice_getOutput>;
	invoiceSend: z.output<typeof invoice_sendOutput>;
	invoiceSparseUpdate: z.output<typeof invoice_sparseUpdateOutput>;
	invoiceUpdate: z.output<typeof invoice_updateOutput>;
	itemCreate: z.output<typeof item_createOutput>;
	itemCreateCategory: z.output<typeof item_createCategoryOutput>;
	itemListBundles: z.output<typeof item_listBundlesOutput>;
	itemListCategories: z.output<typeof item_listCategoriesOutput>;
	itemListItems: z.output<typeof item_listItemsOutput>;
	itemGetBundle: z.output<typeof item_getBundleOutput>;
	itemGetCategory: z.output<typeof item_getCategoryOutput>;
	itemGetItem: z.output<typeof item_getItemOutput>;
	itemUpdate: z.output<typeof item_updateOutput>;
	itemUpdateCategory: z.output<typeof item_updateCategoryOutput>;
	journalEntryCreate: z.output<typeof journalEntry_createOutput>;
	journalEntryDelete: z.output<typeof journalEntry_deleteOutput>;
	journalEntryList: z.output<typeof journalEntry_listOutput>;
	journalEntryGet: z.output<typeof journalEntry_getOutput>;
	journalEntryUpdate: z.output<typeof journalEntry_updateOutput>;
	journalEntrySparseUpdate: z.output<typeof journalEntry_sparseUpdateOutput>;
	journalReportList: z.output<typeof journalReport_listOutput>;
	paymentCreate: z.output<typeof payment_createOutput>;
	paymentDelete: z.output<typeof payment_deleteOutput>;
	paymentVoid: z.output<typeof payment_voidOutput>;
	paymentGetPdf: z.output<typeof payment_getPdfOutput>;
	paymentList: z.output<typeof payment_listOutput>;
	paymentGet: z.output<typeof payment_getOutput>;
	paymentSend: z.output<typeof payment_sendOutput>;
	paymentUpdate: z.output<typeof payment_updateOutput>;
	paymentMethodCreate: z.output<typeof paymentMethod_createOutput>;
	paymentMethodList: z.output<typeof paymentMethod_listOutput>;
	paymentMethodGet: z.output<typeof paymentMethod_getOutput>;
	paymentMethodUpdate: z.output<typeof paymentMethod_updateOutput>;
	preferencesList: z.output<typeof preferences_listOutput>;
	preferencesGet: z.output<typeof preferences_getOutput>;
	preferencesUpdate: z.output<typeof preferences_updateOutput>;
	profitAndLossList: z.output<typeof profitAndLoss_listOutput>;
	profitAndLossDetailList: z.output<typeof profitAndLossDetail_listOutput>;
	purchaseCreate: z.output<typeof purchase_createOutput>;
	purchaseDelete: z.output<typeof purchase_deleteOutput>;
	purchaseList: z.output<typeof purchase_listOutput>;
	purchaseGet: z.output<typeof purchase_getOutput>;
	purchaseUpdate: z.output<typeof purchase_updateOutput>;
	purchaseOrderCreate: z.output<typeof purchaseOrder_createOutput>;
	purchaseOrderDelete: z.output<typeof purchaseOrder_deleteOutput>;
	purchaseOrderGetPdf: z.output<typeof purchaseOrder_getPdfOutput>;
	purchaseOrderList: z.output<typeof purchaseOrder_listOutput>;
	purchaseOrderGet: z.output<typeof purchaseOrder_getOutput>;
	purchaseOrderSend: z.output<typeof purchaseOrder_sendOutput>;
	purchaseOrderUpdate: z.output<typeof purchaseOrder_updateOutput>;
	recurringTransactionCreate: z.output<
		typeof recurringTransaction_createOutput
	>;
	recurringTransactionDelete: z.output<
		typeof recurringTransaction_deleteOutput
	>;
	recurringTransactionList: z.output<typeof recurringTransaction_listOutput>;
	recurringTransactionGet: z.output<typeof recurringTransaction_getOutput>;
	refundReceiptCreate: z.output<typeof refundReceipt_createOutput>;
	refundReceiptDelete: z.output<typeof refundReceipt_deleteOutput>;
	refundReceiptGetPdf: z.output<typeof refundReceipt_getPdfOutput>;
	refundReceiptList: z.output<typeof refundReceipt_listOutput>;
	refundReceiptGet: z.output<typeof refundReceipt_getOutput>;
	refundReceiptSend: z.output<typeof refundReceipt_sendOutput>;
	refundReceiptSparseUpdate: z.output<typeof refundReceipt_sparseUpdateOutput>;
	refundReceiptUpdate: z.output<typeof refundReceipt_updateOutput>;
	reimburseChargeList: z.output<typeof reimburseCharge_listOutput>;
	reimburseChargeGet: z.output<typeof reimburseCharge_getOutput>;
	salesByClassSummaryList: z.output<typeof salesByClassSummary_listOutput>;
	salesByCustomerList: z.output<typeof salesByCustomer_listOutput>;
	salesByDepartmentList: z.output<typeof salesByDepartment_listOutput>;
	salesByProductList: z.output<typeof salesByProduct_listOutput>;
	salesReceiptCreate: z.output<typeof salesReceipt_createOutput>;
	salesReceiptDelete: z.output<typeof salesReceipt_deleteOutput>;
	salesReceiptVoid: z.output<typeof salesReceipt_voidOutput>;
	salesReceiptGetPdf: z.output<typeof salesReceipt_getPdfOutput>;
	salesReceiptList: z.output<typeof salesReceipt_listOutput>;
	salesReceiptGet: z.output<typeof salesReceipt_getOutput>;
	salesReceiptSend: z.output<typeof salesReceipt_sendOutput>;
	salesReceiptUpdate: z.output<typeof salesReceipt_updateOutput>;
	salesReceiptSparseUpdate: z.output<typeof salesReceipt_sparseUpdateOutput>;
	taxAgencyCreate: z.output<typeof taxAgency_createOutput>;
	taxAgencyList: z.output<typeof taxAgency_listOutput>;
	taxAgencyGet: z.output<typeof taxAgency_getOutput>;
	taxClassificationGet: z.output<typeof taxClassification_getOutput>;
	taxClassificationListChildren: z.output<
		typeof taxClassification_listChildrenOutput
	>;
	taxClassificationList: z.output<typeof taxClassification_listOutput>;
	taxClassificationListByLevel: z.output<
		typeof taxClassification_listByLevelOutput
	>;
	taxCodeList: z.output<typeof taxCode_listOutput>;
	taxCodeGet: z.output<typeof taxCode_getOutput>;
	taxPaymentList: z.output<typeof taxPayment_listOutput>;
	taxPaymentGet: z.output<typeof taxPayment_getOutput>;
	taxRateList: z.output<typeof taxRate_listOutput>;
	taxRateGet: z.output<typeof taxRate_getOutput>;
	taxServiceCreate: z.output<typeof taxService_createOutput>;
	taxSummaryList: z.output<typeof taxSummary_listOutput>;
	termCreate: z.output<typeof term_createOutput>;
	termList: z.output<typeof term_listOutput>;
	termGet: z.output<typeof term_getOutput>;
	termUpdate: z.output<typeof term_updateOutput>;
	timeActivityCreate: z.output<typeof timeActivity_createOutput>;
	timeActivityDelete: z.output<typeof timeActivity_deleteOutput>;
	timeActivityList: z.output<typeof timeActivity_listOutput>;
	timeActivityGet: z.output<typeof timeActivity_getOutput>;
	timeActivityUpdate: z.output<typeof timeActivity_updateOutput>;
	transactionListList: z.output<typeof transactionList_listOutput>;
	transactionListByCustomerList: z.output<
		typeof transactionListByCustomer_listOutput
	>;
	transactionListByVendorList: z.output<
		typeof transactionListByVendor_listOutput
	>;
	transactionListWithSplitsList: z.output<
		typeof transactionListWithSplits_listOutput
	>;
	transferCreate: z.output<typeof transfer_createOutput>;
	transferDelete: z.output<typeof transfer_deleteOutput>;
	transferList: z.output<typeof transfer_listOutput>;
	transferGet: z.output<typeof transfer_getOutput>;
	transferSparseUpdate: z.output<typeof transfer_sparseUpdateOutput>;
	transferUpdate: z.output<typeof transfer_updateOutput>;
	trialBalanceList: z.output<typeof trialBalance_listOutput>;
	vendorCreate: z.output<typeof vendor_createOutput>;
	vendorList: z.output<typeof vendor_listOutput>;
	vendorGet: z.output<typeof vendor_getOutput>;
	vendorUpdate: z.output<typeof vendor_updateOutput>;
	vendorBalanceList: z.output<typeof vendorBalance_listOutput>;
	vendorBalanceDetailList: z.output<typeof vendorBalanceDetail_listOutput>;
	vendorCreditCreate: z.output<typeof vendorCredit_createOutput>;
	vendorCreditDelete: z.output<typeof vendorCredit_deleteOutput>;
	vendorCreditList: z.output<typeof vendorCredit_listOutput>;
	vendorCreditGet: z.output<typeof vendorCredit_getOutput>;
	vendorCreditUpdate: z.output<typeof vendorCredit_updateOutput>;
	vendorExpensesList: z.output<typeof vendorExpenses_listOutput>;
};

export type QuickBooksCatalogTestCase = {
	id: string;
	method: 'GET' | 'POST';
	expectedPath: string;
	expectedQuery: Record<string, string>;
	expectedBody?: object;
	requestKind: 'json' | 'form-data' | 'none';
	response:
		| { kind: 'json'; body: object }
		| { kind: 'text'; body: string }
		| { kind: 'binary'; bytes: number[] };
	expectedResult: object | string;
	input: object;
	inputSchema: z.ZodType;
	outputSchema: z.ZodType;
	invoke: (ctx: QuickBooksCatalogContext) => Promise<object | string>;
};
export const QuickBooksCatalogTestCases: QuickBooksCatalogTestCase[] = [
	{
		id: 'apAgingDetail.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/AgedPayableDetail',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: apAgingDetail_listInput,
		outputSchema: apAgingDetail_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['apAgingDetail']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'apAgingSummary.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/AgedPayables',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: apAgingSummary_listInput,
		outputSchema: apAgingSummary_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['apAgingSummary']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'arAgingDetail.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/AgedReceivableDetail',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: arAgingDetail_listInput,
		outputSchema: arAgingDetail_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['arAgingDetail']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'arAgingSummary.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/AgedReceivables',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: arAgingSummary_listInput,
		outputSchema: arAgingSummary_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['arAgingSummary']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'accounts.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/account',
		expectedQuery: {},
		expectedBody: { Id: '35', Name: 'sample', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Account: { Id: '1', Name: 'sample' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Account: { Id: '1', Name: 'sample' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Id: '35', Name: 'sample', SyncToken: '0' },
		},
		inputSchema: accounts_updateInput,
		outputSchema: accounts_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['accounts']['update'](ctx, {
				realmId: '12345678',
				body: { Id: '35', Name: 'sample', SyncToken: '0' },
			}),
	},
	{
		id: 'accountListDetail.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/AccountList',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: accountListDetail_listInput,
		outputSchema: accountListDetail_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['accountListDetail']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'attachable.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/attachable',
		expectedQuery: {},
		expectedBody: {},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Attachable: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Attachable: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: {} },
		inputSchema: attachable_createInput,
		outputSchema: attachable_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['attachable']['create'](ctx, {
				realmId: '12345678',
				body: {},
			}),
	},
	{
		id: 'attachable.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/attachable',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Attachable: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Attachable: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: attachable_deleteInput,
		outputSchema: attachable_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['attachable']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'attachable.download',
		method: 'GET',
		expectedPath: '/v3/company/12345678/download/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'text',
			body: 'https://download.example.test/temporary-file',
		},
		expectedResult: 'https://download.example.test/temporary-file',
		input: { realmId: '12345678', attachableId: '35' },
		inputSchema: attachable_downloadInput,
		outputSchema: attachable_downloadOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['attachable']['download'](ctx, {
				realmId: '12345678',
				attachableId: '35',
			}),
	},
	{
		id: 'attachable.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Attachable' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Attachable: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Attachable: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: attachable_listInput,
		outputSchema: attachable_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['attachable']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'attachable.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/attachable/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { Attachable: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Attachable: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', attachableId: '35' },
		inputSchema: attachable_getInput,
		outputSchema: attachable_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['attachable']['get'](ctx, {
				realmId: '12345678',
				attachableId: '35',
			}),
	},
	{
		id: 'attachable.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/attachable',
		expectedQuery: {},
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Attachable: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Attachable: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: attachable_updateInput,
		outputSchema: attachable_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['attachable']['update'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'attachable.upload',
		method: 'POST',
		expectedPath: '/v3/company/12345678/upload',
		expectedQuery: {},
		requestKind: 'form-data',
		response: {
			kind: 'json',
			body: { Attachable: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Attachable: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: {
			realmId: '12345678',
			fileName: 'receipt.pdf',
			contentType: 'application/pdf',
			base64Content: 'JVBERg==',
			metadata: {},
		},
		inputSchema: attachable_uploadInput,
		outputSchema: attachable_uploadOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['attachable']['upload'](ctx, {
				realmId: '12345678',
				fileName: 'receipt.pdf',
				contentType: 'application/pdf',
				base64Content: 'JVBERg==',
				metadata: {},
			}),
	},
	{
		id: 'balanceSheet.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/BalanceSheet',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: balanceSheet_listInput,
		outputSchema: balanceSheet_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['balanceSheet']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'bill.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/bill',
		expectedQuery: {},
		expectedBody: { VendorRef: { value: 'sample' }, Line: [] },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Bill: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Bill: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { VendorRef: { value: 'sample' }, Line: [] },
		},
		inputSchema: bill_createInput,
		outputSchema: bill_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['bill']['create'](ctx, {
				realmId: '12345678',
				body: { VendorRef: { value: 'sample' }, Line: [] },
			}),
	},
	{
		id: 'bill.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/bill',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Bill: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Bill: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: bill_deleteInput,
		outputSchema: bill_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['bill']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'bill.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Bill' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Bill: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Bill: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: bill_listInput,
		outputSchema: bill_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['bill']['list'](ctx, { realmId: '12345678' }),
	},
	{
		id: 'bill.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/bill/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Bill: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Bill: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', billId: '35' },
		inputSchema: bill_getInput,
		outputSchema: bill_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['bill']['get'](ctx, {
				realmId: '12345678',
				billId: '35',
			}),
	},
	{
		id: 'bill.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/bill',
		expectedQuery: {},
		expectedBody: {
			VendorRef: { value: 'sample' },
			Line: [],
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Bill: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Bill: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				VendorRef: { value: 'sample' },
				Line: [],
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: bill_updateInput,
		outputSchema: bill_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['bill']['update'](ctx, {
				realmId: '12345678',
				body: {
					VendorRef: { value: 'sample' },
					Line: [],
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'billPayment.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/billpayment',
		expectedQuery: {},
		expectedBody: {
			VendorRef: { value: 'sample' },
			TotalAmt: 1,
			Line: [],
			PayType: 'Check',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				BillPayment: {
					VendorRef: { value: 'sample' },
					Line: [],
					TotalAmt: 1,
					PayType: 'Check',
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			BillPayment: {
				VendorRef: { value: 'sample' },
				Line: [],
				TotalAmt: 1,
				PayType: 'Check',
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				VendorRef: { value: 'sample' },
				TotalAmt: 1,
				Line: [],
				PayType: 'Check',
			},
		},
		inputSchema: billPayment_createInput,
		outputSchema: billPayment_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['billPayment']['create'](ctx, {
				realmId: '12345678',
				body: {
					VendorRef: { value: 'sample' },
					TotalAmt: 1,
					Line: [],
					PayType: 'Check',
				},
			}),
	},
	{
		id: 'billPayment.void',
		method: 'POST',
		expectedPath: '/v3/company/12345678/billpayment',
		expectedQuery: { operation: 'update', include: 'void' },
		expectedBody: { Id: '35', SyncToken: '0', sparse: true },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				BillPayment: {
					VendorRef: { value: 'sample' },
					Line: [],
					TotalAmt: 1,
					PayType: 'Check',
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			BillPayment: {
				VendorRef: { value: 'sample' },
				Line: [],
				TotalAmt: 1,
				PayType: 'Check',
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Id: '35', SyncToken: '0', sparse: true },
		},
		inputSchema: billPayment_voidInput,
		outputSchema: billPayment_voidOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['billPayment']['void'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0', sparse: true },
			}),
	},
	{
		id: 'billPayment.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/billpayment',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				BillPayment: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			BillPayment: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: billPayment_deleteInput,
		outputSchema: billPayment_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['billPayment']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'billPayment.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM BillPayment' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { BillPayment: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { BillPayment: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: billPayment_listInput,
		outputSchema: billPayment_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['billPayment']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'billPayment.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/billpayment/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				BillPayment: {
					VendorRef: { value: 'sample' },
					Line: [],
					TotalAmt: 1,
					PayType: 'Check',
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			BillPayment: {
				VendorRef: { value: 'sample' },
				Line: [],
				TotalAmt: 1,
				PayType: 'Check',
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', billpaymentId: '35' },
		inputSchema: billPayment_getInput,
		outputSchema: billPayment_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['billPayment']['get'](ctx, {
				realmId: '12345678',
				billpaymentId: '35',
			}),
	},
	{
		id: 'billPayment.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/billpayment',
		expectedQuery: {},
		expectedBody: {
			VendorRef: { value: 'sample' },
			Line: [],
			TotalAmt: 1,
			PayType: 'Check',
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				BillPayment: {
					VendorRef: { value: 'sample' },
					Line: [],
					TotalAmt: 1,
					PayType: 'Check',
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			BillPayment: {
				VendorRef: { value: 'sample' },
				Line: [],
				TotalAmt: 1,
				PayType: 'Check',
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				VendorRef: { value: 'sample' },
				Line: [],
				TotalAmt: 1,
				PayType: 'Check',
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: billPayment_updateInput,
		outputSchema: billPayment_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['billPayment']['update'](ctx, {
				realmId: '12345678',
				body: {
					VendorRef: { value: 'sample' },
					Line: [],
					TotalAmt: 1,
					PayType: 'Check',
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'budget.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/budget',
		expectedQuery: {},
		expectedBody: { EndDate: 'sample', StartDate: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Budget: { EndDate: 'sample', StartDate: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Budget: { EndDate: 'sample', StartDate: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { EndDate: 'sample', StartDate: 'sample' },
		},
		inputSchema: budget_createInput,
		outputSchema: budget_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['budget']['create'](ctx, {
				realmId: '12345678',
				body: { EndDate: 'sample', StartDate: 'sample' },
			}),
	},
	{
		id: 'budget.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/budget',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Budget: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Budget: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: budget_deleteInput,
		outputSchema: budget_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['budget']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'budget.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Budget' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Budget: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Budget: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: budget_listInput,
		outputSchema: budget_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['budget']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'budget.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/budget/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Budget: { EndDate: 'sample', StartDate: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Budget: { EndDate: 'sample', StartDate: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', budgetId: '35' },
		inputSchema: budget_getInput,
		outputSchema: budget_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['budget']['get'](ctx, {
				realmId: '12345678',
				budgetId: '35',
			}),
	},
	{
		id: 'budget.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/budget',
		expectedQuery: {},
		expectedBody: {
			EndDate: 'sample',
			StartDate: 'sample',
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Budget: { EndDate: 'sample', StartDate: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Budget: { EndDate: 'sample', StartDate: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				EndDate: 'sample',
				StartDate: 'sample',
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: budget_updateInput,
		outputSchema: budget_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['budget']['update'](ctx, {
				realmId: '12345678',
				body: {
					EndDate: 'sample',
					StartDate: 'sample',
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'cashFlow.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/CashFlow',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: cashFlow_listInput,
		outputSchema: cashFlow_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['cashFlow']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'changeOrder.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/changeorder',
		expectedQuery: {},
		expectedBody: {
			ProjectRef: { value: 'sample' },
			Line: {
				DetailType: 'PaymentLineDetail',
				SalesItemLineDetail: {},
				Amount: 1,
				Id: '1',
			},
			CustomerRef: { value: 'sample' },
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				ChangeOrder: {
					LinkedTxn: [],
					Line: [],
					ProjectRef: { value: 'sample' },
					CustomerRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			ChangeOrder: {
				LinkedTxn: [],
				Line: [],
				ProjectRef: { value: 'sample' },
				CustomerRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				ProjectRef: { value: 'sample' },
				Line: {
					DetailType: 'PaymentLineDetail',
					SalesItemLineDetail: {},
					Amount: 1,
					Id: '1',
				},
				CustomerRef: { value: 'sample' },
			},
		},
		inputSchema: changeOrder_createInput,
		outputSchema: changeOrder_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['changeOrder']['create'](ctx, {
				realmId: '12345678',
				body: {
					ProjectRef: { value: 'sample' },
					Line: {
						DetailType: 'PaymentLineDetail',
						SalesItemLineDetail: {},
						Amount: 1,
						Id: '1',
					},
					CustomerRef: { value: 'sample' },
				},
			}),
	},
	{
		id: 'changeOrder.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/changeorder',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				ChangeOrder: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			ChangeOrder: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: changeOrder_deleteInput,
		outputSchema: changeOrder_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['changeOrder']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'changeOrder.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/changeorder/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				ChangeOrder: {
					LinkedTxn: [],
					Line: [],
					ProjectRef: { value: 'sample' },
					CustomerRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			ChangeOrder: {
				LinkedTxn: [],
				Line: [],
				ProjectRef: { value: 'sample' },
				CustomerRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', changeorderId: '35' },
		inputSchema: changeOrder_getInput,
		outputSchema: changeOrder_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['changeOrder']['get'](ctx, {
				realmId: '12345678',
				changeorderId: '35',
			}),
	},
	{
		id: 'changeOrder.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/changeorder',
		expectedQuery: {},
		expectedBody: {
			LinkedTxn: [],
			Line: [],
			ProjectRef: { value: 'sample' },
			CustomerRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				ChangeOrder: {
					LinkedTxn: [],
					Line: [],
					ProjectRef: { value: 'sample' },
					CustomerRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			ChangeOrder: {
				LinkedTxn: [],
				Line: [],
				ProjectRef: { value: 'sample' },
				CustomerRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				LinkedTxn: [],
				Line: [],
				ProjectRef: { value: 'sample' },
				CustomerRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: changeOrder_updateInput,
		outputSchema: changeOrder_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['changeOrder']['update'](ctx, {
				realmId: '12345678',
				body: {
					LinkedTxn: [],
					Line: [],
					ProjectRef: { value: 'sample' },
					CustomerRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'class.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/class',
		expectedQuery: {},
		expectedBody: { Name: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Class: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Class: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Name: 'sample' } },
		inputSchema: class_createInput,
		outputSchema: class_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['class']['create'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample' },
			}),
	},
	{
		id: 'class.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Class' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Class: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Class: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: class_listInput,
		outputSchema: class_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['class']['list'](ctx, { realmId: '12345678' }),
	},
	{
		id: 'class.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/class/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Class: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Class: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', classId: '35' },
		inputSchema: class_getInput,
		outputSchema: class_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['class']['get'](ctx, {
				realmId: '12345678',
				classId: '35',
			}),
	},
	{
		id: 'class.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/class',
		expectedQuery: {},
		expectedBody: { Name: 'sample', Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Class: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Class: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Name: 'sample', Id: '35', SyncToken: '0' },
		},
		inputSchema: class_updateInput,
		outputSchema: class_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['class']['update'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample', Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'companyCurrency.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/companycurrency',
		expectedQuery: {},
		expectedBody: { Code: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				CompanyCurrency: { Code: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CompanyCurrency: { Code: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Code: 'sample' } },
		inputSchema: companyCurrency_createInput,
		outputSchema: companyCurrency_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['companyCurrency']['create'](ctx, {
				realmId: '12345678',
				body: { Code: 'sample' },
			}),
	},
	{
		id: 'companyCurrency.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM CompanyCurrency' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { CompanyCurrency: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { CompanyCurrency: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: companyCurrency_listInput,
		outputSchema: companyCurrency_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['companyCurrency']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'companyCurrency.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/companycurrency/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				CompanyCurrency: { Code: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CompanyCurrency: { Code: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', companycurrencyId: '35' },
		inputSchema: companyCurrency_getInput,
		outputSchema: companyCurrency_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['companyCurrency']['get'](ctx, {
				realmId: '12345678',
				companycurrencyId: '35',
			}),
	},
	{
		id: 'companyCurrency.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/companycurrency',
		expectedQuery: {},
		expectedBody: { Code: 'sample', Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				CompanyCurrency: { Code: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CompanyCurrency: { Code: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Code: 'sample', Id: '35', SyncToken: '0' },
		},
		inputSchema: companyCurrency_updateInput,
		outputSchema: companyCurrency_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['companyCurrency']['update'](ctx, {
				realmId: '12345678',
				body: { Code: 'sample', Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'company.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/companyinfo',
		expectedQuery: {},
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { CompanyInfo: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { CompanyInfo: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: company_updateInput,
		outputSchema: company_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['company']['update'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'company.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/companyinfo',
		expectedQuery: {},
		expectedBody: { Id: '35', SyncToken: '0', sparse: true },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { CompanyInfo: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { CompanyInfo: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: {
			realmId: '12345678',
			body: { Id: '35', SyncToken: '0', sparse: true },
		},
		inputSchema: company_sparseUpdateInput,
		outputSchema: company_sparseUpdateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['company']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0', sparse: true },
			}),
	},
	{
		id: 'creditCardPayment.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/creditcardpayment',
		expectedQuery: {},
		expectedBody: {
			TxnDate: 'sample',
			Amount: 1,
			BankAccountRef: { value: 'sample' },
			CreditCardAccountRef: { value: 'sample' },
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				CreditCardPayment: {
					CreditCardAccountRef: { value: 'sample' },
					Amount: 1,
					BankAccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditCardPayment: {
				CreditCardAccountRef: { value: 'sample' },
				Amount: 1,
				BankAccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				TxnDate: 'sample',
				Amount: 1,
				BankAccountRef: { value: 'sample' },
				CreditCardAccountRef: { value: 'sample' },
			},
		},
		inputSchema: creditCardPayment_createInput,
		outputSchema: creditCardPayment_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditCardPayment']['create'](ctx, {
				realmId: '12345678',
				body: {
					TxnDate: 'sample',
					Amount: 1,
					BankAccountRef: { value: 'sample' },
					CreditCardAccountRef: { value: 'sample' },
				},
			}),
	},
	{
		id: 'creditCardPayment.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/creditcardpayment',
		expectedQuery: { operation: 'delete' },
		expectedBody: {
			CreditCardAccountRef: { value: 'sample' },
			Amount: 1,
			BankAccountRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				CreditCardPayment: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditCardPayment: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				CreditCardAccountRef: { value: 'sample' },
				Amount: 1,
				BankAccountRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: creditCardPayment_deleteInput,
		outputSchema: creditCardPayment_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditCardPayment']['delete'](ctx, {
				realmId: '12345678',
				body: {
					CreditCardAccountRef: { value: 'sample' },
					Amount: 1,
					BankAccountRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'creditCardPayment.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM CreditCardPayment' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { CreditCardPayment: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { CreditCardPayment: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: creditCardPayment_listInput,
		outputSchema: creditCardPayment_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditCardPayment']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'creditCardPayment.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/creditcardpayment/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				CreditCardPayment: {
					CreditCardAccountRef: { value: 'sample' },
					Amount: 1,
					BankAccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditCardPayment: {
				CreditCardAccountRef: { value: 'sample' },
				Amount: 1,
				BankAccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', creditcardpaymentId: '35' },
		inputSchema: creditCardPayment_getInput,
		outputSchema: creditCardPayment_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditCardPayment']['get'](ctx, {
				realmId: '12345678',
				creditcardpaymentId: '35',
			}),
	},
	{
		id: 'creditCardPayment.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/creditcardpayment',
		expectedQuery: {},
		expectedBody: {
			TxnDate: 'sample',
			Amount: 1,
			BankAccountRef: { value: 'sample' },
			CreditCardAccountRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				CreditCardPayment: {
					CreditCardAccountRef: { value: 'sample' },
					Amount: 1,
					BankAccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditCardPayment: {
				CreditCardAccountRef: { value: 'sample' },
				Amount: 1,
				BankAccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				TxnDate: 'sample',
				Amount: 1,
				BankAccountRef: { value: 'sample' },
				CreditCardAccountRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: creditCardPayment_updateInput,
		outputSchema: creditCardPayment_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditCardPayment']['update'](ctx, {
				realmId: '12345678',
				body: {
					TxnDate: 'sample',
					Amount: 1,
					BankAccountRef: { value: 'sample' },
					CreditCardAccountRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'creditCardPayment.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/creditcardpayment',
		expectedQuery: {},
		expectedBody: {
			TxnDate: 'sample',
			Amount: 1,
			BankAccountRef: { value: 'sample' },
			CreditCardAccountRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
			sparse: true,
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				CreditCardPayment: {
					CreditCardAccountRef: { value: 'sample' },
					Amount: 1,
					BankAccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditCardPayment: {
				CreditCardAccountRef: { value: 'sample' },
				Amount: 1,
				BankAccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				TxnDate: 'sample',
				Amount: 1,
				BankAccountRef: { value: 'sample' },
				CreditCardAccountRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
				sparse: true,
			},
		},
		inputSchema: creditCardPayment_sparseUpdateInput,
		outputSchema: creditCardPayment_sparseUpdateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditCardPayment']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: {
					TxnDate: 'sample',
					Amount: 1,
					BankAccountRef: { value: 'sample' },
					CreditCardAccountRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
					sparse: true,
				},
			}),
	},
	{
		id: 'creditMemo.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/creditmemo',
		expectedQuery: {},
		expectedBody: {
			Line: {
				DetailType: 'PaymentLineDetail',
				SalesItemLineDetail: {},
				Amount: 1,
				Id: '1',
			},
			CustomerRef: { value: 'sample' },
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				CreditMemo: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditMemo: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Line: {
					DetailType: 'PaymentLineDetail',
					SalesItemLineDetail: {},
					Amount: 1,
					Id: '1',
				},
				CustomerRef: { value: 'sample' },
			},
		},
		inputSchema: creditMemo_createInput,
		outputSchema: creditMemo_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditMemo']['create'](ctx, {
				realmId: '12345678',
				body: {
					Line: {
						DetailType: 'PaymentLineDetail',
						SalesItemLineDetail: {},
						Amount: 1,
						Id: '1',
					},
					CustomerRef: { value: 'sample' },
				},
			}),
	},
	{
		id: 'creditMemo.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/creditmemo',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				CreditMemo: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditMemo: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: creditMemo_deleteInput,
		outputSchema: creditMemo_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditMemo']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'creditMemo.getPdf',
		method: 'GET',
		expectedPath: '/v3/company/12345678/creditmemo/35/pdf',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'binary', bytes: [37, 80, 68, 70] },
		expectedResult: {
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERg==',
			sizeBytes: 4,
		},
		input: { realmId: '12345678', creditmemoId: '35' },
		inputSchema: creditMemo_getPdfInput,
		outputSchema: creditMemo_getPdfOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditMemo']['getPdf'](ctx, {
				realmId: '12345678',
				creditmemoId: '35',
			}),
	},
	{
		id: 'creditMemo.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM CreditMemo' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { CreditMemo: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { CreditMemo: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: creditMemo_listInput,
		outputSchema: creditMemo_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditMemo']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'creditMemo.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/creditmemo/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				CreditMemo: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditMemo: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', creditmemoId: '35' },
		inputSchema: creditMemo_getInput,
		outputSchema: creditMemo_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditMemo']['get'](ctx, {
				realmId: '12345678',
				creditmemoId: '35',
			}),
	},
	{
		id: 'creditMemo.send',
		method: 'POST',
		expectedPath: '/v3/company/12345678/creditmemo/35/send',
		expectedQuery: { sendTo: 'billing@example.test' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				CreditMemo: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditMemo: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			creditmemoId: '35',
			sendTo: 'billing@example.test',
		},
		inputSchema: creditMemo_sendInput,
		outputSchema: creditMemo_sendOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditMemo']['send'](ctx, {
				realmId: '12345678',
				creditmemoId: '35',
				sendTo: 'billing@example.test',
			}),
	},
	{
		id: 'creditMemo.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/creditmemo',
		expectedQuery: {},
		expectedBody: {
			Line: [],
			CustomerRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				CreditMemo: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			CreditMemo: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Line: [],
				CustomerRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: creditMemo_updateInput,
		outputSchema: creditMemo_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['creditMemo']['update'](ctx, {
				realmId: '12345678',
				body: {
					Line: [],
					CustomerRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'customer.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/customer',
		expectedQuery: {},
		expectedBody: {},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Customer: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Customer: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: {} },
		inputSchema: customer_createInput,
		outputSchema: customer_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customer']['create'](ctx, {
				realmId: '12345678',
				body: {},
			}),
	},
	{
		id: 'customer.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Customer' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Customer: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Customer: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: customer_listInput,
		outputSchema: customer_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customer']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'customer.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/customer/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { Customer: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Customer: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', customerId: '35' },
		inputSchema: customer_getInput,
		outputSchema: customer_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customer']['get'](ctx, {
				realmId: '12345678',
				customerId: '35',
			}),
	},
	{
		id: 'customer.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/customer',
		expectedQuery: {},
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Customer: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Customer: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: customer_updateInput,
		outputSchema: customer_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customer']['update'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'customer.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/customer',
		expectedQuery: {},
		expectedBody: { Id: '35', SyncToken: '0', sparse: true },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Customer: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Customer: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: {
			realmId: '12345678',
			body: { Id: '35', SyncToken: '0', sparse: true },
		},
		inputSchema: customer_sparseUpdateInput,
		outputSchema: customer_sparseUpdateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customer']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0', sparse: true },
			}),
	},
	{
		id: 'customerBalance.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/CustomerBalance',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: customerBalance_listInput,
		outputSchema: customerBalance_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customerBalance']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'customerBalanceDetail.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/CustomerBalanceDetail',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: customerBalanceDetail_listInput,
		outputSchema: customerBalanceDetail_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customerBalanceDetail']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'customerIncome.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/CustomerIncome',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: customerIncome_listInput,
		outputSchema: customerIncome_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customerIncome']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'customerType.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM CustomerType' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { CustomerType: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { CustomerType: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: customerType_listInput,
		outputSchema: customerType_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customerType']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'customerType.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/customertype/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { CustomerType: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { CustomerType: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', id: '35' },
		inputSchema: customerType_getInput,
		outputSchema: customerType_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['customerType']['get'](ctx, {
				realmId: '12345678',
				id: '35',
			}),
	},
	{
		id: 'department.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/department',
		expectedQuery: {},
		expectedBody: { Name: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Department: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Department: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Name: 'sample' } },
		inputSchema: department_createInput,
		outputSchema: department_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['department']['create'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample' },
			}),
	},
	{
		id: 'department.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Department' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Department: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Department: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: department_listInput,
		outputSchema: department_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['department']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'department.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/department/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Department: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Department: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', departmentId: '35' },
		inputSchema: department_getInput,
		outputSchema: department_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['department']['get'](ctx, {
				realmId: '12345678',
				departmentId: '35',
			}),
	},
	{
		id: 'department.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/department',
		expectedQuery: {},
		expectedBody: { Name: 'sample', Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Department: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Department: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Name: 'sample', Id: '35', SyncToken: '0' },
		},
		inputSchema: department_updateInput,
		outputSchema: department_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['department']['update'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample', Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'deposit.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/deposit',
		expectedQuery: {},
		expectedBody: {},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Deposit: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Deposit: { DepositToAccountRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: {} },
		inputSchema: deposit_createInput,
		outputSchema: deposit_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['deposit']['create'](ctx, {
				realmId: '12345678',
				body: {},
			}),
	},
	{
		id: 'deposit.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/deposit',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Deposit: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Deposit: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: deposit_deleteInput,
		outputSchema: deposit_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['deposit']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'deposit.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Deposit' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Deposit: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Deposit: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: deposit_listInput,
		outputSchema: deposit_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['deposit']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'deposit.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/deposit/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Deposit: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Deposit: { DepositToAccountRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', depositId: '35' },
		inputSchema: deposit_getInput,
		outputSchema: deposit_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['deposit']['get'](ctx, {
				realmId: '12345678',
				depositId: '35',
			}),
	},
	{
		id: 'deposit.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/deposit',
		expectedQuery: {},
		expectedBody: {
			DepositToAccountRef: { value: 'sample' },
			Line: [],
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Deposit: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Deposit: { DepositToAccountRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				DepositToAccountRef: { value: 'sample' },
				Line: [],
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: deposit_updateInput,
		outputSchema: deposit_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['deposit']['update'](ctx, {
				realmId: '12345678',
				body: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'deposit.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/deposit',
		expectedQuery: {},
		expectedBody: {
			DepositToAccountRef: { value: 'sample' },
			Line: [],
			Id: '35',
			SyncToken: '0',
			sparse: true,
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Deposit: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Deposit: { DepositToAccountRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				DepositToAccountRef: { value: 'sample' },
				Line: [],
				Id: '35',
				SyncToken: '0',
				sparse: true,
			},
		},
		inputSchema: deposit_sparseUpdateInput,
		outputSchema: deposit_sparseUpdateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['deposit']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '35',
					SyncToken: '0',
					sparse: true,
				},
			}),
	},
	{
		id: 'employee.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/employee',
		expectedQuery: {},
		expectedBody: {},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Employee: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Employee: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: {} },
		inputSchema: employee_createInput,
		outputSchema: employee_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['employee']['create'](ctx, {
				realmId: '12345678',
				body: {},
			}),
	},
	{
		id: 'employee.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Employee' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Employee: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Employee: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: employee_listInput,
		outputSchema: employee_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['employee']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'employee.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/employee/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { Employee: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Employee: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', employeeId: '35' },
		inputSchema: employee_getInput,
		outputSchema: employee_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['employee']['get'](ctx, {
				realmId: '12345678',
				employeeId: '35',
			}),
	},
	{
		id: 'employee.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/employee',
		expectedQuery: {},
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Employee: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Employee: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: employee_updateInput,
		outputSchema: employee_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['employee']['update'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'estimate.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/estimate',
		expectedQuery: {},
		expectedBody: {
			Line: {
				DetailType: 'PaymentLineDetail',
				SalesItemLineDetail: {},
				Amount: 1,
				Id: '1',
			},
			CustomerRef: { value: 'sample' },
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Line: {
					DetailType: 'PaymentLineDetail',
					SalesItemLineDetail: {},
					Amount: 1,
					Id: '1',
				},
				CustomerRef: { value: 'sample' },
			},
		},
		inputSchema: estimate_createInput,
		outputSchema: estimate_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['estimate']['create'](ctx, {
				realmId: '12345678',
				body: {
					Line: {
						DetailType: 'PaymentLineDetail',
						SalesItemLineDetail: {},
						Amount: 1,
						Id: '1',
					},
					CustomerRef: { value: 'sample' },
				},
			}),
	},
	{
		id: 'estimate.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/estimate',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Estimate: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Estimate: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: estimate_deleteInput,
		outputSchema: estimate_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['estimate']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'estimate.getPdf',
		method: 'GET',
		expectedPath: '/v3/company/12345678/estimate/35/pdf',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'binary', bytes: [37, 80, 68, 70] },
		expectedResult: {
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERg==',
			sizeBytes: 4,
		},
		input: { realmId: '12345678', estimateId: '35' },
		inputSchema: estimate_getPdfInput,
		outputSchema: estimate_getPdfOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['estimate']['getPdf'](ctx, {
				realmId: '12345678',
				estimateId: '35',
			}),
	},
	{
		id: 'estimate.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Estimate' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Estimate: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Estimate: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: estimate_listInput,
		outputSchema: estimate_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['estimate']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'estimate.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/estimate/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', estimateId: '35' },
		inputSchema: estimate_getInput,
		outputSchema: estimate_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['estimate']['get'](ctx, {
				realmId: '12345678',
				estimateId: '35',
			}),
	},
	{
		id: 'estimate.send',
		method: 'POST',
		expectedPath: '/v3/company/12345678/estimate/35/send',
		expectedQuery: { sendTo: 'billing@example.test' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			estimateId: '35',
			sendTo: 'billing@example.test',
		},
		inputSchema: estimate_sendInput,
		outputSchema: estimate_sendOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['estimate']['send'](ctx, {
				realmId: '12345678',
				estimateId: '35',
				sendTo: 'billing@example.test',
			}),
	},
	{
		id: 'estimate.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/estimate',
		expectedQuery: {},
		expectedBody: {
			CustomerRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
			sparse: true,
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				CustomerRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
				sparse: true,
			},
		},
		inputSchema: estimate_sparseUpdateInput,
		outputSchema: estimate_sparseUpdateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['estimate']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: {
					CustomerRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
					sparse: true,
				},
			}),
	},
	{
		id: 'estimate.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/estimate',
		expectedQuery: {},
		expectedBody: {
			CustomerRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Estimate: { CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { CustomerRef: { value: 'sample' }, Id: '35', SyncToken: '0' },
		},
		inputSchema: estimate_updateInput,
		outputSchema: estimate_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['estimate']['update'](ctx, {
				realmId: '12345678',
				body: { CustomerRef: { value: 'sample' }, Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'exchangerate.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/exchangerate',
		expectedQuery: { sourcecurrencycode: 'USD', asofdate: '2026-11-18' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { Exchangerate: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { Exchangerate: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', currencyCode: 'USD', asOfDate: '2026-11-18' },
		inputSchema: exchangerate_getInput,
		outputSchema: exchangerate_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['exchangerate']['get'](ctx, {
				realmId: '12345678',
				currencyCode: 'USD',
				asOfDate: '2026-11-18',
			}),
	},
	{
		id: 'exchangerate.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Exchangerate' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { Exchangerate: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { Exchangerate: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: exchangerate_listInput,
		outputSchema: exchangerate_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['exchangerate']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'exchangerate.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/exchangerate',
		expectedQuery: {},
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Exchangerate: {}, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Exchangerate: {}, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: exchangerate_updateInput,
		outputSchema: exchangerate_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['exchangerate']['update'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'generalLedger.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/GeneralLedger',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: generalLedger_listInput,
		outputSchema: generalLedger_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['generalLedger']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'inventoryAdjustment.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/inventoryadjustment',
		expectedQuery: {},
		expectedBody: {
			DocNumber: 'sample',
			AdjustAccountRef: { value: 'sample' },
			Line: [],
			TxnDate: 'sample',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				InventoryAdjustment: {
					TxnDate: 'sample',
					Line: [],
					AdjustAccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			InventoryAdjustment: {
				TxnDate: 'sample',
				Line: [],
				AdjustAccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				DocNumber: 'sample',
				AdjustAccountRef: { value: 'sample' },
				Line: [],
				TxnDate: 'sample',
			},
		},
		inputSchema: inventoryAdjustment_createInput,
		outputSchema: inventoryAdjustment_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['inventoryAdjustment']['create'](ctx, {
				realmId: '12345678',
				body: {
					DocNumber: 'sample',
					AdjustAccountRef: { value: 'sample' },
					Line: [],
					TxnDate: 'sample',
				},
			}),
	},
	{
		id: 'inventoryAdjustment.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/inventoryadjustment',
		expectedQuery: { operation: 'delete' },
		expectedBody: { SyncToken: '0', id: '1', Id: '35' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				InventoryAdjustment: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			InventoryAdjustment: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { SyncToken: '0', id: '1', Id: '35' } },
		inputSchema: inventoryAdjustment_deleteInput,
		outputSchema: inventoryAdjustment_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['inventoryAdjustment']['delete'](ctx, {
				realmId: '12345678',
				body: { SyncToken: '0', id: '1', Id: '35' },
			}),
	},
	{
		id: 'inventoryAdjustment.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/inventoryadjustment/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				InventoryAdjustment: {
					TxnDate: 'sample',
					Line: [],
					AdjustAccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			InventoryAdjustment: {
				TxnDate: 'sample',
				Line: [],
				AdjustAccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', inventoryadjustmentId: '35' },
		inputSchema: inventoryAdjustment_getInput,
		outputSchema: inventoryAdjustment_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['inventoryAdjustment']['get'](ctx, {
				realmId: '12345678',
				inventoryadjustmentId: '35',
			}),
	},
	{
		id: 'inventoryAdjustment.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/inventoryadjustment',
		expectedQuery: {},
		expectedBody: {
			AdjustAccountRef: { value: 'sample' },
			Line: [],
			TxnDate: 'sample',
			Id: '35',
			SyncToken: '0',
			sparse: true,
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				InventoryAdjustment: {
					TxnDate: 'sample',
					Line: [],
					AdjustAccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			InventoryAdjustment: {
				TxnDate: 'sample',
				Line: [],
				AdjustAccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				AdjustAccountRef: { value: 'sample' },
				Line: [],
				TxnDate: 'sample',
				Id: '35',
				SyncToken: '0',
				sparse: true,
			},
		},
		inputSchema: inventoryAdjustment_sparseUpdateInput,
		outputSchema: inventoryAdjustment_sparseUpdateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['inventoryAdjustment']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: {
					AdjustAccountRef: { value: 'sample' },
					Line: [],
					TxnDate: 'sample',
					Id: '35',
					SyncToken: '0',
					sparse: true,
				},
			}),
	},
	{
		id: 'inventoryValuationDetail.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/InventoryValuationDetail',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: inventoryValuationDetail_listInput,
		outputSchema: inventoryValuationDetail_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['inventoryValuationDetail']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'inventoryValuationSummary.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/InventoryValuationSummary',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: inventoryValuationSummary_listInput,
		outputSchema: inventoryValuationSummary_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['inventoryValuationSummary']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'invoice.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/invoice',
		expectedQuery: {},
		expectedBody: { CustomerRef: { value: 'sample' }, Line: [] },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { CustomerRef: { value: 'sample' }, Line: [] },
		},
		inputSchema: invoice_createInput,
		outputSchema: invoice_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['invoice']['create'](ctx, {
				realmId: '12345678',
				body: { CustomerRef: { value: 'sample' }, Line: [] },
			}),
	},
	{
		id: 'invoice.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/invoice',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Invoice: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Invoice: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: invoice_deleteInput,
		outputSchema: invoice_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['invoice']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'invoice.void',
		method: 'POST',
		expectedPath: '/v3/company/12345678/invoice',
		expectedQuery: { operation: 'void' },
		expectedBody: { Id: '35', SyncToken: '0', sparse: true },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Id: '35', SyncToken: '0', sparse: true },
		},
		inputSchema: invoice_voidInput,
		outputSchema: invoice_voidOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['invoice']['void'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0', sparse: true },
			}),
	},
	{
		id: 'invoice.getPdf',
		method: 'GET',
		expectedPath: '/v3/company/12345678/invoice/35/pdf',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'binary', bytes: [37, 80, 68, 70] },
		expectedResult: {
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERg==',
			sizeBytes: 4,
		},
		input: { realmId: '12345678', invoiceId: '35' },
		inputSchema: invoice_getPdfInput,
		outputSchema: invoice_getPdfOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['invoice']['getPdf'](ctx, {
				realmId: '12345678',
				invoiceId: '35',
			}),
	},
	{
		id: 'invoice.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Invoice' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Invoice: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Invoice: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: invoice_listInput,
		outputSchema: invoice_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['invoice']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'invoice.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/invoice/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', invoiceId: '35' },
		inputSchema: invoice_getInput,
		outputSchema: invoice_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['invoice']['get'](ctx, {
				realmId: '12345678',
				invoiceId: '35',
			}),
	},
	{
		id: 'invoice.send',
		method: 'POST',
		expectedPath: '/v3/company/12345678/invoice/35/send',
		expectedQuery: { sendTo: 'billing@example.test' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			invoiceId: '35',
			sendTo: 'billing@example.test',
		},
		inputSchema: invoice_sendInput,
		outputSchema: invoice_sendOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['invoice']['send'](ctx, {
				realmId: '12345678',
				invoiceId: '35',
				sendTo: 'billing@example.test',
			}),
	},
	{
		id: 'invoice.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/invoice',
		expectedQuery: {},
		expectedBody: {
			Line: [],
			CustomerRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
			sparse: true,
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Line: [],
				CustomerRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
				sparse: true,
			},
		},
		inputSchema: invoice_sparseUpdateInput,
		outputSchema: invoice_sparseUpdateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['invoice']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: {
					Line: [],
					CustomerRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
					sparse: true,
				},
			}),
	},
	{
		id: 'invoice.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/invoice',
		expectedQuery: {},
		expectedBody: {
			CustomerRef: { value: 'sample' },
			Line: [],
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Invoice: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				CustomerRef: { value: 'sample' },
				Line: [],
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: invoice_updateInput,
		outputSchema: invoice_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['invoice']['update'](ctx, {
				realmId: '12345678',
				body: {
					CustomerRef: { value: 'sample' },
					Line: [],
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'item.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/item',
		expectedQuery: {},
		expectedBody: { Name: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Item: { Name: 'sample', Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			Item: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Name: 'sample' } },
		inputSchema: item_createInput,
		outputSchema: item_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['create'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample' },
			}),
	},
	{
		id: 'item.createCategory',
		method: 'POST',
		expectedPath: '/v3/company/12345678/item',
		expectedQuery: {},
		expectedBody: { Type: 'sample', Name: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Item: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Item: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: { Type: 'sample', Name: 'sample' } },
		inputSchema: item_createCategoryInput,
		outputSchema: item_createCategoryOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['createCategory'](ctx, {
				realmId: '12345678',
				body: { Type: 'sample', Name: 'sample' },
			}),
	},
	{
		id: 'item.listBundles',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: {
			query:
				"SELECT * FROM Item WHERE Type = 'Group' STARTPOSITION 1 MAXRESULTS 10",
		},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Item: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Item: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', startPosition: 1, maxResults: 10 },
		inputSchema: item_listBundlesInput,
		outputSchema: item_listBundlesOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['listBundles'](ctx, {
				realmId: '12345678',
				startPosition: 1,
				maxResults: 10,
			}),
	},
	{
		id: 'item.listCategories',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: {
			query:
				"SELECT * FROM Item WHERE Type = 'Category' STARTPOSITION 1 MAXRESULTS 10",
		},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Item: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Item: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', startPosition: 1, maxResults: 10 },
		inputSchema: item_listCategoriesInput,
		outputSchema: item_listCategoriesOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['listCategories'](ctx, {
				realmId: '12345678',
				startPosition: 1,
				maxResults: 10,
			}),
	},
	{
		id: 'item.listItems',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: {
			query:
				"SELECT * FROM Item WHERE Type IN ('Inventory', 'NonInventory', 'Service') STARTPOSITION 1 MAXRESULTS 10",
		},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Item: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Item: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', startPosition: 1, maxResults: 10 },
		inputSchema: item_listItemsInput,
		outputSchema: item_listItemsOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['listItems'](ctx, {
				realmId: '12345678',
				startPosition: 1,
				maxResults: 10,
			}),
	},
	{
		id: 'item.getBundle',
		method: 'GET',
		expectedPath: '/v3/company/12345678/item/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { Item: { Name: 'sample', Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			Item: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', itemId: '35' },
		inputSchema: item_getBundleInput,
		outputSchema: item_getBundleOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['getBundle'](ctx, {
				realmId: '12345678',
				itemId: '35',
			}),
	},
	{
		id: 'item.getCategory',
		method: 'GET',
		expectedPath: '/v3/company/12345678/item/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { Item: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Item: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', itemId: '35' },
		inputSchema: item_getCategoryInput,
		outputSchema: item_getCategoryOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['getCategory'](ctx, {
				realmId: '12345678',
				itemId: '35',
			}),
	},
	{
		id: 'item.getItem',
		method: 'GET',
		expectedPath: '/v3/company/12345678/item/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { Item: { Name: 'sample', Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			Item: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', itemId: '35' },
		inputSchema: item_getItemInput,
		outputSchema: item_getItemOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['getItem'](ctx, {
				realmId: '12345678',
				itemId: '35',
			}),
	},
	{
		id: 'item.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/item',
		expectedQuery: {},
		expectedBody: { Name: 'sample', Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Item: { Name: 'sample', Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			Item: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Name: 'sample', Id: '35', SyncToken: '0' },
		},
		inputSchema: item_updateInput,
		outputSchema: item_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['update'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample', Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'item.updateCategory',
		method: 'POST',
		expectedPath: '/v3/company/12345678/item',
		expectedQuery: {},
		expectedBody: { Name: 'sample', Type: 'sample', Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Item: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Item: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: {
			realmId: '12345678',
			body: { Name: 'sample', Type: 'sample', Id: '35', SyncToken: '0' },
		},
		inputSchema: item_updateCategoryInput,
		outputSchema: item_updateCategoryOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['item']['updateCategory'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample', Type: 'sample', Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'journalEntry.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/journalentry',
		expectedQuery: {},
		expectedBody: { Line: [] },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				JournalEntry: { Id: '1', Line: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			JournalEntry: { Id: '1', Line: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Line: [] } },
		inputSchema: journalEntry_createInput,
		outputSchema: journalEntry_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['journalEntry']['create'](ctx, {
				realmId: '12345678',
				body: { Line: [] },
			}),
	},
	{
		id: 'journalEntry.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/journalentry',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				JournalEntry: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			JournalEntry: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: journalEntry_deleteInput,
		outputSchema: journalEntry_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['journalEntry']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'journalEntry.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM JournalEntry' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { JournalEntry: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { JournalEntry: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: journalEntry_listInput,
		outputSchema: journalEntry_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['journalEntry']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'journalEntry.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/journalentry/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				JournalEntry: { Id: '1', Line: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			JournalEntry: { Id: '1', Line: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', journalentryId: '35' },
		inputSchema: journalEntry_getInput,
		outputSchema: journalEntry_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['journalEntry']['get'](ctx, {
				realmId: '12345678',
				journalentryId: '35',
			}),
	},
	{
		id: 'journalEntry.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/journalentry',
		expectedQuery: {},
		expectedBody: { Id: '35', Line: [], SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				JournalEntry: { Id: '1', Line: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			JournalEntry: { Id: '1', Line: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Id: '35', Line: [], SyncToken: '0' },
		},
		inputSchema: journalEntry_updateInput,
		outputSchema: journalEntry_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['journalEntry']['update'](ctx, {
				realmId: '12345678',
				body: { Id: '35', Line: [], SyncToken: '0' },
			}),
	},
	{
		id: 'journalEntry.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/journalentry',
		expectedQuery: {},
		expectedBody: { Id: '35', Line: [], SyncToken: '0', sparse: true },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				JournalEntry: { Id: '1', Line: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			JournalEntry: { Id: '1', Line: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Id: '35', Line: [], SyncToken: '0', sparse: true },
		},
		inputSchema: journalEntry_sparseUpdateInput,
		outputSchema: journalEntry_sparseUpdateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['journalEntry']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: { Id: '35', Line: [], SyncToken: '0', sparse: true },
			}),
	},
	{
		id: 'journalReport.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/JournalReport',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: journalReport_listInput,
		outputSchema: journalReport_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['journalReport']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'payment.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/payment',
		expectedQuery: {},
		expectedBody: { TotalAmt: 1, CustomerRef: { value: 'sample' } },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { TotalAmt: 1, CustomerRef: { value: 'sample' } },
		},
		inputSchema: payment_createInput,
		outputSchema: payment_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['payment']['create'](ctx, {
				realmId: '12345678',
				body: { TotalAmt: 1, CustomerRef: { value: 'sample' } },
			}),
	},
	{
		id: 'payment.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/payment',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Payment: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Payment: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: payment_deleteInput,
		outputSchema: payment_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['payment']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'payment.void',
		method: 'POST',
		expectedPath: '/v3/company/12345678/payment',
		expectedQuery: { operation: 'update', include: 'void' },
		expectedBody: { Id: '35', SyncToken: '0', sparse: true },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Id: '35', SyncToken: '0', sparse: true },
		},
		inputSchema: payment_voidInput,
		outputSchema: payment_voidOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['payment']['void'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0', sparse: true },
			}),
	},
	{
		id: 'payment.getPdf',
		method: 'GET',
		expectedPath: '/v3/company/12345678/payment/35/pdf',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'binary', bytes: [37, 80, 68, 70] },
		expectedResult: {
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERg==',
			sizeBytes: 4,
		},
		input: { realmId: '12345678', paymentId: '35' },
		inputSchema: payment_getPdfInput,
		outputSchema: payment_getPdfOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['payment']['getPdf'](ctx, {
				realmId: '12345678',
				paymentId: '35',
			}),
	},
	{
		id: 'payment.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Payment' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Payment: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Payment: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: payment_listInput,
		outputSchema: payment_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['payment']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'payment.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/payment/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', paymentId: '35' },
		inputSchema: payment_getInput,
		outputSchema: payment_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['payment']['get'](ctx, {
				realmId: '12345678',
				paymentId: '35',
			}),
	},
	{
		id: 'payment.send',
		method: 'POST',
		expectedPath: '/v3/company/12345678/payment/35/send',
		expectedQuery: { sendTo: 'billing@example.test' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			paymentId: '35',
			sendTo: 'billing@example.test',
		},
		inputSchema: payment_sendInput,
		outputSchema: payment_sendOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['payment']['send'](ctx, {
				realmId: '12345678',
				paymentId: '35',
				sendTo: 'billing@example.test',
			}),
	},
	{
		id: 'payment.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/payment',
		expectedQuery: {},
		expectedBody: {
			TotalAmt: 1,
			CustomerRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Payment: { TotalAmt: 1, CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				TotalAmt: 1,
				CustomerRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: payment_updateInput,
		outputSchema: payment_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['payment']['update'](ctx, {
				realmId: '12345678',
				body: {
					TotalAmt: 1,
					CustomerRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'paymentMethod.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/paymentmethod',
		expectedQuery: {},
		expectedBody: { Name: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				PaymentMethod: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			PaymentMethod: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Name: 'sample' } },
		inputSchema: paymentMethod_createInput,
		outputSchema: paymentMethod_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['paymentMethod']['create'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample' },
			}),
	},
	{
		id: 'paymentMethod.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM PaymentMethod' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { PaymentMethod: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { PaymentMethod: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: paymentMethod_listInput,
		outputSchema: paymentMethod_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['paymentMethod']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'paymentMethod.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/paymentmethod/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				PaymentMethod: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			PaymentMethod: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', paymentmethodId: '35' },
		inputSchema: paymentMethod_getInput,
		outputSchema: paymentMethod_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['paymentMethod']['get'](ctx, {
				realmId: '12345678',
				paymentmethodId: '35',
			}),
	},
	{
		id: 'paymentMethod.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/paymentmethod',
		expectedQuery: {},
		expectedBody: { Name: 'sample', Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				PaymentMethod: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			PaymentMethod: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Name: 'sample', Id: '35', SyncToken: '0' },
		},
		inputSchema: paymentMethod_updateInput,
		outputSchema: paymentMethod_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['paymentMethod']['update'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample', Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'preferences.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Preferences' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { Preferences: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { Preferences: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: preferences_listInput,
		outputSchema: preferences_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['preferences']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'preferences.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/preferences',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { Preferences: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Preferences: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678' },
		inputSchema: preferences_getInput,
		outputSchema: preferences_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['preferences']['get'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'preferences.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/preferences',
		expectedQuery: {},
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Preferences: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Preferences: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: preferences_updateInput,
		outputSchema: preferences_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['preferences']['update'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'profitAndLoss.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/ProfitAndLoss',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: profitAndLoss_listInput,
		outputSchema: profitAndLoss_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['profitAndLoss']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'profitAndLossDetail.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/ProfitAndLossDetail',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: profitAndLossDetail_listInput,
		outputSchema: profitAndLossDetail_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['profitAndLossDetail']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'purchase.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/purchase',
		expectedQuery: {},
		expectedBody: {
			PaymentType: 'sample',
			AccountRef: { value: 'sample' },
			Line: [],
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Purchase: {
					Line: [],
					PaymentType: 'sample',
					AccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Purchase: {
				Line: [],
				PaymentType: 'sample',
				AccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				PaymentType: 'sample',
				AccountRef: { value: 'sample' },
				Line: [],
			},
		},
		inputSchema: purchase_createInput,
		outputSchema: purchase_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchase']['create'](ctx, {
				realmId: '12345678',
				body: {
					PaymentType: 'sample',
					AccountRef: { value: 'sample' },
					Line: [],
				},
			}),
	},
	{
		id: 'purchase.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/purchase',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Purchase: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Purchase: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: purchase_deleteInput,
		outputSchema: purchase_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchase']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'purchase.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Purchase' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Purchase: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Purchase: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: purchase_listInput,
		outputSchema: purchase_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchase']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'purchase.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/purchase/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Purchase: {
					Line: [],
					PaymentType: 'sample',
					AccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Purchase: {
				Line: [],
				PaymentType: 'sample',
				AccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', purchaseId: '35' },
		inputSchema: purchase_getInput,
		outputSchema: purchase_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchase']['get'](ctx, {
				realmId: '12345678',
				purchaseId: '35',
			}),
	},
	{
		id: 'purchase.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/purchase',
		expectedQuery: {},
		expectedBody: {
			Line: [],
			PaymentType: 'sample',
			AccountRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Purchase: {
					Line: [],
					PaymentType: 'sample',
					AccountRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Purchase: {
				Line: [],
				PaymentType: 'sample',
				AccountRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Line: [],
				PaymentType: 'sample',
				AccountRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: purchase_updateInput,
		outputSchema: purchase_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchase']['update'](ctx, {
				realmId: '12345678',
				body: {
					Line: [],
					PaymentType: 'sample',
					AccountRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'purchaseOrder.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/purchaseorder',
		expectedQuery: {},
		expectedBody: {
			APAccountRef: { value: 'sample' },
			VendorRef: { value: 'sample' },
			Line: [],
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				PurchaseOrder: {
					APAccountRef: { value: 'sample' },
					VendorRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			PurchaseOrder: {
				APAccountRef: { value: 'sample' },
				VendorRef: { value: 'sample' },
				Line: [],
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				APAccountRef: { value: 'sample' },
				VendorRef: { value: 'sample' },
				Line: [],
			},
		},
		inputSchema: purchaseOrder_createInput,
		outputSchema: purchaseOrder_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchaseOrder']['create'](ctx, {
				realmId: '12345678',
				body: {
					APAccountRef: { value: 'sample' },
					VendorRef: { value: 'sample' },
					Line: [],
				},
			}),
	},
	{
		id: 'purchaseOrder.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/purchaseorder',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				PurchaseOrder: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			PurchaseOrder: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: purchaseOrder_deleteInput,
		outputSchema: purchaseOrder_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchaseOrder']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'purchaseOrder.getPdf',
		method: 'GET',
		expectedPath: '/v3/company/12345678/purchaseorder/35/pdf',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'binary', bytes: [37, 80, 68, 70] },
		expectedResult: {
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERg==',
			sizeBytes: 4,
		},
		input: { realmId: '12345678', purchaseorderId: '35' },
		inputSchema: purchaseOrder_getPdfInput,
		outputSchema: purchaseOrder_getPdfOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchaseOrder']['getPdf'](ctx, {
				realmId: '12345678',
				purchaseorderId: '35',
			}),
	},
	{
		id: 'purchaseOrder.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM PurchaseOrder' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { PurchaseOrder: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { PurchaseOrder: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: purchaseOrder_listInput,
		outputSchema: purchaseOrder_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchaseOrder']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'purchaseOrder.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/purchaseorder/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				PurchaseOrder: {
					APAccountRef: { value: 'sample' },
					VendorRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			PurchaseOrder: {
				APAccountRef: { value: 'sample' },
				VendorRef: { value: 'sample' },
				Line: [],
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', purchaseorderId: '35' },
		inputSchema: purchaseOrder_getInput,
		outputSchema: purchaseOrder_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchaseOrder']['get'](ctx, {
				realmId: '12345678',
				purchaseorderId: '35',
			}),
	},
	{
		id: 'purchaseOrder.send',
		method: 'POST',
		expectedPath: '/v3/company/12345678/purchaseorder/35/send',
		expectedQuery: { sendTo: 'billing@example.test' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				PurchaseOrder: {
					APAccountRef: { value: 'sample' },
					VendorRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			PurchaseOrder: {
				APAccountRef: { value: 'sample' },
				VendorRef: { value: 'sample' },
				Line: [],
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			purchaseorderId: '35',
			sendTo: 'billing@example.test',
		},
		inputSchema: purchaseOrder_sendInput,
		outputSchema: purchaseOrder_sendOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchaseOrder']['send'](ctx, {
				realmId: '12345678',
				purchaseorderId: '35',
				sendTo: 'billing@example.test',
			}),
	},
	{
		id: 'purchaseOrder.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/purchaseorder',
		expectedQuery: {},
		expectedBody: {
			APAccountRef: { value: 'sample' },
			VendorRef: { value: 'sample' },
			Line: [],
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				PurchaseOrder: {
					APAccountRef: { value: 'sample' },
					VendorRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			PurchaseOrder: {
				APAccountRef: { value: 'sample' },
				VendorRef: { value: 'sample' },
				Line: [],
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				APAccountRef: { value: 'sample' },
				VendorRef: { value: 'sample' },
				Line: [],
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: purchaseOrder_updateInput,
		outputSchema: purchaseOrder_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['purchaseOrder']['update'](ctx, {
				realmId: '12345678',
				body: {
					APAccountRef: { value: 'sample' },
					VendorRef: { value: 'sample' },
					Line: [],
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'recurringTransaction.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/recurringtransaction',
		expectedQuery: {},
		expectedBody: { RecurringInfo: {} },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				RecurringTransaction: { RecurringInfo: {}, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			RecurringTransaction: { RecurringInfo: {}, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { RecurringInfo: {} } },
		inputSchema: recurringTransaction_createInput,
		outputSchema: recurringTransaction_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['recurringTransaction']['create'](ctx, {
				realmId: '12345678',
				body: { RecurringInfo: {} },
			}),
	},
	{
		id: 'recurringTransaction.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/recurringtransaction',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				RecurringTransaction: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			RecurringTransaction: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: recurringTransaction_deleteInput,
		outputSchema: recurringTransaction_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['recurringTransaction']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'recurringTransaction.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM RecurringTransaction' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { RecurringTransaction: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { RecurringTransaction: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: recurringTransaction_listInput,
		outputSchema: recurringTransaction_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['recurringTransaction']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'recurringTransaction.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/recurringtransaction/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				RecurringTransaction: { RecurringInfo: {}, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			RecurringTransaction: { RecurringInfo: {}, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', recurringtransactionId: '35' },
		inputSchema: recurringTransaction_getInput,
		outputSchema: recurringTransaction_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['recurringTransaction']['get'](ctx, {
				realmId: '12345678',
				recurringtransactionId: '35',
			}),
	},
	{
		id: 'refundReceipt.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/refundreceipt',
		expectedQuery: {},
		expectedBody: { DepositToAccountRef: { value: 'sample' }, Line: [] },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				RefundReceipt: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			RefundReceipt: {
				DepositToAccountRef: { value: 'sample' },
				Line: [],
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { DepositToAccountRef: { value: 'sample' }, Line: [] },
		},
		inputSchema: refundReceipt_createInput,
		outputSchema: refundReceipt_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['refundReceipt']['create'](ctx, {
				realmId: '12345678',
				body: { DepositToAccountRef: { value: 'sample' }, Line: [] },
			}),
	},
	{
		id: 'refundReceipt.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/refundreceipt',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				RefundReceipt: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			RefundReceipt: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: refundReceipt_deleteInput,
		outputSchema: refundReceipt_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['refundReceipt']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'refundReceipt.getPdf',
		method: 'GET',
		expectedPath: '/v3/company/12345678/refundreceipt/35/pdf',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'binary', bytes: [37, 80, 68, 70] },
		expectedResult: {
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERg==',
			sizeBytes: 4,
		},
		input: { realmId: '12345678', refundreceiptId: '35' },
		inputSchema: refundReceipt_getPdfInput,
		outputSchema: refundReceipt_getPdfOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['refundReceipt']['getPdf'](ctx, {
				realmId: '12345678',
				refundreceiptId: '35',
			}),
	},
	{
		id: 'refundReceipt.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM RefundReceipt' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { RefundReceipt: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { RefundReceipt: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: refundReceipt_listInput,
		outputSchema: refundReceipt_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['refundReceipt']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'refundReceipt.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/refundreceipt/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				RefundReceipt: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			RefundReceipt: {
				DepositToAccountRef: { value: 'sample' },
				Line: [],
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', refundreceiptId: '35' },
		inputSchema: refundReceipt_getInput,
		outputSchema: refundReceipt_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['refundReceipt']['get'](ctx, {
				realmId: '12345678',
				refundreceiptId: '35',
			}),
	},
	{
		id: 'refundReceipt.send',
		method: 'POST',
		expectedPath: '/v3/company/12345678/refundreceipt/35/send',
		expectedQuery: { sendTo: 'billing@example.test' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				RefundReceipt: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			RefundReceipt: {
				DepositToAccountRef: { value: 'sample' },
				Line: [],
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			refundreceiptId: '35',
			sendTo: 'billing@example.test',
		},
		inputSchema: refundReceipt_sendInput,
		outputSchema: refundReceipt_sendOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['refundReceipt']['send'](ctx, {
				realmId: '12345678',
				refundreceiptId: '35',
				sendTo: 'billing@example.test',
			}),
	},
	{
		id: 'refundReceipt.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/refundreceipt',
		expectedQuery: {},
		expectedBody: {
			DepositToAccountRef: { value: 'sample' },
			Line: [],
			Id: '35',
			SyncToken: '0',
			sparse: true,
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				RefundReceipt: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			RefundReceipt: {
				DepositToAccountRef: { value: 'sample' },
				Line: [],
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				DepositToAccountRef: { value: 'sample' },
				Line: [],
				Id: '35',
				SyncToken: '0',
				sparse: true,
			},
		},
		inputSchema: refundReceipt_sparseUpdateInput,
		outputSchema: refundReceipt_sparseUpdateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['refundReceipt']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '35',
					SyncToken: '0',
					sparse: true,
				},
			}),
	},
	{
		id: 'refundReceipt.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/refundreceipt',
		expectedQuery: {},
		expectedBody: {
			DepositToAccountRef: { value: 'sample' },
			Line: [],
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				RefundReceipt: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			RefundReceipt: {
				DepositToAccountRef: { value: 'sample' },
				Line: [],
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				DepositToAccountRef: { value: 'sample' },
				Line: [],
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: refundReceipt_updateInput,
		outputSchema: refundReceipt_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['refundReceipt']['update'](ctx, {
				realmId: '12345678',
				body: {
					DepositToAccountRef: { value: 'sample' },
					Line: [],
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'reimburseCharge.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM ReimburseCharge' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { ReimburseCharge: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { ReimburseCharge: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: reimburseCharge_listInput,
		outputSchema: reimburseCharge_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['reimburseCharge']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'reimburseCharge.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reimbursecharge/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				ReimburseCharge: {
					Line: [],
					Amount: 1,
					CustomerRef: { value: 'sample' },
					Id: '1',
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			ReimburseCharge: {
				Line: [],
				Amount: 1,
				CustomerRef: { value: 'sample' },
				Id: '1',
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', taxrateId: '35' },
		inputSchema: reimburseCharge_getInput,
		outputSchema: reimburseCharge_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['reimburseCharge']['get'](ctx, {
				realmId: '12345678',
				taxrateId: '35',
			}),
	},
	{
		id: 'salesByClassSummary.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/ClassSales',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: salesByClassSummary_listInput,
		outputSchema: salesByClassSummary_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesByClassSummary']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'salesByCustomer.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/CustomerSales',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: salesByCustomer_listInput,
		outputSchema: salesByCustomer_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesByCustomer']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'salesByDepartment.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/DepartmentSales',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: salesByDepartment_listInput,
		outputSchema: salesByDepartment_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesByDepartment']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'salesByProduct.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/ItemSales',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: salesByProduct_listInput,
		outputSchema: salesByProduct_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesByProduct']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'salesReceipt.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/salesreceipt',
		expectedQuery: {},
		expectedBody: { Line: [] },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Line: [] } },
		inputSchema: salesReceipt_createInput,
		outputSchema: salesReceipt_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesReceipt']['create'](ctx, {
				realmId: '12345678',
				body: { Line: [] },
			}),
	},
	{
		id: 'salesReceipt.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/salesreceipt',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				SalesReceipt: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			SalesReceipt: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: salesReceipt_deleteInput,
		outputSchema: salesReceipt_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesReceipt']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'salesReceipt.void',
		method: 'POST',
		expectedPath: '/v3/company/12345678/salesreceipt',
		expectedQuery: { operation: 'update', include: 'void' },
		expectedBody: { Id: '35', SyncToken: '0', sparse: true },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Id: '35', SyncToken: '0', sparse: true },
		},
		inputSchema: salesReceipt_voidInput,
		outputSchema: salesReceipt_voidOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesReceipt']['void'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0', sparse: true },
			}),
	},
	{
		id: 'salesReceipt.getPdf',
		method: 'GET',
		expectedPath: '/v3/company/12345678/salesreceipt/35/pdf',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'binary', bytes: [37, 80, 68, 70] },
		expectedResult: {
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERg==',
			sizeBytes: 4,
		},
		input: { realmId: '12345678', salesreceiptId: '35' },
		inputSchema: salesReceipt_getPdfInput,
		outputSchema: salesReceipt_getPdfOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesReceipt']['getPdf'](ctx, {
				realmId: '12345678',
				salesreceiptId: '35',
			}),
	},
	{
		id: 'salesReceipt.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM SalesReceipt' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { SalesReceipt: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { SalesReceipt: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: salesReceipt_listInput,
		outputSchema: salesReceipt_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesReceipt']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'salesReceipt.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/salesreceipt/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', salesreceiptId: '35' },
		inputSchema: salesReceipt_getInput,
		outputSchema: salesReceipt_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesReceipt']['get'](ctx, {
				realmId: '12345678',
				salesreceiptId: '35',
			}),
	},
	{
		id: 'salesReceipt.send',
		method: 'POST',
		expectedPath: '/v3/company/12345678/salesreceipt/35/send',
		expectedQuery: { sendTo: 'billing@example.test' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			salesreceiptId: '35',
			sendTo: 'billing@example.test',
		},
		inputSchema: salesReceipt_sendInput,
		outputSchema: salesReceipt_sendOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesReceipt']['send'](ctx, {
				realmId: '12345678',
				salesreceiptId: '35',
				sendTo: 'billing@example.test',
			}),
	},
	{
		id: 'salesReceipt.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/salesreceipt',
		expectedQuery: {},
		expectedBody: {
			Line: [],
			CustomerRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Line: [],
				CustomerRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: salesReceipt_updateInput,
		outputSchema: salesReceipt_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesReceipt']['update'](ctx, {
				realmId: '12345678',
				body: {
					Line: [],
					CustomerRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'salesReceipt.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/salesreceipt',
		expectedQuery: {},
		expectedBody: {
			Line: [],
			CustomerRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
			sparse: true,
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			SalesReceipt: { Line: [], CustomerRef: { value: 'sample' }, Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Line: [],
				CustomerRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
				sparse: true,
			},
		},
		inputSchema: salesReceipt_sparseUpdateInput,
		outputSchema: salesReceipt_sparseUpdateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['salesReceipt']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: {
					Line: [],
					CustomerRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
					sparse: true,
				},
			}),
	},
	{
		id: 'taxAgency.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/taxagency',
		expectedQuery: {},
		expectedBody: { DisplayName: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				TaxAgency: { DisplayName: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TaxAgency: { DisplayName: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { DisplayName: 'sample' } },
		inputSchema: taxAgency_createInput,
		outputSchema: taxAgency_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxAgency']['create'](ctx, {
				realmId: '12345678',
				body: { DisplayName: 'sample' },
			}),
	},
	{
		id: 'taxAgency.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM TaxAgency' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { TaxAgency: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { TaxAgency: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: taxAgency_listInput,
		outputSchema: taxAgency_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxAgency']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'taxAgency.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/taxagency/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				TaxAgency: { DisplayName: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TaxAgency: { DisplayName: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', taxagencyId: '35' },
		inputSchema: taxAgency_getInput,
		outputSchema: taxAgency_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxAgency']['get'](ctx, {
				realmId: '12345678',
				taxagencyId: '35',
			}),
	},
	{
		id: 'taxClassification.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/taxclassification/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				TaxClassification: { ParentRef: { value: 'sample' } },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TaxClassification: { ParentRef: { value: 'sample' } },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', taxClassificationId: '35' },
		inputSchema: taxClassification_getInput,
		outputSchema: taxClassification_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxClassification']['get'](ctx, {
				realmId: '12345678',
				taxClassificationId: '35',
			}),
	},
	{
		id: 'taxClassification.listChildren',
		method: 'GET',
		expectedPath: '/v3/company/12345678/taxclassification/35/children',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				TaxClassification: { ParentRef: { value: 'sample' } },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TaxClassification: { ParentRef: { value: 'sample' } },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', parentId: '35' },
		inputSchema: taxClassification_listChildrenInput,
		outputSchema: taxClassification_listChildrenOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxClassification']['listChildren'](ctx, {
				realmId: '12345678',
				parentId: '35',
			}),
	},
	{
		id: 'taxClassification.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/taxclassification',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				TaxClassification: { ParentRef: { value: 'sample' } },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TaxClassification: { ParentRef: { value: 'sample' } },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: taxClassification_listInput,
		outputSchema: taxClassification_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxClassification']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'taxClassification.listByLevel',
		method: 'GET',
		expectedPath: '/v3/company/12345678/taxclassification',
		expectedQuery: { level: '1' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				TaxClassification: { ParentRef: { value: 'sample' } },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TaxClassification: { ParentRef: { value: 'sample' } },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', level: 1 },
		inputSchema: taxClassification_listByLevelInput,
		outputSchema: taxClassification_listByLevelOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxClassification']['listByLevel'](ctx, {
				realmId: '12345678',
				level: 1,
			}),
	},
	{
		id: 'taxCode.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM TaxCode' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { TaxCode: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { TaxCode: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: taxCode_listInput,
		outputSchema: taxCode_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxCode']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'taxCode.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/taxcode/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				TaxCode: { Name: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TaxCode: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', taxcodeId: '35' },
		inputSchema: taxCode_getInput,
		outputSchema: taxCode_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxCode']['get'](ctx, {
				realmId: '12345678',
				taxcodeId: '35',
			}),
	},
	{
		id: 'taxPayment.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM TaxPayment' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { TaxPayment: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { TaxPayment: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: taxPayment_listInput,
		outputSchema: taxPayment_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxPayment']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'taxPayment.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/taxpayment/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { TaxPayment: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { TaxPayment: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', taxPaymentId: '35' },
		inputSchema: taxPayment_getInput,
		outputSchema: taxPayment_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxPayment']['get'](ctx, {
				realmId: '12345678',
				taxPaymentId: '35',
			}),
	},
	{
		id: 'taxRate.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM TaxRate' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { TaxRate: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { TaxRate: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: taxRate_listInput,
		outputSchema: taxRate_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxRate']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'taxRate.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/taxrate/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { TaxRate: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { TaxRate: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', taxrateId: '35' },
		inputSchema: taxRate_getInput,
		outputSchema: taxRate_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxRate']['get'](ctx, {
				realmId: '12345678',
				taxrateId: '35',
			}),
	},
	{
		id: 'taxService.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/taxservice/taxcode',
		expectedQuery: {},
		expectedBody: { TaxCode: 'sample', TaxRateDetails: [] },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				TaxService: { TaxCode: 'sample', TaxRateDetails: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TaxService: { TaxCode: 'sample', TaxRateDetails: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { TaxCode: 'sample', TaxRateDetails: [] },
		},
		inputSchema: taxService_createInput,
		outputSchema: taxService_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxService']['create'](ctx, {
				realmId: '12345678',
				body: { TaxCode: 'sample', TaxRateDetails: [] },
			}),
	},
	{
		id: 'taxSummary.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/TaxSummary',
		expectedQuery: { agency_id: '1' },
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: { agency_id: '1' } },
		inputSchema: taxSummary_listInput,
		outputSchema: taxSummary_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['taxSummary']['list'](ctx, {
				realmId: '12345678',
				params: { agency_id: '1' },
			}),
	},
	{
		id: 'term.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/term',
		expectedQuery: {},
		expectedBody: { Name: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Term: { Name: 'sample', Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			Term: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Name: 'sample' } },
		inputSchema: term_createInput,
		outputSchema: term_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['term']['create'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample' },
			}),
	},
	{
		id: 'term.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Term' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Term: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Term: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: term_listInput,
		outputSchema: term_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['term']['list'](ctx, { realmId: '12345678' }),
	},
	{
		id: 'term.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/term/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { Term: { Name: 'sample', Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			Term: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', termId: '35' },
		inputSchema: term_getInput,
		outputSchema: term_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['term']['get'](ctx, {
				realmId: '12345678',
				termId: '35',
			}),
	},
	{
		id: 'term.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/term',
		expectedQuery: {},
		expectedBody: { Name: 'sample', Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Term: { Name: 'sample', Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			Term: { Name: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { Name: 'sample', Id: '35', SyncToken: '0' },
		},
		inputSchema: term_updateInput,
		outputSchema: term_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['term']['update'](ctx, {
				realmId: '12345678',
				body: { Name: 'sample', Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'timeActivity.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/timeactivity',
		expectedQuery: {},
		expectedBody: { NameOf: 'sample' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				TimeActivity: { NameOf: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TimeActivity: { NameOf: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { NameOf: 'sample' } },
		inputSchema: timeActivity_createInput,
		outputSchema: timeActivity_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['timeActivity']['create'](ctx, {
				realmId: '12345678',
				body: { NameOf: 'sample' },
			}),
	},
	{
		id: 'timeActivity.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/timeactivity',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				TimeActivity: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TimeActivity: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: timeActivity_deleteInput,
		outputSchema: timeActivity_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['timeActivity']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'timeActivity.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM TimeActivity' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { TimeActivity: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { TimeActivity: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: timeActivity_listInput,
		outputSchema: timeActivity_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['timeActivity']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'timeActivity.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/timeactivity/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				TimeActivity: { NameOf: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TimeActivity: { NameOf: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', timeactivityId: '35' },
		inputSchema: timeActivity_getInput,
		outputSchema: timeActivity_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['timeActivity']['get'](ctx, {
				realmId: '12345678',
				timeactivityId: '35',
			}),
	},
	{
		id: 'timeActivity.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/timeactivity',
		expectedQuery: {},
		expectedBody: { NameOf: 'sample', Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				TimeActivity: { NameOf: 'sample', Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			TimeActivity: { NameOf: 'sample', Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { NameOf: 'sample', Id: '35', SyncToken: '0' },
		},
		inputSchema: timeActivity_updateInput,
		outputSchema: timeActivity_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['timeActivity']['update'](ctx, {
				realmId: '12345678',
				body: { NameOf: 'sample', Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'transactionList.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/TransactionList',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: transactionList_listInput,
		outputSchema: transactionList_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transactionList']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'transactionListByCustomer.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/TransactionListByCustomer',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: transactionListByCustomer_listInput,
		outputSchema: transactionListByCustomer_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transactionListByCustomer']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'transactionListByVendor.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/TransactionListByVendor',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: transactionListByVendor_listInput,
		outputSchema: transactionListByVendor_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transactionListByVendor']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'transactionListWithSplits.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/TransactionListWithSplits',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: transactionListWithSplits_listInput,
		outputSchema: transactionListWithSplits_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transactionListWithSplits']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'transfer.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/transfer',
		expectedQuery: {},
		expectedBody: {
			Amount: 1,
			ToAccountRef: { value: 'sample' },
			FromAccountRef: { value: 'sample' },
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Transfer: {
					ToAccountRef: { value: 'sample' },
					Amount: 1,
					Id: '1',
					FromAccountRef: { value: 'sample' },
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Transfer: {
				ToAccountRef: { value: 'sample' },
				Amount: 1,
				Id: '1',
				FromAccountRef: { value: 'sample' },
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Amount: 1,
				ToAccountRef: { value: 'sample' },
				FromAccountRef: { value: 'sample' },
			},
		},
		inputSchema: transfer_createInput,
		outputSchema: transfer_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transfer']['create'](ctx, {
				realmId: '12345678',
				body: {
					Amount: 1,
					ToAccountRef: { value: 'sample' },
					FromAccountRef: { value: 'sample' },
				},
			}),
	},
	{
		id: 'transfer.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/transfer',
		expectedQuery: { operation: 'delete' },
		expectedBody: {
			ToAccountRef: { value: 'sample' },
			Amount: 1,
			Id: '35',
			FromAccountRef: { value: 'sample' },
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Transfer: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Transfer: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				ToAccountRef: { value: 'sample' },
				Amount: 1,
				Id: '35',
				FromAccountRef: { value: 'sample' },
				SyncToken: '0',
			},
		},
		inputSchema: transfer_deleteInput,
		outputSchema: transfer_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transfer']['delete'](ctx, {
				realmId: '12345678',
				body: {
					ToAccountRef: { value: 'sample' },
					Amount: 1,
					Id: '35',
					FromAccountRef: { value: 'sample' },
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'transfer.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Transfer' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Transfer: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Transfer: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: transfer_listInput,
		outputSchema: transfer_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transfer']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'transfer.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/transfer/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				Transfer: {
					ToAccountRef: { value: 'sample' },
					Amount: 1,
					Id: '1',
					FromAccountRef: { value: 'sample' },
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Transfer: {
				ToAccountRef: { value: 'sample' },
				Amount: 1,
				Id: '1',
				FromAccountRef: { value: 'sample' },
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', transferId: '35' },
		inputSchema: transfer_getInput,
		outputSchema: transfer_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transfer']['get'](ctx, {
				realmId: '12345678',
				transferId: '35',
			}),
	},
	{
		id: 'transfer.sparseUpdate',
		method: 'POST',
		expectedPath: '/v3/company/12345678/transfer',
		expectedQuery: {},
		expectedBody: {
			Amount: 1,
			ToAccountRef: { value: 'sample' },
			FromAccountRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
			sparse: true,
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Transfer: {
					ToAccountRef: { value: 'sample' },
					Amount: 1,
					Id: '1',
					FromAccountRef: { value: 'sample' },
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Transfer: {
				ToAccountRef: { value: 'sample' },
				Amount: 1,
				Id: '1',
				FromAccountRef: { value: 'sample' },
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Amount: 1,
				ToAccountRef: { value: 'sample' },
				FromAccountRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
				sparse: true,
			},
		},
		inputSchema: transfer_sparseUpdateInput,
		outputSchema: transfer_sparseUpdateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transfer']['sparseUpdate'](ctx, {
				realmId: '12345678',
				body: {
					Amount: 1,
					ToAccountRef: { value: 'sample' },
					FromAccountRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
					sparse: true,
				},
			}),
	},
	{
		id: 'transfer.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/transfer',
		expectedQuery: {},
		expectedBody: {
			Amount: 1,
			ToAccountRef: { value: 'sample' },
			FromAccountRef: { value: 'sample' },
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				Transfer: {
					ToAccountRef: { value: 'sample' },
					Amount: 1,
					Id: '1',
					FromAccountRef: { value: 'sample' },
				},
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			Transfer: {
				ToAccountRef: { value: 'sample' },
				Amount: 1,
				Id: '1',
				FromAccountRef: { value: 'sample' },
			},
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				Amount: 1,
				ToAccountRef: { value: 'sample' },
				FromAccountRef: { value: 'sample' },
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: transfer_updateInput,
		outputSchema: transfer_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['transfer']['update'](ctx, {
				realmId: '12345678',
				body: {
					Amount: 1,
					ToAccountRef: { value: 'sample' },
					FromAccountRef: { value: 'sample' },
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'trialBalance.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/TrialBalance',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', locale: 'default', params: {} },
		inputSchema: trialBalance_listInput,
		outputSchema: trialBalance_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['trialBalance']['list'](ctx, {
				realmId: '12345678',
				locale: 'default',
				params: {},
			}),
	},
	{
		id: 'vendor.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/vendor',
		expectedQuery: {},
		expectedBody: {},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Vendor: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Vendor: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: {} },
		inputSchema: vendor_createInput,
		outputSchema: vendor_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendor']['create'](ctx, {
				realmId: '12345678',
				body: {},
			}),
	},
	{
		id: 'vendor.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM Vendor' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { QueryResponse: { Vendor: [] }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: {
			QueryResponse: { Vendor: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: vendor_listInput,
		outputSchema: vendor_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendor']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'vendor.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/vendor/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: { Vendor: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Vendor: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', vendorId: '35' },
		inputSchema: vendor_getInput,
		outputSchema: vendor_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendor']['get'](ctx, {
				realmId: '12345678',
				vendorId: '35',
			}),
	},
	{
		id: 'vendor.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/vendor',
		expectedQuery: {},
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: { Vendor: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		},
		expectedResult: { Vendor: { Id: '1' }, time: '2026-11-18T12:00:00Z' },
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: vendor_updateInput,
		outputSchema: vendor_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendor']['update'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'vendorBalance.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/VendorBalance',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: vendorBalance_listInput,
		outputSchema: vendorBalance_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendorBalance']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'vendorBalanceDetail.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/VendorBalanceDetail',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: vendorBalanceDetail_listInput,
		outputSchema: vendorBalanceDetail_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendorBalanceDetail']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
	{
		id: 'vendorCredit.create',
		method: 'POST',
		expectedPath: '/v3/company/12345678/vendorcredit',
		expectedQuery: {},
		expectedBody: { VendorRef: { value: 'sample' }, Line: [] },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				VendorCredit: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			VendorCredit: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: { VendorRef: { value: 'sample' }, Line: [] },
		},
		inputSchema: vendorCredit_createInput,
		outputSchema: vendorCredit_createOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendorCredit']['create'](ctx, {
				realmId: '12345678',
				body: { VendorRef: { value: 'sample' }, Line: [] },
			}),
	},
	{
		id: 'vendorCredit.delete',
		method: 'POST',
		expectedPath: '/v3/company/12345678/vendorcredit',
		expectedQuery: { operation: 'delete' },
		expectedBody: { Id: '35', SyncToken: '0' },
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				VendorCredit: { status: 'Deleted', Id: '35', domain: 'QBO' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			VendorCredit: { status: 'Deleted', Id: '35', domain: 'QBO' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', body: { Id: '35', SyncToken: '0' } },
		inputSchema: vendorCredit_deleteInput,
		outputSchema: vendorCredit_deleteOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendorCredit']['delete'](ctx, {
				realmId: '12345678',
				body: { Id: '35', SyncToken: '0' },
			}),
	},
	{
		id: 'vendorCredit.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/query',
		expectedQuery: { query: 'SELECT * FROM VendorCredit' },
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				QueryResponse: { VendorCredit: [] },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			QueryResponse: { VendorCredit: [] },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678' },
		inputSchema: vendorCredit_listInput,
		outputSchema: vendorCredit_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendorCredit']['list'](ctx, {
				realmId: '12345678',
			}),
	},
	{
		id: 'vendorCredit.get',
		method: 'GET',
		expectedPath: '/v3/company/12345678/vendorcredit/35',
		expectedQuery: {},
		requestKind: 'none',
		response: {
			kind: 'json',
			body: {
				VendorCredit: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			VendorCredit: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: { realmId: '12345678', vendorcreditId: '35' },
		inputSchema: vendorCredit_getInput,
		outputSchema: vendorCredit_getOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendorCredit']['get'](ctx, {
				realmId: '12345678',
				vendorcreditId: '35',
			}),
	},
	{
		id: 'vendorCredit.update',
		method: 'POST',
		expectedPath: '/v3/company/12345678/vendorcredit',
		expectedQuery: {},
		expectedBody: {
			VendorRef: { value: 'sample' },
			Line: [],
			Id: '35',
			SyncToken: '0',
		},
		requestKind: 'json',
		response: {
			kind: 'json',
			body: {
				VendorCredit: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
				time: '2026-11-18T12:00:00Z',
			},
		},
		expectedResult: {
			VendorCredit: { VendorRef: { value: 'sample' }, Line: [], Id: '1' },
			time: '2026-11-18T12:00:00Z',
		},
		input: {
			realmId: '12345678',
			body: {
				VendorRef: { value: 'sample' },
				Line: [],
				Id: '35',
				SyncToken: '0',
			},
		},
		inputSchema: vendorCredit_updateInput,
		outputSchema: vendorCredit_updateOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendorCredit']['update'](ctx, {
				realmId: '12345678',
				body: {
					VendorRef: { value: 'sample' },
					Line: [],
					Id: '35',
					SyncToken: '0',
				},
			}),
	},
	{
		id: 'vendorExpenses.list',
		method: 'GET',
		expectedPath: '/v3/company/12345678/reports/VendorExpenses',
		expectedQuery: {},
		requestKind: 'none',
		response: { kind: 'json', body: {} },
		expectedResult: {},
		input: { realmId: '12345678', params: {} },
		inputSchema: vendorExpenses_listInput,
		outputSchema: vendorExpenses_listOutput,
		invoke: (ctx) =>
			QuickBooksCatalogEndpoints['vendorExpenses']['list'](ctx, {
				realmId: '12345678',
				params: {},
			}),
	},
];
