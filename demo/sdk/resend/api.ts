import { DomainsService, EmailsService } from './services';

export const Resend = {
	Emails: {
		send: EmailsService.sendEmail,
		get: EmailsService.getEmail,
		list: EmailsService.listEmails,
	},
	Domains: {
		create: DomainsService.createDomain,
		get: DomainsService.getDomain,
		list: DomainsService.listDomains,
		delete: DomainsService.deleteDomain,
		verify: DomainsService.verifyDomain,
	},
};
