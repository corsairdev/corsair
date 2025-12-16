/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { actions_artifact_and_log_retention } from '../models/actions_artifact_and_log_retention';
import type { actions_artifact_and_log_retention_response } from '../models/actions_artifact_and_log_retention_response';
import type { actions_cache_list } from '../models/actions_cache_list';
import type { actions_cache_retention_limit_for_enterprise } from '../models/actions_cache_retention_limit_for_enterprise';
import type { actions_cache_retention_limit_for_organization } from '../models/actions_cache_retention_limit_for_organization';
import type { actions_cache_retention_limit_for_repository } from '../models/actions_cache_retention_limit_for_repository';
import type { actions_cache_storage_limit_for_enterprise } from '../models/actions_cache_storage_limit_for_enterprise';
import type { actions_cache_storage_limit_for_organization } from '../models/actions_cache_storage_limit_for_organization';
import type { actions_cache_storage_limit_for_repository } from '../models/actions_cache_storage_limit_for_repository';
import type { actions_cache_usage_by_repository } from '../models/actions_cache_usage_by_repository';
import type { actions_cache_usage_org_enterprise } from '../models/actions_cache_usage_org_enterprise';
import type { actions_enabled } from '../models/actions_enabled';
import type { actions_fork_pr_contributor_approval } from '../models/actions_fork_pr_contributor_approval';
import type { actions_fork_pr_workflows_private_repos } from '../models/actions_fork_pr_workflows_private_repos';
import type { actions_fork_pr_workflows_private_repos_request } from '../models/actions_fork_pr_workflows_private_repos_request';
import type { actions_get_default_workflow_permissions } from '../models/actions_get_default_workflow_permissions';
import type { actions_hosted_runner } from '../models/actions_hosted_runner';
import type { actions_hosted_runner_curated_image } from '../models/actions_hosted_runner_curated_image';
import type { actions_hosted_runner_custom_image } from '../models/actions_hosted_runner_custom_image';
import type { actions_hosted_runner_custom_image_version } from '../models/actions_hosted_runner_custom_image_version';
import type { actions_hosted_runner_limits } from '../models/actions_hosted_runner_limits';
import type { actions_hosted_runner_machine_spec } from '../models/actions_hosted_runner_machine_spec';
import type { actions_organization_permissions } from '../models/actions_organization_permissions';
import type { actions_public_key } from '../models/actions_public_key';
import type { actions_repository_permissions } from '../models/actions_repository_permissions';
import type { actions_secret } from '../models/actions_secret';
import type { actions_set_default_workflow_permissions } from '../models/actions_set_default_workflow_permissions';
import type { actions_variable } from '../models/actions_variable';
import type { actions_workflow_access_to_repository } from '../models/actions_workflow_access_to_repository';
import type { allowed_actions } from '../models/allowed_actions';
import type { artifact } from '../models/artifact';
import type { authentication_token } from '../models/authentication_token';
import type { deployment } from '../models/deployment';
import type { empty_object } from '../models/empty_object';
import type { enabled_repositories } from '../models/enabled_repositories';
import type { environment_approvals } from '../models/environment_approvals';
import type { job } from '../models/job';
import type { minimal_repository } from '../models/minimal_repository';
import type { oidc_custom_sub_repo } from '../models/oidc_custom_sub_repo';
import type { organization_actions_secret } from '../models/organization_actions_secret';
import type { organization_actions_variable } from '../models/organization_actions_variable';
import type { pending_deployment } from '../models/pending_deployment';
import type { repository } from '../models/repository';
import type { review_custom_gates_comment_required } from '../models/review_custom_gates_comment_required';
import type { review_custom_gates_state_required } from '../models/review_custom_gates_state_required';
import type { runner } from '../models/runner';
import type { runner_application } from '../models/runner_application';
import type { runner_groups_org } from '../models/runner_groups_org';
import type { runner_label } from '../models/runner_label';
import type { selected_actions } from '../models/selected_actions';
import type { self_hosted_runners_settings } from '../models/self_hosted_runners_settings';
import type { sha_pinning_required } from '../models/sha_pinning_required';
import type { workflow } from '../models/workflow';
import type { workflow_run } from '../models/workflow_run';
import type { workflow_run_usage } from '../models/workflow_run_usage';
import type { workflow_usage } from '../models/workflow_usage';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ActionsService {
    /**
     * Get GitHub Actions cache retention limit for an enterprise
     * Gets GitHub Actions cache retention limit for an enterprise. All organizations and repositories under this
     * enterprise may not set a higher cache retention limit.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:enterprise` scope to use this endpoint.
     * @param enterprise The slug version of the enterprise name.
     * @returns actions_cache_retention_limit_for_enterprise Response
     * @throws ApiError
     */
    public static actionsGetActionsCacheRetentionLimitForEnterprise(
        enterprise: string,
    ): CancelablePromise<actions_cache_retention_limit_for_enterprise> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/enterprises/{enterprise}/actions/cache/retention-limit',
            path: {
                'enterprise': enterprise,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Set GitHub Actions cache retention limit for an enterprise
     * Sets GitHub Actions cache retention limit for an enterprise. All organizations and repositories under this
     * enterprise may not set a higher cache retention limit.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:enterprise` scope to use this endpoint.
     * @param enterprise The slug version of the enterprise name.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetActionsCacheRetentionLimitForEnterprise(
        enterprise: string,
        requestBody: actions_cache_retention_limit_for_enterprise,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/enterprises/{enterprise}/actions/cache/retention-limit',
            path: {
                'enterprise': enterprise,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get GitHub Actions cache storage limit for an enterprise
     * Gets GitHub Actions cache storage limit for an enterprise. All organizations and repositories under this
     * enterprise may not set a higher cache storage limit.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:enterprise` scope to use this endpoint.
     * @param enterprise The slug version of the enterprise name.
     * @returns actions_cache_storage_limit_for_enterprise Response
     * @throws ApiError
     */
    public static actionsGetActionsCacheStorageLimitForEnterprise(
        enterprise: string,
    ): CancelablePromise<actions_cache_storage_limit_for_enterprise> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/enterprises/{enterprise}/actions/cache/storage-limit',
            path: {
                'enterprise': enterprise,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Set GitHub Actions cache storage limit for an enterprise
     * Sets GitHub Actions cache storage limit for an enterprise. All organizations and repositories under this
     * enterprise may not set a higher cache storage limit.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:enterprise` scope to use this endpoint.
     * @param enterprise The slug version of the enterprise name.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetActionsCacheStorageLimitForEnterprise(
        enterprise: string,
        requestBody: actions_cache_storage_limit_for_enterprise,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/enterprises/{enterprise}/actions/cache/storage-limit',
            path: {
                'enterprise': enterprise,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get GitHub Actions cache retention limit for an organization
     * Gets GitHub Actions cache retention limit for an organization. All repositories under this
     * organization may not set a higher cache retention limit.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:organization` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @returns actions_cache_retention_limit_for_organization Response
     * @throws ApiError
     */
    public static actionsGetActionsCacheRetentionLimitForOrganization(
        org: string,
    ): CancelablePromise<actions_cache_retention_limit_for_organization> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/organizations/{org}/actions/cache/retention-limit',
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
     * Set GitHub Actions cache retention limit for an organization
     * Sets GitHub Actions cache retention limit for an organization. All repositories under this
     * organization may not set a higher cache retention limit.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:organization` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetActionsCacheRetentionLimitForOrganization(
        org: string,
        requestBody: actions_cache_retention_limit_for_organization,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/organizations/{org}/actions/cache/retention-limit',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get GitHub Actions cache storage limit for an organization
     * Gets GitHub Actions cache storage limit for an organization. All repositories under this
     * organization may not set a higher cache storage limit.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:organization` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @returns actions_cache_storage_limit_for_organization Response
     * @throws ApiError
     */
    public static actionsGetActionsCacheStorageLimitForOrganization(
        org: string,
    ): CancelablePromise<actions_cache_storage_limit_for_organization> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/organizations/{org}/actions/cache/storage-limit',
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
     * Set GitHub Actions cache storage limit for an organization
     * Sets GitHub Actions cache storage limit for an organization. All organizations and repositories under this
     * organization may not set a higher cache storage limit.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:organization` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetActionsCacheStorageLimitForOrganization(
        org: string,
        requestBody: actions_cache_storage_limit_for_organization,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/organizations/{org}/actions/cache/storage-limit',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get GitHub Actions cache usage for an organization
     * Gets the total GitHub Actions cache usage for an organization.
     * The data fetched using this API is refreshed approximately every 5 minutes, so values returned from this endpoint may take at least 5 minutes to get updated.
     *
     * OAuth tokens and personal access tokens (classic) need the `read:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @returns actions_cache_usage_org_enterprise Response
     * @throws ApiError
     */
    public static actionsGetActionsCacheUsageForOrg(
        org: string,
    ): CancelablePromise<actions_cache_usage_org_enterprise> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/cache/usage',
            path: {
                'org': org,
            },
        });
    }
    /**
     * List repositories with GitHub Actions cache usage for an organization
     * Lists repositories and their GitHub Actions cache usage for an organization.
     * The data fetched using this API is refreshed approximately every 5 minutes, so values returned from this endpoint may take at least 5 minutes to get updated.
     *
     * OAuth tokens and personal access tokens (classic) need the `read:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsGetActionsCacheUsageByRepoForOrg(
        org: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        repository_cache_usages: Array<actions_cache_usage_by_repository>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/cache/usage-by-repository',
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
     * List GitHub-hosted runners for an organization
     * Lists all GitHub-hosted runners configured in an organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `manage_runner:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListHostedRunnersForOrg(
        org: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        runners: Array<actions_hosted_runner>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/hosted-runners',
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
     * Create a GitHub-hosted runner for an organization
     * Creates a GitHub-hosted runner for an organization.
     * OAuth tokens and personal access tokens (classic) need the `manage_runners:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns actions_hosted_runner Response
     * @throws ApiError
     */
    public static actionsCreateHostedRunnerForOrg(
        org: string,
        requestBody: {
            /**
             * Name of the runner. Must be between 1 and 64 characters and may only contain upper and lowercase letters a-z, numbers 0-9, '.', '-', and '_'.
             */
            name: string;
            /**
             * The image of runner. To list all available images, use `GET /actions/hosted-runners/images/github-owned` or `GET /actions/hosted-runners/images/partner`.
             */
            image: {
                /**
                 * The unique identifier of the runner image.
                 */
                id?: string;
                /**
                 * The source of the runner image.
                 */
                source?: 'github' | 'partner' | 'custom';
                /**
                 * The version of the runner image to deploy. This is relevant only for runners using custom images.
                 */
                version?: string | null;
            };
            /**
             * The machine size of the runner. To list available sizes, use `GET actions/hosted-runners/machine-sizes`
             */
            size: string;
            /**
             * The existing runner group to add this runner to.
             */
            runner_group_id: number;
            /**
             * The maximum amount of runners to scale up to. Runners will not auto-scale above this number. Use this setting to limit your cost.
             */
            maximum_runners?: number;
            /**
             * Whether this runner should be created with a static public IP. Note limit on account. To list limits on account, use `GET actions/hosted-runners/limits`
             */
            enable_static_ip?: boolean;
            /**
             * Whether this runner should be used to generate custom images.
             */
            image_gen?: boolean;
        },
    ): CancelablePromise<actions_hosted_runner> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/actions/hosted-runners',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List custom images for an organization
     * List custom images for an organization.
     *
     * OAuth tokens and personal access tokens (classic) need the `manage_runners:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListCustomImagesForOrg(
        org: string,
    ): CancelablePromise<{
        total_count: number;
        images: Array<actions_hosted_runner_custom_image>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/hosted-runners/images/custom',
            path: {
                'org': org,
            },
        });
    }
    /**
     * Get a custom image definition for GitHub Actions Hosted Runners
     * Get a custom image definition for GitHub Actions Hosted Runners.
     *
     * OAuth tokens and personal access tokens (classic) need the `manage_runners:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param imageDefinitionId Image definition ID of custom image
     * @returns actions_hosted_runner_custom_image Response
     * @throws ApiError
     */
    public static actionsGetCustomImageForOrg(
        org: string,
        imageDefinitionId: number,
    ): CancelablePromise<actions_hosted_runner_custom_image> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}',
            path: {
                'org': org,
                'image_definition_id': imageDefinitionId,
            },
        });
    }
    /**
     * Delete a custom image from the organization
     * Delete a custom image from the organization.
     *
     * OAuth tokens and personal access tokens (classic) need the `manage_runners:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param imageDefinitionId Image definition ID of custom image
     * @returns void
     * @throws ApiError
     */
    public static actionsDeleteCustomImageFromOrg(
        org: string,
        imageDefinitionId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}',
            path: {
                'org': org,
                'image_definition_id': imageDefinitionId,
            },
        });
    }
    /**
     * List image versions of a custom image for an organization
     * List image versions of a custom image for an organization.
     *
     * OAuth tokens and personal access tokens (classic) need the `manage_runners:org` scope to use this endpoint.
     * @param imageDefinitionId Image definition ID of custom image
     * @param org The organization name. The name is not case sensitive.
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListCustomImageVersionsForOrg(
        imageDefinitionId: number,
        org: string,
    ): CancelablePromise<{
        total_count: number;
        image_versions: Array<actions_hosted_runner_custom_image_version>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}/versions',
            path: {
                'image_definition_id': imageDefinitionId,
                'org': org,
            },
        });
    }
    /**
     * Get an image version of a custom image for GitHub Actions Hosted Runners
     * Get an image version of a custom image for GitHub Actions Hosted Runners.
     *
     * OAuth tokens and personal access tokens (classic) need the `manage_runners:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param imageDefinitionId Image definition ID of custom image
     * @param version Version of a custom image
     * @returns actions_hosted_runner_custom_image_version Response
     * @throws ApiError
     */
    public static actionsGetCustomImageVersionForOrg(
        org: string,
        imageDefinitionId: number,
        version: string,
    ): CancelablePromise<actions_hosted_runner_custom_image_version> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}/versions/{version}',
            path: {
                'org': org,
                'image_definition_id': imageDefinitionId,
                'version': version,
            },
        });
    }
    /**
     * Delete an image version of custom image from the organization
     * Delete an image version of custom image from the organization.
     *
     * OAuth tokens and personal access tokens (classic) need the `manage_runners:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param imageDefinitionId Image definition ID of custom image
     * @param version Version of a custom image
     * @returns void
     * @throws ApiError
     */
    public static actionsDeleteCustomImageVersionFromOrg(
        org: string,
        imageDefinitionId: number,
        version: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}/versions/{version}',
            path: {
                'org': org,
                'image_definition_id': imageDefinitionId,
                'version': version,
            },
        });
    }
    /**
     * Get GitHub-owned images for GitHub-hosted runners in an organization
     * Get the list of GitHub-owned images available for GitHub-hosted runners for an organization.
     * @param org The organization name. The name is not case sensitive.
     * @returns any Response
     * @throws ApiError
     */
    public static actionsGetHostedRunnersGithubOwnedImagesForOrg(
        org: string,
    ): CancelablePromise<{
        total_count: number;
        images: Array<actions_hosted_runner_curated_image>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/hosted-runners/images/github-owned',
            path: {
                'org': org,
            },
        });
    }
    /**
     * Get partner images for GitHub-hosted runners in an organization
     * Get the list of partner images available for GitHub-hosted runners for an organization.
     * @param org The organization name. The name is not case sensitive.
     * @returns any Response
     * @throws ApiError
     */
    public static actionsGetHostedRunnersPartnerImagesForOrg(
        org: string,
    ): CancelablePromise<{
        total_count: number;
        images: Array<actions_hosted_runner_curated_image>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/hosted-runners/images/partner',
            path: {
                'org': org,
            },
        });
    }
    /**
     * Get limits on GitHub-hosted runners for an organization
     * Get the GitHub-hosted runners limits for an organization.
     * @param org The organization name. The name is not case sensitive.
     * @returns actions_hosted_runner_limits Response
     * @throws ApiError
     */
    public static actionsGetHostedRunnersLimitsForOrg(
        org: string,
    ): CancelablePromise<actions_hosted_runner_limits> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/hosted-runners/limits',
            path: {
                'org': org,
            },
        });
    }
    /**
     * Get GitHub-hosted runners machine specs for an organization
     * Get the list of machine specs available for GitHub-hosted runners for an organization.
     * @param org The organization name. The name is not case sensitive.
     * @returns any Response
     * @throws ApiError
     */
    public static actionsGetHostedRunnersMachineSpecsForOrg(
        org: string,
    ): CancelablePromise<{
        total_count: number;
        machine_specs: Array<actions_hosted_runner_machine_spec>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/hosted-runners/machine-sizes',
            path: {
                'org': org,
            },
        });
    }
    /**
     * Get platforms for GitHub-hosted runners in an organization
     * Get the list of platforms available for GitHub-hosted runners for an organization.
     * @param org The organization name. The name is not case sensitive.
     * @returns any Response
     * @throws ApiError
     */
    public static actionsGetHostedRunnersPlatformsForOrg(
        org: string,
    ): CancelablePromise<{
        total_count: number;
        platforms: Array<string>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/hosted-runners/platforms',
            path: {
                'org': org,
            },
        });
    }
    /**
     * Get a GitHub-hosted runner for an organization
     * Gets a GitHub-hosted runner configured in an organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `manage_runners:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param hostedRunnerId Unique identifier of the GitHub-hosted runner.
     * @returns actions_hosted_runner Response
     * @throws ApiError
     */
    public static actionsGetHostedRunnerForOrg(
        org: string,
        hostedRunnerId: number,
    ): CancelablePromise<actions_hosted_runner> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/hosted-runners/{hosted_runner_id}',
            path: {
                'org': org,
                'hosted_runner_id': hostedRunnerId,
            },
        });
    }
    /**
     * Update a GitHub-hosted runner for an organization
     * Updates a GitHub-hosted runner for an organization.
     * OAuth app tokens and personal access tokens (classic) need the `manage_runners:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param hostedRunnerId Unique identifier of the GitHub-hosted runner.
     * @param requestBody
     * @returns actions_hosted_runner Response
     * @throws ApiError
     */
    public static actionsUpdateHostedRunnerForOrg(
        org: string,
        hostedRunnerId: number,
        requestBody: {
            /**
             * Name of the runner. Must be between 1 and 64 characters and may only contain upper and lowercase letters a-z, numbers 0-9, '.', '-', and '_'.
             */
            name?: string;
            /**
             * The existing runner group to add this runner to.
             */
            runner_group_id?: number;
            /**
             * The maximum amount of runners to scale up to. Runners will not auto-scale above this number. Use this setting to limit your cost.
             */
            maximum_runners?: number;
            /**
             * Whether this runner should be updated with a static public IP. Note limit on account. To list limits on account, use `GET actions/hosted-runners/limits`
             */
            enable_static_ip?: boolean;
            /**
             * The version of the runner image to deploy. This is relevant only for runners using custom images.
             */
            image_version?: string | null;
        },
    ): CancelablePromise<actions_hosted_runner> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/orgs/{org}/actions/hosted-runners/{hosted_runner_id}',
            path: {
                'org': org,
                'hosted_runner_id': hostedRunnerId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a GitHub-hosted runner for an organization
     * Deletes a GitHub-hosted runner for an organization.
     * @param org The organization name. The name is not case sensitive.
     * @param hostedRunnerId Unique identifier of the GitHub-hosted runner.
     * @returns actions_hosted_runner Response
     * @throws ApiError
     */
    public static actionsDeleteHostedRunnerForOrg(
        org: string,
        hostedRunnerId: number,
    ): CancelablePromise<actions_hosted_runner> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/actions/hosted-runners/{hosted_runner_id}',
            path: {
                'org': org,
                'hosted_runner_id': hostedRunnerId,
            },
        });
    }
    /**
     * Get GitHub Actions permissions for an organization
     * Gets the GitHub Actions permissions policy for repositories and allowed actions and reusable workflows in an organization.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @returns actions_organization_permissions Response
     * @throws ApiError
     */
    public static actionsGetGithubActionsPermissionsOrganization(
        org: string,
    ): CancelablePromise<actions_organization_permissions> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/permissions',
            path: {
                'org': org,
            },
        });
    }
    /**
     * Set GitHub Actions permissions for an organization
     * Sets the GitHub Actions permissions policy for repositories and allowed actions and reusable workflows in an organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetGithubActionsPermissionsOrganization(
        org: string,
        requestBody: {
            enabled_repositories: enabled_repositories;
            allowed_actions?: allowed_actions;
            sha_pinning_required?: sha_pinning_required;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/permissions',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get artifact and log retention settings for an organization
     * Gets artifact and log retention settings for an organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope or the "Actions policies" fine-grained permission to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @returns actions_artifact_and_log_retention_response Response
     * @throws ApiError
     */
    public static actionsGetArtifactAndLogRetentionSettingsOrganization(
        org: string,
    ): CancelablePromise<actions_artifact_and_log_retention_response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/permissions/artifact-and-log-retention',
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
     * Set artifact and log retention settings for an organization
     * Sets artifact and log retention settings for an organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope or the "Actions policies" fine-grained permission to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetArtifactAndLogRetentionSettingsOrganization(
        org: string,
        requestBody: actions_artifact_and_log_retention,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/permissions/artifact-and-log-retention',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                409: `Conflict`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get fork PR contributor approval permissions for an organization
     * Gets the fork PR contributor approval policy for an organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope or the "Actions policies" fine-grained permission to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @returns actions_fork_pr_contributor_approval Response
     * @throws ApiError
     */
    public static actionsGetForkPrContributorApprovalPermissionsOrganization(
        org: string,
    ): CancelablePromise<actions_fork_pr_contributor_approval> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/permissions/fork-pr-contributor-approval',
            path: {
                'org': org,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Set fork PR contributor approval permissions for an organization
     * Sets the fork PR contributor approval policy for an organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetForkPrContributorApprovalPermissionsOrganization(
        org: string,
        requestBody: actions_fork_pr_contributor_approval,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/permissions/fork-pr-contributor-approval',
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
     * Get private repo fork PR workflow settings for an organization
     * Gets the settings for whether workflows from fork pull requests can run on private repositories in an organization.
     * @param org The organization name. The name is not case sensitive.
     * @returns actions_fork_pr_workflows_private_repos Response
     * @throws ApiError
     */
    public static actionsGetPrivateRepoForkPrWorkflowsSettingsOrganization(
        org: string,
    ): CancelablePromise<actions_fork_pr_workflows_private_repos> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/permissions/fork-pr-workflows-private-repos',
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
     * Set private repo fork PR workflow settings for an organization
     * Sets the settings for whether workflows from fork pull requests can run on private repositories in an organization.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetPrivateRepoForkPrWorkflowsSettingsOrganization(
        org: string,
        requestBody: actions_fork_pr_workflows_private_repos_request,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/permissions/fork-pr-workflows-private-repos',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden - Fork PR workflow settings for private repositories are managed by the enterprise owner`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List selected repositories enabled for GitHub Actions in an organization
     * Lists the selected repositories that are enabled for GitHub Actions in an organization. To use this endpoint, the organization permission policy for `enabled_repositories` must be configured to `selected`. For more information, see "[Set GitHub Actions permissions for an organization](#set-github-actions-permissions-for-an-organization)."
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListSelectedRepositoriesEnabledGithubActionsOrganization(
        org: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        repositories: Array<repository>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/permissions/repositories',
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
     * Set selected repositories enabled for GitHub Actions in an organization
     * Replaces the list of selected repositories that are enabled for GitHub Actions in an organization. To use this endpoint, the organization permission policy for `enabled_repositories` must be configured to `selected`. For more information, see "[Set GitHub Actions permissions for an organization](#set-github-actions-permissions-for-an-organization)."
     *
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetSelectedRepositoriesEnabledGithubActionsOrganization(
        org: string,
        requestBody: {
            /**
             * List of repository IDs to enable for GitHub Actions.
             */
            selected_repository_ids: Array<number>;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/permissions/repositories',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Enable a selected repository for GitHub Actions in an organization
     * Adds a repository to the list of selected repositories that are enabled for GitHub Actions in an organization. To use this endpoint, the organization permission policy for `enabled_repositories` must be must be configured to `selected`. For more information, see "[Set GitHub Actions permissions for an organization](#set-github-actions-permissions-for-an-organization)."
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param repositoryId The unique identifier of the repository.
     * @returns void
     * @throws ApiError
     */
    public static actionsEnableSelectedRepositoryGithubActionsOrganization(
        org: string,
        repositoryId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/permissions/repositories/{repository_id}',
            path: {
                'org': org,
                'repository_id': repositoryId,
            },
        });
    }
    /**
     * Disable a selected repository for GitHub Actions in an organization
     * Removes a repository from the list of selected repositories that are enabled for GitHub Actions in an organization. To use this endpoint, the organization permission policy for `enabled_repositories` must be configured to `selected`. For more information, see "[Set GitHub Actions permissions for an organization](#set-github-actions-permissions-for-an-organization)."
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param repositoryId The unique identifier of the repository.
     * @returns void
     * @throws ApiError
     */
    public static actionsDisableSelectedRepositoryGithubActionsOrganization(
        org: string,
        repositoryId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/actions/permissions/repositories/{repository_id}',
            path: {
                'org': org,
                'repository_id': repositoryId,
            },
        });
    }
    /**
     * Get allowed actions and reusable workflows for an organization
     * Gets the selected actions and reusable workflows that are allowed in an organization. To use this endpoint, the organization permission policy for `allowed_actions` must be configured to `selected`. For more information, see "[Set GitHub Actions permissions for an organization](#set-github-actions-permissions-for-an-organization)."
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @returns selected_actions Response
     * @throws ApiError
     */
    public static actionsGetAllowedActionsOrganization(
        org: string,
    ): CancelablePromise<selected_actions> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/permissions/selected-actions',
            path: {
                'org': org,
            },
        });
    }
    /**
     * Set allowed actions and reusable workflows for an organization
     * Sets the actions and reusable workflows that are allowed in an organization. To use this endpoint, the organization permission policy for `allowed_actions` must be configured to `selected`. For more information, see "[Set GitHub Actions permissions for an organization](#set-github-actions-permissions-for-an-organization)."
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetAllowedActionsOrganization(
        org: string,
        requestBody?: selected_actions,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/permissions/selected-actions',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get self-hosted runners settings for an organization
     * Gets the settings for self-hosted runners for an organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope or the "Actions policies" fine-grained permission to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @returns self_hosted_runners_settings Response
     * @throws ApiError
     */
    public static actionsGetSelfHostedRunnersPermissionsOrganization(
        org: string,
    ): CancelablePromise<self_hosted_runners_settings> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/permissions/self-hosted-runners',
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
     * Set self-hosted runners settings for an organization
     * Sets the settings for self-hosted runners for an organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope or the "Actions policies" fine-grained permission to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetSelfHostedRunnersPermissionsOrganization(
        org: string,
        requestBody: {
            /**
             * The policy that controls whether self-hosted runners can be used in the organization
             */
            enabled_repositories: 'all' | 'selected' | 'none';
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/permissions/self-hosted-runners',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                409: `Conflict`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List repositories allowed to use self-hosted runners in an organization
     * Lists repositories that are allowed to use self-hosted runners in an organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope or the "Actions policies" fine-grained permission to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListSelectedRepositoriesSelfHostedRunnersOrganization(
        org: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        total_count?: number;
        repositories?: Array<repository>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/permissions/self-hosted-runners/repositories',
            path: {
                'org': org,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Set repositories allowed to use self-hosted runners in an organization
     * Sets repositories that are allowed to use self-hosted runners in an organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope or the "Actions policies" fine-grained permission to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetSelectedRepositoriesSelfHostedRunnersOrganization(
        org: string,
        requestBody: {
            /**
             * IDs of repositories that can use repository-level self-hosted runners
             */
            selected_repository_ids: Array<number>;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/permissions/self-hosted-runners/repositories',
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
     * Add a repository to the list of repositories allowed to use self-hosted runners in an organization
     * Adds a repository to the list of repositories that are allowed to use self-hosted runners in an organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope or the "Actions policies" fine-grained permission to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param repositoryId The unique identifier of the repository.
     * @returns void
     * @throws ApiError
     */
    public static actionsEnableSelectedRepositorySelfHostedRunnersOrganization(
        org: string,
        repositoryId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/permissions/self-hosted-runners/repositories/{repository_id}',
            path: {
                'org': org,
                'repository_id': repositoryId,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                409: `Conflict`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Remove a repository from the list of repositories allowed to use self-hosted runners in an organization
     * Removes a repository from the list of repositories that are allowed to use self-hosted runners in an organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope or the "Actions policies" fine-grained permission to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param repositoryId The unique identifier of the repository.
     * @returns void
     * @throws ApiError
     */
    public static actionsDisableSelectedRepositorySelfHostedRunnersOrganization(
        org: string,
        repositoryId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/actions/permissions/self-hosted-runners/repositories/{repository_id}',
            path: {
                'org': org,
                'repository_id': repositoryId,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                409: `Conflict`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get default workflow permissions for an organization
     * Gets the default workflow permissions granted to the `GITHUB_TOKEN` when running workflows in an organization,
     * as well as whether GitHub Actions can submit approving pull request reviews. For more information, see
     * "[Setting the permissions of the GITHUB_TOKEN for your organization](https://docs.github.com/organizations/managing-organization-settings/disabling-or-limiting-github-actions-for-your-organization#setting-the-permissions-of-the-github_token-for-your-organization)."
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @returns actions_get_default_workflow_permissions Response
     * @throws ApiError
     */
    public static actionsGetGithubActionsDefaultWorkflowPermissionsOrganization(
        org: string,
    ): CancelablePromise<actions_get_default_workflow_permissions> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/permissions/workflow',
            path: {
                'org': org,
            },
        });
    }
    /**
     * Set default workflow permissions for an organization
     * Sets the default workflow permissions granted to the `GITHUB_TOKEN` when running workflows in an organization, and sets if GitHub Actions
     * can submit approving pull request reviews. For more information, see
     * "[Setting the permissions of the GITHUB_TOKEN for your organization](https://docs.github.com/organizations/managing-organization-settings/disabling-or-limiting-github-actions-for-your-organization#setting-the-permissions-of-the-github_token-for-your-organization)."
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetGithubActionsDefaultWorkflowPermissionsOrganization(
        org: string,
        requestBody?: actions_set_default_workflow_permissions,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/permissions/workflow',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List self-hosted runner groups for an organization
     * Lists all self-hosted runner groups configured in an organization and inherited from an enterprise.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param visibleToRepository Only return runner groups that are allowed to be used by this repository.
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListSelfHostedRunnerGroupsForOrg(
        org: string,
        perPage: number = 30,
        page: number = 1,
        visibleToRepository?: string,
    ): CancelablePromise<{
        total_count: number;
        runner_groups: Array<runner_groups_org>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/runner-groups',
            path: {
                'org': org,
            },
            query: {
                'per_page': perPage,
                'page': page,
                'visible_to_repository': visibleToRepository,
            },
        });
    }
    /**
     * Create a self-hosted runner group for an organization
     * Creates a new self-hosted runner group for an organization.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns runner_groups_org Response
     * @throws ApiError
     */
    public static actionsCreateSelfHostedRunnerGroupForOrg(
        org: string,
        requestBody: {
            /**
             * Name of the runner group.
             */
            name: string;
            /**
             * Visibility of a runner group. You can select all repositories, select individual repositories, or limit access to private repositories.
             */
            visibility?: 'selected' | 'all' | 'private';
            /**
             * List of repository IDs that can access the runner group.
             */
            selected_repository_ids?: Array<number>;
            /**
             * List of runner IDs to add to the runner group.
             */
            runners?: Array<number>;
            /**
             * Whether the runner group can be used by `public` repositories.
             */
            allows_public_repositories?: boolean;
            /**
             * If `true`, the runner group will be restricted to running only the workflows specified in the `selected_workflows` array.
             */
            restricted_to_workflows?: boolean;
            /**
             * List of workflows the runner group should be allowed to run. This setting will be ignored unless `restricted_to_workflows` is set to `true`.
             */
            selected_workflows?: Array<string>;
            /**
             * The identifier of a hosted compute network configuration.
             */
            network_configuration_id?: string;
        },
    ): CancelablePromise<runner_groups_org> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/actions/runner-groups',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get a self-hosted runner group for an organization
     * Gets a specific self-hosted runner group for an organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerGroupId Unique identifier of the self-hosted runner group.
     * @returns runner_groups_org Response
     * @throws ApiError
     */
    public static actionsGetSelfHostedRunnerGroupForOrg(
        org: string,
        runnerGroupId: number,
    ): CancelablePromise<runner_groups_org> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/runner-groups/{runner_group_id}',
            path: {
                'org': org,
                'runner_group_id': runnerGroupId,
            },
        });
    }
    /**
     * Update a self-hosted runner group for an organization
     * Updates the `name` and `visibility` of a self-hosted runner group in an organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerGroupId Unique identifier of the self-hosted runner group.
     * @param requestBody
     * @returns runner_groups_org Response
     * @throws ApiError
     */
    public static actionsUpdateSelfHostedRunnerGroupForOrg(
        org: string,
        runnerGroupId: number,
        requestBody: {
            /**
             * Name of the runner group.
             */
            name: string;
            /**
             * Visibility of a runner group. You can select all repositories, select individual repositories, or all private repositories.
             */
            visibility?: 'selected' | 'all' | 'private';
            /**
             * Whether the runner group can be used by `public` repositories.
             */
            allows_public_repositories?: boolean;
            /**
             * If `true`, the runner group will be restricted to running only the workflows specified in the `selected_workflows` array.
             */
            restricted_to_workflows?: boolean;
            /**
             * List of workflows the runner group should be allowed to run. This setting will be ignored unless `restricted_to_workflows` is set to `true`.
             */
            selected_workflows?: Array<string>;
            /**
             * The identifier of a hosted compute network configuration.
             */
            network_configuration_id?: string | null;
        },
    ): CancelablePromise<runner_groups_org> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/orgs/{org}/actions/runner-groups/{runner_group_id}',
            path: {
                'org': org,
                'runner_group_id': runnerGroupId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a self-hosted runner group from an organization
     * Deletes a self-hosted runner group for an organization.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerGroupId Unique identifier of the self-hosted runner group.
     * @returns void
     * @throws ApiError
     */
    public static actionsDeleteSelfHostedRunnerGroupFromOrg(
        org: string,
        runnerGroupId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/actions/runner-groups/{runner_group_id}',
            path: {
                'org': org,
                'runner_group_id': runnerGroupId,
            },
        });
    }
    /**
     * List GitHub-hosted runners in a group for an organization
     * Lists the GitHub-hosted runners in an organization group.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerGroupId Unique identifier of the self-hosted runner group.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListGithubHostedRunnersInGroupForOrg(
        org: string,
        runnerGroupId: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        runners: Array<actions_hosted_runner>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/runner-groups/{runner_group_id}/hosted-runners',
            path: {
                'org': org,
                'runner_group_id': runnerGroupId,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * List repository access to a self-hosted runner group in an organization
     * Lists the repositories with access to a self-hosted runner group configured in an organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerGroupId Unique identifier of the self-hosted runner group.
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListRepoAccessToSelfHostedRunnerGroupInOrg(
        org: string,
        runnerGroupId: number,
        page: number = 1,
        perPage: number = 30,
    ): CancelablePromise<{
        total_count: number;
        repositories: Array<minimal_repository>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/runner-groups/{runner_group_id}/repositories',
            path: {
                'org': org,
                'runner_group_id': runnerGroupId,
            },
            query: {
                'page': page,
                'per_page': perPage,
            },
        });
    }
    /**
     * Set repository access for a self-hosted runner group in an organization
     * Replaces the list of repositories that have access to a self-hosted runner group configured in an organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerGroupId Unique identifier of the self-hosted runner group.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetRepoAccessToSelfHostedRunnerGroupInOrg(
        org: string,
        runnerGroupId: number,
        requestBody: {
            /**
             * List of repository IDs that can access the runner group.
             */
            selected_repository_ids: Array<number>;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/runner-groups/{runner_group_id}/repositories',
            path: {
                'org': org,
                'runner_group_id': runnerGroupId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Add repository access to a self-hosted runner group in an organization
     * Adds a repository to the list of repositories that can access a self-hosted runner group. The runner group must have `visibility` set to `selected`. For more information, see "[Create a self-hosted runner group for an organization](#create-a-self-hosted-runner-group-for-an-organization)."
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerGroupId Unique identifier of the self-hosted runner group.
     * @param repositoryId The unique identifier of the repository.
     * @returns void
     * @throws ApiError
     */
    public static actionsAddRepoAccessToSelfHostedRunnerGroupInOrg(
        org: string,
        runnerGroupId: number,
        repositoryId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/runner-groups/{runner_group_id}/repositories/{repository_id}',
            path: {
                'org': org,
                'runner_group_id': runnerGroupId,
                'repository_id': repositoryId,
            },
        });
    }
    /**
     * Remove repository access to a self-hosted runner group in an organization
     * Removes a repository from the list of selected repositories that can access a self-hosted runner group. The runner group must have `visibility` set to `selected`. For more information, see "[Create a self-hosted runner group for an organization](#create-a-self-hosted-runner-group-for-an-organization)."
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerGroupId Unique identifier of the self-hosted runner group.
     * @param repositoryId The unique identifier of the repository.
     * @returns void
     * @throws ApiError
     */
    public static actionsRemoveRepoAccessToSelfHostedRunnerGroupInOrg(
        org: string,
        runnerGroupId: number,
        repositoryId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/actions/runner-groups/{runner_group_id}/repositories/{repository_id}',
            path: {
                'org': org,
                'runner_group_id': runnerGroupId,
                'repository_id': repositoryId,
            },
        });
    }
    /**
     * List self-hosted runners in a group for an organization
     * Lists self-hosted runners that are in a specific organization group.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerGroupId Unique identifier of the self-hosted runner group.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListSelfHostedRunnersInGroupForOrg(
        org: string,
        runnerGroupId: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        runners: Array<runner>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/runner-groups/{runner_group_id}/runners',
            path: {
                'org': org,
                'runner_group_id': runnerGroupId,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Set self-hosted runners in a group for an organization
     * Replaces the list of self-hosted runners that are part of an organization runner group.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerGroupId Unique identifier of the self-hosted runner group.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetSelfHostedRunnersInGroupForOrg(
        org: string,
        runnerGroupId: number,
        requestBody: {
            /**
             * List of runner IDs to add to the runner group.
             */
            runners: Array<number>;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/runner-groups/{runner_group_id}/runners',
            path: {
                'org': org,
                'runner_group_id': runnerGroupId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Add a self-hosted runner to a group for an organization
     * Adds a self-hosted runner to a runner group configured in an organization.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerGroupId Unique identifier of the self-hosted runner group.
     * @param runnerId Unique identifier of the self-hosted runner.
     * @returns void
     * @throws ApiError
     */
    public static actionsAddSelfHostedRunnerToGroupForOrg(
        org: string,
        runnerGroupId: number,
        runnerId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/runner-groups/{runner_group_id}/runners/{runner_id}',
            path: {
                'org': org,
                'runner_group_id': runnerGroupId,
                'runner_id': runnerId,
            },
        });
    }
    /**
     * Remove a self-hosted runner from a group for an organization
     * Removes a self-hosted runner from a group configured in an organization. The runner is then returned to the default group.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerGroupId Unique identifier of the self-hosted runner group.
     * @param runnerId Unique identifier of the self-hosted runner.
     * @returns void
     * @throws ApiError
     */
    public static actionsRemoveSelfHostedRunnerFromGroupForOrg(
        org: string,
        runnerGroupId: number,
        runnerId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/actions/runner-groups/{runner_group_id}/runners/{runner_id}',
            path: {
                'org': org,
                'runner_group_id': runnerGroupId,
                'runner_id': runnerId,
            },
        });
    }
    /**
     * List self-hosted runners for an organization
     * Lists all self-hosted runners configured in an organization.
     *
     * Authenticated users must have admin access to the organization to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint. If the repository is private, the `repo` scope is also required.
     * @param org The organization name. The name is not case sensitive.
     * @param name The name of a self-hosted runner.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListSelfHostedRunnersForOrg(
        org: string,
        name?: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        runners: Array<runner>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/runners',
            path: {
                'org': org,
            },
            query: {
                'name': name,
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * List runner applications for an organization
     * Lists binaries for the runner application that you can download and run.
     *
     * Authenticated users must have admin access to the organization to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.  If the repository is private, the `repo` scope is also required.
     * @param org The organization name. The name is not case sensitive.
     * @returns runner_application Response
     * @throws ApiError
     */
    public static actionsListRunnerApplicationsForOrg(
        org: string,
    ): CancelablePromise<Array<runner_application>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/runners/downloads',
            path: {
                'org': org,
            },
        });
    }
    /**
     * Create configuration for a just-in-time runner for an organization
     * Generates a configuration that can be passed to the runner application at startup.
     *
     * The authenticated user must have admin access to the organization.
     *
     * OAuth tokens and personal access tokens (classic) need the`admin:org` scope to use this endpoint. If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns any Response
     * @throws ApiError
     */
    public static actionsGenerateRunnerJitconfigForOrg(
        org: string,
        requestBody: {
            /**
             * The name of the new runner.
             */
            name: string;
            /**
             * The ID of the runner group to register the runner to.
             */
            runner_group_id: number;
            /**
             * The names of the custom labels to add to the runner. **Minimum items**: 1. **Maximum items**: 100.
             */
            labels: Array<string>;
            /**
             * The working directory to be used for job execution, relative to the runner install directory.
             */
            work_folder?: string;
        },
    ): CancelablePromise<{
        runner: runner;
        /**
         * The base64 encoded runner configuration.
         */
        encoded_jit_config: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/actions/runners/generate-jitconfig',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
                409: `Conflict`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Create a registration token for an organization
     * Returns a token that you can pass to the `config` script. The token expires after one hour.
     *
     * For example, you can replace `TOKEN` in the following example with the registration token provided by this endpoint to configure your self-hosted runner:
     *
     * ```
     * ./config.sh --url https://github.com/octo-org --token TOKEN
     * ```
     *
     * Authenticated users must have admin access to the organization to use this endpoint.
     *
     * OAuth tokens and personal access tokens (classic) need the`admin:org` scope to use this endpoint. If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @returns authentication_token Response
     * @throws ApiError
     */
    public static actionsCreateRegistrationTokenForOrg(
        org: string,
    ): CancelablePromise<authentication_token> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/actions/runners/registration-token',
            path: {
                'org': org,
            },
        });
    }
    /**
     * Create a remove token for an organization
     * Returns a token that you can pass to the `config` script to remove a self-hosted runner from an organization. The token expires after one hour.
     *
     * For example, you can replace `TOKEN` in the following example with the registration token provided by this endpoint to remove your self-hosted runner from an organization:
     *
     * ```
     * ./config.sh remove --token TOKEN
     * ```
     *
     * Authenticated users must have admin access to the organization to use this endpoint.
     *
     * OAuth tokens and personal access tokens (classic) need the`admin:org` scope to use this endpoint. If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @returns authentication_token Response
     * @throws ApiError
     */
    public static actionsCreateRemoveTokenForOrg(
        org: string,
    ): CancelablePromise<authentication_token> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/actions/runners/remove-token',
            path: {
                'org': org,
            },
        });
    }
    /**
     * Get a self-hosted runner for an organization
     * Gets a specific self-hosted runner configured in an organization.
     *
     * Authenticated users must have admin access to the organization to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint. If the repository is private, the `repo` scope is also required.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerId Unique identifier of the self-hosted runner.
     * @returns runner Response
     * @throws ApiError
     */
    public static actionsGetSelfHostedRunnerForOrg(
        org: string,
        runnerId: number,
    ): CancelablePromise<runner> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/runners/{runner_id}',
            path: {
                'org': org,
                'runner_id': runnerId,
            },
        });
    }
    /**
     * Delete a self-hosted runner from an organization
     * Forces the removal of a self-hosted runner from an organization. You can use this endpoint to completely remove the runner when the machine you were using no longer exists.
     *
     * Authenticated users must have admin access to the organization to use this endpoint.
     *
     * OAuth tokens and personal access tokens (classic) need the`admin:org` scope to use this endpoint. If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerId Unique identifier of the self-hosted runner.
     * @returns void
     * @throws ApiError
     */
    public static actionsDeleteSelfHostedRunnerFromOrg(
        org: string,
        runnerId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/actions/runners/{runner_id}',
            path: {
                'org': org,
                'runner_id': runnerId,
            },
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List labels for a self-hosted runner for an organization
     * Lists all labels for a self-hosted runner configured in an organization.
     *
     * Authenticated users must have admin access to the organization to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint. If the repository is private, the `repo` scope is also required.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerId Unique identifier of the self-hosted runner.
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListLabelsForSelfHostedRunnerForOrg(
        org: string,
        runnerId: number,
    ): CancelablePromise<{
        total_count: number;
        labels: Array<runner_label>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/runners/{runner_id}/labels',
            path: {
                'org': org,
                'runner_id': runnerId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Add custom labels to a self-hosted runner for an organization
     * Adds custom labels to a self-hosted runner configured in an organization.
     *
     * Authenticated users must have admin access to the organization to use this endpoint.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerId Unique identifier of the self-hosted runner.
     * @param requestBody
     * @returns any Response
     * @throws ApiError
     */
    public static actionsAddCustomLabelsToSelfHostedRunnerForOrg(
        org: string,
        runnerId: number,
        requestBody: {
            /**
             * The names of the custom labels to add to the runner.
             */
            labels: Array<string>;
        },
    ): CancelablePromise<{
        total_count: number;
        labels: Array<runner_label>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/actions/runners/{runner_id}/labels',
            path: {
                'org': org,
                'runner_id': runnerId,
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
     * Set custom labels for a self-hosted runner for an organization
     * Remove all previous custom labels and set the new custom labels for a specific
     * self-hosted runner configured in an organization.
     *
     * Authenticated users must have admin access to the organization to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint. If the repository is private, the `repo` scope is also required.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerId Unique identifier of the self-hosted runner.
     * @param requestBody
     * @returns any Response
     * @throws ApiError
     */
    public static actionsSetCustomLabelsForSelfHostedRunnerForOrg(
        org: string,
        runnerId: number,
        requestBody: {
            /**
             * The names of the custom labels to set for the runner. You can pass an empty array to remove all custom labels.
             */
            labels: Array<string>;
        },
    ): CancelablePromise<{
        total_count: number;
        labels: Array<runner_label>;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/runners/{runner_id}/labels',
            path: {
                'org': org,
                'runner_id': runnerId,
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
     * Remove all custom labels from a self-hosted runner for an organization
     * Remove all custom labels from a self-hosted runner configured in an
     * organization. Returns the remaining read-only labels from the runner.
     *
     * Authenticated users must have admin access to the organization to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint. If the repository is private, the `repo` scope is also required.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerId Unique identifier of the self-hosted runner.
     * @returns any Response
     * @throws ApiError
     */
    public static actionsRemoveAllCustomLabelsFromSelfHostedRunnerForOrg(
        org: string,
        runnerId: number,
    ): CancelablePromise<{
        total_count: number;
        labels: Array<runner_label>;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/actions/runners/{runner_id}/labels',
            path: {
                'org': org,
                'runner_id': runnerId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Remove a custom label from a self-hosted runner for an organization
     * Remove a custom label from a self-hosted runner configured
     * in an organization. Returns the remaining labels from the runner.
     *
     * This endpoint returns a `404 Not Found` status if the custom label is not
     * present on the runner.
     *
     * Authenticated users must have admin access to the organization to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint. If the repository is private, the `repo` scope is also required.
     * @param org The organization name. The name is not case sensitive.
     * @param runnerId Unique identifier of the self-hosted runner.
     * @param name The name of a self-hosted runner's custom label.
     * @returns any Response
     * @throws ApiError
     */
    public static actionsRemoveCustomLabelFromSelfHostedRunnerForOrg(
        org: string,
        runnerId: number,
        name: string,
    ): CancelablePromise<{
        total_count: number;
        labels: Array<runner_label>;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/actions/runners/{runner_id}/labels/{name}',
            path: {
                'org': org,
                'runner_id': runnerId,
                'name': name,
            },
            errors: {
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List organization secrets
     * Lists all secrets available in an organization without revealing their
     * encrypted values.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read secrets.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint. If the repository is private, the `repo` scope is also required.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListOrgSecrets(
        org: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        secrets: Array<organization_actions_secret>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/secrets',
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
     * Get an organization public key
     * Gets your public key, which you need to encrypt secrets. You need to
     * encrypt a secret before you can create or update secrets.
     *
     * The authenticated user must have collaborator access to a repository to create, update, or read secrets.
     *
     * OAuth tokens and personal access tokens (classic) need the`admin:org` scope to use this endpoint. If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @returns actions_public_key Response
     * @throws ApiError
     */
    public static actionsGetOrgPublicKey(
        org: string,
    ): CancelablePromise<actions_public_key> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/secrets/public-key',
            path: {
                'org': org,
            },
        });
    }
    /**
     * Get an organization secret
     * Gets a single organization secret without revealing its encrypted value.
     *
     * The authenticated user must have collaborator access to a repository to create, update, or read secrets
     *
     * OAuth tokens and personal access tokens (classic) need the`admin:org` scope to use this endpoint. If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param secretName The name of the secret.
     * @returns organization_actions_secret Response
     * @throws ApiError
     */
    public static actionsGetOrgSecret(
        org: string,
        secretName: string,
    ): CancelablePromise<organization_actions_secret> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/secrets/{secret_name}',
            path: {
                'org': org,
                'secret_name': secretName,
            },
        });
    }
    /**
     * Create or update an organization secret
     * Creates or updates an organization secret with an encrypted value. Encrypt your secret using
     * [LibSodium](https://libsodium.gitbook.io/doc/bindings_for_other_languages). For more information, see "[Encrypting secrets for the REST API](https://docs.github.com/rest/guides/encrypting-secrets-for-the-rest-api)."
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read secrets.
     *
     * OAuth tokens and personal access tokens (classic) need the`admin:org` scope to use this endpoint. If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param secretName The name of the secret.
     * @param requestBody
     * @returns empty_object Response when creating a secret
     * @throws ApiError
     */
    public static actionsCreateOrUpdateOrgSecret(
        org: string,
        secretName: string,
        requestBody: {
            /**
             * Value for your secret, encrypted with [LibSodium](https://libsodium.gitbook.io/doc/bindings_for_other_languages) using the public key retrieved from the [Get an organization public key](https://docs.github.com/rest/actions/secrets#get-an-organization-public-key) endpoint.
             */
            encrypted_value: string;
            /**
             * ID of the key you used to encrypt the secret.
             */
            key_id: string;
            /**
             * Which type of organization repositories have access to the organization secret. `selected` means only the repositories specified by `selected_repository_ids` can access the secret.
             */
            visibility: 'all' | 'private' | 'selected';
            /**
             * An array of repository ids that can access the organization secret. You can only provide a list of repository ids when the `visibility` is set to `selected`. You can manage the list of selected repositories using the [List selected repositories for an organization secret](https://docs.github.com/rest/actions/secrets#list-selected-repositories-for-an-organization-secret), [Set selected repositories for an organization secret](https://docs.github.com/rest/actions/secrets#set-selected-repositories-for-an-organization-secret), and [Remove selected repository from an organization secret](https://docs.github.com/rest/actions/secrets#remove-selected-repository-from-an-organization-secret) endpoints.
             */
            selected_repository_ids?: Array<number>;
        },
    ): CancelablePromise<empty_object> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/secrets/{secret_name}',
            path: {
                'org': org,
                'secret_name': secretName,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete an organization secret
     * Deletes a secret in an organization using the secret name.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read secrets.
     *
     * OAuth tokens and personal access tokens (classic) need the`admin:org` scope to use this endpoint. If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param secretName The name of the secret.
     * @returns void
     * @throws ApiError
     */
    public static actionsDeleteOrgSecret(
        org: string,
        secretName: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/actions/secrets/{secret_name}',
            path: {
                'org': org,
                'secret_name': secretName,
            },
        });
    }
    /**
     * List selected repositories for an organization secret
     * Lists all repositories that have been selected when the `visibility`
     * for repository access to a secret is set to `selected`.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read secrets.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint. If the repository is private, the `repo` scope is also required.
     * @param org The organization name. The name is not case sensitive.
     * @param secretName The name of the secret.
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListSelectedReposForOrgSecret(
        org: string,
        secretName: string,
        page: number = 1,
        perPage: number = 30,
    ): CancelablePromise<{
        total_count: number;
        repositories: Array<minimal_repository>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/secrets/{secret_name}/repositories',
            path: {
                'org': org,
                'secret_name': secretName,
            },
            query: {
                'page': page,
                'per_page': perPage,
            },
        });
    }
    /**
     * Set selected repositories for an organization secret
     * Replaces all repositories for an organization secret when the `visibility`
     * for repository access is set to `selected`. The visibility is set when you [Create
     * or update an organization secret](https://docs.github.com/rest/actions/secrets#create-or-update-an-organization-secret).
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read secrets.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint. If the repository is private, the `repo` scope is also required.
     * @param org The organization name. The name is not case sensitive.
     * @param secretName The name of the secret.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetSelectedReposForOrgSecret(
        org: string,
        secretName: string,
        requestBody: {
            /**
             * An array of repository ids that can access the organization secret. You can only provide a list of repository ids when the `visibility` is set to `selected`. You can add and remove individual repositories using the [Add selected repository to an organization secret](https://docs.github.com/rest/actions/secrets#add-selected-repository-to-an-organization-secret) and [Remove selected repository from an organization secret](https://docs.github.com/rest/actions/secrets#remove-selected-repository-from-an-organization-secret) endpoints.
             */
            selected_repository_ids: Array<number>;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/secrets/{secret_name}/repositories',
            path: {
                'org': org,
                'secret_name': secretName,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Add selected repository to an organization secret
     * Adds a repository to an organization secret when the `visibility` for
     * repository access is set to `selected`. For more information about setting the visibility, see [Create or
     * update an organization secret](https://docs.github.com/rest/actions/secrets#create-or-update-an-organization-secret).
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read secrets.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint. If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param secretName The name of the secret.
     * @param repositoryId
     * @returns void
     * @throws ApiError
     */
    public static actionsAddSelectedRepoToOrgSecret(
        org: string,
        secretName: string,
        repositoryId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}',
            path: {
                'org': org,
                'secret_name': secretName,
                'repository_id': repositoryId,
            },
            errors: {
                409: `Conflict when visibility type is not set to selected`,
            },
        });
    }
    /**
     * Remove selected repository from an organization secret
     * Removes a repository from an organization secret when the `visibility`
     * for repository access is set to `selected`. The visibility is set when you [Create
     * or update an organization secret](https://docs.github.com/rest/actions/secrets#create-or-update-an-organization-secret).
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read secrets.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint. If the repository is private, the `repo` scope is also required.
     * @param org The organization name. The name is not case sensitive.
     * @param secretName The name of the secret.
     * @param repositoryId
     * @returns void
     * @throws ApiError
     */
    public static actionsRemoveSelectedRepoFromOrgSecret(
        org: string,
        secretName: string,
        repositoryId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}',
            path: {
                'org': org,
                'secret_name': secretName,
                'repository_id': repositoryId,
            },
            errors: {
                409: `Conflict when visibility type not set to selected`,
            },
        });
    }
    /**
     * List organization variables
     * Lists all organization variables.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read variables.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint. If the repository is private, the `repo` scope is also required.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 30). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListOrgVariables(
        org: string,
        perPage: number = 10,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        variables: Array<organization_actions_variable>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/variables',
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
     * Create an organization variable
     * Creates an organization variable that you can reference in a GitHub Actions workflow.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read variables.
     *
     * OAuth tokens and personal access tokens (classic) need the`admin:org` scope to use this endpoint. If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns empty_object Response when creating a variable
     * @throws ApiError
     */
    public static actionsCreateOrgVariable(
        org: string,
        requestBody: {
            /**
             * The name of the variable.
             */
            name: string;
            /**
             * The value of the variable.
             */
            value: string;
            /**
             * The type of repositories in the organization that can access the variable. `selected` means only the repositories specified by `selected_repository_ids` can access the variable.
             */
            visibility: 'all' | 'private' | 'selected';
            /**
             * An array of repository ids that can access the organization variable. You can only provide a list of repository ids when the `visibility` is set to `selected`.
             */
            selected_repository_ids?: Array<number>;
        },
    ): CancelablePromise<empty_object> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/actions/variables',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get an organization variable
     * Gets a specific variable in an organization.
     *
     * The authenticated user must have collaborator access to a repository to create, update, or read variables.
     *
     * OAuth tokens and personal access tokens (classic) need the`admin:org` scope to use this endpoint. If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param name The name of the variable.
     * @returns organization_actions_variable Response
     * @throws ApiError
     */
    public static actionsGetOrgVariable(
        org: string,
        name: string,
    ): CancelablePromise<organization_actions_variable> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/variables/{name}',
            path: {
                'org': org,
                'name': name,
            },
        });
    }
    /**
     * Update an organization variable
     * Updates an organization variable that you can reference in a GitHub Actions workflow.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read variables.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint. If the repository is private, the `repo` scope is also required.
     * @param org The organization name. The name is not case sensitive.
     * @param name The name of the variable.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsUpdateOrgVariable(
        org: string,
        name: string,
        requestBody: {
            /**
             * The name of the variable.
             */
            name?: string;
            /**
             * The value of the variable.
             */
            value?: string;
            /**
             * The type of repositories in the organization that can access the variable. `selected` means only the repositories specified by `selected_repository_ids` can access the variable.
             */
            visibility?: 'all' | 'private' | 'selected';
            /**
             * An array of repository ids that can access the organization variable. You can only provide a list of repository ids when the `visibility` is set to `selected`.
             */
            selected_repository_ids?: Array<number>;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/orgs/{org}/actions/variables/{name}',
            path: {
                'org': org,
                'name': name,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete an organization variable
     * Deletes an organization variable using the variable name.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read variables.
     *
     * OAuth tokens and personal access tokens (classic) need the`admin:org` scope to use this endpoint. If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param name The name of the variable.
     * @returns void
     * @throws ApiError
     */
    public static actionsDeleteOrgVariable(
        org: string,
        name: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/actions/variables/{name}',
            path: {
                'org': org,
                'name': name,
            },
        });
    }
    /**
     * List selected repositories for an organization variable
     * Lists all repositories that can access an organization variable
     * that is available to selected repositories.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read variables.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint. If the repository is private, the `repo` scope is also required.
     * @param org The organization name. The name is not case sensitive.
     * @param name The name of the variable.
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListSelectedReposForOrgVariable(
        org: string,
        name: string,
        page: number = 1,
        perPage: number = 30,
    ): CancelablePromise<{
        total_count: number;
        repositories: Array<minimal_repository>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/actions/variables/{name}/repositories',
            path: {
                'org': org,
                'name': name,
            },
            query: {
                'page': page,
                'per_page': perPage,
            },
            errors: {
                409: `Response when the visibility of the variable is not set to \`selected\``,
            },
        });
    }
    /**
     * Set selected repositories for an organization variable
     * Replaces all repositories for an organization variable that is available
     * to selected repositories. Organization variables that are available to selected
     * repositories have their `visibility` field set to `selected`.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read variables.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint. If the repository is private, the `repo` scope is also required.
     * @param org The organization name. The name is not case sensitive.
     * @param name The name of the variable.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetSelectedReposForOrgVariable(
        org: string,
        name: string,
        requestBody: {
            /**
             * The IDs of the repositories that can access the organization variable.
             */
            selected_repository_ids: Array<number>;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/variables/{name}/repositories',
            path: {
                'org': org,
                'name': name,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Response when the visibility of the variable is not set to \`selected\``,
            },
        });
    }
    /**
     * Add selected repository to an organization variable
     * Adds a repository to an organization variable that is available to selected repositories.
     * Organization variables that are available to selected repositories have their `visibility` field set to `selected`.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read secrets.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint. If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param org The organization name. The name is not case sensitive.
     * @param name The name of the variable.
     * @param repositoryId
     * @returns void
     * @throws ApiError
     */
    public static actionsAddSelectedRepoToOrgVariable(
        org: string,
        name: string,
        repositoryId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/actions/variables/{name}/repositories/{repository_id}',
            path: {
                'org': org,
                'name': name,
                'repository_id': repositoryId,
            },
            errors: {
                409: `Response when the visibility of the variable is not set to \`selected\``,
            },
        });
    }
    /**
     * Remove selected repository from an organization variable
     * Removes a repository from an organization variable that is
     * available to selected repositories. Organization variables that are available to
     * selected repositories have their `visibility` field set to `selected`.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read variables.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to use this endpoint. If the repository is private, the `repo` scope is also required.
     * @param org The organization name. The name is not case sensitive.
     * @param name The name of the variable.
     * @param repositoryId
     * @returns void
     * @throws ApiError
     */
    public static actionsRemoveSelectedRepoFromOrgVariable(
        org: string,
        name: string,
        repositoryId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/actions/variables/{name}/repositories/{repository_id}',
            path: {
                'org': org,
                'name': name,
                'repository_id': repositoryId,
            },
            errors: {
                409: `Response when the visibility of the variable is not set to \`selected\``,
            },
        });
    }
    /**
     * List artifacts for a repository
     * Lists all artifacts for a repository.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param name The name field of an artifact. When specified, only artifacts with this name will be returned.
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListArtifactsForRepo(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
        name?: string,
    ): CancelablePromise<{
        total_count: number;
        artifacts: Array<artifact>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/artifacts',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'per_page': perPage,
                'page': page,
                'name': name,
            },
        });
    }
    /**
     * Get an artifact
     * Gets a specific artifact for a workflow run.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param artifactId The unique identifier of the artifact.
     * @returns artifact Response
     * @throws ApiError
     */
    public static actionsGetArtifact(
        owner: string,
        repo: string,
        artifactId: number,
    ): CancelablePromise<artifact> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/artifacts/{artifact_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'artifact_id': artifactId,
            },
        });
    }
    /**
     * Delete an artifact
     * Deletes an artifact for a workflow run.
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param artifactId The unique identifier of the artifact.
     * @returns void
     * @throws ApiError
     */
    public static actionsDeleteArtifact(
        owner: string,
        repo: string,
        artifactId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/actions/artifacts/{artifact_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'artifact_id': artifactId,
            },
        });
    }
    /**
     * Download an artifact
     * Gets a redirect URL to download an archive for a repository. This URL expires after 1 minute. Look for `Location:` in
     * the response header to find the URL for the download. The `:archive_format` must be `zip`.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param artifactId The unique identifier of the artifact.
     * @param archiveFormat
     * @returns void
     * @throws ApiError
     */
    public static actionsDownloadArtifact(
        owner: string,
        repo: string,
        artifactId: number,
        archiveFormat: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}',
            path: {
                'owner': owner,
                'repo': repo,
                'artifact_id': artifactId,
                'archive_format': archiveFormat,
            },
            errors: {
                302: `Response`,
                410: `Gone`,
            },
        });
    }
    /**
     * Get GitHub Actions cache retention limit for a repository
     * Gets GitHub Actions cache retention limit for a repository. This determines how long caches will be retained for, if
     * not manually removed or evicted due to size constraints.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:repository` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns actions_cache_retention_limit_for_repository Response
     * @throws ApiError
     */
    public static actionsGetActionsCacheRetentionLimitForRepository(
        owner: string,
        repo: string,
    ): CancelablePromise<actions_cache_retention_limit_for_repository> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/cache/retention-limit',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Set GitHub Actions cache retention limit for a repository
     * Sets GitHub Actions cache retention limit for a repository. This determines how long caches will be retained for, if
     * not manually removed or evicted due to size constraints.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:repository` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetActionsCacheRetentionLimitForRepository(
        owner: string,
        repo: string,
        requestBody: actions_cache_retention_limit_for_repository,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/actions/cache/retention-limit',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get GitHub Actions cache storage limit for a repository
     * Gets GitHub Actions cache storage limit for a repository. This determines the maximum size of caches that can be
     * stored before eviction occurs.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:repository` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns actions_cache_storage_limit_for_repository Response
     * @throws ApiError
     */
    public static actionsGetActionsCacheStorageLimitForRepository(
        owner: string,
        repo: string,
    ): CancelablePromise<actions_cache_storage_limit_for_repository> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/cache/storage-limit',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Set GitHub Actions cache storage limit for a repository
     * Sets GitHub Actions cache storage limit for a repository. This determines the maximum size of caches that can be
     * stored before eviction occurs.
     *
     * OAuth tokens and personal access tokens (classic) need the `admin:repository` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetActionsCacheStorageLimitForRepository(
        owner: string,
        repo: string,
        requestBody: actions_cache_storage_limit_for_repository,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/actions/cache/storage-limit',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get GitHub Actions cache usage for a repository
     * Gets GitHub Actions cache usage for a repository.
     * The data fetched using this API is refreshed approximately every 5 minutes, so values returned from this endpoint may take at least 5 minutes to get updated.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns actions_cache_usage_by_repository Response
     * @throws ApiError
     */
    public static actionsGetActionsCacheUsage(
        owner: string,
        repo: string,
    ): CancelablePromise<actions_cache_usage_by_repository> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/cache/usage',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * List GitHub Actions caches for a repository
     * Lists the GitHub Actions caches for a repository.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param ref The full Git reference for narrowing down the cache. The `ref` for a branch should be formatted as `refs/heads/<branch name>`. To reference a pull request use `refs/pull/<number>/merge`.
     * @param key An explicit key or prefix for identifying the cache
     * @param sort The property to sort the results by. `created_at` means when the cache was created. `last_accessed_at` means when the cache was last accessed. `size_in_bytes` is the size of the cache in bytes.
     * @param direction The direction to sort the results by.
     * @returns actions_cache_list Response
     * @throws ApiError
     */
    public static actionsGetActionsCacheList(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
        ref?: string,
        key?: string,
        sort: 'created_at' | 'last_accessed_at' | 'size_in_bytes' = 'last_accessed_at',
        direction: 'asc' | 'desc' = 'desc',
    ): CancelablePromise<actions_cache_list> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/caches',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'per_page': perPage,
                'page': page,
                'ref': ref,
                'key': key,
                'sort': sort,
                'direction': direction,
            },
        });
    }
    /**
     * Delete GitHub Actions caches for a repository (using a cache key)
     * Deletes one or more GitHub Actions caches for a repository, using a complete cache key. By default, all caches that match the provided key are deleted, but you can optionally provide a Git ref to restrict deletions to caches that match both the provided key and the Git ref.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param key A key for identifying the cache.
     * @param ref The full Git reference for narrowing down the cache. The `ref` for a branch should be formatted as `refs/heads/<branch name>`. To reference a pull request use `refs/pull/<number>/merge`.
     * @returns actions_cache_list Response
     * @throws ApiError
     */
    public static actionsDeleteActionsCacheByKey(
        owner: string,
        repo: string,
        key: string,
        ref?: string,
    ): CancelablePromise<actions_cache_list> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/actions/caches',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'key': key,
                'ref': ref,
            },
        });
    }
    /**
     * Delete a GitHub Actions cache for a repository (using a cache ID)
     * Deletes a GitHub Actions cache for a repository, using a cache ID.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param cacheId The unique identifier of the GitHub Actions cache.
     * @returns void
     * @throws ApiError
     */
    public static actionsDeleteActionsCacheById(
        owner: string,
        repo: string,
        cacheId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/actions/caches/{cache_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'cache_id': cacheId,
            },
        });
    }
    /**
     * Get a job for a workflow run
     * Gets a specific job in a workflow run.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param jobId The unique identifier of the job.
     * @returns job Response
     * @throws ApiError
     */
    public static actionsGetJobForWorkflowRun(
        owner: string,
        repo: string,
        jobId: number,
    ): CancelablePromise<job> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/jobs/{job_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'job_id': jobId,
            },
        });
    }
    /**
     * Download job logs for a workflow run
     * Gets a redirect URL to download a plain text file of logs for a workflow job. This link expires after 1 minute. Look
     * for `Location:` in the response header to find the URL for the download.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param jobId The unique identifier of the job.
     * @returns void
     * @throws ApiError
     */
    public static actionsDownloadJobLogsForWorkflowRun(
        owner: string,
        repo: string,
        jobId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/jobs/{job_id}/logs',
            path: {
                'owner': owner,
                'repo': repo,
                'job_id': jobId,
            },
            errors: {
                302: `Response`,
            },
        });
    }
    /**
     * Re-run a job from a workflow run
     * Re-run a job and its dependent jobs in a workflow run.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param jobId The unique identifier of the job.
     * @param requestBody
     * @returns empty_object Response
     * @throws ApiError
     */
    public static actionsReRunJobForWorkflowRun(
        owner: string,
        repo: string,
        jobId: number,
        requestBody?: {
            /**
             * Whether to enable debug logging for the re-run.
             */
            enable_debug_logging?: boolean;
        } | null,
    ): CancelablePromise<empty_object> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/actions/jobs/{job_id}/rerun',
            path: {
                'owner': owner,
                'repo': repo,
                'job_id': jobId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
            },
        });
    }
    /**
     * Get the customization template for an OIDC subject claim for a repository
     * Gets the customization template for an OpenID Connect (OIDC) subject claim.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns oidc_custom_sub_repo Status response
     * @throws ApiError
     */
    public static actionsGetCustomOidcSubClaimForRepo(
        owner: string,
        repo: string,
    ): CancelablePromise<oidc_custom_sub_repo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/oidc/customization/sub',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                400: `Bad Request`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Set the customization template for an OIDC subject claim for a repository
     * Sets the customization template and `opt-in` or `opt-out` flag for an OpenID Connect (OIDC) subject claim for a repository.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns empty_object Empty response
     * @throws ApiError
     */
    public static actionsSetCustomOidcSubClaimForRepo(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * Whether to use the default template or not. If `true`, the `include_claim_keys` field is ignored.
             */
            use_default: boolean;
            /**
             * Array of unique strings. Each claim key can only contain alphanumeric characters and underscores.
             */
            include_claim_keys?: Array<string>;
        },
    ): CancelablePromise<empty_object> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/actions/oidc/customization/sub',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List repository organization secrets
     * Lists all organization secrets shared with a repository without revealing their encrypted
     * values.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read secrets.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListRepoOrganizationSecrets(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        secrets: Array<actions_secret>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/organization-secrets',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * List repository organization variables
     * Lists all organization variables shared with a repository.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read variables.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 30). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListRepoOrganizationVariables(
        owner: string,
        repo: string,
        perPage: number = 10,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        variables: Array<actions_variable>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/organization-variables',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Get GitHub Actions permissions for a repository
     * Gets the GitHub Actions permissions policy for a repository, including whether GitHub Actions is enabled and the actions and reusable workflows allowed to run in the repository.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns actions_repository_permissions Response
     * @throws ApiError
     */
    public static actionsGetGithubActionsPermissionsRepository(
        owner: string,
        repo: string,
    ): CancelablePromise<actions_repository_permissions> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/permissions',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Set GitHub Actions permissions for a repository
     * Sets the GitHub Actions permissions policy for enabling GitHub Actions and allowed actions and reusable workflows in the repository.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetGithubActionsPermissionsRepository(
        owner: string,
        repo: string,
        requestBody: {
            enabled: actions_enabled;
            allowed_actions?: allowed_actions;
            sha_pinning_required?: sha_pinning_required;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/actions/permissions',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get the level of access for workflows outside of the repository
     * Gets the level of access that workflows outside of the repository have to actions and reusable workflows in the repository.
     * This endpoint only applies to private repositories.
     * For more information, see "[Allowing access to components in a private repository](https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#allowing-access-to-components-in-a-private-repository)."
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns actions_workflow_access_to_repository Response
     * @throws ApiError
     */
    public static actionsGetWorkflowAccessToRepository(
        owner: string,
        repo: string,
    ): CancelablePromise<actions_workflow_access_to_repository> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/permissions/access',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Set the level of access for workflows outside of the repository
     * Sets the level of access that workflows outside of the repository have to actions and reusable workflows in the repository.
     * This endpoint only applies to private repositories.
     * For more information, see "[Allowing access to components in a private repository](https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#allowing-access-to-components-in-a-private-repository)".
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetWorkflowAccessToRepository(
        owner: string,
        repo: string,
        requestBody: actions_workflow_access_to_repository,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/actions/permissions/access',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get artifact and log retention settings for a repository
     * Gets artifact and log retention settings for a repository.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns actions_artifact_and_log_retention_response Response
     * @throws ApiError
     */
    public static actionsGetArtifactAndLogRetentionSettingsRepository(
        owner: string,
        repo: string,
    ): CancelablePromise<actions_artifact_and_log_retention_response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/permissions/artifact-and-log-retention',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Set artifact and log retention settings for a repository
     * Sets artifact and log retention settings for a repository.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetArtifactAndLogRetentionSettingsRepository(
        owner: string,
        repo: string,
        requestBody: actions_artifact_and_log_retention,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/actions/permissions/artifact-and-log-retention',
            path: {
                'owner': owner,
                'repo': repo,
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
     * Get fork PR contributor approval permissions for a repository
     * Gets the fork PR contributor approval policy for a repository.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns actions_fork_pr_contributor_approval Response
     * @throws ApiError
     */
    public static actionsGetForkPrContributorApprovalPermissionsRepository(
        owner: string,
        repo: string,
    ): CancelablePromise<actions_fork_pr_contributor_approval> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/permissions/fork-pr-contributor-approval',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Set fork PR contributor approval permissions for a repository
     * Sets the fork PR contributor approval policy for a repository.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetForkPrContributorApprovalPermissionsRepository(
        owner: string,
        repo: string,
        requestBody: actions_fork_pr_contributor_approval,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/actions/permissions/fork-pr-contributor-approval',
            path: {
                'owner': owner,
                'repo': repo,
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
     * Get private repo fork PR workflow settings for a repository
     * Gets the settings for whether workflows from fork pull requests can run on a private repository.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns actions_fork_pr_workflows_private_repos Response
     * @throws ApiError
     */
    public static actionsGetPrivateRepoForkPrWorkflowsSettingsRepository(
        owner: string,
        repo: string,
    ): CancelablePromise<actions_fork_pr_workflows_private_repos> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/permissions/fork-pr-workflows-private-repos',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Set private repo fork PR workflow settings for a repository
     * Sets the settings for whether workflows from fork pull requests can run on a private repository.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetPrivateRepoForkPrWorkflowsSettingsRepository(
        owner: string,
        repo: string,
        requestBody: actions_fork_pr_workflows_private_repos_request,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/actions/permissions/fork-pr-workflows-private-repos',
            path: {
                'owner': owner,
                'repo': repo,
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
     * Get allowed actions and reusable workflows for a repository
     * Gets the settings for selected actions and reusable workflows that are allowed in a repository. To use this endpoint, the repository policy for `allowed_actions` must be configured to `selected`. For more information, see "[Set GitHub Actions permissions for a repository](#set-github-actions-permissions-for-a-repository)."
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns selected_actions Response
     * @throws ApiError
     */
    public static actionsGetAllowedActionsRepository(
        owner: string,
        repo: string,
    ): CancelablePromise<selected_actions> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/permissions/selected-actions',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Set allowed actions and reusable workflows for a repository
     * Sets the actions and reusable workflows that are allowed in a repository. To use this endpoint, the repository permission policy for `allowed_actions` must be configured to `selected`. For more information, see "[Set GitHub Actions permissions for a repository](#set-github-actions-permissions-for-a-repository)."
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetAllowedActionsRepository(
        owner: string,
        repo: string,
        requestBody?: selected_actions,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/actions/permissions/selected-actions',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get default workflow permissions for a repository
     * Gets the default workflow permissions granted to the `GITHUB_TOKEN` when running workflows in a repository,
     * as well as if GitHub Actions can submit approving pull request reviews.
     * For more information, see "[Setting the permissions of the GITHUB_TOKEN for your repository](https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#setting-the-permissions-of-the-github_token-for-your-repository)."
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns actions_get_default_workflow_permissions Response
     * @throws ApiError
     */
    public static actionsGetGithubActionsDefaultWorkflowPermissionsRepository(
        owner: string,
        repo: string,
    ): CancelablePromise<actions_get_default_workflow_permissions> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/permissions/workflow',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Set default workflow permissions for a repository
     * Sets the default workflow permissions granted to the `GITHUB_TOKEN` when running workflows in a repository, and sets if GitHub Actions
     * can submit approving pull request reviews.
     * For more information, see "[Setting the permissions of the GITHUB_TOKEN for your repository](https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#setting-the-permissions-of-the-github_token-for-your-repository)."
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsSetGithubActionsDefaultWorkflowPermissionsRepository(
        owner: string,
        repo: string,
        requestBody: actions_set_default_workflow_permissions,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/actions/permissions/workflow',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Conflict response when changing a setting is prevented by the owning organization`,
            },
        });
    }
    /**
     * List self-hosted runners for a repository
     * Lists all self-hosted runners configured in a repository.
     *
     * Authenticated users must have admin access to the repository to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param name The name of a self-hosted runner.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListSelfHostedRunnersForRepo(
        owner: string,
        repo: string,
        name?: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        runners: Array<runner>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/runners',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'name': name,
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * List runner applications for a repository
     * Lists binaries for the runner application that you can download and run.
     *
     * Authenticated users must have admin access to the repository to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns runner_application Response
     * @throws ApiError
     */
    public static actionsListRunnerApplicationsForRepo(
        owner: string,
        repo: string,
    ): CancelablePromise<Array<runner_application>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/runners/downloads',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Create configuration for a just-in-time runner for a repository
     * Generates a configuration that can be passed to the runner application at startup.
     *
     * The authenticated user must have admin access to the repository.
     *
     * OAuth tokens and personal access tokens (classic) need the`repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns any Response
     * @throws ApiError
     */
    public static actionsGenerateRunnerJitconfigForRepo(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * The name of the new runner.
             */
            name: string;
            /**
             * The ID of the runner group to register the runner to.
             */
            runner_group_id: number;
            /**
             * The names of the custom labels to add to the runner. **Minimum items**: 1. **Maximum items**: 100.
             */
            labels: Array<string>;
            /**
             * The working directory to be used for job execution, relative to the runner install directory.
             */
            work_folder?: string;
        },
    ): CancelablePromise<{
        runner: runner;
        /**
         * The base64 encoded runner configuration.
         */
        encoded_jit_config: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/actions/runners/generate-jitconfig',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
                409: `Conflict`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Create a registration token for a repository
     * Returns a token that you can pass to the `config` script. The token expires after one hour.
     *
     * For example, you can replace `TOKEN` in the following example with the registration token provided by this endpoint to configure your self-hosted runner:
     *
     * ```
     * ./config.sh --url https://github.com/octo-org --token TOKEN
     * ```
     *
     * Authenticated users must have admin access to the repository to use this endpoint.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns authentication_token Response
     * @throws ApiError
     */
    public static actionsCreateRegistrationTokenForRepo(
        owner: string,
        repo: string,
    ): CancelablePromise<authentication_token> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/actions/runners/registration-token',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Create a remove token for a repository
     * Returns a token that you can pass to the `config` script to remove a self-hosted runner from an repository. The token expires after one hour.
     *
     * For example, you can replace `TOKEN` in the following example with the registration token provided by this endpoint to remove your self-hosted runner from an organization:
     *
     * ```
     * ./config.sh remove --token TOKEN
     * ```
     *
     * Authenticated users must have admin access to the repository to use this endpoint.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns authentication_token Response
     * @throws ApiError
     */
    public static actionsCreateRemoveTokenForRepo(
        owner: string,
        repo: string,
    ): CancelablePromise<authentication_token> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/actions/runners/remove-token',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Get a self-hosted runner for a repository
     * Gets a specific self-hosted runner configured in a repository.
     *
     * Authenticated users must have admin access to the repository to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runnerId Unique identifier of the self-hosted runner.
     * @returns runner Response
     * @throws ApiError
     */
    public static actionsGetSelfHostedRunnerForRepo(
        owner: string,
        repo: string,
        runnerId: number,
    ): CancelablePromise<runner> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/runners/{runner_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'runner_id': runnerId,
            },
        });
    }
    /**
     * Delete a self-hosted runner from a repository
     * Forces the removal of a self-hosted runner from a repository. You can use this endpoint to completely remove the runner when the machine you were using no longer exists.
     *
     * Authenticated users must have admin access to the repository to use this endpoint.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runnerId Unique identifier of the self-hosted runner.
     * @returns void
     * @throws ApiError
     */
    public static actionsDeleteSelfHostedRunnerFromRepo(
        owner: string,
        repo: string,
        runnerId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/actions/runners/{runner_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'runner_id': runnerId,
            },
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List labels for a self-hosted runner for a repository
     * Lists all labels for a self-hosted runner configured in a repository.
     *
     * Authenticated users must have admin access to the repository to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runnerId Unique identifier of the self-hosted runner.
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListLabelsForSelfHostedRunnerForRepo(
        owner: string,
        repo: string,
        runnerId: number,
    ): CancelablePromise<{
        total_count: number;
        labels: Array<runner_label>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/runners/{runner_id}/labels',
            path: {
                'owner': owner,
                'repo': repo,
                'runner_id': runnerId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Add custom labels to a self-hosted runner for a repository
     * Adds custom labels to a self-hosted runner configured in a repository.
     *
     * Authenticated users must have admin access to the organization to use this endpoint.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runnerId Unique identifier of the self-hosted runner.
     * @param requestBody
     * @returns any Response
     * @throws ApiError
     */
    public static actionsAddCustomLabelsToSelfHostedRunnerForRepo(
        owner: string,
        repo: string,
        runnerId: number,
        requestBody: {
            /**
             * The names of the custom labels to add to the runner.
             */
            labels: Array<string>;
        },
    ): CancelablePromise<{
        total_count: number;
        labels: Array<runner_label>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/actions/runners/{runner_id}/labels',
            path: {
                'owner': owner,
                'repo': repo,
                'runner_id': runnerId,
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
     * Set custom labels for a self-hosted runner for a repository
     * Remove all previous custom labels and set the new custom labels for a specific
     * self-hosted runner configured in a repository.
     *
     * Authenticated users must have admin access to the repository to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runnerId Unique identifier of the self-hosted runner.
     * @param requestBody
     * @returns any Response
     * @throws ApiError
     */
    public static actionsSetCustomLabelsForSelfHostedRunnerForRepo(
        owner: string,
        repo: string,
        runnerId: number,
        requestBody: {
            /**
             * The names of the custom labels to set for the runner. You can pass an empty array to remove all custom labels.
             */
            labels: Array<string>;
        },
    ): CancelablePromise<{
        total_count: number;
        labels: Array<runner_label>;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/actions/runners/{runner_id}/labels',
            path: {
                'owner': owner,
                'repo': repo,
                'runner_id': runnerId,
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
     * Remove all custom labels from a self-hosted runner for a repository
     * Remove all custom labels from a self-hosted runner configured in a
     * repository. Returns the remaining read-only labels from the runner.
     *
     * Authenticated users must have admin access to the repository to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runnerId Unique identifier of the self-hosted runner.
     * @returns any Response
     * @throws ApiError
     */
    public static actionsRemoveAllCustomLabelsFromSelfHostedRunnerForRepo(
        owner: string,
        repo: string,
        runnerId: number,
    ): CancelablePromise<{
        total_count: number;
        labels: Array<runner_label>;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/actions/runners/{runner_id}/labels',
            path: {
                'owner': owner,
                'repo': repo,
                'runner_id': runnerId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Remove a custom label from a self-hosted runner for a repository
     * Remove a custom label from a self-hosted runner configured
     * in a repository. Returns the remaining labels from the runner.
     *
     * This endpoint returns a `404 Not Found` status if the custom label is not
     * present on the runner.
     *
     * Authenticated users must have admin access to the repository to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runnerId Unique identifier of the self-hosted runner.
     * @param name The name of a self-hosted runner's custom label.
     * @returns any Response
     * @throws ApiError
     */
    public static actionsRemoveCustomLabelFromSelfHostedRunnerForRepo(
        owner: string,
        repo: string,
        runnerId: number,
        name: string,
    ): CancelablePromise<{
        total_count: number;
        labels: Array<runner_label>;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}',
            path: {
                'owner': owner,
                'repo': repo,
                'runner_id': runnerId,
                'name': name,
            },
            errors: {
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List workflow runs for a repository
     * Lists all workflow runs for a repository. You can use parameters to narrow the list of results. For more information about using parameters, see [Parameters](https://docs.github.com/rest/guides/getting-started-with-the-rest-api#parameters).
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     *
     * This endpoint will return up to 1,000 results for each search when using the following parameters: `actor`, `branch`, `check_suite_id`, `created`, `event`, `head_sha`, `status`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param actor Returns someone's workflow runs. Use the login for the user who created the `push` associated with the check suite or workflow run.
     * @param branch Returns workflow runs associated with a branch. Use the name of the branch of the `push`.
     * @param event Returns workflow run triggered by the event you specify. For example, `push`, `pull_request` or `issue`. For more information, see "[Events that trigger workflows](https://docs.github.com/actions/automating-your-workflow-with-github-actions/events-that-trigger-workflows)."
     * @param status Returns workflow runs with the check run `status` or `conclusion` that you specify. For example, a conclusion can be `success` or a status can be `in_progress`. Only GitHub Actions can set a status of `waiting`, `pending`, or `requested`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param created Returns workflow runs created within the given date-time range. For more information on the syntax, see "[Understanding the search syntax](https://docs.github.com/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax#query-for-dates)."
     * @param excludePullRequests If `true` pull requests are omitted from the response (empty array).
     * @param checkSuiteId Returns workflow runs with the `check_suite_id` that you specify.
     * @param headSha Only returns workflow runs that are associated with the specified `head_sha`.
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListWorkflowRunsForRepo(
        owner: string,
        repo: string,
        actor?: string,
        branch?: string,
        event?: string,
        status?: 'completed' | 'action_required' | 'cancelled' | 'failure' | 'neutral' | 'skipped' | 'stale' | 'success' | 'timed_out' | 'in_progress' | 'queued' | 'requested' | 'waiting' | 'pending',
        perPage: number = 30,
        page: number = 1,
        created?: string,
        excludePullRequests: boolean = false,
        checkSuiteId?: number,
        headSha?: string,
    ): CancelablePromise<{
        total_count: number;
        workflow_runs: Array<workflow_run>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/runs',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'actor': actor,
                'branch': branch,
                'event': event,
                'status': status,
                'per_page': perPage,
                'page': page,
                'created': created,
                'exclude_pull_requests': excludePullRequests,
                'check_suite_id': checkSuiteId,
                'head_sha': headSha,
            },
        });
    }
    /**
     * Get a workflow run
     * Gets a specific workflow run.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @param excludePullRequests If `true` pull requests are omitted from the response (empty array).
     * @returns workflow_run Response
     * @throws ApiError
     */
    public static actionsGetWorkflowRun(
        owner: string,
        repo: string,
        runId: number,
        excludePullRequests: boolean = false,
    ): CancelablePromise<workflow_run> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
            },
            query: {
                'exclude_pull_requests': excludePullRequests,
            },
        });
    }
    /**
     * Delete a workflow run
     * Deletes a specific workflow run.
     *
     * Anyone with write access to the repository can use this endpoint.
     *
     * If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @returns void
     * @throws ApiError
     */
    public static actionsDeleteWorkflowRun(
        owner: string,
        repo: string,
        runId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
            },
        });
    }
    /**
     * Get the review history for a workflow run
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @returns environment_approvals Response
     * @throws ApiError
     */
    public static actionsGetReviewsForRun(
        owner: string,
        repo: string,
        runId: number,
    ): CancelablePromise<Array<environment_approvals>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}/approvals',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
            },
        });
    }
    /**
     * Approve a workflow run for a fork pull request
     * Approves a workflow run for a pull request from a public fork of a first time contributor. For more information, see ["Approving workflow runs from public forks](https://docs.github.com/actions/managing-workflow-runs/approving-workflow-runs-from-public-forks)."
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @returns empty_object Response
     * @throws ApiError
     */
    public static actionsApproveWorkflowRun(
        owner: string,
        repo: string,
        runId: number,
    ): CancelablePromise<empty_object> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}/approve',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * List workflow run artifacts
     * Lists artifacts for a workflow run.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param name The name field of an artifact. When specified, only artifacts with this name will be returned.
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListWorkflowRunArtifacts(
        owner: string,
        repo: string,
        runId: number,
        perPage: number = 30,
        page: number = 1,
        name?: string,
    ): CancelablePromise<{
        total_count: number;
        artifacts: Array<artifact>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}/artifacts',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
            },
            query: {
                'per_page': perPage,
                'page': page,
                'name': name,
            },
        });
    }
    /**
     * Get a workflow run attempt
     * Gets a specific workflow run attempt.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @param attemptNumber The attempt number of the workflow run.
     * @param excludePullRequests If `true` pull requests are omitted from the response (empty array).
     * @returns workflow_run Response
     * @throws ApiError
     */
    public static actionsGetWorkflowRunAttempt(
        owner: string,
        repo: string,
        runId: number,
        attemptNumber: number,
        excludePullRequests: boolean = false,
    ): CancelablePromise<workflow_run> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
                'attempt_number': attemptNumber,
            },
            query: {
                'exclude_pull_requests': excludePullRequests,
            },
        });
    }
    /**
     * List jobs for a workflow run attempt
     * Lists jobs for a specific workflow run attempt. You can use parameters to narrow the list of results. For more information
     * about using parameters, see [Parameters](https://docs.github.com/rest/guides/getting-started-with-the-rest-api#parameters).
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint  with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @param attemptNumber The attempt number of the workflow run.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListJobsForWorkflowRunAttempt(
        owner: string,
        repo: string,
        runId: number,
        attemptNumber: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        jobs: Array<job>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
                'attempt_number': attemptNumber,
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
     * Download workflow run attempt logs
     * Gets a redirect URL to download an archive of log files for a specific workflow run attempt. This link expires after
     * 1 minute. Look for `Location:` in the response header to find the URL for the download.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @param attemptNumber The attempt number of the workflow run.
     * @returns void
     * @throws ApiError
     */
    public static actionsDownloadWorkflowRunAttemptLogs(
        owner: string,
        repo: string,
        runId: number,
        attemptNumber: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
                'attempt_number': attemptNumber,
            },
            errors: {
                302: `Response`,
            },
        });
    }
    /**
     * Cancel a workflow run
     * Cancels a workflow run using its `id`.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @returns empty_object Response
     * @throws ApiError
     */
    public static actionsCancelWorkflowRun(
        owner: string,
        repo: string,
        runId: number,
    ): CancelablePromise<empty_object> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}/cancel',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
            },
            errors: {
                409: `Conflict`,
            },
        });
    }
    /**
     * Review custom deployment protection rules for a workflow run
     * Approve or reject custom deployment protection rules provided by a GitHub App for a workflow run. For more information, see "[Using environments for deployment](https://docs.github.com/actions/deployment/targeting-different-environments/using-environments-for-deployment)."
     *
     * > [!NOTE]
     * > GitHub Apps can only review their own custom deployment protection rules. To approve or reject pending deployments that are waiting for review from a specific person or team, see [`POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments`](/rest/actions/workflow-runs#review-pending-deployments-for-a-workflow-run).
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsReviewCustomGatesForRun(
        owner: string,
        repo: string,
        runId: number,
        requestBody: (review_custom_gates_comment_required | review_custom_gates_state_required),
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Force cancel a workflow run
     * Cancels a workflow run and bypasses conditions that would otherwise cause a workflow execution to continue, such as an `always()` condition on a job.
     * You should only use this endpoint to cancel a workflow run when the workflow run is not responding to [`POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel`](/rest/actions/workflow-runs#cancel-a-workflow-run).
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @returns empty_object Response
     * @throws ApiError
     */
    public static actionsForceCancelWorkflowRun(
        owner: string,
        repo: string,
        runId: number,
    ): CancelablePromise<empty_object> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}/force-cancel',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
            },
            errors: {
                409: `Conflict`,
            },
        });
    }
    /**
     * List jobs for a workflow run
     * Lists jobs for a workflow run. You can use parameters to narrow the list of results. For more information
     * about using parameters, see [Parameters](https://docs.github.com/rest/guides/getting-started-with-the-rest-api#parameters).
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @param filter Filters jobs by their `completed_at` timestamp. `latest` returns jobs from the most recent execution of the workflow run. `all` returns all jobs for a workflow run, including from old executions of the workflow run.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListJobsForWorkflowRun(
        owner: string,
        repo: string,
        runId: number,
        filter: 'latest' | 'all' = 'latest',
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        jobs: Array<job>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}/jobs',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
            },
            query: {
                'filter': filter,
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Download workflow run logs
     * Gets a redirect URL to download an archive of log files for a workflow run. This link expires after 1 minute. Look for
     * `Location:` in the response header to find the URL for the download.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @returns void
     * @throws ApiError
     */
    public static actionsDownloadWorkflowRunLogs(
        owner: string,
        repo: string,
        runId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}/logs',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
            },
            errors: {
                302: `Response`,
            },
        });
    }
    /**
     * Delete workflow run logs
     * Deletes all logs for a workflow run.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @returns void
     * @throws ApiError
     */
    public static actionsDeleteWorkflowRunLogs(
        owner: string,
        repo: string,
        runId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}/logs',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
            },
            errors: {
                403: `Forbidden`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * Get pending deployments for a workflow run
     * Get all deployment environments for a workflow run that are waiting for protection rules to pass.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @returns pending_deployment Response
     * @throws ApiError
     */
    public static actionsGetPendingDeploymentsForRun(
        owner: string,
        repo: string,
        runId: number,
    ): CancelablePromise<Array<pending_deployment>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
            },
        });
    }
    /**
     * Review pending deployments for a workflow run
     * Approve or reject pending deployments that are waiting on approval by a required reviewer.
     *
     * Required reviewers with read access to the repository contents and deployments can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @param requestBody
     * @returns deployment Response
     * @throws ApiError
     */
    public static actionsReviewPendingDeploymentsForRun(
        owner: string,
        repo: string,
        runId: number,
        requestBody: {
            /**
             * The list of environment ids to approve or reject
             */
            environment_ids: Array<number>;
            /**
             * Whether to approve or reject deployment to the specified environments.
             */
            state: 'approved' | 'rejected';
            /**
             * A comment to accompany the deployment review
             */
            comment: string;
        },
    ): CancelablePromise<Array<deployment>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Re-run a workflow
     * Re-runs your workflow run using its `id`.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @param requestBody
     * @returns empty_object Response
     * @throws ApiError
     */
    public static actionsReRunWorkflow(
        owner: string,
        repo: string,
        runId: number,
        requestBody?: {
            /**
             * Whether to enable debug logging for the re-run.
             */
            enable_debug_logging?: boolean;
        } | null,
    ): CancelablePromise<empty_object> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}/rerun',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Re-run failed jobs from a workflow run
     * Re-run all of the failed jobs and their dependent jobs in a workflow run using the `id` of the workflow run.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @param requestBody
     * @returns empty_object Response
     * @throws ApiError
     */
    public static actionsReRunWorkflowFailedJobs(
        owner: string,
        repo: string,
        runId: number,
        requestBody?: {
            /**
             * Whether to enable debug logging for the re-run.
             */
            enable_debug_logging?: boolean;
        } | null,
    ): CancelablePromise<empty_object> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get workflow run usage
     * > [!WARNING]
     * > This endpoint is in the process of closing down. Refer to "[Actions Get workflow usage and Get workflow run usage endpoints closing down](https://github.blog/changelog/2025-02-02-actions-get-workflow-usage-and-get-workflow-run-usage-endpoints-closing-down/)" for more information.
     *
     * Gets the number of billable minutes and total run time for a specific workflow run. Billable minutes only apply to workflows in private repositories that use GitHub-hosted runners. Usage is listed for each GitHub-hosted runner operating system in milliseconds. Any job re-runs are also included in the usage. The usage does not include the multiplier for macOS and Windows runners and is not rounded up to the nearest whole minute. For more information, see "[Managing billing for GitHub Actions](https://docs.github.com/github/setting-up-and-managing-billing-and-payments-on-github/managing-billing-for-github-actions)".
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param runId The unique identifier of the workflow run.
     * @returns workflow_run_usage Response
     * @throws ApiError
     */
    public static actionsGetWorkflowRunUsage(
        owner: string,
        repo: string,
        runId: number,
    ): CancelablePromise<workflow_run_usage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/runs/{run_id}/timing',
            path: {
                'owner': owner,
                'repo': repo,
                'run_id': runId,
            },
        });
    }
    /**
     * List repository secrets
     * Lists all secrets available in a repository without revealing their encrypted
     * values.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read secrets.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListRepoSecrets(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        secrets: Array<actions_secret>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/secrets',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Get a repository public key
     * Gets your public key, which you need to encrypt secrets. You need to
     * encrypt a secret before you can create or update secrets.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns actions_public_key Response
     * @throws ApiError
     */
    public static actionsGetRepoPublicKey(
        owner: string,
        repo: string,
    ): CancelablePromise<actions_public_key> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/secrets/public-key',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Get a repository secret
     * Gets a single repository secret without revealing its encrypted value.
     *
     * The authenticated user must have collaborator access to the repository to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param secretName The name of the secret.
     * @returns actions_secret Response
     * @throws ApiError
     */
    public static actionsGetRepoSecret(
        owner: string,
        repo: string,
        secretName: string,
    ): CancelablePromise<actions_secret> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/secrets/{secret_name}',
            path: {
                'owner': owner,
                'repo': repo,
                'secret_name': secretName,
            },
        });
    }
    /**
     * Create or update a repository secret
     * Creates or updates a repository secret with an encrypted value. Encrypt your secret using
     * [LibSodium](https://libsodium.gitbook.io/doc/bindings_for_other_languages). For more information, see "[Encrypting secrets for the REST API](https://docs.github.com/rest/guides/encrypting-secrets-for-the-rest-api)."
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read secrets.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param secretName The name of the secret.
     * @param requestBody
     * @returns empty_object Response when creating a secret
     * @throws ApiError
     */
    public static actionsCreateOrUpdateRepoSecret(
        owner: string,
        repo: string,
        secretName: string,
        requestBody: {
            /**
             * Value for your secret, encrypted with [LibSodium](https://libsodium.gitbook.io/doc/bindings_for_other_languages) using the public key retrieved from the [Get a repository public key](https://docs.github.com/rest/actions/secrets#get-a-repository-public-key) endpoint.
             */
            encrypted_value: string;
            /**
             * ID of the key you used to encrypt the secret.
             */
            key_id: string;
        },
    ): CancelablePromise<empty_object> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/actions/secrets/{secret_name}',
            path: {
                'owner': owner,
                'repo': repo,
                'secret_name': secretName,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a repository secret
     * Deletes a secret in a repository using the secret name.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read secrets.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param secretName The name of the secret.
     * @returns void
     * @throws ApiError
     */
    public static actionsDeleteRepoSecret(
        owner: string,
        repo: string,
        secretName: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/actions/secrets/{secret_name}',
            path: {
                'owner': owner,
                'repo': repo,
                'secret_name': secretName,
            },
        });
    }
    /**
     * List repository variables
     * Lists all repository variables.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read variables.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 30). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListRepoVariables(
        owner: string,
        repo: string,
        perPage: number = 10,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        variables: Array<actions_variable>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/variables',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Create a repository variable
     * Creates a repository variable that you can reference in a GitHub Actions workflow.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read variables.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns empty_object Response
     * @throws ApiError
     */
    public static actionsCreateRepoVariable(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * The name of the variable.
             */
            name: string;
            /**
             * The value of the variable.
             */
            value: string;
        },
    ): CancelablePromise<empty_object> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/actions/variables',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get a repository variable
     * Gets a specific variable in a repository.
     *
     * The authenticated user must have collaborator access to the repository to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param name The name of the variable.
     * @returns actions_variable Response
     * @throws ApiError
     */
    public static actionsGetRepoVariable(
        owner: string,
        repo: string,
        name: string,
    ): CancelablePromise<actions_variable> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/variables/{name}',
            path: {
                'owner': owner,
                'repo': repo,
                'name': name,
            },
        });
    }
    /**
     * Update a repository variable
     * Updates a repository variable that you can reference in a GitHub Actions workflow.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read variables.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param name The name of the variable.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsUpdateRepoVariable(
        owner: string,
        repo: string,
        name: string,
        requestBody: {
            /**
             * The name of the variable.
             */
            name?: string;
            /**
             * The value of the variable.
             */
            value?: string;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}/actions/variables/{name}',
            path: {
                'owner': owner,
                'repo': repo,
                'name': name,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a repository variable
     * Deletes a repository variable using the variable name.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read variables.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param name The name of the variable.
     * @returns void
     * @throws ApiError
     */
    public static actionsDeleteRepoVariable(
        owner: string,
        repo: string,
        name: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/actions/variables/{name}',
            path: {
                'owner': owner,
                'repo': repo,
                'name': name,
            },
        });
    }
    /**
     * List repository workflows
     * Lists the workflows in a repository.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListRepoWorkflows(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        workflows: Array<workflow>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/workflows',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Get a workflow
     * Gets a specific workflow. You can replace `workflow_id` with the workflow
     * file name. For example, you could use `main.yaml`.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param workflowId The ID of the workflow. You can also pass the workflow file name as a string.
     * @returns workflow Response
     * @throws ApiError
     */
    public static actionsGetWorkflow(
        owner: string,
        repo: string,
        workflowId: (number | string),
    ): CancelablePromise<workflow> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/workflows/{workflow_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'workflow_id': workflowId,
            },
        });
    }
    /**
     * Disable a workflow
     * Disables a workflow and sets the `state` of the workflow to `disabled_manually`. You can replace `workflow_id` with the workflow file name. For example, you could use `main.yaml`.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param workflowId The ID of the workflow. You can also pass the workflow file name as a string.
     * @returns void
     * @throws ApiError
     */
    public static actionsDisableWorkflow(
        owner: string,
        repo: string,
        workflowId: (number | string),
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable',
            path: {
                'owner': owner,
                'repo': repo,
                'workflow_id': workflowId,
            },
        });
    }
    /**
     * Create a workflow dispatch event
     * You can use this endpoint to manually trigger a GitHub Actions workflow run. You can replace `workflow_id` with the workflow file name. For example, you could use `main.yaml`.
     *
     * You must configure your GitHub Actions workflow to run when the [`workflow_dispatch` webhook](/developers/webhooks-and-events/webhook-events-and-payloads#workflow_dispatch) event occurs. The `inputs` are configured in the workflow file. For more information about how to configure the `workflow_dispatch` event in the workflow file, see "[Events that trigger workflows](/actions/reference/events-that-trigger-workflows#workflow_dispatch)."
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param workflowId The ID of the workflow. You can also pass the workflow file name as a string.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsCreateWorkflowDispatch(
        owner: string,
        repo: string,
        workflowId: (number | string),
        requestBody: {
            /**
             * The git reference for the workflow. The reference can be a branch or tag name.
             */
            ref: string;
            /**
             * Input keys and values configured in the workflow file. The maximum number of properties is 25. Any default properties configured in the workflow file will be used when `inputs` are omitted.
             */
            inputs?: Record<string, any>;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
            path: {
                'owner': owner,
                'repo': repo,
                'workflow_id': workflowId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Enable a workflow
     * Enables a workflow and sets the `state` of the workflow to `active`. You can replace `workflow_id` with the workflow file name. For example, you could use `main.yaml`.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param workflowId The ID of the workflow. You can also pass the workflow file name as a string.
     * @returns void
     * @throws ApiError
     */
    public static actionsEnableWorkflow(
        owner: string,
        repo: string,
        workflowId: (number | string),
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable',
            path: {
                'owner': owner,
                'repo': repo,
                'workflow_id': workflowId,
            },
        });
    }
    /**
     * List workflow runs for a workflow
     * List all workflow runs for a workflow. You can replace `workflow_id` with the workflow file name. For example, you could use `main.yaml`. You can use parameters to narrow the list of results. For more information about using parameters, see [Parameters](https://docs.github.com/rest/guides/getting-started-with-the-rest-api#parameters).
     *
     * Anyone with read access to the repository can use this endpoint
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     *
     * This endpoint will return up to 1,000 results for each search when using the following parameters: `actor`, `branch`, `check_suite_id`, `created`, `event`, `head_sha`, `status`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param workflowId The ID of the workflow. You can also pass the workflow file name as a string.
     * @param actor Returns someone's workflow runs. Use the login for the user who created the `push` associated with the check suite or workflow run.
     * @param branch Returns workflow runs associated with a branch. Use the name of the branch of the `push`.
     * @param event Returns workflow run triggered by the event you specify. For example, `push`, `pull_request` or `issue`. For more information, see "[Events that trigger workflows](https://docs.github.com/actions/automating-your-workflow-with-github-actions/events-that-trigger-workflows)."
     * @param status Returns workflow runs with the check run `status` or `conclusion` that you specify. For example, a conclusion can be `success` or a status can be `in_progress`. Only GitHub Actions can set a status of `waiting`, `pending`, or `requested`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param created Returns workflow runs created within the given date-time range. For more information on the syntax, see "[Understanding the search syntax](https://docs.github.com/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax#query-for-dates)."
     * @param excludePullRequests If `true` pull requests are omitted from the response (empty array).
     * @param checkSuiteId Returns workflow runs with the `check_suite_id` that you specify.
     * @param headSha Only returns workflow runs that are associated with the specified `head_sha`.
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListWorkflowRuns(
        owner: string,
        repo: string,
        workflowId: (number | string),
        actor?: string,
        branch?: string,
        event?: string,
        status?: 'completed' | 'action_required' | 'cancelled' | 'failure' | 'neutral' | 'skipped' | 'stale' | 'success' | 'timed_out' | 'in_progress' | 'queued' | 'requested' | 'waiting' | 'pending',
        perPage: number = 30,
        page: number = 1,
        created?: string,
        excludePullRequests: boolean = false,
        checkSuiteId?: number,
        headSha?: string,
    ): CancelablePromise<{
        total_count: number;
        workflow_runs: Array<workflow_run>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs',
            path: {
                'owner': owner,
                'repo': repo,
                'workflow_id': workflowId,
            },
            query: {
                'actor': actor,
                'branch': branch,
                'event': event,
                'status': status,
                'per_page': perPage,
                'page': page,
                'created': created,
                'exclude_pull_requests': excludePullRequests,
                'check_suite_id': checkSuiteId,
                'head_sha': headSha,
            },
        });
    }
    /**
     * Get workflow usage
     * > [!WARNING]
     * > This endpoint is in the process of closing down. Refer to "[Actions Get workflow usage and Get workflow run usage endpoints closing down](https://github.blog/changelog/2025-02-02-actions-get-workflow-usage-and-get-workflow-run-usage-endpoints-closing-down/)" for more information.
     *
     * Gets the number of billable minutes used by a specific workflow during the current billing cycle. Billable minutes only apply to workflows in private repositories that use GitHub-hosted runners. Usage is listed for each GitHub-hosted runner operating system in milliseconds. Any job re-runs are also included in the usage. The usage does not include the multiplier for macOS and Windows runners and is not rounded up to the nearest whole minute. For more information, see "[Managing billing for GitHub Actions](https://docs.github.com/github/setting-up-and-managing-billing-and-payments-on-github/managing-billing-for-github-actions)".
     *
     * You can replace `workflow_id` with the workflow file name. For example, you could use `main.yaml`.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param workflowId The ID of the workflow. You can also pass the workflow file name as a string.
     * @returns workflow_usage Response
     * @throws ApiError
     */
    public static actionsGetWorkflowUsage(
        owner: string,
        repo: string,
        workflowId: (number | string),
    ): CancelablePromise<workflow_usage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing',
            path: {
                'owner': owner,
                'repo': repo,
                'workflow_id': workflowId,
            },
        });
    }
    /**
     * List environment secrets
     * Lists all secrets available in an environment without revealing their
     * encrypted values.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read secrets.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListEnvironmentSecrets(
        owner: string,
        repo: string,
        environmentName: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        secrets: Array<actions_secret>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/secrets',
            path: {
                'owner': owner,
                'repo': repo,
                'environment_name': environmentName,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Get an environment public key
     * Get the public key for an environment, which you need to encrypt environment
     * secrets. You need to encrypt a secret before you can create or update secrets.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * If the repository is private, OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @returns actions_public_key Response
     * @throws ApiError
     */
    public static actionsGetEnvironmentPublicKey(
        owner: string,
        repo: string,
        environmentName: string,
    ): CancelablePromise<actions_public_key> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/secrets/public-key',
            path: {
                'owner': owner,
                'repo': repo,
                'environment_name': environmentName,
            },
        });
    }
    /**
     * Get an environment secret
     * Gets a single environment secret without revealing its encrypted value.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read secrets.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param secretName The name of the secret.
     * @returns actions_secret Response
     * @throws ApiError
     */
    public static actionsGetEnvironmentSecret(
        owner: string,
        repo: string,
        environmentName: string,
        secretName: string,
    ): CancelablePromise<actions_secret> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}',
            path: {
                'owner': owner,
                'repo': repo,
                'environment_name': environmentName,
                'secret_name': secretName,
            },
        });
    }
    /**
     * Create or update an environment secret
     * Creates or updates an environment secret with an encrypted value. Encrypt your secret using
     * [LibSodium](https://libsodium.gitbook.io/doc/bindings_for_other_languages). For more information, see "[Encrypting secrets for the REST API](https://docs.github.com/rest/guides/encrypting-secrets-for-the-rest-api)."
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read secrets.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param secretName The name of the secret.
     * @param requestBody
     * @returns empty_object Response when creating a secret
     * @throws ApiError
     */
    public static actionsCreateOrUpdateEnvironmentSecret(
        owner: string,
        repo: string,
        environmentName: string,
        secretName: string,
        requestBody: {
            /**
             * Value for your secret, encrypted with [LibSodium](https://libsodium.gitbook.io/doc/bindings_for_other_languages) using the public key retrieved from the [Get an environment public key](https://docs.github.com/rest/actions/secrets#get-an-environment-public-key) endpoint.
             */
            encrypted_value: string;
            /**
             * ID of the key you used to encrypt the secret.
             */
            key_id: string;
        },
    ): CancelablePromise<empty_object> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}',
            path: {
                'owner': owner,
                'repo': repo,
                'environment_name': environmentName,
                'secret_name': secretName,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete an environment secret
     * Deletes a secret in an environment using the secret name.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read secrets.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param secretName The name of the secret.
     * @returns void
     * @throws ApiError
     */
    public static actionsDeleteEnvironmentSecret(
        owner: string,
        repo: string,
        environmentName: string,
        secretName: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}',
            path: {
                'owner': owner,
                'repo': repo,
                'environment_name': environmentName,
                'secret_name': secretName,
            },
        });
    }
    /**
     * List environment variables
     * Lists all environment variables.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read variables.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param perPage The number of results per page (max 30). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static actionsListEnvironmentVariables(
        owner: string,
        repo: string,
        environmentName: string,
        perPage: number = 10,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        variables: Array<actions_variable>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/variables',
            path: {
                'owner': owner,
                'repo': repo,
                'environment_name': environmentName,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Create an environment variable
     * Create an environment variable that you can reference in a GitHub Actions workflow.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read variables.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param requestBody
     * @returns empty_object Response
     * @throws ApiError
     */
    public static actionsCreateEnvironmentVariable(
        owner: string,
        repo: string,
        environmentName: string,
        requestBody: {
            /**
             * The name of the variable.
             */
            name: string;
            /**
             * The value of the variable.
             */
            value: string;
        },
    ): CancelablePromise<empty_object> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/variables',
            path: {
                'owner': owner,
                'repo': repo,
                'environment_name': environmentName,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get an environment variable
     * Gets a specific variable in an environment.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read variables.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param name The name of the variable.
     * @returns actions_variable Response
     * @throws ApiError
     */
    public static actionsGetEnvironmentVariable(
        owner: string,
        repo: string,
        environmentName: string,
        name: string,
    ): CancelablePromise<actions_variable> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/variables/{name}',
            path: {
                'owner': owner,
                'repo': repo,
                'environment_name': environmentName,
                'name': name,
            },
        });
    }
    /**
     * Update an environment variable
     * Updates an environment variable that you can reference in a GitHub Actions workflow.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read variables.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param name The name of the variable.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static actionsUpdateEnvironmentVariable(
        owner: string,
        repo: string,
        name: string,
        environmentName: string,
        requestBody: {
            /**
             * The name of the variable.
             */
            name?: string;
            /**
             * The value of the variable.
             */
            value?: string;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/variables/{name}',
            path: {
                'owner': owner,
                'repo': repo,
                'name': name,
                'environment_name': environmentName,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete an environment variable
     * Deletes an environment variable using the variable name.
     *
     * Authenticated users must have collaborator access to a repository to create, update, or read variables.
     *
     * OAuth tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param name The name of the variable.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @returns void
     * @throws ApiError
     */
    public static actionsDeleteEnvironmentVariable(
        owner: string,
        repo: string,
        name: string,
        environmentName: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/variables/{name}',
            path: {
                'owner': owner,
                'repo': repo,
                'name': name,
                'environment_name': environmentName,
            },
        });
    }
}
