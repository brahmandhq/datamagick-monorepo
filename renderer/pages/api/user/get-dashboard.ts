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
    const { createdBy } = req.body;
    const dashboardTabs = await prisma.dashboardTab.findMany({
      where: {
        createdBy: createdBy as string,
      },
      include: {
        savedQueries: true,
      },
    });

    return res.status(200).json(dashboardTabs);
  } catch (error) {
    console.error("Error fetching DashboardTabs:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch DashboardTabs",
    });
  }
}
