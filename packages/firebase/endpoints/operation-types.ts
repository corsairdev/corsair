// Generated from Google's discovery documents for the Firebase APIs
// (fetched 2026-11-27); firebase-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput, FileOutput } from 'corsair/http';

export type FirebaseJsonValue =
	| null
	| boolean
	| number
	| string
	| FirebaseJsonValue[]
	| { [key: string]: FirebaseJsonValue | undefined };

export const FIREBASE_OPERATION_IDS = [
	'appCheck.apps.appAttestConfig.batchGet',
	'appCheck.apps.appAttestConfig.get',
	'appCheck.apps.appAttestConfig.patch',
	'appCheck.apps.debugTokens.create',
	'appCheck.apps.debugTokens.delete',
	'appCheck.apps.debugTokens.get',
	'appCheck.apps.debugTokens.list',
	'appCheck.apps.debugTokens.patch',
	'appCheck.apps.deviceCheckConfig.batchGet',
	'appCheck.apps.deviceCheckConfig.get',
	'appCheck.apps.deviceCheckConfig.patch',
	'appCheck.apps.exchangeAppAttestAssertion',
	'appCheck.apps.exchangeAppAttestAttestation',
	'appCheck.apps.exchangeCustomToken',
	'appCheck.apps.exchangeDebugToken',
	'appCheck.apps.exchangeDeviceCheckToken',
	'appCheck.apps.exchangePlayIntegrityToken',
	'appCheck.apps.exchangeRecaptchaEnterpriseToken',
	'appCheck.apps.exchangeRecaptchaV3Token',
	'appCheck.apps.generateAppAttestChallenge',
	'appCheck.apps.generatePlayIntegrityChallenge',
	'appCheck.apps.mintAppCheckToken',
	'appCheck.apps.playIntegrityConfig.batchGet',
	'appCheck.apps.playIntegrityConfig.get',
	'appCheck.apps.playIntegrityConfig.patch',
	'appCheck.apps.recaptchaEnterpriseConfig.batchGet',
	'appCheck.apps.recaptchaEnterpriseConfig.get',
	'appCheck.apps.recaptchaEnterpriseConfig.patch',
	'appCheck.apps.recaptchaV3Config.batchGet',
	'appCheck.apps.recaptchaV3Config.get',
	'appCheck.apps.recaptchaV3Config.patch',
	'appCheck.jwks.get',
	'appCheck.oauthClients.exchangeAppAttestAssertion',
	'appCheck.oauthClients.exchangeAppAttestAttestation',
	'appCheck.oauthClients.exchangeDebugToken',
	'appCheck.oauthClients.generateAppAttestChallenge',
	'appCheck.services.batchUpdate',
	'appCheck.services.get',
	'appCheck.services.list',
	'appCheck.services.patch',
	'appCheck.services.resourcePolicies.batchUpdate',
	'appCheck.services.resourcePolicies.create',
	'appCheck.services.resourcePolicies.delete',
	'appCheck.services.resourcePolicies.get',
	'appCheck.services.resourcePolicies.list',
	'appCheck.services.resourcePolicies.patch',
	'appDistribution.apps.getAabInfo',
	'appDistribution.apps.releases.batchDelete',
	'appDistribution.apps.releases.distribute',
	'appDistribution.apps.releases.feedbackReports.delete',
	'appDistribution.apps.releases.feedbackReports.get',
	'appDistribution.apps.releases.feedbackReports.list',
	'appDistribution.apps.releases.get',
	'appDistribution.apps.releases.list',
	'appDistribution.apps.releases.operations.cancel',
	'appDistribution.apps.releases.operations.delete',
	'appDistribution.apps.releases.operations.get',
	'appDistribution.apps.releases.operations.list',
	'appDistribution.apps.releases.operations.wait',
	'appDistribution.apps.releases.patch',
	'appDistribution.groups.batchJoin',
	'appDistribution.groups.batchLeave',
	'appDistribution.groups.create',
	'appDistribution.groups.delete',
	'appDistribution.groups.get',
	'appDistribution.groups.list',
	'appDistribution.groups.patch',
	'appDistribution.media.upload',
	'appDistribution.testers.batchAdd',
	'appDistribution.testers.batchRemove',
	'appDistribution.testers.list',
	'appDistribution.testers.patch',
	'auth.accounts.createAuthUri',
	'auth.accounts.delete',
	'auth.accounts.issueSamlResponse',
	'auth.accounts.lookup',
	'auth.accounts.resetPassword',
	'auth.accounts.sendOobCode',
	'auth.accounts.sendVerificationCode',
	'auth.accounts.signInWithCustomToken',
	'auth.accounts.signInWithEmailLink',
	'auth.accounts.signInWithGameCenter',
	'auth.accounts.signInWithIdp',
	'auth.accounts.signInWithPassword',
	'auth.accounts.signInWithPhoneNumber',
	'auth.accounts.signUp',
	'auth.accounts.update',
	'auth.accounts.verifyIosClient',
	'auth.getProjects',
	'auth.getPublicKeys',
	'auth.getRecaptchaParams',
	'auth.getSessionCookiePublicKeys',
	'auth.projects.accounts.batchCreate',
	'auth.projects.accounts.batchDelete',
	'auth.projects.accounts.batchGet',
	'auth.projects.accounts.create',
	'auth.projects.accounts.delete',
	'auth.projects.accounts.lookup',
	'auth.projects.accounts.query',
	'auth.projects.accounts.sendOobCode',
	'auth.projects.accounts.update',
	'auth.projects.createSessionCookie',
	'auth.projects.queryAccounts',
	'auth.projects.tenants.accounts.batchCreate',
	'auth.projects.tenants.accounts.batchDelete',
	'auth.projects.tenants.accounts.batchGet',
	'auth.projects.tenants.accounts.create',
	'auth.projects.tenants.accounts.delete',
	'auth.projects.tenants.accounts.lookup',
	'auth.projects.tenants.accounts.query',
	'auth.projects.tenants.accounts.sendOobCode',
	'auth.projects.tenants.accounts.update',
	'auth.projects.tenants.createSessionCookie',
	'authAdmin.accounts.mfaEnrollment.finalize',
	'authAdmin.accounts.mfaEnrollment.start',
	'authAdmin.accounts.mfaEnrollment.withdraw',
	'authAdmin.accounts.mfaSignIn.finalize',
	'authAdmin.accounts.mfaSignIn.start',
	'authAdmin.accounts.revokeToken',
	'authAdmin.defaultSupportedIdpConfigs.create',
	'authAdmin.defaultSupportedIdpConfigs.delete',
	'authAdmin.defaultSupportedIdpConfigs.get',
	'authAdmin.defaultSupportedIdpConfigs.list',
	'authAdmin.defaultSupportedIdpConfigs.patch',
	'authAdmin.defaultSupportedIdps.list',
	'authAdmin.getPasswordPolicy',
	'authAdmin.getRecaptchaConfig',
	'authAdmin.identityPlatform.initializeAuth',
	'authAdmin.inboundSamlConfigs.create',
	'authAdmin.inboundSamlConfigs.delete',
	'authAdmin.inboundSamlConfigs.get',
	'authAdmin.inboundSamlConfigs.list',
	'authAdmin.inboundSamlConfigs.patch',
	'authAdmin.oauthIdpConfigs.create',
	'authAdmin.oauthIdpConfigs.delete',
	'authAdmin.oauthIdpConfigs.get',
	'authAdmin.oauthIdpConfigs.list',
	'authAdmin.oauthIdpConfigs.patch',
	'authAdmin.projects.getConfig',
	'authAdmin.projects.updateConfig',
	'authAdmin.tenants.create',
	'authAdmin.tenants.defaultSupportedIdpConfigs.create',
	'authAdmin.tenants.defaultSupportedIdpConfigs.delete',
	'authAdmin.tenants.defaultSupportedIdpConfigs.get',
	'authAdmin.tenants.defaultSupportedIdpConfigs.list',
	'authAdmin.tenants.defaultSupportedIdpConfigs.patch',
	'authAdmin.tenants.delete',
	'authAdmin.tenants.get',
	'authAdmin.tenants.getIamPolicy',
	'authAdmin.tenants.inboundSamlConfigs.create',
	'authAdmin.tenants.inboundSamlConfigs.delete',
	'authAdmin.tenants.inboundSamlConfigs.get',
	'authAdmin.tenants.inboundSamlConfigs.list',
	'authAdmin.tenants.inboundSamlConfigs.patch',
	'authAdmin.tenants.list',
	'authAdmin.tenants.oauthIdpConfigs.create',
	'authAdmin.tenants.oauthIdpConfigs.delete',
	'authAdmin.tenants.oauthIdpConfigs.get',
	'authAdmin.tenants.oauthIdpConfigs.list',
	'authAdmin.tenants.oauthIdpConfigs.patch',
	'authAdmin.tenants.patch',
	'authAdmin.tenants.setIamPolicy',
	'authAdmin.tenants.testIamPermissions',
	'database.delete',
	'database.get',
	'database.push',
	'database.rules.get',
	'database.rules.set',
	'database.set',
	'database.update',
	'databaseInstances.locations.instances.create',
	'databaseInstances.locations.instances.delete',
	'databaseInstances.locations.instances.disable',
	'databaseInstances.locations.instances.get',
	'databaseInstances.locations.instances.list',
	'databaseInstances.locations.instances.reenable',
	'databaseInstances.locations.instances.undelete',
	'firestore.databases.backupSchedules.create',
	'firestore.databases.backupSchedules.delete',
	'firestore.databases.backupSchedules.get',
	'firestore.databases.backupSchedules.list',
	'firestore.databases.backupSchedules.patch',
	'firestore.databases.bulkDeleteDocuments',
	'firestore.databases.changeStreams.create',
	'firestore.databases.changeStreams.delete',
	'firestore.databases.changeStreams.get',
	'firestore.databases.changeStreams.list',
	'firestore.databases.clone',
	'firestore.databases.collectionGroups.fields.get',
	'firestore.databases.collectionGroups.fields.list',
	'firestore.databases.collectionGroups.fields.patch',
	'firestore.databases.collectionGroups.indexes.create',
	'firestore.databases.collectionGroups.indexes.delete',
	'firestore.databases.collectionGroups.indexes.get',
	'firestore.databases.collectionGroups.indexes.list',
	'firestore.databases.create',
	'firestore.databases.delete',
	'firestore.databases.documents.batchGet',
	'firestore.databases.documents.batchWrite',
	'firestore.databases.documents.beginTransaction',
	'firestore.databases.documents.commit',
	'firestore.databases.documents.createDocument',
	'firestore.databases.documents.delete',
	'firestore.databases.documents.executePipeline',
	'firestore.databases.documents.get',
	'firestore.databases.documents.list',
	'firestore.databases.documents.listCollectionIds',
	'firestore.databases.documents.listDocuments',
	'firestore.databases.documents.partitionQuery',
	'firestore.databases.documents.patch',
	'firestore.databases.documents.rollback',
	'firestore.databases.documents.runAggregationQuery',
	'firestore.databases.documents.runQuery',
	'firestore.databases.exportDocuments',
	'firestore.databases.get',
	'firestore.databases.importDocuments',
	'firestore.databases.list',
	'firestore.databases.operations.cancel',
	'firestore.databases.operations.delete',
	'firestore.databases.operations.get',
	'firestore.databases.operations.list',
	'firestore.databases.patch',
	'firestore.databases.restore',
	'firestore.databases.userCreds.create',
	'firestore.databases.userCreds.delete',
	'firestore.databases.userCreds.disable',
	'firestore.databases.userCreds.enable',
	'firestore.databases.userCreds.get',
	'firestore.databases.userCreds.list',
	'firestore.databases.userCreds.resetPassword',
	'firestore.locations.backups.delete',
	'firestore.locations.backups.get',
	'firestore.locations.backups.list',
	'firestore.locations.get',
	'firestore.locations.list',
	'hosting.operations.get',
	'hosting.sites.channels.create',
	'hosting.sites.channels.delete',
	'hosting.sites.channels.get',
	'hosting.sites.channels.list',
	'hosting.sites.channels.patch',
	'hosting.sites.channels.releases.create',
	'hosting.sites.channels.releases.get',
	'hosting.sites.channels.releases.list',
	'hosting.sites.create',
	'hosting.sites.customDomains.create',
	'hosting.sites.customDomains.delete',
	'hosting.sites.customDomains.get',
	'hosting.sites.customDomains.list',
	'hosting.sites.customDomains.operations.get',
	'hosting.sites.customDomains.operations.list',
	'hosting.sites.customDomains.patch',
	'hosting.sites.customDomains.undelete',
	'hosting.sites.delete',
	'hosting.sites.domains.create',
	'hosting.sites.domains.delete',
	'hosting.sites.domains.get',
	'hosting.sites.domains.list',
	'hosting.sites.domains.update',
	'hosting.sites.get',
	'hosting.sites.getConfig',
	'hosting.sites.list',
	'hosting.sites.patch',
	'hosting.sites.releases.create',
	'hosting.sites.releases.get',
	'hosting.sites.releases.list',
	'hosting.sites.updateConfig',
	'hosting.sites.versions.clone',
	'hosting.sites.versions.create',
	'hosting.sites.versions.delete',
	'hosting.sites.versions.files.list',
	'hosting.sites.versions.get',
	'hosting.sites.versions.list',
	'hosting.sites.versions.patch',
	'hosting.sites.versions.populateFiles',
	'management.androidApps.create',
	'management.androidApps.get',
	'management.androidApps.getConfig',
	'management.androidApps.list',
	'management.androidApps.patch',
	'management.androidApps.remove',
	'management.androidApps.sha.create',
	'management.androidApps.sha.delete',
	'management.androidApps.sha.list',
	'management.androidApps.undelete',
	'management.availableProjects.list',
	'management.iosApps.create',
	'management.iosApps.get',
	'management.iosApps.getConfig',
	'management.iosApps.list',
	'management.iosApps.patch',
	'management.iosApps.remove',
	'management.iosApps.undelete',
	'management.operations.get',
	'management.projects.addFirebase',
	'management.projects.addGoogleAnalytics',
	'management.projects.get',
	'management.projects.getAdminSdkConfig',
	'management.projects.getAnalyticsDetails',
	'management.projects.list',
	'management.projects.patch',
	'management.projects.removeAnalytics',
	'management.projects.searchApps',
	'management.webApps.create',
	'management.webApps.get',
	'management.webApps.getConfig',
	'management.webApps.list',
	'management.webApps.patch',
	'management.webApps.remove',
	'management.webApps.undelete',
	'messaging.messages.send',
	'messaging.registrations.topicSubscriptions.create',
	'messaging.registrations.topicSubscriptions.delete',
	'messaging.registrations.topicSubscriptions.get',
	'messaging.registrations.topicSubscriptions.list',
	'messaging.registrations.topicSubscriptions.patch',
	'remoteConfig.namespaces.experiments.delete',
	'remoteConfig.namespaces.experiments.get',
	'remoteConfig.namespaces.experiments.list',
	'remoteConfig.namespaces.fetch',
	'remoteConfig.namespaces.get',
	'remoteConfig.namespaces.getConditionOrder',
	'remoteConfig.namespaces.getRemoteConfig',
	'remoteConfig.namespaces.getServerRemoteConfig',
	'remoteConfig.namespaces.list',
	'remoteConfig.namespaces.remoteConfig.downloadDefaults',
	'remoteConfig.namespaces.remoteConfig.listVersions',
	'remoteConfig.namespaces.remoteConfig.rollback',
	'remoteConfig.namespaces.remoteConfigConditions.create',
	'remoteConfig.namespaces.remoteConfigConditions.delete',
	'remoteConfig.namespaces.remoteConfigConditions.get',
	'remoteConfig.namespaces.remoteConfigConditions.list',
	'remoteConfig.namespaces.remoteConfigConditions.patch',
	'remoteConfig.namespaces.remoteConfigParameterGroups.create',
	'remoteConfig.namespaces.remoteConfigParameterGroups.delete',
	'remoteConfig.namespaces.remoteConfigParameterGroups.get',
	'remoteConfig.namespaces.remoteConfigParameterGroups.list',
	'remoteConfig.namespaces.remoteConfigParameterGroups.patch',
	'remoteConfig.namespaces.remoteConfigParameters.create',
	'remoteConfig.namespaces.remoteConfigParameters.delete',
	'remoteConfig.namespaces.remoteConfigParameters.get',
	'remoteConfig.namespaces.remoteConfigParameters.list',
	'remoteConfig.namespaces.remoteConfigParameters.patch',
	'remoteConfig.namespaces.rollouts.delete',
	'remoteConfig.namespaces.rollouts.get',
	'remoteConfig.namespaces.rollouts.list',
	'remoteConfig.namespaces.updateConditionOrder',
	'remoteConfig.namespaces.updateRemoteConfig',
	'remoteConfig.projects.getRemoteConfig',
	'remoteConfig.projects.updateRemoteConfig',
	'remoteConfig.remoteConfig.downloadDefaults',
	'remoteConfig.remoteConfig.listVersions',
	'remoteConfig.remoteConfig.rollback',
	'rules.projects.test',
	'rules.releases.create',
	'rules.releases.delete',
	'rules.releases.get',
	'rules.releases.getExecutable',
	'rules.releases.list',
	'rules.releases.patch',
	'rules.rulesets.create',
	'rules.rulesets.delete',
	'rules.rulesets.get',
	'rules.rulesets.list',
	'storage.buckets.delete',
	'storage.buckets.get',
	'storage.buckets.getIamPolicy',
	'storage.buckets.getStorageLayout',
	'storage.buckets.insert',
	'storage.buckets.list',
	'storage.buckets.lockRetentionPolicy',
	'storage.buckets.operations.advanceRelocateBucket',
	'storage.buckets.operations.cancel',
	'storage.buckets.operations.get',
	'storage.buckets.operations.list',
	'storage.buckets.patch',
	'storage.buckets.relocate',
	'storage.buckets.restore',
	'storage.buckets.setIamPolicy',
	'storage.buckets.testIamPermissions',
	'storage.buckets.update',
	'storage.objects.bulkRestore',
	'storage.objects.compose',
	'storage.objects.copy',
	'storage.objects.delete',
	'storage.objects.download',
	'storage.objects.get',
	'storage.objects.getIamPolicy',
	'storage.objects.insert',
	'storage.objects.list',
	'storage.objects.move',
	'storage.objects.patch',
	'storage.objects.restore',
	'storage.objects.rewrite',
	'storage.objects.setIamPolicy',
	'storage.objects.testIamPermissions',
	'storage.objects.update',
	'storage.objects.viewFullContext',
	'storageBuckets.buckets.addFirebase',
	'storageBuckets.buckets.get',
	'storageBuckets.buckets.list',
	'storageBuckets.buckets.removeFirebase',
	'storageBuckets.defaultBucket.create',
	'storageBuckets.projects.deleteDefaultBucket',
	'storageBuckets.projects.getDefaultBucket',
] as const;

export type FirebaseOperationId = (typeof FIREBASE_OPERATION_IDS)[number];

/** Contains metadata about the user who performed an action, such as creating a release or finalizing a version. */
export type FirebaseActingUserInput = {
	/** The email address of the user when the user performed the action. */
	email?: string;
	/** A profile image URL for the user. May not be present if the user has changed their email address or deleted their account. */
	imageUrl?: string;
};

/** Defines an aggregation that produces a single result. */
export type FirebaseAggregationInput = {
	/** Sum aggregator. */
	sum?: FirebaseSumInput;
	/** Average aggregator. */
	avg?: FirebaseAvgInput;
	/** Count aggregator. */
	count?: FirebaseCountInput;
	/** Optional. Optional name of the field to store the result of the aggregation into. If not provided, Firestore will pick a default name following the format `field_`. For example: ``` AGGREGATE COUNT_UP_TO(1) AS count_up_to_1, COUNT_UP_TO(2), COUNT_UP_TO(3) AS count_up_to_3, COUNT(*) OVER ( ... */
	alias?: string;
};

/** A Background Sync message that is sent to Android devices. */
export type FirebaseAndroidBackgroundSyncMessageInput = Record<
	string,
	FirebaseJsonValue
>;

/** Android specific options for messages sent through [FCM connection server](https://goo.gl/4GLdUl). */
export type FirebaseAndroidConfigInput = {
	/** How long (in seconds) the message should be kept in FCM storage if the device is offline. The maximum time to live supported is 4 weeks, and the default value is 4 weeks if not set. Set it to 0 if want to send the message immediately. */
	ttl?: string;
	/** Notification to send to Android devices. */
	notification?: FirebaseAndroidNotificationInput;
	/** Optional. If set to true, messages will be allowed to be delivered to the app while the device is connected over a restricted satellite network. */
	restrictedSatelliteOk?: boolean;
	/** Message priority. Can take "normal" and "high" values. For more information, see [Setting the priority of a message](https://firebase.google.com/docs/cloud-messaging/customize-messages/setting-message-priority). */
	priority?: 'NORMAL' | 'HIGH';
	/** Options for features provided by the FCM SDK for Android. */
	fcmOptions?: FirebaseAndroidFcmOptionsInput;
	/** Package name of the application where the registration token must match in order to receive the message. */
	restrictedPackageName?: string;
	/** Arbitrary key/value payload. If present, it will override google.firebase.fcm.v1.Message.data. */
	data?: Record<string, string>;
	/** An identifier of a group of messages that can be collapsed, so that only the last message gets sent when delivery can be resumed. A maximum of 4 different collapse keys is allowed at any given time. */
	collapseKey?: string;
	/** Optional. If set to true, messages will be allowed to be delivered to the app while the device is in direct boot mode. See [Support Direct Boot mode](https://developer.android.com/training/articles/direct-boot). */
	directBootOk?: boolean;
	/** Optional. If set to true, messages will be allowed to be delivered to the app while the device is in bandwidth constrained mode. This should only be enabled when the app has been tested to properly handle messages in bandwidth constrained mode. */
	bandwidthConstrainedOk?: boolean;
};

/** Android specific V2 options for messages sent through [FCM connection server](https://goo.gl/4GLdUl). This is a v2 version of the AndroidConfig message and will replace it in the v2 API. */
export type FirebaseAndroidConfigV2Input = {
	/** Options for features provided by the FCM SDK for Android. If present, it will override google.firebase.fcm.v1.Message.fcm_options. */
	fcmOptions?: FirebaseAndroidFcmOptionsInput;
	/** Optional. If set to true, messages will be allowed to be delivered to the app while the device is connected over a restricted satellite network. */
	restrictedSatelliteOk?: boolean;
	/** Optional. User-facing notification to send to Android devices. These messages are delivered immediately and are not delayed by battery optimizations. */
	remoteNotification?: FirebaseAndroidRemoteNotificationInput;
	/** Arbitrary key/value payload. If present, it will override google.firebase.fcm.v1.Message.data. */
	data?: Record<string, string>;
	/** An identifier of a group of messages that can be collapsed, so that only the last message gets sent when delivery can be resumed. A maximum of 4 different collapse keys is allowed at any given time. */
	collapseKey?: string;
	/** Optional. Non-urgent background sync message to send to Android devices. Delivery of these messages may be delayed or batched to optimize for battery. */
	backgroundSync?: FirebaseAndroidBackgroundSyncMessageInput;
	/** Package name of the application where the registration token must match in order to receive the message. */
	restrictedPackageName?: string;
	/** How long (in seconds) the message should be kept in FCM storage if the device is offline. The maximum time to live supported is 4 weeks, and the default value is 4 weeks if not set. Set it to 0 if want to send the message immediately. */
	ttl?: string;
	/** Optional. If set to true, messages will be allowed to be delivered to the app while the device is in bandwidth constrained mode. This should only be enabled when the app has been tested to properly handle messages in bandwidth constrained mode. */
	bandwidthConstrainedOk?: boolean;
	/** Optional. If set to true, messages will be allowed to be delivered to the app while the device is in direct boot mode. See [Support Direct Boot mode](https://developer.android.com/training/articles/direct-boot). */
	directBootOk?: boolean;
};

/** Options for features provided by the FCM SDK for Android. */
export type FirebaseAndroidFcmOptionsInput = {
	/** Label associated with the message's analytics data. */
	analyticsLabel?: string;
};

/** Notification to send to android devices. */
export type FirebaseAndroidNotificationInput = {
	/** Settings to control the notification's LED blinking rate and color if LED is available on the device. The total blinking time is controlled by the OS. */
	lightSettings?: FirebaseLightSettingsInput;
	/** Set whether or not this notification is relevant only to the current device. Some notifications can be bridged to other devices for remote display, such as a Wear OS watch. This hint can be set to recommend this notification not be bridged. */
	localOnly?: boolean;
	/** The notification's title. If present, it will override google.firebase.fcm.v1.Notification.title. */
	title?: string;
	/** If set to true, use the Android framework's default LED light settings for the notification. Default values are specified in [config.xml](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml). */
	defaultLightSettings?: boolean;
	/** Optional. If set, display notifications delivered to the device will be handled by the app instead of the proxy. */
	bypassProxyNotification?: boolean;
	/** Set the [Notification.visibility](https://developer.android.com/reference/android/app/Notification.html#visibility) of the notification. */
	visibility?: 'VISIBILITY_UNSPECIFIED' | 'PRIVATE' | 'PUBLIC' | 'SECRET';
	/** Variable string values to be used in place of the format specifiers in body_loc_key to use to localize the body text to the user's current localization. See [Formatting and Styling](https://goo.gl/MalYE3) for more information. */
	bodyLocArgs?: Array<string>;
	/** Sets the "ticker" text, which is sent to accessibility services. Prior to API level 21 (`Lollipop`), sets the text that is displayed in the status bar when the notification first arrives. */
	ticker?: string;
	/** If set to true, use the Android framework's default vibrate pattern for the notification. Default values are specified in [config.xml](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml). */
	defaultVibrateTimings?: boolean;
	/** Contains the URL of an image that is going to be displayed in a notification. If present, it will override google.firebase.fcm.v1.Notification.image. */
	image?: string;
	/** The action associated with a user click on the notification. If specified, an activity with a matching intent filter is launched when a user clicks on the notification. */
	clickAction?: string;
	/** Setting to control when a notification may be proxied. */
	proxy?: 'PROXY_UNSPECIFIED' | 'ALLOW' | 'DENY' | 'IF_PRIORITY_LOWERED';
	/** Set the time that the event in the notification occurred. Notifications in the panel are sorted by this time. A point in time is represented using [protobuf.Timestamp](https://developers.google.com/protocol-buffers/docs/reference/java/com/google/protobuf/Timestamp). */
	eventTime?: string;
	/** When set to false or unset, the notification is automatically dismissed when the user clicks it in the panel. When set to true, the notification persists even when the user clicks it. */
	sticky?: boolean;
	/** If set to true, use the Android framework's default sound for the notification. Default values are specified in [config.xml](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml). */
	defaultSound?: boolean;
	/** The sound to play when the device receives the notification. Supports "default" or the filename of a sound resource bundled in the app. Sound files must reside in /res/raw/. */
	sound?: string;
	/** Identifier used to replace existing notifications in the notification drawer. If not specified, each request creates a new notification. If specified and a notification with the same tag is already being shown, the new notification replaces the existing one in the notification drawer. */
	tag?: string;
	/** The key to the title string in the app's string resources to use to localize the title text to the user's current localization. See [String Resources](https://goo.gl/NdFZGI) for more information. */
	titleLocKey?: string;
	/** The notification's body text. If present, it will override google.firebase.fcm.v1.Notification.body. */
	body?: string;
	/** The [notification's channel id](https://developer.android.com/guide/topics/ui/notifiers/notifications#ManageChannels) (new in Android O). The app must create a channel with this channel ID before any notification with this channel ID is received. */
	channelId?: string;
	/** Set the relative priority for this notification. Priority is an indication of how much of the user's attention should be consumed by this notification. */
	notificationPriority?:
		| 'PRIORITY_UNSPECIFIED'
		| 'PRIORITY_MIN'
		| 'PRIORITY_LOW'
		| 'PRIORITY_DEFAULT'
		| 'PRIORITY_HIGH'
		| 'PRIORITY_MAX';
	/** Sets the number of items this notification represents. May be displayed as a badge count for launchers that support badging. See [Notification Badge](https://developer.android.com/training/notify-user/badges). */
	notificationCount?: number;
	/** The notification's icon color, expressed in #rrggbb format. */
	color?: string;
	/** The notification's icon. Sets the notification icon to myicon for drawable resource myicon. If you don't send this key in the request, FCM displays the launcher icon specified in your app manifest. */
	icon?: string;
	/** The key to the body string in the app's string resources to use to localize the body text to the user's current localization. See [String Resources](https://goo.gl/NdFZGI) for more information. */
	bodyLocKey?: string;
	/** Set the vibration pattern to use. Pass in an array of [protobuf.Duration](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Duration) to turn on or off the vibrator. The first value indicates the `Duration` to wait before turning the vibrator on. */
	vibrateTimings?: Array<string>;
	/** Variable string values to be used in place of the format specifiers in title_loc_key to use to localize the title text to the user's current localization. See [Formatting and Styling](https://goo.gl/MalYE3) for more information. */
	titleLocArgs?: Array<string>;
};

/** Notification v2 to send to Android devices. This is a v2 version of the AndroidNotification message and will replace it in the v2 API. */
export type FirebaseAndroidNotificationV2Input = {
	/** The [notification's channel id](https://developer.android.com/guide/topics/ui/notifiers/notifications#ManageChannels) (new in Android O). The app must create a channel with this channel ID before any notification with this channel ID is received. */
	channelId?: string;
	/** Settings to control the notification's LED blinking rate and color if LED is available on the device. The total blinking time is controlled by the OS. */
	lightSettings?: FirebaseGoogleFirebaseFcmV1AndroidNotificationV2LightSettingsInput;
	/** The notification's icon color, expressed in #rrggbb format. */
	color?: string;
	/** Set the relative priority for this notification. Priority is an indication of how much of the user's attention should be consumed by this notification. */
	notificationPriority?:
		| 'PRIORITY_UNSPECIFIED'
		| 'PRIORITY_MIN'
		| 'PRIORITY_LOW'
		| 'PRIORITY_DEFAULT'
		| 'PRIORITY_HIGH'
		| 'PRIORITY_MAX';
	/** When set to false or unset, the notification is automatically dismissed when the user clicks it in the panel. When set to true, the notification persists even when the user clicks it. */
	sticky?: boolean;
	/** Optional. Identifier used to replace existing notifications in the notification drawer. It is used in conjunction with `tag` to form a unique identifier `(tag, id)` within the app. If not specified, each request creates a new notification. */
	id?: number;
	/** Variable string values to be used in place of the format specifiers in body_loc_key to use to localize the body text to the user's current localization. See [Formatting and Styling](https://goo.gl/MalYE3) for more information. */
	bodyLocArgs?: Array<string>;
	/** Set the time that the event in the notification occurred. Notifications in the panel are sorted by this time. A point in time is represented using [protobuf.Timestamp](https://developers.google.com/protocol-buffers/docs/reference/java/com/google/protobuf/Timestamp). */
	eventTime?: string;
	/** The sound to play when the device receives the notification. Supports "default" or the filename of a sound resource bundled in the app. Sound files must reside in /res/raw/. */
	sound?: string;
	/** Sets the number of items this notification represents. May be displayed as a badge count for launchers that support badging. See [Notification Badge](https://developer.android.com/training/notify-user/badges). */
	notificationCount?: number;
	/** An HTTPS URL of an image to display in the notification. If present, it overrides google.firebase.fcm.v1.Notification.image. */
	image?: string;
	/** The key to the body string in the app's string resources to use to localize the body text to the user's current localization. See [String Resources](https://goo.gl/NdFZGI) for more information. */
	bodyLocKey?: string;
	/** The notification's body text. If present, it will override google.firebase.fcm.v1.Notification.body. */
	body?: string;
	/** Variable string values to be used in place of the format specifiers in title_loc_key to use to localize the title text to the user's current localization. See [Formatting and Styling](https://goo.gl/MalYE3) for more information. */
	titleLocArgs?: Array<string>;
	/** If set to true, use the Android framework's default vibrate pattern for the notification. Default values are specified in [config.xml](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml). */
	defaultVibrateTimings?: boolean;
	/** The key to the title string in the app's string resources to use to localize the title text to the user's current localization. See [String Resources](https://goo.gl/NdFZGI) for more information. */
	titleLocKey?: string;
	/** Identifier used to replace existing notifications in the notification drawer. It is used in conjunction with `id` to form a unique identifier `(tag, id)` within the app. If not specified, each request creates a new notification. */
	tag?: string;
	/** The action associated with a user click on the notification. If specified, an activity with a matching intent filter is launched when a user clicks on the notification. */
	clickAction?: string;
	/** The notification's title. If present, it will override google.firebase.fcm.v1.Notification.title. */
	title?: string;
	/** The notification's icon. Sets the notification icon to myicon for drawable resource myicon. If you don't send this key in the request, FCM displays the launcher icon specified in your app manifest. */
	icon?: string;
	/** If set to true, use the Android framework's default LED light settings for the notification. Default values are specified in [config.xml](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml). */
	defaultLightSettings?: boolean;
	/** If set to true, use the Android framework's default sound for the notification. Default values are specified in [config.xml](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml). */
	defaultSound?: boolean;
	/** Sets the "ticker" text, which is sent to accessibility services. Prior to API level 21 (`Lollipop`), sets the text that is displayed in the status bar when the notification first arrives. */
	ticker?: string;
	/** Set the [Notification.visibility](https://developer.android.com/reference/android/app/Notification.html#visibility) of the notification. */
	visibility?: 'VISIBILITY_UNSPECIFIED' | 'PRIVATE' | 'PUBLIC' | 'SECRET';
	/** Set the vibration pattern to use. Pass in an array of [protobuf.Duration](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Duration) to turn on or off the vibrator. The first value indicates the `Duration` to wait before turning the vibrator on. */
	vibrateTimings?: Array<string>;
	/** Set whether or not this notification is relevant only to the current device. Some notifications can be bridged to other devices for remote display, such as a Wear OS watch. This hint can be set to recommend this notification not be bridged. */
	localOnly?: boolean;
};

/** A Remote Notification message that is sent to Android devices. */
export type FirebaseAndroidRemoteNotificationInput = {
	/** Optional. If set to `true`, this RemoteNotification message will be delivered to legacy V1 clients as a data message by omitting the google.firebase.fcm.v1.AndroidRemoteNotification.notification. This should only be enabled when migrating from legacy V1 data messages. */
	useAsV1DataMessage?: boolean;
	/** Optional. If set to true, the notification content can be updated by the app after the notification is received on the device. */
	mutableContent?: boolean;
	/** Optional. Notification to send to Android devices. */
	notification?: FirebaseAndroidNotificationV2Input;
};

/** [Apple Push Notification Service](https://goo.gl/MXRTPa) specific options. */
export type FirebaseApnsConfigInput = {
	/** Optional. [Apple Live Activity](https://developer.apple.com/design/human-interface-guidelines/live-activities) token to send updates to. This token can either be a push token or [push-to-start](https://developer.apple.com/documentation/activitykit/activity/pushtostarttoken) token from Apple. */
	liveActivityToken?: string;
	/** Options for features provided by the FCM SDK for iOS. */
	fcmOptions?: FirebaseApnsFcmOptionsInput;
	/** HTTP request headers defined in Apple Push Notification Service. Refer to [APNs request headers](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns) for supported headers such as `apns-expiration` and… */
	headers?: Record<string, string>;
	/** APNs payload as a JSON object, including both `aps` dictionary and custom payload. See [Payload Key Reference](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification). */
	payload?: Record<string, FirebaseJsonValue>;
};

/** Options for features provided by the FCM SDK for iOS. */
export type FirebaseApnsFcmOptionsInput = {
	/** Contains the URL of an image that is going to be displayed in a notification. If present, it will override google.firebase.fcm.v1.Notification.image. */
	image?: string;
	/** Label associated with the message's analytics data. */
	analyticsLabel?: string;
};

/** Arg matchers for the mock function. */
export type FirebaseArgInput = {
	/** Argument exactly matches value provided. */
	exactValue?: FirebaseJsonValue;
	/** Argument matches any value provided. */
	anyValue?: FirebaseRulesEmptyInput;
};

/** An array value. */
export type FirebaseArrayValueInput = {
	/** Values in the array. */
	values?: Array<FirebaseValueInput>;
};

/** Average of the values of the requested field. * Only numeric values will be aggregated. All non-numeric values including `NULL` are skipped. * If the aggregated values contain `NaN`, returns `NaN`. Infinity math follows IEEE-754 standards. * If the aggregated value set is empty, returns `NULL`. */
export type FirebaseAvgInput = {
	/** The field to aggregate on. */
	field?: FirebaseFieldReferenceInput;
};

/** An access-control entry. */
export type FirebaseBucketAccessControlInput = {
	/** The name of the bucket. */
	bucket?: string;
	/** The domain associated with the entity, if any. */
	domain?: string;
	/** The email address associated with the entity, if any. */
	email?: string;
	/** The entity holding the permission, in one of the following forms: - user-userId - user-email - group-groupId - group-email - domain-domain - project-team-projectId - allUsers - allAuthenticatedUsers Examples: - The user liz@example.com would be user-liz@example.com. */
	entity?: string;
	/** The ID for the entity, if any. */
	entityId?: string;
	/** HTTP 1.1 Entity tag for the access-control entry. */
	etag?: string;
	/** The ID of the access-control entry. */
	id?: string;
	/** The kind of item this is. For bucket access control entries, this is always storage#bucketAccessControl. */
	kind?: string;
	/** The project team associated with the entity, if any. */
	projectTeam?: {
		/** The project number. */
		projectNumber?: string;
		/** The team. */
		team?: string;
	};
	/** The access permission for the entity. */
	role?: string;
	/** The link to this access-control entry. */
	selfLink?: string;
};

/** Represents a DNS certificate challenge. */
export type FirebaseCertDnsChallengeInput = {
	/** The domain name upon which the DNS challenge must be satisfied. */
	domainName?: string;
	/** The value that must be present as a TXT record on the domain name to satisfy the challenge. */
	token?: string;
};

/** Represents an HTTP certificate challenge. */
export type FirebaseCertHttpChallengeInput = {
	/** The token to serve at the specified URL path to satisfy the certificate challenge. */
	token?: string;
	/** The URL path on which to serve the specified token to satisfy the certificate challenge. */
	path?: string;
};

/** A configured rewrite that directs requests to a Cloud Run service. If the Cloud Run service does not exist when setting or updating your Firebase Hosting configuration, then the request fails. */
export type FirebaseCloudRunRewriteInput = {
	/** Optional. User-provided region where the Cloud Run service is hosted. Defaults to `us-central1` if not supplied. */
	region?: string;
	/** Optional. User-provided TrafficConfig tag to send traffic to. When omitted, traffic is sent to the service-wide URI */
	tag?: string;
	/** Required. User-defined ID of the Cloud Run service. */
	serviceId?: string;
};

/** A selection of a collection, such as `messages as m1`. */
export type FirebaseCollectionSelectorInput = {
	/** When false, selects only collections that are immediate children of the `parent` specified in the containing `RunQueryRequest`. When true, selects all descendant collections. */
	allDescendants?: boolean;
	/** The collection ID. When set, selects only collections with this ID. */
	collectionId?: string;
};

/** Represents a color in the RGBA color space. This representation is designed for simplicity of conversion to and from color representations in various languages over compactness. */
export type FirebaseColorInput = {
	/** The amount of blue in the color as a value in the interval [0, 1]. */
	blue?: number;
	/** The amount of green in the color as a value in the interval [0, 1]. */
	green?: number;
	/** The fraction of this color that should be applied to the pixel. That is, the final pixel color is defined by the equation: `pixel color = alpha * (this color) + (1.0 - alpha) * (background color)` This means that a value of 1.0 corresponds to a solid color, whereas a value of 0.0 corresponds to a… */
	alpha?: number;
	/** The amount of red in the color as a value in the interval [0, 1]. */
	red?: number;
};

/** A filter that merges multiple other filters using the given operator. */
export type FirebaseCompositeFilterInput = {
	/** The operator for combining multiple filters. */
	op?: 'OPERATOR_UNSPECIFIED' | 'AND' | 'OR';
	/** The list of filters to combine. Requires: * At least one filter is present. */
	filters?: Array<FirebaseFilterInput>;
};

/** Count of documents that match the query. The `COUNT(*)` aggregation function operates on the entire document so it does not require a field reference. */
export type FirebaseCountInput = {
	/** Optional. Optional constraint on the maximum number of documents to count. This provides a way to set an upper bound on the number of documents to scan, limiting latency, and cost. Unspecified is interpreted as no bound. */
	upTo?: string | number;
};

/** A position in a query result set. */
export type FirebaseCursorInput = {
	/** The values that represent a position, in the order they appear in the order by clause of a query. Can contain fewer values than specified in the order by clause. */
	values?: Array<FirebaseValueInput>;
	/** If the position is just before or just after the given values, relative to the sort order defined by the query. */
	before?: boolean;
};

/** The request sent to the DisableDatabaseInstance method. */
export type FirebaseDisableDatabaseInstanceRequestInput = Record<
	string,
	FirebaseJsonValue
>;

/** A Firestore document. Must not exceed 1 MiB - 4 bytes. */
export type FirebaseDocumentInput = {
	/** The resource name of the document, for example `projects/{project_id}/databases/{database_id}/documents/{document_path}`. */
	name?: string;
	/** Output only. The time at which the document was last changed. This value is initially set to the `create_time` then increases monotonically with each change to the document. It can also be compared to values from other documents and the `read_time` of a query. */
	updateTime?: string;
	/** Output only. The time at which the document was created. This value increases monotonically when a document is deleted then recreated. It can also be compared to values from other documents and the `read_time` of a query. */
	createTime?: string;
	/** The document's fields. The map keys represent field names. Field names matching the regular expression `__.*__` are reserved. Reserved field names are forbidden except in certain documented contexts. The field names, represented as UTF-8, must not exceed 1,500 bytes and cannot be empty. */
	fields?: Record<string, FirebaseValueInput>;
};

/** A set of field paths on a document. Used to restrict a get or update operation on a document to a subset of its fields. This is different from standard field masks, as this is always scoped to a Document, and takes in account the dynamic nature of Value. */
export type FirebaseDocumentMaskInput = {
	/** The list of field paths in the mask. See Document.fields for a field path syntax reference. */
	fieldPaths?: Array<string>;
};

/** A transformation of a document. */
export type FirebaseDocumentTransformInput = {
	/** The list of transformations to apply to the fields of the document, in order. This must not be empty. */
	fieldTransforms?: Array<FirebaseFieldTransformInput>;
	/** The name of the document to transform. */
	document?: string;
};

/** The current certificate provisioning status information for a domain. */
export type FirebaseDomainProvisioningInput = {
	/** The TXT records (for the certificate challenge) that were found at the last DNS fetch. */
	certChallengeDiscoveredTxt?: Array<string>;
	/** The DNS challenge for generating a certificate. */
	certChallengeDns?: FirebaseCertDnsChallengeInput;
	/** The IPs found at the last DNS fetch. */
	discoveredIps?: Array<string>;
	/** The certificate provisioning status; updated when Firebase Hosting provisions an SSL certificate for the domain. */
	certStatus?:
		| 'CERT_STATUS_UNSPECIFIED'
		| 'CERT_PENDING'
		| 'CERT_MISSING'
		| 'CERT_PROCESSING'
		| 'CERT_PROPAGATING'
		| 'CERT_ACTIVE'
		| 'CERT_ERROR';
	/** The time at which the last DNS fetch occurred. */
	dnsFetchTime?: string;
	/** The list of IPs to which the domain is expected to resolve. */
	expectedIps?: Array<string>;
	/** The DNS record match status as of the last DNS fetch. */
	dnsStatus?:
		| 'DNS_STATUS_UNSPECIFIED'
		| 'DNS_PENDING'
		| 'DNS_MISSING'
		| 'DNS_PARTIAL_MATCH'
		| 'DNS_MATCH'
		| 'DNS_EXTRANEOUS_MATCH';
	/** The HTTP challenge for generating a certificate. */
	certChallengeHttp?: FirebaseCertHttpChallengeInput;
};

/** Defines the behavior of a domain-level redirect. Domain redirects preserve the path of the redirect but replace the requested domain with the one specified in the redirect configuration. */
export type FirebaseDomainRedirectInput = {
	/** Required. The domain name to redirect to. */
	domainName?: string;
	/** Required. The redirect status code. */
	type?: 'REDIRECT_TYPE_UNSPECIFIED' | 'MOVED_PERMANENTLY';
};

/** Information related to a parameter value managed by Firebase ABT. */
export type FirebaseExperimentValueInput = {
	/** The identifier that associates a parameter value to an Experiment in Firebase ABT. */
	experimentId?: string;
	/** Optional. Represents the server-side exposure evaluation. This value represents the fraction of users exposed to the experiment, ranging from 0 (0% exposure) to 100 (100% exposure), inclusive. */
	exposurePercent?: number;
	/** A repeated of variants associated with the Experiment. */
	variantValue?: Array<FirebaseExperimentVariantValueInput>;
};

/** Information about the variant for the Experiment. */
export type FirebaseExperimentVariantValueInput = {
	/** Optional. The user-specified value for this variant. Can be empty string. */
	value?: string;
	/** If this boolean is set, then fallback to the next parameter in the Template condition chain */
	noChange?: boolean;
	/** The variant identifier for the Experiment. */
	variantId?: string;
};

/** Explain options for the query. */
export type FirebaseExplainOptionsInput = {
	/** Optional. Whether to execute this query. When false (the default), the query will be planned, returning only metrics from the planning stages. When true, the query will be planned and executed, returning the full query results along with both planning and execution stage metrics. */
	analyze?: boolean;
};

/** Represents an expression text. Example: title: "User account presence" description: "Determines whether the request has a user account" expression: "size(request.user) > 0" */
export type FirebaseExprInput = {
	/** An optional description of the expression. This is a longer text which describes the expression, e.g. when hovered over it in a UI. */
	description?: string;
	/** Textual representation of an expression in Common Expression Language syntax. The application context of the containing message determines which well-known feature set of CEL is supported. */
	expression?: string;
	/** An optional string indicating the location of the expression for error reporting, e.g. a file name and a position in the file. */
	location?: string;
	/** An optional title for the expression, i.e. a short string describing its purpose. This can be used e.g. in UIs which allow to enter the expression. */
	title?: string;
};

/** Platform independent options for features provided by the FCM SDKs. */
export type FirebaseFcmOptionsInput = {
	/** Label associated with the message's analytics data. */
	analyticsLabel?: string;
};

/** A filter on a specific field. */
export type FirebaseFieldFilterInput = {
	/** The field to filter by. */
	field?: FirebaseFieldReferenceInput;
	/** The value to compare to. */
	value?: FirebaseValueInput;
	/** The operator to filter by. */
	op?:
		| 'OPERATOR_UNSPECIFIED'
		| 'LESS_THAN'
		| 'LESS_THAN_OR_EQUAL'
		| 'GREATER_THAN'
		| 'GREATER_THAN_OR_EQUAL'
		| 'EQUAL'
		| 'NOT_EQUAL'
		| 'ARRAY_CONTAINS'
		| 'IN'
		| 'ARRAY_CONTAINS_ANY'
		| 'NOT_IN';
};

/** A reference to a field in a document, ex: `stats.operations`. */
export type FirebaseFieldReferenceInput = {
	/** A reference to a field in a document. Requires: * MUST be a dot-delimited (`.`) string of segments, where each segment conforms to document field name limitations. */
	fieldPath?: string;
};

/** A transformation of a field of the document. */
export type FirebaseFieldTransformInput = {
	/** Adds the given value to the field's current value. This must be an integer or a double value. If the field is not an integer or double, or if the field does not yet exist, the transformation will set the field to the given value. */
	increment?: FirebaseValueInput;
	/** Sets the field to the given server value. */
	setToServerValue?: 'SERVER_VALUE_UNSPECIFIED' | 'REQUEST_TIME';
	/** Sets the field to the minimum of its current value and the given value. This must be an integer or a double value. If the field is not an integer or double, or if the field does not yet exist, the transformation will set the field to the input value. */
	minimum?: FirebaseValueInput;
	/** The path of the field. See Document.fields for the field path syntax reference. */
	fieldPath?: string;
	/** Sets the field to the maximum of its current value and the given value. This must be an integer or a double value. If the field is not an integer or double, or if the field does not yet exist, the transformation will set the field to the given value. */
	maximum?: FirebaseValueInput;
	/** Remove all of the given elements from the array in the field. If the field is not an array, or if the field does not yet exist, it is set to the empty array. Equivalent numbers of the different types (e.g. 3L and 3.0) are considered equal when deciding whether an element should be removed. */
	removeAllFromArray?: FirebaseArrayValueInput;
	/** Append the given elements in order if they are not already present in the current field value. If the field is not an array, or if the field does not yet exist, it is first set to the empty array. Equivalent numbers of different types (e.g. */
	appendMissingElements?: FirebaseArrayValueInput;
};

/** `File` containing source content. */
export type FirebaseFileInput = {
	/** Required. File name. */
	name?: string;
	/** Required. Textual Content. */
	content?: string;
	/** Fingerprint (e.g. github sha) associated with the `File`. (base64) */
	fingerprint?: string;
};

/** A filter. */
export type FirebaseFilterInput = {
	/** A filter that takes exactly one argument. */
	unaryFilter?: FirebaseUnaryFilterInput;
	/** A composite filter. */
	compositeFilter?: FirebaseCompositeFilterInput;
	/** A filter on a document field. */
	fieldFilter?: FirebaseFieldFilterInput;
};

/** Nearest Neighbors search config. The ordering provided by FindNearest supersedes the order_by stage. If multiple documents have the same vector distance, the returned document order is not guaranteed to be stable between queries. */
export type FirebaseFindNearestInput = {
	/** Required. The number of nearest neighbors to return. Must be a positive integer of no more than 1000. */
	limit?: number;
	/** Optional. Optional name of the field to output the result of the vector distance calculation. Must conform to document field name limitations. */
	distanceResultField?: string;
	/** Required. An indexed vector field to search upon. Only documents which contain vectors whose dimensionality match the query_vector can be returned. */
	vectorField?: FirebaseFieldReferenceInput;
	/** Required. The query vector that we are searching on. Must be a vector of no more than 2048 dimensions. */
	queryVector?: FirebaseValueInput;
	/** Optional. Option to specify a threshold for which no less similar documents will be returned. The behavior of the specified `distance_measure` will affect the meaning of the distance threshold. Since DOT_PRODUCT distances increase when the vectors are more similar, the comparison is inverted. */
	distanceThreshold?: number;
	/** Required. The distance measure to use, required. */
	distanceMeasure?:
		| 'DISTANCE_MEASURE_UNSPECIFIED'
		| 'EUCLIDEAN'
		| 'COSINE'
		| 'DOT_PRODUCT';
};

/** Mock function definition. Mocks must refer to a function declared by the target service. The type of the function args and result will be inferred at test time. If either the arg or result values are not compatible with function type declaration, the request will be considered invalid. */
export type FirebaseFunctionMockInput = {
	/** The list of `Arg` values to match. The order in which the arguments are provided is the order in which they must appear in the function invocation. */
	args?: Array<FirebaseArgInput>;
	/** The name of the function. The function name must match one provided by a service declaration. */
	function?: string;
	/** The mock result of the function call. */
	result?: FirebaseResultInput;
};

/** Information to read/write to blobstore2. */
export type FirebaseGdataBlobstore2InfoInput = {
	/** The blob generation id. */
	blobGeneration?: string | number;
	/** The blob id, e.g., /blobstore/prod/playground/scotty */
	blobId?: string;
	/** A serialized Object Fragment List Creation Info passed from Bigstore -> Scotty for a GCS upload. This field must never be consumed outside of Bigstore, and is not applicable to non-GCS media uploads. (base64) */
	uploadFragmentListCreationInfo?: string;
	/** The blob read token. Needed to read blobs that have not been replicated. Might not be available until the final call. */
	readToken?: string;
	/** Metadata passed from Blobstore -> Scotty for a new GCS upload. This is a signed, serialized blobstore2.BlobMetadataContainer proto which must never be consumed outside of Bigstore, and is not applicable to non-GCS media uploads. (base64) */
	uploadMetadataContainer?: string;
	/** A serialized External Read Token passed from Bigstore -> Scotty for a GCS download. This field must never be consumed outside of Bigstore, and is not applicable to non-GCS media uploads. (base64) */
	downloadExternalReadToken?: string;
	/** Read handle passed from Bigstore -> Scotty for a GCS download. This is a signed, serialized blobstore2.ReadHandle proto which must never be set outside of Bigstore, and is not applicable to non-GCS media downloads. (base64) */
	downloadReadHandle?: string;
};

/** A sequence of media data references representing composite data. Introduced to support Bigstore composite objects. For details, visit http://go/bigstore-composites. */
export type FirebaseGdataCompositeMediaInput = {
	/** MD5 hash for the payload. (base64) */
	md5Hash?: string;
	/** A binary data reference for a media download. Serves as a technology-agnostic binary reference in some Google infrastructure. This value is a serialized storage_cosmo.BinaryReference proto. */
	cosmoBinaryReference?: string;
	/** crc32.c hash for the payload. */
	crc32cHash?: number;
	/** Blobstore v1 reference, set if reference_type is BLOBSTORE_REF This should be the byte representation of a blobstore.BlobRef. Since Blobstore is deprecating v1, use blobstore2_info instead. For now, any v2 blob will also be represented in this field as v1 BlobRef. (base64) */
	blobRef?: string;
	/** Describes what the field reference contains. */
	referenceType?:
		| 'PATH'
		| 'BLOB_REF'
		| 'INLINE'
		| 'BIGSTORE_REF'
		| 'COSMO_BINARY_REFERENCE';
	/** Reference to a TI Blob, set if reference_type is BIGSTORE_REF. */
	objectId?: FirebaseGdataObjectIdInput;
	/** Path to the data, set if reference_type is PATH */
	path?: string;
	/** Size of the data, in bytes */
	length?: string | number;
	/** SHA-1 hash for the payload. (base64) */
	sha1Hash?: string;
	/** Media data, set if reference_type is INLINE (base64) */
	inline?: string;
	/** Blobstore v2 info, set if reference_type is BLOBSTORE_REF and it refers to a v2 blob. */
	blobstore2Info?: FirebaseGdataBlobstore2InfoInput;
};

/** Detailed Content-Type information from Scotty. The Content-Type of the media will typically be filled in by the header or Scotty's best_guess, but this extended information provides the backend with more information so that it can make a better decision if needed. */
export type FirebaseGdataContentTypeInfoInput = {
	/** The content type of the file derived from the file extension of the URL path. The URL path is assumed to represent a file name (which is typically only true for agents that are providing a REST API). */
	fromUrlPath?: string;
	/** Metadata information from Fusion ID detection. Serialized FusionIdDetectionMetadata proto. Only set if from_fusion_id is set. (base64) */
	fusionIdDetectionMetadata?: string;
	/** Scotty's best guess of what the content type of the file is. */
	bestGuess?: string;
	/** The content type of the file detected by Fusion ID. go/fusionid */
	fromFusionId?: string;
	/** The content type of the file as specified in the request headers, multipart headers, or RUPIO start request. */
	fromHeader?: string;
	/** The content type of the file derived by looking at specific bytes (i.e. "magic bytes") of the actual file. */
	fromBytes?: string;
	/** The content type of the file derived from the file extension of the original file name used by the client. */
	fromFileName?: string;
};

/** Backend response for a Diff get checksums response. For details on the Scotty Diff protocol, visit http://go/scotty-diff-protocol. */
export type FirebaseGdataDiffChecksumsResponseInput = {
	/** If set, calculate the checksums based on the contents and return them to the caller. */
	objectLocation?: FirebaseGdataCompositeMediaInput;
	/** Exactly one of these fields must be populated. If checksums_location is filled, the server will return the corresponding contents to the user. If object_location is filled, the server will calculate the checksums based on the content there and return that to the user. */
	checksumsLocation?: FirebaseGdataCompositeMediaInput;
	/** The chunk size of checksums. Must be a multiple of 256KB. */
	chunkSizeBytes?: string | number;
	/** The total size of the server object. */
	objectSizeBytes?: string | number;
	/** The object version of the object the checksums are being returned for. */
	objectVersion?: string;
};

/** Backend response for a Diff download response. For details on the Scotty Diff protocol, visit http://go/scotty-diff-protocol. */
export type FirebaseGdataDiffDownloadResponseInput = {
	/** The original object location. */
	objectLocation?: FirebaseGdataCompositeMediaInput;
};

/** A Diff upload request. For details on the Scotty Diff protocol, visit http://go/scotty-diff-protocol. */
export type FirebaseGdataDiffUploadRequestInput = {
	/** The object version of the object that is the base version the incoming diff script will be applied to. This field will always be filled in. */
	objectVersion?: string;
	/** The location of the checksums for the new object. Agents must clone the object located here, as the upload server will delete the contents once a response is received. For details on the format of the checksums, see http://go/scotty-diff-protocol. */
	checksumsInfo?: FirebaseGdataCompositeMediaInput;
	/** The location of the new object. Agents must clone the object located here, as the upload server will delete the contents once a response is received. */
	objectInfo?: FirebaseGdataCompositeMediaInput;
};

/** Backend response for a Diff upload request. For details on the Scotty Diff protocol, visit http://go/scotty-diff-protocol. */
export type FirebaseGdataDiffUploadResponseInput = {
	/** The object version of the object at the server. Must be included in the end notification response. The version in the end notification response must correspond to the new version of the object that is now stored at the server, after the upload. */
	objectVersion?: string;
	/** The location of the original file for a diff upload request. Must be filled in if responding to an upload start notification. */
	originalObject?: FirebaseGdataCompositeMediaInput;
};

/** Backend response for a Diff get version response. For details on the Scotty Diff protocol, visit http://go/scotty-diff-protocol. */
export type FirebaseGdataDiffVersionResponseInput = {
	/** The version of the object stored at the server. */
	objectVersion?: string;
	/** The total size of the server object. */
	objectSizeBytes?: string | number;
};

/** Parameters specific to media downloads. */
export type FirebaseGdataDownloadParametersInput = {
	/** A boolean to be returned in the response to Scotty. Allows/disallows gzip encoding of the payload content when the server thinks it's advantageous (hence, does not guarantee compression) which allows Scotty to GZip the response to the client. */
	allowGzipCompression?: boolean;
	/** Determining whether or not Apiary should skip the inclusion of any Content-Range header on its response to Scotty. */
	ignoreRange?: boolean;
};

/** A reference to data stored on the filesystem, on GFS or in blobstore. */
export type FirebaseGdataMediaInput = {
	/** Media data, set if reference_type is INLINE (base64) */
	inline?: string;
	/** Set if reference_type is DIFF_UPLOAD_REQUEST. */
	diffUploadRequest?: FirebaseGdataDiffUploadRequestInput;
	/** Time at which the media data was last updated, in milliseconds since UNIX epoch */
	timestamp?: string | number;
	/** Reference to a TI Blob, set if reference_type is BIGSTORE_REF. */
	objectId?: FirebaseGdataObjectIdInput;
	/** Scotty-provided SHA256 hash for an upload. (base64) */
	sha256Hash?: string;
	/** Path to the data, set if reference_type is PATH */
	path?: string;
	/** Blobstore v2 info, set if reference_type is BLOBSTORE_REF and it refers to a v2 blob. */
	blobstore2Info?: FirebaseGdataBlobstore2InfoInput;
	/** Set if reference_type is DIFF_CHECKSUMS_RESPONSE. */
	diffChecksumsResponse?: FirebaseGdataDiffChecksumsResponseInput;
	/** Scotty-provided MD5 hash for an upload. (base64) */
	md5Hash?: string;
	/** Scotty-provided SHA1 hash for an upload. (base64) */
	sha1Hash?: string;
	/** A unique fingerprint/version id for the media data */
	token?: string;
	/** |is_potential_retry| is set false only when Scotty is certain that it has not sent the request before. */
	isPotentialRetry?: boolean;
	/** A binary data reference for a media download. Serves as a technology-agnostic binary reference in some Google infrastructure. This value is a serialized storage_cosmo.BinaryReference proto. */
	cosmoBinaryReference?: string;
	/** Size of the data, in bytes */
	length?: string | number;
	/** Blobstore v1 reference, set if reference_type is BLOBSTORE_REF This should be the byte representation of a blobstore.BlobRef. Since Blobstore is deprecating v1, use blobstore2_info instead. For now, any v2 blob will also be represented in this field as v1 BlobRef. (base64) */
	blobRef?: string;
	/** Original file name */
	filename?: string;
	/** Set if reference_type is DIFF_DOWNLOAD_RESPONSE. */
	diffDownloadResponse?: FirebaseGdataDiffDownloadResponseInput;
	/** Extended content type information provided for Scotty uploads. */
	contentTypeInfo?: FirebaseGdataContentTypeInfoInput;
	/** MIME type of the data */
	contentType?: string;
	/** For Scotty uploads only. If a user sends a hash code and the backend has requested that Scotty verify the upload against the client hash, Scotty will perform the check on behalf of the backend and will reject it if the hashes don't match. This is set to true if Scotty performed this verification. */
	hashVerified?: boolean;
	/** Use object_id instead. (base64) */
	bigstoreObjectRef?: string;
	/** Parameters for a media download. */
	downloadParameters?: FirebaseGdataDownloadParametersInput;
	/** Scotty-provided SHA512 hash for an upload. (base64) */
	sha512Hash?: string;
	/** Describes what the field reference contains. */
	referenceType?:
		| 'PATH'
		| 'BLOB_REF'
		| 'INLINE'
		| 'GET_MEDIA'
		| 'COMPOSITE_MEDIA'
		| 'BIGSTORE_REF'
		| 'DIFF_VERSION_RESPONSE'
		| 'DIFF_CHECKSUMS_RESPONSE'
		| 'DIFF_DOWNLOAD_RESPONSE'
		| 'DIFF_UPLOAD_REQUEST'
		| 'DIFF_UPLOAD_RESPONSE'
		| 'COSMO_BINARY_REFERENCE'
		| 'ARBITRARY_BYTES';
	/** Deprecated, use one of explicit hash type fields instead. These two hash related fields will only be populated on Scotty based media uploads and will contain the content of the hash group in the NotificationRequest… */
	hash?: string;
	/** Media id to forward to the operation GetMedia. Can be set if reference_type is GET_MEDIA. (base64) */
	mediaId?: string;
	/** For Scotty Uploads: Scotty-provided hashes for uploads For Scotty Downloads: (WARNING: DO NOT USE WITHOUT PERMISSION FROM THE SCOTTY TEAM.) A Hash provided by the agent to be used to verify the data being downloaded. Currently only supported for inline payloads. */
	crc32cHash?: number;
	/** Set if reference_type is DIFF_VERSION_RESPONSE. */
	diffVersionResponse?: FirebaseGdataDiffVersionResponseInput;
	/** Set if reference_type is DIFF_UPLOAD_RESPONSE. */
	diffUploadResponse?: FirebaseGdataDiffUploadResponseInput;
	/** A composite media composed of one or more media objects, set if reference_type is COMPOSITE_MEDIA. The media length field must be set to the sum of the lengths of all composite media objects. Note: All composite media must have length specified. */
	compositeMedia?: Array<FirebaseGdataCompositeMediaInput>;
	/** Deprecated, use one of explicit hash type fields instead. Algorithm used for calculating the hash. As of 2011/01/21, "MD5" is the only possible value for this field. New values may be added at any time. */
	algorithm?: string;
};

/** This is a copy of the tech.blob.ObjectId proto, which could not be used directly here due to transitive closure issues with JavaScript support; see http://b/8801763. */
export type FirebaseGdataObjectIdInput = {
	/** The name of the object. */
	objectName?: string;
	/** Generation of the object. Generations are monotonically increasing across writes, allowing them to be be compared to determine which generation is newer. If this is omitted in a request, then you are requesting the live object. See http://go/bigstore-versions */
	generation?: string | number;
	/** The name of the bucket to which this object belongs. */
	bucketName?: string;
};

/** Defines a policy of allowing every region by default and adding disallowed regions to a disallow list. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2AllowByDefaultInput = {
	/** Two letter unicode region codes to disallow as defined by https://cldr.unicode.org/ The full list of these region codes is here: https://github.com/unicode-cldr/cldr-localenames-full/blob/master/main/en/territories.json */
	disallowedRegions?: Array<string>;
};

/** Defines a policy of only allowing regions by explicitly adding them to an allowlist. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2AllowlistOnlyInput = {
	/** Two letter unicode region codes to allow as defined by https://cldr.unicode.org/ The full list of these region codes is here: https://github.com/unicode-cldr/cldr-localenames-full/blob/master/main/en/territories.json */
	allowedRegions?: Array<string>;
};

/** Configuration options related to authenticating an anonymous user. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2AnonymousInput = {
	/** Whether anonymous user auth is enabled for the project or not. */
	enabled?: boolean;
};

/** Additional config for SignInWithApple. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2AppleSignInConfigInput = {
	/** A list of Bundle ID's usable by this project */
	bundleIds?: Array<string>;
	/** Additional config for Apple for code flow. */
	codeFlowConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2CodeFlowConfigInput;
};

/** Configuration related to Blocking Functions. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2BlockingFunctionsConfigInput =
	{
		/** Map of Trigger to event type. Key should be one of the supported event types: "beforeCreate", "beforeSignIn" */
		triggers?: Record<
			string,
			FirebaseGoogleCloudIdentitytoolkitAdminV2TriggerInput
		>;
		/** The user credentials to include in the JWT payload that is sent to the registered Blocking Functions. */
		forwardInboundCredentials?: FirebaseGoogleCloudIdentitytoolkitAdminV2ForwardInboundCredentialsInput;
	};

/** Options related to how clients making requests on behalf of a project should be configured. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2ClientConfigInput = {
	/** Configuration related to restricting a user's ability to affect their account. */
	permissions?: FirebaseGoogleCloudIdentitytoolkitAdminV2PermissionsInput;
};

/** Options related to how clients making requests on behalf of a tenant should be configured. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2ClientPermissionConfigInput =
	{
		/** Configuration related to restricting a user's ability to affect their account. */
		permissions?: FirebaseGoogleCloudIdentitytoolkitAdminV2ClientPermissionsInput;
	};

/** Configuration related to restricting a user's ability to affect their account. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2ClientPermissionsInput = {
	/** When true, end users cannot delete their account on the associated project through any of our API methods */
	disabledUserDeletion?: boolean;
	/** When true, end users cannot sign up for a new account on the associated project through any of our API methods */
	disabledUserSignup?: boolean;
};

/** Additional config for Apple for code flow. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2CodeFlowConfigInput = {
	/** Key ID for the private key. */
	keyId?: string;
	/** Private key used for signing the client secret JWT. */
	privateKey?: string;
	/** Apple Developer Team ID. */
	teamId?: string;
};

/** Custom strength options to enforce on user passwords. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2CustomStrengthOptionsInput =
	{
		/** The password must contain a lower case character. */
		containsLowercaseCharacter?: boolean;
		/** Maximum password length. No default max length */
		maxPasswordLength?: number;
		/** Minimum password length. Range from 6 to 30 */
		minPasswordLength?: number;
		/** The password must contain an upper case character. */
		containsUppercaseCharacter?: boolean;
		/** The password must contain a number. */
		containsNumericCharacter?: boolean;
		/** The password must contain a non alpha numeric character. */
		containsNonAlphanumericCharacter?: boolean;
	};

/** Information of custom domain DNS verification. By default, default_domain will be used. A custom domain can be configured using VerifyCustomDomain. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2DnsInfoInput = {
	/** Whether to use custom domain. */
	useCustomDomain?: boolean;
};

/** Configuration options related to authenticating a user by their email address. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2EmailInput = {
	/** Whether a password is required for email auth or not. If true, both an email and password must be provided to sign in. If false, a user may sign in via either email/password or email link. */
	passwordRequired?: boolean;
	/** Whether email auth is enabled for the project or not. */
	enabled?: boolean;
};

/** Configuration for settings related to email privacy and public visibility. Settings in this config protect against email enumeration, but may make some trade-offs in user-friendliness. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2EmailPrivacyConfigInput = {
	/** Migrates the project to a state of improved email privacy. For example certain error codes are more generic to avoid giving away information on whether the account exists. In addition, this disables certain features that as a side-effect allow user enumeration. */
	enableImprovedEmailPrivacy?: boolean;
};

/** Email template. The subject and body fields can contain the following placeholders which will be replaced with the appropriate values: %LINK% - The link to use to redeem the send OOB code. %EMAIL% - The email where the email is being sent. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2EmailTemplateInput = {
	/** Email body format */
	bodyFormat?: 'BODY_FORMAT_UNSPECIFIED' | 'PLAIN_TEXT' | 'HTML';
	/** Local part of From address */
	senderLocalPart?: string;
	/** Email body */
	body?: string;
	/** Reply-to address */
	replyTo?: string;
	/** Sender display name */
	senderDisplayName?: string;
	/** Subject of the email */
	subject?: string;
};

/** Indicates which credentials to pass to the registered Blocking Functions. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2ForwardInboundCredentialsInput =
	{
		/** Whether to pass the user's OIDC identity provider's ID token. */
		idToken?: boolean;
		/** Whether to pass the user's OAuth identity provider's access token. */
		accessToken?: boolean;
		/** Whether to pass the user's OAuth identity provider's refresh token. */
		refreshToken?: boolean;
	};

/** The IDP's certificate data to verify the signature in the SAMLResponse issued by the IDP. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2IdpCertificateInput = {
	/** The x509 certificate */
	x509Certificate?: string;
};

/** The SAML IdP (Identity Provider) configuration when the project acts as the relying party. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2IdpConfigInput = {
	/** URL to send Authentication request to. */
	ssoUrl?: string;
	/** IDP's public keys for verifying signature in the assertions. */
	idpCertificates?: Array<FirebaseGoogleCloudIdentitytoolkitAdminV2IdpCertificateInput>;
	/** Indicates if outbounding SAMLRequest should be signed. */
	signRequest?: boolean;
	/** Unique identifier for all SAML entities. */
	idpEntityId?: string;
};

/** Settings that the tenants will inherit from project level. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2InheritanceInput = {
	/** Whether to allow the tenant to inherit custom domains, email templates, and custom SMTP settings. If true, email sent from tenant will follow the project level email sending configurations. If false (by default), emails will go with the default settings with no customizations. */
	emailSendingConfig?: boolean;
};

/** Request for InitializeIdentityPlatform. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2InitializeIdentityPlatformRequestInput =
	Record<string, FirebaseJsonValue>;

/** Configuration mobile links. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2MobileLinksConfigInput = {
	/** Open code in app domain to use for app links and universal links. */
	domain?:
		| 'DOMAIN_UNSPECIFIED'
		| 'FIREBASE_DYNAMIC_LINK_DOMAIN'
		| 'HOSTING_DOMAIN';
};

/** Configuration related to monitoring project activity. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2MonitoringConfigInput = {
	/** Configuration for logging requests made to this project to Stackdriver Logging */
	requestLogging?: FirebaseGoogleCloudIdentitytoolkitAdminV2RequestLoggingInput;
};

/** Options related to MultiFactor Authentication for the project. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2MultiFactorAuthConfigInput =
	{
		/** A list of usable second factors for this project along with their configurations. This field does not support phone based MFA, for that use the 'enabled_providers' field. */
		providerConfigs?: Array<FirebaseGoogleCloudIdentitytoolkitAdminV2ProviderConfigInput>;
		/** Whether MultiFactor Authentication has been enabled for this project. */
		state?: 'STATE_UNSPECIFIED' | 'DISABLED' | 'ENABLED' | 'MANDATORY';
		/** A list of usable second factors for this project. */
		enabledProviders?: Array<'PROVIDER_UNSPECIFIED' | 'PHONE_SMS'>;
	};

/** Configuration related to multi-tenant functionality. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2MultiTenantConfigInput = {
	/** The default cloud parent org or folder that the tenant project should be created under. The parent resource name should be in the format of "/", such as "folders/123" or "organizations/456". */
	defaultTenantLocation?: string;
	/** Whether this project can have tenants or not. */
	allowTenants?: boolean;
};

/** Configuration related to sending notifications to users. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2NotificationConfigInput = {
	/** Options for email sending. */
	sendEmail?: FirebaseGoogleCloudIdentitytoolkitAdminV2SendEmailInput;
	/** Options for SMS sending. */
	sendSms?: FirebaseGoogleCloudIdentitytoolkitAdminV2SendSmsInput;
	/** Default locale used for email and SMS in IETF BCP 47 format. */
	defaultLocale?: string;
};

/** The response type to request for in the OAuth authorization flow. You can set either `id_token` or `code` to true, but not both. Setting both types to be simultaneously true (`{code: true, id_token: true}`) is not yet supported. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2OAuthResponseTypeInput = {
	/** If true, ID token is returned from IdP's authorization endpoint. */
	idToken?: boolean;
	/** If true, authorization code is returned from IdP's authorization endpoint. */
	code?: boolean;
	/** Do not use. The `token` response type is not supported at the moment. */
	token?: boolean;
};

/** The configuration for the password policy on the project. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2PasswordPolicyConfigInput =
	{
		/** Must be of length 1. Contains the strength attributes for the password policy. */
		passwordPolicyVersions?: Array<FirebaseGoogleCloudIdentitytoolkitAdminV2PasswordPolicyVersionInput>;
		/** Users must have a password compliant with the password policy to sign-in. */
		forceUpgradeOnSignin?: boolean;
		/** Which enforcement mode to use for the password policy. */
		passwordPolicyEnforcementState?:
			| 'PASSWORD_POLICY_ENFORCEMENT_STATE_UNSPECIFIED'
			| 'OFF'
			| 'ENFORCE';
	};

/** The strength attributes for the password policy on the project. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2PasswordPolicyVersionInput =
	{
		/** The custom strength options enforced by the password policy. */
		customStrengthOptions?: FirebaseGoogleCloudIdentitytoolkitAdminV2CustomStrengthOptionsInput;
	};

/** Configuration related to restricting a user's ability to affect their account. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2PermissionsInput = {
	/** When true, end users cannot delete their account on the associated project through any of our API methods */
	disabledUserDeletion?: boolean;
	/** When true, end users cannot sign up for a new account on the associated project through any of our API methods */
	disabledUserSignup?: boolean;
};

/** Configuration options related to authenticated a user by their phone number. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2PhoneNumberInput = {
	/** A map of that can be used for phone auth testing. */
	testPhoneNumbers?: Record<string, string>;
	/** Whether phone number auth is enabled for the project or not. */
	enabled?: boolean;
};

/** ProviderConfig describes the supported MFA providers along with their configurations. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2ProviderConfigInput = {
	/** TOTP MFA provider config for this project. */
	totpProviderConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2TotpMfaProviderConfigInput;
	/** Describes the state of the MultiFactor Authentication type. */
	state?: 'MFA_STATE_UNSPECIFIED' | 'DISABLED' | 'ENABLED' | 'MANDATORY';
};

/** Configuration related to quotas. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2QuotaConfigInput = {
	/** Quota for the Signup endpoint, if overwritten. Signup quota is measured in sign ups per project per hour per IP. */
	signUpQuotaConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2TemporaryQuotaInput;
};

/** The reCAPTCHA Enterprise integration config. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaConfigInput = {
	/** Whether to use the rCE bot score for reCAPTCHA phone provider. Can only be true when the phone_enforcement_state is AUDIT or ENFORCE. */
	useSmsBotScore?: boolean;
	/** The reCAPTCHA keys. */
	recaptchaKeys?: Array<FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaKeyInput>;
	/** The managed rules for authentication action based on reCAPTCHA scores. The rules are shared across providers for a given tenant project. */
	managedRules?: Array<FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaManagedRuleInput>;
	/** The reCAPTCHA config for email/password provider, containing the enforcement status. The email/password provider contains all email related user flows protected by reCAPTCHA. */
	emailPasswordEnforcementState?:
		| 'RECAPTCHA_PROVIDER_ENFORCEMENT_STATE_UNSPECIFIED'
		| 'OFF'
		| 'AUDIT'
		| 'ENFORCE';
	/** Whether to use the rCE sms toll fraud protection risk score for reCAPTCHA phone provider. Can only be true when the phone_enforcement_state is AUDIT or ENFORCE. */
	useSmsTollFraudProtection?: boolean;
	/** The reCAPTCHA config for phone provider, containing the enforcement status. The phone provider contains all SMS related user flows protected by reCAPTCHA. */
	phoneEnforcementState?:
		| 'RECAPTCHA_PROVIDER_ENFORCEMENT_STATE_UNSPECIFIED'
		| 'OFF'
		| 'AUDIT'
		| 'ENFORCE';
	/** Whether to use the account defender for reCAPTCHA assessment. Defaults to `false`. */
	useAccountDefender?: boolean;
	/** The managed rules for the authentication action based on reCAPTCHA toll fraud risk scores. Toll fraud managed rules will only take effect when the phone_enforcement_state is AUDIT or ENFORCE and use_sms_toll_fraud_protection is true. */
	tollFraudManagedRules?: Array<FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaTollFraudManagedRuleInput>;
};

/** The reCAPTCHA key config. reCAPTCHA Enterprise offers different keys for different client platforms. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaKeyInput = {
	/** The reCAPTCHA Enterprise key resource name, e.g. "projects/{project}/keys/{key}" */
	key?: string;
	/** The client's platform type. */
	type?: 'CLIENT_TYPE_UNSPECIFIED' | 'WEB' | 'IOS' | 'ANDROID';
};

/** The config for a reCAPTCHA managed rule. Models a single interval [start_score, end_score]. The start_score is implicit. It is either the closest smaller end_score (if one is available) or 0. Intervals in aggregate span [0, 1] without overlapping. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaManagedRuleInput =
	{
		/** The action taken if the reCAPTCHA score of a request is within the interval [start_score, end_score]. */
		action?: 'RECAPTCHA_ACTION_UNSPECIFIED' | 'BLOCK';
		/** The end score (inclusive) of the score range for an action. Must be a value between 0.0 and 1.0, at 11 discrete values; e.g. 0, 0.1, 0.2, 0.3, ... 0.9, 1.0. A score of 0.0 indicates the riskiest request (likely a bot), whereas 1.0 indicates the safest request (likely a human). */
		endScore?: number;
	};

/** The config for a reCAPTCHA toll fraud assessment managed rule. Models a single interval [start_score, end_score]. The end_score is implicit. It is either the closest smaller end_score (if one is available) or 0. Intervals in aggregate span [0, 1] without overlapping. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaTollFraudManagedRuleInput =
	{
		/** The start score (inclusive) for an action. Must be a value between 0.0 and 1.0, at 11 discrete values; e.g. 0, 0.1, 0.2, 0.3, ... 0.9, 1.0. A score of 0.0 indicates the safest request (likely legitimate), whereas 1.0 indicates the riskiest request (likely toll fraud). */
		startScore?: number;
		/** The action taken if the reCAPTCHA score of a request is within the interval [start_score, end_score]. */
		action?: 'RECAPTCHA_ACTION_UNSPECIFIED' | 'BLOCK';
	};

/** Configuration for logging requests made to this project to Stackdriver Logging */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2RequestLoggingInput = {
	/** Whether logging is enabled for this project or not. */
	enabled?: boolean;
};

/** Options for email sending. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2SendEmailInput = {
	/** Information of custom domain DNS verification. */
	dnsInfo?: FirebaseGoogleCloudIdentitytoolkitAdminV2DnsInfoInput;
	/** Email template for verify email */
	verifyEmailTemplate?: FirebaseGoogleCloudIdentitytoolkitAdminV2EmailTemplateInput;
	/** Reset password email template for legacy Firebase V1 app. */
	legacyResetPasswordTemplate?: FirebaseGoogleCloudIdentitytoolkitAdminV2EmailTemplateInput;
	/** Email template for reset password */
	resetPasswordTemplate?: FirebaseGoogleCloudIdentitytoolkitAdminV2EmailTemplateInput;
	/** Email template for reverting second factor addition emails */
	revertSecondFactorAdditionTemplate?: FirebaseGoogleCloudIdentitytoolkitAdminV2EmailTemplateInput;
	/** Email template for change email */
	changeEmailTemplate?: FirebaseGoogleCloudIdentitytoolkitAdminV2EmailTemplateInput;
	/** Use a custom SMTP relay */
	smtp?: FirebaseGoogleCloudIdentitytoolkitAdminV2SmtpInput;
	/** The method used for sending an email. */
	method?: 'METHOD_UNSPECIFIED' | 'DEFAULT' | 'CUSTOM_SMTP';
	/** action url in email template. */
	callbackUri?: string;
};

/** Options for SMS sending. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2SendSmsInput = {
	/** Whether to use the accept_language header for SMS. */
	useDeviceLocale?: boolean;
};

/** Configuration related to local sign in methods. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2SignInConfigInput = {
	/** Configuration options related to authenticating an anonymous user. */
	anonymous?: FirebaseGoogleCloudIdentitytoolkitAdminV2AnonymousInput;
	/** Configuration options related to authenticated a user by their phone number. */
	phoneNumber?: FirebaseGoogleCloudIdentitytoolkitAdminV2PhoneNumberInput;
	/** Whether to allow more than one account to have the same email. */
	allowDuplicateEmails?: boolean;
	/** Configuration options related to authenticating a user by their email address. */
	email?: FirebaseGoogleCloudIdentitytoolkitAdminV2EmailInput;
};

/** Configures the regions where users are allowed to send verification SMS for the project or tenant. This is based on the calling code of the destination phone number. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2SmsRegionConfigInput = {
	/** A policy of allowing SMS to every region by default and adding disallowed regions to a disallow list. */
	allowByDefault?: FirebaseGoogleCloudIdentitytoolkitAdminV2AllowByDefaultInput;
	/** A policy of only allowing regions by explicitly adding them to an allowlist. */
	allowlistOnly?: FirebaseGoogleCloudIdentitytoolkitAdminV2AllowlistOnlyInput;
};

/** Configuration for SMTP relay */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2SmtpInput = {
	/** SMTP relay username */
	username?: string;
	/** SMTP relay password */
	password?: string;
	/** Sender email for the SMTP relay */
	senderEmail?: string;
	/** SMTP relay port */
	port?: number;
	/** SMTP security mode. */
	securityMode?: 'SECURITY_MODE_UNSPECIFIED' | 'SSL' | 'START_TLS';
	/** SMTP relay host */
	host?: string;
};

/** The SAML SP (Service Provider) configuration when the project acts as the relying party to receive and accept an authentication assertion issued by a SAML identity provider. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2SpConfigInput = {
	/** Callback URI where responses from IDP are handled. */
	callbackUri?: string;
	/** Unique identifier for all SAML entities. */
	spEntityId?: string;
};

/** Temporary quota increase / decrease */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2TemporaryQuotaInput = {
	/** When this quota will take effect */
	startTime?: string;
	/** Corresponds to the 'refill_token_count' field in QuotaServer config */
	quota?: string | number;
	/** How long this quota will be active for */
	quotaDuration?: string;
};

/** TotpMFAProviderConfig represents the TOTP based MFA provider. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2TotpMfaProviderConfigInput =
	{
		/** The allowed number of adjacent intervals that will be used for verification to avoid clock skew. */
		adjacentIntervals?: number;
	};

/** Synchronous Cloud Function with HTTP Trigger */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2TriggerInput = {
	/** HTTP URI trigger for the Cloud Function. */
	functionUri?: string;
	/** When the trigger was changed. */
	updateTime?: string;
};

/** The parameters for Argon2 hashing algorithm. */
export type FirebaseGoogleCloudIdentitytoolkitV1Argon2ParametersInput = {
	/** The additional associated data, if provided, is appended to the hash value to provide an additional layer of security. A base64-encoded string if specified via JSON. (base64) */
	associatedData?: string;
	/** Required. The number of iterations to perform. Minimum is 1, maximum is 16. */
	iterations?: number;
	/** Required. The desired hash length in bytes. Minimum is 4 and maximum is 1024. */
	hashLengthBytes?: number;
	/** Required. The degree of parallelism, also called threads or lanes. Minimum is 1, maximum is 16. */
	parallelism?: number;
	/** Required. The memory cost in kibibytes. Maximum is 32768. */
	memoryCostKib?: number;
	/** The version of the Argon2 algorithm. This defaults to VERSION_13 if not specified. */
	version?: 'VERSION_UNSPECIFIED' | 'VERSION_10' | 'VERSION_13';
	/** Required. Must not be HASH_TYPE_UNSPECIFIED. */
	hashType?: 'HASH_TYPE_UNSPECIFIED' | 'ARGON2_D' | 'ARGON2_ID' | 'ARGON2_I';
};

/** The information required to auto-retrieve an SMS. */
export type FirebaseGoogleCloudIdentitytoolkitV1AutoRetrievalInfoInput = {
	/** The Android app's signature hash for Google Play Service's SMS Retriever API. */
	appSignatureHash?: string;
};

/** Information about email MFA. */
export type FirebaseGoogleCloudIdentitytoolkitV1EmailInfoInput = {
	/** Email address that a MFA verification should be sent to. */
	emailAddress?: string;
};

/** Federated user identifier at an Identity Provider. */
export type FirebaseGoogleCloudIdentitytoolkitV1FederatedUserIdentifierInput = {
	/** The user ID of the account at the third-party Identity Provider specified by `provider_id`. */
	rawId?: string;
	/** The ID of supported identity providers. This should be a provider ID enabled for sign-in, which is either from the list of [default supported IdPs](https://cloud.google.com/identity-platform/docs/reference/rest/v2/defaultSupportedIdps/list), or of the format `oidc.*` or `saml.*`. */
	providerId?: string;
};

/** Information on which multi-factor authentication (MFA) providers are enabled for an account. */
export type FirebaseGoogleCloudIdentitytoolkitV1MfaEnrollmentInput = {
	/** Display name for this mfa option e.g. "corp cell phone". */
	displayName?: string;
	/** Normally this will show the phone number associated with this enrollment. In some situations, such as after a first factor sign in, it will only show the obfuscated version of the associated phone number. */
	phoneInfo?: string;
	/** Contains information specific to email MFA. */
	emailInfo?: FirebaseGoogleCloudIdentitytoolkitV1EmailInfoInput;
	/** Contains information specific to TOTP MFA. */
	totpInfo?: FirebaseGoogleCloudIdentitytoolkitV1TotpInfoInput;
	/** Timestamp when the account enrolled this second factor. */
	enrolledAt?: string;
	/** ID of this MFA option. */
	mfaEnrollmentId?: string;
};

export type FirebaseGoogleCloudIdentitytoolkitV1MfaFactorInput = {
	/** Phone number to receive OTP for MFA. */
	phoneInfo?: string;
	/** Display name for this mfa option e.g. "corp cell phone". */
	displayName?: string;
};

/** Multi-factor authentication related information. */
export type FirebaseGoogleCloudIdentitytoolkitV1MfaInfoInput = {
	/** The second factors the user has enrolled. */
	enrollments?: Array<FirebaseGoogleCloudIdentitytoolkitV1MfaEnrollmentInput>;
};

/** Information about the user as provided by various Identity Providers. */
export type FirebaseGoogleCloudIdentitytoolkitV1ProviderUserInfoInput = {
	/** The ID of the Identity Provider. */
	providerId?: string;
	/** The user's phone number at the Identity Provider. */
	phoneNumber?: string;
	/** The user's email address at the Identity Provider. */
	email?: string;
	/** The user's identifier at the Identity Provider. */
	federatedId?: string;
	/** The user's raw identifier directly returned from Identity Provider. */
	rawId?: string;
	/** The user's screen_name at Twitter or login name at GitHub. */
	screenName?: string;
	/** The user's profile photo URL at the Identity Provider. */
	photoUrl?: string;
	/** The user's display name at the Identity Provider. */
	displayName?: string;
};

/** Query conditions used to filter results. */
export type FirebaseGoogleCloudIdentitytoolkitV1SqlExpressionInput = {
	/** A string that the account's local ID should match. Only one of `email`, `phone_number`, or `user_id` should be specified in a SqlExpression If more than one is specified, only the first (in that order) will be applied. */
	userId?: string;
	/** A string that the account's phone number should match. Only one of `email`, `phone_number`, or `user_id` should be specified in a SqlExpression. If more than one is specified, only the first (in that order) will be applied. */
	phoneNumber?: string;
	/** A case insensitive string that the account's email should match. Only one of `email`, `phone_number`, or `user_id` should be specified in a SqlExpression. If more than one is specified, only the first (in that order) will be applied. */
	email?: string;
};

/** Information about TOTP MFA. */
export type FirebaseGoogleCloudIdentitytoolkitV1TotpInfoInput = Record<
	string,
	FirebaseJsonValue
>;

/** An Identity Platform account's information. */
export type FirebaseGoogleCloudIdentitytoolkitV1UserInfoInput = {
	/** The timestamp, in milliseconds from the epoch of 1970-01-01T00:00:00Z, when the account's password was last updated. */
	passwordUpdatedAt?: number;
	/** The account's password salt. Only accessible by requests bearing a Google OAuth2 credential with proper permissions. (base64) */
	salt?: string;
	/** The account's phone number. */
	phoneNumber?: string;
	/** The URL of the account's profile photo. This account attribute is not used by Identity Platform. It is available for informational purposes only. */
	photoUrl?: string;
	/** Information on which multi-factor authentication providers are enabled for this account. */
	mfaInfo?: Array<FirebaseGoogleCloudIdentitytoolkitV1MfaEnrollmentInput>;
	/** Whether the account's email address has been verified. */
	emailVerified?: boolean;
	/** Immutable. The unique ID of the account. */
	localId?: string;
	/** The account's email address. The length of the email should be less than 256 characters and in the format of `name@domain.tld`. The email should also match the [RFC 822](https://tools.ietf.org/html/rfc822) addr-spec. */
	email?: string;
	/** Input only. Plain text password used to update a account's password. This field is only ever used as input in a request. Identity Platform uses cryptographically secure hashing when managing passwords and will never store or transmit a user's password in plain text. */
	rawPassword?: string;
	/** Custom claims to be added to any ID tokens minted for the account. Should be at most 1,000 characters in length and in valid JSON format. */
	customAttributes?: string;
	/** The last time, in milliseconds from epoch, this account was logged into. */
	lastLoginAt?: string | number;
	/** ID of the tenant this account belongs to. Only set if this account belongs to a tenant. */
	tenantId?: string;
	/** The display name of the account. This account attribute is not used by Identity Platform. It is available for informational purposes only. */
	displayName?: string;
	/** The first email address associated with this account. The account's initial email cannot be changed once set and is used to recover access to this account if lost via the RECOVER_EMAIL flow in GetOobCode. Should match the [RFC 822](https://tools.ietf.org/html/rfc822) addr-spec. */
	initialEmail?: string;
	/** The time, in milliseconds from epoch, when the account was created. */
	createdAt?: string | number;
	/** The version of the account's password. Only accessible by requests bearing a Google OAuth2 credential with proper permissions. */
	version?: number;
	/** Timestamp when an ID token was last minted for this account. */
	lastRefreshAt?: string;
	/** Oldest timestamp, in seconds since epoch, that an ID token should be considered valid. All ID tokens issued before this time are considered invalid. */
	validSince?: string | number;
	/** Information about the user as provided by various Identity Providers. */
	providerUserInfo?: Array<FirebaseGoogleCloudIdentitytoolkitV1ProviderUserInfoInput>;
	/** Whether the account is disabled. Disabled accounts are inaccessible except for requests bearing a Google OAuth2 credential with proper permissions. */
	disabled?: boolean;
	/** The account's hashed password. Only accessible by requests bearing a Google OAuth2 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). (base64) */
	passwordHash?: string;
};

/** The information required to auto-retrieve an SMS. */
export type FirebaseGoogleCloudIdentitytoolkitV2AutoRetrievalInfoInput = {
	/** The Android app's signature hash for Google Play Service's SMS Retriever API. */
	appSignatureHash?: string;
};

/** Phone Verification info for a FinalizeMfa request. */
export type FirebaseGoogleCloudIdentitytoolkitV2FinalizeMfaPhoneRequestInfoInput =
	{
		/** Android only. Uses for "instant" phone number verification though GmsCore. */
		androidVerificationProof?: string;
		/** User-entered verification code. */
		code?: string;
		/** An opaque string that represents the enrollment session. */
		sessionInfo?: string;
		/** Required if Android verification proof is presented. */
		phoneNumber?: string;
	};

/** Mfa request info specific to TOTP auth for FinalizeMfa. */
export type FirebaseGoogleCloudIdentitytoolkitV2FinalizeMfaTotpEnrollmentRequestInfoInput =
	{
		/** An opaque string that represents the enrollment session. */
		sessionInfo?: string;
		/** User-entered verification code. */
		verificationCode?: string;
	};

/** TOTP verification info for FinalizeMfaSignInRequest. */
export type FirebaseGoogleCloudIdentitytoolkitV2MfaTotpSignInRequestInfoInput =
	{
		/** User-entered verification code. */
		verificationCode?: string;
	};

/** App Verification info for a StartMfa request. */
export type FirebaseGoogleCloudIdentitytoolkitV2StartMfaPhoneRequestInfoInput =
	{
		/** Android only. Used by Google Play Services to identify the app for auto-retrieval. */
		autoRetrievalInfo?: FirebaseGoogleCloudIdentitytoolkitV2AutoRetrievalInfoInput;
		/** Android only. Used to assert application identity in place of a recaptcha token (or safety net token). A Play Integrity Token can be generated via the [PlayIntegrity API] (https://developer.android.com/google/play/integrity) with applying SHA256 to the `phone_number` field as the nonce. */
		playIntegrityToken?: string;
		/** Android only. Used to assert application identity in place of a recaptcha token. A SafetyNet Token can be generated via the [SafetyNet Android Attestation API](https://developer.android.com/training/safetynet/attestation.html), with the Base64 encoding of the `phone_number` field as the nonce. */
		safetyNetToken?: string;
		/** The client type, web, android or ios. Required when reCAPTCHA Enterprise is enabled. */
		clientType?:
			| 'CLIENT_TYPE_UNSPECIFIED'
			| 'CLIENT_TYPE_WEB'
			| 'CLIENT_TYPE_ANDROID'
			| 'CLIENT_TYPE_IOS';
		/** iOS only. Secret delivered to iOS app via APNS. */
		iosSecret?: string;
		/** Required for enrollment. Phone number to be enrolled as MFA. */
		phoneNumber?: string;
		/** Web only. Recaptcha solution. */
		recaptchaToken?: string;
		/** The reCAPTCHA version of the reCAPTCHA token in the captcha_response. Required when reCAPTCHA Enterprise is enabled. */
		recaptchaVersion?: 'RECAPTCHA_VERSION_UNSPECIFIED' | 'RECAPTCHA_ENTERPRISE';
		/** iOS only. Receipt of successful app token validation with APNS. */
		iosReceipt?: string;
		/** The reCAPTCHA Enterprise token provided by the reCAPTCHA client-side integration. Required when reCAPTCHA enterprise is enabled. */
		captchaResponse?: string;
	};

/** Mfa request info specific to TOTP auth for StartMfa. */
export type FirebaseGoogleCloudIdentitytoolkitV2StartMfaTotpEnrollmentRequestInfoInput =
	Record<string, FirebaseJsonValue>;

/** Request message for the GenerateAppAttestChallenge method. */
export type FirebaseGoogleFirebaseAppcheckV1GenerateAppAttestChallengeRequestInput =
	Record<string, FirebaseJsonValue>;

/** Request message for the GeneratePlayIntegrityChallenge method. */
export type FirebaseGoogleFirebaseAppcheckV1GeneratePlayIntegrityChallengeRequestInput =
	Record<string, FirebaseJsonValue>;

/** Configuration for a limited-use App Check token. */
export type FirebaseGoogleFirebaseAppcheckV1LimitedUseConfigInput = {
	/** Optional. Specifies the desired `jti` claim (Section 4.1.7 of RFC 7519) in the returned App Check token. Limited-use App Check tokens with the same `jti` will be counted as the same token for the purposes of replay protection. The size of this field is limited to 250 bytes. */
	jti?: string;
};

/** A settings object specifying account requirements for Android devices running your app. These settings correspond to requirements on the [**account details** field](https://developer.android.com/google/play/integrity/verdicts#account-details-field) obtained from the Play Integrity API. */
export type FirebaseGoogleFirebaseAppcheckV1PlayIntegrityConfigAccountDetailsInput =
	{
		/** Specifies whether the caller must have received the [`LICENSED` verdict](https://developer.android.com/google/play/integrity/verdicts#account-details-field). */
		requireLicensed?: boolean;
	};

/** A settings object specifying application integrity requirements for Android devices running your app. These settings correspond to requirements on the [**application integrity** field](https://developer.android.com/google/play/integrity/verdicts#application-integrity-field) obtained from the Play… */
export type FirebaseGoogleFirebaseAppcheckV1PlayIntegrityConfigAppIntegrityInput =
	{
		/** Specifies whether your running app is allowed to have the `UNRECOGNIZED_VERSION` [app recognition verdict](https://developer.android.com/google/play/integrity/verdicts#application-integrity-field). */
		allowUnrecognizedVersion?: boolean;
	};

/** A settings object specifying device integrity requirements for Android devices running your app. These settings correspond to requirements on the [**device integrity** field](https://developer.android.com/google/play/integrity/verdicts#device-integrity-field) obtained from the Play Integrity API. */
export type FirebaseGoogleFirebaseAppcheckV1PlayIntegrityConfigDeviceIntegrityInput =
	{
		/** Specifies the minimum device integrity level in order for the device to be considered valid. Any device with a device recognition verdict lower than this level will be rejected. If this is unspecified, the default level is `NO_INTEGRITY`. */
		minDeviceRecognitionLevel?:
			| 'DEVICE_RECOGNITION_LEVEL_UNSPECIFIED'
			| 'NO_INTEGRITY'
			| 'MEETS_BASIC_INTEGRITY'
			| 'MEETS_DEVICE_INTEGRITY'
			| 'MEETS_STRONG_INTEGRITY';
	};

/** A settings object specifying risk tolerance and requirements for your application. These settings correspond to requirements on the [**`riskAnalysis`**](https://cloud.google.com/recaptcha/docs/interpret-assessment-website#interpret_assessment) tuple in the assessment obtained from reCAPTCHA… */
export type FirebaseGoogleFirebaseAppcheckV1RecaptchaEnterpriseConfigRiskAnalysisInput =
	{
		/** Specifies a minimum score required for a reCAPTCHA token to be considered valid. If its score is greater than or equal to this value, it will be accepted; otherwise, it will be rejected. The value must be between 0.0 and 1.0. The default value is 0.5. */
		minValidScore?: number;
	};

/** App Check enforcement policy for a specific resource of a Google service supported by App Check. Note that this policy will override the service-level configuration. */
export type FirebaseGoogleFirebaseAppcheckV1ResourcePolicyInput = {
	/** Required. Identifier. The relative name of the resource policy object, in the format: ``` projects/{project_number}/services/{service_id}/resourcePolicies/{resource_policy_id} ``` Note that the `service_id` element must be a supported service ID. */
	name?: string;
	/** Required. The baseline protection EnforcementMode for this resource. This will override the service-level baseline protection EnforcementMode. */
	enforcementMode?: 'OFF' | 'UNENFORCED' | 'ENFORCED';
	/** This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding. This etag is strongly validated as defined by RFC 7232. */
	etag?: string;
	/** Required. Service specific name of the resource object to which this policy applies, in the format: * **iOS OAuth clients** (Google Identity for iOS): `//oauth2.googleapis.com/projects/{project_number}/oauthClients/{oauth_client_id}` Note that the resource must belong to the service specified in… */
	targetResource?: string;
};

/** The enforcement configuration for a Firebase service supported by App Check. */
export type FirebaseGoogleFirebaseAppcheckV1ServiceInput = {
	/** Required. The baseline protection EnforcementMode for this service. */
	enforcementMode?: 'OFF' | 'UNENFORCED' | 'ENFORCED';
	/** Required. The relative resource name of the service configuration object, in the format: ``` projects/{project_number}/services/{service_id} ``` Note that the `service_id` element must be a supported service ID. Currently, the following service IDs are supported. */
	name?: string;
	/** Optional. This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding. This etag is strongly validated as defined by RFC 7232. */
	etag?: string;
	/** Optional. The replay protection EnforcementMode for this service. Note that this field cannot be set to a level higher than that of baseline protection. For example, if the enforcement mode for baseline protection is set to `UNENFORCED`, this field cannot be set to `ENFORCED`. */
	replayProtection?: 'OFF' | 'UNENFORCED' | 'ENFORCED';
};

/** Request message for the UpdateResourcePolicy method as well as an individual update message for the BatchUpdateResourcePolicies method. */
export type FirebaseGoogleFirebaseAppcheckV1UpdateResourcePolicyRequestInput = {
	/** Required. A comma-separated list of names of fields in the ResourcePolicy to update. Example: `enforcement_mode`. */
	updateMask?: string;
	/** Required. The ResourcePolicy to update. The ResourcePolicy's `name` field is used to identify the ResourcePolicy to be updated, in the format: ``` projects/{project_number}/services/{service_id}/resourcePolicies/{resource_policy_id} ``` Note that the `service_id` element must be a supported service… */
	resourcePolicy?: FirebaseGoogleFirebaseAppcheckV1ResourcePolicyInput;
};

/** Request message for the UpdateService method as well as an individual update message for the BatchUpdateServices method. */
export type FirebaseGoogleFirebaseAppcheckV1UpdateServiceRequestInput = {
	/** Required. A comma-separated list of names of fields in the Service to update. Example: `enforcement_mode`. */
	updateMask?: string;
	/** Required. The Service to update. The Service's `name` field is used to identify the Service to be updated, in the format: ``` projects/{project_number}/services/{service_id} ``` Note that the `service_id` element must be a supported service ID. */
	service?: FirebaseGoogleFirebaseAppcheckV1ServiceInput;
};

/** Notes that belong to a release. */
export type FirebaseGoogleFirebaseAppdistroV1ReleaseNotesInput = {
	/** The text of the release notes. */
	text?: string;
};

/** Settings to control notification LED. */
export type FirebaseGoogleFirebaseFcmV1AndroidNotificationV2LightSettingsInput =
	{
		/** Required. Along with `light_on_duration`, define the blink rate of LED flashes. Resolution defined by [proto.Duration](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Duration) */
		lightOffDuration?: string;
		/** Required. Set `color` of the LED with [google.type.Color](https://github.com/googleapis/googleapis/blob/master/google/type/color.proto). */
		color?: FirebaseColorInput;
		/** Required. Along with `light_off_duration`, define the blink rate of LED flashes. Resolution defined by [proto.Duration](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Duration) */
		lightOnDuration?: string;
	};

/** The CMEK (Customer Managed Encryption Key) configuration for a Firestore database. If not present, the database is secured by the default Google encryption key. */
export type FirebaseGoogleFirestoreAdminV1CmekConfigInput = {
	/** Required. Only keys in the same location as this database are allowed to be used for encryption. For Firestore's nam5 multi-region, this corresponds to Cloud KMS multi-region us. For Firestore's eur3 multi-region, this corresponds to Cloud KMS multi-region europe. */
	kmsKeyName?: string;
};

/** The change stream is scoped to a collection group. Only events associated with the given collection group are visible to the Change Stream. Only a single change stream can be enabled per collection group. */
export type FirebaseGoogleFirestoreAdminV1CollectionGroupScopeInput = {
	/** Required. The collection group name. */
	collectionGroupId?: string;
};

/** The configuration options for using CMEK (Customer Managed Encryption Key) encryption. */
export type FirebaseGoogleFirestoreAdminV1CustomerManagedEncryptionOptionsInput =
	{
		/** Required. Only keys in the same location as the database are allowed to be used for encryption. For Firestore's nam5 multi-region, this corresponds to Cloud KMS multi-region us. For Firestore's eur3 multi-region, this corresponds to Cloud KMS multi-region europe. */
		kmsKeyName?: string;
	};

/** Represents a recurring schedule that runs every day. The time zone is UTC. */
export type FirebaseGoogleFirestoreAdminV1DailyRecurrenceInput = Record<
	string,
	FirebaseJsonValue
>;

/** The change stream is scoped to the entire database. All events in the database are visible to the Change Stream. One Database scope Change Stream is allowed per database. */
export type FirebaseGoogleFirestoreAdminV1DatabaseScopeInput = Record<
	string,
	FirebaseJsonValue
>;

/** The request for FirestoreAdmin.DisableUserCreds. */
export type FirebaseGoogleFirestoreAdminV1DisableUserCredsRequestInput = Record<
	string,
	FirebaseJsonValue
>;

/** The request for FirestoreAdmin.EnableUserCreds. */
export type FirebaseGoogleFirestoreAdminV1EnableUserCredsRequestInput = Record<
	string,
	FirebaseJsonValue
>;

/** Encryption configuration for a new database being created from another source. The source could be a Backup or a PitrSnapshot. */
export type FirebaseGoogleFirestoreAdminV1EncryptionConfigInput = {
	/** The database will use the same encryption configuration as the source. */
	useSourceEncryption?: FirebaseGoogleFirestoreAdminV1SourceEncryptionOptionsInput;
	/** Use Customer Managed Encryption Keys (CMEK) for encryption. */
	customerManagedEncryption?: FirebaseGoogleFirestoreAdminV1CustomerManagedEncryptionOptionsInput;
	/** Use Google default encryption. */
	googleDefaultEncryption?: FirebaseGoogleFirestoreAdminV1GoogleDefaultEncryptionOptionsInput;
};

/** An index that stores vectors in a flat data structure, and supports exhaustive search. */
export type FirebaseGoogleFirestoreAdminV1FlatIndexInput = Record<
	string,
	FirebaseJsonValue
>;

/** The configuration options for using Google default encryption. */
export type FirebaseGoogleFirestoreAdminV1GoogleDefaultEncryptionOptionsInput =
	Record<string, FirebaseJsonValue>;

/** Cloud Firestore indexes enable simple and complex queries against documents in a database. In Standard edition databases, single-field indexes are managed using the google.firestore.admin.v1.Field resource, and composite indexes are managed using the google.firestore.admin.v1.Index resource. */
export type FirebaseGoogleFirestoreAdminV1IndexInput = {
	/** Immutable. The density configuration of the index. */
	density?: 'DENSITY_UNSPECIFIED' | 'SPARSE_ALL' | 'SPARSE_ANY' | 'DENSE';
	/** Optional. Options for search indexes that are at the index definition level. This field is only currently supported for indexes with MONGODB_COMPATIBLE_API ApiScope. */
	searchIndexOptions?: FirebaseGoogleFirestoreAdminV1SearchIndexOptionsInput;
	/** Optional. Whether the index is multikey. By default, the index is not multikey. For non-multikey indexes, none of the paths in the index definition reach or traverse an array, except via an explicit array index. */
	multikey?: boolean;
	/** Output only. The serving state of the index. */
	state?: 'STATE_UNSPECIFIED' | 'CREATING' | 'READY' | 'NEEDS_REPAIR';
	/** Optional. Whether it is an unique index. Unique index ensures all values for the indexed field(s) are unique across documents. */
	unique?: boolean;
	/** Indexes with a collection query scope specified allow queries against a collection that is the child of a specific document, specified at query time, and that has the same collection ID. */
	queryScope?:
		| 'QUERY_SCOPE_UNSPECIFIED'
		| 'COLLECTION'
		| 'COLLECTION_GROUP'
		| 'COLLECTION_RECURSIVE';
	/** The API scope supported by this index. */
	apiScope?: 'ANY_API' | 'DATASTORE_MODE_API' | 'MONGODB_COMPATIBLE_API';
	/** A server-defined name for this index. Output only. When used in the google.firestore.admin.v1.Index resource, the value is of the form: `projects/{project_id}/databases/{database_id}/collectionGroups/{collection_id}/indexes/{index_id}` When used in the google.firestore.admin.v1.Field resource, the… */
	name?: string;
	/** Optional. The number of physical shards for the index. In Cloud Firestore, data and index entries are stored in contiguous, ordered key ranges called splits. */
	shardCount?: number;
	/** The fields supported by this index. At most 100 fields may be specified. In Standard edition databases only: - At least 2 fields must be specified. - The last field entry is always for the field path `__name__`. */
	fields?: Array<FirebaseGoogleFirestoreAdminV1IndexFieldInput>;
};

/** The index configuration for this field. */
export type FirebaseGoogleFirestoreAdminV1IndexConfigInput = {
	/** Output only When true, the `Field`'s index configuration is in the process of being reverted. Once complete, the index config will transition to the same state as the field specified by `ancestor_field`, at which point `uses_ancestor_config` will be `true` and `reverting` will be `false`. */
	reverting?: boolean;
	/** Output only. When true, the `Field`'s index configuration is set from the configuration specified by the `ancestor_field`. When false, the `Field`'s index configuration is defined explicitly. */
	usesAncestorConfig?: boolean;
	/** Output only. Specifies the resource name of the `Field` from which this field's index configuration is set (when `uses_ancestor_config` is true), or from which it *would* be set if this field had no index configuration (when `uses_ancestor_config` is false). */
	ancestorField?: string;
	/** The indexes supported for this field. */
	indexes?: Array<FirebaseGoogleFirestoreAdminV1IndexInput>;
};

/** A field in an index. The field_path describes which field is indexed, the value_mode describes how the field value is indexed. */
export type FirebaseGoogleFirestoreAdminV1IndexFieldInput = {
	/** Indicates that this field supports search operations. */
	searchConfig?: FirebaseGoogleFirestoreAdminV1SearchConfigInput;
	/** Indicates that this field supports nearest neighbor and distance operations on vector. */
	vectorConfig?: FirebaseGoogleFirestoreAdminV1VectorConfigInput;
	/** Can be __name__. For single field indexes, this must match the name of the field or may be omitted. */
	fieldPath?: string;
	/** Indicates that this field supports ordering by the specified order or comparing using =, !=, <, <=, >, >=. */
	order?: 'ORDER_UNSPECIFIED' | 'ASCENDING' | 'DESCENDING';
	/** Indicates that this field supports operations on `array_value`s. */
	arrayConfig?: 'ARRAY_CONFIG_UNSPECIFIED' | 'CONTAINS';
};

/** A consistent snapshot of a database at a specific point in time. A PITR (Point-in-time recovery) snapshot with previous versions of a database's data is available for every minute up to the associated database's data retention period. */
export type FirebaseGoogleFirestoreAdminV1PitrSnapshotInput = {
	/** Required. Snapshot time of the database. */
	snapshotTime?: string;
	/** Required. The name of the database that this was a snapshot of. Format: `projects/{project}/databases/{database}`. */
	database?: string;
};

/** The request for FirestoreAdmin.ResetUserPassword. */
export type FirebaseGoogleFirestoreAdminV1ResetUserPasswordRequestInput =
	Record<string, FirebaseJsonValue>;

/** Describes a Resource Identity principal. */
export type FirebaseGoogleFirestoreAdminV1ResourceIdentityInput = Record<
	string,
	FirebaseJsonValue
>;

/** The configuration for how to index a field for search. */
export type FirebaseGoogleFirestoreAdminV1SearchConfigInput = {
	/** Optional. The specification for building a geo search index for a field. */
	geoSpec?: FirebaseGoogleFirestoreAdminV1SearchGeoSpecInput;
	/** Optional. The specification for building a text search index for a field. */
	textSpec?: FirebaseGoogleFirestoreAdminV1SearchTextSpecInput;
};

/** The specification for how to build a geo search index for a field. */
export type FirebaseGoogleFirestoreAdminV1SearchGeoSpecInput = {
	/** Optional. Disables geoJSON indexing for the field. By default, geoJSON points are indexed. Firestore GeoPoints are indexed regardless of the value of this field. */
	geoJsonIndexingDisabled?: boolean;
};

/** Options for search indexes at the definition level. */
export type FirebaseGoogleFirestoreAdminV1SearchIndexOptionsInput = {
	/** Optional. The field in the document that specifies which language to use for that specific document. For indexes with MONGODB_COMPATIBLE_API ApiScope: if unspecified, the language is taken from the "language" field if it exists or from `text_language` if it does not. */
	textLanguageOverrideFieldPath?: string;
	/** Optional. The language to use for text search indexes. Used as the default language if not overridden at the document level by specifying the `text_language_override_field`. The language is specified as a BCP 47 language code. */
	textLanguage?: string;
};

/** Specification of how the field should be indexed for search text indexes. */
export type FirebaseGoogleFirestoreAdminV1SearchTextIndexSpecInput = {
	/** Required. How to match the text field value. */
	matchType?: 'TEXT_MATCH_TYPE_UNSPECIFIED' | 'MATCH_GLOBALLY';
	/** Required. How to index the text field value. */
	indexType?: 'TEXT_INDEX_TYPE_UNSPECIFIED' | 'TOKENIZED';
};

/** The specification for how to build a text search index for a field. */
export type FirebaseGoogleFirestoreAdminV1SearchTextSpecInput = {
	/** Required. Specifications for how the field should be indexed. Repeated so that the field can be indexed in multiple ways. */
	indexSpecs?: Array<FirebaseGoogleFirestoreAdminV1SearchTextIndexSpecInput>;
};

/** The configuration options for using the same encryption method as the source. */
export type FirebaseGoogleFirestoreAdminV1SourceEncryptionOptionsInput = Record<
	string,
	FirebaseJsonValue
>;

/** The TTL (time-to-live) configuration for documents that have this `Field` set. A timestamp stored in a TTL-enabled field will be used to determine the expiration time of the document. The expiration time is the sum of the timestamp value and the `expiration_offset`. */
export type FirebaseGoogleFirestoreAdminV1TtlConfigInput = {
	/** Optional. The offset, relative to the timestamp value from the TTL-enabled field, used to determine the document's expiration time. `expiration_offset.seconds` must be between 0 and 2,147,483,647 inclusive. Values more precise than seconds are rejected. */
	expirationOffset?: string;
};

/** The index configuration to support vector search operations */
export type FirebaseGoogleFirestoreAdminV1VectorConfigInput = {
	/** Indicates the vector index is a flat index. */
	flat?: FirebaseGoogleFirestoreAdminV1FlatIndexInput;
	/** Required. The vector dimension this configuration applies to. The resulting index will only include vectors of this dimension, and can be used for vector search with the same dimension. */
	dimension?: number;
};

/** Represents a recurring schedule that runs on a specified day of the week. The time zone is UTC. */
export type FirebaseGoogleFirestoreAdminV1WeeklyRecurrenceInput = {
	/** The day of week to run. DAY_OF_WEEK_UNSPECIFIED is not allowed. */
	day?:
		| 'DAY_OF_WEEK_UNSPECIFIED'
		| 'MONDAY'
		| 'TUESDAY'
		| 'WEDNESDAY'
		| 'THURSDAY'
		| 'FRIDAY'
		| 'SATURDAY'
		| 'SUNDAY';
};

/** Specifies the audit configuration for a service. The configuration determines which permission types are logged, and what identities, if any, are exempted from logging. An AuditConfig must have one or more AuditLogConfigs. */
export type FirebaseGoogleIamV1AuditConfigInput = {
	/** Specifies a service that will be enabled for audit logging. For example, `storage.googleapis.com`, `cloudsql.googleapis.com`. `allServices` is a special value that covers all services. */
	service?: string;
	/** The configuration for logging of each type of permission. */
	auditLogConfigs?: Array<FirebaseGoogleIamV1AuditLogConfigInput>;
};

/** Provides the configuration for logging a type of permissions. Example: { "audit_log_configs": [ { "log_type": "DATA_READ", "exempted_members"… */
export type FirebaseGoogleIamV1AuditLogConfigInput = {
	/** The log type that this config enables. */
	logType?: 'LOG_TYPE_UNSPECIFIED' | 'ADMIN_READ' | 'DATA_WRITE' | 'DATA_READ';
	/** Specifies the identities that do not cause logging for this type of permission. Follows the same format of Binding.members. */
	exemptedMembers?: Array<string>;
};

/** Associates `members`, or principals, with a `role`. */
export type FirebaseGoogleIamV1BindingInput = {
	/** The condition that is associated with this binding. If the condition evaluates to `true`, then this binding applies to the current request. If the condition evaluates to `false`, then this binding does not apply to the current request. */
	condition?: FirebaseGoogleTypeExprInput;
	/** Role that is assigned to the list of `members`, or principals. For example, `roles/viewer`, `roles/editor`, or `roles/owner`. For an overview of the IAM roles and permissions, see the [IAM documentation](https://cloud.google.com/iam/docs/roles-overview). */
	role?: string;
	/** Specifies the principals requesting access for a Google Cloud resource. `members` can have the following values: * `allUsers`: A special identifier that represents anyone who is on the internet; with or without a Google account. */
	members?: Array<string>;
};

/** Encapsulates settings provided to GetIamPolicy. */
export type FirebaseGoogleIamV1GetPolicyOptionsInput = {
	/** Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. */
	requestedPolicyVersion?: number;
};

/** An Identity and Access Management (IAM) policy, which specifies access controls for Google Cloud resources. A `Policy` is a collection of `bindings`. A `binding` binds one or more `members`, or principals, to a single `role`. */
export type FirebaseGoogleIamV1PolicyInput = {
	/** Specifies cloud audit logging configuration for this policy. */
	auditConfigs?: Array<FirebaseGoogleIamV1AuditConfigInput>;
	/** Specifies the format of the policy. Valid values are `0`, `1`, and `3`. Requests that specify an invalid value are rejected. Any operation that affects conditional role bindings must specify version `3`. */
	version?: number;
	/** Associates a list of `members`, or principals, with a `role`. Optionally, may specify a `condition` that determines how and when the `bindings` are applied. Each of the `bindings` must contain at least one principal. */
	bindings?: Array<FirebaseGoogleIamV1BindingInput>;
	/** `etag` is used for optimistic concurrency control as a way to help prevent simultaneous updates of a policy from overwriting each other. */
	etag?: string;
};

/** Represents a textual expression in the Common Expression Language (CEL) syntax. CEL is a C-like expression language. The syntax and semantics of CEL are documented at https://github.com/google/cel-spec. */
export type FirebaseGoogleTypeExprInput = {
	/** Optional. Description of the expression. This is a longer text which describes the expression, e.g. when hovered over it in a UI. */
	description?: string;
	/** Optional. String indicating the location of the expression for error reporting, e.g. a file name and a position in the file. */
	location?: string;
	/** Optional. Title for the expression, i.e. a short string describing its purpose. This can be used e.g. in UIs which allow to enter the expression. */
	title?: string;
	/** Textual representation of an expression in Common Expression Language syntax. */
	expression?: string;
};

/** A [`Header`](https://firebase.google.com/docs/hosting/full-config#headers) specifies a URL pattern that, if matched to the request URL path, triggers Hosting to apply the specified custom response headers. */
export type FirebaseHeaderInput = {
	/** The user-supplied [glob](https://firebase.google.com/docs/hosting/full-config#glob_pattern_matching) to match against the request URL path. */
	glob?: string;
	/** Required. The additional headers to add to the response. */
	headers?: Record<string, string>;
	/** The user-supplied RE2 regular expression to match against the request URL path. */
	regex?: string;
};

/** If provided, i18n rewrites are enabled. */
export type FirebaseI18nConfigInput = {
	/** Required. The user-supplied path where country and language specific content will be looked for within the public directory. */
	root?: string;
};

/** An object that represents a latitude/longitude pair. This is expressed as a pair of doubles to represent degrees latitude and degrees longitude. Unless specified otherwise, this object must conform to the WGS84 standard. Values must be within normalized ranges. */
export type FirebaseLatLngInput = {
	/** The latitude in degrees. It must be in the range [-90.0, +90.0]. */
	latitude?: number;
	/** The longitude in degrees. It must be in the range [-180.0, +180.0]. */
	longitude?: number;
};

/** Settings to control notification LED. */
export type FirebaseLightSettingsInput = {
	/** Required. Along with `light_on_duration`, define the blink rate of LED flashes. Resolution defined by [proto.Duration](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Duration) */
	lightOffDuration?: string;
	/** Required. Set `color` of the LED with [google.type.Color](https://github.com/googleapis/googleapis/blob/master/google/type/color.proto). */
	color?: FirebaseColorInput;
	/** Required. Along with `light_off_duration`, define the blink rate of LED flashes. Resolution defined by [proto.Duration](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Duration) */
	lightOnDuration?: string;
};

/** Message to send by Firebase Cloud Messaging Service. */
export type FirebaseMessageInput = {
	/** Output Only. The identifier of the message sent, in the format of `projects/*\/messages/{message_id}`. */
	name?: string;
	/** Input only. Basic notification template to use across all platforms. */
	notification?: FirebaseMessagingNotificationInput;
	/** Input only. Android specific options for messages sent through [FCM connection server](https://goo.gl/4GLdUl). */
	android?: FirebaseAndroidConfigInput;
	/** Input only. [Webpush protocol](https://tools.ietf.org/html/rfc8030) options. */
	webpush?: FirebaseWebpushConfigInput;
	/** Input only. Arbitrary key/value payload, which must be UTF-8 encoded. The key should not be a reserved word ("from", "message_type", or any word starting with "google." or "gcm.notification."). */
	data?: Record<string, string>;
	/** Input only. [Apple Push Notification Service](https://goo.gl/MXRTPa) specific options. */
	apns?: FirebaseApnsConfigInput;
	/** Input only. Template for FCM SDK feature options to use across all platforms. */
	fcmOptions?: FirebaseFcmOptionsInput;
	/** Deprecated: Use `fid` instead. During the transition period, this field also accepts a Firebase Installation ID (FID). Registration token to send a message to. */
	token?: string;
	/** Topic name to send a message to, e.g. "weather". Note: "/topics/" prefix should not be provided. */
	topic?: string;
	/** Firebase Installation ID (FID) to send a message to. */
	fid?: string;
	/** Condition to send a message to, e.g. "'foo' in topics && 'bar' in topics". */
	condition?: string;
	/** Optional. Input only. Android specific V2 options for messages sent through FCM connection server. Mutually exclusive with `android`. Requests with both `AndroidConfig` and `AndroidConfigV2` will be rejected. */
	androidV2?: FirebaseAndroidConfigV2Input;
};

/** An object. */
export type FirebaseObjectInput = {
	/** Access controls on the object. */
	acl?: Array<FirebaseObjectAccessControlInput>;
	/** The name of the bucket containing this object. */
	bucket?: string;
	/** Cache-Control directive for the object data. If omitted, and the object is accessible to all anonymous users, the default will be public, max-age=3600. */
	cacheControl?: string;
	/** Number of underlying components that make up this object. Components are accumulated by compose operations. */
	componentCount?: number;
	/** Content-Disposition of the object data. */
	contentDisposition?: string;
	/** Content-Encoding of the object data. */
	contentEncoding?: string;
	/** Content-Language of the object data. */
	contentLanguage?: string;
	/** Content-Type of the object data. If an object is stored without a Content-Type, it is served as application/octet-stream. */
	contentType?: string;
	/** CRC32c checksum, as described in RFC 4960, Appendix B; encoded using base64 in big-endian byte order. For more information about using the CRC32c checksum, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation). */
	crc32c?: string;
	/** A timestamp in RFC 3339 format specified by the user for an object. */
	customTime?: string;
	/** Metadata of customer-supplied encryption key, if the object is encrypted by such a key. */
	customerEncryption?: {
		/** The encryption algorithm. */
		encryptionAlgorithm?: string;
		/** SHA256 hash value of the encryption key. */
		keySha256?: string;
	};
	/** HTTP 1.1 Entity tag for the object. */
	etag?: string;
	/** Whether an object is under event-based hold. Event-based hold is a way to retain objects until an event occurs, which is signified by the hold's release (i.e. this value is set to false). After being released (set to false), such objects will be subject to bucket-level retention (if any). */
	eventBasedHold?: boolean;
	/** The content generation of this object. Used for object versioning. */
	generation?: string | number;
	/** The ID of the object, including the bucket name, object name, and generation number. */
	id?: string;
	/** The kind of item this is. For objects, this is always storage#object. */
	kind?: string;
	/** Not currently supported. Specifying the parameter causes the request to fail with status code 400 - Bad Request. */
	kmsKeyName?: string;
	/** MD5 hash of the data; encoded using base64. For more information about using the MD5 hash, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation). */
	md5Hash?: string;
	/** Media download link. */
	mediaLink?: string;
	/** User-provided metadata, in key/value pairs. On a patch, a key set to null deletes that entry and `metadata: null` deletes them all. */
	metadata?: Record<string, string | null> | null;
	/** User-defined or system-defined object contexts. Each object context is a key-payload pair, where the key provides the identification and the payload holds the associated value and additional metadata. */
	contexts?: {
		/** User-defined object contexts. */
		custom?: Record<string, FirebaseObjectCustomContextPayloadInput>;
	};
	/** Restore token used to differentiate deleted objects with the same name and generation. This field is only returned for deleted objects in hierarchical namespace buckets. */
	restoreToken?: string;
	/** The version of the metadata for this object at this generation. Used for preconditions and for detecting changes in metadata. A metageneration number is only meaningful in the context of a particular generation of a particular object. */
	metageneration?: string | number;
	/** The name of the object. Required if not specified by URL parameter. */
	name?: string;
	/** The owner of the object. This will always be the uploader of the object. */
	owner?: {
		/** The entity, in the form user-userId. */
		entity?: string;
		/** The ID for the entity. */
		entityId?: string;
	};
	/** A server-determined value that specifies the earliest time that the object's retention period expires. This value is in RFC 3339 format. Note 1: This field is not provided for objects with an active event-based hold, since retention expiration is unknown until the hold is removed. */
	retentionExpirationTime?: string;
	/** A collection of object level retention parameters. */
	retention?: {
		/** A time in RFC 3339 format until which object retention protects this object. */
		retainUntilTime?: string;
		/** The bucket's object retention mode, can only be Unlocked or Locked. */
		mode?: string;
	};
	/** The link to this object. */
	selfLink?: string;
	/** Content-Length of the data in bytes. */
	size?: string | number;
	/** Storage class of the object. */
	storageClass?: string;
	/** Whether an object is under temporary hold. While this flag is set to true, the object is protected against deletion and overwrites. A common use case of this flag is regulatory investigations where objects need to be retained while the investigation is ongoing. */
	temporaryHold?: boolean;
	/** The creation time of the object in RFC 3339 format. */
	timeCreated?: string;
	/** The time at which the object became noncurrent in RFC 3339 format. Will be returned if and only if this version of the object has been deleted. */
	timeDeleted?: string;
	/** The time when the object was finalized. */
	timeFinalized?: string;
	/** The time at which the object became soft-deleted in RFC 3339 format. */
	softDeleteTime?: string;
	/** This is the time (in the future) when the soft-deleted object will no longer be restorable. It is equal to the soft delete time plus the current soft delete retention duration of the bucket. */
	hardDeleteTime?: string;
	/** The time at which the object's storage class was last changed. When the object is initially created, it will be set to timeCreated. */
	timeStorageClassUpdated?: string;
	/** The modification time of the object metadata in RFC 3339 format. Set initially to object creation time and then updated whenever any metadata of the object changes. */
	updated?: string;
	/** Information about the object's availability in Rapid Cache Ultra (RCU) zonal caches. This field will only populate once the object is loaded into the cache. */
	zonalAvailabilityInfo?: {
		/** A list of zones where the object has a zonal copy. The zone names are expected to be in lower-dash case format (e.g., 'us-central1-a'). */
		availableZones?: Array<string>;
	};
};

/** An access-control entry. */
export type FirebaseObjectAccessControlInput = {
	/** The name of the bucket. */
	bucket?: string;
	/** The domain associated with the entity, if any. */
	domain?: string;
	/** The email address associated with the entity, if any. */
	email?: string;
	/** The entity holding the permission, in one of the following forms: - user-userId - user-email - group-groupId - group-email - domain-domain - project-team-projectId - allUsers - allAuthenticatedUsers Examples: - The user liz@example.com would be user-liz@example.com. */
	entity?: string;
	/** The ID for the entity, if any. */
	entityId?: string;
	/** HTTP 1.1 Entity tag for the access-control entry. */
	etag?: string;
	/** The content generation of the object, if applied to an object. */
	generation?: string | number;
	/** The ID of the access-control entry. */
	id?: string;
	/** The kind of item this is. For object access control entries, this is always storage#objectAccessControl. */
	kind?: string;
	/** The name of the object, if applied to an object. */
	object?: string;
	/** The project team associated with the entity, if any. */
	projectTeam?: {
		/** The project number. */
		projectNumber?: string;
		/** The team. */
		team?: string;
	};
	/** The access permission for the entity. */
	role?: string;
	/** The link to this access-control entry. */
	selfLink?: string;
};

/** The payload of a single user-defined object context. */
export type FirebaseObjectCustomContextPayloadInput = {
	/** The value of the object context. */
	value?: string;
	/** The time at which the object context was created in RFC 3339 format. */
	createTime?: string;
	/** The time at which the object context was last updated in RFC 3339 format. */
	updateTime?: string;
	/** The type URL of the object context's extended data. */
	extendedDataTypeUrl?: string;
};

/** An order on a field. */
export type FirebaseOrderInput = {
	/** The field to order by. */
	field?: FirebaseFieldReferenceInput;
	/** The direction to order by. Defaults to `ASCENDING`. */
	direction?: 'DIRECTION_UNSPECIFIED' | 'ASCENDING' | 'DESCENDING';
};

/** A representation of filter path. */
export type FirebasePathFilterInput = {
	/** An array of RegEx values by which to filter. */
	regexes?: Array<string>;
};

/** Contains the necessary information to fetch a personalized value. */
export type FirebasePersonalizationValueInput = {
	/** Identifier that represents a personalization definition. This definition is used to resolve the value at config fetch time. This system-generated value should not be modified. */
	personalizationId?: string;
};

/** A Firestore query represented as an ordered list of operations / stages. */
export type FirebasePipelineInput = {
	/** Required. Ordered list of stages to evaluate. */
	stages?: Array<FirebaseStageInput>;
};

/** A precondition on a document, used for conditional operations. */
export type FirebasePreconditionInput = {
	/** When set, the target document must exist and have been last updated at that time. Timestamp must be microsecond aligned. */
	updateTime?: string;
	/** When set to `true`, the target document must exist. When set to `false`, the target document must not exist. */
	exists?: boolean;
};

/** The projection of document's fields to return. */
export type FirebaseProjectionInput = {
	/** The fields to return. If empty, all fields are returned. To only return the name of the document, use `['__name__']`. */
	fields?: Array<FirebaseFieldReferenceInput>;
};

/** Options for a transaction that can only be used to read documents. */
export type FirebaseReadOnlyInput = {
	/** Reads documents at the given time. This must be a microsecond precision timestamp within the past one hour, or if Point-in-Time Recovery is enabled, can additionally be a whole minute timestamp within the past 7 days. */
	readTime?: string;
};

/** Options for a transaction that can be used to read and write documents. */
export type FirebaseReadWriteInput = {
	/** An optional transaction to retry. (base64) */
	retryTransaction?: string;
	/** Optional. The concurrency control mode to use for this transaction. A database is able to use different concurrency modes for different transactions simultaneously. */
	concurrencyMode?:
		| 'CONCURRENCY_MODE_UNSPECIFIED'
		| 'OPTIMISTIC'
		| 'PESSIMISTIC';
};

/** A [`Redirect`](https://firebase.google.com/docs/hosting/full-config#redirects) specifies a URL pattern that, if matched to the request URL path, triggers Hosting to respond with a redirect to the specified destination path. */
export type FirebaseRedirectInput = {
	/** The user-supplied [glob](https://firebase.google.com/docs/hosting/full-config#glob_pattern_matching) to match against the request URL path. */
	glob?: string;
	/** Required. The status HTTP code to return in the response. It must be a valid 3xx status code. */
	statusCode?: number;
	/** Required. The value to put in the HTTP location header of the response. The location can contain capture group values from the pattern using a `:` prefix to identify the segment and an optional `*` to capture the rest of the URL. */
	location?: string;
	/** The user-supplied RE2 regular expression to match against the request URL path. */
	regex?: string;
};

/** The request sent to the ReenableDatabaseInstance method. */
export type FirebaseReenableDatabaseInstanceRequestInput = Record<
	string,
	FirebaseJsonValue
>;

/** A condition targeting a specific group of users. A list of these conditions make up part of a RemoteConfig object. */
export type FirebaseRemoteConfigConditionInput = {
	/** Required. The logic of this condition. See the documentation regarding Condition Expressions for the expected syntax of this field. */
	expression?: string;
	/** Required. Identifier. A non-empty and unique name of this condition. Format: projects/{project}/namespaces/{namespace}/remoteConfigConditions/{remote_config_condition} When used within RemoteConfig.conditions, this field may contain just the condition name. */
	name?: string;
	/** The current ETag of the condition for optimistic concurrency. */
	etag?: string;
	/** Optional. The color associated with this condition for display purposes in the Firebase Console. Not specifying this value or having "CONDITION_DISPLAY_COLOR_UNSPECIFIED" results in the Console picking an arbitrary color to associate with the condition. */
	tagColor?:
		| 'CONDITION_DISPLAY_COLOR_UNSPECIFIED'
		| 'BLUE'
		| 'BROWN'
		| 'CYAN'
		| 'DEEP_ORANGE'
		| 'GREEN'
		| 'INDIGO'
		| 'LIME'
		| 'ORANGE'
		| 'PINK'
		| 'PURPLE'
		| 'TEAL';
};

/** A parameter value associated with a parameter key in google.firebase.remoteconfig.v1.RemoteConfig.parameters. At minimum, a `default_value` or a `conditional_values` entry should be present for the parameter to have any effect. */
export type FirebaseRemoteConfigParameterInput = {
	/** Optional. Optional - a (condition name, value) map. The condition_name of the highest priority (the one listed first in the RemoteConfig's conditions list) determines the value of this parameter. */
	conditionalValues?: Record<string, FirebaseRemoteConfigParameterValueInput>;
	/** Optional. Identifier. The resource name of the parameter. Format: projects/{project}/namespaces/{namespace}/remoteConfigParameters/{remote_config_parameter} NOTE: Retained as field number 5 to preserve strict backwards wire-compatibility with existing RemoteConfig.parameters map definitions. */
	name?: string;
	/** The current ETag of the parameter for optimistic concurrency. */
	etag?: string;
	/** Optional. Optional - value to set the parameter to, when none of the named conditions evaluate to `true`. */
	defaultValue?: FirebaseRemoteConfigParameterValueInput;
	/** Optional. The data type for all values of this parameter in the current version of the template. Defaults to `ParameterValueType.STRING` if unspecified. */
	valueType?:
		| 'PARAMETER_VALUE_TYPE_UNSPECIFIED'
		| 'STRING'
		| 'BOOLEAN'
		| 'NUMBER'
		| 'JSON';
	/** Optional. A description for this Parameter. Its length must be less than or equal to 256 characters . A description may contain any Unicode characters. */
	description?: string;
};

/** A named group of parameters. Grouping parameters is only for management purposes and does not affect client-side fetching of parameter values. */
export type FirebaseRemoteConfigParameterGroupInput = {
	/** Optional. Map of parameter keys to their optional default values and optional conditional values for parameters that belong to this group. */
	parameters?: Record<string, FirebaseRemoteConfigParameterInput>;
	/** Optional. A description for the group. Its length must be less than or equal to 256 characters. A description may contain any Unicode characters. */
	description?: string;
	/** Optional. Identifier. The resource name of the parameter group. Format: projects/{project}/namespaces/{namespace}/remoteConfigParameterGroups/{remote_config_parameter_group} */
	name?: string;
	/** The current ETag of the parameter group for optimistic concurrency. */
	etag?: string;
};

/** A RemoteConfigParameterValue resource contains the value that a parameter may have. */
export type FirebaseRemoteConfigParameterValueInput = {
	/** A dynamic, user-specific value computed when config is fetched. */
	personalizationValue?: FirebasePersonalizationValueInput;
	/** Optional. The string value that the parameter is set to. */
	value?: string;
	/** A dynamic value managed by the Firebase ABT Experiment service. */
	experimentValue?: FirebaseExperimentValueInput;
	/** A dynamic Rollout value managed by the Firebase ABT Experiment service. */
	rolloutValue?: FirebaseRolloutValueInput;
	/** If true, the parameter is omitted from the parameter values returned to a client. */
	useInAppDefault?: boolean;
};

/** All the fields associated with the person/service account that wrote a Remote Config template. */
export type FirebaseRemoteConfigUserInput = {
	/** Output only. Email address. */
	email?: string;
	/** Output only. Image URL. */
	imageUrl?: string;
	/** Output only. Display name. */
	name?: string;
};

/** The request used to unlink a Google Cloud Storage bucket from a Firebase project. */
export type FirebaseRemoveFirebaseRequestInput = Record<
	string,
	FirebaseJsonValue
>;

/** Options for a request. */
export type FirebaseRequestOptionsInput = {
	/** Optional. The request tags for the request. Request tags are user-provided strings used for usage monitoring, cost management, and observability. Callers can associate custom application context (such as component, microservice, feature name, or operation type) with database requests. */
	requestTags?: Array<string>;
};

/** Possible result values from the function mock invocation. */
export type FirebaseResultInput = {
	/** The result is undefined, meaning the result could not be computed. */
	undefined?: FirebaseRulesEmptyInput;
	/** The result is an actual value. The type of the value must match that of the type declared by the service. */
	value?: FirebaseJsonValue;
};

/** A [`Rewrite`](https://firebase.google.com/docs/hosting/full-config#rewrites) specifies a URL pattern that, if matched to the request URL path, triggers Hosting to respond as if the service were given the specified destination URL. */
export type FirebaseRewriteInput = {
	/** Optional. Specify a Cloud region for rewritten Functions invocations. If not provided, defaults to us-central1. */
	functionRegion?: string;
	/** The user-supplied RE2 regular expression to match against the request URL path. */
	regex?: string;
	/** The request will be forwarded to Firebase Dynamic Links. */
	dynamicLinks?: boolean;
	/** The URL path to rewrite the request to. */
	path?: string;
	/** The function to proxy requests to. Must match the exported function name exactly. */
	function?: string;
	/** The request will be forwarded to Cloud Run. */
	run?: FirebaseCloudRunRewriteInput;
	/** The user-supplied [glob](https://firebase.google.com/docs/hosting/full-config#glob_pattern_matching) to match against the request URL path. */
	glob?: string;
};

/** Information related to a Rollout. */
export type FirebaseRolloutValueInput = {
	/** Optional. The user-specified value to be rolled out. */
	value?: string;
	/** The percentage of users that will receive the rollout value. */
	percent?: number;
	/** The identifier that associates a parameter value to a Rollout experiment. */
	rolloutId?: string;
};

/** The configuration for how incoming requests to a site should be routed and processed before serving content. */
export type FirebaseServingConfigInput = {
	/** Defines how to handle a trailing slash in the URL path. */
	trailingSlashBehavior?:
		| 'TRAILING_SLASH_BEHAVIOR_UNSPECIFIED'
		| 'ADD'
		| 'REMOVE';
	/** An array of objects (called redirect rules), where each rule specifies a URL pattern that, if matched to the request URL path, triggers Hosting to respond with a redirect to the specified destination path. */
	redirects?: Array<FirebaseRedirectInput>;
	/** Defines whether to drop the file extension from uploaded files. */
	cleanUrls?: boolean;
	/** An array of objects (called rewrite rules), where each rule specifies a URL pattern that, if matched to the request URL path, triggers Hosting to respond as if the service were given the specified destination URL. */
	rewrites?: Array<FirebaseRewriteInput>;
	/** An array of objects, where each object specifies a URL pattern that, if matched to the request URL path, triggers Hosting to apply the specified custom response headers. */
	headers?: Array<FirebaseHeaderInput>;
	/** Optional. Defines i18n rewrite behavior. */
	i18n?: FirebaseI18nConfigInput;
	/** How to handle well known App Association files. */
	appAssociation?: 'AUTO' | 'NONE';
};

/** `Source` is one or more `File` messages comprising a logical set of rules. */
export type FirebaseSourceInput = {
	/** Required. `File` set constituting the `Source` bundle. */
	files?: Array<FirebaseFileInput>;
};

/** A single operation within a pipeline. A stage is made up of a unique name, and a list of arguments. The exact number of arguments & types is dependent on the stage type. */
export type FirebaseStageInput = {
	/** Optional. Ordered list of arguments the given stage expects. */
	args?: Array<FirebaseValueInput>;
	/** Optional. Optional named arguments that certain functions may support. */
	options?: Record<string, FirebaseValueInput>;
	/** Required. The name of the stage to evaluate. **Requires:** * must be in snake case (lower case with underscore separator). */
	name?: string;
};

/** Firestore query for running an aggregation over a StructuredQuery. */
export type FirebaseStructuredAggregationQueryInput = {
	/** Optional. Series of aggregations to apply over the results of the `structured_query`. Requires: * A minimum of one and maximum of five aggregations per query. */
	aggregations?: Array<FirebaseAggregationInput>;
	/** Nested structured query. */
	structuredQuery?: FirebaseStructuredQueryInput;
};

/** A Firestore query represented as an ordered list of operations / stages. This is considered the top-level function which plans and executes a query. It is logically equivalent to `query(stages, options)`, but prevents the client from having to build a function wrapper. */
export type FirebaseStructuredPipelineInput = {
	/** Optional. Optional query-level arguments. */
	options?: Record<string, FirebaseValueInput>;
	/** Required. The pipeline query to execute. */
	pipeline?: FirebasePipelineInput;
};

/** A Firestore query. The query stages are executed in the following order: 1. from 2. where 3. select 4. order_by + start_at + end_at 5. offset 6. limit 7. find_nearest */
export type FirebaseStructuredQueryInput = {
	/** A potential prefix of a position in the result set to end the query at. This is similar to `START_AT` but with it controlling the end position rather than the start position. Requires: * The number of values cannot be greater than the number of fields specified in the `ORDER BY` clause. */
	endAt?: FirebaseCursorInput;
	/** A potential prefix of a position in the result set to start the query at. The ordering of the result set is based on the `ORDER BY` clause of the original query. ``` SELECT * FROM k WHERE a = 1 AND b > 2 ORDER BY b ASC, __name__ ASC; ``` This query's results are ordered by `(b ASC, __name__ ASC)`. */
	startAt?: FirebaseCursorInput;
	/** The collections to query. */
	from?: Array<FirebaseCollectionSelectorInput>;
	/** The number of documents to skip before returning the first result. This applies after the constraints specified by the `WHERE`, `START AT`, & `END AT` but before the `LIMIT` clause. Requires: * The value must be greater than or equal to zero if specified. */
	offset?: number;
	/** The filter to apply. */
	where?: FirebaseFilterInput;
	/** Optional sub-set of the fields to return. This acts as a DocumentMask over the documents returned from a query. When not set, assumes that the caller wants all fields returned. */
	select?: FirebaseProjectionInput;
	/** The order to apply to the query results. Callers can provide a full ordering, a partial ordering, or no ordering at all. */
	orderBy?: Array<FirebaseOrderInput>;
	/** The maximum number of results to return. Applies after all other constraints. Requires: * The value must be greater than or equal to zero if specified. */
	limit?: number;
	/** Optional. A potential nearest neighbors search. Applies after all other filters and ordering. Finds the closest vector embeddings to the given query vector. */
	findNearest?: FirebaseFindNearestInput;
};

/** Sum of the values of the requested field. * Only numeric values will be aggregated. All non-numeric values including `NULL` are skipped. * If the aggregated values contain `NaN`, returns `NaN`. Infinity math follows IEEE-754 standards. * If the aggregated value set is empty, returns 0. */
export type FirebaseSumInput = {
	/** The field to aggregate on. */
	field?: FirebaseFieldReferenceInput;
};

/** `TestCase` messages provide the request context and an expectation as to whether the given context will be allowed or denied. Test cases may specify the `request`, `resource`, and `function_mocks` to mock a function call to a service-provided function. */
export type FirebaseTestCaseInput = {
	/** Test expectation. */
	expectation?: 'EXPECTATION_UNSPECIFIED' | 'ALLOW' | 'DENY';
	/** Request context. The exact format of the request context is service-dependent. See the appropriate service documentation for information about the supported fields and types on the request. */
	request?: FirebaseJsonValue;
	/** Specifies whether paths (such as request.path) are encoded and how. */
	pathEncoding?: 'ENCODING_UNSPECIFIED' | 'URL_ENCODED' | 'PLAIN';
	/** Optional resource value as it appears in persistent storage before the request is fulfilled. The resource type depends on the `request.path` value. */
	resource?: FirebaseJsonValue;
	/** Optional function mocks for service-defined functions. If not set, any service defined function is expected to return an error, which may or may not influence the test outcome. */
	functionMocks?: Array<FirebaseFunctionMockInput>;
	/** Specifies what should be included in the response. */
	expressionReportLevel?: 'LEVEL_UNSPECIFIED' | 'NONE' | 'FULL' | 'VISITED';
};

/** `TestSuite` is a collection of `TestCase` instances that validate the logical correctness of a `Ruleset`. The `TestSuite` may be referenced in-line within a `TestRuleset` invocation or as part of a `Release` object as a pre-release check. */
export type FirebaseTestSuiteInput = {
	/** Collection of test cases associated with the `TestSuite`. */
	testCases?: Array<FirebaseTestCaseInput>;
};

/** Options for creating a new transaction. */
export type FirebaseTransactionOptionsInput = {
	/** The transaction can only be used for read operations. */
	readOnly?: FirebaseReadOnlyInput;
	/** The transaction can be used for both read and write operations. */
	readWrite?: FirebaseReadWriteInput;
};

/** A filter with a single operand. */
export type FirebaseUnaryFilterInput = {
	/** The field to which to apply the operator. */
	field?: FirebaseFieldReferenceInput;
	/** The unary operator to apply. */
	op?:
		| 'OPERATOR_UNSPECIFIED'
		| 'IS_NAN'
		| 'IS_NULL'
		| 'IS_NOT_NAN'
		| 'IS_NOT_NULL';
};

/** The request sent to UndeleteDatabaseInstance method. */
export type FirebaseUndeleteDatabaseInstanceRequestInput = Record<
	string,
	FirebaseJsonValue
>;

/** A message that can hold any of the supported value types. */
export type FirebaseValueInput = {
	/** Value which references a field. This is considered relative (vs absolute) since it only refers to a field and not a field within a particular document. **Requires:** * Must follow field reference limitations. * Not allowed to be used when writing documents. */
	fieldReferenceValue?: string;
	/** An unevaluated pipeline (not allowed when writing documents). */
	pipelineValue?: Record<string, FirebaseJsonValue>;
	/** An unevaluated expression (not allowed when writing documents). */
	functionValue?: Record<string, FirebaseJsonValue>;
	/** A geo point value representing a point on the surface of Earth. */
	geoPointValue?: FirebaseLatLngInput;
	/** A boolean value. */
	booleanValue?: boolean;
	/** A map value: { fields: { <name>: Value } }. */
	mapValue?: Record<string, FirebaseJsonValue>;
	/** A null value. */
	nullValue?: 'NULL_VALUE';
	/** A double value: a number, or "NaN", "Infinity" or "-Infinity". */
	doubleValue?: number | 'NaN' | 'Infinity' | '-Infinity';
	/** A bytes value. In Standard edition databases: * The value must not exceed 1 MiB - 89 bytes. * Only the first 1,500 bytes are considered by queries. In Enterprise edition databases, there is no limit on the size of the value. However, it is still subject to document and index entry size limits. */
	bytesValue?: string;
	/** An array value: { values: Value[] }. */
	arrayValue?: Record<string, FirebaseJsonValue>;
	/** A reference to a document. For example: `projects/{project_id}/databases/{database_id}/documents/{document_path}`. */
	referenceValue?: string;
	/** A timestamp value. Precise only to microseconds. When stored, any additional precision is rounded down. */
	timestampValue?: string;
	/** An integer value. */
	integerValue?: string | number;
	/** A string value. In Standard edition databases: * The string, represented as UTF-8, must not exceed 1 MiB - 89 bytes. * Only the first 1,500 bytes of the UTF-8 representation are considered by queries. In Enterprise edition databases, there is no limit on the size of the value. */
	stringValue?: string;
	/** Pointer to a variable defined elsewhere in a pipeline. Unlike `field_reference_value` which references a field within a document, this refers to a variable, defined in a separate namespace than the fields of a document. */
	variableReferenceValue?: string;
};

/** [Webpush protocol](https://tools.ietf.org/html/rfc8030) options. */
export type FirebaseWebpushConfigInput = {
	/** Arbitrary key/value payload. If present, it will override google.firebase.fcm.v1.Message.data. */
	data?: Record<string, string>;
	/** Options for features provided by the FCM SDK for Web. */
	fcmOptions?: FirebaseWebpushFcmOptionsInput;
	/** HTTP headers defined in webpush protocol. Refer to [Webpush protocol](https://tools.ietf.org/html/rfc8030#section-5) for supported headers, e.g. "TTL": "15". */
	headers?: Record<string, string>;
	/** Web Notification options as a JSON object. Supports Notification instance properties as defined in [Web Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notification). */
	notification?: Record<string, FirebaseJsonValue>;
};

/** Options for features provided by the FCM SDK for Web. */
export type FirebaseWebpushFcmOptionsInput = {
	/** Label associated with the message's analytics data. */
	analyticsLabel?: string;
	/** The link to open when the user clicks on the notification. For all URL values, HTTPS is required. */
	link?: string;
};

/** A write on a document. */
export type FirebaseWriteInput = {
	/** Applies a transformation to a document. */
	transform?: FirebaseDocumentTransformInput;
	/** A document to write. */
	update?: FirebaseDocumentInput;
	/** The transforms to perform after update. This field can be set only when the operation is `update`. If present, this write is equivalent to performing `update` and `transform` to the same document atomically and in order. */
	updateTransforms?: Array<FirebaseFieldTransformInput>;
	/** The fields to update in this write. This field can be set only when the operation is `update`. If the mask is not set for an `update` and the document exists, any existing data will be overwritten. */
	updateMask?: FirebaseDocumentMaskInput;
	/** A document name to delete. In the format: `projects/{project_id}/databases/{database_id}/documents/{document_path}`. */
	delete?: string;
	/** An optional precondition on the document. The write will fail if this is set and not met by the target document. */
	currentDocument?: FirebasePreconditionInput;
};

/** The request message for Operations.CancelOperation. */
export type FirebaseAppDistributionGoogleLongrunningCancelOperationRequestInput =
	Record<string, FirebaseJsonValue>;

/** The request message for Operations.CancelOperation. */
export type FirebaseFirestoreGoogleLongrunningCancelOperationRequestInput =
	Record<string, FirebaseJsonValue>;

/** A `Version` is a configuration and a collection of static files which determine how a site is displayed. */
export type FirebaseHostingVersionInput = {
	/** Output only. Identifies the user who created the version. */
	createUser?: FirebaseActingUserInput;
	/** The deploy status of the version. For a successful deploy, call `CreateVersion` to make a new version (`CREATED` status), upload all desired files to the version, then update the version to the `FINALIZED` status. */
	status?:
		| 'VERSION_STATUS_UNSPECIFIED'
		| 'CREATED'
		| 'FINALIZED'
		| 'DELETED'
		| 'ABANDONED'
		| 'EXPIRED'
		| 'CLONING';
	/** The labels used for extra metadata and/or filtering. */
	labels?: Record<string, string>;
	/** Output only. The time at which the version was `DELETED`. */
	deleteTime?: string;
	/** Output only. The time at which the version was created. */
	createTime?: string;
	/** The fully-qualified resource name for the version, in the format: sites/ SITE_ID/versions/VERSION_ID This name is provided in the response body when you call `CreateVersion`. */
	name?: string;
	/** Output only. The total number of files associated with the version. This value is calculated after a version is `FINALIZED`. */
	fileCount?: string | number;
	/** Output only. Identifies the user who `DELETED` the version. */
	deleteUser?: FirebaseActingUserInput;
	/** Output only. Identifies the user who `FINALIZED` the version. */
	finalizeUser?: FirebaseActingUserInput;
	/** Output only. The time at which the version was `FINALIZED`. */
	finalizeTime?: string;
	/** Output only. The total stored bytesize of the version. This value is calculated after a version is `FINALIZED`. */
	versionBytes?: string | number;
	/** The configuration for the behavior of the site. This configuration exists in the [`firebase.json`](https://firebase.google.com/docs/cli/#the_firebasejson_file) file. */
	config?: FirebaseServingConfigInput;
};

/** Basic notification template to use across all platforms. */
export type FirebaseMessagingNotificationInput = {
	/** Contains the URL of an image that is going to be downloaded on the device and displayed in a notification. JPEG, PNG, BMP have full support across platforms. Animated GIF and video only work on iOS. WebP and HEIF have varying levels of support across platforms and platform versions. */
	image?: string;
	/** The notification's body text. */
	body?: string;
	/** The notification's title. */
	title?: string;
};

/** Contains all metadata about a particular version of the Remote Config template. All fields are set at the time the specified Remote Config template was written. */
export type FirebaseRemoteConfigVersionInput = {
	/** Output only. Only present if this version is the result of a rollback, and will be the version number of the Remote Config template that was rolled-back to. */
	rollbackSource?: string | number;
	/** Optional. The user-provided description of the corresponding Remote Config template */
	description?: string;
	/** Output only. Aggregation of all metadata fields about the account that performed the update. */
	updateUser?: FirebaseRemoteConfigUserInput;
	/** Output only. What type of update was made. */
	updateType?:
		| 'REMOTE_CONFIG_UPDATE_TYPE_UNSPECIFIED'
		| 'INCREMENTAL_UPDATE'
		| 'FORCED_UPDATE'
		| 'ROLLBACK';
	/** Output only. `True` if this Remote Config template was published before version history was supported. */
	isLegacy?: boolean;
	/** Output only. The version number of the version's corresponding Remote Config template. */
	versionNumber?: string | number;
	/** Output only. Where the update action originated. */
	updateOrigin?:
		| 'REMOTE_CONFIG_UPDATE_ORIGIN_UNSPECIFIED'
		| 'CONSOLE'
		| 'REST_API'
		| 'ADMIN_SDK_NODE';
	/** Output only. When the Remote Config template was written to the Remote Config server. */
	updateTime?: string;
};

/** A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); } */
export type FirebaseRulesEmptyInput = Record<string, FirebaseJsonValue>;

/** `Release` is a named reference to a `Ruleset`. Once a `Release` refers to a `Ruleset`, rules-enabled services will be able to enforce the `Ruleset`. */
export type FirebaseRulesReleaseInput = {
	/** Required. Format: `projects/{project_id}/releases/{release_id}` */
	name?: string;
	/** Required. Name of the `Ruleset` referred to by this `Release`. The `Ruleset` must exist for the `Release` to be created. */
	rulesetName?: string;
};

/** The request used to link a Google Cloud Storage bucket to a Firebase project. */
export type FirebaseStorageBucketsAddFirebaseRequestInput = Record<
	string,
	FirebaseJsonValue
>;

/** Contains metadata about the user who performed an action, such as creating a release or finalizing a version. */
export type FirebaseActingUser = {
	/** The email address of the user when the user performed the action. */
	email?: string | null;
	/** A profile image URL for the user. May not be present if the user has changed their email address or deleted their account. */
	imageUrl?: string | null;
};

/** An event which triggers the start of the experiment. This can be qualified with zero or more event parameters. */
export type FirebaseActivationEvent = {
	/** Optional. The Analytics event which indicates that the user has seen an experiment. This is case-sensitive and must be 0-32 characters long. It may only contain alphanumeric characters and underscores, and must start with an alphabetic character. */
	event?: string | null;
};

export type FirebaseAdminSdkConfig = {
	/** **DEPRECATED.** _Instead, use product-specific REST APIs to find the location of each resource in a Project. */
	locationId?: string | null;
	/** **DEPRECATED.** _Instead, find the URL of the default Realtime Database instance using the [list endpoint](https://firebase.google.com/docs/reference/rest/database/database-management/rest/v1beta/projects.locations.instances/list) within the Firebase Realtime Database REST API. */
	databaseURL?: string | null;
	/** Immutable. A user-assigned unique identifier for the `FirebaseProject`. This identifier may appear in URLs or names for some Firebase resources associated with the Project, but it should generally be treated as a convenience alias to reference the Project. */
	projectId?: string | null;
	/** **DEPRECATED.** _Instead, find the name of the default Cloud Storage for Firebase bucket using the [list endpoint](https://firebase.google.com/docs/reference/rest/storage/rest/v1beta/projects.buckets/list) within the Cloud Storage for Firebase REST API. */
	storageBucket?: string | null;
};

/** The result of a single bucket from a Firestore aggregation query. The keys of `aggregate_fields` are the same for all results in an aggregation query, unlike document queries which can have different fields present for each result. */
export type FirebaseAggregationResult = {
	/** The result of the aggregation functions, ex: `COUNT(*) AS total_docs`. The key is the alias assigned to the aggregation function on input and the size of this map equals the number of aggregation functions in the query. */
	aggregateFields?: Record<string, FirebaseValue> | null;
};

export type FirebaseAnalyticsDetails = {
	/** - For `AndroidApps` and `IosApps`: a map of `app` to `streamId` for each Firebase App in the specified `FirebaseProject`. Each `app` and `streamId` appears only once. - For `WebApps`: a map of `app` to `streamId` and `measurementId` for each `WebApp` in the specified `FirebaseProject`. */
	streamMappings?: Array<FirebaseStreamMapping> | null;
	/** The Analytics Property object associated with the specified `FirebaseProject`. This object contains the details of the Google Analytics property associated with the Project. */
	analyticsProperty?: FirebaseAnalyticsProperty | null;
};

/** Details of a Google Analytics property */
export type FirebaseAnalyticsProperty = {
	/** Output only. The ID of the [Google Analytics account](https://www.google.com/analytics/) for the Google Analytics property associated with the specified FirebaseProject. */
	analyticsAccountId?: string | null;
	/** The display name of the Google Analytics property associated with the specified `FirebaseProject`. */
	displayName?: string | null;
	/** The globally unique, Google-assigned identifier of the Google Analytics property associated with the specified `FirebaseProject`. */
	id?: string | null;
};

/** ---------- Boolean Operators AND of sub-conditions. An AND condition is true if all of its subconditions evaluate to true. */
export type FirebaseAndCondition = {
	/** Evaluated in given order with short circuit of false. Should contain at least one condition and no more than 100 conditions. */
	conditions?: Array<FirebaseCondition> | null;
};

/** Details of a Firebase App for Android. */
export type FirebaseAndroidApp = {
	/** Output only. Immutable. The globally unique, Firebase-assigned identifier for the `AndroidApp`. This identifier should be treated as an opaque token, as the data format is not specified. */
	appId?: string | null;
	/** Output only. If the App has been removed from the Project, this is the timestamp of when the App is considered expired and will be permanently deleted. After this time, the App cannot be undeleted (that is, restored to the Project). This value is only provided if the App is in the `DELETED` state. */
	expireTime?: string | null;
	/** The globally unique, Google-assigned identifier (UID) for the Firebase API key associated with the `AndroidApp`. */
	apiKeyId?: string | null;
	/** The user-assigned display name for the `AndroidApp`. */
	displayName?: string | null;
	/** This checksum is computed by the server based on the value of other fields, and it may be sent with update requests to ensure the client has an up-to-date value before proceeding. Learn more about `etag` in Google's [AIP-154 standard](https://google.aip.dev/154#declarative-friendly-resources). */
	etag?: string | null;
	/** Output only. The lifecycle state of the App. */
	state?: string | null;
	/** The SHA1 certificate hashes for the AndroidApp. */
	sha1Hashes?: Array<string> | null;
	/** The resource name of the AndroidApp, in the format: projects/ PROJECT_IDENTIFIER/androidApps/APP_ID * PROJECT_IDENTIFIER: the parent Project's `ProjectNumber` ***(recommended)*** or its `ProjectId`. */
	name?: string | null;
	/** Immutable. The canonical package name of the Android app as would appear in the Google Play Developer Console. */
	packageName?: string | null;
	/** Output only. Immutable. A user-assigned unique identifier of the parent FirebaseProject for the `AndroidApp`. */
	projectId?: string | null;
	/** The SHA256 certificate hashes for the AndroidApp. */
	sha256Hashes?: Array<string> | null;
};

/** Configuration metadata of a single Firebase App for Android. */
export type FirebaseAndroidAppConfig = {
	/** The filename that the configuration artifact for the `AndroidApp` is typically saved as. For example: `google-services.json` */
	configFilename?: string | null;
	/** The contents of the JSON configuration file. (base64) */
	configFileContents?: string | null;
};

/** A Background Sync message that is sent to Android devices. */
export type FirebaseAndroidBackgroundSyncMessage = Record<
	string,
	FirebaseJsonValue
>;

/** Android specific options for messages sent through [FCM connection server](https://goo.gl/4GLdUl). */
export type FirebaseAndroidConfig = {
	/** How long (in seconds) the message should be kept in FCM storage if the device is offline. The maximum time to live supported is 4 weeks, and the default value is 4 weeks if not set. Set it to 0 if want to send the message immediately. */
	ttl?: string | null;
	/** Notification to send to Android devices. */
	notification?: FirebaseAndroidNotification | null;
	/** Optional. If set to true, messages will be allowed to be delivered to the app while the device is connected over a restricted satellite network. */
	restrictedSatelliteOk?: boolean | null;
	/** Message priority. Can take "normal" and "high" values. For more information, see [Setting the priority of a message](https://firebase.google.com/docs/cloud-messaging/customize-messages/setting-message-priority). */
	priority?: string | null;
	/** Options for features provided by the FCM SDK for Android. */
	fcmOptions?: FirebaseAndroidFcmOptions | null;
	/** Package name of the application where the registration token must match in order to receive the message. */
	restrictedPackageName?: string | null;
	/** Arbitrary key/value payload. If present, it will override google.firebase.fcm.v1.Message.data. */
	data?: Record<string, string> | null;
	/** An identifier of a group of messages that can be collapsed, so that only the last message gets sent when delivery can be resumed. A maximum of 4 different collapse keys is allowed at any given time. */
	collapseKey?: string | null;
	/** Optional. If set to true, messages will be allowed to be delivered to the app while the device is in direct boot mode. See [Support Direct Boot mode](https://developer.android.com/training/articles/direct-boot). */
	directBootOk?: boolean | null;
	/** Optional. If set to true, messages will be allowed to be delivered to the app while the device is in bandwidth constrained mode. This should only be enabled when the app has been tested to properly handle messages in bandwidth constrained mode. */
	bandwidthConstrainedOk?: boolean | null;
};

/** Android specific V2 options for messages sent through [FCM connection server](https://goo.gl/4GLdUl). This is a v2 version of the AndroidConfig message and will replace it in the v2 API. */
export type FirebaseAndroidConfigV2 = {
	/** Options for features provided by the FCM SDK for Android. If present, it will override google.firebase.fcm.v1.Message.fcm_options. */
	fcmOptions?: FirebaseAndroidFcmOptions | null;
	/** Optional. If set to true, messages will be allowed to be delivered to the app while the device is connected over a restricted satellite network. */
	restrictedSatelliteOk?: boolean | null;
	/** Optional. User-facing notification to send to Android devices. These messages are delivered immediately and are not delayed by battery optimizations. */
	remoteNotification?: FirebaseAndroidRemoteNotification | null;
	/** Arbitrary key/value payload. If present, it will override google.firebase.fcm.v1.Message.data. */
	data?: Record<string, string> | null;
	/** An identifier of a group of messages that can be collapsed, so that only the last message gets sent when delivery can be resumed. A maximum of 4 different collapse keys is allowed at any given time. */
	collapseKey?: string | null;
	/** Optional. Non-urgent background sync message to send to Android devices. Delivery of these messages may be delayed or batched to optimize for battery. */
	backgroundSync?: FirebaseAndroidBackgroundSyncMessage | null;
	/** Package name of the application where the registration token must match in order to receive the message. */
	restrictedPackageName?: string | null;
	/** How long (in seconds) the message should be kept in FCM storage if the device is offline. The maximum time to live supported is 4 weeks, and the default value is 4 weeks if not set. Set it to 0 if want to send the message immediately. */
	ttl?: string | null;
	/** Optional. If set to true, messages will be allowed to be delivered to the app while the device is in bandwidth constrained mode. This should only be enabled when the app has been tested to properly handle messages in bandwidth constrained mode. */
	bandwidthConstrainedOk?: boolean | null;
	/** Optional. If set to true, messages will be allowed to be delivered to the app while the device is in direct boot mode. See [Support Direct Boot mode](https://developer.android.com/training/articles/direct-boot). */
	directBootOk?: boolean | null;
};

/** Options for features provided by the FCM SDK for Android. */
export type FirebaseAndroidFcmOptions = {
	/** Label associated with the message's analytics data. */
	analyticsLabel?: string | null;
};

/** Notification to send to android devices. */
export type FirebaseAndroidNotification = {
	/** Settings to control the notification's LED blinking rate and color if LED is available on the device. The total blinking time is controlled by the OS. */
	lightSettings?: FirebaseLightSettings | null;
	/** Set whether or not this notification is relevant only to the current device. Some notifications can be bridged to other devices for remote display, such as a Wear OS watch. This hint can be set to recommend this notification not be bridged. */
	localOnly?: boolean | null;
	/** The notification's title. If present, it will override google.firebase.fcm.v1.Notification.title. */
	title?: string | null;
	/** If set to true, use the Android framework's default LED light settings for the notification. Default values are specified in [config.xml](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml). */
	defaultLightSettings?: boolean | null;
	/** Optional. If set, display notifications delivered to the device will be handled by the app instead of the proxy. */
	bypassProxyNotification?: boolean | null;
	/** Set the [Notification.visibility](https://developer.android.com/reference/android/app/Notification.html#visibility) of the notification. */
	visibility?: string | null;
	/** Variable string values to be used in place of the format specifiers in body_loc_key to use to localize the body text to the user's current localization. See [Formatting and Styling](https://goo.gl/MalYE3) for more information. */
	bodyLocArgs?: Array<string> | null;
	/** Sets the "ticker" text, which is sent to accessibility services. Prior to API level 21 (`Lollipop`), sets the text that is displayed in the status bar when the notification first arrives. */
	ticker?: string | null;
	/** If set to true, use the Android framework's default vibrate pattern for the notification. Default values are specified in [config.xml](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml). */
	defaultVibrateTimings?: boolean | null;
	/** Contains the URL of an image that is going to be displayed in a notification. If present, it will override google.firebase.fcm.v1.Notification.image. */
	image?: string | null;
	/** The action associated with a user click on the notification. If specified, an activity with a matching intent filter is launched when a user clicks on the notification. */
	clickAction?: string | null;
	/** Setting to control when a notification may be proxied. */
	proxy?: string | null;
	/** Set the time that the event in the notification occurred. Notifications in the panel are sorted by this time. A point in time is represented using [protobuf.Timestamp](https://developers.google.com/protocol-buffers/docs/reference/java/com/google/protobuf/Timestamp). */
	eventTime?: string | null;
	/** When set to false or unset, the notification is automatically dismissed when the user clicks it in the panel. When set to true, the notification persists even when the user clicks it. */
	sticky?: boolean | null;
	/** If set to true, use the Android framework's default sound for the notification. Default values are specified in [config.xml](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml). */
	defaultSound?: boolean | null;
	/** The sound to play when the device receives the notification. Supports "default" or the filename of a sound resource bundled in the app. Sound files must reside in /res/raw/. */
	sound?: string | null;
	/** Identifier used to replace existing notifications in the notification drawer. If not specified, each request creates a new notification. If specified and a notification with the same tag is already being shown, the new notification replaces the existing one in the notification drawer. */
	tag?: string | null;
	/** The key to the title string in the app's string resources to use to localize the title text to the user's current localization. See [String Resources](https://goo.gl/NdFZGI) for more information. */
	titleLocKey?: string | null;
	/** The notification's body text. If present, it will override google.firebase.fcm.v1.Notification.body. */
	body?: string | null;
	/** The [notification's channel id](https://developer.android.com/guide/topics/ui/notifiers/notifications#ManageChannels) (new in Android O). The app must create a channel with this channel ID before any notification with this channel ID is received. */
	channelId?: string | null;
	/** Set the relative priority for this notification. Priority is an indication of how much of the user's attention should be consumed by this notification. */
	notificationPriority?: string | null;
	/** Sets the number of items this notification represents. May be displayed as a badge count for launchers that support badging. See [Notification Badge](https://developer.android.com/training/notify-user/badges). */
	notificationCount?: number | null;
	/** The notification's icon color, expressed in #rrggbb format. */
	color?: string | null;
	/** The notification's icon. Sets the notification icon to myicon for drawable resource myicon. If you don't send this key in the request, FCM displays the launcher icon specified in your app manifest. */
	icon?: string | null;
	/** The key to the body string in the app's string resources to use to localize the body text to the user's current localization. See [String Resources](https://goo.gl/NdFZGI) for more information. */
	bodyLocKey?: string | null;
	/** Set the vibration pattern to use. Pass in an array of [protobuf.Duration](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Duration) to turn on or off the vibrator. The first value indicates the `Duration` to wait before turning the vibrator on. */
	vibrateTimings?: Array<string> | null;
	/** Variable string values to be used in place of the format specifiers in title_loc_key to use to localize the title text to the user's current localization. See [Formatting and Styling](https://goo.gl/MalYE3) for more information. */
	titleLocArgs?: Array<string> | null;
};

/** Notification v2 to send to Android devices. This is a v2 version of the AndroidNotification message and will replace it in the v2 API. */
export type FirebaseAndroidNotificationV2 = {
	/** The [notification's channel id](https://developer.android.com/guide/topics/ui/notifiers/notifications#ManageChannels) (new in Android O). The app must create a channel with this channel ID before any notification with this channel ID is received. */
	channelId?: string | null;
	/** Settings to control the notification's LED blinking rate and color if LED is available on the device. The total blinking time is controlled by the OS. */
	lightSettings?: FirebaseGoogleFirebaseFcmV1AndroidNotificationV2LightSettings | null;
	/** The notification's icon color, expressed in #rrggbb format. */
	color?: string | null;
	/** Set the relative priority for this notification. Priority is an indication of how much of the user's attention should be consumed by this notification. */
	notificationPriority?: string | null;
	/** When set to false or unset, the notification is automatically dismissed when the user clicks it in the panel. When set to true, the notification persists even when the user clicks it. */
	sticky?: boolean | null;
	/** Optional. Identifier used to replace existing notifications in the notification drawer. It is used in conjunction with `tag` to form a unique identifier `(tag, id)` within the app. If not specified, each request creates a new notification. */
	id?: number | null;
	/** Variable string values to be used in place of the format specifiers in body_loc_key to use to localize the body text to the user's current localization. See [Formatting and Styling](https://goo.gl/MalYE3) for more information. */
	bodyLocArgs?: Array<string> | null;
	/** Set the time that the event in the notification occurred. Notifications in the panel are sorted by this time. A point in time is represented using [protobuf.Timestamp](https://developers.google.com/protocol-buffers/docs/reference/java/com/google/protobuf/Timestamp). */
	eventTime?: string | null;
	/** The sound to play when the device receives the notification. Supports "default" or the filename of a sound resource bundled in the app. Sound files must reside in /res/raw/. */
	sound?: string | null;
	/** Sets the number of items this notification represents. May be displayed as a badge count for launchers that support badging. See [Notification Badge](https://developer.android.com/training/notify-user/badges). */
	notificationCount?: number | null;
	/** An HTTPS URL of an image to display in the notification. If present, it overrides google.firebase.fcm.v1.Notification.image. */
	image?: string | null;
	/** The key to the body string in the app's string resources to use to localize the body text to the user's current localization. See [String Resources](https://goo.gl/NdFZGI) for more information. */
	bodyLocKey?: string | null;
	/** The notification's body text. If present, it will override google.firebase.fcm.v1.Notification.body. */
	body?: string | null;
	/** Variable string values to be used in place of the format specifiers in title_loc_key to use to localize the title text to the user's current localization. See [Formatting and Styling](https://goo.gl/MalYE3) for more information. */
	titleLocArgs?: Array<string> | null;
	/** If set to true, use the Android framework's default vibrate pattern for the notification. Default values are specified in [config.xml](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml). */
	defaultVibrateTimings?: boolean | null;
	/** The key to the title string in the app's string resources to use to localize the title text to the user's current localization. See [String Resources](https://goo.gl/NdFZGI) for more information. */
	titleLocKey?: string | null;
	/** Identifier used to replace existing notifications in the notification drawer. It is used in conjunction with `id` to form a unique identifier `(tag, id)` within the app. If not specified, each request creates a new notification. */
	tag?: string | null;
	/** The action associated with a user click on the notification. If specified, an activity with a matching intent filter is launched when a user clicks on the notification. */
	clickAction?: string | null;
	/** The notification's title. If present, it will override google.firebase.fcm.v1.Notification.title. */
	title?: string | null;
	/** The notification's icon. Sets the notification icon to myicon for drawable resource myicon. If you don't send this key in the request, FCM displays the launcher icon specified in your app manifest. */
	icon?: string | null;
	/** If set to true, use the Android framework's default LED light settings for the notification. Default values are specified in [config.xml](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml). */
	defaultLightSettings?: boolean | null;
	/** If set to true, use the Android framework's default sound for the notification. Default values are specified in [config.xml](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml). */
	defaultSound?: boolean | null;
	/** Sets the "ticker" text, which is sent to accessibility services. Prior to API level 21 (`Lollipop`), sets the text that is displayed in the status bar when the notification first arrives. */
	ticker?: string | null;
	/** Set the [Notification.visibility](https://developer.android.com/reference/android/app/Notification.html#visibility) of the notification. */
	visibility?: string | null;
	/** Set the vibration pattern to use. Pass in an array of [protobuf.Duration](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Duration) to turn on or off the vibrator. The first value indicates the `Duration` to wait before turning the vibrator on. */
	vibrateTimings?: Array<string> | null;
	/** Set whether or not this notification is relevant only to the current device. Some notifications can be bridged to other devices for remote display, such as a Wear OS watch. This hint can be set to recommend this notification not be bridged. */
	localOnly?: boolean | null;
};

/** A Remote Notification message that is sent to Android devices. */
export type FirebaseAndroidRemoteNotification = {
	/** Optional. If set to `true`, this RemoteNotification message will be delivered to legacy V1 clients as a data message by omitting the google.firebase.fcm.v1.AndroidRemoteNotification.notification. This should only be enabled when migrating from legacy V1 data messages. */
	useAsV1DataMessage?: boolean | null;
	/** Optional. If set to true, the notification content can be updated by the app after the notification is received on the device. */
	mutableContent?: boolean | null;
	/** Optional. Notification to send to Android devices. */
	notification?: FirebaseAndroidNotificationV2 | null;
};

/** [Apple Push Notification Service](https://goo.gl/MXRTPa) specific options. */
export type FirebaseApnsConfig = {
	/** Optional. [Apple Live Activity](https://developer.apple.com/design/human-interface-guidelines/live-activities) token to send updates to. This token can either be a push token or [push-to-start](https://developer.apple.com/documentation/activitykit/activity/pushtostarttoken) token from Apple. */
	liveActivityToken?: string | null;
	/** Options for features provided by the FCM SDK for iOS. */
	fcmOptions?: FirebaseApnsFcmOptions | null;
	/** HTTP request headers defined in Apple Push Notification Service. Refer to [APNs request headers](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns) for supported headers such as `apns-expiration` and… */
	headers?: Record<string, string> | null;
	/** APNs payload as a JSON object, including both `aps` dictionary and custom payload. See [Payload Key Reference](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification). */
	payload?: Record<string, FirebaseJsonValue> | null;
};

/** Options for features provided by the FCM SDK for iOS. */
export type FirebaseApnsFcmOptions = {
	/** Contains the URL of an image that is going to be displayed in a notification. If present, it will override google.firebase.fcm.v1.Notification.image. */
	image?: string | null;
	/** Label associated with the message's analytics data. */
	analyticsLabel?: string | null;
};

/** The streamed response for Firestore.BatchGetDocuments. */
export type FirebaseBatchGetDocumentsResponse = {
	/** A document that was requested. */
	found?: FirebaseDocument | null;
	/** The transaction that was started as part of this request. Will only be set in the first response, and only if BatchGetDocumentsRequest.new_transaction was set in the request. (base64) */
	transaction?: string | null;
	/** The time at which the document was read. This may be monotically increasing, in this case the previous documents in the result stream are guaranteed not to have changed between their read_time and this one. */
	readTime?: string | null;
	/** A document name that was requested but does not exist. In the format: `projects/{project_id}/databases/{database_id}/documents/{document_path}`. */
	missing?: string | null;
};

/** The response from Firestore.BatchWrite. */
export type FirebaseBatchWriteResponse = {
	/** The result of applying the writes. This i-th write result corresponds to the i-th write in the request. */
	writeResults?: Array<FirebaseWriteResult> | null;
	/** The status of applying the writes. This i-th write status corresponds to the i-th write in the request. */
	status?: Array<FirebaseFirestoreStatus> | null;
};

/** The response for Firestore.BeginTransaction. */
export type FirebaseBeginTransactionResponse = {
	/** The transaction that was started. (base64) */
	transaction?: string | null;
};

/** An access-control entry. */
export type FirebaseBucketAccessControl = {
	/** The name of the bucket. */
	bucket?: string | null;
	/** The domain associated with the entity, if any. */
	domain?: string | null;
	/** The email address associated with the entity, if any. */
	email?: string | null;
	/** The entity holding the permission, in one of the following forms: - user-userId - user-email - group-groupId - group-email - domain-domain - project-team-projectId - allUsers - allAuthenticatedUsers Examples: - The user liz@example.com would be user-liz@example.com. */
	entity?: string | null;
	/** The ID for the entity, if any. */
	entityId?: string | null;
	/** HTTP 1.1 Entity tag for the access-control entry. */
	etag?: string | null;
	/** The ID of the access-control entry. */
	id?: string | null;
	/** The kind of item this is. For bucket access control entries, this is always storage#bucketAccessControl. */
	kind?: string | null;
	/** The project team associated with the entity, if any. */
	projectTeam?: {
		/** The project number. */
		projectNumber?: string | null;
		/** The team. */
		team?: string | null;
	} | null;
	/** The access permission for the entity. */
	role?: string | null;
	/** The link to this access-control entry. */
	selfLink?: string | null;
};

/** The storage layout configuration of a bucket. */
export type FirebaseBucketStorageLayout = {
	/** The name of the bucket. */
	bucket?: string | null;
	/** The bucket's custom placement configuration for Custom Dual Regions. */
	customPlacementConfig?: {
		/** The list of regional locations in which data is placed. */
		dataLocations?: Array<string> | null;
	} | null;
	/** The bucket's hierarchical namespace configuration. */
	hierarchicalNamespace?: {
		/** When set to true, hierarchical namespace is enabled for this bucket. */
		enabled?: boolean | null;
	} | null;
	/** The kind of item this is. For storage layout, this is always storage#storageLayout. */
	kind?: string | null;
	/** The location of the bucket. */
	location?: string | null;
	/** The type of the bucket location. */
	locationType?: string | null;
	/** The Rapid Cache configuration for the bucket. */
	rapidCacheInfo?: {
		/** The type of cache in the bucket. Set to `rapid-cache` or `rapid-cache-ultra`, only if there is a cache present. */
		cacheType?: string | null;
	} | null;
};

/** A list of buckets. */
export type FirebaseBuckets = {
	/** The list of items. */
	items?: Array<FirebaseStorageBucket> | null;
	/** The kind of item this is. For lists of buckets, this is always storage#buckets. */
	kind?: string | null;
	/** The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results. */
	nextPageToken?: string | null;
	/** The list of bucket resource names that could not be reached during the listing operation. */
	unreachable?: Array<string> | null;
};

/** Represents a DNS certificate challenge. */
export type FirebaseCertDnsChallenge = {
	/** The domain name upon which the DNS challenge must be satisfied. */
	domainName?: string | null;
	/** The value that must be present as a TXT record on the domain name to satisfy the challenge. */
	token?: string | null;
};

/** Represents an HTTP certificate challenge. */
export type FirebaseCertHttpChallenge = {
	/** The token to serve at the specified URL path to satisfy the certificate challenge. */
	token?: string | null;
	/** The URL path on which to serve the specified token to satisfy the certificate challenge. */
	path?: string | null;
};

/** A set of ACME challenges you can use to allow Hosting to create an SSL certificate for your domain name before directing traffic to Hosting servers. Use either the DNS or HTTP challenge; it's not necessary to provide both. */
export type FirebaseCertVerification = {
	/** Output only. A file to add to your existing, non-Hosting hosting service that confirms your intent to let Hosting create an SSL cert for your domain name. */
	http?: FirebaseHttpUpdate | null;
	/** Output only. A `TXT` record to add to your DNS records that confirms your intent to let Hosting create an SSL cert for your domain name. */
	dns?: FirebaseDnsUpdates | null;
};

/** An SSL certificate used to provide end-to-end encryption for requests against your domain name. A `Certificate` can be an actual SSL certificate or, for newly-created custom domains, Hosting's intent to create one. */
export type FirebaseCertificate = {
	/** Output only. The state of the certificate. Only the `CERT_ACTIVE` and `CERT_EXPIRING_SOON` states provide SSL coverage for a domain name. */
	state?: string | null;
	/** Output only. A set of errors Hosting encountered when attempting to create a cert for your domain name. Resolve these issues to ensure Hosting is able to provide secure communication with your site's visitors. */
	issues?: Array<FirebaseHostingStatus> | null;
	/** Output only. A set of ACME challenges you can add to your DNS records or existing, non-Hosting hosting provider to allow Hosting to create an SSL certificate for your domain name before you point traffic toward hosting. */
	verification?: FirebaseCertVerification | null;
	/** Output only. The certificate's type. */
	type?: string | null;
	/** Output only. The certificate's creation time. For `TEMPORARY` certs this is the time Hosting first generated challenges for your domain name. For all other cert types, it's the time the actual cert was created. */
	createTime?: string | null;
	/** Output only. The certificate's expiration time. After this time, the cert can no longer be used to provide secure communication between Hosting and your site's visitors. */
	expireTime?: string | null;
};

/** A `Channel` represents a stream of releases for a site. All sites have a default `live` channel that serves content to the Firebase-provided subdomains and any connected custom domains. */
export type FirebaseChannel = {
	/** The fully-qualified resource name for the channel, in the format: sites/ SITE_ID/channels/CHANNEL_ID */
	name?: string | null;
	/** Input only. A time-to-live for this channel. Sets `expire_time` to the provided duration past the time of the request. */
	ttl?: string | null;
	/** Output only. The time at which the channel was last updated. */
	updateTime?: string | null;
	/** The number of previous releases to retain on the channel for rollback or other purposes. Must be a number between 1-100. Defaults to 10 for new channels. */
	retainedReleaseCount?: number | null;
	/** Output only. The time at which the channel was created. */
	createTime?: string | null;
	/** The time at which the channel will be automatically deleted. If null, the channel will not be automatically deleted. This field is present in the output whether it's set directly or via the `ttl` field. */
	expireTime?: string | null;
	/** Text labels used for extra metadata and/or filtering. */
	labels?: Record<string, string> | null;
	/** Output only. The current release for the channel, if any. */
	release?: FirebaseHostingRelease | null;
	/** Output only. The URL at which the content of this channel's current release can be viewed. This URL is a Firebase-provided subdomain of `web.app`. The content of this channel's current release can also be viewed at the Firebase-provided subdomain of `firebaseapp.com`. */
	url?: string | null;
};

/** A configured rewrite that directs requests to a Cloud Run service. If the Cloud Run service does not exist when setting or updating your Firebase Hosting configuration, then the request fails. */
export type FirebaseCloudRunRewrite = {
	/** Optional. User-provided region where the Cloud Run service is hosted. Defaults to `us-central1` if not supplied. */
	region?: string | null;
	/** Optional. User-provided TrafficConfig tag to send traffic to. When omitted, traffic is sent to the service-wide URI */
	tag?: string | null;
	/** Required. User-defined ID of the Cloud Run service. */
	serviceId?: string | null;
};

/** Represents a color in the RGBA color space. This representation is designed for simplicity of conversion to and from color representations in various languages over compactness. */
export type FirebaseColor = {
	/** The amount of blue in the color as a value in the interval [0, 1]. */
	blue?: number | null;
	/** The amount of green in the color as a value in the interval [0, 1]. */
	green?: number | null;
	/** The fraction of this color that should be applied to the pixel. That is, the final pixel color is defined by the equation: `pixel color = alpha * (this color) + (1.0 - alpha) * (background color)` This means that a value of 1.0 corresponds to a solid color, whereas a value of 0.0 corresponds to a… */
	alpha?: number | null;
	/** The amount of red in the color as a value in the interval [0, 1]. */
	red?: number | null;
};

/** The response for Firestore.Commit. */
export type FirebaseCommitResponse = {
	/** The result of applying the writes. This i-th write result corresponds to the i-th write in the request. */
	writeResults?: Array<FirebaseWriteResult> | null;
	/** The time at which the commit occurred. Any read with an equal or greater `read_time` is guaranteed to see the effects of the commit. */
	commitTime?: string | null;
};

/** ---------- General Condition Wrapper A general boolean expression that is used to evaluate conditions for server-side Remote Config templates. */
export type FirebaseCondition = {
	/** Apply logical "or" condition to the subset of conditions. */
	orCondition?: FirebaseOrCondition | null;
	/** Builtin conditions (aka 'atoms') Target a percentage of the population (users, app instances). */
	percent?: FirebasePercentCondition | null;
	/** / Target a developer-defined custom signal. */
	customSignal?: FirebaseCustomSignalCondition | null;
	/** Boolean operators Apply logical "and" condition to the subset of conditions. */
	andCondition?: FirebaseAndCondition | null;
};

/** Represents the explicit evaluation ordering of conditions in a Remote Config template. Per AIP-156, this is a Singleton resource per namespace. */
export type FirebaseConditionOrder = {
	/** Required. Identifier. The resource name of the condition order singleton. Format: projects/{project}/namespaces/{namespace}/conditionOrder */
	name?: string | null;
	/** The current ETag of the condition order for optimistic concurrency. */
	etag?: string | null;
	/** Required. The ordered list of condition IDs in descending priority. */
	conditionIds?: Array<string> | null;
};

/** A position in a query result set. */
export type FirebaseCursor = {
	/** The values that represent a position, in the order they appear in the order by clause of a query. Can contain fewer values than specified in the order by clause. */
	values?: Array<FirebaseValue> | null;
	/** If the position is just before or just after the given values, relative to the sort order defined by the query. */
	before?: boolean | null;
};

/** A `CustomDomain` is an entity that links a domain name to a Firebase Hosting site. Add a `CustomDomain` to your site to allow Hosting to serve the site's content in response to requests against your domain name. */
export type FirebaseCustomDomain = {
	/** Output only. The `OwnershipState` of the domain name this `CustomDomain` refers to. */
	ownershipState?: string | null;
	/** Output only. The minimum time before a soft-deleted `CustomDomain` is completely removed from Hosting; null for custom domains that haven't been deleted. */
	expireTime?: string | null;
	/** Output only. A set of errors Hosting systems encountered when trying to establish Hosting's ability to serve secure content for your domain name. Resolve these issues to ensure your `CustomDomain` behaves properly. */
	issues?: Array<FirebaseHostingStatus> | null;
	/** Output only. A set of updates you should make to the domain name's DNS records to let Hosting serve secure content on its behalf. */
	requiredDnsUpdates?: FirebaseDnsUpdates | null;
	/** Output only. The SSL certificate Hosting has for this custom domain's domain name. For new custom domains, this often represents Hosting's intent to create a certificate, rather than an actual cert. Check the `state` field for more. */
	cert?: FirebaseCertificate | null;
	/** Output only. A field that, if true, indicates that Hosting's systems are attmepting to make the custom domain's state match your preferred state. */
	reconciling?: boolean | null;
	/** Output only. The time the `CustomDomain` was deleted; null for custom domains that haven't been deleted. Deleted custom domains persist for approximately 30 days, after which time Hosting removes them completely. To restore a deleted custom domain, make an `UndeleteCustomDomain` request. */
	deleteTime?: string | null;
	/** Identifier. The fully-qualified name of the `CustomDomain`. */
	name?: string | null;
	/** Labels used for extra metadata and/or filtering. */
	labels?: Record<string, string> | null;
	/** Output only. The custom domain's create time. */
	createTime?: string | null;
	/** A field that lets you specify which SSL certificate type Hosting creates for your domain name. Spark plan custom domains only have access to the `GROUPED` cert type, while Blaze plan domains can select any option. */
	certPreference?: string | null;
	/** A domain name that this `CustomDomain` should direct traffic towards. If specified, Hosting will respond to requests against this custom domain with an HTTP 301 code, and route traffic to the specified `redirect_target` instead. */
	redirectTarget?: string | null;
	/** Annotations you can add to leave both human- and machine-readable metadata about your `CustomDomain`. */
	annotations?: Record<string, string> | null;
	/** Output only. The `HostState` of the domain name this `CustomDomain` refers to. */
	hostState?: string | null;
	/** Output only. The last time the `CustomDomain` was updated. */
	updateTime?: string | null;
	/** Output only. A string that represents the current state of the `CustomDomain` and allows you to confirm its initial state in requests that would modify it. Use the tag to ensure consistency when making `UpdateCustomDomain`, `DeleteCustomDomain`, and `UndeleteCustomDomain` requests. */
	etag?: string | null;
};

/** A custom objective defined by a user-generated Firebase Analytics event. */
export type FirebaseCustomObjectiveDetails = {
	/** Required. Which count_type is used to measure this objective. Always set to "NO_EVENT_USERS" for "app_crashes" and "app_exception" objectives. */
	countType?: string | null;
	/** Required. The name of the user-defined Firebase Analytics event to optimize. The event name is case-sensitive and must be 0-32 characters long. It may only contain alphanumeric characters and underscores, and must start with an alphabetic character. */
	event?: string | null;
};

/** A condition that compares a developer-defined custom signal to a target value. NOTE: Developers provide custom signals via the Admin SDK. These signals can be a string, number, or numeric version (aka semantic version). For numeric interpretation of custom signal values. */
export type FirebaseCustomSignalCondition = {
	/** Required. The choice of custom signal operator to determine how to compare targets to actual values. */
	customSignalOperator?: string | null;
	/** Required. A list of at most 100 target custom signal values. For numeric operators: this list must have exactly ONE target signal value that is of a valid numeric format specified above. */
	targetCustomSignalValues?: Array<string> | null;
	/** Required. The custom signal name. This must match what is provided in the EvaluationContext in the Admin SDK. */
	customSignalKey?: string | null;
};

/** Representation of a Realtime Database instance. Details on interacting with contents of a DatabaseInstance can be found at: https://firebase.google.com/docs/database/rest/start. */
export type FirebaseDatabaseInstance = {
	/** Immutable. The database instance type. On creation only USER_DATABASE is allowed, which is also the default when omitted. */
	type?: string | null;
	/** The fully qualified resource name of the database instance, in the form: `projects/{project-number}/locations/{location-id}/instances/{database-id}`. */
	name?: string | null;
	/** Output only. The resource name of the project this instance belongs to. For example: `projects/{project-number}`. */
	project?: string | null;
	/** Output only. The database's lifecycle state. Read-only. */
	state?: string | null;
	/** Output only. Output Only. The globally unique hostname of the database. */
	databaseUrl?: string | null;
};

/** Spark tier-eligible Cloud Storage bucket. One per project. This resource exists if the underlying Cloud Storage bucket exists and it is linked to your Firebase project. See https://firebase.google.com/pricing for pricing details. */
export type FirebaseDefaultBucket = {
	/** Output only. Underlying bucket resource. */
	bucket?: FirebaseStorageBucketsBucket | null;
	/** Required. Immutable. Location of the default bucket. */
	location?: string | null;
	/** Identifier. Resource name of the default bucket. */
	name?: string | null;
	/** Immutable. Storage class of the default bucket. Supported values are available at https://cloud.google.com/storage/docs/storage-classes#classes. */
	storageClass?: string | null;
};

/** **DEPRECATED.** _Auto-provisioning of these resources is changing, so this object no longer reliably provides information about the resources within the Project. */
export type FirebaseDefaultResources = {
	/** Output only. **DEPRECATED.** _Instead, find the name of the default Firebase Hosting site using [ListSites](https://firebase.google.com/docs/reference/hosting/rest/v1beta1/projects.sites/list) within the Firebase Hosting REST API. */
	hostingSite?: string | null;
	/** Output only. **DEPRECATED.** _Instead, use product-specific REST APIs to find the location of each resource in a Project. */
	locationId?: string | null;
	/** Output only. **DEPRECATED.** _Instead, find the name of the default Realtime Database instance using the [list endpoint](https://firebase.google.com/docs/reference/rest/database/database-management/rest/v1beta/projects.locations.instances/list) within the Firebase Realtime Database REST API. */
	realtimeDatabaseInstance?: string | null;
	/** Output only. **DEPRECATED.** _Instead, find the name of the default Cloud Storage for Firebase bucket using the [list endpoint](https://firebase.google.com/docs/reference/rest/storage/rest/v1beta/projects.buckets/list) within the Cloud Storage for Firebase REST API. */
	storageBucket?: string | null;
};

/** DNS records are resource records that define how systems and services should behave when handling requests for a domain name. */
export type FirebaseDnsRecord = {
	/** Output only. The data of the record. The meaning of the value depends on record type: - A and AAAA: IP addresses for the domain name. - CNAME: Another domain to check for records. - TXT: Arbitrary text strings associated with the domain name. */
	rdata?: string | null;
	/** Output only. The record's type, which determines what data the record contains. */
	type?: string | null;
	/** Output only. The domain name the record pertains to, e.g. `foo.bar.com.`. */
	domainName?: string | null;
	/** Output only. An enum that indicates the a required action for this record. */
	requiredAction?: string | null;
};

/** A set of DNS records relevant to the setup and maintenance of a custom domain in Firebase Hosting. */
export type FirebaseDnsRecordSet = {
	/** Output only. The domain name the record set pertains to. */
	domainName?: string | null;
	/** Output only. Records on the domain. */
	records?: Array<FirebaseDnsRecord> | null;
	/** Output only. An error Hosting services encountered when querying your domain name's DNS records. Note: Hosting ignores `NXDOMAIN` errors, as those generally just mean that a domain name hasn't been set up yet. */
	checkError?: FirebaseHostingStatus | null;
};

/** A set of DNS record updates that you should make to allow Hosting to serve secure content in response to requests against your domain name. */
export type FirebaseDnsUpdates = {
	/** The set of DNS records Hosting needs to serve secure content on the domain. */
	desired?: Array<FirebaseDnsRecordSet> | null;
	/** The last time Hosting checked your custom domain's DNS records. */
	checkTime?: string | null;
	/** The set of DNS records Hosting discovered when inspecting a domain. */
	discovered?: Array<FirebaseDnsRecordSet> | null;
};

/** A Firestore document. Must not exceed 1 MiB - 4 bytes. */
export type FirebaseDocument = {
	/** The resource name of the document, for example `projects/{project_id}/databases/{database_id}/documents/{document_path}`. */
	name?: string | null;
	/** Output only. The time at which the document was last changed. This value is initially set to the `create_time` then increases monotonically with each change to the document. It can also be compared to values from other documents and the `read_time` of a query. */
	updateTime?: string | null;
	/** Output only. The time at which the document was created. This value increases monotonically when a document is deleted then recreated. It can also be compared to values from other documents and the `read_time` of a query. */
	createTime?: string | null;
	/** The document's fields. The map keys represent field names. Field names matching the regular expression `__.*__` are reserved. Reserved field names are forbidden except in certain documented contexts. The field names, represented as UTF-8, must not exceed 1,500 bytes and cannot be empty. */
	fields?: Record<string, FirebaseValue> | null;
};

/** The intended behavior and status information of a domain. */
export type FirebaseDomain = {
	/** Output only. Information about the provisioning of certificates and the health of the DNS resolution for the domain. */
	provisioning?: FirebaseDomainProvisioning | null;
	/** Output only. The time at which the domain was last updated. */
	updateTime?: string | null;
	/** Output only. Additional status of the domain association. */
	status?: string | null;
	/** Required. The domain name of the association. */
	domainName?: string | null;
	/** If set, the domain should redirect with the provided parameters. */
	domainRedirect?: FirebaseDomainRedirect | null;
	/** Required. The site name of the association. */
	site?: string | null;
};

/** The current certificate provisioning status information for a domain. */
export type FirebaseDomainProvisioning = {
	/** The TXT records (for the certificate challenge) that were found at the last DNS fetch. */
	certChallengeDiscoveredTxt?: Array<string> | null;
	/** The DNS challenge for generating a certificate. */
	certChallengeDns?: FirebaseCertDnsChallenge | null;
	/** The IPs found at the last DNS fetch. */
	discoveredIps?: Array<string> | null;
	/** The certificate provisioning status; updated when Firebase Hosting provisions an SSL certificate for the domain. */
	certStatus?: string | null;
	/** The time at which the last DNS fetch occurred. */
	dnsFetchTime?: string | null;
	/** The list of IPs to which the domain is expected to resolve. */
	expectedIps?: Array<string> | null;
	/** The DNS record match status as of the last DNS fetch. */
	dnsStatus?: string | null;
	/** The HTTP challenge for generating a certificate. */
	certChallengeHttp?: FirebaseCertHttpChallenge | null;
};

/** Defines the behavior of a domain-level redirect. Domain redirects preserve the path of the redirect but replace the requested domain with the one specified in the redirect configuration. */
export type FirebaseDomainRedirect = {
	/** Required. The domain name to redirect to. */
	domainName?: string | null;
	/** Required. The redirect status code. */
	type?: string | null;
};

/** An objective to measure the performance of an experiment. An experiment must have a single primary objective and can have multiple secondary objectives. */
export type FirebaseEventObjective = {
	/** Required. If true, this is the primary objective of the experiment. Exactly one objective should be marked primary. */
	isPrimary?: boolean | null;
	/** Configuration details for user-defined custom objectives. */
	customObjectiveDetails?: FirebaseCustomObjectiveDetails | null;
	/** Configuration details for system objectives. */
	systemObjectiveDetails?: FirebaseSystemObjectiveDetails | null;
	/** Required. How to optimize this metric. NOTE: This field should only be set for custom objectives. Always set to "MAXIMIZE" for "app_crashes" and "app_exception" objectives. */
	abtOptimizationFunction?: string | null;
};

/** The response for Firestore.ExecutePipeline. */
export type FirebaseExecutePipelineResponse = {
	/** Newly created transaction identifier. This field is only specified as part of the first response from the server, alongside the `results` field when the original request specified ExecuteRequest.new_transaction. (base64) */
	transaction?: string | null;
	/** The time at which the results are valid. This is a (not strictly) monotonically increasing value across multiple responses in the same stream. The API guarantees that all previously returned results are still valid at the latest `execution_time`. */
	executionTime?: string | null;
	/** Query explain stats. This is present on the **last** response if the request configured explain to run in 'analyze' or 'explain' mode in the pipeline options. If the query does not return any results, a response with `explain_stats` and no `results` will still be sent. */
	explainStats?: FirebaseExplainStats | null;
	/** An ordered batch of results returned executing a pipeline. The batch size is variable, and can even be zero for when only a partial progress message is returned. */
	results?: Array<FirebaseDocument> | null;
};

/** Execution statistics for the query. */
export type FirebaseExecutionStats = {
	/** Debugging statistics from the execution of the query. Note that the debugging stats are subject to change as Firestore evolves. */
	debugStats?: Record<string, FirebaseJsonValue> | null;
	/** Total billable read operations. */
	readOperations?: (string | number) | null;
	/** Total number of results returned, including documents, projections, aggregation results, keys. */
	resultsReturned?: (string | number) | null;
	/** Total time to execute the query in the backend. */
	executionDuration?: string | null;
};

/** Representation of an A/B testing experiment. */
export type FirebaseExperiment = {
	/** Output only. The experiment state. */
	state?: string | null;
	/** Output only. The time when the experiment was last updated. */
	lastUpdateTime?: string | null;
	/** Output only. The time when the experiment was started. */
	startTime?: string | null;
	/** Required. Identifier. The name of the experiment to get. Format: projects/{project}/namespaces/{namespace}/experiments/{experiment_id} */
	name?: string | null;
	/** The etag of the experiment. */
	etag?: string | null;
	/** Output only. The time when the experiment was ended. */
	endTime?: string | null;
	/** The experiment definition. */
	definition?: FirebaseExperimentDefinition | null;
};

/** The definition of an experiment, detailing its name, description, objectives, variants, and other settings. */
export type FirebaseExperimentDefinition = {
	/** The description of the experiment. */
	description?: string | null;
	/** The service that the experiment belongs to. */
	service?: string | null;
	/** The variants of the experiment. */
	variants?: Array<FirebaseExperimentVariant> | null;
	/** The objectives of the experiment. */
	objectives?: FirebaseExperimentObjectives | null;
	/** The name of the experiment. */
	displayName?: string | null;
};

/** Encapsulates per-experiment data. */
export type FirebaseExperimentDescription = {
	/** A repeated of Remote Config parameter keys that this experiment is affecting the value of. */
	affectedParameterKeys?: Array<string> | null;
	/** When the experiment was started. */
	experimentStartTime?: string | null;
	/** How long the experiment can remain in ON state. Valid range from 1 ms to 6 months. */
	timeToLiveMillis?: (string | number) | null;
	/** The Google Analytics event that activates the experiment. */
	triggerEvent?: string | null;
	/** The variant of the experiment assigned to the app instance. */
	variantId?: string | null;
	/** How long the experiment can remain in STANDBY state. Valid range from 1 ms to 6 months. */
	triggerTimeoutMillis?: (string | number) | null;
	/** The Firebase A/B Testing experiment ID. A string of max length 22 characters. Format: _exp_ This is referred to as the tracking id and is different from the experiment id which is used internally by ABT. */
	experimentId?: string | null;
};

/** The objectives of an experiment, including an activation event and a list of event-based objectives to track. */
export type FirebaseExperimentObjectives = {
	/** Optional. The event which triggers the start of the experiment. If not specified, receiving an experiment on the device would count as the activation event. */
	activationEvent?: FirebaseActivationEvent | null;
	/** Required. The Objectives which are used to determine the winner of an experiment and measure desired outcomes. This must have between [1-4] objectives: one primary objective and a maximum of 3 secondary objectives. The order of the objectives does not matter. The server preserves the order. */
	eventObjectives?: Array<FirebaseEventObjective> | null;
};

/** Information related to a parameter value managed by Firebase ABT. */
export type FirebaseExperimentValue = {
	/** The identifier that associates a parameter value to an Experiment in Firebase ABT. */
	experimentId?: string | null;
	/** Optional. Represents the server-side exposure evaluation. This value represents the fraction of users exposed to the experiment, ranging from 0 (0% exposure) to 100 (100% exposure), inclusive. */
	exposurePercent?: number | null;
	/** A repeated of variants associated with the Experiment. */
	variantValue?: Array<FirebaseExperimentVariantValue> | null;
};

/** A variant of an experiment. */
export type FirebaseExperimentVariant = {
	/** Action weight proportional to other Actions. This number should be a whole number in the range… */
	weight?: number | null;
	/** Identifier. The name of the variant. Eg: "Notification A", "Control". Variant names must be unique for a single experiment. */
	name?: string | null;
};

/** Information about the variant for the Experiment. */
export type FirebaseExperimentVariantValue = {
	/** Optional. The user-specified value for this variant. Can be empty string. */
	value?: string | null;
	/** If this boolean is set, then fallback to the next parameter in the Template condition chain */
	noChange?: boolean | null;
	/** The variant identifier for the Experiment. */
	variantId?: string | null;
};

/** Explain metrics for the query. */
export type FirebaseExplainMetrics = {
	/** Planning phase information for the query. */
	planSummary?: FirebasePlanSummary | null;
	/** Aggregated stats from the execution of the query. Only present when ExplainOptions.analyze is set to true. */
	executionStats?: FirebaseExecutionStats | null;
};

/** Pipeline explain stats. Depending on the explain options in the original request, this can contain the optimized plan and / or execution stats. */
export type FirebaseExplainStats = {
	/** The format depends on the `output_format` options in the request. Currently there are two supported options: `TEXT` and `JSON`. Both supply a `google.protobuf.StringValue`. */
	data?: Record<string, FirebaseJsonValue> | null;
};

/** Represents an expression text. Example: title: "User account presence" description: "Determines whether the request has a user account" expression: "size(request.user) > 0" */
export type FirebaseExpr = {
	/** An optional description of the expression. This is a longer text which describes the expression, e.g. when hovered over it in a UI. */
	description?: string | null;
	/** Textual representation of an expression in Common Expression Language syntax. The application context of the containing message determines which well-known feature set of CEL is supported. */
	expression?: string | null;
	/** An optional string indicating the location of the expression for error reporting, e.g. a file name and a position in the file. */
	location?: string | null;
	/** An optional title for the expression, i.e. a short string describing its purpose. This can be used e.g. in UIs which allow to enter the expression. */
	title?: string | null;
};

/** Describes where in a file an expression is found and what it was evaluated to over the course of its use. */
export type FirebaseExpressionReport = {
	/** Values that this expression evaluated to when encountered. */
	values?: Array<FirebaseValueCount> | null;
	/** Position of expression in original rules source. */
	sourcePosition?: FirebaseSourcePosition | null;
	/** Subexpressions */
	children?: Array<FirebaseExpressionReport> | null;
};

/** Platform independent options for features provided by the FCM SDKs. */
export type FirebaseFcmOptions = {
	/** Label associated with the message's analytics data. */
	analyticsLabel?: string | null;
};

/** * The Firebase Remote Config configuration data for an app instance. */
export type FirebaseFetchRemoteConfigResponse = {
	/** Metadata describing active Remote Config rollouts which are related to parameters delivered via this fetch response. */
	rolloutMetadata?: Array<FirebaseRolloutMetadata> | null;
	/** The state of the fetched response. */
	state?: string | null;
	/** The Key-Value pairs of the config. */
	entries?: Record<string, string> | null;
	/** Firebase A/B Testing experiment configuration and metadata. */
	experimentDescriptions?: Array<FirebaseExperimentDescription> | null;
	/** A map of Remote Config parameter key to Firebase Personalization related metadata that should be delivered to the particular device making the fetch call. */
	personalizationMetadata?: Record<
		string,
		FirebasePersonalizationMetadata
	> | null;
	/** For Android apps, app_name is the package name of the app. For iOS apps, it is the bundle name. */
	appName?: string | null;
	/** Used to record the current template in the response. */
	templateVersion?: (string | number) | null;
};

/** `File` containing source content. */
export type FirebaseFile = {
	/** Required. File name. */
	name?: string | null;
	/** Required. Textual Content. */
	content?: string | null;
	/** Fingerprint (e.g. github sha) associated with the `File`. (base64) */
	fingerprint?: string | null;
};

/** A high-level summary of an App. */
export type FirebaseFirebaseAppInfo = {
	/** Output only. The lifecycle state of the App. */
	state?: string | null;
	/** The resource name of the Firebase App, in the format: projects/PROJECT_ID /iosApps/APP_ID or projects/PROJECT_ID/androidApps/APP_ID or projects/ PROJECT_ID/webApps/APP_ID */
	name?: string | null;
	/** The platform of the Firebase App. */
	platform?: string | null;
	/** The user-assigned display name of the Firebase App. */
	displayName?: string | null;
	/** Output only. Immutable. The platform-specific identifier of the App. *Note:* For most use cases, use `appId`, which is the canonical, globally unique identifier for referencing an App. */
	namespace?: string | null;
	/** Output only. If the App has been removed from the Project, this is the timestamp of when the App is considered expired and will be permanently deleted. After this time, the App cannot be undeleted (that is, restored to the Project). This value is only provided if the App is in the `DELETED` state. */
	expireTime?: string | null;
	/** The globally unique, Google-assigned identifier (UID) for the Firebase API key associated with the App. Be aware that this value is the UID of the API key, _not_ the [`keyString`](https://cloud.google.com/api-keys/docs/reference/rest/v2/projects.locations.keys#Key.FIELDS.key_string) of the API key. */
	apiKeyId?: string | null;
	/** Output only. Immutable. The globally unique, Firebase-assigned identifier for the `WebApp`. This identifier should be treated as an opaque token, as the data format is not specified. */
	appId?: string | null;
};

/** A `FirebaseProject` is the top-level Firebase entity. It is the container for Firebase Apps, Firebase Hosting sites, storage systems (Firebase Realtime Database, Cloud Firestore, Cloud Storage buckets), and other Firebase and Google Cloud resources. */
export type FirebaseFirebaseProject = {
	/** Output only. Immutable. The globally unique, Google-assigned canonical identifier for the Project. Use this identifier when configuring integrations and/or making API calls to Firebase or third-party services. */
	projectNumber?: (string | number) | null;
	/** The resource name of the Project, in the format: projects/PROJECT_IDENTIFIER PROJECT_IDENTIFIER: the Project's `ProjectNumber` ***(recommended)*** or its `ProjectId`. Learn more about using project identifiers in Google's [AIP 2510 standard](https://google.aip.dev/cloud/2510). */
	name?: string | null;
	/** Output only. The lifecycle state of the Project. */
	state?: string | null;
	/** Output only. Immutable. A user-assigned unique identifier for the Project. This identifier may appear in URLs or names for some Firebase resources associated with the Project, but it should generally be treated as a convenience alias to reference the Project. */
	projectId?: string | null;
	/** The user-assigned display name of the Project. */
	displayName?: string | null;
	/** This checksum is computed by the server based on the value of other fields, and it may be sent with update requests to ensure the client has an up-to-date value before proceeding. Learn more about `etag` in Google's [AIP-154 standard](https://google.aip.dev/154#declarative-friendly-resources). */
	etag?: string | null;
	/** A set of user-defined annotations for the FirebaseProject. Learn more about annotations in Google's [AIP-128 standard](https://google.aip.dev/128#annotations). These annotations are intended solely for developers and client-side tools. Firebase services will not mutate this annotations set. */
	annotations?: Record<string, string> | null;
	/** Output only. **DEPRECATED.** _Auto-provisioning of these resources is changing, so this object no longer reliably provides information about the Project. */
	resources?: FirebaseDefaultResources | null;
};

/** Represents a service-defined function call that was invoked during test execution. */
export type FirebaseFunctionCall = {
	/** The arguments that were provided to the function. */
	args?: Array<FirebaseJsonValue> | null;
	/** Name of the function invoked. */
	function?: string | null;
};

/** The response for FirebaseRulesService.GetReleaseExecutable */
export type FirebaseGetReleaseExecutableResponse = {
	/** Executable view of the `Ruleset` referenced by the `Release`. (base64) */
	executable?: string | null;
	/** `Language` used to generate the executable bytes. */
	language?: string | null;
	/** Timestamp for the most recent `Release.update_time`. */
	updateTime?: string | null;
	/** `Ruleset` name associated with the `Release` executable. */
	rulesetName?: string | null;
	/** Optional, indicates the freshness of the result. The response is guaranteed to be the latest within an interval up to the sync_time (inclusive). */
	syncTime?: string | null;
	/** The Rules runtime version of the executable. */
	executableVersion?: string | null;
};

/** Defines a policy of allowing every region by default and adding disallowed regions to a disallow list. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2AllowByDefault = {
	/** Two letter unicode region codes to disallow as defined by https://cldr.unicode.org/ The full list of these region codes is here: https://github.com/unicode-cldr/cldr-localenames-full/blob/master/main/en/territories.json */
	disallowedRegions?: Array<string> | null;
};

/** Defines a policy of only allowing regions by explicitly adding them to an allowlist. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2AllowlistOnly = {
	/** Two letter unicode region codes to allow as defined by https://cldr.unicode.org/ The full list of these region codes is here: https://github.com/unicode-cldr/cldr-localenames-full/blob/master/main/en/territories.json */
	allowedRegions?: Array<string> | null;
};

/** Configuration options related to authenticating an anonymous user. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2Anonymous = {
	/** Whether anonymous user auth is enabled for the project or not. */
	enabled?: boolean | null;
};

/** Additional config for SignInWithApple. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2AppleSignInConfig = {
	/** A list of Bundle ID's usable by this project */
	bundleIds?: Array<string> | null;
	/** Additional config for Apple for code flow. */
	codeFlowConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2CodeFlowConfig | null;
};

/** Configuration related to Blocking Functions. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2BlockingFunctionsConfig = {
	/** Map of Trigger to event type. Key should be one of the supported event types: "beforeCreate", "beforeSignIn" */
	triggers?: Record<
		string,
		FirebaseGoogleCloudIdentitytoolkitAdminV2Trigger
	> | null;
	/** The user credentials to include in the JWT payload that is sent to the registered Blocking Functions. */
	forwardInboundCredentials?: FirebaseGoogleCloudIdentitytoolkitAdminV2ForwardInboundCredentials | null;
};

/** Options related to how clients making requests on behalf of a project should be configured. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2ClientConfig = {
	/** Configuration related to restricting a user's ability to affect their account. */
	permissions?: FirebaseGoogleCloudIdentitytoolkitAdminV2Permissions | null;
	/** Output only. Firebase subdomain. */
	firebaseSubdomain?: string | null;
	/** Output only. API key that can be used when making requests for this project. */
	apiKey?: string | null;
};

/** Options related to how clients making requests on behalf of a tenant should be configured. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2ClientPermissionConfig = {
	/** Configuration related to restricting a user's ability to affect their account. */
	permissions?: FirebaseGoogleCloudIdentitytoolkitAdminV2ClientPermissions | null;
};

/** Configuration related to restricting a user's ability to affect their account. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2ClientPermissions = {
	/** When true, end users cannot delete their account on the associated project through any of our API methods */
	disabledUserDeletion?: boolean | null;
	/** When true, end users cannot sign up for a new account on the associated project through any of our API methods */
	disabledUserSignup?: boolean | null;
};

/** Additional config for Apple for code flow. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2CodeFlowConfig = {
	/** Key ID for the private key. */
	keyId?: string | null;
	/** Private key used for signing the client secret JWT. */
	privateKey?: string | null;
	/** Apple Developer Team ID. */
	teamId?: string | null;
};

/** Represents an Identity Toolkit project. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2Config = {
	/** The project level password policy configuration. */
	passwordPolicyConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2PasswordPolicyConfig | null;
	/** Configuration related to blocking functions. */
	blockingFunctions?: FirebaseGoogleCloudIdentitytoolkitAdminV2BlockingFunctionsConfig | null;
	/** Output only. Default Firebase hosting site name */
	defaultHostingSite?: string | null;
	/** Configuration related to local sign in methods. */
	signIn?: FirebaseGoogleCloudIdentitytoolkitAdminV2SignInConfig | null;
	/** Whether anonymous users will be auto-deleted after a period of 30 days. */
	autodeleteAnonymousUsers?: boolean | null;
	/** List of domains authorized for OAuth redirects */
	authorizedDomains?: Array<string> | null;
	/** Configures which regions are enabled for SMS verification code sending. */
	smsRegionConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2SmsRegionConfig | null;
	/** Configuration related to multi-tenant functionality. */
	multiTenant?: FirebaseGoogleCloudIdentitytoolkitAdminV2MultiTenantConfig | null;
	/** Configuration related to quotas. */
	quota?: FirebaseGoogleCloudIdentitytoolkitAdminV2QuotaConfig | null;
	/** Configuration related to monitoring project activity. */
	monitoring?: FirebaseGoogleCloudIdentitytoolkitAdminV2MonitoringConfig | null;
	/** The project-level reCAPTCHA config. */
	recaptchaConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaConfig | null;
	/** Configuration related to sending notifications to users. */
	notification?: FirebaseGoogleCloudIdentitytoolkitAdminV2NotificationConfig | null;
	/** Output only. The name of the Config resource. Example: "projects/my-awesome-project/config" */
	name?: string | null;
	/** Configuration for settings related to email privacy and public visibility. */
	emailPrivacyConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2EmailPrivacyConfig | null;
	/** Options related to how clients making requests on behalf of a project should be configured. */
	client?: FirebaseGoogleCloudIdentitytoolkitAdminV2ClientConfig | null;
	/** Output only. The subtype of this config. */
	subtype?: string | null;
	/** Configuration for this project's multi-factor authentication, including whether it is active and what factors can be used for the second factor */
	mfa?: FirebaseGoogleCloudIdentitytoolkitAdminV2MultiFactorAuthConfig | null;
	/** Configuration for settings related to univeral links (iOS) and app links (Android). */
	mobileLinksConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2MobileLinksConfig | null;
};

/** Custom strength options to enforce on user passwords. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2CustomStrengthOptions = {
	/** The password must contain a lower case character. */
	containsLowercaseCharacter?: boolean | null;
	/** Maximum password length. No default max length */
	maxPasswordLength?: number | null;
	/** Minimum password length. Range from 6 to 30 */
	minPasswordLength?: number | null;
	/** The password must contain an upper case character. */
	containsUppercaseCharacter?: boolean | null;
	/** The password must contain a number. */
	containsNumericCharacter?: boolean | null;
	/** The password must contain a non alpha numeric character. */
	containsNonAlphanumericCharacter?: boolean | null;
};

/** Standard Identity Toolkit-trusted IDPs. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2DefaultSupportedIdp = {
	/** Id the of Idp */
	idpId?: string | null;
	/** Description of the Idp */
	description?: string | null;
};

/** Configurations options for authenticating with a the standard set of Identity Toolkit-trusted IDPs. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2DefaultSupportedIdpConfig =
	{
		/** OAuth client ID. */
		clientId?: string | null;
		/** OAuth client secret. */
		clientSecret?: string | null;
		/** Additional config for Apple-based projects. */
		appleSignInConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2AppleSignInConfig | null;
		/** True if allows the user to sign in with the provider. */
		enabled?: boolean | null;
		/** The name of the DefaultSupportedIdpConfig resource, for example: "projects/my-awesome-project/defaultSupportedIdpConfigs/google.com" */
		name?: string | null;
	};

/** Information of custom domain DNS verification. By default, default_domain will be used. A custom domain can be configured using VerifyCustomDomain. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2DnsInfo = {
	/** Output only. The timestamp of initial request for the current domain verification. */
	domainVerificationRequestTime?: string | null;
	/** Output only. The custom domain that's to be verified. */
	pendingCustomDomain?: string | null;
	/** Output only. The current verification state of the custom domain. The custom domain will only be used once the domain verification is successful. */
	customDomainState?: string | null;
	/** Whether to use custom domain. */
	useCustomDomain?: boolean | null;
	/** Output only. The applied verified custom domain. */
	customDomain?: string | null;
};

/** Configuration options related to authenticating a user by their email address. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2Email = {
	/** Whether a password is required for email auth or not. If true, both an email and password must be provided to sign in. If false, a user may sign in via either email/password or email link. */
	passwordRequired?: boolean | null;
	/** Whether email auth is enabled for the project or not. */
	enabled?: boolean | null;
};

/** Configuration for settings related to email privacy and public visibility. Settings in this config protect against email enumeration, but may make some trade-offs in user-friendliness. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2EmailPrivacyConfig = {
	/** Migrates the project to a state of improved email privacy. For example certain error codes are more generic to avoid giving away information on whether the account exists. In addition, this disables certain features that as a side-effect allow user enumeration. */
	enableImprovedEmailPrivacy?: boolean | null;
};

/** Email template. The subject and body fields can contain the following placeholders which will be replaced with the appropriate values: %LINK% - The link to use to redeem the send OOB code. %EMAIL% - The email where the email is being sent. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2EmailTemplate = {
	/** Email body format */
	bodyFormat?: string | null;
	/** Local part of From address */
	senderLocalPart?: string | null;
	/** Email body */
	body?: string | null;
	/** Reply-to address */
	replyTo?: string | null;
	/** Sender display name */
	senderDisplayName?: string | null;
	/** Subject of the email */
	subject?: string | null;
	/** Output only. Whether the body or subject of the email is customized. */
	customized?: boolean | null;
};

/** Indicates which credentials to pass to the registered Blocking Functions. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2ForwardInboundCredentials =
	{
		/** Whether to pass the user's OIDC identity provider's ID token. */
		idToken?: boolean | null;
		/** Whether to pass the user's OAuth identity provider's access token. */
		accessToken?: boolean | null;
		/** Whether to pass the user's OAuth identity provider's refresh token. */
		refreshToken?: boolean | null;
	};

/** History information of the hash algorithm and key. Different accounts' passwords may be generated by different version. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2HashConfig = {
	/** Output only. Memory cost for hash calculation. Used by scrypt and other similar password derivation algorithms. See https://tools.ietf.org/html/rfc7914 for explanation of field. */
	memoryCost?: number | null;
	/** Output only. Different password hash algorithms used in Identity Toolkit. */
	algorithm?: string | null;
	/** Output only. Non-printable character to be inserted between the salt and plain text password in base64. */
	saltSeparator?: string | null;
	/** Output only. How many rounds for hash calculation. Used by scrypt and other similar password derivation algorithms. */
	rounds?: number | null;
	/** Output only. Signer key in base64. */
	signerKey?: string | null;
};

/** The IDP's certificate data to verify the signature in the SAMLResponse issued by the IDP. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2IdpCertificate = {
	/** The x509 certificate */
	x509Certificate?: string | null;
};

/** The SAML IdP (Identity Provider) configuration when the project acts as the relying party. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2IdpConfig = {
	/** URL to send Authentication request to. */
	ssoUrl?: string | null;
	/** IDP's public keys for verifying signature in the assertions. */
	idpCertificates?: Array<FirebaseGoogleCloudIdentitytoolkitAdminV2IdpCertificate> | null;
	/** Indicates if outbounding SAMLRequest should be signed. */
	signRequest?: boolean | null;
	/** Unique identifier for all SAML entities. */
	idpEntityId?: string | null;
};

/** A pair of SAML RP-IDP configurations when the project acts as the relying party. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2InboundSamlConfig = {
	/** The name of the InboundSamlConfig resource, for example: 'projects/my-awesome-project/inboundSamlConfigs/my-config-id'. Ignored during create requests. */
	name?: string | null;
	/** The config's display name set by developers. */
	displayName?: string | null;
	/** True if allows the user to sign in with the provider. */
	enabled?: boolean | null;
	/** The SAML IdP (Identity Provider) configuration when the project acts as the relying party. */
	idpConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2IdpConfig | null;
	/** The SAML SP (Service Provider) configuration when the project acts as the relying party to receive and accept an authentication assertion issued by a SAML identity provider. */
	spConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2SpConfig | null;
};

/** Settings that the tenants will inherit from project level. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2Inheritance = {
	/** Whether to allow the tenant to inherit custom domains, email templates, and custom SMTP settings. If true, email sent from tenant will follow the project level email sending configurations. If false (by default), emails will go with the default settings with no customizations. */
	emailSendingConfig?: boolean | null;
};

/** Response for InitializeIdentityPlatform. Empty for now. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2InitializeIdentityPlatformResponse =
	Record<string, FirebaseJsonValue>;

/** Response for DefaultSupportedIdpConfigs */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2ListDefaultSupportedIdpConfigsResponse =
	{
		/** Token to retrieve the next page of results, or empty if there are no more results in the list. */
		nextPageToken?: string | null;
		/** The set of configs. */
		defaultSupportedIdpConfigs?: Array<FirebaseGoogleCloudIdentitytoolkitAdminV2DefaultSupportedIdpConfig> | null;
	};

/** Response for ListDefaultSupportedIdps */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2ListDefaultSupportedIdpsResponse =
	{
		/** The set of configs. */
		defaultSupportedIdps?: Array<FirebaseGoogleCloudIdentitytoolkitAdminV2DefaultSupportedIdp> | null;
		/** Token to retrieve the next page of results, or empty if there are no more results in the list. */
		nextPageToken?: string | null;
	};

/** Response for ListInboundSamlConfigs */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2ListInboundSamlConfigsResponse =
	{
		/** The set of configs. */
		inboundSamlConfigs?: Array<FirebaseGoogleCloudIdentitytoolkitAdminV2InboundSamlConfig> | null;
		/** Token to retrieve the next page of results, or empty if there are no more results in the list. */
		nextPageToken?: string | null;
	};

/** Response for ListOAuthIdpConfigs */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2ListOAuthIdpConfigsResponse =
	{
		/** Token to retrieve the next page of results, or empty if there are no more results in the list. */
		nextPageToken?: string | null;
		/** The set of configs. */
		oauthIdpConfigs?: Array<FirebaseGoogleCloudIdentitytoolkitAdminV2OAuthIdpConfig> | null;
	};

/** Response message for ListTenants. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2ListTenantsResponse = {
	/** A list of tenants under the given agent project. */
	tenants?: Array<FirebaseGoogleCloudIdentitytoolkitAdminV2Tenant> | null;
	/** The token to get the next page of results. */
	nextPageToken?: string | null;
};

/** Configuration mobile links. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2MobileLinksConfig = {
	/** Open code in app domain to use for app links and universal links. */
	domain?: string | null;
};

/** Configuration related to monitoring project activity. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2MonitoringConfig = {
	/** Configuration for logging requests made to this project to Stackdriver Logging */
	requestLogging?: FirebaseGoogleCloudIdentitytoolkitAdminV2RequestLogging | null;
};

/** Options related to MultiFactor Authentication for the project. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2MultiFactorAuthConfig = {
	/** A list of usable second factors for this project along with their configurations. This field does not support phone based MFA, for that use the 'enabled_providers' field. */
	providerConfigs?: Array<FirebaseGoogleCloudIdentitytoolkitAdminV2ProviderConfig> | null;
	/** Whether MultiFactor Authentication has been enabled for this project. */
	state?: string | null;
	/** A list of usable second factors for this project. */
	enabledProviders?: Array<string> | null;
};

/** Configuration related to multi-tenant functionality. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2MultiTenantConfig = {
	/** The default cloud parent org or folder that the tenant project should be created under. The parent resource name should be in the format of "/", such as "folders/123" or "organizations/456". */
	defaultTenantLocation?: string | null;
	/** Whether this project can have tenants or not. */
	allowTenants?: boolean | null;
};

/** Configuration related to sending notifications to users. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2NotificationConfig = {
	/** Options for email sending. */
	sendEmail?: FirebaseGoogleCloudIdentitytoolkitAdminV2SendEmail | null;
	/** Options for SMS sending. */
	sendSms?: FirebaseGoogleCloudIdentitytoolkitAdminV2SendSms | null;
	/** Default locale used for email and SMS in IETF BCP 47 format. */
	defaultLocale?: string | null;
};

/** Configuration options for authenticating with an OAuth IDP. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2OAuthIdpConfig = {
	/** For OIDC Idps, the issuer identifier. */
	issuer?: string | null;
	/** The response type to request for in the OAuth authorization flow. You can set either `id_token` or `code` to true, but not both. Setting both types to be simultaneously true (`{code: true, id_token: true}`) is not yet supported. */
	responseType?: FirebaseGoogleCloudIdentitytoolkitAdminV2OAuthResponseType | null;
	/** The config's display name set by developers. */
	displayName?: string | null;
	/** The client secret of the OAuth client, to enable OIDC code flow. */
	clientSecret?: string | null;
	/** The name of the OAuthIdpConfig resource, for example: 'projects/my-awesome-project/oauthIdpConfigs/oauth-config-id'. Ignored during create requests. */
	name?: string | null;
	/** The client id of an OAuth client. */
	clientId?: string | null;
	/** True if allows the user to sign in with the provider. */
	enabled?: boolean | null;
};

/** The response type to request for in the OAuth authorization flow. You can set either `id_token` or `code` to true, but not both. Setting both types to be simultaneously true (`{code: true, id_token: true}`) is not yet supported. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2OAuthResponseType = {
	/** If true, ID token is returned from IdP's authorization endpoint. */
	idToken?: boolean | null;
	/** If true, authorization code is returned from IdP's authorization endpoint. */
	code?: boolean | null;
	/** Do not use. The `token` response type is not supported at the moment. */
	token?: boolean | null;
};

/** The configuration for the password policy on the project. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2PasswordPolicyConfig = {
	/** Must be of length 1. Contains the strength attributes for the password policy. */
	passwordPolicyVersions?: Array<FirebaseGoogleCloudIdentitytoolkitAdminV2PasswordPolicyVersion> | null;
	/** Output only. The last time the password policy on the project was updated. */
	lastUpdateTime?: string | null;
	/** Users must have a password compliant with the password policy to sign-in. */
	forceUpgradeOnSignin?: boolean | null;
	/** Which enforcement mode to use for the password policy. */
	passwordPolicyEnforcementState?: string | null;
};

/** The strength attributes for the password policy on the project. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2PasswordPolicyVersion = {
	/** The custom strength options enforced by the password policy. */
	customStrengthOptions?: FirebaseGoogleCloudIdentitytoolkitAdminV2CustomStrengthOptions | null;
	/** Output only. schema version number for the password policy */
	schemaVersion?: number | null;
};

/** Configuration related to restricting a user's ability to affect their account. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2Permissions = {
	/** When true, end users cannot delete their account on the associated project through any of our API methods */
	disabledUserDeletion?: boolean | null;
	/** When true, end users cannot sign up for a new account on the associated project through any of our API methods */
	disabledUserSignup?: boolean | null;
};

/** Configuration options related to authenticated a user by their phone number. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2PhoneNumber = {
	/** A map of that can be used for phone auth testing. */
	testPhoneNumbers?: Record<string, string> | null;
	/** Whether phone number auth is enabled for the project or not. */
	enabled?: boolean | null;
};

/** ProviderConfig describes the supported MFA providers along with their configurations. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2ProviderConfig = {
	/** TOTP MFA provider config for this project. */
	totpProviderConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2TotpMfaProviderConfig | null;
	/** Describes the state of the MultiFactor Authentication type. */
	state?: string | null;
};

/** Configuration related to quotas. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2QuotaConfig = {
	/** Quota for the Signup endpoint, if overwritten. Signup quota is measured in sign ups per project per hour per IP. */
	signUpQuotaConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2TemporaryQuota | null;
};

/** The reCAPTCHA Enterprise integration config. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaConfig = {
	/** Whether to use the rCE bot score for reCAPTCHA phone provider. Can only be true when the phone_enforcement_state is AUDIT or ENFORCE. */
	useSmsBotScore?: boolean | null;
	/** The reCAPTCHA keys. */
	recaptchaKeys?: Array<FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaKey> | null;
	/** The managed rules for authentication action based on reCAPTCHA scores. The rules are shared across providers for a given tenant project. */
	managedRules?: Array<FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaManagedRule> | null;
	/** The reCAPTCHA config for email/password provider, containing the enforcement status. The email/password provider contains all email related user flows protected by reCAPTCHA. */
	emailPasswordEnforcementState?: string | null;
	/** Whether to use the rCE sms toll fraud protection risk score for reCAPTCHA phone provider. Can only be true when the phone_enforcement_state is AUDIT or ENFORCE. */
	useSmsTollFraudProtection?: boolean | null;
	/** The reCAPTCHA config for phone provider, containing the enforcement status. The phone provider contains all SMS related user flows protected by reCAPTCHA. */
	phoneEnforcementState?: string | null;
	/** Whether to use the account defender for reCAPTCHA assessment. Defaults to `false`. */
	useAccountDefender?: boolean | null;
	/** The managed rules for the authentication action based on reCAPTCHA toll fraud risk scores. Toll fraud managed rules will only take effect when the phone_enforcement_state is AUDIT or ENFORCE and use_sms_toll_fraud_protection is true. */
	tollFraudManagedRules?: Array<FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaTollFraudManagedRule> | null;
};

/** The reCAPTCHA key config. reCAPTCHA Enterprise offers different keys for different client platforms. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaKey = {
	/** The reCAPTCHA Enterprise key resource name, e.g. "projects/{project}/keys/{key}" */
	key?: string | null;
	/** The client's platform type. */
	type?: string | null;
};

/** The config for a reCAPTCHA managed rule. Models a single interval [start_score, end_score]. The start_score is implicit. It is either the closest smaller end_score (if one is available) or 0. Intervals in aggregate span [0, 1] without overlapping. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaManagedRule = {
	/** The action taken if the reCAPTCHA score of a request is within the interval [start_score, end_score]. */
	action?: string | null;
	/** The end score (inclusive) of the score range for an action. Must be a value between 0.0 and 1.0, at 11 discrete values; e.g. 0, 0.1, 0.2, 0.3, ... 0.9, 1.0. A score of 0.0 indicates the riskiest request (likely a bot), whereas 1.0 indicates the safest request (likely a human). */
	endScore?: number | null;
};

/** The config for a reCAPTCHA toll fraud assessment managed rule. Models a single interval [start_score, end_score]. The end_score is implicit. It is either the closest smaller end_score (if one is available) or 0. Intervals in aggregate span [0, 1] without overlapping. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaTollFraudManagedRule =
	{
		/** The start score (inclusive) for an action. Must be a value between 0.0 and 1.0, at 11 discrete values; e.g. 0, 0.1, 0.2, 0.3, ... 0.9, 1.0. A score of 0.0 indicates the safest request (likely legitimate), whereas 1.0 indicates the riskiest request (likely toll fraud). */
		startScore?: number | null;
		/** The action taken if the reCAPTCHA score of a request is within the interval [start_score, end_score]. */
		action?: string | null;
	};

/** Configuration for logging requests made to this project to Stackdriver Logging */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2RequestLogging = {
	/** Whether logging is enabled for this project or not. */
	enabled?: boolean | null;
};

/** Options for email sending. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2SendEmail = {
	/** Information of custom domain DNS verification. */
	dnsInfo?: FirebaseGoogleCloudIdentitytoolkitAdminV2DnsInfo | null;
	/** Email template for verify email */
	verifyEmailTemplate?: FirebaseGoogleCloudIdentitytoolkitAdminV2EmailTemplate | null;
	/** Reset password email template for legacy Firebase V1 app. */
	legacyResetPasswordTemplate?: FirebaseGoogleCloudIdentitytoolkitAdminV2EmailTemplate | null;
	/** Email template for reset password */
	resetPasswordTemplate?: FirebaseGoogleCloudIdentitytoolkitAdminV2EmailTemplate | null;
	/** Email template for reverting second factor addition emails */
	revertSecondFactorAdditionTemplate?: FirebaseGoogleCloudIdentitytoolkitAdminV2EmailTemplate | null;
	/** Email template for change email */
	changeEmailTemplate?: FirebaseGoogleCloudIdentitytoolkitAdminV2EmailTemplate | null;
	/** Use a custom SMTP relay */
	smtp?: FirebaseGoogleCloudIdentitytoolkitAdminV2Smtp | null;
	/** The method used for sending an email. */
	method?: string | null;
	/** action url in email template. */
	callbackUri?: string | null;
};

/** Options for SMS sending. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2SendSms = {
	/** Output only. The template to use when sending an SMS. */
	smsTemplate?: FirebaseGoogleCloudIdentitytoolkitAdminV2SmsTemplate | null;
	/** Whether to use the accept_language header for SMS. */
	useDeviceLocale?: boolean | null;
};

/** Configuration related to local sign in methods. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2SignInConfig = {
	/** Configuration options related to authenticating an anonymous user. */
	anonymous?: FirebaseGoogleCloudIdentitytoolkitAdminV2Anonymous | null;
	/** Configuration options related to authenticated a user by their phone number. */
	phoneNumber?: FirebaseGoogleCloudIdentitytoolkitAdminV2PhoneNumber | null;
	/** Whether to allow more than one account to have the same email. */
	allowDuplicateEmails?: boolean | null;
	/** Configuration options related to authenticating a user by their email address. */
	email?: FirebaseGoogleCloudIdentitytoolkitAdminV2Email | null;
	/** Output only. Hash config information. */
	hashConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2HashConfig | null;
};

/** Configures the regions where users are allowed to send verification SMS for the project or tenant. This is based on the calling code of the destination phone number. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2SmsRegionConfig = {
	/** A policy of allowing SMS to every region by default and adding disallowed regions to a disallow list. */
	allowByDefault?: FirebaseGoogleCloudIdentitytoolkitAdminV2AllowByDefault | null;
	/** A policy of only allowing regions by explicitly adding them to an allowlist. */
	allowlistOnly?: FirebaseGoogleCloudIdentitytoolkitAdminV2AllowlistOnly | null;
};

/** The template to use when sending an SMS. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2SmsTemplate = {
	/** Output only. The SMS's content. Can contain the following placeholders which will be replaced with the appropriate values: %APP_NAME% - For Android or iOS apps, the app's display name. For web apps, the domain hosting the application. %LOGIN_CODE% - The OOB code being sent in the SMS. */
	content?: string | null;
};

/** Configuration for SMTP relay */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2Smtp = {
	/** SMTP relay username */
	username?: string | null;
	/** SMTP relay password */
	password?: string | null;
	/** Sender email for the SMTP relay */
	senderEmail?: string | null;
	/** SMTP relay port */
	port?: number | null;
	/** SMTP security mode. */
	securityMode?: string | null;
	/** SMTP relay host */
	host?: string | null;
};

/** The SP's certificate data for IDP to verify the SAMLRequest generated by the SP. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2SpCertificate = {
	/** Self-signed public certificate. */
	x509Certificate?: string | null;
	/** Timestamp of the cert expiration instance. */
	expiresAt?: string | null;
};

/** The SAML SP (Service Provider) configuration when the project acts as the relying party to receive and accept an authentication assertion issued by a SAML identity provider. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2SpConfig = {
	/** Output only. Public certificates generated by the server to verify the signature in SAMLRequest in the SP-initiated flow. */
	spCertificates?: Array<FirebaseGoogleCloudIdentitytoolkitAdminV2SpCertificate> | null;
	/** Callback URI where responses from IDP are handled. */
	callbackUri?: string | null;
	/** Unique identifier for all SAML entities. */
	spEntityId?: string | null;
};

/** Temporary quota increase / decrease */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2TemporaryQuota = {
	/** When this quota will take effect */
	startTime?: string | null;
	/** Corresponds to the 'refill_token_count' field in QuotaServer config */
	quota?: (string | number) | null;
	/** How long this quota will be active for */
	quotaDuration?: string | null;
};

/** A Tenant contains configuration for the tenant in a multi-tenant project. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2Tenant = {
	/** Whether to allow email/password user authentication. */
	allowPasswordSignup?: boolean | null;
	/** Whether authentication is disabled for the tenant. If true, the users under the disabled tenant are not allowed to sign-in. Admins of the disabled tenant are not able to manage its users. */
	disableAuth?: boolean | null;
	/** The tenant-level configuration of MFA options. */
	mfaConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2MultiFactorAuthConfig | null;
	/** Configuration related to monitoring project activity. */
	monitoring?: FirebaseGoogleCloudIdentitytoolkitAdminV2MonitoringConfig | null;
	/** Configuration for settings related to email privacy and public visibility. */
	emailPrivacyConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2EmailPrivacyConfig | null;
	/** Configures which regions are enabled for SMS verification code sending. */
	smsRegionConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2SmsRegionConfig | null;
	/** Options related to how clients making requests on behalf of a project should be configured. */
	client?: FirebaseGoogleCloudIdentitytoolkitAdminV2ClientPermissionConfig | null;
	/** Specify the settings that the tenant could inherit. */
	inheritance?: FirebaseGoogleCloudIdentitytoolkitAdminV2Inheritance | null;
	/** Output only. Hash config information of a tenant for display on Pantheon. This can only be displayed on Pantheon to avoid the sensitive information to get accidentally leaked. Only returned in GetTenant response to restrict reading of this information. */
	hashConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2HashConfig | null;
	/** Whether to enable anonymous user authentication. */
	enableAnonymousUser?: boolean | null;
	/** Whether to enable email link user authentication. */
	enableEmailLinkSignin?: boolean | null;
	/** The tenant-level reCAPTCHA config. */
	recaptchaConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaConfig | null;
	/** A map of pairs that can be used for MFA. The phone number should be in E.164 format (https://www.itu.int/rec/T-REC-E.164/) and a maximum of 10 pairs can be added (error will be thrown once exceeded). */
	testPhoneNumbers?: Record<string, string> | null;
	/** Whether anonymous users will be auto-deleted after a period of 30 days. */
	autodeleteAnonymousUsers?: boolean | null;
	/** The tenant-level password policy config */
	passwordPolicyConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2PasswordPolicyConfig | null;
	/** Optional. Deprecated. Never launched. Configuration for settings related to univeral links (iOS) and app links (Android). */
	mobileLinksConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2MobileLinksConfig | null;
	/** Output only. Resource name of a tenant. For example: "projects/{project-id}/tenants/{tenant-id}" */
	name?: string | null;
	/** Display name of the tenant. */
	displayName?: string | null;
};

/** TotpMFAProviderConfig represents the TOTP based MFA provider. */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2TotpMfaProviderConfig = {
	/** The allowed number of adjacent intervals that will be used for verification to avoid clock skew. */
	adjacentIntervals?: number | null;
};

/** Synchronous Cloud Function with HTTP Trigger */
export type FirebaseGoogleCloudIdentitytoolkitAdminV2Trigger = {
	/** HTTP URI trigger for the Cloud Function. */
	functionUri?: string | null;
	/** When the trigger was changed. */
	updateTime?: string | null;
};

/** Response message to BatchDeleteAccounts. */
export type FirebaseGoogleCloudIdentitytoolkitV1BatchDeleteAccountsResponse = {
	/** Detailed error info for accounts that cannot be deleted. */
	errors?: Array<FirebaseGoogleCloudIdentitytoolkitV1BatchDeleteErrorInfo> | null;
};

/** Error info for account failed to be deleted. */
export type FirebaseGoogleCloudIdentitytoolkitV1BatchDeleteErrorInfo = {
	/** Detailed error message. */
	message?: string | null;
	/** The corresponding user ID. */
	localId?: string | null;
	/** The index of the errored item in the original local_ids field. */
	index?: number | null;
};

/** Response message for CreateAuthUri. */
export type FirebaseGoogleCloudIdentitytoolkitV1CreateAuthUriResponse = {
	/** The provider ID from the request, if provided. */
	providerId?: string | null;
	allProviders?: Array<string> | null;
	/** Whether the user has previously signed in with the provider ID in the request. Present only when a registered email identifier is set in the request. */
	forExistingProvider?: boolean | null;
	/** The authorization URI for the requested provider. Present only when a provider ID is set in the request. */
	authUri?: string | null;
	/** Whether the email identifier represents an existing account. Present only when an email identifier is set in the request. */
	registered?: boolean | null;
	/** The list of sign-in methods that the user has previously used. Each element is one of `password`, `emailLink`, or the provider ID of an IdP. Present only when a registered email identifier is set in the request. */
	signinMethods?: Array<string> | null;
	/** Whether a CAPTCHA is needed because there have been too many failed login attempts by the user. Present only when a registered email identifier is set in the request. */
	captchaRequired?: boolean | null;
	/** The session ID from the request, or a random string generated by CreateAuthUri if absent. It is used to prevent session fixation attacks. */
	sessionId?: string | null;
	kind?: string | null;
};

/** Response message for CreateSessionCookie. */
export type FirebaseGoogleCloudIdentitytoolkitV1CreateSessionCookieResponse = {
	/** The session cookie that has been created from the Identity Platform ID token specified in the request. It is in the form of a JSON Web Token (JWT). Always present. */
	sessionCookie?: string | null;
};

/** Response message for DeleteAccount. */
export type FirebaseGoogleCloudIdentitytoolkitV1DeleteAccountResponse = {
	kind?: string | null;
};

/** Response message for DownloadAccount. */
export type FirebaseGoogleCloudIdentitytoolkitV1DownloadAccountResponse = {
	kind?: string | null;
	/** All accounts belonging to the project/tenant limited by max_results in the request. */
	users?: Array<FirebaseGoogleCloudIdentitytoolkitV1UserInfo> | null;
	/** If there are more accounts to be downloaded, a token that can be passed back to DownloadAccount to get more accounts. Otherwise, this is blank. */
	nextPageToken?: string | null;
};

/** Information about email MFA. */
export type FirebaseGoogleCloudIdentitytoolkitV1EmailInfo = {
	/** Email address that a MFA verification should be sent to. */
	emailAddress?: string | null;
};

/** Email template */
export type FirebaseGoogleCloudIdentitytoolkitV1EmailTemplate = {
	/** Whether the body or subject of the email is customized. */
	customized?: boolean | null;
	/** From address of the email */
	from?: string | null;
	/** Value is in III language code format (e.g. "zh-CN", "es"). Both '-' and '_' separators are accepted. */
	locale?: string | null;
	/** Whether the template is disabled. If true, a default template will be used. */
	disabled?: boolean | null;
	/** From display name */
	fromDisplayName?: string | null;
	/** Local part of From address */
	fromLocalPart?: string | null;
	/** Subject of the email */
	subject?: string | null;
	/** Reply-to address */
	replyTo?: string | null;
	/** Email body */
	body?: string | null;
	/** Email body format */
	format?: string | null;
};

/** Error information explaining why an account cannot be uploaded. batch upload. */
export type FirebaseGoogleCloudIdentitytoolkitV1ErrorInfo = {
	/** The index of the item, range is [0, request.size - 1] */
	index?: number | null;
	/** Detailed error message */
	message?: string | null;
};

/** Response message for GetAccountInfo. */
export type FirebaseGoogleCloudIdentitytoolkitV1GetAccountInfoResponse = {
	kind?: string | null;
	/** The information of specific user account(s) matching the parameters in the request. */
	users?: Array<FirebaseGoogleCloudIdentitytoolkitV1UserInfo> | null;
};

/** Response message for GetOobCode. */
export type FirebaseGoogleCloudIdentitytoolkitV1GetOobCodeResponse = {
	kind?: string | null;
	/** If return_oob_link is false in the request, the email address the verification was sent to. */
	email?: string | null;
	/** If return_oob_link is true in the request, the OOB link to be sent to the user. This returns the constructed link including [Firebase Dynamic Link](https://firebase.google.com/docs/dynamic-links) related parameters. */
	oobLink?: string | null;
	/** If return_oob_link is true in the request, the OOB code to send. */
	oobCode?: string | null;
};

/** Response message for GetProjectConfig. */
export type FirebaseGoogleCloudIdentitytoolkitV1GetProjectConfigResponse = {
	/** The project id of the retrieved configuration. */
	projectId?: string | null;
	/** Google Cloud API key. This field is only returned for authenticated calls from a developer. */
	apiKey?: string | null;
	/** Email template for reset password. This field is only returned for authenticated calls from a developer. */
	resetPasswordTemplate?: FirebaseGoogleCloudIdentitytoolkitV1EmailTemplate | null;
	/** Whether to allow password account sign up. This field is only returned for authenticated calls from a developer. */
	allowPasswordUser?: boolean | null;
	/** Reset password email template for legacy Firebase V1 app. This field is only returned for authenticated calls from a developer. */
	legacyResetPasswordTemplate?: FirebaseGoogleCloudIdentitytoolkitV1EmailTemplate | null;
	/** Email template for verify email. This field is only returned for authenticated calls from a developer. */
	verifyEmailTemplate?: FirebaseGoogleCloudIdentitytoolkitV1EmailTemplate | null;
	/** Whether anonymous user is enabled. This field is only returned for authenticated calls from a developer. */
	enableAnonymousUser?: boolean | null;
	/** Whether to use email sending. This field is only returned for authenticated calls from a developer. */
	useEmailSending?: boolean | null;
	/** Email template for change email. This field is only returned for authenticated calls from a developer. */
	changeEmailTemplate?: FirebaseGoogleCloudIdentitytoolkitV1EmailTemplate | null;
	/** Email template for reverting second factor additions. This field is only returned for authenticated calls from a developer. */
	revertSecondFactorAdditionTemplate?: FirebaseGoogleCloudIdentitytoolkitV1EmailTemplate | null;
	/** Authorized domains for widget redirect. */
	authorizedDomains?: Array<string> | null;
	/** The Firebase Dynamic Links domain used to construct links for redirects to native apps. */
	dynamicLinksDomain?: string | null;
	/** OAuth2 provider config. This field is only returned for authenticated calls from a developer. */
	idpConfig?: Array<FirebaseGoogleCloudIdentitytoolkitV1IdpConfig> | null;
};

/** Response message for GetRecaptchaParam. */
export type FirebaseGoogleCloudIdentitytoolkitV1GetRecaptchaParamResponse = {
	kind?: string | null;
	/** The producer project number used to generate PIA tokens */
	producerProjectNumber?: string | null;
	recaptchaStoken?: string | null;
	/** The reCAPTCHA v2 site key used to invoke the reCAPTCHA service. Always present. */
	recaptchaSiteKey?: string | null;
};

/** Response message for GetSessionCookiePublicKeys. */
export type FirebaseGoogleCloudIdentitytoolkitV1GetSessionCookiePublicKeysResponse =
	{
		/** Public keys of the session cookie signer, formatted as [JSON Web Keys (JWK)](https://tools.ietf.org/html/rfc7517). */
		keys?: Array<FirebaseGoogleCloudIdentitytoolkitV1OpenIdConnectKey> | null;
	};

/** Config of an identity provider. */
export type FirebaseGoogleCloudIdentitytoolkitV1IdpConfig = {
	/** OAuth2 client secret. */
	secret?: string | null;
	/** Percent of users who will be prompted/redirected federated login for this IdP */
	experimentPercent?: number | null;
	/** True if allows the user to sign in with the provider. */
	enabled?: boolean | null;
	/** Whitelisted client IDs for audience check. */
	whitelistedAudiences?: Array<string> | null;
	provider?: string | null;
	/** OAuth2 client ID. */
	clientId?: string | null;
};

/** Response for IssueSamlResponse request. */
export type FirebaseGoogleCloudIdentitytoolkitV1IssueSamlResponseResponse = {
	/** First name of the user. */
	firstName?: string | null;
	/** Signed SAMLResponse created for the Relying Party. */
	samlResponse?: string | null;
	/** Last name of the user. */
	lastName?: string | null;
	/** Email of the user. */
	email?: string | null;
	/** Generated RelayState. */
	relayState?: string | null;
	/** Whether the logged in user was created by this request. */
	isNewUser?: boolean | null;
	/** The ACS endpoint which consumes the returned SAMLResponse. */
	acsEndpoint?: string | null;
};

/** Information on which multi-factor authentication (MFA) providers are enabled for an account. */
export type FirebaseGoogleCloudIdentitytoolkitV1MfaEnrollment = {
	/** Display name for this mfa option e.g. "corp cell phone". */
	displayName?: string | null;
	/** Normally this will show the phone number associated with this enrollment. In some situations, such as after a first factor sign in, it will only show the obfuscated version of the associated phone number. */
	phoneInfo?: string | null;
	/** Contains information specific to email MFA. */
	emailInfo?: FirebaseGoogleCloudIdentitytoolkitV1EmailInfo | null;
	/** Contains information specific to TOTP MFA. */
	totpInfo?: FirebaseGoogleCloudIdentitytoolkitV1TotpInfo | null;
	/** Output only. Unobfuscated phone_info. */
	unobfuscatedPhoneInfo?: string | null;
	/** Timestamp when the account enrolled this second factor. */
	enrolledAt?: string | null;
	/** ID of this MFA option. */
	mfaEnrollmentId?: string | null;
};

/** Represents a public key of the session cookie signer, formatted as a [JSON Web Key (JWK)](https://tools.ietf.org/html/rfc7517). */
export type FirebaseGoogleCloudIdentitytoolkitV1OpenIdConnectKey = {
	/** Modulus for the RSA public key, it is represented as the base64url encoding of the value's big endian representation. */
	n?: string | null;
	/** Exponent for the RSA public key, it is represented as the base64url encoding of the value's big endian representation. */
	e?: string | null;
	/** Key type. */
	kty?: string | null;
	/** Unique string to identify this key. */
	kid?: string | null;
	/** Key use. */
	use?: string | null;
	/** Signature algorithm. */
	alg?: string | null;
};

/** Information about the user as provided by various Identity Providers. */
export type FirebaseGoogleCloudIdentitytoolkitV1ProviderUserInfo = {
	/** The ID of the Identity Provider. */
	providerId?: string | null;
	/** The user's phone number at the Identity Provider. */
	phoneNumber?: string | null;
	/** The user's email address at the Identity Provider. */
	email?: string | null;
	/** The user's identifier at the Identity Provider. */
	federatedId?: string | null;
	/** The user's raw identifier directly returned from Identity Provider. */
	rawId?: string | null;
	/** The user's screen_name at Twitter or login name at GitHub. */
	screenName?: string | null;
	/** The user's profile photo URL at the Identity Provider. */
	photoUrl?: string | null;
	/** The user's display name at the Identity Provider. */
	displayName?: string | null;
};

/** Response message for QueryUserInfo. */
export type FirebaseGoogleCloudIdentitytoolkitV1QueryUserInfoResponse = {
	/** If `return_user_info` in the request is true, this is the number of returned accounts in this message. Otherwise, this is the total number of accounts matching the query. */
	recordsCount?: (string | number) | null;
	/** If `return_user_info` in the request is true, this is the accounts matching the query. */
	userInfo?: Array<FirebaseGoogleCloudIdentitytoolkitV1UserInfo> | null;
};

/** Response message for ResetPassword. */
export type FirebaseGoogleCloudIdentitytoolkitV1ResetPasswordResponse = {
	requestType?: string | null;
	kind?: string | null;
	mfaInfo?: FirebaseGoogleCloudIdentitytoolkitV1MfaEnrollment | null;
	/** The email associated with the out-of-band code that was used. */
	email?: string | null;
	newEmail?: string | null;
};

/** Response message for SendVerificationCode. */
export type FirebaseGoogleCloudIdentitytoolkitV1SendVerificationCodeResponse = {
	/** Encrypted session information. This can be used in signInWithPhoneNumber to authenticate the phone number. */
	sessionInfo?: string | null;
};

/** Response message for SetAccountInfo */
export type FirebaseGoogleCloudIdentitytoolkitV1SetAccountInfoResponse = {
	/** The account's display name. */
	displayName?: string | null;
	/** Deprecated. No actual password hash is currently returned. */
	passwordHash?: string | null;
	/** Whether the account's email has been verified. */
	emailVerified?: boolean | null;
	/** The account's email address. */
	email?: string | null;
	/** The new email that has been set on the user's account attributes. */
	newEmail?: string | null;
	/** The number of seconds until the Identity Platform ID token expires. */
	expiresIn?: (string | number) | null;
	kind?: string | null;
	/** A refresh token for the account. This is used for legacy user sign up. */
	refreshToken?: string | null;
	/** The user's photo URL for the account's profile photo. */
	photoUrl?: string | null;
	/** The ID of the authenticated user. */
	localId?: string | null;
	/** An Identity Platform ID token for the account. This is used for legacy user sign up. */
	idToken?: string | null;
	/** The linked Identity Providers on the account. */
	providerUserInfo?: Array<FirebaseGoogleCloudIdentitytoolkitV1ProviderUserInfo> | null;
};

/** Response message for SignInWithCustomToken. */
export type FirebaseGoogleCloudIdentitytoolkitV1SignInWithCustomTokenResponse =
	{
		/** The number of seconds until the ID token expires. */
		expiresIn?: (string | number) | null;
		/** Whether the authenticated user was created by this request. */
		isNewUser?: boolean | null;
		/** An Identity Platform ID token for the authenticated user. */
		idToken?: string | null;
		kind?: string | null;
		/** An Identity Platform refresh token for the authenticated user. */
		refreshToken?: string | null;
	};

/** Response message for SignInWithEmailLink. */
export type FirebaseGoogleCloudIdentitytoolkitV1SignInWithEmailLinkResponse = {
	/** Info on which multi-factor authentication providers are enabled. Present if the user needs to complete the sign-in using multi-factor authentication. */
	mfaInfo?: Array<FirebaseGoogleCloudIdentitytoolkitV1MfaEnrollment> | null;
	/** Refresh token for the authenticated user. */
	refreshToken?: string | null;
	/** An opaque string that functions as proof that the user has successfully passed the first factor check. */
	mfaPendingCredential?: string | null;
	/** The ID of the authenticated user. Always present in the response. */
	localId?: string | null;
	/** The email the user signed in with. Always present in the response. */
	email?: string | null;
	/** An Identity Platform ID token for the authenticated user. */
	idToken?: string | null;
	kind?: string | null;
	/** The number of seconds until the ID token expires. */
	expiresIn?: (string | number) | null;
	/** Whether the authenticated user was created by this request. */
	isNewUser?: boolean | null;
};

/** Response message for SignInWithGameCenter */
export type FirebaseGoogleCloudIdentitytoolkitV1SignInWithGameCenterResponse = {
	/** The user's Game Center team player ID. A unique identifier for a player of all the games that you distribute using your developer account. https://developer.apple.com/documentation/gamekit/gkplayer/3174857-teamplayerid */
	teamPlayerId?: string | null;
	/** The number of seconds until the ID token expires. */
	expiresIn?: (string | number) | null;
	/** Whether the logged in user was created by this request. */
	isNewUser?: boolean | null;
	/** The user's Game Center game player ID. A unique identifier for a player of the game. https://developer.apple.com/documentation/gamekit/gkplayer/3113960-gameplayerid */
	gamePlayerId?: string | null;
	/** The user's Game Center player ID. Pass `playerID` along with `gamePlayerID` and `teamPlayerID` to initiate the migration of a user's Game Center player ID to `gamePlayerID`. */
	playerId?: string | null;
	/** The ID of the authenticated user. Always present in the response. */
	localId?: string | null;
	/** An Identity Platform ID token for the authenticated user. */
	idToken?: string | null;
	/** Display name of the authenticated user. */
	displayName?: string | null;
	/** An Identity Platform refresh token for the authenticated user. */
	refreshToken?: string | null;
};

/** Response message for SignInWithIdp. */
export type FirebaseGoogleCloudIdentitytoolkitV1SignInWithIdpResponse = {
	/** The email address of the user's account at the IdP. */
	email?: string | null;
	/** The display name for the user's account at the IdP. */
	displayName?: string | null;
	/** The provider ID of the IdP that the user is signing in to. Always present in the response. */
	providerId?: string | null;
	/** The stringified JSON response containing all the data corresponding to the user's account at the IdP. */
	rawUserInfo?: string | null;
	/** The ID of the authenticated Identity Platform user. Always present in the response. */
	localId?: string | null;
	/** The full name for the user's account at the IdP. */
	fullName?: string | null;
	/** The value of the `tenant_id` field in the request. */
	tenantId?: string | null;
	/** The screen name for the user's account at the Twitter IdP or the login name for the user's account at the GitHub IdP. */
	screenName?: string | null;
	/** The last name for the user's account at the IdP. */
	lastName?: string | null;
	inputEmail?: string | null;
	kind?: string | null;
	/** Info on which multi-factor authentication providers are enabled for the account. Present if the user needs to complete the sign-in using multi-factor authentication. */
	mfaInfo?: Array<FirebaseGoogleCloudIdentitytoolkitV1MfaEnrollment> | null;
	/** The opaque string set in CreateAuthUri that is used to maintain contextual information between the authentication request and the callback from the IdP. */
	context?: string | null;
	/** The OAuth 2.0 refresh token from the IdP, if available and `return_refresh_token` is set to `true`. */
	oauthRefreshToken?: string | null;
	/** The URL of the user's profile picture at the IdP. */
	photoUrl?: string | null;
	/** The OAuth access token from the IdP, if available. */
	oauthAccessToken?: string | null;
	/** The main (top-level) email address of the user's Identity Platform account, if different from the email address at the IdP. Only present if the "One account per email address" setting is enabled. */
	originalEmail?: string | null;
	/** The number of seconds until the OAuth access token from the IdP expires. */
	oauthExpireIn?: number | null;
	/** An Identity Platform refresh token for the authenticated user. */
	refreshToken?: string | null;
	/** An opaque string that functions as proof that the user has successfully passed the first factor authentication. */
	mfaPendingCredential?: string | null;
	/** Whether the user account's email address is verified. */
	emailVerified?: boolean | null;
	/** The date of birth for the user's account at the IdP. */
	dateOfBirth?: string | null;
	/** The nickname for the user's account at the IdP. */
	nickName?: string | null;
	/** The user's account ID at the IdP. Always present in the response. */
	federatedId?: string | null;
	/** The OAuth 2.0 authorization code, if available. Only present for the Google provider. */
	oauthAuthorizationCode?: string | null;
	needEmail?: boolean | null;
	/** The OpenID Connect ID token from the IdP, if available. */
	oauthIdToken?: string | null;
	/** An opaque string that can be used as a credential from the IdP the user is signing into. The pending token obtained here can be set in a future SignInWithIdp request to sign the same user in with the IdP again. */
	pendingToken?: string | null;
	/** The language preference for the user's account at the IdP. */
	language?: string | null;
	/** The time zone for the user's account at the IdP. */
	timeZone?: string | null;
	/** Whether or not there is an existing Identity Platform user account with the same email address but linked to a different account at the same IdP. Only present if the "One account per email address" setting is enabled and the email address at the IdP is verified. */
	emailRecycled?: boolean | null;
	/** The error message returned if `return_idp_credential` is set to `true` and either the `FEDERATED_USER_ID_ALREADY_LINKED` or `EMAIL_EXISTS` error is encountered. This field's value is either `FEDERATED_USER_ID_ALREADY_LINKED` or `EMAIL_EXISTS`. */
	errorMessage?: string | null;
	/** The number of seconds until the Identity Platform ID token expires. */
	expiresIn?: (string | number) | null;
	/** Whether or not a new Identity Platform account was created for the authenticated user. */
	isNewUser?: boolean | null;
	/** Whether or not there is an existing Identity Platform user account with the same email address as the current account signed in at the IdP, and the account's email address is not verified at the IdP. */
	needConfirmation?: boolean | null;
	/** An Identity Platform ID token for the authenticated user. */
	idToken?: string | null;
	/** A list of provider IDs that the user can sign in to in order to resolve a `need_confirmation` error. Only present if `need_confirmation` is set to `true`. */
	verifiedProvider?: Array<string> | null;
	/** The first name for the user's account at the IdP. */
	firstName?: string | null;
	/** The OAuth 1.0 token secret from the IdP, if available. Only present for the Twitter provider. */
	oauthTokenSecret?: string | null;
};

/** Response message for SignInWithPassword. */
export type FirebaseGoogleCloudIdentitytoolkitV1SignInWithPasswordResponse = {
	/** The user's display name stored in the account's attributes. */
	displayName?: string | null;
	/** Warning notifications for the user. */
	userNotifications?: Array<FirebaseGoogleCloudIdentitytoolkitV1UserNotification> | null;
	/** Info on which multi-factor authentication providers are enabled for the account. Present if the user needs to complete the sign-in using multi-factor authentication. */
	mfaInfo?: Array<FirebaseGoogleCloudIdentitytoolkitV1MfaEnrollment> | null;
	/** Whether the email is for an existing account. Always true. */
	registered?: boolean | null;
	/** The email of the authenticated user. Always present in the response. */
	email?: string | null;
	/** An Identity Platform refresh token for the authenticated user. */
	refreshToken?: string | null;
	/** The access token expiration time in seconds. */
	oauthExpireIn?: number | null;
	/** The number of seconds until the Identity Platform ID token expires. */
	expiresIn?: (string | number) | null;
	oauthAuthorizationCode?: string | null;
	/** An Identity Platform ID token for the authenticated user. */
	idToken?: string | null;
	/** The user's profile picture stored in the account's attributes. */
	profilePicture?: string | null;
	kind?: string | null;
	/** An opaque string that functions as proof that the user has successfully passed the first factor authentication. */
	mfaPendingCredential?: string | null;
	/** The ID of the authenticated user. Always present in the response. */
	localId?: string | null;
	/** The OAuth2 access token. */
	oauthAccessToken?: string | null;
};

/** Response message for SignInWithPhoneNumber. */
export type FirebaseGoogleCloudIdentitytoolkitV1SignInWithPhoneNumberResponse =
	{
		/** A proof of the phone number verification, provided if a phone authentication is successful but the user operation fails. This happens when the request tries to link a phone number to a user with an ID token or reauthenticate with an ID token but the phone number is linked to a different user. */
		temporaryProof?: string | null;
		/** Do not use. */
		verificationProofExpiresIn?: (string | number) | null;
		/** Do not use. */
		verificationProof?: string | null;
		/** Phone number of the authenticated user. Always present in the response. */
		phoneNumber?: string | null;
		/** The number of seconds until the temporary proof expires. */
		temporaryProofExpiresIn?: (string | number) | null;
		/** Identity Platform ID token for the authenticated user. */
		idToken?: string | null;
		/** Refresh token for the authenticated user. */
		refreshToken?: string | null;
		/** The id of the authenticated user. Present in the case of a successful authentication. In the case when the phone could be verified but the account operation could not be performed, a temporary proof will be returned instead. */
		localId?: string | null;
		/** The number of seconds until the ID token expires. */
		expiresIn?: (string | number) | null;
		/** Whether the authenticated user was created by this request. */
		isNewUser?: boolean | null;
	};

/** Response message for SignUp. */
export type FirebaseGoogleCloudIdentitytoolkitV1SignUpResponse = {
	/** The ID of the created user. Always present in the response. */
	localId?: string | null;
	/** The created user's display name. */
	displayName?: string | null;
	/** The number of seconds until the ID token expires. */
	expiresIn?: (string | number) | null;
	/** An Identity Platform ID token for the created user. This field is only set for non-admin requests. */
	idToken?: string | null;
	/** An Identity Platform refresh token for the created user. This field is only set for non-admin requests. */
	refreshToken?: string | null;
	/** The created user's email. */
	email?: string | null;
	kind?: string | null;
};

/** Information about TOTP MFA. */
export type FirebaseGoogleCloudIdentitytoolkitV1TotpInfo = Record<
	string,
	FirebaseJsonValue
>;

/** Response message for UploadAccount. */
export type FirebaseGoogleCloudIdentitytoolkitV1UploadAccountResponse = {
	/** Detailed error info for accounts that cannot be uploaded. */
	error?: Array<FirebaseGoogleCloudIdentitytoolkitV1ErrorInfo> | null;
	kind?: string | null;
};

/** An Identity Platform account's information. */
export type FirebaseGoogleCloudIdentitytoolkitV1UserInfo = {
	/** Output only. This account's screen name at Twitter or login name at GitHub. */
	screenName?: string | null;
	/** The timestamp, in milliseconds from the epoch of 1970-01-01T00:00:00Z, when the account's password was last updated. */
	passwordUpdatedAt?: number | null;
	/** Output only. The date of birth set for the account. This account attribute is not used by Identity Platform. It is available for informational purposes only. */
	dateOfBirth?: string | null;
	/** The account's password salt. Only accessible by requests bearing a Google OAuth2 credential with proper permissions. (base64) */
	salt?: string | null;
	/** The account's phone number. */
	phoneNumber?: string | null;
	/** The URL of the account's profile photo. This account attribute is not used by Identity Platform. It is available for informational purposes only. */
	photoUrl?: string | null;
	/** Information on which multi-factor authentication providers are enabled for this account. */
	mfaInfo?: Array<FirebaseGoogleCloudIdentitytoolkitV1MfaEnrollment> | null;
	/** Whether the account's email address has been verified. */
	emailVerified?: boolean | null;
	/** Immutable. The unique ID of the account. */
	localId?: string | null;
	/** The account's email address. The length of the email should be less than 256 characters and in the format of `name@domain.tld`. The email should also match the [RFC 822](https://tools.ietf.org/html/rfc822) addr-spec. */
	email?: string | null;
	/** Input only. Plain text password used to update a account's password. This field is only ever used as input in a request. Identity Platform uses cryptographically secure hashing when managing passwords and will never store or transmit a user's password in plain text. */
	rawPassword?: string | null;
	/** Custom claims to be added to any ID tokens minted for the account. Should be at most 1,000 characters in length and in valid JSON format. */
	customAttributes?: string | null;
	/** The last time, in milliseconds from epoch, this account was logged into. */
	lastLoginAt?: (string | number) | null;
	/** ID of the tenant this account belongs to. Only set if this account belongs to a tenant. */
	tenantId?: string | null;
	/** The display name of the account. This account attribute is not used by Identity Platform. It is available for informational purposes only. */
	displayName?: string | null;
	/** The first email address associated with this account. The account's initial email cannot be changed once set and is used to recover access to this account if lost via the RECOVER_EMAIL flow in GetOobCode. Should match the [RFC 822](https://tools.ietf.org/html/rfc822) addr-spec. */
	initialEmail?: string | null;
	/** Output only. The time zone preference of the account. This account attribute is not used by Identity Platform. It is available for informational purposes only. */
	timeZone?: string | null;
	/** Output only. The language preference of the account. This account attribute is not used by Identity Platform. It is available for informational purposes only. */
	language?: string | null;
	/** The time, in milliseconds from epoch, when the account was created. */
	createdAt?: (string | number) | null;
	/** The version of the account's password. Only accessible by requests bearing a Google OAuth2 credential with proper permissions. */
	version?: number | null;
	/** Timestamp when an ID token was last minted for this account. */
	lastRefreshAt?: string | null;
	/** Output only. Whether the account can authenticate with email link. */
	emailLinkSignin?: boolean | null;
	/** Oldest timestamp, in seconds since epoch, that an ID token should be considered valid. All ID tokens issued before this time are considered invalid. */
	validSince?: (string | number) | null;
	/** Output only. Whether this account has been authenticated using SignInWithCustomToken. */
	customAuth?: boolean | null;
	/** Information about the user as provided by various Identity Providers. */
	providerUserInfo?: Array<FirebaseGoogleCloudIdentitytoolkitV1ProviderUserInfo> | null;
	/** Whether the account is disabled. Disabled accounts are inaccessible except for requests bearing a Google OAuth2 credential with proper permissions. */
	disabled?: boolean | null;
	/** The account's hashed password. Only accessible by requests bearing a Google OAuth2 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). (base64) */
	passwordHash?: string | null;
};

/** Warning notifications for the user. */
export type FirebaseGoogleCloudIdentitytoolkitV1UserNotification = {
	/** Warning notification enum. Can be used for localization. */
	notificationCode?: string | null;
	/** Warning notification string. Can be used as fallback. */
	notificationMessage?: string | null;
};

/** Response message for VerifyIosClient. */
export type FirebaseGoogleCloudIdentitytoolkitV1VerifyIosClientResponse = {
	/** Suggested time that the client should wait in seconds for delivery of the push notification. */
	suggestedTimeout?: (string | number) | null;
	/** Receipt of successful app token validation. */
	receipt?: string | null;
};

/** Custom strength options to enforce on user passwords. */
export type FirebaseGoogleCloudIdentitytoolkitV2CustomStrengthOptions = {
	/** Minimum password length. Range from 6 to 30 */
	minPasswordLength?: number | null;
	/** Maximum password length. No default max length */
	maxPasswordLength?: number | null;
	/** The password must contain a lower case character. */
	containsLowercaseCharacter?: boolean | null;
	/** The password must contain a non alpha numeric character. */
	containsNonAlphanumericCharacter?: boolean | null;
	/** The password must contain a number. */
	containsNumericCharacter?: boolean | null;
	/** The password must contain an upper case character. */
	containsUppercaseCharacter?: boolean | null;
};

/** FinalizeMfaEnrollment response. */
export type FirebaseGoogleCloudIdentitytoolkitV2FinalizeMfaEnrollmentResponse =
	{
		/** Refresh token updated to reflect MFA enrollment. */
		refreshToken?: string | null;
		/** ID token updated to reflect MFA enrollment. */
		idToken?: string | null;
		/** Auxiliary auth info specific to TOTP auth. */
		totpAuthInfo?: FirebaseGoogleCloudIdentitytoolkitV2FinalizeMfaTotpEnrollmentResponseInfo | null;
		/** Auxiliary auth info specific to phone auth. */
		phoneAuthInfo?: FirebaseGoogleCloudIdentitytoolkitV2FinalizeMfaPhoneResponseInfo | null;
	};

/** Phone Verification info for a FinalizeMfa response. */
export type FirebaseGoogleCloudIdentitytoolkitV2FinalizeMfaPhoneResponseInfo = {
	/** Android only. Long-lived replacement for valid code tied to android device. */
	androidVerificationProof?: string | null;
	/** For Android verification proof. */
	phoneNumber?: string | null;
	/** Android only. Expiration time of verification proof in seconds. */
	androidVerificationProofExpireTime?: string | null;
};

/** FinalizeMfaSignIn response. */
export type FirebaseGoogleCloudIdentitytoolkitV2FinalizeMfaSignInResponse = {
	/** Extra phone auth info, including android verification proof. */
	phoneAuthInfo?: FirebaseGoogleCloudIdentitytoolkitV2FinalizeMfaPhoneResponseInfo | null;
	/** ID token for the authenticated user. */
	idToken?: string | null;
	/** Refresh token for the authenticated user. */
	refreshToken?: string | null;
};

/** Mfa response info specific to TOTP auth for FinalizeMfa. */
export type FirebaseGoogleCloudIdentitytoolkitV2FinalizeMfaTotpEnrollmentResponseInfo =
	Record<string, FirebaseJsonValue>;

/** Configuration for password policy. */
export type FirebaseGoogleCloudIdentitytoolkitV2PasswordPolicy = {
	/** Output only. Allowed characters which satisfy the non_alphanumeric requirement. */
	allowedNonAlphanumericCharacters?: Array<string> | null;
	/** Users must have a password compliant with the password policy to sign-in. */
	forceUpgradeOnSignin?: boolean | null;
	/** Output only. schema version number for the password policy */
	schemaVersion?: number | null;
	/** The custom strength options enforced by the password policy. */
	customStrengthOptions?: FirebaseGoogleCloudIdentitytoolkitV2CustomStrengthOptions | null;
	/** Output only. Which enforcement mode to use for the password policy. */
	enforcementState?: string | null;
};

/** Configuration for reCAPTCHA */
export type FirebaseGoogleCloudIdentitytoolkitV2RecaptchaConfig = {
	/** Whether to use the rCE bot score for reCAPTCHA phone provider. */
	useSmsBotScore?: boolean | null;
	/** The reCAPTCHA enforcement state for the providers that GCIP supports reCAPTCHA protection. */
	recaptchaEnforcementState?: Array<FirebaseGoogleCloudIdentitytoolkitV2RecaptchaEnforcementState> | null;
	/** The reCAPTCHA Enterprise key resource name, e.g. "projects/{project}/keys/{key}". This will only be returned when the reCAPTCHA enforcement state is AUDIT or ENFORCE on at least one of the reCAPTCHA providers. */
	recaptchaKey?: string | null;
	/** Whether to use the rCE sms toll fraud protection risk score for reCAPTCHA phone provider. */
	useSmsTollFraudProtection?: boolean | null;
};

/** Enforcement states for reCAPTCHA protection. */
export type FirebaseGoogleCloudIdentitytoolkitV2RecaptchaEnforcementState = {
	/** The provider that has reCAPTCHA protection. */
	provider?: string | null;
	/** The reCAPTCHA enforcement state for the provider. */
	enforcementState?: string | null;
};

/** Response message for RevokeToken. Empty for now. */
export type FirebaseGoogleCloudIdentitytoolkitV2RevokeTokenResponse = Record<
	string,
	FirebaseJsonValue
>;

/** StartMfaEnrollment response. */
export type FirebaseGoogleCloudIdentitytoolkitV2StartMfaEnrollmentResponse = {
	/** Verification info to authorize sending an SMS for phone verification. */
	phoneSessionInfo?: FirebaseGoogleCloudIdentitytoolkitV2StartMfaPhoneResponseInfo | null;
	/** Enrollment response info specific to TOTP auth. */
	totpSessionInfo?: FirebaseGoogleCloudIdentitytoolkitV2StartMfaTotpEnrollmentResponseInfo | null;
};

/** Phone Verification info for a StartMfa response. */
export type FirebaseGoogleCloudIdentitytoolkitV2StartMfaPhoneResponseInfo = {
	/** An opaque string that represents the enrollment session. */
	sessionInfo?: string | null;
};

/** StartMfaSignIn response. */
export type FirebaseGoogleCloudIdentitytoolkitV2StartMfaSignInResponse = {
	/** MultiFactor sign-in session information specific to SMS-type second factors. Along with the one-time code retrieved from the sent SMS, the contents of this session information should be passed to FinalizeMfaSignIn to complete the sign in. */
	phoneResponseInfo?: FirebaseGoogleCloudIdentitytoolkitV2StartMfaPhoneResponseInfo | null;
};

/** Mfa response info specific to TOTP auth for StartMfa. */
export type FirebaseGoogleCloudIdentitytoolkitV2StartMfaTotpEnrollmentResponseInfo =
	{
		/** The length of the verification code that needs to be generated. */
		verificationCodeLength?: number | null;
		/** A base 32 encoded string that represents the shared TOTP secret. The base 32 encoding is the one specified by [RFC4648#section-6](https://datatracker.ietf.org/doc/html/rfc4648#section-6). */
		sharedSecretKey?: string | null;
		/** The hashing algorithm used to generate the verification code. */
		hashingAlgorithm?: string | null;
		/** An encoded string that represents the enrollment session. */
		sessionInfo?: string | null;
		/** The time by which the enrollment must finish. */
		finalizeEnrollmentTime?: string | null;
		/** Duration in seconds at which the verification code will change. */
		periodSec?: number | null;
	};

/** Withdraws MultiFactorAuth response. */
export type FirebaseGoogleCloudIdentitytoolkitV2WithdrawMfaResponse = {
	/** ID token updated to reflect removal of the second factor. */
	idToken?: string | null;
	/** Refresh token updated to reflect removal of the second factor. */
	refreshToken?: string | null;
};

/** An app's App Attest configuration object. This configuration controls certain properties of the `AppCheckToken` returned by ExchangeAppAttestAttestation and ExchangeAppAttestAssertion, such as its ttl. Note that the Team ID registered with your app is used as part of the validation process. */
export type FirebaseGoogleFirebaseAppcheckV1AppAttestConfig = {
	/** Required. The relative resource name of the App Attest configuration object, in the format: ``` projects/{project_number}/apps/{app_id}/appAttestConfig ``` */
	name?: string | null;
	/** Specifies the duration for which App Check tokens exchanged from App Attest artifacts will be valid. If unset, a default value of 1 hour is assumed. Must be between 30 minutes and 7 days, inclusive. */
	tokenTtl?: string | null;
};

/** Encapsulates an *App Check token*, which are used to access backend services protected by App Check. */
export type FirebaseGoogleFirebaseAppcheckV1AppCheckToken = {
	/** The duration from the time this token is minted until its expiration. This field is intended to ease client-side token management, since the client may have clock skew, but is still able to accurately measure a duration. */
	ttl?: string | null;
	/** The App Check token. App Check tokens are signed [JWTs](https://www.rfc-editor.org/info/rfc7519/) containing claims that identify the attested app and GCP project. This token is used to access Google services protected by App Check. */
	token?: string | null;
};

/** Response message for the BatchGetAppAttestConfigs method. */
export type FirebaseGoogleFirebaseAppcheckV1BatchGetAppAttestConfigsResponse = {
	/** AppAttestConfigs retrieved. */
	configs?: Array<FirebaseGoogleFirebaseAppcheckV1AppAttestConfig> | null;
};

/** Response message for the BatchGetDeviceCheckConfigs method. */
export type FirebaseGoogleFirebaseAppcheckV1BatchGetDeviceCheckConfigsResponse =
	{
		/** DeviceCheckConfigs retrieved. */
		configs?: Array<FirebaseGoogleFirebaseAppcheckV1DeviceCheckConfig> | null;
	};

/** Response message for the BatchGetPlayIntegrityConfigs method. */
export type FirebaseGoogleFirebaseAppcheckV1BatchGetPlayIntegrityConfigsResponse =
	{
		/** PlayIntegrityConfigs retrieved. */
		configs?: Array<FirebaseGoogleFirebaseAppcheckV1PlayIntegrityConfig> | null;
	};

/** Response message for the BatchGetRecaptchaEnterpriseConfigs method. */
export type FirebaseGoogleFirebaseAppcheckV1BatchGetRecaptchaEnterpriseConfigsResponse =
	{
		/** RecaptchaEnterpriseConfigs retrieved. */
		configs?: Array<FirebaseGoogleFirebaseAppcheckV1RecaptchaEnterpriseConfig> | null;
	};

/** Response message for the BatchGetRecaptchaV3Configs method. */
export type FirebaseGoogleFirebaseAppcheckV1BatchGetRecaptchaV3ConfigsResponse =
	{
		/** RecaptchaV3Configs retrieved. */
		configs?: Array<FirebaseGoogleFirebaseAppcheckV1RecaptchaV3Config> | null;
	};

/** Response message for the BatchUpdateResourcePolicies method. */
export type FirebaseGoogleFirebaseAppcheckV1BatchUpdateResourcePoliciesResponse =
	{
		/** ResourcePolicy objects after the updates have been applied. */
		resourcePolicies?: Array<FirebaseGoogleFirebaseAppcheckV1ResourcePolicy> | null;
	};

/** Response message for the BatchUpdateServices method. */
export type FirebaseGoogleFirebaseAppcheckV1BatchUpdateServicesResponse = {
	/** Service objects after the updates have been applied. */
	services?: Array<FirebaseGoogleFirebaseAppcheckV1Service> | null;
};

/** A *debug token* is a secret used during the development or integration testing of an app. It essentially allows the development or integration testing to bypass app attestation while still allowing App Check to enforce protection on supported production Firebase services. */
export type FirebaseGoogleFirebaseAppcheckV1DebugToken = {
	/** Required. A human readable display name used to identify this debug token. */
	displayName?: string | null;
	/** Required. The relative resource name of the debug token, in the format: ``` projects/{project_number}/apps/{app_id}/debugTokens/{debug_token_id} ``` */
	name?: string | null;
	/** Required. Input only. Immutable. The secret token itself. Must be provided during creation, and must be a UUID4, case insensitive. This field is immutable once set, and cannot be provided during a UpdateDebugToken request. */
	token?: string | null;
	/** Optional. This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding. This etag is strongly validated as defined by RFC 7232. */
	etag?: string | null;
	/** Output only. Timestamp when this debug token was most recently updated. */
	updateTime?: string | null;
};

/** An app's DeviceCheck configuration object. This configuration is used by ExchangeDeviceCheckToken to validate device tokens issued to apps by DeviceCheck. It also controls certain properties of the returned `AppCheckToken`, such as its ttl. */
export type FirebaseGoogleFirebaseAppcheckV1DeviceCheckConfig = {
	/** Required. The relative resource name of the DeviceCheck configuration object, in the format: ``` projects/{project_number}/apps/{app_id}/deviceCheckConfig ``` */
	name?: string | null;
	/** Required. The key identifier of a private key enabled with DeviceCheck, created in your Apple Developer account. */
	keyId?: string | null;
	/** Specifies the duration for which App Check tokens exchanged from DeviceCheck tokens will be valid. If unset, a default value of 1 hour is assumed. Must be between 30 minutes and 7 days, inclusive. */
	tokenTtl?: string | null;
	/** Output only. Whether the `private_key` field was previously set. Since we will never return the `private_key` field, this field is the only way to find out whether it was previously set. */
	privateKeySet?: boolean | null;
	/** Required. Input only. The contents of the private key (`.p8`) file associated with the key specified by `key_id`. For security reasons, this field will never be populated in any response. */
	privateKey?: string | null;
};

/** Response message for the ExchangeAppAttestAttestation method. */
export type FirebaseGoogleFirebaseAppcheckV1ExchangeAppAttestAttestationResponse =
	{
		/** An artifact that can be used in future calls to ExchangeAppAttestAssertion. (base64) */
		artifact?: string | null;
		/** Encapsulates an App Check token. */
		appCheckToken?: FirebaseGoogleFirebaseAppcheckV1AppCheckToken | null;
	};

/** Response message for the GenerateAppAttestChallenge method. */
export type FirebaseGoogleFirebaseAppcheckV1GenerateAppAttestChallengeResponse =
	{
		/** The duration from the time this challenge is minted until its expiration. This field is intended to ease client-side token management, since the client may have clock skew, but is still able to accurately measure a duration. */
		ttl?: string | null;
		/** A one-time use challenge for the client to pass to the App Attest API. (base64) */
		challenge?: string | null;
	};

/** Response message for the GeneratePlayIntegrityChallenge method. */
export type FirebaseGoogleFirebaseAppcheckV1GeneratePlayIntegrityChallengeResponse =
	{
		/** The duration from the time this challenge is minted until its expiration. This field is intended to ease client-side token management, since the client may have clock skew, but is still able to accurately measure a duration. */
		ttl?: string | null;
		/** A one-time use [challenge](https://developer.android.com/google/play/integrity/verdict#protect-against-replay-attacks) for the client to pass to the Play Integrity API. */
		challenge?: string | null;
	};

/** Response message for the ListDebugTokens method. */
export type FirebaseGoogleFirebaseAppcheckV1ListDebugTokensResponse = {
	/** The DebugTokens retrieved. */
	debugTokens?: Array<FirebaseGoogleFirebaseAppcheckV1DebugToken> | null;
	/** If the result list is too large to fit in a single response, then a token is returned. If the string is empty or omitted, then this response is the last page of results. This token can be used in a subsequent call to ListDebugTokens to find the next group of DebugTokens. */
	nextPageToken?: string | null;
};

/** Response message for the ListResourcePolicies method. */
export type FirebaseGoogleFirebaseAppcheckV1ListResourcePoliciesResponse = {
	/** The ResourcePolicy objects retrieved. */
	resourcePolicies?: Array<FirebaseGoogleFirebaseAppcheckV1ResourcePolicy> | null;
	/** If the result list is too large to fit in a single response, then a token is returned. If the string is empty or omitted, then this response is the last page of results. This token can be used in a subsequent call to ListResourcePolicies to find the next group of ResourcePolicy objects. */
	nextPageToken?: string | null;
};

/** Response message for the ListServices method. */
export type FirebaseGoogleFirebaseAppcheckV1ListServicesResponse = {
	/** The Services retrieved. */
	services?: Array<FirebaseGoogleFirebaseAppcheckV1Service> | null;
	/** If the result list is too large to fit in a single response, then a token is returned. If the string is empty or omitted, then this response is the last page of results. This token can be used in a subsequent call to ListServices to find the next group of Services. */
	nextPageToken?: string | null;
};

/** Response message for the MintAppCheckToken method. */
export type FirebaseGoogleFirebaseAppcheckV1MintAppCheckTokenResponse = {
	/** The App Check token, used to access backend services protected by App Check. App Check tokens are signed [JWTs](https://tools.ietf.org/html/rfc7519) containing claims that identify the attested app and GCP project. This token is used to access Google services protected by App Check. */
	token?: string | null;
	/** The duration from the time this token is minted until its expiration. This field is intended to ease client-side token management, since the client may have clock skew, but is still able to accurately measure a duration. */
	ttl?: string | null;
};

/** An app's Play Integrity configuration object. This configuration controls certain properties of the `AppCheckToken` returned by ExchangePlayIntegrityToken, such as its ttl. */
export type FirebaseGoogleFirebaseAppcheckV1PlayIntegrityConfig = {
	/** Specifies the duration for which App Check tokens exchanged from Play Integrity tokens will be valid. If unset, a default value of 1 hour is assumed. Must be between 30 minutes and 7 days, inclusive. */
	tokenTtl?: string | null;
	/** Specifies application integrity requirements for Android devices running your app. These settings correspond to requirements on the [**application integrity** field](https://developer.android.com/google/play/integrity/verdicts#application-integrity-field) obtained from the Play Integrity API. */
	appIntegrity?: FirebaseGoogleFirebaseAppcheckV1PlayIntegrityConfigAppIntegrity | null;
	/** Specifies account requirements for Android devices running your app. These settings correspond to requirements on the [**account details** field](https://developer.android.com/google/play/integrity/verdicts#account-details-field) obtained from the Play Integrity API. */
	accountDetails?: FirebaseGoogleFirebaseAppcheckV1PlayIntegrityConfigAccountDetails | null;
	/** Specifies device integrity requirements for Android devices running your app. These settings correspond to requirements on the [**device integrity** field](https://developer.android.com/google/play/integrity/verdicts#device-integrity-field) obtained from the Play Integrity API. */
	deviceIntegrity?: FirebaseGoogleFirebaseAppcheckV1PlayIntegrityConfigDeviceIntegrity | null;
	/** Required. The relative resource name of the Play Integrity configuration object, in the format: ``` projects/{project_number}/apps/{app_id}/playIntegrityConfig ``` */
	name?: string | null;
};

/** A settings object specifying account requirements for Android devices running your app. These settings correspond to requirements on the [**account details** field](https://developer.android.com/google/play/integrity/verdicts#account-details-field) obtained from the Play Integrity API. */
export type FirebaseGoogleFirebaseAppcheckV1PlayIntegrityConfigAccountDetails =
	{
		/** Specifies whether the caller must have received the [`LICENSED` verdict](https://developer.android.com/google/play/integrity/verdicts#account-details-field). */
		requireLicensed?: boolean | null;
	};

/** A settings object specifying application integrity requirements for Android devices running your app. These settings correspond to requirements on the [**application integrity** field](https://developer.android.com/google/play/integrity/verdicts#application-integrity-field) obtained from the Play… */
export type FirebaseGoogleFirebaseAppcheckV1PlayIntegrityConfigAppIntegrity = {
	/** Specifies whether your running app is allowed to have the `UNRECOGNIZED_VERSION` [app recognition verdict](https://developer.android.com/google/play/integrity/verdicts#application-integrity-field). */
	allowUnrecognizedVersion?: boolean | null;
};

/** A settings object specifying device integrity requirements for Android devices running your app. These settings correspond to requirements on the [**device integrity** field](https://developer.android.com/google/play/integrity/verdicts#device-integrity-field) obtained from the Play Integrity API. */
export type FirebaseGoogleFirebaseAppcheckV1PlayIntegrityConfigDeviceIntegrity =
	{
		/** Specifies the minimum device integrity level in order for the device to be considered valid. Any device with a device recognition verdict lower than this level will be rejected. If this is unspecified, the default level is `NO_INTEGRITY`. */
		minDeviceRecognitionLevel?: string | null;
	};

/** A JWK as specified by [section 4 of RFC 7517](https://www.rfc-editor.org/info/rfc7517/#section-4) and [section 6.3.1 of RFC 7518](https://www.rfc-editor.org/info/rfc7518/#section-6.3.1). */
export type FirebaseGoogleFirebaseAppcheckV1PublicJwk = {
	/** See [section 4.1 of RFC 7517](https://www.rfc-editor.org/info/rfc7517/#section-4.1). */
	kty?: string | null;
	/** See [section 6.3.1.1 of RFC 7518](https://www.rfc-editor.org/info/rfc7518/#section-6.3.1.1). */
	n?: string | null;
	/** See [section 4.2 of RFC 7517](https://www.rfc-editor.org/info/rfc7517/#section-4.2). */
	use?: string | null;
	/** See [section 6.3.1.2 of RFC 7518](https://www.rfc-editor.org/info/rfc7518/#section-6.3.1.2). */
	e?: string | null;
	/** See [section 4.4 of RFC 7517](https://www.rfc-editor.org/info/rfc7517/#section-4.4). */
	alg?: string | null;
	/** See [section 4.5 of RFC 7517](https://www.rfc-editor.org/info/rfc7517/#section-4.5). */
	kid?: string | null;
};

/** The currently active set of public keys that can be used to verify App Check tokens. This object is a JWK set as specified by [section 5 of RFC 7517](https://www.rfc-editor.org/info/rfc7517#section-5). For security, the response **must not** be cached for longer than six hours. */
export type FirebaseGoogleFirebaseAppcheckV1PublicJwkSet = {
	/** The set of public keys. See [section 5.1 of RFC 7517](https://www.rfc-editor.org/info/rfc7517#section-5). */
	keys?: Array<FirebaseGoogleFirebaseAppcheckV1PublicJwk> | null;
};

/** An app's reCAPTCHA Enterprise configuration object. This configuration is used by ExchangeRecaptchaEnterpriseToken to validate reCAPTCHA tokens issued to apps by reCAPTCHA Enterprise. It also controls certain properties of the returned `AppCheckToken`, such as its ttl. */
export type FirebaseGoogleFirebaseAppcheckV1RecaptchaEnterpriseConfig = {
	/** Specifies risk tolerance and requirements for your application. These settings correspond to requirements on the [**`riskAnalysis`**](https://cloud.google.com/recaptcha/docs/interpret-assessment-website#interpret_assessment) tuple in the assessment obtained from reCAPTCHA Enterprise. */
	riskAnalysis?: FirebaseGoogleFirebaseAppcheckV1RecaptchaEnterpriseConfigRiskAnalysis | null;
	/** The score-based site key [created in reCAPTCHA Enterprise](https://cloud.google.com/recaptcha-enterprise/docs/create-key#creating_a_site_key) used to [invoke reCAPTCHA and generate the reCAPTCHA tokens](https://cloud.google.com/recaptcha-enterprise/docs/instrument-web-pages) for your application. */
	siteKey?: string | null;
	/** Specifies the duration for which App Check tokens exchanged from reCAPTCHA Enterprise tokens will be valid. If unset, a default value of 1 hour is assumed. Must be between 30 minutes and 7 days, inclusive. */
	tokenTtl?: string | null;
	/** Required. The relative resource name of the reCAPTCHA Enterprise configuration object, in the format: ``` projects/{project_number}/apps/{app_id}/recaptchaEnterpriseConfig ``` */
	name?: string | null;
};

/** A settings object specifying risk tolerance and requirements for your application. These settings correspond to requirements on the [**`riskAnalysis`**](https://cloud.google.com/recaptcha/docs/interpret-assessment-website#interpret_assessment) tuple in the assessment obtained from reCAPTCHA… */
export type FirebaseGoogleFirebaseAppcheckV1RecaptchaEnterpriseConfigRiskAnalysis =
	{
		/** Specifies a minimum score required for a reCAPTCHA token to be considered valid. If its score is greater than or equal to this value, it will be accepted; otherwise, it will be rejected. The value must be between 0.0 and 1.0. The default value is 0.5. */
		minValidScore?: number | null;
	};

/** An app's reCAPTCHA v3 configuration object. This configuration is used by ExchangeRecaptchaV3Token to validate reCAPTCHA tokens issued to apps by reCAPTCHA v3. It also controls certain properties of the returned `AppCheckToken`, such as its ttl. */
export type FirebaseGoogleFirebaseAppcheckV1RecaptchaV3Config = {
	/** Specifies the duration for which App Check tokens exchanged from reCAPTCHA tokens will be valid. If unset, a default value of 1 day is assumed. Must be between 30 minutes and 7 days, inclusive. */
	tokenTtl?: string | null;
	/** Required. Input only. The site secret used to identify your service for reCAPTCHA v3 verification. For security reasons, this field will never be populated in any response. */
	siteSecret?: string | null;
	/** Output only. Whether the `site_secret` field was previously set. Since we will never return the `site_secret` field, this field is the only way to find out whether it was previously set. */
	siteSecretSet?: boolean | null;
	/** Specifies a minimum score required for a reCAPTCHA token to be considered valid. If its score is greater than or equal to this value, it will be accepted; otherwise, it will be rejected. The value must be between 0.0 and 1.0. The default value is 0.5. */
	minValidScore?: number | null;
	/** Required. The relative resource name of the reCAPTCHA v3 configuration object, in the format: ``` projects/{project_number}/apps/{app_id}/recaptchaV3Config ``` */
	name?: string | null;
};

/** App Check enforcement policy for a specific resource of a Google service supported by App Check. Note that this policy will override the service-level configuration. */
export type FirebaseGoogleFirebaseAppcheckV1ResourcePolicy = {
	/** Required. Identifier. The relative name of the resource policy object, in the format: ``` projects/{project_number}/services/{service_id}/resourcePolicies/{resource_policy_id} ``` Note that the `service_id` element must be a supported service ID. */
	name?: string | null;
	/** Required. The baseline protection EnforcementMode for this resource. This will override the service-level baseline protection EnforcementMode. */
	enforcementMode?: string | null;
	/** This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding. This etag is strongly validated as defined by RFC 7232. */
	etag?: string | null;
	/** Output only. Timestamp when this resource policy configuration object was most recently updated. */
	updateTime?: string | null;
	/** Required. Service specific name of the resource object to which this policy applies, in the format: * **iOS OAuth clients** (Google Identity for iOS): `//oauth2.googleapis.com/projects/{project_number}/oauthClients/{oauth_client_id}` Note that the resource must belong to the service specified in… */
	targetResource?: string | null;
};

/** The enforcement configuration for a Firebase service supported by App Check. */
export type FirebaseGoogleFirebaseAppcheckV1Service = {
	/** Required. The baseline protection EnforcementMode for this service. */
	enforcementMode?: string | null;
	/** Required. The relative resource name of the service configuration object, in the format: ``` projects/{project_number}/services/{service_id} ``` Note that the `service_id` element must be a supported service ID. Currently, the following service IDs are supported. */
	name?: string | null;
	/** Optional. This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding. This etag is strongly validated as defined by RFC 7232. */
	etag?: string | null;
	/** Optional. The replay protection EnforcementMode for this service. Note that this field cannot be set to a level higher than that of baseline protection. For example, if the enforcement mode for baseline protection is set to `UNENFORCED`, this field cannot be set to `ENFORCED`. */
	replayProtection?: string | null;
	/** Output only. Timestamp when this service configuration object was most recently updated. */
	updateTime?: string | null;
};

/** Android App Bundle (AAB) information for a Firebase app. */
export type FirebaseGoogleFirebaseAppdistroV1AabInfo = {
	/** The name of the `AabInfo` resource. Format: `projects/{project_number}/apps/{app}/aabInfo` */
	name?: string | null;
	/** App bundle test certificate generated for the app. Set after the first app bundle is uploaded for this app. */
	testCertificate?: FirebaseGoogleFirebaseAppdistroV1TestCertificate | null;
	/** App bundle integration state. Only valid for android apps. */
	integrationState?: string | null;
};

/** The Response message for `BatchAddTesters`. */
export type FirebaseGoogleFirebaseAppdistroV1BatchAddTestersResponse = {
	/** The testers which are created and/or already exist */
	testers?: Array<FirebaseGoogleFirebaseAppdistroV1Tester> | null;
};

/** The response message for `BatchRemoveTesters` */
export type FirebaseGoogleFirebaseAppdistroV1BatchRemoveTestersResponse = {
	/** List of deleted tester emails */
	emails?: Array<string> | null;
};

/** The response message for `DistributeRelease`. */
export type FirebaseGoogleFirebaseAppdistroV1DistributeReleaseResponse = Record<
	string,
	FirebaseJsonValue
>;

/** A feedback report submitted by a tester for a release. */
export type FirebaseGoogleFirebaseAppdistroV1FeedbackReport = {
	/** Output only. The resource name of the tester who submitted the feedback report. */
	tester?: string | null;
	/** Output only. The text of the feedback report. */
	text?: string | null;
	/** Output only. A link to the Firebase console displaying the feedback report. */
	firebaseConsoleUri?: string | null;
	/** Output only. A signed link (which expires in one hour) that lets you directly download the screenshot. */
	screenshotUri?: string | null;
	/** The name of the feedback report resource. Format: `projects/{project_number}/apps/{app}/releases/{release}/feedbackReports/{feedback_report}` */
	name?: string | null;
	/** Output only. The time when the feedback report was created. */
	createTime?: string | null;
};

/** A group which can contain testers. A group can be invited to test apps in a Firebase project. */
export type FirebaseGoogleFirebaseAppdistroV1Group = {
	/** Output only. The number of testers who are members of this group. */
	testerCount?: number | null;
	/** Output only. The number of invite links for this group. */
	inviteLinkCount?: number | null;
	/** Required. The display name of the group. */
	displayName?: string | null;
	/** The name of the group resource. Format: `projects/{project_number}/groups/{group_alias}` */
	name?: string | null;
	/** Output only. The number of releases this group is permitted to access. */
	releaseCount?: number | null;
};

/** The response message for `ListFeedbackReports`. */
export type FirebaseGoogleFirebaseAppdistroV1ListFeedbackReportsResponse = {
	/** A short-lived token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted, there are no subsequent pages. */
	nextPageToken?: string | null;
	/** The feedback reports */
	feedbackReports?: Array<FirebaseGoogleFirebaseAppdistroV1FeedbackReport> | null;
};

/** The response message for `ListGroups`. */
export type FirebaseGoogleFirebaseAppdistroV1ListGroupsResponse = {
	/** A short-lived token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted, there are no subsequent pages. */
	nextPageToken?: string | null;
	/** The groups listed. */
	groups?: Array<FirebaseGoogleFirebaseAppdistroV1Group> | null;
};

/** The response message for `ListReleases`. */
export type FirebaseGoogleFirebaseAppdistroV1ListReleasesResponse = {
	/** A short-lived token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted, there are no subsequent pages. */
	nextPageToken?: string | null;
	/** The releases */
	releases?: Array<FirebaseGoogleFirebaseAppdistroV1Release> | null;
	/** The total number of releases. */
	totalSize?: number | null;
};

/** The response message for `ListTesters`. */
export type FirebaseGoogleFirebaseAppdistroV1ListTestersResponse = {
	/** The testers listed. */
	testers?: Array<FirebaseGoogleFirebaseAppdistroV1Tester> | null;
	/** A short-lived token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted, there are no subsequent pages. */
	nextPageToken?: string | null;
};

/** A release of a Firebase app. */
export type FirebaseGoogleFirebaseAppdistroV1Release = {
	/** Output only. The time the release will expire. */
	expireTime?: string | null;
	/** Output only. Build version of the release. For an Android release, the build version is the `versionCode`. For an iOS release, the build version is the `CFBundleVersion`. */
	buildVersion?: string | null;
	/** Notes about the release. */
	releaseNotes?: FirebaseGoogleFirebaseAppdistroV1ReleaseNotes | null;
	/** Output only. Registration state of the Android package (BinaryType.APK). */
	androidPackageRegistrationState?: string | null;
	/** Output only. Number of feedback reports left by testers. */
	feedbackCount?: number | null;
	/** Output only. Number of testers who were invited (incl. expired invitations), but did not (yet) accept the invitation. */
	openInvitationCount?: number | null;
	/** The name of the release resource. Format: `projects/{project_number}/apps/{app}/releases/{release}` */
	name?: string | null;
	/** Output only. Number of testers who have downloaded this release. */
	installationCount?: number | null;
	/** Output only. Number of testers with accepted invitations. */
	acceptedInvitationCount?: number | null;
	/** Output only. The overall state of tests run on this release */
	testState?: string | null;
	/** Output only. A signed link (which expires in one hour) to directly download the app binary (IPA/APK/AAB) file. */
	binaryDownloadUri?: string | null;
	/** Output only. A link to the Firebase console displaying a single release. */
	firebaseConsoleUri?: string | null;
	/** Output only. The time the release was last updated. */
	updateTime?: string | null;
	/** Output only. Display version of the release. For an Android release, the display version is the `versionName`. For an iOS release, the display version is the `CFBundleShortVersionString`. */
	displayVersion?: string | null;
	/** Output only. Type of binary. */
	binaryType?: string | null;
	/** Output only. A link to the release in the tester web clip or Android app that lets testers (which were granted access to the app) view release notes and install the app onto their devices. */
	testingUri?: string | null;
	/** Output only. The time the release was created. */
	createTime?: string | null;
};

/** Notes that belong to a release. */
export type FirebaseGoogleFirebaseAppdistroV1ReleaseNotes = {
	/** The text of the release notes. */
	text?: string | null;
};

/** App bundle test certificate */
export type FirebaseGoogleFirebaseAppdistroV1TestCertificate = {
	/** Hex string of SHA256 hash of the test certificate used to resign the AAB */
	hashSha256?: string | null;
	/** Hex string of SHA1 hash of the test certificate used to resign the AAB */
	hashSha1?: string | null;
	/** Hex string of MD5 hash of the test certificate used to resign the AAB */
	hashMd5?: string | null;
};

/** A person that can be invited to test apps in a Firebase project. */
export type FirebaseGoogleFirebaseAppdistroV1Tester = {
	/** The name of the tester associated with the Google account used to accept the tester invitation. */
	displayName?: string | null;
	/** The resource names of the groups this tester belongs to. */
	groups?: Array<string> | null;
	/** The name of the tester resource. Format: `projects/{project_number}/testers/{email_address}` */
	name?: string | null;
	/** Output only. The time the tester was last active. This is the most recent time the tester installed one of the apps. If they've never installed one or if the release no longer exists, this is the time the tester was added to the project. */
	lastActivityTime?: string | null;
};

/** Settings to control notification LED. */
export type FirebaseGoogleFirebaseFcmV1AndroidNotificationV2LightSettings = {
	/** Required. Along with `light_on_duration`, define the blink rate of LED flashes. Resolution defined by [proto.Duration](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Duration) */
	lightOffDuration?: string | null;
	/** Required. Set `color` of the LED with [google.type.Color](https://github.com/googleapis/googleapis/blob/master/google/type/color.proto). */
	color?: FirebaseColor | null;
	/** Required. Along with `light_off_duration`, define the blink rate of LED flashes. Resolution defined by [proto.Duration](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Duration) */
	lightOnDuration?: string | null;
};

/** A Backup of a Cloud Firestore Database. The backup contains all documents and index configurations for the given database at a specific point in time. */
export type FirebaseGoogleFirestoreAdminV1Backup = {
	/** Output only. Statistics about the backup. This data only becomes available after the backup is fully materialized to secondary storage. This field will be empty till then. */
	stats?: FirebaseGoogleFirestoreAdminV1Stats | null;
	/** Output only. The backup contains an externally consistent copy of the database at this time. */
	snapshotTime?: string | null;
	/** Output only. The current state of the backup. */
	state?: string | null;
	/** Output only. The unique resource name of the Backup. Format is `projects/{project}/locations/{location}/backups/{backup}`. The location in the name will be the Standard Managed Multi-Region (SMMR) location (e.g. */
	name?: string | null;
	/** Output only. The timestamp at which this backup expires. */
	expireTime?: string | null;
	/** Output only. Name of the Firestore database that the backup is from. Format is `projects/{project}/databases/{database}`. */
	database?: string | null;
	/** Output only. The system-generated UUID4 for the Firestore database that the backup is from. */
	databaseUid?: string | null;
};

/** A backup schedule for a Cloud Firestore Database. This resource is owned by the database it is backing up, and is deleted along with the database. The actual backups are not though. */
export type FirebaseGoogleFirestoreAdminV1BackupSchedule = {
	/** Output only. The unique backup schedule identifier across all locations and databases for the given project. This will be auto-assigned. Format is `projects/{project}/databases/{database}/backupSchedules/{backup_schedule}` */
	name?: string | null;
	/** Output only. The timestamp at which this backup schedule was created and effective since. No backups will be created for this schedule before this time. */
	createTime?: string | null;
	/** For a schedule that runs weekly on a specific day. */
	weeklyRecurrence?: FirebaseGoogleFirestoreAdminV1WeeklyRecurrence | null;
	/** For a schedule that runs daily. */
	dailyRecurrence?: FirebaseGoogleFirestoreAdminV1DailyRecurrence | null;
	/** Output only. The timestamp at which this backup schedule was most recently updated. When a backup schedule is first created, this is the same as create_time. */
	updateTime?: string | null;
	/** At what relative time in the future, compared to its creation time, the backup should be deleted, e.g. keep backups for 7 days. The maximum supported retention period is 14 weeks. */
	retention?: string | null;
};

/** Information about a backup that was used to restore a database. */
export type FirebaseGoogleFirestoreAdminV1BackupSource = {
	/** The resource name of the backup that was used to restore this database. Format: `projects/{project}/locations/{location}/backups/{backup}`. */
	backup?: string | null;
};

/** A Change Stream is a resource that allows users to receive change notifications from a Firestore database. */
export type FirebaseGoogleFirestoreAdminV1ChangeStream = {
	/** Output only. The time the Change Stream was last updated. */
	updateTime?: string | null;
	/** Optional. An etag used to determine which version of the configuration is being edited. */
	etag?: string | null;
	/** Output only. The time the Change Stream started recording events. */
	startTime?: string | null;
	/** If set, the change stream is scoped to a collection group. */
	collectionGroupScope?: FirebaseGoogleFirestoreAdminV1CollectionGroupScope | null;
	/** Identifier. The external resource name of the change stream. Format `projects/{project}/databases/{database}/changeStreams/{change_stream}` */
	name?: string | null;
	/** If set, the change stream is scoped to the entire database. */
	databaseScope?: FirebaseGoogleFirestoreAdminV1DatabaseScope | null;
	/** Output only. The time the Change Stream was created. */
	createTime?: string | null;
	/** Required. The retention period of the change stream. This is the amount of time a change event is available on the change stream. Must be from 1 to 7 days, inclusive. The retention_period must be in day granularity, i.e. it must be a multiple of 24 hours. */
	retentionPeriod?: string | null;
};

/** The CMEK (Customer Managed Encryption Key) configuration for a Firestore database. If not present, the database is secured by the default Google encryption key. */
export type FirebaseGoogleFirestoreAdminV1CmekConfig = {
	/** Output only. Currently in-use [KMS key versions](https://cloud.google.com/kms/docs/resource-hierarchy#key_versions). During [key rotation](https://cloud.google.com/kms/docs/key-rotation), there can be multiple in-use key versions. */
	activeKeyVersion?: Array<string> | null;
	/** Required. Only keys in the same location as this database are allowed to be used for encryption. For Firestore's nam5 multi-region, this corresponds to Cloud KMS multi-region us. For Firestore's eur3 multi-region, this corresponds to Cloud KMS multi-region europe. */
	kmsKeyName?: string | null;
};

/** The change stream is scoped to a collection group. Only events associated with the given collection group are visible to the Change Stream. Only a single change stream can be enabled per collection group. */
export type FirebaseGoogleFirestoreAdminV1CollectionGroupScope = {
	/** Required. The collection group name. */
	collectionGroupId?: string | null;
};

/** Represents a recurring schedule that runs every day. The time zone is UTC. */
export type FirebaseGoogleFirestoreAdminV1DailyRecurrence = Record<
	string,
	FirebaseJsonValue
>;

/** A Cloud Firestore Database. */
export type FirebaseGoogleFirestoreAdminV1Database = {
	/** Output only. The system-generated UUID4 for this Database. */
	uid?: string | null;
	/** Optional. The Firestore API data access mode to use for this database. If not set on write: - the default value is DATA_ACCESS_MODE_DISABLED for Enterprise edition. - the default value is DATA_ACCESS_MODE_ENABLED for Standard edition. */
	firestoreDataAccessMode?: string | null;
	/** Output only. The earliest timestamp at which older versions of the data can be read from the database. */
	earliestVersionTime?: string | null;
	/** Output only. The timestamp at which this database was created. Databases created before 2016 do not populate create_time. */
	createTime?: string | null;
	/** The default concurrency control mode to use for this database. If unspecified in a CreateDatabase request, this will default based on the database edition: Optimistic for Enterprise and Pessimistic for all other databases. */
	concurrencyMode?: string | null;
	/** This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding. */
	etag?: string | null;
	/** Output only. Information about the provenance of this database. */
	sourceInfo?: FirebaseGoogleFirestoreAdminV1SourceInfo | null;
	/** Output only. The database resource's prior database ID. This field is only populated for deleted databases. */
	previousId?: string | null;
	/** Immutable. The edition of the database. */
	databaseEdition?: string | null;
	/** Required. The location of the database. Available locations are listed at https://cloud.google.com/firestore/docs/locations. */
	locationId?: string | null;
	/** Output only. Background: Free tier is the ability of a Firestore database to use a small amount of resources every day without being charged. Once usage exceeds the free tier limit further usage is charged. Whether this database can make use of the free tier. */
	freeTier?: boolean | null;
	/** Immutable. The default Realtime Updates mode to use for this database. */
	realtimeUpdatesMode?: string | null;
	/** Output only. The key_prefix for this database. This key_prefix is used, in combination with the project ID ("~") to construct the application ID that is returned from the Cloud Datastore APIs in Google App Engine first generation runtimes. */
	keyPrefix?: string | null;
	/** Output only. The timestamp at which this database was deleted. Only set if the database has been deleted. */
	deleteTime?: string | null;
	/** Optional. Input only. Immutable. Tag keys/values directly bound to this resource. For example: "123/environment": "production", "123/costCenter": "marketing" */
	tags?: Record<string, string> | null;
	/** Optional. Presence indicates CMEK is enabled for this database. */
	cmekConfig?: FirebaseGoogleFirestoreAdminV1CmekConfig | null;
	/** Output only. The period during which past versions of data are retained in the database. Any read or query can specify a `read_time` within this window, and will read the state of the database at that time. If the PITR feature is enabled, the retention period is 7 days. */
	versionRetentionPeriod?: string | null;
	/** Required. The type of the database. See https://cloud.google.com/datastore/docs/firestore-or-datastore for information about how to choose. */
	type?: string | null;
	/** The App Engine integration mode to use for this database. */
	appEngineIntegrationMode?: string | null;
	/** Whether to enable the PITR feature on this database. */
	pointInTimeRecoveryEnablement?: string | null;
	/** Output only. The timestamp at which this database was most recently updated. Note this only includes updates to the database resource and not data contained by the database. */
	updateTime?: string | null;
	/** State of delete protection for the database. */
	deleteProtectionState?: string | null;
	/** Optional. The MongoDB compatible API data access mode to use for this database. If not set on write, the default value is DATA_ACCESS_MODE_ENABLED for Enterprise edition. The value is always DATA_ACCESS_MODE_DISABLED for Standard edition. */
	mongodbCompatibleDataAccessMode?: string | null;
	/** The resource name of the Database. Format: `projects/{project}/databases/{database}` */
	name?: string | null;
};

/** The change stream is scoped to the entire database. All events in the database are visible to the Change Stream. One Database scope Change Stream is allowed per database. */
export type FirebaseGoogleFirestoreAdminV1DatabaseScope = Record<
	string,
	FirebaseJsonValue
>;

/** Represents a single field in the database. Fields are grouped by their "Collection Group", which represent all collections in the database with the same ID. */
export type FirebaseGoogleFirestoreAdminV1Field = {
	/** The TTL configuration for this `Field`. Setting or unsetting this will enable or disable the TTL for documents that have this `Field`. */
	ttlConfig?: FirebaseGoogleFirestoreAdminV1TtlConfig | null;
	/** The index configuration for this field. If unset, field indexing will revert to the configuration defined by the `ancestor_field`. To explicitly remove all indexes for this field, specify an index config with an empty list of indexes. */
	indexConfig?: FirebaseGoogleFirestoreAdminV1IndexConfig | null;
	/** Required. A field name of the form: `projects/{project_id}/databases/{database_id}/collectionGroups/{collection_id}/fields/{field_path}` A field path can be a simple field name, e.g. `address` or a path to fields within `map_value` , e.g. `address.city`, or a special field path. */
	name?: string | null;
};

/** An index that stores vectors in a flat data structure, and supports exhaustive search. */
export type FirebaseGoogleFirestoreAdminV1FlatIndex = Record<
	string,
	FirebaseJsonValue
>;

/** Cloud Firestore indexes enable simple and complex queries against documents in a database. In Standard edition databases, single-field indexes are managed using the google.firestore.admin.v1.Field resource, and composite indexes are managed using the google.firestore.admin.v1.Index resource. */
export type FirebaseGoogleFirestoreAdminV1Index = {
	/** Immutable. The density configuration of the index. */
	density?: string | null;
	/** Optional. Options for search indexes that are at the index definition level. This field is only currently supported for indexes with MONGODB_COMPATIBLE_API ApiScope. */
	searchIndexOptions?: FirebaseGoogleFirestoreAdminV1SearchIndexOptions | null;
	/** Optional. Whether the index is multikey. By default, the index is not multikey. For non-multikey indexes, none of the paths in the index definition reach or traverse an array, except via an explicit array index. */
	multikey?: boolean | null;
	/** Output only. The serving state of the index. */
	state?: string | null;
	/** Optional. Whether it is an unique index. Unique index ensures all values for the indexed field(s) are unique across documents. */
	unique?: boolean | null;
	/** Indexes with a collection query scope specified allow queries against a collection that is the child of a specific document, specified at query time, and that has the same collection ID. */
	queryScope?: string | null;
	/** The API scope supported by this index. */
	apiScope?: string | null;
	/** A server-defined name for this index. Output only. When used in the google.firestore.admin.v1.Index resource, the value is of the form: `projects/{project_id}/databases/{database_id}/collectionGroups/{collection_id}/indexes/{index_id}` When used in the google.firestore.admin.v1.Field resource, the… */
	name?: string | null;
	/** Optional. The number of physical shards for the index. In Cloud Firestore, data and index entries are stored in contiguous, ordered key ranges called splits. */
	shardCount?: number | null;
	/** The fields supported by this index. At most 100 fields may be specified. In Standard edition databases only: - At least 2 fields must be specified. - The last field entry is always for the field path `__name__`. */
	fields?: Array<FirebaseGoogleFirestoreAdminV1IndexField> | null;
};

/** The index configuration for this field. */
export type FirebaseGoogleFirestoreAdminV1IndexConfig = {
	/** Output only When true, the `Field`'s index configuration is in the process of being reverted. Once complete, the index config will transition to the same state as the field specified by `ancestor_field`, at which point `uses_ancestor_config` will be `true` and `reverting` will be `false`. */
	reverting?: boolean | null;
	/** Output only. When true, the `Field`'s index configuration is set from the configuration specified by the `ancestor_field`. When false, the `Field`'s index configuration is defined explicitly. */
	usesAncestorConfig?: boolean | null;
	/** Output only. Specifies the resource name of the `Field` from which this field's index configuration is set (when `uses_ancestor_config` is true), or from which it *would* be set if this field had no index configuration (when `uses_ancestor_config` is false). */
	ancestorField?: string | null;
	/** The indexes supported for this field. */
	indexes?: Array<FirebaseGoogleFirestoreAdminV1Index> | null;
};

/** A field in an index. The field_path describes which field is indexed, the value_mode describes how the field value is indexed. */
export type FirebaseGoogleFirestoreAdminV1IndexField = {
	/** Indicates that this field supports search operations. */
	searchConfig?: FirebaseGoogleFirestoreAdminV1SearchConfig | null;
	/** Indicates that this field supports nearest neighbor and distance operations on vector. */
	vectorConfig?: FirebaseGoogleFirestoreAdminV1VectorConfig | null;
	/** Can be __name__. For single field indexes, this must match the name of the field or may be omitted. */
	fieldPath?: string | null;
	/** Indicates that this field supports ordering by the specified order or comparing using =, !=, <, <=, >, >=. */
	order?: string | null;
	/** Indicates that this field supports operations on `array_value`s. */
	arrayConfig?: string | null;
};

/** The response for FirestoreAdmin.ListBackupSchedules. */
export type FirebaseGoogleFirestoreAdminV1ListBackupSchedulesResponse = {
	/** List of all backup schedules. */
	backupSchedules?: Array<FirebaseGoogleFirestoreAdminV1BackupSchedule> | null;
};

/** The response for FirestoreAdmin.ListBackups. */
export type FirebaseGoogleFirestoreAdminV1ListBackupsResponse = {
	/** List of all backups for the project. */
	backups?: Array<FirebaseGoogleFirestoreAdminV1Backup> | null;
	/** List of locations that existing backups were not able to be fetched from. Instead of failing the entire requests when a single location is unreachable, this response returns a partial result set and list of locations unable to be reached here. */
	unreachable?: Array<string> | null;
};

/** Response to FirestoreAdmin.ListChangeStreams. */
export type FirebaseGoogleFirestoreAdminV1ListChangeStreamsResponse = {
	/** The list of change streams. */
	changeStreams?: Array<FirebaseGoogleFirestoreAdminV1ChangeStream> | null;
};

/** The list of databases for a project. */
export type FirebaseGoogleFirestoreAdminV1ListDatabasesResponse = {
	/** In the event that data about individual databases cannot be listed they will be recorded here. An example entry might be: projects/some_project/locations/some_location This can happen if the Cloud Region that the Database resides in is currently unavailable. */
	unreachable?: Array<string> | null;
	/** The databases in the project. */
	databases?: Array<FirebaseGoogleFirestoreAdminV1Database> | null;
};

/** The response for FirestoreAdmin.ListFields. */
export type FirebaseGoogleFirestoreAdminV1ListFieldsResponse = {
	/** A page token that may be used to request another page of results. If blank, this is the last page. */
	nextPageToken?: string | null;
	/** The requested fields. */
	fields?: Array<FirebaseGoogleFirestoreAdminV1Field> | null;
};

/** The response for FirestoreAdmin.ListIndexes. */
export type FirebaseGoogleFirestoreAdminV1ListIndexesResponse = {
	/** A page token that may be used to request another page of results. If blank, this is the last page. */
	nextPageToken?: string | null;
	/** The requested indexes. */
	indexes?: Array<FirebaseGoogleFirestoreAdminV1Index> | null;
};

/** The response for FirestoreAdmin.ListUserCreds. */
export type FirebaseGoogleFirestoreAdminV1ListUserCredsResponse = {
	/** The user creds for the database. */
	userCreds?: Array<FirebaseGoogleFirestoreAdminV1UserCreds> | null;
};

/** Describes a Resource Identity principal. */
export type FirebaseGoogleFirestoreAdminV1ResourceIdentity = {
	/** Output only. Principal identifier string. See: https://cloud.google.com/iam/docs/principal-identifiers */
	principal?: string | null;
};

/** The configuration for how to index a field for search. */
export type FirebaseGoogleFirestoreAdminV1SearchConfig = {
	/** Optional. The specification for building a geo search index for a field. */
	geoSpec?: FirebaseGoogleFirestoreAdminV1SearchGeoSpec | null;
	/** Optional. The specification for building a text search index for a field. */
	textSpec?: FirebaseGoogleFirestoreAdminV1SearchTextSpec | null;
};

/** The specification for how to build a geo search index for a field. */
export type FirebaseGoogleFirestoreAdminV1SearchGeoSpec = {
	/** Optional. Disables geoJSON indexing for the field. By default, geoJSON points are indexed. Firestore GeoPoints are indexed regardless of the value of this field. */
	geoJsonIndexingDisabled?: boolean | null;
};

/** Options for search indexes at the definition level. */
export type FirebaseGoogleFirestoreAdminV1SearchIndexOptions = {
	/** Optional. The field in the document that specifies which language to use for that specific document. For indexes with MONGODB_COMPATIBLE_API ApiScope: if unspecified, the language is taken from the "language" field if it exists or from `text_language` if it does not. */
	textLanguageOverrideFieldPath?: string | null;
	/** Optional. The language to use for text search indexes. Used as the default language if not overridden at the document level by specifying the `text_language_override_field`. The language is specified as a BCP 47 language code. */
	textLanguage?: string | null;
};

/** Specification of how the field should be indexed for search text indexes. */
export type FirebaseGoogleFirestoreAdminV1SearchTextIndexSpec = {
	/** Required. How to match the text field value. */
	matchType?: string | null;
	/** Required. How to index the text field value. */
	indexType?: string | null;
};

/** The specification for how to build a text search index for a field. */
export type FirebaseGoogleFirestoreAdminV1SearchTextSpec = {
	/** Required. Specifications for how the field should be indexed. Repeated so that the field can be indexed in multiple ways. */
	indexSpecs?: Array<FirebaseGoogleFirestoreAdminV1SearchTextIndexSpec> | null;
};

/** Information about the provenance of this database. */
export type FirebaseGoogleFirestoreAdminV1SourceInfo = {
	/** The associated long-running operation. This field may not be set after the operation has completed. Format: `projects/{project}/databases/{database}/operations/{operation}`. */
	operation?: string | null;
	/** If set, this database was restored from the specified backup (or a snapshot thereof). */
	backup?: FirebaseGoogleFirestoreAdminV1BackupSource | null;
};

/** Backup specific statistics. */
export type FirebaseGoogleFirestoreAdminV1Stats = {
	/** Output only. The total number of index entries contained in the backup. */
	indexCount?: (string | number) | null;
	/** Output only. Summation of the size of all documents and index entries in the backup, measured in bytes. */
	sizeBytes?: (string | number) | null;
	/** Output only. The total number of documents contained in the backup. */
	documentCount?: (string | number) | null;
};

/** The TTL (time-to-live) configuration for documents that have this `Field` set. A timestamp stored in a TTL-enabled field will be used to determine the expiration time of the document. The expiration time is the sum of the timestamp value and the `expiration_offset`. */
export type FirebaseGoogleFirestoreAdminV1TtlConfig = {
	/** Optional. The offset, relative to the timestamp value from the TTL-enabled field, used to determine the document's expiration time. `expiration_offset.seconds` must be between 0 and 2,147,483,647 inclusive. Values more precise than seconds are rejected. */
	expirationOffset?: string | null;
	/** Output only. The state of the TTL configuration. */
	state?: string | null;
};

/** A Cloud Firestore User Creds. */
export type FirebaseGoogleFirestoreAdminV1UserCreds = {
	/** Identifier. The resource name of the UserCreds. Format: `projects/{project}/databases/{database}/userCreds/{user_creds}` */
	name?: string | null;
	/** Output only. The plaintext server-generated password for the user creds. Only populated in responses for CreateUserCreds and ResetUserPassword. */
	securePassword?: string | null;
	/** Output only. The time the user creds were last updated. */
	updateTime?: string | null;
	/** Output only. Whether the user creds are enabled or disabled. Defaults to ENABLED on creation. */
	state?: string | null;
	/** Output only. The time the user creds were created. */
	createTime?: string | null;
	/** Resource Identity descriptor. */
	resourceIdentity?: FirebaseGoogleFirestoreAdminV1ResourceIdentity | null;
};

/** The index configuration to support vector search operations */
export type FirebaseGoogleFirestoreAdminV1VectorConfig = {
	/** Indicates the vector index is a flat index. */
	flat?: FirebaseGoogleFirestoreAdminV1FlatIndex | null;
	/** Required. The vector dimension this configuration applies to. The resulting index will only include vectors of this dimension, and can be used for vector search with the same dimension. */
	dimension?: number | null;
};

/** Represents a recurring schedule that runs on a specified day of the week. The time zone is UTC. */
export type FirebaseGoogleFirestoreAdminV1WeeklyRecurrence = {
	/** The day of week to run. DAY_OF_WEEK_UNSPECIFIED is not allowed. */
	day?: string | null;
};

/** Specifies the audit configuration for a service. The configuration determines which permission types are logged, and what identities, if any, are exempted from logging. An AuditConfig must have one or more AuditLogConfigs. */
export type FirebaseGoogleIamV1AuditConfig = {
	/** Specifies a service that will be enabled for audit logging. For example, `storage.googleapis.com`, `cloudsql.googleapis.com`. `allServices` is a special value that covers all services. */
	service?: string | null;
	/** The configuration for logging of each type of permission. */
	auditLogConfigs?: Array<FirebaseGoogleIamV1AuditLogConfig> | null;
};

/** Provides the configuration for logging a type of permissions. Example: { "audit_log_configs": [ { "log_type": "DATA_READ", "exempted_members"… */
export type FirebaseGoogleIamV1AuditLogConfig = {
	/** The log type that this config enables. */
	logType?: string | null;
	/** Specifies the identities that do not cause logging for this type of permission. Follows the same format of Binding.members. */
	exemptedMembers?: Array<string> | null;
};

/** Associates `members`, or principals, with a `role`. */
export type FirebaseGoogleIamV1Binding = {
	/** The condition that is associated with this binding. If the condition evaluates to `true`, then this binding applies to the current request. If the condition evaluates to `false`, then this binding does not apply to the current request. */
	condition?: FirebaseGoogleTypeExpr | null;
	/** Role that is assigned to the list of `members`, or principals. For example, `roles/viewer`, `roles/editor`, or `roles/owner`. For an overview of the IAM roles and permissions, see the [IAM documentation](https://cloud.google.com/iam/docs/roles-overview). */
	role?: string | null;
	/** Specifies the principals requesting access for a Google Cloud resource. `members` can have the following values: * `allUsers`: A special identifier that represents anyone who is on the internet; with or without a Google account. */
	members?: Array<string> | null;
};

/** An Identity and Access Management (IAM) policy, which specifies access controls for Google Cloud resources. A `Policy` is a collection of `bindings`. A `binding` binds one or more `members`, or principals, to a single `role`. */
export type FirebaseGoogleIamV1Policy = {
	/** Specifies cloud audit logging configuration for this policy. */
	auditConfigs?: Array<FirebaseGoogleIamV1AuditConfig> | null;
	/** Specifies the format of the policy. Valid values are `0`, `1`, and `3`. Requests that specify an invalid value are rejected. Any operation that affects conditional role bindings must specify version `3`. */
	version?: number | null;
	/** Associates a list of `members`, or principals, with a `role`. Optionally, may specify a `condition` that determines how and when the `bindings` are applied. Each of the `bindings` must contain at least one principal. */
	bindings?: Array<FirebaseGoogleIamV1Binding> | null;
	/** `etag` is used for optimistic concurrency control as a way to help prevent simultaneous updates of a policy from overwriting each other. */
	etag?: string | null;
};

/** Response message for `TestIamPermissions` method. */
export type FirebaseGoogleIamV1TestIamPermissionsResponse = {
	/** A subset of `TestPermissionsRequest.permissions` that the caller is allowed. */
	permissions?: Array<string> | null;
};

/** Represents a textual expression in the Common Expression Language (CEL) syntax. CEL is a C-like expression language. The syntax and semantics of CEL are documented at https://github.com/google/cel-spec. */
export type FirebaseGoogleTypeExpr = {
	/** Optional. Description of the expression. This is a longer text which describes the expression, e.g. when hovered over it in a UI. */
	description?: string | null;
	/** Optional. String indicating the location of the expression for error reporting, e.g. a file name and a position in the file. */
	location?: string | null;
	/** Optional. Title for the expression, i.e. a short string describing its purpose. This can be used e.g. in UIs which allow to enter the expression. */
	title?: string | null;
	/** Textual representation of an expression in Common Expression Language syntax. */
	expression?: string | null;
};

/** A [`Header`](https://firebase.google.com/docs/hosting/full-config#headers) specifies a URL pattern that, if matched to the request URL path, triggers Hosting to apply the specified custom response headers. */
export type FirebaseHeader = {
	/** The user-supplied [glob](https://firebase.google.com/docs/hosting/full-config#glob_pattern_matching) to match against the request URL path. */
	glob?: string | null;
	/** Required. The additional headers to add to the response. */
	headers?: Record<string, string> | null;
	/** The user-supplied RE2 regular expression to match against the request URL path. */
	regex?: string | null;
};

/** A file you can add to your existing, non-Hosting hosting service that confirms your intent to allow Hosting's Certificate Authorities to create an SSL certificate for your domain. */
export type FirebaseHttpUpdate = {
	/** Output only. An error encountered during the last contents check. If null, the check completed successfully. */
	checkError?: FirebaseHostingStatus | null;
	/** Output only. A text string to serve at the path. */
	desired?: string | null;
	/** Output only. The last time Hosting systems checked for the file contents. */
	lastCheckTime?: string | null;
	/** Output only. Whether Hosting was able to find the required file contents on the specified path during its last check. */
	discovered?: string | null;
	/** Output only. The path to the file. */
	path?: string | null;
};

/** If provided, i18n rewrites are enabled. */
export type FirebaseI18nConfig = {
	/** Required. The user-supplied path where country and language specific content will be looked for within the public directory. */
	root?: string | null;
};

/** Details of a Firebase App for iOS. */
export type FirebaseIosApp = {
	/** Output only. If the App has been removed from the Project, this is the timestamp of when the App is considered expired and will be permanently deleted. After this time, the App cannot be undeleted (that is, restored to the Project). This value is only provided if the App is in the `DELETED` state. */
	expireTime?: string | null;
	/** This checksum is computed by the server based on the value of other fields, and it may be sent with update requests to ensure the client has an up-to-date value before proceeding. Learn more about `etag` in Google's [AIP-154 standard](https://google.aip.dev/154#declarative-friendly-resources). */
	etag?: string | null;
	/** Immutable. The canonical bundle ID of the iOS app as it would appear in the iOS AppStore. */
	bundleId?: string | null;
	/** The automatically generated Apple ID assigned to the iOS app by Apple in the iOS App Store. */
	appStoreId?: string | null;
	/** The Apple Developer Team ID associated with the App in the App Store. */
	teamId?: string | null;
	/** Output only. Immutable. A user-assigned unique identifier of the parent FirebaseProject for the `IosApp`. */
	projectId?: string | null;
	/** The user-assigned display name for the `IosApp`. */
	displayName?: string | null;
	/** Output only. Immutable. The globally unique, Firebase-assigned identifier for the `IosApp`. This identifier should be treated as an opaque token, as the data format is not specified. */
	appId?: string | null;
	/** The globally unique, Google-assigned identifier (UID) for the Firebase API key associated with the `IosApp`. */
	apiKeyId?: string | null;
	/** The resource name of the IosApp, in the format: projects/PROJECT_IDENTIFIER /iosApps/APP_ID * PROJECT_IDENTIFIER: the parent Project's `ProjectNumber` ***(recommended)*** or its `ProjectId`. */
	name?: string | null;
	/** Output only. The lifecycle state of the App. */
	state?: string | null;
};

/** Configuration metadata of a single Firebase App for iOS. */
export type FirebaseIosAppConfig = {
	/** The filename that the configuration artifact for the `IosApp` is typically saved as. For example: `GoogleService-Info.plist` */
	configFilename?: string | null;
	/** The content of the XML configuration file. (base64) */
	configFileContents?: string | null;
};

/** Issues include warnings, errors, and deprecation notices. */
export type FirebaseIssue = {
	/** The severity of the issue. */
	severity?: string | null;
	/** Position of the issue in the `Source`. */
	sourcePosition?: FirebaseSourcePosition | null;
	/** Short error description. */
	description?: string | null;
};

/** An object that represents a latitude/longitude pair. This is expressed as a pair of doubles to represent degrees latitude and degrees longitude. Unless specified otherwise, this object must conform to the WGS84 standard. Values must be within normalized ranges. */
export type FirebaseLatLng = {
	/** The latitude in degrees. It must be in the range [-90.0, +90.0]. */
	latitude?: number | null;
	/** The longitude in degrees. It must be in the range [-180.0, +180.0]. */
	longitude?: number | null;
};

/** Settings to control notification LED. */
export type FirebaseLightSettings = {
	/** Required. Along with `light_on_duration`, define the blink rate of LED flashes. Resolution defined by [proto.Duration](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Duration) */
	lightOffDuration?: string | null;
	/** Required. Set `color` of the LED with [google.type.Color](https://github.com/googleapis/googleapis/blob/master/google/type/color.proto). */
	color?: FirebaseColor | null;
	/** Required. Along with `light_off_duration`, define the blink rate of LED flashes. Resolution defined by [proto.Duration](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Duration) */
	lightOnDuration?: string | null;
};

export type FirebaseListAndroidAppsResponse = {
	/** If the result list is too large to fit in a single response, then a token is returned. If the string is empty, then this response is the last page of results. This token can be used in a subsequent call to `ListAndroidApps` to find the next group of Apps. */
	nextPageToken?: string | null;
	/** List of each `AndroidApp` associated with the specified `FirebaseProject`. */
	apps?: Array<FirebaseAndroidApp> | null;
};

export type FirebaseListAvailableProjectsResponse = {
	/** If the result list is too large to fit in a single response, then a token is returned. If the string is empty, then this response is the last page of results. This token can be used in a subsequent calls to `ListAvailableProjects` to find the next group of Projects. */
	nextPageToken?: string | null;
	/** The list of Google Cloud `Projects` which can have Firebase resources added to them. */
	projectInfo?: Array<FirebaseProjectInfo> | null;
};

/** The response returned by `ListBuckets`. */
export type FirebaseListBucketsResponse = {
	/** A token that can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages. */
	nextPageToken?: string | null;
	/** The list of linked buckets. */
	buckets?: Array<FirebaseStorageBucketsBucket> | null;
};

export type FirebaseListChannelsResponse = {
	/** The list of channels. */
	channels?: Array<FirebaseChannel> | null;
	/** The pagination token, if more results exist beyond the ones in this response. Include this token in your next call to `ListChannels`. Page tokens are short-lived and should not be stored. */
	nextPageToken?: string | null;
};

/** The response from Firestore.ListCollectionIds. */
export type FirebaseListCollectionIdsResponse = {
	/** The collection ids. */
	collectionIds?: Array<string> | null;
	/** A page token that may be used to continue the list. */
	nextPageToken?: string | null;
};

/** The response from `ListCustomDomains`. */
export type FirebaseListCustomDomainsResponse = {
	/** A list of `CustomDomain` entities associated with the specified Firebase `Site`. */
	customDomains?: Array<FirebaseCustomDomain> | null;
	/** The pagination token, if more results exist beyond the ones in this response. Include this token in your next call to `ListCustomDomains`. Page tokens are short-lived and should not be stored. */
	nextPageToken?: string | null;
};

/** The response from the ListDatabaseInstances method. */
export type FirebaseListDatabaseInstancesResponse = {
	/** List of each DatabaseInstance that is in the parent Firebase project. */
	instances?: Array<FirebaseDatabaseInstance> | null;
	/** If the result list is too large to fit in a single response, then a token is returned. If the string is empty, then this response is the last page of results. This token can be used in a subsequent call to `ListDatabaseInstances` to find the next group of database instances. */
	nextPageToken?: string | null;
};

/** The response for Firestore.ListDocuments. */
export type FirebaseListDocumentsResponse = {
	/** The Documents found. */
	documents?: Array<FirebaseDocument> | null;
	/** A token to retrieve the next page of documents. If this field is omitted, there are no subsequent pages. */
	nextPageToken?: string | null;
};

/** The response to listing Domains. */
export type FirebaseListDomainsResponse = {
	/** The pagination token, if more results exist. */
	nextPageToken?: string | null;
	/** The list of domains, if any exist. */
	domains?: Array<FirebaseDomain> | null;
};

/** Response message for ListExperiments. */
export type FirebaseListExperimentsResponse = {
	/** List of experiments */
	experiments?: Array<FirebaseExperiment> | null;
	/** Token for the next page */
	nextPageToken?: string | null;
};

export type FirebaseListFirebaseProjectsResponse = {
	/** If the result list is too large to fit in a single response, then a token is returned. If the string is empty, then this response is the last page of results. This token can be used in a subsequent calls to `ListFirebaseProjects` to find the next group of Projects. */
	nextPageToken?: string | null;
	/** One page of the list of Projects that are accessible to the caller. */
	results?: Array<FirebaseFirebaseProject> | null;
};

export type FirebaseListIosAppsResponse = {
	/** List of each `IosApp` associated with the specified `FirebaseProject`. */
	apps?: Array<FirebaseIosApp> | null;
	/** If the result list is too large to fit in a single response, then a token is returned. If the string is empty, then this response is the last page of results. This token can be used in a subsequent call to `ListIosApps` to find the next group of Apps. */
	nextPageToken?: string | null;
};

/** The response message for Locations.ListLocations. */
export type FirebaseListLocationsResponse = {
	/** The standard List next-page token. */
	nextPageToken?: string | null;
	/** A list of locations that matches the specified filter in the request. */
	locations?: Array<FirebaseFirestoreLocation> | null;
};

/** Response message for ListNamespaces. */
export type FirebaseListNamespacesResponse = {
	/** The list of namespaces for the project. */
	namespaces?: Array<FirebaseNamespace> | null;
	/** Optional. The token for the specific page to retrieve. */
	nextPageToken?: string | null;
};

/** The response message for Operations.ListOperations. */
export type FirebaseListOperationsResponse = {
	/** The standard List next-page token. */
	nextPageToken?: string | null;
	/** Unordered list. Unreachable resources. Populated when the request sets `ListOperationsRequest.return_partial_success` and reads across collections. For example, when attempting to list all resources across all supported locations. */
	unreachable?: Array<string> | null;
	/** A list of operations that matches the specified filter in the request. */
	operations?: Array<FirebaseHostingOperation> | null;
};

/** Response message for listing Remote Config conditions. */
export type FirebaseListRemoteConfigConditionsResponse = {
	/** The list of conditions in the project namespace. */
	remoteConfigConditions?: Array<FirebaseRemoteConfigCondition> | null;
	/** A token that can be sent as `page_token` to retrieve the next page. */
	nextPageToken?: string | null;
};

/** Response message for listing Remote Config parameter groups. */
export type FirebaseListRemoteConfigParameterGroupsResponse = {
	/** The list of parameter groups in the project namespace. */
	remoteConfigParameterGroups?: Array<FirebaseRemoteConfigParameterGroup> | null;
	/** A token that can be sent as `page_token` to retrieve the next page. */
	nextPageToken?: string | null;
};

/** Response message for listing Remote Config parameters. */
export type FirebaseListRemoteConfigParametersResponse = {
	/** A token that can be sent as `page_token` to retrieve the next page. */
	nextPageToken?: string | null;
	/** The list of parameters in the project namespace. */
	remoteConfigParameters?: Array<FirebaseRemoteConfigParameter> | null;
};

/** Response message for ListRollouts. */
export type FirebaseListRolloutsResponse = {
	/** Token for the next page */
	nextPageToken?: string | null;
	/** The list of rollouts for the project. */
	rollouts?: Array<FirebaseRollout> | null;
};

/** The response for FirebaseRulesService.ListRulesets. */
export type FirebaseListRulesetsResponse = {
	/** The pagination token to retrieve the next page of results. If the value is empty, no further results remain. */
	nextPageToken?: string | null;
	/** List of `Ruleset` instances. */
	rulesets?: Array<FirebaseRuleset> | null;
};

export type FirebaseListShaCertificatesResponse = {
	/** The list of each `ShaCertificate` associated with the `AndroidApp`. */
	certificates?: Array<FirebaseShaCertificate> | null;
};

export type FirebaseListSitesResponse = {
	/** A list of Site objects associated with the specified Firebase project. */
	sites?: Array<FirebaseSite> | null;
	/** The pagination token, if more results exist beyond the ones in this response. Include this token in your next call to `ListSites`. Page tokens are short-lived and should not be stored. */
	nextPageToken?: string | null;
};

/** Response message for ListTopicSubscriptions. */
export type FirebaseListTopicSubscriptionsResponse = {
	/** A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages. */
	nextPageToken?: string | null;
	/** The topic subscriptions for the instance. */
	topicSubscriptions?: Array<FirebaseTopicSubscription> | null;
};

export type FirebaseListVersionFilesResponse = {
	/** The pagination token, if more results exist beyond the ones in this response. Include this token in your next call to `ListVersionFiles`. Page tokens are short-lived and should not be stored. */
	nextPageToken?: string | null;
	/** The list of paths to the hashes of the files in the specified version. */
	files?: Array<FirebaseVersionFile> | null;
};

export type FirebaseListWebAppsResponse = {
	/** List of each `WebApp` associated with the specified `FirebaseProject`. */
	apps?: Array<FirebaseWebApp> | null;
	/** If the result list is too large to fit in a single response, then a token is returned. If the string is empty, then this response is the last page of results. This token can be used in a subsequent call to `ListWebApps` to find the next group of Apps. */
	nextPageToken?: string | null;
};

/** Message to send by Firebase Cloud Messaging Service. */
export type FirebaseMessage = {
	/** Output Only. The identifier of the message sent, in the format of `projects/*\/messages/{message_id}`. */
	name?: string | null;
	/** Input only. Basic notification template to use across all platforms. */
	notification?: FirebaseMessagingNotification | null;
	/** Input only. Android specific options for messages sent through [FCM connection server](https://goo.gl/4GLdUl). */
	android?: FirebaseAndroidConfig | null;
	/** Input only. [Webpush protocol](https://tools.ietf.org/html/rfc8030) options. */
	webpush?: FirebaseWebpushConfig | null;
	/** Input only. Arbitrary key/value payload, which must be UTF-8 encoded. The key should not be a reserved word ("from", "message_type", or any word starting with "google." or "gcm.notification."). */
	data?: Record<string, string> | null;
	/** Input only. [Apple Push Notification Service](https://goo.gl/MXRTPa) specific options. */
	apns?: FirebaseApnsConfig | null;
	/** Input only. Template for FCM SDK feature options to use across all platforms. */
	fcmOptions?: FirebaseFcmOptions | null;
	/** Deprecated: Use `fid` instead. During the transition period, this field also accepts a Firebase Installation ID (FID). Registration token to send a message to. */
	token?: string | null;
	/** Topic name to send a message to, e.g. "weather". Note: "/topics/" prefix should not be provided. */
	topic?: string | null;
	/** Firebase Installation ID (FID) to send a message to. */
	fid?: string | null;
	/** Condition to send a message to, e.g. "'foo' in topics && 'bar' in topics". */
	condition?: string | null;
	/** Optional. Input only. Android specific V2 options for messages sent through FCM connection server. Mutually exclusive with `android`. Requests with both `AndroidConfig` and `AndroidConfigV2` will be rejected. */
	androidV2?: FirebaseAndroidConfigV2 | null;
};

/** Metadata for a Ruleset. */
export type FirebaseMetadata = {
	/** Services that this ruleset has declarations for (e.g., "cloud.firestore"). There may be 0+ of these. */
	services?: Array<string> | null;
};

/** A micro-percent interval defined by lower and upper bounds. */
export type FirebaseMicroPercentRange = {
	/** The lower limit of percentiles to target in micro-percents. The value must be in the range [0 and 100000000]. */
	microPercentLowerBound?: number | null;
	/** The upper limit of percentiles to target in micro-percents. The value must be in the range [0 and 100000000]. */
	microPercentUpperBound?: number | null;
};

/** The namespace of the RemoteConfig. */
export type FirebaseNamespace = {
	/** Required. Identifier. The name of the namespace. */
	name?: string | null;
};

/** An object. */
export type FirebaseObject = {
	/** Access controls on the object. */
	acl?: Array<FirebaseObjectAccessControl> | null;
	/** The name of the bucket containing this object. */
	bucket?: string | null;
	/** Cache-Control directive for the object data. If omitted, and the object is accessible to all anonymous users, the default will be public, max-age=3600. */
	cacheControl?: string | null;
	/** Number of underlying components that make up this object. Components are accumulated by compose operations. */
	componentCount?: number | null;
	/** Content-Disposition of the object data. */
	contentDisposition?: string | null;
	/** Content-Encoding of the object data. */
	contentEncoding?: string | null;
	/** Content-Language of the object data. */
	contentLanguage?: string | null;
	/** Content-Type of the object data. If an object is stored without a Content-Type, it is served as application/octet-stream. */
	contentType?: string | null;
	/** CRC32c checksum, as described in RFC 4960, Appendix B; encoded using base64 in big-endian byte order. For more information about using the CRC32c checksum, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation). */
	crc32c?: string | null;
	/** A timestamp in RFC 3339 format specified by the user for an object. */
	customTime?: string | null;
	/** Metadata of customer-supplied encryption key, if the object is encrypted by such a key. */
	customerEncryption?: {
		/** The encryption algorithm. */
		encryptionAlgorithm?: string | null;
		/** SHA256 hash value of the encryption key. */
		keySha256?: string | null;
	} | null;
	/** HTTP 1.1 Entity tag for the object. */
	etag?: string | null;
	/** Whether an object is under event-based hold. Event-based hold is a way to retain objects until an event occurs, which is signified by the hold's release (i.e. this value is set to false). After being released (set to false), such objects will be subject to bucket-level retention (if any). */
	eventBasedHold?: boolean | null;
	/** The content generation of this object. Used for object versioning. */
	generation?: (string | number) | null;
	/** The ID of the object, including the bucket name, object name, and generation number. */
	id?: string | null;
	/** The kind of item this is. For objects, this is always storage#object. */
	kind?: string | null;
	/** Not currently supported. Specifying the parameter causes the request to fail with status code 400 - Bad Request. */
	kmsKeyName?: string | null;
	/** MD5 hash of the data; encoded using base64. For more information about using the MD5 hash, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation). */
	md5Hash?: string | null;
	/** Media download link. */
	mediaLink?: string | null;
	/** User-provided metadata, in key/value pairs. On a patch, a key set to null deletes that entry and `metadata: null` deletes them all. */
	metadata?: Record<string, string | null> | null;
	/** User-defined or system-defined object contexts. Each object context is a key-payload pair, where the key provides the identification and the payload holds the associated value and additional metadata. */
	contexts?: {
		/** User-defined object contexts. */
		custom?: Record<string, FirebaseObjectCustomContextPayload> | null;
	} | null;
	/** Restore token used to differentiate deleted objects with the same name and generation. This field is only returned for deleted objects in hierarchical namespace buckets. */
	restoreToken?: string | null;
	/** The version of the metadata for this object at this generation. Used for preconditions and for detecting changes in metadata. A metageneration number is only meaningful in the context of a particular generation of a particular object. */
	metageneration?: (string | number) | null;
	/** The name of the object. Required if not specified by URL parameter. */
	name?: string | null;
	/** The owner of the object. This will always be the uploader of the object. */
	owner?: {
		/** The entity, in the form user-userId. */
		entity?: string | null;
		/** The ID for the entity. */
		entityId?: string | null;
	} | null;
	/** A server-determined value that specifies the earliest time that the object's retention period expires. This value is in RFC 3339 format. Note 1: This field is not provided for objects with an active event-based hold, since retention expiration is unknown until the hold is removed. */
	retentionExpirationTime?: string | null;
	/** A collection of object level retention parameters. */
	retention?: {
		/** A time in RFC 3339 format until which object retention protects this object. */
		retainUntilTime?: string | null;
		/** The bucket's object retention mode, can only be Unlocked or Locked. */
		mode?: string | null;
	} | null;
	/** The link to this object. */
	selfLink?: string | null;
	/** Content-Length of the data in bytes. */
	size?: (string | number) | null;
	/** Storage class of the object. */
	storageClass?: string | null;
	/** Whether an object is under temporary hold. While this flag is set to true, the object is protected against deletion and overwrites. A common use case of this flag is regulatory investigations where objects need to be retained while the investigation is ongoing. */
	temporaryHold?: boolean | null;
	/** The creation time of the object in RFC 3339 format. */
	timeCreated?: string | null;
	/** The time at which the object became noncurrent in RFC 3339 format. Will be returned if and only if this version of the object has been deleted. */
	timeDeleted?: string | null;
	/** The time when the object was finalized. */
	timeFinalized?: string | null;
	/** The time at which the object became soft-deleted in RFC 3339 format. */
	softDeleteTime?: string | null;
	/** This is the time (in the future) when the soft-deleted object will no longer be restorable. It is equal to the soft delete time plus the current soft delete retention duration of the bucket. */
	hardDeleteTime?: string | null;
	/** The time at which the object's storage class was last changed. When the object is initially created, it will be set to timeCreated. */
	timeStorageClassUpdated?: string | null;
	/** The modification time of the object metadata in RFC 3339 format. Set initially to object creation time and then updated whenever any metadata of the object changes. */
	updated?: string | null;
	/** Information about the object's availability in Rapid Cache Ultra (RCU) zonal caches. This field will only populate once the object is loaded into the cache. */
	zonalAvailabilityInfo?: {
		/** A list of zones where the object has a zonal copy. The zone names are expected to be in lower-dash case format (e.g., 'us-central1-a'). */
		availableZones?: Array<string> | null;
	} | null;
};

/** An access-control entry. */
export type FirebaseObjectAccessControl = {
	/** The name of the bucket. */
	bucket?: string | null;
	/** The domain associated with the entity, if any. */
	domain?: string | null;
	/** The email address associated with the entity, if any. */
	email?: string | null;
	/** The entity holding the permission, in one of the following forms: - user-userId - user-email - group-groupId - group-email - domain-domain - project-team-projectId - allUsers - allAuthenticatedUsers Examples: - The user liz@example.com would be user-liz@example.com. */
	entity?: string | null;
	/** The ID for the entity, if any. */
	entityId?: string | null;
	/** HTTP 1.1 Entity tag for the access-control entry. */
	etag?: string | null;
	/** The content generation of the object, if applied to an object. */
	generation?: (string | number) | null;
	/** The ID of the access-control entry. */
	id?: string | null;
	/** The kind of item this is. For object access control entries, this is always storage#objectAccessControl. */
	kind?: string | null;
	/** The name of the object, if applied to an object. */
	object?: string | null;
	/** The project team associated with the entity, if any. */
	projectTeam?: {
		/** The project number. */
		projectNumber?: string | null;
		/** The team. */
		team?: string | null;
	} | null;
	/** The access permission for the entity. */
	role?: string | null;
	/** The link to this access-control entry. */
	selfLink?: string | null;
};

/** The payload of a single user-defined object context. */
export type FirebaseObjectCustomContextPayload = {
	/** The value of the object context. */
	value?: string | null;
	/** The time at which the object context was created in RFC 3339 format. */
	createTime?: string | null;
	/** The time at which the object context was last updated in RFC 3339 format. */
	updateTime?: string | null;
	/** The type URL of the object context's extended data. */
	extendedDataTypeUrl?: string | null;
};

/** A full representation of an object context. */
export type FirebaseObjectFullContext = {
	/** The kind of item this is. For ObjectFullContext, this is always storage#objectFullContext. */
	kind?: string | null;
	/** The type of the object context. */
	type?: string | null;
	/** The key of the object context. */
	key?: string | null;
	/** The value of the object context. */
	value?: string | null;
	/** The time at which the object context was created. This value is in RFC 3339 format. */
	createTime?: string | null;
	/** The time at which the object context was last updated. This value is in RFC 3339 format. */
	updateTime?: string | null;
	/** The extended data of the object context. */
	extendedData?: Record<string, FirebaseJsonValue> | null;
};

/** A list of objects. */
export type FirebaseObjects = {
	/** The list of items. */
	items?: Array<FirebaseObject> | null;
	/** The kind of item this is. For lists of objects, this is always storage#objects. */
	kind?: string | null;
	/** The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results. */
	nextPageToken?: string | null;
	/** The list of prefixes of objects matching-but-not-listed up to and including the requested delimiter. */
	prefixes?: Array<string> | null;
};

/** OR of sub-conditions. An OR condition is true if any of its subconditions evaluate to true. If there is an exception evaluating any of its subconditions, that subcondition can be ignored if any other subcondition is true. */
export type FirebaseOrCondition = {
	/** Evaluated in given order with short circuit of true. Should contain at least one condition and no more than 100 conditions. */
	conditions?: Array<FirebaseCondition> | null;
};

/** The response for Firestore.PartitionQuery. */
export type FirebasePartitionQueryResponse = {
	/** Partition results. Each partition is a split point that can be used by RunQuery as a starting or end point for the query results. The RunQuery requests must be made with the same query supplied to this PartitionQuery request. */
	partitions?: Array<FirebaseCursor> | null;
	/** A page token that may be used to request an additional set of results, up to the number specified by `partition_count` in the PartitionQuery request. If blank, there are no more results. */
	nextPageToken?: string | null;
};

/** ---------- Primitive Conditions (Atoms) A condition that compares the instance pseudo-random percentile to a given limit. NOTE: Developers provide an ID via the Admin SDK. This ID is hashed to a random percentile. */
export type FirebasePercentCondition = {
	/** Required. The choice of percent operator to determine how to compare targets to percent(s). */
	percentOperator?: string | null;
	/** The range of percentiles to target in micro-percents. */
	microPercentRange?: FirebaseMicroPercentRange | null;
	/** Required. The limit of percentiles to target in micro-percents. The value must be in the range [0 and 100000000]. */
	microPercent?: number | null;
	/** Optional. The seed used when evaluating the hash function to map an instance to a value in the hash space. This is a string which can have 0 - 32 characters and can contain ASCII characters [-_.0-9a-zA-Z]. The string is case-sensitive. */
	seed?: string | null;
};

/** LINT.IfChange Metadata associated with a particular Remote Config parameter key, managed by Firebase Personalization. */
export type FirebasePersonalizationMetadata = {
	/** The selected arm's index, which may be 0. */
	armIndex?: number | null;
	/** The ID of this Personalization experiment. Should be composed of letters, numbers, hyphens, and underscores. */
	personalizationId?: string | null;
	/** Variant group to which user belongs. */
	group?: string | null;
	/** Identifier for the choice. For internal use only. */
	choiceId?: string | null;
};

/** Contains the necessary information to fetch a personalized value. */
export type FirebasePersonalizationValue = {
	/** Identifier that represents a personalization definition. This definition is used to resolve the value at config fetch time. This system-generated value should not be modified. */
	personalizationId?: string | null;
};

/** Planning phase information for the query. */
export type FirebasePlanSummary = {
	/** The indexes selected for the query. For example: [ {"query_scope": "Collection", "properties": "(foo ASC, __name__ ASC)"}, {"query_scope": "Collection", "properties": "(bar ASC, __name__ ASC)"} ] */
	indexesUsed?: Array<Record<string, FirebaseJsonValue>> | null;
};

/** A bucket/object/managedFolder IAM policy. */
export type FirebasePolicy = {
	/** An association between a role, which comes with a set of permissions, and members who may assume that role. */
	bindings?: Array<{
		/** The condition that is associated with this binding. NOTE: an unsatisfied condition will not allow user access via current binding. Different bindings, including their conditions, are examined independently. */
		condition?: FirebaseExpr | null;
		/** A collection of identifiers for members who may assume the provided role. Recognized identifiers are as follows: - allUsers - A special identifier that represents anyone on the internet; with or without a Google account. */
		members?: Array<string> | null;
		/** The role to which members belong. Two types of roles are supported: new IAM roles, which grant permissions that do not map directly to those provided by ACLs, and legacy IAM roles, which do map directly to ACL permissions. All roles are of the format roles/storage.specificRole. */
		role?: string | null;
	}> | null;
	/** HTTP 1.1 Entity tag for the policy. (base64) */
	etag?: string | null;
	/** The kind of item this is. For policies, this is always storage#policy. This field is ignored on input. */
	kind?: string | null;
	/** The ID of the resource to which this policy belongs. Will be of the form projects/_/buckets/bucket for buckets, projects/_/buckets/bucket/objects/object for objects, and projects/_/buckets/bucket/managedFolders/managedFolder. */
	resourceId?: string | null;
	/** The IAM policy format version. */
	version?: number | null;
};

export type FirebasePopulateVersionFilesResponse = {
	/** The content hashes of the specified files that need to be uploaded to the specified URL. */
	uploadRequiredHashes?: Array<string> | null;
	/** The URL to which the files should be uploaded, in the format: "https://upload-firebasehosting.googleapis.com/upload/sites/SITE_ID /versions/VERSION_ID/files" Perform a multipart `POST` of the Gzipped file contents to the URL using a forward slash and the hash of the file appended to the end. */
	uploadUrl?: string | null;
};

/** A reference to a Google Cloud `Project`. */
export type FirebaseProjectInfo = {
	/** The resource name of the Google Cloud `Project` to which Firebase resources can be added, in the format: projects/PROJECT_IDENTIFIER Refer to the `FirebaseProject` `name` field for details about PROJECT_IDENTIFIER values. */
	project?: string | null;
	/** **DEPRECATED** _Instead, use product-specific REST APIs to work with the location of each resource in a Project. */
	locationId?: string | null;
	/** The user-assigned display name of the Google Cloud `Project`, for example: `My App`. */
	displayName?: string | null;
};

/** A [`Redirect`](https://firebase.google.com/docs/hosting/full-config#redirects) specifies a URL pattern that, if matched to the request URL path, triggers Hosting to respond with a redirect to the specified destination path. */
export type FirebaseRedirect = {
	/** The user-supplied [glob](https://firebase.google.com/docs/hosting/full-config#glob_pattern_matching) to match against the request URL path. */
	glob?: string | null;
	/** Required. The status HTTP code to return in the response. It must be a valid 3xx status code. */
	statusCode?: number | null;
	/** Required. The value to put in the HTTP location header of the response. The location can contain capture group values from the pattern using a `:` prefix to identify the segment and an optional `*` to capture the rest of the URL. */
	location?: string | null;
	/** The user-supplied RE2 regular expression to match against the request URL path. */
	regex?: string | null;
};

/** * A RemoteConfig represents a Remote Config template. A project's Remote Config template is evaluated during each application instance's fetch. Note: Server templates currently support percentage conditions. */
export type FirebaseRemoteConfig = {
	/** A list of conditions in descending order by priority. The values of the google.firebase.remoteconfig.v1.RemoteConfigCondition.name entries must be unique. */
	conditions?: Array<FirebaseRemoteConfigCondition> | null;
	/** Map of parameter group names to their descriptions and grouped parameters. A group's name is mutable but must be unique among groups in the config. The name is limited to 256 characters and intended to be human-readable. Any Unicode characters are allowed. */
	parameterGroups?: Record<string, FirebaseRemoteConfigParameterGroup> | null;
	/** Output only, except for the version description. Metadata associated with a particular version of a template. A version's description field may be specified in UpdateRemoteConfig calls. */
	version?: FirebaseRemoteConfigVersion | null;
	/** Map of parameter keys to their optional default values and optional conditional values. */
	parameters?: Record<string, FirebaseRemoteConfigParameter> | null;
	/** The ETag of this template (from the response header). Pass it as `ifMatch` to publish a change, so a publish made in between is not overwritten. */
	etag?: string | null;
};

/** A condition targeting a specific group of users. A list of these conditions make up part of a RemoteConfig object. */
export type FirebaseRemoteConfigCondition = {
	/** Required. The logic of this condition. See the documentation regarding Condition Expressions for the expected syntax of this field. */
	expression?: string | null;
	/** Required. Identifier. A non-empty and unique name of this condition. Format: projects/{project}/namespaces/{namespace}/remoteConfigConditions/{remote_config_condition} When used within RemoteConfig.conditions, this field may contain just the condition name. */
	name?: string | null;
	/** The current ETag of the condition for optimistic concurrency. */
	etag?: string | null;
	/** Optional. The color associated with this condition for display purposes in the Firebase Console. Not specifying this value or having "CONDITION_DISPLAY_COLOR_UNSPECIFIED" results in the Console picking an arbitrary color to associate with the condition. */
	tagColor?: string | null;
};

/** A parameter value associated with a parameter key in google.firebase.remoteconfig.v1.RemoteConfig.parameters. At minimum, a `default_value` or a `conditional_values` entry should be present for the parameter to have any effect. */
export type FirebaseRemoteConfigParameter = {
	/** Optional. Optional - a (condition name, value) map. The condition_name of the highest priority (the one listed first in the RemoteConfig's conditions list) determines the value of this parameter. */
	conditionalValues?: Record<string, FirebaseRemoteConfigParameterValue> | null;
	/** Optional. Identifier. The resource name of the parameter. Format: projects/{project}/namespaces/{namespace}/remoteConfigParameters/{remote_config_parameter} NOTE: Retained as field number 5 to preserve strict backwards wire-compatibility with existing RemoteConfig.parameters map definitions. */
	name?: string | null;
	/** The current ETag of the parameter for optimistic concurrency. */
	etag?: string | null;
	/** Optional. Optional - value to set the parameter to, when none of the named conditions evaluate to `true`. */
	defaultValue?: FirebaseRemoteConfigParameterValue | null;
	/** Optional. The data type for all values of this parameter in the current version of the template. Defaults to `ParameterValueType.STRING` if unspecified. */
	valueType?: string | null;
	/** Optional. A description for this Parameter. Its length must be less than or equal to 256 characters . A description may contain any Unicode characters. */
	description?: string | null;
};

/** A named group of parameters. Grouping parameters is only for management purposes and does not affect client-side fetching of parameter values. */
export type FirebaseRemoteConfigParameterGroup = {
	/** Optional. Map of parameter keys to their optional default values and optional conditional values for parameters that belong to this group. */
	parameters?: Record<string, FirebaseRemoteConfigParameter> | null;
	/** Optional. A description for the group. Its length must be less than or equal to 256 characters. A description may contain any Unicode characters. */
	description?: string | null;
	/** Optional. Identifier. The resource name of the parameter group. Format: projects/{project}/namespaces/{namespace}/remoteConfigParameterGroups/{remote_config_parameter_group} */
	name?: string | null;
	/** The current ETag of the parameter group for optimistic concurrency. */
	etag?: string | null;
};

/** A RemoteConfigParameterValue resource contains the value that a parameter may have. */
export type FirebaseRemoteConfigParameterValue = {
	/** A dynamic, user-specific value computed when config is fetched. */
	personalizationValue?: FirebasePersonalizationValue | null;
	/** Optional. The string value that the parameter is set to. */
	value?: string | null;
	/** A dynamic value managed by the Firebase ABT Experiment service. */
	experimentValue?: FirebaseExperimentValue | null;
	/** A dynamic Rollout value managed by the Firebase ABT Experiment service. */
	rolloutValue?: FirebaseRolloutValue | null;
	/** If true, the parameter is omitted from the parameter values returned to a client. */
	useInAppDefault?: boolean | null;
};

/** All the fields associated with the person/service account that wrote a Remote Config template. */
export type FirebaseRemoteConfigUser = {
	/** Output only. Email address. */
	email?: string | null;
	/** Output only. Image URL. */
	imageUrl?: string | null;
	/** Output only. Display name. */
	name?: string | null;
};

/** A [`Rewrite`](https://firebase.google.com/docs/hosting/full-config#rewrites) specifies a URL pattern that, if matched to the request URL path, triggers Hosting to respond as if the service were given the specified destination URL. */
export type FirebaseRewrite = {
	/** Optional. Specify a Cloud region for rewritten Functions invocations. If not provided, defaults to us-central1. */
	functionRegion?: string | null;
	/** The user-supplied RE2 regular expression to match against the request URL path. */
	regex?: string | null;
	/** The request will be forwarded to Firebase Dynamic Links. */
	dynamicLinks?: boolean | null;
	/** The URL path to rewrite the request to. */
	path?: string | null;
	/** The function to proxy requests to. Must match the exported function name exactly. */
	function?: string | null;
	/** The request will be forwarded to Cloud Run. */
	run?: FirebaseCloudRunRewrite | null;
	/** The user-supplied [glob](https://firebase.google.com/docs/hosting/full-config#glob_pattern_matching) to match against the request URL path. */
	glob?: string | null;
};

/** A rewrite response. */
export type FirebaseRewriteResponse = {
	/** true if the copy is finished; otherwise, false if the copy is in progress. This property is always present in the response. */
	done?: boolean | null;
	/** The kind of item this is. */
	kind?: string | null;
	/** The total size of the object being copied in bytes. This property is always present in the response. */
	objectSize?: (string | number) | null;
	/** A resource containing the metadata for the copied-to object. This property is present in the response only when copying completes. */
	resource?: FirebaseObject | null;
	/** A token to use in subsequent requests to continue copying data. This token is present in the response only when there is more data to copy. */
	rewriteToken?: string | null;
	/** The total bytes written so far, which can be used to provide a waiting user with a progress indicator. This property is always present in the response. */
	totalBytesRewritten?: (string | number) | null;
};

/** Representation of a rollout Experiment */
export type FirebaseRollout = {
	/** Output only. Create time of the rollout experiment. */
	createTime?: string | null;
	/** Output only. The experiment state of the rollout. Will only be RUNNING or DONE. */
	state?: string | null;
	/** Output only. Last update time of the rollout experiment. */
	lastUpdateTime?: string | null;
	/** Output only. End time of the rollout experiment. */
	endTime?: string | null;
	/** The rollout definition. */
	definition?: FirebaseRolloutDefinition | null;
	/** Identifier. The name of the rollout to get. Format: projects/{project}/namespaces/{namespace}/rollouts/{rollout_id} */
	name?: string | null;
	/** Etag for the Experiment which is generated using hash of update_time. Can be filled during call to UpdateRollout to ensure that the correct version of the experiment is updated. This will ensure that there are no conflicting writes. */
	etag?: string | null;
	/** Output only. Start time of the rollout experiment. It is always the same as the create_time. */
	startTime?: string | null;
};

/** Definition to represent a rollout experiment. */
export type FirebaseRolloutDefinition = {
	/** Required. This is the control variant of the rollout. It will always have weight of 1 and name set as "Control". */
	controlVariant?: FirebaseExperimentVariant | null;
	/** Required. This is the enabled variant of the rollout. It will always have weight of 1 and name set as "Enabled". */
	enabledVariant?: FirebaseExperimentVariant | null;
	/** Required. The display name of the rollout experiment. */
	displayName?: string | null;
	/** Optional. Text description of the rollout experiment. */
	description?: string | null;
};

/** Metadata describing Remote Config rollouts. */
export type FirebaseRolloutMetadata = {
	/** The variant of the rollout assigned to this instance in this fetch response. */
	variantId?: string | null;
	/** The parameter keys affected by this rollout. */
	affectedParameterKeys?: Array<string> | null;
	/** The Firebase Remote Config rollout ID uniquely identifying a rollout. This is the tracking ID of the Rollout object defined in ExperimentsEntities. */
	rolloutId?: string | null;
};

/** Information related to a Rollout. */
export type FirebaseRolloutValue = {
	/** Optional. The user-specified value to be rolled out. */
	value?: string | null;
	/** The percentage of users that will receive the rollout value. */
	percent?: number | null;
	/** The identifier that associates a parameter value to a Rollout experiment. */
	rolloutId?: string | null;
};

/** `Ruleset` is an immutable copy of `Source` with a globally unique identifier and a creation time. */
export type FirebaseRuleset = {
	/** Output only. The metadata for this ruleset. */
	metadata?: FirebaseMetadata | null;
	/** Required. `Source` for the `Ruleset`. */
	source?: FirebaseSource | null;
	/** Output only. Time the `Ruleset` was created. */
	createTime?: string | null;
	/** Immutable. Intended resource to which this Ruleset should be released. May be left blank to signify the resource associated with the default release. Expected format: firestore.googleapis.com/projects//databases/ */
	attachmentPoint?: string | null;
	/** Output only. Name of the `Ruleset`. The ruleset_id is auto generated by the service. Format: `projects/{project_id}/rulesets/{ruleset_id}` */
	name?: string | null;
};

/** The response for Firestore.RunAggregationQuery. */
export type FirebaseRunAggregationQueryResponse = {
	/** Query explain metrics. This is only present when the RunAggregationQueryRequest.explain_options is provided, and it is sent only once with the last response in the stream. */
	explainMetrics?: FirebaseExplainMetrics | null;
	/** The transaction that was started as part of this request. Only present on the first response when the request requested to start a new transaction. (base64) */
	transaction?: string | null;
	/** The time at which the aggregate result was computed. This is always monotonically increasing; in this case, the previous AggregationResult in the result stream are guaranteed not to have changed between their `read_time` and this one. */
	readTime?: string | null;
	/** A single aggregation result. Not present when reporting partial progress. */
	result?: FirebaseAggregationResult | null;
};

/** The response for Firestore.RunQuery. */
export type FirebaseRunQueryResponse = {
	/** The transaction that was started as part of this request. Can only be set in the first response, and only if RunQueryRequest.new_transaction was set in the request. If set, no other fields will be set in this response. (base64) */
	transaction?: string | null;
	/** Query explain metrics. This is only present when the RunQueryRequest.explain_options is provided, and it is sent only once with the last response in the stream. */
	explainMetrics?: FirebaseExplainMetrics | null;
	/** The number of results that have been skipped due to an offset between the last response and the current response. */
	skippedResults?: number | null;
	/** A query result, not set when reporting partial progress. */
	document?: FirebaseDocument | null;
	/** The time at which the document was read. This may be monotonically increasing; in this case, the previous documents in the result stream are guaranteed not to have changed between their `read_time` and this one. */
	readTime?: string | null;
	/** If present, Firestore has completely finished the request and no more documents will be returned. */
	done?: boolean | null;
};

export type FirebaseSearchFirebaseAppsResponse = {
	/** One page of results from a call to `SearchFirebaseApps`. */
	apps?: Array<FirebaseFirebaseAppInfo> | null;
	/** If the result list is too large to fit in a single response, then a token is returned. This token can be used in a subsequent calls to `SearchFirebaseApps` to find the next group of Apps. Page tokens are short-lived and should not be persisted. */
	nextPageToken?: string | null;
};

/** * A ServerRemoteConfig represents the raw data-plane version of a control plane Remote Config template. This raw template will be evaluated by the Admin SDK (RC Server SDK) to form the config. */
export type FirebaseServerRemoteConfig = {
	/** A list of conditions in descending order by priority. */
	conditions?: Array<FirebaseServerRemoteConfigCondition> | null;
	/** Contains all metadata about a particular version of the server Remote Config template. Note that we are reusing the control plane version proto here. */
	version?: FirebaseRemoteConfigVersion | null;
	/** Map of parameter keys to their optional default values and optional conditional values. */
	parameters?: Record<string, FirebaseServerRemoteConfigParameter> | null;
};

/** A condition targeting a specific group of users and servers. Same as the condition in the control plane. */
export type FirebaseServerRemoteConfigCondition = {
	/** Required. The logic of this condition. */
	condition?: FirebaseCondition | null;
	/** Required. A non-empty and unique name of this condition. */
	name?: string | null;
};

/** A parameter value associated with a parameter key in [google.firebase.remoteconfig.v1.ServerRemoteConfig.parameters]. At minimum, a `default_value` or a `conditional_values` entry should be present for the parameter to have any effect. */
export type FirebaseServerRemoteConfigParameter = {
	/** Optional - a (condition name, value) map. The condition_name of the highest priority (the one listed first in the RemoteConfig's conditions list) determines the value of this parameter. */
	conditionalValues?: Record<
		string,
		FirebaseServerRemoteConfigParameterValue
	> | null;
	/** Optional - value to set the parameter to, when none of the named conditions evaluate to true. */
	defaultValue?: FirebaseServerRemoteConfigParameterValue | null;
};

/** A ServerRemoteConfigParameterValue resource contains the value that a parameter may have. Currently, there is no support for managed values like ABT or P13n. */
export type FirebaseServerRemoteConfigParameterValue = {
	/** Optional. The string value that the parameter is set to. */
	value?: string | null;
	/** If true, the parameter is omitted from the parameter values returned to the server. */
	useInAppDefault?: boolean | null;
};

/** The configuration for how incoming requests to a site should be routed and processed before serving content. */
export type FirebaseServingConfig = {
	/** Defines how to handle a trailing slash in the URL path. */
	trailingSlashBehavior?: string | null;
	/** An array of objects (called redirect rules), where each rule specifies a URL pattern that, if matched to the request URL path, triggers Hosting to respond with a redirect to the specified destination path. */
	redirects?: Array<FirebaseRedirect> | null;
	/** Defines whether to drop the file extension from uploaded files. */
	cleanUrls?: boolean | null;
	/** An array of objects (called rewrite rules), where each rule specifies a URL pattern that, if matched to the request URL path, triggers Hosting to respond as if the service were given the specified destination URL. */
	rewrites?: Array<FirebaseRewrite> | null;
	/** An array of objects, where each object specifies a URL pattern that, if matched to the request URL path, triggers Hosting to apply the specified custom response headers. */
	headers?: Array<FirebaseHeader> | null;
	/** Optional. Defines i18n rewrite behavior. */
	i18n?: FirebaseI18nConfig | null;
	/** How to handle well known App Association files. */
	appAssociation?: string | null;
};

/** A SHA-1 or SHA-256 certificate associated with the AndroidApp. */
export type FirebaseShaCertificate = {
	/** The certificate hash for the `AndroidApp`. */
	shaHash?: string | null;
	/** The type of SHA certificate encoded in the hash. */
	certType?: string | null;
	/** The resource name of the ShaCertificate for the AndroidApp, in the format: projects/PROJECT_IDENTIFIER/androidApps/APP_ID/sha/SHA_HASH * PROJECT_IDENTIFIER: the parent Project's `ProjectNumber` ***(recommended)*** or its `ProjectId`. */
	name?: string | null;
};

/** A `Site` represents a Firebase Hosting site. */
export type FirebaseSite = {
	/** Output only. The default URL for the Hosting site. */
	defaultUrl?: string | null;
	/** Output only. The type of Hosting site. Every Firebase project has a `DEFAULT_SITE`, which is created when Hosting is provisioned for the project. All additional sites are `USER_SITE`. */
	type?: string | null;
	/** Output only. The fully-qualified resource name of the Hosting site, in the format: projects/PROJECT_IDENTIFIER/sites/SITE_ID PROJECT_IDENTIFIER: the Firebase project's… */
	name?: string | null;
	/** Optional. User-specified labels for the Hosting site. */
	labels?: Record<string, string> | null;
	/** Optional. The [ID of a Web App](https://firebase.google.com/docs/reference/firebase-management/rest/v1beta1/projects.webApps#WebApp.FIELDS.app_id) associated with the Hosting site. */
	appId?: string | null;
};

/** A `SiteConfig` contains metadata associated with a specific site that controls Firebase Hosting serving behavior */
export type FirebaseSiteConfig = {
	/** Whether or not web requests made by site visitors are logged via Cloud Logging. */
	cloudLoggingEnabled?: boolean | null;
	/** The number of FINALIZED versions that will be held for a site before automatic deletion. When a new version is deployed, content for versions in storage in excess of this number will be deleted, and will no longer be billed for storage usage. */
	maxVersions?: (string | number) | null;
};

/** `Source` is one or more `File` messages comprising a logical set of rules. */
export type FirebaseSource = {
	/** Required. `File` set constituting the `Source` bundle. */
	files?: Array<FirebaseFile> | null;
};

/** Position in the `Source` content including its line, column number, and an index of the `File` in the `Source` message. Used for debug purposes. */
export type FirebaseSourcePosition = {
	/** Start position relative to the beginning of the file. */
	currentOffset?: number | null;
	/** Name of the `File`. */
	fileName?: string | null;
	/** Line number of the source fragment. 1-based. */
	line?: number | null;
	/** End position relative to the beginning of the file. */
	endOffset?: number | null;
	/** First column on the source line associated with the source fragment. */
	column?: number | null;
};

/** A mapping of a Firebase App to a Google Analytics data stream */
export type FirebaseStreamMapping = {
	/** Applicable for Firebase Web Apps only. The unique Google-assigned identifier of the Google Analytics web stream associated with the Firebase Web App. Firebase SDKs use this ID to interact with Google Analytics APIs. */
	measurementId?: string | null;
	/** The unique Google-assigned identifier of the Google Analytics data stream associated with the Firebase App. Learn more about Google Analytics data streams in the [Analytics documentation](https://support.google.com/analytics/answer/9303323). */
	streamId?: (string | number) | null;
	/** The resource name of the Firebase App associated with the Google Analytics data stream, in the format: projects/PROJECT_IDENTIFIER/androidApps/APP_ID or projects/PROJECT_IDENTIFIER/iosApps/APP_ID or projects/PROJECT_IDENTIFIER /webApps/APP_ID Refer to the `FirebaseProject` `name` field for details… */
	app?: string | null;
};

/** A pre-defined system objective. */
export type FirebaseSystemObjectiveDetails = {
	/** Required. One of the predefined system objective names, such as purchase_revenue. The name determines what to measure and how to count it. */
	objective?: string | null;
};

/** A storage.(buckets|objects|managedFolders).testIamPermissions response. */
export type FirebaseTestIamPermissionsResponse = {
	/** The kind of item this is. */
	kind?: string | null;
	/** The permissions held by the caller. Permissions are always of the format storage.resource.capability, where resource is one of buckets, objects, or managedFolders. The supported permissions are as follows: - storage.buckets.delete - Delete bucket. - storage.buckets.get - Read bucket metadata. */
	permissions?: Array<string> | null;
};

/** Test result message containing the state of the test as well as a description and source position for test failures. */
export type FirebaseTestResult = {
	/** Position in the `Source` or `Ruleset` where the principle runtime error occurs. Evaluation of an expression may result in an error. Rules are deny by default, so a `DENY` expectation when an error is generated is valid. When there is a `DENY` with an error, the `SourcePosition` is returned. E.g. */
	errorPosition?: FirebaseSourcePosition | null;
	/** The set of function calls made to service-defined methods. Function calls are included in the order in which they are encountered during evaluation, are provided for both mocked and unmocked functions, and included on the response regardless of the test `state`. */
	functionCalls?: Array<FirebaseFunctionCall> | null;
	/** Debug messages related to test execution issues encountered during evaluation. Debug messages may be related to too many or too few invocations of function mocks or to runtime errors that occur during evaluation. For example: ```Unable to read variable [name: "resource"]``` */
	debugMessages?: Array<string> | null;
	/** The set of visited permission expressions for a given test. This returns the positions and evaluation results of all visited permission expressions which were relevant to the test case, e.g. */
	visitedExpressions?: Array<FirebaseVisitedExpression> | null;
	/** State of the test. */
	state?: string | null;
	/** The mapping from expression in the ruleset AST to the values they were evaluated to. Partially-nested to mirror AST structure. Note that this field is actually tracking expressions and not permission statements in contrast to the "visited_expressions" field above. Literal expressions are omitted. */
	expressionReports?: Array<FirebaseExpressionReport> | null;
};

/** The response for FirebaseRulesService.TestRuleset. */
export type FirebaseTestRulesetResponse = {
	/** The set of test results given the test cases in the `TestSuite`. The results will appear in the same order as the test cases appear in the `TestSuite`. */
	testResults?: Array<FirebaseTestResult> | null;
	/** Syntactic and semantic `Source` issues of varying severity. Issues of `ERROR` severity will prevent tests from executing. */
	issues?: Array<FirebaseIssue> | null;
};

/** Represents a subscription of a single app instance to a single FCM topic. */
export type FirebaseTopicSubscription = {
	/** Identifier. The resource name of the subscription. Format: projects/{project}/registrations/{registration}/topicSubscriptions/{topicSubscription} The {registration} part contains the registration ID (e.g., FID). */
	name?: string | null;
	/** Output only. The ID of the TopicSubscription, which is the topic name. This corresponds to the {topicSubscription} segment in the resource name. Topic names match the pattern of "[a-zA-Z0-9-_.~%]{1,900}". */
	topicName?: string | null;
	/** Output only. Time when the subscription was created. */
	createTime?: string | null;
};

/** A message that can hold any of the supported value types. */
export type FirebaseValue = {
	/** Value which references a field. This is considered relative (vs absolute) since it only refers to a field and not a field within a particular document. **Requires:** * Must follow field reference limitations. * Not allowed to be used when writing documents. */
	fieldReferenceValue?: string | null;
	/** An unevaluated pipeline (not allowed when writing documents). */
	pipelineValue?: Record<string, FirebaseJsonValue> | null;
	/** An unevaluated expression (not allowed when writing documents). */
	functionValue?: Record<string, FirebaseJsonValue> | null;
	/** A geo point value representing a point on the surface of Earth. */
	geoPointValue?: FirebaseLatLng | null;
	/** A boolean value. */
	booleanValue?: boolean | null;
	/** A map value: { fields: { <name>: Value } }. */
	mapValue?: Record<string, FirebaseJsonValue> | null;
	/** A null value. */
	nullValue?: string | null;
	/** A double value: a number, or "NaN", "Infinity" or "-Infinity". */
	doubleValue?: (number | string) | null;
	/** A bytes value. In Standard edition databases: * The value must not exceed 1 MiB - 89 bytes. * Only the first 1,500 bytes are considered by queries. In Enterprise edition databases, there is no limit on the size of the value. However, it is still subject to document and index entry size limits. */
	bytesValue?: string | null;
	/** An array value: { values: Value[] }. */
	arrayValue?: Record<string, FirebaseJsonValue> | null;
	/** A reference to a document. For example: `projects/{project_id}/databases/{database_id}/documents/{document_path}`. */
	referenceValue?: string | null;
	/** A timestamp value. Precise only to microseconds. When stored, any additional precision is rounded down. */
	timestampValue?: string | null;
	/** An integer value. */
	integerValue?: (string | number) | null;
	/** A string value. In Standard edition databases: * The string, represented as UTF-8, must not exceed 1 MiB - 89 bytes. * Only the first 1,500 bytes of the UTF-8 representation are considered by queries. In Enterprise edition databases, there is no limit on the size of the value. */
	stringValue?: string | null;
	/** Pointer to a variable defined elsewhere in a pipeline. Unlike `field_reference_value` which references a field within a document, this refers to a variable, defined in a separate namespace than the fields of a document. */
	variableReferenceValue?: string | null;
};

/** Tuple for how many times an Expression was evaluated to a particular ExpressionValue. */
export type FirebaseValueCount = {
	/** The return value of the expression */
	value?: FirebaseJsonValue | null;
	/** The amount of times that expression returned. */
	count?: number | null;
};

/** A static content file that is part of a version. */
export type FirebaseVersionFile = {
	/** Output only. The current status of a particular file in the specified version. The value will be either `pending upload` or `uploaded`. */
	status?: string | null;
	/** The URI at which the file's content should display. */
	path?: string | null;
	/** The SHA256 content hash of the file. */
	hash?: string | null;
};

/** Store the position and access outcome for an expression visited in rules. */
export type FirebaseVisitedExpression = {
	/** Position in the `Source` or `Ruleset` where an expression was visited. */
	sourcePosition?: FirebaseSourcePosition | null;
	/** The evaluated value for the visited expression, e.g. true/false */
	value?: FirebaseJsonValue | null;
};

/** Details of a Firebase App for the web. */
export type FirebaseWebApp = {
	/** Output only. Immutable. A user-assigned unique identifier of the parent FirebaseProject for the `WebApp`. */
	projectId?: string | null;
	/** The URLs where the `WebApp` is hosted. */
	appUrls?: Array<string> | null;
	/** Optional. Set of labels assigned to the `WebApp`. Valid label keys have two segments: an optional prefix and a name, separated by a slash (`/`). `firebase.*\/` prefixes are reserved for Firebase-service use, and `express.cloud/` is reserved for Google Cloud Express. */
	labels?: Record<string, string> | null;
	/** The resource name of the WebApp, in the format: projects/PROJECT_IDENTIFIER /webApps/APP_ID * PROJECT_IDENTIFIER: the parent Project's `ProjectNumber` ***(recommended)*** or its `ProjectId`. */
	name?: string | null;
	/** Output only. Immutable. The globally unique, Firebase-assigned identifier for the `WebApp`. This identifier should be treated as an opaque token, as the data format is not specified. */
	appId?: string | null;
	/** Output only. Immutable. A unique, Firebase-assigned identifier for the `WebApp`. This identifier is only used to populate the `namespace` value for the `WebApp`. For most use cases, use `appId` to identify or reference the App. */
	webId?: string | null;
	/** The globally unique, Google-assigned identifier (UID) for the Firebase API key associated with the `WebApp`. */
	apiKeyId?: string | null;
	/** Output only. If the App has been removed from the Project, this is the timestamp of when the App is considered expired and will be permanently deleted. After this time, the App cannot be undeleted (that is, restored to the Project). This value is only provided if the App is in the `DELETED` state. */
	expireTime?: string | null;
	/** Output only. The lifecycle state of the App. */
	state?: string | null;
	/** This checksum is computed by the server based on the value of other fields, and it may be sent with update requests to ensure the client has an up-to-date value before proceeding. Learn more about `etag` in Google's [AIP-154 standard](https://google.aip.dev/154#declarative-friendly-resources). */
	etag?: string | null;
	/** The user-assigned display name for the `WebApp`. */
	displayName?: string | null;
};

/** Configuration metadata of a single Firebase App for the web. */
export type FirebaseWebAppConfig = {
	/** Immutable. A user-assigned unique identifier for the `FirebaseProject`. */
	projectId?: string | null;
	/** Version of the config specification. */
	version?: string | null;
	/** **DEPRECATED.** _Instead, find the name of the default Cloud Storage for Firebase bucket using the [list endpoint](https://firebase.google.com/docs/reference/rest/storage/rest/v1beta/projects.buckets/list) within the Cloud Storage for Firebase REST API. */
	storageBucket?: string | null;
	/** Immutable. The globally unique, Firebase-assigned identifier for the `WebApp`. */
	appId?: string | null;
	/** The [`keyString`](https://cloud.google.com/api-keys/docs/reference/rest/v2/projects.locations.keys#Key.FIELDS.key_string) of the API key associated with the `WebApp`. Note that this value is _not_ the `apiKeyId` (the UID) of the API key associated with the `WebApp`. */
	apiKey?: string | null;
	/** **DEPRECATED.** _Instead, use product-specific REST APIs to find the location of each resource in a Project. */
	locationId?: string | null;
	/** The domain Firebase Auth configures for OAuth redirects, in the format: PROJECT_ID.firebaseapp.com */
	authDomain?: string | null;
	/** The sender ID for use with Firebase Cloud Messaging. */
	messagingSenderId?: string | null;
	/** **DEPRECATED.** _Instead, find the URL of the default Realtime Database instance using the [list endpoint](https://firebase.google.com/docs/reference/rest/database/database-management/rest/v1beta/projects.locations.instances/list) within the Firebase Realtime Database REST API. */
	databaseURL?: string | null;
	/** Output only. Immutable. The globally unique, Google-assigned canonical identifier for the Project. Use this identifier when configuring integrations and/or making API calls to Google Cloud or third-party services. */
	projectNumber?: string | null;
	/** Optional. Recaptcha Enterprise site key associated with the Firebase App. */
	recaptchaSiteKey?: string | null;
	/** Optional. Duplicate field for the URL of the default Realtime Database instances (if the default instance has been provisioned). If the request asks for the V2 config format, this field will be populated instead of `realtime_database_instance_uri`. */
	realtimeDatabaseUrl?: string | null;
	/** The unique Google-assigned identifier of the Google Analytics web stream associated with the `WebApp`. Firebase SDKs use this ID to interact with Google Analytics APIs. This field is only present if the `WebApp` is linked to a web stream in a Google Analytics App + Web property. */
	measurementId?: string | null;
};

/** [Webpush protocol](https://tools.ietf.org/html/rfc8030) options. */
export type FirebaseWebpushConfig = {
	/** Arbitrary key/value payload. If present, it will override google.firebase.fcm.v1.Message.data. */
	data?: Record<string, string> | null;
	/** Options for features provided by the FCM SDK for Web. */
	fcmOptions?: FirebaseWebpushFcmOptions | null;
	/** HTTP headers defined in webpush protocol. Refer to [Webpush protocol](https://tools.ietf.org/html/rfc8030#section-5) for supported headers, e.g. "TTL": "15". */
	headers?: Record<string, string> | null;
	/** Web Notification options as a JSON object. Supports Notification instance properties as defined in [Web Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notification). */
	notification?: Record<string, FirebaseJsonValue> | null;
};

/** Options for features provided by the FCM SDK for Web. */
export type FirebaseWebpushFcmOptions = {
	/** Label associated with the message's analytics data. */
	analyticsLabel?: string | null;
	/** The link to open when the user clicks on the notification. For all URL values, HTTPS is required. */
	link?: string | null;
};

/** The result of applying a write. */
export type FirebaseWriteResult = {
	/** The last update time of the document after applying the write. Not set after a `delete`. If the write did not actually change the document, this will be the previous update_time. */
	updateTime?: string | null;
	/** The results of applying each DocumentTransform.FieldTransform, in the same order. */
	transformResults?: Array<FirebaseValue> | null;
};

/** A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); } */
export type FirebaseAppCheckGoogleProtobufEmpty = Record<
	string,
	FirebaseJsonValue
>;

/** The response message for Operations.ListOperations. */
export type FirebaseAppDistributionGoogleLongrunningListOperationsResponse = {
	/** A list of operations that matches the specified filter in the request. */
	operations?: Array<FirebaseAppDistributionGoogleLongrunningOperation> | null;
	/** The standard List next-page token. */
	nextPageToken?: string | null;
	/** Unordered list. Unreachable resources. Populated when the request sets `ListOperationsRequest.return_partial_success` and reads across collections. For example, when attempting to list all resources across all supported locations. */
	unreachable?: Array<string> | null;
};

/** This resource represents a long-running operation that is the result of a network API call. */
export type FirebaseAppDistributionGoogleLongrunningOperation = {
	/** Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any. */
	metadata?: Record<string, FirebaseJsonValue> | null;
	/** The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id}`. */
	name?: string | null;
	/** If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available. */
	done?: boolean | null;
	/** The error result of the operation in case of failure or cancellation. */
	error?: FirebaseAppDistributionGoogleRpcStatus | null;
	/** The normal, successful response of the operation. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. */
	response?: Record<string, FirebaseJsonValue> | null;
};

/** A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); } */
export type FirebaseAppDistributionGoogleProtobufEmpty = Record<
	string,
	FirebaseJsonValue
>;

/** The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. */
export type FirebaseAppDistributionGoogleRpcStatus = {
	/** A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client. */
	message?: string | null;
	/** The status code, which should be an enum value of google.rpc.Code. */
	code?: number | null;
	/** A list of messages that carry the error details. There is a common set of message types for APIs to use. */
	details?: Array<Record<string, FirebaseJsonValue>> | null;
};

/** A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); } */
export type FirebaseAuthAdminGoogleProtobufEmpty = Record<
	string,
	FirebaseJsonValue
>;

/** The response message for Operations.ListOperations. */
export type FirebaseFirestoreGoogleLongrunningListOperationsResponse = {
	/** Unordered list. Unreachable resources. Populated when the request sets `ListOperationsRequest.return_partial_success` and reads across collections. For example, when attempting to list all resources across all supported locations. */
	unreachable?: Array<string> | null;
	/** The standard List next-page token. */
	nextPageToken?: string | null;
	/** A list of operations that matches the specified filter in the request. */
	operations?: Array<FirebaseFirestoreGoogleLongrunningOperation> | null;
};

/** This resource represents a long-running operation that is the result of a network API call. */
export type FirebaseFirestoreGoogleLongrunningOperation = {
	/** The normal, successful response of the operation. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. */
	response?: Record<string, FirebaseJsonValue> | null;
	/** The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id}`. */
	name?: string | null;
	/** Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any. */
	metadata?: Record<string, FirebaseJsonValue> | null;
	/** If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available. */
	done?: boolean | null;
	/** The error result of the operation in case of failure or cancellation. */
	error?: FirebaseFirestoreStatus | null;
};

/** A resource that represents a Google Cloud location. */
export type FirebaseFirestoreLocation = {
	/** The friendly name for this location, typically a nearby city name. For example, "Tokyo". */
	displayName?: string | null;
	/** The canonical id for this location. For example: `"us-east1"`. */
	locationId?: string | null;
	/** Cross-service attributes for the location. For example {"cloud.googleapis.com/region": "us-east1"} */
	labels?: Record<string, string> | null;
	/** Service-specific metadata. For example the available capacity at the given location. */
	metadata?: Record<string, FirebaseJsonValue> | null;
	/** Resource name for the location, which may vary between implementations. For example: `"projects/example-project/locations/us-east1"` */
	name?: string | null;
};

/** The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. */
export type FirebaseFirestoreStatus = {
	/** A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client. */
	message?: string | null;
	/** A list of messages that carry the error details. There is a common set of message types for APIs to use. */
	details?: Array<Record<string, FirebaseJsonValue>> | null;
	/** The status code, which should be an enum value of google.rpc.Code. */
	code?: number | null;
};

export type FirebaseHostingListReleasesResponse = {
	/** The list of hashes of files that still need to be uploaded, if any exist. */
	releases?: Array<FirebaseHostingRelease> | null;
	/** The pagination token, if more results exist beyond the ones in this response. Include this token in your next call to `ListReleases`. Page tokens are short-lived and should not be stored. */
	nextPageToken?: string | null;
};

export type FirebaseHostingListVersionsResponse = {
	/** The list of versions, if any exist. */
	versions?: Array<FirebaseHostingVersion> | null;
	/** The pagination token, if more results exist beyond the ones in this response. Include this token in your next call to `ListVersions`. Page tokens are short-lived and should not be stored. */
	nextPageToken?: string | null;
};

/** This resource represents a long-running operation that is the result of a network API call. */
export type FirebaseHostingOperation = {
	/** The error result of the operation in case of failure or cancellation. */
	error?: FirebaseHostingStatus | null;
	/** If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available. */
	done?: boolean | null;
	/** The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id}`. */
	name?: string | null;
	/** Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any. */
	metadata?: Record<string, FirebaseJsonValue> | null;
	/** The normal, successful response of the operation. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. */
	response?: Record<string, FirebaseJsonValue> | null;
};

/** A `Release` is a particular collection of configurations and files that is set to be public at a particular time. */
export type FirebaseHostingRelease = {
	/** Output only. The unique identifier for the release, in either of the following formats: - sites/SITE_ID/releases/RELEASE_ID - sites/SITE_ID/channels/CHANNEL_ID/releases/RELEASE_ID This name is provided in the response body when you call `releases.create` or `channels.releases.create`. */
	name?: string | null;
	/** Output only. The configuration and content that was released. */
	version?: FirebaseHostingVersion | null;
	/** The deploy description when the release was created. The value can be up to 512 characters. */
	message?: string | null;
	/** Output only. The time at which the version is set to be public. */
	releaseTime?: string | null;
	/** Output only. Identifies the user who created the release. */
	releaseUser?: FirebaseActingUser | null;
	/** Explains the reason for the release. Specify a value for this field only when creating a `SITE_DISABLE` type release. */
	type?: string | null;
};

/** The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. */
export type FirebaseHostingStatus = {
	/** A list of messages that carry the error details. There is a common set of message types for APIs to use. */
	details?: Array<Record<string, FirebaseJsonValue>> | null;
	/** A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client. */
	message?: string | null;
	/** The status code, which should be an enum value of google.rpc.Code. */
	code?: number | null;
};

/** A `Version` is a configuration and a collection of static files which determine how a site is displayed. */
export type FirebaseHostingVersion = {
	/** Output only. Identifies the user who created the version. */
	createUser?: FirebaseActingUser | null;
	/** The deploy status of the version. For a successful deploy, call `CreateVersion` to make a new version (`CREATED` status), upload all desired files to the version, then update the version to the `FINALIZED` status. */
	status?: string | null;
	/** The labels used for extra metadata and/or filtering. */
	labels?: Record<string, string> | null;
	/** Output only. The time at which the version was `DELETED`. */
	deleteTime?: string | null;
	/** Output only. The time at which the version was created. */
	createTime?: string | null;
	/** The fully-qualified resource name for the version, in the format: sites/ SITE_ID/versions/VERSION_ID This name is provided in the response body when you call `CreateVersion`. */
	name?: string | null;
	/** Output only. The total number of files associated with the version. This value is calculated after a version is `FINALIZED`. */
	fileCount?: (string | number) | null;
	/** Output only. Identifies the user who `DELETED` the version. */
	deleteUser?: FirebaseActingUser | null;
	/** Output only. Identifies the user who `FINALIZED` the version. */
	finalizeUser?: FirebaseActingUser | null;
	/** Output only. The time at which the version was `FINALIZED`. */
	finalizeTime?: string | null;
	/** Output only. The total stored bytesize of the version. This value is calculated after a version is `FINALIZED`. */
	versionBytes?: (string | number) | null;
	/** The configuration for the behavior of the site. This configuration exists in the [`firebase.json`](https://firebase.google.com/docs/cli/#the_firebasejson_file) file. */
	config?: FirebaseServingConfig | null;
};

/** This resource represents a long-running operation that is the result of a network API call. */
export type FirebaseManagementOperation = {
	/** If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available. */
	done?: boolean | null;
	/** The error result of the operation in case of failure or cancellation. */
	error?: FirebaseManagementStatus | null;
	/** The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id}`. */
	name?: string | null;
	/** Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any. */
	metadata?: Record<string, FirebaseJsonValue> | null;
	/** The normal, successful response of the operation. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. */
	response?: Record<string, FirebaseJsonValue> | null;
};

/** The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. */
export type FirebaseManagementStatus = {
	/** A list of messages that carry the error details. There is a common set of message types for APIs to use. */
	details?: Array<Record<string, FirebaseJsonValue>> | null;
	/** The status code, which should be an enum value of google.rpc.Code. */
	code?: number | null;
	/** A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client. */
	message?: string | null;
};

/** Basic notification template to use across all platforms. */
export type FirebaseMessagingNotification = {
	/** Contains the URL of an image that is going to be downloaded on the device and displayed in a notification. JPEG, PNG, BMP have full support across platforms. Animated GIF and video only work on iOS. WebP and HEIF have varying levels of support across platforms and platform versions. */
	image?: string | null;
	/** The notification's body text. */
	body?: string | null;
	/** The notification's title. */
	title?: string | null;
};

/** Contains a paginated list of versions of the RemoteConfig. */
export type FirebaseRemoteConfigListVersionsResponse = {
	/** Token to retrieve the next page of results, or empty if there are no more results in the list. */
	nextPageToken?: string | null;
	/** A list of version metadata objects, sorted in reverse chronological order. */
	versions?: Array<FirebaseRemoteConfigVersion> | null;
};

/** Contains all metadata about a particular version of the Remote Config template. All fields are set at the time the specified Remote Config template was written. */
export type FirebaseRemoteConfigVersion = {
	/** Output only. Only present if this version is the result of a rollback, and will be the version number of the Remote Config template that was rolled-back to. */
	rollbackSource?: (string | number) | null;
	/** Optional. The user-provided description of the corresponding Remote Config template */
	description?: string | null;
	/** Output only. Aggregation of all metadata fields about the account that performed the update. */
	updateUser?: FirebaseRemoteConfigUser | null;
	/** Output only. What type of update was made. */
	updateType?: string | null;
	/** Output only. `True` if this Remote Config template was published before version history was supported. */
	isLegacy?: boolean | null;
	/** Output only. The version number of the version's corresponding Remote Config template. */
	versionNumber?: (string | number) | null;
	/** Output only. Where the update action originated. */
	updateOrigin?: string | null;
	/** Output only. When the Remote Config template was written to the Remote Config server. */
	updateTime?: string | null;
};

/** The response for FirebaseRulesService.ListReleases. */
export type FirebaseRulesListReleasesResponse = {
	/** List of `Release` instances. */
	releases?: Array<FirebaseRulesRelease> | null;
	/** The pagination token to retrieve the next page of results. If the value is empty, no further results remain. */
	nextPageToken?: string | null;
};

/** `Release` is a named reference to a `Ruleset`. Once a `Release` refers to a `Ruleset`, rules-enabled services will be able to enforce the `Ruleset`. */
export type FirebaseRulesRelease = {
	/** Required. Format: `projects/{project_id}/releases/{release_id}` */
	name?: string | null;
	/** Output only. Time the release was created. */
	createTime?: string | null;
	/** Output only. Time the release was updated. */
	updateTime?: string | null;
	/** Required. Name of the `Ruleset` referred to by this `Release`. The `Ruleset` must exist for the `Release` to be created. */
	rulesetName?: string | null;
};

/** A bucket. */
export type FirebaseStorageBucket = {
	/** Access controls on the bucket. */
	acl?: Array<FirebaseBucketAccessControl> | null;
	/** The bucket's billing configuration. */
	billing?: {
		/** When set to true, Requester Pays is enabled for this bucket. */
		requesterPays?: boolean | null;
	} | null;
	/** The bucket's Cross-Origin Resource Sharing (CORS) configuration. */
	cors?: Array<{
		/** The value, in seconds, to return in the Access-Control-Max-Age header used in preflight responses. */
		maxAgeSeconds?: number | null;
		/** The list of HTTP methods on which to include CORS response headers, (GET, OPTIONS, POST, etc) Note: "*" is permitted in the list of methods, and means "any method". */
		method?: Array<string> | null;
		/** The list of Origins eligible to receive CORS response headers. Note: "*" is permitted in the list of origins, and means "any Origin". */
		origin?: Array<string> | null;
		/** The list of HTTP headers other than the simple response headers to give permission for the user-agent to share across domains. */
		responseHeader?: Array<string> | null;
	}> | null;
	/** The bucket's custom placement configuration for Custom Dual Regions. */
	customPlacementConfig?: {
		/** The list of regional locations in which data is placed. */
		dataLocations?: Array<string> | null;
	} | null;
	/** The default value for event-based hold on newly created objects in this bucket. Event-based hold is a way to retain objects indefinitely until an event occurs, signified by the hold's release. After being released, such objects will be subject to bucket-level retention (if any). */
	defaultEventBasedHold?: boolean | null;
	/** Default access controls to apply to new objects when no ACL is provided. */
	defaultObjectAcl?: Array<FirebaseObjectAccessControl> | null;
	/** Encryption configuration for a bucket. */
	encryption?: {
		/** A Cloud KMS key that will be used to encrypt objects inserted into this bucket, if no encryption method is specified. */
		defaultKmsKeyName?: string | null;
		/** If set, the new objects created in this bucket must comply with this enforcement config. Changing this has no effect on existing objects; it applies to new objects only. If omitted, the new objects are allowed to be encrypted with Google Managed Encryption type by default. */
		googleManagedEncryptionEnforcementConfig?: {
			/** Restriction mode for Google-Managed Encryption Keys. Defaults to NotRestricted. */
			restrictionMode?: string | null;
			/** Server-determined value that indicates the time from which configuration was enforced and effective. This value is in RFC 3339 format. */
			effectiveTime?: string | null;
		} | null;
		/** If set, the new objects created in this bucket must comply with this enforcement config. Changing this has no effect on existing objects; it applies to new objects only. If omitted, the new objects are allowed to be encrypted with Customer Managed Encryption type by default. */
		customerManagedEncryptionEnforcementConfig?: {
			/** Restriction mode for Customer-Managed Encryption Keys. Defaults to NotRestricted. */
			restrictionMode?: string | null;
			/** Server-determined value that indicates the time from which configuration was enforced and effective. This value is in RFC 3339 format. */
			effectiveTime?: string | null;
		} | null;
		/** If set, the new objects created in this bucket must comply with this enforcement config. Changing this has no effect on existing objects; it applies to new objects only. If omitted, the new objects are allowed to be encrypted with Customer Supplied Encryption type by default. */
		customerSuppliedEncryptionEnforcementConfig?: {
			/** Restriction mode for Customer-Supplied Encryption Keys. Defaults to NotRestricted. */
			restrictionMode?: string | null;
			/** Server-determined value that indicates the time from which configuration was enforced and effective. This value is in RFC 3339 format. */
			effectiveTime?: string | null;
		} | null;
	} | null;
	/** HTTP 1.1 Entity tag for the bucket. */
	etag?: string | null;
	/** The bucket's hierarchical namespace configuration. */
	hierarchicalNamespace?: {
		/** When set to true, hierarchical namespace is enabled for this bucket. */
		enabled?: boolean | null;
	} | null;
	/** The bucket's IAM configuration. */
	iamConfiguration?: {
		/** The bucket's uniform bucket-level access configuration. The feature was formerly known as Bucket Policy Only. For backward compatibility, this field will be populated with identical information as the uniformBucketLevelAccess field. */
		bucketPolicyOnly?: {
			/** If set, access is controlled only by bucket-level or above IAM policies. */
			enabled?: boolean | null;
			/** The deadline for changing iamConfiguration.bucketPolicyOnly.enabled from true to false in RFC 3339 format. iamConfiguration.bucketPolicyOnly.enabled may be changed from true to false until the locked time, after which the field is immutable. */
			lockedTime?: string | null;
		} | null;
		/** The bucket's uniform bucket-level access configuration. */
		uniformBucketLevelAccess?: {
			/** If set, access is controlled only by bucket-level or above IAM policies. */
			enabled?: boolean | null;
			/** The deadline for changing iamConfiguration.uniformBucketLevelAccess.enabled from true to false in RFC 3339 format. iamConfiguration.uniformBucketLevelAccess.enabled may be changed from true to false until the locked time, after which the field is immutable. */
			lockedTime?: string | null;
		} | null;
		/** The bucket's Public Access Prevention configuration. Currently, 'inherited' and 'enforced' are supported. */
		publicAccessPrevention?: string | null;
	} | null;
	/** The ID of the bucket. For buckets, the id and name properties are the same. */
	id?: string | null;
	/** The bucket's IP filter configuration. Specifies the network sources that are allowed to access the operations on the bucket, as well as its underlying objects. Only enforced when the mode is set to 'Enabled'. */
	ipFilter?: {
		/** The mode of the IP filter. Valid values are 'Enabled' and 'Disabled'. */
		mode?: string | null;
		/** The public network source of the bucket's IP filter. */
		publicNetworkSource?: {
			/** The list of public IPv4, IPv6 cidr ranges that are allowed to access the bucket. */
			allowedIpCidrRanges?: Array<string> | null;
		} | null;
		/** The list of [VPC network](https://cloud.google.com/vpc/docs/vpc) sources of the bucket's IP filter. */
		vpcNetworkSources?: Array<{
			/** Name of the network. Format: projects/{PROJECT_ID}/global/networks/{NETWORK_NAME} */
			network?: string | null;
			/** The list of IPv4, IPv6 cidr ranges subnetworks that are allowed to access the bucket. */
			allowedIpCidrRanges?: Array<string> | null;
		}> | null;
		/** Whether to allow cross-org VPCs in the bucket's IP filter configuration. */
		allowCrossOrgVpcs?: boolean | null;
		/** Whether to allow all service agents to access the bucket regardless of the IP filter configuration. */
		allowAllServiceAgentAccess?: boolean | null;
	} | null;
	/** The kind of item this is. For buckets, this is always storage#bucket. */
	kind?: string | null;
	/** User-provided labels, in key/value pairs. */
	labels?: Record<string, string> | null;
	/** The bucket's lifecycle configuration. See [Lifecycle Management](https://cloud.google.com/storage/docs/lifecycle) for more information. */
	lifecycle?: {
		/** A lifecycle management rule, which is made of an action to take and the condition(s) under which the action will be taken. */
		rule?: Array<{
			/** The action to take. */
			action?: {
				/** Target storage class. Required iff the type of the action is SetStorageClass. */
				storageClass?: string | null;
				/** Type of the action. Currently, only Delete, SetStorageClass, and AbortIncompleteMultipartUpload are supported. */
				type?: string | null;
			} | null;
			/** The condition(s) under which the action will be taken. */
			condition?: {
				/** Age of an object (in days). This condition is satisfied when an object reaches the specified age. */
				age?: number | null;
				/** A date in RFC 3339 format with only the date part (for instance, "2013-01-15"). This condition is satisfied when an object is created before midnight of the specified date in UTC. */
				createdBefore?: string | null;
				/** A date in RFC 3339 format with only the date part (for instance, "2013-01-15"). This condition is satisfied when the custom time on an object is before this date in UTC. */
				customTimeBefore?: string | null;
				/** Number of days elapsed since the user-specified timestamp set on an object. The condition is satisfied if the days elapsed is at least this number. If no custom timestamp is specified on an object, the condition does not apply. */
				daysSinceCustomTime?: number | null;
				/** Number of days elapsed since the noncurrent timestamp of an object. The condition is satisfied if the days elapsed is at least this number. This condition is relevant only for versioned objects. The value of the field must be a nonnegative integer. */
				daysSinceNoncurrentTime?: number | null;
				/** Relevant only for versioned objects. If the value is true, this condition matches live objects; if the value is false, it matches archived objects. */
				isLive?: boolean | null;
				/** A regular expression that satisfies the RE2 syntax. This condition is satisfied when the name of the object matches the RE2 pattern. */
				matchesPattern?: string | null;
				/** List of object name prefixes. This condition will be satisfied when at least one of the prefixes exactly matches the beginning of the object name. */
				matchesPrefix?: Array<string> | null;
				/** List of object name suffixes. This condition will be satisfied when at least one of the suffixes exactly matches the end of the object name. */
				matchesSuffix?: Array<string> | null;
				/** Objects having any of the storage classes specified by this condition will be matched. Values include MULTI_REGIONAL, REGIONAL, NEARLINE, COLDLINE, ARCHIVE, STANDARD, and DURABLE_REDUCED_AVAILABILITY. */
				matchesStorageClass?: Array<string> | null;
				/** A date in RFC 3339 format with only the date part (for instance, "2013-01-15"). This condition is satisfied when the noncurrent time on an object is before this date in UTC. This condition is relevant only for versioned objects. */
				noncurrentTimeBefore?: string | null;
				/** Objects having a size greater than this value in bytes will be matched. */
				sizeAboveBytes?: (string | number) | null;
				/** Objects having a size less than this value in bytes will be matched. */
				sizeBelowBytes?: (string | number) | null;
				/** Relevant only for versioned objects. If the value is N, this condition is satisfied when there are at least N versions (including the live version) newer than this version of the object. */
				numNewerVersions?: number | null;
			} | null;
		}> | null;
	} | null;
	/** The bucket's Autoclass configuration. */
	autoclass?: {
		/** Whether or not Autoclass is enabled on this bucket */
		enabled?: boolean | null;
		/** A date and time in RFC 3339 format representing the instant at which "enabled" was last toggled. */
		toggleTime?: string | null;
		/** The storage class that objects in the bucket eventually transition to if they are not read for a certain length of time. Valid values are NEARLINE and ARCHIVE. */
		terminalStorageClass?: string | null;
		/** A date and time in RFC 3339 format representing the time of the most recent update to "terminalStorageClass". */
		terminalStorageClassUpdateTime?: string | null;
	} | null;
	/** The location of the bucket. Object data for objects in the bucket resides in physical storage within this region. Defaults to US. See the [Developer's Guide](https://cloud.google.com/storage/docs/locations) for the authoritative list. */
	location?: string | null;
	/** The type of the bucket location. */
	locationType?: string | null;
	/** The bucket's logging configuration, which defines the destination bucket and optional name prefix for the current bucket's logs. */
	logging?: {
		/** The destination bucket where the current bucket's logs should be placed. */
		logBucket?: string | null;
		/** A prefix for log object names. */
		logObjectPrefix?: string | null;
	} | null;
	/** The generation of this bucket. */
	generation?: (string | number) | null;
	/** The metadata generation of this bucket. */
	metageneration?: (string | number) | null;
	/** The name of the bucket. */
	name?: string | null;
	/** The owner of the bucket. This is always the project team's owner group. */
	owner?: {
		/** The entity, in the form project-owner-projectId. */
		entity?: string | null;
		/** The ID for the entity. */
		entityId?: string | null;
	} | null;
	/** The project number of the project the bucket belongs to. */
	projectNumber?: (string | number) | null;
	/** The bucket's retention policy. The retention policy enforces a minimum retention time for all objects contained in the bucket, based on their creation time. Any attempt to overwrite or delete objects younger than the retention period will result in a PERMISSION_DENIED error. */
	retentionPolicy?: {
		/** Server-determined value that indicates the time from which policy was enforced and effective. This value is in RFC 3339 format. */
		effectiveTime?: string | null;
		/** Once locked, an object retention policy cannot be modified. */
		isLocked?: boolean | null;
		/** The duration in seconds that objects need to be retained. Retention duration must be greater than zero and less than 100 years. Note that enforcement of retention periods less than a day is not guaranteed. Such periods should only be used for testing purposes. */
		retentionPeriod?: (string | number) | null;
	} | null;
	/** The bucket's object retention config. */
	objectRetention?: {
		/** The bucket's object retention mode. Can be Enabled. */
		mode?: string | null;
	} | null;
	/** The Recovery Point Objective (RPO) of this bucket. Set to ASYNC_TURBO to turn on Turbo Replication on a bucket. */
	rpo?: string | null;
	/** The URI of this bucket. */
	selfLink?: string | null;
	/** The bucket's soft delete policy, which defines the period of time that soft-deleted objects will be retained, and cannot be permanently deleted. */
	softDeletePolicy?: {
		/** The duration in seconds that soft-deleted objects in the bucket will be retained and cannot be permanently deleted. */
		retentionDurationSeconds?: (string | number) | null;
		/** Server-determined value that indicates the time from which the policy, or one with a greater retention, was effective. This value is in RFC 3339 format. */
		effectiveTime?: string | null;
		/** The bucket's hard delete pause configuration. If set, soft-deleted objects in the bucket will not be permanently deleted until the hard delete pause is disabled. */
		hardDeletePause?: {
			/** Whether hard deletions are paused. */
			enabled?: boolean | null;
			/** Server-determined value that indicates the time from which the hard delete pause became effective. This value is in RFC 3339 format. */
			effectiveTime?: string | null;
		} | null;
	} | null;
	/** The bucket's default storage class, used whenever no storageClass is specified for a newly-created object. This defines how objects in the bucket are stored and determines the SLA and the cost of storage. */
	storageClass?: string | null;
	/** The creation time of the bucket in RFC 3339 format. */
	timeCreated?: string | null;
	/** The modification time of the bucket in RFC 3339 format. */
	updated?: string | null;
	/** The soft delete time of the bucket in RFC 3339 format. */
	softDeleteTime?: string | null;
	/** The hard delete time of the bucket in RFC 3339 format. */
	hardDeleteTime?: string | null;
	/** The bucket's versioning configuration. */
	versioning?: {
		/** While set to true, versioning is fully enabled for this bucket. */
		enabled?: boolean | null;
	} | null;
	/** The bucket's website configuration, controlling how the service behaves when accessing bucket contents as a web site. See the [Static Website Examples](https://cloud.google.com/storage/docs/static-website) for more information. */
	website?: {
		/** If the requested object path is missing, the service will ensure the path has a trailing '/', append this suffix, and attempt to retrieve the resulting object. This allows the creation of index.html objects to represent directory pages. */
		mainPageSuffix?: string | null;
		/** If the requested object path is missing, and any mainPageSuffix object is missing, if applicable, the service will return the named object from this bucket as the content for a 404 Not Found result. */
		notFoundPage?: string | null;
	} | null;
	/** Reserved for future use. */
	satisfiesPZS?: boolean | null;
	/** Reserved for future use. */
	satisfiesPZI?: boolean | null;
};

/** The response message for storage.buckets.operations.list. */
export type FirebaseStorageGoogleLongrunningListOperationsResponse = {
	/** The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results. */
	nextPageToken?: string | null;
	/** A list of operations that matches the specified filter in the request. */
	operations?: Array<FirebaseStorageGoogleLongrunningOperation> | null;
	/** The kind of item this is. For lists of operations, this is always storage#operations. */
	kind?: string | null;
};

/** This resource represents a long-running operation that is the result of a network API call. */
export type FirebaseStorageGoogleLongrunningOperation = {
	/** If the value is "false", it means the operation is still in progress. If "true", the operation is completed, and either "error" or "response" is available. */
	done?: boolean | null;
	/** The error result of the operation in case of failure or cancellation. */
	error?: FirebaseStorageGoogleRpcStatus | null;
	/** Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any. */
	metadata?: Record<string, FirebaseJsonValue> | null;
	/** The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the "name" should be a resource name ending with "operations/{operationId}". */
	name?: string | null;
	/** The normal response of the operation in case of success. If the original method returns no data on success, such as "Delete", the response is google.protobuf.Empty. If the original method is standard Get/Create/Update, the response should be the resource. */
	response?: Record<string, FirebaseJsonValue> | null;
	/** The link to this long running operation. */
	selfLink?: string | null;
	/** The kind of item this is. For operations, this is always storage#operation. */
	kind?: string | null;
};

/** The "Status" type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each "Status" message contains three pieces of data: error code, error message, and error details. */
export type FirebaseStorageGoogleRpcStatus = {
	/** The status code, which should be an enum value of google.rpc.Code. */
	code?: number | null;
	/** A list of messages that carry the error details. There is a common set of message types for APIs to use. */
	details?: Array<Record<string, FirebaseJsonValue>> | null;
	/** A developer-facing error message, which should be in English. */
	message?: string | null;
};

/** A storage bucket and its relation to a parent Firebase project. */
export type FirebaseStorageBucketsBucket = {
	/** Output only. Resource name of the bucket. */
	name?: string | null;
};

export type FirebaseOperationInputs = {
	'appCheck.apps.appAttestConfig.batchGet': {
		/** Required. The parent project name shared by all AppAttestConfigs being retrieved, in the format ``` projects/{project_number} ``` The parent collection in the `name` field of any resource being retrieved must match this field, or the entire batch fails. Format: `projects/<id>`. */
		parent: string;
		/** Required. The relative resource names of the AppAttestConfigs to retrieve, in the format ``` projects/{project_number}/apps/{app_id}/appAttestConfig ``` A maximum of 100 objects can be retrieved in a batch. */
		names: Array<string>;
	};
	'appCheck.apps.appAttestConfig.get': {
		/** Required. The relative resource name of the AppAttestConfig, in the format: ``` projects/{project_number}/apps/{app_id}/appAttestConfig ``` Format: `projects/<id>/apps/<id>/appAttestConfig`. */
		name: string;
	};
	'appCheck.apps.appAttestConfig.patch': {
		/** Required. The relative resource name of the App Attest configuration object, in the format: ``` projects/{project_number}/apps/{app_id}/appAttestConfig ``` Format: `projects/<id>/apps/<id>/appAttestConfig`. */
		name: string;
		/** Required. A comma-separated list of names of fields in the AppAttestConfig to update. Example: `token_ttl`. */
		updateMask: string;
		/** Required. The relative resource name of the App Attest configuration object, in the format: ``` projects/{project_number}/apps/{app_id}/appAttestConfig ``` */
		body_name?: string;
		/** Specifies the duration for which App Check tokens exchanged from App Attest artifacts will be valid. If unset, a default value of 1 hour is assumed. Must be between 30 minutes and 7 days, inclusive. */
		tokenTtl?: string;
	};
	'appCheck.apps.debugTokens.create': {
		/** Required. The relative resource name of the parent app in which the specified DebugToken will be created, in the format: ``` projects/{project_number}/apps/{app_id} ``` Format: `projects/<id>/apps/<id>`. */
		parent: string;
		/** Required. A human readable display name used to identify this debug token. */
		displayName?: string;
		/** Required. The relative resource name of the debug token, in the format: ``` projects/{project_number}/apps/{app_id}/debugTokens/{debug_token_id} ``` */
		name?: string;
		/** Required. Input only. Immutable. The secret token itself. Must be provided during creation, and must be a UUID4, case insensitive. This field is immutable once set, and cannot be provided during a UpdateDebugToken request. */
		token?: string;
		/** Optional. This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding. This etag is strongly validated as defined by RFC 7232. */
		etag?: string;
	};
	'appCheck.apps.debugTokens.delete': {
		/** Required. The relative resource name of the DebugToken to delete, in the format: ``` projects/{project_number}/apps/{app_id}/debugTokens/{debug_token_id} ``` Format: `projects/<id>/apps/<id>/debugTokens/<id>`. */
		name: string;
		/** Optional. The checksum to be validated against the current DebugToken, to ensure the client has an up-to-date value before proceeding. */
		etag?: string;
	};
	'appCheck.apps.debugTokens.get': {
		/** Required. The relative resource name of the debug token, in the format: ``` projects/{project_number}/apps/{app_id}/debugTokens/{debug_token_id} ``` Format: `projects/<id>/apps/<id>/debugTokens/<id>`. */
		name: string;
	};
	'appCheck.apps.debugTokens.list': {
		/** Required. The relative resource name of the parent app for which to list each associated DebugToken, in the format: ``` projects/{project_number}/apps/{app_id} ``` Format: `projects/<id>/apps/<id>`. */
		parent: string;
		/** Token returned from a previous call to ListDebugTokens indicating where in the set of DebugTokens to resume listing. Provide this to retrieve the subsequent page. */
		pageToken?: string;
		/** The maximum number of DebugTokens to return in the response. Note that an app can have at most 20 debug tokens. The server may return fewer than this at its own discretion. If no value is specified (or too large a value is specified), the server will impose its own limit. */
		pageSize?: number;
	};
	'appCheck.apps.debugTokens.patch': {
		/** Required. The relative resource name of the debug token, in the format: ``` projects/{project_number}/apps/{app_id}/debugTokens/{debug_token_id} ``` Format: `projects/<id>/apps/<id>/debugTokens/<id>`. */
		name: string;
		/** Required. A comma-separated list of names of fields in the DebugToken to update. Example: `display_name`. */
		updateMask: string;
		/** Required. A human readable display name used to identify this debug token. */
		displayName?: string;
		/** Required. The relative resource name of the debug token, in the format: ``` projects/{project_number}/apps/{app_id}/debugTokens/{debug_token_id} ``` */
		body_name?: string;
		/** Required. Input only. Immutable. The secret token itself. Must be provided during creation, and must be a UUID4, case insensitive. This field is immutable once set, and cannot be provided during a UpdateDebugToken request. */
		token?: string;
		/** Optional. This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding. This etag is strongly validated as defined by RFC 7232. */
		etag?: string;
	};
	'appCheck.apps.deviceCheckConfig.batchGet': {
		/** Required. The relative resource names of the DeviceCheckConfigs to retrieve, in the format ``` projects/{project_number}/apps/{app_id}/deviceCheckConfig ``` A maximum of 100 objects can be retrieved in a batch. */
		names: Array<string>;
		/** Required. The parent project name shared by all DeviceCheckConfigs being retrieved, in the format ``` projects/{project_number} ``` The parent collection in the `name` field of any resource being retrieved must match this field, or the entire batch fails. Format: `projects/<id>`. */
		parent: string;
	};
	'appCheck.apps.deviceCheckConfig.get': {
		/** Required. The relative resource name of the DeviceCheckConfig, in the format: ``` projects/{project_number}/apps/{app_id}/deviceCheckConfig ``` Format: `projects/<id>/apps/<id>/deviceCheckConfig`. */
		name: string;
	};
	'appCheck.apps.deviceCheckConfig.patch': {
		/** Required. A comma-separated list of names of fields in the DeviceCheckConfig to update. Example: `key_id,private_key`. */
		updateMask: string;
		/** Required. The relative resource name of the DeviceCheck configuration object, in the format: ``` projects/{project_number}/apps/{app_id}/deviceCheckConfig ``` Format: `projects/<id>/apps/<id>/deviceCheckConfig`. */
		name: string;
		/** Required. The relative resource name of the DeviceCheck configuration object, in the format: ``` projects/{project_number}/apps/{app_id}/deviceCheckConfig ``` */
		body_name?: string;
		/** Required. The key identifier of a private key enabled with DeviceCheck, created in your Apple Developer account. */
		keyId?: string;
		/** Specifies the duration for which App Check tokens exchanged from DeviceCheck tokens will be valid. If unset, a default value of 1 hour is assumed. Must be between 30 minutes and 7 days, inclusive. */
		tokenTtl?: string;
		/** Required. Input only. The contents of the private key (`.p8`) file associated with the key specified by `key_id`. For security reasons, this field will never be populated in any response. */
		privateKey?: string;
	};
	'appCheck.apps.exchangeAppAttestAssertion': {
		/** Required. The relative resource name of the iOS app, in the format: ``` projects/{project_number}/apps/{app_id} ``` If necessary, the `project_number` element can be replaced with the project ID of the Firebase project. */
		app: string;
		/** Required. A one-time challenge returned by an immediately prior call to GenerateAppAttestChallenge. (base64) */
		challenge?: string;
		/** Specifies whether this attestation is for use in a *limited use* (`true`) or *session based* (`false`) context. To enable this attestation to be used with the *replay protection* feature, set this to `true`. The default value is `false`. */
		limitedUse?: boolean;
		/** Required. The CBOR-encoded assertion returned by the client-side App Attest API. (base64) */
		assertion?: string;
		/** Required. The artifact returned by a previous call to ExchangeAppAttestAttestation. (base64) */
		artifact?: string;
	};
	'appCheck.apps.exchangeAppAttestAttestation': {
		/** Required. The relative resource name of the iOS app, in the format: ``` projects/{project_number}/apps/{app_id} ``` If necessary, the `project_number` element can be replaced with the project ID of the Firebase project. */
		app: string;
		/** Specifies whether this attestation is for use in a *limited use* (`true`) or *session based* (`false`) context. To enable this attestation to be used with the *replay protection* feature, set this to `true`. The default value is `false`. */
		limitedUse?: boolean;
		/** Required. The key ID generated by App Attest for the client app. (base64) */
		keyId?: string;
		/** Required. The App Attest statement returned by the client-side App Attest API. This is a base64url encoded CBOR object in the JSON response. (base64) */
		attestationStatement?: string;
		/** Required. A one-time challenge returned by an immediately prior call to GenerateAppAttestChallenge. (base64) */
		challenge?: string;
	};
	'appCheck.apps.exchangeCustomToken': {
		/** Required. The relative resource name of the app, in the format: ``` projects/{project_number}/apps/{app_id} ``` If necessary, the `project_number` element can be replaced with the project ID of the Firebase project. */
		app: string;
		/** Specifies whether this attestation is for use in a *limited use* (`true`) or *session based* (`false`) context. To enable this attestation to be used with the *replay protection* feature, set this to `true`. The default value is `false`. */
		limitedUse?: boolean;
		/** Required. A custom token signed using your project's Admin SDK service account credentials. */
		customToken?: string;
		/** Optional. When `limited_use` is set to `true`, this field specifies the desired `jti` claim (Section 4.1.7 of RFC 7519) in the returned App Check token. *Limited use* App Check tokens with the same `jti` will be counted as the same token for the purposes of replay protection. */
		jti?: string;
	};
	'appCheck.apps.exchangeDebugToken': {
		/** Required. The relative resource name of the app, in the format: ``` projects/{project_number}/apps/{app_id} ``` If necessary, the `project_number` element can be replaced with the project ID of the Firebase project. */
		app: string;
		/** Required. A debug token secret. This string must match a debug token secret previously created using CreateDebugToken. */
		debugToken?: string;
		/** Specifies whether this attestation is for use in a *limited use* (`true`) or *session based* (`false`) context. To enable this attestation to be used with the *replay protection* feature, set this to `true`. The default value is `false`. */
		limitedUse?: boolean;
	};
	'appCheck.apps.exchangeDeviceCheckToken': {
		/** Required. The relative resource name of the iOS app, in the format: ``` projects/{project_number}/apps/{app_id} ``` If necessary, the `project_number` element can be replaced with the project ID of the Firebase project. */
		app: string;
		/** Required. The `device_token` as returned by Apple's client-side [DeviceCheck API](https://developer.apple.com/documentation/devicecheck/dcdevice). This is the base64 encoded `Data` (Swift) or `NSData` (ObjC) object. */
		deviceToken?: string;
		/** Specifies whether this attestation is for use in a *limited use* (`true`) or *session based* (`false`) context. To enable this attestation to be used with the *replay protection* feature, set this to `true`. The default value is `false`. */
		limitedUse?: boolean;
	};
	'appCheck.apps.exchangePlayIntegrityToken': {
		/** Required. The relative resource name of the Android app, in the format: ``` projects/{project_number}/apps/{app_id} ``` If necessary, the `project_number` element can be replaced with the project ID of the Firebase project. */
		app: string;
		/** Required. The [integrity verdict response token from Play Integrity](https://developer.android.com/google/play/integrity/verdict#decrypt-verify) issued to your app. */
		playIntegrityToken?: string;
		/** Specifies whether this attestation is for use in a *limited use* (`true`) or *session based* (`false`) context. To enable this attestation to be used with the *replay protection* feature, set this to `true`. The default value is `false`. */
		limitedUse?: boolean;
	};
	'appCheck.apps.exchangeRecaptchaEnterpriseToken': {
		/** Required. The relative resource name of the web app, in the format: ``` projects/{project_number}/apps/{app_id} ``` If necessary, the `project_number` element can be replaced with the project ID of the Firebase project. */
		app: string;
		/** Required. The reCAPTCHA token as returned by the [reCAPTCHA Enterprise JavaScript API](https://cloud.google.com/recaptcha-enterprise/docs/instrument-web-pages). */
		recaptchaEnterpriseToken?: string;
		/** Specifies whether this attestation is for use in a *limited use* (`true`) or *session based* (`false`) context. To enable this attestation to be used with the *replay protection* feature, set this to `true`. The default value is `false`. */
		limitedUse?: boolean;
	};
	'appCheck.apps.exchangeRecaptchaV3Token': {
		/** Required. The relative resource name of the web app, in the format: ``` projects/{project_number}/apps/{app_id} ``` If necessary, the `project_number` element can be replaced with the project ID of the Firebase project. */
		app: string;
		/** Required. The reCAPTCHA token as returned by the [reCAPTCHA v3 JavaScript API](https://developers.google.com/recaptcha/docs/v3). */
		recaptchaV3Token?: string;
		/** Specifies whether this attestation is for use in a *limited use* (`true`) or *session based* (`false`) context. To enable this attestation to be used with the *replay protection* feature, set this to `true`. The default value is `false`. */
		limitedUse?: boolean;
	};
	'appCheck.apps.generateAppAttestChallenge': {
		/** Required. The relative resource name of the iOS app, in the format: ``` projects/{project_number}/apps/{app_id} ``` If necessary, the `project_number` element can be replaced with the project ID of the Firebase project. */
		app: string;
		body?: FirebaseGoogleFirebaseAppcheckV1GenerateAppAttestChallengeRequestInput;
	};
	'appCheck.apps.generatePlayIntegrityChallenge': {
		/** Required. The relative resource name of the app, in the format: ``` projects/{project_number}/apps/{app_id} ``` If necessary, the `project_number` element can be replaced with the project ID of the Firebase project. */
		app: string;
		body?: FirebaseGoogleFirebaseAppcheckV1GeneratePlayIntegrityChallengeRequestInput;
	};
	'appCheck.apps.mintAppCheckToken': {
		/** Required. The relative resource name of the app, in the format: ``` projects/{project_number}/apps/{app_id} ``` If necessary, the `project_number` element can be replaced with the project ID of the Firebase project. */
		app: string;
		/** Optional. If specified, the returned App Check token will be a limited-use token minted according to the specified configuration options. */
		limitedUseConfig?: FirebaseGoogleFirebaseAppcheckV1LimitedUseConfigInput;
		/** Optional. If specified, the returned App Check token will be a session token, valid for the specified duration. Must be between 30 minutes and 7 days, inclusive. */
		tokenTtl?: string;
	};
	'appCheck.apps.playIntegrityConfig.batchGet': {
		/** Required. The relative resource names of the PlayIntegrityConfigs to retrieve, in the format ``` projects/{project_number}/apps/{app_id}/playIntegrityConfig ``` A maximum of 100 objects can be retrieved in a batch. */
		names: Array<string>;
		/** Required. The parent project name shared by all PlayIntegrityConfigs being retrieved, in the format ``` projects/{project_number} ``` The parent collection in the `name` field of any resource being retrieved must match this field, or the entire batch fails. Format: `projects/<id>`. */
		parent: string;
	};
	'appCheck.apps.playIntegrityConfig.get': {
		/** Required. The relative resource name of the PlayIntegrityConfig, in the format: ``` projects/{project_number}/apps/{app_id}/playIntegrityConfig ``` Format: `projects/<id>/apps/<id>/playIntegrityConfig`. */
		name: string;
	};
	'appCheck.apps.playIntegrityConfig.patch': {
		/** Required. The relative resource name of the Play Integrity configuration object, in the format: ``` projects/{project_number}/apps/{app_id}/playIntegrityConfig ``` Format: `projects/<id>/apps/<id>/playIntegrityConfig`. */
		name: string;
		/** Required. A comma-separated list of names of fields in the PlayIntegrityConfig to update. Example: `token_ttl`. */
		updateMask: string;
		/** Specifies the duration for which App Check tokens exchanged from Play Integrity tokens will be valid. If unset, a default value of 1 hour is assumed. Must be between 30 minutes and 7 days, inclusive. */
		tokenTtl?: string;
		/** Specifies application integrity requirements for Android devices running your app. These settings correspond to requirements on the [**application integrity** field](https://developer.android.com/google/play/integrity/verdicts#application-integrity-field) obtained from the Play Integrity API. */
		appIntegrity?: FirebaseGoogleFirebaseAppcheckV1PlayIntegrityConfigAppIntegrityInput;
		/** Specifies account requirements for Android devices running your app. These settings correspond to requirements on the [**account details** field](https://developer.android.com/google/play/integrity/verdicts#account-details-field) obtained from the Play Integrity API. */
		accountDetails?: FirebaseGoogleFirebaseAppcheckV1PlayIntegrityConfigAccountDetailsInput;
		/** Specifies device integrity requirements for Android devices running your app. These settings correspond to requirements on the [**device integrity** field](https://developer.android.com/google/play/integrity/verdicts#device-integrity-field) obtained from the Play Integrity API. */
		deviceIntegrity?: FirebaseGoogleFirebaseAppcheckV1PlayIntegrityConfigDeviceIntegrityInput;
		/** Required. The relative resource name of the Play Integrity configuration object, in the format: ``` projects/{project_number}/apps/{app_id}/playIntegrityConfig ``` */
		body_name?: string;
	};
	'appCheck.apps.recaptchaEnterpriseConfig.batchGet': {
		/** Required. The parent project name shared by all RecaptchaEnterpriseConfigs being retrieved, in the format ``` projects/{project_number} ``` The parent collection in the `name` field of any resource being retrieved must match this field, or the entire batch fails. Format: `projects/<id>`. */
		parent: string;
		/** Required. The relative resource names of the RecaptchaEnterpriseConfigs to retrieve, in the format: ``` projects/{project_number}/apps/{app_id}/recaptchaEnterpriseConfig ``` A maximum of 100 objects can be retrieved in a batch. */
		names: Array<string>;
	};
	'appCheck.apps.recaptchaEnterpriseConfig.get': {
		/** Required. The relative resource name of the RecaptchaEnterpriseConfig, in the format: ``` projects/{project_number}/apps/{app_id}/recaptchaEnterpriseConfig ``` Format: `projects/<id>/apps/<id>/recaptchaEnterpriseConfig`. */
		name: string;
	};
	'appCheck.apps.recaptchaEnterpriseConfig.patch': {
		/** Required. The relative resource name of the reCAPTCHA Enterprise configuration object, in the format: ``` projects/{project_number}/apps/{app_id}/recaptchaEnterpriseConfig ``` Format: `projects/<id>/apps/<id>/recaptchaEnterpriseConfig`. */
		name: string;
		/** Required. A comma-separated list of names of fields in the RecaptchaEnterpriseConfig to update. Example: `site_key`. */
		updateMask: string;
		/** Specifies risk tolerance and requirements for your application. These settings correspond to requirements on the [**`riskAnalysis`**](https://cloud.google.com/recaptcha/docs/interpret-assessment-website#interpret_assessment) tuple in the assessment obtained from reCAPTCHA Enterprise. */
		riskAnalysis?: FirebaseGoogleFirebaseAppcheckV1RecaptchaEnterpriseConfigRiskAnalysisInput;
		/** The score-based site key [created in reCAPTCHA Enterprise](https://cloud.google.com/recaptcha-enterprise/docs/create-key#creating_a_site_key) used to [invoke reCAPTCHA and generate the reCAPTCHA tokens](https://cloud.google.com/recaptcha-enterprise/docs/instrument-web-pages) for your application. */
		siteKey?: string;
		/** Specifies the duration for which App Check tokens exchanged from reCAPTCHA Enterprise tokens will be valid. If unset, a default value of 1 hour is assumed. Must be between 30 minutes and 7 days, inclusive. */
		tokenTtl?: string;
		/** Required. The relative resource name of the reCAPTCHA Enterprise configuration object, in the format: ``` projects/{project_number}/apps/{app_id}/recaptchaEnterpriseConfig ``` */
		body_name?: string;
	};
	'appCheck.apps.recaptchaV3Config.batchGet': {
		/** Required. The relative resource names of the RecaptchaV3Configs to retrieve, in the format: ``` projects/{project_number}/apps/{app_id}/recaptchaV3Config ``` A maximum of 100 objects can be retrieved in a batch. */
		names: Array<string>;
		/** Required. The parent project name shared by all RecaptchaV3Configs being retrieved, in the format ``` projects/{project_number} ``` The parent collection in the `name` field of any resource being retrieved must match this field, or the entire batch fails. Format: `projects/<id>`. */
		parent: string;
	};
	'appCheck.apps.recaptchaV3Config.get': {
		/** Required. The relative resource name of the RecaptchaV3Config, in the format: ``` projects/{project_number}/apps/{app_id}/recaptchaV3Config ``` Format: `projects/<id>/apps/<id>/recaptchaV3Config`. */
		name: string;
	};
	'appCheck.apps.recaptchaV3Config.patch': {
		/** Required. A comma-separated list of names of fields in the RecaptchaV3Config to update. Example: `site_secret`. */
		updateMask: string;
		/** Required. The relative resource name of the reCAPTCHA v3 configuration object, in the format: ``` projects/{project_number}/apps/{app_id}/recaptchaV3Config ``` Format: `projects/<id>/apps/<id>/recaptchaV3Config`. */
		name: string;
		/** Specifies the duration for which App Check tokens exchanged from reCAPTCHA tokens will be valid. If unset, a default value of 1 day is assumed. Must be between 30 minutes and 7 days, inclusive. */
		tokenTtl?: string;
		/** Required. Input only. The site secret used to identify your service for reCAPTCHA v3 verification. For security reasons, this field will never be populated in any response. */
		siteSecret?: string;
		/** Specifies a minimum score required for a reCAPTCHA token to be considered valid. If its score is greater than or equal to this value, it will be accepted; otherwise, it will be rejected. The value must be between 0.0 and 1.0. The default value is 0.5. */
		minValidScore?: number;
		/** Required. The relative resource name of the reCAPTCHA v3 configuration object, in the format: ``` projects/{project_number}/apps/{app_id}/recaptchaV3Config ``` */
		body_name?: string;
	};
	'appCheck.jwks.get': {
		/** Required. The relative resource name to the public JWK set. Must always be exactly the string `jwks`. Format: `jwks`. */
		name: string;
	};
	'appCheck.oauthClients.exchangeAppAttestAssertion': {
		/** Required. The relative resource name of the iOS app, in the format: ``` projects/{project_number}/apps/{app_id} ``` If necessary, the `project_number` element can be replaced with the project ID of the Firebase project. */
		app: string;
		/** Required. A one-time challenge returned by an immediately prior call to GenerateAppAttestChallenge. (base64) */
		challenge?: string;
		/** Specifies whether this attestation is for use in a *limited use* (`true`) or *session based* (`false`) context. To enable this attestation to be used with the *replay protection* feature, set this to `true`. The default value is `false`. */
		limitedUse?: boolean;
		/** Required. The CBOR-encoded assertion returned by the client-side App Attest API. (base64) */
		assertion?: string;
		/** Required. The artifact returned by a previous call to ExchangeAppAttestAttestation. (base64) */
		artifact?: string;
	};
	'appCheck.oauthClients.exchangeAppAttestAttestation': {
		/** Required. The relative resource name of the iOS app, in the format: ``` projects/{project_number}/apps/{app_id} ``` If necessary, the `project_number` element can be replaced with the project ID of the Firebase project. */
		app: string;
		/** Specifies whether this attestation is for use in a *limited use* (`true`) or *session based* (`false`) context. To enable this attestation to be used with the *replay protection* feature, set this to `true`. The default value is `false`. */
		limitedUse?: boolean;
		/** Required. The key ID generated by App Attest for the client app. (base64) */
		keyId?: string;
		/** Required. The App Attest statement returned by the client-side App Attest API. This is a base64url encoded CBOR object in the JSON response. (base64) */
		attestationStatement?: string;
		/** Required. A one-time challenge returned by an immediately prior call to GenerateAppAttestChallenge. (base64) */
		challenge?: string;
	};
	'appCheck.oauthClients.exchangeDebugToken': {
		/** Required. The relative resource name of the app, in the format: ``` projects/{project_number}/apps/{app_id} ``` If necessary, the `project_number` element can be replaced with the project ID of the Firebase project. */
		app: string;
		/** Required. A debug token secret. This string must match a debug token secret previously created using CreateDebugToken. */
		debugToken?: string;
		/** Specifies whether this attestation is for use in a *limited use* (`true`) or *session based* (`false`) context. To enable this attestation to be used with the *replay protection* feature, set this to `true`. The default value is `false`. */
		limitedUse?: boolean;
	};
	'appCheck.oauthClients.generateAppAttestChallenge': {
		/** Required. The relative resource name of the iOS app, in the format: ``` projects/{project_number}/apps/{app_id} ``` If necessary, the `project_number` element can be replaced with the project ID of the Firebase project. */
		app: string;
		body?: FirebaseGoogleFirebaseAppcheckV1GenerateAppAttestChallengeRequestInput;
	};
	'appCheck.services.batchUpdate': {
		/** Required. The parent project name shared by all Service configurations being updated, in the format ``` projects/{project_number} ``` The parent collection in the `name` field of any resource being updated must match this field, or the entire batch fails. Format: `projects/<id>`. */
		parent: string;
		/** Optional. A comma-separated list of names of fields in the Services to update. Example: `display_name`. If the `update_mask` field is set in both this request and any of the UpdateServiceRequest messages, they must match or the entire batch fails and no updates will be committed. */
		updateMask?: string;
		/** Required. The request messages specifying the Services to update. A maximum of 100 objects can be updated in a batch. */
		requests?: Array<FirebaseGoogleFirebaseAppcheckV1UpdateServiceRequestInput>;
	};
	'appCheck.services.get': {
		/** Required. The relative resource name of the Service to retrieve, in the format: ``` projects/{project_number}/services/{service_id} ``` Note that the `service_id` element must be a supported service ID. Consult the Service.name field for a list of supported service IDs. */
		name: string;
	};
	'appCheck.services.list': {
		/** Required. The relative resource name of the parent project for which to list each associated Service, in the format: ``` projects/{project_number} ``` Format: `projects/<id>`. */
		parent: string;
		/** The maximum number of Services to return in the response. Only explicitly configured services are returned. The server may return fewer than this at its own discretion. If no value is specified (or too large a value is specified), the server will impose its own limit. */
		pageSize?: number;
		/** Token returned from a previous call to ListServices indicating where in the set of Services to resume listing. Provide this to retrieve the subsequent page. */
		pageToken?: string;
	};
	'appCheck.services.patch': {
		/** Required. The relative resource name of the service configuration object, in the format: ``` projects/{project_number}/services/{service_id} ``` Note that the `service_id` element must be a supported service ID. Currently, the following service IDs are supported. */
		name: string;
		/** Required. A comma-separated list of names of fields in the Service to update. Example: `enforcement_mode`. */
		updateMask: string;
		/** Required. The baseline protection EnforcementMode for this service. */
		enforcementMode?: 'OFF' | 'UNENFORCED' | 'ENFORCED';
		/** Required. The relative resource name of the service configuration object, in the format: ``` projects/{project_number}/services/{service_id} ``` Note that the `service_id` element must be a supported service ID. Currently, the following service IDs are supported. */
		body_name?: string;
		/** Optional. This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding. This etag is strongly validated as defined by RFC 7232. */
		etag?: string;
		/** Optional. The replay protection EnforcementMode for this service. Note that this field cannot be set to a level higher than that of baseline protection. For example, if the enforcement mode for baseline protection is set to `UNENFORCED`, this field cannot be set to `ENFORCED`. */
		replayProtection?: 'OFF' | 'UNENFORCED' | 'ENFORCED';
	};
	'appCheck.services.resourcePolicies.batchUpdate': {
		/** Required. The parent service name, in the format ``` projects/{project_number}/services/{service_id} ``` The parent collection in the `name` field of any resource being updated must match this field, or the entire batch fails. Format: `projects/<id>/services/<id>`. */
		parent: string;
		/** Optional. A comma-separated list of names of fields in the ResourcePolicy objects to update. Example: `enforcement_mode`. */
		updateMask?: string;
		/** Required. The request messages specifying the ResourcePolicy objects to update. A maximum of 100 objects can be updated in a batch. */
		requests?: Array<FirebaseGoogleFirebaseAppcheckV1UpdateResourcePolicyRequestInput>;
	};
	'appCheck.services.resourcePolicies.create': {
		/** Required. The relative resource name of the parent Service in which the specified ResourcePolicy will be created, in the format: ``` projects/{project_number}/services/{service_id} ``` Note that the `service_id` element must be a supported service ID. */
		parent: string;
		/** Required. Identifier. The relative name of the resource policy object, in the format: ``` projects/{project_number}/services/{service_id}/resourcePolicies/{resource_policy_id} ``` Note that the `service_id` element must be a supported service ID. */
		name?: string;
		/** Required. The baseline protection EnforcementMode for this resource. This will override the service-level baseline protection EnforcementMode. */
		enforcementMode?: 'OFF' | 'UNENFORCED' | 'ENFORCED';
		/** This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding. This etag is strongly validated as defined by RFC 7232. */
		etag?: string;
		/** Required. Service specific name of the resource object to which this policy applies, in the format: * **iOS OAuth clients** (Google Identity for iOS): `//oauth2.googleapis.com/projects/{project_number}/oauthClients/{oauth_client_id}` Note that the resource must belong to the service specified in… */
		targetResource?: string;
	};
	'appCheck.services.resourcePolicies.delete': {
		/** The checksum to be validated against the current ResourcePolicy, to ensure the client has an up-to-date value before proceeding. */
		etag?: string;
		/** Required. The relative resource name of the ResourcePolicy to delete, in the format: ``` projects/{project_number}/services/{service_id}/resourcePolicies/{resource_policy_id} ``` Format: `projects/<id>/services/<id>/resourcePolicies/<id>`. */
		name: string;
	};
	'appCheck.services.resourcePolicies.get': {
		/** Required. The relative resource name of the ResourcePolicy to retrieve, in the format: ``` projects/{project_number}/services/{service_id}/resourcePolicies/{resource_policy_id} ``` Note that the `service_id` element must be a supported service ID. */
		name: string;
	};
	'appCheck.services.resourcePolicies.list': {
		/** Optional. Filters the results by the specified rule. For the exact syntax of this field, please consult the [AIP-160](https://google.aip.dev/160) standard. */
		filter?: string;
		/** The maximum number of ResourcePolicy objects to return in the response. The server may return fewer than this at its own discretion. If no value is specified (or too large a value is specified), the server will impose its own limit. */
		pageSize?: number;
		/** Required. The relative resource name of the parent Service for which to list each associated ResourcePolicy, in the format: ``` projects/{project_number}/services/{service_id} ``` Note that the `service_id` element must be a supported service ID. */
		parent: string;
		/** Token returned from a previous call to ListResourcePolicies indicating where in the set of ResourcePolicy objects to resume listing. Provide this to retrieve the subsequent page. */
		pageToken?: string;
	};
	'appCheck.services.resourcePolicies.patch': {
		/** Required. Identifier. The relative name of the resource policy object, in the format: ``` projects/{project_number}/services/{service_id}/resourcePolicies/{resource_policy_id} ``` Note that the `service_id` element must be a supported service ID. */
		name: string;
		/** Required. A comma-separated list of names of fields in the ResourcePolicy to update. Example: `enforcement_mode`. */
		updateMask: string;
		/** Required. Identifier. The relative name of the resource policy object, in the format: ``` projects/{project_number}/services/{service_id}/resourcePolicies/{resource_policy_id} ``` Note that the `service_id` element must be a supported service ID. */
		body_name?: string;
		/** Required. The baseline protection EnforcementMode for this resource. This will override the service-level baseline protection EnforcementMode. */
		enforcementMode?: 'OFF' | 'UNENFORCED' | 'ENFORCED';
		/** This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding. This etag is strongly validated as defined by RFC 7232. */
		etag?: string;
		/** Required. Service specific name of the resource object to which this policy applies, in the format: * **iOS OAuth clients** (Google Identity for iOS): `//oauth2.googleapis.com/projects/{project_number}/oauthClients/{oauth_client_id}` Note that the resource must belong to the service specified in… */
		targetResource?: string;
	};
	'appDistribution.apps.getAabInfo': {
		/** Required. The name of the `AabInfo` resource to retrieve. Format: `projects/{project_number}/apps/{app}/aabInfo` Format: `projects/<id>/apps/<id>/aabInfo`. */
		name: string;
	};
	'appDistribution.apps.releases.batchDelete': {
		/** Required. The name of the app resource, which is the parent of the release resources. Format: `projects/{project_number}/apps/{app}` Format: `projects/<id>/apps/<id>`. */
		parent: string;
		/** Required. The names of the release resources to delete. Format: `projects/{project_number}/apps/{app}/releases/{release}` A maximum of 100 releases can be deleted per request. */
		names?: Array<string>;
	};
	'appDistribution.apps.releases.distribute': {
		/** Required. The name of the release resource to distribute. Format: `projects/{project_number}/apps/{app}/releases/{release}` Format: `projects/<id>/apps/<id>/releases/<id>`. */
		name: string;
		/** Optional. A list of tester email addresses to be given access to this release. A combined maximum of 999 `testerEmails` and `groupAliases` can be specified in a single request. */
		testerEmails?: Array<string>;
		/** Optional. A list of group aliases (IDs) to be given access to this release. A combined maximum of 999 `testerEmails` and `groupAliases` can be specified in a single request. */
		groupAliases?: Array<string>;
	};
	'appDistribution.apps.releases.feedbackReports.delete': {
		/** Required. The name of the feedback report to delete. Format: projects/{project_number}/apps/{app}/releases/{release}/feedbackReports/{feedback_report} Format: `projects/<id>/apps/<id>/releases/<id>/feedbackReports/<id>`. */
		name: string;
	};
	'appDistribution.apps.releases.feedbackReports.get': {
		/** Required. The name of the feedback report to retrieve. Format: projects/{project_number}/apps/{app}/releases/{release}/feedbackReports/{feedback_report} Format: `projects/<id>/apps/<id>/releases/<id>/feedbackReports/<id>`. */
		name: string;
	};
	'appDistribution.apps.releases.feedbackReports.list': {
		/** Output only. A page token, received from a previous `ListFeedbackReports` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListFeedbackReports` must match the call that provided the page token. */
		pageToken?: string;
		/** Output only. The maximum number of feedback reports to return. The service may return fewer than this value. The valid range is [1-100]; If unspecified (0), at most 25 feedback reports are returned. Values above 100 are coerced to 100. */
		pageSize?: number;
		/** Required. The name of the release resource, which is the parent of the feedback report resources. Format: `projects/{project_number}/apps/{app}/releases/{release}` Format: `projects/<id>/apps/<id>/releases/<id>`. */
		parent: string;
	};
	'appDistribution.apps.releases.get': {
		/** Required. The name of the release resource to retrieve. Format: projects/{project_number}/apps/{app}/releases/{release} Format: `projects/<id>/apps/<id>/releases/<id>`. */
		name: string;
	};
	'appDistribution.apps.releases.list': {
		/** Optional. The maximum number of releases to return. The service may return fewer than this value. The valid range is [1-100]; If unspecified (0), at most 25 releases are returned. Values above 100 are coerced to 100. */
		pageSize?: number;
		/** Optional. The expression to filter releases listed in the response. To learn more about filtering, refer to the [AIP-160 standard](http://aip.dev/160). */
		filter?: string;
		/** Required. The name of the app resource, which is the parent of the release resources. Format: `projects/{project_number}/apps/{app}` Format: `projects/<id>/apps/<id>`. */
		parent: string;
		/** Optional. The fields used to order releases. Supported fields: - `create_time` (or `createTime`) - `update_time` (or `updateTime`) - `expire_time` (or `expireTime`) To specify descending order for a field, append a "desc" suffix, for example, `createTime desc`. */
		orderBy?: string;
		/** Optional. A page token, received from a previous `ListReleases` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListReleases` must match the call that provided the page token. */
		pageToken?: string;
	};
	'appDistribution.apps.releases.operations.cancel': {
		/** The name of the operation resource to be cancelled. Format: `projects/<id>/apps/<id>/releases/<id>/operations/<id>`. */
		name: string;
		body?: FirebaseAppDistributionGoogleLongrunningCancelOperationRequestInput;
	};
	'appDistribution.apps.releases.operations.delete': {
		/** The name of the operation resource to be deleted. Format: `projects/<id>/apps/<id>/releases/<id>/operations/<id>`. */
		name: string;
	};
	'appDistribution.apps.releases.operations.get': {
		/** The name of the operation resource. Format: `projects/<id>/apps/<id>/releases/<id>/operations/<id>`. */
		name: string;
	};
	'appDistribution.apps.releases.operations.list': {
		/** When set to `true`, operations that are reachable are returned as normal, and those that are unreachable are returned in the ListOperationsResponse.unreachable field. This can only be `true` when reading across collections. For example, when `parent` is set to `"projects/example/locations/-"`. */
		returnPartialSuccess?: boolean;
		/** The name of the operation's parent resource. Format: `projects/<id>/apps/<id>/releases/<id>`. */
		name: string;
		/** The standard list page token. */
		pageToken?: string;
		/** The standard list filter. */
		filter?: string;
		/** The standard list page size. */
		pageSize?: number;
	};
	'appDistribution.apps.releases.operations.wait': {
		/** The name of the operation resource to wait on. Format: `projects/<id>/apps/<id>/releases/<id>/operations/<id>`. */
		name: string;
		/** The maximum duration to wait before timing out. If left blank, the wait will be at most the time permitted by the underlying HTTP/RPC protocol. If RPC context deadline is also specified, the shorter one will be used. */
		timeout?: string;
	};
	'appDistribution.apps.releases.patch': {
		/** Optional. The list of fields to update. */
		updateMask?: string;
		/** The name of the release resource. Format: `projects/{project_number}/apps/{app}/releases/{release}` Format: `projects/<id>/apps/<id>/releases/<id>`. */
		name: string;
		/** Notes about the release. */
		releaseNotes?: FirebaseGoogleFirebaseAppdistroV1ReleaseNotesInput;
		/** The name of the release resource. Format: `projects/{project_number}/apps/{app}/releases/{release}` */
		body_name?: string;
	};
	'appDistribution.groups.batchJoin': {
		/** Required. The name of the group resource to which testers are added. Format: `projects/{project_number}/groups/{group_alias}` Format: `projects/<id>/groups/<id>`. */
		group: string;
		/** Indicates whether to create tester resources based on `emails` if they don't exist yet. */
		createMissingTesters?: boolean;
		/** Required. The emails of the testers to be added to the group. A maximum of 999 and a minimum of 1 tester can be created in a batch. */
		emails?: Array<string>;
	};
	'appDistribution.groups.batchLeave': {
		/** Required. The name of the group resource from which testers are removed. Format: `projects/{project_number}/groups/{group_alias}` Format: `projects/<id>/groups/<id>`. */
		group: string;
		/** Required. The email addresses of the testers to be removed from the group. A maximum of 999 and a minimum of 1 testers can be removed in a batch. */
		emails?: Array<string>;
	};
	'appDistribution.groups.create': {
		/** Required. The name of the project resource, which is the parent of the group resource. Format: `projects/{project_number}` Format: `projects/<id>`. */
		parent: string;
		/** Optional. The "alias" to use for the group, which will become the final component of the group's resource name. This value must be unique per project. The field is named `groupId` to comply with AIP guidance for user-specified IDs. */
		groupId?: string;
		/** Required. The display name of the group. */
		displayName?: string;
		/** The name of the group resource. Format: `projects/{project_number}/groups/{group_alias}` */
		name?: string;
	};
	'appDistribution.groups.delete': {
		/** Required. The name of the group resource. Format: `projects/{project_number}/groups/{group_alias}` Format: `projects/<id>/groups/<id>`. */
		name: string;
	};
	'appDistribution.groups.get': {
		/** Required. The name of the group resource to retrieve. Format: `projects/{project_number}/groups/{group_alias}` Format: `projects/<id>/groups/<id>`. */
		name: string;
	};
	'appDistribution.groups.list': {
		/** Required. The name of the project resource, which is the parent of the group resources. Format: `projects/{project_number}` Format: `projects/<id>`. */
		parent: string;
		/** Optional. A page token, received from a previous `ListGroups` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListGroups` must match the call that provided the page token. */
		pageToken?: string;
		/** Optional. The maximum number of groups to return. The service may return fewer than this value. The valid range is [1-1000]; If unspecified (0), at most 25 groups are returned. Values above 1000 are coerced to 1000. */
		pageSize?: number;
	};
	'appDistribution.groups.patch': {
		/** The name of the group resource. Format: `projects/{project_number}/groups/{group_alias}` Format: `projects/<id>/groups/<id>`. */
		name: string;
		/** Optional. The list of fields to update. */
		updateMask?: string;
		/** Required. The display name of the group. */
		displayName?: string;
		/** The name of the group resource. Format: `projects/{project_number}/groups/{group_alias}` */
		body_name?: string;
	};
	'appDistribution.media.upload': {
		/** Required. The name of the app resource. Format: `projects/{project_number}/apps/{app}` Format: `projects/<id>/apps/<id>`. */
		app: string;
		/** Binary to upload */
		blob?: FirebaseGdataMediaInput;
		/** The bytes to upload (a URL, `{ base64 }` or a Blob). Without it the call sends only the JSON metadata. */
		file?: FileInput;
	};
	'appDistribution.testers.batchAdd': {
		/** Required. The name of the project resource. Format: `projects/{project_number}` Format: `projects/<id>`. */
		project: string;
		/** Required. The email addresses of the tester resources to create. A maximum of 999 and a minimum of 1 tester can be created in a batch. */
		emails?: Array<string>;
	};
	'appDistribution.testers.batchRemove': {
		/** Required. The name of the project resource. Format: `projects/{project_number}` Format: `projects/<id>`. */
		project: string;
		/** Required. The email addresses of the tester resources to removed. A maximum of 999 and a minimum of 1 testers can be deleted in a batch. */
		emails?: Array<string>;
	};
	'appDistribution.testers.list': {
		/** Optional. The expression to filter testers listed in the response. To learn more about filtering, refer to [Google's AIP-160 standard](http://aip.dev/160). */
		filter?: string;
		/** Optional. The maximum number of testers to return. The service may return fewer than this value. The valid range is [1-1000]; If unspecified (0), at most 10 testers are returned. Values above 1000 are coerced to 1000. */
		pageSize?: number;
		/** Required. The name of the project resource, which is the parent of the tester resources. Format: `projects/{project_number}` Format: `projects/<id>`. */
		parent: string;
		/** Optional. A page token, received from a previous `ListTesters` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListTesters` must match the call that provided the page token. */
		pageToken?: string;
	};
	'appDistribution.testers.patch': {
		/** The name of the tester resource. Format: `projects/{project_number}/testers/{email_address}` Format: `projects/<id>/testers/<id>`. */
		name: string;
		/** Optional. The list of fields to update. */
		updateMask?: string;
		/** The name of the tester associated with the Google account used to accept the tester invitation. */
		displayName?: string;
		/** The resource names of the groups this tester belongs to. */
		groups?: Array<string>;
		/** The name of the tester resource. Format: `projects/{project_number}/testers/{email_address}` */
		body_name?: string;
	};
	'auth.accounts.createAuthUri': {
		/** Used for the Google provider. The G Suite hosted domain of the user in order to restrict sign-in to users at that domain. */
		hostedDomain?: string;
		/** A valid URL for the IdP to redirect the user back to. The URL cannot contain fragments or the reserved `state` query parameter. */
		continueUri?: string;
		/** Additional space-delimited OAuth 2.0 scopes specifying the scope of the authentication request with the IdP. Used for OAuth 2.0 IdPs. For the Google provider, the authorization code flow will be used if this field is set. */
		oauthScope?: string;
		appId?: string;
		/** The ID of the Identity Platform tenant to create an authorization URI or lookup an email identifier for. If not set, the operation will be performed in the default Identity Platform instance in the project. */
		tenantId?: string;
		otaApp?: string;
		/** Used for the Google provider. The type of the authentication flow to be used. If present, this should be `CODE_FLOW` to specify the authorization code flow. Otherwise, the default ID Token flow will be used. */
		authFlowType?: string;
		/** A session ID that can be verified against in SignInWithIdp to prevent session fixation attacks. If absent, a random string will be generated and returned as the session ID. */
		sessionId?: string;
		oauthConsumerKey?: string;
		/** The provider ID of the IdP for the user to sign in with. This should be a provider ID enabled for sign-in, which is either from the list of [default supported IdPs](https://cloud.google.com/identity-platform/docs/reference/rest/v2/defaultSupportedIdps/list), or of the format `oidc.*` or `saml.*`. */
		providerId?: string;
		/** An opaque string used to maintain contextual information between the authentication request and the callback from the IdP. */
		context?: string;
		/** The email identifier of the user account to fetch associated providers for. At least one of the fields `identifier` and `provider_id` must be set. The length of the email address should be less than 256 characters and in the format of `name@domain.tld`. */
		identifier?: string;
		openidRealm?: string;
		/** Additional customized query parameters to be added to the authorization URI. The following parameters are reserved and cannot be added: `client_id`, `response_type`, `scope`, `redirect_uri`, `state`. */
		customParameter?: Record<string, string>;
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
	};
	'auth.accounts.delete': {
		delegatedProjectNumber?: string | number;
		/** The ID of the project which the account belongs to. Should only be specified in authenticated requests that specify local_id of an account. */
		targetProjectId?: string;
		/** The Identity Platform ID token of the account to delete. Require to be specified for requests from end users that lack Google OAuth 2.0 credential. Authenticated requests bearing a Google OAuth2 credential with proper permissions may pass local_id to specify the account to delete alternatively. */
		idToken?: string;
		/** The ID of the tenant that the account belongs to, if applicable. Only require to be specified for authenticated requests bearing a Google OAuth 2.0 credential that specify local_id of an account that belongs to an Identity Platform tenant. */
		tenantId?: string;
		/** The ID of user account to delete. Specifying this field requires a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). Requests from users lacking the credential should pass an ID token instead. */
		localId?: string;
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
	};
	'auth.accounts.issueSamlResponse': {
		/** The Identity Platform ID token. It will be verified and then converted to a new SAMLResponse. */
		idToken?: string;
		/** SAML app entity id specified in Google Admin Console for each app. If developers want to redirect to a third-party app rather than a G Suite app, they'll probably they need this. When it's used, we'll return a RelayState. */
		samlAppEntityId?: string;
		/** Relying Party identifier, which is the audience of issued SAMLResponse. */
		rpId?: string;
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
	};
	'auth.accounts.lookup': {
		/** The phone number of one or more accounts to fetch. Should only be specified by authenticated requests from a developer and should be in E.164 format, for example, +15555555555. */
		phoneNumber?: Array<string>;
		/** The ID of the tenant that the account belongs to. Should only be specified by authenticated requests from a developer. */
		tenantId?: string;
		/** The initial email of one or more accounts to fetch. The length of email should be less than 256 characters and in the format of `name@domain.tld`. The email should also match the [RFC 822](https://tools.ietf.org/html/rfc822) addr-spec production. */
		initialEmail?: Array<string>;
		/** The ID of the Google Cloud project that the account or the Identity Platform tenant specified by `tenant_id` belongs to. Should only be specified by authenticated requests bearing a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		targetProjectId?: string;
		/** The email address of one or more accounts to fetch. The length of email should be less than 256 characters and in the format of `name@domain.tld`. The email should also match the [RFC 822](https://tools.ietf.org/html/rfc822) addr-spec production. */
		email?: Array<string>;
		delegatedProjectNumber?: string | number;
		/** The ID of one or more accounts to fetch. Should only be specified by authenticated requests bearing a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		localId?: Array<string>;
		/** The Identity Platform ID token of the account to fetch. Require to be specified for requests from end users. */
		idToken?: string;
		/** The federated user identifier of one or more accounts to fetch. Should only be specified by authenticated requests bearing a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		federatedUserId?: Array<FirebaseGoogleCloudIdentitytoolkitV1FederatedUserIdentifierInput>;
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
	};
	'auth.accounts.resetPassword': {
		/** An out-of-band (OOB) code generated by GetOobCode request. Specify only this parameter (or only this parameter and a tenant ID) to get the out-of-band code's type in the response without mutating the account's state. Only a PASSWORD_RESET out-of-band code can be consumed via this method. */
		oobCode?: string;
		/** The new password to be set for this account. Specifying this field will result in a change to the account and consume the out-of-band code if one was specified and it was of type PASSWORD_RESET. */
		newPassword?: string;
		/** The current password of the account to be modified. Specify this and email to change an account's password without using an out-of-band code. */
		oldPassword?: string;
		/** Optional. The email of the account to be modified. Specify this and the old password in order to change an account's password without using an out-of-band code. */
		email?: string;
		/** Optional. The tenant ID of the Identity Platform tenant the account belongs to. */
		tenantId?: string;
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
	};
	'auth.accounts.sendOobCode': {
		/** For a PASSWORD_RESET request, a reCaptcha response is required when the system detects possible abuse activity. In those cases, this is the response from the reCaptcha challenge used to verify the caller. */
		captchaResp?: string;
		/** The account's email address to send the OOB code to, and generally the email address of the account that needs to be updated. Required for PASSWORD_RESET, EMAIL_SIGNIN, and VERIFY_EMAIL. Only required for VERIFY_AND_CHANGE_EMAIL requests when return_oob_link is set to true. */
		email?: string;
		/** The client type: web, Android or iOS. Required when reCAPTCHA Enterprise protection is enabled. */
		clientType?:
			| 'CLIENT_TYPE_UNSPECIFIED'
			| 'CLIENT_TYPE_WEB'
			| 'CLIENT_TYPE_ANDROID'
			| 'CLIENT_TYPE_IOS';
		/** The Project ID of the Identity Platform project which the account belongs to. To specify this field, it requires a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		targetProjectId?: string;
		/** The Url to continue after user clicks the link sent in email. This is the url that will allow the web widget to handle the OOB code. */
		continueUrl?: string;
		/** The tenant ID of the Identity Platform tenant the account belongs to. */
		tenantId?: string;
		/** If an associated android app can handle the OOB code, the minimum version of the app. If the version on the device is lower than this version then the user is taken to Google Play Store to upgrade the app. */
		androidMinimumVersion?: string;
		/** In order to ensure that the url used can be easily opened up in iOS or android, we create a [Firebase Dynamic Link](https://firebase.google.com/docs/dynamic-links). Most Identity Platform projects will only have one Dynamic Link domain enabled, and can leave this field blank. */
		dynamicLinkDomain?: string;
		/** An ID token for the account. It is required for VERIFY_AND_CHANGE_EMAIL and VERIFY_EMAIL requests unless return_oob_link is set to true. */
		idToken?: string;
		challenge?: string;
		/** Required. The type of out-of-band (OOB) code to send. Depending on this value, other fields in this request will be required and/or have different meanings. There are 4 different OOB codes that can be sent: * PASSWORD_RESET * EMAIL_SIGNIN * VERIFY_EMAIL * VERIFY_AND_CHANGE_EMAIL */
		requestType?:
			| 'OOB_REQ_TYPE_UNSPECIFIED'
			| 'PASSWORD_RESET'
			| 'OLD_EMAIL_AGREE'
			| 'NEW_EMAIL_ACCEPT'
			| 'VERIFY_EMAIL'
			| 'RECOVER_EMAIL'
			| 'EMAIL_SIGNIN'
			| 'VERIFY_AND_CHANGE_EMAIL'
			| 'REVERT_SECOND_FACTOR_ADDITION';
		/** When set to true, the OOB code link will be be sent as a Universal Link or an Android App Link and will be opened by the corresponding app if installed. If not set, or set to false, the OOB code will be sent to the web widget first and then on continue will redirect to the app if installed. */
		canHandleCodeInApp?: boolean;
		/** The email address the account is being updated to. Required only for VERIFY_AND_CHANGE_EMAIL requests. */
		newEmail?: string;
		/** If an associated iOS app can handle the OOB code, the iOS bundle id of this app. This will allow the correct app to open if it is already installed. */
		iOSBundleId?: string;
		/** If an associated iOS app can handle the OOB code, the App Store id of this app. This will allow App Store to open to the correct app if the app is not yet installed. */
		iOSAppStoreId?: string;
		/** The reCAPTCHA version of the reCAPTCHA token in the captcha_response. */
		recaptchaVersion?: 'RECAPTCHA_VERSION_UNSPECIFIED' | 'RECAPTCHA_ENTERPRISE';
		/** If an associated android app can handle the OOB code, the Android package name of the android app that will handle the callback when this OOB code is used. */
		androidPackageName?: string;
		/** The IP address of the caller. Required only for PASSWORD_RESET requests. */
		userIp?: string;
		/** Optional. In order to ensure that the url used can be easily opened in iOS or Android, we create a Hosting link '/__/auth/links'. This optional field contains the domain to use when constructing a Hosting link. If not set, '.firebaseapp.com' domain will be used. */
		linkDomain?: string;
		/** If an associated android app can handle the OOB code, whether or not to install the android app on the device where the link is opened if the app is not already installed. */
		androidInstallApp?: boolean;
		/** Whether the confirmation link containing the OOB code should be returned in the response (no email is sent). Used when a developer wants to construct the email template and send it on their own. */
		returnOobLink?: boolean;
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
	};
	'auth.accounts.sendVerificationCode': {
		/** Optional. The reCAPTCHA version of the reCAPTCHA token in the captcha_response. Required when reCAPTCHA Enterprise is enabled. */
		recaptchaVersion?: 'RECAPTCHA_VERSION_UNSPECIFIED' | 'RECAPTCHA_ENTERPRISE';
		/** Android only. Used to assert application identity in place of a recaptcha token (and safety_net_token). */
		playIntegrityToken?: string;
		/** Android only. Used by Google Play Services to identify the app for auto-retrieval. */
		autoRetrievalInfo?: FirebaseGoogleCloudIdentitytoolkitV1AutoRetrievalInfoInput;
		/** Optional. The reCAPTCHA Enterprise token provided by the reCAPTCHA client-side integration. Required when reCAPTCHA enterprise is enabled. */
		captchaResponse?: string;
		/** Recaptcha token for app verification. At least one of (`ios_receipt` and `ios_secret`), `recaptcha_token`, or `play_integrity_token` must be specified to verify the verification code is being sent on behalf of a real app and not an emulator, if 'captcha_response' is not used (reCAPTCHA enterprise… */
		recaptchaToken?: string;
		/** The phone number to send the verification code to in E.164 format. */
		phoneNumber?: string;
		/** Receipt of successful iOS app token validation. At least one of (`ios_receipt` and `ios_secret`), `recaptcha_token`, or `play_integrity_token` must be specified to verify the verification code is being sent on behalf of a real app and not an emulator, if 'captcha_response' is not used (reCAPTCHA… */
		iosReceipt?: string;
		/** Optional. The client type, web, android or ios. Required when reCAPTCHA Enterprise is enabled. */
		clientType?:
			| 'CLIENT_TYPE_UNSPECIFIED'
			| 'CLIENT_TYPE_WEB'
			| 'CLIENT_TYPE_ANDROID'
			| 'CLIENT_TYPE_IOS';
		/** Android only. Safety Net has been deprecated. Use play_integrity_token instead. */
		safetyNetToken?: string;
		/** Tenant ID of the Identity Platform tenant the user is signing in to. */
		tenantId?: string;
		/** Secret delivered to iOS app as a push notification. Should be passed with an `ios_receipt` as well as the `x-ios-bundle-identifier` header. */
		iosSecret?: string;
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
		/** The iOS app's bundle id (X-Ios-Bundle-Identifier); needed when verifying with an iOS receipt. */
		iosBundleId?: string;
	};
	'auth.accounts.signInWithCustomToken': {
		/** The ID of the Identity Platform tenant the user is signing in to. If present, the ID should match the tenant_id in the token. */
		tenantId?: string;
		/** Should always be true. */
		returnSecureToken?: boolean;
		instanceId?: string;
		delegatedProjectNumber?: string | number;
		/** Required. The custom Auth token asserted by the developer. The token should be a [JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519) that includes the claims listed in the [API reference](https://cloud.google.com/identity-platform/docs/reference/rest/client/) under the "Custom Token Claims"… */
		token?: string;
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
	};
	'auth.accounts.signInWithEmailLink': {
		/** Required. The email address the sign-in link was sent to. The length of email should be less than 256 characters and in the format of `name@domain.tld`. The email should also match the [RFC 822](https://tools.ietf.org/html/rfc822) addr-spec production. */
		email?: string;
		/** Required. The out-of-band code from the email link. */
		oobCode?: string;
		/** The ID of the Identity Platform tenant the user is signing in to. If not set, the user will sign in to the default Identity Platform project. */
		tenantId?: string;
		/** A valid ID token for an Identity Platform account. If passed, this request will link the email address to the user represented by this ID token and enable sign-in with email link on the account for the future. */
		idToken?: string;
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
	};
	'auth.accounts.signInWithGameCenter': {
		/** Required. A random string used to generate the given signature. */
		salt?: string;
		/** Required. The time when the signature was created by Apple, in milliseconds since the epoch. */
		timestamp?: string | number;
		/** The ID of the Identity Platform tenant the user is signing in to. */
		tenantId?: string;
		/** Required. The verification signature data generated by Apple. */
		signature?: string;
		/** Required. The URL to fetch the Apple public key in order to verify the given signature is signed by Apple. */
		publicKeyUrl?: string;
		/** A valid ID token for an Identity Platform account. If present, this request will link the Game Center player ID to the account represented by this ID token. */
		idToken?: string;
		/** Required. The user's Game Center player ID. Deprecated by Apple. Pass `playerID` along with `gamePlayerID` and `teamPlayerID` to initiate the migration of a user's Game Center player ID to `gamePlayerID`. */
		playerId?: string;
		/** The user's Game Center game player ID. A unique identifier for a player of the game. https://developer.apple.com/documentation/gamekit/gkplayer/3113960-gameplayerid */
		gamePlayerId?: string;
		/** The user's Game Center display name. */
		displayName?: string;
		/** The user's Game Center team player ID. A unique identifier for a player of all the games that you distribute using your developer account. https://developer.apple.com/documentation/gamekit/gkplayer/3174857-teamplayerid */
		teamPlayerId?: string;
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
		/** The iOS app's bundle id (X-Ios-Bundle-Identifier). */
		iosBundleId: string;
	};
	'auth.accounts.signInWithIdp': {
		/** A valid Identity Platform ID token. If passed, the user's account at the IdP will be linked to the account represented by this ID token. */
		idToken?: string;
		/** The session ID returned from a previous CreateAuthUri call. This field is verified against that session ID to prevent session fixation attacks. Required if the user is signing in with an authorization response from a previous CreateAuthUri authorization request. */
		sessionId?: string;
		delegatedProjectNumber?: string | number;
		/** Required. The URL to which the IdP redirects the user back. This can be set to `http://localhost` if the user is signing in with a manually provided IdP credential. */
		requestUri?: string;
		autoCreate?: boolean;
		/** If the user is signing in with an authorization response obtained via a previous CreateAuthUri authorization request, this is the body of the HTTP POST callback from the IdP, if present. */
		postBody?: string;
		/** The ID of the Identity Platform tenant the user is signing in to. If not set, the user will sign in to the default Identity Platform project. */
		tenantId?: string;
		/** Should always be true. */
		returnSecureToken?: boolean;
		/** Whether or not to return OAuth credentials from the IdP on the following errors: `FEDERATED_USER_ID_ALREADY_LINKED` and `EMAIL_EXISTS`. */
		returnIdpCredential?: boolean;
		/** An opaque string from a previous SignInWithIdp response. If set, it can be used to repeat the sign-in operation from the previous SignInWithIdp operation. */
		pendingToken?: string;
		/** Whether or not to return the OAuth refresh token from the IdP, if available. */
		returnRefreshToken?: boolean;
		pendingIdToken?: string;
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
	};
	'auth.accounts.signInWithPassword': {
		idToken?: string;
		captchaChallenge?: string;
		/** The reCAPTCHA token provided by the reCAPTCHA client-side integration. reCAPTCHA Enterprise uses it for risk assessment. Required when reCAPTCHA Enterprise is enabled. */
		captchaResponse?: string;
		delegatedProjectNumber?: string | number;
		/** The reCAPTCHA version of the reCAPTCHA token in the captcha_response. */
		recaptchaVersion?: 'RECAPTCHA_VERSION_UNSPECIFIED' | 'RECAPTCHA_ENTERPRISE';
		instanceId?: string;
		/** The client type, web, android or ios. Required when reCAPTCHA Enterprise is enabled. */
		clientType?:
			| 'CLIENT_TYPE_UNSPECIFIED'
			| 'CLIENT_TYPE_WEB'
			| 'CLIENT_TYPE_ANDROID'
			| 'CLIENT_TYPE_IOS';
		/** Required. The email the user is signing in with. The length of email should be less than 256 characters and in the format of `name@domain.tld`. The email should also match the [RFC 822](https://tools.ietf.org/html/rfc822) addr-spec production. */
		email?: string;
		/** Should always be true. */
		returnSecureToken?: boolean;
		/** The ID of the Identity Platform tenant the user is signing in to. If not set, the user will sign in to the default Identity Platform instance in the project. */
		tenantId?: string;
		/** Required. The password the user provides to sign in to the account. */
		password?: string;
		pendingIdToken?: string;
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
	};
	'auth.accounts.signInWithPhoneNumber': {
		/** Encrypted session information from the response of sendVerificationCode. In the case of authenticating with an SMS code this must be specified, but in the case of using a temporary proof it can be unspecified. */
		sessionInfo?: string;
		/** Do not use. */
		verificationProof?: string;
		operation?:
			| 'VERIFY_OP_UNSPECIFIED'
			| 'SIGN_UP_OR_IN'
			| 'REAUTH'
			| 'UPDATE'
			| 'LINK';
		/** The user's phone number to sign in with. This is necessary in the case of uing a temporary proof, in which case it must match the phone number that was authenticated in the request that generated the temporary proof. This field is ignored if a session info is passed. */
		phoneNumber?: string;
		/** User-entered verification code from an SMS sent to the user's phone. */
		code?: string;
		/** A valid ID token for an Identity Platform account. If passed, this request will link the phone number to the user represented by this ID token if the phone number is not in use, or will reauthenticate the user if the phone number is already linked to the user. */
		idToken?: string;
		/** A proof of the phone number verification, provided from a previous signInWithPhoneNumber request. If this is passed, the caller must also pass in the phone_number field the phone number that was verified in the previous request. */
		temporaryProof?: string;
		/** The ID of the Identity Platform tenant the user is signing in to. If not set, the user will sign in to the default Identity Platform project. */
		tenantId?: string;
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
	};
	'auth.accounts.signUp': {
		/** The email to assign to the created user. The length of the email should be less than 256 characters and in the format of `name@domain.tld`. The email should also match the [RFC 822](https://tools.ietf.org/html/rfc822) addr-spec production. An anonymous user will be created if not provided. */
		email?: string;
		/** The password to assign to the created user. The password must be be at least 6 characters long. If set, the `email` field must also be set. */
		password?: string;
		/** The profile photo url of the user to create. */
		photoUrl?: string;
		instanceId?: string;
		/** The project ID of the project which the user should belong to. Specifying this field requires a Google OAuth 2.0 credential with the proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		targetProjectId?: string;
		/** The ID of the user to create. The ID must be unique within the project that the user is being created under. Specifying this field requires a Google OAuth 2.0 credential with the proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		localId?: string;
		/** The ID of the Identity Platform tenant to create a user under. If not set, the user will be created under the default Identity Platform project. */
		tenantId?: string;
		/** Whether the user's email is verified. Specifying this field requires a Google OAuth 2.0 credential with the proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		emailVerified?: boolean;
		captchaChallenge?: string;
		/** The multi-factor authentication providers for the user to create. */
		mfaInfo?: Array<FirebaseGoogleCloudIdentitytoolkitV1MfaFactorInput>;
		/** Whether the user will be disabled upon creation. Disabled accounts are inaccessible except for requests bearing a Google OAuth2 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		disabled?: boolean;
		/** The client type: web, Android or iOS. Required when enabling reCAPTCHA enterprise protection. */
		clientType?:
			| 'CLIENT_TYPE_UNSPECIFIED'
			| 'CLIENT_TYPE_WEB'
			| 'CLIENT_TYPE_ANDROID'
			| 'CLIENT_TYPE_IOS';
		/** The display name of the user to be created. */
		displayName?: string;
		/** A valid ID token for an Identity Platform user. If set, this request will link the authentication credential to the user represented by this ID token. For a non-admin request, both the `email` and `password` fields must be set. For an admin request, `local_id` must not be set. */
		idToken?: string;
		/** The reCAPTCHA version of the reCAPTCHA token in the captcha_response. */
		recaptchaVersion?: 'RECAPTCHA_VERSION_UNSPECIFIED' | 'RECAPTCHA_ENTERPRISE';
		/** The reCAPTCHA token provided by the reCAPTCHA client-side integration. reCAPTCHA Enterprise uses it for assessment. Required when reCAPTCHA enterprise is enabled. */
		captchaResponse?: string;
		/** The phone number of the user to create. Specifying this field requires a Google OAuth 2.0 credential with the proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		phoneNumber?: string;
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
	};
	'auth.accounts.update': {
		/** Whether the user's email has been verified. Specifying this field requires a Google OAuth 2.0 credential with proper [permissions] (https://cloud.google.com/identity-platform/docs/access-control). */
		emailVerified?: boolean;
		/** The user's new email to be updated in the account's attributes. The length of email should be less than 256 characters and in the format of `name@domain.tld`. The email should also match the [RFC 822](https://tools.ietf.org/html/rfc822) addr-spec production. */
		email?: string;
		/** The ID of the user. Specifying this field requires a Google OAuth 2.0 credential with proper [permissions] (https://cloud.google.com/identity-platform/docs/access-control). For requests from end-users, an ID token should be passed instead. */
		localId?: string;
		/** The multi-factor authentication related information to be set on the user's account. This will overwrite any previous multi-factor related information on the account. */
		mfa?: FirebaseGoogleCloudIdentitytoolkitV1MfaInfoInput;
		captchaChallenge?: string;
		/** The phone number to be updated in the account's attributes. */
		phoneNumber?: string;
		/** Whether the account should be restricted to only using federated login. */
		upgradeToFederatedLogin?: boolean;
		/** Specifies the minimum timestamp in seconds for an Identity Platform ID token to be considered valid. */
		validSince?: string | number;
		/** The timestamp in milliseconds when the account last logged in. */
		lastLoginAt?: string | number;
		/** The response from reCaptcha challenge. This is required when the system detects possible abuse activities. */
		captchaResponse?: string;
		delegatedProjectNumber?: string | number;
		/** The timestamp in milliseconds when the account was created. */
		createdAt?: string | number;
		/** JSON formatted custom attributes to be stored in the Identity Platform ID token. Specifying this field requires a Google OAuth 2.0 credential with proper [permissions] (https://cloud.google.com/identity-platform/docs/access-control). */
		customAttributes?: string;
		/** The Identity Providers that the account should be associated with. */
		provider?: Array<string>;
		/** The tenant ID of the Identity Platform tenant that the account belongs to. Requests from end users should pass an Identity Platform ID token rather than setting this field. */
		tenantId?: string;
		instanceId?: string;
		/** The Identity Providers to unlink from the user's account. */
		deleteProvider?: Array<string>;
		/** The user's new display name to be updated in the account's attributes. The length of the display name must be less than or equal to 256 characters. */
		displayName?: string;
		/** The account's attributes to be deleted. */
		deleteAttribute?: Array<
			| 'USER_ATTRIBUTE_NAME_UNSPECIFIED'
			| 'EMAIL'
			| 'DISPLAY_NAME'
			| 'PROVIDER'
			| 'PHOTO_URL'
			| 'PASSWORD'
			| 'RAW_USER_INFO'
		>;
		/** The project ID for the project that the account belongs to. Specifying this field requires Google OAuth 2.0 credential with proper [permissions] (https://cloud.google.com/identity-platform/docs/access-control). Requests from end users should pass an Identity Platform ID token instead. */
		targetProjectId?: string;
		/** The out-of-band code to be applied on the user's account. The following out-of-band code types are supported: * VERIFY_EMAIL * RECOVER_EMAIL * REVERT_SECOND_FACTOR_ADDITION * VERIFY_AND_CHANGE_EMAIL */
		oobCode?: string;
		/** Whether or not to return an ID and refresh token. Should always be true. */
		returnSecureToken?: boolean;
		/** The user's new password to be updated in the account's attributes. The password must be at least 6 characters long. */
		password?: string;
		/** The user's new photo URL for the account's profile photo to be updated in the account's attributes. The length of the URL must be less than or equal to 2048 characters. */
		photoUrl?: string;
		/** A valid Identity Platform ID token. Required when attempting to change user-related information. */
		idToken?: string;
		/** The provider to be linked to the user's account. Specifying this field requires a Google OAuth 2.0 credential with proper [permissions] (https://cloud.google.com/identity-platform/docs/access-control). */
		linkProviderUserInfo?: FirebaseGoogleCloudIdentitytoolkitV1ProviderUserInfoInput;
		/** If true, marks the account as disabled, meaning the user will no longer be able to sign-in. */
		disableUser?: boolean;
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
	};
	'auth.accounts.verifyIosClient': {
		/** A device token that the iOS client gets after registering to APNs (Apple Push Notification service). */
		appToken?: string;
		/** Whether the app token is in the iOS sandbox. If false, the app token is in the production environment. */
		isSandbox?: boolean;
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
		/** The iOS app's bundle id (X-Ios-Bundle-Identifier). */
		iosBundleId: string;
	};
	'auth.getProjects': {
		/** The Firebase app ID, for applications that use Firebase. This can be found in the Firebase console for your project. If set, a check will be performed to ensure that the app ID is valid for the retrieved project. If not valid, the request will be rejected with a client error. */
		firebaseAppId?: string;
		/** The RP OAuth client ID. If set, a check will be performed to ensure that the OAuth client is valid for the retrieved project and the request rejected with a client error if not valid. */
		clientId?: string;
		/** Project Number of the delegated project request. This field should only be used as part of the Firebase V1 migration. */
		delegatedProjectNumber?: string | number;
		/** SHA-1 Android application cert hash. If set, a check will be performed to ensure that the cert hash is valid for the retrieved project and android_package_name. */
		sha1Cert?: string;
		/** iOS bundle id to check against the real ios bundle id. If this field is provided, the action will throw an error if this does not match the real iOS bundle id. */
		iosBundleId?: string;
		/** Android package name to check against the real android package name. If this field is provided, and sha1_cert_hash is not provided, the action will throw an error if this does not match the real android package name. */
		androidPackageName?: string;
		/** Whether dynamic link should be returned. */
		returnDynamicLink?: boolean;
		/** Project number of the configuration to retrieve. This field is deprecated and should not be used by new integrations. */
		projectNumber?: string | number;
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
	};
	'auth.getPublicKeys': {
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
	};
	'auth.getRecaptchaParams': {
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
	};
	'auth.getSessionCookiePublicKeys': {
		/** The project's Web API key (Firebase console > Project settings > General). The client sign-in calls need it; with the service account alone Google may refuse them. */
		apiKey?: string;
	};
	'auth.projects.accounts.batchCreate': {
		/** The Project ID of the Identity Platform project which the account belongs to. Format: `<id>`. */
		targetProjectId: string;
		/** The CPU memory cost parameter to be used by the STANDARD_SCRYPT hashing function. This parameter, along with block_size and cpu_mem_cost help tune the resources needed to hash a password, and should be tuned as processor speeds and memory technologies advance. */
		cpuMemCost?: number;
		/** Required. The hashing function used to hash the account passwords. Must be one of the following: * HMAC_SHA256 * HMAC_SHA1 * HMAC_MD5 * SCRYPT * PBKDF_SHA1 * MD5 * HMAC_SHA512 * SHA1 * BCRYPT * PBKDF2_SHA256 * SHA256 * SHA512 * STANDARD_SCRYPT * ARGON2 */
		hashAlgorithm?: string;
		/** Password and salt order when verify password. */
		passwordHashOrder?:
			| 'UNSPECIFIED_ORDER'
			| 'SALT_AND_PASSWORD'
			| 'PASSWORD_AND_SALT';
		/** The parallelization cost parameter to be used by the STANDARD_SCRYPT hashing function. This parameter, along with block_size and cpu_mem_cost help tune the resources needed to hash a password, and should be tuned as processor speeds and memory technologies advance. */
		parallelization?: number;
		/** The desired key length for the STANDARD_SCRYPT hashing function. Must be at least 1. */
		dkLen?: number;
		/** One or more bytes to be inserted between the salt and plain text password. For stronger security, this should be a single non-printable character. (base64) */
		saltSeparator?: string;
		/** A list of accounts to upload. `local_id` is required for each user; everything else is optional. */
		users?: Array<FirebaseGoogleCloudIdentitytoolkitV1UserInfoInput>;
		/** The signer key used to hash the password. Required for the following hashing functions: * SCRYPT, * HMAC_MD5, * HMAC_SHA1, * HMAC_SHA256, * HMAC_SHA512 (base64) */
		signerKey?: string;
		/** If true, the service will do the following list of checks before an account is uploaded: * Duplicate emails * Duplicate federated IDs * Federated ID provider validation If the duplication exists within the list of accounts to be uploaded, it will prevent the entire list from being uploaded. */
		sanityCheck?: boolean;
		/** The number of rounds used for hash calculation. Only required for the following hashing functions: * MD5 * SHA1 * SHA256 * SHA512 * PBKDF_SHA1 * PBKDF2_SHA256 * SCRYPT */
		rounds?: number;
		/** The ID of the Identity Platform tenant the account belongs to. */
		tenantId?: string;
		/** Memory cost for hash calculation. Only required when the hashing function is SCRYPT. */
		memoryCost?: number;
		/** The parameters for Argon2 hashing algorithm. */
		argon2Parameters?: FirebaseGoogleCloudIdentitytoolkitV1Argon2ParametersInput;
		/** The block size parameter used by the STANDARD_SCRYPT hashing function. This parameter, along with parallelization and cpu_mem_cost help tune the resources needed to hash a password, and should be tuned as processor speeds and memory technologies advance. */
		blockSize?: number;
		/** Whether to overwrite an existing account in Identity Platform with a matching `local_id` in the request. If true, the existing account will be overwritten. If false, an error will be returned. */
		allowOverwrite?: boolean;
		delegatedProjectNumber?: string | number;
	};
	'auth.projects.accounts.batchDelete': {
		/** If `tenant_id` is specified, the ID of the Google Cloud project that the Identity Platform tenant belongs to. Otherwise, the ID of the Google Cloud project that accounts belong to. Format: `<id>`. */
		targetProjectId: string;
		/** If the accounts belong to an Identity Platform tenant, the ID of the tenant. If the accounts belong to a default Identity Platform project, the field is not needed. */
		tenantId?: string;
		/** Whether to force deleting accounts that are not in disabled state. If false, only disabled accounts will be deleted, and accounts that are not disabled will be added to the `errors`. */
		force?: boolean;
		/** Required. List of user IDs to be deleted. */
		localIds?: Array<string>;
	};
	'auth.projects.accounts.batchGet': {
		/** The ID of the Identity Platform tenant the accounts belongs to. If not specified, accounts on the Identity Platform project are returned. */
		tenantId?: string;
		/** The maximum number of results to return. Must be at least 1 and no greater than 1000. By default, it is 20. */
		maxResults?: number;
		/** The pagination token from the response of a previous request. */
		nextPageToken?: string;
		/** If `tenant_id` is specified, the ID of the Google Cloud project that the Identity Platform tenant belongs to. Otherwise, the ID of the Google Cloud project that the accounts belong to. Format: `<id>`. */
		targetProjectId: string;
		delegatedProjectNumber?: string | number;
	};
	'auth.projects.accounts.create': {
		/** The project ID of the project which the user should belong to. Specifying this field requires a Google OAuth 2.0 credential with the proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		targetProjectId: string;
		/** The email to assign to the created user. The length of the email should be less than 256 characters and in the format of `name@domain.tld`. The email should also match the [RFC 822](https://tools.ietf.org/html/rfc822) addr-spec production. An anonymous user will be created if not provided. */
		email?: string;
		/** The password to assign to the created user. The password must be be at least 6 characters long. If set, the `email` field must also be set. */
		password?: string;
		/** The profile photo url of the user to create. */
		photoUrl?: string;
		instanceId?: string;
		/** The project ID of the project which the user should belong to. Specifying this field requires a Google OAuth 2.0 credential with the proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		body_targetProjectId?: string;
		/** The ID of the user to create. The ID must be unique within the project that the user is being created under. Specifying this field requires a Google OAuth 2.0 credential with the proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		localId?: string;
		/** The ID of the Identity Platform tenant to create a user under. If not set, the user will be created under the default Identity Platform project. */
		tenantId?: string;
		/** Whether the user's email is verified. Specifying this field requires a Google OAuth 2.0 credential with the proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		emailVerified?: boolean;
		captchaChallenge?: string;
		/** The multi-factor authentication providers for the user to create. */
		mfaInfo?: Array<FirebaseGoogleCloudIdentitytoolkitV1MfaFactorInput>;
		/** Whether the user will be disabled upon creation. Disabled accounts are inaccessible except for requests bearing a Google OAuth2 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		disabled?: boolean;
		/** The client type: web, Android or iOS. Required when enabling reCAPTCHA enterprise protection. */
		clientType?:
			| 'CLIENT_TYPE_UNSPECIFIED'
			| 'CLIENT_TYPE_WEB'
			| 'CLIENT_TYPE_ANDROID'
			| 'CLIENT_TYPE_IOS';
		/** The display name of the user to be created. */
		displayName?: string;
		/** A valid ID token for an Identity Platform user. If set, this request will link the authentication credential to the user represented by this ID token. For a non-admin request, both the `email` and `password` fields must be set. For an admin request, `local_id` must not be set. */
		idToken?: string;
		/** The reCAPTCHA version of the reCAPTCHA token in the captcha_response. */
		recaptchaVersion?: 'RECAPTCHA_VERSION_UNSPECIFIED' | 'RECAPTCHA_ENTERPRISE';
		/** The reCAPTCHA token provided by the reCAPTCHA client-side integration. reCAPTCHA Enterprise uses it for assessment. Required when reCAPTCHA enterprise is enabled. */
		captchaResponse?: string;
		/** The phone number of the user to create. Specifying this field requires a Google OAuth 2.0 credential with the proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		phoneNumber?: string;
	};
	'auth.projects.accounts.delete': {
		/** The ID of the project which the account belongs to. Should only be specified in authenticated requests that specify local_id of an account. Format: `<id>`. */
		targetProjectId: string;
		delegatedProjectNumber?: string | number;
		/** The ID of the project which the account belongs to. Should only be specified in authenticated requests that specify local_id of an account. */
		body_targetProjectId?: string;
		/** The Identity Platform ID token of the account to delete. Require to be specified for requests from end users that lack Google OAuth 2.0 credential. Authenticated requests bearing a Google OAuth2 credential with proper permissions may pass local_id to specify the account to delete alternatively. */
		idToken?: string;
		/** The ID of the tenant that the account belongs to, if applicable. Only require to be specified for authenticated requests bearing a Google OAuth 2.0 credential that specify local_id of an account that belongs to an Identity Platform tenant. */
		tenantId?: string;
		/** The ID of user account to delete. Specifying this field requires a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). Requests from users lacking the credential should pass an ID token instead. */
		localId?: string;
	};
	'auth.projects.accounts.lookup': {
		/** The ID of the Google Cloud project that the account or the Identity Platform tenant specified by `tenant_id` belongs to. */
		targetProjectId: string;
		/** The phone number of one or more accounts to fetch. Should only be specified by authenticated requests from a developer and should be in E.164 format, for example, +15555555555. */
		phoneNumber?: Array<string>;
		/** The ID of the tenant that the account belongs to. Should only be specified by authenticated requests from a developer. */
		tenantId?: string;
		/** The initial email of one or more accounts to fetch. The length of email should be less than 256 characters and in the format of `name@domain.tld`. The email should also match the [RFC 822](https://tools.ietf.org/html/rfc822) addr-spec production. */
		initialEmail?: Array<string>;
		/** The ID of the Google Cloud project that the account or the Identity Platform tenant specified by `tenant_id` belongs to. Should only be specified by authenticated requests bearing a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		body_targetProjectId?: string;
		/** The email address of one or more accounts to fetch. The length of email should be less than 256 characters and in the format of `name@domain.tld`. The email should also match the [RFC 822](https://tools.ietf.org/html/rfc822) addr-spec production. */
		email?: Array<string>;
		delegatedProjectNumber?: string | number;
		/** The ID of one or more accounts to fetch. Should only be specified by authenticated requests bearing a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		localId?: Array<string>;
		/** The Identity Platform ID token of the account to fetch. Require to be specified for requests from end users. */
		idToken?: string;
		/** The federated user identifier of one or more accounts to fetch. Should only be specified by authenticated requests bearing a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		federatedUserId?: Array<FirebaseGoogleCloudIdentitytoolkitV1FederatedUserIdentifierInput>;
	};
	'auth.projects.accounts.query': {
		/** The ID of the project to which the result is scoped. Format: `<id>`. */
		targetProjectId: string;
		/** If `true`, this request will return the accounts matching the query. If `false`, only the __count__ of accounts matching the query will be returned. Defaults to `true`. */
		returnUserInfo?: boolean;
		/** The maximum number of accounts to return with an upper limit of __500__. Defaults to _500_. Only valid when `return_user_info` is set to `true`. */
		limit?: string | number;
		/** The field to use for sorting user accounts. Defaults to `USER_ID`. Note: when `phone_number` is specified in `expression`, the result ignores the sorting. Only valid when `return_user_info` is set to `true`. */
		sortBy?:
			| 'SORT_BY_FIELD_UNSPECIFIED'
			| 'USER_ID'
			| 'NAME'
			| 'CREATED_AT'
			| 'LAST_LOGIN_AT'
			| 'USER_EMAIL';
		/** Query conditions used to filter results. If more than one is passed, only the first SqlExpression is evaluated. */
		expression?: Array<FirebaseGoogleCloudIdentitytoolkitV1SqlExpressionInput>;
		/** The ID of the tenant to which the result is scoped. */
		tenantId?: string;
		/** The order for sorting query result. Defaults to __ascending__ order. Only valid when `return_user_info` is set to `true`. */
		order?: 'ORDER_UNSPECIFIED' | 'ASC' | 'DESC';
		/** The number of accounts to skip from the beginning of matching records. Only valid when `return_user_info` is set to `true`. */
		offset?: string | number;
	};
	'auth.projects.accounts.sendOobCode': {
		/** The Project ID of the Identity Platform project which the account belongs to. To specify this field, it requires a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). Format: `<id>`. */
		targetProjectId: string;
		/** For a PASSWORD_RESET request, a reCaptcha response is required when the system detects possible abuse activity. In those cases, this is the response from the reCaptcha challenge used to verify the caller. */
		captchaResp?: string;
		/** The account's email address to send the OOB code to, and generally the email address of the account that needs to be updated. Required for PASSWORD_RESET, EMAIL_SIGNIN, and VERIFY_EMAIL. Only required for VERIFY_AND_CHANGE_EMAIL requests when return_oob_link is set to true. */
		email?: string;
		/** The client type: web, Android or iOS. Required when reCAPTCHA Enterprise protection is enabled. */
		clientType?:
			| 'CLIENT_TYPE_UNSPECIFIED'
			| 'CLIENT_TYPE_WEB'
			| 'CLIENT_TYPE_ANDROID'
			| 'CLIENT_TYPE_IOS';
		/** The Project ID of the Identity Platform project which the account belongs to. To specify this field, it requires a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		body_targetProjectId?: string;
		/** The Url to continue after user clicks the link sent in email. This is the url that will allow the web widget to handle the OOB code. */
		continueUrl?: string;
		/** The tenant ID of the Identity Platform tenant the account belongs to. */
		tenantId?: string;
		/** If an associated android app can handle the OOB code, the minimum version of the app. If the version on the device is lower than this version then the user is taken to Google Play Store to upgrade the app. */
		androidMinimumVersion?: string;
		/** In order to ensure that the url used can be easily opened up in iOS or android, we create a [Firebase Dynamic Link](https://firebase.google.com/docs/dynamic-links). Most Identity Platform projects will only have one Dynamic Link domain enabled, and can leave this field blank. */
		dynamicLinkDomain?: string;
		/** An ID token for the account. It is required for VERIFY_AND_CHANGE_EMAIL and VERIFY_EMAIL requests unless return_oob_link is set to true. */
		idToken?: string;
		challenge?: string;
		/** Required. The type of out-of-band (OOB) code to send. Depending on this value, other fields in this request will be required and/or have different meanings. There are 4 different OOB codes that can be sent: * PASSWORD_RESET * EMAIL_SIGNIN * VERIFY_EMAIL * VERIFY_AND_CHANGE_EMAIL */
		requestType?:
			| 'OOB_REQ_TYPE_UNSPECIFIED'
			| 'PASSWORD_RESET'
			| 'OLD_EMAIL_AGREE'
			| 'NEW_EMAIL_ACCEPT'
			| 'VERIFY_EMAIL'
			| 'RECOVER_EMAIL'
			| 'EMAIL_SIGNIN'
			| 'VERIFY_AND_CHANGE_EMAIL'
			| 'REVERT_SECOND_FACTOR_ADDITION';
		/** When set to true, the OOB code link will be be sent as a Universal Link or an Android App Link and will be opened by the corresponding app if installed. If not set, or set to false, the OOB code will be sent to the web widget first and then on continue will redirect to the app if installed. */
		canHandleCodeInApp?: boolean;
		/** The email address the account is being updated to. Required only for VERIFY_AND_CHANGE_EMAIL requests. */
		newEmail?: string;
		/** If an associated iOS app can handle the OOB code, the iOS bundle id of this app. This will allow the correct app to open if it is already installed. */
		iOSBundleId?: string;
		/** If an associated iOS app can handle the OOB code, the App Store id of this app. This will allow App Store to open to the correct app if the app is not yet installed. */
		iOSAppStoreId?: string;
		/** The reCAPTCHA version of the reCAPTCHA token in the captcha_response. */
		recaptchaVersion?: 'RECAPTCHA_VERSION_UNSPECIFIED' | 'RECAPTCHA_ENTERPRISE';
		/** If an associated android app can handle the OOB code, the Android package name of the android app that will handle the callback when this OOB code is used. */
		androidPackageName?: string;
		/** The IP address of the caller. Required only for PASSWORD_RESET requests. */
		userIp?: string;
		/** Optional. In order to ensure that the url used can be easily opened in iOS or Android, we create a Hosting link '/__/auth/links'. This optional field contains the domain to use when constructing a Hosting link. If not set, '.firebaseapp.com' domain will be used. */
		linkDomain?: string;
		/** If an associated android app can handle the OOB code, whether or not to install the android app on the device where the link is opened if the app is not already installed. */
		androidInstallApp?: boolean;
		/** Whether the confirmation link containing the OOB code should be returned in the response (no email is sent). Used when a developer wants to construct the email template and send it on their own. */
		returnOobLink?: boolean;
	};
	'auth.projects.accounts.update': {
		/** The project ID for the project that the account belongs to. Specifying this field requires Google OAuth 2.0 credential with proper [permissions] (https://cloud.google.com/identity-platform/docs/access-control). Requests from end users should pass an Identity Platform ID token instead. */
		targetProjectId: string;
		/** Whether the user's email has been verified. Specifying this field requires a Google OAuth 2.0 credential with proper [permissions] (https://cloud.google.com/identity-platform/docs/access-control). */
		emailVerified?: boolean;
		/** The user's new email to be updated in the account's attributes. The length of email should be less than 256 characters and in the format of `name@domain.tld`. The email should also match the [RFC 822](https://tools.ietf.org/html/rfc822) addr-spec production. */
		email?: string;
		/** The ID of the user. Specifying this field requires a Google OAuth 2.0 credential with proper [permissions] (https://cloud.google.com/identity-platform/docs/access-control). For requests from end-users, an ID token should be passed instead. */
		localId?: string;
		/** The multi-factor authentication related information to be set on the user's account. This will overwrite any previous multi-factor related information on the account. */
		mfa?: FirebaseGoogleCloudIdentitytoolkitV1MfaInfoInput;
		captchaChallenge?: string;
		/** The phone number to be updated in the account's attributes. */
		phoneNumber?: string;
		/** Whether the account should be restricted to only using federated login. */
		upgradeToFederatedLogin?: boolean;
		/** Specifies the minimum timestamp in seconds for an Identity Platform ID token to be considered valid. */
		validSince?: string | number;
		/** The timestamp in milliseconds when the account last logged in. */
		lastLoginAt?: string | number;
		/** The response from reCaptcha challenge. This is required when the system detects possible abuse activities. */
		captchaResponse?: string;
		delegatedProjectNumber?: string | number;
		/** The timestamp in milliseconds when the account was created. */
		createdAt?: string | number;
		/** JSON formatted custom attributes to be stored in the Identity Platform ID token. Specifying this field requires a Google OAuth 2.0 credential with proper [permissions] (https://cloud.google.com/identity-platform/docs/access-control). */
		customAttributes?: string;
		/** The Identity Providers that the account should be associated with. */
		provider?: Array<string>;
		/** The tenant ID of the Identity Platform tenant that the account belongs to. Requests from end users should pass an Identity Platform ID token rather than setting this field. */
		tenantId?: string;
		instanceId?: string;
		/** The Identity Providers to unlink from the user's account. */
		deleteProvider?: Array<string>;
		/** The user's new display name to be updated in the account's attributes. The length of the display name must be less than or equal to 256 characters. */
		displayName?: string;
		/** The account's attributes to be deleted. */
		deleteAttribute?: Array<
			| 'USER_ATTRIBUTE_NAME_UNSPECIFIED'
			| 'EMAIL'
			| 'DISPLAY_NAME'
			| 'PROVIDER'
			| 'PHOTO_URL'
			| 'PASSWORD'
			| 'RAW_USER_INFO'
		>;
		/** The project ID for the project that the account belongs to. Specifying this field requires Google OAuth 2.0 credential with proper [permissions] (https://cloud.google.com/identity-platform/docs/access-control). Requests from end users should pass an Identity Platform ID token instead. */
		body_targetProjectId?: string;
		/** The out-of-band code to be applied on the user's account. The following out-of-band code types are supported: * VERIFY_EMAIL * RECOVER_EMAIL * REVERT_SECOND_FACTOR_ADDITION * VERIFY_AND_CHANGE_EMAIL */
		oobCode?: string;
		/** Whether or not to return an ID and refresh token. Should always be true. */
		returnSecureToken?: boolean;
		/** The user's new password to be updated in the account's attributes. The password must be at least 6 characters long. */
		password?: string;
		/** The user's new photo URL for the account's profile photo to be updated in the account's attributes. The length of the URL must be less than or equal to 2048 characters. */
		photoUrl?: string;
		/** A valid Identity Platform ID token. Required when attempting to change user-related information. */
		idToken?: string;
		/** The provider to be linked to the user's account. Specifying this field requires a Google OAuth 2.0 credential with proper [permissions] (https://cloud.google.com/identity-platform/docs/access-control). */
		linkProviderUserInfo?: FirebaseGoogleCloudIdentitytoolkitV1ProviderUserInfoInput;
		/** If true, marks the account as disabled, meaning the user will no longer be able to sign-in. */
		disableUser?: boolean;
	};
	'auth.projects.createSessionCookie': {
		/** The ID of the project that the account belongs to. Format: `<id>`. */
		targetProjectId: string;
		/** Required. A valid Identity Platform ID token. */
		idToken?: string;
		/** The number of seconds until the session cookie expires. Specify a duration in seconds, between five minutes and fourteen days, inclusively. */
		validDuration?: string | number;
		/** The tenant ID of the Identity Platform tenant the account belongs to. */
		tenantId?: string;
	};
	'auth.projects.queryAccounts': {
		/** The ID of the project to which the result is scoped. Format: `<id>`. */
		targetProjectId: string;
		/** If `true`, this request will return the accounts matching the query. If `false`, only the __count__ of accounts matching the query will be returned. Defaults to `true`. */
		returnUserInfo?: boolean;
		/** The maximum number of accounts to return with an upper limit of __500__. Defaults to _500_. Only valid when `return_user_info` is set to `true`. */
		limit?: string | number;
		/** The field to use for sorting user accounts. Defaults to `USER_ID`. Note: when `phone_number` is specified in `expression`, the result ignores the sorting. Only valid when `return_user_info` is set to `true`. */
		sortBy?:
			| 'SORT_BY_FIELD_UNSPECIFIED'
			| 'USER_ID'
			| 'NAME'
			| 'CREATED_AT'
			| 'LAST_LOGIN_AT'
			| 'USER_EMAIL';
		/** Query conditions used to filter results. If more than one is passed, only the first SqlExpression is evaluated. */
		expression?: Array<FirebaseGoogleCloudIdentitytoolkitV1SqlExpressionInput>;
		/** The ID of the tenant to which the result is scoped. */
		tenantId?: string;
		/** The order for sorting query result. Defaults to __ascending__ order. Only valid when `return_user_info` is set to `true`. */
		order?: 'ORDER_UNSPECIFIED' | 'ASC' | 'DESC';
		/** The number of accounts to skip from the beginning of matching records. Only valid when `return_user_info` is set to `true`. */
		offset?: string | number;
	};
	'auth.projects.tenants.accounts.batchCreate': {
		/** The ID of the Identity Platform tenant the account belongs to. Format: `<id>`. */
		tenantId: string;
		/** The Project ID of the Identity Platform project which the account belongs to. Format: `<id>`. */
		targetProjectId: string;
		/** The CPU memory cost parameter to be used by the STANDARD_SCRYPT hashing function. This parameter, along with block_size and cpu_mem_cost help tune the resources needed to hash a password, and should be tuned as processor speeds and memory technologies advance. */
		cpuMemCost?: number;
		/** Required. The hashing function used to hash the account passwords. Must be one of the following: * HMAC_SHA256 * HMAC_SHA1 * HMAC_MD5 * SCRYPT * PBKDF_SHA1 * MD5 * HMAC_SHA512 * SHA1 * BCRYPT * PBKDF2_SHA256 * SHA256 * SHA512 * STANDARD_SCRYPT * ARGON2 */
		hashAlgorithm?: string;
		/** Password and salt order when verify password. */
		passwordHashOrder?:
			| 'UNSPECIFIED_ORDER'
			| 'SALT_AND_PASSWORD'
			| 'PASSWORD_AND_SALT';
		/** The parallelization cost parameter to be used by the STANDARD_SCRYPT hashing function. This parameter, along with block_size and cpu_mem_cost help tune the resources needed to hash a password, and should be tuned as processor speeds and memory technologies advance. */
		parallelization?: number;
		/** The desired key length for the STANDARD_SCRYPT hashing function. Must be at least 1. */
		dkLen?: number;
		/** One or more bytes to be inserted between the salt and plain text password. For stronger security, this should be a single non-printable character. (base64) */
		saltSeparator?: string;
		/** A list of accounts to upload. `local_id` is required for each user; everything else is optional. */
		users?: Array<FirebaseGoogleCloudIdentitytoolkitV1UserInfoInput>;
		/** The signer key used to hash the password. Required for the following hashing functions: * SCRYPT, * HMAC_MD5, * HMAC_SHA1, * HMAC_SHA256, * HMAC_SHA512 (base64) */
		signerKey?: string;
		/** If true, the service will do the following list of checks before an account is uploaded: * Duplicate emails * Duplicate federated IDs * Federated ID provider validation If the duplication exists within the list of accounts to be uploaded, it will prevent the entire list from being uploaded. */
		sanityCheck?: boolean;
		/** The number of rounds used for hash calculation. Only required for the following hashing functions: * MD5 * SHA1 * SHA256 * SHA512 * PBKDF_SHA1 * PBKDF2_SHA256 * SCRYPT */
		rounds?: number;
		/** The ID of the Identity Platform tenant the account belongs to. */
		body_tenantId?: string;
		/** Memory cost for hash calculation. Only required when the hashing function is SCRYPT. */
		memoryCost?: number;
		/** The parameters for Argon2 hashing algorithm. */
		argon2Parameters?: FirebaseGoogleCloudIdentitytoolkitV1Argon2ParametersInput;
		/** The block size parameter used by the STANDARD_SCRYPT hashing function. This parameter, along with parallelization and cpu_mem_cost help tune the resources needed to hash a password, and should be tuned as processor speeds and memory technologies advance. */
		blockSize?: number;
		/** Whether to overwrite an existing account in Identity Platform with a matching `local_id` in the request. If true, the existing account will be overwritten. If false, an error will be returned. */
		allowOverwrite?: boolean;
		delegatedProjectNumber?: string | number;
	};
	'auth.projects.tenants.accounts.batchDelete': {
		/** If `tenant_id` is specified, the ID of the Google Cloud project that the Identity Platform tenant belongs to. Otherwise, the ID of the Google Cloud project that accounts belong to. Format: `<id>`. */
		targetProjectId: string;
		/** If the accounts belong to an Identity Platform tenant, the ID of the tenant. If the accounts belong to a default Identity Platform project, the field is not needed. Format: `<id>`. */
		tenantId: string;
		/** If the accounts belong to an Identity Platform tenant, the ID of the tenant. If the accounts belong to a default Identity Platform project, the field is not needed. */
		body_tenantId?: string;
		/** Whether to force deleting accounts that are not in disabled state. If false, only disabled accounts will be deleted, and accounts that are not disabled will be added to the `errors`. */
		force?: boolean;
		/** Required. List of user IDs to be deleted. */
		localIds?: Array<string>;
	};
	'auth.projects.tenants.accounts.batchGet': {
		delegatedProjectNumber?: string | number;
		/** The pagination token from the response of a previous request. */
		nextPageToken?: string;
		/** The maximum number of results to return. Must be at least 1 and no greater than 1000. By default, it is 20. */
		maxResults?: number;
		/** If `tenant_id` is specified, the ID of the Google Cloud project that the Identity Platform tenant belongs to. Otherwise, the ID of the Google Cloud project that the accounts belong to. Format: `<id>`. */
		targetProjectId: string;
		/** The ID of the Identity Platform tenant the accounts belongs to. If not specified, accounts on the Identity Platform project are returned. Format: `<id>`. */
		tenantId: string;
	};
	'auth.projects.tenants.accounts.create': {
		/** The project ID of the project which the user should belong to. Specifying this field requires a Google OAuth 2.0 credential with the proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		targetProjectId: string;
		/** The ID of the Identity Platform tenant to create a user under. If not set, the user will be created under the default Identity Platform project. Format: `<id>`. */
		tenantId: string;
		/** The email to assign to the created user. The length of the email should be less than 256 characters and in the format of `name@domain.tld`. The email should also match the [RFC 822](https://tools.ietf.org/html/rfc822) addr-spec production. An anonymous user will be created if not provided. */
		email?: string;
		/** The password to assign to the created user. The password must be be at least 6 characters long. If set, the `email` field must also be set. */
		password?: string;
		/** The profile photo url of the user to create. */
		photoUrl?: string;
		instanceId?: string;
		/** The project ID of the project which the user should belong to. Specifying this field requires a Google OAuth 2.0 credential with the proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		body_targetProjectId?: string;
		/** The ID of the user to create. The ID must be unique within the project that the user is being created under. Specifying this field requires a Google OAuth 2.0 credential with the proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		localId?: string;
		/** The ID of the Identity Platform tenant to create a user under. If not set, the user will be created under the default Identity Platform project. */
		body_tenantId?: string;
		/** Whether the user's email is verified. Specifying this field requires a Google OAuth 2.0 credential with the proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		emailVerified?: boolean;
		captchaChallenge?: string;
		/** The multi-factor authentication providers for the user to create. */
		mfaInfo?: Array<FirebaseGoogleCloudIdentitytoolkitV1MfaFactorInput>;
		/** Whether the user will be disabled upon creation. Disabled accounts are inaccessible except for requests bearing a Google OAuth2 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		disabled?: boolean;
		/** The client type: web, Android or iOS. Required when enabling reCAPTCHA enterprise protection. */
		clientType?:
			| 'CLIENT_TYPE_UNSPECIFIED'
			| 'CLIENT_TYPE_WEB'
			| 'CLIENT_TYPE_ANDROID'
			| 'CLIENT_TYPE_IOS';
		/** The display name of the user to be created. */
		displayName?: string;
		/** A valid ID token for an Identity Platform user. If set, this request will link the authentication credential to the user represented by this ID token. For a non-admin request, both the `email` and `password` fields must be set. For an admin request, `local_id` must not be set. */
		idToken?: string;
		/** The reCAPTCHA version of the reCAPTCHA token in the captcha_response. */
		recaptchaVersion?: 'RECAPTCHA_VERSION_UNSPECIFIED' | 'RECAPTCHA_ENTERPRISE';
		/** The reCAPTCHA token provided by the reCAPTCHA client-side integration. reCAPTCHA Enterprise uses it for assessment. Required when reCAPTCHA enterprise is enabled. */
		captchaResponse?: string;
		/** The phone number of the user to create. Specifying this field requires a Google OAuth 2.0 credential with the proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		phoneNumber?: string;
	};
	'auth.projects.tenants.accounts.delete': {
		/** The ID of the project which the account belongs to. Should only be specified in authenticated requests that specify local_id of an account. Format: `<id>`. */
		targetProjectId: string;
		/** The ID of the tenant that the account belongs to, if applicable. Only require to be specified for authenticated requests bearing a Google OAuth 2.0 credential that specify local_id of an account that belongs to an Identity Platform tenant. Format: `<id>`. */
		tenantId: string;
		delegatedProjectNumber?: string | number;
		/** The ID of the project which the account belongs to. Should only be specified in authenticated requests that specify local_id of an account. */
		body_targetProjectId?: string;
		/** The Identity Platform ID token of the account to delete. Require to be specified for requests from end users that lack Google OAuth 2.0 credential. Authenticated requests bearing a Google OAuth2 credential with proper permissions may pass local_id to specify the account to delete alternatively. */
		idToken?: string;
		/** The ID of the tenant that the account belongs to, if applicable. Only require to be specified for authenticated requests bearing a Google OAuth 2.0 credential that specify local_id of an account that belongs to an Identity Platform tenant. */
		body_tenantId?: string;
		/** The ID of user account to delete. Specifying this field requires a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). Requests from users lacking the credential should pass an ID token instead. */
		localId?: string;
	};
	'auth.projects.tenants.accounts.lookup': {
		/** The ID of the Google Cloud project that the account or the Identity Platform tenant specified by `tenant_id` belongs to. */
		targetProjectId: string;
		/** The ID of the tenant that the account belongs to. Should only be specified by authenticated requests from a developer. Format: `<id>`. */
		tenantId: string;
		/** The phone number of one or more accounts to fetch. Should only be specified by authenticated requests from a developer and should be in E.164 format, for example, +15555555555. */
		phoneNumber?: Array<string>;
		/** The ID of the tenant that the account belongs to. Should only be specified by authenticated requests from a developer. */
		body_tenantId?: string;
		/** The initial email of one or more accounts to fetch. The length of email should be less than 256 characters and in the format of `name@domain.tld`. The email should also match the [RFC 822](https://tools.ietf.org/html/rfc822) addr-spec production. */
		initialEmail?: Array<string>;
		/** The ID of the Google Cloud project that the account or the Identity Platform tenant specified by `tenant_id` belongs to. Should only be specified by authenticated requests bearing a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		body_targetProjectId?: string;
		/** The email address of one or more accounts to fetch. The length of email should be less than 256 characters and in the format of `name@domain.tld`. The email should also match the [RFC 822](https://tools.ietf.org/html/rfc822) addr-spec production. */
		email?: Array<string>;
		delegatedProjectNumber?: string | number;
		/** The ID of one or more accounts to fetch. Should only be specified by authenticated requests bearing a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		localId?: Array<string>;
		/** The Identity Platform ID token of the account to fetch. Require to be specified for requests from end users. */
		idToken?: string;
		/** The federated user identifier of one or more accounts to fetch. Should only be specified by authenticated requests bearing a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		federatedUserId?: Array<FirebaseGoogleCloudIdentitytoolkitV1FederatedUserIdentifierInput>;
	};
	'auth.projects.tenants.accounts.query': {
		/** The ID of the project to which the result is scoped. Format: `<id>`. */
		targetProjectId: string;
		/** The ID of the tenant to which the result is scoped. Format: `<id>`. */
		tenantId: string;
		/** If `true`, this request will return the accounts matching the query. If `false`, only the __count__ of accounts matching the query will be returned. Defaults to `true`. */
		returnUserInfo?: boolean;
		/** The maximum number of accounts to return with an upper limit of __500__. Defaults to _500_. Only valid when `return_user_info` is set to `true`. */
		limit?: string | number;
		/** The field to use for sorting user accounts. Defaults to `USER_ID`. Note: when `phone_number` is specified in `expression`, the result ignores the sorting. Only valid when `return_user_info` is set to `true`. */
		sortBy?:
			| 'SORT_BY_FIELD_UNSPECIFIED'
			| 'USER_ID'
			| 'NAME'
			| 'CREATED_AT'
			| 'LAST_LOGIN_AT'
			| 'USER_EMAIL';
		/** Query conditions used to filter results. If more than one is passed, only the first SqlExpression is evaluated. */
		expression?: Array<FirebaseGoogleCloudIdentitytoolkitV1SqlExpressionInput>;
		/** The ID of the tenant to which the result is scoped. */
		body_tenantId?: string;
		/** The order for sorting query result. Defaults to __ascending__ order. Only valid when `return_user_info` is set to `true`. */
		order?: 'ORDER_UNSPECIFIED' | 'ASC' | 'DESC';
		/** The number of accounts to skip from the beginning of matching records. Only valid when `return_user_info` is set to `true`. */
		offset?: string | number;
	};
	'auth.projects.tenants.accounts.sendOobCode': {
		/** The Project ID of the Identity Platform project which the account belongs to. To specify this field, it requires a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). Format: `<id>`. */
		targetProjectId: string;
		/** The tenant ID of the Identity Platform tenant the account belongs to. Format: `<id>`. */
		tenantId: string;
		/** For a PASSWORD_RESET request, a reCaptcha response is required when the system detects possible abuse activity. In those cases, this is the response from the reCaptcha challenge used to verify the caller. */
		captchaResp?: string;
		/** The account's email address to send the OOB code to, and generally the email address of the account that needs to be updated. Required for PASSWORD_RESET, EMAIL_SIGNIN, and VERIFY_EMAIL. Only required for VERIFY_AND_CHANGE_EMAIL requests when return_oob_link is set to true. */
		email?: string;
		/** The client type: web, Android or iOS. Required when reCAPTCHA Enterprise protection is enabled. */
		clientType?:
			| 'CLIENT_TYPE_UNSPECIFIED'
			| 'CLIENT_TYPE_WEB'
			| 'CLIENT_TYPE_ANDROID'
			| 'CLIENT_TYPE_IOS';
		/** The Project ID of the Identity Platform project which the account belongs to. To specify this field, it requires a Google OAuth 2.0 credential with proper [permissions](https://cloud.google.com/identity-platform/docs/access-control). */
		body_targetProjectId?: string;
		/** The Url to continue after user clicks the link sent in email. This is the url that will allow the web widget to handle the OOB code. */
		continueUrl?: string;
		/** The tenant ID of the Identity Platform tenant the account belongs to. */
		body_tenantId?: string;
		/** If an associated android app can handle the OOB code, the minimum version of the app. If the version on the device is lower than this version then the user is taken to Google Play Store to upgrade the app. */
		androidMinimumVersion?: string;
		/** In order to ensure that the url used can be easily opened up in iOS or android, we create a [Firebase Dynamic Link](https://firebase.google.com/docs/dynamic-links). Most Identity Platform projects will only have one Dynamic Link domain enabled, and can leave this field blank. */
		dynamicLinkDomain?: string;
		/** An ID token for the account. It is required for VERIFY_AND_CHANGE_EMAIL and VERIFY_EMAIL requests unless return_oob_link is set to true. */
		idToken?: string;
		challenge?: string;
		/** Required. The type of out-of-band (OOB) code to send. Depending on this value, other fields in this request will be required and/or have different meanings. There are 4 different OOB codes that can be sent: * PASSWORD_RESET * EMAIL_SIGNIN * VERIFY_EMAIL * VERIFY_AND_CHANGE_EMAIL */
		requestType?:
			| 'OOB_REQ_TYPE_UNSPECIFIED'
			| 'PASSWORD_RESET'
			| 'OLD_EMAIL_AGREE'
			| 'NEW_EMAIL_ACCEPT'
			| 'VERIFY_EMAIL'
			| 'RECOVER_EMAIL'
			| 'EMAIL_SIGNIN'
			| 'VERIFY_AND_CHANGE_EMAIL'
			| 'REVERT_SECOND_FACTOR_ADDITION';
		/** When set to true, the OOB code link will be be sent as a Universal Link or an Android App Link and will be opened by the corresponding app if installed. If not set, or set to false, the OOB code will be sent to the web widget first and then on continue will redirect to the app if installed. */
		canHandleCodeInApp?: boolean;
		/** The email address the account is being updated to. Required only for VERIFY_AND_CHANGE_EMAIL requests. */
		newEmail?: string;
		/** If an associated iOS app can handle the OOB code, the iOS bundle id of this app. This will allow the correct app to open if it is already installed. */
		iOSBundleId?: string;
		/** If an associated iOS app can handle the OOB code, the App Store id of this app. This will allow App Store to open to the correct app if the app is not yet installed. */
		iOSAppStoreId?: string;
		/** The reCAPTCHA version of the reCAPTCHA token in the captcha_response. */
		recaptchaVersion?: 'RECAPTCHA_VERSION_UNSPECIFIED' | 'RECAPTCHA_ENTERPRISE';
		/** If an associated android app can handle the OOB code, the Android package name of the android app that will handle the callback when this OOB code is used. */
		androidPackageName?: string;
		/** The IP address of the caller. Required only for PASSWORD_RESET requests. */
		userIp?: string;
		/** Optional. In order to ensure that the url used can be easily opened in iOS or Android, we create a Hosting link '/__/auth/links'. This optional field contains the domain to use when constructing a Hosting link. If not set, '.firebaseapp.com' domain will be used. */
		linkDomain?: string;
		/** If an associated android app can handle the OOB code, whether or not to install the android app on the device where the link is opened if the app is not already installed. */
		androidInstallApp?: boolean;
		/** Whether the confirmation link containing the OOB code should be returned in the response (no email is sent). Used when a developer wants to construct the email template and send it on their own. */
		returnOobLink?: boolean;
	};
	'auth.projects.tenants.accounts.update': {
		/** The tenant ID of the Identity Platform tenant that the account belongs to. Requests from end users should pass an Identity Platform ID token rather than setting this field. Format: `<id>`. */
		tenantId: string;
		/** The project ID for the project that the account belongs to. Specifying this field requires Google OAuth 2.0 credential with proper [permissions] (https://cloud.google.com/identity-platform/docs/access-control). Requests from end users should pass an Identity Platform ID token instead. */
		targetProjectId: string;
		/** Whether the user's email has been verified. Specifying this field requires a Google OAuth 2.0 credential with proper [permissions] (https://cloud.google.com/identity-platform/docs/access-control). */
		emailVerified?: boolean;
		/** The user's new email to be updated in the account's attributes. The length of email should be less than 256 characters and in the format of `name@domain.tld`. The email should also match the [RFC 822](https://tools.ietf.org/html/rfc822) addr-spec production. */
		email?: string;
		/** The ID of the user. Specifying this field requires a Google OAuth 2.0 credential with proper [permissions] (https://cloud.google.com/identity-platform/docs/access-control). For requests from end-users, an ID token should be passed instead. */
		localId?: string;
		/** The multi-factor authentication related information to be set on the user's account. This will overwrite any previous multi-factor related information on the account. */
		mfa?: FirebaseGoogleCloudIdentitytoolkitV1MfaInfoInput;
		captchaChallenge?: string;
		/** The phone number to be updated in the account's attributes. */
		phoneNumber?: string;
		/** Whether the account should be restricted to only using federated login. */
		upgradeToFederatedLogin?: boolean;
		/** Specifies the minimum timestamp in seconds for an Identity Platform ID token to be considered valid. */
		validSince?: string | number;
		/** The timestamp in milliseconds when the account last logged in. */
		lastLoginAt?: string | number;
		/** The response from reCaptcha challenge. This is required when the system detects possible abuse activities. */
		captchaResponse?: string;
		delegatedProjectNumber?: string | number;
		/** The timestamp in milliseconds when the account was created. */
		createdAt?: string | number;
		/** JSON formatted custom attributes to be stored in the Identity Platform ID token. Specifying this field requires a Google OAuth 2.0 credential with proper [permissions] (https://cloud.google.com/identity-platform/docs/access-control). */
		customAttributes?: string;
		/** The Identity Providers that the account should be associated with. */
		provider?: Array<string>;
		/** The tenant ID of the Identity Platform tenant that the account belongs to. Requests from end users should pass an Identity Platform ID token rather than setting this field. */
		body_tenantId?: string;
		instanceId?: string;
		/** The Identity Providers to unlink from the user's account. */
		deleteProvider?: Array<string>;
		/** The user's new display name to be updated in the account's attributes. The length of the display name must be less than or equal to 256 characters. */
		displayName?: string;
		/** The account's attributes to be deleted. */
		deleteAttribute?: Array<
			| 'USER_ATTRIBUTE_NAME_UNSPECIFIED'
			| 'EMAIL'
			| 'DISPLAY_NAME'
			| 'PROVIDER'
			| 'PHOTO_URL'
			| 'PASSWORD'
			| 'RAW_USER_INFO'
		>;
		/** The project ID for the project that the account belongs to. Specifying this field requires Google OAuth 2.0 credential with proper [permissions] (https://cloud.google.com/identity-platform/docs/access-control). Requests from end users should pass an Identity Platform ID token instead. */
		body_targetProjectId?: string;
		/** The out-of-band code to be applied on the user's account. The following out-of-band code types are supported: * VERIFY_EMAIL * RECOVER_EMAIL * REVERT_SECOND_FACTOR_ADDITION * VERIFY_AND_CHANGE_EMAIL */
		oobCode?: string;
		/** Whether or not to return an ID and refresh token. Should always be true. */
		returnSecureToken?: boolean;
		/** The user's new password to be updated in the account's attributes. The password must be at least 6 characters long. */
		password?: string;
		/** The user's new photo URL for the account's profile photo to be updated in the account's attributes. The length of the URL must be less than or equal to 2048 characters. */
		photoUrl?: string;
		/** A valid Identity Platform ID token. Required when attempting to change user-related information. */
		idToken?: string;
		/** The provider to be linked to the user's account. Specifying this field requires a Google OAuth 2.0 credential with proper [permissions] (https://cloud.google.com/identity-platform/docs/access-control). */
		linkProviderUserInfo?: FirebaseGoogleCloudIdentitytoolkitV1ProviderUserInfoInput;
		/** If true, marks the account as disabled, meaning the user will no longer be able to sign-in. */
		disableUser?: boolean;
	};
	'auth.projects.tenants.createSessionCookie': {
		/** The ID of the project that the account belongs to. Format: `<id>`. */
		targetProjectId: string;
		/** The tenant ID of the Identity Platform tenant the account belongs to. Format: `<id>`. */
		tenantId: string;
		/** Required. A valid Identity Platform ID token. */
		idToken?: string;
		/** The number of seconds until the session cookie expires. Specify a duration in seconds, between five minutes and fourteen days, inclusively. */
		validDuration?: string | number;
		/** The tenant ID of the Identity Platform tenant the account belongs to. */
		body_tenantId?: string;
	};
	'authAdmin.accounts.mfaEnrollment.finalize': {
		/** Display name which is entered by users to distinguish between different second factors with same type or different type. */
		displayName?: string;
		/** Verification information for TOTP. */
		totpVerificationInfo?: FirebaseGoogleCloudIdentitytoolkitV2FinalizeMfaTotpEnrollmentRequestInfoInput;
		/** Verification info to authorize sending an SMS for phone verification. */
		phoneVerificationInfo?: FirebaseGoogleCloudIdentitytoolkitV2FinalizeMfaPhoneRequestInfoInput;
		/** The ID of the Identity Platform tenant that the user enrolling MFA belongs to. If not set, the user belongs to the default Identity Platform project. */
		tenantId?: string;
		/** Required. ID token. */
		idToken?: string;
	};
	'authAdmin.accounts.mfaEnrollment.start': {
		/** Required. User's ID token. */
		idToken?: string;
		/** The ID of the Identity Platform tenant that the user enrolling MFA belongs to. If not set, the user belongs to the default Identity Platform project. */
		tenantId?: string;
		/** Verification info to authorize sending an SMS for phone verification. */
		phoneEnrollmentInfo?: FirebaseGoogleCloudIdentitytoolkitV2StartMfaPhoneRequestInfoInput;
		/** Sign-in info specific to TOTP auth. */
		totpEnrollmentInfo?: FirebaseGoogleCloudIdentitytoolkitV2StartMfaTotpEnrollmentRequestInfoInput;
	};
	'authAdmin.accounts.mfaEnrollment.withdraw': {
		/** Required. MFA enrollment id from a current MFA enrollment. */
		mfaEnrollmentId?: string;
		/** The ID of the Identity Platform tenant that the user unenrolling MFA belongs to. If not set, the user belongs to the default Identity Platform project. */
		tenantId?: string;
		/** Required. User's ID token. */
		idToken?: string;
	};
	'authAdmin.accounts.mfaSignIn.finalize': {
		/** Required. Pending credential from first factor sign-in. */
		mfaPendingCredential?: string;
		/** Proof of completion of the SMS based MFA challenge. */
		phoneVerificationInfo?: FirebaseGoogleCloudIdentitytoolkitV2FinalizeMfaPhoneRequestInfoInput;
		/** Proof of completion of the TOTP based MFA challenge. */
		totpVerificationInfo?: FirebaseGoogleCloudIdentitytoolkitV2MfaTotpSignInRequestInfoInput;
		/** The ID of the Identity Platform tenant the user is signing in to. If not set, the user will sign in to the default Identity Platform project. */
		tenantId?: string;
		/** The MFA enrollment ID from the user's list of current MFA enrollments. */
		mfaEnrollmentId?: string;
	};
	'authAdmin.accounts.mfaSignIn.start': {
		/** The ID of the Identity Platform tenant the user is signing in to. If not set, the user will sign in to the default Identity Platform project. */
		tenantId?: string;
		/** Required. Pending credential from first factor sign-in. */
		mfaPendingCredential?: string;
		/** Required. MFA enrollment id from the user's list of current MFA enrollments. */
		mfaEnrollmentId?: string;
		/** Verification info to authorize sending an SMS for phone verification. */
		phoneSignInInfo?: FirebaseGoogleCloudIdentitytoolkitV2StartMfaPhoneRequestInfoInput;
	};
	'authAdmin.accounts.revokeToken': {
		/** Required. The type of the token to be revoked. */
		tokenType?:
			| 'TOKEN_TYPE_UNSPECIFIED'
			| 'REFRESH_TOKEN'
			| 'ACCESS_TOKEN'
			| 'CODE';
		/** The redirect URI provided in the initial authorization request made by the client to the IDP. The URI must use the HTTPS protocol, include a domain name, and can't contain an IP address or localhost. Required if token_type is CODE. */
		redirectUri?: string;
		/** Required. The token to be revoked. If an authorization_code is passed in, the API will first exchange the code for access token and then revoke the token exchanged. */
		token?: string;
		/** Required. A valid Identity Platform ID token to link the account. If there was a successful token revocation request on the account and no tokens are generated after the revocation, the duplicate requests will be ignored and returned immediately. */
		idToken?: string;
		/** The ID of the Identity Platform tenant the user is signing in to. If not set, the user will sign in to the default Identity Platform project. */
		tenantId?: string;
		/** Required. The idp provider for the token. Currently only supports Apple Idp. The format should be "apple.com". */
		providerId?: string;
	};
	'authAdmin.defaultSupportedIdpConfigs.create': {
		/** The parent resource name where the config to be created, for example: "projects/my-awesome-project" Format: `projects/<id>`. */
		parent: string;
		/** The id of the Idp to create a config for. Call ListDefaultSupportedIdps for list of all default supported Idps. */
		idpId?: string;
		/** OAuth client ID. */
		clientId?: string;
		/** OAuth client secret. */
		clientSecret?: string;
		/** Additional config for Apple-based projects. */
		appleSignInConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2AppleSignInConfigInput;
		/** True if allows the user to sign in with the provider. */
		enabled?: boolean;
		/** The name of the DefaultSupportedIdpConfig resource, for example: "projects/my-awesome-project/defaultSupportedIdpConfigs/google.com" */
		name?: string;
	};
	'authAdmin.defaultSupportedIdpConfigs.delete': {
		/** The resource name of the config, for example: "projects/my-awesome-project/defaultSupportedIdpConfigs/google.com" Format: `projects/<id>/defaultSupportedIdpConfigs/<id>`. */
		name: string;
	};
	'authAdmin.defaultSupportedIdpConfigs.get': {
		/** The resource name of the config, for example: "projects/my-awesome-project/defaultSupportedIdpConfigs/google.com" Format: `projects/<id>/defaultSupportedIdpConfigs/<id>`. */
		name: string;
	};
	'authAdmin.defaultSupportedIdpConfigs.list': {
		/** The parent resource name, for example, "projects/my-awesome-project". Format: `projects/<id>`. */
		parent: string;
		/** The next_page_token value returned from a previous List request, if any. */
		pageToken?: string;
		/** The maximum number of items to return. */
		pageSize?: number;
	};
	'authAdmin.defaultSupportedIdpConfigs.patch': {
		/** The update mask applies to the resource. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask */
		updateMask?: string;
		/** The name of the DefaultSupportedIdpConfig resource, for example: "projects/my-awesome-project/defaultSupportedIdpConfigs/google.com" Format: `projects/<id>/defaultSupportedIdpConfigs/<id>`. */
		name: string;
		/** OAuth client ID. */
		clientId?: string;
		/** OAuth client secret. */
		clientSecret?: string;
		/** Additional config for Apple-based projects. */
		appleSignInConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2AppleSignInConfigInput;
		/** True if allows the user to sign in with the provider. */
		enabled?: boolean;
		/** The name of the DefaultSupportedIdpConfig resource, for example: "projects/my-awesome-project/defaultSupportedIdpConfigs/google.com" */
		body_name?: string;
	};
	'authAdmin.defaultSupportedIdps.list': {
		/** The next_page_token value returned from a previous List request, if any. */
		pageToken?: string;
		/** The maximum number of items to return. */
		pageSize?: number;
	};
	'authAdmin.getPasswordPolicy': {
		/** The id of a tenant. */
		tenantId?: string;
	};
	'authAdmin.getRecaptchaConfig': {
		/** The reCAPTCHA version. */
		version?: 'RECAPTCHA_VERSION_UNSPECIFIED' | 'RECAPTCHA_ENTERPRISE';
		/** The id of a tenant. */
		tenantId?: string;
		/** reCAPTCHA Enterprise uses separate site keys for different client types. Specify the client type to get the corresponding key. */
		clientType?:
			| 'CLIENT_TYPE_UNSPECIFIED'
			| 'CLIENT_TYPE_WEB'
			| 'CLIENT_TYPE_ANDROID'
			| 'CLIENT_TYPE_IOS';
	};
	'authAdmin.identityPlatform.initializeAuth': {
		/** The resource name of the target project the developer wants to enable Identity Platform for. Format: `projects/<id>`. */
		project: string;
		body?: FirebaseGoogleCloudIdentitytoolkitAdminV2InitializeIdentityPlatformRequestInput;
	};
	'authAdmin.inboundSamlConfigs.create': {
		/** The id to use for this config. */
		inboundSamlConfigId?: string;
		/** The parent resource name where the config to be created, for example: "projects/my-awesome-project" Format: `projects/<id>`. */
		parent: string;
		/** The name of the InboundSamlConfig resource, for example: 'projects/my-awesome-project/inboundSamlConfigs/my-config-id'. Ignored during create requests. */
		name?: string;
		/** The config's display name set by developers. */
		displayName?: string;
		/** True if allows the user to sign in with the provider. */
		enabled?: boolean;
		/** The SAML IdP (Identity Provider) configuration when the project acts as the relying party. */
		idpConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2IdpConfigInput;
		/** The SAML SP (Service Provider) configuration when the project acts as the relying party to receive and accept an authentication assertion issued by a SAML identity provider. */
		spConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2SpConfigInput;
	};
	'authAdmin.inboundSamlConfigs.delete': {
		/** The resource name of the config to be deleted, for example: 'projects/my-awesome-project/inboundSamlConfigs/my-config-id'. Format: `projects/<id>/inboundSamlConfigs/<id>`. */
		name: string;
	};
	'authAdmin.inboundSamlConfigs.get': {
		/** The resource name of the config, for example: 'projects/my-awesome-project/inboundSamlConfigs/my-config-id'. Format: `projects/<id>/inboundSamlConfigs/<id>`. */
		name: string;
	};
	'authAdmin.inboundSamlConfigs.list': {
		/** The maximum number of items to return. */
		pageSize?: number;
		/** The parent resource name, for example, "projects/my-awesome-project". Format: `projects/<id>`. */
		parent: string;
		/** The next_page_token value returned from a previous List request, if any. */
		pageToken?: string;
	};
	'authAdmin.inboundSamlConfigs.patch': {
		/** The update mask applies to the resource. Empty update mask will result in updating nothing. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask */
		updateMask?: string;
		/** The name of the InboundSamlConfig resource, for example: 'projects/my-awesome-project/inboundSamlConfigs/my-config-id'. Ignored during create requests. Format: `projects/<id>/inboundSamlConfigs/<id>`. */
		name: string;
		/** The name of the InboundSamlConfig resource, for example: 'projects/my-awesome-project/inboundSamlConfigs/my-config-id'. Ignored during create requests. */
		body_name?: string;
		/** The config's display name set by developers. */
		displayName?: string;
		/** True if allows the user to sign in with the provider. */
		enabled?: boolean;
		/** The SAML IdP (Identity Provider) configuration when the project acts as the relying party. */
		idpConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2IdpConfigInput;
		/** The SAML SP (Service Provider) configuration when the project acts as the relying party to receive and accept an authentication assertion issued by a SAML identity provider. */
		spConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2SpConfigInput;
	};
	'authAdmin.oauthIdpConfigs.create': {
		/** The id to use for this config. */
		oauthIdpConfigId?: string;
		/** The parent resource name where the config to be created, for example: "projects/my-awesome-project" Format: `projects/<id>`. */
		parent: string;
		/** For OIDC Idps, the issuer identifier. */
		issuer?: string;
		/** The response type to request for in the OAuth authorization flow. You can set either `id_token` or `code` to true, but not both. Setting both types to be simultaneously true (`{code: true, id_token: true}`) is not yet supported. */
		responseType?: FirebaseGoogleCloudIdentitytoolkitAdminV2OAuthResponseTypeInput;
		/** The config's display name set by developers. */
		displayName?: string;
		/** The client secret of the OAuth client, to enable OIDC code flow. */
		clientSecret?: string;
		/** The name of the OAuthIdpConfig resource, for example: 'projects/my-awesome-project/oauthIdpConfigs/oauth-config-id'. Ignored during create requests. */
		name?: string;
		/** The client id of an OAuth client. */
		clientId?: string;
		/** True if allows the user to sign in with the provider. */
		enabled?: boolean;
	};
	'authAdmin.oauthIdpConfigs.delete': {
		/** The resource name of the config to be deleted, for example: 'projects/my-awesome-project/oauthIdpConfigs/oauth-config-id'. Format: `projects/<id>/oauthIdpConfigs/<id>`. */
		name: string;
	};
	'authAdmin.oauthIdpConfigs.get': {
		/** The resource name of the config, for example: 'projects/my-awesome-project/oauthIdpConfigs/oauth-config-id'. Format: `projects/<id>/oauthIdpConfigs/<id>`. */
		name: string;
	};
	'authAdmin.oauthIdpConfigs.list': {
		/** The parent resource name, for example, "projects/my-awesome-project". Format: `projects/<id>`. */
		parent: string;
		/** The maximum number of items to return. */
		pageSize?: number;
		/** The next_page_token value returned from a previous List request, if any. */
		pageToken?: string;
	};
	'authAdmin.oauthIdpConfigs.patch': {
		/** The name of the OAuthIdpConfig resource, for example: 'projects/my-awesome-project/oauthIdpConfigs/oauth-config-id'. Ignored during create requests. Format: `projects/<id>/oauthIdpConfigs/<id>`. */
		name: string;
		/** The update mask applies to the resource. Empty update mask will result in updating nothing. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask */
		updateMask?: string;
		/** For OIDC Idps, the issuer identifier. */
		issuer?: string;
		/** The response type to request for in the OAuth authorization flow. You can set either `id_token` or `code` to true, but not both. Setting both types to be simultaneously true (`{code: true, id_token: true}`) is not yet supported. */
		responseType?: FirebaseGoogleCloudIdentitytoolkitAdminV2OAuthResponseTypeInput;
		/** The config's display name set by developers. */
		displayName?: string;
		/** The client secret of the OAuth client, to enable OIDC code flow. */
		clientSecret?: string;
		/** The name of the OAuthIdpConfig resource, for example: 'projects/my-awesome-project/oauthIdpConfigs/oauth-config-id'. Ignored during create requests. */
		body_name?: string;
		/** The client id of an OAuth client. */
		clientId?: string;
		/** True if allows the user to sign in with the provider. */
		enabled?: boolean;
	};
	'authAdmin.projects.getConfig': {
		/** The resource name of the config, for example: "projects/my-awesome-project/config" Format: `projects/<id>/config`. */
		name: string;
	};
	'authAdmin.projects.updateConfig': {
		/** Output only. The name of the Config resource. Example: "projects/my-awesome-project/config" Format: `projects/<id>/config`. */
		name: string;
		/** The update mask applies to the resource. Fields set in the config but not included in this update mask will be ignored. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask */
		updateMask?: string;
		/** The project level password policy configuration. */
		passwordPolicyConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2PasswordPolicyConfigInput;
		/** Configuration related to blocking functions. */
		blockingFunctions?: FirebaseGoogleCloudIdentitytoolkitAdminV2BlockingFunctionsConfigInput;
		/** Configuration related to local sign in methods. */
		signIn?: FirebaseGoogleCloudIdentitytoolkitAdminV2SignInConfigInput;
		/** Whether anonymous users will be auto-deleted after a period of 30 days. */
		autodeleteAnonymousUsers?: boolean;
		/** List of domains authorized for OAuth redirects */
		authorizedDomains?: Array<string>;
		/** Configures which regions are enabled for SMS verification code sending. */
		smsRegionConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2SmsRegionConfigInput;
		/** Configuration related to multi-tenant functionality. */
		multiTenant?: FirebaseGoogleCloudIdentitytoolkitAdminV2MultiTenantConfigInput;
		/** Configuration related to quotas. */
		quota?: FirebaseGoogleCloudIdentitytoolkitAdminV2QuotaConfigInput;
		/** Configuration related to monitoring project activity. */
		monitoring?: FirebaseGoogleCloudIdentitytoolkitAdminV2MonitoringConfigInput;
		/** The project-level reCAPTCHA config. */
		recaptchaConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaConfigInput;
		/** Configuration related to sending notifications to users. */
		notification?: FirebaseGoogleCloudIdentitytoolkitAdminV2NotificationConfigInput;
		/** Configuration for settings related to email privacy and public visibility. */
		emailPrivacyConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2EmailPrivacyConfigInput;
		/** Options related to how clients making requests on behalf of a project should be configured. */
		client?: FirebaseGoogleCloudIdentitytoolkitAdminV2ClientConfigInput;
		/** Configuration for this project's multi-factor authentication, including whether it is active and what factors can be used for the second factor */
		mfa?: FirebaseGoogleCloudIdentitytoolkitAdminV2MultiFactorAuthConfigInput;
		/** Configuration for settings related to univeral links (iOS) and app links (Android). */
		mobileLinksConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2MobileLinksConfigInput;
	};
	'authAdmin.tenants.create': {
		/** The parent resource name where the tenant will be created. For example, "projects/project1". Format: `projects/<id>`. */
		parent: string;
		/** Whether to allow email/password user authentication. */
		allowPasswordSignup?: boolean;
		/** Whether authentication is disabled for the tenant. If true, the users under the disabled tenant are not allowed to sign-in. Admins of the disabled tenant are not able to manage its users. */
		disableAuth?: boolean;
		/** The tenant-level configuration of MFA options. */
		mfaConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2MultiFactorAuthConfigInput;
		/** Configuration related to monitoring project activity. */
		monitoring?: FirebaseGoogleCloudIdentitytoolkitAdminV2MonitoringConfigInput;
		/** Configuration for settings related to email privacy and public visibility. */
		emailPrivacyConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2EmailPrivacyConfigInput;
		/** Configures which regions are enabled for SMS verification code sending. */
		smsRegionConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2SmsRegionConfigInput;
		/** Options related to how clients making requests on behalf of a project should be configured. */
		client?: FirebaseGoogleCloudIdentitytoolkitAdminV2ClientPermissionConfigInput;
		/** Specify the settings that the tenant could inherit. */
		inheritance?: FirebaseGoogleCloudIdentitytoolkitAdminV2InheritanceInput;
		/** Whether to enable anonymous user authentication. */
		enableAnonymousUser?: boolean;
		/** Whether to enable email link user authentication. */
		enableEmailLinkSignin?: boolean;
		/** The tenant-level reCAPTCHA config. */
		recaptchaConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaConfigInput;
		/** A map of pairs that can be used for MFA. The phone number should be in E.164 format (https://www.itu.int/rec/T-REC-E.164/) and a maximum of 10 pairs can be added (error will be thrown once exceeded). */
		testPhoneNumbers?: Record<string, string>;
		/** Whether anonymous users will be auto-deleted after a period of 30 days. */
		autodeleteAnonymousUsers?: boolean;
		/** The tenant-level password policy config */
		passwordPolicyConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2PasswordPolicyConfigInput;
		/** Optional. Deprecated. Never launched. Configuration for settings related to univeral links (iOS) and app links (Android). */
		mobileLinksConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2MobileLinksConfigInput;
		/** Display name of the tenant. */
		displayName?: string;
	};
	'authAdmin.tenants.defaultSupportedIdpConfigs.create': {
		/** The parent resource name where the config to be created, for example: "projects/my-awesome-project" Format: `projects/<id>/tenants/<id>`. */
		parent: string;
		/** The id of the Idp to create a config for. Call ListDefaultSupportedIdps for list of all default supported Idps. */
		idpId?: string;
		/** OAuth client ID. */
		clientId?: string;
		/** OAuth client secret. */
		clientSecret?: string;
		/** Additional config for Apple-based projects. */
		appleSignInConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2AppleSignInConfigInput;
		/** True if allows the user to sign in with the provider. */
		enabled?: boolean;
		/** The name of the DefaultSupportedIdpConfig resource, for example: "projects/my-awesome-project/defaultSupportedIdpConfigs/google.com" */
		name?: string;
	};
	'authAdmin.tenants.defaultSupportedIdpConfigs.delete': {
		/** The resource name of the config, for example: "projects/my-awesome-project/defaultSupportedIdpConfigs/google.com" Format: `projects/<id>/tenants/<id>/defaultSupportedIdpConfigs/<id>`. */
		name: string;
	};
	'authAdmin.tenants.defaultSupportedIdpConfigs.get': {
		/** The resource name of the config, for example: "projects/my-awesome-project/defaultSupportedIdpConfigs/google.com" Format: `projects/<id>/tenants/<id>/defaultSupportedIdpConfigs/<id>`. */
		name: string;
	};
	'authAdmin.tenants.defaultSupportedIdpConfigs.list': {
		/** The parent resource name, for example, "projects/my-awesome-project". Format: `projects/<id>/tenants/<id>`. */
		parent: string;
		/** The maximum number of items to return. */
		pageSize?: number;
		/** The next_page_token value returned from a previous List request, if any. */
		pageToken?: string;
	};
	'authAdmin.tenants.defaultSupportedIdpConfigs.patch': {
		/** The update mask applies to the resource. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask */
		updateMask?: string;
		/** The name of the DefaultSupportedIdpConfig resource, for example: "projects/my-awesome-project/defaultSupportedIdpConfigs/google.com" Format: `projects/<id>/tenants/<id>/defaultSupportedIdpConfigs/<id>`. */
		name: string;
		/** OAuth client ID. */
		clientId?: string;
		/** OAuth client secret. */
		clientSecret?: string;
		/** Additional config for Apple-based projects. */
		appleSignInConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2AppleSignInConfigInput;
		/** True if allows the user to sign in with the provider. */
		enabled?: boolean;
		/** The name of the DefaultSupportedIdpConfig resource, for example: "projects/my-awesome-project/defaultSupportedIdpConfigs/google.com" */
		body_name?: string;
	};
	'authAdmin.tenants.delete': {
		/** Resource name of the tenant to delete. Format: `projects/<id>/tenants/<id>`. */
		name: string;
	};
	'authAdmin.tenants.get': {
		/** Resource name of the tenant to retrieve. Format: `projects/<id>/tenants/<id>`. */
		name: string;
	};
	'authAdmin.tenants.getIamPolicy': {
		/** REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field. Format: `projects/<id>/tenants/<id>`. */
		resource: string;
		/** OPTIONAL: A `GetPolicyOptions` object for specifying options to `GetIamPolicy`. */
		options?: FirebaseGoogleIamV1GetPolicyOptionsInput;
	};
	'authAdmin.tenants.inboundSamlConfigs.create': {
		/** The parent resource name where the config to be created, for example: "projects/my-awesome-project" Format: `projects/<id>/tenants/<id>`. */
		parent: string;
		/** The id to use for this config. */
		inboundSamlConfigId?: string;
		/** The name of the InboundSamlConfig resource, for example: 'projects/my-awesome-project/inboundSamlConfigs/my-config-id'. Ignored during create requests. */
		name?: string;
		/** The config's display name set by developers. */
		displayName?: string;
		/** True if allows the user to sign in with the provider. */
		enabled?: boolean;
		/** The SAML IdP (Identity Provider) configuration when the project acts as the relying party. */
		idpConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2IdpConfigInput;
		/** The SAML SP (Service Provider) configuration when the project acts as the relying party to receive and accept an authentication assertion issued by a SAML identity provider. */
		spConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2SpConfigInput;
	};
	'authAdmin.tenants.inboundSamlConfigs.delete': {
		/** The resource name of the config to be deleted, for example: 'projects/my-awesome-project/inboundSamlConfigs/my-config-id'. Format: `projects/<id>/tenants/<id>/inboundSamlConfigs/<id>`. */
		name: string;
	};
	'authAdmin.tenants.inboundSamlConfigs.get': {
		/** The resource name of the config, for example: 'projects/my-awesome-project/inboundSamlConfigs/my-config-id'. Format: `projects/<id>/tenants/<id>/inboundSamlConfigs/<id>`. */
		name: string;
	};
	'authAdmin.tenants.inboundSamlConfigs.list': {
		/** The maximum number of items to return. */
		pageSize?: number;
		/** The next_page_token value returned from a previous List request, if any. */
		pageToken?: string;
		/** The parent resource name, for example, "projects/my-awesome-project". Format: `projects/<id>/tenants/<id>`. */
		parent: string;
	};
	'authAdmin.tenants.inboundSamlConfigs.patch': {
		/** The name of the InboundSamlConfig resource, for example: 'projects/my-awesome-project/inboundSamlConfigs/my-config-id'. Ignored during create requests. Format: `projects/<id>/tenants/<id>/inboundSamlConfigs/<id>`. */
		name: string;
		/** The update mask applies to the resource. Empty update mask will result in updating nothing. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask */
		updateMask?: string;
		/** The name of the InboundSamlConfig resource, for example: 'projects/my-awesome-project/inboundSamlConfigs/my-config-id'. Ignored during create requests. */
		body_name?: string;
		/** The config's display name set by developers. */
		displayName?: string;
		/** True if allows the user to sign in with the provider. */
		enabled?: boolean;
		/** The SAML IdP (Identity Provider) configuration when the project acts as the relying party. */
		idpConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2IdpConfigInput;
		/** The SAML SP (Service Provider) configuration when the project acts as the relying party to receive and accept an authentication assertion issued by a SAML identity provider. */
		spConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2SpConfigInput;
	};
	'authAdmin.tenants.list': {
		/** The maximum number of results to return, capped at 1000. If not specified, the default value is 20. */
		pageSize?: number;
		/** The pagination token from the response of a previous request. */
		pageToken?: string;
		/** Required. The parent resource name to list tenants for. Format: `projects/<id>`. */
		parent: string;
	};
	'authAdmin.tenants.oauthIdpConfigs.create': {
		/** The id to use for this config. */
		oauthIdpConfigId?: string;
		/** The parent resource name where the config to be created, for example: "projects/my-awesome-project" Format: `projects/<id>/tenants/<id>`. */
		parent: string;
		/** For OIDC Idps, the issuer identifier. */
		issuer?: string;
		/** The response type to request for in the OAuth authorization flow. You can set either `id_token` or `code` to true, but not both. Setting both types to be simultaneously true (`{code: true, id_token: true}`) is not yet supported. */
		responseType?: FirebaseGoogleCloudIdentitytoolkitAdminV2OAuthResponseTypeInput;
		/** The config's display name set by developers. */
		displayName?: string;
		/** The client secret of the OAuth client, to enable OIDC code flow. */
		clientSecret?: string;
		/** The name of the OAuthIdpConfig resource, for example: 'projects/my-awesome-project/oauthIdpConfigs/oauth-config-id'. Ignored during create requests. */
		name?: string;
		/** The client id of an OAuth client. */
		clientId?: string;
		/** True if allows the user to sign in with the provider. */
		enabled?: boolean;
	};
	'authAdmin.tenants.oauthIdpConfigs.delete': {
		/** The resource name of the config to be deleted, for example: 'projects/my-awesome-project/oauthIdpConfigs/oauth-config-id'. Format: `projects/<id>/tenants/<id>/oauthIdpConfigs/<id>`. */
		name: string;
	};
	'authAdmin.tenants.oauthIdpConfigs.get': {
		/** The resource name of the config, for example: 'projects/my-awesome-project/oauthIdpConfigs/oauth-config-id'. Format: `projects/<id>/tenants/<id>/oauthIdpConfigs/<id>`. */
		name: string;
	};
	'authAdmin.tenants.oauthIdpConfigs.list': {
		/** The maximum number of items to return. */
		pageSize?: number;
		/** The parent resource name, for example, "projects/my-awesome-project". Format: `projects/<id>/tenants/<id>`. */
		parent: string;
		/** The next_page_token value returned from a previous List request, if any. */
		pageToken?: string;
	};
	'authAdmin.tenants.oauthIdpConfigs.patch': {
		/** The update mask applies to the resource. Empty update mask will result in updating nothing. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask */
		updateMask?: string;
		/** The name of the OAuthIdpConfig resource, for example: 'projects/my-awesome-project/oauthIdpConfigs/oauth-config-id'. Ignored during create requests. Format: `projects/<id>/tenants/<id>/oauthIdpConfigs/<id>`. */
		name: string;
		/** For OIDC Idps, the issuer identifier. */
		issuer?: string;
		/** The response type to request for in the OAuth authorization flow. You can set either `id_token` or `code` to true, but not both. Setting both types to be simultaneously true (`{code: true, id_token: true}`) is not yet supported. */
		responseType?: FirebaseGoogleCloudIdentitytoolkitAdminV2OAuthResponseTypeInput;
		/** The config's display name set by developers. */
		displayName?: string;
		/** The client secret of the OAuth client, to enable OIDC code flow. */
		clientSecret?: string;
		/** The name of the OAuthIdpConfig resource, for example: 'projects/my-awesome-project/oauthIdpConfigs/oauth-config-id'. Ignored during create requests. */
		body_name?: string;
		/** The client id of an OAuth client. */
		clientId?: string;
		/** True if allows the user to sign in with the provider. */
		enabled?: boolean;
	};
	'authAdmin.tenants.patch': {
		/** If provided, only update fields set in the update mask. Otherwise, all settable fields will be updated. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask */
		updateMask?: string;
		/** Output only. Resource name of a tenant. For example: "projects/{project-id}/tenants/{tenant-id}" Format: `projects/<id>/tenants/<id>`. */
		name: string;
		/** Whether to allow email/password user authentication. */
		allowPasswordSignup?: boolean;
		/** Whether authentication is disabled for the tenant. If true, the users under the disabled tenant are not allowed to sign-in. Admins of the disabled tenant are not able to manage its users. */
		disableAuth?: boolean;
		/** The tenant-level configuration of MFA options. */
		mfaConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2MultiFactorAuthConfigInput;
		/** Configuration related to monitoring project activity. */
		monitoring?: FirebaseGoogleCloudIdentitytoolkitAdminV2MonitoringConfigInput;
		/** Configuration for settings related to email privacy and public visibility. */
		emailPrivacyConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2EmailPrivacyConfigInput;
		/** Configures which regions are enabled for SMS verification code sending. */
		smsRegionConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2SmsRegionConfigInput;
		/** Options related to how clients making requests on behalf of a project should be configured. */
		client?: FirebaseGoogleCloudIdentitytoolkitAdminV2ClientPermissionConfigInput;
		/** Specify the settings that the tenant could inherit. */
		inheritance?: FirebaseGoogleCloudIdentitytoolkitAdminV2InheritanceInput;
		/** Whether to enable anonymous user authentication. */
		enableAnonymousUser?: boolean;
		/** Whether to enable email link user authentication. */
		enableEmailLinkSignin?: boolean;
		/** The tenant-level reCAPTCHA config. */
		recaptchaConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2RecaptchaConfigInput;
		/** A map of pairs that can be used for MFA. The phone number should be in E.164 format (https://www.itu.int/rec/T-REC-E.164/) and a maximum of 10 pairs can be added (error will be thrown once exceeded). */
		testPhoneNumbers?: Record<string, string>;
		/** Whether anonymous users will be auto-deleted after a period of 30 days. */
		autodeleteAnonymousUsers?: boolean;
		/** The tenant-level password policy config */
		passwordPolicyConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2PasswordPolicyConfigInput;
		/** Optional. Deprecated. Never launched. Configuration for settings related to univeral links (iOS) and app links (Android). */
		mobileLinksConfig?: FirebaseGoogleCloudIdentitytoolkitAdminV2MobileLinksConfigInput;
		/** Display name of the tenant. */
		displayName?: string;
	};
	'authAdmin.tenants.setIamPolicy': {
		/** REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field. Format: `projects/<id>/tenants/<id>`. */
		resource: string;
		/** OPTIONAL: A FieldMask specifying which fields of the policy to modify. Only the fields in the mask will be modified. If no mask is provided, the following default mask is used: `paths: "bindings, etag"` */
		updateMask?: string;
		/** REQUIRED: The complete policy to be applied to the `resource`. The size of the policy is limited to a few 10s of KB. An empty policy is a valid policy but certain Google Cloud services (such as Projects) might reject them. */
		policy?: FirebaseGoogleIamV1PolicyInput;
	};
	'authAdmin.tenants.testIamPermissions': {
		/** REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field. Format: `projects/<id>/tenants/<id>`. */
		resource: string;
		/** The set of permissions to check for the `resource`. Permissions with wildcards (such as `*` or `storage.*`) are not allowed. For more information see [IAM Overview](https://cloud.google.com/iam/docs/overview#permissions). */
		permissions?: Array<string>;
	};
	'database.delete': {
		/** The database URL: https://<name>.firebaseio.com or https://<name>.<region>.firebasedatabase.app (databaseInstances.list returns it as databaseUrl). */
		databaseUrl: string;
		/** The location in the database, `users/ada` (empty for the root). */
		path?: string;
	};
	'database.get': {
		/** The database URL: https://<name>.firebaseio.com or https://<name>.<region>.firebasedatabase.app (databaseInstances.list returns it as databaseUrl). */
		databaseUrl: string;
		/** The location in the database, `users/ada` (empty for the root). */
		path?: string;
		/** Order by "$key", "$value", "$priority" or a child key ("height"); the plugin adds the JSON quotes. Needs an index rule for child keys. */
		orderBy?: string;
		/** Start at this value of orderBy (a string, number, boolean or null, which selects children without the key; the plugin JSON-encodes it). */
		startAt?: (string | number | boolean) | null;
		/** End at this value of orderBy (the plugin JSON-encodes it). */
		endAt?: (string | number | boolean) | null;
		/** Only values equal to this (the plugin JSON-encodes it). */
		equalTo?: (string | number | boolean) | null;
		limitToFirst?: number;
		limitToLast?: number;
		/** Return only the keys below the path, each as true. */
		shallow?: boolean;
	};
	'database.push': {
		/** The database URL: https://<name>.firebaseio.com or https://<name>.<region>.firebasedatabase.app (databaseInstances.list returns it as databaseUrl). */
		databaseUrl: string;
		/** The location in the database, `users/ada` (empty for the root). */
		path?: string;
		/** Any JSON value: an object, a list, a string, a number, a boolean or null. */
		data: FirebaseJsonValue;
	};
	'database.rules.get': {
		/** The database URL: https://<name>.firebaseio.com or https://<name>.<region>.firebasedatabase.app (databaseInstances.list returns it as databaseUrl). */
		databaseUrl: string;
	};
	'database.rules.set': {
		/** The database URL: https://<name>.firebaseio.com or https://<name>.<region>.firebasedatabase.app (databaseInstances.list returns it as databaseUrl). */
		databaseUrl: string;
		/** The rules document: { "rules": { ".read": ..., ".write": ... } }. */
		rules: Record<string, FirebaseJsonValue>;
	};
	'database.set': {
		/** The database URL: https://<name>.firebaseio.com or https://<name>.<region>.firebasedatabase.app (databaseInstances.list returns it as databaseUrl). */
		databaseUrl: string;
		/** The location in the database, `users/ada` (empty for the root). */
		path?: string;
		/** Any JSON value: an object, a list, a string, a number, a boolean or null. */
		data: FirebaseJsonValue;
	};
	'database.update': {
		/** The database URL: https://<name>.firebaseio.com or https://<name>.<region>.firebasedatabase.app (databaseInstances.list returns it as databaseUrl). */
		databaseUrl: string;
		/** The location in the database, `users/ada` (empty for the root). */
		path?: string;
		/** The children to write: { "<child or child/path>": value }. Children not named stay as they are; a null value deletes that child. */
		data: Record<string, FirebaseJsonValue>;
	};
	'databaseInstances.locations.instances.create': {
		/** Required. The parent project for which to create a database instance, in the form: `projects/{project-number}/locations/{location-id}`. Format: `projects/<id>/locations/<id>`. */
		parent: string;
		/** The globally unique identifier of the database instance. */
		databaseId?: string;
		/** When set to true, the request will be validated but not submitted. */
		validateOnly?: boolean;
		/** Immutable. The database instance type. On creation only USER_DATABASE is allowed, which is also the default when omitted. */
		type?:
			| 'DATABASE_INSTANCE_TYPE_UNSPECIFIED'
			| 'DEFAULT_DATABASE'
			| 'USER_DATABASE';
		/** The fully qualified resource name of the database instance, in the form: `projects/{project-number}/locations/{location-id}/instances/{database-id}`. */
		name?: string;
	};
	'databaseInstances.locations.instances.delete': {
		/** Required. The fully qualified resource name of the database instance, in the form: `projects/{project-number}/locations/{location-id}/instances/{database-id}` Format: `projects/<id>/locations/<id>/instances/<id>`. */
		name: string;
	};
	'databaseInstances.locations.instances.disable': {
		/** Required. The fully qualified resource name of the database instance, in the form: `projects/{project-number}/locations/{location-id}/instances/{database-id}` Format: `projects/<id>/locations/<id>/instances/<id>`. */
		name: string;
		body?: FirebaseDisableDatabaseInstanceRequestInput;
	};
	'databaseInstances.locations.instances.get': {
		/** Required. The fully qualified resource name of the database instance, in the form: `projects/{project-number}/locations/{location-id}/instances/{database-id}`. `database-id` is a globally unique identifier across all parent collections. */
		name: string;
	};
	'databaseInstances.locations.instances.list': {
		/** Token returned from a previous call to `ListDatabaseInstances` indicating where in the set of database instances to resume listing. */
		pageToken?: string;
		/** Indicate that DatabaseInstances in the `DELETED` state should also be returned. */
		showDeleted?: boolean;
		/** Required. The parent project for which to list database instances, in the form: `projects/{project-number}/locations/{location-id}` To list across all locations, use a parent in the form: `projects/{project-number}/locations/-` Format: `projects/<id>/locations/<id>`. */
		parent: string;
		/** The maximum number of database instances to return in the response. The server may return fewer than this at its discretion. If no value is specified (or too large a value is specified), then the server will impose its own limit. */
		pageSize?: number;
	};
	'databaseInstances.locations.instances.reenable': {
		/** Required. The fully qualified resource name of the database instance, in the form: `projects/{project-number}/locations/{location-id}/instances/{database-id}` Format: `projects/<id>/locations/<id>/instances/<id>`. */
		name: string;
		body?: FirebaseReenableDatabaseInstanceRequestInput;
	};
	'databaseInstances.locations.instances.undelete': {
		/** Required. The fully qualified resource name of the database instance, in the form: `projects/{project-number}/locations/{location-id}/instances/{database-id}` Format: `projects/<id>/locations/<id>/instances/<id>`. */
		name: string;
		body?: FirebaseUndeleteDatabaseInstanceRequestInput;
	};
	'firestore.databases.backupSchedules.create': {
		/** Required. The parent database. Format `projects/{project}/databases/{database}` Format: `projects/<id>/databases/<id>`. */
		parent: string;
		/** For a schedule that runs weekly on a specific day. */
		weeklyRecurrence?: FirebaseGoogleFirestoreAdminV1WeeklyRecurrenceInput;
		/** For a schedule that runs daily. */
		dailyRecurrence?: FirebaseGoogleFirestoreAdminV1DailyRecurrenceInput;
		/** At what relative time in the future, compared to its creation time, the backup should be deleted, e.g. keep backups for 7 days. The maximum supported retention period is 14 weeks. */
		retention?: string;
	};
	'firestore.databases.backupSchedules.delete': {
		/** Required. The name of the backup schedule. Format `projects/{project}/databases/{database}/backupSchedules/{backup_schedule}` Format: `projects/<id>/databases/<id>/backupSchedules/<id>`. */
		name: string;
	};
	'firestore.databases.backupSchedules.get': {
		/** Required. The name of the backup schedule. Format `projects/{project}/databases/{database}/backupSchedules/{backup_schedule}` Format: `projects/<id>/databases/<id>/backupSchedules/<id>`. */
		name: string;
	};
	'firestore.databases.backupSchedules.list': {
		/** Required. The parent database. Format is `projects/{project}/databases/{database}`. Format: `projects/<id>/databases/<id>`. */
		parent: string;
	};
	'firestore.databases.backupSchedules.patch': {
		/** The list of fields to be updated. */
		updateMask?: string;
		/** Output only. The unique backup schedule identifier across all locations and databases for the given project. This will be auto-assigned. Format is `projects/{project}/databases/{database}/backupSchedules/{backup_schedule}` Format: `projects/<id>/databases/<id>/backupSchedules/<id>`. */
		name: string;
		/** For a schedule that runs weekly on a specific day. */
		weeklyRecurrence?: FirebaseGoogleFirestoreAdminV1WeeklyRecurrenceInput;
		/** For a schedule that runs daily. */
		dailyRecurrence?: FirebaseGoogleFirestoreAdminV1DailyRecurrenceInput;
		/** At what relative time in the future, compared to its creation time, the backup should be deleted, e.g. keep backups for 7 days. The maximum supported retention period is 14 weeks. */
		retention?: string;
	};
	'firestore.databases.bulkDeleteDocuments': {
		/** Required. Database to operate. Should be of the form: `projects/{project_id}/databases/{database_id}`. Format: `projects/<id>/databases/<id>`. */
		name: string;
		/** Optional. IDs of the collection groups to delete. Unspecified means all collection groups. Each collection group in this list must be unique. */
		collectionIds?: Array<string>;
		/** Optional. Namespaces to delete. An empty list means all namespaces. This is the recommended usage for databases that don't use namespaces. An empty string element represents the default namespace. */
		namespaceIds?: Array<string>;
	};
	'firestore.databases.changeStreams.create': {
		/** Required. The ID to use for the change stream, which will become the final component of the change stream's resource name. This value should be 4-63 characters. Valid characters are lowercase letters, numbers, and hyphens. */
		changeStreamId?: string;
		/** Required. The parent database to create the change stream for. Format is `projects/{project}/databases/{database}`. Format: `projects/<id>/databases/<id>`. */
		parent: string;
		/** Optional. An etag used to determine which version of the configuration is being edited. */
		etag?: string;
		/** If set, the change stream is scoped to a collection group. */
		collectionGroupScope?: FirebaseGoogleFirestoreAdminV1CollectionGroupScopeInput;
		/** Identifier. The external resource name of the change stream. Format `projects/{project}/databases/{database}/changeStreams/{change_stream}` */
		name?: string;
		/** If set, the change stream is scoped to the entire database. */
		databaseScope?: FirebaseGoogleFirestoreAdminV1DatabaseScopeInput;
		/** Required. The retention period of the change stream. This is the amount of time a change event is available on the change stream. Must be from 1 to 7 days, inclusive. The retention_period must be in day granularity, i.e. it must be a multiple of 24 hours. */
		retentionPeriod?: string;
	};
	'firestore.databases.changeStreams.delete': {
		/** Required. The name of the change stream to delete. Format is `projects/{project}/databases/{database}/changeStreams/{change_stream}`. Format: `projects/<id>/databases/<id>/changeStreams/<id>`. */
		name: string;
		/** Optional. The etag of the change stream to delete. If this is not the current etag of the change stream, the deletion will fail. */
		etag?: string;
	};
	'firestore.databases.changeStreams.get': {
		/** Required. The name of the change stream to retrieve. Format is `projects/{project}/databases/{database}/changeStreams/{change_stream}`. Format: `projects/<id>/databases/<id>/changeStreams/<id>`. */
		name: string;
	};
	'firestore.databases.changeStreams.list': {
		/** Required. The parent database to list change streams from. Format is `projects/{project}/databases/{database}`. Format: `projects/<id>/databases/<id>`. */
		parent: string;
	};
	'firestore.databases.clone': {
		/** Required. The project to clone the database in. Format is `projects/{project_id}`. Format: `projects/<id>`. */
		parent: string;
		/** Required. The ID to use for the database, which will become the final component of the database's resource name. This database ID must not be associated with an existing database. This value should be 4-63 characters. */
		databaseId?: string;
		/** Required. Specification of the PITR data to clone from. The source database must exist. The cloned database will be created in the same location as the source database. */
		pitrSnapshot?: FirebaseGoogleFirestoreAdminV1PitrSnapshotInput;
		/** Optional. Encryption configuration for the cloned database. If this field is not specified, the cloned database will use the same encryption configuration as the source database, namely use_source_encryption. */
		encryptionConfig?: FirebaseGoogleFirestoreAdminV1EncryptionConfigInput;
		/** Optional. Immutable. Tags to be bound to the cloned database. The tags should be provided in the format of `tagKeys/{tag_key_id} -> tagValues/{tag_value_id}`. */
		tags?: Record<string, string>;
	};
	'firestore.databases.collectionGroups.fields.get': {
		/** Required. A name of the form `projects/{project_id}/databases/{database_id}/collectionGroups/{collection_id}/fields/{field_id}` Format: `projects/<id>/databases/<id>/collectionGroups/<id>/fields/<id>`. */
		name: string;
	};
	'firestore.databases.collectionGroups.fields.list': {
		/** Required. A parent name of the form `projects/{project_id}/databases/{database_id}/collectionGroups/{collection_id}` Format: `projects/<id>/databases/<id>/collectionGroups/<id>`. */
		parent: string;
		/** The filter to apply to list results. Currently, FirestoreAdmin.ListFields only supports listing fields that have been explicitly overridden. To issue this query, call FirestoreAdmin.ListFields with a filter that includes `indexConfig.usesAncestorConfig:false` or `ttlConfig:*`. */
		filter?: string;
		/** The number of results to return. */
		pageSize?: number;
		/** A page token, returned from a previous call to FirestoreAdmin.ListFields, that may be used to get the next page of results. */
		pageToken?: string;
	};
	'firestore.databases.collectionGroups.fields.patch': {
		/** A mask, relative to the field. If specified, only configuration specified by this field_mask will be updated in the field. */
		updateMask?: string;
		/** Required. A field name of the form: `projects/{project_id}/databases/{database_id}/collectionGroups/{collection_id}/fields/{field_path}` A field path can be a simple field name, e.g. `address` or a path to fields within `map_value` , e.g. `address.city`, or a special field path. */
		name: string;
		/** The TTL configuration for this `Field`. Setting or unsetting this will enable or disable the TTL for documents that have this `Field`. */
		ttlConfig?: FirebaseGoogleFirestoreAdminV1TtlConfigInput;
		/** The index configuration for this field. If unset, field indexing will revert to the configuration defined by the `ancestor_field`. To explicitly remove all indexes for this field, specify an index config with an empty list of indexes. */
		indexConfig?: FirebaseGoogleFirestoreAdminV1IndexConfigInput;
		/** Required. A field name of the form: `projects/{project_id}/databases/{database_id}/collectionGroups/{collection_id}/fields/{field_path}` A field path can be a simple field name, e.g. `address` or a path to fields within `map_value` , e.g. `address.city`, or a special field path. */
		body_name?: string;
	};
	'firestore.databases.collectionGroups.indexes.create': {
		/** Required. A parent name of the form `projects/{project_id}/databases/{database_id}/collectionGroups/{collection_id}` Format: `projects/<id>/databases/<id>/collectionGroups/<id>`. */
		parent: string;
		/** Immutable. The density configuration of the index. */
		density?: 'DENSITY_UNSPECIFIED' | 'SPARSE_ALL' | 'SPARSE_ANY' | 'DENSE';
		/** Optional. Options for search indexes that are at the index definition level. This field is only currently supported for indexes with MONGODB_COMPATIBLE_API ApiScope. */
		searchIndexOptions?: FirebaseGoogleFirestoreAdminV1SearchIndexOptionsInput;
		/** Optional. Whether the index is multikey. By default, the index is not multikey. For non-multikey indexes, none of the paths in the index definition reach or traverse an array, except via an explicit array index. */
		multikey?: boolean;
		/** Output only. The serving state of the index. */
		state?: 'STATE_UNSPECIFIED' | 'CREATING' | 'READY' | 'NEEDS_REPAIR';
		/** Optional. Whether it is an unique index. Unique index ensures all values for the indexed field(s) are unique across documents. */
		unique?: boolean;
		/** Indexes with a collection query scope specified allow queries against a collection that is the child of a specific document, specified at query time, and that has the same collection ID. */
		queryScope?:
			| 'QUERY_SCOPE_UNSPECIFIED'
			| 'COLLECTION'
			| 'COLLECTION_GROUP'
			| 'COLLECTION_RECURSIVE';
		/** The API scope supported by this index. */
		apiScope?: 'ANY_API' | 'DATASTORE_MODE_API' | 'MONGODB_COMPATIBLE_API';
		/** A server-defined name for this index. Output only. When used in the google.firestore.admin.v1.Index resource, the value is of the form: `projects/{project_id}/databases/{database_id}/collectionGroups/{collection_id}/indexes/{index_id}` When used in the google.firestore.admin.v1.Field resource, the… */
		name?: string;
		/** Optional. The number of physical shards for the index. In Cloud Firestore, data and index entries are stored in contiguous, ordered key ranges called splits. */
		shardCount?: number;
		/** The fields supported by this index. At most 100 fields may be specified. In Standard edition databases only: - At least 2 fields must be specified. - The last field entry is always for the field path `__name__`. */
		fields?: Array<FirebaseGoogleFirestoreAdminV1IndexFieldInput>;
	};
	'firestore.databases.collectionGroups.indexes.delete': {
		/** Required. A name of the form `projects/{project_id}/databases/{database_id}/collectionGroups/{collection_id}/indexes/{index_id}` Format: `projects/<id>/databases/<id>/collectionGroups/<id>/indexes/<id>`. */
		name: string;
	};
	'firestore.databases.collectionGroups.indexes.get': {
		/** Required. A name of the form `projects/{project_id}/databases/{database_id}/collectionGroups/{collection_id}/indexes/{index_id}` Format: `projects/<id>/databases/<id>/collectionGroups/<id>/indexes/<id>`. */
		name: string;
	};
	'firestore.databases.collectionGroups.indexes.list': {
		/** The number of results to return. */
		pageSize?: number;
		/** Required. A parent name of the form `projects/{project_id}/databases/{database_id}/collectionGroups/{collection_id}` Format: `projects/<id>/databases/<id>/collectionGroups/<id>`. */
		parent: string;
		/** The filter to apply to list results. */
		filter?: string;
		/** A page token, returned from a previous call to FirestoreAdmin.ListIndexes, that may be used to get the next page of results. */
		pageToken?: string;
	};
	'firestore.databases.create': {
		/** Required. A parent name of the form `projects/{project_id}` Format: `projects/<id>`. */
		parent: string;
		/** Required. The ID to use for the database, which will become the final component of the database's resource name. This value should be 4-63 characters. Valid characters are /a-z-/ with first character a letter and the last a letter or a number. */
		databaseId?: string;
		/** Optional. The Firestore API data access mode to use for this database. If not set on write: - the default value is DATA_ACCESS_MODE_DISABLED for Enterprise edition. - the default value is DATA_ACCESS_MODE_ENABLED for Standard edition. */
		firestoreDataAccessMode?:
			| 'DATA_ACCESS_MODE_UNSPECIFIED'
			| 'DATA_ACCESS_MODE_ENABLED'
			| 'DATA_ACCESS_MODE_DISABLED';
		/** The default concurrency control mode to use for this database. If unspecified in a CreateDatabase request, this will default based on the database edition: Optimistic for Enterprise and Pessimistic for all other databases. */
		concurrencyMode?:
			| 'CONCURRENCY_MODE_UNSPECIFIED'
			| 'OPTIMISTIC'
			| 'PESSIMISTIC'
			| 'OPTIMISTIC_WITH_ENTITY_GROUPS';
		/** This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding. */
		etag?: string;
		/** Immutable. The edition of the database. */
		databaseEdition?:
			| 'DATABASE_EDITION_UNSPECIFIED'
			| 'STANDARD'
			| 'ENTERPRISE';
		/** Required. The location of the database. Available locations are listed at https://cloud.google.com/firestore/docs/locations. */
		locationId?: string;
		/** Immutable. The default Realtime Updates mode to use for this database. */
		realtimeUpdatesMode?:
			| 'REALTIME_UPDATES_MODE_UNSPECIFIED'
			| 'REALTIME_UPDATES_MODE_ENABLED'
			| 'REALTIME_UPDATES_MODE_DISABLED';
		/** Optional. Input only. Immutable. Tag keys/values directly bound to this resource. For example: "123/environment": "production", "123/costCenter": "marketing" */
		tags?: Record<string, string>;
		/** Optional. Presence indicates CMEK is enabled for this database. */
		cmekConfig?: FirebaseGoogleFirestoreAdminV1CmekConfigInput;
		/** Required. The type of the database. See https://cloud.google.com/datastore/docs/firestore-or-datastore for information about how to choose. */
		type?: 'DATABASE_TYPE_UNSPECIFIED' | 'FIRESTORE_NATIVE' | 'DATASTORE_MODE';
		/** The App Engine integration mode to use for this database. */
		appEngineIntegrationMode?:
			| 'APP_ENGINE_INTEGRATION_MODE_UNSPECIFIED'
			| 'ENABLED'
			| 'DISABLED';
		/** Whether to enable the PITR feature on this database. */
		pointInTimeRecoveryEnablement?:
			| 'POINT_IN_TIME_RECOVERY_ENABLEMENT_UNSPECIFIED'
			| 'POINT_IN_TIME_RECOVERY_ENABLED'
			| 'POINT_IN_TIME_RECOVERY_DISABLED';
		/** State of delete protection for the database. */
		deleteProtectionState?:
			| 'DELETE_PROTECTION_STATE_UNSPECIFIED'
			| 'DELETE_PROTECTION_DISABLED'
			| 'DELETE_PROTECTION_ENABLED';
		/** Optional. The MongoDB compatible API data access mode to use for this database. If not set on write, the default value is DATA_ACCESS_MODE_ENABLED for Enterprise edition. The value is always DATA_ACCESS_MODE_DISABLED for Standard edition. */
		mongodbCompatibleDataAccessMode?:
			| 'DATA_ACCESS_MODE_UNSPECIFIED'
			| 'DATA_ACCESS_MODE_ENABLED'
			| 'DATA_ACCESS_MODE_DISABLED';
		/** The resource name of the Database. Format: `projects/{project}/databases/{database}` */
		name?: string;
	};
	'firestore.databases.delete': {
		/** Required. A name of the form `projects/{project_id}/databases/{database_id}` Format: `projects/<id>/databases/<id>`. */
		name: string;
		/** The current etag of the Database. If an etag is provided and does not match the current etag of the database, deletion will be blocked and a FAILED_PRECONDITION error will be returned. */
		etag?: string;
	};
	'firestore.databases.documents.batchGet': {
		/** Required. The database name. In the format: `projects/{project_id}/databases/{database_id}`. Format: `projects/<id>/databases/<id>`. */
		database: string;
		/** The names of the documents to retrieve. In the format: `projects/{project_id}/databases/{database_id}/documents/{document_path}`. The request will fail if any of the document is not a child resource of the given `database`. Duplicate names will be elided. */
		documents?: Array<string>;
		/** Optional. The request options for this request. */
		requestOptions?: FirebaseRequestOptionsInput;
		/** Starts a new transaction and reads the documents. Defaults to a read-only transaction. The new transaction ID will be returned as the first response in the stream. */
		newTransaction?: FirebaseTransactionOptionsInput;
		/** Reads documents as they were at the given time. This must be a microsecond precision timestamp within the past one hour, or if Point-in-Time Recovery is enabled, can additionally be a whole minute timestamp within the past 7 days. */
		readTime?: string;
		/** The fields to return. If not set, returns all fields. If a document has a field that is not present in this mask, that field will not be returned in the response. */
		mask?: FirebaseDocumentMaskInput;
		/** Reads documents in a transaction. (base64) */
		transaction?: string;
	};
	'firestore.databases.documents.batchWrite': {
		/** Required. The database name. In the format: `projects/{project_id}/databases/{database_id}`. Format: `projects/<id>/databases/<id>`. */
		database: string;
		/** The writes to apply. Method does not apply writes atomically and does not guarantee ordering. Each write succeeds or fails independently. You cannot write to the same document more than once per request. */
		writes?: Array<FirebaseWriteInput>;
		/** Optional. The request options for this request. */
		requestOptions?: FirebaseRequestOptionsInput;
		/** Labels associated with this batch write. */
		labels?: Record<string, string>;
	};
	'firestore.databases.documents.beginTransaction': {
		/** Required. The database name. In the format: `projects/{project_id}/databases/{database_id}`. Format: `projects/<id>/databases/<id>`. */
		database: string;
		/** The options for the transaction. Defaults to a read-write transaction. */
		options?: FirebaseTransactionOptionsInput;
		/** Optional. The request options for this request. */
		requestOptions?: FirebaseRequestOptionsInput;
	};
	'firestore.databases.documents.commit': {
		/** Required. The database name. In the format: `projects/{project_id}/databases/{database_id}`. Format: `projects/<id>/databases/<id>`. */
		database: string;
		/** Optional. The request options for this request. */
		requestOptions?: FirebaseRequestOptionsInput;
		/** The writes to apply. Always executed atomically and in order. */
		writes?: Array<FirebaseWriteInput>;
		/** If set, applies all writes in this transaction, and commits it. (base64) */
		transaction?: string;
	};
	'firestore.databases.documents.createDocument': {
		/** Required. The parent resource. For example: `projects/{project_id}/databases/{database_id}/documents` or `projects/{project_id}/databases/{database_id}/documents/chatrooms/{chatroom_id}` Format: `projects/<id>/databases/<id>/documents/<path>`. */
		parent: string;
		/** The list of field paths in the mask. See Document.fields for a field path syntax reference. */
		'mask.fieldPaths'?: Array<string>;
		/** Optional. The request tags for the request. Request tags are user-provided strings used for usage monitoring, cost management, and observability. Callers can associate custom application context (such as component, microservice, feature name, or operation type) with database requests. */
		'requestOptions.requestTags'?: Array<string>;
		/** The client-assigned document ID to use for this document. Optional. If not specified, an ID will be assigned by the service. */
		documentId?: string;
		/** Required. The collection ID, relative to `parent`, to list. For example: `chatrooms`. */
		collectionId: string;
		/** The resource name of the document, for example `projects/{project_id}/databases/{database_id}/documents/{document_path}`. */
		name?: string;
		/** Output only. The time at which the document was last changed. This value is initially set to the `create_time` then increases monotonically with each change to the document. It can also be compared to values from other documents and the `read_time` of a query. */
		updateTime?: string;
		/** Output only. The time at which the document was created. This value increases monotonically when a document is deleted then recreated. It can also be compared to values from other documents and the `read_time` of a query. */
		createTime?: string;
		/** The document's fields. The map keys represent field names. Field names matching the regular expression `__.*__` are reserved. Reserved field names are forbidden except in certain documented contexts. The field names, represented as UTF-8, must not exceed 1,500 bytes and cannot be empty. */
		fields?: Record<string, FirebaseValueInput>;
	};
	'firestore.databases.documents.delete': {
		/** When set to `true`, the target document must exist. When set to `false`, the target document must not exist. */
		'currentDocument.exists'?: boolean;
		/** Required. The resource name of the Document to delete. In the format: `projects/{project_id}/databases/{database_id}/documents/{document_path}`. Format: `projects/<id>/databases/<id>/documents/<id>/<path>`. */
		name: string;
		/** When set, the target document must exist and have been last updated at that time. Timestamp must be microsecond aligned. */
		'currentDocument.updateTime'?: string;
		/** Optional. The request tags for the request. Request tags are user-provided strings used for usage monitoring, cost management, and observability. Callers can associate custom application context (such as component, microservice, feature name, or operation type) with database requests. */
		'requestOptions.requestTags'?: Array<string>;
	};
	'firestore.databases.documents.executePipeline': {
		/** Required. Database identifier, in the form `projects/{project}/databases/{database}`. Format: `projects/<id>/databases/<id>`. */
		database: string;
		/** Optional. The request options for this request. */
		requestOptions?: FirebaseRequestOptionsInput;
		/** Execute the pipeline in a snapshot transaction at the given time. This must be a microsecond precision timestamp within the past one hour, or if Point-in-Time Recovery is enabled, can additionally be a whole minute timestamp within the past 7 days. */
		readTime?: string;
		/** A pipelined operation. */
		structuredPipeline?: FirebaseStructuredPipelineInput;
		/** Run the query within an already active transaction. The value here is the opaque transaction ID to execute the query in. (base64) */
		transaction?: string;
		/** Execute the pipeline in a new transaction. The identifier of the newly created transaction will be returned in the first response on the stream. This defaults to a read-only transaction. */
		newTransaction?: FirebaseTransactionOptionsInput;
		/** Optional. Automatically commits the transaction after the pipeline has been executed. Only permitted in combination with `transaction` or `new_transaction`. */
		autoCommitTransaction?: boolean;
	};
	'firestore.databases.documents.get': {
		/** The list of field paths in the mask. See Document.fields for a field path syntax reference. */
		'mask.fieldPaths'?: Array<string>;
		/** Optional. The request tags for the request. Request tags are user-provided strings used for usage monitoring, cost management, and observability. Callers can associate custom application context (such as component, microservice, feature name, or operation type) with database requests. */
		'requestOptions.requestTags'?: Array<string>;
		/** Reads the version of the document at the given time. This must be a microsecond precision timestamp within the past one hour, or if Point-in-Time Recovery is enabled, can additionally be a whole minute timestamp within the past 7 days. */
		readTime?: string;
		/** Required. The resource name of the Document to get. In the format: `projects/{project_id}/databases/{database_id}/documents/{document_path}`. Format: `projects/<id>/databases/<id>/documents/<id>/<path>`. */
		name: string;
		/** Reads the document in a transaction. */
		transaction?: string;
	};
	'firestore.databases.documents.list': {
		/** Optional. The maximum number of documents to return in a single response. Firestore may return fewer than this value. */
		pageSize?: number;
		/** Perform the read as part of an already active transaction. */
		transaction?: string;
		/** Perform the read at the provided time. This must be a microsecond precision timestamp within the past one hour, or if Point-in-Time Recovery is enabled, can additionally be a whole minute timestamp within the past 7 days. */
		readTime?: string;
		/** Optional. A page token, received from a previous `ListDocuments` response. Provide this to retrieve the subsequent page. When paginating, all other parameters (with the exception of `page_size`) must match the values set in the request that generated the page token. */
		pageToken?: string;
		/** The list of field paths in the mask. See Document.fields for a field path syntax reference. */
		'mask.fieldPaths'?: Array<string>;
		/** Optional. The collection ID, relative to `parent`, to list. For example: `chatrooms` or `messages`. This is optional, and when not provided, Firestore will list documents from all collections under the provided `parent`. */
		collectionId: string;
		/** If the list should show missing documents. A document is missing if it does not exist, but there are sub-documents nested underneath it. When true, such missing documents will be returned with a key but will not have fields, `create_time`, or `update_time` set. */
		showMissing?: boolean;
		/** Optional. The request tags for the request. Request tags are user-provided strings used for usage monitoring, cost management, and observability. Callers can associate custom application context (such as component, microservice, feature name, or operation type) with database requests. */
		'requestOptions.requestTags'?: Array<string>;
		/** Optional. The optional ordering of the documents to return. For example: `priority desc, __name__ desc`. This mirrors the `ORDER BY` used in Firestore queries but in a string representation. When absent, documents are ordered based on `__name__ ASC`. */
		orderBy?: string;
		/** Optional. If the list should recursively include all documents nested under the parent at any level. If the request specifies a `collection_id`, then the list will include all nested documents in the collection under the parent. */
		recursive?: boolean;
		/** Required. The parent resource name. In the format: `projects/{project_id}/databases/{database_id}/documents` or `projects/{project_id}/databases/{database_id}/documents/{document_path}`. */
		parent: string;
	};
	'firestore.databases.documents.listCollectionIds': {
		/** Required. The parent document. In the format: `projects/{project_id}/databases/{database_id}/documents/{document_path}`. */
		parent: string;
		/** The maximum number of results to return. */
		pageSize?: number;
		/** Reads documents as they were at the given time. This must be a microsecond precision timestamp within the past one hour, or if Point-in-Time Recovery is enabled, can additionally be a whole minute timestamp within the past 7 days. */
		readTime?: string;
		/** Optional. The request options for this request. */
		requestOptions?: FirebaseRequestOptionsInput;
		/** A page token. Must be a value from ListCollectionIdsResponse. */
		pageToken?: string;
	};
	'firestore.databases.documents.listDocuments': {
		/** The list of field paths in the mask. See Document.fields for a field path syntax reference. */
		'mask.fieldPaths'?: Array<string>;
		/** Optional. The collection ID, relative to `parent`, to list. For example: `chatrooms` or `messages`. This is optional, and when not provided, Firestore will list documents from all collections under the provided `parent`. */
		collectionId: string;
		/** Optional. The optional ordering of the documents to return. For example: `priority desc, __name__ desc`. This mirrors the `ORDER BY` used in Firestore queries but in a string representation. When absent, documents are ordered based on `__name__ ASC`. */
		orderBy?: string;
		/** If the list should show missing documents. A document is missing if it does not exist, but there are sub-documents nested underneath it. When true, such missing documents will be returned with a key but will not have fields, `create_time`, or `update_time` set. */
		showMissing?: boolean;
		/** Optional. A page token, received from a previous `ListDocuments` response. Provide this to retrieve the subsequent page. When paginating, all other parameters (with the exception of `page_size`) must match the values set in the request that generated the page token. */
		pageToken?: string;
		/** Required. The parent resource name. In the format: `projects/{project_id}/databases/{database_id}/documents` or `projects/{project_id}/databases/{database_id}/documents/{document_path}`. */
		parent: string;
		/** Perform the read at the provided time. This must be a microsecond precision timestamp within the past one hour, or if Point-in-Time Recovery is enabled, can additionally be a whole minute timestamp within the past 7 days. */
		readTime?: string;
		/** Optional. The request tags for the request. Request tags are user-provided strings used for usage monitoring, cost management, and observability. Callers can associate custom application context (such as component, microservice, feature name, or operation type) with database requests. */
		'requestOptions.requestTags'?: Array<string>;
		/** Optional. If the list should recursively include all documents nested under the parent at any level. If the request specifies a `collection_id`, then the list will include all nested documents in the collection under the parent. */
		recursive?: boolean;
		/** Perform the read as part of an already active transaction. */
		transaction?: string;
		/** Optional. The maximum number of documents to return in a single response. Firestore may return fewer than this value. */
		pageSize?: number;
	};
	'firestore.databases.documents.partitionQuery': {
		/** The documents root: `projects/<project>/databases/<database>/documents` (a document path is refused). */
		parent: string;
		/** The `next_page_token` value returned from a previous call to PartitionQuery that may be used to get an additional set of results. There are no ordering guarantees between sets of results. Thus, using multiple sets of results will require merging the different result sets. */
		pageToken?: string;
		/** A structured query. Query must specify collection with all descendants and be ordered by name ascending. Other filters, order bys, limits, offsets, and start/end cursors are not supported. */
		structuredQuery?: FirebaseStructuredQueryInput;
		/** The maximum number of partitions to return in this call, subject to `partition_count`. For example, if `partition_count` = 10 and `page_size` = 8, the first call to PartitionQuery will return up to 8 partitions and a `next_page_token` if more results exist. */
		pageSize?: number;
		/** Optional. The request options for the request. */
		requestOptions?: FirebaseRequestOptionsInput;
		/** Reads documents as they were at the given time. This must be a microsecond precision timestamp within the past one hour, or if Point-in-Time Recovery is enabled, can additionally be a whole minute timestamp within the past 7 days. */
		readTime?: string;
		/** The desired maximum number of partition points. The partitions may be returned across multiple pages of results. The number must be positive. The actual number of partitions returned may be fewer. */
		partitionCount?: string | number;
	};
	'firestore.databases.documents.patch': {
		/** When set, the target document must exist and have been last updated at that time. Timestamp must be microsecond aligned. */
		'currentDocument.updateTime'?: string;
		/** The list of field paths in the mask. See Document.fields for a field path syntax reference. */
		'updateMask.fieldPaths'?: Array<string>;
		/** When set to `true`, the target document must exist. When set to `false`, the target document must not exist. */
		'currentDocument.exists'?: boolean;
		/** The resource name of the document, for example `projects/{project_id}/databases/{database_id}/documents/{document_path}`. Format: `projects/<id>/databases/<id>/documents/<id>/<path>`. */
		name: string;
		/** Optional. The request tags for the request. Request tags are user-provided strings used for usage monitoring, cost management, and observability. Callers can associate custom application context (such as component, microservice, feature name, or operation type) with database requests. */
		'requestOptions.requestTags'?: Array<string>;
		/** The list of field paths in the mask. See Document.fields for a field path syntax reference. */
		'mask.fieldPaths'?: Array<string>;
		/** The resource name of the document, for example `projects/{project_id}/databases/{database_id}/documents/{document_path}`. */
		body_name?: string;
		/** Output only. The time at which the document was last changed. This value is initially set to the `create_time` then increases monotonically with each change to the document. It can also be compared to values from other documents and the `read_time` of a query. */
		updateTime?: string;
		/** Output only. The time at which the document was created. This value increases monotonically when a document is deleted then recreated. It can also be compared to values from other documents and the `read_time` of a query. */
		createTime?: string;
		/** The document's fields. The map keys represent field names. Field names matching the regular expression `__.*__` are reserved. Reserved field names are forbidden except in certain documented contexts. The field names, represented as UTF-8, must not exceed 1,500 bytes and cannot be empty. */
		fields?: Record<string, FirebaseValueInput>;
	};
	'firestore.databases.documents.rollback': {
		/** Required. The database name. In the format: `projects/{project_id}/databases/{database_id}`. Format: `projects/<id>/databases/<id>`. */
		database: string;
		/** Required. The transaction to roll back. (base64) */
		transaction?: string;
		/** Optional. The request options for this request. */
		requestOptions?: FirebaseRequestOptionsInput;
	};
	'firestore.databases.documents.runAggregationQuery': {
		/** Required. The parent resource name. In the format: `projects/{project_id}/databases/{database_id}/documents` or `projects/{project_id}/databases/{database_id}/documents/{document_path}`. */
		parent: string;
		/** Run the aggregation within an already active transaction. The value here is the opaque transaction ID to execute the query in. (base64) */
		transaction?: string;
		/** Optional. Explain options for the query. If set, additional query statistics will be returned. If not, only query results will be returned. */
		explainOptions?: FirebaseExplainOptionsInput;
		/** Optional. The request options for the request. */
		requestOptions?: FirebaseRequestOptionsInput;
		/** Executes the query at the given timestamp. This must be a microsecond precision timestamp within the past one hour, or if Point-in-Time Recovery is enabled, can additionally be a whole minute timestamp within the past 7 days. */
		readTime?: string;
		/** Starts a new transaction as part of the query, defaulting to read-only. The new transaction ID will be returned as the first response in the stream. */
		newTransaction?: FirebaseTransactionOptionsInput;
		/** An aggregation query. */
		structuredAggregationQuery?: FirebaseStructuredAggregationQueryInput;
	};
	'firestore.databases.documents.runQuery': {
		/** Required. The parent resource name. In the format: `projects/{project_id}/databases/{database_id}/documents` or `projects/{project_id}/databases/{database_id}/documents/{document_path}`. */
		parent: string;
		/** A structured query. */
		structuredQuery?: FirebaseStructuredQueryInput;
		/** Optional. Explain options for the query. If set, additional query statistics will be returned. If not, only query results will be returned. */
		explainOptions?: FirebaseExplainOptionsInput;
		/** Optional. The request options for this request. */
		requestOptions?: FirebaseRequestOptionsInput;
		/** Reads documents as they were at the given time. This must be a microsecond precision timestamp within the past one hour, or if Point-in-Time Recovery is enabled, can additionally be a whole minute timestamp within the past 7 days. */
		readTime?: string;
		/** Run the query within an already active transaction. The value here is the opaque transaction ID to execute the query in. (base64) */
		transaction?: string;
		/** Starts a new transaction and reads the documents. Defaults to a read-only transaction. The new transaction ID will be returned as the first response in the stream. */
		newTransaction?: FirebaseTransactionOptionsInput;
	};
	'firestore.databases.exportDocuments': {
		/** Required. Database to export. Should be of the form: `projects/{project_id}/databases/{database_id}`. Format: `projects/<id>/databases/<id>`. */
		name: string;
		/** IDs of the collection groups to export. Unspecified means all collection groups. Each collection group in this list must be unique. */
		collectionIds?: Array<string>;
		/** The timestamp that corresponds to the version of the database to be exported. The timestamp must be in the past, rounded to the minute and not older than earliestVersionTime. If specified, then the exported documents will represent a consistent view of the database at the provided time. */
		snapshotTime?: string;
		/** The output URI. Currently only supports Google Cloud Storage URIs of the form… */
		outputUriPrefix?: string;
		/** An empty list represents all namespaces. This is the preferred usage for databases that don't use namespaces. An empty string element represents the default namespace. This should be used if the database has data in non-default namespaces, but doesn't want to include them. */
		namespaceIds?: Array<string>;
	};
	'firestore.databases.get': {
		/** Required. A name of the form `projects/{project_id}/databases/{database_id}` Format: `projects/<id>/databases/<id>`. */
		name: string;
	};
	'firestore.databases.importDocuments': {
		/** Required. Database to import into. Should be of the form: `projects/{project_id}/databases/{database_id}`. Format: `projects/<id>/databases/<id>`. */
		name: string;
		/** IDs of the collection groups to import. Unspecified means all collection groups that were included in the export. Each collection group in this list must be unique. */
		collectionIds?: Array<string>;
		/** Location of the exported files. This must match the output_uri_prefix of an ExportDocumentsResponse from an export that has completed successfully. See: google.firestore.admin.v1.ExportDocumentsResponse.output_uri_prefix. */
		inputUriPrefix?: string;
		/** An empty list represents all namespaces. This is the preferred usage for databases that don't use namespaces. An empty string element represents the default namespace. This should be used if the database has data in non-default namespaces, but doesn't want to include them. */
		namespaceIds?: Array<string>;
	};
	'firestore.databases.list': {
		/** If true, also returns deleted resources. */
		showDeleted?: boolean;
		/** Required. A parent name of the form `projects/{project_id}` Format: `projects/<id>`. */
		parent: string;
	};
	'firestore.databases.operations.cancel': {
		/** The name of the operation resource to be cancelled. Format: `projects/<id>/databases/<id>/operations/<id>`. */
		name: string;
		body?: FirebaseFirestoreGoogleLongrunningCancelOperationRequestInput;
	};
	'firestore.databases.operations.delete': {
		/** The name of the operation resource to be deleted. Format: `projects/<id>/databases/<id>/operations/<id>`. */
		name: string;
	};
	'firestore.databases.operations.get': {
		/** The name of the operation resource. Format: `projects/<id>/databases/<id>/operations/<id>`. */
		name: string;
	};
	'firestore.databases.operations.list': {
		/** The standard list page size. */
		pageSize?: number;
		/** The standard list filter. */
		filter?: string;
		/** The name of the operation's parent resource. Format: `projects/<id>/databases/<id>`. */
		name: string;
		/** The standard list page token. */
		pageToken?: string;
		/** When set to `true`, operations that are reachable are returned as normal, and those that are unreachable are returned in the ListOperationsResponse.unreachable field. This can only be `true` when reading across collections. For example, when `parent` is set to `"projects/example/locations/-"`. */
		returnPartialSuccess?: boolean;
	};
	'firestore.databases.patch': {
		/** The resource name of the Database. Format: `projects/{project}/databases/{database}` Format: `projects/<id>/databases/<id>`. */
		name: string;
		/** The list of fields to be updated. */
		updateMask?: string;
		/** Optional. The Firestore API data access mode to use for this database. If not set on write: - the default value is DATA_ACCESS_MODE_DISABLED for Enterprise edition. - the default value is DATA_ACCESS_MODE_ENABLED for Standard edition. */
		firestoreDataAccessMode?:
			| 'DATA_ACCESS_MODE_UNSPECIFIED'
			| 'DATA_ACCESS_MODE_ENABLED'
			| 'DATA_ACCESS_MODE_DISABLED';
		/** The default concurrency control mode to use for this database. If unspecified in a CreateDatabase request, this will default based on the database edition: Optimistic for Enterprise and Pessimistic for all other databases. */
		concurrencyMode?:
			| 'CONCURRENCY_MODE_UNSPECIFIED'
			| 'OPTIMISTIC'
			| 'PESSIMISTIC'
			| 'OPTIMISTIC_WITH_ENTITY_GROUPS';
		/** This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding. */
		etag?: string;
		/** Immutable. The edition of the database. */
		databaseEdition?:
			| 'DATABASE_EDITION_UNSPECIFIED'
			| 'STANDARD'
			| 'ENTERPRISE';
		/** Required. The location of the database. Available locations are listed at https://cloud.google.com/firestore/docs/locations. */
		locationId?: string;
		/** Immutable. The default Realtime Updates mode to use for this database. */
		realtimeUpdatesMode?:
			| 'REALTIME_UPDATES_MODE_UNSPECIFIED'
			| 'REALTIME_UPDATES_MODE_ENABLED'
			| 'REALTIME_UPDATES_MODE_DISABLED';
		/** Optional. Input only. Immutable. Tag keys/values directly bound to this resource. For example: "123/environment": "production", "123/costCenter": "marketing" */
		tags?: Record<string, string>;
		/** Optional. Presence indicates CMEK is enabled for this database. */
		cmekConfig?: FirebaseGoogleFirestoreAdminV1CmekConfigInput;
		/** Required. The type of the database. See https://cloud.google.com/datastore/docs/firestore-or-datastore for information about how to choose. */
		type?: 'DATABASE_TYPE_UNSPECIFIED' | 'FIRESTORE_NATIVE' | 'DATASTORE_MODE';
		/** The App Engine integration mode to use for this database. */
		appEngineIntegrationMode?:
			| 'APP_ENGINE_INTEGRATION_MODE_UNSPECIFIED'
			| 'ENABLED'
			| 'DISABLED';
		/** Whether to enable the PITR feature on this database. */
		pointInTimeRecoveryEnablement?:
			| 'POINT_IN_TIME_RECOVERY_ENABLEMENT_UNSPECIFIED'
			| 'POINT_IN_TIME_RECOVERY_ENABLED'
			| 'POINT_IN_TIME_RECOVERY_DISABLED';
		/** State of delete protection for the database. */
		deleteProtectionState?:
			| 'DELETE_PROTECTION_STATE_UNSPECIFIED'
			| 'DELETE_PROTECTION_DISABLED'
			| 'DELETE_PROTECTION_ENABLED';
		/** Optional. The MongoDB compatible API data access mode to use for this database. If not set on write, the default value is DATA_ACCESS_MODE_ENABLED for Enterprise edition. The value is always DATA_ACCESS_MODE_DISABLED for Standard edition. */
		mongodbCompatibleDataAccessMode?:
			| 'DATA_ACCESS_MODE_UNSPECIFIED'
			| 'DATA_ACCESS_MODE_ENABLED'
			| 'DATA_ACCESS_MODE_DISABLED';
		/** The resource name of the Database. Format: `projects/{project}/databases/{database}` */
		body_name?: string;
	};
	'firestore.databases.restore': {
		/** Required. The project to restore the database in. Format is `projects/{project_id}`. Format: `projects/<id>`. */
		parent: string;
		/** Required. Backup to restore from. Must be from the same project as the parent. The restored database will be created in the same location as the source backup. Format is: `projects/{project_id}/locations/{location}/backups/{backup}` */
		backup?: string;
		/** Optional. Immutable. Tags to be bound to the restored database. The tags should be provided in the format of `tagKeys/{tag_key_id} -> tagValues/{tag_value_id}`. */
		tags?: Record<string, string>;
		/** Required. The ID to use for the database, which will become the final component of the database's resource name. This database ID must not be associated with an existing database. This value should be 4-63 characters. */
		databaseId?: string;
		/** Optional. Encryption configuration for the restored database. If this field is not specified, the restored database will use the same encryption configuration as the backup, namely use_source_encryption. */
		encryptionConfig?: FirebaseGoogleFirestoreAdminV1EncryptionConfigInput;
	};
	'firestore.databases.userCreds.create': {
		/** Required. A parent name of the form `projects/{project_id}/databases/{database_id}` Format: `projects/<id>/databases/<id>`. */
		parent: string;
		/** Required. The ID to use for the user creds, which will become the final component of the user creds's resource name. This value should be 4-63 characters. Valid characters are /a-z-/ with first character a letter and the last a letter or a number. */
		userCredsId?: string;
		/** Identifier. The resource name of the UserCreds. Format: `projects/{project}/databases/{database}/userCreds/{user_creds}` */
		name?: string;
		/** Resource Identity descriptor. */
		resourceIdentity?: FirebaseGoogleFirestoreAdminV1ResourceIdentityInput;
	};
	'firestore.databases.userCreds.delete': {
		/** Required. A name of the form `projects/{project_id}/databases/{database_id}/userCreds/{user_creds_id}` Format: `projects/<id>/databases/<id>/userCreds/<id>`. */
		name: string;
	};
	'firestore.databases.userCreds.disable': {
		/** Required. A name of the form `projects/{project_id}/databases/{database_id}/userCreds/{user_creds_id}` Format: `projects/<id>/databases/<id>/userCreds/<id>`. */
		name: string;
		body?: FirebaseGoogleFirestoreAdminV1DisableUserCredsRequestInput;
	};
	'firestore.databases.userCreds.enable': {
		/** Required. A name of the form `projects/{project_id}/databases/{database_id}/userCreds/{user_creds_id}` Format: `projects/<id>/databases/<id>/userCreds/<id>`. */
		name: string;
		body?: FirebaseGoogleFirestoreAdminV1EnableUserCredsRequestInput;
	};
	'firestore.databases.userCreds.get': {
		/** Required. A name of the form `projects/{project_id}/databases/{database_id}/userCreds/{user_creds_id}` Format: `projects/<id>/databases/<id>/userCreds/<id>`. */
		name: string;
	};
	'firestore.databases.userCreds.list': {
		/** Required. A parent database name of the form `projects/{project_id}/databases/{database_id}` Format: `projects/<id>/databases/<id>`. */
		parent: string;
	};
	'firestore.databases.userCreds.resetPassword': {
		/** Required. A name of the form `projects/{project_id}/databases/{database_id}/userCreds/{user_creds_id}` Format: `projects/<id>/databases/<id>/userCreds/<id>`. */
		name: string;
		body?: FirebaseGoogleFirestoreAdminV1ResetUserPasswordRequestInput;
	};
	'firestore.locations.backups.delete': {
		/** Required. Name of the backup to delete. format is `projects/{project}/locations/{location}/backups/{backup}`. Format: `projects/<id>/locations/<id>/backups/<id>`. */
		name: string;
	};
	'firestore.locations.backups.get': {
		/** Required. Name of the backup to fetch. Format is `projects/{project}/locations/{location}/backups/{backup}`. Format: `projects/<id>/locations/<id>/backups/<id>`. */
		name: string;
	};
	'firestore.locations.backups.list': {
		/** Required. The location to list backups from. Format is `projects/{project}/locations/{location}`. Use `{location} = '-'` to list backups from all locations for the given project. This allows listing backups from a single location or from all locations. Format: `projects/<id>/locations/<id>`. */
		parent: string;
		/** An expression that filters the list of returned backups. A filter expression consists of a field name, a comparison operator, and a value for filtering. The value must be a string, a number, or a boolean. The comparison operator must be one of: `<`, `>`, `<=`, `>=`, `!=`, `=`, or `:`. */
		filter?: string;
	};
	'firestore.locations.get': {
		/** Resource name for the location. Format: `projects/<id>/locations/<id>`. */
		name: string;
	};
	'firestore.locations.list': {
		/** A page token received from the `next_page_token` field in the response. Send that page token to receive the subsequent page. */
		pageToken?: string;
		/** A filter to narrow down results to a preferred subset. The filtering language accepts strings like `"displayName=tokyo"`, and is documented in more detail in [AIP-160](https://google.aip.dev/160). */
		filter?: string;
		/** Optional. Do not use this field unless explicitly documented otherwise. This is primarily for internal usage. */
		extraLocationTypes?: Array<string>;
		/** The resource that owns the locations collection, if applicable. Format: `projects/<id>`. */
		name: string;
		/** The maximum number of results to return. If not set, the service selects a default. */
		pageSize?: number;
	};
	'hosting.operations.get': {
		/** The name of the operation resource. Format: `projects/<id>/operations/<id>`. */
		name: string;
	};
	'hosting.sites.channels.create': {
		/** Required. The site in which to create this channel, in the format: sites/ SITE_ID Format: `sites/<id>`. */
		parent: string;
		/** Required. Immutable. A unique ID within the site that identifies the channel. */
		channelId?: string;
		/** The fully-qualified resource name for the channel, in the format: sites/ SITE_ID/channels/CHANNEL_ID */
		name?: string;
		/** Input only. A time-to-live for this channel. Sets `expire_time` to the provided duration past the time of the request. */
		ttl?: string;
		/** The number of previous releases to retain on the channel for rollback or other purposes. Must be a number between 1-100. Defaults to 10 for new channels. */
		retainedReleaseCount?: number;
		/** The time at which the channel will be automatically deleted. If null, the channel will not be automatically deleted. This field is present in the output whether it's set directly or via the `ttl` field. */
		expireTime?: string;
		/** Text labels used for extra metadata and/or filtering. */
		labels?: Record<string, string>;
	};
	'hosting.sites.channels.delete': {
		/** Required. The fully-qualified resource name for the channel, in the format: sites/SITE_ID/channels/CHANNEL_ID Format: `sites/<id>/channels/<id>`. */
		name: string;
	};
	'hosting.sites.channels.get': {
		/** Required. The fully-qualified resource name for the channel, in the format: sites/SITE_ID/channels/CHANNEL_ID Format: `sites/<id>/channels/<id>`. */
		name: string;
	};
	'hosting.sites.channels.list': {
		/** Required. The site for which to list channels, in the format: sites/SITE_ID Format: `sites/<id>`. */
		parent: string;
		/** The maximum number of channels to return. The service may return a lower number if fewer channels exist than this maximum number. If unspecified, defaults to 10. The maximum value is 100; values above 100 will be coerced to 100. */
		pageSize?: number;
		/** A token from a previous call to `ListChannels` that tells the server where to resume listing. */
		pageToken?: string;
	};
	'hosting.sites.channels.patch': {
		/** A comma-separated list of fields to be updated in this request. */
		updateMask?: string;
		/** The fully-qualified resource name for the channel, in the format: sites/ SITE_ID/channels/CHANNEL_ID Format: `sites/<id>/channels/<id>`. */
		name: string;
		/** The fully-qualified resource name for the channel, in the format: sites/ SITE_ID/channels/CHANNEL_ID */
		body_name?: string;
		/** Input only. A time-to-live for this channel. Sets `expire_time` to the provided duration past the time of the request. */
		ttl?: string;
		/** The number of previous releases to retain on the channel for rollback or other purposes. Must be a number between 1-100. Defaults to 10 for new channels. */
		retainedReleaseCount?: number;
		/** The time at which the channel will be automatically deleted. If null, the channel will not be automatically deleted. This field is present in the output whether it's set directly or via the `ttl` field. */
		expireTime?: string;
		/** Text labels used for extra metadata and/or filtering. */
		labels?: Record<string, string>;
	};
	'hosting.sites.channels.releases.create': {
		/** Required. The site or channel to which the release belongs, in either of the following formats: - sites/SITE_ID - sites/SITE_ID/channels/CHANNEL_ID Format: `sites/<id>/channels/<id>`. */
		parent: string;
		/** The unique identifier for a version, in the format: sites/SITE_ID/versions/ VERSION_ID The SITE_ID in this version identifier must match the SITE_ID in the `parent` parameter. This query parameter must be empty if the `type` field in the request body is `SITE_DISABLE`. */
		versionName?: string;
		/** Output only. The unique identifier for the release, in either of the following formats: - sites/SITE_ID/releases/RELEASE_ID - sites/SITE_ID/channels/CHANNEL_ID/releases/RELEASE_ID This name is provided in the response body when you call `releases.create` or `channels.releases.create`. */
		name?: string;
		/** Output only. The configuration and content that was released. */
		version?: FirebaseHostingVersionInput;
		/** The deploy description when the release was created. The value can be up to 512 characters. */
		message?: string;
		/** Output only. The time at which the version is set to be public. */
		releaseTime?: string;
		/** Output only. Identifies the user who created the release. */
		releaseUser?: FirebaseActingUserInput;
		/** Explains the reason for the release. Specify a value for this field only when creating a `SITE_DISABLE` type release. */
		type?: 'TYPE_UNSPECIFIED' | 'DEPLOY' | 'ROLLBACK' | 'SITE_DISABLE';
	};
	'hosting.sites.channels.releases.get': {
		/** Required. The fully-qualified resource name for the Hosting release, in either of the following formats: - sites/SITE_ID/channels/CHANNEL_ID/releases/RELEASE_ID - sites/SITE_ID/releases/RELEASE_ID Format: `sites/<id>/channels/<id>/releases/<id>`. */
		name: string;
	};
	'hosting.sites.channels.releases.list': {
		/** Required. The site or channel for which to list releases, in either of the following formats: - sites/SITE_ID - sites/SITE_ID/channels/CHANNEL_ID Format: `sites/<id>/channels/<id>`. */
		parent: string;
		/** A token from a previous call to `releases.list` or `channels.releases.list` that tells the server where to resume listing. */
		pageToken?: string;
		/** The maximum number of releases to return. The service may return a lower number if fewer releases exist than this maximum number. If unspecified, defaults to 100. */
		pageSize?: number;
	};
	'hosting.sites.create': {
		/** Optional. If set, validates that the site_id is available and that the request would succeed, returning the expected resulting site or error. */
		validateOnly?: boolean;
		/** Required. Immutable. A globally unique identifier for the Hosting site. This identifier is used to construct the Firebase-provisioned subdomains for the site, so it must also be a valid domain name label. */
		siteId?: string;
		/** Required. The Firebase project in which to create a Hosting site, in the format: projects/PROJECT_IDENTIFIER Refer to the `Site` `name` field for details about PROJECT_IDENTIFIER values. Format: `projects/<id>`. */
		parent: string;
		/** Optional. User-specified labels for the Hosting site. */
		labels?: Record<string, string>;
		/** Optional. The [ID of a Web App](https://firebase.google.com/docs/reference/firebase-management/rest/v1beta1/projects.webApps#WebApp.FIELDS.app_id) associated with the Hosting site. */
		appId?: string;
	};
	'hosting.sites.customDomains.create': {
		/** Required. The ID of the `CustomDomain`, which is the domain name you'd like to use with Firebase Hosting. */
		customDomainId?: string;
		/** If true, Hosting validates that it's possible to complete your request but doesn't actually create a new `CustomDomain`. */
		validateOnly?: boolean;
		/** Required. The custom domain's parent, specifically a Firebase Hosting `Site`. Format: `projects/<id>/sites/<id>`. */
		parent: string;
		/** Identifier. The fully-qualified name of the `CustomDomain`. */
		name?: string;
		/** Labels used for extra metadata and/or filtering. */
		labels?: Record<string, string>;
		/** A field that lets you specify which SSL certificate type Hosting creates for your domain name. Spark plan custom domains only have access to the `GROUPED` cert type, while Blaze plan domains can select any option. */
		certPreference?:
			| 'TYPE_UNSPECIFIED'
			| 'TEMPORARY'
			| 'GROUPED'
			| 'PROJECT_GROUPED'
			| 'DEDICATED';
		/** A domain name that this `CustomDomain` should direct traffic towards. If specified, Hosting will respond to requests against this custom domain with an HTTP 301 code, and route traffic to the specified `redirect_target` instead. */
		redirectTarget?: string;
		/** Annotations you can add to leave both human- and machine-readable metadata about your `CustomDomain`. */
		annotations?: Record<string, string>;
	};
	'hosting.sites.customDomains.delete': {
		/** If true, the request succeeds even if the `CustomDomain` doesn't exist. */
		allowMissing?: boolean;
		/** Required. The name of the `CustomDomain` to delete. Format: `projects/<id>/sites/<id>/customDomains/<id>`. */
		name: string;
		/** If true, Hosting validates that it's possible to complete your request but doesn't actually delete the `CustomDomain`. */
		validateOnly?: boolean;
		/** A tag that represents the state of the `CustomDomain` as you know it. If present, the supplied tag must match the current value on your `CustomDomain`, or the request fails. */
		etag?: string;
	};
	'hosting.sites.customDomains.get': {
		/** Required. The name of the `CustomDomain` to get. Format: `projects/<id>/sites/<id>/customDomains/<id>`. */
		name: string;
	};
	'hosting.sites.customDomains.list': {
		/** A token from a previous call to `ListCustomDomains` that tells the server where to resume listing. */
		pageToken?: string;
		/** Required. The Firebase Hosting `Site` with `CustomDomain` entities you'd like to list. Format: `projects/<id>/sites/<id>`. */
		parent: string;
		/** The max number of `CustomDomain` entities to return in a request. Defaults to 10. */
		pageSize?: number;
		/** If true, the request returns soft-deleted `CustomDomain`s that haven't been fully-deleted yet. To restore deleted `CustomDomain`s, make an `UndeleteCustomDomain` request. */
		showDeleted?: boolean;
	};
	'hosting.sites.customDomains.operations.get': {
		/** The name of the operation resource. Format: `projects/<id>/sites/<id>/customDomains/<id>/operations/<id>`. */
		name: string;
	};
	'hosting.sites.customDomains.operations.list': {
		/** The standard list filter. */
		filter?: string;
		/** The standard list page size. */
		pageSize?: number;
		/** The name of the operation's parent resource. Format: `projects/<id>/sites/<id>/customDomains/<id>`. */
		name: string;
		/** The standard list page token. */
		pageToken?: string;
		/** When set to `true`, operations that are reachable are returned as normal, and those that are unreachable are returned in the ListOperationsResponse.unreachable field. This can only be `true` when reading across collections. For example, when `parent` is set to `"projects/example/locations/-"`. */
		returnPartialSuccess?: boolean;
	};
	'hosting.sites.customDomains.patch': {
		/** If true, Hosting validates that it's possible to complete your request but doesn't actually create or update the `CustomDomain`. */
		validateOnly?: boolean;
		/** Identifier. The fully-qualified name of the `CustomDomain`. Format: `projects/<id>/sites/<id>/customDomains/<id>`. */
		name: string;
		/** The set of field names from your `CustomDomain` that you want to update. A field will be overwritten if, and only if, it's in the mask. If you don't provide a mask, Hosting updates the entire `CustomDomain`. */
		updateMask?: string;
		/** If true, Hosting creates the `CustomDomain` if it doesn't already exist. */
		allowMissing?: boolean;
		/** Identifier. The fully-qualified name of the `CustomDomain`. */
		body_name?: string;
		/** Labels used for extra metadata and/or filtering. */
		labels?: Record<string, string>;
		/** A field that lets you specify which SSL certificate type Hosting creates for your domain name. Spark plan custom domains only have access to the `GROUPED` cert type, while Blaze plan domains can select any option. */
		certPreference?:
			| 'TYPE_UNSPECIFIED'
			| 'TEMPORARY'
			| 'GROUPED'
			| 'PROJECT_GROUPED'
			| 'DEDICATED';
		/** A domain name that this `CustomDomain` should direct traffic towards. If specified, Hosting will respond to requests against this custom domain with an HTTP 301 code, and route traffic to the specified `redirect_target` instead. */
		redirectTarget?: string;
		/** Annotations you can add to leave both human- and machine-readable metadata about your `CustomDomain`. */
		annotations?: Record<string, string>;
	};
	'hosting.sites.customDomains.undelete': {
		/** Required. The name of the `CustomDomain` to delete. Format: `projects/<id>/sites/<id>/customDomains/<id>`. */
		name: string;
		/** If true, Hosting validates that it's possible to complete your request but doesn't actually delete the `CustomDomain`. */
		validateOnly?: boolean;
		/** A tag that represents the state of the `CustomDomain` as you know it. If present, the supplied tag must match the current value on your `CustomDomain`, or the request fails. */
		etag?: string;
	};
	'hosting.sites.delete': {
		/** Required. The fully-qualified resource name for the Hosting site, in the format: projects/PROJECT_IDENTIFIER/sites/SITE_ID Refer to the `Site` `name` field for details about PROJECT_IDENTIFIER values. Format: `projects/<id>/sites/<id>`. */
		name: string;
	};
	'hosting.sites.domains.create': {
		/** Required. The parent to create the domain association for, in the format: sites/site-name Format: `sites/<id>`. */
		parent: string;
		/** Output only. Information about the provisioning of certificates and the health of the DNS resolution for the domain. */
		provisioning?: FirebaseDomainProvisioningInput;
		/** Output only. The time at which the domain was last updated. */
		updateTime?: string;
		/** Output only. Additional status of the domain association. */
		status?:
			| 'DOMAIN_STATUS_UNSPECIFIED'
			| 'DOMAIN_CHANGE_PENDING'
			| 'DOMAIN_ACTIVE'
			| 'DOMAIN_VERIFICATION_REQUIRED'
			| 'DOMAIN_VERIFICATION_LOST';
		/** Required. The domain name of the association. */
		domainName?: string;
		/** If set, the domain should redirect with the provided parameters. */
		domainRedirect?: FirebaseDomainRedirectInput;
		/** Required. The site name of the association. */
		site?: string;
	};
	'hosting.sites.domains.delete': {
		/** Required. The name of the domain association to delete. Format: `sites/<id>/domains/<id>`. */
		name: string;
	};
	'hosting.sites.domains.get': {
		/** Required. The name of the domain configuration to get. Format: `sites/<id>/domains/<id>`. */
		name: string;
	};
	'hosting.sites.domains.list': {
		/** Required. The parent for which to list domains, in the format: sites/ site-name Format: `sites/<id>`. */
		parent: string;
		/** The page size to return. Defaults to 50. */
		pageSize?: number;
		/** The next_page_token from a previous request, if provided. */
		pageToken?: string;
	};
	'hosting.sites.domains.update': {
		/** Required. The name of the domain association to update or create, if an association doesn't already exist. Format: `sites/<id>/domains/<id>`. */
		name: string;
		/** Output only. Information about the provisioning of certificates and the health of the DNS resolution for the domain. */
		provisioning?: FirebaseDomainProvisioningInput;
		/** Output only. The time at which the domain was last updated. */
		updateTime?: string;
		/** Output only. Additional status of the domain association. */
		status?:
			| 'DOMAIN_STATUS_UNSPECIFIED'
			| 'DOMAIN_CHANGE_PENDING'
			| 'DOMAIN_ACTIVE'
			| 'DOMAIN_VERIFICATION_REQUIRED'
			| 'DOMAIN_VERIFICATION_LOST';
		/** Required. The domain name of the association. */
		domainName?: string;
		/** If set, the domain should redirect with the provided parameters. */
		domainRedirect?: FirebaseDomainRedirectInput;
		/** Required. The site name of the association. */
		site?: string;
	};
	'hosting.sites.get': {
		/** Required. The fully-qualified resource name for the Hosting site, in the format: projects/PROJECT_IDENTIFIER/sites/SITE_ID Refer to the `Site` `name` field for details about PROJECT_IDENTIFIER values. */
		name: string;
	};
	'hosting.sites.getConfig': {
		/** Required. The site for which to get the SiteConfig, in the format: sites/ site-name/config Format: `sites/<id>/config`. */
		name: string;
	};
	'hosting.sites.list': {
		/** Optional. The maximum number of sites to return. The service may return a lower number if fewer sites exist than this maximum number. If unspecified, defaults to 40. */
		pageSize?: number;
		/** Required. The Firebase project for which to list sites, in the format: projects/PROJECT_IDENTIFIER Refer to the `Site` `name` field for details about PROJECT_IDENTIFIER values. Format: `projects/<id>`. */
		parent: string;
		/** Optional. A token from a previous call to `ListSites` that tells the server where to resume listing. */
		pageToken?: string;
	};
	'hosting.sites.patch': {
		/** Output only. The fully-qualified resource name of the Hosting site, in the format: projects/PROJECT_IDENTIFIER/sites/SITE_ID PROJECT_IDENTIFIER: the Firebase project's… */
		name: string;
		/** A set of field names from your Site that you want to update. */
		updateMask?: string;
		/** Optional. User-specified labels for the Hosting site. */
		labels?: Record<string, string>;
		/** Optional. The [ID of a Web App](https://firebase.google.com/docs/reference/firebase-management/rest/v1beta1/projects.webApps#WebApp.FIELDS.app_id) associated with the Hosting site. */
		appId?: string;
	};
	'hosting.sites.releases.create': {
		/** Required. The site or channel to which the release belongs, in either of the following formats: - sites/SITE_ID - sites/SITE_ID/channels/CHANNEL_ID Format: `sites/<id>`. */
		parent: string;
		/** The unique identifier for a version, in the format: sites/SITE_ID/versions/ VERSION_ID The SITE_ID in this version identifier must match the SITE_ID in the `parent` parameter. This query parameter must be empty if the `type` field in the request body is `SITE_DISABLE`. */
		versionName?: string;
		/** Output only. The unique identifier for the release, in either of the following formats: - sites/SITE_ID/releases/RELEASE_ID - sites/SITE_ID/channels/CHANNEL_ID/releases/RELEASE_ID This name is provided in the response body when you call `releases.create` or `channels.releases.create`. */
		name?: string;
		/** Output only. The configuration and content that was released. */
		version?: FirebaseHostingVersionInput;
		/** The deploy description when the release was created. The value can be up to 512 characters. */
		message?: string;
		/** Output only. The time at which the version is set to be public. */
		releaseTime?: string;
		/** Output only. Identifies the user who created the release. */
		releaseUser?: FirebaseActingUserInput;
		/** Explains the reason for the release. Specify a value for this field only when creating a `SITE_DISABLE` type release. */
		type?: 'TYPE_UNSPECIFIED' | 'DEPLOY' | 'ROLLBACK' | 'SITE_DISABLE';
	};
	'hosting.sites.releases.get': {
		/** Required. The fully-qualified resource name for the Hosting release, in either of the following formats: - sites/SITE_ID/channels/CHANNEL_ID/releases/RELEASE_ID - sites/SITE_ID/releases/RELEASE_ID Format: `sites/<id>/releases/<id>`. */
		name: string;
	};
	'hosting.sites.releases.list': {
		/** The maximum number of releases to return. The service may return a lower number if fewer releases exist than this maximum number. If unspecified, defaults to 100. */
		pageSize?: number;
		/** Required. The site or channel for which to list releases, in either of the following formats: - sites/SITE_ID - sites/SITE_ID/channels/CHANNEL_ID Format: `sites/<id>`. */
		parent: string;
		/** A token from a previous call to `releases.list` or `channels.releases.list` that tells the server where to resume listing. */
		pageToken?: string;
	};
	'hosting.sites.updateConfig': {
		/** Required. The site for which to update the SiteConfig, in the format: sites/ site-name/config Format: `sites/<id>/config`. */
		name: string;
		/** A set of field names from your site configuration that you want to update. A field will be overwritten if, and only if, it's in the mask. If a mask is not provided then a default mask of only `max_versions` will be used. */
		updateMask?: string;
		/** Whether or not web requests made by site visitors are logged via Cloud Logging. */
		cloudLoggingEnabled?: boolean;
		/** The number of FINALIZED versions that will be held for a site before automatic deletion. When a new version is deployed, content for versions in storage in excess of this number will be deleted, and will no longer be billed for storage usage. */
		maxVersions?: string | number;
	};
	'hosting.sites.versions.clone': {
		/** Required. The target site for the cloned version, in the format: sites/ SITE_ID Format: `sites/<id>`. */
		parent: string;
		/** Required. The unique identifier for the version to be cloned, in the format: sites/SITE_ID/versions/VERSION_ID */
		sourceVersion?: string;
		/** If provided, only paths that match one or more RegEx values in this list will be included in the new version. */
		include?: FirebasePathFilterInput;
		/** If true, the call to `CloneVersion` immediately finalizes the version after cloning is complete. If false, the cloned version will have a status of `CREATED`. Use `UpdateVersion` to set the status of the version to `FINALIZED`. */
		finalize?: boolean;
		/** If provided, only paths that do not match any of the RegEx values in this list will be included in the new version. */
		exclude?: FirebasePathFilterInput;
	};
	'hosting.sites.versions.create': {
		/** A unique id for the new version. This is was only specified for legacy version creations, and should be blank. */
		versionId?: string;
		/** The self-reported size of the version. This value is used for a pre-emptive quota check for legacy version uploads. */
		sizeBytes?: string | number;
		/** Required. The site in which to create the version, in the format: sites/ SITE_ID Format: `sites/<id>`. */
		parent: string;
		/** Output only. Identifies the user who created the version. */
		createUser?: FirebaseActingUserInput;
		/** The deploy status of the version. For a successful deploy, call `CreateVersion` to make a new version (`CREATED` status), upload all desired files to the version, then update the version to the `FINALIZED` status. */
		status?:
			| 'VERSION_STATUS_UNSPECIFIED'
			| 'CREATED'
			| 'FINALIZED'
			| 'DELETED'
			| 'ABANDONED'
			| 'EXPIRED'
			| 'CLONING';
		/** The labels used for extra metadata and/or filtering. */
		labels?: Record<string, string>;
		/** Output only. The time at which the version was `DELETED`. */
		deleteTime?: string;
		/** Output only. The time at which the version was created. */
		createTime?: string;
		/** The fully-qualified resource name for the version, in the format: sites/ SITE_ID/versions/VERSION_ID This name is provided in the response body when you call `CreateVersion`. */
		name?: string;
		/** Output only. The total number of files associated with the version. This value is calculated after a version is `FINALIZED`. */
		fileCount?: string | number;
		/** Output only. Identifies the user who `DELETED` the version. */
		deleteUser?: FirebaseActingUserInput;
		/** Output only. Identifies the user who `FINALIZED` the version. */
		finalizeUser?: FirebaseActingUserInput;
		/** Output only. The time at which the version was `FINALIZED`. */
		finalizeTime?: string;
		/** Output only. The total stored bytesize of the version. This value is calculated after a version is `FINALIZED`. */
		versionBytes?: string | number;
		/** The configuration for the behavior of the site. This configuration exists in the [`firebase.json`](https://firebase.google.com/docs/cli/#the_firebasejson_file) file. */
		config?: FirebaseServingConfigInput;
	};
	'hosting.sites.versions.delete': {
		/** Required. The fully-qualified resource name for the version, in the format: sites/SITE_ID/versions/VERSION_ID Format: `sites/<id>/versions/<id>`. */
		name: string;
	};
	'hosting.sites.versions.files.list': {
		/** The maximum number of version files to return. The service may return a lower number if fewer version files exist than this maximum number. If unspecified, defaults to 1000. */
		pageSize?: number;
		/** The type of files that should be listed for the specified version. */
		status?: 'STATUS_UNSPECIFIED' | 'EXPECTED' | 'ACTIVE';
		/** A token from a previous call to `ListVersionFiles` that tells the server where to resume listing. */
		pageToken?: string;
		/** Required. The version for which to list files, in the format: sites/SITE_ID /versions/VERSION_ID Format: `sites/<id>/versions/<id>`. */
		parent: string;
	};
	'hosting.sites.versions.get': {
		/** Required. The fully-qualified resource name for the version, in the format: sites/SITE_ID/versions/VERSION_ID Format: `sites/<id>/versions/<id>`. */
		name: string;
	};
	'hosting.sites.versions.list': {
		/** The maximum number of versions to return. The service may return a lower number if fewer versions exist than this maximum number. If unspecified, defaults to 25. The maximum value is 100; values above 100 will be coerced to 100. */
		pageSize?: number;
		/** Required. The site or channel for which to list versions, in either of the following formats: - sites/SITE_ID - sites/SITE_ID/channels/CHANNEL_ID Format: `sites/<id>`. */
		parent: string;
		/** A filter string used to return a subset of versions in the response. The currently supported fields for filtering are: `name`, `status`, and `create_time`. Learn more about filtering in Google's [AIP 160 standard](https://google.aip.dev/160). */
		filter?: string;
		/** A token from a previous call to `ListVersions` that tells the server where to resume listing. */
		pageToken?: string;
	};
	'hosting.sites.versions.patch': {
		/** A set of field names from your version that you want to update. A field will be overwritten if, and only if, it's in the mask. If a mask is not provided then a default mask of only `status` will be used. */
		updateMask?: string;
		/** The fully-qualified resource name for the version, in the format: sites/ SITE_ID/versions/VERSION_ID This name is provided in the response body when you call `CreateVersion`. Format: `sites/<id>/versions/<id>`. */
		name: string;
		/** Output only. Identifies the user who created the version. */
		createUser?: FirebaseActingUserInput;
		/** The deploy status of the version. For a successful deploy, call `CreateVersion` to make a new version (`CREATED` status), upload all desired files to the version, then update the version to the `FINALIZED` status. */
		status?:
			| 'VERSION_STATUS_UNSPECIFIED'
			| 'CREATED'
			| 'FINALIZED'
			| 'DELETED'
			| 'ABANDONED'
			| 'EXPIRED'
			| 'CLONING';
		/** The labels used for extra metadata and/or filtering. */
		labels?: Record<string, string>;
		/** Output only. The time at which the version was `DELETED`. */
		deleteTime?: string;
		/** Output only. The time at which the version was created. */
		createTime?: string;
		/** The fully-qualified resource name for the version, in the format: sites/ SITE_ID/versions/VERSION_ID This name is provided in the response body when you call `CreateVersion`. */
		body_name?: string;
		/** Output only. The total number of files associated with the version. This value is calculated after a version is `FINALIZED`. */
		fileCount?: string | number;
		/** Output only. Identifies the user who `DELETED` the version. */
		deleteUser?: FirebaseActingUserInput;
		/** Output only. Identifies the user who `FINALIZED` the version. */
		finalizeUser?: FirebaseActingUserInput;
		/** Output only. The time at which the version was `FINALIZED`. */
		finalizeTime?: string;
		/** Output only. The total stored bytesize of the version. This value is calculated after a version is `FINALIZED`. */
		versionBytes?: string | number;
		/** The configuration for the behavior of the site. This configuration exists in the [`firebase.json`](https://firebase.google.com/docs/cli/#the_firebasejson_file) file. */
		config?: FirebaseServingConfigInput;
	};
	'hosting.sites.versions.populateFiles': {
		/** Required. The version to which to add files, in the format: sites/SITE_ID /versions/VERSION_ID Format: `sites/<id>/versions/<id>`. */
		parent: string;
		/** A set of file paths to the hashes corresponding to assets that should be added to the version. A file path to an empty hash will remove the path from the version. Calculate a hash by Gzipping the file then taking the SHA256 hash of the newly compressed file. */
		files?: Record<string, string>;
	};
	'management.androidApps.create': {
		/** The resource name of the parent FirebaseProject in which to create an AndroidApp, in the format: projects/PROJECT_IDENTIFIER/androidApps Refer to the `FirebaseProject` `name` field for details about PROJECT_IDENTIFIER values. Format: `projects/<id>`. */
		parent: string;
		/** The globally unique, Google-assigned identifier (UID) for the Firebase API key associated with the `AndroidApp`. */
		apiKeyId?: string;
		/** The user-assigned display name for the `AndroidApp`. */
		displayName?: string;
		/** This checksum is computed by the server based on the value of other fields, and it may be sent with update requests to ensure the client has an up-to-date value before proceeding. Learn more about `etag` in Google's [AIP-154 standard](https://google.aip.dev/154#declarative-friendly-resources). */
		etag?: string;
		/** The SHA1 certificate hashes for the AndroidApp. */
		sha1Hashes?: Array<string>;
		/** The resource name of the AndroidApp, in the format: projects/ PROJECT_IDENTIFIER/androidApps/APP_ID * PROJECT_IDENTIFIER: the parent Project's `ProjectNumber` ***(recommended)*** or its `ProjectId`. */
		name?: string;
		/** Immutable. The canonical package name of the Android app as would appear in the Google Play Developer Console. */
		packageName?: string;
		/** The SHA256 certificate hashes for the AndroidApp. */
		sha256Hashes?: Array<string>;
	};
	'management.androidApps.get': {
		/** The resource name of the AndroidApp, in the format: projects/ PROJECT_IDENTIFIER/androidApps/APP_ID Since an APP_ID is a unique identifier, the Unique Resource from Sub-Collection access pattern may be used here, in the format: projects/-/androidApps/APP_ID Refer to the `AndroidApp` `name` field… */
		name: string;
	};
	'management.androidApps.getConfig': {
		/** The resource name of the AndroidApp configuration to download, in the format: projects/PROJECT_IDENTIFIER/androidApps/APP_ID/config Since an APP_ID is a unique identifier, the Unique Resource from Sub-Collection access pattern may be used here, in the format: projects/-/androidApps/APP_ID Refer to… */
		name: string;
	};
	'management.androidApps.list': {
		/** Controls whether Apps in the DELETED state should be returned in the response. If not specified, only `ACTIVE` Apps will be returned. */
		showDeleted?: boolean;
		/** The maximum number of Apps to return in the response. The server may return fewer than this at its discretion. If no value is specified (or too large a value is specified), then the server will impose its own limit. */
		pageSize?: number;
		/** Token returned from a previous call to `ListAndroidApps` indicating where in the set of Apps to resume listing. */
		pageToken?: string;
		/** The resource name of the parent FirebaseProject for which to list each associated AndroidApp, in the format: projects/PROJECT_IDENTIFIER /androidApps Refer to the `FirebaseProject` `name` field for details about PROJECT_IDENTIFIER values. Format: `projects/<id>`. */
		parent: string;
	};
	'management.androidApps.patch': {
		/** Specifies which fields of the AndroidApp to update. Note that the following fields are immutable: `name`, `app_id`, `project_id`, and `package_name`. To update `state`, use any of the following endpoints: RemoveAndroidApp or UndeleteAndroidApp. */
		updateMask?: string;
		/** The resource name of the AndroidApp, in the format: projects/ PROJECT_IDENTIFIER/androidApps/APP_ID * PROJECT_IDENTIFIER: the parent Project's `ProjectNumber` ***(recommended)*** or its `ProjectId`. */
		name: string;
		/** The globally unique, Google-assigned identifier (UID) for the Firebase API key associated with the `AndroidApp`. */
		apiKeyId?: string;
		/** The user-assigned display name for the `AndroidApp`. */
		displayName?: string;
		/** This checksum is computed by the server based on the value of other fields, and it may be sent with update requests to ensure the client has an up-to-date value before proceeding. Learn more about `etag` in Google's [AIP-154 standard](https://google.aip.dev/154#declarative-friendly-resources). */
		etag?: string;
		/** The SHA1 certificate hashes for the AndroidApp. */
		sha1Hashes?: Array<string>;
		/** The resource name of the AndroidApp, in the format: projects/ PROJECT_IDENTIFIER/androidApps/APP_ID * PROJECT_IDENTIFIER: the parent Project's `ProjectNumber` ***(recommended)*** or its `ProjectId`. */
		body_name?: string;
		/** Immutable. The canonical package name of the Android app as would appear in the Google Play Developer Console. */
		packageName?: string;
		/** The SHA256 certificate hashes for the AndroidApp. */
		sha256Hashes?: Array<string>;
	};
	'management.androidApps.remove': {
		/** Required. The resource name of the AndroidApp, in the format: projects/ PROJECT_IDENTIFIER/androidApps/APP_ID Since an APP_ID is a unique identifier, the Unique Resource from Sub-Collection access pattern may be used here, in the format: projects/-/androidApps/APP_ID Refer to the AndroidApp name… */
		name: string;
		/** If set to true, the request is only validated. The App will _not_ be removed. */
		validateOnly?: boolean;
		/** If set to true, and the App is not found, the request will succeed but no action will be taken on the server. */
		allowMissing?: boolean;
		/** Determines whether to _immediately_ delete the AndroidApp. If set to true, the App is immediately deleted from the Project and cannot be undeleted (that is, restored to the Project). If not set, defaults to false, which means the App will be set to expire in 30 days. */
		immediate?: boolean;
		/** Checksum provided in the AndroidApp resource. If provided, this checksum ensures that the client has an up-to-date value before proceeding. */
		etag?: string;
	};
	'management.androidApps.sha.create': {
		/** The resource name of the parent AndroidApp to which to add a ShaCertificate, in the format: projects/PROJECT_IDENTIFIER/androidApps/ APP_ID Since an APP_ID is a unique identifier, the Unique Resource from Sub-Collection access pattern may be used here, in the format: projects/-/androidApps/APP_ID… */
		parent: string;
		/** The certificate hash for the `AndroidApp`. */
		shaHash?: string;
		/** The type of SHA certificate encoded in the hash. */
		certType?: 'SHA_CERTIFICATE_TYPE_UNSPECIFIED' | 'SHA_1' | 'SHA_256';
		/** The resource name of the ShaCertificate for the AndroidApp, in the format: projects/PROJECT_IDENTIFIER/androidApps/APP_ID/sha/SHA_HASH * PROJECT_IDENTIFIER: the parent Project's `ProjectNumber` ***(recommended)*** or its `ProjectId`. */
		name?: string;
	};
	'management.androidApps.sha.delete': {
		/** The resource name of the ShaCertificate to remove from the parent AndroidApp, in the format: projects/PROJECT_IDENTIFIER/androidApps/APP_ID /sha/SHA_HASH Refer to the `ShaCertificate` `name` field for details about PROJECT_IDENTIFIER, APP_ID, and SHA_HASH values. */
		name: string;
	};
	'management.androidApps.sha.list': {
		/** The resource name of the parent AndroidApp for which to list each associated ShaCertificate, in the format: projects/PROJECT_IDENTIFIER /androidApps/APP_ID Since an APP_ID is a unique identifier, the Unique Resource from Sub-Collection access pattern may be used here, in the format… */
		parent: string;
	};
	'management.androidApps.undelete': {
		/** Required. The resource name of the AndroidApp, in the format: projects/ PROJECT_IDENTIFIER/androidApps/APP_ID Since an APP_ID is a unique identifier, the Unique Resource from Sub-Collection access pattern may be used here, in the format: projects/-/androidApps/APP_ID Refer to the AndroidApp name… */
		name: string;
		/** Checksum provided in the AndroidApp resource. If provided, this checksum ensures that the client has an up-to-date value before proceeding. */
		etag?: string;
		/** If set to true, the request is only validated. The App will _not_ be undeleted. */
		validateOnly?: boolean;
	};
	'management.availableProjects.list': {
		/** Token returned from a previous call to `ListAvailableProjects` indicating where in the set of Projects to resume listing. */
		pageToken?: string;
		/** The maximum number of Projects to return in the response. The server may return fewer than this value at its discretion. If no value is specified (or too large a value is specified), the server will impose its own limit. This value cannot be negative. */
		pageSize?: number;
	};
	'management.iosApps.create': {
		/** The resource name of the parent FirebaseProject in which to create an IosApp, in the format: projects/PROJECT_IDENTIFIER/iosApps Refer to the `FirebaseProject` `name` field for details about PROJECT_IDENTIFIER values. Format: `projects/<id>`. */
		parent: string;
		/** This checksum is computed by the server based on the value of other fields, and it may be sent with update requests to ensure the client has an up-to-date value before proceeding. Learn more about `etag` in Google's [AIP-154 standard](https://google.aip.dev/154#declarative-friendly-resources). */
		etag?: string;
		/** Immutable. The canonical bundle ID of the iOS app as it would appear in the iOS AppStore. */
		bundleId?: string;
		/** The automatically generated Apple ID assigned to the iOS app by Apple in the iOS App Store. */
		appStoreId?: string;
		/** The Apple Developer Team ID associated with the App in the App Store. */
		teamId?: string;
		/** The user-assigned display name for the `IosApp`. */
		displayName?: string;
		/** The globally unique, Google-assigned identifier (UID) for the Firebase API key associated with the `IosApp`. */
		apiKeyId?: string;
		/** The resource name of the IosApp, in the format: projects/PROJECT_IDENTIFIER /iosApps/APP_ID * PROJECT_IDENTIFIER: the parent Project's `ProjectNumber` ***(recommended)*** or its `ProjectId`. */
		name?: string;
	};
	'management.iosApps.get': {
		/** The resource name of the IosApp, in the format: projects/PROJECT_IDENTIFIER /iosApps/APP_ID Since an APP_ID is a unique identifier, the Unique Resource from Sub-Collection access pattern may be used here, in the format: projects/-/iosApps/APP_ID Refer to the `IosApp` `name` field for details about… */
		name: string;
	};
	'management.iosApps.getConfig': {
		/** The resource name of the App configuration to download, in the format: projects/PROJECT_IDENTIFIER/iosApps/APP_ID/config Since an APP_ID is a unique identifier, the Unique Resource from Sub-Collection access pattern may be used here, in the format: projects/-/iosApps/APP_ID Refer to the `IosApp`… */
		name: string;
	};
	'management.iosApps.list': {
		/** The maximum number of Apps to return in the response. The server may return fewer than this at its discretion. If no value is specified (or too large a value is specified), the server will impose its own limit. */
		pageSize?: number;
		/** Controls whether Apps in the DELETED state should be returned in the response. If not specified, only `ACTIVE` Apps will be returned. */
		showDeleted?: boolean;
		/** Token returned from a previous call to `ListIosApps` indicating where in the set of Apps to resume listing. */
		pageToken?: string;
		/** The resource name of the parent FirebaseProject for which to list each associated IosApp, in the format: projects/PROJECT_IDENTIFIER/iosApps Refer to the `FirebaseProject` `name` field for details about PROJECT_IDENTIFIER values. Format: `projects/<id>`. */
		parent: string;
	};
	'management.iosApps.patch': {
		/** The resource name of the IosApp, in the format: projects/PROJECT_IDENTIFIER /iosApps/APP_ID * PROJECT_IDENTIFIER: the parent Project's `ProjectNumber` ***(recommended)*** or its `ProjectId`. */
		name: string;
		/** Specifies which fields of the IosApp to update. Note that the following fields are immutable: `name`, `app_id`, `project_id`, and `bundle_id`. To update `state`, use any of the following endpoints: RemoveIosApp or UndeleteIosApp. */
		updateMask?: string;
		/** This checksum is computed by the server based on the value of other fields, and it may be sent with update requests to ensure the client has an up-to-date value before proceeding. Learn more about `etag` in Google's [AIP-154 standard](https://google.aip.dev/154#declarative-friendly-resources). */
		etag?: string;
		/** Immutable. The canonical bundle ID of the iOS app as it would appear in the iOS AppStore. */
		bundleId?: string;
		/** The automatically generated Apple ID assigned to the iOS app by Apple in the iOS App Store. */
		appStoreId?: string;
		/** The Apple Developer Team ID associated with the App in the App Store. */
		teamId?: string;
		/** The user-assigned display name for the `IosApp`. */
		displayName?: string;
		/** The globally unique, Google-assigned identifier (UID) for the Firebase API key associated with the `IosApp`. */
		apiKeyId?: string;
		/** The resource name of the IosApp, in the format: projects/PROJECT_IDENTIFIER /iosApps/APP_ID * PROJECT_IDENTIFIER: the parent Project's `ProjectNumber` ***(recommended)*** or its `ProjectId`. */
		body_name?: string;
	};
	'management.iosApps.remove': {
		/** Required. The resource name of the IosApp, in the format: projects/ PROJECT_IDENTIFIER/iosApps/APP_ID Since an APP_ID is a unique identifier, the Unique Resource from Sub-Collection access pattern may be used here, in the format: projects/-/iosApps/APP_ID Refer to the IosApp name field for details… */
		name: string;
		/** If set to true, the request is only validated. The App will _not_ be removed. */
		validateOnly?: boolean;
		/** Checksum provided in the IosApp resource. If provided, this checksum ensures that the client has an up-to-date value before proceeding. */
		etag?: string;
		/** If set to true, and the App is not found, the request will succeed but no action will be taken on the server. */
		allowMissing?: boolean;
		/** Determines whether to _immediately_ delete the IosApp. If set to true, the App is immediately deleted from the Project and cannot be undeleted (that is, restored to the Project). If not set, defaults to false, which means the App will be set to expire in 30 days. */
		immediate?: boolean;
	};
	'management.iosApps.undelete': {
		/** Required. The resource name of the IosApp, in the format: projects/ PROJECT_IDENTIFIER/iosApps/APP_ID Since an APP_ID is a unique identifier, the Unique Resource from Sub-Collection access pattern may be used here, in the format: projects/-/iosApps/APP_ID Refer to the IosApp name field for details… */
		name: string;
		/** Checksum provided in the IosApp resource. If provided, this checksum ensures that the client has an up-to-date value before proceeding. */
		etag?: string;
		/** If set to true, the request is only validated. The App will _not_ be undeleted. */
		validateOnly?: boolean;
	};
	'management.operations.get': {
		/** The name of the operation resource. Format: `operations/<path>`. */
		name: string;
	};
	'management.projects.addFirebase': {
		/** The resource name of the Google Cloud `Project` in which Firebase resources will be added and Firebase services enabled, in the format: projects/ PROJECT_IDENTIFIER Refer to the `FirebaseProject` `name` field for details about PROJECT_IDENTIFIER values. Format: `projects/<id>`. */
		project: string;
		/** **DEPRECATED.** _Instead, use product-specific REST APIs to work with the location of each resource in a Project. */
		locationId?: string;
	};
	'management.projects.addGoogleAnalytics': {
		/** The resource name of the FirebaseProject to link to an existing Google Analytics account, in the format: projects/PROJECT_IDENTIFIER Refer to the `FirebaseProject` `name` field for details about PROJECT_IDENTIFIER values. Format: `projects/<id>`. */
		parent: string;
		/** The ID for the existing [Google Analytics account](http://www.google.com/analytics/) that you want to link with the `FirebaseProject`. Specifying this field will provision a new Google Analytics property in your Google Analytics account and associate the new property with the `FirebaseProject`. */
		analyticsAccountId?: string;
		/** The ID for the existing Google Analytics property that you want to associate with the `FirebaseProject`. */
		analyticsPropertyId?: string;
	};
	'management.projects.get': {
		/** The resource name of the FirebaseProject, in the format: projects/ PROJECT_IDENTIFIER Refer to the `FirebaseProject` `name` field for details about PROJECT_IDENTIFIER values. Format: `projects/<id>`. */
		name: string;
	};
	'management.projects.getAdminSdkConfig': {
		/** The resource name of the FirebaseProject, in the format: projects/ PROJECT_IDENTIFIER/adminSdkConfig Refer to the `FirebaseProject` `name` field for details about PROJECT_IDENTIFIER values. Format: `projects/<id>/adminSdkConfig`. */
		name: string;
	};
	'management.projects.getAnalyticsDetails': {
		/** The resource name of the FirebaseProject, in the format: projects/ PROJECT_IDENTIFIER/analyticsDetails Refer to the `FirebaseProject` `name` field for details about PROJECT_IDENTIFIER values. Format: `projects/<id>/analyticsDetails`. */
		name: string;
	};
	'management.projects.list': {
		/** The maximum number of Projects to return in the response. The server may return fewer than this at its discretion. If no value is specified (or too large a value is specified), the server will impose its own limit. This value cannot be negative. */
		pageSize?: number;
		/** Token returned from a previous call to `ListFirebaseProjects` indicating where in the set of Projects to resume listing. */
		pageToken?: string;
		/** Optional. Controls whether Projects in the DELETED state should be returned in the response. If not specified, only `ACTIVE` Projects will be returned. */
		showDeleted?: boolean;
	};
	'management.projects.patch': {
		/** Specifies which fields of the FirebaseProject to update. Note that the following fields are immutable: `name`, `project_id`, and `project_number`. */
		updateMask?: string;
		/** The resource name of the Project, in the format: projects/PROJECT_IDENTIFIER PROJECT_IDENTIFIER: the Project's `ProjectNumber` ***(recommended)*** or its `ProjectId`. Learn more about using project identifiers in Google's [AIP 2510 standard](https://google.aip.dev/cloud/2510). */
		name: string;
		/** The resource name of the Project, in the format: projects/PROJECT_IDENTIFIER PROJECT_IDENTIFIER: the Project's `ProjectNumber` ***(recommended)*** or its `ProjectId`. Learn more about using project identifiers in Google's [AIP 2510 standard](https://google.aip.dev/cloud/2510). */
		body_name?: string;
		/** The user-assigned display name of the Project. */
		displayName?: string;
		/** This checksum is computed by the server based on the value of other fields, and it may be sent with update requests to ensure the client has an up-to-date value before proceeding. Learn more about `etag` in Google's [AIP-154 standard](https://google.aip.dev/154#declarative-friendly-resources). */
		etag?: string;
		/** A set of user-defined annotations for the FirebaseProject. Learn more about annotations in Google's [AIP-128 standard](https://google.aip.dev/128#annotations). These annotations are intended solely for developers and client-side tools. Firebase services will not mutate this annotations set. */
		annotations?: Record<string, string>;
	};
	'management.projects.removeAnalytics': {
		/** The resource name of the FirebaseProject to unlink from its Google Analytics account, in the format: projects/PROJECT_IDENTIFIER Refer to the `FirebaseProject` `name` field for details about PROJECT_IDENTIFIER values. Format: `projects/<id>`. */
		parent: string;
		/** Optional. The ID of the Google Analytics property associated with the specified `FirebaseProject`. - If not set, then the Google Analytics property that is currently associated with the specified `FirebaseProject` is removed. */
		analyticsPropertyId?: string;
	};
	'management.projects.searchApps': {
		/** The parent FirebaseProject for which to list Apps, in the format: projects/ PROJECT_IDENTIFIER Refer to the `FirebaseProject` `name` field for details about PROJECT_IDENTIFIER values. Format: `projects/<id>`. */
		parent: string;
		/** A query string compatible with Google's [AIP-160 standard](https://google.aip.dev/160). Use any of the following fields in a query: * `app_id` * `namespace` * `platform` This query also supports the following "virtual" fields. */
		filter?: string;
		/** Token returned from a previous call to `SearchFirebaseApps` indicating where in the set of Apps to resume listing. */
		pageToken?: string;
		/** Controls whether Apps in the DELETED state should be returned. If not specified, only `ACTIVE` Apps will be returned. */
		showDeleted?: boolean;
		/** The maximum number of Apps to return in the response. The server may return fewer than this value at its discretion. If no value is specified (or too large a value is specified), then the server will impose its own limit. This value cannot be negative. */
		pageSize?: number;
	};
	'management.webApps.create': {
		/** The resource name of the parent FirebaseProject in which to create a WebApp, in the format: projects/PROJECT_IDENTIFIER/webApps Refer to the `FirebaseProject` `name` field for details about PROJECT_IDENTIFIER values. Format: `projects/<id>`. */
		parent: string;
		/** The URLs where the `WebApp` is hosted. */
		appUrls?: Array<string>;
		/** Optional. Set of labels assigned to the `WebApp`. Valid label keys have two segments: an optional prefix and a name, separated by a slash (`/`). `firebase.*\/` prefixes are reserved for Firebase-service use, and `express.cloud/` is reserved for Google Cloud Express. */
		labels?: Record<string, string>;
		/** The resource name of the WebApp, in the format: projects/PROJECT_IDENTIFIER /webApps/APP_ID * PROJECT_IDENTIFIER: the parent Project's `ProjectNumber` ***(recommended)*** or its `ProjectId`. */
		name?: string;
		/** The globally unique, Google-assigned identifier (UID) for the Firebase API key associated with the `WebApp`. */
		apiKeyId?: string;
		/** This checksum is computed by the server based on the value of other fields, and it may be sent with update requests to ensure the client has an up-to-date value before proceeding. Learn more about `etag` in Google's [AIP-154 standard](https://google.aip.dev/154#declarative-friendly-resources). */
		etag?: string;
		/** The user-assigned display name for the `WebApp`. */
		displayName?: string;
	};
	'management.webApps.get': {
		/** The resource name of the WebApp, in the format: projects/PROJECT_IDENTIFIER /webApps/APP_ID Since an APP_ID is a unique identifier, the Unique Resource from Sub-Collection access pattern may be used here, in the format: projects/-/webApps/APP_ID Refer to the `WebApp` `name` field for details about… */
		name: string;
	};
	'management.webApps.getConfig': {
		/** The resource name of the WebApp configuration to download, in the format: projects/PROJECT_IDENTIFIER/webApps/APP_ID/config Since an APP_ID is a unique identifier, the Unique Resource from Sub-Collection access pattern may be used here, in the format: projects/-/webApps/APP_ID Refer to the `WebApp`… */
		name: string;
	};
	'management.webApps.list': {
		/** Controls whether Apps in the DELETED state should be returned in the response. If not specified, only `ACTIVE` Apps will be returned. */
		showDeleted?: boolean;
		/** Token returned from a previous call to `ListWebApps` indicating where in the set of Apps to resume listing. */
		pageToken?: string;
		/** The resource name of the parent FirebaseProject for which to list each associated WebApp, in the format: projects/PROJECT_IDENTIFIER/webApps Refer to the `FirebaseProject` `name` field for details about PROJECT_IDENTIFIER values. Format: `projects/<id>`. */
		parent: string;
		/** The maximum number of Apps to return in the response. The server may return fewer than this value at its discretion. If no value is specified (or too large a value is specified), then the server will impose its own limit. */
		pageSize?: number;
	};
	'management.webApps.patch': {
		/** The resource name of the WebApp, in the format: projects/PROJECT_IDENTIFIER /webApps/APP_ID * PROJECT_IDENTIFIER: the parent Project's `ProjectNumber` ***(recommended)*** or its `ProjectId`. */
		name: string;
		/** Specifies which fields of the WebApp to update. Note that the following fields are immutable: `name`, `app_id`, and `project_id`. To update `state`, use any of the following endpoints: RemoveWebApp or UndeleteWebApp. */
		updateMask?: string;
		/** The URLs where the `WebApp` is hosted. */
		appUrls?: Array<string>;
		/** Optional. Set of labels assigned to the `WebApp`. Valid label keys have two segments: an optional prefix and a name, separated by a slash (`/`). `firebase.*\/` prefixes are reserved for Firebase-service use, and `express.cloud/` is reserved for Google Cloud Express. */
		labels?: Record<string, string>;
		/** The resource name of the WebApp, in the format: projects/PROJECT_IDENTIFIER /webApps/APP_ID * PROJECT_IDENTIFIER: the parent Project's `ProjectNumber` ***(recommended)*** or its `ProjectId`. */
		body_name?: string;
		/** The globally unique, Google-assigned identifier (UID) for the Firebase API key associated with the `WebApp`. */
		apiKeyId?: string;
		/** This checksum is computed by the server based on the value of other fields, and it may be sent with update requests to ensure the client has an up-to-date value before proceeding. Learn more about `etag` in Google's [AIP-154 standard](https://google.aip.dev/154#declarative-friendly-resources). */
		etag?: string;
		/** The user-assigned display name for the `WebApp`. */
		displayName?: string;
	};
	'management.webApps.remove': {
		/** Required. The resource name of the WebApp, in the format: projects/ PROJECT_IDENTIFIER/webApps/APP_ID Since an APP_ID is a unique identifier, the Unique Resource from Sub-Collection access pattern may be used here, in the format: projects/-/webApps/APP_ID Refer to the WebApp name field for details… */
		name: string;
		/** Determines whether to _immediately_ delete the WebApp. If set to true, the App is immediately deleted from the Project and cannot be undeleted (that is, restored to the Project). If not set, defaults to false, which means the App will be set to expire in 30 days. */
		immediate?: boolean;
		/** Checksum provided in the WebApp resource. If provided, this checksum ensures that the client has an up-to-date value before proceeding. */
		etag?: string;
		/** If set to true, and the App is not found, the request will succeed but no action will be taken on the server. */
		allowMissing?: boolean;
		/** If set to true, the request is only validated. The App will _not_ be removed. */
		validateOnly?: boolean;
	};
	'management.webApps.undelete': {
		/** Required. The resource name of the WebApp, in the format: projects/ PROJECT_IDENTIFIER/webApps/APP_ID Since an APP_ID is a unique identifier, the Unique Resource from Sub-Collection access pattern may be used here, in the format: projects/-/webApps/APP_ID Refer to the WebApp name field for details… */
		name: string;
		/** If set to true, the request is only validated. The App will _not_ be undeleted. */
		validateOnly?: boolean;
		/** Checksum provided in the WebApp resource. If provided, this checksum ensures that the client has an up-to-date value before proceeding. */
		etag?: string;
	};
	'messaging.messages.send': {
		/** Required. It contains the Firebase project id (i.e. the unique identifier for your Firebase project), in the format of `projects/{project_id}`. The numeric project number with no padding is also supported in the format of `projects/{project_number}`. Format: `projects/<id>`. */
		parent: string;
		/** Required. Message to send. */
		message?: FirebaseMessageInput;
		/** Flag for testing the request without actually delivering the message. */
		validateOnly?: boolean;
	};
	'messaging.registrations.topicSubscriptions.create': {
		/** Required. The ID to use for the subscription, which is the topic name. This will become the last segment of the TopicSubscription's resource name. Topic names match the pattern of "[a-zA-Z0-9-_.~%]{1,900}". */
		topicName?: string;
		/** Required. The parent resource where this subscription will be created. Format: projects/{project}/registrations/{registration} The {registration} part can be an FID or an FCM Token. Format: `projects/<id>/registrations/<id>`. */
		parent: string;
		/** Identifier. The resource name of the subscription. Format: projects/{project}/registrations/{registration}/topicSubscriptions/{topicSubscription} The {registration} part contains the registration ID (e.g., FID). */
		name?: string;
	};
	'messaging.registrations.topicSubscriptions.delete': {
		/** Optional. If set to true, and the topic subscription is not found, the request will succeed but no action will be taken on the server. */
		allowMissing?: boolean;
		/** Required. The name of the topic subscription to delete. Format: projects/{project}/registrations/{registration}/topicSubscriptions/{topicSubscription} Format: `projects/<id>/registrations/<id>/topicSubscriptions/<id>`. */
		name: string;
	};
	'messaging.registrations.topicSubscriptions.get': {
		/** Required. The name of the topic subscription to retrieve. Format: projects/{project}/registrations/{registration}/topicSubscriptions/{topicSubscription} Format: `projects/<id>/registrations/<id>/topicSubscriptions/<id>`. */
		name: string;
	};
	'messaging.registrations.topicSubscriptions.list': {
		/** Optional. The maximum number of subscriptions to return. The service may return fewer than this value. If unspecified, at most 1000 subscriptions will be returned. The maximum value is 2000; values above 2000 will be coerced to 2000. */
		pageSize?: number;
		/** Required. The parent resource, which owns this collection of subscriptions. Format: projects/{project}/registrations/{registration} The {registration} part can be an FID or an FCM Token. Format: `projects/<id>/registrations/<id>`. */
		parent: string;
		/** Optional. A page token, received from a previous `ListTopicSubscriptions` call. Provide this to retrieve the subsequent page. */
		pageToken?: string;
	};
	'messaging.registrations.topicSubscriptions.patch': {
		/** Identifier. The resource name of the subscription. Format: projects/{project}/registrations/{registration}/topicSubscriptions/{topicSubscription} The {registration} part contains the registration ID (e.g., FID). Format: `projects/<id>/registrations/<id>/topicSubscriptions/<id>`. */
		name: string;
		/** Optional. If set to true, and the topic subscription is not found, a new topic subscription will be created. */
		allowMissing?: boolean;
		/** Identifier. The resource name of the subscription. Format: projects/{project}/registrations/{registration}/topicSubscriptions/{topicSubscription} The {registration} part contains the registration ID (e.g., FID). */
		body_name?: string;
	};
	'remoteConfig.namespaces.experiments.delete': {
		/** Required. The name of the experiment to delete. Format: projects/{project}/namespaces/{namespace}/experiments/{experiment_id} Format: `projects/<id>/namespaces/<id>/experiments/<id>`. */
		name: string;
	};
	'remoteConfig.namespaces.experiments.get': {
		/** Required. The name of the experiment to get. Format: projects/{project}/namespaces/{namespace}/experiments/{experiment_id} Format: `projects/<id>/namespaces/<id>/experiments/<id>`. */
		name: string;
	};
	'remoteConfig.namespaces.experiments.list': {
		/** Optional. The token for the specific page to retrieve. */
		pageToken?: string;
		/** Required. The parent project for which to list experiments. Format: projects/{project}/namespaces/{namespace} Format: `projects/<id>/namespaces/<id>`. */
		parent: string;
		/** Optional. Filter expression following AIP-160 The following filters are supported: name: String. The experiment name. */
		filter?: string;
		/** Optional. The maximum number of items to return per page. If not specified, defaults to 100. */
		pageSize?: number;
	};
	'remoteConfig.namespaces.fetch': {
		/** Required. The Firebase project ID or project number. (NOTE: These identifiers can be retrieved from the Firebase console.) */
		project: string;
		/** Required. The string "firebase". */
		namespace: string;
		/** Required. If not specified, fetch will return 400 (Bad Request). GMP App id. */
		appId?: string;
		/** Optional - If omitted and the template has any conditions that depend on app_version, they will be evaluated as false. App version, using the native app version format on the client's OS. Examples: 0, 123, 0123, 1.2.3, 001.33.043.321.55 . */
		appVersion?: string;
		/** Optional - If omitted and the template has any conditions that depend on app_build, they will be evaluated as false. * On Android, this is the Version Code, which is a positive integer, e.g., 42. */
		appBuild?: string;
		/** Required. The instance id token of the app, which is retrieved using the default scope. If specified incorrectly, and if the template has any percentile conditions, they will be evaluated to false. If omitted, fetch can lead to a 400 response code (Bad Request). */
		appInstanceIdToken?: string;
		/** Optional - If omitted and the template has any conditions that depend on country_code, they will be evaluated as false. Should be 2 lower-case letters, e.g. "us", "tr", or "gb", as defined in ISO 3166-1 alpha-2. This is case-insensitive. See https://www.iso.org/obp/ui/#search . */
		countryCode?: string;
		/** Optional - If omitted, the project's default package will be fetched. Name of the package for which we are fetching data from. Should match the app name for Android apps, or the corresponding entity (e.g. bundle name) for iOS apps. */
		packageName?: string;
		/** Optional - If omitted and the template has any conditions that depend on locale, they will be evaluated as false. The default locale of the device, in BCP47 format, for example "en-US". This is case-insensitive. See https://www.w3.org/International/core/langtags/rfc3066bis.html . */
		languageCode?: string;
		/** Optional - If omitted and the template has any conditions that depend on timezone, they will be evaluated as false. The timezone id of the device, in Olson Id format, e.g. "America/Los_Angeles". */
		timeZone?: string;
		/** Required. The instance id of the app. If unspecified, fetch will return 400 (Bad Request). Refer to https://firebase.google.com/support/privacy/manage-iids. */
		appInstanceId?: string;
		/** Optional - List of Analytics user properties. */
		analyticsUserProperties?: Record<string, string>;
		/** Optional. Optional - List of Custom Signals. */
		customSignals?: Record<string, string>;
		/** Optional - Version of the Firebase Remote Config SDK. This number is hard-coded into each client. */
		sdkVersion?: string;
		/** Optional - If omitted and the template has any conditions that depend on platform version, they will be evaluated as false. The version string of the device, e.g. "21" for (Android) Lollipop, or (for iOS) three non-negative, period separated integers, e.g. "9.0.0". */
		platformVersion?: string;
		/** The first time a user launches an app after installing or re-installing it. This value comes from GA, and will not be set if GA SDK is not available on the client or if GA does not have the first-open time value. */
		firstOpenTime?: string;
	};
	'remoteConfig.namespaces.get': {
		/** Required. The name of the namespace to get. Format: projects/{project}/namespaces/{namespace} Format: `projects/<id>/namespaces/<id>`. */
		name: string;
	};
	'remoteConfig.namespaces.getConditionOrder': {
		/** Required. The resource name of the condition order singleton. Format: projects/{project}/namespaces/{namespace}/conditionOrder Format: `projects/<id>/namespaces/<id>/conditionOrder`. */
		name: string;
	};
	'remoteConfig.namespaces.getRemoteConfig': {
		/** Optional. Version number of the RemoteConfig to look up. If not specified, the latest RemoteConfig will be returned. */
		versionNumber?: string | number;
		/** Optional. The name of the RemoteConfig to get. Format: projects/{project}/namespaces/{namespace}/remoteConfig Project is a Firebase project ID or project number. Namespace is the namespace ID (e.g.: 'firebase' or 'firebase-server') Format: `projects/<id>/namespaces/<id>/remoteConfig`. */
		name: string;
		/** Required. The Firebase project's Project ID or Project Number, prefixed with "projects/". */
		project?: string;
	};
	'remoteConfig.namespaces.getServerRemoteConfig': {
		/** Required. The name of the template to get. Format: projects/{project}/namespaces/{namespace}/serverRemoteConfig Project is a Firebase project ID or project number. Namespace is the namespace ID (e.g.: firebase-server) Format: `projects/<id>/namespaces/<id>/serverRemoteConfig`. */
		name: string;
	};
	'remoteConfig.namespaces.list': {
		/** Required. The parent project for which to list namespaces. Format: projects/{project} Format: `projects/<id>`. */
		parent: string;
		/** Optional. The maximum number of items to return per page. If not specified, defaults to 100. */
		pageSize?: number;
		/** Optional. The token for the specific page to retrieve. */
		pageToken?: string;
	};
	'remoteConfig.namespaces.remoteConfig.downloadDefaults': {
		/** Optional. The name of the RemoteConfig to get defaults from. Format: projects/{project}/namespaces/{namespace}/remoteConfig Project is a Firebase project ID or project number. Namespace is the namespace ID (e.g.: 'firebase' or 'firebase-server') Format: `projects/<id>/namespaces/<id>/remoteConfig`. */
		name: string;
		/** Required. The file structure to return. */
		format?: 'FORMAT_UNSPECIFIED' | 'XML' | 'PLIST' | 'JSON';
		/** Required. The Firebase project's Project ID or Project Number, prefixed with "projects/". */
		project?: string;
	};
	'remoteConfig.namespaces.remoteConfig.listVersions': {
		/** Required. The Firebase project's Project ID or Project Number, prefixed with "projects/". */
		project?: string;
		/** Optional. The next_page_token value returned from a previous List request, if any. */
		pageToken?: string;
		/** Optional. The resource name of the RemoteConfig to list versions for. Format: projects/{project}/namespaces/{namespace}/remoteConfig Project is a Firebase project ID or project number. */
		parent: string;
		/** Optional. The maximum number of items to return per page. */
		pageSize?: number;
		/** Optional. Specify the earliest update time to include in the results; any entries updated before this time are omitted. */
		startTime?: string;
		/** Optional. Specify the newest version number to include in the results. If specified, must be greater than zero. Defaults to the newest version. */
		endVersionNumber?: string | number;
		/** Optional. Specify the latest update time to include in the results; any entries updated on or after this time are omitted. */
		endTime?: string;
	};
	'remoteConfig.namespaces.remoteConfig.rollback': {
		/** Optional. The name of the RemoteConfig to rollback. Format: projects/{project}/namespaces/{namespace}/remoteConfig Project is a Firebase project ID or project number. Namespace is the namespace ID (e.g.: firebase or firebase-server) Format: `projects/<id>/namespaces/<id>/remoteConfig`. */
		name: string;
		/** The Firebase project's Project ID or Project Number, prefixed with "projects/". This field is required if the `name` field is not provided. */
		project?: string;
		/** Required. The version number of the RemoteConfig to roll back to. The specified version number must be less than the current version number, and not have been deleted due to staleness. */
		versionNumber?: string | number;
		/** Optional. The name of the RemoteConfig to rollback. Format: projects/{project}/namespaces/{namespace}/remoteConfig Project is a Firebase project ID or project number. Namespace is the namespace ID (e.g.: firebase or firebase-server) */
		body_name?: string;
	};
	'remoteConfig.namespaces.remoteConfigConditions.create': {
		/** Optional. When set to true, the request is validated but not executed. */
		validateOnly?: boolean;
		/** Required. The parent namespace in which to create the condition. Format: projects/{project}/namespaces/{namespace} Format: `projects/<id>/namespaces/<id>`. */
		parent: string;
		/** Required. The ID to use for the new condition. */
		remoteConfigConditionId?: string;
		/** Required. The logic of this condition. See the documentation regarding Condition Expressions for the expected syntax of this field. */
		expression?: string;
		/** Required. Identifier. A non-empty and unique name of this condition. Format: projects/{project}/namespaces/{namespace}/remoteConfigConditions/{remote_config_condition} When used within RemoteConfig.conditions, this field may contain just the condition name. */
		name?: string;
		/** The current ETag of the condition for optimistic concurrency. */
		etag?: string;
		/** Optional. The color associated with this condition for display purposes in the Firebase Console. Not specifying this value or having "CONDITION_DISPLAY_COLOR_UNSPECIFIED" results in the Console picking an arbitrary color to associate with the condition. */
		tagColor?:
			| 'CONDITION_DISPLAY_COLOR_UNSPECIFIED'
			| 'BLUE'
			| 'BROWN'
			| 'CYAN'
			| 'DEEP_ORANGE'
			| 'GREEN'
			| 'INDIGO'
			| 'LIME'
			| 'ORANGE'
			| 'PINK'
			| 'PURPLE'
			| 'TEAL';
	};
	'remoteConfig.namespaces.remoteConfigConditions.delete': {
		/** Optional. If set to true, and the condition is not found, the request will succeed but no action will be taken. */
		allowMissing?: boolean;
		/** Required. The resource name of the condition to delete. Format: projects/{project}/namespaces/{namespace}/remoteConfigConditions/{remote_config_condition_id} Format: `projects/<id>/namespaces/<id>/remoteConfigConditions/<id>`. */
		name: string;
		/** Optional. The current ETag of the condition for optimistic concurrency. */
		etag?: string;
	};
	'remoteConfig.namespaces.remoteConfigConditions.get': {
		/** Required. The resource name of the condition. Format: projects/{project}/namespaces/{namespace}/remoteConfigConditions/{remote_config_condition_id} Format: `projects/<id>/namespaces/<id>/remoteConfigConditions/<id>`. */
		name: string;
	};
	'remoteConfig.namespaces.remoteConfigConditions.list': {
		/** Optional. The maximum number of conditions to return in the response. If unspecified, defaults to 100. The maximum value is 1000; values above 1000 will be coerced to 1000. */
		pageSize?: number;
		/** Optional. A page token received from a previous list call. */
		pageToken?: string;
		/** Required. The parent namespace in which to list conditions. Format: projects/{project}/namespaces/{namespace} Format: `projects/<id>/namespaces/<id>`. */
		parent: string;
	};
	'remoteConfig.namespaces.remoteConfigConditions.patch': {
		/** Optional. When set to true, the request is validated but not executed. */
		validateOnly?: boolean;
		/** Required. Identifier. A non-empty and unique name of this condition. Format: projects/{project}/namespaces/{namespace}/remoteConfigConditions/{remote_config_condition} When used within RemoteConfig.conditions, this field may contain just the condition name. */
		name: string;
		/** Optional. If set to true, and the condition is not found, a new condition will be created. */
		allowMissing?: boolean;
		/** Optional. Field mask specifying which fields to update. */
		updateMask?: string;
		/** Required. The logic of this condition. See the documentation regarding Condition Expressions for the expected syntax of this field. */
		expression?: string;
		/** Required. Identifier. A non-empty and unique name of this condition. Format: projects/{project}/namespaces/{namespace}/remoteConfigConditions/{remote_config_condition} When used within RemoteConfig.conditions, this field may contain just the condition name. */
		body_name?: string;
		/** The current ETag of the condition for optimistic concurrency. */
		etag?: string;
		/** Optional. The color associated with this condition for display purposes in the Firebase Console. Not specifying this value or having "CONDITION_DISPLAY_COLOR_UNSPECIFIED" results in the Console picking an arbitrary color to associate with the condition. */
		tagColor?:
			| 'CONDITION_DISPLAY_COLOR_UNSPECIFIED'
			| 'BLUE'
			| 'BROWN'
			| 'CYAN'
			| 'DEEP_ORANGE'
			| 'GREEN'
			| 'INDIGO'
			| 'LIME'
			| 'ORANGE'
			| 'PINK'
			| 'PURPLE'
			| 'TEAL';
	};
	'remoteConfig.namespaces.remoteConfigParameterGroups.create': {
		/** Required. The ID to use for the new parameter group. */
		remoteConfigParameterGroupId?: string;
		/** Optional. When set to true, the request is validated but not executed. */
		validateOnly?: boolean;
		/** Required. The parent namespace in which to create the parameter group. Format: projects/{project}/namespaces/{namespace} Format: `projects/<id>/namespaces/<id>`. */
		parent: string;
		/** Optional. Map of parameter keys to their optional default values and optional conditional values for parameters that belong to this group. */
		parameters?: Record<string, FirebaseRemoteConfigParameterInput>;
		/** Optional. A description for the group. Its length must be less than or equal to 256 characters. A description may contain any Unicode characters. */
		description?: string;
		/** Optional. Identifier. The resource name of the parameter group. Format: projects/{project}/namespaces/{namespace}/remoteConfigParameterGroups/{remote_config_parameter_group} */
		name?: string;
		/** The current ETag of the parameter group for optimistic concurrency. */
		etag?: string;
	};
	'remoteConfig.namespaces.remoteConfigParameterGroups.delete': {
		/** Optional. If set to true, and the parameter group is not found, the request will succeed but no action will be taken. */
		allowMissing?: boolean;
		/** Required. The resource name of the parameter group to delete. Format: projects/{project}/namespaces/{namespace}/remoteConfigParameterGroups/{remote_config_parameter_group_id} Format: `projects/<id>/namespaces/<id>/remoteConfigParameterGroups/<id>`. */
		name: string;
		/** Optional. The current ETag of the parameter group for optimistic concurrency. */
		etag?: string;
	};
	'remoteConfig.namespaces.remoteConfigParameterGroups.get': {
		/** Required. The resource name of the parameter group. Format: projects/{project}/namespaces/{namespace}/remoteConfigParameterGroups/{remote_config_parameter_group_id} Format: `projects/<id>/namespaces/<id>/remoteConfigParameterGroups/<id>`. */
		name: string;
	};
	'remoteConfig.namespaces.remoteConfigParameterGroups.list': {
		/** Required. The parent namespace in which to list parameter groups. Format: projects/{project}/namespaces/{namespace} Format: `projects/<id>/namespaces/<id>`. */
		parent: string;
		/** Optional. The maximum number of parameter groups to return in the response. If unspecified, defaults to 100. The maximum value is 1000; values above 1000 will be coerced to 1000. */
		pageSize?: number;
		/** Optional. A page token received from a previous list call. */
		pageToken?: string;
	};
	'remoteConfig.namespaces.remoteConfigParameterGroups.patch': {
		/** Optional. If set to true, and the parameter group is not found, a new parameter group will be created. */
		allowMissing?: boolean;
		/** Optional. Field mask specifying which fields to update. */
		updateMask?: string;
		/** Optional. Identifier. The resource name of the parameter group. Format: projects/{project}/namespaces/{namespace}/remoteConfigParameterGroups/{remote_config_parameter_group} Format: `projects/<id>/namespaces/<id>/remoteConfigParameterGroups/<id>`. */
		name: string;
		/** Optional. When set to true, the request is validated but not executed. */
		validateOnly?: boolean;
		/** Optional. Map of parameter keys to their optional default values and optional conditional values for parameters that belong to this group. */
		parameters?: Record<string, FirebaseRemoteConfigParameterInput>;
		/** Optional. A description for the group. Its length must be less than or equal to 256 characters. A description may contain any Unicode characters. */
		description?: string;
		/** Optional. Identifier. The resource name of the parameter group. Format: projects/{project}/namespaces/{namespace}/remoteConfigParameterGroups/{remote_config_parameter_group} */
		body_name?: string;
		/** The current ETag of the parameter group for optimistic concurrency. */
		etag?: string;
	};
	'remoteConfig.namespaces.remoteConfigParameters.create': {
		/** Required. The parent namespace in which to create the parameter. Format: projects/{project}/namespaces/{namespace} Format: `projects/<id>/namespaces/<id>`. */
		parent: string;
		/** Required. The ID to use for the new parameter. */
		remoteConfigParameterId?: string;
		/** Optional. When set to true, the request is validated but not executed. */
		validateOnly?: boolean;
		/** Optional. Optional - a (condition name, value) map. The condition_name of the highest priority (the one listed first in the RemoteConfig's conditions list) determines the value of this parameter. */
		conditionalValues?: Record<string, FirebaseRemoteConfigParameterValueInput>;
		/** Optional. Identifier. The resource name of the parameter. Format: projects/{project}/namespaces/{namespace}/remoteConfigParameters/{remote_config_parameter} NOTE: Retained as field number 5 to preserve strict backwards wire-compatibility with existing RemoteConfig.parameters map definitions. */
		name?: string;
		/** The current ETag of the parameter for optimistic concurrency. */
		etag?: string;
		/** Optional. Optional - value to set the parameter to, when none of the named conditions evaluate to `true`. */
		defaultValue?: FirebaseRemoteConfigParameterValueInput;
		/** Optional. The data type for all values of this parameter in the current version of the template. Defaults to `ParameterValueType.STRING` if unspecified. */
		valueType?:
			| 'PARAMETER_VALUE_TYPE_UNSPECIFIED'
			| 'STRING'
			| 'BOOLEAN'
			| 'NUMBER'
			| 'JSON';
		/** Optional. A description for this Parameter. Its length must be less than or equal to 256 characters . A description may contain any Unicode characters. */
		description?: string;
	};
	'remoteConfig.namespaces.remoteConfigParameters.delete': {
		/** Required. The resource name of the parameter to delete. Format: projects/{project}/namespaces/{namespace}/remoteConfigParameters/{remote_config_parameter_id} Format: `projects/<id>/namespaces/<id>/remoteConfigParameters/<id>`. */
		name: string;
		/** Optional. The current ETag of the parameter for optimistic concurrency. */
		etag?: string;
		/** Optional. If set to true, and the parameter is not found, the request will succeed but no action will be taken. */
		allowMissing?: boolean;
	};
	'remoteConfig.namespaces.remoteConfigParameters.get': {
		/** Required. The resource name of the parameter. Format: projects/{project}/namespaces/{namespace}/remoteConfigParameters/{remote_config_parameter_id} Format: `projects/<id>/namespaces/<id>/remoteConfigParameters/<id>`. */
		name: string;
	};
	'remoteConfig.namespaces.remoteConfigParameters.list': {
		/** Optional. The maximum number of parameters to return in the response. If unspecified, defaults to 100. The maximum value is 1000; values above 1000 will be coerced to 1000. */
		pageSize?: number;
		/** Optional. A page token received from a previous list call. */
		pageToken?: string;
		/** Required. The parent namespace in which to list parameters. Format: projects/{project}/namespaces/{namespace} Format: `projects/<id>/namespaces/<id>`. */
		parent: string;
	};
	'remoteConfig.namespaces.remoteConfigParameters.patch': {
		/** Optional. When set to true, the request is validated but not executed. */
		validateOnly?: boolean;
		/** Optional. Field mask specifying which fields to update. */
		updateMask?: string;
		/** Optional. Identifier. The resource name of the parameter. Format: projects/{project}/namespaces/{namespace}/remoteConfigParameters/{remote_config_parameter} NOTE: Retained as field number 5 to preserve strict backwards wire-compatibility with existing RemoteConfig.parameters map definitions. */
		name: string;
		/** Optional. If set to true, and the parameter is not found, a new parameter will be created. */
		allowMissing?: boolean;
		/** Optional. Optional - a (condition name, value) map. The condition_name of the highest priority (the one listed first in the RemoteConfig's conditions list) determines the value of this parameter. */
		conditionalValues?: Record<string, FirebaseRemoteConfigParameterValueInput>;
		/** Optional. Identifier. The resource name of the parameter. Format: projects/{project}/namespaces/{namespace}/remoteConfigParameters/{remote_config_parameter} NOTE: Retained as field number 5 to preserve strict backwards wire-compatibility with existing RemoteConfig.parameters map definitions. */
		body_name?: string;
		/** The current ETag of the parameter for optimistic concurrency. */
		etag?: string;
		/** Optional. Optional - value to set the parameter to, when none of the named conditions evaluate to `true`. */
		defaultValue?: FirebaseRemoteConfigParameterValueInput;
		/** Optional. The data type for all values of this parameter in the current version of the template. Defaults to `ParameterValueType.STRING` if unspecified. */
		valueType?:
			| 'PARAMETER_VALUE_TYPE_UNSPECIFIED'
			| 'STRING'
			| 'BOOLEAN'
			| 'NUMBER'
			| 'JSON';
		/** Optional. A description for this Parameter. Its length must be less than or equal to 256 characters . A description may contain any Unicode characters. */
		description?: string;
	};
	'remoteConfig.namespaces.rollouts.delete': {
		/** Required. The name of the rollout to delete. Format: projects/{project}/namespaces/{namespace}/rollouts/{rollout_id} Format: `projects/<id>/namespaces/<id>/rollouts/<id>`. */
		name: string;
	};
	'remoteConfig.namespaces.rollouts.get': {
		/** Required. The name of the rollout to get. Format: projects/{project}/namespaces/{namespace}/rollouts/{rollout_id} Format: `projects/<id>/namespaces/<id>/rollouts/<id>`. */
		name: string;
	};
	'remoteConfig.namespaces.rollouts.list': {
		/** Optional. The maximum number of items to return per page. */
		pageSize?: number;
		/** Required. The parent project for which to list rollouts. Format: projects/{project}/namespaces/{namespace} Format: `projects/<id>/namespaces/<id>`. */
		parent: string;
		/** Optional. The token for the specific page to retrieve. */
		pageToken?: string;
		/** Optional. Filter expression following AIP-160 */
		filter?: string;
	};
	'remoteConfig.namespaces.updateConditionOrder': {
		/** Optional. Field mask specifying which fields to update. */
		updateMask?: string;
		/** Optional. When set to true, the request is validated but not executed. */
		validateOnly?: boolean;
		/** Required. Identifier. The resource name of the condition order singleton. Format: projects/{project}/namespaces/{namespace}/conditionOrder Format: `projects/<id>/namespaces/<id>/conditionOrder`. */
		name: string;
		/** Required. Identifier. The resource name of the condition order singleton. Format: projects/{project}/namespaces/{namespace}/conditionOrder */
		body_name?: string;
		/** The current ETag of the condition order for optimistic concurrency. */
		etag?: string;
		/** Required. The ordered list of condition IDs in descending priority. */
		conditionIds?: Array<string>;
	};
	'remoteConfig.namespaces.updateRemoteConfig': {
		/** The Firebase project's Project ID or Project Number, prefixed with "projects/". This field is required if the `name` field is not provided. */
		project?: string;
		/** Optional. The name of the RemoteConfig to update. Format: projects/{project}/namespaces/{namespace}/remoteConfig Project is a Firebase project ID or project number. Namespace is the namespace ID (e.g.: firebase or firebase-server) Format: `projects/<id>/namespaces/<id>/remoteConfig`. */
		name: string;
		/** Optional. Defaults to `false`. If `true`, the server will only attempt to validate the RemoteConfig. If validation succeeds, the RemoteConfig is not written to the Remote Config server, instead a `200 OK` response is returned. If validation fails, a validation error is returned. */
		validateOnly?: boolean;
		/** A list of conditions in descending order by priority. The values of the google.firebase.remoteconfig.v1.RemoteConfigCondition.name entries must be unique. */
		conditions?: Array<FirebaseRemoteConfigConditionInput>;
		/** Map of parameter group names to their descriptions and grouped parameters. A group's name is mutable but must be unique among groups in the config. The name is limited to 256 characters and intended to be human-readable. Any Unicode characters are allowed. */
		parameterGroups?: Record<string, FirebaseRemoteConfigParameterGroupInput>;
		/** Output only, except for the version description. Metadata associated with a particular version of a template. A version's description field may be specified in UpdateRemoteConfig calls. */
		version?: FirebaseRemoteConfigVersionInput;
		/** Map of parameter keys to their optional default values and optional conditional values. */
		parameters?: Record<string, FirebaseRemoteConfigParameterInput>;
		/** The ETag of the template being replaced (`etag` from remoteConfig.namespaces.getRemoteConfig), or `*` to replace whatever is published. */
		ifMatch: string;
	};
	'remoteConfig.projects.getRemoteConfig': {
		/** Optional. The name of the RemoteConfig to get. Format: projects/{project}/namespaces/{namespace}/remoteConfig Project is a Firebase project ID or project number. Namespace is the namespace ID (e.g.: 'firebase' or 'firebase-server') */
		name?: string;
		/** Optional. Version number of the RemoteConfig to look up. If not specified, the latest RemoteConfig will be returned. */
		versionNumber?: string | number;
		/** Required. The Firebase project's Project ID or Project Number, prefixed with "projects/". Format: `projects/<id>`. */
		project: string;
	};
	'remoteConfig.projects.updateRemoteConfig': {
		/** The Firebase project's Project ID or Project Number, prefixed with "projects/". This field is required if the `name` field is not provided. Format: `projects/<id>`. */
		project: string;
		/** Optional. Defaults to `false`. If `true`, the server will only attempt to validate the RemoteConfig. If validation succeeds, the RemoteConfig is not written to the Remote Config server, instead a `200 OK` response is returned. If validation fails, a validation error is returned. */
		validateOnly?: boolean;
		/** Optional. The name of the RemoteConfig to update. Format: projects/{project}/namespaces/{namespace}/remoteConfig Project is a Firebase project ID or project number. Namespace is the namespace ID (e.g.: firebase or firebase-server) */
		name?: string;
		/** A list of conditions in descending order by priority. The values of the google.firebase.remoteconfig.v1.RemoteConfigCondition.name entries must be unique. */
		conditions?: Array<FirebaseRemoteConfigConditionInput>;
		/** Map of parameter group names to their descriptions and grouped parameters. A group's name is mutable but must be unique among groups in the config. The name is limited to 256 characters and intended to be human-readable. Any Unicode characters are allowed. */
		parameterGroups?: Record<string, FirebaseRemoteConfigParameterGroupInput>;
		/** Output only, except for the version description. Metadata associated with a particular version of a template. A version's description field may be specified in UpdateRemoteConfig calls. */
		version?: FirebaseRemoteConfigVersionInput;
		/** Map of parameter keys to their optional default values and optional conditional values. */
		parameters?: Record<string, FirebaseRemoteConfigParameterInput>;
		/** The ETag of the template being replaced (`etag` from remoteConfig.projects.getRemoteConfig), or `*` to replace whatever is published. */
		ifMatch: string;
	};
	'remoteConfig.remoteConfig.downloadDefaults': {
		/** Required. The Firebase project's Project ID or Project Number, prefixed with "projects/". Format: `projects/<id>`. */
		project: string;
		/** Required. The file structure to return. */
		format?: 'FORMAT_UNSPECIFIED' | 'XML' | 'PLIST' | 'JSON';
		/** Optional. The name of the RemoteConfig to get defaults from. Format: projects/{project}/namespaces/{namespace}/remoteConfig Project is a Firebase project ID or project number. Namespace is the namespace ID (e.g.: 'firebase' or 'firebase-server') */
		name?: string;
	};
	'remoteConfig.remoteConfig.listVersions': {
		/** Optional. The next_page_token value returned from a previous List request, if any. */
		pageToken?: string;
		/** Required. The Firebase project's Project ID or Project Number, prefixed with "projects/". Format: `projects/<id>`. */
		project: string;
		/** Optional. The maximum number of items to return per page. */
		pageSize?: number;
		/** Optional. The resource name of the RemoteConfig to list versions for. Format: projects/{project}/namespaces/{namespace}/remoteConfig Project is a Firebase project ID or project number. Namespace is the namespace ID (e.g.: 'firebase' or 'firebase-server') */
		parent?: string;
		/** Optional. Specify the newest version number to include in the results. If specified, must be greater than zero. Defaults to the newest version. */
		endVersionNumber?: string | number;
		/** Optional. Specify the earliest update time to include in the results; any entries updated before this time are omitted. */
		startTime?: string;
		/** Optional. Specify the latest update time to include in the results; any entries updated on or after this time are omitted. */
		endTime?: string;
	};
	'remoteConfig.remoteConfig.rollback': {
		/** The Firebase project's Project ID or Project Number, prefixed with "projects/". This field is required if the `name` field is not provided. Format: `projects/<id>`. */
		project: string;
		/** The Firebase project's Project ID or Project Number, prefixed with "projects/". This field is required if the `name` field is not provided. */
		body_project?: string;
		/** Required. The version number of the RemoteConfig to roll back to. The specified version number must be less than the current version number, and not have been deleted due to staleness. */
		versionNumber?: string | number;
		/** Optional. The name of the RemoteConfig to rollback. Format: projects/{project}/namespaces/{namespace}/remoteConfig Project is a Firebase project ID or project number. Namespace is the namespace ID (e.g.: firebase or firebase-server) */
		name?: string;
	};
	'rules.projects.test': {
		/** Required. Tests may either provide `source` or a `Ruleset` resource name. For tests against `source`, the resource name must refer to the project: Format: `projects/{project_id}` For tests against a `Ruleset`, this must be the `Ruleset` resource name: Format… */
		name: string;
		/** Required. The tests to execute against the `Source`. When `Source` is provided inline, the test cases will only be run if the `Source` is syntactically and semantically valid. Inline `TestSuite` to run. */
		testSuite?: FirebaseTestSuiteInput;
		/** Optional. Optional `Source` to be checked for correctness. This field must not be set when the resource name refers to a `Ruleset`. */
		source?: FirebaseSourceInput;
	};
	'rules.releases.create': {
		/** Required. Resource name for the project which owns this `Release`. Format: `projects/{project_id}` Format: `projects/<id>`. */
		name: string;
		/** Required. Format: `projects/{project_id}/releases/{release_id}` */
		body_name?: string;
		/** Required. Name of the `Ruleset` referred to by this `Release`. The `Ruleset` must exist for the `Release` to be created. */
		rulesetName?: string;
	};
	'rules.releases.delete': {
		/** Required. Resource name for the `Release` to delete. Format: `projects/{project_id}/releases/{release_id}` Format: `projects/<id>/releases/<path>`. */
		name: string;
	};
	'rules.releases.get': {
		/** Required. Resource name of the `Release`. Format: `projects/{project_id}/releases/{release_id}` Format: `projects/<id>/releases/<path>`. */
		name: string;
	};
	'rules.releases.getExecutable': {
		/** Required. Resource name of the `Release`. Format: `projects/{project_id}/releases/{release_id}` Format: `projects/<id>/releases/<path>`. */
		name: string;
		/** Optional. The requested runtime executable version. Defaults to FIREBASE_RULES_EXECUTABLE_V1. */
		executableVersion?:
			| 'RELEASE_EXECUTABLE_VERSION_UNSPECIFIED'
			| 'FIREBASE_RULES_EXECUTABLE_V1'
			| 'FIREBASE_RULES_EXECUTABLE_V2';
	};
	'rules.releases.list': {
		/** Optional. `Release` filter. The list method supports filters with restrictions on the `Release.name`, and `Release.ruleset_name`. */
		filter?: string;
		/** Optional. Page size to load. Maximum of 100. Defaults to 10. Note: `page_size` is just a hint and the service may choose to load fewer than `page_size` results due to the size of the output. To traverse all of the releases, the caller should iterate until the `page_token` on the response is empty. */
		pageSize?: number;
		/** Optional. Next page token for the next batch of `Release` instances. */
		pageToken?: string;
		/** Required. Resource name for the project. Format: `projects/{project_id}` Format: `projects/<id>`. */
		name: string;
	};
	'rules.releases.patch': {
		/** Required. Resource name for the project which owns this `Release`. Format: `projects/{project_id}` Format: `projects/<id>/releases/<path>`. */
		name: string;
		/** Required. `Release` to update. */
		release?: FirebaseRulesReleaseInput;
		/** Optional. Specifies which fields to update. */
		updateMask?: string;
	};
	'rules.rulesets.create': {
		/** Required. Resource name for Project which owns this `Ruleset`. Format: `projects/{project_id}` Format: `projects/<id>`. */
		name: string;
		/** Required. `Source` for the `Ruleset`. */
		source?: FirebaseSourceInput;
		/** Immutable. Intended resource to which this Ruleset should be released. May be left blank to signify the resource associated with the default release. Expected format: firestore.googleapis.com/projects//databases/ */
		attachmentPoint?: string;
	};
	'rules.rulesets.delete': {
		/** Required. Resource name for the ruleset to delete. Format: `projects/{project_id}/rulesets/{ruleset_id}` Format: `projects/<id>/rulesets/<id>`. */
		name: string;
	};
	'rules.rulesets.get': {
		/** Required. Resource name for the ruleset to get. Format: `projects/{project_id}/rulesets/{ruleset_id}` Format: `projects/<id>/rulesets/<id>`. */
		name: string;
	};
	'rules.rulesets.list': {
		/** Optional. Next page token for loading the next batch of `Ruleset` instances. */
		pageToken?: string;
		/** Optional. Page size to load. Maximum of 100. Defaults to 10. Note: `page_size` is just a hint and the service may choose to load less than `page_size` due to the size of the output. To traverse all of the releases, caller should iterate until the `page_token` is empty. */
		pageSize?: number;
		/** Optional. `Ruleset` filter. The list method supports filters with restrictions on `Ruleset.name`. Filters on `Ruleset.create_time` should use the `date` function which parses strings that conform to the RFC 3339 date/time specifications. */
		filter?: string;
		/** Required. Resource name for the project. Format: `projects/{project_id}` Format: `projects/<id>`. */
		name: string;
	};
	'storage.buckets.delete': {
		/** Name of a bucket. */
		bucket: string;
		/** If set, only deletes the bucket if its metageneration matches this value. */
		ifMetagenerationMatch?: string | number;
		/** If set, only deletes the bucket if its metageneration does not match this value. */
		ifMetagenerationNotMatch?: string | number;
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
	};
	'storage.buckets.get': {
		/** Name of a bucket. */
		bucket: string;
		/** If present, specifies the generation of the bucket. This is required if softDeleted is true. */
		generation?: string | number;
		/** If true, return the soft-deleted version of this bucket. The default is false. For more information, see [Soft Delete](https://cloud.google.com/storage/docs/soft-delete). */
		softDeleted?: boolean;
		/** Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value. */
		ifMetagenerationMatch?: string | number;
		/** Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value. */
		ifMetagenerationNotMatch?: string | number;
		/** Set of properties to return. Defaults to noAcl. */
		projection?: 'full' | 'noAcl';
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
	};
	'storage.buckets.getIamPolicy': {
		/** Name of a bucket. */
		bucket: string;
		/** The IAM policy format version to be returned. If the optionsRequestedPolicyVersion is for an older version that doesn't support part of the requested IAM policy, the request fails. */
		optionsRequestedPolicyVersion?: number;
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
	};
	'storage.buckets.getStorageLayout': {
		/** Name of a bucket. */
		bucket: string;
		/** An optional prefix used for permission check. It is useful when the caller only has storage.objects.list permission under a specific prefix. */
		prefix?: string;
	};
	'storage.buckets.insert': {
		/** Apply a predefined set of access controls to this bucket. */
		predefinedAcl?:
			| 'authenticatedRead'
			| 'private'
			| 'projectPrivate'
			| 'publicRead'
			| 'publicReadWrite';
		/** Apply a predefined set of default object access controls to this bucket. */
		predefinedDefaultObjectAcl?:
			| 'authenticatedRead'
			| 'bucketOwnerFullControl'
			| 'bucketOwnerRead'
			| 'private'
			| 'projectPrivate'
			| 'publicRead';
		/** A valid API project identifier. */
		project: string;
		/** Set of properties to return. Defaults to noAcl, unless the bucket resource specifies acl or defaultObjectAcl properties, when it defaults to full. */
		projection?: 'full' | 'noAcl';
		/** The project to be billed for this request. */
		userProject?: string;
		/** When set to true, object retention is enabled for this bucket. */
		enableObjectRetention?: boolean;
		/** Access controls on the bucket. */
		acl?: Array<FirebaseBucketAccessControlInput>;
		/** The bucket's billing configuration. */
		billing?: {
			/** When set to true, Requester Pays is enabled for this bucket. */
			requesterPays?: boolean;
		};
		/** The bucket's Cross-Origin Resource Sharing (CORS) configuration. */
		cors?: Array<{
			/** The value, in seconds, to return in the Access-Control-Max-Age header used in preflight responses. */
			maxAgeSeconds?: number;
			/** The list of HTTP methods on which to include CORS response headers, (GET, OPTIONS, POST, etc) Note: "*" is permitted in the list of methods, and means "any method". */
			method?: Array<string>;
			/** The list of Origins eligible to receive CORS response headers. Note: "*" is permitted in the list of origins, and means "any Origin". */
			origin?: Array<string>;
			/** The list of HTTP headers other than the simple response headers to give permission for the user-agent to share across domains. */
			responseHeader?: Array<string>;
		}>;
		/** The bucket's custom placement configuration for Custom Dual Regions. */
		customPlacementConfig?: {
			/** The list of regional locations in which data is placed. */
			dataLocations?: Array<string>;
		};
		/** The default value for event-based hold on newly created objects in this bucket. Event-based hold is a way to retain objects indefinitely until an event occurs, signified by the hold's release. After being released, such objects will be subject to bucket-level retention (if any). */
		defaultEventBasedHold?: boolean;
		/** Default access controls to apply to new objects when no ACL is provided. */
		defaultObjectAcl?: Array<FirebaseObjectAccessControlInput>;
		/** Encryption configuration for a bucket. */
		encryption?: {
			/** A Cloud KMS key that will be used to encrypt objects inserted into this bucket, if no encryption method is specified. */
			defaultKmsKeyName?: string;
			/** If set, the new objects created in this bucket must comply with this enforcement config. Changing this has no effect on existing objects; it applies to new objects only. If omitted, the new objects are allowed to be encrypted with Google Managed Encryption type by default. */
			googleManagedEncryptionEnforcementConfig?: {
				/** Restriction mode for Google-Managed Encryption Keys. Defaults to NotRestricted. */
				restrictionMode?: 'NotRestricted' | 'FullyRestricted';
				/** Server-determined value that indicates the time from which configuration was enforced and effective. This value is in RFC 3339 format. */
				effectiveTime?: string;
			};
			/** If set, the new objects created in this bucket must comply with this enforcement config. Changing this has no effect on existing objects; it applies to new objects only. If omitted, the new objects are allowed to be encrypted with Customer Managed Encryption type by default. */
			customerManagedEncryptionEnforcementConfig?: {
				/** Restriction mode for Customer-Managed Encryption Keys. Defaults to NotRestricted. */
				restrictionMode?: 'NotRestricted' | 'FullyRestricted';
				/** Server-determined value that indicates the time from which configuration was enforced and effective. This value is in RFC 3339 format. */
				effectiveTime?: string;
			};
			/** If set, the new objects created in this bucket must comply with this enforcement config. Changing this has no effect on existing objects; it applies to new objects only. If omitted, the new objects are allowed to be encrypted with Customer Supplied Encryption type by default. */
			customerSuppliedEncryptionEnforcementConfig?: {
				/** Restriction mode for Customer-Supplied Encryption Keys. Defaults to NotRestricted. */
				restrictionMode?: 'NotRestricted' | 'FullyRestricted';
				/** Server-determined value that indicates the time from which configuration was enforced and effective. This value is in RFC 3339 format. */
				effectiveTime?: string;
			};
		};
		/** HTTP 1.1 Entity tag for the bucket. */
		etag?: string;
		/** The bucket's hierarchical namespace configuration. */
		hierarchicalNamespace?: {
			/** When set to true, hierarchical namespace is enabled for this bucket. */
			enabled?: boolean;
		};
		/** The bucket's IAM configuration. */
		iamConfiguration?: {
			/** The bucket's uniform bucket-level access configuration. The feature was formerly known as Bucket Policy Only. For backward compatibility, this field will be populated with identical information as the uniformBucketLevelAccess field. */
			bucketPolicyOnly?: {
				/** If set, access is controlled only by bucket-level or above IAM policies. */
				enabled?: boolean;
				/** The deadline for changing iamConfiguration.bucketPolicyOnly.enabled from true to false in RFC 3339 format. iamConfiguration.bucketPolicyOnly.enabled may be changed from true to false until the locked time, after which the field is immutable. */
				lockedTime?: string;
			};
			/** The bucket's uniform bucket-level access configuration. */
			uniformBucketLevelAccess?: {
				/** If set, access is controlled only by bucket-level or above IAM policies. */
				enabled?: boolean;
				/** The deadline for changing iamConfiguration.uniformBucketLevelAccess.enabled from true to false in RFC 3339 format. iamConfiguration.uniformBucketLevelAccess.enabled may be changed from true to false until the locked time, after which the field is immutable. */
				lockedTime?: string;
			};
			/** The bucket's Public Access Prevention configuration. Currently, 'inherited' and 'enforced' are supported. */
			publicAccessPrevention?: string;
		};
		/** The ID of the bucket. For buckets, the id and name properties are the same. */
		id?: string;
		/** The bucket's IP filter configuration. Specifies the network sources that are allowed to access the operations on the bucket, as well as its underlying objects. Only enforced when the mode is set to 'Enabled'. */
		ipFilter?: {
			/** The mode of the IP filter. Valid values are 'Enabled' and 'Disabled'. */
			mode?: string;
			/** The public network source of the bucket's IP filter. */
			publicNetworkSource?: {
				/** The list of public IPv4, IPv6 cidr ranges that are allowed to access the bucket. */
				allowedIpCidrRanges?: Array<string>;
			};
			/** The list of [VPC network](https://cloud.google.com/vpc/docs/vpc) sources of the bucket's IP filter. */
			vpcNetworkSources?: Array<{
				/** Name of the network. Format: projects/{PROJECT_ID}/global/networks/{NETWORK_NAME} */
				network?: string;
				/** The list of IPv4, IPv6 cidr ranges subnetworks that are allowed to access the bucket. */
				allowedIpCidrRanges?: Array<string>;
			}>;
			/** Whether to allow cross-org VPCs in the bucket's IP filter configuration. */
			allowCrossOrgVpcs?: boolean;
			/** Whether to allow all service agents to access the bucket regardless of the IP filter configuration. */
			allowAllServiceAgentAccess?: boolean;
		};
		/** The kind of item this is. For buckets, this is always storage#bucket. */
		kind?: string;
		/** User-provided labels, in key/value pairs. */
		labels?: Record<string, string>;
		/** The bucket's lifecycle configuration. See [Lifecycle Management](https://cloud.google.com/storage/docs/lifecycle) for more information. */
		lifecycle?: {
			/** A lifecycle management rule, which is made of an action to take and the condition(s) under which the action will be taken. */
			rule?: Array<{
				/** The action to take. */
				action?: {
					/** Target storage class. Required iff the type of the action is SetStorageClass. */
					storageClass?: string;
					/** Type of the action. Currently, only Delete, SetStorageClass, and AbortIncompleteMultipartUpload are supported. */
					type?: string;
				};
				/** The condition(s) under which the action will be taken. */
				condition?: {
					/** Age of an object (in days). This condition is satisfied when an object reaches the specified age. */
					age?: number;
					/** A date in RFC 3339 format with only the date part (for instance, "2013-01-15"). This condition is satisfied when an object is created before midnight of the specified date in UTC. */
					createdBefore?: string;
					/** A date in RFC 3339 format with only the date part (for instance, "2013-01-15"). This condition is satisfied when the custom time on an object is before this date in UTC. */
					customTimeBefore?: string;
					/** Number of days elapsed since the user-specified timestamp set on an object. The condition is satisfied if the days elapsed is at least this number. If no custom timestamp is specified on an object, the condition does not apply. */
					daysSinceCustomTime?: number;
					/** Number of days elapsed since the noncurrent timestamp of an object. The condition is satisfied if the days elapsed is at least this number. This condition is relevant only for versioned objects. The value of the field must be a nonnegative integer. */
					daysSinceNoncurrentTime?: number;
					/** Relevant only for versioned objects. If the value is true, this condition matches live objects; if the value is false, it matches archived objects. */
					isLive?: boolean;
					/** A regular expression that satisfies the RE2 syntax. This condition is satisfied when the name of the object matches the RE2 pattern. */
					matchesPattern?: string;
					/** List of object name prefixes. This condition will be satisfied when at least one of the prefixes exactly matches the beginning of the object name. */
					matchesPrefix?: Array<string>;
					/** List of object name suffixes. This condition will be satisfied when at least one of the suffixes exactly matches the end of the object name. */
					matchesSuffix?: Array<string>;
					/** Objects having any of the storage classes specified by this condition will be matched. Values include MULTI_REGIONAL, REGIONAL, NEARLINE, COLDLINE, ARCHIVE, STANDARD, and DURABLE_REDUCED_AVAILABILITY. */
					matchesStorageClass?: Array<string>;
					/** A date in RFC 3339 format with only the date part (for instance, "2013-01-15"). This condition is satisfied when the noncurrent time on an object is before this date in UTC. This condition is relevant only for versioned objects. */
					noncurrentTimeBefore?: string;
					/** Objects having a size greater than this value in bytes will be matched. */
					sizeAboveBytes?: string | number;
					/** Objects having a size less than this value in bytes will be matched. */
					sizeBelowBytes?: string | number;
					/** Relevant only for versioned objects. If the value is N, this condition is satisfied when there are at least N versions (including the live version) newer than this version of the object. */
					numNewerVersions?: number;
				};
			}>;
		};
		/** The bucket's Autoclass configuration. */
		autoclass?: {
			/** Whether or not Autoclass is enabled on this bucket */
			enabled?: boolean;
			/** A date and time in RFC 3339 format representing the instant at which "enabled" was last toggled. */
			toggleTime?: string;
			/** The storage class that objects in the bucket eventually transition to if they are not read for a certain length of time. Valid values are NEARLINE and ARCHIVE. */
			terminalStorageClass?: string;
			/** A date and time in RFC 3339 format representing the time of the most recent update to "terminalStorageClass". */
			terminalStorageClassUpdateTime?: string;
		};
		/** The location of the bucket. Object data for objects in the bucket resides in physical storage within this region. Defaults to US. See the [Developer's Guide](https://cloud.google.com/storage/docs/locations) for the authoritative list. */
		location?: string;
		/** The type of the bucket location. */
		locationType?: string;
		/** The bucket's logging configuration, which defines the destination bucket and optional name prefix for the current bucket's logs. */
		logging?: {
			/** The destination bucket where the current bucket's logs should be placed. */
			logBucket?: string;
			/** A prefix for log object names. */
			logObjectPrefix?: string;
		};
		/** The generation of this bucket. */
		generation?: string | number;
		/** The metadata generation of this bucket. */
		metageneration?: string | number;
		/** The name of the bucket. */
		name?: string;
		/** The owner of the bucket. This is always the project team's owner group. */
		owner?: {
			/** The entity, in the form project-owner-projectId. */
			entity?: string;
			/** The ID for the entity. */
			entityId?: string;
		};
		/** The project number of the project the bucket belongs to. */
		projectNumber?: string | number;
		/** The bucket's retention policy. The retention policy enforces a minimum retention time for all objects contained in the bucket, based on their creation time. Any attempt to overwrite or delete objects younger than the retention period will result in a PERMISSION_DENIED error. */
		retentionPolicy?: {
			/** Server-determined value that indicates the time from which policy was enforced and effective. This value is in RFC 3339 format. */
			effectiveTime?: string;
			/** Once locked, an object retention policy cannot be modified. */
			isLocked?: boolean;
			/** The duration in seconds that objects need to be retained. Retention duration must be greater than zero and less than 100 years. Note that enforcement of retention periods less than a day is not guaranteed. Such periods should only be used for testing purposes. */
			retentionPeriod?: string | number;
		};
		/** The bucket's object retention config. */
		objectRetention?: {
			/** The bucket's object retention mode. Can be Enabled. */
			mode?: string;
		};
		/** The Recovery Point Objective (RPO) of this bucket. Set to ASYNC_TURBO to turn on Turbo Replication on a bucket. */
		rpo?: string;
		/** The URI of this bucket. */
		selfLink?: string;
		/** The bucket's soft delete policy, which defines the period of time that soft-deleted objects will be retained, and cannot be permanently deleted. */
		softDeletePolicy?: {
			/** The duration in seconds that soft-deleted objects in the bucket will be retained and cannot be permanently deleted. */
			retentionDurationSeconds?: string | number;
			/** Server-determined value that indicates the time from which the policy, or one with a greater retention, was effective. This value is in RFC 3339 format. */
			effectiveTime?: string;
			/** The bucket's hard delete pause configuration. If set, soft-deleted objects in the bucket will not be permanently deleted until the hard delete pause is disabled. */
			hardDeletePause?: {
				/** Whether hard deletions are paused. */
				enabled?: boolean;
				/** Server-determined value that indicates the time from which the hard delete pause became effective. This value is in RFC 3339 format. */
				effectiveTime?: string;
			};
		};
		/** The bucket's default storage class, used whenever no storageClass is specified for a newly-created object. This defines how objects in the bucket are stored and determines the SLA and the cost of storage. */
		storageClass?: string;
		/** The creation time of the bucket in RFC 3339 format. */
		timeCreated?: string;
		/** The modification time of the bucket in RFC 3339 format. */
		updated?: string;
		/** The soft delete time of the bucket in RFC 3339 format. */
		softDeleteTime?: string;
		/** The hard delete time of the bucket in RFC 3339 format. */
		hardDeleteTime?: string;
		/** The bucket's versioning configuration. */
		versioning?: {
			/** While set to true, versioning is fully enabled for this bucket. */
			enabled?: boolean;
		};
		/** The bucket's website configuration, controlling how the service behaves when accessing bucket contents as a web site. See the [Static Website Examples](https://cloud.google.com/storage/docs/static-website) for more information. */
		website?: {
			/** If the requested object path is missing, the service will ensure the path has a trailing '/', append this suffix, and attempt to retrieve the resulting object. This allows the creation of index.html objects to represent directory pages. */
			mainPageSuffix?: string;
			/** If the requested object path is missing, and any mainPageSuffix object is missing, if applicable, the service will return the named object from this bucket as the content for a 404 Not Found result. */
			notFoundPage?: string;
		};
		/** Reserved for future use. */
		satisfiesPZS?: boolean;
		/** Reserved for future use. */
		satisfiesPZI?: boolean;
	};
	'storage.buckets.list': {
		/** Maximum number of buckets to return in a single response. The service will use this parameter or 1,000 items, whichever is smaller. */
		maxResults?: number;
		/** A previously-returned page token representing part of the larger set of results to view. */
		pageToken?: string;
		/** Filter results to buckets whose names begin with this prefix. */
		prefix?: string;
		/** If true, only soft-deleted bucket versions will be returned. The default is false. For more information, see [Soft Delete](https://cloud.google.com/storage/docs/soft-delete). */
		softDeleted?: boolean;
		/** A valid API project identifier. */
		project: string;
		/** Set of properties to return. Defaults to noAcl. */
		projection?: 'full' | 'noAcl';
		/** The project to be billed for this request. */
		userProject?: string;
		/** If true, return a list of bucket resource names for buckets that are in unreachable locations. */
		returnPartialSuccess?: boolean;
	};
	'storage.buckets.lockRetentionPolicy': {
		/** Name of a bucket. */
		bucket: string;
		/** Makes the operation conditional on whether bucket's current metageneration matches the given value. */
		ifMetagenerationMatch: string | number;
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
	};
	'storage.buckets.operations.advanceRelocateBucket': {
		/** Name of the bucket to advance the relocate for. */
		bucket: string;
		/** ID of the operation resource. */
		operationId: string;
		/** Specifies the duration after which the relocation will revert to the sync stage if the relocation hasn't succeeded. Optional, if not supplied, a default value of 12h will be used. */
		ttl?: string;
		/** Specifies the time when the relocation will revert to the sync stage if the relocation hasn't succeeded. */
		expireTime?: string;
	};
	'storage.buckets.operations.cancel': {
		/** The parent bucket of the operation resource. */
		bucket: string;
		/** The ID of the operation resource. */
		operationId: string;
	};
	'storage.buckets.operations.get': {
		/** The parent bucket of the operation resource. */
		bucket: string;
		/** The ID of the operation resource. */
		operationId: string;
	};
	'storage.buckets.operations.list': {
		/** A filter to narrow down results to a preferred subset. The filtering language is documented in more detail in [AIP-160](https://google.aip.dev/160). */
		filter?: string;
		/** Name of the bucket in which to look for operations. */
		bucket: string;
		/** Maximum number of items to return in a single page of responses. Fewer total results may be returned than requested. The service uses this parameter or 100 items, whichever is smaller. */
		pageSize?: number;
		/** A previously-returned page token representing part of the larger set of results to view. */
		pageToken?: string;
	};
	'storage.buckets.patch': {
		/** Name of a bucket. */
		bucket: string;
		/** Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value. */
		ifMetagenerationMatch?: string | number;
		/** Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value. */
		ifMetagenerationNotMatch?: string | number;
		/** Apply a predefined set of access controls to this bucket. */
		predefinedAcl?:
			| 'authenticatedRead'
			| 'private'
			| 'projectPrivate'
			| 'publicRead'
			| 'publicReadWrite';
		/** Apply a predefined set of default object access controls to this bucket. */
		predefinedDefaultObjectAcl?:
			| 'authenticatedRead'
			| 'bucketOwnerFullControl'
			| 'bucketOwnerRead'
			| 'private'
			| 'projectPrivate'
			| 'publicRead';
		/** Set of properties to return. Defaults to full. */
		projection?: 'full' | 'noAcl';
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
		/** Access controls on the bucket. */
		acl?: Array<FirebaseBucketAccessControlInput>;
		/** The bucket's billing configuration. */
		billing?: {
			/** When set to true, Requester Pays is enabled for this bucket. */
			requesterPays?: boolean;
		};
		/** The bucket's Cross-Origin Resource Sharing (CORS) configuration. */
		cors?: Array<{
			/** The value, in seconds, to return in the Access-Control-Max-Age header used in preflight responses. */
			maxAgeSeconds?: number;
			/** The list of HTTP methods on which to include CORS response headers, (GET, OPTIONS, POST, etc) Note: "*" is permitted in the list of methods, and means "any method". */
			method?: Array<string>;
			/** The list of Origins eligible to receive CORS response headers. Note: "*" is permitted in the list of origins, and means "any Origin". */
			origin?: Array<string>;
			/** The list of HTTP headers other than the simple response headers to give permission for the user-agent to share across domains. */
			responseHeader?: Array<string>;
		}>;
		/** The bucket's custom placement configuration for Custom Dual Regions. */
		customPlacementConfig?: {
			/** The list of regional locations in which data is placed. */
			dataLocations?: Array<string>;
		};
		/** The default value for event-based hold on newly created objects in this bucket. Event-based hold is a way to retain objects indefinitely until an event occurs, signified by the hold's release. After being released, such objects will be subject to bucket-level retention (if any). */
		defaultEventBasedHold?: boolean;
		/** Default access controls to apply to new objects when no ACL is provided. */
		defaultObjectAcl?: Array<FirebaseObjectAccessControlInput>;
		/** Encryption configuration for a bucket. */
		encryption?: {
			/** A Cloud KMS key that will be used to encrypt objects inserted into this bucket, if no encryption method is specified. */
			defaultKmsKeyName?: string;
			/** If set, the new objects created in this bucket must comply with this enforcement config. Changing this has no effect on existing objects; it applies to new objects only. If omitted, the new objects are allowed to be encrypted with Google Managed Encryption type by default. */
			googleManagedEncryptionEnforcementConfig?: {
				/** Restriction mode for Google-Managed Encryption Keys. Defaults to NotRestricted. */
				restrictionMode?: 'NotRestricted' | 'FullyRestricted';
				/** Server-determined value that indicates the time from which configuration was enforced and effective. This value is in RFC 3339 format. */
				effectiveTime?: string;
			};
			/** If set, the new objects created in this bucket must comply with this enforcement config. Changing this has no effect on existing objects; it applies to new objects only. If omitted, the new objects are allowed to be encrypted with Customer Managed Encryption type by default. */
			customerManagedEncryptionEnforcementConfig?: {
				/** Restriction mode for Customer-Managed Encryption Keys. Defaults to NotRestricted. */
				restrictionMode?: 'NotRestricted' | 'FullyRestricted';
				/** Server-determined value that indicates the time from which configuration was enforced and effective. This value is in RFC 3339 format. */
				effectiveTime?: string;
			};
			/** If set, the new objects created in this bucket must comply with this enforcement config. Changing this has no effect on existing objects; it applies to new objects only. If omitted, the new objects are allowed to be encrypted with Customer Supplied Encryption type by default. */
			customerSuppliedEncryptionEnforcementConfig?: {
				/** Restriction mode for Customer-Supplied Encryption Keys. Defaults to NotRestricted. */
				restrictionMode?: 'NotRestricted' | 'FullyRestricted';
				/** Server-determined value that indicates the time from which configuration was enforced and effective. This value is in RFC 3339 format. */
				effectiveTime?: string;
			};
		};
		/** HTTP 1.1 Entity tag for the bucket. */
		etag?: string;
		/** The bucket's hierarchical namespace configuration. */
		hierarchicalNamespace?: {
			/** When set to true, hierarchical namespace is enabled for this bucket. */
			enabled?: boolean;
		};
		/** The bucket's IAM configuration. */
		iamConfiguration?: {
			/** The bucket's uniform bucket-level access configuration. The feature was formerly known as Bucket Policy Only. For backward compatibility, this field will be populated with identical information as the uniformBucketLevelAccess field. */
			bucketPolicyOnly?: {
				/** If set, access is controlled only by bucket-level or above IAM policies. */
				enabled?: boolean;
				/** The deadline for changing iamConfiguration.bucketPolicyOnly.enabled from true to false in RFC 3339 format. iamConfiguration.bucketPolicyOnly.enabled may be changed from true to false until the locked time, after which the field is immutable. */
				lockedTime?: string;
			};
			/** The bucket's uniform bucket-level access configuration. */
			uniformBucketLevelAccess?: {
				/** If set, access is controlled only by bucket-level or above IAM policies. */
				enabled?: boolean;
				/** The deadline for changing iamConfiguration.uniformBucketLevelAccess.enabled from true to false in RFC 3339 format. iamConfiguration.uniformBucketLevelAccess.enabled may be changed from true to false until the locked time, after which the field is immutable. */
				lockedTime?: string;
			};
			/** The bucket's Public Access Prevention configuration. Currently, 'inherited' and 'enforced' are supported. */
			publicAccessPrevention?: string;
		};
		/** The ID of the bucket. For buckets, the id and name properties are the same. */
		id?: string;
		/** The bucket's IP filter configuration. Specifies the network sources that are allowed to access the operations on the bucket, as well as its underlying objects. Only enforced when the mode is set to 'Enabled'. */
		ipFilter?: {
			/** The mode of the IP filter. Valid values are 'Enabled' and 'Disabled'. */
			mode?: string;
			/** The public network source of the bucket's IP filter. */
			publicNetworkSource?: {
				/** The list of public IPv4, IPv6 cidr ranges that are allowed to access the bucket. */
				allowedIpCidrRanges?: Array<string>;
			};
			/** The list of [VPC network](https://cloud.google.com/vpc/docs/vpc) sources of the bucket's IP filter. */
			vpcNetworkSources?: Array<{
				/** Name of the network. Format: projects/{PROJECT_ID}/global/networks/{NETWORK_NAME} */
				network?: string;
				/** The list of IPv4, IPv6 cidr ranges subnetworks that are allowed to access the bucket. */
				allowedIpCidrRanges?: Array<string>;
			}>;
			/** Whether to allow cross-org VPCs in the bucket's IP filter configuration. */
			allowCrossOrgVpcs?: boolean;
			/** Whether to allow all service agents to access the bucket regardless of the IP filter configuration. */
			allowAllServiceAgentAccess?: boolean;
		};
		/** The kind of item this is. For buckets, this is always storage#bucket. */
		kind?: string;
		/** User-provided labels, in key/value pairs. */
		labels?: Record<string, string>;
		/** The bucket's lifecycle configuration. See [Lifecycle Management](https://cloud.google.com/storage/docs/lifecycle) for more information. */
		lifecycle?: {
			/** A lifecycle management rule, which is made of an action to take and the condition(s) under which the action will be taken. */
			rule?: Array<{
				/** The action to take. */
				action?: {
					/** Target storage class. Required iff the type of the action is SetStorageClass. */
					storageClass?: string;
					/** Type of the action. Currently, only Delete, SetStorageClass, and AbortIncompleteMultipartUpload are supported. */
					type?: string;
				};
				/** The condition(s) under which the action will be taken. */
				condition?: {
					/** Age of an object (in days). This condition is satisfied when an object reaches the specified age. */
					age?: number;
					/** A date in RFC 3339 format with only the date part (for instance, "2013-01-15"). This condition is satisfied when an object is created before midnight of the specified date in UTC. */
					createdBefore?: string;
					/** A date in RFC 3339 format with only the date part (for instance, "2013-01-15"). This condition is satisfied when the custom time on an object is before this date in UTC. */
					customTimeBefore?: string;
					/** Number of days elapsed since the user-specified timestamp set on an object. The condition is satisfied if the days elapsed is at least this number. If no custom timestamp is specified on an object, the condition does not apply. */
					daysSinceCustomTime?: number;
					/** Number of days elapsed since the noncurrent timestamp of an object. The condition is satisfied if the days elapsed is at least this number. This condition is relevant only for versioned objects. The value of the field must be a nonnegative integer. */
					daysSinceNoncurrentTime?: number;
					/** Relevant only for versioned objects. If the value is true, this condition matches live objects; if the value is false, it matches archived objects. */
					isLive?: boolean;
					/** A regular expression that satisfies the RE2 syntax. This condition is satisfied when the name of the object matches the RE2 pattern. */
					matchesPattern?: string;
					/** List of object name prefixes. This condition will be satisfied when at least one of the prefixes exactly matches the beginning of the object name. */
					matchesPrefix?: Array<string>;
					/** List of object name suffixes. This condition will be satisfied when at least one of the suffixes exactly matches the end of the object name. */
					matchesSuffix?: Array<string>;
					/** Objects having any of the storage classes specified by this condition will be matched. Values include MULTI_REGIONAL, REGIONAL, NEARLINE, COLDLINE, ARCHIVE, STANDARD, and DURABLE_REDUCED_AVAILABILITY. */
					matchesStorageClass?: Array<string>;
					/** A date in RFC 3339 format with only the date part (for instance, "2013-01-15"). This condition is satisfied when the noncurrent time on an object is before this date in UTC. This condition is relevant only for versioned objects. */
					noncurrentTimeBefore?: string;
					/** Objects having a size greater than this value in bytes will be matched. */
					sizeAboveBytes?: string | number;
					/** Objects having a size less than this value in bytes will be matched. */
					sizeBelowBytes?: string | number;
					/** Relevant only for versioned objects. If the value is N, this condition is satisfied when there are at least N versions (including the live version) newer than this version of the object. */
					numNewerVersions?: number;
				};
			}>;
		};
		/** The bucket's Autoclass configuration. */
		autoclass?: {
			/** Whether or not Autoclass is enabled on this bucket */
			enabled?: boolean;
			/** A date and time in RFC 3339 format representing the instant at which "enabled" was last toggled. */
			toggleTime?: string;
			/** The storage class that objects in the bucket eventually transition to if they are not read for a certain length of time. Valid values are NEARLINE and ARCHIVE. */
			terminalStorageClass?: string;
			/** A date and time in RFC 3339 format representing the time of the most recent update to "terminalStorageClass". */
			terminalStorageClassUpdateTime?: string;
		};
		/** The location of the bucket. Object data for objects in the bucket resides in physical storage within this region. Defaults to US. See the [Developer's Guide](https://cloud.google.com/storage/docs/locations) for the authoritative list. */
		location?: string;
		/** The type of the bucket location. */
		locationType?: string;
		/** The bucket's logging configuration, which defines the destination bucket and optional name prefix for the current bucket's logs. */
		logging?: {
			/** The destination bucket where the current bucket's logs should be placed. */
			logBucket?: string;
			/** A prefix for log object names. */
			logObjectPrefix?: string;
		};
		/** The generation of this bucket. */
		generation?: string | number;
		/** The metadata generation of this bucket. */
		metageneration?: string | number;
		/** The name of the bucket. */
		name?: string;
		/** The owner of the bucket. This is always the project team's owner group. */
		owner?: {
			/** The entity, in the form project-owner-projectId. */
			entity?: string;
			/** The ID for the entity. */
			entityId?: string;
		};
		/** The project number of the project the bucket belongs to. */
		projectNumber?: string | number;
		/** The bucket's retention policy. The retention policy enforces a minimum retention time for all objects contained in the bucket, based on their creation time. Any attempt to overwrite or delete objects younger than the retention period will result in a PERMISSION_DENIED error. */
		retentionPolicy?: {
			/** Server-determined value that indicates the time from which policy was enforced and effective. This value is in RFC 3339 format. */
			effectiveTime?: string;
			/** Once locked, an object retention policy cannot be modified. */
			isLocked?: boolean;
			/** The duration in seconds that objects need to be retained. Retention duration must be greater than zero and less than 100 years. Note that enforcement of retention periods less than a day is not guaranteed. Such periods should only be used for testing purposes. */
			retentionPeriod?: string | number;
		};
		/** The bucket's object retention config. */
		objectRetention?: {
			/** The bucket's object retention mode. Can be Enabled. */
			mode?: string;
		};
		/** The Recovery Point Objective (RPO) of this bucket. Set to ASYNC_TURBO to turn on Turbo Replication on a bucket. */
		rpo?: string;
		/** The URI of this bucket. */
		selfLink?: string;
		/** The bucket's soft delete policy, which defines the period of time that soft-deleted objects will be retained, and cannot be permanently deleted. */
		softDeletePolicy?: {
			/** The duration in seconds that soft-deleted objects in the bucket will be retained and cannot be permanently deleted. */
			retentionDurationSeconds?: string | number;
			/** Server-determined value that indicates the time from which the policy, or one with a greater retention, was effective. This value is in RFC 3339 format. */
			effectiveTime?: string;
			/** The bucket's hard delete pause configuration. If set, soft-deleted objects in the bucket will not be permanently deleted until the hard delete pause is disabled. */
			hardDeletePause?: {
				/** Whether hard deletions are paused. */
				enabled?: boolean;
				/** Server-determined value that indicates the time from which the hard delete pause became effective. This value is in RFC 3339 format. */
				effectiveTime?: string;
			};
		};
		/** The bucket's default storage class, used whenever no storageClass is specified for a newly-created object. This defines how objects in the bucket are stored and determines the SLA and the cost of storage. */
		storageClass?: string;
		/** The creation time of the bucket in RFC 3339 format. */
		timeCreated?: string;
		/** The modification time of the bucket in RFC 3339 format. */
		updated?: string;
		/** The soft delete time of the bucket in RFC 3339 format. */
		softDeleteTime?: string;
		/** The hard delete time of the bucket in RFC 3339 format. */
		hardDeleteTime?: string;
		/** The bucket's versioning configuration. */
		versioning?: {
			/** While set to true, versioning is fully enabled for this bucket. */
			enabled?: boolean;
		};
		/** The bucket's website configuration, controlling how the service behaves when accessing bucket contents as a web site. See the [Static Website Examples](https://cloud.google.com/storage/docs/static-website) for more information. */
		website?: {
			/** If the requested object path is missing, the service will ensure the path has a trailing '/', append this suffix, and attempt to retrieve the resulting object. This allows the creation of index.html objects to represent directory pages. */
			mainPageSuffix?: string;
			/** If the requested object path is missing, and any mainPageSuffix object is missing, if applicable, the service will return the named object from this bucket as the content for a 404 Not Found result. */
			notFoundPage?: string;
		};
		/** Reserved for future use. */
		satisfiesPZS?: boolean;
		/** Reserved for future use. */
		satisfiesPZI?: boolean;
	};
	'storage.buckets.relocate': {
		/** Name of the bucket to be moved. */
		bucket: string;
		/** The new location the bucket will be relocated to. */
		destinationLocation?: string;
		/** The bucket's new custom placement configuration if relocating to a Custom Dual Region. */
		destinationCustomPlacementConfig?: {
			/** The list of regional locations in which data is placed. */
			dataLocations?: Array<string>;
		};
		/** If true, validate the operation, but do not actually relocate the bucket. */
		validateOnly?: boolean;
		/** Resource name of a Cloud KMS key, of the form projects/my-project/locations/global/keyRings/my-kr/cryptoKeys/my-key. If set, is used to encrypt all objects in the destination bucket. */
		destinationKmsKeyName?: string;
	};
	'storage.buckets.restore': {
		/** Name of a bucket. */
		bucket: string;
		/** Generation of a bucket. */
		generation: string | number;
		/** Set of properties to return. Defaults to full. */
		projection?: 'full' | 'noAcl';
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
	};
	'storage.buckets.setIamPolicy': {
		/** Name of a bucket. */
		bucket: string;
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
		/** An association between a role, which comes with a set of permissions, and members who may assume that role. */
		bindings?: Array<{
			/** The condition that is associated with this binding. NOTE: an unsatisfied condition will not allow user access via current binding. Different bindings, including their conditions, are examined independently. */
			condition?: FirebaseExprInput;
			/** A collection of identifiers for members who may assume the provided role. Recognized identifiers are as follows: - allUsers - A special identifier that represents anyone on the internet; with or without a Google account. */
			members?: Array<string>;
			/** The role to which members belong. Two types of roles are supported: new IAM roles, which grant permissions that do not map directly to those provided by ACLs, and legacy IAM roles, which do map directly to ACL permissions. All roles are of the format roles/storage.specificRole. */
			role?: string;
		}>;
		/** HTTP 1.1 Entity tag for the policy. (base64) */
		etag?: string;
		/** The kind of item this is. For policies, this is always storage#policy. This field is ignored on input. */
		kind?: string;
		/** The ID of the resource to which this policy belongs. Will be of the form projects/_/buckets/bucket for buckets, projects/_/buckets/bucket/objects/object for objects, and projects/_/buckets/bucket/managedFolders/managedFolder. */
		resourceId?: string;
		/** The IAM policy format version. */
		version?: number;
	};
	'storage.buckets.testIamPermissions': {
		/** Name of a bucket. */
		bucket: string;
		/** Permissions to test. */
		permissions: Array<string>;
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
	};
	'storage.buckets.update': {
		/** Name of a bucket. */
		bucket: string;
		/** Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value. */
		ifMetagenerationMatch?: string | number;
		/** Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value. */
		ifMetagenerationNotMatch?: string | number;
		/** Apply a predefined set of access controls to this bucket. */
		predefinedAcl?:
			| 'authenticatedRead'
			| 'private'
			| 'projectPrivate'
			| 'publicRead'
			| 'publicReadWrite';
		/** Apply a predefined set of default object access controls to this bucket. */
		predefinedDefaultObjectAcl?:
			| 'authenticatedRead'
			| 'bucketOwnerFullControl'
			| 'bucketOwnerRead'
			| 'private'
			| 'projectPrivate'
			| 'publicRead';
		/** Set of properties to return. Defaults to full. */
		projection?: 'full' | 'noAcl';
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
		/** Access controls on the bucket. */
		acl?: Array<FirebaseBucketAccessControlInput>;
		/** The bucket's billing configuration. */
		billing?: {
			/** When set to true, Requester Pays is enabled for this bucket. */
			requesterPays?: boolean;
		};
		/** The bucket's Cross-Origin Resource Sharing (CORS) configuration. */
		cors?: Array<{
			/** The value, in seconds, to return in the Access-Control-Max-Age header used in preflight responses. */
			maxAgeSeconds?: number;
			/** The list of HTTP methods on which to include CORS response headers, (GET, OPTIONS, POST, etc) Note: "*" is permitted in the list of methods, and means "any method". */
			method?: Array<string>;
			/** The list of Origins eligible to receive CORS response headers. Note: "*" is permitted in the list of origins, and means "any Origin". */
			origin?: Array<string>;
			/** The list of HTTP headers other than the simple response headers to give permission for the user-agent to share across domains. */
			responseHeader?: Array<string>;
		}>;
		/** The bucket's custom placement configuration for Custom Dual Regions. */
		customPlacementConfig?: {
			/** The list of regional locations in which data is placed. */
			dataLocations?: Array<string>;
		};
		/** The default value for event-based hold on newly created objects in this bucket. Event-based hold is a way to retain objects indefinitely until an event occurs, signified by the hold's release. After being released, such objects will be subject to bucket-level retention (if any). */
		defaultEventBasedHold?: boolean;
		/** Default access controls to apply to new objects when no ACL is provided. */
		defaultObjectAcl?: Array<FirebaseObjectAccessControlInput>;
		/** Encryption configuration for a bucket. */
		encryption?: {
			/** A Cloud KMS key that will be used to encrypt objects inserted into this bucket, if no encryption method is specified. */
			defaultKmsKeyName?: string;
			/** If set, the new objects created in this bucket must comply with this enforcement config. Changing this has no effect on existing objects; it applies to new objects only. If omitted, the new objects are allowed to be encrypted with Google Managed Encryption type by default. */
			googleManagedEncryptionEnforcementConfig?: {
				/** Restriction mode for Google-Managed Encryption Keys. Defaults to NotRestricted. */
				restrictionMode?: 'NotRestricted' | 'FullyRestricted';
				/** Server-determined value that indicates the time from which configuration was enforced and effective. This value is in RFC 3339 format. */
				effectiveTime?: string;
			};
			/** If set, the new objects created in this bucket must comply with this enforcement config. Changing this has no effect on existing objects; it applies to new objects only. If omitted, the new objects are allowed to be encrypted with Customer Managed Encryption type by default. */
			customerManagedEncryptionEnforcementConfig?: {
				/** Restriction mode for Customer-Managed Encryption Keys. Defaults to NotRestricted. */
				restrictionMode?: 'NotRestricted' | 'FullyRestricted';
				/** Server-determined value that indicates the time from which configuration was enforced and effective. This value is in RFC 3339 format. */
				effectiveTime?: string;
			};
			/** If set, the new objects created in this bucket must comply with this enforcement config. Changing this has no effect on existing objects; it applies to new objects only. If omitted, the new objects are allowed to be encrypted with Customer Supplied Encryption type by default. */
			customerSuppliedEncryptionEnforcementConfig?: {
				/** Restriction mode for Customer-Supplied Encryption Keys. Defaults to NotRestricted. */
				restrictionMode?: 'NotRestricted' | 'FullyRestricted';
				/** Server-determined value that indicates the time from which configuration was enforced and effective. This value is in RFC 3339 format. */
				effectiveTime?: string;
			};
		};
		/** HTTP 1.1 Entity tag for the bucket. */
		etag?: string;
		/** The bucket's hierarchical namespace configuration. */
		hierarchicalNamespace?: {
			/** When set to true, hierarchical namespace is enabled for this bucket. */
			enabled?: boolean;
		};
		/** The bucket's IAM configuration. */
		iamConfiguration?: {
			/** The bucket's uniform bucket-level access configuration. The feature was formerly known as Bucket Policy Only. For backward compatibility, this field will be populated with identical information as the uniformBucketLevelAccess field. */
			bucketPolicyOnly?: {
				/** If set, access is controlled only by bucket-level or above IAM policies. */
				enabled?: boolean;
				/** The deadline for changing iamConfiguration.bucketPolicyOnly.enabled from true to false in RFC 3339 format. iamConfiguration.bucketPolicyOnly.enabled may be changed from true to false until the locked time, after which the field is immutable. */
				lockedTime?: string;
			};
			/** The bucket's uniform bucket-level access configuration. */
			uniformBucketLevelAccess?: {
				/** If set, access is controlled only by bucket-level or above IAM policies. */
				enabled?: boolean;
				/** The deadline for changing iamConfiguration.uniformBucketLevelAccess.enabled from true to false in RFC 3339 format. iamConfiguration.uniformBucketLevelAccess.enabled may be changed from true to false until the locked time, after which the field is immutable. */
				lockedTime?: string;
			};
			/** The bucket's Public Access Prevention configuration. Currently, 'inherited' and 'enforced' are supported. */
			publicAccessPrevention?: string;
		};
		/** The ID of the bucket. For buckets, the id and name properties are the same. */
		id?: string;
		/** The bucket's IP filter configuration. Specifies the network sources that are allowed to access the operations on the bucket, as well as its underlying objects. Only enforced when the mode is set to 'Enabled'. */
		ipFilter?: {
			/** The mode of the IP filter. Valid values are 'Enabled' and 'Disabled'. */
			mode?: string;
			/** The public network source of the bucket's IP filter. */
			publicNetworkSource?: {
				/** The list of public IPv4, IPv6 cidr ranges that are allowed to access the bucket. */
				allowedIpCidrRanges?: Array<string>;
			};
			/** The list of [VPC network](https://cloud.google.com/vpc/docs/vpc) sources of the bucket's IP filter. */
			vpcNetworkSources?: Array<{
				/** Name of the network. Format: projects/{PROJECT_ID}/global/networks/{NETWORK_NAME} */
				network?: string;
				/** The list of IPv4, IPv6 cidr ranges subnetworks that are allowed to access the bucket. */
				allowedIpCidrRanges?: Array<string>;
			}>;
			/** Whether to allow cross-org VPCs in the bucket's IP filter configuration. */
			allowCrossOrgVpcs?: boolean;
			/** Whether to allow all service agents to access the bucket regardless of the IP filter configuration. */
			allowAllServiceAgentAccess?: boolean;
		};
		/** The kind of item this is. For buckets, this is always storage#bucket. */
		kind?: string;
		/** User-provided labels, in key/value pairs. */
		labels?: Record<string, string>;
		/** The bucket's lifecycle configuration. See [Lifecycle Management](https://cloud.google.com/storage/docs/lifecycle) for more information. */
		lifecycle?: {
			/** A lifecycle management rule, which is made of an action to take and the condition(s) under which the action will be taken. */
			rule?: Array<{
				/** The action to take. */
				action?: {
					/** Target storage class. Required iff the type of the action is SetStorageClass. */
					storageClass?: string;
					/** Type of the action. Currently, only Delete, SetStorageClass, and AbortIncompleteMultipartUpload are supported. */
					type?: string;
				};
				/** The condition(s) under which the action will be taken. */
				condition?: {
					/** Age of an object (in days). This condition is satisfied when an object reaches the specified age. */
					age?: number;
					/** A date in RFC 3339 format with only the date part (for instance, "2013-01-15"). This condition is satisfied when an object is created before midnight of the specified date in UTC. */
					createdBefore?: string;
					/** A date in RFC 3339 format with only the date part (for instance, "2013-01-15"). This condition is satisfied when the custom time on an object is before this date in UTC. */
					customTimeBefore?: string;
					/** Number of days elapsed since the user-specified timestamp set on an object. The condition is satisfied if the days elapsed is at least this number. If no custom timestamp is specified on an object, the condition does not apply. */
					daysSinceCustomTime?: number;
					/** Number of days elapsed since the noncurrent timestamp of an object. The condition is satisfied if the days elapsed is at least this number. This condition is relevant only for versioned objects. The value of the field must be a nonnegative integer. */
					daysSinceNoncurrentTime?: number;
					/** Relevant only for versioned objects. If the value is true, this condition matches live objects; if the value is false, it matches archived objects. */
					isLive?: boolean;
					/** A regular expression that satisfies the RE2 syntax. This condition is satisfied when the name of the object matches the RE2 pattern. */
					matchesPattern?: string;
					/** List of object name prefixes. This condition will be satisfied when at least one of the prefixes exactly matches the beginning of the object name. */
					matchesPrefix?: Array<string>;
					/** List of object name suffixes. This condition will be satisfied when at least one of the suffixes exactly matches the end of the object name. */
					matchesSuffix?: Array<string>;
					/** Objects having any of the storage classes specified by this condition will be matched. Values include MULTI_REGIONAL, REGIONAL, NEARLINE, COLDLINE, ARCHIVE, STANDARD, and DURABLE_REDUCED_AVAILABILITY. */
					matchesStorageClass?: Array<string>;
					/** A date in RFC 3339 format with only the date part (for instance, "2013-01-15"). This condition is satisfied when the noncurrent time on an object is before this date in UTC. This condition is relevant only for versioned objects. */
					noncurrentTimeBefore?: string;
					/** Objects having a size greater than this value in bytes will be matched. */
					sizeAboveBytes?: string | number;
					/** Objects having a size less than this value in bytes will be matched. */
					sizeBelowBytes?: string | number;
					/** Relevant only for versioned objects. If the value is N, this condition is satisfied when there are at least N versions (including the live version) newer than this version of the object. */
					numNewerVersions?: number;
				};
			}>;
		};
		/** The bucket's Autoclass configuration. */
		autoclass?: {
			/** Whether or not Autoclass is enabled on this bucket */
			enabled?: boolean;
			/** A date and time in RFC 3339 format representing the instant at which "enabled" was last toggled. */
			toggleTime?: string;
			/** The storage class that objects in the bucket eventually transition to if they are not read for a certain length of time. Valid values are NEARLINE and ARCHIVE. */
			terminalStorageClass?: string;
			/** A date and time in RFC 3339 format representing the time of the most recent update to "terminalStorageClass". */
			terminalStorageClassUpdateTime?: string;
		};
		/** The location of the bucket. Object data for objects in the bucket resides in physical storage within this region. Defaults to US. See the [Developer's Guide](https://cloud.google.com/storage/docs/locations) for the authoritative list. */
		location?: string;
		/** The type of the bucket location. */
		locationType?: string;
		/** The bucket's logging configuration, which defines the destination bucket and optional name prefix for the current bucket's logs. */
		logging?: {
			/** The destination bucket where the current bucket's logs should be placed. */
			logBucket?: string;
			/** A prefix for log object names. */
			logObjectPrefix?: string;
		};
		/** The generation of this bucket. */
		generation?: string | number;
		/** The metadata generation of this bucket. */
		metageneration?: string | number;
		/** The name of the bucket. */
		name?: string;
		/** The owner of the bucket. This is always the project team's owner group. */
		owner?: {
			/** The entity, in the form project-owner-projectId. */
			entity?: string;
			/** The ID for the entity. */
			entityId?: string;
		};
		/** The project number of the project the bucket belongs to. */
		projectNumber?: string | number;
		/** The bucket's retention policy. The retention policy enforces a minimum retention time for all objects contained in the bucket, based on their creation time. Any attempt to overwrite or delete objects younger than the retention period will result in a PERMISSION_DENIED error. */
		retentionPolicy?: {
			/** Server-determined value that indicates the time from which policy was enforced and effective. This value is in RFC 3339 format. */
			effectiveTime?: string;
			/** Once locked, an object retention policy cannot be modified. */
			isLocked?: boolean;
			/** The duration in seconds that objects need to be retained. Retention duration must be greater than zero and less than 100 years. Note that enforcement of retention periods less than a day is not guaranteed. Such periods should only be used for testing purposes. */
			retentionPeriod?: string | number;
		};
		/** The bucket's object retention config. */
		objectRetention?: {
			/** The bucket's object retention mode. Can be Enabled. */
			mode?: string;
		};
		/** The Recovery Point Objective (RPO) of this bucket. Set to ASYNC_TURBO to turn on Turbo Replication on a bucket. */
		rpo?: string;
		/** The URI of this bucket. */
		selfLink?: string;
		/** The bucket's soft delete policy, which defines the period of time that soft-deleted objects will be retained, and cannot be permanently deleted. */
		softDeletePolicy?: {
			/** The duration in seconds that soft-deleted objects in the bucket will be retained and cannot be permanently deleted. */
			retentionDurationSeconds?: string | number;
			/** Server-determined value that indicates the time from which the policy, or one with a greater retention, was effective. This value is in RFC 3339 format. */
			effectiveTime?: string;
			/** The bucket's hard delete pause configuration. If set, soft-deleted objects in the bucket will not be permanently deleted until the hard delete pause is disabled. */
			hardDeletePause?: {
				/** Whether hard deletions are paused. */
				enabled?: boolean;
				/** Server-determined value that indicates the time from which the hard delete pause became effective. This value is in RFC 3339 format. */
				effectiveTime?: string;
			};
		};
		/** The bucket's default storage class, used whenever no storageClass is specified for a newly-created object. This defines how objects in the bucket are stored and determines the SLA and the cost of storage. */
		storageClass?: string;
		/** The creation time of the bucket in RFC 3339 format. */
		timeCreated?: string;
		/** The modification time of the bucket in RFC 3339 format. */
		updated?: string;
		/** The soft delete time of the bucket in RFC 3339 format. */
		softDeleteTime?: string;
		/** The hard delete time of the bucket in RFC 3339 format. */
		hardDeleteTime?: string;
		/** The bucket's versioning configuration. */
		versioning?: {
			/** While set to true, versioning is fully enabled for this bucket. */
			enabled?: boolean;
		};
		/** The bucket's website configuration, controlling how the service behaves when accessing bucket contents as a web site. See the [Static Website Examples](https://cloud.google.com/storage/docs/static-website) for more information. */
		website?: {
			/** If the requested object path is missing, the service will ensure the path has a trailing '/', append this suffix, and attempt to retrieve the resulting object. This allows the creation of index.html objects to represent directory pages. */
			mainPageSuffix?: string;
			/** If the requested object path is missing, and any mainPageSuffix object is missing, if applicable, the service will return the named object from this bucket as the content for a 404 Not Found result. */
			notFoundPage?: string;
		};
		/** Reserved for future use. */
		satisfiesPZS?: boolean;
		/** Reserved for future use. */
		satisfiesPZI?: boolean;
	};
	'storage.objects.bulkRestore': {
		/** Name of the bucket in which the object resides. */
		bucket: string;
		/** If false (default), the restore will not overwrite live objects with the same name at the destination. This means some deleted objects may be skipped. If true, live objects will be overwritten resulting in a noncurrent object (if versioning is enabled). */
		allowOverwrite?: boolean;
		/** Restores only the objects that were soft-deleted after this time. */
		softDeletedAfterTime?: string;
		/** Restores only the objects that were soft-deleted before this time. */
		softDeletedBeforeTime?: string;
		/** Restores only the objects matching any of the specified glob(s). If this parameter is not specified, all objects will be restored within the specified time range. */
		matchGlobs?: Array<string>;
		/** If true, copies the source object's ACL; otherwise, uses the bucket's default object ACL. The default is false. */
		copySourceAcl?: boolean;
		/** Restores only the objects that were created after this time. */
		createdAfterTime?: string;
		/** Restores only the objects that were created before this time. */
		createdBeforeTime?: string;
	};
	'storage.objects.compose': {
		/** Name of the bucket containing the source objects. The destination object is stored in this bucket. */
		destinationBucket: string;
		/** Name of the new object. For information about how to URL encode object names to be path safe, see [Encoding URI Path Parts](https://cloud.google.com/storage/docs/request-endpoints#encoding). */
		destinationObject: string;
		/** Apply a predefined set of access controls to the destination object. */
		destinationPredefinedAcl?:
			| 'authenticatedRead'
			| 'bucketOwnerFullControl'
			| 'bucketOwnerRead'
			| 'private'
			| 'projectPrivate'
			| 'publicRead';
		/** Specifies which object context groups to drop from the source object(s) during a compose operation. The accepted value is 'custom'. Destination contexts behave as follows: - When request body contexts are provided, they override all source contexts. */
		dropContextGroups?: Array<string>;
		/** Makes the operation conditional on whether the object's current generation matches the given value. Setting to 0 makes the operation succeed only if there are no live versions of the object. */
		ifGenerationMatch?: string | number;
		/** Makes the operation conditional on whether the object's current metageneration matches the given value. */
		ifMetagenerationMatch?: string | number;
		/** Resource name of the Cloud KMS key, of the form projects/my-project/locations/global/keyRings/my-kr/cryptoKeys/my-key, that will be used to encrypt the object. Overrides the object metadata's kms_key_name value, if any. */
		kmsKeyName?: string;
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
		/** Properties of the resulting object. */
		destination?: FirebaseObjectInput;
		/** The kind of item this is. */
		kind?: string;
		/** The list of source objects that will be concatenated into a single object. */
		sourceObjects?: Array<{
			/** The generation of this object to use as the source. */
			generation?: string | number;
			/** The source object's name. All source objects must reside in the same bucket. */
			name?: string;
			/** Conditions that must be met for this operation to execute. */
			objectPreconditions?: {
				/** Only perform the composition if the generation of the source object that would be used matches this value. If this value and a generation are both specified, they must be the same value or the call will fail. */
				ifGenerationMatch?: string | number;
			};
		}>;
		/** If true, the source objects will be deleted. */
		deleteSourceObjects?: boolean;
	};
	'storage.objects.copy': {
		/** Name of the bucket in which to store the new object. Overrides the provided object metadata's bucket value, if any.For information about how to URL encode object names to be path safe, see [Encoding URI Path Parts](https://cloud.google.com/storage/docs/request-endpoints#encoding). */
		destinationBucket: string;
		/** Resource name of the Cloud KMS key, of the form projects/my-project/locations/global/keyRings/my-kr/cryptoKeys/my-key, that will be used to encrypt the object. Overrides the object metadata's kms_key_name value, if any. */
		destinationKmsKeyName?: string;
		/** Name of the new object. Required when the object metadata is not otherwise provided. Overrides the object metadata's name value, if any. */
		destinationObject: string;
		/** Apply a predefined set of access controls to the destination object. */
		destinationPredefinedAcl?:
			| 'authenticatedRead'
			| 'bucketOwnerFullControl'
			| 'bucketOwnerRead'
			| 'private'
			| 'projectPrivate'
			| 'publicRead';
		/** Makes the operation conditional on whether the destination object's current generation matches the given value. Setting to 0 makes the operation succeed only if there are no live versions of the object. */
		ifGenerationMatch?: string | number;
		/** Makes the operation conditional on whether the destination object's current generation does not match the given value. If no live object exists, the precondition fails. Setting to 0 makes the operation succeed only if there is a live version of the object. */
		ifGenerationNotMatch?: string | number;
		/** Makes the operation conditional on whether the destination object's current metageneration matches the given value. */
		ifMetagenerationMatch?: string | number;
		/** Makes the operation conditional on whether the destination object's current metageneration does not match the given value. */
		ifMetagenerationNotMatch?: string | number;
		/** Makes the operation conditional on whether the source object's current generation matches the given value. */
		ifSourceGenerationMatch?: string | number;
		/** Makes the operation conditional on whether the source object's current generation does not match the given value. */
		ifSourceGenerationNotMatch?: string | number;
		/** Makes the operation conditional on whether the source object's current metageneration matches the given value. */
		ifSourceMetagenerationMatch?: string | number;
		/** Makes the operation conditional on whether the source object's current metageneration does not match the given value. */
		ifSourceMetagenerationNotMatch?: string | number;
		/** Set of properties to return. Defaults to noAcl, unless the object resource specifies the acl property, when it defaults to full. */
		projection?: 'full' | 'noAcl';
		/** Name of the bucket in which to find the source object. */
		sourceBucket: string;
		/** If present, selects a specific revision of the source object (as opposed to the latest version, the default). */
		sourceGeneration?: string | number;
		/** Name of the source object. For information about how to URL encode object names to be path safe, see [Encoding URI Path Parts](https://cloud.google.com/storage/docs/request-endpoints#encoding). */
		sourceObject: string;
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
		/** Access controls on the object. */
		acl?: Array<FirebaseObjectAccessControlInput>;
		/** The name of the bucket containing this object. */
		bucket?: string;
		/** Cache-Control directive for the object data. If omitted, and the object is accessible to all anonymous users, the default will be public, max-age=3600. */
		cacheControl?: string;
		/** Number of underlying components that make up this object. Components are accumulated by compose operations. */
		componentCount?: number;
		/** Content-Disposition of the object data. */
		contentDisposition?: string;
		/** Content-Encoding of the object data. */
		contentEncoding?: string;
		/** Content-Language of the object data. */
		contentLanguage?: string;
		/** Content-Type of the object data. If an object is stored without a Content-Type, it is served as application/octet-stream. */
		contentType?: string;
		/** CRC32c checksum, as described in RFC 4960, Appendix B; encoded using base64 in big-endian byte order. For more information about using the CRC32c checksum, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation). */
		crc32c?: string;
		/** A timestamp in RFC 3339 format specified by the user for an object. */
		customTime?: string;
		/** Metadata of customer-supplied encryption key, if the object is encrypted by such a key. */
		customerEncryption?: {
			/** The encryption algorithm. */
			encryptionAlgorithm?: string;
			/** SHA256 hash value of the encryption key. */
			keySha256?: string;
		};
		/** HTTP 1.1 Entity tag for the object. */
		etag?: string;
		/** Whether an object is under event-based hold. Event-based hold is a way to retain objects until an event occurs, which is signified by the hold's release (i.e. this value is set to false). After being released (set to false), such objects will be subject to bucket-level retention (if any). */
		eventBasedHold?: boolean;
		/** The content generation of this object. Used for object versioning. */
		generation?: string | number;
		/** The ID of the object, including the bucket name, object name, and generation number. */
		id?: string;
		/** The kind of item this is. For objects, this is always storage#object. */
		kind?: string;
		/** Not currently supported. Specifying the parameter causes the request to fail with status code 400 - Bad Request. */
		kmsKeyName?: string;
		/** MD5 hash of the data; encoded using base64. For more information about using the MD5 hash, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation). */
		md5Hash?: string;
		/** Media download link. */
		mediaLink?: string;
		/** User-provided metadata, in key/value pairs. On a patch, a key set to null deletes that entry and `metadata: null` deletes them all. */
		metadata?: Record<string, string | null> | null;
		/** User-defined or system-defined object contexts. Each object context is a key-payload pair, where the key provides the identification and the payload holds the associated value and additional metadata. */
		contexts?: {
			/** User-defined object contexts. */
			custom?: Record<string, FirebaseObjectCustomContextPayloadInput>;
		};
		/** Restore token used to differentiate deleted objects with the same name and generation. This field is only returned for deleted objects in hierarchical namespace buckets. */
		restoreToken?: string;
		/** The version of the metadata for this object at this generation. Used for preconditions and for detecting changes in metadata. A metageneration number is only meaningful in the context of a particular generation of a particular object. */
		metageneration?: string | number;
		/** The name of the object. Required if not specified by URL parameter. */
		name?: string;
		/** The owner of the object. This will always be the uploader of the object. */
		owner?: {
			/** The entity, in the form user-userId. */
			entity?: string;
			/** The ID for the entity. */
			entityId?: string;
		};
		/** A server-determined value that specifies the earliest time that the object's retention period expires. This value is in RFC 3339 format. Note 1: This field is not provided for objects with an active event-based hold, since retention expiration is unknown until the hold is removed. */
		retentionExpirationTime?: string;
		/** A collection of object level retention parameters. */
		retention?: {
			/** A time in RFC 3339 format until which object retention protects this object. */
			retainUntilTime?: string;
			/** The bucket's object retention mode, can only be Unlocked or Locked. */
			mode?: string;
		};
		/** The link to this object. */
		selfLink?: string;
		/** Content-Length of the data in bytes. */
		size?: string | number;
		/** Storage class of the object. */
		storageClass?: string;
		/** Whether an object is under temporary hold. While this flag is set to true, the object is protected against deletion and overwrites. A common use case of this flag is regulatory investigations where objects need to be retained while the investigation is ongoing. */
		temporaryHold?: boolean;
		/** The creation time of the object in RFC 3339 format. */
		timeCreated?: string;
		/** The time at which the object became noncurrent in RFC 3339 format. Will be returned if and only if this version of the object has been deleted. */
		timeDeleted?: string;
		/** The time when the object was finalized. */
		timeFinalized?: string;
		/** The time at which the object became soft-deleted in RFC 3339 format. */
		softDeleteTime?: string;
		/** This is the time (in the future) when the soft-deleted object will no longer be restorable. It is equal to the soft delete time plus the current soft delete retention duration of the bucket. */
		hardDeleteTime?: string;
		/** The time at which the object's storage class was last changed. When the object is initially created, it will be set to timeCreated. */
		timeStorageClassUpdated?: string;
		/** The modification time of the object metadata in RFC 3339 format. Set initially to object creation time and then updated whenever any metadata of the object changes. */
		updated?: string;
		/** Information about the object's availability in Rapid Cache Ultra (RCU) zonal caches. This field will only populate once the object is loaded into the cache. */
		zonalAvailabilityInfo?: {
			/** A list of zones where the object has a zonal copy. The zone names are expected to be in lower-dash case format (e.g., 'us-central1-a'). */
			availableZones?: Array<string>;
		};
	};
	'storage.objects.delete': {
		/** Name of the bucket in which the object resides. */
		bucket: string;
		/** If present, permanently deletes a specific revision of this object (as opposed to the latest version, the default). */
		generation?: string | number;
		/** Makes the operation conditional on whether the object's current generation matches the given value. Setting to 0 makes the operation succeed only if there are no live versions of the object. */
		ifGenerationMatch?: string | number;
		/** Makes the operation conditional on whether the object's current generation does not match the given value. If no live object exists, the precondition fails. Setting to 0 makes the operation succeed only if there is a live version of the object. */
		ifGenerationNotMatch?: string | number;
		/** Makes the operation conditional on whether the object's current metageneration matches the given value. */
		ifMetagenerationMatch?: string | number;
		/** Makes the operation conditional on whether the object's current metageneration does not match the given value. */
		ifMetagenerationNotMatch?: string | number;
		/** Name of the object. For information about how to URL encode object names to be path safe, see [Encoding URI Path Parts](https://cloud.google.com/storage/docs/request-endpoints#encoding). */
		object: string;
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
	};
	'storage.objects.download': {
		/** Name of the bucket in which the object resides. */
		bucket: string;
		/** If present, selects a specific revision of this object (as opposed to the latest version, the default). */
		generation?: string | number;
		/** Makes the operation conditional on whether the object's current generation matches the given value. Setting to 0 makes the operation succeed only if there are no live versions of the object. */
		ifGenerationMatch?: string | number;
		/** Makes the operation conditional on whether the object's current generation does not match the given value. If no live object exists, the precondition fails. Setting to 0 makes the operation succeed only if there is a live version of the object. */
		ifGenerationNotMatch?: string | number;
		/** Makes the operation conditional on whether the object's current metageneration matches the given value. */
		ifMetagenerationMatch?: string | number;
		/** Makes the operation conditional on whether the object's current metageneration does not match the given value. */
		ifMetagenerationNotMatch?: string | number;
		/** Name of the object. For information about how to URL encode object names to be path safe, see [Encoding URI Path Parts](https://cloud.google.com/storage/docs/request-endpoints#encoding). */
		object: string;
		/** Set of properties to return. Defaults to noAcl. */
		projection?: 'full' | 'noAcl';
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
		/** If true, only soft-deleted object versions will be listed. The default is false. For more information, see [Soft Delete](https://cloud.google.com/storage/docs/soft-delete). */
		softDeleted?: boolean;
		/** Restore token used to differentiate soft-deleted objects with the same name and generation. Only applicable for hierarchical namespace buckets and if softDeleted is set to true. */
		restoreToken?: string;
	};
	'storage.objects.get': {
		/** Name of the bucket in which the object resides. */
		bucket: string;
		/** If present, selects a specific revision of this object (as opposed to the latest version, the default). */
		generation?: string | number;
		/** Makes the operation conditional on whether the object's current generation matches the given value. Setting to 0 makes the operation succeed only if there are no live versions of the object. */
		ifGenerationMatch?: string | number;
		/** Makes the operation conditional on whether the object's current generation does not match the given value. If no live object exists, the precondition fails. Setting to 0 makes the operation succeed only if there is a live version of the object. */
		ifGenerationNotMatch?: string | number;
		/** Makes the operation conditional on whether the object's current metageneration matches the given value. */
		ifMetagenerationMatch?: string | number;
		/** Makes the operation conditional on whether the object's current metageneration does not match the given value. */
		ifMetagenerationNotMatch?: string | number;
		/** Name of the object. For information about how to URL encode object names to be path safe, see [Encoding URI Path Parts](https://cloud.google.com/storage/docs/request-endpoints#encoding). */
		object: string;
		/** Set of properties to return. Defaults to noAcl. */
		projection?: 'full' | 'noAcl';
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
		/** If true, only soft-deleted object versions will be listed. The default is false. For more information, see [Soft Delete](https://cloud.google.com/storage/docs/soft-delete). */
		softDeleted?: boolean;
		/** Restore token used to differentiate soft-deleted objects with the same name and generation. Only applicable for hierarchical namespace buckets and if softDeleted is set to true. */
		restoreToken?: string;
	};
	'storage.objects.getIamPolicy': {
		/** Name of the bucket in which the object resides. */
		bucket: string;
		/** If present, selects a specific revision of this object (as opposed to the latest version, the default). */
		generation?: string | number;
		/** Name of the object. For information about how to URL encode object names to be path safe, see [Encoding URI Path Parts](https://cloud.google.com/storage/docs/request-endpoints#encoding). */
		object: string;
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
	};
	'storage.objects.insert': {
		/** Name of the bucket in which to store the new object. Overrides the provided object metadata's bucket value, if any. */
		bucket: string;
		/** If set, sets the contentEncoding property of the final object to this value. Setting this parameter is equivalent to setting the contentEncoding metadata property. This can be useful when uploading an object with uploadType=media to indicate the encoding of the content being uploaded. */
		contentEncoding?: string;
		/** Makes the operation conditional on whether the object's current generation matches the given value. Setting to 0 makes the operation succeed only if there are no live versions of the object. */
		ifGenerationMatch?: string | number;
		/** Makes the operation conditional on whether the object's current generation does not match the given value. If no live object exists, the precondition fails. Setting to 0 makes the operation succeed only if there is a live version of the object. */
		ifGenerationNotMatch?: string | number;
		/** Makes the operation conditional on whether the object's current metageneration matches the given value. */
		ifMetagenerationMatch?: string | number;
		/** Makes the operation conditional on whether the object's current metageneration does not match the given value. */
		ifMetagenerationNotMatch?: string | number;
		/** Resource name of the Cloud KMS key, of the form projects/my-project/locations/global/keyRings/my-kr/cryptoKeys/my-key, that will be used to encrypt the object. Overrides the object metadata's kms_key_name value, if any. */
		kmsKeyName?: string;
		/** Name of the object. Required when the object metadata is not otherwise provided. Overrides the object metadata's name value, if any. For information about how to URL encode object names to be path safe, see [Encoding URI Path Parts](https://cloud.google.com/storage/docs/request-endpoints#encoding). */
		name?: string;
		/** Apply a predefined set of access controls to this object. */
		predefinedAcl?:
			| 'authenticatedRead'
			| 'bucketOwnerFullControl'
			| 'bucketOwnerRead'
			| 'private'
			| 'projectPrivate'
			| 'publicRead';
		/** Set of properties to return. Defaults to noAcl, unless the object resource specifies the acl property, when it defaults to full. */
		projection?: 'full' | 'noAcl';
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
		/** Access controls on the object. */
		acl?: Array<FirebaseObjectAccessControlInput>;
		/** The name of the bucket containing this object. */
		body_bucket?: string;
		/** Cache-Control directive for the object data. If omitted, and the object is accessible to all anonymous users, the default will be public, max-age=3600. */
		cacheControl?: string;
		/** Number of underlying components that make up this object. Components are accumulated by compose operations. */
		componentCount?: number;
		/** Content-Disposition of the object data. */
		contentDisposition?: string;
		/** Content-Encoding of the object data. */
		body_contentEncoding?: string;
		/** Content-Language of the object data. */
		contentLanguage?: string;
		/** Content-Type of the object data. If an object is stored without a Content-Type, it is served as application/octet-stream. */
		contentType?: string;
		/** CRC32c checksum, as described in RFC 4960, Appendix B; encoded using base64 in big-endian byte order. For more information about using the CRC32c checksum, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation). */
		crc32c?: string;
		/** A timestamp in RFC 3339 format specified by the user for an object. */
		customTime?: string;
		/** Metadata of customer-supplied encryption key, if the object is encrypted by such a key. */
		customerEncryption?: {
			/** The encryption algorithm. */
			encryptionAlgorithm?: string;
			/** SHA256 hash value of the encryption key. */
			keySha256?: string;
		};
		/** HTTP 1.1 Entity tag for the object. */
		etag?: string;
		/** Whether an object is under event-based hold. Event-based hold is a way to retain objects until an event occurs, which is signified by the hold's release (i.e. this value is set to false). After being released (set to false), such objects will be subject to bucket-level retention (if any). */
		eventBasedHold?: boolean;
		/** The content generation of this object. Used for object versioning. */
		generation?: string | number;
		/** The ID of the object, including the bucket name, object name, and generation number. */
		id?: string;
		/** The kind of item this is. For objects, this is always storage#object. */
		kind?: string;
		/** Not currently supported. Specifying the parameter causes the request to fail with status code 400 - Bad Request. */
		body_kmsKeyName?: string;
		/** MD5 hash of the data; encoded using base64. For more information about using the MD5 hash, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation). */
		md5Hash?: string;
		/** Media download link. */
		mediaLink?: string;
		/** User-provided metadata, in key/value pairs. On a patch, a key set to null deletes that entry and `metadata: null` deletes them all. */
		metadata?: Record<string, string | null> | null;
		/** User-defined or system-defined object contexts. Each object context is a key-payload pair, where the key provides the identification and the payload holds the associated value and additional metadata. */
		contexts?: {
			/** User-defined object contexts. */
			custom?: Record<string, FirebaseObjectCustomContextPayloadInput>;
		};
		/** Restore token used to differentiate deleted objects with the same name and generation. This field is only returned for deleted objects in hierarchical namespace buckets. */
		restoreToken?: string;
		/** The version of the metadata for this object at this generation. Used for preconditions and for detecting changes in metadata. A metageneration number is only meaningful in the context of a particular generation of a particular object. */
		metageneration?: string | number;
		/** The name of the object. Required if not specified by URL parameter. */
		body_name?: string;
		/** The owner of the object. This will always be the uploader of the object. */
		owner?: {
			/** The entity, in the form user-userId. */
			entity?: string;
			/** The ID for the entity. */
			entityId?: string;
		};
		/** A server-determined value that specifies the earliest time that the object's retention period expires. This value is in RFC 3339 format. Note 1: This field is not provided for objects with an active event-based hold, since retention expiration is unknown until the hold is removed. */
		retentionExpirationTime?: string;
		/** A collection of object level retention parameters. */
		retention?: {
			/** A time in RFC 3339 format until which object retention protects this object. */
			retainUntilTime?: string;
			/** The bucket's object retention mode, can only be Unlocked or Locked. */
			mode?: string;
		};
		/** The link to this object. */
		selfLink?: string;
		/** Content-Length of the data in bytes. */
		size?: string | number;
		/** Storage class of the object. */
		storageClass?: string;
		/** Whether an object is under temporary hold. While this flag is set to true, the object is protected against deletion and overwrites. A common use case of this flag is regulatory investigations where objects need to be retained while the investigation is ongoing. */
		temporaryHold?: boolean;
		/** The creation time of the object in RFC 3339 format. */
		timeCreated?: string;
		/** The time at which the object became noncurrent in RFC 3339 format. Will be returned if and only if this version of the object has been deleted. */
		timeDeleted?: string;
		/** The time when the object was finalized. */
		timeFinalized?: string;
		/** The time at which the object became soft-deleted in RFC 3339 format. */
		softDeleteTime?: string;
		/** This is the time (in the future) when the soft-deleted object will no longer be restorable. It is equal to the soft delete time plus the current soft delete retention duration of the bucket. */
		hardDeleteTime?: string;
		/** The time at which the object's storage class was last changed. When the object is initially created, it will be set to timeCreated. */
		timeStorageClassUpdated?: string;
		/** The modification time of the object metadata in RFC 3339 format. Set initially to object creation time and then updated whenever any metadata of the object changes. */
		updated?: string;
		/** Information about the object's availability in Rapid Cache Ultra (RCU) zonal caches. This field will only populate once the object is loaded into the cache. */
		zonalAvailabilityInfo?: {
			/** A list of zones where the object has a zonal copy. The zone names are expected to be in lower-dash case format (e.g., 'us-central1-a'). */
			availableZones?: Array<string>;
		};
		/** The bytes to upload (a URL, `{ base64 }` or a Blob). Without it the call sends only the JSON metadata. */
		file?: FileInput;
	};
	'storage.objects.list': {
		/** Name of the bucket in which to look for objects. */
		bucket: string;
		/** Returns results in a directory-like mode. items will contain only objects whose names, aside from the prefix, do not contain delimiter. Objects whose names, aside from the prefix, contain delimiter will have their name, truncated after the delimiter, returned in prefixes. */
		delimiter?: string;
		/** Filter results to objects whose names are lexicographically before endOffset. If startOffset is also set, the objects listed will have names between startOffset (inclusive) and endOffset (exclusive). */
		endOffset?: string;
		/** If true, objects that end in exactly one instance of delimiter will have their metadata included in items in addition to prefixes. */
		includeTrailingDelimiter?: boolean;
		/** Maximum number of items plus prefixes to return in a single page of responses. As duplicate prefixes are omitted, fewer total results may be returned than requested. The service will use this parameter or 1,000 items, whichever is smaller. */
		maxResults?: number;
		/** A previously-returned page token representing part of the larger set of results to view. */
		pageToken?: string;
		/** Filter results to objects whose names begin with this prefix. */
		prefix?: string;
		/** Set of properties to return. Defaults to noAcl. */
		projection?: 'full' | 'noAcl';
		/** Filter results to objects whose names are lexicographically equal to or after startOffset. If endOffset is also set, the objects listed will have names between startOffset (inclusive) and endOffset (exclusive). */
		startOffset?: string;
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
		/** If true, lists all versions of an object as distinct results. The default is false. For more information, see [Object Versioning](https://cloud.google.com/storage/docs/object-versioning). */
		versions?: boolean;
		/** Filter results to objects and prefixes that match this glob pattern. */
		matchGlob?: string;
		/** Filter the returned objects. Currently only supported for the contexts field. If delimiter is set, the returned prefixes are exempt from this filter. */
		filter?: string;
		/** If true, only soft-deleted object versions will be listed. The default is false. For more information, see [Soft Delete](https://cloud.google.com/storage/docs/soft-delete). */
		softDeleted?: boolean;
		/** Only applicable if delimiter is set to '/'. If true, will also include folders and managed folders (besides objects) in the returned prefixes. */
		includeFoldersAsPrefixes?: boolean;
	};
	'storage.objects.move': {
		/** Name of the bucket in which the object resides. */
		bucket: string;
		/** Name of the source object. For information about how to URL encode object names to be path safe, see [Encoding URI Path Parts](https://cloud.google.com/storage/docs/request-endpoints#encoding). */
		sourceObject: string;
		/** Name of the destination object. For information about how to URL encode object names to be path safe, see [Encoding URI Path Parts](https://cloud.google.com/storage/docs/request-endpoints#encoding). */
		destinationObject: string;
		/** Makes the operation conditional on whether the source object's current generation matches the given value. `ifSourceGenerationMatch` and `ifSourceGenerationNotMatch` conditions are mutually exclusive: it's an error for both of them to be set in the request. */
		ifSourceGenerationMatch?: string | number;
		/** Makes the operation conditional on whether the source object's current generation does not match the given value. `ifSourceGenerationMatch` and `ifSourceGenerationNotMatch` conditions are mutually exclusive: it's an error for both of them to be set in the request. */
		ifSourceGenerationNotMatch?: string | number;
		/** Makes the operation conditional on whether the source object's current metageneration matches the given value. `ifSourceMetagenerationMatch` and `ifSourceMetagenerationNotMatch` conditions are mutually exclusive: it's an error for both of them to be set in the request. */
		ifSourceMetagenerationMatch?: string | number;
		/** Makes the operation conditional on whether the source object's current metageneration does not match the given value. `ifSourceMetagenerationMatch` and `ifSourceMetagenerationNotMatch` conditions are mutually exclusive: it's an error for both of them to be set in the request. */
		ifSourceMetagenerationNotMatch?: string | number;
		/** Makes the operation conditional on whether the destination object's current generation matches the given value. Setting to 0 makes the operation succeed only if there are no live versions of the object. */
		ifGenerationMatch?: string | number;
		/** Makes the operation conditional on whether the destination object's current generation does not match the given value. If no live object exists, the precondition fails. */
		ifGenerationNotMatch?: string | number;
		/** Makes the operation conditional on whether the destination object's current metageneration matches the given value. `ifMetagenerationMatch` and `ifMetagenerationNotMatch` conditions are mutually exclusive: it's an error for both of them to be set in the request. */
		ifMetagenerationMatch?: string | number;
		/** Makes the operation conditional on whether the destination object's current metageneration does not match the given value. `ifMetagenerationMatch` and `ifMetagenerationNotMatch` conditions are mutually exclusive: it's an error for both of them to be set in the request. */
		ifMetagenerationNotMatch?: string | number;
		/** Set of properties to return. Defaults to noAcl. */
		projection?: 'full' | 'noAcl';
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
	};
	'storage.objects.patch': {
		/** Name of the bucket in which the object resides. */
		bucket: string;
		/** If present, selects a specific revision of this object (as opposed to the latest version, the default). */
		generation?: string | number;
		/** Makes the operation conditional on whether the object's current generation matches the given value. Setting to 0 makes the operation succeed only if there are no live versions of the object. */
		ifGenerationMatch?: string | number;
		/** Makes the operation conditional on whether the object's current generation does not match the given value. If no live object exists, the precondition fails. Setting to 0 makes the operation succeed only if there is a live version of the object. */
		ifGenerationNotMatch?: string | number;
		/** Makes the operation conditional on whether the object's current metageneration matches the given value. */
		ifMetagenerationMatch?: string | number;
		/** Makes the operation conditional on whether the object's current metageneration does not match the given value. */
		ifMetagenerationNotMatch?: string | number;
		/** Must be true to remove the retention configuration, reduce its unlocked retention period, or change its mode from unlocked to locked. */
		overrideUnlockedRetention?: boolean;
		/** Name of the object. For information about how to URL encode object names to be path safe, see [Encoding URI Path Parts](https://cloud.google.com/storage/docs/request-endpoints#encoding). */
		object: string;
		/** Apply a predefined set of access controls to this object. */
		predefinedAcl?:
			| 'authenticatedRead'
			| 'bucketOwnerFullControl'
			| 'bucketOwnerRead'
			| 'private'
			| 'projectPrivate'
			| 'publicRead';
		/** Set of properties to return. Defaults to full. */
		projection?: 'full' | 'noAcl';
		/** The project to be billed for this request, for Requester Pays buckets. */
		userProject?: string;
		/** Access controls on the object. */
		acl?: Array<FirebaseObjectAccessControlInput>;
		/** The name of the bucket containing this object. */
		body_bucket?: string;
		/** Cache-Control directive for the object data. If omitted, and the object is accessible to all anonymous users, the default will be public, max-age=3600. */
		cacheControl?: string;
		/** Number of underlying components that make up this object. Components are accumulated by compose operations. */
		componentCount?: number;
		/** Content-Disposition of the object data. */
		contentDisposition?: string;
		/** Content-Encoding of the object data. */
		contentEncoding?: string;
		/** Content-Language of the object data. */
		contentLanguage?: string;
		/** Content-Type of the object data. If an object is stored without a Content-Type, it is served as application/octet-stream. */
		contentType?: string;
		/** CRC32c checksum, as described in RFC 4960, Appendix B; encoded using base64 in big-endian byte order. For more information about using the CRC32c checksum, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation). */
		crc32c?: string;
		/** A timestamp in RFC 3339 format specified by the user for an object. */
		customTime?: string;
		/** Metadata of customer-supplied encryption key, if the object is encrypted by such a key. */
		customerEncryption?: {
			/** The encryption algorithm. */
			encryptionAlgorithm?: string;
			/** SHA256 hash value of the encryption key. */
			keySha256?: string;
		};
		/** HTTP 1.1 Entity tag for the object. */
		etag?: string;
		/** Whether an object is under event-based hold. Event-based hold is a way to retain objects until an event occurs, which is signified by the hold's release (i.e. this value is set to false). After being released (set to false), such objects will be subject to bucket-level retention (if any). */
		eventBasedHold?: boolean;
		/** The content generation of this object. Used for object versioning. */
		body_generation?: string | number;
		/** The ID of the object, including the bucket name, object name, and generation number. */
		id?: string;
		/** The kind of item this is. For objects, this is always storage#object. */
		kind?: string;
		/** Not currently supported. Specifying the parameter causes the request to fail with status code 400 - Bad Request. */
		kmsKeyName?: string;
		/** MD5 hash of the data; encoded using base64. For more information about using the MD5 hash, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation). */
		md5Hash?: string;
		/** Media download link. */
		mediaLink?: string;
		/** User-provided metadata, in key/value pairs. On a patch, a key set to null deletes that entry and `metadata: null` deletes them all. */
		metadata?: Record<string, string | null> | null;
		/** User-defined or system-defined object contexts. Each object context is a key-payload pair, where the key provides the identification and the payload holds the associated value and additional metadata. */
		contexts?: {
			/** User-defined object contexts. */
			custom?: Record<string, FirebaseObjectCustomContextPayloadInput>;
		};
		/** Restore token used to differentiate deleted objects with the same name and generation. This field is only returned for deleted objects in hierarchical namespace buckets. */
		restoreToken?: string;
		/** The version of the metadata for this object at this generation. Used for preconditions and for detecting changes in metadata. A metageneration number is only meaningful in the context of a particular generation of a particular object. */
		metageneration?: string | number;
		/** The name of the object. Required if not specified by URL parameter. */
		name?: string;
		/** The owner of the object. This will always be the uploader of the object. */
		owner?: {
			/** The entity, in the form user-userId. */
			entity?: string;
			/** The ID for the entity. */
			entityId?: string;
		};
		/** A server-determined value that specifies the earliest time that the object's retention period expires. This value is in RFC 3339 format. Note 1: This field is not provided for objects with an active event-based hold, since retention expiration is unknown until the hold is removed. */
		retentionExpirationTime?: string;
		/** A collection of object level retention parameters. */
		retention?: {
			/** A time in RFC 3339 format until which object retention protects this object. */
			retainUntilTime?: string;
			/** The bucket's object retention mode, can only be Unlocked or Locked. */
			mode?: string;
		};
		/** The link to this object. */
		selfLink?: string;
		/** Content-Length of the data in bytes. */
		size?: string | number;
		/** Storage class of the object. */
		storageClass?: string;
		/** Whether an object is under temporary hold. While this flag is set to true, the object is protected against deletion and overwrites. A common use case of this flag is regulatory investigations where objects need to be retained while the investigation is ongoing. */
		temporaryHold?: boolean;
		/** The creation time of the object in RFC 3339 format. */
		timeCreated?: string;
		/** The time at which the object became noncurrent in RFC 3339 format. Will be returned if and only if this version of the object has been deleted. */
		timeDeleted?: string;
		/** The time when the object was finalized. */
		timeFinalized?: string;
		/** The time at which the object became soft-deleted in RFC 3339 format. */
		softDeleteTime?: string;
		/** This is the time (in the future) when the soft-deleted object will no longer be restorable. It is equal to the soft delete time plus the current soft delete retention duration of the bucket. */
		hardDeleteTime?: string;
		/** The time at which the object's storage class was last changed. When the object is initially created, it will be set to timeCreated. */
		timeStorageClassUpdated?: string;
		/** The modification time of the object metadata in RFC 3339 format. Set initially to object creation time and then updated whenever any metadata of the object changes. */
		updated?: string;
		/** Information about the object's availability in Rapid Cache Ultra (RCU) zonal caches. This field will only populate once the object is loaded into the cache. */
		zonalAvailabilityInfo?: {
			/** A list of zones where the object has a zonal copy. The zone names are expected to be in lower-dash case format (e.g., 'us-central1-a'). */
			availableZones?: Array<string>;
		};
	};
	'storage.objects.restore': {
		/** Name of the bucket in which the object resides. */
		bucket: string;
		/** Selects a specific revision of this object. */
		generation: string | number;
		/** Name of the object. For information about how to URL encode object names to be path safe, see [Encoding URI Path Parts](https://cloud.google.com/storage/docs/request-endpoints#encoding). */
		object: string;
		/** Makes the operation conditional on whether the object's one live generation matches the given value. Setting to 0 makes the operation succeed only if there are no live versions of the object. */
		ifGenerationMatch?: string | number;
		/** Makes the operation conditional on whether none of the object's live generations match the given value. If no live object exists, the precondition fails. Setting to 0 makes the operation succeed only if there is a live version of the object. */
		ifGenerationNotMatch?: string | number;
		/** Makes the operation conditional on whether the object's one live metageneration matches the given value. */
		ifMetagenerationMatch?: string | number;
		/** Makes the operation conditional on whether none of the object's live metagenerations match the given value. */
		ifMetagenerationNotMatch?: string | number;
		/** If true, copies the source object's ACL; otherwise, uses the bucket's default object ACL. The default is false. */
		copySourceAcl?: boolean;
		/** Set of properties to return. Defaults to full. */
		projection?: 'full' | 'noAcl';
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
		/** Restore token used to differentiate sof-deleted objects with the same name and generation. Only applicable for hierarchical namespace buckets. This parameter is optional, and is only required in the rare case when there are multiple soft-deleted objects with the same name and generation. */
		restoreToken?: string;
	};
	'storage.objects.rewrite': {
		/** Name of the bucket in which to store the new object. Overrides the provided object metadata's bucket value, if any. */
		destinationBucket: string;
		/** Resource name of the Cloud KMS key, of the form projects/my-project/locations/global/keyRings/my-kr/cryptoKeys/my-key, that will be used to encrypt the object. Overrides the object metadata's kms_key_name value, if any. */
		destinationKmsKeyName?: string;
		/** Name of the new object. Required when the object metadata is not otherwise provided. Overrides the object metadata's name value, if any. */
		destinationObject: string;
		/** Apply a predefined set of access controls to the destination object. */
		destinationPredefinedAcl?:
			| 'authenticatedRead'
			| 'bucketOwnerFullControl'
			| 'bucketOwnerRead'
			| 'private'
			| 'projectPrivate'
			| 'publicRead';
		/** Specifies which object context groups to drop from the source object during a copy operation. The accepted value is 'custom'. Destination contexts behave as follows: - When request body contexts are provided, they override all source contexts. */
		dropContextGroups?: Array<string>;
		/** Makes the operation conditional on whether the object's current generation matches the given value. Setting to 0 makes the operation succeed only if there are no live versions of the object. */
		ifGenerationMatch?: string | number;
		/** Makes the operation conditional on whether the object's current generation does not match the given value. If no live object exists, the precondition fails. Setting to 0 makes the operation succeed only if there is a live version of the object. */
		ifGenerationNotMatch?: string | number;
		/** Makes the operation conditional on whether the destination object's current metageneration matches the given value. */
		ifMetagenerationMatch?: string | number;
		/** Makes the operation conditional on whether the destination object's current metageneration does not match the given value. */
		ifMetagenerationNotMatch?: string | number;
		/** Makes the operation conditional on whether the source object's current generation matches the given value. */
		ifSourceGenerationMatch?: string | number;
		/** Makes the operation conditional on whether the source object's current generation does not match the given value. */
		ifSourceGenerationNotMatch?: string | number;
		/** Makes the operation conditional on whether the source object's current metageneration matches the given value. */
		ifSourceMetagenerationMatch?: string | number;
		/** Makes the operation conditional on whether the source object's current metageneration does not match the given value. */
		ifSourceMetagenerationNotMatch?: string | number;
		/** The maximum number of bytes that will be rewritten per rewrite request. Most callers shouldn't need to specify this parameter - it is primarily in place to support testing. If specified the value must be an integral multiple of 1 MiB (1048576). */
		maxBytesRewrittenPerCall?: string | number;
		/** Set of properties to return. Defaults to noAcl, unless the object resource specifies the acl property, when it defaults to full. */
		projection?: 'full' | 'noAcl';
		/** Include this field (from the previous rewrite response) on each rewrite request after the first one, until the rewrite response 'done' flag is true. */
		rewriteToken?: string;
		/** Name of the bucket in which to find the source object. */
		sourceBucket: string;
		/** If present, selects a specific revision of the source object (as opposed to the latest version, the default). */
		sourceGeneration?: string | number;
		/** Name of the source object. For information about how to URL encode object names to be path safe, see [Encoding URI Path Parts](https://cloud.google.com/storage/docs/request-endpoints#encoding). */
		sourceObject: string;
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
		/** Access controls on the object. */
		acl?: Array<FirebaseObjectAccessControlInput>;
		/** The name of the bucket containing this object. */
		bucket?: string;
		/** Cache-Control directive for the object data. If omitted, and the object is accessible to all anonymous users, the default will be public, max-age=3600. */
		cacheControl?: string;
		/** Number of underlying components that make up this object. Components are accumulated by compose operations. */
		componentCount?: number;
		/** Content-Disposition of the object data. */
		contentDisposition?: string;
		/** Content-Encoding of the object data. */
		contentEncoding?: string;
		/** Content-Language of the object data. */
		contentLanguage?: string;
		/** Content-Type of the object data. If an object is stored without a Content-Type, it is served as application/octet-stream. */
		contentType?: string;
		/** CRC32c checksum, as described in RFC 4960, Appendix B; encoded using base64 in big-endian byte order. For more information about using the CRC32c checksum, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation). */
		crc32c?: string;
		/** A timestamp in RFC 3339 format specified by the user for an object. */
		customTime?: string;
		/** Metadata of customer-supplied encryption key, if the object is encrypted by such a key. */
		customerEncryption?: {
			/** The encryption algorithm. */
			encryptionAlgorithm?: string;
			/** SHA256 hash value of the encryption key. */
			keySha256?: string;
		};
		/** HTTP 1.1 Entity tag for the object. */
		etag?: string;
		/** Whether an object is under event-based hold. Event-based hold is a way to retain objects until an event occurs, which is signified by the hold's release (i.e. this value is set to false). After being released (set to false), such objects will be subject to bucket-level retention (if any). */
		eventBasedHold?: boolean;
		/** The content generation of this object. Used for object versioning. */
		generation?: string | number;
		/** The ID of the object, including the bucket name, object name, and generation number. */
		id?: string;
		/** The kind of item this is. For objects, this is always storage#object. */
		kind?: string;
		/** Not currently supported. Specifying the parameter causes the request to fail with status code 400 - Bad Request. */
		kmsKeyName?: string;
		/** MD5 hash of the data; encoded using base64. For more information about using the MD5 hash, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation). */
		md5Hash?: string;
		/** Media download link. */
		mediaLink?: string;
		/** User-provided metadata, in key/value pairs. On a patch, a key set to null deletes that entry and `metadata: null` deletes them all. */
		metadata?: Record<string, string | null> | null;
		/** User-defined or system-defined object contexts. Each object context is a key-payload pair, where the key provides the identification and the payload holds the associated value and additional metadata. */
		contexts?: {
			/** User-defined object contexts. */
			custom?: Record<string, FirebaseObjectCustomContextPayloadInput>;
		};
		/** Restore token used to differentiate deleted objects with the same name and generation. This field is only returned for deleted objects in hierarchical namespace buckets. */
		restoreToken?: string;
		/** The version of the metadata for this object at this generation. Used for preconditions and for detecting changes in metadata. A metageneration number is only meaningful in the context of a particular generation of a particular object. */
		metageneration?: string | number;
		/** The name of the object. Required if not specified by URL parameter. */
		name?: string;
		/** The owner of the object. This will always be the uploader of the object. */
		owner?: {
			/** The entity, in the form user-userId. */
			entity?: string;
			/** The ID for the entity. */
			entityId?: string;
		};
		/** A server-determined value that specifies the earliest time that the object's retention period expires. This value is in RFC 3339 format. Note 1: This field is not provided for objects with an active event-based hold, since retention expiration is unknown until the hold is removed. */
		retentionExpirationTime?: string;
		/** A collection of object level retention parameters. */
		retention?: {
			/** A time in RFC 3339 format until which object retention protects this object. */
			retainUntilTime?: string;
			/** The bucket's object retention mode, can only be Unlocked or Locked. */
			mode?: string;
		};
		/** The link to this object. */
		selfLink?: string;
		/** Content-Length of the data in bytes. */
		size?: string | number;
		/** Storage class of the object. */
		storageClass?: string;
		/** Whether an object is under temporary hold. While this flag is set to true, the object is protected against deletion and overwrites. A common use case of this flag is regulatory investigations where objects need to be retained while the investigation is ongoing. */
		temporaryHold?: boolean;
		/** The creation time of the object in RFC 3339 format. */
		timeCreated?: string;
		/** The time at which the object became noncurrent in RFC 3339 format. Will be returned if and only if this version of the object has been deleted. */
		timeDeleted?: string;
		/** The time when the object was finalized. */
		timeFinalized?: string;
		/** The time at which the object became soft-deleted in RFC 3339 format. */
		softDeleteTime?: string;
		/** This is the time (in the future) when the soft-deleted object will no longer be restorable. It is equal to the soft delete time plus the current soft delete retention duration of the bucket. */
		hardDeleteTime?: string;
		/** The time at which the object's storage class was last changed. When the object is initially created, it will be set to timeCreated. */
		timeStorageClassUpdated?: string;
		/** The modification time of the object metadata in RFC 3339 format. Set initially to object creation time and then updated whenever any metadata of the object changes. */
		updated?: string;
		/** Information about the object's availability in Rapid Cache Ultra (RCU) zonal caches. This field will only populate once the object is loaded into the cache. */
		zonalAvailabilityInfo?: {
			/** A list of zones where the object has a zonal copy. The zone names are expected to be in lower-dash case format (e.g., 'us-central1-a'). */
			availableZones?: Array<string>;
		};
	};
	'storage.objects.setIamPolicy': {
		/** Name of the bucket in which the object resides. */
		bucket: string;
		/** If present, selects a specific revision of this object (as opposed to the latest version, the default). */
		generation?: string | number;
		/** Name of the object. For information about how to URL encode object names to be path safe, see [Encoding URI Path Parts](https://cloud.google.com/storage/docs/request-endpoints#encoding). */
		object: string;
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
		/** An association between a role, which comes with a set of permissions, and members who may assume that role. */
		bindings?: Array<{
			/** The condition that is associated with this binding. NOTE: an unsatisfied condition will not allow user access via current binding. Different bindings, including their conditions, are examined independently. */
			condition?: FirebaseExprInput;
			/** A collection of identifiers for members who may assume the provided role. Recognized identifiers are as follows: - allUsers - A special identifier that represents anyone on the internet; with or without a Google account. */
			members?: Array<string>;
			/** The role to which members belong. Two types of roles are supported: new IAM roles, which grant permissions that do not map directly to those provided by ACLs, and legacy IAM roles, which do map directly to ACL permissions. All roles are of the format roles/storage.specificRole. */
			role?: string;
		}>;
		/** HTTP 1.1 Entity tag for the policy. (base64) */
		etag?: string;
		/** The kind of item this is. For policies, this is always storage#policy. This field is ignored on input. */
		kind?: string;
		/** The ID of the resource to which this policy belongs. Will be of the form projects/_/buckets/bucket for buckets, projects/_/buckets/bucket/objects/object for objects, and projects/_/buckets/bucket/managedFolders/managedFolder. */
		resourceId?: string;
		/** The IAM policy format version. */
		version?: number;
	};
	'storage.objects.testIamPermissions': {
		/** Name of the bucket in which the object resides. */
		bucket: string;
		/** If present, selects a specific revision of this object (as opposed to the latest version, the default). */
		generation?: string | number;
		/** Name of the object. For information about how to URL encode object names to be path safe, see [Encoding URI Path Parts](https://cloud.google.com/storage/docs/request-endpoints#encoding). */
		object: string;
		/** Permissions to test. */
		permissions: Array<string>;
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
	};
	'storage.objects.update': {
		/** Name of the bucket in which the object resides. */
		bucket: string;
		/** If present, selects a specific revision of this object (as opposed to the latest version, the default). */
		generation?: string | number;
		/** Makes the operation conditional on whether the object's current generation matches the given value. Setting to 0 makes the operation succeed only if there are no live versions of the object. */
		ifGenerationMatch?: string | number;
		/** Makes the operation conditional on whether the object's current generation does not match the given value. If no live object exists, the precondition fails. Setting to 0 makes the operation succeed only if there is a live version of the object. */
		ifGenerationNotMatch?: string | number;
		/** Makes the operation conditional on whether the object's current metageneration matches the given value. */
		ifMetagenerationMatch?: string | number;
		/** Makes the operation conditional on whether the object's current metageneration does not match the given value. */
		ifMetagenerationNotMatch?: string | number;
		/** Must be true to remove the retention configuration, reduce its unlocked retention period, or change its mode from unlocked to locked. */
		overrideUnlockedRetention?: boolean;
		/** Name of the object. For information about how to URL encode object names to be path safe, see [Encoding URI Path Parts](https://cloud.google.com/storage/docs/request-endpoints#encoding). */
		object: string;
		/** Apply a predefined set of access controls to this object. */
		predefinedAcl?:
			| 'authenticatedRead'
			| 'bucketOwnerFullControl'
			| 'bucketOwnerRead'
			| 'private'
			| 'projectPrivate'
			| 'publicRead';
		/** Set of properties to return. Defaults to full. */
		projection?: 'full' | 'noAcl';
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
		/** Access controls on the object. */
		acl?: Array<FirebaseObjectAccessControlInput>;
		/** The name of the bucket containing this object. */
		body_bucket?: string;
		/** Cache-Control directive for the object data. If omitted, and the object is accessible to all anonymous users, the default will be public, max-age=3600. */
		cacheControl?: string;
		/** Number of underlying components that make up this object. Components are accumulated by compose operations. */
		componentCount?: number;
		/** Content-Disposition of the object data. */
		contentDisposition?: string;
		/** Content-Encoding of the object data. */
		contentEncoding?: string;
		/** Content-Language of the object data. */
		contentLanguage?: string;
		/** Content-Type of the object data. If an object is stored without a Content-Type, it is served as application/octet-stream. */
		contentType?: string;
		/** CRC32c checksum, as described in RFC 4960, Appendix B; encoded using base64 in big-endian byte order. For more information about using the CRC32c checksum, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation). */
		crc32c?: string;
		/** A timestamp in RFC 3339 format specified by the user for an object. */
		customTime?: string;
		/** Metadata of customer-supplied encryption key, if the object is encrypted by such a key. */
		customerEncryption?: {
			/** The encryption algorithm. */
			encryptionAlgorithm?: string;
			/** SHA256 hash value of the encryption key. */
			keySha256?: string;
		};
		/** HTTP 1.1 Entity tag for the object. */
		etag?: string;
		/** Whether an object is under event-based hold. Event-based hold is a way to retain objects until an event occurs, which is signified by the hold's release (i.e. this value is set to false). After being released (set to false), such objects will be subject to bucket-level retention (if any). */
		eventBasedHold?: boolean;
		/** The content generation of this object. Used for object versioning. */
		body_generation?: string | number;
		/** The ID of the object, including the bucket name, object name, and generation number. */
		id?: string;
		/** The kind of item this is. For objects, this is always storage#object. */
		kind?: string;
		/** Not currently supported. Specifying the parameter causes the request to fail with status code 400 - Bad Request. */
		kmsKeyName?: string;
		/** MD5 hash of the data; encoded using base64. For more information about using the MD5 hash, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation). */
		md5Hash?: string;
		/** Media download link. */
		mediaLink?: string;
		/** User-provided metadata, in key/value pairs. On a patch, a key set to null deletes that entry and `metadata: null` deletes them all. */
		metadata?: Record<string, string | null> | null;
		/** User-defined or system-defined object contexts. Each object context is a key-payload pair, where the key provides the identification and the payload holds the associated value and additional metadata. */
		contexts?: {
			/** User-defined object contexts. */
			custom?: Record<string, FirebaseObjectCustomContextPayloadInput>;
		};
		/** Restore token used to differentiate deleted objects with the same name and generation. This field is only returned for deleted objects in hierarchical namespace buckets. */
		restoreToken?: string;
		/** The version of the metadata for this object at this generation. Used for preconditions and for detecting changes in metadata. A metageneration number is only meaningful in the context of a particular generation of a particular object. */
		metageneration?: string | number;
		/** The name of the object. Required if not specified by URL parameter. */
		name?: string;
		/** The owner of the object. This will always be the uploader of the object. */
		owner?: {
			/** The entity, in the form user-userId. */
			entity?: string;
			/** The ID for the entity. */
			entityId?: string;
		};
		/** A server-determined value that specifies the earliest time that the object's retention period expires. This value is in RFC 3339 format. Note 1: This field is not provided for objects with an active event-based hold, since retention expiration is unknown until the hold is removed. */
		retentionExpirationTime?: string;
		/** A collection of object level retention parameters. */
		retention?: {
			/** A time in RFC 3339 format until which object retention protects this object. */
			retainUntilTime?: string;
			/** The bucket's object retention mode, can only be Unlocked or Locked. */
			mode?: string;
		};
		/** The link to this object. */
		selfLink?: string;
		/** Content-Length of the data in bytes. */
		size?: string | number;
		/** Storage class of the object. */
		storageClass?: string;
		/** Whether an object is under temporary hold. While this flag is set to true, the object is protected against deletion and overwrites. A common use case of this flag is regulatory investigations where objects need to be retained while the investigation is ongoing. */
		temporaryHold?: boolean;
		/** The creation time of the object in RFC 3339 format. */
		timeCreated?: string;
		/** The time at which the object became noncurrent in RFC 3339 format. Will be returned if and only if this version of the object has been deleted. */
		timeDeleted?: string;
		/** The time when the object was finalized. */
		timeFinalized?: string;
		/** The time at which the object became soft-deleted in RFC 3339 format. */
		softDeleteTime?: string;
		/** This is the time (in the future) when the soft-deleted object will no longer be restorable. It is equal to the soft delete time plus the current soft delete retention duration of the bucket. */
		hardDeleteTime?: string;
		/** The time at which the object's storage class was last changed. When the object is initially created, it will be set to timeCreated. */
		timeStorageClassUpdated?: string;
		/** The modification time of the object metadata in RFC 3339 format. Set initially to object creation time and then updated whenever any metadata of the object changes. */
		updated?: string;
		/** Information about the object's availability in Rapid Cache Ultra (RCU) zonal caches. This field will only populate once the object is loaded into the cache. */
		zonalAvailabilityInfo?: {
			/** A list of zones where the object has a zonal copy. The zone names are expected to be in lower-dash case format (e.g., 'us-central1-a'). */
			availableZones?: Array<string>;
		};
	};
	'storage.objects.viewFullContext': {
		/** Name of the bucket in which the object resides. */
		bucket: string;
		/** Name of the object. For information about how to URL encode object names to be path safe, see [Encoding URI Path Parts](https://cloud.google.com/storage/docs/request-endpoints#encoding). */
		object: string;
		/** If present, selects a specific revision of this object (as opposed to the latest version, the default). */
		generation?: string | number;
		/** Key identifying the object context to retrieve. */
		contextKey: string;
		/** The project to be billed for this request. Required for Requester Pays buckets. */
		userProject?: string;
	};
	'storageBuckets.buckets.addFirebase': {
		/** Required. Resource name of the bucket, mirrors the ID of the underlying Google Cloud Storage bucket, `projects/{project_id_or_number}/buckets/{bucket_id}`. Format: `projects/<id>/buckets/<id>`. */
		bucket: string;
		body?: FirebaseStorageBucketsAddFirebaseRequestInput;
	};
	'storageBuckets.buckets.get': {
		/** Required. Resource name of the bucket, mirrors the ID of the underlying Google Cloud Storage bucket, `projects/{project_id_or_number}/buckets/{bucket_id}`. Format: `projects/<id>/buckets/<id>`. */
		name: string;
	};
	'storageBuckets.buckets.list': {
		/** Required. Resource name of the parent Firebase project, `projects/{project_id_or_number}`. Format: `projects/<id>`. */
		parent: string;
		/** A page token, received from a previous `ListBuckets` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListBuckets` must match the call that provided the page token. */
		pageToken?: string;
		/** The maximum number of buckets to return. If not set, the server will use a reasonable default. */
		pageSize?: number;
	};
	'storageBuckets.buckets.removeFirebase': {
		/** Required. Resource name of the bucket, mirrors the ID of the underlying Google Cloud Storage bucket, `projects/{project_id_or_number}/buckets/{bucket_id}`. Format: `projects/<id>/buckets/<id>`. */
		bucket: string;
		body?: FirebaseRemoveFirebaseRequestInput;
	};
	'storageBuckets.defaultBucket.create': {
		/** Required. The parent resource where the default bucket will be created, `projects/{project_id_or_number}`. Format: `projects/<id>`. */
		parent: string;
		/** Required. Immutable. Location of the default bucket. */
		location?: string;
		/** Identifier. Resource name of the default bucket. */
		name?: string;
		/** Immutable. Storage class of the default bucket. Supported values are available at https://cloud.google.com/storage/docs/storage-classes#classes. */
		storageClass?: string;
	};
	'storageBuckets.projects.deleteDefaultBucket': {
		/** Required. The name of the default bucket to delete, `projects/{project_id_or_number}/defaultBucket`. Format: `projects/<id>/defaultBucket`. */
		name: string;
	};
	'storageBuckets.projects.getDefaultBucket': {
		/** Required. The name of the default bucket to retrieve, `projects/{project_id_or_number}/defaultBucket`. Format: `projects/<id>/defaultBucket`. */
		name: string;
	};
};

export type FirebaseOperationOutputs = {
	'appCheck.apps.appAttestConfig.batchGet': FirebaseGoogleFirebaseAppcheckV1BatchGetAppAttestConfigsResponse;
	'appCheck.apps.appAttestConfig.get': FirebaseGoogleFirebaseAppcheckV1AppAttestConfig;
	'appCheck.apps.appAttestConfig.patch': FirebaseGoogleFirebaseAppcheckV1AppAttestConfig;
	'appCheck.apps.debugTokens.create': FirebaseGoogleFirebaseAppcheckV1DebugToken;
	'appCheck.apps.debugTokens.delete': FirebaseAppCheckGoogleProtobufEmpty;
	'appCheck.apps.debugTokens.get': FirebaseGoogleFirebaseAppcheckV1DebugToken;
	'appCheck.apps.debugTokens.list': FirebaseGoogleFirebaseAppcheckV1ListDebugTokensResponse;
	'appCheck.apps.debugTokens.patch': FirebaseGoogleFirebaseAppcheckV1DebugToken;
	'appCheck.apps.deviceCheckConfig.batchGet': FirebaseGoogleFirebaseAppcheckV1BatchGetDeviceCheckConfigsResponse;
	'appCheck.apps.deviceCheckConfig.get': FirebaseGoogleFirebaseAppcheckV1DeviceCheckConfig;
	'appCheck.apps.deviceCheckConfig.patch': FirebaseGoogleFirebaseAppcheckV1DeviceCheckConfig;
	'appCheck.apps.exchangeAppAttestAssertion': FirebaseGoogleFirebaseAppcheckV1AppCheckToken;
	'appCheck.apps.exchangeAppAttestAttestation': FirebaseGoogleFirebaseAppcheckV1ExchangeAppAttestAttestationResponse;
	'appCheck.apps.exchangeCustomToken': FirebaseGoogleFirebaseAppcheckV1AppCheckToken;
	'appCheck.apps.exchangeDebugToken': FirebaseGoogleFirebaseAppcheckV1AppCheckToken;
	'appCheck.apps.exchangeDeviceCheckToken': FirebaseGoogleFirebaseAppcheckV1AppCheckToken;
	'appCheck.apps.exchangePlayIntegrityToken': FirebaseGoogleFirebaseAppcheckV1AppCheckToken;
	'appCheck.apps.exchangeRecaptchaEnterpriseToken': FirebaseGoogleFirebaseAppcheckV1AppCheckToken;
	'appCheck.apps.exchangeRecaptchaV3Token': FirebaseGoogleFirebaseAppcheckV1AppCheckToken;
	'appCheck.apps.generateAppAttestChallenge': FirebaseGoogleFirebaseAppcheckV1GenerateAppAttestChallengeResponse;
	'appCheck.apps.generatePlayIntegrityChallenge': FirebaseGoogleFirebaseAppcheckV1GeneratePlayIntegrityChallengeResponse;
	'appCheck.apps.mintAppCheckToken': FirebaseGoogleFirebaseAppcheckV1MintAppCheckTokenResponse;
	'appCheck.apps.playIntegrityConfig.batchGet': FirebaseGoogleFirebaseAppcheckV1BatchGetPlayIntegrityConfigsResponse;
	'appCheck.apps.playIntegrityConfig.get': FirebaseGoogleFirebaseAppcheckV1PlayIntegrityConfig;
	'appCheck.apps.playIntegrityConfig.patch': FirebaseGoogleFirebaseAppcheckV1PlayIntegrityConfig;
	'appCheck.apps.recaptchaEnterpriseConfig.batchGet': FirebaseGoogleFirebaseAppcheckV1BatchGetRecaptchaEnterpriseConfigsResponse;
	'appCheck.apps.recaptchaEnterpriseConfig.get': FirebaseGoogleFirebaseAppcheckV1RecaptchaEnterpriseConfig;
	'appCheck.apps.recaptchaEnterpriseConfig.patch': FirebaseGoogleFirebaseAppcheckV1RecaptchaEnterpriseConfig;
	'appCheck.apps.recaptchaV3Config.batchGet': FirebaseGoogleFirebaseAppcheckV1BatchGetRecaptchaV3ConfigsResponse;
	'appCheck.apps.recaptchaV3Config.get': FirebaseGoogleFirebaseAppcheckV1RecaptchaV3Config;
	'appCheck.apps.recaptchaV3Config.patch': FirebaseGoogleFirebaseAppcheckV1RecaptchaV3Config;
	'appCheck.jwks.get': FirebaseGoogleFirebaseAppcheckV1PublicJwkSet;
	'appCheck.oauthClients.exchangeAppAttestAssertion': FirebaseGoogleFirebaseAppcheckV1AppCheckToken;
	'appCheck.oauthClients.exchangeAppAttestAttestation': FirebaseGoogleFirebaseAppcheckV1ExchangeAppAttestAttestationResponse;
	'appCheck.oauthClients.exchangeDebugToken': FirebaseGoogleFirebaseAppcheckV1AppCheckToken;
	'appCheck.oauthClients.generateAppAttestChallenge': FirebaseGoogleFirebaseAppcheckV1GenerateAppAttestChallengeResponse;
	'appCheck.services.batchUpdate': FirebaseGoogleFirebaseAppcheckV1BatchUpdateServicesResponse;
	'appCheck.services.get': FirebaseGoogleFirebaseAppcheckV1Service;
	'appCheck.services.list': FirebaseGoogleFirebaseAppcheckV1ListServicesResponse;
	'appCheck.services.patch': FirebaseGoogleFirebaseAppcheckV1Service;
	'appCheck.services.resourcePolicies.batchUpdate': FirebaseGoogleFirebaseAppcheckV1BatchUpdateResourcePoliciesResponse;
	'appCheck.services.resourcePolicies.create': FirebaseGoogleFirebaseAppcheckV1ResourcePolicy;
	'appCheck.services.resourcePolicies.delete': FirebaseAppCheckGoogleProtobufEmpty;
	'appCheck.services.resourcePolicies.get': FirebaseGoogleFirebaseAppcheckV1ResourcePolicy;
	'appCheck.services.resourcePolicies.list': FirebaseGoogleFirebaseAppcheckV1ListResourcePoliciesResponse;
	'appCheck.services.resourcePolicies.patch': FirebaseGoogleFirebaseAppcheckV1ResourcePolicy;
	'appDistribution.apps.getAabInfo': FirebaseGoogleFirebaseAppdistroV1AabInfo;
	'appDistribution.apps.releases.batchDelete': FirebaseAppDistributionGoogleProtobufEmpty;
	'appDistribution.apps.releases.distribute': FirebaseGoogleFirebaseAppdistroV1DistributeReleaseResponse;
	'appDistribution.apps.releases.feedbackReports.delete': FirebaseAppDistributionGoogleProtobufEmpty;
	'appDistribution.apps.releases.feedbackReports.get': FirebaseGoogleFirebaseAppdistroV1FeedbackReport;
	'appDistribution.apps.releases.feedbackReports.list': FirebaseGoogleFirebaseAppdistroV1ListFeedbackReportsResponse;
	'appDistribution.apps.releases.get': FirebaseGoogleFirebaseAppdistroV1Release;
	'appDistribution.apps.releases.list': FirebaseGoogleFirebaseAppdistroV1ListReleasesResponse;
	'appDistribution.apps.releases.operations.cancel': FirebaseAppDistributionGoogleProtobufEmpty;
	'appDistribution.apps.releases.operations.delete': FirebaseAppDistributionGoogleProtobufEmpty;
	'appDistribution.apps.releases.operations.get': FirebaseAppDistributionGoogleLongrunningOperation;
	'appDistribution.apps.releases.operations.list': FirebaseAppDistributionGoogleLongrunningListOperationsResponse;
	'appDistribution.apps.releases.operations.wait': FirebaseAppDistributionGoogleLongrunningOperation;
	'appDistribution.apps.releases.patch': FirebaseGoogleFirebaseAppdistroV1Release;
	'appDistribution.groups.batchJoin': FirebaseAppDistributionGoogleProtobufEmpty;
	'appDistribution.groups.batchLeave': FirebaseAppDistributionGoogleProtobufEmpty;
	'appDistribution.groups.create': FirebaseGoogleFirebaseAppdistroV1Group;
	'appDistribution.groups.delete': FirebaseAppDistributionGoogleProtobufEmpty;
	'appDistribution.groups.get': FirebaseGoogleFirebaseAppdistroV1Group;
	'appDistribution.groups.list': FirebaseGoogleFirebaseAppdistroV1ListGroupsResponse;
	'appDistribution.groups.patch': FirebaseGoogleFirebaseAppdistroV1Group;
	'appDistribution.media.upload': FirebaseAppDistributionGoogleLongrunningOperation;
	'appDistribution.testers.batchAdd': FirebaseGoogleFirebaseAppdistroV1BatchAddTestersResponse;
	'appDistribution.testers.batchRemove': FirebaseGoogleFirebaseAppdistroV1BatchRemoveTestersResponse;
	'appDistribution.testers.list': FirebaseGoogleFirebaseAppdistroV1ListTestersResponse;
	'appDistribution.testers.patch': FirebaseGoogleFirebaseAppdistroV1Tester;
	'auth.accounts.createAuthUri': FirebaseGoogleCloudIdentitytoolkitV1CreateAuthUriResponse;
	'auth.accounts.delete': FirebaseGoogleCloudIdentitytoolkitV1DeleteAccountResponse;
	'auth.accounts.issueSamlResponse': FirebaseGoogleCloudIdentitytoolkitV1IssueSamlResponseResponse;
	'auth.accounts.lookup': FirebaseGoogleCloudIdentitytoolkitV1GetAccountInfoResponse;
	'auth.accounts.resetPassword': FirebaseGoogleCloudIdentitytoolkitV1ResetPasswordResponse;
	'auth.accounts.sendOobCode': FirebaseGoogleCloudIdentitytoolkitV1GetOobCodeResponse;
	'auth.accounts.sendVerificationCode': FirebaseGoogleCloudIdentitytoolkitV1SendVerificationCodeResponse;
	'auth.accounts.signInWithCustomToken': FirebaseGoogleCloudIdentitytoolkitV1SignInWithCustomTokenResponse;
	'auth.accounts.signInWithEmailLink': FirebaseGoogleCloudIdentitytoolkitV1SignInWithEmailLinkResponse;
	'auth.accounts.signInWithGameCenter': FirebaseGoogleCloudIdentitytoolkitV1SignInWithGameCenterResponse;
	'auth.accounts.signInWithIdp': FirebaseGoogleCloudIdentitytoolkitV1SignInWithIdpResponse;
	'auth.accounts.signInWithPassword': FirebaseGoogleCloudIdentitytoolkitV1SignInWithPasswordResponse;
	'auth.accounts.signInWithPhoneNumber': FirebaseGoogleCloudIdentitytoolkitV1SignInWithPhoneNumberResponse;
	'auth.accounts.signUp': FirebaseGoogleCloudIdentitytoolkitV1SignUpResponse;
	'auth.accounts.update': FirebaseGoogleCloudIdentitytoolkitV1SetAccountInfoResponse;
	'auth.accounts.verifyIosClient': FirebaseGoogleCloudIdentitytoolkitV1VerifyIosClientResponse;
	'auth.getProjects': FirebaseGoogleCloudIdentitytoolkitV1GetProjectConfigResponse;
	'auth.getPublicKeys': Record<string, string>;
	'auth.getRecaptchaParams': FirebaseGoogleCloudIdentitytoolkitV1GetRecaptchaParamResponse;
	'auth.getSessionCookiePublicKeys': FirebaseGoogleCloudIdentitytoolkitV1GetSessionCookiePublicKeysResponse;
	'auth.projects.accounts.batchCreate': FirebaseGoogleCloudIdentitytoolkitV1UploadAccountResponse;
	'auth.projects.accounts.batchDelete': FirebaseGoogleCloudIdentitytoolkitV1BatchDeleteAccountsResponse;
	'auth.projects.accounts.batchGet': FirebaseGoogleCloudIdentitytoolkitV1DownloadAccountResponse;
	'auth.projects.accounts.create': FirebaseGoogleCloudIdentitytoolkitV1SignUpResponse;
	'auth.projects.accounts.delete': FirebaseGoogleCloudIdentitytoolkitV1DeleteAccountResponse;
	'auth.projects.accounts.lookup': FirebaseGoogleCloudIdentitytoolkitV1GetAccountInfoResponse;
	'auth.projects.accounts.query': FirebaseGoogleCloudIdentitytoolkitV1QueryUserInfoResponse;
	'auth.projects.accounts.sendOobCode': FirebaseGoogleCloudIdentitytoolkitV1GetOobCodeResponse;
	'auth.projects.accounts.update': FirebaseGoogleCloudIdentitytoolkitV1SetAccountInfoResponse;
	'auth.projects.createSessionCookie': FirebaseGoogleCloudIdentitytoolkitV1CreateSessionCookieResponse;
	'auth.projects.queryAccounts': FirebaseGoogleCloudIdentitytoolkitV1QueryUserInfoResponse;
	'auth.projects.tenants.accounts.batchCreate': FirebaseGoogleCloudIdentitytoolkitV1UploadAccountResponse;
	'auth.projects.tenants.accounts.batchDelete': FirebaseGoogleCloudIdentitytoolkitV1BatchDeleteAccountsResponse;
	'auth.projects.tenants.accounts.batchGet': FirebaseGoogleCloudIdentitytoolkitV1DownloadAccountResponse;
	'auth.projects.tenants.accounts.create': FirebaseGoogleCloudIdentitytoolkitV1SignUpResponse;
	'auth.projects.tenants.accounts.delete': FirebaseGoogleCloudIdentitytoolkitV1DeleteAccountResponse;
	'auth.projects.tenants.accounts.lookup': FirebaseGoogleCloudIdentitytoolkitV1GetAccountInfoResponse;
	'auth.projects.tenants.accounts.query': FirebaseGoogleCloudIdentitytoolkitV1QueryUserInfoResponse;
	'auth.projects.tenants.accounts.sendOobCode': FirebaseGoogleCloudIdentitytoolkitV1GetOobCodeResponse;
	'auth.projects.tenants.accounts.update': FirebaseGoogleCloudIdentitytoolkitV1SetAccountInfoResponse;
	'auth.projects.tenants.createSessionCookie': FirebaseGoogleCloudIdentitytoolkitV1CreateSessionCookieResponse;
	'authAdmin.accounts.mfaEnrollment.finalize': FirebaseGoogleCloudIdentitytoolkitV2FinalizeMfaEnrollmentResponse;
	'authAdmin.accounts.mfaEnrollment.start': FirebaseGoogleCloudIdentitytoolkitV2StartMfaEnrollmentResponse;
	'authAdmin.accounts.mfaEnrollment.withdraw': FirebaseGoogleCloudIdentitytoolkitV2WithdrawMfaResponse;
	'authAdmin.accounts.mfaSignIn.finalize': FirebaseGoogleCloudIdentitytoolkitV2FinalizeMfaSignInResponse;
	'authAdmin.accounts.mfaSignIn.start': FirebaseGoogleCloudIdentitytoolkitV2StartMfaSignInResponse;
	'authAdmin.accounts.revokeToken': FirebaseGoogleCloudIdentitytoolkitV2RevokeTokenResponse;
	'authAdmin.defaultSupportedIdpConfigs.create': FirebaseGoogleCloudIdentitytoolkitAdminV2DefaultSupportedIdpConfig;
	'authAdmin.defaultSupportedIdpConfigs.delete': FirebaseAuthAdminGoogleProtobufEmpty;
	'authAdmin.defaultSupportedIdpConfigs.get': FirebaseGoogleCloudIdentitytoolkitAdminV2DefaultSupportedIdpConfig;
	'authAdmin.defaultSupportedIdpConfigs.list': FirebaseGoogleCloudIdentitytoolkitAdminV2ListDefaultSupportedIdpConfigsResponse;
	'authAdmin.defaultSupportedIdpConfigs.patch': FirebaseGoogleCloudIdentitytoolkitAdminV2DefaultSupportedIdpConfig;
	'authAdmin.defaultSupportedIdps.list': FirebaseGoogleCloudIdentitytoolkitAdminV2ListDefaultSupportedIdpsResponse;
	'authAdmin.getPasswordPolicy': FirebaseGoogleCloudIdentitytoolkitV2PasswordPolicy;
	'authAdmin.getRecaptchaConfig': FirebaseGoogleCloudIdentitytoolkitV2RecaptchaConfig;
	'authAdmin.identityPlatform.initializeAuth': FirebaseGoogleCloudIdentitytoolkitAdminV2InitializeIdentityPlatformResponse;
	'authAdmin.inboundSamlConfigs.create': FirebaseGoogleCloudIdentitytoolkitAdminV2InboundSamlConfig;
	'authAdmin.inboundSamlConfigs.delete': FirebaseAuthAdminGoogleProtobufEmpty;
	'authAdmin.inboundSamlConfigs.get': FirebaseGoogleCloudIdentitytoolkitAdminV2InboundSamlConfig;
	'authAdmin.inboundSamlConfigs.list': FirebaseGoogleCloudIdentitytoolkitAdminV2ListInboundSamlConfigsResponse;
	'authAdmin.inboundSamlConfigs.patch': FirebaseGoogleCloudIdentitytoolkitAdminV2InboundSamlConfig;
	'authAdmin.oauthIdpConfigs.create': FirebaseGoogleCloudIdentitytoolkitAdminV2OAuthIdpConfig;
	'authAdmin.oauthIdpConfigs.delete': FirebaseAuthAdminGoogleProtobufEmpty;
	'authAdmin.oauthIdpConfigs.get': FirebaseGoogleCloudIdentitytoolkitAdminV2OAuthIdpConfig;
	'authAdmin.oauthIdpConfigs.list': FirebaseGoogleCloudIdentitytoolkitAdminV2ListOAuthIdpConfigsResponse;
	'authAdmin.oauthIdpConfigs.patch': FirebaseGoogleCloudIdentitytoolkitAdminV2OAuthIdpConfig;
	'authAdmin.projects.getConfig': FirebaseGoogleCloudIdentitytoolkitAdminV2Config;
	'authAdmin.projects.updateConfig': FirebaseGoogleCloudIdentitytoolkitAdminV2Config;
	'authAdmin.tenants.create': FirebaseGoogleCloudIdentitytoolkitAdminV2Tenant;
	'authAdmin.tenants.defaultSupportedIdpConfigs.create': FirebaseGoogleCloudIdentitytoolkitAdminV2DefaultSupportedIdpConfig;
	'authAdmin.tenants.defaultSupportedIdpConfigs.delete': FirebaseAuthAdminGoogleProtobufEmpty;
	'authAdmin.tenants.defaultSupportedIdpConfigs.get': FirebaseGoogleCloudIdentitytoolkitAdminV2DefaultSupportedIdpConfig;
	'authAdmin.tenants.defaultSupportedIdpConfigs.list': FirebaseGoogleCloudIdentitytoolkitAdminV2ListDefaultSupportedIdpConfigsResponse;
	'authAdmin.tenants.defaultSupportedIdpConfigs.patch': FirebaseGoogleCloudIdentitytoolkitAdminV2DefaultSupportedIdpConfig;
	'authAdmin.tenants.delete': FirebaseAuthAdminGoogleProtobufEmpty;
	'authAdmin.tenants.get': FirebaseGoogleCloudIdentitytoolkitAdminV2Tenant;
	'authAdmin.tenants.getIamPolicy': FirebaseGoogleIamV1Policy;
	'authAdmin.tenants.inboundSamlConfigs.create': FirebaseGoogleCloudIdentitytoolkitAdminV2InboundSamlConfig;
	'authAdmin.tenants.inboundSamlConfigs.delete': FirebaseAuthAdminGoogleProtobufEmpty;
	'authAdmin.tenants.inboundSamlConfigs.get': FirebaseGoogleCloudIdentitytoolkitAdminV2InboundSamlConfig;
	'authAdmin.tenants.inboundSamlConfigs.list': FirebaseGoogleCloudIdentitytoolkitAdminV2ListInboundSamlConfigsResponse;
	'authAdmin.tenants.inboundSamlConfigs.patch': FirebaseGoogleCloudIdentitytoolkitAdminV2InboundSamlConfig;
	'authAdmin.tenants.list': FirebaseGoogleCloudIdentitytoolkitAdminV2ListTenantsResponse;
	'authAdmin.tenants.oauthIdpConfigs.create': FirebaseGoogleCloudIdentitytoolkitAdminV2OAuthIdpConfig;
	'authAdmin.tenants.oauthIdpConfigs.delete': FirebaseAuthAdminGoogleProtobufEmpty;
	'authAdmin.tenants.oauthIdpConfigs.get': FirebaseGoogleCloudIdentitytoolkitAdminV2OAuthIdpConfig;
	'authAdmin.tenants.oauthIdpConfigs.list': FirebaseGoogleCloudIdentitytoolkitAdminV2ListOAuthIdpConfigsResponse;
	'authAdmin.tenants.oauthIdpConfigs.patch': FirebaseGoogleCloudIdentitytoolkitAdminV2OAuthIdpConfig;
	'authAdmin.tenants.patch': FirebaseGoogleCloudIdentitytoolkitAdminV2Tenant;
	'authAdmin.tenants.setIamPolicy': FirebaseGoogleIamV1Policy;
	'authAdmin.tenants.testIamPermissions': FirebaseGoogleIamV1TestIamPermissionsResponse;
	'database.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'database.get': FirebaseJsonValue;
	'database.push': {
		/** The generated key. */
		name?: string | null;
	};
	'database.rules.get': {
		/** The rules: ".read", ".write", ".validate" and ".indexOn" entries, nested by path. */
		rules?: Record<string, FirebaseJsonValue> | null;
	};
	'database.rules.set': {
		/** "ok" when the rules were saved. */
		status?: string | null;
	};
	'database.set': FirebaseJsonValue;
	'database.update': FirebaseJsonValue;
	'databaseInstances.locations.instances.create': FirebaseDatabaseInstance;
	'databaseInstances.locations.instances.delete': FirebaseDatabaseInstance;
	'databaseInstances.locations.instances.disable': FirebaseDatabaseInstance;
	'databaseInstances.locations.instances.get': FirebaseDatabaseInstance;
	'databaseInstances.locations.instances.list': FirebaseListDatabaseInstancesResponse;
	'databaseInstances.locations.instances.reenable': FirebaseDatabaseInstance;
	'databaseInstances.locations.instances.undelete': FirebaseDatabaseInstance;
	'firestore.databases.backupSchedules.create': FirebaseGoogleFirestoreAdminV1BackupSchedule;
	'firestore.databases.backupSchedules.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'firestore.databases.backupSchedules.get': FirebaseGoogleFirestoreAdminV1BackupSchedule;
	'firestore.databases.backupSchedules.list': FirebaseGoogleFirestoreAdminV1ListBackupSchedulesResponse;
	'firestore.databases.backupSchedules.patch': FirebaseGoogleFirestoreAdminV1BackupSchedule;
	'firestore.databases.bulkDeleteDocuments': FirebaseFirestoreGoogleLongrunningOperation;
	'firestore.databases.changeStreams.create': FirebaseGoogleFirestoreAdminV1ChangeStream;
	'firestore.databases.changeStreams.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'firestore.databases.changeStreams.get': FirebaseGoogleFirestoreAdminV1ChangeStream;
	'firestore.databases.changeStreams.list': FirebaseGoogleFirestoreAdminV1ListChangeStreamsResponse;
	'firestore.databases.clone': FirebaseFirestoreGoogleLongrunningOperation;
	'firestore.databases.collectionGroups.fields.get': FirebaseGoogleFirestoreAdminV1Field;
	'firestore.databases.collectionGroups.fields.list': FirebaseGoogleFirestoreAdminV1ListFieldsResponse;
	'firestore.databases.collectionGroups.fields.patch': FirebaseFirestoreGoogleLongrunningOperation;
	'firestore.databases.collectionGroups.indexes.create': FirebaseFirestoreGoogleLongrunningOperation;
	'firestore.databases.collectionGroups.indexes.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'firestore.databases.collectionGroups.indexes.get': FirebaseGoogleFirestoreAdminV1Index;
	'firestore.databases.collectionGroups.indexes.list': FirebaseGoogleFirestoreAdminV1ListIndexesResponse;
	'firestore.databases.create': FirebaseFirestoreGoogleLongrunningOperation;
	'firestore.databases.delete': FirebaseFirestoreGoogleLongrunningOperation;
	'firestore.databases.documents.batchGet': Array<FirebaseBatchGetDocumentsResponse>;
	'firestore.databases.documents.batchWrite': FirebaseBatchWriteResponse;
	'firestore.databases.documents.beginTransaction': FirebaseBeginTransactionResponse;
	'firestore.databases.documents.commit': FirebaseCommitResponse;
	'firestore.databases.documents.createDocument': FirebaseDocument;
	'firestore.databases.documents.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'firestore.databases.documents.executePipeline': Array<FirebaseExecutePipelineResponse>;
	'firestore.databases.documents.get': FirebaseDocument;
	'firestore.databases.documents.list': FirebaseListDocumentsResponse;
	'firestore.databases.documents.listCollectionIds': FirebaseListCollectionIdsResponse;
	'firestore.databases.documents.listDocuments': FirebaseListDocumentsResponse;
	'firestore.databases.documents.partitionQuery': FirebasePartitionQueryResponse;
	'firestore.databases.documents.patch': FirebaseDocument;
	'firestore.databases.documents.rollback': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'firestore.databases.documents.runAggregationQuery': Array<FirebaseRunAggregationQueryResponse>;
	'firestore.databases.documents.runQuery': Array<FirebaseRunQueryResponse>;
	'firestore.databases.exportDocuments': FirebaseFirestoreGoogleLongrunningOperation;
	'firestore.databases.get': FirebaseGoogleFirestoreAdminV1Database;
	'firestore.databases.importDocuments': FirebaseFirestoreGoogleLongrunningOperation;
	'firestore.databases.list': FirebaseGoogleFirestoreAdminV1ListDatabasesResponse;
	'firestore.databases.operations.cancel': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'firestore.databases.operations.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'firestore.databases.operations.get': FirebaseFirestoreGoogleLongrunningOperation;
	'firestore.databases.operations.list': FirebaseFirestoreGoogleLongrunningListOperationsResponse;
	'firestore.databases.patch': FirebaseFirestoreGoogleLongrunningOperation;
	'firestore.databases.restore': FirebaseFirestoreGoogleLongrunningOperation;
	'firestore.databases.userCreds.create': FirebaseGoogleFirestoreAdminV1UserCreds;
	'firestore.databases.userCreds.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'firestore.databases.userCreds.disable': FirebaseGoogleFirestoreAdminV1UserCreds;
	'firestore.databases.userCreds.enable': FirebaseGoogleFirestoreAdminV1UserCreds;
	'firestore.databases.userCreds.get': FirebaseGoogleFirestoreAdminV1UserCreds;
	'firestore.databases.userCreds.list': FirebaseGoogleFirestoreAdminV1ListUserCredsResponse;
	'firestore.databases.userCreds.resetPassword': FirebaseGoogleFirestoreAdminV1UserCreds;
	'firestore.locations.backups.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'firestore.locations.backups.get': FirebaseGoogleFirestoreAdminV1Backup;
	'firestore.locations.backups.list': FirebaseGoogleFirestoreAdminV1ListBackupsResponse;
	'firestore.locations.get': FirebaseFirestoreLocation;
	'firestore.locations.list': FirebaseListLocationsResponse;
	'hosting.operations.get': FirebaseHostingOperation;
	'hosting.sites.channels.create': FirebaseChannel;
	'hosting.sites.channels.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'hosting.sites.channels.get': FirebaseChannel;
	'hosting.sites.channels.list': FirebaseListChannelsResponse;
	'hosting.sites.channels.patch': FirebaseChannel;
	'hosting.sites.channels.releases.create': FirebaseHostingRelease;
	'hosting.sites.channels.releases.get': FirebaseHostingRelease;
	'hosting.sites.channels.releases.list': FirebaseHostingListReleasesResponse;
	'hosting.sites.create': FirebaseSite;
	'hosting.sites.customDomains.create': FirebaseHostingOperation;
	'hosting.sites.customDomains.delete': FirebaseHostingOperation;
	'hosting.sites.customDomains.get': FirebaseCustomDomain;
	'hosting.sites.customDomains.list': FirebaseListCustomDomainsResponse;
	'hosting.sites.customDomains.operations.get': FirebaseHostingOperation;
	'hosting.sites.customDomains.operations.list': FirebaseListOperationsResponse;
	'hosting.sites.customDomains.patch': FirebaseHostingOperation;
	'hosting.sites.customDomains.undelete': FirebaseHostingOperation;
	'hosting.sites.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'hosting.sites.domains.create': FirebaseDomain;
	'hosting.sites.domains.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'hosting.sites.domains.get': FirebaseDomain;
	'hosting.sites.domains.list': FirebaseListDomainsResponse;
	'hosting.sites.domains.update': FirebaseDomain;
	'hosting.sites.get': FirebaseSite;
	'hosting.sites.getConfig': FirebaseSiteConfig;
	'hosting.sites.list': FirebaseListSitesResponse;
	'hosting.sites.patch': FirebaseSite;
	'hosting.sites.releases.create': FirebaseHostingRelease;
	'hosting.sites.releases.get': FirebaseHostingRelease;
	'hosting.sites.releases.list': FirebaseHostingListReleasesResponse;
	'hosting.sites.updateConfig': FirebaseSiteConfig;
	'hosting.sites.versions.clone': FirebaseHostingOperation;
	'hosting.sites.versions.create': FirebaseHostingVersion;
	'hosting.sites.versions.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'hosting.sites.versions.files.list': FirebaseListVersionFilesResponse;
	'hosting.sites.versions.get': FirebaseHostingVersion;
	'hosting.sites.versions.list': FirebaseHostingListVersionsResponse;
	'hosting.sites.versions.patch': FirebaseHostingVersion;
	'hosting.sites.versions.populateFiles': FirebasePopulateVersionFilesResponse;
	'management.androidApps.create': FirebaseManagementOperation;
	'management.androidApps.get': FirebaseAndroidApp;
	'management.androidApps.getConfig': FirebaseAndroidAppConfig;
	'management.androidApps.list': FirebaseListAndroidAppsResponse;
	'management.androidApps.patch': FirebaseAndroidApp;
	'management.androidApps.remove': FirebaseManagementOperation;
	'management.androidApps.sha.create': FirebaseShaCertificate;
	'management.androidApps.sha.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'management.androidApps.sha.list': FirebaseListShaCertificatesResponse;
	'management.androidApps.undelete': FirebaseManagementOperation;
	'management.availableProjects.list': FirebaseListAvailableProjectsResponse;
	'management.iosApps.create': FirebaseManagementOperation;
	'management.iosApps.get': FirebaseIosApp;
	'management.iosApps.getConfig': FirebaseIosAppConfig;
	'management.iosApps.list': FirebaseListIosAppsResponse;
	'management.iosApps.patch': FirebaseIosApp;
	'management.iosApps.remove': FirebaseManagementOperation;
	'management.iosApps.undelete': FirebaseManagementOperation;
	'management.operations.get': FirebaseManagementOperation;
	'management.projects.addFirebase': FirebaseManagementOperation;
	'management.projects.addGoogleAnalytics': FirebaseManagementOperation;
	'management.projects.get': FirebaseFirebaseProject;
	'management.projects.getAdminSdkConfig': FirebaseAdminSdkConfig;
	'management.projects.getAnalyticsDetails': FirebaseAnalyticsDetails;
	'management.projects.list': FirebaseListFirebaseProjectsResponse;
	'management.projects.patch': FirebaseFirebaseProject;
	'management.projects.removeAnalytics': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'management.projects.searchApps': FirebaseSearchFirebaseAppsResponse;
	'management.webApps.create': FirebaseManagementOperation;
	'management.webApps.get': FirebaseWebApp;
	'management.webApps.getConfig': FirebaseWebAppConfig;
	'management.webApps.list': FirebaseListWebAppsResponse;
	'management.webApps.patch': FirebaseWebApp;
	'management.webApps.remove': FirebaseManagementOperation;
	'management.webApps.undelete': FirebaseManagementOperation;
	'messaging.messages.send': FirebaseMessage;
	'messaging.registrations.topicSubscriptions.create': FirebaseTopicSubscription;
	'messaging.registrations.topicSubscriptions.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'messaging.registrations.topicSubscriptions.get': FirebaseTopicSubscription;
	'messaging.registrations.topicSubscriptions.list': FirebaseListTopicSubscriptionsResponse;
	'messaging.registrations.topicSubscriptions.patch': FirebaseTopicSubscription;
	'remoteConfig.namespaces.experiments.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'remoteConfig.namespaces.experiments.get': FirebaseExperiment;
	'remoteConfig.namespaces.experiments.list': FirebaseListExperimentsResponse;
	'remoteConfig.namespaces.fetch': FirebaseFetchRemoteConfigResponse;
	'remoteConfig.namespaces.get': FirebaseNamespace;
	'remoteConfig.namespaces.getConditionOrder': FirebaseConditionOrder;
	'remoteConfig.namespaces.getRemoteConfig': FirebaseRemoteConfig;
	'remoteConfig.namespaces.getServerRemoteConfig': FirebaseServerRemoteConfig;
	'remoteConfig.namespaces.list': FirebaseListNamespacesResponse;
	'remoteConfig.namespaces.remoteConfig.downloadDefaults': FileOutput;
	'remoteConfig.namespaces.remoteConfig.listVersions': FirebaseRemoteConfigListVersionsResponse;
	'remoteConfig.namespaces.remoteConfig.rollback': FirebaseRemoteConfig;
	'remoteConfig.namespaces.remoteConfigConditions.create': FirebaseRemoteConfigCondition;
	'remoteConfig.namespaces.remoteConfigConditions.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'remoteConfig.namespaces.remoteConfigConditions.get': FirebaseRemoteConfigCondition;
	'remoteConfig.namespaces.remoteConfigConditions.list': FirebaseListRemoteConfigConditionsResponse;
	'remoteConfig.namespaces.remoteConfigConditions.patch': FirebaseRemoteConfigCondition;
	'remoteConfig.namespaces.remoteConfigParameterGroups.create': FirebaseRemoteConfigParameterGroup;
	'remoteConfig.namespaces.remoteConfigParameterGroups.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'remoteConfig.namespaces.remoteConfigParameterGroups.get': FirebaseRemoteConfigParameterGroup;
	'remoteConfig.namespaces.remoteConfigParameterGroups.list': FirebaseListRemoteConfigParameterGroupsResponse;
	'remoteConfig.namespaces.remoteConfigParameterGroups.patch': FirebaseRemoteConfigParameterGroup;
	'remoteConfig.namespaces.remoteConfigParameters.create': FirebaseRemoteConfigParameter;
	'remoteConfig.namespaces.remoteConfigParameters.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'remoteConfig.namespaces.remoteConfigParameters.get': FirebaseRemoteConfigParameter;
	'remoteConfig.namespaces.remoteConfigParameters.list': FirebaseListRemoteConfigParametersResponse;
	'remoteConfig.namespaces.remoteConfigParameters.patch': FirebaseRemoteConfigParameter;
	'remoteConfig.namespaces.rollouts.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'remoteConfig.namespaces.rollouts.get': FirebaseRollout;
	'remoteConfig.namespaces.rollouts.list': FirebaseListRolloutsResponse;
	'remoteConfig.namespaces.updateConditionOrder': FirebaseConditionOrder;
	'remoteConfig.namespaces.updateRemoteConfig': FirebaseRemoteConfig;
	'remoteConfig.projects.getRemoteConfig': FirebaseRemoteConfig;
	'remoteConfig.projects.updateRemoteConfig': FirebaseRemoteConfig;
	'remoteConfig.remoteConfig.downloadDefaults': FileOutput;
	'remoteConfig.remoteConfig.listVersions': FirebaseRemoteConfigListVersionsResponse;
	'remoteConfig.remoteConfig.rollback': FirebaseRemoteConfig;
	'rules.projects.test': FirebaseTestRulesetResponse;
	'rules.releases.create': FirebaseRulesRelease;
	'rules.releases.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'rules.releases.get': FirebaseRulesRelease;
	'rules.releases.getExecutable': FirebaseGetReleaseExecutableResponse;
	'rules.releases.list': FirebaseRulesListReleasesResponse;
	'rules.releases.patch': FirebaseRulesRelease;
	'rules.rulesets.create': FirebaseRuleset;
	'rules.rulesets.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'rules.rulesets.get': FirebaseRuleset;
	'rules.rulesets.list': FirebaseListRulesetsResponse;
	'storage.buckets.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'storage.buckets.get': FirebaseStorageBucket;
	'storage.buckets.getIamPolicy': FirebasePolicy;
	'storage.buckets.getStorageLayout': FirebaseBucketStorageLayout;
	'storage.buckets.insert': FirebaseStorageBucket;
	'storage.buckets.list': FirebaseBuckets;
	'storage.buckets.lockRetentionPolicy': FirebaseStorageBucket;
	'storage.buckets.operations.advanceRelocateBucket': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'storage.buckets.operations.cancel': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'storage.buckets.operations.get': FirebaseStorageGoogleLongrunningOperation;
	'storage.buckets.operations.list': FirebaseStorageGoogleLongrunningListOperationsResponse;
	'storage.buckets.patch': FirebaseStorageBucket;
	'storage.buckets.relocate': FirebaseStorageGoogleLongrunningOperation;
	'storage.buckets.restore': FirebaseStorageBucket;
	'storage.buckets.setIamPolicy': FirebasePolicy;
	'storage.buckets.testIamPermissions': FirebaseTestIamPermissionsResponse;
	'storage.buckets.update': FirebaseStorageBucket;
	'storage.objects.bulkRestore': FirebaseStorageGoogleLongrunningOperation;
	'storage.objects.compose': FirebaseObject;
	'storage.objects.copy': FirebaseObject;
	'storage.objects.delete': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'storage.objects.download': FileOutput;
	'storage.objects.get': FirebaseObject;
	'storage.objects.getIamPolicy': FirebasePolicy;
	'storage.objects.insert': FirebaseObject;
	'storage.objects.list': FirebaseObjects;
	'storage.objects.move': FirebaseObject;
	'storage.objects.patch': FirebaseObject;
	'storage.objects.restore': FirebaseObject;
	'storage.objects.rewrite': FirebaseRewriteResponse;
	'storage.objects.setIamPolicy': FirebasePolicy;
	'storage.objects.testIamPermissions': FirebaseTestIamPermissionsResponse;
	'storage.objects.update': FirebaseObject;
	'storage.objects.viewFullContext': FirebaseObjectFullContext;
	'storageBuckets.buckets.addFirebase': FirebaseStorageBucketsBucket;
	'storageBuckets.buckets.get': FirebaseStorageBucketsBucket;
	'storageBuckets.buckets.list': FirebaseListBucketsResponse;
	'storageBuckets.buckets.removeFirebase': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'storageBuckets.defaultBucket.create': FirebaseDefaultBucket;
	'storageBuckets.projects.deleteDefaultBucket': {
		/** Firebase accepted the call; it answered with no body (or an empty object). */
		success: true;
	};
	'storageBuckets.projects.getDefaultBucket': FirebaseDefaultBucket;
};
