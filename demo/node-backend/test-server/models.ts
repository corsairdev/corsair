/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * This file contains all model type definitions used by the GitHub API client.
 * Consolidated from 206 individual model files for optimal performance.
 */


// ============================================================================
// Model: actions_artifact_and_log_retention
// ============================================================================
    /**
     * The number of days to retain artifacts and logs
     */
    days: number;
};


// ============================================================================
// Model: actions_artifact_and_log_retention_response
// ============================================================================
    /**
     * The number of days artifacts and logs are retained
     */
    days: number;
    /**
     * The maximum number of days that can be configured
     */
    maximum_allowed_days: number;
};


// ============================================================================
// Model: actions_cache_list
// ============================================================================
 * Repository actions caches
 */
export type actions_cache_list = {
    /**
     * Total number of caches
     */
    total_count: number;
    /**
     * Array of caches
     */
    actions_caches: Array<{
        id?: number;
        ref?: string;
        key?: string;
        version?: string;
        last_accessed_at?: string;
        created_at?: string;
        size_in_bytes?: number;
    }>;
};


// ============================================================================
// Model: actions_cache_retention_limit_for_enterprise
// ============================================================================
 * GitHub Actions cache retention policy for an enterprise.
 */
export type actions_cache_retention_limit_for_enterprise = {
    /**
     * For repositories & organizations in an enterprise, the maximum duration, in days, for which caches in a repository may be retained.
     */
    max_cache_retention_days?: number;
};


// ============================================================================
// Model: actions_cache_retention_limit_for_organization
// ============================================================================
 * GitHub Actions cache retention policy for an organization.
 */
export type actions_cache_retention_limit_for_organization = {
    /**
     * For repositories in this organization, the maximum duration, in days, for which caches in a repository may be retained.
     */
    max_cache_retention_days?: number;
};


// ============================================================================
// Model: actions_cache_retention_limit_for_repository
// ============================================================================
 * GitHub Actions cache retention policy for a repository.
 */
export type actions_cache_retention_limit_for_repository = {
    /**
     * The maximum number of days to keep caches in this repository.
     */
    max_cache_retention_days?: number;
};


// ============================================================================
// Model: actions_cache_storage_limit_for_enterprise
// ============================================================================
 * GitHub Actions cache storage policy for an enterprise.
 */
export type actions_cache_storage_limit_for_enterprise = {
    /**
     * For repositories & organizations in an enterprise, the maximum size limit for the sum of all caches in a repository, in gigabytes.
     */
    max_cache_size_gb?: number;
};


// ============================================================================
// Model: actions_cache_storage_limit_for_organization
// ============================================================================
 * GitHub Actions cache storage policy for an organization.
 */
export type actions_cache_storage_limit_for_organization = {
    /**
     * For repositories in the organization, the maximum size limit for the sum of all caches in a repository, in gigabytes.
     */
    max_cache_size_gb?: number;
};


// ============================================================================
// Model: actions_cache_storage_limit_for_repository
// ============================================================================
 * GitHub Actions cache storage policy for a repository.
 */
export type actions_cache_storage_limit_for_repository = {
    /**
     * The maximum total cache size for this repository, in gigabytes.
     */
    max_cache_size_gb?: number;
};


// ============================================================================
// Model: actions_cache_usage_by_repository
// ============================================================================
 * GitHub Actions Cache Usage by repository.
 */
export type actions_cache_usage_by_repository = {
    /**
     * The repository owner and name for the cache usage being shown.
     */
    full_name: string;
    /**
     * The sum of the size in bytes of all the active cache items in the repository.
     */
    active_caches_size_in_bytes: number;
    /**
     * The number of active caches in the repository.
     */
    active_caches_count: number;
};


// ============================================================================
// Model: actions_cache_usage_org_enterprise
// ============================================================================
    /**
     * The count of active caches across all repositories of an enterprise or an organization.
     */
    total_active_caches_count: number;
    /**
     * The total size in bytes of all active cache items across all repositories of an enterprise or an organization.
     */
    total_active_caches_size_in_bytes: number;
};


// ============================================================================
// Model: actions_enabled
// ============================================================================
 * Whether GitHub Actions is enabled on the repository.
 */
export type actions_enabled = boolean;

// ============================================================================
// Model: actions_fork_pr_contributor_approval
// ============================================================================
    /**
     * The policy that controls when fork PR workflows require approval from a maintainer.
     */
    approval_policy: actions_fork_pr_contributor_approval.approval_policy;
};
export namespace actions_fork_pr_contributor_approval {
    /**
     * The policy that controls when fork PR workflows require approval from a maintainer.
     */
    export enum approval_policy {
        FIRST_TIME_CONTRIBUTORS_NEW_TO_GITHUB = 'first_time_contributors_new_to_github',
        FIRST_TIME_CONTRIBUTORS = 'first_time_contributors',
        ALL_EXTERNAL_CONTRIBUTORS = 'all_external_contributors',
    }
}


// ============================================================================
// Model: actions_fork_pr_workflows_private_repos
// ============================================================================
    /**
     * Whether workflows triggered by pull requests from forks are allowed to run on private repositories.
     */
    run_workflows_from_fork_pull_requests: boolean;
    /**
     * Whether GitHub Actions can create pull requests or submit approving pull request reviews from a workflow triggered by a fork pull request.
     */
    send_write_tokens_to_workflows: boolean;
    /**
     * Whether to make secrets and variables available to workflows triggered by pull requests from forks.
     */
    send_secrets_and_variables: boolean;
    /**
     * Whether workflows triggered by pull requests from forks require approval from a repository administrator to run.
     */
    require_approval_for_fork_pr_workflows: boolean;
};


// ============================================================================
// Model: actions_fork_pr_workflows_private_repos_request
// ============================================================================
    /**
     * Whether workflows triggered by pull requests from forks are allowed to run on private repositories.
     */
    run_workflows_from_fork_pull_requests: boolean;
    /**
     * Whether GitHub Actions can create pull requests or submit approving pull request reviews from a workflow triggered by a fork pull request.
     */
    send_write_tokens_to_workflows?: boolean;
    /**
     * Whether to make secrets and variables available to workflows triggered by pull requests from forks.
     */
    send_secrets_and_variables?: boolean;
    /**
     * Whether workflows triggered by pull requests from forks require approval from a repository administrator to run.
     */
    require_approval_for_fork_pr_workflows?: boolean;
};


// ============================================================================
// Model: actions_get_default_workflow_permissions
// ============================================================================
import type { actions_default_workflow_permissions } from './actions_default_workflow_permissions';
export type actions_get_default_workflow_permissions = {
    default_workflow_permissions: actions_default_workflow_permissions;
    can_approve_pull_request_reviews: actions_can_approve_pull_request_reviews;
};


// ============================================================================
// Model: actions_hosted_runner
// ============================================================================
import type { nullable_actions_hosted_runner_pool_image } from './nullable_actions_hosted_runner_pool_image';
import type { public_ip } from './public_ip';
/**
 * A Github-hosted hosted runner.
 */
export type actions_hosted_runner = {
    /**
     * The unique identifier of the hosted runner.
     */
    id: number;
    /**
     * The name of the hosted runner.
     */
    name: string;
    /**
     * The unique identifier of the group that the hosted runner belongs to.
     */
    runner_group_id?: number;
    image_details: nullable_actions_hosted_runner_pool_image;
    machine_size_details: actions_hosted_runner_machine_spec;
    /**
     * The status of the runner.
     */
    status: actions_hosted_runner.status;
    /**
     * The operating system of the image.
     */
    platform: string;
    /**
     * The maximum amount of hosted runners. Runners will not scale automatically above this number. Use this setting to limit your cost.
     */
    maximum_runners?: number;
    /**
     * Whether public IP is enabled for the hosted runners.
     */
    public_ip_enabled: boolean;
    /**
     * The public IP ranges when public IP is enabled for the hosted runners.
     */
    public_ips?: Array<public_ip>;
    /**
     * The time at which the runner was last used, in ISO 8601 format.
     */
    last_active_on?: string | null;
    /**
     * Whether custom image generation is enabled for the hosted runners.
     */
    image_gen?: boolean;
};
export namespace actions_hosted_runner {
    /**
     * The status of the runner.
     */
    export enum status {
        READY = 'Ready',
        PROVISIONING = 'Provisioning',
        SHUTDOWN = 'Shutdown',
        DELETING = 'Deleting',
        STUCK = 'Stuck',
    }
}


// ============================================================================
// Model: actions_hosted_runner_curated_image
// ============================================================================
 * Provides details of a hosted runner image
 */
export type actions_hosted_runner_curated_image = {
    /**
     * The ID of the image. Use this ID for the `image` parameter when creating a new larger runner.
     */
    id: string;
    /**
     * The operating system of the image.
     */
    platform: string;
    /**
     * Image size in GB.
     */
    size_gb: number;
    /**
     * Display name for this image.
     */
    display_name: string;
    /**
     * The image provider.
     */
    source: actions_hosted_runner_curated_image.source;
};
export namespace actions_hosted_runner_curated_image {
    /**
     * The image provider.
     */
    export enum source {
        GITHUB = 'github',
        PARTNER = 'partner',
        CUSTOM = 'custom',
    }
}


// ============================================================================
// Model: actions_hosted_runner_custom_image
// ============================================================================
 * Provides details of a custom runner image
 */
export type actions_hosted_runner_custom_image = {
    /**
     * The ID of the image. Use this ID for the `image` parameter when creating a new larger runner.
     */
    id: number;
    /**
     * The operating system of the image.
     */
    platform: string;
    /**
     * Total size of all the image versions in GB.
     */
    total_versions_size: number;
    /**
     * Display name for this image.
     */
    name: string;
    /**
     * The image provider.
     */
    source: string;
    /**
     * The number of image versions associated with the image.
     */
    versions_count: number;
    /**
     * The latest image version associated with the image.
     */
    latest_version: string;
    /**
     * The number of image versions associated with the image.
     */
    state: string;
};


// ============================================================================
// Model: actions_hosted_runner_custom_image_version
// ============================================================================
 * Provides details of a hosted runner custom image version
 */
export type actions_hosted_runner_custom_image_version = {
    /**
     * The version of image.
     */
    version: string;
    /**
     * The state of image version.
     */
    state: string;
    /**
     * Image version size in GB.
     */
    size_gb: number;
    /**
     * The creation date time of the image version.
     */
    created_on: string;
    /**
     * The image version status details.
     */
    state_details: string;
};


// ============================================================================
// Model: actions_hosted_runner_limits
// ============================================================================
    /**
     * Provides details of static public IP limits for GitHub-hosted Hosted Runners
     */
    public_ips: {
        /**
         * The maximum number of static public IP addresses that can be used for Hosted Runners.
         */
        maximum: number;
        /**
         * The current number of static public IP addresses in use by Hosted Runners.
         */
        current_usage: number;
    };
};


// ============================================================================
// Model: actions_hosted_runner_machine_spec
// ============================================================================
 * Provides details of a particular machine spec.
 */
export type actions_hosted_runner_machine_spec = {
    /**
     * The ID used for the `size` parameter when creating a new runner.
     */
    id: string;
    /**
     * The number of cores.
     */
    cpu_cores: number;
    /**
     * The available RAM for the machine spec.
     */
    memory_gb: number;
    /**
     * The available SSD storage for the machine spec.
     */
    storage_gb: number;
};


// ============================================================================
// Model: actions_organization_permissions
// ============================================================================
import type { enabled_repositories } from './enabled_repositories';
import type { selected_actions_url } from './selected_actions_url';
import type { sha_pinning_required } from './sha_pinning_required';
export type actions_organization_permissions = {
    enabled_repositories: enabled_repositories;
    /**
     * The API URL to use to get or set the selected repositories that are allowed to run GitHub Actions, when `enabled_repositories` is set to `selected`.
     */
    selected_repositories_url?: string;
    allowed_actions?: allowed_actions;
    selected_actions_url?: selected_actions_url;
    sha_pinning_required?: sha_pinning_required;
};


// ============================================================================
// Model: actions_public_key
// ============================================================================
 * The public key used for setting Actions Secrets.
 */
export type actions_public_key = {
    /**
     * The identifier for the key.
     */
    key_id: string;
    /**
     * The Base64 encoded public key.
     */
    key: string;
    id?: number;
    url?: string;
    title?: string;
    created_at?: string;
};


// ============================================================================
// Model: actions_repository_permissions
// ============================================================================
import type { allowed_actions } from './allowed_actions';
import type { selected_actions_url } from './selected_actions_url';
import type { sha_pinning_required } from './sha_pinning_required';
export type actions_repository_permissions = {
    enabled: actions_enabled;
    allowed_actions?: allowed_actions;
    selected_actions_url?: selected_actions_url;
    sha_pinning_required?: sha_pinning_required;
};


// ============================================================================
// Model: actions_secret
// ============================================================================
 * Set secrets for GitHub Actions.
 */
export type actions_secret = {
    /**
     * The name of the secret.
     */
    name: string;
    created_at: string;
    updated_at: string;
};


// ============================================================================
// Model: actions_set_default_workflow_permissions
// ============================================================================
import type { actions_default_workflow_permissions } from './actions_default_workflow_permissions';
export type actions_set_default_workflow_permissions = {
    default_workflow_permissions?: actions_default_workflow_permissions;
    can_approve_pull_request_reviews?: actions_can_approve_pull_request_reviews;
};


// ============================================================================
// Model: actions_variable
// ============================================================================
    /**
     * The name of the variable.
     */
    name: string;
    /**
     * The value of the variable.
     */
    value: string;
    /**
     * The date and time at which the variable was created, in ISO 8601 format':' YYYY-MM-DDTHH:MM:SSZ.
     */
    created_at: string;
    /**
     * The date and time at which the variable was last updated, in ISO 8601 format':' YYYY-MM-DDTHH:MM:SSZ.
     */
    updated_at: string;
};


// ============================================================================
// Model: actions_workflow_access_to_repository
// ============================================================================
    /**
     * Defines the level of access that workflows outside of the repository have to actions and reusable workflows within the
     * repository.
     *
     * `none` means the access is only possible from workflows in this repository. `user` level access allows sharing across user owned private repositories only. `organization` level access allows sharing across the organization.
     */
    access_level: actions_workflow_access_to_repository.access_level;
};
export namespace actions_workflow_access_to_repository {
    /**
     * Defines the level of access that workflows outside of the repository have to actions and reusable workflows within the
     * repository.
     *
     * `none` means the access is only possible from workflows in this repository. `user` level access allows sharing across user owned private repositories only. `organization` level access allows sharing across the organization.
     */
    export enum access_level {
        NONE = 'none',
        USER = 'user',
        ORGANIZATION = 'organization',
    }
}


// ============================================================================
// Model: activity
// ============================================================================
/**
 * Activity
 */
export type activity = {
    id: number;
    node_id: string;
    /**
     * The SHA of the commit before the activity.
     */
    before: string;
    /**
     * The SHA of the commit after the activity.
     */
    after: string;
    /**
     * The full Git reference, formatted as `refs/heads/<branch name>`.
     */
    ref: string;
    /**
     * The time when the activity occurred.
     */
    timestamp: string;
    /**
     * The type of the activity that was performed.
     */
    activity_type: activity.activity_type;
    actor: nullable_simple_user;
};
export namespace activity {
    /**
     * The type of the activity that was performed.
     */
    export enum activity_type {
        PUSH = 'push',
        FORCE_PUSH = 'force_push',
        BRANCH_DELETION = 'branch_deletion',
        BRANCH_CREATION = 'branch_creation',
        PR_MERGE = 'pr_merge',
        MERGE_QUEUE_MERGE = 'merge_queue_merge',
    }
}


// ============================================================================
// Model: allowed_actions
// ============================================================================
 * The permissions policy that controls the actions and reusable workflows that are allowed to run.
 */
export enum allowed_actions {
    ALL = 'all',
    LOCAL_ONLY = 'local_only',
    SELECTED = 'selected',
}

// ============================================================================
// Model: api_insights_route_stats
// ============================================================================
 * API Insights usage route stats for an actor
 */
export type api_insights_route_stats = Array<{
    /**
     * The HTTP method
     */
    http_method?: string;
    /**
     * The API path's route template
     */
    api_route?: string;
    /**
     * The total number of requests within the queried time period
     */
    total_request_count?: number;
    /**
     * The total number of requests that were rate limited within the queried time period
     */
    rate_limited_request_count?: number;
    last_rate_limited_timestamp?: string | null;
    last_request_timestamp?: string;
}>;

// ============================================================================
// Model: api_insights_subject_stats
// ============================================================================
 * API Insights usage subject stats for an organization
 */
export type api_insights_subject_stats = Array<{
    subject_type?: string;
    subject_name?: string;
    subject_id?: number;
    total_request_count?: number;
    rate_limited_request_count?: number;
    last_rate_limited_timestamp?: string | null;
    last_request_timestamp?: string;
}>;

// ============================================================================
// Model: api_insights_summary_stats
// ============================================================================
 * API Insights usage summary stats for an organization
 */
export type api_insights_summary_stats = {
    /**
     * The total number of requests within the queried time period
     */
    total_request_count?: number;
    /**
     * The total number of requests that were rate limited within the queried time period
     */
    rate_limited_request_count?: number;
};


// ============================================================================
// Model: api_insights_time_stats
// ============================================================================
 * API Insights usage time stats for an organization
 */
export type api_insights_time_stats = Array<{
    timestamp?: string;
    total_request_count?: number;
    rate_limited_request_count?: number;
}>;

// ============================================================================
// Model: api_insights_user_stats
// ============================================================================
 * API Insights usage stats for a user
 */
export type api_insights_user_stats = Array<{
    actor_type?: string;
    actor_name?: string;
    actor_id?: number;
    integration_id?: number | null;
    oauth_application_id?: number | null;
    total_request_count?: number;
    rate_limited_request_count?: number;
    last_rate_limited_timestamp?: string | null;
    last_request_timestamp?: string;
}>;

// ============================================================================
// Model: api_overview
// ============================================================================
 * Api Overview
 */
export type api_overview = {
    verifiable_password_authentication: boolean;
    ssh_key_fingerprints?: {
        SHA256_RSA?: string;
        SHA256_DSA?: string;
        SHA256_ECDSA?: string;
        SHA256_ED25519?: string;
    };
    ssh_keys?: Array<string>;
    hooks?: Array<string>;
    github_enterprise_importer?: Array<string>;
    web?: Array<string>;
    api?: Array<string>;
    git?: Array<string>;
    packages?: Array<string>;
    pages?: Array<string>;
    importer?: Array<string>;
    actions?: Array<string>;
    actions_macos?: Array<string>;
    codespaces?: Array<string>;
    dependabot?: Array<string>;
    copilot?: Array<string>;
    domains?: {
        website?: Array<string>;
        codespaces?: Array<string>;
        copilot?: Array<string>;
        packages?: Array<string>;
        actions?: Array<string>;
        actions_inbound?: {
            full_domains?: Array<string>;
            wildcard_domains?: Array<string>;
        };
        artifact_attestations?: {
            trust_domain?: string;
            services?: Array<string>;
        };
    };
};


// ============================================================================
// Model: artifact
// ============================================================================
 * An artifact
 */
export type artifact = {
    id: number;
    node_id: string;
    /**
     * The name of the artifact.
     */
    name: string;
    /**
     * The size in bytes of the artifact.
     */
    size_in_bytes: number;
    url: string;
    archive_download_url: string;
    /**
     * Whether or not the artifact has expired.
     */
    expired: boolean;
    created_at: string | null;
    expires_at: string | null;
    updated_at: string | null;
    /**
     * The SHA256 digest of the artifact. This field will only be populated on artifacts uploaded with upload-artifact v4 or newer. For older versions, this field will be null.
     */
    digest?: string | null;
    workflow_run?: {
        id?: number;
        repository_id?: number;
        head_repository_id?: number;
        head_branch?: string;
        head_sha?: string;
    } | null;
};


// ============================================================================
// Model: artifact_deployment_record
// ============================================================================
 * Artifact Metadata Deployment Record
 */
export type artifact_deployment_record = {
    id?: number;
    digest?: string;
    logical_environment?: string;
    physical_environment?: string;
    cluster?: string;
    deployment_name?: string;
    tags?: Record<string, string>;
    /**
     * A list of runtime risks associated with the deployment.
     */
    runtime_risks?: Array<'critical-resource' | 'internet-exposed' | 'lateral-movement' | 'sensitive-data'>;
    created_at?: string;
    updated_at?: string;
    /**
     * The ID of the provenance attestation associated with the deployment record.
     */
    attestation_id?: number | null;
};


// ============================================================================
// Model: authentication_token
// ============================================================================
/**
 * Authentication Token
 */
export type authentication_token = {
    /**
     * The token used for authentication
     */
    token: string;
    /**
     * The time this token expires
     */
    expires_at: string;
    permissions?: Record<string, any>;
    /**
     * The repositories this token has access to
     */
    repositories?: Array<repository>;
    single_file?: string | null;
    /**
     * Describe whether all repositories have been selected or there's a selection involved
     */
    repository_selection?: authentication_token.repository_selection;
};
export namespace authentication_token {
    /**
     * Describe whether all repositories have been selected or there's a selection involved
     */
    export enum repository_selection {
        ALL = 'all',
        SELECTED = 'selected',
    }
}


