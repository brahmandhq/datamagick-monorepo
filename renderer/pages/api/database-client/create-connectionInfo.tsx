import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type RequestBody = {
    name: string,
    db: string,
    dbData: string[],
    email: string
}



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const { name, db, dbData, email } = req.body as RequestBody;

        try {
            const dbInfo = await prisma.connectionInfo.create({
                data: {
                    name: name,
                    db: db,
                    dbData: dbData,
                    createdBy: email,
                },
            });
            console.log("Database Info: ", dbInfo)
            return res.status(200).json({ dbInfo });
        } catch (error) {
            console.log("Database Creation Error: ", error)
            return res.status(500).json({ error: error.message || 'Something went wrong.' });
        }
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).json({ error: 'Method Not Allowed' })
    }
}
