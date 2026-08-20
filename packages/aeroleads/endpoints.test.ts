import { AeroleadsEndpointInputSchemas, AeroleadsEndpointOutputSchemas } from './endpoints/types';

describe('Aeroleads endpoints', () => {
	describe('getDetailsFromLinkedinUrl input', () => {
		it('accepts a canonical linkedin.com URL', () => {
			const result = AeroleadsEndpointInputSchemas.getDetailsFromLinkedinUrl.safeParse({
				linkedin_url: 'https://www.linkedin.com/in/satyanadella',
			});
			expect(result.success).toBe(true);
		});

		it('accepts a regional linkedin.com subdomain', () => {
			const result = AeroleadsEndpointInputSchemas.getDetailsFromLinkedinUrl.safeParse({
				linkedin_url: 'https://in.linkedin.com/in/some-user',
			});
			expect(result.success).toBe(true);
		});

		it('rejects a non-linkedin host', () => {
			const result = AeroleadsEndpointInputSchemas.getDetailsFromLinkedinUrl.safeParse({
				linkedin_url: 'https://example.com/in/satyanadella',
			});
			expect(result.success).toBe(false);
		});

		it('rejects a linkedin shortener (lnkd.in)', () => {
			const result = AeroleadsEndpointInputSchemas.getDetailsFromLinkedinUrl.safeParse({
				linkedin_url: 'https://lnkd.in/abc123',
			});
			expect(result.success).toBe(false);
		});

		it('rejects a non-URL string', () => {
			const result = AeroleadsEndpointInputSchemas.getDetailsFromLinkedinUrl.safeParse({
				linkedin_url: 'not-a-url',
			});
			expect(result.success).toBe(false);
		});
	});

	describe('getDetailsFromLinkedinUrl response schema', () => {
		it('parses a realistic full response', () => {
			const fixture = {
				first_name: 'Satya',
				last_name: 'Nadella',
				full_name: 'Satya Nadella',
				gender: 'male',
				address: 'Redmond, Washington',
				city: 'Redmond',
				country: 'United States',
				profile_picture_url: 'https://example.com/avatar.jpg',
				job_summary: 'Chairman and CEO at Microsoft',
				job_title_role: 'Chairman and CEO',
				job_title_level: 'cxo',
				job_company_name: 'Microsoft',
				job_company_website: 'microsoft.com',
				job_company_linkedin_url: 'https://www.linkedin.com/company/microsoft',
				job_company_size: '10000+',
				industry: 'Computer Software',
				emails: [{ email: 'satya@microsoft.com', status: '1.0' }],
				phone_numbers: [{ number: '+1-555-0100', type: 'mobile' }],
				skills: ['Leadership', 'Cloud Computing'],
				languages: ['English', 'Hindi'],
				experience: [{ title: 'CEO', company: 'Microsoft' }],
				education: [{ school: 'University of Wisconsin-Milwaukee' }],
				interests: ['Technology'],
				cb_rank: 'A+',
				db_logo_url: 'https://example.com/msft.png',
			};
			const result = AeroleadsEndpointOutputSchemas.getDetailsFromLinkedinUrl.safeParse(fixture);
			expect(result.success).toBe(true);
		});

		it('parses a minimal response (only required identity fields)', () => {
			const result = AeroleadsEndpointOutputSchemas.getDetailsFromLinkedinUrl.safeParse({
				linkedin_url: 'https://www.linkedin.com/in/some-user',
			});
			expect(result.success).toBe(true);
		});

		it('parses an empty object (provider returned nothing)', () => {
			const result = AeroleadsEndpointOutputSchemas.getDetailsFromLinkedinUrl.safeParse({});
			expect(result.success).toBe(true);
		});

		it('passes through unknown fields without failing (.loose)', () => {
			const result = AeroleadsEndpointOutputSchemas.getDetailsFromLinkedinUrl.safeParse({
				first_name: 'Satya',
				brand_new_field: 'value from a future API version',
			});
			expect(result.success).toBe(true);
		});

		it('parses emails with the expected { email, status? } shape', () => {
			const result = AeroleadsEndpointOutputSchemas.getDetailsFromLinkedinUrl.safeParse({
				emails: [
					{ email: 'a@example.com', status: '1.0' },
					{ email: 'b@example.com' }, // status omitted is allowed
				],
			});
			expect(result.success).toBe(true);
		});
	});
});
