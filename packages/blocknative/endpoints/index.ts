import {
	getBaseFeeEstimates,
	getGasDistribution,
	getGasOracles,
	getGasPrices,
	getSupportedChains,
} from './gas';

export const Gas = {
	getPrices: getGasPrices,
	getBaseFeeEstimates,
	getDistribution: getGasDistribution,
	getOracles: getGasOracles,
	getSupportedChains,
};

export * from './types';
