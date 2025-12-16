/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { branch_protection } from './branch_protection';
import type { commit } from './commit';
/**
 * Branch With Protection
 */
export type branch_with_protection = {
    name: string;
    commit: commit;
    _links: {
        html: string;
        self: string;
    };
    protected: boolean;
    protection: branch_protection;
    protection_url: string;
    pattern?: string;
    required_approving_review_count?: number;
};

