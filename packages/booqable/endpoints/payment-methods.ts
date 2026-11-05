import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listPaymentMethodsRoute = getRoute('listPaymentMethods');
export const listPaymentMethods: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listPaymentMethodsRoute);
};

export const PaymentMethodsEndpoints = {
	listPaymentMethods,
};
