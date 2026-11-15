// The only time zones Instantly accepts on a campaign schedule, copied from
// https://api.instantly.ai/openapi/api_v2.json (Campaign.campaign_schedule).
// It is not the full IANA list: America/New_York, Europe/London and UTC are
// missing, so INSTANTLY_TIMEZONE_ALIASES below maps common zones onto it.
export const INSTANTLY_TIMEZONES = [
	'Etc/GMT+12',
	'Etc/GMT+11',
	'Etc/GMT+10',
	'America/Anchorage',
	'America/Dawson',
	'America/Creston',
	'America/Chihuahua',
	'America/Boise',
	'America/Belize',
	'America/Chicago',
	'America/Bahia_Banderas',
	'America/Regina',
	'America/Bogota',
	'America/Detroit',
	'America/Indiana/Marengo',
	'America/Caracas',
	'America/Asuncion',
	'America/Glace_Bay',
	'America/Campo_Grande',
	'America/Anguilla',
	'America/Santiago',
	'America/St_Johns',
	'America/Sao_Paulo',
	'America/Argentina/La_Rioja',
	'America/Araguaina',
	'America/Godthab',
	'America/Montevideo',
	'America/Bahia',
	'America/Noronha',
	'America/Scoresbysund',
	'Atlantic/Cape_Verde',
	'Africa/Casablanca',
	'America/Danmarkshavn',
	'Europe/Isle_of_Man',
	'Atlantic/Canary',
	'Africa/Abidjan',
	'Arctic/Longyearbyen',
	'Europe/Belgrade',
	'Africa/Ceuta',
	'Europe/Sarajevo',
	'Africa/Algiers',
	'Africa/Windhoek',
	'Asia/Nicosia',
	'Asia/Beirut',
	'Africa/Cairo',
	'Asia/Damascus',
	'Europe/Bucharest',
	'Africa/Blantyre',
	'Europe/Helsinki',
	'Europe/Istanbul',
	'Asia/Jerusalem',
	'Africa/Tripoli',
	'Asia/Amman',
	'Asia/Baghdad',
	'Europe/Kaliningrad',
	'Asia/Aden',
	'Africa/Addis_Ababa',
	'Europe/Kirov',
	'Europe/Astrakhan',
	'Asia/Tehran',
	'Asia/Dubai',
	'Asia/Baku',
	'Indian/Mahe',
	'Asia/Tbilisi',
	'Asia/Yerevan',
	'Asia/Kabul',
	'Antarctica/Mawson',
	'Asia/Yekaterinburg',
	'Asia/Karachi',
	'Asia/Kolkata',
	'Asia/Colombo',
	'Asia/Kathmandu',
	'Antarctica/Vostok',
	'Asia/Dhaka',
	'Asia/Rangoon',
	'Antarctica/Davis',
	'Asia/Novokuznetsk',
	'Asia/Hong_Kong',
	'Asia/Krasnoyarsk',
	'Asia/Brunei',
	'Australia/Perth',
	'Asia/Taipei',
	'Asia/Choibalsan',
	'Asia/Irkutsk',
	'Asia/Dili',
	'Asia/Pyongyang',
	'Australia/Adelaide',
	'Australia/Darwin',
	'Australia/Brisbane',
	'Australia/Melbourne',
	'Antarctica/DumontDUrville',
	'Australia/Currie',
	'Asia/Chita',
	'Antarctica/Macquarie',
	'Asia/Sakhalin',
	'Pacific/Auckland',
	'Etc/GMT-12',
	'Pacific/Fiji',
	'Asia/Anadyr',
	'Asia/Kamchatka',
	'Etc/GMT-13',
	'Pacific/Apia',
] as const;

export type InstantlyTimezone = (typeof INSTANTLY_TIMEZONES)[number];