// ============================================================================
// Model: autolink
// ============================================================================
 * An autolink reference.
 */
export type autolink = {
    id: number;
    /**
     * The prefix of a key that is linkified.
     */
    key_prefix: string;
    /**
     * A template for the target URL that is generated if a key was found.
     */
    url_template: string;
    /**
     * Whether this autolink reference matches alphanumeric characters. If false, this autolink reference only matches numeric characters.
     */
    is_alphanumeric: boolean;
    updated_at?: string | null;
};


// ============================================================================
// Model: base_gist
// ============================================================================
import type { simple_user } from './simple_user';
/**
 * Base Gist
 */
export type base_gist = {
    url: string;
    forks_url: string;
    commits_url: string;
    id: string;
    node_id: string;
    git_pull_url: string;
    git_push_url: string;
    html_url: string;
    files: Record<string, {
        filename?: string;
        type?: string;
        language?: string;
        raw_url?: string;
        size?: number;
        /**
         * The encoding used for `content`. Currently, `"utf-8"` and `"base64"` are supported.
         */
        encoding?: string;
    }>;
    public: boolean;
    created_at: string;
    updated_at: string;
    description: string | null;
    comments: number;
    comments_enabled?: boolean;
    user: nullable_simple_user;
    comments_url: string;
    owner?: simple_user;
    truncated?: boolean;
    forks?: Array<any>;
    history?: Array<any>;
};


// ============================================================================
// Model: branch_protection
// ============================================================================
import type { protected_branch_admin_enforced } from './protected_branch_admin_enforced';
import type { protected_branch_pull_request_review } from './protected_branch_pull_request_review';
import type { protected_branch_required_status_check } from './protected_branch_required_status_check';
/**
 * Branch Protection
 */
export type branch_protection = {
    url?: string;
    enabled?: boolean;
    required_status_checks?: protected_branch_required_status_check;
    enforce_admins?: protected_branch_admin_enforced;
    required_pull_request_reviews?: protected_branch_pull_request_review;
    restrictions?: branch_restriction_policy;
    required_linear_history?: {
        enabled?: boolean;
    };
    allow_force_pushes?: {
        enabled?: boolean;
    };
    allow_deletions?: {
        enabled?: boolean;
    };
    block_creations?: {
        enabled?: boolean;
    };
    required_conversation_resolution?: {
        enabled?: boolean;
    };
    name?: string;
    protection_url?: string;
    required_signatures?: {
        url: string;
        enabled: boolean;
    };
    /**
     * Whether to set the branch as read-only. If this is true, users will not be able to push to the branch.
     */
    lock_branch?: {
        enabled?: boolean;
    };
    /**
     * Whether users can pull changes from upstream when the branch is locked. Set to `true` to allow fork syncing. Set to `false` to prevent fork syncing.
     */
    allow_fork_syncing?: {
        enabled?: boolean;
    };
};


// ============================================================================
// Model: branch_restriction_policy
// ============================================================================
/**
 * Branch Restriction Policy
 */
export type branch_restriction_policy = {
    url: string;
    users_url: string;
    teams_url: string;
    apps_url: string;
    users: Array<{
        login?: string;
        id?: number;
        node_id?: string;
        avatar_url?: string;
        gravatar_id?: string;
        url?: string;
        html_url?: string;
        followers_url?: string;
        following_url?: string;
        gists_url?: string;
        starred_url?: string;
        subscriptions_url?: string;
        organizations_url?: string;
        repos_url?: string;
        events_url?: string;
        received_events_url?: string;
        type?: string;
        site_admin?: boolean;
        user_view_type?: string;
    }>;
    teams: Array<team>;
    apps: Array<{
        id?: number;
        slug?: string;
        node_id?: string;
        owner?: {
            login?: string;
            id?: number;
            node_id?: string;
            url?: string;
            repos_url?: string;
            events_url?: string;
            hooks_url?: string;
            issues_url?: string;
            members_url?: string;
            public_members_url?: string;
            avatar_url?: string;
            description?: string;
            gravatar_id?: string;
            html_url?: string;
            followers_url?: string;
            following_url?: string;
            gists_url?: string;
            starred_url?: string;
            subscriptions_url?: string;
            organizations_url?: string;
            received_events_url?: string;
            type?: string;
            site_admin?: boolean;
            user_view_type?: string;
        };
        name?: string;
        client_id?: string;
        description?: string;
        external_url?: string;
        html_url?: string;
        created_at?: string;
        updated_at?: string;
        permissions?: {
            metadata?: string;
            contents?: string;
            issues?: string;
            single_file?: string;
        };
        events?: Array<string>;
    }>;
};


// ============================================================================
// Model: branch_short
// ============================================================================
 * Branch Short
 */
export type branch_short = {
    name: string;
    commit: {
        sha: string;
        url: string;
    };
    protected: boolean;
};


// ============================================================================
// Model: branch_with_protection
// ============================================================================
import type { commit } from './commit';
/**
 * Branch With Protection
 */
export type branch_with_protection = {
    name: string;
    commit: commit;
    _links: {
        html: string;
        self: string;
    };
    protected: boolean;
    protection: branch_protection;
    protection_url: string;
    pattern?: string;
    required_approving_review_count?: number;
};


// ============================================================================
// Model: check_automated_security_fixes
// ============================================================================
 * Check Dependabot security updates
 */
export type check_automated_security_fixes = {
    /**
     * Whether Dependabot security updates are enabled for the repository.
     */
    enabled: boolean;
    /**
     * Whether Dependabot security updates are paused for the repository.
     */
    paused: boolean;
};


// ============================================================================
// Model: check_immutable_releases
// ============================================================================
 * Check immutable releases
 */
export type check_immutable_releases = {
    /**
     * Whether immutable releases are enabled for the repository.
     */
    enabled: boolean;
    /**
     * Whether immutable releases are enforced by the repository owner.
     */
    enforced_by_owner: boolean;
};


// ============================================================================
// Model: clone_traffic
// ============================================================================
/**
 * Clone Traffic
 */
export type clone_traffic = {
    count: number;
    uniques: number;
    clones: Array<traffic>;
};


// ============================================================================
// Model: code_frequency_stat
// ============================================================================
 * Code Frequency Stat
 */
export type code_frequency_stat = Array<number>;

// ============================================================================
// Model: codeowners_errors
// ============================================================================
 * A list of errors found in a repo's CODEOWNERS file
 */
export type codeowners_errors = {
    errors: Array<{
        /**
         * The line number where this errors occurs.
         */
        line: number;
        /**
         * The column number where this errors occurs.
         */
        column: number;
        /**
         * The contents of the line where the error occurs.
         */
        source?: string;
        /**
         * The type of error.
         */
        kind: string;
        /**
         * Suggested action to fix the error. This will usually be `null`, but is provided for some common errors.
         */
        suggestion?: string | null;
        /**
         * A human-readable description of the error, combining information from multiple fields, laid out for display in a monospaced typeface (for example, a command-line setting).
         */
        message: string;
        /**
         * The path of the file where the error occured.
         */
        path: string;
    }>;
};


// ============================================================================
// Model: collaborator
// ============================================================================
 * Collaborator
 */
export type collaborator = {
    login: string;
    id: number;
    email?: string | null;
    name?: string | null;
    node_id: string;
    avatar_url: string;
    gravatar_id: string | null;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    permissions?: {
        pull: boolean;
        triage?: boolean;
        push: boolean;
        maintain?: boolean;
        admin: boolean;
    };
    role_name: string;
    user_view_type?: string;
};


// ============================================================================
// Model: combined_commit_status
// ============================================================================
import type { simple_commit_status } from './simple_commit_status';
/**
 * Combined Commit Status
 */
export type combined_commit_status = {
    state: string;
    statuses: Array<simple_commit_status>;
    sha: string;
    total_count: number;
    repository: minimal_repository;
    commit_url: string;
    url: string;
};


// ============================================================================
// Model: commit
// ============================================================================
import type { empty_object } from './empty_object';
import type { nullable_git_user } from './nullable_git_user';
import type { simple_user } from './simple_user';
import type { verification } from './verification';
/**
 * Commit
 */
export type commit = {
    url: string;
    sha: string;
    node_id: string;
    html_url: string;
    comments_url: string;
    commit: {
        url: string;
        author: nullable_git_user;
        committer: nullable_git_user;
        message: string;
        comment_count: number;
        tree: {
            sha: string;
            url: string;
        };
        verification?: verification;
    };
    author: (simple_user | empty_object) | null;
    committer: (simple_user | empty_object) | null;
    parents: Array<{
        sha: string;
        url: string;
        html_url?: string;
    }>;
    stats?: {
        additions?: number;
        deletions?: number;
        total?: number;
    };
    files?: Array<diff_entry>;
};


// ============================================================================
// Model: commit_activity
// ============================================================================
 * Commit Activity
 */
export type commit_activity = {
    days: Array<number>;
    total: number;
    week: number;
};


// ============================================================================
// Model: commit_comment
// ============================================================================
import type { nullable_simple_user } from './nullable_simple_user';
import type { reaction_rollup } from './reaction_rollup';
/**
 * Commit Comment
 */
export type commit_comment = {
    html_url: string;
    url: string;
    id: number;
    node_id: string;
    body: string;
    path: string | null;
    position: number | null;
    line: number | null;
    commit_id: string;
    user: nullable_simple_user;
    created_at: string;
    updated_at: string;
    author_association: author_association;
    reactions?: reaction_rollup;
};


// ============================================================================
// Model: commit_comparison
// ============================================================================
import type { diff_entry } from './diff_entry';
/**
 * Commit Comparison
 */
export type commit_comparison = {
    url: string;
    html_url: string;
    permalink_url: string;
    diff_url: string;
    patch_url: string;
    base_commit: commit;
    merge_base_commit: commit;
    status: commit_comparison.status;
    ahead_by: number;
    behind_by: number;
    total_commits: number;
    commits: Array<commit>;
    files?: Array<diff_entry>;
};
export namespace commit_comparison {
    export enum status {
        DIVERGED = 'diverged',
        AHEAD = 'ahead',
        BEHIND = 'behind',
        IDENTICAL = 'identical',
    }
}


// ============================================================================
// Model: community_profile
// ============================================================================
import type { nullable_community_health_file } from './nullable_community_health_file';
import type { nullable_license_simple } from './nullable_license_simple';
/**
 * Community Profile
 */
export type community_profile = {
    health_percentage: number;
    description: string | null;
    documentation: string | null;
    files: {
        code_of_conduct: nullable_code_of_conduct_simple;
        code_of_conduct_file: nullable_community_health_file;
        license: nullable_license_simple;
        contributing: nullable_community_health_file;
        readme: nullable_community_health_file;
        issue_template: nullable_community_health_file;
        pull_request_template: nullable_community_health_file;
    };
    updated_at: string | null;
    content_reports_enabled?: boolean;
};


// ============================================================================
// Model: content_directory
// ============================================================================
 * A list of directory items
 */
export type content_directory = Array<{
    type: 'dir' | 'file' | 'submodule' | 'symlink';
    size: number;
    name: string;
    path: string;
    content?: string;
    sha: string;
    url: string;
    git_url: string | null;
    html_url: string | null;
    download_url: string | null;
    _links: {
        git: string | null;
        html: string | null;
        self: string;
    };
}>;

// ============================================================================
// Model: content_file
// ============================================================================
 * Content File
 */
export type content_file = {
    type: content_file.type;
    encoding: string;
    size: number;
    name: string;
    path: string;
    content: string;
    sha: string;
    url: string;
    git_url: string | null;
    html_url: string | null;
    download_url: string | null;
    _links: {
        git: string | null;
        html: string | null;
        self: string;
    };
    target?: string;
    submodule_git_url?: string;
};
export namespace content_file {
    export enum type {
        FILE = 'file',
    }
}


// ============================================================================
// Model: content_submodule
// ============================================================================
 * An object describing a submodule
 */
export type content_submodule = {
    type: content_submodule.type;
    submodule_git_url: string;
    size: number;
    name: string;
    path: string;
    sha: string;
    url: string;
    git_url: string | null;
    html_url: string | null;
    download_url: string | null;
    _links: {
        git: string | null;
        html: string | null;
        self: string;
    };
};
export namespace content_submodule {
    export enum type {
        SUBMODULE = 'submodule',
    }
}


// ============================================================================
// Model: content_symlink
// ============================================================================
 * An object describing a symlink
 */
export type content_symlink = {
    type: content_symlink.type;
    target: string;
    size: number;
    name: string;
    path: string;
    sha: string;
    url: string;
    git_url: string | null;
    html_url: string | null;
    download_url: string | null;
    _links: {
        git: string | null;
        html: string | null;
        self: string;
    };
};
export namespace content_symlink {
    export enum type {
        SYMLINK = 'symlink',
    }
}


// ============================================================================
// Model: content_traffic
// ============================================================================
 * Content Traffic
 */
export type content_traffic = {
    path: string;
    title: string;
    count: number;
    uniques: number;
};


// ============================================================================
// Model: contributor
// ============================================================================
 * Contributor
 */
export type contributor = {
    login?: string;
    id?: number;
    node_id?: string;
    avatar_url?: string;
    gravatar_id?: string | null;
    url?: string;
    html_url?: string;
    followers_url?: string;
    following_url?: string;
    gists_url?: string;
    starred_url?: string;
    subscriptions_url?: string;
    organizations_url?: string;
    repos_url?: string;
    events_url?: string;
    received_events_url?: string;
    type: string;
    site_admin?: boolean;
    contributions: number;
    email?: string;
    name?: string;
    user_view_type?: string;
};


// ============================================================================
// Model: contributor_activity
// ============================================================================
/**
 * Contributor Activity
 */
export type contributor_activity = {
    author: nullable_simple_user;
    total: number;
    weeks: Array<{
        'w'?: number;
        'a'?: number;
        'd'?: number;
        'c'?: number;
    }>;
};


// ============================================================================
// Model: custom_deployment_rule_app
// ============================================================================
 * A GitHub App that is providing a custom deployment protection rule.
 */
export type custom_deployment_rule_app = {
    /**
     * The unique identifier of the deployment protection rule integration.
     */
    id: number;
    /**
     * The slugified name of the deployment protection rule integration.
     */
    slug: string;
    /**
     * The URL for the endpoint to get details about the app.
     */
    integration_url: string;
    /**
     * The node ID for the deployment protection rule integration.
     */
    node_id: string;
};


// ============================================================================
// Model: custom_property
// ============================================================================
 * Custom property defined on an organization
 */
export type custom_property = {
    /**
     * The name of the property
     */
    property_name: string;
    /**
     * The URL that can be used to fetch, update, or delete info about this property via the API.
     */
    url?: string;
    /**
     * The source type of the property
     */
    source_type?: custom_property.source_type;
    /**
     * The type of the value for the property
     */
    value_type: custom_property.value_type;
    /**
     * Whether the property is required.
     */
    required?: boolean;
    /**
     * Default value of the property
     */
    default_value?: (string | Array<string>) | null;
    /**
     * Short description of the property
     */
    description?: string | null;
    /**
     * An ordered list of the allowed values of the property.
     * The property can have up to 200 allowed values.
     */
    allowed_values?: Array<string> | null;
    /**
     * Who can edit the values of the property
     */
    values_editable_by?: custom_property.values_editable_by | null;
};
export namespace custom_property {
    /**
     * The source type of the property
     */
    export enum source_type {
        ORGANIZATION = 'organization',
        ENTERPRISE = 'enterprise',
    }
    /**
     * The type of the value for the property
     */
    export enum value_type {
        STRING = 'string',
        SINGLE_SELECT = 'single_select',
        MULTI_SELECT = 'multi_select',
        TRUE_FALSE = 'true_false',
        URL = 'url',
    }
    /**
     * Who can edit the values of the property
     */
    export enum values_editable_by {
        ORG_ACTORS = 'org_actors',
        ORG_AND_REPO_ACTORS = 'org_and_repo_actors',
    }
}


// ============================================================================
// Model: custom_property_set_payload
// ============================================================================
 * Custom property set payload
 */
export type custom_property_set_payload = {
    /**
     * The type of the value for the property
     */
    value_type: custom_property_set_payload.value_type;
    /**
     * Whether the property is required.
     */
    required?: boolean;
    /**
     * Default value of the property
     */
    default_value?: (string | Array<string>) | null;
    /**
     * Short description of the property
     */
    description?: string | null;
    /**
     * An ordered list of the allowed values of the property.
     * The property can have up to 200 allowed values.
     */
    allowed_values?: Array<string> | null;
    /**
     * Who can edit the values of the property
     */
    values_editable_by?: custom_property_set_payload.values_editable_by | null;
};
export namespace custom_property_set_payload {
    /**
     * The type of the value for the property
     */
    export enum value_type {
        STRING = 'string',
        SINGLE_SELECT = 'single_select',
        MULTI_SELECT = 'multi_select',
        TRUE_FALSE = 'true_false',
        URL = 'url',
    }
    /**
     * Who can edit the values of the property
     */
    export enum values_editable_by {
        ORG_ACTORS = 'org_actors',
        ORG_AND_REPO_ACTORS = 'org_and_repo_actors',
    }
}


// ============================================================================
// Model: custom_property_value
// ============================================================================
 * Custom property name and associated value
 */
export type custom_property_value = {
    /**
     * The name of the property
     */
    property_name: string;
    /**
     * The value assigned to the property
     */
    value: (string | Array<string>) | null;
};


// ============================================================================
// Model: deploy_key
// ============================================================================
 * An SSH key granting access to a single repository.
 */
export type deploy_key = {
    id: number;
    key: string;
    url: string;
    title: string;
    verified: boolean;
    created_at: string;
    read_only: boolean;
    added_by?: string | null;
    last_used?: string | null;
    enabled?: boolean;
};


// ============================================================================
// Model: deployment
// ============================================================================
import type { nullable_simple_user } from './nullable_simple_user';
/**
 * A request for a specific ref(branch,sha,tag) to be deployed
 */
export type deployment = {
    url: string;
    /**
     * Unique identifier of the deployment
     */
    id: number;
    node_id: string;
    sha: string;
    /**
     * The ref to deploy. This can be a branch, tag, or sha.
     */
    ref: string;
    /**
     * Parameter to specify a task to execute
     */
    task: string;
    payload: (Record<string, any> | string);
    original_environment?: string;
    /**
     * Name for the target deployment environment.
     */
    environment: string;
    description: string | null;
    creator: nullable_simple_user;
    created_at: string;
    updated_at: string;
    statuses_url: string;
    repository_url: string;
    /**
     * Specifies if the given environment is will no longer exist at some point in the future. Default: false.
     */
    transient_environment?: boolean;
    /**
     * Specifies if the given environment is one that end-users directly interact with. Default: false.
     */
    production_environment?: boolean;
    performed_via_github_app?: nullable_integration;
};


// ============================================================================
// Model: deployment_branch_policy
// ============================================================================
 * Details of a deployment branch or tag policy.
 */
export type deployment_branch_policy = {
    /**
     * The unique identifier of the branch or tag policy.
     */
    id?: number;
    node_id?: string;
    /**
     * The name pattern that branches or tags must match in order to deploy to the environment.
     */
    name?: string;
    /**
     * Whether this rule targets a branch or tag.
     */
    type?: deployment_branch_policy.type;
};
export namespace deployment_branch_policy {
    /**
     * Whether this rule targets a branch or tag.
     */
    export enum type {
        BRANCH = 'branch',
        TAG = 'tag',
    }
}


// ============================================================================
// Model: deployment_branch_policy_name_pattern
// ============================================================================
    /**
     * The name pattern that branches must match in order to deploy to the environment.
     *
     * Wildcard characters will not match `/`. For example, to match branches that begin with `release/` and contain an additional single slash, use `release**`.
     * For more information about pattern matching syntax, see the [Ruby File.fnmatch documentation](https://ruby-doc.org/core-2.5.1/File.html#method-c-fnmatch).
     */
    name: string;
};


// ============================================================================
// Model: deployment_branch_policy_name_pattern_with_type
// ============================================================================
    /**
     * The name pattern that branches or tags must match in order to deploy to the environment.
     *
     * Wildcard characters will not match `/`. For example, to match branches that begin with `release/` and contain an additional single slash, use `release**`.
     * For more information about pattern matching syntax, see the [Ruby File.fnmatch documentation](https://ruby-doc.org/core-2.5.1/File.html#method-c-fnmatch).
     */
    name: string;
    /**
     * Whether this rule targets a branch or tag
     */
    type?: deployment_branch_policy_name_pattern_with_type.type;
};
export namespace deployment_branch_policy_name_pattern_with_type {
    /**
     * Whether this rule targets a branch or tag
     */
    export enum type {
        BRANCH = 'branch',
        TAG = 'tag',
    }
}


// ============================================================================
// Model: deployment_branch_policy_settings
// ============================================================================
 * The type of deployment branch policy for this environment. To allow all branches to deploy, set to `null`.
 */
export type deployment_branch_policy_settings = {
    /**
     * Whether only branches with branch protection rules can deploy to this environment. If `protected_branches` is `true`, `custom_branch_policies` must be `false`; if `protected_branches` is `false`, `custom_branch_policies` must be `true`.
     */
    protected_branches: boolean;
    /**
     * Whether only branches that match the specified name patterns can deploy to this environment.  If `custom_branch_policies` is `true`, `protected_branches` must be `false`; if `custom_branch_policies` is `false`, `protected_branches` must be `true`.
     */
    custom_branch_policies: boolean;
};


