import { defineOp } from './factory';

export const getAppInstance = defineOp('getAppInstance');
export const listAppPermissions = defineOp('listAppPermissions');
export const listAppPlansByAppId = defineOp('listAppPlansByAppId');
export const getPurchaseHistory = defineOp('getPurchaseHistory');
export const deleteSecret = defineOp('deleteSecret');
export const deleteUserFavorite = defineOp('deleteUserFavorite');
export const bulkDeleteReportsByFilter = defineOp('bulkDeleteReportsByFilter');
export const updateOperationGroupTagsByFilter = defineOp(
	'updateOperationGroupTagsByFilter',
);

export const SystemEndpoints = {
	getAppInstance,
	listAppPermissions,
	listAppPlansByAppId,
	getPurchaseHistory,
	deleteSecret,
	deleteUserFavorite,
	bulkDeleteReportsByFilter,
	updateOperationGroupTagsByFilter,
} as const;
