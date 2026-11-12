/**
 * Cases taken from a live run against a Rentman trial workspace on 2026-11-12.
 * Each fixture is a real response, trimmed to the fields the case reads.
 */
import { describeRentmanError } from './client';
import * as Catalog from './endpoints/catalog';
import * as Contacts from './endpoints/contacts';
import * as People from './endpoints/people';
import { invoke, lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

/** GET /equipment/336 from the trial's sample data. */
const LIVE_EQUIPMENT = {
	id: 336,
	created: '2026-11-12T11:52:54+05:30',
	modified: '2026-11-12T11:52:54+05:30',
	creator: null,
	displayname: 'Martin Atomic 3000 Strobe',
	folder: '/folders/11',
	code: 'FX-336',
	name: 'Martin Atomic 3000 Strobe',
	type: 'item',
	rental_sales: 'Rental',
	stock_management: 'Track stock',
	in_shop: true,
	in_planner: true,
	in_archive: false,
	temporary: false,
	price: 25,
	list_price: 0,
	image: '/files/98',
	country_of_origin: 'in',
	is_physical: 'Physical equipment',
	custom: { custom_1: 'Strobe' },
};

/** GET /appointments/25: `recurrence_group` is an integer. */
const LIVE_APPOINTMENT = {
	id: 25,
	created: '2026-11-12T11:52:54.000+05:30',
	modified: '2026-11-12T11:52:57.972+05:30',
	creator: null,
	displayname: 'Dentist appointment',
	name: 'Dentist appointment',
	start: '2026-11-16T10:00:00+05:30',
	end: '2026-11-16T11:00:00+05:30',
	color: 'CABDBF',
	location: '',
	remark: '',
	is_public: false,
	is_plannable: false,
	recurrence_interval_unit: 'once',
	recurrence_enddate: null,
	recurrence_interval: 1,
	recurrence_group: 0,
	recurrence_weekdays: '[]',
	synchronization_id: '',
	synchronisation_uri: '',
};

/** GET /projects: `number` comes back as an integer, not the string the spec says. */
const LIVE_PROJECT = {
	id: 80,
	created: '2026-11-12T11:52:54+05:30',
	modified: '2026-11-12T11:52:54+05:30',
	creator: '/crew/33',
	displayname: 'Live performance band',
	name: 'Live performance band',
	number: 80,
	deposit_status: 'no_deposit_paid',
	project_type: '/projecttypes/106',
	customer: '/contacts/3609',
	account_manager: '/crew/33',
	refundabledeposit: 0,
	custom: {},
};

/** GET /invoices/1, the fields Rentman actually returns. */
const LIVE_INVOICE = {
	id: 1,
	created: '2026-11-12T11:52:54.000+05:30',
	modified: '2026-11-12T11:52:58.053+05:30',
	creator: '/crew/33',
	displayname: 'Invoice 4',
	customer: '/contacts/3631',
	account_manager: '/crew/33',
	contact: null,
	expiration: '2026-11-08T00:00:00+05:30',
	date: '2026-10-31T00:00:00+05:30',
	number: '4',
	subject: 'Regarding: Dry hire',
	finalized: false,
	project: '/projects/113',
	price: 1805,
	price_invat: 2184.05,
	vat_amount: 379.05,
	invoicetype: 'F',
	outstanding_balance: 2184.05,
	total_paid: 0,
	is_paid: false,
	date_sent: null,
	payment_date: null,
};

const page = (data: object[]) => ({
	data,
	itemCount: data.length,
	limit: 300,
	offset: 0,
	next_page_url: null,
});

describe('read shapes Rentman returns', () => {
	it('reads equipment whose rental_sales and stock_management are strings', async () => {
		respond(fetchMock, page([LIVE_EQUIPMENT]));

		const result = (await invoke(Catalog.equipmentList, {})) as Awaited<
			ReturnType<typeof Catalog.equipmentList>
		>;

		expect(result.equipment[0]?.rental_sales).toBe('Rental');
		expect(result.equipment[0]?.stock_management).toBe('Track stock');
	});

	it('reads an appointment whose recurrence_group is a number', async () => {
		respond(fetchMock, { data: LIVE_APPOINTMENT });

		const result = (await invoke(People.appointmentsGet, {
			appointment_id: 25,
		})) as Awaited<ReturnType<typeof People.appointmentsGet>>;

		expect(result.appointment.recurrence_group).toBe(0);
	});

	it('reads a project whose number is an integer', async () => {
		respond(fetchMock, page([LIVE_PROJECT]));

		const result = (await invoke(Catalog.projectsList, {})) as Awaited<
			ReturnType<typeof Catalog.projectsList>
		>;

		expect(result.projects[0]?.number).toBe(80);
	});

	it('reads linked items that expand inlined as objects', async () => {
		respond(fetchMock, {
			data: {
				...LIVE_PROJECT,
				customer: { id: 3609, displayname: 'Highlite', type: 'company' },
				account_manager: { id: 33, displayname: 'Account manager' },
			},
		});

		const result = (await invoke(Catalog.projectsGet, {
			project_id: 80,
			expand: ['customer', 'account_manager'],
		})) as Awaited<ReturnType<typeof Catalog.projectsGet>>;

		expect(result.project.customer).toMatchObject({ id: 3609 });
		expect(lastRequest(fetchMock).query.expand).toBe(
			'customer,account_manager',
		);
	});

	it('reads custom fields of any value type', async () => {
		respond(fetchMock, {
			data: { ...LIVE_EQUIPMENT, custom: { custom_1: 'x', custom_2: true } },
		});

		const result = (await invoke(Catalog.equipmentGet, {
			equipment_id: 336,
		})) as Awaited<ReturnType<typeof Catalog.equipmentGet>>;

		expect(result.equipment.custom).toEqual({ custom_1: 'x', custom_2: true });
	});

	it('types the invoice totals Rentman returns', async () => {
		respond(fetchMock, { data: LIVE_INVOICE });

		const result = (await invoke(People.invoicesGet, {
			invoice_id: 1,
		})) as Awaited<ReturnType<typeof People.invoicesGet>>;

		expect(result.invoice.price_invat).toBe(2184.05);
		expect(result.invoice.outstanding_balance).toBe(2184.05);
		expect(result.invoice.is_paid).toBe(false);
		expect(result.invoice.subject).toBe('Regarding: Dry hire');
	});
});

describe('write bodies Rentman accepts', () => {
	it('sends a contact email and phone as email_1 and phone_1', async () => {
		respond(fetchMock, { data: { id: 1, type: 'private' } });

		await invoke(Contacts.create, {
			type: 'private',
			firstname: 'Test',
			email: 'test@example.com',
			phone: '+1 555 0100',
		});

		const body = lastRequest(fetchMock).json();
		expect(body.email_1).toBe('test@example.com');
		expect(body.phone_1).toBe('+1 555 0100');
		expect(body).not.toHaveProperty('email');
		expect(body).not.toHaveProperty('phone');
	});

	it('sends the visit address country as the contact country', async () => {
		respond(fetchMock, { data: { id: 1 } });

		await invoke(Contacts.create, {
			name: 'Acme',
			visit_address: { city: 'Amsterdam', country: 'nl' },
			mailing_address: { country: 'nl' },
		});

		const body = lastRequest(fetchMock).json();
		expect(body.visit_city).toBe('Amsterdam');
		expect(body.country).toBe('nl');
		expect(body.mailing_country).toBe('nl');
		expect(body).not.toHaveProperty('visit_country');
	});

	it('rejects a contact type Rentman does not have', async () => {
		await expect(
			invoke(Contacts.create, { type: 'person', firstname: 'A' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('creates a project without the customer Rentman refuses to set', async () => {
		respond(fetchMock, { data: LIVE_PROJECT });

		await invoke(Catalog.projectsCreate, {
			name: 'corsair-plugin-test',
			account_manager: 33,
		});

		expect(lastRequest(fetchMock).json()).toEqual({
			name: 'corsair-plugin-test',
			account_manager: '/crew/33',
		});
	});

	it('puts the project id in the path of an update and not the body', async () => {
		respond(fetchMock, { data: { ...LIVE_PROJECT, reference: 'PO-1' } });

		const result = (await invoke(Catalog.projectsUpdate, {
			project_id: 80,
			reference: 'PO-1',
		})) as Awaited<ReturnType<typeof Catalog.projectsUpdate>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PUT');
		expect(request.path).toBe('/projects/80');
		expect(request.json()).toEqual({ reference: 'PO-1' });
		expect(result.project.reference).toBe('PO-1');
	});

	it('puts the equipment id in the path of an update and not the body', async () => {
		respond(fetchMock, { data: { ...LIVE_EQUIPMENT, price: 30 } });

		const result = (await invoke(Catalog.equipmentUpdate, {
			equipment_id: 336,
			price: 30,
			type: 'item',
		})) as Awaited<ReturnType<typeof Catalog.equipmentUpdate>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PUT');
		expect(request.path).toBe('/equipment/336');
		expect(request.json()).toEqual({ price: 30, type: 'item' });
		expect(result.equipment.price).toBe(30);
	});
});

describe('filters Rentman accepts', () => {
	it('does not send a crew type filter, which Rentman answers with a 400', async () => {
		respond(fetchMock, page([]));

		await invoke(People.crewList, { crew_type: 'freelancer', active: true });

		expect(lastRequest(fetchMock).query).toEqual({ active: 'true' });
	});

	it('does not send an appointment project filter, which Rentman answers with a 400', async () => {
		respond(fetchMock, page([]));

		await invoke(People.appointmentsList, { project: 1 });

		expect(lastRequest(fetchMock).query).toEqual({});
	});

	it('rejects an operator Rentman does not support before sending', async () => {
		await expect(
			invoke(Catalog.projectsList, { name: { like: 'Festival' } }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('error messages', () => {
	it('reads the errorMessage key of an app-layer 400', () => {
		const message = describeRentmanError(
			400,
			{
				errorType: 'string',
				errorMessage:
					'[400] You are not permitted to set the following field: customer (ref: 244f284d)',
				trace: [],
			},
			'Bad Request',
		);

		expect(message).toBe(
			'Rentman 400: [400] You are not permitted to set the following field: customer (ref: 244f284d)',
		);
	});
});
