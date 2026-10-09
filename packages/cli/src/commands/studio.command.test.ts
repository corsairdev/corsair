import { parseStudioPort } from './studio.command';

const INVALID_PORT_MESSAGE =
	'[corsair]: Invalid port. Usage: corsair ui --port <number> (1-65535).';

describe('parseStudioPort', () => {
	beforeEach(() => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		// `process.exit` is typed as returning `never`, so the only way to keep
		// the mock's signature is to let it throw instead of returning.
		jest.spyOn(process, 'exit').mockImplementation((() => {
			throw new Error('process.exit');
		}) as typeof process.exit);
	});

	// Restore in one place so a failing assertion cannot leak the spies into
	// the next test.
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('returns undefined when no port is provided', () => {
		expect(parseStudioPort(undefined)).toBeUndefined();
		expect(console.error).not.toHaveBeenCalled();
	});

	it.each(['1', '3000', '4317', '65535'])(
		'returns %p as the port number',
		(raw) => {
			expect(parseStudioPort(raw)).toBe(Number(raw));
			expect(console.error).not.toHaveBeenCalled();
		},
	);

	// The three cases from the issue, plus the empty string, the sign, and the
	// two range boundaries.
	it.each(['3000abc', 'abc', '', '-1', '0', '65536', '1.5', ' 3000', '3000 '])(
		'exits with code 1 for %p',
		(raw) => {
			expect(() => parseStudioPort(raw)).toThrow('process.exit');
			expect(process.exit).toHaveBeenCalledWith(1);
			expect(console.error).toHaveBeenCalledWith(INVALID_PORT_MESSAGE);
		},
	);
});
