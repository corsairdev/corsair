/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { webhook_config_content_type } from './webhook_config_content_type';
import type { webhook_config_insecure_ssl } from './webhook_config_insecure_ssl';
import type { webhook_config_secret } from './webhook_config_secret';
import type { webhook_config_url } from './webhook_config_url';
/**
 * Configuration object of the webhook
 */
export type webhook_config = {
    url?: webhook_config_url;
    content_type?: webhook_config_content_type;
    secret?: webhook_config_secret;
    insecure_ssl?: webhook_config_insecure_ssl;
};

