/**
 * Shapes taken from live Simple Analytics responses and the documented
 * examples in https://docs.simpleanalytics.com/api. Values keep every
 * documented field type honest.
 */

/** A real Stats answer, with `info=false` so the `__` keys are gone. */
export const stats = {
	ok: true,
	hostname: 'simpleanalytics.com',
	path: '*',
	start: '2026-10-31T23:00:00.000Z',
	end: '2026-11-09T22:59:59.999Z',
	version: 6,
	timezone: 'Europe/Amsterdam',
	pageviews: 8940,
	visitors: 6707,
	generated_in_ms: 1006,
};

export const statsWithFields = {
	...stats,
	seconds_on_page: 26,
	histogram: [
		{ date: '2026-11-01', pageviews: 812, visitors: 601 },
		{ date: '2026-11-02', pageviews: 903, visitors: 688 },
	],
	pages: [
		{ value: '/', pageviews: 100, visitors: 50, seconds_on_page: 25 },
		{ value: '/contact', pageviews: 60, visitors: 30, seconds_on_page: 20 },
	],
	countries: [
		{ value: 'NL', pageviews: 400, visitors: 300 },
		{ value: 'US', pageviews: 250, visitors: 210 },
	],
	events: [
		{ name: 'visit_homepage', total: 233 },
		{ name: 'popup_replace_show', total: 117 },
	],
};

/** The documented shape when the API reports a failure inside a 200. */
export const statsFailure = {
	ok: false,
	error: 'No valid authorization',
};

export const exportDatapoints = {
	datapoints: [
		{
			added_iso: '2026-11-13T15:04:19.100Z',
			country_code: 'US',
			datapoint: 'visit_homepage',
			device_type: 'desktop',
			path: '/',
			session_id: '1e5aad53-c734-40ac-b060-426a70d1c104',
			is_unique: true,
			is_robot: false,
			duration_seconds: 42,
		},
		{
			added_iso: '2026-11-14T13:30:04.100Z',
			country_code: 'UK',
			datapoint: 'visit_homepage',
			device_type: 'desktop',
			path: '/',
			session_id: '7b03aa29-612d-4aa8-b147-72c13986c4ae',
			is_unique: false,
			is_robot: false,
		},
	],
	meta: { hostname: 'example.com', total: 2 },
};

export const websites = {
	success: true,
	websites: [
		{
			hostname: 'example.com',
			is_public: false,
			timezone: 'Europe/Amsterdam',
			has_ssl: true,
			has_script: true,
			own_hostname: null,
			label: 'customer note',
			pageviews: 12345,
			events: 678,
		},
	],
};

export const websiteAdded = {
	ok: true,
	success: true,
	hostname: 'example.com',
	customDomain: null,
	public: false,
	timezone: 'Europe/Amsterdam',
	validDNS: true,
};

export const adminFailure = {
	success: false,
	error: 'No valid authorization',
};
