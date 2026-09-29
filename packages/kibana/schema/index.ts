import { KibanaDataView, KibanaSavedObject, KibanaSpace } from './database';

export const KibanaSchema = {
	version: '1.0.0',
	entities: {
		savedObjects: KibanaSavedObject,
		spaces: KibanaSpace,
		dataViews: KibanaDataView,
	},
} as const;

export * from './database';
