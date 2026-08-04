import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const createResthookSubscriptionRoute = getRoute('createResthookSubscription');
export const createResthookSubscription: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, createResthookSubscriptionRoute);
};

const deleteResthookSubscriptionRoute = getRoute('deleteResthookSubscription');
export const deleteResthookSubscription: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, deleteResthookSubscriptionRoute);
};

const getResthookSubscriptionRoute = getRoute('getResthookSubscription');
export const getResthookSubscription: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, getResthookSubscriptionRoute);
};

const getResthookSubscriptionsRoute = getRoute('getResthookSubscriptions');
export const getResthookSubscriptions: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, getResthookSubscriptionsRoute);
};

const updateResthookSubscriptionRoute = getRoute('updateResthookSubscription');
export const updateResthookSubscription: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, updateResthookSubscriptionRoute);
};

export const ResthooksEndpoints = {
	createResthookSubscription,
	deleteResthookSubscription,
	getResthookSubscription,
	getResthookSubscriptions,
	updateResthookSubscription,
} as const;
