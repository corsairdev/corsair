import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const GetDowngradePlanInfoForAccountInputSchema = z.object({});

export const GetDowngradePlanInfoForAccountOutputSchema = z
	.object({})
	.passthrough();

export type GetDowngradePlanInfoForAccountParams = z.infer<
	typeof GetDowngradePlanInfoForAccountInputSchema
>;

export const getDowngradePlanInfoForAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetDowngradePlanInfoForAccountParams,
) => {
	const input = GetDowngradePlanInfoForAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/billing_plan/downgrade`, {
		method: 'GET',
	});
	return GetDowngradePlanInfoForAccountOutputSchema.parse(data);
};

export const ListBillingInvoicesInputSchema = z.object({
	from_date: z.string().optional(),
	to_date: z.string().optional(),
});

export const ListBillingInvoicesOutputSchema = z.object({}).passthrough();

export type ListBillingInvoicesParams = z.infer<
	typeof ListBillingInvoicesInputSchema
>;

export const listBillingInvoices = async (
	ctxOrClient: DocusignExecutionContext,
	params: ListBillingInvoicesParams,
) => {
	const input = ListBillingInvoicesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.from_date !== undefined)
		query.append('from_date', String(input.from_date));
	if (input.to_date !== undefined)
		query.append('to_date', String(input.to_date));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/billing_invoices` + qs, {
		method: 'GET',
	});
	return ListBillingInvoicesOutputSchema.parse(data);
};

export const ListPastDueInvoicesInputSchema = z.object({});

export const ListPastDueInvoicesOutputSchema = z.object({}).passthrough();

export type ListPastDueInvoicesParams = z.infer<
	typeof ListPastDueInvoicesInputSchema
>;

export const listPastDueInvoices = async (
	ctxOrClient: DocusignExecutionContext,
	params: ListPastDueInvoicesParams,
) => {
	const input = ListPastDueInvoicesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/billing_invoices_past_due`, {
		method: 'GET',
	});
	return ListPastDueInvoicesOutputSchema.parse(data);
};

export const ListPaymentGatewayAccountsInfoInputSchema = z.object({});

export const ListPaymentGatewayAccountsInfoOutputSchema = z
	.object({})
	.passthrough();

export type ListPaymentGatewayAccountsInfoParams = z.infer<
	typeof ListPaymentGatewayAccountsInfoInputSchema
>;

export const listPaymentGatewayAccountsInfo = async (
	ctxOrClient: DocusignExecutionContext,
	params: ListPaymentGatewayAccountsInfoParams,
) => {
	const input = ListPaymentGatewayAccountsInfoInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/payment_gateway_accounts`, {
		method: 'GET',
	});
	return ListPaymentGatewayAccountsInfoOutputSchema.parse(data);
};

export const PostPaymentToInvoiceInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const PostPaymentToInvoiceOutputSchema = z.object({}).passthrough();

export type PostPaymentToInvoiceParams = z.infer<
	typeof PostPaymentToInvoiceInputSchema
>;

export const postPaymentToInvoice = async (
	ctxOrClient: DocusignExecutionContext,
	params: PostPaymentToInvoiceParams,
) => {
	const input = PostPaymentToInvoiceInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/billing_payments`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return PostPaymentToInvoiceOutputSchema.parse(data);
};

export const PurchaseAdditionalEnvelopesInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const PurchaseAdditionalEnvelopesOutputSchema = z
	.object({})
	.passthrough();

export type PurchaseAdditionalEnvelopesParams = z.infer<
	typeof PurchaseAdditionalEnvelopesInputSchema
>;

export const purchaseAdditionalEnvelopes = async (
	ctxOrClient: DocusignExecutionContext,
	params: PurchaseAdditionalEnvelopesParams,
) => {
	const input = PurchaseAdditionalEnvelopesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/billing_plan/purchased_envelopes`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return PurchaseAdditionalEnvelopesOutputSchema.parse(data);
};

export const QueueDowngradeBillingPlanRequestInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const QueueDowngradeBillingPlanRequestOutputSchema = z
	.object({})
	.passthrough();

