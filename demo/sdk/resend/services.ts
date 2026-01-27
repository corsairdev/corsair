import type { CancelablePromise } from './core/CancelablePromise';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';
import type {
	CreateDomainArgs,
	CreateDomainResponse,
	DeleteDomainArgs,
	DeleteDomainResponse,
	GetDomainArgs,
	GetDomainResponse,
	GetEmailArgs,
	GetEmailResponse,
	ListDomainsArgs,
	ListDomainsResponse,
	ListEmailsArgs,
	ListEmailsResponse,
	SendEmailArgs,
	SendEmailResponse,
	VerifyDomainArgs,
	VerifyDomainResponse,
} from './models';

export class EmailsService {
	public static sendEmail(
		args: SendEmailArgs,
	): CancelablePromise<SendEmailResponse> {
		const { token, ...body } = args;
		const apiKey = token || OpenAPI.TOKEN || process.env.RESEND_API_KEY;

		if (!apiKey) {
			throw new Error(
				'Resend API key is required. Set RESEND_API_KEY or pass token parameter.',
			);
		}

		const originalToken = OpenAPI.TOKEN;
		OpenAPI.TOKEN = apiKey;

		try {
			return __request(OpenAPI, {
				method: 'POST',
				url: 'emails',
				body,
				mediaType: 'application/json; charset=utf-8',
			});
		} finally {
			OpenAPI.TOKEN = originalToken;
		}
	}

	public static getEmail(
		args: GetEmailArgs,
	): CancelablePromise<GetEmailResponse> {
		const { id, token } = args;
		const apiKey = token || OpenAPI.TOKEN || process.env.RESEND_API_KEY;

		if (!apiKey) {
			throw new Error(
				'Resend API key is required. Set RESEND_API_KEY or pass token parameter.',
			);
		}

		const originalToken = OpenAPI.TOKEN;
		OpenAPI.TOKEN = apiKey;

		try {
			return __request(OpenAPI, {
				method: 'GET',
				url: `emails/${id}`,
			});
		} finally {
			OpenAPI.TOKEN = originalToken;
		}
	}

	public static listEmails(
		args?: ListEmailsArgs,
	): CancelablePromise<ListEmailsResponse> {
		const { token, ...query } = args || {};
		const apiKey = token || OpenAPI.TOKEN || process.env.RESEND_API_KEY;

		if (!apiKey) {
			throw new Error(
				'Resend API key is required. Set RESEND_API_KEY or pass token parameter.',
			);
		}

		const originalToken = OpenAPI.TOKEN;
		OpenAPI.TOKEN = apiKey;

		try {
			return __request(OpenAPI, {
				method: 'GET',
				url: 'emails',
				query,
			});
		} finally {
			OpenAPI.TOKEN = originalToken;
		}
	}
}

export class DomainsService {
	public static createDomain(
		args: CreateDomainArgs,
	): CancelablePromise<CreateDomainResponse> {
		const { token, ...body } = args;
		const apiKey = token || OpenAPI.TOKEN || process.env.RESEND_API_KEY;

		if (!apiKey) {
			throw new Error(
				'Resend API key is required. Set RESEND_API_KEY or pass token parameter.',
			);
		}

		const originalToken = OpenAPI.TOKEN;
		OpenAPI.TOKEN = apiKey;

		try {
			return __request(OpenAPI, {
				method: 'POST',
				url: 'domains',
				body,
				mediaType: 'application/json; charset=utf-8',
			});
		} finally {
			OpenAPI.TOKEN = originalToken;
		}
	}

	public static getDomain(
		args: GetDomainArgs,
	): CancelablePromise<GetDomainResponse> {
		const { id, token } = args;
		const apiKey = token || OpenAPI.TOKEN || process.env.RESEND_API_KEY;

		if (!apiKey) {
			throw new Error(
				'Resend API key is required. Set RESEND_API_KEY or pass token parameter.',
			);
		}

		const originalToken = OpenAPI.TOKEN;
		OpenAPI.TOKEN = apiKey;

		try {
			return __request(OpenAPI, {
				method: 'GET',
				url: `domains/${id}`,
			});
		} finally {
			OpenAPI.TOKEN = originalToken;
		}
	}

	public static listDomains(
		args?: ListDomainsArgs,
	): CancelablePromise<ListDomainsResponse> {
		const { token, ...query } = args || {};
		const apiKey = token || OpenAPI.TOKEN || process.env.RESEND_API_KEY;

		if (!apiKey) {
			throw new Error(
				'Resend API key is required. Set RESEND_API_KEY or pass token parameter.',
			);
		}

		const originalToken = OpenAPI.TOKEN;
		OpenAPI.TOKEN = apiKey;

		try {
			return __request(OpenAPI, {
				method: 'GET',
				url: 'domains',
				query,
			});
		} finally {
			OpenAPI.TOKEN = originalToken;
		}
	}

	public static deleteDomain(
		args: DeleteDomainArgs,
	): CancelablePromise<DeleteDomainResponse> {
		const { id, token } = args;
		const apiKey = token || OpenAPI.TOKEN || process.env.RESEND_API_KEY;

		if (!apiKey) {
			throw new Error(
				'Resend API key is required. Set RESEND_API_KEY or pass token parameter.',
			);
		}

		const originalToken = OpenAPI.TOKEN;
		OpenAPI.TOKEN = apiKey;

		try {
			return __request(OpenAPI, {
				method: 'DELETE',
				url: `domains/${id}`,
			});
		} finally {
			OpenAPI.TOKEN = originalToken;
		}
	}

	public static verifyDomain(
		args: VerifyDomainArgs,
	): CancelablePromise<VerifyDomainResponse> {
		const { id, token } = args;
		const apiKey = token || OpenAPI.TOKEN || process.env.RESEND_API_KEY;

		if (!apiKey) {
			throw new Error(
				'Resend API key is required. Set RESEND_API_KEY or pass token parameter.',
			);
		}

		const originalToken = OpenAPI.TOKEN;
		OpenAPI.TOKEN = apiKey;

		try {
			return __request(OpenAPI, {
				method: 'POST',
				url: `domains/${id}/verify`,
			});
		} finally {
			OpenAPI.TOKEN = originalToken;
		}
	}
}
