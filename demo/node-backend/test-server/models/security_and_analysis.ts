/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type security_and_analysis = {
    /**
     * Enable or disable GitHub Advanced Security for the repository.
     *
     * For standalone Code Scanning or Secret Protection products, this parameter cannot be used.
     *
     */
    advanced_security?: {
        status?: security_and_analysis.status;
    };
    code_security?: {
        status?: security_and_analysis.status;
    };
    /**
     * Enable or disable Dependabot security updates for the repository.
     */
    dependabot_security_updates?: {
        /**
         * The enablement status of Dependabot security updates for the repository.
         */
        status?: security_and_analysis.status;
    };
    secret_scanning?: {
        status?: security_and_analysis.status;
    };
    secret_scanning_push_protection?: {
        status?: security_and_analysis.status;
    };
    secret_scanning_non_provider_patterns?: {
        status?: security_and_analysis.status;
    };
    secret_scanning_ai_detection?: {
        status?: security_and_analysis.status;
    };
};
export namespace security_and_analysis {
    export enum status {
        ENABLED = 'enabled',
        DISABLED = 'disabled',
    }
}

