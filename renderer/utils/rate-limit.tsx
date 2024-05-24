import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getToken } from "next-auth/jwt";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const ratelimitUnauthenticated = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "60 s"),
});

export const ratelimitAuthenticated = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "60 s"),
});

export const rateLimitProUser = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
});

export const rateLimit = async (
  identifier: string,
  isAuthenticated: boolean,
  isPurchased: boolean
) => {
  if (isPurchased) {
    const response = await rateLimitProUser.limit(identifier);
    return response?.success;
  } else if (isAuthenticated) {
    const response = await ratelimitAuthenticated.limit(identifier);
    return response?.success;
  }
  const response = await ratelimitUnauthenticated.limit(identifier);
  return response?.success;
};

export const getIdentifierFromCookies = (cookies: any): string | null => {
  try {
    return cookies.get("hello").value;
  } catch (e) {
    return "0.0.0.0";
  }
};

export const getUserStatus = (
  token: any
): { isAuthenticated: boolean; isPurchased: boolean } => {
  const email = token?.email;
  const isAuthenticated = Boolean(email);
  const isPurchased = Boolean(token?.subId);
  return {
    isAuthenticated,
    isPurchased,
  };
};

export const getUserDetails = async (
  req: any
): Promise<{
  identifier: string;
  isAuthenticated: boolean;
  isPurchased: boolean;
}> => {
  const token = await getToken({ req });
  const { isAuthenticated, isPurchased } = getUserStatus(token);

  let localUUIDIdentifier = getIdentifierFromCookies(req?.cookies);
  const email = token?.email;
  const identifier = isAuthenticated ? email : localUUIDIdentifier;
  return {
    identifier,
    isAuthenticated,
    isPurchased,
  };
};

export const rateLimitMessage =
  "Too many requests. Users on the free plan are limited to 2 requests per minute. Please try again after some time or upgrade your account.";
export const rateLimitBody = {
  status: 429,
};
