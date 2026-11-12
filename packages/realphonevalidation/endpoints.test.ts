import { logEventFromContext } from 'corsair/core';
import { RealPhoneValidationAPIError } from './client';
import * as Phones from './endpoints';
import {
	ACTIVE_INACTIVE,
	ACTIVE_LANDLINE,
	DNC_CLEAR,
	DNC_LISTED,
	DNC_PLUS_CLEAR,
	DNC_PLUS_LISTED,
	DNC_TIMEOUT,
	EMAIL_BAD_FORMAT,
	EMAIL_RETVAL_102,
	EMAIL_VALID,
	FRAUD_MEDIUM,
	REASSIGNED_NO,
	REASSIGNED_NO_DATA,
	REASSIGNED_YES,
	REFUSED_INVALID_PHONE,
	REFUSED_MISSING_TOKEN,
	REFUSED_UNAUTHORIZED_STATUS,
	SCRUB_CONNECTED,
	SCRUB_PLUS_CONNECTED,
	TURBO_CONNECTED,
	TURBO_STANDARD_CONNECTED,
	TURBO_V3_CONNECTED,
	TURBO_V3_DISCONNECTED,
	TURBO_V3_NO_CALLER_NAME,
	WIRELESS_CELL,
	WIRELESS_LANDLINE,
} from './test-fixtures';
import { invoke, lastRequest, respond } from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('turboV3', () => {
	it('validates a number and returns the full answer', async () => {
		respond(fetchMock, TURBO_V3_CONNECTED);

		const result = await invoke(Phones.turboV3, { phone: '7275555555' });

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/rpvWebService/TurboV3.php');
		expect(request.query.phone).toBe('7275555555');
		expect(result.status).toBe('connected');
		expect(result.phone_type).toBe('Mobile');
		expect(result.caller_name).toBe('Jack Smith');
		expect(result.caller_type).toBe('Consumer');
	});

	it('reads an empty caller_name or carrier ({} in the JSON) as null', async () => {
		respond(fetchMock, TURBO_V3_NO_CALLER_NAME);

		const result = await invoke(Phones.turboV3, { phone: '7275555555' });

		expect(result.status).toBe('connected');
		expect(result.caller_name).toBeNull();
		expect(result.carrier).toBeNull();
	});

	it('accepts the empty-object error_text the service sends', async () => {
		respond(fetchMock, TURBO_V3_CONNECTED);

		const result = await invoke(Phones.turboV3, { phone: '7275555555' });

		// {} rather than "" when there is no error.
		expect(result.error_text).toEqual({});
	});

	it('reports a disconnected number as a result, not an error', async () => {
		respond(fetchMock, TURBO_V3_DISCONNECTED);

		const result = await invoke(Phones.turboV3, { phone: '7275555555' });

		expect(result.status).toBe('disconnected');
	});

	it('rejects a number with punctuation or a country code', async () => {
		for (const phone of ['+1 727-555-5555', '727555555', '72755555555']) {
			await expect(invoke(Phones.turboV3, { phone })).rejects.toThrow();
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a refusal that arrives inside a 200', async () => {
		respond(fetchMock, REFUSED_INVALID_PHONE);

		await expect(
			invoke(Phones.turboV3, { phone: '7275555555' }),
		).rejects.toThrow('invalid phone');
	});

	it('logs the status words, never the number', async () => {
		respond(fetchMock, TURBO_V3_CONNECTED);

		await invoke(Phones.turboV3, { phone: '7275555555' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'realphonevalidation.turboV3',
			{ status: 'connected', phoneType: 'Mobile', callerType: 'Consumer' },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('7275555555');
	});
});

describe('turboStandard', () => {
	it('uses the Turbo.php script, not the legacy one', async () => {
		respond(fetchMock, TURBO_STANDARD_CONNECTED);

		const result = await invoke(Phones.turboStandard, {
			phone: '7275555555',
		});

		expect(lastRequest(fetchMock).path).toBe('/rpvWebService/Turbo.php');
		expect(result.status).toBe('connected');
		expect(result.phone_type).toBe('Mobile');
	});
});

describe('turbo', () => {
	it('uses the legacy RealPhoneValidationTurbo.php script', async () => {
		respond(fetchMock, TURBO_CONNECTED);

		const result = await invoke(Phones.turbo, { phone: '7275555555' });

		expect(lastRequest(fetchMock).path).toBe(
			'/rpvWebService/RealPhoneValidationTurbo.php',
		);
		expect(result.iscell).toBe('Y');
		expect(result.carrier).toContain('Verizon');
	});
});

describe('scrub', () => {
	it('returns the connection status with iscell and carrier', async () => {
		respond(fetchMock, SCRUB_CONNECTED);

		const result = await invoke(Phones.scrub, { phone: '7275555555' });

		// The Scrub page's own example calls RealPhoneValidationScrub.php; there is
		// no Scrub.php script.
		expect(lastRequest(fetchMock).path).toBe(
			'/rpvWebService/RealPhoneValidationScrub.php',
		);
		expect(result.status).toBe('connected');
		expect(result.iscell).toBe('Y');
	});
});

describe('scrubPlus', () => {
	it('returns the connection status with the phone type', async () => {
		respond(fetchMock, SCRUB_PLUS_CONNECTED);

		const result = await invoke(Phones.scrubPlus, {
			phone: '7275555555',
		});

		expect(lastRequest(fetchMock).path).toBe('/rpvWebService/ScrubPlus.php');
		expect(result.phone_type).toBe('Mobile');
	});
});

describe('active', () => {
	it('reads an active landline as L', async () => {
		respond(fetchMock, ACTIVE_LANDLINE);

		const result = await invoke(Phones.active, { phone: '7275555555' });

		expect(lastRequest(fetchMock).path).toBe(
			'/rpvWebService/RealPhoneValidationActive.php',
		);
		expect(result.RESPONSECODE).toBe('L');
	});

	it('reads an inactive line as N', async () => {
		respond(fetchMock, ACTIVE_INACTIVE);

		const result = await invoke(Phones.active, { phone: '7275555555' });

		expect(result.RESPONSECODE).toBe('N');
	});
});

describe('wirelessId', () => {
	it('reads a landline', async () => {
		respond(fetchMock, WIRELESS_LANDLINE);

		const result = await invoke(Phones.wirelessId, {
			phone: '7275555555',
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/rpvWebService/WirelessID.php');
		// The Wireless ID docs and example name the parameter `Phone`.
		expect(request.query.Phone).toBe('7275555555');
		expect(request.query.phone).toBeUndefined();
		expect(result.RESPONSECODE).toBe('Landline');
	});

	it('reads a cell number', async () => {
		respond(fetchMock, WIRELESS_CELL);

		const result = await invoke(Phones.wirelessId, {
			phone: '7275555555',
		});

		expect(result.RESPONSECODE).toBe('cell');
	});

	it('accepts an empty-object RESPONSEMSG', async () => {
		respond(fetchMock, WIRELESS_LANDLINE);

		const result = await invoke(Phones.wirelessId, {
			phone: '7275555555',
		});

		expect(result.RESPONSEMSG).toEqual({});
	});
});

describe('dncLookup', () => {
	it('reads a cleared number', async () => {
		respond(fetchMock, DNC_CLEAR);

		const result = await invoke(Phones.dncLookup, {
			phone: '7275555555',
		});

		expect(lastRequest(fetchMock).path).toBe('/rpvWebService/DNCLookup.php');
		expect(result.national_dnc).toBe('N');
		expect(result.litigator).toBe('N');
	});

	it('reads a number on the national list', async () => {
		respond(fetchMock, DNC_LISTED);

		const result = await invoke(Phones.dncLookup, {
			phone: '7275555555',
		});

		expect(result.national_dnc).toBe('Y');
	});

	it('keeps a timeout as ?, which is not a clearance', async () => {
		respond(fetchMock, DNC_TIMEOUT);

		const result = await invoke(Phones.dncLookup, {
			phone: '7275555555',
		});

		// The docs say ? means a timeout or an unchecked list, so a caller must
		// not read it as "not listed".
		expect(result.national_dnc).toBe('?');
	});
});

describe('dncPlus', () => {
	it('reads a cleared number with its connection status', async () => {
		respond(fetchMock, DNC_PLUS_CLEAR);

		const result = await invoke(Phones.dncPlus, { phone: '7275555555' });

		expect(lastRequest(fetchMock).path).toBe('/rpvWebService/DNCPlus.php');
		expect(result.status).toBe('connected');
		expect(result.national_dnc).toBe('N');
	});

	it('reads a listed number', async () => {
		respond(fetchMock, DNC_PLUS_LISTED);

		const result = await invoke(Phones.dncPlus, { phone: '7275555555' });

		expect(result.national_dnc).toBe('Y');
	});
});

describe('fraudCheck', () => {
	it('returns the risk score and recommendation', async () => {
		respond(fetchMock, FRAUD_MEDIUM);

		const result = await invoke(Phones.fraudCheck, {
			phone: '7275555555',
		});

		expect(lastRequest(fetchMock).path).toBe(
			'/rpvWebService/RealPhoneValidationFraudChk.php',
		);
		expect(result.risk_level).toBe('medium');
		// The score is a numeric string, as the service serialises it.
		expect(result.score).toBe('401');
		expect(result.recommendation).toBe('flag');
		expect(result.phn_desc).toBe('VOIP');
	});

	it('keeps the location and carrier', async () => {
		respond(fetchMock, FRAUD_MEDIUM);

		const result = await invoke(Phones.fraudCheck, {
			phone: '7275555555',
		});

		expect(result.carrier).toContain('RingCentral');
		expect(result.location_city).toBe('Countryside');
		expect(result.location_state).toBe('FL');
	});

	it('logs the risk level and score', async () => {
		respond(fetchMock, FRAUD_MEDIUM);

		await invoke(Phones.fraudCheck, { phone: '7275555555' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'realphonevalidation.fraudCheck',
			{ riskLevel: 'medium', score: '401', recommendation: 'flag' },
			'completed',
		);
	});
});

describe('reassigned', () => {
	it('reports a number that was not reassigned', async () => {
		respond(fetchMock, REASSIGNED_NO);

		const result = await invoke(Phones.reassigned, {
			phone: '7275555555',
			contact_date: '2010-01-01',
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/rpvWebService/ReassignedNumberLookup.php');
		expect(request.query.contact_date).toBe('2010-01-01');
		expect(result.reassigned).toBe('no');
	});

	it('reports a reassigned number', async () => {
		respond(fetchMock, REASSIGNED_YES);

		const result = await invoke(Phones.reassigned, {
			phone: '7275555555',
			contact_date: '2010-01-01',
		});

		expect(result.reassigned).toBe('yes');
	});

	it('keeps no_data distinct from no', async () => {
		respond(fetchMock, REASSIGNED_NO_DATA);

		const result = await invoke(Phones.reassigned, {
			phone: '7275555555',
			contact_date: '2010-01-01',
		});

		// no_data means the carriers recorded no change since 27 January 2021,
		// which is not the same as "not reassigned".
		expect(result.reassigned).toBe('no_data');
	});

	it('rejects a date that is not YYYY-MM-DD', async () => {
		await expect(
			invoke(Phones.reassigned, {
				phone: '7275555555',
				contact_date: '01/01/2010',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a call with no consent date', async () => {
		await expect(
			invoke(Phones.reassigned, { phone: '7275555555' }),
		).rejects.toThrow();
	});
});

describe('emailVerify', () => {
	it('verifies a valid address', async () => {
		respond(fetchMock, EMAIL_VALID);

		const result = await invoke(Phones.emailVerify, {
			email: 'johnsmith@test.com',
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/rpvWebService/EmailVerify.php');
		expect(request.query.email).toBe('johnsmith@test.com');
		expect(result.retval).toBe('0');
		expect(result.status).toBe('valid');
		expect(result.disposable).toBe('N');
	});

	it('surfaces a malformed address as a refusal with retval -1', async () => {
		respond(fetchMock, EMAIL_BAD_FORMAT);

		await expect(
			invoke(Phones.emailVerify, { email: 'johnsmith@test.com.com' }),
		).rejects.toThrow('invalid email address format');
	});

	it('surfaces retval 102 as a malformed address, not an empty balance', async () => {
		respond(fetchMock, EMAIL_RETVAL_102);

		const error = await invoke(Phones.emailVerify, {
			email: 'johnsmith@test',
		}).then(
			() => undefined,
			// unknown: a rejection carries whatever was thrown; narrowed below.
			(caught: unknown) => caught,
		);

		expect(error).toBeInstanceOf(RealPhoneValidationAPIError);
		if (!(error instanceof RealPhoneValidationAPIError)) return;
		expect(error.isValidationError).toBe(true);
		expect(error.isQuotaError).toBe(false);
	});

	it('rejects an empty address before calling the service', async () => {
		await expect(invoke(Phones.emailVerify, { email: '' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('refusals expressed in a 200', () => {
	it('turns an unrecognised token into an error, not a validation result', async () => {
		respond(fetchMock, REFUSED_UNAUTHORIZED_STATUS);

		await expect(
			invoke(Phones.wirelessId, { phone: '7275555555' }),
		).rejects.toThrow('unauthorized');
	});

	it('turns a missing token into an error', async () => {
		respond(fetchMock, REFUSED_MISSING_TOKEN);

		await expect(invoke(Phones.scrub, { phone: '7275555555' })).rejects.toThrow(
			'missing token',
		);
	});
});
