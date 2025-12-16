/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request Copilot code review for new pull requests automatically if the author has access to Copilot code review and their premium requests quota has not reached the limit.
 */
export type repository_rule_copilot_code_review = {
    type: repository_rule_copilot_code_review.type;
    parameters?: {
        /**
         * Copilot automatically reviews draft pull requests before they are marked as ready for review.
         */
        review_draft_pull_requests?: boolean;
        /**
         * Copilot automatically reviews each new push to the pull request.
         */
        review_on_push?: boolean;
    };
};
export namespace repository_rule_copilot_code_review {
    export enum type {
        COPILOT_CODE_REVIEW = 'copilot_code_review',
    }
}

