import {
	BrightDataCities,
	BrightDataCountries,
	BrightDataDataset,
	BrightDataSerpResult,
	BrightDataSnapshotProgress,
	BrightDataSnapshotRef,
	BrightDataSnapshotResults,
	BrightDataUnlockerResult,
	BrightDataZone,
} from './database';

export const BrightDataSchema = {
	version: '1.0.0',
	entities: {
		datasets: BrightDataDataset,
		snapshotRefs: BrightDataSnapshotRef,
		snapshotProgress: BrightDataSnapshotProgress,
		snapshotResults: BrightDataSnapshotResults,
		zones: BrightDataZone,
		countries: BrightDataCountries,
		cities: BrightDataCities,
		unlockerResults: BrightDataUnlockerResult,
		serpResults: BrightDataSerpResult,
	},
} as const;

export {
	BrightDataCities,
	BrightDataCountries,
	BrightDataCountryCodes,
	BrightDataDataset,
	BrightDataSerpResult,
	BrightDataSnapshotProgress,
	BrightDataSnapshotRef,
	BrightDataSnapshotResults,
	BrightDataUnlockerJson,
	BrightDataUnlockerResult,
	BrightDataZone,
} from './database';
