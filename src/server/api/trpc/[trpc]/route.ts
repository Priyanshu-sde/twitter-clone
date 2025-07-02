// src/app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

// This handler is responsible for taking incoming HTTP requests
// and forwarding them to your tRPC appRouter.
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc", // This defines the public URL path for your tRPC API
    req,
    router: appRouter, // This is your main tRPC router defined in ~/server/api/root.ts
    createContext: createTRPCContext, // This creates the tRPC context for each request
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  });

// Export the handler for GET and POST requests.
// tRPC typically uses POST for mutations and GET for queries.
export { handler as GET, handler as POST };