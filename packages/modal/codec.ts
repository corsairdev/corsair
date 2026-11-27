/**
 * Modal Dicts and Queues store keys and values as Python pickles, so data
 * written here reads in Python and the other way round.
 *
 * Keys: a Dict lookup matches the key's bytes exactly, so keys are encoded
 * byte for byte as CPython's `pickle.dumps(key, protocol=4)` does (what
 * Modal's Python client sends), for the scalar keys a Dict usually has.
 *
 * Values: encodePickle/decodePickle below. The SDK's own pickler is not used
 * for either: it omits FRAME (so its key bytes never match Python's), writes
 * integers beyond 32 bits truncated, and cannot read Python's big ints,
 * tuples or sets.
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

function encodeLong(value: bigint | number): number[] {
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

// Opcodes the value encoder writes or the decoder reads beyond the key set.
const MARK = 0x28;
const POP = 0x30;
const POP_MARK = 0x31;
const DUP = 0x32;
const BINBYTES = 0x42;
const SHORT_BINBYTES = 0x43;
const BINSTRING = 0x54;
const SHORT_BINSTRING = 0x55;
const EMPTY_TUPLE = 0x29;
const EMPTY_LIST = 0x5d;
const APPEND = 0x61;
const APPENDS = 0x65;
const BINGET = 0x68;
const LONG_BINGET = 0x6a;
const BINPUT = 0x71;
const LONG_BINPUT = 0x72;
const SETITEM = 0x73;
const TUPLE = 0x74;
const SETITEMS = 0x75;
const EMPTY_DICT = 0x7d;
const TUPLE1 = 0x85;
const TUPLE2 = 0x86;
const TUPLE3 = 0x87;
const LONG4 = 0x8b;
const BINUNICODE8 = 0x8d;
const BINBYTES8 = 0x8e;
const EMPTY_SET = 0x8f;
const ADDITEMS = 0x90;
const FROZENSET = 0x91;
const STACK_GLOBAL = 0x93;
const GLOBAL = 0x63;
const REDUCE = 0x52;
const BYTEARRAY8 = 0x96;
// CPython's pickler batches APPENDS/SETITEMS in groups of this size.
const BATCH_SIZE = 1000;

/**
 * Pickle a JSON value as CPython's `pickle.dumps(value, protocol=4)` lays it
 * out: lists and dicts as EMPTY_LIST/EMPTY_DICT plus APPENDS/SETITEMS
 * batches, strings memoized, integers in the shortest int opcode or LONG1.
 * `{ $bytes: base64 }` (how this plugin returns bytes) is written back as
 * bytes. The SDK's own pickler is not used: it writes any integer outside
 * 32 bits as a truncated 4-byte int, so a timestamp in ms reads back wrong in
 * Python.
 */
export function encodePickle(value: unknown): Uint8Array {
	const body: number[] = [];
	writeValue(value, body, 0);
	body.push(STOP);
	if (body.length < FRAME_SIZE_MIN) {
		return Uint8Array.from([PROTO, 4, ...body]);
	}
	const out = new Uint8Array(11 + body.length);
	out.set([PROTO, 4, FRAME, ...uint32LE(body.length), 0, 0, 0, 0]);
	out.set(body, 11);
	return out;
}

function pushAll(out: number[], bytes: ArrayLike<number>) {
	for (let i = 0; i < bytes.length; i++) out.push(bytes[i] as number);
}

function writeInt(value: bigint | number, out: number[]) {
	if (typeof value === 'number' && Number.isSafeInteger(value)) {
		if (value >= 0 && value <= 0xff) return pushAll(out, [BININT1, value]);
		if (value >= 0 && value <= 0xffff) {
			return pushAll(out, [BININT2, value & 0xff, (value >>> 8) & 0xff]);
		}
		if (value >= -0x80000000 && value <= 0x7fffffff) {
			return pushAll(out, [BININT, ...uint32LE(value >>> 0)]);
		}
	}
	const long = encodeLong(BigInt(value));
	if (long.length < 256) return pushAll(out, [LONG1, long.length, ...long]);
	pushAll(out, [LONG4, ...uint32LE(long.length), ...long]);
}

