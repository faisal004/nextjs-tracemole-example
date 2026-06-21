import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;
const options = {};

const clientPromise: Promise<MongoClient> = uri
  ? new MongoClient(uri, options).connect()
  : Promise.reject(new Error("Please add your Mongo URI to .env.local"));

export default clientPromise;
