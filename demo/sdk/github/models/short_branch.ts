/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { branch_protection } from './branch_protection';
/**
 * Short Branch
 */
export type short_branch = {
    name: string;
    commit: {
        sha: string;
        url: string;
    };
    protected: boolean;
    protection?: branch_protection;
    protection_url?: string;
};

