import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Missing MONGODB_URI in environment variables.");

const options = {};

let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Prevent multiple connections during hot reload
  if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    globalThis._mongoClientPromise = client.connect();
  }
  clientPromise = globalThis._mongoClientPromise;
} else {
  // Always create a new client in production
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
