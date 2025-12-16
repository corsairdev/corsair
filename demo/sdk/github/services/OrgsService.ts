/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { api_insights_route_stats } from '../models/api_insights_route_stats';
import type { api_insights_subject_stats } from '../models/api_insights_subject_stats';
import type { api_insights_summary_stats } from '../models/api_insights_summary_stats';
import type { api_insights_time_stats } from '../models/api_insights_time_stats';
import type { api_insights_user_stats } from '../models/api_insights_user_stats';
import type { artifact_deployment_record } from '../models/artifact_deployment_record';
import type { custom_property } from '../models/custom_property';
import type { custom_property_set_payload } from '../models/custom_property_set_payload';
import type { custom_property_value } from '../models/custom_property_value';
import type { hook_delivery } from '../models/hook_delivery';
import type { hook_delivery_item } from '../models/hook_delivery_item';
import type { immutable_releases_organization_settings } from '../models/immutable_releases_organization_settings';
import type { installation } from '../models/installation';
import type { issue_type } from '../models/issue_type';
import type { minimal_repository } from '../models/minimal_repository';
import type { org_hook } from '../models/org_hook';
import type { org_membership } from '../models/org_membership';
import type { org_repo_custom_property_values } from '../models/org_repo_custom_property_values';
import type { organization_create_issue_type } from '../models/organization_create_issue_type';
import type { organization_full } from '../models/organization_full';
import type { organization_invitation } from '../models/organization_invitation';
import type { organization_programmatic_access_grant } from '../models/organization_programmatic_access_grant';
import type { organization_programmatic_access_grant_request } from '../models/organization_programmatic_access_grant_request';
import type { organization_role } from '../models/organization_role';
import type { organization_simple } from '../models/organization_simple';
import type { organization_update_issue_type } from '../models/organization_update_issue_type';
import type { ruleset_version } from '../models/ruleset_version';
import type { ruleset_version_with_state } from '../models/ruleset_version_with_state';
import type { simple_user } from '../models/simple_user';
import type { team } from '../models/team';
import type { team_role_assignment } from '../models/team_role_assignment';
import type { team_simple } from '../models/team_simple';
import type { user_role_assignment } from '../models/user_role_assignment';
import type { webhook_config } from '../models/webhook_config';
import type { webhook_config_content_type } from '../models/webhook_config_content_type';
import type { webhook_config_insecure_ssl } from '../models/webhook_config_insecure_ssl';
import type { webhook_config_secret } from '../models/webhook_config_secret';
import type { webhook_config_url } from '../models/webhook_config_url';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrgsService {
    /**
     * List organizations
     * Lists all organizations, in the order that they were created.
     *
     * > [!NOTE]
     * > Pagination is powered exclusively by the `since` parameter. Use the [Link header](https://docs.github.com/rest/guides/using-pagination-in-the-rest-api#using-link-headers) to get the URL for the next page of organizations.
     * @param since An organization ID. Only return organizations with an ID greater than this ID.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns organization_simple Response
     * @throws ApiError
     */
    public static orgsList(
        since?: number,
        perPage: number = 30,
    ): CancelablePromise<Array<organization_simple>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/organizations',
            query: {
                'since': since,
                'per_page': perPage,
            },
            errors: {
                304: `Not modified`,
            },
        });
    }
    /**
     * Get all custom property values for an organization
     * Gets all custom property values that are set for an organization.
     *
     * The organization must belong to an enterprise.
     *
     * Access requirements:
     * - Organization admins
     * - OAuth tokens and personal access tokens (classic) with the `read:org` scope
     * - Actors with the organization-level "read custom properties for an organization" fine-grained permission or above
     * @param org The organization name. The name is not case sensitive.
     * @returns custom_property_value Response
     * @throws ApiError
     */
    public static orgsCustomPropertiesForOrgsGetOrganizationValues(
        org: string,
    ): CancelablePromise<Array<custom_property_value>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/organizations/{org}/org-properties/values',
            path: {
                'org': org,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Create or update custom property values for an organization
     * Create new or update existing custom property values for an organization.
     * To remove a custom property value from an organization, set the property value to `null`.
     *
     * The organization must belong to an enterprise.
     *
     * Access requirements:
     * - Organization admins
     * - OAuth tokens and personal access tokens (classic) with the `admin:org` scope
     * - Actors with the organization-level "edit custom properties for an organization" fine-grained permission
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static orgsCustomPropertiesForOrgsCreateOrUpdateOrganizationValues(
        org: string,
        requestBody: {
            /**
             * A list of custom property names and associated values to apply to the organization.
             */
            properties: Array<custom_property_value>;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/organizations/{org}/org-properties/values',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get an organization
     * Gets information about an organization.
     *
     * When the value of `two_factor_requirement_enabled` is `true`, the organization requires all members, billing managers, outside collaborators, guest collaborators, repository collaborators, or everyone with access to any repository within the organization to enable [two-factor authentication](https://docs.github.com/articles/securing-your-account-with-two-factor-authentication-2fa/).
     *
     * To see the full details about an organization, the authenticated user must be an organization owner.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to see the full details about an organization.
     *
     * To see information about an organization's GitHub plan, GitHub Apps need the `Organization plan` permission.
     * @param org The organization name. The name is not case sensitive.
     * @returns organization_full Response
     * @throws ApiError
     */
    public static orgsGet(
        org: string,
    ): CancelablePromise<organization_full> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}',
            path: {
                'org': org,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Update an organization
     * > [!WARNING]
     * > **Closing down notice:** GitHub will replace and discontinue `members_allowed_repository_creation_type` in favor of more granular permissions. The new input parameters are `members_can_create_public_repositories`, `members_can_create_private_repositories` for all organizations and `members_can_create_internal_repositories` for organizations associated with an enterprise account using GitHub Enterprise Cloud or GitHub Enterprise Server 2.20+. For more information, see the [blog post](https://developer.github.com/changes/2019-12-03-internal-visibility-changes).
     *
     * > [!WARNING]
     * > **Closing down notice:** Code security product enablement for new repositories through the organization API is closing down. Please use [code security configurations](https://docs.github.com/rest/code-security/configurations#set-a-code-security-configuration-as-a-default-for-an-organization) to set defaults instead. For more information on setting a default security configuration, see the [changelog](https://github.blog/changelog/2024-07-09-sunsetting-security-settings-defaults-parameters-in-the-organizations-rest-api/).
     *
     * Updates the organization's profile and member privileges.
     *
     * The authenticated user must be an organization owner to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` or `repo` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns organization_full Response
     * @throws ApiError
     */
    public static orgsUpdate(
        org: string,
        requestBody?: {
            /**
             * Billing email address. This address is not publicized.
             */
            billing_email?: string;
            /**
             * The company name.
             */
            company?: string;
            /**
             * The publicly visible email address.
             */
            email?: string;
            /**
             * The Twitter username of the company.
             */
            twitter_username?: string;
            /**
             * The location.
             */
            location?: string;
            /**
             * The shorthand name of the company.
             */
            name?: string;
            /**
             * The description of the company. The maximum size is 160 characters.
             */
            description?: string;
            /**
             * Whether an organization can use organization projects.
             */
            has_organization_projects?: boolean;
            /**
             * Whether repositories that belong to the organization can use repository projects.
             */
            has_repository_projects?: boolean;
            /**
             * Default permission level members have for organization repositories.
             */
            default_repository_permission?: 'read' | 'write' | 'admin' | 'none';
            /**
             * Whether of non-admin organization members can create repositories. **Note:** A parameter can override this parameter. See `members_allowed_repository_creation_type` in this table for details.
             */
            members_can_create_repositories?: boolean;
            /**
             * Whether organization members can create internal repositories, which are visible to all enterprise members. You can only allow members to create internal repositories if your organization is associated with an enterprise account using GitHub Enterprise Cloud or GitHub Enterprise Server 2.20+. For more information, see "[Restricting repository creation in your organization](https://docs.github.com/github/setting-up-and-managing-organizations-and-teams/restricting-repository-creation-in-your-organization)" in the GitHub Help documentation.
             */
            members_can_create_internal_repositories?: boolean;
            /**
             * Whether organization members can create private repositories, which are visible to organization members with permission. For more information, see "[Restricting repository creation in your organization](https://docs.github.com/github/setting-up-and-managing-organizations-and-teams/restricting-repository-creation-in-your-organization)" in the GitHub Help documentation.
             */
            members_can_create_private_repositories?: boolean;
            /**
             * Whether organization members can create public repositories, which are visible to anyone. For more information, see "[Restricting repository creation in your organization](https://docs.github.com/github/setting-up-and-managing-organizations-and-teams/restricting-repository-creation-in-your-organization)" in the GitHub Help documentation.
             */
            members_can_create_public_repositories?: boolean;
            /**
             * Specifies which types of repositories non-admin organization members can create. `private` is only available to repositories that are part of an organization on GitHub Enterprise Cloud.
             * **Note:** This parameter is closing down and will be removed in the future. Its return value ignores internal repositories. Using this parameter overrides values set in `members_can_create_repositories`. See the parameter deprecation notice in the operation description for details.
             */
            members_allowed_repository_creation_type?: 'all' | 'private' | 'none';
            /**
             * Whether organization members can create GitHub Pages sites. Existing published sites will not be impacted.
             */
            members_can_create_pages?: boolean;
            /**
             * Whether organization members can create public GitHub Pages sites. Existing published sites will not be impacted.
             */
            members_can_create_public_pages?: boolean;
            /**
             * Whether organization members can create private GitHub Pages sites. Existing published sites will not be impacted.
             */
            members_can_create_private_pages?: boolean;
            /**
             * Whether organization members can fork private organization repositories.
             */
            members_can_fork_private_repositories?: boolean;
            /**
             * Whether contributors to organization repositories are required to sign off on commits they make through GitHub's web interface.
             */
            web_commit_signoff_required?: boolean;
            blog?: string;
            /**
             * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
             *
             * Whether GitHub Advanced Security is automatically enabled for new repositories and repositories transferred to this organization.
             *
             * To use this parameter, you must have admin permissions for the repository or be an owner or security manager for the organization that owns the repository. For more information, see "[Managing security managers in your organization](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/managing-security-managers-in-your-organization)."
             *
             * You can check which security and analysis features are currently enabled by using a `GET /orgs/{org}` request.
             * @deprecated
             */
            advanced_security_enabled_for_new_repositories?: boolean;
            /**
             * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
             *
             * Whether Dependabot alerts are automatically enabled for new repositories and repositories transferred to this organization.
             *
             * To use this parameter, you must have admin permissions for the repository or be an owner or security manager for the organization that owns the repository. For more information, see "[Managing security managers in your organization](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/managing-security-managers-in-your-organization)."
             *
             * You can check which security and analysis features are currently enabled by using a `GET /orgs/{org}` request.
             * @deprecated
             */
            dependabot_alerts_enabled_for_new_repositories?: boolean;
            /**
             * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
             *
             * Whether Dependabot security updates are automatically enabled for new repositories and repositories transferred to this organization.
             *
             * To use this parameter, you must have admin permissions for the repository or be an owner or security manager for the organization that owns the repository. For more information, see "[Managing security managers in your organization](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/managing-security-managers-in-your-organization)."
             *
             * You can check which security and analysis features are currently enabled by using a `GET /orgs/{org}` request.
             * @deprecated
             */
            dependabot_security_updates_enabled_for_new_repositories?: boolean;
            /**
             * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
             *
             * Whether dependency graph is automatically enabled for new repositories and repositories transferred to this organization.
             *
             * To use this parameter, you must have admin permissions for the repository or be an owner or security manager for the organization that owns the repository. For more information, see "[Managing security managers in your organization](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/managing-security-managers-in-your-organization)."
             *
             * You can check which security and analysis features are currently enabled by using a `GET /orgs/{org}` request.
             * @deprecated
             */
            dependency_graph_enabled_for_new_repositories?: boolean;
            /**
             * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
             *
             * Whether secret scanning is automatically enabled for new repositories and repositories transferred to this organization.
             *
             * To use this parameter, you must have admin permissions for the repository or be an owner or security manager for the organization that owns the repository. For more information, see "[Managing security managers in your organization](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/managing-security-managers-in-your-organization)."
             *
             * You can check which security and analysis features are currently enabled by using a `GET /orgs/{org}` request.
             * @deprecated
             */
            secret_scanning_enabled_for_new_repositories?: boolean;
            /**
             * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
             *
             * Whether secret scanning push protection is automatically enabled for new repositories and repositories transferred to this organization.
             *
             * To use this parameter, you must have admin permissions for the repository or be an owner or security manager for the organization that owns the repository. For more information, see "[Managing security managers in your organization](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/managing-security-managers-in-your-organization)."
             *
             * You can check which security and analysis features are currently enabled by using a `GET /orgs/{org}` request.
             * @deprecated
             */
            secret_scanning_push_protection_enabled_for_new_repositories?: boolean;
            /**
             * Whether a custom link is shown to contributors who are blocked from pushing a secret by push protection.
             */
            secret_scanning_push_protection_custom_link_enabled?: boolean;
            /**
             * If `secret_scanning_push_protection_custom_link_enabled` is true, the URL that will be displayed to contributors who are blocked from pushing a secret.
             */
            secret_scanning_push_protection_custom_link?: string;
            /**
             * Controls whether or not deploy keys may be added and used for repositories in the organization.
             */
            deploy_keys_enabled_for_repositories?: boolean;
        },
    ): CancelablePromise<organization_full> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/orgs/{org}',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Conflict`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Delete an organization
     * Deletes an organization and all its repositories.
     *
     * The organization login will be unavailable for 90 days after deletion.
     *
     * Please review the Terms of Service regarding account deletion before using this endpoint:
     *
     * https://docs.github.com/site-policy/github-terms/github-terms-of-service
     * @param org The organization name. The name is not case sensitive.
     * @returns any Accepted
     * @throws ApiError
     */
    public static orgsDelete(
        org: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}',
            path: {
                'org': org,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Create an artifact deployment record
     * Create or update deployment records for an artifact associated with an organization.
     * This endpoint allows you to record information about a specific artifact, such as its name, digest, environments, cluster, and deployment.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns any Artifact deployment record stored successfully.
     * @throws ApiError
     */
    public static orgsCreateArtifactDeploymentRecord(
        org: string,
        requestBody: {
            /**
             * The name of the artifact.
             */
            name: string;
            /**
             * The hex encoded digest of the artifact.
             */
            digest: string;
            /**
             * The artifact version.
             */
            version?: string;
            /**
             * The status of the artifact. Can be either deployed or decommissioned.
             */
            status: 'deployed' | 'decommissioned';
            /**
             * The stage of the deployment.
             */
            logical_environment: string;
            /**
             * The physical region of the deployment.
             */
            physical_environment?: string;
            /**
             * The deployment cluster.
             */
            cluster?: string;
            /**
             * The name of the deployment.
             */
            deployment_name: string;
            /**
             * The tags associated with the deployment.
             */
            tags?: Record<string, string>;
            /**
             * A list of runtime risks associated with the deployment.
             */
            runtime_risks?: Array<'critical-resource' | 'internet-exposed' | 'lateral-movement' | 'sensitive-data'>;
            /**
             * The name of the GitHub repository associated with the artifact. This should be used
             * when there are no provenance attestations available for the artifact. The repository
             * must belong to the organization specified in the path parameter.
             *
             * If a provenance attestation is available for the artifact, the API will use
             * the repository information from the attestation instead of this parameter.
             */
            github_repository?: string;
        },
    ): CancelablePromise<{
        /**
         * The number of deployment records created
         */
        total_count?: number;
        deployment_records?: Array<artifact_deployment_record>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/artifacts/metadata/deployment-record',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Set cluster deployment records
     * Set deployment records for a given cluster.
     * @param org The organization name. The name is not case sensitive.
     * @param cluster The cluster name.
     * @param requestBody
     * @returns any Artifact deployment record stored successfully.
     * @throws ApiError
     */
    public static orgsSetClusterDeploymentRecords(
        org: string,
        cluster: string,
        requestBody: {
            /**
             * The stage of the deployment.
             */
            logical_environment: string;
            /**
             * The physical region of the deployment.
             */
            physical_environment?: string;
            /**
             * The list of deployments to record.
             */
            deployments: Array<{
                /**
                 * The name of the artifact. Note that if multiple deployments have identical 'digest' parameter values,
                 * the name parameter must also be identical across all entries.
                 *
                 */
                name: string;
                /**
                 * The hex encoded digest of the artifact. Note that if multiple deployments have identical 'digest' parameter values,
                 * the name and version parameters must also be identical across all entries.
                 *
                 */
                digest: string;
                /**
                 * The artifact version. Note that if multiple deployments have identical 'digest' parameter values,
                 * the version parameter must also be identical across all entries.
                 *
                 */
                version?: string;
                /**
                 * The deployment status of the artifact.
                 */
                status?: 'deployed' | 'decommissioned';
                /**
                 * The unique identifier for the deployment represented by the new record. To accommodate differing
                 * containers and namespaces within a record set, the following format is recommended:
                 * {namespaceName}-{deploymentName}-{containerName}
                 *
                 */
                deployment_name: string;
                /**
                 * The name of the GitHub repository associated with the artifact. This should be used
                 * when there are no provenance attestations available for the artifact. The repository
                 * must belong to the organization specified in the path parameter.
                 *
                 * If a provenance attestation is available for the artifact, the API will use
                 * the repository information from the attestation instead of this parameter.
                 */
                github_repository?: string;
                /**
                 * Key-value pairs to tag the deployment record.
                 */
                tags?: Record<string, string>;
                /**
                 * A list of runtime risks associated with the deployment.
                 */
                runtime_risks?: Array<'critical-resource' | 'internet-exposed' | 'lateral-movement' | 'sensitive-data'>;
            }>;
        },
    ): CancelablePromise<{
        /**
         * The number of deployment records created
         */
        total_count?: number;
        deployment_records?: Array<artifact_deployment_record>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/artifacts/metadata/deployment-record/cluster/{cluster}',
            path: {
                'org': org,
                'cluster': cluster,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Create artifact metadata storage record
     * Create metadata storage records for artifacts associated with an organization.
     * This endpoint will create a new artifact storage record on behalf of any artifact matching the provided digest and
     * associated with a repository owned by the organization.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns any Artifact metadata storage record stored successfully.
     * @throws ApiError
     */
    public static orgsCreateArtifactStorageRecord(
        org: string,
        requestBody: {
            /**
             * The name of the artifact.
             */
            name: string;
            /**
             * The digest of the artifact (algorithm:hex-encoded-digest).
             */
            digest: string;
            /**
             * The artifact version.
             */
            version?: string;
            /**
             * The URL where the artifact is stored.
             */
            artifact_url?: string;
            /**
             * The path of the artifact.
             */
            path?: string;
            /**
             * The base URL of the artifact registry.
             */
            registry_url: string;
            /**
             * The repository name within the registry.
             */
            repository?: string;
            /**
             * The status of the artifact (e.g., active, inactive).
             */
            status?: 'active' | 'eol' | 'deleted';
            /**
             * The name of the GitHub repository associated with the artifact. This should be used
             * when there are no provenance attestations available for the artifact. The repository
             * must belong to the organization specified in the path parameter.
             *
             * If a provenance attestation is available for the artifact, the API will use
             * the repository information from the attestation instead of this parameter.
             */
            github_repository?: string;
        },
    ): CancelablePromise<{
        total_count?: number;
        storage_records?: Array<{
            id?: number;
            name?: string;
            digest?: string;
            artifact_url?: string | null;
            registry_url?: string;
            repository?: string | null;
            status?: string;
            created_at?: string;
            updated_at?: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/artifacts/metadata/storage-record',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List artifact deployment records
     * List deployment records for an artifact metadata associated with an organization.
     * @param org The organization name. The name is not case sensitive.
     * @param subjectDigest The SHA256 digest of the artifact, in the form `sha256:HEX_DIGEST`.
     * @returns any Successful response
     * @throws ApiError
     */
    public static orgsListArtifactDeploymentRecords(
        org: string,
        subjectDigest: string,
    ): CancelablePromise<{
        /**
         * The number of deployment records for this digest and organization
         */
        total_count?: number;
        deployment_records?: Array<artifact_deployment_record>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/artifacts/{subject_digest}/metadata/deployment-records',
            path: {
                'org': org,
                'subject_digest': subjectDigest,
            },
        });
    }
    /**
     * List artifact storage records
     * List a collection of artifact storage records with a given subject digest that are associated with repositories owned by an organization.
     *
     * The collection of storage records returned by this endpoint is filtered according to the authenticated user's permissions; if the authenticated user cannot read a repository, the attestations associated with that repository will not be included in the response. In addition, when using a fine-grained access token the `content:read` permission is required.
     * @param org The organization name. The name is not case sensitive.
     * @param subjectDigest The parameter should be set to the attestation's subject's SHA256 digest, in the form `sha256:HEX_DIGEST`.
     * @returns any Response
     * @throws ApiError
     */
    public static orgsListArtifactStorageRecords(
        org: string,
        subjectDigest: string,
    ): CancelablePromise<{
        /**
         * The number of storage records for this digest and organization
         */
        total_count?: number;
        storage_records?: Array<{
            id?: number;
            name?: string;
            digest?: string;
            artifact_url?: string;
            registry_url?: string;
            repository?: string;
            status?: string;
            created_at?: string;
            updated_at?: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/artifacts/{subject_digest}/metadata/storage-records',
            path: {
                'org': org,
                'subject_digest': subjectDigest,
            },
        });
    }
    /**
     * List attestations by bulk subject digests
     * List a collection of artifact attestations associated with any entry in a list of subject digests owned by an organization.
     *
     * The collection of attestations returned by this endpoint is filtered according to the authenticated user's permissions; if the authenticated user cannot read a repository, the attestations associated with that repository will not be included in the response. In addition, when using a fine-grained access token the `attestations:read` permission is required.
     *
     * **Please note:** in order to offer meaningful security benefits, an attestation's signature and timestamps **must** be cryptographically verified, and the identity of the attestation signer **must** be validated. Attestations can be verified using the [GitHub CLI `attestation verify` command](https://cli.github.com/manual/gh_attestation_verify). For more information, see [our guide on how to use artifact attestations to establish a build's provenance](https://docs.github.com/actions/security-guides/using-artifact-attestations-to-establish-provenance-for-builds).
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param before A cursor, as given in the [Link header](https://docs.github.com/rest/guides/using-pagination-in-the-rest-api#using-link-headers). If specified, the query only searches for results before this cursor. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param after A cursor, as given in the [Link header](https://docs.github.com/rest/guides/using-pagination-in-the-rest-api#using-link-headers). If specified, the query only searches for results after this cursor. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static orgsListAttestationsBulk(
        org: string,
        requestBody: {
            /**
             * List of subject digests to fetch attestations for.
             */
            subject_digests: Array<string>;
            /**
             * Optional filter for fetching attestations with a given predicate type.
             * This option accepts `provenance`, `sbom`, `release`, or freeform text
             * for custom predicate types.
             */
            predicate_type?: string;
        },
        perPage: number = 30,
        before?: string,
        after?: string,
    ): CancelablePromise<{
        /**
         * Mapping of subject digest to bundles.
         */
        attestations_subject_digests?: Record<string, Array<{
            /**
             * The bundle of the attestation.
             */
            bundle?: {
                mediaType?: string;
                verificationMaterial?: Record<string, any>;
                dsseEnvelope?: Record<string, any>;
            };
            repository_id?: number;
            bundle_url?: string;
        }> | null>;
        /**
         * Information about the current page.
         */
        page_info?: {
            /**
             * Indicates whether there is a next page.
             */
            has_next?: boolean;
            /**
             * Indicates whether there is a previous page.
             */
            has_previous?: boolean;
            /**
             * The cursor to the next page.
             */
            next?: string;
            /**
             * The cursor to the previous page.
             */
            previous?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/attestations/bulk-list',
            path: {
                'org': org,
            },
            query: {
                'per_page': perPage,
                'before': before,
                'after': after,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete attestations in bulk
     * Delete artifact attestations in bulk by either subject digests or unique ID.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns any Response
     * @throws ApiError
     */
    public static orgsDeleteAttestationsBulk(
        org: string,
        requestBody: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/attestations/delete-request',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Delete attestations by subject digest
     * Delete an artifact attestation by subject digest.
     * @param org The organization name. The name is not case sensitive.
     * @param subjectDigest Subject Digest
     * @returns any Response
     * @throws ApiError
     */
    public static orgsDeleteAttestationsBySubjectDigest(
        org: string,
        subjectDigest: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/attestations/digest/{subject_digest}',
            path: {
                'org': org,
                'subject_digest': subjectDigest,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * List attestation repositories
     * List repositories owned by the provided organization that have created at least one attested artifact
     * Results will be sorted in ascending order by repository ID
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param before A cursor, as given in the [Link header](https://docs.github.com/rest/guides/using-pagination-in-the-rest-api#using-link-headers). If specified, the query only searches for results before this cursor. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param after A cursor, as given in the [Link header](https://docs.github.com/rest/guides/using-pagination-in-the-rest-api#using-link-headers). If specified, the query only searches for results after this cursor. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param predicateType Optional filter for fetching attestations with a given predicate type.
     * This option accepts `provenance`, `sbom`, `release`, or freeform text
     * for custom predicate types.
     * @returns any Response
     * @throws ApiError
     */
    public static orgsListAttestationRepositories(
        org: string,
        perPage: number = 30,
        before?: string,
        after?: string,
        predicateType?: string,
    ): CancelablePromise<Array<{
        id?: number;
        name?: string;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/attestations/repositories',
            path: {
                'org': org,
            },
            query: {
                'per_page': perPage,
                'before': before,
                'after': after,
                'predicate_type': predicateType,
            },
        });
    }
    /**
     * Delete attestations by ID
     * Delete an artifact attestation by unique ID that is associated with a repository owned by an org.
     * @param org The organization name. The name is not case sensitive.
     * @param attestationId Attestation ID
     * @returns any Response
     * @throws ApiError
     */
    public static orgsDeleteAttestationsById(
        org: string,
        attestationId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/attestations/{attestation_id}',
            path: {
                'org': org,
                'attestation_id': attestationId,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * List attestations
     * List a collection of artifact attestations with a given subject digest that are associated with repositories owned by an organization.
     *
     * The collection of attestations returned by this endpoint is filtered according to the authenticated user's permissions; if the authenticated user cannot read a repository, the attestations associated with that repository will not be included in the response. In addition, when using a fine-grained access token the `attestations:read` permission is required.
     *
     * **Please note:** in order to offer meaningful security benefits, an attestation's signature and timestamps **must** be cryptographically verified, and the identity of the attestation signer **must** be validated. Attestations can be verified using the [GitHub CLI `attestation verify` command](https://cli.github.com/manual/gh_attestation_verify). For more information, see [our guide on how to use artifact attestations to establish a build's provenance](https://docs.github.com/actions/security-guides/using-artifact-attestations-to-establish-provenance-for-builds).
     * @param org The organization name. The name is not case sensitive.
     * @param subjectDigest The parameter should be set to the attestation's subject's SHA256 digest, in the form `sha256:HEX_DIGEST`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param before A cursor, as given in the [Link header](https://docs.github.com/rest/guides/using-pagination-in-the-rest-api#using-link-headers). If specified, the query only searches for results before this cursor. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param after A cursor, as given in the [Link header](https://docs.github.com/rest/guides/using-pagination-in-the-rest-api#using-link-headers). If specified, the query only searches for results after this cursor. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param predicateType Optional filter for fetching attestations with a given predicate type.
     * This option accepts `provenance`, `sbom`, `release`, or freeform text
     * for custom predicate types.
     * @returns any Response
     * @throws ApiError
     */
    public static orgsListAttestations(
        org: string,
        subjectDigest: string,
        perPage: number = 30,
        before?: string,
        after?: string,
        predicateType?: string,
    ): CancelablePromise<{
        attestations?: Array<{
            /**
             * The attestation's Sigstore Bundle.
             * Refer to the [Sigstore Bundle Specification](https://github.com/sigstore/protobuf-specs/blob/main/protos/sigstore_bundle.proto) for more information.
             */
            bundle?: {
                mediaType?: string;
                verificationMaterial?: Record<string, any>;
                dsseEnvelope?: Record<string, any>;
            };
            repository_id?: number;
            bundle_url?: string;
            initiator?: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/attestations/{subject_digest}',
            path: {
                'org': org,
                'subject_digest': subjectDigest,
            },
            query: {
                'per_page': perPage,
                'before': before,
                'after': after,
                'predicate_type': predicateType,
            },
        });
    }
    /**
     * List users blocked by an organization
     * List the users blocked by an organization.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns simple_user Response
     * @throws ApiError
     */
    public static orgsListBlockedUsers(
        org: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<simple_user>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/blocks',
            path: {
                'org': org,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Check if a user is blocked by an organization
     * Returns a 204 if the given user is blocked by the given organization. Returns a 404 if the organization is not blocking the user, or if the user account has been identified as spam by GitHub.
     * @param org The organization name. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @returns void
     * @throws ApiError
     */
    public static orgsCheckBlockedUser(
        org: string,
        username: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/blocks/{username}',
            path: {
                'org': org,
                'username': username,
            },
            errors: {
                404: `If the user is not blocked`,
            },
        });
    }
    /**
     * Block a user from an organization
     * Blocks the given user on behalf of the specified organization and returns a 204. If the organization cannot block the given user a 422 is returned.
     * @param org The organization name. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @returns void
     * @throws ApiError
     */
    public static orgsBlockUser(
        org: string,
        username: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/blocks/{username}',
            path: {
                'org': org,
                'username': username,
            },
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Unblock a user from an organization
     * Unblocks the given user on behalf of the specified organization.
     * @param org The organization name. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @returns void
     * @throws ApiError
     */
    public static orgsUnblockUser(
        org: string,
        username: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/blocks/{username}',
            path: {
                'org': org,
                'username': username,
            },
        });
    }
    /**
     * List failed organization invitations
     * The return hash contains `failed_at` and `failed_reason` fields which represent the time at which the invitation failed and the reason for the failure.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns organization_invitation Response
     * @throws ApiError
     */
    public static orgsListFailedInvitations(
        org: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<organization_invitation>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/failed_invitations',
            path: {
                'org': org,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * List organization webhooks
     * List webhooks for an organization.
     *
     * The authenticated user must be an organization owner to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need `admin:org_hook` scope. OAuth apps cannot list, view, or edit
     * webhooks that they did not create and users cannot list, view, or edit webhooks that were created by OAuth apps.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns org_hook Response
     * @throws ApiError
     */
    public static orgsListWebhooks(
        org: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<org_hook>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/hooks',
            path: {
                'org': org,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Create an organization webhook
     * Create a hook that posts payloads in JSON format.
     *
     * You must be an organization owner to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need `admin:org_hook` scope. OAuth apps cannot list, view, or
     * edit webhooks that they did not create and users cannot list, view, or edit webhooks that were created by OAuth apps.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns org_hook Response
     * @throws ApiError
     */
    public static orgsCreateWebhook(
        org: string,
        requestBody: {
            /**
             * Must be passed as "web".
             */
            name: string;
            /**
             * Key/value pairs to provide settings for this webhook.
             */
            config: {
                url: webhook_config_url;
                content_type?: webhook_config_content_type;
                secret?: webhook_config_secret;
                insecure_ssl?: webhook_config_insecure_ssl;
                username?: string;
                password?: string;
            };
            /**
             * Determines what [events](https://docs.github.com/webhooks/event-payloads) the hook is triggered for. Set to `["*"]` to receive all possible events.
             */
            events?: Array<string>;
            /**
             * Determines if notifications are sent when the webhook is triggered. Set to `true` to send notifications.
             */
            active?: boolean;
        },
    ): CancelablePromise<org_hook> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/hooks',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get an organization webhook
     * Returns a webhook configured in an organization. To get only the webhook
     * `config` properties, see "[Get a webhook configuration for an organization](/rest/orgs/webhooks#get-a-webhook-configuration-for-an-organization).
     *
     * You must be an organization owner to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need `admin:org_hook` scope. OAuth apps cannot list, view, or edit
     * webhooks that they did not create and users cannot list, view, or edit webhooks that were created by OAuth apps.
     * @param org The organization name. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @returns org_hook Response
     * @throws ApiError
     */
    public static orgsGetWebhook(
        org: string,
        hookId: number,
    ): CancelablePromise<org_hook> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/hooks/{hook_id}',
            path: {
                'org': org,
                'hook_id': hookId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Update an organization webhook
     * Updates a webhook configured in an organization. When you update a webhook,
     * the `secret` will be overwritten. If you previously had a `secret` set, you must
     * provide the same `secret` or set a new `secret` or the secret will be removed. If
     * you are only updating individual webhook `config` properties, use "[Update a webhook
     * configuration for an organization](/rest/orgs/webhooks#update-a-webhook-configuration-for-an-organization)".
     *
     * You must be an organization owner to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need `admin:org_hook` scope. OAuth apps cannot list, view, or edit
     * webhooks that they did not create and users cannot list, view, or edit webhooks that were created by OAuth apps.
     * @param org The organization name. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @param requestBody
     * @returns org_hook Response
     * @throws ApiError
     */
    public static orgsUpdateWebhook(
        org: string,
        hookId: number,
        requestBody?: {
            /**
             * Key/value pairs to provide settings for this webhook.
             */
            config?: {
                url: webhook_config_url;
                content_type?: webhook_config_content_type;
                secret?: webhook_config_secret;
                insecure_ssl?: webhook_config_insecure_ssl;
            };
            /**
             * Determines what [events](https://docs.github.com/webhooks/event-payloads) the hook is triggered for.
             */
            events?: Array<string>;
            /**
             * Determines if notifications are sent when the webhook is triggered. Set to `true` to send notifications.
             */
            active?: boolean;
            name?: string;
        },
    ): CancelablePromise<org_hook> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/orgs/{org}/hooks/{hook_id}',
            path: {
                'org': org,
                'hook_id': hookId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Delete an organization webhook
     * Delete a webhook for an organization.
     *
     * The authenticated user must be an organization owner to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need `admin:org_hook` scope. OAuth apps cannot list, view, or edit
     * webhooks that they did not create and users cannot list, view, or edit webhooks that were created by OAuth apps.
     * @param org The organization name. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @returns void
     * @throws ApiError
     */
    public static orgsDeleteWebhook(
        org: string,
        hookId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/hooks/{hook_id}',
            path: {
                'org': org,
                'hook_id': hookId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get a webhook configuration for an organization
     * Returns the webhook configuration for an organization. To get more information about the webhook, including the `active` state and `events`, use "[Get an organization webhook ](/rest/orgs/webhooks#get-an-organization-webhook)."
     *
     * You must be an organization owner to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need `admin:org_hook` scope. OAuth apps cannot list, view, or edit
     * webhooks that they did not create and users cannot list, view, or edit webhooks that were created by OAuth apps.
     * @param org The organization name. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @returns webhook_config Response
     * @throws ApiError
     */
    public static orgsGetWebhookConfigForOrg(
        org: string,
        hookId: number,
    ): CancelablePromise<webhook_config> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/hooks/{hook_id}/config',
            path: {
                'org': org,
                'hook_id': hookId,
            },
        });
    }
    /**
     * Update a webhook configuration for an organization
     * Updates the webhook configuration for an organization. To update more information about the webhook, including the `active` state and `events`, use "[Update an organization webhook ](/rest/orgs/webhooks#update-an-organization-webhook)."
     *
     * You must be an organization owner to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need `admin:org_hook` scope. OAuth apps cannot list, view, or edit
     * webhooks that they did not create and users cannot list, view, or edit webhooks that were created by OAuth apps.
     * @param org The organization name. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @param requestBody
     * @returns webhook_config Response
     * @throws ApiError
     */
    public static orgsUpdateWebhookConfigForOrg(
        org: string,
        hookId: number,
        requestBody?: {
            url?: webhook_config_url;
            content_type?: webhook_config_content_type;
            secret?: webhook_config_secret;
            insecure_ssl?: webhook_config_insecure_ssl;
        },
    ): CancelablePromise<webhook_config> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/orgs/{org}/hooks/{hook_id}/config',
            path: {
                'org': org,
                'hook_id': hookId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List deliveries for an organization webhook
     * Returns a list of webhook deliveries for a webhook configured in an organization.
     *
     * You must be an organization owner to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need `admin:org_hook` scope. OAuth apps cannot list, view, or edit
     * webhooks that they did not create and users cannot list, view, or edit webhooks that were created by OAuth apps.
     * @param org The organization name. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param cursor Used for pagination: the starting delivery from which the page of deliveries is fetched. Refer to the `link` header for the next and previous page cursors.
     * @returns hook_delivery_item Response
     * @throws ApiError
     */
    public static orgsListWebhookDeliveries(
        org: string,
        hookId: number,
        perPage: number = 30,
        cursor?: string,
    ): CancelablePromise<Array<hook_delivery_item>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/hooks/{hook_id}/deliveries',
            path: {
                'org': org,
                'hook_id': hookId,
            },
            query: {
                'per_page': perPage,
                'cursor': cursor,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get a webhook delivery for an organization webhook
     * Returns a delivery for a webhook configured in an organization.
     *
     * You must be an organization owner to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need `admin:org_hook` scope. OAuth apps cannot list, view, or edit
     * webhooks that they did not create and users cannot list, view, or edit webhooks that were created by OAuth apps.
     * @param org The organization name. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @param deliveryId
     * @returns hook_delivery Response
     * @throws ApiError
     */
    public static orgsGetWebhookDelivery(
        org: string,
        hookId: number,
        deliveryId: number,
    ): CancelablePromise<hook_delivery> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}',
            path: {
                'org': org,
                'hook_id': hookId,
                'delivery_id': deliveryId,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Redeliver a delivery for an organization webhook
     * Redeliver a delivery for a webhook configured in an organization.
     *
     * You must be an organization owner to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need `admin:org_hook` scope. OAuth apps cannot list, view, or edit
     * webhooks that they did not create and users cannot list, view, or edit webhooks that were created by OAuth apps.
     * @param org The organization name. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @param deliveryId
     * @returns any Accepted
     * @throws ApiError
     */
    public static orgsRedeliverWebhookDelivery(
        org: string,
        hookId: number,
        deliveryId: number,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts',
            path: {
                'org': org,
                'hook_id': hookId,
                'delivery_id': deliveryId,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Ping an organization webhook
     * This will trigger a [ping event](https://docs.github.com/webhooks/#ping-event)
     * to be sent to the hook.
     *
     * You must be an organization owner to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need `admin:org_hook` scope. OAuth apps cannot list, view, or edit
     * webhooks that they did not create and users cannot list, view, or edit webhooks that were created by OAuth apps.
     * @param org The organization name. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @returns void
     * @throws ApiError
     */
    public static orgsPingWebhook(
        org: string,
        hookId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/hooks/{hook_id}/pings',
            path: {
                'org': org,
                'hook_id': hookId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get route stats by actor
     * Get API request count statistics for an actor broken down by route within a specified time frame.
     * @param org The organization name. The name is not case sensitive.
     * @param actorType The type of the actor
     * @param actorId The ID of the actor
     * @param minTimestamp The minimum timestamp to query for stats. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param maxTimestamp The maximum timestamp to query for stats. Defaults to the time 30 days ago. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param direction The direction to sort the results by.
     * @param sort The property to sort the results by.
     * @param apiRouteSubstring Providing a substring will filter results where the API route contains the substring. This is a case-insensitive search.
     * @returns api_insights_route_stats Response
     * @throws ApiError
     */
    public static apiInsightsGetRouteStatsByActor(
        org: string,
        actorType: 'installation' | 'classic_pat' | 'fine_grained_pat' | 'oauth_app' | 'github_app_user_to_server',
        actorId: number,
        minTimestamp: string,
        maxTimestamp?: string,
        page: number = 1,
        perPage: number = 30,
        direction: 'asc' | 'desc' = 'desc',
        sort?: Array<'last_rate_limited_timestamp' | 'last_request_timestamp' | 'rate_limited_request_count' | 'http_method' | 'api_route' | 'total_request_count'>,
        apiRouteSubstring?: string,
    ): CancelablePromise<api_insights_route_stats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/insights/api/route-stats/{actor_type}/{actor_id}',
            path: {
                'org': org,
                'actor_type': actorType,
                'actor_id': actorId,
            },
            query: {
                'min_timestamp': minTimestamp,
                'max_timestamp': maxTimestamp,
                'page': page,
                'per_page': perPage,
                'direction': direction,
                'sort': sort,
                'api_route_substring': apiRouteSubstring,
            },
        });
    }
    /**
     * Get subject stats
     * Get API request statistics for all subjects within an organization within a specified time frame. Subjects can be users or GitHub Apps.
     * @param org The organization name. The name is not case sensitive.
     * @param minTimestamp The minimum timestamp to query for stats. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param maxTimestamp The maximum timestamp to query for stats. Defaults to the time 30 days ago. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param direction The direction to sort the results by.
     * @param sort The property to sort the results by.
     * @param subjectNameSubstring Providing a substring will filter results where the subject name contains the substring. This is a case-insensitive search.
     * @returns api_insights_subject_stats Response
     * @throws ApiError
     */
    public static apiInsightsGetSubjectStats(
        org: string,
        minTimestamp: string,
        maxTimestamp?: string,
        page: number = 1,
        perPage: number = 30,
        direction: 'asc' | 'desc' = 'desc',
        sort?: Array<'last_rate_limited_timestamp' | 'last_request_timestamp' | 'rate_limited_request_count' | 'subject_name' | 'total_request_count'>,
        subjectNameSubstring?: string,
    ): CancelablePromise<api_insights_subject_stats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/insights/api/subject-stats',
            path: {
                'org': org,
            },
            query: {
                'min_timestamp': minTimestamp,
                'max_timestamp': maxTimestamp,
                'page': page,
                'per_page': perPage,
                'direction': direction,
                'sort': sort,
                'subject_name_substring': subjectNameSubstring,
            },
        });
    }
    /**
     * Get summary stats
     * Get overall statistics of API requests made within an organization by all users and apps within a specified time frame.
     * @param org The organization name. The name is not case sensitive.
     * @param minTimestamp The minimum timestamp to query for stats. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param maxTimestamp The maximum timestamp to query for stats. Defaults to the time 30 days ago. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @returns api_insights_summary_stats Response
     * @throws ApiError
     */
    public static apiInsightsGetSummaryStats(
        org: string,
        minTimestamp: string,
        maxTimestamp?: string,
    ): CancelablePromise<api_insights_summary_stats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/insights/api/summary-stats',
            path: {
                'org': org,
            },
            query: {
                'min_timestamp': minTimestamp,
                'max_timestamp': maxTimestamp,
            },
        });
    }
    /**
     * Get summary stats by user
     * Get overall statistics of API requests within the organization for a user.
     * @param org The organization name. The name is not case sensitive.
     * @param userId The ID of the user to query for stats
     * @param minTimestamp The minimum timestamp to query for stats. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param maxTimestamp The maximum timestamp to query for stats. Defaults to the time 30 days ago. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @returns api_insights_summary_stats Response
     * @throws ApiError
     */
    public static apiInsightsGetSummaryStatsByUser(
        org: string,
        userId: string,
        minTimestamp: string,
        maxTimestamp?: string,
    ): CancelablePromise<api_insights_summary_stats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/insights/api/summary-stats/users/{user_id}',
            path: {
                'org': org,
                'user_id': userId,
            },
            query: {
                'min_timestamp': minTimestamp,
                'max_timestamp': maxTimestamp,
            },
        });
    }
    /**
     * Get summary stats by actor
     * Get overall statistics of API requests within the organization made by a specific actor. Actors can be GitHub App installations, OAuth apps or other tokens on behalf of a user.
     * @param org The organization name. The name is not case sensitive.
     * @param minTimestamp The minimum timestamp to query for stats. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param actorType The type of the actor
     * @param actorId The ID of the actor
     * @param maxTimestamp The maximum timestamp to query for stats. Defaults to the time 30 days ago. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @returns api_insights_summary_stats Response
     * @throws ApiError
     */
    public static apiInsightsGetSummaryStatsByActor(
        org: string,
        minTimestamp: string,
        actorType: 'installation' | 'classic_pat' | 'fine_grained_pat' | 'oauth_app' | 'github_app_user_to_server',
        actorId: number,
        maxTimestamp?: string,
    ): CancelablePromise<api_insights_summary_stats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/insights/api/summary-stats/{actor_type}/{actor_id}',
            path: {
                'org': org,
                'actor_type': actorType,
                'actor_id': actorId,
            },
            query: {
                'min_timestamp': minTimestamp,
                'max_timestamp': maxTimestamp,
            },
        });
    }
    /**
     * Get time stats
     * Get the number of API requests and rate-limited requests made within an organization over a specified time period.
     * @param org The organization name. The name is not case sensitive.
     * @param minTimestamp The minimum timestamp to query for stats. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param timestampIncrement The increment of time used to breakdown the query results (5m, 10m, 1h, etc.)
     * @param maxTimestamp The maximum timestamp to query for stats. Defaults to the time 30 days ago. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @returns api_insights_time_stats Response
     * @throws ApiError
     */
    public static apiInsightsGetTimeStats(
        org: string,
        minTimestamp: string,
        timestampIncrement: string,
        maxTimestamp?: string,
    ): CancelablePromise<api_insights_time_stats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/insights/api/time-stats',
            path: {
                'org': org,
            },
            query: {
                'min_timestamp': minTimestamp,
                'max_timestamp': maxTimestamp,
                'timestamp_increment': timestampIncrement,
            },
        });
    }
    /**
     * Get time stats by user
     * Get the number of API requests and rate-limited requests made within an organization by a specific user over a specified time period.
     * @param org The organization name. The name is not case sensitive.
     * @param userId The ID of the user to query for stats
     * @param minTimestamp The minimum timestamp to query for stats. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param timestampIncrement The increment of time used to breakdown the query results (5m, 10m, 1h, etc.)
     * @param maxTimestamp The maximum timestamp to query for stats. Defaults to the time 30 days ago. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @returns api_insights_time_stats Response
     * @throws ApiError
     */
    public static apiInsightsGetTimeStatsByUser(
        org: string,
        userId: string,
        minTimestamp: string,
        timestampIncrement: string,
        maxTimestamp?: string,
    ): CancelablePromise<api_insights_time_stats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/insights/api/time-stats/users/{user_id}',
            path: {
                'org': org,
                'user_id': userId,
            },
            query: {
                'min_timestamp': minTimestamp,
                'max_timestamp': maxTimestamp,
                'timestamp_increment': timestampIncrement,
            },
        });
    }
    /**
     * Get time stats by actor
     * Get the number of API requests and rate-limited requests made within an organization by a specific actor within a specified time period.
     * @param org The organization name. The name is not case sensitive.
     * @param actorType The type of the actor
     * @param actorId The ID of the actor
     * @param minTimestamp The minimum timestamp to query for stats. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param timestampIncrement The increment of time used to breakdown the query results (5m, 10m, 1h, etc.)
     * @param maxTimestamp The maximum timestamp to query for stats. Defaults to the time 30 days ago. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @returns api_insights_time_stats Response
     * @throws ApiError
     */
    public static apiInsightsGetTimeStatsByActor(
        org: string,
        actorType: 'installation' | 'classic_pat' | 'fine_grained_pat' | 'oauth_app' | 'github_app_user_to_server',
        actorId: number,
        minTimestamp: string,
        timestampIncrement: string,
        maxTimestamp?: string,
    ): CancelablePromise<api_insights_time_stats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/insights/api/time-stats/{actor_type}/{actor_id}',
            path: {
                'org': org,
                'actor_type': actorType,
                'actor_id': actorId,
            },
            query: {
                'min_timestamp': minTimestamp,
                'max_timestamp': maxTimestamp,
                'timestamp_increment': timestampIncrement,
            },
        });
    }
    /**
     * Get user stats
     * Get API usage statistics within an organization for a user broken down by the type of access.
     * @param org The organization name. The name is not case sensitive.
     * @param userId The ID of the user to query for stats
     * @param minTimestamp The minimum timestamp to query for stats. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param maxTimestamp The maximum timestamp to query for stats. Defaults to the time 30 days ago. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param direction The direction to sort the results by.
     * @param sort The property to sort the results by.
     * @param actorNameSubstring Providing a substring will filter results where the actor name contains the substring. This is a case-insensitive search.
     * @returns api_insights_user_stats Response
     * @throws ApiError
     */
    public static apiInsightsGetUserStats(
        org: string,
        userId: string,
        minTimestamp: string,
        maxTimestamp?: string,
        page: number = 1,
        perPage: number = 30,
        direction: 'asc' | 'desc' = 'desc',
        sort?: Array<'last_rate_limited_timestamp' | 'last_request_timestamp' | 'rate_limited_request_count' | 'subject_name' | 'total_request_count'>,
        actorNameSubstring?: string,
    ): CancelablePromise<api_insights_user_stats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/insights/api/user-stats/{user_id}',
            path: {
                'org': org,
                'user_id': userId,
            },
            query: {
                'min_timestamp': minTimestamp,
                'max_timestamp': maxTimestamp,
                'page': page,
                'per_page': perPage,
                'direction': direction,
                'sort': sort,
                'actor_name_substring': actorNameSubstring,
            },
        });
    }
    /**
     * List app installations for an organization
     * Lists all GitHub Apps in an organization. The installation count includes
     * all GitHub Apps installed on repositories in the organization.
     *
     * The authenticated user must be an organization owner to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:read` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static orgsListAppInstallations(
        org: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        installations: Array<installation>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/installations',
            path: {
                'org': org,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * List pending organization invitations
     * The return hash contains a `role` field which refers to the Organization
     * Invitation role and will be one of the following values: `direct_member`, `admin`,
     * `billing_manager`, or `hiring_manager`. If the invitee is not a GitHub
     * member, the `login` field in the return hash will be `null`.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param role Filter invitations by their member role.
     * @param invitationSource Filter invitations by their invitation source.
     * @returns organization_invitation Response
     * @throws ApiError
     */
    public static orgsListPendingInvitations(
        org: string,
        perPage: number = 30,
        page: number = 1,
        role: 'all' | 'admin' | 'direct_member' | 'billing_manager' | 'hiring_manager' = 'all',
        invitationSource: 'all' | 'member' | 'scim' = 'all',
    ): CancelablePromise<Array<organization_invitation>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/invitations',
            path: {
                'org': org,
            },
            query: {
                'per_page': perPage,
                'page': page,
                'role': role,
                'invitation_source': invitationSource,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Create an organization invitation
     * Invite people to an organization by using their GitHub user ID or their email address. In order to create invitations in an organization, the authenticated user must be an organization owner.
     *
     * This endpoint triggers [notifications](https://docs.github.com/github/managing-subscriptions-and-notifications-on-github/about-notifications). Creating content too quickly using this endpoint may result in secondary rate limiting. For more information, see "[Rate limits for the API](https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api#about-secondary-rate-limits)"
     * and "[Best practices for using the REST API](https://docs.github.com/rest/guides/best-practices-for-using-the-rest-api)."
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns organization_invitation Response
     * @throws ApiError
     */
    public static orgsCreateInvitation(
        org: string,
        requestBody?: {
            /**
             * **Required unless you provide `email`**. GitHub user ID for the person you are inviting.
             */
            invitee_id?: number;
            /**
             * **Required unless you provide `invitee_id`**. Email address of the person you are inviting, which can be an existing GitHub user.
             */
            email?: string;
            /**
             * The role for the new member.
             * * `admin` - Organization owners with full administrative rights to the organization and complete access to all repositories and teams.
             * * `direct_member` - Non-owner organization members with ability to see other members and join teams by invitation.
             * * `billing_manager` - Non-owner organization members with ability to manage the billing settings of your organization.
             * * `reinstate` - The previous role assigned to the invitee before they were removed from your organization. Can be one of the roles listed above. Only works if the invitee was previously part of your organization.
             */
            role?: 'admin' | 'direct_member' | 'billing_manager' | 'reinstate';
            /**
             * Specify IDs for the teams you want to invite new members to.
             */
            team_ids?: Array<number>;
        },
    ): CancelablePromise<organization_invitation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/invitations',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Cancel an organization invitation
     * Cancel an organization invitation. In order to cancel an organization invitation, the authenticated user must be an organization owner.
     *
     * This endpoint triggers [notifications](https://docs.github.com/github/managing-subscriptions-and-notifications-on-github/about-notifications).
     * @param org The organization name. The name is not case sensitive.
     * @param invitationId The unique identifier of the invitation.
     * @returns void
     * @throws ApiError
     */
    public static orgsCancelInvitation(
        org: string,
        invitationId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/invitations/{invitation_id}',
            path: {
                'org': org,
                'invitation_id': invitationId,
            },
            errors: {
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List organization invitation teams
     * List all teams associated with an invitation. In order to see invitations in an organization, the authenticated user must be an organization owner.
     * @param org The organization name. The name is not case sensitive.
     * @param invitationId The unique identifier of the invitation.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns team Response
     * @throws ApiError
     */
    public static orgsListInvitationTeams(
        org: string,
        invitationId: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<team>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/invitations/{invitation_id}/teams',
            path: {
                'org': org,
                'invitation_id': invitationId,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * List issue types for an organization
     * Lists all issue types for an organization. OAuth app tokens and personal access tokens (classic) need the read:org scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @returns issue_type Response
     * @throws ApiError
     */
    public static orgsListIssueTypes(
        org: string,
    ): CancelablePromise<Array<issue_type>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/issue-types',
            path: {
                'org': org,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Create issue type for an organization
     * Create a new issue type for an organization.
     *
     * You can find out more about issue types in [Managing issue types in an organization](https://docs.github.com/issues/tracking-your-work-with-issues/configuring-issues/managing-issue-types-in-an-organization).
     *
     * To use this endpoint, the authenticated user must be an administrator for the organization. OAuth app tokens and
     * personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns issue_type Response
     * @throws ApiError
     */
    public static orgsCreateIssueType(
        org: string,
        requestBody: organization_create_issue_type,
    ): CancelablePromise<issue_type> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/issue-types',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Update issue type for an organization
     * Updates an issue type for an organization.
     *
     * You can find out more about issue types in [Managing issue types in an organization](https://docs.github.com/issues/tracking-your-work-with-issues/configuring-issues/managing-issue-types-in-an-organization).
     *
     * To use this endpoint, the authenticated user must be an administrator for the organization. OAuth app tokens and
     * personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param issueTypeId The unique identifier of the issue type.
     * @param requestBody
     * @returns issue_type Response
     * @throws ApiError
     */
    public static orgsUpdateIssueType(
        org: string,
        issueTypeId: number,
        requestBody: organization_update_issue_type,
    ): CancelablePromise<issue_type> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/issue-types/{issue_type_id}',
            path: {
                'org': org,
                'issue_type_id': issueTypeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Delete issue type for an organization
     * Deletes an issue type for an organization.
     *
     * You can find out more about issue types in [Managing issue types in an organization](https://docs.github.com/issues/tracking-your-work-with-issues/configuring-issues/managing-issue-types-in-an-organization).
     *
     * To use this endpoint, the authenticated user must be an administrator for the organization. OAuth app tokens and
     * personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param issueTypeId The unique identifier of the issue type.
     * @returns void
     * @throws ApiError
     */
    public static orgsDeleteIssueType(
        org: string,
        issueTypeId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/issue-types/{issue_type_id}',
            path: {
                'org': org,
                'issue_type_id': issueTypeId,
            },
            errors: {
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List organization members
     * List all users who are members of an organization. If the authenticated user is also a member of this organization then both concealed and public members will be returned.
     * @param org The organization name. The name is not case sensitive.
     * @param filter Filter members returned in the list. `2fa_disabled` means that only members without [two-factor authentication](https://github.com/blog/1614-two-factor-authentication) enabled will be returned. `2fa_insecure` means that only members with [insecure 2FA methods](https://docs.github.com/organizations/keeping-your-organization-secure/managing-two-factor-authentication-for-your-organization/requiring-two-factor-authentication-in-your-organization#requiring-secure-methods-of-two-factor-authentication-in-your-organization) will be returned. These options are only available for organization owners.
     * @param role Filter members returned by their role.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns simple_user Response
     * @throws ApiError
     */
    public static orgsListMembers(
        org: string,
        filter: '2fa_disabled' | '2fa_insecure' | 'all' = 'all',
        role: 'all' | 'admin' | 'member' = 'all',
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<simple_user>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/members',
            path: {
                'org': org,
            },
            query: {
                'filter': filter,
                'role': role,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Check organization membership for a user
     * Check if a user is, publicly or privately, a member of the organization.
     * @param org The organization name. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @returns void
     * @throws ApiError
     */
    public static orgsCheckMembershipForUser(
        org: string,
        username: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/members/{username}',
            path: {
                'org': org,
                'username': username,
            },
            errors: {
                302: `Response if requester is not an organization member`,
                404: `Not Found if requester is an organization member and user is not a member`,
            },
        });
    }
    /**
     * Remove an organization member
     * Removing a user from this list will remove them from all teams and they will no longer have any access to the organization's repositories.
     *
     * > [!NOTE]
     * > If a user has both direct membership in the organization as well as indirect membership via an enterprise team, only their direct membership will be removed. Their indirect membership via an enterprise team remains until the user is removed from the enterprise team.
     * @param org The organization name. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @returns void
     * @throws ApiError
     */
    public static orgsRemoveMember(
        org: string,
        username: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/members/{username}',
            path: {
                'org': org,
                'username': username,
            },
            errors: {
                403: `Forbidden`,
            },
        });
    }
    /**
     * Get organization membership for a user
     * In order to get a user's membership with an organization, the authenticated user must be an organization member. The `state` parameter in the response can be used to identify the user's membership status.
     * @param org The organization name. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @returns org_membership Response
     * @throws ApiError
     */
    public static orgsGetMembershipForUser(
        org: string,
        username: string,
    ): CancelablePromise<org_membership> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/memberships/{username}',
            path: {
                'org': org,
                'username': username,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Set organization membership for a user
     * Only authenticated organization owners can add a member to the organization or update the member's role.
     *
     * *   If the authenticated user is _adding_ a member to the organization, the invited user will receive an email inviting them to the organization. The user's [membership status](https://docs.github.com/rest/orgs/members#get-organization-membership-for-a-user) will be `pending` until they accept the invitation.
     *
     * *   Authenticated users can _update_ a user's membership by passing the `role` parameter. If the authenticated user changes a member's role to `admin`, the affected user will receive an email notifying them that they've been made an organization owner. If the authenticated user changes an owner's role to `member`, no email will be sent.
     *
     * **Rate limits**
     *
     * To prevent abuse, organization owners are limited to creating 50 organization invitations for an organization within a 24 hour period. If the organization is more than one month old or on a paid plan, the limit is 500 invitations per 24 hour period.
     * @param org The organization name. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @param requestBody
     * @returns org_membership Response
     * @throws ApiError
     */
    public static orgsSetMembershipForUser(
        org: string,
        username: string,
        requestBody?: {
            /**
             * The role to give the user in the organization. Can be one of:
             * * `admin` - The user will become an owner of the organization.
             * * `member` - The user will become a non-owner member of the organization.
             */
            role?: 'admin' | 'member';
        },
    ): CancelablePromise<org_membership> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/memberships/{username}',
            path: {
                'org': org,
                'username': username,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Remove organization membership for a user
     * In order to remove a user's membership with an organization, the authenticated user must be an organization owner.
     *
     * If the specified user is an active member of the organization, this will remove them from the organization. If the specified user has been invited to the organization, this will cancel their invitation. The specified user will receive an email notification in both cases.
     *
     * > [!NOTE]
     * > If a user has both direct membership in the organization as well as indirect membership via an enterprise team, only their direct membership will be removed. Their indirect membership via an enterprise team remains until the user is removed from the enterprise team.
     * @param org The organization name. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @returns void
     * @throws ApiError
     */
    public static orgsRemoveMembershipForUser(
        org: string,
        username: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/memberships/{username}',
            path: {
                'org': org,
                'username': username,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get all organization roles for an organization
     * Lists the organization roles available in this organization. For more information on organization roles, see "[Using organization roles](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/using-organization-roles)."
     *
     * To use this endpoint, the authenticated user must be one of:
     *
     * - An administrator for the organization.
     * - A user, or a user on a team, with the fine-grained permissions of `read_organization_custom_org_role` in the organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @returns any Response - list of organization roles
     * @throws ApiError
     */
    public static orgsListOrgRoles(
        org: string,
    ): CancelablePromise<{
        /**
         * The total number of organization roles available to the organization.
         */
        total_count?: number;
        /**
         * The list of organization roles available to the organization.
         */
        roles?: Array<organization_role>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/organization-roles',
            path: {
                'org': org,
            },
            errors: {
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Remove all organization roles for a team
     * Removes all assigned organization roles from a team. For more information on organization roles, see "[Using organization roles](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/using-organization-roles)."
     *
     * The authenticated user must be an administrator for the organization to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param teamSlug The slug of the team name.
     * @returns void
     * @throws ApiError
     */
    public static orgsRevokeAllOrgRolesTeam(
        org: string,
        teamSlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/organization-roles/teams/{team_slug}',
            path: {
                'org': org,
                'team_slug': teamSlug,
            },
        });
    }
    /**
     * Assign an organization role to a team
     * Assigns an organization role to a team in an organization. For more information on organization roles, see "[Using organization roles](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/using-organization-roles)."
     *
     * The authenticated user must be an administrator for the organization to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param teamSlug The slug of the team name.
     * @param roleId The unique identifier of the role.
     * @returns void
     * @throws ApiError
     */
    public static orgsAssignTeamToOrgRole(
        org: string,
        teamSlug: string,
        roleId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/organization-roles/teams/{team_slug}/{role_id}',
            path: {
                'org': org,
                'team_slug': teamSlug,
                'role_id': roleId,
            },
            errors: {
                404: `Response if the organization, team or role does not exist.`,
                422: `Response if the organization roles feature is not enabled for the organization, or validation failed.`,
            },
        });
    }
    /**
     * Remove an organization role from a team
     * Removes an organization role from a team. For more information on organization roles, see "[Using organization roles](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/using-organization-roles)."
     *
     * The authenticated user must be an administrator for the organization to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param teamSlug The slug of the team name.
     * @param roleId The unique identifier of the role.
     * @returns void
     * @throws ApiError
     */
    public static orgsRevokeOrgRoleTeam(
        org: string,
        teamSlug: string,
        roleId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/organization-roles/teams/{team_slug}/{role_id}',
            path: {
                'org': org,
                'team_slug': teamSlug,
                'role_id': roleId,
            },
        });
    }
    /**
     * Remove all organization roles for a user
     * Revokes all assigned organization roles from a user. For more information on organization roles, see "[Using organization roles](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/using-organization-roles)."
     *
     * The authenticated user must be an administrator for the organization to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @returns void
     * @throws ApiError
     */
    public static orgsRevokeAllOrgRolesUser(
        org: string,
        username: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/organization-roles/users/{username}',
            path: {
                'org': org,
                'username': username,
            },
        });
    }
    /**
     * Assign an organization role to a user
     * Assigns an organization role to a member of an organization. For more information on organization roles, see "[Using organization roles](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/using-organization-roles)."
     *
     * The authenticated user must be an administrator for the organization to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @param roleId The unique identifier of the role.
     * @returns void
     * @throws ApiError
     */
    public static orgsAssignUserToOrgRole(
        org: string,
        username: string,
        roleId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/organization-roles/users/{username}/{role_id}',
            path: {
                'org': org,
                'username': username,
                'role_id': roleId,
            },
            errors: {
                404: `Response if the organization, user or role does not exist.`,
                422: `Response if the organization roles feature is not enabled enabled for the organization, the validation failed, or the user is not an organization member.`,
            },
        });
    }
    /**
     * Remove an organization role from a user
     * Remove an organization role from a user. For more information on organization roles, see "[Using organization roles](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/using-organization-roles)."
     *
     * The authenticated user must be an administrator for the organization to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @param roleId The unique identifier of the role.
     * @returns void
     * @throws ApiError
     */
    public static orgsRevokeOrgRoleUser(
        org: string,
        username: string,
        roleId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/organization-roles/users/{username}/{role_id}',
            path: {
                'org': org,
                'username': username,
                'role_id': roleId,
            },
        });
    }
    /**
     * Get an organization role
     * Gets an organization role that is available to this organization. For more information on organization roles, see "[Using organization roles](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/using-organization-roles)."
     *
     * To use this endpoint, the authenticated user must be one of:
     *
     * - An administrator for the organization.
     * - A user, or a user on a team, with the fine-grained permissions of `read_organization_custom_org_role` in the organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param roleId The unique identifier of the role.
     * @returns organization_role Response
     * @throws ApiError
     */
    public static orgsGetOrgRole(
        org: string,
        roleId: number,
    ): CancelablePromise<organization_role> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/organization-roles/{role_id}',
            path: {
                'org': org,
                'role_id': roleId,
            },
            errors: {
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List teams that are assigned to an organization role
     * Lists the teams that are assigned to an organization role. For more information on organization roles, see "[Using organization roles](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/using-organization-roles)."
     *
     * To use this endpoint, you must be an administrator for the organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param roleId The unique identifier of the role.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns team_role_assignment Response - List of assigned teams
     * @throws ApiError
     */
    public static orgsListOrgRoleTeams(
        org: string,
        roleId: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<team_role_assignment>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/organization-roles/{role_id}/teams',
            path: {
                'org': org,
                'role_id': roleId,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Response if the organization or role does not exist.`,
                422: `Response if the organization roles feature is not enabled or validation failed.`,
            },
        });
    }
    /**
     * List users that are assigned to an organization role
     * Lists organization members that are assigned to an organization role. For more information on organization roles, see "[Using organization roles](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/using-organization-roles)."
     *
     * To use this endpoint, you must be an administrator for the organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param roleId The unique identifier of the role.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns user_role_assignment Response - List of assigned users
     * @throws ApiError
     */
    public static orgsListOrgRoleUsers(
        org: string,
        roleId: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<user_role_assignment>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/organization-roles/{role_id}/users',
            path: {
                'org': org,
                'role_id': roleId,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Response if the organization or role does not exist.`,
                422: `Response if the organization roles feature is not enabled or validation failed.`,
            },
        });
    }
    /**
     * List outside collaborators for an organization
     * List all users who are outside collaborators of an organization.
     * @param org The organization name. The name is not case sensitive.
     * @param filter Filter the list of outside collaborators. `2fa_disabled` means that only outside collaborators without [two-factor authentication](https://github.com/blog/1614-two-factor-authentication) enabled will be returned. `2fa_insecure` means that only outside collaborators with [insecure 2FA methods](https://docs.github.com/organizations/keeping-your-organization-secure/managing-two-factor-authentication-for-your-organization/requiring-two-factor-authentication-in-your-organization#requiring-secure-methods-of-two-factor-authentication-in-your-organization) will be returned.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns simple_user Response
     * @throws ApiError
     */
    public static orgsListOutsideCollaborators(
        org: string,
        filter: '2fa_disabled' | '2fa_insecure' | 'all' = 'all',
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<simple_user>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/outside_collaborators',
            path: {
                'org': org,
            },
            query: {
                'filter': filter,
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Convert an organization member to outside collaborator
     * When an organization member is converted to an outside collaborator, they'll only have access to the repositories that their current team membership allows. The user will no longer be a member of the organization. For more information, see "[Converting an organization member to an outside collaborator](https://docs.github.com/articles/converting-an-organization-member-to-an-outside-collaborator/)". Converting an organization member to an outside collaborator may be restricted by enterprise administrators. For more information, see "[Enforcing repository management policies in your enterprise](https://docs.github.com/admin/policies/enforcing-policies-for-your-enterprise/enforcing-repository-management-policies-in-your-enterprise#enforcing-a-policy-for-inviting-outside-collaborators-to-repositories)."
     * @param org The organization name. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @param requestBody
     * @returns any User is getting converted asynchronously
     * @throws ApiError
     */
    public static orgsConvertMemberToOutsideCollaborator(
        org: string,
        username: string,
        requestBody?: {
            /**
             * When set to `true`, the request will be performed asynchronously. Returns a 202 status code when the job is successfully queued.
             */
            async?: boolean;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/outside_collaborators/{username}',
            path: {
                'org': org,
                'username': username,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden if user is the last owner of the organization, not a member of the organization, or if the enterprise enforces a policy for inviting outside collaborators. For more information, see "[Enforcing repository management policies in your enterprise](https://docs.github.com/admin/policies/enforcing-policies-for-your-enterprise/enforcing-repository-management-policies-in-your-enterprise#enforcing-a-policy-for-inviting-outside-collaborators-to-repositories)."`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Remove outside collaborator from an organization
     * Removing a user from this list will remove them from all the organization's repositories.
     * @param org The organization name. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @returns void
     * @throws ApiError
     */
    public static orgsRemoveOutsideCollaborator(
        org: string,
        username: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/outside_collaborators/{username}',
            path: {
                'org': org,
                'username': username,
            },
            errors: {
                422: `Unprocessable Entity if user is a member of the organization`,
            },
        });
    }
    /**
     * List requests to access organization resources with fine-grained personal access tokens
     * Lists requests from organization members to access organization resources with a fine-grained personal access token.
     *
     * Only GitHub Apps can use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param sort The property by which to sort the results.
     * @param direction The direction to sort the results by.
     * @param owner A list of owner usernames to use to filter the results.
     * @param repository The name of the repository to use to filter the results.
     * @param permission The permission to use to filter the results.
     * @param lastUsedBefore Only show fine-grained personal access tokens used before the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param lastUsedAfter Only show fine-grained personal access tokens used after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param tokenId The ID of the token
     * @returns organization_programmatic_access_grant_request Response
     * @throws ApiError
     */
    public static orgsListPatGrantRequests(
        org: string,
        perPage: number = 30,
        page: number = 1,
        sort: 'created_at' = 'created_at',
        direction: 'asc' | 'desc' = 'desc',
        owner?: Array<string>,
        repository?: string,
        permission?: string,
        lastUsedBefore?: string,
        lastUsedAfter?: string,
        tokenId?: Array<string>,
    ): CancelablePromise<Array<organization_programmatic_access_grant_request>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/personal-access-token-requests',
            path: {
                'org': org,
            },
            query: {
                'per_page': perPage,
                'page': page,
                'sort': sort,
                'direction': direction,
                'owner': owner,
                'repository': repository,
                'permission': permission,
                'last_used_before': lastUsedBefore,
                'last_used_after': lastUsedAfter,
                'token_id': tokenId,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * Review requests to access organization resources with fine-grained personal access tokens
     * Approves or denies multiple pending requests to access organization resources via a fine-grained personal access token.
     *
     * Only GitHub Apps can use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns any Accepted
     * @throws ApiError
     */
    public static orgsReviewPatGrantRequestsInBulk(
        org: string,
        requestBody: {
            /**
             * Unique identifiers of the requests for access via fine-grained personal access token. Must be formed of between 1 and 100 `pat_request_id` values.
             */
            pat_request_ids?: Array<number>;
            /**
             * Action to apply to the requests.
             */
            action: 'approve' | 'deny';
            /**
             * Reason for approving or denying the requests. Max 1024 characters.
             */
            reason?: string | null;
        },
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/personal-access-token-requests',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * Review a request to access organization resources with a fine-grained personal access token
     * Approves or denies a pending request to access organization resources via a fine-grained personal access token.
     *
     * Only GitHub Apps can use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param patRequestId Unique identifier of the request for access via fine-grained personal access token.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static orgsReviewPatGrantRequest(
        org: string,
        patRequestId: number,
        requestBody: {
            /**
             * Action to apply to the request.
             */
            action: 'approve' | 'deny';
            /**
             * Reason for approving or denying the request. Max 1024 characters.
             */
            reason?: string | null;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/personal-access-token-requests/{pat_request_id}',
            path: {
                'org': org,
                'pat_request_id': patRequestId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * List repositories requested to be accessed by a fine-grained personal access token
     * Lists the repositories a fine-grained personal access token request is requesting access to.
     *
     * Only GitHub Apps can use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param patRequestId Unique identifier of the request for access via fine-grained personal access token.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns minimal_repository Response
     * @throws ApiError
     */
    public static orgsListPatGrantRequestRepositories(
        org: string,
        patRequestId: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<minimal_repository>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories',
            path: {
                'org': org,
                'pat_request_id': patRequestId,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * List fine-grained personal access tokens with access to organization resources
     * Lists approved fine-grained personal access tokens owned by organization members that can access organization resources.
     *
     * Only GitHub Apps can use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param sort The property by which to sort the results.
     * @param direction The direction to sort the results by.
     * @param owner A list of owner usernames to use to filter the results.
     * @param repository The name of the repository to use to filter the results.
     * @param permission The permission to use to filter the results.
     * @param lastUsedBefore Only show fine-grained personal access tokens used before the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param lastUsedAfter Only show fine-grained personal access tokens used after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param tokenId The ID of the token
     * @returns organization_programmatic_access_grant Response
     * @throws ApiError
     */
    public static orgsListPatGrants(
        org: string,
        perPage: number = 30,
        page: number = 1,
        sort: 'created_at' = 'created_at',
        direction: 'asc' | 'desc' = 'desc',
        owner?: Array<string>,
        repository?: string,
        permission?: string,
        lastUsedBefore?: string,
        lastUsedAfter?: string,
        tokenId?: Array<string>,
    ): CancelablePromise<Array<organization_programmatic_access_grant>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/personal-access-tokens',
            path: {
                'org': org,
            },
            query: {
                'per_page': perPage,
                'page': page,
                'sort': sort,
                'direction': direction,
                'owner': owner,
                'repository': repository,
                'permission': permission,
                'last_used_before': lastUsedBefore,
                'last_used_after': lastUsedAfter,
                'token_id': tokenId,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * Update the access to organization resources via fine-grained personal access tokens
     * Updates the access organization members have to organization resources via fine-grained personal access tokens. Limited to revoking a token's existing access.
     *
     * Only GitHub Apps can use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns any Accepted
     * @throws ApiError
     */
    public static orgsUpdatePatAccesses(
        org: string,
        requestBody: {
            /**
             * Action to apply to the fine-grained personal access token.
             */
            action: 'revoke';
            /**
             * The IDs of the fine-grained personal access tokens.
             */
            pat_ids: Array<number>;
        },
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/personal-access-tokens',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * Update the access a fine-grained personal access token has to organization resources
     * Updates the access an organization member has to organization resources via a fine-grained personal access token. Limited to revoking the token's existing access. Limited to revoking a token's existing access.
     *
     * Only GitHub Apps can use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param patId The unique identifier of the fine-grained personal access token.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static orgsUpdatePatAccess(
        org: string,
        patId: number,
        requestBody: {
            /**
             * Action to apply to the fine-grained personal access token.
             */
            action: 'revoke';
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/personal-access-tokens/{pat_id}',
            path: {
                'org': org,
                'pat_id': patId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * List repositories a fine-grained personal access token has access to
     * Lists the repositories a fine-grained personal access token has access to.
     *
     * Only GitHub Apps can use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param patId Unique identifier of the fine-grained personal access token.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns minimal_repository Response
     * @throws ApiError
     */
    public static orgsListPatGrantRepositories(
        org: string,
        patId: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<minimal_repository>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/personal-access-tokens/{pat_id}/repositories',
            path: {
                'org': org,
                'pat_id': patId,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * Get all custom properties for an organization
     * Gets all custom properties defined for an organization.
     * Organization members can read these properties.
     * @param org The organization name. The name is not case sensitive.
     * @returns custom_property Response
     * @throws ApiError
     */
    public static orgsCustomPropertiesForReposGetOrganizationDefinitions(
        org: string,
    ): CancelablePromise<Array<custom_property>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/properties/schema',
            path: {
                'org': org,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Create or update custom properties for an organization
     * Creates new or updates existing custom properties defined for an organization in a batch.
     *
     * If the property already exists, the existing property will be replaced with the new values.
     * Missing optional values will fall back to default values, previous values will be overwritten.
     * E.g. if a property exists with `values_editable_by: org_and_repo_actors` and it's updated without specifying `values_editable_by`, it will be updated to default value `org_actors`.
     *
     * To use this endpoint, the authenticated user must be one of:
     * - An administrator for the organization.
     * - A user, or a user on a team, with the fine-grained permission of `custom_properties_org_definitions_manager` in the organization.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns custom_property Response
     * @throws ApiError
     */
    public static orgsCustomPropertiesForReposCreateOrUpdateOrganizationDefinitions(
        org: string,
        requestBody: {
            /**
             * The array of custom properties to create or update.
             */
            properties: Array<custom_property>;
        },
    ): CancelablePromise<Array<custom_property>> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/orgs/{org}/properties/schema',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get a custom property for an organization
     * Gets a custom property that is defined for an organization.
     * Organization members can read these properties.
     * @param org The organization name. The name is not case sensitive.
     * @param customPropertyName The custom property name
     * @returns custom_property Response
     * @throws ApiError
     */
    public static orgsCustomPropertiesForReposGetOrganizationDefinition(
        org: string,
        customPropertyName: string,
    ): CancelablePromise<custom_property> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/properties/schema/{custom_property_name}',
            path: {
                'org': org,
                'custom_property_name': customPropertyName,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Create or update a custom property for an organization
     * Creates a new or updates an existing custom property that is defined for an organization.
     *
     * To use this endpoint, the authenticated user must be one of:
     * - An administrator for the organization.
     * - A user, or a user on a team, with the fine-grained permission of `custom_properties_org_definitions_manager` in the organization.
     * @param org The organization name. The name is not case sensitive.
     * @param customPropertyName The custom property name
     * @param requestBody
     * @returns custom_property Response
     * @throws ApiError
     */
    public static orgsCustomPropertiesForReposCreateOrUpdateOrganizationDefinition(
        org: string,
        customPropertyName: string,
        requestBody: custom_property_set_payload,
    ): CancelablePromise<custom_property> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/properties/schema/{custom_property_name}',
            path: {
                'org': org,
                'custom_property_name': customPropertyName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Remove a custom property for an organization
     * Removes a custom property that is defined for an organization.
     *
     * To use this endpoint, the authenticated user must be one of:
     * - An administrator for the organization.
     * - A user, or a user on a team, with the fine-grained permission of `custom_properties_org_definitions_manager` in the organization.
     * @param org The organization name. The name is not case sensitive.
     * @param customPropertyName The custom property name
     * @returns void
     * @throws ApiError
     */
    public static orgsCustomPropertiesForReposDeleteOrganizationDefinition(
        org: string,
        customPropertyName: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/properties/schema/{custom_property_name}',
            path: {
                'org': org,
                'custom_property_name': customPropertyName,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * List custom property values for organization repositories
     * Lists organization repositories with all of their custom property values.
     * Organization members can read these properties.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param repositoryQuery Finds repositories in the organization with a query containing one or more search keywords and qualifiers. Qualifiers allow you to limit your search to specific areas of GitHub. The REST API supports the same qualifiers as the web interface for GitHub. To learn more about the format of the query, see [Constructing a search query](https://docs.github.com/rest/search/search#constructing-a-search-query). See "[Searching for repositories](https://docs.github.com/articles/searching-for-repositories/)" for a detailed list of qualifiers.
     * @returns org_repo_custom_property_values Response
     * @throws ApiError
     */
    public static orgsCustomPropertiesForReposGetOrganizationValues(
        org: string,
        perPage: number = 30,
        page: number = 1,
        repositoryQuery?: string,
    ): CancelablePromise<Array<org_repo_custom_property_values>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/properties/values',
            path: {
                'org': org,
            },
            query: {
                'per_page': perPage,
                'page': page,
                'repository_query': repositoryQuery,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Create or update custom property values for organization repositories
     * Create new or update existing custom property values for repositories in a batch that belong to an organization.
     * Each target repository will have its custom property values updated to match the values provided in the request.
     *
     * A maximum of 30 repositories can be updated in a single request.
     *
     * Using a value of `null` for a custom property will remove or 'unset' the property value from the repository.
     *
     * To use this endpoint, the authenticated user must be one of:
     * - An administrator for the organization.
     * - A user, or a user on a team, with the fine-grained permission of `custom_properties_org_values_editor` in the organization.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static orgsCustomPropertiesForReposCreateOrUpdateOrganizationValues(
        org: string,
        requestBody: {
            /**
             * The names of repositories that the custom property values will be applied to.
             */
            repository_names: Array<string>;
            /**
             * List of custom property names and associated values to apply to the repositories.
             */
            properties: Array<custom_property_value>;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/orgs/{org}/properties/values',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List public organization members
     * Members of an organization can choose to have their membership publicized or not.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns simple_user Response
     * @throws ApiError
     */
    public static orgsListPublicMembers(
        org: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<simple_user>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/public_members',
            path: {
                'org': org,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Check public organization membership for a user
     * Check if the provided user is a public member of the organization.
     * @param org The organization name. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @returns void
     * @throws ApiError
     */
    public static orgsCheckPublicMembershipForUser(
        org: string,
        username: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/public_members/{username}',
            path: {
                'org': org,
                'username': username,
            },
            errors: {
                404: `Not Found if user is not a public member`,
            },
        });
    }
    /**
     * Set public organization membership for the authenticated user
     * The user can publicize their own membership. (A user cannot publicize the membership for another user.)
     *
     * Note that you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP method](https://docs.github.com/rest/guides/getting-started-with-the-rest-api#http-method)."
     * @param org The organization name. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @returns void
     * @throws ApiError
     */
    public static orgsSetPublicMembershipForAuthenticatedUser(
        org: string,
        username: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/public_members/{username}',
            path: {
                'org': org,
                'username': username,
            },
            errors: {
                403: `Forbidden`,
            },
        });
    }
    /**
     * Remove public organization membership for the authenticated user
     * Removes the public membership for the authenticated user from the specified organization, unless public visibility is enforced by default.
     * @param org The organization name. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @returns void
     * @throws ApiError
     */
    public static orgsRemovePublicMembershipForAuthenticatedUser(
        org: string,
        username: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/public_members/{username}',
            path: {
                'org': org,
                'username': username,
            },
        });
    }
    /**
     * Get organization ruleset history
     * Get the history of an organization ruleset.
     * @param org The organization name. The name is not case sensitive.
     * @param rulesetId The ID of the ruleset.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns ruleset_version Response
     * @throws ApiError
     */
    public static orgsGetOrgRulesetHistory(
        org: string,
        rulesetId: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<ruleset_version>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/rulesets/{ruleset_id}/history',
            path: {
                'org': org,
                'ruleset_id': rulesetId,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Resource not found`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * Get organization ruleset version
     * Get a version of an organization ruleset.
     * @param org The organization name. The name is not case sensitive.
     * @param rulesetId The ID of the ruleset.
     * @param versionId The ID of the version
     * @returns ruleset_version_with_state Response
     * @throws ApiError
     */
    public static orgsGetOrgRulesetVersion(
        org: string,
        rulesetId: number,
        versionId: number,
    ): CancelablePromise<ruleset_version_with_state> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/rulesets/{ruleset_id}/history/{version_id}',
            path: {
                'org': org,
                'ruleset_id': rulesetId,
                'version_id': versionId,
            },
            errors: {
                404: `Resource not found`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * @deprecated
     * List security manager teams
     * > [!WARNING]
     * > **Closing down notice:** This operation is closing down and will be removed starting January 1, 2026. Please use the "[Organization Roles](https://docs.github.com/rest/orgs/organization-roles)" endpoints instead.
     * @param org The organization name. The name is not case sensitive.
     * @returns team_simple Response
     * @throws ApiError
     */
    public static orgsListSecurityManagerTeams(
        org: string,
    ): CancelablePromise<Array<team_simple>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/security-managers',
            path: {
                'org': org,
            },
        });
    }
    /**
     * @deprecated
     * Add a security manager team
     * > [!WARNING]
     * > **Closing down notice:** This operation is closing down and will be removed starting January 1, 2026. Please use the "[Organization Roles](https://docs.github.com/rest/orgs/organization-roles)" endpoints instead.
     * @param org The organization name. The name is not case sensitive.
     * @param teamSlug The slug of the team name.
     * @returns void
     * @throws ApiError
     */
    public static orgsAddSecurityManagerTeam(
        org: string,
        teamSlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/security-managers/teams/{team_slug}',
            path: {
                'org': org,
                'team_slug': teamSlug,
            },
        });
    }
    /**
     * @deprecated
     * Remove a security manager team
     * > [!WARNING]
     * > **Closing down notice:** This operation is closing down and will be removed starting January 1, 2026. Please use the "[Organization Roles](https://docs.github.com/rest/orgs/organization-roles)" endpoints instead.
     * @param org The organization name. The name is not case sensitive.
     * @param teamSlug The slug of the team name.
     * @returns void
     * @throws ApiError
     */
    public static orgsRemoveSecurityManagerTeam(
        org: string,
        teamSlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/security-managers/teams/{team_slug}',
            path: {
                'org': org,
                'team_slug': teamSlug,
            },
        });
    }
    /**
     * Get immutable releases settings for an organization
     * Gets the immutable releases policy for repositories in an organization.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @returns immutable_releases_organization_settings Immutable releases settings response
     * @throws ApiError
     */
    public static orgsGetImmutableReleasesSettings(
        org: string,
    ): CancelablePromise<immutable_releases_organization_settings> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/settings/immutable-releases',
            path: {
                'org': org,
            },
        });
    }
    /**
     * Set immutable releases settings for an organization
     * Sets the immutable releases policy for repositories in an organization.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static orgsSetImmutableReleasesSettings(
        org: string,
        requestBody: {
            /**
             * The policy that controls how immutable releases are enforced in the organization.
             */
            enforced_repositories: 'all' | 'none' | 'selected';
            /**
             * An array of repository ids for which immutable releases enforcement should be applied. You can only provide a list of repository ids when the `enforced_repositories` is set to `selected`. You can add and remove individual repositories using the [Enable a selected repository for immutable releases in an organization](https://docs.github.com/rest/orgs/orgs#enable-a-selected-repository-for-immutable-releases-in-an-organization) and [Disable a selected repository for immutable releases in an organization](https://docs.github.com/rest/orgs/orgs#disable-a-selected-repository-for-immutable-releases-in-an-organization) endpoints.
             */
            selected_repository_ids?: Array<number>;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/settings/immutable-releases',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List selected repositories for immutable releases enforcement
     * List all of the repositories that have been selected for immutable releases enforcement in an organization.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static orgsGetImmutableReleasesSettingsRepositories(
        org: string,
        page: number = 1,
        perPage: number = 30,
    ): CancelablePromise<{
        total_count: number;
        repositories: Array<minimal_repository>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/settings/immutable-releases/repositories',
            path: {
                'org': org,
            },
            query: {
                'page': page,
                'per_page': perPage,
            },
        });
    }
    /**
     * Set selected repositories for immutable releases enforcement
     * Replaces all repositories that have been selected for immutable releases enforcement in an organization. To use this endpoint, the organization immutable releases policy for `enforced_repositories` must be configured to `selected`.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static orgsSetImmutableReleasesSettingsRepositories(
        org: string,
        requestBody: {
            /**
             * An array of repository ids for which immutable releases enforcement should be applied. You can only provide a list of repository ids when the `enforced_repositories` is set to `selected`. You can add and remove individual repositories using the [Enable a selected repository for immutable releases in an organization](https://docs.github.com/rest/orgs/orgs#enable-a-selected-repository-for-immutable-releases-in-an-organization) and [Disable a selected repository for immutable releases in an organization](https://docs.github.com/rest/orgs/orgs#disable-a-selected-repository-for-immutable-releases-in-an-organization) endpoints.
             */
            selected_repository_ids: Array<number>;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/settings/immutable-releases/repositories',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Enable a selected repository for immutable releases in an organization
     * Adds a repository to the list of selected repositories that are enforced for immutable releases in an organization. To use this endpoint, the organization immutable releases policy for `enforced_repositories` must be configured to `selected`.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param repositoryId The unique identifier of the repository.
     * @returns void
     * @throws ApiError
     */
    public static orgsEnableSelectedRepositoryImmutableReleasesOrganization(
        org: string,
        repositoryId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/settings/immutable-releases/repositories/{repository_id}',
            path: {
                'org': org,
                'repository_id': repositoryId,
            },
        });
    }
    /**
     * Disable a selected repository for immutable releases in an organization
     * Removes a repository from the list of selected repositories that are enforced for immutable releases in an organization. To use this endpoint, the organization immutable releases policy for `enforced_repositories` must be configured to `selected`.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param repositoryId The unique identifier of the repository.
     * @returns void
     * @throws ApiError
     */
    public static orgsDisableSelectedRepositoryImmutableReleasesOrganization(
        org: string,
        repositoryId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/settings/immutable-releases/repositories/{repository_id}',
            path: {
                'org': org,
                'repository_id': repositoryId,
            },
        });
    }
    /**
     * @deprecated
     * Enable or disable a security feature for an organization
     * > [!WARNING]
     * > **Closing down notice:** The ability to enable or disable a security feature for all eligible repositories in an organization is closing down. Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead. For more information, see the [changelog](https://github.blog/changelog/2024-07-22-deprecation-of-api-endpoint-to-enable-or-disable-a-security-feature-for-an-organization/).
     *
     * Enables or disables the specified security feature for all eligible repositories in an organization. For more information, see "[Managing security managers in your organization](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/managing-security-managers-in-your-organization)."
     *
     * The authenticated user must be an organization owner or be member of a team with the security manager role to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org`, `write:org`, or `repo` scopes to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param securityProduct The security feature to enable or disable.
     * @param enablement The action to take.
     *
     * `enable_all` means to enable the specified security feature for all repositories in the organization.
     * `disable_all` means to disable the specified security feature for all repositories in the organization.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static orgsEnableOrDisableSecurityProductOnAllOrgRepos(
        org: string,
        securityProduct: 'dependency_graph' | 'dependabot_alerts' | 'dependabot_security_updates' | 'advanced_security' | 'code_scanning_default_setup' | 'secret_scanning' | 'secret_scanning_push_protection',
        enablement: 'enable_all' | 'disable_all',
        requestBody?: any,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/{security_product}/{enablement}',
            path: {
                'org': org,
                'security_product': securityProduct,
                'enablement': enablement,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `The action could not be taken due to an in progress enablement, or a policy is preventing enablement`,
            },
        });
    }
    /**
     * List organization memberships for the authenticated user
     * Lists all of the authenticated user's organization memberships.
     * @param state Indicates the state of the memberships to return. If not specified, the API returns both active and pending memberships.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns org_membership Response
     * @throws ApiError
     */
    public static orgsListMembershipsForAuthenticatedUser(
        state?: 'active' | 'pending',
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<org_membership>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/memberships/orgs',
            query: {
                'state': state,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                304: `Not modified`,
                401: `Requires authentication`,
                403: `Forbidden`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get an organization membership for the authenticated user
     * If the authenticated user is an active or pending member of the organization, this endpoint will return the user's membership. If the authenticated user is not affiliated with the organization, a `404` is returned. This endpoint will return a `403` if the request is made by a GitHub App that is blocked by the organization.
     * @param org The organization name. The name is not case sensitive.
     * @returns org_membership Response
     * @throws ApiError
     */
    public static orgsGetMembershipForAuthenticatedUser(
        org: string,
    ): CancelablePromise<org_membership> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/memberships/orgs/{org}',
            path: {
                'org': org,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Update an organization membership for the authenticated user
     * Converts the authenticated user to an active member of the organization, if that user has a pending invitation from the organization.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns org_membership Response
     * @throws ApiError
     */
    public static orgsUpdateMembershipForAuthenticatedUser(
        org: string,
        requestBody: {
            /**
             * The state that the membership should be in. Only `"active"` will be accepted.
             */
            state: 'active';
        },
    ): CancelablePromise<org_membership> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/memberships/orgs/{org}',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List organizations for the authenticated user
     * List organizations for the authenticated user.
     *
     * For OAuth app tokens and personal access tokens (classic), this endpoint only lists organizations that your authorization allows you to operate on in some way (e.g., you can list teams with `read:org` scope, you can publicize your organization membership with `user` scope, etc.). Therefore, this API requires at least `user` or `read:org` scope for OAuth app tokens and personal access tokens (classic). Requests with insufficient scope will receive a `403 Forbidden` response.
     *
     * > [!NOTE]
     * > Requests using a fine-grained access token will receive a `200 Success` response with an empty list.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns organization_simple Response
     * @throws ApiError
     */
    public static orgsListForAuthenticatedUser(
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<organization_simple>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/orgs',
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                304: `Not modified`,
                401: `Requires authentication`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * List organizations for a user
     * List [public organization memberships](https://docs.github.com/articles/publicizing-or-concealing-organization-membership) for the specified user.
     *
     * This method only lists _public_ memberships, regardless of authentication. If you need to fetch all of the organization memberships (public and private) for the authenticated user, use the [List organizations for the authenticated user](https://docs.github.com/rest/orgs/orgs#list-organizations-for-the-authenticated-user) API instead.
     * @param username The handle for the GitHub user account.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns organization_simple Response
     * @throws ApiError
     */
    public static orgsListForUser(
        username: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<organization_simple>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{username}/orgs',
            path: {
                'username': username,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
}
