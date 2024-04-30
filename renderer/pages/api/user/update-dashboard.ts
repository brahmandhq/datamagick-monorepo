import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
      const { tabId, savedQueryId, userEmail } = req.body;
      const tab = await prisma.dashboardTab.findFirst({
        where: {
          AND: [{ id: tabId }, { createdBy: userEmail }],
        },
      });
      if (!tab) {
        return res
          .status(404)
          .json({ error: "Not Found", message: "Dashboard tab not found" });
      }

      const updatedTab = await prisma.dashboardTab.update({
        where: { id: tabId },
        data: {
          savedQueries: {
            connect: { id: savedQueryId },
          }, // connect multiple saved queries
        },
      });

      return res.status(200).json({
        message: "Dashboard tab updated successfully",
        tab: updatedTab,
      });
    } catch (error) {
      console.error("Error updating dashboard tab:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
