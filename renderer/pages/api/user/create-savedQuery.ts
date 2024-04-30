import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const {
        prompt,
        chartPrompt,
        query,
        name,
        chartX,
        chartY,
        chartType,
        connectResponse,
        isSuccessfulConnect,
        createdBy,
      } = req.body;
      console.log("here", req.body);
      const savedQuery = await prisma.savedQuery.create({
        data: {
          prompt,
          chartPrompt,
          query,
          name,
          chartX,
          chartY,
          chartType,
          connectResponse,
          isSuccessfulConnect,
          createdBy,
        },
      });

      return res.status(201).json(savedQuery);
    } catch (error) {
      console.error("Error creating saved query:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to create saved query",
      });
    }
  }
}
