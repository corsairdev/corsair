export type PagesResponse = {
    data: {
        id: string;
        name: string;

        instagram_business_account?: {
            id: string;
        };
    }[];
};