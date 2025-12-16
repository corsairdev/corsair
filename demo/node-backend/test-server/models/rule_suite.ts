/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
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

