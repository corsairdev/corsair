import { defineEndpoint } from './factory';

// The `erp` family: one declaration per catalog entry
// (../operations.ts). The dotted operation ids are the `erp` prefix
// plus these object keys, so renaming a key changes the public operation id.
export const getExchangeRate = defineEndpoint('erp.getExchangeRate');
export const getItemDetails = defineEndpoint('erp.getItemDetails');
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
