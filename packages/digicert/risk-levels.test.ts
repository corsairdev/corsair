import { digicert } from './index';

// Plugin rule R8: an operation that sends a message, spends money or credits, or
// can't be undone is destructive.
const DESTRUCTIVE = {
	// Place, renew or reissue a certificate order, or move account funds.
	spends: [
		'certcentralApi.addOrRemoveFunds',
		'certcentralApi.cancelUnitOrder',
		'certcentralApi.cancelVoucherCode',
		'certcentralApi.createUnitOrder',
		'certcentralApi.createVoucherOrder',
		'certcentralApi.orderAatlNaturalPersonCertificate',
		'certcentralApi.orderAatlNaturalPersonInOrganisationCertificate',
		'certcentralApi.orderAatlOrganizationEsealCertificate',
		'certcentralApi.orderBasicEvOrderBasicEv',
		'certcentralApi.orderBasicOv',
		'certcentralApi.orderClientCertificate',
		'certcentralApi.orderCodeSigningCertificate',
		'certcentralApi.orderCommonMarkCertificateCmc',
		'certcentralApi.orderDocumentSigningCertificate',
		'certcentralApi.orderDocumentSigningForEmployee',
		'certcentralApi.orderDocumentSigningForIndividual',
		'certcentralApi.orderDocumentSigningForOrganization',
		'certcentralApi.orderDvSsl',
		'certcentralApi.orderEuQualifiedESeal',
		'certcentralApi.orderEuQualifiedESealPsd2',
		'certcentralApi.orderEuQualifiedPersonal',
		'certcentralApi.orderEuQualifiedPersonalOrganisation',
		'certcentralApi.orderEuQualifiedWebsiteAuthenticationCertificate',
		'certcentralApi.orderEuQualifiedWebsiteAuthenticationPsd2Certificate',
		'certcentralApi.orderGeoTrustDvSsl',
		'certcentralApi.orderMultiYearPlanOrderMultiYearPlan',
		'certcentralApi.orderOvEvSslOrderOvEvSsl',
		'certcentralApi.orderPkioAuthenticationOrEncryptionCitizen',
		'certcentralApi.orderPkioAuthenticationOrEncryptionOrganisationPerson',
		'certcentralApi.orderPkioAuthenticationOrEncryptionOrganisationServices',
		'certcentralApi.orderPkioAuthenticationOrEncryptionPrivatePerson',
		'certcentralApi.orderPkioAuthenticationOrEncryptionPrivateProfessional',
		'certcentralApi.orderPkioAuthenticationOrEncryptionProfessional',
		'certcentralApi.orderPkioCitizenSigning',
		'certcentralApi.orderPkioPersonalOrganisationSigning',
		'certcentralApi.orderPkioPrivatePersonSigningOrderPkioPrivatePersonSigning',
		'certcentralApi.orderPkioPrivateProfessionalSigningOrderPkioPrivateProfessionalSigning',
		'certcentralApi.orderPkioPrivateServicesServer',
		'certcentralApi.orderPkioProfessionalSigning',
		'certcentralApi.orderPkioQualifiedESeal',
		'certcentralApi.orderPrivateSsl',
		'certcentralApi.orderSecureEmailCertificate',
		'certcentralApi.orderSecureSiteEv',
		'certcentralApi.orderSecureSiteOv',
		'certcentralApi.orderSecureSiteProEvSsl',
		'certcentralApi.orderSecureSiteProSsl',
		'certcentralApi.orderSecureSiteSslOrderSecureSiteSsl',
		'certcentralApi.orderSslTypeHint',
		'certcentralApi.orderSwissClientAuthenticationCertificate',
		'certcentralApi.orderSwissQualifiedCertificateForIndividual',
		'certcentralApi.orderSwissQualifiedCertificateForIndividualInOrganisation',
		'certcentralApi.orderSwissRegulatedCertificateForIndividual',
		'certcentralApi.orderSwissRegulatedCertificateForIndividualInOrganisation',
		'certcentralApi.orderSwissRegulatedCertificateForOrganisation',
		'certcentralApi.orderVerifiedMarkCertificateVmc',
		'certcentralApi.orderX9PkiForTls',
		'certcentralApi.purchaseKeyLockerSignatures',
		'certcentralApi.reissueCertificate',
		'certcentralApi.transferFunds',
		'certcentralApi.updateOrderStatus',
		'trustLifecycleApi.postRenewCertificate',
		'trustLifecycleApi.postRenewCertificateEnrollmentUsingCertificateId',
	],
	// Send an email or a one-time password to someone.
	sends: [
		'certcentralApi.dvSslResendEmails',
		'certcentralApi.emailCertificate',
		'certcentralApi.emailSiteSeal',
		'certcentralApi.resendCreateUserEmail',
		'certcentralApi.resendDcvEmail',
		'certcentralApi.resendInvite',
		'certcentralApi.resendOrderApprovalEmail',
		'certcentralApi.resendVerifiedContactDelegationEmail',
		'certcentralApi.sendInvite',
		'contentTrustApi.credentialSendOtp',
		'contentTrustApi.credentialSendOtp1',
		'contentTrustApi.resendEmail',
	],
	// Can't be undone.
	irreversible: [
		'contentTrustApi.cancelCredentialByName',
		'contentTrustApi.invalidateValidation',
	],
} as const;

describe('DigiCert risk levels', () => {
	const meta = digicert().endpointMeta;
	it.each(
		Object.entries(DESTRUCTIVE).flatMap(([kind, keys]) =>
			keys.map((key) => [key, kind] as const),
		),
	)('marks %s (%s) destructive', (key) => {
		expect(meta?.[key]?.riskLevel).toBe('destructive');
	});
});
