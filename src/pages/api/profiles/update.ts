import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/modules/mongodb";
import { isEmailValid } from "lual-utils";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, name, email } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing profile id" });
  }

  if (!name) {
    return res.status(400).json({ error: "Missing name or email" });
  }

  if (name.length < 3) {
    return res.status(400).json({ error: "Name is too short" });
  }

  if (email && !isEmailValid(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  let newProfile: {
    name: string;
    email?: string;
  } = {
    name,
  };

  if (email) {
    newProfile.email = email;
  }

  try {
    await client.connect();
    const youtubeDb = client.db("youtube");

    const updatedProfile = await youtubeDb
      .collection("profiles")
      .updateOne({ _id: new ObjectId(id) }, { $set: newProfile });

    console.log(updatedProfile);

    return res.status(200).json({
      message: "updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ name: "Internal server error" });
  }
}