// ============================================================================
// Model: deployment_protection_rule
// ============================================================================
/**
 * Deployment protection rule
 */
export type deployment_protection_rule = {
    /**
     * The unique identifier for the deployment protection rule.
     */
    id: number;
    /**
     * The node ID for the deployment protection rule.
     */
    node_id: string;
    /**
     * Whether the deployment protection rule is enabled for the environment.
     */
    enabled: boolean;
    app: custom_deployment_rule_app;
};


// ============================================================================
// Model: deployment_reviewer_type
// ============================================================================
 * The type of reviewer.
 */
export enum deployment_reviewer_type {
    USER = 'User',
    TEAM = 'Team',
}

// ============================================================================
// Model: deployment_status
// ============================================================================
import type { nullable_simple_user } from './nullable_simple_user';
/**
 * The status of a deployment.
 */
export type deployment_status = {
    url: string;
    id: number;
    node_id: string;
    /**
     * The state of the status.
     */
    state: deployment_status.state;
    creator: nullable_simple_user;
    /**
     * A short description of the status.
     */
    description: string;
    /**
     * The environment of the deployment that the status is for.
     */
    environment?: string;
    /**
     * Closing down notice: the URL to associate with this status.
     */
    target_url: string;
    created_at: string;
    updated_at: string;
    deployment_url: string;
    repository_url: string;
    /**
     * The URL for accessing your environment.
     */
    environment_url?: string;
    /**
     * The URL to associate with this status.
     */
    log_url?: string;
    performed_via_github_app?: nullable_integration;
};
export namespace deployment_status {
    /**
     * The state of the status.
     */
    export enum state {
        ERROR = 'error',
        FAILURE = 'failure',
        INACTIVE = 'inactive',
        PENDING = 'pending',
        SUCCESS = 'success',
        QUEUED = 'queued',
        IN_PROGRESS = 'in_progress',
    }
}


// ============================================================================
// Model: diff_entry
// ============================================================================
 * Diff Entry
 */
export type diff_entry = {
    sha: string | null;
    filename: string;
    status: diff_entry.status;
    additions: number;
    deletions: number;
    changes: number;
    blob_url: string;
    raw_url: string;
    contents_url: string;
    patch?: string;
    previous_filename?: string;
};
export namespace diff_entry {
    export enum status {
        ADDED = 'added',
        REMOVED = 'removed',
        MODIFIED = 'modified',
        RENAMED = 'renamed',
        COPIED = 'copied',
        CHANGED = 'changed',
        UNCHANGED = 'unchanged',
    }
}


// ============================================================================
// Model: email
// ============================================================================
 * Email
 */
export type email = {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: string | null;
};


// ============================================================================
// Model: empty_object
// ============================================================================
 * An object without any properties.
 */
export type empty_object = {
};


// ============================================================================
// Model: enabled_repositories
// ============================================================================
 * The policy that controls the repositories in the organization that are allowed to run GitHub Actions.
 */
export enum enabled_repositories {
    ALL = 'all',
    NONE = 'none',
    SELECTED = 'selected',
}

// ============================================================================
// Model: environment
// ============================================================================
import type { deployment_reviewer_type } from './deployment_reviewer_type';
import type { simple_user } from './simple_user';
import type { team } from './team';
import type { wait_timer } from './wait_timer';
/**
 * Details of a deployment environment
 */
export type environment = {
    /**
     * The id of the environment.
     */
    id: number;
    node_id: string;
    /**
     * The name of the environment.
     */
    name: string;
    url: string;
    html_url: string;
    /**
     * The time that the environment was created, in ISO 8601 format.
     */
    created_at: string;
    /**
     * The time that the environment was last updated, in ISO 8601 format.
     */
    updated_at: string;
    /**
     * Built-in deployment protection rules for the environment.
     */
    protection_rules?: Array<({
        id: number;
        node_id: string;
        type: string;
        wait_timer?: wait_timer;
    } | {
        id: number;
        node_id: string;
        /**
         * Whether deployments to this environment can be approved by the user who created the deployment.
         */
        prevent_self_review?: boolean;
        type: string;
        /**
         * The people or teams that may approve jobs that reference the environment. You can list up to six users or teams as reviewers. The reviewers must have at least read access to the repository. Only one of the required reviewers needs to approve the job for it to proceed.
         */
        reviewers?: Array<{
            type?: deployment_reviewer_type;
            reviewer?: (simple_user | team);
        }>;
    } | {
        id: number;
        node_id: string;
        type: string;
    })>;
    deployment_branch_policy?: deployment_branch_policy_settings;
};


// ============================================================================
// Model: environment_approvals
// ============================================================================
/**
 * An entry in the reviews log for environment deployments
 */
export type environment_approvals = {
    /**
     * The list of environments that were approved or rejected
     */
    environments: Array<{
        /**
         * The id of the environment.
         */
        id?: number;
        node_id?: string;
        /**
         * The name of the environment.
         */
        name?: string;
        url?: string;
        html_url?: string;
        /**
         * The time that the environment was created, in ISO 8601 format.
         */
        created_at?: string;
        /**
         * The time that the environment was last updated, in ISO 8601 format.
         */
        updated_at?: string;
    }>;
    /**
     * Whether deployment to the environment(s) was approved or rejected or pending (with comments)
     */
    state: environment_approvals.state;
    user: simple_user;
    /**
     * The comment submitted with the deployment review
     */
    comment: string;
};
export namespace environment_approvals {
    /**
     * Whether deployment to the environment(s) was approved or rejected or pending (with comments)
     */
    export enum state {
        APPROVED = 'approved',
        REJECTED = 'rejected',
        PENDING = 'pending',
    }
}


// ============================================================================
// Model: event
// ============================================================================
 * Returns workflow run triggered by the event you specify. For example, `push`, `pull_request` or `issue`. For more information, see "[Events that trigger workflows](https://docs.github.com/actions/automating-your-workflow-with-github-actions/events-that-trigger-workflows)."
 */
export type event = string;

// ============================================================================
// Model: feed
// ============================================================================
/**
 * Feed
 */
export type feed = {
    timeline_url: string;
    user_url: string;
    current_user_public_url?: string;
    current_user_url?: string;
    current_user_actor_url?: string;
    current_user_organization_url?: string;
    current_user_organization_urls?: Array<string>;
    security_advisories_url?: string;
    /**
     * A feed of discussions for a given repository.
     */
    repository_discussions_url?: string;
    /**
     * A feed of discussions for a given repository and category.
     */
    repository_discussions_category_url?: string;
    _links: {
        timeline: link_with_type;
        user: link_with_type;
        security_advisories?: link_with_type;
        current_user?: link_with_type;
        current_user_public?: link_with_type;
        current_user_actor?: link_with_type;
        current_user_organization?: link_with_type;
        current_user_organizations?: Array<link_with_type>;
        repository_discussions?: link_with_type;
        repository_discussions_category?: link_with_type;
    };
};


// ============================================================================
// Model: file_commit
// ============================================================================
 * File Commit
 */
export type file_commit = {
    content: {
        name?: string;
        path?: string;
        sha?: string;
        size?: number;
        url?: string;
        html_url?: string;
        git_url?: string;
        download_url?: string;
        type?: string;
        _links?: {
            self?: string;
            git?: string;
            html?: string;
        };
    } | null;
    commit: {
        sha?: string;
        node_id?: string;
        url?: string;
        html_url?: string;
        author?: {
            date?: string;
            name?: string;
            email?: string;
        };
        committer?: {
            date?: string;
            name?: string;
            email?: string;
        };
        message?: string;
        tree?: {
            url?: string;
            sha?: string;
        };
        parents?: Array<{
            url?: string;
            html_url?: string;
            sha?: string;
        }>;
        verification?: {
            verified?: boolean;
            reason?: string;
            signature?: string | null;
            payload?: string | null;
            verified_at?: string | null;
        };
    };
};


// ============================================================================
// Model: full_repository
// ============================================================================
import type { nullable_license_simple } from './nullable_license_simple';
import type { nullable_repository } from './nullable_repository';
import type { nullable_simple_user } from './nullable_simple_user';
import type { repository } from './repository';
import type { security_and_analysis } from './security_and_analysis';
import type { simple_user } from './simple_user';
/**
 * Full Repository
 */
export type full_repository = {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    owner: simple_user;
    private: boolean;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    archive_url: string;
    assignees_url: string;
    blobs_url: string;
    branches_url: string;
    collaborators_url: string;
    comments_url: string;
    commits_url: string;
    compare_url: string;
    contents_url: string;
    contributors_url: string;
    deployments_url: string;
    downloads_url: string;
    events_url: string;
    forks_url: string;
    git_commits_url: string;
    git_refs_url: string;
    git_tags_url: string;
    git_url: string;
    issue_comment_url: string;
    issue_events_url: string;
    issues_url: string;
    keys_url: string;
    labels_url: string;
    languages_url: string;
    merges_url: string;
    milestones_url: string;
    notifications_url: string;
    pulls_url: string;
    releases_url: string;
    ssh_url: string;
    stargazers_url: string;
    statuses_url: string;
    subscribers_url: string;
    subscription_url: string;
    tags_url: string;
    teams_url: string;
    trees_url: string;
    clone_url: string;
    mirror_url: string | null;
    hooks_url: string;
    svn_url: string;
    homepage: string | null;
    language: string | null;
    forks_count: number;
    stargazers_count: number;
    watchers_count: number;
    /**
     * The size of the repository, in kilobytes. Size is calculated hourly. When a repository is initially created, the size is 0.
     */
    size: number;
    default_branch: string;
    open_issues_count: number;
    is_template?: boolean;
    topics?: Array<string>;
    has_issues: boolean;
    has_projects: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    has_downloads?: boolean;
    has_discussions: boolean;
    archived: boolean;
    /**
     * Returns whether or not this repository disabled.
     */
    disabled: boolean;
    /**
     * The repository visibility: public, private, or internal.
     */
    visibility?: string;
    pushed_at: string;
    created_at: string;
    updated_at: string;
    permissions?: {
        admin: boolean;
        maintain?: boolean;
        push: boolean;
        triage?: boolean;
        pull: boolean;
    };
    allow_rebase_merge?: boolean;
    template_repository?: nullable_repository;
    temp_clone_token?: string | null;
    allow_squash_merge?: boolean;
    allow_auto_merge?: boolean;
    delete_branch_on_merge?: boolean;
    allow_merge_commit?: boolean;
    allow_update_branch?: boolean;
    use_squash_pr_title_as_default?: boolean;
    /**
     * The default value for a squash merge commit title:
     *
     * - `PR_TITLE` - default to the pull request's title.
     * - `COMMIT_OR_PR_TITLE` - default to the commit's title (if only one commit) or the pull request's title (when more than one commit).
     */
    squash_merge_commit_title?: full_repository.squash_merge_commit_title;
    /**
     * The default value for a squash merge commit message:
     *
     * - `PR_BODY` - default to the pull request's body.
     * - `COMMIT_MESSAGES` - default to the branch's commit messages.
     * - `BLANK` - default to a blank commit message.
     */
    squash_merge_commit_message?: full_repository.squash_merge_commit_message;
    /**
     * The default value for a merge commit title.
     *
     * - `PR_TITLE` - default to the pull request's title.
     * - `MERGE_MESSAGE` - default to the classic title for a merge message (e.g., Merge pull request #123 from branch-name).
     */
    merge_commit_title?: full_repository.merge_commit_title;
    /**
     * The default value for a merge commit message.
     *
     * - `PR_TITLE` - default to the pull request's title.
     * - `PR_BODY` - default to the pull request's body.
     * - `BLANK` - default to a blank commit message.
     */
    merge_commit_message?: full_repository.merge_commit_message;
    allow_forking?: boolean;
    web_commit_signoff_required?: boolean;
    subscribers_count: number;
    network_count: number;
    license: nullable_license_simple;
    organization?: nullable_simple_user;
    parent?: repository;
    source?: repository;
    forks: number;
    master_branch?: string;
    open_issues: number;
    watchers: number;
    /**
     * Whether anonymous git access is allowed.
     */
    anonymous_access_enabled?: boolean;
    code_of_conduct?: code_of_conduct_simple;
    security_and_analysis?: security_and_analysis;
    /**
     * The custom properties that were defined for the repository. The keys are the custom property names, and the values are the corresponding custom property values.
     */
    custom_properties?: Record<string, any>;
};
export namespace full_repository {
    /**
     * The default value for a squash merge commit title:
     *
     * - `PR_TITLE` - default to the pull request's title.
     * - `COMMIT_OR_PR_TITLE` - default to the commit's title (if only one commit) or the pull request's title (when more than one commit).
     */
    export enum squash_merge_commit_title {
        PR_TITLE = 'PR_TITLE',
        COMMIT_OR_PR_TITLE = 'COMMIT_OR_PR_TITLE',
    }
    /**
     * The default value for a squash merge commit message:
     *
     * - `PR_BODY` - default to the pull request's body.
     * - `COMMIT_MESSAGES` - default to the branch's commit messages.
     * - `BLANK` - default to a blank commit message.
     */
    export enum squash_merge_commit_message {
        PR_BODY = 'PR_BODY',
        COMMIT_MESSAGES = 'COMMIT_MESSAGES',
        BLANK = 'BLANK',
    }
    /**
     * The default value for a merge commit title.
     *
     * - `PR_TITLE` - default to the pull request's title.
     * - `MERGE_MESSAGE` - default to the classic title for a merge message (e.g., Merge pull request #123 from branch-name).
     */
    export enum merge_commit_title {
        PR_TITLE = 'PR_TITLE',
        MERGE_MESSAGE = 'MERGE_MESSAGE',
    }
    /**
     * The default value for a merge commit message.
     *
     * - `PR_TITLE` - default to the pull request's title.
     * - `PR_BODY` - default to the pull request's body.
     * - `BLANK` - default to a blank commit message.
     */
    export enum merge_commit_message {
        PR_BODY = 'PR_BODY',
        PR_TITLE = 'PR_TITLE',
        BLANK = 'BLANK',
    }
}


// ============================================================================
// Model: gist_comment
// ============================================================================
import type { nullable_simple_user } from './nullable_simple_user';
/**
 * A comment made to a gist.
 */
export type gist_comment = {
    id: number;
    node_id: string;
    url: string;
    /**
     * The comment text.
     */
    body: string;
    user: nullable_simple_user;
    created_at: string;
    updated_at: string;
    author_association: author_association;
};


// ============================================================================
// Model: gist_commit
// ============================================================================
/**
 * Gist Commit
 */
export type gist_commit = {
    url: string;
    version: string;
    user: nullable_simple_user;
    change_status: {
        total?: number;
        additions?: number;
        deletions?: number;
    };
    committed_at: string;
};


// ============================================================================
// Model: gist_simple
// ============================================================================
import type { nullable_simple_user } from './nullable_simple_user';
import type { public_user } from './public_user';
import type { simple_user } from './simple_user';
/**
 * Gist Simple
 */
export type gist_simple = {
    /**
     * @deprecated
     */
    forks?: Array<{
        id?: string;
        url?: string;
        user?: public_user;
        created_at?: string;
        updated_at?: string;
    }> | null;
    /**
     * @deprecated
     */
    history?: Array<gist_history> | null;
    /**
     * Gist
     */
    fork_of?: {
        url: string;
        forks_url: string;
        commits_url: string;
        id: string;
        node_id: string;
        git_pull_url: string;
        git_push_url: string;
        html_url: string;
        files: Record<string, {
            filename?: string;
            type?: string;
            language?: string;
            raw_url?: string;
            size?: number;
        }>;
        public: boolean;
        created_at: string;
        updated_at: string;
        description: string | null;
        comments: number;
        comments_enabled?: boolean;
        user: nullable_simple_user;
        comments_url: string;
        owner?: nullable_simple_user;
        truncated?: boolean;
        forks?: Array<any>;
        history?: Array<any>;
    } | null;
    url?: string;
    forks_url?: string;
    commits_url?: string;
    id?: string;
    node_id?: string;
    git_pull_url?: string;
    git_push_url?: string;
    html_url?: string;
    files?: Record<string, {
        filename?: string;
        type?: string;
        language?: string;
        raw_url?: string;
        size?: number;
        truncated?: boolean;
        content?: string;
        /**
         * The encoding used for `content`. Currently, `"utf-8"` and `"base64"` are supported.
         */
        encoding?: string;
    } | null>;
    public?: boolean;
    created_at?: string;
    updated_at?: string;
    description?: string | null;
    comments?: number;
    comments_enabled?: boolean;
    user?: string | null;
    comments_url?: string;
    owner?: simple_user;
    truncated?: boolean;
};


// ============================================================================
// Model: gpg_key
// ============================================================================
 * A unique encryption key
 */
export type gpg_key = {
    id: number;
    name?: string | null;
    primary_key_id: number | null;
    key_id: string;
    public_key: string;
    emails: Array<{
        email?: string;
        verified?: boolean;
    }>;
    subkeys: Array<{
        id?: number;
        primary_key_id?: number;
        key_id?: string;
        public_key?: string;
        emails?: Array<{
            email?: string;
            verified?: boolean;
        }>;
        subkeys?: Array<any>;
        can_sign?: boolean;
        can_encrypt_comms?: boolean;
        can_encrypt_storage?: boolean;
        can_certify?: boolean;
        created_at?: string;
        expires_at?: string | null;
        raw_key?: string | null;
        revoked?: boolean;
    }>;
    can_sign: boolean;
    can_encrypt_comms: boolean;
    can_encrypt_storage: boolean;
    can_certify: boolean;
    created_at: string;
    expires_at: string | null;
    revoked: boolean;
    raw_key: string | null;
};


// ============================================================================
// Model: hook
// ============================================================================
import type { webhook_config } from './webhook_config';
/**
 * Webhooks for repositories.
 */
export type hook = {
    type: string;
    /**
     * Unique identifier of the webhook.
     */
    id: number;
    /**
     * The name of a valid service, use 'web' for a webhook.
     */
    name: string;
    /**
     * Determines whether the hook is actually triggered on pushes.
     */
    active: boolean;
    /**
     * Determines what events the hook is triggered for. Default: ['push'].
     */
    events: Array<string>;
    config: webhook_config;
    updated_at: string;
    created_at: string;
    url: string;
    test_url: string;
    ping_url: string;
    deliveries_url?: string;
    last_response: hook_response;
};


// ============================================================================
// Model: hook_delivery
// ============================================================================
 * Delivery made by a webhook.
 */
export type hook_delivery = {
    /**
     * Unique identifier of the delivery.
     */
    id: number;
    /**
     * Unique identifier for the event (shared with all deliveries for all webhooks that subscribe to this event).
     */
    guid: string;
    /**
     * Time when the delivery was delivered.
     */
    delivered_at: string;
    /**
     * Whether the delivery is a redelivery.
     */
    redelivery: boolean;
    /**
     * Time spent delivering.
     */
    duration: number;
    /**
     * Description of the status of the attempted delivery
     */
    status: string;
    /**
     * Status code received when delivery was made.
     */
    status_code: number;
    /**
     * The event that triggered the delivery.
     */
    event: string;
    /**
     * The type of activity for the event that triggered the delivery.
     */
    action: string | null;
    /**
     * The id of the GitHub App installation associated with this event.
     */
    installation_id: number | null;
    /**
     * The id of the repository associated with this event.
     */
    repository_id: number | null;
    /**
     * Time when the webhook delivery was throttled.
     */
    throttled_at?: string | null;
    /**
     * The URL target of the delivery.
     */
    url?: string;
    request: {
        /**
         * The request headers sent with the webhook delivery.
         */
        headers: Record<string, any> | null;
        /**
         * The webhook payload.
         */
        payload: Record<string, any> | null;
    };
    response: {
        /**
         * The response headers received when the delivery was made.
         */
        headers: Record<string, any> | null;
        /**
         * The response payload received.
         */
        payload: string | null;
    };
};


// ============================================================================
// Model: hook_delivery_item
// ============================================================================
 * Delivery made by a webhook, without request and response information.
 */
export type hook_delivery_item = {
    /**
     * Unique identifier of the webhook delivery.
     */
    id: number;
    /**
     * Unique identifier for the event (shared with all deliveries for all webhooks that subscribe to this event).
     */
    guid: string;
    /**
     * Time when the webhook delivery occurred.
     */
    delivered_at: string;
    /**
     * Whether the webhook delivery is a redelivery.
     */
    redelivery: boolean;
    /**
     * Time spent delivering.
     */
    duration: number;
    /**
     * Describes the response returned after attempting the delivery.
     */
    status: string;
    /**
     * Status code received when delivery was made.
     */
    status_code: number;
    /**
     * The event that triggered the delivery.
     */
    event: string;
    /**
     * The type of activity for the event that triggered the delivery.
     */
    action: string | null;
    /**
     * The id of the GitHub App installation associated with this event.
     */
    installation_id: number | null;
    /**
     * The id of the repository associated with this event.
     */
    repository_id: number | null;
    /**
     * Time when the webhook delivery was throttled.
     */
    throttled_at?: string | null;
};


