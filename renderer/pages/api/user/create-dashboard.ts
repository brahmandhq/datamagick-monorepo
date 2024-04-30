import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { name, userEmail } = req.body;
      const createdTab = await prisma.dashboardTab.create({
        data: {
          name,
          createdBy: userEmail,
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
