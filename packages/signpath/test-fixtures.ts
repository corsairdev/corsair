/**
 * Shapes taken from SignPath's OpenAPI document
 * (`https://app.signpath.io/Api/swagger/v1/swagger.json`), with values that
 * keep every documented field type honest: `false` where a field can be false,
 * `null` where the spec allows it.
 */

export const ORG_ID = 'c2099ac1-b4b5-4b30-934e-3933c2d9922d';

export const project = {
	name: 'My App',
	slug: 'my-app',
	description: null,
	status: 'Valid',
	signingPolicies: [
		{
			name: 'Release',
			slug: 'release',
			description: null,
			status: 'Valid',
		},
	],
};

export const projectDetail = {
	...project,
	repositoryUrls: ['https://github.com/acme/app'],
	artifactConfigurations: [
		{
			name: 'Default',
			slug: 'default',
			description: null,
			status: 'Valid',
			isDefault: true,
			artifactConfigurationXmlLink: `https://app.signpath.io/Api/v1/${ORG_ID}/Projects/my-app/ArtifactConfigurations/default/Xml`,
		},
	],
	signingPolicies: [
		{
			name: 'Release',
			slug: 'release-signed',
			description: null,
			status: 'Valid',
			submitters: [
				{
					id: '1a111111-1111-4111-8111-111111111111',
					name: 'CI',
					identity: null,
					type: 'CIUser',
					isDirectorySynchronized: false,
					link: 'https://app.signpath.io/Api/v1/link',
				},
			],
			approvers: [],
			numberOfRequiredApprovals: 0,
			purpose: 'ReleaseSigning',
			certificateLink: 'https://app.signpath.io/Api/v1/link',
			disableMalwareScanning: false,
			verifiesTrustedBuildSystem: false,
			verifiesOriginPolicy: false,
			pipelinePolicies: [],
		},
	],
	trustedBuildSystemLinks: [],
	readers: [],
	configurators: [],
};

export const signingPolicy = {
	name: 'Release',
	slug: 'release-signed',
	description: null,
	status: 'Valid',
	submitters: [
		{
			id: '1a111111-1111-4111-8111-111111111111',
			name: 'CI',
			identity: null,
			type: 'CIUser',
			isDirectorySynchronized: false,
			link: 'https://app.signpath.io/Api/v1/link',
		},
	],
	approvers: [],
	numberOfRequiredApprovals: 0,
	purpose: 'ReleaseSigning',
	certificateLink: 'https://app.signpath.io/Api/v1/link',
	disableMalwareScanning: false,
	verifiesTrustedBuildSystem: false,
	verifiesOriginPolicy: false,
	pipelinePolicies: [],
};

export const certificate = {
	certificateId: '3a333333-3333-4333-8333-333333333333',
	name: 'Code signing',
	slug: 'codesign',
	description: null,
	status: 'Valid',
	type: 'X509',
	purpose: 'ReleaseSigning',
	keyStoreId: 'AzureKeyVault',
	keyStoreKeyId: null,
	keyAlgorithm: 'Rsa3072',
	keyAlgorithmGroup: 'Rsa',
	x509CertificateData: {
		creationMethod: 'Csr',
		subjectName: 'CN=Acme GmbH',
		validFrom: '2026-01-01T00:00:00Z',
		validTo: '2027-01-01T00:00:00Z',
		subjectNameParts: {
			commonName: 'Acme GmbH',
			organization: 'Acme GmbH',
			organizationalUnit: null,
			countryCode: 'DE',
			stateOrProvince: null,
			locality: null,
			email: null,
		},
		x509CertificateLink: 'https://app.signpath.io/Api/v1/link',
		x509CertificateChainLink: null,
	},
	gpgKeyData: null,
};

export const signingRequest = {
	signingRequestId: '4a444444-4444-4444-8444-444444444444',
	status: 'Completed',
	workflowStatus: 'Completed',
	malwareScanningStatus: 'Completed',
	isFinalStatus: true,
	description: 'v1.2.0',
	projectId: '5a555555-5555-4555-8555-555555555555',
	projectSlug: 'my-app',
	projectName: 'My App',
	artifactConfigurationId: '6a666666-6666-4666-8666-666666666666',
	artifactConfigurationSlug: 'default',
	artifactConfigurationName: 'Default',
	signingPolicyId: '7a777777-7777-4777-8777-777777777777',
	signingPolicySlug: 'release',
	signingPolicyName: 'Release',
	unsignedArtifactLink: 'https://app.signpath.io/Api/v1/link',
	signedArtifactLink: 'https://app.signpath.io/Api/v1/link',
	origin: null,
	parameters: { productVersion: '1.2.0' },
	originalSigningRequestLink: null,
	artifactDescriptionXmlLink: 'https://app.signpath.io/Api/v1/link',
	cancellationTimeoutInSeconds: null,
	cancellationReason: null,
	webLink: 'https://app.signpath.io/Web/SigningRequests/44444444',
};

export const signingRequestListItem = {
	signingRequestId: '4a444444-4444-4444-8444-444444444444',
	status: 'Completed',
	projectId: '5a555555-5555-4555-8555-555555555555',
	projectSlug: 'my-app',
	projectName: 'My App',
	artifactConfigurationId: '6a666666-6666-4666-8666-666666666666',
	artifactConfigurationSlug: 'default',
	artifactConfigurationName: 'Default',
	signingPolicyId: '7a777777-7777-4777-8777-777777777777',
	signingPolicySlug: 'release',
	signingPolicyName: 'Release',
	certificateId: '3a333333-3333-4333-8333-333333333333',
	certificateSlug: 'codesign',
	certificateName: 'Code signing',
	submittedAt: '2026-02-01T10:00:00Z',
	submittedById: '1a111111-1111-4111-8111-111111111111',
	submittedByIdentity: null,
	submittedByName: 'CI',
	signingRequestDetailsLink: 'https://app.signpath.io/Api/v1/link',
	cancellationTimeoutInSeconds: null,
	cancellationReason: null,
};

export const signingRequestStatus = {
	signingRequestId: '4a444444-4444-4444-8444-444444444444',
	status: 'Completed',
	workflowStatus: 'Completed',
	isFinalStatus: true,
};

export const problemBody = {
	type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
	title: 'Bad Request',
	status: 400,
	detail: "Project 'my-app' already exists.",
	traceId: '00-abc-def-01',
};
