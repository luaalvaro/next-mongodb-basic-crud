import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/modules/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await client.connect();
    const dbSampleMflix = client.db("sample_mflix");

    const movies = await dbSampleMflix
      .collection("movies")
      .find({})
      .sort({
        metacritic: -1,
      })
      .limit(10)
      .toArray();

    console.log(movies);

    return res.status(200).json({
      movies: movies,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ name: "Internal server error" });
  }
}
