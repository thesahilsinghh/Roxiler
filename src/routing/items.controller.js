import ItemRepo from "./items.repository.js";

export default class ItemController {
  itemRepo = new ItemRepo();
  async initializeDB(req, res) {
    try {
      const response = await fetch(
        "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
      );
      const data = await response.json(); // Assuming the response is JSON
      await this.itemRepo.addMany(data);
      res.status(201).send("Database initialized successfully!");
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error! please try again later");
    }
  }

  async filter(req, res) {
    //to return transaction based on params or pagination values
    try {
      let month = req.params.month;
      let { title, description, price } = req.query;
      let data = await this.itemRepo.filter(month, title, description, price);
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send("Internal Server Error! please try again later");
    }
  }

  async statisticsByMonth(req, res) {
    try {
      let month = req.params.month;
      let data = await this.itemRepo.saleInfo(month);
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error! please try again later");
    }
  }

  async representAsBar(req, res) {
    // - 0 - 100
    // - 101 - 200
    // - 201-300
    // - 301-400
    // - 401-500
    // - 501 - 600
    // - 601-700
    // - 701-800
    // - 801-900
    // - 901-above
    try {
      let { month } = req.params;
      let data = await this.itemRepo.priceRange(month);
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send("Internal Server Error! please try again later");
    }
  }
  async filterCategory(req, res) {
    // - X category : 20 (items)
    // - Y category : 5 (items)
    // - Z category : 3 (items)
    try {
      let { month } = req.params;
      let data = await this.itemRepo.categoryByMonth(month);
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error! please try again later");
    }
  }

  //todo
  async combinedFilter(req, res) {
    //fetches the data from all the 3 APIs mentioned above, combines the response and sends a final response of the combined JSON
    try {
      let stat = await controller.statisticsByMonth(req.params.month);
      let priceBar = await controller.representAsBar(req.params.month);
      let cate = await controller.filterCategory(req.params.month);

      let combinedData = {
        Sales_statistics: stat,
        Price_Bar: priceBar,
        Category: cate,
      };
      res.status(200).send(combinedData);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error! please try again later");
    }
  }
}
