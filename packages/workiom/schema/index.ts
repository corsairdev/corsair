import {
	WorkiomField,
	WorkiomFilter,
	WorkiomList,
	WorkiomRecord,
	WorkiomRecordPage,
	WorkiomView,
} from './database';

export const WorkiomSchema = {
	version: '1.0.0',
	entities: {
		lists: WorkiomList,
		fields: WorkiomField,
		views: WorkiomView,
		filters: WorkiomFilter,
		records: WorkiomRecord,
		recordPages: WorkiomRecordPage,
	},
} as const;

export {
	WorkiomDataType,
	WorkiomField,
	WorkiomFilter,
	WorkiomFilterOperator,
	WorkiomList,
	WorkiomRecord,
	WorkiomRecordPage,
	WorkiomView,
} from './database';
