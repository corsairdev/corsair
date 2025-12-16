/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type actions_hosted_runner_limits = {
    /**
     * Provides details of static public IP limits for GitHub-hosted Hosted Runners
     */
    public_ips: {
        /**
         * The maximum number of static public IP addresses that can be used for Hosted Runners.
         */
        maximum: number;
        /**
         * The current number of static public IP addresses in use by Hosted Runners.
         */
        current_usage: number;
    };
};

