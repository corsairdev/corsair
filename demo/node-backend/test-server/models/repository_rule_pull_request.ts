/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { repository_rule_params_required_reviewer_configuration } from './repository_rule_params_required_reviewer_configuration';
/**
 * Require all commits be made to a non-target branch and submitted via a pull request before they can be merged.
 */
export type repository_rule_pull_request = {
    type: repository_rule_pull_request.type;
    parameters?: {
        /**
         * Array of allowed merge methods. Allowed values include `merge`, `squash`, and `rebase`. At least one option must be enabled.
         */
        allowed_merge_methods?: Array<'merge' | 'squash' | 'rebase'>;
        /**
         * New, reviewable commits pushed will dismiss previous pull request review approvals.
         */
        dismiss_stale_reviews_on_push: boolean;
        /**
         * Require an approving review in pull requests that modify files that have a designated code owner.
         */
        require_code_owner_review: boolean;
        /**
         * Whether the most recent reviewable push must be approved by someone other than the person who pushed it.
         */
        require_last_push_approval: boolean;
        /**
         * The number of approving reviews that are required before a pull request can be merged.
         */
        required_approving_review_count: number;
        /**
         * All conversations on code must be resolved before a pull request can be merged.
         */
        required_review_thread_resolution: boolean;
        /**
         * > [!NOTE]
         * > `required_reviewers` is in beta and subject to change.
         *
         * A collection of reviewers and associated file patterns. Each reviewer has a list of file patterns which determine the files that reviewer is required to review.
         */
        required_reviewers?: Array<repository_rule_params_required_reviewer_configuration>;
    };
};
export namespace repository_rule_pull_request {
    export enum type {
        PULL_REQUEST = 'pull_request',
    }
}

