import { MongoClient } from "mongodb";

let url = "mongodb://localhost:27017/roxiler-db";
let clientInstance;
export const connectToDatabase = () => {
  MongoClient.connect(url)
    .then((client) => {
      clientInstance = client;
      console.log("Database connected successfully!");
    })
    .catch((error) => {
      console.log("connection to database failed!" + "\n" + error);
    });
};

export const getDB = async () => {
  return await clientInstance.db();
};
