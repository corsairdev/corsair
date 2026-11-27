import type { ModalSdkModule } from './client';

/**
 * Modal Dicts and Queues store keys and values as Python pickles, so data
 * written here reads in Python and the other way round.
 *
 * Values: the SDK's own pickler (used by its Queue class) encodes and decodes
 * them; Python's unpickler reads its output. The SDK keeps that pickler
 * internal, so it is reached through a Queue bound to a stand-in client that
 * captures the bytes instead of sending them.
 *
 * Keys: a Dict lookup matches the key's bytes exactly, and the SDK's pickler
 * writes a protocol 4 pickle without the FRAME opcode CPython adds, so a key
 * it pickles never matches the same key written from Python. Keys are encoded
 * here byte for byte as CPython's `pickle.dumps(key, protocol=4)` does (what
 * Modal's Python client sends), for the scalar keys a Dict usually has.
 */

export type DictKey = string | number | boolean | null;

const PROTO = 0x80;
const FRAME = 0x95;
const STOP = 0x2e;
const NONE = 0x4e;
const NEWTRUE = 0x88;
const NEWFALSE = 0x89;
const BININT = 0x4a;
const BININT1 = 0x4b;
const BININT2 = 0x4d;
const LONG1 = 0x8a;
const BINFLOAT = 0x47;
const SHORT_BINUNICODE = 0x8c;
const BINUNICODE = 0x58;
const MEMOIZE = 0x94;
// CPython only frames a pickle whose body is at least this many bytes.
const FRAME_SIZE_MIN = 4;

function uint32LE(value: number): number[] {
	return [
		value & 0xff,
		(value >>> 8) & 0xff,
		(value >>> 16) & 0xff,
		(value >>> 24) & 0xff,
	];
}

function encodeLong(value: number): number[] {
	// Little-endian two's complement, shortest form, as CPython's encode_long.
	let big = BigInt(value);
	const bytes: number[] = [];
	if (big === 0n) return [];
	const negative = big < 0n;
	const nbits = (negative ? -big - 1n : big).toString(2).length + 1;
	const nbytes = Math.ceil(nbits / 8);
	if (negative) big = (1n << BigInt(nbytes * 8)) + big;
	for (let i = 0; i < nbytes; i++) {
		bytes.push(Number(big & 0xffn));
		big >>= 8n;
	}
	return bytes;
}

function keyBody(key: DictKey): number[] {
	if (key === null) return [NONE];
	if (key === true) return [NEWTRUE];
	if (key === false) return [NEWFALSE];
	if (typeof key === 'number') {
		if (!Number.isFinite(key)) {
			throw new Error('[modal] dict keys must be finite numbers');
		}
		if (Number.isInteger(key)) {
			if (!Number.isSafeInteger(key)) {
				throw new Error('[modal] integer dict keys must be safe integers');
			}
			if (key >= 0 && key <= 0xff) return [BININT1, key];
			if (key >= 0 && key <= 0xffff) {
				return [BININT2, key & 0xff, (key >>> 8) & 0xff];
			}
			if (key >= -0x80000000 && key <= 0x7fffffff) {
				return [BININT, ...uint32LE(key >>> 0)];
			}
			const long = encodeLong(key);
			return [LONG1, long.length, ...long];
		}
		const view = new DataView(new ArrayBuffer(8));
		view.setFloat64(0, key, false);
		return [BINFLOAT, ...new Uint8Array(view.buffer)];
	}
	const utf8 = new TextEncoder().encode(key);
	const header =
		utf8.length < 256
			? [SHORT_BINUNICODE, utf8.length]
			: [BINUNICODE, ...uint32LE(utf8.length)];
	return [...header, ...utf8, MEMOIZE];
}

/** The bytes CPython's `pickle.dumps(key, protocol=4)` gives for a scalar key. */
export function encodeDictKey(key: DictKey): Uint8Array {
	const body = [...keyBody(key), STOP];
	if (body.length < FRAME_SIZE_MIN) {
		return Uint8Array.from([PROTO, 4, ...body]);
	}
	const frameLength = [...uint32LE(body.length), 0, 0, 0, 0];
	return Uint8Array.from([PROTO, 4, FRAME, ...frameLength, ...body]);
}

type CapturingStub = {
	logger: { debug: () => void };
	cpClient: {
		queuePut: (request: { values: Uint8Array[] }) => Promise<void>;
		queueGet: () => Promise<{ values: Uint8Array[] }>;
	};
};

/** Pickle encode/decode for values, backed by the SDK's own pickler. */
export type PickleCodec = {
	encode(value: unknown): Promise<Uint8Array>;
	decode(bytes: Uint8Array): Promise<unknown>;
};

export function createPickleCodec(sdk: ModalSdkModule): PickleCodec {
	let captured: Uint8Array[] = [];
	let pending: Uint8Array[] = [];
	const stub: CapturingStub = {
		logger: { debug: () => {} },
		cpClient: {
			queuePut: async (request) => {
				captured = request.values;
			},
			queueGet: async () => {
				const values = pending;
				pending = [];
				return { values };
			},
		},
	};
	// The Queue constructor is public; the stand-in client never touches the network.
	const queue = new sdk.Queue(
		stub as unknown as ConstructorParameters<typeof sdk.Queue>[0],
		'corsair-pickle-codec',
	);
	return {
		async encode(value) {
			captured = [];
			await queue.put(value);
			const [bytes] = captured;
			if (!bytes) throw new Error('[modal] could not pickle value');
			return bytes;
		},
		async decode(bytes) {
			pending = [bytes];
			return queue.get();
		},
	};
}

/**
 * Make an SDK value JSON-safe: bytes as { $bytes: base64 }, Maps as objects,
 * Dates as ISO strings, bigints as strings.
 */
export function toJsonValue(value: unknown): unknown {
	if (value instanceof Date) return value.toISOString();
	if (value instanceof Uint8Array) {
		return { $bytes: Buffer.from(value).toString('base64') };
	}
	if (value instanceof Map) {
		return Object.fromEntries(
			[...value.entries()].map(([k, v]) => [String(k), toJsonValue(v)]),
		);
	}
	if (Array.isArray(value)) return value.map(toJsonValue);
	if (typeof value === 'bigint') return value.toString();
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([k, v]) => [k, toJsonValue(v)]),
		);
	}
	return value;
}
