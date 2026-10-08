import { crawlApi } from './crawl-api';
import { filterDataset } from './filter-dataset';
import { getAvailableCities } from './get-available-cities';
import { getAvailableCountries } from './get-available-countries';
import { getSnapshotResults } from './get-snapshot-results';
import { getSnapshotStatus } from './get-snapshot-status';
import { listDatasets } from './list-datasets';
import { listWebUnlockerZones } from './list-web-unlocker-zones';
import { serpSearch } from './serp-search';
import { webUnlocker } from './web-unlocker';

export const BrightDataEndpointsImpl = {
	listDatasets,
	getSnapshotStatus,
	getSnapshotResults,
	filterDataset,
	getAvailableCities,
	getAvailableCountries,
	listWebUnlockerZones,
	serpSearch,
	crawlApi,
	webUnlocker,
};

export * from './types';