// ============================================================================
// Model: hovercard
// ============================================================================
 * Hovercard
 */
export type hovercard = {
    contexts: Array<{
        message: string;
        octicon: string;
    }>;
};


// ============================================================================
// Model: immutable_releases_organization_settings
// ============================================================================
 * Check immutable releases settings for an organization.
 */
export type immutable_releases_organization_settings = {
    /**
     * The policy that controls how immutable releases are enforced in the organization.
     */
    enforced_repositories: immutable_releases_organization_settings.enforced_repositories;
    /**
     * The API URL to use to get or set the selected repositories for immutable releases enforcement, when `enforced_repositories` is set to `selected`.
     */
    selected_repositories_url?: string;
};
export namespace immutable_releases_organization_settings {
    /**
     * The policy that controls how immutable releases are enforced in the organization.
     */
    export enum enforced_repositories {
        ALL = 'all',
        NONE = 'none',
        SELECTED = 'selected',
    }
}


// ============================================================================
// Model: installation
// ============================================================================
import type { enterprise } from './enterprise';
import type { nullable_simple_user } from './nullable_simple_user';
import type { simple_user } from './simple_user';
/**
 * Installation
 */
export type installation = {
    /**
     * The ID of the installation.
     */
    id: number;
    account: (simple_user | enterprise) | null;
    /**
     * Describe whether all repositories have been selected or there's a selection involved
     */
    repository_selection: installation.repository_selection;
    access_tokens_url: string;
    repositories_url: string;
    html_url: string;
    app_id: number;
    client_id?: string;
    /**
     * The ID of the user or organization this token is being scoped to.
     */
    target_id: number;
    target_type: string;
    permissions: app_permissions;
    events: Array<string>;
    created_at: string;
    updated_at: string;
    single_file_name: string | null;
    has_multiple_single_files?: boolean;
    single_file_paths?: Array<string>;
    app_slug: string;
    suspended_by: nullable_simple_user;
    suspended_at: string | null;
    contact_email?: string | null;
};
export namespace installation {
    /**
     * Describe whether all repositories have been selected or there's a selection involved
     */
    export enum repository_selection {
        ALL = 'all',
        SELECTED = 'selected',
    }
}


// ============================================================================
// Model: integration
// ============================================================================
import type { simple_user } from './simple_user';
/**
 * GitHub apps are a new way to extend GitHub. They can be installed directly on organizations and user accounts and granted access to specific repositories. They come with granular permissions and built-in webhooks. GitHub apps are first class actors within GitHub.
 */
export type integration = {
    /**
     * Unique identifier of the GitHub app
     */
    id: number;
    /**
     * The slug name of the GitHub app
     */
    slug?: string;
    node_id: string;
    client_id?: string;
    owner: (simple_user | enterprise);
    /**
     * The name of the GitHub app
     */
    name: string;
    description: string | null;
    external_url: string;
    html_url: string;
    created_at: string;
    updated_at: string;
    /**
     * The set of permissions for the GitHub app
     */
    permissions: Record<string, string>;
    /**
     * The list of events for the GitHub app. Note that the `installation_target`, `security_advisory`, and `meta` events are not included because they are global events and not specific to an installation.
     */
    events: Array<string>;
    /**
     * The number of installations associated with the GitHub app. Only returned when the integration is requesting details about itself.
     */
    installations_count?: number;
};


// ============================================================================
// Model: issue
// ============================================================================
import type { issue_dependencies_summary } from './issue_dependencies_summary';
import type { issue_field_value } from './issue_field_value';
import type { issue_type } from './issue_type';
import type { nullable_integration } from './nullable_integration';
import type { nullable_milestone } from './nullable_milestone';
import type { nullable_simple_user } from './nullable_simple_user';
import type { reaction_rollup } from './reaction_rollup';
import type { repository } from './repository';
import type { simple_user } from './simple_user';
import type { sub_issues_summary } from './sub_issues_summary';
/**
 * Issues are a great way to keep track of tasks, enhancements, and bugs for your projects.
 */
export type issue = {
    id: number;
    node_id: string;
    /**
     * URL for the issue
     */
    url: string;
    repository_url: string;
    labels_url: string;
    comments_url: string;
    events_url: string;
    html_url: string;
    /**
     * Number uniquely identifying the issue within its repository
     */
    number: number;
    /**
     * State of the issue; either 'open' or 'closed'
     */
    state: string;
    /**
     * The reason for the current state
     */
    state_reason?: issue.state_reason | null;
    /**
     * Title of the issue
     */
    title: string;
    /**
     * Contents of the issue
     */
    body?: string | null;
    user: nullable_simple_user;
    /**
     * Labels to associate with this issue; pass one or more label names to replace the set of labels on this issue; send an empty array to clear all labels from the issue; note that the labels are silently dropped for users without push access to the repository
     */
    labels: Array<(string | {
        id?: number;
        node_id?: string;
        url?: string;
        name?: string;
        description?: string | null;
        color?: string | null;
        default?: boolean;
    })>;
    assignee: nullable_simple_user;
    assignees?: Array<simple_user> | null;
    milestone: nullable_milestone;
    locked: boolean;
    active_lock_reason?: string | null;
    comments: number;
    pull_request?: {
        merged_at?: string | null;
        diff_url: string | null;
        html_url: string | null;
        patch_url: string | null;
        url: string | null;
    };
    closed_at: string | null;
    created_at: string;
    updated_at: string;
    draft?: boolean;
    closed_by?: nullable_simple_user;
    body_html?: string;
    body_text?: string;
    timeline_url?: string;
    type?: issue_type;
    repository?: repository;
    performed_via_github_app?: nullable_integration;
    author_association?: author_association;
    reactions?: reaction_rollup;
    sub_issues_summary?: sub_issues_summary;
    /**
     * URL to get the parent issue of this issue, if it is a sub-issue
     */
    parent_issue_url?: string | null;
    issue_dependencies_summary?: issue_dependencies_summary;
    issue_field_values?: Array<issue_field_value>;
};
export namespace issue {
    /**
     * The reason for the current state
     */
    export enum state_reason {
        COMPLETED = 'completed',
        REOPENED = 'reopened',
        NOT_PLANNED = 'not_planned',
        DUPLICATE = 'duplicate',
    }
}


// ============================================================================
// Model: issue_comment
// ============================================================================
import type { nullable_integration } from './nullable_integration';
import type { nullable_simple_user } from './nullable_simple_user';
import type { reaction_rollup } from './reaction_rollup';
/**
 * Comments provide a way for people to collaborate on an issue.
 */
export type issue_comment = {
    /**
     * Unique identifier of the issue comment
     */
    id: number;
    node_id: string;
    /**
     * URL for the issue comment
     */
    url: string;
    /**
     * Contents of the issue comment
     */
    body?: string;
    body_text?: string;
    body_html?: string;
    html_url: string;
    user: nullable_simple_user;
    created_at: string;
    updated_at: string;
    issue_url: string;
    author_association?: author_association;
    performed_via_github_app?: nullable_integration;
    reactions?: reaction_rollup;
};


// ============================================================================
// Model: issue_event
// ============================================================================
import type { issue_event_dismissed_review } from './issue_event_dismissed_review';
import type { issue_event_label } from './issue_event_label';
import type { issue_event_milestone } from './issue_event_milestone';
import type { issue_event_project_card } from './issue_event_project_card';
import type { issue_event_rename } from './issue_event_rename';
import type { nullable_integration } from './nullable_integration';
import type { nullable_issue } from './nullable_issue';
import type { nullable_simple_user } from './nullable_simple_user';
import type { team } from './team';
/**
 * Issue Event
 */
export type issue_event = {
    id: number;
    node_id: string;
    url: string;
    actor: nullable_simple_user;
    event: string;
    commit_id: string | null;
    commit_url: string | null;
    created_at: string;
    issue?: nullable_issue;
    label?: issue_event_label;
    assignee?: nullable_simple_user;
    assigner?: nullable_simple_user;
    review_requester?: nullable_simple_user;
    requested_reviewer?: nullable_simple_user;
    requested_team?: team;
    dismissed_review?: issue_event_dismissed_review;
    milestone?: issue_event_milestone;
    project_card?: issue_event_project_card;
    rename?: issue_event_rename;
    author_association?: author_association;
    lock_reason?: string | null;
    performed_via_github_app?: nullable_integration;
};


// ============================================================================
// Model: issue_event_for_issue
// ============================================================================
import type { assigned_issue_event } from './assigned_issue_event';
import type { converted_note_to_issue_issue_event } from './converted_note_to_issue_issue_event';
import type { demilestoned_issue_event } from './demilestoned_issue_event';
import type { labeled_issue_event } from './labeled_issue_event';
import type { locked_issue_event } from './locked_issue_event';
import type { milestoned_issue_event } from './milestoned_issue_event';
import type { moved_column_in_project_issue_event } from './moved_column_in_project_issue_event';
import type { removed_from_project_issue_event } from './removed_from_project_issue_event';
import type { renamed_issue_event } from './renamed_issue_event';
import type { review_dismissed_issue_event } from './review_dismissed_issue_event';
import type { review_request_removed_issue_event } from './review_request_removed_issue_event';
import type { review_requested_issue_event } from './review_requested_issue_event';
import type { unassigned_issue_event } from './unassigned_issue_event';
import type { unlabeled_issue_event } from './unlabeled_issue_event';
/**
 * Issue Event for Issue
 */
export type issue_event_for_issue = (labeled_issue_event | unlabeled_issue_event | assigned_issue_event | unassigned_issue_event | milestoned_issue_event | demilestoned_issue_event | renamed_issue_event | review_requested_issue_event | review_request_removed_issue_event | review_dismissed_issue_event | locked_issue_event | added_to_project_issue_event | moved_column_in_project_issue_event | removed_from_project_issue_event | converted_note_to_issue_issue_event);


// ============================================================================
// Model: issue_type
// ============================================================================
 * The type of issue.
 */
export type issue_type = {
    /**
     * The unique identifier of the issue type.
     */
    id: number;
    /**
     * The node identifier of the issue type.
     */
    node_id: string;
    /**
     * The name of the issue type.
     */
    name: string;
    /**
     * The description of the issue type.
     */
    description: string | null;
    /**
     * The color of the issue type.
     */
    color?: issue_type.color | null;
    /**
     * The time the issue type created.
     */
    created_at?: string;
    /**
     * The time the issue type last updated.
     */
    updated_at?: string;
    /**
     * The enabled state of the issue type.
     */
    is_enabled?: boolean;
};
export namespace issue_type {
    /**
     * The color of the issue type.
     */
    export enum color {
        GRAY = 'gray',
        BLUE = 'blue',
        GREEN = 'green',
        YELLOW = 'yellow',
        ORANGE = 'orange',
        RED = 'red',
        PINK = 'pink',
        PURPLE = 'purple',
    }
}


// ============================================================================
// Model: job
// ============================================================================
 * Information of a job execution in a workflow run
 */
export type job = {
    /**
     * The id of the job.
     */
    id: number;
    /**
     * The id of the associated workflow run.
     */
    run_id: number;
    run_url: string;
    /**
     * Attempt number of the associated workflow run, 1 for first attempt and higher if the workflow was re-run.
     */
    run_attempt?: number;
    node_id: string;
    /**
     * The SHA of the commit that is being run.
     */
    head_sha: string;
    url: string;
    html_url: string | null;
    /**
     * The phase of the lifecycle that the job is currently in.
     */
    status: job.status;
    /**
     * The outcome of the job.
     */
    conclusion: job.conclusion | null;
    /**
     * The time that the job created, in ISO 8601 format.
     */
    created_at: string;
    /**
     * The time that the job started, in ISO 8601 format.
     */
    started_at: string;
    /**
     * The time that the job finished, in ISO 8601 format.
     */
    completed_at: string | null;
    /**
     * The name of the job.
     */
    name: string;
    /**
     * Steps in this job.
     */
    steps?: Array<{
        /**
         * The phase of the lifecycle that the job is currently in.
         */
        status: 'queued' | 'in_progress' | 'completed';
        /**
         * The outcome of the job.
         */
        conclusion: string | null;
        /**
         * The name of the job.
         */
        name: string;
        number: number;
        /**
         * The time that the step started, in ISO 8601 format.
         */
        started_at?: string | null;
        /**
         * The time that the job finished, in ISO 8601 format.
         */
        completed_at?: string | null;
    }>;
    check_run_url: string;
    /**
     * Labels for the workflow job. Specified by the "runs_on" attribute in the action's workflow file.
     */
    labels: Array<string>;
    /**
     * The ID of the runner to which this job has been assigned. (If a runner hasn't yet been assigned, this will be null.)
     */
    runner_id: number | null;
    /**
     * The name of the runner to which this job has been assigned. (If a runner hasn't yet been assigned, this will be null.)
     */
    runner_name: string | null;
    /**
     * The ID of the runner group to which this job has been assigned. (If a runner hasn't yet been assigned, this will be null.)
     */
    runner_group_id: number | null;
    /**
     * The name of the runner group to which this job has been assigned. (If a runner hasn't yet been assigned, this will be null.)
     */
    runner_group_name: string | null;
    /**
     * The name of the workflow.
     */
    workflow_name: string | null;
    /**
     * The name of the current branch.
     */
    head_branch: string | null;
};
export namespace job {
    /**
     * The phase of the lifecycle that the job is currently in.
     */
    export enum status {
        QUEUED = 'queued',
        IN_PROGRESS = 'in_progress',
        COMPLETED = 'completed',
        WAITING = 'waiting',
        REQUESTED = 'requested',
        PENDING = 'pending',
    }
    /**
     * The outcome of the job.
     */
    export enum conclusion {
        SUCCESS = 'success',
        FAILURE = 'failure',
        NEUTRAL = 'neutral',
        CANCELLED = 'cancelled',
        SKIPPED = 'skipped',
        TIMED_OUT = 'timed_out',
        ACTION_REQUIRED = 'action_required',
    }
}


// ============================================================================
// Model: key
// ============================================================================
 * Key
 */
export type key = {
    key: string;
    id: number;
    url: string;
    title: string;
    created_at: string;
    verified: boolean;
    read_only: boolean;
    last_used?: string | null;
};


// ============================================================================
// Model: key_simple
// ============================================================================
 * Key Simple
 */
export type key_simple = {
    id: number;
    key: string;
    created_at?: string;
    last_used?: string | null;
};


// ============================================================================
// Model: label
// ============================================================================
 * Color-coded labels help you categorize and filter your issues (just like labels in Gmail).
 */
export type label = {
    /**
     * Unique identifier for the label.
     */
    id: number;
    node_id: string;
    /**
     * URL for the label
     */
    url: string;
    /**
     * The name of the label.
     */
    name: string;
    /**
     * Optional description of the label, such as its purpose.
     */
    description: string | null;
    /**
     * 6-character hex code, without the leading #, identifying the color
     */
    color: string;
    /**
     * Whether this label comes by default in a new repository.
     */
    default: boolean;
};


// ============================================================================
// Model: language
// ============================================================================
 * Language
 */
export type language = Record<string, number>;

// ============================================================================
// Model: merged_upstream
// ============================================================================
 * Results of a successful merge upstream request
 */
export type merged_upstream = {
    message?: string;
    merge_type?: merged_upstream.merge_type;
    base_branch?: string;
};
export namespace merged_upstream {
    export enum merge_type {
        MERGE = 'merge',
        FAST_FORWARD = 'fast-forward',
        NONE = 'none',
    }
}


// ============================================================================
// Model: milestone
// ============================================================================
/**
 * A collection of related issues and pull requests.
 */
export type milestone = {
    url: string;
    html_url: string;
    labels_url: string;
    id: number;
    node_id: string;
    /**
     * The number of the milestone.
     */
    number: number;
    /**
     * The state of the milestone.
     */
    state: milestone.state;
    /**
     * The title of the milestone.
     */
    title: string;
    description: string | null;
    creator: nullable_simple_user;
    open_issues: number;
    closed_issues: number;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    due_on: string | null;
};
export namespace milestone {
    /**
     * The state of the milestone.
     */
    export enum state {
        OPEN = 'open',
        CLOSED = 'closed',
    }
}


// ============================================================================
// Model: minimal_repository
// ============================================================================
import type { security_and_analysis } from './security_and_analysis';
import type { simple_user } from './simple_user';
/**
 * Minimal Repository
 */
export type minimal_repository = {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    owner: simple_user;
    private: boolean;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    archive_url: string;
    assignees_url: string;
    blobs_url: string;
    branches_url: string;
    collaborators_url: string;
    comments_url: string;
    commits_url: string;
    compare_url: string;
    contents_url: string;
    contributors_url: string;
    deployments_url: string;
    downloads_url: string;
    events_url: string;
    forks_url: string;
    git_commits_url: string;
    git_refs_url: string;
    git_tags_url: string;
    git_url?: string;
    issue_comment_url: string;
    issue_events_url: string;
    issues_url: string;
    keys_url: string;
    labels_url: string;
    languages_url: string;
    merges_url: string;
    milestones_url: string;
    notifications_url: string;
    pulls_url: string;
    releases_url: string;
    ssh_url?: string;
    stargazers_url: string;
    statuses_url: string;
    subscribers_url: string;
    subscription_url: string;
    tags_url: string;
    teams_url: string;
    trees_url: string;
    clone_url?: string;
    mirror_url?: string | null;
    hooks_url: string;
    svn_url?: string;
    homepage?: string | null;
    language?: string | null;
    forks_count?: number;
    stargazers_count?: number;
    watchers_count?: number;
    /**
     * The size of the repository, in kilobytes. Size is calculated hourly. When a repository is initially created, the size is 0.
     */
    size?: number;
    default_branch?: string;
    open_issues_count?: number;
    is_template?: boolean;
    topics?: Array<string>;
    has_issues?: boolean;
    has_projects?: boolean;
    has_wiki?: boolean;
    has_pages?: boolean;
    has_downloads?: boolean;
    has_discussions?: boolean;
    archived?: boolean;
    disabled?: boolean;
    visibility?: string;
    pushed_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    permissions?: {
        admin?: boolean;
        maintain?: boolean;
        push?: boolean;
        triage?: boolean;
        pull?: boolean;
    };
    role_name?: string;
    temp_clone_token?: string;
    delete_branch_on_merge?: boolean;
    subscribers_count?: number;
    network_count?: number;
    code_of_conduct?: code_of_conduct;
    license?: {
        key?: string;
        name?: string;
        spdx_id?: string;
        url?: string;
        node_id?: string;
    } | null;
    forks?: number;
    open_issues?: number;
    watchers?: number;
    allow_forking?: boolean;
    web_commit_signoff_required?: boolean;
    security_and_analysis?: security_and_analysis;
    /**
     * The custom properties that were defined for the repository. The keys are the custom property names, and the values are the corresponding custom property values.
     */
    custom_properties?: Record<string, any>;
};


// ============================================================================
// Model: oidc_custom_sub_repo
// ============================================================================
 * Actions OIDC subject customization for a repository
 */
export type oidc_custom_sub_repo = {
    /**
     * Whether to use the default template or not. If `true`, the `include_claim_keys` field is ignored.
     */
    use_default: boolean;
    /**
     * Array of unique strings. Each claim key can only contain alphanumeric characters and underscores.
     */
    include_claim_keys?: Array<string>;
};


// ============================================================================
// Model: org_hook
// ============================================================================
 * Org Hook
 */
export type org_hook = {
    id: number;
    url: string;
    ping_url: string;
    deliveries_url?: string;
    name: string;
    events: Array<string>;
    active: boolean;
    config: {
        url?: string;
        insecure_ssl?: string;
        content_type?: string;
        secret?: string;
    };
    updated_at: string;
    created_at: string;
    type: string;
};


// ============================================================================
// Model: org_membership
// ============================================================================
import type { organization_simple } from './organization_simple';
/**
 * Org Membership
 */
export type org_membership = {
    url: string;
    /**
     * The state of the member in the organization. The `pending` state indicates the user has not yet accepted an invitation.
     */
    state: org_membership.state;
    /**
     * The user's membership type in the organization.
     */
    role: org_membership.role;
    /**
     * Whether the user has direct membership in the organization.
     */
    direct_membership?: boolean;
    /**
     * The slugs of the enterprise teams providing the user with indirect membership in the organization.
     * A limit of 100 enterprise team slugs is returned.
     */
    enterprise_teams_providing_indirect_membership?: Array<string>;
    organization_url: string;
    organization: organization_simple;
    user: nullable_simple_user;
    permissions?: {
        can_create_repository: boolean;
    };
};
export namespace org_membership {
    /**
     * The state of the member in the organization. The `pending` state indicates the user has not yet accepted an invitation.
     */
    export enum state {
        ACTIVE = 'active',
        PENDING = 'pending',
    }
    /**
     * The user's membership type in the organization.
     */
    export enum role {
        ADMIN = 'admin',
        MEMBER = 'member',
        BILLING_MANAGER = 'billing_manager',
    }
}


// ============================================================================
// Model: org_repo_custom_property_values
// ============================================================================
/**
 * List of custom property values for a repository
 */
export type org_repo_custom_property_values = {
    repository_id: number;
    repository_name: string;
    repository_full_name: string;
    /**
     * List of custom property names and associated values
     */
    properties: Array<custom_property_value>;
};


