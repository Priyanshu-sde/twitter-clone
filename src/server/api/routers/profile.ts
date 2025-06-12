import type { Prisma } from "@prisma/client";
import type { inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  createTRPCContext,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
    getById: publicProcedure.input(z.object({id: z.string()})).query(async({
        input: {id},ctx
    }) => {
        const currentUserId = ctx.session?.user.id;
        const profile = await ctx.db.user.findUnique({
            where: {id},
            select: {
                name : true,
                image: true,
                _count: {select :{followers:true, follows: true, tweet: true}},
                followers:
                currentUserId == null ? undefined : {where : {id:currentUserId}},
            },
        });

        if(profile == null)return 
        return {
            name: profile.name,
            image: profile.image,
            followersCount: profile._count.followers,
            followsCount: profile._count.follows,
            tweetsCount: profile._count.tweet,
            isFollowing : profile.followers.length > 0
        }
    }),
});