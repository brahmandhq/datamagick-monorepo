import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { id, name, members } = req.body;
  try {
    if (!Array.isArray(members)) {
      return res.status(400).json({ error: "Invalid members" });
    }
    const existingTeam = await prisma.team.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!existingTeam) {
      return res.status(404).json({ error: "Team not found" });
    }
    const currentMembers = existingTeam.members.map((member) => member.email);
    const membersToAdd = members.filter(
      (email) => !currentMembers.includes(email)
    );
    const membersToRemove = currentMembers.filter(
      (email) => !members.includes(email)
    );
    const updatedTeam = await prisma.team.update({
      where: { id },
      data: {
        name,
        members: {
          connect: membersToAdd.map((email: string) => ({ email })),
          disconnect: membersToRemove.map((email: string) => ({ email })),
        },
      },
    });
    return res.status(200).json({ team: updatedTeam });
  } catch (error) {
    console.error("Error updating team:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
