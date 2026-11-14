import type { ErpnextEndpointHandler } from './factory';
import { defineEndpoint } from './factory';

// The `erp` family: one declaration per catalog entry
// (../operations.ts). The dotted operation ids are the `erp` prefix
// plus these object keys, so renaming a key changes the public operation id.
export const getExchangeRate = defineEndpoint('erp.getExchangeRate');
const baseGetItemDetails = defineEndpoint('erp.getItemDetails');
// ERPNext version-16 names the first parameter `ctx`; version-15 names it
// `args`. Frappe drops query keys the function does not declare
// (frappe.get_newargs), so the item context goes out under both names and
// each version reads its own.
export const getItemDetails: ErpnextEndpointHandler<'erp.getItemDetails'> = (
	ctx,
	input,
) =>
	baseGetItemDetails(ctx, {
		...input,
		args: input.ctx,
	} as typeof input);
export const getPartyDetails = defineEndpoint('erp.getPartyDetails');
export const getPaymentEntry = defineEndpoint('erp.getPaymentEntry');
export const getStockBalance = defineEndpoint('erp.getStockBalance');
export const makeSalesInvoice = defineEndpoint('erp.makeSalesInvoice');
export const makeDeliveryNote = defineEndpoint('erp.makeDeliveryNote');
export const makePurchaseOrder = defineEndpoint('erp.makePurchaseOrder');
export const makeStockEntry = defineEndpoint('erp.makeStockEntry');

export const endpoints = {
	getExchangeRate,
	getItemDetails,
	getPartyDetails,
	getPaymentEntry,
	getStockBalance,
	makeSalesInvoice,
	makeDeliveryNote,
	makePurchaseOrder,
	makeStockEntry,
} as const;
