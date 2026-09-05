import {
	AppointoEndpointInputSchemas,
	AppointoEndpointOutputSchemas,
} from './endpoints/types';

describe('Appointo schemas', () => {
	describe('Input schemas', () => {
		it('productsList accepts valid input', () => {
			const input = { limit: 10, search_term: 'test', offset: 5 };
			expect(() =>
				AppointoEndpointInputSchemas.productsList.parse(input),
			).not.toThrow();
		});

		it('productsList rejects limit > 100', () => {
			const input = { limit: 101 };
			expect(() =>
				AppointoEndpointInputSchemas.productsList.parse(input),
			).toThrow();
		});

		it('productsList rejects negative limit', () => {
			const input = { limit: -1 };
			expect(() =>
				AppointoEndpointInputSchemas.productsList.parse(input),
			).toThrow();
		});

		it('productsList rejects negative offset', () => {
			const input = { offset: -1 };
			expect(() =>
				AppointoEndpointInputSchemas.productsList.parse(input),
			).toThrow();
		});

		it('appointmentsList accepts valid input with integer IDs', () => {
			const input = {
				appointment_id: 302,
				product_id: 142,
				limit: 20,
				offset: 10,
				search_term: 'short',
			};
			expect(() =>
				AppointoEndpointInputSchemas.appointmentsList.parse(input),
			).not.toThrow();
		});

		it('appointmentsGetAvailability requires appointment_id (int) and start_date', () => {
			const input = { appointment_id: 304, start_date: '2024-01-01' };
			expect(() =>
				AppointoEndpointInputSchemas.appointmentsGetAvailability.parse(input),
			).not.toThrow();
		});

		it('appointmentsGetAvailability accepts impersonated_tms as integer array', () => {
			const input = {
				appointment_id: 304,
				start_date: '2024-01-01',
				impersonated_tms: [123, 456],
			};
			expect(() =>
				AppointoEndpointInputSchemas.appointmentsGetAvailability.parse(input),
			).not.toThrow();
		});

		it('appointmentsGetAvailability rejects missing appointment_id', () => {
			const input = { start_date: '2024-01-01' };
			expect(() =>
				AppointoEndpointInputSchemas.appointmentsGetAvailability.parse(input),
			).toThrow();
		});

		it('appointmentsGetAvailability rejects missing start_date', () => {
			const input = { appointment_id: 304 };
			expect(() =>
				AppointoEndpointInputSchemas.appointmentsGetAvailability.parse(input),
			).toThrow();
		});

		it('appointmentsUpsertConfig requires appointment_id and accepts config body', () => {
			const input = {
				appointment_id: 304,
				config: { timezone: 'America/New_York', duration: '30' },
				availabilities: [
					{
						weekday: 'monday',
						slots: [{ start_time: '09:00AM', end_time: '10:00PM' }],
					},
				],
				override: [
					{
						day: '2024-03-28',
						slots: [{ start_time: '09:00AM', end_time: '05:00PM' }],
					},
				],
			};
			expect(() =>
				AppointoEndpointInputSchemas.appointmentsUpsertConfig.parse(input),
			).not.toThrow();
		});

		it('bookingsList accepts valid input with integer IDs', () => {
			const input = {
				limit: 10,
				offset: 5,
				status: 'upcoming',
				booking_id: 969,
				search_term: 'john',
			};
			expect(() =>
				AppointoEndpointInputSchemas.bookingsList.parse(input),
			).not.toThrow();
		});

		it('bookingsList rejects invalid status', () => {
			const input = { status: 'invalid' };
			expect(() =>
				AppointoEndpointInputSchemas.bookingsList.parse(input),
			).toThrow();
		});

		it('bookingsCreate requires appointment_id (int), timestring, email, name', () => {
			const input = {
				appointment_id: 299,
				timestring: '2024-01-15T10:00:00Z',
				email: 'test@example.com',
				name: 'John Doe',
			};
			expect(() =>
				AppointoEndpointInputSchemas.bookingsCreate.parse(input),
			).not.toThrow();
		});

		it('bookingsCreate rejects invalid email', () => {
			const input = {
				appointment_id: 299,
				timestring: '2024-01-15T10:00:00Z',
				email: 'invalid-email',
				name: 'John Doe',
			};
			expect(() =>
				AppointoEndpointInputSchemas.bookingsCreate.parse(input),
			).toThrow();
		});

		it('bookingsCreate rejects missing required fields', () => {
			const input = { appointment_id: 299 };
			expect(() =>
				AppointoEndpointInputSchemas.bookingsCreate.parse(input),
			).toThrow();
		});

		it('bookingsReschedule requires booking_id (int) and timestring', () => {
			const input = { booking_id: 969, timestring: '2024-01-16T10:00:00Z' };
			expect(() =>
				AppointoEndpointInputSchemas.bookingsReschedule.parse(input),
			).not.toThrow();
		});

		it('bookingsReschedule accepts customer_ids as integer array', () => {
			const input = {
				booking_id: 969,
				timestring: '2024-01-16T10:00:00Z',
				customer_ids: [1095, 1096],
			};
			expect(() =>
				AppointoEndpointInputSchemas.bookingsReschedule.parse(input),
			).not.toThrow();
		});

		it('bookingsCancel requires booking_id (int)', () => {
			const input = { booking_id: 969 };
			expect(() =>
				AppointoEndpointInputSchemas.bookingsCancel.parse(input),
			).not.toThrow();
		});

		it('bookingsCancel accepts customer_ids as integer array', () => {
			const input = { booking_id: 969, customer_ids: [1095] };
			expect(() =>
				AppointoEndpointInputSchemas.bookingsCancel.parse(input),
			).not.toThrow();
		});

		it('bookingsUpdate requires booking_id (int) and accepts buffer fields', () => {
			const input = {
				booking_id: 969,
				start_buffer_time: 15,
				end_buffer_time: 15,
			};
			expect(() =>
				AppointoEndpointInputSchemas.bookingsUpdate.parse(input),
			).not.toThrow();
		});

		it('bookingsUpdate requires positive buffer times', () => {
			const input = { booking_id: 969, start_buffer_time: -1 };
			expect(() =>
				AppointoEndpointInputSchemas.bookingsUpdate.parse(input),
			).toThrow();
		});

		it('subscriptionsList accepts valid input', () => {
			const input = { search_term: 'test' };
			expect(() =>
				AppointoEndpointInputSchemas.subscriptionsList.parse(input),
			).not.toThrow();
		});
	});

	describe('Output schemas', () => {
		it('productsList accepts array response (not wrapped)', () => {
			const response = [
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
			expect(() =>
				AppointoEndpointOutputSchemas.productsList.parse(response),
			).not.toThrow();
		});

		it('appointmentsList accepts array response', () => {
			const response = [
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
			expect(() =>
				AppointoEndpointOutputSchemas.appointmentsList.parse(response),
			).not.toThrow();
		});

		it('appointmentsGetAvailability accepts array response', () => {
			const response = [
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
			expect(() =>
				AppointoEndpointOutputSchemas.appointmentsGetAvailability.parse(
					response,
				),
			).not.toThrow();
		});

		it('appointmentsUpsertConfig accepts array response', () => {
			const response = [
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
			expect(() =>
				AppointoEndpointOutputSchemas.appointmentsUpsertConfig.parse(response),
			).not.toThrow();
		});

		it('bookingsList accepts array response', () => {
			const response = [
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
			expect(() =>
				AppointoEndpointOutputSchemas.bookingsList.parse(response),
			).not.toThrow();
		});

		it('bookingsCreate accepts array response', () => {
			const response = [
				{
					id: 969,
					appointment_id: 299,
					email: 'test@example.com',
					name: 'John Doe',
				},
			];
			expect(() =>
				AppointoEndpointOutputSchemas.bookingsCreate.parse(response),
			).not.toThrow();
		});

		it('bookingsReschedule accepts mutation response envelope', () => {
			const response = {
				response: {
					status: 'ok',
					booking: {
						id: 969,
						booking_id: 969,
						timestring: '2024-01-16T10:00:00Z',
					},
				},
			};
			expect(() =>
				AppointoEndpointOutputSchemas.bookingsReschedule.parse(response),
			).not.toThrow();
		});

		it('bookingsCancel accepts mutation response envelope', () => {
			const response = {
				response: {
					status: 'ok',
					booking: {
						id: 969,
						booking_id: 969,
						status: 'cancelled',
					},
				},
			};
			expect(() =>
				AppointoEndpointOutputSchemas.bookingsCancel.parse(response),
			).not.toThrow();
		});

		it('bookingsUpdate accepts mutation response envelope', () => {
			const response = {
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
			expect(() =>
				AppointoEndpointOutputSchemas.bookingsUpdate.parse(response),
			).not.toThrow();
		});

		it('subscriptionsList accepts array response', () => {
			const response = [
				{
					id: 123,
				},
			];
			expect(() =>
				AppointoEndpointOutputSchemas.subscriptionsList.parse(response),
			).not.toThrow();
		});
	});
});
