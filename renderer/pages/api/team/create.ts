import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { name, createdBy, members = [] } = req.body;
      const allMembers = [...members, createdBy];
      const team = await prisma.team.create({
        data: {
          name: name,
          user: {
            connect: { email: createdBy },
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
