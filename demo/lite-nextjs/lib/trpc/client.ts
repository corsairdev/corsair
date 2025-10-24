"use client";

import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "./root";

export const trpc = createTRPCReact<AppRouter>();
