import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

import { uid } from 'uid';

import { getUserDetails } from './utils/rate-limit';

export async function middleware(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { identifier, isAuthenticated, isPurchased } =
            await getUserDetails(req);

        //@ts-ignore
        const { pathname } = req.nextUrl;

        if (isAuthenticated && pathname === '/') {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        const insertId = uid(32) + '-' + new Date().getTime();

        const jsonEvents = [
            {
                event: 'Page Visit or API Request',
                properties: {
                    //@ts-ignore
                    time: new Date().getTime(),
                    distinct_id: identifier,
                    $insert_id: insertId,
                    pathname,
                    isAuthenticated,
                    is_production: process?.env?.NEXT_PUBLIC_IS_PRODUCTION
                        ? true
                        : false,
                    isProUser: isPurchased,
                },
            },
        ];

        const resp = await fetch(
            `https://api.mixpanel.com/import?strict=1&project_id=${process.env.MIXPANEL_PROJECT_ID}`,
            {
                method: 'POST',
                headers: {
                    authorization: `Basic ${process.env.MIXPANEL_SERVICE_ACCOUNT_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonEvents),
            },
        );
    } catch (e) {
        console.log('Middleware error', e);
    }
}

export const config = { matcher: '/((?!.*\\.).*)' };
