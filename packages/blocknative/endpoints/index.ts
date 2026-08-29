import {
	getBaseFeeEstimates,
	getGasDistribution,
	getGasOracles,
	getGasPrices,
	getSupportedChains,
} from './gas';
import {
	configureFilters,
	subscribeMultichain,
	subscribeTransactionHash,
	unsubscribeMultichain,
	unsubscribeTransactionHash,
} from './websocket';

export const Gas = {
	getPrices: getGasPrices,
	getBaseFeeEstimates,
	getDistribution: getGasDistribution,
	getOracles: getGasOracles,
	getSupportedChains,
};

export const Mempool = {
	configureFilters,
	subscribeTransactionHash,
	unsubscribeTransactionHash,
};

export const Multichain = {
	subscribe: subscribeMultichain,
	unsubscribe: unsubscribeMultichain,
};

export * from './types';
