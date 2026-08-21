import { ZodError } from 'zod';
import { makeBartRequest } from '../client';
import {
	Advisories,
	Etd,
	Fares,
	Routes,
	Schedules,
	Stations,
} from '../endpoints';
import type { BartContext } from '../index';

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('../client', () => {
	const original = jest.requireActual('../client');
	return {
		...original,
		makeBartRequest: jest.fn(),
	};
});

describe('BART API Endpoints', () => {
	const mockMakeRequest = makeBartRequest as jest.MockedFunction<
		typeof makeBartRequest
	>;

	let mockContext: BartContext;
	let mockUpsertStation: jest.Mock;
	let mockUpsertRoute: jest.Mock;
	let mockUpsertAdvisory: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
		mockUpsertStation = jest.fn().mockResolvedValue(undefined);
		mockUpsertRoute = jest.fn().mockResolvedValue(undefined);
		mockUpsertAdvisory = jest.fn().mockResolvedValue(undefined);

		mockContext = {
			key: 'TEST_KEY',
			authType: 'api_key',
			$getAccountId: jest.fn().mockResolvedValue('test-account-id'),
			database: {
				events: {
					create: jest.fn().mockResolvedValue(undefined),
				},
			},
			db: {
				stations: {
					upsertByEntityId: mockUpsertStation,
				},
				routes: {
					upsertByEntityId: mockUpsertRoute,
				},
				advisories: {
					upsertByEntityId: mockUpsertAdvisory,
				},
			},
		} as unknown as BartContext;
	});

	describe('Advisories Endpoints', () => {
		it('advisories.list fetches and validates system advisories', async () => {
			const mockPayload = {
				date: '08/21/2026',
				time: '12:00:00 PM PDT',
				bsa: [
					{
						station: '12TH',
						type: 'DELAY',
						description: { '#cdata-section': '10 minute delay at 12th St' },
						sms_text: { '#cdata-section': '10 min delay' },
						posted: 'Fri Aug 21 2026 12:00 PM PDT',
						expires: 'Fri Aug 21 2026 01:00 PM PDT',
					},
				],
			};
			mockMakeRequest.mockResolvedValueOnce(mockPayload);

			const result = await Advisories.list(mockContext, { orig: '12TH' });

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'bsa.aspx',
				'TEST_KEY',
				expect.objectContaining({
					query: expect.objectContaining({ cmd: 'bsa', orig: '12TH' }),
				}),
			);
			expect(result.bsa).toBeDefined();
			expect(mockUpsertAdvisory).toHaveBeenCalledTimes(1);
			expect(mockUpsertAdvisory).toHaveBeenCalledWith(
				'12TH-Fri Aug 21 2026 12:00 PM PDT',
				expect.objectContaining({
					id: '12TH-Fri Aug 21 2026 12:00 PM PDT',
					description: '10 minute delay at 12th St',
					sms_text: '10 min delay',
				}),
			);
		});

		it('advisories.list generates stable entity ID from description fallback when timestamps are absent', async () => {
			const mockPayload = {
				bsa: [
					{
						station: '12TH',
						type: 'DELAY',
						description: 'Track maintenance delay',
					},
				],
			};
			mockMakeRequest.mockResolvedValueOnce(mockPayload);

			await Advisories.list(mockContext, { orig: '12TH' });

			expect(mockUpsertAdvisory).toHaveBeenCalledWith(
				'12TH-Track maintenance delay',
				expect.objectContaining({
					id: '12TH-Track maintenance delay',
					description: 'Track maintenance delay',
				}),
			);
		});

		it('advisories.list rejects whitespace-only origin before HTTP dispatch', async () => {
			await expect(
				Advisories.list(mockContext, { orig: '   ' }),
			).rejects.toThrow(ZodError);

			expect(mockMakeRequest).not.toHaveBeenCalled();
		});

		it('advisories.elevators fetches elevator advisories', async () => {
			const mockPayload = {
				date: '08/21/2026',
				time: '12:00:00 PM PDT',
				bsa: [
					{
						station: 'EMBR',
						type: 'ELEVATOR',
						description: 'Platform elevator out of service',
					},
				],
			};
			mockMakeRequest.mockResolvedValueOnce(mockPayload);

			const result = await Advisories.elevators(mockContext, { orig: 'EMBR' });
			expect(result.bsa).toBeDefined();
		});

		it('advisories.trainCount fetches active train count', async () => {
			mockMakeRequest.mockResolvedValueOnce({
				date: '08/21/2026',
				time: '12:00:00 PM PDT',
				traincount: '54',
			});

			const result = await Advisories.trainCount(mockContext, {});
			expect(result.traincount).toBe('54');
		});
	});

	describe('Real-Time Departures (ETD) Endpoints', () => {
		it('etd.station fetches estimated departure times', async () => {
			const mockPayload = {
				date: '08/21/2026',
				time: '12:00:00 PM PDT',
				station: [
					{
						name: '12th St. Oakland City Center',
						abbr: '12TH',
						etd: [
							{
								destination: 'Antioch',
								abbreviation: 'ANTC',
								estimate: [
									{
										minutes: '4',
										platform: '3',
										direction: 'North',
										length: '10',
										color: 'YELLOW',
										hexcolor: '#ffff33',
									},
								],
							},
						],
					},
				],
			};
			mockMakeRequest.mockResolvedValueOnce(mockPayload);

			const result = await Etd.station(mockContext, { orig: '12TH' });

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'etd.aspx',
				'TEST_KEY',
				expect.objectContaining({
					query: expect.objectContaining({ cmd: 'etd', orig: '12TH' }),
				}),
			);
			expect(result.station).toHaveLength(1);
		});

		it('etd.station rejects empty and whitespace-only inputs before HTTP dispatch', async () => {
			await expect(Etd.station(mockContext, { orig: '' })).rejects.toThrow(
				ZodError,
			);

			await expect(Etd.station(mockContext, { orig: '   ' })).rejects.toThrow(
				ZodError,
			);

			await expect(Etd.station(mockContext, {} as any)).rejects.toThrow(
				ZodError,
			);

			expect(mockMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('Routes Endpoints', () => {
		it('routes.list fetches route list and persists entities', async () => {
			const mockPayload = {
				sched: '48',
				routes: {
					route: [
						{
							name: 'Antioch to SFIA/Millbrae',
							abbr: 'ANTC-SFIA',
							routeID: 'ROUTE 1',
							number: '1',
							hexcolor: '#ffff33',
							color: 'YELLOW',
						},
					],
				},
			};
			mockMakeRequest.mockResolvedValueOnce(mockPayload);

			const result = await Routes.list(mockContext, {});

			expect(result.routes.route).toHaveLength(1);
			expect(mockUpsertRoute).toHaveBeenCalledWith(
				'ROUTE 1',
				expect.anything(),
			);
		});

		it('routes.info fetches route detail with config', async () => {
			const mockPayload = {
				sched: '48',
				routes: {
					route: {
						name: 'Antioch to SFIA/Millbrae',
						abbr: 'ANTC-SFIA',
						routeID: 'ROUTE 1',
						number: '1',
						origin: 'ANTC',
						destination: 'MLBR',
						direction: 'south',
						color: 'YELLOW',
						hexcolor: '#ffff33',
						holidays: '0',
						numStns: '28',
						config: {
							station: ['ANTC', 'PCTR', 'PITB', 'NCON', 'CONC'],
						},
					},
				},
			};
			mockMakeRequest.mockResolvedValueOnce(mockPayload);

			const result = await Routes.info(mockContext, { route: '1' });
			expect(result.routes.route).toBeDefined();
			expect(mockUpsertRoute).toHaveBeenCalledWith(
				'ROUTE 1',
				expect.anything(),
			);
		});

		it('routes.info rejects empty and whitespace-only route parameter before HTTP dispatch', async () => {
			await expect(Routes.info(mockContext, { route: '' })).rejects.toThrow(
				ZodError,
			);

			await expect(Routes.info(mockContext, { route: '   ' })).rejects.toThrow(
				ZodError,
			);

			await expect(Routes.info(mockContext, {} as any)).rejects.toThrow(
				ZodError,
			);

			expect(mockMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('Stations Endpoints', () => {
		it('stations.list fetches station list and persists entities', async () => {
			const mockPayload = {
				stations: {
					station: [
						{
							name: '12th St. Oakland City Center',
							abbr: '12TH',
							gtfs_latitude: '37.803768',
							gtfs_longitude: '-122.271450',
							address: '1245 Broadway',
							city: 'Oakland',
							county: 'alameda',
							state: 'CA',
							zipcode: '94612',
						},
					],
				},
			};
			mockMakeRequest.mockResolvedValueOnce(mockPayload);

			const result = await Stations.list(mockContext, {});

			expect(result.stations.station).toHaveLength(1);
			expect(mockUpsertStation).toHaveBeenCalledWith('12TH', expect.anything());
		});

		it('stations.info fetches single station detail', async () => {
			const mockPayload = {
				stations: {
					station: {
						name: '12th St. Oakland City Center',
						abbr: '12TH',
						gtfs_latitude: '37.803768',
						gtfs_longitude: '-122.271450',
						address: '1245 Broadway',
						city: 'Oakland',
						county: 'alameda',
						state: 'CA',
						zipcode: '94612',
						intro: 'Station intro text',
					},
				},
			};
			mockMakeRequest.mockResolvedValueOnce(mockPayload);

			const result = await Stations.info(mockContext, { orig: '12TH' });
			expect(result.stations?.station).toBeDefined();
			expect(mockUpsertStation).toHaveBeenCalledWith('12TH', expect.anything());
		});

		it('stations.info rejects empty and whitespace-only station abbreviation before HTTP dispatch', async () => {
			await expect(Stations.info(mockContext, { orig: '' })).rejects.toThrow(
				ZodError,
			);

			await expect(Stations.info(mockContext, { orig: '   ' })).rejects.toThrow(
				ZodError,
			);

			expect(mockMakeRequest).not.toHaveBeenCalled();
		});

		it('stations.access fetches station access information', async () => {
			const mockPayload = {
				stations: {
					station: {
						name: '12th St. Oakland City Center',
						abbr: '12TH',
						parking: 'No parking available',
						lockers: 'Electronic lockers available',
					},
				},
			};
			mockMakeRequest.mockResolvedValueOnce(mockPayload);

			const result = await Stations.access(mockContext, { orig: '12TH' });
			expect(result.stations?.station).toBeDefined();
		});
	});

	describe('Schedules Endpoints', () => {
		it('schedules.departures fetches departure schedule', async () => {
			const mockPayload = {
				origin: '12TH',
				destination: 'EMBR',
				schedule: {
					date: '08/21/2026',
					time: '12:00 PM',
					trip: [
						{
							'@origin': '12TH',
							'@destination': 'EMBR',
							'@fare': '4.15',
							'@origTimeMin': '12:05 PM',
							'@destTimeMin': '12:18 PM',
							'@tripTime': '13',
							leg: [
								{
									'@order': '1',
									'@origin': '12TH',
									'@destination': 'EMBR',
									'@origTimeMin': '12:05 PM',
									'@destTimeMin': '12:18 PM',
									'@line': 'ROUTE 1',
								},
							],
						},
					],
				},
			};
			mockMakeRequest.mockResolvedValueOnce(mockPayload);

			const result = await Schedules.departures(mockContext, {
				orig: '12TH',
				dest: 'EMBR',
			});

			expect(result.origin).toBe('12TH');
			expect(result.schedule?.trip).toBeDefined();
		});

		it('schedules.departures rejects empty and whitespace-only destinations before HTTP dispatch', async () => {
			await expect(
				Schedules.departures(mockContext, { orig: '12TH', dest: '' }),
			).rejects.toThrow(ZodError);

			await expect(
				Schedules.departures(mockContext, { orig: '12TH', dest: '   ' }),
			).rejects.toThrow(ZodError);

			await expect(
				Schedules.departures(mockContext, { orig: '12TH' } as any),
			).rejects.toThrow(ZodError);

			expect(mockMakeRequest).not.toHaveBeenCalled();
		});

		it('schedules.arrivals fetches arrival schedule', async () => {
			const mockPayload = {
				origin: '12TH',
				destination: 'EMBR',
				schedule: {
					date: '08/21/2026',
					time: '12:00 PM',
					trip: [
						{
							'@origin': '12TH',
							'@destination': 'EMBR',
							'@origTimeMin': '11:45 AM',
							'@destTimeMin': '11:58 AM',
						},
					],
				},
			};
			mockMakeRequest.mockResolvedValueOnce(mockPayload);

			const result = await Schedules.arrivals(mockContext, {
				orig: '12TH',
				dest: 'EMBR',
			});

			expect(result.destination).toBe('EMBR');
		});

		it('schedules.routes fetches route timetables', async () => {
			const mockPayload = {
				route: {
					train: [
						{
							'@trainIdx': '1',
							'@trainHeadStation': 'MLBR',
							stop: [
								{
									'@station': 'ANTC',
									'@origTime': '5:00 AM',
								},
							],
						},
					],
				},
			};
			mockMakeRequest.mockResolvedValueOnce(mockPayload);

			const result = await Schedules.routes(mockContext, { route: '1' });
			expect(result.route?.train).toBeDefined();
		});

		it('schedules.special fetches holiday schedule info', async () => {
			const mockPayload = {
				holidays: {
					holiday: [
						{
							name: 'Labor Day',
							date: '09/07/2026',
							schedule: 'Sunday schedule',
						},
					],
				},
			};
			mockMakeRequest.mockResolvedValueOnce(mockPayload);

			const result = await Schedules.special(mockContext, {});
			expect(result.holidays.holiday).toBeDefined();
		});
	});

	describe('Fares Endpoints', () => {
		it('fares.calculate calculates fare between stations', async () => {
			const mockPayload = {
				origin: '12TH',
				destination: 'EMBR',
				fares: {
					fare: [
						{
							'@amount': '4.15',
							'@class': 'clipper',
							'@name': 'Clipper',
						},
						{
							'@amount': '2.05',
							'@class': 'senior',
							'@name': 'Senior / Disabled Clipper',
						},
					],
				},
			};
			mockMakeRequest.mockResolvedValueOnce(mockPayload);

			const result = await Fares.calculate(mockContext, {
				orig: '12TH',
				dest: 'EMBR',
			});

			expect(result.origin).toBe('12TH');
			expect(result.destination).toBe('EMBR');
			expect(result.fares?.fare).toHaveLength(2);
		});

		it('fares.calculate rejects empty and whitespace-only origins/destinations before HTTP dispatch', async () => {
			await expect(
				Fares.calculate(mockContext, { orig: '', dest: 'EMBR' }),
			).rejects.toThrow(ZodError);

			await expect(
				Fares.calculate(mockContext, { orig: '   ', dest: 'EMBR' }),
			).rejects.toThrow(ZodError);

			await expect(
				Fares.calculate(mockContext, { orig: '12TH', dest: '' }),
			).rejects.toThrow(ZodError);

			await expect(
				Fares.calculate(mockContext, { orig: '12TH', dest: '   ' }),
			).rejects.toThrow(ZodError);

			expect(mockMakeRequest).not.toHaveBeenCalled();
		});
	});
});
