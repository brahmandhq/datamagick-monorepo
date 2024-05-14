import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type RequestBody = {
    id: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "DELETE") {
        const { id } = req.body as RequestBody;
        try {
            const dbInfo = await prisma.connectionInfo.delete({
                where: {
                    id: id,
                }
            });
            console.log("Deleted Database Info: ", dbInfo)
            return res.status(200).json({ success: true });
        } catch (error) {
            console.log("Database Deletion Error: ", error)
            return res.status(500).json({ error: error.message || 'Something went wrong.' });
        }
    } else {
        res.setHeader('Allow', 'DELETE')
        res.status(405).json({ error: 'Method Not Allowed' })
    }
}