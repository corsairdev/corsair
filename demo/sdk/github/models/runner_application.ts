/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Runner Application
 */
export type runner_application = {
    os: string;
    architecture: string;
    download_url: string;
    filename: string;
    /**
     * A short lived bearer token used to download the runner, if needed.
     */
    temp_download_token?: string;
    sha256_checksum?: string;
};

