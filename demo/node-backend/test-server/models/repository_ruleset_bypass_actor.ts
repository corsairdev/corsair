/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
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

