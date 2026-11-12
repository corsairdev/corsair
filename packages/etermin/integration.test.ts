import type { CorsairEndpoint } from 'corsair/core';
import { request } from 'corsair/http';
import type { eTerminEndpoints } from './endpoints';
import type { ETerminContext } from './index';
import { etermin } from './index';
import { eTerminOperations } from './operations';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

type EndpointTree = typeof eTerminEndpoints;
type EndpointGroup = keyof EndpointTree;
type EndpointAction<G extends EndpointGroup> = keyof EndpointTree[G];

const pluginEndpoints = etermin({
	publicKey: 'public-key',
	privateKey: 'private-key',
}).endpoints;

function publicEndpoint(
	group: EndpointGroup,
	action: string,
): CorsairEndpoint<ETerminContext, unknown, unknown> {
	// The endpoint tree is heterogeneous; each selected endpoint validates this
	// erased boundary type with its operation-specific schema before transport.
	const endpoint =
		pluginEndpoints?.[group]?.[action as EndpointAction<typeof group>];
	if (!endpoint) throw new Error(`Missing endpoint ${group}.${action}`);
	return endpoint;
}
function minimalInput(operation: (typeof eTerminOperations)[number]) {
	const input = Object.fromEntries(
		operation.params
			.filter((parameter) => parameter.required)
			.map((parameter) => [
				parameter.name,
				parameter.type === 'number'
					? 1
					: parameter.type === 'boolean'
						? false
						: 'value',
			]),
	);
	if (
		operation.key === 'appointmentsList' ||
		operation.key === 'appointmentsDelete'
	)
		input.id = 'value';
	if (operation.key === 'workingTimeDatesDelete') input.id = 1;
	if (operation.key === 'workingTimesList') input.all = true;
	return input;
}

function responseFor(operation: (typeof eTerminOperations)[number]) {
	if (operation.responseKind === 'array') return [];
	if (operation.responseKind === 'object') return {};
	return undefined;
}

const context = {
	key: 'public-key',
	options: { publicKey: 'public-key', privateKey: 'private-key' },
	keys: { get_api_secret: async () => 'private-key' },
};

describe('eTermin public endpoint seams', () => {
	beforeEach(() => mockRequest.mockReset());

	it.each(
		eTerminOperations.filter(
			(operation) => operation.key !== 'appointmentSyncList',
		),
	)(
		'$group.$action forwards its documented method, path, and query',
		async (operation) => {
			const input = minimalInput(operation);
			const response = responseFor(operation);
			mockRequest.mockResolvedValue(response);

			await expect(
				publicEndpoint(operation.group as EndpointGroup, operation.action)(
					context as ETerminContext,
					input,
				),
			).resolves.toEqual(response);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://www.etermin.net' }),
				expect.objectContaining({
					method: operation.method,
					url: operation.path,
					query: input,
				}),
				expect.anything(),
			);
		},
	);

	it('rejects undocumented input before reaching the transport', async () => {
		await expect(
			publicEndpoint('timeSlots', 'list')(context as ETerminContext, {
				date: '2026-11-12',
				extra: 'nope',
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('sends the documented external appointment identifier when deleting', async () => {
		mockRequest.mockResolvedValue({});
		await publicEndpoint('appointments', 'delete')(context as ETerminContext, {
			externalid: 'calendar-event-42',
			sync: true,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'DELETE',
				url: '/api/appointment',
				query: { externalid: 'calendar-event-42', sync: true },
			}),
			expect.anything(),
		);
	});

	it('forwards independently specified multilingual service and service-group inputs', async () => {
		mockRequest.mockResolvedValue({});
		await expect(
			publicEndpoint('services', 'update')(context as ETerminContext, {
				id: 1,
				servicefr: 'Consultation',
				emailtxtfr: 'Votre rendez-vous : %SERVICETEXT%',
				pricesuffixfr: 'par séance',
				capseltextfr: 'Nombre de participants',
			}),
		).resolves.toEqual({});
		expect(mockRequest).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'PUT',
				url: '/api/service',
				query: {
					id: 1,
					servicefr: 'Consultation',
					emailtxtfr: 'Votre rendez-vous : %SERVICETEXT%',
					pricesuffixfr: 'par séance',
					capseltextfr: 'Nombre de participants',
				},
			}),
			expect.anything(),
		);
		await expect(
			publicEndpoint('serviceGroups', 'update')(context as ETerminContext, {
				servicegroupid: 1,
				displayindex: 1,
				servicegroupfr: 'Consultations',
				additionaltextfr: 'Choisissez une consultation',
				errormsgfr: 'Valeur invalide',
			}),
		).resolves.toEqual({});
	});

	it('uses a fixed official timeslot request and preserves its representative response', async () => {
		const response = [
			{
				startdatetime: '2026-12-01 09:00:00',
				enddatetime: '2026-12-01 09:30:00',
				calendarid: 123,
			},
		];
		mockRequest.mockResolvedValue(response);

		await expect(
			publicEndpoint('timeSlots', 'list')(context as ETerminContext, {
				date: '2026-12-01',
				serviceid: '456',
				calendarid: '123',
			}),
		).resolves.toEqual(response);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/api/timeslots',
				query: {
					date: '2026-12-01',
					serviceid: '456',
					calendarid: '123',
				},
			}),
			expect.anything(),
		);
	});

	it('allows all-calendar working-time requests without a calendar ID', async () => {
		mockRequest.mockResolvedValue([]);
		await expect(
			publicEndpoint('workingTimes', 'list')(context as ETerminContext, {
				all: true,
			}),
		).resolves.toEqual([]);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/api/workingtimes',
				query: { all: true },
			}),
			expect.anything(),
		);
	});
});
