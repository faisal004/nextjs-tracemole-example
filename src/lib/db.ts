import clientPromise from "@/lib/mongodb";
import { COLLECTION_NAME, DB_NAME } from "@/lib/constants";
import type { Collection, Document } from "mongodb";

export async function getCollection<T extends Document = Document>() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<T>(COLLECTION_NAME);
}

export async function getCollectionCount() {
  const collection = await getCollection();
  return collection.countDocuments();
}
