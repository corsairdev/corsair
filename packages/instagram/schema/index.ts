import { z } from "zod";

import { 
    InstagramUser,
    InstagramMedia,
    // InstagramComment,
    InstagramConversation,
    InstagramMessage,
    FacebookUser,
    FacebookPages
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
        facebook: FacebookUser,
        users: InstagramUser,
        conversations: InstagramConversation,
        messages: InstagramMessage,
        pages: FacebookPages,
        media: InstagramMedia
    }
} as const;