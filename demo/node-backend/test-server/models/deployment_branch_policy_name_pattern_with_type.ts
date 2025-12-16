/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type deployment_branch_policy_name_pattern_with_type = {
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

