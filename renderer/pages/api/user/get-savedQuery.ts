import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { email } = req.body;
      const savedQueries = await prisma.savedQuery.findMany({
        where: { createdBy: String(email) },
      });
      return res.status(200).json(savedQueries);
    } catch (error) {
      console.error("Error fetching saved queries:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
