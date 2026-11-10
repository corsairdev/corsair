// Public endpoint types for the plugin. Schemas live per family in
// <family>-types.ts and aggregate in registry.ts (the large-catalog
// pattern); this file is the stable public surface consumers import.

export type {
	ErpnextEndpointInputs,
	ErpnextEndpointOutputs,
} from './registry';
export {
	ErpnextEndpointInputSchemas,
	ErpnextEndpointOutputSchemas,
} from './registry';
