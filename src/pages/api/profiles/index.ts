import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/modules/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await client.connect();
    const youtubeDb = client.db("youtube");

    const profiles = await youtubeDb.collection("profiles").find({}).toArray();

    console.log(profiles);

    return res.status(200).json({
      profiles,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ name: "Internal server error" });
  }
}
