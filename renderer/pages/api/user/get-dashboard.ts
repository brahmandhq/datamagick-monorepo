import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method Not Allowed",
      message: "This endpoint only supports GET requests",
    });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    const dashboardTabs = await prisma.dashboardTab.findMany({
      where: {
        createdBy: session?.user?.email,
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
