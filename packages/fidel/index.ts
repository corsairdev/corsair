import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	createBrand,
	deleteBrand,
	listBrands,
	retrieveBrand,
	updateBrand,
} from './endpoints/brands';
import {
	createLocation,
	deleteLocation,
	listLocations,
	listLocationsByBrand,
	listLocationsByOffer,
	retrieveLocation,
	updateLocation,
} from './endpoints/locations';
import {
	createProgram,
	listPrograms,
	retrieveProgram,
	updateProgram,
} from './endpoints/programs';
import type {
	FidelEndpointInputs,
	FidelEndpointOutputs,
} from './endpoints/types';
import {
	FidelEndpointInputSchemas,
	FidelEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FidelSchema } from './schema';

export type FidelPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFidelPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof fidelEndpointsNested>;
};

const defaultAuthType: AuthTypes = 'api_key';

export const fidelAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFidelPlugin<T extends FidelPluginOptions> = CorsairPlugin<
	'fidel',
	typeof FidelSchema,
	typeof fidelEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalFidelPlugin = BaseFidelPlugin<FidelPluginOptions>;

export type ExternalFidelPlugin<T extends FidelPluginOptions> =
	BaseFidelPlugin<T>;

export type FidelContext = CorsairPluginContext<
	typeof FidelSchema,
	FidelPluginOptions
>;

export type FidelEndpoints = {
	[K in keyof FidelEndpointInputs]: CorsairEndpoint<
		FidelContext,
		FidelEndpointInputs[K],
		FidelEndpointOutputs[K]
	>;
};

// Binds every Fidel endpoint to its declared input and output schemas.
// Calls use this validated tree at runtime; the schemas registry stays as
// introspection metadata. The runtime context and per-operation shapes are
// intentional opacity: each unknown below carries its own justification.
function withFidelSchemas<
	T extends Record<string, unknown>, // unknown: the tree mixes endpoint functions with family objects at any depth
>(tree: T, prefix = ''): T {
	const validatedEntries = Object.entries(tree).map(([key, value]) => {
		const operation = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') {
			const schema =
				fidelEndpointSchemas[operation as keyof typeof fidelEndpointSchemas];
			if (!schema) {
				throw new Error(`Missing Fidel endpoint schema for ${operation}`);
			}
			const endpoint = value as (
				ctx: unknown, // unknown: the Corsair runtime context varies by deployment; passed through untouched
				input: unknown, // unknown: parsed by schema.input.parse before the call
			) => Promise<unknown>; // unknown: each operation returns its own documented shape, parsed by schema.output.parse
			const validated = async (
				ctx: unknown, // unknown: same runtime context as above; only the schema boundary wraps the call
				input: unknown, // unknown: caller-supplied payload, parsed before transport
			) => {
				const parsedInput = schema.input.parse(input ?? {});
				const result = await endpoint(ctx, parsedInput);
				return schema.output.parse(result);
			};
			return [key, validated];
		}
		if (value && typeof value === 'object') {
			return [
				key,
				// unknown: family group nodes are plain objects at arbitrary
				// depth; the wrapper recurses so every nested leaf gets a
				// contract from the registry.
				withFidelSchemas(
					value as Record<string, unknown>, // unknown: a family group object, recursed one level deeper
					operation,
				),
			];
		}
		return [key, value];
	});
	// unknown: the rebuild keeps the caller's tree shape while every leaf is
	// replaced by its schema-validated wrapper; TypeScript cannot express the
	// mixed function/object remap structurally, and the satisfies-checked
	// tree definition plus the endpoint schemas registry keep it honest.
	return Object.fromEntries(validatedEntries) as T; // unknown: same tree shape, leaves wrapped by their contracts
}

const fidelEndpointsNested = {
	brands: {
		createBrand: createBrand,
		retrieveBrand: retrieveBrand,
		listBrands: listBrands,
		updateBrand: updateBrand,
		deleteBrand: deleteBrand,
	},
	programs: {
		listPrograms: listPrograms,
		createProgram: createProgram,
		updateProgram: updateProgram,
		retrieveProgram: retrieveProgram,
	},
	locations: {
		createLocation: createLocation,
		retrieveLocation: retrieveLocation,
		updateLocation: updateLocation,
		listLocations: listLocations,
		listLocationsByBrand: listLocationsByBrand,
		listLocationsByOffer: listLocationsByOffer,
		deleteLocation: deleteLocation,
	},
} as const;

