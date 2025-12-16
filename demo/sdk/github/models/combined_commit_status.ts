/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { minimal_repository } from './minimal_repository';
import type { simple_commit_status } from './simple_commit_status';
/**
 * Combined Commit Status
 */
export type combined_commit_status = {
    state: string;
    statuses: Array<simple_commit_status>;
    sha: string;
    total_count: number;
    repository: minimal_repository;
    commit_url: string;
    url: string;
};

