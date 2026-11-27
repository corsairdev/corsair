// Generated with endpoints/operation-types.ts from the Firebase discovery
// documents: one entry per operation in firebase-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { firebaseSchemaEntry } from './openapi-schema';
import { createFirebaseOperation as op } from './operations';

export const firebaseEndpointsNested = {
	appCheck: {
		apps: {
			appAttestConfig: {
				batchGet: op('appCheck.apps.appAttestConfig.batchGet'),
				get: op('appCheck.apps.appAttestConfig.get'),
				patch: op('appCheck.apps.appAttestConfig.patch'),
			},
			debugTokens: {
				create: op('appCheck.apps.debugTokens.create'),
				delete: op('appCheck.apps.debugTokens.delete'),
				get: op('appCheck.apps.debugTokens.get'),
				list: op('appCheck.apps.debugTokens.list'),
				patch: op('appCheck.apps.debugTokens.patch'),
			},
			deviceCheckConfig: {
				batchGet: op('appCheck.apps.deviceCheckConfig.batchGet'),
				get: op('appCheck.apps.deviceCheckConfig.get'),
				patch: op('appCheck.apps.deviceCheckConfig.patch'),
			},
			exchangeAppAttestAssertion: op(
				'appCheck.apps.exchangeAppAttestAssertion',
			),
			exchangeAppAttestAttestation: op(
				'appCheck.apps.exchangeAppAttestAttestation',
			),
			exchangeCustomToken: op('appCheck.apps.exchangeCustomToken'),
			exchangeDebugToken: op('appCheck.apps.exchangeDebugToken'),
			exchangeDeviceCheckToken: op('appCheck.apps.exchangeDeviceCheckToken'),
			exchangePlayIntegrityToken: op(
				'appCheck.apps.exchangePlayIntegrityToken',
			),
			exchangeRecaptchaEnterpriseToken: op(
				'appCheck.apps.exchangeRecaptchaEnterpriseToken',
			),
			exchangeRecaptchaV3Token: op('appCheck.apps.exchangeRecaptchaV3Token'),
			generateAppAttestChallenge: op(
				'appCheck.apps.generateAppAttestChallenge',
			),
			generatePlayIntegrityChallenge: op(
				'appCheck.apps.generatePlayIntegrityChallenge',
			),
			mintAppCheckToken: op('appCheck.apps.mintAppCheckToken'),
			playIntegrityConfig: {
				batchGet: op('appCheck.apps.playIntegrityConfig.batchGet'),
				get: op('appCheck.apps.playIntegrityConfig.get'),
				patch: op('appCheck.apps.playIntegrityConfig.patch'),
			},
			recaptchaEnterpriseConfig: {
				batchGet: op('appCheck.apps.recaptchaEnterpriseConfig.batchGet'),
				get: op('appCheck.apps.recaptchaEnterpriseConfig.get'),
				patch: op('appCheck.apps.recaptchaEnterpriseConfig.patch'),
			},
			recaptchaV3Config: {
				batchGet: op('appCheck.apps.recaptchaV3Config.batchGet'),
				get: op('appCheck.apps.recaptchaV3Config.get'),
				patch: op('appCheck.apps.recaptchaV3Config.patch'),
			},
		},
		jwks: {
			get: op('appCheck.jwks.get'),
		},
		oauthClients: {
			exchangeAppAttestAssertion: op(
				'appCheck.oauthClients.exchangeAppAttestAssertion',
			),
			exchangeAppAttestAttestation: op(
				'appCheck.oauthClients.exchangeAppAttestAttestation',
			),
			exchangeDebugToken: op('appCheck.oauthClients.exchangeDebugToken'),
			generateAppAttestChallenge: op(
				'appCheck.oauthClients.generateAppAttestChallenge',
			),
		},
		services: {
			batchUpdate: op('appCheck.services.batchUpdate'),
			get: op('appCheck.services.get'),
			list: op('appCheck.services.list'),
			patch: op('appCheck.services.patch'),
			resourcePolicies: {
				batchUpdate: op('appCheck.services.resourcePolicies.batchUpdate'),
				create: op('appCheck.services.resourcePolicies.create'),
				delete: op('appCheck.services.resourcePolicies.delete'),
				get: op('appCheck.services.resourcePolicies.get'),
				list: op('appCheck.services.resourcePolicies.list'),
				patch: op('appCheck.services.resourcePolicies.patch'),
			},
		},
	},
	appDistribution: {
		apps: {
			getAabInfo: op('appDistribution.apps.getAabInfo'),
			releases: {
				batchDelete: op('appDistribution.apps.releases.batchDelete'),
				distribute: op('appDistribution.apps.releases.distribute'),
				feedbackReports: {
					delete: op('appDistribution.apps.releases.feedbackReports.delete'),
					get: op('appDistribution.apps.releases.feedbackReports.get'),
					list: op('appDistribution.apps.releases.feedbackReports.list'),
				},
				get: op('appDistribution.apps.releases.get'),
				list: op('appDistribution.apps.releases.list'),
				operations: {
					cancel: op('appDistribution.apps.releases.operations.cancel'),
					delete: op('appDistribution.apps.releases.operations.delete'),
					get: op('appDistribution.apps.releases.operations.get'),
					list: op('appDistribution.apps.releases.operations.list'),
					wait: op('appDistribution.apps.releases.operations.wait'),
				},
				patch: op('appDistribution.apps.releases.patch'),
			},
		},
		groups: {
			batchJoin: op('appDistribution.groups.batchJoin'),
			batchLeave: op('appDistribution.groups.batchLeave'),
			create: op('appDistribution.groups.create'),
			delete: op('appDistribution.groups.delete'),
			get: op('appDistribution.groups.get'),
			list: op('appDistribution.groups.list'),
			patch: op('appDistribution.groups.patch'),
		},
		media: {
			upload: op('appDistribution.media.upload'),
		},
		testers: {
			batchAdd: op('appDistribution.testers.batchAdd'),
			batchRemove: op('appDistribution.testers.batchRemove'),
			list: op('appDistribution.testers.list'),
			patch: op('appDistribution.testers.patch'),
		},
	},
	auth: {
		accounts: {
			createAuthUri: op('auth.accounts.createAuthUri'),
			delete: op('auth.accounts.delete'),
			issueSamlResponse: op('auth.accounts.issueSamlResponse'),
			lookup: op('auth.accounts.lookup'),
			resetPassword: op('auth.accounts.resetPassword'),
			sendOobCode: op('auth.accounts.sendOobCode'),
			sendVerificationCode: op('auth.accounts.sendVerificationCode'),
			signInWithCustomToken: op('auth.accounts.signInWithCustomToken'),
			signInWithEmailLink: op('auth.accounts.signInWithEmailLink'),
			signInWithGameCenter: op('auth.accounts.signInWithGameCenter'),
			signInWithIdp: op('auth.accounts.signInWithIdp'),
			signInWithPassword: op('auth.accounts.signInWithPassword'),
			signInWithPhoneNumber: op('auth.accounts.signInWithPhoneNumber'),
			signUp: op('auth.accounts.signUp'),
			update: op('auth.accounts.update'),
			verifyIosClient: op('auth.accounts.verifyIosClient'),
		},
		getProjects: op('auth.getProjects'),
		getPublicKeys: op('auth.getPublicKeys'),
		getRecaptchaParams: op('auth.getRecaptchaParams'),
		getSessionCookiePublicKeys: op('auth.getSessionCookiePublicKeys'),
		projects: {
			accounts: {
				batchCreate: op('auth.projects.accounts.batchCreate'),
				batchDelete: op('auth.projects.accounts.batchDelete'),
				batchGet: op('auth.projects.accounts.batchGet'),
				create: op('auth.projects.accounts.create'),
				delete: op('auth.projects.accounts.delete'),
				lookup: op('auth.projects.accounts.lookup'),
				query: op('auth.projects.accounts.query'),
				sendOobCode: op('auth.projects.accounts.sendOobCode'),
				update: op('auth.projects.accounts.update'),
			},
			createSessionCookie: op('auth.projects.createSessionCookie'),
			queryAccounts: op('auth.projects.queryAccounts'),
			tenants: {
				accounts: {
					batchCreate: op('auth.projects.tenants.accounts.batchCreate'),
					batchDelete: op('auth.projects.tenants.accounts.batchDelete'),
					batchGet: op('auth.projects.tenants.accounts.batchGet'),
					create: op('auth.projects.tenants.accounts.create'),
					delete: op('auth.projects.tenants.accounts.delete'),
					lookup: op('auth.projects.tenants.accounts.lookup'),
					query: op('auth.projects.tenants.accounts.query'),
					sendOobCode: op('auth.projects.tenants.accounts.sendOobCode'),
					update: op('auth.projects.tenants.accounts.update'),
				},
				createSessionCookie: op('auth.projects.tenants.createSessionCookie'),
			},
		},
	},
	authAdmin: {
		accounts: {
			mfaEnrollment: {
				finalize: op('authAdmin.accounts.mfaEnrollment.finalize'),
				start: op('authAdmin.accounts.mfaEnrollment.start'),
				withdraw: op('authAdmin.accounts.mfaEnrollment.withdraw'),
			},
			mfaSignIn: {
				finalize: op('authAdmin.accounts.mfaSignIn.finalize'),
				start: op('authAdmin.accounts.mfaSignIn.start'),
			},
			revokeToken: op('authAdmin.accounts.revokeToken'),
		},
		defaultSupportedIdpConfigs: {
			create: op('authAdmin.defaultSupportedIdpConfigs.create'),
			delete: op('authAdmin.defaultSupportedIdpConfigs.delete'),
			get: op('authAdmin.defaultSupportedIdpConfigs.get'),
			list: op('authAdmin.defaultSupportedIdpConfigs.list'),
			patch: op('authAdmin.defaultSupportedIdpConfigs.patch'),
		},
		defaultSupportedIdps: {
			list: op('authAdmin.defaultSupportedIdps.list'),
		},
		getPasswordPolicy: op('authAdmin.getPasswordPolicy'),
		getRecaptchaConfig: op('authAdmin.getRecaptchaConfig'),
		identityPlatform: {
			initializeAuth: op('authAdmin.identityPlatform.initializeAuth'),
		},
		inboundSamlConfigs: {
			create: op('authAdmin.inboundSamlConfigs.create'),
			delete: op('authAdmin.inboundSamlConfigs.delete'),
			get: op('authAdmin.inboundSamlConfigs.get'),
			list: op('authAdmin.inboundSamlConfigs.list'),
			patch: op('authAdmin.inboundSamlConfigs.patch'),
		},
		oauthIdpConfigs: {
			create: op('authAdmin.oauthIdpConfigs.create'),
			delete: op('authAdmin.oauthIdpConfigs.delete'),
			get: op('authAdmin.oauthIdpConfigs.get'),
			list: op('authAdmin.oauthIdpConfigs.list'),
			patch: op('authAdmin.oauthIdpConfigs.patch'),
		},
		projects: {
			getConfig: op('authAdmin.projects.getConfig'),
			updateConfig: op('authAdmin.projects.updateConfig'),
		},
		tenants: {
			create: op('authAdmin.tenants.create'),
			defaultSupportedIdpConfigs: {
				create: op('authAdmin.tenants.defaultSupportedIdpConfigs.create'),
				delete: op('authAdmin.tenants.defaultSupportedIdpConfigs.delete'),
				get: op('authAdmin.tenants.defaultSupportedIdpConfigs.get'),
				list: op('authAdmin.tenants.defaultSupportedIdpConfigs.list'),
				patch: op('authAdmin.tenants.defaultSupportedIdpConfigs.patch'),
			},
			delete: op('authAdmin.tenants.delete'),
			get: op('authAdmin.tenants.get'),
			getIamPolicy: op('authAdmin.tenants.getIamPolicy'),
			inboundSamlConfigs: {
				create: op('authAdmin.tenants.inboundSamlConfigs.create'),
				delete: op('authAdmin.tenants.inboundSamlConfigs.delete'),
				get: op('authAdmin.tenants.inboundSamlConfigs.get'),
				list: op('authAdmin.tenants.inboundSamlConfigs.list'),
				patch: op('authAdmin.tenants.inboundSamlConfigs.patch'),
			},
			list: op('authAdmin.tenants.list'),
			oauthIdpConfigs: {
				create: op('authAdmin.tenants.oauthIdpConfigs.create'),
				delete: op('authAdmin.tenants.oauthIdpConfigs.delete'),
				get: op('authAdmin.tenants.oauthIdpConfigs.get'),
				list: op('authAdmin.tenants.oauthIdpConfigs.list'),
				patch: op('authAdmin.tenants.oauthIdpConfigs.patch'),
			},
			patch: op('authAdmin.tenants.patch'),
			setIamPolicy: op('authAdmin.tenants.setIamPolicy'),
			testIamPermissions: op('authAdmin.tenants.testIamPermissions'),
		},
	},
	database: {
		delete: op('database.delete'),
		get: op('database.get'),
		push: op('database.push'),
		rules: {
			get: op('database.rules.get'),
			set: op('database.rules.set'),
		},
		set: op('database.set'),
		update: op('database.update'),
	},
	databaseInstances: {
		locations: {
			instances: {
				create: op('databaseInstances.locations.instances.create'),
				delete: op('databaseInstances.locations.instances.delete'),
				disable: op('databaseInstances.locations.instances.disable'),
				get: op('databaseInstances.locations.instances.get'),
				list: op('databaseInstances.locations.instances.list'),
				reenable: op('databaseInstances.locations.instances.reenable'),
				undelete: op('databaseInstances.locations.instances.undelete'),
			},
		},
	},
	firestore: {
		databases: {
			backupSchedules: {
				create: op('firestore.databases.backupSchedules.create'),
				delete: op('firestore.databases.backupSchedules.delete'),
				get: op('firestore.databases.backupSchedules.get'),
				list: op('firestore.databases.backupSchedules.list'),
				patch: op('firestore.databases.backupSchedules.patch'),
			},
			bulkDeleteDocuments: op('firestore.databases.bulkDeleteDocuments'),
			changeStreams: {
				create: op('firestore.databases.changeStreams.create'),
				delete: op('firestore.databases.changeStreams.delete'),
				get: op('firestore.databases.changeStreams.get'),
				list: op('firestore.databases.changeStreams.list'),
			},
			clone: op('firestore.databases.clone'),
			collectionGroups: {
				fields: {
					get: op('firestore.databases.collectionGroups.fields.get'),
					list: op('firestore.databases.collectionGroups.fields.list'),
					patch: op('firestore.databases.collectionGroups.fields.patch'),
				},
				indexes: {
					create: op('firestore.databases.collectionGroups.indexes.create'),
					delete: op('firestore.databases.collectionGroups.indexes.delete'),
					get: op('firestore.databases.collectionGroups.indexes.get'),
					list: op('firestore.databases.collectionGroups.indexes.list'),
				},
			},
			create: op('firestore.databases.create'),
			delete: op('firestore.databases.delete'),
			documents: {
				batchGet: op('firestore.databases.documents.batchGet'),
				batchWrite: op('firestore.databases.documents.batchWrite'),
				beginTransaction: op('firestore.databases.documents.beginTransaction'),
				commit: op('firestore.databases.documents.commit'),
				createDocument: op('firestore.databases.documents.createDocument'),
				delete: op('firestore.databases.documents.delete'),
				executePipeline: op('firestore.databases.documents.executePipeline'),
				get: op('firestore.databases.documents.get'),
				list: op('firestore.databases.documents.list'),
				listCollectionIds: op(
					'firestore.databases.documents.listCollectionIds',
				),
				listDocuments: op('firestore.databases.documents.listDocuments'),
				partitionQuery: op('firestore.databases.documents.partitionQuery'),
				patch: op('firestore.databases.documents.patch'),
				rollback: op('firestore.databases.documents.rollback'),
				runAggregationQuery: op(
					'firestore.databases.documents.runAggregationQuery',
				),
				runQuery: op('firestore.databases.documents.runQuery'),
			},
			exportDocuments: op('firestore.databases.exportDocuments'),
			get: op('firestore.databases.get'),
			importDocuments: op('firestore.databases.importDocuments'),
			list: op('firestore.databases.list'),
			operations: {
				cancel: op('firestore.databases.operations.cancel'),
				delete: op('firestore.databases.operations.delete'),
				get: op('firestore.databases.operations.get'),
				list: op('firestore.databases.operations.list'),
			},
			patch: op('firestore.databases.patch'),
			restore: op('firestore.databases.restore'),
			userCreds: {
				create: op('firestore.databases.userCreds.create'),
				delete: op('firestore.databases.userCreds.delete'),
				disable: op('firestore.databases.userCreds.disable'),
				enable: op('firestore.databases.userCreds.enable'),
				get: op('firestore.databases.userCreds.get'),
				list: op('firestore.databases.userCreds.list'),
				resetPassword: op('firestore.databases.userCreds.resetPassword'),
			},
		},
		locations: {
			backups: {
				delete: op('firestore.locations.backups.delete'),
				get: op('firestore.locations.backups.get'),
				list: op('firestore.locations.backups.list'),
			},
			get: op('firestore.locations.get'),
			list: op('firestore.locations.list'),
		},
	},
	hosting: {
		operations: {
			get: op('hosting.operations.get'),
		},
		sites: {
			channels: {
				create: op('hosting.sites.channels.create'),
				delete: op('hosting.sites.channels.delete'),
				get: op('hosting.sites.channels.get'),
				list: op('hosting.sites.channels.list'),
				patch: op('hosting.sites.channels.patch'),
				releases: {
					create: op('hosting.sites.channels.releases.create'),
					get: op('hosting.sites.channels.releases.get'),
					list: op('hosting.sites.channels.releases.list'),
				},
			},
			create: op('hosting.sites.create'),
			customDomains: {
				create: op('hosting.sites.customDomains.create'),
				delete: op('hosting.sites.customDomains.delete'),
				get: op('hosting.sites.customDomains.get'),
				list: op('hosting.sites.customDomains.list'),
				operations: {
					get: op('hosting.sites.customDomains.operations.get'),
					list: op('hosting.sites.customDomains.operations.list'),
				},
				patch: op('hosting.sites.customDomains.patch'),
				undelete: op('hosting.sites.customDomains.undelete'),
			},
			delete: op('hosting.sites.delete'),
			domains: {
				create: op('hosting.sites.domains.create'),
				delete: op('hosting.sites.domains.delete'),
				get: op('hosting.sites.domains.get'),
				list: op('hosting.sites.domains.list'),
				update: op('hosting.sites.domains.update'),
			},
			get: op('hosting.sites.get'),
			getConfig: op('hosting.sites.getConfig'),
			list: op('hosting.sites.list'),
			patch: op('hosting.sites.patch'),
			releases: {
				create: op('hosting.sites.releases.create'),
				get: op('hosting.sites.releases.get'),
				list: op('hosting.sites.releases.list'),
			},
			updateConfig: op('hosting.sites.updateConfig'),
			versions: {
				clone: op('hosting.sites.versions.clone'),
				create: op('hosting.sites.versions.create'),
				delete: op('hosting.sites.versions.delete'),
				files: {
					list: op('hosting.sites.versions.files.list'),
				},
				get: op('hosting.sites.versions.get'),
				list: op('hosting.sites.versions.list'),
				patch: op('hosting.sites.versions.patch'),
				populateFiles: op('hosting.sites.versions.populateFiles'),
			},
		},
	},
	management: {
		androidApps: {
			create: op('management.androidApps.create'),
			get: op('management.androidApps.get'),
			getConfig: op('management.androidApps.getConfig'),
			list: op('management.androidApps.list'),
			patch: op('management.androidApps.patch'),
			remove: op('management.androidApps.remove'),
			sha: {
				create: op('management.androidApps.sha.create'),
				delete: op('management.androidApps.sha.delete'),
				list: op('management.androidApps.sha.list'),
			},
			undelete: op('management.androidApps.undelete'),
		},
		availableLocations: {
			list: op('management.availableLocations.list'),
		},
		availableProjects: {
			list: op('management.availableProjects.list'),
		},
		defaultLocation: {
			finalize: op('management.defaultLocation.finalize'),
		},
		iosApps: {
			create: op('management.iosApps.create'),
			get: op('management.iosApps.get'),
			getConfig: op('management.iosApps.getConfig'),
			list: op('management.iosApps.list'),
			patch: op('management.iosApps.patch'),
			remove: op('management.iosApps.remove'),
			undelete: op('management.iosApps.undelete'),
		},
		operations: {
			get: op('management.operations.get'),
		},
		projects: {
			addFirebase: op('management.projects.addFirebase'),
			addGoogleAnalytics: op('management.projects.addGoogleAnalytics'),
			get: op('management.projects.get'),
			getAdminSdkConfig: op('management.projects.getAdminSdkConfig'),
			getAnalyticsDetails: op('management.projects.getAnalyticsDetails'),
			list: op('management.projects.list'),
			patch: op('management.projects.patch'),
			removeAnalytics: op('management.projects.removeAnalytics'),
			searchApps: op('management.projects.searchApps'),
		},
		webApps: {
			create: op('management.webApps.create'),
			get: op('management.webApps.get'),
			getConfig: op('management.webApps.getConfig'),
			list: op('management.webApps.list'),
			patch: op('management.webApps.patch'),
			remove: op('management.webApps.remove'),
			undelete: op('management.webApps.undelete'),
		},
	},
	messaging: {
		messages: {
			send: op('messaging.messages.send'),
		},
		registrations: {
			topicSubscriptions: {
				create: op('messaging.registrations.topicSubscriptions.create'),
				delete: op('messaging.registrations.topicSubscriptions.delete'),
				get: op('messaging.registrations.topicSubscriptions.get'),
				list: op('messaging.registrations.topicSubscriptions.list'),
				patch: op('messaging.registrations.topicSubscriptions.patch'),
			},
		},
	},
	remoteConfig: {
		namespaces: {
			experiments: {
				delete: op('remoteConfig.namespaces.experiments.delete'),
				get: op('remoteConfig.namespaces.experiments.get'),
				list: op('remoteConfig.namespaces.experiments.list'),
			},
			fetch: op('remoteConfig.namespaces.fetch'),
			get: op('remoteConfig.namespaces.get'),
			getConditionOrder: op('remoteConfig.namespaces.getConditionOrder'),
			getRemoteConfig: op('remoteConfig.namespaces.getRemoteConfig'),
			getServerRemoteConfig: op(
				'remoteConfig.namespaces.getServerRemoteConfig',
			),
			list: op('remoteConfig.namespaces.list'),
			remoteConfig: {
				downloadDefaults: op(
					'remoteConfig.namespaces.remoteConfig.downloadDefaults',
				),
				listVersions: op('remoteConfig.namespaces.remoteConfig.listVersions'),
				rollback: op('remoteConfig.namespaces.remoteConfig.rollback'),
			},
			remoteConfigConditions: {
				create: op('remoteConfig.namespaces.remoteConfigConditions.create'),
				delete: op('remoteConfig.namespaces.remoteConfigConditions.delete'),
				get: op('remoteConfig.namespaces.remoteConfigConditions.get'),
				list: op('remoteConfig.namespaces.remoteConfigConditions.list'),
				patch: op('remoteConfig.namespaces.remoteConfigConditions.patch'),
			},
			remoteConfigParameterGroups: {
				create: op(
					'remoteConfig.namespaces.remoteConfigParameterGroups.create',
				),
				delete: op(
					'remoteConfig.namespaces.remoteConfigParameterGroups.delete',
				),
				get: op('remoteConfig.namespaces.remoteConfigParameterGroups.get'),
				list: op('remoteConfig.namespaces.remoteConfigParameterGroups.list'),
				patch: op('remoteConfig.namespaces.remoteConfigParameterGroups.patch'),
			},
			remoteConfigParameters: {
				create: op('remoteConfig.namespaces.remoteConfigParameters.create'),
				delete: op('remoteConfig.namespaces.remoteConfigParameters.delete'),
				get: op('remoteConfig.namespaces.remoteConfigParameters.get'),
				list: op('remoteConfig.namespaces.remoteConfigParameters.list'),
				patch: op('remoteConfig.namespaces.remoteConfigParameters.patch'),
			},
			rollouts: {
				delete: op('remoteConfig.namespaces.rollouts.delete'),
				get: op('remoteConfig.namespaces.rollouts.get'),
				list: op('remoteConfig.namespaces.rollouts.list'),
			},
			updateConditionOrder: op('remoteConfig.namespaces.updateConditionOrder'),
			updateRemoteConfig: op('remoteConfig.namespaces.updateRemoteConfig'),
		},
		projects: {
			getRemoteConfig: op('remoteConfig.projects.getRemoteConfig'),
			updateRemoteConfig: op('remoteConfig.projects.updateRemoteConfig'),
		},
		remoteConfig: {
			downloadDefaults: op('remoteConfig.remoteConfig.downloadDefaults'),
			listVersions: op('remoteConfig.remoteConfig.listVersions'),
			rollback: op('remoteConfig.remoteConfig.rollback'),
		},
	},
	rules: {
		projects: {
			test: op('rules.projects.test'),
		},
		releases: {
			create: op('rules.releases.create'),
			delete: op('rules.releases.delete'),
			get: op('rules.releases.get'),
			getExecutable: op('rules.releases.getExecutable'),
			list: op('rules.releases.list'),
			patch: op('rules.releases.patch'),
		},
		rulesets: {
			create: op('rules.rulesets.create'),
			delete: op('rules.rulesets.delete'),
			get: op('rules.rulesets.get'),
			list: op('rules.rulesets.list'),
		},
	},
	storage: {
		buckets: {
			delete: op('storage.buckets.delete'),
			get: op('storage.buckets.get'),
			getIamPolicy: op('storage.buckets.getIamPolicy'),
			getStorageLayout: op('storage.buckets.getStorageLayout'),
			insert: op('storage.buckets.insert'),
			list: op('storage.buckets.list'),
			lockRetentionPolicy: op('storage.buckets.lockRetentionPolicy'),
			operations: {
				advanceRelocateBucket: op(
					'storage.buckets.operations.advanceRelocateBucket',
				),
				cancel: op('storage.buckets.operations.cancel'),
				get: op('storage.buckets.operations.get'),
				list: op('storage.buckets.operations.list'),
			},
			patch: op('storage.buckets.patch'),
			relocate: op('storage.buckets.relocate'),
			restore: op('storage.buckets.restore'),
			setIamPolicy: op('storage.buckets.setIamPolicy'),
			testIamPermissions: op('storage.buckets.testIamPermissions'),
			update: op('storage.buckets.update'),
		},
		objects: {
			bulkRestore: op('storage.objects.bulkRestore'),
			compose: op('storage.objects.compose'),
			copy: op('storage.objects.copy'),
			delete: op('storage.objects.delete'),
			download: op('storage.objects.download'),
			get: op('storage.objects.get'),
			getIamPolicy: op('storage.objects.getIamPolicy'),
			insert: op('storage.objects.insert'),
			list: op('storage.objects.list'),
			move: op('storage.objects.move'),
			patch: op('storage.objects.patch'),
			restore: op('storage.objects.restore'),
			rewrite: op('storage.objects.rewrite'),
			setIamPolicy: op('storage.objects.setIamPolicy'),
			testIamPermissions: op('storage.objects.testIamPermissions'),
			update: op('storage.objects.update'),
			viewFullContext: op('storage.objects.viewFullContext'),
		},
	},
	storageBuckets: {
		buckets: {
			addFirebase: op('storageBuckets.buckets.addFirebase'),
			get: op('storageBuckets.buckets.get'),
			list: op('storageBuckets.buckets.list'),
			removeFirebase: op('storageBuckets.buckets.removeFirebase'),
		},
		defaultBucket: {
			create: op('storageBuckets.defaultBucket.create'),
		},
		projects: {
			deleteDefaultBucket: op('storageBuckets.projects.deleteDefaultBucket'),
			getDefaultBucket: op('storageBuckets.projects.getDefaultBucket'),
		},
	},
} as const;

