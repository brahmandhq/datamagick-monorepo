import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

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
    const { userEmail } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { teams: true },
    });
    if (!user) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "User not found" });
    }

    const teamConnectionInfo = await Promise.all(
      user.teams.map(async (team) => {
        const connectionInfo = await prisma.teamConnectionInfo.findMany({
          where: { teamId: team.id },
        });
        return { teamId: team.id, teamName: team.name, connectionInfo };
      })
    );

    if (teamConnectionInfo.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "No team connection information found",
      });
    }

    return res.status(200).json({ teamConnectionInfo });
  } catch (error) {
    console.error("Error fetching team connection information:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch team connection information",
    });
  }
}