// ============================================================================
// Model: org_rules
// ============================================================================
import type { repository_rule_code_scanning } from './repository_rule_code_scanning';
import type { repository_rule_commit_author_email_pattern } from './repository_rule_commit_author_email_pattern';
import type { repository_rule_commit_message_pattern } from './repository_rule_commit_message_pattern';
import type { repository_rule_committer_email_pattern } from './repository_rule_committer_email_pattern';
import type { repository_rule_copilot_code_review } from './repository_rule_copilot_code_review';
import type { repository_rule_creation } from './repository_rule_creation';
import type { repository_rule_deletion } from './repository_rule_deletion';
import type { repository_rule_file_extension_restriction } from './repository_rule_file_extension_restriction';
import type { repository_rule_file_path_restriction } from './repository_rule_file_path_restriction';
import type { repository_rule_max_file_path_length } from './repository_rule_max_file_path_length';
import type { repository_rule_max_file_size } from './repository_rule_max_file_size';
import type { repository_rule_non_fast_forward } from './repository_rule_non_fast_forward';
import type { repository_rule_pull_request } from './repository_rule_pull_request';
import type { repository_rule_required_deployments } from './repository_rule_required_deployments';
import type { repository_rule_required_linear_history } from './repository_rule_required_linear_history';
import type { repository_rule_required_signatures } from './repository_rule_required_signatures';
import type { repository_rule_required_status_checks } from './repository_rule_required_status_checks';
import type { repository_rule_tag_name_pattern } from './repository_rule_tag_name_pattern';
import type { repository_rule_update } from './repository_rule_update';
import type { repository_rule_workflows } from './repository_rule_workflows';
/**
 * A repository rule.
 */
export type org_rules = (repository_rule_creation | repository_rule_update | repository_rule_deletion | repository_rule_required_linear_history | repository_rule_required_deployments | repository_rule_required_signatures | repository_rule_pull_request | repository_rule_required_status_checks | repository_rule_non_fast_forward | repository_rule_commit_message_pattern | repository_rule_commit_author_email_pattern | repository_rule_committer_email_pattern | repository_rule_branch_name_pattern | repository_rule_tag_name_pattern | repository_rule_file_path_restriction | repository_rule_max_file_path_length | repository_rule_file_extension_restriction | repository_rule_max_file_size | repository_rule_workflows | repository_rule_code_scanning | repository_rule_copilot_code_review);


// ============================================================================
// Model: org_ruleset_conditions
// ============================================================================
import type { repository_ruleset_conditions_repository_id_target } from './repository_ruleset_conditions_repository_id_target';
import type { repository_ruleset_conditions_repository_name_target } from './repository_ruleset_conditions_repository_name_target';
import type { repository_ruleset_conditions_repository_property_target } from './repository_ruleset_conditions_repository_property_target';
/**
 * Conditions for an organization ruleset.
 * The branch and tag rulesets conditions object should contain both `repository_name` and `ref_name` properties, or both `repository_id` and `ref_name` properties, or both `repository_property` and `ref_name` properties.
 * The push rulesets conditions object does not require the `ref_name` property.
 * For repository policy rulesets, the conditions object should only contain the `repository_name`, the `repository_id`, or the `repository_property`.
 */
export type org_ruleset_conditions = ((repository_ruleset_conditions & repository_ruleset_conditions_repository_name_target) | (repository_ruleset_conditions & repository_ruleset_conditions_repository_id_target) | (repository_ruleset_conditions & repository_ruleset_conditions_repository_property_target));


// ============================================================================
// Model: organization_actions_secret
// ============================================================================
 * Secrets for GitHub Actions for an organization.
 */
export type organization_actions_secret = {
    /**
     * The name of the secret.
     */
    name: string;
    created_at: string;
    updated_at: string;
    /**
     * Visibility of a secret
     */
    visibility: organization_actions_secret.visibility;
    selected_repositories_url?: string;
};
export namespace organization_actions_secret {
    /**
     * Visibility of a secret
     */
    export enum visibility {
        ALL = 'all',
        PRIVATE = 'private',
        SELECTED = 'selected',
    }
}


// ============================================================================
// Model: organization_actions_variable
// ============================================================================
 * Organization variable for GitHub Actions.
 */
export type organization_actions_variable = {
    /**
     * The name of the variable.
     */
    name: string;
    /**
     * The value of the variable.
     */
    value: string;
    /**
     * The date and time at which the variable was created, in ISO 8601 format':' YYYY-MM-DDTHH:MM:SSZ.
     */
    created_at: string;
    /**
     * The date and time at which the variable was last updated, in ISO 8601 format':' YYYY-MM-DDTHH:MM:SSZ.
     */
    updated_at: string;
    /**
     * Visibility of a variable
     */
    visibility: organization_actions_variable.visibility;
    selected_repositories_url?: string;
};
export namespace organization_actions_variable {
    /**
     * Visibility of a variable
     */
    export enum visibility {
        ALL = 'all',
        PRIVATE = 'private',
        SELECTED = 'selected',
    }
}


// ============================================================================
// Model: organization_create_issue_type
// ============================================================================
    /**
     * Name of the issue type.
     */
    name: string;
    /**
     * Whether or not the issue type is enabled at the organization level.
     */
    is_enabled: boolean;
    /**
     * Description of the issue type.
     */
    description?: string | null;
    /**
     * Color for the issue type.
     */
    color?: organization_create_issue_type.color | null;
};
export namespace organization_create_issue_type {
    /**
     * Color for the issue type.
     */
    export enum color {
        GRAY = 'gray',
        BLUE = 'blue',
        GREEN = 'green',
        YELLOW = 'yellow',
        ORANGE = 'orange',
        RED = 'red',
        PINK = 'pink',
        PURPLE = 'purple',
    }
}


// ============================================================================
// Model: organization_full
// ============================================================================
 * Organization Full
 */
export type organization_full = {
    login: string;
    id: number;
    node_id: string;
    url: string;
    repos_url: string;
    events_url: string;
    hooks_url: string;
    issues_url: string;
    members_url: string;
    public_members_url: string;
    avatar_url: string;
    description: string | null;
    name?: string;
    company?: string;
    blog?: string;
    location?: string;
    email?: string;
    twitter_username?: string | null;
    is_verified?: boolean;
    has_organization_projects: boolean;
    has_repository_projects: boolean;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    html_url: string;
    type: string;
    total_private_repos?: number;
    owned_private_repos?: number;
    private_gists?: number | null;
    disk_usage?: number | null;
    /**
     * The number of collaborators on private repositories.
     *
     * This field may be null if the number of private repositories is over 50,000.
     */
    collaborators?: number | null;
    billing_email?: string | null;
    plan?: {
        name: string;
        space: number;
        private_repos: number;
        filled_seats?: number;
        seats?: number;
    };
    default_repository_permission?: string | null;
    /**
     * The default branch for repositories created in this organization.
     */
    default_repository_branch?: string | null;
    members_can_create_repositories?: boolean | null;
    two_factor_requirement_enabled?: boolean | null;
    members_allowed_repository_creation_type?: string;
    members_can_create_public_repositories?: boolean;
    members_can_create_private_repositories?: boolean;
    members_can_create_internal_repositories?: boolean;
    members_can_create_pages?: boolean;
    members_can_create_public_pages?: boolean;
    members_can_create_private_pages?: boolean;
    members_can_delete_repositories?: boolean;
    members_can_change_repo_visibility?: boolean;
    members_can_invite_outside_collaborators?: boolean;
    members_can_delete_issues?: boolean;
    display_commenter_full_name_setting_enabled?: boolean;
    readers_can_create_discussions?: boolean;
    members_can_create_teams?: boolean;
    members_can_view_dependency_insights?: boolean;
    members_can_fork_private_repositories?: boolean | null;
    web_commit_signoff_required?: boolean;
    /**
     * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
     *
     * Whether GitHub Advanced Security is enabled for new repositories and repositories transferred to this organization.
     *
     * This field is only visible to organization owners or members of a team with the security manager role.
     * @deprecated
     */
    advanced_security_enabled_for_new_repositories?: boolean;
    /**
     * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
     *
     * Whether Dependabot alerts are automatically enabled for new repositories and repositories transferred to this organization.
     *
     * This field is only visible to organization owners or members of a team with the security manager role.
     * @deprecated
     */
    dependabot_alerts_enabled_for_new_repositories?: boolean;
    /**
     * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
     *
     * Whether Dependabot security updates are automatically enabled for new repositories and repositories transferred to this organization.
     *
     * This field is only visible to organization owners or members of a team with the security manager role.
     * @deprecated
     */
    dependabot_security_updates_enabled_for_new_repositories?: boolean;
    /**
     * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
     *
     * Whether dependency graph is automatically enabled for new repositories and repositories transferred to this organization.
     *
     * This field is only visible to organization owners or members of a team with the security manager role.
     * @deprecated
     */
    dependency_graph_enabled_for_new_repositories?: boolean;
    /**
     * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
     *
     * Whether secret scanning is automatically enabled for new repositories and repositories transferred to this organization.
     *
     * This field is only visible to organization owners or members of a team with the security manager role.
     * @deprecated
     */
    secret_scanning_enabled_for_new_repositories?: boolean;
    /**
     * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
     *
     * Whether secret scanning push protection is automatically enabled for new repositories and repositories transferred to this organization.
     *
     * This field is only visible to organization owners or members of a team with the security manager role.
     * @deprecated
     */
    secret_scanning_push_protection_enabled_for_new_repositories?: boolean;
    /**
     * Whether a custom link is shown to contributors who are blocked from pushing a secret by push protection.
     */
    secret_scanning_push_protection_custom_link_enabled?: boolean;
    /**
     * An optional URL string to display to contributors who are blocked from pushing a secret.
     */
    secret_scanning_push_protection_custom_link?: string | null;
    created_at: string;
    updated_at: string;
    archived_at: string | null;
    /**
     * Controls whether or not deploy keys may be added and used for repositories in the organization.
     */
    deploy_keys_enabled_for_repositories?: boolean;
};


// ============================================================================
// Model: organization_invitation
// ============================================================================
/**
 * Organization Invitation
 */
export type organization_invitation = {
    id: number;
    login: string | null;
    email: string | null;
    role: string;
    created_at: string;
    failed_at?: string | null;
    failed_reason?: string | null;
    inviter: simple_user;
    team_count: number;
    node_id: string;
    invitation_teams_url: string;
    invitation_source?: string;
};


// ============================================================================
// Model: organization_programmatic_access_grant
// ============================================================================
/**
 * Minimal representation of an organization programmatic access grant for enumerations
 */
export type organization_programmatic_access_grant = {
    /**
     * Unique identifier of the fine-grained personal access token grant. The `pat_id` used to get details about an approved fine-grained personal access token.
     */
    id: number;
    owner: simple_user;
    /**
     * Type of repository selection requested.
     */
    repository_selection: organization_programmatic_access_grant.repository_selection;
    /**
     * URL to the list of repositories the fine-grained personal access token can access. Only follow when `repository_selection` is `subset`.
     */
    repositories_url: string;
    /**
     * Permissions requested, categorized by type of permission.
     */
    permissions: {
        organization?: Record<string, string>;
        repository?: Record<string, string>;
        other?: Record<string, string>;
    };
    /**
     * Date and time when the fine-grained personal access token was approved to access the organization.
     */
    access_granted_at: string;
    /**
     * Unique identifier of the user's token. This field can also be found in audit log events and the organization's settings for their PAT grants.
     */
    token_id: number;
    /**
     * The name given to the user's token. This field can also be found in an organization's settings page for Active Tokens.
     */
    token_name: string;
    /**
     * Whether the associated fine-grained personal access token has expired.
     */
    token_expired: boolean;
    /**
     * Date and time when the associated fine-grained personal access token expires.
     */
    token_expires_at: string | null;
    /**
     * Date and time when the associated fine-grained personal access token was last used for authentication.
     */
    token_last_used_at: string | null;
};
export namespace organization_programmatic_access_grant {
    /**
     * Type of repository selection requested.
     */
    export enum repository_selection {
        NONE = 'none',
        ALL = 'all',
        SUBSET = 'subset',
    }
}


// ============================================================================
// Model: organization_programmatic_access_grant_request
// ============================================================================
/**
 * Minimal representation of an organization programmatic access grant request for enumerations
 */
export type organization_programmatic_access_grant_request = {
    /**
     * Unique identifier of the request for access via fine-grained personal access token. The `pat_request_id` used to review PAT requests.
     */
    id: number;
    /**
     * Reason for requesting access.
     */
    reason: string | null;
    owner: simple_user;
    /**
     * Type of repository selection requested.
     */
    repository_selection: organization_programmatic_access_grant_request.repository_selection;
    /**
     * URL to the list of repositories requested to be accessed via fine-grained personal access token. Should only be followed when `repository_selection` is `subset`.
     */
    repositories_url: string;
    /**
     * Permissions requested, categorized by type of permission.
     */
    permissions: {
        organization?: Record<string, string>;
        repository?: Record<string, string>;
        other?: Record<string, string>;
    };
    /**
     * Date and time when the request for access was created.
     */
    created_at: string;
    /**
     * Unique identifier of the user's token. This field can also be found in audit log events and the organization's settings for their PAT grants.
     */
    token_id: number;
    /**
     * The name given to the user's token. This field can also be found in an organization's settings page for Active Tokens.
     */
    token_name: string;
    /**
     * Whether the associated fine-grained personal access token has expired.
     */
    token_expired: boolean;
    /**
     * Date and time when the associated fine-grained personal access token expires.
     */
    token_expires_at: string | null;
    /**
     * Date and time when the associated fine-grained personal access token was last used for authentication.
     */
    token_last_used_at: string | null;
};
export namespace organization_programmatic_access_grant_request {
    /**
     * Type of repository selection requested.
     */
    export enum repository_selection {
        NONE = 'none',
        ALL = 'all',
        SUBSET = 'subset',
    }
}


// ============================================================================
// Model: organization_role
// ============================================================================
/**
 * Organization roles
 */
export type organization_role = {
    /**
     * The unique identifier of the role.
     */
    id: number;
    /**
     * The name of the role.
     */
    name: string;
    /**
     * A short description about who this role is for or what permissions it grants.
     */
    description?: string | null;
    /**
     * The system role from which this role inherits permissions.
     */
    base_role?: organization_role.base_role | null;
    /**
     * Source answers the question, "where did this role come from?"
     */
    source?: organization_role.source | null;
    /**
     * A list of permissions included in this role.
     */
    permissions: Array<string>;
    organization: nullable_simple_user;
    /**
     * The date and time the role was created.
     */
    created_at: string;
    /**
     * The date and time the role was last updated.
     */
    updated_at: string;
};
export namespace organization_role {
    /**
     * The system role from which this role inherits permissions.
     */
    export enum base_role {
        READ = 'read',
        TRIAGE = 'triage',
        WRITE = 'write',
        MAINTAIN = 'maintain',
        ADMIN = 'admin',
    }
    /**
     * Source answers the question, "where did this role come from?"
     */
    export enum source {
        ORGANIZATION = 'Organization',
        ENTERPRISE = 'Enterprise',
        PREDEFINED = 'Predefined',
    }
}


// ============================================================================
// Model: organization_simple
// ============================================================================
 * A GitHub organization.
 */
export type organization_simple = {
    login: string;
    id: number;
    node_id: string;
    url: string;
    repos_url: string;
    events_url: string;
    hooks_url: string;
    issues_url: string;
    members_url: string;
    public_members_url: string;
    avatar_url: string;
    description: string | null;
};


// ============================================================================
// Model: organization_update_issue_type
// ============================================================================
    /**
     * Name of the issue type.
     */
    name: string;
    /**
     * Whether or not the issue type is enabled at the organization level.
     */
    is_enabled: boolean;
    /**
     * Description of the issue type.
     */
    description?: string | null;
    /**
     * Color for the issue type.
     */
    color?: organization_update_issue_type.color | null;
};
export namespace organization_update_issue_type {
    /**
     * Color for the issue type.
     */
    export enum color {
        GRAY = 'gray',
        BLUE = 'blue',
        GREEN = 'green',
        YELLOW = 'yellow',
        ORANGE = 'orange',
        RED = 'red',
        PINK = 'pink',
        PURPLE = 'purple',
    }
}


// ============================================================================
// Model: page
// ============================================================================
 * The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
 */
export type page = number;

// ============================================================================
// Model: page_build
// ============================================================================
/**
 * Page Build
 */
export type page_build = {
    url: string;
    status: string;
    error: {
        message: string | null;
    };
    pusher: nullable_simple_user;
    commit: string;
    duration: number;
    created_at: string;
    updated_at: string;
};


// ============================================================================
// Model: page_build_status
// ============================================================================
 * Page Build Status
 */
export type page_build_status = {
    url: string;
    status: string;
};


// ============================================================================
// Model: page_deployment
// ============================================================================
 * The GitHub Pages deployment status.
 */
export type page_deployment = {
    /**
     * The ID of the GitHub Pages deployment. This is the Git SHA of the deployed commit.
     */
    id: (number | string);
    /**
     * The URI to monitor GitHub Pages deployment status.
     */
    status_url: string;
    /**
     * The URI to the deployed GitHub Pages.
     */
    page_url: string;
    /**
     * The URI to the deployed GitHub Pages preview.
     */
    preview_url?: string;
};


// ============================================================================
// Model: pages_deployment_status
// ============================================================================
    /**
     * The current status of the deployment.
     */
    status?: pages_deployment_status.status;
};
export namespace pages_deployment_status {
    /**
     * The current status of the deployment.
     */
    export enum status {
        DEPLOYMENT_IN_PROGRESS = 'deployment_in_progress',
        SYNCING_FILES = 'syncing_files',
        FINISHED_FILE_SYNC = 'finished_file_sync',
        UPDATING_PAGES = 'updating_pages',
        PURGING_CDN = 'purging_cdn',
        DEPLOYMENT_CANCELLED = 'deployment_cancelled',
        DEPLOYMENT_FAILED = 'deployment_failed',
        DEPLOYMENT_CONTENT_FAILED = 'deployment_content_failed',
        DEPLOYMENT_ATTEMPT_ERROR = 'deployment_attempt_error',
        DEPLOYMENT_LOST = 'deployment_lost',
        SUCCEED = 'succeed',
    }
}


// ============================================================================
// Model: pages_health_check
// ============================================================================
 * Pages Health Check Status
 */
export type pages_health_check = {
    domain?: {
        host?: string;
        uri?: string;
        nameservers?: string;
        dns_resolves?: boolean;
        is_proxied?: boolean | null;
        is_cloudflare_ip?: boolean | null;
        is_fastly_ip?: boolean | null;
        is_old_ip_address?: boolean | null;
        is_a_record?: boolean | null;
        has_cname_record?: boolean | null;
        has_mx_records_present?: boolean | null;
        is_valid_domain?: boolean;
        is_apex_domain?: boolean;
        should_be_a_record?: boolean | null;
        is_cname_to_github_user_domain?: boolean | null;
        is_cname_to_pages_dot_github_dot_com?: boolean | null;
        is_cname_to_fastly?: boolean | null;
        is_pointed_to_github_pages_ip?: boolean | null;
        is_non_github_pages_ip_present?: boolean | null;
        is_pages_domain?: boolean;
        is_served_by_pages?: boolean | null;
        is_valid?: boolean;
        reason?: string | null;
        responds_to_https?: boolean;
        enforces_https?: boolean;
        https_error?: string | null;
        is_https_eligible?: boolean | null;
        caa_error?: string | null;
    };
    alt_domain?: {
        host?: string;
        uri?: string;
        nameservers?: string;
        dns_resolves?: boolean;
        is_proxied?: boolean | null;
        is_cloudflare_ip?: boolean | null;
        is_fastly_ip?: boolean | null;
        is_old_ip_address?: boolean | null;
        is_a_record?: boolean | null;
        has_cname_record?: boolean | null;
        has_mx_records_present?: boolean | null;
        is_valid_domain?: boolean;
        is_apex_domain?: boolean;
        should_be_a_record?: boolean | null;
        is_cname_to_github_user_domain?: boolean | null;
        is_cname_to_pages_dot_github_dot_com?: boolean | null;
        is_cname_to_fastly?: boolean | null;
        is_pointed_to_github_pages_ip?: boolean | null;
        is_non_github_pages_ip_present?: boolean | null;
        is_pages_domain?: boolean;
        is_served_by_pages?: boolean | null;
        is_valid?: boolean;
        reason?: string | null;
        responds_to_https?: boolean;
        enforces_https?: boolean;
        https_error?: string | null;
        is_https_eligible?: boolean | null;
        caa_error?: string | null;
    } | null;
};


// ============================================================================
// Model: participation_stats
// ============================================================================
    all: Array<number>;
    owner: Array<number>;
};


// ============================================================================
// Model: pending_deployment
// ============================================================================
import type { simple_user } from './simple_user';
import type { team } from './team';
/**
 * Details of a deployment that is waiting for protection rules to pass
 */
