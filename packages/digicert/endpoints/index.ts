export {
	intermediatesList,
	ordersList,
	organizationsList,
	usersList,
} from './certcentral';
export { customReportOrderById, customReportOrders } from './custom-reports';
export {
	accountManagerLocales,
	certificateTags,
	privateCAHelper,
	verifyTemplate,
} from './digicert-one';
export {
	contentTrustInfoV0,
	contentTrustInfoV1,
	trustLifecycleVersion,
} from './public';
export {
	reportDetails,
	reportHistory,
	reportNames,
	reportTypes,
} from './report-library';

import {
	intermediatesList,
	ordersList,
	organizationsList,
	usersList,
} from './certcentral';
import { customReportOrderById, customReportOrders } from './custom-reports';
import {
	accountManagerLocales,
	certificateTags,
	privateCAHelper,
	verifyTemplate,
} from './digicert-one';
import { generatedDocEndpoints } from './generated-docs';
import { generatedOpenApiEndpoints } from './generated-openapi';
import {
	contentTrustInfoV0,
	contentTrustInfoV1,
	trustLifecycleVersion,
} from './public';
import {
	reportDetails,
	reportHistory,
	reportNames,
	reportTypes,
} from './report-library';

export const endpoints = {
	usersList,
	ordersList,
	organizationsList,
	intermediatesList,
	trustLifecycleVersion,
	contentTrustInfoV0,
	contentTrustInfoV1,
	accountManagerLocales,
	privateCAHelper,
	certificateTags,
	verifyTemplate,
	reportNames,
	reportTypes,
	reportHistory,
	reportDetails,
	customReportOrders,
	customReportOrderById,
	...generatedOpenApiEndpoints,
	...generatedDocEndpoints,
};
