import { logEventFromContext } from 'corsair/core';
import { makeAscoraRequest } from '../client';
import type { AscoraContext } from '../index';
import {
	createEnquiry,
	createNote,
	getContact,
	getCustomer,
	getJob,
	getLabourRoles,
	getStandardSections,
	getStandardStages,
	getSupplier,
	listCategories,
	listCustomers,
	listJobs,
	listKits,
	listQuotes,
	listSupplierInvoices,
	listSuppliers,
	listSupplies,
	searchJobs,
	uploadAttachment,
	upsertContact,
	upsertCustomer,
	upsertSupplier,
} from './ops';

jest.mock('../client', () => {
	const actual = jest.requireActual('../client') as typeof import('../client');
	return {
		...actual,
		makeAscoraRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual(
		'corsair/core',
	) as typeof import('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

const ctx = {
	key: 'test-api-key',
	options: {},
	db: {},
	$getAccountId: async () => 'test-account',
} as unknown as AscoraContext;

beforeEach(() => {
	jest.clearAllMocks();
});

describe('ascora endpoints', () => {
	it('customers.list GETs /Customers/Customers with official filters', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			results: [{ customerId: 'c1', companyName: 'Acme' }],
			totalPages: 1,
			totalRecords: 1,
		});
		const result = await listCustomers(ctx, {
			page: 1,
			pageSize: 1,
			filterText: 'Acme',
		});
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Customers/Customers',
			expect.objectContaining({
				query: expect.objectContaining({
					Page: 1,
					PageSize: 1,
					FilterText: 'Acme',
				}),
			}),
		);
		expect(result.results[0]?.customerId).toBe('c1');
	});

	it('customers.get GETs /Customers/Customer/{id}', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			customer: { customerId: 'c1', companyName: 'Acme' },
		});
		const result = await getCustomer(ctx, { customerId: 'c1' });
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Customers/Customer/c1',
		);
		expect(result.customer?.customerId).toBe('c1');
	});

	it('customers.upsert POSTs /Customers/Customer', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			customer: { customerId: 'c2', companyName: 'New Co' },
		});
		const result = await upsertCustomer(ctx, { companyName: 'New Co' });
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Customers/Customer',
			expect.objectContaining({
				method: 'POST',
				body: { companyName: 'New Co' },
			}),
		);
		expect(result.success).toBe(true);
	});

	it('contacts.get GETs /Customers/Contact/{id}', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			contact: { contactId: 'n1', customerId: 'c1', firstName: 'Pat' },
		});
		const result = await getContact(ctx, { contactId: 'n1' });
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Customers/Contact/n1',
		);
		expect(result.contact?.contactId).toBe('n1');
	});

	it('contacts.upsert POSTs /Customers/Contact', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			message: 'Contact Created/Updated',
			contact: { contactId: 'n1', customerId: 'c1', firstName: 'Pat' },
		});
		const result = await upsertContact(ctx, {
			customerId: 'c1',
			firstName: 'Pat',
		});
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Customers/Contact',
			expect.objectContaining({ method: 'POST' }),
		);
		expect(result.success).toBe(true);
	});

	it('enquiries.create POSTs /Enquiry', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			entityId: 'e1',
		});
		const result = await createEnquiry(ctx, {
			companyName: 'Acme',
			email: 'a@test.com',
			enquiryDescription: 'Need a quote',
		});
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Enquiry',
			expect.objectContaining({ method: 'POST' }),
		);
		expect(result.entityId).toBe('e1');
	});

	it('quotes.list GETs /Quotes/Quotes', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			results: [{ quoteId: 'q1', quoteNumber: 'Q1' }],
			totalPages: 0,
			totalRecords: 0,
		});
		await listQuotes(ctx, { quoteStatus: 'ALL', pageSize: 1 });
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Quotes/Quotes',
			expect.objectContaining({
				query: expect.objectContaining({ QuoteStatus: 'ALL', PageSize: 1 }),
			}),
		);
	});

	it('quotes.labourRoles GETs /Quotes/LabourRoles', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue([
			{ labourRoleId: 'r1', name: 'Tech', hourlyRateExTax: 0 },
		]);
		const result = await getLabourRoles(ctx, {});
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Quotes/LabourRoles',
		);
		expect(result[0]?.labourRoleId).toBe('r1');
	});

	it('quotes.standardSections GETs /Quotes/StandardSections', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue([]);
		const result = await getStandardSections(ctx, {});
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Quotes/StandardSections',
		);
		expect(result).toEqual([]);
	});

	it('quotes.standardStages GETs /Quotes/StandardStages', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue([]);
		await getStandardStages(ctx, {});
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Quotes/StandardStages',
		);
	});

	it('inventory.supplies GETs /Inventory/Supplies', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			results: [],
			totalPages: 0,
			totalRecords: 0,
		});
		await listSupplies(ctx, { pageSize: 1 });
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Inventory/Supplies',
			expect.objectContaining({
				query: expect.objectContaining({ PageSize: 1 }),
			}),
		);
	});

	it('inventory.kits GETs /Inventory/Kits', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			results: [],
			totalPages: 0,
			totalRecords: 0,
		});
		await listKits(ctx, { pageSize: 1 });
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Inventory/Kits',
			expect.any(Object),
		);
	});

	it('inventory.categories GETs /Inventory/Categories', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			results: [{ categoryId: 'cat1', name: 'Misc', categoryNumber: 1 }],
			totalPages: 1,
			totalRecords: 1,
		});
		const result = await listCategories(ctx, { pageSize: 1 });
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Inventory/Categories',
			expect.any(Object),
		);
		expect(result.results[0]?.categoryId).toBe('cat1');
	});

	it('jobs.get GETs /Jobs/Job/{jobNumber}', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			job: { jobId: 'j1', jobNumber: 'J1', jobStatus: 0 },
		});
		const result = await getJob(ctx, { jobNumber: 'J1' });
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Jobs/Job/J1',
		);
		expect(result.job?.jobNumber).toBe('J1');
	});

	it('jobs.list GETs /Jobs/Jobs with status filters', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			results: [{ jobId: 'j1', jobNumber: 'J1' }],
			totalPages: 1,
			totalRecords: 1,
		});
		await listJobs(ctx, { jobStatus: 'ALL', pageSize: 1 });
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Jobs/Jobs',
			expect.objectContaining({
				query: expect.objectContaining({ JobStatus: 'ALL' }),
			}),
		);
	});

	it('jobs.search GETs /Jobs/Jobs with FilterText', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			results: [{ jobId: 'j1', jobNumber: 'J1' }],
			totalPages: 1,
			totalRecords: 1,
		});
		await searchJobs(ctx, { filterText: 'J1' });
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Jobs/Jobs',
			expect.objectContaining({
				query: expect.objectContaining({ FilterText: 'J1', JobStatus: 'ALL' }),
			}),
		);
	});

	it('suppliers.list GETs /Suppliers/Suppliers', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			results: [],
			totalPages: 0,
			totalRecords: 0,
		});
		await listSuppliers(ctx, { supplierName: 'Reece' });
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Suppliers/Suppliers',
			expect.objectContaining({
				query: expect.objectContaining({ SupplierName: 'Reece' }),
			}),
		);
	});

	it('suppliers.get GETs /Suppliers/Supplier/{id}', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			supplier: { supplierId: 's1', name: 'Reece' },
		});
		const result = await getSupplier(ctx, { supplierId: 's1' });
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Suppliers/Supplier/s1',
		);
		expect(result.supplier?.supplierId).toBe('s1');
	});

	it('suppliers.upsert POSTs /Suppliers/Supplier', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			supplier: { supplierId: 's2', name: 'New Supplier' },
		});
		await upsertSupplier(ctx, { name: 'New Supplier' });
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Suppliers/Supplier',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('supplierInvoices.list GETs /SupplierInvoices/SupplierInvoices', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			results: [],
			totalPages: 0,
			totalRecords: 0,
		});
		await listSupplierInvoices(ctx, { pageSize: 1 });
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/SupplierInvoices/SupplierInvoices',
			expect.any(Object),
		);
	});

	it('notes.create POSTs /Notes/Note', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			entityId: 'note1',
		});
		const result = await createNote(ctx, {
			entityId: 'j1',
			entityType: 'Job',
			noteContent: 'API note',
		});
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Notes/Note',
			expect.objectContaining({ method: 'POST' }),
		);
		expect(result.entityId).toBe('note1');
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'ascora.notes.create',
			{ entityId: 'j1', entityType: 'Job' },
			'completed',
		);
	});

	it('attachments.upload POSTs multipart /Attachments/{type}/{id}', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: true,
			entityId: 'att1',
		});
		const result = await uploadAttachment(ctx, {
			entityType: 'Job',
			entityId: 'j1',
			fileName: 'note.txt',
			fileBase64: Buffer.from('hi').toString('base64'),
			contentType: 'text/plain',
		});
		expect(makeAscoraRequest).toHaveBeenCalledWith(
			'test-api-key',
			'/Attachments/Job/j1',
			expect.objectContaining({
				method: 'POST',
				formData: expect.objectContaining({ file: expect.any(File) }),
			}),
		);
		expect(result.entityId).toBe('att1');
	});

	it('throws when Ascora returns success: false', async () => {
		(makeAscoraRequest as jest.Mock).mockResolvedValue({
			success: false,
			message: 'No Matching Job Found (X)',
		});
		await expect(getJob(ctx, { jobNumber: 'X' })).rejects.toThrow(
			'No Matching Job Found (X)',
		);
	});
});
