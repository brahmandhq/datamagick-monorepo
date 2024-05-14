import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        res
          .status(401)
          .json({ error: "You should be logged in to create dashboard" });
        return;
      }
      const { name } = req.body;
      const createdTab = await prisma.dashboardTab.create({
        data: {
          name,
          createdBy: session?.user?.email,
        },
      });

      return res.status(200).json({
        message: "Dashboard tab created successfully",
        tab: createdTab,
      });
    } catch (error) {
      console.error("Error creating dashboard tab:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
