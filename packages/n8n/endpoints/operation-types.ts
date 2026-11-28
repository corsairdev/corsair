// Generated from n8n's OpenAPI spec (https://github.com/n8n-io/n8n/blob/master/packages/cli/src/public-api/v1/openapi.yml,
// fetched 2026-11-28); n8n-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput, FileOutput } from 'corsair/http';

export type N8nJsonValue =
	| null
	| boolean
	| number
	| string
	| N8nJsonValue[]
	| { [key: string]: N8nJsonValue | undefined };

export const N8N_OPERATION_IDS = [
	'agents.archive',
	'agents.create',
	'agents.delete',
	'agents.executions.list',
	'agents.executions.stop',
	'agents.get',
	'agents.list',
	'agents.publish',
	'agents.run',
	'agents.unarchive',
	'agents.unpublish',
	'agents.update',
	'agents.versions.get',
	'agents.versions.list',
	'aiPreferences.create',
	'aiPreferences.delete',
	'aiPreferences.get',
	'aiPreferences.list',
	'aiPreferences.update',
	'audit.generate',
	'communityPackages.install',
	'communityPackages.list',
	'communityPackages.uninstall',
	'communityPackages.update',
	'credentialTypePolicies.attachments.get',
	'credentialTypePolicies.attachments.replace',
	'credentialTypePolicies.documents.create',
	'credentialTypePolicies.documents.delete',
	'credentialTypePolicies.documents.get',
	'credentialTypePolicies.documents.list',
	'credentialTypePolicies.documents.update',
	'credentialTypePolicies.getInstance',
	'credentialTypePolicies.getProject',
	'credentialTypePolicies.setInstance',
	'credentialTypePolicies.setProject',
	'credentials.create',
	'credentials.delete',
	'credentials.get',
	'credentials.getDependencies',
	'credentials.getSchema',
	'credentials.list',
	'credentials.test',
	'credentials.transfer',
	'credentials.update',
	'dataTables.columns.create',
	'dataTables.columns.delete',
	'dataTables.columns.list',
	'dataTables.columns.update',
	'dataTables.create',
	'dataTables.delete',
	'dataTables.get',
	'dataTables.getDependencies',
	'dataTables.list',
	'dataTables.rows.clear',
	'dataTables.rows.delete',
	'dataTables.rows.insert',
	'dataTables.rows.list',
	'dataTables.rows.update',
	'dataTables.rows.upsert',
	'dataTables.update',
	'discover.get',
	'evaluations.cancelRun',
	'evaluations.getRun',
	'evaluations.listCases',
	'evaluations.listRuns',
	'evaluations.startRun',
	'executions.delete',
	'executions.get',
	'executions.getTags',
	'executions.list',
	'executions.retry',
	'executions.setTags',
	'executions.stop',
	'executions.stopMany',
	'folders.create',
	'folders.delete',
	'folders.get',
	'folders.list',
	'folders.update',
	'insights.getSummary',
	'nodeTypePolicies.attachments.get',
	'nodeTypePolicies.attachments.replace',
	'nodeTypePolicies.documents.create',
	'nodeTypePolicies.documents.delete',
	'nodeTypePolicies.documents.get',
	'nodeTypePolicies.documents.list',
	'nodeTypePolicies.documents.update',
	'nodeTypePolicies.getInstance',
	'nodeTypePolicies.getProject',
	'nodeTypePolicies.setInstance',
	'nodeTypePolicies.setProject',
	'packages.export',
	'packages.import',
	'packages.importSelection',
	'projects.create',
	'projects.delete',
	'projects.list',
	'projects.update',
	'projects.users.add',
	'projects.users.changeRole',
	'projects.users.list',
	'projects.users.remove',
	'promotions.environments.addProject',
	'promotions.environments.apply',
	'promotions.environments.connect',
	'promotions.environments.continueApply',
	'promotions.environments.create',
	'promotions.environments.delete',
	'promotions.environments.disconnect',
	'promotions.environments.get',
	'promotions.environments.getChangeDetails',
	'promotions.environments.list',
	'promotions.environments.listChanges',
	'promotions.environments.listMissingProjects',
	'promotions.environments.listProjects',
	'promotions.environments.promote',
	'promotions.environments.removeProject',
	'promotions.environments.update',
	'promotions.projects.apply',
	'promotions.projects.continueApply',
	'promotions.projects.getChangeDetails',
	'promotions.projects.listChanges',
	'promotions.projects.promote',
	'promotions.providers.create',
	'promotions.providers.delete',
	'promotions.providers.get',
	'promotions.providers.list',
	'promotions.providers.listBranches',
	'promotions.providers.listRepositories',
	'promotions.providers.update',
	'promotions.reviews.get',
	'promotions.reviews.list',
	'promotions.settings.get',
	'promotions.settings.update',
	'roleMappingRules.create',
	'roleMappingRules.delete',
	'roleMappingRules.list',
	'roleMappingRules.move',
	'roleMappingRules.update',
	'roles.create',
	'roles.delete',
	'roles.get',
	'roles.list',
	'roles.update',
	'settings.ldap.get',
	'settings.ldap.listSyncs',
	'settings.ldap.runSync',
	'settings.ldap.update',
	'settings.logStreaming.createDestination',
	'settings.logStreaming.deleteDestination',
	'settings.logStreaming.getDestination',
	'settings.logStreaming.listDestinations',
	'settings.logStreaming.listEventTypes',
	'settings.logStreaming.testDestination',
	'settings.logStreaming.updateDestination',
	'settings.oidc.get',
	'settings.oidc.update',
	'settings.otel.get',
	'settings.otel.testTrace',
	'settings.otel.update',
	'settings.rateLimits.get',
	'settings.rateLimits.update',
	'settings.saml.get',
	'settings.saml.update',
	'settings.securityPolicy.get',
	'settings.securityPolicy.update',
	'sourceControl.getStatus',
	'sourceControl.pull',
	'sourceControl.push',
	'tags.create',
	'tags.delete',
	'tags.get',
	'tags.list',
	'tags.update',
	'users.changeRole',
	'users.delete',
	'users.get',
	'users.invite',
	'users.list',
	'variables.create',
	'variables.delete',
	'variables.list',
	'variables.update',
	'workflows.activate',
	'workflows.archive',
	'workflows.create',
	'workflows.deactivate',
	'workflows.delete',
	'workflows.get',
	'workflows.getDependencies',
	'workflows.getTags',
	'workflows.getVersion',
	'workflows.getVersionLegacy',
	'workflows.list',
	'workflows.listHistory',
	'workflows.publish',
	'workflows.run',
	'workflows.setTags',
	'workflows.transfer',
	'workflows.unarchive',
	'workflows.unpublish',
	'workflows.update',
] as const;

export type N8nOperationId = (typeof N8N_OPERATION_IDS)[number];

export type N8nAgentPublicDtoGenerated = {
	id?: string | null;
	name?: string | null;
	projectId?: string | null;
	project?: {
		id?: string | null;
		name?: string | null;
		type?: string | null;
	} | null;
	availableInMCP?: boolean | null;
	isArchived?: boolean | null;
	versionId?: string | null;
	activeVersionId?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	config?: Record<string, N8nJsonValue> | null;
	configHash?: string | null;
	tools?: {
		[key: string]: {
			code?: string | null;
			/** The tool descriptor. `name` is required; other fields pass through. */
			descriptor?: {
				name?: string | null;
			} | null;
		};
	} | null;
	activeVersion?: {
		versionId?: string | null;
		integrations?: Array<{
			/** The integration type, for example `slack` or `webhook`. */
			type?: string | null;
			credentialId?: string | null;
			/** Platform-specific integration settings. */
			settings?: Record<string, N8nJsonValue> | null;
			/** Channel actions that need approval before they run. */
			approval?: Record<string, N8nJsonValue> | null;
		}> | null;
	} | null;
	parentFolder?: {
		id?: string | null;
		name?: string | null;
		parentFolderId?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
	} | null;
};

