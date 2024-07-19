import express from "express";
import ItemController from "./items.controller.js";

let itemRouter = express();

//controller class
let controller = new ItemController();

//  .../api/item/

itemRouter.get("/", (req, res) => {
  controller.initializeDB(req, res);
});

//filter
itemRouter.get("/filter/:month/", (req, res) => {
  controller.filter(req, res);
});

itemRouter.get("/statistics/:month/", (req, res) => {
  controller.statisticsByMonth(req, res);
});

itemRouter.get("/price-bar/:month/", (req, res) => {
  controller.representAsBar(req, res);
});

itemRouter.get("/filter-category/:month/", (req, res) => {
  controller.filterCategory(req, res);
});

//todo
itemRouter.get("/combination/:month/", (req, res) => {
  controller.statisticsByMonth(req, res);
});


export default itemRouter;