import type { AhrefsEndpoints } from '../index';
import { callAhrefs } from './request';
import type {
	WebAnalyticsBrowsersChartResponse,
	WebAnalyticsBrowsersResponse,
	WebAnalyticsBrowserVersionsChartResponse,
	WebAnalyticsBrowserVersionsResponse,
	WebAnalyticsCitiesChartResponse,
	WebAnalyticsCitiesResponse,
	WebAnalyticsContinentsChartResponse,
	WebAnalyticsContinentsResponse,
	WebAnalyticsCountriesChartResponse,
	WebAnalyticsCountriesResponse,
	WebAnalyticsDevicesChartResponse,
	WebAnalyticsDevicesResponse,
	WebAnalyticsEntryPagesChartResponse,
	WebAnalyticsEntryPagesResponse,
	WebAnalyticsExitPagesChartResponse,
	WebAnalyticsExitPagesResponse,
	WebAnalyticsLanguagesChartResponse,
	WebAnalyticsLanguagesResponse,
	WebAnalyticsOperatingSystemsChartResponse,
	WebAnalyticsOperatingSystemsResponse,
	WebAnalyticsOperatingSystemsVersionsChartResponse,
	WebAnalyticsOperatingSystemsVersionsResponse,
	WebAnalyticsReferrersChartResponse,
	WebAnalyticsReferrersResponse,
	WebAnalyticsSourceChannelsChartResponse,
	WebAnalyticsSourceChannelsResponse,
	WebAnalyticsSourcesChartResponse,
	WebAnalyticsSourcesResponse,
	WebAnalyticsStatsResponse,
	WebAnalyticsTopPagesChartResponse,
	WebAnalyticsTopPagesResponse,
	WebAnalyticsTotalsChartResponse,
	WebAnalyticsUtmParamsChartResponse,
	WebAnalyticsUtmParamsResponse,
} from './types';

export const stats: AhrefsEndpoints['webAnalyticsStats'] = (ctx, input) =>
	callAhrefs<WebAnalyticsStatsResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/stats',
			event: 'ahrefs.webAnalytics.stats',
			logKeys: ['project_id', 'from', 'to'],
		},
		input,
	);

export const chart: AhrefsEndpoints['webAnalyticsChart'] = (ctx, input) =>
	callAhrefs<WebAnalyticsTotalsChartResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/chart',
			event: 'ahrefs.webAnalytics.chart',
			logKeys: ['project_id', 'from', 'to', 'granularity'],
		},
		input,
	);

export const topPages: AhrefsEndpoints['webAnalyticsTopPages'] = (ctx, input) =>
	callAhrefs<WebAnalyticsTopPagesResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/top-pages',
			event: 'ahrefs.webAnalytics.topPages',
			logKeys: ['project_id', 'from', 'to'],
		},
		input,
	);

export const topPagesChart: AhrefsEndpoints['webAnalyticsTopPagesChart'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsTopPagesChartResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/top-pages-chart',
			event: 'ahrefs.webAnalytics.topPagesChart',
			logKeys: ['project_id', 'from', 'to', 'granularity'],
		},
		input,
	);

export const entryPages: AhrefsEndpoints['webAnalyticsEntryPages'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsEntryPagesResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/entry-pages',
			event: 'ahrefs.webAnalytics.entryPages',
			logKeys: ['project_id', 'from', 'to'],
		},
		input,
	);

export const entryPagesChart: AhrefsEndpoints['webAnalyticsEntryPagesChart'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsEntryPagesChartResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/entry-pages-chart',
			event: 'ahrefs.webAnalytics.entryPagesChart',
			logKeys: ['project_id', 'from', 'to', 'granularity'],
		},
		input,
	);

export const exitPages: AhrefsEndpoints['webAnalyticsExitPages'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsExitPagesResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/exit-pages',
			event: 'ahrefs.webAnalytics.exitPages',
			logKeys: ['project_id', 'from', 'to'],
		},
		input,
	);

export const exitPagesChart: AhrefsEndpoints['webAnalyticsExitPagesChart'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsExitPagesChartResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/exit-pages-chart',
			event: 'ahrefs.webAnalytics.exitPagesChart',
			logKeys: ['project_id', 'from', 'to', 'granularity'],
		},
		input,
	);

