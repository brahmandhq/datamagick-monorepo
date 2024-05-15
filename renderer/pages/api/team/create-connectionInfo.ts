import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed",
      message: "This endpoint only supports POST requests",
    });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    const { name, connectionString, db, dbData, teamId } = req.body;

    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Team not found" });
    }

    const createdTeamConnectionInfo = await prisma.teamConnectionInfo.create({
      data: {
        name,
        db,
        dbData,
        createdBy: session.user.email,
        team: { connect: { id: team.id } },
      },
    });

    return res.status(201).json(createdTeamConnectionInfo);
  } catch (error) {
    console.error("Error creating Team Connection Info:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to create Team Connection Info",
    });
  }
}
