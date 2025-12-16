/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { nullable_simple_user } from './nullable_simple_user';
/**
 * Data related to a release.
 */
export type release_asset = {
    url: string;
    browser_download_url: string;
    id: number;
    node_id: string;
    /**
     * The file name of the asset.
     */
    name: string;
    label: string | null;
    /**
     * State of the release asset.
     */
    state: release_asset.state;
    content_type: string;
    size: number;
    digest: string | null;
    download_count: number;
    created_at: string;
    updated_at: string;
    uploader: nullable_simple_user;
};
export namespace release_asset {
    /**
     * State of the release asset.
     */
    export enum state {
        UPLOADED = 'uploaded',
        OPEN = 'open',
    }
}

