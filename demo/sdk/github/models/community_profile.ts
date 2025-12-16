/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { nullable_code_of_conduct_simple } from './nullable_code_of_conduct_simple';
import type { nullable_community_health_file } from './nullable_community_health_file';
import type { nullable_license_simple } from './nullable_license_simple';
/**
 * Community Profile
 */
export type community_profile = {
    health_percentage: number;
    description: string | null;
    documentation: string | null;
    files: {
        code_of_conduct: nullable_code_of_conduct_simple;
        code_of_conduct_file: nullable_community_health_file;
        license: nullable_license_simple;
        contributing: nullable_community_health_file;
        readme: nullable_community_health_file;
        issue_template: nullable_community_health_file;
        pull_request_template: nullable_community_health_file;
    };
    updated_at: string | null;
    content_reports_enabled?: boolean;
};

