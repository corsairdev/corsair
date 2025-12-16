/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { integration } from './integration';
import type { simple_user } from './simple_user';
import type { team } from './team';
/**
 * Protected Branch Pull Request Review
 */
export type protected_branch_pull_request_review = {
    url?: string;
    dismissal_restrictions?: {
        /**
         * The list of users with review dismissal access.
         */
        users?: Array<simple_user>;
        /**
         * The list of teams with review dismissal access.
         */
        teams?: Array<team>;
        /**
         * The list of apps with review dismissal access.
         */
        apps?: Array<integration>;
        url?: string;
        users_url?: string;
        teams_url?: string;
    };
    /**
     * Allow specific users, teams, or apps to bypass pull request requirements.
     */
    bypass_pull_request_allowances?: {
        /**
         * The list of users allowed to bypass pull request requirements.
         */
        users?: Array<simple_user>;
        /**
         * The list of teams allowed to bypass pull request requirements.
         */
        teams?: Array<team>;
        /**
         * The list of apps allowed to bypass pull request requirements.
         */
        apps?: Array<integration>;
    };
    dismiss_stale_reviews: boolean;
    require_code_owner_reviews: boolean;
    required_approving_review_count?: number;
    /**
     * Whether the most recent push must be approved by someone other than the person who pushed it.
     */
    require_last_push_approval?: boolean;
};

