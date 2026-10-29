import {
	sendEnterpriseContactNotification,
	submitEnterpriseContactSchema,
} from '@/server/enterprise-contact';

import { createTRPCRouter, publicProcedure } from '../trpc';

export const contactRouter = createTRPCRouter({
	submitEnterpriseContact: publicProcedure
		.input(submitEnterpriseContactSchema)
		.mutation(async ({ input }) => {
			return sendEnterpriseContactNotification(input);
		}),
});
