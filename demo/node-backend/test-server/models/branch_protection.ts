/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { branch_restriction_policy } from './branch_restriction_policy';
import type { protected_branch_admin_enforced } from './protected_branch_admin_enforced';
import type { protected_branch_pull_request_review } from './protected_branch_pull_request_review';
import type { protected_branch_required_status_check } from './protected_branch_required_status_check';
/**
 * Branch Protection
 */
export type branch_protection = {
    url?: string;
    enabled?: boolean;
    required_status_checks?: protected_branch_required_status_check;
    enforce_admins?: protected_branch_admin_enforced;
    required_pull_request_reviews?: protected_branch_pull_request_review;
    restrictions?: branch_restriction_policy;
    required_linear_history?: {
        enabled?: boolean;
    };
    allow_force_pushes?: {
        enabled?: boolean;
    };
    allow_deletions?: {
        enabled?: boolean;
    };
    block_creations?: {
        enabled?: boolean;
    };
    required_conversation_resolution?: {
        enabled?: boolean;
    };
    name?: string;
    protection_url?: string;
    required_signatures?: {
        url: string;
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

