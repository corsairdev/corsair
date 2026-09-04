import { ApiError, request } from 'corsair/http';
import { makeDadataruRequest } from './client';
import {
	Clean,
	Find,
	Geolocate,
	IpLocate,
	Profile,
	Suggest,
} from './endpoints';
import {
	DadataruEndpointInputSchemas,
	DadataruEndpointOutputSchemas,
} from './endpoints/types';
import type { DadataruContext } from './index';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

function lastCall() {
	const call = mockRequest.mock.calls[mockRequest.mock.calls.length - 1];
	return { config: call?.[0], options: call?.[1] };
}

function expectRequest(expected: {
	method: string;
	url: string;
	body?: unknown;
	query?: unknown;
}) {
	const { options } = lastCall();
	expect(options.method).toBe(expected.method);
	expect(options.url).toBe(expected.url);
	if (expected.body !== undefined) {
		expect(options.body).toEqual(expected.body);
	}
	if (expected.query !== undefined) {
		expect(options.query).toEqual(expected.query);
	}
}

function apiErrorLike(fields: {
	status: number;
	statusText?: string;
	retryAfter?: number;
	body?: unknown;
}): ApiError {
	return Object.setPrototypeOf(
		{
			status: fields.status,
			statusText: fields.statusText ?? '',
			retryAfter: fields.retryAfter,
			body: fields.body,
		},
		ApiError.prototype,
	) as ApiError;
}

describe('Dadataru API Client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({});
	});

	it('routes suggestions requests correctly', async () => {
		await makeDadataruRequest('suggest/address', 'test-api-key', {
			method: 'POST',
			body: { query: 'мск' },
			apiType: 'suggest',
		});

		const { config, options } = lastCall();
		expect(config.BASE).toBe(
			'https://suggestions.dadata.ru/suggestions/api/4_1/rs',
		);
		expect(options.method).toBe('POST');
		expect(config.HEADERS['Authorization']).toBe('Token test-api-key');
	});

	it('routes clean requests correctly with X-Secret', async () => {
		await makeDadataruRequest('clean/address', 'test-api-key', {
			method: 'POST',
			body: ['мск сухонская'],
			apiType: 'clean',
			secretKey: 'test-secret-key',
		});

		const { config, options } = lastCall();
		expect(config.BASE).toBe('https://cleaner.dadata.ru/api/v1');
		expect(options.method).toBe('POST');
		expect(config.HEADERS['X-Secret']).toBe('test-secret-key');
	});

	it('routes profile requests correctly', async () => {
		await makeDadataruRequest('profile/balance', 'test-api-key', {
			method: 'GET',
			apiType: 'profile',
			secretKey: 'test-secret-key',
		});

		const { config, options } = lastCall();
		expect(config.BASE).toBe('https://dadata.ru/api/v2');
		expect(options.method).toBe('GET');
		expect(config.HEADERS['X-Secret']).toBe('test-secret-key');
	});

	it('omits X-Secret when no secret key is given', async () => {
		await makeDadataruRequest('version', 'test-api-key', {
			method: 'GET',
			apiType: 'profile',
		});

		const { config } = lastCall();
		expect(config.HEADERS['X-Secret']).toBeUndefined();
	});

	it('omits body for GET requests', async () => {
		await makeDadataruRequest('iplocate/address', 'test-api-key', {
			method: 'GET',
			query: { ip: '1.2.3.4' },
		});

		const { options } = lastCall();
		expect(options.body).toBeUndefined();
		expect(options.query).toEqual({ ip: '1.2.3.4' });
	});

	it('preserves status and retry-after from ApiError rejections', async () => {
		mockRequest.mockRejectedValueOnce(
			apiErrorLike({
				status: 429,
				statusText: 'Too Many Requests',
				retryAfter: 30,
				body: { detail: 'quota exceeded' },
			}),
		);

		await expect(
			makeDadataruRequest('suggest/address', 'test-api-key', {
				method: 'POST',
				body: { query: 'мск' },
			}),
		).rejects.toMatchObject({
			name: 'DadataruAPIError',
			status: 429,
			statusText: 'Too Many Requests',
			retryAfter: 30,
			body: { detail: 'quota exceeded' },
			message: 'Too Many Requests: {"detail":"quota exceeded"}',
		});
	});

	it('keeps error metadata so rate-limit handlers can honor Retry-After', async () => {
		mockRequest.mockRejectedValueOnce(
			apiErrorLike({ status: 429, retryAfter: 5 }),
		);

		const error = await makeDadataruRequest('suggest/address', 'test-api-key', {
			method: 'POST',
			body: { query: 'мск' },
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(Error);
		expect((error as { retryAfter?: number }).retryAfter).toBe(5);
		expect((error as { status?: number }).status).toBe(429);
	});

	it('wraps plain Error rejections with the plugin error type', async () => {
		mockRequest.mockRejectedValueOnce(new Error('network down'));

		await expect(
			makeDadataruRequest('suggest/address', 'test-api-key'),
		).rejects.toMatchObject({
			name: 'DadataruAPIError',
			message: 'network down',
		});
	});

	it('wraps non-error rejections as unknown errors', async () => {
		mockRequest.mockRejectedValueOnce('boom');

		await expect(
			makeDadataruRequest('suggest/address', 'test-api-key'),
		).rejects.toMatchObject({
			name: 'DadataruAPIError',
			message: 'Unknown error',
		});
	});
});

