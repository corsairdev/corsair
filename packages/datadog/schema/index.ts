import {
	DatadogDashboardEntity,
	DatadogIncidentEntity,
	DatadogMonitorEntity,
	DatadogSloEntity,
} from './database';

export const DatadogSchema = {
	version: '1.0.0',
	entities: {
		monitors: DatadogMonitorEntity,
		dashboards: DatadogDashboardEntity,
		slos: DatadogSloEntity,
		incidents: DatadogIncidentEntity,
	},
} as const;

export type {
	DatadogDashboardEntity,
	DatadogIncidentEntity,
	DatadogMonitorEntity,
	DatadogSloEntity,
} from './database';
