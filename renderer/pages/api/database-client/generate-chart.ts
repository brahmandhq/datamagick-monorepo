import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

import axios from "axios";

// import { OpenAIError } from "@/utils/DevGPT/server";
import { getCompletions } from "@/utils/api";
import { corsConfig } from "@/utils/cors";
import { DataSourceConnectionFactory } from "@/utils/database";
// import {
//   getUserDetails,
//   rateLimit,
//   rateLimitBody,
//   rateLimitMessage,
// } from "@/utils/rate-limit";

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
  // const success = await rateLimit(identifier, isAuthenticated, isPurchased);
  // if (!success) {
  //     return res.status(429).json({ message: rateLimitMessage });
  // }

  const { messages, databaseDetails, cookie, connectionString, query } =
    req.body;
  try {
    console.log(databaseDetails);
    console.log(req.body);

    const finalQuery = await axios.post(
      `http://localhost:3000/api/database-client/generate`,
      {
        messages: [{ role: "user", content: messages[0].content }],
        databaseDetails,
        connectionString,
      }
    );

    const queryData = await axios.post(
      `http://localhost:3000/api/database-client/query`,
      {
        connectionString,
        query: finalQuery.data.choices[0].message.content,
      }
    );

    var results = queryData.data;
    if (!Array.isArray(results)) {
      results = String(results)
        .split("")
        .map((num) => {
          return Array(num);
        });
    }

    const dataSourceConnection =
      DataSourceConnectionFactory.createDataSourceConnection(connectionString);

    const systemPrompt = dataSourceConnection.generateChart(
      JSON.stringify(results),
      query
    );

    const openAIResponse = await getCompletions(systemPrompt, messages, true);

    const result = await openAIResponse.json();
    return res.status(200).json({
      query: finalQuery.data.choices[0].message.content,
      data: results,
      chart: result,
    });
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
      return res.status(500).json({
        message:
          "Unknown error occured. Please try again after some time or drop an email to harsh@getdevkit.com.",
      });
    }
  }
}
