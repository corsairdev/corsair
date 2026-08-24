import { request } from 'corsair/http';
import { makeDadataruRequest } from './client';
import {
	Clean,
	Find,
	Geolocate,
	IpLocate,
	Profile,
	Suggest,
} from './endpoints';
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
});

describe('Dadataru Endpoints', () => {
	const mockCtx = {
		key: 'test-key',
		options: {
			secret: 'test-secret',
		},
	} as unknown as DadataruContext;

	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({});
	});

	describe('Clean Endpoints (8)', () => {
		it('cleanAddress', async () => {
			await Clean.address(mockCtx, { queries: ['мск'] });
			expect(lastCall().options.url).toBe('clean/address');
		});

		it('cleanBirthdate', async () => {
			await Clean.birthdate(mockCtx, { queries: ['24.08.2026'] });
			expect(lastCall().options.url).toBe('clean/birthdate');
		});

		it('cleanRecord (composite)', async () => {
			await Clean.cleanRecord(mockCtx, {
				structure: ['NAME'],
				data: [['иванов']],
			});
			expect(lastCall().options.url).toBe('clean');
		});

		it('cleanEmail', async () => {
			await Clean.email(mockCtx, { queries: ['test@domain.com'] });
			expect(lastCall().options.url).toBe('clean/email');
		});

		it('cleanName', async () => {
			await Clean.name(mockCtx, { queries: ['Иван'] });
			expect(lastCall().options.url).toBe('clean/name');
		});

		it('cleanPassport', async () => {
			await Clean.passport(mockCtx, { queries: ['123456'] });
			expect(lastCall().options.url).toBe('clean/passport');
		});

		it('cleanPhone', async () => {
			await Clean.phone(mockCtx, { queries: ['+79991112233'] });
			expect(lastCall().options.url).toBe('clean/phone');
		});

		it('cleanVehicle', async () => {
			await Clean.vehicle(mockCtx, { queries: ['ford'] });
			expect(lastCall().options.url).toBe('clean/vehicle');
		});
	});

	describe('Find/Lookup Endpoints (24)', () => {
		it('findAddress', async () => {
			await Find.address(mockCtx, { query: 'id1' });
			expect(lastCall().options.url).toBe('findById/address');
		});

		it('findFiasById', async () => {
			await Find.fiasById(mockCtx, { query: 'id1' });
			expect(lastCall().options.url).toBe('findById/fias');
		});

		it('findBank', async () => {
			await Find.bank(mockCtx, { query: 'bic1' });
			expect(lastCall().options.url).toBe('findById/bank');
		});

		it('findPartyBy', async () => {
			await Find.partyBy(mockCtx, { query: 'unp1' });
			expect(lastCall().options.url).toBe('findById/party');
		});

		it('findCarBrand', async () => {
			await Find.carBrand(mockCtx, { query: 'brand1' });
			expect(lastCall().options.url).toBe('findById/car_brand');
		});

		it('findCompanyByEmail', async () => {
			await Find.companyByEmail(mockCtx, { query: 'email1' });
			expect(lastCall().options.url).toBe('findByEmail/company');
		});

		it('findParty', async () => {
			await Find.party(mockCtx, { query: 'inn1' });
			expect(lastCall().options.url).toBe('findById/party');
		});

		it('findCountry', async () => {
			await Find.country(mockCtx, { query: 'code1' });
			expect(lastCall().options.url).toBe('findById/country');
		});

		it('findCourtById', async () => {
			await Find.courtById(mockCtx, { query: 'court1' });
			expect(lastCall().options.url).toBe('findById/court');
		});

		it('findCurrency', async () => {
			await Find.currency(mockCtx, { query: 'currency1' });
			expect(lastCall().options.url).toBe('findById/currency');
		});

		it('findDelivery', async () => {
			await Find.delivery(mockCtx, { query: 'delivery1' });
			expect(lastCall().options.url).toBe('findById/delivery');
		});

		it('findFmsUnit', async () => {
			await Find.fmsUnit(mockCtx, { query: 'fms1' });
			expect(lastCall().options.url).toBe('findById/fms_unit');
		});

		it('findFnsUnit', async () => {
			await Find.fnsUnit(mockCtx, { query: 'fns1' });
			expect(lastCall().options.url).toBe('findById/fns_unit');
		});

		it('findFtsUnit', async () => {
			await Find.ftsUnit(mockCtx, { query: 'fts1' });
			expect(lastCall().options.url).toBe('findById/fts_unit');
		});

		it('findPartyKz', async () => {
			await Find.partyKz(mockCtx, { query: 'bin1' });
			expect(lastCall().options.url).toBe('findById/party');
		});

		it('findMktu', async () => {
			await Find.mktu(mockCtx, { query: 'mktu1' });
			expect(lastCall().options.url).toBe('findById/mktu');
		});

		it('findMedicalPositionById', async () => {
			await Find.medicalPositionById(mockCtx, { query: 'med1' });
			expect(lastCall().options.url).toBe('findById/medical_position');
		});

		it('findOkpd2ById', async () => {
			await Find.okpd2ById(mockCtx, { query: 'okpd1' });
			expect(lastCall().options.url).toBe('findById/okpd2');
		});

		it('findOkpdtrPosition', async () => {
			await Find.okpdtrPosition(mockCtx, { query: 'okpdtr1' });
			expect(lastCall().options.url).toBe('suggest/okpdtr_position');
		});

		it('findOkpdtrProfession', async () => {
			await Find.okpdtrProfession(mockCtx, { query: 'okpdtr2' });
			expect(lastCall().options.url).toBe('suggest/okpdtr_profession');
		});

		it('findOkved2', async () => {
			await Find.okved2(mockCtx, { query: 'okved1' });
			expect(lastCall().options.url).toBe('findById/okved2');
		});

		it('findPostalOffice', async () => {
			await Find.postalOffice(mockCtx, { query: 'post1' });
			expect(lastCall().options.url).toBe('findById/postal_office');
		});

		it('findPostalUnitById', async () => {
			await Find.postalUnitById(mockCtx, { query: 'unit1' });
			expect(lastCall().options.url).toBe('findById/postal_unit');
		});

		it('findOktmoById', async () => {
			await Find.oktmoById(mockCtx, { query: 'oktmo1' });
			expect(lastCall().options.url).toBe('findById/oktmo');
		});
	});

	describe('Geolocate Endpoints (2)', () => {
		it('geolocateAddress', async () => {
			await Geolocate.address(mockCtx, { lat: 55, lon: 37 });
			expect(lastCall().options.url).toBe('geolocate/address');
		});

		it('geolocatePostalUnit', async () => {
			await Geolocate.postalUnit(mockCtx, { lat: 55, lon: 37 });
			expect(lastCall().options.url).toBe('geolocate/postal_unit');
		});
	});

	describe('IP Locate Endpoints (1)', () => {
		it('ipLocateAddress', async () => {
			await IpLocate.address(mockCtx, { ip: '127.0.0.1' });
			expect(lastCall().options.url).toBe('iplocate/address');
		});
	});

	describe('Profile Endpoints (3)', () => {
		it('getProfileBalance', async () => {
			await Profile.balance(mockCtx, {});
			expect(lastCall().options.url).toBe('profile/balance');
		});

		it('getProfileStatistics', async () => {
			await Profile.statistics(mockCtx, {});
			expect(lastCall().options.url).toBe('stat/daily');
		});

		it('getReferenceVersions', async () => {
			await Profile.versions(mockCtx, {});
			expect(lastCall().options.url).toBe('version');
		});
	});

	describe('Suggest Endpoints (25)', () => {
		it('suggestAddress', async () => {
			await Suggest.address(mockCtx, { query: 'msk' });
			expect(lastCall().options.url).toBe('suggest/address');
		});

		it('suggestBank', async () => {
			await Suggest.bank(mockCtx, { query: 'sber' });
			expect(lastCall().options.url).toBe('suggest/bank');
		});

		it('suggestPartyBy', async () => {
			await Suggest.partyBy(mockCtx, { query: 'by' });
			expect(lastCall().options.url).toBe('suggest/party');
		});

		it('suggestCarBrand', async () => {
			await Suggest.carBrand(mockCtx, { query: 'bmw' });
			expect(lastCall().options.url).toBe('suggest/car_brand');
		});

		it('suggestCountry', async () => {
			await Suggest.country(mockCtx, { query: 'ru' });
			expect(lastCall().options.url).toBe('suggest/country');
		});

		it('suggestCourt', async () => {
			await Suggest.court(mockCtx, { query: 'court' });
			expect(lastCall().options.url).toBe('suggest/court');
		});

		it('suggestCurrency', async () => {
			await Suggest.currency(mockCtx, { query: 'rub' });
			expect(lastCall().options.url).toBe('suggest/currency');
		});

		it('suggestEmail', async () => {
			await Suggest.email(mockCtx, { query: 'mail' });
			expect(lastCall().options.url).toBe('suggest/email');
		});

		it('suggestFias', async () => {
			await Suggest.fias(mockCtx, { query: 'fias' });
			expect(lastCall().options.url).toBe('suggest/fias');
		});

		it('suggestFmsUnit', async () => {
			await Suggest.fmsUnit(mockCtx, { query: 'fms' });
			expect(lastCall().options.url).toBe('suggest/fms_unit');
		});

		it('suggestFnsUnit', async () => {
			await Suggest.fnsUnit(mockCtx, { query: 'fns' });
			expect(lastCall().options.url).toBe('suggest/fns_unit');
		});

		it('suggestFtsUnit', async () => {
			await Suggest.ftsUnit(mockCtx, { query: 'fts' });
			expect(lastCall().options.url).toBe('suggest/fts_unit');
		});

		it('suggestPartyKz', async () => {
			await Suggest.partyKz(mockCtx, { query: 'kz' });
			expect(lastCall().options.url).toBe('suggest/party');
		});

		it('suggestMktu', async () => {
			await Suggest.mktu(mockCtx, { query: 'mktu' });
			expect(lastCall().options.url).toBe('suggest/mktu');
		});

		it('suggestMedicalPosition', async () => {
			await Suggest.medicalPosition(mockCtx, { query: 'doc' });
			expect(lastCall().options.url).toBe('suggest/medical_position');
		});

		it('suggestMetro', async () => {
			await Suggest.metro(mockCtx, { query: 'metro' });
			expect(lastCall().options.url).toBe('suggest/metro');
		});

		it('suggestName', async () => {
			await Suggest.name(mockCtx, { query: 'name' });
			expect(lastCall().options.url).toBe('suggest/fio');
		});

		it('suggestOkpd2', async () => {
			await Suggest.okpd2(mockCtx, { query: 'okpd' });
			expect(lastCall().options.url).toBe('suggest/okpd2');
		});

		it('suggestOkpdtrPosition', async () => {
			await Suggest.okpdtrPosition(mockCtx, { query: 'okpdtr' });
			expect(lastCall().options.url).toBe('suggest/okpdtr_position');
		});

		it('suggestOkpdtrProfession', async () => {
			await Suggest.okpdtrProfession(mockCtx, { query: 'okpdtr' });
			expect(lastCall().options.url).toBe('suggest/okpdtr_profession');
		});

		it('suggestOktmo', async () => {
			await Suggest.oktmo(mockCtx, { query: 'oktmo' });
			expect(lastCall().options.url).toBe('suggest/oktmo');
		});

		it('suggestOkved2', async () => {
			await Suggest.okved2(mockCtx, { query: 'okved' });
			expect(lastCall().options.url).toBe('suggest/okved2');
		});

		it('suggestParty', async () => {
			await Suggest.party(mockCtx, { query: 'party' });
			expect(lastCall().options.url).toBe('suggest/party');
		});

		it('suggestPostalOffice', async () => {
			await Suggest.postalOffice(mockCtx, { query: 'post' });
			expect(lastCall().options.url).toBe('suggest/postal_office');
		});

		it('suggestPostalUnit', async () => {
			await Suggest.postalUnit(mockCtx, { query: 'unit' });
			expect(lastCall().options.url).toBe('suggest/postal_unit');
		});
	});
});
