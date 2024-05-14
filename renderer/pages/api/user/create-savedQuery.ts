import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
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
          createdBy: session?.user?.email,
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