/**
 * Common IANA zones missing from Instantly's list, each mapped to a listed
 * zone with the same UTC offsets and DST rules: checked hour by hour against
 * tzdata 2026f and in timezones.test.ts, and again at run time by
 * toInstantlyTimezone. Zones with no exact match stay rejected. Pacific time
 * is one: Instantly's America/Dawson stays at UTC-7 all year (Yukon dropped
 * DST in 2020), while America/Los_Angeles is UTC-8 from November to March.
 *
 * Canadian zones are left out on purpose. British Columbia, Alberta, the
 * Northwest Territories and Manitoba all moved to permanent time in 2026
 * (tzdata 2026b to 2026e), so whether a Canadian zone matches a listed one
 * depends on which tzdata a runtime ships.
 */
export const INSTANTLY_TIMEZONE_ALIASES = {
	// United States
	'America/New_York': 'America/Detroit',
	'US/Eastern': 'America/Detroit',
	'America/Indiana/Indianapolis': 'America/Detroit',
	'America/Kentucky/Louisville': 'America/Detroit',
	'US/Central': 'America/Chicago',
	'America/Denver': 'America/Boise',
	'US/Mountain': 'America/Boise',
	'America/Phoenix': 'America/Creston',
	'US/Arizona': 'America/Creston',
	'US/Alaska': 'America/Anchorage',
	'Pacific/Honolulu': 'Etc/GMT+10',
	'US/Hawaii': 'Etc/GMT+10',
	// Latin America
	'America/Mexico_City': 'America/Bahia_Banderas',
	'America/Lima': 'America/Bogota',
	'America/Argentina/Buenos_Aires': 'America/Argentina/La_Rioja',
	// Europe
	'Europe/London': 'Europe/Isle_of_Man',
	'Europe/Dublin': 'Europe/Isle_of_Man',
	'Europe/Lisbon': 'Europe/Isle_of_Man',
	'Europe/Paris': 'Europe/Belgrade',
	'Europe/Berlin': 'Europe/Belgrade',
	'Europe/Madrid': 'Europe/Belgrade',
	'Europe/Rome': 'Europe/Belgrade',
	'Europe/Amsterdam': 'Europe/Belgrade',
	'Europe/Brussels': 'Europe/Belgrade',
	'Europe/Vienna': 'Europe/Belgrade',
	'Europe/Zurich': 'Europe/Belgrade',
	'Europe/Stockholm': 'Europe/Belgrade',
	'Europe/Oslo': 'Europe/Belgrade',
	'Europe/Copenhagen': 'Europe/Belgrade',
	'Europe/Prague': 'Europe/Belgrade',
	'Europe/Warsaw': 'Europe/Belgrade',
	'Europe/Budapest': 'Europe/Belgrade',
	'Europe/Athens': 'Europe/Helsinki',
	'Europe/Kyiv': 'Europe/Helsinki',
	'Europe/Kiev': 'Europe/Helsinki',
	'Europe/Riga': 'Europe/Helsinki',
	'Europe/Sofia': 'Europe/Helsinki',
	'Europe/Moscow': 'Europe/Kirov',
	// Middle East and Africa
	'Asia/Riyadh': 'Asia/Aden',
	'Asia/Qatar': 'Asia/Aden',
	'Asia/Kuwait': 'Asia/Aden',
	'Asia/Tel_Aviv': 'Asia/Jerusalem',
	'Africa/Nairobi': 'Africa/Addis_Ababa',
	'Africa/Lagos': 'Africa/Algiers',
	'Africa/Johannesburg': 'Africa/Blantyre',
	// Asia and Pacific
	'Asia/Calcutta': 'Asia/Kolkata',
	'Asia/Yangon': 'Asia/Rangoon',
	'Asia/Bangkok': 'Asia/Krasnoyarsk',
	'Asia/Jakarta': 'Asia/Krasnoyarsk',
	'Asia/Ho_Chi_Minh': 'Asia/Krasnoyarsk',
	'Asia/Singapore': 'Asia/Hong_Kong',
	'Asia/Kuala_Lumpur': 'Asia/Hong_Kong',
	'Asia/Shanghai': 'Asia/Hong_Kong',
	'Asia/Manila': 'Asia/Hong_Kong',
	'Asia/Tokyo': 'Asia/Dili',
	'Asia/Seoul': 'Asia/Dili',
	'Australia/Sydney': 'Australia/Melbourne',
	'Australia/Canberra': 'Australia/Melbourne',
	'Australia/Hobart': 'Australia/Melbourne',
	// UTC
	UTC: 'Africa/Abidjan',
	'Etc/UTC': 'Africa/Abidjan',
	GMT: 'Africa/Abidjan',
	'Etc/GMT': 'Africa/Abidjan',
} as const satisfies Record<string, InstantlyTimezone>;

