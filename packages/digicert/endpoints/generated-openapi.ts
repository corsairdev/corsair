import type { CorsairEndpoint } from 'corsair/core';
import type { z } from 'zod';
import type { DigicertContext } from '../index';
import { generatedOpenApiSchemasA } from './generated-openapi-schemas-a';
import { generatedOpenApiSchemasB } from './generated-openapi-schemas-b';
import type { OpenApiCallInput, OpenApiFamily } from './generated-runtime';
import { createOpenApiEndpoint } from './generated-runtime';

const generatedSchemas = {
	...generatedOpenApiSchemasA,
	...generatedOpenApiSchemasB,
};

export const generatedOpenApiEndpoints = {
	accountManagerApi: {
		listApiTokens: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/api-access-token',
			method: 'GET',
			operationId: 'accountManagerApi.listApiTokens',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_2db205955e7eInput,
			outputSchema: generatedSchemas.r_2db205955e7eOutput,
		}),
		createApiToken: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/api-access-token',
			method: 'POST',
			operationId: 'accountManagerApi.createApiToken',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_e8f57cffa958Input,
			outputSchema: generatedSchemas.r_e8f57cffa958Output,
		}),
		getApiTokenById: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/api-access-token/{id}',
			method: 'GET',
			operationId: 'accountManagerApi.getApiTokenById',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_4c5572cd02e5Input,
			outputSchema: generatedSchemas.r_4c5572cd02e5Output,
		}),
		updateApiToken: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/api-access-token/{id}',
			method: 'PUT',
			operationId: 'accountManagerApi.updateApiToken',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_601a73f00551Input,
			outputSchema: generatedSchemas.r_601a73f00551Output,
		}),
		deleteApiToken: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/api-access-token/{id}',
			method: 'DELETE',
			operationId: 'accountManagerApi.deleteApiToken',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_4ad10b0eab03Input,
			outputSchema: generatedSchemas.r_4ad10b0eab03Output,
		}),
		listAccounts: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/account',
			method: 'GET',
			operationId: 'accountManagerApi.listAccounts',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_0e428a8d097bInput,
			outputSchema: generatedSchemas.r_0e428a8d097bOutput,
		}),
		createAccount: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/account',
			method: 'POST',
			operationId: 'accountManagerApi.createAccount',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_1628177be371Input,
			outputSchema: generatedSchemas.r_1628177be371Output,
		}),
		getAccountDetails: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/account/{account_id}',
			method: 'GET',
			operationId: 'accountManagerApi.getAccountDetails',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_e9990a55db83Input,
			outputSchema: generatedSchemas.r_e9990a55db83Output,
		}),
		updateAccount: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/account/{account_id}',
			method: 'PUT',
			operationId: 'accountManagerApi.updateAccount',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_15fb6b740e87Input,
			outputSchema: generatedSchemas.r_15fb6b740e87Output,
		}),
		listAuditLogs: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/audit-log',
			method: 'GET',
			operationId: 'accountManagerApi.listAuditLogs',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_a85d7ecc25d2Input,
			outputSchema: generatedSchemas.r_a85d7ecc25d2Output,
		}),
		getClientAuthCertificatesByUserId: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/client-auth-certificate',
			method: 'GET',
			operationId: 'accountManagerApi.getClientAuthCertificatesByUserId',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_ee246cdb3f55Input,
			outputSchema: generatedSchemas.r_ee246cdb3f55Output,
		}),
		createClientAuthCertificate: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/client-auth-certificate',
			method: 'POST',
			operationId: 'accountManagerApi.createClientAuthCertificate',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_5f5cde1e7cc7Input,
			outputSchema: generatedSchemas.r_5f5cde1e7cc7Output,
		}),
		enableClientAuthCertificate: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/client-auth-certificate/{certificate_id}/enable',
			method: 'PUT',
			operationId: 'accountManagerApi.enableClientAuthCertificate',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_06d703452777Input,
			outputSchema: generatedSchemas.r_06d703452777Output,
		}),
		listOrganizations: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/organization',
			method: 'GET',
			operationId: 'accountManagerApi.listOrganizations',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_91d0541033a3Input,
			outputSchema: generatedSchemas.r_91d0541033a3Output,
		}),
		getOrganizationDetails: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/organization/{organization_id}',
			method: 'GET',
			operationId: 'accountManagerApi.getOrganizationDetails',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_c8653461a11eInput,
			outputSchema: generatedSchemas.r_c8653461a11eOutput,
		}),
		getUserDetails: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/user/{user_id}',
			method: 'GET',
			operationId: 'accountManagerApi.getUserDetails',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_f05dba0a427dInput,
			outputSchema: generatedSchemas.r_f05dba0a427dOutput,
		}),
		deleteUser: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/user/{user_id}',
			method: 'DELETE',
			operationId: 'accountManagerApi.deleteUser',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_b3e6d7c8268cInput,
			outputSchema: generatedSchemas.r_b3e6d7c8268cOutput,
		}),
		updateUser: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/user/{user_id}',
			method: 'PUT',
			operationId: 'accountManagerApi.updateUser',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_bcad0157f637Input,
			outputSchema: generatedSchemas.r_bcad0157f637Output,
		}),
		listSelectUsers: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/users',
			method: 'POST',
			operationId: 'accountManagerApi.listSelectUsers',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_fbfdfcedaba1Input,
			outputSchema: generatedSchemas.r_fbfdfcedaba1Output,
		}),
		listAllUsers: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/user',
			method: 'GET',
			operationId: 'accountManagerApi.listAllUsers',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_97a1d92f48f0Input,
			outputSchema: generatedSchemas.r_97a1d92f48f0Output,
		}),
		createUser: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/user',
			method: 'POST',
			operationId: 'accountManagerApi.createUser',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_40f39944750fInput,
			outputSchema: generatedSchemas.r_40f39944750fOutput,
		}),
		listUserRoles: createOpenApiEndpoint({
			family: 'accountManager',
			path: '/account/api/v1/role',
			method: 'GET',
			operationId: 'accountManagerApi.listUserRoles',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_b224a0eca017Input,
			outputSchema: generatedSchemas.r_b224a0eca017Output,
		}),
	},
	privateCAApi: {
		getGetAllCaCertificateAiaIssuerFiles: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/aia-issuer',
			method: 'GET',
			operationId: 'privateCAApi.getGetAllCaCertificateAiaIssuerFiles',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_d37ec173c239Input,
			outputSchema: generatedSchemas.r_d37ec173c239Output,
		}),
		postAddAnAiaIssuerFile: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/aia-issuer',
			method: 'POST',
			operationId: 'privateCAApi.postAddAnAiaIssuerFile',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_836448818f1bInput,
			outputSchema: generatedSchemas.r_836448818f1bOutput,
		}),
		getGetAnAiaIssuerFile: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/aia-issuer/{id}',
			method: 'GET',
			operationId: 'privateCAApi.getGetAnAiaIssuerFile',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_450b135c4c8bInput,
			outputSchema: generatedSchemas.r_450b135c4c8bOutput,
		}),
		getGetAnAiaIssuerFileBlob: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/aia-issuer/{id}/blob',
			method: 'GET',
			operationId: 'privateCAApi.getGetAnAiaIssuerFileBlob',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_a497c207ff38Input,
			outputSchema: generatedSchemas.r_a497c207ff38Output,
		}),
		putUpdateAnAiaIssuerFile: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/aia-issuer/{id}/blob',
			method: 'PUT',
			operationId: 'privateCAApi.putUpdateAnAiaIssuerFile',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_4413aec93603Input,
			outputSchema: generatedSchemas.r_4413aec93603Output,
		}),
		getCheckAnalyticsConfiguration: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/analytics',
			method: 'GET',
			operationId: 'privateCAApi.getCheckAnalyticsConfiguration',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_d2466ae03b22Input,
			outputSchema: generatedSchemas.r_d2466ae03b22Output,
		}),
		deleteDeleteSamlConfiguration: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/api/saml/config',
			method: 'DELETE',
			operationId: 'privateCAApi.deleteDeleteSamlConfiguration',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_7edc4cabae54Input,
			outputSchema: generatedSchemas.r_7edc4cabae54Output,
		}),
		getGetSamlConfiguration: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/api/saml/config',
			method: 'GET',
			operationId: 'privateCAApi.getGetSamlConfiguration',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_ca00d8bde2a5Input,
			outputSchema: generatedSchemas.r_ca00d8bde2a5Output,
		}),
		postCreateOrUpdateSamlConfiguration: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/api/saml/config',
			method: 'POST',
			operationId: 'privateCAApi.postCreateOrUpdateSamlConfiguration',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_5f4fc2d8f440Input,
			outputSchema: generatedSchemas.r_5f4fc2d8f440Output,
		}),
		postParseIdPMetadata: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/api/saml/metadata/parse',
			method: 'POST',
			operationId: 'privateCAApi.postParseIdPMetadata',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_30806dc12876Input,
			outputSchema: generatedSchemas.r_30806dc12876Output,
		}),
		getGetAuditLog: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/audit',
			method: 'GET',
			operationId: 'privateCAApi.getGetAuditLog',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_9cd2e581f2a1Input,
			outputSchema: generatedSchemas.r_9cd2e581f2a1Output,
		}),
		postAssertionConsumerService: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/auth/saml/acs',
			method: 'POST',
			operationId: 'privateCAApi.postAssertionConsumerService',
			mediaType: 'multipart/form-data',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_35f6309030acInput,
			outputSchema: generatedSchemas.r_35f6309030acOutput,
		}),
		getCheckIfSamlIsEnabled: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/auth/saml/enabled',
			method: 'GET',
			operationId: 'privateCAApi.getCheckIfSamlIsEnabled',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_6ab53e3e6059Input,
			outputSchema: generatedSchemas.r_6ab53e3e6059Output,
		}),
		getInitiateSamlLogin: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/auth/saml/login',
			method: 'GET',
			operationId: 'privateCAApi.getInitiateSamlLogin',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_a48e8840fc8cInput,
			outputSchema: generatedSchemas.r_a48e8840fc8cOutput,
		}),
		postInitiateLogout: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/auth/saml/logout',
			method: 'POST',
			operationId: 'privateCAApi.postInitiateLogout',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_9e9cfb59b47aInput,
			outputSchema: generatedSchemas.r_9e9cfb59b47aOutput,
		}),
		getGetSpMetadata: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/auth/saml/metadata',
			method: 'GET',
			operationId: 'privateCAApi.getGetSpMetadata',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_b4af3ae8430dInput,
			outputSchema: generatedSchemas.r_b4af3ae8430dOutput,
		}),
		postSingleLogoutService: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/auth/saml/slo',
			method: 'POST',
			operationId: 'privateCAApi.postSingleLogoutService',
			mediaType: 'multipart/form-data',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_2053c0b686d7Input,
			outputSchema: generatedSchemas.r_2053c0b686d7Output,
		}),
		getShowAllCas: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca',
			method: 'GET',
			operationId: 'privateCAApi.getShowAllCas',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_419129d1877aInput,
			outputSchema: generatedSchemas.r_419129d1877aOutput,
		}),
		postCreateACa: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca',
			method: 'POST',
			operationId: 'privateCAApi.postCreateACa',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_bb6316690c68Input,
			outputSchema: generatedSchemas.r_bb6316690c68Output,
		}),
		deleteDeletesAPendingSignCa: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}',
			method: 'DELETE',
			operationId: 'privateCAApi.deleteDeletesAPendingSignCa',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_6e1b2f5805e5Input,
			outputSchema: generatedSchemas.r_6e1b2f5805e5Output,
		}),
		getGetACa: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}',
			method: 'GET',
			operationId: 'privateCAApi.getGetACa',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_e2d08c123889Input,
			outputSchema: generatedSchemas.r_e2d08c123889Output,
		}),
		deleteDeleteCaAccounts: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/accounts',
			method: 'DELETE',
			operationId: 'privateCAApi.deleteDeleteCaAccounts',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_a4505158d331Input,
			outputSchema: generatedSchemas.r_a4505158d331Output,
		}),
		postAddCaAccounts: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/accounts',
			method: 'POST',
			operationId: 'privateCAApi.postAddCaAccounts',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_1d77ab47e7b6Input,
			outputSchema: generatedSchemas.r_1d77ab47e7b6Output,
		}),
		putSetCaAccounts: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/accounts',
			method: 'PUT',
			operationId: 'privateCAApi.putSetCaAccounts',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_ec4a0752b7d5Input,
			outputSchema: generatedSchemas.r_ec4a0752b7d5Output,
		}),
		putSetTheActiveAiaIssuerForACa: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/active-aia-issuer',
			method: 'PUT',
			operationId: 'privateCAApi.putSetTheActiveAiaIssuerForACa',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_a78f5194d416Input,
			outputSchema: generatedSchemas.r_a78f5194d416Output,
		}),
		putSetTheActiveCrlForACa: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/active-crl',
			method: 'PUT',
			operationId: 'privateCAApi.putSetTheActiveCrlForACa',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_22401761d689Input,
			outputSchema: generatedSchemas.r_22401761d689Output,
		}),
		postSetACaBlob: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/blob',
			method: 'POST',
			operationId: 'privateCAApi.postSetACaBlob',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_7fcf865bc7c5Input,
			outputSchema: generatedSchemas.r_7fcf865bc7c5Output,
		}),
		getGetCaAiaIssuerConfiguration: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/aia-issuer/issuance',
			method: 'GET',
			operationId: 'privateCAApi.getGetCaAiaIssuerConfiguration',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_aa5e92b5e9cdInput,
			outputSchema: generatedSchemas.r_aa5e92b5e9cdOutput,
		}),
		putSetCaAiaIssuerConfiguration: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/aia-issuer/issuance',
			method: 'PUT',
			operationId: 'privateCAApi.putSetCaAiaIssuerConfiguration',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_74dc2333e88bInput,
			outputSchema: generatedSchemas.r_74dc2333e88bOutput,
		}),
		getGetCaCertPoliciesConfiguration: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/cert-policies/issuance',
			method: 'GET',
			operationId: 'privateCAApi.getGetCaCertPoliciesConfiguration',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_f16d00fee5aeInput,
			outputSchema: generatedSchemas.r_f16d00fee5aeOutput,
		}),
		putSetCaCertPoliciesConfiguration: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/cert-policies/issuance',
			method: 'PUT',
			operationId: 'privateCAApi.putSetCaCertPoliciesConfiguration',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_86bed8b7c460Input,
			outputSchema: generatedSchemas.r_86bed8b7c460Output,
		}),
		putSetCaIssuanceCertConfig: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/cert/issuance',
			method: 'PUT',
			operationId: 'privateCAApi.putSetCaIssuanceCertConfig',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_2ff5d2e16aebInput,
			outputSchema: generatedSchemas.r_2ff5d2e16aebOutput,
		}),
		getGetCaCertificateChains: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/chain',
			method: 'GET',
			operationId: 'privateCAApi.getGetCaCertificateChains',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_dade4aa006edInput,
			outputSchema: generatedSchemas.r_dade4aa006edOutput,
		}),
		postAddACertificateChainToACa: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/chain',
			method: 'POST',
			operationId: 'privateCAApi.postAddACertificateChainToACa',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_15e6335cf9bcInput,
			outputSchema: generatedSchemas.r_15e6335cf9bcOutput,
		}),
		deleteDeleteACertificateChain: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/chain/{chainID}',
			method: 'DELETE',
			operationId: 'privateCAApi.deleteDeleteACertificateChain',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_ef0e548901a2Input,
			outputSchema: generatedSchemas.r_ef0e548901a2Output,
		}),
		getGetACertificateChain: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/chain/{chainID}',
			method: 'GET',
			operationId: 'privateCAApi.getGetACertificateChain',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_56ca5f9f8d8eInput,
			outputSchema: generatedSchemas.r_56ca5f9f8d8eOutput,
		}),
		putUpdateACertificateChain: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/chain/{chainID}',
			method: 'PUT',
			operationId: 'privateCAApi.putUpdateACertificateChain',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_3fb14506f402Input,
			outputSchema: generatedSchemas.r_3fb14506f402Output,
		}),
		putSetIncludeAllCertsInCrl: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/crl/include-all-certificates',
			method: 'PUT',
			operationId: 'privateCAApi.putSetIncludeAllCertsInCrl',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_f328ec91fc11Input,
			outputSchema: generatedSchemas.r_f328ec91fc11Output,
		}),
		getGetCaCrlIssuanceConfig: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/crl/issuance',
			method: 'GET',
			operationId: 'privateCAApi.getGetCaCrlIssuanceConfig',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_fbe03c239006Input,
			outputSchema: generatedSchemas.r_fbe03c239006Output,
		}),
		putSetCaCrlIssuanceConfig: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/crl/issuance',
			method: 'PUT',
			operationId: 'privateCAApi.putSetCaCrlIssuanceConfig',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_b532e61d0366Input,
			outputSchema: generatedSchemas.r_b532e61d0366Output,
		}),
		getGetCaOcspGenerationConfig: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/ocsp/generation',
			method: 'GET',
			operationId: 'privateCAApi.getGetCaOcspGenerationConfig',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_d4dfd7f5559cInput,
			outputSchema: generatedSchemas.r_d4dfd7f5559cOutput,
		}),
		putSetCaOcspGenerationConfig: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/ocsp/generation',
			method: 'PUT',
			operationId: 'privateCAApi.putSetCaOcspGenerationConfig',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_614145d2f693Input,
			outputSchema: generatedSchemas.r_614145d2f693Output,
		}),
		getGetCaOcspIssuanceConfig: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/ocsp/issuance',
			method: 'GET',
			operationId: 'privateCAApi.getGetCaOcspIssuanceConfig',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_efc423513ee6Input,
			outputSchema: generatedSchemas.r_efc423513ee6Output,
		}),
		putSetCaOcspIssuanceConfig: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/ocsp/issuance',
			method: 'PUT',
			operationId: 'privateCAApi.putSetCaOcspIssuanceConfig',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_ae80f0a2884cInput,
			outputSchema: generatedSchemas.r_ae80f0a2884cOutput,
		}),
		getGetCaOcspResponderConfig: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/ocsp/responder',
			method: 'GET',
			operationId: 'privateCAApi.getGetCaOcspResponderConfig',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_09525a87a3feInput,
			outputSchema: generatedSchemas.r_09525a87a3feOutput,
		}),
		putSetCaOcspResponderConfig: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/ocsp/responder',
			method: 'PUT',
			operationId: 'privateCAApi.putSetCaOcspResponderConfig',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_39f8c394d7dcInput,
			outputSchema: generatedSchemas.r_39f8c394d7dcOutput,
		}),
		putSetAdditionalSettings: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/settings',
			method: 'PUT',
			operationId: 'privateCAApi.putSetAdditionalSettings',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_56a0935ca4e1Input,
			outputSchema: generatedSchemas.r_56a0935ca4e1Output,
		}),
		getGetACaCsr: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/csr',
			method: 'GET',
			operationId: 'privateCAApi.getGetACaCsr',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_c1a00107ddd8Input,
			outputSchema: generatedSchemas.r_c1a00107ddd8Output,
		}),
		postDecryptAPkcs7: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/decrypt/pkcs7',
			method: 'POST',
			operationId: 'privateCAApi.postDecryptAPkcs7',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_f1ac9a204fdbInput,
			outputSchema: generatedSchemas.r_f1ac9a204fdbOutput,
		}),
		getDownloadACa: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/download',
			method: 'GET',
			operationId: 'privateCAApi.getDownloadACa',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			responseType: 'binary',
			inputSchema: generatedSchemas.r_91c5268bb884Input,
			outputSchema: generatedSchemas.r_91c5268bb884Output,
		}),
		postEncryptAPkcs7: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/encrypt/pkcs7',
			method: 'POST',
			operationId: 'privateCAApi.postEncryptAPkcs7',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_cf67da15ce78Input,
			outputSchema: generatedSchemas.r_cf67da15ce78Output,
		}),
		getGetTheRootCaHierarchy: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/hierarchy',
			method: 'GET',
			operationId: 'privateCAApi.getGetTheRootCaHierarchy',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_85b7ca4c4f50Input,
			outputSchema: generatedSchemas.r_85b7ca4c4f50Output,
		}),
		getGetCaNotes: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/note',
			method: 'GET',
			operationId: 'privateCAApi.getGetCaNotes',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_49bc49df9e00Input,
			outputSchema: generatedSchemas.r_49bc49df9e00Output,
		}),
		postCreateCaNote: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/note',
			method: 'POST',
			operationId: 'privateCAApi.postCreateCaNote',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_7ecf8015ce52Input,
			outputSchema: generatedSchemas.r_7ecf8015ce52Output,
		}),
		getGetCaOcspConfig: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/ocsp-config',
			method: 'GET',
			operationId: 'privateCAApi.getGetCaOcspConfig',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_c91c378818a5Input,
			outputSchema: generatedSchemas.r_c91c378818a5Output,
		}),
		postRecertifiesExistingCaByCaId: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/recertify-create-ca',
			method: 'POST',
			operationId: 'privateCAApi.postRecertifiesExistingCaByCaId',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_47971e5aadf2Input,
			outputSchema: generatedSchemas.r_47971e5aadf2Output,
		}),
		postRecertifiesACaWithANewImportedCertificate: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/recertify-import-ca',
			method: 'POST',
			operationId: 'privateCAApi.postRecertifiesACaWithANewImportedCertificate',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_81b7e6e852baInput,
			outputSchema: generatedSchemas.r_81b7e6e852baOutput,
		}),
		postCreateCaReinstateRequest: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/reinstate-request',
			method: 'POST',
			operationId: 'privateCAApi.postCreateCaReinstateRequest',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_4530bfcae9b5Input,
			outputSchema: generatedSchemas.r_4530bfcae9b5Output,
		}),
		getGetCaReinstateRequest: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/reinstate-request/{requestId}',
			method: 'GET',
			operationId: 'privateCAApi.getGetCaReinstateRequest',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_0bd21da7c4c2Input,
			outputSchema: generatedSchemas.r_0bd21da7c4c2Output,
		}),
		postApproveCaReinstateRequest: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/reinstate-request/{requestId}/approve',
			method: 'POST',
			operationId: 'privateCAApi.postApproveCaReinstateRequest',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_40ec0307a789Input,
			outputSchema: generatedSchemas.r_40ec0307a789Output,
		}),
		postRejectCaReinstateRequest: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/reinstate-request/{requestId}/reject',
			method: 'POST',
			operationId: 'privateCAApi.postRejectCaReinstateRequest',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_811c3aab6f1aInput,
			outputSchema: generatedSchemas.r_811c3aab6f1aOutput,
		}),
		postCreateCaRevokeRequest: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/revocation-request',
			method: 'POST',
			operationId: 'privateCAApi.postCreateCaRevokeRequest',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_d98516ab704fInput,
			outputSchema: generatedSchemas.r_d98516ab704fOutput,
		}),
		getGetCaRevokeRequest: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/revocation-request/{requestId}',
			method: 'GET',
			operationId: 'privateCAApi.getGetCaRevokeRequest',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_a4e740425499Input,
			outputSchema: generatedSchemas.r_a4e740425499Output,
		}),
		postApproveCaRevokeRequest: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/revocation-request/{requestId}/approve',
			method: 'POST',
			operationId: 'privateCAApi.postApproveCaRevokeRequest',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_08eb17056280Input,
			outputSchema: generatedSchemas.r_08eb17056280Output,
		}),
		postSignAnAttributeCertificate: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/sign/attribute-certificate',
			method: 'POST',
			operationId: 'privateCAApi.postSignAnAttributeCertificate',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_59ccb057dbe7Input,
			outputSchema: generatedSchemas.r_59ccb057dbe7Output,
		}),
		postSignACmpRequest: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/sign/cmp',
			method: 'POST',
			operationId: 'privateCAApi.postSignACmpRequest',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_1050c0a3587aInput,
			outputSchema: generatedSchemas.r_1050c0a3587aOutput,
		}),
		postSignAGlobalPlatformRequest: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/sign/global-platform',
			method: 'POST',
			operationId: 'privateCAApi.postSignAGlobalPlatformRequest',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_13f16d161bfeInput,
			outputSchema: generatedSchemas.r_13f16d161bfeOutput,
		}),
		getGetCaActiveStatus: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/status',
			method: 'GET',
			operationId: 'privateCAApi.getGetCaActiveStatus',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_bfe1b8b2129aInput,
			outputSchema: generatedSchemas.r_bfe1b8b2129aOutput,
		}),
		postSetCaActiveStatus: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/status',
			method: 'POST',
			operationId: 'privateCAApi.postSetCaActiveStatus',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_1028c694e4f8Input,
			outputSchema: generatedSchemas.r_1028c694e4f8Output,
		}),
		getGetCertificateExpiration: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/cert-expiration',
			method: 'GET',
			operationId: 'privateCAApi.getGetCertificateExpiration',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_79d35f25e203Input,
			outputSchema: generatedSchemas.r_79d35f25e203Output,
		}),
		getGetAllCertificates: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/certificate-discovery',
			method: 'GET',
			operationId: 'privateCAApi.getGetAllCertificates',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_adc5dc353665Input,
			outputSchema: generatedSchemas.r_adc5dc353665Output,
		}),
		postImportACa: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/import',
			method: 'POST',
			operationId: 'privateCAApi.postImportACa',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_2e0b14749b40Input,
			outputSchema: generatedSchemas.r_2e0b14749b40Output,
		}),
		postLinkACaKey: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/import/link-key',
			method: 'POST',
			operationId: 'privateCAApi.postLinkACaKey',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_bed51bae8a4dInput,
			outputSchema: generatedSchemas.r_bed51bae8a4dOutput,
		}),
		postImportAnOfflineCa: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/import/offline',
			method: 'POST',
			operationId: 'privateCAApi.postImportAnOfflineCa',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_9a3dba0916b3Input,
			outputSchema: generatedSchemas.r_9a3dba0916b3Output,
		}),
		postImportAThirdPartyCa: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/import/third-party',
			method: 'POST',
			operationId: 'privateCAApi.postImportAThirdPartyCa',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_39765268d88fInput,
			outputSchema: generatedSchemas.r_39765268d88fOutput,
		}),
		postCreateAPendingDelegatedOcspResponder: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/ocsp-responder/delegated/pending',
			method: 'POST',
			operationId: 'privateCAApi.postCreateAPendingDelegatedOcspResponder',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_96e6bdf242a9Input,
			outputSchema: generatedSchemas.r_96e6bdf242a9Output,
		}),
		getGetAllCertificates_a2d39d9: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/certificate',
			method: 'GET',
			operationId: 'privateCAApi.getGetAllCertificates_a2d39d9',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_672dcfb0f9e0Input,
			outputSchema: generatedSchemas.r_672dcfb0f9e0Output,
		}),
		postCreateCertificate: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/certificate',
			method: 'POST',
			operationId: 'privateCAApi.postCreateCertificate',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_62e5e3240f68Input,
			outputSchema: generatedSchemas.r_62e5e3240f68Output,
		}),
		getGetCertificate: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/certificate/{id}',
			method: 'GET',
			operationId: 'privateCAApi.getGetCertificate',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_652f18b2b4b6Input,
			outputSchema: generatedSchemas.r_652f18b2b4b6Output,
		}),
		getRecoverEscrowedEeKey: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/certificate/{id}/escrow/recover',
			method: 'GET',
			operationId: 'privateCAApi.getRecoverEscrowedEeKey',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_0c3e91de6873Input,
			outputSchema: generatedSchemas.r_0c3e91de6873Output,
		}),
		putRevokeCertificate: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/certificate/{id}/revocation',
			method: 'PUT',
			operationId: 'privateCAApi.putRevokeCertificate',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_80834d3f81b9Input,
			outputSchema: generatedSchemas.r_80834d3f81b9Output,
		}),
		getGetCsvListOfCertificates: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/certificate/download',
			method: 'GET',
			operationId: 'privateCAApi.getGetCsvListOfCertificates',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_a2ed911770eaInput,
			outputSchema: generatedSchemas.r_a2ed911770eaOutput,
		}),
		postImportACertificate: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/certificate/import',
			method: 'POST',
			operationId: 'privateCAApi.postImportACertificate',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_1343adaa2bdbInput,
			outputSchema: generatedSchemas.r_1343adaa2bdbOutput,
		}),
		getGetAllCrlInfos: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/crl',
			method: 'GET',
			operationId: 'privateCAApi.getGetAllCrlInfos',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_f55c3dc3abceInput,
			outputSchema: generatedSchemas.r_f55c3dc3abceOutput,
		}),
		postAddCrlInfos: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/crl',
			method: 'POST',
			operationId: 'privateCAApi.postAddCrlInfos',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_b4cfb481a98cInput,
			outputSchema: generatedSchemas.r_b4cfb481a98cOutput,
		}),
		getGetCrlInfo: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/crl/{id}',
			method: 'GET',
			operationId: 'privateCAApi.getGetCrlInfo',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_865bfb3a91f3Input,
			outputSchema: generatedSchemas.r_865bfb3a91f3Output,
		}),
		getGetCrlBlobList: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/crl/{id}/blobs',
			method: 'GET',
			operationId: 'privateCAApi.getGetCrlBlobList',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_4538e37bbe0dInput,
			outputSchema: generatedSchemas.r_4538e37bbe0dOutput,
		}),
		postImportCrlBlob: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/crl/{id}/blobs',
			method: 'POST',
			operationId: 'privateCAApi.postImportCrlBlob',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_90bc1797ca46Input,
			outputSchema: generatedSchemas.r_90bc1797ca46Output,
		}),
		getGetCrlBlob: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/crl/{id}/blobs/{crl_number}',
			method: 'GET',
			operationId: 'privateCAApi.getGetCrlBlob',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_bd131d63be89Input,
			outputSchema: generatedSchemas.r_bd131d63be89Output,
		}),
		getGetCrlConfig: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/crl/{id}/configuration',
			method: 'GET',
			operationId: 'privateCAApi.getGetCrlConfig',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_611f78545acbInput,
			outputSchema: generatedSchemas.r_611f78545acbOutput,
		}),
		putSetCrlConfig: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/crl/{id}/configuration',
			method: 'PUT',
			operationId: 'privateCAApi.putSetCrlConfig',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_f35b7c3e0b8aInput,
			outputSchema: generatedSchemas.r_f35b7c3e0b8aOutput,
		}),
		postCreateCrlNow: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/crl/{id}/create-now',
			method: 'POST',
			operationId: 'privateCAApi.postCreateCrlNow',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_7dc5f63f47d9Input,
			outputSchema: generatedSchemas.r_7dc5f63f47d9Output,
		}),
		postImportAClientKey: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/escrow/client-key-import',
			method: 'POST',
			operationId: 'privateCAApi.postImportAClientKey',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_471f260d6e40Input,
			outputSchema: generatedSchemas.r_471f260d6e40Output,
		}),
		getGetFedRampComplianceEvidence: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/fedramp/evidence',
			method: 'GET',
			operationId: 'privateCAApi.getGetFedRampComplianceEvidence',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_514ed64de87dInput,
			outputSchema: generatedSchemas.r_514ed64de87dOutput,
		}),
		getGetHsmPartitions: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/hsm/partition',
			method: 'GET',
			operationId: 'privateCAApi.getGetHsmPartitions',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_860e43c6a58aInput,
			outputSchema: generatedSchemas.r_860e43c6a58aOutput,
		}),
		postCreateAnOcspResponder: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ocsp-responder',
			method: 'POST',
			operationId: 'privateCAApi.postCreateAnOcspResponder',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_07af58d0eb37Input,
			outputSchema: generatedSchemas.r_07af58d0eb37Output,
		}),
		getGetAnOcspResponder: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ocsp-responder/{id}',
			method: 'GET',
			operationId: 'privateCAApi.getGetAnOcspResponder',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_aaa0dcb230feInput,
			outputSchema: generatedSchemas.r_aaa0dcb230feOutput,
		}),
		putSetAnOcspResponderStatus: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ocsp-responder/{id}/{action}',
			method: 'PUT',
			operationId: 'privateCAApi.putSetAnOcspResponderStatus',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_aee3d7f5a977Input,
			outputSchema: generatedSchemas.r_aee3d7f5a977Output,
		}),
		putSetAnOcspBlob: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ocsp-responder/{id}/blob',
			method: 'PUT',
			operationId: 'privateCAApi.putSetAnOcspBlob',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_6ea9c4afe524Input,
			outputSchema: generatedSchemas.r_6ea9c4afe524Output,
		}),
		getDownloadAnOcspResponderCsr: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ocsp-responder/{id}/csr',
			method: 'GET',
			operationId: 'privateCAApi.getDownloadAnOcspResponderCsr',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_c70a8bd812d1Input,
			outputSchema: generatedSchemas.r_c70a8bd812d1Output,
		}),
		postImportAnOcspResponder: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ocsp-responder/import',
			method: 'POST',
			operationId: 'privateCAApi.postImportAnOcspResponder',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_8c26364ba4e1Input,
			outputSchema: generatedSchemas.r_8c26364ba4e1Output,
		}),
		postCreateAPendingOcspResponder: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ocsp-responder/pending',
			method: 'POST',
			operationId: 'privateCAApi.postCreateAPendingOcspResponder',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_8fc8acf59dceInput,
			outputSchema: generatedSchemas.r_8fc8acf59dceOutput,
		}),
		getGetAllOcspResponders: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ocsp-responders',
			method: 'GET',
			operationId: 'privateCAApi.getGetAllOcspResponders',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_e6f593872eaaInput,
			outputSchema: generatedSchemas.r_e6f593872eaaOutput,
		}),
		getHandleScepGetOperations: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/scep/{profileID}',
			method: 'GET',
			operationId: 'privateCAApi.getHandleScepGetOperations',
			mediaType: undefined,
			public: true,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_8368e7d73f61Input,
			outputSchema: generatedSchemas.r_8368e7d73f61Output,
		}),
		postHandleScepPkiOperation: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/scep/{profileID}',
			method: 'POST',
			operationId: 'privateCAApi.postHandleScepPkiOperation',
			mediaType: 'application/x-pki-message',
			public: false,
			oauth2Allowed: false,
			responseType: 'binary',
			inputSchema: generatedSchemas.r_61fda20c9ab6Input,
			outputSchema: generatedSchemas.r_61fda20c9ab6Output,
		}),
		getGetCertificateTemplates: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template',
			method: 'GET',
			operationId: 'privateCAApi.getGetCertificateTemplates',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_39c28941d620Input,
			outputSchema: generatedSchemas.r_39c28941d620Output,
		}),
		postCreateACustomCertificateTemplate: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template',
			method: 'POST',
			operationId: 'privateCAApi.postCreateACustomCertificateTemplate',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_14f3953c0d38Input,
			outputSchema: generatedSchemas.r_14f3953c0d38Output,
		}),
		getGetACertificateTemplate: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template/{id}',
			method: 'GET',
			operationId: 'privateCAApi.getGetACertificateTemplate',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_2a9e994a5917Input,
			outputSchema: generatedSchemas.r_2a9e994a5917Output,
		}),
		putUpdateACustomCertificateTemplate: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template/{id}',
			method: 'PUT',
			operationId: 'privateCAApi.putUpdateACustomCertificateTemplate',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_e631ae341675Input,
			outputSchema: generatedSchemas.r_e631ae341675Output,
		}),
		getGetAAccountsCertificateTemplateIsAssignedTo: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template/{id}/accounts',
			method: 'GET',
			operationId:
				'privateCAApi.getGetAAccountsCertificateTemplateIsAssignedTo',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_f46d472400ecInput,
			outputSchema: generatedSchemas.r_f46d472400ecOutput,
		}),
		putActivateACustomCertificateTemplate: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template/{id}/activate',
			method: 'PUT',
			operationId: 'privateCAApi.putActivateACustomCertificateTemplate',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_198e7a38a10cInput,
			outputSchema: generatedSchemas.r_198e7a38a10cOutput,
		}),
		putDeactivateACustomCertificateTemplate: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template/{id}/deactivate',
			method: 'PUT',
			operationId: 'privateCAApi.putDeactivateACustomCertificateTemplate',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_3de0b5e30515Input,
			outputSchema: generatedSchemas.r_3de0b5e30515Output,
		}),
		postVerifyAsn1Template: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template/asn1/verify',
			method: 'POST',
			operationId: 'privateCAApi.postVerifyAsn1Template',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_7784c95351dfInput,
			outputSchema: generatedSchemas.r_7784c95351dfOutput,
		}),
		getGetCertificateTemplateValidationSchemas: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template/config',
			method: 'GET',
			operationId: 'privateCAApi.getGetCertificateTemplateValidationSchemas',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_908be7c77f53Input,
			outputSchema: generatedSchemas.r_908be7c77f53Output,
		}),
		getGetCertificateTemplateValidationSchemas_4fe4fdb: createOpenApiEndpoint({
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template/schema',
			method: 'GET',
			operationId:
				'privateCAApi.getGetCertificateTemplateValidationSchemas_4fe4fdb',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_5ba49344c30fInput,
			outputSchema: generatedSchemas.r_5ba49344c30fOutput,
		}),
	},
	trustLifecycleApi: {
		recreateAcmecredentialsPublic: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/acme-credentials/recreate',
			method: 'POST',
			operationId: 'trustLifecycleApi.recreateAcmecredentialsPublic',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_2eeb27b0266eInput,
			outputSchema: generatedSchemas.r_2eeb27b0266eOutput,
		}),
		addSystemScanUsingPostpublic: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/scan/add',
			method: 'POST',
			operationId: 'trustLifecycleApi.addSystemScanUsingPostpublic',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_145c99f05651Input,
			outputSchema: generatedSchemas.r_145c99f05651Output,
		}),
		abortSystemScanUsingPostpublic: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/scan/{agentId}/abort',
			method: 'POST',
			operationId: 'trustLifecycleApi.abortSystemScanUsingPostpublic',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_99ffa6002270Input,
			outputSchema: generatedSchemas.r_99ffa6002270Output,
		}),
		suspendSystemScanUsingPostpublic: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/scan/suspend',
			method: 'POST',
			operationId: 'trustLifecycleApi.suspendSystemScanUsingPostpublic',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_ed3ac2b880e3Input,
			outputSchema: generatedSchemas.r_ed3ac2b880e3Output,
		}),
		resumeSystemScanUsingPostpublic: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/scan/resume',
			method: 'POST',
			operationId: 'trustLifecycleApi.resumeSystemScanUsingPostpublic',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_214735411dd4Input,
			outputSchema: generatedSchemas.r_214735411dd4Output,
		}),
		skipFutureSystemScanScheduleUsingPostpublic: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/scan/{agentId}/skip/{time}',
			method: 'POST',
			operationId:
				'trustLifecycleApi.skipFutureSystemScanScheduleUsingPostpublic',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_98ae93786afeInput,
			outputSchema: generatedSchemas.r_98ae93786afeOutput,
		}),
		restoreSystemScanScheduleUsingPostpublic: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/scan/{agentId}/restore/{time}',
			method: 'POST',
			operationId: 'trustLifecycleApi.restoreSystemScanScheduleUsingPostpublic',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_b907984f070bInput,
			outputSchema: generatedSchemas.r_b907984f070bOutput,
		}),
		deletePastSystemScanUsingPostpublic: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/scan/{agentId}/deletePastScan/{scanId}',
			method: 'POST',
			operationId: 'trustLifecycleApi.deletePastSystemScanUsingPostpublic',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_1e4c8b4f1269Input,
			outputSchema: generatedSchemas.r_1e4c8b4f1269Output,
		}),
		listUpcomingSystemScansUsingGetpublic: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/scan/{id}/upcoming-scans',
			method: 'GET',
			operationId: 'trustLifecycleApi.listUpcomingSystemScansUsingGetpublic',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_73d4daf6bd17Input,
			outputSchema: generatedSchemas.r_73d4daf6bd17Output,
		}),
		listPastSystemScansUsingGetpublic: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/scan/{id}/past-scans',
			method: 'GET',
			operationId: 'trustLifecycleApi.listPastSystemScansUsingGetpublic',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_a4a835e15a4fInput,
			outputSchema: generatedSchemas.r_a4a835e15a4fOutput,
		}),
		getListAgents: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent',
			method: 'GET',
			operationId: 'trustLifecycleApi.getListAgents',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_b1de500e018cInput,
			outputSchema: generatedSchemas.r_b1de500e018cOutput,
		}),
		getGetAgentById: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/{id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetAgentById',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_b5bd22f27e1dInput,
			outputSchema: generatedSchemas.r_b5bd22f27e1dOutput,
		}),
		updateCertDeliveryLocationForAgentPostpublic: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/cert-delivery/update',
			method: 'POST',
			operationId:
				'trustLifecycleApi.updateCertDeliveryLocationForAgentPostpublic',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_308eb2d1df1cInput,
			outputSchema: generatedSchemas.r_308eb2d1df1cOutput,
		}),
		putApproveAgents: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/approve',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putApproveAgents',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_920a440ee1dfInput,
			outputSchema: generatedSchemas.r_920a440ee1dfOutput,
		}),
		putVoidAgents: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/void',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putVoidAgents',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_0b702b08d456Input,
			outputSchema: generatedSchemas.r_0b702b08d456Output,
		}),
		putUpdateAgent: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/update',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putUpdateAgent',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_5e7f03054b55Input,
			outputSchema: generatedSchemas.r_5e7f03054b55Output,
		}),
		putRetryAgentConfig: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/retry',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putRetryAgentConfig',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_5c203004de20Input,
			outputSchema: generatedSchemas.r_5c203004de20Output,
		}),
		postPostAgentSuggestions: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/suggestions',
			method: 'POST',
			operationId: 'trustLifecycleApi.postPostAgentSuggestions',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_97fb243f7243Input,
			outputSchema: generatedSchemas.r_97fb243f7243Output,
		}),
		getListAgentScripts: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/script',
			method: 'GET',
			operationId: 'trustLifecycleApi.getListAgentScripts',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_1664e1d5afc5Input,
			outputSchema: generatedSchemas.r_1664e1d5afc5Output,
		}),
		postPostAgentScript: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/script',
			method: 'POST',
			operationId: 'trustLifecycleApi.postPostAgentScript',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_99797a8dc240Input,
			outputSchema: generatedSchemas.r_99797a8dc240Output,
		}),
		getGetAgentScriptById: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/script/{id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetAgentScriptById',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_b4f767ee3a21Input,
			outputSchema: generatedSchemas.r_b4f767ee3a21Output,
		}),
		putUpdateAgentScript: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/script/{id}',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putUpdateAgentScript',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_92967c73d90eInput,
			outputSchema: generatedSchemas.r_92967c73d90eOutput,
		}),
		postAddAgentScriptsInBulk: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/script/bulk',
			method: 'POST',
			operationId: 'trustLifecycleApi.postAddAgentScriptsInBulk',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_28403eaf35f7Input,
			outputSchema: generatedSchemas.r_28403eaf35f7Output,
		}),
		putSuspendAgents: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/suspend',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putSuspendAgents',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_692763a58cdaInput,
			outputSchema: generatedSchemas.r_692763a58cdaOutput,
		}),
		putRejectAgents: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/reject',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putRejectAgents',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_14cebde31ad8Input,
			outputSchema: generatedSchemas.r_14cebde31ad8Output,
		}),
		putReinstateAgents: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/reinstate',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putReinstateAgents',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_6873b02914f1Input,
			outputSchema: generatedSchemas.r_6873b02914f1Output,
		}),
		getGetGlobalAgentSettings: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/settings',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetGlobalAgentSettings',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_cd67d7ceb107Input,
			outputSchema: generatedSchemas.r_cd67d7ceb107Output,
		}),
		putUpdateGlobalAgentSettings: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/settings',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putUpdateGlobalAgentSettings',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_2b409ddd1947Input,
			outputSchema: generatedSchemas.r_2b409ddd1947Output,
		}),
		postCreateGlobalAgentSettings: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/settings',
			method: 'POST',
			operationId: 'trustLifecycleApi.postCreateGlobalAgentSettings',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_f8e988a67b87Input,
			outputSchema: generatedSchemas.r_f8e988a67b87Output,
		}),
		createAutomationUsingPost: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation',
			method: 'POST',
			operationId: 'trustLifecycleApi.createAutomationUsingPost',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_90ec560047bdInput,
			outputSchema: generatedSchemas.r_90ec560047bdOutput,
		}),
		createAwrAutomationUsingPost: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation/admin-web-request',
			method: 'POST',
			operationId: 'trustLifecycleApi.createAwrAutomationUsingPost',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_e3b44e3e638bInput,
			outputSchema: generatedSchemas.r_e3b44e3e638bOutput,
		}),
		checkEligibilityOfBulkAutomationUsingPost: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation/bulk/check-eligibility',
			method: 'POST',
			operationId:
				'trustLifecycleApi.checkEligibilityOfBulkAutomationUsingPost',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_4470d3e39ef2Input,
			outputSchema: generatedSchemas.r_4470d3e39ef2Output,
		}),
		requestBulkAutomationUsingPost: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation/bulk',
			method: 'POST',
			operationId: 'trustLifecycleApi.requestBulkAutomationUsingPost',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_c0eb04e32216Input,
			outputSchema: generatedSchemas.r_c0eb04e32216Output,
		}),
		getAutomationDetailsUsingGet: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation/{automation_id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getAutomationDetailsUsingGet',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_710554dcec90Input,
			outputSchema: generatedSchemas.r_710554dcec90Output,
		}),
		updateAutomationUsingPut: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation/{automation_id}',
			method: 'PUT',
			operationId: 'trustLifecycleApi.updateAutomationUsingPut',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_bcabad219d28Input,
			outputSchema: generatedSchemas.r_bcabad219d28Output,
		}),
		retryAutomationUsingPut: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation/retry/{automation_id}',
			method: 'PUT',
			operationId: 'trustLifecycleApi.retryAutomationUsingPut',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_fdcddee44a8eInput,
			outputSchema: generatedSchemas.r_fdcddee44a8eOutput,
		}),
		cancelAutomationUsingPut: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation/cancel/{automation_id}',
			method: 'PUT',
			operationId: 'trustLifecycleApi.cancelAutomationUsingPut',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_f993fc71dd6cInput,
			outputSchema: generatedSchemas.r_f993fc71dd6cOutput,
		}),
		listAutomationInventory: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation-inventory/unsecured',
			method: 'GET',
			operationId: 'trustLifecycleApi.listAutomationInventory',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_948c3283fb77Input,
			outputSchema: generatedSchemas.r_948c3283fb77Output,
		}),
		getInventoryDetailsUsingGet: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation-inventory/{automation_id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getInventoryDetailsUsingGet',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_ef7eddd600a0Input,
			outputSchema: generatedSchemas.r_ef7eddd600a0Output,
		}),
		getListBusinessUnit: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/business-unit',
			method: 'GET',
			operationId: 'trustLifecycleApi.getListBusinessUnit',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_382f226cdcf4Input,
			outputSchema: generatedSchemas.r_382f226cdcf4Output,
		}),
		postCreateBusinessUnit: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/business-unit',
			method: 'POST',
			operationId: 'trustLifecycleApi.postCreateBusinessUnit',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_5bec67c21dcfInput,
			outputSchema: generatedSchemas.r_5bec67c21dcfOutput,
		}),
		getGetBusinessUnitById: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/business-unit/{bu_id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetBusinessUnitById',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_162c051d7b24Input,
			outputSchema: generatedSchemas.r_162c051d7b24Output,
		}),
		deleteDeleteBusinessUnit: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/business-unit/{bu_id}',
			method: 'DELETE',
			operationId: 'trustLifecycleApi.deleteDeleteBusinessUnit',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_38929d3c5c45Input,
			outputSchema: generatedSchemas.r_38929d3c5c45Output,
		}),
		putUpdateBusinessUnitLicense: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/business-unit/{bu_id}/licensed-seats',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putUpdateBusinessUnitLicense',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_e130670d7f5aInput,
			outputSchema: generatedSchemas.r_e130670d7f5aOutput,
		}),
		putAssignAnAdminToABusinessUnit: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/business-unit/{id}/admin',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putAssignAnAdminToABusinessUnit',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_59f4fecff54aInput,
			outputSchema: generatedSchemas.r_59f4fecff54aOutput,
		}),
		deleteRemoveAnAdminFromABusinessUnit: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/business-unit/{id}/admin/{adminId}',
			method: 'DELETE',
			operationId: 'trustLifecycleApi.deleteRemoveAnAdminFromABusinessUnit',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_78c077df3817Input,
			outputSchema: generatedSchemas.r_78c077df3817Output,
		}),
		getListCertificateOwners: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-owners',
			method: 'GET',
			operationId: 'trustLifecycleApi.getListCertificateOwners',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_23c269effbe6Input,
			outputSchema: generatedSchemas.r_23c269effbe6Output,
		}),
		postCreateCertificateOwners: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-owners',
			method: 'POST',
			operationId: 'trustLifecycleApi.postCreateCertificateOwners',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_e254ce295d12Input,
			outputSchema: generatedSchemas.r_e254ce295d12Output,
		}),
		getGetCertificateOwnerById: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-owners/{id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetCertificateOwnerById',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_589d79d3192eInput,
			outputSchema: generatedSchemas.r_589d79d3192eOutput,
		}),
		putUpdateCertificateOwnerDetailsForAGivenCertificateOwnerId:
			createOpenApiEndpoint({
				family: 'trustLifecycle',
				path: '/mpki/api/v1/certificate-owners/{id}',
				method: 'PUT',
				operationId:
					'trustLifecycleApi.putUpdateCertificateOwnerDetailsForAGivenCertificateOwnerId',
				mediaType: 'application/json',
				public: false,
				oauth2Allowed: false,
				inputSchema: generatedSchemas.r_c0711fd42515Input,
				outputSchema: generatedSchemas.r_c0711fd42515Output,
			}),
		deleteDeleteCertificateOwner: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-owners/{id}',
			method: 'DELETE',
			operationId: 'trustLifecycleApi.deleteDeleteCertificateOwner',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_9f6fcd99fd97Input,
			outputSchema: generatedSchemas.r_9f6fcd99fd97Output,
		}),
		putAddCertificateOwnersMappingForCertificate: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-owners/certificate/{id}',
			method: 'PUT',
			operationId:
				'trustLifecycleApi.putAddCertificateOwnersMappingForCertificate',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_08c5118e8629Input,
			outputSchema: generatedSchemas.r_08c5118e8629Output,
		}),
		deleteDeleteCertificateOwnerMappingsForACertificate: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-owners/certificate/{id}',
			method: 'DELETE',
			operationId:
				'trustLifecycleApi.deleteDeleteCertificateOwnerMappingsForACertificate',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_a4a3093d5297Input,
			outputSchema: generatedSchemas.r_a4a3093d5297Output,
		}),
		postIssueCertificate: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate',
			method: 'POST',
			operationId: 'trustLifecycleApi.postIssueCertificate',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_4ea70ee9ce09Input,
			outputSchema: generatedSchemas.r_4ea70ee9ce09Output,
		}),
		postPickUpCertificate: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-pickup/{request_id}',
			method: 'POST',
			operationId: 'trustLifecycleApi.postPickUpCertificate',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_aba4f70417deInput,
			outputSchema: generatedSchemas.r_aba4f70417deOutput,
		}),
		postApproveEscrowedCertificateRecovery: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/escrow/approve/{serial_number}',
			method: 'POST',
			operationId: 'trustLifecycleApi.postApproveEscrowedCertificateRecovery',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_ef37eb3829e2Input,
			outputSchema: generatedSchemas.r_ef37eb3829e2Output,
		}),
		postRenewCertificate: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/{serial_number}/renew',
			method: 'POST',
			operationId: 'trustLifecycleApi.postRenewCertificate',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_b8f4fd999e91Input,
			outputSchema: generatedSchemas.r_b8f4fd999e91Output,
		}),
		postBulkUpdateTags: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/tag/bulk-add',
			method: 'POST',
			operationId: 'trustLifecycleApi.postBulkUpdateTags',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_c6787b39d482Input,
			outputSchema: generatedSchemas.r_c6787b39d482Output,
		}),
		postBulkReplaceTags: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/tag/bulk-replace',
			method: 'POST',
			operationId: 'trustLifecycleApi.postBulkReplaceTags',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_15baf5205f5fInput,
			outputSchema: generatedSchemas.r_15baf5205f5fOutput,
		}),
		postImportCertificate: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-import',
			method: 'POST',
			operationId: 'trustLifecycleApi.postImportCertificate',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_795aa866d75eInput,
			outputSchema: generatedSchemas.r_795aa866d75eOutput,
		}),
		getSearchCertificates: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-search',
			method: 'GET',
			operationId: 'trustLifecycleApi.getSearchCertificates',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_cd0ce04fc2f9Input,
			outputSchema: generatedSchemas.r_cd0ce04fc2f9Output,
		}),
		publicCertificateSearchSummary: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-search/summary',
			method: 'GET',
			operationId: 'trustLifecycleApi.publicCertificateSearchSummary',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_47b5ee161d58Input,
			outputSchema: generatedSchemas.r_47b5ee161d58Output,
		}),
		publicGetCertUsingId: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-search/{certificate_id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.publicGetCertUsingId',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_cb5f6a5e8c6eInput,
			outputSchema: generatedSchemas.r_cb5f6a5e8c6eOutput,
		}),
		getGetCertificateBySerialNumber: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/{serial_number}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetCertificateBySerialNumber',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_c1e6841c6826Input,
			outputSchema: generatedSchemas.r_c1e6841c6826Output,
		}),
		postRecoverEscrowedCertificateBySerialNumber: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/escrow/recover/{serial_number}',
			method: 'POST',
			operationId:
				'trustLifecycleApi.postRecoverEscrowedCertificateBySerialNumber',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_b85de13db956Input,
			outputSchema: generatedSchemas.r_b85de13db956Output,
		}),
		certRevokeBySerial: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/{serial_number}/revoke',
			method: 'PUT',
			operationId: 'trustLifecycleApi.certRevokeBySerial',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_d7ae6dc4292dInput,
			outputSchema: generatedSchemas.r_d7ae6dc4292dOutput,
		}),
		deleteResumeSuspendedCertificate: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/{serial_number}/revoke',
			method: 'DELETE',
			operationId: 'trustLifecycleApi.deleteResumeSuspendedCertificate',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_32308d9d0956Input,
			outputSchema: generatedSchemas.r_32308d9d0956Output,
		}),
		getAdditionalFormatsBySerialNumber: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/{serial_number}/additional-formats',
			method: 'GET',
			operationId: 'trustLifecycleApi.getAdditionalFormatsBySerialNumber',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_e81b68e657ccInput,
			outputSchema: generatedSchemas.r_e81b68e657ccOutput,
		}),
		publicCountCertificateMigrationCandidates: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/migration-candidates/count',
			method: 'GET',
			operationId:
				'trustLifecycleApi.publicCountCertificateMigrationCandidates',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_00aaa42b68c2Input,
			outputSchema: generatedSchemas.r_00aaa42b68c2Output,
		}),
		publicGetCertificateMigrationCandidates: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/migration-candidates',
			method: 'GET',
			operationId: 'trustLifecycleApi.publicGetCertificateMigrationCandidates',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_a09ad9571231Input,
			outputSchema: generatedSchemas.r_a09ad9571231Output,
		}),
		createUsingPost1: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors',
			method: 'POST',
			operationId: 'trustLifecycleApi.createUsingPost1',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_565bb358f1fcInput,
			outputSchema: generatedSchemas.r_565bb358f1fcOutput,
		}),
		listByAccountUsingPost: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/search',
			method: 'POST',
			operationId: 'trustLifecycleApi.listByAccountUsingPost',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_c4f2ebc60dafInput,
			outputSchema: generatedSchemas.r_c4f2ebc60dafOutput,
		}),
		suggestionsUsingGet: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/suggestions/{field}',
			method: 'GET',
			operationId: 'trustLifecycleApi.suggestionsUsingGet',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_cac1d643fd7dInput,
			outputSchema: generatedSchemas.r_cac1d643fd7dOutput,
		}),
		getDetailsByIdUsingGet: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/{connector_id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getDetailsByIdUsingGet',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_9fdfa9ff199aInput,
			outputSchema: generatedSchemas.r_9fdfa9ff199aOutput,
		}),
		updateUsingPut1: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/{connector_id}',
			method: 'PUT',
			operationId: 'trustLifecycleApi.updateUsingPut1',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_6ae814861232Input,
			outputSchema: generatedSchemas.r_6ae814861232Output,
		}),
		deleteByIdUsingDelete: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/{connector_id}',
			method: 'DELETE',
			operationId: 'trustLifecycleApi.deleteByIdUsingDelete',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_ddbe3acdfffaInput,
			outputSchema: generatedSchemas.r_ddbe3acdfffaOutput,
		}),
		runNowUsingPost: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/{connector_id}/run-now',
			method: 'POST',
			operationId: 'trustLifecycleApi.runNowUsingPost',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_cd2034a0a43dInput,
			outputSchema: generatedSchemas.r_cd2034a0a43dOutput,
		}),
		stopUsingPost: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/{connector_id}/stop',
			method: 'POST',
			operationId: 'trustLifecycleApi.stopUsingPost',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_e97c7e325ac0Input,
			outputSchema: generatedSchemas.r_e97c7e325ac0Output,
		}),
		testConnectionUsingPost: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/{connector_id}/test',
			method: 'POST',
			operationId: 'trustLifecycleApi.testConnectionUsingPost',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_3ae1daaeb731Input,
			outputSchema: generatedSchemas.r_3ae1daaeb731Output,
		}),
		unlinkUsingPost: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/{connector_id}/unlink',
			method: 'POST',
			operationId: 'trustLifecycleApi.unlinkUsingPost',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_c594c0e3a8d1Input,
			outputSchema: generatedSchemas.r_c594c0e3a8d1Output,
		}),
		getConnectorMetadataUsingGet: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/{connector_id}/metadata',
			method: 'GET',
			operationId: 'trustLifecycleApi.getConnectorMetadataUsingGet',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_2b39cff6b19aInput,
			outputSchema: generatedSchemas.r_2b39cff6b19aOutput,
		}),
		getListCustomAttributes: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/custom-attributes',
			method: 'GET',
			operationId: 'trustLifecycleApi.getListCustomAttributes',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_13488561d95dInput,
			outputSchema: generatedSchemas.r_13488561d95dOutput,
		}),
		postCreateCustomAttribute: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/custom-attributes',
			method: 'POST',
			operationId: 'trustLifecycleApi.postCreateCustomAttribute',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_0d465a62c1baInput,
			outputSchema: generatedSchemas.r_0d465a62c1baOutput,
		}),
		getListCustomAttributesForCertificate: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/custom-attributes/certificate/{id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getListCustomAttributesForCertificate',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_ffd3d18f94d9Input,
			outputSchema: generatedSchemas.r_ffd3d18f94d9Output,
		}),
		putAddCustomAttributesMappingForCertificate: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/custom-attributes/certificate/{id}',
			method: 'PUT',
			operationId:
				'trustLifecycleApi.putAddCustomAttributesMappingForCertificate',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_9c0ee24ba5a8Input,
			outputSchema: generatedSchemas.r_9c0ee24ba5a8Output,
		}),
		deleteDeleteCustomAttributesMappingForCertificate: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/custom-attributes/certificate/{id}',
			method: 'DELETE',
			operationId:
				'trustLifecycleApi.deleteDeleteCustomAttributesMappingForCertificate',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_7593ade75363Input,
			outputSchema: generatedSchemas.r_7593ade75363Output,
		}),
		getGetCustomAttributeById: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/custom-attributes/{id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetCustomAttributeById',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_38b65a4ff043Input,
			outputSchema: generatedSchemas.r_38b65a4ff043Output,
		}),
		putUpdateCustomAttribute: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/custom-attributes/{id}',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putUpdateCustomAttribute',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_aa2372f83a2eInput,
			outputSchema: generatedSchemas.r_aa2372f83a2eOutput,
		}),
		deleteDeleteCustomAttribute: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/custom-attributes/{id}',
			method: 'DELETE',
			operationId: 'trustLifecycleApi.deleteDeleteCustomAttribute',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_d11c9f59c2deInput,
			outputSchema: generatedSchemas.r_d11c9f59c2deOutput,
		}),
		getCertificateCountsBySourceTypes: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/delete/inventory',
			method: 'POST',
			operationId: 'trustLifecycleApi.getCertificateCountsBySourceTypes',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_f31cdd16607bInput,
			outputSchema: generatedSchemas.r_f31cdd16607bOutput,
		}),
		deleteCertificatesBySourceTypes: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/delete/inventory',
			method: 'DELETE',
			operationId: 'trustLifecycleApi.deleteCertificatesBySourceTypes',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_413eadd6d21dInput,
			outputSchema: generatedSchemas.r_413eadd6d21dOutput,
		}),
		getListDevices: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory',
			method: 'GET',
			operationId: 'trustLifecycleApi.getListDevices',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_90e92b7da5a3Input,
			outputSchema: generatedSchemas.r_90e92b7da5a3Output,
		}),
		postAddDevices: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory',
			method: 'POST',
			operationId: 'trustLifecycleApi.postAddDevices',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_a1438d4fc523Input,
			outputSchema: generatedSchemas.r_a1438d4fc523Output,
		}),
		deleteDeleteDevicesBulk: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory',
			method: 'DELETE',
			operationId: 'trustLifecycleApi.deleteDeleteDevicesBulk',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_e0d550d921c4Input,
			outputSchema: generatedSchemas.r_e0d550d921c4Output,
		}),
		getGetDevice: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory/{id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetDevice',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_db452f94fae3Input,
			outputSchema: generatedSchemas.r_db452f94fae3Output,
		}),
		putUpdateDevice: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory/{id}',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putUpdateDevice',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_38524550bc70Input,
			outputSchema: generatedSchemas.r_38524550bc70Output,
		}),
		deleteDeleteDevice: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory/{id}',
			method: 'DELETE',
			operationId: 'trustLifecycleApi.deleteDeleteDevice',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_01008ef1501aInput,
			outputSchema: generatedSchemas.r_01008ef1501aOutput,
		}),
		postImportDevicesFromCsv: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory/import',
			method: 'POST',
			operationId: 'trustLifecycleApi.postImportDevicesFromCsv',
			mediaType: 'multipart/form-data',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_6ac8994ec3c4Input,
			outputSchema: generatedSchemas.r_6ac8994ec3c4Output,
		}),
		getExportDevicesToCsv: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory/export',
			method: 'GET',
			operationId: 'trustLifecycleApi.getExportDevicesToCsv',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_2ff73ca5e82fInput,
			outputSchema: generatedSchemas.r_2ff73ca5e82fOutput,
		}),
		putLinkDevicesToAProfile: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory/profile/{profileId}/associate',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putLinkDevicesToAProfile',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_371fd4d4a326Input,
			outputSchema: generatedSchemas.r_371fd4d4a326Output,
		}),
		putUnlinkDevicesFromAProfile: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory/profile/{profileId}/disassociate',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putUnlinkDevicesFromAProfile',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_27064376ccadInput,
			outputSchema: generatedSchemas.r_27064376ccadOutput,
		}),
		putBulkMapDevicesToProfiles: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory/profile-mappings',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putBulkMapDevicesToProfiles',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_b106e7869ed7Input,
			outputSchema: generatedSchemas.r_b106e7869ed7Output,
		}),
		deleteBulkUnmapDevicesFromProfiles: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory/profile-mappings',
			method: 'DELETE',
			operationId: 'trustLifecycleApi.deleteBulkUnmapDevicesFromProfiles',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_67f447c0dbdcInput,
			outputSchema: generatedSchemas.r_67f447c0dbdcOutput,
		}),
		getUnsecured: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/inventory/endpoint/unsecured',
			method: 'GET',
			operationId: 'trustLifecycleApi.getUnsecured',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_21affda0f31fInput,
			outputSchema: generatedSchemas.r_21affda0f31fOutput,
		}),
		getUnsecuredCount: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/inventory/endpoint/unsecured/count',
			method: 'GET',
			operationId: 'trustLifecycleApi.getUnsecuredCount',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_99aba927208cInput,
			outputSchema: generatedSchemas.r_99aba927208cOutput,
		}),
		getPortletCount: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/inventory/endpoint/portlet/count',
			method: 'GET',
			operationId: 'trustLifecycleApi.getPortletCount',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_427ad84ed835Input,
			outputSchema: generatedSchemas.r_427ad84ed835Output,
		}),
		getAutomatableEndpoint: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/inventory/endpoint/automatable',
			method: 'GET',
			operationId: 'trustLifecycleApi.getAutomatableEndpoint',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_832902848134Input,
			outputSchema: generatedSchemas.r_832902848134Output,
		}),
		getAutomatableCount: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/inventory/endpoint/automatable/count',
			method: 'GET',
			operationId: 'trustLifecycleApi.getAutomatableCount',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_ae14a0cad4edInput,
			outputSchema: generatedSchemas.r_ae14a0cad4edOutput,
		}),
		getInventoryDetails: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/inventory/endpoint/{id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getInventoryDetails',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_a7822a6bdea6Input,
			outputSchema: generatedSchemas.r_a7822a6bdea6Output,
		}),
		getDiscoveredEndpoints: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/inventory/endpoint/discovered',
			method: 'GET',
			operationId: 'trustLifecycleApi.getDiscoveredEndpoints',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_659d2b8e8aceInput,
			outputSchema: generatedSchemas.r_659d2b8e8aceOutput,
		}),
		getDiscoveredEndpointsCount: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/inventory/endpoint/discovered/count',
			method: 'GET',
			operationId: 'trustLifecycleApi.getDiscoveredEndpointsCount',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_4a9d25a10305Input,
			outputSchema: generatedSchemas.r_4a9d25a10305Output,
		}),
		getInstancesList: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/inventory/endpoint/list/instances',
			method: 'GET',
			operationId: 'trustLifecycleApi.getInstancesList',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_eaa4afa67b1cInput,
			outputSchema: generatedSchemas.r_eaa4afa67b1cOutput,
		}),
		postCreateEnrollment: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/enrollment',
			method: 'POST',
			operationId: 'trustLifecycleApi.postCreateEnrollment',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_889a59dc528aInput,
			outputSchema: generatedSchemas.r_889a59dc528aOutput,
		}),
		postRedeemEnrollment: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/enrollment/redeem',
			method: 'POST',
			operationId: 'trustLifecycleApi.postRedeemEnrollment',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_604d6ac29079Input,
			outputSchema: generatedSchemas.r_604d6ac29079Output,
		}),
		putUpdateStatusOfManualApprovalEnrollment: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/enrollment/{enrollment_id}/status',
			method: 'PUT',
			operationId:
				'trustLifecycleApi.putUpdateStatusOfManualApprovalEnrollment',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_6d7a2c7d5b92Input,
			outputSchema: generatedSchemas.r_6d7a2c7d5b92Output,
		}),
		getGetEnrollmentDetailsByEnrollmentCode: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/enrollment/{enrollment_code}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetEnrollmentDetailsByEnrollmentCode',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_c1244e33b2b4Input,
			outputSchema: generatedSchemas.r_c1244e33b2b4Output,
		}),
		getListEnrollments: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/enrollment-details',
			method: 'GET',
			operationId: 'trustLifecycleApi.getListEnrollments',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_fa40e5e88461Input,
			outputSchema: generatedSchemas.r_fa40e5e88461Output,
		}),
		getGetEnrollmentDetailsById: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/enrollment-details/{enrollment_id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetEnrollmentDetailsById',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_4ef7dea657b7Input,
			outputSchema: generatedSchemas.r_4ef7dea657b7Output,
		}),
		postCreateEnrollmentForManualApproval: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/manual-enrollment',
			method: 'POST',
			operationId: 'trustLifecycleApi.postCreateEnrollmentForManualApproval',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_2edfe1f4b869Input,
			outputSchema: generatedSchemas.r_2edfe1f4b869Output,
		}),
		getAttributesOfRenewableCertificateUsingCertIdUsingGet:
			createOpenApiEndpoint({
				family: 'trustLifecycle',
				path: '/mpki/api/v1/enrollment/certificate/{certificate_id}',
				method: 'GET',
				operationId:
					'trustLifecycleApi.getAttributesOfRenewableCertificateUsingCertIdUsingGet',
				mediaType: undefined,
				public: false,
				oauth2Allowed: false,
				inputSchema: generatedSchemas.r_2b49885a43e5Input,
				outputSchema: generatedSchemas.r_2b49885a43e5Output,
			}),
		postRenewCertificateEnrollmentUsingCertificateId: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/manual-enrollment/renew/{certificate_id}',
			method: 'POST',
			operationId:
				'trustLifecycleApi.postRenewCertificateEnrollmentUsingCertificateId',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_a730dc9722bbInput,
			outputSchema: generatedSchemas.r_a730dc9722bbOutput,
		}),
		handleGetCaCertsOperationUsingGet: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/.well-known/est/TLM-{profileId}/cacerts',
			method: 'GET',
			operationId: 'trustLifecycleApi.handleGetCaCertsOperationUsingGet',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			responseType: 'binary',
			inputSchema: generatedSchemas.r_a38f059e2a70Input,
			outputSchema: generatedSchemas.r_a38f059e2a70Output,
		}),
		handleSimpleEnrollOperationUsingPost: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/.well-known/est/TLM-{profileId}/simpleenroll',
			method: 'POST',
			operationId: 'trustLifecycleApi.handleSimpleEnrollOperationUsingPost',
			mediaType: 'application/pkcs10',
			public: false,
			oauth2Allowed: false,
			responseType: 'binary',
			inputSchema: generatedSchemas.r_aa991ba230c3Input,
			outputSchema: generatedSchemas.r_aa991ba230c3Output,
		}),
		handleSimpleReEnrollOperationUsingPost: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/.well-known/est/TLM-{profileId}/simplereenroll',
			method: 'POST',
			operationId: 'trustLifecycleApi.handleSimpleReEnrollOperationUsingPost',
			mediaType: 'application/pkcs10',
			public: false,
			oauth2Allowed: false,
			responseType: 'binary',
			inputSchema: generatedSchemas.r_af7ddf1c733dInput,
			outputSchema: generatedSchemas.r_af7ddf1c733dOutput,
		}),
		listSensorIntegrations: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/integration',
			method: 'GET',
			operationId: 'trustLifecycleApi.listSensorIntegrations',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_e827e3bec28aInput,
			outputSchema: generatedSchemas.r_e827e3bec28aOutput,
		}),
		createSensorIntegration: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/integration',
			method: 'POST',
			operationId: 'trustLifecycleApi.createSensorIntegration',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_fe3221ef0855Input,
			outputSchema: generatedSchemas.r_fe3221ef0855Output,
		}),
		getSensorIntegrationById: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/integration/{integration_id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getSensorIntegrationById',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_cf48324a6d66Input,
			outputSchema: generatedSchemas.r_cf48324a6d66Output,
		}),
		refreshSensorIntegration: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/integration/refresh',
			method: 'POST',
			operationId: 'trustLifecycleApi.refreshSensorIntegration',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_31f08184b392Input,
			outputSchema: generatedSchemas.r_31f08184b392Output,
		}),
		getGetListOfDnsIntegrations: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/integration/dv',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetListOfDnsIntegrations',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_5f0c91e25af4Input,
			outputSchema: generatedSchemas.r_5f0c91e25af4Output,
		}),
		postBulkVoid: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/integration/void',
			method: 'POST',
			operationId: 'trustLifecycleApi.postBulkVoid',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_090e1558aef3Input,
			outputSchema: generatedSchemas.r_090e1558aef3Output,
		}),
		postVoidById: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/integration/{integration_id}/void',
			method: 'POST',
			operationId: 'trustLifecycleApi.postVoidById',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_a12209ad174fInput,
			outputSchema: generatedSchemas.r_a12209ad174fOutput,
		}),
		getSensorIntegrationAppParameters: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/integration/applications/{application_name}/parameters',
			method: 'GET',
			operationId: 'trustLifecycleApi.getSensorIntegrationAppParameters',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_a7f9ba1b6636Input,
			outputSchema: generatedSchemas.r_a7f9ba1b6636Output,
		}),
		postCreateANewProfile: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/profile',
			method: 'POST',
			operationId: 'trustLifecycleApi.postCreateANewProfile',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_cd234014f0ffInput,
			outputSchema: generatedSchemas.r_cd234014f0ffOutput,
		}),
		putUpdateProfile: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/profile/{profile_id}',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putUpdateProfile',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_9a2ea6339160Input,
			outputSchema: generatedSchemas.r_9a2ea6339160Output,
		}),
		getListProfiles: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v2/profile',
			method: 'GET',
			operationId: 'trustLifecycleApi.getListProfiles',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_b31cfc3255d8Input,
			outputSchema: generatedSchemas.r_b31cfc3255d8Output,
		}),
		getGetProfileById: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v2/profile/{profile_id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetProfileById',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_9cd9f0927b03Input,
			outputSchema: generatedSchemas.r_9cd9f0927b03Output,
		}),
		getListProfiles_a46d97c: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v3/profile',
			method: 'GET',
			operationId: 'trustLifecycleApi.getListProfiles_a46d97c',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_87c7a8fcf2c3Input,
			outputSchema: generatedSchemas.r_87c7a8fcf2c3Output,
		}),
		getGetProfileById_2316fef: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v3/profile/{profile_id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetProfileById_2316fef',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_beff76538781Input,
			outputSchema: generatedSchemas.r_beff76538781Output,
		}),
		getGetEnrollmentCodeReport: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/report/enrollment-code',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetEnrollmentCodeReport',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_ddb85158bd5dInput,
			outputSchema: generatedSchemas.r_ddb85158bd5dOutput,
		}),
		getListAuditLogs: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/audit-log',
			method: 'GET',
			operationId: 'trustLifecycleApi.getListAuditLogs',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_8544e8ac7f57Input,
			outputSchema: generatedSchemas.r_8544e8ac7f57Output,
		}),
		getGetAuditLogEventById: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/audit-log/{event_id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetAuditLogEventById',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_fb0b80993f03Input,
			outputSchema: generatedSchemas.r_fb0b80993f03Output,
		}),
		getGetAuditLogCount: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/audit-log/count',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetAuditLogCount',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_f27878dd7018Input,
			outputSchema: generatedSchemas.r_f27878dd7018Output,
		}),
		getListRules: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/rule',
			method: 'GET',
			operationId: 'trustLifecycleApi.getListRules',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_10c05d173009Input,
			outputSchema: generatedSchemas.r_10c05d173009Output,
		}),
		postCreateRule: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/rule',
			method: 'POST',
			operationId: 'trustLifecycleApi.postCreateRule',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_936d50859847Input,
			outputSchema: generatedSchemas.r_936d50859847Output,
		}),
		deleteDeleteRules: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/rule',
			method: 'DELETE',
			operationId: 'trustLifecycleApi.deleteDeleteRules',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_fba0a11d0af9Input,
			outputSchema: generatedSchemas.r_fba0a11d0af9Output,
		}),
		getGetRuleById: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/rule/{id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetRuleById',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_39fd79124781Input,
			outputSchema: generatedSchemas.r_39fd79124781Output,
		}),
		putUpdateRule: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/rule/{id}',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putUpdateRule',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_d1a0900ac1cdInput,
			outputSchema: generatedSchemas.r_d1a0900ac1cdOutput,
		}),
		postRunRuleNow: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/rule/run/{ruleId}',
			method: 'POST',
			operationId: 'trustLifecycleApi.postRunRuleNow',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_2c4418daa501Input,
			outputSchema: generatedSchemas.r_2c4418daa501Output,
		}),
		listOfScansUsingGet: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/scan',
			method: 'GET',
			operationId: 'trustLifecycleApi.listOfScansUsingGet',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_716491633306Input,
			outputSchema: generatedSchemas.r_716491633306Output,
		}),
		addScanUsingPost: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/scan/add',
			method: 'POST',
			operationId: 'trustLifecycleApi.addScanUsingPost',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_f41e8938ed63Input,
			outputSchema: generatedSchemas.r_f41e8938ed63Output,
		}),
		deleteScanUsingPost: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/scan/delete',
			method: 'POST',
			operationId: 'trustLifecycleApi.deleteScanUsingPost',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_3cab39f7decfInput,
			outputSchema: generatedSchemas.r_3cab39f7decfOutput,
		}),
		editScanUsingPut: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/scan/edit',
			method: 'PUT',
			operationId: 'trustLifecycleApi.editScanUsingPut',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_0d8b21f3f0fcInput,
			outputSchema: generatedSchemas.r_0d8b21f3f0fcOutput,
		}),
		getDetailsUsingGet1: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/scan/{scan_id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getDetailsUsingGet1',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_dc1a10c2c3a6Input,
			outputSchema: generatedSchemas.r_dc1a10c2c3a6Output,
		}),
		abortScanUsingPost: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/scan/{scan_id}/abort',
			method: 'POST',
			operationId: 'trustLifecycleApi.abortScanUsingPost',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_38f57b41183dInput,
			outputSchema: generatedSchemas.r_38f57b41183dOutput,
		}),
		publicListPastScansUsingGet: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/scan/{id}/past-scans',
			method: 'GET',
			operationId: 'trustLifecycleApi.publicListPastScansUsingGet',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_3b605dc8977cInput,
			outputSchema: generatedSchemas.r_3b605dc8977cOutput,
		}),
		validateIpFqdnsPost: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/scan/validate-ip-fqdns',
			method: 'POST',
			operationId: 'trustLifecycleApi.validateIpFqdnsPost',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_10508ac747cdInput,
			outputSchema: generatedSchemas.r_10508ac747cdOutput,
		}),
		checkScanExistPost: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/scan/exists',
			method: 'POST',
			operationId: 'trustLifecycleApi.checkScanExistPost',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_feb002186f05Input,
			outputSchema: generatedSchemas.r_feb002186f05Output,
		}),
		getGetListOfSeats: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/seat',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetListOfSeats',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_523236c02350Input,
			outputSchema: generatedSchemas.r_523236c02350Output,
		}),
		postCreateSeat: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/seat',
			method: 'POST',
			operationId: 'trustLifecycleApi.postCreateSeat',
			mediaType: 'application/json;charset=utf-8',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_495ebdedb32bInput,
			outputSchema: generatedSchemas.r_495ebdedb32bOutput,
		}),
		getGetSeatByIdentifier: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/seat/{seat_id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetSeatByIdentifier',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_0d6230796736Input,
			outputSchema: generatedSchemas.r_0d6230796736Output,
		}),
		putUpdateSeat: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/seat/{seat_id}',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putUpdateSeat',
			mediaType: 'application/json;charset=utf-8',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_5c95b7617096Input,
			outputSchema: generatedSchemas.r_5c95b7617096Output,
		}),
		deleteDeleteSeat: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/seat/{seat_id}',
			method: 'DELETE',
			operationId: 'trustLifecycleApi.deleteDeleteSeat',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_50f5dbf5b576Input,
			outputSchema: generatedSchemas.r_50f5dbf5b576Output,
		}),
		putAssignSeatToAnotherBusinessUnit: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/seat/{seat_id}/business-unit/{new_business_unit_id}',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putAssignSeatToAnotherBusinessUnit',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_acd12ea8b342Input,
			outputSchema: generatedSchemas.r_acd12ea8b342Output,
		}),
		getGetAvailableSeatTypes: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/seat-types',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetAvailableSeatTypes',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_26265e7690c1Input,
			outputSchema: generatedSchemas.r_26265e7690c1Output,
		}),
		listSensors: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/sensor',
			method: 'GET',
			operationId: 'trustLifecycleApi.listSensors',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_c5bef0f817eeInput,
			outputSchema: generatedSchemas.r_c5bef0f817eeOutput,
		}),
		allocateNewSensorUsingPost: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/sensor/allocate',
			method: 'POST',
			operationId: 'trustLifecycleApi.allocateNewSensorUsingPost',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_2a5b40269113Input,
			outputSchema: generatedSchemas.r_2a5b40269113Output,
		}),
		postSuspendSensors: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/sensor/suspend',
			method: 'POST',
			operationId: 'trustLifecycleApi.postSuspendSensors',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_69deb2fed908Input,
			outputSchema: generatedSchemas.r_69deb2fed908Output,
		}),
		postReinstateSensors: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/sensor/reinstate',
			method: 'POST',
			operationId: 'trustLifecycleApi.postReinstateSensors',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_359f84ec7e33Input,
			outputSchema: generatedSchemas.r_359f84ec7e33Output,
		}),
		putUpdateSensorDetails: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/sensor/update-details',
			method: 'PUT',
			operationId: 'trustLifecycleApi.putUpdateSensorDetails',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_559e713c21d8Input,
			outputSchema: generatedSchemas.r_559e713c21d8Output,
		}),
		postVoidSensors: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/sensor/void',
			method: 'POST',
			operationId: 'trustLifecycleApi.postVoidSensors',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_3ccfd3c7488eInput,
			outputSchema: generatedSchemas.r_3ccfd3c7488eOutput,
		}),
		getGetSensorById: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/sensor/{sensor_id}',
			method: 'GET',
			operationId: 'trustLifecycleApi.getGetSensorById',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_ae93bfb2ed4dInput,
			outputSchema: generatedSchemas.r_ae93bfb2ed4dOutput,
		}),
		renameSensorUsingPut: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/sensor/rename',
			method: 'PUT',
			operationId: 'trustLifecycleApi.renameSensorUsingPut',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_e13817c6d741Input,
			outputSchema: generatedSchemas.r_e13817c6d741Output,
		}),
		getSensorTemplateFileUsingGet: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/sensor/{license_key}/download',
			method: 'GET',
			operationId: 'trustLifecycleApi.getSensorTemplateFileUsingGet',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_a638a4b395a8Input,
			outputSchema: generatedSchemas.r_a638a4b395a8Output,
		}),
		getQueryServiceStatus: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/hello',
			method: 'GET',
			operationId: 'trustLifecycleApi.getQueryServiceStatus',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_8ca19107d770Input,
			outputSchema: generatedSchemas.r_8ca19107d770Output,
		}),
		getQueryServiceHealth: createOpenApiEndpoint({
			family: 'trustLifecycle',
			path: '/mpki/api/v1/health/extensive',
			method: 'GET',
			operationId: 'trustLifecycleApi.getQueryServiceHealth',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_ba846e3e9a98Input,
			outputSchema: generatedSchemas.r_ba846e3e9a98Output,
		}),
	},
	contentTrustApi: {
		listAuditLogsWithCursor: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/audit-log/cursor',
			method: 'GET',
			operationId: 'contentTrustApi.listAuditLogsWithCursor',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_f3162c793b3cInput,
			outputSchema: generatedSchemas.r_f3162c793b3cOutput,
		}),
		verifyAuditLog: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/audit-log/{id}/verify',
			method: 'GET',
			operationId: 'contentTrustApi.verifyAuditLog',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_496bcb0a0fcaInput,
			outputSchema: generatedSchemas.r_496bcb0a0fcaOutput,
		}),
		getById: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/audit-log/{id}',
			method: 'GET',
			operationId: 'contentTrustApi.getById',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_67bf21878ca5Input,
			outputSchema: generatedSchemas.r_67bf21878ca5Output,
		}),
		createRecurringCredential: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/credential',
			method: 'POST',
			operationId: 'contentTrustApi.createRecurringCredential',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_1ea779a5917aInput,
			outputSchema: generatedSchemas.r_1ea779a5917aOutput,
		}),
		updateCredential: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/credential/{credentialId}',
			method: 'PUT',
			operationId: 'contentTrustApi.updateCredential',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_10a0b05680c8Input,
			outputSchema: generatedSchemas.r_10a0b05680c8Output,
		}),
		getCredentialList: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/credentials/list',
			method: 'GET',
			operationId: 'contentTrustApi.getCredentialList',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_2f9db2b2221bInput,
			outputSchema: generatedSchemas.r_2f9db2b2221bOutput,
		}),
		oauth2Token: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/csc/v1/oauth2/token',
			method: 'POST',
			operationId: 'contentTrustApi.oauth2Token',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: true,
			inputSchema: generatedSchemas.r_49706a34a257Input,
			outputSchema: generatedSchemas.r_49706a34a257Output,
		}),
		listCredentials: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/csc/v1/credentials/list',
			method: 'POST',
			operationId: 'contentTrustApi.listCredentials',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: true,
			inputSchema: generatedSchemas.r_e187a6b43f8aInput,
			outputSchema: generatedSchemas.r_e187a6b43f8aOutput,
		}),
		credentialsInfo: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/csc/v1/credentials/info',
			method: 'POST',
			operationId: 'contentTrustApi.credentialsInfo',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: true,
			inputSchema: generatedSchemas.r_1c6a50e75c89Input,
			outputSchema: generatedSchemas.r_1c6a50e75c89Output,
		}),
		authorizeCredentials: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/csc/v1/credentials/authorize',
			method: 'POST',
			operationId: 'contentTrustApi.authorizeCredentials',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: true,
			inputSchema: generatedSchemas.r_4f1ae9384a62Input,
			outputSchema: generatedSchemas.r_4f1ae9384a62Output,
		}),
		extendTransaction: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/csc/v1/credentials/extendTransaction',
			method: 'POST',
			operationId: 'contentTrustApi.extendTransaction',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: true,
			inputSchema: generatedSchemas.r_0a89eb9da37aInput,
			outputSchema: generatedSchemas.r_0a89eb9da37aOutput,
		}),
		credentialSendOtp: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/csc/v1/credentials/sendOTP',
			method: 'POST',
			operationId: 'contentTrustApi.credentialSendOtp',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: true,
			inputSchema: generatedSchemas.r_b6e2c6352946Input,
			outputSchema: generatedSchemas.r_b6e2c6352946Output,
		}),
		signHash: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/csc/v1/signatures/signHash',
			method: 'POST',
			operationId: 'contentTrustApi.signHash',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: true,
			inputSchema: generatedSchemas.r_1dfa31b33752Input,
			outputSchema: generatedSchemas.r_1dfa31b33752Output,
		}),
		timeStampToken: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/csc/v1/signatures/timestamp',
			method: 'POST',
			operationId: 'contentTrustApi.timeStampToken',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: true,
			inputSchema: generatedSchemas.r_01f60286e899Input,
			outputSchema: generatedSchemas.r_01f60286e899Output,
		}),
		revokeToken: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/csc/v1/auth/revoke',
			method: 'POST',
			operationId: 'contentTrustApi.revokeToken',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: true,
			inputSchema: generatedSchemas.r_ca1177a347b7Input,
			outputSchema: generatedSchemas.r_ca1177a347b7Output,
		}),
		oauth2Token1: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/csc/v0/oauth2/token',
			method: 'POST',
			operationId: 'contentTrustApi.oauth2Token1',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: true,
			inputSchema: generatedSchemas.r_6a8b01159864Input,
			outputSchema: generatedSchemas.r_6a8b01159864Output,
		}),
		listCredentials1: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/csc/v0/credentials/list',
			method: 'POST',
			operationId: 'contentTrustApi.listCredentials1',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: true,
			inputSchema: generatedSchemas.r_239bdd33faf8Input,
			outputSchema: generatedSchemas.r_239bdd33faf8Output,
		}),
		credentialsInfo1: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/csc/v0/credentials/info',
			method: 'POST',
			operationId: 'contentTrustApi.credentialsInfo1',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: true,
			inputSchema: generatedSchemas.r_bf7ea6ad7e85Input,
			outputSchema: generatedSchemas.r_bf7ea6ad7e85Output,
		}),
		authorizeCredentials1: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/csc/v0/credentials/authorize',
			method: 'POST',
			operationId: 'contentTrustApi.authorizeCredentials1',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: true,
			inputSchema: generatedSchemas.r_52c298194dc9Input,
			outputSchema: generatedSchemas.r_52c298194dc9Output,
		}),
		extendTransaction1: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/csc/v0/credentials/extendTransaction',
			method: 'POST',
			operationId: 'contentTrustApi.extendTransaction1',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: true,
			inputSchema: generatedSchemas.r_ff4a7601c20eInput,
			outputSchema: generatedSchemas.r_ff4a7601c20eOutput,
		}),
		credentialSendOtp1: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/csc/v0/credentials/sendOTP',
			method: 'POST',
			operationId: 'contentTrustApi.credentialSendOtp1',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: true,
			inputSchema: generatedSchemas.r_8b2f49243338Input,
			outputSchema: generatedSchemas.r_8b2f49243338Output,
		}),
		signHash1: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/csc/v0/signatures/signHash',
			method: 'POST',
			operationId: 'contentTrustApi.signHash1',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: true,
			inputSchema: generatedSchemas.r_28b5d547e130Input,
			outputSchema: generatedSchemas.r_28b5d547e130Output,
		}),
		timeStampToken1: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/csc/v0/signatures/timestamp',
			method: 'POST',
			operationId: 'contentTrustApi.timeStampToken1',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: true,
			inputSchema: generatedSchemas.r_eca3835a228cInput,
			outputSchema: generatedSchemas.r_eca3835a228cOutput,
		}),
		revokeToken1: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/csc/v0/auth/revoke',
			method: 'POST',
			operationId: 'contentTrustApi.revokeToken1',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: true,
			inputSchema: generatedSchemas.r_d47572214cdfInput,
			outputSchema: generatedSchemas.r_d47572214cdfOutput,
		}),
		reject: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/reject',
			method: 'PUT',
			operationId: 'contentTrustApi.reject',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_6618ac8ee70fInput,
			outputSchema: generatedSchemas.r_6618ac8ee70fOutput,
		}),
		getValidationDetails: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/validation/user/{userId}',
			method: 'GET',
			operationId: 'contentTrustApi.getValidationDetails',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_bc284230bd68Input,
			outputSchema: generatedSchemas.r_bc284230bd68Output,
		}),
		revalidate: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/revalidate',
			method: 'PUT',
			operationId: 'contentTrustApi.revalidate',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_53dc0f0c10e0Input,
			outputSchema: generatedSchemas.r_53dc0f0c10e0Output,
		}),
		approve: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/approve',
			method: 'PUT',
			operationId: 'contentTrustApi.approve',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_d3443d50d56fInput,
			outputSchema: generatedSchemas.r_d3443d50d56fOutput,
		}),
		listValidations: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/validation',
			method: 'GET',
			operationId: 'contentTrustApi.listValidations',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_5246dd4ce6efInput,
			outputSchema: generatedSchemas.r_5246dd4ce6efOutput,
		}),
		createValidation: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/validation',
			method: 'POST',
			operationId: 'contentTrustApi.createValidation',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_8ee4f85d366dInput,
			outputSchema: generatedSchemas.r_8ee4f85d366dOutput,
		}),
		getValidation: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}',
			method: 'GET',
			operationId: 'contentTrustApi.getValidation',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_a15028cb4d8cInput,
			outputSchema: generatedSchemas.r_a15028cb4d8cOutput,
		}),
		resendEmail: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/reSendEmail',
			method: 'PUT',
			operationId: 'contentTrustApi.resendEmail',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_e6736eb32525Input,
			outputSchema: generatedSchemas.r_e6736eb32525Output,
		}),
		cancelValidation: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/cancel',
			method: 'PUT',
			operationId: 'contentTrustApi.cancelValidation',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_d52a0423fb82Input,
			outputSchema: generatedSchemas.r_d52a0423fb82Output,
		}),
		retryValidation: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/retry',
			method: 'POST',
			operationId: 'contentTrustApi.retryValidation',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_75c13df8a979Input,
			outputSchema: generatedSchemas.r_75c13df8a979Output,
		}),
		enableValidation: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/enable',
			method: 'PUT',
			operationId: 'contentTrustApi.enableValidation',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_5506f0d0c709Input,
			outputSchema: generatedSchemas.r_5506f0d0c709Output,
		}),
		disableValidation: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/disable',
			method: 'PUT',
			operationId: 'contentTrustApi.disableValidation',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_fa557bf6435eInput,
			outputSchema: generatedSchemas.r_fa557bf6435eOutput,
		}),
		invalidateValidation: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/invalidate',
			method: 'PUT',
			operationId: 'contentTrustApi.invalidateValidation',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_fdcd632d15c3Input,
			outputSchema: generatedSchemas.r_fdcd632d15c3Output,
		}),
		approvePendingSignerApproval: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/approve-selfenrolled-user',
			method: 'PUT',
			operationId: 'contentTrustApi.approvePendingSignerApproval',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_cdc09308beb2Input,
			outputSchema: generatedSchemas.r_cdc09308beb2Output,
		}),
		rejectPendingSignerApproval: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/reject-selfenrolled-user',
			method: 'PUT',
			operationId: 'contentTrustApi.rejectPendingSignerApproval',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_715ac3807e24Input,
			outputSchema: generatedSchemas.r_715ac3807e24Output,
		}),
		approveValidationOrganization: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/approve-organization',
			method: 'PUT',
			operationId: 'contentTrustApi.approveValidationOrganization',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_9082880056c2Input,
			outputSchema: generatedSchemas.r_9082880056c2Output,
		}),
		rejectValidationOrganization: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/reject-organization',
			method: 'PUT',
			operationId: 'contentTrustApi.rejectValidationOrganization',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_537bfeb702eeInput,
			outputSchema: generatedSchemas.r_537bfeb702eeOutput,
		}),
		enhanceHash: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/hashes',
			method: 'POST',
			operationId: 'contentTrustApi.enhanceHash',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_b1d9a5f5f20fInput,
			outputSchema: generatedSchemas.r_b1d9a5f5f20fOutput,
		}),
		enhanceSignature: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/signatures',
			method: 'POST',
			operationId: 'contentTrustApi.enhanceSignature',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_efe3153749c0Input,
			outputSchema: generatedSchemas.r_efe3153749c0Output,
		}),
		setupAccount: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/onboard/setup-account',
			method: 'POST',
			operationId: 'contentTrustApi.setupAccount',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_415ee9fded4fInput,
			outputSchema: generatedSchemas.r_415ee9fded4fOutput,
		}),
		updateAccount: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/onboard/setup-account/{onboardingId}',
			method: 'PUT',
			operationId: 'contentTrustApi.updateAccount',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_697bc713dbd3Input,
			outputSchema: generatedSchemas.r_697bc713dbd3Output,
		}),
		createUserInAm: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/user',
			method: 'POST',
			operationId: 'contentTrustApi.createUserInAm',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_c1004107761fInput,
			outputSchema: generatedSchemas.r_c1004107761fOutput,
		}),
		updateUserData: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/user/{userId}',
			method: 'PUT',
			operationId: 'contentTrustApi.updateUserData',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_67d02fcd971fInput,
			outputSchema: generatedSchemas.r_67d02fcd971fOutput,
		}),
		createRecurringCredentialV2: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v2/credential',
			method: 'POST',
			operationId: 'contentTrustApi.createRecurringCredentialV2',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_a2afdf611241Input,
			outputSchema: generatedSchemas.r_a2afdf611241Output,
		}),
		getCredentialByName: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v2/credential/{name}',
			method: 'GET',
			operationId: 'contentTrustApi.getCredentialByName',
			mediaType: undefined,
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_4a3694a0845bInput,
			outputSchema: generatedSchemas.r_4a3694a0845bOutput,
		}),
		cancelCredentialByName: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v2/credential/{name}/cancel',
			method: 'PUT',
			operationId: 'contentTrustApi.cancelCredentialByName',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_90c9fc0dc00aInput,
			outputSchema: generatedSchemas.r_90c9fc0dc00aOutput,
		}),
		revokeCredentials: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/credential/{name}/revoke',
			method: 'PUT',
			operationId: 'contentTrustApi.revokeCredentials',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_30b532b72cb1Input,
			outputSchema: generatedSchemas.r_30b532b72cb1Output,
		}),
		replaceClientAdmin: createOpenApiEndpoint({
			family: 'contentTrust',
			path: '/api/v1/user/{userId}/replace-client-admin',
			method: 'POST',
			operationId: 'contentTrustApi.replaceClientAdmin',
			mediaType: 'application/json',
			public: false,
			oauth2Allowed: false,
			inputSchema: generatedSchemas.r_707c330daa32Input,
			outputSchema: generatedSchemas.r_707c330daa32Output,
		}),
	},
} as const;

type GeneratedOpenApiEndpointPath =
	| 'accountManagerApi.listApiTokens'
	| 'accountManagerApi.createApiToken'
	| 'accountManagerApi.getApiTokenById'
	| 'accountManagerApi.updateApiToken'
	| 'accountManagerApi.deleteApiToken'
	| 'accountManagerApi.listAccounts'
	| 'accountManagerApi.createAccount'
	| 'accountManagerApi.getAccountDetails'
	| 'accountManagerApi.updateAccount'
	| 'accountManagerApi.listAuditLogs'
	| 'accountManagerApi.getClientAuthCertificatesByUserId'
	| 'accountManagerApi.createClientAuthCertificate'
	| 'accountManagerApi.enableClientAuthCertificate'
	| 'accountManagerApi.listOrganizations'
	| 'accountManagerApi.getOrganizationDetails'
	| 'accountManagerApi.getUserDetails'
	| 'accountManagerApi.deleteUser'
	| 'accountManagerApi.updateUser'
	| 'accountManagerApi.listSelectUsers'
	| 'accountManagerApi.listAllUsers'
	| 'accountManagerApi.createUser'
	| 'accountManagerApi.listUserRoles'
	| 'privateCAApi.getGetAllCaCertificateAiaIssuerFiles'
	| 'privateCAApi.postAddAnAiaIssuerFile'
	| 'privateCAApi.getGetAnAiaIssuerFile'
	| 'privateCAApi.getGetAnAiaIssuerFileBlob'
	| 'privateCAApi.putUpdateAnAiaIssuerFile'
	| 'privateCAApi.getCheckAnalyticsConfiguration'
	| 'privateCAApi.deleteDeleteSamlConfiguration'
	| 'privateCAApi.getGetSamlConfiguration'
	| 'privateCAApi.postCreateOrUpdateSamlConfiguration'
	| 'privateCAApi.postParseIdPMetadata'
	| 'privateCAApi.getGetAuditLog'
	| 'privateCAApi.postAssertionConsumerService'
	| 'privateCAApi.getCheckIfSamlIsEnabled'
	| 'privateCAApi.getInitiateSamlLogin'
	| 'privateCAApi.postInitiateLogout'
	| 'privateCAApi.getGetSpMetadata'
	| 'privateCAApi.postSingleLogoutService'
	| 'privateCAApi.getShowAllCas'
	| 'privateCAApi.postCreateACa'
	| 'privateCAApi.deleteDeletesAPendingSignCa'
	| 'privateCAApi.getGetACa'
	| 'privateCAApi.deleteDeleteCaAccounts'
	| 'privateCAApi.postAddCaAccounts'
	| 'privateCAApi.putSetCaAccounts'
	| 'privateCAApi.putSetTheActiveAiaIssuerForACa'
	| 'privateCAApi.putSetTheActiveCrlForACa'
	| 'privateCAApi.postSetACaBlob'
	| 'privateCAApi.getGetCaAiaIssuerConfiguration'
	| 'privateCAApi.putSetCaAiaIssuerConfiguration'
	| 'privateCAApi.getGetCaCertPoliciesConfiguration'
	| 'privateCAApi.putSetCaCertPoliciesConfiguration'
	| 'privateCAApi.putSetCaIssuanceCertConfig'
	| 'privateCAApi.getGetCaCertificateChains'
	| 'privateCAApi.postAddACertificateChainToACa'
	| 'privateCAApi.deleteDeleteACertificateChain'
	| 'privateCAApi.getGetACertificateChain'
	| 'privateCAApi.putUpdateACertificateChain'
	| 'privateCAApi.putSetIncludeAllCertsInCrl'
	| 'privateCAApi.getGetCaCrlIssuanceConfig'
	| 'privateCAApi.putSetCaCrlIssuanceConfig'
	| 'privateCAApi.getGetCaOcspGenerationConfig'
	| 'privateCAApi.putSetCaOcspGenerationConfig'
	| 'privateCAApi.getGetCaOcspIssuanceConfig'
	| 'privateCAApi.putSetCaOcspIssuanceConfig'
	| 'privateCAApi.getGetCaOcspResponderConfig'
	| 'privateCAApi.putSetCaOcspResponderConfig'
	| 'privateCAApi.putSetAdditionalSettings'
	| 'privateCAApi.getGetACaCsr'
	| 'privateCAApi.postDecryptAPkcs7'
	| 'privateCAApi.getDownloadACa'
	| 'privateCAApi.postEncryptAPkcs7'
	| 'privateCAApi.getGetTheRootCaHierarchy'
	| 'privateCAApi.getGetCaNotes'
	| 'privateCAApi.postCreateCaNote'
	| 'privateCAApi.getGetCaOcspConfig'
	| 'privateCAApi.postRecertifiesExistingCaByCaId'
	| 'privateCAApi.postRecertifiesACaWithANewImportedCertificate'
	| 'privateCAApi.postCreateCaReinstateRequest'
	| 'privateCAApi.getGetCaReinstateRequest'
	| 'privateCAApi.postApproveCaReinstateRequest'
	| 'privateCAApi.postRejectCaReinstateRequest'
	| 'privateCAApi.postCreateCaRevokeRequest'
	| 'privateCAApi.getGetCaRevokeRequest'
	| 'privateCAApi.postApproveCaRevokeRequest'
	| 'privateCAApi.postSignAnAttributeCertificate'
	| 'privateCAApi.postSignACmpRequest'
	| 'privateCAApi.postSignAGlobalPlatformRequest'
	| 'privateCAApi.getGetCaActiveStatus'
	| 'privateCAApi.postSetCaActiveStatus'
	| 'privateCAApi.getGetCertificateExpiration'
	| 'privateCAApi.getGetAllCertificates'
	| 'privateCAApi.postImportACa'
	| 'privateCAApi.postLinkACaKey'
	| 'privateCAApi.postImportAnOfflineCa'
	| 'privateCAApi.postImportAThirdPartyCa'
	| 'privateCAApi.postCreateAPendingDelegatedOcspResponder'
	| 'privateCAApi.getGetAllCertificates_a2d39d9'
	| 'privateCAApi.postCreateCertificate'
	| 'privateCAApi.getGetCertificate'
	| 'privateCAApi.getRecoverEscrowedEeKey'
	| 'privateCAApi.putRevokeCertificate'
	| 'privateCAApi.getGetCsvListOfCertificates'
	| 'privateCAApi.postImportACertificate'
	| 'privateCAApi.getGetAllCrlInfos'
	| 'privateCAApi.postAddCrlInfos'
	| 'privateCAApi.getGetCrlInfo'
	| 'privateCAApi.getGetCrlBlobList'
	| 'privateCAApi.postImportCrlBlob'
	| 'privateCAApi.getGetCrlBlob'
	| 'privateCAApi.getGetCrlConfig'
	| 'privateCAApi.putSetCrlConfig'
	| 'privateCAApi.postCreateCrlNow'
	| 'privateCAApi.postImportAClientKey'
	| 'privateCAApi.getGetFedRampComplianceEvidence'
	| 'privateCAApi.getGetHsmPartitions'
	| 'privateCAApi.postCreateAnOcspResponder'
	| 'privateCAApi.getGetAnOcspResponder'
	| 'privateCAApi.putSetAnOcspResponderStatus'
	| 'privateCAApi.putSetAnOcspBlob'
	| 'privateCAApi.getDownloadAnOcspResponderCsr'
	| 'privateCAApi.postImportAnOcspResponder'
	| 'privateCAApi.postCreateAPendingOcspResponder'
	| 'privateCAApi.getGetAllOcspResponders'
	| 'privateCAApi.getHandleScepGetOperations'
	| 'privateCAApi.postHandleScepPkiOperation'
	| 'privateCAApi.getGetCertificateTemplates'
	| 'privateCAApi.postCreateACustomCertificateTemplate'
	| 'privateCAApi.getGetACertificateTemplate'
	| 'privateCAApi.putUpdateACustomCertificateTemplate'
	| 'privateCAApi.getGetAAccountsCertificateTemplateIsAssignedTo'
	| 'privateCAApi.putActivateACustomCertificateTemplate'
	| 'privateCAApi.putDeactivateACustomCertificateTemplate'
	| 'privateCAApi.postVerifyAsn1Template'
	| 'privateCAApi.getGetCertificateTemplateValidationSchemas'
	| 'privateCAApi.getGetCertificateTemplateValidationSchemas_4fe4fdb'
	| 'trustLifecycleApi.recreateAcmecredentialsPublic'
	| 'trustLifecycleApi.addSystemScanUsingPostpublic'
	| 'trustLifecycleApi.abortSystemScanUsingPostpublic'
	| 'trustLifecycleApi.suspendSystemScanUsingPostpublic'
	| 'trustLifecycleApi.resumeSystemScanUsingPostpublic'
	| 'trustLifecycleApi.skipFutureSystemScanScheduleUsingPostpublic'
	| 'trustLifecycleApi.restoreSystemScanScheduleUsingPostpublic'
	| 'trustLifecycleApi.deletePastSystemScanUsingPostpublic'
	| 'trustLifecycleApi.listUpcomingSystemScansUsingGetpublic'
	| 'trustLifecycleApi.listPastSystemScansUsingGetpublic'
	| 'trustLifecycleApi.getListAgents'
	| 'trustLifecycleApi.getGetAgentById'
	| 'trustLifecycleApi.updateCertDeliveryLocationForAgentPostpublic'
	| 'trustLifecycleApi.putApproveAgents'
	| 'trustLifecycleApi.putVoidAgents'
	| 'trustLifecycleApi.putUpdateAgent'
	| 'trustLifecycleApi.putRetryAgentConfig'
	| 'trustLifecycleApi.postPostAgentSuggestions'
	| 'trustLifecycleApi.getListAgentScripts'
	| 'trustLifecycleApi.postPostAgentScript'
	| 'trustLifecycleApi.getGetAgentScriptById'
	| 'trustLifecycleApi.putUpdateAgentScript'
	| 'trustLifecycleApi.postAddAgentScriptsInBulk'
	| 'trustLifecycleApi.putSuspendAgents'
	| 'trustLifecycleApi.putRejectAgents'
	| 'trustLifecycleApi.putReinstateAgents'
	| 'trustLifecycleApi.getGetGlobalAgentSettings'
	| 'trustLifecycleApi.putUpdateGlobalAgentSettings'
	| 'trustLifecycleApi.postCreateGlobalAgentSettings'
	| 'trustLifecycleApi.createAutomationUsingPost'
	| 'trustLifecycleApi.createAwrAutomationUsingPost'
	| 'trustLifecycleApi.checkEligibilityOfBulkAutomationUsingPost'
	| 'trustLifecycleApi.requestBulkAutomationUsingPost'
	| 'trustLifecycleApi.getAutomationDetailsUsingGet'
	| 'trustLifecycleApi.updateAutomationUsingPut'
	| 'trustLifecycleApi.retryAutomationUsingPut'
	| 'trustLifecycleApi.cancelAutomationUsingPut'
	| 'trustLifecycleApi.listAutomationInventory'
	| 'trustLifecycleApi.getInventoryDetailsUsingGet'
	| 'trustLifecycleApi.getListBusinessUnit'
	| 'trustLifecycleApi.postCreateBusinessUnit'
	| 'trustLifecycleApi.getGetBusinessUnitById'
	| 'trustLifecycleApi.deleteDeleteBusinessUnit'
	| 'trustLifecycleApi.putUpdateBusinessUnitLicense'
	| 'trustLifecycleApi.putAssignAnAdminToABusinessUnit'
	| 'trustLifecycleApi.deleteRemoveAnAdminFromABusinessUnit'
	| 'trustLifecycleApi.getListCertificateOwners'
	| 'trustLifecycleApi.postCreateCertificateOwners'
	| 'trustLifecycleApi.getGetCertificateOwnerById'
	| 'trustLifecycleApi.putUpdateCertificateOwnerDetailsForAGivenCertificateOwnerId'
	| 'trustLifecycleApi.deleteDeleteCertificateOwner'
	| 'trustLifecycleApi.putAddCertificateOwnersMappingForCertificate'
	| 'trustLifecycleApi.deleteDeleteCertificateOwnerMappingsForACertificate'
	| 'trustLifecycleApi.postIssueCertificate'
	| 'trustLifecycleApi.postPickUpCertificate'
	| 'trustLifecycleApi.postApproveEscrowedCertificateRecovery'
	| 'trustLifecycleApi.postRenewCertificate'
	| 'trustLifecycleApi.postBulkUpdateTags'
	| 'trustLifecycleApi.postBulkReplaceTags'
	| 'trustLifecycleApi.postImportCertificate'
	| 'trustLifecycleApi.getSearchCertificates'
	| 'trustLifecycleApi.publicCertificateSearchSummary'
	| 'trustLifecycleApi.publicGetCertUsingId'
	| 'trustLifecycleApi.getGetCertificateBySerialNumber'
	| 'trustLifecycleApi.postRecoverEscrowedCertificateBySerialNumber'
	| 'trustLifecycleApi.certRevokeBySerial'
	| 'trustLifecycleApi.deleteResumeSuspendedCertificate'
	| 'trustLifecycleApi.getAdditionalFormatsBySerialNumber'
	| 'trustLifecycleApi.publicCountCertificateMigrationCandidates'
	| 'trustLifecycleApi.publicGetCertificateMigrationCandidates'
	| 'trustLifecycleApi.createUsingPost1'
	| 'trustLifecycleApi.listByAccountUsingPost'
	| 'trustLifecycleApi.suggestionsUsingGet'
	| 'trustLifecycleApi.getDetailsByIdUsingGet'
	| 'trustLifecycleApi.updateUsingPut1'
	| 'trustLifecycleApi.deleteByIdUsingDelete'
	| 'trustLifecycleApi.runNowUsingPost'
	| 'trustLifecycleApi.stopUsingPost'
	| 'trustLifecycleApi.testConnectionUsingPost'
	| 'trustLifecycleApi.unlinkUsingPost'
	| 'trustLifecycleApi.getConnectorMetadataUsingGet'
	| 'trustLifecycleApi.getListCustomAttributes'
	| 'trustLifecycleApi.postCreateCustomAttribute'
	| 'trustLifecycleApi.getListCustomAttributesForCertificate'
	| 'trustLifecycleApi.putAddCustomAttributesMappingForCertificate'
	| 'trustLifecycleApi.deleteDeleteCustomAttributesMappingForCertificate'
	| 'trustLifecycleApi.getGetCustomAttributeById'
	| 'trustLifecycleApi.putUpdateCustomAttribute'
	| 'trustLifecycleApi.deleteDeleteCustomAttribute'
	| 'trustLifecycleApi.getCertificateCountsBySourceTypes'
	| 'trustLifecycleApi.deleteCertificatesBySourceTypes'
	| 'trustLifecycleApi.getListDevices'
	| 'trustLifecycleApi.postAddDevices'
	| 'trustLifecycleApi.deleteDeleteDevicesBulk'
	| 'trustLifecycleApi.getGetDevice'
	| 'trustLifecycleApi.putUpdateDevice'
	| 'trustLifecycleApi.deleteDeleteDevice'
	| 'trustLifecycleApi.postImportDevicesFromCsv'
	| 'trustLifecycleApi.getExportDevicesToCsv'
	| 'trustLifecycleApi.putLinkDevicesToAProfile'
	| 'trustLifecycleApi.putUnlinkDevicesFromAProfile'
	| 'trustLifecycleApi.putBulkMapDevicesToProfiles'
	| 'trustLifecycleApi.deleteBulkUnmapDevicesFromProfiles'
	| 'trustLifecycleApi.getUnsecured'
	| 'trustLifecycleApi.getUnsecuredCount'
	| 'trustLifecycleApi.getPortletCount'
	| 'trustLifecycleApi.getAutomatableEndpoint'
	| 'trustLifecycleApi.getAutomatableCount'
	| 'trustLifecycleApi.getInventoryDetails'
	| 'trustLifecycleApi.getDiscoveredEndpoints'
	| 'trustLifecycleApi.getDiscoveredEndpointsCount'
	| 'trustLifecycleApi.getInstancesList'
	| 'trustLifecycleApi.postCreateEnrollment'
	| 'trustLifecycleApi.postRedeemEnrollment'
	| 'trustLifecycleApi.putUpdateStatusOfManualApprovalEnrollment'
	| 'trustLifecycleApi.getGetEnrollmentDetailsByEnrollmentCode'
	| 'trustLifecycleApi.getListEnrollments'
	| 'trustLifecycleApi.getGetEnrollmentDetailsById'
	| 'trustLifecycleApi.postCreateEnrollmentForManualApproval'
	| 'trustLifecycleApi.getAttributesOfRenewableCertificateUsingCertIdUsingGet'
	| 'trustLifecycleApi.postRenewCertificateEnrollmentUsingCertificateId'
	| 'trustLifecycleApi.handleGetCaCertsOperationUsingGet'
	| 'trustLifecycleApi.handleSimpleEnrollOperationUsingPost'
	| 'trustLifecycleApi.handleSimpleReEnrollOperationUsingPost'
	| 'trustLifecycleApi.listSensorIntegrations'
	| 'trustLifecycleApi.createSensorIntegration'
	| 'trustLifecycleApi.getSensorIntegrationById'
	| 'trustLifecycleApi.refreshSensorIntegration'
	| 'trustLifecycleApi.getGetListOfDnsIntegrations'
	| 'trustLifecycleApi.postBulkVoid'
	| 'trustLifecycleApi.postVoidById'
	| 'trustLifecycleApi.getSensorIntegrationAppParameters'
	| 'trustLifecycleApi.postCreateANewProfile'
	| 'trustLifecycleApi.putUpdateProfile'
	| 'trustLifecycleApi.getListProfiles'
	| 'trustLifecycleApi.getGetProfileById'
	| 'trustLifecycleApi.getListProfiles_a46d97c'
	| 'trustLifecycleApi.getGetProfileById_2316fef'
	| 'trustLifecycleApi.getGetEnrollmentCodeReport'
	| 'trustLifecycleApi.getListAuditLogs'
	| 'trustLifecycleApi.getGetAuditLogEventById'
	| 'trustLifecycleApi.getGetAuditLogCount'
	| 'trustLifecycleApi.getListRules'
	| 'trustLifecycleApi.postCreateRule'
	| 'trustLifecycleApi.deleteDeleteRules'
	| 'trustLifecycleApi.getGetRuleById'
	| 'trustLifecycleApi.putUpdateRule'
	| 'trustLifecycleApi.postRunRuleNow'
	| 'trustLifecycleApi.listOfScansUsingGet'
	| 'trustLifecycleApi.addScanUsingPost'
	| 'trustLifecycleApi.deleteScanUsingPost'
	| 'trustLifecycleApi.editScanUsingPut'
	| 'trustLifecycleApi.getDetailsUsingGet1'
	| 'trustLifecycleApi.abortScanUsingPost'
	| 'trustLifecycleApi.publicListPastScansUsingGet'
	| 'trustLifecycleApi.validateIpFqdnsPost'
	| 'trustLifecycleApi.checkScanExistPost'
	| 'trustLifecycleApi.getGetListOfSeats'
	| 'trustLifecycleApi.postCreateSeat'
	| 'trustLifecycleApi.getGetSeatByIdentifier'
	| 'trustLifecycleApi.putUpdateSeat'
	| 'trustLifecycleApi.deleteDeleteSeat'
	| 'trustLifecycleApi.putAssignSeatToAnotherBusinessUnit'
	| 'trustLifecycleApi.getGetAvailableSeatTypes'
	| 'trustLifecycleApi.listSensors'
	| 'trustLifecycleApi.allocateNewSensorUsingPost'
	| 'trustLifecycleApi.postSuspendSensors'
	| 'trustLifecycleApi.postReinstateSensors'
	| 'trustLifecycleApi.putUpdateSensorDetails'
	| 'trustLifecycleApi.postVoidSensors'
	| 'trustLifecycleApi.getGetSensorById'
	| 'trustLifecycleApi.renameSensorUsingPut'
	| 'trustLifecycleApi.getSensorTemplateFileUsingGet'
	| 'trustLifecycleApi.getQueryServiceStatus'
	| 'trustLifecycleApi.getQueryServiceHealth'
	| 'contentTrustApi.listAuditLogsWithCursor'
	| 'contentTrustApi.verifyAuditLog'
	| 'contentTrustApi.getById'
	| 'contentTrustApi.createRecurringCredential'
	| 'contentTrustApi.updateCredential'
	| 'contentTrustApi.getCredentialList'
	| 'contentTrustApi.oauth2Token'
	| 'contentTrustApi.listCredentials'
	| 'contentTrustApi.credentialsInfo'
	| 'contentTrustApi.authorizeCredentials'
	| 'contentTrustApi.extendTransaction'
	| 'contentTrustApi.credentialSendOtp'
	| 'contentTrustApi.signHash'
	| 'contentTrustApi.timeStampToken'
	| 'contentTrustApi.revokeToken'
	| 'contentTrustApi.oauth2Token1'
	| 'contentTrustApi.listCredentials1'
	| 'contentTrustApi.credentialsInfo1'
	| 'contentTrustApi.authorizeCredentials1'
	| 'contentTrustApi.extendTransaction1'
	| 'contentTrustApi.credentialSendOtp1'
	| 'contentTrustApi.signHash1'
	| 'contentTrustApi.timeStampToken1'
	| 'contentTrustApi.revokeToken1'
	| 'contentTrustApi.reject'
	| 'contentTrustApi.getValidationDetails'
	| 'contentTrustApi.revalidate'
	| 'contentTrustApi.approve'
	| 'contentTrustApi.listValidations'
	| 'contentTrustApi.createValidation'
	| 'contentTrustApi.getValidation'
	| 'contentTrustApi.resendEmail'
	| 'contentTrustApi.cancelValidation'
	| 'contentTrustApi.retryValidation'
	| 'contentTrustApi.enableValidation'
	| 'contentTrustApi.disableValidation'
	| 'contentTrustApi.invalidateValidation'
	| 'contentTrustApi.approvePendingSignerApproval'
	| 'contentTrustApi.rejectPendingSignerApproval'
	| 'contentTrustApi.approveValidationOrganization'
	| 'contentTrustApi.rejectValidationOrganization'
	| 'contentTrustApi.enhanceHash'
	| 'contentTrustApi.enhanceSignature'
	| 'contentTrustApi.setupAccount'
	| 'contentTrustApi.updateAccount'
	| 'contentTrustApi.createUserInAm'
	| 'contentTrustApi.updateUserData'
	| 'contentTrustApi.createRecurringCredentialV2'
	| 'contentTrustApi.getCredentialByName'
	| 'contentTrustApi.cancelCredentialByName'
	| 'contentTrustApi.revokeCredentials'
	| 'contentTrustApi.replaceClientAdmin';

export const generatedOpenApiEndpointSchemas: Record<
	GeneratedOpenApiEndpointPath,
	{ input: z.ZodTypeAny; output: z.ZodTypeAny }
> = {
	'accountManagerApi.listApiTokens': {
		input: generatedSchemas.r_2db205955e7eInput,
		output: generatedSchemas.r_2db205955e7eOutput,
	},
	'accountManagerApi.createApiToken': {
		input: generatedSchemas.r_e8f57cffa958Input,
		output: generatedSchemas.r_e8f57cffa958Output,
	},
	'accountManagerApi.getApiTokenById': {
		input: generatedSchemas.r_4c5572cd02e5Input,
		output: generatedSchemas.r_4c5572cd02e5Output,
	},
	'accountManagerApi.updateApiToken': {
		input: generatedSchemas.r_601a73f00551Input,
		output: generatedSchemas.r_601a73f00551Output,
	},
	'accountManagerApi.deleteApiToken': {
		input: generatedSchemas.r_4ad10b0eab03Input,
		output: generatedSchemas.r_4ad10b0eab03Output,
	},
	'accountManagerApi.listAccounts': {
		input: generatedSchemas.r_0e428a8d097bInput,
		output: generatedSchemas.r_0e428a8d097bOutput,
	},
	'accountManagerApi.createAccount': {
		input: generatedSchemas.r_1628177be371Input,
		output: generatedSchemas.r_1628177be371Output,
	},
	'accountManagerApi.getAccountDetails': {
		input: generatedSchemas.r_e9990a55db83Input,
		output: generatedSchemas.r_e9990a55db83Output,
	},
	'accountManagerApi.updateAccount': {
		input: generatedSchemas.r_15fb6b740e87Input,
		output: generatedSchemas.r_15fb6b740e87Output,
	},
	'accountManagerApi.listAuditLogs': {
		input: generatedSchemas.r_a85d7ecc25d2Input,
		output: generatedSchemas.r_a85d7ecc25d2Output,
	},
	'accountManagerApi.getClientAuthCertificatesByUserId': {
		input: generatedSchemas.r_ee246cdb3f55Input,
		output: generatedSchemas.r_ee246cdb3f55Output,
	},
	'accountManagerApi.createClientAuthCertificate': {
		input: generatedSchemas.r_5f5cde1e7cc7Input,
		output: generatedSchemas.r_5f5cde1e7cc7Output,
	},
	'accountManagerApi.enableClientAuthCertificate': {
		input: generatedSchemas.r_06d703452777Input,
		output: generatedSchemas.r_06d703452777Output,
	},
	'accountManagerApi.listOrganizations': {
		input: generatedSchemas.r_91d0541033a3Input,
		output: generatedSchemas.r_91d0541033a3Output,
	},
	'accountManagerApi.getOrganizationDetails': {
		input: generatedSchemas.r_c8653461a11eInput,
		output: generatedSchemas.r_c8653461a11eOutput,
	},
	'accountManagerApi.getUserDetails': {
		input: generatedSchemas.r_f05dba0a427dInput,
		output: generatedSchemas.r_f05dba0a427dOutput,
	},
	'accountManagerApi.deleteUser': {
		input: generatedSchemas.r_b3e6d7c8268cInput,
		output: generatedSchemas.r_b3e6d7c8268cOutput,
	},
	'accountManagerApi.updateUser': {
		input: generatedSchemas.r_bcad0157f637Input,
		output: generatedSchemas.r_bcad0157f637Output,
	},
	'accountManagerApi.listSelectUsers': {
		input: generatedSchemas.r_fbfdfcedaba1Input,
		output: generatedSchemas.r_fbfdfcedaba1Output,
	},
	'accountManagerApi.listAllUsers': {
		input: generatedSchemas.r_97a1d92f48f0Input,
		output: generatedSchemas.r_97a1d92f48f0Output,
	},
	'accountManagerApi.createUser': {
		input: generatedSchemas.r_40f39944750fInput,
		output: generatedSchemas.r_40f39944750fOutput,
	},
	'accountManagerApi.listUserRoles': {
		input: generatedSchemas.r_b224a0eca017Input,
		output: generatedSchemas.r_b224a0eca017Output,
	},
	'privateCAApi.getGetAllCaCertificateAiaIssuerFiles': {
		input: generatedSchemas.r_d37ec173c239Input,
		output: generatedSchemas.r_d37ec173c239Output,
	},
	'privateCAApi.postAddAnAiaIssuerFile': {
		input: generatedSchemas.r_836448818f1bInput,
		output: generatedSchemas.r_836448818f1bOutput,
	},
	'privateCAApi.getGetAnAiaIssuerFile': {
		input: generatedSchemas.r_450b135c4c8bInput,
		output: generatedSchemas.r_450b135c4c8bOutput,
	},
	'privateCAApi.getGetAnAiaIssuerFileBlob': {
		input: generatedSchemas.r_a497c207ff38Input,
		output: generatedSchemas.r_a497c207ff38Output,
	},
	'privateCAApi.putUpdateAnAiaIssuerFile': {
		input: generatedSchemas.r_4413aec93603Input,
		output: generatedSchemas.r_4413aec93603Output,
	},
	'privateCAApi.getCheckAnalyticsConfiguration': {
		input: generatedSchemas.r_d2466ae03b22Input,
		output: generatedSchemas.r_d2466ae03b22Output,
	},
	'privateCAApi.deleteDeleteSamlConfiguration': {
		input: generatedSchemas.r_7edc4cabae54Input,
		output: generatedSchemas.r_7edc4cabae54Output,
	},
	'privateCAApi.getGetSamlConfiguration': {
		input: generatedSchemas.r_ca00d8bde2a5Input,
		output: generatedSchemas.r_ca00d8bde2a5Output,
	},
	'privateCAApi.postCreateOrUpdateSamlConfiguration': {
		input: generatedSchemas.r_5f4fc2d8f440Input,
		output: generatedSchemas.r_5f4fc2d8f440Output,
	},
	'privateCAApi.postParseIdPMetadata': {
		input: generatedSchemas.r_30806dc12876Input,
		output: generatedSchemas.r_30806dc12876Output,
	},
	'privateCAApi.getGetAuditLog': {
		input: generatedSchemas.r_9cd2e581f2a1Input,
		output: generatedSchemas.r_9cd2e581f2a1Output,
	},
	'privateCAApi.postAssertionConsumerService': {
		input: generatedSchemas.r_35f6309030acInput,
		output: generatedSchemas.r_35f6309030acOutput,
	},
	'privateCAApi.getCheckIfSamlIsEnabled': {
		input: generatedSchemas.r_6ab53e3e6059Input,
		output: generatedSchemas.r_6ab53e3e6059Output,
	},
	'privateCAApi.getInitiateSamlLogin': {
		input: generatedSchemas.r_a48e8840fc8cInput,
		output: generatedSchemas.r_a48e8840fc8cOutput,
	},
	'privateCAApi.postInitiateLogout': {
		input: generatedSchemas.r_9e9cfb59b47aInput,
		output: generatedSchemas.r_9e9cfb59b47aOutput,
	},
	'privateCAApi.getGetSpMetadata': {
		input: generatedSchemas.r_b4af3ae8430dInput,
		output: generatedSchemas.r_b4af3ae8430dOutput,
	},
	'privateCAApi.postSingleLogoutService': {
		input: generatedSchemas.r_2053c0b686d7Input,
		output: generatedSchemas.r_2053c0b686d7Output,
	},
	'privateCAApi.getShowAllCas': {
		input: generatedSchemas.r_419129d1877aInput,
		output: generatedSchemas.r_419129d1877aOutput,
	},
	'privateCAApi.postCreateACa': {
		input: generatedSchemas.r_bb6316690c68Input,
		output: generatedSchemas.r_bb6316690c68Output,
	},
	'privateCAApi.deleteDeletesAPendingSignCa': {
		input: generatedSchemas.r_6e1b2f5805e5Input,
		output: generatedSchemas.r_6e1b2f5805e5Output,
	},
	'privateCAApi.getGetACa': {
		input: generatedSchemas.r_e2d08c123889Input,
		output: generatedSchemas.r_e2d08c123889Output,
	},
	'privateCAApi.deleteDeleteCaAccounts': {
		input: generatedSchemas.r_a4505158d331Input,
		output: generatedSchemas.r_a4505158d331Output,
	},
	'privateCAApi.postAddCaAccounts': {
		input: generatedSchemas.r_1d77ab47e7b6Input,
		output: generatedSchemas.r_1d77ab47e7b6Output,
	},
	'privateCAApi.putSetCaAccounts': {
		input: generatedSchemas.r_ec4a0752b7d5Input,
		output: generatedSchemas.r_ec4a0752b7d5Output,
	},
	'privateCAApi.putSetTheActiveAiaIssuerForACa': {
		input: generatedSchemas.r_a78f5194d416Input,
		output: generatedSchemas.r_a78f5194d416Output,
	},
	'privateCAApi.putSetTheActiveCrlForACa': {
		input: generatedSchemas.r_22401761d689Input,
		output: generatedSchemas.r_22401761d689Output,
	},
	'privateCAApi.postSetACaBlob': {
		input: generatedSchemas.r_7fcf865bc7c5Input,
		output: generatedSchemas.r_7fcf865bc7c5Output,
	},
	'privateCAApi.getGetCaAiaIssuerConfiguration': {
		input: generatedSchemas.r_aa5e92b5e9cdInput,
		output: generatedSchemas.r_aa5e92b5e9cdOutput,
	},
	'privateCAApi.putSetCaAiaIssuerConfiguration': {
		input: generatedSchemas.r_74dc2333e88bInput,
		output: generatedSchemas.r_74dc2333e88bOutput,
	},
	'privateCAApi.getGetCaCertPoliciesConfiguration': {
		input: generatedSchemas.r_f16d00fee5aeInput,
		output: generatedSchemas.r_f16d00fee5aeOutput,
	},
	'privateCAApi.putSetCaCertPoliciesConfiguration': {
		input: generatedSchemas.r_86bed8b7c460Input,
		output: generatedSchemas.r_86bed8b7c460Output,
	},
	'privateCAApi.putSetCaIssuanceCertConfig': {
		input: generatedSchemas.r_2ff5d2e16aebInput,
		output: generatedSchemas.r_2ff5d2e16aebOutput,
	},
	'privateCAApi.getGetCaCertificateChains': {
		input: generatedSchemas.r_dade4aa006edInput,
		output: generatedSchemas.r_dade4aa006edOutput,
	},
	'privateCAApi.postAddACertificateChainToACa': {
		input: generatedSchemas.r_15e6335cf9bcInput,
		output: generatedSchemas.r_15e6335cf9bcOutput,
	},
	'privateCAApi.deleteDeleteACertificateChain': {
		input: generatedSchemas.r_ef0e548901a2Input,
		output: generatedSchemas.r_ef0e548901a2Output,
	},
	'privateCAApi.getGetACertificateChain': {
		input: generatedSchemas.r_56ca5f9f8d8eInput,
		output: generatedSchemas.r_56ca5f9f8d8eOutput,
	},
	'privateCAApi.putUpdateACertificateChain': {
		input: generatedSchemas.r_3fb14506f402Input,
		output: generatedSchemas.r_3fb14506f402Output,
	},
	'privateCAApi.putSetIncludeAllCertsInCrl': {
		input: generatedSchemas.r_f328ec91fc11Input,
		output: generatedSchemas.r_f328ec91fc11Output,
	},
	'privateCAApi.getGetCaCrlIssuanceConfig': {
		input: generatedSchemas.r_fbe03c239006Input,
		output: generatedSchemas.r_fbe03c239006Output,
	},
	'privateCAApi.putSetCaCrlIssuanceConfig': {
		input: generatedSchemas.r_b532e61d0366Input,
		output: generatedSchemas.r_b532e61d0366Output,
	},
	'privateCAApi.getGetCaOcspGenerationConfig': {
		input: generatedSchemas.r_d4dfd7f5559cInput,
		output: generatedSchemas.r_d4dfd7f5559cOutput,
	},
	'privateCAApi.putSetCaOcspGenerationConfig': {
		input: generatedSchemas.r_614145d2f693Input,
		output: generatedSchemas.r_614145d2f693Output,
	},
	'privateCAApi.getGetCaOcspIssuanceConfig': {
		input: generatedSchemas.r_efc423513ee6Input,
		output: generatedSchemas.r_efc423513ee6Output,
	},
	'privateCAApi.putSetCaOcspIssuanceConfig': {
		input: generatedSchemas.r_ae80f0a2884cInput,
		output: generatedSchemas.r_ae80f0a2884cOutput,
	},
	'privateCAApi.getGetCaOcspResponderConfig': {
		input: generatedSchemas.r_09525a87a3feInput,
		output: generatedSchemas.r_09525a87a3feOutput,
	},
	'privateCAApi.putSetCaOcspResponderConfig': {
		input: generatedSchemas.r_39f8c394d7dcInput,
		output: generatedSchemas.r_39f8c394d7dcOutput,
	},
	'privateCAApi.putSetAdditionalSettings': {
		input: generatedSchemas.r_56a0935ca4e1Input,
		output: generatedSchemas.r_56a0935ca4e1Output,
	},
	'privateCAApi.getGetACaCsr': {
		input: generatedSchemas.r_c1a00107ddd8Input,
		output: generatedSchemas.r_c1a00107ddd8Output,
	},
	'privateCAApi.postDecryptAPkcs7': {
		input: generatedSchemas.r_f1ac9a204fdbInput,
		output: generatedSchemas.r_f1ac9a204fdbOutput,
	},
	'privateCAApi.getDownloadACa': {
		input: generatedSchemas.r_91c5268bb884Input,
		output: generatedSchemas.r_91c5268bb884Output,
	},
	'privateCAApi.postEncryptAPkcs7': {
		input: generatedSchemas.r_cf67da15ce78Input,
		output: generatedSchemas.r_cf67da15ce78Output,
	},
	'privateCAApi.getGetTheRootCaHierarchy': {
		input: generatedSchemas.r_85b7ca4c4f50Input,
		output: generatedSchemas.r_85b7ca4c4f50Output,
	},
	'privateCAApi.getGetCaNotes': {
		input: generatedSchemas.r_49bc49df9e00Input,
		output: generatedSchemas.r_49bc49df9e00Output,
	},
	'privateCAApi.postCreateCaNote': {
		input: generatedSchemas.r_7ecf8015ce52Input,
		output: generatedSchemas.r_7ecf8015ce52Output,
	},
	'privateCAApi.getGetCaOcspConfig': {
		input: generatedSchemas.r_c91c378818a5Input,
		output: generatedSchemas.r_c91c378818a5Output,
	},
	'privateCAApi.postRecertifiesExistingCaByCaId': {
		input: generatedSchemas.r_47971e5aadf2Input,
		output: generatedSchemas.r_47971e5aadf2Output,
	},
	'privateCAApi.postRecertifiesACaWithANewImportedCertificate': {
		input: generatedSchemas.r_81b7e6e852baInput,
		output: generatedSchemas.r_81b7e6e852baOutput,
	},
	'privateCAApi.postCreateCaReinstateRequest': {
		input: generatedSchemas.r_4530bfcae9b5Input,
		output: generatedSchemas.r_4530bfcae9b5Output,
	},
	'privateCAApi.getGetCaReinstateRequest': {
		input: generatedSchemas.r_0bd21da7c4c2Input,
		output: generatedSchemas.r_0bd21da7c4c2Output,
	},
	'privateCAApi.postApproveCaReinstateRequest': {
		input: generatedSchemas.r_40ec0307a789Input,
		output: generatedSchemas.r_40ec0307a789Output,
	},
	'privateCAApi.postRejectCaReinstateRequest': {
		input: generatedSchemas.r_811c3aab6f1aInput,
		output: generatedSchemas.r_811c3aab6f1aOutput,
	},
	'privateCAApi.postCreateCaRevokeRequest': {
		input: generatedSchemas.r_d98516ab704fInput,
		output: generatedSchemas.r_d98516ab704fOutput,
	},
	'privateCAApi.getGetCaRevokeRequest': {
		input: generatedSchemas.r_a4e740425499Input,
		output: generatedSchemas.r_a4e740425499Output,
	},
	'privateCAApi.postApproveCaRevokeRequest': {
		input: generatedSchemas.r_08eb17056280Input,
		output: generatedSchemas.r_08eb17056280Output,
	},
	'privateCAApi.postSignAnAttributeCertificate': {
		input: generatedSchemas.r_59ccb057dbe7Input,
		output: generatedSchemas.r_59ccb057dbe7Output,
	},
	'privateCAApi.postSignACmpRequest': {
		input: generatedSchemas.r_1050c0a3587aInput,
		output: generatedSchemas.r_1050c0a3587aOutput,
	},
	'privateCAApi.postSignAGlobalPlatformRequest': {
		input: generatedSchemas.r_13f16d161bfeInput,
		output: generatedSchemas.r_13f16d161bfeOutput,
	},
	'privateCAApi.getGetCaActiveStatus': {
		input: generatedSchemas.r_bfe1b8b2129aInput,
		output: generatedSchemas.r_bfe1b8b2129aOutput,
	},
	'privateCAApi.postSetCaActiveStatus': {
		input: generatedSchemas.r_1028c694e4f8Input,
		output: generatedSchemas.r_1028c694e4f8Output,
	},
	'privateCAApi.getGetCertificateExpiration': {
		input: generatedSchemas.r_79d35f25e203Input,
		output: generatedSchemas.r_79d35f25e203Output,
	},
	'privateCAApi.getGetAllCertificates': {
		input: generatedSchemas.r_adc5dc353665Input,
		output: generatedSchemas.r_adc5dc353665Output,
	},
	'privateCAApi.postImportACa': {
		input: generatedSchemas.r_2e0b14749b40Input,
		output: generatedSchemas.r_2e0b14749b40Output,
	},
	'privateCAApi.postLinkACaKey': {
		input: generatedSchemas.r_bed51bae8a4dInput,
		output: generatedSchemas.r_bed51bae8a4dOutput,
	},
	'privateCAApi.postImportAnOfflineCa': {
		input: generatedSchemas.r_9a3dba0916b3Input,
		output: generatedSchemas.r_9a3dba0916b3Output,
	},
	'privateCAApi.postImportAThirdPartyCa': {
		input: generatedSchemas.r_39765268d88fInput,
		output: generatedSchemas.r_39765268d88fOutput,
	},
	'privateCAApi.postCreateAPendingDelegatedOcspResponder': {
		input: generatedSchemas.r_96e6bdf242a9Input,
		output: generatedSchemas.r_96e6bdf242a9Output,
	},
	'privateCAApi.getGetAllCertificates_a2d39d9': {
		input: generatedSchemas.r_672dcfb0f9e0Input,
		output: generatedSchemas.r_672dcfb0f9e0Output,
	},
	'privateCAApi.postCreateCertificate': {
		input: generatedSchemas.r_62e5e3240f68Input,
		output: generatedSchemas.r_62e5e3240f68Output,
	},
	'privateCAApi.getGetCertificate': {
		input: generatedSchemas.r_652f18b2b4b6Input,
		output: generatedSchemas.r_652f18b2b4b6Output,
	},
	'privateCAApi.getRecoverEscrowedEeKey': {
		input: generatedSchemas.r_0c3e91de6873Input,
		output: generatedSchemas.r_0c3e91de6873Output,
	},
	'privateCAApi.putRevokeCertificate': {
		input: generatedSchemas.r_80834d3f81b9Input,
		output: generatedSchemas.r_80834d3f81b9Output,
	},
	'privateCAApi.getGetCsvListOfCertificates': {
		input: generatedSchemas.r_a2ed911770eaInput,
		output: generatedSchemas.r_a2ed911770eaOutput,
	},
	'privateCAApi.postImportACertificate': {
		input: generatedSchemas.r_1343adaa2bdbInput,
		output: generatedSchemas.r_1343adaa2bdbOutput,
	},
	'privateCAApi.getGetAllCrlInfos': {
		input: generatedSchemas.r_f55c3dc3abceInput,
		output: generatedSchemas.r_f55c3dc3abceOutput,
	},
	'privateCAApi.postAddCrlInfos': {
		input: generatedSchemas.r_b4cfb481a98cInput,
		output: generatedSchemas.r_b4cfb481a98cOutput,
	},
	'privateCAApi.getGetCrlInfo': {
		input: generatedSchemas.r_865bfb3a91f3Input,
		output: generatedSchemas.r_865bfb3a91f3Output,
	},
	'privateCAApi.getGetCrlBlobList': {
		input: generatedSchemas.r_4538e37bbe0dInput,
		output: generatedSchemas.r_4538e37bbe0dOutput,
	},
	'privateCAApi.postImportCrlBlob': {
		input: generatedSchemas.r_90bc1797ca46Input,
		output: generatedSchemas.r_90bc1797ca46Output,
	},
	'privateCAApi.getGetCrlBlob': {
		input: generatedSchemas.r_bd131d63be89Input,
		output: generatedSchemas.r_bd131d63be89Output,
	},
	'privateCAApi.getGetCrlConfig': {
		input: generatedSchemas.r_611f78545acbInput,
		output: generatedSchemas.r_611f78545acbOutput,
	},
	'privateCAApi.putSetCrlConfig': {
		input: generatedSchemas.r_f35b7c3e0b8aInput,
		output: generatedSchemas.r_f35b7c3e0b8aOutput,
	},
	'privateCAApi.postCreateCrlNow': {
		input: generatedSchemas.r_7dc5f63f47d9Input,
		output: generatedSchemas.r_7dc5f63f47d9Output,
	},
	'privateCAApi.postImportAClientKey': {
		input: generatedSchemas.r_471f260d6e40Input,
		output: generatedSchemas.r_471f260d6e40Output,
	},
	'privateCAApi.getGetFedRampComplianceEvidence': {
		input: generatedSchemas.r_514ed64de87dInput,
		output: generatedSchemas.r_514ed64de87dOutput,
	},
	'privateCAApi.getGetHsmPartitions': {
		input: generatedSchemas.r_860e43c6a58aInput,
		output: generatedSchemas.r_860e43c6a58aOutput,
	},
	'privateCAApi.postCreateAnOcspResponder': {
		input: generatedSchemas.r_07af58d0eb37Input,
		output: generatedSchemas.r_07af58d0eb37Output,
	},
	'privateCAApi.getGetAnOcspResponder': {
		input: generatedSchemas.r_aaa0dcb230feInput,
		output: generatedSchemas.r_aaa0dcb230feOutput,
	},
	'privateCAApi.putSetAnOcspResponderStatus': {
		input: generatedSchemas.r_aee3d7f5a977Input,
		output: generatedSchemas.r_aee3d7f5a977Output,
	},
	'privateCAApi.putSetAnOcspBlob': {
		input: generatedSchemas.r_6ea9c4afe524Input,
		output: generatedSchemas.r_6ea9c4afe524Output,
	},
	'privateCAApi.getDownloadAnOcspResponderCsr': {
		input: generatedSchemas.r_c70a8bd812d1Input,
		output: generatedSchemas.r_c70a8bd812d1Output,
	},
	'privateCAApi.postImportAnOcspResponder': {
		input: generatedSchemas.r_8c26364ba4e1Input,
		output: generatedSchemas.r_8c26364ba4e1Output,
	},
	'privateCAApi.postCreateAPendingOcspResponder': {
		input: generatedSchemas.r_8fc8acf59dceInput,
		output: generatedSchemas.r_8fc8acf59dceOutput,
	},
	'privateCAApi.getGetAllOcspResponders': {
		input: generatedSchemas.r_e6f593872eaaInput,
		output: generatedSchemas.r_e6f593872eaaOutput,
	},
	'privateCAApi.getHandleScepGetOperations': {
		input: generatedSchemas.r_8368e7d73f61Input,
		output: generatedSchemas.r_8368e7d73f61Output,
	},
	'privateCAApi.postHandleScepPkiOperation': {
		input: generatedSchemas.r_61fda20c9ab6Input,
		output: generatedSchemas.r_61fda20c9ab6Output,
	},
	'privateCAApi.getGetCertificateTemplates': {
		input: generatedSchemas.r_39c28941d620Input,
		output: generatedSchemas.r_39c28941d620Output,
	},
	'privateCAApi.postCreateACustomCertificateTemplate': {
		input: generatedSchemas.r_14f3953c0d38Input,
		output: generatedSchemas.r_14f3953c0d38Output,
	},
	'privateCAApi.getGetACertificateTemplate': {
		input: generatedSchemas.r_2a9e994a5917Input,
		output: generatedSchemas.r_2a9e994a5917Output,
	},
	'privateCAApi.putUpdateACustomCertificateTemplate': {
		input: generatedSchemas.r_e631ae341675Input,
		output: generatedSchemas.r_e631ae341675Output,
	},
	'privateCAApi.getGetAAccountsCertificateTemplateIsAssignedTo': {
		input: generatedSchemas.r_f46d472400ecInput,
		output: generatedSchemas.r_f46d472400ecOutput,
	},
	'privateCAApi.putActivateACustomCertificateTemplate': {
		input: generatedSchemas.r_198e7a38a10cInput,
		output: generatedSchemas.r_198e7a38a10cOutput,
	},
	'privateCAApi.putDeactivateACustomCertificateTemplate': {
		input: generatedSchemas.r_3de0b5e30515Input,
		output: generatedSchemas.r_3de0b5e30515Output,
	},
	'privateCAApi.postVerifyAsn1Template': {
		input: generatedSchemas.r_7784c95351dfInput,
		output: generatedSchemas.r_7784c95351dfOutput,
	},
	'privateCAApi.getGetCertificateTemplateValidationSchemas': {
		input: generatedSchemas.r_908be7c77f53Input,
		output: generatedSchemas.r_908be7c77f53Output,
	},
	'privateCAApi.getGetCertificateTemplateValidationSchemas_4fe4fdb': {
		input: generatedSchemas.r_5ba49344c30fInput,
		output: generatedSchemas.r_5ba49344c30fOutput,
	},
	'trustLifecycleApi.recreateAcmecredentialsPublic': {
		input: generatedSchemas.r_2eeb27b0266eInput,
		output: generatedSchemas.r_2eeb27b0266eOutput,
	},
	'trustLifecycleApi.addSystemScanUsingPostpublic': {
		input: generatedSchemas.r_145c99f05651Input,
		output: generatedSchemas.r_145c99f05651Output,
	},
	'trustLifecycleApi.abortSystemScanUsingPostpublic': {
		input: generatedSchemas.r_99ffa6002270Input,
		output: generatedSchemas.r_99ffa6002270Output,
	},
	'trustLifecycleApi.suspendSystemScanUsingPostpublic': {
		input: generatedSchemas.r_ed3ac2b880e3Input,
		output: generatedSchemas.r_ed3ac2b880e3Output,
	},
	'trustLifecycleApi.resumeSystemScanUsingPostpublic': {
		input: generatedSchemas.r_214735411dd4Input,
		output: generatedSchemas.r_214735411dd4Output,
	},
	'trustLifecycleApi.skipFutureSystemScanScheduleUsingPostpublic': {
		input: generatedSchemas.r_98ae93786afeInput,
		output: generatedSchemas.r_98ae93786afeOutput,
	},
	'trustLifecycleApi.restoreSystemScanScheduleUsingPostpublic': {
		input: generatedSchemas.r_b907984f070bInput,
		output: generatedSchemas.r_b907984f070bOutput,
	},
	'trustLifecycleApi.deletePastSystemScanUsingPostpublic': {
		input: generatedSchemas.r_1e4c8b4f1269Input,
		output: generatedSchemas.r_1e4c8b4f1269Output,
	},
	'trustLifecycleApi.listUpcomingSystemScansUsingGetpublic': {
		input: generatedSchemas.r_73d4daf6bd17Input,
		output: generatedSchemas.r_73d4daf6bd17Output,
	},
	'trustLifecycleApi.listPastSystemScansUsingGetpublic': {
		input: generatedSchemas.r_a4a835e15a4fInput,
		output: generatedSchemas.r_a4a835e15a4fOutput,
	},
	'trustLifecycleApi.getListAgents': {
		input: generatedSchemas.r_b1de500e018cInput,
		output: generatedSchemas.r_b1de500e018cOutput,
	},
	'trustLifecycleApi.getGetAgentById': {
		input: generatedSchemas.r_b5bd22f27e1dInput,
		output: generatedSchemas.r_b5bd22f27e1dOutput,
	},
	'trustLifecycleApi.updateCertDeliveryLocationForAgentPostpublic': {
		input: generatedSchemas.r_308eb2d1df1cInput,
		output: generatedSchemas.r_308eb2d1df1cOutput,
	},
	'trustLifecycleApi.putApproveAgents': {
		input: generatedSchemas.r_920a440ee1dfInput,
		output: generatedSchemas.r_920a440ee1dfOutput,
	},
	'trustLifecycleApi.putVoidAgents': {
		input: generatedSchemas.r_0b702b08d456Input,
		output: generatedSchemas.r_0b702b08d456Output,
	},
	'trustLifecycleApi.putUpdateAgent': {
		input: generatedSchemas.r_5e7f03054b55Input,
		output: generatedSchemas.r_5e7f03054b55Output,
	},
	'trustLifecycleApi.putRetryAgentConfig': {
		input: generatedSchemas.r_5c203004de20Input,
		output: generatedSchemas.r_5c203004de20Output,
	},
	'trustLifecycleApi.postPostAgentSuggestions': {
		input: generatedSchemas.r_97fb243f7243Input,
		output: generatedSchemas.r_97fb243f7243Output,
	},
	'trustLifecycleApi.getListAgentScripts': {
		input: generatedSchemas.r_1664e1d5afc5Input,
		output: generatedSchemas.r_1664e1d5afc5Output,
	},
	'trustLifecycleApi.postPostAgentScript': {
		input: generatedSchemas.r_99797a8dc240Input,
		output: generatedSchemas.r_99797a8dc240Output,
	},
	'trustLifecycleApi.getGetAgentScriptById': {
		input: generatedSchemas.r_b4f767ee3a21Input,
		output: generatedSchemas.r_b4f767ee3a21Output,
	},
	'trustLifecycleApi.putUpdateAgentScript': {
		input: generatedSchemas.r_92967c73d90eInput,
		output: generatedSchemas.r_92967c73d90eOutput,
	},
	'trustLifecycleApi.postAddAgentScriptsInBulk': {
		input: generatedSchemas.r_28403eaf35f7Input,
		output: generatedSchemas.r_28403eaf35f7Output,
	},
	'trustLifecycleApi.putSuspendAgents': {
		input: generatedSchemas.r_692763a58cdaInput,
		output: generatedSchemas.r_692763a58cdaOutput,
	},
	'trustLifecycleApi.putRejectAgents': {
		input: generatedSchemas.r_14cebde31ad8Input,
		output: generatedSchemas.r_14cebde31ad8Output,
	},
	'trustLifecycleApi.putReinstateAgents': {
		input: generatedSchemas.r_6873b02914f1Input,
		output: generatedSchemas.r_6873b02914f1Output,
	},
	'trustLifecycleApi.getGetGlobalAgentSettings': {
		input: generatedSchemas.r_cd67d7ceb107Input,
		output: generatedSchemas.r_cd67d7ceb107Output,
	},
	'trustLifecycleApi.putUpdateGlobalAgentSettings': {
		input: generatedSchemas.r_2b409ddd1947Input,
		output: generatedSchemas.r_2b409ddd1947Output,
	},
	'trustLifecycleApi.postCreateGlobalAgentSettings': {
		input: generatedSchemas.r_f8e988a67b87Input,
		output: generatedSchemas.r_f8e988a67b87Output,
	},
	'trustLifecycleApi.createAutomationUsingPost': {
		input: generatedSchemas.r_90ec560047bdInput,
		output: generatedSchemas.r_90ec560047bdOutput,
	},
	'trustLifecycleApi.createAwrAutomationUsingPost': {
		input: generatedSchemas.r_e3b44e3e638bInput,
		output: generatedSchemas.r_e3b44e3e638bOutput,
	},
	'trustLifecycleApi.checkEligibilityOfBulkAutomationUsingPost': {
		input: generatedSchemas.r_4470d3e39ef2Input,
		output: generatedSchemas.r_4470d3e39ef2Output,
	},
	'trustLifecycleApi.requestBulkAutomationUsingPost': {
		input: generatedSchemas.r_c0eb04e32216Input,
		output: generatedSchemas.r_c0eb04e32216Output,
	},
	'trustLifecycleApi.getAutomationDetailsUsingGet': {
		input: generatedSchemas.r_710554dcec90Input,
		output: generatedSchemas.r_710554dcec90Output,
	},
	'trustLifecycleApi.updateAutomationUsingPut': {
		input: generatedSchemas.r_bcabad219d28Input,
		output: generatedSchemas.r_bcabad219d28Output,
	},
	'trustLifecycleApi.retryAutomationUsingPut': {
		input: generatedSchemas.r_fdcddee44a8eInput,
		output: generatedSchemas.r_fdcddee44a8eOutput,
	},
	'trustLifecycleApi.cancelAutomationUsingPut': {
		input: generatedSchemas.r_f993fc71dd6cInput,
		output: generatedSchemas.r_f993fc71dd6cOutput,
	},
	'trustLifecycleApi.listAutomationInventory': {
		input: generatedSchemas.r_948c3283fb77Input,
		output: generatedSchemas.r_948c3283fb77Output,
	},
	'trustLifecycleApi.getInventoryDetailsUsingGet': {
		input: generatedSchemas.r_ef7eddd600a0Input,
		output: generatedSchemas.r_ef7eddd600a0Output,
	},
	'trustLifecycleApi.getListBusinessUnit': {
		input: generatedSchemas.r_382f226cdcf4Input,
		output: generatedSchemas.r_382f226cdcf4Output,
	},
	'trustLifecycleApi.postCreateBusinessUnit': {
		input: generatedSchemas.r_5bec67c21dcfInput,
		output: generatedSchemas.r_5bec67c21dcfOutput,
	},
	'trustLifecycleApi.getGetBusinessUnitById': {
		input: generatedSchemas.r_162c051d7b24Input,
		output: generatedSchemas.r_162c051d7b24Output,
	},
	'trustLifecycleApi.deleteDeleteBusinessUnit': {
		input: generatedSchemas.r_38929d3c5c45Input,
		output: generatedSchemas.r_38929d3c5c45Output,
	},
	'trustLifecycleApi.putUpdateBusinessUnitLicense': {
		input: generatedSchemas.r_e130670d7f5aInput,
		output: generatedSchemas.r_e130670d7f5aOutput,
	},
	'trustLifecycleApi.putAssignAnAdminToABusinessUnit': {
		input: generatedSchemas.r_59f4fecff54aInput,
		output: generatedSchemas.r_59f4fecff54aOutput,
	},
	'trustLifecycleApi.deleteRemoveAnAdminFromABusinessUnit': {
		input: generatedSchemas.r_78c077df3817Input,
		output: generatedSchemas.r_78c077df3817Output,
	},
	'trustLifecycleApi.getListCertificateOwners': {
		input: generatedSchemas.r_23c269effbe6Input,
		output: generatedSchemas.r_23c269effbe6Output,
	},
	'trustLifecycleApi.postCreateCertificateOwners': {
		input: generatedSchemas.r_e254ce295d12Input,
		output: generatedSchemas.r_e254ce295d12Output,
	},
	'trustLifecycleApi.getGetCertificateOwnerById': {
		input: generatedSchemas.r_589d79d3192eInput,
		output: generatedSchemas.r_589d79d3192eOutput,
	},
	'trustLifecycleApi.putUpdateCertificateOwnerDetailsForAGivenCertificateOwnerId':
		{
			input: generatedSchemas.r_c0711fd42515Input,
			output: generatedSchemas.r_c0711fd42515Output,
		},
	'trustLifecycleApi.deleteDeleteCertificateOwner': {
		input: generatedSchemas.r_9f6fcd99fd97Input,
		output: generatedSchemas.r_9f6fcd99fd97Output,
	},
	'trustLifecycleApi.putAddCertificateOwnersMappingForCertificate': {
		input: generatedSchemas.r_08c5118e8629Input,
		output: generatedSchemas.r_08c5118e8629Output,
	},
	'trustLifecycleApi.deleteDeleteCertificateOwnerMappingsForACertificate': {
		input: generatedSchemas.r_a4a3093d5297Input,
		output: generatedSchemas.r_a4a3093d5297Output,
	},
	'trustLifecycleApi.postIssueCertificate': {
		input: generatedSchemas.r_4ea70ee9ce09Input,
		output: generatedSchemas.r_4ea70ee9ce09Output,
	},
	'trustLifecycleApi.postPickUpCertificate': {
		input: generatedSchemas.r_aba4f70417deInput,
		output: generatedSchemas.r_aba4f70417deOutput,
	},
	'trustLifecycleApi.postApproveEscrowedCertificateRecovery': {
		input: generatedSchemas.r_ef37eb3829e2Input,
		output: generatedSchemas.r_ef37eb3829e2Output,
	},
	'trustLifecycleApi.postRenewCertificate': {
		input: generatedSchemas.r_b8f4fd999e91Input,
		output: generatedSchemas.r_b8f4fd999e91Output,
	},
	'trustLifecycleApi.postBulkUpdateTags': {
		input: generatedSchemas.r_c6787b39d482Input,
		output: generatedSchemas.r_c6787b39d482Output,
	},
	'trustLifecycleApi.postBulkReplaceTags': {
		input: generatedSchemas.r_15baf5205f5fInput,
		output: generatedSchemas.r_15baf5205f5fOutput,
	},
	'trustLifecycleApi.postImportCertificate': {
		input: generatedSchemas.r_795aa866d75eInput,
		output: generatedSchemas.r_795aa866d75eOutput,
	},
	'trustLifecycleApi.getSearchCertificates': {
		input: generatedSchemas.r_cd0ce04fc2f9Input,
		output: generatedSchemas.r_cd0ce04fc2f9Output,
	},
	'trustLifecycleApi.publicCertificateSearchSummary': {
		input: generatedSchemas.r_47b5ee161d58Input,
		output: generatedSchemas.r_47b5ee161d58Output,
	},
	'trustLifecycleApi.publicGetCertUsingId': {
		input: generatedSchemas.r_cb5f6a5e8c6eInput,
		output: generatedSchemas.r_cb5f6a5e8c6eOutput,
	},
	'trustLifecycleApi.getGetCertificateBySerialNumber': {
		input: generatedSchemas.r_c1e6841c6826Input,
		output: generatedSchemas.r_c1e6841c6826Output,
	},
	'trustLifecycleApi.postRecoverEscrowedCertificateBySerialNumber': {
		input: generatedSchemas.r_b85de13db956Input,
		output: generatedSchemas.r_b85de13db956Output,
	},
	'trustLifecycleApi.certRevokeBySerial': {
		input: generatedSchemas.r_d7ae6dc4292dInput,
		output: generatedSchemas.r_d7ae6dc4292dOutput,
	},
	'trustLifecycleApi.deleteResumeSuspendedCertificate': {
		input: generatedSchemas.r_32308d9d0956Input,
		output: generatedSchemas.r_32308d9d0956Output,
	},
	'trustLifecycleApi.getAdditionalFormatsBySerialNumber': {
		input: generatedSchemas.r_e81b68e657ccInput,
		output: generatedSchemas.r_e81b68e657ccOutput,
	},
	'trustLifecycleApi.publicCountCertificateMigrationCandidates': {
		input: generatedSchemas.r_00aaa42b68c2Input,
		output: generatedSchemas.r_00aaa42b68c2Output,
	},
	'trustLifecycleApi.publicGetCertificateMigrationCandidates': {
		input: generatedSchemas.r_a09ad9571231Input,
		output: generatedSchemas.r_a09ad9571231Output,
	},
	'trustLifecycleApi.createUsingPost1': {
		input: generatedSchemas.r_565bb358f1fcInput,
		output: generatedSchemas.r_565bb358f1fcOutput,
	},
	'trustLifecycleApi.listByAccountUsingPost': {
		input: generatedSchemas.r_c4f2ebc60dafInput,
		output: generatedSchemas.r_c4f2ebc60dafOutput,
	},
	'trustLifecycleApi.suggestionsUsingGet': {
		input: generatedSchemas.r_cac1d643fd7dInput,
		output: generatedSchemas.r_cac1d643fd7dOutput,
	},
	'trustLifecycleApi.getDetailsByIdUsingGet': {
		input: generatedSchemas.r_9fdfa9ff199aInput,
		output: generatedSchemas.r_9fdfa9ff199aOutput,
	},
	'trustLifecycleApi.updateUsingPut1': {
		input: generatedSchemas.r_6ae814861232Input,
		output: generatedSchemas.r_6ae814861232Output,
	},
	'trustLifecycleApi.deleteByIdUsingDelete': {
		input: generatedSchemas.r_ddbe3acdfffaInput,
		output: generatedSchemas.r_ddbe3acdfffaOutput,
	},
	'trustLifecycleApi.runNowUsingPost': {
		input: generatedSchemas.r_cd2034a0a43dInput,
		output: generatedSchemas.r_cd2034a0a43dOutput,
	},
	'trustLifecycleApi.stopUsingPost': {
		input: generatedSchemas.r_e97c7e325ac0Input,
		output: generatedSchemas.r_e97c7e325ac0Output,
	},
	'trustLifecycleApi.testConnectionUsingPost': {
		input: generatedSchemas.r_3ae1daaeb731Input,
		output: generatedSchemas.r_3ae1daaeb731Output,
	},
	'trustLifecycleApi.unlinkUsingPost': {
		input: generatedSchemas.r_c594c0e3a8d1Input,
		output: generatedSchemas.r_c594c0e3a8d1Output,
	},
	'trustLifecycleApi.getConnectorMetadataUsingGet': {
		input: generatedSchemas.r_2b39cff6b19aInput,
		output: generatedSchemas.r_2b39cff6b19aOutput,
	},
	'trustLifecycleApi.getListCustomAttributes': {
		input: generatedSchemas.r_13488561d95dInput,
		output: generatedSchemas.r_13488561d95dOutput,
	},
	'trustLifecycleApi.postCreateCustomAttribute': {
		input: generatedSchemas.r_0d465a62c1baInput,
		output: generatedSchemas.r_0d465a62c1baOutput,
	},
	'trustLifecycleApi.getListCustomAttributesForCertificate': {
		input: generatedSchemas.r_ffd3d18f94d9Input,
		output: generatedSchemas.r_ffd3d18f94d9Output,
	},
	'trustLifecycleApi.putAddCustomAttributesMappingForCertificate': {
		input: generatedSchemas.r_9c0ee24ba5a8Input,
		output: generatedSchemas.r_9c0ee24ba5a8Output,
	},
	'trustLifecycleApi.deleteDeleteCustomAttributesMappingForCertificate': {
		input: generatedSchemas.r_7593ade75363Input,
		output: generatedSchemas.r_7593ade75363Output,
	},
	'trustLifecycleApi.getGetCustomAttributeById': {
		input: generatedSchemas.r_38b65a4ff043Input,
		output: generatedSchemas.r_38b65a4ff043Output,
	},
	'trustLifecycleApi.putUpdateCustomAttribute': {
		input: generatedSchemas.r_aa2372f83a2eInput,
		output: generatedSchemas.r_aa2372f83a2eOutput,
	},
	'trustLifecycleApi.deleteDeleteCustomAttribute': {
		input: generatedSchemas.r_d11c9f59c2deInput,
		output: generatedSchemas.r_d11c9f59c2deOutput,
	},
	'trustLifecycleApi.getCertificateCountsBySourceTypes': {
		input: generatedSchemas.r_f31cdd16607bInput,
		output: generatedSchemas.r_f31cdd16607bOutput,
	},
	'trustLifecycleApi.deleteCertificatesBySourceTypes': {
		input: generatedSchemas.r_413eadd6d21dInput,
		output: generatedSchemas.r_413eadd6d21dOutput,
	},
	'trustLifecycleApi.getListDevices': {
		input: generatedSchemas.r_90e92b7da5a3Input,
		output: generatedSchemas.r_90e92b7da5a3Output,
	},
	'trustLifecycleApi.postAddDevices': {
		input: generatedSchemas.r_a1438d4fc523Input,
		output: generatedSchemas.r_a1438d4fc523Output,
	},
	'trustLifecycleApi.deleteDeleteDevicesBulk': {
		input: generatedSchemas.r_e0d550d921c4Input,
		output: generatedSchemas.r_e0d550d921c4Output,
	},
	'trustLifecycleApi.getGetDevice': {
		input: generatedSchemas.r_db452f94fae3Input,
		output: generatedSchemas.r_db452f94fae3Output,
	},
	'trustLifecycleApi.putUpdateDevice': {
		input: generatedSchemas.r_38524550bc70Input,
		output: generatedSchemas.r_38524550bc70Output,
	},
	'trustLifecycleApi.deleteDeleteDevice': {
		input: generatedSchemas.r_01008ef1501aInput,
		output: generatedSchemas.r_01008ef1501aOutput,
	},
	'trustLifecycleApi.postImportDevicesFromCsv': {
		input: generatedSchemas.r_6ac8994ec3c4Input,
		output: generatedSchemas.r_6ac8994ec3c4Output,
	},
	'trustLifecycleApi.getExportDevicesToCsv': {
		input: generatedSchemas.r_2ff73ca5e82fInput,
		output: generatedSchemas.r_2ff73ca5e82fOutput,
	},
	'trustLifecycleApi.putLinkDevicesToAProfile': {
		input: generatedSchemas.r_371fd4d4a326Input,
		output: generatedSchemas.r_371fd4d4a326Output,
	},
	'trustLifecycleApi.putUnlinkDevicesFromAProfile': {
		input: generatedSchemas.r_27064376ccadInput,
		output: generatedSchemas.r_27064376ccadOutput,
	},
	'trustLifecycleApi.putBulkMapDevicesToProfiles': {
		input: generatedSchemas.r_b106e7869ed7Input,
		output: generatedSchemas.r_b106e7869ed7Output,
	},
	'trustLifecycleApi.deleteBulkUnmapDevicesFromProfiles': {
		input: generatedSchemas.r_67f447c0dbdcInput,
		output: generatedSchemas.r_67f447c0dbdcOutput,
	},
	'trustLifecycleApi.getUnsecured': {
		input: generatedSchemas.r_21affda0f31fInput,
		output: generatedSchemas.r_21affda0f31fOutput,
	},
	'trustLifecycleApi.getUnsecuredCount': {
		input: generatedSchemas.r_99aba927208cInput,
		output: generatedSchemas.r_99aba927208cOutput,
	},
	'trustLifecycleApi.getPortletCount': {
		input: generatedSchemas.r_427ad84ed835Input,
		output: generatedSchemas.r_427ad84ed835Output,
	},
	'trustLifecycleApi.getAutomatableEndpoint': {
		input: generatedSchemas.r_832902848134Input,
		output: generatedSchemas.r_832902848134Output,
	},
	'trustLifecycleApi.getAutomatableCount': {
		input: generatedSchemas.r_ae14a0cad4edInput,
		output: generatedSchemas.r_ae14a0cad4edOutput,
	},
	'trustLifecycleApi.getInventoryDetails': {
		input: generatedSchemas.r_a7822a6bdea6Input,
		output: generatedSchemas.r_a7822a6bdea6Output,
	},
	'trustLifecycleApi.getDiscoveredEndpoints': {
		input: generatedSchemas.r_659d2b8e8aceInput,
		output: generatedSchemas.r_659d2b8e8aceOutput,
	},
	'trustLifecycleApi.getDiscoveredEndpointsCount': {
		input: generatedSchemas.r_4a9d25a10305Input,
		output: generatedSchemas.r_4a9d25a10305Output,
	},
	'trustLifecycleApi.getInstancesList': {
		input: generatedSchemas.r_eaa4afa67b1cInput,
		output: generatedSchemas.r_eaa4afa67b1cOutput,
	},
	'trustLifecycleApi.postCreateEnrollment': {
		input: generatedSchemas.r_889a59dc528aInput,
		output: generatedSchemas.r_889a59dc528aOutput,
	},
	'trustLifecycleApi.postRedeemEnrollment': {
		input: generatedSchemas.r_604d6ac29079Input,
		output: generatedSchemas.r_604d6ac29079Output,
	},
	'trustLifecycleApi.putUpdateStatusOfManualApprovalEnrollment': {
		input: generatedSchemas.r_6d7a2c7d5b92Input,
		output: generatedSchemas.r_6d7a2c7d5b92Output,
	},
	'trustLifecycleApi.getGetEnrollmentDetailsByEnrollmentCode': {
		input: generatedSchemas.r_c1244e33b2b4Input,
		output: generatedSchemas.r_c1244e33b2b4Output,
	},
	'trustLifecycleApi.getListEnrollments': {
		input: generatedSchemas.r_fa40e5e88461Input,
		output: generatedSchemas.r_fa40e5e88461Output,
	},
	'trustLifecycleApi.getGetEnrollmentDetailsById': {
		input: generatedSchemas.r_4ef7dea657b7Input,
		output: generatedSchemas.r_4ef7dea657b7Output,
	},
	'trustLifecycleApi.postCreateEnrollmentForManualApproval': {
		input: generatedSchemas.r_2edfe1f4b869Input,
		output: generatedSchemas.r_2edfe1f4b869Output,
	},
	'trustLifecycleApi.getAttributesOfRenewableCertificateUsingCertIdUsingGet': {
		input: generatedSchemas.r_2b49885a43e5Input,
		output: generatedSchemas.r_2b49885a43e5Output,
	},
	'trustLifecycleApi.postRenewCertificateEnrollmentUsingCertificateId': {
		input: generatedSchemas.r_a730dc9722bbInput,
		output: generatedSchemas.r_a730dc9722bbOutput,
	},
	'trustLifecycleApi.handleGetCaCertsOperationUsingGet': {
		input: generatedSchemas.r_a38f059e2a70Input,
		output: generatedSchemas.r_a38f059e2a70Output,
	},
	'trustLifecycleApi.handleSimpleEnrollOperationUsingPost': {
		input: generatedSchemas.r_aa991ba230c3Input,
		output: generatedSchemas.r_aa991ba230c3Output,
	},
	'trustLifecycleApi.handleSimpleReEnrollOperationUsingPost': {
		input: generatedSchemas.r_af7ddf1c733dInput,
		output: generatedSchemas.r_af7ddf1c733dOutput,
	},
	'trustLifecycleApi.listSensorIntegrations': {
		input: generatedSchemas.r_e827e3bec28aInput,
		output: generatedSchemas.r_e827e3bec28aOutput,
	},
	'trustLifecycleApi.createSensorIntegration': {
		input: generatedSchemas.r_fe3221ef0855Input,
		output: generatedSchemas.r_fe3221ef0855Output,
	},
	'trustLifecycleApi.getSensorIntegrationById': {
		input: generatedSchemas.r_cf48324a6d66Input,
		output: generatedSchemas.r_cf48324a6d66Output,
	},
	'trustLifecycleApi.refreshSensorIntegration': {
		input: generatedSchemas.r_31f08184b392Input,
		output: generatedSchemas.r_31f08184b392Output,
	},
	'trustLifecycleApi.getGetListOfDnsIntegrations': {
		input: generatedSchemas.r_5f0c91e25af4Input,
		output: generatedSchemas.r_5f0c91e25af4Output,
	},
	'trustLifecycleApi.postBulkVoid': {
		input: generatedSchemas.r_090e1558aef3Input,
		output: generatedSchemas.r_090e1558aef3Output,
	},
	'trustLifecycleApi.postVoidById': {
		input: generatedSchemas.r_a12209ad174fInput,
		output: generatedSchemas.r_a12209ad174fOutput,
	},
	'trustLifecycleApi.getSensorIntegrationAppParameters': {
		input: generatedSchemas.r_a7f9ba1b6636Input,
		output: generatedSchemas.r_a7f9ba1b6636Output,
	},
	'trustLifecycleApi.postCreateANewProfile': {
		input: generatedSchemas.r_cd234014f0ffInput,
		output: generatedSchemas.r_cd234014f0ffOutput,
	},
	'trustLifecycleApi.putUpdateProfile': {
		input: generatedSchemas.r_9a2ea6339160Input,
		output: generatedSchemas.r_9a2ea6339160Output,
	},
	'trustLifecycleApi.getListProfiles': {
		input: generatedSchemas.r_b31cfc3255d8Input,
		output: generatedSchemas.r_b31cfc3255d8Output,
	},
	'trustLifecycleApi.getGetProfileById': {
		input: generatedSchemas.r_9cd9f0927b03Input,
		output: generatedSchemas.r_9cd9f0927b03Output,
	},
	'trustLifecycleApi.getListProfiles_a46d97c': {
		input: generatedSchemas.r_87c7a8fcf2c3Input,
		output: generatedSchemas.r_87c7a8fcf2c3Output,
	},
	'trustLifecycleApi.getGetProfileById_2316fef': {
		input: generatedSchemas.r_beff76538781Input,
		output: generatedSchemas.r_beff76538781Output,
	},
	'trustLifecycleApi.getGetEnrollmentCodeReport': {
		input: generatedSchemas.r_ddb85158bd5dInput,
		output: generatedSchemas.r_ddb85158bd5dOutput,
	},
	'trustLifecycleApi.getListAuditLogs': {
		input: generatedSchemas.r_8544e8ac7f57Input,
		output: generatedSchemas.r_8544e8ac7f57Output,
	},
	'trustLifecycleApi.getGetAuditLogEventById': {
		input: generatedSchemas.r_fb0b80993f03Input,
		output: generatedSchemas.r_fb0b80993f03Output,
	},
	'trustLifecycleApi.getGetAuditLogCount': {
		input: generatedSchemas.r_f27878dd7018Input,
		output: generatedSchemas.r_f27878dd7018Output,
	},
	'trustLifecycleApi.getListRules': {
		input: generatedSchemas.r_10c05d173009Input,
		output: generatedSchemas.r_10c05d173009Output,
	},
	'trustLifecycleApi.postCreateRule': {
		input: generatedSchemas.r_936d50859847Input,
		output: generatedSchemas.r_936d50859847Output,
	},
	'trustLifecycleApi.deleteDeleteRules': {
		input: generatedSchemas.r_fba0a11d0af9Input,
		output: generatedSchemas.r_fba0a11d0af9Output,
	},
	'trustLifecycleApi.getGetRuleById': {
		input: generatedSchemas.r_39fd79124781Input,
		output: generatedSchemas.r_39fd79124781Output,
	},
	'trustLifecycleApi.putUpdateRule': {
		input: generatedSchemas.r_d1a0900ac1cdInput,
		output: generatedSchemas.r_d1a0900ac1cdOutput,
	},
	'trustLifecycleApi.postRunRuleNow': {
		input: generatedSchemas.r_2c4418daa501Input,
		output: generatedSchemas.r_2c4418daa501Output,
	},
	'trustLifecycleApi.listOfScansUsingGet': {
		input: generatedSchemas.r_716491633306Input,
		output: generatedSchemas.r_716491633306Output,
	},
	'trustLifecycleApi.addScanUsingPost': {
		input: generatedSchemas.r_f41e8938ed63Input,
		output: generatedSchemas.r_f41e8938ed63Output,
	},
	'trustLifecycleApi.deleteScanUsingPost': {
		input: generatedSchemas.r_3cab39f7decfInput,
		output: generatedSchemas.r_3cab39f7decfOutput,
	},
	'trustLifecycleApi.editScanUsingPut': {
		input: generatedSchemas.r_0d8b21f3f0fcInput,
		output: generatedSchemas.r_0d8b21f3f0fcOutput,
	},
	'trustLifecycleApi.getDetailsUsingGet1': {
		input: generatedSchemas.r_dc1a10c2c3a6Input,
		output: generatedSchemas.r_dc1a10c2c3a6Output,
	},
	'trustLifecycleApi.abortScanUsingPost': {
		input: generatedSchemas.r_38f57b41183dInput,
		output: generatedSchemas.r_38f57b41183dOutput,
	},
	'trustLifecycleApi.publicListPastScansUsingGet': {
		input: generatedSchemas.r_3b605dc8977cInput,
		output: generatedSchemas.r_3b605dc8977cOutput,
	},
	'trustLifecycleApi.validateIpFqdnsPost': {
		input: generatedSchemas.r_10508ac747cdInput,
		output: generatedSchemas.r_10508ac747cdOutput,
	},
	'trustLifecycleApi.checkScanExistPost': {
		input: generatedSchemas.r_feb002186f05Input,
		output: generatedSchemas.r_feb002186f05Output,
	},
	'trustLifecycleApi.getGetListOfSeats': {
		input: generatedSchemas.r_523236c02350Input,
		output: generatedSchemas.r_523236c02350Output,
	},
	'trustLifecycleApi.postCreateSeat': {
		input: generatedSchemas.r_495ebdedb32bInput,
		output: generatedSchemas.r_495ebdedb32bOutput,
	},
	'trustLifecycleApi.getGetSeatByIdentifier': {
		input: generatedSchemas.r_0d6230796736Input,
		output: generatedSchemas.r_0d6230796736Output,
	},
	'trustLifecycleApi.putUpdateSeat': {
		input: generatedSchemas.r_5c95b7617096Input,
		output: generatedSchemas.r_5c95b7617096Output,
	},
	'trustLifecycleApi.deleteDeleteSeat': {
		input: generatedSchemas.r_50f5dbf5b576Input,
		output: generatedSchemas.r_50f5dbf5b576Output,
	},
	'trustLifecycleApi.putAssignSeatToAnotherBusinessUnit': {
		input: generatedSchemas.r_acd12ea8b342Input,
		output: generatedSchemas.r_acd12ea8b342Output,
	},
	'trustLifecycleApi.getGetAvailableSeatTypes': {
		input: generatedSchemas.r_26265e7690c1Input,
		output: generatedSchemas.r_26265e7690c1Output,
	},
	'trustLifecycleApi.listSensors': {
		input: generatedSchemas.r_c5bef0f817eeInput,
		output: generatedSchemas.r_c5bef0f817eeOutput,
	},
	'trustLifecycleApi.allocateNewSensorUsingPost': {
		input: generatedSchemas.r_2a5b40269113Input,
		output: generatedSchemas.r_2a5b40269113Output,
	},
	'trustLifecycleApi.postSuspendSensors': {
		input: generatedSchemas.r_69deb2fed908Input,
		output: generatedSchemas.r_69deb2fed908Output,
	},
	'trustLifecycleApi.postReinstateSensors': {
		input: generatedSchemas.r_359f84ec7e33Input,
		output: generatedSchemas.r_359f84ec7e33Output,
	},
	'trustLifecycleApi.putUpdateSensorDetails': {
		input: generatedSchemas.r_559e713c21d8Input,
		output: generatedSchemas.r_559e713c21d8Output,
	},
	'trustLifecycleApi.postVoidSensors': {
		input: generatedSchemas.r_3ccfd3c7488eInput,
		output: generatedSchemas.r_3ccfd3c7488eOutput,
	},
	'trustLifecycleApi.getGetSensorById': {
		input: generatedSchemas.r_ae93bfb2ed4dInput,
		output: generatedSchemas.r_ae93bfb2ed4dOutput,
	},
	'trustLifecycleApi.renameSensorUsingPut': {
		input: generatedSchemas.r_e13817c6d741Input,
		output: generatedSchemas.r_e13817c6d741Output,
	},
	'trustLifecycleApi.getSensorTemplateFileUsingGet': {
		input: generatedSchemas.r_a638a4b395a8Input,
		output: generatedSchemas.r_a638a4b395a8Output,
	},
	'trustLifecycleApi.getQueryServiceStatus': {
		input: generatedSchemas.r_8ca19107d770Input,
		output: generatedSchemas.r_8ca19107d770Output,
	},
	'trustLifecycleApi.getQueryServiceHealth': {
		input: generatedSchemas.r_ba846e3e9a98Input,
		output: generatedSchemas.r_ba846e3e9a98Output,
	},
	'contentTrustApi.listAuditLogsWithCursor': {
		input: generatedSchemas.r_f3162c793b3cInput,
		output: generatedSchemas.r_f3162c793b3cOutput,
	},
	'contentTrustApi.verifyAuditLog': {
		input: generatedSchemas.r_496bcb0a0fcaInput,
		output: generatedSchemas.r_496bcb0a0fcaOutput,
	},
	'contentTrustApi.getById': {
		input: generatedSchemas.r_67bf21878ca5Input,
		output: generatedSchemas.r_67bf21878ca5Output,
	},
	'contentTrustApi.createRecurringCredential': {
		input: generatedSchemas.r_1ea779a5917aInput,
		output: generatedSchemas.r_1ea779a5917aOutput,
	},
	'contentTrustApi.updateCredential': {
		input: generatedSchemas.r_10a0b05680c8Input,
		output: generatedSchemas.r_10a0b05680c8Output,
	},
	'contentTrustApi.getCredentialList': {
		input: generatedSchemas.r_2f9db2b2221bInput,
		output: generatedSchemas.r_2f9db2b2221bOutput,
	},
	'contentTrustApi.oauth2Token': {
		input: generatedSchemas.r_49706a34a257Input,
		output: generatedSchemas.r_49706a34a257Output,
	},
	'contentTrustApi.listCredentials': {
		input: generatedSchemas.r_e187a6b43f8aInput,
		output: generatedSchemas.r_e187a6b43f8aOutput,
	},
	'contentTrustApi.credentialsInfo': {
		input: generatedSchemas.r_1c6a50e75c89Input,
		output: generatedSchemas.r_1c6a50e75c89Output,
	},
	'contentTrustApi.authorizeCredentials': {
		input: generatedSchemas.r_4f1ae9384a62Input,
		output: generatedSchemas.r_4f1ae9384a62Output,
	},
	'contentTrustApi.extendTransaction': {
		input: generatedSchemas.r_0a89eb9da37aInput,
		output: generatedSchemas.r_0a89eb9da37aOutput,
	},
	'contentTrustApi.credentialSendOtp': {
		input: generatedSchemas.r_b6e2c6352946Input,
		output: generatedSchemas.r_b6e2c6352946Output,
	},
	'contentTrustApi.signHash': {
		input: generatedSchemas.r_1dfa31b33752Input,
		output: generatedSchemas.r_1dfa31b33752Output,
	},
	'contentTrustApi.timeStampToken': {
		input: generatedSchemas.r_01f60286e899Input,
		output: generatedSchemas.r_01f60286e899Output,
	},
	'contentTrustApi.revokeToken': {
		input: generatedSchemas.r_ca1177a347b7Input,
		output: generatedSchemas.r_ca1177a347b7Output,
	},
	'contentTrustApi.oauth2Token1': {
		input: generatedSchemas.r_6a8b01159864Input,
		output: generatedSchemas.r_6a8b01159864Output,
	},
	'contentTrustApi.listCredentials1': {
		input: generatedSchemas.r_239bdd33faf8Input,
		output: generatedSchemas.r_239bdd33faf8Output,
	},
	'contentTrustApi.credentialsInfo1': {
		input: generatedSchemas.r_bf7ea6ad7e85Input,
		output: generatedSchemas.r_bf7ea6ad7e85Output,
	},
	'contentTrustApi.authorizeCredentials1': {
		input: generatedSchemas.r_52c298194dc9Input,
		output: generatedSchemas.r_52c298194dc9Output,
	},
	'contentTrustApi.extendTransaction1': {
		input: generatedSchemas.r_ff4a7601c20eInput,
		output: generatedSchemas.r_ff4a7601c20eOutput,
	},
	'contentTrustApi.credentialSendOtp1': {
		input: generatedSchemas.r_8b2f49243338Input,
		output: generatedSchemas.r_8b2f49243338Output,
	},
	'contentTrustApi.signHash1': {
		input: generatedSchemas.r_28b5d547e130Input,
		output: generatedSchemas.r_28b5d547e130Output,
	},
	'contentTrustApi.timeStampToken1': {
		input: generatedSchemas.r_eca3835a228cInput,
		output: generatedSchemas.r_eca3835a228cOutput,
	},
	'contentTrustApi.revokeToken1': {
		input: generatedSchemas.r_d47572214cdfInput,
		output: generatedSchemas.r_d47572214cdfOutput,
	},
	'contentTrustApi.reject': {
		input: generatedSchemas.r_6618ac8ee70fInput,
		output: generatedSchemas.r_6618ac8ee70fOutput,
	},
	'contentTrustApi.getValidationDetails': {
		input: generatedSchemas.r_bc284230bd68Input,
		output: generatedSchemas.r_bc284230bd68Output,
	},
	'contentTrustApi.revalidate': {
		input: generatedSchemas.r_53dc0f0c10e0Input,
		output: generatedSchemas.r_53dc0f0c10e0Output,
	},
	'contentTrustApi.approve': {
		input: generatedSchemas.r_d3443d50d56fInput,
		output: generatedSchemas.r_d3443d50d56fOutput,
	},
	'contentTrustApi.listValidations': {
		input: generatedSchemas.r_5246dd4ce6efInput,
		output: generatedSchemas.r_5246dd4ce6efOutput,
	},
	'contentTrustApi.createValidation': {
		input: generatedSchemas.r_8ee4f85d366dInput,
		output: generatedSchemas.r_8ee4f85d366dOutput,
	},
	'contentTrustApi.getValidation': {
		input: generatedSchemas.r_a15028cb4d8cInput,
		output: generatedSchemas.r_a15028cb4d8cOutput,
	},
	'contentTrustApi.resendEmail': {
		input: generatedSchemas.r_e6736eb32525Input,
		output: generatedSchemas.r_e6736eb32525Output,
	},
	'contentTrustApi.cancelValidation': {
		input: generatedSchemas.r_d52a0423fb82Input,
		output: generatedSchemas.r_d52a0423fb82Output,
	},
	'contentTrustApi.retryValidation': {
		input: generatedSchemas.r_75c13df8a979Input,
		output: generatedSchemas.r_75c13df8a979Output,
	},
	'contentTrustApi.enableValidation': {
		input: generatedSchemas.r_5506f0d0c709Input,
		output: generatedSchemas.r_5506f0d0c709Output,
	},
	'contentTrustApi.disableValidation': {
		input: generatedSchemas.r_fa557bf6435eInput,
		output: generatedSchemas.r_fa557bf6435eOutput,
	},
	'contentTrustApi.invalidateValidation': {
		input: generatedSchemas.r_fdcd632d15c3Input,
		output: generatedSchemas.r_fdcd632d15c3Output,
	},
	'contentTrustApi.approvePendingSignerApproval': {
		input: generatedSchemas.r_cdc09308beb2Input,
		output: generatedSchemas.r_cdc09308beb2Output,
	},
	'contentTrustApi.rejectPendingSignerApproval': {
		input: generatedSchemas.r_715ac3807e24Input,
		output: generatedSchemas.r_715ac3807e24Output,
	},
	'contentTrustApi.approveValidationOrganization': {
		input: generatedSchemas.r_9082880056c2Input,
		output: generatedSchemas.r_9082880056c2Output,
	},
	'contentTrustApi.rejectValidationOrganization': {
		input: generatedSchemas.r_537bfeb702eeInput,
		output: generatedSchemas.r_537bfeb702eeOutput,
	},
	'contentTrustApi.enhanceHash': {
		input: generatedSchemas.r_b1d9a5f5f20fInput,
		output: generatedSchemas.r_b1d9a5f5f20fOutput,
	},
	'contentTrustApi.enhanceSignature': {
		input: generatedSchemas.r_efe3153749c0Input,
		output: generatedSchemas.r_efe3153749c0Output,
	},
	'contentTrustApi.setupAccount': {
		input: generatedSchemas.r_415ee9fded4fInput,
		output: generatedSchemas.r_415ee9fded4fOutput,
	},
	'contentTrustApi.updateAccount': {
		input: generatedSchemas.r_697bc713dbd3Input,
		output: generatedSchemas.r_697bc713dbd3Output,
	},
	'contentTrustApi.createUserInAm': {
		input: generatedSchemas.r_c1004107761fInput,
		output: generatedSchemas.r_c1004107761fOutput,
	},
	'contentTrustApi.updateUserData': {
		input: generatedSchemas.r_67d02fcd971fInput,
		output: generatedSchemas.r_67d02fcd971fOutput,
	},
	'contentTrustApi.createRecurringCredentialV2': {
		input: generatedSchemas.r_a2afdf611241Input,
		output: generatedSchemas.r_a2afdf611241Output,
	},
	'contentTrustApi.getCredentialByName': {
		input: generatedSchemas.r_4a3694a0845bInput,
		output: generatedSchemas.r_4a3694a0845bOutput,
	},
	'contentTrustApi.cancelCredentialByName': {
		input: generatedSchemas.r_90c9fc0dc00aInput,
		output: generatedSchemas.r_90c9fc0dc00aOutput,
	},
	'contentTrustApi.revokeCredentials': {
		input: generatedSchemas.r_30b532b72cb1Input,
		output: generatedSchemas.r_30b532b72cb1Output,
	},
	'contentTrustApi.replaceClientAdmin': {
		input: generatedSchemas.r_707c330daa32Input,
		output: generatedSchemas.r_707c330daa32Output,
	},
} as const;

export const generatedOpenApiEndpointMeta: Record<
	GeneratedOpenApiEndpointPath,
	{ riskLevel: 'read' | 'write' | 'destructive'; description: string }
> = {
	'accountManagerApi.listApiTokens': {
		riskLevel: 'read',
		description: 'List API keys',
	},
	'accountManagerApi.createApiToken': {
		riskLevel: 'write',
		description: 'Create API key',
	},
	'accountManagerApi.getApiTokenById': {
		riskLevel: 'read',
		description: 'Get API key by ID',
	},
	'accountManagerApi.updateApiToken': {
		riskLevel: 'write',
		description: 'Update API key',
	},
	'accountManagerApi.deleteApiToken': {
		riskLevel: 'destructive',
		description: 'Delete API key',
	},
	'accountManagerApi.listAccounts': {
		riskLevel: 'read',
		description: 'List accounts',
	},
	'accountManagerApi.createAccount': {
		riskLevel: 'write',
		description: 'Create account',
	},
	'accountManagerApi.getAccountDetails': {
		riskLevel: 'read',
		description: 'Get account details',
	},
	'accountManagerApi.updateAccount': {
		riskLevel: 'write',
		description: 'Update account',
	},
	'accountManagerApi.listAuditLogs': {
		riskLevel: 'read',
		description: 'List audit log entries',
	},
	'accountManagerApi.getClientAuthCertificatesByUserId': {
		riskLevel: 'read',
		description: 'Get all client authentication certificates',
	},
	'accountManagerApi.createClientAuthCertificate': {
		riskLevel: 'write',
		description: 'Generate client authentication certificate',
	},
	'accountManagerApi.enableClientAuthCertificate': {
		riskLevel: 'write',
		description: 'Enable/disable client authentication certificate',
	},
	'accountManagerApi.listOrganizations': {
		riskLevel: 'read',
		description: 'List organizations',
	},
	'accountManagerApi.getOrganizationDetails': {
		riskLevel: 'read',
		description: 'Get organization details',
	},
	'accountManagerApi.getUserDetails': {
		riskLevel: 'read',
		description: 'Get user details',
	},
	'accountManagerApi.deleteUser': {
		riskLevel: 'destructive',
		description: 'Delete user',
	},
	'accountManagerApi.updateUser': {
		riskLevel: 'write',
		description: 'Update user',
	},
	'accountManagerApi.listSelectUsers': {
		riskLevel: 'write',
		description: 'List select users',
	},
	'accountManagerApi.listAllUsers': {
		riskLevel: 'read',
		description: 'List all users',
	},
	'accountManagerApi.createUser': {
		riskLevel: 'write',
		description: 'Create user',
	},
	'accountManagerApi.listUserRoles': {
		riskLevel: 'read',
		description: 'List user roles',
	},
	'privateCAApi.getGetAllCaCertificateAiaIssuerFiles': {
		riskLevel: 'read',
		description: 'Get all CA certificate AIA issuer files',
	},
	'privateCAApi.postAddAnAiaIssuerFile': {
		riskLevel: 'write',
		description: 'Add an AIA Issuer File',
	},
	'privateCAApi.getGetAnAiaIssuerFile': {
		riskLevel: 'read',
		description: 'Get an AIA Issuer File',
	},
	'privateCAApi.getGetAnAiaIssuerFileBlob': {
		riskLevel: 'read',
		description: 'Get an AIA Issuer File Blob',
	},
	'privateCAApi.putUpdateAnAiaIssuerFile': {
		riskLevel: 'write',
		description: 'Update an AIA Issuer File',
	},
	'privateCAApi.getCheckAnalyticsConfiguration': {
		riskLevel: 'read',
		description: 'Check analytics configuration',
	},
	'privateCAApi.deleteDeleteSamlConfiguration': {
		riskLevel: 'destructive',
		description: 'Delete SAML Configuration',
	},
	'privateCAApi.getGetSamlConfiguration': {
		riskLevel: 'read',
		description: 'Get SAML Configuration',
	},
	'privateCAApi.postCreateOrUpdateSamlConfiguration': {
		riskLevel: 'write',
		description: 'Create or Update SAML Configuration',
	},
	'privateCAApi.postParseIdPMetadata': {
		riskLevel: 'write',
		description: 'Parse IdP Metadata',
	},
	'privateCAApi.getGetAuditLog': {
		riskLevel: 'read',
		description: 'Get Audit Log',
	},
	'privateCAApi.postAssertionConsumerService': {
		riskLevel: 'write',
		description: 'Assertion Consumer Service',
	},
	'privateCAApi.getCheckIfSamlIsEnabled': {
		riskLevel: 'read',
		description: 'Check if SAML is enabled',
	},
	'privateCAApi.getInitiateSamlLogin': {
		riskLevel: 'read',
		description: 'Initiate SAML Login',
	},
	'privateCAApi.postInitiateLogout': {
		riskLevel: 'write',
		description: 'Initiate Logout',
	},
	'privateCAApi.getGetSpMetadata': {
		riskLevel: 'read',
		description: 'Get SP Metadata',
	},
	'privateCAApi.postSingleLogoutService': {
		riskLevel: 'write',
		description: 'Single Logout Service',
	},
	'privateCAApi.getShowAllCas': {
		riskLevel: 'read',
		description: 'Show all CAs',
	},
	'privateCAApi.postCreateACa': {
		riskLevel: 'write',
		description: 'Create a CA',
	},
	'privateCAApi.deleteDeletesAPendingSignCa': {
		riskLevel: 'destructive',
		description: 'Deletes a pending sign CA',
	},
	'privateCAApi.getGetACa': { riskLevel: 'read', description: 'Get a CA' },
	'privateCAApi.deleteDeleteCaAccounts': {
		riskLevel: 'destructive',
		description: 'Delete CA Accounts',
	},
	'privateCAApi.postAddCaAccounts': {
		riskLevel: 'write',
		description: 'Add CA Accounts',
	},
	'privateCAApi.putSetCaAccounts': {
		riskLevel: 'write',
		description: 'Set CA Accounts',
	},
	'privateCAApi.putSetTheActiveAiaIssuerForACa': {
		riskLevel: 'write',
		description: 'Set the Active AIA Issuer for a CA',
	},
	'privateCAApi.putSetTheActiveCrlForACa': {
		riskLevel: 'write',
		description: 'Set the Active CRL for a CA',
	},
	'privateCAApi.postSetACaBlob': {
		riskLevel: 'write',
		description: 'Set a CA blob',
	},
	'privateCAApi.getGetCaAiaIssuerConfiguration': {
		riskLevel: 'read',
		description: 'Get CA AIA Issuer Configuration',
	},
	'privateCAApi.putSetCaAiaIssuerConfiguration': {
		riskLevel: 'write',
		description: 'Set CA AIA Issuer Configuration',
	},
	'privateCAApi.getGetCaCertPoliciesConfiguration': {
		riskLevel: 'read',
		description: 'Get CA Cert Policies Configuration',
	},
	'privateCAApi.putSetCaCertPoliciesConfiguration': {
		riskLevel: 'write',
		description: 'Set CA Cert Policies Configuration',
	},
	'privateCAApi.putSetCaIssuanceCertConfig': {
		riskLevel: 'write',
		description: 'Set CA issuance cert config',
	},
	'privateCAApi.getGetCaCertificateChains': {
		riskLevel: 'read',
		description: 'Get CA certificate chains',
	},
	'privateCAApi.postAddACertificateChainToACa': {
		riskLevel: 'write',
		description: 'Add a certificate chain to a CA',
	},
	'privateCAApi.deleteDeleteACertificateChain': {
		riskLevel: 'destructive',
		description: 'Delete a certificate chain',
	},
	'privateCAApi.getGetACertificateChain': {
		riskLevel: 'read',
		description: 'Get a certificate chain',
	},
	'privateCAApi.putUpdateACertificateChain': {
		riskLevel: 'write',
		description: 'Update a certificate chain',
	},
	'privateCAApi.putSetIncludeAllCertsInCrl': {
		riskLevel: 'write',
		description: 'Set include all certs in CRL',
	},
	'privateCAApi.getGetCaCrlIssuanceConfig': {
		riskLevel: 'read',
		description: 'Get CA CRL issuance config',
	},
	'privateCAApi.putSetCaCrlIssuanceConfig': {
		riskLevel: 'write',
		description: 'Set CA CRL issuance config',
	},
	'privateCAApi.getGetCaOcspGenerationConfig': {
		riskLevel: 'read',
		description: 'Get CA OCSP generation config',
	},
	'privateCAApi.putSetCaOcspGenerationConfig': {
		riskLevel: 'write',
		description: 'Set CA OCSP generation config',
	},
	'privateCAApi.getGetCaOcspIssuanceConfig': {
		riskLevel: 'read',
		description: 'Get CA OCSP issuance config',
	},
	'privateCAApi.putSetCaOcspIssuanceConfig': {
		riskLevel: 'write',
		description: 'Set CA OCSP issuance config',
	},
	'privateCAApi.getGetCaOcspResponderConfig': {
		riskLevel: 'read',
		description: 'Get CA OCSP responder config',
	},
	'privateCAApi.putSetCaOcspResponderConfig': {
		riskLevel: 'write',
		description: 'Set CA OCSP responder config',
	},
	'privateCAApi.putSetAdditionalSettings': {
		riskLevel: 'write',
		description: 'Set Additional Settings',
	},
	'privateCAApi.getGetACaCsr': {
		riskLevel: 'read',
		description: 'Get a CA CSR',
	},
	'privateCAApi.postDecryptAPkcs7': {
		riskLevel: 'write',
		description: 'Decrypt a PKCS7',
	},
	'privateCAApi.getDownloadACa': {
		riskLevel: 'read',
		description: 'Download a CA',
	},
	'privateCAApi.postEncryptAPkcs7': {
		riskLevel: 'write',
		description: 'Encrypt a PKCS7',
	},
	'privateCAApi.getGetTheRootCaHierarchy': {
		riskLevel: 'read',
		description: 'Get the root CA hierarchy',
	},
	'privateCAApi.getGetCaNotes': {
		riskLevel: 'read',
		description: 'Get CA Notes',
	},
	'privateCAApi.postCreateCaNote': {
		riskLevel: 'write',
		description: 'Create CA Note',
	},
	'privateCAApi.getGetCaOcspConfig': {
		riskLevel: 'read',
		description: 'Get CA OCSP config',
	},
	'privateCAApi.postRecertifiesExistingCaByCaId': {
		riskLevel: 'write',
		description: 'Recertifies existing CA by CA ID',
	},
	'privateCAApi.postRecertifiesACaWithANewImportedCertificate': {
		riskLevel: 'write',
		description: 'Recertifies a CA with a new imported certificate',
	},
	'privateCAApi.postCreateCaReinstateRequest': {
		riskLevel: 'write',
		description: 'Create CA Reinstate Request',
	},
	'privateCAApi.getGetCaReinstateRequest': {
		riskLevel: 'read',
		description: 'Get CA Reinstate Request',
	},
	'privateCAApi.postApproveCaReinstateRequest': {
		riskLevel: 'write',
		description: 'Approve CA Reinstate Request',
	},
	'privateCAApi.postRejectCaReinstateRequest': {
		riskLevel: 'write',
		description: 'Reject CA Reinstate Request',
	},
	'privateCAApi.postCreateCaRevokeRequest': {
		riskLevel: 'write',
		description: 'Create CA Revoke Request',
	},
	'privateCAApi.getGetCaRevokeRequest': {
		riskLevel: 'read',
		description: 'Get CA Revoke Request',
	},
	'privateCAApi.postApproveCaRevokeRequest': {
		riskLevel: 'destructive',
		description: 'Approve CA Revoke Request',
	},
	'privateCAApi.postSignAnAttributeCertificate': {
		riskLevel: 'write',
		description: 'Sign an Attribute Certificate',
	},
	'privateCAApi.postSignACmpRequest': {
		riskLevel: 'write',
		description: 'Sign a CMP request',
	},
	'privateCAApi.postSignAGlobalPlatformRequest': {
		riskLevel: 'write',
		description: 'Sign a GlobalPlatform request',
	},
	'privateCAApi.getGetCaActiveStatus': {
		riskLevel: 'read',
		description: 'Get CA Active Status',
	},
	'privateCAApi.postSetCaActiveStatus': {
		riskLevel: 'write',
		description: 'Set CA Active Status',
	},
	'privateCAApi.getGetCertificateExpiration': {
		riskLevel: 'read',
		description: 'Get certificate expiration',
	},
	'privateCAApi.getGetAllCertificates': {
		riskLevel: 'read',
		description: 'Get All Certificates',
	},
	'privateCAApi.postImportACa': {
		riskLevel: 'write',
		description: 'Import a CA',
	},
	'privateCAApi.postLinkACaKey': {
		riskLevel: 'write',
		description: 'Link a CA key',
	},
	'privateCAApi.postImportAnOfflineCa': {
		riskLevel: 'write',
		description: 'Import an offline CA',
	},
	'privateCAApi.postImportAThirdPartyCa': {
		riskLevel: 'write',
		description: 'Import a third party CA',
	},
	'privateCAApi.postCreateAPendingDelegatedOcspResponder': {
		riskLevel: 'write',
		description: 'Create a pending Delegated OCSP responder',
	},
	'privateCAApi.getGetAllCertificates_a2d39d9': {
		riskLevel: 'read',
		description: 'Get All Certificates',
	},
	'privateCAApi.postCreateCertificate': {
		riskLevel: 'write',
		description: 'Create Certificate',
	},
	'privateCAApi.getGetCertificate': {
		riskLevel: 'read',
		description: 'Get Certificate',
	},
	'privateCAApi.getRecoverEscrowedEeKey': {
		riskLevel: 'read',
		description: 'Recover Escrowed EE Key',
	},
	'privateCAApi.putRevokeCertificate': {
		riskLevel: 'destructive',
		description: 'Revoke Certificate',
	},
	'privateCAApi.getGetCsvListOfCertificates': {
		riskLevel: 'read',
		description: 'Get CSV List of Certificates',
	},
	'privateCAApi.postImportACertificate': {
		riskLevel: 'write',
		description: 'Import a certificate',
	},
	'privateCAApi.getGetAllCrlInfos': {
		riskLevel: 'read',
		description: 'Get All CRL Infos',
	},
	'privateCAApi.postAddCrlInfos': {
		riskLevel: 'write',
		description: 'Add CRL Infos',
	},
	'privateCAApi.getGetCrlInfo': {
		riskLevel: 'read',
		description: 'Get CRL Info',
	},
	'privateCAApi.getGetCrlBlobList': {
		riskLevel: 'read',
		description: 'Get CRL Blob List',
	},
	'privateCAApi.postImportCrlBlob': {
		riskLevel: 'write',
		description: 'Import CRL Blob',
	},
	'privateCAApi.getGetCrlBlob': {
		riskLevel: 'read',
		description: 'Get CRL Blob',
	},
	'privateCAApi.getGetCrlConfig': {
		riskLevel: 'read',
		description: 'Get CRL Config',
	},
	'privateCAApi.putSetCrlConfig': {
		riskLevel: 'write',
		description: 'Set CRL Config',
	},
	'privateCAApi.postCreateCrlNow': {
		riskLevel: 'write',
		description: 'Create CRL Now',
	},
	'privateCAApi.postImportAClientKey': {
		riskLevel: 'write',
		description: 'Import a client key',
	},
	'privateCAApi.getGetFedRampComplianceEvidence': {
		riskLevel: 'read',
		description: 'Get FedRAMP compliance evidence',
	},
	'privateCAApi.getGetHsmPartitions': {
		riskLevel: 'read',
		description: 'Get HSM partitions',
	},
	'privateCAApi.postCreateAnOcspResponder': {
		riskLevel: 'write',
		description: 'Create an OCSP responder',
	},
	'privateCAApi.getGetAnOcspResponder': {
		riskLevel: 'read',
		description: 'Get an OCSP responder',
	},
	'privateCAApi.putSetAnOcspResponderStatus': {
		riskLevel: 'write',
		description: 'Set an OCSP responder status',
	},
	'privateCAApi.putSetAnOcspBlob': {
		riskLevel: 'write',
		description: 'Set an OCSP blob',
	},
	'privateCAApi.getDownloadAnOcspResponderCsr': {
		riskLevel: 'read',
		description: 'Download an OCSP responder CSR',
	},
	'privateCAApi.postImportAnOcspResponder': {
		riskLevel: 'write',
		description: 'Import an OCSP responder',
	},
	'privateCAApi.postCreateAPendingOcspResponder': {
		riskLevel: 'write',
		description: 'Create a pending OCSP responder',
	},
	'privateCAApi.getGetAllOcspResponders': {
		riskLevel: 'read',
		description: 'Get all OCSP responders',
	},
	'privateCAApi.getHandleScepGetOperations': {
		riskLevel: 'write',
		description: 'Handle SCEP GET operations',
	},
	'privateCAApi.postHandleScepPkiOperation': {
		riskLevel: 'write',
		description: 'Handle SCEP PKI operation',
	},
	'privateCAApi.getGetCertificateTemplates': {
		riskLevel: 'read',
		description: 'Get certificate templates',
	},
	'privateCAApi.postCreateACustomCertificateTemplate': {
		riskLevel: 'write',
		description: 'Create a custom certificate template',
	},
	'privateCAApi.getGetACertificateTemplate': {
		riskLevel: 'read',
		description: 'Get a certificate template',
	},
	'privateCAApi.putUpdateACustomCertificateTemplate': {
		riskLevel: 'write',
		description: 'Update a custom certificate template',
	},
	'privateCAApi.getGetAAccountsCertificateTemplateIsAssignedTo': {
		riskLevel: 'read',
		description: 'Get a accounts certificate template is assigned to',
	},
	'privateCAApi.putActivateACustomCertificateTemplate': {
		riskLevel: 'write',
		description: 'Activate a custom certificate template',
	},
	'privateCAApi.putDeactivateACustomCertificateTemplate': {
		riskLevel: 'write',
		description: 'Deactivate a custom certificate template',
	},
	'privateCAApi.postVerifyAsn1Template': {
		riskLevel: 'write',
		description: 'Verify ASN1 Template',
	},
	'privateCAApi.getGetCertificateTemplateValidationSchemas': {
		riskLevel: 'read',
		description: 'Get certificate template validation schemas',
	},
	'privateCAApi.getGetCertificateTemplateValidationSchemas_4fe4fdb': {
		riskLevel: 'read',
		description: 'Get certificate template validation schemas',
	},
	'trustLifecycleApi.recreateAcmecredentialsPublic': {
		riskLevel: 'write',
		description: 'Recreate ACME credentials',
	},
	'trustLifecycleApi.addSystemScanUsingPostpublic': {
		riskLevel: 'write',
		description: 'Add and update system scan',
	},
	'trustLifecycleApi.abortSystemScanUsingPostpublic': {
		riskLevel: 'write',
		description: 'Abort system scan',
	},
	'trustLifecycleApi.suspendSystemScanUsingPostpublic': {
		riskLevel: 'write',
		description: 'Suspend system scan',
	},
	'trustLifecycleApi.resumeSystemScanUsingPostpublic': {
		riskLevel: 'write',
		description: 'Resume system scan',
	},
	'trustLifecycleApi.skipFutureSystemScanScheduleUsingPostpublic': {
		riskLevel: 'write',
		description: 'Skip future system scan schedule',
	},
	'trustLifecycleApi.restoreSystemScanScheduleUsingPostpublic': {
		riskLevel: 'write',
		description: 'Restore system scan schedule',
	},
	'trustLifecycleApi.deletePastSystemScanUsingPostpublic': {
		riskLevel: 'destructive',
		description: 'Delete past system scan instance',
	},
	'trustLifecycleApi.listUpcomingSystemScansUsingGetpublic': {
		riskLevel: 'read',
		description: 'List upcoming system scans',
	},
	'trustLifecycleApi.listPastSystemScansUsingGetpublic': {
		riskLevel: 'read',
		description: 'List past system scans',
	},
	'trustLifecycleApi.getListAgents': {
		riskLevel: 'read',
		description: 'List agents',
	},
	'trustLifecycleApi.getGetAgentById': {
		riskLevel: 'read',
		description: 'Get agent by ID',
	},
	'trustLifecycleApi.updateCertDeliveryLocationForAgentPostpublic': {
		riskLevel: 'write',
		description: 'Update certificate delivery location',
	},
	'trustLifecycleApi.putApproveAgents': {
		riskLevel: 'write',
		description: 'Approve agents',
	},
	'trustLifecycleApi.putVoidAgents': {
		riskLevel: 'write',
		description: 'Void agents',
	},
	'trustLifecycleApi.putUpdateAgent': {
		riskLevel: 'write',
		description: 'Update agent',
	},
	'trustLifecycleApi.putRetryAgentConfig': {
		riskLevel: 'write',
		description: 'Retry agent config',
	},
	'trustLifecycleApi.postPostAgentSuggestions': {
		riskLevel: 'write',
		description: 'Post agent suggestions',
	},
	'trustLifecycleApi.getListAgentScripts': {
		riskLevel: 'read',
		description: 'List agent scripts',
	},
	'trustLifecycleApi.postPostAgentScript': {
		riskLevel: 'write',
		description: 'Post agent script',
	},
	'trustLifecycleApi.getGetAgentScriptById': {
		riskLevel: 'read',
		description: 'Get agent script by ID',
	},
	'trustLifecycleApi.putUpdateAgentScript': {
		riskLevel: 'write',
		description: 'Update agent script',
	},
	'trustLifecycleApi.postAddAgentScriptsInBulk': {
		riskLevel: 'write',
		description: 'Add agent scripts in bulk',
	},
	'trustLifecycleApi.putSuspendAgents': {
		riskLevel: 'write',
		description: 'Suspend agents',
	},
	'trustLifecycleApi.putRejectAgents': {
		riskLevel: 'write',
		description: 'Reject agents',
	},
	'trustLifecycleApi.putReinstateAgents': {
		riskLevel: 'write',
		description: 'Reinstate agents',
	},
	'trustLifecycleApi.getGetGlobalAgentSettings': {
		riskLevel: 'read',
		description: 'Get global agent settings',
	},
	'trustLifecycleApi.putUpdateGlobalAgentSettings': {
		riskLevel: 'write',
		description: 'Update global agent settings',
	},
	'trustLifecycleApi.postCreateGlobalAgentSettings': {
		riskLevel: 'write',
		description: 'Create global agent settings',
	},
	'trustLifecycleApi.createAutomationUsingPost': {
		riskLevel: 'write',
		description: 'Create certificate lifecycle automation event',
	},
	'trustLifecycleApi.createAwrAutomationUsingPost': {
		riskLevel: 'write',
		description:
			'Create certificate lifecycle event with automated distribution',
	},
	'trustLifecycleApi.checkEligibilityOfBulkAutomationUsingPost': {
		riskLevel: 'write',
		description: 'Check eligibility for bulk automation',
	},
	'trustLifecycleApi.requestBulkAutomationUsingPost': {
		riskLevel: 'write',
		description: 'Create bulk certificate automation event',
	},
	'trustLifecycleApi.getAutomationDetailsUsingGet': {
		riskLevel: 'read',
		description: 'Get certificate lifecycle automation details by inventory ID',
	},
	'trustLifecycleApi.updateAutomationUsingPut': {
		riskLevel: 'write',
		description: 'Update scheduled certificate automation',
	},
	'trustLifecycleApi.retryAutomationUsingPut': {
		riskLevel: 'write',
		description: 'Retry certificate automation request',
	},
	'trustLifecycleApi.cancelAutomationUsingPut': {
		riskLevel: 'write',
		description: 'Cancel certificate automation request',
	},
	'trustLifecycleApi.listAutomationInventory': {
		riskLevel: 'read',
		description: 'List potential targets for certificate lifecycle automation',
	},
	'trustLifecycleApi.getInventoryDetailsUsingGet': {
		riskLevel: 'read',
		description: 'Get certificate automation inventory details by ID',
	},
	'trustLifecycleApi.getListBusinessUnit': {
		riskLevel: 'read',
		description: 'List business unit',
	},
	'trustLifecycleApi.postCreateBusinessUnit': {
		riskLevel: 'write',
		description: 'Create business unit',
	},
	'trustLifecycleApi.getGetBusinessUnitById': {
		riskLevel: 'read',
		description: 'Get Business unit by ID',
	},
	'trustLifecycleApi.deleteDeleteBusinessUnit': {
		riskLevel: 'destructive',
		description: 'Delete business unit',
	},
	'trustLifecycleApi.putUpdateBusinessUnitLicense': {
		riskLevel: 'write',
		description: 'Update business unit license',
	},
	'trustLifecycleApi.putAssignAnAdminToABusinessUnit': {
		riskLevel: 'write',
		description: 'Assign an admin to a Business Unit',
	},
	'trustLifecycleApi.deleteRemoveAnAdminFromABusinessUnit': {
		riskLevel: 'destructive',
		description: 'Remove an admin from a Business Unit',
	},
	'trustLifecycleApi.getListCertificateOwners': {
		riskLevel: 'read',
		description: 'List certificate owners',
	},
	'trustLifecycleApi.postCreateCertificateOwners': {
		riskLevel: 'write',
		description: 'Create certificate owners',
	},
	'trustLifecycleApi.getGetCertificateOwnerById': {
		riskLevel: 'read',
		description: 'Get certificate owner by ID',
	},
	'trustLifecycleApi.putUpdateCertificateOwnerDetailsForAGivenCertificateOwnerId':
		{
			riskLevel: 'write',
			description:
				'Update certificate owner details for a given certificate owner ID',
		},
	'trustLifecycleApi.deleteDeleteCertificateOwner': {
		riskLevel: 'destructive',
		description: 'Delete certificate owner',
	},
	'trustLifecycleApi.putAddCertificateOwnersMappingForCertificate': {
		riskLevel: 'write',
		description: 'Add certificate owners mapping for certificate',
	},
	'trustLifecycleApi.deleteDeleteCertificateOwnerMappingsForACertificate': {
		riskLevel: 'destructive',
		description: 'Delete certificate owner mappings for a certificate',
	},
	'trustLifecycleApi.postIssueCertificate': {
		riskLevel: 'write',
		description: 'Issue certificate',
	},
	'trustLifecycleApi.postPickUpCertificate': {
		riskLevel: 'write',
		description: 'Pick up certificate',
	},
	'trustLifecycleApi.postApproveEscrowedCertificateRecovery': {
		riskLevel: 'write',
		description: 'Approve escrowed certificate recovery',
	},
	'trustLifecycleApi.postRenewCertificate': {
		riskLevel: 'destructive',
		description: 'Renew certificate',
	},
	'trustLifecycleApi.postBulkUpdateTags': {
		riskLevel: 'write',
		description: 'Bulk update tags',
	},
	'trustLifecycleApi.postBulkReplaceTags': {
		riskLevel: 'destructive',
		description: 'Bulk replace tags',
	},
	'trustLifecycleApi.postImportCertificate': {
		riskLevel: 'write',
		description: 'Import certificate',
	},
	'trustLifecycleApi.getSearchCertificates': {
		riskLevel: 'read',
		description: 'Search certificates',
	},
	'trustLifecycleApi.publicCertificateSearchSummary': {
		riskLevel: 'read',
		description: 'Search certificate summaries',
	},
	'trustLifecycleApi.publicGetCertUsingId': {
		riskLevel: 'read',
		description: 'Get certificate by ID',
	},
	'trustLifecycleApi.getGetCertificateBySerialNumber': {
		riskLevel: 'read',
		description: 'Get certificate by serial number',
	},
	'trustLifecycleApi.postRecoverEscrowedCertificateBySerialNumber': {
		riskLevel: 'write',
		description: 'Recover escrowed certificate by serial number',
	},
	'trustLifecycleApi.certRevokeBySerial': {
		riskLevel: 'destructive',
		description: 'Revoke certificate',
	},
	'trustLifecycleApi.deleteResumeSuspendedCertificate': {
		riskLevel: 'destructive',
		description: 'Resume suspended certificate',
	},
	'trustLifecycleApi.getAdditionalFormatsBySerialNumber': {
		riskLevel: 'read',
		description: 'Get additional formats for certificate by serial number',
	},
	'trustLifecycleApi.publicCountCertificateMigrationCandidates': {
		riskLevel: 'read',
		description: 'Count certificate migration candidates',
	},
	'trustLifecycleApi.publicGetCertificateMigrationCandidates': {
		riskLevel: 'read',
		description: 'List certificate migration candidates',
	},
	'trustLifecycleApi.createUsingPost1': {
		riskLevel: 'write',
		description: 'Create a connector',
	},
	'trustLifecycleApi.listByAccountUsingPost': {
		riskLevel: 'write',
		description: 'Search connectors',
	},
	'trustLifecycleApi.suggestionsUsingGet': {
		riskLevel: 'read',
		description: 'Fetch field suggestions',
	},
	'trustLifecycleApi.getDetailsByIdUsingGet': {
		riskLevel: 'read',
		description: 'Get connector details',
	},
	'trustLifecycleApi.updateUsingPut1': {
		riskLevel: 'write',
		description: 'Update connector',
	},
	'trustLifecycleApi.deleteByIdUsingDelete': {
		riskLevel: 'destructive',
		description: 'Delete connector',
	},
	'trustLifecycleApi.runNowUsingPost': {
		riskLevel: 'write',
		description: 'Connector run now',
	},
	'trustLifecycleApi.stopUsingPost': {
		riskLevel: 'write',
		description: 'Stop connector',
	},
	'trustLifecycleApi.testConnectionUsingPost': {
		riskLevel: 'write',
		description: 'Test connector',
	},
	'trustLifecycleApi.unlinkUsingPost': {
		riskLevel: 'write',
		description: 'Unlink a connector',
	},
	'trustLifecycleApi.getConnectorMetadataUsingGet': {
		riskLevel: 'read',
		description: 'Get connector metadata',
	},
	'trustLifecycleApi.getListCustomAttributes': {
		riskLevel: 'read',
		description: 'List custom attributes',
	},
	'trustLifecycleApi.postCreateCustomAttribute': {
		riskLevel: 'write',
		description: 'Create custom attribute',
	},
	'trustLifecycleApi.getListCustomAttributesForCertificate': {
		riskLevel: 'read',
		description: 'List custom attributes for certificate',
	},
	'trustLifecycleApi.putAddCustomAttributesMappingForCertificate': {
		riskLevel: 'write',
		description: 'Add custom attributes mapping for certificate',
	},
	'trustLifecycleApi.deleteDeleteCustomAttributesMappingForCertificate': {
		riskLevel: 'destructive',
		description: 'Delete custom attributes mapping for certificate',
	},
	'trustLifecycleApi.getGetCustomAttributeById': {
		riskLevel: 'read',
		description: 'Get custom attribute by ID',
	},
	'trustLifecycleApi.putUpdateCustomAttribute': {
		riskLevel: 'write',
		description: 'Update custom attribute',
	},
	'trustLifecycleApi.deleteDeleteCustomAttribute': {
		riskLevel: 'destructive',
		description: 'Delete custom attribute',
	},
	'trustLifecycleApi.getCertificateCountsBySourceTypes': {
		riskLevel: 'read',
		description: 'Get certificate counts for deletion preview',
	},
	'trustLifecycleApi.deleteCertificatesBySourceTypes': {
		riskLevel: 'destructive',
		description: 'Delete discovered certificates by source types',
	},
	'trustLifecycleApi.getListDevices': {
		riskLevel: 'read',
		description: 'List devices',
	},
	'trustLifecycleApi.postAddDevices': {
		riskLevel: 'write',
		description: 'Add devices',
	},
	'trustLifecycleApi.deleteDeleteDevicesBulk': {
		riskLevel: 'destructive',
		description: 'Delete devices (bulk)',
	},
	'trustLifecycleApi.getGetDevice': {
		riskLevel: 'read',
		description: 'Get device',
	},
	'trustLifecycleApi.putUpdateDevice': {
		riskLevel: 'write',
		description: 'Update device',
	},
	'trustLifecycleApi.deleteDeleteDevice': {
		riskLevel: 'destructive',
		description: 'Delete device',
	},
	'trustLifecycleApi.postImportDevicesFromCsv': {
		riskLevel: 'write',
		description: 'Import devices from CSV',
	},
	'trustLifecycleApi.getExportDevicesToCsv': {
		riskLevel: 'read',
		description: 'Export devices to CSV',
	},
	'trustLifecycleApi.putLinkDevicesToAProfile': {
		riskLevel: 'write',
		description: 'Link devices to a profile',
	},
	'trustLifecycleApi.putUnlinkDevicesFromAProfile': {
		riskLevel: 'write',
		description: 'Unlink devices from a profile',
	},
	'trustLifecycleApi.putBulkMapDevicesToProfiles': {
		riskLevel: 'write',
		description: 'Bulk map devices to profiles',
	},
	'trustLifecycleApi.deleteBulkUnmapDevicesFromProfiles': {
		riskLevel: 'destructive',
		description: 'Bulk unmap devices from profiles',
	},
	'trustLifecycleApi.getUnsecured': {
		riskLevel: 'read',
		description: 'Get unsecured endpoints',
	},
	'trustLifecycleApi.getUnsecuredCount': {
		riskLevel: 'read',
		description: 'Get unsecured endpoints count',
	},
	'trustLifecycleApi.getPortletCount': {
		riskLevel: 'read',
		description: 'Get portlet count',
	},
	'trustLifecycleApi.getAutomatableEndpoint': {
		riskLevel: 'read',
		description: 'Get automatable endpoints',
	},
	'trustLifecycleApi.getAutomatableCount': {
		riskLevel: 'read',
		description: 'Get automatable endpoints count',
	},
	'trustLifecycleApi.getInventoryDetails': {
		riskLevel: 'read',
		description: 'Get inventory endpoint details',
	},
	'trustLifecycleApi.getDiscoveredEndpoints': {
		riskLevel: 'read',
		description: 'Get discovered endpoints',
	},
	'trustLifecycleApi.getDiscoveredEndpointsCount': {
		riskLevel: 'read',
		description: 'Get discovered endpoints count',
	},
	'trustLifecycleApi.getInstancesList': {
		riskLevel: 'read',
		description: 'Get combined inventory instances',
	},
	'trustLifecycleApi.postCreateEnrollment': {
		riskLevel: 'write',
		description: 'Create enrollment',
	},
	'trustLifecycleApi.postRedeemEnrollment': {
		riskLevel: 'write',
		description: 'Redeem enrollment',
	},
	'trustLifecycleApi.putUpdateStatusOfManualApprovalEnrollment': {
		riskLevel: 'write',
		description: 'Update status of manual approval enrollment',
	},
	'trustLifecycleApi.getGetEnrollmentDetailsByEnrollmentCode': {
		riskLevel: 'read',
		description: 'Get enrollment details by enrollment code',
	},
	'trustLifecycleApi.getListEnrollments': {
		riskLevel: 'read',
		description: 'List enrollments',
	},
	'trustLifecycleApi.getGetEnrollmentDetailsById': {
		riskLevel: 'read',
		description: 'Get enrollment details by ID',
	},
	'trustLifecycleApi.postCreateEnrollmentForManualApproval': {
		riskLevel: 'write',
		description: 'Create enrollment for manual approval',
	},
	'trustLifecycleApi.getAttributesOfRenewableCertificateUsingCertIdUsingGet': {
		riskLevel: 'read',
		description:
			'Get enrollment details for renewable certificate using Certificate-Id',
	},
	'trustLifecycleApi.postRenewCertificateEnrollmentUsingCertificateId': {
		riskLevel: 'destructive',
		description: 'Renew Certificate enrollment using certificate Id.',
	},
	'trustLifecycleApi.handleGetCaCertsOperationUsingGet': {
		riskLevel: 'read',
		description: 'handleGetCaCertsOperation',
	},
	'trustLifecycleApi.handleSimpleEnrollOperationUsingPost': {
		riskLevel: 'write',
		description: 'handleSimpleEnrollOperation',
	},
	'trustLifecycleApi.handleSimpleReEnrollOperationUsingPost': {
		riskLevel: 'write',
		description: 'handleSimpleReEnrollOperation',
	},
	'trustLifecycleApi.listSensorIntegrations': {
		riskLevel: 'read',
		description: 'List sensor integrations',
	},
	'trustLifecycleApi.createSensorIntegration': {
		riskLevel: 'write',
		description: 'Create sensor integration',
	},
	'trustLifecycleApi.getSensorIntegrationById': {
		riskLevel: 'read',
		description: 'Get sensor integration by ID',
	},
	'trustLifecycleApi.refreshSensorIntegration': {
		riskLevel: 'write',
		description: 'Refresh sensor integrations',
	},
	'trustLifecycleApi.getGetListOfDnsIntegrations': {
		riskLevel: 'read',
		description: 'Get list of DNS integrations',
	},
	'trustLifecycleApi.postBulkVoid': {
		riskLevel: 'write',
		description: 'Bulk void',
	},
	'trustLifecycleApi.postVoidById': {
		riskLevel: 'write',
		description: 'Void by ID',
	},
	'trustLifecycleApi.getSensorIntegrationAppParameters': {
		riskLevel: 'read',
		description:
			'List available configuration parameters for a sensor application',
	},
	'trustLifecycleApi.postCreateANewProfile': {
		riskLevel: 'write',
		description: 'Create a new profile',
	},
	'trustLifecycleApi.putUpdateProfile': {
		riskLevel: 'write',
		description: 'Update profile',
	},
	'trustLifecycleApi.getListProfiles': {
		riskLevel: 'read',
		description: 'List profiles',
	},
	'trustLifecycleApi.getGetProfileById': {
		riskLevel: 'read',
		description: 'Get profile by ID',
	},
	'trustLifecycleApi.getListProfiles_a46d97c': {
		riskLevel: 'read',
		description: 'List profiles',
	},
	'trustLifecycleApi.getGetProfileById_2316fef': {
		riskLevel: 'read',
		description: 'Get profile by ID',
	},
	'trustLifecycleApi.getGetEnrollmentCodeReport': {
		riskLevel: 'read',
		description: 'Get enrollment code report',
	},
	'trustLifecycleApi.getListAuditLogs': {
		riskLevel: 'read',
		description: 'List audit logs',
	},
	'trustLifecycleApi.getGetAuditLogEventById': {
		riskLevel: 'read',
		description: 'Get audit log event by ID',
	},
	'trustLifecycleApi.getGetAuditLogCount': {
		riskLevel: 'read',
		description: 'Get audit log count',
	},
	'trustLifecycleApi.getListRules': {
		riskLevel: 'read',
		description: 'List rules',
	},
	'trustLifecycleApi.postCreateRule': {
		riskLevel: 'write',
		description: 'Create rule',
	},
	'trustLifecycleApi.deleteDeleteRules': {
		riskLevel: 'destructive',
		description: 'Delete rules',
	},
	'trustLifecycleApi.getGetRuleById': {
		riskLevel: 'read',
		description: 'Get rule by ID',
	},
	'trustLifecycleApi.putUpdateRule': {
		riskLevel: 'write',
		description: 'Update rule',
	},
	'trustLifecycleApi.postRunRuleNow': {
		riskLevel: 'write',
		description: 'Run rule now',
	},
	'trustLifecycleApi.listOfScansUsingGet': {
		riskLevel: 'read',
		description: 'List scans',
	},
	'trustLifecycleApi.addScanUsingPost': {
		riskLevel: 'write',
		description: 'Add scan',
	},
	'trustLifecycleApi.deleteScanUsingPost': {
		riskLevel: 'destructive',
		description: 'Delete scan',
	},
	'trustLifecycleApi.editScanUsingPut': {
		riskLevel: 'write',
		description: 'Edit scan',
	},
	'trustLifecycleApi.getDetailsUsingGet1': {
		riskLevel: 'read',
		description: 'Get scan details',
	},
	'trustLifecycleApi.abortScanUsingPost': {
		riskLevel: 'write',
		description: 'Abort scan',
	},
	'trustLifecycleApi.publicListPastScansUsingGet': {
		riskLevel: 'read',
		description: 'List past scans',
	},
	'trustLifecycleApi.validateIpFqdnsPost': {
		riskLevel: 'write',
		description: 'Validate IP and FQDNs',
	},
	'trustLifecycleApi.checkScanExistPost': {
		riskLevel: 'write',
		description: 'Check if scan exists',
	},
	'trustLifecycleApi.getGetListOfSeats': {
		riskLevel: 'read',
		description: 'Get list of seats',
	},
	'trustLifecycleApi.postCreateSeat': {
		riskLevel: 'write',
		description: 'Create seat',
	},
	'trustLifecycleApi.getGetSeatByIdentifier': {
		riskLevel: 'read',
		description: 'Get seat by identifier',
	},
	'trustLifecycleApi.putUpdateSeat': {
		riskLevel: 'write',
		description: 'Update seat',
	},
	'trustLifecycleApi.deleteDeleteSeat': {
		riskLevel: 'destructive',
		description: 'Delete seat',
	},
	'trustLifecycleApi.putAssignSeatToAnotherBusinessUnit': {
		riskLevel: 'write',
		description: 'Assign seat to another business unit',
	},
	'trustLifecycleApi.getGetAvailableSeatTypes': {
		riskLevel: 'read',
		description: 'Get available seat types',
	},
	'trustLifecycleApi.listSensors': {
		riskLevel: 'read',
		description: 'List sensors',
	},
	'trustLifecycleApi.allocateNewSensorUsingPost': {
		riskLevel: 'write',
		description: 'Allocate sensor',
	},
	'trustLifecycleApi.postSuspendSensors': {
		riskLevel: 'write',
		description: 'Suspend sensors',
	},
	'trustLifecycleApi.postReinstateSensors': {
		riskLevel: 'write',
		description: 'Reinstate sensors',
	},
	'trustLifecycleApi.putUpdateSensorDetails': {
		riskLevel: 'write',
		description: 'Update sensor details',
	},
	'trustLifecycleApi.postVoidSensors': {
		riskLevel: 'write',
		description: 'Void sensors',
	},
	'trustLifecycleApi.getGetSensorById': {
		riskLevel: 'read',
		description: 'Get sensor by ID',
	},
	'trustLifecycleApi.renameSensorUsingPut': {
		riskLevel: 'write',
		description: 'Rename sensor',
	},
	'trustLifecycleApi.getSensorTemplateFileUsingGet': {
		riskLevel: 'read',
		description: 'Download sensor software environment details',
	},
	'trustLifecycleApi.getQueryServiceStatus': {
		riskLevel: 'read',
		description: 'Query service status',
	},
	'trustLifecycleApi.getQueryServiceHealth': {
		riskLevel: 'read',
		description: 'Query service health',
	},
	'contentTrustApi.listAuditLogsWithCursor': {
		riskLevel: 'read',
		description: 'List audit logs using cursor pagination',
	},
	'contentTrustApi.verifyAuditLog': {
		riskLevel: 'read',
		description: 'Verify audit log',
	},
	'contentTrustApi.getById': {
		riskLevel: 'read',
		description: 'Get audit log by ID',
	},
	'contentTrustApi.createRecurringCredential': {
		riskLevel: 'write',
		description: 'Create credential',
	},
	'contentTrustApi.updateCredential': {
		riskLevel: 'write',
		description: 'Update credential',
	},
	'contentTrustApi.getCredentialList': {
		riskLevel: 'read',
		description: 'List user credentials',
	},
	'contentTrustApi.oauth2Token': {
		riskLevel: 'write',
		description: 'Get access token',
	},
	'contentTrustApi.listCredentials': {
		riskLevel: 'write',
		description: 'List user credentials',
	},
	'contentTrustApi.credentialsInfo': {
		riskLevel: 'write',
		description: 'Get credential details',
	},
	'contentTrustApi.authorizeCredentials': {
		riskLevel: 'write',
		description: 'Authorize credential access',
	},
	'contentTrustApi.extendTransaction': {
		riskLevel: 'write',
		description: 'Extend multi-signature authorization',
	},
	'contentTrustApi.credentialSendOtp': {
		riskLevel: 'destructive',
		description: 'Send credential OTP',
	},
	'contentTrustApi.signHash': { riskLevel: 'write', description: 'Sign hash' },
	'contentTrustApi.timeStampToken': {
		riskLevel: 'write',
		description: 'Create hash timestamp',
	},
	'contentTrustApi.revokeToken': {
		riskLevel: 'destructive',
		description: 'Revokes the access token',
	},
	'contentTrustApi.oauth2Token1': {
		riskLevel: 'write',
		description: 'Get access token',
	},
	'contentTrustApi.listCredentials1': {
		riskLevel: 'write',
		description: 'List user credentials',
	},
	'contentTrustApi.credentialsInfo1': {
		riskLevel: 'write',
		description: 'Get credential details',
	},
	'contentTrustApi.authorizeCredentials1': {
		riskLevel: 'write',
		description: 'Authorize credential access',
	},
	'contentTrustApi.extendTransaction1': {
		riskLevel: 'write',
		description: 'Extend multi-signature authorization',
	},
	'contentTrustApi.credentialSendOtp1': {
		riskLevel: 'destructive',
		description: 'Send credential OTP',
	},
	'contentTrustApi.signHash1': { riskLevel: 'write', description: 'Sign hash' },
	'contentTrustApi.timeStampToken1': {
		riskLevel: 'write',
		description: 'Create hash timestamp',
	},
	'contentTrustApi.revokeToken1': {
		riskLevel: 'destructive',
		description: 'Revokes the access token',
	},
	'contentTrustApi.reject': {
		riskLevel: 'write',
		description: 'Reject validation',
	},
	'contentTrustApi.getValidationDetails': {
		riskLevel: 'read',
		description: 'Get user validation details',
	},
	'contentTrustApi.revalidate': {
		riskLevel: 'write',
		description: 'Re-initiate validation',
	},
	'contentTrustApi.approve': {
		riskLevel: 'write',
		description: 'Approve validation',
	},
	'contentTrustApi.listValidations': {
		riskLevel: 'read',
		description: 'List validations',
	},
	'contentTrustApi.createValidation': {
		riskLevel: 'write',
		description: 'Create validation',
	},
	'contentTrustApi.getValidation': {
		riskLevel: 'read',
		description: 'Get validation by ID',
	},
	'contentTrustApi.resendEmail': {
		riskLevel: 'destructive',
		description: 'Resend validation email',
	},
	'contentTrustApi.cancelValidation': {
		riskLevel: 'write',
		description: 'Cancel validation',
	},
	'contentTrustApi.retryValidation': {
		riskLevel: 'write',
		description: 'Retries to create user and his first credential',
	},
	'contentTrustApi.enableValidation': {
		riskLevel: 'write',
		description: 'Enable validation',
	},
	'contentTrustApi.disableValidation': {
		riskLevel: 'write',
		description: 'Disable validation',
	},
	'contentTrustApi.invalidateValidation': {
		riskLevel: 'destructive',
		description: 'Invalidate validation',
	},
	'contentTrustApi.approvePendingSignerApproval': {
		riskLevel: 'write',
		description: 'Approve self-enrolled user validation',
	},
	'contentTrustApi.rejectPendingSignerApproval': {
		riskLevel: 'write',
		description: 'Reject self-enrolled user validation',
	},
	'contentTrustApi.approveValidationOrganization': {
		riskLevel: 'write',
		description: 'Approve organization details for a validation',
	},
	'contentTrustApi.rejectValidationOrganization': {
		riskLevel: 'write',
		description: 'Reject organization details for a validation',
	},
	'contentTrustApi.enhanceHash': {
		riskLevel: 'write',
		description:
			'Enhance document hashes to AES(Advanced electronic signature) compliant hashes',
	},
	'contentTrustApi.enhanceSignature': {
		riskLevel: 'write',
		description:
			'Enhance PKCS1 signature(s) to AES(Advanced electronic signature) compliant signature(s)',
	},
	'contentTrustApi.setupAccount': {
		riskLevel: 'write',
		description: 'Setup new onboarding account.',
	},
	'contentTrustApi.updateAccount': {
		riskLevel: 'write',
		description: 'update the onboarded sub-account',
	},
	'contentTrustApi.createUserInAm': {
		riskLevel: 'write',
		description: 'Create user in AM',
	},
	'contentTrustApi.updateUserData': {
		riskLevel: 'write',
		description: 'Update user auth data like mobile or secret',
	},
	'contentTrustApi.createRecurringCredentialV2': {
		riskLevel: 'write',
		description:
			'Create credential v2 flow supports credential creation with CertCentral, Trustlink, MPKI8 and Dcone CA',
	},
	'contentTrustApi.getCredentialByName': {
		riskLevel: 'read',
		description: 'Returns credential details by credential name',
	},
	'contentTrustApi.cancelCredentialByName': {
		riskLevel: 'destructive',
		description: 'Cancel credential by credential name',
	},
	'contentTrustApi.revokeCredentials': {
		riskLevel: 'destructive',
		description: 'Revoke credentials',
	},
	'contentTrustApi.replaceClientAdmin': {
		riskLevel: 'write',
		description: 'Replace existing client admin user',
	},
} as const;

// Fixture table over 364 differently-typed generated endpoints: each entry has
// its own parsed input/output schema, so a single table row cannot keep the
// per-operation types. The table only exercises routing, so erasing the output
// to `unknown` avoids inventing a shared response type.
export type GeneratedOpenApiTestCase = {
	id: string;
	// `unknown`: the fixture table covers 364 output types, so one row cannot keep them.
	endpoint: CorsairEndpoint<DigicertContext, OpenApiCallInput, unknown>;
	input: OpenApiCallInput;
	// `unknown`: each row's output example is checked by that operation's schema at runtime.
	outputExample: unknown;
	expected: {
		family: OpenApiFamily;
		path: string;
		method: string;
		public: boolean;
	};
};

export const generatedOpenApiTestCases: GeneratedOpenApiTestCase[] = [
	{
		id: 'accountManagerApi.listApiTokens',
		endpoint: generatedOpenApiEndpoints.accountManagerApi.listApiTokens,
		input: {
			path: {},
			query: { user_id: '00000000-0000-4000-8000-000000000001' },
			headers: {},
			cookies: {},
		},
		outputExample: [],
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/api-access-token',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.createApiToken',
		endpoint: generatedOpenApiEndpoints.accountManagerApi.createApiToken,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { name: 'Api key' },
		},
		outputExample: {},
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/api-access-token',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.getApiTokenById',
		endpoint: generatedOpenApiEndpoints.accountManagerApi.getApiTokenById,
		input: {
			path: { id: '00000000-0000-4000-8000-000000000001' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/api-access-token/{id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.updateApiToken',
		endpoint: generatedOpenApiEndpoints.accountManagerApi.updateApiToken,
		input: {
			path: { id: '00000000-0000-4000-8000-000000000001' },
			query: {},
			headers: {},
			cookies: {},
			body: { name: 'Api key' },
		},
		outputExample: {},
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/api-access-token/{id}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.deleteApiToken',
		endpoint: generatedOpenApiEndpoints.accountManagerApi.deleteApiToken,
		input: {
			path: { id: '00000000-0000-4000-8000-000000000001' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/api-access-token/{id}',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.listAccounts',
		endpoint: generatedOpenApiEndpoints.accountManagerApi.listAccounts,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: [],
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/account',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.createAccount',
		endpoint: generatedOpenApiEndpoints.accountManagerApi.createAccount,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { name: 'Example account', service_period: { to: '2025-01-01' } },
		},
		outputExample: {},
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/account',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.getAccountDetails',
		endpoint: generatedOpenApiEndpoints.accountManagerApi.getAccountDetails,
		input: {
			path: { account_id: '00000000-0000-4000-8000-000000000001' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/account/{account_id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.updateAccount',
		endpoint: generatedOpenApiEndpoints.accountManagerApi.updateAccount,
		input: {
			path: { account_id: '00000000-0000-4000-8000-000000000001' },
			query: {},
			headers: {},
			cookies: {},
			body: { name: 'Example account', service_period: { to: '2025-01-01' } },
		},
		outputExample: {},
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/account/{account_id}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.listAuditLogs',
		endpoint: generatedOpenApiEndpoints.accountManagerApi.listAuditLogs,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/audit-log',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.getClientAuthCertificatesByUserId',
		endpoint:
			generatedOpenApiEndpoints.accountManagerApi
				.getClientAuthCertificatesByUserId,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: [],
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/client-auth-certificate',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.createClientAuthCertificate',
		endpoint:
			generatedOpenApiEndpoints.accountManagerApi.createClientAuthCertificate,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/client-auth-certificate',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.enableClientAuthCertificate',
		endpoint:
			generatedOpenApiEndpoints.accountManagerApi.enableClientAuthCertificate,
		input: {
			path: { certificate_id: '00000000-0000-4000-8000-000000000001' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/client-auth-certificate/{certificate_id}/enable',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.listOrganizations',
		endpoint: generatedOpenApiEndpoints.accountManagerApi.listOrganizations,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: [],
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/organization',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.getOrganizationDetails',
		endpoint:
			generatedOpenApiEndpoints.accountManagerApi.getOrganizationDetails,
		input: {
			path: { organization_id: 'e3ff35d1-cea4-4508-acb5-99d9cbd91e80' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/organization/{organization_id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.getUserDetails',
		endpoint: generatedOpenApiEndpoints.accountManagerApi.getUserDetails,
		input: {
			path: { user_id: '00000000-0000-4000-8000-000000000001' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/user/{user_id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.deleteUser',
		endpoint: generatedOpenApiEndpoints.accountManagerApi.deleteUser,
		input: {
			path: { user_id: '00000000-0000-4000-8000-000000000001' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/user/{user_id}',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.updateUser',
		endpoint: generatedOpenApiEndpoints.accountManagerApi.updateUser,
		input: {
			path: { user_id: '00000000-0000-4000-8000-000000000001' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/user/{user_id}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.listSelectUsers',
		endpoint: generatedOpenApiEndpoints.accountManagerApi.listSelectUsers,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: [],
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/users',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.listAllUsers',
		endpoint: generatedOpenApiEndpoints.accountManagerApi.listAllUsers,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: [],
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/user',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.createUser',
		endpoint: generatedOpenApiEndpoints.accountManagerApi.createUser,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/user',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'accountManagerApi.listUserRoles',
		endpoint: generatedOpenApiEndpoints.accountManagerApi.listUserRoles,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'accountManager',
			path: '/account/api/v1/role',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetAllCaCertificateAiaIssuerFiles',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi
				.getGetAllCaCertificateAiaIssuerFiles,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/aia-issuer',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postAddAnAiaIssuerFile',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postAddAnAiaIssuerFile,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/aia-issuer',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetAnAiaIssuerFile',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetAnAiaIssuerFile,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/aia-issuer/{id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetAnAiaIssuerFileBlob',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetAnAiaIssuerFileBlob,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: 1,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/aia-issuer/{id}/blob',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putUpdateAnAiaIssuerFile',
		endpoint: generatedOpenApiEndpoints.privateCAApi.putUpdateAnAiaIssuerFile,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/aia-issuer/{id}/blob',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getCheckAnalyticsConfiguration',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.getCheckAnalyticsConfiguration,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/analytics',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.deleteDeleteSamlConfiguration',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.deleteDeleteSamlConfiguration,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/api/saml/config',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetSamlConfiguration',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetSamlConfiguration,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/api/saml/config',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postCreateOrUpdateSamlConfiguration',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi
				.postCreateOrUpdateSamlConfiguration,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				idpCertificate: 'example',
				idpEntityId: 'example',
				idpMetadataXml: 'example',
				idpSsoUrl: 'example',
				spAcsUrl: 'example',
			},
		},
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/api/saml/config',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postParseIdPMetadata',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postParseIdPMetadata,
		input: { path: {}, query: {}, headers: {}, cookies: {}, body: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/api/saml/metadata/parse',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetAuditLog',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetAuditLog,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/audit',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postAssertionConsumerService',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.postAssertionConsumerService,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { SAMLResponse: 'example' },
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/auth/saml/acs',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getCheckIfSamlIsEnabled',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getCheckIfSamlIsEnabled,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/auth/saml/enabled',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getInitiateSamlLogin',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getInitiateSamlLogin,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/auth/saml/login',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postInitiateLogout',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postInitiateLogout,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/auth/saml/logout',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetSpMetadata',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetSpMetadata,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: 'example',
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/auth/saml/metadata',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postSingleLogoutService',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postSingleLogoutService,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { SAMLRequest: 'example' },
		},
		outputExample: 'example',
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/auth/saml/slo',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getShowAllCas',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getShowAllCas,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postCreateACa',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postCreateACa,
		input: { path: {}, query: {}, headers: {}, cookies: {}, body: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.deleteDeletesAPendingSignCa',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.deleteDeletesAPendingSignCa,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetACa',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetACa,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.deleteDeleteCaAccounts',
		endpoint: generatedOpenApiEndpoints.privateCAApi.deleteDeleteCaAccounts,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/accounts',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postAddCaAccounts',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postAddCaAccounts,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/accounts',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putSetCaAccounts',
		endpoint: generatedOpenApiEndpoints.privateCAApi.putSetCaAccounts,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/accounts',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putSetTheActiveAiaIssuerForACa',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.putSetTheActiveAiaIssuerForACa,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/active-aia-issuer',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putSetTheActiveCrlForACa',
		endpoint: generatedOpenApiEndpoints.privateCAApi.putSetTheActiveCrlForACa,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/active-crl',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postSetACaBlob',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postSetACaBlob,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/blob',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCaAiaIssuerConfiguration',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.getGetCaAiaIssuerConfiguration,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/aia-issuer/issuance',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putSetCaAiaIssuerConfiguration',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.putSetCaAiaIssuerConfiguration,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/aia-issuer/issuance',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCaCertPoliciesConfiguration',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.getGetCaCertPoliciesConfiguration,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/cert-policies/issuance',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putSetCaCertPoliciesConfiguration',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.putSetCaCertPoliciesConfiguration,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/cert-policies/issuance',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putSetCaIssuanceCertConfig',
		endpoint: generatedOpenApiEndpoints.privateCAApi.putSetCaIssuanceCertConfig,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/cert/issuance',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCaCertificateChains',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetCaCertificateChains,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/chain',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postAddACertificateChainToACa',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.postAddACertificateChainToACa,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/chain',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.deleteDeleteACertificateChain',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.deleteDeleteACertificateChain,
		input: {
			path: { id: 'example', chainID: 'example' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/chain/{chainID}',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetACertificateChain',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetACertificateChain,
		input: {
			path: { id: 'example', chainID: 'example' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/chain/{chainID}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putUpdateACertificateChain',
		endpoint: generatedOpenApiEndpoints.privateCAApi.putUpdateACertificateChain,
		input: {
			path: { id: 'example', chainID: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/chain/{chainID}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putSetIncludeAllCertsInCrl',
		endpoint: generatedOpenApiEndpoints.privateCAApi.putSetIncludeAllCertsInCrl,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/crl/include-all-certificates',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCaCrlIssuanceConfig',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetCaCrlIssuanceConfig,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/crl/issuance',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putSetCaCrlIssuanceConfig',
		endpoint: generatedOpenApiEndpoints.privateCAApi.putSetCaCrlIssuanceConfig,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/crl/issuance',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCaOcspGenerationConfig',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.getGetCaOcspGenerationConfig,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/ocsp/generation',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putSetCaOcspGenerationConfig',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.putSetCaOcspGenerationConfig,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/ocsp/generation',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCaOcspIssuanceConfig',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetCaOcspIssuanceConfig,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/ocsp/issuance',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putSetCaOcspIssuanceConfig',
		endpoint: generatedOpenApiEndpoints.privateCAApi.putSetCaOcspIssuanceConfig,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/ocsp/issuance',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCaOcspResponderConfig',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.getGetCaOcspResponderConfig,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/ocsp/responder',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putSetCaOcspResponderConfig',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.putSetCaOcspResponderConfig,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/ocsp/responder',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putSetAdditionalSettings',
		endpoint: generatedOpenApiEndpoints.privateCAApi.putSetAdditionalSettings,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/configuration/settings',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetACaCsr',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetACaCsr,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/csr',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postDecryptAPkcs7',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postDecryptAPkcs7,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/decrypt/pkcs7',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getDownloadACa',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getDownloadACa,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: [],
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/download',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postEncryptAPkcs7',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postEncryptAPkcs7,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/encrypt/pkcs7',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetTheRootCaHierarchy',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetTheRootCaHierarchy,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/hierarchy',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCaNotes',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetCaNotes,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/note',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postCreateCaNote',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postCreateCaNote,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/note',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCaOcspConfig',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetCaOcspConfig,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/ocsp-config',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postRecertifiesExistingCaByCaId',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.postRecertifiesExistingCaByCaId,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/recertify-create-ca',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postRecertifiesACaWithANewImportedCertificate',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi
				.postRecertifiesACaWithANewImportedCertificate,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/recertify-import-ca',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postCreateCaReinstateRequest',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.postCreateCaReinstateRequest,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/reinstate-request',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCaReinstateRequest',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetCaReinstateRequest,
		input: {
			path: { id: 'example', requestId: 'example' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/reinstate-request/{requestId}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postApproveCaReinstateRequest',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.postApproveCaReinstateRequest,
		input: {
			path: { id: 'example', requestId: 'example' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/reinstate-request/{requestId}/approve',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postRejectCaReinstateRequest',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.postRejectCaReinstateRequest,
		input: {
			path: { id: 'example', requestId: 'example' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/reinstate-request/{requestId}/reject',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postCreateCaRevokeRequest',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postCreateCaRevokeRequest,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/revocation-request',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCaRevokeRequest',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetCaRevokeRequest,
		input: {
			path: { id: 'example', requestId: 'example' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/revocation-request/{requestId}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postApproveCaRevokeRequest',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postApproveCaRevokeRequest,
		input: {
			path: { id: 'example', requestId: 'example' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/revocation-request/{requestId}/approve',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postSignAnAttributeCertificate',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.postSignAnAttributeCertificate,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/sign/attribute-certificate',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postSignACmpRequest',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postSignACmpRequest,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/sign/cmp',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postSignAGlobalPlatformRequest',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.postSignAGlobalPlatformRequest,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/sign/global-platform',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCaActiveStatus',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetCaActiveStatus,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/status',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postSetCaActiveStatus',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postSetCaActiveStatus,
		input: {
			path: { id: 'example' },
			query: { active_status: 'active' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/{id}/status',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCertificateExpiration',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.getGetCertificateExpiration,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: 1,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/cert-expiration',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetAllCertificates',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetAllCertificates,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/certificate-discovery',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postImportACa',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postImportACa,
		input: { path: {}, query: {}, headers: {}, cookies: {}, body: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/import',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postLinkACaKey',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postLinkACaKey,
		input: { path: {}, query: {}, headers: {}, cookies: {}, body: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/import/link-key',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postImportAnOfflineCa',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postImportAnOfflineCa,
		input: { path: {}, query: {}, headers: {}, cookies: {}, body: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/import/offline',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postImportAThirdPartyCa',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postImportAThirdPartyCa,
		input: { path: {}, query: {}, headers: {}, cookies: {}, body: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/import/third-party',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postCreateAPendingDelegatedOcspResponder',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi
				.postCreateAPendingDelegatedOcspResponder,
		input: { path: {}, query: {}, headers: {}, cookies: {}, body: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ca/ocsp-responder/delegated/pending',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetAllCertificates_a2d39d9',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.getGetAllCertificates_a2d39d9,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/certificate',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postCreateCertificate',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postCreateCertificate,
		input: { path: {}, query: {}, headers: {}, cookies: {}, body: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/certificate',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCertificate',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetCertificate,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/certificate/{id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getRecoverEscrowedEeKey',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getRecoverEscrowedEeKey,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/certificate/{id}/escrow/recover',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putRevokeCertificate',
		endpoint: generatedOpenApiEndpoints.privateCAApi.putRevokeCertificate,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/certificate/{id}/revocation',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCsvListOfCertificates',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.getGetCsvListOfCertificates,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: [],
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/certificate/download',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postImportACertificate',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postImportACertificate,
		input: { path: {}, query: {}, headers: {}, cookies: {}, body: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/certificate/import',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetAllCrlInfos',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetAllCrlInfos,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/crl',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postAddCrlInfos',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postAddCrlInfos,
		input: { path: {}, query: {}, headers: {}, cookies: {}, body: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/crl',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCrlInfo',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetCrlInfo,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/crl/{id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCrlBlobList',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetCrlBlobList,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/crl/{id}/blobs',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postImportCrlBlob',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postImportCrlBlob,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/crl/{id}/blobs',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCrlBlob',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetCrlBlob,
		input: {
			path: { id: 'example', crl_number: 'example' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/crl/{id}/blobs/{crl_number}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCrlConfig',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetCrlConfig,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/crl/{id}/configuration',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putSetCrlConfig',
		endpoint: generatedOpenApiEndpoints.privateCAApi.putSetCrlConfig,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/crl/{id}/configuration',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postCreateCrlNow',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postCreateCrlNow,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/crl/{id}/create-now',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postImportAClientKey',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postImportAClientKey,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				app_reference_id: 'example',
				partition_id: 'example',
				provider: 'example',
			},
		},
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/escrow/client-key-import',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetFedRampComplianceEvidence',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.getGetFedRampComplianceEvidence,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/fedramp/evidence',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetHsmPartitions',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetHsmPartitions,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/hsm/partition',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postCreateAnOcspResponder',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postCreateAnOcspResponder,
		input: { path: {}, query: {}, headers: {}, cookies: {}, body: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ocsp-responder',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetAnOcspResponder',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetAnOcspResponder,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ocsp-responder/{id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putSetAnOcspResponderStatus',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.putSetAnOcspResponderStatus,
		input: {
			path: { id: 'example', action: 'example' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ocsp-responder/{id}/{action}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putSetAnOcspBlob',
		endpoint: generatedOpenApiEndpoints.privateCAApi.putSetAnOcspBlob,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ocsp-responder/{id}/blob',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getDownloadAnOcspResponderCsr',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.getDownloadAnOcspResponderCsr,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ocsp-responder/{id}/csr',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postImportAnOcspResponder',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postImportAnOcspResponder,
		input: { path: {}, query: {}, headers: {}, cookies: {}, body: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ocsp-responder/import',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postCreateAPendingOcspResponder',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi.postCreateAPendingOcspResponder,
		input: { path: {}, query: {}, headers: {}, cookies: {}, body: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ocsp-responder/pending',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetAllOcspResponders',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetAllOcspResponders,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/ocsp-responders',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getHandleScepGetOperations',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getHandleScepGetOperations,
		input: {
			path: { profileID: 'example' },
			query: { operation: 'GetCACert' },
			headers: {},
			cookies: {},
		},
		outputExample: 'example',
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/scep/{profileID}',
			method: 'GET',
			public: true,
		},
	},
	{
		id: 'privateCAApi.postHandleScepPkiOperation',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postHandleScepPkiOperation,
		input: {
			path: { profileID: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: [],
		},
		outputExample: [],
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/scep/{profileID}',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCertificateTemplates',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetCertificateTemplates,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postCreateACustomCertificateTemplate',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi
				.postCreateACustomCertificateTemplate,
		input: { path: {}, query: {}, headers: {}, cookies: {}, body: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetACertificateTemplate',
		endpoint: generatedOpenApiEndpoints.privateCAApi.getGetACertificateTemplate,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template/{id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putUpdateACustomCertificateTemplate',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi
				.putUpdateACustomCertificateTemplate,
		input: {
			path: { id: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template/{id}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetAAccountsCertificateTemplateIsAssignedTo',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi
				.getGetAAccountsCertificateTemplateIsAssignedTo,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template/{id}/accounts',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putActivateACustomCertificateTemplate',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi
				.putActivateACustomCertificateTemplate,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template/{id}/activate',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.putDeactivateACustomCertificateTemplate',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi
				.putDeactivateACustomCertificateTemplate,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template/{id}/deactivate',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'privateCAApi.postVerifyAsn1Template',
		endpoint: generatedOpenApiEndpoints.privateCAApi.postVerifyAsn1Template,
		input: { path: {}, query: {}, headers: {}, cookies: {}, body: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template/asn1/verify',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCertificateTemplateValidationSchemas',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi
				.getGetCertificateTemplateValidationSchemas,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template/config',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'privateCAApi.getGetCertificateTemplateValidationSchemas_4fe4fdb',
		endpoint:
			generatedOpenApiEndpoints.privateCAApi
				.getGetCertificateTemplateValidationSchemas_4fe4fdb,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'privateCA',
			path: '/certificate-authority/api/v1/template/schema',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.recreateAcmecredentialsPublic',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.recreateAcmecredentialsPublic,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/acme-credentials/recreate',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.addSystemScanUsingPostpublic',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.addSystemScanUsingPostpublic,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				account_id: {},
				options: {},
				schedule: { frequency: 'ONE_TIME', start_time: {} },
				targets: {},
			},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/scan/add',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.abortSystemScanUsingPostpublic',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.abortSystemScanUsingPostpublic,
		input: {
			path: { agentId: {} },
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/scan/{agentId}/abort',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.suspendSystemScanUsingPostpublic',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.suspendSystemScanUsingPostpublic,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/scan/suspend',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.resumeSystemScanUsingPostpublic',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.resumeSystemScanUsingPostpublic,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/scan/resume',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.skipFutureSystemScanScheduleUsingPostpublic',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.skipFutureSystemScanScheduleUsingPostpublic,
		input: {
			path: { agentId: {}, time: {} },
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/scan/{agentId}/skip/{time}',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.restoreSystemScanScheduleUsingPostpublic',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.restoreSystemScanScheduleUsingPostpublic,
		input: {
			path: { agentId: {}, time: 1691377675 },
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/scan/{agentId}/restore/{time}',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.deletePastSystemScanUsingPostpublic',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.deletePastSystemScanUsingPostpublic,
		input: {
			path: { agentId: {}, scanId: {} },
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/scan/{agentId}/deletePastScan/{scanId}',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.listUpcomingSystemScansUsingGetpublic',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.listUpcomingSystemScansUsingGetpublic,
		input: {
			path: { id: {} },
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/scan/{id}/upcoming-scans',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.listPastSystemScansUsingGetpublic',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.listPastSystemScansUsingGetpublic,
		input: {
			path: { id: {} },
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/scan/{id}/past-scans',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getListAgents',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getListAgents,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetAgentById',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getGetAgentById,
		input: {
			path: { id: {} },
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/{id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.updateCertDeliveryLocationForAgentPostpublic',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.updateCertDeliveryLocationForAgentPostpublic,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/cert-delivery/update',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putApproveAgents',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.putApproveAgents,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/approve',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putVoidAgents',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.putVoidAgents,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/void',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putUpdateAgent',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.putUpdateAgent,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/update',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putRetryAgentConfig',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.putRetryAgentConfig,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/retry',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postPostAgentSuggestions',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.postPostAgentSuggestions,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/suggestions',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getListAgentScripts',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getListAgentScripts,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/script',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postPostAgentScript',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postPostAgentScript,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/script',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetAgentScriptById',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getGetAgentScriptById,
		input: {
			path: { id: '2cde64e1-9df9-4264-9e57-6dde5228146a' },
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/script/{id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putUpdateAgentScript',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.putUpdateAgentScript,
		input: {
			path: { id: '2cde64e1-9df9-4264-9e57-6dde5228146a' },
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/script/{id}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postAddAgentScriptsInBulk',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.postAddAgentScriptsInBulk,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/script/bulk',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putSuspendAgents',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.putSuspendAgents,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/suspend',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putRejectAgents',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.putRejectAgents,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/reject',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putReinstateAgents',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.putReinstateAgents,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/reinstate',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetGlobalAgentSettings',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getGetGlobalAgentSettings,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/settings',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putUpdateGlobalAgentSettings',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.putUpdateGlobalAgentSettings,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/settings',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postCreateGlobalAgentSettings',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.postCreateGlobalAgentSettings,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/agent/settings',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.createAutomationUsingPost',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.createAutomationUsingPost,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.createAwrAutomationUsingPost',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.createAwrAutomationUsingPost,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation/admin-web-request',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.checkEligibilityOfBulkAutomationUsingPost',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.checkEligibilityOfBulkAutomationUsingPost,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation/bulk/check-eligibility',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.requestBulkAutomationUsingPost',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.requestBulkAutomationUsingPost,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation/bulk',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getAutomationDetailsUsingGet',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getAutomationDetailsUsingGet,
		input: { path: { automation_id: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation/{automation_id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.updateAutomationUsingPut',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.updateAutomationUsingPut,
		input: { path: { automation_id: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation/{automation_id}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.retryAutomationUsingPut',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.retryAutomationUsingPut,
		input: { path: { automation_id: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation/retry/{automation_id}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.cancelAutomationUsingPut',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.cancelAutomationUsingPut,
		input: { path: { automation_id: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation/cancel/{automation_id}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.listAutomationInventory',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.listAutomationInventory,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: { limit: 1, offset: 0, total: 28 },
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation-inventory/unsecured',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getInventoryDetailsUsingGet',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getInventoryDetailsUsingGet,
		input: {
			path: { automation_id: {} },
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/automation-inventory/{automation_id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getListBusinessUnit',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getListBusinessUnit,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: { limit: 1, offset: 0, total: 28 },
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/business-unit',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postCreateBusinessUnit',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.postCreateBusinessUnit,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/business-unit',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetBusinessUnitById',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getGetBusinessUnitById,
		input: { path: { bu_id: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/business-unit/{bu_id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.deleteDeleteBusinessUnit',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.deleteDeleteBusinessUnit,
		input: { path: { bu_id: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/business-unit/{bu_id}',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putUpdateBusinessUnitLicense',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.putUpdateBusinessUnitLicense,
		input: { path: { bu_id: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/business-unit/{bu_id}/licensed-seats',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putAssignAnAdminToABusinessUnit',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.putAssignAnAdminToABusinessUnit,
		input: {
			path: { id: {} },
			query: {},
			headers: {},
			cookies: {},
			body: { id: {} },
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/business-unit/{id}/admin',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.deleteRemoveAnAdminFromABusinessUnit',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.deleteRemoveAnAdminFromABusinessUnit,
		input: {
			path: { id: {}, adminId: {} },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/business-unit/{id}/admin/{adminId}',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getListCertificateOwners',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getListCertificateOwners,
		input: { path: {}, query: { account_id: {} }, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-owners',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postCreateCertificateOwners',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.postCreateCertificateOwners,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { account_id: {}, certificate_owner: { email: {} } },
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-owners',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetCertificateOwnerById',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getGetCertificateOwnerById,
		input: {
			path: { id: {} },
			query: { account_id: {} },
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-owners/{id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putUpdateCertificateOwnerDetailsForAGivenCertificateOwnerId',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.putUpdateCertificateOwnerDetailsForAGivenCertificateOwnerId,
		input: {
			path: { id: {} },
			query: {},
			headers: {},
			cookies: {},
			body: { account_id: {}, certificate_owner: { email: {} } },
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-owners/{id}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.deleteDeleteCertificateOwner',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.deleteDeleteCertificateOwner,
		input: { path: { id: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-owners/{id}',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putAddCertificateOwnersMappingForCertificate',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.putAddCertificateOwnersMappingForCertificate,
		input: {
			path: { id: {} },
			query: {},
			headers: {},
			cookies: {},
			body: { account_id: {}, certificate_owner_ids: {} },
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-owners/certificate/{id}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.deleteDeleteCertificateOwnerMappingsForACertificate',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.deleteDeleteCertificateOwnerMappingsForACertificate,
		input: {
			path: { id: {} },
			query: {},
			headers: {},
			cookies: {},
			body: { account_id: {}, certificate_owner_ids: {} },
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-owners/certificate/{id}',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postIssueCertificate',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postIssueCertificate,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {
			serial_number: '4099ABF9C1BB7C02BBE1CDC7836CA9D58A71C2A5',
			delivery_format: 'x509',
			certificate:
				'-----BEGIN CERTIFICATE-----\n•••\n•••\n•••\n-----END CERTIFICATE-----\n',
		},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postPickUpCertificate',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postPickUpCertificate,
		input: { path: { request_id: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: {
			serial_number: '4099ABF9C1BB7C02BBE1CDC7836CA9D58A71C2A5',
			delivery_format: 'x509',
			certificate:
				'-----BEGIN CERTIFICATE-----\n•••\n•••\n•••\n-----END CERTIFICATE-----\n',
			status: 'ISSUED',
		},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-pickup/{request_id}',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postApproveEscrowedCertificateRecovery',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.postApproveEscrowedCertificateRecovery,
		input: { path: { serial_number: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/escrow/approve/{serial_number}',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postRenewCertificate',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postRenewCertificate,
		input: { path: { serial_number: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: { id: {} },
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/{serial_number}/renew',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postBulkUpdateTags',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postBulkUpdateTags,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/tag/bulk-add',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postBulkReplaceTags',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postBulkReplaceTags,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/tag/bulk-replace',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postImportCertificate',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postImportCertificate,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-import',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getSearchCertificates',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getSearchCertificates,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: { limit: 1, offset: 0, total: 28 },
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-search',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.publicCertificateSearchSummary',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.publicCertificateSearchSummary,
		input: { path: {}, query: { account_id: {} }, headers: {}, cookies: {} },
		outputExample: { limit: 1, offset: 0, total: 28 },
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-search/summary',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.publicGetCertUsingId',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.publicGetCertUsingId,
		input: {
			path: { certificate_id: {} },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate-search/{certificate_id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetCertificateBySerialNumber',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.getGetCertificateBySerialNumber,
		input: { path: { serial_number: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/{serial_number}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postRecoverEscrowedCertificateBySerialNumber',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.postRecoverEscrowedCertificateBySerialNumber,
		input: { path: { serial_number: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/escrow/recover/{serial_number}',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.certRevokeBySerial',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.certRevokeBySerial,
		input: { path: { serial_number: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/{serial_number}/revoke',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.deleteResumeSuspendedCertificate',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.deleteResumeSuspendedCertificate,
		input: { path: { serial_number: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/{serial_number}/revoke',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getAdditionalFormatsBySerialNumber',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.getAdditionalFormatsBySerialNumber,
		input: { path: { serial_number: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: {
			pkcs7: '—–BEGIN PKCS7—–\n•••\n•••\n•••\n—–END PKCS7—–\n',
			x509_cert_chain: [
				{
					common_name: 'XYZ Company',
					cert_blob:
						'-----BEGIN CERTIFICATE-----\n•••\n•••\n•••\n-----END CERTIFICATE-----\n',
				},
				{
					common_name: 'ABC Company',
					cert_blob:
						'-----BEGIN CERTIFICATE-----\n•••\n•••\n•••\n-----END CERTIFICATE-----\n',
				},
			],
		},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/{serial_number}/additional-formats',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.publicCountCertificateMigrationCandidates',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.publicCountCertificateMigrationCandidates,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/migration-candidates/count',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.publicGetCertificateMigrationCandidates',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.publicGetCertificateMigrationCandidates,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/certificate/migration-candidates',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.createUsingPost1',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.createUsingPost1,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.listByAccountUsingPost',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.listByAccountUsingPost,
		input: { path: {}, query: { account_id: {} }, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/search',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.suggestionsUsingGet',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.suggestionsUsingGet,
		input: {
			path: { field: 'provider' },
			query: { account_id: '9de3fa04-dc74-4871-aef2-fbc56919262f' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/suggestions/{field}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getDetailsByIdUsingGet',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getDetailsByIdUsingGet,
		input: {
			path: { connector_id: '4de3fa04-dc74-4871-aef2-fbc56919262a' },
			query: { account_id: '9de3fa04-dc74-4871-aef2-fbc56919262f' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/{connector_id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.updateUsingPut1',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.updateUsingPut1,
		input: {
			path: { connector_id: '0de3fa04-dc74-4871-aef2-fbc56919262c' },
			query: { account_id: '9de3fa04-dc74-4871-aef2-fbc56919262f' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/{connector_id}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.deleteByIdUsingDelete',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.deleteByIdUsingDelete,
		input: {
			path: { connector_id: {} },
			query: { account_id: {} },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/{connector_id}',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.runNowUsingPost',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.runNowUsingPost,
		input: {
			path: { connector_id: {} },
			query: { account_id: {} },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/{connector_id}/run-now',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.stopUsingPost',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.stopUsingPost,
		input: {
			path: { connector_id: {} },
			query: { account_id: {} },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/{connector_id}/stop',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.testConnectionUsingPost',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.testConnectionUsingPost,
		input: {
			path: { connector_id: {} },
			query: { account_id: {} },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/{connector_id}/test',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.unlinkUsingPost',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.unlinkUsingPost,
		input: {
			path: { connector_id: {} },
			query: { account_id: {} },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/{connector_id}/unlink',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getConnectorMetadataUsingGet',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getConnectorMetadataUsingGet,
		input: {
			path: { connector_id: {} },
			query: { account_id: {} },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/connectors/{connector_id}/metadata',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getListCustomAttributes',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getListCustomAttributes,
		input: { path: {}, query: { account_id: {} }, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/custom-attributes',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postCreateCustomAttribute',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.postCreateCustomAttribute,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				account_id: {},
				custom_attribute: { name: {}, type: 'TEXT_FIELD' },
			},
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/custom-attributes',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getListCustomAttributesForCertificate',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.getListCustomAttributesForCertificate,
		input: {
			path: { id: {} },
			query: { account_id: {} },
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/custom-attributes/certificate/{id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putAddCustomAttributesMappingForCertificate',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.putAddCustomAttributesMappingForCertificate,
		input: {
			path: { id: {} },
			query: {},
			headers: {},
			cookies: {},
			body: { account_id: {}, custom_attributes_request: {} },
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/custom-attributes/certificate/{id}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.deleteDeleteCustomAttributesMappingForCertificate',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.deleteDeleteCustomAttributesMappingForCertificate,
		input: {
			path: { id: {} },
			query: {},
			headers: {},
			cookies: {},
			body: { account_id: {}, custom_attribute_ids: {} },
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/custom-attributes/certificate/{id}',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetCustomAttributeById',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getGetCustomAttributeById,
		input: { path: { id: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/custom-attributes/{id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putUpdateCustomAttribute',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.putUpdateCustomAttribute,
		input: {
			path: { id: {} },
			query: { account_id: {} },
			headers: {},
			cookies: {},
			body: { custom_attribute: { name: {}, type: 'TEXT_FIELD' } },
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/custom-attributes/{id}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.deleteDeleteCustomAttribute',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.deleteDeleteCustomAttribute,
		input: { path: { id: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/custom-attributes/{id}',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getCertificateCountsBySourceTypes',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.getCertificateCountsBySourceTypes,
		input: { path: {}, query: { account_id: {} }, headers: {}, cookies: {} },
		outputExample: { CONNECTOR: 42, NETWORK_SCAN: 17 },
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/delete/inventory',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.deleteCertificatesBySourceTypes',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.deleteCertificatesBySourceTypes,
		input: {
			path: {},
			query: { account_id: {}, source_type: {} },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/delete/inventory',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getListDevices',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getListDevices,
		input: {
			path: {},
			query: { account_id: 'd82f6cd4-db5c-4723-b179-b210debc3e35' },
			headers: {},
			cookies: {},
		},
		outputExample: { limit: 1, offset: 0, total: 28 },
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postAddDevices',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postAddDevices,
		input: {
			path: {},
			query: { account_id: 'd82f6cd4-db5c-4723-b179-b210debc3e35' },
			headers: {},
			cookies: {},
			body: { devices: {} },
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.deleteDeleteDevicesBulk',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.deleteDeleteDevicesBulk,
		input: {
			path: {},
			query: { account_id: 'd82f6cd4-db5c-4723-b179-b210debc3e35' },
			headers: {},
			cookies: {},
			body: { deviceInventoryIds: {} },
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetDevice',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getGetDevice,
		input: {
			path: { id: '0b6c2a4e-5d8f-4c1a-9e3b-7f2d1a6c8e90' },
			query: { account_id: 'd82f6cd4-db5c-4723-b179-b210debc3e35' },
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory/{id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putUpdateDevice',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.putUpdateDevice,
		input: {
			path: { id: '0b6c2a4e-5d8f-4c1a-9e3b-7f2d1a6c8e90' },
			query: { account_id: 'd82f6cd4-db5c-4723-b179-b210debc3e35' },
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory/{id}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.deleteDeleteDevice',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.deleteDeleteDevice,
		input: {
			path: { id: '0b6c2a4e-5d8f-4c1a-9e3b-7f2d1a6c8e90' },
			query: { account_id: 'd82f6cd4-db5c-4723-b179-b210debc3e35' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory/{id}',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postImportDevicesFromCsv',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.postImportDevicesFromCsv,
		input: {
			path: {},
			query: { account_id: 'd82f6cd4-db5c-4723-b179-b210debc3e35' },
			headers: {},
			cookies: {},
			body: { file: {} },
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory/import',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getExportDevicesToCsv',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getExportDevicesToCsv,
		input: {
			path: {},
			query: { account_id: 'd82f6cd4-db5c-4723-b179-b210debc3e35' },
			headers: {},
			cookies: {},
		},
		outputExample: 'example',
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory/export',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putLinkDevicesToAProfile',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.putLinkDevicesToAProfile,
		input: {
			path: { profileId: '5f1e7a52-3c9d-4b8e-a1f0-6d2c4b8a9e17' },
			query: { account_id: 'd82f6cd4-db5c-4723-b179-b210debc3e35' },
			headers: {},
			cookies: {},
			body: { deviceInventoryIds: {} },
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory/profile/{profileId}/associate',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putUnlinkDevicesFromAProfile',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.putUnlinkDevicesFromAProfile,
		input: {
			path: { profileId: '5f1e7a52-3c9d-4b8e-a1f0-6d2c4b8a9e17' },
			query: { account_id: 'd82f6cd4-db5c-4723-b179-b210debc3e35' },
			headers: {},
			cookies: {},
			body: { deviceInventoryIds: {} },
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory/profile/{profileId}/disassociate',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putBulkMapDevicesToProfiles',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.putBulkMapDevicesToProfiles,
		input: {
			path: {},
			query: { account_id: 'd82f6cd4-db5c-4723-b179-b210debc3e35' },
			headers: {},
			cookies: {},
			body: { deviceInventoryIds: {}, profileIds: {} },
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory/profile-mappings',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.deleteBulkUnmapDevicesFromProfiles',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.deleteBulkUnmapDevicesFromProfiles,
		input: {
			path: {},
			query: { account_id: 'd82f6cd4-db5c-4723-b179-b210debc3e35' },
			headers: {},
			cookies: {},
			body: { deviceInventoryIds: {}, profileIds: {} },
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/device-inventory/profile-mappings',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getUnsecured',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getUnsecured,
		input: {
			path: {},
			query: {
				account: {
					id: 'c2fecb4c-0b91-4a19-987f-170d79f43ae8',
					name: 'My Account Name',
				},
			},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/inventory/endpoint/unsecured',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getUnsecuredCount',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getUnsecuredCount,
		input: {
			path: {},
			query: {
				account: {
					id: 'c2fecb4c-0b91-4a19-987f-170d79f43ae8',
					name: 'My Account Name',
				},
			},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/inventory/endpoint/unsecured/count',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getPortletCount',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getPortletCount,
		input: {
			path: {},
			query: {
				account_id: 'c2fecb4c-0b91-4a19-987f-170d79f43ae8',
				portlet_ids: {},
			},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/inventory/endpoint/portlet/count',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getAutomatableEndpoint',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getAutomatableEndpoint,
		input: {
			path: {},
			query: {
				account: {
					id: 'c2fecb4c-0b91-4a19-987f-170d79f43ae8',
					name: 'My Account Name',
				},
			},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/inventory/endpoint/automatable',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getAutomatableCount',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getAutomatableCount,
		input: {
			path: {},
			query: {
				account: {
					id: 'c2fecb4c-0b91-4a19-987f-170d79f43ae8',
					name: 'My Account Name',
				},
			},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/inventory/endpoint/automatable/count',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getInventoryDetails',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getInventoryDetails,
		input: {
			path: { id: 'c2fecb4c-0b91-4a19-987f-170d79f43ae8' },
			query: {
				instance_type: 'automation',
				account_id: 'c2fecb4c-0b91-4a19-987f-170d79f43ae8',
				inventory_type: 'automation',
			},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/inventory/endpoint/{id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getDiscoveredEndpoints',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getDiscoveredEndpoints,
		input: {
			path: {},
			query: {
				account: {
					id: 'c2fecb4c-0b91-4a19-987f-170d79f43ae8',
					name: 'My Account Name',
				},
			},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/inventory/endpoint/discovered',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getDiscoveredEndpointsCount',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getDiscoveredEndpointsCount,
		input: {
			path: {},
			query: {
				account: {
					id: 'c2fecb4c-0b91-4a19-987f-170d79f43ae8',
					name: 'My Account Name',
				},
			},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/inventory/endpoint/discovered/count',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getInstancesList',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getInstancesList,
		input: {
			path: {},
			query: {
				account: {
					id: 'c2fecb4c-0b91-4a19-987f-170d79f43ae8',
					name: 'My Account Name',
				},
				certificateThumbprint:
					'F3F4DB8D2C4AD79871D7A8D6350C34A72678F30A246E2E7383A428D995756858',
			},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/inventory/endpoint/list/instances',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postCreateEnrollment',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postCreateEnrollment,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/enrollment',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postRedeemEnrollment',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postRedeemEnrollment,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {
			serial_number: '4099ABF9C1BB7C02BBE1CDC7836CA9D58A71C2A5',
			delivery_format: 'x509',
			certificate:
				'-----BEGIN CERTIFICATE-----\n•••\n•••\n•••\n-----END CERTIFICATE-----\n',
		},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/enrollment/redeem',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putUpdateStatusOfManualApprovalEnrollment',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.putUpdateStatusOfManualApprovalEnrollment,
		input: { path: { enrollment_id: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/enrollment/{enrollment_id}/status',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetEnrollmentDetailsByEnrollmentCode',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.getGetEnrollmentDetailsByEnrollmentCode,
		input: {
			path: { enrollment_code: {} },
			query: { seat_id: {} },
			headers: {},
			cookies: {},
		},
		outputExample: {
			id: 'a6246022-5237-4244-bf9d-cc366996eaf8',
			seat_id: 'some-seat-id@example.com',
			profile_id: 'eb387733-ca74-4020-b432-9868ad8f1756',
			profile_name: 'Profile1',
			enrollment_code: '662641677',
			creation_date_time: '2022-03-30T11:34:25.834361',
			expiry_date_time: '2022-11-09T11:34:25.704781',
			status: 'created',
			number_of_bad_attempts: 0,
		},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/enrollment/{enrollment_code}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getListEnrollments',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getListEnrollments,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: { limit: 1, offset: 0, total: 28 },
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/enrollment-details',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetEnrollmentDetailsById',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getGetEnrollmentDetailsById,
		input: { path: { enrollment_id: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: {
			id: '216ead6e-b00e-4c7b-8074-e333b96fd254',
			status: 'created',
			email: 'email@example.com',
			created_at: '2020-10-30T11:34:25.834361',
			expires_at: '2020-11-09T11:34:25.704781',
			profile: {
				id: '33333333-4444-5555-6666-777777777777',
				name: 'Profile name',
			},
			business_unit: {
				id: '66666666-7777-8888-9999-000000000000',
				name: 'USCSS Nostromo',
			},
			seat: {
				id: 'cfb9f5b7-c35c-492e-9b63-55b5ad5299c2',
				name: 'some-seat-id@example.com',
				seat_type: 'USER_SEAT',
			},
			seat_id_mapping_value: 'COMMON_NAME',
			approved_by_current_user: true,
			comments: 'Some comments',
		},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/enrollment-details/{enrollment_id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postCreateEnrollmentForManualApproval',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.postCreateEnrollmentForManualApproval,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: { id: {} },
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/manual-enrollment',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getAttributesOfRenewableCertificateUsingCertIdUsingGet',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.getAttributesOfRenewableCertificateUsingCertIdUsingGet,
		input: {
			path: { certificate_id: {} },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/enrollment/certificate/{certificate_id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postRenewCertificateEnrollmentUsingCertificateId',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.postRenewCertificateEnrollmentUsingCertificateId,
		input: {
			path: { certificate_id: {} },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: { id: {} },
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/manual-enrollment/renew/{certificate_id}',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.handleGetCaCertsOperationUsingGet',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.handleGetCaCertsOperationUsingGet,
		input: { path: { profileId: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: [],
		expected: {
			family: 'trustLifecycle',
			path: '/.well-known/est/TLM-{profileId}/cacerts',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.handleSimpleEnrollOperationUsingPost',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.handleSimpleEnrollOperationUsingPost,
		input: { path: { profileId: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: [],
		expected: {
			family: 'trustLifecycle',
			path: '/.well-known/est/TLM-{profileId}/simpleenroll',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.handleSimpleReEnrollOperationUsingPost',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.handleSimpleReEnrollOperationUsingPost,
		input: { path: { profileId: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: [],
		expected: {
			family: 'trustLifecycle',
			path: '/.well-known/est/TLM-{profileId}/simplereenroll',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.listSensorIntegrations',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.listSensorIntegrations,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: { limit: 1, offset: 0, total: 28 },
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/integration',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.createSensorIntegration',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.createSensorIntegration,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/integration',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getSensorIntegrationById',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getSensorIntegrationById,
		input: {
			path: { integration_id: {} },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/integration/{integration_id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.refreshSensorIntegration',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.refreshSensorIntegration,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: [
			{
				data: {
					id: '4433c1d4-691a-40a0-ad00-1fdd3d745566',
					message: 'Refreshing integration configuration',
				},
				error: null,
			},
		],
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/integration/refresh',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetListOfDnsIntegrations',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getGetListOfDnsIntegrations,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/integration/dv',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postBulkVoid',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postBulkVoid,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/integration/void',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postVoidById',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postVoidById,
		input: {
			path: { integration_id: '7899ffd1-3d23-4206-98a2-65076d3f353d' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/integration/{integration_id}/void',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getSensorIntegrationAppParameters',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.getSensorIntegrationAppParameters,
		input: {
			path: { application_name: 'AWS' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/integration/applications/{application_name}/parameters',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postCreateANewProfile',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postCreateANewProfile,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				account_id: {},
				authentication_method: 'third_party_app',
				business_unit_id: {},
				enrollment_method: 'digicert_desktop_client',
				ica: { id: '66666666-7777-8888-9999-000000000000' },
				name: {},
				renewal_window_days: {},
				seat_id_mapping: 'email',
				template_id: {},
			},
		},
		outputExample: {
			id: 'd6743d9a-fb67-4a64-a33e-8a3229d28cc4',
			name: 'Profile name',
			status: 'Active',
			tags: ['Tag1', 'Tag2'],
			self_service_portal_active: true,
			ssp_auth_operations: ['enrollment', 'renewal'],
			signature_algorithm: 'SHA256_WITH_RSA',
			publish_to_public_directory: false,
			renewal_period_days: 30,
			duplicate_cert_policy: false,
			override_cert_validity_via_api: true,
			certificate_delivery_format: 'pkcs7',
			account_id: '3ff33f88-5717-4542-b3fc-3f312f44afa4',
			business_unit_id: 'e5bf49f0-a77b-4301-85e9-c15eb12df70f',
			enrollment_method: 'csr',
			authentication_method: 'enrollment_code',
			days_till_enrollment_expires: 10,
			automated_renewal: true,
			renewal_window_days: 30,
			custom_extended_key_usages: ['1.2.840.113583.1.1.7'],
			private_key_attributes: { key_size: '2048' },
			key_escrow_policy: {
				key_escrow_enabled: true,
				key_escrow_deployment_mode: 'CLOUD',
				dual_admin_recovery: true,
			},
			api_token_binding_enabled: true,
			api_token_ids: [
				'8517a493-ef6a-405e-85f1-eecd538e7692',
				'8517a493-ef6a-405e-85f1-eecd538e7693',
			],
			certificate_owners: [
				{
					id: '390db42b-e733-46be-a063-b2ce5d29fc74',
					first_name: 'Jane',
					last_name: 'Doe',
					email: 'jane.doe@example.com',
				},
				{
					id: '9b017541-4506-47e9-a338-b9dee89a60a0',
					first_name: 'John',
					last_name: 'Smith',
					email: 'john.smith@example.com',
				},
			],
			additional_recipients: 'someone@example.com,other@example.com',
			enable_dual_admin_approval: true,
			certificate: {
				subject: {
					attributes: [
						{
							type: 'common_name',
							mandatory: true,
							multiple: false,
							sources: [
								{
									mandatory: true,
									source: 'ENTERED_BY_USER_DURING_ENROLLMENT',
									ad_attribute_key: 'cn',
								},
							],
						},
						{ type: 'domain_component', mandatory: true },
						{
							type: 'organization_name',
							mandatory: true,
							multiple: false,
							source: [{ mandatory: false, source: 'UPLOADED_BY_ADMIN' }],
						},
						{
							type: 'street_address',
							mandatory: true,
							multiple: false,
							source: [
								{
									mandatory: false,
									source: 'AD_ATTRIBUTE',
									ad_attribute_key: 'streetAddress',
								},
								{
									mandatory: true,
									source: 'FIXED_VALUE',
									value: '20 Cooper Square',
								},
							],
						},
						{ type: 'country', mandatory: true },
						{ type: 'locality', mandatory: true },
						{ type: 'state', mandatory: true },
						{ type: 'postal_code', mandatory: true },
					],
				},
				validity: { unit: 'days', duration: 365 },
				extensions: {
					san: {
						critical: false,
						attributes: [
							{
								type: 'emails',
								mandatory: true,
								multiple: false,
								sources: [
									{
										mandatory: true,
										source: 'entered_by_user_during_enrollment',
									},
								],
							},
							{
								type: 'user_principal_names',
								mandatory: false,
								multiple: false,
								sources: [{ mandatory: false, source: 'uploaded_by_admin' }],
							},
						],
					},
					security_identifier: {
						attributes: [
							{
								type: 'critical',
								mandatory: false,
								multiple: false,
								sources: [
									{
										mandatory: false,
										source: 'entered_by_user_during_enrollment',
									},
								],
							},
							{
								type: 'additional_values',
								mandatory: false,
								multiple: false,
								sources: [
									{
										mandatory: false,
										source: 'entered_by_user_during_enrollment',
									},
								],
							},
						],
					},
				},
				issuer: {
					serial_number: '254554466396905590377942608199604315083804010285',
					subject_dn: 'CN=USCSS Nostromo, O=Weyland-Yutani, C=US',
					certificate:
						'-----BEGIN CERTIFICATE-----\n•••\n•••\n•••\n-----END CERTIFICATE-----\n',
					root: false,
					chain: [
						{
							serial_number: '254554466396905590377942608199604315083804010285',
							subject_dn: 'CN=The Company, O=Weyland-Yutani, C=US',
							certificate:
								'-----BEGIN CERTIFICATE-----\n•••\n•••\n•••\n-----END CERTIFICATE-----\n',
							root: true,
						},
					],
				},
			},
			enable_ldap_search: false,
			useCustomContact: false,
			cert_delivery_format: 'x509',
			template: {
				id: '99bfc12d-6732-e6c6-3f6d-a8c30e7833c1',
				name: 'Domain Controller',
				trust_type: 'private',
			},
			connector_id: '914bfbc2-b2e2-11ef-a370-fe7b3e6ed6dd',
			fields: {
				optional: false,
				multiple: false,
				key: 'subject_common_name',
				type: 'string',
				input: 'text',
				sources: {
					source: 'entered_by_user_during_enrollment',
					optional: false,
					multi_value: false,
					labels: [],
				},
				labels: [],
				max: 64,
				category: 'sdn_and_san_fields',
			},
			acme_credentials: {
				eab_kid: 'z4wwPiGg9DOwLlkc4hecHzSeCMlELTF4AgHS40UNEVk',
				eab_hmac:
					'ZDZiOWFlYWFkZGFlZmU1YWNmZmM1YjJiMmJiNTFhMTYwNWFiODFkZGFjMThkMGU2OWYxODE5NmMyMTFkZDk2MA',
				directory_url:
					'https://dcone.cluster.local/mpki/api/v1/acme/v2/directory',
			},
			duplicate_certificate_allowed: false,
			notifyRequestor: true,
			platform8_api_key: { id: '4', value: '4', name: '01e4f6d715*****' },
			allowed_list: [
				'*.digicert.com',
				'myhost.example.com',
				'100.101.102.103/16',
				'100.101.102.103-101.102.103.104',
				'1.2.3.4',
			],
			custom_attributes_fields: [
				{
					name: 'name',
					id: '1234',
					type: 'TEXT_FIELD',
					regex: 'mail.com',
					required: true,
					account_id: 'id',
					created_at: '00-00-0000',
					updated_at: '00-00-0000',
				},
			],
		},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/profile',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putUpdateProfile',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.putUpdateProfile,
		input: {
			path: { profile_id: {} },
			query: {},
			headers: {},
			cookies: {},
			body: {
				account_id: {},
				authentication_method: 'third_party_app',
				business_unit_id: {},
				enrollment_method: 'digicert_desktop_client',
				ica: { id: '66666666-7777-8888-9999-000000000000' },
				name: {},
				renewal_window_days: {},
				seat_id_mapping: 'email',
				template_id: {},
			},
		},
		outputExample: {
			id: 'd6743d9a-fb67-4a64-a33e-8a3229d28cc4',
			name: 'Profile name',
			status: 'Active',
			signature_algorithm: 'SHA256_WITH_RSA',
			publish_to_public_directory: false,
			renewal_period_days: 30,
			duplicate_cert_policy: false,
			override_cert_validity_via_api: true,
			certificate_delivery_format: 'pkcs7',
			custom_extended_key_usages: ['1.2.840.113583.1.1.7'],
			business_unit_id: 'e5bf49f0-a77b-4301-85e9-c15eb12df70f',
			enrollment_method: 'csr',
			authentication_method: 'enrollment_code',
			private_key_attributes: { key_size: '2048' },
			key_escrow_policy: {
				key_escrow_enabled: true,
				key_escrow_deployment_mode: 'CLOUD',
				dual_admin_recovery: true,
			},
			api_token_binding_enabled: true,
			api_token_id: '8517a493-ef6a-405e-85f1-eecd538e7692',
			enable_dual_admin_approval: true,
			certificate: {
				subject: {
					attributes: [
						{
							type: 'common_name',
							mandatory: true,
							multiple: false,
							sources: [
								{
									mandatory: true,
									source: 'ENTERED_BY_USER_DURING_ENROLLMENT',
									ad_attribute_key: 'cn',
								},
							],
						},
						{ type: 'domain_component', mandatory: true },
						{
							type: 'organization_name',
							mandatory: true,
							multiple: false,
							source: [{ mandatory: false, source: 'UPLOADED_BY_ADMIN' }],
						},
						{
							type: 'street_address',
							mandatory: true,
							multiple: false,
							source: [
								{
									mandatory: false,
									source: 'AD_ATTRIBUTE',
									ad_attribute_key: 'streetAddress',
								},
								{
									mandatory: true,
									source: 'FIXED_VALUE',
									value: '20 Cooper Square',
								},
							],
						},
						{ type: 'country', mandatory: true },
						{ type: 'locality', mandatory: true },
						{ type: 'state', mandatory: true },
						{ type: 'postal_code', mandatory: true },
					],
				},
				validity: { unit: 'days', duration: 365 },
				extensions: { san: { critical: false, attributes: [] } },
				issuer: {
					serial_number: '254554466396905590377942608199604315083804010285',
					subject_dn: 'CN=USCSS Nostromo, O=Weyland-Yutani, C=US',
					certificate:
						'-----BEGIN CERTIFICATE-----\n•••\n•••\n•••\n-----END CERTIFICATE-----\n',
					root: false,
					chain: [
						{
							serial_number: '254554466396905590377942608199604315083804010285',
							subject_dn: 'CN=The Company, O=Weyland-Yutani, C=US',
							certificate:
								'-----BEGIN CERTIFICATE-----\n•••\n•••\n•••\n-----END CERTIFICATE-----\n',
							root: true,
						},
					],
				},
			},
			allowed_list: [
				'*.digicert.com',
				'myhost.example.com',
				'100.101.102.103/16',
				'100.101.102.103-101.102.103.104',
				'1.2.3.4',
			],
		},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/profile/{profile_id}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getListProfiles',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getListProfiles,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v2/profile',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetProfileById',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getGetProfileById,
		input: { path: { profile_id: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: {
			id: 'd6743d9a-fb67-4a64-a33e-8a3229d28cc4',
			name: 'Profile name',
			status: 'Active',
			tags: ['Tag1', 'Tag2'],
			self_service_portal_active: true,
			ssp_auth_operations: ['enrollment', 'renewal'],
			signature_algorithm: 'SHA256_WITH_RSA',
			publish_to_public_directory: false,
			renewal_period_days: 30,
			duplicate_cert_policy: false,
			override_cert_validity_via_api: true,
			certificate_delivery_format: 'pkcs7',
			account_id: '3ff33f88-5717-4542-b3fc-3f312f44afa4',
			business_unit_id: 'e5bf49f0-a77b-4301-85e9-c15eb12df70f',
			enrollment_method: 'csr',
			authentication_method: 'enrollment_code',
			days_till_enrollment_expires: 10,
			automated_renewal: true,
			renewal_window_days: 30,
			custom_extended_key_usages: ['1.2.840.113583.1.1.7'],
			private_key_attributes: { key_size: '2048' },
			key_escrow_policy: {
				key_escrow_enabled: true,
				key_escrow_deployment_mode: 'CLOUD',
				dual_admin_recovery: true,
			},
			api_token_binding_enabled: true,
			api_token_ids: [
				'8517a493-ef6a-405e-85f1-eecd538e7692',
				'8517a493-ef6a-405e-85f1-eecd538e7693',
			],
			certificate_owners: [
				{
					id: '390db42b-e733-46be-a063-b2ce5d29fc74',
					first_name: 'Jane',
					last_name: 'Doe',
					email: 'jane.doe@example.com',
				},
				{
					id: '9b017541-4506-47e9-a338-b9dee89a60a0',
					first_name: 'John',
					last_name: 'Smith',
					email: 'john.smith@example.com',
				},
			],
			additional_recipients: 'someone@example.com,other@example.com',
			enable_dual_admin_approval: true,
			certificate: {
				subject: {
					attributes: [
						{
							type: 'common_name',
							mandatory: true,
							multiple: false,
							sources: [
								{
									mandatory: true,
									source: 'ENTERED_BY_USER_DURING_ENROLLMENT',
									ad_attribute_key: 'cn',
								},
							],
						},
						{ type: 'domain_component', mandatory: true },
						{
							type: 'organization_name',
							mandatory: true,
							multiple: false,
							source: [{ mandatory: false, source: 'UPLOADED_BY_ADMIN' }],
						},
						{
							type: 'street_address',
							mandatory: true,
							multiple: false,
							source: [
								{
									mandatory: false,
									source: 'AD_ATTRIBUTE',
									ad_attribute_key: 'streetAddress',
								},
								{
									mandatory: true,
									source: 'FIXED_VALUE',
									value: '20 Cooper Square',
								},
							],
						},
						{ type: 'country', mandatory: true },
						{ type: 'locality', mandatory: true },
						{ type: 'state', mandatory: true },
						{ type: 'postal_code', mandatory: true },
					],
				},
				validity: { unit: 'days', duration: 365 },
				extensions: {
					san: {
						critical: false,
						attributes: [
							{
								type: 'emails',
								mandatory: true,
								multiple: false,
								sources: [
									{
										mandatory: true,
										source: 'entered_by_user_during_enrollment',
									},
								],
							},
							{
								type: 'user_principal_names',
								mandatory: false,
								multiple: false,
								sources: [{ mandatory: false, source: 'uploaded_by_admin' }],
							},
						],
					},
					security_identifier: {
						attributes: [
							{
								type: 'critical',
								mandatory: false,
								multiple: false,
								sources: [
									{
										mandatory: false,
										source: 'entered_by_user_during_enrollment',
									},
								],
							},
							{
								type: 'additional_values',
								mandatory: false,
								multiple: false,
								sources: [
									{
										mandatory: false,
										source: 'entered_by_user_during_enrollment',
									},
								],
							},
						],
					},
				},
				issuer: {
					serial_number: '254554466396905590377942608199604315083804010285',
					subject_dn: 'CN=USCSS Nostromo, O=Weyland-Yutani, C=US',
					certificate:
						'-----BEGIN CERTIFICATE-----\n•••\n•••\n•••\n-----END CERTIFICATE-----\n',
					root: false,
					chain: [
						{
							serial_number: '254554466396905590377942608199604315083804010285',
							subject_dn: 'CN=The Company, O=Weyland-Yutani, C=US',
							certificate:
								'-----BEGIN CERTIFICATE-----\n•••\n•••\n•••\n-----END CERTIFICATE-----\n',
							root: true,
						},
					],
				},
			},
			enable_ldap_search: false,
			useCustomContact: false,
			cert_delivery_format: 'x509',
			template: {
				id: '99bfc12d-6732-e6c6-3f6d-a8c30e7833c1',
				name: 'Domain Controller',
				trust_type: 'private',
			},
			connector_id: '914bfbc2-b2e2-11ef-a370-fe7b3e6ed6dd',
			fields: {
				optional: false,
				multiple: false,
				key: 'subject_common_name',
				type: 'string',
				input: 'text',
				sources: {
					source: 'entered_by_user_during_enrollment',
					optional: false,
					multi_value: false,
					labels: [],
				},
				labels: [],
				max: 64,
				category: 'sdn_and_san_fields',
			},
			acme_credentials: {
				eab_kid: 'z4wwPiGg9DOwLlkc4hecHzSeCMlELTF4AgHS40UNEVk',
				eab_hmac:
					'ZDZiOWFlYWFkZGFlZmU1YWNmZmM1YjJiMmJiNTFhMTYwNWFiODFkZGFjMThkMGU2OWYxODE5NmMyMTFkZDk2MA',
				directory_url:
					'https://dcone.cluster.local/mpki/api/v1/acme/v2/directory',
			},
			duplicate_certificate_allowed: false,
			notifyRequestor: true,
			platform8_api_key: { id: '4', value: '4', name: '01e4f6d715*****' },
			allowed_list: [
				'*.digicert.com',
				'myhost.example.com',
				'100.101.102.103/16',
				'100.101.102.103-101.102.103.104',
				'1.2.3.4',
			],
			custom_attributes_fields: [
				{
					name: 'name',
					id: '1234',
					type: 'TEXT_FIELD',
					regex: 'mail.com',
					required: true,
					account_id: 'id',
					created_at: '00-00-0000',
					updated_at: '00-00-0000',
				},
			],
		},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v2/profile/{profile_id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getListProfiles_a46d97c',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getListProfiles_a46d97c,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v3/profile',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetProfileById_2316fef',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getGetProfileById_2316fef,
		input: { path: { profile_id: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: {
			id: 'd6743d9a-fb67-4a64-a33e-8a3229d28cc4',
			name: 'Public S/MIME Profile name',
			status: 'Active',
			signature_algorithm: 'SHA256_WITH_RSA',
			publish_to_public_directory: false,
			renewal_period_days: 30,
			duplicate_cert_policy: false,
			override_cert_validity_via_api: true,
			certificate_delivery_format: 'pkcs7',
			account_id: '3ff33f88-5717-4542-b3fc-3f312f44afa4',
			business_unit_id: 'e5bf49f0-a77b-4301-85e9-c15eb12df70f',
			enrollment_method: 'csr',
			authentication_method: 'enrollment_code',
			days_till_enrollment_expires: 10,
			automated_renewal: true,
			renewal_window_days: 30,
			custom_extended_key_usages: ['1.2.840.113583.1.1.7'],
			private_key_attributes: { key_size: '2048' },
			key_escrow_policy: {
				key_escrow_enabled: true,
				key_escrow_deployment_mode: 'CLOUD',
				dual_admin_recovery: true,
			},
			api_token_binding_enabled: true,
			api_token_ids: [
				'8517a493-ef6a-405e-85f1-eecd538e7692',
				'8517a493-ef6a-405e-85f1-eecd538e7693',
			],
			enable_dual_admin_approval: true,
			certificate: {
				subject: {
					attributes: [
						{
							type: 'given_name',
							mandatory: false,
							multiple: true,
							sources: [
								{
									mandatory: false,
									source: 'ENTERED_BY_USER_DURING_ENROLLMENT',
									ad_attribute_key: 'cn',
								},
							],
						},
						{ type: 'surname', mandatory: true, multiple: true },
						{
							type: 'email',
							mandatory: true,
							multiple: false,
							source: [
								{
									mandatory: false,
									source: 'ENTERED_BY_USER_DURING_ENROLLMENT',
								},
							],
						},
					],
				},
				validity: { unit: 'days', duration: 365 },
				extensions: {
					san: {
						critical: false,
						attributes: [
							{
								type: 'emails',
								mandatory: true,
								multiple: true,
								sources: [
									{
										mandatory: true,
										source: 'entered_by_user_during_enrollment',
									},
								],
							},
						],
					},
				},
				issuer: {
					serial_number: '254554466396905590377942608199604315083804010285',
					subject_dn: 'CN=USCSS Nostromo, O=Weyland-Yutani, C=US',
					certificate:
						'-----BEGIN CERTIFICATE-----\n•••\n•••\n•••\n-----END CERTIFICATE-----\n',
					root: false,
					chain: [
						{
							serial_number: '254554466396905590377942608199604315083804010285',
							subject_dn: 'CN=The Company, O=Weyland-Yutani, C=US',
							certificate:
								'-----BEGIN CERTIFICATE-----\n•••\n•••\n•••\n-----END CERTIFICATE-----\n',
							root: true,
						},
					],
				},
			},
			enable_ldap_search: false,
			useCustomContact: false,
			cert_delivery_format: 'x509',
			template: {
				id: '350b11f2-023d-4670-a42d-2d23c44c6768',
				name: 'Public S/MIME Secure Email (via CertCentral)',
				trust_type: 'public',
			},
			connector_id: '914bfbc2-b2e2-11ef-a370-fe7b3e6ed6dd',
			fields: {
				optional: false,
				multiple: false,
				key: 'subject_common_name',
				type: 'string',
				input: 'text',
				sources: {
					source: 'entered_by_user_during_enrollment',
					optional: false,
					multi_value: false,
					labels: [],
				},
				labels: [],
				max: 64,
				category: 'sdn_and_san_fields',
			},
			tags: [],
			duplicate_certificate_allowed: false,
			notifyRequestor: true,
			custom_attributes_fields: [
				{
					name: 'name',
					id: '1234',
					type: 'TEXT_FIELD',
					regex: 'mail.com',
					required: true,
					account_id: 'id',
					created_at: '00-00-0000',
					updated_at: '00-00-0000',
				},
			],
		},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v3/profile/{profile_id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetEnrollmentCodeReport',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getGetEnrollmentCodeReport,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: { limit: 1, offset: 0, total: 28 },
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/report/enrollment-code',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getListAuditLogs',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getListAuditLogs,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: { limit: 1, offset: 0, total: 28 },
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/audit-log',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetAuditLogEventById',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getGetAuditLogEventById,
		input: { path: { event_id: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/audit-log/{event_id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetAuditLogCount',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getGetAuditLogCount,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: { total: {} },
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/audit-log/count',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getListRules',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getListRules,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: { limit: 1, offset: 0, total: 28 },
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/rule',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postCreateRule',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postCreateRule,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				account_id: '56ae12d4-60a9-410a-914b-78a292d834fa',
				name: 'example-rule-name',
				type: 'certificate',
			},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/rule',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.deleteDeleteRules',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.deleteDeleteRules,
		input: {
			path: {},
			query: { account_id: {} },
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/rule',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetRuleById',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getGetRuleById,
		input: { path: { id: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: {
			account_id: '550e8400-e29b-41d4-a716-446655440000',
			name: 'Certificate Expiry Rule',
		},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/rule/{id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putUpdateRule',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.putUpdateRule,
		input: {
			path: { id: {} },
			query: {},
			headers: {},
			cookies: {},
			body: {
				account_id: '56ae12d4-60a9-410a-914b-78a292d834fa',
				name: 'example-rule-name',
				type: 'certificate',
			},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/rule/{id}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postRunRuleNow',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postRunRuleNow,
		input: {
			path: { ruleId: {} },
			query: { account_id: {} },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/rule/run/{ruleId}',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.listOfScansUsingGet',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.listOfScansUsingGet,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/scan',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.addScanUsingPost',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.addScanUsingPost,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { account_id: {}, config: {}, frequency: 'DAILY', name: {} },
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/scan/add',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.deleteScanUsingPost',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.deleteScanUsingPost,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/scan/delete',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.editScanUsingPut',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.editScanUsingPut,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { account_id: {}, config: {}, frequency: 'DAILY', name: {} },
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/scan/edit',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getDetailsUsingGet1',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getDetailsUsingGet1,
		input: {
			path: { scan_id: {} },
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/scan/{scan_id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.abortScanUsingPost',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.abortScanUsingPost,
		input: {
			path: { scan_id: {} },
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/scan/{scan_id}/abort',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.publicListPastScansUsingGet',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.publicListPastScansUsingGet,
		input: {
			path: { id: {} },
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/scan/{id}/past-scans',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.validateIpFqdnsPost',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.validateIpFqdnsPost,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/scan/validate-ip-fqdns',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.checkScanExistPost',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.checkScanExistPost,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/scan/exists',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetListOfSeats',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getGetListOfSeats,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: { limit: 1, offset: 0, total: 28 },
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/seat',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postCreateSeat',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postCreateSeat,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/seat',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetSeatByIdentifier',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getGetSeatByIdentifier,
		input: {
			path: { seat_id: {} },
			query: { seat_type_id: 'USER_SEAT' },
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/seat/{seat_id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putUpdateSeat',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.putUpdateSeat,
		input: { path: { seat_id: {} }, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/seat/{seat_id}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.deleteDeleteSeat',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.deleteDeleteSeat,
		input: {
			path: { seat_id: {} },
			query: { seat_type_id: 'USER_SEAT' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/seat/{seat_id}',
			method: 'DELETE',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putAssignSeatToAnotherBusinessUnit',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi
				.putAssignSeatToAnotherBusinessUnit,
		input: {
			path: { seat_id: {}, new_business_unit_id: {} },
			query: { business_unit_id: {} },
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/seat/{seat_id}/business-unit/{new_business_unit_id}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetAvailableSeatTypes',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getGetAvailableSeatTypes,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/seat-types',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.listSensors',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.listSensors,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: { limit: 1, offset: 0, total: 28 },
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/sensor',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.allocateNewSensorUsingPost',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.allocateNewSensorUsingPost,
		input: {
			path: {},
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/sensor/allocate',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postSuspendSensors',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postSuspendSensors,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/sensor/suspend',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postReinstateSensors',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postReinstateSensors,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/sensor/reinstate',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.putUpdateSensorDetails',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.putUpdateSensorDetails,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/sensor/update-details',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.postVoidSensors',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.postVoidSensors,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/sensor/void',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getGetSensorById',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getGetSensorById,
		input: {
			path: { sensor_id: '12345c6d-f27b-4d04-bb0d-a9f0909ff22f' },
			query: { account_id: 'f3f99122-1234-567a-919b-5f692216ff85' },
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/sensor/{sensor_id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.renameSensorUsingPut',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.renameSensorUsingPut,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/sensor/rename',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getSensorTemplateFileUsingGet',
		endpoint:
			generatedOpenApiEndpoints.trustLifecycleApi.getSensorTemplateFileUsingGet,
		input: {
			path: { license_key: '3B1BB123450A61C1' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: 'example',
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/sensor/{license_key}/download',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getQueryServiceStatus',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getQueryServiceStatus,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: 'example',
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/hello',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'trustLifecycleApi.getQueryServiceHealth',
		endpoint: generatedOpenApiEndpoints.trustLifecycleApi.getQueryServiceHealth,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'trustLifecycle',
			path: '/mpki/api/v1/health/extensive',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.listAuditLogsWithCursor',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.listAuditLogsWithCursor,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/audit-log/cursor',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.verifyAuditLog',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.verifyAuditLog,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/audit-log/{id}/verify',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.getById',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.getById,
		input: { path: { id: 'example' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/audit-log/{id}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.createRecurringCredential',
		endpoint:
			generatedOpenApiEndpoints.contentTrustApi.createRecurringCredential,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				account: { id: 'account_id' },
				label: 'example',
				profileId: 'example',
			},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/credential',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.updateCredential',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.updateCredential,
		input: {
			path: { credentialId: 'example' },
			query: { user_id: 'example' },
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: undefined,
		expected: {
			family: 'contentTrust',
			path: '/api/v1/credential/{credentialId}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.getCredentialList',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.getCredentialList,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/credentials/list',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.oauth2Token',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.oauth2Token,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/csc/v1/oauth2/token',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.listCredentials',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.listCredentials,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/csc/v1/credentials/list',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.credentialsInfo',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.credentialsInfo,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { credentialID: 'GX0112348' },
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/csc/v1/credentials/info',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.authorizeCredentials',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.authorizeCredentials,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				credentialID: 'GX0112348',
				hash: [
					'sTOgwOm+474gFj0q0x1iSNspKqbcse4IeiqlDg/HWuI=',
					'c1RPZ3dPbSs0NzRnRmowcTB4MWlTTnNwS3FiY3NlNEllaXFsRGcvSFd1ST0=',
				],
				numSignatures: 2,
			},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/csc/v1/credentials/authorize',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.extendTransaction',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.extendTransaction,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				SAD: '_TiHRG-bAH3XlFQZ3ndFhkXf9P24/CKN69L8gdSYp5_pw',
				credentialID: 'GX0112348',
				hash: [],
			},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/csc/v1/credentials/extendTransaction',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.credentialSendOtp',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.credentialSendOtp,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { credentialID: 'GX0112348' },
		},
		outputExample: undefined,
		expected: {
			family: 'contentTrust',
			path: '/csc/v1/credentials/sendOTP',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.signHash',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.signHash,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				SAD: '_TiHRG-bAH3XlFQZ3ndFhkXf9P24/CKN69L8gdSYp5_pw',
				credentialID: 'GX0112348',
				hash: [
					'sTOgwOm+474gFj0q0x1iSNspKqbcse4IeiqlDg/HWuI=',
					' c1RPZ3dPbSs0NzRnRmowcTB4MWlTTnNwS3FiY3NlNEllaXFsRGcvSFd1ST0=',
				],
				signAlgo: '1.2.840.113549.1.1.1',
			},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/csc/v1/signatures/signHash',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.timeStampToken',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.timeStampToken,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				hash: 'sTOgwOm+474gFj0q0x1iSNspKqbcse4IeiqlDg/HWuI=',
				hashAlgo: '2.16.840.1.101.3.4.2.1',
			},
		},
		outputExample: 'example',
		expected: {
			family: 'contentTrust',
			path: '/csc/v1/signatures/timestamp',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.revokeToken',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.revokeToken,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'contentTrust',
			path: '/csc/v1/auth/revoke',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.oauth2Token1',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.oauth2Token1,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/csc/v0/oauth2/token',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.listCredentials1',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.listCredentials1,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/csc/v0/credentials/list',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.credentialsInfo1',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.credentialsInfo1,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { credentialID: 'GX0112348' },
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/csc/v0/credentials/info',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.authorizeCredentials1',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.authorizeCredentials1,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				credentialID: 'GX0112348',
				hash: [
					'sTOgwOm+474gFj0q0x1iSNspKqbcse4IeiqlDg/HWuI=',
					'c1RPZ3dPbSs0NzRnRmowcTB4MWlTTnNwS3FiY3NlNEllaXFsRGcvSFd1ST0=',
				],
				numSignatures: 2,
			},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/csc/v0/credentials/authorize',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.extendTransaction1',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.extendTransaction1,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				SAD: '_TiHRG-bAH3XlFQZ3ndFhkXf9P24/CKN69L8gdSYp5_pw',
				credentialID: 'GX0112348',
				hash: [],
			},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/csc/v0/credentials/extendTransaction',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.credentialSendOtp1',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.credentialSendOtp1,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { credentialID: 'GX0112348' },
		},
		outputExample: undefined,
		expected: {
			family: 'contentTrust',
			path: '/csc/v0/credentials/sendOTP',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.signHash1',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.signHash1,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				SAD: '_TiHRG-bAH3XlFQZ3ndFhkXf9P24/CKN69L8gdSYp5_pw',
				credentialID: 'GX0112348',
				hash: [
					'sTOgwOm+474gFj0q0x1iSNspKqbcse4IeiqlDg/HWuI=',
					' c1RPZ3dPbSs0NzRnRmowcTB4MWlTTnNwS3FiY3NlNEllaXFsRGcvSFd1ST0=',
				],
				signAlgo: '1.2.840.113549.1.1.1',
			},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/csc/v0/signatures/signHash',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.timeStampToken1',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.timeStampToken1,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				hash: 'sTOgwOm+474gFj0q0x1iSNspKqbcse4IeiqlDg/HWuI=',
				hashAlgo: '2.16.840.1.101.3.4.2.1',
			},
		},
		outputExample: 'example',
		expected: {
			family: 'contentTrust',
			path: '/csc/v0/signatures/timestamp',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.revokeToken1',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.revokeToken1,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: undefined,
		expected: {
			family: 'contentTrust',
			path: '/csc/v0/auth/revoke',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.reject',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.reject,
		input: {
			path: { validationId: 'example' },
			query: { account_id: 'example' },
			headers: {},
			cookies: {},
			body: { reason: 'TECH_PHOTO' },
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/reject',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.getValidationDetails',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.getValidationDetails,
		input: {
			path: { userId: 'example' },
			query: { account_id: 'example' },
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/validation/user/{userId}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.revalidate',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.revalidate,
		input: {
			path: { validationId: 'example' },
			query: { account_id: 'example' },
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/revalidate',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.approve',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.approve,
		input: {
			path: { validationId: '00000000-0000-4000-8000-000000000001' },
			query: { account_id: 'example' },
			headers: {},
			cookies: {},
			body: {
				account: { id: 'account_id' },
				contact_data: { email: 'test@example.com', mobile_phone: 'example' },
				user_data: { first_name: 'example', last_name: 'example' },
				identification_document: {
					country: 'example',
					date_issued: 'example',
					number: 'example',
					type: 'PASSPORT',
					valid_until: 'example',
				},
			},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/approve',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.listValidations',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.listValidations,
		input: {
			path: {},
			query: { account_id: 'example' },
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/validation',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.createValidation',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.createValidation,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { account: { id: 'account_id' }, associated_users: {} },
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/validation',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.getValidation',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.getValidation,
		input: {
			path: { validationId: 'example' },
			query: { account_id: 'example' },
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.resendEmail',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.resendEmail,
		input: {
			path: { validationId: 'example' },
			query: { account_id: 'example' },
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/reSendEmail',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.cancelValidation',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.cancelValidation,
		input: {
			path: { validationId: '00000000-0000-4000-8000-000000000001' },
			query: { account_id: '00000000-0000-4000-8000-000000000001' },
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/cancel',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.retryValidation',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.retryValidation,
		input: {
			path: { validationId: 'example' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: undefined,
		expected: {
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/retry',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.enableValidation',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.enableValidation,
		input: {
			path: { validationId: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/enable',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.disableValidation',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.disableValidation,
		input: {
			path: { validationId: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/disable',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.invalidateValidation',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.invalidateValidation,
		input: {
			path: { validationId: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/invalidate',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.approvePendingSignerApproval',
		endpoint:
			generatedOpenApiEndpoints.contentTrustApi.approvePendingSignerApproval,
		input: {
			path: { validationId: 'example' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/approve-selfenrolled-user',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.rejectPendingSignerApproval',
		endpoint:
			generatedOpenApiEndpoints.contentTrustApi.rejectPendingSignerApproval,
		input: {
			path: { validationId: '00000000-0000-4000-8000-000000000001' },
			query: {},
			headers: {},
			cookies: {},
			body: { reason: 'VALIDATION_IN_PROCESS' },
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/reject-selfenrolled-user',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.approveValidationOrganization',
		endpoint:
			generatedOpenApiEndpoints.contentTrustApi.approveValidationOrganization,
		input: {
			path: { validationId: '00000000-0000-4000-8000-000000000001' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/approve-organization',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.rejectValidationOrganization',
		endpoint:
			generatedOpenApiEndpoints.contentTrustApi.rejectValidationOrganization,
		input: {
			path: { validationId: '00000000-0000-4000-8000-000000000001' },
			query: {},
			headers: {},
			cookies: {},
			body: { reason: 'TECH_PHOTO' },
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/validation/{validationId}/reject-organization',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.enhanceHash',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.enhanceHash,
		input: { path: {}, query: {}, headers: {}, cookies: {}, body: {} },
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/hashes',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.enhanceSignature',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.enhanceSignature,
		input: { path: {}, query: {}, headers: {}, cookies: {}, body: {} },
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/signatures',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.setupAccount',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.setupAccount,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				account_name: 'account_name',
				admin_user: {
					email: 'john@local.com',
					first_name: 'John',
					last_name: 'Doe',
					user_name: 'Doe',
					phone_number: 'example',
					locale: 'en_US',
					id: 'XXXXXXXXXX',
				},
				is_delegated: true,
				service_user: { email: 'john@local.com' },
				locale: 'en_US',
				organization_details: {
					name: 'Company1',
					address: 'Address1',
					address2: 'Suite 321',
					locale: {},
					country: 'IN',
					organization_contact: {
						email: 'jill.valentine@digicert.com',
						first_name: 'Jill',
						last_name: 'Valentine',
						job_title: 'CTO',
						telephone: '555-555-5555',
					},
					authorized_representative: [],
				},
			},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/onboard/setup-account',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.updateAccount',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.updateAccount,
		input: {
			path: { onboardingId: 'onboarding_id' },
			query: {},
			headers: {},
			cookies: {},
			body: {},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/onboard/setup-account/{onboardingId}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.createUserInAm',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.createUserInAm,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				user_name: 'user1710238743839',
				email: 'james.demo.1@example.com',
				first_name: 'James',
				last_name: 'Smith',
				user_type: 'standard',
				accounts: ['f9cd7525-b1ab-4067-96da-b0faac7212f6'],
				roles: ['DSM_DOCUMENT_SIGNER'],
				is_pipl_accepted: true,
				is_tou_accepted: true,
			},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/user',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.updateUserData',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.updateUserData,
		input: {
			path: { userId: 'user_id' },
			query: {},
			headers: {},
			cookies: {},
			body: { account: { id: 'account_id' } },
		},
		outputExample: undefined,
		expected: {
			family: 'contentTrust',
			path: '/api/v1/user/{userId}',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.createRecurringCredentialV2',
		endpoint:
			generatedOpenApiEndpoints.contentTrustApi.createRecurringCredentialV2,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				productName: 'AATL Electronic Seal | ZertES',
				label: 'tets3',
				userId: 'user_id',
				organization: { contacts: [], id: 1 },
			},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v2/credential',
			method: 'POST',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.getCredentialByName',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.getCredentialByName,
		input: { path: { name: 'name' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v2/credential/{name}',
			method: 'GET',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.cancelCredentialByName',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.cancelCredentialByName,
		input: {
			path: { name: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: { notes: 'cancellation notes' },
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v2/credential/{name}/cancel',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.revokeCredentials',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.revokeCredentials,
		input: {
			path: { name: 'example' },
			query: { user_id: 'example' },
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/credential/{name}/revoke',
			method: 'PUT',
			public: false,
		},
	},
	{
		id: 'contentTrustApi.replaceClientAdmin',
		endpoint: generatedOpenApiEndpoints.contentTrustApi.replaceClientAdmin,
		input: {
			path: { userId: 'example' },
			query: {},
			headers: {},
			cookies: {},
			body: {
				email: 'john@local.com',
				first_name: 'John',
				last_name: 'Doe',
				user_name: 'abc12345',
			},
		},
		outputExample: {},
		expected: {
			family: 'contentTrust',
			path: '/api/v1/user/{userId}/replace-client-admin',
			method: 'POST',
			public: false,
		},
	},
];

export const generatedOpenApiOneAuthPrefixes = [
	'accountManagerApi.',
	'privateCAApi.',
	'trustLifecycleApi.',
	'contentTrustApi.',
] as const;

export const generatedOpenApiPublicOperationIds = [
	'privateCAApi.getHandleScepGetOperations',
] as const;

export const generatedOpenApiOAuthOperationIds = [
	'contentTrustApi.oauth2Token',
	'contentTrustApi.listCredentials',
	'contentTrustApi.credentialsInfo',
	'contentTrustApi.authorizeCredentials',
	'contentTrustApi.extendTransaction',
	'contentTrustApi.credentialSendOtp',
	'contentTrustApi.signHash',
	'contentTrustApi.timeStampToken',
	'contentTrustApi.revokeToken',
	'contentTrustApi.oauth2Token1',
	'contentTrustApi.listCredentials1',
	'contentTrustApi.credentialsInfo1',
	'contentTrustApi.authorizeCredentials1',
	'contentTrustApi.extendTransaction1',
	'contentTrustApi.credentialSendOtp1',
	'contentTrustApi.signHash1',
	'contentTrustApi.timeStampToken1',
	'contentTrustApi.revokeToken1',
] as const;

export const generatedOpenApiEndpointCount = 364;
