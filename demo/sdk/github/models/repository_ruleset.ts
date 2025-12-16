/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { org_ruleset_conditions } from './org_ruleset_conditions';
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

