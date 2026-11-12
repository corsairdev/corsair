import type { AhrefsEndpoints } from '../index';
import { callAhrefs } from './request';

export const stats: AhrefsEndpoints['webAnalyticsStats'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsStats',
			method: 'GET',
			path: '/web-analytics/stats',
			event: 'ahrefs.webAnalytics.stats',
			logKeys: ['project_id', 'from', 'to'],
		},
		input,
	);

export const chart: AhrefsEndpoints['webAnalyticsChart'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsChart',
			method: 'GET',
			path: '/web-analytics/chart',
			event: 'ahrefs.webAnalytics.chart',
			logKeys: ['project_id', 'from', 'to', 'granularity'],
		},
		input,
	);

export const topPages: AhrefsEndpoints['webAnalyticsTopPages'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsTopPages',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsTopPagesChart',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsEntryPages',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsEntryPagesChart',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsExitPages',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsExitPagesChart',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsReferrers',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsReferrersChart',
			method: 'GET',
			path: '/web-analytics/referrers-chart',
			event: 'ahrefs.webAnalytics.referrersChart',
			logKeys: ['project_id', 'from', 'to', 'granularity'],
		},
		input,
	);

export const sources: AhrefsEndpoints['webAnalyticsSources'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsSources',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsSourcesChart',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsSourceChannels',
			method: 'GET',
			path: '/web-analytics/source-channels',
			event: 'ahrefs.webAnalytics.sourceChannels',
			logKeys: ['project_id', 'from', 'to'],
		},
		input,
	);

export const sourceChannelsChart: AhrefsEndpoints['webAnalyticsSourceChannelsChart'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'webAnalyticsSourceChannelsChart',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsUtmParams',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsUtmParamsChart',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsCountries',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsCountriesChart',
			method: 'GET',
			path: '/web-analytics/countries-chart',
			event: 'ahrefs.webAnalytics.countriesChart',
			logKeys: ['project_id', 'from', 'to', 'granularity'],
		},
		input,
	);

export const cities: AhrefsEndpoints['webAnalyticsCities'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsCities',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsCitiesChart',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsContinents',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsContinentsChart',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsLanguages',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsLanguagesChart',
			method: 'GET',
			path: '/web-analytics/languages-chart',
			event: 'ahrefs.webAnalytics.languagesChart',
			logKeys: ['project_id', 'from', 'to', 'granularity'],
		},
		input,
	);

export const devices: AhrefsEndpoints['webAnalyticsDevices'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsDevices',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsDevicesChart',
			method: 'GET',
			path: '/web-analytics/devices-chart',
			event: 'ahrefs.webAnalytics.devicesChart',
			logKeys: ['project_id', 'from', 'to', 'granularity'],
		},
		input,
	);

export const browsers: AhrefsEndpoints['webAnalyticsBrowsers'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsBrowsers',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsBrowsersChart',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'webAnalyticsBrowserVersions',
			method: 'GET',
			path: '/web-analytics/browser-versions',
			event: 'ahrefs.webAnalytics.browserVersions',
			logKeys: ['project_id', 'from', 'to'],
		},
		input,
	);

export const browserVersionsChart: AhrefsEndpoints['webAnalyticsBrowserVersionsChart'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'webAnalyticsBrowserVersionsChart',
				method: 'GET',
				path: '/web-analytics/browser-versions-chart',
				event: 'ahrefs.webAnalytics.browserVersionsChart',
				logKeys: ['project_id', 'from', 'to', 'granularity'],
			},
			input,
		);

export const operatingSystems: AhrefsEndpoints['webAnalyticsOperatingSystems'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'webAnalyticsOperatingSystems',
				method: 'GET',
				path: '/web-analytics/operating-systems',
				event: 'ahrefs.webAnalytics.operatingSystems',
				logKeys: ['project_id', 'from', 'to'],
			},
			input,
		);

export const operatingSystemsChart: AhrefsEndpoints['webAnalyticsOperatingSystemsChart'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'webAnalyticsOperatingSystemsChart',
				method: 'GET',
				path: '/web-analytics/operating-systems-chart',
				event: 'ahrefs.webAnalytics.operatingSystemsChart',
				logKeys: ['project_id', 'from', 'to', 'granularity'],
			},
			input,
		);

export const operatingSystemsVersions: AhrefsEndpoints['webAnalyticsOperatingSystemsVersions'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'webAnalyticsOperatingSystemsVersions',
				method: 'GET',
				path: '/web-analytics/operating-systems-versions',
				event: 'ahrefs.webAnalytics.operatingSystemsVersions',
				logKeys: ['project_id', 'from', 'to'],
			},
			input,
		);

export const operatingSystemsVersionsChart: AhrefsEndpoints['webAnalyticsOperatingSystemsVersionsChart'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'webAnalyticsOperatingSystemsVersionsChart',
				method: 'GET',
				path: '/web-analytics/operating-systems-versions-chart',
				event: 'ahrefs.webAnalytics.operatingSystemsVersionsChart',
				logKeys: ['project_id', 'from', 'to', 'granularity'],
			},
			input,
		);
