import {
	GrafanaDashboardQuery,
	GrafanaHealthStatus,
	GrafanaJwksKey,
	GrafanaLog,
	GrafanaRingStatus,
	GrafanaSamlSession,
} from './database';

export const GrafanaSchema = {
	version: '1.0.0',
	entities: {
		healthStatus: GrafanaHealthStatus,
		logs: GrafanaLog,
		dashboardQueries: GrafanaDashboardQuery,
		ringStatus: GrafanaRingStatus,
		jwksKeys: GrafanaJwksKey,
		samlSessions: GrafanaSamlSession,
	},
} as const;