export type QueueDowngradeBillingPlanRequestParams = z.infer<
	typeof QueueDowngradeBillingPlanRequestInputSchema
>;

export const queueDowngradeBillingPlanRequest = async (
	ctxOrClient: DocusignExecutionContext,
	params: QueueDowngradeBillingPlanRequestParams,
) => {
	const input = QueueDowngradeBillingPlanRequestInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/billing_plan/downgrade`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return QueueDowngradeBillingPlanRequestOutputSchema.parse(data);
};

export const RetrieveAccountBillingPlanInputSchema = z.object({
	include_credit_card_information: z.string().optional(),
	include_downgrade_information: z.string().optional(),
	include_metadata: z.string().optional(),
	include_successor_plans: z.string().optional(),
	include_tax_exempt_id: z.string().optional(),
});

export const RetrieveAccountBillingPlanOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveAccountBillingPlanParams = z.infer<
	typeof RetrieveAccountBillingPlanInputSchema
>;

export const retrieveAccountBillingPlan = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveAccountBillingPlanParams,
) => {
	const input = RetrieveAccountBillingPlanInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.include_credit_card_information !== undefined)
		query.append(
			'include_credit_card_information',
			String(input.include_credit_card_information),
		);
	if (input.include_downgrade_information !== undefined)
		query.append(
			'include_downgrade_information',
			String(input.include_downgrade_information),
		);
	if (input.include_metadata !== undefined)
		query.append('include_metadata', String(input.include_metadata));
	if (input.include_successor_plans !== undefined)
		query.append(
			'include_successor_plans',
			String(input.include_successor_plans),
		);
	if (input.include_tax_exempt_id !== undefined)
		query.append('include_tax_exempt_id', String(input.include_tax_exempt_id));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/billing_plan` + qs, {
		method: 'GET',
	});
	return RetrieveAccountBillingPlanOutputSchema.parse(data);
};

export const RetrieveBillingInvoiceInputSchema = z.object({
	invoiceId: z.string(),
});

export const RetrieveBillingInvoiceOutputSchema = z.object({}).passthrough();

export type RetrieveBillingInvoiceParams = z.infer<
	typeof RetrieveBillingInvoiceInputSchema
>;

export const retrieveBillingInvoice = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveBillingInvoiceParams,
) => {
	const input = RetrieveBillingInvoiceInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/billing_invoices/${encodeURIComponent(input.invoiceId)}`,
		{
			method: 'GET',
		},
	);
	return RetrieveBillingInvoiceOutputSchema.parse(data);
};

export const RetrieveBillingPaymentInfoInputSchema = z.object({
	paymentId: z.string(),
});

export const RetrieveBillingPaymentInfoOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveBillingPaymentInfoParams = z.infer<
	typeof RetrieveBillingPaymentInfoInputSchema
>;

export const retrieveBillingPaymentInfo = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveBillingPaymentInfoParams,
) => {
	const input = RetrieveBillingPaymentInfoInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/billing_payments/${encodeURIComponent(input.paymentId)}`,
		{
			method: 'GET',
		},
	);
	return RetrieveBillingPaymentInfoOutputSchema.parse(data);
};

export const RetrieveCreditCardInfoInputSchema = z.object({});

export const RetrieveCreditCardInfoOutputSchema = z.object({}).passthrough();

export type RetrieveCreditCardInfoParams = z.infer<
	typeof RetrieveCreditCardInfoInputSchema
>;

export const retrieveCreditCardInfo = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveCreditCardInfoParams,
) => {
	const input = RetrieveCreditCardInfoInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/billing_plan/credit_card`, {
		method: 'GET',
	});
	return RetrieveCreditCardInfoOutputSchema.parse(data);
};

export const RetrieveListOfBillingPlansInputSchema = z.object({});

export const RetrieveListOfBillingPlansOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveListOfBillingPlansParams = z.infer<
	typeof RetrieveListOfBillingPlansInputSchema
>;

export const retrieveListOfBillingPlans = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveListOfBillingPlansParams,
) => {
	const input = RetrieveListOfBillingPlansInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/v2.1/billing_plans`, {
		method: 'GET',
	});
	return RetrieveListOfBillingPlansOutputSchema.parse(data);
};

