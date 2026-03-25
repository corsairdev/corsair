import {
	GrafanaDashboardQuery,
	GrafanaHealthStatus,
	GrafanaLog,
} from './database';

export const GrafanaSchema = {
	version: '1.0.0',
	entities: {
		healthStatus: GrafanaHealthStatus,
		logs: GrafanaLog,
		dashboardQueries: GrafanaDashboardQuery,
	},
} as const;
