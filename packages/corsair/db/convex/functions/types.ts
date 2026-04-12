import type {
	DataModelFromSchemaDefinition,
	GenericQueryCtx,
	GenericMutationCtx,
} from 'convex/server';
import type schema from '../schema';

type DataModel = DataModelFromSchemaDefinition<typeof schema>;

export type QueryCtx = GenericQueryCtx<DataModel>;
export type MutationCtx = GenericMutationCtx<DataModel>;
