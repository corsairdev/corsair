/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Choose which environments must be successfully deployed to before refs can be pushed into a ref that matches this rule.
 */
export type repository_rule_required_deployments = {
    type: repository_rule_required_deployments.type;
    parameters?: {
        /**
         * The environments that must be successfully deployed to before branches can be merged.
         */
        required_deployment_environments: Array<string>;
    };
};
export namespace repository_rule_required_deployments {
    export enum type {
        REQUIRED_DEPLOYMENTS = 'required_deployments',
    }
}