export const referrers: AhrefsEndpoints['webAnalyticsReferrers'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsReferrersResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/referrers',
			event: 'ahrefs.webAnalytics.referrers',
			logKeys: ['project_id', 'from', 'to'],
		},
		input,
	);

export const referrersChart: AhrefsEndpoints['webAnalyticsReferrersChart'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsReferrersChartResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/referrers-chart',
			event: 'ahrefs.webAnalytics.referrersChart',
			logKeys: ['project_id', 'from', 'to', 'granularity'],
		},
		input,
	);

export const sources: AhrefsEndpoints['webAnalyticsSources'] = (ctx, input) =>
	callAhrefs<WebAnalyticsSourcesResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/sources',
			event: 'ahrefs.webAnalytics.sources',
			logKeys: ['project_id', 'from', 'to'],
		},
		input,
	);

export const sourcesChart: AhrefsEndpoints['webAnalyticsSourcesChart'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsSourcesChartResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/sources-chart',
			event: 'ahrefs.webAnalytics.sourcesChart',
			logKeys: ['project_id', 'from', 'to', 'granularity'],
		},
		input,
	);

export const sourceChannels: AhrefsEndpoints['webAnalyticsSourceChannels'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsSourceChannelsResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/source-channels',
			event: 'ahrefs.webAnalytics.sourceChannels',
			logKeys: ['project_id', 'from', 'to'],
		},
		input,
	);

export const sourceChannelsChart: AhrefsEndpoints['webAnalyticsSourceChannelsChart'] =
	(ctx, input) =>
		callAhrefs<WebAnalyticsSourceChannelsChartResponse>(
			ctx,
			{
				method: 'GET',
				path: '/web-analytics/source-channels-chart',
				event: 'ahrefs.webAnalytics.sourceChannelsChart',
				logKeys: ['project_id', 'from', 'to', 'granularity'],
			},
			input,
		);

export const utmParams: AhrefsEndpoints['webAnalyticsUtmParams'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsUtmParamsResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/utm-params',
			event: 'ahrefs.webAnalytics.utmParams',
			logKeys: ['project_id', 'from', 'to', 'utm_param'],
		},
		input,
	);

export const utmParamsChart: AhrefsEndpoints['webAnalyticsUtmParamsChart'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsUtmParamsChartResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/utm-params-chart',
			event: 'ahrefs.webAnalytics.utmParamsChart',
			logKeys: ['project_id', 'from', 'to', 'utm_param', 'granularity'],
		},
		input,
	);

export const countries: AhrefsEndpoints['webAnalyticsCountries'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsCountriesResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/countries',
			event: 'ahrefs.webAnalytics.countries',
			logKeys: ['project_id', 'from', 'to'],
		},
		input,
	);

export const countriesChart: AhrefsEndpoints['webAnalyticsCountriesChart'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsCountriesChartResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/countries-chart',
			event: 'ahrefs.webAnalytics.countriesChart',
			logKeys: ['project_id', 'from', 'to', 'granularity'],
		},
		input,
	);

export const cities: AhrefsEndpoints['webAnalyticsCities'] = (ctx, input) =>
	callAhrefs<WebAnalyticsCitiesResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/cities',
			event: 'ahrefs.webAnalytics.cities',
			logKeys: ['project_id', 'from', 'to'],
		},
		input,
	);

export const citiesChart: AhrefsEndpoints['webAnalyticsCitiesChart'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsCitiesChartResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/cities-chart',
			event: 'ahrefs.webAnalytics.citiesChart',
			logKeys: ['project_id', 'from', 'to', 'granularity'],
		},
		input,
	);

export const continents: AhrefsEndpoints['webAnalyticsContinents'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsContinentsResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/continents',
			event: 'ahrefs.webAnalytics.continents',
			logKeys: ['project_id', 'from', 'to'],
		},
		input,
	);

export const continentsChart: AhrefsEndpoints['webAnalyticsContinentsChart'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsContinentsChartResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/continents-chart',
			event: 'ahrefs.webAnalytics.continentsChart',
			logKeys: ['project_id', 'from', 'to', 'granularity'],
		},
		input,
	);

export const languages: AhrefsEndpoints['webAnalyticsLanguages'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsLanguagesResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/languages',
			event: 'ahrefs.webAnalytics.languages',
			logKeys: ['project_id', 'from', 'to'],
		},
		input,
	);

