import {
	decodePickle,
	encodeDictKey,
	encodePickle,
	pickleToJson,
	toJsonValue,
	UnsupportedPickleError,
} from './codec';

// Bytes from CPython 3: pickle.dumps(key, protocol=4), what Modal's Python
// client sends as a Dict key.
const CPYTHON_KEYS: [string | number | boolean | null, string][] = [
	['abc', '80049507000000000000008c03616263942e'],
	['', '80049504000000000000008c00942e'],
	[
		'éééééééééé',
		'80049518000000000000008c14c3a9c3a9c3a9c3a9c3a9c3a9c3a9c3a9c3a9c3a9942e',
	],
	[0, '80044b002e'],
	[7, '80044b072e'],
	[255, '80044bff2e'],
	[256, '80049504000000000000004d00012e'],
	[65535, '80049504000000000000004dffff2e'],
	[65536, '80049506000000000000004a000001002e'],
	[-1, '80049506000000000000004affffffff2e'],
	[2147483647, '80049506000000000000004affffff7f2e'],
	[2147483648, '80049508000000000000008a0500000080002e'],
	[-2147483648, '80049506000000000000004a000000802e'],
	[1099511627776, '80049509000000000000008a060000000000012e'],
	[1.5, '8004950a00000000000000473ff80000000000002e'],
	[true, '8004882e'],
	[null, '80044e2e'],
];

describe('encodeDictKey', () => {
	it.each(CPYTHON_KEYS)('%p matches CPython', (key, hex) => {
		expect(Buffer.from(encodeDictKey(key)).toString('hex')).toBe(hex);
	});

	it('frames long strings with BINUNICODE like CPython', () => {
		const bytes = Buffer.from(encodeDictKey('x'.repeat(300)));
		expect(bytes.subarray(0, 16).toString('hex')).toBe(
			'8004953301000000000000582c010000',
		);
		expect(bytes.length).toBe(2 + 9 + 1 + 4 + 300 + 1 + 1);
	});

	it('rejects keys Python could not match exactly', () => {
		expect(() => encodeDictKey(Number.NaN)).toThrow(/finite/);
		expect(() => encodeDictKey(2 ** 60)).toThrow(/safe/);
	});
});

// CPython 3.12 pickle.dumps(value, protocol) output, hex.
const CPYTHON_VALUES: [string, string, unknown][] = [
	[
		'mixed types (big ints, tuples, sets, bytes, bytearray)',
		'800495f8000000000000007d94288c027473948a0600cff76c93018c036e6567944afbffffff8c03626967948a090000000000000000408c0174944b018c01619486948c0173948f94284b014b02908c026673942891948c016294430200ff948c026261948c086275696c74696e73948c096279746561727261799493944302616294859452948c0166944740040000000000008c046e6f6e65944e8c066e6573746564945d94285d947d9429658c0175948c05c3bc6ec3af948c067475706c6573945d94284b0185944b014b0286944b014b024b038794284b014b024b034b047494658c066e6567626967948a090000000000000000ff8c047a65726f944b00752e',
		{
			ts: 1732700000000,
			neg: -5,
			big: '1180591620717411303424',
			t: [1, 'a'],
			s: [1, 2],
			fs: [],
			b: { $bytes: 'AP8=' },
			ba: { $bytes: 'YWI=' },
			f: 2.5,
			none: null,
			nested: [[], {}, []],
			u: 'ünï',
			tuples: [[1], [1, 2], [1, 2, 3], [1, 2, 3, 4]],
			negbig: '-18446744073709551616',
			zero: 0,
		},
	],
	[
		'a list referenced twice (BINGET)',
		'8004950c000000000000005d94285d944b01616801652e',
		[[1], [1]],
	],
	[
		'non-string dict keys',
		'8004951a000000000000007d94284b018c0164944b014b0286948c0162944e8c016394752e',
		{ '1': 'd', '[1,2]': 'b', null: 'c' },
	],
	[
		'protocol 2',
		'80027d71002858010000006171015d7102284b018a0600000000000158010000007871036558010000007471044b014b02867105752e',
		{ a: [1, 1099511627776, 'x'], t: [1, 2] },
	],
	[
		'protocol 5',
		'80059513000000000000007d948c0161945d94284b0143027a7a9465732e',
		{ a: [1, { $bytes: 'eno=' }] },
	],
	[
		'a list of dicts with a ms timestamp',
		'80049536000000000000007d94288c027473948a0600cff76c93018c056974656d73945d94287d948c026964944b00737d9468054b01737d9468054b027365752e',
		{ ts: 1732700000000, items: [{ id: 0 }, { id: 1 }, { id: 2 }] },
	],
];

