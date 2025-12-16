/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { link_with_type } from './link_with_type';
/**
 * Feed
 */
export type feed = {
    timeline_url: string;
    user_url: string;
    current_user_public_url?: string;
    current_user_url?: string;
    current_user_actor_url?: string;
    current_user_organization_url?: string;
    current_user_organization_urls?: Array<string>;
    security_advisories_url?: string;
    /**
     * A feed of discussions for a given repository.
     */
    repository_discussions_url?: string;
    /**
     * A feed of discussions for a given repository and category.
     */
    repository_discussions_category_url?: string;
    _links: {
        timeline: link_with_type;
        user: link_with_type;
        security_advisories?: link_with_type;
        current_user?: link_with_type;
        current_user_public?: link_with_type;
        current_user_actor?: link_with_type;
        current_user_organization?: link_with_type;
        current_user_organizations?: Array<link_with_type>;
        repository_discussions?: link_with_type;
        repository_discussions_category?: link_with_type;
    };
};

