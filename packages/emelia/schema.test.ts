import {
	EmeliaEndpointInputSchemas,
	EmeliaEndpointOutputSchemas,
} from './endpoints/types';
import { EmeliaSchema } from './schema';

describe('Emelia schema', () => {
	it('declares a semver version', () => {
		expect(EmeliaSchema.version).toBeDefined();
		expect(EmeliaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof EmeliaSchema.entities).toBe('object');
		expect(EmeliaSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(EmeliaSchema.entities))).toBe(true);
		for (const entity of Object.values(EmeliaSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.

describe('Emelia REST input schemas', () => {
	it('restCampaigns.create requires a name', () => {
		expect(
			EmeliaEndpointInputSchemas.restCreateCampaign.parse({
				name: 'Q3 Outbound',
			}),
		).toEqual({ name: 'Q3 Outbound' });
		expect(
			EmeliaEndpointInputSchemas.restCreateCampaign.safeParse({}).success,
		).toBe(false);
	});

	it('restCampaigns.list accepts optional pagination', () => {
		expect(
			EmeliaEndpointInputSchemas.restListCampaigns.parse({
				page: 1,
				limit: 20,
			}),
		).toEqual({ page: 1, limit: 20 });
		expect(
			EmeliaEndpointInputSchemas.restListCampaigns.parse(undefined),
		).toBeUndefined();
	});

	it('restCampaigns.getActivities requires a campaign id', () => {
		const parsed = EmeliaEndpointInputSchemas.restGetCampaignActivities.parse({
			campaignId: 'cmp_1',
		});
		expect(parsed.campaignId).toBe('cmp_1');
		expect(
			EmeliaEndpointInputSchemas.restGetCampaignActivities.safeParse({})
				.success,
		).toBe(false);
	});

	it('emailCampaigns endpoints validate campaign and contact', () => {
		const parsed = EmeliaEndpointInputSchemas.emailAddContact.parse({
			campaignId: 'cmp_1',
			contact: { email: 'lead@example.com', firstName: 'Alex' },
		});
		expect(parsed.contact.email).toBe('lead@example.com');
		expect(
			EmeliaEndpointInputSchemas.emailDeleteContact.safeParse({
				campaignId: 'cmp_1',
				email: 'not-an-email',
			}).success,
		).toBe(false);
	});

	it('blacklist endpoints require a valid email', () => {
		expect(
			EmeliaEndpointInputSchemas.blacklistAdd.parse({
				email: 'blocked@example.com',
			}),
		).toEqual({ email: 'blocked@example.com' });
		expect(
			EmeliaEndpointInputSchemas.blacklistRemove.safeParse({
				email: 'bad',
			}).success,
		).toBe(false);
	});

	it('linkedin endpoints validate campaign and contact URL', () => {
		expect(
			EmeliaEndpointInputSchemas.linkedinCreateCampaign.parse({
				name: 'LI Sequence',
			}),
		).toEqual({ name: 'LI Sequence' });
		const parsed = EmeliaEndpointInputSchemas.linkedinDeleteContact.parse({
			campaignId: 'li_1',
			contactUrl: 'https://linkedin.com/in/alex',
		});
		expect(parsed.contactUrl).toBe('https://linkedin.com/in/alex');
		expect(
			EmeliaEndpointInputSchemas.linkedinGetActivities.safeParse({}).success,
		).toBe(false);
	});

	it('tools job inputs enforce provider-required fields', () => {
		expect(
			EmeliaEndpointInputSchemas.findEmailSingle.parse({
				fullname: 'Alex Rao',
				companyName: 'Acme',
			}),
		).toEqual({ fullname: 'Alex Rao', companyName: 'Acme' });
		expect(
			EmeliaEndpointInputSchemas.findEmailSingle.safeParse({
				fullname: 'Alex Rao',
			}).success,
		).toBe(false);
		expect(
			EmeliaEndpointInputSchemas.findPhoneSingle.parse({
				linkedinUrl: 'https://linkedin.com/in/alex',
			}),
		).toEqual({ linkedinUrl: 'https://linkedin.com/in/alex' });
		expect(
			EmeliaEndpointInputSchemas.verifyEmailSingle.safeParse({
				email: 'bad',
			}).success,
		).toBe(false);
		expect(
			EmeliaEndpointInputSchemas.getFindEmailResult.parse({ jobId: 'job_1' }),
		).toEqual({ jobId: 'job_1' });
		expect(
			EmeliaEndpointInputSchemas.getFindPhoneResult.parse({ jobId: 'job_2' }),
		).toEqual({ jobId: 'job_2' });
		expect(
			EmeliaEndpointInputSchemas.getVerifyEmailResult.parse({ jobId: 'job_3' }),
		).toEqual({ jobId: 'job_3' });
	});

	it('webhook create/delete validate URL and events', () => {
		const parsed = EmeliaEndpointInputSchemas.createWebhook.parse({
			campaignId: 'cmp_1',
			url: 'https://example.com/hook',
			events: ['FINISHED'],
		});
		expect(parsed.events).toEqual(['FINISHED']);
		expect(
			EmeliaEndpointInputSchemas.createWebhook.safeParse({
				campaignId: 'cmp_1',
				url: 'https://example.com/hook',
				events: [],
			}).success,
		).toBe(false);
		expect(
			EmeliaEndpointInputSchemas.deleteWebhook.safeParse({
				url: 'not-a-url',
			}).success,
		).toBe(false);
	});
});

describe('Emelia REST output schemas', () => {
	it('tools job creation returns success + jobId', () => {
		expect(
			EmeliaEndpointOutputSchemas.findEmailSingle.parse({
				success: true,
				jobId: 'job_1',
			}),
		).toEqual({ success: true, jobId: 'job_1' });
		expect(
			EmeliaEndpointOutputSchemas.findPhoneSingle.parse({
				success: true,
				jobId: 'job_2',
			}),
		).toEqual({ success: true, jobId: 'job_2' });
		expect(
			EmeliaEndpointOutputSchemas.verifyEmailSingle.parse({
				success: true,
				jobId: 'job_3',
			}),
		).toEqual({ success: true, jobId: 'job_3' });
	});

	it('tools job results parse documented shapes with default status', () => {
		const email = EmeliaEndpointOutputSchemas.getFindEmailResult.parse({
			success: true,
			data: { email: 'alex@acme.com', qualification: 'valid', status: 'done' },
		});
		expect(email.data.email).toBe('alex@acme.com');
		expect(email.data.status).toBe('done');

		const running = EmeliaEndpointOutputSchemas.getFindEmailResult.parse({
			success: true,
			data: { email: 'alex@acme.com' },
		});
		expect(running.data.status).toBe('running');

		const phone = EmeliaEndpointOutputSchemas.getFindPhoneResult.parse({
			success: true,
			data: { linkedinUrl: 'https://linkedin.com/in/alex', status: 'done' },
		});
		expect(phone.data.linkedinUrl).toBe('https://linkedin.com/in/alex');

		const verify = EmeliaEndpointOutputSchemas.getVerifyEmailResult.parse({
			success: true,
			data: { email: 'alex@acme.com', qualification: 'invalid' },
		});
		expect(verify.data.qualification).toBe('invalid');
	});

	it('list outputs accept plain arrays and paginated envelopes', () => {
		const campaigns = EmeliaEndpointOutputSchemas.restListCampaigns.parse([
			{ id: 'c1', name: 'A', status: 'RUNNING' },
		]);
		expect(campaigns).toHaveLength(1);

		const envelope = EmeliaEndpointOutputSchemas.restListCampaigns.parse({
			campaigns: [{ id: 'c1' }],
			total: 1,
		});
		expect(envelope).toEqual({ campaigns: [{ id: 'c1' }], total: 1 });

		const activities =
			EmeliaEndpointOutputSchemas.restGetCampaignActivities.parse({
				activities: [{ type: 'open' }],
			});
		expect(activities).toEqual({ activities: [{ type: 'open' }] });

		const contacts = EmeliaEndpointOutputSchemas.emailListContacts.parse([
			{ email: 'a@example.com' },
		]);
		expect(contacts).toHaveLength(1);

		const providers = EmeliaEndpointOutputSchemas.listProviders.parse([
			{ name: 'SMTP' },
		]);
		expect(providers).toHaveLength(1);

		const hooks = EmeliaEndpointOutputSchemas.listWebhooks.parse({
			webhooks: [{ url: 'https://example.com/hook' }],
		});
		expect(hooks).toEqual({
			webhooks: [{ url: 'https://example.com/hook' }],
		});
	});

	it('mutation outputs accept documented-minimal shapes', () => {
		expect(
			EmeliaEndpointOutputSchemas.restCreateCampaign.parse({
				message: 'created',
				campaignId: 'cmp_9',
			}),
		).toEqual({ message: 'created', campaignId: 'cmp_9' });
		expect(
			EmeliaEndpointOutputSchemas.emailAddContact.parse({ success: true }),
		).toEqual({ success: true });
		expect(
			EmeliaEndpointOutputSchemas.blacklistAdd.parse({
				message: 'added',
			}),
		).toEqual({ message: 'added' });
		expect(
			EmeliaEndpointOutputSchemas.createWebhook.parse({
				id: 'wh_1',
				url: 'https://example.com/hook',
			}),
		).toEqual({ id: 'wh_1', url: 'https://example.com/hook' });
	});
});
