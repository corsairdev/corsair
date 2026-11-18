import {
	StormglassExtremeEntity,
	StormglassPointEntity,
	StormglassQuotaEntity,
	StormglassStationEntity,
} from './database';

export const StormglassSchema = {
	version: '1.0.0',
	entities: {
		stations: StormglassStationEntity,
		points: StormglassPointEntity,
		extremes: StormglassExtremeEntity,
		quotas: StormglassQuotaEntity,
	},
} as const;
