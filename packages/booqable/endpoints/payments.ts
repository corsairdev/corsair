import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listPaymentsRoute = getRoute('listPayments');
export const listPayments: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listPaymentsRoute);
};

export const PaymentsEndpoints = {
	listPayments,
};
