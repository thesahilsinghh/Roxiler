import app from "./index.js";
import { connectToDatabase } from "./src/config/database.js";
app.listen(3200, () => {
  console.log("Server listens on 3200.");
  connectToDatabase();
});
