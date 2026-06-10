import { appRouter } from './root';
import { createCallerContext } from './trpc';

export async function getApi() {
	return appRouter.createCaller(await createCallerContext());
}