export const RetrievePaymentInformationListInputSchema = z.object({
	from_date: z.string().optional(),
	to_date: z.string().optional(),
});

export const RetrievePaymentInformationListOutputSchema = z
	.object({})
	.passthrough();

export type RetrievePaymentInformationListParams = z.infer<
	typeof RetrievePaymentInformationListInputSchema
>;

export const retrievePaymentInformationList = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrievePaymentInformationListParams,
) => {
	const input = RetrievePaymentInformationListInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.from_date !== undefined)
		query.append('from_date', String(input.from_date));
	if (input.to_date !== undefined)
		query.append('to_date', String(input.to_date));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/billing_payments` + qs, {
		method: 'GET',
	});
	return RetrievePaymentInformationListOutputSchema.parse(data);
};

export const UpdateBillingPlanForAccountInputSchema = z.object({
	preview_billing_plan: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateBillingPlanForAccountOutputSchema = z
	.object({})
	.passthrough();

export type UpdateBillingPlanForAccountParams = z.infer<
	typeof UpdateBillingPlanForAccountInputSchema
>;

export const updateBillingPlanForAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateBillingPlanForAccountParams,
) => {
	const input = UpdateBillingPlanForAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.preview_billing_plan !== undefined)
		query.append('preview_billing_plan', String(input.preview_billing_plan));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/billing_plan` + qs, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateBillingPlanForAccountOutputSchema.parse(data);
};

export const BillingInputSchemas = {
	getDowngradePlanInfoForAccount: GetDowngradePlanInfoForAccountInputSchema,
	listBillingInvoices: ListBillingInvoicesInputSchema,
	listPastDueInvoices: ListPastDueInvoicesInputSchema,
	listPaymentGatewayAccountsInfo: ListPaymentGatewayAccountsInfoInputSchema,
	postPaymentToInvoice: PostPaymentToInvoiceInputSchema,
	purchaseAdditionalEnvelopes: PurchaseAdditionalEnvelopesInputSchema,
	queueDowngradeBillingPlanRequest: QueueDowngradeBillingPlanRequestInputSchema,
	retrieveAccountBillingPlan: RetrieveAccountBillingPlanInputSchema,
	retrieveBillingInvoice: RetrieveBillingInvoiceInputSchema,
	retrieveBillingPaymentInfo: RetrieveBillingPaymentInfoInputSchema,
	retrieveCreditCardInfo: RetrieveCreditCardInfoInputSchema,
	retrieveListOfBillingPlans: RetrieveListOfBillingPlansInputSchema,
	retrievePaymentInformationList: RetrievePaymentInformationListInputSchema,
	updateBillingPlanForAccount: UpdateBillingPlanForAccountInputSchema,
};

export const BillingOutputSchemas = {
	getDowngradePlanInfoForAccount: GetDowngradePlanInfoForAccountOutputSchema,
	listBillingInvoices: ListBillingInvoicesOutputSchema,
	listPastDueInvoices: ListPastDueInvoicesOutputSchema,
	listPaymentGatewayAccountsInfo: ListPaymentGatewayAccountsInfoOutputSchema,
	postPaymentToInvoice: PostPaymentToInvoiceOutputSchema,
	purchaseAdditionalEnvelopes: PurchaseAdditionalEnvelopesOutputSchema,
	queueDowngradeBillingPlanRequest:
		QueueDowngradeBillingPlanRequestOutputSchema,
	retrieveAccountBillingPlan: RetrieveAccountBillingPlanOutputSchema,
	retrieveBillingInvoice: RetrieveBillingInvoiceOutputSchema,
	retrieveBillingPaymentInfo: RetrieveBillingPaymentInfoOutputSchema,
	retrieveCreditCardInfo: RetrieveCreditCardInfoOutputSchema,
	retrieveListOfBillingPlans: RetrieveListOfBillingPlansOutputSchema,
	retrievePaymentInformationList: RetrievePaymentInformationListOutputSchema,
	updateBillingPlanForAccount: UpdateBillingPlanForAccountOutputSchema,
};
