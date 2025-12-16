/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type actions_fork_pr_workflows_private_repos_request = {
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

