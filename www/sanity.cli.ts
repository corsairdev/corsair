import { defineCliConfig } from 'sanity/cli';

import { sanityDataset, sanityProjectId } from './sanity/env';

export default defineCliConfig({
	api: {
		projectId: sanityProjectId ?? '',
		dataset: sanityDataset,
	},
	studioHost: 'corsair-www',
});
