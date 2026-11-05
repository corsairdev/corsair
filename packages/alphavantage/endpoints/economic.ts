import { logEventFromContext } from 'corsair/core';
import { makeAlphaVantageRequest } from '../client';
import type { AlphaVantageEndpoints } from '../index';
import { indicatorSeriesEndpoint } from './indicator-series';
import { auditPayload } from './logging';
import { compactQuery } from './shared';
import type { AlphaVantageEndpointOutputs } from './types';

/**
 * United States macroeconomic indicators.
 *
 * All ten return the shared indicator envelope. Nine take at most an interval
 * and are built from the common factory; the treasury yield also takes a
 * maturity and is written out in full.
 */

export const realGdp: AlphaVantageEndpoints['economicRealGdp'] =
	indicatorSeriesEndpoint('REAL_GDP', 'economic.realGdp');

export const realGdpPerCapita: AlphaVantageEndpoints['economicRealGdpPerCapita'] =
	indicatorSeriesEndpoint('REAL_GDP_PER_CAPITA', 'economic.realGdpPerCapita');

export const federalFundsRate: AlphaVantageEndpoints['economicFederalFundsRate'] =
	indicatorSeriesEndpoint('FEDERAL_FUNDS_RATE', 'economic.federalFundsRate');

export const cpi: AlphaVantageEndpoints['economicCpi'] =
	indicatorSeriesEndpoint('CPI', 'economic.cpi');

export const inflation: AlphaVantageEndpoints['economicInflation'] =
	indicatorSeriesEndpoint('INFLATION', 'economic.inflation');

export const retailSales: AlphaVantageEndpoints['economicRetailSales'] =
	indicatorSeriesEndpoint('RETAIL_SALES', 'economic.retailSales');

export const durables: AlphaVantageEndpoints['economicDurables'] =
	indicatorSeriesEndpoint('DURABLES', 'economic.durables');

export const nonfarmPayroll: AlphaVantageEndpoints['economicNonfarmPayroll'] =
	indicatorSeriesEndpoint('NONFARM_PAYROLL', 'economic.nonfarmPayroll');

export const unemployment: AlphaVantageEndpoints['economicUnemployment'] =
	indicatorSeriesEndpoint('UNEMPLOYMENT', 'economic.unemployment');

/**
 * US treasury yield for a given constant maturity.
 *
 * The only indicator in this group that takes a second parameter, so it does
 * not use the shared factory.
 */
export const treasuryYield: AlphaVantageEndpoints['economicTreasuryYield'] =
	async (ctx, input) => {
		const result = await makeAlphaVantageRequest<
			AlphaVantageEndpointOutputs['economicTreasuryYield']
		>(
			'TREASURY_YIELD',
			ctx.key,
			compactQuery({ interval: input.interval, maturity: input.maturity }),
		);

		await logEventFromContext(
			ctx,
			'alphavantage.economic.treasuryYield',
			auditPayload(input, ['interval', 'maturity']),
			'completed',
		);
		return result;
	};
