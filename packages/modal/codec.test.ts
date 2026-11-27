import { createPickleCodec, encodeDictKey, toJsonValue } from './codec';

const sdk = jest.requireActual('modal');

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

describe('pickle codec (the SDK pickler)', () => {
	const codec = createPickleCodec(sdk);

	it('round-trips JSON values', async () => {
		for (const value of [1, 'a', null, true, [1, 'x'], { a: [1, 2] }]) {
			const decoded = await codec.decode(await codec.encode(value));
			expect(toJsonValue(decoded)).toEqual(value);
		}
	});

	it('decodes values pickled by CPython', async () => {
		const cases: [string, unknown][] = [
			['8004950b000000000000005d94284b018c016194652e', [1, 'a']],
			['80049510000000000000007d948c0161945d94284b014b0265732e', { a: [1, 2] }],
			['800495060000000000000043020001942e', { $bytes: 'AAE=' }],
			['80044e2e', null],
			['80049506000000000000008c02c3a9942e', 'é'],
		];
		for (const [hex, expected] of cases) {
			const decoded = await codec.decode(Buffer.from(hex, 'hex'));
			expect(toJsonValue(decoded)).toEqual(expected);
		}
	});

	it('decodes a key it encoded', async () => {
		await expect(codec.decode(encodeDictKey('user:1'))).resolves.toBe('user:1');
		await expect(codec.decode(encodeDictKey(70000))).resolves.toBe(70000);
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
