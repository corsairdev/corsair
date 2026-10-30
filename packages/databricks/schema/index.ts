import {
	DatabricksCatalogEntity,
	DatabricksClusterEntity,
	DatabricksJobEntity,
	DatabricksWarehouseEntity,
} from './database';

export const DatabricksSchema = {
	version: '0.1.0',
	entities: {
		cluster: DatabricksClusterEntity,
		job: DatabricksJobEntity,
		catalog: DatabricksCatalogEntity,
		warehouse: DatabricksWarehouseEntity,
	},
} as const;

export * from './database';
