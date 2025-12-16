/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Delivery made by a webhook.
 */
export type hook_delivery = {
    /**
     * Unique identifier of the delivery.
     */
    id: number;
    /**
     * Unique identifier for the event (shared with all deliveries for all webhooks that subscribe to this event).
     */
    guid: string;
    /**
     * Time when the delivery was delivered.
     */
    delivered_at: string;
    /**
     * Whether the delivery is a redelivery.
     */
    redelivery: boolean;
    /**
     * Time spent delivering.
     */
    duration: number;
    /**
     * Description of the status of the attempted delivery
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
    /**
     * The URL target of the delivery.
     */
    url?: string;
    request: {
        /**
         * The request headers sent with the webhook delivery.
         */
        headers: Record<string, any> | null;
        /**
         * The webhook payload.
         */
        payload: Record<string, any> | null;
    };
    response: {
        /**
         * The response headers received when the delivery was made.
         */
        headers: Record<string, any> | null;
        /**
         * The response payload received.
         */
        payload: string | null;
    };
};