describe('Dadataru Endpoints', () => {
	const getSecretKey = jest.fn<Promise<string | null>, []>();

	const mockCtx = {
		key: 'test-key',
		keys: {
			get_secret_key: getSecretKey,
		},
	} as unknown as DadataruContext;

	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({});
		getSecretKey.mockReset();
		getSecretKey.mockResolvedValue('test-secret');
	});

	describe('Clean Endpoints (8)', () => {
		it('cleanAddress', async () => {
			await Clean.address(mockCtx, { queries: ['мск'] });
			expectRequest({
				method: 'POST',
				url: 'clean/address',
				body: ['мск'],
			});
			const { config } = lastCall();
			expect(config.HEADERS['Authorization']).toBe('Token test-key');
			expect(config.HEADERS['X-Secret']).toBe('test-secret');
		});

		it('cleanBirthdate', async () => {
			await Clean.birthdate(mockCtx, { queries: ['24.08.2026'] });
			expectRequest({
				method: 'POST',
				url: 'clean/birthdate',
				body: ['24.08.2026'],
			});
		});

		it('cleanRecord (composite)', async () => {
			await Clean.cleanRecord(mockCtx, {
				structure: ['NAME'],
				data: [['иванов']],
			});
			expectRequest({
				method: 'POST',
				url: 'clean',
				body: { structure: ['NAME'], data: [['иванов']] },
			});
		});

		it('cleanEmail', async () => {
			await Clean.email(mockCtx, { queries: ['test@domain.com'] });
			expectRequest({
				method: 'POST',
				url: 'clean/email',
				body: ['test@domain.com'],
			});
		});

		it('cleanName', async () => {
			await Clean.name(mockCtx, { queries: ['Иван'] });
			expectRequest({ method: 'POST', url: 'clean/name', body: ['Иван'] });
		});

		it('cleanPassport', async () => {
			await Clean.passport(mockCtx, { queries: ['4510 123456'] });
			expectRequest({
				method: 'POST',
				url: 'clean/passport',
				body: ['4510 123456'],
			});
		});

		it('cleanPhone', async () => {
			await Clean.phone(mockCtx, { queries: ['+7 499 123-45-67'] });
			expectRequest({
				method: 'POST',
				url: 'clean/phone',
				body: ['+7 499 123-45-67'],
			});
		});

		it('cleanVehicle', async () => {
			await Clean.vehicle(mockCtx, { queries: ['форд фокус'] });
			expectRequest({
				method: 'POST',
				url: 'clean/vehicle',
				body: ['форд фокус'],
			});
		});

		it('parses clean input and output schemas', async () => {
			mockRequest.mockResolvedValueOnce([{ result: 'Иванов Иван' }]);
			const result = await Clean.address(mockCtx, { queries: ['иванов'] });
			expect(
				DadataruEndpointInputSchemas.cleanAddress.safeParse({
					queries: ['иванов'],
				}).success,
			).toBe(true);
			expect(
				DadataruEndpointOutputSchemas.cleanAddress.safeParse(result).success,
			).toBe(true);
		});
	});

	describe('Find Endpoints (24)', () => {
		it('findAddress', async () => {
			await Find.address(mockCtx, { query: 'мск' });
			expectRequest({
				method: 'POST',
				url: 'findById/address',
				body: { query: 'мск', count: 5 },
			});
		});

		it('findFiasById', async () => {
			await Find.fiasById(mockCtx, { query: '9c1ba251' });
			expectRequest({
				method: 'POST',
				url: 'findById/fias',
				body: { query: '9c1ba251', count: 5 },
			});
		});

		it('findBank forwards kpp', async () => {
			await Find.bank(mockCtx, { query: 'сбэр', kpp: '7707083893' });
			expectRequest({
				method: 'POST',
				url: 'findById/bank',
				body: { query: 'сбэр', count: 5, kpp: '7707083893' },
			});
		});

		it('findPartyBy', async () => {
			await Find.partyBy(mockCtx, { query: 'белпочта' });
			expectRequest({
				method: 'POST',
				url: 'findById/party',
				body: { query: 'белпочта', count: 5 },
			});
		});

		it('findCarBrand', async () => {
			await Find.carBrand(mockCtx, { query: 'ford' });
			expectRequest({
				method: 'POST',
				url: 'findById/car_brand',
				body: { query: 'ford', count: 5 },
			});
		});

		it('findCompanyByEmail', async () => {
			await Find.companyByEmail(mockCtx, { query: 'info@corp.ru' });
			expectRequest({
				method: 'POST',
				url: 'findByEmail/company',
				body: { query: 'info@corp.ru', count: 5 },
			});
		});

		it('findParty forwards kpp', async () => {
			await Find.party(mockCtx, { query: 'сбербанк', kpp: '773601001' });
			expectRequest({
				method: 'POST',
				url: 'findById/party',
				body: { query: 'сбербанк', count: 5, kpp: '773601001' },
			});
		});

		it('findCountry', async () => {
			await Find.country(mockCtx, { query: 'сша' });
			expectRequest({
				method: 'POST',
				url: 'findById/country',
				body: { query: 'сша', count: 5 },
			});
		});

		it('findCourtById', async () => {
			await Find.courtById(mockCtx, { query: 'court-1' });
			expectRequest({
				method: 'POST',
				url: 'findById/court',
				body: { query: 'court-1', count: 5 },
			});
		});

		it('findCurrency', async () => {
			await Find.currency(mockCtx, { query: 'usd' });
			expectRequest({
				method: 'POST',
				url: 'findById/currency',
				body: { query: 'usd', count: 5 },
			});
		});

		it('findDelivery', async () => {
			await Find.delivery(mockCtx, { query: ' вырастет ' });
			expectRequest({
				method: 'POST',
				url: 'findById/delivery',
				body: { query: ' вырастет ', count: 5 },
			});
		});

		it('findFmsUnit', async () => {
			await Find.fmsUnit(mockCtx, { query: '770-000' });
			expectRequest({
				method: 'POST',
				url: 'findById/fms_unit',
				body: { query: '770-000', count: 5 },
			});
		});

		it('findFnsUnit', async () => {
			await Find.fnsUnit(mockCtx, { query: '7700' });
			expectRequest({
				method: 'POST',
				url: 'findById/fns_unit',
				body: { query: '7700', count: 5 },
			});
		});

		it('findFtsUnit', async () => {
			await Find.ftsUnit(mockCtx, { query: 'Москва' });
			expectRequest({
				method: 'POST',
				url: 'findById/fts_unit',
				body: { query: 'Москва', count: 5 },
			});
		});

		it('findPartyKz', async () => {
			await Find.partyKz(mockCtx, { query: 'алматы' });
			expectRequest({
				method: 'POST',
				url: 'findById/party',
				body: { query: 'алматы', count: 5 },
			});
		});

		it('findMktu', async () => {
			await Find.mktu(mockCtx, { query: 'пиво' });
			expectRequest({
				method: 'POST',
				url: 'findById/mktu',
				body: { query: 'пиво', count: 5 },
			});
		});

		it('findMedicalPositionById', async () => {
			await Find.medicalPositionById(mockCtx, { query: 'медсестра' });
			expectRequest({
				method: 'POST',
				url: 'findById/medical_position',
				body: { query: 'медсестра', count: 5 },
			});
		});

		it('findOkpd2ById', async () => {
			await Find.okpd2ById(mockCtx, { query: '01.11' });
			expectRequest({
				method: 'POST',
				url: 'findById/okpd2',
				body: { query: '01.11', count: 5 },
			});
		});

		it('findOkpdtrPosition routes to the suggest compat endpoint', async () => {
			await Find.okpdtrPosition(mockCtx, { query: 'инженер' });
			expectRequest({
				method: 'POST',
				url: 'suggest/okpdtr_position',
				body: { query: 'инженер', count: 5 },
			});
		});

		it('findOkpdtrProfession routes to the suggest compat endpoint', async () => {
			await Find.okpdtrProfession(mockCtx, { query: 'сварщик' });
			expectRequest({
				method: 'POST',
				url: 'suggest/okpdtr_profession',
				body: { query: 'сварщик', count: 5 },
			});
		});

		it('findOkved2', async () => {
			await Find.okved2(mockCtx, { query: '62.01' });
			expectRequest({
				method: 'POST',
				url: 'findById/okved2',
				body: { query: '62.01', count: 5 },
			});
		});

		it('findPostalOffice', async () => {
			await Find.postalOffice(mockCtx, { query: '127964' });
			expectRequest({
				method: 'POST',
				url: 'findById/postal_office',
				body: { query: '127964', count: 5 },
			});
		});

		it('findPostalUnitById', async () => {
			await Find.postalUnitById(mockCtx, { query: 'unit-1' });
			expectRequest({
				method: 'POST',
				url: 'findById/postal_unit',
				body: { query: 'unit-1', count: 5 },
			});
		});

		it('findOktmoById', async () => {
			await Find.oktmoById(mockCtx, { query: '45000000' });
			expectRequest({
				method: 'POST',
				url: 'findById/oktmo',
				body: { query: '45000000', count: 5 },
			});
		});

		it('parses find input and output schemas', async () => {
			mockRequest.mockResolvedValueOnce({
				suggestions: [{ value: 'мск', unrestricted_value: 'Москва', data: {} }],
			});
			const result = await Find.address(mockCtx, { query: 'мск' });
			expect(
				DadataruEndpointInputSchemas.findAddress.safeParse({ query: 'мск' })
					.success,
			).toBe(true);
			expect(
				DadataruEndpointOutputSchemas.findAddress.safeParse(result).success,
			).toBe(true);
		});
	});

	describe('Geolocate Endpoints (2)', () => {
		it('geolocateAddress', async () => {
			await Geolocate.address(mockCtx, { lat: 55.75, lon: 37.62 });
			expectRequest({
				method: 'POST',
				url: 'geolocate/address',
				body: { lat: 55.75, lon: 37.62, count: 5 },
			});
		});

		it('geolocatePostalUnit forwards radius', async () => {
			await Geolocate.postalUnit(mockCtx, {
				lat: 59.93,
				lon: 30.33,
				radius_meters: 1000,
			});
			expectRequest({
				method: 'POST',
				url: 'geolocate/postal_unit',
				body: { lat: 59.93, lon: 30.33, radius_meters: 1000, count: 5 },
			});
		});

		it('parses geolocate input and output schemas', async () => {
			mockRequest.mockResolvedValueOnce({
				suggestions: [{ value: 'мск', unrestricted_value: 'Москва', data: {} }],
			});
			const result = await Geolocate.address(mockCtx, {
				lat: 55.75,
				lon: 37.62,
			});
			expect(
				DadataruEndpointInputSchemas.geolocateAddress.safeParse({
					lat: 55.75,
					lon: 37.62,
				}).success,
			).toBe(true);
			expect(
				DadataruEndpointOutputSchemas.geolocateAddress.safeParse(result)
					.success,
			).toBe(true);
		});
	});

	describe('IP Locate Endpoints (1)', () => {
		it('ipLocateAddress with ip', async () => {
			await IpLocate.address(mockCtx, { ip: '8.8.8.8' });
			expectRequest({
				method: 'GET',
				url: 'iplocate/address',
				query: { ip: '8.8.8.8' },
			});
		});

		it('ipLocateAddress without ip sends an empty query', async () => {
			await IpLocate.address(mockCtx, {});
			expectRequest({
				method: 'GET',
				url: 'iplocate/address',
				query: {},
			});
		});

		it('parses iplocate output schemas', async () => {
			mockRequest.mockResolvedValueOnce({
				location: { city: 'Mountain View' },
			});
			const result = await IpLocate.address(mockCtx, { ip: '8.8.8.8' });
			expect(
				DadataruEndpointOutputSchemas.ipLocateAddress.safeParse(result).success,
			).toBe(true);
		});
	});

	describe('Profile Endpoints (3)', () => {
		it('getProfileBalance sends the stored secret key', async () => {
			mockRequest.mockResolvedValueOnce({ balance: 100 });
			const result = await Profile.balance(mockCtx, {});
			expectRequest({ method: 'GET', url: 'profile/balance' });
			const { config } = lastCall();
			expect(config.HEADERS['X-Secret']).toBe('test-secret');
			expect(result).toEqual({ balance: 100 });
			expect(getSecretKey).toHaveBeenCalledTimes(1);
		});

		it('getProfileStatistics', async () => {
			await Profile.statistics(mockCtx, {});
			expectRequest({ method: 'GET', url: 'stat/daily' });
			const { config } = lastCall();
			expect(config.HEADERS['X-Secret']).toBe('test-secret');
		});

		it('getReferenceVersions omits X-Secret', async () => {
			await Profile.versions(mockCtx, {});
			expectRequest({ method: 'GET', url: 'version' });
			const { config } = lastCall();
			expect(config.HEADERS['X-Secret']).toBeUndefined();
		});

		it('parses balance output schemas', async () => {
			mockRequest.mockResolvedValueOnce({ balance: 42 });
			const result = await Profile.balance(mockCtx, {});
			expect(
				DadataruEndpointOutputSchemas.getProfileBalance.safeParse(result)
					.success,
			).toBe(true);
		});
	});

	describe('Suggest Endpoints (25)', () => {
		it('suggestAddress', async () => {
			await Suggest.address(mockCtx, { query: 'msk' });
			expectRequest({
				method: 'POST',
				url: 'suggest/address',
				body: { query: 'msk', count: 5 },
			});
		});

		it('suggestBank forwards custom count', async () => {
			await Suggest.bank(mockCtx, { query: 'sber', count: 3 });
			expectRequest({
				method: 'POST',
				url: 'suggest/bank',
				body: { query: 'sber', count: 3 },
			});
		});

		it('suggestPartyBy', async () => {
			await Suggest.partyBy(mockCtx, { query: 'by' });
			expectRequest({
				method: 'POST',
				url: 'suggest/party',
				body: { query: 'by', count: 5 },
			});
		});

		it('suggestCarBrand', async () => {
			await Suggest.carBrand(mockCtx, { query: 'bmw' });
			expectRequest({
				method: 'POST',
				url: 'suggest/car_brand',
				body: { query: 'bmw', count: 5 },
			});
		});

		it('suggestCountry', async () => {
			await Suggest.country(mockCtx, { query: 'ru' });
			expectRequest({
				method: 'POST',
				url: 'suggest/country',
				body: { query: 'ru', count: 5 },
			});
		});

		it('suggestCourt', async () => {
			await Suggest.court(mockCtx, { query: 'court' });
			expectRequest({
				method: 'POST',
				url: 'suggest/court',
				body: { query: 'court', count: 5 },
			});
		});

		it('suggestCurrency', async () => {
			await Suggest.currency(mockCtx, { query: 'eur' });
			expectRequest({
				method: 'POST',
				url: 'suggest/currency',
				body: { query: 'eur', count: 5 },
			});
		});

		it('suggestEmail', async () => {
			await Suggest.email(mockCtx, { query: 'test@' });
			expectRequest({
				method: 'POST',
				url: 'suggest/email',
				body: { query: 'test@', count: 5 },
			});
		});

		it('suggestFias', async () => {
			await Suggest.fias(mockCtx, { query: 'москва' });
			expectRequest({
				method: 'POST',
				url: 'suggest/fias',
				body: { query: 'москва', count: 5 },
			});
		});

		it('suggestFmsUnit', async () => {
			await Suggest.fmsUnit(mockCtx, { query: '770-000' });
			expectRequest({
				method: 'POST',
				url: 'suggest/fms_unit',
				body: { query: '770-000', count: 5 },
			});
		});

		it('suggestFnsUnit', async () => {
			await Suggest.fnsUnit(mockCtx, { query: '7700' });
			expectRequest({
				method: 'POST',
				url: 'suggest/fns_unit',
				body: { query: '7700', count: 5 },
			});
		});

		it('suggestFtsUnit', async () => {
			await Suggest.ftsUnit(mockCtx, { query: 'Москва' });
			expectRequest({
				method: 'POST',
				url: 'suggest/fts_unit',
				body: { query: 'Москва', count: 5 },
			});
		});

		it('suggestPartyKz', async () => {
			await Suggest.partyKz(mockCtx, { query: 'алматы' });
			expectRequest({
				method: 'POST',
				url: 'suggest/party',
				body: { query: 'алматы', count: 5 },
			});
		});

		it('suggestMktu', async () => {
			await Suggest.mktu(mockCtx, { query: 'пиво' });
			expectRequest({
				method: 'POST',
				url: 'suggest/mktu',
				body: { query: 'пиво', count: 5 },
			});
		});

		it('suggestMedicalPosition', async () => {
			await Suggest.medicalPosition(mockCtx, { query: 'терапевт' });
			expectRequest({
				method: 'POST',
				url: 'suggest/medical_position',
				body: { query: 'терапевт', count: 5 },
			});
		});

		it('suggestMetro', async () => {
			await Suggest.metro(mockCtx, { query: 'сокольники' });
			expectRequest({
				method: 'POST',
				url: 'suggest/metro',
				body: { query: 'сокольники', count: 5 },
			});
		});

		it('suggestName', async () => {
			await Suggest.name(mockCtx, { query: 'иванов' });
			expectRequest({
				method: 'POST',
				url: 'suggest/fio',
				body: { query: 'иванов', count: 5 },
			});
		});

		it('suggestOkpd2', async () => {
			await Suggest.okpd2(mockCtx, { query: '01.11' });
			expectRequest({
				method: 'POST',
				url: 'suggest/okpd2',
				body: { query: '01.11', count: 5 },
			});
		});

		it('suggestOkpdtrPosition', async () => {
			await Suggest.okpdtrPosition(mockCtx, { query: 'инженер' });
			expectRequest({
				method: 'POST',
				url: 'suggest/okpdtr_position',
				body: { query: 'инженер', count: 5 },
			});
		});

		it('suggestOkpdtrProfession', async () => {
			await Suggest.okpdtrProfession(mockCtx, { query: 'сварщик' });
			expectRequest({
				method: 'POST',
				url: 'suggest/okpdtr_profession',
				body: { query: 'сварщик', count: 5 },
			});
		});

		it('suggestOktmo', async () => {
			await Suggest.oktmo(mockCtx, { query: '45000000' });
			expectRequest({
				method: 'POST',
				url: 'suggest/oktmo',
				body: { query: '45000000', count: 5 },
			});
		});

		it('suggestOkved2', async () => {
			await Suggest.okved2(mockCtx, { query: '62.01' });
			expectRequest({
				method: 'POST',
				url: 'suggest/okved2',
				body: { query: '62.01', count: 5 },
			});
		});

		it('suggestParty', async () => {
			await Suggest.party(mockCtx, { query: 'сбербанк' });
			expectRequest({
				method: 'POST',
				url: 'suggest/party',
				body: { query: 'сбербанк', count: 5 },
			});
		});

		it('suggestPostalOffice', async () => {
			await Suggest.postalOffice(mockCtx, { query: '127964' });
			expectRequest({
				method: 'POST',
				url: 'suggest/postal_office',
				body: { query: '127964', count: 5 },
			});
		});

		it('suggestPostalUnit', async () => {
			await Suggest.postalUnit(mockCtx, { query: 'спб 190000' });
			expectRequest({
				method: 'POST',
				url: 'suggest/postal_unit',
				body: { query: 'спб 190000', count: 5 },
			});
		});

		it('parses suggest input and output schemas', async () => {
			mockRequest.mockResolvedValueOnce({
				suggestions: [{ value: 'msk', unrestricted_value: 'Москва', data: {} }],
			});
			const result = await Suggest.address(mockCtx, { query: 'msk' });
			expect(
				DadataruEndpointInputSchemas.suggestAddress.safeParse({
					query: 'msk',
				}).success,
			).toBe(true);
			expect(
				DadataruEndpointOutputSchemas.suggestAddress.safeParse(result).success,
			).toBe(true);
		});
	});
});
