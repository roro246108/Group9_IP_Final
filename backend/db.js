import mongoose from "mongoose";

function buildDirectAtlasUri(srvUri) {
  try {
    const parsed = new URL(srvUri);
    const username = encodeURIComponent(parsed.username);
    const password = encodeURIComponent(parsed.password);
    const database = parsed.pathname.replace(/^\//, "") || "hotel-booking";
    const query = new URLSearchParams(parsed.searchParams);

    query.set("retryWrites", query.get("retryWrites") || "true");
    query.set("w", query.get("w") || "majority");
    query.set("authSource", query.get("authSource") || "admin");
    query.set("replicaSet", query.get("replicaSet") || "atlas-rp6p7m-shard-0");
    query.set("tls", query.get("tls") || "true");

    return `mongodb://${username}:${password}@ac-isz4owi-shard-00-00.pw2k9z5.mongodb.net:27017,ac-isz4owi-shard-00-01.pw2k9z5.mongodb.net:27017,ac-isz4owi-shard-00-02.pw2k9z5.mongodb.net:27017/${database}?${query.toString()}`;
  } catch {
    return srvUri;
  }
}

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in backend/.env");
  }

  mongoose.set("bufferCommands", false);

  let configuredDbName = "hotel-booking";
  try {
    const parsed = new URL(process.env.MONGO_URI);
    configuredDbName = parsed.pathname.replace(/^\//, "") || "hotel-booking";
  } catch {
    configuredDbName = "hotel-booking";
  }

  try {
    const candidates = [
      process.env.MONGO_URI.startsWith("mongodb+srv")
        ? buildDirectAtlasUri(process.env.MONGO_URI)
        : process.env.MONGO_URI,
      process.env.MONGO_URI,
      "mongodb://127.0.0.1:27017/hotel-booking",
    ];

    let lastError = null;

    for (const uri of candidates) {
      if (!uri) continue;
      try {
        await mongoose.connect(uri, {
          dbName: configuredDbName,
          serverSelectionTimeoutMS: 10000,
        });
        console.log(`MongoDB connected successfully to ${mongoose.connection.name}`);
        return;
      } catch (error) {
        lastError = error;
        console.warn(`MongoDB connection failed for ${uri.startsWith("mongodb+srv") ? "Atlas" : "local"} URI:`, error.message);
      }
    }

    throw lastError || new Error("Unable to connect to MongoDB");
  } catch (error) {
    console.error("DB connection error:", error.message);
    throw error;
  }
};

export default connectDB;
