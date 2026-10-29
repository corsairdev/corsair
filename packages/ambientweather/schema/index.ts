import { AmbientWeatherDevice, AmbientWeatherReading } from './database';

export const AmbientWeatherSchema = {
	version: '1.0.0',
	entities: {
		devices: AmbientWeatherDevice,
		readings: AmbientWeatherReading,
	},
} as const;

export {
	AmbientWeatherDevice,
	AmbientWeatherReading,
	pickAmbientWeatherReadingFields,
} from './database';
