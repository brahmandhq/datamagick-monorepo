import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { teamId, userEmail } = req.body;
      const isMember = await prisma.team.findFirst({
        where: {
          id: teamId,
          members: {
            some: {
              email: userEmail,
            },
          },
        },
      });

      if (!isMember) {
        return res.status(403).json({
          error: "Forbidden",
          message: "User is not a member of the team",
        });
      }
      const team = await prisma.team.findUnique({
        where: {
          id: teamId,
        },
        include: {
          members: true,
          TeamConnectionInfo: true,
        },
      });

      if (!team) {
        return res
          .status(404)
          .json({ error: "Not Found", message: "Team not found" });
      }
      const teamWithoutBigInt = {
        ...team,
        members: team.members.map((member) => ({
          ...member,
          id: member.id.toString(),
        })),
        TeamConnectionInfo: team.TeamConnectionInfo.map((connection) => ({
          ...connection,
          id: connection.id.toString(),
        })),
      };
      return res.status(200).json({ team: teamWithoutBigInt });
    } catch (error) {
      console.error("Error fetching team details:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to fetch team details",
      });
    }
  } else {
    return res.status(405).json({
      error: "Method Not Allowed",
      message: "This endpoint only supports POST requests",
    });
  }
}