export type pending_deployment = {
    environment: {
        /**
         * The id of the environment.
         */
        id?: number;
        node_id?: string;
        /**
         * The name of the environment.
         */
        name?: string;
        url?: string;
        html_url?: string;
    };
    /**
     * The set duration of the wait timer
     */
    wait_timer: number;
    /**
     * The time that the wait timer began.
     */
    wait_timer_started_at: string | null;
    /**
     * Whether the currently authenticated user can approve the deployment
     */
    current_user_can_approve: boolean;
    /**
     * The people or teams that may approve jobs that reference the environment. You can list up to six users or teams as reviewers. The reviewers must have at least read access to the repository. Only one of the required reviewers needs to approve the job for it to proceed.
     */
    reviewers: Array<{
        type?: deployment_reviewer_type;
        reviewer?: (simple_user | team);
    }>;
};


// ============================================================================
// Model: prevent_self_review
// ============================================================================
 * Whether or not a user who created the job is prevented from approving their own job.
 */
export type prevent_self_review = boolean;

// ============================================================================
// Model: private_user
// ============================================================================
 * Private User
 */
export type private_user = {
    login: string;
    id: number;
    user_view_type?: string;
    node_id: string;
    avatar_url: string;
    gravatar_id: string | null;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name: string | null;
    company: string | null;
    blog: string | null;
    location: string | null;
    email: string | null;
    notification_email?: string | null;
    hireable: boolean | null;
    bio: string | null;
    twitter_username?: string | null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
    private_gists: number;
    total_private_repos: number;
    owned_private_repos: number;
    disk_usage: number;
    collaborators: number;
    two_factor_authentication: boolean;
    plan?: {
        collaborators: number;
        name: string;
        space: number;
        private_repos: number;
    };
    business_plus?: boolean;
    ldap_dn?: string;
};


// ============================================================================
// Model: protected_branch
// ============================================================================
import type { integration } from './integration';
import type { simple_user } from './simple_user';
import type { status_check_policy } from './status_check_policy';
import type { team } from './team';
/**
 * Branch protections protect branches
 */
export type protected_branch = {
    url: string;
    required_status_checks?: status_check_policy;
    required_pull_request_reviews?: {
        url: string;
        dismiss_stale_reviews?: boolean;
        require_code_owner_reviews?: boolean;
        required_approving_review_count?: number;
        /**
         * Whether the most recent push must be approved by someone other than the person who pushed it.
         */
        require_last_push_approval?: boolean;
        dismissal_restrictions?: {
            url: string;
            users_url: string;
            teams_url: string;
            users: Array<simple_user>;
            teams: Array<team>;
            apps?: Array<integration>;
        };
        bypass_pull_request_allowances?: {
            users: Array<simple_user>;
            teams: Array<team>;
            apps?: Array<integration>;
        };
    };
    required_signatures?: {
        url: string;
        enabled: boolean;
    };
    enforce_admins?: {
        url: string;
        enabled: boolean;
    };
    required_linear_history?: {
        enabled: boolean;
    };
    allow_force_pushes?: {
        enabled: boolean;
    };
    allow_deletions?: {
        enabled: boolean;
    };
    restrictions?: branch_restriction_policy;
    required_conversation_resolution?: {
        enabled?: boolean;
    };
    block_creations?: {
        enabled: boolean;
    };
    /**
     * Whether to set the branch as read-only. If this is true, users will not be able to push to the branch.
     */
    lock_branch?: {
        enabled?: boolean;
    };
    /**
     * Whether users can pull changes from upstream when the branch is locked. Set to `true` to allow fork syncing. Set to `false` to prevent fork syncing.
     */
    allow_fork_syncing?: {
        enabled?: boolean;
    };
};


// ============================================================================
// Model: protected_branch_admin_enforced
// ============================================================================
 * Protected Branch Admin Enforced
 */
export type protected_branch_admin_enforced = {
    url: string;
    enabled: boolean;
};


// ============================================================================
// Model: protected_branch_pull_request_review
// ============================================================================
import type { simple_user } from './simple_user';
import type { team } from './team';
/**
 * Protected Branch Pull Request Review
 */
export type protected_branch_pull_request_review = {
    url?: string;
    dismissal_restrictions?: {
        /**
         * The list of users with review dismissal access.
         */
        users?: Array<simple_user>;
        /**
         * The list of teams with review dismissal access.
         */
        teams?: Array<team>;
        /**
         * The list of apps with review dismissal access.
         */
        apps?: Array<integration>;
        url?: string;
        users_url?: string;
        teams_url?: string;
    };
    /**
     * Allow specific users, teams, or apps to bypass pull request requirements.
     */
    bypass_pull_request_allowances?: {
        /**
         * The list of users allowed to bypass pull request requirements.
         */
        users?: Array<simple_user>;
        /**
         * The list of teams allowed to bypass pull request requirements.
         */
        teams?: Array<team>;
        /**
         * The list of apps allowed to bypass pull request requirements.
         */
        apps?: Array<integration>;
    };
    dismiss_stale_reviews: boolean;
    require_code_owner_reviews: boolean;
    required_approving_review_count?: number;
    /**
     * Whether the most recent push must be approved by someone other than the person who pushed it.
     */
    require_last_push_approval?: boolean;
};


// ============================================================================
// Model: public_user
// ============================================================================
 * Public User
 */
export type public_user = {
    login: string;
    id: number;
    user_view_type?: string;
    node_id: string;
    avatar_url: string;
    gravatar_id: string | null;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name: string | null;
    company: string | null;
    blog: string | null;
    location: string | null;
    email: string | null;
    notification_email?: string | null;
    hireable: boolean | null;
    bio: string | null;
    twitter_username?: string | null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
    plan?: {
        collaborators: number;
        name: string;
        space: number;
        private_repos: number;
    };
    private_gists?: number;
    total_private_repos?: number;
    owned_private_repos?: number;
    disk_usage?: number;
    collaborators?: number;
};


// ============================================================================
// Model: pull_request
// ============================================================================
import type { auto_merge } from './auto_merge';
import type { link } from './link';
import type { nullable_milestone } from './nullable_milestone';
import type { nullable_simple_user } from './nullable_simple_user';
import type { repository } from './repository';
import type { simple_user } from './simple_user';
import type { team_simple } from './team_simple';
/**
 * Pull requests let you tell others about changes you've pushed to a repository on GitHub. Once a pull request is sent, interested parties can review the set of changes, discuss potential modifications, and even push follow-up commits if necessary.
 */
export type pull_request = {
    url: string;
    id: number;
    node_id: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
    issue_url: string;
    commits_url: string;
    review_comments_url: string;
    review_comment_url: string;
    comments_url: string;
    statuses_url: string;
    /**
     * Number uniquely identifying the pull request within its repository.
     */
    number: number;
    /**
     * State of this Pull Request. Either `open` or `closed`.
     */
    state: pull_request.state;
    locked: boolean;
    /**
     * The title of the pull request.
     */
    title: string;
    user: simple_user;
    body: string | null;
    labels: Array<{
        id: number;
        node_id: string;
        url: string;
        name: string;
        description: string | null;
        color: string;
        default: boolean;
    }>;
    milestone: nullable_milestone;
    active_lock_reason?: string | null;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    merged_at: string | null;
    merge_commit_sha: string | null;
    assignee: nullable_simple_user;
    assignees?: Array<simple_user> | null;
    requested_reviewers?: Array<simple_user> | null;
    requested_teams?: Array<team_simple> | null;
    head: {
        label: string;
        ref: string;
        repo: repository;
        sha: string;
        user: simple_user;
    };
    base: {
        label: string;
        ref: string;
        repo: repository;
        sha: string;
        user: simple_user;
    };
    _links: {
        comments: link;
        commits: link;
        statuses: link;
        html: link;
        issue: link;
        review_comments: link;
        review_comment: link;
        self: link;
    };
    author_association: author_association;
    auto_merge: auto_merge;
    /**
     * Indicates whether or not the pull request is a draft.
     */
    draft?: boolean;
    merged: boolean;
    mergeable: boolean | null;
    rebaseable?: boolean | null;
    mergeable_state: string;
    merged_by: nullable_simple_user;
    comments: number;
    review_comments: number;
    /**
     * Indicates whether maintainers can modify the pull request.
     */
    maintainer_can_modify: boolean;
    commits: number;
    additions: number;
    deletions: number;
    changed_files: number;
};
export namespace pull_request {
    /**
     * State of this Pull Request. Either `open` or `closed`.
     */
    export enum state {
        OPEN = 'open',
        CLOSED = 'closed',
    }
}


// ============================================================================
// Model: pull_request_merge_result
// ============================================================================
 * Pull Request Merge Result
 */
export type pull_request_merge_result = {
    sha: string;
    merged: boolean;
    message: string;
};


// ============================================================================
// Model: pull_request_review
// ============================================================================
import type { nullable_simple_user } from './nullable_simple_user';
/**
 * Pull Request Reviews are reviews on pull requests.
 */
export type pull_request_review = {
    /**
     * Unique identifier of the review
     */
    id: number;
    node_id: string;
    user: nullable_simple_user;
    /**
     * The text of the review.
     */
    body: string;
    state: string;
    html_url: string;
    pull_request_url: string;
    _links: {
        html: {
            href: string;
        };
        pull_request: {
            href: string;
        };
    };
    submitted_at?: string;
    /**
     * A commit SHA for the review. If the commit object was garbage collected or forcibly deleted, then it no longer exists in Git and this value will be `null`.
     */
    commit_id: string | null;
    body_html?: string;
    body_text?: string;
    author_association: author_association;
};


// ============================================================================
// Model: pull_request_review_comment
// ============================================================================
import type { reaction_rollup } from './reaction_rollup';
import type { simple_user } from './simple_user';
/**
 * Pull Request Review Comments are comments on a portion of the Pull Request's diff.
 */
export type pull_request_review_comment = {
    /**
     * URL for the pull request review comment
     */
    url: string;
    /**
     * The ID of the pull request review to which the comment belongs.
     */
    pull_request_review_id: number | null;
    /**
     * The ID of the pull request review comment.
     */
    id: number;
    /**
     * The node ID of the pull request review comment.
     */
    node_id: string;
    /**
     * The diff of the line that the comment refers to.
     */
    diff_hunk: string;
    /**
     * The relative path of the file to which the comment applies.
     */
    path: string;
    /**
     * The line index in the diff to which the comment applies. This field is closing down; use `line` instead.
     */
    position?: number;
    /**
     * The index of the original line in the diff to which the comment applies. This field is closing down; use `original_line` instead.
     */
    original_position?: number;
    /**
     * The SHA of the commit to which the comment applies.
     */
    commit_id: string;
    /**
     * The SHA of the original commit to which the comment applies.
     */
    original_commit_id: string;
    /**
     * The comment ID to reply to.
     */
    in_reply_to_id?: number;
    user: simple_user;
    /**
     * The text of the comment.
     */
    body: string;
    created_at: string;
    updated_at: string;
    /**
     * HTML URL for the pull request review comment.
     */
    html_url: string;
    /**
     * URL for the pull request that the review comment belongs to.
     */
    pull_request_url: string;
    author_association: author_association;
    _links: {
        self: {
            href: string;
        };
        html: {
            href: string;
        };
        pull_request: {
            href: string;
        };
    };
    /**
     * The first line of the range for a multi-line comment.
     */
    start_line?: number | null;
    /**
     * The first line of the range for a multi-line comment.
     */
    original_start_line?: number | null;
    /**
     * The side of the first line of the range for a multi-line comment.
     */
    start_side?: pull_request_review_comment.start_side | null;
    /**
     * The line of the blob to which the comment applies. The last line of the range for a multi-line comment
     */
    line?: number;
    /**
     * The line of the blob to which the comment applies. The last line of the range for a multi-line comment
     */
    original_line?: number;
    /**
     * The side of the diff to which the comment applies. The side of the last line of the range for a multi-line comment
     */
    side?: pull_request_review_comment.side;
    /**
     * The level at which the comment is targeted, can be a diff line or a file.
     */
    subject_type?: pull_request_review_comment.subject_type;
    reactions?: reaction_rollup;
    body_html?: string;
    body_text?: string;
};
export namespace pull_request_review_comment {
    /**
     * The side of the first line of the range for a multi-line comment.
     */
    export enum start_side {
        LEFT = 'LEFT',
        RIGHT = 'RIGHT',
    }
    /**
     * The side of the diff to which the comment applies. The side of the last line of the range for a multi-line comment
     */
    export enum side {
        LEFT = 'LEFT',
        RIGHT = 'RIGHT',
    }
    /**
     * The level at which the comment is targeted, can be a diff line or a file.
     */
    export enum subject_type {
        LINE = 'line',
        FILE = 'file',
    }
}


// ============================================================================
// Model: pull_request_review_request
// ============================================================================
import type { team } from './team';
/**
 * Pull Request Review Request
 */
export type pull_request_review_request = {
    users: Array<simple_user>;
    teams: Array<team>;
};


// ============================================================================
// Model: pull_request_simple
// ============================================================================
import type { auto_merge } from './auto_merge';
import type { link } from './link';
import type { nullable_milestone } from './nullable_milestone';
import type { nullable_simple_user } from './nullable_simple_user';
import type { repository } from './repository';
import type { simple_user } from './simple_user';
import type { team } from './team';
/**
 * Pull Request Simple
 */
export type pull_request_simple = {
    url: string;
    id: number;
    node_id: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
    issue_url: string;
    commits_url: string;
    review_comments_url: string;
    review_comment_url: string;
    comments_url: string;
    statuses_url: string;
    number: number;
    state: string;
    locked: boolean;
    title: string;
    user: nullable_simple_user;
    body: string | null;
    labels: Array<{
        id: number;
        node_id: string;
        url: string;
        name: string;
        description: string;
        color: string;
        default: boolean;
    }>;
    milestone: nullable_milestone;
    active_lock_reason?: string | null;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    merged_at: string | null;
    merge_commit_sha: string | null;
    assignee: nullable_simple_user;
    assignees?: Array<simple_user> | null;
    requested_reviewers?: Array<simple_user> | null;
    requested_teams?: Array<team> | null;
    head: {
        label: string;
        ref: string;
        repo: repository;
        sha: string;
        user: nullable_simple_user;
    };
    base: {
        label: string;
        ref: string;
        repo: repository;
        sha: string;
        user: nullable_simple_user;
    };
    _links: {
        comments: link;
        commits: link;
        statuses: link;
        html: link;
        issue: link;
        review_comments: link;
        review_comment: link;
        self: link;
    };
    author_association: author_association;
    auto_merge: auto_merge;
    /**
     * Indicates whether or not the pull request is a draft.
     */
    draft?: boolean;
};


// ============================================================================
// Model: referrer_traffic
// ============================================================================
 * Referrer Traffic
 */
export type referrer_traffic = {
    referrer: string;
    count: number;
    uniques: number;
};


// ============================================================================
// Model: release
// ============================================================================
import type { release_asset } from './release_asset';
import type { simple_user } from './simple_user';
/**
 * A release.
 */
export type release = {
    url: string;
    html_url: string;
    assets_url: string;
    upload_url: string;
    tarball_url: string | null;
    zipball_url: string | null;
    id: number;
    node_id: string;
    /**
     * The name of the tag.
     */
    tag_name: string;
    /**
     * Specifies the commitish value that determines where the Git tag is created from.
     */
    target_commitish: string;
    name: string | null;
    body?: string | null;
    /**
     * true to create a draft (unpublished) release, false to create a published one.
     */
    draft: boolean;
    /**
     * Whether to identify the release as a prerelease or a full release.
     */
    prerelease: boolean;
    /**
     * Whether or not the release is immutable.
     */
    immutable?: boolean;
    created_at: string;
    published_at: string | null;
    updated_at?: string | null;
    author: simple_user;
    assets: Array<release_asset>;
    body_html?: string;
    body_text?: string;
    mentions_count?: number;
    /**
     * The URL of the release discussion.
     */
    discussion_url?: string;
    reactions?: reaction_rollup;
};


// ============================================================================
// Model: release_asset
// ============================================================================
/**
 * Data related to a release.
 */
export type release_asset = {
    url: string;
    browser_download_url: string;
    id: number;
    node_id: string;
    /**
     * The file name of the asset.
     */
    name: string;
    label: string | null;
    /**
     * State of the release asset.
     */
    state: release_asset.state;
    content_type: string;
    size: number;
    digest: string | null;
    download_count: number;
    created_at: string;
    updated_at: string;
    uploader: nullable_simple_user;
};
export namespace release_asset {
    /**
     * State of the release asset.
     */
    export enum state {
        UPLOADED = 'uploaded',
        OPEN = 'open',
    }
}


// ============================================================================
// Model: release_notes_content
// ============================================================================
 * Generated name and body describing a release
 */
export type release_notes_content = {
    /**
     * The generated name of the release
     */
    name: string;
    /**
     * The generated body describing the contents of the release supporting markdown formatting
     */
    body: string;
};


// ============================================================================
// Model: repository
// ============================================================================
import type { simple_user } from './simple_user';
/**
 * A repository on GitHub.
 */
export type repository = {
    /**
     * Unique identifier of the repository
     */
    id: number;
    node_id: string;
    /**
     * The name of the repository.
     */
    name: string;
    full_name: string;
    license: nullable_license_simple;
    forks: number;
    permissions?: {
        admin: boolean;
        pull: boolean;
        triage?: boolean;
        push: boolean;
        maintain?: boolean;
    };
    owner: simple_user;
    /**
     * Whether the repository is private or public.
     */
    private: boolean;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    archive_url: string;
    assignees_url: string;
    blobs_url: string;
    branches_url: string;
    collaborators_url: string;
    comments_url: string;
    commits_url: string;
    compare_url: string;
    contents_url: string;
    contributors_url: string;
    deployments_url: string;
    downloads_url: string;
    events_url: string;
    forks_url: string;
    git_commits_url: string;
    git_refs_url: string;
    git_tags_url: string;
    git_url: string;
    issue_comment_url: string;
    issue_events_url: string;
    issues_url: string;
    keys_url: string;
    labels_url: string;
    languages_url: string;
    merges_url: string;
    milestones_url: string;
    notifications_url: string;
    pulls_url: string;
    releases_url: string;
    ssh_url: string;
    stargazers_url: string;
    statuses_url: string;
    subscribers_url: string;
    subscription_url: string;
    tags_url: string;
    teams_url: string;
    trees_url: string;
    clone_url: string;
    mirror_url: string | null;
    hooks_url: string;
    svn_url: string;
    homepage: string | null;
    language: string | null;
    forks_count: number;
    stargazers_count: number;
    watchers_count: number;
    /**
     * The size of the repository, in kilobytes. Size is calculated hourly. When a repository is initially created, the size is 0.
     */
    size: number;
    /**
     * The default branch of the repository.
     */
    default_branch: string;
    open_issues_count: number;
    /**
     * Whether this repository acts as a template that can be used to generate new repositories.
     */
    is_template?: boolean;
    topics?: Array<string>;
    /**
     * Whether issues are enabled.
     */
    has_issues: boolean;
    /**
     * Whether projects are enabled.
     */
    has_projects: boolean;
    /**
     * Whether the wiki is enabled.
     */
    has_wiki: boolean;
    has_pages: boolean;
    /**
     * Whether downloads are enabled.
     * @deprecated
     */
    has_downloads: boolean;
    /**
     * Whether discussions are enabled.
     */
    has_discussions?: boolean;
    /**
     * Whether the repository is archived.
     */
    archived: boolean;
    /**
     * Returns whether or not this repository disabled.
     */
    disabled: boolean;
    /**
     * The repository visibility: public, private, or internal.
     */
    visibility?: string;
    pushed_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    /**
     * Whether to allow rebase merges for pull requests.
     */
    allow_rebase_merge?: boolean;
    temp_clone_token?: string;
    /**
     * Whether to allow squash merges for pull requests.
     */
    allow_squash_merge?: boolean;
    /**
     * Whether to allow Auto-merge to be used on pull requests.
     */
    allow_auto_merge?: boolean;
    /**
     * Whether to delete head branches when pull requests are merged
     */
    delete_branch_on_merge?: boolean;
    /**
     * Whether or not a pull request head branch that is behind its base branch can always be updated even if it is not required to be up to date before merging.
     */
    allow_update_branch?: boolean;
    /**
     * Whether a squash merge commit can use the pull request title as default. **This property is closing down. Please use `squash_merge_commit_title` instead.
     * @deprecated
     */
    use_squash_pr_title_as_default?: boolean;
    /**
     * The default value for a squash merge commit title:
     *
     * - `PR_TITLE` - default to the pull request's title.
     * - `COMMIT_OR_PR_TITLE` - default to the commit's title (if only one commit) or the pull request's title (when more than one commit).
     */
    squash_merge_commit_title?: repository.squash_merge_commit_title;
    /**
     * The default value for a squash merge commit message:
     *
     * - `PR_BODY` - default to the pull request's body.
     * - `COMMIT_MESSAGES` - default to the branch's commit messages.
     * - `BLANK` - default to a blank commit message.
     */
    squash_merge_commit_message?: repository.squash_merge_commit_message;
    /**
     * The default value for a merge commit title.
     *
     * - `PR_TITLE` - default to the pull request's title.
     * - `MERGE_MESSAGE` - default to the classic title for a merge message (e.g., Merge pull request #123 from branch-name).
     */
    merge_commit_title?: repository.merge_commit_title;
    /**
     * The default value for a merge commit message.
     *
     * - `PR_TITLE` - default to the pull request's title.
     * - `PR_BODY` - default to the pull request's body.
     * - `BLANK` - default to a blank commit message.
     */
    merge_commit_message?: repository.merge_commit_message;
    /**
     * Whether to allow merge commits for pull requests.
     */
    allow_merge_commit?: boolean;
    /**
     * Whether to allow forking this repo
     */
    allow_forking?: boolean;
    /**
     * Whether to require contributors to sign off on web-based commits
     */
    web_commit_signoff_required?: boolean;
    open_issues: number;
    watchers: number;
    master_branch?: string;
    starred_at?: string;
    /**
     * Whether anonymous git access is enabled for this repository
     */
    anonymous_access_enabled?: boolean;
    /**
     * The status of the code search index for this repository
     */
    code_search_index_status?: {
        lexical_search_ok?: boolean;
        lexical_commit_sha?: string;
    };
};
export namespace repository {
    /**
     * The default value for a squash merge commit title:
     *
     * - `PR_TITLE` - default to the pull request's title.
     * - `COMMIT_OR_PR_TITLE` - default to the commit's title (if only one commit) or the pull request's title (when more than one commit).
     */
    export enum squash_merge_commit_title {
        PR_TITLE = 'PR_TITLE',
        COMMIT_OR_PR_TITLE = 'COMMIT_OR_PR_TITLE',
    }
    /**
     * The default value for a squash merge commit message:
     *
     * - `PR_BODY` - default to the pull request's body.
     * - `COMMIT_MESSAGES` - default to the branch's commit messages.
     * - `BLANK` - default to a blank commit message.
     */
    export enum squash_merge_commit_message {
        PR_BODY = 'PR_BODY',
        COMMIT_MESSAGES = 'COMMIT_MESSAGES',
        BLANK = 'BLANK',
    }
    /**
     * The default value for a merge commit title.
     *
     * - `PR_TITLE` - default to the pull request's title.
     * - `MERGE_MESSAGE` - default to the classic title for a merge message (e.g., Merge pull request #123 from branch-name).
     */
    export enum merge_commit_title {
        PR_TITLE = 'PR_TITLE',
        MERGE_MESSAGE = 'MERGE_MESSAGE',
    }
    /**
     * The default value for a merge commit message.
     *
     * - `PR_TITLE` - default to the pull request's title.
     * - `PR_BODY` - default to the pull request's body.
     * - `BLANK` - default to a blank commit message.
     */
    export enum merge_commit_message {
        PR_BODY = 'PR_BODY',
        PR_TITLE = 'PR_TITLE',
        BLANK = 'BLANK',
    }
}


