import { z } from 'zod';
import {
	BlocknativeBaseFeeEstimates,
	BlocknativeBlockPrices,
	BlocknativeChain,
	BlocknativeGasDistribution,
	BlocknativeOracle,
} from '../schema';

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

export type BlocknativeEndpointInputs = {
	getGasPrices: GetGasPricesInput;
	getBaseFeeEstimates: GetBaseFeeEstimatesInput;
	getGasDistribution: GetGasDistributionInput;
	getGasOracles: GetGasOraclesInput;
	getSupportedChains: GetSupportedChainsInput;
};

export type BlocknativeEndpointOutputs = {
	getGasPrices: GetGasPricesOutput;
	getBaseFeeEstimates: GetBaseFeeEstimatesOutput;
	getGasDistribution: GetGasDistributionOutput;
	getGasOracles: GetGasOraclesOutput;
	getSupportedChains: GetSupportedChainsOutput;
};

export const BlocknativeEndpointInputSchemas = {
	getGasPrices: GetGasPricesInputSchema,
	getBaseFeeEstimates: GetBaseFeeEstimatesInputSchema,
	getGasDistribution: GetGasDistributionInputSchema,
	getGasOracles: GetGasOraclesInputSchema,
	getSupportedChains: GetSupportedChainsInputSchema,
} as const;

export const BlocknativeEndpointOutputSchemas = {
	getGasPrices: GetGasPricesOutputSchema,
	getBaseFeeEstimates: GetBaseFeeEstimatesOutputSchema,
	getGasDistribution: GetGasDistributionOutputSchema,
	getGasOracles: GetGasOraclesOutputSchema,
	getSupportedChains: GetSupportedChainsOutputSchema,
} as const;