export type N8nAiPreferencePublicDtoGenerated = {
	id?: string | null;
	content?: string | null;
	scope?: string | null;
	userId?: string | null;
	projectId?: string | null;
	source?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

export type N8nApplyPackageResultDtoGenerated =
	| {
			environmentId?: string | null;
			git?: {
				commitSha?: string | null;
				branchName?: string | null;
			} | null;
			status?: string | null;
			counts?: {
				projects?: {
					created?: number | null;
					updated?: number | null;
					skipped?: number | null;
					deleted?: number | null;
				} | null;
				folders?: {
					created?: number | null;
					/** Existing folders that Apply moved or renamed to match the branch. */
					updated?: number | null;
					skipped?: number | null;
					/** Updated folders that Apply moved under another parent of their project. Included in `updated`. */
					moved?: number | null;
					/** Updated folders that Apply gave the name on the branch. Included in `updated`. */
					renamed?: number | null;
					removed?: number | null;
				} | null;
				workflows?: {
					created?: number | null;
					updated?: number | null;
					skipped?: number | null;
					/** Updated workflows that Apply also moved to another folder of their project. Included in `updated`. */
					moved?: number | null;
					archived?: number | null;
					deleted?: number | null;
					publishing?: {
						published?: number | null;
						unpublished?: number | null;
						unchanged?: number | null;
						blocked?: number | null;
						failed?: number | null;
					} | null;
				} | null;
				credentials?: {
					matched?: number | null;
					stubbed?: number | null;
					updated?: number | null;
				} | null;
				dataTables?: {
					matched?: number | null;
					created?: number | null;
					updated?: number | null;
				} | null;
				variables?: {
					matched?: number | null;
					created?: number | null;
					updated?: number | null;
					stubbed?: number | null;
					missing?: number | null;
				} | null;
				tags?: {
					matched?: number | null;
					created?: number | null;
					renamed?: number | null;
					reconciled?: number | null;
					skipped?: number | null;
				} | null;
			} | null;
			warnings?: Array<{
				kind?: string | null;
				code?: string | null;
				name?: string | null;
				scope?: {
					kind?: string | null;
				} | null;
				consumers?: Array<{
					project?: {
						id?: string | null;
						name?: string | null;
					} | null;
					workflows?: Array<{
						id?: string | null;
						name?: string | null;
					}> | null;
				}> | null;
			}> | null;
	  }
	| {
			environmentId?: string | null;
			git?: {
				commitSha?: string | null;
				branchName?: string | null;
			} | null;
			status?: string | null;
			check?: N8nPromotionApplyCheckGenerated | null;
	  }
	| {
			environmentId?: string | null;
			git?: {
				commitSha?: string | null;
				branchName?: string | null;
			} | null;
			status?: string | null;
	  };

export type N8nAuditVersionGenerated = {
	name?: string | null;
	nodes?: Array<N8nJsonValue> | null;
	createdAt?: string | null;
	description?: string | null;
	documentationUrl?: string | null;
	hasBreakingChange?: boolean | null;
	hasSecurityFix?: boolean | null;
	hasSecurityIssue?: boolean | null;
	securityIssueFixVersion?: string | null;
};

export type N8nCredentialPublicDtoGenerated = {
	id?: string | null;
	name?: string | null;
	type?: string | null;
	isManaged?: boolean | null;
	isGlobal?: boolean | null;
	isResolvable?: boolean | null;
	resolvableAllowFallback?: boolean | null;
	resolverId?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	/** Present only when credential descriptions are enabled. */
	description?: string | null;
};

export type N8nCredentialTypePolicyAttachmentsPublicDtoGenerated = {
	attachments?: Array<{
		policyId?: string | null;
		rules?: Array<{
			id?: string | null;
			action?: string | null;
			selector?: {
				kind?: string | null;
				value?: string | null;
			} | null;
		}> | null;
		priority?: number | null;
		isFloor?: boolean | null;
	}> | null;
	version?: number | null;
};

export type N8nCredentialTypePolicyDocumentWriteResultPublicDtoGenerated = {
	policy?: {
		id?: string | null;
		kind?: string | null;
		rules?: Array<{
			id?: string | null;
			action?: string | null;
			selector?: {
				kind?: string | null;
				value?: string | null;
			} | null;
		}> | null;
		version?: number | null;
		updatedBy?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
	} | null;
	warnings?: Array<
		| {
				kind?: string | null;
				ruleId?: string | null;
				shadowedByRuleId?: string | null;
		  }
		| {
				kind?: string | null;
				ruleId?: string | null;
		  }
	> | null;
};

export type N8nCredentialTypePolicyEffectivePublicDtoGenerated = {
	scopeId?: string | null;
	rules?: Array<{
		id?: string | null;
		action?: string | null;
		selector?: {
			kind?: string | null;
			value?: string | null;
		} | null;
	}> | null;
	defaultAction?: string | null;
	version?: number | null;
};

export type N8nCredentialTypePolicyEffectiveWriteResultPublicDtoGenerated = {
	scopeId?: string | null;
	rules?: Array<{
		id?: string | null;
		action?: string | null;
		selector?: {
			kind?: string | null;
			value?: string | null;
		} | null;
	}> | null;
	defaultAction?: string | null;
	version?: number | null;
	warnings?: Array<
		| {
				kind?: string | null;
				ruleId?: string | null;
				shadowedByRuleId?: string | null;
		  }
		| {
				kind?: string | null;
				ruleId?: string | null;
		  }
	> | null;
};

export type N8nDataTableColumnPublicDtoGenerated = {
	/** Column ID */
	id?: string | null;
	/** Column name */
	name?: string | null;
	/** Column data type */
	type?: string | null;
	/** Column position */
	index?: number | null;
	/** Timestamp when the column was created */
	createdAt?: string | null;
	/** Timestamp when the column was last updated */
	updatedAt?: string | null;
	/** ID of the data table this column belongs to */
	dataTableId?: string | null;
};

export type N8nDataTablePublicDtoGenerated = {
	/** Unique identifier for the data table */
	id?: string | null;
	/** Name of the data table */
	name?: string | null;
	/** Column definitions */
	columns?: Array<{
		/** Column ID */
		id?: string | null;
		/** Column name */
		name?: string | null;
		/** Column data type */
		type?: string | null;
		/** Column position */
		index?: number | null;
		/** Timestamp when the column was created */
		createdAt?: string | null;
		/** Timestamp when the column was last updated */
		updatedAt?: string | null;
	}> | null;
	/** ID of the project this table belongs to */
	projectId?: string | null;
	/** Timestamp when the table was created */
	createdAt?: string | null;
	/** Timestamp when the table was last updated */
	updatedAt?: string | null;
	/** Physical storage in bytes, including indexes and internal overhead. Not reduced immediately by row deletion, and may be a few seconds stale. */
	sizeBytes?: number | null;
};

export type N8nDependencyListPublicDtoGenerated = {
	data?: Array<{
		/** The relation to the requested resource. `credential`, `dataTable`, `subWorkflow`, `errorWorkflow`: the requested workflow uses this dependency. `parentWorkflow`: this workflow uses the requested resource. `errorWorkflowParent`: this workflow uses the requested workflow as its error workflow.… */
		type?: string | null;
		id?: string | null;
		name?: string | null;
		/** The project that owns the dependency, when it is known. */
		projectId?: string | null;
	}> | null;
	nextCursor?: string | null;
	/** The number of dependencies that you do not have access to. They are not listed. */
	inaccessibleCount?: number | null;
};

export type N8nExecutionTagsPublicDtoGenerated = Array<{
	id?: string | null;
	name?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
}>;

export type N8nImportResultDtoGenerated = {
	package?: {
		sourceN8nVersion?: string | null;
		sourceId?: string | null;
	} | null;
	agents?: Array<{
		/** Agent ID in the package. */
		sourceAgentId?: string | null;
		/** Agent ID on the target instance. New Agents use the package ID. Updated and skipped Agents keep their destination ID. */
		localId?: string | null;
		name?: string | null;
		projectId?: string | null;
		/** Published version on the target after import. Null when no version is published. */
		activeVersionId?: string | null;
		status?: string | null;
		/** Publication outcome. A failed publication does not undo the definition import. */
		publishing?: {
			/** `blocked` means the imported version could not be published and no version is active (for example because the Agent or workflow uses an empty or incomplete credential, or a node type this instance does not have, or an Agent channel needs setup while publication is requested). When a prior… */
			state?: string | null;
			/** Present when `state` is `failed`. Explains why publish or unpublish could not be applied. */
			error?: string | null;
			/** Present when `state` is `blocked`: the imported version could not be published and no version is active. */
			blockedReason?: string | null;
			/** Present when `state` is `unchanged` but the policy wanted to publish the imported version: a prior published version is still active (for example after an update with empty or incomplete credentials). */
			skippedPublishReason?: string | null;
		} | null;
		/** Channel outcome for each external channel in the imported definition. A credential from the package never connects a channel. Empty for skipped Agents. */
		channels?: Array<
			| {
					/** Channel type, for example `slack`. */
					type?: string | null;
					/** The import kept the channel connection that the destination Agent already had. */
					status?: string | null;
			  }
			| {
					/** Channel type, for example `slack`. */
					type?: string | null;
					/** The import saved the channel settings without a connection. Set up the channel in the destination before the Agent can be published. */
					status?: string | null;
					/** `new-channel`: the destination Agent had no connection for this channel. `destination-draft`: the destination Agent has this channel, but its setup is not complete. */
					reason?: string | null;
					/** Link to the destination Agent, where you can set up the channel. */
					setupUrl?: string | null;
			  }
		> | null;
	}> | null;
	counts?: {
		agents?: {
			created?: number | null;
			updated?: number | null;
			skipped?: number | null;
		} | null;
	} | null;
	workflows?: Array<{
		/** Workflow id as it appeared in the package. */
		sourceWorkflowId?: string | null;
		/** Workflow ID on the target instance. New workflows use the package ID. Updated and skipped workflows keep their destination ID. */
		localId?: string | null;
		name?: string | null;
		projectId?: string | null;
		parentFolderId?: string | null;
		/** Published version on the target instance, if any. `null` when the workflow is not published after import. */
		activeVersionId?: string | null;
		/** Whether the workflow is archived on the target after import. Under `new-version` this follows the package's `isArchived` flag. A skipped workflow keeps its own state. */
		isArchived?: boolean | null;
		/** Outcome of applying the selected publishing policy to this workflow. */
		publishing?: {
			/** `blocked` means the imported version could not be published and no version is active (for example because the Agent or workflow uses an empty or incomplete credential, or a node type this instance does not have, or an Agent channel needs setup while publication is requested). When a prior… */
			state?: string | null;
			/** Present when `state` is `failed`. Explains why publish or unpublish could not be applied. */
			error?: string | null;
			/** Present when `state` is `blocked`: the imported version could not be published and no version is active. */
			blockedReason?: string | null;
			/** Present when `state` is `unchanged` but the policy wanted to publish the imported version: a prior published version is still active (for example after an update with empty or incomplete credentials). */
			skippedPublishReason?: string | null;
		} | null;
		/** Import outcome for this package workflow. */
		status?: string | null;
	}> | null;
	/** Workflows removed from the target during this import. */
	removedWorkflows?: Array<{
		/** Id of the removed workflow on this instance. */
		workflowId?: string | null;
		name?: string | null;
		/** Project the workflow was reconciled against. */
		projectId?: string | null;
		/** Folder that held the workflow, or null at the project root. */
		parentFolderId?: string | null;
		/** What actually happened, not what `overwriteDeletionPolicy` asked for: a `hard-delete` whose row could not be dropped yet is reported as `archived`. */
		deletion?: string | null;
	}> | null;
	/** Folders the package does not define that reconciliation left empty, removed by `folderConflictPolicy=overwrite`. A folder still holding anything survives, so target-only content is never swept up. Empty under every other policy. */
	removedFolders?: Array<{
		folderId?: string | null;
		name?: string | null;
		projectId?: string | null;
		/** Folder that held it, or null at the project root. */
		parentFolderId?: string | null;
	}> | null;
	/** Folder shells created or skipped in the target project. */
	folders?: Array<{
		/** Folder id as it appeared in the package. */
		sourceFolderId?: string | null;
		/** Folder id on the target instance (equal to `sourceFolderId`; folder ids are reused). */
		localId?: string | null;
		name?: string | null;
		/** Resolved parent folder on the target, or `null` at the project root. */
		parentFolderId?: string | null;
		/** Import outcome for this package folder. */
		status?: string | null;
	}> | null;
	/** Project shells created, or matched and then updated or left as-is (see `projectConflictPolicy`). Present for project packages; empty when importing loose workflows/folders. */
	projects?: Array<{
		/** Project id as it appeared in the package. */
		sourceProjectId?: string | null;
		/** Project id on the target instance (equal to `sourceProjectId`; project ids are reused). */
		localId?: string | null;
		/** The project's name on the target: the package's under `overwrite`, the pre-existing one under `merge`. */
		name?: string | null;
		/** Import outcome for this package project. `skipped` means the project already existed and its details stay as they are: `projectConflictPolicy=merge` left them untouched, or the package changes none of them. Its contents were still imported. */
		status?: string | null;
	}> | null;
	/** Source id → target id mappings produced during import, one map per entity type. Each value maps an id as it appeared in the package to the id on the target instance. */
	bindings?: {
		/** Source-to-target IDs for created, updated, and skipped package Agents. */
		agents?: { [key: string]: string } | null;
		workflows?: { [key: string]: string } | null;
		/** Credential id from `requirements.credentials` in the package manifest → resolved target credential id on the target instance. Covers both a matched existing credential and a credential that the import created under `credentialMissingMode=create-stub` or `create-with-values`. */
		credentials?: { [key: string]: string } | null;
	} | null;
	/** Source credential ids grouped by whether they matched an existing credential, were created as empty stubs, seeded credentials, or incomplete credentials, or matched a credential that this import updated. Full source→target id mapping is in `bindings.credentials`. */
	credentials?: {
		/** Source credential ids from the package that matched existing credentials on the target instance. */
		matched?: Array<string> | null;
		/** Source credential ids for which empty placeholder credentials were created in the target project. */
		stubbed?: Array<string> | null;
		/** Source credential ids for which credentials were created in the target project with all their source data from the bundled expression values. */
		seeded?: Array<string> | null;
		/** Source credential ids for which credentials were created in the target project with bundled expression values, but the package does not confirm that it carries all source data. These credentials need input. The import does not publish the imported version of workflows that use them… */
		incomplete?: Array<string> | null;
		/** Source credential ids whose matched credential this import changed under `credentialConflictPolicy=overwrite`. These ids are not listed under `matched`. Empty for other policies. */
		updated?: Array<string> | null;
	} | null;
	dataTables?: {
		matched?: number | null;
		created?: number | null;
		updated?: number | null;
	} | null;
	/** Resolution of the package's variable requirements. Names only — values never travel in the response. For project packages these arrays are package-level unions of per-destination outcomes and may overlap (for example, a name may be created with a value in one project and stubbed in another);… */
	variables?: {
		/** Variable names that resolved to an existing variable (importing project's scope first, then global) and were left untouched. A resolved variable this import rewrote is listed under `updated` instead. */
		matched?: Array<string> | null;
		/** Variable names still unresolved after import. Under `variableMissingMode=do-nothing` these are warnings — the import still succeeds and nothing is created. A successful `create-stub` or `create-with-value` import normally leaves this empty. */
		missing?: Array<string> | null;
		/** Variable names created with a package value under `variableMissingMode=create-with-value`. Empty stubs are listed under `stubbed`. */
		created?: Array<string> | null;
		/** Variable names created with an empty value by this import under `variableMissingMode=create-stub`, or because `create-with-value` had no exported value. Empty for other outcomes. */
		stubbed?: Array<string> | null;
		/** Variable names whose existing value this import replaced with the package value under `variableConflictPolicy=overwrite`. Empty for other policies. */
		updated?: Array<string> | null;
	} | null;
	/** Resolution of the tags referenced by the imported workflows, matched by source id. Tag names only. */
	tags?: {
		/** Tags that resolved to an existing tag with the same id and name; attached as-is. */
		matched?: Array<string> | null;
		/** Tags created by this import, by name, under `tagMissingMode=create`. */
		created?: Array<string> | null;
		/** Target tags renamed to the package name under `tagConflictPolicy=rename`; listed by their new name. */
		renamed?: Array<string> | null;
		/** Existing target tags re-keyed to the package (source) id on a name collision under `tagConflictPolicy=rename`; their name, workflow and folder taggings are kept. */
		reconciled?: Array<string> | null;
		/** Tags dropped from the import — not created, not renamed, and not attached to any imported workflow — under `tagMissingMode=do-nothing` or `tagConflictPolicy=skip`. */
		skipped?: Array<string> | null;
	} | null;
};

/** Full LDAP configuration. Every field is returned by GET; send the full object back as PUT body. */
export type N8nLdapConfigurationPublicDtoGenerated = {
	/** Whether LDAP login is enabled. */
	loginEnabled?: boolean | null;
	/** Label shown on the LDAP login button. */
	loginLabel?: string | null;
	/** LDAP server URL. */
	connectionUrl?: string | null;
	/** Whether to allow unauthorized (self-signed) certificates. */
	allowUnauthorizedCerts?: boolean | null;
	/** TLS/SSL security mode for the LDAP connection. */
	connectionSecurity?: string | null;
	/** LDAP server port. */
	connectionPort?: number | null;
	/** Base DN for LDAP search queries. */
	baseDn?: string | null;
	/** DN of the LDAP admin user for binding. */
	bindingAdminDn?: string | null;
	/** Password for the LDAP admin user. Redacted on GET; returns the blanking placeholder when a password is stored, empty string when unset. Send the blanking placeholder from a prior GET to keep the stored password unchanged. */
	bindingAdminPassword?: string | null;
	/** LDAP attribute mapped to the user's first name. */
	firstNameAttribute?: string | null;
	/** LDAP attribute mapped to the user's last name. */
	lastNameAttribute?: string | null;
	/** LDAP attribute mapped to the user's email. */
	emailAttribute?: string | null;
	/** LDAP attribute used for login (usually the same as emailAttribute). */
	loginIdAttribute?: string | null;
	/** LDAP attribute that uniquely identifies a user. */
	ldapIdAttribute?: string | null;
	/** Additional LDAP filter to apply when searching for users. Use an empty string for no additional filter. */
	userFilter?: string | null;
	/** Whether automatic LDAP synchronization is enabled. */
	synchronizationEnabled?: boolean | null;
	/** Interval in minutes between automatic synchronizations. Ignored if synchronizationEnabled is false. */
	synchronizationInterval?: number | null;
	/** Number of LDAP entries to fetch per search page. */
	searchPageSize?: number | null;
	/** LDAP search timeout in seconds. */
	searchTimeout?: number | null;
	/** Whether to enforce that email addresses are unique across LDAP users. When true, if two users have the same email, only the first will be imported. */
	enforceEmailUniqueness?: boolean | null;
	/** Whether an LDAP user may be linked to an existing n8n account that has the same email. When false, login and synchronization skip such users. Optional on PUT; the stored value is kept when omitted. */
	linkExistingAccountsByEmail?: boolean | null;
};

/** A log streaming destination. The `type` field selects the variant and its type-specific fields: `webhook`, `syslog`, or `sentry`. */
export type N8nLogStreamingDestinationPublicDtoGenerated =
	| {
			/** Human-readable name shown in the UI. */
			label?: string | null;
			/** Whether the destination currently receives events. */
			enabled?: boolean | null;
			/** Event names (or group prefixes, e.g. `n8n.workflow`, which matches all `n8n.workflow.*` events) this destination receives. Retrieve the full list of streamable event names from `GET /settings/log-streaming/event-types`. */
			subscribedEvents?: Array<string> | null;
			/** Whether audit message payloads are anonymized before being sent. */
			anonymizeAuditMessages?: boolean | null;
			/** Circuit-breaker tuning for delivery. After repeated failures the destination stops sending for a cool-down window instead of hammering an unhealthy target. All fields are optional; sensible defaults apply when omitted. */
			circuitBreaker?: {
				/** Maximum failures within the sliding window before the breaker opens. */
				maxFailures?: number | null;
				/** Sliding window, in milliseconds, over which failures are counted. */
				failureWindow?: number | null;
			} | null;
			/** Sends each event as an HTTP request to a URL. */
			type?: string | null;
			/** Target URL that receives the event payload. */
			url?: string | null;
			/** HTTP method used for the request. */
			method?: string | null;
			/** Whether to attach custom headers to the request. */
			sendHeaders?: boolean | null;
			/** How custom headers are provided — `keypair` or `json`. */
			specifyHeaders?: string | null;
			/** Key-value pairs used when the matching `specify*` field is `keypair`. */
			headerParameters?: {
				parameters?: Array<{
					name?: string | null;
					/** Parameter value. Usually a string; numbers, booleans and null are also accepted. */
					value?: (string | number | boolean | N8nJsonValue) | null;
				}> | null;
			} | null;
			/** Custom headers as a JSON string when `specifyHeaders` is `json`. */
			jsonHeaders?: string | null;
			/** Whether to attach query parameters to the request. */
			sendQuery?: boolean | null;
			/** How query parameters are provided — `keypair` or `json`. */
			specifyQuery?: string | null;
			/** Key-value pairs used when the matching `specify*` field is `keypair`. */
			queryParameters?: {
				parameters?: Array<{
					name?: string | null;
					/** Parameter value. Usually a string; numbers, booleans and null are also accepted. */
					value?: (string | number | boolean | N8nJsonValue) | null;
				}> | null;
			} | null;
			/** Query parameters as a JSON string when `specifyQuery` is `json`. */
			jsonQuery?: string | null;
			/** Additional HTTP request options. */
			options?: {
				/** Request timeout in milliseconds. */
				timeout?: number | null;
				/** Accept self-signed or otherwise invalid TLS certificates. */
				allowUnauthorizedCerts?: boolean | null;
				/** How array-valued query parameters are serialized into the query string. */
				queryParameterArrays?: string | null;
				/** Redirect-following behaviour. */
				redirect?: {
					redirect?: {
						/** Whether to follow HTTP redirects. */
						followRedirects?: boolean | null;
						/** Maximum number of redirects to follow. */
						maxRedirects?: number | null;
					} | null;
				} | null;
				/** Outbound proxy configuration. */
				proxy?: {
					proxy?: {
						/** Proxy protocol. */
						protocol?: string | null;
						/** Proxy host, without protocol or port. */
						host?: string | null;
						/** Proxy port. */
						port?: number | null;
					} | null;
				} | null;
				/** Connection socket options. */
				socket?: {
					/** Whether to keep sockets open for reuse. */
					keepAlive?: boolean | null;
					/** Maximum sockets per host kept open at once. */
					maxSockets?: number | null;
					/** Maximum idle sockets per host kept open. */
					maxFreeSockets?: number | null;
				} | null;
			} | null;
			/** Server-generated unique id of the destination. Returned in responses; not accepted in requests. */
			id?: string | null;
	  }
	| {
			/** Human-readable name shown in the UI. */
			label?: string | null;
			/** Whether the destination currently receives events. */
			enabled?: boolean | null;
			/** Event names (or group prefixes, e.g. `n8n.workflow`, which matches all `n8n.workflow.*` events) this destination receives. Retrieve the full list of streamable event names from `GET /settings/log-streaming/event-types`. */
			subscribedEvents?: Array<string> | null;
			/** Whether audit message payloads are anonymized before being sent. */
			anonymizeAuditMessages?: boolean | null;
			/** Circuit-breaker tuning for delivery. After repeated failures the destination stops sending for a cool-down window instead of hammering an unhealthy target. All fields are optional; sensible defaults apply when omitted. */
			circuitBreaker?: {
				/** Maximum failures within the sliding window before the breaker opens. */
				maxFailures?: number | null;
				/** Sliding window, in milliseconds, over which failures are counted. */
				failureWindow?: number | null;
			} | null;
			/** Sends each event to a syslog server. */
			type?: string | null;
			/** Syslog server host. */
			host?: string | null;
			/** Syslog server port. */
			port?: number | null;
			/** Transport protocol. */
			protocol?: string | null;
			/** Syslog facility code (0–23, per RFC 5424). Common values: 0 Kernel, 1 User, 3 System, 13 Audit, 14 Alert, 16 Local0, 17 Local1, 18 Local2, 19 Local3, 20 Local4, 21 Local5, 22 Local6, 23 Local7. */
			facility?: number | null;
			/** Application name reported in the syslog message. */
			app_name?: string | null;
			/** PEM-encoded CA certificate used when `protocol` is `tls`. */
			tlsCa?: string | null;
			/** Server-generated unique id of the destination. Returned in responses; not accepted in requests. */
			id?: string | null;
	  }
	| {
			/** Human-readable name shown in the UI. */
			label?: string | null;
			/** Whether the destination currently receives events. */
			enabled?: boolean | null;
			/** Event names (or group prefixes, e.g. `n8n.workflow`, which matches all `n8n.workflow.*` events) this destination receives. Retrieve the full list of streamable event names from `GET /settings/log-streaming/event-types`. */
			subscribedEvents?: Array<string> | null;
			/** Whether audit message payloads are anonymized before being sent. */
			anonymizeAuditMessages?: boolean | null;
			/** Circuit-breaker tuning for delivery. After repeated failures the destination stops sending for a cool-down window instead of hammering an unhealthy target. All fields are optional; sensible defaults apply when omitted. */
			circuitBreaker?: {
				/** Maximum failures within the sliding window before the breaker opens. */
				maxFailures?: number | null;
				/** Sliding window, in milliseconds, over which failures are counted. */
				failureWindow?: number | null;
			} | null;
			/** Sends each event to a Sentry project. */
			type?: string | null;
			/** Sentry DSN the events are sent to. */
			dsn?: string | null;
			/** Server-generated unique id of the destination. Returned in responses; not accepted in requests. */
			id?: string | null;
	  };

export type N8nOidcConfigurationPublicDtoGenerated = {
	/** The client ID issued when registering n8n with the OIDC provider. */
	clientId?: string | null;
	/** The client secret issued when registering n8n with the OIDC provider. Redacted on read when set; never echoed back in plaintext. */
	clientSecret?: string | null;
	/** The OIDC provider's well-known discovery endpoint. */
	discoveryEndpoint?: string | null;
	/** Whether OIDC single sign-on is enabled. */
	loginEnabled?: boolean | null;
	/** The prompt parameter to use when authenticating with the OIDC provider. */
	prompt?: string | null;
	/** ACR values to include in the authorization request (acr_values parameter), in order of preference. */
	authenticationContextClassReference?: Array<string> | null;
	/** Additional scopes to request, space separated. n8n always requests `openid`, `profile` and `email`. */
	additionalScopes?: string | null;
	/** Whether the identity provider must assert that the user's email address is verified before the login is accepted. When disabled, only an explicit negative assertion is rejected. */
	emailVerifiedRequired?: boolean | null;
	/** Whether signing out of n8n also ends the session at the OIDC provider via RP-Initiated Logout. When disabled, sign-out is local to n8n only. */
	rpInitiatedLogoutEnabled?: boolean | null;
};

/** The OpenTelemetry configuration, matching the fields exposed in the UI. On a write this is a full replacement: every field must be provided, except `exporterProtocol`, which defaults to `http/protobuf` when omitted, and `emitWorkflowStartSpan` and `emitNodeStartSpan`, which default to `false`… */
export type N8nOtelSettingsPublicDtoGenerated = {
	/** Whether OpenTelemetry tracing is enabled. */
	enabled?: boolean | null;
	/** The wire protocol used to export spans. Collectors conventionally serve OTLP/HTTP on port 4318 and OTLP/gRPC on port 4317. The endpoint scheme (`http://` or `https://`) controls TLS for both protocols. Optional: a write that omits it selects `http/protobuf`, but an instance that sets this field… */
	exporterProtocol?: string | null;
	/** The base URL of the OTLP collector to export traces to. The value must be an `http://` or `https://` URL, because the scheme selects TLS — for gRPC, `https://` uses SSL and `http://` is plaintext. */
	exporterEndpoint?: string | null;
	/** The path appended to the endpoint for the OTLP traces signal. Ignored when `exporterProtocol` is `grpc`, which takes no URL path. */
	exporterTracingPath?: string | null;
	/** The `service.name` resource attribute reported on every span. */
	exporterServiceName?: string | null;
	/** Additional headers sent to the OTLP collector, as a single string of comma-separated `key=value` pairs (e.g. `authorization=Bearer my-token,x-tenant-id=acme`). Whitespace around each key and value is trimmed; a value may contain spaces but not commas. Use an empty string when unused. */
	exporterHeaders?: string | null;
	/** The ratio of traces to sample, between 0 (none) and 1 (all). */
	tracesSampleRate?: number | null;
	/** How long, in milliseconds, to wait when checking the collector is reachable. Also used as the timeout for the test-trace endpoint. */
	startupConnectivityTimeoutMs?: number | null;
	/** Whether to emit a span for each node execution in addition to the workflow span. */
	includeNodeSpans?: boolean | null;
	/** Whether to emit a `workflow.execute.started` span with a duration of 0 ms when each execution or resumed segment starts. Optional: a write that omits it selects `false`, but an instance that sets this field to `true` with an environment variable rejects that write with 409. */
	emitWorkflowStartSpan?: boolean | null;
	/** Whether to emit a `node.execute.started` span with a duration of 0 ms when each node span starts. This doubles the number of node spans. Has no effect when `includeNodeSpans` is false. Optional: a write that omits it selects `false`, but an instance that sets this field to `true` with an… */
	emitNodeStartSpan?: boolean | null;
	/** Whether to inject trace context headers into outbound HTTP requests made by nodes. */
	injectOutbound?: boolean | null;
	/** When true, only production executions of published (active) workflows are traced, not manual/test runs. */
	productionExecutionsOnly?: boolean | null;
};

export type N8nPolicyAttachmentsPublicDtoGenerated = {
	attachments?: Array<{
		policyId?: string | null;
		rules?: Array<{
			id?: string | null;
			action?: string | null;
			selector?: {
				kind?: string | null;
				value?: string | null;
			} | null;
		}> | null;
		priority?: number | null;
		isFloor?: boolean | null;
	}> | null;
	version?: number | null;
};

export type N8nPolicyDocumentWriteResultPublicDtoGenerated = {
	policy?: {
		id?: string | null;
		kind?: string | null;
		rules?: Array<{
			id?: string | null;
			action?: string | null;
			selector?: {
				kind?: string | null;
				value?: string | null;
			} | null;
		}> | null;
		version?: number | null;
		updatedBy?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
	} | null;
	warnings?: Array<
		| {
				kind?: string | null;
				ruleId?: string | null;
				shadowedByRuleId?: string | null;
		  }
		| {
				kind?: string | null;
				ruleId?: string | null;
		  }
	> | null;
};

export type N8nPolicyEffectivePublicDtoGenerated = {
	scopeId?: string | null;
	rules?: Array<{
		id?: string | null;
		action?: string | null;
		selector?: {
			kind?: string | null;
			value?: string | null;
		} | null;
	}> | null;
	defaultAction?: string | null;
	version?: number | null;
};

export type N8nPolicyEffectiveWriteResultPublicDtoGenerated = {
	scopeId?: string | null;
	rules?: Array<{
		id?: string | null;
		action?: string | null;
		selector?: {
			kind?: string | null;
			value?: string | null;
		} | null;
	}> | null;
	defaultAction?: string | null;
	version?: number | null;
	warnings?: Array<
		| {
				kind?: string | null;
				ruleId?: string | null;
				shadowedByRuleId?: string | null;
		  }
		| {
				kind?: string | null;
				ruleId?: string | null;
		  }
	> | null;
};

export type N8nPromotionApplyCheckGenerated = {
	/** Projects in the package that do not exist on this instance. The check keeps their metadata without checking project creation rules. The project creation API can reject invalid values. */
	missingProjects?: Array<{
		id?: string | null;
		name?: string | null;
		icon?: {
			type?: string | null;
			value?: string | null;
		} | null;
		description?: string | null;
		customTelemetryTags?: Array<{
			key?: string | null;
			value?: string | null;
		}> | null;
	}> | null;
	missingBindings?: Array<
		| {
				kind?: string | null;
				sourceId?: string | null;
				name?: string | null;
				credentialType?: string | null;
				consumers?: Array<{
					project?: {
						id?: string | null;
						name?: string | null;
					} | null;
					workflows?: Array<{
						id?: string | null;
						name?: string | null;
					}> | null;
				}> | null;
				ownerProject?: {
					id?: string | null;
					name?: string | null;
				} | null;
				/** Credential expressions. */
				expressionData?: {
					[key: string]: N8nPromotionCredentialExpressionValueGenerated;
				} | null;
		  }
		| {
				kind?: string | null;
				name?: string | null;
				variableType?: string | null;
				scope?:
					| (
							| {
									kind?: string | null;
							  }
							| {
									kind?: string | null;
									project?: {
										id?: string | null;
										name?: string | null;
									} | null;
							  }
					  )
					| null;
				sourceValue?: string | null;
				consumers?: Array<{
					project?: {
						id?: string | null;
						name?: string | null;
					} | null;
					workflows?: Array<{
						id?: string | null;
						name?: string | null;
					}> | null;
				}> | null;
		  }
	> | null;
	accessRequirements?: Array<{
		kind?: string | null;
		sourceId?: string | null;
		name?: string | null;
		credentialType?: string | null;
		consumers?: Array<{
			project?: {
				id?: string | null;
				name?: string | null;
			} | null;
			workflows?: Array<{
				id?: string | null;
				name?: string | null;
			}> | null;
		}> | null;
		code?: string | null;
	}> | null;
	conflicts?: Array<
		| {
				kind?: string | null;
				sourceId?: string | null;
				name?: string | null;
				expectedTypes?: Array<string> | null;
				filePath?: string | null;
				referenceFiles?: Array<string> | null;
				consumers?: Array<{
					project?: {
						id?: string | null;
						name?: string | null;
					} | null;
					workflows?: Array<{
						id?: string | null;
						name?: string | null;
					}> | null;
				}> | null;
				code?: string | null;
		  }
		| {
				kind?: string | null;
				sourceId?: string | null;
				name?: string | null;
				expectedTypes?: Array<string> | null;
				filePath?: string | null;
				referenceFiles?: Array<string> | null;
				consumers?: Array<{
					project?: {
						id?: string | null;
						name?: string | null;
					} | null;
					workflows?: Array<{
						id?: string | null;
						name?: string | null;
					}> | null;
				}> | null;
				code?: string | null;
				targetType?: string | null;
		  }
		| {
				kind?: string | null;
				sourceId?: string | null;
				name?: string | null;
				expectedTypes?: Array<string> | null;
				filePath?: string | null;
				referenceFiles?: Array<string> | null;
				consumers?: Array<{
					project?: {
						id?: string | null;
						name?: string | null;
					} | null;
					workflows?: Array<{
						id?: string | null;
						name?: string | null;
					}> | null;
				}> | null;
				code?: string | null;
				usageScope?: string | null;
		  }
		| {
				kind?: string | null;
				code?: string | null;
				name?: string | null;
				referenceFiles?: Array<string> | null;
				consumers?: Array<{
					project?: {
						id?: string | null;
						name?: string | null;
					} | null;
					workflows?: Array<{
						id?: string | null;
						name?: string | null;
					}> | null;
				}> | null;
		  }
		| {
				kind?: string | null;
				code?: string | null;
				project?: {
					id?: string | null;
					name?: string | null;
				} | null;
				filePath?: string | null;
				workflows?: Array<{
					id?: string | null;
					name?: string | null;
				}> | null;
		  }
		| {
				kind?: string | null;
				code?: string | null;
				project?: {
					id?: string | null;
					name?: string | null;
				} | null;
		  }
		| {
				kind?: string | null;
				code?: string | null;
				id?: string | null;
				name?: string | null;
				consumers?: Array<{
					project?: {
						id?: string | null;
						name?: string | null;
					} | null;
					workflows?: Array<{
						id?: string | null;
						name?: string | null;
					}> | null;
				}> | null;
				changes?: Array<
					| {
							kind?: string | null;
							column?: string | null;
							type?: string | null;
							destructive?: boolean | null;
					  }
					| {
							kind?: string | null;
							column?: string | null;
							from?: string | null;
							to?: string | null;
							destructive?: boolean | null;
					  }
					| {
							kind?: string | null;
							from?: string | null;
							to?: string | null;
							destructive?: boolean | null;
					  }
					| {
							kind?: string | null;
							destructive?: boolean | null;
					  }
				> | null;
		  }
		| {
				kind?: string | null;
				code?: string | null;
				reason?: string | null;
				consumers?: Array<{
					project?: {
						id?: string | null;
						name?: string | null;
					} | null;
					workflows?: Array<{
						id?: string | null;
						name?: string | null;
					}> | null;
				}> | null;
		  }
		| {
				kind?: string | null;
				code?: string | null;
				id?: string | null;
				name?: string | null;
				reason?: string | null;
				consumers?: Array<{
					project?: {
						id?: string | null;
						name?: string | null;
					} | null;
					workflows?: Array<{
						id?: string | null;
						name?: string | null;
					}> | null;
				}> | null;
		  }
		| {
				kind?: string | null;
				code?: string | null;
				project?: {
					id?: string | null;
					name?: string | null;
				} | null;
				reason?: string | null;
		  }
		| {
				id?: string | null;
				name?: string | null;
				project?: {
					id?: string | null;
					name?: string | null;
				} | null;
				projectExists?: boolean | null;
				instanceProject?: {
					id?: string | null;
					name?: string | null;
				} | null;
				kind?: string | null;
				code?: string | null;
		  }
	> | null;
	warnings?: Array<{
		kind?: string | null;
		code?: string | null;
		name?: string | null;
		scope?: {
			kind?: string | null;
		} | null;
		consumers?: Array<{
			project?: {
				id?: string | null;
				name?: string | null;
			} | null;
			workflows?: Array<{
				id?: string | null;
				name?: string | null;
			}> | null;
		}> | null;
	}> | null;
};

export type N8nPromotionCheckoutPublicDtoGenerated = {
	environmentId?: string | null;
	direction?: string | null;
	branchName?: string | null;
	hasCheckout?: boolean | null;
};

/** Values can be strings, booleans, arrays, or nested objects. A string leaf is an expression, except the plain value of a field that decides which other fields show. */
export type N8nPromotionCredentialExpressionValueGenerated =
	| string
	| boolean
	| Array<N8nPromotionCredentialExpressionValueGenerated>
	| { [key: string]: N8nPromotionCredentialExpressionValueGenerated };

export type N8nPromotionEnvironmentPublicDtoGenerated =
	| {
			id?: string | null;
			name?: string | null;
			scope?: string | null;
			remote?: {
				schemaVersion?: number | null;
				remoteUrl?: string | null;
				/** The stored repository path of a Git host remote. URL-encode it before you use it as repositoryId to list branches. Requests do not accept it. */
				repositoryPath?: string | null;
			} | null;
			provider?: {
				id?: string | null;
				name?: string | null;
				type?: string | null;
				authType?: string | null;
				createdAt?: string | null;
				updatedAt?: string | null;
			} | null;
			createdAt?: string | null;
			updatedAt?: string | null;
			direction?: string | null;
			settings?: {
				schemaVersion?: number | null;
				branchName?: string | null;
			} | null;
			checkout?: {
				hasCheckout?: boolean | null;
				matchesEnvironment?: boolean | null;
			} | null;
	  }
	| {
			id?: string | null;
			name?: string | null;
			scope?: string | null;
			remote?: {
				schemaVersion?: number | null;
				remoteUrl?: string | null;
				/** The stored repository path of a Git host remote. URL-encode it before you use it as repositoryId to list branches. Requests do not accept it. */
				repositoryPath?: string | null;
			} | null;
			provider?: {
				id?: string | null;
				name?: string | null;
				type?: string | null;
				authType?: string | null;
				createdAt?: string | null;
				updatedAt?: string | null;
			} | null;
			createdAt?: string | null;
			updatedAt?: string | null;
			direction?: string | null;
			settings?: {
				schemaVersion?: number | null;
				baseBranchName?: string | null;
				createBranchOnPromotion?: boolean | null;
			} | null;
			checkout?: {
				hasCheckout?: boolean | null;
				matchesEnvironment?: boolean | null;
			} | null;
	  };

export type N8nPromotionProviderPublicDtoGenerated = {
	id?: string | null;
	name?: string | null;
	type?: string | null;
	authType?: string | null;
	config?:
		| (
				| {
						schemaVersion?: number | null;
						publicKey?: string | null;
						keyType?: string | null;
				  }
				| {
						schemaVersion?: number | null;
				  }
				| {
						schemaVersion?: number | null;
						baseUrl?: string | null;
				  }
		  )
		| null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

export type N8nPromotionResourceGenerated = {
	key?: string | null;
	type?: string | null;
	id?: string | null;
	name?: string | null;
	previousName?: string | null;
	previousId?: string | null;
	/** The `key` of the project or folder that holds the resource. `null` for instance-wide resources. */
	parentKey?: string | null;
	previousParentKey?: string | null;
	/** How the operation changes the resource. `unchanged` resources give context, such as a parent folder or a workflow that uses a changed credential. */
	change?: string | null;
	/** Whether the resource can be selected for Promote or Apply: a workflow, a project or folder that is added or modified, or on Promote a credential that the project owns and that is added or modified. Other credentials, data tables, variables and tags come with the workflows that use them. */
	selectable?: boolean | null;
	movedToProject?: {
		id?: string | null;
		name?: string | null;
	} | null;
	movedFromProject?: {
		id?: string | null;
		name?: string | null;
	} | null;
	revision?: {
		before?: string | null;
		after?: string | null;
	} | null;
};

export type N8nPromotionResourceDetailGenerated =
	| {
			key?: string | null;
			type?: string | null;
			before?: {
				id?: string | null;
				name?: string | null;
				description?: string | null;
				icon?: {
					type?: string | null;
					value?: string | null;
				} | null;
				customTelemetryTags?: Array<{
					key?: string | null;
					value?: string | null;
				}> | null;
			} | null;
			after?: {
				id?: string | null;
				name?: string | null;
				description?: string | null;
				icon?: {
					type?: string | null;
					value?: string | null;
				} | null;
				customTelemetryTags?: Array<{
					key?: string | null;
					value?: string | null;
				}> | null;
			} | null;
			revision?: {
				before?: string | null;
				after?: string | null;
			} | null;
	  }
	| {
			key?: string | null;
			type?: string | null;
			before?: {
				id?: string | null;
				name?: string | null;
				resourceType?: string | null;
				parentFolderId?: string | null;
			} | null;
			after?: {
				id?: string | null;
				name?: string | null;
				resourceType?: string | null;
				parentFolderId?: string | null;
			} | null;
			revision?: {
				before?: string | null;
				after?: string | null;
			} | null;
	  }
	| {
			key?: string | null;
			type?: string | null;
			before?: {
				id?: string | null;
				name?: string | null;
				description?: string | null;
				nodes?: Array<{
					id?: string | null;
					name?: string | null;
					type?: string | null;
					typeVersion?: number | null;
					position?: Array<number> | null;
					parameters?: Record<string, N8nJsonValue> | null;
					credentials?: {
						[key: string]: {
							id?: string | null;
							name?: string | null;
							__aiGatewayManaged?: boolean | null;
						};
					} | null;
					disabled?: boolean | null;
					notes?: string | null;
					notesInFlow?: boolean | null;
					continueOnFail?: boolean | null;
					retryOnFail?: boolean | null;
					maxTries?: number | null;
					waitBetweenTries?: number | null;
					alwaysOutputData?: boolean | null;
					executeOnce?: boolean | null;
					onError?: string | null;
					webhookId?: string | null;
				}> | null;
				connections?: {
					[key: string]: {
						[key: string]: Array<Array<{
							node?: string | null;
							type?: string | null;
							index?: number | null;
						}> | null>;
					};
				} | null;
				nodeGroups?: Array<{
					id?: string | null;
					name?: string | null;
					nodeIds?: Array<string> | null;
					description?: string | null;
				}> | null;
				settings?: Record<string, N8nJsonValue> | null;
				parentFolderId?: string | null;
				isArchived?: boolean | null;
				tagIds?: Array<string> | null;
			} | null;
			after?: {
				id?: string | null;
				name?: string | null;
				description?: string | null;
				nodes?: Array<{
					id?: string | null;
					name?: string | null;
					type?: string | null;
					typeVersion?: number | null;
					position?: Array<number> | null;
					parameters?: Record<string, N8nJsonValue> | null;
					credentials?: {
						[key: string]: {
							id?: string | null;
							name?: string | null;
							__aiGatewayManaged?: boolean | null;
						};
					} | null;
					disabled?: boolean | null;
					notes?: string | null;
					notesInFlow?: boolean | null;
					continueOnFail?: boolean | null;
					retryOnFail?: boolean | null;
					maxTries?: number | null;
					waitBetweenTries?: number | null;
					alwaysOutputData?: boolean | null;
					executeOnce?: boolean | null;
					onError?: string | null;
					webhookId?: string | null;
				}> | null;
				connections?: {
					[key: string]: {
						[key: string]: Array<Array<{
							node?: string | null;
							type?: string | null;
							index?: number | null;
						}> | null>;
					};
				} | null;
				nodeGroups?: Array<{
					id?: string | null;
					name?: string | null;
					nodeIds?: Array<string> | null;
					description?: string | null;
				}> | null;
				settings?: Record<string, N8nJsonValue> | null;
				parentFolderId?: string | null;
				isArchived?: boolean | null;
				tagIds?: Array<string> | null;
			} | null;
			revision?: {
				before?: string | null;
				after?: string | null;
			} | null;
	  }
	| {
			key?: string | null;
			type?: string | null;
			before?: {
				id?: string | null;
				name?: string | null;
				type?: string | null;
				description?: string | null;
				data?: {
					[key: string]: N8nPromotionCredentialExpressionValueGenerated;
				} | null;
				dataIsComplete?: boolean | null;
			} | null;
			after?: {
				id?: string | null;
				name?: string | null;
				type?: string | null;
				description?: string | null;
				data?: {
					[key: string]: N8nPromotionCredentialExpressionValueGenerated;
				} | null;
				dataIsComplete?: boolean | null;
			} | null;
			revision?: {
				before?: string | null;
				after?: string | null;
			} | null;
	  }
	| {
			key?: string | null;
			type?: string | null;
			before?: {
				id?: string | null;
				name?: string | null;
				columns?: Array<{
					id?: string | null;
					name?: string | null;
					type?: string | null;
					index?: number | null;
				}> | null;
			} | null;
			after?: {
				id?: string | null;
				name?: string | null;
				columns?: Array<{
					id?: string | null;
					name?: string | null;
					type?: string | null;
					index?: number | null;
				}> | null;
			} | null;
			revision?: {
				before?: string | null;
				after?: string | null;
			} | null;
			dataTableChanges?: Array<
				| {
						kind?: string | null;
						column?: string | null;
						type?: string | null;
						destructive?: boolean | null;
				  }
				| {
						kind?: string | null;
						column?: string | null;
						from?: string | null;
						to?: string | null;
						destructive?: boolean | null;
				  }
				| {
						kind?: string | null;
						from?: string | null;
						to?: string | null;
						destructive?: boolean | null;
				  }
				| {
						kind?: string | null;
						destructive?: boolean | null;
				  }
			> | null;
	  }
	| {
			key?: string | null;
			type?: string | null;
			before?: {
				name?: string | null;
				type?: string | null;
				value?: string | null;
			} | null;
			after?: {
				name?: string | null;
				type?: string | null;
				value?: string | null;
			} | null;
			revision?: {
				before?: string | null;
				after?: string | null;
			} | null;
			valueHidden?: boolean | null;
	  }
	| {
			key?: string | null;
			type?: string | null;
			before?: {
				id?: string | null;
				name?: string | null;
			} | null;
			after?: {
				id?: string | null;
				name?: string | null;
			} | null;
			revision?: {
				before?: string | null;
				after?: string | null;
			} | null;
	  };

export type N8nPromotionResourceDetailsDtoGenerated = {
	details?: Array<N8nPromotionResourceDetailGenerated> | null;
	missingKeys?: Array<string> | null;
};

export type N8nPromotionSettingsPublicDtoGenerated = {
	/** Who can promote a project and see its promotion reviews. `instanceAdmins`: only instance owners and admins. `projectAdmins`: also project admins, in their projects. `projectAdminsAndEditors`: also project admins and editors, in their projects. */
	whoCanPromote?: string | null;
	/** Who can see and approve the promotion reviews of a project. `instanceAdmins`: only instance owners and admins. `projectAdmins`: also project admins, in their projects. `projectAdminsAndEditors`: also project admins and editors, in their projects. */
	whoCanApprove?: string | null;
	/** Who can apply changes into a project. `instanceAdmins`: only instance owners and admins. `projectAdmins`: also project admins, in their projects. `projectAdminsAndEditors`: also project admins and editors, in their projects. */
	whoCanApply?: string | null;
	/** Whether a promote needs a review. `whenConfigured`: each Promote environment uses its own review setting. `alwaysRequired`: every promote pushes a new branch. With a `gitlab` provider, it also opens a merge request. With a `git` provider, n8n cannot see the review and cannot stop direct pushes. */
	requireApproval?: string | null;
};

export type N8nRateLimitSettingsPublicDtoGenerated = {
	/** Whether Public API rate limiting is enabled. */
	enabled?: boolean | null;
	/** Read requests allowed for one API key across all endpoints. Set 0 for no limit. */
	globalReadLimit?: number | null;
	/** The window for the global read limit, in seconds. */
	globalReadWindowSeconds?: number | null;
	/** Write requests allowed for one API key across all endpoints. Set 0 for no limit. */
	globalWriteLimit?: number | null;
	/** The window for the global write limit, in seconds. */
	globalWriteWindowSeconds?: number | null;
	/** Read requests allowed for one API key on one endpoint. Set 0 for no limit. */
	endpointReadLimit?: number | null;
	/** The window for the endpoint read limit, in seconds. */
	endpointReadWindowSeconds?: number | null;
	/** Write requests allowed for one API key on one endpoint. Set 0 for no limit. */
	endpointWriteLimit?: number | null;
	/** The window for the endpoint write limit, in seconds. */
	endpointWriteWindowSeconds?: number | null;
	/** Fields controlled by environment variables, including _FILE variables. These fields return their effective values. A PUT can repeat these values but cannot change them. */
	envManagedFields?: Array<string> | null;
};

export type N8nRoleMappingRulePublicDtoGenerated = {
	id?: string | null;
	expression?: string | null;
	role?: string | null;
	type?: string | null;
	order?: number | null;
	projectIds?: Array<string> | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

export type N8nRolePublicDtoGenerated = {
	slug?: string | null;
	displayName?: string | null;
	description?: string | null;
	systemRole?: boolean | null;
	roleType?: string | null;
	scopes?: Array<string> | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

export type N8nSamlConfigurationPublicDtoGenerated = {
	/** Service provider entity ID (metadata URL). */
	entityID?: string | null;
	/** Assertion Consumer Service (ACS) return URL. */
	returnUrl?: string | null;
	/** Mapping of SAML attributes to n8n user fields. */
	mapping?: {
		/** SAML attribute mapped to the user's email. */
		email?: string | null;
		/** SAML attribute mapped to the user's first name. */
		firstName?: string | null;
		/** SAML attribute mapped to the user's last name. */
		lastName?: string | null;
		/** SAML attribute mapped to the user's principal name. */
		userPrincipalName?: string | null;
		/** SAML attribute that states whether the identity provider verified the user's email. An empty string when unused. */
		emailVerified?: string | null;
		/** SAML attribute mapped to the n8n instance role. */
		n8nInstanceRole?: string | null;
		/** SAML attributes mapped to n8n project roles, formatted as `<projectId>:<role>`. */
		n8nProjectRoles?: Array<string> | null;
	} | null;
	/** Identity provider metadata in XML format. Redacted on read when set because it contains IdP certificates; never echoed back in plaintext. Use an empty string when unset. */
	metadata?: string | null;
	/** URL to fetch identity provider metadata from. Use an empty string when unset. */
	metadataUrl?: string | null;
	/** Whether to ignore SSL certificate errors when fetching metadata from a URL. */
	ignoreSSL?: boolean | null;
	/** SAML login request binding. */
	loginBinding?: string | null;
	/** Whether SAML login is enabled. */
	loginEnabled?: boolean | null;
	/** Label shown on the SAML login button. */
	loginLabel?: string | null;
	/** Whether authentication requests are signed. */
	authnRequestsSigned?: boolean | null;
	/** Whether signed assertions are required. */
	wantAssertionsSigned?: boolean | null;
	/** Whether signed SAML messages are required. */
	wantMessageSigned?: boolean | null;
	/** Whether the identity provider must assert that the user's email address is verified before a login is linked to an existing user by email. When disabled, only an explicit negative assertion is rejected. */
	emailVerifiedRequired?: boolean | null;
	/** PEM-encoded private key for signing SAML AuthnRequests. Redacted on read when set; never echoed back in plaintext. Use an empty string when unset. */
	signingPrivateKey?: string | null;
	/** PEM-encoded certificate containing the public key matching the signing private key. Redacted on read when set; never echoed back in plaintext. Use an empty string when unset. */
	signingCertificate?: string | null;
	/** Assertion Consumer Service binding. */
	acsBinding?: string | null;
	/** Configuration for the signature in SAML requests and responses. */
	signatureConfig?: {
		prefix?: string | null;
		location?: {
			reference?: string | null;
			action?: string | null;
		} | null;
	} | null;
	/** Default relay state value for SAML requests. Use an empty string when unset. */
	relayState?: string | null;
};

export type N8nSecurityPolicyPublicDtoGenerated = {
	/** Whether members may publish workflows and agents from their personal space. */
	personalSpacePublishing?: boolean | null;
	/** Whether members may share workflows and credentials from their personal space. */
	personalSpaceSharing?: boolean | null;
	/** Number of currently published personal workflows, shown for awareness before tightening the policy. */
	publishedPersonalWorkflowsCount?: number | null;
	/** Number of personal workflows currently shared with other users. */
	sharedPersonalWorkflowsCount?: number | null;
	/** Number of personal credentials currently shared with other users. */
	sharedPersonalCredentialsCount?: number | null;
	redactionEnforcement?: {
		/** Minimum execution-data redaction level enforced across the instance. */
		floor?: string | null;
	} | null;
};

export type N8nTagPublicDtoGenerated = {
	id?: string | null;
	name?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

export type N8nWorkflowPublicDtoGenerated = {
	id?: string | null;
	name?: string | null;
	description?: string | null;
	/** Deprecated. Check whether `activeVersionId` is not null instead. */
	active?: boolean | null;
	activeVersionId?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	isArchived?: boolean | null;
	versionId?: string | null;
	versionCounter?: number | null;
	sourceWorkflowId?: string | null;
	triggerCount?: number | null;
	/** Nodes that make up the workflow */
	nodes?: Array<{
		id?: string | null;
		name?: string | null;
		webhookId?: string | null;
		disabled?: boolean | null;
		notesInFlow?: boolean | null;
		notes?: string | null;
		type?: string | null;
		typeVersion?: number | null;
		executeOnce?: boolean | null;
		alwaysOutputData?: boolean | null;
		retryOnFail?: boolean | null;
		maxTries?: number | null;
		waitBetweenTries?: number | null;
		/** use onError instead */
		continueOnFail?: boolean | null;
		onError?: string | null;
		position?: Array<number> | null;
		parameters?: Record<string, N8nJsonValue> | null;
		credentials?: Record<string, N8nJsonValue> | null;
		customTelemetryTags?: {
			tag?: Array<{
				key?: string | null;
				value?: string | null;
			}> | null;
		} | null;
	}> | null;
	/** Connections between nodes, keyed by source node name */
	connections?: Record<string, N8nJsonValue> | null;
	/** Visual groupings of nodes shown as frames on the canvas */
	nodeGroups?: Array<{
		/** Unique identifier for the node group */
		id?: string | null;
		/** Display name of the node group */
		name?: string | null;
		/** Optional plain-text description of the node group */
		description?: string | null;
		/** IDs of the nodes that belong to this group */
		nodeIds?: Array<string> | null;
	}> | null;
	/** Execution and behaviour settings for the workflow */
	settings?: {
		saveExecutionProgress?: (boolean | string) | null;
		saveManualExecutions?: (boolean | string) | null;
		saveDataErrorExecution?: string | null;
		saveDataSuccessExecution?: string | null;
		executionTimeout?: number | null;
		/** The ID of the workflow that contains the error trigger node. */
		errorWorkflow?: string | null;
		timezone?: string | null;
		executionOrder?: string | null;
		/** Controls how binary data is resolved from a node's input. This is a derived, internal setting rather than something intended to be set programmatically. It is included in workflow responses for reference, but any value sent when creating or updating a workflow is ignored. */
		binaryMode?: string | null;
		/** The execution engine that runs this workflow. n8n sets it on new workflows when the instance runs new workflows on engine v2 (`N8N_ENGINE_DEFAULT_TYPE=v2` with the `engine-v2` module enabled). It is included in workflow responses for reference, but any value sent when creating or updating a… */
		engineType?: string | null;
		/** Controls which workflows are allowed to call this workflow using the Execute Workflow node. Defaults to workflowsFromSameOwner. Available options: - `any`: Any workflow can call this workflow (no restrictions) - `none`: No other workflows can call this workflow (completely blocked) -… */
		callerPolicy?: string | null;
		/** Comma-separated list of workflow IDs allowed to call this workflow (only used with the workflowsFromAList policy) */
		callerIds?: string | null;
		/** Controls how the time saved per execution is calculated. Available options: - `fixed`: Uses the value in `timeSavedPerExecution`. Use when the time saved is the same for every execution. - `dynamic`: Calculates the time saved from actual execution metrics. `timeSavedPerExecution` is ignored. */
		timeSavedMode?: string | null;
		/** Estimated time saved per execution in minutes */
		timeSavedPerExecution?: number | null;
		/** Controls whether execution data is redacted for this workflow. Available options: - `none` (default): No redaction. All execution data is stored. - `non-manual`: Redact production (non-manually triggered) executions only. - `manual-only`: Redact manually triggered executions only. - `all`:… */
		redactionPolicy?: string | null;
		/** Controls whether a workflow that calls this workflow as a sub-workflow has its executions redacted on the same channels as this workflow. The calling execution keeps a copy of the output of this workflow. Defaults to true. Turn it off only when the output of this workflow is not sensitive.… */
		redactCallerExecutions?: boolean | null;
		/** Controls whether this workflow is reachable over the Model Context Protocol (MCP). Defaults to false. The workflow must be active and must hold at least one active Webhook node. */
		availableInMCP?: boolean | null;
		customTelemetryTags?: Array<{
			key?: string | null;
			value?: string | null;
		}> | null;
		/** ID of the credential resolver that resolves credentials for this workflow. This is a derived, internal setting managed through the credential resolver configuration rather than something intended to be set programmatically. It is included in workflow responses for reference, but any value sent… */
		credentialResolverId?: string | null;
	} | null;
	/** Data the workflow keeps between executions */
	staticData?: Record<string, N8nJsonValue> | null;
	/** Pinned sample data for nodes, keyed by node name */
	pinData?: Record<string, N8nJsonValue> | null;
	/** Workflow metadata such as template information */
	meta?: {
		onboardingId?: string | null;
		templateId?: string | null;
		instanceId?: string | null;
		templateCredsSetupCompleted?: boolean | null;
	} | null;
	tags?: Array<{
		id?: string | null;
		name?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
	}> | null;
	shared?: Array<{
		role?: string | null;
		workflowId?: string | null;
		projectId?: string | null;
		project?: {
			id?: string | null;
			name?: string | null;
			type?: string | null;
			/** Icon of the project, or null when the project has none */
			icon?: {
				type?: string | null;
				value?: string | null;
				color?: string | null;
			} | null;
			description?: string | null;
			customTelemetryTags?: Array<{
				key?: string | null;
				value?: string | null;
			}> | null;
			creatorId?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		} | null;
		createdAt?: string | null;
		updatedAt?: string | null;
	}> | null;
	activeVersion?: {
		versionId?: string | null;
		workflowId?: string | null;
		/** Nodes that make up the workflow */
		nodes?: Array<{
			id?: string | null;
			name?: string | null;
			webhookId?: string | null;
			disabled?: boolean | null;
			notesInFlow?: boolean | null;
			notes?: string | null;
			type?: string | null;
			typeVersion?: number | null;
			executeOnce?: boolean | null;
			alwaysOutputData?: boolean | null;
			retryOnFail?: boolean | null;
			maxTries?: number | null;
			waitBetweenTries?: number | null;
			/** use onError instead */
			continueOnFail?: boolean | null;
			onError?: string | null;
			position?: Array<number> | null;
			parameters?: Record<string, N8nJsonValue> | null;
			credentials?: Record<string, N8nJsonValue> | null;
			customTelemetryTags?: {
				tag?: Array<{
					key?: string | null;
					value?: string | null;
				}> | null;
			} | null;
		}> | null;
		/** Connections between nodes, keyed by source node name */
		connections?: Record<string, N8nJsonValue> | null;
		/** Visual groupings of nodes shown as frames on the canvas */
		nodeGroups?: Array<{
			/** Unique identifier for the node group */
			id?: string | null;
			/** Display name of the node group */
			name?: string | null;
			/** Optional plain-text description of the node group */
			description?: string | null;
			/** IDs of the nodes that belong to this group */
			nodeIds?: Array<string> | null;
		}> | null;
		authors?: string | null;
		name?: string | null;
		description?: string | null;
		autosaved?: boolean | null;
		createdAt?: string | null;
		updatedAt?: string | null;
		workflowPublishHistory?: Array<{
			id?: number | null;
			workflowId?: string | null;
			versionId?: string | null;
			event?: string | null;
			userId?: string | null;
			createdAt?: string | null;
		}> | null;
	} | null;
};

export type N8nWorkflowPublishPublicDtoGenerated = {
	id?: string | null;
	name?: string | null;
	description?: string | null;
	/** Deprecated. Check whether `activeVersionId` is not null instead. */
	active?: boolean | null;
	activeVersionId?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	isArchived?: boolean | null;
	versionId?: string | null;
	versionCounter?: number | null;
	sourceWorkflowId?: string | null;
	triggerCount?: number | null;
	/** Nodes that make up the workflow */
	nodes?: Array<{
		id?: string | null;
		name?: string | null;
		webhookId?: string | null;
		disabled?: boolean | null;
		notesInFlow?: boolean | null;
		notes?: string | null;
		type?: string | null;
		typeVersion?: number | null;
		executeOnce?: boolean | null;
		alwaysOutputData?: boolean | null;
		retryOnFail?: boolean | null;
		maxTries?: number | null;
		waitBetweenTries?: number | null;
		/** use onError instead */
		continueOnFail?: boolean | null;
		onError?: string | null;
		position?: Array<number> | null;
		parameters?: Record<string, N8nJsonValue> | null;
		credentials?: Record<string, N8nJsonValue> | null;
		customTelemetryTags?: {
			tag?: Array<{
				key?: string | null;
				value?: string | null;
			}> | null;
		} | null;
	}> | null;
	/** Connections between nodes, keyed by source node name */
	connections?: Record<string, N8nJsonValue> | null;
	/** Visual groupings of nodes shown as frames on the canvas */
	nodeGroups?: Array<{
		/** Unique identifier for the node group */
		id?: string | null;
		/** Display name of the node group */
		name?: string | null;
		/** Optional plain-text description of the node group */
		description?: string | null;
		/** IDs of the nodes that belong to this group */
		nodeIds?: Array<string> | null;
	}> | null;
	/** Execution and behaviour settings for the workflow */
	settings?: {
		saveExecutionProgress?: (boolean | string) | null;
		saveManualExecutions?: (boolean | string) | null;
		saveDataErrorExecution?: string | null;
		saveDataSuccessExecution?: string | null;
		executionTimeout?: number | null;
		/** The ID of the workflow that contains the error trigger node. */
		errorWorkflow?: string | null;
		timezone?: string | null;
		executionOrder?: string | null;
		/** Controls how binary data is resolved from a node's input. This is a derived, internal setting rather than something intended to be set programmatically. It is included in workflow responses for reference, but any value sent when creating or updating a workflow is ignored. */
		binaryMode?: string | null;
		/** The execution engine that runs this workflow. n8n sets it on new workflows when the instance runs new workflows on engine v2 (`N8N_ENGINE_DEFAULT_TYPE=v2` with the `engine-v2` module enabled). It is included in workflow responses for reference, but any value sent when creating or updating a… */
		engineType?: string | null;
		/** Controls which workflows are allowed to call this workflow using the Execute Workflow node. Defaults to workflowsFromSameOwner. Available options: - `any`: Any workflow can call this workflow (no restrictions) - `none`: No other workflows can call this workflow (completely blocked) -… */
		callerPolicy?: string | null;
		/** Comma-separated list of workflow IDs allowed to call this workflow (only used with the workflowsFromAList policy) */
		callerIds?: string | null;
		/** Controls how the time saved per execution is calculated. Available options: - `fixed`: Uses the value in `timeSavedPerExecution`. Use when the time saved is the same for every execution. - `dynamic`: Calculates the time saved from actual execution metrics. `timeSavedPerExecution` is ignored. */
		timeSavedMode?: string | null;
		/** Estimated time saved per execution in minutes */
		timeSavedPerExecution?: number | null;
		/** Controls whether execution data is redacted for this workflow. Available options: - `none` (default): No redaction. All execution data is stored. - `non-manual`: Redact production (non-manually triggered) executions only. - `manual-only`: Redact manually triggered executions only. - `all`:… */
		redactionPolicy?: string | null;
		/** Controls whether a workflow that calls this workflow as a sub-workflow has its executions redacted on the same channels as this workflow. The calling execution keeps a copy of the output of this workflow. Defaults to true. Turn it off only when the output of this workflow is not sensitive.… */
		redactCallerExecutions?: boolean | null;
		/** Controls whether this workflow is reachable over the Model Context Protocol (MCP). Defaults to false. The workflow must be active and must hold at least one active Webhook node. */
		availableInMCP?: boolean | null;
		customTelemetryTags?: Array<{
			key?: string | null;
			value?: string | null;
		}> | null;
		/** ID of the credential resolver that resolves credentials for this workflow. This is a derived, internal setting managed through the credential resolver configuration rather than something intended to be set programmatically. It is included in workflow responses for reference, but any value sent… */
		credentialResolverId?: string | null;
	} | null;
	/** Data the workflow keeps between executions */
	staticData?: Record<string, N8nJsonValue> | null;
	/** Pinned sample data for nodes, keyed by node name */
	pinData?: Record<string, N8nJsonValue> | null;
	/** Workflow metadata such as template information */
	meta?: {
		onboardingId?: string | null;
		templateId?: string | null;
		instanceId?: string | null;
		templateCredsSetupCompleted?: boolean | null;
	} | null;
	tags?: Array<{
		id?: string | null;
		name?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
	}> | null;
	activeVersion?: {
		versionId?: string | null;
		workflowId?: string | null;
		/** Nodes that make up the workflow */
		nodes?: Array<{
			id?: string | null;
			name?: string | null;
			webhookId?: string | null;
			disabled?: boolean | null;
			notesInFlow?: boolean | null;
			notes?: string | null;
			type?: string | null;
			typeVersion?: number | null;
			executeOnce?: boolean | null;
			alwaysOutputData?: boolean | null;
			retryOnFail?: boolean | null;
			maxTries?: number | null;
			waitBetweenTries?: number | null;
			/** use onError instead */
			continueOnFail?: boolean | null;
			onError?: string | null;
			position?: Array<number> | null;
			parameters?: Record<string, N8nJsonValue> | null;
			credentials?: Record<string, N8nJsonValue> | null;
			customTelemetryTags?: {
				tag?: Array<{
					key?: string | null;
					value?: string | null;
				}> | null;
			} | null;
		}> | null;
		/** Connections between nodes, keyed by source node name */
		connections?: Record<string, N8nJsonValue> | null;
		/** Visual groupings of nodes shown as frames on the canvas */
		nodeGroups?: Array<{
			/** Unique identifier for the node group */
			id?: string | null;
			/** Display name of the node group */
			name?: string | null;
			/** Optional plain-text description of the node group */
			description?: string | null;
			/** IDs of the nodes that belong to this group */
			nodeIds?: Array<string> | null;
		}> | null;
		authors?: string | null;
		name?: string | null;
		description?: string | null;
		autosaved?: boolean | null;
		createdAt?: string | null;
		updatedAt?: string | null;
		workflowPublishHistory?: Array<{
			id?: number | null;
			workflowId?: string | null;
			versionId?: string | null;
			event?: string | null;
			userId?: string | null;
			createdAt?: string | null;
		}> | null;
	} | null;
};

export type N8nWorkflowTagsPublicDtoGenerated = Array<{
	id?: string | null;
	name?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
}>;

export type N8nOperationInputs = {
	'agents.archive': {
		/** The ID of the agent. */
		agentId: string;
	};
	'agents.create': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		name: string;
		projectId?: string;
		/** Agent configuration. Set name, model, and instructions. An empty model creates an unconfigured draft. */
		config?: Record<string, N8nJsonValue>;
		tools?: {
			[key: string]: {
				code: string;
				descriptor: {
					name: string;
				};
			};
		};
		availableInMCP?: boolean;
	};
	'agents.delete': {
		/** The ID of the agent. */
		agentId: string;
	};
	'agents.executions.list': {
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		/** The maximum number of items to return. */
		limit?: number;
		/** The ID of the agent. */
		agentId: string;
		sessionId?: string;
		status?:
			| 'running'
			| 'success'
			| 'error'
			| 'cancelled'
			| 'interrupted'
			| 'awaiting';
	};
	'agents.executions.stop': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the agent. */
		agentId: string;
		/** The ID of the agent execution. */
		executionId: string;
	};
	'agents.get': {
		/** The ID of the agent. */
		agentId: string;
	};
	'agents.list': {
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		/** The maximum number of items to return. */
		limit?: number;
		projectId?: string;
	};
	'agents.publish': {
		/** The ID of the agent. */
		agentId: string;
		/** The saved version to publish. Omit this field to publish the current draft. */
		versionId?: string;
	};
	'agents.run': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the agent. */
		agentId: string;
		/** The message to send to the agent. */
		message: string;
		/** The session to continue. */
		sessionId?: string;
	};
	'agents.unarchive': {
		/** The ID of the agent. */
		agentId: string;
	};
	'agents.unpublish': {
		/** The ID of the agent. */
		agentId: string;
	};
	'agents.update': {
		/** The ID of the agent. */
		agentId: string;
		config: Record<string, N8nJsonValue> | null;
		baseConfigHash?: string | null;
		configHash?: string | null;
		id?: N8nJsonValue;
		name?: N8nJsonValue;
		projectId?: N8nJsonValue;
		project?: N8nJsonValue;
		availableInMCP?: N8nJsonValue;
		isArchived?: N8nJsonValue;
		versionId?: N8nJsonValue;
		activeVersionId?: N8nJsonValue;
		createdAt?: N8nJsonValue;
		updatedAt?: N8nJsonValue;
		tools?: N8nJsonValue;
		activeVersion?: N8nJsonValue;
		parentFolder?: N8nJsonValue;
		parentFolderId?: N8nJsonValue;
		isRunnable?: N8nJsonValue;
		hasPublishHistory?: N8nJsonValue;
		hasVersionHistory?: N8nJsonValue;
		skills?: N8nJsonValue;
		skillHashes?: N8nJsonValue;
		outdatedSkillIds?: N8nJsonValue;
		skillVersions?: N8nJsonValue;
		adopted?: N8nJsonValue;
	};
	'agents.versions.get': {
		/** The ID of the agent. */
		agentId: string;
		/** The ID of the agent version. */
		versionId: string;
	};
	'agents.versions.list': {
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		/** The maximum number of items to return. */
		limit?: number;
		/** The ID of the agent. */
		agentId: string;
	};
	'aiPreferences.create': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** One instruction, written as the user would say it. At most 2000 characters. A scope that already holds 50 preferences refuses a new one, so edit or delete one first. */
		content: string;
		scope: 'user' | 'project' | 'instance';
		projectId?: string | null;
		userId?: string | null;
	};
	'aiPreferences.delete': {
		/** The ID of the AI preference. */
		aiPreferenceId: string;
	};
	'aiPreferences.get': {
		/** The ID of the AI preference. */
		aiPreferenceId: string;
	};
	'aiPreferences.list': {
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		/** The maximum number of items to return. */
		limit?: number;
		scope?: 'user' | 'project' | 'instance';
		projectId?: string;
	};
	'aiPreferences.update': {
		/** The ID of the AI preference. */
		aiPreferenceId: string;
		/** One instruction, written as the user would say it. At most 2000 characters. A scope that already holds 50 preferences refuses a new one, so edit or delete one first. */
		content: string;
		scope: 'user' | 'project' | 'instance';
		projectId?: string | null;
		userId?: string | null;
	};
	'audit.generate': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		additionalOptions?: {
			/** Days for a workflow to be considered abandoned if not executed */
			daysAbandonedWorkflow?: number;
			categories?: Array<
				'credentials' | 'database' | 'nodes' | 'filesystem' | 'instance'
			>;
		};
	};
	'communityPackages.install': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** npm package name. Unscoped names start with n8n-nodes-. Scoped names use the @[author]/n8n-nodes- form. */
		name: string;
		/** Semver version or npm dist-tag, such as latest or beta. When unverified packages are disabled, only versions verified by n8n can be installed. */
		version?: string;
	};
	'communityPackages.list': Record<string, never>;
	'communityPackages.uninstall': {
		/** npm package name */
		name: string;
	};
	'communityPackages.update': {
		/** npm package name */
		name: string;
		/** Semver version or npm dist-tag to update to, such as latest or beta. When unverified packages are disabled, only versions verified by n8n can be installed. */
		version?: string;
	};
	'credentialTypePolicies.attachments.get': {
		/** The ID of the credential type policy scope. */
		scopeId: string;
	};
	'credentialTypePolicies.attachments.replace': {
		/** The ID of the credential type policy scope. */
		scopeId: string;
		attachments: Array<{
			policyId: string;
			priority: number;
			isFloor: boolean;
		}>;
		version: number;
	};
	'credentialTypePolicies.documents.create': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		rules: Array<{
			id: string;
			action: 'allow' | 'deny' | 'delegate';
			selector:
				| {
						kind: 'name';
						value: string;
				  }
				| {
						kind: 'package';
						value: string;
				  }
				| {
						kind: 'extends';
						value: string;
				  };
		}>;
	};
	'credentialTypePolicies.documents.delete': {
		/** The ID of the credential type policy document. */
		policyId: string;
	};
	'credentialTypePolicies.documents.get': {
		/** The ID of the credential type policy document. */
		policyId: string;
	};
	'credentialTypePolicies.documents.list': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
	};
	'credentialTypePolicies.documents.update': {
		/** The ID of the credential type policy document. */
		policyId: string;
		rules: Array<{
			id: string;
			action: 'allow' | 'deny' | 'delegate';
			selector:
				| {
						kind: 'name';
						value: string;
				  }
				| {
						kind: 'package';
						value: string;
				  }
				| {
						kind: 'extends';
						value: string;
				  };
		}>;
		version: number;
	};
	'credentialTypePolicies.getInstance': Record<string, never>;
	'credentialTypePolicies.getProject': {
		/** The ID of the project. */
		projectId: string;
	};
	'credentialTypePolicies.setInstance': {
		rules: Array<{
			id: string;
			action: 'allow' | 'deny' | 'delegate';
			selector:
				| {
						kind: 'name';
						value: string;
				  }
				| {
						kind: 'package';
						value: string;
				  }
				| {
						kind: 'extends';
						value: string;
				  };
		}>;
		defaultAction: 'allow' | 'deny' | 'delegate';
		version: number;
	};
	'credentialTypePolicies.setProject': {
		/** The ID of the project. */
		projectId: string;
		rules: Array<{
			id: string;
			action: 'allow' | 'deny';
			selector:
				| {
						kind: 'name';
						value: string;
				  }
				| {
						kind: 'package';
						value: string;
				  }
				| {
						kind: 'extends';
						value: string;
				  };
		}>;
		defaultAction: 'allow' | 'deny';
		version: number;
	};
	'credentials.create': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** An unused credential ID of 1–16 letters, digits, underscores, or hyphens. The supplied ID is preserved exactly. Omit to generate an ID. */
		id?: string;
		name: string;
		/** Plain text, up to 512 characters. A blank value is saved as null. Ignored when credential descriptions are disabled. */
		description?: string | null;
		type: string;
		/** The credential data. Fields also accept n8n expressions, which are strings that start with "=". */
		data: Record<string, N8nJsonValue>;
		/** Whether this credential has resolvable fields */
		isResolvable?: boolean;
		/** Project to create the credential in. Defaults to the user's personal project. */
		projectId?: string;
	};
	'credentials.delete': {
		/** The ID of the credential. */
		credentialId: string;
	};
	'credentials.get': {
		/** The ID of the credential. */
		credentialId: string;
	};
	'credentials.getDependencies': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		/** The ID of the credential. */
		credentialId: string;
	};
	'credentials.getSchema': {
		/** The credential type name that you want to get the schema for */
		credentialTypeName: string;
	};
	'credentials.list': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
	};
	'credentials.test': {
		/** The ID of the credential. */
		credentialId: string;
	};
	'credentials.transfer': {
		/** The ID of the credential. */
		credentialId: string;
		/** The ID of the project to transfer the credential to. */
		destinationProjectId: string;
	};
	'credentials.update': {
		/** The ID of the credential. */
		credentialId: string;
		/** The name of the credential */
		name?: string;
		/** Plain text, up to 512 characters. Send null or a blank value to clear it. Omit it to keep the stored value. Ignored when credential descriptions are disabled. */
		description?: string | null;
		/** The credential type. If changing type, data must also be provided. */
		type?: string;
		/** The credential data. Required when changing credential type. Fields also accept n8n expressions, which are strings that start with "=". */
		data?: Record<string, N8nJsonValue>;
		/** Whether this credential is available globally */
		isGlobal?: boolean;
		/** Whether this credential has resolvable fields */
		isResolvable?: boolean;
		/** If true, unredacts and merges existing credential data with the provided data. If false, replaces the entire data object. */
		isPartialData?: boolean;
	};
	'dataTables.columns.create': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the data table */
		dataTableId: string;
		/** Column name. Must start with a letter; only letters, digits, and underscores after that; maximum 63 characters. */
		name: string;
		/** Column data type */
		type: 'string' | 'number' | 'boolean' | 'date';
		/** Column position (optional, appended to end if omitted) */
		index?: number;
	};
	'dataTables.columns.delete': {
		/** The ID of the data table */
		dataTableId: string;
		/** The ID of the column */
		columnId: string;
	};
	'dataTables.columns.list': {
		/** The ID of the data table */
		dataTableId: string;
	};
	'dataTables.columns.update': {
		/** The ID of the data table */
		dataTableId: string;
		/** The ID of the column */
		columnId: string;
		/** Column name. Must start with a letter; only letters, digits, and underscores after that; maximum 63 characters. */
		name?: string;
		/** New zero-based position for the column */
		index?: number;
	};
	'dataTables.create': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** Name of the data table */
		name: string;
		/** Column definitions for the table */
		columns: Array<{
			/** Column name */
			name: string;
			/** Column data type */
			type: 'string' | 'number' | 'boolean' | 'date';
			/** Name of the CSV column to read the values from. If you do not set it, n8n maps the CSV columns by position. */
			csvColumnName?: string;
		}>;
		/** ID of the project to create the table in. When omitted, the table is created in the user's personal project. */
		projectId?: string;
		/** ID of a CSV file that you uploaded in the n8n editor. If you set it, n8n fills the new table with the rows from that file. Only a session-authenticated caller can upload a file, so an API-key caller cannot use this field. */
		fileId?: string;
		/** Set to true if the first row of the CSV file holds the column names. Applies only when you set `fileId`. The default is true. */
		hasHeaders?: boolean;
	};
	'dataTables.delete': {
		/** The ID of the data table */
		dataTableId: string;
	};
	'dataTables.get': {
		/** The ID of the data table */
		dataTableId: string;
	};
	'dataTables.getDependencies': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		/** The ID of the data table */
		dataTableId: string;
	};
	'dataTables.list': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		/** JSON string of filter conditions */
		filter?: string;
		/** Sort format: field:asc or field:desc */
		sortBy?:
			| 'name:asc'
			| 'name:desc'
			| 'createdAt:asc'
			| 'createdAt:desc'
			| 'updatedAt:asc'
			| 'updatedAt:desc'
			| 'size:asc'
			| 'size:desc';
	};
	'dataTables.rows.clear': {
		/** The ID of the data table */
		dataTableId: string;
	};
	'dataTables.rows.delete': {
		/** The ID of the data table */
		dataTableId: string;
		/** JSON string of filter conditions. Required to prevent accidental deletion of all data. */
		filter: string;
		/** If true, return the deleted rows. If false, return true on success. */
		returnData?: boolean;
		/** If true, preview which rows would be deleted without actually deleting them. */
		dryRun?: boolean;
	};
	'dataTables.rows.insert': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the data table */
		dataTableId: string;
		/** Array of rows to insert. Each row is an object with column names as keys. */
		data: Array<{ [key: string]: string | number | boolean | N8nJsonValue }>;
		/** count: return only the number of rows inserted. id: return an array of objects with the id of each inserted row. all: return the full row data for all inserted rows. */
		returnType?: 'all' | 'count' | 'id';
	};
	'dataTables.rows.list': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		/** The ID of the data table */
		dataTableId: string;
		/** JSON string of filter conditions */
		filter?: string;
		/** Sort format: columnName:asc or columnName:desc */
		sortBy?: string;
		/** Search text across all string columns */
		search?: string;
	};
	'dataTables.rows.update': {
		/** The ID of the data table */
		dataTableId: string;
		/** Filter conditions to match rows for update. */
		filter: {
			type?: 'and' | 'or';
			filters: Array<{
				columnName: string;
				condition:
					| 'eq'
					| 'neq'
					| 'like'
					| 'ilike'
					| 'gt'
					| 'gte'
					| 'lt'
					| 'lte';
				value: string | number | boolean | N8nJsonValue;
			}>;
		};
		/** Column values to update */
		data: { [key: string]: string | number | boolean | N8nJsonValue };
		/** Set to true to return the updated row(s). Set to false to return true on success. */
		returnData?: boolean;
		/** Set to true to preview the change without saving it. */
		dryRun?: boolean;
	};
	'dataTables.rows.upsert': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the data table */
		dataTableId: string;
		/** Filter conditions to match an existing row. If no row matches, n8n inserts a new row. */
		filter: {
			type?: 'and' | 'or';
			filters: Array<{
				columnName: string;
				condition:
					| 'eq'
					| 'neq'
					| 'like'
					| 'ilike'
					| 'gt'
					| 'gte'
					| 'lt'
					| 'lte';
				value: string | number | boolean | N8nJsonValue;
			}>;
		};
		/** Column values for the row */
		data: { [key: string]: string | number | boolean | N8nJsonValue };
		/** Set to true to return the upserted row(s): the matching rows if updated, or the new row if one was inserted. Set to false to return true on success. */
		returnData?: boolean;
		/** Set to true to preview the change without saving it. */
		dryRun?: boolean;
	};
	'dataTables.update': {
		/** The ID of the data table */
		dataTableId: string;
		/** New name for the data table */
		name: string;
	};
	'discover.get': {
		/** Include additional data. Use "schemas" to inline request body schemas per endpoint, eliminating the need to fetch the full OpenAPI spec. */
		include?: 'schemas';
		/** Filter to a specific resource (e.g. "workflow", "tags", "credential"). */
		resource?: string;
		/** Filter to endpoints with a specific operation (e.g. "read", "create", "list"). */
		operation?: string;
	};
	'evaluations.cancelRun': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the workflow */
		workflowId: string;
		/** The ID of the test run. */
		runId: string;
	};
	'evaluations.getRun': {
		/** The ID of the workflow */
		workflowId: string;
		/** The ID of the test run. */
		runId: string;
	};
	'evaluations.listCases': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		/** The ID of the workflow */
		workflowId: string;
		/** The ID of the test run. */
		runId: string;
	};
	'evaluations.listRuns': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		/** The ID of the workflow */
		workflowId: string;
		/** Status to filter the test runs by. */
		status?: 'new' | 'running' | 'completed' | 'error' | 'cancelled';
	};
	'evaluations.startRun': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the workflow */
		workflowId: string;
	};
	'executions.delete': {
		/** The ID of the execution. */
		executionId: number;
	};
	'executions.get': {
		/** The ID of the execution. */
		executionId: number;
		/** Whether or not to include the execution's detailed data. */
		includeData?: boolean;
		/** Whether to return the full execution data even if it exceeds the configured size limit (EXECUTIONS_DATA_MAX_DISPLAY_SIZE). Oversized executions are otherwise returned without their data. */
		ignoreDataSizeLimit?: boolean;
		/** Controls execution data redaction. When `true`, execution output data is always redacted. When `false`, requests unredacted (revealed) data — requires the `execution:reveal` scope. When omitted, follows the workflow redaction policy. */
		redactExecutionData?: boolean;
	};
	'executions.getTags': {
		/** The ID of the execution. */
		executionId: number;
	};
	'executions.list': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		/** Whether or not to include the execution's detailed data. */
		includeData?: boolean;
		/** Whether to return the full execution data even if it exceeds the configured size limit (EXECUTIONS_DATA_MAX_DISPLAY_SIZE). Oversized executions are otherwise returned without their data. */
		ignoreDataSizeLimit?: boolean;
		/** Controls execution data redaction. When `true`, execution output data is always redacted. When `false`, requests unredacted (revealed) data — requires the `execution:reveal` scope. When omitted, follows the workflow redaction policy. */
		redactExecutionData?: boolean;
		/** Status to filter the executions by. */
		status?:
			| 'canceled'
			| 'crashed'
			| 'error'
			| 'new'
			| 'running'
			| 'success'
			| 'unknown'
			| 'waiting';
		/** Workflow to filter the executions by. */
		workflowId?: string;
		projectId?: string;
		/** Only return executions that started after this time. */
		startedAfter?: string;
		/** Only return executions that started before this time. */
		startedBefore?: string;
	};
	'executions.retry': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the execution. */
		executionId: number;
		/** Whether to load the currently saved workflow to execute instead of the one saved at the time of the execution. If set to true, it will retry with the latest version of the workflow. */
		loadWorkflow?: boolean;
	};
	'executions.setTags': {
		/** The ID of the execution. */
		executionId: number;
		tags: Array<{
			id: string;
		}>;
	};
	'executions.stop': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the execution. */
		executionId: number;
	};
	'executions.stopMany': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** Array of execution statuses to stop. Must include at least one status. */
		status: Array<'queued' | 'running' | 'waiting'>;
		/** Optional workflow ID to filter executions. If not provided, will stop executions across all accessible workflows. The literal value `all` has the same effect as omitting it. */
		workflowId?: string;
		/** Only stop executions that started after this time. */
		startedAfter?: string;
		/** Only stop executions that started before this time. */
		startedBefore?: string;
	};
	'folders.create': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the project, or `personal` for the calling user's own personal project. */
		projectId: string;
		name: string;
		parentFolderId?: string;
	};
	'folders.delete': {
		/** The ID of the project, or `personal` for the calling user's own personal project. */
		projectId: string;
		/** The ID of the folder. */
		folderId: string;
		/** Optional target folder ID to move workflows and sub-folders into before deleting. */
		transferToFolderId?: string;
	};
	'folders.get': {
		/** The ID of the project, or `personal` for the calling user's own personal project. */
		projectId: string;
		/** The ID of the folder. */
		folderId: string;
	};
	'folders.list': {
		/** The ID of the project, or `personal` for the calling user's own personal project. */
		projectId: string;
		/** JSON-encoded filter object. Supported fields — parentFolderId, name, tags (array of tag names), excludeFolderIdAndDescendants. */
		filter?: string;
		/** JSON-encoded array of fields to include. Valid fields — id, name, createdAt, updatedAt, project, tags, parentFolder, workflowCount, subFolderCount, path. */
		select?: string;
		/** Sort order for results. */
		sortBy?:
			| 'name:asc'
			| 'name:desc'
			| 'createdAt:asc'
			| 'createdAt:desc'
			| 'updatedAt:asc'
			| 'updatedAt:desc';
		/** Number of items to skip for pagination. Defaults to 0. */
		skip?: string;
		/** Number of items to return. Defaults to 10. */
		take?: string;
	};
	'folders.update': {
		/** The ID of the project, or `personal` for the calling user's own personal project. */
		projectId: string;
		/** The ID of the folder. */
		folderId: string;
		name?: string;
		/** ID of the parent folder to move this folder into. Set to "0" to move the folder to the project root. */
		parentFolderId?: string;
	};
	'insights.getSummary': {
		/** ISO 8601 start date. Defaults to 7 days ago. */
		startDate?: string;
		/** ISO 8601 end date. Defaults to now. */
		endDate?: string;
		/** Project identifier to filter insights by project. */
		projectId?: string;
	};
	'nodeTypePolicies.attachments.get': {
		/** The ID of the node type policy scope. */
		scopeId: string;
	};
	'nodeTypePolicies.attachments.replace': {
		/** The ID of the node type policy scope. */
		scopeId: string;
		attachments: Array<{
			policyId: string;
			priority: number;
			isFloor: boolean;
		}>;
		version: number;
	};
	'nodeTypePolicies.documents.create': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		rules: Array<{
			id: string;
			action: 'allow' | 'deny' | 'delegate';
			selector:
				| {
						kind: 'name';
						value: string;
				  }
				| {
						kind: 'package';
						value: string;
				  };
		}>;
	};
	'nodeTypePolicies.documents.delete': {
		/** The ID of the node type policy document. */
		policyId: string;
	};
	'nodeTypePolicies.documents.get': {
		/** The ID of the node type policy document. */
		policyId: string;
	};
	'nodeTypePolicies.documents.list': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
	};
	'nodeTypePolicies.documents.update': {
		/** The ID of the node type policy document. */
		policyId: string;
		rules: Array<{
			id: string;
			action: 'allow' | 'deny' | 'delegate';
			selector:
				| {
						kind: 'name';
						value: string;
				  }
				| {
						kind: 'package';
						value: string;
				  };
		}>;
		version: number;
	};
	'nodeTypePolicies.getInstance': Record<string, never>;
	'nodeTypePolicies.getProject': {
		/** The ID of the project. */
		projectId: string;
	};
	'nodeTypePolicies.setInstance': {
		rules: Array<{
			id: string;
			action: 'allow' | 'deny' | 'delegate';
			selector:
				| {
						kind: 'name';
						value: string;
				  }
				| {
						kind: 'package';
						value: string;
				  };
		}>;
		defaultAction: 'allow' | 'deny' | 'delegate';
		version: number;
	};
	'nodeTypePolicies.setProject': {
		/** The ID of the project. */
		projectId: string;
		rules: Array<{
			id: string;
			action: 'allow' | 'deny';
			selector:
				| {
						kind: 'name';
						value: string;
				  }
				| {
						kind: 'package';
						value: string;
				  };
		}>;
		defaultAction: 'allow' | 'deny';
		version: number;
	};
	'packages.export': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** IDs of the agents to include. Requires the agents module. */
		agentIds?: Array<string>;
		/** IDs of the workflows to include in the exported package. */
		workflowIds?: Array<string>;
		/** IDs of the folders to include in the exported package. Each folder is exported with its nested folders. */
		folderIds?: Array<string>;
		/** IDs of the projects to include in the exported package. Includes their agents when the agents module is enabled. */
		projectIds?: Array<string>;
		/** Whether values of variables referenced by the exported entities are bundled into the package. When `false`, variables still travel as name/type files and are listed in the package requirements, but no values travel with the package. */
		includeVariableValues?: boolean;
		/** Whether tags assigned to the exported workflows are bundled into the package. When `false`, no tag files, tag references, or tag requirements travel with the package. */
		includeTags?: boolean;
		/** Policy for workflow and agent dependencies outside the selected package contents. Includes static workflow references and disabled agent references. `fail` aborts when a required workflow or agent is absent from the package. `include-in-package` adds accessible dependencies recursively.… */
		dependencyPolicy?: 'fail' | 'reference-only' | 'include-in-package';
		/** Which version of each workflow and agent travels in the package. `latest` exports the current draft. `published-strict` requires a published version. `prefer-published` uses the published version when available and the draft otherwise. `ignore-unpublished` skips unpublished selections.… */
		versionPolicy?:
			| 'published-strict'
			| 'prefer-published'
			| 'ignore-unpublished'
			| 'latest';
		/** Whether expression values from credential data are bundled into the package. `expression-values-only` includes credential fields whose value is an n8n expression (for example `={{ $secrets.apiKey }}`). A literal value travels only when it decides whether another credential field shows (a toggle… */
		credentialExportPolicy?: 'expression-values-only' | 'no-values';
		/** Whether folder exports include archived workflows and project exports include archived workflows and agents. When `false` (default) they are left out. When `true` they travel with `isArchived: true` and are archived on import. Workflows listed in `workflowIds` and agents listed in `agentIds`… */
		includeArchived?: boolean;
	};
	'packages.import': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** Gzip-compressed tar package (`.n8np`). */
		package: FileInput;
		/** Target project id. Omit or send empty to import into the caller's personal project. */
		projectId?: string;
		/** Optional folder within the target project. Omit or send empty for project root. */
		folderId?: string;
		/** How credential references in `requirements.credentials` are matched on the target instance. `id-only` (default) matches by id. `name-and-type` matches credentials with the exact same name and type. `type-only` matches any credential of the same type. For `name-and-type` and `type-only`,… */
		credentialMatchingMode?: 'id-only' | 'name-and-type' | 'type-only';
		/** What to do when a credential reference cannot be resolved. `create-stub` (default) creates empty credential placeholders in the target project for missing references. `create-with-values` also creates them, seeded from the expression data bundled in the package (see the export option… */
		credentialMissingMode?:
			| 'must-preexist'
			| 'create-stub'
			| 'create-with-values';
		/** What to do when a credential reference matches an existing credential and the package has different values for it. `keep-existing` (default) never changes a matched credential. `overwrite` writes the package name and the expression values from the package to a matched credential that a project… */
		credentialConflictPolicy?: 'keep-existing' | 'overwrite' | 'fail';
		/** Optional JSON object of explicit source→target id bindings, keyed by entity type. Only `credentials` is supported today: send `{"credentials":{"<packageCredentialId>":"<targetCredentialId>"}}` to map credential ids from the package to credential ids on the target instance. These explicit… */
		bindings?: string;
		/** Applies to Agents, workflows and the skills of imported Agents. `new-version` replaces matched definitions and saves a changed skill as a new version. `fail` rejects the import when an Agent or workflow matches, or when a matched skill has other content. A matched skill with the same content is… */
		conflictPolicy: 'new-version' | 'fail' | 'skip';
		/** Controls publication of imported Agents and workflows after definitions are saved. `preserve-published-state` (default) keeps new entities unpublished. It republishes an updated entity only if it was published and the package contains the version published at the source. `match-source` publishes… */
		publishingPolicy?:
			| 'preserve-published-state'
			| 'match-source'
			| 'publish-all'
			| 'unpublish-all';
		/** Controls IDs for newly created Agents and workflows. Only `source` is supported. It uses the package ID. An ID already used by an unmatched Agent or workflow, in any project, blocks the import. Matched entities keep their destination ID. Agent and workflow identity maps remain separate. This… */
		idPolicy?: 'source';
		/** Controls missing node types and versions in workflow nodes and Agent node tools. `fail` (default) rejects the import before writes. The issues identify the affected consumers. `import-anyway` saves the definitions but blocks their publication. This applies to both Agents and workflows. */
		missingNodeTypeMode?: 'fail' | 'import-anyway';
		/** What to do when a project the package defines already exists here (matched by id), and — unless `folderConflictPolicy` overrides it — how its contents are treated. `merge` (default) leaves the existing project's name, description, icon and custom span attributes untouched and adds the package's… */
		projectConflictPolicy?: 'merge' | 'fail' | 'overwrite';
		/** What to do when a package folder already exists at the same position in the target project. Defaults to whatever `projectConflictPolicy` is, so the intent is stated once; a workflow package defines no projects, so it defaults to `merge` there. `merge` reuses the existing folder and merges the… */
		folderConflictPolicy?: 'merge' | 'fail' | 'overwrite';
		/** How `folderConflictPolicy=overwrite` removes a workflow the package does not contain. `archive` (default) archives it, so it stays recoverable along with its execution history. `hard-delete` archives it — the step that unpublishes it, which a delete will not do on its own — and then deletes the… */
		overwriteDeletionPolicy?: 'archive' | 'hard-delete';
		/** How data tables referenced by the package's workflows are matched against the target project. `by-id` matches the target-project table with the same id (imported tables keep their source id) and never falls back to name matching, so a match survives a rename on the target. Currently the only mode. */
		dataTableMatchingMode?: 'by-id';
		/** Controls what happens when a referenced data table has no match in the target project. `create` (default) creates it from the package schema, keeping the source id, with no rows. It requires the `dataTable:create` scope only when it creates a table. A table that already exists needs no scope.… */
		dataTableMissingMode?: 'create' | 'must-preexist' | 'do-nothing';
		/** How strictly a matched data table's schema is compared. `keep-existing` (default) accepts a target table that has every package column with the same name and type. The target table can have extra columns. `fail` rejects any difference, including target-only columns. Under `keep-existing` and… */
		dataTableSchemaConflictPolicy?:
			| 'keep-existing'
			| 'fail'
			| 'overwrite'
			| 'overwrite-non-destructive';
		/** Controls what happens when a variable referenced by the package's workflows is absent from the target project and the global scope (lookup order: project, then global). `create-with-value` (default) creates the variable with its package value and lists its name under `variables.created`. When… */
		variableMissingMode?:
			| 'do-nothing'
			| 'must-preexist'
			| 'create-stub'
			| 'create-with-value';
		/** What to do when a referenced variable resolves in the target project or global scope but the package bundles a *different* value for it. `keep-existing` (default) leaves the target value untouched and reports the name under `variables.matched`. `overwrite` silently replaces the value of the… */
		variableConflictPolicy?: 'keep-existing' | 'overwrite' | 'fail';
		/** Where `create-with-value` and `create-stub` create missing variables for workflow/folder packages. `project` — also the behaviour when the field is omitted — creates them in the import target project (`projectId`, else the caller's personal project). `global` creates them at the global scope.… */
		variableParentPolicy?: 'project' | 'global';
		/** What to do when a tag referenced by the package's workflows has no tag with the same id on the target instance (tags are matched by source id, never by name). `create` (default) creates the tag globally with its package (source) id and name; when the import would create a tag this needs an API… */
		tagMissingMode?: 'create' | 'do-nothing';
		/** What to do when a referenced tag conflicts on the target instance — either the same-id target tag carries a different name (rename drift), or the tag's name is already held by a different tag (name collision). `skip` (default) drops the conflicted tags from the import (not created, not renamed,… */
		tagConflictPolicy?: 'skip' | 'fail' | 'rename';
	};
	'packages.importSelection': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** Gzip-compressed tar package (`.n8np`). */
		package: FileInput;
		/** Id of the single source project the selection is scoped to, as it appears in the package. */
		selectedProjectId: string;
		/** JSON-encoded array of source workflow ids to import from `selectedProjectId`, e.g. `["wf-1","wf-2"]`. An empty array (`[]`) is allowed — useful for a delete-only request. Ids outside the scoped project are dropped. */
		selectedWorkflowIds: string;
		/** Optional JSON-encoded array of destination workflow ids to remove from the scoped project, e.g. `["wf-3"]`. Removal happens even under the additive profile, and the manner of removal follows `overwriteDeletionPolicy` (archive by default). An absent id is a no-op unless it is also a selected… */
		deletedWorkflowIds?: string;
		/** What happens when a selected workflow matches an existing workflow by source id in the target project. `new-version` (default) updates it and creates a new version; `fail` rejects the import when any matching workflow exists; `skip` leaves matching workflows unchanged. An archive state change… */
		conflictPolicy?: 'new-version' | 'fail' | 'skip';
		/** Controls IDs for newly created workflows. Only `source` is supported. It uses the package ID. An ID already used by an unmatched workflow, in any project, blocks the import. Matched workflows keep their destination ID. */
		idPolicy?: 'source';
		/** How the ids in `deletedWorkflowIds` are removed. `archive` (default) archives each one, so it stays recoverable along with its execution history. `hard-delete` archives it — the step that unpublishes it, which a delete will not do on its own — and then deletes the workflow and its executions… */
		overwriteDeletionPolicy?: 'archive' | 'hard-delete';
	};
	'projects.create': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		name: string;
		/** Project ID. The server generates an ID when omitted. An ID that is in use returns HTTP 409. */
		id?: string;
		icon?: {
			type: 'emoji' | 'icon';
			value: string;
			color?: string;
		} | null;
		description?: string | null;
		customTelemetryTags?: Array<{
			key: string;
			value: string;
		}>;
	};
	'projects.delete': {
		/** The ID of the project. */
		projectId: string;
	};
	'projects.list': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
	};
	'projects.update': {
		/** The ID of the project. */
		projectId: string;
		name: string;
	};
	'projects.users.add': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the project. */
		projectId: string;
		/** A list of userIds and roles to add to the project. */
		relations: Array<{
			/** The unique identifier of the user. */
			userId: string;
			/** The role assigned to the user in the project. */
			role: string;
		}>;
	};
	'projects.users.changeRole': {
		/** The ID of the project. */
		projectId: string;
		/** The ID of the user. */
		userId: string;
		/** The role assigned to the user in the project. */
		role: string;
	};
	'projects.users.list': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		/** The ID of the project. */
		projectId: string;
	};
	'projects.users.remove': {
		/** The ID of the project. */
		projectId: string;
		/** The ID of the user. */
		userId: string;
	};
	'promotions.environments.addProject': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the promotion environment. */
		promotionEnvironmentId: string;
		/** The ID of the project. */
		projectId: string;
	};
	'promotions.environments.apply': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the promotion environment. */
		promotionEnvironmentId: string;
		expectedSource?: {
			environmentId: string;
			branchName: string;
			commitSha: string;
		};
		/** The `revision` of the reviewed preview. The operation builds the preview again. When it differs, the operation returns status `preview-changed` and changes nothing. */
		expectedPreviewRevision?: string;
	};
	'promotions.environments.connect': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the promotion environment. */
		promotionEnvironmentId: string;
	};
	'promotions.environments.continueApply': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the promotion environment. */
		promotionEnvironmentId: string;
		expectedSource: {
			environmentId: string;
			branchName: string;
			commitSha: string;
		};
		/** The `revision` of the reviewed preview. The operation builds the preview again. When it differs, the operation returns status `preview-changed` and changes nothing. */
		expectedPreviewRevision?: string;
		/** Also applies destructive data table changes, which a `destructive-change` conflict reports: removed or retyped columns. The values in those columns are removed. Rows and other columns are kept. On a full apply, also deletes the team projects that a `project-deletion` conflict reports, with… */
		confirmDestructiveChanges?: boolean;
	};
	'promotions.environments.create': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		name: string;
		scope: 'instance' | 'projects';
		providerId: string;
		remote: {
			schemaVersion: 1;
			remoteUrl: string;
		};
		direction: 'apply' | 'promote';
		settings:
			| {
					schemaVersion: 1;
					branchName: string;
			  }
			| {
					schemaVersion: 1;
					baseBranchName: string;
					createBranchOnPromotion: boolean;
			  };
	};
	'promotions.environments.delete': {
		/** The ID of the promotion environment. */
		promotionEnvironmentId: string;
	};
	'promotions.environments.disconnect': {
		/** The ID of the promotion environment. */
		promotionEnvironmentId: string;
	};
	'promotions.environments.get': {
		/** The ID of the promotion environment. */
		promotionEnvironmentId: string;
	};
	'promotions.environments.getChangeDetails': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the promotion environment. */
		promotionEnvironmentId: string;
		/** The `commitSha` of the preview. `null` when the preview had none. */
		commitSha: string | null;
		/** The `key` of each resource to read, from the preview. */
		keys: Array<string>;
	};
	'promotions.environments.list': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		scope?: 'instance' | 'projects';
		direction?: 'apply' | 'promote';
		providerId?: string;
	};
	'promotions.environments.listChanges': {
		/** The ID of the promotion environment. */
		promotionEnvironmentId: string;
	};
	'promotions.environments.listMissingProjects': {
		/** The ID of the promotion environment. */
		promotionEnvironmentId: string;
	};
	'promotions.environments.listProjects': {
		/** The ID of the promotion environment. */
		promotionEnvironmentId: string;
	};
	'promotions.environments.promote': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the promotion environment. */
		promotionEnvironmentId: string;
		/** Message for the promotion commit. If you omit it, the commit uses a generated message. */
		commitMessage?: string;
		force?: boolean;
	};
	'promotions.environments.removeProject': {
		/** The ID of the promotion environment. */
		promotionEnvironmentId: string;
		/** The ID of the project. */
		projectId: string;
	};
	'promotions.environments.update': {
		/** The ID of the promotion environment. */
		promotionEnvironmentId: string;
		name?: string;
		providerId?: string;
		remote?: {
			schemaVersion: 1;
			remoteUrl: string;
		};
		settings?:
			| {
					schemaVersion: 1;
					branchName: string;
			  }
			| {
					schemaVersion: 1;
					baseBranchName: string;
					createBranchOnPromotion: boolean;
			  };
	};
	'promotions.projects.apply': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the project. */
		projectId: string;
		workflowIds?: Array<string>;
		/** Folders of the project on the branch. Apply creates a selected folder, or moves and renames it to match the branch. */
		folderIds?: Array<string>;
		expectedSource?: {
			environmentId: string;
			branchName: string;
			commitSha: string;
		};
		/** The `revision` of the reviewed preview. The operation builds the preview again. When it differs, the operation returns status `preview-changed` and changes nothing. */
		expectedPreviewRevision?: string;
	};
	'promotions.projects.continueApply': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the project. */
		projectId: string;
		workflowIds?: Array<string>;
		/** Folders of the project on the branch. Apply creates a selected folder, or moves and renames it to match the branch. */
		folderIds?: Array<string>;
		expectedSource: {
			environmentId: string;
			branchName: string;
			commitSha: string;
		};
		/** The `revision` of the reviewed preview. The operation builds the preview again. When it differs, the operation returns status `preview-changed` and changes nothing. */
		expectedPreviewRevision?: string;
		/** Also applies destructive data table changes, which a `destructive-change` conflict reports: removed or retyped columns. The values in those columns are removed. Rows and other columns are kept. On a full apply, also deletes the team projects that a `project-deletion` conflict reports, with… */
		confirmDestructiveChanges?: boolean;
	};
	'promotions.projects.getChangeDetails': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the project. */
		projectId: string;
		/** The direction of the promotion: apply or promote. */
		direction: 'apply' | 'promote';
		/** The `commitSha` of the preview. `null` when the preview had none. */
		commitSha: string | null;
		/** The `key` of each resource to read, from the preview. */
		keys: Array<string>;
	};
	'promotions.projects.listChanges': {
		/** The ID of the project. */
		projectId: string;
		/** The direction of the promotion: apply or promote. */
		direction: 'apply' | 'promote';
	};
	'promotions.projects.promote': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the project. */
		projectId: string;
		workflowIds?: Array<string>;
		/** Folders of the project to promote. Promote writes a selected folder with its current name and place, even when it is empty. */
		folderIds?: Array<string>;
		/** Credentials that the project owns, to promote without a selected workflow that uses them. Promote writes a credential under the folder of its owner project. It never writes secret values. */
		credentialIds?: Array<string>;
		/** Message for the promotion commit. If you omit it, the commit uses a generated message. */
		commitMessage?: string;
		/** The `revision` of the reviewed preview. The operation builds the preview again. When it differs, the operation returns status `preview-changed` and changes nothing. */
		expectedPreviewRevision?: string;
	};
	'promotions.providers.create': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		name: string;
		type: 'git' | 'gitlab';
		auth:
			| {
					authType: 'ssh-key';
					keyType?: 'ed25519' | 'rsa';
			  }
			| {
					authType: 'token';
					/** Required for plain Git token authentication. For GitLab, the service ignores this field and uses n8n for Git transport. */
					username?: string;
					password: string;
			  };
		config?: {
			schemaVersion: 1;
			baseUrl: string;
		};
	};
	'promotions.providers.delete': {
		/** The ID of the promotion provider. */
		promotionProviderId: string;
	};
	'promotions.providers.get': {
		/** The ID of the promotion provider. */
		promotionProviderId: string;
	};
	'promotions.providers.list': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
	};
	'promotions.providers.listBranches': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		/** The ID of the promotion provider. */
		promotionProviderId: string;
		/** The URL-encoded fullPath of the repository. A GitLab project ID is also accepted. */
		repositoryId: string;
		search?: string;
	};
	'promotions.providers.listRepositories': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		/** The ID of the promotion provider. */
		promotionProviderId: string;
		search?: string;
	};
	'promotions.providers.update': {
		/** The ID of the promotion provider. */
		promotionProviderId: string;
		name?: string;
		auth?:
			| {
					authType: 'ssh-key';
					keyType?: 'ed25519' | 'rsa';
			  }
			| {
					authType: 'token';
					/** Required for plain Git token authentication. For GitLab, the service ignores this field and uses n8n for Git transport. */
					username?: string;
					password: string;
			  };
		config?: {
			schemaVersion: 1;
			baseUrl: string;
		};
	};
	'promotions.reviews.get': {
		/** The ID of the promotion review. */
		promotionReviewId: string;
	};
	'promotions.reviews.list': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		state?: 'open' | 'closed';
	};
	'promotions.settings.get': Record<string, never>;
	'promotions.settings.update': {
		/** Who can promote a project and see its promotion reviews. `instanceAdmins`: only instance owners and admins. `projectAdmins`: also project admins, in their projects. `projectAdminsAndEditors`: also project admins and editors, in their projects. */
		whoCanPromote?:
			| 'instanceAdmins'
			| 'projectAdmins'
			| 'projectAdminsAndEditors';
		/** Who can see and approve the promotion reviews of a project. `instanceAdmins`: only instance owners and admins. `projectAdmins`: also project admins, in their projects. `projectAdminsAndEditors`: also project admins and editors, in their projects. */
		whoCanApprove?:
			| 'instanceAdmins'
			| 'projectAdmins'
			| 'projectAdminsAndEditors';
		/** Who can apply changes into a project. `instanceAdmins`: only instance owners and admins. `projectAdmins`: also project admins, in their projects. `projectAdminsAndEditors`: also project admins and editors, in their projects. */
		whoCanApply?:
			| 'instanceAdmins'
			| 'projectAdmins'
			| 'projectAdminsAndEditors';
		/** Whether a promote needs a review. `whenConfigured`: each Promote environment uses its own review setting. `alwaysRequired`: every promote pushes a new branch. With a `gitlab` provider, it also opens a merge request. With a `git` provider, n8n cannot see the review and cannot stop direct pushes. */
		requireApproval?: 'whenConfigured' | 'alwaysRequired';
	};
	'roleMappingRules.create': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		expression: string;
		role: string;
		type: 'instance' | 'project';
		order?: number;
		projectIds?: Array<string>;
	};
	'roleMappingRules.delete': {
		/** The ID of the role mapping rule. */
		roleMappingRuleId: string;
	};
	'roleMappingRules.list': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		type?: 'instance' | 'project';
	};
	'roleMappingRules.move': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the role mapping rule. */
		roleMappingRuleId: string;
		targetIndex: number;
	};
	'roleMappingRules.update': {
		/** The ID of the role mapping rule. */
		roleMappingRuleId: string;
		expression?: string;
		role?: string;
		projectIds?: Array<string>;
	};
	'roles.create': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		displayName: string;
		description?: string;
		roleType: 'project' | 'global';
		scopes: Array<string>;
	};
	'roles.delete': {
		/** The slug of the role. */
		roleSlug: string;
		reassignRoleSlug?:
			| 'global:admin'
			| 'global:member'
			| 'global:chatUser'
			| string;
	};
	'roles.get': {
		/** The slug of the role. */
		roleSlug: string;
		withUsageCount?: boolean;
	};
	'roles.list': {
		withUsageCount?: boolean;
	};
	'roles.update': {
		/** The slug of the role. */
		roleSlug: string;
		displayName: string;
		description: string | null;
		scopes: Array<string>;
	};
	'settings.ldap.get': Record<string, never>;
	'settings.ldap.listSyncs': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
	};
	'settings.ldap.runSync': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** Type of synchronization. 'live' applies changes to the database. 'dry' performs a test run and does not persist changes. */
		type: 'live' | 'dry';
	};
	'settings.ldap.update': {
		/** Whether LDAP login is enabled. Setting this to false is destructive — it deletes all stored LDAP user identities and disables synchronization. */
		loginEnabled: boolean;
		/** Label shown on the LDAP login button. */
		loginLabel: string;
		/** LDAP server URL. */
		connectionUrl: string;
		/** Whether to allow unauthorized (self-signed) certificates. */
		allowUnauthorizedCerts: boolean;
		/** TLS/SSL security mode for the LDAP connection. */
		connectionSecurity: 'none' | 'tls' | 'startTls';
		/** LDAP server port. */
		connectionPort: number;
		/** Base DN for LDAP search queries. */
		baseDn: string;
		/** DN of the LDAP admin user for binding. */
		bindingAdminDn: string;
		/** Password for the LDAP admin user. To keep an existing password unchanged, submit the blanking placeholder from a prior GET response. Use an empty string to clear the password. */
		bindingAdminPassword: string;
		/** LDAP attribute mapped to the user's first name. */
		firstNameAttribute: string;
		/** LDAP attribute mapped to the user's last name. */
		lastNameAttribute: string;
		/** LDAP attribute mapped to the user's email. */
		emailAttribute: string;
		/** LDAP attribute used for login (usually the same as emailAttribute). */
		loginIdAttribute: string;
		/** LDAP attribute that uniquely identifies a user. */
		ldapIdAttribute: string;
		/** Additional LDAP filter to apply when searching for users. Use an empty string for no additional filter. */
		userFilter: string;
		/** Whether automatic LDAP synchronization is enabled. */
		synchronizationEnabled: boolean;
		/** Interval in minutes between automatic synchronizations. Ignored if synchronizationEnabled is false. */
		synchronizationInterval: number;
		/** Number of LDAP entries to fetch per search page. */
		searchPageSize: number;
		/** LDAP search timeout in seconds. */
		searchTimeout: number;
		/** Whether to enforce that email addresses are unique across LDAP users. When true, if two users have the same email, only the first will be imported. */
		enforceEmailUniqueness: boolean;
		/** Whether an LDAP user may be linked to an existing n8n account that has the same email. When false, login and synchronization skip such users. Optional on PUT; the stored value is kept when omitted. */
		linkExistingAccountsByEmail?: boolean;
	};
	'settings.logStreaming.createDestination': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** Human-readable name shown in the UI. */
		label?: string;
		/** Whether the destination currently receives events. */
		enabled?: boolean;
		/** Event names (or group prefixes, e.g. `n8n.workflow`, which matches all `n8n.workflow.*` events) this destination receives. Retrieve the full list of streamable event names from `GET /settings/log-streaming/event-types`. */
		subscribedEvents?: Array<string>;
		/** Whether audit message payloads are anonymized before being sent. */
		anonymizeAuditMessages?: boolean;
		/** Circuit-breaker tuning for delivery. After repeated failures the destination stops sending for a cool-down window instead of hammering an unhealthy target. All fields are optional; sensible defaults apply when omitted. */
		circuitBreaker?: {
			/** Maximum failures within the sliding window before the breaker opens. */
			maxFailures?: number;
			/** Sliding window, in milliseconds, over which failures are counted. */
			failureWindow?: number;
		};
		/** Sends each event as an HTTP request to a URL. */
		type: 'webhook' | 'syslog' | 'sentry';
		/** Target URL that receives the event payload. */
		url?: string;
		/** HTTP method used for the request. */
		method?: string;
		/** Whether to attach custom headers to the request. */
		sendHeaders?: boolean;
		/** How custom headers are provided — `keypair` or `json`. */
		specifyHeaders?: string;
		/** Key-value pairs used when the matching `specify*` field is `keypair`. */
		headerParameters?: {
			parameters: Array<{
				name: string;
				/** Parameter value. Usually a string; numbers, booleans and null are also accepted. */
				value: string | number | boolean | N8nJsonValue;
			}>;
		};
		/** Custom headers as a JSON string when `specifyHeaders` is `json`. */
		jsonHeaders?: string;
		/** Whether to attach query parameters to the request. */
		sendQuery?: boolean;
		/** How query parameters are provided — `keypair` or `json`. */
		specifyQuery?: string;
		/** Key-value pairs used when the matching `specify*` field is `keypair`. */
		queryParameters?: {
			parameters: Array<{
				name: string;
				/** Parameter value. Usually a string; numbers, booleans and null are also accepted. */
				value: string | number | boolean | N8nJsonValue;
			}>;
		};
		/** Query parameters as a JSON string when `specifyQuery` is `json`. */
		jsonQuery?: string;
		/** Additional HTTP request options. */
		options?: {
			/** Request timeout in milliseconds. */
			timeout?: number;
			/** Accept self-signed or otherwise invalid TLS certificates. */
			allowUnauthorizedCerts?: boolean;
			/** How array-valued query parameters are serialized into the query string. */
			queryParameterArrays?: 'indices' | 'brackets' | 'repeat';
			/** Redirect-following behaviour. */
			redirect?: {
				redirect: {
					/** Whether to follow HTTP redirects. */
					followRedirects?: boolean;
					/** Maximum number of redirects to follow. */
					maxRedirects?: number;
				};
			};
			/** Outbound proxy configuration. */
			proxy?: {
				proxy: {
					/** Proxy protocol. */
					protocol: 'https' | 'http';
					/** Proxy host, without protocol or port. */
					host: string;
					/** Proxy port. */
					port: number;
				};
			};
			/** Connection socket options. */
			socket?: {
				/** Whether to keep sockets open for reuse. */
				keepAlive?: boolean;
				/** Maximum sockets per host kept open at once. */
				maxSockets?: number;
				/** Maximum idle sockets per host kept open. */
				maxFreeSockets?: number;
			};
		};
		/** Syslog server host. */
		host?: string;
		/** Syslog server port. */
		port?: number;
		/** Transport protocol. */
		protocol?: 'udp' | 'tcp' | 'tls';
		/** Syslog facility code (0–23, per RFC 5424). Common values: 0 Kernel, 1 User, 3 System, 13 Audit, 14 Alert, 16 Local0, 17 Local1, 18 Local2, 19 Local3, 20 Local4, 21 Local5, 22 Local6, 23 Local7. */
		facility?: number;
		/** Application name reported in the syslog message. */
		app_name?: string;
		/** PEM-encoded CA certificate used when `protocol` is `tls`. */
		tlsCa?: string;
		/** Sentry DSN the events are sent to. */
		dsn?: string;
	};
	'settings.logStreaming.deleteDestination': {
		/** The id of the log streaming destination. */
		destinationId: string;
	};
	'settings.logStreaming.getDestination': {
		/** The id of the log streaming destination. */
		destinationId: string;
	};
	'settings.logStreaming.listDestinations': Record<string, never>;
	'settings.logStreaming.listEventTypes': Record<string, never>;
	'settings.logStreaming.testDestination': {
		/** The id of the log streaming destination. */
		destinationId: string;
	};
	'settings.logStreaming.updateDestination': {
		/** The id of the log streaming destination. */
		destinationId: string;
		/** Human-readable name shown in the UI. */
		label?: string;
		/** Whether the destination currently receives events. */
		enabled?: boolean;
		/** Event names (or group prefixes, e.g. `n8n.workflow`, which matches all `n8n.workflow.*` events) this destination receives. Retrieve the full list of streamable event names from `GET /settings/log-streaming/event-types`. */
		subscribedEvents?: Array<string>;
		/** Whether audit message payloads are anonymized before being sent. */
		anonymizeAuditMessages?: boolean;
		/** Circuit-breaker tuning for delivery. After repeated failures the destination stops sending for a cool-down window instead of hammering an unhealthy target. All fields are optional; sensible defaults apply when omitted. */
		circuitBreaker?: {
			/** Maximum failures within the sliding window before the breaker opens. */
			maxFailures?: number;
			/** Sliding window, in milliseconds, over which failures are counted. */
			failureWindow?: number;
		};
		/** Sends each event as an HTTP request to a URL. */
		type: 'webhook' | 'syslog' | 'sentry';
		/** Target URL that receives the event payload. */
		url?: string;
		/** HTTP method used for the request. */
		method?: string;
		/** Whether to attach custom headers to the request. */
		sendHeaders?: boolean;
		/** How custom headers are provided — `keypair` or `json`. */
		specifyHeaders?: string;
		/** Key-value pairs used when the matching `specify*` field is `keypair`. */
		headerParameters?: {
			parameters: Array<{
				name: string;
				/** Parameter value. Usually a string; numbers, booleans and null are also accepted. */
				value: string | number | boolean | N8nJsonValue;
			}>;
		};
		/** Custom headers as a JSON string when `specifyHeaders` is `json`. */
		jsonHeaders?: string;
		/** Whether to attach query parameters to the request. */
		sendQuery?: boolean;
		/** How query parameters are provided — `keypair` or `json`. */
		specifyQuery?: string;
		/** Key-value pairs used when the matching `specify*` field is `keypair`. */
		queryParameters?: {
			parameters: Array<{
				name: string;
				/** Parameter value. Usually a string; numbers, booleans and null are also accepted. */
				value: string | number | boolean | N8nJsonValue;
			}>;
		};
		/** Query parameters as a JSON string when `specifyQuery` is `json`. */
		jsonQuery?: string;
		/** Additional HTTP request options. */
		options?: {
			/** Request timeout in milliseconds. */
			timeout?: number;
			/** Accept self-signed or otherwise invalid TLS certificates. */
			allowUnauthorizedCerts?: boolean;
			/** How array-valued query parameters are serialized into the query string. */
			queryParameterArrays?: 'indices' | 'brackets' | 'repeat';
			/** Redirect-following behaviour. */
			redirect?: {
				redirect: {
					/** Whether to follow HTTP redirects. */
					followRedirects?: boolean;
					/** Maximum number of redirects to follow. */
					maxRedirects?: number;
				};
			};
			/** Outbound proxy configuration. */
			proxy?: {
				proxy: {
					/** Proxy protocol. */
					protocol: 'https' | 'http';
					/** Proxy host, without protocol or port. */
					host: string;
					/** Proxy port. */
					port: number;
				};
			};
			/** Connection socket options. */
			socket?: {
				/** Whether to keep sockets open for reuse. */
				keepAlive?: boolean;
				/** Maximum sockets per host kept open at once. */
				maxSockets?: number;
				/** Maximum idle sockets per host kept open. */
				maxFreeSockets?: number;
			};
		};
		/** Syslog server host. */
		host?: string;
		/** Syslog server port. */
		port?: number;
		/** Transport protocol. */
		protocol?: 'udp' | 'tcp' | 'tls';
		/** Syslog facility code (0–23, per RFC 5424). Common values: 0 Kernel, 1 User, 3 System, 13 Audit, 14 Alert, 16 Local0, 17 Local1, 18 Local2, 19 Local3, 20 Local4, 21 Local5, 22 Local6, 23 Local7. */
		facility?: number;
		/** Application name reported in the syslog message. */
		app_name?: string;
		/** PEM-encoded CA certificate used when `protocol` is `tls`. */
		tlsCa?: string;
		/** Sentry DSN the events are sent to. */
		dsn?: string;
	};
	'settings.oidc.get': Record<string, never>;
	'settings.oidc.update': {
		/** The client ID issued when registering n8n with the OIDC provider. */
		clientId: string;
		/** The client secret issued when registering n8n with the OIDC provider. Submit the redacted sentinel value returned on read to keep the stored secret unchanged. */
		clientSecret: string;
		/** The OIDC provider's well-known discovery endpoint. */
		discoveryEndpoint: string;
		/** Whether OIDC single sign-on is enabled. */
		loginEnabled: boolean;
		/** The prompt parameter to use when authenticating. */
		prompt: 'none' | 'login' | 'consent' | 'select_account' | 'create';
		/** ACR values to include in the authorization request (acr_values parameter), in order of preference. Use an empty array when unused. */
		authenticationContextClassReference: Array<string>;
		/** Additional scopes to request, space separated. n8n always requests `openid`, `profile` and `email`. Use an empty string when unused. */
		additionalScopes: string;
		/** Whether the identity provider must assert that the user's email address is verified before the login is accepted. When disabled, only an explicit negative assertion is rejected. */
		emailVerifiedRequired: boolean;
		/** Whether signing out of n8n also ends the session at the OIDC provider via RP-Initiated Logout. When disabled, sign-out is local to n8n only. */
		rpInitiatedLogoutEnabled: boolean;
	};
	'settings.otel.get': Record<string, never>;
	'settings.otel.testTrace': {
		/** The wire protocol used to send the test span. Collectors conventionally serve OTLP/HTTP on port 4318 and OTLP/gRPC on port 4317. The endpoint scheme (`http://` or `https://`) controls TLS for both protocols. Optional: omitting it selects `http/protobuf`, unless an environment variable manages… */
		exporterProtocol?: 'http/protobuf' | 'grpc';
		/** The base URL of the OTLP collector to export traces to. The value must be an `http://` or `https://` URL, because the scheme selects TLS — for gRPC, `https://` uses SSL and `http://` is plaintext. */
		exporterEndpoint: string;
		/** The path appended to the endpoint for the OTLP traces signal. Ignored when `exporterProtocol` is `grpc`, which takes no URL path. */
		exporterTracingPath: string;
		/** The `service.name` resource attribute reported on the test span. */
		exporterServiceName: string;
		/** Additional headers sent to the OTLP collector, as a single string of comma-separated `key=value` pairs (e.g. `authorization=Bearer my-token,x-tenant-id=acme`). Whitespace around each key and value is trimmed; a value may contain spaces but not commas. Use an empty string when unused. */
		exporterHeaders: string;
		/** How long, in milliseconds, to wait for the collector to respond. */
		startupConnectivityTimeoutMs: number;
	};
	'settings.otel.update': {
		/** Whether OpenTelemetry tracing is enabled. */
		enabled: boolean;
		/** The wire protocol used to export spans. Collectors conventionally serve OTLP/HTTP on port 4318 and OTLP/gRPC on port 4317. The endpoint scheme (`http://` or `https://`) controls TLS for both protocols. Optional: a write that omits it selects `http/protobuf`, but an instance that sets this field… */
		exporterProtocol?: 'http/protobuf' | 'grpc';
		/** The base URL of the OTLP collector to export traces to. The value must be an `http://` or `https://` URL, because the scheme selects TLS — for gRPC, `https://` uses SSL and `http://` is plaintext. */
		exporterEndpoint: string;
		/** The path appended to the endpoint for the OTLP traces signal. Ignored when `exporterProtocol` is `grpc`, which takes no URL path. */
		exporterTracingPath: string;
		/** The `service.name` resource attribute reported on every span. */
		exporterServiceName: string;
		/** Additional headers sent to the OTLP collector, as a single string of comma-separated `key=value` pairs (e.g. `authorization=Bearer my-token,x-tenant-id=acme`). Whitespace around each key and value is trimmed; a value may contain spaces but not commas. Use an empty string when unused. */
		exporterHeaders: string;
		/** The ratio of traces to sample, between 0 (none) and 1 (all). */
		tracesSampleRate: number;
		/** How long, in milliseconds, to wait when checking the collector is reachable. Also used as the timeout for the test-trace endpoint. */
		startupConnectivityTimeoutMs: number;
		/** Whether to emit a span for each node execution in addition to the workflow span. */
		includeNodeSpans: boolean;
		/** Whether to emit a `workflow.execute.started` span with a duration of 0 ms when each execution or resumed segment starts. Optional: a write that omits it selects `false`, but an instance that sets this field to `true` with an environment variable rejects that write with 409. */
		emitWorkflowStartSpan?: boolean;
		/** Whether to emit a `node.execute.started` span with a duration of 0 ms when each node span starts. This doubles the number of node spans. Has no effect when `includeNodeSpans` is false. Optional: a write that omits it selects `false`, but an instance that sets this field to `true` with an… */
		emitNodeStartSpan?: boolean;
		/** Whether to inject trace context headers into outbound HTTP requests made by nodes. */
		injectOutbound: boolean;
		/** When true, only production executions of published (active) workflows are traced, not manual/test runs. */
		productionExecutionsOnly: boolean;
	};
	'settings.rateLimits.get': Record<string, never>;
	'settings.rateLimits.update': {
		/** Whether Public API rate limiting is enabled. */
		enabled: boolean;
		/** Read requests allowed for one API key across all endpoints. Set 0 for no limit. */
		globalReadLimit: number;
		/** The window for the global read limit, in seconds. */
		globalReadWindowSeconds: number;
		/** Write requests allowed for one API key across all endpoints. Set 0 for no limit. */
		globalWriteLimit: number;
		/** The window for the global write limit, in seconds. */
		globalWriteWindowSeconds: number;
		/** Read requests allowed for one API key on one endpoint. Set 0 for no limit. */
		endpointReadLimit: number;
		/** The window for the endpoint read limit, in seconds. */
		endpointReadWindowSeconds: number;
		/** Write requests allowed for one API key on one endpoint. Set 0 for no limit. */
		endpointWriteLimit: number;
		/** The window for the endpoint write limit, in seconds. */
		endpointWriteWindowSeconds: number;
	};
	'settings.saml.get': Record<string, never>;
	'settings.saml.update': {
		/** Mapping of SAML attributes to n8n user fields. Use empty strings / empty arrays for unused attributes. */
		mapping: {
			/** SAML attribute mapped to the user's email. */
			email: string;
			/** SAML attribute mapped to the user's first name. */
			firstName: string;
			/** SAML attribute mapped to the user's last name. */
			lastName: string;
			/** SAML attribute mapped to the user's principal name. */
			userPrincipalName: string;
			/** SAML attribute that states whether the identity provider verified the user's email. Accepted values are `true` and `false`, case-insensitive. Use an empty string when unused. */
			emailVerified: string;
			/** SAML attribute mapped to the n8n instance role. Use an empty string when unused. */
			n8nInstanceRole: string;
			/** SAML attributes mapped to n8n project roles, formatted as `<projectId>:<role>`. Use an empty array when unused. */
			n8nProjectRoles: Array<string>;
		};
		/** Identity provider metadata in XML format. Use an empty string to clear stored metadata (also clears metadataUrl when no URL is provided). Use the redaction placeholder from a prior GET to leave an existing value unchanged. */
		metadata: string;
		/** URL to fetch identity provider metadata from. Use an empty string to clear a stored URL. */
		metadataUrl: string;
		/** Whether to ignore SSL certificate errors when fetching metadata from a URL. */
		ignoreSSL: boolean;
		/** SAML login request binding. */
		loginBinding: 'redirect' | 'post';
		/** Whether SAML login is enabled. */
		loginEnabled: boolean;
		/** Label shown on the SAML login button. */
		loginLabel: string;
		/** Whether authentication requests are signed. */
		authnRequestsSigned: boolean;
		/** Whether signed assertions are required. */
		wantAssertionsSigned: boolean;
		/** Whether signed SAML messages are required. */
		wantMessageSigned: boolean;
		/** Whether the identity provider must assert that the user's email address is verified before a login is linked to an existing user by email. When disabled, only an explicit negative assertion is rejected. */
		emailVerifiedRequired: boolean;
		/** PEM-encoded private key for signing SAML AuthnRequests. Use an empty string to clear an existing key, or the redaction placeholder from a prior GET to leave it unchanged. */
		signingPrivateKey: string;
		/** PEM-encoded certificate containing the public key matching the signing private key. Use an empty string when unused or to clear an existing certificate. */
		signingCertificate: string;
		/** Assertion Consumer Service binding. */
		acsBinding: 'redirect' | 'post';
		/** Configuration for the signature in SAML requests and responses. */
		signatureConfig: {
			prefix: string;
			location: {
				reference: string;
				action: 'before' | 'after' | 'prepend' | 'append';
			};
		};
		/** Default relay state value for SAML requests. Use an empty string when unused. */
		relayState: string;
		/** Service provider entity ID. Returned by GET for convenience; ignored on write so a GET response can be sent back as a PUT body. */
		entityID?: string;
		/** Assertion Consumer Service return URL. Returned by GET for convenience; ignored on write so a GET response can be sent back as a PUT body. */
		returnUrl?: string;
	};
	'settings.securityPolicy.get': Record<string, never>;
	'settings.securityPolicy.update': {
		/** Whether members may publish workflows and agents from their personal space. */
		personalSpacePublishing: boolean;
		/** Whether members may share workflows and credentials from their personal space. */
		personalSpaceSharing: boolean;
		redactionEnforcement: {
			/** Minimum execution-data redaction level enforced across the instance. */
			floor: false | 'production' | 'all';
		};
		/** Read-only usage count returned by GET. Ignored on write so a GET response can be sent back as a PUT body. */
		publishedPersonalWorkflowsCount?: number;
		/** Read-only usage count returned by GET. Ignored on write so a GET response can be sent back as a PUT body. */
		sharedPersonalWorkflowsCount?: number;
		/** Read-only usage count returned by GET. Ignored on write so a GET response can be sent back as a PUT body. */
		sharedPersonalCredentialsCount?: number;
	};
	'sourceControl.getStatus': {
		direction: 'push' | 'pull';
	};
	'sourceControl.pull': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** Discard local changes and force the pull to complete. */
		force?: boolean;
		/** Controls automatic workflow publishing after import: - `none`: Keep workflows in their local published state (default) - `all`: Publish all imported workflows - `published`: Publish only workflows that were published locally before import */
		autoPublish?: 'none' | 'all' | 'published';
	};
	'sourceControl.push': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		commitMessage: string;
		fileNames: Array<{
			id: string;
			type:
				| 'credential'
				| 'workflow'
				| 'tags'
				| 'variables'
				| 'file'
				| 'folders'
				| 'project'
				| 'datatable';
		}>;
		force?: boolean;
	};
	'tags.create': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		name: string;
	};
	'tags.delete': {
		/** The ID of the tag. */
		tagId: string;
	};
	'tags.get': {
		/** The ID of the tag. */
		tagId: string;
	};
	'tags.list': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
	};
	'tags.update': {
		/** The ID of the tag. */
		tagId: string;
		name: string;
	};
	'users.changeRole': {
		/** The ID of the user. */
		userId: string;
		newRoleName: 'global:admin' | 'global:member' | 'global:chatUser' | string;
	};
	'users.delete': {
		/** The ID of the user. */
		userId: string;
		/** ID of the project to transfer the deleted user's workflows and credentials to. Omit to delete those resources instead of transferring them. */
		transferId?: string;
	};
	'users.get': {
		/** The ID or email of the user. */
		userId: string;
		includeRole?: boolean;
	};
	'users.invite': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		users: Array<{
			email: string;
			role?: 'global:admin' | 'global:member' | 'global:chatUser' | string;
		}>;
	};
	'users.list': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		includeRole?: boolean;
		projectId?: string;
	};
	'variables.create': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		key: string;
		value: string;
		projectId?: string;
	};
	'variables.delete': {
		/** The ID of the variable. */
		id: string;
	};
	'variables.list': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		projectId?: string;
		state?: 'empty';
	};
	'variables.update': {
		/** The ID of the variable. */
		id: string;
		key: string;
		value: string;
		projectId?: string | null;
	};
	'workflows.activate': {
		/** The ID of the workflow */
		workflowId: string;
		/** The specific version ID to activate or publish. If not provided, the latest version is used. */
		versionId?: string;
		/** Optional name for the workflow version during activation. */
		name?: string;
		/** Optional description for the workflow version during activation. */
		description?: string;
	};
	'workflows.archive': {
		/** The ID of the workflow */
		workflowId: string;
	};
	'workflows.create': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		name: string;
		/** Nodes that make up the workflow */
		nodes: Array<{
			id?: string;
			name?: string;
			webhookId?: string;
			disabled?: boolean;
			notesInFlow?: boolean;
			notes?: string;
			type?: string;
			typeVersion?: number;
			executeOnce?: boolean;
			alwaysOutputData?: boolean;
			retryOnFail?: boolean;
			maxTries?: number;
			waitBetweenTries?: number;
			/** use onError instead */
			continueOnFail?: boolean;
			onError?: string;
			position?: Array<number>;
			parameters?: Record<string, N8nJsonValue>;
			credentials?: Record<string, N8nJsonValue>;
			customTelemetryTags?: {
				tag?: Array<{
					key: string;
					value: string;
				}>;
			};
			extendsCredential?: string;
		}>;
		/** Connections between nodes, keyed by source node name */
		connections: Record<string, N8nJsonValue>;
		settings: {
			saveExecutionProgress?: boolean;
			saveManualExecutions?: boolean;
			saveDataErrorExecution?: 'all' | 'none';
			saveDataSuccessExecution?: 'all' | 'none';
			executionTimeout?: number;
			/** The ID of the workflow that contains the error trigger node. */
			errorWorkflow?: string;
			timezone?: string;
			executionOrder?: string;
			/** Controls how binary data is resolved from a node's input. This is a derived, internal setting rather than something intended to be set programmatically. It is included in workflow responses for reference, but any value sent when creating or updating a workflow is ignored. */
			binaryMode?: 'separate' | 'combined';
			/** The execution engine that runs this workflow. n8n sets it on new workflows when the instance runs new workflows on engine v2 (`N8N_ENGINE_DEFAULT_TYPE=v2` with the `engine-v2` module enabled). It is included in workflow responses for reference, but any value sent when creating or updating a… */
			engineType?: string | null;
			/** Controls which workflows are allowed to call this workflow using the Execute Workflow node. Defaults to workflowsFromSameOwner. Available options: - `any`: Any workflow can call this workflow (no restrictions) - `none`: No other workflows can call this workflow (completely blocked) -… */
			callerPolicy?:
				| 'any'
				| 'none'
				| 'workflowsFromAList'
				| 'workflowsFromSameOwner';
			/** Comma-separated list of workflow IDs allowed to call this workflow (only used with the workflowsFromAList policy) */
			callerIds?: string;
			/** Controls how the time saved per execution is calculated. Available options: - `fixed`: Uses the value in `timeSavedPerExecution`. Use when the time saved is the same for every execution. - `dynamic`: Calculates the time saved from actual execution metrics. `timeSavedPerExecution` is ignored. */
			timeSavedMode?: 'fixed' | 'dynamic';
			/** Estimated time saved per execution in minutes */
			timeSavedPerExecution?: number;
			/** Controls whether execution data is redacted for this workflow. Available options: - `none` (default): No redaction. All execution data is stored. - `non-manual`: Redact production (non-manually triggered) executions only. - `manual-only`: Redact manually triggered executions only. - `all`:… */
			redactionPolicy?: 'none' | 'non-manual' | 'manual-only' | 'all';
			/** Controls whether a workflow that calls this workflow as a sub-workflow has its executions redacted on the same channels as this workflow. The calling execution keeps a copy of the output of this workflow. Defaults to true. Turn it off only when the output of this workflow is not sensitive.… */
			redactCallerExecutions?: boolean;
			/** Controls whether this workflow is reachable over the Model Context Protocol (MCP). Defaults to false. The workflow must be active and must hold at least one active Webhook node. */
			availableInMCP?: boolean;
			customTelemetryTags?: Array<{
				key: string;
				value: string;
			}>;
			/** ID of the credential resolver that resolves credentials for this workflow. This is a derived, internal setting managed through the credential resolver configuration rather than something intended to be set programmatically. It is included in workflow responses for reference, but any value sent… */
			credentialResolverId?: string;
		};
		/** Visual groupings of nodes shown as frames on the canvas */
		nodeGroups?: Array<{
			/** Unique identifier for the node group */
			id: string;
			/** Display name of the node group */
			name: string;
			/** Optional plain-text description of the node group */
			description?: string;
			/** IDs of the nodes that belong to this group */
			nodeIds: Array<string>;
		}>;
		/** Data the workflow keeps between executions */
		staticData?: string | Record<string, N8nJsonValue> | N8nJsonValue;
		/** Pinned sample data for nodes, keyed by node name */
		pinData?: Record<string, N8nJsonValue> | null;
		/** Target project to create the workflow in. Defaults to the user's personal project. */
		projectId?: string;
		/** ID of the folder to place the workflow in. Omit or null to place at the project root. */
		parentFolderId?: string | null;
		/** Accepted for compatibility and ignored. The owner share is derived from the target project. */
		shared?: Array<{
			role?: string;
			workflowId?: string;
			projectId?: string;
			project?: {
				name?: string;
			};
		}>;
		/** Description of the workflow */
		description?: string;
	};
	'workflows.deactivate': {
		/** The ID of the workflow */
		workflowId: string;
	};
	'workflows.delete': {
		/** The ID of the workflow */
		workflowId: string;
	};
	'workflows.get': {
		/** The ID of the workflow */
		workflowId: string;
		excludePinnedData?: boolean;
	};
	'workflows.getDependencies': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		/** The ID of the workflow */
		workflowId: string;
	};
	'workflows.getTags': {
		/** The ID of the workflow */
		workflowId: string;
	};
	'workflows.getVersion': {
		/** The ID of the workflow */
		workflowId: string;
		/** The ID of the workflow version */
		workflowVersionId: string;
	};
	'workflows.getVersionLegacy': {
		/** The ID of the workflow */
		workflowId: string;
		/** The ID of the workflow version */
		workflowVersionId: string;
	};
	'workflows.list': {
		/** The number of items to skip before starting to collect the result set. */
		offset?: number;
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		active?: boolean;
		tags?: string;
		name?: string;
		projectId?: string;
		excludePinnedData?: boolean;
		/** Whether to add `parentFolder` to each workflow. `parentFolder` holds the ID of the folder that contains the workflow, or is `null` at the project root. */
		includeParentFolder?: boolean;
	};
	'workflows.listHistory': {
		/** The maximum number of items to return. */
		limit?: number;
		/** Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail. */
		cursor?: string;
		/** The ID of the workflow */
		workflowId: string;
	};
	'workflows.publish': {
		/** The ID of the workflow */
		workflowId: string;
		/** The specific version ID to publish. If not provided, the latest version is used. */
		versionId?: string;
		/** Optional name for the workflow version during publication */
		name?: string;
		/** Optional description for the workflow version during publication */
		description?: string;
	};
	'workflows.run': {
		/** Safe retry key for this POST. Use 1 to 128 visible ASCII characters. The same key and the same request return the first successful response. A different request with this key returns 422. A retry while the first request is in progress returns 409. */
		idempotencyKey?: string;
		/** The ID of the workflow */
		workflowId: string;
		/** Run data to reuse, keyed by node name. Use `data.resultData.runData` from `GET /executions/{id}?includeData=true`. n8n reuses the output of these nodes and runs the other nodes up to the destination node. If the run data does not reach the destination node from a trigger, n8n runs the workflow… */
		runData: Record<string, N8nJsonValue>;
		/** The node where the run stops. */
		destinationNode: {
			/** Name of the node to run to. */
			nodeName: string;
			/** `inclusive` runs the destination node. `exclusive` stops before the destination node. */
			mode: 'inclusive' | 'exclusive';
		};
		/** Names of nodes that changed since the run data was made. n8n runs these nodes again and does not reuse their run data. */
		dirtyNodeNames?: Array<string>;
	};
	'workflows.setTags': {
		/** The ID of the workflow */
		workflowId: string;
		tags: Array<{
			id: string;
		}>;
	};
	'workflows.transfer': {
		/** The ID of the workflow */
		workflowId: string;
		destinationProjectId: string;
	};
	'workflows.unarchive': {
		/** The ID of the workflow */
		workflowId: string;
	};
	'workflows.unpublish': {
		/** The ID of the workflow */
		workflowId: string;
	};
	'workflows.update': {
		/** The ID of the workflow */
		workflowId: string;
		/** Whether to publish the update if the workflow is currently published. Set to `false` to save the change as a draft on the existing published version instead of releasing it. Has no effect on a workflow that isn't currently published. */
		publishIfActive?: boolean;
		name: string;
		/** Nodes that make up the workflow */
		nodes: Array<{
			id?: string;
			name?: string;
			webhookId?: string;
			disabled?: boolean;
			notesInFlow?: boolean;
			notes?: string;
			type?: string;
			typeVersion?: number;
			executeOnce?: boolean;
			alwaysOutputData?: boolean;
			retryOnFail?: boolean;
			maxTries?: number;
			waitBetweenTries?: number;
			/** use onError instead */
			continueOnFail?: boolean;
			onError?: string;
			position?: Array<number>;
			parameters?: Record<string, N8nJsonValue>;
			credentials?: Record<string, N8nJsonValue>;
			customTelemetryTags?: {
				tag?: Array<{
					key: string;
					value: string;
				}>;
			};
			extendsCredential?: string;
		}>;
		/** Connections between nodes, keyed by source node name */
		connections: Record<string, N8nJsonValue>;
		settings: {
			saveExecutionProgress?: boolean;
			saveManualExecutions?: boolean;
			saveDataErrorExecution?: 'all' | 'none';
			saveDataSuccessExecution?: 'all' | 'none';
			executionTimeout?: number;
			/** The ID of the workflow that contains the error trigger node. */
			errorWorkflow?: string;
			timezone?: string;
			executionOrder?: string;
			/** Controls how binary data is resolved from a node's input. This is a derived, internal setting rather than something intended to be set programmatically. It is included in workflow responses for reference, but any value sent when creating or updating a workflow is ignored. */
			binaryMode?: 'separate' | 'combined';
			/** The execution engine that runs this workflow. n8n sets it on new workflows when the instance runs new workflows on engine v2 (`N8N_ENGINE_DEFAULT_TYPE=v2` with the `engine-v2` module enabled). It is included in workflow responses for reference, but any value sent when creating or updating a… */
			engineType?: string | null;
			/** Controls which workflows are allowed to call this workflow using the Execute Workflow node. Defaults to workflowsFromSameOwner. Available options: - `any`: Any workflow can call this workflow (no restrictions) - `none`: No other workflows can call this workflow (completely blocked) -… */
			callerPolicy?:
				| 'any'
				| 'none'
				| 'workflowsFromAList'
				| 'workflowsFromSameOwner';
			/** Comma-separated list of workflow IDs allowed to call this workflow (only used with the workflowsFromAList policy) */
			callerIds?: string;
			/** Controls how the time saved per execution is calculated. Available options: - `fixed`: Uses the value in `timeSavedPerExecution`. Use when the time saved is the same for every execution. - `dynamic`: Calculates the time saved from actual execution metrics. `timeSavedPerExecution` is ignored. */
			timeSavedMode?: 'fixed' | 'dynamic';
			/** Estimated time saved per execution in minutes */
			timeSavedPerExecution?: number;
			/** Controls whether execution data is redacted for this workflow. Available options: - `none` (default): No redaction. All execution data is stored. - `non-manual`: Redact production (non-manually triggered) executions only. - `manual-only`: Redact manually triggered executions only. - `all`:… */
			redactionPolicy?: 'none' | 'non-manual' | 'manual-only' | 'all';
			/** Controls whether a workflow that calls this workflow as a sub-workflow has its executions redacted on the same channels as this workflow. The calling execution keeps a copy of the output of this workflow. Defaults to true. Turn it off only when the output of this workflow is not sensitive.… */
			redactCallerExecutions?: boolean;
			/** Controls whether this workflow is reachable over the Model Context Protocol (MCP). Defaults to false. The workflow must be active and must hold at least one active Webhook node. */
			availableInMCP?: boolean;
			customTelemetryTags?: Array<{
				key: string;
				value: string;
			}>;
			/** ID of the credential resolver that resolves credentials for this workflow. This is a derived, internal setting managed through the credential resolver configuration rather than something intended to be set programmatically. It is included in workflow responses for reference, but any value sent… */
			credentialResolverId?: string;
		};
		/** Visual groupings of nodes shown as frames on the canvas */
		nodeGroups?: Array<{
			/** Unique identifier for the node group */
			id: string;
			/** Display name of the node group */
			name: string;
			/** Optional plain-text description of the node group */
			description?: string;
			/** IDs of the nodes that belong to this group */
			nodeIds: Array<string>;
		}>;
		/** Data the workflow keeps between executions */
		staticData?: string | Record<string, N8nJsonValue> | N8nJsonValue;
		/** Pinned sample data for nodes, keyed by node name */
		pinData?: Record<string, N8nJsonValue> | null;
		/** ID of the folder to move the workflow into. Pass null to move it to the project root; omit to leave its current folder unchanged. */
		parentFolderId?: string | null;
		/** Accepted for compatibility and ignored. The owner share is derived from the target project. */
		shared?: Array<{
			role?: string;
			workflowId?: string;
			projectId?: string;
			project?: {
				name?: string;
			};
		}>;
		/** Description of the workflow */
		description?: string;
	};
};

