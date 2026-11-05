import {
	BetterstackHeartbeatGroups,
	BetterstackHeartbeats,
	BetterstackMonitorGroups,
	BetterstackMonitors,
	BetterstackOnCallSchedules,
	BetterstackPolicies,
	BetterstackStatusPages,
	BetterstackUrgencies,
} from './database';

export const BetterstackSchema = {
	version: '1.0.0',
	entities: {
		monitors: BetterstackMonitors,
		monitorGroups: BetterstackMonitorGroups,
		heartbeats: BetterstackHeartbeats,
		heartbeatGroups: BetterstackHeartbeatGroups,
		policies: BetterstackPolicies,
		urgencies: BetterstackUrgencies,
		statusPages: BetterstackStatusPages,
		onCallSchedules: BetterstackOnCallSchedules,
	},
} as const;

export * from './database';
