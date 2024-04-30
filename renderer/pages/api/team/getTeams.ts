// pages/api/getTeams.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // const session = await getSession({ req });
    // if (!session) {
    //   return res.status(401).json({ error: "Unauthorized" });
    // }
    // console.log(session);
    const { userEmail } = req.body;
    const userTeams = await prisma.team.findMany({
      where: {
        OR: [
          { createdBy: userEmail },
          { members: { some: { email: userEmail } } },
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
