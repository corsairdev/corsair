'use client';

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { sanityApiVersion, sanityDataset, sanityProjectId } from './sanity/env';
import { schemaTypes } from './sanity/schemaTypes';
import { structure } from './sanity/structure';

export default defineConfig({
	name: 'corsair-www',
	title: 'Corsair Blog',
	projectId: sanityProjectId ?? '',
	dataset: sanityDataset,
	basePath: '/studio',
	plugins: [
		structureTool({ structure }),
		...(process.env.NODE_ENV === 'development' ? [visionTool({ defaultApiVersion: sanityApiVersion })] : []),
	],
	schema: {
		types: schemaTypes,
	},
});
