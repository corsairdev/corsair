export interface SendEmailResponse {
	id: string;
}

export interface Email {
	id: string;
	from: string;
	to: string[];
	created_at: string;
	subject?: string;
}

export interface GetEmailResponse extends Email {
	[key: string]: any;
}

export interface ListEmailsResponse {
	data: Email[];
}

export interface Domain {
	id: string;
	name: string;
	status: 'not_started' | 'validation' | 'scheduled' | 'ready' | 'error';
	created_at: string;
	region?: string;
}

export interface CreateDomainResponse extends Domain {
	[key: string]: any;
}

export interface GetDomainResponse extends Domain {
	[key: string]: any;
}

export interface ListDomainsResponse {
	data: Domain[];
}

export interface DeleteDomainResponse {
	id: string;
	object: string;
	deleted: boolean;
}

export interface VerifyDomainResponse extends Domain {
	[key: string]: any;
}

export type ResendEndpointOutputs = {
	emailsSend: SendEmailResponse;
	emailsGet: GetEmailResponse;
	emailsList: ListEmailsResponse;
	domainsCreate: CreateDomainResponse;
	domainsGet: GetDomainResponse;
	domainsList: ListDomainsResponse;
	domainsDelete: DeleteDomainResponse;
	domainsVerify: VerifyDomainResponse;
};
