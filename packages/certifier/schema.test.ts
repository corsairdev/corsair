import { CertifierSchema } from './schema';
import {
	CertifierAttribute,
	CertifierCredential,
	CertifierCredentialInteraction,
	CertifierDesign,
	CertifierEmailTemplate,
	CertifierGroup,
} from './schema/database';

const credential = {
	id: '01hz2f0c9ryvzajg20jqh9taab',
	publicId: '124a8110-1af5-4747-9308-e9d06bd1852a',
	groupId: '01g90279gp5sbmfek7wymcsvec',
	status: 'draft',
	recipient: {
		id: '01jmerb62apgachxwx6db76c7s',
		name: 'John Doe',
		email: 'john.doe@example.com',
	},
	issueDate: '2022-01-01',
	expiryDate: '2023-01-01',
	attributes: { 'recipient.name': 'John Doe' },
	customAttributes: { 'custom.mentor': 'Jane Doe' },
	createdAt: '2022-01-01T00:00:00.000Z',
	updatedAt: '2022-01-01T00:00:00.000Z',
};

describe('Certifier schema', () => {
	it('declares a semver version', () => {
		expect(CertifierSchema.version).toBeDefined();
		expect(CertifierSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official Certifier entities', () => {
		expect(Object.keys(CertifierSchema.entities).sort()).toEqual([
			'attributes',
			'credentialInteractions',
			'credentials',
			'designs',
			'emailTemplates',
			'groups',
		]);
	});

	it('accepts the documented credential payload', () => {
		expect(CertifierCredential.parse(credential)).toMatchObject({
			id: credential.id,
			status: 'draft',
			recipient: { email: 'john.doe@example.com' },
		});
	});

	it('accepts a documented design template', () => {
		expect(
			CertifierDesign.parse({
				id: '01g8znjvd9h0qbhxqwc6av0txn',
				name: 'Employee certificate',
				type: 'certificate',
				previewUrl:
					'https://cdn.certifier.io/911264ad-df05-4aeb-966f-96034b711c10/certificate-designs/previews/01k6dfeejfbwn273x2v2jqj4an-1759241517660.png',
				updatedAt: '2022-01-01T00:00:00.000Z',
			}).type,
		).toBe('certificate');
	});

	it('accepts a credential template with designIds', () => {
		expect(
			CertifierGroup.parse({
				id: '01g90279gp5sbmfek7wymcsvec',
				name: 'Product Training 2026',
				designIds: ['01g8znjvd9h0qbhxqwc6av0txn'],
				certificateDesignId: '01g8znjvd9h0qbhxqwc6av0txn',
				badgeDesignId: null,
			}).designIds,
		).toEqual(['01g8znjvd9h0qbhxqwc6av0txn']);
	});

	it('accepts a documented credential interaction', () => {
		expect(
			CertifierCredentialInteraction.parse({
				id: '01kaxvz40wp4tkbpmqbc1v9fmn',
				credentialId: '01kaete37s1vsa7azk7t0g4et7',
				eventType: 'credential_viewed',
				triggeredBy: 'recipient',
				triggeredAt: '2025-11-25T13:37:57.000Z',
			}).eventType,
		).toBe('credential_viewed');
	});

	it('accepts attribute and email template records', () => {
		expect(
			CertifierAttribute.parse({
				tag: 'recipient.name',
				name: 'Recipient name',
			}).tag,
		).toBe('recipient.name');
		expect(
			CertifierEmailTemplate.parse({ id: '01email', name: 'Default' }).id,
		).toBe('01email');
	});
});