export type N8nOperationOutputs = {
	'agents.archive': N8nAgentPublicDtoGenerated;
	'agents.create': {
		id?: string | null;
		name?: string | null;
		projectId?: string | null;
		project?: {
			id?: string | null;
			name?: string | null;
			type?: string | null;
		} | null;
		availableInMCP?: boolean | null;
		isArchived?: boolean | null;
		versionId?: string | null;
		activeVersionId?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
		config?: Record<string, N8nJsonValue> | null;
		configHash?: string | null;
		tools?: {
			[key: string]: {
				code?: string | null;
				/** The tool descriptor. `name` is required; other fields pass through. */
				descriptor?: {
					name?: string | null;
				} | null;
			};
		} | null;
		activeVersion?: {
			versionId?: string | null;
			integrations?: Array<{
				/** The integration type, for example `slack` or `webhook`. */
				type?: string | null;
				credentialId?: string | null;
				/** Platform-specific integration settings. */
				settings?: Record<string, N8nJsonValue> | null;
				/** Channel actions that need approval before they run. */
				approval?: Record<string, N8nJsonValue> | null;
			}> | null;
		} | null;
		parentFolder?: {
			id?: string | null;
			name?: string | null;
			parentFolderId?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		} | null;
	};
	'agents.delete': {
		id?: string | null;
		name?: string | null;
		projectId?: string | null;
		availableInMCP?: boolean | null;
		versionId?: string | null;
		activeVersionId?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
	};
	'agents.executions.list': {
		data?: Array<{
			executionId?: string | null;
			sessionId?: string | null;
			status?: string | null;
			source?: string | null;
			createdAt?: string | null;
			startedAt?: string | null;
			stoppedAt?: string | null;
			usage?: {
				promptTokens?: number | null;
				completionTokens?: number | null;
				totalTokens?: number | null;
				cost?: number | null;
			} | null;
		}> | null;
		nextCursor?: string | null;
	};
	'agents.executions.stop': {
		executionId?: string | null;
		status?: string | null;
	};
	'agents.get': N8nAgentPublicDtoGenerated;
	'agents.list': {
		data?: Array<{
			id?: string | null;
			name?: string | null;
			projectId?: string | null;
			availableInMCP?: boolean | null;
			isArchived?: boolean | null;
			versionId?: string | null;
			activeVersionId?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		}> | null;
		nextCursor?: string | null;
	};
	'agents.publish': N8nAgentPublicDtoGenerated;
	'agents.run': {
		/** The final text of the run. */
		response?: string | null;
		/** The session this run belongs to. */
		sessionId?: string | null;
		/** The execution id of this run. */
		executionId?: string | null;
		status?: string | null;
		usage?: {
			promptTokens?: number | null;
			completionTokens?: number | null;
			totalTokens?: number | null;
			cost?: number | null;
		} | null;
		error?: string | null;
	};
	'agents.unarchive': N8nAgentPublicDtoGenerated;
	'agents.unpublish': N8nAgentPublicDtoGenerated;
	'agents.update': N8nAgentPublicDtoGenerated;
	'agents.versions.get': {
		versionId?: string | null;
		agentId?: string | null;
		name?: string | null;
		description?: string | null;
		author?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
		isActive?: boolean | null;
		isCurrent?: boolean | null;
		lastPublished?: {
			author?: string | null;
			createdAt?: string | null;
			isLegacy?: boolean | null;
		} | null;
		config?: Record<string, N8nJsonValue> | null;
		tools?: {
			[key: string]: {
				code?: string | null;
				/** The tool descriptor. `name` is required; other fields pass through. */
				descriptor?: {
					name?: string | null;
				} | null;
			};
		} | null;
		skills?: { [key: string]: Record<string, N8nJsonValue> } | null;
	};
	'agents.versions.list': {
		data?: Array<{
			versionId?: string | null;
			agentId?: string | null;
			name?: string | null;
			description?: string | null;
			author?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
			isActive?: boolean | null;
			isCurrent?: boolean | null;
			lastPublished?: {
				author?: string | null;
				createdAt?: string | null;
				isLegacy?: boolean | null;
			} | null;
		}> | null;
		nextCursor?: string | null;
	};
	'aiPreferences.create': N8nAiPreferencePublicDtoGenerated;
	'aiPreferences.delete': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'aiPreferences.get': N8nAiPreferencePublicDtoGenerated;
	'aiPreferences.list': {
		data?: Array<{
			id?: string | null;
			content?: string | null;
			scope?: string | null;
			userId?: string | null;
			projectId?: string | null;
			source?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		}> | null;
		nextCursor?: string | null;
	};
	'aiPreferences.update': N8nAiPreferencePublicDtoGenerated;
	'audit.generate':
		| {
				'Credentials Risk Report'?: {
					risk?: string | null;
					sections?: Array<{
						title?: string | null;
						description?: string | null;
						recommendation?: string | null;
						location?: Array<
							| {
									kind?: string | null;
									workflowId?: string | null;
									workflowName?: string | null;
									nodeId?: string | null;
									nodeName?: string | null;
									nodeType?: string | null;
							  }
							| {
									kind?: string | null;
									id?: string | null;
									name?: string | null;
							  }
							| {
									kind?: string | null;
									nodeType?: string | null;
									packageUrl?: string | null;
							  }
							| {
									kind?: string | null;
									nodeType?: string | null;
									filePath?: string | null;
							  }
						> | null;
						settings?: Record<string, N8nJsonValue> | null;
						nextVersions?: Array<N8nAuditVersionGenerated> | null;
					}> | null;
				} | null;
				'Database Risk Report'?: {
					risk?: string | null;
					sections?: Array<{
						title?: string | null;
						description?: string | null;
						recommendation?: string | null;
						location?: Array<
							| {
									kind?: string | null;
									workflowId?: string | null;
									workflowName?: string | null;
									nodeId?: string | null;
									nodeName?: string | null;
									nodeType?: string | null;
							  }
							| {
									kind?: string | null;
									id?: string | null;
									name?: string | null;
							  }
							| {
									kind?: string | null;
									nodeType?: string | null;
									packageUrl?: string | null;
							  }
							| {
									kind?: string | null;
									nodeType?: string | null;
									filePath?: string | null;
							  }
						> | null;
						settings?: Record<string, N8nJsonValue> | null;
						nextVersions?: Array<N8nAuditVersionGenerated> | null;
					}> | null;
				} | null;
				'Filesystem Risk Report'?: {
					risk?: string | null;
					sections?: Array<{
						title?: string | null;
						description?: string | null;
						recommendation?: string | null;
						location?: Array<
							| {
									kind?: string | null;
									workflowId?: string | null;
									workflowName?: string | null;
									nodeId?: string | null;
									nodeName?: string | null;
									nodeType?: string | null;
							  }
							| {
									kind?: string | null;
									id?: string | null;
									name?: string | null;
							  }
							| {
									kind?: string | null;
									nodeType?: string | null;
									packageUrl?: string | null;
							  }
							| {
									kind?: string | null;
									nodeType?: string | null;
									filePath?: string | null;
							  }
						> | null;
						settings?: Record<string, N8nJsonValue> | null;
						nextVersions?: Array<N8nAuditVersionGenerated> | null;
					}> | null;
				} | null;
				'Nodes Risk Report'?: {
					risk?: string | null;
					sections?: Array<{
						title?: string | null;
						description?: string | null;
						recommendation?: string | null;
						location?: Array<
							| {
									kind?: string | null;
									workflowId?: string | null;
									workflowName?: string | null;
									nodeId?: string | null;
									nodeName?: string | null;
									nodeType?: string | null;
							  }
							| {
									kind?: string | null;
									id?: string | null;
									name?: string | null;
							  }
							| {
									kind?: string | null;
									nodeType?: string | null;
									packageUrl?: string | null;
							  }
							| {
									kind?: string | null;
									nodeType?: string | null;
									filePath?: string | null;
							  }
						> | null;
						settings?: Record<string, N8nJsonValue> | null;
						nextVersions?: Array<N8nAuditVersionGenerated> | null;
					}> | null;
				} | null;
				'Instance Risk Report'?: {
					risk?: string | null;
					sections?: Array<{
						title?: string | null;
						description?: string | null;
						recommendation?: string | null;
						location?: Array<
							| {
									kind?: string | null;
									workflowId?: string | null;
									workflowName?: string | null;
									nodeId?: string | null;
									nodeName?: string | null;
									nodeType?: string | null;
							  }
							| {
									kind?: string | null;
									id?: string | null;
									name?: string | null;
							  }
							| {
									kind?: string | null;
									nodeType?: string | null;
									packageUrl?: string | null;
							  }
							| {
									kind?: string | null;
									nodeType?: string | null;
									filePath?: string | null;
							  }
						> | null;
						settings?: Record<string, N8nJsonValue> | null;
						nextVersions?: Array<N8nAuditVersionGenerated> | null;
					}> | null;
				} | null;
		  }
		| Array<N8nJsonValue>;
	'communityPackages.install': {
		/** npm package name */
		packageName?: string | null;
		/** Currently installed version */
		installedVersion?: string | null;
		/** Package author name */
		authorName?: string | null;
		/** Package author email */
		authorEmail?: string | null;
		/** Nodes included in this package */
		installedNodes?: Array<{
			name?: string | null;
			type?: string | null;
			latestVersion?: number | null;
		}> | null;
		createdAt?: string | null;
		updatedAt?: string | null;
		/** Version available for update, if any */
		updateAvailable?: string | null;
		/** Whether the package failed to load */
		failedLoading?: boolean | null;
		/** Node types from this package that a node type policy blocks. The install does not fail because of a policy. Absent when no policy was evaluated, for example when node type policies are not licensed. An empty nodeTypes list means that no policy blocks a node type from this package. */
		policyRestrictions?: {
			/** Blocked node types from this package. Lists only the node types that are blocked. */
			nodeTypes?: Array<{
				/** Full node type name, such as n8n-nodes-example.exampleNode. */
				type?: string | null;
				/** instance: blocked on the instance by default. projects: allowed on the instance, but blocked in one or more projects. */
				blockedOn?: string | null;
				/** Whether a project can allow this node type. True when an instance policy blocks the node type unless a project allows it. */
				optInAvailable?: boolean | null;
			}> | null;
		} | null;
	};
	'communityPackages.list': Array<{
		/** npm package name */
		packageName?: string | null;
		/** Currently installed version */
		installedVersion?: string | null;
		/** Package author name */
		authorName?: string | null;
		/** Package author email */
		authorEmail?: string | null;
		/** Nodes included in this package */
		installedNodes?: Array<{
			name?: string | null;
			type?: string | null;
			latestVersion?: number | null;
		}> | null;
		createdAt?: string | null;
		updatedAt?: string | null;
		/** Version available for update, if any */
		updateAvailable?: string | null;
		/** Whether the package failed to load */
		failedLoading?: boolean | null;
	}>;
	'communityPackages.uninstall': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'communityPackages.update': {
		/** npm package name */
		packageName?: string | null;
		/** Currently installed version */
		installedVersion?: string | null;
		/** Package author name */
		authorName?: string | null;
		/** Package author email */
		authorEmail?: string | null;
		/** Nodes included in this package */
		installedNodes?: Array<{
			name?: string | null;
			type?: string | null;
			latestVersion?: number | null;
		}> | null;
		createdAt?: string | null;
		updatedAt?: string | null;
		/** Version available for update, if any */
		updateAvailable?: string | null;
		/** Whether the package failed to load */
		failedLoading?: boolean | null;
	};
	'credentialTypePolicies.attachments.get': N8nCredentialTypePolicyAttachmentsPublicDtoGenerated;
	'credentialTypePolicies.attachments.replace': N8nCredentialTypePolicyAttachmentsPublicDtoGenerated;
	'credentialTypePolicies.documents.create': N8nCredentialTypePolicyDocumentWriteResultPublicDtoGenerated;
	'credentialTypePolicies.documents.delete': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'credentialTypePolicies.documents.get': {
		id?: string | null;
		kind?: string | null;
		rules?: Array<{
			id?: string | null;
			action?: string | null;
			selector?: {
				kind?: string | null;
				value?: string | null;
			} | null;
		}> | null;
		version?: number | null;
		updatedBy?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
	};
	'credentialTypePolicies.documents.list': {
		data?: Array<{
			id?: string | null;
			kind?: string | null;
			rules?: Array<{
				id?: string | null;
				action?: string | null;
				selector?: {
					kind?: string | null;
					value?: string | null;
				} | null;
			}> | null;
			version?: number | null;
			updatedBy?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		}> | null;
		nextCursor?: string | null;
	};
	'credentialTypePolicies.documents.update': N8nCredentialTypePolicyDocumentWriteResultPublicDtoGenerated;
	'credentialTypePolicies.getInstance': N8nCredentialTypePolicyEffectivePublicDtoGenerated;
	'credentialTypePolicies.getProject': N8nCredentialTypePolicyEffectivePublicDtoGenerated;
	'credentialTypePolicies.setInstance': N8nCredentialTypePolicyEffectiveWriteResultPublicDtoGenerated;
	'credentialTypePolicies.setProject': N8nCredentialTypePolicyEffectiveWriteResultPublicDtoGenerated;
	'credentials.create': N8nCredentialPublicDtoGenerated;
	'credentials.delete': {
		id?: string | null;
		name?: string | null;
		type?: string | null;
		isManaged?: boolean | null;
		isGlobal?: boolean | null;
		isResolvable?: boolean | null;
		resolvableAllowFallback?: boolean | null;
		resolverId?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
		/** Present only when credential descriptions are enabled. */
		description?: string | null;
		usageScope?: string | null;
	};
	'credentials.get': N8nCredentialPublicDtoGenerated;
	'credentials.getDependencies': N8nDependencyListPublicDtoGenerated;
	'credentials.getSchema': {
		additionalProperties?: boolean | null;
		type?: string | null;
		/** JSON Schema fragment for each of the credential type's fields, keyed by field name. */
		properties?: Record<string, N8nJsonValue> | null;
		/** Names of the fields that a request must include. A field with a default value is not listed. */
		required?: Array<string> | null;
		allOf?: Array<N8nJsonValue> | null;
	};
	'credentials.list': {
		data?: Array<{
			id?: string | null;
			name?: string | null;
			type?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
			shared?: Array<{
				id?: string | null;
				name?: string | null;
				role?: string | null;
				createdAt?: string | null;
				updatedAt?: string | null;
			}> | null;
		}> | null;
		nextCursor?: string | null;
	};
	'credentials.test': {
		status?: string | null;
		message?: string | null;
	};
	'credentials.transfer': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'credentials.update': N8nCredentialPublicDtoGenerated;
	'dataTables.columns.create': N8nDataTableColumnPublicDtoGenerated;
	'dataTables.columns.delete': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'dataTables.columns.list': Array<{
		/** Column ID */
		id?: string | null;
		/** Column name */
		name?: string | null;
		/** Column data type */
		type?: string | null;
		/** Column position */
		index?: number | null;
		/** Timestamp when the column was created */
		createdAt?: string | null;
		/** Timestamp when the column was last updated */
		updatedAt?: string | null;
		/** ID of the data table this column belongs to */
		dataTableId?: string | null;
	}>;
	'dataTables.columns.update': N8nDataTableColumnPublicDtoGenerated;
	'dataTables.create': N8nDataTablePublicDtoGenerated;
	'dataTables.delete': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'dataTables.get': N8nDataTablePublicDtoGenerated;
	'dataTables.getDependencies': N8nDependencyListPublicDtoGenerated;
	'dataTables.list': {
		data?: Array<{
			/** Unique identifier for the data table */
			id?: string | null;
			/** Name of the data table */
			name?: string | null;
			/** Column definitions */
			columns?: Array<{
				/** Column ID */
				id?: string | null;
				/** Column name */
				name?: string | null;
				/** Column data type */
				type?: string | null;
				/** Column position */
				index?: number | null;
				/** Timestamp when the column was created */
				createdAt?: string | null;
				/** Timestamp when the column was last updated */
				updatedAt?: string | null;
			}> | null;
			/** ID of the project this table belongs to */
			projectId?: string | null;
			/** Timestamp when the table was created */
			createdAt?: string | null;
			/** Timestamp when the table was last updated */
			updatedAt?: string | null;
			/** Physical storage in bytes, including indexes and internal overhead. Not reduced immediately by row deletion, and may be a few seconds stale. */
			sizeBytes?: number | null;
		}> | null;
		/** Paginate through data tables by setting the cursor parameter to a nextCursor attribute returned by a previous request. Default value fetches the first "page" of the collection. */
		nextCursor?: string | null;
	};
	'dataTables.rows.clear': {
		/** The number of rows that were deleted */
		deletedCount?: number | null;
	};
	'dataTables.rows.delete':
		| boolean
		| Array<{
				/** The row ID (auto-generated) */
				id?: number | null;
				/** The date and time the row was created */
				createdAt?: string | null;
				/** The date and time the row was last updated */
				updatedAt?: string | null;
				/** Whether this entry shows the row state before or after the change */
				dryRunState?: string | null;
		  }>
		| Array<{
				/** The row ID (auto-generated) */
				id?: number | null;
				/** The date and time the row was created */
				createdAt?: string | null;
				/** The date and time the row was last updated */
				updatedAt?: string | null;
		  }>;
	'dataTables.rows.insert':
		| {
				success?: boolean | null;
				insertedRows?: number | null;
		  }
		| Array<{
				id?: number | null;
		  }>
		| Array<{
				/** The row ID (auto-generated) */
				id?: number | null;
				/** The date and time the row was created */
				createdAt?: string | null;
				/** The date and time the row was last updated */
				updatedAt?: string | null;
		  }>;
	'dataTables.rows.list': {
		data?: Array<{
			/** The row ID (auto-generated) */
			id?: number | null;
			/** The date and time the row was created */
			createdAt?: string | null;
			/** The date and time the row was last updated */
			updatedAt?: string | null;
		}> | null;
		/** Paginate through rows by setting the cursor parameter to a nextCursor attribute returned by a previous request. Default value fetches the first "page" of the collection. */
		nextCursor?: string | null;
	};
	'dataTables.rows.update':
		| boolean
		| Array<{
				/** The row ID (auto-generated) */
				id?: number | null;
				/** The date and time the row was created */
				createdAt?: string | null;
				/** The date and time the row was last updated */
				updatedAt?: string | null;
				/** Whether this entry shows the row state before or after the change */
				dryRunState?: string | null;
		  }>
		| Array<{
				/** The row ID (auto-generated) */
				id?: number | null;
				/** The date and time the row was created */
				createdAt?: string | null;
				/** The date and time the row was last updated */
				updatedAt?: string | null;
		  }>;
	'dataTables.rows.upsert':
		| boolean
		| Array<{
				/** The row ID (auto-generated) */
				id?: number | null;
				/** The date and time the row was created */
				createdAt?: string | null;
				/** The date and time the row was last updated */
				updatedAt?: string | null;
				/** Whether this entry shows the row state before or after the change */
				dryRunState?: string | null;
		  }>
		| Array<{
				/** The row ID (auto-generated) */
				id?: number | null;
				/** The date and time the row was created */
				createdAt?: string | null;
				/** The date and time the row was last updated */
				updatedAt?: string | null;
		  }>;
	'dataTables.update': N8nDataTablePublicDtoGenerated;
	'discover.get': {
		data?: {
			/** The API key's active scopes */
			scopes?: Array<string> | null;
			resources?: {
				[key: string]: {
					operations?: Array<string> | null;
					endpoints?: Array<{
						method?: string | null;
						path?: string | null;
						operationId?: string | null;
						/** Request body schema (only present when include=schemas and the endpoint accepts a request body). */
						requestSchema?: Record<string, N8nJsonValue> | null;
					}> | null;
				};
			} | null;
			/** Available query parameter filters. The values arrays reflect what the caller's scopes permit. */
			filters?: {
				[key: string]: {
					description?: string | null;
					values?: Array<string> | null;
				};
			} | null;
			/** URL to the full OpenAPI specification */
			specUrl?: string | null;
		} | null;
	};
	'evaluations.cancelRun': {
		id?: string | null;
		status?: string | null;
	};
	'evaluations.getRun': {
		id?: string | null;
		status?: string | null;
		runAt?: string | null;
		completedAt?: string | null;
		/** Aggregated metrics collected across the run's test cases. */
		metrics?: Record<string, N8nJsonValue> | null;
		errorCode?: string | null;
		errorDetails?: Record<string, N8nJsonValue> | null;
		/** Overall result of the run, derived from its test cases once completed. */
		finalResult?: string | null;
		testCaseCount?: number | null;
		createdAt?: string | null;
		updatedAt?: string | null;
	};
	'evaluations.listCases': {
		data?: Array<{
			id?: string | null;
			status?: string | null;
			runAt?: string | null;
			completedAt?: string | null;
			/** Metrics produced by this test case. */
			metrics?: Record<string, N8nJsonValue> | null;
			errorCode?: string | null;
			errorDetails?: Record<string, N8nJsonValue> | null;
			/** Input data for this test case. */
			inputs?: Record<string, N8nJsonValue> | null;
			/** Output data produced by this test case. */
			outputs?: Record<string, N8nJsonValue> | null;
			/** ID of the underlying workflow execution, if still retained. */
			executionId?: number | null;
		}> | null;
		/** Paginate through test cases by setting the cursor parameter to the nextCursor attribute returned by a previous request. Default value fetches the first "page" of the collection. */
		nextCursor?: string | null;
	};
	'evaluations.listRuns': {
		data?: Array<{
			id?: string | null;
			status?: string | null;
			runAt?: string | null;
			completedAt?: string | null;
			/** Aggregated metrics collected across the run's test cases. */
			metrics?: Record<string, N8nJsonValue> | null;
			errorCode?: string | null;
			errorDetails?: Record<string, N8nJsonValue> | null;
			/** Overall result of the run, derived from its test cases once completed. */
			finalResult?: string | null;
			testCaseCount?: number | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		}> | null;
		/** Paginate through test runs by setting the cursor parameter to the nextCursor attribute returned by a previous request. Default value fetches the first "page" of the collection. */
		nextCursor?: string | null;
	};
	'evaluations.startRun': {
		id?: string | null;
		status?: string | null;
		createdAt?: string | null;
	};
	'executions.delete': {
		/** ID of the deleted execution. This endpoint returns it as a number, where every other execution endpoint returns a string. */
		id?: number | null;
		/** Whether the execution ran to completion. Use `status` instead. */
		finished?: boolean | null;
		mode?: string | null;
		/** ID of the execution this one is a retry of. */
		retryOf?: string | null;
		/** ID of the retry that succeeded, if this execution failed and a retry did not. */
		retrySuccessId?: string | null;
		status?: string | null;
		createdAt?: string | null;
		/** Null until the execution leaves the queue and starts running. */
		startedAt?: string | null;
		/** When the execution stopped. Null for the `new`, `running` and `unknown` statuses; a `waiting` execution has stopped its current run, so it has a value. */
		stoppedAt?: string | null;
		/** Always null. Soft-deleted executions are not returned. */
		deletedAt?: string | null;
		workflowId?: string | null;
		/** The time at which a waiting execution resumes. */
		waitTill?: string | null;
		/** Where the execution data is stored. */
		storedAt?: string | null;
		/** W3C trace context propagated with the execution. */
		tracingContext?: {
			traceparent?: string | null;
			tracestate?: string | null;
		} | null;
		/** Key used to stop a duplicate execution from being created. */
		deduplicationKey?: string | null;
		/** Size of the stored execution data in bytes. 0 means unknown. */
		jsonSizeBytes?: number | null;
		/** Size of the stored binary data in bytes. 0 means unknown. */
		binaryDataSizeBytes?: number | null;
		/** ID of the workflow version this execution ran. */
		workflowVersionId?: string | null;
		/** Whether the execution used credentials that are not shared with the project. */
		usedPrivateCredentials?: boolean | null;
	};
	'executions.get': {
		id?: string | null;
		/** Whether the execution ran to completion. Use `status` instead. */
		finished?: boolean | null;
		mode?: string | null;
		/** ID of the execution this one is a retry of. */
		retryOf?: string | null;
		/** ID of the retry that succeeded, if this execution failed and a retry did not. */
		retrySuccessId?: string | null;
		status?: string | null;
		createdAt?: string | null;
		/** Null until the execution leaves the queue and starts running. */
		startedAt?: string | null;
		/** When the execution stopped. Null for the `new`, `running` and `unknown` statuses; a `waiting` execution has stopped its current run, so it has a value. */
		stoppedAt?: string | null;
		/** Always null. Soft-deleted executions are not returned. */
		deletedAt?: string | null;
		workflowId?: string | null;
		/** The time at which a waiting execution resumes. */
		waitTill?: string | null;
		/** Where the execution data is stored. */
		storedAt?: string | null;
		/** W3C trace context propagated with the execution. */
		tracingContext?: {
			traceparent?: string | null;
			tracestate?: string | null;
		} | null;
		/** Key used to stop a duplicate execution from being created. */
		deduplicationKey?: string | null;
		/** Size of the stored execution data in bytes. 0 means unknown. */
		jsonSizeBytes?: number | null;
		/** Size of the stored binary data in bytes. 0 means unknown. */
		binaryDataSizeBytes?: number | null;
		/** ID of the workflow version this execution ran. */
		workflowVersionId?: string | null;
		/** Whether the execution used credentials that are not shared with the project. */
		usedPrivateCredentials?: boolean | null;
		/** Detailed execution data. Only included when `includeData` is `true`. */
		data?: {
			/** Present when execution data has been redacted. */
			redactionInfo?: {
				/** Whether the execution data was redacted. */
				isRedacted?: boolean | null;
				/** The reason for redaction. */
				reason?: string | null;
				/** Whether the current user has permission to reveal the redacted data. */
				canReveal?: boolean | null;
			} | null;
		} | null;
		/** Execution metadata set by the workflow. Only included when `includeData` is `true`. */
		customData?: { [key: string]: string } | null;
		/** The workflow as it was saved when the execution ran. Only included when `includeData` is `true`. Older executions carry more fields than newer ones. */
		workflowData?: Record<string, N8nJsonValue> | null;
		/** Present and true when the execution data was larger than `EXECUTIONS_DATA_MAX_DISPLAY_SIZE`. `data` is then empty and `jsonSizeBytes` holds the real size. Use `ignoreDataSizeLimit` to read it anyway. */
		dataTooLargeToDisplay?: boolean | null;
	};
	'executions.getTags': N8nExecutionTagsPublicDtoGenerated;
	'executions.list': {
		data?: Array<{
			id?: string | null;
			/** Whether the execution ran to completion. Use `status` instead. */
			finished?: boolean | null;
			mode?: string | null;
			/** ID of the execution this one is a retry of. */
			retryOf?: string | null;
			/** ID of the retry that succeeded, if this execution failed and a retry did not. */
			retrySuccessId?: string | null;
			status?: string | null;
			/** Null until the execution leaves the queue and starts running. */
			startedAt?: string | null;
			/** When the execution stopped. Null for the `new`, `running` and `unknown` statuses; a `waiting` execution has stopped its current run, so it has a value. */
			stoppedAt?: string | null;
			workflowId?: string | null;
			/** The time at which a waiting execution resumes. */
			waitTill?: string | null;
			/** Where the execution data is stored. */
			storedAt?: string | null;
			/** Size of the stored execution data in bytes. 0 means unknown. */
			jsonSizeBytes?: number | null;
			/** ID of the workflow version this execution ran. */
			workflowVersionId?: string | null;
			/** Detailed execution data. Only included when `includeData` is `true`. */
			data?: {
				/** Present when execution data has been redacted. */
				redactionInfo?: {
					/** Whether the execution data was redacted. */
					isRedacted?: boolean | null;
					/** The reason for redaction. */
					reason?: string | null;
					/** Whether the current user has permission to reveal the redacted data. */
					canReveal?: boolean | null;
				} | null;
			} | null;
			/** The workflow as it was saved when the execution ran. Only included when `includeData` is `true`. Older executions carry more fields than newer ones. */
			workflowData?: Record<string, N8nJsonValue> | null;
			/** Execution metadata set by the workflow. Only included when `includeData` is `true`. */
			customData?: { [key: string]: string } | null;
			/** Present and true when the execution data was larger than `EXECUTIONS_DATA_MAX_DISPLAY_SIZE`. `data` is then empty and `jsonSizeBytes` holds the real size. Use `ignoreDataSizeLimit` to read it anyway. */
			dataTooLargeToDisplay?: boolean | null;
		}> | null;
		/** Paginate through executions by setting the cursor parameter to a nextCursor attribute returned by a previous request. Default value fetches the first "page" of the collection. */
		nextCursor?: string | null;
	};
	'executions.retry': {
		/** ID of the new execution that the retry started. */
		id?: string | null;
		mode?: string | null;
		/** The time at which the new execution started. */
		startedAt?: string | null;
		workflowId?: string | null;
		/** Whether the execution ran to completion. Use `status` instead. */
		finished?: boolean | null;
		/** ID of the execution this one is a retry of. */
		retryOf?: string | null;
		status?: string | null;
		/** The time at which a waiting execution resumes. */
		waitTill?: string | null;
		/** Run data of the new execution. Absent when the API key's user cannot read the executions of the workflow. */
		data?: {
			/** Present when execution data has been redacted. */
			redactionInfo?: {
				/** Whether the execution data was redacted. */
				isRedacted?: boolean | null;
				/** The reason for redaction. */
				reason?: string | null;
				/** Whether the current user has permission to reveal the redacted data. */
				canReveal?: boolean | null;
			} | null;
		} | null;
		/** The workflow as it was saved when the original execution ran. `loadWorkflow` changes which workflow the retry runs, not what this field reports. Absent when the API key's user cannot read the executions of the workflow. */
		workflowData?: Record<string, N8nJsonValue> | null;
		/** Execution metadata carried over from the original execution. Absent when the API key's user cannot read the executions of the workflow. */
		customData?: { [key: string]: string } | null;
		/** Annotation on the original execution. Absent when it carries none, or when the API key's user cannot read the executions of the workflow. */
		annotation?: {
			id?: number | null;
			/** Vote left on the original execution. */
			vote?: string | null;
			tags?: Array<{
				id?: string | null;
				name?: string | null;
			}> | null;
		} | null;
		/** Where the execution data is stored. */
		storedAt?: string | null;
	};
	'executions.setTags': N8nExecutionTagsPublicDtoGenerated;
	'executions.stop': {
		mode?: string | null;
		/** The time at which the execution started. */
		startedAt?: string | null;
		/** The time at which the execution stopped. Absent when no stop time was recorded. */
		stoppedAt?: string | null;
		/** Whether the execution ran to completion. Use `status` instead. */
		finished?: boolean | null;
		status?: string | null;
	};
	'executions.stopMany': {
		/** The number of executions that were successfully stopped. */
		stopped?: number | null;
	};
	'folders.create': {
		id?: string | null;
		name?: string | null;
		parentFolderId?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
	};
	'folders.delete': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'folders.get': {
		id?: string | null;
		name?: string | null;
		parentFolderId?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
		/** Total number of sub-folders (recursive). */
		totalSubFolders?: number | null;
		/** Total number of workflows (recursive). */
		totalWorkflows?: number | null;
	};
	'folders.list': {
		/** Total number of folders matching the query. */
		count?: number | null;
		data?: Array<{
			id?: string | null;
			name?: string | null;
			parentFolderId?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
			homeProject?: {
				id?: string | null;
				name?: string | null;
				type?: string | null;
				/** Icon of the project, or null when the project has none */
				icon?: {
					type?: string | null;
					value?: string | null;
					color?: string | null;
				} | null;
			} | null;
			parentFolder?: {
				id?: string | null;
				name?: string | null;
				parentFolderId?: string | null;
			} | null;
			tags?: Array<{
				id?: string | null;
				name?: string | null;
			}> | null;
			/** Number of workflows the folder holds. */
			workflowCount?: number | null;
			/** Number of folders the folder holds. */
			subFolderCount?: number | null;
			/** Names of every folder from the project root down to this folder. */
			path?: Array<string> | null;
		}> | null;
	};
	'folders.update': {
		id?: string | null;
		name?: string | null;
		parentFolderId?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
	};
	'insights.getSummary': {
		total?: {
			value?: number | null;
			deviation?: number | null;
			unit?: string | null;
		} | null;
		failed?: {
			value?: number | null;
			deviation?: number | null;
			unit?: string | null;
		} | null;
		failureRate?: {
			value?: number | null;
			deviation?: number | null;
			unit?: string | null;
		} | null;
		timeSaved?: {
			value?: number | null;
			deviation?: number | null;
			unit?: string | null;
		} | null;
		averageRunTime?: {
			value?: number | null;
			deviation?: number | null;
			unit?: string | null;
		} | null;
	};
	'nodeTypePolicies.attachments.get': N8nPolicyAttachmentsPublicDtoGenerated;
	'nodeTypePolicies.attachments.replace': N8nPolicyAttachmentsPublicDtoGenerated;
	'nodeTypePolicies.documents.create': N8nPolicyDocumentWriteResultPublicDtoGenerated;
	'nodeTypePolicies.documents.delete': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'nodeTypePolicies.documents.get': {
		id?: string | null;
		kind?: string | null;
		rules?: Array<{
			id?: string | null;
			action?: string | null;
			selector?: {
				kind?: string | null;
				value?: string | null;
			} | null;
		}> | null;
		version?: number | null;
		updatedBy?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
	};
	'nodeTypePolicies.documents.list': {
		data?: Array<{
			id?: string | null;
			kind?: string | null;
			rules?: Array<{
				id?: string | null;
				action?: string | null;
				selector?: {
					kind?: string | null;
					value?: string | null;
				} | null;
			}> | null;
			version?: number | null;
			updatedBy?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		}> | null;
		nextCursor?: string | null;
	};
	'nodeTypePolicies.documents.update': N8nPolicyDocumentWriteResultPublicDtoGenerated;
	'nodeTypePolicies.getInstance': N8nPolicyEffectivePublicDtoGenerated;
	'nodeTypePolicies.getProject': N8nPolicyEffectivePublicDtoGenerated;
	'nodeTypePolicies.setInstance': N8nPolicyEffectiveWriteResultPublicDtoGenerated;
	'nodeTypePolicies.setProject': N8nPolicyEffectiveWriteResultPublicDtoGenerated;
	'packages.export': FileOutput;
	'packages.import': N8nImportResultDtoGenerated;
	'packages.importSelection': N8nImportResultDtoGenerated;
	'projects.create': {
		id?: string | null;
		name?: string | null;
		type?: string | null;
		/** Icon of the project, or null when the project has none */
		icon?: {
			type?: string | null;
			value?: string | null;
			color?: string | null;
		} | null;
		description?: string | null;
		customTelemetryTags?: Array<{
			key?: string | null;
			value?: string | null;
		}> | null;
		creatorId?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
		/** The caller's role in the new project. */
		role?: string | null;
		/** Scopes the caller holds in the new project. */
		scopes?: Array<string> | null;
	};
	'projects.delete': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'projects.list': {
		data?: Array<{
			id?: string | null;
			name?: string | null;
			type?: string | null;
			/** Icon of the project, or null when the project has none */
			icon?: {
				type?: string | null;
				value?: string | null;
				color?: string | null;
			} | null;
			description?: string | null;
			customTelemetryTags?: Array<{
				key?: string | null;
				value?: string | null;
			}> | null;
			creatorId?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		}> | null;
		/** Paginate through projects by setting the cursor parameter to a nextCursor attribute returned by a previous request. Default value fetches the first "page" of the collection. */
		nextCursor?: string | null;
	};
	'projects.update': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'projects.users.add': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'projects.users.changeRole': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'projects.users.list': {
		data?: Array<{
			/** The user's unique identifier. */
			id?: string | null;
			/** The user's email address. */
			email?: string | null;
			/** The user's first name. */
			firstName?: string | null;
			/** The user's last name. */
			lastName?: string | null;
			/** When the user was created. */
			createdAt?: string | null;
			/** When the user was last updated. */
			updatedAt?: string | null;
			/** The user's role in the project (e.g. project:admin, project:viewer). */
			role?: string | null;
		}> | null;
		/** Paginate through project members by setting the cursor parameter to the nextCursor attribute returned by a previous request. Default value fetches the first page of the collection. */
		nextCursor?: string | null;
	};
	'projects.users.remove': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'promotions.environments.addProject': {
		projectId?: string | null;
		environmentId?: string | null;
	};
	'promotions.environments.apply': N8nApplyPackageResultDtoGenerated;
	'promotions.environments.connect': N8nPromotionCheckoutPublicDtoGenerated;
	'promotions.environments.continueApply': N8nApplyPackageResultDtoGenerated;
	'promotions.environments.create': N8nPromotionEnvironmentPublicDtoGenerated;
	'promotions.environments.delete': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'promotions.environments.disconnect': N8nPromotionCheckoutPublicDtoGenerated;
	'promotions.environments.get': N8nPromotionEnvironmentPublicDtoGenerated;
	'promotions.environments.getChangeDetails': N8nPromotionResourceDetailsDtoGenerated;
	'promotions.environments.list': {
		data?: Array<
			| {
					id?: string | null;
					name?: string | null;
					scope?: string | null;
					remote?: {
						schemaVersion?: number | null;
						remoteUrl?: string | null;
						/** The stored repository path of a Git host remote. URL-encode it before you use it as repositoryId to list branches. Requests do not accept it. */
						repositoryPath?: string | null;
					} | null;
					provider?: {
						id?: string | null;
						name?: string | null;
						type?: string | null;
						authType?: string | null;
						createdAt?: string | null;
						updatedAt?: string | null;
					} | null;
					createdAt?: string | null;
					updatedAt?: string | null;
					direction?: string | null;
					settings?: {
						schemaVersion?: number | null;
						branchName?: string | null;
					} | null;
			  }
			| {
					id?: string | null;
					name?: string | null;
					scope?: string | null;
					remote?: {
						schemaVersion?: number | null;
						remoteUrl?: string | null;
						/** The stored repository path of a Git host remote. URL-encode it before you use it as repositoryId to list branches. Requests do not accept it. */
						repositoryPath?: string | null;
					} | null;
					provider?: {
						id?: string | null;
						name?: string | null;
						type?: string | null;
						authType?: string | null;
						createdAt?: string | null;
						updatedAt?: string | null;
					} | null;
					createdAt?: string | null;
					updatedAt?: string | null;
					direction?: string | null;
					settings?: {
						schemaVersion?: number | null;
						baseBranchName?: string | null;
						createBranchOnPromotion?: boolean | null;
					} | null;
			  }
		> | null;
		nextCursor?: string | null;
	};
	'promotions.environments.listChanges': {
		commitSha?: string | null;
		source?: {
			environmentId?: string | null;
			branchName?: string | null;
		} | null;
		environment?: {
			name?: string | null;
			providerType?: string | null;
			/** Promote only. When true, Promote pushes to a new branch created from `source.branchName`. When false, it pushes to `source.branchName` directly. */
			createBranchOnPromotion?: boolean | null;
		} | null;
		resources?: Array<N8nPromotionResourceGenerated> | null;
		dependencies?: Array<{
			workflowKey?: string | null;
			resourceKey?: string | null;
			/** Whether selecting the workflow also sends the resource. `false` for sub-workflows, which need their own selection. */
			included?: boolean | null;
		}> | null;
		check?:
			| (N8nPromotionApplyCheckGenerated & {
					movedWorkflows?: Array<{
						id?: string | null;
						name?: string | null;
						project?: {
							id?: string | null;
							name?: string | null;
						} | null;
						projectExists?: boolean | null;
						instanceProject?: {
							id?: string | null;
							name?: string | null;
						} | null;
					}> | null;
					movedFolders?: Array<{
						id?: string | null;
						name?: string | null;
						project?: {
							id?: string | null;
							name?: string | null;
						} | null;
						projectExists?: boolean | null;
						instanceProject?: {
							id?: string | null;
							name?: string | null;
						} | null;
					}> | null;
			  })
			| null;
		/** Send it as `expectedPreviewRevision` to apply only when this instance still matches the preview. */
		revision?: string | null;
	};
	'promotions.environments.listMissingProjects': {
		environmentId?: string | null;
		git?: {
			commitSha?: string | null;
			branchName?: string | null;
		} | null;
		data?: Array<{
			id?: string | null;
			name?: string | null;
			icon?: {
				type?: string | null;
				value?: string | null;
			} | null;
			description?: string | null;
			customTelemetryTags?: Array<{
				key?: string | null;
				value?: string | null;
			}> | null;
		}> | null;
	};
	'promotions.environments.listProjects': {
		projectIds?: Array<string> | null;
	};
	'promotions.environments.promote': {
		environmentId?: string | null;
		counts?: {
			workflows?: number | null;
			folders?: number | null;
			credentials?: number | null;
			dataTables?: number | null;
			variables?: number | null;
			tags?: number | null;
		} | null;
		git?: {
			commitSha?: string | null;
			branchName?: string | null;
		} | null;
		review?: {
			reviewId?: string | null;
			number?: number | null;
			webUrl?: string | null;
		} | null;
		warnings?: Array<{
			message?: string | null;
			linkUrl?: string | null;
		}> | null;
	};
	'promotions.environments.removeProject': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'promotions.environments.update': N8nPromotionEnvironmentPublicDtoGenerated;
	'promotions.projects.apply': N8nApplyPackageResultDtoGenerated;
	'promotions.projects.continueApply': N8nApplyPackageResultDtoGenerated;
	'promotions.projects.getChangeDetails': N8nPromotionResourceDetailsDtoGenerated;
	'promotions.projects.listChanges': {
		commitSha?: string | null;
		source?: {
			environmentId?: string | null;
			branchName?: string | null;
		} | null;
		environment?: {
			name?: string | null;
			providerType?: string | null;
			/** Promote only. When true, Promote pushes to a new branch created from `source.branchName`. When false, it pushes to `source.branchName` directly. */
			createBranchOnPromotion?: boolean | null;
		} | null;
		resources?: Array<N8nPromotionResourceGenerated> | null;
		dependencies?: Array<{
			workflowKey?: string | null;
			resourceKey?: string | null;
			/** Whether selecting the workflow also sends the resource. `false` for sub-workflows, which need their own selection. */
			included?: boolean | null;
		}> | null;
		/** Set when an open review already holds the changes of this project. The preview then lists no resources. Only a Promote that opens a review on a new branch sets it. */
		blocker?: {
			code?: string | null;
			reviewId?: string | null;
		} | null;
		check?:
			| (N8nPromotionApplyCheckGenerated & {
					movedWorkflows?: Array<{
						id?: string | null;
						name?: string | null;
						project?: {
							id?: string | null;
							name?: string | null;
						} | null;
						projectExists?: boolean | null;
						instanceProject?: {
							id?: string | null;
							name?: string | null;
						} | null;
					}> | null;
					movedFolders?: Array<{
						id?: string | null;
						name?: string | null;
						project?: {
							id?: string | null;
							name?: string | null;
						} | null;
						projectExists?: boolean | null;
						instanceProject?: {
							id?: string | null;
							name?: string | null;
						} | null;
					}> | null;
			  })
			| null;
		/** A hash of what this preview shows. Send it as `expectedPreviewRevision` with Promote or Apply to run only when the preview did not change. */
		revision?: string | null;
	};
	'promotions.projects.promote':
		| {
				environmentId?: string | null;
				counts?: {
					workflows?: number | null;
					folders?: number | null;
					credentials?: number | null;
					dataTables?: number | null;
					variables?: number | null;
					tags?: number | null;
				} | null;
				git?: {
					commitSha?: string | null;
					branchName?: string | null;
				} | null;
				review?: {
					reviewId?: string | null;
					number?: number | null;
					webUrl?: string | null;
				} | null;
				warnings?: Array<{
					message?: string | null;
					linkUrl?: string | null;
				}> | null;
				status?: string | null;
		  }
		| {
				status?: string | null;
				environmentId?: string | null;
		  };
	'promotions.providers.create': {
		provider?: {
			id?: string | null;
			name?: string | null;
			type?: string | null;
			authType?: string | null;
			config?:
				| (
						| {
								schemaVersion?: number | null;
								publicKey?: string | null;
								keyType?: string | null;
						  }
						| {
								schemaVersion?: number | null;
						  }
						| {
								schemaVersion?: number | null;
								baseUrl?: string | null;
						  }
				  )
				| null;
			createdAt?: string | null;
			updatedAt?: string | null;
		} | null;
		publicKey?: string | null;
	};
	'promotions.providers.delete': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'promotions.providers.get': N8nPromotionProviderPublicDtoGenerated;
	'promotions.providers.list': {
		data?: Array<{
			id?: string | null;
			name?: string | null;
			type?: string | null;
			authType?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		}> | null;
		nextCursor?: string | null;
	};
	'promotions.providers.listBranches': {
		data?: Array<{
			name?: string | null;
			isDefault?: boolean | null;
		}> | null;
		nextCursor?: string | null;
	};
	'promotions.providers.listRepositories': {
		data?: Array<{
			id?: string | null;
			name?: string | null;
			fullPath?: string | null;
			remoteUrl?: string | null;
			defaultBranch?: string | null;
		}> | null;
		nextCursor?: string | null;
	};
	'promotions.providers.update': N8nPromotionProviderPublicDtoGenerated;
	'promotions.reviews.get': {
		id?: string | null;
		/** The Inbox tab of the review. `closed` covers the merged and the closed reviews. */
		state?: string | null;
		/** The state of the review. `open` and `changes_requested` come from the Git host. `merged` and `closed` are final. */
		reviewState?: string | null;
		reviewType?: string | null;
		title?: string | null;
		webUrl?: string | null;
		branchName?: string | null;
		environmentName?: string | null;
		requester?: {
			id?: string | null;
			firstName?: string | null;
			lastName?: string | null;
			email?: string | null;
		} | null;
		approver?: {
			id?: string | null;
			firstName?: string | null;
			lastName?: string | null;
			email?: string | null;
		} | null;
		/** Why the Git host data is missing. Then `title`, `webUrl` and `headCommitSha` are NULL, and `hasConflicts` is false without a check. NULL when the Git host answered. */
		remoteError?: string | null;
		/** The head of the merge request on the Git host. It differs from `runCommitSha` after a push on the Git host. */
		headCommitSha?: string | null;
		/** The commit that n8n pushed in the newest promotion. */
		runCommitSha?: string | null;
		hasConflicts?: boolean | null;
		createdAt?: string | null;
		updatedAt?: string | null;
	};
	'promotions.reviews.list': {
		data?: Array<{
			id?: string | null;
			/** The Inbox tab of the review. `closed` covers the merged and the closed reviews. */
			state?: string | null;
			/** The state of the review. `open` and `changes_requested` come from the Git host. `merged` and `closed` are final. */
			reviewState?: string | null;
			reviewType?: string | null;
			title?: string | null;
			webUrl?: string | null;
			branchName?: string | null;
			environmentName?: string | null;
			requester?: {
				id?: string | null;
				firstName?: string | null;
				lastName?: string | null;
				email?: string | null;
			} | null;
			approver?: {
				id?: string | null;
				firstName?: string | null;
				lastName?: string | null;
				email?: string | null;
			} | null;
			/** Why the Git host data is missing. Then `title`, `webUrl` and `headCommitSha` are NULL, and `hasConflicts` is false without a check. NULL when the Git host answered. */
			remoteError?: string | null;
			/** The head of the merge request on the Git host. It differs from `runCommitSha` after a push on the Git host. */
			headCommitSha?: string | null;
			/** The commit that n8n pushed in the newest promotion. */
			runCommitSha?: string | null;
			hasConflicts?: boolean | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		}> | null;
		nextCursor?: string | null;
	};
	'promotions.settings.get': N8nPromotionSettingsPublicDtoGenerated;
	'promotions.settings.update': N8nPromotionSettingsPublicDtoGenerated;
	'roleMappingRules.create': N8nRoleMappingRulePublicDtoGenerated;
	'roleMappingRules.delete': N8nRoleMappingRulePublicDtoGenerated;
	'roleMappingRules.list': {
		data?: Array<{
			id?: string | null;
			expression?: string | null;
			role?: string | null;
			type?: string | null;
			order?: number | null;
			projectIds?: Array<string> | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		}> | null;
		nextCursor?: string | null;
	};
	'roleMappingRules.move': N8nRoleMappingRulePublicDtoGenerated;
	'roleMappingRules.update': N8nRoleMappingRulePublicDtoGenerated;
	'roles.create': N8nRolePublicDtoGenerated;
	'roles.delete': N8nRolePublicDtoGenerated;
	'roles.get': {
		slug?: string | null;
		displayName?: string | null;
		description?: string | null;
		systemRole?: boolean | null;
		roleType?: string | null;
		scopes?: Array<string> | null;
		createdAt?: string | null;
		updatedAt?: string | null;
		licensed?: boolean | null;
		usedByUsers?: number | null;
		usedByProjects?: number | null;
	};
	'roles.list': {
		global?: Array<{
			slug?: string | null;
			displayName?: string | null;
			description?: string | null;
			systemRole?: boolean | null;
			roleType?: string | null;
			scopes?: Array<string> | null;
			createdAt?: string | null;
			updatedAt?: string | null;
			licensed?: boolean | null;
			usedByUsers?: number | null;
			usedByProjects?: number | null;
		}> | null;
		project?: Array<{
			slug?: string | null;
			displayName?: string | null;
			description?: string | null;
			systemRole?: boolean | null;
			roleType?: string | null;
			scopes?: Array<string> | null;
			createdAt?: string | null;
			updatedAt?: string | null;
			licensed?: boolean | null;
			usedByUsers?: number | null;
			usedByProjects?: number | null;
		}> | null;
	};
	'roles.update': N8nRolePublicDtoGenerated;
	'settings.ldap.get': N8nLdapConfigurationPublicDtoGenerated;
	'settings.ldap.listSyncs': {
		data?: Array<{
			/** Unique identifier for this sync run. */
			id?: number | null;
			/** Whether the sync was a dry run or applied live. */
			runMode?: string | null;
			/** Status of the synchronization (for example, success or error). */
			status?: string | null;
			/** Timestamp when the synchronization started. */
			startedAt?: string | null;
			/** Timestamp when the synchronization completed. */
			endedAt?: string | null;
			/** Number of LDAP entries scanned during synchronization. */
			scanned?: number | null;
			/** Number of new users created during synchronization. */
			created?: number | null;
			/** Number of existing users updated during synchronization. */
			updated?: number | null;
			/** Number of users disabled during synchronization. */
			disabled?: number | null;
			/** Error message if the synchronization failed. Empty string if successful. */
			error?: string | null;
		}> | null;
		/** Paginate through the synchronization history by setting the cursor parameter to the nextCursor attribute returned by the previous request. A null value means there are no more records. */
		nextCursor?: string | null;
	};
	'settings.ldap.runSync': {
		/** Unique identifier for this sync run. */
		id?: number | null;
		/** Whether the sync was a dry run or applied live. */
		runMode?: string | null;
		/** Status of the synchronization (for example, success or error). */
		status?: string | null;
		/** Timestamp when the synchronization started. */
		startedAt?: string | null;
		/** Timestamp when the synchronization completed. */
		endedAt?: string | null;
		/** Number of LDAP entries scanned during synchronization. */
		scanned?: number | null;
		/** Number of new users created during synchronization. */
		created?: number | null;
		/** Number of existing users updated during synchronization. */
		updated?: number | null;
		/** Number of users disabled during synchronization. */
		disabled?: number | null;
		/** Error message if the synchronization failed. Empty string if successful. */
		error?: string | null;
	};
	'settings.ldap.update': N8nLdapConfigurationPublicDtoGenerated;
	'settings.logStreaming.createDestination': N8nLogStreamingDestinationPublicDtoGenerated;
	'settings.logStreaming.deleteDestination': N8nLogStreamingDestinationPublicDtoGenerated;
	'settings.logStreaming.getDestination': N8nLogStreamingDestinationPublicDtoGenerated;
	'settings.logStreaming.listDestinations': {
		/** The configured log streaming destinations. */
		data?: Array<
			| {
					/** Human-readable name shown in the UI. */
					label?: string | null;
					/** Whether the destination currently receives events. */
					enabled?: boolean | null;
					/** Event names (or group prefixes, e.g. `n8n.workflow`, which matches all `n8n.workflow.*` events) this destination receives. Retrieve the full list of streamable event names from `GET /settings/log-streaming/event-types`. */
					subscribedEvents?: Array<string> | null;
					/** Whether audit message payloads are anonymized before being sent. */
					anonymizeAuditMessages?: boolean | null;
					/** Circuit-breaker tuning for delivery. After repeated failures the destination stops sending for a cool-down window instead of hammering an unhealthy target. All fields are optional; sensible defaults apply when omitted. */
					circuitBreaker?: {
						/** Maximum failures within the sliding window before the breaker opens. */
						maxFailures?: number | null;
						/** Sliding window, in milliseconds, over which failures are counted. */
						failureWindow?: number | null;
					} | null;
					/** Sends each event as an HTTP request to a URL. */
					type?: string | null;
					/** Target URL that receives the event payload. */
					url?: string | null;
					/** HTTP method used for the request. */
					method?: string | null;
					/** Whether to attach custom headers to the request. */
					sendHeaders?: boolean | null;
					/** How custom headers are provided — `keypair` or `json`. */
					specifyHeaders?: string | null;
					/** Key-value pairs used when the matching `specify*` field is `keypair`. */
					headerParameters?: {
						parameters?: Array<{
							name?: string | null;
							/** Parameter value. Usually a string; numbers, booleans and null are also accepted. */
							value?: (string | number | boolean | N8nJsonValue) | null;
						}> | null;
					} | null;
					/** Custom headers as a JSON string when `specifyHeaders` is `json`. */
					jsonHeaders?: string | null;
					/** Whether to attach query parameters to the request. */
					sendQuery?: boolean | null;
					/** How query parameters are provided — `keypair` or `json`. */
					specifyQuery?: string | null;
					/** Key-value pairs used when the matching `specify*` field is `keypair`. */
					queryParameters?: {
						parameters?: Array<{
							name?: string | null;
							/** Parameter value. Usually a string; numbers, booleans and null are also accepted. */
							value?: (string | number | boolean | N8nJsonValue) | null;
						}> | null;
					} | null;
					/** Query parameters as a JSON string when `specifyQuery` is `json`. */
					jsonQuery?: string | null;
					/** Additional HTTP request options. */
					options?: {
						/** Request timeout in milliseconds. */
						timeout?: number | null;
						/** Accept self-signed or otherwise invalid TLS certificates. */
						allowUnauthorizedCerts?: boolean | null;
						/** How array-valued query parameters are serialized into the query string. */
						queryParameterArrays?: string | null;
						/** Redirect-following behaviour. */
						redirect?: {
							redirect?: {
								/** Whether to follow HTTP redirects. */
								followRedirects?: boolean | null;
								/** Maximum number of redirects to follow. */
								maxRedirects?: number | null;
							} | null;
						} | null;
						/** Outbound proxy configuration. */
						proxy?: {
							proxy?: {
								/** Proxy protocol. */
								protocol?: string | null;
								/** Proxy host, without protocol or port. */
								host?: string | null;
								/** Proxy port. */
								port?: number | null;
							} | null;
						} | null;
						/** Connection socket options. */
						socket?: {
							/** Whether to keep sockets open for reuse. */
							keepAlive?: boolean | null;
							/** Maximum sockets per host kept open at once. */
							maxSockets?: number | null;
							/** Maximum idle sockets per host kept open. */
							maxFreeSockets?: number | null;
						} | null;
					} | null;
					/** Server-generated unique id of the destination. Returned in responses; not accepted in requests. */
					id?: string | null;
			  }
			| {
					/** Human-readable name shown in the UI. */
					label?: string | null;
					/** Whether the destination currently receives events. */
					enabled?: boolean | null;
					/** Event names (or group prefixes, e.g. `n8n.workflow`, which matches all `n8n.workflow.*` events) this destination receives. Retrieve the full list of streamable event names from `GET /settings/log-streaming/event-types`. */
					subscribedEvents?: Array<string> | null;
					/** Whether audit message payloads are anonymized before being sent. */
					anonymizeAuditMessages?: boolean | null;
					/** Circuit-breaker tuning for delivery. After repeated failures the destination stops sending for a cool-down window instead of hammering an unhealthy target. All fields are optional; sensible defaults apply when omitted. */
					circuitBreaker?: {
						/** Maximum failures within the sliding window before the breaker opens. */
						maxFailures?: number | null;
						/** Sliding window, in milliseconds, over which failures are counted. */
						failureWindow?: number | null;
					} | null;
					/** Sends each event to a syslog server. */
					type?: string | null;
					/** Syslog server host. */
					host?: string | null;
					/** Syslog server port. */
					port?: number | null;
					/** Transport protocol. */
					protocol?: string | null;
					/** Syslog facility code (0–23, per RFC 5424). Common values: 0 Kernel, 1 User, 3 System, 13 Audit, 14 Alert, 16 Local0, 17 Local1, 18 Local2, 19 Local3, 20 Local4, 21 Local5, 22 Local6, 23 Local7. */
					facility?: number | null;
					/** Application name reported in the syslog message. */
					app_name?: string | null;
					/** PEM-encoded CA certificate used when `protocol` is `tls`. */
					tlsCa?: string | null;
					/** Server-generated unique id of the destination. Returned in responses; not accepted in requests. */
					id?: string | null;
			  }
			| {
					/** Human-readable name shown in the UI. */
					label?: string | null;
					/** Whether the destination currently receives events. */
					enabled?: boolean | null;
					/** Event names (or group prefixes, e.g. `n8n.workflow`, which matches all `n8n.workflow.*` events) this destination receives. Retrieve the full list of streamable event names from `GET /settings/log-streaming/event-types`. */
					subscribedEvents?: Array<string> | null;
					/** Whether audit message payloads are anonymized before being sent. */
					anonymizeAuditMessages?: boolean | null;
					/** Circuit-breaker tuning for delivery. After repeated failures the destination stops sending for a cool-down window instead of hammering an unhealthy target. All fields are optional; sensible defaults apply when omitted. */
					circuitBreaker?: {
						/** Maximum failures within the sliding window before the breaker opens. */
						maxFailures?: number | null;
						/** Sliding window, in milliseconds, over which failures are counted. */
						failureWindow?: number | null;
					} | null;
					/** Sends each event to a Sentry project. */
					type?: string | null;
					/** Sentry DSN the events are sent to. */
					dsn?: string | null;
					/** Server-generated unique id of the destination. Returned in responses; not accepted in requests. */
					id?: string | null;
			  }
		> | null;
	};
	'settings.logStreaming.listEventTypes': {
		/** Event names that can be streamed to a destination. */
		data?: Array<string> | null;
	};
	'settings.logStreaming.testDestination': {
		/** Whether the test message was delivered to the destination successfully. */
		success?: boolean | null;
	};
	'settings.logStreaming.updateDestination': N8nLogStreamingDestinationPublicDtoGenerated;
	'settings.oidc.get': N8nOidcConfigurationPublicDtoGenerated;
	'settings.oidc.update': N8nOidcConfigurationPublicDtoGenerated;
	'settings.otel.get': N8nOtelSettingsPublicDtoGenerated;
	'settings.otel.testTrace': {
		/** Whether the test span was accepted by the collector. */
		success?: boolean | null;
		/** The error reported by the collector or exporter. Present only when `success` is false. */
		error?: string | null;
	};
	'settings.otel.update': N8nOtelSettingsPublicDtoGenerated;
	'settings.rateLimits.get': N8nRateLimitSettingsPublicDtoGenerated;
	'settings.rateLimits.update': N8nRateLimitSettingsPublicDtoGenerated;
	'settings.saml.get': N8nSamlConfigurationPublicDtoGenerated;
	'settings.saml.update': N8nSamlConfigurationPublicDtoGenerated;
	'settings.securityPolicy.get': N8nSecurityPolicyPublicDtoGenerated;
	'settings.securityPolicy.update': N8nSecurityPolicyPublicDtoGenerated;
	'sourceControl.getStatus': {
		data?: Array<{
			file?: string | null;
			id?: string | null;
			name?: string | null;
			type?: string | null;
			status?: string | null;
			location?: string | null;
			conflict?: boolean | null;
			updatedAt?: string | null;
			pushed?: boolean | null;
			isLocalPublished?: boolean | null;
			isRemoteArchived?: boolean | null;
			parentFolderId?: string | null;
			folderPath?: Array<string> | null;
			remoteFolderPath?: Array<string> | null;
			owner?: {
				type?: string | null;
				projectId?: string | null;
				projectName?: string | null;
			} | null;
			publishingError?: string | null;
			publishingErrorDetails?: {
				reason?: string | null;
				workflowReviewRequestId?: string | null;
				versionId?: string | null;
			} | null;
			contentImportPolicy?: {
				violations?: Array<{
					kind?: string | null;
					checkId?: string | null;
					message?: string | null;
					subject?: string | null;
					subjectType?: string | null;
					scope?: string | null;
					matchedRuleId?: string | null;
					projectId?: string | null;
					optInAvailable?: boolean | null;
					limit?: number | null;
					usage?: number | null;
					resetsAt?: string | null;
				}> | null;
				checkErrors?: Array<{
					checkId?: string | null;
					correlationId?: string | null;
				}> | null;
			} | null;
		}> | null;
	};
	'sourceControl.pull': Array<{
		file?: string | null;
		id?: string | null;
		name?: string | null;
		type?: string | null;
		status?: string | null;
		location?: string | null;
		conflict?: boolean | null;
		updatedAt?: string | null;
		pushed?: boolean | null;
		isLocalPublished?: boolean | null;
		isRemoteArchived?: boolean | null;
		parentFolderId?: string | null;
		folderPath?: Array<string> | null;
		remoteFolderPath?: Array<string> | null;
		owner?: {
			type?: string | null;
			projectId?: string | null;
			projectName?: string | null;
		} | null;
		publishingError?: string | null;
		publishingErrorDetails?: {
			reason?: string | null;
			workflowReviewRequestId?: string | null;
			versionId?: string | null;
		} | null;
		contentImportPolicy?: {
			violations?: Array<{
				kind?: string | null;
				checkId?: string | null;
				message?: string | null;
				subject?: string | null;
				subjectType?: string | null;
				scope?: string | null;
				matchedRuleId?: string | null;
				projectId?: string | null;
				optInAvailable?: boolean | null;
				limit?: number | null;
				usage?: number | null;
				resetsAt?: string | null;
			}> | null;
			checkErrors?: Array<{
				checkId?: string | null;
				correlationId?: string | null;
			}> | null;
		} | null;
	}>;
	'sourceControl.push': {
		data?: Array<{
			file?: string | null;
			id?: string | null;
			name?: string | null;
			type?: string | null;
			status?: string | null;
			location?: string | null;
			conflict?: boolean | null;
			updatedAt?: string | null;
			pushed?: boolean | null;
			isLocalPublished?: boolean | null;
			isRemoteArchived?: boolean | null;
			parentFolderId?: string | null;
			folderPath?: Array<string> | null;
			remoteFolderPath?: Array<string> | null;
			owner?: {
				type?: string | null;
				projectId?: string | null;
				projectName?: string | null;
			} | null;
			publishingError?: string | null;
			publishingErrorDetails?: {
				reason?: string | null;
				workflowReviewRequestId?: string | null;
				versionId?: string | null;
			} | null;
			contentImportPolicy?: {
				violations?: Array<{
					kind?: string | null;
					checkId?: string | null;
					message?: string | null;
					subject?: string | null;
					subjectType?: string | null;
					scope?: string | null;
					matchedRuleId?: string | null;
					projectId?: string | null;
					optInAvailable?: boolean | null;
					limit?: number | null;
					usage?: number | null;
					resetsAt?: string | null;
				}> | null;
				checkErrors?: Array<{
					checkId?: string | null;
					correlationId?: string | null;
				}> | null;
			} | null;
		}> | null;
	};
	'tags.create': N8nTagPublicDtoGenerated;
	'tags.delete': N8nTagPublicDtoGenerated;
	'tags.get': N8nTagPublicDtoGenerated;
	'tags.list': {
		data?: Array<{
			id?: string | null;
			name?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		}> | null;
		nextCursor?: string | null;
	};
	'tags.update': {
		id?: string | null;
		name?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
	};
	'users.changeRole': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'users.delete': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'users.get': {
		id?: string | null;
		email?: string | null;
		firstName?: string | null;
		lastName?: string | null;
		/** Whether the user finished setting up their account in response to the invitation (true) or not (false). */
		isPending?: boolean | null;
		createdAt?: string | null;
		updatedAt?: string | null;
		/** Whether the user has multi-factor authentication (MFA/2FA) enabled. */
		mfaEnabled?: boolean | null;
		role?: string | null;
	};
	'users.invite': Array<{
		user?: {
			id?: string | null;
			email?: string | null;
			/** Link the invited user can open to finish setting up the account. Present only when the instance does not send invite emails. */
			inviteAcceptUrl?: string | null;
			/** Whether the invite email was sent to the user. */
			emailSent?: boolean | null;
			role?: string | null;
		} | null;
		/** The reason the invite failed for this user. Empty when the invite succeeded. */
		error?: string | null;
	}>;
	'users.list': {
		data?: Array<{
			id?: string | null;
			email?: string | null;
			firstName?: string | null;
			lastName?: string | null;
			/** Whether the user finished setting up their account in response to the invitation (true) or not (false). */
			isPending?: boolean | null;
			createdAt?: string | null;
			updatedAt?: string | null;
			/** Whether the user has multi-factor authentication (MFA/2FA) enabled. */
			mfaEnabled?: boolean | null;
			role?: string | null;
		}> | null;
		/** Paginate through users by setting the cursor parameter to a nextCursor attribute returned by a previous request. Default value fetches the first page of the collection. */
		nextCursor?: string | null;
	};
	'variables.create': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'variables.delete': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'variables.list': {
		data?: Array<{
			id?: string | null;
			key?: string | null;
			value?: string | null;
			type?: string | null;
			project?: {
				id?: string | null;
				name?: string | null;
				type?: string | null;
				/** Icon of the project, or null when the project has none */
				icon?: {
					type?: string | null;
					value?: string | null;
					color?: string | null;
				} | null;
				description?: string | null;
				customTelemetryTags?: Array<{
					key?: string | null;
					value?: string | null;
				}> | null;
				creatorId?: string | null;
				createdAt?: string | null;
				updatedAt?: string | null;
			} | null;
		}> | null;
		nextCursor?: string | null;
	};
	'variables.update': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'workflows.activate': N8nWorkflowPublishPublicDtoGenerated;
	'workflows.archive': N8nWorkflowPublicDtoGenerated;
	'workflows.create': {
		id?: string | null;
		name?: string | null;
		description?: string | null;
		/** Deprecated. Check whether `activeVersionId` is not null instead. */
		active?: boolean | null;
		activeVersionId?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
		isArchived?: boolean | null;
		versionId?: string | null;
		versionCounter?: number | null;
		sourceWorkflowId?: string | null;
		triggerCount?: number | null;
		/** Nodes that make up the workflow */
		nodes?: Array<{
			id?: string | null;
			name?: string | null;
			webhookId?: string | null;
			disabled?: boolean | null;
			notesInFlow?: boolean | null;
			notes?: string | null;
			type?: string | null;
			typeVersion?: number | null;
			executeOnce?: boolean | null;
			alwaysOutputData?: boolean | null;
			retryOnFail?: boolean | null;
			maxTries?: number | null;
			waitBetweenTries?: number | null;
			/** use onError instead */
			continueOnFail?: boolean | null;
			onError?: string | null;
			position?: Array<number> | null;
			parameters?: Record<string, N8nJsonValue> | null;
			credentials?: Record<string, N8nJsonValue> | null;
			customTelemetryTags?: {
				tag?: Array<{
					key?: string | null;
					value?: string | null;
				}> | null;
			} | null;
		}> | null;
		/** Connections between nodes, keyed by source node name */
		connections?: Record<string, N8nJsonValue> | null;
		/** Visual groupings of nodes shown as frames on the canvas */
		nodeGroups?: Array<{
			/** Unique identifier for the node group */
			id?: string | null;
			/** Display name of the node group */
			name?: string | null;
			/** Optional plain-text description of the node group */
			description?: string | null;
			/** IDs of the nodes that belong to this group */
			nodeIds?: Array<string> | null;
		}> | null;
		/** Execution and behaviour settings for the workflow */
		settings?: {
			saveExecutionProgress?: (boolean | string) | null;
			saveManualExecutions?: (boolean | string) | null;
			saveDataErrorExecution?: string | null;
			saveDataSuccessExecution?: string | null;
			executionTimeout?: number | null;
			/** The ID of the workflow that contains the error trigger node. */
			errorWorkflow?: string | null;
			timezone?: string | null;
			executionOrder?: string | null;
			/** Controls how binary data is resolved from a node's input. This is a derived, internal setting rather than something intended to be set programmatically. It is included in workflow responses for reference, but any value sent when creating or updating a workflow is ignored. */
			binaryMode?: string | null;
			/** The execution engine that runs this workflow. n8n sets it on new workflows when the instance runs new workflows on engine v2 (`N8N_ENGINE_DEFAULT_TYPE=v2` with the `engine-v2` module enabled). It is included in workflow responses for reference, but any value sent when creating or updating a… */
			engineType?: string | null;
			/** Controls which workflows are allowed to call this workflow using the Execute Workflow node. Defaults to workflowsFromSameOwner. Available options: - `any`: Any workflow can call this workflow (no restrictions) - `none`: No other workflows can call this workflow (completely blocked) -… */
			callerPolicy?: string | null;
			/** Comma-separated list of workflow IDs allowed to call this workflow (only used with the workflowsFromAList policy) */
			callerIds?: string | null;
			/** Controls how the time saved per execution is calculated. Available options: - `fixed`: Uses the value in `timeSavedPerExecution`. Use when the time saved is the same for every execution. - `dynamic`: Calculates the time saved from actual execution metrics. `timeSavedPerExecution` is ignored. */
			timeSavedMode?: string | null;
			/** Estimated time saved per execution in minutes */
			timeSavedPerExecution?: number | null;
			/** Controls whether execution data is redacted for this workflow. Available options: - `none` (default): No redaction. All execution data is stored. - `non-manual`: Redact production (non-manually triggered) executions only. - `manual-only`: Redact manually triggered executions only. - `all`:… */
			redactionPolicy?: string | null;
			/** Controls whether a workflow that calls this workflow as a sub-workflow has its executions redacted on the same channels as this workflow. The calling execution keeps a copy of the output of this workflow. Defaults to true. Turn it off only when the output of this workflow is not sensitive.… */
			redactCallerExecutions?: boolean | null;
			/** Controls whether this workflow is reachable over the Model Context Protocol (MCP). Defaults to false. The workflow must be active and must hold at least one active Webhook node. */
			availableInMCP?: boolean | null;
			customTelemetryTags?: Array<{
				key?: string | null;
				value?: string | null;
			}> | null;
			/** ID of the credential resolver that resolves credentials for this workflow. This is a derived, internal setting managed through the credential resolver configuration rather than something intended to be set programmatically. It is included in workflow responses for reference, but any value sent… */
			credentialResolverId?: string | null;
		} | null;
		/** Data the workflow keeps between executions */
		staticData?: Record<string, N8nJsonValue> | null;
		/** Pinned sample data for nodes, keyed by node name */
		pinData?: Record<string, N8nJsonValue> | null;
		/** Workflow metadata such as template information */
		meta?: {
			onboardingId?: string | null;
			templateId?: string | null;
			instanceId?: string | null;
			templateCredsSetupCompleted?: boolean | null;
		} | null;
		tags?: Array<{
			id?: string | null;
			name?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		}> | null;
		shared?: Array<{
			role?: string | null;
			workflowId?: string | null;
			projectId?: string | null;
			project?: {
				id?: string | null;
				name?: string | null;
				type?: string | null;
				/** Icon of the project, or null when the project has none */
				icon?: {
					type?: string | null;
					value?: string | null;
					color?: string | null;
				} | null;
				description?: string | null;
				customTelemetryTags?: Array<{
					key?: string | null;
					value?: string | null;
				}> | null;
				creatorId?: string | null;
				createdAt?: string | null;
				updatedAt?: string | null;
			} | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		}> | null;
		activeVersion?: {
			versionId?: string | null;
			workflowId?: string | null;
			/** Nodes that make up the workflow */
			nodes?: Array<{
				id?: string | null;
				name?: string | null;
				webhookId?: string | null;
				disabled?: boolean | null;
				notesInFlow?: boolean | null;
				notes?: string | null;
				type?: string | null;
				typeVersion?: number | null;
				executeOnce?: boolean | null;
				alwaysOutputData?: boolean | null;
				retryOnFail?: boolean | null;
				maxTries?: number | null;
				waitBetweenTries?: number | null;
				/** use onError instead */
				continueOnFail?: boolean | null;
				onError?: string | null;
				position?: Array<number> | null;
				parameters?: Record<string, N8nJsonValue> | null;
				credentials?: Record<string, N8nJsonValue> | null;
				customTelemetryTags?: {
					tag?: Array<{
						key?: string | null;
						value?: string | null;
					}> | null;
				} | null;
			}> | null;
			/** Connections between nodes, keyed by source node name */
			connections?: Record<string, N8nJsonValue> | null;
			/** Visual groupings of nodes shown as frames on the canvas */
			nodeGroups?: Array<{
				/** Unique identifier for the node group */
				id?: string | null;
				/** Display name of the node group */
				name?: string | null;
				/** Optional plain-text description of the node group */
				description?: string | null;
				/** IDs of the nodes that belong to this group */
				nodeIds?: Array<string> | null;
			}> | null;
			authors?: string | null;
			name?: string | null;
			description?: string | null;
			autosaved?: boolean | null;
			createdAt?: string | null;
			updatedAt?: string | null;
			workflowPublishHistory?: Array<{
				id?: number | null;
				workflowId?: string | null;
				versionId?: string | null;
				event?: string | null;
				userId?: string | null;
				createdAt?: string | null;
			}> | null;
		} | null;
		/** Folder the workflow was placed in, or null at the project root */
		parentFolder?: {
			id?: string | null;
			name?: string | null;
			parentFolderId?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		} | null;
	};
	'workflows.deactivate': N8nWorkflowPublicDtoGenerated;
	'workflows.delete': {
		id?: string | null;
		name?: string | null;
		description?: string | null;
		/** Deprecated. Check whether `activeVersionId` is not null instead. */
		active?: boolean | null;
		activeVersionId?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
		isArchived?: boolean | null;
		versionId?: string | null;
		versionCounter?: number | null;
		sourceWorkflowId?: string | null;
		triggerCount?: number | null;
		/** Nodes that make up the workflow */
		nodes?: Array<{
			id?: string | null;
			name?: string | null;
			webhookId?: string | null;
			disabled?: boolean | null;
			notesInFlow?: boolean | null;
			notes?: string | null;
			type?: string | null;
			typeVersion?: number | null;
			executeOnce?: boolean | null;
			alwaysOutputData?: boolean | null;
			retryOnFail?: boolean | null;
			maxTries?: number | null;
			waitBetweenTries?: number | null;
			/** use onError instead */
			continueOnFail?: boolean | null;
			onError?: string | null;
			position?: Array<number> | null;
			parameters?: Record<string, N8nJsonValue> | null;
			credentials?: Record<string, N8nJsonValue> | null;
			customTelemetryTags?: {
				tag?: Array<{
					key?: string | null;
					value?: string | null;
				}> | null;
			} | null;
		}> | null;
		/** Connections between nodes, keyed by source node name */
		connections?: Record<string, N8nJsonValue> | null;
		/** Visual groupings of nodes shown as frames on the canvas */
		nodeGroups?: Array<{
			/** Unique identifier for the node group */
			id?: string | null;
			/** Display name of the node group */
			name?: string | null;
			/** Optional plain-text description of the node group */
			description?: string | null;
			/** IDs of the nodes that belong to this group */
			nodeIds?: Array<string> | null;
		}> | null;
		/** Execution and behaviour settings for the workflow */
		settings?: {
			saveExecutionProgress?: (boolean | string) | null;
			saveManualExecutions?: (boolean | string) | null;
			saveDataErrorExecution?: string | null;
			saveDataSuccessExecution?: string | null;
			executionTimeout?: number | null;
			/** The ID of the workflow that contains the error trigger node. */
			errorWorkflow?: string | null;
			timezone?: string | null;
			executionOrder?: string | null;
			/** Controls how binary data is resolved from a node's input. This is a derived, internal setting rather than something intended to be set programmatically. It is included in workflow responses for reference, but any value sent when creating or updating a workflow is ignored. */
			binaryMode?: string | null;
			/** The execution engine that runs this workflow. n8n sets it on new workflows when the instance runs new workflows on engine v2 (`N8N_ENGINE_DEFAULT_TYPE=v2` with the `engine-v2` module enabled). It is included in workflow responses for reference, but any value sent when creating or updating a… */
			engineType?: string | null;
			/** Controls which workflows are allowed to call this workflow using the Execute Workflow node. Defaults to workflowsFromSameOwner. Available options: - `any`: Any workflow can call this workflow (no restrictions) - `none`: No other workflows can call this workflow (completely blocked) -… */
			callerPolicy?: string | null;
			/** Comma-separated list of workflow IDs allowed to call this workflow (only used with the workflowsFromAList policy) */
			callerIds?: string | null;
			/** Controls how the time saved per execution is calculated. Available options: - `fixed`: Uses the value in `timeSavedPerExecution`. Use when the time saved is the same for every execution. - `dynamic`: Calculates the time saved from actual execution metrics. `timeSavedPerExecution` is ignored. */
			timeSavedMode?: string | null;
			/** Estimated time saved per execution in minutes */
			timeSavedPerExecution?: number | null;
			/** Controls whether execution data is redacted for this workflow. Available options: - `none` (default): No redaction. All execution data is stored. - `non-manual`: Redact production (non-manually triggered) executions only. - `manual-only`: Redact manually triggered executions only. - `all`:… */
			redactionPolicy?: string | null;
			/** Controls whether a workflow that calls this workflow as a sub-workflow has its executions redacted on the same channels as this workflow. The calling execution keeps a copy of the output of this workflow. Defaults to true. Turn it off only when the output of this workflow is not sensitive.… */
			redactCallerExecutions?: boolean | null;
			/** Controls whether this workflow is reachable over the Model Context Protocol (MCP). Defaults to false. The workflow must be active and must hold at least one active Webhook node. */
			availableInMCP?: boolean | null;
			customTelemetryTags?: Array<{
				key?: string | null;
				value?: string | null;
			}> | null;
			/** ID of the credential resolver that resolves credentials for this workflow. This is a derived, internal setting managed through the credential resolver configuration rather than something intended to be set programmatically. It is included in workflow responses for reference, but any value sent… */
			credentialResolverId?: string | null;
		} | null;
		/** Data the workflow keeps between executions */
		staticData?: Record<string, N8nJsonValue> | null;
		/** Pinned sample data for nodes, keyed by node name */
		pinData?: Record<string, N8nJsonValue> | null;
		/** Workflow metadata such as template information */
		meta?: {
			onboardingId?: string | null;
			templateId?: string | null;
			instanceId?: string | null;
			templateCredsSetupCompleted?: boolean | null;
		} | null;
		tags?: Array<{
			id?: string | null;
			name?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		}> | null;
		shared?: Array<{
			role?: string | null;
			workflowId?: string | null;
			projectId?: string | null;
			project?: {
				id?: string | null;
				name?: string | null;
				type?: string | null;
				/** Icon of the project, or null when the project has none */
				icon?: {
					type?: string | null;
					value?: string | null;
					color?: string | null;
				} | null;
				description?: string | null;
				customTelemetryTags?: Array<{
					key?: string | null;
					value?: string | null;
				}> | null;
				creatorId?: string | null;
				createdAt?: string | null;
				updatedAt?: string | null;
			} | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		}> | null;
		activeVersion?: {
			versionId?: string | null;
			workflowId?: string | null;
			/** Nodes that make up the workflow */
			nodes?: Array<{
				id?: string | null;
				name?: string | null;
				webhookId?: string | null;
				disabled?: boolean | null;
				notesInFlow?: boolean | null;
				notes?: string | null;
				type?: string | null;
				typeVersion?: number | null;
				executeOnce?: boolean | null;
				alwaysOutputData?: boolean | null;
				retryOnFail?: boolean | null;
				maxTries?: number | null;
				waitBetweenTries?: number | null;
				/** use onError instead */
				continueOnFail?: boolean | null;
				onError?: string | null;
				position?: Array<number> | null;
				parameters?: Record<string, N8nJsonValue> | null;
				credentials?: Record<string, N8nJsonValue> | null;
				customTelemetryTags?: {
					tag?: Array<{
						key?: string | null;
						value?: string | null;
					}> | null;
				} | null;
			}> | null;
			/** Connections between nodes, keyed by source node name */
			connections?: Record<string, N8nJsonValue> | null;
			/** Visual groupings of nodes shown as frames on the canvas */
			nodeGroups?: Array<{
				/** Unique identifier for the node group */
				id?: string | null;
				/** Display name of the node group */
				name?: string | null;
				/** Optional plain-text description of the node group */
				description?: string | null;
				/** IDs of the nodes that belong to this group */
				nodeIds?: Array<string> | null;
			}> | null;
			authors?: string | null;
			name?: string | null;
			description?: string | null;
			autosaved?: boolean | null;
			createdAt?: string | null;
			updatedAt?: string | null;
			workflowPublishHistory?: Array<{
				id?: number | null;
				workflowId?: string | null;
				versionId?: string | null;
				event?: string | null;
				userId?: string | null;
				createdAt?: string | null;
			}> | null;
		} | null;
	};
	'workflows.get': {
		id?: string | null;
		name?: string | null;
		description?: string | null;
		/** Deprecated. Check whether `activeVersionId` is not null instead. */
		active?: boolean | null;
		activeVersionId?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
		isArchived?: boolean | null;
		versionId?: string | null;
		versionCounter?: number | null;
		sourceWorkflowId?: string | null;
		triggerCount?: number | null;
		/** Nodes that make up the workflow */
		nodes?: Array<{
			id?: string | null;
			name?: string | null;
			webhookId?: string | null;
			disabled?: boolean | null;
			notesInFlow?: boolean | null;
			notes?: string | null;
			type?: string | null;
			typeVersion?: number | null;
			executeOnce?: boolean | null;
			alwaysOutputData?: boolean | null;
			retryOnFail?: boolean | null;
			maxTries?: number | null;
			waitBetweenTries?: number | null;
			/** use onError instead */
			continueOnFail?: boolean | null;
			onError?: string | null;
			position?: Array<number> | null;
			parameters?: Record<string, N8nJsonValue> | null;
			credentials?: Record<string, N8nJsonValue> | null;
			customTelemetryTags?: {
				tag?: Array<{
					key?: string | null;
					value?: string | null;
				}> | null;
			} | null;
		}> | null;
		/** Connections between nodes, keyed by source node name */
		connections?: Record<string, N8nJsonValue> | null;
		/** Visual groupings of nodes shown as frames on the canvas */
		nodeGroups?: Array<{
			/** Unique identifier for the node group */
			id?: string | null;
			/** Display name of the node group */
			name?: string | null;
			/** Optional plain-text description of the node group */
			description?: string | null;
			/** IDs of the nodes that belong to this group */
			nodeIds?: Array<string> | null;
		}> | null;
		/** Execution and behaviour settings for the workflow */
		settings?: {
			saveExecutionProgress?: (boolean | string) | null;
			saveManualExecutions?: (boolean | string) | null;
			saveDataErrorExecution?: string | null;
			saveDataSuccessExecution?: string | null;
			executionTimeout?: number | null;
			/** The ID of the workflow that contains the error trigger node. */
			errorWorkflow?: string | null;
			timezone?: string | null;
			executionOrder?: string | null;
			/** Controls how binary data is resolved from a node's input. This is a derived, internal setting rather than something intended to be set programmatically. It is included in workflow responses for reference, but any value sent when creating or updating a workflow is ignored. */
			binaryMode?: string | null;
			/** The execution engine that runs this workflow. n8n sets it on new workflows when the instance runs new workflows on engine v2 (`N8N_ENGINE_DEFAULT_TYPE=v2` with the `engine-v2` module enabled). It is included in workflow responses for reference, but any value sent when creating or updating a… */
			engineType?: string | null;
			/** Controls which workflows are allowed to call this workflow using the Execute Workflow node. Defaults to workflowsFromSameOwner. Available options: - `any`: Any workflow can call this workflow (no restrictions) - `none`: No other workflows can call this workflow (completely blocked) -… */
			callerPolicy?: string | null;
			/** Comma-separated list of workflow IDs allowed to call this workflow (only used with the workflowsFromAList policy) */
			callerIds?: string | null;
			/** Controls how the time saved per execution is calculated. Available options: - `fixed`: Uses the value in `timeSavedPerExecution`. Use when the time saved is the same for every execution. - `dynamic`: Calculates the time saved from actual execution metrics. `timeSavedPerExecution` is ignored. */
			timeSavedMode?: string | null;
			/** Estimated time saved per execution in minutes */
			timeSavedPerExecution?: number | null;
			/** Controls whether execution data is redacted for this workflow. Available options: - `none` (default): No redaction. All execution data is stored. - `non-manual`: Redact production (non-manually triggered) executions only. - `manual-only`: Redact manually triggered executions only. - `all`:… */
			redactionPolicy?: string | null;
			/** Controls whether a workflow that calls this workflow as a sub-workflow has its executions redacted on the same channels as this workflow. The calling execution keeps a copy of the output of this workflow. Defaults to true. Turn it off only when the output of this workflow is not sensitive.… */
			redactCallerExecutions?: boolean | null;
			/** Controls whether this workflow is reachable over the Model Context Protocol (MCP). Defaults to false. The workflow must be active and must hold at least one active Webhook node. */
			availableInMCP?: boolean | null;
			customTelemetryTags?: Array<{
				key?: string | null;
				value?: string | null;
			}> | null;
			/** ID of the credential resolver that resolves credentials for this workflow. This is a derived, internal setting managed through the credential resolver configuration rather than something intended to be set programmatically. It is included in workflow responses for reference, but any value sent… */
			credentialResolverId?: string | null;
		} | null;
		/** Data the workflow keeps between executions */
		staticData?: Record<string, N8nJsonValue> | null;
		/** Pinned sample data for nodes, keyed by node name */
		pinData?: Record<string, N8nJsonValue> | null;
		/** Workflow metadata such as template information */
		meta?: {
			onboardingId?: string | null;
			templateId?: string | null;
			instanceId?: string | null;
			templateCredsSetupCompleted?: boolean | null;
		} | null;
		tags?: Array<{
			id?: string | null;
			name?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		}> | null;
		shared?: Array<{
			role?: string | null;
			workflowId?: string | null;
			projectId?: string | null;
			project?: {
				id?: string | null;
				name?: string | null;
				type?: string | null;
				/** Icon of the project, or null when the project has none */
				icon?: {
					type?: string | null;
					value?: string | null;
					color?: string | null;
				} | null;
				description?: string | null;
				customTelemetryTags?: Array<{
					key?: string | null;
					value?: string | null;
				}> | null;
				creatorId?: string | null;
				createdAt?: string | null;
				updatedAt?: string | null;
			} | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		}> | null;
		activeVersion?: {
			versionId?: string | null;
			workflowId?: string | null;
			/** Nodes that make up the workflow */
			nodes?: Array<{
				id?: string | null;
				name?: string | null;
				webhookId?: string | null;
				disabled?: boolean | null;
				notesInFlow?: boolean | null;
				notes?: string | null;
				type?: string | null;
				typeVersion?: number | null;
				executeOnce?: boolean | null;
				alwaysOutputData?: boolean | null;
				retryOnFail?: boolean | null;
				maxTries?: number | null;
				waitBetweenTries?: number | null;
				/** use onError instead */
				continueOnFail?: boolean | null;
				onError?: string | null;
				position?: Array<number> | null;
				parameters?: Record<string, N8nJsonValue> | null;
				credentials?: Record<string, N8nJsonValue> | null;
				customTelemetryTags?: {
					tag?: Array<{
						key?: string | null;
						value?: string | null;
					}> | null;
				} | null;
			}> | null;
			/** Connections between nodes, keyed by source node name */
			connections?: Record<string, N8nJsonValue> | null;
			/** Visual groupings of nodes shown as frames on the canvas */
			nodeGroups?: Array<{
				/** Unique identifier for the node group */
				id?: string | null;
				/** Display name of the node group */
				name?: string | null;
				/** Optional plain-text description of the node group */
				description?: string | null;
				/** IDs of the nodes that belong to this group */
				nodeIds?: Array<string> | null;
			}> | null;
			authors?: string | null;
			name?: string | null;
			description?: string | null;
			autosaved?: boolean | null;
			createdAt?: string | null;
			updatedAt?: string | null;
			workflowPublishHistory?: Array<{
				id?: number | null;
				workflowId?: string | null;
				versionId?: string | null;
				event?: string | null;
				userId?: string | null;
				createdAt?: string | null;
			}> | null;
		} | null;
		/** Folder that contains the workflow, or null at the project root */
		parentFolder?: {
			id?: string | null;
			name?: string | null;
			parentFolderId?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		} | null;
	};
	'workflows.getDependencies': N8nDependencyListPublicDtoGenerated;
	'workflows.getTags': N8nWorkflowTagsPublicDtoGenerated;
	'workflows.getVersion': {
		versionId?: string | null;
		workflowId?: string | null;
		/** Nodes that make up the workflow */
		nodes?: Array<{
			id?: string | null;
			name?: string | null;
			webhookId?: string | null;
			disabled?: boolean | null;
			notesInFlow?: boolean | null;
			notes?: string | null;
			type?: string | null;
			typeVersion?: number | null;
			executeOnce?: boolean | null;
			alwaysOutputData?: boolean | null;
			retryOnFail?: boolean | null;
			maxTries?: number | null;
			waitBetweenTries?: number | null;
			/** use onError instead */
			continueOnFail?: boolean | null;
			onError?: string | null;
			position?: Array<number> | null;
			parameters?: Record<string, N8nJsonValue> | null;
			credentials?: Record<string, N8nJsonValue> | null;
			customTelemetryTags?: {
				tag?: Array<{
					key?: string | null;
					value?: string | null;
				}> | null;
			} | null;
		}> | null;
		/** Connections between nodes, keyed by source node name */
		connections?: Record<string, N8nJsonValue> | null;
		/** Visual groupings of nodes shown as frames on the canvas */
		nodeGroups?: Array<{
			/** Unique identifier for the node group */
			id?: string | null;
			/** Display name of the node group */
			name?: string | null;
			/** Optional plain-text description of the node group */
			description?: string | null;
			/** IDs of the nodes that belong to this group */
			nodeIds?: Array<string> | null;
		}> | null;
		authors?: string | null;
		name?: string | null;
		description?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
	};
	'workflows.getVersionLegacy': {
		versionId?: string | null;
		workflowId?: string | null;
		/** Nodes that make up the workflow */
		nodes?: Array<{
			id?: string | null;
			name?: string | null;
			webhookId?: string | null;
			disabled?: boolean | null;
			notesInFlow?: boolean | null;
			notes?: string | null;
			type?: string | null;
			typeVersion?: number | null;
			executeOnce?: boolean | null;
			alwaysOutputData?: boolean | null;
			retryOnFail?: boolean | null;
			maxTries?: number | null;
			waitBetweenTries?: number | null;
			/** use onError instead */
			continueOnFail?: boolean | null;
			onError?: string | null;
			position?: Array<number> | null;
			parameters?: Record<string, N8nJsonValue> | null;
			credentials?: Record<string, N8nJsonValue> | null;
			customTelemetryTags?: {
				tag?: Array<{
					key?: string | null;
					value?: string | null;
				}> | null;
			} | null;
		}> | null;
		/** Connections between nodes, keyed by source node name */
		connections?: Record<string, N8nJsonValue> | null;
		/** Visual groupings of nodes shown as frames on the canvas */
		nodeGroups?: Array<{
			/** Unique identifier for the node group */
			id?: string | null;
			/** Display name of the node group */
			name?: string | null;
			/** Optional plain-text description of the node group */
			description?: string | null;
			/** IDs of the nodes that belong to this group */
			nodeIds?: Array<string> | null;
		}> | null;
		authors?: string | null;
		name?: string | null;
		description?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
	};
	'workflows.list': {
		data?: Array<{
			id?: string | null;
			name?: string | null;
			/** Deprecated. Check whether `activeVersionId` is not null instead. */
			active?: boolean | null;
			activeVersionId?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
			isArchived?: boolean | null;
			versionId?: string | null;
			triggerCount?: number | null;
			/** Nodes that make up the workflow */
			nodes?: Array<{
				id?: string | null;
				name?: string | null;
				webhookId?: string | null;
				disabled?: boolean | null;
				notesInFlow?: boolean | null;
				notes?: string | null;
				type?: string | null;
				typeVersion?: number | null;
				executeOnce?: boolean | null;
				alwaysOutputData?: boolean | null;
				retryOnFail?: boolean | null;
				maxTries?: number | null;
				waitBetweenTries?: number | null;
				/** use onError instead */
				continueOnFail?: boolean | null;
				onError?: string | null;
				position?: Array<number> | null;
				parameters?: Record<string, N8nJsonValue> | null;
				credentials?: Record<string, N8nJsonValue> | null;
				customTelemetryTags?: {
					tag?: Array<{
						key?: string | null;
						value?: string | null;
					}> | null;
				} | null;
			}> | null;
			/** Connections between nodes, keyed by source node name */
			connections?: Record<string, N8nJsonValue> | null;
			/** Visual groupings of nodes shown as frames on the canvas */
			nodeGroups?: Array<{
				/** Unique identifier for the node group */
				id?: string | null;
				/** Display name of the node group */
				name?: string | null;
				/** Optional plain-text description of the node group */
				description?: string | null;
				/** IDs of the nodes that belong to this group */
				nodeIds?: Array<string> | null;
			}> | null;
			/** Execution and behaviour settings for the workflow */
			settings?: {
				saveExecutionProgress?: (boolean | string) | null;
				saveManualExecutions?: (boolean | string) | null;
				saveDataErrorExecution?: string | null;
				saveDataSuccessExecution?: string | null;
				executionTimeout?: number | null;
				/** The ID of the workflow that contains the error trigger node. */
				errorWorkflow?: string | null;
				timezone?: string | null;
				executionOrder?: string | null;
				/** Controls how binary data is resolved from a node's input. This is a derived, internal setting rather than something intended to be set programmatically. It is included in workflow responses for reference, but any value sent when creating or updating a workflow is ignored. */
				binaryMode?: string | null;
				/** The execution engine that runs this workflow. n8n sets it on new workflows when the instance runs new workflows on engine v2 (`N8N_ENGINE_DEFAULT_TYPE=v2` with the `engine-v2` module enabled). It is included in workflow responses for reference, but any value sent when creating or updating a… */
				engineType?: string | null;
				/** Controls which workflows are allowed to call this workflow using the Execute Workflow node. Defaults to workflowsFromSameOwner. Available options: - `any`: Any workflow can call this workflow (no restrictions) - `none`: No other workflows can call this workflow (completely blocked) -… */
				callerPolicy?: string | null;
				/** Comma-separated list of workflow IDs allowed to call this workflow (only used with the workflowsFromAList policy) */
				callerIds?: string | null;
				/** Controls how the time saved per execution is calculated. Available options: - `fixed`: Uses the value in `timeSavedPerExecution`. Use when the time saved is the same for every execution. - `dynamic`: Calculates the time saved from actual execution metrics. `timeSavedPerExecution` is ignored. */
				timeSavedMode?: string | null;
				/** Estimated time saved per execution in minutes */
				timeSavedPerExecution?: number | null;
				/** Controls whether execution data is redacted for this workflow. Available options: - `none` (default): No redaction. All execution data is stored. - `non-manual`: Redact production (non-manually triggered) executions only. - `manual-only`: Redact manually triggered executions only. - `all`:… */
				redactionPolicy?: string | null;
				/** Controls whether a workflow that calls this workflow as a sub-workflow has its executions redacted on the same channels as this workflow. The calling execution keeps a copy of the output of this workflow. Defaults to true. Turn it off only when the output of this workflow is not sensitive.… */
				redactCallerExecutions?: boolean | null;
				/** Controls whether this workflow is reachable over the Model Context Protocol (MCP). Defaults to false. The workflow must be active and must hold at least one active Webhook node. */
				availableInMCP?: boolean | null;
				customTelemetryTags?: Array<{
					key?: string | null;
					value?: string | null;
				}> | null;
				/** ID of the credential resolver that resolves credentials for this workflow. This is a derived, internal setting managed through the credential resolver configuration rather than something intended to be set programmatically. It is included in workflow responses for reference, but any value sent… */
				credentialResolverId?: string | null;
			} | null;
			/** Data the workflow keeps between executions */
			staticData?: Record<string, N8nJsonValue> | null;
			/** Pinned sample data for nodes, keyed by node name */
			pinData?: Record<string, N8nJsonValue> | null;
			/** Workflow metadata such as template information */
			meta?: {
				onboardingId?: string | null;
				templateId?: string | null;
				instanceId?: string | null;
				templateCredsSetupCompleted?: boolean | null;
			} | null;
			tags?: Array<{
				id?: string | null;
				name?: string | null;
				createdAt?: string | null;
				updatedAt?: string | null;
			}> | null;
			shared?: Array<{
				role?: string | null;
				workflowId?: string | null;
				projectId?: string | null;
				createdAt?: string | null;
				updatedAt?: string | null;
			}> | null;
			activeVersion?: {
				versionId?: string | null;
				workflowId?: string | null;
				/** Nodes that make up the workflow */
				nodes?: Array<{
					id?: string | null;
					name?: string | null;
					webhookId?: string | null;
					disabled?: boolean | null;
					notesInFlow?: boolean | null;
					notes?: string | null;
					type?: string | null;
					typeVersion?: number | null;
					executeOnce?: boolean | null;
					alwaysOutputData?: boolean | null;
					retryOnFail?: boolean | null;
					maxTries?: number | null;
					waitBetweenTries?: number | null;
					/** use onError instead */
					continueOnFail?: boolean | null;
					onError?: string | null;
					position?: Array<number> | null;
					parameters?: Record<string, N8nJsonValue> | null;
					credentials?: Record<string, N8nJsonValue> | null;
					customTelemetryTags?: {
						tag?: Array<{
							key?: string | null;
							value?: string | null;
						}> | null;
					} | null;
				}> | null;
				/** Connections between nodes, keyed by source node name */
				connections?: Record<string, N8nJsonValue> | null;
				/** Visual groupings of nodes shown as frames on the canvas */
				nodeGroups?: Array<{
					/** Unique identifier for the node group */
					id?: string | null;
					/** Display name of the node group */
					name?: string | null;
					/** Optional plain-text description of the node group */
					description?: string | null;
					/** IDs of the nodes that belong to this group */
					nodeIds?: Array<string> | null;
				}> | null;
				authors?: string | null;
				name?: string | null;
				description?: string | null;
				autosaved?: boolean | null;
				createdAt?: string | null;
				updatedAt?: string | null;
			} | null;
			/** Folder that contains the workflow, or null at the project root. The field is present only when `includeParentFolder` is `true`. */
			parentFolder?: {
				id?: string | null;
			} | null;
		}> | null;
		nextCursor?: string | null;
	};
	'workflows.listHistory': {
		data?: Array<{
			versionId?: string | null;
			workflowId?: string | null;
			authors?: string | null;
			name?: string | null;
			description?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		}> | null;
		nextCursor?: string | null;
	};
	'workflows.publish': N8nWorkflowPublishPublicDtoGenerated;
	'workflows.run': {
		/** ID of the new execution. Use `GET /executions/{id}` to read its status. */
		executionId?: string | null;
	};
	'workflows.setTags': N8nWorkflowTagsPublicDtoGenerated;
	'workflows.transfer': {
		/** n8n accepted the call; it answered with no body. */
		success: true;
	};
	'workflows.unarchive': N8nWorkflowPublicDtoGenerated;
	'workflows.unpublish': N8nWorkflowPublicDtoGenerated;
	'workflows.update': {
		id?: string | null;
		name?: string | null;
		description?: string | null;
		/** Deprecated. Check whether `activeVersionId` is not null instead. */
		active?: boolean | null;
		activeVersionId?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
		isArchived?: boolean | null;
		versionId?: string | null;
		versionCounter?: number | null;
		sourceWorkflowId?: string | null;
		triggerCount?: number | null;
		/** Nodes that make up the workflow */
		nodes?: Array<{
			id?: string | null;
			name?: string | null;
			webhookId?: string | null;
			disabled?: boolean | null;
			notesInFlow?: boolean | null;
			notes?: string | null;
			type?: string | null;
			typeVersion?: number | null;
			executeOnce?: boolean | null;
			alwaysOutputData?: boolean | null;
			retryOnFail?: boolean | null;
			maxTries?: number | null;
			waitBetweenTries?: number | null;
			/** use onError instead */
			continueOnFail?: boolean | null;
			onError?: string | null;
			position?: Array<number> | null;
			parameters?: Record<string, N8nJsonValue> | null;
			credentials?: Record<string, N8nJsonValue> | null;
			customTelemetryTags?: {
				tag?: Array<{
					key?: string | null;
					value?: string | null;
				}> | null;
			} | null;
		}> | null;
		/** Connections between nodes, keyed by source node name */
		connections?: Record<string, N8nJsonValue> | null;
		/** Visual groupings of nodes shown as frames on the canvas */
		nodeGroups?: Array<{
			/** Unique identifier for the node group */
			id?: string | null;
			/** Display name of the node group */
			name?: string | null;
			/** Optional plain-text description of the node group */
			description?: string | null;
			/** IDs of the nodes that belong to this group */
			nodeIds?: Array<string> | null;
		}> | null;
		/** Execution and behaviour settings for the workflow */
		settings?: {
			saveExecutionProgress?: (boolean | string) | null;
			saveManualExecutions?: (boolean | string) | null;
			saveDataErrorExecution?: string | null;
			saveDataSuccessExecution?: string | null;
			executionTimeout?: number | null;
			/** The ID of the workflow that contains the error trigger node. */
			errorWorkflow?: string | null;
			timezone?: string | null;
			executionOrder?: string | null;
			/** Controls how binary data is resolved from a node's input. This is a derived, internal setting rather than something intended to be set programmatically. It is included in workflow responses for reference, but any value sent when creating or updating a workflow is ignored. */
			binaryMode?: string | null;
			/** The execution engine that runs this workflow. n8n sets it on new workflows when the instance runs new workflows on engine v2 (`N8N_ENGINE_DEFAULT_TYPE=v2` with the `engine-v2` module enabled). It is included in workflow responses for reference, but any value sent when creating or updating a… */
			engineType?: string | null;
			/** Controls which workflows are allowed to call this workflow using the Execute Workflow node. Defaults to workflowsFromSameOwner. Available options: - `any`: Any workflow can call this workflow (no restrictions) - `none`: No other workflows can call this workflow (completely blocked) -… */
			callerPolicy?: string | null;
			/** Comma-separated list of workflow IDs allowed to call this workflow (only used with the workflowsFromAList policy) */
			callerIds?: string | null;
			/** Controls how the time saved per execution is calculated. Available options: - `fixed`: Uses the value in `timeSavedPerExecution`. Use when the time saved is the same for every execution. - `dynamic`: Calculates the time saved from actual execution metrics. `timeSavedPerExecution` is ignored. */
			timeSavedMode?: string | null;
			/** Estimated time saved per execution in minutes */
			timeSavedPerExecution?: number | null;
			/** Controls whether execution data is redacted for this workflow. Available options: - `none` (default): No redaction. All execution data is stored. - `non-manual`: Redact production (non-manually triggered) executions only. - `manual-only`: Redact manually triggered executions only. - `all`:… */
			redactionPolicy?: string | null;
			/** Controls whether a workflow that calls this workflow as a sub-workflow has its executions redacted on the same channels as this workflow. The calling execution keeps a copy of the output of this workflow. Defaults to true. Turn it off only when the output of this workflow is not sensitive.… */
			redactCallerExecutions?: boolean | null;
			/** Controls whether this workflow is reachable over the Model Context Protocol (MCP). Defaults to false. The workflow must be active and must hold at least one active Webhook node. */
			availableInMCP?: boolean | null;
			customTelemetryTags?: Array<{
				key?: string | null;
				value?: string | null;
			}> | null;
			/** ID of the credential resolver that resolves credentials for this workflow. This is a derived, internal setting managed through the credential resolver configuration rather than something intended to be set programmatically. It is included in workflow responses for reference, but any value sent… */
			credentialResolverId?: string | null;
		} | null;
		/** Data the workflow keeps between executions */
		staticData?: Record<string, N8nJsonValue> | null;
		/** Pinned sample data for nodes, keyed by node name */
		pinData?: Record<string, N8nJsonValue> | null;
		/** Workflow metadata such as template information */
		meta?: {
			onboardingId?: string | null;
			templateId?: string | null;
			instanceId?: string | null;
			templateCredsSetupCompleted?: boolean | null;
		} | null;
		tags?: Array<{
			id?: string | null;
			name?: string | null;
			createdAt?: string | null;
			updatedAt?: string | null;
		}> | null;
		activeVersion?: {
			versionId?: string | null;
			workflowId?: string | null;
			/** Nodes that make up the workflow */
			nodes?: Array<{
				id?: string | null;
				name?: string | null;
				webhookId?: string | null;
				disabled?: boolean | null;
				notesInFlow?: boolean | null;
				notes?: string | null;
				type?: string | null;
				typeVersion?: number | null;
				executeOnce?: boolean | null;
				alwaysOutputData?: boolean | null;
				retryOnFail?: boolean | null;
				maxTries?: number | null;
				waitBetweenTries?: number | null;
				/** use onError instead */
				continueOnFail?: boolean | null;
				onError?: string | null;
				position?: Array<number> | null;
				parameters?: Record<string, N8nJsonValue> | null;
				credentials?: Record<string, N8nJsonValue> | null;
				customTelemetryTags?: {
					tag?: Array<{
						key?: string | null;
						value?: string | null;
					}> | null;
				} | null;
			}> | null;
			/** Connections between nodes, keyed by source node name */
			connections?: Record<string, N8nJsonValue> | null;
			/** Visual groupings of nodes shown as frames on the canvas */
			nodeGroups?: Array<{
				/** Unique identifier for the node group */
				id?: string | null;
				/** Display name of the node group */
				name?: string | null;
				/** Optional plain-text description of the node group */
				description?: string | null;
				/** IDs of the nodes that belong to this group */
				nodeIds?: Array<string> | null;
			}> | null;
			authors?: string | null;
			name?: string | null;
			description?: string | null;
			autosaved?: boolean | null;
			createdAt?: string | null;
			updatedAt?: string | null;
			workflowPublishHistory?: Array<{
				id?: number | null;
				workflowId?: string | null;
				versionId?: string | null;
				event?: string | null;
				userId?: string | null;
				createdAt?: string | null;
			}> | null;
		} | null;
	};
};
