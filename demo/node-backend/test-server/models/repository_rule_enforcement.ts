/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The enforcement level of the ruleset. `evaluate` allows admins to test rules before enforcing them. Admins can view insights on the Rule Insights page (`evaluate` is only available with GitHub Enterprise).
 */
export enum repository_rule_enforcement {
    DISABLED = 'disabled',
    ACTIVE = 'active',
    EVALUATE = 'evaluate',
}
