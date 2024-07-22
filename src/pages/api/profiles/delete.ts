import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/modules/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing profile id" });
  }

  try {
    await client.connect();
    const youtubeDb = client.db("youtube");

    const deletedProfile = await youtubeDb
      .collection("profiles")
      .deleteOne({ _id: new ObjectId(id) });

    console.log(deletedProfile);

    return res.status(200).json({
      message: "deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ name: "Internal server error" });
  }
}
