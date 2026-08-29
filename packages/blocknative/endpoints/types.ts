import { z } from 'zod';
import {
	BlocknativeBaseFeeEstimates,
	BlocknativeBlockPrices,
	BlocknativeChain,
	BlocknativeGasDistribution,
	BlocknativeOracle,
} from '../schema';

const HexId = z
	.string()
	.regex(/^0x[0-9a-fA-F]+$/, 'Must be a 0x-prefixed hex string');

const TxHash = z
	.string()
	.regex(/^0x[0-9a-fA-F]{64}$/, 'Must be a 0x + 64 hex transaction hash');

const HexChainId = z
	.string()
	.regex(/^0x[0-9a-fA-F]+$/, "Hex-encoded chain ID, e.g. '0x1'");

export const GetGasPricesInputSchema = z.object({
	chainid: z.number().int().positive().optional(),
	system: z.string().optional(),
	network: z.string().optional(),
	confidenceLevels: z.array(z.number().int().min(1).max(99)).optional(),
});
export type GetGasPricesInput = z.infer<typeof GetGasPricesInputSchema>;
export const GetGasPricesOutputSchema = BlocknativeBlockPrices;
export type GetGasPricesOutput = z.infer<typeof GetGasPricesOutputSchema>;

export const GetBaseFeeEstimatesInputSchema = z.object({});
export type GetBaseFeeEstimatesInput = z.infer<
	typeof GetBaseFeeEstimatesInputSchema
>;
export const GetBaseFeeEstimatesOutputSchema = BlocknativeBaseFeeEstimates;
export type GetBaseFeeEstimatesOutput = z.infer<
	typeof GetBaseFeeEstimatesOutputSchema
>;

export const GetGasDistributionInputSchema = z.object({
	chainid: z.number().int().positive().optional(),
});
export type GetGasDistributionInput = z.infer<
	typeof GetGasDistributionInputSchema
>;
export const GetGasDistributionOutputSchema = BlocknativeGasDistribution;
export type GetGasDistributionOutput = z.infer<
	typeof GetGasDistributionOutputSchema
>;

export const GetGasOraclesInputSchema = z.object({});
export type GetGasOraclesInput = z.infer<typeof GetGasOraclesInputSchema>;
export const GetGasOraclesOutputSchema = z.object({
	oracles: z.array(BlocknativeOracle),
});
export type GetGasOraclesOutput = z.infer<typeof GetGasOraclesOutputSchema>;

export const GetSupportedChainsInputSchema = z.object({});
export type GetSupportedChainsInput = z.infer<
	typeof GetSupportedChainsInputSchema
>;
export const GetSupportedChainsOutputSchema = z.object({
	chains: z.array(BlocknativeChain),
});
export type GetSupportedChainsOutput = z.infer<
	typeof GetSupportedChainsOutputSchema
>;

export const ConfigureFiltersInputSchema = z.object({
	scope: z.string().min(1),
	filters: z.array(z.unknown()).optional(),
	abi: z.array(z.unknown()).optional(),
	watchAddress: z.boolean().optional(),
	system: z.string().optional(),
	network: z.string().optional(),
});
export type ConfigureFiltersInput = z.infer<typeof ConfigureFiltersInputSchema>;
export const ConfigureFiltersOutputSchema = z.object({
	websocketUrl: z.string(),
	initialize: z.record(z.string(), z.unknown()),
	config: z.record(z.string(), z.unknown()),
});
export type ConfigureFiltersOutput = z.infer<
	typeof ConfigureFiltersOutputSchema
>;

export const SubscribeTransactionHashInputSchema = z.object({
	hash: TxHash,
	system: z.string().optional(),
	network: z.string().optional(),
});
export type SubscribeTransactionHashInput = z.infer<
	typeof SubscribeTransactionHashInputSchema
>;
export const SubscribeTransactionHashOutputSchema = z.object({
	websocketUrl: z.string(),
	initialize: z.record(z.string(), z.unknown()),
	subscribe: z.record(z.string(), z.unknown()),
});
export type SubscribeTransactionHashOutput = z.infer<
	typeof SubscribeTransactionHashOutputSchema
>;

export const UnsubscribeTransactionHashInputSchema = z.object({
	hash: TxHash,
	system: z.string().optional(),
	network: z.string().optional(),
});
export type UnsubscribeTransactionHashInput = z.infer<
	typeof UnsubscribeTransactionHashInputSchema
