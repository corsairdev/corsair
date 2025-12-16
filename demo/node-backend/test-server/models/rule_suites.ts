/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
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