export type InstantlyTimezoneAlias = keyof typeof INSTANTLY_TIMEZONE_ALIASES;

/** Every zone a campaign schedule accepts: Instantly's own plus the aliases. */
export const ACCEPTED_TIMEZONES = [
	...INSTANTLY_TIMEZONES,
	// Object.keys returns string[]; these are exactly the object's own keys.
	...(Object.keys(INSTANTLY_TIMEZONE_ALIASES) as InstantlyTimezoneAlias[]),
];

const LISTED: ReadonlySet<string> = new Set(INSTANTLY_TIMEZONES);

function isInstantlyTimezone(zone: string): zone is InstantlyTimezone {
	return LISTED.has(zone);
}

const HOUR_MS = 3_600_000;
// About 13 months ahead: every DST switch of the coming year, hour by hour.
const CHECK_HOURS = 400 * 24;

const offsetFormats = new Map<string, Intl.DateTimeFormat>();

function offsetAt(zone: string, instant: number): string | undefined {
	let format = offsetFormats.get(zone);
	if (!format) {
		format = new Intl.DateTimeFormat('en-US', {
			timeZone: zone,
			timeZoneName: 'longOffset',
		});
		offsetFormats.set(zone, format);
	}
	return format
		.formatToParts(instant)
		.find((part) => part.type === 'timeZoneName')?.value;
}

/**
 * Whether two zones have the same UTC offset every hour of the coming year in
 * this runtime's time zone data. False when the runtime does not know a zone.
 */
export function sameRules(a: string, b: string, from = Date.now()): boolean {
	try {
		for (let hour = 0; hour < CHECK_HOURS; hour++) {
			const instant = from + hour * HOUR_MS;
			const left = offsetAt(a, instant);
			if (left === undefined || left !== offsetAt(b, instant)) return false;
		}
		return true;
	} catch {
		// RangeError: a zone this runtime's ICU does not know.
		return false;
	}
}

const aliasChecks = new Map<string, boolean>();

/**
 * Sends `alias` as `target` only while this runtime agrees they follow the
 * same rules (checked once per process). A tzdata update that separates them
 * then fails closed instead of scheduling sends at the wrong hour.
 */
export function resolveAlias(
	alias: string,
	target: InstantlyTimezone,
	matches: (a: string, b: string) => boolean = sameRules,
): InstantlyTimezone {
	// Only the real check is cached; a test's stand-in is asked every time.
	const cached = matches === sameRules;
	let ok = cached ? aliasChecks.get(alias) : undefined;
	if (ok === undefined) {
		ok = matches(alias, target);
		if (cached) aliasChecks.set(alias, ok);
	}
	if (!ok) {
		throw new Error(
			`${alias} no longer follows the same offsets and DST rules as ${target} in this runtime's time zone data, so it is not sent as ${target}. Pass a zone from Instantly's list instead.`,
		);
	}
	return target;
}

/** The zone Instantly is sent: a listed zone as is, an alias as its target. */
export function toInstantlyTimezone(
	zone: InstantlyTimezone | InstantlyTimezoneAlias,
): InstantlyTimezone {
	return isInstantlyTimezone(zone)
		? zone
		: resolveAlias(zone, INSTANTLY_TIMEZONE_ALIASES[zone]);
}

/** "America/New_York -> America/Detroit, ...", for schema descriptions. */
export const TIMEZONE_ALIAS_SUMMARY = Object.entries(INSTANTLY_TIMEZONE_ALIASES)
	.map(([alias, target]) => `${alias} -> ${target}`)
	.join(', ');
