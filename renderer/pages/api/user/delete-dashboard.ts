import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res
      .status(405)
      .json({
        error: "Method Not Allowed",
        message: "This endpoint only supports DELETE requests",
      });
  }

  try {
    const { id } = req.body;
    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({
          error: "Bad Request",
          message: "Invalid or missing DashboardTab ID",
        });
    }
    await prisma.dashboardTab.delete({
      where: {
        id: id,
      },
    });
    return res
      .status(200)
      .json({ message: "DashboardTab deleted successfully" });
  } catch (error) {
    console.error("Error deleting DashboardTab:", error);
    return res
      .status(500)
      .json({
        error: "Internal Server Error",
        message: "Failed to delete DashboardTab",
      });
  }
}
