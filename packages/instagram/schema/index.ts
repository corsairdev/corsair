import { z } from "zod";

import { 
    InstagramUser,
    InstagramMedia,
    InstagramComment,
    FacebookPageSchema,
    InstagramConversation,
    InstagramMessage
} from "./database";


export const InstagramCredentials = z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    accessToken: z.string()
});

export type InstagramCredentials = z.infer<typeof InstagramCredentials>;

export const InstagramSchema = {
    version: '1.0.0',
    entities: {
        users: InstagramUser,
        media: InstagramMedia,
        comments: InstagramComment,
        pages: FacebookPageSchema,
        conversations: InstagramConversation,
        messages: InstagramMessage
    }
} as const;