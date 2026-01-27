import {
	CreateDomainArgsSchema,
	GetDomainArgsSchema,
	GetEmailArgsSchema,
	ListDomainsArgsSchema,
	ListEmailsArgsSchema,
	SendEmailArgsSchema,
} from '../models';

describe('Resend Models - Zod Validation', () => {
	describe('SendEmailArgsSchema', () => {
		it('should validate valid email args', () => {
			const valid = {
				from: 'sender@example.com',
				to: 'recipient@example.com',
				subject: 'Test Subject',
				html: '<p>Test</p>',
			};

			const result = SendEmailArgsSchema.safeParse(valid);
			expect(result.success).toBe(true);
		});

		it('should validate email args with array of recipients', () => {
			const valid = {
				from: 'sender@example.com',
				to: ['recipient1@example.com', 'recipient2@example.com'],
				subject: 'Test Subject',
			};

			const result = SendEmailArgsSchema.safeParse(valid);
			expect(result.success).toBe(true);
		});

		it('should reject invalid email args', () => {
			const invalid = {
				from: 'sender@example.com',
				to: 'recipient@example.com',
				subject: 123,
			};

			const result = SendEmailArgsSchema.safeParse(invalid);
			expect(result.success).toBe(false);
		});

		it('should require from, to, and subject', () => {
			const invalid = {
				from: 'sender@example.com',
			};

			const result = SendEmailArgsSchema.safeParse(invalid);
			expect(result.success).toBe(false);
		});
	});

	describe('GetEmailArgsSchema', () => {
		it('should validate valid get email args', () => {
			const valid = {
				id: 'email-id-123',
			};

			const result = GetEmailArgsSchema.safeParse(valid);
			expect(result.success).toBe(true);
		});

		it('should require id', () => {
			const invalid = {};

			const result = GetEmailArgsSchema.safeParse(invalid);
			expect(result.success).toBe(false);
		});
	});

	describe('ListEmailsArgsSchema', () => {
		it('should validate valid list emails args', () => {
			const valid = {
				limit: 10,
				cursor: 'cursor-123',
			};

			const result = ListEmailsArgsSchema.safeParse(valid);
			expect(result.success).toBe(true);
		});

		it('should validate empty list emails args', () => {
			const valid = {};

			const result = ListEmailsArgsSchema.safeParse(valid);
			expect(result.success).toBe(true);
		});
	});

	describe('CreateDomainArgsSchema', () => {
		it('should validate valid create domain args', () => {
			const valid = {
				name: 'example.com',
				region: 'us-east-1',
			};

			const result = CreateDomainArgsSchema.safeParse(valid);
			expect(result.success).toBe(true);
		});

		it('should require name', () => {
			const invalid = {
				region: 'us-east-1',
			};

			const result = CreateDomainArgsSchema.safeParse(invalid);
			expect(result.success).toBe(false);
		});
	});

	describe('GetDomainArgsSchema', () => {
		it('should validate valid get domain args', () => {
			const valid = {
				id: 'domain-id-123',
			};

			const result = GetDomainArgsSchema.safeParse(valid);
			expect(result.success).toBe(true);
		});
	});

	describe('ListDomainsArgsSchema', () => {
		it('should validate valid list domains args', () => {
			const valid = {
				limit: 10,
			};

			const result = ListDomainsArgsSchema.safeParse(valid);
			expect(result.success).toBe(true);
		});
	});
});
