import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listCouponsRoute = getRoute('listCoupons');
export const listCoupons: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listCouponsRoute);
};

export const CouponsEndpoints = {
	listCoupons,
};
