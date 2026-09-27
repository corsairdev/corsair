import { defineOp } from './factory';

export const query = defineOp('queryEcomOrders');
export const bulkUpdate = defineOp('bulkUpdateOrders');
export const bulkUpdateTags = defineOp('bulkUpdateOrderTags');
export const removeTip = defineOp('removeTipFromOrder');
export const bulkDeleteAbandonedCheckouts = defineOp(
	'bulkDeleteAbandonedCheckouts',
);
export const listInvoicesByOrderIds = defineOp('listInvoicesByOrderIds');

export const OrdersEndpoints = {
	query,
	bulkUpdate,
	bulkUpdateTags,
	removeTip,
	bulkDeleteAbandonedCheckouts,
	listInvoicesByOrderIds,
} as const;
