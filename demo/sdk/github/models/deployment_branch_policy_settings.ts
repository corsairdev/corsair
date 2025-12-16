/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
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

