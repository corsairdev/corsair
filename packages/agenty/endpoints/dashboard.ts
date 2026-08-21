import type { AgentyEndpoint } from './factory';
import { executeAgentyOperation, getRoute } from './factory';

const dashboardGetReportsUsageRoute = getRoute('dashboardGetReportsUsage');
export const dashboardGetReportsUsage: AgentyEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgentyOperation(ctx, input, dashboardGetReportsUsageRoute);
};

export const DashboardEndpoints = {
	dashboardGetReportsUsage,
} as const;
