import {
	JobNimbusEndpointInputSchemas,
	JobNimbusEndpointOutputSchemas,
} from './endpoints/types';
import { jobNimbusEndpointMeta, jobNimbusEndpointSchemas } from './index';
import { JobNimbusSchema } from './schema';

describe('JobNimbus schema and endpoint registry', () => {
	it('defines a valid plugin database schema', () => {
		expect(JobNimbusSchema.version).toBeDefined();
		expect(JobNimbusSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(typeof JobNimbusSchema.entities).toBe('object');
		expect(JobNimbusSchema.entities).not.toBeNull();
		expect(Object.keys(JobNimbusSchema.entities).length).toBe(0);
	});

	it('keeps schemas, metadata and endpoint keys in sync', () => {
		const schemaKeys = Object.keys(jobNimbusEndpointSchemas).sort();
		const metaKeys = Object.keys(jobNimbusEndpointMeta).sort();
		expect(schemaKeys).toEqual(metaKeys);
		expect(schemaKeys.length).toBe(67);
	});

	describe('Input schemas validation', () => {
		it('validates ContactsCreateInputSchema', () => {
			const valid = {
				first_name: 'John',
				last_name: 'Doe',
				record_type_name: 'Customer',
				status_name: 'Lead',
			};
			expect(JobNimbusEndpointInputSchemas.contactsCreate.parse(valid)).toEqual(
				valid,
			);

			// Strict rejects undocumented callback fields
			expect(() =>
				JobNimbusEndpointInputSchemas.contactsCreate.parse({
					...valid,
					webhook_url: 'https://evil.example.com',
				}),
			).toThrow();
		});

		it('validates ContactsUpdateInputSchema', () => {
			const valid = { jnid: 'c1', first_name: 'Jane' };
			expect(JobNimbusEndpointInputSchemas.contactsUpdate.parse(valid)).toEqual(
				valid,
			);
			expect(() =>
				JobNimbusEndpointInputSchemas.contactsUpdate.parse({}),
			).toThrow();
		});

		it('validates ContactsDeleteInputSchema', () => {
			const valid = { jnid: 'c1' };
			expect(JobNimbusEndpointInputSchemas.contactsDelete.parse(valid)).toEqual(
				valid,
			);
			expect(() =>
				JobNimbusEndpointInputSchemas.contactsDelete.parse({}),
			).toThrow();
		});

		it('validates ContactsGetInputSchema', () => {
			const valid = { jnid: 'c1' };
			expect(JobNimbusEndpointInputSchemas.contactsGet.parse(valid)).toEqual(
				valid,
			);
			expect(() =>
				JobNimbusEndpointInputSchemas.contactsGet.parse({}),
			).toThrow();
		});

		it('validates ContactsListInputSchema with bounds', () => {
			expect(
				JobNimbusEndpointInputSchemas.contactsList.parse({
					size: 100,
					from: 0,
				}),
			).toEqual({
				size: 100,
				from: 0,
			});
			expect(() =>
				JobNimbusEndpointInputSchemas.contactsList.parse({ size: 2000 }),
			).toThrow();
			expect(() =>
				JobNimbusEndpointInputSchemas.contactsList.parse({ from: -1 }),
			).toThrow();
		});

		it('validates JobsCreateInputSchema', () => {
			const valid = {
				name: 'Roof Repair',
				record_type_name: 'Job',
				status_name: 'Lead',
			};
			expect(JobNimbusEndpointInputSchemas.jobsCreate.parse(valid)).toEqual(
				valid,
			);
			expect(() =>
				JobNimbusEndpointInputSchemas.jobsCreate.parse({}),
			).toThrow();
		});

		it('validates TasksCreateInputSchema', () => {
			const valid = {
				title: 'Follow up',
				date_start: 1700000000,
			};
			expect(JobNimbusEndpointInputSchemas.tasksCreate.parse(valid)).toEqual(
				valid,
			);
			expect(() =>
				JobNimbusEndpointInputSchemas.tasksCreate.parse({}),
			).toThrow();
		});

		it('validates ActivitiesCreateInputSchema', () => {
			const valid = { note: 'Called customer' };
			expect(
				JobNimbusEndpointInputSchemas.activitiesCreate.parse(valid),
			).toEqual(valid);
			expect(() =>
				JobNimbusEndpointInputSchemas.activitiesCreate.parse({}),
			).toThrow();
		});

		it('validates FilesCreateInputSchema', () => {
			const valid = { data: 'aGVsbG8=', filename: 'test.txt' };
			expect(JobNimbusEndpointInputSchemas.filesCreate.parse(valid)).toEqual(
				valid,
			);
			expect(() =>
				JobNimbusEndpointInputSchemas.filesCreate.parse({}),
			).toThrow();
		});

		it('validates FilesCreateFromUrlInputSchema', () => {
			const valid = { url: 'https://example.com/photo.png' };
			expect(
				JobNimbusEndpointInputSchemas.filesCreateFromUrl.parse(valid),
			).toEqual(valid);
			expect(() =>
				JobNimbusEndpointInputSchemas.filesCreateFromUrl.parse({}),
			).toThrow();
		});

		it('validates FilesRequestSinglePartUploadInputSchema', () => {
			const valid = { filename: 'test.pdf', type: 1, related: ['c1'] };
			expect(
				JobNimbusEndpointInputSchemas.filesRequestSinglePartUpload.parse(valid),
			).toEqual(valid);
			expect(() =>
				JobNimbusEndpointInputSchemas.filesRequestSinglePartUpload.parse({}),
			).toThrow();
		});

		it('validates FilesRequestMultipartUploadInputSchema', () => {
			const valid = {
				partCount: 3,
				fileSize: 15000000,
				isPrivate: false,
				related: ['c1'],
				type: 1,
				filename: 'big.mp4',
			};
			expect(
				JobNimbusEndpointInputSchemas.filesRequestMultipartUpload.parse(valid),
			).toEqual(valid);
			expect(() =>
				JobNimbusEndpointInputSchemas.filesRequestMultipartUpload.parse({
					partCount: 0,
				}),
			).toThrow();
		});

		it('validates FilesCompleteMultipartUploadInputSchema', () => {
			const valid = {
				jnid: 'f1',
				uploadId: 'u1',
				parts: [{ partNumber: 1, etag: 'e1' }],
			};
			expect(
				JobNimbusEndpointInputSchemas.filesCompleteMultipartUpload.parse(valid),
			).toEqual(valid);
			expect(() =>
				JobNimbusEndpointInputSchemas.filesCompleteMultipartUpload.parse({}),
			).toThrow();
		});

		it('validates FilesAbortMultipartUploadInputSchema', () => {
			const valid = { key: 'k1', uploadId: 'u1' };
			expect(
				JobNimbusEndpointInputSchemas.filesAbortMultipartUpload.parse(valid),
			).toEqual(valid);
			expect(() =>
				JobNimbusEndpointInputSchemas.filesAbortMultipartUpload.parse({}),
			).toThrow();
		});

		it('validates ProductsCreateInputSchema', () => {
			const valid = { name: 'Shingles' };
			expect(JobNimbusEndpointInputSchemas.productsCreate.parse(valid)).toEqual(
				valid,
			);
			expect(() =>
				JobNimbusEndpointInputSchemas.productsCreate.parse({}),
			).toThrow();
		});

		it('validates MaterialOrdersCreateInputSchema', () => {
			const valid = { customer_note: 'Deliver to back door' };
			expect(
				JobNimbusEndpointInputSchemas.materialOrdersCreate.parse(valid),
			).toEqual(valid);
		});

		it('validates WorkOrdersCreateInputSchema', () => {
			const valid = { customer: 'c1', internal_note: 'Urgent' };
			expect(
				JobNimbusEndpointInputSchemas.workOrdersCreate.parse(valid),
			).toEqual(valid);
		});

		it('validates EstimatesCreateInputSchema', () => {
			const valid = { number: 'EST-101', status: 1 };
			expect(
				JobNimbusEndpointInputSchemas.estimatesCreate.parse(valid),
			).toEqual(valid);
		});

		it('validates InvoicesCreateInputSchema', () => {
			const valid = { number: 'INV-101', date_due: 1700000000 };
			expect(JobNimbusEndpointInputSchemas.invoicesCreate.parse(valid)).toEqual(
				valid,
			);
		});

		it('validates PaymentsCreateInputSchema', () => {
			const valid = { customer: 'c1', date_payment: 1700000000, total: 500 };
			expect(JobNimbusEndpointInputSchemas.paymentsCreate.parse(valid)).toEqual(
				valid,
			);
			expect(() =>
				JobNimbusEndpointInputSchemas.paymentsCreate.parse({}),
			).toThrow();
		});

		it('validates AccountCreateWorkflowInputSchema with enum', () => {
			const valid = { name: 'Commercial', object_type: 'job' as const };
			expect(
				JobNimbusEndpointInputSchemas.accountCreateWorkflow.parse(valid),
			).toEqual(valid);
			expect(() =>
				JobNimbusEndpointInputSchemas.accountCreateWorkflow.parse({
					name: 'Invalid',
					object_type: 'invalid',
				}),
			).toThrow();
		});

		it('validates AccountCreateCustomFieldInputSchema with enums', () => {
			const valid = {
				title: 'Insurance Claim',
				object_type: 'job' as const,
				type: 'string' as const,
			};
			expect(
				JobNimbusEndpointInputSchemas.accountCreateCustomField.parse(valid),
			).toEqual(valid);
			expect(() =>
				JobNimbusEndpointInputSchemas.accountCreateCustomField.parse({
					title: 'Bad',
					object_type: 'contact',
					type: 'unknown_type',
				}),
			).toThrow();
		});
	});

	describe('Output schemas validation', () => {
		it('validates ContactResponseSchema with passthrough custom fields', () => {
			const raw = {
				jnid: 'c1',
				first_name: 'David',
				last_name: 'Jackson',
				custom_policy_number: 'POL-999',
			};
			const parsed = JobNimbusEndpointOutputSchemas.contactsCreate.parse(raw);
			expect(parsed.jnid).toBe('c1');
			// Passthrough retains custom field
			expect(parsed.custom_policy_number).toBe('POL-999');
		});

		it('validates ContactsListResponseSchema', () => {
			const raw = {
				count: 1,
				results: [{ jnid: 'c1', first_name: 'David' }],
			};
			const parsed = JobNimbusEndpointOutputSchemas.contactsList.parse(raw);
			expect(parsed.count).toBe(1);
			expect(parsed.results?.[0]?.first_name).toBe('David');
		});

		it('validates FileUploadUrlResponseSchema', () => {
			const raw = {
				data: {
					presignedUrl: 'https://s3.amazonaws.com/test',
					jnid: 'f1',
				},
			};
			const parsed =
				JobNimbusEndpointOutputSchemas.filesRequestSinglePartUpload.parse(raw);
			expect(parsed.data?.jnid).toBe('f1');
		});

		it('validates PaymentsCreateResponseSchema', () => {
			const raw = {
				jnid: 'p1',
				isSuccess: true,
				message: 'Payment Saved',
			};
			const parsed = JobNimbusEndpointOutputSchemas.paymentsCreate.parse(raw);
			expect(parsed.jnid).toBe('p1');
			expect(parsed.isSuccess).toBe(true);
		});

		it('validates AccountSettingsResponseSchema', () => {
			const raw = {
				workflows: [{ name: 'Customer' }],
				fileTypes: [{ TypeName: 'Document' }],
			};
			const parsed =
				JobNimbusEndpointOutputSchemas.accountGetSettings.parse(raw);
			expect(parsed.workflows).toBeDefined();
		});
	});
});
