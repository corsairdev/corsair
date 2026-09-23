import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listBarcodesRoute = getRoute('listBarcodes');
export const listBarcodes: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listBarcodesRoute);
};

export const BarcodesEndpoints = {
	listBarcodes,
};