export const fidelEndpointMeta = {
	'brands.createBrand': {
		riskLevel: 'write',
		description: 'Create a brand on Fidel',
	},
	'brands.retrieveBrand': {
		riskLevel: 'read',
		description: 'Retrieve a brand by ID',
	},
	'brands.listBrands': {
		riskLevel: 'read',
		description: 'List the brands on the Fidel account',
	},
	'brands.updateBrand': {
		riskLevel: 'write',
		description: 'Update the details of a brand',
	},
	'brands.deleteBrand': {
		riskLevel: 'destructive',
		description: 'Delete a brand from the Fidel account',
	},
	'programs.listPrograms': {
		riskLevel: 'read',
		description: 'List the programs on the Fidel account',
	},
	'programs.createProgram': {
		riskLevel: 'write',
		description: 'Create a program on Fidel',
	},
	'programs.updateProgram': {
		riskLevel: 'write',
		description: 'Update the details of a program',
	},
	'programs.retrieveProgram': {
		riskLevel: 'read',
		description: 'Retrieve a program by ID',
	},
	'locations.createLocation': {
		riskLevel: 'write',
		description: 'Create a location under a program and brand',
	},
	'locations.retrieveLocation': {
		riskLevel: 'read',
		description: 'Retrieve a location by ID',
	},
	'locations.updateLocation': {
		riskLevel: 'write',
		description: 'Update the details of a location',
	},
	'locations.listLocations': {
		riskLevel: 'read',
		description: 'List the locations of a program',
	},
	'locations.listLocationsByBrand': {
		riskLevel: 'read',
		description: 'List the locations of a brand within a program',
	},
	'locations.listLocationsByOffer': {
		riskLevel: 'read',
		description: 'List the locations linked to an offer',
	},
	'locations.deleteLocation': {
		riskLevel: 'destructive',
		description: 'Delete a location from a program',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof fidelEndpointsNested>;

export const fidelEndpointSchemas = {
	'brands.createBrand': {
		input: FidelEndpointInputSchemas.createBrand,
		output: FidelEndpointOutputSchemas.createBrand,
	},
	'brands.retrieveBrand': {
		input: FidelEndpointInputSchemas.retrieveBrand,
		output: FidelEndpointOutputSchemas.retrieveBrand,
	},
	'brands.listBrands': {
		input: FidelEndpointInputSchemas.listBrands,
		output: FidelEndpointOutputSchemas.listBrands,
	},
	'brands.updateBrand': {
		input: FidelEndpointInputSchemas.updateBrand,
		output: FidelEndpointOutputSchemas.updateBrand,
	},
	'brands.deleteBrand': {
		input: FidelEndpointInputSchemas.deleteBrand,
		output: FidelEndpointOutputSchemas.deleteBrand,
	},
	'programs.listPrograms': {
		input: FidelEndpointInputSchemas.listPrograms,
		output: FidelEndpointOutputSchemas.listPrograms,
	},
	'programs.createProgram': {
		input: FidelEndpointInputSchemas.createProgram,
		output: FidelEndpointOutputSchemas.createProgram,
	},
	'programs.updateProgram': {
		input: FidelEndpointInputSchemas.updateProgram,
		output: FidelEndpointOutputSchemas.updateProgram,
	},
	'programs.retrieveProgram': {
		input: FidelEndpointInputSchemas.retrieveProgram,
		output: FidelEndpointOutputSchemas.retrieveProgram,
	},
	'locations.createLocation': {
		input: FidelEndpointInputSchemas.createLocation,
		output: FidelEndpointOutputSchemas.createLocation,
	},
	'locations.retrieveLocation': {
		input: FidelEndpointInputSchemas.retrieveLocation,
		output: FidelEndpointOutputSchemas.retrieveLocation,
	},
	'locations.updateLocation': {
		input: FidelEndpointInputSchemas.updateLocation,
		output: FidelEndpointOutputSchemas.updateLocation,
	},
	'locations.listLocations': {
		input: FidelEndpointInputSchemas.listLocations,
		output: FidelEndpointOutputSchemas.listLocations,
	},
	'locations.listLocationsByBrand': {
		input: FidelEndpointInputSchemas.listLocationsByBrand,
		output: FidelEndpointOutputSchemas.listLocationsByBrand,
	},
	'locations.listLocationsByOffer': {
		input: FidelEndpointInputSchemas.listLocationsByOffer,
		output: FidelEndpointOutputSchemas.listLocationsByOffer,
	},
	'locations.deleteLocation': {
		input: FidelEndpointInputSchemas.deleteLocation,
		output: FidelEndpointOutputSchemas.deleteLocation,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof fidelEndpointsNested>;

const validatedFidelEndpointsNested = withFidelSchemas(fidelEndpointsNested);

export function fidel<const T extends FidelPluginOptions>(
	incomingOptions: FidelPluginOptions & T = {} as FidelPluginOptions & T,
): ExternalFidelPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'fidel',
		authConfig: fidelAuthConfig,
		schema: FidelSchema,
		endpoints: validatedFidelEndpointsNested,
		endpointSchemas: fidelEndpointSchemas,
		endpointMeta: fidelEndpointMeta,
		errorHandlers,
		options: options as never,
	};
}
