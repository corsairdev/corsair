/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type pages_deployment_status = {
    /**
     * The current status of the deployment.
     */
    status?: pages_deployment_status.status;
};
export namespace pages_deployment_status {
    /**
     * The current status of the deployment.
     */
    export enum status {
        DEPLOYMENT_IN_PROGRESS = 'deployment_in_progress',
        SYNCING_FILES = 'syncing_files',
        FINISHED_FILE_SYNC = 'finished_file_sync',
        UPDATING_PAGES = 'updating_pages',
        PURGING_CDN = 'purging_cdn',
        DEPLOYMENT_CANCELLED = 'deployment_cancelled',
        DEPLOYMENT_FAILED = 'deployment_failed',
        DEPLOYMENT_CONTENT_FAILED = 'deployment_content_failed',
        DEPLOYMENT_ATTEMPT_ERROR = 'deployment_attempt_error',
        DEPLOYMENT_LOST = 'deployment_lost',
        SUCCEED = 'succeed',
    }
}

