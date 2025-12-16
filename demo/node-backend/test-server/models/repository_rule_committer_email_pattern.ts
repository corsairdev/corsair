/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Parameters to be used for the committer_email_pattern rule
 */
export type repository_rule_committer_email_pattern = {
    type: repository_rule_committer_email_pattern.type;
    parameters?: {
        /**
         * How this rule will appear to users.
         */
        name?: string;
        /**
         * If true, the rule will fail if the pattern matches.
         */
        negate?: boolean;
        /**
         * The operator to use for matching.
         */
        operator: repository_rule_committer_email_pattern.operator;
        /**
         * The pattern to match with.
         */
        pattern: string;
    };
};
export namespace repository_rule_committer_email_pattern {
    export enum type {
        COMMITTER_EMAIL_PATTERN = 'committer_email_pattern',
    }
    /**
     * The operator to use for matching.
     */
    export enum operator {
        STARTS_WITH = 'starts_with',
        ENDS_WITH = 'ends_with',
        CONTAINS = 'contains',
        REGEX = 'regex',
    }
}

