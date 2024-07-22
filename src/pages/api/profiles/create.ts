import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/modules/mongodb";
import { isEmailValid } from "lual-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Missing name or email" });
  }

  if (!isEmailValid(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  if (name.length < 3) {
    return res.status(400).json({ error: "Name is too short" });
  }

  try {
    await client.connect();
    const youtubeDb = client.db("youtube");

    const insertedProfile = await youtubeDb.collection("profiles").insertOne({
      name,
      email,
    });

    console.log(insertedProfile);

    return res.status(201).json({
      message: "created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ name: "Internal server error" });
  }
}
