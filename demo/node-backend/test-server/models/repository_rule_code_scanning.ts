/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { repository_rule_params_code_scanning_tool } from './repository_rule_params_code_scanning_tool';
/**
 * Choose which tools must provide code scanning results before the reference is updated. When configured, code scanning must be enabled and have results for both the commit and the reference being updated.
 */
export type repository_rule_code_scanning = {
    type: repository_rule_code_scanning.type;
    parameters?: {
        /**
         * Tools that must provide code scanning results for this rule to pass.
         */
        code_scanning_tools: Array<repository_rule_params_code_scanning_tool>;
    };
};
export namespace repository_rule_code_scanning {
    export enum type {
        CODE_SCANNING = 'code_scanning',
    }
}

