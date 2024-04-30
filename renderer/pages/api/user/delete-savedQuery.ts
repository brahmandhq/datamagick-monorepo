import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: "ID parameter is required" });
      }
      const existingQuery = await prisma.savedQuery.findUnique({
        where: { id },
      });
      if (!existingQuery) {
        return res.status(404).json({ error: "Saved query not found" });
      }
      await prisma.savedQuery.delete({ where: { id } });

      return res
        .status(200)
        .json({ message: "Saved query deleted successfully" });
    } catch (error) {
      console.error("Error deleting saved query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
