import { logEventFromContext } from 'corsair/core';
import type { AppointoContext } from '.';
import * as client from './client';
import { Appointments, Bookings, Products, Subscriptions } from './endpoints';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeAppointoRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

describe('Appointo endpoints routing & event logging', () => {
	const mockMakeAppointoRequest =
		client.makeAppointoRequest as jest.MockedFunction<
			typeof client.makeAppointoRequest
		>;
	const mockLogEventFromContext = logEventFromContext as jest.MockedFunction<
		typeof logEventFromContext
	>;

	const ctx = {
		key: 'test_appointo_key',
	} as unknown as AppointoContext;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Products', () => {
		it('products.list issues GET /products with query params', async () => {
			const mockProducts = [
				{
					id: 142,
					activate: true,
					product_uuid: 'gid://shopify/Product/8005520294172',
					shop_id: 135,
					created_at: '2022-11-11T08:18:08.099Z',
					updated_at: '2023-07-18T16:23:45.242Z',
					product_name: 'Short',
					show_widget: true,
					appointment_type: 'open',
					vendor_name: 'cosmere-items-dev6',
					include_variant_booking: true,
					book_without_pay: false,
					image_url: null,
					variants_count: 1,
					appointments: [],
				},
			];
			mockMakeAppointoRequest.mockResolvedValueOnce(mockProducts);
			const result = await Products.list(ctx, {
				limit: 10,
				search_term: 'test',
				offset: 5,
			});
			expect(result).toEqual(mockProducts);
			expect(mockMakeAppointoRequest).toHaveBeenCalledWith(
				'products',
				'test_appointo_key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						limit: 10,
						search_term: 'test',
						offset: 5,
					}),
				}),
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'appointo.products.list',
				expect.objectContaining({ limit: 10, search_term: 'test', offset: 5 }),
				'completed',
			);
		});

		it('products.list works with no optional params', async () => {
			mockMakeAppointoRequest.mockResolvedValueOnce([]);
			const result = await Products.list(ctx, {});
			expect(result).toEqual([]);
			expect(mockMakeAppointoRequest).toHaveBeenCalledWith(
				'products',
				'test_appointo_key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({}),
				}),
			);
		});
	});

	describe('Appointments', () => {
		it('appointments.list issues GET /appointments with query params', async () => {
			const mockAppointments = [
				{
					id: 302,
					activate: true,
					product_uuid: 'gid://shopify/Product/8005520294172',
					duration_uuid: 'gid://shopify/ProductVariant/43907273883932',
					shop_id: 135,
					product_detail_id: 142,
					name: 'Short - Default Title',
					is_combo_service: false,
					price: '100.0',
					currency: 'USD',
					description: null,
					archived: false,
				},
			];
			mockMakeAppointoRequest.mockResolvedValueOnce(mockAppointments);
			const result = await Appointments.list(ctx, {
				appointment_id: 302,
				product_id: 142,
				limit: 20,
				offset: 10,
				search_term: 'short',
			});
			expect(result).toEqual(mockAppointments);
			expect(mockMakeAppointoRequest).toHaveBeenCalledWith(
				'appointments',
				'test_appointo_key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						appointment_id: 302,
						product_id: 142,
						limit: 20,
						offset: 10,
						search_term: 'short',
					}),
				}),
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'appointo.appointments.list',
				expect.any(Object),
				'completed',
			);
		});

		it('appointments.getAvailability issues GET /appointments/:id/calendar_availability', async () => {
			const mockAvailability = [
				{
					id: 6028,
					weekday: 'monday',
					weekday_index: 1,
					slots: [{ start_time: '09:00AM', end_time: '10:00PM' }],
					shop_id: 135,
					appointment_id: 304,
					day_available: true,
					max_capacity: null,
				},
			];
			mockMakeAppointoRequest.mockResolvedValueOnce(mockAvailability);
			const result = await Appointments.getAvailability(ctx, {
				appointment_id: 304,
				start_date: '2024-01-01',
				end_date: '2024-01-31',
				impersonated_tms: [123, 456],
			});
			expect(result).toEqual(mockAvailability);
			expect(mockMakeAppointoRequest).toHaveBeenCalledWith(
				'appointments/304/calendar_availability',
				'test_appointo_key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						start_date: '2024-01-01',
						end_date: '2024-01-31',
						impersonated_tms: [123, 456],
					}),
				}),
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'appointo.appointments.getAvailability',
				expect.any(Object),
				'completed',
			);
		});

		it('appointments.getAvailability works with only required params', async () => {
			mockMakeAppointoRequest.mockResolvedValueOnce([]);
			const result = await Appointments.getAvailability(ctx, {
				appointment_id: 304,
				start_date: '2024-01-01',
			});
			expect(result).toEqual([]);
			expect(mockMakeAppointoRequest).toHaveBeenCalledWith(
				'appointments/304/calendar_availability',
				'test_appointo_key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						start_date: '2024-01-01',
					}),
				}),
			);
		});

		it('appointments.upsertConfig issues PUT /appointments/:id with full config body', async () => {
			const mockResponse = [
				{
					id: 304,
					activate: true,
					product_uuid: 'gid://shopify/Product/8005520294172',
					duration_uuid: 'gid://shopify/ProductVariant/43907273883932',
					shop_id: 135,
					product_detail_id: 142,
					name: 'Updated Appointment',
					is_combo_service: false,
					price: '100.0',
					currency: 'USD',
					description: null,
					archived: false,
				},
			];
			mockMakeAppointoRequest.mockResolvedValueOnce(mockResponse);
			const result = await Appointments.upsertConfig(ctx, {
				appointment_id: 304,
				config: {
					timezone: 'America/New_York',
					duration: '30',
					minimum_notice: '240',
					max_capacity: '10',
				},
				availabilities: [
					{
						weekday: 'monday',
						weekday_index: 1,
						slots: [{ start_time: '09:00AM', end_time: '10:00PM' }],
						shop_id: 135,
						appointment_id: 304,
						day_available: true,
						max_capacity: null,
					},
				],
				override: [
					{
						day: '2024-03-28',
						slots: [{ start_time: '09:00AM', end_time: '05:00PM' }],
						shop_id: 135,
						appointment_id: 304,
						day_available: true,
					},
				],
			});
			expect(result).toEqual(mockResponse);
			expect(mockMakeAppointoRequest).toHaveBeenCalledWith(
				'appointments/304',
				'test_appointo_key',
				expect.objectContaining({
					method: 'PUT',
					body: expect.objectContaining({
						appointment_id: 304,
						config: expect.objectContaining({
							timezone: 'America/New_York',
							duration: '30',
						}),
						availabilities: expect.arrayContaining([
							expect.objectContaining({
								weekday: 'monday',
								slots: expect.arrayContaining([
									expect.objectContaining({
										start_time: '09:00AM',
										end_time: '10:00PM',
									}),
								]),
							}),
						]),
						override: expect.arrayContaining([
							expect.objectContaining({
								day: '2024-03-28',
							}),
						]),
					}),
				}),
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'appointo.appointments.upsertConfig',
				expect.any(Object),
				'completed',
			);
		});
	});

	describe('Bookings', () => {
		it('bookings.list issues GET /bookings with query params', async () => {
			const mockBookings = [
				{
					id: 969,
					selected_time: '2023-07-20T00:00:00.000Z',
					timestring: '2023-07-20',
					shop_id: 135,
					appointment_id: 299,
					created_at: '2023-07-18T16:33:17.565Z',
					updated_at: '2023-07-18T16:33:18.236Z',
					customers_count: 1,
					duration: 30,
					product_name: 'T-shirt',
					variant_name: 'T-shirt - s',
					order_uuid: '-',
					price: '',
					order_name: '-',
					currency: '',
					meeting_detail: '',
					note: '',
					google_meta: {},
					google_event_id: 'o0sc5qt4dg70u9sghg4hmfgul8',
					location_value: null,
					location_type: null,
					location_meta: null,
					quantity: 1,
					team_member_id: null,
					scenario: 'multi_day',
					day_duration: 1,
					end_date: '2023-07-20',
					start_date: '2023-07-20',
					group_id: null,
					start_buffer_time: 0,
					end_buffer_time: 0,
					category: null,
					archived: false,
					notes_count: 0,
					customers: [],
					archived_customers: [],
					appointment: {
						id: 299,
						activate: true,
						product_uuid: 'gid://shopify/Product/7971637428508',
						duration_uuid: 'gid://shopify/ProductVariant/43666758828316',
						shop_id: 135,
						product_detail_id: 141,
						name: 'T-shirt - s',
						is_combo_service: false,
						price: '100.0',
						currency: 'USD',
						description: null,
						archived: false,
					},
				},
			];
			mockMakeAppointoRequest.mockResolvedValueOnce(mockBookings);
			const result = await Bookings.list(ctx, {
				limit: 10,
				offset: 5,
				status: 'upcoming',
				booking_id: 969,
				search_term: 'john',
			});
			expect(result).toEqual(mockBookings);
			expect(mockMakeAppointoRequest).toHaveBeenCalledWith(
				'bookings',
				'test_appointo_key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						limit: 10,
						offset: 5,
						status: 'upcoming',
						booking_id: 969,
						search_term: 'john',
					}),
				}),
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'appointo.bookings.list',
				expect.any(Object),
				'completed',
			);
		});

		it('bookings.create issues POST /bookings with required fields and returns array', async () => {
			const mockBookingResponse = [
				{
					id: 969,
					selected_time: '2023-07-20T00:00:00.000Z',
					timestring: '2023-07-20',
					shop_id: 135,
					appointment_id: 299,
					created_at: '2023-07-18T16:33:17.565Z',
					updated_at: '2023-07-18T16:33:18.236Z',
					customers_count: 1,
					duration: 30,
					product_name: 'T-shirt',
					variant_name: 'T-shirt - s',
					order_uuid: '-',
					price: '',
					order_name: '-',
					currency: '',
					meeting_detail: '',
					note: '',
					google_meta: {},
					google_event_id: 'o0sc5qt4dg70u9sghg4hmfgul8',
					location_value: null,
					location_type: null,
					location_meta: null,
					quantity: 1,
					team_member_id: null,
					scenario: 'multi_day',
					day_duration: 1,
					end_date: '2023-07-20',
					start_date: '2023-07-20',
					group_id: null,
					start_buffer_time: 0,
					end_buffer_time: 0,
					category: null,
					archived: false,
					notes_count: 0,
					customers: [
						{
							id: 1095,
							email: 'test@example.com',
							payload: { phone: '+1234567890' },
							name: 'John Doe',
							shop_id: 135,
							appointment_id: 299,
							booking_id: 969,
							created_at: '2023-07-18T16:33:17.593Z',
							updated_at: '2023-07-18T16:33:17.593Z',
							customer_uuid: '6943848005916',
							reschedule_uuid: null,
							cancel_uuid: null,
							order_name: '-',
							order_uuid: null,
							shipping_address: {},
							override: false,
							signpanda_cust_uuid: null,
							parent_customer_id: null,
							is_active_sub: false,
							sub_interval: null,
							sub_booking_count: null,
							sub_booking_num: null,
							sub_recurring_type: null,
							customer_type: null,
							customer_timezone: null,
							archived: false,
							subscription_contract_id: null,
							selling_plan_id: null,
							checkin: false,
							checkin_qr_code: null,
							image_data: null,
						},
					],
					archived_customers: [],
					appointment: {
						id: 299,
						activate: true,
						product_uuid: 'gid://shopify/Product/7971637428508',
						duration_uuid: 'gid://shopify/ProductVariant/43666758828316',
						shop_id: 135,
						product_detail_id: 141,
						name: 'T-shirt - s',
						is_combo_service: false,
						price: '100.0',
						currency: 'USD',
						description: null,
						archived: false,
					},
				},
			];
			mockMakeAppointoRequest.mockResolvedValueOnce(mockBookingResponse);
			const result = await Bookings.create(ctx, {
				appointment_id: 299,
				timestring: '2023-07-20T10:00:00Z',
				email: 'test@example.com',
				name: 'John Doe',
				quantity: 2,
				phone: '+1234567890',
			});
			expect(result).toEqual(mockBookingResponse);
			expect(Array.isArray(result)).toBe(true);
			expect(mockMakeAppointoRequest).toHaveBeenCalledWith(
				'bookings',
				'test_appointo_key',
				expect.objectContaining({
					method: 'POST',
					body: expect.objectContaining({
						appointment_id: 299,
						timestring: '2023-07-20T10:00:00Z',
						email: 'test@example.com',
						name: 'John Doe',
						quantity: 2,
						phone: '+1234567890',
					}),
				}),
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'appointo.bookings.create',
				expect.any(Object),
				'completed',
			);
		});

		it('bookings.create works with only required fields', async () => {
			const mockBookingResponse = [
				{
					id: 970,
					appointment_id: 299,
					timestring: '2023-07-20T10:00:00Z',
					email: 'test@example.com',
					name: 'Jane Doe',
				},
			];
			mockMakeAppointoRequest.mockResolvedValueOnce(mockBookingResponse);
			const result = await Bookings.create(ctx, {
				appointment_id: 299,
				timestring: '2023-07-20T10:00:00Z',
				email: 'test@example.com',
				name: 'Jane Doe',
			});
			expect(result).toEqual(mockBookingResponse);
			expect(Array.isArray(result)).toBe(true);
			expect(mockMakeAppointoRequest).toHaveBeenCalledWith(
				'bookings',
				'test_appointo_key',
				expect.objectContaining({
					method: 'POST',
					body: expect.objectContaining({
						appointment_id: 299,
						timestring: '2023-07-20T10:00:00Z',
						email: 'test@example.com',
						name: 'Jane Doe',
					}),
				}),
			);
		});

		it('bookings.reschedule issues PUT /bookings/reschedule', async () => {
			const mockResponse = {
				response: {
					status: 'ok',
					booking: {
						id: 969,
						booking_id: 969,
						timestring: '2023-07-21T10:00:00Z',
					},
				},
			};
			mockMakeAppointoRequest.mockResolvedValueOnce(mockResponse);
			const result = await Bookings.reschedule(ctx, {
				booking_id: 969,
				timestring: '2023-07-21T10:00:00Z',
				customer_ids: [1095],
				override: true,
			});
			expect(result).toEqual(mockResponse);
			expect(mockMakeAppointoRequest).toHaveBeenCalledWith(
				'bookings/reschedule',
				'test_appointo_key',
				expect.objectContaining({
					method: 'PUT',
					body: expect.objectContaining({
						booking_id: 969,
						timestring: '2023-07-21T10:00:00Z',
						customer_ids: [1095],
						override: true,
					}),
				}),
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'appointo.bookings.reschedule',
				expect.any(Object),
				'completed',
			);
		});

		it('bookings.cancel issues PUT /bookings/cancel', async () => {
			const mockResponse = {
				response: {
					status: 'ok',
					booking: {
						id: 969,
						booking_id: 969,
						status: 'cancelled',
					},
				},
			};
			mockMakeAppointoRequest.mockResolvedValueOnce(mockResponse);
			const result = await Bookings.cancel(ctx, {
				booking_id: 969,
				customer_ids: [1095],
			});
			expect(result).toEqual(mockResponse);
			expect(mockMakeAppointoRequest).toHaveBeenCalledWith(
				'bookings/cancel',
				'test_appointo_key',
				expect.objectContaining({
					method: 'PUT',
					body: expect.objectContaining({
						booking_id: 969,
						customer_ids: [1095],
					}),
				}),
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'appointo.bookings.cancel',
				expect.any(Object),
				'completed',
			);
		});

		it('bookings.update issues PUT /bookings/:id with buffer fields', async () => {
			const mockResponse = {
				response: {
					status: 'ok',
					booking: {
						id: 969,
						booking_id: 969,
						start_buffer_time: 15,
						end_buffer_time: 15,
					},
				},
			};
			mockMakeAppointoRequest.mockResolvedValueOnce(mockResponse);
			const result = await Bookings.update(ctx, {
				booking_id: 969,
				start_buffer_time: 15,
				end_buffer_time: 15,
			});
			expect(result).toEqual(mockResponse);
			expect(mockMakeAppointoRequest).toHaveBeenCalledWith(
				'bookings/969',
				'test_appointo_key',
				expect.objectContaining({
					method: 'PUT',
					body: expect.objectContaining({
						booking_id: 969,
						start_buffer_time: 15,
						end_buffer_time: 15,
					}),
				}),
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'appointo.bookings.update',
				expect.objectContaining({
					booking_id: 969,
					start_buffer_time: 15,
					end_buffer_time: 15,
				}),
				'completed',
			);
		});
	});

	describe('Subscriptions', () => {
		it('subscriptions.list issues GET /appointment_subscriptions', async () => {
			const mockSubscriptions = [
				{
					id: 123,
					// subscription fields would go here
				},
			];
			mockMakeAppointoRequest.mockResolvedValueOnce(mockSubscriptions);
			const result = await Subscriptions.list(ctx, { search_term: 'test' });
			expect(result).toEqual(mockSubscriptions);
			expect(mockMakeAppointoRequest).toHaveBeenCalledWith(
				'appointment_subscriptions',
				'test_appointo_key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						search_term: 'test',
					}),
				}),
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'appointo.subscriptions.list',
				expect.objectContaining({ search_term: 'test' }),
				'completed',
			);
		});

		it('subscriptions.list works with no optional params', async () => {
			mockMakeAppointoRequest.mockResolvedValueOnce([]);
			const result = await Subscriptions.list(ctx, {});
			expect(result).toEqual([]);
			expect(mockMakeAppointoRequest).toHaveBeenCalledWith(
				'appointment_subscriptions',
				'test_appointo_key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({}),
				}),
			);
		});
	});
});
