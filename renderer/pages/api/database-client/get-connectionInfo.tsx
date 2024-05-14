import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '../auth/[...nextauth]';
import { getServerSession } from 'next-auth';
// import { getSession } from "next-auth/react";
const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        try {
            const { email } = req.body
            const data = await prisma.connectionInfo.findMany(
                {
                    where: {
                        createdBy: String(email)
                    }
                }
            );
            res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            res.status(500).json({ error: 'Something went wrong.' });
        }
    } else {
        res.setHeader('Allow', 'GET')
        res.status(405).json({ error: 'Method Not Allowed' })
    }
}