export const languagesChart: AhrefsEndpoints['webAnalyticsLanguagesChart'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsLanguagesChartResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/languages-chart',
			event: 'ahrefs.webAnalytics.languagesChart',
			logKeys: ['project_id', 'from', 'to', 'granularity'],
		},
		input,
	);

export const devices: AhrefsEndpoints['webAnalyticsDevices'] = (ctx, input) =>
	callAhrefs<WebAnalyticsDevicesResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/devices',
			event: 'ahrefs.webAnalytics.devices',
			logKeys: ['project_id', 'from', 'to'],
		},
		input,
	);

export const devicesChart: AhrefsEndpoints['webAnalyticsDevicesChart'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsDevicesChartResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/devices-chart',
			event: 'ahrefs.webAnalytics.devicesChart',
			logKeys: ['project_id', 'from', 'to', 'granularity'],
		},
		input,
	);

export const browsers: AhrefsEndpoints['webAnalyticsBrowsers'] = (ctx, input) =>
	callAhrefs<WebAnalyticsBrowsersResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/browsers',
			event: 'ahrefs.webAnalytics.browsers',
			logKeys: ['project_id', 'from', 'to'],
		},
		input,
	);

export const browsersChart: AhrefsEndpoints['webAnalyticsBrowsersChart'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsBrowsersChartResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/browsers-chart',
			event: 'ahrefs.webAnalytics.browsersChart',
			logKeys: ['project_id', 'from', 'to', 'granularity'],
		},
		input,
	);

export const browserVersions: AhrefsEndpoints['webAnalyticsBrowserVersions'] = (
	ctx,
	input,
) =>
	callAhrefs<WebAnalyticsBrowserVersionsResponse>(
		ctx,
		{
			method: 'GET',
			path: '/web-analytics/browser-versions',
			event: 'ahrefs.webAnalytics.browserVersions',
			logKeys: ['project_id', 'from', 'to'],
		},
		input,
	);

export const browserVersionsChart: AhrefsEndpoints['webAnalyticsBrowserVersionsChart'] =
	(ctx, input) =>
		callAhrefs<WebAnalyticsBrowserVersionsChartResponse>(
			ctx,
			{
				method: 'GET',
				path: '/web-analytics/browser-versions-chart',
				event: 'ahrefs.webAnalytics.browserVersionsChart',
				logKeys: ['project_id', 'from', 'to', 'granularity'],
			},
			input,
		);

export const operatingSystems: AhrefsEndpoints['webAnalyticsOperatingSystems'] =
	(ctx, input) =>
		callAhrefs<WebAnalyticsOperatingSystemsResponse>(
			ctx,
			{
				method: 'GET',
				path: '/web-analytics/operating-systems',
				event: 'ahrefs.webAnalytics.operatingSystems',
				logKeys: ['project_id', 'from', 'to'],
			},
			input,
		);

export const operatingSystemsChart: AhrefsEndpoints['webAnalyticsOperatingSystemsChart'] =
	(ctx, input) =>
		callAhrefs<WebAnalyticsOperatingSystemsChartResponse>(
			ctx,
			{
				method: 'GET',
				path: '/web-analytics/operating-systems-chart',
				event: 'ahrefs.webAnalytics.operatingSystemsChart',
				logKeys: ['project_id', 'from', 'to', 'granularity'],
			},
			input,
		);

export const operatingSystemsVersions: AhrefsEndpoints['webAnalyticsOperatingSystemsVersions'] =
	(ctx, input) =>
		callAhrefs<WebAnalyticsOperatingSystemsVersionsResponse>(
			ctx,
			{
				method: 'GET',
				path: '/web-analytics/operating-systems-versions',
				event: 'ahrefs.webAnalytics.operatingSystemsVersions',
				logKeys: ['project_id', 'from', 'to'],
			},
			input,
		);

export const operatingSystemsVersionsChart: AhrefsEndpoints['webAnalyticsOperatingSystemsVersionsChart'] =
	(ctx, input) =>
		callAhrefs<WebAnalyticsOperatingSystemsVersionsChartResponse>(
			ctx,
			{
				method: 'GET',
				path: '/web-analytics/operating-systems-versions-chart',
				event: 'ahrefs.webAnalytics.operatingSystemsVersionsChart',
				logKeys: ['project_id', 'from', 'to', 'granularity'],
			},
			input,
		);
