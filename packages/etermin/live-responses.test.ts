import { makeETerminSyncRequest, parseETerminXmlResponse } from './client';
import { ETerminEndpointInputSchemas } from './endpoints/types';

// Replies and refusals seen on the 11-16 live run against an eTermin trial.

describe('eTermin XML write replies', () => {
	it('turns a create reply into { id, status, statusmsg }', () => {
		expect(
			parseETerminXmlResponse(
				'<response><id>213522</id><status>200</status><statusmsg>Created successfully!</statusmsg></response>',
			),
		).toEqual({
			id: '213522',
			status: 200,
			statusmsg: 'Created successfully!',
		});
	});

	it('keeps an empty id and decodes entities', () => {
		expect(
			parseETerminXmlResponse(
				'<response><id></id><status>200</status><statusmsg>1 record(s) deleted &amp; done</statusmsg></response>',
			),
		).toEqual({ id: '', status: 200, statusmsg: '1 record(s) deleted & done' });
	});

	it('leaves JSON values and other text alone', () => {
		expect(parseETerminXmlResponse([{ CalendarID: 1 }])).toBeUndefined();
		expect(parseETerminXmlResponse('plain text')).toBeUndefined();
	});
});

describe('eTermin appointment sync with no changes', () => {
	afterEach(() => jest.restoreAllMocks());

	it('reads an empty 200 body as an empty list', async () => {
		jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response('', {
				status: 200,
				headers: { 'content-type': 'application/json', synctoken: '2' },
			}),
		);
		await expect(
			makeETerminSyncRequest(
				'/api/appointmentsync',
				{ publicKey: 'public', privateKey: 'private' },
				2,
			),
		).resolves.toEqual({ appointments: [], synctoken: 2 });
	});
});

describe('eTermin inputs the live API refuses', () => {
	it('updates a voucher by iid, not by its code', () => {
		const schema = ETerminEndpointInputSchemas.vouchersUpdate;
		expect(schema.safeParse({ iid: 1765597, description: 'x' }).success).toBe(
			true,
		);
		// 400 "Parameter iid is missing!" with id alone.
		expect(schema.safeParse({ id: 'CPT1', description: 'x' }).success).toBe(
			false,
		);
	});

	it('does not offer sendsms on appointment updates', () => {
		// 404 "Invalid column name 'sendsms'".
		expect(
			ETerminEndpointInputSchemas.appointmentsUpdate.safeParse({
				id: 'a',
				sendsms: false,
			}).success,
		).toBe(false);
	});

	it('does not offer service group names on update', () => {
		// 404 "Invalid column name 'servicegroupde'".
		const schema = ETerminEndpointInputSchemas.serviceGroupsUpdate;
		expect(
			schema.safeParse({
				servicegroupid: 1,
				displayindex: 1,
				servicegroupde: 'x',
			}).success,
		).toBe(false);
		expect(
			schema.safeParse({
				servicegroupid: 1,
				displayindex: 1,
				additionaltextde: 'x',
			}).success,
		).toBe(true);
	});

	it('deletes a calendar/service assignment by calendar and service', () => {
		const schema = ETerminEndpointInputSchemas.calendarServicesDelete;
		// 400 "calendarid is missing!" for the documented id.
		expect(schema.safeParse({ id: '4427370' }).success).toBe(false);
		expect(
			schema.safeParse({ calendarid: '234554', serviceid: '700935' }).success,
		).toBe(true);
	});
});
