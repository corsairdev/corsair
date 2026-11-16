/**
 * Responses follow Neutrino's published OpenAPI spec
 * (https://www.neutrinoapi.com/api/openapi.json) and its live error envelope.
 * Every error is `{ "api-error": n, "api-error-msg": "..." }` with a non-200
 * status, and its own docs use the hyphenated parameter names this plugin sends.
 */

export const ipInfo = {
	valid: true,
	ip: '1.1.1.1',
	'is-v6': false,
	'is-v4-mapped': false,
	'is-bogon': false,
	country: 'Australia',
	'country-code': 'AU',
	'country-code3': 'AUS',
	'continent-code': 'OC',
	region: 'Queensland',
	'region-code': 'QLD',
	city: 'Brisbane',
	latitude: -27.4766,
	longitude: 153.0166,
	timezone: {
		id: 'Australia/Brisbane',
		name: 'AEST',
		abbr: 'AEST',
		date: '2026-11-16',
		time: '21:00:00',
		offset: '+1000',
	},
	'currency-code': 'AUD',
	'language-code': 'en',
	hostname: 'one.one.one.one',
	'host-domain': 'one.one.one.one',
};

export const ipBlocklist = {
	ip: '1.1.1.1',
	'is-bot': false,
	'is-exploit-bot': false,
	'is-malware': false,
	'is-spider': false,
	'is-dshield': false,
	'list-count': 0,
	'is-proxy': false,
	'is-hijacked': false,
	'is-tor': false,
	'is-spyware': false,
	'is-spam-bot': false,
	'is-listed': false,
	'is-vpn': false,
	blocklists: [],
	sensors: [],
};

export const ipProbe = {
	valid: true,
	ip: '1.1.1.1',
	'is-hosting': true,
	'is-isp': false,
	country: 'Australia',
	'country-code': 'AU',
	'continent-code': 'OC',
	city: 'Brisbane',
	region: 'Queensland',
	hostname: 'one.one.one.one',
	'provider-type': 'hosting',
	'provider-domain': 'cloudflare.com',
	'provider-website': 'https://www.cloudflare.com',
	'provider-description': 'Cloudflare, Inc.',
};

export const emailValidate = {
	valid: true,
	email: 'tech@neutrinoapi.com',
	domain: 'neutrinoapi.com',
	'domain-status': 'ok',
	'domain-error': false,
	'syntax-error': false,
	'is-freemail': false,
	'is-disposable': false,
	'is-personal': false,
	provider: 'neutrinoapi.com',
	'mx-ip': '192.0.2.10',
};

export const emailVerify = {
	...emailValidate,
	verified: true,
	'is-catch-all': false,
	'is-deferred': false,
	'smtp-status': 'accepted',
	'smtp-response': '250 OK',
};

export const phoneValidate = {
	valid: true,
	'is-mobile': true,
	type: 'mobile',
	'international-number': '+61412345678',
	'local-number': '0412 345 678',
	'international-calling-code': '61',
	'country-code': 'AU',
	'country-code3': 'AUS',
	country: 'Australia',
	location: 'Queensland',
	'currency-code': 'AUD',
	'prefix-network': 'Telstra',
};

export const hlrLookup = {
	'number-valid': true,
	'hlr-valid': true,
	'hlr-status': 'active',
	'number-type': 'mobile',
	'is-ported': false,
	'ported-network': 'Telstra',
	'international-number': '+61412345678',
	'local-number': '0412 345 678',
	'international-calling-code': '61',
	'country-code': 'AU',
	mcc: '505',
	mnc: '01',
	imsi: '505010123456789',
	msin: '0123456789',
};

export const uaLookup = {
	ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130.0 Safari/537.36',
	type: 'browser',
	name: 'Chrome',
	version: '130.0',
	'version-major': 130,
	'browser-engine': 'Blink',
	'browser-release': '130',
	os: 'macOS',
	'os-family': 'macOS',
	'os-version': '10.15.7',
	'os-version-major': 10,
	'is-mobile': false,
	'is-webview': false,
	'device-brand': 'Apple',
};

export const domainLookup = {
	domain: 'neutrinoapi.com',
	valid: true,
	fqdn: 'neutrinoapi.com',
	tld: 'com',
	'tld-cc': false,
	'is-subdomain': false,
	'is-malicious': false,
	'is-gov': false,
	'is-opennic': false,
	'is-pending': false,
	'is-adult': false,
	rank: 102345,
	blocklists: [],
	sensors: [],
};

