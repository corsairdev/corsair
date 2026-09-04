import {
	CertifierAttribute,
	CertifierCredential,
	CertifierCredentialInteraction,
	CertifierDesign,
	CertifierEmailTemplate,
	CertifierGroup,
} from './database';

export const CertifierSchema = {
	version: '1.0.0',
	entities: {
		attributes: CertifierAttribute,
		credentials: CertifierCredential,
		credentialInteractions: CertifierCredentialInteraction,
		designs: CertifierDesign,
		emailTemplates: CertifierEmailTemplate,
		groups: CertifierGroup,
	},
} as const;
