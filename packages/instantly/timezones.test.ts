import type { InstantlyTimezoneAlias } from './endpoints/timezones';
import {
	ACCEPTED_TIMEZONES,
	INSTANTLY_TIMEZONE_ALIASES,
	INSTANTLY_TIMEZONES,
	resolveAlias,
	sameRules,
	TIMEZONE_ALIAS_SUMMARY,
	toInstantlyTimezone,
} from './endpoints/timezones';

// UTC offsets come from Node's ICU time zone data, e.g. "GMT-05:00".
const formatters = new Map<string, Intl.DateTimeFormat>();
function offsetAt(zone: string, instant: number): string {
	let format = formatters.get(zone);
	if (!format) {
		format = new Intl.DateTimeFormat('en-US', {
			timeZone: zone,
			timeZoneName: 'longOffset',
		});
		formatters.set(zone, format);
	}
	return (
		format.formatToParts(instant).find((part) => part.type === 'timeZoneName')
			?.value ?? ''
	);
}

// Every hour of 2026 and 2027: schedules only run forward, and hourly
// sampling catches a DST switch on a different day or hour.
const HOURS = Array.from(
	{ length: 2 * 365 * 24 },
	(_, hour) => Date.UTC(2026, 0, 1) + hour * 3_600_000,
);

/** The first hour two zones disagree, or undefined if they never do. */
function firstDifference(a: string, b: string): string | undefined {
	for (const instant of HOURS) {
		const left = offsetAt(a, instant);
		const right = offsetAt(b, instant);
		if (left !== right) {
			return `${new Date(instant).toISOString()}: ${a} ${left}, ${b} ${right}`;
		}
	}
	return undefined;
}

const aliases = Object.entries(INSTANTLY_TIMEZONE_ALIASES) as [
	InstantlyTimezoneAlias,
	string,
][];

describe('time zone aliases', () => {
	it('maps only zones Instantly lacks, onto zones it has', () => {
		const listed = new Set<string>(INSTANTLY_TIMEZONES);
		for (const [alias, target] of aliases) {
			expect({ alias, listed: listed.has(alias) }).toEqual({
				alias,
				listed: false,
			});
			expect({ target, listed: listed.has(target) }).toEqual({
				target,
				listed: true,
			});
		}
		expect(ACCEPTED_TIMEZONES).toHaveLength(
			INSTANTLY_TIMEZONES.length + aliases.length,
		);
	});

	it.each(aliases)(
		'%s has the same offsets and DST rules as %s',
		(alias, target) => {
			expect(firstDifference(alias, target)).toBeUndefined();
		},
	);

	it.each([
		['America/New_York', 'America/Detroit'],
		['America/Denver', 'America/Boise'],
		['America/Phoenix', 'America/Creston'],
		['Europe/London', 'Europe/Isle_of_Man'],
		['Asia/Calcutta', 'Asia/Kolkata'],
		['UTC', 'Africa/Abidjan'],
	] as const)('sends %s as %s', (alias, target) => {
		expect(toInstantlyTimezone(alias)).toBe(target);
	});

	it.each(['America/Chicago', 'Asia/Kolkata', 'America/Detroit'] as const)(
		'sends listed zone %s unchanged',
		(zone) => {
			expect(toInstantlyTimezone(zone)).toBe(zone);
		},
	);

	it.each(['America/Los_Angeles', 'America/Vancouver'])(
		'%s matches no zone on the list, so it stays rejected',
		(zone) => {
			expect(ACCEPTED_TIMEZONES).not.toContain(zone);
			const matches = INSTANTLY_TIMEZONES.filter(
				(listed) => firstDifference(zone, listed) === undefined,
			);
			expect(matches).toEqual([]);
			// Instantly's Pacific entry is an hour off in winter.
			expect(firstDifference(zone, 'America/Dawson')).toMatch(
				/GMT-08:00, America\/Dawson GMT-07:00/,
			);
		},
	);

	it('lists every alias in the schema description text', () => {
		for (const [alias, target] of aliases) {
			expect(TIMEZONE_ALIAS_SUMMARY).toContain(`${alias} -> ${target}`);
		}
	});

	it.each([
		'America/Winnipeg',
		'Canada/Central',
		'America/Toronto',
		'Canada/Eastern',
		'America/Halifax',
		'America/Edmonton',
		'America/Vancouver',
	])('does not accept Canadian zone %s, whose rules are changing', (zone) => {
		expect(ACCEPTED_TIMEZONES).not.toContain(zone);
	});
});

describe('the run-time alias check', () => {
	it('sends an alias only while the runtime agrees on its rules', () => {
		expect(resolveAlias('America/New_York', 'America/Detroit')).toBe(
			'America/Detroit',
		);
		expect(() =>
			resolveAlias('America/Winnipeg', 'America/Chicago', () => false),
		).toThrow(/no longer follows the same offsets and DST rules/);
	});

	it('compares real ICU data hour by hour for the coming year', () => {
		expect(sameRules('America/New_York', 'America/Detroit')).toBe(true);
		expect(sameRules('America/Los_Angeles', 'America/Dawson')).toBe(false);
	});

	it('fails closed for a zone the runtime does not know', () => {
		expect(sameRules('Mars/Olympus_Mons', 'America/Detroit')).toBe(false);
	});
});
