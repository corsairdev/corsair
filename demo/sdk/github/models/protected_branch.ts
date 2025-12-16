/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { branch_restriction_policy } from './branch_restriction_policy';
import type { integration } from './integration';
import type { simple_user } from './simple_user';
import type { status_check_policy } from './status_check_policy';
import type { team } from './team';
/**
 * Branch protections protect branches
 */
export type protected_branch = {
    url: string;
    required_status_checks?: status_check_policy;
    required_pull_request_reviews?: {
        url: string;
        dismiss_stale_reviews?: boolean;
        require_code_owner_reviews?: boolean;
        required_approving_review_count?: number;
        /**
         * Whether the most recent push must be approved by someone other than the person who pushed it.
         */
        require_last_push_approval?: boolean;
        dismissal_restrictions?: {
            url: string;
            users_url: string;
            teams_url: string;
            users: Array<simple_user>;
            teams: Array<team>;
            apps?: Array<integration>;
        };
        bypass_pull_request_allowances?: {
            users: Array<simple_user>;
            teams: Array<team>;
            apps?: Array<integration>;
        };
    };
    required_signatures?: {
        url: string;
        enabled: boolean;
    };
    enforce_admins?: {
        url: string;
        enabled: boolean;
    };
    required_linear_history?: {
        enabled: boolean;
    };
    allow_force_pushes?: {
        enabled: boolean;
    };
    allow_deletions?: {
        enabled: boolean;
    };
    restrictions?: branch_restriction_policy;
    required_conversation_resolution?: {
        enabled?: boolean;
    };
    block_creations?: {
        enabled: boolean;
    };
    /**
     * Whether to set the branch as read-only. If this is true, users will not be able to push to the branch.
     */
    lock_branch?: {
        enabled?: boolean;
    };
    /**
     * Whether users can pull changes from upstream when the branch is locked. Set to `true` to allow fork syncing. Set to `false` to prevent fork syncing.
     */
    allow_fork_syncing?: {
        enabled?: boolean;
    };
};

