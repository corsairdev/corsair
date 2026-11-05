import type { AgentyEndpoint } from './factory';
import { executeAgentyOperation, getRoute } from './factory';

const apiKeysControllerCreateApiKeysRoute = getRoute(
	'apiKeysControllerCreateApiKeys',
);
export const apiKeysControllerCreateApiKeys: AgentyEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgentyOperation(
		ctx,
		input,
		apiKeysControllerCreateApiKeysRoute,
	);
};

const apiKeysDeleteByIdRoute = getRoute('apiKeysDeleteById');
export const apiKeysDeleteById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, apiKeysDeleteByIdRoute);
};

const apiKeysDownloadRoute = getRoute('apiKeysDownload');
export const apiKeysDownload: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, apiKeysDownloadRoute);
};

const apiKeysGetAllRoute = getRoute('apiKeysGetAll');
export const apiKeysGetAll: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, apiKeysGetAllRoute);
};

const apiKeysGetByIdRoute = getRoute('apiKeysGetById');
export const apiKeysGetById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, apiKeysGetByIdRoute);
};

const apiKeysResetByIdRoute = getRoute('apiKeysResetById');
export const apiKeysResetById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, apiKeysResetByIdRoute);
};

const apiKeysUpdateByIdRoute = getRoute('apiKeysUpdateById');
export const apiKeysUpdateById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, apiKeysUpdateByIdRoute);
};

const changeApiKeyStatusByIdRoute = getRoute('changeApiKeyStatusById');
export const changeApiKeyStatusById: AgentyEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgentyOperation(ctx, input, changeApiKeyStatusByIdRoute);
};

export const ApiKeysEndpoints = {
	apiKeysControllerCreateApiKeys,
	apiKeysDeleteById,
	apiKeysDownload,
	apiKeysGetAll,
	apiKeysGetById,
	apiKeysResetById,
	apiKeysUpdateById,
	changeApiKeyStatusById,
} as const;