export const firebaseEndpointSchemas = {
	'appCheck.apps.appAttestConfig.batchGet': firebaseSchemaEntry(
		'appCheck.apps.appAttestConfig.batchGet',
	),
	'appCheck.apps.appAttestConfig.get': firebaseSchemaEntry(
		'appCheck.apps.appAttestConfig.get',
	),
	'appCheck.apps.appAttestConfig.patch': firebaseSchemaEntry(
		'appCheck.apps.appAttestConfig.patch',
	),
	'appCheck.apps.debugTokens.create': firebaseSchemaEntry(
		'appCheck.apps.debugTokens.create',
	),
	'appCheck.apps.debugTokens.delete': firebaseSchemaEntry(
		'appCheck.apps.debugTokens.delete',
	),
	'appCheck.apps.debugTokens.get': firebaseSchemaEntry(
		'appCheck.apps.debugTokens.get',
	),
	'appCheck.apps.debugTokens.list': firebaseSchemaEntry(
		'appCheck.apps.debugTokens.list',
	),
	'appCheck.apps.debugTokens.patch': firebaseSchemaEntry(
		'appCheck.apps.debugTokens.patch',
	),
	'appCheck.apps.deviceCheckConfig.batchGet': firebaseSchemaEntry(
		'appCheck.apps.deviceCheckConfig.batchGet',
	),
	'appCheck.apps.deviceCheckConfig.get': firebaseSchemaEntry(
		'appCheck.apps.deviceCheckConfig.get',
	),
	'appCheck.apps.deviceCheckConfig.patch': firebaseSchemaEntry(
		'appCheck.apps.deviceCheckConfig.patch',
	),
	'appCheck.apps.exchangeAppAttestAssertion': firebaseSchemaEntry(
		'appCheck.apps.exchangeAppAttestAssertion',
	),
	'appCheck.apps.exchangeAppAttestAttestation': firebaseSchemaEntry(
		'appCheck.apps.exchangeAppAttestAttestation',
	),
	'appCheck.apps.exchangeCustomToken': firebaseSchemaEntry(
		'appCheck.apps.exchangeCustomToken',
	),
	'appCheck.apps.exchangeDebugToken': firebaseSchemaEntry(
		'appCheck.apps.exchangeDebugToken',
	),
	'appCheck.apps.exchangeDeviceCheckToken': firebaseSchemaEntry(
		'appCheck.apps.exchangeDeviceCheckToken',
	),
	'appCheck.apps.exchangePlayIntegrityToken': firebaseSchemaEntry(
		'appCheck.apps.exchangePlayIntegrityToken',
	),
	'appCheck.apps.exchangeRecaptchaEnterpriseToken': firebaseSchemaEntry(
		'appCheck.apps.exchangeRecaptchaEnterpriseToken',
	),
	'appCheck.apps.exchangeRecaptchaV3Token': firebaseSchemaEntry(
		'appCheck.apps.exchangeRecaptchaV3Token',
	),
	'appCheck.apps.generateAppAttestChallenge': firebaseSchemaEntry(
		'appCheck.apps.generateAppAttestChallenge',
	),
	'appCheck.apps.generatePlayIntegrityChallenge': firebaseSchemaEntry(
		'appCheck.apps.generatePlayIntegrityChallenge',
	),
	'appCheck.apps.mintAppCheckToken': firebaseSchemaEntry(
		'appCheck.apps.mintAppCheckToken',
	),
	'appCheck.apps.playIntegrityConfig.batchGet': firebaseSchemaEntry(
		'appCheck.apps.playIntegrityConfig.batchGet',
	),
	'appCheck.apps.playIntegrityConfig.get': firebaseSchemaEntry(
		'appCheck.apps.playIntegrityConfig.get',
	),
	'appCheck.apps.playIntegrityConfig.patch': firebaseSchemaEntry(
		'appCheck.apps.playIntegrityConfig.patch',
	),
	'appCheck.apps.recaptchaEnterpriseConfig.batchGet': firebaseSchemaEntry(
		'appCheck.apps.recaptchaEnterpriseConfig.batchGet',
	),
	'appCheck.apps.recaptchaEnterpriseConfig.get': firebaseSchemaEntry(
		'appCheck.apps.recaptchaEnterpriseConfig.get',
	),
	'appCheck.apps.recaptchaEnterpriseConfig.patch': firebaseSchemaEntry(
		'appCheck.apps.recaptchaEnterpriseConfig.patch',
	),
	'appCheck.apps.recaptchaV3Config.batchGet': firebaseSchemaEntry(
		'appCheck.apps.recaptchaV3Config.batchGet',
	),
	'appCheck.apps.recaptchaV3Config.get': firebaseSchemaEntry(
		'appCheck.apps.recaptchaV3Config.get',
	),
	'appCheck.apps.recaptchaV3Config.patch': firebaseSchemaEntry(
		'appCheck.apps.recaptchaV3Config.patch',
	),
	'appCheck.jwks.get': firebaseSchemaEntry('appCheck.jwks.get'),
	'appCheck.oauthClients.exchangeAppAttestAssertion': firebaseSchemaEntry(
		'appCheck.oauthClients.exchangeAppAttestAssertion',
	),
	'appCheck.oauthClients.exchangeAppAttestAttestation': firebaseSchemaEntry(
		'appCheck.oauthClients.exchangeAppAttestAttestation',
	),
	'appCheck.oauthClients.exchangeDebugToken': firebaseSchemaEntry(
		'appCheck.oauthClients.exchangeDebugToken',
	),
	'appCheck.oauthClients.generateAppAttestChallenge': firebaseSchemaEntry(
		'appCheck.oauthClients.generateAppAttestChallenge',
	),
	'appCheck.services.batchUpdate': firebaseSchemaEntry(
		'appCheck.services.batchUpdate',
	),
	'appCheck.services.get': firebaseSchemaEntry('appCheck.services.get'),
	'appCheck.services.list': firebaseSchemaEntry('appCheck.services.list'),
	'appCheck.services.patch': firebaseSchemaEntry('appCheck.services.patch'),
	'appCheck.services.resourcePolicies.batchUpdate': firebaseSchemaEntry(
		'appCheck.services.resourcePolicies.batchUpdate',
	),
	'appCheck.services.resourcePolicies.create': firebaseSchemaEntry(
		'appCheck.services.resourcePolicies.create',
	),
	'appCheck.services.resourcePolicies.delete': firebaseSchemaEntry(
		'appCheck.services.resourcePolicies.delete',
	),
	'appCheck.services.resourcePolicies.get': firebaseSchemaEntry(
		'appCheck.services.resourcePolicies.get',
	),
	'appCheck.services.resourcePolicies.list': firebaseSchemaEntry(
		'appCheck.services.resourcePolicies.list',
	),
	'appCheck.services.resourcePolicies.patch': firebaseSchemaEntry(
		'appCheck.services.resourcePolicies.patch',
	),
	'appDistribution.apps.getAabInfo': firebaseSchemaEntry(
		'appDistribution.apps.getAabInfo',
	),
	'appDistribution.apps.releases.batchDelete': firebaseSchemaEntry(
		'appDistribution.apps.releases.batchDelete',
	),
	'appDistribution.apps.releases.distribute': firebaseSchemaEntry(
		'appDistribution.apps.releases.distribute',
	),
	'appDistribution.apps.releases.feedbackReports.delete': firebaseSchemaEntry(
		'appDistribution.apps.releases.feedbackReports.delete',
	),
	'appDistribution.apps.releases.feedbackReports.get': firebaseSchemaEntry(
		'appDistribution.apps.releases.feedbackReports.get',
	),
	'appDistribution.apps.releases.feedbackReports.list': firebaseSchemaEntry(
		'appDistribution.apps.releases.feedbackReports.list',
	),
	'appDistribution.apps.releases.get': firebaseSchemaEntry(
		'appDistribution.apps.releases.get',
	),
	'appDistribution.apps.releases.list': firebaseSchemaEntry(
		'appDistribution.apps.releases.list',
	),
	'appDistribution.apps.releases.operations.cancel': firebaseSchemaEntry(
		'appDistribution.apps.releases.operations.cancel',
	),
	'appDistribution.apps.releases.operations.delete': firebaseSchemaEntry(
		'appDistribution.apps.releases.operations.delete',
	),
	'appDistribution.apps.releases.operations.get': firebaseSchemaEntry(
		'appDistribution.apps.releases.operations.get',
	),
	'appDistribution.apps.releases.operations.list': firebaseSchemaEntry(
		'appDistribution.apps.releases.operations.list',
	),
	'appDistribution.apps.releases.operations.wait': firebaseSchemaEntry(
		'appDistribution.apps.releases.operations.wait',
	),
	'appDistribution.apps.releases.patch': firebaseSchemaEntry(
		'appDistribution.apps.releases.patch',
	),
	'appDistribution.groups.batchJoin': firebaseSchemaEntry(
		'appDistribution.groups.batchJoin',
	),
	'appDistribution.groups.batchLeave': firebaseSchemaEntry(
		'appDistribution.groups.batchLeave',
	),
	'appDistribution.groups.create': firebaseSchemaEntry(
		'appDistribution.groups.create',
	),
	'appDistribution.groups.delete': firebaseSchemaEntry(
		'appDistribution.groups.delete',
	),
	'appDistribution.groups.get': firebaseSchemaEntry(
		'appDistribution.groups.get',
	),
	'appDistribution.groups.list': firebaseSchemaEntry(
		'appDistribution.groups.list',
	),
	'appDistribution.groups.patch': firebaseSchemaEntry(
		'appDistribution.groups.patch',
	),
	'appDistribution.media.upload': firebaseSchemaEntry(
		'appDistribution.media.upload',
	),
	'appDistribution.testers.batchAdd': firebaseSchemaEntry(
		'appDistribution.testers.batchAdd',
	),
	'appDistribution.testers.batchRemove': firebaseSchemaEntry(
		'appDistribution.testers.batchRemove',
	),
	'appDistribution.testers.list': firebaseSchemaEntry(
		'appDistribution.testers.list',
	),
	'appDistribution.testers.patch': firebaseSchemaEntry(
		'appDistribution.testers.patch',
	),
	'auth.accounts.createAuthUri': firebaseSchemaEntry(
		'auth.accounts.createAuthUri',
	),
	'auth.accounts.delete': firebaseSchemaEntry('auth.accounts.delete'),
	'auth.accounts.issueSamlResponse': firebaseSchemaEntry(
		'auth.accounts.issueSamlResponse',
	),
	'auth.accounts.lookup': firebaseSchemaEntry('auth.accounts.lookup'),
	'auth.accounts.resetPassword': firebaseSchemaEntry(
		'auth.accounts.resetPassword',
	),
	'auth.accounts.sendOobCode': firebaseSchemaEntry('auth.accounts.sendOobCode'),
	'auth.accounts.sendVerificationCode': firebaseSchemaEntry(
		'auth.accounts.sendVerificationCode',
	),
	'auth.accounts.signInWithCustomToken': firebaseSchemaEntry(
		'auth.accounts.signInWithCustomToken',
	),
	'auth.accounts.signInWithEmailLink': firebaseSchemaEntry(
		'auth.accounts.signInWithEmailLink',
	),
	'auth.accounts.signInWithGameCenter': firebaseSchemaEntry(
		'auth.accounts.signInWithGameCenter',
	),
	'auth.accounts.signInWithIdp': firebaseSchemaEntry(
		'auth.accounts.signInWithIdp',
	),
	'auth.accounts.signInWithPassword': firebaseSchemaEntry(
		'auth.accounts.signInWithPassword',
	),
	'auth.accounts.signInWithPhoneNumber': firebaseSchemaEntry(
		'auth.accounts.signInWithPhoneNumber',
	),
	'auth.accounts.signUp': firebaseSchemaEntry('auth.accounts.signUp'),
	'auth.accounts.update': firebaseSchemaEntry('auth.accounts.update'),
	'auth.accounts.verifyIosClient': firebaseSchemaEntry(
		'auth.accounts.verifyIosClient',
	),
	'auth.getProjects': firebaseSchemaEntry('auth.getProjects'),
	'auth.getPublicKeys': firebaseSchemaEntry('auth.getPublicKeys'),
	'auth.getRecaptchaParams': firebaseSchemaEntry('auth.getRecaptchaParams'),
	'auth.getSessionCookiePublicKeys': firebaseSchemaEntry(
		'auth.getSessionCookiePublicKeys',
	),
	'auth.projects.accounts.batchCreate': firebaseSchemaEntry(
		'auth.projects.accounts.batchCreate',
	),
	'auth.projects.accounts.batchDelete': firebaseSchemaEntry(
		'auth.projects.accounts.batchDelete',
	),
	'auth.projects.accounts.batchGet': firebaseSchemaEntry(
		'auth.projects.accounts.batchGet',
	),
	'auth.projects.accounts.create': firebaseSchemaEntry(
		'auth.projects.accounts.create',
	),
	'auth.projects.accounts.delete': firebaseSchemaEntry(
		'auth.projects.accounts.delete',
	),
	'auth.projects.accounts.lookup': firebaseSchemaEntry(
		'auth.projects.accounts.lookup',
	),
	'auth.projects.accounts.query': firebaseSchemaEntry(
		'auth.projects.accounts.query',
	),
	'auth.projects.accounts.sendOobCode': firebaseSchemaEntry(
		'auth.projects.accounts.sendOobCode',
	),
	'auth.projects.accounts.update': firebaseSchemaEntry(
		'auth.projects.accounts.update',
	),
	'auth.projects.createSessionCookie': firebaseSchemaEntry(
		'auth.projects.createSessionCookie',
	),
	'auth.projects.queryAccounts': firebaseSchemaEntry(
		'auth.projects.queryAccounts',
	),
	'auth.projects.tenants.accounts.batchCreate': firebaseSchemaEntry(
		'auth.projects.tenants.accounts.batchCreate',
	),
	'auth.projects.tenants.accounts.batchDelete': firebaseSchemaEntry(
		'auth.projects.tenants.accounts.batchDelete',
	),
	'auth.projects.tenants.accounts.batchGet': firebaseSchemaEntry(
		'auth.projects.tenants.accounts.batchGet',
	),
	'auth.projects.tenants.accounts.create': firebaseSchemaEntry(
		'auth.projects.tenants.accounts.create',
	),
	'auth.projects.tenants.accounts.delete': firebaseSchemaEntry(
		'auth.projects.tenants.accounts.delete',
	),
	'auth.projects.tenants.accounts.lookup': firebaseSchemaEntry(
		'auth.projects.tenants.accounts.lookup',
	),
	'auth.projects.tenants.accounts.query': firebaseSchemaEntry(
		'auth.projects.tenants.accounts.query',
	),
	'auth.projects.tenants.accounts.sendOobCode': firebaseSchemaEntry(
		'auth.projects.tenants.accounts.sendOobCode',
	),
	'auth.projects.tenants.accounts.update': firebaseSchemaEntry(
		'auth.projects.tenants.accounts.update',
	),
	'auth.projects.tenants.createSessionCookie': firebaseSchemaEntry(
		'auth.projects.tenants.createSessionCookie',
	),
	'authAdmin.accounts.mfaEnrollment.finalize': firebaseSchemaEntry(
		'authAdmin.accounts.mfaEnrollment.finalize',
	),
	'authAdmin.accounts.mfaEnrollment.start': firebaseSchemaEntry(
		'authAdmin.accounts.mfaEnrollment.start',
	),
	'authAdmin.accounts.mfaEnrollment.withdraw': firebaseSchemaEntry(
		'authAdmin.accounts.mfaEnrollment.withdraw',
	),
	'authAdmin.accounts.mfaSignIn.finalize': firebaseSchemaEntry(
		'authAdmin.accounts.mfaSignIn.finalize',
	),
	'authAdmin.accounts.mfaSignIn.start': firebaseSchemaEntry(
		'authAdmin.accounts.mfaSignIn.start',
	),
	'authAdmin.accounts.revokeToken': firebaseSchemaEntry(
		'authAdmin.accounts.revokeToken',
	),
	'authAdmin.defaultSupportedIdpConfigs.create': firebaseSchemaEntry(
		'authAdmin.defaultSupportedIdpConfigs.create',
	),
	'authAdmin.defaultSupportedIdpConfigs.delete': firebaseSchemaEntry(
		'authAdmin.defaultSupportedIdpConfigs.delete',
	),
	'authAdmin.defaultSupportedIdpConfigs.get': firebaseSchemaEntry(
		'authAdmin.defaultSupportedIdpConfigs.get',
	),
	'authAdmin.defaultSupportedIdpConfigs.list': firebaseSchemaEntry(
		'authAdmin.defaultSupportedIdpConfigs.list',
	),
	'authAdmin.defaultSupportedIdpConfigs.patch': firebaseSchemaEntry(
		'authAdmin.defaultSupportedIdpConfigs.patch',
	),
	'authAdmin.defaultSupportedIdps.list': firebaseSchemaEntry(
		'authAdmin.defaultSupportedIdps.list',
	),
	'authAdmin.getPasswordPolicy': firebaseSchemaEntry(
		'authAdmin.getPasswordPolicy',
	),
	'authAdmin.getRecaptchaConfig': firebaseSchemaEntry(
		'authAdmin.getRecaptchaConfig',
	),
	'authAdmin.identityPlatform.initializeAuth': firebaseSchemaEntry(
		'authAdmin.identityPlatform.initializeAuth',
	),
	'authAdmin.inboundSamlConfigs.create': firebaseSchemaEntry(
		'authAdmin.inboundSamlConfigs.create',
	),
	'authAdmin.inboundSamlConfigs.delete': firebaseSchemaEntry(
		'authAdmin.inboundSamlConfigs.delete',
	),
	'authAdmin.inboundSamlConfigs.get': firebaseSchemaEntry(
		'authAdmin.inboundSamlConfigs.get',
	),
	'authAdmin.inboundSamlConfigs.list': firebaseSchemaEntry(
		'authAdmin.inboundSamlConfigs.list',
	),
	'authAdmin.inboundSamlConfigs.patch': firebaseSchemaEntry(
		'authAdmin.inboundSamlConfigs.patch',
	),
	'authAdmin.oauthIdpConfigs.create': firebaseSchemaEntry(
		'authAdmin.oauthIdpConfigs.create',
	),
	'authAdmin.oauthIdpConfigs.delete': firebaseSchemaEntry(
		'authAdmin.oauthIdpConfigs.delete',
	),
	'authAdmin.oauthIdpConfigs.get': firebaseSchemaEntry(
		'authAdmin.oauthIdpConfigs.get',
	),
	'authAdmin.oauthIdpConfigs.list': firebaseSchemaEntry(
		'authAdmin.oauthIdpConfigs.list',
	),
	'authAdmin.oauthIdpConfigs.patch': firebaseSchemaEntry(
		'authAdmin.oauthIdpConfigs.patch',
	),
	'authAdmin.projects.getConfig': firebaseSchemaEntry(
		'authAdmin.projects.getConfig',
	),
	'authAdmin.projects.updateConfig': firebaseSchemaEntry(
		'authAdmin.projects.updateConfig',
	),
	'authAdmin.tenants.create': firebaseSchemaEntry('authAdmin.tenants.create'),
	'authAdmin.tenants.defaultSupportedIdpConfigs.create': firebaseSchemaEntry(
		'authAdmin.tenants.defaultSupportedIdpConfigs.create',
	),
	'authAdmin.tenants.defaultSupportedIdpConfigs.delete': firebaseSchemaEntry(
		'authAdmin.tenants.defaultSupportedIdpConfigs.delete',
	),
	'authAdmin.tenants.defaultSupportedIdpConfigs.get': firebaseSchemaEntry(
		'authAdmin.tenants.defaultSupportedIdpConfigs.get',
	),
	'authAdmin.tenants.defaultSupportedIdpConfigs.list': firebaseSchemaEntry(
		'authAdmin.tenants.defaultSupportedIdpConfigs.list',
	),
	'authAdmin.tenants.defaultSupportedIdpConfigs.patch': firebaseSchemaEntry(
		'authAdmin.tenants.defaultSupportedIdpConfigs.patch',
	),
	'authAdmin.tenants.delete': firebaseSchemaEntry('authAdmin.tenants.delete'),
	'authAdmin.tenants.get': firebaseSchemaEntry('authAdmin.tenants.get'),
	'authAdmin.tenants.getIamPolicy': firebaseSchemaEntry(
		'authAdmin.tenants.getIamPolicy',
	),
	'authAdmin.tenants.inboundSamlConfigs.create': firebaseSchemaEntry(
		'authAdmin.tenants.inboundSamlConfigs.create',
	),
	'authAdmin.tenants.inboundSamlConfigs.delete': firebaseSchemaEntry(
		'authAdmin.tenants.inboundSamlConfigs.delete',
	),
	'authAdmin.tenants.inboundSamlConfigs.get': firebaseSchemaEntry(
		'authAdmin.tenants.inboundSamlConfigs.get',
	),
	'authAdmin.tenants.inboundSamlConfigs.list': firebaseSchemaEntry(
		'authAdmin.tenants.inboundSamlConfigs.list',
	),
	'authAdmin.tenants.inboundSamlConfigs.patch': firebaseSchemaEntry(
		'authAdmin.tenants.inboundSamlConfigs.patch',
	),
	'authAdmin.tenants.list': firebaseSchemaEntry('authAdmin.tenants.list'),
	'authAdmin.tenants.oauthIdpConfigs.create': firebaseSchemaEntry(
		'authAdmin.tenants.oauthIdpConfigs.create',
	),
	'authAdmin.tenants.oauthIdpConfigs.delete': firebaseSchemaEntry(
		'authAdmin.tenants.oauthIdpConfigs.delete',
	),
	'authAdmin.tenants.oauthIdpConfigs.get': firebaseSchemaEntry(
		'authAdmin.tenants.oauthIdpConfigs.get',
	),
	'authAdmin.tenants.oauthIdpConfigs.list': firebaseSchemaEntry(
		'authAdmin.tenants.oauthIdpConfigs.list',
	),
	'authAdmin.tenants.oauthIdpConfigs.patch': firebaseSchemaEntry(
		'authAdmin.tenants.oauthIdpConfigs.patch',
	),
	'authAdmin.tenants.patch': firebaseSchemaEntry('authAdmin.tenants.patch'),
	'authAdmin.tenants.setIamPolicy': firebaseSchemaEntry(
		'authAdmin.tenants.setIamPolicy',
	),
	'authAdmin.tenants.testIamPermissions': firebaseSchemaEntry(
		'authAdmin.tenants.testIamPermissions',
	),
	'database.delete': firebaseSchemaEntry('database.delete'),
	'database.get': firebaseSchemaEntry('database.get'),
	'database.push': firebaseSchemaEntry('database.push'),
	'database.rules.get': firebaseSchemaEntry('database.rules.get'),
	'database.rules.set': firebaseSchemaEntry('database.rules.set'),
	'database.set': firebaseSchemaEntry('database.set'),
	'database.update': firebaseSchemaEntry('database.update'),
	'databaseInstances.locations.instances.create': firebaseSchemaEntry(
		'databaseInstances.locations.instances.create',
	),
	'databaseInstances.locations.instances.delete': firebaseSchemaEntry(
		'databaseInstances.locations.instances.delete',
	),
	'databaseInstances.locations.instances.disable': firebaseSchemaEntry(
		'databaseInstances.locations.instances.disable',
	),
	'databaseInstances.locations.instances.get': firebaseSchemaEntry(
		'databaseInstances.locations.instances.get',
	),
	'databaseInstances.locations.instances.list': firebaseSchemaEntry(
		'databaseInstances.locations.instances.list',
	),
	'databaseInstances.locations.instances.reenable': firebaseSchemaEntry(
		'databaseInstances.locations.instances.reenable',
	),
	'databaseInstances.locations.instances.undelete': firebaseSchemaEntry(
		'databaseInstances.locations.instances.undelete',
	),
	'firestore.databases.backupSchedules.create': firebaseSchemaEntry(
		'firestore.databases.backupSchedules.create',
	),
	'firestore.databases.backupSchedules.delete': firebaseSchemaEntry(
		'firestore.databases.backupSchedules.delete',
	),
	'firestore.databases.backupSchedules.get': firebaseSchemaEntry(
		'firestore.databases.backupSchedules.get',
	),
	'firestore.databases.backupSchedules.list': firebaseSchemaEntry(
		'firestore.databases.backupSchedules.list',
	),
	'firestore.databases.backupSchedules.patch': firebaseSchemaEntry(
		'firestore.databases.backupSchedules.patch',
	),
	'firestore.databases.bulkDeleteDocuments': firebaseSchemaEntry(
		'firestore.databases.bulkDeleteDocuments',
	),
	'firestore.databases.changeStreams.create': firebaseSchemaEntry(
		'firestore.databases.changeStreams.create',
	),
	'firestore.databases.changeStreams.delete': firebaseSchemaEntry(
		'firestore.databases.changeStreams.delete',
	),
	'firestore.databases.changeStreams.get': firebaseSchemaEntry(
		'firestore.databases.changeStreams.get',
	),
	'firestore.databases.changeStreams.list': firebaseSchemaEntry(
		'firestore.databases.changeStreams.list',
	),
	'firestore.databases.clone': firebaseSchemaEntry('firestore.databases.clone'),
	'firestore.databases.collectionGroups.fields.get': firebaseSchemaEntry(
		'firestore.databases.collectionGroups.fields.get',
	),
	'firestore.databases.collectionGroups.fields.list': firebaseSchemaEntry(
		'firestore.databases.collectionGroups.fields.list',
	),
	'firestore.databases.collectionGroups.fields.patch': firebaseSchemaEntry(
		'firestore.databases.collectionGroups.fields.patch',
	),
	'firestore.databases.collectionGroups.indexes.create': firebaseSchemaEntry(
		'firestore.databases.collectionGroups.indexes.create',
	),
	'firestore.databases.collectionGroups.indexes.delete': firebaseSchemaEntry(
		'firestore.databases.collectionGroups.indexes.delete',
	),
	'firestore.databases.collectionGroups.indexes.get': firebaseSchemaEntry(
		'firestore.databases.collectionGroups.indexes.get',
	),
	'firestore.databases.collectionGroups.indexes.list': firebaseSchemaEntry(
		'firestore.databases.collectionGroups.indexes.list',
	),
	'firestore.databases.create': firebaseSchemaEntry(
		'firestore.databases.create',
	),
	'firestore.databases.delete': firebaseSchemaEntry(
		'firestore.databases.delete',
	),
	'firestore.databases.documents.batchGet': firebaseSchemaEntry(
		'firestore.databases.documents.batchGet',
	),
	'firestore.databases.documents.batchWrite': firebaseSchemaEntry(
		'firestore.databases.documents.batchWrite',
	),
	'firestore.databases.documents.beginTransaction': firebaseSchemaEntry(
		'firestore.databases.documents.beginTransaction',
	),
	'firestore.databases.documents.commit': firebaseSchemaEntry(
		'firestore.databases.documents.commit',
	),
	'firestore.databases.documents.createDocument': firebaseSchemaEntry(
		'firestore.databases.documents.createDocument',
	),
	'firestore.databases.documents.delete': firebaseSchemaEntry(
		'firestore.databases.documents.delete',
	),
	'firestore.databases.documents.executePipeline': firebaseSchemaEntry(
		'firestore.databases.documents.executePipeline',
	),
	'firestore.databases.documents.get': firebaseSchemaEntry(
		'firestore.databases.documents.get',
	),
	'firestore.databases.documents.list': firebaseSchemaEntry(
		'firestore.databases.documents.list',
	),
	'firestore.databases.documents.listCollectionIds': firebaseSchemaEntry(
		'firestore.databases.documents.listCollectionIds',
	),
	'firestore.databases.documents.listDocuments': firebaseSchemaEntry(
		'firestore.databases.documents.listDocuments',
	),
	'firestore.databases.documents.partitionQuery': firebaseSchemaEntry(
		'firestore.databases.documents.partitionQuery',
	),
	'firestore.databases.documents.patch': firebaseSchemaEntry(
		'firestore.databases.documents.patch',
	),
	'firestore.databases.documents.rollback': firebaseSchemaEntry(
		'firestore.databases.documents.rollback',
	),
	'firestore.databases.documents.runAggregationQuery': firebaseSchemaEntry(
		'firestore.databases.documents.runAggregationQuery',
	),
	'firestore.databases.documents.runQuery': firebaseSchemaEntry(
		'firestore.databases.documents.runQuery',
	),
	'firestore.databases.exportDocuments': firebaseSchemaEntry(
		'firestore.databases.exportDocuments',
	),
	'firestore.databases.get': firebaseSchemaEntry('firestore.databases.get'),
	'firestore.databases.importDocuments': firebaseSchemaEntry(
		'firestore.databases.importDocuments',
	),
	'firestore.databases.list': firebaseSchemaEntry('firestore.databases.list'),
	'firestore.databases.operations.cancel': firebaseSchemaEntry(
		'firestore.databases.operations.cancel',
	),
	'firestore.databases.operations.delete': firebaseSchemaEntry(
		'firestore.databases.operations.delete',
	),
	'firestore.databases.operations.get': firebaseSchemaEntry(
		'firestore.databases.operations.get',
	),
	'firestore.databases.operations.list': firebaseSchemaEntry(
		'firestore.databases.operations.list',
	),
	'firestore.databases.patch': firebaseSchemaEntry('firestore.databases.patch'),
	'firestore.databases.restore': firebaseSchemaEntry(
		'firestore.databases.restore',
	),
	'firestore.databases.userCreds.create': firebaseSchemaEntry(
		'firestore.databases.userCreds.create',
	),
	'firestore.databases.userCreds.delete': firebaseSchemaEntry(
		'firestore.databases.userCreds.delete',
	),
	'firestore.databases.userCreds.disable': firebaseSchemaEntry(
		'firestore.databases.userCreds.disable',
	),
	'firestore.databases.userCreds.enable': firebaseSchemaEntry(
		'firestore.databases.userCreds.enable',
	),
	'firestore.databases.userCreds.get': firebaseSchemaEntry(
		'firestore.databases.userCreds.get',
	),
	'firestore.databases.userCreds.list': firebaseSchemaEntry(
		'firestore.databases.userCreds.list',
	),
	'firestore.databases.userCreds.resetPassword': firebaseSchemaEntry(
		'firestore.databases.userCreds.resetPassword',
	),
	'firestore.locations.backups.delete': firebaseSchemaEntry(
		'firestore.locations.backups.delete',
	),
	'firestore.locations.backups.get': firebaseSchemaEntry(
		'firestore.locations.backups.get',
	),
	'firestore.locations.backups.list': firebaseSchemaEntry(
		'firestore.locations.backups.list',
	),
	'firestore.locations.get': firebaseSchemaEntry('firestore.locations.get'),
	'firestore.locations.list': firebaseSchemaEntry('firestore.locations.list'),
	'hosting.operations.get': firebaseSchemaEntry('hosting.operations.get'),
	'hosting.sites.channels.create': firebaseSchemaEntry(
		'hosting.sites.channels.create',
	),
	'hosting.sites.channels.delete': firebaseSchemaEntry(
		'hosting.sites.channels.delete',
	),
	'hosting.sites.channels.get': firebaseSchemaEntry(
		'hosting.sites.channels.get',
	),
	'hosting.sites.channels.list': firebaseSchemaEntry(
		'hosting.sites.channels.list',
	),
	'hosting.sites.channels.patch': firebaseSchemaEntry(
		'hosting.sites.channels.patch',
	),
	'hosting.sites.channels.releases.create': firebaseSchemaEntry(
		'hosting.sites.channels.releases.create',
	),
	'hosting.sites.channels.releases.get': firebaseSchemaEntry(
		'hosting.sites.channels.releases.get',
	),
	'hosting.sites.channels.releases.list': firebaseSchemaEntry(
		'hosting.sites.channels.releases.list',
	),
	'hosting.sites.create': firebaseSchemaEntry('hosting.sites.create'),
	'hosting.sites.customDomains.create': firebaseSchemaEntry(
		'hosting.sites.customDomains.create',
	),
	'hosting.sites.customDomains.delete': firebaseSchemaEntry(
		'hosting.sites.customDomains.delete',
	),
	'hosting.sites.customDomains.get': firebaseSchemaEntry(
		'hosting.sites.customDomains.get',
	),
	'hosting.sites.customDomains.list': firebaseSchemaEntry(
		'hosting.sites.customDomains.list',
	),
	'hosting.sites.customDomains.operations.get': firebaseSchemaEntry(
		'hosting.sites.customDomains.operations.get',
	),
	'hosting.sites.customDomains.operations.list': firebaseSchemaEntry(
		'hosting.sites.customDomains.operations.list',
	),
	'hosting.sites.customDomains.patch': firebaseSchemaEntry(
		'hosting.sites.customDomains.patch',
	),
	'hosting.sites.customDomains.undelete': firebaseSchemaEntry(
		'hosting.sites.customDomains.undelete',
	),
	'hosting.sites.delete': firebaseSchemaEntry('hosting.sites.delete'),
	'hosting.sites.domains.create': firebaseSchemaEntry(
		'hosting.sites.domains.create',
	),
	'hosting.sites.domains.delete': firebaseSchemaEntry(
		'hosting.sites.domains.delete',
	),
	'hosting.sites.domains.get': firebaseSchemaEntry('hosting.sites.domains.get'),
	'hosting.sites.domains.list': firebaseSchemaEntry(
		'hosting.sites.domains.list',
	),
	'hosting.sites.domains.update': firebaseSchemaEntry(
		'hosting.sites.domains.update',
	),
	'hosting.sites.get': firebaseSchemaEntry('hosting.sites.get'),
	'hosting.sites.getConfig': firebaseSchemaEntry('hosting.sites.getConfig'),
	'hosting.sites.list': firebaseSchemaEntry('hosting.sites.list'),
	'hosting.sites.patch': firebaseSchemaEntry('hosting.sites.patch'),
	'hosting.sites.releases.create': firebaseSchemaEntry(
		'hosting.sites.releases.create',
	),
	'hosting.sites.releases.get': firebaseSchemaEntry(
		'hosting.sites.releases.get',
	),
	'hosting.sites.releases.list': firebaseSchemaEntry(
		'hosting.sites.releases.list',
	),
	'hosting.sites.updateConfig': firebaseSchemaEntry(
		'hosting.sites.updateConfig',
	),
	'hosting.sites.versions.clone': firebaseSchemaEntry(
		'hosting.sites.versions.clone',
	),
	'hosting.sites.versions.create': firebaseSchemaEntry(
		'hosting.sites.versions.create',
	),
	'hosting.sites.versions.delete': firebaseSchemaEntry(
		'hosting.sites.versions.delete',
	),
	'hosting.sites.versions.files.list': firebaseSchemaEntry(
		'hosting.sites.versions.files.list',
	),
	'hosting.sites.versions.get': firebaseSchemaEntry(
		'hosting.sites.versions.get',
	),
	'hosting.sites.versions.list': firebaseSchemaEntry(
		'hosting.sites.versions.list',
	),
	'hosting.sites.versions.patch': firebaseSchemaEntry(
		'hosting.sites.versions.patch',
	),
	'hosting.sites.versions.populateFiles': firebaseSchemaEntry(
		'hosting.sites.versions.populateFiles',
	),
	'management.androidApps.create': firebaseSchemaEntry(
		'management.androidApps.create',
	),
	'management.androidApps.get': firebaseSchemaEntry(
		'management.androidApps.get',
	),
	'management.androidApps.getConfig': firebaseSchemaEntry(
		'management.androidApps.getConfig',
	),
	'management.androidApps.list': firebaseSchemaEntry(
		'management.androidApps.list',
	),
	'management.androidApps.patch': firebaseSchemaEntry(
		'management.androidApps.patch',
	),
	'management.androidApps.remove': firebaseSchemaEntry(
		'management.androidApps.remove',
	),
	'management.androidApps.sha.create': firebaseSchemaEntry(
		'management.androidApps.sha.create',
	),
	'management.androidApps.sha.delete': firebaseSchemaEntry(
		'management.androidApps.sha.delete',
	),
	'management.androidApps.sha.list': firebaseSchemaEntry(
		'management.androidApps.sha.list',
	),
	'management.androidApps.undelete': firebaseSchemaEntry(
		'management.androidApps.undelete',
	),
	'management.availableLocations.list': firebaseSchemaEntry(
		'management.availableLocations.list',
	),
	'management.availableProjects.list': firebaseSchemaEntry(
		'management.availableProjects.list',
	),
	'management.defaultLocation.finalize': firebaseSchemaEntry(
		'management.defaultLocation.finalize',
	),
	'management.iosApps.create': firebaseSchemaEntry('management.iosApps.create'),
	'management.iosApps.get': firebaseSchemaEntry('management.iosApps.get'),
	'management.iosApps.getConfig': firebaseSchemaEntry(
		'management.iosApps.getConfig',
	),
	'management.iosApps.list': firebaseSchemaEntry('management.iosApps.list'),
	'management.iosApps.patch': firebaseSchemaEntry('management.iosApps.patch'),
	'management.iosApps.remove': firebaseSchemaEntry('management.iosApps.remove'),
	'management.iosApps.undelete': firebaseSchemaEntry(
		'management.iosApps.undelete',
	),
	'management.operations.get': firebaseSchemaEntry('management.operations.get'),
	'management.projects.addFirebase': firebaseSchemaEntry(
		'management.projects.addFirebase',
	),
	'management.projects.addGoogleAnalytics': firebaseSchemaEntry(
		'management.projects.addGoogleAnalytics',
	),
	'management.projects.get': firebaseSchemaEntry('management.projects.get'),
	'management.projects.getAdminSdkConfig': firebaseSchemaEntry(
		'management.projects.getAdminSdkConfig',
	),
	'management.projects.getAnalyticsDetails': firebaseSchemaEntry(
		'management.projects.getAnalyticsDetails',
	),
	'management.projects.list': firebaseSchemaEntry('management.projects.list'),
	'management.projects.patch': firebaseSchemaEntry('management.projects.patch'),
	'management.projects.removeAnalytics': firebaseSchemaEntry(
		'management.projects.removeAnalytics',
	),
	'management.projects.searchApps': firebaseSchemaEntry(
		'management.projects.searchApps',
	),
	'management.webApps.create': firebaseSchemaEntry('management.webApps.create'),
	'management.webApps.get': firebaseSchemaEntry('management.webApps.get'),
	'management.webApps.getConfig': firebaseSchemaEntry(
		'management.webApps.getConfig',
	),
	'management.webApps.list': firebaseSchemaEntry('management.webApps.list'),
	'management.webApps.patch': firebaseSchemaEntry('management.webApps.patch'),
	'management.webApps.remove': firebaseSchemaEntry('management.webApps.remove'),
	'management.webApps.undelete': firebaseSchemaEntry(
		'management.webApps.undelete',
	),
	'messaging.messages.send': firebaseSchemaEntry('messaging.messages.send'),
	'messaging.registrations.topicSubscriptions.create': firebaseSchemaEntry(
		'messaging.registrations.topicSubscriptions.create',
	),
	'messaging.registrations.topicSubscriptions.delete': firebaseSchemaEntry(
		'messaging.registrations.topicSubscriptions.delete',
	),
	'messaging.registrations.topicSubscriptions.get': firebaseSchemaEntry(
		'messaging.registrations.topicSubscriptions.get',
	),
	'messaging.registrations.topicSubscriptions.list': firebaseSchemaEntry(
		'messaging.registrations.topicSubscriptions.list',
	),
	'messaging.registrations.topicSubscriptions.patch': firebaseSchemaEntry(
		'messaging.registrations.topicSubscriptions.patch',
	),
	'remoteConfig.namespaces.experiments.delete': firebaseSchemaEntry(
		'remoteConfig.namespaces.experiments.delete',
	),
	'remoteConfig.namespaces.experiments.get': firebaseSchemaEntry(
		'remoteConfig.namespaces.experiments.get',
	),
	'remoteConfig.namespaces.experiments.list': firebaseSchemaEntry(
		'remoteConfig.namespaces.experiments.list',
	),
	'remoteConfig.namespaces.fetch': firebaseSchemaEntry(
		'remoteConfig.namespaces.fetch',
	),
	'remoteConfig.namespaces.get': firebaseSchemaEntry(
		'remoteConfig.namespaces.get',
	),
	'remoteConfig.namespaces.getConditionOrder': firebaseSchemaEntry(
		'remoteConfig.namespaces.getConditionOrder',
	),
	'remoteConfig.namespaces.getRemoteConfig': firebaseSchemaEntry(
		'remoteConfig.namespaces.getRemoteConfig',
	),
	'remoteConfig.namespaces.getServerRemoteConfig': firebaseSchemaEntry(
		'remoteConfig.namespaces.getServerRemoteConfig',
	),
	'remoteConfig.namespaces.list': firebaseSchemaEntry(
		'remoteConfig.namespaces.list',
	),
	'remoteConfig.namespaces.remoteConfig.downloadDefaults': firebaseSchemaEntry(
		'remoteConfig.namespaces.remoteConfig.downloadDefaults',
	),
	'remoteConfig.namespaces.remoteConfig.listVersions': firebaseSchemaEntry(
		'remoteConfig.namespaces.remoteConfig.listVersions',
	),
	'remoteConfig.namespaces.remoteConfig.rollback': firebaseSchemaEntry(
		'remoteConfig.namespaces.remoteConfig.rollback',
	),
	'remoteConfig.namespaces.remoteConfigConditions.create': firebaseSchemaEntry(
		'remoteConfig.namespaces.remoteConfigConditions.create',
	),
	'remoteConfig.namespaces.remoteConfigConditions.delete': firebaseSchemaEntry(
		'remoteConfig.namespaces.remoteConfigConditions.delete',
	),
	'remoteConfig.namespaces.remoteConfigConditions.get': firebaseSchemaEntry(
		'remoteConfig.namespaces.remoteConfigConditions.get',
	),
	'remoteConfig.namespaces.remoteConfigConditions.list': firebaseSchemaEntry(
		'remoteConfig.namespaces.remoteConfigConditions.list',
	),
	'remoteConfig.namespaces.remoteConfigConditions.patch': firebaseSchemaEntry(
		'remoteConfig.namespaces.remoteConfigConditions.patch',
	),
	'remoteConfig.namespaces.remoteConfigParameterGroups.create':
		firebaseSchemaEntry(
			'remoteConfig.namespaces.remoteConfigParameterGroups.create',
		),
	'remoteConfig.namespaces.remoteConfigParameterGroups.delete':
		firebaseSchemaEntry(
			'remoteConfig.namespaces.remoteConfigParameterGroups.delete',
		),
	'remoteConfig.namespaces.remoteConfigParameterGroups.get':
		firebaseSchemaEntry(
			'remoteConfig.namespaces.remoteConfigParameterGroups.get',
		),
	'remoteConfig.namespaces.remoteConfigParameterGroups.list':
		firebaseSchemaEntry(
			'remoteConfig.namespaces.remoteConfigParameterGroups.list',
		),
	'remoteConfig.namespaces.remoteConfigParameterGroups.patch':
		firebaseSchemaEntry(
			'remoteConfig.namespaces.remoteConfigParameterGroups.patch',
		),
	'remoteConfig.namespaces.remoteConfigParameters.create': firebaseSchemaEntry(
		'remoteConfig.namespaces.remoteConfigParameters.create',
	),
	'remoteConfig.namespaces.remoteConfigParameters.delete': firebaseSchemaEntry(
		'remoteConfig.namespaces.remoteConfigParameters.delete',
	),
	'remoteConfig.namespaces.remoteConfigParameters.get': firebaseSchemaEntry(
		'remoteConfig.namespaces.remoteConfigParameters.get',
	),
	'remoteConfig.namespaces.remoteConfigParameters.list': firebaseSchemaEntry(
		'remoteConfig.namespaces.remoteConfigParameters.list',
	),
	'remoteConfig.namespaces.remoteConfigParameters.patch': firebaseSchemaEntry(
		'remoteConfig.namespaces.remoteConfigParameters.patch',
	),
	'remoteConfig.namespaces.rollouts.delete': firebaseSchemaEntry(
		'remoteConfig.namespaces.rollouts.delete',
	),
	'remoteConfig.namespaces.rollouts.get': firebaseSchemaEntry(
		'remoteConfig.namespaces.rollouts.get',
	),
	'remoteConfig.namespaces.rollouts.list': firebaseSchemaEntry(
		'remoteConfig.namespaces.rollouts.list',
	),
	'remoteConfig.namespaces.updateConditionOrder': firebaseSchemaEntry(
		'remoteConfig.namespaces.updateConditionOrder',
	),
	'remoteConfig.namespaces.updateRemoteConfig': firebaseSchemaEntry(
		'remoteConfig.namespaces.updateRemoteConfig',
	),
	'remoteConfig.projects.getRemoteConfig': firebaseSchemaEntry(
		'remoteConfig.projects.getRemoteConfig',
	),
	'remoteConfig.projects.updateRemoteConfig': firebaseSchemaEntry(
		'remoteConfig.projects.updateRemoteConfig',
	),
	'remoteConfig.remoteConfig.downloadDefaults': firebaseSchemaEntry(
		'remoteConfig.remoteConfig.downloadDefaults',
	),
	'remoteConfig.remoteConfig.listVersions': firebaseSchemaEntry(
		'remoteConfig.remoteConfig.listVersions',
	),
	'remoteConfig.remoteConfig.rollback': firebaseSchemaEntry(
		'remoteConfig.remoteConfig.rollback',
	),
	'rules.projects.test': firebaseSchemaEntry('rules.projects.test'),
	'rules.releases.create': firebaseSchemaEntry('rules.releases.create'),
	'rules.releases.delete': firebaseSchemaEntry('rules.releases.delete'),
	'rules.releases.get': firebaseSchemaEntry('rules.releases.get'),
	'rules.releases.getExecutable': firebaseSchemaEntry(
		'rules.releases.getExecutable',
	),
	'rules.releases.list': firebaseSchemaEntry('rules.releases.list'),
	'rules.releases.patch': firebaseSchemaEntry('rules.releases.patch'),
	'rules.rulesets.create': firebaseSchemaEntry('rules.rulesets.create'),
	'rules.rulesets.delete': firebaseSchemaEntry('rules.rulesets.delete'),
	'rules.rulesets.get': firebaseSchemaEntry('rules.rulesets.get'),
	'rules.rulesets.list': firebaseSchemaEntry('rules.rulesets.list'),
	'storage.buckets.delete': firebaseSchemaEntry('storage.buckets.delete'),
	'storage.buckets.get': firebaseSchemaEntry('storage.buckets.get'),
	'storage.buckets.getIamPolicy': firebaseSchemaEntry(
		'storage.buckets.getIamPolicy',
	),
	'storage.buckets.getStorageLayout': firebaseSchemaEntry(
		'storage.buckets.getStorageLayout',
	),
	'storage.buckets.insert': firebaseSchemaEntry('storage.buckets.insert'),
	'storage.buckets.list': firebaseSchemaEntry('storage.buckets.list'),
	'storage.buckets.lockRetentionPolicy': firebaseSchemaEntry(
		'storage.buckets.lockRetentionPolicy',
	),
	'storage.buckets.operations.advanceRelocateBucket': firebaseSchemaEntry(
		'storage.buckets.operations.advanceRelocateBucket',
	),
	'storage.buckets.operations.cancel': firebaseSchemaEntry(
		'storage.buckets.operations.cancel',
	),
	'storage.buckets.operations.get': firebaseSchemaEntry(
		'storage.buckets.operations.get',
	),
	'storage.buckets.operations.list': firebaseSchemaEntry(
		'storage.buckets.operations.list',
	),
	'storage.buckets.patch': firebaseSchemaEntry('storage.buckets.patch'),
	'storage.buckets.relocate': firebaseSchemaEntry('storage.buckets.relocate'),
	'storage.buckets.restore': firebaseSchemaEntry('storage.buckets.restore'),
	'storage.buckets.setIamPolicy': firebaseSchemaEntry(
		'storage.buckets.setIamPolicy',
	),
	'storage.buckets.testIamPermissions': firebaseSchemaEntry(
		'storage.buckets.testIamPermissions',
	),
	'storage.buckets.update': firebaseSchemaEntry('storage.buckets.update'),
	'storage.objects.bulkRestore': firebaseSchemaEntry(
		'storage.objects.bulkRestore',
	),
	'storage.objects.compose': firebaseSchemaEntry('storage.objects.compose'),
	'storage.objects.copy': firebaseSchemaEntry('storage.objects.copy'),
	'storage.objects.delete': firebaseSchemaEntry('storage.objects.delete'),
	'storage.objects.download': firebaseSchemaEntry('storage.objects.download'),
	'storage.objects.get': firebaseSchemaEntry('storage.objects.get'),
	'storage.objects.getIamPolicy': firebaseSchemaEntry(
		'storage.objects.getIamPolicy',
	),
	'storage.objects.insert': firebaseSchemaEntry('storage.objects.insert'),
	'storage.objects.list': firebaseSchemaEntry('storage.objects.list'),
	'storage.objects.move': firebaseSchemaEntry('storage.objects.move'),
	'storage.objects.patch': firebaseSchemaEntry('storage.objects.patch'),
	'storage.objects.restore': firebaseSchemaEntry('storage.objects.restore'),
	'storage.objects.rewrite': firebaseSchemaEntry('storage.objects.rewrite'),
	'storage.objects.setIamPolicy': firebaseSchemaEntry(
		'storage.objects.setIamPolicy',
	),
	'storage.objects.testIamPermissions': firebaseSchemaEntry(
		'storage.objects.testIamPermissions',
	),
	'storage.objects.update': firebaseSchemaEntry('storage.objects.update'),
	'storage.objects.viewFullContext': firebaseSchemaEntry(
		'storage.objects.viewFullContext',
	),
	'storageBuckets.buckets.addFirebase': firebaseSchemaEntry(
		'storageBuckets.buckets.addFirebase',
	),
	'storageBuckets.buckets.get': firebaseSchemaEntry(
		'storageBuckets.buckets.get',
	),
	'storageBuckets.buckets.list': firebaseSchemaEntry(
		'storageBuckets.buckets.list',
	),
	'storageBuckets.buckets.removeFirebase': firebaseSchemaEntry(
		'storageBuckets.buckets.removeFirebase',
	),
	'storageBuckets.defaultBucket.create': firebaseSchemaEntry(
		'storageBuckets.defaultBucket.create',
	),
	'storageBuckets.projects.deleteDefaultBucket': firebaseSchemaEntry(
		'storageBuckets.projects.deleteDefaultBucket',
	),
	'storageBuckets.projects.getDefaultBucket': firebaseSchemaEntry(
		'storageBuckets.projects.getDefaultBucket',
	),
} satisfies RequiredPluginEndpointSchemas<typeof firebaseEndpointsNested>;

