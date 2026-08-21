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
	});
});