// ============================================================================
// Model: repository_collaborator_permission
// ============================================================================
/**
 * Repository Collaborator Permission
 */
export type repository_collaborator_permission = {
    permission: string;
    role_name: string;
    user: nullable_collaborator;
};


// ============================================================================
// Model: repository_invitation
// ============================================================================
import type { nullable_simple_user } from './nullable_simple_user';
/**
 * Repository invitations let you manage who you collaborate with.
 */
export type repository_invitation = {
    /**
     * Unique identifier of the repository invitation.
     */
    id: number;
    repository: minimal_repository;
    invitee: nullable_simple_user;
    inviter: nullable_simple_user;
    /**
     * The permission associated with the invitation.
     */
    permissions: repository_invitation.permissions;
    created_at: string;
    /**
     * Whether or not the invitation has expired
     */
    expired?: boolean;
    /**
     * URL for the repository invitation
     */
    url: string;
    html_url: string;
    node_id: string;
};
export namespace repository_invitation {
    /**
     * The permission associated with the invitation.
     */
    export enum permissions {
        READ = 'read',
        WRITE = 'write',
        ADMIN = 'admin',
        TRIAGE = 'triage',
        MAINTAIN = 'maintain',
    }
}


// ============================================================================
// Model: repository_rule
// ============================================================================
import type { repository_rule_code_scanning } from './repository_rule_code_scanning';
import type { repository_rule_commit_author_email_pattern } from './repository_rule_commit_author_email_pattern';
import type { repository_rule_commit_message_pattern } from './repository_rule_commit_message_pattern';
import type { repository_rule_committer_email_pattern } from './repository_rule_committer_email_pattern';
import type { repository_rule_copilot_code_review } from './repository_rule_copilot_code_review';
import type { repository_rule_creation } from './repository_rule_creation';
import type { repository_rule_deletion } from './repository_rule_deletion';
import type { repository_rule_file_extension_restriction } from './repository_rule_file_extension_restriction';
import type { repository_rule_file_path_restriction } from './repository_rule_file_path_restriction';
import type { repository_rule_max_file_path_length } from './repository_rule_max_file_path_length';
import type { repository_rule_max_file_size } from './repository_rule_max_file_size';
import type { repository_rule_merge_queue } from './repository_rule_merge_queue';
import type { repository_rule_non_fast_forward } from './repository_rule_non_fast_forward';
import type { repository_rule_pull_request } from './repository_rule_pull_request';
import type { repository_rule_required_deployments } from './repository_rule_required_deployments';
import type { repository_rule_required_linear_history } from './repository_rule_required_linear_history';
import type { repository_rule_required_signatures } from './repository_rule_required_signatures';
import type { repository_rule_required_status_checks } from './repository_rule_required_status_checks';
import type { repository_rule_tag_name_pattern } from './repository_rule_tag_name_pattern';
import type { repository_rule_update } from './repository_rule_update';
import type { repository_rule_workflows } from './repository_rule_workflows';
/**
 * A repository rule.
 */
export type repository_rule = (repository_rule_creation | repository_rule_update | repository_rule_deletion | repository_rule_required_linear_history | repository_rule_merge_queue | repository_rule_required_deployments | repository_rule_required_signatures | repository_rule_pull_request | repository_rule_required_status_checks | repository_rule_non_fast_forward | repository_rule_commit_message_pattern | repository_rule_commit_author_email_pattern | repository_rule_committer_email_pattern | repository_rule_branch_name_pattern | repository_rule_tag_name_pattern | repository_rule_file_path_restriction | repository_rule_max_file_path_length | repository_rule_file_extension_restriction | repository_rule_max_file_size | repository_rule_workflows | repository_rule_code_scanning | repository_rule_copilot_code_review);


// ============================================================================
// Model: repository_rule_detailed
// ============================================================================
import type { repository_rule_code_scanning } from './repository_rule_code_scanning';
import type { repository_rule_commit_author_email_pattern } from './repository_rule_commit_author_email_pattern';
import type { repository_rule_commit_message_pattern } from './repository_rule_commit_message_pattern';
import type { repository_rule_committer_email_pattern } from './repository_rule_committer_email_pattern';
import type { repository_rule_copilot_code_review } from './repository_rule_copilot_code_review';
import type { repository_rule_creation } from './repository_rule_creation';
import type { repository_rule_deletion } from './repository_rule_deletion';
import type { repository_rule_file_extension_restriction } from './repository_rule_file_extension_restriction';
import type { repository_rule_file_path_restriction } from './repository_rule_file_path_restriction';
import type { repository_rule_max_file_path_length } from './repository_rule_max_file_path_length';
import type { repository_rule_max_file_size } from './repository_rule_max_file_size';
import type { repository_rule_merge_queue } from './repository_rule_merge_queue';
import type { repository_rule_non_fast_forward } from './repository_rule_non_fast_forward';
import type { repository_rule_pull_request } from './repository_rule_pull_request';
import type { repository_rule_required_deployments } from './repository_rule_required_deployments';
import type { repository_rule_required_linear_history } from './repository_rule_required_linear_history';
import type { repository_rule_required_signatures } from './repository_rule_required_signatures';
import type { repository_rule_required_status_checks } from './repository_rule_required_status_checks';
import type { repository_rule_ruleset_info } from './repository_rule_ruleset_info';
import type { repository_rule_tag_name_pattern } from './repository_rule_tag_name_pattern';
import type { repository_rule_update } from './repository_rule_update';
import type { repository_rule_workflows } from './repository_rule_workflows';
/**
 * A repository rule with ruleset details.
 */
export type repository_rule_detailed = ((repository_rule_creation & repository_rule_ruleset_info) | (repository_rule_update & repository_rule_ruleset_info) | (repository_rule_deletion & repository_rule_ruleset_info) | (repository_rule_required_linear_history & repository_rule_ruleset_info) | (repository_rule_merge_queue & repository_rule_ruleset_info) | (repository_rule_required_deployments & repository_rule_ruleset_info) | (repository_rule_required_signatures & repository_rule_ruleset_info) | (repository_rule_pull_request & repository_rule_ruleset_info) | (repository_rule_required_status_checks & repository_rule_ruleset_info) | (repository_rule_non_fast_forward & repository_rule_ruleset_info) | (repository_rule_commit_message_pattern & repository_rule_ruleset_info) | (repository_rule_commit_author_email_pattern & repository_rule_ruleset_info) | (repository_rule_committer_email_pattern & repository_rule_ruleset_info) | (repository_rule_branch_name_pattern & repository_rule_ruleset_info) | (repository_rule_tag_name_pattern & repository_rule_ruleset_info) | (repository_rule_file_path_restriction & repository_rule_ruleset_info) | (repository_rule_max_file_path_length & repository_rule_ruleset_info) | (repository_rule_file_extension_restriction & repository_rule_ruleset_info) | (repository_rule_max_file_size & repository_rule_ruleset_info) | (repository_rule_workflows & repository_rule_ruleset_info) | (repository_rule_code_scanning & repository_rule_ruleset_info) | (repository_rule_copilot_code_review & repository_rule_ruleset_info));


// ============================================================================
// Model: repository_rule_enforcement
// ============================================================================
 * The enforcement level of the ruleset. `evaluate` allows admins to test rules before enforcing them. Admins can view insights on the Rule Insights page (`evaluate` is only available with GitHub Enterprise).
 */
export enum repository_rule_enforcement {
    DISABLED = 'disabled',
    ACTIVE = 'active',
    EVALUATE = 'evaluate',
}

// ============================================================================
// Model: repository_ruleset
// ============================================================================
import type { repository_rule } from './repository_rule';
import type { repository_rule_enforcement } from './repository_rule_enforcement';
import type { repository_ruleset_bypass_actor } from './repository_ruleset_bypass_actor';
import type { repository_ruleset_conditions } from './repository_ruleset_conditions';
/**
 * A set of rules to apply when specified conditions are met.
 */
export type repository_ruleset = {
    /**
     * The ID of the ruleset
     */
    id: number;
    /**
     * The name of the ruleset
     */
    name: string;
    /**
     * The target of the ruleset
     */
    target?: repository_ruleset.target;
    /**
     * The type of the source of the ruleset
     */
    source_type?: repository_ruleset.source_type;
    /**
     * The name of the source
     */
    source: string;
    enforcement: repository_rule_enforcement;
    /**
     * The actors that can bypass the rules in this ruleset
     */
    bypass_actors?: Array<repository_ruleset_bypass_actor>;
    /**
     * The bypass type of the user making the API request for this ruleset. This field is only returned when
     * querying the repository-level endpoint.
     */
    current_user_can_bypass?: repository_ruleset.current_user_can_bypass;
    node_id?: string;
    _links?: {
        self?: {
            /**
             * The URL of the ruleset
             */
            href?: string;
        };
        html?: {
            /**
             * The html URL of the ruleset
             */
            href?: string;
        } | null;
    };
    conditions?: (repository_ruleset_conditions | org_ruleset_conditions) | null;
    rules?: Array<repository_rule>;
    created_at?: string;
    updated_at?: string;
};
export namespace repository_ruleset {
    /**
     * The target of the ruleset
     */
    export enum target {
        BRANCH = 'branch',
        TAG = 'tag',
        PUSH = 'push',
        REPOSITORY = 'repository',
    }
    /**
     * The type of the source of the ruleset
     */
    export enum source_type {
        REPOSITORY = 'Repository',
        ORGANIZATION = 'Organization',
        ENTERPRISE = 'Enterprise',
    }
    /**
     * The bypass type of the user making the API request for this ruleset. This field is only returned when
     * querying the repository-level endpoint.
     */
    export enum current_user_can_bypass {
        ALWAYS = 'always',
        PULL_REQUESTS_ONLY = 'pull_requests_only',
        NEVER = 'never',
        EXEMPT = 'exempt',
    }
}


// ============================================================================
// Model: repository_ruleset_bypass_actor
// ============================================================================
 * An actor that can bypass rules in a ruleset
 */
export type repository_ruleset_bypass_actor = {
    /**
     * The ID of the actor that can bypass a ruleset. Required for `Integration`, `RepositoryRole`, and `Team` actor types. If `actor_type` is `OrganizationAdmin`, this should be `1`. If `actor_type` is `DeployKey`, this should be null. `OrganizationAdmin` is not applicable for personal repositories.
     */
    actor_id?: number | null;
    /**
     * The type of actor that can bypass a ruleset.
     */
    actor_type: repository_ruleset_bypass_actor.actor_type;
    /**
     * When the specified actor can bypass the ruleset. `pull_request` means that an actor can only bypass rules on pull requests. `pull_request` is not applicable for the `DeployKey` actor type. Also, `pull_request` is only applicable to branch rulesets. When `bypass_mode` is `exempt`, rules will not be run for that actor and a bypass audit entry will not be created.
     */
    bypass_mode?: repository_ruleset_bypass_actor.bypass_mode;
};
export namespace repository_ruleset_bypass_actor {
    /**
     * The type of actor that can bypass a ruleset.
     */
    export enum actor_type {
        INTEGRATION = 'Integration',
        ORGANIZATION_ADMIN = 'OrganizationAdmin',
        REPOSITORY_ROLE = 'RepositoryRole',
        TEAM = 'Team',
        DEPLOY_KEY = 'DeployKey',
    }
    /**
     * When the specified actor can bypass the ruleset. `pull_request` means that an actor can only bypass rules on pull requests. `pull_request` is not applicable for the `DeployKey` actor type. Also, `pull_request` is only applicable to branch rulesets. When `bypass_mode` is `exempt`, rules will not be run for that actor and a bypass audit entry will not be created.
     */
    export enum bypass_mode {
        ALWAYS = 'always',
        PULL_REQUEST = 'pull_request',
        EXEMPT = 'exempt',
    }
}


// ============================================================================
// Model: repository_ruleset_conditions
// ============================================================================
 * Parameters for a repository ruleset ref name condition
 */
export type repository_ruleset_conditions = {
    ref_name?: {
        /**
         * Array of ref names or patterns to include. One of these patterns must match for the condition to pass. Also accepts `~DEFAULT_BRANCH` to include the default branch or `~ALL` to include all branches.
         */
        include?: Array<string>;
        /**
         * Array of ref names or patterns to exclude. The condition will not pass if any of these patterns match.
         */
        exclude?: Array<string>;
    };
};


// ============================================================================
// Model: repository_subscription
// ============================================================================
 * Repository invitations let you manage who you collaborate with.
 */
export type repository_subscription = {
    /**
     * Determines if notifications should be received from this repository.
     */
    subscribed: boolean;
    /**
     * Determines if all notifications should be blocked from this repository.
     */
    ignored: boolean;
    reason: string | null;
    created_at: string;
    url: string;
    repository_url: string;
};


// ============================================================================
// Model: review_comment
// ============================================================================
import type { link } from './link';
import type { nullable_simple_user } from './nullable_simple_user';
import type { reaction_rollup } from './reaction_rollup';
/**
 * Legacy Review Comment
 */
export type review_comment = {
    url: string;
    pull_request_review_id: number | null;
    id: number;
    node_id: string;
    diff_hunk: string;
    path: string;
    position: number | null;
    original_position: number;
    commit_id: string;
    original_commit_id: string;
    in_reply_to_id?: number;
    user: nullable_simple_user;
    body: string;
    created_at: string;
    updated_at: string;
    html_url: string;
    pull_request_url: string;
    author_association: author_association;
    _links: {
        self: link;
        html: link;
        pull_request: link;
    };
    body_text?: string;
    body_html?: string;
    reactions?: reaction_rollup;
    /**
     * The side of the first line of the range for a multi-line comment.
     */
    side?: review_comment.side;
    /**
     * The side of the first line of the range for a multi-line comment.
     */
    start_side?: review_comment.start_side | null;
    /**
     * The line of the blob to which the comment applies. The last line of the range for a multi-line comment
     */
    line?: number;
    /**
     * The original line of the blob to which the comment applies. The last line of the range for a multi-line comment
     */
    original_line?: number;
    /**
     * The first line of the range for a multi-line comment.
     */
    start_line?: number | null;
    /**
     * The original first line of the range for a multi-line comment.
     */
    original_start_line?: number | null;
    /**
     * The level at which the comment is targeted, can be a diff line or a file.
     */
    subject_type?: review_comment.subject_type;
};
export namespace review_comment {
    /**
     * The side of the first line of the range for a multi-line comment.
     */
    export enum side {
        LEFT = 'LEFT',
        RIGHT = 'RIGHT',
    }
    /**
     * The side of the first line of the range for a multi-line comment.
     */
    export enum start_side {
        LEFT = 'LEFT',
        RIGHT = 'RIGHT',
    }
    /**
     * The level at which the comment is targeted, can be a diff line or a file.
     */
    export enum subject_type {
        LINE = 'line',
        FILE = 'file',
    }
}


// ============================================================================
// Model: review_custom_gates_comment_required
// ============================================================================
    /**
     * The name of the environment to approve or reject.
     */
    environment_name: string;
    /**
     * Comment associated with the pending deployment protection rule. **Required when state is not provided.**
     */
    comment: string;
};


// ============================================================================
// Model: review_custom_gates_state_required
// ============================================================================
    /**
     * The name of the environment to approve or reject.
     */
    environment_name: string;
    /**
     * Whether to approve or reject deployment to the specified environments.
     */
    state: review_custom_gates_state_required.state;
    /**
     * Optional comment to include with the review.
     */
    comment?: string;
};
export namespace review_custom_gates_state_required {
    /**
     * Whether to approve or reject deployment to the specified environments.
     */
    export enum state {
        APPROVED = 'approved',
        REJECTED = 'rejected',
    }
}


// ============================================================================
// Model: root
// ============================================================================
    current_user_url: string;
    current_user_authorizations_html_url: string;
    authorizations_url: string;
    code_search_url: string;
    commit_search_url: string;
    emails_url: string;
    emojis_url: string;
    events_url: string;
    feeds_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    /**
     * @deprecated
     */
    hub_url?: string;
    issue_search_url: string;
    issues_url: string;
    keys_url: string;
    label_search_url: string;
    notifications_url: string;
    organization_url: string;
    organization_repositories_url: string;
    organization_teams_url: string;
    public_gists_url: string;
    rate_limit_url: string;
    repository_url: string;
    repository_search_url: string;
    current_user_repositories_url: string;
    starred_url: string;
    starred_gists_url: string;
    topic_search_url?: string;
    user_url: string;
    user_organizations_url: string;
    user_repositories_url: string;
    user_search_url: string;
};


// ============================================================================
// Model: rule_suite
// ============================================================================
 * Response
 */
export type rule_suite = {
    /**
     * The unique identifier of the rule insight.
     */
    id?: number;
    /**
     * The number that identifies the user.
     */
    actor_id?: number | null;
    /**
     * The handle for the GitHub user account.
     */
    actor_name?: string | null;
    /**
     * The previous commit SHA of the ref.
     */
    before_sha?: string;
    /**
     * The new commit SHA of the ref.
     */
    after_sha?: string;
    /**
     * The ref name that the evaluation ran on.
     */
    ref?: string;
    /**
     * The ID of the repository associated with the rule evaluation.
     */
    repository_id?: number;
    /**
     * The name of the repository without the `.git` extension.
     */
    repository_name?: string;
    pushed_at?: string;
    /**
     * The result of the rule evaluations for rules with the `active` enforcement status.
     */
    result?: rule_suite.result;
    /**
     * The result of the rule evaluations for rules with the `active` and `evaluate` enforcement statuses, demonstrating whether rules would pass or fail if all rules in the rule suite were `active`. Null if no rules with `evaluate` enforcement status were run.
     */
    evaluation_result?: rule_suite.evaluation_result | null;
    /**
     * Details on the evaluated rules.
     */
    rule_evaluations?: Array<{
        rule_source?: {
            /**
             * The type of rule source.
             */
            type?: string;
            /**
             * The ID of the rule source.
             */
            id?: number | null;
            /**
             * The name of the rule source.
             */
            name?: string | null;
        };
        /**
         * The enforcement level of this rule source.
         */
        enforcement?: 'active' | 'evaluate' | 'deleted ruleset';
        /**
         * The result of the evaluation of the individual rule.
         */
        result?: 'pass' | 'fail';
        /**
         * The type of rule.
         */
        rule_type?: string;
        /**
         * The detailed failure message for the rule. Null if the rule passed.
         */
        details?: string | null;
    }>;
};
export namespace rule_suite {
    /**
     * The result of the rule evaluations for rules with the `active` enforcement status.
     */
    export enum result {
        PASS = 'pass',
        FAIL = 'fail',
        BYPASS = 'bypass',
    }
    /**
     * The result of the rule evaluations for rules with the `active` and `evaluate` enforcement statuses, demonstrating whether rules would pass or fail if all rules in the rule suite were `active`. Null if no rules with `evaluate` enforcement status were run.
     */
    export enum evaluation_result {
        PASS = 'pass',
        FAIL = 'fail',
        BYPASS = 'bypass',
    }
}