export const hostReputation = {
	host: 'neutrinoapi.com',
	'is-listed': false,
	'list-count': 0,
	lists: [
		{
			'is-listed': false,
			'list-host': 'zen.spamhaus.org',
			'list-name': 'Spamhaus ZEN',
			'list-rating': 1,
			'txt-record': '',
			'return-code': 'NXDOMAIN',
			'response-time': 12,
		},
	],
};

export const urlInfo = {
	valid: true,
	url: 'https://neutrinoapi.com',
	'url-port': 443,
	'url-path': '/',
	'http-status-message': 'OK',
	'http-ok': true,
	real: true,
	'load-time': 0.412,
	'server-name': 'nginx',
	'server-hostname': 'neutrinoapi.com',
	'server-country': 'New Zealand',
	'server-region': 'Auckland',
	'server-city': 'Auckland',
	query: {},
};

export const geocodeAddress = {
	found: true,
	locations: [
		{
			country: 'New Zealand',
			'country-code': 'NZ',
			'country-code3': 'NZL',
			address: '48 Greys Avenue, Auckland, 1010, New Zealand',
			city: 'Auckland',
			state: 'Auckland',
			'postal-code': '1010',
			latitude: -36.8499,
			longitude: 174.7611,
			'address-structured': {
				name: '',
				number: '48',
				street: 'Greys Avenue',
				area: '',
				city: 'Auckland',
				county: '',
				state: 'Auckland',
				'postal-code': '1010',
				country: 'New Zealand',
			},
			'address-components': { road: 'Greys Avenue', suburb: 'Auckland CBD' },
			timezone: {
				id: 'Pacific/Auckland',
				name: 'NZDT',
				abbr: 'NZDT',
				date: '2026-11-17',
				time: '10:00:00',
				offset: '+1300',
			},
			'location-type': 'building',
			'location-tags': ['office'],
		},
	],
};

export const geocodeReverse = {
	found: true,
	address: '48 Greys Avenue, Auckland, 1010, New Zealand',
	city: 'Auckland',
	country: 'New Zealand',
	'country-code': 'NZ',
	'country-code3': 'NZL',
	'postal-code': '1010',
	state: 'Auckland',
	latitude: -36.8499,
	longitude: 174.7611,
	'address-structured': {
		name: '',
		number: '48',
		street: 'Greys Avenue',
		area: '',
		city: 'Auckland',
		county: '',
		state: 'Auckland',
		'postal-code': '1010',
		country: 'New Zealand',
	},
	'address-components': { road: 'Greys Avenue' },
	'location-type': 'building',
	'location-tags': ['office'],
	'location-profile': { 'website-url': 'https://example.co.nz' },
	timezone: {
		id: 'Pacific/Auckland',
		name: 'NZDT',
		abbr: 'NZDT',
		date: '2026-11-17',
		time: '10:00:00',
		offset: '+1300',
	},
};

export const binLookup = {
	valid: true,
	'bin-number': '48334884',
	'card-brand': 'VISA',
	'card-type': 'CREDIT',
	'card-category': 'PLATINUM',
	country: 'New Zealand',
	'country-code': 'NZ',
	issuer: 'ASB Bank',
	'issuer-website': 'https://www.asb.co.nz',
	'ip-matches-bin': false,
	'ip-blocklisted': false,
	'ip-country': 'Australia',
	'ip-country-code': 'AU',
	'ip-city': 'Brisbane',
	'ip-region': 'Queensland',
	'ip-blocklists': [],
};

export const convert = {
	valid: true,
	'from-value': '100',
	'from-type': 'USD',
	'to-type': 'EUR',
	result: '92.41',
	'result-float': 92.41,
	'from-name': 'US Dollar',
	'from-symbol': '$',
	'to-name': 'Euro',
	'to-symbol': '€',
	'historical-date': '',
};

export const smsVerify = {
	'number-valid': true,
	sent: true,
	'security-code': '482913',
};

/** The one error envelope, with the numeric code that classifies it. */
export const accessDenied = {
	'api-error': 43,
	'api-error-msg': 'ACCESS DENIED. USER ID OR API KEY INVALID',
};

export const badParameter = {
	'api-error': 21,
	'api-error-msg': 'BAD PARAMETER. IP ADDRESS IS NOT VALID',
};
