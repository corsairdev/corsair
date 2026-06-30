import { messageReceived } from "./messages";
import { url_verification } from "./challenge";
import { comments } from "./comments";

export const InstagramWebhooks = {
    messageReceived,
    url_verification,
    comments,
};

export * from './types';