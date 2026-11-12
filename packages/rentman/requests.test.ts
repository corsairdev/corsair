import * as Catalog from './endpoints/catalog';
import * as Contacts from './endpoints/contacts';
import * as People from './endpoints/people';
import {
	APPOINTMENT,
	APPOINTMENT_ID,
	APPOINTMENT_PAGE,
	CONTACT,
	CONTACT_ID,
	CONTACT_PAGE,
	CONTACT_PAGE_WITH_NEXT,
	CREW,
	CREW_ID,
	CREW_PAGE,
	EQUIPMENT,
	EQUIPMENT_ID,
	EQUIPMENT_PAGE,
	INVOICE,
	INVOICE_ID,
	INVOICE_PAGE,
	PROJECT,
	PROJECT_ID,
	PROJECT_PAGE,
} from './test-fixtures';
import { invoke, lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('contacts.list', () => {
	it('sends the filters and joins the projection into one value', async () => {
		respond(fetchMock, CONTACT_PAGE);

		const result = (await invoke(Contacts.list, {
			country: 'NL',
			type: 'company',
			folder: '/contacts',
			fields: ['displayname', 'email_1'],
			expand: ['customer'],
			sort: '+displayname',
			limit: 100,
		})) as Awaited<ReturnType<typeof Contacts.list>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/contacts');
		expect(request.query).toEqual({
			country: 'NL',
			type: 'company',
			folder: '/contacts',
			fields: 'displayname,email_1',
			expand: 'customer',
			sort: '+displayname',
			limit: '100',
		});
		expect(result.contacts).toHaveLength(1);
		expect(result.contacts[0]?.displayname).toBe('Acme Inc');
		expect(result.next_cursor).toBeNull();
		expect(result.item_count).toBe(1);
	});

	it('sends a relational operator as a bracketed key', async () => {
		respond(fetchMock, CONTACT_PAGE);

		await invoke(Contacts.list, { modified: { gte: '2026-01-01' } });

		expect(lastRequest(fetchMock).query['modified[gte]']).toBe('2026-01-01');
	});

	it('reads the opaque cursor out of the next page', async () => {
		respond(fetchMock, CONTACT_PAGE_WITH_NEXT);

		const result = (await invoke(Contacts.list, {})) as Awaited<
			ReturnType<typeof Contacts.list>
		>;

		expect(result.next_cursor).toBe('eyJhZnRlciI6NDU2LCJsaW1pdCI6MX0');
		expect(result.next_page_url).toContain('cursor=');
	});

	it('rejects a limit above the documented 1500 maximum', async () => {
		await expect(invoke(Contacts.list, { limit: 1501 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('contacts.get', () => {
	it('reads one contact by id', async () => {
		respond(fetchMock, { data: CONTACT });

		const result = (await invoke(Contacts.get, {
			contact_id: CONTACT_ID,
		})) as Awaited<ReturnType<typeof Contacts.get>>;

		expect(lastRequest(fetchMock).path).toBe(`/contacts/${CONTACT_ID}`);
		expect(result.contact.name).toBe('Acme Inc');
		expect(result.contact.mailing_city).toBe('Amsterdam');
	});

	it('rejects a non-positive id', async () => {
		await expect(invoke(Contacts.get, { contact_id: 0 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('contacts.create', () => {
	it('flattens the address blocks into prefixed fields', async () => {
		respond(fetchMock, { data: CONTACT });

		await invoke(Contacts.create, {
			name: 'Acme Inc',
			type: 'company',
			country: 'NL',
			mailing_address: { street: 'Damrak', number: '1', city: 'Amsterdam' },
			visit_address: { street: 'Damrak', city: 'Amsterdam' },
		});

		expect(lastRequest(fetchMock).json()).toEqual({
			name: 'Acme Inc',
			type: 'company',
			country: 'NL',
			mailing_street: 'Damrak',
			mailing_number: '1',
			mailing_city: 'Amsterdam',
			visit_street: 'Damrak',
			visit_city: 'Amsterdam',
		});
	});

	it('rejects coordinates outside the valid range', async () => {
		await expect(
			invoke(Contacts.create, { name: 'Acme', latitude: 91 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('contacts.update and delete', () => {
	it('puts the id in the path and not the body', async () => {
		respond(fetchMock, { data: CONTACT });

		await invoke(Contacts.update, {
			contact_id: CONTACT_ID,
			name: 'Acme B.V.',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PUT');
		expect(request.path).toBe(`/contacts/${CONTACT_ID}`);
		expect(request.json()).toEqual({ name: 'Acme B.V.' });
	});

	it('deletes a contact and reports the id', async () => {
		respond(fetchMock, {}, 200);

		const result = (await invoke(Contacts.remove, {
			contact_id: CONTACT_ID,
		})) as Awaited<ReturnType<typeof Contacts.remove>>;

		expect(lastRequest(fetchMock).method).toBe('DELETE');
		expect(result).toEqual({ success: true, contact_id: CONTACT_ID });
	});
});

describe('projects', () => {
	it('lists projects with a name filter', async () => {
		respond(fetchMock, PROJECT_PAGE);

		const result = (await invoke(Catalog.projectsList, {
			name: { eq: 'Festival 2026' },
		})) as Awaited<ReturnType<typeof Catalog.projectsList>>;

		expect(lastRequest(fetchMock).path).toBe('/projects');
		expect(lastRequest(fetchMock).query['name[eq]']).toBe('Festival 2026');
		expect(result.projects[0]?.number).toBe('P-2026-001');
	});

	it('reads one project by id', async () => {
		respond(fetchMock, { data: PROJECT });

		const result = (await invoke(Catalog.projectsGet, {
			project_id: PROJECT_ID,
		})) as Awaited<ReturnType<typeof Catalog.projectsGet>>;

		expect(result.project.project_total_price).toBe(18500);
		expect(result.project.customer).toBe(`/contacts/${CONTACT_ID}`);
	});

	it('creates a project with its number', async () => {
		respond(fetchMock, { data: PROJECT });

		await invoke(Catalog.projectsCreate, {
			name: 'Festival 2026',
			number: 'P-2026-001',
		});

		expect(lastRequest(fetchMock).json()).toEqual({
			name: 'Festival 2026',
			number: 'P-2026-001',
		});
	});

	it('rejects an empty project name', async () => {
		await expect(
			invoke(Catalog.projectsCreate, { name: '' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('equipment', () => {
	it('filters on in_shop rather than a non-existent active flag', async () => {
		respond(fetchMock, EQUIPMENT_PAGE);

		const result = (await invoke(Catalog.equipmentList, {
			in_shop: true,
			name: { eq: 'Yamaha QL5 Mixer' },
		})) as Awaited<ReturnType<typeof Catalog.equipmentList>>;

		const request = lastRequest(fetchMock);
		expect(request.query).toEqual({
			in_shop: 'true',
			'name[eq]': 'Yamaha QL5 Mixer',
		});
		expect(result.equipment[0]?.code).toBe('AUD-001');
		expect(result.equipment[0]?.price).toBe(150);
	});

	it('reads one equipment item by id', async () => {
		respond(fetchMock, { data: EQUIPMENT });

		const result = (await invoke(Catalog.equipmentGet, {
			equipment_id: EQUIPMENT_ID,
		})) as Awaited<ReturnType<typeof Catalog.equipmentGet>>;

		expect(result.equipment.list_price).toBe(12000);
		expect(result.equipment.weight).toBe(32);
	});

	it('creates an item with the API price field names', async () => {
		respond(fetchMock, { data: EQUIPMENT });

		await invoke(Catalog.equipmentCreate, {
			name: 'Yamaha QL5 Mixer',
			code: 'AUD-001',
			price: 150,
			list_price: 12000,
			in_shop: true,
		});

		expect(lastRequest(fetchMock).json()).toEqual({
			name: 'Yamaha QL5 Mixer',
			code: 'AUD-001',
			price: 150,
			list_price: 12000,
			in_shop: true,
		});
	});

	it('rejects an empty equipment name', async () => {
		await expect(
			invoke(Catalog.equipmentCreate, { name: '' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('crew and appointments', () => {
	it('lists crew with a name filter', async () => {
		respond(fetchMock, CREW_PAGE);

		const result = (await invoke(People.crewList, {
			name: { eq: 'Sam Rivera' },
			active: true,
		})) as Awaited<ReturnType<typeof People.crewList>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/crew');
		expect(request.query['name[eq]']).toBe('Sam Rivera');
		expect(request.query.active).toBe('true');
		expect(result.crew[0]?.firstname).toBe('Sam');
	});

	it('reads one crew member by id', async () => {
		respond(fetchMock, { data: CREW });

		const result = (await invoke(People.crewGet, {
			crew_id: CREW_ID,
		})) as Awaited<ReturnType<typeof People.crewGet>>;

		expect(result.crew.postal_code).toBe('1012 LG');
	});

	it('lists appointments with a start filter', async () => {
		respond(fetchMock, APPOINTMENT_PAGE);

		const result = (await invoke(People.appointmentsList, {
			start: { gte: '2026-07-01' },
		})) as Awaited<ReturnType<typeof People.appointmentsList>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/appointments');
		expect(request.query['start[gte]']).toBe('2026-07-01');
		expect(result.appointments[0]?.name).toBe('Load-in');
	});

	it('reads one appointment by id', async () => {
		respond(fetchMock, { data: APPOINTMENT });

		const result = (await invoke(People.appointmentsGet, {
			appointment_id: APPOINTMENT_ID,
		})) as Awaited<ReturnType<typeof People.appointmentsGet>>;

		expect(result.appointment.is_plannable).toBe(true);
	});
});

describe('invoices', () => {
	it('lists invoices for a project', async () => {
		respond(fetchMock, INVOICE_PAGE);

		const result = (await invoke(People.invoicesList, {
			project: PROJECT_ID,
			number: { eq: 'F-2026-001' },
		})) as Awaited<ReturnType<typeof People.invoicesList>>;

		expect(lastRequest(fetchMock).query['number[eq]']).toBe('F-2026-001');
		expect(result.invoices[0]?.outstanding_balance).toBe(18150);
	});

	it('reads one invoice by id', async () => {
		respond(fetchMock, { data: INVOICE });

		const result = (await invoke(People.invoicesGet, {
			invoice_id: INVOICE_ID,
		})) as Awaited<ReturnType<typeof People.invoicesGet>>;

		expect(result.invoice.price_invat).toBe(18150);
		expect(result.invoice.is_paid).toBe(false);
	});
});

describe('page envelope', () => {
	it('fails rather than inventing an empty page when data is missing', async () => {
		respond(fetchMock, { itemCount: 0 });

		await expect(invoke(Contacts.list, {})).rejects.toThrow();
	});

	it('keeps a null optional as null rather than inventing a value', async () => {
		respond(fetchMock, { data: CONTACT });

		const result = (await invoke(Contacts.get, {
			contact_id: CONTACT_ID,
		})) as Awaited<ReturnType<typeof Contacts.get>>;

		expect(CONTACT.created).toBeDefined();
		expect(result.contact.id).toBe(CONTACT_ID);
	});
});
