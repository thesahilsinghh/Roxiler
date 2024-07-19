import express from "express";
import itemRouter from "./src/routing/items.route.js";
let app = express();

app.use("/api/items/", itemRouter);

export default app;
