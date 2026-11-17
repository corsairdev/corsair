import {
	GlobalpingHealthEntity,
	GlobalpingLimitEntity,
	GlobalpingMeasurementEntity,
} from './database';

export const GlobalpingSchema = {
	version: '1.0.0',
	entities: {
		limits: GlobalpingLimitEntity,
		measurements: GlobalpingMeasurementEntity,
		health: GlobalpingHealthEntity,
	},
} as const;
