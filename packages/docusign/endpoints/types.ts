export interface CreateEnvelopeParams {
	templateId?: string;
	emailSubject: string;
	status: 'sent' | 'created';
	templateRoles?: Array<{
		email: string;
		name: string;
		roleName: string;
	}>;
}

export interface GetEnvelopeParams {
	envelopeId: string;
}

export interface ListTemplatesParams {
	count?: number;
	startPosition?: number;
}
