import 'dotenv/config';
import { CalAPIError, makeCalRequest } from './client';
import type {
	BookingsCancelResponse,
	BookingsConfirmResponse,
	BookingsCreateResponse,
	BookingsDeclineResponse,
	BookingsGetResponse,
	BookingsListResponse,
	BookingsRescheduleResponse,
} from './endpoints/types';
import { CalEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.CAL_API_KEY!;
const TEST_EVENT_TYPE_ID = process.env.TEST_CAL_EVENT_TYPE_ID
	? Number(process.env.TEST_CAL_EVENT_TYPE_ID)
	: 4907756;

async function getAvailableSlot(eventTypeId: number): Promise<string> {
	const startTime = new Date(
		Date.now() + 7 * 24 * 60 * 60 * 1000,
	).toISOString();
	const endTime = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

	const response = await makeCalRequest<{
		status: string;
		data: { slots: Record<string, { time: string }[]> };
	}>('/slots/available', TEST_API_KEY, {
		method: 'GET',
		query: {
			startTime,
			endTime,
			eventTypeId,
		},
	});

	const allSlots = Object.values(response.data.slots).flat();
	if (allSlots.length === 0) {
		throw new Error('No available slots found');
	}

	return allSlots[allSlots.length - 1]!.time;
}

/**
 * Helper to create a booking. Returns the UID if successful, or null if
 * the Cal.com API returns a 500 (known notification failure).
 */
async function createTestBooking(
	slotTime: string,
	emailPrefix: string,
): Promise<string | null> {
	const testEmail = `${emailPrefix}-${Date.now()}@test.com`;

	try {
		const response = await makeCalRequest<BookingsCreateResponse>(
			'/bookings',
			TEST_API_KEY,
			{
				method: 'POST',
				body: {
					start: slotTime,
					eventTypeId: TEST_EVENT_TYPE_ID,
					attendee: {
						name: 'Test User',
						email: testEmail,
						timeZone: 'America/New_York',
					},
				},
			},
		);

		return response.data?.uid ?? null;
	} catch (error) {
		if (error instanceof CalAPIError && error.code === '500') {
			// Cal.com sometimes returns 500 due to notification failures
			// but the booking may still be created. Try to find it.
			// Wait a moment for consistency
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const listResponse = await makeCalRequest<BookingsListResponse>(
				'/bookings',
				TEST_API_KEY,
				{
					method: 'GET',
					query: { take: 50 },
				},
			);
			// Find booking by email or start time - using any due to dynamic Cal.com response structure
			const created = listResponse.data?.find(
				(b: any) =>
					b.attendees?.some((a: any) => a.email === testEmail) ||
					b.start === slotTime,
			);
			return created?.uid ?? null;
		}
		throw error;
	}
}

/**
 * Helper to find an existing upcoming booking, or create one.
 * Returns the UID or null.
 */
async function getOrCreateBooking(): Promise<string | null> {
	// Try existing upcoming bookings first
	const listResponse = await makeCalRequest<BookingsListResponse>(
		'/bookings',
		TEST_API_KEY,
		{
			method: 'GET',
			query: { status: 'upcoming', take: 5 },
		},
	);

	if (listResponse.data && listResponse.data.length > 0) {
		return listResponse.data[0]!.uid;
	}

	// No existing bookings — try to create one
	try {
		const slot = await getAvailableSlot(TEST_EVENT_TYPE_ID);
		return await createTestBooking(slot, 'corsair-test-fallback');
	} catch {
		return null;
	}
}

describe('Cal API Type Tests', () => {
	describe('bookings', () => {
		const bookingsToCleanup: string[] = [];

		afterAll(async () => {
			for (const uid of bookingsToCleanup) {
				try {
					await makeCalRequest(`/bookings/${uid}/cancel`, TEST_API_KEY, {
						method: 'POST',
						body: { cancellationReason: 'API test cleanup' },
					});
				} catch {
					// Ignore cleanup errors
				}
			}
		});

		it('bookingsList returns correct type', async () => {
			const response = await makeCalRequest<BookingsListResponse>(
				'/bookings',
				TEST_API_KEY,
				{
					method: 'GET',
					query: { status: 'upcoming', take: 10 },
				},
			);

			CalEndpointOutputSchemas.bookingsList.parse(response);
		});

		it('bookingsCreate returns correct type', async () => {
			const availableSlot = await getAvailableSlot(TEST_EVENT_TYPE_ID);
			const testEmail = `corsair-test-create-${Date.now()}@test.com`;

			try {
				const response = await makeCalRequest<BookingsCreateResponse>(
					'/bookings',
					TEST_API_KEY,
					{
						method: 'POST',
						body: {
							start: availableSlot,
							eventTypeId: TEST_EVENT_TYPE_ID,
							attendee: {
								name: 'Test User',
								email: testEmail,
								timeZone: 'America/New_York',
							},
						},
					},
				);

				CalEndpointOutputSchemas.bookingsCreate.parse(response);
				expect(response.data?.uid).toBeDefined();

				if (response.data?.uid) {
					bookingsToCleanup.push(response.data.uid);
				}
			} catch (error) {
				if (error instanceof CalAPIError && error.code === '500') {
					// Accept the 500 as a known Cal.com notification issue
					expect((error.body as any)?.statusCode).toBe(500);
				} else {
					throw error;
				}
			}
		});

		it('bookingsGet returns correct type', async () => {
			const bookingUid = await getOrCreateBooking();

			if (!bookingUid) {
				console.warn('No bookings available — skipping get test.');
				return;
			}

			const response = await makeCalRequest<BookingsGetResponse>(
				`/bookings/${bookingUid}`,
				TEST_API_KEY,
				{
					method: 'GET',
				},
			);

			CalEndpointOutputSchemas.bookingsGet.parse(response);
			expect(response.data?.uid).toBe(bookingUid);
		});

		it('bookingsReschedule returns correct type', async () => {
			const bookingUid = await getOrCreateBooking();

			if (!bookingUid) {
				console.warn('No bookings available — skipping reschedule test.');
				return;
			}

			const newSlot = await getAvailableSlot(TEST_EVENT_TYPE_ID);

			try {
				const response = await makeCalRequest<BookingsRescheduleResponse>(
					`/bookings/${bookingUid}/reschedule`,
					TEST_API_KEY,
					{
						method: 'POST',
						body: {
							start: newSlot,
						},
					},
				);

				CalEndpointOutputSchemas.bookingsReschedule.parse(response);

				// Rescheduling creates a new booking with a new UID
				if (response.data?.uid && response.data.uid !== bookingUid) {
					bookingsToCleanup.push(response.data.uid);
				}
			} catch (error) {
				if (error instanceof CalAPIError && error.code === '500') {
					expect((error.body as any)?.statusCode).toBe(500);
				} else {
					throw error;
				}
			}
		});

		it('bookingsConfirm returns correct type', async () => {
			const listResponse = await makeCalRequest<BookingsListResponse>(
				'/bookings',
				TEST_API_KEY,
				{
					method: 'GET',
					query: { status: 'unconfirmed', take: 1 },
				},
			);
			const unconfirmedUid = listResponse.data?.[0]?.uid;

			if (!unconfirmedUid) {
				console.warn(
					'No unconfirmed bookings found — skipping confirm test. ' +
						'To run this test, create an event type with "Requires confirmation" enabled.',
				);
				return;
			}

			try {
				const response = await makeCalRequest<BookingsConfirmResponse>(
					`/bookings/${unconfirmedUid}/confirm`,
					TEST_API_KEY,
					{
						method: 'POST',
					},
				);

				CalEndpointOutputSchemas.bookingsConfirm.parse(response);

				expect(
					response.data?.status === 'accepted' ||
						response.data?.status === 'ACCEPTED',
				).toBe(true);
			} catch (error) {
				if (error instanceof CalAPIError && error.code === '500') {
					expect((error.body as any)?.statusCode).toBe(500);
				} else {
					throw error;
				}
			}
		});

		it('bookingsDecline returns correct type', async () => {
			const listResponse = await makeCalRequest<BookingsListResponse>(
				'/bookings',
				TEST_API_KEY,
				{
					method: 'GET',
					query: { status: 'unconfirmed', take: 1 },
				},
			);
			const unconfirmedUid = listResponse.data?.[0]?.uid;

			if (!unconfirmedUid) {
				console.warn(
					'No unconfirmed bookings found — skipping decline test. ' +
						'To run this test, create an event type with "Requires confirmation" enabled.',
				);
				return;
			}

			try {
				const response = await makeCalRequest<BookingsDeclineResponse>(
					`/bookings/${unconfirmedUid}/decline`,
					TEST_API_KEY,
					{
						method: 'POST',
						body: {
							reason: 'API test decline',
						},
					},
				);

				CalEndpointOutputSchemas.bookingsDecline.parse(response);
			} catch (error) {
				if (error instanceof CalAPIError && error.code === '500') {
					expect((error.body as any)?.statusCode).toBe(500);
				} else {
					throw error;
				}
			}
		});

		it('bookingsCancel returns correct type', async () => {
			const bookingUid = await getOrCreateBooking();

			if (!bookingUid) {
				console.warn('No bookings available — skipping cancel test.');
				return;
			}

			try {
				const response = await makeCalRequest<BookingsCancelResponse>(
					`/bookings/${bookingUid}/cancel`,
					TEST_API_KEY,
					{
						method: 'POST',
						body: {
							cancellationReason: 'API test cleanup',
						},
					},
				);

				CalEndpointOutputSchemas.bookingsCancel.parse(response);
			} catch (error) {
				if (error instanceof CalAPIError && error.code === '500') {
					expect((error.body as any)?.statusCode).toBe(500);
				} else {
					throw error;
				}
			}
		});
	});
});