describe('decodePickle', () => {
	it.each(CPYTHON_VALUES)('reads %s', (_name, hex, expected) => {
		expect(toJsonValue(decodePickle(Buffer.from(hex, 'hex')))).toEqual(
			expected,
		);
	});

	it('refuses Python objects it cannot map to JSON', () => {
		// pickle.dumps(datetime.date(2026, 11, 27), protocol=4)
		const hex =
			'80049520000000000000008c086461746574696d65948c0464617465949394430407ea0b1b94859452942e';
		const bytes = Buffer.from(hex, 'hex');
		expect(() => decodePickle(bytes)).toThrow(UnsupportedPickleError);
		expect(pickleToJson(bytes)).toEqual({
			$pickle: bytes.toString('base64'),
		});
	});

	it('refuses truncated or malformed input without hanging', () => {
		expect(() => decodePickle(Buffer.from('80044b', 'hex'))).toThrow(
			UnsupportedPickleError,
		);
		expect(() => decodePickle(Buffer.from('8004612e', 'hex'))).toThrow(
			UnsupportedPickleError,
		);
		expect(() => decodePickle(Buffer.from('4b012e', 'hex'))).toThrow(
			UnsupportedPickleError,
		);
	});
});

describe('encodePickle', () => {
	it('writes scalars byte for byte as CPython', () => {
		for (const [key, hex] of CPYTHON_KEYS) {
			expect(Buffer.from(encodePickle(key)).toString('hex')).toBe(hex);
		}
	});

	it('writes containers as CPython does', () => {
		// pickle.dumps([1, 'a'], 4), pickle.dumps({'a': [1, 2]}, 4), pickle.dumps(b'\x00\x01', 4)
		expect(Buffer.from(encodePickle([1, 'a'])).toString('hex')).toBe(
			'8004950b000000000000005d94284b018c016194652e',
		);
		expect(Buffer.from(encodePickle({ a: [1, 2] })).toString('hex')).toBe(
			'80049510000000000000007d948c0161945d94284b014b0265732e',
		);
		expect(Buffer.from(encodePickle({ $bytes: 'AAE=' })).toString('hex')).toBe(
			'800495060000000000000043020001942e',
		);
	});

	it('keeps integers beyond 32 bits exact (the SDK pickler truncates them)', () => {
		for (const value of [1732700000000, -(2 ** 40), 2 ** 53 - 1, 2 ** 31]) {
			expect(decodePickle(encodePickle(value))).toBe(value);
		}
		expect(decodePickle(encodePickle(10n ** 30n))).toBe(
			'1000000000000000000000000000000',
		);
	});

	it('round-trips nested JSON, including 1000+ item batches', () => {
		const big = Array.from({ length: 2500 }, (_, i) => i);
		const wide = Object.fromEntries(big.map((i) => [`k${i}`, i]));
		for (const value of [
			{ a: [1, 'x', null, true, 2.5, { b: [] }], ü: 'é' },
			big,
			wide,
			'x'.repeat(70_000),
		]) {
			expect(decodePickle(encodePickle(value))).toEqual(value);
		}
	});

	it('rejects values JSON cannot carry', () => {
		expect(() => encodePickle(() => 1)).toThrow(/cannot pickle/);
	});
});

describe('toJsonValue', () => {
	it('converts Dates, Maps, bytes and bigints', () => {
		expect(
			toJsonValue({
				d: new Date('2026-11-27T00:00:00Z'),
				m: new Map([['k', 1]]),
				b: new Uint8Array([1]),
				n: 10n,
			}),
		).toEqual({
			d: '2026-11-27T00:00:00.000Z',
			m: { k: 1 },
			b: { $bytes: 'AQ==' },
			n: '10',
		});
	});
});