export const firebaseEndpointMeta = {
	'appCheck.apps.appAttestConfig.batchGet': {
		riskLevel: 'read',
		description:
			'Atomically gets the AppAttestConfigs for the specified list of apps',
	},
	'appCheck.apps.appAttestConfig.get': {
		riskLevel: 'read',
		description: 'Gets the AppAttestConfig for the specified app',
	},
	'appCheck.apps.appAttestConfig.patch': {
		riskLevel: 'write',
		description:
			'Updates the AppAttestConfig for the specified app. While this configuration is incomplete or invalid, the app will be unable to exchange AppAttest tokens for App Check tokens',
	},
	'appCheck.apps.debugTokens.create': {
		riskLevel: 'destructive',
		description:
			'Creates a new DebugToken for the specified app. For security reasons, after the creation operation completes, the `token` field cannot be updated or retrieved, but you can revoke the debug token using DeleteDebugToken',
	},
	'appCheck.apps.debugTokens.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes the specified DebugToken. A deleted debug token cannot be used to exchange for an App Check token',
	},
	'appCheck.apps.debugTokens.get': {
		riskLevel: 'read',
		description:
			'Gets the specified DebugToken. For security reasons, the `token` field is never populated in the response',
	},
	'appCheck.apps.debugTokens.list': {
		riskLevel: 'read',
		description:
			'Lists all DebugTokens for the specified app. For security reasons, the `token` field is never populated in the response (paged with pageToken / nextPageToken)',
	},
	'appCheck.apps.debugTokens.patch': {
		riskLevel: 'write',
		description:
			'Updates the specified DebugToken. For security reasons, the `token` field cannot be updated, nor will it be populated in the response, but you can revoke the debug token using DeleteDebugToken',
	},
	'appCheck.apps.deviceCheckConfig.batchGet': {
		riskLevel: 'read',
		description:
			'Atomically gets the DeviceCheckConfigs for the specified list of apps. For security reasons, the `private_key` field is never populated in the response',
	},
	'appCheck.apps.deviceCheckConfig.get': {
		riskLevel: 'read',
		description:
			'Gets the DeviceCheckConfig for the specified app. For security reasons, the `private_key` field is never populated in the response',
	},
	'appCheck.apps.deviceCheckConfig.patch': {
		riskLevel: 'write',
		description:
			'Updates the DeviceCheckConfig for the specified app. While this configuration is incomplete or invalid, the app will be unable to exchange DeviceCheck tokens for App Check tokens',
	},
	'appCheck.apps.exchangeAppAttestAssertion': {
		riskLevel: 'write',
		description:
			'Accepts an App Attest assertion and an artifact previously obtained from ExchangeAppAttestAttestation and verifies those with Apple. If valid, returns an AppCheckToken',
	},
	'appCheck.apps.exchangeAppAttestAttestation': {
		riskLevel: 'write',
		description:
			'Accepts an App Attest CBOR attestation and verifies it with Apple using your preconfigured team and bundle IDs. If valid, returns an attestation artifact that can later be exchanged for an AppCheckToken using ExchangeAppAttestAssertion',
	},
	'appCheck.apps.exchangeCustomToken': {
		riskLevel: 'write',
		description:
			"Validates a custom token signed using your project's Admin SDK service account credentials. If valid, returns an AppCheckToken",
	},
	'appCheck.apps.exchangeDebugToken': {
		riskLevel: 'destructive',
		description:
			'Validates a debug token secret that you have previously created using CreateDebugToken. If valid, returns an AppCheckToken',
	},
	'appCheck.apps.exchangeDeviceCheckToken': {
		riskLevel: 'write',
		description:
			'Accepts a [`device_token`](https://developer.apple.com/documentation/devicecheck/dcdevice) issued by DeviceCheck, and attempts to validate it with Apple. If valid, returns an AppCheckToken',
	},
	'appCheck.apps.exchangePlayIntegrityToken': {
		riskLevel: 'write',
		description:
			'Validates an [integrity verdict response token from Play Integrity](https://developer.android.com/google/play/integrity/verdict#decrypt-verify). If valid, returns an AppCheckToken',
	},
	'appCheck.apps.exchangeRecaptchaEnterpriseToken': {
		riskLevel: 'write',
		description:
			'Validates a [reCAPTCHA Enterprise response token](https://cloud.google.com/recaptcha-enterprise/docs/create-assessment#retrieve_token). If valid, returns an AppCheckToken',
	},
	'appCheck.apps.exchangeRecaptchaV3Token': {
		riskLevel: 'write',
		description:
			'Validates a [reCAPTCHA v3 response token](https://developers.google.com/recaptcha/docs/v3). If valid, returns an AppCheckToken',
	},
	'appCheck.apps.generateAppAttestChallenge': {
		riskLevel: 'write',
		description:
			'Generates a challenge that protects the integrity of an immediately following call to ExchangeAppAttestAttestation or ExchangeAppAttestAssertion. A challenge should not be reused for multiple calls',
	},
	'appCheck.apps.generatePlayIntegrityChallenge': {
		riskLevel: 'write',
		description:
			'Generates a challenge that protects the integrity of an immediately following integrity verdict request to the Play Integrity API. The next call to ExchangePlayIntegrityToken using the resulting integrity token will verify the presence and validity of the challenge',
	},
	'appCheck.apps.mintAppCheckToken': {
		riskLevel: 'write',
		description:
			'Mints a new App Check token for the specified Firebase App. This method is intended to be called from a privileged environment where the caller can be authorized via Cloud IAM; for example, using a service account',
	},
	'appCheck.apps.playIntegrityConfig.batchGet': {
		riskLevel: 'read',
		description:
			'Atomically gets the PlayIntegrityConfigs for the specified list of apps',
	},
	'appCheck.apps.playIntegrityConfig.get': {
		riskLevel: 'read',
		description: 'Gets the PlayIntegrityConfig for the specified app',
	},
	'appCheck.apps.playIntegrityConfig.patch': {
		riskLevel: 'write',
		description:
			'Updates the PlayIntegrityConfig for the specified app. While this configuration is incomplete or invalid, the app will be unable to exchange Play Integrity tokens for App Check tokens',
	},
	'appCheck.apps.recaptchaEnterpriseConfig.batchGet': {
		riskLevel: 'read',
		description:
			'Atomically gets the RecaptchaEnterpriseConfigs for the specified list of apps',
	},
	'appCheck.apps.recaptchaEnterpriseConfig.get': {
		riskLevel: 'read',
		description: 'Gets the RecaptchaEnterpriseConfig for the specified app',
	},
	'appCheck.apps.recaptchaEnterpriseConfig.patch': {
		riskLevel: 'write',
		description:
			'Updates the RecaptchaEnterpriseConfig for the specified app. While this configuration is incomplete or invalid, the app will be unable to exchange reCAPTCHA Enterprise tokens for App Check tokens',
	},
	'appCheck.apps.recaptchaV3Config.batchGet': {
		riskLevel: 'read',
		description:
			'Atomically gets the RecaptchaV3Configs for the specified list of apps. For security reasons, the `site_secret` field is never populated in the response',
	},
	'appCheck.apps.recaptchaV3Config.get': {
		riskLevel: 'read',
		description:
			'Gets the RecaptchaV3Config for the specified app. For security reasons, the `site_secret` field is never populated in the response',
	},
	'appCheck.apps.recaptchaV3Config.patch': {
		riskLevel: 'write',
		description:
			'Updates the RecaptchaV3Config for the specified app. While this configuration is incomplete or invalid, the app will be unable to exchange reCAPTCHA v3 tokens for App Check tokens',
	},
	'appCheck.jwks.get': {
		riskLevel: 'read',
		description:
			'Returns a public JWK set as specified by [RFC 7517](https://www.rfc-editor.org/info/rfc7517/) that can be used to verify App Check tokens. Exactly one of the public keys in the returned set will successfully validate any App Check token that is currently valid',
	},
	'appCheck.oauthClients.exchangeAppAttestAssertion': {
		riskLevel: 'write',
		description:
			'Accepts an App Attest assertion and an artifact previously obtained from ExchangeAppAttestAttestation and verifies those with Apple. If valid, returns an AppCheckToken',
	},
	'appCheck.oauthClients.exchangeAppAttestAttestation': {
		riskLevel: 'write',
		description:
			'Accepts an App Attest CBOR attestation and verifies it with Apple using your preconfigured team and bundle IDs. If valid, returns an attestation artifact that can later be exchanged for an AppCheckToken using ExchangeAppAttestAssertion',
	},
	'appCheck.oauthClients.exchangeDebugToken': {
		riskLevel: 'write',
		description:
			'Validates a debug token secret that you have previously created using CreateDebugToken. If valid, returns an AppCheckToken',
	},
	'appCheck.oauthClients.generateAppAttestChallenge': {
		riskLevel: 'write',
		description:
			'Generates a challenge that protects the integrity of an immediately following call to ExchangeAppAttestAttestation or ExchangeAppAttestAssertion. A challenge should not be reused for multiple calls',
	},
	'appCheck.services.batchUpdate': {
		riskLevel: 'write',
		description: 'Atomically updates the specified Service configurations',
	},
	'appCheck.services.get': {
		riskLevel: 'read',
		description:
			'Gets the Service configuration for the specified service name',
	},
	'appCheck.services.list': {
		riskLevel: 'read',
		description:
			'Lists all Service configurations for the specified project. Only Services which were explicitly configured using UpdateService or BatchUpdateServices will be returned (paged with pageToken / nextPageToken)',
	},
	'appCheck.services.patch': {
		riskLevel: 'write',
		description: 'Updates the specified Service configuration',
	},
	'appCheck.services.resourcePolicies.batchUpdate': {
		riskLevel: 'write',
		description:
			'Atomically updates the specified ResourcePolicy configurations',
	},
	'appCheck.services.resourcePolicies.create': {
		riskLevel: 'write',
		description: 'Creates the specified ResourcePolicy configuration',
	},
	'appCheck.services.resourcePolicies.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes the specified ResourcePolicy configuration',
	},
	'appCheck.services.resourcePolicies.get': {
		riskLevel: 'read',
		description: 'Gets the requested ResourcePolicy configuration',
	},
	'appCheck.services.resourcePolicies.list': {
		riskLevel: 'read',
		description:
			'Lists all ResourcePolicy configurations for the specified project and service (paged with pageToken / nextPageToken)',
	},
	'appCheck.services.resourcePolicies.patch': {
		riskLevel: 'write',
		description: 'Updates the specified ResourcePolicy configuration',
	},
	'appDistribution.apps.getAabInfo': {
		riskLevel: 'read',
		description: 'Gets Android App Bundle (AAB) information for a Firebase app',
	},
	'appDistribution.apps.releases.batchDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes releases. A maximum of 100 releases can be deleted per request',
	},
	'appDistribution.apps.releases.distribute': {
		riskLevel: 'destructive',
		description:
			'Distributes a release to testers. This call does the following: 1',
	},
	'appDistribution.apps.releases.feedbackReports.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a feedback report',
	},
	'appDistribution.apps.releases.feedbackReports.get': {
		riskLevel: 'read',
		description: 'Gets a feedback report',
	},
	'appDistribution.apps.releases.feedbackReports.list': {
		riskLevel: 'read',
		description:
			'Lists feedback reports. By default, sorts by `createTime` in descending order (paged with pageToken / nextPageToken)',
	},
	'appDistribution.apps.releases.get': {
		riskLevel: 'read',
		description: 'Gets a release',
	},
	'appDistribution.apps.releases.list': {
		riskLevel: 'read',
		description:
			'Lists releases. By default, sorts by `createTime` in descending order (paged with pageToken / nextPageToken)',
	},
	'appDistribution.apps.releases.operations.cancel': {
		riskLevel: 'write',
		description:
			'Starts asynchronous cancellation on a long-running operation. The server makes a best effort to cancel the operation, but success is not guaranteed',
	},
	'appDistribution.apps.releases.operations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a long-running operation. This method indicates that the client is no longer interested in the operation result',
	},
	'appDistribution.apps.releases.operations.get': {
		riskLevel: 'read',
		description:
			'Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service',
	},
	'appDistribution.apps.releases.operations.list': {
		riskLevel: 'read',
		description:
			"Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED` (paged with pageToken / nextPageToken)",
	},
	'appDistribution.apps.releases.operations.wait': {
		riskLevel: 'write',
		description:
			'Waits until the specified long-running operation is done or reaches at most a specified timeout, returning the latest state. If the operation is already done, the latest state is immediately returned',
	},
	'appDistribution.apps.releases.patch': {
		riskLevel: 'write',
		description: 'Updates a release',
	},
	'appDistribution.groups.batchJoin': {
		riskLevel: 'destructive',
		description:
			'Batch adds members to a group. The testers will gain access to all releases that the groups have access to',
	},
	'appDistribution.groups.batchLeave': {
		riskLevel: 'write',
		description:
			'Batch removed members from a group. The testers will lose access to all releases that the groups have access to',
	},
	'appDistribution.groups.create': {
		riskLevel: 'write',
		description: 'Create a group',
	},
	'appDistribution.groups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a group',
	},
	'appDistribution.groups.get': {
		riskLevel: 'read',
		description: 'Get a group',
	},
	'appDistribution.groups.list': {
		riskLevel: 'read',
		description: 'List groups (paged with pageToken / nextPageToken)',
	},
	'appDistribution.groups.patch': {
		riskLevel: 'write',
		description: 'Update a group',
	},
	'appDistribution.media.upload': {
		riskLevel: 'write',
		description:
			'Uploads a binary. Uploading a binary can result in a new release being created, an update to an existing release, or a no-op if a release with the same binary already exists; pass `file` to upload the bytes',
	},
	'appDistribution.testers.batchAdd': {
		riskLevel: 'destructive',
		description:
			"Batch adds testers. This call adds testers for the specified emails if they don't already exist",
	},
	'appDistribution.testers.batchRemove': {
		riskLevel: 'write',
		description:
			'Batch removes testers. If found, this call deletes testers for the specified emails',
	},
	'appDistribution.testers.list': {
		riskLevel: 'read',
		description:
			'Lists testers and their resource ids (paged with pageToken / nextPageToken)',
	},
	'appDistribution.testers.patch': {
		riskLevel: 'write',
		description:
			'Update a tester. If the testers joins a group they gain access to all releases that the group has access to',
	},
	'auth.accounts.createAuthUri': {
		riskLevel: 'read',
		description:
			"If an email identifier is specified, checks and returns if any user account is registered with the email. If there is a registered account, fetches all providers associated with the account's email",
	},
	'auth.accounts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Deletes a user's account",
	},
	'auth.accounts.issueSamlResponse': {
		riskLevel: 'write',
		description: 'Experimental',
	},
	'auth.accounts.lookup': {
		riskLevel: 'read',
		description:
			'Gets account information for all matched accounts. For an end user request, retrieves the account of the end user',
	},
	'auth.accounts.resetPassword': {
		riskLevel: 'write',
		description:
			'Resets the password of an account either using an out-of-band code generated by sendOobCode or by specifying the email and password of the account to be modified. Can also check the purpose of an out-of-band code without consuming it',
	},
	'auth.accounts.sendOobCode': {
		riskLevel: 'destructive',
		description:
			'Sends an out-of-band confirmation code for an account. Requests from a authenticated request can optionally return a link including the OOB code instead of sending it',
	},
	'auth.accounts.sendVerificationCode': {
		riskLevel: 'destructive',
		description:
			"Sends a SMS verification code for phone number sign-in. To localize the text of the SMS sent to the user, set the HTTP header `X-Firebase-Locale` to the language code that corresponds with the user's locale",
	},
	'auth.accounts.signInWithCustomToken': {
		riskLevel: 'destructive',
		description:
			'Signs in or signs up a user by exchanging a custom Auth token. Upon a successful sign-in or sign-up, a new Identity Platform ID token and refresh token are issued for the user',
	},
	'auth.accounts.signInWithEmailLink': {
		riskLevel: 'write',
		description:
			'Signs in or signs up a user with a out-of-band code from an email link. If a user does not exist with the given email address, a user record will be created',
	},
	'auth.accounts.signInWithGameCenter': {
		riskLevel: 'write',
		description:
			'Signs in or signs up a user with iOS Game Center credentials. If the sign-in succeeds, a new Identity Platform ID token and refresh token are issued for the authenticated user',
	},
	'auth.accounts.signInWithIdp': {
		riskLevel: 'write',
		description:
			'Signs in or signs up a user using credentials from an Identity Provider (IdP). This is done by manually providing an IdP credential, or by providing the authorization response obtained via the authorization request from CreateAuthUri',
	},
	'auth.accounts.signInWithPassword': {
		riskLevel: 'write',
		description:
			'Signs in a user with email and password. If the sign-in succeeds, a new Identity Platform ID token and refresh token are issued for the authenticated user',
	},
	'auth.accounts.signInWithPhoneNumber': {
		riskLevel: 'write',
		description:
			'Completes a phone number authentication attempt. If a user already exists with the given phone number, an ID token is minted for that user',
	},
	'auth.accounts.signUp': {
		riskLevel: 'write',
		description:
			'Signs up a new email and password user or anonymous user, or upgrades an anonymous user to email and password. For an admin request with a Google OAuth 2.0 credential with the proper [permissions](https://cloud.google.com/identity-platform/docs/access-control), creates a new anonymous, email and password, or phone number user',
	},
	'auth.accounts.update': {
		riskLevel: 'write',
		description:
			'Updates account-related information for the specified user by setting specific fields or applying action codes. Requests from administrators and end users are supported',
	},
	'auth.accounts.verifyIosClient': {
		riskLevel: 'write',
		description:
			'Verifies an iOS client is a real iOS device. If the request is valid, a receipt will be sent in the response and a secret will be sent via Apple Push Notification Service',
	},
	'auth.getProjects': {
		riskLevel: 'read',
		description:
			"Gets a project's public Identity Toolkit configuration. (Legacy) This method also supports authenticated calls from a developer to retrieve non-public configuration",
	},
	'auth.getPublicKeys': {
		riskLevel: 'read',
		description:
			'Retrieves public keys of the legacy Identity Toolkit token signer to enable third parties to verify the legacy ID token. For now the X509 pem cert is the only format supported',
	},
	'auth.getRecaptchaParams': {
		riskLevel: 'read',
		description: 'Gets parameters needed for generating a reCAPTCHA challenge',
	},
	'auth.getSessionCookiePublicKeys': {
		riskLevel: 'read',
		description:
			'Retrieves the set of public keys of the session cookie JSON Web Token (JWT) signer that can be used to validate the session cookie created through createSessionCookie',
	},
	'auth.projects.accounts.batchCreate': {
		riskLevel: 'write',
		description:
			'Uploads multiple accounts into the Google Cloud project. If there is a problem uploading one or more of the accounts, the rest will be uploaded, and a list of the errors will be returned',
	},
	'auth.projects.accounts.batchDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Batch deletes multiple accounts. For accounts that fail to be deleted, error info is contained in the response',
	},
	'auth.projects.accounts.batchGet': {
		riskLevel: 'read',
		description:
			'Download account information for all accounts on the project in a paginated manner. To use this method requires a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control)',
	},
	'auth.projects.accounts.create': {
		riskLevel: 'write',
		description:
			'Signs up a new email and password user or anonymous user, or upgrades an anonymous user to email and password. For an admin request with a Google OAuth 2.0 credential with the proper [permissions](https://cloud.google.com/identity-platform/docs/access-control), creates a new anonymous, email and password, or phone number user',
	},
	'auth.projects.accounts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Deletes a user's account",
	},
	'auth.projects.accounts.lookup': {
		riskLevel: 'read',
		description:
			'Gets account information for all matched accounts. For an end user request, retrieves the account of the end user',
	},
	'auth.projects.accounts.query': {
		riskLevel: 'read',
		description:
			'Looks up user accounts within a project or a tenant based on conditions in the request',
	},
	'auth.projects.accounts.sendOobCode': {
		riskLevel: 'destructive',
		description:
			'Sends an out-of-band confirmation code for an account. Requests from a authenticated request can optionally return a link including the OOB code instead of sending it',
	},
	'auth.projects.accounts.update': {
		riskLevel: 'write',
		description:
			'Updates account-related information for the specified user by setting specific fields or applying action codes. Requests from administrators and end users are supported',
	},
	'auth.projects.createSessionCookie': {
		riskLevel: 'destructive',
		description:
			"Creates a session cookie for the given Identity Platform ID token. The session cookie is used by the client to preserve the user's login state",
	},
	'auth.projects.queryAccounts': {
		riskLevel: 'read',
		description:
			'Looks up user accounts within a project or a tenant based on conditions in the request',
	},
	'auth.projects.tenants.accounts.batchCreate': {
		riskLevel: 'write',
		description:
			'Uploads multiple accounts into the Google Cloud project. If there is a problem uploading one or more of the accounts, the rest will be uploaded, and a list of the errors will be returned',
	},
	'auth.projects.tenants.accounts.batchDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Batch deletes multiple accounts. For accounts that fail to be deleted, error info is contained in the response',
	},
	'auth.projects.tenants.accounts.batchGet': {
		riskLevel: 'read',
		description:
			'Download account information for all accounts on the project in a paginated manner. To use this method requires a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control)',
	},
	'auth.projects.tenants.accounts.create': {
		riskLevel: 'write',
		description:
			'Signs up a new email and password user or anonymous user, or upgrades an anonymous user to email and password. For an admin request with a Google OAuth 2.0 credential with the proper [permissions](https://cloud.google.com/identity-platform/docs/access-control), creates a new anonymous, email and password, or phone number user',
	},
	'auth.projects.tenants.accounts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Deletes a user's account",
	},
	'auth.projects.tenants.accounts.lookup': {
		riskLevel: 'read',
		description:
			'Gets account information for all matched accounts. For an end user request, retrieves the account of the end user',
	},
	'auth.projects.tenants.accounts.query': {
		riskLevel: 'read',
		description:
			'Looks up user accounts within a project or a tenant based on conditions in the request',
	},
	'auth.projects.tenants.accounts.sendOobCode': {
		riskLevel: 'destructive',
		description:
			'Sends an out-of-band confirmation code for an account. Requests from a authenticated request can optionally return a link including the OOB code instead of sending it',
	},
	'auth.projects.tenants.accounts.update': {
		riskLevel: 'write',
		description:
			'Updates account-related information for the specified user by setting specific fields or applying action codes. Requests from administrators and end users are supported',
	},
	'auth.projects.tenants.createSessionCookie': {
		riskLevel: 'destructive',
		description:
			"Creates a session cookie for the given Identity Platform ID token. The session cookie is used by the client to preserve the user's login state",
	},
	'authAdmin.accounts.mfaEnrollment.finalize': {
		riskLevel: 'write',
		description: 'Finishes enrolling a second factor for the user',
	},
	'authAdmin.accounts.mfaEnrollment.start': {
		riskLevel: 'write',
		description:
			'Step one of the MFA enrollment process. In SMS case, this sends an SMS verification code to the user',
	},
	'authAdmin.accounts.mfaEnrollment.withdraw': {
		riskLevel: 'write',
		description:
			'Revokes one second factor from the enrolled second factors for an account',
	},
	'authAdmin.accounts.mfaSignIn.finalize': {
		riskLevel: 'write',
		description: 'Verifies the MFA challenge and performs sign-in',
	},
	'authAdmin.accounts.mfaSignIn.start': {
		riskLevel: 'write',
		description: 'Sends the MFA challenge',
	},
	'authAdmin.accounts.revokeToken': {
		riskLevel: 'destructive',
		description:
			"Revokes a user's token from an Identity Provider (IdP). This is done by manually providing an IdP credential, and the token types for revocation",
	},
	'authAdmin.defaultSupportedIdpConfigs.create': {
		riskLevel: 'write',
		description:
			'Create a default supported Idp configuration for an Identity Toolkit project',
	},
	'authAdmin.defaultSupportedIdpConfigs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a default supported Idp configuration for an Identity Toolkit project',
	},
	'authAdmin.defaultSupportedIdpConfigs.get': {
		riskLevel: 'read',
		description:
			'Retrieve a default supported Idp configuration for an Identity Toolkit project',
	},
	'authAdmin.defaultSupportedIdpConfigs.list': {
		riskLevel: 'read',
		description:
			'List all default supported Idp configurations for an Identity Toolkit project (paged with pageToken / nextPageToken)',
	},
	'authAdmin.defaultSupportedIdpConfigs.patch': {
		riskLevel: 'write',
		description:
			'Update a default supported Idp configuration for an Identity Toolkit project',
	},
	'authAdmin.defaultSupportedIdps.list': {
		riskLevel: 'read',
		description:
			'List all default supported Idps (paged with pageToken / nextPageToken)',
	},
	'authAdmin.getPasswordPolicy': {
		riskLevel: 'read',
		description: 'Gets password policy config set on the project or tenant',
	},
	'authAdmin.getRecaptchaConfig': {
		riskLevel: 'read',
		description: 'Gets parameters needed for reCAPTCHA analysis',
	},
	'authAdmin.identityPlatform.initializeAuth': {
		riskLevel: 'write',
		description:
			'Initialize Identity Platform for a Cloud project. Identity Platform is an end-to-end authentication system for third-party users to access your apps and services',
	},
	'authAdmin.inboundSamlConfigs.create': {
		riskLevel: 'write',
		description:
			'Create an inbound SAML configuration for an Identity Toolkit project',
	},
	'authAdmin.inboundSamlConfigs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an inbound SAML configuration for an Identity Toolkit project',
	},
	'authAdmin.inboundSamlConfigs.get': {
		riskLevel: 'read',
		description:
			'Retrieve an inbound SAML configuration for an Identity Toolkit project',
	},
	'authAdmin.inboundSamlConfigs.list': {
		riskLevel: 'read',
		description:
			'List all inbound SAML configurations for an Identity Toolkit project (paged with pageToken / nextPageToken)',
	},
	'authAdmin.inboundSamlConfigs.patch': {
		riskLevel: 'write',
		description:
			'Update an inbound SAML configuration for an Identity Toolkit project',
	},
	'authAdmin.oauthIdpConfigs.create': {
		riskLevel: 'write',
		description:
			'Create an Oidc Idp configuration for an Identity Toolkit project',
	},
	'authAdmin.oauthIdpConfigs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an Oidc Idp configuration for an Identity Toolkit project',
	},
	'authAdmin.oauthIdpConfigs.get': {
		riskLevel: 'read',
		description:
			'Retrieve an Oidc Idp configuration for an Identity Toolkit project',
	},
	'authAdmin.oauthIdpConfigs.list': {
		riskLevel: 'read',
		description:
			'List all Oidc Idp configurations for an Identity Toolkit project (paged with pageToken / nextPageToken)',
	},
	'authAdmin.oauthIdpConfigs.patch': {
		riskLevel: 'write',
		description:
			'Update an Oidc Idp configuration for an Identity Toolkit project',
	},
	'authAdmin.projects.getConfig': {
		riskLevel: 'read',
		description: 'Retrieve an Identity Toolkit project configuration',
	},
	'authAdmin.projects.updateConfig': {
		riskLevel: 'write',
		description: 'Update an Identity Toolkit project configuration',
	},
	'authAdmin.tenants.create': {
		riskLevel: 'write',
		description:
			'Create a tenant. Requires write permission on the Agent project',
	},
	'authAdmin.tenants.defaultSupportedIdpConfigs.create': {
		riskLevel: 'write',
		description:
			'Create a default supported Idp configuration for an Identity Toolkit project',
	},
	'authAdmin.tenants.defaultSupportedIdpConfigs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a default supported Idp configuration for an Identity Toolkit project',
	},
	'authAdmin.tenants.defaultSupportedIdpConfigs.get': {
		riskLevel: 'read',
		description:
			'Retrieve a default supported Idp configuration for an Identity Toolkit project',
	},
	'authAdmin.tenants.defaultSupportedIdpConfigs.list': {
		riskLevel: 'read',
		description:
			'List all default supported Idp configurations for an Identity Toolkit project (paged with pageToken / nextPageToken)',
	},
	'authAdmin.tenants.defaultSupportedIdpConfigs.patch': {
		riskLevel: 'write',
		description:
			'Update a default supported Idp configuration for an Identity Toolkit project',
	},
	'authAdmin.tenants.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a tenant. Requires write permission on the Agent project',
	},
	'authAdmin.tenants.get': {
		riskLevel: 'read',
		description:
			'Get a tenant. Requires read permission on the Tenant resource',
	},
	'authAdmin.tenants.getIamPolicy': {
		riskLevel: 'write',
		description:
			'Gets the access control policy for a resource. An error is returned if the resource does not exist',
	},
	'authAdmin.tenants.inboundSamlConfigs.create': {
		riskLevel: 'write',
		description:
			'Create an inbound SAML configuration for an Identity Toolkit project',
	},
	'authAdmin.tenants.inboundSamlConfigs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an inbound SAML configuration for an Identity Toolkit project',
	},
	'authAdmin.tenants.inboundSamlConfigs.get': {
		riskLevel: 'read',
		description:
			'Retrieve an inbound SAML configuration for an Identity Toolkit project',
	},
	'authAdmin.tenants.inboundSamlConfigs.list': {
		riskLevel: 'read',
		description:
			'List all inbound SAML configurations for an Identity Toolkit project (paged with pageToken / nextPageToken)',
	},
	'authAdmin.tenants.inboundSamlConfigs.patch': {
		riskLevel: 'write',
		description:
			'Update an inbound SAML configuration for an Identity Toolkit project',
	},
	'authAdmin.tenants.list': {
		riskLevel: 'read',
		description:
			'List tenants under the given agent project. Requires read permission on the Agent project (paged with pageToken / nextPageToken)',
	},
	'authAdmin.tenants.oauthIdpConfigs.create': {
		riskLevel: 'write',
		description:
			'Create an Oidc Idp configuration for an Identity Toolkit project',
	},
	'authAdmin.tenants.oauthIdpConfigs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an Oidc Idp configuration for an Identity Toolkit project',
	},
	'authAdmin.tenants.oauthIdpConfigs.get': {
		riskLevel: 'read',
		description:
			'Retrieve an Oidc Idp configuration for an Identity Toolkit project',
	},
	'authAdmin.tenants.oauthIdpConfigs.list': {
		riskLevel: 'read',
		description:
			'List all Oidc Idp configurations for an Identity Toolkit project (paged with pageToken / nextPageToken)',
	},
	'authAdmin.tenants.oauthIdpConfigs.patch': {
		riskLevel: 'write',
		description:
			'Update an Oidc Idp configuration for an Identity Toolkit project',
	},
	'authAdmin.tenants.patch': {
		riskLevel: 'write',
		description:
			'Update a tenant. Requires write permission on the Tenant resource',
	},
	'authAdmin.tenants.setIamPolicy': {
		riskLevel: 'write',
		description:
			'Sets the access control policy for a resource. If the policy exists, it is replaced',
	},
	'authAdmin.tenants.testIamPermissions': {
		riskLevel: 'write',
		description:
			"Returns the caller's permissions on a resource. An error is returned if the resource does not exist",
	},
	'database.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete the value at a path and everything under it',
	},
	'database.get': {
		riskLevel: 'read',
		description:
			'Read the value at a path of a Realtime Database, optionally filtered and ordered',
	},
	'database.push': {
		riskLevel: 'write',
		description:
			'Add a child with a generated key under a path (returns { name })',
	},
	'database.rules.get': {
		riskLevel: 'read',
		description: "Read the database's security rules",
	},
	'database.rules.set': {
		riskLevel: 'destructive',
		description: "Replace the database's security rules",
	},
	'database.set': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Write a value at a path, replacing what is there',
	},
	'database.update': {
		riskLevel: 'write',
		description: 'Update some children at a path, leaving the others',
	},
	'databaseInstances.locations.instances.create': {
		riskLevel: 'write',
		description:
			'Requests that a new DatabaseInstance be created. The state of a successfully created DatabaseInstance is ACTIVE',
	},
	'databaseInstances.locations.instances.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Marks a DatabaseInstance to be deleted. The DatabaseInstance will be set to the DELETED state for 20 days, and will be purged within 30 days',
	},
	'databaseInstances.locations.instances.disable': {
		riskLevel: 'write',
		description:
			'Disables a DatabaseInstance. The database can be re-enabled later using ReenableDatabaseInstance',
	},
	'databaseInstances.locations.instances.get': {
		riskLevel: 'read',
		description:
			'Gets the DatabaseInstance identified by the specified resource name',
	},
	'databaseInstances.locations.instances.list': {
		riskLevel: 'read',
		description:
			'Lists each DatabaseInstance associated with the specified parent project. The list items are returned in no particular order, but will be a consistent view of the database instances when additional requests are made with a `pageToken`',
	},
	'databaseInstances.locations.instances.reenable': {
		riskLevel: 'write',
		description:
			'Enables a DatabaseInstance. The database must have been disabled previously using DisableDatabaseInstance',
	},
	'databaseInstances.locations.instances.undelete': {
		riskLevel: 'write',
		description:
			'Restores a DatabaseInstance that was previously marked to be deleted. After the delete method is used, DatabaseInstances are set to the DELETED state for 20 days, and will be purged within 30 days',
	},
	'firestore.databases.backupSchedules.create': {
		riskLevel: 'write',
		description:
			'Creates a backup schedule on a database. At most two backup schedules can be configured on a database, one daily backup schedule and one weekly backup schedule',
	},
	'firestore.databases.backupSchedules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a backup schedule',
	},
	'firestore.databases.backupSchedules.get': {
		riskLevel: 'read',
		description: 'Gets information about a backup schedule',
	},
	'firestore.databases.backupSchedules.list': {
		riskLevel: 'read',
		description: 'List backup schedules',
	},
	'firestore.databases.backupSchedules.patch': {
		riskLevel: 'write',
		description: 'Updates a backup schedule',
	},
	'firestore.databases.bulkDeleteDocuments': {
		riskLevel: 'write',
		description:
			'Bulk deletes a subset of documents from Google Cloud Firestore. Documents created or updated after the underlying system starts to process the request will not be deleted',
	},
	'firestore.databases.changeStreams.create': {
		riskLevel: 'write',
		description: 'Creates a new change stream for the database',
	},
	'firestore.databases.changeStreams.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a change stream',
	},
	'firestore.databases.changeStreams.get': {
		riskLevel: 'read',
		description: 'Gets information about a change stream',
	},
	'firestore.databases.changeStreams.list': {
		riskLevel: 'read',
		description: 'Lists all change streams in a database',
	},
	'firestore.databases.clone': {
		riskLevel: 'write',
		description:
			'Creates a new database by cloning an existing one. The new database must be in the same cloud region or multi-region location as the existing database',
	},
	'firestore.databases.collectionGroups.fields.get': {
		riskLevel: 'read',
		description: 'Gets the metadata and configuration for a Field',
	},
	'firestore.databases.collectionGroups.fields.list': {
		riskLevel: 'read',
		description:
			'Lists the field configuration and metadata for this database. Currently, FirestoreAdmin.ListFields only supports listing fields that have been explicitly overridden (paged with pageToken / nextPageToken)',
	},
	'firestore.databases.collectionGroups.fields.patch': {
		riskLevel: 'write',
		description:
			'Updates a field configuration. Currently, field updates apply only to single field index configuration',
	},
	'firestore.databases.collectionGroups.indexes.create': {
		riskLevel: 'write',
		description:
			'Creates a composite index. This returns a google.longrunning.Operation which may be used to track the status of the creation',
	},
	'firestore.databases.collectionGroups.indexes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a composite index',
	},
	'firestore.databases.collectionGroups.indexes.get': {
		riskLevel: 'read',
		description: 'Gets a composite index',
	},
	'firestore.databases.collectionGroups.indexes.list': {
		riskLevel: 'read',
		description:
			'Lists composite indexes (paged with pageToken / nextPageToken)',
	},
	'firestore.databases.create': {
		riskLevel: 'write',
		description: 'Create a database',
	},
	'firestore.databases.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a database',
	},
	'firestore.databases.documents.batchGet': {
		riskLevel: 'read',
		description:
			'Gets multiple documents. Documents returned by this method are not guaranteed to be returned in the same order that they were requested',
	},
	'firestore.databases.documents.batchWrite': {
		riskLevel: 'write',
		description:
			'Applies a batch of write operations. The BatchWrite method does not apply the write operations atomically and can apply them out of order',
	},
	'firestore.databases.documents.beginTransaction': {
		riskLevel: 'write',
		description: 'Starts a new transaction',
	},
	'firestore.databases.documents.commit': {
		riskLevel: 'write',
		description: 'Commits a transaction, while optionally updating documents',
	},
	'firestore.databases.documents.createDocument': {
		riskLevel: 'write',
		description:
			'Create a document in a collection (parent = projects/<p>/databases/(default)/documents, collectionId), with fields as Firestore Values ({ stringValue }, { integerValue } ...)',
	},
	'firestore.databases.documents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a document',
	},
	'firestore.databases.documents.executePipeline': {
		riskLevel: 'read',
		description: 'Executes a pipeline query',
	},
	'firestore.databases.documents.get': {
		riskLevel: 'read',
		description:
			'Get one Firestore document by its full name (projects/<p>/databases/(default)/documents/<collection>/<id>)',
	},
	'firestore.databases.documents.list': {
		riskLevel: 'read',
		description: 'Lists documents (paged with pageToken / nextPageToken)',
	},
	'firestore.databases.documents.listCollectionIds': {
		riskLevel: 'read',
		description: 'Lists all the collection IDs underneath a document',
	},
	'firestore.databases.documents.listDocuments': {
		riskLevel: 'read',
		description: 'Lists documents (paged with pageToken / nextPageToken)',
	},
	'firestore.databases.documents.partitionQuery': {
		riskLevel: 'read',
		description:
			'Partitions a query by returning partition cursors that can be used to run the query in parallel. The returned partition cursors are split points that can be used by RunQuery as starting/end points for the query results',
	},
	'firestore.databases.documents.patch': {
		riskLevel: 'write',
		description:
			'Update or create a document: the fields given replace the stored ones (updateMask.fieldPaths limits which)',
	},
	'firestore.databases.documents.rollback': {
		riskLevel: 'destructive',
		description: 'Rolls back a transaction',
	},
	'firestore.databases.documents.runAggregationQuery': {
		riskLevel: 'read',
		description:
			'Runs an aggregation query. Rather than producing Document results like Firestore.RunQuery, this API allows running an aggregation to produce a series of AggregationResult server-side',
	},
	'firestore.databases.documents.runQuery': {
		riskLevel: 'read',
		description:
			'Run a structured query and return the matching documents (one entry per result, as Firestore streams them)',
	},
	'firestore.databases.exportDocuments': {
		riskLevel: 'write',
		description:
			'Exports a copy of all or a subset of documents from Google Cloud Firestore to another storage system, such as Google Cloud Storage. Recent updates to documents may not be reflected in the export',
	},
	'firestore.databases.get': {
		riskLevel: 'read',
		description: 'Gets information about a database',
	},
	'firestore.databases.importDocuments': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Imports documents into Google Cloud Firestore. Existing documents with the same name are overwritten',
	},
	'firestore.databases.list': {
		riskLevel: 'read',
		description: 'List all the databases in the project',
	},
	'firestore.databases.operations.cancel': {
		riskLevel: 'write',
		description:
			'Starts asynchronous cancellation on a long-running operation. The server makes a best effort to cancel the operation, but success is not guaranteed',
	},
	'firestore.databases.operations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a long-running operation. This method indicates that the client is no longer interested in the operation result',
	},
	'firestore.databases.operations.get': {
		riskLevel: 'read',
		description:
			'Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service',
	},
	'firestore.databases.operations.list': {
		riskLevel: 'read',
		description:
			"Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED` (paged with pageToken / nextPageToken)",
	},
	'firestore.databases.patch': {
		riskLevel: 'write',
		description: 'Updates a database',
	},
	'firestore.databases.restore': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Creates a new database by restoring from an existing backup. The new database must be in the same cloud region or multi-region location as the existing backup',
	},
	'firestore.databases.userCreds.create': {
		riskLevel: 'write',
		description: 'Create a user creds',
	},
	'firestore.databases.userCreds.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a user creds',
	},
	'firestore.databases.userCreds.disable': {
		riskLevel: 'write',
		description:
			'Disables a user creds. No-op if the user creds are already disabled',
	},
	'firestore.databases.userCreds.enable': {
		riskLevel: 'write',
		description:
			'Enables a user creds. No-op if the user creds are already enabled',
	},
	'firestore.databases.userCreds.get': {
		riskLevel: 'read',
		description:
			'Gets a user creds resource. Note that the returned resource does not contain the secret value itself',
	},
	'firestore.databases.userCreds.list': {
		riskLevel: 'read',
		description:
			'List all user creds in the database. Note that the returned resource does not contain the secret value itself',
	},
	'firestore.databases.userCreds.resetPassword': {
		riskLevel: 'write',
		description: 'Resets the password of a user creds',
	},
	'firestore.locations.backups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a backup',
	},
	'firestore.locations.backups.get': {
		riskLevel: 'read',
		description: 'Gets information about a backup',
	},
	'firestore.locations.backups.list': {
		riskLevel: 'read',
		description: 'Lists all the backups',
	},
	'firestore.locations.get': {
		riskLevel: 'read',
		description: 'Gets information about a location',
	},
	'firestore.locations.list': {
		riskLevel: 'read',
		description:
			'Lists information about the supported locations for this service. This method lists locations based on the resource scope provided in the ListLocationsRequest.name field: * **Global locations**: If `name` is empty, the method lists the public locations available to all projects. * **Project-specific locations**: If `name` follows the format `projects/{project}`, the method lists locations... (paged with pageToken / nextPageToken)',
	},
	'hosting.operations.get': {
		riskLevel: 'read',
		description:
			'Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service',
	},
	'hosting.sites.channels.create': {
		riskLevel: 'write',
		description: 'Creates a new channel in the specified site',
	},
	'hosting.sites.channels.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes the specified channel of the specified site. The `live` channel cannot be deleted',
	},
	'hosting.sites.channels.get': {
		riskLevel: 'read',
		description:
			'Retrieves information for the specified channel of the specified site',
	},
	'hosting.sites.channels.list': {
		riskLevel: 'read',
		description:
			'Lists the channels for the specified site. All sites have a default `live` channel (paged with pageToken / nextPageToken)',
	},
	'hosting.sites.channels.patch': {
		riskLevel: 'write',
		description:
			"Updates information for the specified channel of the specified site. Implicitly creates the channel if it doesn't already exist",
	},
	'hosting.sites.channels.releases.create': {
		riskLevel: 'destructive',
		description:
			'Creates a new release, which makes the content of the specified version actively display on the appropriate URL(s)',
	},
	'hosting.sites.channels.releases.get': {
		riskLevel: 'read',
		description:
			'Gets the specified release for a site or channel. When used to get a release for a site, this can get releases for both the default `live` channel and any active preview channels for the specified site',
	},
	'hosting.sites.channels.releases.list': {
		riskLevel: 'read',
		description:
			'Lists the releases that have been created for the specified site or channel. When used to list releases for a site, this list includes releases for both the default `live` channel and any active preview channels for the specified site (paged with pageToken / nextPageToken)',
	},
	'hosting.sites.create': {
		riskLevel: 'write',
		description:
			'Creates a new Hosting Site in the specified parent Firebase project. Note that Hosting sites can take several minutes to propagate through Firebase systems',
	},
	'hosting.sites.customDomains.create': {
		riskLevel: 'write',
		description: 'Creates a `CustomDomain`',
	},
	'hosting.sites.customDomains.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes the specified `CustomDomain`',
	},
	'hosting.sites.customDomains.get': {
		riskLevel: 'read',
		description: 'Gets the specified `CustomDomain`',
	},
	'hosting.sites.customDomains.list': {
		riskLevel: 'read',
		description:
			'Lists each `CustomDomain` associated with the specified parent Hosting site. Returns `CustomDomain`s in a consistent, but undefined, order to facilitate pagination (paged with pageToken / nextPageToken)',
	},
	'hosting.sites.customDomains.operations.get': {
		riskLevel: 'read',
		description:
			'Gets the latest state of a long-running operation. Use this method to poll the operation result at intervals as recommended by the API service',
	},
	'hosting.sites.customDomains.operations.list': {
		riskLevel: 'read',
		description:
			'Lists operations that match the specified filter in the request (paged with pageToken / nextPageToken)',
	},
	'hosting.sites.customDomains.patch': {
		riskLevel: 'write',
		description: 'Updates the specified `CustomDomain`',
	},
	'hosting.sites.customDomains.undelete': {
		riskLevel: 'write',
		description:
			'Undeletes the specified `CustomDomain` if it has been soft-deleted. Hosting retains soft-deleted custom domains for around 30 days before permanently deleting them',
	},
	'hosting.sites.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes the specified Hosting Site from the specified parent Firebase project',
	},
	'hosting.sites.domains.create': {
		riskLevel: 'write',
		description: 'Creates a domain mapping on the specified site',
	},
	'hosting.sites.domains.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes the existing domain mapping on the specified site',
	},
	'hosting.sites.domains.get': {
		riskLevel: 'read',
		description: 'Gets a domain mapping on the specified site',
	},
	'hosting.sites.domains.list': {
		riskLevel: 'read',
		description:
			'Lists the domains for the specified site (paged with pageToken / nextPageToken)',
	},
	'hosting.sites.domains.update': {
		riskLevel: 'write',
		description:
			'Updates the specified domain mapping, creating the mapping as if it does not exist',
	},
	'hosting.sites.get': {
		riskLevel: 'read',
		description: 'Gets the specified Hosting Site',
	},
	'hosting.sites.getConfig': {
		riskLevel: 'read',
		description: 'Gets the Hosting metadata for a specific site',
	},
	'hosting.sites.list': {
		riskLevel: 'read',
		description:
			'Lists each Hosting Site associated with the specified parent Firebase project (paged with pageToken / nextPageToken)',
	},
	'hosting.sites.patch': {
		riskLevel: 'write',
		description: 'Updates attributes of the specified Hosting Site',
	},
	'hosting.sites.releases.create': {
		riskLevel: 'destructive',
		description:
			'Creates a new release, which makes the content of the specified version actively display on the appropriate URL(s)',
	},
	'hosting.sites.releases.get': {
		riskLevel: 'read',
		description:
			'Gets the specified release for a site or channel. When used to get a release for a site, this can get releases for both the default `live` channel and any active preview channels for the specified site',
	},
	'hosting.sites.releases.list': {
		riskLevel: 'read',
		description:
			'Lists the releases that have been created for the specified site or channel. When used to list releases for a site, this list includes releases for both the default `live` channel and any active preview channels for the specified site (paged with pageToken / nextPageToken)',
	},
	'hosting.sites.updateConfig': {
		riskLevel: 'write',
		description: 'Sets the Hosting metadata for a specific site',
	},
	'hosting.sites.versions.clone': {
		riskLevel: 'write',
		description:
			'Creates a new version on the specified target site using the content of the specified version',
	},
	'hosting.sites.versions.create': {
		riskLevel: 'write',
		description: 'Creates a new version for the specified site',
	},
	'hosting.sites.versions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes the specified version',
	},
	'hosting.sites.versions.files.list': {
		riskLevel: 'read',
		description:
			'Lists the remaining files to be uploaded for the specified version (paged with pageToken / nextPageToken)',
	},
	'hosting.sites.versions.get': {
		riskLevel: 'read',
		description:
			'Get the specified version that has been created for the specified site. This can include versions that were created for the default `live` channel or for any active preview channels for the specified site',
	},
	'hosting.sites.versions.list': {
		riskLevel: 'read',
		description:
			'Lists the versions that have been created for the specified site. This list includes versions for both the default `live` channel and any active preview channels for the specified site (paged with pageToken / nextPageToken)',
	},
	'hosting.sites.versions.patch': {
		riskLevel: 'write',
		description:
			'Updates the specified metadata for the specified version. This method will fail with `FAILED_PRECONDITION` in the event of an invalid state transition',
	},
	'hosting.sites.versions.populateFiles': {
		riskLevel: 'write',
		description:
			'Adds content files to the specified version. Each file must be under 2 GB',
	},
	'management.androidApps.create': {
		riskLevel: 'write',
		description:
			'Requests the creation of a new AndroidApp in the specified FirebaseProject. The result of this call is an `Operation` which can be used to track the provisioning process',
	},
	'management.androidApps.get': {
		riskLevel: 'read',
		description: 'Gets the specified AndroidApp',
	},
	'management.androidApps.getConfig': {
		riskLevel: 'read',
		description:
			'Gets the configuration artifact associated with the specified AndroidApp',
	},
	'management.androidApps.list': {
		riskLevel: 'read',
		description:
			'Lists each AndroidApp associated with the specified FirebaseProject. The elements are returned in no particular order, but will be a consistent view of the Apps when additional requests are made with a `pageToken`',
	},
	'management.androidApps.patch': {
		riskLevel: 'write',
		description: 'Updates the attributes of the specified AndroidApp',
	},
	'management.androidApps.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Removes the specified AndroidApp from the FirebaseProject',
	},
	'management.androidApps.sha.create': {
		riskLevel: 'write',
		description: 'Adds a ShaCertificate to the specified AndroidApp',
	},
	'management.androidApps.sha.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Removes a ShaCertificate from the specified AndroidApp',
	},
	'management.androidApps.sha.list': {
		riskLevel: 'read',
		description:
			'Lists the SHA-1 and SHA-256 certificates for the specified AndroidApp',
	},
	'management.androidApps.undelete': {
		riskLevel: 'write',
		description: 'Restores the specified AndroidApp to the FirebaseProject',
	},
	'management.availableLocations.list': {
		riskLevel: 'read',
		description:
			'**DECOMMISSIONED.** **If called, this endpoint will return a 404 error.** _Instead, use the applicable resource-specific REST API (or associated documentation, as needed) to determine valid locations for each resource used in your Project._ Lists the valid ["locations for default Google Cloud resources"](https://firebase.google.com/docs/projects/locations#default-cloud-location) for the... (paged with pageToken / nextPageToken)',
	},
	'management.availableProjects.list': {
		riskLevel: 'read',
		description:
			'Lists each [Google Cloud `Project`](https://cloud.google.com/resource-manager/reference/rest/v1/projects) that can have Firebase resources added and Firebase services enabled. A Project will only be listed if: - The caller has sufficient [Google IAM](https://cloud.google.com/iam) permissions to call AddFirebase. - The Project is not already a FirebaseProject. - The Project is not in an... (paged with pageToken / nextPageToken)',
	},
	'management.defaultLocation.finalize': {
		riskLevel: 'write',
		description:
			'**DECOMMISSIONED.** **If called, this endpoint will return a 404 error.** _Instead, use the applicable resource-specific REST API to set the location for each resource used in your Project._ Sets the ["location for default Google Cloud resources"](https://firebase.google.com/docs/projects/locations#default-cloud-location) for the specified FirebaseProject. This method creates a Google App...',
	},
	'management.iosApps.create': {
		riskLevel: 'write',
		description:
			'Requests the creation of a new IosApp in the specified FirebaseProject. The result of this call is an `Operation` which can be used to track the provisioning process',
	},
	'management.iosApps.get': {
		riskLevel: 'read',
		description: 'Gets the specified IosApp',
	},
	'management.iosApps.getConfig': {
		riskLevel: 'read',
		description:
			'Gets the configuration artifact associated with the specified IosApp',
	},
	'management.iosApps.list': {
		riskLevel: 'read',
		description:
			'Lists each IosApp associated with the specified FirebaseProject. The elements are returned in no particular order, but will be a consistent view of the Apps when additional requests are made with a `pageToken`',
	},
	'management.iosApps.patch': {
		riskLevel: 'write',
		description: 'Updates the attributes of the specified IosApp',
	},
	'management.iosApps.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Removes the specified IosApp from the FirebaseProject',
	},
	'management.iosApps.undelete': {
		riskLevel: 'write',
		description: 'Restores the specified IosApp to the FirebaseProject',
	},
	'management.operations.get': {
		riskLevel: 'read',
		description:
			'Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service',
	},
	'management.projects.addFirebase': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Adds Firebase resources and enables Firebase services in the specified existing [Google Cloud `Project`](https://cloud.google.com/resource-manager/reference/rest/v1/projects). Since a FirebaseProject is actually also a Google Cloud `Project`, a `FirebaseProject` has the same underlying Google Cloud identifiers (`projectNumber` and `projectId`)',
	},
	'management.projects.addGoogleAnalytics': {
		riskLevel: 'destructive',
		description:
			'Links the specified FirebaseProject with an existing [Google Analytics account](http://www.google.com/analytics/). Using this call, you can either: - Specify an `analyticsAccountId` to provision a new Google Analytics property within the specified account and associate the new property with the `FirebaseProject`. - Specify an existing `analyticsPropertyId` to associate the property with the...',
	},
	'management.projects.get': {
		riskLevel: 'read',
		description: 'Gets the specified FirebaseProject',
	},
	'management.projects.getAdminSdkConfig': {
		riskLevel: 'read',
		description:
			'Gets the configuration artifact associated with the specified FirebaseProject, which can be used by servers to simplify initialization. Typically, this configuration is used with the Firebase Admin SDK [initializeApp](https://firebase.google.com/docs/admin/setup#initialize_the_sdk) command',
	},
	'management.projects.getAnalyticsDetails': {
		riskLevel: 'read',
		description:
			'Gets the Google Analytics details currently associated with the specified FirebaseProject. If the `FirebaseProject` is not yet linked to Google Analytics, then the response to `GetAnalyticsDetails` is `NOT_FOUND`',
	},
	'management.projects.list': {
		riskLevel: 'read',
		description:
			'Lists each FirebaseProject accessible to the caller. The elements are returned in no particular order, but they will be a consistent view of the Projects when additional requests are made with a `pageToken`',
	},
	'management.projects.patch': {
		riskLevel: 'write',
		description:
			'Updates the attributes of the specified FirebaseProject. All [query parameters](#query-parameters) are required',
	},
	'management.projects.removeAnalytics': {
		riskLevel: 'destructive',
		description:
			'Unlinks the specified FirebaseProject from its Google Analytics account. This call removes the association of the specified `FirebaseProject` with its current Google Analytics property',
	},
	'management.projects.searchApps': {
		riskLevel: 'read',
		description:
			'Lists all available Apps for the specified FirebaseProject. This is a convenience method (paged with pageToken / nextPageToken)',
	},
	'management.webApps.create': {
		riskLevel: 'write',
		description:
			'Requests the creation of a new WebApp in the specified FirebaseProject. The result of this call is an `Operation` which can be used to track the provisioning process',
	},
	'management.webApps.get': {
		riskLevel: 'read',
		description: 'Gets the specified WebApp',
	},
	'management.webApps.getConfig': {
		riskLevel: 'read',
		description:
			'Gets the configuration artifact associated with the specified WebApp',
	},
	'management.webApps.list': {
		riskLevel: 'read',
		description:
			'Lists each WebApp associated with the specified FirebaseProject. The elements are returned in no particular order, but will be a consistent view of the Apps when additional requests are made with a `pageToken`',
	},
	'management.webApps.patch': {
		riskLevel: 'write',
		description: 'Updates the attributes of the specified WebApp',
	},
	'management.webApps.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Removes the specified WebApp from the FirebaseProject',
	},
	'management.webApps.undelete': {
		riskLevel: 'write',
		description: 'Restores the specified WebApp to the FirebaseProject',
	},
	'messaging.messages.send': {
		riskLevel: 'destructive',
		description:
			'Send a message to a device token, a topic or a condition through FCM v1',
	},
	'messaging.registrations.topicSubscriptions.create': {
		riskLevel: 'write',
		description:
			'Creates a TopicSubscription. Subscribes an app installation instance (by registration_id, either FID or FCM Token) to a topicSubscription',
	},
	'messaging.registrations.topicSubscriptions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a TopicSubscription',
	},
	'messaging.registrations.topicSubscriptions.get': {
		riskLevel: 'read',
		description: 'Gets a TopicSubscription',
	},
	'messaging.registrations.topicSubscriptions.list': {
		riskLevel: 'read',
		description:
			'Lists TopicSubscriptions for a given app instance (paged with pageToken / nextPageToken)',
	},
	'messaging.registrations.topicSubscriptions.patch': {
		riskLevel: 'write',
		description:
			'Updates a TopicSubscription. Subscribes an app installation instance by registration_id, either FID or FCM Token, to a topicSubscription',
	},
	'remoteConfig.namespaces.experiments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an experiment. --- **BETA:** This API is in a Beta launch stage. It is intended for public testing and feedback',
	},
	'remoteConfig.namespaces.experiments.get': {
		riskLevel: 'read',
		description:
			'Get information about an existing experiment. Additional responses codes: NOT_FOUND: The experiment does not exist. --- **BETA:** This API is in a Beta launch stage',
	},
	'remoteConfig.namespaces.experiments.list': {
		riskLevel: 'read',
		description:
			'List all experiments for a project. --- **BETA:** This API is in a Beta launch stage. It is intended for public testing and feedback (paged with pageToken / nextPageToken)',
	},
	'remoteConfig.namespaces.fetch': {
		riskLevel: 'write',
		description:
			'Fetch parameter values and any Firebase A/B Testing experiment information for the calling device. An ETag header is also returned',
	},
	'remoteConfig.namespaces.get': {
		riskLevel: 'read',
		description:
			'Gets a namespace object by name. The namespace provided in [GetNamespaceRequest.name] must be "firebase" (for the client-side template) or "firebase-server" (for the server-side template)',
	},
	'remoteConfig.namespaces.getConditionOrder': {
		riskLevel: 'read',
		description: "Get a project's ConditionOrder",
	},
	'remoteConfig.namespaces.getRemoteConfig': {
		riskLevel: 'read',
		description:
			"Get a project's Remote Config template and associated ETag header. Returns the requested RemoteConfig as the payload and an ETag as a response header",
	},
	'remoteConfig.namespaces.getServerRemoteConfig': {
		riskLevel: 'read',
		description:
			"Get a project's server-side Remote Config template. Note that this request proto is structured differently from other request messages in this proto, however this is consistent and compliant with the new API guidance (https://google.aip.dev/122#fields-representing-resource-names) and the standard going forward",
	},
	'remoteConfig.namespaces.list': {
		riskLevel: 'read',
		description:
			'Lists all available namespaces for a given Firebase project. The returned list currently includes "firebase" (for the client-side template) and "firebase-server" (for the server-side template) (paged with pageToken / nextPageToken)',
	},
	'remoteConfig.namespaces.remoteConfig.downloadDefaults': {
		riskLevel: 'read',
		description:
			'Get a project\'s current Remote Config template parameters and default values in JSON, property list (plist), or XML format. To download the server-side template defaults, use "firebase-server" as the namespace ID in [DownloadDefaultsRequest.name]',
	},
	'remoteConfig.namespaces.remoteConfig.listVersions': {
		riskLevel: 'read',
		description:
			'Get a list of Remote Config template versions that have been published, sorted in reverse chronological order. Only the last 300 versions are stored (paged with pageToken / nextPageToken)',
	},
	'remoteConfig.namespaces.remoteConfig.rollback': {
		riskLevel: 'destructive',
		description:
			"Roll back a project's published Remote Config template to the one specified by the provided version number. A rollback is equivalent to getting a previously published Remote Config template, and re-publishing it using a force update",
	},
	'remoteConfig.namespaces.remoteConfigConditions.create': {
		riskLevel: 'write',
		description: 'Create a Remote Config condition',
	},
	'remoteConfig.namespaces.remoteConfigConditions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Remote Config condition',
	},
	'remoteConfig.namespaces.remoteConfigConditions.get': {
		riskLevel: 'read',
		description: 'Get a Remote Config condition',
	},
	'remoteConfig.namespaces.remoteConfigConditions.list': {
		riskLevel: 'read',
		description:
			'List all Remote Config conditions for a project (paged with pageToken / nextPageToken)',
	},
	'remoteConfig.namespaces.remoteConfigConditions.patch': {
		riskLevel: 'write',
		description: 'Update a Remote Config condition',
	},
	'remoteConfig.namespaces.remoteConfigParameterGroups.create': {
		riskLevel: 'write',
		description: 'Create a Remote Config parameter group',
	},
	'remoteConfig.namespaces.remoteConfigParameterGroups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Remote Config parameter group',
	},
	'remoteConfig.namespaces.remoteConfigParameterGroups.get': {
		riskLevel: 'read',
		description: 'Get a Remote Config parameter group',
	},
	'remoteConfig.namespaces.remoteConfigParameterGroups.list': {
		riskLevel: 'read',
		description:
			'List all Remote Config parameter groups for a project (paged with pageToken / nextPageToken)',
	},
	'remoteConfig.namespaces.remoteConfigParameterGroups.patch': {
		riskLevel: 'write',
		description: 'Update a Remote Config parameter group',
	},
	'remoteConfig.namespaces.remoteConfigParameters.create': {
		riskLevel: 'write',
		description: 'Create a Remote Config parameter',
	},
	'remoteConfig.namespaces.remoteConfigParameters.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Remote Config parameter',
	},
	'remoteConfig.namespaces.remoteConfigParameters.get': {
		riskLevel: 'read',
		description: "Get a project's Remote Config parameter",
	},
	'remoteConfig.namespaces.remoteConfigParameters.list': {
		riskLevel: 'read',
		description:
			'List all Remote Config parameters for a project (paged with pageToken / nextPageToken)',
	},
	'remoteConfig.namespaces.remoteConfigParameters.patch': {
		riskLevel: 'write',
		description: 'Update a Remote Config parameter',
	},
	'remoteConfig.namespaces.rollouts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a rollout experiment. --- **BETA:** This API is in a Beta launch stage. It is intended for public testing and feedback',
	},
	'remoteConfig.namespaces.rollouts.get': {
		riskLevel: 'read',
		description:
			'Get details about a rollout experiment. --- **BETA:** This API is in a Beta launch stage. It is intended for public testing and feedback',
	},
	'remoteConfig.namespaces.rollouts.list': {
		riskLevel: 'read',
		description:
			'Get a list of all rollouts for a project. --- **BETA:** This API is in a Beta launch stage. It is intended for public testing and feedback (paged with pageToken / nextPageToken)',
	},
	'remoteConfig.namespaces.updateConditionOrder': {
		riskLevel: 'write',
		description: "Update a project's ConditionOrder",
	},
	'remoteConfig.namespaces.updateRemoteConfig': {
		riskLevel: 'write',
		description:
			"Publish a project's Remote Config template. Pass the ETag returned by GetRemoteConfig as an `If-Match` header to ensure the last seen Remote Config template is the one being overwritten by this update",
	},
	'remoteConfig.projects.getRemoteConfig': {
		riskLevel: 'read',
		description:
			"Get a project's Remote Config template and associated ETag header. Returns the requested RemoteConfig as the payload and an ETag as a response header",
	},
	'remoteConfig.projects.updateRemoteConfig': {
		riskLevel: 'destructive',
		description:
			"Publish a project's Remote Config template. Pass the ETag returned by GetRemoteConfig as an `If-Match` header to ensure the last seen Remote Config template is the one being overwritten by this update",
	},
	'remoteConfig.remoteConfig.downloadDefaults': {
		riskLevel: 'read',
		description:
			'Get a project\'s current Remote Config template parameters and default values in JSON, property list (plist), or XML format. To download the server-side template defaults, use "firebase-server" as the namespace ID in [DownloadDefaultsRequest.name]',
	},
	'remoteConfig.remoteConfig.listVersions': {
		riskLevel: 'read',
		description:
			'Get a list of Remote Config template versions that have been published, sorted in reverse chronological order. Only the last 300 versions are stored (paged with pageToken / nextPageToken)',
	},
	'remoteConfig.remoteConfig.rollback': {
		riskLevel: 'destructive',
		description:
			"Roll back a project's published Remote Config template to the one specified by the provided version number. A rollback is equivalent to getting a previously published Remote Config template, and re-publishing it using a force update",
	},
	'rules.projects.test': {
		riskLevel: 'read',
		description:
			'Test `Source` for syntactic and semantic correctness. Issues present, if any, will be returned to the caller with a description, severity, and source location',
	},
	'rules.releases.create': {
		riskLevel: 'destructive',
		description:
			"Create a `Release`. Release names should reflect the developer's deployment practices",
	},
	'rules.releases.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a `Release` by resource name',
	},
	'rules.releases.get': {
		riskLevel: 'read',
		description: 'Get a `Release` by name',
	},
	'rules.releases.getExecutable': {
		riskLevel: 'read',
		description: 'Get the `Release` executable to use when enforcing rules',
	},
	'rules.releases.list': {
		riskLevel: 'read',
		description:
			'List the `Release` values for a project. This list may optionally be filtered by `Release` name, `Ruleset` name, `TestSuite` name, or any combination thereof (paged with pageToken / nextPageToken)',
	},
	'rules.releases.patch': {
		riskLevel: 'destructive',
		description:
			'Update a `Release` via PATCH. Only updates to `ruleset_name` will be honored. `Release` rename is not supported',
	},
	'rules.rulesets.create': {
		riskLevel: 'write',
		description:
			'Create a `Ruleset` from `Source`. The `Ruleset` is given a unique generated name which is returned to the caller. `Source` containing syntactic or semantics errors will result in an error response indicating the first error encountered',
	},
	'rules.rulesets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a `Ruleset` by resource name. If the `Ruleset` is referenced by a `Release` the operation will fail',
	},
	'rules.rulesets.get': {
		riskLevel: 'read',
		description: 'Get a `Ruleset` by name including the full `Source` contents',
	},
	'rules.rulesets.list': {
		riskLevel: 'read',
		description:
			'List `Ruleset` metadata only and optionally filter the results by `Ruleset` name. The full `Source` contents of a `Ruleset` may be retrieved with GetRuleset (paged with pageToken / nextPageToken)',
	},
	'storage.buckets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes an empty bucket. Deletions are permanent unless soft delete is enabled on the bucket',
	},
	'storage.buckets.get': {
		riskLevel: 'read',
		description: 'Returns metadata for the specified bucket',
	},
	'storage.buckets.getIamPolicy': {
		riskLevel: 'read',
		description: 'Returns an IAM policy for the specified bucket',
	},
	'storage.buckets.getStorageLayout': {
		riskLevel: 'read',
		description:
			'Returns the storage layout configuration for the specified bucket. Note that this operation requires storage.objects.list permission',
	},
	'storage.buckets.insert': {
		riskLevel: 'write',
		description: 'Creates a new bucket',
	},
	'storage.buckets.list': {
		riskLevel: 'read',
		description:
			'Retrieves a list of buckets for a given project (paged with pageToken / nextPageToken)',
	},
	'storage.buckets.lockRetentionPolicy': {
		riskLevel: 'write',
		description: 'Locks retention policy on a bucket',
	},
	'storage.buckets.operations.advanceRelocateBucket': {
		riskLevel: 'write',
		description:
			'Starts asynchronous advancement of the relocate bucket operation in the case of required write downtime, to allow it to lock the bucket at the source location, and proceed with the bucket location swap. The server makes a best effort to advance the relocate bucket operation, but success is not guaranteed',
	},
	'storage.buckets.operations.cancel': {
		riskLevel: 'write',
		description:
			'Starts asynchronous cancellation on a long-running operation. The server makes a best effort to cancel the operation, but success is not guaranteed',
	},
	'storage.buckets.operations.get': {
		riskLevel: 'read',
		description: 'Gets the latest state of a long-running operation',
	},
	'storage.buckets.operations.list': {
		riskLevel: 'read',
		description:
			'Lists operations that match the specified filter in the request (paged with pageToken / nextPageToken)',
	},
	'storage.buckets.patch': {
		riskLevel: 'write',
		description:
			'Patches a bucket. Changes to the bucket will be readable immediately after writing, but configuration changes may take time to propagate',
	},
	'storage.buckets.relocate': {
		riskLevel: 'write',
		description:
			'Initiates a long-running Relocate Bucket operation on the specified bucket',
	},
	'storage.buckets.restore': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Restores a soft-deleted bucket',
	},
	'storage.buckets.setIamPolicy': {
		riskLevel: 'write',
		description: 'Updates an IAM policy for the specified bucket',
	},
	'storage.buckets.testIamPermissions': {
		riskLevel: 'read',
		description:
			'Tests a set of permissions on the given bucket to see which, if any, are held by the caller',
	},
	'storage.buckets.update': {
		riskLevel: 'write',
		description:
			'Updates a bucket. Changes to the bucket will be readable immediately after writing, but configuration changes may take time to propagate',
	},
	'storage.objects.bulkRestore': {
		riskLevel: 'write',
		description:
			'Initiates a long-running bulk restore operation on the specified bucket',
	},
	'storage.objects.compose': {
		riskLevel: 'write',
		description:
			'Concatenates a list of existing objects into a new object in the same bucket',
	},
	'storage.objects.copy': {
		riskLevel: 'write',
		description:
			'Copies a source object to a destination object. Optionally overrides metadata',
	},
	'storage.objects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes an object and its metadata. Deletions are permanent if versioning is not enabled for the bucket, or if the generation parameter is used',
	},
	'storage.objects.download': {
		riskLevel: 'read',
		description: "Download an object's bytes (returned as a file)",
	},
	'storage.objects.get': {
		riskLevel: 'read',
		description: 'Retrieves an object or its metadata',
	},
	'storage.objects.getIamPolicy': {
		riskLevel: 'read',
		description: 'Returns an IAM policy for the specified object',
	},
	'storage.objects.insert': {
		riskLevel: 'write',
		description:
			'Upload an object to a bucket (`file` with the bytes and `name`), or create it from metadata only',
	},
	'storage.objects.list': {
		riskLevel: 'read',
		description:
			'Retrieves a list of objects matching the criteria (paged with pageToken / nextPageToken)',
	},
	'storage.objects.move': {
		riskLevel: 'write',
		description:
			'Moves the source object to the destination object in the same bucket',
	},
	'storage.objects.patch': {
		riskLevel: 'write',
		description: "Patches an object's metadata",
	},
	'storage.objects.restore': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Restores a soft-deleted object',
	},
	'storage.objects.rewrite': {
		riskLevel: 'write',
		description:
			'Rewrites a source object to a destination object. Optionally overrides metadata',
	},
	'storage.objects.setIamPolicy': {
		riskLevel: 'write',
		description: 'Updates an IAM policy for the specified object',
	},
	'storage.objects.testIamPermissions': {
		riskLevel: 'read',
		description:
			'Tests a set of permissions on the given object to see which, if any, are held by the caller',
	},
	'storage.objects.update': {
		riskLevel: 'write',
		description: "Updates an object's metadata",
	},
	'storage.objects.viewFullContext': {
		riskLevel: 'read',
		description:
			'Retrieves a specific object context with its extended data for a given object',
	},
	'storageBuckets.buckets.addFirebase': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Links a Google Cloud Storage bucket to a Firebase project',
	},
	'storageBuckets.buckets.get': {
		riskLevel: 'read',
		description: 'Gets a single linked storage bucket',
	},
	'storageBuckets.buckets.list': {
		riskLevel: 'read',
		description:
			'Lists the linked storage buckets for a project (paged with pageToken / nextPageToken)',
	},
	'storageBuckets.buckets.removeFirebase': {
		riskLevel: 'write',
		description:
			'Unlinks a linked Google Cloud Storage bucket from a Firebase project',
	},
	'storageBuckets.defaultBucket.create': {
		riskLevel: 'write',
		description:
			'Creates a Spark tier-eligible Cloud Storage bucket and links it to your Firebase project. If the default bucket already exists, this method will re-link it to your Firebase project',
	},
	'storageBuckets.projects.deleteDefaultBucket': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Unlinks and deletes the default bucket',
	},
	'storageBuckets.projects.getDefaultBucket': {
		riskLevel: 'read',
		description: 'Gets the default bucket',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof firebaseEndpointsNested>;
