/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { activity } from '../models/activity';
import type { autolink } from '../models/autolink';
import type { branch_protection } from '../models/branch_protection';
import type { branch_restriction_policy } from '../models/branch_restriction_policy';
import type { branch_short } from '../models/branch_short';
import type { branch_with_protection } from '../models/branch_with_protection';
import type { check_automated_security_fixes } from '../models/check_automated_security_fixes';
import type { check_immutable_releases } from '../models/check_immutable_releases';
import type { clone_traffic } from '../models/clone_traffic';
import type { code_frequency_stat } from '../models/code_frequency_stat';
import type { codeowners_errors } from '../models/codeowners_errors';
import type { collaborator } from '../models/collaborator';
import type { combined_commit_status } from '../models/combined_commit_status';
import type { commit } from '../models/commit';
import type { commit_activity } from '../models/commit_activity';
import type { commit_comment } from '../models/commit_comment';
import type { commit_comparison } from '../models/commit_comparison';
import type { community_profile } from '../models/community_profile';
import type { content_directory } from '../models/content_directory';
import type { content_file } from '../models/content_file';
import type { content_submodule } from '../models/content_submodule';
import type { content_symlink } from '../models/content_symlink';
import type { content_traffic } from '../models/content_traffic';
import type { contributor } from '../models/contributor';
import type { contributor_activity } from '../models/contributor_activity';
import type { custom_deployment_rule_app } from '../models/custom_deployment_rule_app';
import type { custom_property_value } from '../models/custom_property_value';
import type { deploy_key } from '../models/deploy_key';
import type { deployment } from '../models/deployment';
import type { deployment_branch_policy } from '../models/deployment_branch_policy';
import type { deployment_branch_policy_name_pattern } from '../models/deployment_branch_policy_name_pattern';
import type { deployment_branch_policy_name_pattern_with_type } from '../models/deployment_branch_policy_name_pattern_with_type';
import type { deployment_branch_policy_settings } from '../models/deployment_branch_policy_settings';
import type { deployment_protection_rule } from '../models/deployment_protection_rule';
import type { deployment_reviewer_type } from '../models/deployment_reviewer_type';
import type { deployment_status } from '../models/deployment_status';
import type { empty_object } from '../models/empty_object';
import type { environment } from '../models/environment';
import type { file_commit } from '../models/file_commit';
import type { full_repository } from '../models/full_repository';
import type { hook } from '../models/hook';
import type { hook_delivery } from '../models/hook_delivery';
import type { hook_delivery_item } from '../models/hook_delivery_item';
import type { integration } from '../models/integration';
import type { language } from '../models/language';
import type { merged_upstream } from '../models/merged_upstream';
import type { minimal_repository } from '../models/minimal_repository';
import type { org_rules } from '../models/org_rules';
import type { org_ruleset_conditions } from '../models/org_ruleset_conditions';
import type { page } from '../models/page';
import type { page_build } from '../models/page_build';
import type { page_build_status } from '../models/page_build_status';
import type { page_deployment } from '../models/page_deployment';
import type { pages_deployment_status } from '../models/pages_deployment_status';
import type { pages_health_check } from '../models/pages_health_check';
import type { participation_stats } from '../models/participation_stats';
import type { prevent_self_review } from '../models/prevent_self_review';
import type { protected_branch } from '../models/protected_branch';
import type { protected_branch_admin_enforced } from '../models/protected_branch_admin_enforced';
import type { protected_branch_pull_request_review } from '../models/protected_branch_pull_request_review';
import type { pull_request_simple } from '../models/pull_request_simple';
import type { referrer_traffic } from '../models/referrer_traffic';
import type { release } from '../models/release';
import type { release_asset } from '../models/release_asset';
import type { release_notes_content } from '../models/release_notes_content';
import type { repository } from '../models/repository';
import type { repository_collaborator_permission } from '../models/repository_collaborator_permission';
import type { repository_invitation } from '../models/repository_invitation';
import type { repository_rule } from '../models/repository_rule';
import type { repository_rule_detailed } from '../models/repository_rule_detailed';
import type { repository_rule_enforcement } from '../models/repository_rule_enforcement';
import type { repository_ruleset } from '../models/repository_ruleset';
import type { repository_ruleset_bypass_actor } from '../models/repository_ruleset_bypass_actor';
import type { repository_ruleset_conditions } from '../models/repository_ruleset_conditions';
import type { rule_suite } from '../models/rule_suite';
import type { rule_suites } from '../models/rule_suites';
import type { ruleset_version } from '../models/ruleset_version';
import type { ruleset_version_with_state } from '../models/ruleset_version_with_state';
import type { short_branch } from '../models/short_branch';
import type { simple_user } from '../models/simple_user';
import type { status } from '../models/status';
import type { status_check_policy } from '../models/status_check_policy';
import type { tag } from '../models/tag';
import type { tag_protection } from '../models/tag_protection';
import type { team } from '../models/team';
import type { topic } from '../models/topic';
import type { view_traffic } from '../models/view_traffic';
import type { wait_timer } from '../models/wait_timer';
import type { webhook_config } from '../models/webhook_config';
import type { webhook_config_content_type } from '../models/webhook_config_content_type';
import type { webhook_config_insecure_ssl } from '../models/webhook_config_insecure_ssl';
import type { webhook_config_secret } from '../models/webhook_config_secret';
import type { webhook_config_url } from '../models/webhook_config_url';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReposService {
    /**
     * List organization repositories
     * Lists repositories for the specified organization.
     *
     * > [!NOTE]
     * > In order to see the `security_and_analysis` block for a repository you must have admin permissions for the repository or be an owner or security manager for the organization that owns the repository. For more information, see "[Managing security managers in your organization](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/managing-security-managers-in-your-organization)."
     * @param org The organization name. The name is not case sensitive.
     * @param type Specifies the types of repositories you want returned.
     * @param sort The property to sort the results by.
     * @param direction The order to sort by. Default: `asc` when using `full_name`, otherwise `desc`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns minimal_repository Response
     * @throws ApiError
     */
    public static reposListForOrg(
        org: string,
        type: 'all' | 'public' | 'private' | 'forks' | 'sources' | 'member' = 'all',
        sort: 'created' | 'updated' | 'pushed' | 'full_name' = 'created',
        direction?: 'asc' | 'desc',
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<minimal_repository>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/repos',
            path: {
                'org': org,
            },
            query: {
                'type': type,
                'sort': sort,
                'direction': direction,
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Create an organization repository
     * Creates a new repository in the specified organization. The authenticated user must be a member of the organization.
     *
     * OAuth app tokens and personal access tokens (classic) need the `public_repo` or `repo` scope to create a public repository, and `repo` scope to create a private repository.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody
     * @returns full_repository Response
     * @throws ApiError
     */
    public static reposCreateInOrg(
        org: string,
        requestBody: {
            /**
             * The name of the repository.
             */
            name: string;
            /**
             * A short description of the repository.
             */
            description?: string;
            /**
             * A URL with more information about the repository.
             */
            homepage?: string;
            /**
             * Whether the repository is private.
             */
            private?: boolean;
            /**
             * The visibility of the repository.
             */
            visibility?: 'public' | 'private';
            /**
             * Either `true` to enable issues for this repository or `false` to disable them.
             */
            has_issues?: boolean;
            /**
             * Either `true` to enable projects for this repository or `false` to disable them. **Note:** If you're creating a repository in an organization that has disabled repository projects, the default is `false`, and if you pass `true`, the API returns an error.
             */
            has_projects?: boolean;
            /**
             * Either `true` to enable the wiki for this repository or `false` to disable it.
             */
            has_wiki?: boolean;
            /**
             * Whether downloads are enabled.
             */
            has_downloads?: boolean;
            /**
             * Either `true` to make this repo available as a template repository or `false` to prevent it.
             */
            is_template?: boolean;
            /**
             * The id of the team that will be granted access to this repository. This is only valid when creating a repository in an organization.
             */
            team_id?: number;
            /**
             * Pass `true` to create an initial commit with empty README.
             */
            auto_init?: boolean;
            /**
             * Desired language or platform [.gitignore template](https://github.com/github/gitignore) to apply. Use the name of the template without the extension. For example, "Haskell".
             */
            gitignore_template?: string;
            /**
             * Choose an [open source license template](https://choosealicense.com/) that best suits your needs, and then use the [license keyword](https://docs.github.com/articles/licensing-a-repository/#searching-github-by-license-type) as the `license_template` string. For example, "mit" or "mpl-2.0".
             */
            license_template?: string;
            /**
             * Either `true` to allow squash-merging pull requests, or `false` to prevent squash-merging.
             */
            allow_squash_merge?: boolean;
            /**
             * Either `true` to allow merging pull requests with a merge commit, or `false` to prevent merging pull requests with merge commits.
             */
            allow_merge_commit?: boolean;
            /**
             * Either `true` to allow rebase-merging pull requests, or `false` to prevent rebase-merging.
             */
            allow_rebase_merge?: boolean;
            /**
             * Either `true` to allow auto-merge on pull requests, or `false` to disallow auto-merge.
             */
            allow_auto_merge?: boolean;
            /**
             * Either `true` to allow automatically deleting head branches when pull requests are merged, or `false` to prevent automatic deletion. **The authenticated user must be an organization owner to set this property to `true`.**
             */
            delete_branch_on_merge?: boolean;
            /**
             * Either `true` to allow squash-merge commits to use pull request title, or `false` to use commit message. **This property is closing down. Please use `squash_merge_commit_title` instead.
             * @deprecated
             */
            use_squash_pr_title_as_default?: boolean;
            /**
             * Required when using `squash_merge_commit_message`.
             *
             * The default value for a squash merge commit title:
             *
             * - `PR_TITLE` - default to the pull request's title.
             * - `COMMIT_OR_PR_TITLE` - default to the commit's title (if only one commit) or the pull request's title (when more than one commit).
             */
            squash_merge_commit_title?: 'PR_TITLE' | 'COMMIT_OR_PR_TITLE';
            /**
             * The default value for a squash merge commit message:
             *
             * - `PR_BODY` - default to the pull request's body.
             * - `COMMIT_MESSAGES` - default to the branch's commit messages.
             * - `BLANK` - default to a blank commit message.
             */
            squash_merge_commit_message?: 'PR_BODY' | 'COMMIT_MESSAGES' | 'BLANK';
            /**
             * Required when using `merge_commit_message`.
             *
             * The default value for a merge commit title.
             *
             * - `PR_TITLE` - default to the pull request's title.
             * - `MERGE_MESSAGE` - default to the classic title for a merge message (e.g., Merge pull request #123 from branch-name).
             */
            merge_commit_title?: 'PR_TITLE' | 'MERGE_MESSAGE';
            /**
             * The default value for a merge commit message.
             *
             * - `PR_TITLE` - default to the pull request's title.
             * - `PR_BODY` - default to the pull request's body.
             * - `BLANK` - default to a blank commit message.
             */
            merge_commit_message?: 'PR_BODY' | 'PR_TITLE' | 'BLANK';
            /**
             * The custom properties for the new repository. The keys are the custom property names, and the values are the corresponding custom property values.
             */
            custom_properties?: Record<string, any>;
        },
    ): CancelablePromise<full_repository> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/repos',
            path: {
                'org': org,
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
     * Get all organization repository rulesets
     * Get all the repository rulesets for an organization.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param targets A comma-separated list of rule targets to filter by.
     * If provided, only rulesets that apply to the specified targets will be returned.
     * For example, `branch,tag,push`.
     *
     * @returns repository_ruleset Response
     * @throws ApiError
     */
    public static reposGetOrgRulesets(
        org: string,
        perPage: number = 30,
        page: number = 1,
        targets?: string,
    ): CancelablePromise<Array<repository_ruleset>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/rulesets',
            path: {
                'org': org,
            },
            query: {
                'per_page': perPage,
                'page': page,
                'targets': targets,
            },
            errors: {
                404: `Resource not found`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * Create an organization repository ruleset
     * Create a repository ruleset for an organization.
     * @param org The organization name. The name is not case sensitive.
     * @param requestBody Request body
     * @returns repository_ruleset Response
     * @throws ApiError
     */
    public static reposCreateOrgRuleset(
        org: string,
        requestBody: {
            /**
             * The name of the ruleset.
             */
            name: string;
            /**
             * The target of the ruleset
             */
            target?: 'branch' | 'tag' | 'push' | 'repository';
            enforcement: repository_rule_enforcement;
            /**
             * The actors that can bypass the rules in this ruleset
             */
            bypass_actors?: Array<repository_ruleset_bypass_actor>;
            conditions?: org_ruleset_conditions;
            /**
             * An array of rules within the ruleset.
             */
            rules?: Array<org_rules>;
        },
    ): CancelablePromise<repository_ruleset> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/{org}/rulesets',
            path: {
                'org': org,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * List organization rule suites
     * Lists suites of rule evaluations at the organization level.
     * For more information, see "[Managing rulesets for repositories in your organization](https://docs.github.com/organizations/managing-organization-settings/managing-rulesets-for-repositories-in-your-organization#viewing-insights-for-rulesets)."
     * @param org The organization name. The name is not case sensitive.
     * @param ref The name of the ref. Cannot contain wildcard characters. Optionally prefix with `refs/heads/` to limit to branches or `refs/tags/` to limit to tags. Omit the prefix to search across all refs. When specified, only rule evaluations triggered for this ref will be returned.
     * @param repositoryName The name of the repository to filter on.
     * @param timePeriod The time period to filter by.
     *
     * For example, `day` will filter for rule suites that occurred in the past 24 hours, and `week` will filter for rule suites that occurred in the past 7 days (168 hours).
     * @param actorName The handle for the GitHub user account to filter on. When specified, only rule evaluations triggered by this actor will be returned.
     * @param ruleSuiteResult The rule suite results to filter on. When specified, only suites with this result will be returned.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns rule_suites Response
     * @throws ApiError
     */
    public static reposGetOrgRuleSuites(
        org: string,
        ref?: string,
        repositoryName?: string,
        timePeriod: 'hour' | 'day' | 'week' | 'month' = 'day',
        actorName?: string,
        ruleSuiteResult: 'pass' | 'fail' | 'bypass' | 'all' = 'all',
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<rule_suites> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/rulesets/rule-suites',
            path: {
                'org': org,
            },
            query: {
                'ref': ref,
                'repository_name': repositoryName,
                'time_period': timePeriod,
                'actor_name': actorName,
                'rule_suite_result': ruleSuiteResult,
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
     * Get an organization rule suite
     * Gets information about a suite of rule evaluations from within an organization.
     * For more information, see "[Managing rulesets for repositories in your organization](https://docs.github.com/organizations/managing-organization-settings/managing-rulesets-for-repositories-in-your-organization#viewing-insights-for-rulesets)."
     * @param org The organization name. The name is not case sensitive.
     * @param ruleSuiteId The unique identifier of the rule suite result.
     * To get this ID, you can use [GET /repos/{owner}/{repo}/rulesets/rule-suites](https://docs.github.com/rest/repos/rule-suites#list-repository-rule-suites)
     * for repositories and [GET /orgs/{org}/rulesets/rule-suites](https://docs.github.com/rest/orgs/rule-suites#list-organization-rule-suites)
     * for organizations.
     * @returns rule_suite Response
     * @throws ApiError
     */
    public static reposGetOrgRuleSuite(
        org: string,
        ruleSuiteId: number,
    ): CancelablePromise<rule_suite> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/rulesets/rule-suites/{rule_suite_id}',
            path: {
                'org': org,
                'rule_suite_id': ruleSuiteId,
            },
            errors: {
                404: `Resource not found`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * Get an organization repository ruleset
     * Get a repository ruleset for an organization.
     *
     * **Note:** To prevent leaking sensitive information, the `bypass_actors` property is only returned if the user
     * making the API request has write access to the ruleset.
     * @param org The organization name. The name is not case sensitive.
     * @param rulesetId The ID of the ruleset.
     * @returns repository_ruleset Response
     * @throws ApiError
     */
    public static reposGetOrgRuleset(
        org: string,
        rulesetId: number,
    ): CancelablePromise<repository_ruleset> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/rulesets/{ruleset_id}',
            path: {
                'org': org,
                'ruleset_id': rulesetId,
            },
            errors: {
                404: `Resource not found`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * Update an organization repository ruleset
     * Update a ruleset for an organization.
     * @param org The organization name. The name is not case sensitive.
     * @param rulesetId The ID of the ruleset.
     * @param requestBody Request body
     * @returns repository_ruleset Response
     * @throws ApiError
     */
    public static reposUpdateOrgRuleset(
        org: string,
        rulesetId: number,
        requestBody?: {
            /**
             * The name of the ruleset.
             */
            name?: string;
            /**
             * The target of the ruleset
             */
            target?: 'branch' | 'tag' | 'push' | 'repository';
            enforcement?: repository_rule_enforcement;
            /**
             * The actors that can bypass the rules in this ruleset
             */
            bypass_actors?: Array<repository_ruleset_bypass_actor>;
            conditions?: org_ruleset_conditions;
            /**
             * An array of rules within the ruleset.
             */
            rules?: Array<org_rules>;
        },
    ): CancelablePromise<repository_ruleset> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{org}/rulesets/{ruleset_id}',
            path: {
                'org': org,
                'ruleset_id': rulesetId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * Delete an organization repository ruleset
     * Delete a ruleset for an organization.
     * @param org The organization name. The name is not case sensitive.
     * @param rulesetId The ID of the ruleset.
     * @returns void
     * @throws ApiError
     */
    public static reposDeleteOrgRuleset(
        org: string,
        rulesetId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{org}/rulesets/{ruleset_id}',
            path: {
                'org': org,
                'ruleset_id': rulesetId,
            },
            errors: {
                404: `Resource not found`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * Get a repository
     * The `parent` and `source` objects are present when the repository is a fork. `parent` is the repository this repository was forked from, `source` is the ultimate source for the network.
     *
     * > [!NOTE]
     * > - In order to see the `security_and_analysis` block for a repository you must have admin permissions for the repository or be an owner or security manager for the organization that owns the repository. For more information, see "[Managing security managers in your organization](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/managing-security-managers-in-your-organization)."
     * > - To view merge-related settings, you must have the `contents:read` and `contents:write` permissions.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns full_repository Response
     * @throws ApiError
     */
    public static reposGet(
        owner: string,
        repo: string,
    ): CancelablePromise<full_repository> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                301: `Moved permanently`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Update a repository
     * **Note**: To edit a repository's topics, use the [Replace all repository topics](https://docs.github.com/rest/repos/repos#replace-all-repository-topics) endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns full_repository Response
     * @throws ApiError
     */
    public static reposUpdate(
        owner: string,
        repo: string,
        requestBody?: {
            /**
             * The name of the repository.
             */
            name?: string;
            /**
             * A short description of the repository.
             */
            description?: string;
            /**
             * A URL with more information about the repository.
             */
            homepage?: string;
            /**
             * Either `true` to make the repository private or `false` to make it public. Default: `false`.
             * **Note**: You will get a `422` error if the organization restricts [changing repository visibility](https://docs.github.com/articles/repository-permission-levels-for-an-organization#changing-the-visibility-of-repositories) to organization owners and a non-owner tries to change the value of private.
             */
            private?: boolean;
            /**
             * The visibility of the repository.
             */
            visibility?: 'public' | 'private';
            /**
             * Specify which security and analysis features to enable or disable for the repository.
             *
             * To use this parameter, you must have admin permissions for the repository or be an owner or security manager for the organization that owns the repository. For more information, see "[Managing security managers in your organization](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/managing-security-managers-in-your-organization)."
             *
             * For example, to enable GitHub Advanced Security, use this data in the body of the `PATCH` request:
             * `{ "security_and_analysis": {"advanced_security": { "status": "enabled" } } }`.
             *
             * You can check which security and analysis features are currently enabled by using a `GET /repos/{owner}/{repo}` request.
             */
            security_and_analysis?: {
                /**
                 * Use the `status` property to enable or disable GitHub Advanced Security for this repository.
                 * For more information, see "[About GitHub Advanced
                 * Security](/github/getting-started-with-github/learning-about-github/about-github-advanced-security)."
                 *
                 * For standalone Code Scanning or Secret Protection products, this parameter cannot be used.
                 */
                advanced_security?: {
                    /**
                     * Can be `enabled` or `disabled`.
                     */
                    status?: string;
                };
                /**
                 * Use the `status` property to enable or disable GitHub Code Security for this repository.
                 */
                code_security?: {
                    /**
                     * Can be `enabled` or `disabled`.
                     */
                    status?: string;
                };
                /**
                 * Use the `status` property to enable or disable secret scanning for this repository. For more information, see "[About secret scanning](/code-security/secret-security/about-secret-scanning)."
                 */
                secret_scanning?: {
                    /**
                     * Can be `enabled` or `disabled`.
                     */
                    status?: string;
                };
                /**
                 * Use the `status` property to enable or disable secret scanning push protection for this repository. For more information, see "[Protecting pushes with secret scanning](/code-security/secret-scanning/protecting-pushes-with-secret-scanning)."
                 */
                secret_scanning_push_protection?: {
                    /**
                     * Can be `enabled` or `disabled`.
                     */
                    status?: string;
                };
                /**
                 * Use the `status` property to enable or disable secret scanning AI detection for this repository. For more information, see "[Responsible detection of generic secrets with AI](https://docs.github.com/code-security/secret-scanning/using-advanced-secret-scanning-and-push-protection-features/generic-secret-detection/responsible-ai-generic-secrets)."
                 */
                secret_scanning_ai_detection?: {
                    /**
                     * Can be `enabled` or `disabled`.
                     */
                    status?: string;
                };
                /**
                 * Use the `status` property to enable or disable secret scanning non-provider patterns for this repository. For more information, see "[Supported secret scanning patterns](/code-security/secret-scanning/introduction/supported-secret-scanning-patterns#supported-secrets)."
                 */
                secret_scanning_non_provider_patterns?: {
                    /**
                     * Can be `enabled` or `disabled`.
                     */
                    status?: string;
                };
            } | null;
            /**
             * Either `true` to enable issues for this repository or `false` to disable them.
             */
            has_issues?: boolean;
            /**
             * Either `true` to enable projects for this repository or `false` to disable them. **Note:** If you're creating a repository in an organization that has disabled repository projects, the default is `false`, and if you pass `true`, the API returns an error.
             */
            has_projects?: boolean;
            /**
             * Either `true` to enable the wiki for this repository or `false` to disable it.
             */
            has_wiki?: boolean;
            /**
             * Either `true` to make this repo available as a template repository or `false` to prevent it.
             */
            is_template?: boolean;
            /**
             * Updates the default branch for this repository.
             */
            default_branch?: string;
            /**
             * Either `true` to allow squash-merging pull requests, or `false` to prevent squash-merging.
             */
            allow_squash_merge?: boolean;
            /**
             * Either `true` to allow merging pull requests with a merge commit, or `false` to prevent merging pull requests with merge commits.
             */
            allow_merge_commit?: boolean;
            /**
             * Either `true` to allow rebase-merging pull requests, or `false` to prevent rebase-merging.
             */
            allow_rebase_merge?: boolean;
            /**
             * Either `true` to allow auto-merge on pull requests, or `false` to disallow auto-merge.
             */
            allow_auto_merge?: boolean;
            /**
             * Either `true` to allow automatically deleting head branches when pull requests are merged, or `false` to prevent automatic deletion.
             */
            delete_branch_on_merge?: boolean;
            /**
             * Either `true` to always allow a pull request head branch that is behind its base branch to be updated even if it is not required to be up to date before merging, or false otherwise.
             */
            allow_update_branch?: boolean;
            /**
             * Either `true` to allow squash-merge commits to use pull request title, or `false` to use commit message. **This property is closing down. Please use `squash_merge_commit_title` instead.
             * @deprecated
             */
            use_squash_pr_title_as_default?: boolean;
            /**
             * Required when using `squash_merge_commit_message`.
             *
             * The default value for a squash merge commit title:
             *
             * - `PR_TITLE` - default to the pull request's title.
             * - `COMMIT_OR_PR_TITLE` - default to the commit's title (if only one commit) or the pull request's title (when more than one commit).
             */
            squash_merge_commit_title?: 'PR_TITLE' | 'COMMIT_OR_PR_TITLE';
            /**
             * The default value for a squash merge commit message:
             *
             * - `PR_BODY` - default to the pull request's body.
             * - `COMMIT_MESSAGES` - default to the branch's commit messages.
             * - `BLANK` - default to a blank commit message.
             */
            squash_merge_commit_message?: 'PR_BODY' | 'COMMIT_MESSAGES' | 'BLANK';
            /**
             * Required when using `merge_commit_message`.
             *
             * The default value for a merge commit title.
             *
             * - `PR_TITLE` - default to the pull request's title.
             * - `MERGE_MESSAGE` - default to the classic title for a merge message (e.g., Merge pull request #123 from branch-name).
             */
            merge_commit_title?: 'PR_TITLE' | 'MERGE_MESSAGE';
            /**
             * The default value for a merge commit message.
             *
             * - `PR_TITLE` - default to the pull request's title.
             * - `PR_BODY` - default to the pull request's body.
             * - `BLANK` - default to a blank commit message.
             */
            merge_commit_message?: 'PR_BODY' | 'PR_TITLE' | 'BLANK';
            /**
             * Whether to archive this repository. `false` will unarchive a previously archived repository.
             */
            archived?: boolean;
            /**
             * Either `true` to allow private forks, or `false` to prevent private forks.
             */
            allow_forking?: boolean;
            /**
             * Either `true` to require contributors to sign off on web-based commits, or `false` to not require contributors to sign off on web-based commits.
             */
            web_commit_signoff_required?: boolean;
        },
    ): CancelablePromise<full_repository> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                307: `Temporary Redirect`,
                403: `Forbidden`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Delete a repository
     * Deleting a repository requires admin access.
     *
     * If an organization owner has configured the organization to prevent members from deleting organization-owned
     * repositories, you will get a `403 Forbidden` response.
     *
     * OAuth app tokens and personal access tokens (classic) need the `delete_repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns void
     * @throws ApiError
     */
    public static reposDelete(
        owner: string,
        repo: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                307: `Temporary Redirect`,
                403: `If an organization owner has configured the organization to prevent members from deleting organization-owned repositories, a member will get this response:`,
                404: `Resource not found`,
                409: `Conflict`,
            },
        });
    }
    /**
     * List repository activities
     * Lists a detailed history of changes to a repository, such as pushes, merges, force pushes, and branch changes, and associates these changes with commits and users.
     *
     * For more information about viewing repository activity,
     * see "[Viewing activity and data for your repository](https://docs.github.com/repositories/viewing-activity-and-data-for-your-repository)."
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param direction The direction to sort the results by.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param before A cursor, as given in the [Link header](https://docs.github.com/rest/guides/using-pagination-in-the-rest-api#using-link-headers). If specified, the query only searches for results before this cursor. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param after A cursor, as given in the [Link header](https://docs.github.com/rest/guides/using-pagination-in-the-rest-api#using-link-headers). If specified, the query only searches for results after this cursor. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param ref The Git reference for the activities you want to list.
     *
     * The `ref` for a branch can be formatted either as `refs/heads/BRANCH_NAME` or `BRANCH_NAME`, where `BRANCH_NAME` is the name of your branch.
     * @param actor The GitHub username to use to filter by the actor who performed the activity.
     * @param timePeriod The time period to filter by.
     *
     * For example, `day` will filter for activity that occurred in the past 24 hours, and `week` will filter for activity that occurred in the past 7 days (168 hours).
     * @param activityType The activity type to filter by.
     *
     * For example, you can choose to filter by "force_push", to see all force pushes to the repository.
     * @returns activity Response
     * @throws ApiError
     */
    public static reposListActivities(
        owner: string,
        repo: string,
        direction: 'asc' | 'desc' = 'desc',
        perPage: number = 30,
        before?: string,
        after?: string,
        ref?: string,
        actor?: string,
        timePeriod?: 'day' | 'week' | 'month' | 'quarter' | 'year',
        activityType?: 'push' | 'force_push' | 'branch_creation' | 'branch_deletion' | 'pr_merge' | 'merge_queue_merge',
    ): CancelablePromise<Array<activity>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/activity',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'direction': direction,
                'per_page': perPage,
                'before': before,
                'after': after,
                'ref': ref,
                'actor': actor,
                'time_period': timePeriod,
                'activity_type': activityType,
            },
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Create an attestation
     * Store an artifact attestation and associate it with a repository.
     *
     * The authenticated user must have write permission to the repository and, if using a fine-grained access token, the `attestations:write` permission is required.
     *
     * Artifact attestations are meant to be created using the [attest action](https://github.com/actions/attest). For more information, see our guide on [using artifact attestations to establish a build's provenance](https://docs.github.com/actions/security-guides/using-artifact-attestations-to-establish-provenance-for-builds).
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns any response
     * @throws ApiError
     */
    public static reposCreateAttestation(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * The attestation's Sigstore Bundle.
             * Refer to the [Sigstore Bundle Specification](https://github.com/sigstore/protobuf-specs/blob/main/protos/sigstore_bundle.proto) for more information.
             */
            bundle: {
                mediaType?: string;
                verificationMaterial?: Record<string, any>;
                dsseEnvelope?: Record<string, any>;
            };
        },
    ): CancelablePromise<{
        /**
         * The ID of the attestation.
         */
        id?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/attestations',
            path: {
                'owner': owner,
                'repo': repo,
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
     * List attestations
     * List a collection of artifact attestations with a given subject digest that are associated with a repository.
     *
     * The authenticated user making the request must have read access to the repository. In addition, when using a fine-grained access token the `attestations:read` permission is required.
     *
     * **Please note:** in order to offer meaningful security benefits, an attestation's signature and timestamps **must** be cryptographically verified, and the identity of the attestation signer **must** be validated. Attestations can be verified using the [GitHub CLI `attestation verify` command](https://cli.github.com/manual/gh_attestation_verify). For more information, see [our guide on how to use artifact attestations to establish a build's provenance](https://docs.github.com/actions/security-guides/using-artifact-attestations-to-establish-provenance-for-builds).
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
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
    public static reposListAttestations(
        owner: string,
        repo: string,
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
            url: '/repos/{owner}/{repo}/attestations/{subject_digest}',
            path: {
                'owner': owner,
                'repo': repo,
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
     * Get all autolinks of a repository
     * Gets all autolinks that are configured for a repository.
     *
     * Information about autolinks are only available to repository administrators.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns autolink Response
     * @throws ApiError
     */
    public static reposListAutolinks(
        owner: string,
        repo: string,
    ): CancelablePromise<Array<autolink>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/autolinks',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Create an autolink reference for a repository
     * Users with admin access to the repository can create an autolink.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns autolink response
     * @throws ApiError
     */
    public static reposCreateAutolink(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * This prefix appended by certain characters will generate a link any time it is found in an issue, pull request, or commit.
             */
            key_prefix: string;
            /**
             * The URL must contain `<num>` for the reference number. `<num>` matches different characters depending on the value of `is_alphanumeric`.
             */
            url_template: string;
            /**
             * Whether this autolink reference matches alphanumeric characters. If true, the `<num>` parameter of the `url_template` matches alphanumeric characters `A-Z` (case insensitive), `0-9`, and `-`. If false, this autolink reference only matches numeric characters.
             */
            is_alphanumeric?: boolean;
        },
    ): CancelablePromise<autolink> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/autolinks',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get an autolink reference of a repository
     * This returns a single autolink reference by ID that was configured for the given repository.
     *
     * Information about autolinks are only available to repository administrators.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param autolinkId The unique identifier of the autolink.
     * @returns autolink Response
     * @throws ApiError
     */
    public static reposGetAutolink(
        owner: string,
        repo: string,
        autolinkId: number,
    ): CancelablePromise<autolink> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/autolinks/{autolink_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'autolink_id': autolinkId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Delete an autolink reference from a repository
     * This deletes a single autolink reference by ID that was configured for the given repository.
     *
     * Information about autolinks are only available to repository administrators.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param autolinkId The unique identifier of the autolink.
     * @returns void
     * @throws ApiError
     */
    public static reposDeleteAutolink(
        owner: string,
        repo: string,
        autolinkId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/autolinks/{autolink_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'autolink_id': autolinkId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Check if Dependabot security updates are enabled for a repository
     * Shows whether Dependabot security updates are enabled, disabled or paused for a repository. The authenticated user must have admin read access to the repository. For more information, see "[Configuring Dependabot security updates](https://docs.github.com/articles/configuring-automated-security-fixes)".
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns check_automated_security_fixes Response if Dependabot is enabled
     * @throws ApiError
     */
    public static reposCheckAutomatedSecurityFixes(
        owner: string,
        repo: string,
    ): CancelablePromise<check_automated_security_fixes> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/automated-security-fixes',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                404: `Not Found if Dependabot is not enabled for the repository`,
            },
        });
    }
    /**
     * Enable Dependabot security updates
     * Enables Dependabot security updates for a repository. The authenticated user must have admin access to the repository. For more information, see "[Configuring Dependabot security updates](https://docs.github.com/articles/configuring-automated-security-fixes)".
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns void
     * @throws ApiError
     */
    public static reposEnableAutomatedSecurityFixes(
        owner: string,
        repo: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/automated-security-fixes',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Disable Dependabot security updates
     * Disables Dependabot security updates for a repository. The authenticated user must have admin access to the repository. For more information, see "[Configuring Dependabot security updates](https://docs.github.com/articles/configuring-automated-security-fixes)".
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns void
     * @throws ApiError
     */
    public static reposDisableAutomatedSecurityFixes(
        owner: string,
        repo: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/automated-security-fixes',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * List branches
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param _protected Setting to `true` returns only branches protected by branch protections or rulesets. When set to `false`, only unprotected branches are returned. Omitting this parameter returns all branches.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns short_branch Response
     * @throws ApiError
     */
    public static reposListBranches(
        owner: string,
        repo: string,
        _protected?: boolean,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<short_branch>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/branches',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'protected': _protected,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get a branch
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns branch_with_protection Response
     * @throws ApiError
     */
    public static reposGetBranch(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<branch_with_protection> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/branches/{branch}',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            errors: {
                301: `Moved permanently`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get branch protection
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns branch_protection Response
     * @throws ApiError
     */
    public static reposGetBranchProtection(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<branch_protection> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Update branch protection
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Protecting a branch requires admin or owner permissions to the repository.
     *
     * > [!NOTE]
     * > Passing new arrays of `users` and `teams` replaces their previous values.
     *
     * > [!NOTE]
     * > The list of users, apps, and teams in total is limited to 100 items.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @param requestBody
     * @returns protected_branch Response
     * @throws ApiError
     */
    public static reposUpdateBranchProtection(
        owner: string,
        repo: string,
        branch: string,
        requestBody: {
            /**
             * Require status checks to pass before merging. Set to `null` to disable.
             */
            required_status_checks: {
                /**
                 * Require branches to be up to date before merging.
                 */
                strict: boolean;
                /**
                 * **Closing down notice**: The list of status checks to require in order to merge into this branch. If any of these checks have recently been set by a particular GitHub App, they will be required to come from that app in future for the branch to merge. Use `checks` instead of `contexts` for more fine-grained control.
                 * @deprecated
                 */
                contexts: Array<string>;
                /**
                 * The list of status checks to require in order to merge into this branch.
                 */
                checks?: Array<{
                    /**
                     * The name of the required check
                     */
                    context: string;
                    /**
                     * The ID of the GitHub App that must provide this check. Omit this field to automatically select the GitHub App that has recently provided this check, or any app if it was not set by a GitHub App. Pass -1 to explicitly allow any app to set the status.
                     */
                    app_id?: number;
                }>;
            } | null;
            /**
             * Enforce all configured restrictions for administrators. Set to `true` to enforce required status checks for repository administrators. Set to `null` to disable.
             */
            enforce_admins: boolean | null;
            /**
             * Require at least one approving review on a pull request, before merging. Set to `null` to disable.
             */
            required_pull_request_reviews: {
                /**
                 * Specify which users, teams, and apps can dismiss pull request reviews. Pass an empty `dismissal_restrictions` object to disable. User and team `dismissal_restrictions` are only available for organization-owned repositories. Omit this parameter for personal repositories.
                 */
                dismissal_restrictions?: {
                    /**
                     * The list of user `login`s with dismissal access
                     */
                    users?: Array<string>;
                    /**
                     * The list of team `slug`s with dismissal access
                     */
                    teams?: Array<string>;
                    /**
                     * The list of app `slug`s with dismissal access
                     */
                    apps?: Array<string>;
                };
                /**
                 * Set to `true` if you want to automatically dismiss approving reviews when someone pushes a new commit.
                 */
                dismiss_stale_reviews?: boolean;
                /**
                 * Blocks merging pull requests until [code owners](https://docs.github.com/articles/about-code-owners/) review them.
                 */
                require_code_owner_reviews?: boolean;
                /**
                 * Specify the number of reviewers required to approve pull requests. Use a number between 1 and 6 or 0 to not require reviewers.
                 */
                required_approving_review_count?: number;
                /**
                 * Whether the most recent push must be approved by someone other than the person who pushed it. Default: `false`.
                 */
                require_last_push_approval?: boolean;
                /**
                 * Allow specific users, teams, or apps to bypass pull request requirements.
                 */
                bypass_pull_request_allowances?: {
                    /**
                     * The list of user `login`s allowed to bypass pull request requirements.
                     */
                    users?: Array<string>;
                    /**
                     * The list of team `slug`s allowed to bypass pull request requirements.
                     */
                    teams?: Array<string>;
                    /**
                     * The list of app `slug`s allowed to bypass pull request requirements.
                     */
                    apps?: Array<string>;
                };
            } | null;
            /**
             * Restrict who can push to the protected branch. User, app, and team `restrictions` are only available for organization-owned repositories. Set to `null` to disable.
             */
            restrictions: {
                /**
                 * The list of user `login`s with push access
                 */
                users: Array<string>;
                /**
                 * The list of team `slug`s with push access
                 */
                teams: Array<string>;
                /**
                 * The list of app `slug`s with push access
                 */
                apps?: Array<string>;
            } | null;
            /**
             * Enforces a linear commit Git history, which prevents anyone from pushing merge commits to a branch. Set to `true` to enforce a linear commit history. Set to `false` to disable a linear commit Git history. Your repository must allow squash merging or rebase merging before you can enable a linear commit history. Default: `false`. For more information, see "[Requiring a linear commit history](https://docs.github.com/github/administering-a-repository/requiring-a-linear-commit-history)" in the GitHub Help documentation.
             */
            required_linear_history?: boolean;
            /**
             * Permits force pushes to the protected branch by anyone with write access to the repository. Set to `true` to allow force pushes. Set to `false` or `null` to block force pushes. Default: `false`. For more information, see "[Enabling force pushes to a protected branch](https://docs.github.com/github/administering-a-repository/enabling-force-pushes-to-a-protected-branch)" in the GitHub Help documentation."
             */
            allow_force_pushes?: boolean | null;
            /**
             * Allows deletion of the protected branch by anyone with write access to the repository. Set to `false` to prevent deletion of the protected branch. Default: `false`. For more information, see "[Enabling force pushes to a protected branch](https://docs.github.com/github/administering-a-repository/enabling-force-pushes-to-a-protected-branch)" in the GitHub Help documentation.
             */
            allow_deletions?: boolean;
            /**
             * If set to `true`, the `restrictions` branch protection settings which limits who can push will also block pushes which create new branches, unless the push is initiated by a user, team, or app which has the ability to push. Set to `true` to restrict new branch creation. Default: `false`.
             */
            block_creations?: boolean;
            /**
             * Requires all conversations on code to be resolved before a pull request can be merged into a branch that matches this rule. Set to `false` to disable. Default: `false`.
             */
            required_conversation_resolution?: boolean;
            /**
             * Whether to set the branch as read-only. If this is true, users will not be able to push to the branch. Default: `false`.
             */
            lock_branch?: boolean;
            /**
             * Whether users can pull changes from upstream when the branch is locked. Set to `true` to allow fork syncing. Set to `false` to prevent fork syncing. Default: `false`.
             */
            allow_fork_syncing?: boolean;
        },
    ): CancelablePromise<protected_branch> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
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
     * Delete branch protection
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns void
     * @throws ApiError
     */
    public static reposDeleteBranchProtection(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            errors: {
                403: `Forbidden`,
            },
        });
    }
    /**
     * Get admin branch protection
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns protected_branch_admin_enforced Response
     * @throws ApiError
     */
    public static reposGetAdminBranchProtection(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<protected_branch_admin_enforced> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
        });
    }
    /**
     * Set admin branch protection
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Adding admin enforcement requires admin or owner permissions to the repository and branch protection to be enabled.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns protected_branch_admin_enforced Response
     * @throws ApiError
     */
    public static reposSetAdminBranchProtection(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<protected_branch_admin_enforced> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
        });
    }
    /**
     * Delete admin branch protection
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Removing admin enforcement requires admin or owner permissions to the repository and branch protection to be enabled.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns void
     * @throws ApiError
     */
    public static reposDeleteAdminBranchProtection(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get pull request review protection
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns protected_branch_pull_request_review Response
     * @throws ApiError
     */
    public static reposGetPullRequestReviewProtection(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<protected_branch_pull_request_review> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
        });
    }
    /**
     * Update pull request review protection
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Updating pull request review enforcement requires admin or owner permissions to the repository and branch protection to be enabled.
     *
     * > [!NOTE]
     * > Passing new arrays of `users` and `teams` replaces their previous values.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @param requestBody
     * @returns protected_branch_pull_request_review Response
     * @throws ApiError
     */
    public static reposUpdatePullRequestReviewProtection(
        owner: string,
        repo: string,
        branch: string,
        requestBody?: {
            /**
             * Specify which users, teams, and apps can dismiss pull request reviews. Pass an empty `dismissal_restrictions` object to disable. User and team `dismissal_restrictions` are only available for organization-owned repositories. Omit this parameter for personal repositories.
             */
            dismissal_restrictions?: {
                /**
                 * The list of user `login`s with dismissal access
                 */
                users?: Array<string>;
                /**
                 * The list of team `slug`s with dismissal access
                 */
                teams?: Array<string>;
                /**
                 * The list of app `slug`s with dismissal access
                 */
                apps?: Array<string>;
            };
            /**
             * Set to `true` if you want to automatically dismiss approving reviews when someone pushes a new commit.
             */
            dismiss_stale_reviews?: boolean;
            /**
             * Blocks merging pull requests until [code owners](https://docs.github.com/articles/about-code-owners/) have reviewed.
             */
            require_code_owner_reviews?: boolean;
            /**
             * Specifies the number of reviewers required to approve pull requests. Use a number between 1 and 6 or 0 to not require reviewers.
             */
            required_approving_review_count?: number;
            /**
             * Whether the most recent push must be approved by someone other than the person who pushed it. Default: `false`
             */
            require_last_push_approval?: boolean;
            /**
             * Allow specific users, teams, or apps to bypass pull request requirements.
             */
            bypass_pull_request_allowances?: {
                /**
                 * The list of user `login`s allowed to bypass pull request requirements.
                 */
                users?: Array<string>;
                /**
                 * The list of team `slug`s allowed to bypass pull request requirements.
                 */
                teams?: Array<string>;
                /**
                 * The list of app `slug`s allowed to bypass pull request requirements.
                 */
                apps?: Array<string>;
            };
        },
    ): CancelablePromise<protected_branch_pull_request_review> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Delete pull request review protection
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns void
     * @throws ApiError
     */
    public static reposDeletePullRequestReviewProtection(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get commit signature protection
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * When authenticated with admin or owner permissions to the repository, you can use this endpoint to check whether a branch requires signed commits. An enabled status of `true` indicates you must sign commits on this branch. For more information, see [Signing commits with GPG](https://docs.github.com/articles/signing-commits-with-gpg) in GitHub Help.
     *
     * > [!NOTE]
     * > You must enable branch protection to require signed commits.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns protected_branch_admin_enforced Response
     * @throws ApiError
     */
    public static reposGetCommitSignatureProtection(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<protected_branch_admin_enforced> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/required_signatures',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Create commit signature protection
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * When authenticated with admin or owner permissions to the repository, you can use this endpoint to require signed commits on a branch. You must enable branch protection to require signed commits.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns protected_branch_admin_enforced Response
     * @throws ApiError
     */
    public static reposCreateCommitSignatureProtection(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<protected_branch_admin_enforced> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/required_signatures',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Delete commit signature protection
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * When authenticated with admin or owner permissions to the repository, you can use this endpoint to disable required signed commits on a branch. You must enable branch protection to require signed commits.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns void
     * @throws ApiError
     */
    public static reposDeleteCommitSignatureProtection(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/required_signatures',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get status checks protection
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns status_check_policy Response
     * @throws ApiError
     */
    public static reposGetStatusChecksProtection(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<status_check_policy> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Update status check protection
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Updating required status checks requires admin or owner permissions to the repository and branch protection to be enabled.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @param requestBody
     * @returns status_check_policy Response
     * @throws ApiError
     */
    public static reposUpdateStatusCheckProtection(
        owner: string,
        repo: string,
        branch: string,
        requestBody?: {
            /**
             * Require branches to be up to date before merging.
             */
            strict?: boolean;
            /**
             * **Closing down notice**: The list of status checks to require in order to merge into this branch. If any of these checks have recently been set by a particular GitHub App, they will be required to come from that app in future for the branch to merge. Use `checks` instead of `contexts` for more fine-grained control.
             * @deprecated
             */
            contexts?: Array<string>;
            /**
             * The list of status checks to require in order to merge into this branch.
             */
            checks?: Array<{
                /**
                 * The name of the required check
                 */
                context: string;
                /**
                 * The ID of the GitHub App that must provide this check. Omit this field to automatically select the GitHub App that has recently provided this check, or any app if it was not set by a GitHub App. Pass -1 to explicitly allow any app to set the status.
                 */
                app_id?: number;
            }>;
        },
    ): CancelablePromise<status_check_policy> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
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
     * Remove status check protection
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns void
     * @throws ApiError
     */
    public static reposRemoveStatusCheckProtection(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
        });
    }
    /**
     * Get all status check contexts
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns string Response
     * @throws ApiError
     */
    public static reposGetAllStatusCheckContexts(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Add status check contexts
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @param requestBody
     * @returns string Response
     * @throws ApiError
     */
    public static reposAddStatusCheckContexts(
        owner: string,
        repo: string,
        branch: string,
        requestBody?: ({
            /**
             * The name of the status checks
             */
            contexts: Array<string>;
        } | Array<string>),
    ): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
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
     * Set status check contexts
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @param requestBody
     * @returns string Response
     * @throws ApiError
     */
    public static reposSetStatusCheckContexts(
        owner: string,
        repo: string,
        branch: string,
        requestBody?: ({
            /**
             * The name of the status checks
             */
            contexts: Array<string>;
        } | Array<string>),
    ): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
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
     * Remove status check contexts
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @param requestBody
     * @returns string Response
     * @throws ApiError
     */
    public static reposRemoveStatusCheckContexts(
        owner: string,
        repo: string,
        branch: string,
        requestBody?: ({
            /**
             * The name of the status checks
             */
            contexts: Array<string>;
        } | Array<string>),
    ): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
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
     * Get access restrictions
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Lists who has access to this protected branch.
     *
     * > [!NOTE]
     * > Users, apps, and teams `restrictions` are only available for organization-owned repositories.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns branch_restriction_policy Response
     * @throws ApiError
     */
    public static reposGetAccessRestrictions(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<branch_restriction_policy> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/restrictions',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Delete access restrictions
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Disables the ability to restrict who can push to this branch.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns void
     * @throws ApiError
     */
    public static reposDeleteAccessRestrictions(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/restrictions',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
        });
    }
    /**
     * Get apps with access to the protected branch
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Lists the GitHub Apps that have push access to this branch. Only GitHub Apps that are installed on the repository and that have been granted write access to the repository contents can be added as authorized actors on a protected branch.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns integration Response
     * @throws ApiError
     */
    public static reposGetAppsWithAccessToProtectedBranch(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<Array<integration>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Add app access restrictions
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Grants the specified apps push access for this branch. Only GitHub Apps that are installed on the repository and that have been granted write access to the repository contents can be added as authorized actors on a protected branch.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @param requestBody
     * @returns integration Response
     * @throws ApiError
     */
    public static reposAddAppAccessRestrictions(
        owner: string,
        repo: string,
        branch: string,
        requestBody: {
            /**
             * The GitHub Apps that have push access to this branch. Use the slugified version of the app name. **Note**: The list of users, apps, and teams in total is limited to 100 items.
             */
            apps: Array<string>;
        },
    ): CancelablePromise<Array<integration>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Set app access restrictions
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Replaces the list of apps that have push access to this branch. This removes all apps that previously had push access and grants push access to the new list of apps. Only GitHub Apps that are installed on the repository and that have been granted write access to the repository contents can be added as authorized actors on a protected branch.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @param requestBody
     * @returns integration Response
     * @throws ApiError
     */
    public static reposSetAppAccessRestrictions(
        owner: string,
        repo: string,
        branch: string,
        requestBody: {
            /**
             * The GitHub Apps that have push access to this branch. Use the slugified version of the app name. **Note**: The list of users, apps, and teams in total is limited to 100 items.
             */
            apps: Array<string>;
        },
    ): CancelablePromise<Array<integration>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Remove app access restrictions
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Removes the ability of an app to push to this branch. Only GitHub Apps that are installed on the repository and that have been granted write access to the repository contents can be added as authorized actors on a protected branch.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @param requestBody
     * @returns integration Response
     * @throws ApiError
     */
    public static reposRemoveAppAccessRestrictions(
        owner: string,
        repo: string,
        branch: string,
        requestBody: {
            /**
             * The GitHub Apps that have push access to this branch. Use the slugified version of the app name. **Note**: The list of users, apps, and teams in total is limited to 100 items.
             */
            apps: Array<string>;
        },
    ): CancelablePromise<Array<integration>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get teams with access to the protected branch
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Lists the teams who have push access to this branch. The list includes child teams.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns team Response
     * @throws ApiError
     */
    public static reposGetTeamsWithAccessToProtectedBranch(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<Array<team>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Add team access restrictions
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Grants the specified teams push access for this branch. You can also give push access to child teams.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @param requestBody
     * @returns team Response
     * @throws ApiError
     */
    public static reposAddTeamAccessRestrictions(
        owner: string,
        repo: string,
        branch: string,
        requestBody?: ({
            /**
             * The slug values for teams
             */
            teams: Array<string>;
        } | Array<string>),
    ): CancelablePromise<Array<team>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Set team access restrictions
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Replaces the list of teams that have push access to this branch. This removes all teams that previously had push access and grants push access to the new list of teams. Team restrictions include child teams.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @param requestBody
     * @returns team Response
     * @throws ApiError
     */
    public static reposSetTeamAccessRestrictions(
        owner: string,
        repo: string,
        branch: string,
        requestBody?: ({
            /**
             * The slug values for teams
             */
            teams: Array<string>;
        } | Array<string>),
    ): CancelablePromise<Array<team>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Remove team access restrictions
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Removes the ability of a team to push to this branch. You can also remove push access for child teams.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @param requestBody
     * @returns team Response
     * @throws ApiError
     */
    public static reposRemoveTeamAccessRestrictions(
        owner: string,
        repo: string,
        branch: string,
        requestBody?: ({
            /**
             * The slug values for teams
             */
            teams: Array<string>;
        } | Array<string>),
    ): CancelablePromise<Array<team>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get users with access to the protected branch
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Lists the people who have push access to this branch.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @returns simple_user Response
     * @throws ApiError
     */
    public static reposGetUsersWithAccessToProtectedBranch(
        owner: string,
        repo: string,
        branch: string,
    ): CancelablePromise<Array<simple_user>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Add user access restrictions
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Grants the specified people push access for this branch.
     *
     * | Type    | Description                                                                                                                   |
     * | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
     * | `array` | Usernames for people who can have push access. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @param requestBody
     * @returns simple_user Response
     * @throws ApiError
     */
    public static reposAddUserAccessRestrictions(
        owner: string,
        repo: string,
        branch: string,
        requestBody: {
            /**
             * The username for users
             */
            users: Array<string>;
        },
    ): CancelablePromise<Array<simple_user>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Set user access restrictions
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Replaces the list of people that have push access to this branch. This removes all people that previously had push access and grants push access to the new list of people.
     *
     * | Type    | Description                                                                                                                   |
     * | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
     * | `array` | Usernames for people who can have push access. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @param requestBody
     * @returns simple_user Response
     * @throws ApiError
     */
    public static reposSetUserAccessRestrictions(
        owner: string,
        repo: string,
        branch: string,
        requestBody: {
            /**
             * The username for users
             */
            users: Array<string>;
        },
    ): CancelablePromise<Array<simple_user>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Remove user access restrictions
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Removes the ability of a user to push to this branch.
     *
     * | Type    | Description                                                                                                                                   |
     * | ------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
     * | `array` | Usernames of the people who should no longer have push access. **Note**: The list of users, apps, and teams in total is limited to 100 items. |
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @param requestBody
     * @returns simple_user Response
     * @throws ApiError
     */
    public static reposRemoveUserAccessRestrictions(
        owner: string,
        repo: string,
        branch: string,
        requestBody: {
            /**
             * The username for users
             */
            users: Array<string>;
        },
    ): CancelablePromise<Array<simple_user>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Rename a branch
     * Renames a branch in a repository.
     *
     * > [!NOTE]
     * > Although the API responds immediately, the branch rename process might take some extra time to complete in the background. You won't be able to push to the old branch name while the rename process is in progress. For more information, see "[Renaming a branch](https://docs.github.com/github/administering-a-repository/renaming-a-branch)".
     *
     * The authenticated user must have push access to the branch. If the branch is the default branch, the authenticated user must also have admin or owner permissions.
     *
     * In order to rename the default branch, fine-grained access tokens also need the `administration:write` repository permission.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @param requestBody
     * @returns branch_with_protection Response
     * @throws ApiError
     */
    public static reposRenameBranch(
        owner: string,
        repo: string,
        branch: string,
        requestBody: {
            /**
             * The new name of the branch.
             */
            new_name: string;
        },
    ): CancelablePromise<branch_with_protection> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/branches/{branch}/rename',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
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
     * List CODEOWNERS errors
     * List any syntax errors that are detected in the CODEOWNERS
     * file.
     *
     * For more information about the correct CODEOWNERS syntax,
     * see "[About code owners](https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)."
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param ref A branch, tag or commit name used to determine which version of the CODEOWNERS file to use. Default: the repository's default branch (e.g. `main`)
     * @returns codeowners_errors Response
     * @throws ApiError
     */
    public static reposCodeownersErrors(
        owner: string,
        repo: string,
        ref?: string,
    ): CancelablePromise<codeowners_errors> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/codeowners/errors',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'ref': ref,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * List repository collaborators
     * For organization-owned repositories, the list of collaborators includes outside collaborators, organization members that are direct collaborators, organization members with access through team memberships, organization members with access through default organization permissions, and organization owners.
     * The `permissions` hash returned in the response contains the base role permissions of the collaborator. The `role_name` is the highest role assigned to the collaborator after considering all sources of grants, including: repo, teams, organization, and enterprise.
     * There is presently not a way to differentiate between an organization level grant and a repository level grant from this endpoint response.
     *
     * Team members will include the members of child teams.
     *
     * The authenticated user must have write, maintain, or admin privileges on the repository to use this endpoint. For organization-owned repositories, the authenticated user needs to be a member of the organization.
     * OAuth app tokens and personal access tokens (classic) need the `read:org` and `repo` scopes to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param affiliation Filter collaborators returned by their affiliation. `outside` means all outside collaborators of an organization-owned repository. `direct` means all collaborators with permissions to an organization-owned repository, regardless of organization membership status. `all` means all collaborators the authenticated user can see.
     * @param permission Filter collaborators by the permissions they have on the repository. If not specified, all collaborators will be returned.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns collaborator Response
     * @throws ApiError
     */
    public static reposListCollaborators(
        owner: string,
        repo: string,
        affiliation: 'outside' | 'direct' | 'all' = 'all',
        permission?: 'pull' | 'triage' | 'push' | 'maintain' | 'admin',
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<collaborator>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/collaborators',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'affiliation': affiliation,
                'permission': permission,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Check if a user is a repository collaborator
     * For organization-owned repositories, the list of collaborators includes outside collaborators, organization members that are direct collaborators, organization members with access through team memberships, organization members with access through default organization permissions, and organization owners.
     *
     * Team members will include the members of child teams.
     *
     * The authenticated user must have push access to the repository to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `read:org` and `repo` scopes to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @returns void
     * @throws ApiError
     */
    public static reposCheckCollaborator(
        owner: string,
        repo: string,
        username: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/collaborators/{username}',
            path: {
                'owner': owner,
                'repo': repo,
                'username': username,
            },
            errors: {
                404: `Not Found if user is not a collaborator`,
            },
        });
    }
    /**
     * Add a repository collaborator
     * Add a user to a repository with a specified level of access. If the repository is owned by an organization, this API does not add the user to the organization - a user that has repository access without being an organization member is called an "outside collaborator" (if they are not an Enterprise Managed User) or a "repository collaborator" if they are an Enterprise Managed User. These users are exempt from some organization policies - see "[Adding outside collaborators to repositories](https://docs.github.com/organizations/managing-user-access-to-your-organizations-repositories/managing-outside-collaborators/adding-outside-collaborators-to-repositories-in-your-organization)" to learn more about these collaborator types.
     *
     * This endpoint triggers [notifications](https://docs.github.com/github/managing-subscriptions-and-notifications-on-github/about-notifications).
     *
     * Adding an outside collaborator may be restricted by enterprise and organization administrators. For more information, see "[Enforcing repository management policies in your enterprise](https://docs.github.com/admin/policies/enforcing-policies-for-your-enterprise/enforcing-repository-management-policies-in-your-enterprise#enforcing-a-policy-for-inviting-outside-collaborators-to-repositories)" and "[Setting permissions for adding outside collaborators](https://docs.github.com/organizations/managing-organization-settings/setting-permissions-for-adding-outside-collaborators)" for organization settings.
     *
     * For more information on permission levels, see "[Repository permission levels for an organization](https://docs.github.com/github/setting-up-and-managing-organizations-and-teams/repository-permission-levels-for-an-organization#permission-levels-for-repositories-owned-by-an-organization)". There are restrictions on which permissions can be granted to organization members when an organization base role is in place. In this case, the role being given must be equal to or higher than the org base permission. Otherwise, the request will fail with:
     *
     * ```
     * Cannot assign {member} permission of {role name}
     * ```
     *
     * Note that, if you choose not to pass any parameters, you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP method](https://docs.github.com/rest/guides/getting-started-with-the-rest-api#http-method)."
     *
     * The invitee will receive a notification that they have been invited to the repository, which they must accept or decline. They may do this via the notifications page, the email they receive, or by using the [API](https://docs.github.com/rest/collaborators/invitations).
     *
     * For Enterprise Managed Users, this endpoint does not send invitations - these users are automatically added to organizations and repositories. Enterprise Managed Users can only be added to organizations and repositories within their enterprise.
     *
     * **Updating an existing collaborator's permission level**
     *
     * The endpoint can also be used to change the permissions of an existing collaborator without first removing and re-adding the collaborator. To change the permissions, use the same endpoint and pass a different `permission` parameter. The response will be a `204`, with no other indication that the permission level changed.
     *
     * **Rate limits**
     *
     * You are limited to sending 50 invitations to a repository per 24 hour period. Note there is no limit if you are inviting organization members to an organization repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @param requestBody
     * @returns repository_invitation Response when a new invitation is created
     * @throws ApiError
     */
    public static reposAddCollaborator(
        owner: string,
        repo: string,
        username: string,
        requestBody?: {
            /**
             * The permission to grant the collaborator. **Only valid on organization-owned repositories.** We accept the following permissions to be set: `pull`, `triage`, `push`, `maintain`, `admin` and you can also specify a custom repository role name, if the owning organization has defined any.
             */
            permission?: string;
        },
    ): CancelablePromise<repository_invitation> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/collaborators/{username}',
            path: {
                'owner': owner,
                'repo': repo,
                'username': username,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                422: `Response when:
                - validation failed, or the endpoint has been spammed
                - an Enterprise Managed User (EMU) account was invited to a repository in an enterprise with personal user accounts`,
            },
        });
    }
    /**
     * Remove a repository collaborator
     * Removes a collaborator from a repository.
     *
     * To use this endpoint, the authenticated user must either be an administrator of the repository or target themselves for removal.
     *
     * This endpoint also:
     * - Cancels any outstanding invitations sent by the collaborator
     * - Unassigns the user from any issues
     * - Removes access to organization projects if the user is not an organization member and is not a collaborator on any other organization repositories.
     * - Unstars the repository
     * - Updates access permissions to packages
     *
     * Removing a user as a collaborator has the following effects on forks:
     * - If the user had access to a fork through their membership to this repository, the user will also be removed from the fork.
     * - If the user had their own fork of the repository, the fork will be deleted.
     * - If the user still has read access to the repository, open pull requests by this user from a fork will be denied.
     *
     * > [!NOTE]
     * > A user can still have access to the repository through organization permissions like base repository permissions.
     *
     * Although the API responds immediately, the additional permission updates might take some extra time to complete in the background.
     *
     * For more information on fork permissions, see "[About permissions and visibility of forks](https://docs.github.com/pull-requests/collaborating-with-pull-requests/working-with-forks/about-permissions-and-visibility-of-forks)".
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @returns void
     * @throws ApiError
     */
    public static reposRemoveCollaborator(
        owner: string,
        repo: string,
        username: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/collaborators/{username}',
            path: {
                'owner': owner,
                'repo': repo,
                'username': username,
            },
            errors: {
                403: `Forbidden`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get repository permissions for a user
     * Checks the repository permission and role of a collaborator.
     *
     * The `permission` attribute provides the legacy base roles of `admin`, `write`, `read`, and `none`, where the
     * `maintain` role is mapped to `write` and the `triage` role is mapped to `read`.
     * The `role_name` attribute provides the name of the assigned role, including custom roles. The
     * `permission` can also be used to determine which base level of access the collaborator has to the repository.
     *
     * The calculated permissions are the highest role assigned to the collaborator after considering all sources of grants, including: repo, teams, organization, and enterprise.
     * There is presently not a way to differentiate between an organization level grant and a repository level grant from this endpoint response.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param username The handle for the GitHub user account.
     * @returns repository_collaborator_permission if user has admin permissions
     * @throws ApiError
     */
    public static reposGetCollaboratorPermissionLevel(
        owner: string,
        repo: string,
        username: string,
    ): CancelablePromise<repository_collaborator_permission> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/collaborators/{username}/permission',
            path: {
                'owner': owner,
                'repo': repo,
                'username': username,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * List commit comments for a repository
     * Lists the commit comments for a specified repository. Comments are ordered by ascending ID.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github-commitcomment.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github-commitcomment.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github-commitcomment.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github-commitcomment.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns commit_comment Response
     * @throws ApiError
     */
    public static reposListCommitCommentsForRepo(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<commit_comment>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/comments',
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
     * Get a commit comment
     * Gets a specified commit comment.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github-commitcomment.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github-commitcomment.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github-commitcomment.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github-commitcomment.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param commentId The unique identifier of the comment.
     * @returns commit_comment Response
     * @throws ApiError
     */
    public static reposGetCommitComment(
        owner: string,
        repo: string,
        commentId: number,
    ): CancelablePromise<commit_comment> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/comments/{comment_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'comment_id': commentId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Update a commit comment
     * Updates the contents of a specified commit comment.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github-commitcomment.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github-commitcomment.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github-commitcomment.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github-commitcomment.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param commentId The unique identifier of the comment.
     * @param requestBody
     * @returns commit_comment Response
     * @throws ApiError
     */
    public static reposUpdateCommitComment(
        owner: string,
        repo: string,
        commentId: number,
        requestBody: {
            /**
             * The contents of the comment
             */
            body: string;
        },
    ): CancelablePromise<commit_comment> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}/comments/{comment_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'comment_id': commentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Delete a commit comment
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param commentId The unique identifier of the comment.
     * @returns void
     * @throws ApiError
     */
    public static reposDeleteCommitComment(
        owner: string,
        repo: string,
        commentId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/comments/{comment_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'comment_id': commentId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * List commits
     * **Signature verification object**
     *
     * The response will include a `verification` object that describes the result of verifying the commit's signature. The following fields are included in the `verification` object:
     *
     * | Name | Type | Description |
     * | ---- | ---- | ----------- |
     * | `verified` | `boolean` | Indicates whether GitHub considers the signature in this commit to be verified. |
     * | `reason` | `string` | The reason for verified value. Possible values and their meanings are enumerated in table below. |
     * | `signature` | `string` | The signature that was extracted from the commit. |
     * | `payload` | `string` | The value that was signed. |
     * | `verified_at` | `string` | The date the signature was verified by GitHub. |
     *
     * These are the possible values for `reason` in the `verification` object:
     *
     * | Value | Description |
     * | ----- | ----------- |
     * | `expired_key` | The key that made the signature is expired. |
     * | `not_signing_key` | The "signing" flag is not among the usage flags in the GPG key that made the signature. |
     * | `gpgverify_error` | There was an error communicating with the signature verification service. |
     * | `gpgverify_unavailable` | The signature verification service is currently unavailable. |
     * | `unsigned` | The object does not include a signature. |
     * | `unknown_signature_type` | A non-PGP signature was found in the commit. |
     * | `no_user` | No user was associated with the `committer` email address in the commit. |
     * | `unverified_email` | The `committer` email address in the commit was associated with a user, but the email address is not verified on their account. |
     * | `bad_email` | The `committer` email address in the commit is not included in the identities of the PGP key that made the signature. |
     * | `unknown_key` | The key that made the signature has not been registered with any user's account. |
     * | `malformed_signature` | There was an error parsing the signature. |
     * | `invalid` | The signature could not be cryptographically verified using the key whose key-id was found in the signature. |
     * | `valid` | None of the above errors applied, so the signature is considered to be verified. |
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param sha SHA or branch to start listing commits from. Default: the repository’s default branch (usually `main`).
     * @param path Only commits containing this file path will be returned.
     * @param author GitHub username or email address to use to filter by commit author.
     * @param committer GitHub username or email address to use to filter by commit committer.
     * @param since Only show results that were last updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`. Due to limitations of Git, timestamps must be between 1970-01-01 and 2099-12-31 (inclusive) or unexpected results may be returned.
     * @param until Only commits before this date will be returned. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`. Due to limitations of Git, timestamps must be between 1970-01-01 and 2099-12-31 (inclusive) or unexpected results may be returned.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns commit Response
     * @throws ApiError
     */
    public static reposListCommits(
        owner: string,
        repo: string,
        sha?: string,
        path?: string,
        author?: string,
        committer?: string,
        since?: string,
        until?: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<commit>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/commits',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'sha': sha,
                'path': path,
                'author': author,
                'committer': committer,
                'since': since,
                'until': until,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                400: `Bad Request`,
                404: `Resource not found`,
                409: `Conflict`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * List branches for HEAD commit
     * Protected branches are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Returns all branches where the given commit SHA is the HEAD, or latest commit for the branch.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param commitSha The SHA of the commit.
     * @returns branch_short Response
     * @throws ApiError
     */
    public static reposListBranchesForHeadCommit(
        owner: string,
        repo: string,
        commitSha: string,
    ): CancelablePromise<Array<branch_short>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head',
            path: {
                'owner': owner,
                'repo': repo,
                'commit_sha': commitSha,
            },
            errors: {
                409: `Conflict`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List commit comments
     * Lists the comments for a specified commit.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github-commitcomment.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github-commitcomment.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github-commitcomment.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github-commitcomment.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param commitSha The SHA of the commit.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns commit_comment Response
     * @throws ApiError
     */
    public static reposListCommentsForCommit(
        owner: string,
        repo: string,
        commitSha: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<commit_comment>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/commits/{commit_sha}/comments',
            path: {
                'owner': owner,
                'repo': repo,
                'commit_sha': commitSha,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Create a commit comment
     * Create a comment for a commit using its `:commit_sha`.
     *
     * This endpoint triggers [notifications](https://docs.github.com/github/managing-subscriptions-and-notifications-on-github/about-notifications). Creating content too quickly using this endpoint may result in secondary rate limiting. For more information, see "[Rate limits for the API](https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api#about-secondary-rate-limits)" and "[Best practices for using the REST API](https://docs.github.com/rest/guides/best-practices-for-using-the-rest-api)."
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github-commitcomment.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github-commitcomment.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github-commitcomment.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github-commitcomment.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param commitSha The SHA of the commit.
     * @param requestBody
     * @returns commit_comment Response
     * @throws ApiError
     */
    public static reposCreateCommitComment(
        owner: string,
        repo: string,
        commitSha: string,
        requestBody: {
            /**
             * The contents of the comment.
             */
            body: string;
            /**
             * Relative path of the file to comment on.
             */
            path?: string;
            /**
             * Line index in the diff to comment on.
             */
            position?: number;
            /**
             * **Closing down notice**. Use **position** parameter instead. Line number in the file to comment on.
             */
            line?: number;
        },
    ): CancelablePromise<commit_comment> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/commits/{commit_sha}/comments',
            path: {
                'owner': owner,
                'repo': repo,
                'commit_sha': commitSha,
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
     * List pull requests associated with a commit
     * Lists the merged pull request that introduced the commit to the repository. If the commit is not present in the default branch, it will return merged and open pull requests associated with the commit.
     *
     * To list the open or merged pull requests associated with a branch, you can set the `commit_sha` parameter to the branch name.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param commitSha The SHA of the commit.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns pull_request_simple Response
     * @throws ApiError
     */
    public static reposListPullRequestsAssociatedWithCommit(
        owner: string,
        repo: string,
        commitSha: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<pull_request_simple>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/commits/{commit_sha}/pulls',
            path: {
                'owner': owner,
                'repo': repo,
                'commit_sha': commitSha,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                409: `Conflict`,
            },
        });
    }
    /**
     * Get a commit
     * Returns the contents of a single commit reference. You must have `read` access for the repository to use this endpoint.
     *
     * > [!NOTE]
     * > If there are more than 300 files in the commit diff and the default JSON media type is requested, the response will include pagination link headers for the remaining files, up to a limit of 3000 files. Each page contains the static commit information, and the only changes are to the file listing.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)." Pagination query parameters are not supported for these media types.
     *
     * - **`application/vnd.github.diff`**: Returns the diff of the commit. Larger diffs may time out and return a 5xx status code.
     * - **`application/vnd.github.patch`**: Returns the patch of the commit. Diffs with binary data will have no `patch` property. Larger diffs may time out and return a 5xx status code.
     * - **`application/vnd.github.sha`**: Returns the commit's SHA-1 hash. You can use this endpoint to check if a remote reference's SHA-1 hash is the same as your local reference's SHA-1 hash by providing the local SHA-1 reference as the ETag.
     *
     * **Signature verification object**
     *
     * The response will include a `verification` object that describes the result of verifying the commit's signature. The following fields are included in the `verification` object:
     *
     * | Name | Type | Description |
     * | ---- | ---- | ----------- |
     * | `verified` | `boolean` | Indicates whether GitHub considers the signature in this commit to be verified. |
     * | `reason` | `string` | The reason for verified value. Possible values and their meanings are enumerated in table below. |
     * | `signature` | `string` | The signature that was extracted from the commit. |
     * | `payload` | `string` | The value that was signed. |
     * | `verified_at` | `string` | The date the signature was verified by GitHub. |
     *
     * These are the possible values for `reason` in the `verification` object:
     *
     * | Value | Description |
     * | ----- | ----------- |
     * | `expired_key` | The key that made the signature is expired. |
     * | `not_signing_key` | The "signing" flag is not among the usage flags in the GPG key that made the signature. |
     * | `gpgverify_error` | There was an error communicating with the signature verification service. |
     * | `gpgverify_unavailable` | The signature verification service is currently unavailable. |
     * | `unsigned` | The object does not include a signature. |
     * | `unknown_signature_type` | A non-PGP signature was found in the commit. |
     * | `no_user` | No user was associated with the `committer` email address in the commit. |
     * | `unverified_email` | The `committer` email address in the commit was associated with a user, but the email address is not verified on their account. |
     * | `bad_email` | The `committer` email address in the commit is not included in the identities of the PGP key that made the signature. |
     * | `unknown_key` | The key that made the signature has not been registered with any user's account. |
     * | `malformed_signature` | There was an error parsing the signature. |
     * | `invalid` | The signature could not be cryptographically verified using the key whose key-id was found in the signature. |
     * | `valid` | None of the above errors applied, so the signature is considered to be verified. |
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param ref The commit reference. Can be a commit SHA, branch name (`heads/BRANCH_NAME`), or tag name (`tags/TAG_NAME`). For more information, see "[Git References](https://git-scm.com/book/en/v2/Git-Internals-Git-References)" in the Git documentation.
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns commit Response
     * @throws ApiError
     */
    public static reposGetCommit(
        owner: string,
        repo: string,
        ref: string,
        page: number = 1,
        perPage: number = 30,
    ): CancelablePromise<commit> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/commits/{ref}',
            path: {
                'owner': owner,
                'repo': repo,
                'ref': ref,
            },
            query: {
                'page': page,
                'per_page': perPage,
            },
            errors: {
                404: `Resource not found`,
                409: `Conflict`,
                422: `Validation failed, or the endpoint has been spammed.`,
                500: `Internal Error`,
                503: `Service unavailable`,
            },
        });
    }
    /**
     * Get the combined status for a specific reference
     * Users with pull access in a repository can access a combined view of commit statuses for a given ref. The ref can be a SHA, a branch name, or a tag name.
     *
     *
     * Additionally, a combined `state` is returned. The `state` is one of:
     *
     * *   **failure** if any of the contexts report as `error` or `failure`
     * *   **pending** if there are no statuses or a context is `pending`
     * *   **success** if the latest status for all contexts is `success`
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param ref The commit reference. Can be a commit SHA, branch name (`heads/BRANCH_NAME`), or tag name (`tags/TAG_NAME`). For more information, see "[Git References](https://git-scm.com/book/en/v2/Git-Internals-Git-References)" in the Git documentation.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns combined_commit_status Response
     * @throws ApiError
     */
    public static reposGetCombinedStatusForRef(
        owner: string,
        repo: string,
        ref: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<combined_commit_status> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/commits/{ref}/status',
            path: {
                'owner': owner,
                'repo': repo,
                'ref': ref,
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
     * List commit statuses for a reference
     * Users with pull access in a repository can view commit statuses for a given ref. The ref can be a SHA, a branch name, or a tag name. Statuses are returned in reverse chronological order. The first status in the list will be the latest one.
     *
     * This resource is also available via a legacy route: `GET /repos/:owner/:repo/statuses/:ref`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param ref The commit reference. Can be a commit SHA, branch name (`heads/BRANCH_NAME`), or tag name (`tags/TAG_NAME`). For more information, see "[Git References](https://git-scm.com/book/en/v2/Git-Internals-Git-References)" in the Git documentation.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns status Response
     * @throws ApiError
     */
    public static reposListCommitStatusesForRef(
        owner: string,
        repo: string,
        ref: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<status>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/commits/{ref}/statuses',
            path: {
                'owner': owner,
                'repo': repo,
                'ref': ref,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                301: `Moved permanently`,
            },
        });
    }
    /**
     * Get community profile metrics
     * Returns all community profile metrics for a repository. The repository cannot be a fork.
     *
     * The returned metrics include an overall health score, the repository description, the presence of documentation, the
     * detected code of conduct, the detected license, and the presence of ISSUE\_TEMPLATE, PULL\_REQUEST\_TEMPLATE,
     * README, and CONTRIBUTING files.
     *
     * The `health_percentage` score is defined as a percentage of how many of
     * the recommended community health files are present. For more information, see
     * "[About community profiles for public repositories](https://docs.github.com/communities/setting-up-your-project-for-healthy-contributions/about-community-profiles-for-public-repositories)."
     *
     * `content_reports_enabled` is only returned for organization-owned repositories.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns community_profile Response
     * @throws ApiError
     */
    public static reposGetCommunityProfileMetrics(
        owner: string,
        repo: string,
    ): CancelablePromise<community_profile> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/community/profile',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Compare two commits
     * Compares two commits against one another. You can compare refs (branches or tags) and commit SHAs in the same repository, or you can compare refs and commit SHAs that exist in different repositories within the same repository network, including fork branches. For more information about how to view a repository's network, see "[Understanding connections between repositories](https://docs.github.com/repositories/viewing-activity-and-data-for-your-repository/understanding-connections-between-repositories)."
     *
     * This endpoint is equivalent to running the `git log BASE..HEAD` command, but it returns commits in a different order. The `git log BASE..HEAD` command returns commits in reverse chronological order, whereas the API returns commits in chronological order.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.diff`**: Returns the diff of the commit.
     * - **`application/vnd.github.patch`**: Returns the patch of the commit. Diffs with binary data will have no `patch` property.
     *
     * The API response includes details about the files that were changed between the two commits. This includes the status of the change (if a file was added, removed, modified, or renamed), and details of the change itself. For example, files with a `renamed` status have a `previous_filename` field showing the previous filename of the file, and files with a `modified` status have a `patch` field showing the changes made to the file.
     *
     * When calling this endpoint without any paging parameter (`per_page` or `page`), the returned list is limited to 250 commits, and the last commit in the list is the most recent of the entire comparison.
     *
     * **Working with large comparisons**
     *
     * To process a response with a large number of commits, use a query parameter (`per_page` or `page`) to paginate the results. When using pagination:
     *
     * - The list of changed files is only shown on the first page of results, and it includes up to 300 changed files for the entire comparison.
     * - The results are returned in chronological order, but the last commit in the returned list may not be the most recent one in the entire set if there are more pages of results.
     *
     * For more information on working with pagination, see "[Using pagination in the REST API](https://docs.github.com/rest/guides/using-pagination-in-the-rest-api)."
     *
     * **Signature verification object**
     *
     * The response will include a `verification` object that describes the result of verifying the commit's signature. The `verification` object includes the following fields:
     *
     * | Name | Type | Description |
     * | ---- | ---- | ----------- |
     * | `verified` | `boolean` | Indicates whether GitHub considers the signature in this commit to be verified. |
     * | `reason` | `string` | The reason for verified value. Possible values and their meanings are enumerated in table below. |
     * | `signature` | `string` | The signature that was extracted from the commit. |
     * | `payload` | `string` | The value that was signed. |
     * | `verified_at` | `string` | The date the signature was verified by GitHub. |
     *
     * These are the possible values for `reason` in the `verification` object:
     *
     * | Value | Description |
     * | ----- | ----------- |
     * | `expired_key` | The key that made the signature is expired. |
     * | `not_signing_key` | The "signing" flag is not among the usage flags in the GPG key that made the signature. |
     * | `gpgverify_error` | There was an error communicating with the signature verification service. |
     * | `gpgverify_unavailable` | The signature verification service is currently unavailable. |
     * | `unsigned` | The object does not include a signature. |
     * | `unknown_signature_type` | A non-PGP signature was found in the commit. |
     * | `no_user` | No user was associated with the `committer` email address in the commit. |
     * | `unverified_email` | The `committer` email address in the commit was associated with a user, but the email address is not verified on their account. |
     * | `bad_email` | The `committer` email address in the commit is not included in the identities of the PGP key that made the signature. |
     * | `unknown_key` | The key that made the signature has not been registered with any user's account. |
     * | `malformed_signature` | There was an error parsing the signature. |
     * | `invalid` | The signature could not be cryptographically verified using the key whose key-id was found in the signature. |
     * | `valid` | None of the above errors applied, so the signature is considered to be verified. |
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param basehead The base branch and head branch to compare. This parameter expects the format `BASE...HEAD`. Both must be branch names in `repo`. To compare with a branch that exists in a different repository in the same network as `repo`, the `basehead` parameter expects the format `USERNAME:BASE...USERNAME:HEAD`.
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns commit_comparison Response
     * @throws ApiError
     */
    public static reposCompareCommits(
        owner: string,
        repo: string,
        basehead: string,
        page: number = 1,
        perPage: number = 30,
    ): CancelablePromise<commit_comparison> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/compare/{basehead}',
            path: {
                'owner': owner,
                'repo': repo,
                'basehead': basehead,
            },
            query: {
                'page': page,
                'per_page': perPage,
            },
            errors: {
                404: `Resource not found`,
                500: `Internal Error`,
                503: `Service unavailable`,
            },
        });
    }
    /**
     * Get repository content
     * Gets the contents of a file or directory in a repository. Specify the file path or directory with the `path` parameter. If you omit the `path` parameter, you will receive the contents of the repository's root directory.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw file contents for files and symlinks.
     * - **`application/vnd.github.html+json`**: Returns the file contents in HTML. Markup languages are rendered to HTML using GitHub's open-source [Markup library](https://github.com/github/markup).
     * - **`application/vnd.github.object+json`**: Returns the contents in a consistent object format regardless of the content type. For example, instead of an array of objects for a directory, the response will be an object with an `entries` attribute containing the array of objects.
     *
     * If the content is a directory, the response will be an array of objects, one object for each item in the directory. When listing the contents of a directory, submodules have their "type" specified as "file". Logically, the value _should_ be "submodule". This behavior exists [for backwards compatibility purposes](https://git.io/v1YCW). In the next major version of the API, the type will be returned as "submodule".
     *
     * If the content is a symlink and the symlink's target is a normal file in the repository, then the API responds with the content of the file. Otherwise, the API responds with an object describing the symlink itself.
     *
     * If the content is a submodule, the `submodule_git_url` field identifies the location of the submodule repository, and the `sha` identifies a specific commit within the submodule repository. Git uses the given URL when cloning the submodule repository, and checks out the submodule at that specific commit. If the submodule repository is not hosted on github.com, the Git URLs (`git_url` and `_links["git"]`) and the github.com URLs (`html_url` and `_links["html"]`) will have null values.
     *
     * **Notes**:
     *
     * - To get a repository's contents recursively, you can [recursively get the tree](https://docs.github.com/rest/git/trees#get-a-tree).
     * - This API has an upper limit of 1,000 files for a directory. If you need to retrieve
     * more files, use the [Git Trees API](https://docs.github.com/rest/git/trees#get-a-tree).
     * - Download URLs expire and are meant to be used just once. To ensure the download URL does not expire, please use the contents API to obtain a fresh download URL for each download.
     * - If the requested file's size is:
     * - 1 MB or smaller: All features of this endpoint are supported.
     * - Between 1-100 MB: Only the `raw` or `object` custom media types are supported. Both will work as normal, except that when using the `object` media type, the `content` field will be an empty
     * string and the `encoding` field will be `"none"`. To get the contents of these larger files, use the `raw` media type.
     * - Greater than 100 MB: This endpoint is not supported.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param path path parameter
     * @param ref The name of the commit/branch/tag. Default: the repository’s default branch.
     * @returns any Response
     * @throws ApiError
     */
    public static reposGetContent(
        owner: string,
        repo: string,
        path: string,
        ref?: string,
    ): CancelablePromise<(content_directory | content_file | content_symlink | content_submodule)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/contents/{path}',
            path: {
                'owner': owner,
                'repo': repo,
                'path': path,
            },
            query: {
                'ref': ref,
            },
            errors: {
                302: `Found`,
                304: `Not modified`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Create or update file contents
     * Creates a new file or replaces an existing file in a repository.
     *
     * > [!NOTE]
     * > If you use this endpoint and the "[Delete a file](https://docs.github.com/rest/repos/contents/#delete-a-file)" endpoint in parallel, the concurrent requests will conflict and you will receive errors. You must use these endpoints serially instead.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint. The `workflow` scope is also required in order to modify files in the `.github/workflows` directory.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param path path parameter
     * @param requestBody
     * @returns file_commit Response
     * @throws ApiError
     */
    public static reposCreateOrUpdateFileContents(
        owner: string,
        repo: string,
        path: string,
        requestBody: {
            /**
             * The commit message.
             */
            message: string;
            /**
             * The new file content, using Base64 encoding.
             */
            content: string;
            /**
             * **Required if you are updating a file**. The blob SHA of the file being replaced.
             */
            sha?: string;
            /**
             * The branch name. Default: the repository’s default branch.
             */
            branch?: string;
            /**
             * The person that committed the file. Default: the authenticated user.
             */
            committer?: {
                /**
                 * The name of the author or committer of the commit. You'll receive a `422` status code if `name` is omitted.
                 */
                name: string;
                /**
                 * The email of the author or committer of the commit. You'll receive a `422` status code if `email` is omitted.
                 */
                email: string;
                date?: string;
            };
            /**
             * The author of the file. Default: The `committer` or the authenticated user if you omit `committer`.
             */
            author?: {
                /**
                 * The name of the author or committer of the commit. You'll receive a `422` status code if `name` is omitted.
                 */
                name: string;
                /**
                 * The email of the author or committer of the commit. You'll receive a `422` status code if `email` is omitted.
                 */
                email: string;
                date?: string;
            };
        },
    ): CancelablePromise<file_commit> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/contents/{path}',
            path: {
                'owner': owner,
                'repo': repo,
                'path': path,
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
     * Delete a file
     * Deletes a file in a repository.
     *
     * You can provide an additional `committer` parameter, which is an object containing information about the committer. Or, you can provide an `author` parameter, which is an object containing information about the author.
     *
     * The `author` section is optional and is filled in with the `committer` information if omitted. If the `committer` information is omitted, the authenticated user's information is used.
     *
     * You must provide values for both `name` and `email`, whether you choose to use `author` or `committer`. Otherwise, you'll receive a `422` status code.
     *
     * > [!NOTE]
     * > If you use this endpoint and the "[Create or update file contents](https://docs.github.com/rest/repos/contents/#create-or-update-file-contents)" endpoint in parallel, the concurrent requests will conflict and you will receive errors. You must use these endpoints serially instead.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param path path parameter
     * @param requestBody
     * @returns file_commit Response
     * @throws ApiError
     */
    public static reposDeleteFile(
        owner: string,
        repo: string,
        path: string,
        requestBody: {
            /**
             * The commit message.
             */
            message: string;
            /**
             * The blob SHA of the file being deleted.
             */
            sha: string;
            /**
             * The branch name. Default: the repository’s default branch
             */
            branch?: string;
            /**
             * object containing information about the committer.
             */
            committer?: {
                /**
                 * The name of the author (or committer) of the commit
                 */
                name?: string;
                /**
                 * The email of the author (or committer) of the commit
                 */
                email?: string;
            };
            /**
             * object containing information about the author.
             */
            author?: {
                /**
                 * The name of the author (or committer) of the commit
                 */
                name?: string;
                /**
                 * The email of the author (or committer) of the commit
                 */
                email?: string;
            };
        },
    ): CancelablePromise<file_commit> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/contents/{path}',
            path: {
                'owner': owner,
                'repo': repo,
                'path': path,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
                409: `Conflict`,
                422: `Validation failed, or the endpoint has been spammed.`,
                503: `Service unavailable`,
            },
        });
    }
    /**
     * List repository contributors
     * Lists contributors to the specified repository and sorts them by the number of commits per contributor in descending order. This endpoint may return information that is a few hours old because the GitHub REST API caches contributor data to improve performance.
     *
     * GitHub identifies contributors by author email address. This endpoint groups contribution counts by GitHub user, which includes all associated email addresses. To improve performance, only the first 500 author email addresses in the repository link to GitHub users. The rest will appear as anonymous contributors without associated GitHub user information.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param anon Set to `1` or `true` to include anonymous contributors in results.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns contributor If repository contains content
     * @throws ApiError
     */
    public static reposListContributors(
        owner: string,
        repo: string,
        anon?: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<contributor>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/contributors',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'anon': anon,
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
     * List deployments
     * Simple filtering of deployments is available via query parameters:
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param sha The SHA recorded at creation time.
     * @param ref The name of the ref. This can be a branch, tag, or SHA.
     * @param task The name of the task for the deployment (e.g., `deploy` or `deploy:migrations`).
     * @param environment The name of the environment that was deployed to (e.g., `staging` or `production`).
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns deployment Response
     * @throws ApiError
     */
    public static reposListDeployments(
        owner: string,
        repo: string,
        sha: string = 'none',
        ref: string = 'none',
        task: string = 'none',
        environment: string | null = 'none',
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<deployment>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/deployments',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'sha': sha,
                'ref': ref,
                'task': task,
                'environment': environment,
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Create a deployment
     * Deployments offer a few configurable parameters with certain defaults.
     *
     * The `ref` parameter can be any named branch, tag, or SHA. At GitHub we often deploy branches and verify them
     * before we merge a pull request.
     *
     * The `environment` parameter allows deployments to be issued to different runtime environments. Teams often have
     * multiple environments for verifying their applications, such as `production`, `staging`, and `qa`. This parameter
     * makes it easier to track which environments have requested deployments. The default environment is `production`.
     *
     * The `auto_merge` parameter is used to ensure that the requested ref is not behind the repository's default branch. If
     * the ref _is_ behind the default branch for the repository, we will attempt to merge it for you. If the merge succeeds,
     * the API will return a successful merge commit. If merge conflicts prevent the merge from succeeding, the API will
     * return a failure response.
     *
     * By default, [commit statuses](https://docs.github.com/rest/commits/statuses) for every submitted context must be in a `success`
     * state. The `required_contexts` parameter allows you to specify a subset of contexts that must be `success`, or to
     * specify contexts that have not yet been submitted. You are not required to use commit statuses to deploy. If you do
     * not require any contexts or create any commit statuses, the deployment will always succeed.
     *
     * The `payload` parameter is available for any extra information that a deployment system might need. It is a JSON text
     * field that will be passed on when a deployment event is dispatched.
     *
     * The `task` parameter is used by the deployment system to allow different execution paths. In the web world this might
     * be `deploy:migrations` to run schema changes on the system. In the compiled world this could be a flag to compile an
     * application with debugging enabled.
     *
     * Merged branch response:
     *
     * You will see this response when GitHub automatically merges the base branch into the topic branch instead of creating
     * a deployment. This auto-merge happens when:
     * *   Auto-merge option is enabled in the repository
     * *   Topic branch does not include the latest changes on the base branch, which is `master` in the response example
     * *   There are no merge conflicts
     *
     * If there are no new commits in the base branch, a new request to create a deployment should give a successful
     * response.
     *
     * Merge conflict response:
     *
     * This error happens when the `auto_merge` option is enabled and when the default branch (in this case `master`), can't
     * be merged into the branch that's being deployed (in this case `topic-branch`), due to merge conflicts.
     *
     * Failed commit status checks:
     *
     * This error happens when the `required_contexts` parameter indicates that one or more contexts need to have a `success`
     * status for the commit to be deployed, but one or more of the required contexts do not have a state of `success`.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` or `repo_deployment` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns deployment Response
     * @returns any Merged branch response
     * @throws ApiError
     */
    public static reposCreateDeployment(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * The ref to deploy. This can be a branch, tag, or SHA.
             */
            ref: string;
            /**
             * Specifies a task to execute (e.g., `deploy` or `deploy:migrations`).
             */
            task?: string;
            /**
             * Attempts to automatically merge the default branch into the requested ref, if it's behind the default branch.
             */
            auto_merge?: boolean;
            /**
             * The [status](https://docs.github.com/rest/commits/statuses) contexts to verify against commit status checks. If you omit this parameter, GitHub verifies all unique contexts before creating a deployment. To bypass checking entirely, pass an empty array. Defaults to all unique contexts.
             */
            required_contexts?: Array<string>;
            payload?: (Record<string, any> | string);
            /**
             * Name for the target deployment environment (e.g., `production`, `staging`, `qa`).
             */
            environment?: string;
            /**
             * Short description of the deployment.
             */
            description?: string | null;
            /**
             * Specifies if the given environment is specific to the deployment and will no longer exist at some point in the future. Default: `false`
             */
            transient_environment?: boolean;
            /**
             * Specifies if the given environment is one that end-users directly interact with. Default: `true` when `environment` is `production` and `false` otherwise.
             */
            production_environment?: boolean;
        },
    ): CancelablePromise<deployment | {
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/deployments',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Conflict when there is a merge conflict or the commit's status checks failed`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get a deployment
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param deploymentId deployment_id parameter
     * @returns deployment Response
     * @throws ApiError
     */
    public static reposGetDeployment(
        owner: string,
        repo: string,
        deploymentId: number,
    ): CancelablePromise<deployment> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/deployments/{deployment_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'deployment_id': deploymentId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Delete a deployment
     * If the repository only has one deployment, you can delete the deployment regardless of its status. If the repository has more than one deployment, you can only delete inactive deployments. This ensures that repositories with multiple deployments will always have an active deployment.
     *
     * To set a deployment as inactive, you must:
     *
     * *   Create a new deployment that is active so that the system has a record of the current state, then delete the previously active deployment.
     * *   Mark the active deployment as inactive by adding any non-successful deployment status.
     *
     * For more information, see "[Create a deployment](https://docs.github.com/rest/deployments/deployments/#create-a-deployment)" and "[Create a deployment status](https://docs.github.com/rest/deployments/statuses#create-a-deployment-status)."
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` or `repo_deployment` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param deploymentId deployment_id parameter
     * @returns void
     * @throws ApiError
     */
    public static reposDeleteDeployment(
        owner: string,
        repo: string,
        deploymentId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/deployments/{deployment_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'deployment_id': deploymentId,
            },
            errors: {
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List deployment statuses
     * Users with pull access can view deployment statuses for a deployment:
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param deploymentId deployment_id parameter
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns deployment_status Response
     * @throws ApiError
     */
    public static reposListDeploymentStatuses(
        owner: string,
        repo: string,
        deploymentId: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<deployment_status>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/deployments/{deployment_id}/statuses',
            path: {
                'owner': owner,
                'repo': repo,
                'deployment_id': deploymentId,
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
     * Create a deployment status
     * Users with `push` access can create deployment statuses for a given deployment.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo_deployment` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param deploymentId deployment_id parameter
     * @param requestBody
     * @returns deployment_status Response
     * @throws ApiError
     */
    public static reposCreateDeploymentStatus(
        owner: string,
        repo: string,
        deploymentId: number,
        requestBody: {
            /**
             * The state of the status. When you set a transient deployment to `inactive`, the deployment will be shown as `destroyed` in GitHub.
             */
            state: 'error' | 'failure' | 'inactive' | 'in_progress' | 'queued' | 'pending' | 'success';
            /**
             * The target URL to associate with this status. This URL should contain output to keep the user updated while the task is running or serve as historical information for what happened in the deployment.
             *
             * > [!NOTE]
             * > It's recommended to use the `log_url` parameter, which replaces `target_url`.
             */
            target_url?: string;
            /**
             * The full URL of the deployment's output. This parameter replaces `target_url`. We will continue to accept `target_url` to support legacy uses, but we recommend replacing `target_url` with `log_url`. Setting `log_url` will automatically set `target_url` to the same value. Default: `""`
             */
            log_url?: string;
            /**
             * A short description of the status. The maximum description length is 140 characters.
             */
            description?: string;
            /**
             * Name for the target deployment environment, which can be changed when setting a deploy status. For example, `production`, `staging`, or `qa`. If not defined, the environment of the previous status on the deployment will be used, if it exists. Otherwise, the environment of the deployment will be used.
             */
            environment?: string;
            /**
             * Sets the URL for accessing your environment. Default: `""`
             */
            environment_url?: string;
            /**
             * Adds a new `inactive` status to all prior non-transient, non-production environment deployments with the same repository and `environment` name as the created status's deployment. An `inactive` status is only added to deployments that had a `success` state. Default: `true`
             */
            auto_inactive?: boolean;
        },
    ): CancelablePromise<deployment_status> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/deployments/{deployment_id}/statuses',
            path: {
                'owner': owner,
                'repo': repo,
                'deployment_id': deploymentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get a deployment status
     * Users with pull access can view a deployment status for a deployment:
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param deploymentId deployment_id parameter
     * @param statusId
     * @returns deployment_status Response
     * @throws ApiError
     */
    public static reposGetDeploymentStatus(
        owner: string,
        repo: string,
        deploymentId: number,
        statusId: number,
    ): CancelablePromise<deployment_status> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'deployment_id': deploymentId,
                'status_id': statusId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Create a repository dispatch event
     * You can use this endpoint to trigger a webhook event called `repository_dispatch` when you want activity that happens outside of GitHub to trigger a GitHub Actions workflow or GitHub App webhook. You must configure your GitHub Actions workflow or GitHub App to run when the `repository_dispatch` event occurs. For an example `repository_dispatch` webhook payload, see "[RepositoryDispatchEvent](https://docs.github.com/webhooks/event-payloads/#repository_dispatch)."
     *
     * The `client_payload` parameter is available for any extra information that your workflow might need. This parameter is a JSON payload that will be passed on when the webhook event is dispatched. For example, the `client_payload` can include a message that a user would like to send using a GitHub Actions workflow. Or the `client_payload` can be used as a test to debug your workflow.
     *
     * This input example shows how you can use the `client_payload` as a test to debug your workflow.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static reposCreateDispatchEvent(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * A custom webhook event name. Must be 100 characters or fewer.
             */
            event_type: string;
            /**
             * JSON payload with extra information about the webhook event that your action or workflow may use. The maximum number of top-level properties is 10. The total size of the JSON payload must be less than 64KB.
             */
            client_payload?: Record<string, any>;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/dispatches',
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
     * List environments
     * Lists the environments for a repository.
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
    public static reposGetAllEnvironments(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        /**
         * The number of environments in this repository
         */
        total_count?: number;
        environments?: Array<environment>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/environments',
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
     * Get an environment
     * > [!NOTE]
     * > To get information about name patterns that branches must match in order to deploy to this environment, see "[Get a deployment branch policy](/rest/deployments/branch-policies#get-a-deployment-branch-policy)."
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @returns environment Response
     * @throws ApiError
     */
    public static reposGetEnvironment(
        owner: string,
        repo: string,
        environmentName: string,
    ): CancelablePromise<environment> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/environments/{environment_name}',
            path: {
                'owner': owner,
                'repo': repo,
                'environment_name': environmentName,
            },
        });
    }
    /**
     * Create or update an environment
     * Create or update an environment with protection rules, such as required reviewers. For more information about environment protection rules, see "[Environments](/actions/reference/environments#environment-protection-rules)."
     *
     * > [!NOTE]
     * > To create or update name patterns that branches must match in order to deploy to this environment, see "[Deployment branch policies](/rest/deployments/branch-policies)."
     *
     * > [!NOTE]
     * > To create or update secrets for an environment, see "[GitHub Actions secrets](/rest/actions/secrets)."
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param requestBody
     * @returns environment Response
     * @throws ApiError
     */
    public static reposCreateOrUpdateEnvironment(
        owner: string,
        repo: string,
        environmentName: string,
        requestBody?: {
            wait_timer?: wait_timer;
            prevent_self_review?: prevent_self_review;
            /**
             * The people or teams that may review jobs that reference the environment. You can list up to six users or teams as reviewers. The reviewers must have at least read access to the repository. Only one of the required reviewers needs to approve the job for it to proceed.
             */
            reviewers?: Array<{
                type?: deployment_reviewer_type;
                /**
                 * The id of the user or team who can review the deployment
                 */
                id?: number;
            }> | null;
            deployment_branch_policy?: deployment_branch_policy_settings;
        } | null,
    ): CancelablePromise<environment> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/environments/{environment_name}',
            path: {
                'owner': owner,
                'repo': repo,
                'environment_name': environmentName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation error when the environment name is invalid or when \`protected_branches\` and \`custom_branch_policies\` in \`deployment_branch_policy\` are set to the same value`,
            },
        });
    }
    /**
     * Delete an environment
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @returns void
     * @throws ApiError
     */
    public static reposDeleteAnEnvironment(
        owner: string,
        repo: string,
        environmentName: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/environments/{environment_name}',
            path: {
                'owner': owner,
                'repo': repo,
                'environment_name': environmentName,
            },
        });
    }
    /**
     * List deployment branch policies
     * Lists the deployment branch policies for an environment.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static reposListDeploymentBranchPolicies(
        owner: string,
        repo: string,
        environmentName: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        /**
         * The number of deployment branch policies for the environment.
         */
        total_count: number;
        branch_policies: Array<deployment_branch_policy>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies',
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
     * Create a deployment branch policy
     * Creates a deployment branch or tag policy for an environment.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param requestBody
     * @returns deployment_branch_policy Response
     * @throws ApiError
     */
    public static reposCreateDeploymentBranchPolicy(
        owner: string,
        repo: string,
        environmentName: string,
        requestBody: deployment_branch_policy_name_pattern_with_type,
    ): CancelablePromise<deployment_branch_policy> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies',
            path: {
                'owner': owner,
                'repo': repo,
                'environment_name': environmentName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                303: `Response if the same branch name pattern already exists`,
                404: `Not Found or \`deployment_branch_policy.custom_branch_policies\` property for the environment is set to false`,
            },
        });
    }
    /**
     * Get a deployment branch policy
     * Gets a deployment branch or tag policy for an environment.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param branchPolicyId The unique identifier of the branch policy.
     * @returns deployment_branch_policy Response
     * @throws ApiError
     */
    public static reposGetDeploymentBranchPolicy(
        owner: string,
        repo: string,
        environmentName: string,
        branchPolicyId: number,
    ): CancelablePromise<deployment_branch_policy> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'environment_name': environmentName,
                'branch_policy_id': branchPolicyId,
            },
        });
    }
    /**
     * Update a deployment branch policy
     * Updates a deployment branch or tag policy for an environment.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param branchPolicyId The unique identifier of the branch policy.
     * @param requestBody
     * @returns deployment_branch_policy Response
     * @throws ApiError
     */
    public static reposUpdateDeploymentBranchPolicy(
        owner: string,
        repo: string,
        environmentName: string,
        branchPolicyId: number,
        requestBody: deployment_branch_policy_name_pattern,
    ): CancelablePromise<deployment_branch_policy> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'environment_name': environmentName,
                'branch_policy_id': branchPolicyId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a deployment branch policy
     * Deletes a deployment branch or tag policy for an environment.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param branchPolicyId The unique identifier of the branch policy.
     * @returns void
     * @throws ApiError
     */
    public static reposDeleteDeploymentBranchPolicy(
        owner: string,
        repo: string,
        environmentName: string,
        branchPolicyId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'environment_name': environmentName,
                'branch_policy_id': branchPolicyId,
            },
        });
    }
    /**
     * Get all deployment protection rules for an environment
     * Gets all custom deployment protection rules that are enabled for an environment. Anyone with read access to the repository can use this endpoint. For more information about environments, see "[Using environments for deployment](https://docs.github.com/actions/deployment/targeting-different-environments/using-environments-for-deployment)."
     *
     * For more information about the app that is providing this custom deployment rule, see the [documentation for the `GET /apps/{app_slug}` endpoint](https://docs.github.com/rest/apps/apps#get-an-app).
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @returns any List of deployment protection rules
     * @throws ApiError
     */
    public static reposGetAllDeploymentProtectionRules(
        environmentName: string,
        repo: string,
        owner: string,
    ): CancelablePromise<{
        /**
         * The number of enabled custom deployment protection rules for this environment
         */
        total_count?: number;
        custom_deployment_protection_rules?: Array<deployment_protection_rule>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules',
            path: {
                'environment_name': environmentName,
                'repo': repo,
                'owner': owner,
            },
        });
    }
    /**
     * Create a custom deployment protection rule on an environment
     * Enable a custom deployment protection rule for an environment.
     *
     * The authenticated user must have admin or owner permissions to the repository to use this endpoint.
     *
     * For more information about the app that is providing this custom deployment rule, see the [documentation for the `GET /apps/{app_slug}` endpoint](https://docs.github.com/rest/apps/apps#get-an-app), as well as the [guide to creating custom deployment protection rules](https://docs.github.com/actions/managing-workflow-runs-and-deployments/managing-deployments/creating-custom-deployment-protection-rules).
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param requestBody
     * @returns deployment_protection_rule The enabled custom deployment protection rule
     * @throws ApiError
     */
    public static reposCreateDeploymentProtectionRule(
        environmentName: string,
        repo: string,
        owner: string,
        requestBody: {
            /**
             * The ID of the custom app that will be enabled on the environment.
             */
            integration_id?: number;
        },
    ): CancelablePromise<deployment_protection_rule> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules',
            path: {
                'environment_name': environmentName,
                'repo': repo,
                'owner': owner,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List custom deployment rule integrations available for an environment
     * Gets all custom deployment protection rule integrations that are available for an environment.
     *
     * The authenticated user must have admin or owner permissions to the repository to use this endpoint.
     *
     * For more information about environments, see "[Using environments for deployment](https://docs.github.com/actions/deployment/targeting-different-environments/using-environments-for-deployment)."
     *
     * For more information about the app that is providing this custom deployment rule, see "[GET an app](https://docs.github.com/rest/apps/apps#get-an-app)".
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any A list of custom deployment rule integrations available for this environment.
     * @throws ApiError
     */
    public static reposListCustomDeploymentRuleIntegrations(
        environmentName: string,
        repo: string,
        owner: string,
        page: number = 1,
        perPage: number = 30,
    ): CancelablePromise<{
        /**
         * The total number of custom deployment protection rule integrations available for this environment.
         */
        total_count?: number;
        available_custom_deployment_protection_rule_integrations?: Array<custom_deployment_rule_app>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps',
            path: {
                'environment_name': environmentName,
                'repo': repo,
                'owner': owner,
            },
            query: {
                'page': page,
                'per_page': perPage,
            },
        });
    }
    /**
     * Get a custom deployment protection rule
     * Gets an enabled custom deployment protection rule for an environment. Anyone with read access to the repository can use this endpoint. For more information about environments, see "[Using environments for deployment](https://docs.github.com/actions/deployment/targeting-different-environments/using-environments-for-deployment)."
     *
     * For more information about the app that is providing this custom deployment rule, see [`GET /apps/{app_slug}`](https://docs.github.com/rest/apps/apps#get-an-app).
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param protectionRuleId The unique identifier of the protection rule.
     * @returns deployment_protection_rule Response
     * @throws ApiError
     */
    public static reposGetCustomDeploymentProtectionRule(
        owner: string,
        repo: string,
        environmentName: string,
        protectionRuleId: number,
    ): CancelablePromise<deployment_protection_rule> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'environment_name': environmentName,
                'protection_rule_id': protectionRuleId,
            },
        });
    }
    /**
     * Disable a custom protection rule for an environment
     * Disables a custom deployment protection rule for an environment.
     *
     * The authenticated user must have admin or owner permissions to the repository to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param environmentName The name of the environment. The name must be URL encoded. For example, any slashes in the name must be replaced with `%2F`.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param protectionRuleId The unique identifier of the protection rule.
     * @returns void
     * @throws ApiError
     */
    public static reposDisableDeploymentProtectionRule(
        environmentName: string,
        repo: string,
        owner: string,
        protectionRuleId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}',
            path: {
                'environment_name': environmentName,
                'repo': repo,
                'owner': owner,
                'protection_rule_id': protectionRuleId,
            },
        });
    }
    /**
     * List forks
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param sort The sort order. `stargazers` will sort by star count.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns minimal_repository Response
     * @throws ApiError
     */
    public static reposListForks(
        owner: string,
        repo: string,
        sort: 'newest' | 'oldest' | 'stargazers' | 'watchers' = 'newest',
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<minimal_repository>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/forks',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'sort': sort,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Create a fork
     * Create a fork for the authenticated user.
     *
     * > [!NOTE]
     * > Forking a Repository happens asynchronously. You may have to wait a short period of time before you can access the git objects. If this takes longer than 5 minutes, be sure to contact [GitHub Support](https://support.github.com/contact?tags=dotcom-rest-api).
     *
     * > [!NOTE]
     * > Although this endpoint works with GitHub Apps, the GitHub App must be installed on the destination account with access to all repositories and on the source account with access to the source repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns full_repository Response
     * @throws ApiError
     */
    public static reposCreateFork(
        owner: string,
        repo: string,
        requestBody?: {
            /**
             * Optional parameter to specify the organization name if forking into an organization.
             */
            organization?: string;
            /**
             * When forking from an existing repository, a new name for the fork.
             */
            name?: string;
            /**
             * When forking from an existing repository, fork with only the default branch.
             */
            default_branch_only?: boolean;
        } | null,
    ): CancelablePromise<full_repository> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/forks',
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
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List repository webhooks
     * Lists webhooks for a repository. `last response` may return null if there have not been any deliveries within 30 days.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns hook Response
     * @throws ApiError
     */
    public static reposListWebhooks(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<hook>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/hooks',
            path: {
                'owner': owner,
                'repo': repo,
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
     * Create a repository webhook
     * Repositories can have multiple webhooks installed. Each webhook should have a unique `config`. Multiple webhooks can
     * share the same `config` as long as those webhooks do not have any `events` that overlap.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns hook Response
     * @throws ApiError
     */
    public static reposCreateWebhook(
        owner: string,
        repo: string,
        requestBody?: {
            /**
             * Use `web` to create a webhook. Default: `web`. This parameter only accepts the value `web`.
             */
            name?: string;
            /**
             * Key/value pairs to provide settings for this webhook.
             */
            config?: {
                url?: webhook_config_url;
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
        } | null,
    ): CancelablePromise<hook> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/hooks',
            path: {
                'owner': owner,
                'repo': repo,
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
     * Get a repository webhook
     * Returns a webhook configured in a repository. To get only the webhook `config` properties, see "[Get a webhook configuration for a repository](/rest/webhooks/repo-config#get-a-webhook-configuration-for-a-repository)."
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @returns hook Response
     * @throws ApiError
     */
    public static reposGetWebhook(
        owner: string,
        repo: string,
        hookId: number,
    ): CancelablePromise<hook> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/hooks/{hook_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'hook_id': hookId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Update a repository webhook
     * Updates a webhook configured in a repository. If you previously had a `secret` set, you must provide the same `secret` or set a new `secret` or the secret will be removed. If you are only updating individual webhook `config` properties, use "[Update a webhook configuration for a repository](/rest/webhooks/repo-config#update-a-webhook-configuration-for-a-repository)."
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @param requestBody
     * @returns hook Response
     * @throws ApiError
     */
    public static reposUpdateWebhook(
        owner: string,
        repo: string,
        hookId: number,
        requestBody: {
            config?: webhook_config;
            /**
             * Determines what [events](https://docs.github.com/webhooks/event-payloads) the hook is triggered for. This replaces the entire array of events.
             */
            events?: Array<string>;
            /**
             * Determines a list of events to be added to the list of events that the Hook triggers for.
             */
            add_events?: Array<string>;
            /**
             * Determines a list of events to be removed from the list of events that the Hook triggers for.
             */
            remove_events?: Array<string>;
            /**
             * Determines if notifications are sent when the webhook is triggered. Set to `true` to send notifications.
             */
            active?: boolean;
        },
    ): CancelablePromise<hook> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}/hooks/{hook_id}',
            path: {
                'owner': owner,
                'repo': repo,
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
     * Delete a repository webhook
     * Delete a webhook for an organization.
     *
     * The authenticated user must be a repository owner, or have admin access in the repository, to delete the webhook.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @returns void
     * @throws ApiError
     */
    public static reposDeleteWebhook(
        owner: string,
        repo: string,
        hookId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/hooks/{hook_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'hook_id': hookId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get a webhook configuration for a repository
     * Returns the webhook configuration for a repository. To get more information about the webhook, including the `active` state and `events`, use "[Get a repository webhook](/rest/webhooks/repos#get-a-repository-webhook)."
     *
     * OAuth app tokens and personal access tokens (classic) need the `read:repo_hook` or `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @returns webhook_config Response
     * @throws ApiError
     */
    public static reposGetWebhookConfigForRepo(
        owner: string,
        repo: string,
        hookId: number,
    ): CancelablePromise<webhook_config> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/hooks/{hook_id}/config',
            path: {
                'owner': owner,
                'repo': repo,
                'hook_id': hookId,
            },
        });
    }
    /**
     * Update a webhook configuration for a repository
     * Updates the webhook configuration for a repository. To update more information about the webhook, including the `active` state and `events`, use "[Update a repository webhook](/rest/webhooks/repos#update-a-repository-webhook)."
     *
     * OAuth app tokens and personal access tokens (classic) need the `write:repo_hook` or `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @param requestBody
     * @returns webhook_config Response
     * @throws ApiError
     */
    public static reposUpdateWebhookConfigForRepo(
        owner: string,
        repo: string,
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
            url: '/repos/{owner}/{repo}/hooks/{hook_id}/config',
            path: {
                'owner': owner,
                'repo': repo,
                'hook_id': hookId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List deliveries for a repository webhook
     * Returns a list of webhook deliveries for a webhook configured in a repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param cursor Used for pagination: the starting delivery from which the page of deliveries is fetched. Refer to the `link` header for the next and previous page cursors.
     * @returns hook_delivery_item Response
     * @throws ApiError
     */
    public static reposListWebhookDeliveries(
        owner: string,
        repo: string,
        hookId: number,
        perPage: number = 30,
        cursor?: string,
    ): CancelablePromise<Array<hook_delivery_item>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/hooks/{hook_id}/deliveries',
            path: {
                'owner': owner,
                'repo': repo,
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
     * Get a delivery for a repository webhook
     * Returns a delivery for a webhook configured in a repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @param deliveryId
     * @returns hook_delivery Response
     * @throws ApiError
     */
    public static reposGetWebhookDelivery(
        owner: string,
        repo: string,
        hookId: number,
        deliveryId: number,
    ): CancelablePromise<hook_delivery> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}',
            path: {
                'owner': owner,
                'repo': repo,
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
     * Redeliver a delivery for a repository webhook
     * Redeliver a webhook delivery for a webhook configured in a repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @param deliveryId
     * @returns any Accepted
     * @throws ApiError
     */
    public static reposRedeliverWebhookDelivery(
        owner: string,
        repo: string,
        hookId: number,
        deliveryId: number,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts',
            path: {
                'owner': owner,
                'repo': repo,
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
     * Ping a repository webhook
     * This will trigger a [ping event](https://docs.github.com/webhooks/#ping-event) to be sent to the hook.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @returns void
     * @throws ApiError
     */
    public static reposPingWebhook(
        owner: string,
        repo: string,
        hookId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/hooks/{hook_id}/pings',
            path: {
                'owner': owner,
                'repo': repo,
                'hook_id': hookId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Test the push repository webhook
     * This will trigger the hook with the latest push to the current repository if the hook is subscribed to `push` events. If the hook is not subscribed to `push` events, the server will respond with 204 but no test POST will be generated.
     *
     * > [!NOTE]
     * > Previously `/repos/:owner/:repo/hooks/:hook_id/test`
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param hookId The unique identifier of the hook. You can find this value in the `X-GitHub-Hook-ID` header of a webhook delivery.
     * @returns void
     * @throws ApiError
     */
    public static reposTestPushWebhook(
        owner: string,
        repo: string,
        hookId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/hooks/{hook_id}/tests',
            path: {
                'owner': owner,
                'repo': repo,
                'hook_id': hookId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Check if immutable releases are enabled for a repository
     * Shows whether immutable releases are enabled or disabled. Also identifies whether immutability is being
     * enforced by the repository owner.  The authenticated user must have admin read access to the repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns check_immutable_releases Response if immutable releases are enabled
     * @throws ApiError
     */
    public static reposCheckImmutableReleases(
        owner: string,
        repo: string,
    ): CancelablePromise<check_immutable_releases> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/immutable-releases',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                404: `Not Found if immutable releases are not enabled for the repository`,
            },
        });
    }
    /**
     * Enable immutable releases
     * Enables immutable releases for a repository. The authenticated user must have admin access to the repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns void
     * @throws ApiError
     */
    public static reposEnableImmutableReleases(
        owner: string,
        repo: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/immutable-releases',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                409: `Conflict`,
            },
        });
    }
    /**
     * Disable immutable releases
     * Disables immutable releases for a repository. The authenticated user must have admin access to the repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns void
     * @throws ApiError
     */
    public static reposDisableImmutableReleases(
        owner: string,
        repo: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/immutable-releases',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                409: `Conflict`,
            },
        });
    }
    /**
     * List repository invitations
     * When authenticating as a user with admin rights to a repository, this endpoint will list all currently open repository invitations.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns repository_invitation Response
     * @throws ApiError
     */
    public static reposListInvitations(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<repository_invitation>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/invitations',
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
     * Update a repository invitation
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param invitationId The unique identifier of the invitation.
     * @param requestBody
     * @returns repository_invitation Response
     * @throws ApiError
     */
    public static reposUpdateInvitation(
        owner: string,
        repo: string,
        invitationId: number,
        requestBody?: {
            /**
             * The permissions that the associated user will have on the repository. Valid values are `read`, `write`, `maintain`, `triage`, and `admin`.
             */
            permissions?: 'read' | 'write' | 'maintain' | 'triage' | 'admin';
        },
    ): CancelablePromise<repository_invitation> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}/invitations/{invitation_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'invitation_id': invitationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a repository invitation
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param invitationId The unique identifier of the invitation.
     * @returns void
     * @throws ApiError
     */
    public static reposDeleteInvitation(
        owner: string,
        repo: string,
        invitationId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/invitations/{invitation_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'invitation_id': invitationId,
            },
        });
    }
    /**
     * List deploy keys
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns deploy_key Response
     * @throws ApiError
     */
    public static reposListDeployKeys(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<deploy_key>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/keys',
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
     * Create a deploy key
     * You can create a read-only deploy key.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns deploy_key Response
     * @throws ApiError
     */
    public static reposCreateDeployKey(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * A name for the key.
             */
            title?: string;
            /**
             * The contents of the key.
             */
            key: string;
            /**
             * If `true`, the key will only be able to read repository contents. Otherwise, the key will be able to read and write.
             *
             * Deploy keys with write access can perform the same actions as an organization member with admin access, or a collaborator on a personal repository. For more information, see "[Repository permission levels for an organization](https://docs.github.com/articles/repository-permission-levels-for-an-organization/)" and "[Permission levels for a user account repository](https://docs.github.com/articles/permission-levels-for-a-user-account-repository/)."
             */
            read_only?: boolean;
        },
    ): CancelablePromise<deploy_key> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/keys',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get a deploy key
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param keyId The unique identifier of the key.
     * @returns deploy_key Response
     * @throws ApiError
     */
    public static reposGetDeployKey(
        owner: string,
        repo: string,
        keyId: number,
    ): CancelablePromise<deploy_key> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/keys/{key_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'key_id': keyId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Delete a deploy key
     * Deploy keys are immutable. If you need to update a key, remove the key and create a new one instead.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param keyId The unique identifier of the key.
     * @returns void
     * @throws ApiError
     */
    public static reposDeleteDeployKey(
        owner: string,
        repo: string,
        keyId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/keys/{key_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'key_id': keyId,
            },
        });
    }
    /**
     * List repository languages
     * Lists languages for the specified repository. The value shown for each language is the number of bytes of code written in that language.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns language Response
     * @throws ApiError
     */
    public static reposListLanguages(
        owner: string,
        repo: string,
    ): CancelablePromise<language> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/languages',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Sync a fork branch with the upstream repository
     * Sync a branch of a forked repository to keep it up-to-date with the upstream repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns merged_upstream The branch has been successfully synced with the upstream repository
     * @throws ApiError
     */
    public static reposMergeUpstream(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * The name of the branch which should be updated to match upstream.
             */
            branch: string;
        },
    ): CancelablePromise<merged_upstream> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/merge-upstream',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `The branch could not be synced because of a merge conflict`,
                422: `The branch could not be synced for some other reason`,
            },
        });
    }
    /**
     * Merge a branch
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns commit Successful Response (The resulting merge commit)
     * @throws ApiError
     */
    public static reposMerge(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * The name of the base branch that the head will be merged into.
             */
            base: string;
            /**
             * The head to merge. This can be a branch name or a commit SHA1.
             */
            head: string;
            /**
             * Commit message to use for the merge commit. If omitted, a default message will be used.
             */
            commit_message?: string;
        },
    ): CancelablePromise<commit> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/merges',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `Not Found when the base or head does not exist`,
                409: `Conflict when there is a merge conflict`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get a GitHub Pages site
     * Gets information about a GitHub Pages site.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns page Response
     * @throws ApiError
     */
    public static reposGetPages(
        owner: string,
        repo: string,
    ): CancelablePromise<page> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/pages',
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
     * Create a GitHub Pages site
     * Configures a GitHub Pages site. For more information, see "[About GitHub Pages](/github/working-with-github-pages/about-github-pages)."
     *
     * The authenticated user must be a repository administrator, maintainer, or have the 'manage GitHub Pages settings' permission.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns page Response
     * @throws ApiError
     */
    public static reposCreatePagesSite(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * The process in which the Page will be built. Possible values are `"legacy"` and `"workflow"`.
             */
            build_type?: 'legacy' | 'workflow';
            /**
             * The source branch and directory used to publish your Pages site.
             */
            source?: {
                /**
                 * The repository branch used to publish your site's source files.
                 */
                branch: string;
                /**
                 * The repository directory that includes the source files for the Pages site. Allowed paths are `/` or `/docs`. Default: `/`
                 */
                path?: '/' | '/docs';
            };
        } | null,
    ): CancelablePromise<page> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/pages',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Conflict`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Update information about a GitHub Pages site
     * Updates information for a GitHub Pages site. For more information, see "[About GitHub Pages](/github/working-with-github-pages/about-github-pages).
     *
     * The authenticated user must be a repository administrator, maintainer, or have the 'manage GitHub Pages settings' permission.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static reposUpdateInformationAboutPagesSite(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * Specify a custom domain for the repository. Sending a `null` value will remove the custom domain. For more about custom domains, see "[Using a custom domain with GitHub Pages](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)."
             */
            cname?: string | null;
            /**
             * Specify whether HTTPS should be enforced for the repository.
             */
            https_enforced?: boolean;
            /**
             * The process by which the GitHub Pages site will be built. `workflow` means that the site is built by a custom GitHub Actions workflow. `legacy` means that the site is built by GitHub when changes are pushed to a specific branch.
             */
            build_type?: 'legacy' | 'workflow';
            source?: ('gh-pages' | 'master' | 'master /docs' | {
                /**
                 * The repository branch used to publish your site's source files.
                 */
                branch: string;
                /**
                 * The repository directory that includes the source files for the Pages site. Allowed paths are `/` or `/docs`.
                 */
                path: '/' | '/docs';
            });
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/pages',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                409: `Conflict`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Delete a GitHub Pages site
     * Deletes a GitHub Pages site. For more information, see "[About GitHub Pages](/github/working-with-github-pages/about-github-pages).
     *
     * The authenticated user must be a repository administrator, maintainer, or have the 'manage GitHub Pages settings' permission.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns void
     * @throws ApiError
     */
    public static reposDeletePagesSite(
        owner: string,
        repo: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/pages',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                404: `Resource not found`,
                409: `Conflict`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List GitHub Pages builds
     * Lists builts of a GitHub Pages site.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns page_build Response
     * @throws ApiError
     */
    public static reposListPagesBuilds(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<page_build>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/pages/builds',
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
     * Request a GitHub Pages build
     * You can request that your site be built from the latest revision on the default branch. This has the same effect as pushing a commit to your default branch, but does not require an additional commit. Manually triggering page builds can be helpful when diagnosing build warnings and failures.
     *
     * Build requests are limited to one concurrent build per repository and one concurrent build per requester. If you request a build while another is still in progress, the second request will be queued until the first completes.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns page_build_status Response
     * @throws ApiError
     */
    public static reposRequestPagesBuild(
        owner: string,
        repo: string,
    ): CancelablePromise<page_build_status> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/pages/builds',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Get latest Pages build
     * Gets information about the single most recent build of a GitHub Pages site.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns page_build Response
     * @throws ApiError
     */
    public static reposGetLatestPagesBuild(
        owner: string,
        repo: string,
    ): CancelablePromise<page_build> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/pages/builds/latest',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Get GitHub Pages build
     * Gets information about a GitHub Pages build.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param buildId
     * @returns page_build Response
     * @throws ApiError
     */
    public static reposGetPagesBuild(
        owner: string,
        repo: string,
        buildId: number,
    ): CancelablePromise<page_build> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/pages/builds/{build_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'build_id': buildId,
            },
        });
    }
    /**
     * Create a GitHub Pages deployment
     * Create a GitHub Pages deployment for a repository.
     *
     * The authenticated user must have write permission to the repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns page_deployment Response
     * @throws ApiError
     */
    public static reposCreatePagesDeployment(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * The ID of an artifact that contains the .zip or .tar of static assets to deploy. The artifact belongs to the repository. Either `artifact_id` or `artifact_url` are required.
             */
            artifact_id?: number;
            /**
             * The URL of an artifact that contains the .zip or .tar of static assets to deploy. The artifact belongs to the repository. Either `artifact_id` or `artifact_url` are required.
             */
            artifact_url?: string;
            /**
             * The target environment for this GitHub Pages deployment.
             */
            environment?: string;
            /**
             * A unique string that represents the version of the build for this deployment.
             */
            pages_build_version: string;
            /**
             * The OIDC token issued by GitHub Actions certifying the origin of the deployment.
             */
            oidc_token: string;
        },
    ): CancelablePromise<page_deployment> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/pages/deployments',
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
     * Get the status of a GitHub Pages deployment
     * Gets the current status of a GitHub Pages deployment.
     *
     * The authenticated user must have read permission for the GitHub Pages site.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param pagesDeploymentId The ID of the Pages deployment. You can also give the commit SHA of the deployment.
     * @returns pages_deployment_status Response
     * @throws ApiError
     */
    public static reposGetPagesDeployment(
        owner: string,
        repo: string,
        pagesDeploymentId: (number | string),
    ): CancelablePromise<pages_deployment_status> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'pages_deployment_id': pagesDeploymentId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Cancel a GitHub Pages deployment
     * Cancels a GitHub Pages deployment.
     *
     * The authenticated user must have write permissions for the GitHub Pages site.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param pagesDeploymentId The ID of the Pages deployment. You can also give the commit SHA of the deployment.
     * @returns void
     * @throws ApiError
     */
    public static reposCancelPagesDeployment(
        owner: string,
        repo: string,
        pagesDeploymentId: (number | string),
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}/cancel',
            path: {
                'owner': owner,
                'repo': repo,
                'pages_deployment_id': pagesDeploymentId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get a DNS health check for GitHub Pages
     * Gets a health check of the DNS settings for the `CNAME` record configured for a repository's GitHub Pages.
     *
     * The first request to this endpoint returns a `202 Accepted` status and starts an asynchronous background task to get the results for the domain. After the background task completes, subsequent requests to this endpoint return a `200 OK` status with the health check results in the response.
     *
     * The authenticated user must be a repository administrator, maintainer, or have the 'manage GitHub Pages settings' permission to use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns pages_health_check Response
     * @returns empty_object Empty response
     * @throws ApiError
     */
    public static reposGetPagesHealthCheck(
        owner: string,
        repo: string,
    ): CancelablePromise<pages_health_check | empty_object> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/pages/health',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                400: `Custom domains are not available for GitHub Pages`,
                404: `Resource not found`,
                422: `There isn't a CNAME for this page`,
            },
        });
    }
    /**
     * Check if private vulnerability reporting is enabled for a repository
     * Returns a boolean indicating whether or not private vulnerability reporting is enabled for the repository. For more information, see "[Evaluating the security settings of a repository](https://docs.github.com/code-security/security-advisories/working-with-repository-security-advisories/evaluating-the-security-settings-of-a-repository)".
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns any Private vulnerability reporting status
     * @throws ApiError
     */
    public static reposCheckPrivateVulnerabilityReporting(
        owner: string,
        repo: string,
    ): CancelablePromise<{
        /**
         * Whether or not private vulnerability reporting is enabled for the repository.
         */
        enabled: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/private-vulnerability-reporting',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                422: `Bad Request`,
            },
        });
    }
    /**
     * Enable private vulnerability reporting for a repository
     * Enables private vulnerability reporting for a repository. The authenticated user must have admin access to the repository. For more information, see "[Privately reporting a security vulnerability](https://docs.github.com/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability)."
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns void
     * @throws ApiError
     */
    public static reposEnablePrivateVulnerabilityReporting(
        owner: string,
        repo: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/private-vulnerability-reporting',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                422: `Bad Request`,
            },
        });
    }
    /**
     * Disable private vulnerability reporting for a repository
     * Disables private vulnerability reporting for a repository. The authenticated user must have admin access to the repository. For more information, see "[Privately reporting a security vulnerability](https://docs.github.com/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability)".
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns void
     * @throws ApiError
     */
    public static reposDisablePrivateVulnerabilityReporting(
        owner: string,
        repo: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/private-vulnerability-reporting',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                422: `Bad Request`,
            },
        });
    }
    /**
     * Get all custom property values for a repository
     * Gets all custom property values that are set for a repository.
     * Users with read access to the repository can use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns custom_property_value Response
     * @throws ApiError
     */
    public static reposCustomPropertiesForReposGetRepositoryValues(
        owner: string,
        repo: string,
    ): CancelablePromise<Array<custom_property_value>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/properties/values',
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
     * Create or update custom property values for a repository
     * Create new or update existing custom property values for a repository.
     * Using a value of `null` for a custom property will remove or 'unset' the property value from the repository.
     *
     * Repository admins and other users with the repository-level "edit custom property values" fine-grained permission can use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static reposCustomPropertiesForReposCreateOrUpdateRepositoryValues(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * A list of custom property names and associated values to apply to the repositories.
             */
            properties: Array<custom_property_value>;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}/properties/values',
            path: {
                'owner': owner,
                'repo': repo,
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
     * Get a repository README
     * Gets the preferred README for a repository.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw file contents. This is the default if you do not specify a media type.
     * - **`application/vnd.github.html+json`**: Returns the README in HTML. Markup languages are rendered to HTML using GitHub's open-source [Markup library](https://github.com/github/markup).
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param ref The name of the commit/branch/tag. Default: the repository’s default branch.
     * @returns content_file Response
     * @throws ApiError
     */
    public static reposGetReadme(
        owner: string,
        repo: string,
        ref?: string,
    ): CancelablePromise<content_file> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/readme',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'ref': ref,
            },
            errors: {
                304: `Not modified`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get a repository README for a directory
     * Gets the README from a repository directory.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw file contents. This is the default if you do not specify a media type.
     * - **`application/vnd.github.html+json`**: Returns the README in HTML. Markup languages are rendered to HTML using GitHub's open-source [Markup library](https://github.com/github/markup).
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param dir The alternate path to look for a README file
     * @param ref The name of the commit/branch/tag. Default: the repository’s default branch.
     * @returns content_file Response
     * @throws ApiError
     */
    public static reposGetReadmeInDirectory(
        owner: string,
        repo: string,
        dir: string,
        ref?: string,
    ): CancelablePromise<content_file> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/readme/{dir}',
            path: {
                'owner': owner,
                'repo': repo,
                'dir': dir,
            },
            query: {
                'ref': ref,
            },
            errors: {
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List releases
     * This returns a list of releases, which does not include regular Git tags that have not been associated with a release. To get a list of Git tags, use the [Repository Tags API](https://docs.github.com/rest/repos/repos#list-repository-tags).
     *
     * Information about published releases are available to everyone. Only users with push access will receive listings for draft releases.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns release Response
     * @throws ApiError
     */
    public static reposListReleases(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<release>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/releases',
            path: {
                'owner': owner,
                'repo': repo,
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
     * Create a release
     * Users with push access to the repository can create a release.
     *
     * This endpoint triggers [notifications](https://docs.github.com/github/managing-subscriptions-and-notifications-on-github/about-notifications). Creating content too quickly using this endpoint may result in secondary rate limiting. For more information, see "[Rate limits for the API](https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api#about-secondary-rate-limits)" and "[Best practices for using the REST API](https://docs.github.com/rest/guides/best-practices-for-using-the-rest-api)."
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns release Response
     * @throws ApiError
     */
    public static reposCreateRelease(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * The name of the tag.
             */
            tag_name: string;
            /**
             * Specifies the commitish value that determines where the Git tag is created from. Can be any branch or commit SHA. Unused if the Git tag already exists. Default: the repository's default branch.
             */
            target_commitish?: string;
            /**
             * The name of the release.
             */
            name?: string;
            /**
             * Text describing the contents of the tag.
             */
            body?: string;
            /**
             * `true` to create a draft (unpublished) release, `false` to create a published one.
             */
            draft?: boolean;
            /**
             * `true` to identify the release as a prerelease. `false` to identify the release as a full release.
             */
            prerelease?: boolean;
            /**
             * If specified, a discussion of the specified category is created and linked to the release. The value must be a category that already exists in the repository. For more information, see "[Managing categories for discussions in your repository](https://docs.github.com/discussions/managing-discussions-for-your-community/managing-categories-for-discussions-in-your-repository)."
             */
            discussion_category_name?: string;
            /**
             * Whether to automatically generate the name and body for this release. If `name` is specified, the specified name will be used; otherwise, a name will be automatically generated. If `body` is specified, the body will be pre-pended to the automatically generated notes.
             */
            generate_release_notes?: boolean;
            /**
             * Specifies whether this release should be set as the latest release for the repository. Drafts and prereleases cannot be set as latest. Defaults to `true` for newly published releases. `legacy` specifies that the latest release should be determined based on the release creation date and higher semantic version.
             */
            make_latest?: 'true' | 'false' | 'legacy';
        },
    ): CancelablePromise<release> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/releases',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not Found if the discussion category name is invalid`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get a release asset
     * To download the asset's binary content:
     *
     * - If within a browser, fetch the location specified in the `browser_download_url` key provided in the response.
     * - Alternatively, set the `Accept` header of the request to
     * [`application/octet-stream`](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types).
     * The API will either redirect the client to the location, or stream it directly if possible.
     * API clients should handle both a `200` or `302` response.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param assetId The unique identifier of the asset.
     * @returns release_asset Response
     * @throws ApiError
     */
    public static reposGetReleaseAsset(
        owner: string,
        repo: string,
        assetId: number,
    ): CancelablePromise<release_asset> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/releases/assets/{asset_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'asset_id': assetId,
            },
            errors: {
                302: `Found`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Update a release asset
     * Users with push access to the repository can edit a release asset.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param assetId The unique identifier of the asset.
     * @param requestBody
     * @returns release_asset Response
     * @throws ApiError
     */
    public static reposUpdateReleaseAsset(
        owner: string,
        repo: string,
        assetId: number,
        requestBody?: {
            /**
             * The file name of the asset.
             */
            name?: string;
            /**
             * An alternate short description of the asset. Used in place of the filename.
             */
            label?: string;
            state?: string;
        },
    ): CancelablePromise<release_asset> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}/releases/assets/{asset_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'asset_id': assetId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a release asset
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param assetId The unique identifier of the asset.
     * @returns void
     * @throws ApiError
     */
    public static reposDeleteReleaseAsset(
        owner: string,
        repo: string,
        assetId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/releases/assets/{asset_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'asset_id': assetId,
            },
        });
    }
    /**
     * Generate release notes content for a release
     * Generate a name and body describing a [release](https://docs.github.com/rest/releases/releases#get-a-release). The body content will be markdown formatted and contain information like the changes since last release and users who contributed. The generated release notes are not saved anywhere. They are intended to be generated and used when creating a new release.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns release_notes_content Name and body of generated release notes
     * @throws ApiError
     */
    public static reposGenerateReleaseNotes(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * The tag name for the release. This can be an existing tag or a new one.
             */
            tag_name: string;
            /**
             * Specifies the commitish value that will be the target for the release's tag. Required if the supplied tag_name does not reference an existing tag. Ignored if the tag_name already exists.
             */
            target_commitish?: string;
            /**
             * The name of the previous tag to use as the starting point for the release notes. Use to manually specify the range for the set of changes considered as part this release.
             */
            previous_tag_name?: string;
            /**
             * Specifies a path to a file in the repository containing configuration settings used for generating the release notes. If unspecified, the configuration file located in the repository at '.github/release.yml' or '.github/release.yaml' will be used. If that is not present, the default configuration will be used.
             */
            configuration_file_path?: string;
        },
    ): CancelablePromise<release_notes_content> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/releases/generate-notes',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get the latest release
     * View the latest published full release for the repository.
     *
     * The latest release is the most recent non-prerelease, non-draft release, sorted by the `created_at` attribute. The `created_at` attribute is the date of the commit used for the release, and not the date when the release was drafted or published.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns release Response
     * @throws ApiError
     */
    public static reposGetLatestRelease(
        owner: string,
        repo: string,
    ): CancelablePromise<release> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/releases/latest',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Get a release by tag name
     * Get a published release with the specified tag.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param tag tag parameter
     * @returns release Response
     * @throws ApiError
     */
    public static reposGetReleaseByTag(
        owner: string,
        repo: string,
        tag: string,
    ): CancelablePromise<release> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/releases/tags/{tag}',
            path: {
                'owner': owner,
                'repo': repo,
                'tag': tag,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get a release
     * Gets a public release with the specified release ID.
     *
     * > [!NOTE]
     * > This returns an `upload_url` key corresponding to the endpoint for uploading release assets. This key is a hypermedia resource. For more information, see "[Getting started with the REST API](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#hypermedia)."
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param releaseId The unique identifier of the release.
     * @returns release **Note:** This returns an `upload_url` key corresponding to the endpoint for uploading release assets. This key is a hypermedia resource. For more information, see "[Getting started with the REST API](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#hypermedia)."
     * @throws ApiError
     */
    public static reposGetRelease(
        owner: string,
        repo: string,
        releaseId: number,
    ): CancelablePromise<release> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/releases/{release_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'release_id': releaseId,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Update a release
     * Users with push access to the repository can edit a release.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param releaseId The unique identifier of the release.
     * @param requestBody
     * @returns release Response
     * @throws ApiError
     */
    public static reposUpdateRelease(
        owner: string,
        repo: string,
        releaseId: number,
        requestBody?: {
            /**
             * The name of the tag.
             */
            tag_name?: string;
            /**
             * Specifies the commitish value that determines where the Git tag is created from. Can be any branch or commit SHA. Unused if the Git tag already exists. Default: the repository's default branch.
             */
            target_commitish?: string;
            /**
             * The name of the release.
             */
            name?: string;
            /**
             * Text describing the contents of the tag.
             */
            body?: string;
            /**
             * `true` makes the release a draft, and `false` publishes the release.
             */
            draft?: boolean;
            /**
             * `true` to identify the release as a prerelease, `false` to identify the release as a full release.
             */
            prerelease?: boolean;
            /**
             * Specifies whether this release should be set as the latest release for the repository. Drafts and prereleases cannot be set as latest. Defaults to `true` for newly published releases. `legacy` specifies that the latest release should be determined based on the release creation date and higher semantic version.
             */
            make_latest?: 'true' | 'false' | 'legacy';
            /**
             * If specified, a discussion of the specified category is created and linked to the release. The value must be a category that already exists in the repository. If there is already a discussion linked to the release, this parameter is ignored. For more information, see "[Managing categories for discussions in your repository](https://docs.github.com/discussions/managing-discussions-for-your-community/managing-categories-for-discussions-in-your-repository)."
             */
            discussion_category_name?: string;
        },
    ): CancelablePromise<release> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}/releases/{release_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'release_id': releaseId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not Found if the discussion category name is invalid`,
            },
        });
    }
    /**
     * Delete a release
     * Users with push access to the repository can delete a release.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param releaseId The unique identifier of the release.
     * @returns void
     * @throws ApiError
     */
    public static reposDeleteRelease(
        owner: string,
        repo: string,
        releaseId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/releases/{release_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'release_id': releaseId,
            },
        });
    }
    /**
     * List release assets
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param releaseId The unique identifier of the release.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns release_asset Response
     * @throws ApiError
     */
    public static reposListReleaseAssets(
        owner: string,
        repo: string,
        releaseId: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<release_asset>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/releases/{release_id}/assets',
            path: {
                'owner': owner,
                'repo': repo,
                'release_id': releaseId,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Upload a release asset
     * This endpoint makes use of a [Hypermedia relation](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#hypermedia) to determine which URL to access. The endpoint you call to upload release assets is specific to your release. Use the `upload_url` returned in
     * the response of the [Create a release endpoint](https://docs.github.com/rest/releases/releases#create-a-release) to upload a release asset.
     *
     * You need to use an HTTP client which supports [SNI](http://en.wikipedia.org/wiki/Server_Name_Indication) to make calls to this endpoint.
     *
     * Most libraries will set the required `Content-Length` header automatically. Use the required `Content-Type` header to provide the media type of the asset. For a list of media types, see [Media Types](https://www.iana.org/assignments/media-types/media-types.xhtml). For example:
     *
     * `application/zip`
     *
     * GitHub expects the asset data in its raw binary form, rather than JSON. You will send the raw binary content of the asset as the request body. Everything else about the endpoint is the same as the rest of the API. For example,
     * you'll still need to pass your authentication to be able to upload an asset.
     *
     * When an upstream failure occurs, you will receive a `502 Bad Gateway` status. This may leave an empty asset with a state of `starter`. It can be safely deleted.
     *
     * **Notes:**
     * *   GitHub renames asset filenames that have special characters, non-alphanumeric characters, and leading or trailing periods. The "[List release assets](https://docs.github.com/rest/releases/assets#list-release-assets)"
     * endpoint lists the renamed filenames. For more information and help, contact [GitHub Support](https://support.github.com/contact?tags=dotcom-rest-api).
     * *   To find the `release_id` query the [`GET /repos/{owner}/{repo}/releases/latest` endpoint](https://docs.github.com/rest/releases/releases#get-the-latest-release).
     * *   If you upload an asset with the same filename as another uploaded asset, you'll receive an error and must delete the old file before you can re-upload the new asset.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param releaseId The unique identifier of the release.
     * @param name
     * @param label
     * @param requestBody
     * @returns release_asset Response for successful upload
     * @throws ApiError
     */
    public static reposUploadReleaseAsset(
        owner: string,
        repo: string,
        releaseId: number,
        name: string,
        label?: string,
        requestBody?: Blob,
    ): CancelablePromise<release_asset> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/releases/{release_id}/assets',
            path: {
                'owner': owner,
                'repo': repo,
                'release_id': releaseId,
            },
            query: {
                'name': name,
                'label': label,
            },
            body: requestBody,
            mediaType: 'application/octet-stream',
            errors: {
                422: `Response if you upload an asset with the same filename as another uploaded asset`,
            },
        });
    }
    /**
     * Get rules for a branch
     * Returns all active rules that apply to the specified branch. The branch does not need to exist; rules that would apply
     * to a branch with that name will be returned. All active rules that apply will be returned, regardless of the level
     * at which they are configured (e.g. repository or organization). Rules in rulesets with "evaluate" or "disabled"
     * enforcement statuses are not returned.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param branch The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use [the GraphQL API](https://docs.github.com/graphql).
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns repository_rule_detailed Response
     * @throws ApiError
     */
    public static reposGetBranchRules(
        owner: string,
        repo: string,
        branch: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<repository_rule_detailed>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/rules/branches/{branch}',
            path: {
                'owner': owner,
                'repo': repo,
                'branch': branch,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Get all repository rulesets
     * Get all the rulesets for a repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param includesParents Include rulesets configured at higher levels that apply to this repository
     * @param targets A comma-separated list of rule targets to filter by.
     * If provided, only rulesets that apply to the specified targets will be returned.
     * For example, `branch,tag,push`.
     *
     * @returns repository_ruleset Response
     * @throws ApiError
     */
    public static reposGetRepoRulesets(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
        includesParents: boolean = true,
        targets?: string,
    ): CancelablePromise<Array<repository_ruleset>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/rulesets',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'per_page': perPage,
                'page': page,
                'includes_parents': includesParents,
                'targets': targets,
            },
            errors: {
                404: `Resource not found`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * Create a repository ruleset
     * Create a ruleset for a repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody Request body
     * @returns repository_ruleset Response
     * @throws ApiError
     */
    public static reposCreateRepoRuleset(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * The name of the ruleset.
             */
            name: string;
            /**
             * The target of the ruleset
             */
            target?: 'branch' | 'tag' | 'push';
            enforcement: repository_rule_enforcement;
            /**
             * The actors that can bypass the rules in this ruleset
             */
            bypass_actors?: Array<repository_ruleset_bypass_actor>;
            conditions?: repository_ruleset_conditions;
            /**
             * An array of rules within the ruleset.
             */
            rules?: Array<repository_rule>;
        },
    ): CancelablePromise<repository_ruleset> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/rulesets',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * List repository rule suites
     * Lists suites of rule evaluations at the repository level.
     * For more information, see "[Managing rulesets for a repository](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/managing-rulesets-for-a-repository#viewing-insights-for-rulesets)."
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param ref The name of the ref. Cannot contain wildcard characters. Optionally prefix with `refs/heads/` to limit to branches or `refs/tags/` to limit to tags. Omit the prefix to search across all refs. When specified, only rule evaluations triggered for this ref will be returned.
     * @param timePeriod The time period to filter by.
     *
     * For example, `day` will filter for rule suites that occurred in the past 24 hours, and `week` will filter for rule suites that occurred in the past 7 days (168 hours).
     * @param actorName The handle for the GitHub user account to filter on. When specified, only rule evaluations triggered by this actor will be returned.
     * @param ruleSuiteResult The rule suite results to filter on. When specified, only suites with this result will be returned.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns rule_suites Response
     * @throws ApiError
     */
    public static reposGetRepoRuleSuites(
        owner: string,
        repo: string,
        ref?: string,
        timePeriod: 'hour' | 'day' | 'week' | 'month' = 'day',
        actorName?: string,
        ruleSuiteResult: 'pass' | 'fail' | 'bypass' | 'all' = 'all',
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<rule_suites> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/rulesets/rule-suites',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'ref': ref,
                'time_period': timePeriod,
                'actor_name': actorName,
                'rule_suite_result': ruleSuiteResult,
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
     * Get a repository rule suite
     * Gets information about a suite of rule evaluations from within a repository.
     * For more information, see "[Managing rulesets for a repository](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/managing-rulesets-for-a-repository#viewing-insights-for-rulesets)."
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param ruleSuiteId The unique identifier of the rule suite result.
     * To get this ID, you can use [GET /repos/{owner}/{repo}/rulesets/rule-suites](https://docs.github.com/rest/repos/rule-suites#list-repository-rule-suites)
     * for repositories and [GET /orgs/{org}/rulesets/rule-suites](https://docs.github.com/rest/orgs/rule-suites#list-organization-rule-suites)
     * for organizations.
     * @returns rule_suite Response
     * @throws ApiError
     */
    public static reposGetRepoRuleSuite(
        owner: string,
        repo: string,
        ruleSuiteId: number,
    ): CancelablePromise<rule_suite> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/rulesets/rule-suites/{rule_suite_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'rule_suite_id': ruleSuiteId,
            },
            errors: {
                404: `Resource not found`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * Get a repository ruleset
     * Get a ruleset for a repository.
     *
     * **Note:** To prevent leaking sensitive information, the `bypass_actors` property is only returned if the user
     * making the API request has write access to the ruleset.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param rulesetId The ID of the ruleset.
     * @param includesParents Include rulesets configured at higher levels that apply to this repository
     * @returns repository_ruleset Response
     * @throws ApiError
     */
    public static reposGetRepoRuleset(
        owner: string,
        repo: string,
        rulesetId: number,
        includesParents: boolean = true,
    ): CancelablePromise<repository_ruleset> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/rulesets/{ruleset_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'ruleset_id': rulesetId,
            },
            query: {
                'includes_parents': includesParents,
            },
            errors: {
                404: `Resource not found`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * Update a repository ruleset
     * Update a ruleset for a repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param rulesetId The ID of the ruleset.
     * @param requestBody Request body
     * @returns repository_ruleset Response
     * @throws ApiError
     */
    public static reposUpdateRepoRuleset(
        owner: string,
        repo: string,
        rulesetId: number,
        requestBody?: {
            /**
             * The name of the ruleset.
             */
            name?: string;
            /**
             * The target of the ruleset
             */
            target?: 'branch' | 'tag' | 'push';
            enforcement?: repository_rule_enforcement;
            /**
             * The actors that can bypass the rules in this ruleset
             */
            bypass_actors?: Array<repository_ruleset_bypass_actor>;
            conditions?: repository_ruleset_conditions;
            /**
             * An array of rules within the ruleset.
             */
            rules?: Array<repository_rule>;
        },
    ): CancelablePromise<repository_ruleset> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/rulesets/{ruleset_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'ruleset_id': rulesetId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * Delete a repository ruleset
     * Delete a ruleset for a repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param rulesetId The ID of the ruleset.
     * @returns void
     * @throws ApiError
     */
    public static reposDeleteRepoRuleset(
        owner: string,
        repo: string,
        rulesetId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/rulesets/{ruleset_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'ruleset_id': rulesetId,
            },
            errors: {
                404: `Resource not found`,
                500: `Internal Error`,
            },
        });
    }
    /**
     * Get repository ruleset history
     * Get the history of a repository ruleset.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param rulesetId The ID of the ruleset.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns ruleset_version Response
     * @throws ApiError
     */
    public static reposGetRepoRulesetHistory(
        owner: string,
        repo: string,
        rulesetId: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<ruleset_version>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/rulesets/{ruleset_id}/history',
            path: {
                'owner': owner,
                'repo': repo,
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
     * Get repository ruleset version
     * Get a version of a repository ruleset.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param rulesetId The ID of the ruleset.
     * @param versionId The ID of the version
     * @returns ruleset_version_with_state Response
     * @throws ApiError
     */
    public static reposGetRepoRulesetVersion(
        owner: string,
        repo: string,
        rulesetId: number,
        versionId: number,
    ): CancelablePromise<ruleset_version_with_state> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/rulesets/{ruleset_id}/history/{version_id}',
            path: {
                'owner': owner,
                'repo': repo,
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
     * Get the weekly commit activity
     * Returns a weekly aggregate of the number of additions and deletions pushed to a repository.
     *
     * > [!NOTE]
     * > This endpoint can only be used for repositories with fewer than 10,000 commits. If the repository contains 10,000 or more commits, a 422 status code will be returned.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns code_frequency_stat Returns a weekly aggregate of the number of additions and deletions pushed to a repository.
     * @returns any Accepted
     * @throws ApiError
     */
    public static reposGetCodeFrequencyStats(
        owner: string,
        repo: string,
    ): CancelablePromise<Array<code_frequency_stat> | Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/stats/code_frequency',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                422: `Repository contains more than 10,000 commits`,
            },
        });
    }
    /**
     * Get the last year of commit activity
     * Returns the last year of commit activity grouped by week. The `days` array is a group of commits per day, starting on `Sunday`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns commit_activity Response
     * @returns any Accepted
     * @throws ApiError
     */
    public static reposGetCommitActivityStats(
        owner: string,
        repo: string,
    ): CancelablePromise<Array<commit_activity> | Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/stats/commit_activity',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Get all contributor commit activity
     *
     * Returns the `total` number of commits authored by the contributor. In addition, the response includes a Weekly Hash (`weeks` array) with the following information:
     *
     * *   `w` - Start of the week, given as a [Unix timestamp](https://en.wikipedia.org/wiki/Unix_time).
     * *   `a` - Number of additions
     * *   `d` - Number of deletions
     * *   `c` - Number of commits
     *
     * > [!NOTE]
     * > This endpoint will return `0` values for all addition and deletion counts in repositories with 10,000 or more commits.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns contributor_activity Response
     * @returns any Accepted
     * @throws ApiError
     */
    public static reposGetContributorsStats(
        owner: string,
        repo: string,
    ): CancelablePromise<Array<contributor_activity> | Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/stats/contributors',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Get the weekly commit count
     * Returns the total commit counts for the `owner` and total commit counts in `all`. `all` is everyone combined, including the `owner` in the last 52 weeks. If you'd like to get the commit counts for non-owners, you can subtract `owner` from `all`.
     *
     * The array order is oldest week (index 0) to most recent week.
     *
     * The most recent week is seven days ago at UTC midnight to today at UTC midnight.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns participation_stats The array order is oldest week (index 0) to most recent week.
     * @throws ApiError
     */
    public static reposGetParticipationStats(
        owner: string,
        repo: string,
    ): CancelablePromise<participation_stats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/stats/participation',
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
     * Get the hourly commit count for each day
     * Each array contains the day number, hour number, and number of commits:
     *
     * *   `0-6`: Sunday - Saturday
     * *   `0-23`: Hour of day
     * *   Number of commits
     *
     * For example, `[2, 14, 25]` indicates that there were 25 total commits, during the 2:00pm hour on Tuesdays. All times are based on the time zone of individual commits.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns code_frequency_stat For example, `[2, 14, 25]` indicates that there were 25 total commits, during the 2:00pm hour on Tuesdays. All times are based on the time zone of individual commits.
     * @throws ApiError
     */
    public static reposGetPunchCardStats(
        owner: string,
        repo: string,
    ): CancelablePromise<Array<code_frequency_stat>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/stats/punch_card',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Create a commit status
     * Users with push access in a repository can create commit statuses for a given SHA.
     *
     * Note: there is a limit of 1000 statuses per `sha` and `context` within a repository. Attempts to create more than 1000 statuses will result in a validation error.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param sha
     * @param requestBody
     * @returns status Response
     * @throws ApiError
     */
    public static reposCreateCommitStatus(
        owner: string,
        repo: string,
        sha: string,
        requestBody: {
            /**
             * The state of the status.
             */
            state: 'error' | 'failure' | 'pending' | 'success';
            /**
             * The target URL to associate with this status. This URL will be linked from the GitHub UI to allow users to easily see the source of the status.
             * For example, if your continuous integration system is posting build status, you would want to provide the deep link for the build output for this specific SHA:
             * `http://ci.example.com/user/repo/build/sha`
             */
            target_url?: string | null;
            /**
             * A short description of the status.
             */
            description?: string | null;
            /**
             * A string label to differentiate this status from the status of other systems. This field is case-insensitive.
             */
            context?: string;
        },
    ): CancelablePromise<status> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/statuses/{sha}',
            path: {
                'owner': owner,
                'repo': repo,
                'sha': sha,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List repository tags
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns tag Response
     * @throws ApiError
     */
    public static reposListTags(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<tag>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/tags',
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
     * @deprecated
     * Closing down - List tag protection states for a repository
     * > [!WARNING]
     * > **Closing down notice:** This operation is closing down and will be removed after August 30, 2024. Use the "[Repository Rulesets](https://docs.github.com/rest/repos/rules#get-all-repository-rulesets)" endpoint instead.
     *
     * This returns the tag protection states of a repository.
     *
     * This information is only available to repository administrators.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns tag_protection Response
     * @throws ApiError
     */
    public static reposListTagProtection(
        owner: string,
        repo: string,
    ): CancelablePromise<Array<tag_protection>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/tags/protection',
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
     * @deprecated
     * Closing down - Create a tag protection state for a repository
     * > [!WARNING]
     * > **Closing down notice:** This operation is closing down and will be removed after August 30, 2024. Use the "[Repository Rulesets](https://docs.github.com/rest/repos/rules#create-a-repository-ruleset)" endpoint instead.
     *
     * This creates a tag protection state for a repository.
     * This endpoint is only available to repository administrators.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns tag_protection Response
     * @throws ApiError
     */
    public static reposCreateTagProtection(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * An optional glob pattern to match against when enforcing tag protection.
             */
            pattern: string;
        },
    ): CancelablePromise<tag_protection> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/tags/protection',
            path: {
                'owner': owner,
                'repo': repo,
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
     * @deprecated
     * Closing down - Delete a tag protection state for a repository
     * > [!WARNING]
     * > **Closing down notice:** This operation is closing down and will be removed after August 30, 2024. Use the "[Repository Rulesets](https://docs.github.com/rest/repos/rules#delete-a-repository-ruleset)" endpoint instead.
     *
     * This deletes a tag protection state for a repository.
     * This endpoint is only available to repository administrators.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param tagProtectionId The unique identifier of the tag protection.
     * @returns void
     * @throws ApiError
     */
    public static reposDeleteTagProtection(
        owner: string,
        repo: string,
        tagProtectionId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/tags/protection/{tag_protection_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'tag_protection_id': tagProtectionId,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Download a repository archive (tar)
     * Gets a redirect URL to download a tar archive for a repository. If you omit `:ref`, the repository’s default branch (usually
     * `main`) will be used. Please make sure your HTTP framework is configured to follow redirects or you will need to use
     * the `Location` header to make a second `GET` request.
     *
     * > [!NOTE]
     * > For private repositories, these links are temporary and expire after five minutes.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param ref
     * @returns void
     * @throws ApiError
     */
    public static reposDownloadTarballArchive(
        owner: string,
        repo: string,
        ref: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/tarball/{ref}',
            path: {
                'owner': owner,
                'repo': repo,
                'ref': ref,
            },
            errors: {
                302: `Response`,
            },
        });
    }
    /**
     * List repository teams
     * Lists the teams that have access to the specified repository and that are also visible to the authenticated user.
     *
     * For a public repository, a team is listed only if that team added the public repository explicitly.
     *
     * OAuth app tokens and personal access tokens (classic) need the `public_repo` or `repo` scope to use this endpoint with a public repository, and `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns team Response
     * @throws ApiError
     */
    public static reposListTeams(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<team>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/teams',
            path: {
                'owner': owner,
                'repo': repo,
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
     * Get all repository topics
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns topic Response
     * @throws ApiError
     */
    public static reposGetAllTopics(
        owner: string,
        repo: string,
        page: number = 1,
        perPage: number = 30,
    ): CancelablePromise<topic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/topics',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'page': page,
                'per_page': perPage,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Replace all repository topics
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns topic Response
     * @throws ApiError
     */
    public static reposReplaceAllTopics(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * An array of topics to add to the repository. Pass one or more topics to _replace_ the set of existing topics. Send an empty array (`[]`) to clear all topics from the repository. **Note:** Topic `names` will be saved as lowercase.
             */
            names: Array<string>;
        },
    ): CancelablePromise<topic> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/topics',
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
     * Get repository clones
     * Get the total number of clones and breakdown per day or week for the last 14 days. Timestamps are aligned to UTC midnight of the beginning of the day or week. Week begins on Monday.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param per The time frame to display results for.
     * @returns clone_traffic Response
     * @returns any Accepted
     * @throws ApiError
     */
    public static reposGetClones(
        owner: string,
        repo: string,
        per: 'day' | 'week' = 'day',
    ): CancelablePromise<clone_traffic | Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/traffic/clones',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'per': per,
            },
            errors: {
                403: `Forbidden`,
            },
        });
    }
    /**
     * Get top referral paths
     * Get the top 10 popular contents over the last 14 days.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns content_traffic Response
     * @returns any Accepted
     * @throws ApiError
     */
    public static reposGetTopPaths(
        owner: string,
        repo: string,
    ): CancelablePromise<Array<content_traffic> | Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/traffic/popular/paths',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                403: `Forbidden`,
            },
        });
    }
    /**
     * Get top referral sources
     * Get the top 10 referrers over the last 14 days.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns referrer_traffic Response
     * @returns any Accepted
     * @throws ApiError
     */
    public static reposGetTopReferrers(
        owner: string,
        repo: string,
    ): CancelablePromise<Array<referrer_traffic> | Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/traffic/popular/referrers',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                403: `Forbidden`,
            },
        });
    }
    /**
     * Get page views
     * Get the total number of views and breakdown per day or week for the last 14 days. Timestamps are aligned to UTC midnight of the beginning of the day or week. Week begins on Monday.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param per The time frame to display results for.
     * @returns view_traffic Response
     * @returns any Accepted
     * @throws ApiError
     */
    public static reposGetViews(
        owner: string,
        repo: string,
        per: 'day' | 'week' = 'day',
    ): CancelablePromise<view_traffic | Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/traffic/views',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'per': per,
            },
            errors: {
                403: `Forbidden`,
            },
        });
    }
    /**
     * Transfer a repository
     * A transfer request will need to be accepted by the new owner when transferring a personal repository to another user. The response will contain the original `owner`, and the transfer will continue asynchronously. For more details on the requirements to transfer personal and organization-owned repositories, see [about repository transfers](https://docs.github.com/articles/about-repository-transfers/).
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns minimal_repository Response
     * @throws ApiError
     */
    public static reposTransfer(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * The username or organization name the repository will be transferred to.
             */
            new_owner: string;
            /**
             * The new name to be given to the repository.
             */
            new_name?: string;
            /**
             * ID of the team or teams to add to the repository. Teams can only be added to organization-owned repositories.
             */
            team_ids?: Array<number>;
        },
    ): CancelablePromise<minimal_repository> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/transfer',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Check if vulnerability alerts are enabled for a repository
     * Shows whether dependency alerts are enabled or disabled for a repository. The authenticated user must have admin read access to the repository. For more information, see "[About security alerts for vulnerable dependencies](https://docs.github.com/articles/about-security-alerts-for-vulnerable-dependencies)".
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns void
     * @throws ApiError
     */
    public static reposCheckVulnerabilityAlerts(
        owner: string,
        repo: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/vulnerability-alerts',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                404: `Not Found if repository is not enabled with vulnerability alerts`,
            },
        });
    }
    /**
     * Enable vulnerability alerts
     * Enables dependency alerts and the dependency graph for a repository. The authenticated user must have admin access to the repository. For more information, see "[About security alerts for vulnerable dependencies](https://docs.github.com/articles/about-security-alerts-for-vulnerable-dependencies)".
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns void
     * @throws ApiError
     */
    public static reposEnableVulnerabilityAlerts(
        owner: string,
        repo: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/vulnerability-alerts',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Disable vulnerability alerts
     * Disables dependency alerts and the dependency graph for a repository.
     * The authenticated user must have admin access to the repository. For more information,
     * see "[About security alerts for vulnerable dependencies](https://docs.github.com/articles/about-security-alerts-for-vulnerable-dependencies)".
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns void
     * @throws ApiError
     */
    public static reposDisableVulnerabilityAlerts(
        owner: string,
        repo: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/vulnerability-alerts',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * Download a repository archive (zip)
     * Gets a redirect URL to download a zip archive for a repository. If you omit `:ref`, the repository’s default branch (usually
     * `main`) will be used. Please make sure your HTTP framework is configured to follow redirects or you will need to use
     * the `Location` header to make a second `GET` request.
     *
     * > [!NOTE]
     * > For private repositories, these links are temporary and expire after five minutes. If the repository is empty, you will receive a 404 when you follow the redirect.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param ref
     * @returns void
     * @throws ApiError
     */
    public static reposDownloadZipballArchive(
        owner: string,
        repo: string,
        ref: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/zipball/{ref}',
            path: {
                'owner': owner,
                'repo': repo,
                'ref': ref,
            },
            errors: {
                302: `Response`,
            },
        });
    }
    /**
     * Create a repository using a template
     * Creates a new repository using a repository template. Use the `template_owner` and `template_repo` route parameters to specify the repository to use as the template. If the repository is not public, the authenticated user must own or be a member of an organization that owns the repository. To check if a repository is available to use as a template, get the repository's information using the [Get a repository](https://docs.github.com/rest/repos/repos#get-a-repository) endpoint and check that the `is_template` key is `true`.
     *
     * OAuth app tokens and personal access tokens (classic) need the `public_repo` or `repo` scope to create a public repository, and `repo` scope to create a private repository.
     * @param templateOwner The account owner of the template repository. The name is not case sensitive.
     * @param templateRepo The name of the template repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns full_repository Response
     * @throws ApiError
     */
    public static reposCreateUsingTemplate(
        templateOwner: string,
        templateRepo: string,
        requestBody: {
            /**
             * The organization or person who will own the new repository. To create a new repository in an organization, the authenticated user must be a member of the specified organization.
             */
            owner?: string;
            /**
             * The name of the new repository.
             */
            name: string;
            /**
             * A short description of the new repository.
             */
            description?: string;
            /**
             * Set to `true` to include the directory structure and files from all branches in the template repository, and not just the default branch. Default: `false`.
             */
            include_all_branches?: boolean;
            /**
             * Either `true` to create a new private repository or `false` to create a new public one.
             */
            private?: boolean;
        },
    ): CancelablePromise<full_repository> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{template_owner}/{template_repo}/generate',
            path: {
                'template_owner': templateOwner,
                'template_repo': templateRepo,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List public repositories
     * Lists all public repositories in the order that they were created.
     *
     * Note:
     * - For GitHub Enterprise Server, this endpoint will only list repositories available to all users on the enterprise.
     * - Pagination is powered exclusively by the `since` parameter. Use the [Link header](https://docs.github.com/rest/guides/using-pagination-in-the-rest-api#using-link-headers) to get the URL for the next page of repositories.
     * @param since A repository ID. Only return repositories with an ID greater than this ID.
     * @returns minimal_repository Response
     * @throws ApiError
     */
    public static reposListPublic(
        since?: number,
    ): CancelablePromise<Array<minimal_repository>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repositories',
            query: {
                'since': since,
            },
            errors: {
                304: `Not modified`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List repositories for the authenticated user
     * Lists repositories that the authenticated user has explicit permission (`:read`, `:write`, or `:admin`) to access.
     *
     * The authenticated user has explicit permission to access repositories they own, repositories where they are a collaborator, and repositories that they can access through an organization membership.
     * @param visibility Limit results to repositories with the specified visibility.
     * @param affiliation Comma-separated list of values. Can include:
     * * `owner`: Repositories that are owned by the authenticated user.
     * * `collaborator`: Repositories that the user has been added to as a collaborator.
     * * `organization_member`: Repositories that the user has access to through being a member of an organization. This includes every repository on every team that the user is on.
     * @param type Limit results to repositories of the specified type. Will cause a `422` error if used in the same request as **visibility** or **affiliation**.
     * @param sort The property to sort the results by.
     * @param direction The order to sort by. Default: `asc` when using `full_name`, otherwise `desc`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param since Only show repositories updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param before Only show repositories updated before the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @returns repository Response
     * @throws ApiError
     */
    public static reposListForAuthenticatedUser(
        visibility: 'all' | 'public' | 'private' = 'all',
        affiliation: string = 'owner,collaborator,organization_member',
        type: 'all' | 'owner' | 'public' | 'private' | 'member' = 'all',
        sort: 'created' | 'updated' | 'pushed' | 'full_name' = 'full_name',
        direction?: 'asc' | 'desc',
        perPage: number = 30,
        page: number = 1,
        since?: string,
        before?: string,
    ): CancelablePromise<Array<repository>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/repos',
            query: {
                'visibility': visibility,
                'affiliation': affiliation,
                'type': type,
                'sort': sort,
                'direction': direction,
                'per_page': perPage,
                'page': page,
                'since': since,
                'before': before,
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
     * Create a repository for the authenticated user
     * Creates a new repository for the authenticated user.
     *
     * OAuth app tokens and personal access tokens (classic) need the `public_repo` or `repo` scope to create a public repository, and `repo` scope to create a private repository.
     * @param requestBody
     * @returns full_repository Response
     * @throws ApiError
     */
    public static reposCreateForAuthenticatedUser(
        requestBody: {
            /**
             * The name of the repository.
             */
            name: string;
            /**
             * A short description of the repository.
             */
            description?: string;
            /**
             * A URL with more information about the repository.
             */
            homepage?: string;
            /**
             * Whether the repository is private.
             */
            private?: boolean;
            /**
             * Whether issues are enabled.
             */
            has_issues?: boolean;
            /**
             * Whether projects are enabled.
             */
            has_projects?: boolean;
            /**
             * Whether the wiki is enabled.
             */
            has_wiki?: boolean;
            /**
             * Whether discussions are enabled.
             */
            has_discussions?: boolean;
            /**
             * The id of the team that will be granted access to this repository. This is only valid when creating a repository in an organization.
             */
            team_id?: number;
            /**
             * Whether the repository is initialized with a minimal README.
             */
            auto_init?: boolean;
            /**
             * The desired language or platform to apply to the .gitignore.
             */
            gitignore_template?: string;
            /**
             * The license keyword of the open source license for this repository.
             */
            license_template?: string;
            /**
             * Whether to allow squash merges for pull requests.
             */
            allow_squash_merge?: boolean;
            /**
             * Whether to allow merge commits for pull requests.
             */
            allow_merge_commit?: boolean;
            /**
             * Whether to allow rebase merges for pull requests.
             */
            allow_rebase_merge?: boolean;
            /**
             * Whether to allow Auto-merge to be used on pull requests.
             */
            allow_auto_merge?: boolean;
            /**
             * Whether to delete head branches when pull requests are merged
             */
            delete_branch_on_merge?: boolean;
            /**
             * Required when using `squash_merge_commit_message`.
             *
             * The default value for a squash merge commit title:
             *
             * - `PR_TITLE` - default to the pull request's title.
             * - `COMMIT_OR_PR_TITLE` - default to the commit's title (if only one commit) or the pull request's title (when more than one commit).
             */
            squash_merge_commit_title?: 'PR_TITLE' | 'COMMIT_OR_PR_TITLE';
            /**
             * The default value for a squash merge commit message:
             *
             * - `PR_BODY` - default to the pull request's body.
             * - `COMMIT_MESSAGES` - default to the branch's commit messages.
             * - `BLANK` - default to a blank commit message.
             */
            squash_merge_commit_message?: 'PR_BODY' | 'COMMIT_MESSAGES' | 'BLANK';
            /**
             * Required when using `merge_commit_message`.
             *
             * The default value for a merge commit title.
             *
             * - `PR_TITLE` - default to the pull request's title.
             * - `MERGE_MESSAGE` - default to the classic title for a merge message (e.g., Merge pull request #123 from branch-name).
             */
            merge_commit_title?: 'PR_TITLE' | 'MERGE_MESSAGE';
            /**
             * The default value for a merge commit message.
             *
             * - `PR_TITLE` - default to the pull request's title.
             * - `PR_BODY` - default to the pull request's body.
             * - `BLANK` - default to a blank commit message.
             */
            merge_commit_message?: 'PR_BODY' | 'PR_TITLE' | 'BLANK';
            /**
             * Whether downloads are enabled.
             */
            has_downloads?: boolean;
            /**
             * Whether this repository acts as a template that can be used to generate new repositories.
             */
            is_template?: boolean;
        },
    ): CancelablePromise<full_repository> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/repos',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                304: `Not modified`,
                400: `Bad Request`,
                401: `Requires authentication`,
                403: `Forbidden`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List repository invitations for the authenticated user
     * When authenticating as a user, this endpoint will list all currently open repository invitations for that user.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns repository_invitation Response
     * @throws ApiError
     */
    public static reposListInvitationsForAuthenticatedUser(
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<repository_invitation>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/repository_invitations',
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                304: `Not modified`,
                401: `Requires authentication`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Accept a repository invitation
     * @param invitationId The unique identifier of the invitation.
     * @returns void
     * @throws ApiError
     */
    public static reposAcceptInvitationForAuthenticatedUser(
        invitationId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/repository_invitations/{invitation_id}',
            path: {
                'invitation_id': invitationId,
            },
            errors: {
                304: `Not modified`,
                403: `Forbidden`,
                404: `Resource not found`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Decline a repository invitation
     * @param invitationId The unique identifier of the invitation.
     * @returns void
     * @throws ApiError
     */
    public static reposDeclineInvitationForAuthenticatedUser(
        invitationId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/repository_invitations/{invitation_id}',
            path: {
                'invitation_id': invitationId,
            },
            errors: {
                304: `Not modified`,
                403: `Forbidden`,
                404: `Resource not found`,
                409: `Conflict`,
            },
        });
    }
    /**
     * List repositories for a user
     * Lists public repositories for the specified user.
     * @param username The handle for the GitHub user account.
     * @param type Limit results to repositories of the specified type.
     * @param sort The property to sort the results by.
     * @param direction The order to sort by. Default: `asc` when using `full_name`, otherwise `desc`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns minimal_repository Response
     * @throws ApiError
     */
    public static reposListForUser(
        username: string,
        type: 'all' | 'owner' | 'member' = 'owner',
        sort: 'created' | 'updated' | 'pushed' | 'full_name' = 'full_name',
        direction?: 'asc' | 'desc',
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<minimal_repository>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{username}/repos',
            path: {
                'username': username,
            },
            query: {
                'type': type,
                'sort': sort,
                'direction': direction,
                'per_page': perPage,
                'page': page,
            },
        });
    }
}
