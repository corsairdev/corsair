import type { AlphaVantageEndpoints } from '../index';
import { indicatorSeriesEndpoint } from './indicator-series';

/**
 * Global commodity price series.
 *
 * Every operation here returns the shared indicator envelope, so all nine are
 * built from the same factory. Note the interval range differs: Brent crude is
 * published daily, weekly and monthly, while the metals and agricultural
 * commodities are monthly, quarterly and annual. That difference is enforced by
 * the input schemas in `types.ts`.
 *
 * The catalog omits WTI crude and natural gas even though Alpha Vantage
 * publishes both; this plugin matches the catalog rather than adding them.
 */

export const all: AlphaVantageEndpoints['commoditiesAll'] =
	indicatorSeriesEndpoint('ALL_COMMODITIES', 'commodities.all');

export const aluminum: AlphaVantageEndpoints['commoditiesAluminum'] =
	indicatorSeriesEndpoint('ALUMINUM', 'commodities.aluminum');

export const brent: AlphaVantageEndpoints['commoditiesBrent'] =
	indicatorSeriesEndpoint('BRENT', 'commodities.brent');

export const coffee: AlphaVantageEndpoints['commoditiesCoffee'] =
	indicatorSeriesEndpoint('COFFEE', 'commodities.coffee');

export const copper: AlphaVantageEndpoints['commoditiesCopper'] =
	indicatorSeriesEndpoint('COPPER', 'commodities.copper');

export const corn: AlphaVantageEndpoints['commoditiesCorn'] =
	indicatorSeriesEndpoint('CORN', 'commodities.corn');

export const cotton: AlphaVantageEndpoints['commoditiesCotton'] =
	indicatorSeriesEndpoint('COTTON', 'commodities.cotton');

export const sugar: AlphaVantageEndpoints['commoditiesSugar'] =
	indicatorSeriesEndpoint('SUGAR', 'commodities.sugar');

export const wheat: AlphaVantageEndpoints['commoditiesWheat'] =
	indicatorSeriesEndpoint('WHEAT', 'commodities.wheat');
