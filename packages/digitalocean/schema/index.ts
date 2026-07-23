import {
	DigitalOceanDatabaseCluster,
	DigitalOceanDroplet,
	DigitalOceanVolume,
} from './database';

export const DigitalOceanSchema = {
	version: '1.0.0',
	entities: {
		droplets: DigitalOceanDroplet,
		volumes: DigitalOceanVolume,
		databases: DigitalOceanDatabaseCluster,
	},
} as const;
