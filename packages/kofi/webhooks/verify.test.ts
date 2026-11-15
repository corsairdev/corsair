import {
	commission,
	donation,
	formBody,
	shopOrder,
	subscriptionPayment,
	TOKEN,
	wrongToken,
} from '../test-fixtures';
import {
	KOFI_PAYMENT_TYPES,
	looksLikeKofiPayment,
	readPayment,
	tokenOf,
	verifyKofiPayment,
} from './verify';

describe('readPayment', () => {
	it('reads the payment out of the documented form body', () => {
		expect(readPayment(formBody(donation))).toEqual(donation);
	});

	it('URL-decodes the data field, including a plus and an ampersand', () => {
		const payment = { ...donation, message: 'Great work! +1 & thanks' };

		expect(readPayment(formBody(payment))).toMatchObject({
			message: 'Great work! +1 & thanks',
		});
	});

	it('reads a body that is already the payment object', () => {
		expect(readPayment(donation)).toEqual(donation);
	});

	it('reads a body whose data field was already parsed out', () => {
		expect(readPayment({ data: JSON.stringify(donation) })).toEqual(donation);
	});

	it('reads a body posted as bare JSON', () => {
		expect(readPayment(JSON.stringify(donation))).toEqual(donation);
	});

	it.each([
		[undefined],
		[null],
		[''],
		['not-a-body'],
		['data=not-json'],
		['data=%5B1%2C2%5D'],
		[[1, 2]],
	])('returns null for %j', (body) => {
		expect(readPayment(body)).toBeNull();
	});
});

describe('tokenOf', () => {
	it('reads the token', () => {
		expect(tokenOf(donation)).toBe(TOKEN);
	});

	it.each([
		[{}],
		[{ verification_token: '' }],
		[{ verification_token: 42 }],
		[{ verification_token: null }],
	])('returns undefined for %j', (payment) => {
		expect(tokenOf(payment)).toBeUndefined();
	});
});

describe('verifyKofiPayment', () => {
	it('accepts a delivery whose token matches', () => {
		expect(verifyKofiPayment(donation, TOKEN)).toEqual({ valid: true });
	});

	it('refuses a delivery with no token at all, so an empty secret fails closed', () => {
		expect(verifyKofiPayment(donation, undefined)).toMatchObject({
			valid: false,
			statusCode: 401,
		});
	});

	it('refuses a delivery whose token is wrong', () => {
		expect(verifyKofiPayment(wrongToken, TOKEN)).toMatchObject({
			valid: false,
			statusCode: 401,
			error: 'Ko-fi verification_token does not match',
		});
	});

	it('refuses a body that carries no payment', () => {
		expect(verifyKofiPayment(null, TOKEN)).toMatchObject({
			valid: false,
			statusCode: 400,
		});
	});

	it('refuses a payment with no verification_token field', () => {
		const { verification_token: _token, ...withoutToken } = donation;

		expect(verifyKofiPayment(withoutToken, TOKEN)).toMatchObject({
			valid: false,
			statusCode: 401,
			error: 'Ko-fi delivery has no verification_token',
		});
	});

	it('refuses a token that is a prefix of the real one', () => {
		expect(
			verifyKofiPayment(
				{ ...donation, verification_token: TOKEN.slice(0, -1) },
				TOKEN,
			),
		).toMatchObject({ valid: false });
	});

	it('refuses a token that differs only in case', () => {
		expect(
			verifyKofiPayment(
				{ ...donation, verification_token: TOKEN.toUpperCase() },
				TOKEN,
			),
		).toMatchObject({ valid: false });
	});
});

describe('looksLikeKofiPayment', () => {
	it.each([
		['Donation', donation],
		['Subscription', subscriptionPayment],
		['Shop Order', shopOrder],
		['Commission', commission],
	])('matches a %s delivery', (_, payment) => {
		expect(looksLikeKofiPayment(formBody(payment))).toBe(true);
	});

	it('matches an already-parsed payment', () => {
		expect(looksLikeKofiPayment(donation)).toBe(true);
	});

	it('does not match another provider’s body', () => {
		expect(looksLikeKofiPayment({ event: 'message.sent', team_id: 'T1' })).toBe(
			false,
		);
	});

	it('does not match an unknown type', () => {
		expect(looksLikeKofiPayment({ ...donation, type: 'Something Else' })).toBe(
			false,
		);
	});

	it.each([[undefined], [null], ['text'], ['data=not-json']])(
		'does not match %j',
		(body) => {
			expect(looksLikeKofiPayment(body)).toBe(false);
		},
	);

	it('lists the four documented types', () => {
		expect(KOFI_PAYMENT_TYPES).toEqual([
			'Donation',
			'Subscription',
			'Shop Order',
			'Commission',
		]);
	});
});