>;
export const UnsubscribeTransactionHashOutputSchema = z.object({
	websocketUrl: z.string(),
	initialize: z.record(z.string(), z.unknown()),
	unsubscribe: z.record(z.string(), z.unknown()),
});
export type UnsubscribeTransactionHashOutput = z.infer<
	typeof UnsubscribeTransactionHashOutputSchema
>;

export const SubscribeMultichainInputSchema = z.object({
	id: HexId,
	type: z.enum(['transaction', 'account']),
	chainId: HexChainId,
	filters: z.array(z.unknown()).optional(),
	abi: z.array(z.unknown()).optional(),
});
export type SubscribeMultichainInput = z.infer<
	typeof SubscribeMultichainInputSchema
>;
export const SubscribeMultichainOutputSchema = z.object({
	websocketUrl: z.string(),
	initialize: z.record(z.string(), z.unknown()),
	subscribe: z.record(z.string(), z.unknown()),
});
export type SubscribeMultichainOutput = z.infer<
	typeof SubscribeMultichainOutputSchema
>;

export const UnsubscribeMultichainInputSchema = z.object({
	id: HexId,
	chainId: HexChainId.optional(),
});
export type UnsubscribeMultichainInput = z.infer<
	typeof UnsubscribeMultichainInputSchema
>;
export const UnsubscribeMultichainOutputSchema = z.object({
	id: z.string(),
	chainId: z.string().optional(),
	sdkCall: z.literal('unsubscribe'),
});
export type UnsubscribeMultichainOutput = z.infer<
	typeof UnsubscribeMultichainOutputSchema
>;

export type BlocknativeEndpointInputs = {
	getGasPrices: GetGasPricesInput;
	getBaseFeeEstimates: GetBaseFeeEstimatesInput;
	getGasDistribution: GetGasDistributionInput;
	getGasOracles: GetGasOraclesInput;
	getSupportedChains: GetSupportedChainsInput;
	configureFilters: ConfigureFiltersInput;
	subscribeTransactionHash: SubscribeTransactionHashInput;
	unsubscribeTransactionHash: UnsubscribeTransactionHashInput;
	subscribeMultichain: SubscribeMultichainInput;
	unsubscribeMultichain: UnsubscribeMultichainInput;
};

export type BlocknativeEndpointOutputs = {
	getGasPrices: GetGasPricesOutput;
	getBaseFeeEstimates: GetBaseFeeEstimatesOutput;
	getGasDistribution: GetGasDistributionOutput;
	getGasOracles: GetGasOraclesOutput;
	getSupportedChains: GetSupportedChainsOutput;
	configureFilters: ConfigureFiltersOutput;
	subscribeTransactionHash: SubscribeTransactionHashOutput;
	unsubscribeTransactionHash: UnsubscribeTransactionHashOutput;
	subscribeMultichain: SubscribeMultichainOutput;
	unsubscribeMultichain: UnsubscribeMultichainOutput;
};

export const BlocknativeEndpointInputSchemas = {
	getGasPrices: GetGasPricesInputSchema,
	getBaseFeeEstimates: GetBaseFeeEstimatesInputSchema,
	getGasDistribution: GetGasDistributionInputSchema,
	getGasOracles: GetGasOraclesInputSchema,
	getSupportedChains: GetSupportedChainsInputSchema,
	configureFilters: ConfigureFiltersInputSchema,
	subscribeTransactionHash: SubscribeTransactionHashInputSchema,
	unsubscribeTransactionHash: UnsubscribeTransactionHashInputSchema,
	subscribeMultichain: SubscribeMultichainInputSchema,
	unsubscribeMultichain: UnsubscribeMultichainInputSchema,
} as const;

export const BlocknativeEndpointOutputSchemas = {
	getGasPrices: GetGasPricesOutputSchema,
	getBaseFeeEstimates: GetBaseFeeEstimatesOutputSchema,
	getGasDistribution: GetGasDistributionOutputSchema,
	getGasOracles: GetGasOraclesOutputSchema,
	getSupportedChains: GetSupportedChainsOutputSchema,
	configureFilters: ConfigureFiltersOutputSchema,
	subscribeTransactionHash: SubscribeTransactionHashOutputSchema,
	unsubscribeTransactionHash: UnsubscribeTransactionHashOutputSchema,
	subscribeMultichain: SubscribeMultichainOutputSchema,
	unsubscribeMultichain: UnsubscribeMultichainOutputSchema,
} as const;