function writeValue(value: unknown, out: number[], depth: number) {
	if (depth > 200) throw new Error('[modal] value is nested too deeply');
	if (value === null || value === undefined) return void out.push(NONE);
	if (value === true) return void out.push(NEWTRUE);
	if (value === false) return void out.push(NEWFALSE);
	if (typeof value === 'bigint') return writeInt(value, out);
	if (typeof value === 'number') {
		if (Number.isInteger(value)) return writeInt(value, out);
		const view = new DataView(new ArrayBuffer(8));
		view.setFloat64(0, value, false);
		return pushAll(out, [BINFLOAT, ...new Uint8Array(view.buffer)]);
	}
	if (typeof value === 'string') {
		const utf8 = new TextEncoder().encode(value);
		if (utf8.length < 256) pushAll(out, [SHORT_BINUNICODE, utf8.length]);
		else pushAll(out, [BINUNICODE, ...uint32LE(utf8.length)]);
		pushAll(out, utf8);
		return void out.push(MEMOIZE);
	}
	const bytes = asBytes(value);
	if (bytes) {
		if (bytes.length < 256) pushAll(out, [SHORT_BINBYTES, bytes.length]);
		else pushAll(out, [BINBYTES, ...uint32LE(bytes.length)]);
		pushAll(out, bytes);
		return void out.push(MEMOIZE);
	}
	if (value instanceof Date) return writeValue(value.toISOString(), out, depth);
	if (Array.isArray(value)) {
		pushAll(out, [EMPTY_LIST, MEMOIZE]);
		for (let i = 0; i < value.length; i += BATCH_SIZE) {
			const batch = value.slice(i, i + BATCH_SIZE);
			if (batch.length === 1) {
				writeValue(batch[0], out, depth + 1);
				out.push(APPEND);
				continue;
			}
			out.push(MARK);
			for (const item of batch) writeValue(item, out, depth + 1);
			out.push(APPENDS);
		}
		return;
	}
	if (typeof value === 'object') {
		const entries = Object.entries(value as Record<string, unknown>);
		pushAll(out, [EMPTY_DICT, MEMOIZE]);
		for (let i = 0; i < entries.length; i += BATCH_SIZE) {
			const batch = entries.slice(i, i + BATCH_SIZE);
			if (batch.length === 1) {
				const [k, v] = batch[0] as [string, unknown];
				writeValue(k, out, depth + 1);
				writeValue(v, out, depth + 1);
				out.push(SETITEM);
				continue;
			}
			out.push(MARK);
			for (const [k, v] of batch) {
				writeValue(k, out, depth + 1);
				writeValue(v, out, depth + 1);
			}
			out.push(SETITEMS);
		}
		return;
	}
	throw new Error(`[modal] cannot pickle a value of type ${typeof value}`);
}

function asBytes(value: unknown): Uint8Array | undefined {
	if (value instanceof Uint8Array) return value;
	if (
		value &&
		typeof value === 'object' &&
		!Array.isArray(value) &&
		Object.keys(value).length === 1 &&
		typeof (value as { $bytes?: unknown }).$bytes === 'string'
	) {
		return Buffer.from((value as { $bytes: string }).$bytes, 'base64');
	}
	return undefined;
}

/** A pickle this decoder does not read (a Python class instance, say). */
export class UnsupportedPickleError extends Error {}

// Python callables a pickle may name that map onto plain JSON values.
const SAFE_GLOBALS: Record<string, (args: unknown[]) => unknown> = {
	'builtins bytearray': bytearrayFrom,
	'builtins set': (args) => [...((args[0] as unknown[]) ?? [])],
	'builtins frozenset': (args) => [...((args[0] as unknown[]) ?? [])],
	'builtins list': (args) => [...((args[0] as unknown[]) ?? [])],
	'builtins tuple': (args) => [...((args[0] as unknown[]) ?? [])],
	'__builtin__ set': (args) => [...((args[0] as unknown[]) ?? [])],
	'__builtin__ bytearray': bytearrayFrom,
};

// bytearray(b'..') in protocol 3+, bytearray(u'..', 'latin-1') in protocol 2.
function bytearrayFrom(args: unknown[]): Uint8Array {
	const [source] = args;
	if (source instanceof Uint8Array) return source;
	return Uint8Array.from(Buffer.from(String(source ?? ''), 'latin1'));
}

type SafeGlobal = { $global: string };

