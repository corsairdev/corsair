import dotenv from 'dotenv'
dotenv.config({ path: '../.env' });
import type { FacebookPageSchema } from "../schema/database";
import { InstagramAPIError } from "../client";

export const GetFacebookPages = async (accessToken: string, input: string, pageId: string): Promise<FacebookPageSchema> => {
    const params = new URLSearchParams({
        fields: input,
        access_token: accessToken,
    });

    const response = await fetch(
        `${process.env.BASE_ENDPOINT}/${process.env.META_API_VERSION}/${pageId}?${params.toString()}`,
    );

    if (!response.ok) {
        const errorBody: any = await response.json();

        throw new InstagramAPIError(
            errorBody?.error?.message,
            errorBody?.error?.code
        );
    }

    const result = await response.json() as FacebookPageSchema;

    return result;
}