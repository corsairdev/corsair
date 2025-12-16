/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { custom_deployment_rule_app } from './custom_deployment_rule_app';
/**
 * Deployment protection rule
 */
export type deployment_protection_rule = {
    /**
     * The unique identifier for the deployment protection rule.
     */
    id: number;
    /**
     * The node ID for the deployment protection rule.
     */
    node_id: string;
    /**
     * Whether the deployment protection rule is enabled for the environment.
     */
    enabled: boolean;
    app: custom_deployment_rule_app;
};

