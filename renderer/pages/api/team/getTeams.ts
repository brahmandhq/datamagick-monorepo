import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    const userTeams = await prisma.team.findMany({
      where: {
        OR: [
          { createdBy: session?.user?.email },
          { members: { some: { email: session?.user?.email } } },
        ],
      },
      include: {
        members: true,
      },
    });

    const teamsWithoutBigInt = userTeams.map((team) => ({
      ...team,
      id: team.id.toString(),
      members: team.members.map((member) => ({
        ...member,
        id: member.id.toString(),
      })),
    }));

    return res.status(200).json({ teams: teamsWithoutBigInt });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