// ============================================================================
// Model: rule_suites
// ============================================================================
 * Response
 */
export type rule_suites = Array<{
    /**
     * The unique identifier of the rule insight.
     */
    id?: number;
    /**
     * The number that identifies the user.
     */
    actor_id?: number;
    /**
     * The handle for the GitHub user account.
     */
    actor_name?: string;
    /**
     * The first commit sha before the push evaluation.
     */
    before_sha?: string;
    /**
     * The last commit sha in the push evaluation.
     */
    after_sha?: string;
    /**
     * The ref name that the evaluation ran on.
     */
    ref?: string;
    /**
     * The ID of the repository associated with the rule evaluation.
     */
    repository_id?: number;
    /**
     * The name of the repository without the `.git` extension.
     */
    repository_name?: string;
    pushed_at?: string;
    /**
     * The result of the rule evaluations for rules with the `active` enforcement status.
     */
    result?: 'pass' | 'fail' | 'bypass';
    /**
     * The result of the rule evaluations for rules with the `active` and `evaluate` enforcement statuses, demonstrating whether rules would pass or fail if all rules in the rule suite were `active`.
     */
    evaluation_result?: 'pass' | 'fail' | 'bypass';
}>;

// ============================================================================
// Model: ruleset_version
// ============================================================================
 * The historical version of a ruleset
 */
export type ruleset_version = {
    /**
     * The ID of the previous version of the ruleset
     */
    version_id: number;
    /**
     * The actor who updated the ruleset
     */
    actor: {
        id?: number;
        type?: string;
    };
    updated_at: string;
};


// ============================================================================
// Model: ruleset_version_with_state
// ============================================================================
export type ruleset_version_with_state = (ruleset_version & {
    /**
     * The state of the ruleset version
     */
    state: Record<string, any>;
});


// ============================================================================
// Model: runner
// ============================================================================
/**
 * A self hosted runner
 */
export type runner = {
    /**
     * The ID of the runner.
     */
    id: number;
    /**
     * The ID of the runner group.
     */
    runner_group_id?: number;
    /**
     * The name of the runner.
     */
    name: string;
    /**
     * The Operating System of the runner.
     */
    os: string;
    /**
     * The status of the runner.
     */
    status: string;
    busy: boolean;
    labels: Array<runner_label>;
    ephemeral?: boolean;
};


// ============================================================================
// Model: runner_application
// ============================================================================
 * Runner Application
 */
export type runner_application = {
    os: string;
    architecture: string;
    download_url: string;
    filename: string;
    /**
     * A short lived bearer token used to download the runner, if needed.
     */
    temp_download_token?: string;
    sha256_checksum?: string;
};


// ============================================================================
// Model: runner_groups_org
// ============================================================================
    id: number;
    name: string;
    visibility: string;
    default: boolean;
    /**
     * Link to the selected repositories resource for this runner group. Not present unless visibility was set to `selected`
     */
    selected_repositories_url?: string;
    runners_url: string;
    hosted_runners_url?: string;
    /**
     * The identifier of a hosted compute network configuration.
     */
    network_configuration_id?: string;
    inherited: boolean;
    inherited_allows_public_repositories?: boolean;
    allows_public_repositories: boolean;
    /**
     * If `true`, the `restricted_to_workflows` and `selected_workflows` fields cannot be modified.
     */
    workflow_restrictions_read_only?: boolean;
    /**
     * If `true`, the runner group will be restricted to running only the workflows specified in the `selected_workflows` array.
     */
    restricted_to_workflows?: boolean;
    /**
     * List of workflows the runner group should be allowed to run. This setting will be ignored unless `restricted_to_workflows` is set to `true`.
     */
    selected_workflows?: Array<string>;
};


// ============================================================================
// Model: runner_label
// ============================================================================
 * A label for a self hosted runner
 */
export type runner_label = {
    /**
     * Unique identifier of the label.
     */
    id?: number;
    /**
     * Name of the label.
     */
    name: string;
    /**
     * The type of label. Read-only labels are applied automatically when the runner is configured.
     */
    type?: runner_label.type;
};
export namespace runner_label {
    /**
     * The type of label. Read-only labels are applied automatically when the runner is configured.
     */
    export enum type {
        READ_ONLY = 'read-only',
        CUSTOM = 'custom',
    }
}


// ============================================================================
// Model: selected_actions
// ============================================================================
    /**
     * Whether GitHub-owned actions are allowed. For example, this includes the actions in the `actions` organization.
     */
    github_owned_allowed?: boolean;
    /**
     * Whether actions from GitHub Marketplace verified creators are allowed. Set to `true` to allow all actions by GitHub Marketplace verified creators.
     */
    verified_allowed?: boolean;
    /**
     * Specifies a list of string-matching patterns to allow specific action(s) and reusable workflow(s). Wildcards, tags, and SHAs are allowed. For example, `monalisa/octocat@*`, `monalisa/octocat@v2`, `monalisa*`.
     *
     * > [!NOTE]
     * > The `patterns_allowed` setting only applies to public repositories.
     */
    patterns_allowed?: Array<string>;
};


// ============================================================================
// Model: self_hosted_runners_settings
// ============================================================================
    /**
     * The policy that controls whether self-hosted runners can be used by repositories in the organization
     */
    enabled_repositories: self_hosted_runners_settings.enabled_repositories;
    /**
     * The URL to the endpoint for managing selected repositories for self-hosted runners in the organization
     */
    selected_repositories_url?: string;
};
export namespace self_hosted_runners_settings {
    /**
     * The policy that controls whether self-hosted runners can be used by repositories in the organization
     */
    export enum enabled_repositories {
        ALL = 'all',
        SELECTED = 'selected',
        NONE = 'none',
    }
}


// ============================================================================
// Model: sha_pinning_required
// ============================================================================
 * Whether actions must be pinned to a full-length commit SHA.
 */
export type sha_pinning_required = boolean;

// ============================================================================
// Model: short_branch
// ============================================================================
/**
 * Short Branch
 */
export type short_branch = {
    name: string;
    commit: {
        sha: string;
        url: string;
    };
    protected: boolean;
    protection?: branch_protection;
    protection_url?: string;
};


// ============================================================================
// Model: simple_user
// ============================================================================
 * A GitHub user.
 */
export type simple_user = {
    name?: string | null;
    email?: string | null;
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string | null;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    starred_at?: string;
    user_view_type?: string;
};


// ============================================================================
// Model: social_account
// ============================================================================
 * Social media account
 */
export type social_account = {
    provider: string;
    url: string;
};


// ============================================================================
// Model: ssh_signing_key
// ============================================================================
 * A public SSH key used to sign Git commits
 */
export type ssh_signing_key = {
    key: string;
    id: number;
    title: string;
    created_at: string;
};


// ============================================================================
// Model: stargazer
// ============================================================================
/**
 * Stargazer
 */
export type stargazer = {
    starred_at: string;
    user: nullable_simple_user;
};


// ============================================================================
// Model: starred_repository
// ============================================================================
/**
 * Starred Repository
 */
export type starred_repository = {
    starred_at: string;
    repo: repository;
};


// ============================================================================
// Model: status
// ============================================================================
 * Returns check runs with the specified `status`.
 */
export enum status {
    QUEUED = 'queued',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}

// ============================================================================
// Model: status_check_policy
// ============================================================================
 * Status Check Policy
 */
export type status_check_policy = {
    url: string;
    strict: boolean;
    contexts: Array<string>;
    checks: Array<{
        context: string;
        app_id: number | null;
    }>;
    contexts_url: string;
};


// ============================================================================
// Model: tag
// ============================================================================
 * Tag
 */
export type tag = {
    name: string;
    commit: {
        sha: string;
        url: string;
    };
    zipball_url: string;
    tarball_url: string;
    node_id: string;
};


// ============================================================================
// Model: tag_protection
// ============================================================================
 * Tag protection
 */
export type tag_protection = {
    id?: number;
    created_at?: string;
    updated_at?: string;
    enabled?: boolean;
    pattern: string;
};


// ============================================================================
// Model: team
// ============================================================================
/**
 * Groups of organization members that gives permissions on specified repositories.
 */
export type team = {
    id: number;
    node_id: string;
    name: string;
    slug: string;
    description: string | null;
    privacy?: string;
    notification_setting?: string;
    permission: string;
    permissions?: {
        pull: boolean;
        triage: boolean;
        push: boolean;
        maintain: boolean;
        admin: boolean;
    };
    url: string;
    html_url: string;
    members_url: string;
    repositories_url: string;
    /**
     * The ownership type of the team
     */
    type: team.type;
    /**
     * Unique identifier of the organization to which this team belongs
     */
    organization_id?: number;
    /**
     * Unique identifier of the enterprise to which this team belongs
     */
    enterprise_id?: number;
    parent: nullable_team_simple;
};
export namespace team {
    /**
     * The ownership type of the team
     */
    export enum type {
        ENTERPRISE = 'enterprise',
        ORGANIZATION = 'organization',
    }
}


// ============================================================================
// Model: team_role_assignment
// ============================================================================
/**
 * The Relationship a Team has with a role.
 */
export type team_role_assignment = {
    /**
     * Determines if the team has a direct, indirect, or mixed relationship to a role
     */
    assignment?: team_role_assignment.assignment;
    id: number;
    node_id: string;
    name: string;
    slug: string;
    description: string | null;
    privacy?: string;
    notification_setting?: string;
    permission: string;
    permissions?: {
        pull: boolean;
        triage: boolean;
        push: boolean;
        maintain: boolean;
        admin: boolean;
    };
    url: string;
    html_url: string;
    members_url: string;
    repositories_url: string;
    parent: nullable_team_simple;
    /**
     * The ownership type of the team
     */
    type: team_role_assignment.type;
    /**
     * Unique identifier of the organization to which this team belongs
     */
    organization_id?: number;
    /**
     * Unique identifier of the enterprise to which this team belongs
     */
    enterprise_id?: number;
};
export namespace team_role_assignment {
    /**
     * Determines if the team has a direct, indirect, or mixed relationship to a role
     */
    export enum assignment {
        DIRECT = 'direct',
        INDIRECT = 'indirect',
        MIXED = 'mixed',
    }
    /**
     * The ownership type of the team
     */
    export enum type {
        ENTERPRISE = 'enterprise',
        ORGANIZATION = 'organization',
    }
}


// ============================================================================
// Model: team_simple
// ============================================================================
 * Groups of organization members that gives permissions on specified repositories.
 */
export type team_simple = {
    /**
     * Unique identifier of the team
     */
    id: number;
    node_id: string;
    /**
     * URL for the team
     */
    url: string;
    members_url: string;
    /**
     * Name of the team
     */
    name: string;
    /**
     * Description of the team
     */
    description: string | null;
    /**
     * Permission that the team will have for its repositories
     */
    permission: string;
    /**
     * The level of privacy this team should have
     */
    privacy?: string;
    /**
     * The notification setting the team has set
     */
    notification_setting?: string;
    html_url: string;
    repositories_url: string;
    slug: string;
    /**
     * Distinguished Name (DN) that team maps to within LDAP environment
     */
    ldap_dn?: string;
    /**
     * The ownership type of the team
     */
    type: team_simple.type;
    /**
     * Unique identifier of the organization to which this team belongs
     */
    organization_id?: number;
    /**
     * Unique identifier of the enterprise to which this team belongs
     */
    enterprise_id?: number;
};
export namespace team_simple {
    /**
     * The ownership type of the team
     */
    export enum type {
        ENTERPRISE = 'enterprise',
        ORGANIZATION = 'organization',
    }
}


// ============================================================================
// Model: thread
// ============================================================================
/**
 * Thread
 */
export type thread = {
    id: string;
    repository: minimal_repository;
    subject: {
        title: string;
        url: string;
        latest_comment_url: string;
        type: string;
    };
    reason: string;
    unread: boolean;
    updated_at: string;
    last_read_at: string | null;
    url: string;
    subscription_url: string;
};


// ============================================================================
// Model: thread_subscription
// ============================================================================
 * Thread Subscription
 */
export type thread_subscription = {
    subscribed: boolean;
    ignored: boolean;
    reason: string | null;
    created_at: string | null;
    url: string;
    thread_url?: string;
    repository_url?: string;
};


// ============================================================================
// Model: timeline_issue_events
// ============================================================================
import type { converted_note_to_issue_issue_event } from './converted_note_to_issue_issue_event';
import type { demilestoned_issue_event } from './demilestoned_issue_event';
import type { labeled_issue_event } from './labeled_issue_event';
import type { locked_issue_event } from './locked_issue_event';
import type { milestoned_issue_event } from './milestoned_issue_event';
import type { moved_column_in_project_issue_event } from './moved_column_in_project_issue_event';
import type { removed_from_project_issue_event } from './removed_from_project_issue_event';
import type { renamed_issue_event } from './renamed_issue_event';
import type { review_dismissed_issue_event } from './review_dismissed_issue_event';
import type { review_request_removed_issue_event } from './review_request_removed_issue_event';
import type { review_requested_issue_event } from './review_requested_issue_event';
import type { state_change_issue_event } from './state_change_issue_event';
import type { timeline_assigned_issue_event } from './timeline_assigned_issue_event';
import type { timeline_comment_event } from './timeline_comment_event';
import type { timeline_commit_commented_event } from './timeline_commit_commented_event';
import type { timeline_committed_event } from './timeline_committed_event';
import type { timeline_cross_referenced_event } from './timeline_cross_referenced_event';
import type { timeline_line_commented_event } from './timeline_line_commented_event';
import type { timeline_reviewed_event } from './timeline_reviewed_event';
import type { timeline_unassigned_issue_event } from './timeline_unassigned_issue_event';
import type { unlabeled_issue_event } from './unlabeled_issue_event';
/**
 * Timeline Event
 */
export type timeline_issue_events = (labeled_issue_event | unlabeled_issue_event | milestoned_issue_event | demilestoned_issue_event | renamed_issue_event | review_requested_issue_event | review_request_removed_issue_event | review_dismissed_issue_event | locked_issue_event | added_to_project_issue_event | moved_column_in_project_issue_event | removed_from_project_issue_event | converted_note_to_issue_issue_event | timeline_comment_event | timeline_cross_referenced_event | timeline_committed_event | timeline_reviewed_event | timeline_line_commented_event | timeline_commit_commented_event | timeline_assigned_issue_event | timeline_unassigned_issue_event | state_change_issue_event);


// ============================================================================
// Model: topic
// ============================================================================
 * A topic aggregates entities that are related to a subject.
 */
export type topic = {
    names: Array<string>;
};


// ============================================================================
// Model: user_role_assignment
// ============================================================================
/**
 * The Relationship a User has with a role.
 */
export type user_role_assignment = {
    /**
     * Determines if the user has a direct, indirect, or mixed relationship to a role
     */
    assignment?: user_role_assignment.assignment;
    /**
     * Team the user has gotten the role through
     */
    inherited_from?: Array<team_simple>;
    name?: string | null;
    email?: string | null;
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string | null;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    starred_at?: string;
    user_view_type?: string;
};
export namespace user_role_assignment {
    /**
     * Determines if the user has a direct, indirect, or mixed relationship to a role
     */
    export enum assignment {
        DIRECT = 'direct',
        INDIRECT = 'indirect',
        MIXED = 'mixed',
    }
}


// ============================================================================
// Model: view_traffic
// ============================================================================
/**
 * View Traffic
 */
export type view_traffic = {
    count: number;
    uniques: number;
    views: Array<traffic>;
};


// ============================================================================
// Model: wait_timer
// ============================================================================
 * The amount of time to delay a job after the job is initially triggered. The time (in minutes) must be an integer between 0 and 43,200 (30 days).
 */
export type wait_timer = number;

// ============================================================================
// Model: webhook_config
// ============================================================================
import type { webhook_config_insecure_ssl } from './webhook_config_insecure_ssl';
import type { webhook_config_secret } from './webhook_config_secret';
import type { webhook_config_url } from './webhook_config_url';
/**
 * Configuration object of the webhook
 */
export type webhook_config = {
    url?: webhook_config_url;
    content_type?: webhook_config_content_type;
    secret?: webhook_config_secret;
    insecure_ssl?: webhook_config_insecure_ssl;
};


// ============================================================================
// Model: webhook_config_content_type
// ============================================================================
 * The media type used to serialize the payloads. Supported values include `json` and `form`. The default is `form`.
 */
export type webhook_config_content_type = string;

// ============================================================================
// Model: webhook_config_insecure_ssl
// ============================================================================


// ============================================================================
// Model: webhook_config_secret
// ============================================================================
 * If provided, the `secret` will be used as the `key` to generate the HMAC hex digest value for [delivery signature headers](https://docs.github.com/webhooks/event-payloads/#delivery-headers).
 */
export type webhook_config_secret = string;

// ============================================================================
// Model: webhook_config_url
// ============================================================================
 * The URL to which the payloads will be delivered.
 */
export type webhook_config_url = string;

// ============================================================================
// Model: workflow
// ============================================================================
 * A GitHub Actions workflow
 */
export type workflow = {
    id: number;
    node_id: string;
    name: string;
    path: string;
    state: workflow.state;
    created_at: string;
    updated_at: string;
    url: string;
    html_url: string;
    badge_url: string;
    deleted_at?: string;
};
export namespace workflow {
    export enum state {
        ACTIVE = 'active',
        DELETED = 'deleted',
        DISABLED_FORK = 'disabled_fork',
        DISABLED_INACTIVITY = 'disabled_inactivity',
        DISABLED_MANUALLY = 'disabled_manually',
    }
}


// ============================================================================
// Model: workflow_run
// ============================================================================
import type { nullable_simple_commit } from './nullable_simple_commit';
import type { pull_request_minimal } from './pull_request_minimal';
import type { referenced_workflow } from './referenced_workflow';
import type { simple_user } from './simple_user';
/**
 * An invocation of a workflow
 */
export type workflow_run = {
    /**
     * The ID of the workflow run.
     */
    id: number;
    /**
     * The name of the workflow run.
     */
    name?: string | null;
    node_id: string;
    /**
     * The ID of the associated check suite.
     */
    check_suite_id?: number;
    /**
     * The node ID of the associated check suite.
     */
    check_suite_node_id?: string;
    head_branch: string | null;
    /**
     * The SHA of the head commit that points to the version of the workflow being run.
     */
    head_sha: string;
    /**
     * The full path of the workflow
     */
    path: string;
    /**
     * The auto incrementing run number for the workflow run.
     */
    run_number: number;
    /**
     * Attempt number of the run, 1 for first attempt and higher if the workflow was re-run.
     */
    run_attempt?: number;
    referenced_workflows?: Array<referenced_workflow> | null;
    event: string;
    status: string | null;
    conclusion: string | null;
    /**
     * The ID of the parent workflow.
     */
    workflow_id: number;
    /**
     * The URL to the workflow run.
     */
    url: string;
    html_url: string;
    /**
     * Pull requests that are open with a `head_sha` or `head_branch` that matches the workflow run. The returned pull requests do not necessarily indicate pull requests that triggered the run.
     */
    pull_requests: Array<pull_request_minimal> | null;
    created_at: string;
    updated_at: string;
    actor?: simple_user;
    triggering_actor?: simple_user;
    /**
     * The start time of the latest run. Resets on re-run.
     */
    run_started_at?: string;
    /**
     * The URL to the jobs for the workflow run.
     */
    jobs_url: string;
    /**
     * The URL to download the logs for the workflow run.
     */
    logs_url: string;
    /**
     * The URL to the associated check suite.
     */
    check_suite_url: string;
    /**
     * The URL to the artifacts for the workflow run.
     */
    artifacts_url: string;
    /**
     * The URL to cancel the workflow run.
     */
    cancel_url: string;
    /**
     * The URL to rerun the workflow run.
     */
    rerun_url: string;
    /**
     * The URL to the previous attempted run of this workflow, if one exists.
     */
    previous_attempt_url?: string | null;
    /**
     * The URL to the workflow.
     */
    workflow_url: string;
    head_commit: nullable_simple_commit;
    repository: minimal_repository;
    head_repository: minimal_repository;
    head_repository_id?: number;
    /**
     * The event-specific title associated with the run or the run-name if set, or the value of `run-name` if it is set in the workflow.
     */
    display_title: string;
};


// ============================================================================
// Model: workflow_run_usage
// ============================================================================
 * Workflow Run Usage
 */
export type workflow_run_usage = {
    billable: {
        UBUNTU?: {
            total_ms: number;
            jobs: number;
            job_runs?: Array<{
                job_id: number;
                duration_ms: number;
            }>;
        };
        MACOS?: {
            total_ms: number;
            jobs: number;
            job_runs?: Array<{
                job_id: number;
                duration_ms: number;
            }>;
        };
        WINDOWS?: {
            total_ms: number;
            jobs: number;
            job_runs?: Array<{
                job_id: number;
                duration_ms: number;
            }>;
        };
    };
    run_duration_ms?: number;
};


// ============================================================================
// Model: workflow_usage
// ============================================================================
 * Workflow Usage
 */
export type workflow_usage = {
    billable: {
        UBUNTU?: {
            total_ms?: number;
        };
        MACOS?: {
            total_ms?: number;
        };
        WINDOWS?: {
            total_ms?: number;
        };
    };
};