function decodeLong(bytes: Uint8Array): number | string {
	if (bytes.length === 0) return 0;
	let big = 0n;
	for (let i = bytes.length - 1; i >= 0; i--) {
		big = (big << 8n) | BigInt(bytes[i] as number);
	}
	if ((bytes[bytes.length - 1] as number) & 0x80) {
		big -= 1n << BigInt(bytes.length * 8);
	}
	return big >= BigInt(Number.MIN_SAFE_INTEGER) &&
		big <= BigInt(Number.MAX_SAFE_INTEGER)
		? Number(big)
		: big.toString();
}

function dictKeyString(key: unknown): string {
	return typeof key === 'string' ? key : JSON.stringify(toJsonValue(key));
}

/**
 * Read a pickle (protocols 2 to 5) of plain Python data: None, bool, int,
 * float, str, bytes, bytearray, list, tuple, set, frozenset and dict. Tuples
 * and sets become arrays, ints beyond 2^53 become strings, non-string dict
 * keys become their JSON text. Anything else (class instances, datetimes)
 * throws UnsupportedPickleError.
 */
export function decodePickle(input: Uint8Array): unknown {
	const buf = input;
	const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
	let pos = 0;
	let stack: unknown[] = [];
	const marks: unknown[][] = [];
	const memo = new Map<number, unknown>();
	const text = new TextDecoder('utf-8', { fatal: true });
	const latin1 = new TextDecoder('latin1');

	const need = (n: number) => {
		if (pos + n > buf.length)
			throw new UnsupportedPickleError('truncated pickle');
	};
	const byte = () => {
		need(1);
		return buf[pos++] as number;
	};
	const take = (n: number) => {
		need(n);
		const out = buf.subarray(pos, pos + n);
		pos += n;
		return out;
	};
	const u32 = () => {
		need(4);
		const v = view.getUint32(pos, true);
		pos += 4;
		return v;
	};
	const u64 = () => {
		need(8);
		const v = view.getBigUint64(pos, true);
		pos += 8;
		if (v > BigInt(Number.MAX_SAFE_INTEGER)) {
			throw new UnsupportedPickleError('pickle length too large');
		}
		return Number(v);
	};
	const pop = () => {
		if (stack.length === 0) throw new UnsupportedPickleError('stack underflow');
		return stack.pop();
	};
	const top = () => {
		if (stack.length === 0) throw new UnsupportedPickleError('stack underflow');
		return stack[stack.length - 1];
	};
	const popMark = () => {
		const items = stack;
		const previous = marks.pop();
		if (!previous) throw new UnsupportedPickleError('missing MARK');
		stack = previous;
		return items;
	};
	const setItem = (target: unknown, key: unknown, value: unknown) => {
		if (!target || typeof target !== 'object' || Array.isArray(target)) {
			throw new UnsupportedPickleError('SETITEM on a non-dict');
		}
		(target as Record<string, unknown>)[dictKeyString(key)] = value;
	};
	const readLine = () => {
		const end = buf.indexOf(0x0a, pos);
		if (end < 0) throw new UnsupportedPickleError('truncated pickle');
		const line = latin1.decode(buf.subarray(pos, end));
		pos = end + 1;
		return line;
	};
	const lookupGlobal = (module: string, name: string): SafeGlobal => {
		const id = `${module} ${name}`;
		if (!SAFE_GLOBALS[id]) {
			throw new UnsupportedPickleError(`pickle refers to ${module}.${name}`);
		}
		return { $global: id };
	};

	const proto = byte() === PROTO ? byte() : undefined;
	if (proto === undefined || proto < 2 || proto > 5) {
		throw new UnsupportedPickleError('only pickle protocols 2 to 5 are read');
	}
	while (pos < buf.length) {
		const op = byte();
		switch (op) {
			case STOP:
				if (stack.length !== 1 || marks.length) {
					throw new UnsupportedPickleError('malformed pickle');
				}
				return stack[0];
			case FRAME:
				u64();
				break;
			case NONE:
				stack.push(null);
				break;
			case NEWTRUE:
				stack.push(true);
				break;
			case NEWFALSE:
				stack.push(false);
				break;
			case BININT1:
				stack.push(byte());
				break;
			case BININT2:
				need(2);
				stack.push(view.getUint16(pos, true));
				pos += 2;
				break;
			case BININT:
				need(4);
				stack.push(view.getInt32(pos, true));
				pos += 4;
				break;
			case LONG1:
				stack.push(decodeLong(take(byte())));
				break;
			case LONG4:
				stack.push(decodeLong(take(u32())));
				break;
			case BINFLOAT:
				need(8);
				stack.push(view.getFloat64(pos, false));
				pos += 8;
				break;
			case SHORT_BINUNICODE:
				stack.push(text.decode(take(byte())));
				break;
			case BINUNICODE:
				stack.push(text.decode(take(u32())));
				break;
			case BINUNICODE8:
				stack.push(text.decode(take(u64())));
				break;
			case SHORT_BINSTRING:
				stack.push(latin1.decode(take(byte())));
				break;
			case BINSTRING:
				stack.push(latin1.decode(take(u32())));
				break;
			case SHORT_BINBYTES:
				stack.push(take(byte()).slice());
				break;
			case BINBYTES:
				stack.push(take(u32()).slice());
				break;
			case BINBYTES8:
			case BYTEARRAY8:
				stack.push(take(u64()).slice());
				break;
			case EMPTY_LIST:
			case EMPTY_TUPLE:
			case EMPTY_SET:
				stack.push([]);
				break;
			case EMPTY_DICT:
				stack.push({});
				break;
			case MARK:
				marks.push(stack);
				stack = [];
				break;
			case APPEND: {
				const item = pop();
				const list = top();
				if (!Array.isArray(list))
					throw new UnsupportedPickleError('APPEND on a non-list');
				list.push(item);
				break;
			}
			case APPENDS:
			case ADDITEMS: {
				const items = popMark();
				const list = top();
				if (!Array.isArray(list))
					throw new UnsupportedPickleError('APPENDS on a non-list');
				list.push(...items);
				break;
			}
			case SETITEM: {
				const value = pop();
				const key = pop();
				setItem(top(), key, value);
				break;
			}
			case SETITEMS: {
				const items = popMark();
				const target = top();
				for (let i = 0; i + 1 < items.length; i += 2) {
					setItem(target, items[i], items[i + 1]);
				}
				break;
			}
			case TUPLE:
			case FROZENSET: {
				// popMark swaps `stack`, so read it before pushing.
				const items = popMark();
				stack.push(items);
				break;
			}
			case TUPLE1:
				stack.push([pop()]);
				break;
			case TUPLE2: {
				const b = pop();
				stack.push([pop(), b]);
				break;
			}
			case TUPLE3: {
				const c = pop();
				const b = pop();
				stack.push([pop(), b, c]);
				break;
			}
			case MEMOIZE:
				memo.set(memo.size, top());
				break;
			case BINPUT:
				memo.set(byte(), top());
				break;
			case LONG_BINPUT:
				memo.set(u32(), top());
				break;
			case BINGET:
			case LONG_BINGET: {
				const index = op === BINGET ? byte() : u32();
				if (!memo.has(index))
					throw new UnsupportedPickleError('bad memo reference');
				stack.push(memo.get(index));
				break;
			}
			case POP:
				pop();
				break;
			case POP_MARK:
				popMark();
				break;
			case DUP:
				stack.push(top());
				break;
			case STACK_GLOBAL: {
				const name = pop();
				const module = pop();
				stack.push(lookupGlobal(String(module), String(name)));
				break;
			}
			case GLOBAL: {
				const module = readLine();
				stack.push(lookupGlobal(module, readLine()));
				break;
			}
			case REDUCE: {
				const args = pop();
				const callable = pop() as SafeGlobal | undefined;
				const fn = callable?.$global
					? SAFE_GLOBALS[callable.$global]
					: undefined;
				if (!fn || !Array.isArray(args)) {
					throw new UnsupportedPickleError('REDUCE of an unknown callable');
				}
				stack.push(fn(args));
				break;
			}
			default:
				throw new UnsupportedPickleError(
					`unsupported pickle opcode 0x${op.toString(16)}`,
				);
		}
	}
	throw new UnsupportedPickleError('pickle ended without STOP');
}

/**
 * decodePickle as JSON, or `{ $pickle: base64 }` for a pickle of data JSON
 * has no form for, so one odd entry never fails a whole read.
 */
export function pickleToJson(bytes: Uint8Array): unknown {
	try {
		return toJsonValue(decodePickle(bytes));
	} catch (error) {
		if (error instanceof UnsupportedPickleError || error instanceof TypeError) {
			return { $pickle: Buffer.from(bytes).toString('base64') };
		}
		throw error;
	}
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
