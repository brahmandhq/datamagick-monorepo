import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const session = await getServerSession(req, res, authOptions);
      const { name, members = [] } = req.body;
      const allMembers = [...members, session?.user?.email];
      const team = await prisma.team.create({
        data: {
          name: name,
          user: {
            connect: { email: session?.user?.email },
          },
          members: {
            connectOrCreate: allMembers.map((email) => ({
              where: { email },
              create: { email },
            })),
          },
        },
        include: {
          members: true,
        },
      });
      const teamWithoutBigInt = {
        ...team,
        members: team.members.map((member) => ({
          ...member,
          id: member.id.toString(),
        })),
      };
      return res.status(200).json({ teamWithoutBigInt });
    } catch (error) {
      console.log("Database Creation Error: ", error);
      return res
        .status(500)
        .json({ error: error.message || "Something went wrong." });
    }
  }
}
