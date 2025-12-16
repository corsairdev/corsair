/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { enterprise } from './enterprise';
import type { simple_user } from './simple_user';
/**
 * GitHub apps are a new way to extend GitHub. They can be installed directly on organizations and user accounts and granted access to specific repositories. They come with granular permissions and built-in webhooks. GitHub apps are first class actors within GitHub.
 */
export type nullable_integration = {
    /**
     * Unique identifier of the GitHub app
     */
    id: number;
    /**
     * The slug name of the GitHub app
     */
    slug?: string;
    node_id: string;
    client_id?: string;
    owner: (simple_user | enterprise);
    /**
     * The name of the GitHub app
     */
    name: string;
    description: string | null;
    external_url: string;
    html_url: string;
    created_at: string;
    updated_at: string;
    /**
     * The set of permissions for the GitHub app
     */
    permissions: Record<string, string>;
    /**
     * The list of events for the GitHub app. Note that the `installation_target`, `security_advisory`, and `meta` events are not included because they are global events and not specific to an installation.
     */
    events: Array<string>;
    /**
     * The number of installations associated with the GitHub app. Only returned when the integration is requesting details about itself.
     */
    installations_count?: number;
};

