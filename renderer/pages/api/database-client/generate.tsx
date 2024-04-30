import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
// import { OpenAIError } from "@/utils/DevGPT/server";
import { corsConfig } from "../../../utils/cors";
import { getCompletions } from "../../../utils/api";
import { DataSourceConnectionFactory } from "../../../utils/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, corsConfig);

  const { method } = req;
  if (method === "OPTIONS") {
    res.setHeader("Allow", "POST");
    return res.status(200).send("ok");
  }

  //   const { identifier, isAuthenticated, isPurchased } = await getUserDetails(
  //     req
  //   );
  //   const success = await rateLimit(identifier, isAuthenticated, isPurchased);
  //   if (!success) {
  //     return new Response(rateLimitMessage, rateLimitBody);
  //   }

  const { messages, databaseDetails, cookie, connectionString } = req.body;
  try {
    console.log(databaseDetails);
    console.log(req.body);

    // Create a data source connection based on the connection string
    const dataSourceConnection =
      DataSourceConnectionFactory.createDataSourceConnection(connectionString);

    // Generate the system prompt based on the database type
    const systemPrompt = dataSourceConnection.generateQuery(databaseDetails);

    const openAIResponse = await getCompletions(systemPrompt, messages);
    const result = await openAIResponse.json();
    return res.status(200).json(result);
  } catch (error) {
    if (error) {
      console.log("Error from OpenAI: ", { error });
      return res
        .status(500)
        .json(
          `You might have exceeded the ratelimit. Please try again after some time.`
        );
    } else {
      console.log("Unknown error:", { error });
      return new Response(
        "Unknown error occured. Please try again after some time or drop an email to harsh@getdevkit.com.",
        { status: 500 }
      );
    }
  }
}
