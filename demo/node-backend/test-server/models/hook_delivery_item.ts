/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Delivery made by a webhook, without request and response information.
 */
export type hook_delivery_item = {
    /**
     * Unique identifier of the webhook delivery.
     */
    id: number;
    /**
     * Unique identifier for the event (shared with all deliveries for all webhooks that subscribe to this event).
     */
    guid: string;
    /**
     * Time when the webhook delivery occurred.
     */
    delivered_at: string;
    /**
     * Whether the webhook delivery is a redelivery.
     */
    redelivery: boolean;
    /**
     * Time spent delivering.
     */
    duration: number;
    /**
     * Describes the response returned after attempting the delivery.
     */
    status: string;
    /**
     * Status code received when delivery was made.
     */
    status_code: number;
    /**
     * The event that triggered the delivery.
     */
    event: string;
    /**
     * The type of activity for the event that triggered the delivery.
     */
    action: string | null;
    /**
     * The id of the GitHub App installation associated with this event.
     */
    installation_id: number | null;
    /**
     * The id of the repository associated with this event.
     */
    repository_id: number | null;
    /**
     * Time when the webhook delivery was throttled.
     */
    throttled_at?: string | null;
};

